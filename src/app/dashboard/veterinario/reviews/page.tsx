'use client';

import ContestReviewModal from '@/components/dashboard/reviews/contest-review-modal';
import ReviewCard from '@/components/dashboard/reviews/review-card';
import ReviewFilters from '@/components/dashboard/reviews/review-filters';
import { Button } from '@/components/ui/button';
import { getMyVetReviewsServerAction, VetReview, VetReviewFilters } from '@/lib/api/vet-reviews';
import { MessageSquare, Star, TrendingDown, TrendingUp } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function VeterinarianReviewsPage() {
  const [reviews, setReviews] = useState<VetReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<VetReviewFilters>({
    page: 1,
    perPage: 10,
    orderBy: 'createdAt',
    orderDirection: 'desc',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    total: 0,
    totalPages: 0,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [contestModal, setContestModal] = useState<{
    isOpen: boolean;
    reviewId: number;
    reviewComment?: string;
  }>({
    isOpen: false,
    reviewId: 0,
  });

  const loadReviews = useCallback(async () => {
    try {
      setLoading(true);
      
      const response = await getMyVetReviewsServerAction(filters);
      
      if (response.success && response.data) {
        setReviews(response.data.data);
        setPagination(response.data.meta);
      } else {
        toast.error(response.error || 'Erro ao carregar reviews');
        setReviews([]);
        setPagination({
          page: 1,
          perPage: 10,
          total: 0,
          totalPages: 0,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar reviews';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleFiltersChange = (newFilters: VetReviewFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    const defaultFilters: VetReviewFilters = {
      page: 1,
      perPage: 10,
      orderBy: 'createdAt',
      orderDirection: 'desc',
    };
    setFilters(defaultFilters);
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleContestReview = (reviewId: number, reviewComment?: string) => {
    setContestModal({
      isOpen: true,
      reviewId,
      reviewComment,
    });
  };

  const handleCloseContestModal = () => {
    setContestModal({
      isOpen: false,
      reviewId: 0,
    });
  };

  const calculateStats = () => {
    if (!reviews || reviews.length === 0) return { averageRating: 0, totalReviews: 0, positiveReviews: 0, negativeReviews: 0 };

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    const positiveReviews = reviews.filter(review => review.rating >= 4).length;
    const negativeReviews = reviews.filter(review => review.rating <= 2).length;

    return {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: reviews.length,
      positiveReviews,
      negativeReviews,
    };
  };

  const stats = calculateStats();

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Minhas Reviews</h1>
          <p className="mt-1 text-sm text-gray-600">
            Gerencie e acompanhe todas as reviews recebidas dos seus clientes.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="text-gray-600 hover:text-gray-700"
        >
          Filtros
        </Button>
      </div>

      {showFilters && (
        <ReviewFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Star className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Rating Médio</p>
              <div className="flex items-center space-x-1">
                {renderStars(stats.averageRating)}
                <span className="text-lg font-bold text-gray-900">{stats.averageRating}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Reviews</p>
              <p className="text-lg font-bold text-gray-900">{pagination?.total || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Positivas (4-5★)</p>
              <p className="text-lg font-bold text-gray-900">{stats.positiveReviews}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <TrendingDown className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Negativas (1-2★)</p>
              <p className="text-lg font-bold text-gray-900">{stats.negativeReviews}</p>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : reviews && reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onContest={(reviewId) => handleContestReview(reviewId, review.comment)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma review encontrada</h3>
          <p className="mt-1 text-sm text-gray-500">
            {Object.keys(filters).length > 3 
              ? 'Tente ajustar os filtros para encontrar reviews.'
              : 'Você ainda não recebeu nenhuma review dos seus clientes.'
            }
          </p>
        </div>
      )}

      {pagination?.totalPages && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 px-6 py-4">
          <div className="text-sm text-gray-700">
            Mostrando {((pagination?.page || 1) - 1) * (pagination?.perPage || 10) + 1} a{' '}
            {Math.min((pagination?.page || 1) * (pagination?.perPage || 10), pagination?.total || 0)} de{' '}
            {pagination?.total || 0} reviews
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange((pagination?.page || 1) - 1)}
              disabled={(pagination?.page || 1) === 1}
            >
              Anterior
            </Button>
            <span className="text-sm text-gray-700">
              Página {pagination?.page || 1} de {pagination?.totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange((pagination?.page || 1) + 1)}
              disabled={(pagination?.page || 1) === (pagination?.totalPages || 1)}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}

      <ContestReviewModal
        isOpen={contestModal.isOpen}
        onClose={handleCloseContestModal}
        reviewId={contestModal.reviewId}
        reviewComment={contestModal.reviewComment}
      />
    </div>
  );
} 