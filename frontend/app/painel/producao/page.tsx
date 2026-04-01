"use client";

import { TabsProducao } from "@/components/tabs-producao";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";

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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getProducao = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/producao");
        if (!response.ok) throw new Error("Failed to fetch");
        const result = await response.json();
        setDataProducao(result);
      } catch (error) {
        console.error("Error fetching production data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getProducao();
  }, []);

  return (
    <div className="container mx-auto ">
      {isLoading ? (
        <div className="flex items-center justify-center h-screen w-full">
          <Spinner className="size-10" />
        </div>
      ) : (
        <TabsProducao data={dataProducao} />
      )}
    </div>
  );
};

export default Producao;
