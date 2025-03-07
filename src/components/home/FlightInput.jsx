import React from "react";

export default function AirportInput({ label, value, setValue, icon }) {
  return (
    <div className="relative w-[30%]">
      {icon}
      <input
        type="text"
        placeholder={label}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full rounded-lg border bg-white p-3 pl-10 text-black focus:outline-none focus:ring-2 focus:ring-orange-400"
      />
    </div>
  );
}
