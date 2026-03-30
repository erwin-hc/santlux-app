import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PedidosType } from "@/app/painel/producao/page";
import { formatDate } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { transpConfig } from "@/app/painel/pedidos/columns";
import { statusConfig } from "@/app/painel/pedidos/columns";
import { Badge } from "./ui/badge";
import { Cable, Eye } from "lucide-react";
import { useModal as useModalHook } from "@/providers/modal-provider";
import { useIsAdmin } from "@/hooks/use-admin";
import Link from "next/link";
import PersianaRolo from "./persianas/rolo";

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
          <TabsTrigger key={formatDate(date)} value={formatDate(date)}>
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {uniqueSetor.includes("ESP") && (
                    <Card className="py-2 ">
                      <CardHeader className="  ">
                        <CardTitle className=" ">ESPECIAIS</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-1 px-2">
                        {totalROLO > 0 && (
                          <Badge variant={"JT"} className="w-full flex justify-between items-center  ">
                            ROLÔ(S) <span className="bg-sidebar-accent px-2 py-1 border rounded-md font-bold "> {totalROLO}</span>
                          </Badge>
                        )}
                        {totalROMANA > 0 && (
                          <Badge variant={"JD"} className="w-full flex justify-between items-center  ">
                            ROMANA(S) <span className="bg-sidebar-accent px-2 py-1 border rounded-md font-bold "> {totalROMANA}</span>
                          </Badge>
                        )}
                        {totalPAINEL > 0 && (
                          <Badge variant={"aberto"} className="w-full flex justify-between items-center  ">
                            PAINEL(S) <span className="bg-sidebar-accent px-2 py-1 border rounded-md font-bold "> {totalPAINEL}</span>
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  )}
                  {uniqueSetor.includes("HOR") && (
                    <Card className="py-2  ">
                      <CardHeader className="  ">
                        <CardTitle className=" ">HORIZONTAIS</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-1 px-2">
                        {total25MM > 0 && (
                          <Badge variant={"LG"} className="w-full flex justify-between items-center  ">
                            25MM(S) <span className="bg-sidebar-accent px-2 py-1 border rounded-md font-bold "> {total25MM}</span>
                          </Badge>
                        )}
                        {total50MM > 0 && (
                          <Badge variant={"RD"} className="w-full flex justify-between items-center  ">
                            50MM(S) <span className="bg-sidebar-accent px-2 py-1 border rounded-md font-bold "> {total50MM}</span>
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  )}
                  {uniqueSetor.includes("VER") && (
                    <Card className="py-2 ">
                      <CardHeader className="  ">
                        <CardTitle className=" ">VERTICAIS</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-1 px-2">
                        {totalVERTICAL > 0 && (
                          <Badge variant={"neutral"} className="w-full flex justify-between items-center  ">
                            VERTICAL(S) <span className="bg-sidebar-accent px-2 py-1 border rounded-md font-bold "> {totalVERTICAL}</span>
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardHeader>
              <CardContent className=" text-muted-foreground">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>TRANSP</TableHead>
                      <TableHead>NOME</TableHead>
                      <TableHead className="text-left">REGISTRO</TableHead>
                      <TableHead>OS</TableHead>
                      <TableHead>NFe</TableHead>
                      <TableHead>NFt</TableHead>
                      <TableHead>VOL</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedRegistrosIds.map((regId, index) => {
                      const pedido = filteredData.find((p) => p.registro === regId);
                      const transpKey = (pedido?.transportadora.toUpperCase() || "DEFAULT") as TranspKey;
                      const currentStatus = transpConfig[transpKey];

                      const url = `https://www.mercadolivre.com.br/vendas/${pedido?.os}/detalhe`;

                      if (!pedido) return null;

                      return (
                        <TableRow key={index} className=" pb-2 last:border-0">
                          <TableCell className="font-bold text-foreground">
                            <Badge variant={currentStatus?.variant ?? "neutral"}>{currentStatus?.label ?? "Não Informado"}</Badge>
                          </TableCell>
                          <TableCell>{!pedido.con_nome ? pedido.empresa : pedido.con_nome}</TableCell>
                          <TableCell className="flex items-center justify-start">
                            <div
                              className="flex items-center justify-end mr-2 gap-1 cursor-pointer"
                              onClick={() => modal?.openModal("viewPedido", pedido.registro)}
                            >
                              <span className="">{pedido.registro}</span>

                              <Badge variant={"neutral"} className="h-6">
                                <Eye size={16} />
                              </Badge>
                            </div>
                          </TableCell>
                          {isAdmin ? (
                            <TableCell>
                              <div className="w-43 flex items-center justify-between">
                                <span className="gap-1">{pedido.os}</span>
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
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
