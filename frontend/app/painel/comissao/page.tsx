"use client";
import { PageTitle } from "@/components/title-page";
import { PiggyBank } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { ChartBarInteractive } from "./chart";
import { Spinner } from "@/components/ui/spinner";
import { getComissao } from "@/lib/get-comissao";

export type ComissaoType = {
  mes: number;
  setor_ppm: string;
  total_quant: number;
};

type ChartDataType = {
  mes: number;
  especial: number | null;
  horizontal: number | null;
  vertical: number | null;
};

const CURRENT_YEAR = String(new Date().getFullYear()); // ✅ fora do componente

const Comissao = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // ✅
  const [chartDataCurrentYear, setChartDataCurrentYear] = useState<
    ChartDataType[]
  >([]);

  const fetchComissao = useCallback(async (anoString: string) => {
    setIsLoading(true);
    setError(null); // ✅
    try {
      const data = await getComissao(anoString);
      setChartDataCurrentYear(data);
    } catch (error) {
      console.error("Erro ao buscar comissão:", error);
      setError("Erro ao carregar dados de comissão.");
      setChartDataCurrentYear([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComissao(CURRENT_YEAR); // ✅ usa a constante
  }, [fetchComissao]);

  return (
    <div className="container mx-auto">
      <PageTitle label="COMISSÃO" icon={PiggyBank} loading={isLoading} />
      <div className="relative">
        {isLoading && chartDataCurrentYear.length === 0 ? (
          <div className="flex items-center justify-center h-[calc(100svh-200px)] w-full">
            <Spinner className="size-10" />
          </div>
        ) : error ? ( // ✅
          <div className="flex flex-col items-center justify-center h-[calc(100svh-200px)] gap-4">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => fetchComissao(CURRENT_YEAR)}
              className="px-4 py-2 text-sm rounded-md border hover:bg-muted transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        ) : (
          <div
            className={
              isLoading ? "opacity-50 pointer-events-none animate-pulse" : ""
            }
          >
            <ChartBarInteractive
              chartDataCurrentYear={chartDataCurrentYear}
              onYearChange={fetchComissao}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Comissao;
