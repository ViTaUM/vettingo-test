'use client';

import UIButton from '@/components/ui/button';
import { deleteUserAccount } from '@/lib/api/users';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface DeleteAccountFormProps {
  onMessage?: (message: { type: 'success' | 'error'; text: string }) => void;
}

export default function DeleteAccountForm({ onMessage }: DeleteAccountFormProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [deleting, setDeleting] = useState(false);

  const handleDeleteClick = async () => {
    if (!showConfirmation) {
      setShowConfirmation(true);
      return;
    }

    if (confirmationText.toLowerCase() === 'excluir') {
      setDeleting(true);
      try {
        const result = await deleteUserAccount();
        if (result.success) {
        } else {
          onMessage?.({ type: 'error', text: result.error || 'Erro ao excluir conta' });
        }
      } catch {
        onMessage?.({ type: 'error', text: 'Erro ao excluir conta' });
      }
      setDeleting(false);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setConfirmationText('');
  };

  const isConfirmationValid = confirmationText.toLowerCase() === 'excluir';

  return (
    <div className="rounded-lg bg-white shadow">
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center">
          <Trash2 className="mr-3 h-5 w-5 text-red-500" />
          <h2 className="text-lg font-semibold text-gray-900">Excluir Conta</h2>
        </div>
      </div>
      <div className="p-6">
        <div className="mb-6 rounded-lg bg-red-50 p-4">
          <div className="flex">
            <AlertTriangle className="mt-0.5 mr-3 h-5 w-5 text-red-400" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Atenção!</h3>
              <p className="mt-1 text-sm text-red-700">
                Esta ação é irreversível. Todos os seus dados, incluindo pets, consultas e históricos serão
                permanentemente removidos. Você não poderá recuperar essas informações posteriormente.
              </p>
            </div>
          </div>
        </div>

        {!showConfirmation ? (
          <div>
            <p className="mb-4 text-gray-600">
              Se você deseja excluir permanentemente sua conta, clique no botão abaixo. Lembre-se de que esta ação não
              pode ser desfeita.
            </p>
            <UIButton
              onClick={handleDeleteClick}
              variant="outline"
              size="md"
              className="border-red-300 bg-white text-red-700 hover:bg-red-50">
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir Minha Conta
            </UIButton>
          </div>
        ) : (
          <div>
            <p className="mb-4 text-gray-600">
              Para confirmar a exclusão da sua conta, digite <strong>&ldquo;excluir&rdquo;</strong> no campo abaixo:
            </p>
            <div className="mb-4">
              <input
                type="text"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                placeholder="Digite: excluir"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-500 transition-all duration-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none"
              />
            </div>
            <div className="flex space-x-3">
              <UIButton
                onClick={handleDeleteClick}
                disabled={deleting || !isConfirmationValid}
                loading={deleting}
                variant="solid"
                size="md"
                className="bg-red-600 hover:bg-red-700">
                <Trash2 className="mr-2 h-4 w-4" />
                {deleting ? 'Excluindo...' : 'Confirmar Exclusão'}
              </UIButton>
              <UIButton
                onClick={handleCancel}
                disabled={deleting}
                variant="outline"
                size="md"
                className="border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
                Cancelar
              </UIButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
