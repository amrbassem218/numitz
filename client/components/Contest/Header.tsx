"use client";
import { Mini_Logo } from "../ui/logo";
import { Separator } from "../ui/separator";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TfiMenu } from "react-icons/tfi";
import { FaRegNoteSticky, FaStop } from "react-icons/fa6";
import { FaHourglassHalf } from "react-icons/fa";
import { IoCloudUploadOutline } from "react-icons/io5";
import { FiHelpCircle } from "react-icons/fi";
import { LuLayoutDashboard } from "react-icons/lu";
import { CiSettings } from "react-icons/ci";
import { RiFireFill } from "react-icons/ri";
import UserIcon from "../header/userIcon";
import { VscDebugStart } from "react-icons/vsc";
import { useEffect, useState, useRef, useMemo } from "react";
import Countdown, { CountdownApi } from "react-countdown";
import { cn } from "@/lib/utils";
interface Props {
  length_in_minutes: number;
}
type TimerStatus = "Start" | "Pause" | "Resume";
const ContestHeader = ({ length_in_minutes }: Props) => {
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
    <nav className="h-10 bg-transparent mb-2 w-full flex justify-between items-center gap-5 px-4 my-1">
      {/* Left section */}
      <section className="">
        <div className="flex items-end gap-2 ">
          <div className="flex items-end gap-3">
            <Mini_Logo />
            <Separator
              orientation="vertical"
              className="h-4! bg-foreground/20 "
            />
          </div>
          <div className="flex items-end gap-2">
            <TfiMenu className="w-4.5 h-4.5 text-muted-foreground" />
            <span className="hidden md:inline text-base font-medium self-end leading-none">
              Contest List
            </span>
          </div>
        </div>
      </section>

      {/* Middle section */}
      <section className="flex gap-1">
        {/* Take notes */}
        <div className="hidden w-8 h-8 bg-card rounded-md md:flex items-center justify-center p-2">
          <FaRegNoteSticky className="text-muted-foreground" />
        </div>

        {/* Take notes */}
        <div className="w-fit h-8 bg-card rounded-l-md flex items-center gap-2 p-2 px-3">
          <FaHourglassHalf className="text-primary" />
          {/* <p className="text-foreground/80"> */}
          {/*   {minutes_to_time(timeRemaining).short_format} */}
          {/* </p> */}

          <Countdown
            date={targetDate}
            ref={setRef}
            renderer={CountdownRenderer}
            autoStart={false}
          ></Countdown>
        </div>

        {/* Take notes */}
        <div className="w-fit h-8 bg-card rounded-r-md flex items-center p-2  gap-4">
          <button
            className={cn(
              "flex items-center justify-center gap-2 cursor-pointer opacity-70 hover:opacity-90",
              timerStatus === "Pause"
                ? "*:!text-destructive"
                : "*:!text-success",
            )}
            onClick={() => toggleTimerStatus()}
          >
            <VscDebugStart className="" />
            <p className={`text-base font-mono`}>{timerStatus}</p>
          </button>
          {timerStatus !== "Start" && (
            <button onClick={() => stopTimer()} className="cursor-pointer p-0 ">
              <FaStop className="text-destructive text-sm " />
            </button>
          )}
        </div>

        {/* Take notes */}
        <div className="hidden w-8 h-8 bg-card rounded-md md:flex items-center justify-center p-2">
          <FiHelpCircle className="text-muted-foreground" />
        </div>
      </section>

      {/* Right section */}
      <section className="flex items-center gap-2 text-xs">
        <LuLayoutDashboard className="w-5 h-5 text-muted-foreground hidden md:inline" />
        <CiSettings className="w-5 h-5 text-muted-foreground hidden md:inline" />
        <RiFireFill className="w-5 h-5 text-muted-foreground hidden md:inline" />
        <UserIcon />
        {/* <ThemeButton />
        <div className="flex justify-center items-center text-xl font-semibold h-10 w-10 rounded-full overflow-hidden bg-primary text-white">
          A
        </div> */}
      </section>
    </nav>
  );
};

export default ContestHeader;
