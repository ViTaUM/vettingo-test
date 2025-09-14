'use client';

import { Button } from '@/components/ui/button';
import { VetReview } from '@/lib/api/vet-reviews';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Flag, MessageSquare, Star, User } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface ReviewCardProps {
  review: VetReview;
  onContest: (reviewId: number) => void;
}

const ReviewCard = ({ review, onContest }: ReviewCardProps) => {
  const [showFullComment, setShowFullComment] = useState(false);
  const isAnonymous = review.anonymous || !review.authorName;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: ptBR,
    });
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 5:
        return 'Excelente';
      case 4:
        return 'Muito Bom';
      case 3:
        return 'Bom';
      case 2:
        return 'Regular';
      case 1:
        return 'Ruim';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {isAnonymous ? (
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-gray-500" />
              </div>
            ) : review.authorAvatar ? (
              <Image
                src={review.authorAvatar}
                alt={review.authorName || 'Avatar'}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
            )}
          </div>
          
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-medium text-gray-900">
                {isAnonymous ? 'Usuário Anônimo' : review.authorName}
              </h4>
              {isAnonymous && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                  Anônimo
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">{formatDate(review.createdAt)}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            {renderStars(review.rating)}
          </div>
          <span className={`text-sm font-medium ${getRatingColor(review.rating)}`}>
            {getRatingText(review.rating)}
          </span>
        </div>
      </div>

      {review.comment && (
        <div className="space-y-2">
          <div className="flex items-start space-x-2">
            <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className={`text-sm text-gray-700 ${!showFullComment && review.comment.length > 200 ? 'line-clamp-3' : ''}`}>
                {review.comment}
              </p>
              {review.comment.length > 200 && (
                <button
                  onClick={() => setShowFullComment(!showFullComment)}
                  className="text-xs text-blue-600 hover:text-blue-700 mt-1"
                >
                  {showFullComment ? 'Ver menos' : 'Ver mais'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="flex items-center space-x-4 text-xs text-gray-500">
          <span>Review #{review.id}</span>
          <span>•</span>
          <span>Rating: {review.rating}/5</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onContest(review.id)}
          className="text-orange-600 border-orange-200 hover:bg-orange-50 hover:border-orange-300"
        >
          <Flag className="h-3 w-3 mr-1" />
          Contestar
        </Button>
      </div>
    </div>
  );
};

export default ReviewCard; 