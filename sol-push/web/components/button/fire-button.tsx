import React from 'react';

interface FireButtonProps {
  handleFire: () => void;
}

const FireButton: React.FC<FireButtonProps> = ({ handleFire }) => {
  return (
    <button
      onClick={handleFire}
      className="px-4 py-2 bg-blue-500 text-white font-semibold text-lg rounded-lg shadow-lg hover:bg-blue-600 hover:shadow-xl transition-all duration-300"
    >
      Play
    </button>
  );
};

export default FireButton;
