import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { LoadingProvider } from '@/components/ui/loading-provider';
import { AuthGuard } from '@/components/auth-guard';
import { AuthErrorBoundary } from '@/components/auth-error-boundary';

const interSans = Inter({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://vettingo.com.br'),
  title: 'Vettingo | Encontre o seu veterinário',
  description: 'Encontre o veterinário ideal para o seu pet com Vettingo. Avaliações, recomendações e muito mais.',
  authors: [
    {
      name: 'Lucas Larangeira',
      url: 'https://www.linkedin.com/in/lukearch/',
    },
    {
      name: 'Blitz IT Solutions',
      url: 'https://www.sejablitz.com.br/',
    },
  ],
  keywords: [
    'Vettingo',
    'Veterinário',
    'Veterinários',
    'Veterinário ideal',
    'Veterinário para o seu pet',
    'Encontre veterinário',
    'Avaliações de veterinários',
    'Recomendações de veterinários',
  ],
  robots: 'index, follow',
  category: 'website',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${interSans.variable} antialiased`}>
        <AuthErrorBoundary>
          <AuthGuard>
        <LoadingProvider>{children}</LoadingProvider>
          </AuthGuard>
        </AuthErrorBoundary>
      </body>
    </html>
  );
}
