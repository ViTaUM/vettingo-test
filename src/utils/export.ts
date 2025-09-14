// Utilitário para exportação de dados em diferentes formatos
// Suporta CSV e Excel (XLSX) para relatórios e análises

export interface ExportOptions {
  filename?: string;
  format: 'csv' | 'xlsx';
  includeHeaders?: boolean;
  dateFormat?: string;
}

export interface ExportData {
  headers: string[];
  rows: (string | number | Date)[][];
  sheetName?: string;
}

/**
 * Exporta dados para CSV
 * Formato simples e compatível com a maioria dos editores de planilha
 */
export function exportToCSV(data: ExportData, options: ExportOptions): void {
  const { filename = 'export', includeHeaders = true } = options;

  // Formata as datas para o formato brasileiro
  const formatDate = (value: string | number | Date): string => {
    if (value instanceof Date) {
      return value.toLocaleDateString('pt-BR');
    }
    return String(value);
  };

  // Escapa valores que contêm vírgulas ou aspas
  const escapeCSVValue = (value: string): string => {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  const csvContent = [
    // Cabeçalhos
    ...(includeHeaders ? [data.headers.map(escapeCSVValue).join(',')] : []),
    // Dados
    ...data.rows.map((row) => row.map((cell) => escapeCSVValue(formatDate(cell))).join(',')),
  ].join('\n');

  downloadFile(csvContent, `${filename}.csv`, 'text/csv;charset=utf-8;');
}

/**
 * Exporta dados para Excel (XLSX)
 * Requer a biblioteca xlsx para funcionar
 */
export async function exportToExcel(data: ExportData, options: ExportOptions): Promise<void> {
  const { filename = 'export', includeHeaders = true } = options;

  try {
    // Importação dinâmica da biblioteca xlsx
    const XLSX = await import('xlsx');

    // Prepara os dados para o Excel
    const excelData = includeHeaders ? [data.headers, ...data.rows] : data.rows;

    // Cria a planilha
    const worksheet = XLSX.utils.aoa_to_sheet(excelData);

    // Ajusta a largura das colunas automaticamente
    const columnWidths = data.headers.map((header) => ({
      wch: Math.max(header.length, 15),
    }));
    worksheet['!cols'] = columnWidths;

    // Cria o workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, data.sheetName || 'Dados');

    // Exporta o arquivo
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  } catch (error) {
    console.error('Erro ao exportar para Excel:', error);
    throw new Error('Não foi possível exportar para Excel. Verifique se a biblioteca xlsx está instalada.');
  }
}

/**
 * Função principal de exportação
 * Escolhe o formato baseado nas opções fornecidas
 */
export async function exportData(data: ExportData, options: ExportOptions): Promise<void> {
  try {
    if (options.format === 'csv') {
      exportToCSV(data, options);
    } else if (options.format === 'xlsx') {
      await exportToExcel(data, options);
    } else {
      throw new Error(`Formato de exportação não suportado: ${options.format}`);
    }
  } catch (error) {
    console.error('Erro na exportação:', error);
    throw error;
  }
}

/**
 * Função auxiliar para download de arquivos
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();

  // Limpa os recursos
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Formata valores monetários para exportação
 */
export function formatCurrencyForExport(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Formata números para exportação
 */
export function formatNumberForExport(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value);
}

/**
 * Formata datas para exportação
 */
export function formatDateForExport(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('pt-BR');
}

/**
 * Gera nome de arquivo com timestamp
 */
export function generateFilename(prefix: string, extension: string): string {
  const timestamp = new Date().toISOString().split('T')[0];
  return `${prefix}-${timestamp}.${extension}`;
}
