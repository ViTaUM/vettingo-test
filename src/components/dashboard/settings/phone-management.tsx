'use client';

import { Button } from '@/components/ui/button';
import ConfirmationModal from '@/components/ui/confirmation-modal';
import { createUserPhone, deleteUserPhone, updateUserPhone } from '@/lib/api/user-phones';
import { UserPhone } from '@/lib/types/api';
import { Phone, Plus, Settings, Trash2 } from 'lucide-react';
import { cleanFormattedValue } from '@/utils/cn';
import { useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

interface PhoneManagementProps {
  phones: UserPhone[];
  onPhonesChange?: (phones: UserPhone[]) => void;
  disabled?: boolean;
}

interface PhoneFormData {
  number: string;
  areaCode: string;
  countryCode: string;
  isWhatsapp: boolean;
  isActive: boolean;
  isPublic: boolean;
  isPrimary: boolean;
}

export default function PhoneManagement({ phones, onPhonesChange, disabled = false }: PhoneManagementProps) {
  const handlePhonesChange = useMemo(() => onPhonesChange || (() => {}), [onPhonesChange]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPhone, setSelectedPhone] = useState<UserPhone | null>(null);
  const [formData, setFormData] = useState<PhoneFormData>({
    number: '',
    areaCode: '',
    countryCode: '55',
    isWhatsapp: false,
    isActive: true,
    isPublic: false,
    isPrimary: false,
  });
  const [loading, setLoading] = useState(false);

  const formatPhone = (phone: UserPhone) => {
    return `+${phone.ddi} (${phone.ddd}) ${phone.number}`;
  };

  const handleAddPhone = useCallback(async () => {
    if (!formData.number.trim() || !formData.areaCode.trim()) {
      toast.error('Número e DDD são obrigatórios');
      return;
    }

    setLoading(true);
    try {
      const result = await createUserPhone({
        number: cleanFormattedValue(formData.number.trim()),
        areaCode: cleanFormattedValue(formData.areaCode.trim()),
        countryCode: cleanFormattedValue(formData.countryCode),
        isWhatsapp: formData.isWhatsapp,
        isActive: formData.isActive,
        isPublic: formData.isPublic,
        isPrimary: formData.isPrimary,
      });

      if (result.success && result.phone) {
        const newPhones = [...phones, result.phone];
        handlePhonesChange(newPhones);
        setShowAddModal(false);
        setFormData({ 
          number: '', 
          areaCode: '', 
          countryCode: '55', 
          isWhatsapp: false, 
          isActive: true, 
          isPublic: false, 
          isPrimary: false 
        });
        toast.success('Telefone adicionado com sucesso!');
      } else {
        toast.error(result.error || 'Erro ao adicionar telefone');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao adicionar telefone';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [formData, phones, handlePhonesChange]);

  const handleEditPhone = useCallback(async () => {
    if (!selectedPhone) return;

    setLoading(true);
    try {
      const result = await updateUserPhone(selectedPhone.id, {
        isWhatsapp: formData.isWhatsapp,
        isActive: formData.isActive,
        isPublic: formData.isPublic,
        isPrimary: formData.isPrimary,
      });

      if (result.success && result.phone) {
        const updatedPhones = phones.map(phone => 
          phone.id === selectedPhone.id ? result.phone! : phone
        );
        handlePhonesChange(updatedPhones);
        setShowEditModal(false);
        setSelectedPhone(null);
        setFormData({ 
          number: '', 
          areaCode: '', 
          countryCode: '55', 
          isWhatsapp: false, 
          isActive: true, 
          isPublic: false, 
          isPrimary: false 
        });
        toast.success('Telefone atualizado com sucesso!');
      } else {
        toast.error(result.error || 'Erro ao atualizar telefone');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar telefone';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [selectedPhone, formData, phones, handlePhonesChange]);

  const handleDeletePhone = useCallback(async () => {
    if (!selectedPhone) return;

    setLoading(true);
    try {
      const result = await deleteUserPhone(selectedPhone.id);

      if (result.success) {
        const updatedPhones = phones.filter(phone => phone.id !== selectedPhone.id);
        handlePhonesChange(updatedPhones);
        setShowDeleteModal(false);
        setSelectedPhone(null);
        toast.success('Telefone removido com sucesso!');
      } else {
        toast.error(result.error || 'Erro ao remover telefone');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao remover telefone';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [selectedPhone, phones, handlePhonesChange]);

  const openEditModal = useCallback((phone: UserPhone) => {
    setSelectedPhone(phone);
    setFormData({
      number: phone.number,
      areaCode: phone.ddd,
      countryCode: phone.ddi,
      isWhatsapp: phone.isWhatsApp,
      isActive: phone.isActive,
      isPublic: phone.isPublic,
      isPrimary: phone.isPrimary,
    });
    setShowEditModal(true);
  }, []);

  const openDeleteModal = useCallback((phone: UserPhone) => {
    setSelectedPhone(phone);
    setShowDeleteModal(true);
  }, []);

  const canDeletePhone = useCallback((phone: UserPhone) => {
    const activePhones = phones.filter(p => p.isActive);
    return !phone.isPrimary && activePhones.length > 1;
  }, [phones]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-md font-medium text-gray-900 flex items-center">
          <Phone className="mr-2 h-4 w-4" />
          Telefones
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
          Adicionar Telefone
        </Button>
      </div>
      
      <div className="space-y-2">
        {phones.map((phone) => (
          <div
            key={phone.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-900">{formatPhone(phone)}</span>
              {phone.isPrimary && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                  Principal
                </span>
              )}
              {phone.isWhatsApp && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                  WhatsApp
                </span>
              )}
              {phone.isPublic && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                  Público
                </span>
              )}
              {!phone.isActive && (
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
                onClick={() => openEditModal(phone)}
                className="text-gray-600 hover:text-gray-700"
              >
                <Settings className="h-3 w-3" />
              </Button>
              {canDeletePhone(phone) && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={disabled}
                  onClick={() => openDeleteModal(phone)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        ))}
        
        {phones.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            <Phone className="mx-auto h-8 w-8 mb-2 text-gray-400" />
            <p className="text-sm">Nenhum telefone cadastrado</p>
          </div>
        )}
      </div>

      {/* Modal de Adicionar Telefone */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Adicionar Telefone</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      DDI
                    </label>
                    <input
                      type="text"
                      value={formData.countryCode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        if (value.length <= 3) {
                          setFormData(prev => ({ ...prev, countryCode: value }));
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="55"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      DDD
                    </label>
                    <input
                      type="text"
                      value={formData.areaCode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        if (value.length <= 2) {
                          setFormData(prev => ({ ...prev, areaCode: value }));
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="11"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número
                    </label>
                    <input
                      type="text"
                      value={formData.number}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        if (value.length <= 9) {
                          setFormData(prev => ({ ...prev, number: value }));
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="999887766"
                      disabled={loading}
                    />
                  </div>
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
                      checked={formData.isWhatsapp}
                      onChange={(e) => setFormData(prev => ({ ...prev, isWhatsapp: e.target.checked }))}
                      className="mr-2"
                      disabled={loading}
                    />
                    <span className="text-sm text-gray-700">WhatsApp</span>
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
                  onClick={handleAddPhone}
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

      {/* Modal de Editar Telefone */}
      {showEditModal && selectedPhone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowEditModal(false)} />
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Editar Telefone</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900">
                  {formatPhone(selectedPhone)}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  O número de telefone não pode ser alterado
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
                    checked={formData.isWhatsapp}
                    onChange={(e) => setFormData(prev => ({ ...prev, isWhatsapp: e.target.checked }))}
                    className="mr-2"
                    disabled={loading}
                  />
                  <span className="text-sm text-gray-700">WhatsApp</span>
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
                  onClick={handleEditPhone}
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
        onConfirm={handleDeletePhone}
        title="Remover Telefone"
        message={`Tem certeza que deseja remover o telefone "${selectedPhone ? formatPhone(selectedPhone) : ''}"? Esta ação não pode ser desfeita.`}
        confirmText="Remover"
        cancelText="Cancelar"
        variant="danger"
        loading={loading}
      />
    </div>
  );
} 