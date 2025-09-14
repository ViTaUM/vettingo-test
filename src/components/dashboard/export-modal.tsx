'use client';

import { useState, useEffect } from 'react';
import { X, Download, FileText, FileSpreadsheet } from 'lucide-react';
import UIButton from '@/components/ui/button';
import FormSelect from '@/components/form/select';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: 'csv' | 'xlsx') => void;
  title?: string;
  description?: string;
}

export default function ExportModal({
  isOpen,
  onClose,
  onExport,
  title = 'Exportar Relatório',
  description = 'Escolha o formato de exportação desejado',
}: ExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'xlsx'>('csv');
  const [isExporting, setIsExporting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Controla a animação de entrada/saída
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport(selectedFormat);
      onClose();
    } catch (error) {
      console.error('Erro na exportação:', error);
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen && !isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop com blur */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-black/10 to-black/5 backdrop-blur-[2px] transition-all duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-md transform rounded-2xl border border-white/30 bg-white/90 p-6 shadow-2xl backdrop-blur-lg transition-all duration-300 before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/20 before:to-transparent ${
          isOpen ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-4 scale-95 opacity-0'
        }`}>
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-600">{description}</p>
          </div>
          <button onClick={onClose} className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Format Selection */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Formato de Exportação</label>
            <FormSelect
              name="exportFormat"
              value={selectedFormat}
              options={[
                {
                  value: 'csv',
                  label: 'CSV (Comma Separated Values)',
                },
                {
                  value: 'xlsx',
                  label: 'Excel (XLSX)',
                },
              ]}
              onChange={(value) => setSelectedFormat(value as 'csv' | 'xlsx')}
            />
          </div>

          {/* Format Description */}
          <div className="rounded-xl border border-gray-200/50 bg-gradient-to-br from-gray-50/80 to-gray-100/60 p-4 backdrop-blur-sm">
            <div className="flex items-start space-x-3">
              {selectedFormat === 'csv' ? (
                <div className="flex-shrink-0 rounded-lg bg-blue-100/80 p-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
              ) : (
                <div className="flex-shrink-0 rounded-lg bg-green-100/80 p-2">
                  <FileSpreadsheet className="h-5 w-5 text-green-600" />
                </div>
              )}
              <div>
                <h4 className="text-sm font-semibold text-gray-900">
                  {selectedFormat === 'csv' ? 'CSV' : 'Excel (XLSX)'}
                </h4>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">
                  {selectedFormat === 'csv'
                    ? 'Formato simples e compatível com a maioria dos editores de planilha. Ideal para análise rápida.'
                    : 'Formato avançado com suporte a múltiplas abas, formatação e fórmulas. Ideal para relatórios complexos.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end space-x-3">
          <UIButton
            variant="outline"
            onClick={onClose}
            disabled={isExporting}
            className="border-gray-300/50 bg-white/80 backdrop-blur-sm hover:bg-gray-50/90">
            Cancelar
          </UIButton>
          <UIButton
            onClick={handleExport}
            disabled={isExporting}
            loading={isExporting}
            className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg hover:from-blue-700 hover:to-blue-800">
            <Download className="mr-2 h-4 w-4" />
            {isExporting ? 'Exportando...' : 'Exportar'}
          </UIButton>
        </div>
      </div>
    </div>
  );
}
