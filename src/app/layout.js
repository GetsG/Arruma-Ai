import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import "leaflet/dist/leaflet.css";

export const metadata = {
  title: "Arruma Aí",
  description: "Ajude a melhorar sua cidade",
};


export default function RootLayout({ children }) {

  return (
    <html lang="pt-br">
      <body className={`${GeistSans.variable} ${GeistMono.variable}`}>
        {children} 
      </body>
    </html>
  );
}
