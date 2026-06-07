"use client";

import { useState, useCallback, useRef, useEffect } from "react";

export type MediaPermissionType = "screen" | "camera" | "microphone";
type RecordingType = MediaPermissionType;

export type MediaPermissionStatus = "pending" | "granted" | "denied";

export interface MediaPermissionState {
  screen: MediaPermissionStatus;
  camera: MediaPermissionStatus;
  microphone: MediaPermissionStatus;
}

export interface MediaPermissionsResult {
  /** Individual permission states */
  permissions: MediaPermissionState;
  /** True when all three permissions are granted */
  allGranted: boolean;
  /** Current error message from the last failed request */
  error: string | null;
  /** Which permission the current error relates to */
  errorPermission: MediaPermissionType | null;
  /** Requests all three permissions sequentially (screen → camera → mic) */
  requestAll: () => Promise<boolean>;
  /** Stops all active media streams and resets all permissions to pending */
  stopAll: () => void;
  /** Dismiss the current error without losing already-granted permissions */
  dismissError: () => void;
}

interface RecordingConfig {
  contestId: string;
  userId: string;
}

function mapDOMException(err: unknown, label: string): string {
  if (err instanceof DOMException) {
    if (
      err.name === "NotAllowedError" ||
      err.name === "PermissionDeniedError"
    ) {
      return `${label} permission was denied. You must allow access to participate.`;
    }
    if (err.name === "AbortError") {
      return `${label} request was cancelled. Please try again.`;
    }
    if (err.name === "NotFoundError") {
      return `${label} not found. Please check your device and try again.`;
    }
    if (err.name === "NotReadableError") {
      return `${label} is already in use by another application. Please close it and try again.`;
    }
    return `Failed to access ${label.toLowerCase()}. Please try again.`;
  }
  return `An unexpected error occurred while accessing ${label.toLowerCase()}. Please try again.`;
}

const MAX_RETRIES = 3;
const RETRY_BASE_MS = 1_000;

async function uploadChunk(
  blob: Blob,
  config: RecordingConfig,
  type: RecordingType,
  chunkIndex: number,
): Promise<void> {
  const timestamp = Date.now();

  const file = new File([blob], `chunk_${chunkIndex}.webm`, { type: blob.type });
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "meta",
    JSON.stringify({
      contestId: config.contestId,
      fileType: type,
      timestamp,
    }),
  );

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch("/api/recordings/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) return;

      const text = await res.text();
      console.error(
        `Failed to upload ${type} chunk ${chunkIndex} (attempt ${attempt}/${MAX_RETRIES}): ${res.status} ${text}`,
      );
    } catch (err) {
      console.error(
        `Error uploading ${type} chunk ${chunkIndex} (attempt ${attempt}/${MAX_RETRIES}):`,
        err,
      );
    }

    if (attempt < MAX_RETRIES) {
      const delay = RETRY_BASE_MS * 2 ** (attempt - 1);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

const CHUNK_INTERVAL_MS = 30_000;

const MIME_TYPES: Record<string, string> = {
  screen: "video/webm;codecs=vp9,opus",
  camera: "video/webm;codecs=vp9,opus",
  microphone: "audio/webm;codecs=opus",
};

function startRecorder(
  stream: MediaStream,
  config: RecordingConfig,
  type: RecordingType,
): MediaRecorder {
  const mimeType = MIME_TYPES[type];
  let recorder: MediaRecorder;

  if (MediaRecorder.isTypeSupported(mimeType)) {
    recorder = new MediaRecorder(stream, { mimeType });
  } else {
    const fallback = type === "microphone" ? "audio/webm" : "video/webm";
    recorder = new MediaRecorder(stream, { mimeType: fallback });
  }

  let chunkIndex = 0;

  recorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      const idx = chunkIndex++;
      uploadChunk(event.data, config, type, idx);
    }
  };

  recorder.start(CHUNK_INTERVAL_MS);
  return recorder;
}

export function useMediaPermissions(recordingConfig?: RecordingConfig | null): MediaPermissionsResult {
  const [permissions, setPermissions] = useState<MediaPermissionState>({
    screen: "pending",
    camera: "pending",
    microphone: "pending",
  });
  const [error, setError] = useState<string | null>(null);
  const [errorPermission, setErrorPermission] = useState<MediaPermissionType | null>(null);

  const screenStreamRef = useRef<MediaStream | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);

  const screenRecorderRef = useRef<MediaRecorder | null>(null);
  const cameraRecorderRef = useRef<MediaRecorder | null>(null);
  const micRecorderRef = useRef<MediaRecorder | null>(null);

  const stopAll = useCallback(() => {
    [screenRecorderRef, cameraRecorderRef, micRecorderRef].forEach((ref) => {
      if (ref.current && ref.current.state !== "inactive") {
        ref.current.stop();
        ref.current = null;
      }
    });

    [screenStreamRef, cameraStreamRef, micStreamRef].forEach((ref) => {
      if (ref.current) {
        ref.current.getTracks().forEach((t) => t.stop());
        ref.current = null;
      }
    });
    setPermissions({ screen: "pending", camera: "pending", microphone: "pending" });
  }, []);

  /** Request a single media type and return whether it was granted */
  const requestSingle = useCallback(
    async (
      type: MediaPermissionType,
    ): Promise<boolean> => {
      setError(null);
      setErrorPermission(null);

      try {
        if (type === "screen") {
          const screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: {
              displaySurface: "monitor",
            } as MediaTrackConstraints,
            audio: false,
          });

          const videoTrack = screenStream.getVideoTracks()[0];
          if (!videoTrack) {
            screenStream.getTracks().forEach((t) => t.stop());
            setError("No video track found for screen sharing.");
            setErrorPermission("screen");
            setPermissions((prev) => ({ ...prev, screen: "denied" }));
            return false;
          }

          const settings = videoTrack.getSettings();
          if (settings.displaySurface !== undefined && settings.displaySurface !== "monitor") {
            screenStream.getTracks().forEach((t) => t.stop());
            setError(
              "Please share your entire screen, not just a window or browser tab.",
            );
            setErrorPermission("screen");
            setPermissions((prev) => ({ ...prev, screen: "denied" }));
            return false;
          }

          // If screen sharing stops, revoke all permissions
          videoTrack.onended = () => {
            stopAll();
          };

          screenStreamRef.current = screenStream;
          if (recordingConfig) {
            screenRecorderRef.current = startRecorder(screenStream, recordingConfig, "screen");
          }
          setPermissions((prev) => ({ ...prev, screen: "granted" }));
          return true;
        }

        if (type === "camera") {
          const cameraStream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 640 },
              height: { ideal: 480 },
            },
            audio: false,
          });

          const videoTrack = cameraStream.getVideoTracks()[0];
          videoTrack.onended = () => {
            stopAll();
          };

          cameraStreamRef.current = cameraStream;
          if (recordingConfig) {
            cameraRecorderRef.current = startRecorder(cameraStream, recordingConfig, "camera");
          }
          setPermissions((prev) => ({ ...prev, camera: "granted" }));
          return true;
        }

        if (type === "microphone") {
          const micStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false,
          });

          const audioTrack = micStream.getAudioTracks()[0];
          audioTrack.onended = () => {
            stopAll();
          };

          micStreamRef.current = micStream;
          if (recordingConfig) {
            micRecorderRef.current = startRecorder(micStream, recordingConfig, "microphone");
          }
          setPermissions((prev) => ({ ...prev, microphone: "granted" }));
          return true;
        }

        return false;
      } catch (err: unknown) {
        const label =
          type === "screen"
            ? "Screen sharing"
            : type === "camera"
              ? "Camera"
              : "Microphone";
        const message = mapDOMException(err, label);
        setError(message);
        setErrorPermission(type);
        setPermissions((prev) => ({ ...prev, [type]: "denied" }));
        return false;
      }
    },
    [stopAll, recordingConfig],
  );

  const requestAll = useCallback(async (): Promise<boolean> => {
    setError(null);
    setErrorPermission(null);

    // Only request permissions that are still pending (not yet granted)
    const permissionsNeeded: MediaPermissionType[] = [];
    if (permissions.screen !== "granted") permissionsNeeded.push("screen");
    if (permissions.camera !== "granted") permissionsNeeded.push("camera");
    if (permissions.microphone !== "granted") permissionsNeeded.push("microphone");

    for (const type of permissionsNeeded) {
      const ok = await requestSingle(type);
      if (!ok) return false;
    }

    return true;
  }, [requestSingle, permissions]);

  const dismissError = useCallback(() => {
    setError(null);
    setErrorPermission(null);
  }, []);

  const allGranted =
    permissions.screen === "granted" &&
    permissions.camera === "granted" &&
    permissions.microphone === "granted";

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAll();
    };
  }, [stopAll]);

  return {
    permissions,
    allGranted,
    error,
    errorPermission,
    requestAll,
    stopAll,
    dismissError,
  };
}
