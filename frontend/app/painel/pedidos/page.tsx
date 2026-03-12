"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default function Page() {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 15 });
  const [data, setData] = useState<any[]>([]);
  const [metadata, setMetadata] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  // --- FETCH LOGIC ---
  const getPedidos = useCallback(
    async (query?: string) => {
      setLoading(true);
      try {
        // Construct the URL for our Next.js API Proxy
        const url =
          query && query.trim().length > 2
            ? `/api/pedidos?search=${encodeURIComponent(query)}`
            : `/api/pedidos?page=${pagination.pageIndex}&limit=${pagination.pageSize}`;

        const response = await fetch(url);
        const result = await response.json();

        if (response.ok) {
          setData(result.data || []);
          setMetadata(result.metadata || null);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    },
    [pagination.pageIndex, pagination.pageSize],
  );

  // --- DEBOUNCE EFFECT ---
  useEffect(() => {
    const query = searchTerm.trim();

    // 1. If searching (more than 2 chars)
    if (query.length > 2) {
      const delayDebounceFn = setTimeout(() => {
        getPedidos(query);
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    }

    // 2. If search is empty, go back to normal list
    if (query.length === 0) {
      getPedidos();
    }
  }, [searchTerm, getPedidos]);

  // --- REFRESH LISTENER ---
  useEffect(() => {
    const refresh = () => getPedidos(searchTerm.length > 2 ? searchTerm : undefined);
    window.addEventListener("refresh-pedidos", refresh);
    return () => window.removeEventListener("refresh-pedidos", refresh);
  }, [getPedidos, searchTerm]);

  return (
    <div className="container mx-auto py-1">
      <div className={loading ? "opacity-50 pointer-events-none" : ""}>
        <DataTable
          columns={columns as any}
          data={data}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          inputRef={inputRef}
          pageCount={metadata?.total_pages || 0}
          pageIndex={pagination.pageIndex}
          pageSize={pagination.pageSize}
          regCount={metadata?.total || 0}
          onPageChange={(idx) => setPagination((prev) => ({ ...prev, pageIndex: idx }))}
          onPageSizeChange={(size) => setPagination({ pageIndex: 0, pageSize: size })}
          loading={loading}
        />
      </div>
    </div>
  );
}
