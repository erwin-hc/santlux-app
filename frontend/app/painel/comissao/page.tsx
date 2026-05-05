"use client";
import { PageTitle } from "@/components/title-page";
import { PiggyBank } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { ChartAreaGradient } from "./chart";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

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
      <PageTitle label="COMISSÃO" icon={PiggyBank} loading={isLoading} />
      {isLoading && dataComissao.length === 0 ? (
        <div className="flex items-center justify-center h-[calc(100svh-200px)] w-full ">
          <Spinner className="size-10" />
        </div>
      ) : (
        <div className={isLoading ? "opacity-50 pointer-events-none" : ""}>
          <ChartAreaGradient />
        </div>
      )}
    </div>
  );
};

export default Comissao;
