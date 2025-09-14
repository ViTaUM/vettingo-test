import Image from 'next/image';
import MyLink from './link';
import { PawPrint, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-12 text-center sm:grid-cols-2 sm:text-left lg:grid-cols-4 lg:gap-16">
          <div className="flex flex-col items-center gap-6 sm:items-start lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600">
                <PawPrint className="h-6 w-6 text-white" />
              </div>
              <Image src="/logo.svg" alt="Logo" width={69.75} height={40} className="h-8 w-auto" draggable="false" />
            </div>
            <p className="max-w-md text-center sm:text-left text-gray-600">
              Conectando donos de pets a veterinários qualificados em todo o Brasil. Encontre o melhor cuidado para seu
              animal de estimação com segurança e praticidade.
            </p>
            {/* <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
                +1000 veterinários online
              </div>
            </div> */}
          </div>

          <div className="flex flex-col items-center sm:items-start">
            <h3 className="mb-4 font-semibold text-gray-900">Links Rápidos</h3>
            <ul className="flex flex-col items-center gap-3 sm:items-start">
              <li>
                <MyLink href="/" className="text-gray-600 transition-colors duration-200 hover:text-blue-600">
                  Início
                </MyLink>
              </li>
              <li>
                <MyLink href="/sobre" className="text-gray-600 transition-colors duration-200 hover:text-blue-600">
                  Sobre Nós
                </MyLink>
              </li>
              <li>
                <MyLink href="/contato" className="text-gray-600 transition-colors duration-200 hover:text-blue-600">
                  Contato
                </MyLink>
              </li>
              <li>
                <MyLink href="/faq" className="text-gray-600 transition-colors duration-200 hover:text-blue-600">
                  FAQ
                </MyLink>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center sm:items-start">
            <h3 className="mb-4 font-semibold text-gray-900">Para Veterinários</h3>
            <ul className="flex flex-col items-center gap-3 sm:items-start">
              <li>
                <MyLink
                  href="/cadastre-se"
                  className="text-gray-600 transition-colors duration-200 hover:text-emerald-600">
                  Cadastre-se como veterinário
                </MyLink>
              </li>
              <li>
                <MyLink
                  href="/login"
                  className="text-gray-600 transition-colors duration-200 hover:text-emerald-600">
                  Portal do Veterinário
                </MyLink>
              </li>
            </ul>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Mail className="h-4 w-4 text-blue-600" />
                contato@vettingo.com
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <MapPin className="h-4 w-4 text-emerald-600" />
                Todo o Brasil
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto border-t border-gray-200 bg-white/50 px-4 py-6">
        <div className="flex flex-col items-center space-y-4 text-center md:flex-row md:justify-between md:space-y-0 md:text-left">
          <div>
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} Vettingo. Todos os direitos reservados.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 md:flex-row md:gap-6 md:space-y-0">
            <MyLink
              size="sm"
              href="/termos-de-uso"
              className="text-gray-600 transition-colors duration-200 hover:text-blue-600">
              Termos de Uso
            </MyLink>
            <MyLink
              size="sm"
              href="/politica-de-privacidade"
              className="text-gray-600 transition-colors duration-200 hover:text-blue-600">
              Política de Privacidade
            </MyLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
