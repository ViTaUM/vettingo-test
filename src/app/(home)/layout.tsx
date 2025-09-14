import Footer from '@/components/footer';
import Header from '@/components/header';
import UserBanner from '@/components/user-banner';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <UserBanner />
      <Header />
      {children}
      <Footer />
    </>
  );
}
