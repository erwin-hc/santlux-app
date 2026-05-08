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

const Comissao = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [chartDataCurrentYear, setChartDataCurrentYear] = useState<
    ChartDataType[]
  >([]);

  const fetchComissao = useCallback(async (anoString: string) => {
    setIsLoading(true);
    try {
      const data = await getComissao(anoString);
      setChartDataCurrentYear(data);
    } catch (error) {
      console.error("Erro ao buscar comissão:", error);
      setChartDataCurrentYear([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const currentYear = String(new Date().getFullYear());
    fetchComissao(currentYear);
  }, [fetchComissao]);

  return (
    <div className="container mx-auto">
      <PageTitle label="COMISSÃO" icon={PiggyBank} loading={isLoading} />

      <div className="relative">
        {isLoading && chartDataCurrentYear.length === 0 ? (
          <div className="flex items-center justify-center h-[calc(100svh-200px)] w-full ">
            <Spinner className="size-10" />
          </div>
        ) : (
          <div className={isLoading ? "opacity-50 pointer-events-none " : ""}>
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
