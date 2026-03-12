import { supabase } from "@/lib/supabase/client";
import axios from "axios";
import { toast } from "sonner";

export const signIn = async (provider: "google" | "x") => {
  try {
    const res = await axios.post("/api/auth/signin/oauth", { provider });
    if (res) {
      window.open(res.data.url)?.focus();
    }
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
};

const isUsernameUnique = async (value: string): Promise<boolean> => {
  try {
    const res = await axios.post("/api/auth/signup/username_exists", {
      username: value,
    });
    const isUnique = !res.data.exists;
    return isUnique;
  } catch (err: any) {
    console.error(err.response?.data?.error);
    return false;
  }
};

export const debouncedIsUsernameUnique = () => {
  let timeoutId: NodeJS.Timeout;
  let lastPromise: Promise<boolean>;

  return async (value: string): Promise<boolean> => {
    return new Promise((resolve) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        lastPromise = isUsernameUnique(value);
        resolve(await lastPromise);
      }, 500);
    });
  };
};

