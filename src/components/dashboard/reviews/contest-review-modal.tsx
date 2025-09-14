'use client';

import HookFormTextarea from '@/components/form/hook-form-textarea';
import { Button } from '@/components/ui/button';
import { requestReviewRemoval } from '@/lib/api/vet-reviews';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, Flag } from 'lucide-react';
import { Fragment, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

const contestReviewSchema = z.object({
  reason: z
    .string()
    .min(10, 'O motivo deve ter pelo menos 10 caracteres')
    .max(500, 'O motivo deve ter no máximo 500 caracteres'),
});

type ContestReviewData = z.infer<typeof contestReviewSchema>;

interface ContestReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviewId: number;
  reviewComment?: string;
}

const ContestReviewModal = ({ isOpen, onClose, reviewId, reviewComment }: ContestReviewModalProps) => {
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contestReviewSchema),
    defaultValues: {
      reason: '',
    },
  });

  const onSubmit = async (data: ContestReviewData) => {
    setSubmitting(true);

    try {
      await requestReviewRemoval({
        reviewId,
        reason: data.reason,
      });

      toast.success('Solicitação de contestação enviada com sucesso!');
      reset();
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao enviar contestação';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      reset();
      onClose();
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/25" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95">
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <Flag className="h-5 w-5 text-orange-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Contestar Review</h3>
                    <p className="text-sm text-gray-600">Solicitar remoção de review inadequada</p>
                  </div>
                </div>

                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-1">Review #{reviewId}</h4>
                      {reviewComment && (
                        <p className="text-sm text-gray-600 line-clamp-3">{reviewComment}</p>
                      )}
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <HookFormTextarea
                    label="Motivo da contestação"
                    name="reason"
                    control={control}
                    error={errors.reason?.message}
                    placeholder="Descreva o motivo pelo qual esta review deve ser removida..."
                    required
                    disabled={submitting}
                    rows={4}
                  />

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-800">
                      <strong>Importante:</strong> Sua solicitação será analisada pela nossa equipe. 
                      Reviews serão removidas apenas se violarem nossos termos de uso ou políticas da plataforma.
                    </p>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClose}
                      disabled={submitting}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      variant="solid"
                      disabled={submitting}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      {submitting ? 'Enviando...' : 'Enviar Contestação'}
                    </Button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ContestReviewModal; 