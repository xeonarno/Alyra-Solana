'use client'
import React, { useState, useEffect, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import FireButton from '../button/fire-button';
import Countdown from '../countdown/counter';

const TimerPage: React.FC = () => {
  const [time, setTime] = useState<number>(60000); // 60 seconds in milliseconds
  const [running, setRunning] = useState<boolean>(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [toastShown, setToastShown] = useState<boolean>(false);

  const handleFire = () => {
    setTime((prevTime) => {
      const newTime = prevTime + 10000;
      return newTime > 60000 ? 60000 : newTime;
    }); // add 10 seconds, but cap at 60 seconds
  };

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 10) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setRunning(false);
            if (!toastShown) {
                console.log("toastShown", toastShown)
              toast.error('End of game', { style: { background: 'red', color: 'white' } });
              setToastShown(true);
            }
            return 0;
          }
          return prevTime - 10;
        });
      }, 10); // update every 10ms for smooth milliseconds display
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Toaster />
      <Countdown time={time} />
      <FireButton handleFire={handleFire} />
    </div>
  );
};

export default TimerPage;
