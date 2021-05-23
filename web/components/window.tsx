import React from "react";

export const Window = ({
  alive,
  name,
  children,
}: {
  alive: boolean;
  name: string;
  children: React.ReactNode;
}): JSX.Element => {
  return (
    <div className="bg-white rounded flex flex-col shadow-md h-full relative">
      <div className="w-full flex justify-between rounded-t bg-blue-100 text-blue-500 items-center py-1 px-2">
        <span className="flex-grow text-current capitalize text-md font-semibold">
          {name}
        </span>
        <div
          className={`w-4 h-4 rounded-full ${
            alive ? "bg-green-300" : "bg-red-500"
          }`}
        />
      </div>
      <div className="flex-grow p-2 relative">
        {children}
        {!alive && (
          <div className="absolute h-full top-0 left-0 w-full z-10 bg-gray-500 opacity-70 rounded-b"></div>
        )}
      </div>
    </div>
  );
};
