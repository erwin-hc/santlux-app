"use client";
import { useEffect, useState, useCallback } from "react";
import { RomaneioType, columns } from "./columns";
import { DataTable } from "./data-table";
import { Spinner } from "@/components/ui/spinner";
import { useIsAdmin } from "@/hooks/use-admin";
import { PageTitle } from "@/components/title-page";
import { Truck } from "lucide-react";

const formatForApi = (date: Date) =>
  date.toLocaleDateString("pt-BR").replaceAll("/", "-");

const Romaneios = () => {
  const [dataRomaneio, setDataRomaneio] = useState<RomaneioType[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isAdmin = useIsAdmin();

  const getRomaneio = useCallback(async (dateString: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const request = await fetch(`/api/romaneios/${dateString}`);
      if (!request.ok) {
        setDataRomaneio([]);
        return;
      }
      const resp = await request.json();
      setDataRomaneio(Array.isArray(resp.data) ? resp.data : []);
    } catch (error) {
      console.error("Erro ao buscar romaneios:", error);
      setError("Erro ao carregar romaneios.");
      setDataRomaneio([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDateChange = (newDate: Date | undefined) => {
    setSelectedDate(newDate);
    if (newDate) getRomaneio(formatForApi(newDate));
  };

  useEffect(() => {
    getRomaneio(formatForApi(new Date()));
  }, [getRomaneio]);

  return (
    <div className="container mx-auto">
      <PageTitle label="ROMANEIOS" icon={Truck} loading={isLoading} />
      {isLoading && dataRomaneio.length === 0 ? (
        <div className="flex items-center justify-center h-[calc(100svh-200px)] w-full">
          <Spinner className="size-10" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-[calc(100svh-200px)] gap-4">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() =>
              selectedDate && getRomaneio(formatForApi(selectedDate))
            }
            className="px-4 py-2 text-sm rounded-md border hover:bg-muted transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      ) : (
        <div className={isLoading ? "opacity-50 pointer-events-none" : ""}>
          <DataTable<RomaneioType, unknown>
            columns={columns}
            loading={isLoading}
            isAdmin={isAdmin}
            data={dataRomaneio}
            date={selectedDate}
            onDateChange={handleDateChange}
          />
        </div>
      )}
    </div>
  );
};

export default Romaneios;
