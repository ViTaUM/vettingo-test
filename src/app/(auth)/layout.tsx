import AuthHeader from '@/components/auth-header';
import Footer from '@/components/footer';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  // Verificar se existe token de autenticação (mais performático que chamar a API)
  const cookieStore = await cookies();
  const authToken = cookieStore.get('auth-token');

  if (authToken?.value) {
    // Se tem token, redirecionar para dashboard padrão
    // O próprio dashboard fará a verificação de role e redirecionamento correto
    redirect('/dashboard');
  }

  return (
    <>
      <AuthHeader />
      {children}
      <Footer />
    </>
  );
}
