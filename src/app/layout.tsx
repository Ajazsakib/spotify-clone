import Header from '../components/Header/Header';
import Sidebar from '../components/sidebar/Sidebar';
import Player from '../components/player/Player';
import './globals.css';
import { songs } from '../components/song/songs';
import { AppProvider } from '../contexts/AppContext';
export const metadata = {
  title: 'Audio Player',
  description: 'Created By Saquib Ajaz',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0"
        />

        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,500;0,700;0,900;1,100;1,300;1,500;1,700;1,900&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
