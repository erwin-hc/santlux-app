"use client";
import { useModal } from "@/providers/modal-provider";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, ListTodo, Printer, User } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Spinner } from "../ui/spinner";
import { transpConfig, statusConfig } from "../../app/painel/pedidos/columns";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import { formatDate, formatMedidas } from "@/lib/utils";
import { Button } from "../ui/button";
import { TextAreaObs } from "../ui/text-area-obs";

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
  latd: number | null;
  late: number | null;
  compr: number | null;
  capaobs: string;
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

  const info = data && data.length > 0 ? data[0] : null;
  const persianas = data?.filter((item) => item.tp === "A") ?? [];
  const bandos = data?.filter((item) => item.tp === "B") ?? [];
  const acessorios = data?.filter((item) => item.tp === "C") ?? [];

  const printCSS = `
   * {
      box-sizing: border-box;
      background-color: white;
    }

    .line {
      border-bottom: 1px solid #000;
      width: 100%;
    }

    body {
      font-family: Arial, Helvetica, sans-serif;
      margin: 0;
      font-size: 12px;
      line-height: 1.2;
      color: #000;
      background: lightgray;
    }

    html {
      background: lightgray;
    }

    .print-container {
      max-width: 842px;
      margin: 0 auto;
      background-color: white;
      padding: 15px;
      margin-top: 10px;
    }

    .print-title {
      padding: 0 15px;
      margin: 0;
      font-size: 16px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: 2fr 175px;
      margin-bottom: 15px;
    }

    .info-row {
      display: flex;
      align-items: flex-start;
    }

    .info-row strong {
      min-width: 60px;
      font-weight: bold;
      color: #000;
    }

    .info-row span {
      min-width: 60px;
      color: #000;
    }

    .section-title {
      font-size: 14px;
      font-weight: bold;
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 0 15px;
    }

    .print-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }

    .print-table td,
    .print-table th {
      padding: 4px;
    }

    .print-table th {
      border-bottom: 1px solid #000;
    }

    .text-right {
      text-align: right;
    }

    .w-5percent {
      width: 5%;
    }

    .w-65percent {
      width: 65%;
      text-align: left;
      padding-left: 10px;
    }

    .w-95percent {
      width: 95%;
      text-align: left;
      padding-left: 10px;
    }

    .w-10percent {
      width: 10%;
    }

    .print-obs {
      display: grid;
      grid-template-columns: 60px 1fr;
    }

    .print-obs pre {
      padding: 0;
      font-weight: bold;
    }

    @media print {
      body {
        margin: 0;
        padding: 0;
      }

      .print-container {
        margin: 0;
        padding: 0;
        max-width: 842px;
      }
      .print-table {
        font-size: 12px;
      }
    }
  `;

  const handlePrint = useCallback(() => {
    const printWindow = window.open("", "_blank", "width=800,height=600");

    if (!printWindow || !data?.length || !registro) return;

    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Pedido #${registro}</title>
         <style>${printCSS}</style>
      </head>
      <body>
        ${generatePrintHTML()}
      </body>
    </html>
  `);

    printWindow.document.close();

    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.onafterprint = () => {
        printWindow.close();
      };

      setTimeout(() => {
        if (!printWindow.closed) printWindow.close();
      }, 500);
    }, 250);

    // printWindow.onload = () => {
    //   printWindow.print();
    //   printWindow.onafterprint = () => printWindow.close();
    // };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, registro]);

  const generatePrintHTML = useCallback(() => {
    if (!data || data.length === 0) {
      return '<div class="no-data">Nenhum dado para imprimir</div>';
    }

    const info = data[0];
    const persianas = data.filter((item) => item.tp === "A") ?? [];
    const bandos = data.filter((item) => item.tp === "B") ?? [];
    const acessorios = data.filter((item) => item.tp === "C") ?? [];

    return `
<div class="print-container">
 <p class="line"></p>
      <h1 class="print-title">REGISTRO #${registro}</h1>
      <p class="line"></p>

      <div class="info-grid">
        <div class="info-row">
          <span>Cliente:</span>
          <strong>${!info.con_nome ? info.empresa : info.con_nome}</strong>
        </div>

        <div class="info-row">
          <span>OS:</span><strong> ${!info.os ? "" : info.os} </strong>
        </div>
        <div class="info-row">
          <span>Pedido:</span> <strong>${registro}</strong>
        </div>

        <div class="info-row">
          <span>Emissão:</span>
          <strong>${!info.data ? "" : formatDate(String(info.data))}</strong>
        </div>

        <div class="info-row">
          <span>NFe:</span> <strong>${!info.nnota ? "" : info.nnota}</strong>
        </div>

        <div class="info-row">
          <span>Previsão:</span>
          <strong>${!info.dtentrega ? "" : formatDate(String(info.dtentrega))}</strong>
        </div>
      </div>
      <p class="line"></p>

      <div class="print-obs">
        <span>Obs:</span>
        <pre>${!info.capaobs ? "" : info.capaobs.toLocaleUpperCase()}</pre>
      </div>
      
      <p class="line"></p>

      <div class="section-wrapper">

    ${
      persianas.length > 0
        ? `      
            <div class="section-persianas">
            <p class="section-title">PERSIANAS</p>
            <p class="line"></p>
            <table class="print-table">
            <thead>
            <tr>
            <th class="w-5percent">QTD</th>
            <th class="w-65percent">NOME</th>
            <th class="text-right w-10percent">LARG</th>
            <th class="text-right w-10percent">ALT</th>
            <th class="text-right w-10percent">MOD</th>
            </tr>
            </thead>
            <tbody>
            ${persianas
              .map(
                (item) => `
                        <tr>
                        <td class="w-5percent">${item.quant}</td>
                        <td class="w-65percent">
                          ${item.nome}
                          <div>
                            <span>${item.obs}</span>
                          </div>
                        </td>
                        <td class="text-right w-10percent">
                          ${formatMedidas(Number(item.larg))}
                        </td>
                        <td class="text-right w-10percent">
                          ${formatMedidas(Number(item.alt))}
                        </td>
                        <td class="text-right w-10percent">${item.modelo}</td>
                        </tr>
                        `,
              )
              .join("")}
            </tbody>
            </table>
            <p class="line"></p>
            </div>
            </tbody>
            </table>
            </div>
    `
        : ""
    }



    ${
      bandos.length > 0
        ? `
        <div class="section-bandos">
          <p class="section-title">BANDÔS</p>
          <p class="line"></p>
          <table class="print-table">
            <thead>
              <tr>
                <th class="w-5percent">QTD</th>
                <th class="w-65percent">NOME</th>
                <th class="text-right w-10percent">LATE</th>
                <th class="text-right w-10percent">LATD</th>
                <th class="text-right w-10percent">COMP</th>
              </tr>
            </thead>
            <tbody>
              ${bandos
                .map(
                  (item) => `
              <tr>
                <td class="w-5percent">${item.quant}</td>
                <td class="w-65percent">
                  ${item.nome}
                  <div>
                    <span>${item.obs}</span>
                  </div>
                </td>
                <td class="text-right w-10percent">
                  ${formatMedidas(Number(item.late))}
                </td>
                <td class="text-right w-10percent">
                  ${formatMedidas(Number(item.latd))}
                </td>
                <td class="text-right w-10percent">${item.compr}</td>
              </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
          <p class="line"></p>
        </div>  
          `
        : ""
    }

    ${
      acessorios.length > 0
        ? `
        <div class="section-acessorios">
          <p class="section-title">ACESSÓRIOS</p>
          <p class="line"></p>
          <table class="print-table">
            <thead>
              <tr>
                <th class="w-5percent">QTD</th>
                <th class="w-95percent">NOME</th>
              </tr>
            </thead>
            <tbody>
              ${acessorios
                .map(
                  (item) => `
              <tr>
                <td class="w-5percent">${item.quant}</td>
                <td class="w-95percent">
                  ${item.nome}
                  <div>
                    <span>${item.obs}</span>
                  </div>
                </td>
              </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
          <p class="line"></p>
        </div>
          `
        : ""
    }

    </div>
  `;
  }, [data, registro]);

  if (!modal.isOpen) return null;
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
      <DialogContent className="sm:max-w-[80%] w-162.5 max-h-[90vh] overflow-y-auto print-container ">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-2xl font-bold border-b pb-4 pt-8">
            <div className="flex items-center justify-center gap-2">
              <ListTodo size={32} />
              <span className="underline underline-offset-4">REGISTRO:</span>
              <span className="">#{registro as string}</span>
            </div>
            <div className="no-print">
              <Button onClick={handlePrint} className="cursor-pointer has-[>svg]:px-4 has-[>svg]:py-2 ">
                <Printer size={32} />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <Spinner className="flex items-center justify-center size-8 w-full my-2" />
        ) : info ? (
          <div>
            <div className=" border p-2 ">
              <div id="row1" className=" flex items-center justify-start gap-2 h-6.25">
                <User size={18} />
                <p className="text-sm font-semibold">{!info.con_nome ? info.empresa : info.con_nome}</p>
              </div>
              <div id="row2" className=" flex items-center justify-between ">
                <div className="flex items-center justify-start gap-2">
                  <ListTodo size={18} />
                  <p className="text-sm ">OS: {!info.os ? "" : info.os}</p>
                </div>
                <div className="flex items-center justify-between gap-2 my-2">
                  <div className="flex items-center justify-center gap-2">
                    <Badge className="ml-2" variant={currentStatus.variant}>
                      {currentStatus.label}
                    </Badge>
                    {!currentTransp ? "" : <Badge variant={currentTransp?.variant}>{currentTransp?.label}</Badge>}
                  </div>
                </div>
              </div>
              <div id="row3" className=" flex items-start justify-between gap-2">
                {!info.nnota ? (
                  <div></div>
                ) : (
                  <div className="flex items-center justify-start gap-2">
                    <ListTodo size={18} />
                    NFe: {info.nnota}
                  </div>
                )}
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

            <div className="my-4">
              <TextAreaObs variant={currentStatus.variant}>{info.capaobs.toLocaleUpperCase()}</TextAreaObs>
            </div>

            {persianas && persianas.length > 0 && (
              <div className="mt-4">
                <div className="bg-muted pl-2 text-lg underline underline-offset-4 font-bold border border-b-0 p-2">PERSIANAS</div>

                <Table className="border text-[12px]">
                  <TableHeader>
                    <>
                      <TableRow>
                        <TableCell className="w-[5%]">QTD</TableCell>
                        <TableCell className="w-[65%]">NOME</TableCell>
                        <TableCell className="text-right w-[10%]">LARG</TableCell>
                        <TableCell className="text-right w-[10%]">ALT</TableCell>
                        <TableCell className="text-right w-[10%]">MOD</TableCell>
                      </TableRow>
                    </>
                  </TableHeader>
                  <TableBody>
                    {persianas?.map((item, idx) => (
                      <React.Fragment key={idx}>
                        <TableRow className="border-t">
                          <TableCell className="w-[5%]">{item.quant}</TableCell>
                          <TableCell className="w-[65%] font-semibold">
                            {item.nome}
                            {item.obs && (
                              <div className="text-[10px]">
                                <span className="bg-muted py-1">{item.obs}</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-right w-[10%]">{formatMedidas(Number(item.larg))}</TableCell>
                          <TableCell className="text-right w-[10%]">{formatMedidas(Number(item.alt))}</TableCell>
                          <TableCell className="text-right w-[10%]  font-semibold">{item.modelo}</TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {bandos && bandos.length > 0 && (
              <div className="mt-4">
                <div className="bg-muted pl-2 text-lg underline underline-offset-4 font-bold border border-b-0 p-2">BANDÔS</div>

                <Table className="border text-[12px]">
                  <TableHeader>
                    <>
                      <TableRow>
                        <TableCell className="w-[5%]">QTD</TableCell>
                        <TableCell className="w-[65%]">NOME</TableCell>
                        <TableCell className="text-right w-[10%]">LATE</TableCell>
                        <TableCell className="text-right w-[10%]">LATD</TableCell>
                        <TableCell className="text-right w-[10%]">COMP</TableCell>
                      </TableRow>
                    </>
                  </TableHeader>
                  <TableBody>
                    {bandos?.map((item, idx) => (
                      <React.Fragment key={idx}>
                        <TableRow className="border-t">
                          <TableCell className="w-[5%]">{item.quant}</TableCell>
                          <TableCell className="w-[65%]  font-semibold">
                            {item.nome}
                            {item.obs && (
                              <div className="text-[10px]">
                                <span className="bg-muted py-1">{item.obs}</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="w-[10%] text-right">{formatMedidas(Number(item.late))}</TableCell>
                          <TableCell className="w-[10%] text-right">{formatMedidas(Number(item.latd))}</TableCell>
                          <TableCell className="w-[10%] text-right  font-semibold">{item.compr}</TableCell>
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
                        <TableCell className="w-[5%]">QTD</TableCell>
                        <TableCell className="w-[95%]">NOME</TableCell>
                      </TableRow>
                    </>
                  </TableHeader>
                  <TableBody>
                    {acessorios?.map((item, idx) => (
                      <React.Fragment key={idx}>
                        <TableRow className="border-t">
                          <TableCell className="w-[5%]">{item.quant}</TableCell>
                          <TableCell className="w-[95%] font-semibold">
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
