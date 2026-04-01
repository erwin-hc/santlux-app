import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PedidosType } from "@/app/painel/producao/page";
import { formatDate } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { transpConfig } from "@/app/painel/pedidos/columns";
import { statusConfig } from "@/app/painel/pedidos/columns";
import { Badge } from "./ui/badge";
import { Cable, Eye, ListTodo, Package, Truck, User } from "lucide-react";
import { useModal as useModalHook } from "@/providers/modal-provider";
import { useIsAdmin } from "@/hooks/use-admin";
import Link from "next/link";

type StatusKey = keyof typeof statusConfig;
type TranspKey = keyof typeof transpConfig;

interface TabsProducaoProps {
  data: PedidosType[];
}

export function TabsProducao({ data }: TabsProducaoProps) {
  const uniqueDates = Array.from(new Set(data.map((item) => item.dtentrega))).sort();
  const firstDate = uniqueDates[0] || "no-data";
  const modal = useModalHook();
  const isAdmin = useIsAdmin();

  return (
    <Tabs defaultValue={formatDate(firstDate)} className="w-full">
      <TabsList className="[&_button]:cursor-pointer max-w-full overflow-x-auto justify-start scrollbar-hide">
        {uniqueDates.map((date) => (
          <TabsTrigger className="data-[state=active]:dark:bg-muted-foreground/30" key={formatDate(date)} value={formatDate(date)}>
            {formatDate(date)}
          </TabsTrigger>
        ))}
      </TabsList>

      {uniqueDates.map((date) => {
        const formattedTabDate = formatDate(date);
        const filteredData = data.filter((item) => item.dtentrega === date);
        const uniqueRegistrosIds = Array.from(new Set(filteredData.map((item) => item.registro))).sort();
        const uniqueSetor = Array.from(new Set(filteredData.map((item) => item.setor_ppm)));

        const sortedRegistrosIds = uniqueRegistrosIds.sort((a, b) => {
          const pedidoA = filteredData.find((p) => p.registro === a);
          const pedidoB = filteredData.find((p) => p.registro === b);

          const transpA = pedidoA?.transportadora || "";
          const transpB = pedidoB?.transportadora || "";
          const regA = Number(pedidoA?.registro) || 0;
          const regB = Number(pedidoB?.registro) || 0;

          if (transpA < transpB) return -1;
          if (transpA > transpB) return 1;

          return regA - regB;
        });

        const totalROLO = filteredData
          .filter((item) => item.nome?.toLowerCase().includes("rolo"))
          .reduce((acc, item) => acc + Number(item.quant || 0), 0);

        const totalROMANA = filteredData
          .filter((item) => item.nome?.toLowerCase().includes("romana"))
          .reduce((acc, item) => acc + Number(item.quant || 0), 0);

        const totalPAINEL = filteredData
          .filter((item) => item.nome?.toLowerCase().includes("painel"))
          .reduce((acc, item) => acc + Number(item.quant || 0), 0);

        const total25MM = filteredData
          .filter((item) => item.nome?.toLowerCase().includes("25mm"))
          .reduce((acc, item) => acc + Number(item.quant || 0), 0);

        const total50MM = filteredData
          .filter((item) => item.nome?.toLowerCase().includes("50mm"))
          .reduce((acc, item) => acc + Number(item.quant || 0), 0);

        const totalVERTICAL = filteredData
          .filter((item) => item.nome?.toLowerCase().includes("vertical"))
          .reduce((acc, item) => acc + Number(item.quant || 0), 0);

        return (
          <TabsContent key={formattedTabDate} value={formattedTabDate}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-start gap-4 border-b pb-4">
                  <CardTitle>{formattedTabDate}</CardTitle>
                  <CardDescription>{uniqueRegistrosIds.length} Pedido(s)</CardDescription>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-4">
                  {uniqueSetor.includes("ESP") && (
                    <Card className="gap-2 py-2">
                      <CardHeader className="px-4 py-2 h-8">
                        <CardTitle className="">ESPECIAIS</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-1 px-2">
                        {totalROLO > 0 && (
                          <div className=" flex justify-between items-center">
                            <div className="flex justify-center items-center gap-2">
                              <Badge variant={"JT"} className="size-5 rounded-full border-none"></Badge>
                              <span>ROLÔ(S)</span>
                            </div>
                            <span className="flex items-center justify-center border size-7 text-sm  rounded-full font-bold "> {totalROLO}</span>
                          </div>
                        )}
                        {totalROMANA > 0 && (
                          <div className="flex justify-between items-center">
                            <div className="flex justify-center items-center gap-2">
                              <Badge variant={"JD"} className="size-5 rounded-full border-none"></Badge>
                              <span>ROMANA(S)</span>
                            </div>
                            <span className="flex items-center justify-center border size-7 text-sm  rounded-full font-bold "> {totalROMANA}</span>
                          </div>
                        )}
                        {totalPAINEL > 0 && (
                          <div className="flex justify-between items-center">
                            <div className="flex justify-center items-center gap-2">
                              <Badge variant={"AC"} className="size-5 rounded-full border-none"></Badge>
                              <span>PAINEL(S)</span>
                            </div>
                            <span className="flex items-center justify-center border size-7 text-sm  rounded-full font-bold "> {totalPAINEL}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                  {uniqueSetor.includes("HOR") && (
                    <Card className="gap-2 py-2">
                      <CardHeader className="px-4 py-2 h-8">
                        <CardTitle className=" ">HORIZONTAIS</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-1 px-2">
                        {total25MM > 0 && (
                          <div className="w-full flex justify-between items-center  ">
                            <div className="flex justify-center items-center gap-2">
                              <Badge variant={"LG"} className="size-5 rounded-full border-none"></Badge>
                              <span>25MM(S)</span>
                            </div>
                            <span className="flex items-center justify-center border size-7 text-sm  rounded-full font-bold "> {total25MM}</span>
                          </div>
                        )}
                        {total50MM > 0 && (
                          <div className="w-full flex justify-between items-center  ">
                            <div className="flex justify-center items-center gap-2">
                              <Badge variant={"RD"} className="size-5 rounded-full border-none"></Badge>
                              <span>50MM(S)</span>
                            </div>
                            <span className="flex items-center justify-center border size-7 text-sm  rounded-full font-bold "> {total50MM}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                  {uniqueSetor.includes("VER") && (
                    <Card className="gap-2 py-2">
                      <CardHeader className="px-4 py-2 h-8">
                        <CardTitle className=" ">VERTICAIS</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-1 px-2">
                        {totalVERTICAL > 0 && (
                          <div className="flex justify-between items-center">
                            <div className="flex justify-center items-center gap-2">
                              <Badge variant={"neutral"} className="size-5 rounded-full border-none"></Badge>
                              <span>VERTICAL(S)</span>
                            </div>
                            <span className="flex items-center justify-center border size-7 text-sm  rounded-full font-bold "> {totalVERTICAL}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardHeader>

              <div className="overflow-hidden rounded-md border mx-6 border-r-0">
                <Table className="text-[12px] bg-sidebar ">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[12px] font-semibold">
                        <div className="flex items-center gap-2 pl-4">
                          <Truck size={16} />
                          <span>TRANSP</span>
                        </div>
                      </TableHead>

                      <TableHead className="text-[12px] font-semibold">
                        <div className="flex items-center gap-2">
                          <User size={16} />
                          <span>NOME</span>
                        </div>
                      </TableHead>

                      <TableHead className="text-[12px] font-semibold">
                        <div className="flex items-center justify-start gap-2">
                          <ListTodo size={16} />
                          <span>REGISTRO</span>
                        </div>
                      </TableHead>

                      <TableHead className="text-[12px] font-semibold">
                        <div className="flex items-center gap-2">
                          <ListTodo size={16} />
                          <span>OS</span>
                        </div>
                      </TableHead>

                      <TableHead className="text-[12px] font-semibold">
                        <div className="flex items-center gap-2">
                          <ListTodo size={16} />
                          <span>NFe</span>
                        </div>
                      </TableHead>

                      <TableHead className="text-[12px] font-semibold">
                        <div className="flex items-center gap-2">
                          <ListTodo size={16} />
                          <span>NFt</span>
                        </div>
                      </TableHead>

                      <TableHead className="text-[12px] font-semibold">
                        <div className="flex gap-2 ">
                          <Package size={16} />
                          <span>VOL</span>
                        </div>
                      </TableHead>

                      {totalROLO > 0 && (
                        <TableHead className="border-x text-center">
                          <Badge variant={"JT"}>ROL</Badge>
                        </TableHead>
                      )}
                      {totalROMANA > 0 && (
                        <TableHead className="border-x text-center">
                          <Badge variant={"JD"}>ROM</Badge>
                        </TableHead>
                      )}
                      {totalPAINEL > 0 && (
                        <TableHead className="border-x text-center">
                          <Badge variant={"AC"}>PAI</Badge>
                        </TableHead>
                      )}
                      {total25MM > 0 && (
                        <TableHead className="border-x text-center">
                          <Badge variant={"LG"}>25M</Badge>
                        </TableHead>
                      )}
                      {total50MM > 0 && (
                        <TableHead className="border-x text-center">
                          <Badge variant={"RD"}>50M</Badge>
                        </TableHead>
                      )}
                      {totalVERTICAL > 0 && (
                        <TableHead className="border-x text-center">
                          <Badge variant={"neutral"}>VER</Badge>
                        </TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedRegistrosIds.map((regId, index) => {
                      const pedido = filteredData.find((p) => p.registro === regId);
                      const transpKey = (pedido?.transportadora.toUpperCase() || "DEFAULT") as TranspKey;
                      const currentStatus = transpConfig[transpKey];

                      const url = `https://www.mercadolivre.com.br/vendas/${pedido?.os}/detalhe`;

                      if (!pedido) return null;

                      const itensDoPedido = filteredData.filter((item) => item.registro === regId);

                      const getQuant = (termo: string) =>
                        itensDoPedido
                          .filter((item) => item.nome?.toLowerCase().includes(termo.toLowerCase()))
                          .reduce((acc, item) => acc + Number(item.quant || 0), 0);

                      const qRolo = getQuant("rolo");
                      const qRomana = getQuant("romana");
                      const qPainel = getQuant("painel");
                      const q25mm = getQuant("25mm");
                      const q50mm = getQuant("50mm");
                      const qVertical = getQuant("vertical");

                      return (
                        <TableRow key={index} className="">
                          <TableCell className="font-bold text-foreground pl-4">
                            <Badge variant={currentStatus?.variant ?? "neutral"}>{currentStatus?.label ?? "Não Informado"}</Badge>
                          </TableCell>
                          <TableCell>{!pedido.con_nome ? pedido.empresa : pedido.con_nome}</TableCell>
                          <TableCell className="flex items-center justify-start">
                            <div className="flex items-center justify-end mr-2 gap-2 ">
                              <span className="">{pedido.registro}</span>

                              <Badge
                                variant={"neutral"}
                                className="h-6 cursor-pointer"
                                onClick={() => modal?.openModal("viewPedido", pedido.registro)}
                              >
                                <Eye size={16} />
                              </Badge>
                            </div>
                          </TableCell>
                          {isAdmin ? (
                            <TableCell>
                              <div className="w-40 flex items-center justify-between">
                                <span className="gap-2">{pedido.os}</span>
                                <Link
                                  className="rounded-md cursor-pointer focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-sidebar-ring focus-visible:ring-offset-0"
                                  href={url}
                                  target="_blank"
                                >
                                  <Badge variant={"ML"} className="h-6">
                                    <Cable size={16} strokeWidth={1.5} />
                                  </Badge>
                                </Link>
                              </div>
                            </TableCell>
                          ) : (
                            <TableCell>{pedido.os}</TableCell>
                          )}
                          <TableCell>{pedido.nnota}</TableCell>
                          <TableCell>{pedido.transportadora !== "11845" ? pedido.con_obs : ""}</TableCell>
                          <TableCell>{pedido.volnumero}</TableCell>

                          {totalROLO > 0 && (
                            <TableCell className="border text-center">
                              {qRolo > 0 ? (
                                <Badge className="rounded-full" variant={"JT"}>
                                  {qRolo}
                                </Badge>
                              ) : (
                                ""
                              )}
                            </TableCell>
                          )}

                          {totalROMANA > 0 && (
                            <TableCell className="border text-center">
                              {qRomana > 0 ? (
                                <Badge className="rounded-full" variant={"JD"}>
                                  {qRomana}
                                </Badge>
                              ) : (
                                ""
                              )}
                            </TableCell>
                          )}

                          {totalPAINEL > 0 && (
                            <TableCell className="border text-center">
                              {qPainel > 0 ? (
                                <Badge className="rounded-full" variant={"AC"}>
                                  {qPainel}
                                </Badge>
                              ) : (
                                ""
                              )}
                            </TableCell>
                          )}

                          {total25MM > 0 && (
                            <TableCell className="border text-center">
                              {q25mm > 0 ? (
                                <Badge className="rounded-full" variant={"LG"}>
                                  {q25mm}
                                </Badge>
                              ) : (
                                ""
                              )}
                            </TableCell>
                          )}

                          {total50MM > 0 && (
                            <TableCell className="border text-center">
                              {q50mm > 0 ? (
                                <Badge className="rounded-full" variant={"RD"}>
                                  {q50mm}
                                </Badge>
                              ) : (
                                ""
                              )}
                            </TableCell>
                          )}

                          {totalVERTICAL > 0 && (
                            <TableCell className="border text-center">
                              {qVertical > 0 ? (
                                <Badge className="rounded-full" variant={"neutral"}>
                                  {qVertical}
                                </Badge>
                              ) : (
                                ""
                              )}
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
