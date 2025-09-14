import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');
  const { pathname } = request.nextUrl;

  // Rotas que não precisam de autenticação
  const publicRoutes = ['/login', '/cadastre-se', '/esqueci-minha-senha', '/', '/sobre', '/contato', '/faq', '/planos', '/politica-de-privacidade', '/termos-de-uso', '/busca'];
  
  // Rotas de API que não precisam de autenticação
  const publicApiRoutes = ['/api/auth/login', '/api/auth/register'];

  // Se é uma rota pública, permitir acesso
  if (publicRoutes.some(route => pathname.startsWith(route)) || 
      publicApiRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Se está tentando acessar dashboard sem token, redirecionar para login
  if (pathname.startsWith('/dashboard') && !token) {
    console.log('Middleware: Tentativa de acesso ao dashboard sem token, redirecionando para login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Se tem token mas está tentando acessar páginas de auth, redirecionar para dashboard
  if (token && (pathname.startsWith('/login') || pathname.startsWith('/cadastre-se') || pathname.startsWith('/esqueci-minha-senha'))) {
    console.log('Middleware: Usuário autenticado tentando acessar páginas de auth, redirecionando para dashboard');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public|icons|images).*)',
  ],
}; 