"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "../services/authService";

export function useRequireAuth() {
  const router = useRouter();
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/logar");
      return;
    }
    setCarregando(false);
  }, [router]);

  return { carregando };
}
