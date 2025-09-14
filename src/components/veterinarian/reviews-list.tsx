'use client';

import { VetReview } from '@/lib/types/api';
import { Calendar, Star, User } from 'lucide-react';

interface ReviewsListProps {
  reviews: VetReview[];
  total: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function ReviewsList({ reviews, total, currentPage, totalPages, onPageChange }: ReviewsListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <Star className="h-6 w-6 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma avaliação ainda</h3>
        <p className="text-gray-600 text-sm">Seja o primeiro a avaliar este veterinário!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            Avaliações ({total})
          </h3>
          <p className="text-sm text-gray-600">
            Baseado em {total} avaliação{total !== 1 ? 'ões' : ''}
          </p>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-xl border border-gray-200 p-4">
            {/* Review Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
                  {review.anonymous ? (
                    <User className="h-5 w-5 text-white" />
                  ) : (
                    <span className="text-white font-bold text-sm">
                      {review.authorName?.charAt(0) || 'U'}
                    </span>
                  )}
                </div>

                {/* Author Info */}
                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    {review.anonymous ? 'Avaliação Anônima' : review.authorName}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {renderStars(review.rating)}
                  </div>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Calendar className="h-3 w-3" />
                {formatDate(review.createdAt)}
              </div>
            </div>

            {/* Comment */}
            {review.comment && (
              <p className="text-gray-700 text-sm leading-relaxed">
                &ldquo;{review.comment}&rdquo;
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>

          <span className="px-3 py-2 text-sm text-gray-700">
            Página {currentPage} de {totalPages}
          </span>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
} 