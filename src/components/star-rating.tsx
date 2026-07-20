"use client";

import { Star, X } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
  value?: number;
  defaultValue?: number;
  maxStars?: number;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
  clearable?: boolean;
  onDelete?: () => void;
}

export const StarRating = ({
  value,
  defaultValue = 0,
  maxStars = 5,
  onChange,
  readOnly = false,
  clearable = true,
  onDelete,
}: StarRatingProps) => {
  const [internalRating, setInternalRating] = useState(defaultValue);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const currentRating = value !== undefined ? value : internalRating;
  const activeRating =
    hoverRating !== null && !readOnly ? hoverRating : currentRating;

  const handleSelect = (newValue: number) => {
    if (readOnly) return;
    const finalValue = clearable && newValue === currentRating ? 0 : newValue;
    setInternalRating(finalValue);
    if (onChange) onChange(finalValue);
  };

  const handleClear = () => {
    if (readOnly) return;
    setInternalRating(0);
    if (onChange) onChange(0);
    if (onDelete) onDelete();
  };

  return (
    <div className="flex w-full items-center gap-2 relative">
      {clearable && !readOnly && currentRating > 0 && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear rating"
          title="clear rating"
          className="absolute -left-8 cursor-pointer items-center justify-center rounded-full text-muted-foreground/60 transition-colors hover:text-foreground focus-visible:outline-none "
        >
          <X className="h-4 w-4" />
        </button>
      )}
      <div
        className="flex w-full items-center gap-1 sm:gap-2"
        onMouseLeave={() => !readOnly && setHoverRating(null)}
        role={readOnly ? "img" : "group"}
        aria-label={`Star rating: ${activeRating} out of ${maxStars}`}
      >
        {Array.from({ length: maxStars }).map((_, index) => {
          const starIndex = index + 1;
          let fillType: "full" | "half" | "empty" = "empty";

          if (activeRating >= starIndex) {
            fillType = "full";
          } else if (activeRating >= starIndex - 0.5) {
            fillType = "half";
          }

          return (
            <div
              key={starIndex}
              className={`relative flex-1 aspect-square transition-transform duration-150 ${
                !readOnly && "hover:scale-110"
              }`}
            >
              {!readOnly && (
                <button
                  type="button"
                  aria-label={`rate with ${starIndex - 0.5} stars`}
                  className="absolute top-0 left-0 z-10 h-full w-1/2 cursor-pointer rounded-l-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                  onMouseEnter={() => setHoverRating(starIndex - 0.5)}
                  onClick={() => handleSelect(starIndex - 0.5)}
                />
              )}

              {!readOnly && (
                <button
                  type="button"
                  aria-label={`rate with ${starIndex} stars`}
                  className="absolute top-0 right-0 z-10 h-full w-1/2 cursor-pointer rounded-r-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                  onMouseEnter={() => setHoverRating(starIndex)}
                  onClick={() => handleSelect(starIndex)}
                />
              )}

              <div className="pointer-events-none h-full w-full select-none">
                {fillType === "full" && (
                  <Star className="h-full w-full fill-amber-400 stroke-amber-500 stroke-[1.5]" />
                )}
                {fillType === "half" && (
                  <div className="relative h-full w-full">
                    <Star className="absolute left-0 top-0 h-full w-full fill-transparent stroke-muted-foreground/50 stroke-[1.5]" />
                    <div
                      className="absolute left-0 top-0 h-full w-full overflow-hidden"
                      style={{
                        clipPath: "polygon(0 0, 50% 0, 50% 100%, 0% 100%)",
                      }}
                    >
                      <Star className="h-full w-full fill-amber-400 stroke-amber-500 stroke-[1.5]" />
                    </div>
                  </div>
                )}
                {fillType === "empty" && (
                  <Star className="h-full w-full fill-transparent stroke-muted-foreground/50 stroke-[1.5]" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
