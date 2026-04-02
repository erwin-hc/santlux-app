"use client";

import { useEffect, useState, useCallback } from "react";
import { RomaneioType, columns } from "./columns";
import { DataTable } from "./data-table";
import { Spinner } from "@/components/ui/spinner";
import { useIsAdmin } from "@/hooks/use-admin";

const Romaneios = () => {
  const [dataRomaneio, setDataRomaneio] = useState<RomaneioType[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const isAdmin = useIsAdmin();

  const formatForApi = (date: Date) => {
    return date.toLocaleDateString("pt-BR").replaceAll("/", "-");
  };

  const getRomaneio = useCallback(async (dateString: string) => {
    setIsLoading(true);
    try {
      const request = await fetch(`/api/romaneios/${dateString}`, {
        method: "GET",
      });

      if (!request.ok) {
        setDataRomaneio([]);
        return;
      }

      const resp = await request.json();
      setDataRomaneio(Array.isArray(resp.data) ? resp.data : []);
    } catch (error) {
      console.error("Erro ao buscar romaneios:", error);
      setDataRomaneio([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDateChange = (newDate: Date | undefined) => {
    setSelectedDate(newDate);
    if (newDate) {
      const formatted = newDate.toLocaleDateString("pt-BR").replaceAll("/", "-");
      getRomaneio(formatted);
    }
  };

  useEffect(() => {
    const hojeFormatado = formatForApi(new Date());
    getRomaneio(hojeFormatado);
  }, [getRomaneio]);

  return (
    <div className="container mx-auto">
      {isLoading && dataRomaneio.length === 0 ? (
        <div className="flex items-center justify-center h-screen w-full">
          <Spinner className="size-10" />
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
