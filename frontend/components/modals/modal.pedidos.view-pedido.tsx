"use client";
import { useModal } from "@/providers/modal-provider";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CalendarCog, Info, ListTodo, Package, Truck, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";

export interface ItensPedido {
  empresa: string;
  sigla: string;
  registro: number | null;
  os: string | null;
  con_nome: string | null;
  setor_ppm: string;
  transportadora: string | null;
  status: string;
  dtentrega: Date | string | null;
  nnota: string | number | null;
  nome: string;
  obs: string | null;
  larg: number | null;
  alt: number | null;
  m2: number | null;
  modelo: string | null;
  tp: string | null;
  seq: number | null;
}

export function ModalViewPedido() {
  const modal = useModal();
  const [data, setData] = useState<ItensPedido[] | null>(null);
  const [loading, setLoading] = useState(false);

  const registro = modal?.data;

  useEffect(() => {
    if (modal.isOpen && registro) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/pedidos/view/${registro}`);
          const result = await response.json();

          // Garante que 'data' seja sempre um array, mesmo que venha um objeto único
          const formattedData = Array.isArray(result.data) ? result.data : [result.data];
          setData(formattedData);
        } catch (e) {
          console.error("Erro:", e);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [modal.isOpen, registro]);

  if (!modal.isOpen) return null;

  const info = data && data.length > 0 ? data[0] : null;

  console.log(data);

  if (!modal) return null;

  return (
    <Dialog open={modal.isOpen} onOpenChange={(open) => !open && modal.closeModal()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold border-b pb-4">
            <ListTodo className="w-8 h-8 " />
            <span className="underline underline-offset-4">PEDIDO:</span>
            <span className="">#{registro as string}</span>
            {info && (
              <Badge variant="LG" className="ml-4 uppercase">
                Status: {info.status}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="p-20 text-center">Carregando...</div>
        ) : info ? (
          <div className="">
            {/* {CARD CLIENTE} */}
            <div className="grid grid-cols-1 gap-2">
              <div className="p-2 border rounded-lg ">
                <div className="flex items-center justify-start gap-2 my-2">
                  <User size={18} />
                  <p className="text-sm font-semibold">{info.con_nome}</p>
                </div>
                <div className="flex items-center justify-start gap-2 my-2">
                  <ListTodo size={18} />
                  <p className="text-sm font-semibold ">{info.os}</p>
                </div>
              </div>
            </div>

            {/* Itens */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 font-bold">
                <Package size={18} /> Itens do Registro
              </h3>
              {data?.map((item, idx) => (
                <div key={idx} className="border p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between font-bold text-lg border-b mb-3 pb-1">
                    <span>{item.nome}</span>
                    <span className="text-slate-400"># {item.seq}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-blue-50 p-2 rounded">
                      <p className="text-[10px] uppercase text-blue-600 font-bold">Largura</p>
                      <p className="font-mono">{item.larg}m</p>
                    </div>
                    <div className="bg-blue-50 p-2 rounded">
                      <p className="text-[10px] uppercase text-blue-600 font-bold">Altura</p>
                      <p className="font-mono">{item.alt}m</p>
                    </div>
                    <div className="bg-blue-600 p-2 rounded text-white">
                      <p className="text-[10px] uppercase font-bold text-blue-100">M² Total</p>
                      <p className="font-mono font-bold">{item.m2}</p>
                    </div>
                  </div>
                  {item.obs && (
                    <div className="mt-3 text-sm text-slate-600 bg-slate-100 p-2 rounded border-l-4 border-blue-600">
                      <strong>Obs:</strong> {item.obs}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-10 text-center text-muted-foreground">Nenhum dado retornado da API para o registro {registro as string} .</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
