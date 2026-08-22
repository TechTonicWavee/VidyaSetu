import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/** Resolve a lucide icon component by its string name (with a safe fallback). */
export function icon(name: string): LucideIcon {
  return (Icons as unknown as Record<string, LucideIcon>)[name] ?? Icons.Circle;
}

export default icon;
