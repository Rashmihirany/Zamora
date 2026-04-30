import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import Providers from '@/components/Providers';
import Navbar from '@/components/Navbar';
import SideMenu from '@/components/SideMenu';
import FilterPanel from '@/components/FilterPanel';
import CartSidebar from '@/components/CartSidebar';
import Footer from '@/components/Footer';
import Overlay from '@/components/Overlay';
import Loader from '@/components/Loader';
import ChatBot from '@/components/ChatBot';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-heading',
});

export const metadata: Metadata = {
  title: 'ZAMORA',
  description: 'Sophisticated e-commerce website for Zamora - Timeless Elegance',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body>
        <Providers>
          <Loader />
          <Navbar />
          <SideMenu />
          <FilterPanel />
          <main id="app-container">
            {children}
          </main>
          <Footer />
          <CartSidebar />
          <Overlay />
          <ChatBot />
        </Providers>
      </body>
    </html>
  );
}
