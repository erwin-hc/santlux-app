"use client";
import { useModal } from "@/providers/modal-provider";
import { ModalUpdatePrevisao } from "./modal.pedidos.update-previsao";
import { ModalUpdateEntrega } from "./modal.pedidos.update-entrega";
import { ModalUpdateSelecionadosEntrega } from "./modal.pedidos.update-selecao-entrega";
import { ModalViewPedido } from "./modal.pedidos.view-pedido";
import { ModalUpdateVolume } from "./modal.pedidos.update-volume";

export const ModalManager = () => {
  const { type, isOpen } = useModal();

  if (!isOpen) return null;

  return (
    <>
      {type === "updatePrevisao" && <ModalUpdatePrevisao />}
      {type === "updateEntrega" && <ModalUpdateEntrega />}
      {type === "updateEntregaSelecao" && <ModalUpdateSelecionadosEntrega />}
      {type === "viewPedido" && <ModalViewPedido />}
      {type === "updateVolume" && <ModalUpdateVolume />}
    </>
  );
};
