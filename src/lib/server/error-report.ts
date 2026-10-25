import { randomUUID } from 'node:crypto';

export function newErrorId(): string {
  return randomUUID().replaceAll('-', '').slice(0, 8);
}
