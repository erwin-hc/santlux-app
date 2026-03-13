"use client";
import { useModal } from "@/providers/modal-provider";
import { ModalUpdatePrevisao } from "./modal.pedidos.update-previsao";
import { ModalUpdateEntrega } from "./modal.pedidos.update-entrega";

export const ModalManager = () => {
  const { type, isOpen } = useModal();

  if (!isOpen) return null;

  return (
    <>
      {type === "updatePrevisao" && <ModalUpdatePrevisao />}
      {type === "updateEntrega" && <ModalUpdateEntrega />}
    </>
  );
};
