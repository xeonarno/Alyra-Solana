import React from 'react';

interface CountdownProps {
  time: number;
}

const Countdown: React.FC<CountdownProps> = ({ time }) => {
  const formatTime = (milliseconds: number): { seconds: string; ms: string; microseconds: string } => {
    const seconds = Math.floor(milliseconds / 1000).toString().padStart(2, '0');
    const ms = (milliseconds % 1000).toString().padStart(3, '0');
    const microseconds = ((milliseconds % 1) * 1000).toFixed(0).toString().padStart(3, '0');
    return { seconds, ms, microseconds };
  };

  const { seconds, ms, microseconds } = formatTime(time);

  return (
    <div className="digital-clock text-white mb-4">
      <div>{seconds}</div>:<div>{ms}</div>:<div>{microseconds}</div>
    </div>
  );
};

export default Countdown;
