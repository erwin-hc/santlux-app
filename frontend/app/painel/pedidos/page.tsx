"use client";

import { useState, useEffect, useCallback } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";

interface PedidosResponse {
  data: unknown[];
  metadata: {
    total: number;
    total_pages: number;
    limit: number;
  };
}

export default function Page() {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 15 });
  const [data, setData] = useState<unknown[]>([]);
  const [metadata, setMetadata] = useState<PedidosResponse["metadata"] | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/pedidos?page=${pagination.pageIndex}&limit=${pagination.pageSize}`);
      const result = await response.json();

      if (response.ok) {
        setData(result.data);
        setMetadata(result.metadata);
      } else {
        setData([]);
        setMetadata(null);
      }
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
    } finally {
      setLoading(false);
    }
  }, [pagination.pageIndex, pagination.pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    window.addEventListener("refresh-pedidos", fetchData);
    return () => window.removeEventListener("refresh-pedidos", fetchData);
  }, [fetchData]);

  const handlePageSizeChange = (newSize: number) => {
    setPagination({
      pageIndex: 0,
      pageSize: newSize,
    });
  };

  return (
    <div className="container mx-auto py-1">
      <div className={loading ? "opacity-50 pointer-events-none transition-opacity" : "transition-opacity"}>
        <DataTable
          columns={columns as []}
          data={data}
          pageCount={metadata?.total_pages || 0}
          pageIndex={pagination.pageIndex || 0}
          pageSize={pagination.pageSize || 0}
          regCount={metadata?.total || 0}
          onPageChange={(newIndex) => setPagination((prev) => ({ ...prev, pageIndex: newIndex }))}
          onPageSizeChange={handlePageSizeChange}
          loading={loading}
        />
      </div>
    </div>
  );
}
