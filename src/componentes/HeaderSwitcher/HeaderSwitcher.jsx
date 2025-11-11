'use client';
import { usePathname } from 'next/navigation';
import Header from "../Header/Header";
import HeaderInicial from "../Header-Inicial/Header-Inicial";

export default function HeaderSwitcher() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return isHome ? <HeaderInicial /> : <Header />;
}