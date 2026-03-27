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

const VolumeScheme = z.object({
  volnumero: z.string().refine(
    (val) => {
      const n = Number(val);
      return n >= 1 && n <= 99;
    },
    { message: "Quantidade inválida" },
  ),
});

export type VolumeFormValues = z.input<typeof VolumeScheme>;

interface PedidoData {
  os?: string;
  con_nome?: string;
  previsao?: string;
  registro?: number;
  nnota?: number;
  empresa?: string;
  volnumero?: string;
  pedido?: string;
}

export function ModalUpdateVolume() {
  const { addMessage } = useMessages();
  const modal = useModal();
  const data = modal.data as PedidoData;
  const pedido = data.pedido;

  const [, setIsUpdating] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const form = useForm<VolumeFormValues>({
    resolver: zodResolver(VolumeScheme),
    mode: "onBlur",
    defaultValues: {
      volnumero: String(data.volnumero),
    },
  });

  if (!modal) return null;

  const onSubmit: SubmitHandler<VolumeFormValues> = async (formData) => {
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/pedidos/qtvolume/${pedido}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsDone(true);
        await new Promise((resolve) => setTimeout(resolve, 400));

        window.dispatchEvent(new Event("refresh-pedidos"));
        addMessage("success", "Volume atualizado!");
        modal.closeModal();
      } else {
        addMessage("error", "Algo deu errado!");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      addMessage("error", "Erro de conexão.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={modal.isOpen} onOpenChange={(open) => !open && modal.closeModal()}>
      <DialogContent className="sm:max-w-125 w-[95vw] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-start gap-4">
            <CalendarCog />
            <span className="text-2xl font-bold underline underline-offset-4 uppercase">VOLUMES</span>
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-48 overflow-y-auto my-1 rounded-md border border-border">
          <Table>
            <TableBody>
              <TableRow key={data?.os} className="hover:bg-transparent [&_tr]:h-8 [&_td]:py-1 [&_td]:px-05">
                <TableCell className="py-2">
                  <div className="flex justify-start">
                    <span className="font-semibold text-sm text-muted-foreground flex items-center justify-start gap-1">
                      <CircleCheckBig size={16} className={`mr-2 transition-colors duration-300 ${isDone ? "text-emerald-500" : "text-muted"}`} />
                      {!data.nnota ? <span>{data?.os}</span> : <span>{data?.nnota}</span>}
                    </span>
                    <span className="font-semibold text-sm text-muted-foreground flex items-center justify-start gap-1">
                      <span className="px-2"> - </span>
                      {!data.con_nome ? <span>{data?.empresa}</span> : <span>{data?.con_nome}</span>}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <Form {...form}>
          <form id="data-entrega-form" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex w-full items-start gap-3 ">
              <FormField
                control={form.control}
                name="volnumero"
                render={({ field }) => (
                  <FormItem className="flex-1 min-w-15">
                    <FormLabel className="font-bold  uppercase block text-center">Qtd.Volumes</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        className="text-center h-12 text-2xl! tracking-widest"
                        inputMode="numeric"
                        maxLength={3}
                        {...field}
                        onFocus={() => {
                          if (form.formState.errors.volnumero) {
                            form.setValue("volnumero", "");
                            form.clearErrors("volnumero");
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
