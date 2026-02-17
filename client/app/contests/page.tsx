"use client";
import Right_Side from "@/components/Contest/Right_Side";
import Loading from "@/components/ui/Loading";
import { Contest } from "@/types/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SuggestedContest from "@/components/Contest/suggestedContest";

export default function Page() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const fetchContests = async () => {
    try {
      const response = await axios.get("/api/contests");
      setContests(response.data);
    } catch (error) {
      console.error("Error fetching contests:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContests();
  }, []);
  if (loading) return <Loading />;

  if (error) {
    return (
      <main className="flex flex-col justify-center items-center h-screen gap-4 px-3 text-center">
        <AlertCircle className="w-20 h-20 text-destructive" />
        <h1 className="text-2xl font-bold">Error Loading Contests</h1>
        <p className="text-lg text-muted-foreground max-w-md">{error}</p>
        <div className="mt-5 flex justify-center items-center gap-4">
          <Button variant="primary" onClick={() => window.location.reload()}>
            Retry
          </Button>
          <Link href={"/contests"}>
            <Button variant="outline">Back to Contests</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col md:flex-row items-center lg:justify-evenly gap-5 lg:gap-10 md:items-start overflow-hidden">
      <SuggestedContest contests={contests} />

      <Right_Side />
    </main>
  );
}
