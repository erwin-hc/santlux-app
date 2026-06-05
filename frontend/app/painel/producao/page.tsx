"use client";
import { TabsProducao } from "@/components/tabs-producao";
import { useEffect, useState, useCallback } from "react";
import { Spinner } from "@/components/ui/spinner";
import { CalendarCog } from "lucide-react";
import { PageTitle } from "@/components/title-page";
import { useMessages } from "@/providers/message-provider";
import { apiFetch } from "@/lib/api-fetch";

export type PedidosType = {
  dtentrega: string;
  registro: string;
  sigla: string;
  empresa: string;
  os: string;
  data: string;
  con_nome: string;
  setor_ppm: string;
  transportadora: string;
  status: string;
  nnota: string;
  entruegue: string;
  seq: string;
  nome: string;
  obs: string;
  larg: string;
  alt: string;
  modelo: string;
  m2: string;
  transempresa: string;
  quant: string;
  volnumero: string;
  tp: string;
  con_obs: string;
};

const Producao = () => {
  const [dataProducao, setDataProducao] = useState<PedidosType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addMessage } = useMessages();

  const getProducao = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiFetch("/api/producao/");
      const result = await response.json();

      if (!response.ok) {
        setError("Erro ao carregar Produção!");
        addMessage("error", "Erro ao carregar produção!");
      }

      setDataProducao(result);
    } catch (error) {
      console.error("Error fetching production data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getProducao();
  }, [getProducao]);

  return (
    <div className="container mx-auto">
      <PageTitle label="PRODUÇÃO" icon={CalendarCog} loading={isLoading} />
      {isLoading ? (
        <div className="flex items-center justify-center h-[calc(100svh-200px)] w-full">
          <Spinner className="size-10" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-[calc(100svh-200px)] gap-4">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => getProducao()}
            className="px-4 py-2 text-sm rounded-md border hover:bg-muted transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      ) : (
        <TabsProducao data={dataProducao} />
      )}
    </div>
  );
};

export default Producao;
