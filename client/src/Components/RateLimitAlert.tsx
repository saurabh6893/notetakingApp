import { useEffect, useState } from "react";
import { useRateLimitStore } from "../stores/useRateLimitStore";

export const RateLimitAlert = () => {
  const { isLocked, lockUntil } = useRateLimitStore();
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  useEffect(() => {
    if (!isLocked || !lockUntil) return;

    const updateTimer = () => {
      const now = Date.now();
      const remaining = lockUntil - now;

      if (remaining <= 0) {
        setTimeRemaining("");
        useRateLimitStore.setState({
          isLocked: false,
          lockUntil: null,
        });
        return;
      }

      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      setTimeRemaining(`${minutes}m ${seconds}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [isLocked, lockUntil]);

  if (!isLocked) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
      <div className="bg-red-50 border-2 border-red-400 rounded-lg p-4 shadow-lg animate-pulse">
        <div className="flex items-center gap-3">
          <div className="text-2xl">🚫</div>
          <div className="flex-1">
            <h3 className="font-bold text-red-700">Too Many Attempts</h3>
            <p className="text-sm text-red-600">
              Please wait{" "}
              <span className="font-mono font-bold text-red-700">
                {timeRemaining}
              </span>{" "}
              before trying again
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
