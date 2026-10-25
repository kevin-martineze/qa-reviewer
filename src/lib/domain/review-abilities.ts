import type { Review, SessionUser } from '$lib/api/types';
import { permissionsFor } from './permissions';

/** Qué puede hacer el usuario en esta revisión. Es solo UX: el API vuelve a validar. */
export interface ReviewAbilities {
  /** Dar veredicto y enviar la ronda. */
  verdict: boolean;
  comment: boolean;
  /** Marcar un comentario como resuelto. */
  resolve: boolean;
  /** Borrar comentarios de otros. */
  moderate: boolean;
  assign: boolean;
  /** Anular el último envío y volver a «En revisión». */
  reopen: boolean;
  isAuthor: boolean;
}

export function reviewAbilities(
  user: SessionUser,
  review: Pick<Review, 'project' | 'author' | 'status'>,
): ReviewAbilities {
  const perms = permissionsFor(user, review.project);
  const isAuthor = review.author === user.id;
  const roundOpen = review.status === 'open' || review.status === 'in_review';
  const submitted = review.status === 'approved' || review.status === 'changes_requested';
  return {
    verdict: perms.has('verdicts:set') && !isAuthor && roundOpen,
    comment: perms.has('comments:create') && review.status !== 'closed',
    resolve: perms.has('comments:resolve') && review.status !== 'closed',
    moderate: perms.has('comments:moderate'),
    assign: perms.has('reviews:assign') && review.status !== 'closed',
    reopen: perms.has('reviews:reopen') && submitted,
    isAuthor,
  };
}
