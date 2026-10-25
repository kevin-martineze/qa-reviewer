import { resolve } from '$app/paths';
import type { Review } from '$lib/api/types';

export type ReviewTab = 'screens' | 'summary' | 'rounds' | 'feedback' | 'activity' | 'branch';

/** `meta` de cada pestaña del detalle: título, migas y pestaña activa. */
export function reviewMeta(review: Pick<Review, 'id' | 'title'>, tab: ReviewTab) {
  return {
    title: `${review.id} · ${review.title}`,
    crumbs: [{ label: 'Revisiones', href: resolve('/reviews') }, { label: review.id }],
    tab,
  };
}
