// Minimal, dependency-free className joiner.
export type ClassValue = string | number | null | false | undefined;

export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ');
}

export default cn;
