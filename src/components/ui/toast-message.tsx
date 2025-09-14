'use client';

import { cn } from '@/utils/cn';
import { Transition } from '@headlessui/react';
import { Check, TriangleAlert, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast, { type ToastType } from 'react-hot-toast';
import SpotlightCard from './spotlight-card';

export default function UIToastMessage({
  id,
  type,
  message,
  duration,
  visible,
}: {
  id: string;
  type: ToastType;
  message: string;
  duration: number;
  visible: boolean;
}) {
  const [msRemaining, setMsRemaining] = useState(duration);
  const [isPaused, setIsPaused] = useState(false);

  const circleSize = 36;
  const strokeWidth = 3;
  const radius = (circleSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Garantir que o progresso não ultrapasse 100%
  const progress = Math.max(0, Math.min(1, msRemaining / duration));
  const strokeDashoffset = circumference * (1 - progress);

  const colorMap: Record<string, string> = {
    success: 'green',
    error: 'red',
    loading: 'blue',
  };

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setMsRemaining((prev) => {
        const newValue = prev - 100;
        // Parar quando chegar a 0 para evitar valores negativos
        return newValue <= 0 ? 0 : newValue;
      });
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [isPaused]);

  return (
    <Transition
      show={visible}
      appear={true}
      enter="transition-opacity duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-300"
      leaveFrom="opacity-100"
      leaveTo="opacity-0">
      <div
        className="relative w-full max-w-[450px]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}>
        <SpotlightCard
          className="!rounded-md border border-gray-200 bg-white !p-2"
          spotlightColor={colorMap[type] ?? 'blue'}>
          <button
            onClick={() => toast.dismiss(id)}
            className="absolute top-2 right-2 flex items-center justify-center rounded-md p-1 text-slate-400 transition-colors duration-200 hover:bg-white/10 hover:text-slate-100">
            <span className="sr-only">Close</span>
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-4 p-4">
            <div className="relative flex items-center justify-center">
              <svg className="-rotate-90 transform" width={circleSize} height={circleSize}>
                <circle
                  cx={circleSize / 2}
                  cy={circleSize / 2}
                  r={radius}
                  fill="transparent"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth={strokeWidth}
                />
                <circle
                  cx={circleSize / 2}
                  cy={circleSize / 2}
                  r={radius}
                  fill="transparent"
                  stroke="rgb(74, 222, 128)"
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  style={{
                    transition: 'stroke-dashoffset 100ms linear',
                  }}
                  className={cn({
                    'stroke-green-500': type === 'success',
                    'stroke-red-500': type === 'error',
                    'stroke-spring-green-400': !type || (type !== 'success' && type !== 'error'),
                  })}
                />
              </svg>
              {type === 'success' ? (
                <Check className="absolute h-5 w-5 text-green-500" />
              ) : (
                <TriangleAlert className="absolute h-4 w-4 text-red-500" />
              )}
            </div>
            <p className="text-sm">{message}</p>
          </div>
        </SpotlightCard>
      </div>
    </Transition>
  );
}
