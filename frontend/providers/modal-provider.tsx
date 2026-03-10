"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the available modal types
export type ModalType = "PedidoModalDataEntrega" | "deletePedido" | "createUser" | null;

export interface ModalContextData {
  isOpen: boolean;
  type: ModalType;
  data: unknown;
  openModal: (type: ModalType, data?: unknown) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextData | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<ModalType>(null);
  const [data, setData] = useState<unknown>(null);

  const openModal = (type: ModalType, data: unknown = null) => {
    setType(type);
    setData(data);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setType(null);
    setData(null);
  };

  return (
    <ModalContext.Provider value={{ isOpen, type, data, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within ModalProvider");
  return context;
};