/** Directorio mínimo que el layout de la app entrega a todas las páginas. */
export interface Person {
  name: string;
  email: string;
  active: boolean;
}

export type People = Record<string, Person>;

export function nameOf(people: People, id: string | null | undefined): string {
  if (!id) return 'Sistema';
  return people[id]?.name ?? 'Usuario eliminado';
}
