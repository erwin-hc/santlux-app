// components/modals/modal-manager.tsx
"use client"
import { useModal } from "@/providers/modal-provider";
import { PedidoModalDataEntrega } from "./modal.pedidos.data-entrega";


export const ModalManager = () => {
  const { type, isOpen } = useModal();

  if (!isOpen) return null;

  // Switch between different modal components
  return (
    <>
      {type === "PedidoModalDataEntrega" && <PedidoModalDataEntrega />}
      {/* {type === "deletePedido" && <DeletePedidoModal />} */}
    </>
  );
};