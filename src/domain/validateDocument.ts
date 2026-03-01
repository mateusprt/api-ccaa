import { validateCpf } from "./validateCpf";

export function validateDocument(document: string): boolean {
  return !document || !validateCpf(document);
}