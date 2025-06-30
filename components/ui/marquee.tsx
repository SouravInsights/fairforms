"use client";

import React, { useMemo, useState } from "react";
import clsx from "clsx";

interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number; // base speed in seconds
  speedFactor?: number; // multiplier
  direction?: 1 | -1; // 1 = left-to-right, -1 = right-to-left
  play?: boolean; // defaults to true
  children: React.ReactNode;
}

export const Marquee: React.FC<MarqueeProps> = ({
  speed = 10,
  speedFactor = 1,
  direction = 1,
  play = true,
  className,
  children,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const duration = useMemo(
    () => speed * speedFactor * 10,
    [speed, speedFactor]
  );

  return (
    <div
      className={clsx("relative overflow-hidden", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      <div
        className={clsx(
          "flex w-max animate-marquee gap-4", // ✅ added gap-4 for spacing
          {
            "marquee-paused": !play || isHovered, // ✅ pause on hover
          }
        )}
        style={{
          animationDuration: `${duration}s`,
          animationDirection: direction === -1 ? "reverse" : "normal",
        }}
      >
        {children}
        {children}
      </div>
    </div>
  );
};
