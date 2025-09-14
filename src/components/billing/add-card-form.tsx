'use client';

import { useState } from 'react';
import { CreditCard } from 'lucide-react';
import UIButton from '@/components/ui/button';

interface AddCardFormProps {
  onBack: () => void;
  onSubmit: (cardData: CardFormData) => void;
}

interface CardFormData {
  cardNumber: string;
  cvc: string;
  expiryDate: string;
  cardName: string;
  cpf: string;
}

export default function AddCardForm({ onBack, onSubmit }: AddCardFormProps) {
  const [formData, setFormData] = useState<CardFormData>({
    cardNumber: '',
    cvc: '',
    expiryDate: '',
    cardName: '',
    cpf: '',
  });

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const formatCVC = (value: string) => {
    return value.replace(/[^0-9]/g, '').substring(0, 4);
  };

  const formatCPF = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length <= 11) {
      return v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return v.substring(0, 11).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const handleInputChange = (field: keyof CardFormData, value: string) => {
    let formattedValue = value;

    switch (field) {
      case 'cardNumber':
        formattedValue = formatCardNumber(value);
        break;
      case 'expiryDate':
        formattedValue = formatExpiryDate(value);
        break;
      case 'cvc':
        formattedValue = formatCVC(value);
        break;
      case 'cardName':
        formattedValue = value.toUpperCase();
        break;
      case 'cpf':
        formattedValue = formatCPF(value);
        break;
    }

    setFormData(prev => ({
      ...prev,
      [field]: formattedValue
    }));
  };

  const getCardBrand = (cardNumber: string) => {
    const number = cardNumber.replace(/\s/g, '');
    
    if (number.startsWith('4')) return 'VISA';
    if (number.startsWith('5') || number.startsWith('2')) return 'MASTERCARD';
    if (number.startsWith('3')) return 'AMEX';
    
    return 'CARD';
  };

  const getCardColor = (cardNumber: string) => {
    const brand = getCardBrand(cardNumber);
    
    switch (brand) {
      case 'VISA':
        return 'from-blue-500 to-blue-600';
      case 'MASTERCARD':
        return 'from-red-500 to-red-600';
      case 'AMEX':
        return 'from-green-500 to-green-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">Adicionar Cartão</h3>
        <p className="text-sm text-gray-600 mt-1">Adicione um novo método de pagamento</p>
      </div>

      {/* Card Preview */}
      <div className="flex justify-center mb-6">
        <div className={`w-80 h-48 rounded-2xl bg-gradient-to-r ${getCardColor(formData.cardNumber)} p-6 text-white shadow-xl transform transition-all duration-300 hover:scale-105`}>
          <div className="flex justify-between items-start mb-8">
            <div className="w-12 h-8 bg-yellow-400 rounded-md"></div>
            <div className="text-right">
              <div className="text-xs opacity-80">CARD TYPE</div>
              <div className="font-semibold text-sm">
                {getCardBrand(formData.cardNumber)}
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="text-xl font-mono tracking-wider">
              {formData.cardNumber || '•••• •••• •••• ••••'}
            </div>
          </div>
          
          <div className="flex justify-between items-end">
            <div>
              <div className="text-xs opacity-80 mb-1">CARD HOLDER</div>
              <div className="font-semibold text-sm">
                {formData.cardName || 'SEU NOME'}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs opacity-80 mb-1">EXPIRES</div>
              <div className="font-semibold text-sm">
                {formData.expiryDate || 'MM/YY'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-2">
            Número do Cartão
          </label>
          <div className="relative">
            <input
              type="text"
              id="cardNumber"
              value={formData.cardNumber}
              onChange={(e) => handleInputChange('cardNumber', e.target.value)}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-12"
            />
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-2">
              Data de Expiração
            </label>
            <input
              type="text"
              id="expiryDate"
              value={formData.expiryDate}
              onChange={(e) => handleInputChange('expiryDate', e.target.value)}
              placeholder="MM/YY"
              maxLength={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-2">
              CVC
            </label>
            <input
              type="text"
              id="cvc"
              value={formData.cvc}
              onChange={(e) => handleInputChange('cvc', e.target.value)}
              placeholder="123"
              maxLength={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-2">
            Nome do Cartão
          </label>
          <input
            type="text"
            id="cardName"
            value={formData.cardName}
            onChange={(e) => handleInputChange('cardName', e.target.value)}
            placeholder="SEU NOME COMPLETO"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-2">
            CPF
          </label>
          <input
            type="text"
            id="cpf"
            value={formData.cpf}
            onChange={(e) => handleInputChange('cpf', e.target.value)}
            placeholder="000.000.000-00"
            maxLength={14}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex justify-end pt-4">
          <UIButton
            type="submit"
            variant="solid"
            size="md"
            className="bg-blue-600 hover:bg-blue-700">
            Próximo
          </UIButton>
        </div>
      </form>
    </div>
  );
} 