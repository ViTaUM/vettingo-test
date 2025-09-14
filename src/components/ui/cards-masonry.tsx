'use client';

import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';

/**
 * CardsMasonry - A reusable masonry layout component with GSAP animations
 *
 * Features:
 * - Responsive columns (1-3 columns based on screen size)
 * - GSAP animations with customizable easing and timing
 * - Hover effects with scaling
 * - Variable card heights for organic masonry layout
 *
 * Usage:
 * ```tsx
 * const items = [
 *   {
 *     id: "1",
 *     content: <YourCardComponent />,
 *     height: 300, // Optional: provide fixed height or let it auto-calculate
 *   },
 *   {
 *     id: "2", 
 *     content: <AnotherCard />,
 *     // height omitted - will be auto-calculated from content
 *   },
 *   // ... more items
 * ];
 *
 * <CardsMasonry
 *   items={items}
 *   ease="power3.out"
 *   duration={0.6}
 *   stagger={0.1}
 *   animateFrom="bottom"
 *   scaleOnHover={true}
 *   hoverScale={1.02}
 * />
 * ```
 */

const useMedia = (queries: string[], values: number[], defaultValue: number): number => {
  const get = useCallback(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || !window.matchMedia) {
      return defaultValue;
    }
    return values[queries.findIndex((q) => window.matchMedia(q).matches)] ?? defaultValue;
  }, [defaultValue, queries, values]);

  const [value, setValue] = useState<number>(defaultValue); // Use defaultValue initially for SSR

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined' || !window.matchMedia) return;

    // Set initial value after hydration
    setValue(get);

    const handler = () => setValue(get);
    queries.forEach((q) => window.matchMedia(q).addEventListener('change', handler));
    return () => queries.forEach((q) => window.matchMedia(q).removeEventListener('change', handler));
  }, [queries, get]);

  return value;
};

const useMeasure = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return [ref, size] as const;
};

interface MasonryCard {
  id: string;
  content: React.ReactNode;
  height?: number; // Optional, will be auto-calculated if not provided
}

interface CardsMasonryProps {
  items: MasonryCard[];
  ease?: string;
  duration?: number;
  stagger?: number;
  animateFrom?: 'bottom' | 'top' | 'left' | 'right' | 'center' | 'random';
  scaleOnHover?: boolean;
  hoverScale?: number;
}

const CardsMasonry: React.FC<CardsMasonryProps> = ({
  items,
  ease = 'power3.out',
  duration = 0.6,
  stagger = 0.05,
  animateFrom = 'bottom',
  scaleOnHover = true,
  hoverScale = 1.02,
}) => {
  const columns = useMedia(['(min-width:1200px)', '(min-width:768px)', '(min-width:640px)'], [3, 2, 1], 1);

  const [containerRef, { width }] = useMeasure<HTMLDivElement>();
  const [mounted, setMounted] = useState(false);
  const [cardHeights, setCardHeights] = useState<Record<string, number>>({});
  const cardRefs = useRef<Record<string, HTMLDivElement>>({});

  const getInitialPosition = useCallback(
    (item: { x: number; y: number; w: number; h: number }) => {
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return { x: item.x, y: item.y };

      let direction = animateFrom;
      if (animateFrom === 'random') {
        const dirs = ['top', 'bottom', 'left', 'right'];
        direction = dirs[Math.floor(Math.random() * dirs.length)] as typeof animateFrom;
      }

      switch (direction) {
        case 'top':
          return { x: item.x, y: -200 };
        case 'bottom':
          return { x: item.x, y: window.innerHeight + 200 };
        case 'left':
          return { x: -200, y: item.y };
        case 'right':
          return { x: window.innerWidth + 200, y: item.y };
        case 'center':
          return {
            x: containerRect.width / 2 - item.w / 2,
            y: containerRect.height / 2 - item.h / 2,
          };
        default:
          return { x: item.x, y: item.y + 100 };
      }
    },
    [animateFrom, containerRef],
  );

  // Measure card heights after render
  useLayoutEffect(() => {
    if (!mounted || !width) return;

    const measureHeights = () => {
      const newHeights: Record<string, number> = {};
      let hasChanges = false;
      
      items.forEach((item) => {
        const element = cardRefs.current[item.id];
        if (element) {
          // Force reflow to ensure accurate measurements
          element.style.height = 'auto';
          const height = element.offsetHeight;
          
          if (cardHeights[item.id] !== height) {
            hasChanges = true;
          }
          newHeights[item.id] = height;
        }
      });

      if (hasChanges || Object.keys(cardHeights).length === 0) {
        setCardHeights(newHeights);
      }
    };

    // Small delay to ensure content is fully rendered
    const timeoutId = setTimeout(measureHeights, 50);
    
    return () => clearTimeout(timeoutId);
  }, [mounted, width, items, cardHeights]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const grid = useMemo(() => {
    if (!width || !mounted) return [];
    
    // Wait for at least some heights to be measured
    const hasHeights = items.some(item => 
      item.height !== undefined || cardHeights[item.id] !== undefined
    );
    
    if (!hasHeights) {
      // Return simple layout for initial measurement phase
      const gap = 24;
      const totalGaps = (columns - 1) * gap;
      const columnWidth = (width - totalGaps) / columns;
      
      return items.map((child, index) => ({
        ...child,
        x: (index % columns) * (columnWidth + gap),
        y: Math.floor(index / columns) * 250, // Spread them vertically for measurement
        w: columnWidth,
        h: 200,
      }));
    }

    const colHeights = new Array(columns).fill(0);
    const gap = 24;
    const totalGaps = (columns - 1) * gap;
    const columnWidth = (width - totalGaps) / columns;

    return items.map((child) => {
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = col * (columnWidth + gap);
      const height = child.height || cardHeights[child.id] || 200;
      const y = colHeights[col];

      colHeights[col] += height + gap;
      return { ...child, x, y, w: columnWidth, h: height };
    });
  }, [columns, items, width, cardHeights, mounted]);

  const hasMounted = useRef(false);

  useLayoutEffect(() => {
    if (!mounted || grid.length === 0) return;

    // Skip animation if we don't have proper heights yet
    const hasProperHeights = items.every(item => 
      item.height !== undefined || cardHeights[item.id] !== undefined
    );

    grid.forEach((item, index) => {
      const selector = `[data-card-id="${item.id}"]`;
      const animProps = { x: item.x, y: item.y, width: item.w };

      if (!hasMounted.current && hasProperHeights) {
        const start = getInitialPosition(item);
        gsap.fromTo(
          selector,
          {
            opacity: 0,
            x: start.x,
            y: start.y,
            width: item.w,
            scale: 0.8,
          },
          {
            opacity: 1,
            scale: 1,
            ...animProps,
            duration: 0.8,
            ease: 'power3.out',
            delay: index * stagger,
          },
        );
      } else if (hasProperHeights) {
        gsap.to(selector, {
          ...animProps,
          duration,
          ease,
          overwrite: 'auto',
        });
      } else {
        // Just position without animation during measurement phase
        gsap.set(selector, {
          ...animProps,
          opacity: 1,
        });
      }
    });

    if (hasProperHeights) {
      hasMounted.current = true;
    }
  }, [grid, mounted, stagger, animateFrom, duration, ease, getInitialPosition, items, cardHeights]);

  const handleMouseEnter = (id: string) => {
    if (scaleOnHover) {
      gsap.to(`[data-card-id="${id}"]`, {
        scale: hoverScale,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  const handleMouseLeave = (id: string) => {
    if (scaleOnHover) {
      gsap.to(`[data-card-id="${id}"]`, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {grid.map((item) => (
        <div
          key={item.id}
          ref={(el) => {
            if (el) cardRefs.current[item.id] = el;
          }}
          data-card-id={item.id}
          className="absolute top-0 left-0"
          style={{ 
            willChange: 'transform, width, height, opacity',
            visibility: mounted ? 'visible' : 'hidden',
            transform: `translate3d(${item.x}px, ${item.y}px, 0)`,
            width: item.w,
            opacity: mounted ? 1 : 0,
          }}
          onMouseEnter={() => handleMouseEnter(item.id)}
          onMouseLeave={() => handleMouseLeave(item.id)}>
          <div className="w-full">
            {item.content}
          </div>
        </div>
      ))}
      {/* Spacer to maintain container height */}
      <div 
        style={{ 
          height: grid.length > 0 ? Math.max(...grid.map((item) => item.y + item.h)) + 24 : 0,
          pointerEvents: 'none'
        }} 
      />
    </div>
  );
};

export default CardsMasonry;
