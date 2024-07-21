import React from 'react';

interface CountdownProps {
  time: number;
}

const Countdown: React.FC<CountdownProps> = ({ time }) => {
  const formatTime = (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    const ms = milliseconds % 1000;
    return `${seconds}.${ms.toString().padStart(3, '0')}`;
  };

  return (
    <div className="text-4xl font-bold mb-4">{formatTime(time)}s</div>
  );
};

export default Countdown;
