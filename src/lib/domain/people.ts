/** Directorio mínimo que el layout de la app entrega a todas las páginas. */
export interface Person {
  name: string;
  email: string;
  active: boolean;
  /** Id del banco de avatares, o `null` para las iniciales. */
  avatar: string | null;
}

export type People = Record<string, Person>;

export function nameOf(people: People, id: string | null | undefined): string {
  if (!id) return 'Sistema';
  return people[id]?.name ?? 'Usuario eliminado';
}

/** Nombre y avatar para `UserAvatar`/`AvatarStack`. */
export function personOf(
  people: People,
  id: string | null | undefined,
): { name: string; avatar: string | null } {
  return { name: nameOf(people, id), avatar: id ? (people[id]?.avatar ?? null) : null };
}
