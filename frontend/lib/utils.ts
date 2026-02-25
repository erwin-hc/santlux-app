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
