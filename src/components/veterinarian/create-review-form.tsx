'use client';

import { useAuthStatus } from '@/hooks/use-auth-status';
import { createVetReview } from '@/lib/api/vet-reviews';
import { CreateVetReviewDto } from '@/lib/types/api';
import { MessageSquare, Star } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface CreateReviewFormProps {
  veterinarianId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function CreateReviewForm({ veterinarianId, onSuccess, onCancel }: CreateReviewFormProps) {
  const { user } = useAuthStatus();

  const [formData, setFormData] = useState<CreateVetReviewDto>({
    veterinarianId,
    anonymous: false,
    authorName: '',
    authorAvatar: '',
    rating: 5,
    comment: '',
  });

  const [loading, setLoading] = useState(false);

  // Preencher automaticamente os dados do usuário quando disponível
  useEffect(() => {
    if (user && !formData.anonymous) {
      setFormData((prev) => ({
        ...prev,
        authorName: `${user.firstName} ${user.lastName}`.trim(),
        authorAvatar: user.avatar || '',
      }));
    }
  }, [user, formData.anonymous]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.rating) {
      toast.error('Por favor, selecione uma avaliação');
      return;
    }

    if (!formData.comment?.trim()) {
      toast.error('Por favor, adicione um comentário');
      return;
    }

    // Preparar dados finais para envio
    const finalData: CreateVetReviewDto = {
      ...formData,
      // Se for anônimo, não enviar nome e avatar
      authorName: formData.anonymous ? undefined : formData.authorName,
      authorAvatar: formData.anonymous ? undefined : formData.authorAvatar,
    };

    setLoading(true);

    try {
      await createVetReview(finalData);
      toast.success('Avaliação enviada com sucesso!');
      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao enviar avaliação';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => setFormData((prev) => ({ ...prev, rating: i + 1 }))}
        className={`h-6 w-6 transition-colors ${
          i < rating ? 'fill-current text-yellow-400' : 'text-gray-300'
        } hover:text-yellow-400`}>
        <Star className="h-full w-full" />
      </button>
    ));
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
          <MessageSquare className="h-4 w-4 text-blue-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Deixar Avaliação</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Sua Avaliação</label>
          <div className="flex items-center gap-1">
            {renderStars(formData.rating)}
            <span className="ml-2 text-sm text-gray-600">
              {formData.rating} estrela{formData.rating !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Anonymous Toggle */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="anonymous"
            checked={formData.anonymous}
            onChange={(e) => setFormData((prev) => ({ ...prev, anonymous: e.target.checked }))}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="anonymous" className="text-sm text-gray-700">
            Avaliação anônima
          </label>
        </div>

        {/* User Info Preview (only if not anonymous and user is available) */}
        {!formData.anonymous && user && (
          <div className="rounded-lg bg-gray-50 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-emerald-500">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt="Avatar"
                    className="h-full w-full rounded-full object-cover"
                    width={32}
                    height={32}
                  />
                ) : (
                  <span className="text-sm font-bold text-white">
                    {user.firstName?.charAt(0)}
                    {user.lastName?.charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Avaliando como: {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500">Seus dados serão usados automaticamente</p>
              </div>
            </div>
          </div>
        )}

        {/* Comment */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Comentário *</label>
          <textarea
            value={formData.comment}
            onChange={(e) => setFormData((prev) => ({ ...prev, comment: e.target.value }))}
            rows={4}
            className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            placeholder="Conte sua experiência com este veterinário..."
            required
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
            {loading ? 'Enviando...' : 'Enviar Avaliação'}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-200">
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
