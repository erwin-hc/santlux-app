"use client";

import { useEffect, useState } from "react";
import { RomaneioType, columns } from "./columns";
import { DataTable } from "./data-table";
import { Spinner } from "@/components/ui/spinner";
import { useIsAdmin } from "@/hooks/use-admin";

const Romaneios = () => {
  const [dataRomaneio, setDataRomaneio] = useState<RomaneioType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isAdmin = useIsAdmin();

  async function getRomaneio() {
    setIsLoading(true);
    try {
      const hoje = new Date().toLocaleDateString("pt-BR");
      const DataFormatada = hoje.replaceAll("/", "-");

      const request = await fetch(`/api/romaneios/${DataFormatada}`, {
        method: "GET",
      });

      if (!request.ok) {
        console.error(`Erro na API: ${request.status}`);
        setDataRomaneio([]);
        return;
      }

      const resp = await request.json();

      if (resp && Array.isArray(resp.data)) {
        setDataRomaneio(resp.data);
      } else {
        console.warn("Resposta da API não contém uma array 'data':", resp);
        setDataRomaneio([]);
      }
    } catch (error) {
      console.error("Erro ao buscar romaneios:", error);
      setDataRomaneio([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getRomaneio();
  }, []);

  return (
    <div className="container mx-auto ">
      {isLoading && dataRomaneio.length === 0 ? (
        <div className="flex items-center justify-center h-screen w-full">
          <Spinner className="size-10" />
        </div>
      ) : (
        <div className={isLoading ? "opacity-50 pointer-events-none" : ""}>
          <DataTable<RomaneioType, unknown> columns={columns} data={dataRomaneio} loading={isLoading} isAdmin={isAdmin} />
        </div>
      )}
    </div>
  );
};

export default Romaneios;
