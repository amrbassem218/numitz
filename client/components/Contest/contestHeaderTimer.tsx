"use client";
import { cn } from "@/lib/utils";
import { useRef, useState, useMemo } from "react";
import Countdown, { CountdownApi } from "react-countdown";
import { FaHourglassHalf, FaStop } from "react-icons/fa6";
import { VscDebugStart } from "react-icons/vsc";

type Props = {
  length_in_minutes: number;
};

type TimerStatus = "Start" | "Pause" | "Resume";
export default function ContestHeaderTimer({ length_in_minutes }: Props) {
  const formatting_with_zeroes = (num: number) => {
    return `${num < 10 ? "0" : ""}${Math.floor(num)}`;
  };
  const countDownApiRef = useRef<CountdownApi | null>(null);
  const setRef = (countdown: Countdown | null) => {
    countDownApiRef.current = countdown?.getApi() ?? null;
  };

  const [timerStatus, setTimerStatus] = useState<TimerStatus>("Start");
  const [startTime, setStartTime] = useState<number | null>(null);

  const targetDate = useMemo(() => {
    if (startTime === null) {
      return new Date().getTime() + 1000 * 60 * length_in_minutes;
    }
    return startTime + 1000 * 60 * length_in_minutes;
  }, [startTime, length_in_minutes]);

  const toggleTimerStatus = () => {
    if (countDownApiRef.current) {
      if (timerStatus === "Start") {
        setStartTime(Date.now());
        countDownApiRef.current.start();
        setTimerStatus("Pause");
      } else if (timerStatus === "Pause") {
        setTimerStatus("Resume");
        countDownApiRef.current.pause();
      } else if (timerStatus === "Resume") {
        countDownApiRef.current.start();
        setTimerStatus("Pause");
      }
    }
  };
  const CountdownRenderer = ({
    hours,
    minutes,
    seconds,
    completed,
  }: {
    hours: number;
    minutes: number;
    seconds: number;
    completed: boolean;
  }) => {
    if (completed) {
      // TODO: Add a pop up
    } else {
      const hrs = formatting_with_zeroes(hours);
      const mins = formatting_with_zeroes(minutes);
      const secs = formatting_with_zeroes(seconds);

      const hours_minutes_seconds = `${hrs}:${mins}:${secs}`;
      const hours_minutes = `${hrs}:${mins}`;
      const minutes_seconds = `${mins}:${secs}`;
      if (hours > 0) {
        return hours_minutes;
      }
      return minutes_seconds;
    }
  };

  const stopTimer = () => {
    if (countDownApiRef.current) {
      countDownApiRef.current.stop();
      setTimerStatus("Start");
    }
  };
  return (
    <div className="flex gap-1">
      {/* Timer */}
      <div className="w-fit h-8 bg-card rounded-l-md flex items-center gap-2 p-2 px-3">
        <FaHourglassHalf className="text-primary" />

        <Countdown
          date={targetDate}
          ref={setRef}
          renderer={CountdownRenderer}
          autoStart={false}
        ></Countdown>
      </div>

      {/* Timer Controller */}
      <div className="w-fit h-8 bg-card rounded-r-md flex items-center p-2  gap-4">
        <button
          className={cn(
            "flex items-center justify-center gap-2 cursor-pointer opacity-70 hover:opacity-90",
            timerStatus === "Pause" ? "*:!text-destructive" : "*:!text-success",
          )}
          onClick={() => toggleTimerStatus()}
        >
          <VscDebugStart className="" />
          <p className={`text-base font-mono`}>{timerStatus}</p>
        </button>
        {timerStatus !== "Start" && (
          <button onClick={() => stopTimer()} className="cursor-pointer p-0 ">
            <FaStop className="text-destructive text-sm" />
          </button>
        )}
      </div>
    </div>
  );
}
