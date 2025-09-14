'use client';

import { Transition } from '@headlessui/react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import UIButton from './ui/button';

const navlinks = [
  {
    href: '/',
    label: 'Início',
  },
  {
    href: '/planos',
    label: 'Planos',
  },
  {
    href: '/sobre',
    label: 'Sobre',
  },
  {
    href: '/contato',
    label: 'Contato',
  },
  {
    href: '/faq',
    label: 'FAQ',
  },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center">
          <Link href="/" className="mr-12 flex items-center gap-2">
            <Image src="/logo.svg" alt="Logo" width={69.75} height={40} className="h-10 w-auto" draggable="false" />
          </Link>
          <div className="ml-auto flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="ml-auto rounded-lg p-2 text-gray-600 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900 focus:outline-none">
              <Menu className="h-6 w-6" />
            </button>
          </div>
          <nav className="hidden md:block">
            <ul className="flex flex-col gap-6 md:flex-row">
              {navlinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group relative text-sm font-medium text-gray-700 transition-all duration-300 hover:text-blue-600">
                    {link.label}
                    <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-600 to-emerald-600 transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="ml-auto hidden gap-3 md:flex">
            <Link href="/login">
              <UIButton variant="ghost" size="sm" className="hover:bg-gray-100">
                Entrar
              </UIButton>
            </Link>
            <Link href="/cadastre-se">
              <UIButton
                variant="solid"
                size="sm"
                className="border-0 bg-gradient-to-r from-blue-600 to-emerald-600 shadow-sm hover:from-blue-700 hover:to-emerald-700">
                Cadastre-se
              </UIButton>
            </Link>
          </div>
        </div>
      </div>
      <Transition
        show={isMenuOpen}
        enter="transition ease-out duration-300"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-200"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95">
        <div className="fixed inset-0 z-50 bg-white md:hidden">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-4">
              <Link href="/" className="flex items-center gap-2">
                <Image src="/logo.svg" alt="Logo" width={69.75} height={40} className="h-10 w-auto" draggable="false" />
              </Link>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg p-2 text-gray-600 transition-colors duration-200 hover:bg-gray-200 hover:text-gray-900 focus:outline-none">
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-6">
              <ul className="flex flex-col gap-6">
                {navlinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-lg font-medium text-gray-700 transition-colors duration-200 hover:text-blue-600"
                      onClick={() => setIsMenuOpen(false)}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="border-t border-gray-200 bg-gray-50 p-6">
              <Link href="/login" className="mb-3 block">
                <UIButton variant="ghost" size="sm" className="w-full hover:bg-gray-200">
                  Entrar
                </UIButton>
              </Link>
              <Link href="/cadastre-se" className="block">
                <UIButton
                  variant="solid"
                  size="sm"
                  className="w-full border-0 bg-gradient-to-r from-blue-600 to-emerald-600 shadow-sm hover:from-blue-700 hover:to-emerald-700">
                  Cadastre-se
                </UIButton>
              </Link>
            </div>
          </div>
        </div>
      </Transition>
    </header>
  );
}
