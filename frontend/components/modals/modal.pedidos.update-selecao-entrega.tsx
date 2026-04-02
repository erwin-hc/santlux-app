"use client";
import { useModal } from "@/providers/modal-provider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarCog, CircleCheckBig } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMessages } from "@/providers/message-provider";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";
import { useState } from "react";

const DataScheme = z.object({
  dia: z.string().refine(
    (val) => {
      const n = Number(val);
      return n >= 1 && n <= 31;
    },
    { message: "Dia inválido" },
  ),

  mes: z.string().refine(
    (val) => {
      const n = Number(val);
      return n >= 1 && n <= 12;
    },
    { message: "Mês inválido" },
  ),

  ano: z.string().refine(
    (val) => {
      const n = Number(val);
      return n >= 2000 && n <= 2199;
    },
    { message: "Ano inválido" },
  ),
});

export type DataFormValues = z.input<typeof DataScheme>;

interface PedidoData {
  os?: string;
  con_nome?: string;
  previsao?: string;
  registro?: number;
  nnota?: number;
  empresa?: string;
}

export function ModalUpdateSelecionadosEntrega() {
  const { addMessage } = useMessages();
  const modal = useModal();
  const selectedItems = (modal.data as PedidoData[]) || [];
  const quantidade = selectedItems.length;

  const [processedIds, setProcessedIds] = useState<number[]>([]);
  const [, setIsUpdating] = useState(false);

  const dateObj = new Date();
  const dia = String(dateObj.getUTCDate()).padStart(2, "0");
  const mes = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
  const ano = String(dateObj.getUTCFullYear());

  const form = useForm<DataFormValues>({
    resolver: zodResolver(DataScheme),
    mode: "onBlur",
    defaultValues: {
      dia: dia,
      mes: mes,
      ano: ano,
    },
  });

  if (!modal) return null;

  const onSubmit: SubmitHandler<DataFormValues> = async (values) => {
    const dataFormatada = `${values.dia.padStart(2, "0")}/${values.mes.padStart(2, "0")}/${values.ano}`;
    setIsUpdating(true);
    setProcessedIds([]);

    try {
      for (const item of selectedItems) {
        const response = await fetch(`/api/pedidos/entrega/${item.nnota}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: dataFormatada }),
        });

        if (response.ok) {
          setProcessedIds((prev) => [...prev, item.registro!]);
        }
      }

      window.dispatchEvent(new Event("refresh-pedidos"));
      addMessage("success", `${quantidade} Pedidos atualizados!`);
      modal.closeModal();
    } catch (e) {
      console.error(e);
      addMessage("error", "Erro ao atualizar alguns itens.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={modal.isOpen} onOpenChange={(open) => !open && modal.closeModal()}>
      <DialogContent className="sm:max-w-125 w-[95vw] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-start ">
            <CalendarCog />
            <span className="text-2xl font-bold underline underline-offset-8 uppercase">SELEÇÃO ENTREGUE</span>
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-48 overflow-y-auto my-1 rounded-md border border-border">
          <Table>
            <TableBody>
              {selectedItems.map((i) => {
                const isDone = processedIds.includes(i.registro!);

                return (
                  <TableRow key={i.nnota} className="hover:bg-transparent [&_tr]:h-8 [&_td]:py-1 [&_td]:px-05">
                    <TableCell className="py-2">
                      <div className="flex justify-start">
                        <span className="font-semibold text-sm text-muted-foreground flex items-center justify-start gap-1">
                          <CircleCheckBig size={16} className={`mr-2 transition-colors duration-300 ${isDone ? "text-emerald-500" : "text-muted"}`} />
                          {!i.nnota ? <span>{i?.os}</span> : <span>{i?.nnota}</span>}
                        </span>
                        <span className="font-semibold text-sm text-muted-foreground flex items-center justify-start gap-1">
                          <span className="px-2"> - </span>
                          {!i.con_nome ? <span>{i?.empresa}</span> : <span>{i?.con_nome}</span>}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <Form {...form}>
          <form id="data-entrega-form" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex w-full items-start gap-3 ">
              <FormField
                control={form.control}
                name="dia"
                render={({ field }) => (
                  <FormItem className="flex-1 min-w-15">
                    <FormLabel className="font-bold  uppercase block text-center">Dia</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        className="text-center h-12 text-2xl! tracking-widest"
                        inputMode="numeric"
                        maxLength={2}
                        {...field}
                        onFocus={() => {
                          if (form.formState.errors.dia) {
                            form.setValue("dia", "");
                            form.clearErrors("dia");
                          }
                        }}
                      />
                    </FormControl>
                    <div className="h-6 flex items-center justify-center">
                      <FormMessage className=" text-base" />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mes"
                render={({ field }) => (
                  <FormItem className="flex-1 min-w-15">
                    <FormLabel className="font-bold  uppercase block text-center">Mês</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        className="text-center h-12 text-2xl! tracking-widest"
                        inputMode="numeric"
                        maxLength={2}
                        {...field}
                        onFocus={() => {
                          if (form.formState.errors.mes) {
                            form.setValue("mes", "");
                            form.clearErrors("mes");
                          }
                        }}
                      />
                    </FormControl>
                    <div className="h-6 flex items-center justify-center">
                      <FormMessage className=" text-base" />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ano"
                render={({ field }) => (
                  <FormItem className="flex-[1.5] min-w-20">
                    <FormLabel className="font-bold  uppercase block text-center">Ano</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        className="text-center h-12 text-2xl! tracking-widest"
                        inputMode="numeric"
                        maxLength={4}
                        {...field}
                        onFocus={() => {
                          if (form.formState.errors.ano) {
                            form.setValue("ano", "");
                            form.clearErrors("ano");
                          }
                        }}
                      />
                    </FormControl>

                    <div className="h-6 flex items-center justify-center">
                      <FormMessage className=" text-base" />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>

        <DialogFooter className="flex flex-row justify-end gap-3 ">
          <Button type="submit" form="data-entrega-form" className="w-28 flex-1 sm:flex-none">
            Salvar
          </Button>
          <Button variant="outline" type="button" onClick={modal.closeModal} className="w-28 flex-1 sm:flex-none">
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
