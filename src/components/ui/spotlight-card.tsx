'use client';

import React, { useRef, useState } from 'react';

interface Position {
  x: number;
  y: number;
}

interface SpotlightCardProps extends React.PropsWithChildren {
  className?: string;
  spotlightColor?: string | `rgba(${number}, ${number}, ${number}, ${number})`;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  spotlightColor = 'white',
  onClick,
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState<number>(0);

  // Mapeamento de cores para valores RGBA
  const colorMap: Record<string, string> = {
    white: 'rgba(255, 255, 255, 0.25)',
    blue: 'rgba(59, 130, 246, 0.15)',
    emerald: 'rgba(16, 185, 129, 0.15)',
    green: 'rgba(16, 185, 129, 0.15)',
    pink: 'rgba(236, 72, 153, 0.15)',
    purple: 'rgba(147, 51, 234, 0.15)',
    red: 'rgba(239, 68, 68, 0.15)',
    yellow: 'rgba(245, 158, 11, 0.15)',
    orange: 'rgba(249, 115, 22, 0.15)',
    gray: 'rgba(107, 114, 128, 0.15)',
    slate: 'rgba(100, 116, 139, 0.15)',
    indigo: 'rgba(99, 102, 241, 0.15)',
    cyan: 'rgba(6, 182, 212, 0.15)',
    teal: 'rgba(20, 184, 166, 0.15)',
    lime: 'rgba(132, 204, 22, 0.15)',
  };

  const resolvedSpotlightColor = colorMap[spotlightColor] || spotlightColor;

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!divRef.current || isFocused) return;

    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(0.6);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(0.6);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative overflow-hidden rounded-3xl p-8 ${className}`}>
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out"
        style={{
          opacity,
          background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${resolvedSpotlightColor}, transparent 80%)`,
        }}
      />
      {children}
    </div>
  );
};

export default SpotlightCard;
