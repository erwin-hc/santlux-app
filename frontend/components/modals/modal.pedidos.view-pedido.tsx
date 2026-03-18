"use client";
import { useModal } from "@/providers/modal-provider";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, ListTodo, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Spinner } from "../ui/spinner";
import { transpConfig, statusConfig } from "../../app/painel/pedidos/columns";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import { formatDate, formatDecimal } from "@/lib/utils";

export interface ItensPedido {
  empresa: string;
  sigla: string;
  registro: number | null;
  data: Date;
  os: string | null;
  con_nome: string | null;
  setor_ppm: string;
  transportadora: string | null;
  status: string;
  dtentrega: Date;
  nnota: string | number | null;
  nome: string;
  obs: string | null;
  larg: number | null;
  alt: number | null;
  m2: number | null;
  modelo: string | null;
  tp: string | null;
  seq: number | null;
  quant: number | null;
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

  const persianas = data?.filter((tp) => tp.tp === "A");
  const bandos = data?.filter((tp) => tp.tp === "B");
  const acessorios = data?.filter((tp) => tp.tp === "C");

  if (!modal) return null;

  type StatusKey = keyof typeof statusConfig;
  type TranspKey = keyof typeof transpConfig;

  const status = info?.status;
  const statusKey = String(status) as StatusKey;
  const currentStatus = statusConfig[statusKey];

  const transp = info?.transportadora as string | undefined;
  const transpKey = String(transp ?? "").toUpperCase() as TranspKey;
  const currentTransp = transpConfig[transpKey];

  return (
    <Dialog open={modal.isOpen} onOpenChange={(open) => !open && modal.closeModal()}>
      <DialogContent className="sm:max-w-[80%] w-162.5 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold border-b pb-4">
            <ListTodo className="w-8 h-8 " />
            <span className="underline underline-offset-4">PEDIDO:</span>
            <span className="">#{registro as string}</span>
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <Spinner className="flex items-center justify-center size-8 w-full my-2" />
        ) : info ? (
          <div>
            <div className=" border p-2 ">
              <div id="row1" className=" flex items-center justify-start gap-2 h-6.25">
                <User size={18} />
                <p className="text-sm font-semibold">{info.con_nome}</p>
              </div>
              <div id="row2" className=" flex items-center justify-between ">
                <div className="flex items-center justify-start gap-2">
                  <ListTodo size={18} />
                  <p className="text-sm ">{info.os}</p>
                </div>
                <div className="flex items-center justify-between gap-2 my-2">
                  <div className="flex items-center justify-center gap-2">
                    <Badge className="ml-2" variant={currentStatus.variant}>
                      {currentStatus.label}
                    </Badge>
                    <Badge variant={currentTransp?.variant ?? "secondary"}>{currentTransp?.label ?? ""}</Badge>
                  </div>
                </div>
              </div>
              <div id="row3" className=" flex items-start justify-between gap-2">
                <div className="flex items-center justify-start gap-2">
                  <ListTodo size={18} />
                  {info.nnota}
                </div>
                <div className="flex items-center justify-start gap-2">
                  <div className="grid grid-cols-1 p-1.5 border rounded-lg">
                    <small className="">Emissão</small>
                    <span className="flex items-center gap-2">
                      <Calendar size={18} />
                      {formatDate(info.data instanceof Date ? info.data.toLocaleDateString("pt-BR") : info.data)}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 p-1.5 border rounded-lg bg-muted">
                    <small className="">Previsão</small>
                    <span className="flex items-center gap-2">
                      <Calendar size={18} />
                      {formatDate(info.dtentrega instanceof Date ? info.dtentrega.toLocaleDateString("pt-BR") : info.dtentrega)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {persianas && persianas.length > 0 && (
              <div className="mt-4">
                <div className="bg-muted pl-2 text-lg underline underline-offset-4 font-bold border border-b-0 p-2">PERSIANAS</div>

                <Table className="border text-[12px]">
                  <TableHeader>
                    <>
                      <TableRow>
                        <TableCell className="font-mono w-10">QTD</TableCell>
                        <TableCell className="font-mono">NOME</TableCell>
                        <TableCell className="font-mono">LARG.</TableCell>
                        <TableCell className="font-mono">ALT.</TableCell>
                        <TableCell className="font-mono">MODELO</TableCell>
                      </TableRow>
                    </>
                  </TableHeader>
                  <TableBody>
                    {persianas?.map((item, idx) => (
                      <React.Fragment key={idx}>
                        <TableRow className="border-t">
                          <TableCell className="font-mono w-10">{item.quant}</TableCell>
                          <TableCell className="font-mono font-semibold">
                            {item.nome}
                            {item.obs && (
                              <div className="text-[10px]">
                                <span className="bg-muted py-1">{item.obs}</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="font-mono ">{formatDecimal(Number(item.larg))}</TableCell>
                          <TableCell className="font-mono ">{formatDecimal(Number(item.alt))}</TableCell>
                          <TableCell className="font-mono font-semibold text-center ">{item.modelo}</TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {acessorios && acessorios.length > 0 && (
              <div className="mt-4">
                <div className="bg-muted pl-2 text-lg underline underline-offset-4 font-bold border border-b-0 p-2">ACESSÓRIOS</div>
                <Table className="border text-[12px]">
                  <TableHeader>
                    <>
                      <TableRow>
                        <TableCell className="font-mono w-10">QTD</TableCell>
                        <TableCell className="font-mono">NOME</TableCell>
                      </TableRow>
                    </>
                  </TableHeader>
                  <TableBody>
                    {acessorios?.map((item, idx) => (
                      <React.Fragment key={idx}>
                        <TableRow className="border-t">
                          <TableCell className="font-mono w-10">{item.quant}</TableCell>
                          <TableCell className="font-mono font-semibold">
                            {item.nome}
                            {item.obs && (
                              <div className="text-[10px]">
                                <span className="bg-muted py-1">{item.obs}</span>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        ) : (
          <div className="p-10 text-center text-muted-foreground">Nenhum dado retornado da API para o registro {registro as string} .</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
