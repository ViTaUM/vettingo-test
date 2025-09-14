'use client';

import { cn } from '@/utils/cn';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="mt-8 flex justify-center">
      <nav className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            'rounded-md p-2',
            currentPage === 1 ? 'cursor-not-allowed text-gray-400' : 'text-gray-700 hover:bg-gray-100',
          )}>
          <ChevronLeft className="h-5 w-5" />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-md',
              currentPage === page ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100',
            )}>
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            'rounded-md p-2',
            currentPage === totalPages ? 'cursor-not-allowed text-gray-400' : 'text-gray-700 hover:bg-gray-100',
          )}>
          <ChevronRight className="h-5 w-5" />
        </button>
      </nav>
    </div>
  );
}
