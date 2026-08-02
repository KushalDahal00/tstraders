import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartProvider } from '@/lib/CartContext';
import { CartDrawer } from '@/components/CartDrawer';

export const metadata: Metadata = {
  title: 'T.S Traders | Premium Footwear Retailer',
  description: 'Quality footwear. Timeless style. Everyday comfort. Explore handcrafted shoes, sneakers, and formal leather footwear at T.S Traders.',
  openGraph: {
    title: 'T.S Traders | Premium Footwear Retailer',
    description: 'Step Into Your Style with T.S Traders handcrafted and curated footwear collections.',
    siteName: 'T.S Traders',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#09090b] text-zinc-100 min-h-screen flex flex-col antialiased selection:bg-white selection:text-zinc-950">
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <CartDrawer />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
