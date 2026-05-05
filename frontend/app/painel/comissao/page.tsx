"use client";
import { PageTitle } from "@/components/title-page";
import { PiggyBank } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export type ComissaoType = {
  mes: number;
  setor_ppm: string;
  total_quant: number;
};

const Comissao = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dataComissao, setDataComissao] = useState<ComissaoType[]>([]);

  const getComissao = useCallback(async (anoString: string) => {
    setIsLoading(true);
    try {
      const request = await fetch(`/api/comissao/${anoString}`, {
        method: "GET",
      });

      if (!request.ok) {
        setDataComissao([]);
        return;
      }

      const resp = await request.json();
      setDataComissao(Array.isArray(resp.data) ? resp.data : []);
    } catch (error) {
      console.error("Erro ao buscar romaneios:", error);
      setDataComissao([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    if (currentYear) {
      getComissao(String(currentYear));
    }
  }, [getComissao]);

  console.log(dataComissao);

  return (
    <div className="container mx-auto">
      <PageTitle label="COMISSÃO" icon={PiggyBank} loading={true} />
    </div>
  );
};

export default Comissao;
