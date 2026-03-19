import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getNameInitials(name: string) {
  const nameParts = name.trim().split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts.at(-1) : "";
  const initials = `${firstName.charAt(0)}${lastName ? lastName.charAt(0) : ""}`;
  return initials.toUpperCase();
}

export function formatFullName(fullName: string): string {
  return fullName
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function formatDate(data: string): string {
  return new Date(data).toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

export function formatDecimal(number: number): string {
  const value = number;
  const scaledValue = value * 1000;
  const formatted = scaledValue.toLocaleString("en-US");
  return formatted;
}

export const formatMedidas = (valor: number | string | null | undefined): string => {
  const num = Number(valor);

  if (isNaN(num)) return "0,00";

  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(num);
};
