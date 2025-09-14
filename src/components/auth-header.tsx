import Image from 'next/image';
import Link from 'next/link';

export default function AuthHeader() {
  return (
    <header className="w-full border-b border-gray-300 bg-white">
      <div className="container mx-auto py-4">
        <div className="flex w-full justify-center">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Logo" width={69.75} height={40} className="h-10 w-auto" draggable="false" />
          </Link>
        </div>
      </div>
    </header>
  );
}
