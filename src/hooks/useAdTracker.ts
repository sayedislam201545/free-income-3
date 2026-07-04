import { useState, useEffect, useCallback } from 'react';

export function useAdTracker(
  onSuccess: () => void,
  onFail?: (timeSpent: number) => void
) {
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [requiredTime, setRequiredTime] = useState(15);
  const [timeRemaining, setTimeRemaining] = useState(15);

  const checkCompletion = useCallback(() => {
    if (!isTracking) return;
    const timeSpent = (Date.now() - startTime) / 1000;
    if (timeSpent < 1) return; // Ignore instant focus events
    
    setIsTracking(false);
    if (timeSpent >= requiredTime) {
      onSuccess();
    } else {
      if (onFail) {
        onFail(Math.floor(timeSpent));
      } else {
        alert(`আপনি ${requiredTime} সেকেন্ড এর আগেই বের হয়ে এসেছেন তাই আপবার এড টাকে কাউন্ড করা হয় নাই!\nআপনি দেখেছেন: ${Math.floor(timeSpent)} সেকেন্ড`);
      }
    }
  }, [isTracking, startTime, requiredTime, onSuccess, onFail]);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') checkCompletion();
    };
    const onFocus = () => {
      checkCompletion();
    };
    
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('focus', onFocus);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('focus', onFocus);
    };
  }, [checkCompletion]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTracking) {
      interval = setInterval(() => {
        const spent = (Date.now() - startTime) / 1000;
        const rem = Math.max(0, requiredTime - Math.floor(spent));
        setTimeRemaining(rem);
        if (rem === 0) {
          setIsTracking(false);
          onSuccess();
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking, startTime, requiredTime, onSuccess]);

  const startTracking = (seconds: number = 15) => {
    setRequiredTime(seconds);
    setTimeRemaining(seconds);
    setStartTime(Date.now());
    setIsTracking(true);
  };

  const cancelTracking = () => {
      setIsTracking(false);
      const timeSpent = (Date.now() - startTime) / 1000;
      if (onFail) {
        onFail(Math.floor(timeSpent));
      } else {
        alert(`আপনি ${requiredTime} সেকেন্ড এর আগেই বের হয়ে এসেছেন তাই আপবার এড টাকে কাউন্ড করা হয় নাই!\nআপনি দেখেছেন: ${Math.floor(timeSpent)} সেকেন্ড`);
      }
  };

  return { startTracking, isTracking, checkCompletion, timeRemaining, cancelTracking };
}
