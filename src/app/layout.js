import { Cinzel, Playfair_Display, Inter } from 'next/font/google';
import './globals.css';

const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-cinzel' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'Taodocos | The Harp of David',
  description: 'Master the sacred sounds of the Begena.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${cinzel.variable} ${playfair.variable} ${inter.variable} font-sans bg-[#050101] text-[#E5E5CB] overflow-x-hidden`}>
        {children}
      </body>
    </html>
  );
}