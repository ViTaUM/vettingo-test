'use client';

import { Button } from '@/components/ui/button';
import ConfirmationModal from '@/components/ui/confirmation-modal';
import { createUserEmail, deleteUserEmail, updateUserEmail } from '@/lib/api/user-emails';
import { UserEmail } from '@/lib/types/api';
import { Mail, Plus, Settings, Trash2 } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

interface EmailManagementProps {
  emails: UserEmail[];
  onEmailsChange?: (emails: UserEmail[]) => void;
  disabled?: boolean;
}

interface EmailFormData {
  email: string;
  isActive: boolean;
  isPublic: boolean;
  isPrimary: boolean;
}

export default function EmailManagement({ emails, onEmailsChange, disabled = false }: EmailManagementProps) {
  const handleEmailsChange = useMemo(() => onEmailsChange || (() => {}), [onEmailsChange]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<UserEmail | null>(null);
  const [formData, setFormData] = useState<EmailFormData>({
    email: '',
    isActive: true,
    isPublic: false,
    isPrimary: false,
  });
  const [loading, setLoading] = useState(false);

  const handleAddEmail = useCallback(async () => {
    if (!formData.email.trim()) {
      toast.error('Email é obrigatório');
      return;
    }

    setLoading(true);
    try {
      const result = await createUserEmail({
        email: formData.email.trim(),
        isActive: formData.isActive,
        isPublic: formData.isPublic,
        isPrimary: formData.isPrimary,
      });

      if (result.success && result.email) {
        const newEmails = [...emails, result.email];
        handleEmailsChange(newEmails);
        setShowAddModal(false);
        setFormData({ email: '', isActive: true, isPublic: false, isPrimary: false });
        toast.success('Email adicionado com sucesso!');
      } else {
        toast.error(result.error || 'Erro ao adicionar email');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao adicionar email';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [formData, emails, handleEmailsChange]);

  const handleEditEmail = useCallback(async () => {
    if (!selectedEmail) return;

    setLoading(true);
    try {
      const result = await updateUserEmail(selectedEmail.id, {
        isActive: formData.isActive,
        isPublic: formData.isPublic,
        isPrimary: formData.isPrimary,
      });

      if (result.success && result.email) {
        const updatedEmails = emails.map(email => 
          email.id === selectedEmail.id ? result.email! : email
        );
        handleEmailsChange(updatedEmails);
        setShowEditModal(false);
        setSelectedEmail(null);
        setFormData({ email: '', isActive: true, isPublic: false, isPrimary: false });
        toast.success('Email atualizado com sucesso!');
      } else {
        toast.error(result.error || 'Erro ao atualizar email');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar email';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [selectedEmail, formData, emails, handleEmailsChange]);

  const handleDeleteEmail = useCallback(async () => {
    if (!selectedEmail) return;

    setLoading(true);
    try {
      const result = await deleteUserEmail(selectedEmail.id);

      if (result.success) {
        const updatedEmails = emails.filter(email => email.id !== selectedEmail.id);
        handleEmailsChange(updatedEmails);
        setShowDeleteModal(false);
        setSelectedEmail(null);
        toast.success('Email removido com sucesso!');
      } else {
        toast.error(result.error || 'Erro ao remover email');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao remover email';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [selectedEmail, emails, handleEmailsChange]);

  const openEditModal = useCallback((email: UserEmail) => {
    setSelectedEmail(email);
    setFormData({
      email: email.email,
      isActive: email.isActive,
      isPublic: email.isPublic,
      isPrimary: email.isPrimary,
    });
    setShowEditModal(true);
  }, []);

  const openDeleteModal = useCallback((email: UserEmail) => {
    setSelectedEmail(email);
    setShowDeleteModal(true);
  }, []);

  const canDeleteEmail = useCallback((email: UserEmail) => {
    const activeEmails = emails.filter(e => e.isActive);
    return !email.isPrimary && activeEmails.length > 1;
  }, [emails]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-md font-medium text-gray-900 flex items-center">
          <Mail className="mr-2 h-4 w-4" />
          Emails
        </h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => setShowAddModal(true)}
          className="text-blue-600 hover:text-blue-700"
        >
          <Plus className="mr-1 h-3 w-3" />
          Adicionar Email
        </Button>
      </div>
      
      <div className="space-y-2">
        {emails.map((email) => (
          <div
            key={email.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-900">{email.email}</span>
              {email.isPrimary && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                  Principal
                </span>
              )}
              {email.isPublic && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                  Público
                </span>
              )}
              {!email.isActive && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                  Inativo
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={disabled}
                onClick={() => openEditModal(email)}
                className="text-gray-600 hover:text-gray-700"
              >
                <Settings className="h-3 w-3" />
              </Button>
              {canDeleteEmail(email) && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={disabled}
                  onClick={() => openDeleteModal(email)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        ))}
        
        {emails.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            <Mail className="mx-auto h-8 w-8 mb-2 text-gray-400" />
            <p className="text-sm">Nenhum email cadastrado</p>
          </div>
        )}
      </div>

      {/* Modal de Adicionar Email */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Adicionar Email</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Digite o email"
                    disabled={loading}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="mr-2"
                      disabled={loading}
                    />
                    <span className="text-sm text-gray-700">Ativo</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isPublic}
                      onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                      className="mr-2"
                      disabled={loading}
                    />
                    <span className="text-sm text-gray-700">Público</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isPrimary}
                      onChange={(e) => setFormData(prev => ({ ...prev, isPrimary: e.target.checked }))}
                      className="mr-2"
                      disabled={loading}
                    />
                    <span className="text-sm text-gray-700">Principal</span>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleAddEmail}
                  disabled={loading}
                  loading={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Adicionar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Editar Email */}
      {showEditModal && selectedEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowEditModal(false)} />
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Editar Email</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900">
                  {selectedEmail.email}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  O endereço de email não pode ser alterado
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="mr-2"
                    disabled={loading}
                  />
                  <span className="text-sm text-gray-700">Ativo</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isPublic}
                    onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                    className="mr-2"
                    disabled={loading}
                  />
                  <span className="text-sm text-gray-700">Público</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isPrimary}
                    onChange={(e) => setFormData(prev => ({ ...prev, isPrimary: e.target.checked }))}
                    className="mr-2"
                    disabled={loading}
                  />
                  <span className="text-sm text-gray-700">Principal</span>
                </label>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowEditModal(false)}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleEditEmail}
                  disabled={loading}
                  loading={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Salvar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Deletar */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteEmail}
        title="Remover Email"
        message={`Tem certeza que deseja remover o email "${selectedEmail?.email}"? Esta ação não pode ser desfeita.`}
        confirmText="Remover"
        cancelText="Cancelar"
        variant="danger"
        loading={loading}
      />
    </div>
  );
} 