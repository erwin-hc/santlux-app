"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { TypePedidos, columns } from "./columns";
import { DataTable } from "./data-table";
import { ListTodo } from "lucide-react";
import { PageTitle } from "@/components/title-page";
import { useMessages } from "@/providers/message-provider";
import { apiFetch } from "@/lib/api-fetch";

type PedidosResponse = {
  data: TypePedidos[];
  metadata: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
};

export default function Page() {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 25 });
  const [data, setData] = useState<TypePedidos[]>([]);
  const [metadata, setMetadata] = useState<PedidosResponse["metadata"] | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const paginationRef = useRef(pagination);

  const { addMessage } = useMessages();

  useEffect(() => {
    paginationRef.current = pagination;
  }, [pagination]);

  const getPedidos = useCallback(async (query?: string) => {
    setLoading(true);
    setError(null);
    try {
      const { pageIndex, pageSize } = paginationRef.current;
      const url =
        query && query.trim().length > 2
          ? `/api/pedidos?search=${encodeURIComponent(query)}`
          : `/api/pedidos?page=${pageIndex}&limit=${pageSize}`;

      const response = await apiFetch(url);
      const result = await response.json();

      if (response.ok) {
        setData(result.data ?? []);
        setMetadata(result.metadata ?? null);
      }

      if (!response.ok) {
        setError("Erro ao carregar pedidos!");
        addMessage("error", "Erro ao carregar pedidos!");
      }
    } catch (error) {
      console.log("Erro ao carregar pedidos!");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (searchTerm.trim().length <= 2) {
      getPedidos();
    }
  }, [pagination, getPedidos]);

  useEffect(() => {
    const query = searchTerm.trim();
    if (query.length > 2) {
      const timer = setTimeout(() => getPedidos(query), 500);
      return () => clearTimeout(timer);
    }
    if (query.length === 0) {
      getPedidos();
    }
  }, [searchTerm, getPedidos]);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  useEffect(() => {
    const refresh = () => {
      getPedidos(searchTerm.length > 2 ? searchTerm : undefined);
      setTimeout(() => inputRef.current?.focus(), 150);
    };
    window.addEventListener("refresh-pedidos", refresh);
    return () => window.removeEventListener("refresh-pedidos", refresh);
  }, [getPedidos, searchTerm]);

  
  return (
    <>
      <PageTitle label="PEDIDOS" icon={ListTodo} loading={loading} />
      <div className="container mx-auto">
        {error ? (
          <div className={loading ? "opacity-50 pointer-events-none" : ""}>
            <div className="flex flex-col items-center justify-center h-[calc(100svh-200px)] gap-4">
              <p className="text-red-500">{error}</p>
              <button
                onClick={() => getPedidos()}
                className="px-4 py-2 text-sm rounded-md border hover:bg-muted transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        ) : (
          <DataTable<TypePedidos, unknown>
            columns={columns}
            data={data}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            inputRef={inputRef}
            pageCount={metadata?.total_pages || 0}
            pageIndex={pagination.pageIndex}
            pageSize={pagination.pageSize}
            regCount={metadata?.total || 0}
            onPageChange={(idx) =>
              setPagination((prev) => ({ ...prev, pageIndex: idx }))
            }
            onPageSizeChange={(size) =>
              setPagination({ pageIndex: 0, pageSize: size })
            }
            loading={loading}
          />
        )}
      </div>
    </>
  );
}
