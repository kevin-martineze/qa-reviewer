import type { Comment } from '$lib/api/types';

// Comentario de una ronda vieja aún abierto: pide confirmación al diseñador.
export function awaitingFollowUp(comment: Comment, currentRound: number): boolean {
  return comment.round < currentRound && !comment.resolved && comment.followUp !== 'still';
}
