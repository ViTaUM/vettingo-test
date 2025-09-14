'use client';

import DocumentUpload from '@/components/form/document-upload';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { submitApprovalDocuments } from '@/lib/api/veterinarians';
import { VeterinarianApproval, VeterinarianApprovalStatus } from '@/lib/types/api';
import { AlertCircle, CheckCircle, Clock, FileText, Upload, X } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface VeterinarianApprovalStatusProps {
  veterinarianId: number;
  approval?: VeterinarianApproval;
  onApprovalUpdate?: (approval: VeterinarianApproval) => void;
}

export default function VeterinarianApprovalStatusComponent({ 
  veterinarianId, 
  approval, 
  onApprovalUpdate 
}: VeterinarianApprovalStatusProps) {
  const [submitting, setSubmitting] = useState(false);
  const [rgFrontImage, setRgFrontImage] = useState<string>('');
  const [rgBackImage, setRgBackImage] = useState<string>('');
  const [crmvDocumentImage, setCrmvDocumentImage] = useState<string>('');

  const handleSubmitDocuments = async () => {
    if (!rgFrontImage || !rgBackImage || !crmvDocumentImage) {
      toast.error('Por favor, envie todas as imagens necessárias');
      return;
    }

    try {
      setSubmitting(true);
      const result = await submitApprovalDocuments(veterinarianId, {
        rgFrontImage,
        rgBackImage,
        crmvDocumentImage,
      });

      if (result.success && result.approval) {
        setRgFrontImage('');
        setRgBackImage('');
        setCrmvDocumentImage('');
        onApprovalUpdate?.(result.approval);
        toast.success('Documentos enviados com sucesso! Aguardando aprovação.');
      } else {
        toast.error(result.error || 'Erro ao enviar documentos');
      }
    } catch {
      toast.error('Erro ao enviar documentos');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: VeterinarianApprovalStatus) => {
    const statusConfig = {
      [VeterinarianApprovalStatus.WAITING_DATA]: {
        variant: 'secondary' as const,
        text: 'Aguardando Documentos',
        description: 'Envie seus documentos para iniciar o processo de aprovação',
        icon: Upload,
      },
      [VeterinarianApprovalStatus.PENDING_APPROVAL]: {
        variant: 'default' as const,
        text: 'Em Análise',
        description: 'Seus documentos estão sendo analisados pela nossa equipe',
        icon: Clock,
      },
      [VeterinarianApprovalStatus.APPROVED]: {
        variant: 'default' as const,
        text: 'Aprovado',
        description: 'Seu perfil foi aprovado e está visível na plataforma',
        icon: CheckCircle,
      },
      [VeterinarianApprovalStatus.REJECTED]: {
        variant: 'outline' as const,
        text: 'Rejeitado',
        description: approval?.rejectionReason || 'Seus documentos foram rejeitados',
        icon: X,
      },
    };

    return statusConfig[status];
  };

  if (!approval) {
    return (
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Status de Aprovação</h3>
          <p className="text-sm text-gray-600">Não foi possível carregar o status de aprovação</p>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusBadge(approval.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Status de Aprovação</h3>
        </div>
        <p className="text-sm text-gray-600">Controle de aprovação do seu perfil profissional</p>
      </div>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Badge variant={statusConfig.variant} className="flex items-center gap-1">
            <StatusIcon className="h-3 w-3" />
            {statusConfig.text}
          </Badge>
          <p className="text-sm text-gray-600">{statusConfig.description}</p>
        </div>

        {approval.status === VeterinarianApprovalStatus.WAITING_DATA && (
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800 mb-1">Perfil não visível</h4>
                  <p className="text-sm text-yellow-700">
                    Seu perfil não aparecerá em nenhuma busca até que você complete o processo de aprovação. 
                    Envie os documentos solicitados para que possamos verificar sua identidade e credenciais profissionais.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <DocumentUpload
                  label="RG - Frente"
                  value={rgFrontImage}
                  onChange={setRgFrontImage}
                  placeholder="Clique para fazer upload"
                />
              </div>
              <div className="space-y-2">
                <DocumentUpload
                  label="RG - Verso"
                  value={rgBackImage}
                  onChange={setRgBackImage}
                  placeholder="Clique para fazer upload"
                />
              </div>
              <div className="space-y-2">
                <DocumentUpload
                  label="Documento CRMV"
                  value={crmvDocumentImage}
                  onChange={setCrmvDocumentImage}
                  placeholder="Clique para fazer upload"
                />
              </div>
            </div>
            <Button 
              onClick={handleSubmitDocuments} 
              disabled={submitting || !rgFrontImage || !rgBackImage || !crmvDocumentImage}
              className="w-full"
            >
              {submitting ? 'Enviando...' : 'Enviar Documentos para Aprovação'}
            </Button>
          </div>
        )}

        {approval.status === VeterinarianApprovalStatus.REJECTED && (
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <X className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-800 mb-2">Motivo da Rejeição</h4>
                  <p className="text-red-700">{approval.rejectionReason}</p>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
              className="w-full"
            >
              Tentar Novamente
            </Button>
          </div>
        )}

        {approval.status === VeterinarianApprovalStatus.APPROVED && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-800 mb-2">Perfil Aprovado!</h4>
                <p className="text-green-700">
                  Seu perfil foi aprovado e está visível na plataforma. Você pode agora receber consultas e gerenciar seu perfil profissional.
                </p>
              </div>
            </div>
          </div>
        )}

        {approval.status === VeterinarianApprovalStatus.PENDING_APPROVAL && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Documentos em Análise</h4>
                <p className="text-blue-700">
                  Seus documentos foram enviados e estão sendo analisados pela nossa equipe. 
                  Você receberá uma notificação assim que a análise for concluída.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 