'use client';
import { usePathname } from 'next/navigation';
import Header from "@/componentes/Header/Header";
import HeaderInicial from "@/componentes/Header-Inicial/Header-Inicial";

export default function HeaderSwitcher() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return isHome ? <HeaderInicial /> : <Header />;
}