import { describe, expect, it } from 'vitest';
import { findMentions } from './mentions';

const people = [
  { id: 'u1', name: 'Andrés Peña', email: 'andres.pena@ejemplo.co' },
  { id: 'u2', name: 'Ana', email: 'ana@ejemplo.co' },
  { id: 'u3', name: 'Ana María', email: 'amaria@ejemplo.co' },
];

describe('findMentions', () => {
  it('nombre sin tildes ni mayúsculas', () => {
    expect(findMentions('Mira esto @andres peña, porfa', people)).toEqual(['u1']);
  });

  it('parte local del correo', () => {
    expect(findMentions('@andres.pena revisa', people)).toEqual(['u1']);
  });

  it('gana el nombre más largo', () => {
    expect(findMentions('@Ana María y @ana', people)).toEqual(['u3', 'u2']);
  });

  it('no corta una palabra a la mitad', () => {
    expect(findMentions('@anabel', people)).toEqual([]);
  });

  it('sin repetir y sin arroba no hay menciones', () => {
    expect(findMentions('@ana @ANA', people)).toEqual(['u2']);
    expect(findMentions('ana', people)).toEqual([]);
  });
});
