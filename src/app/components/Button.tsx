import React from "react";

type props = {
  title: string;
  onClick?: () => void;
  className?: string;
};

const PrimaryRoundedButton = ({ title, onClick, className }: props) => {
  return (
    <button
      className={`${className} my-2 bg-primary border rounded-xl inline-flex items-center justify-center py-3 px-7 text-center text-base font-medium text-white hover:bg-highlight/90 disabled:bg-gray-3 disabled:border-gray-3 disabled:text-dark-5 active:bg-[#1B44C8] active:border-[#1B44C8]`}
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export default PrimaryRoundedButton;
