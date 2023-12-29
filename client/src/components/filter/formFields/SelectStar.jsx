import React, { useEffect, useState } from "react";

export default function SelectStar({ selectedStars, setSelectedStars }) {
  const handleSelectStar = (e) => {
    const star = parseInt(e.target.id);
    if (selectedStars.includes(star)) {
      setSelectedStars(selectedStars.filter((s) => s !== star));
    } else {
      setSelectedStars([...selectedStars, star]);
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor="1">Star</label>
      <div className="flex items-center space-x-3">
        {[1, 2, 3, 4, 5].map((star) => {
          return (
            <span
              id={star}
              onClick={handleSelectStar}
              className={`py-1 px-3 inline-block border border-slate-400 bg-slate-50 cursor-pointer ${
                selectedStars.includes(star) &&
                "bg-blue-300/30 border-blue-500 text-blue-500"
              }`}
            >
              {star}
            </span>
          );
        })}
      </div>
    </div>
  );
}
