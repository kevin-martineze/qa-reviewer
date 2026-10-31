import type { LayoutServerLoad } from './$types';
import { assignableDesigners } from '$lib/domain/assignees';
import { reviewAbilities } from '$lib/domain/review-abilities';
import { gateway } from '$lib/server/gateway';
import { requireUser, unwrap } from '$lib/server/guards';

// Compartido por las pestañas del detalle y el visor.
export const load: LayoutServerLoad = async ({ locals, params, depends, fetch, url, parent }) => {
  const user = requireUser(locals);
  depends(`review:${params.id}`);

  const g = gateway(locals, fetch);
  const review = unwrap(await g.reviews.get(params.id), url);
  const [comments, members, { people }] = await Promise.all([
    g.feedback.comments(review.id),
    g.directory.listMembers(review.project),
    parent(),
  ]);

  const can = reviewAbilities(user, review);
  return {
    review,
    comments: comments.ok ? comments.data : [],
    designers: members.ok ? assignableDesigners(members.data, review.author, people) : [],
    can,
  };
};
