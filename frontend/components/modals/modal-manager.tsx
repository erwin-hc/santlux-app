"use client";
import { useModal } from "@/providers/modal-provider";
import { PedidoModalDataEntrega } from "./modal.pedidos.data-entrega";

export const ModalManager = () => {
  const { type, isOpen } = useModal();

  if (!isOpen) return null;

  return <>{type === "PedidoModalDataEntrega" && <PedidoModalDataEntrega />}</>;
};
