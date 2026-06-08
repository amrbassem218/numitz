"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { MediaPermissionState, MediaPermissionType, MediaPermissionStatus } from "@/app/hooks/useScreenRecording";

interface MediaPermissionsOverlayProps {
  permissions: MediaPermissionState;
  error: string | null;
  errorPermission: MediaPermissionType | null;
  onRequestAll: () => Promise<boolean>;
  onDismissError: () => void;
  requiredPermissions?: MediaPermissionType[];
}

const statusIcon: Record<MediaPermissionStatus, string> = {
  pending: "⏳",
  granted: "✅",
  denied: "❌",
};

const permissionLabels: { key: MediaPermissionType; icon: string; label: string; description: string }[] = [
  {
    key: "screen",
    icon: "🖥️",
    label: "Screen Sharing",
    description: "Share your entire screen (not just a window)",
  },
  {
    key: "camera",
    icon: "📷",
    label: "Camera",
    description: "Allow camera access for monitoring",
  },
  {
    key: "microphone",
    icon: "🎤",
    label: "Microphone",
    description: "Allow microphone access for monitoring",
  },
];

const MediaPermissionsOverlay: React.FC<MediaPermissionsOverlayProps> = ({
  permissions,
  error,
  errorPermission,
  onRequestAll,
  onDismissError,
  requiredPermissions = ["screen", "camera", "microphone"],
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRequest = async () => {
    setIsLoading(true);
    try {
      await onRequestAll();
    } finally {
      setIsLoading(false);
    }
  };

  const allGranted =
    permissions.screen === "granted" &&
    permissions.camera === "granted" &&
    permissions.microphone === "granted";

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="mx-auto max-w-md space-y-6 p-8 text-center">
        <div className="text-5xl">🔒</div>

        <h2 className="text-2xl font-bold">Media Access Required</h2>

        <p className="text-muted-foreground">
          To participate in this live contest, you must grant all of the
          following permissions. This ensures fair play and contest integrity.
        </p>

        {/* Permission list */}
        <div className="space-y-3 text-left">
          {permissionLabels
            .filter((p) => requiredPermissions.includes(p.key))
            .map(({ key, icon, label, description }) => {
            const status = permissions[key];
            const isErrored = errorPermission === key && !!error;

            return (
              <div
                key={key}
                className={`flex items-start gap-3 rounded-lg border p-3 transition-colors ${
                  status === "granted"
                    ? "border-success/30 bg-success/5"
                    : isErrored
                      ? "border-destructive/30 bg-destructive/10"
                      : "border-border/50 bg-muted/30"
                }`}
              >
                <span className="mt-0.5 text-xl">{icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{label}</span>
                    <span className="text-base">{statusIcon[status]}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {description}
                  </p>
                  {isErrored && (
                    <p className="text-xs text-destructive mt-1">
                      {error}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Global error (not tied to a specific permission) */}
        {error && !errorPermission && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            <p>{error}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="space-y-3">
          {!allGranted && (
            <Button
              onClick={handleRequest}
              disabled={isLoading}
              className="w-full"
              variant="primary"
              size="lg"
            >
              {isLoading
                ? "Requesting..."
                : permissions.screen === "granted" && permissions.camera === "granted"
                  ? "Grant Microphone Access"
                  : permissions.screen === "granted"
                    ? "Grant Camera Access"
                    : "Grant All Access"}
            </Button>
          )}

          {error && (
            <button
              onClick={onDismissError}
              className="block mx-auto text-xs text-muted-foreground underline hover:no-underline"
            >
              Dismiss error and try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaPermissionsOverlay;
