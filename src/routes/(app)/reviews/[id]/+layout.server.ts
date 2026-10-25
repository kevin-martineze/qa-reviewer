import type { LayoutServerLoad } from './$types';
import { reviewAbilities } from '$lib/domain/review-abilities';
import { gateway } from '$lib/server/gateway';
import { requireUser, unwrap } from '$lib/server/guards';

// Compartido por las pestañas del detalle y el visor.
export const load: LayoutServerLoad = async ({ locals, params, depends, fetch, url }) => {
  const user = requireUser(locals);
  depends(`review:${params.id}`);

  const g = gateway(locals, fetch);
  const review = unwrap(await g.reviews.get(params.id), url);
  const [comments, members] = await Promise.all([
    g.feedback.comments(review.id),
    g.directory.listMembers(review.project),
  ]);

  const can = reviewAbilities(user, review);
  return {
    review,
    comments: comments.ok ? comments.data : [],
    // Quién puede quedar asignado: diseño del proyecto.
    designers: members.ok
      ? members.data
          .filter((m) => m.role === 'designer' || m.role === 'design_lead')
          .map((m) => m.userId)
      : [],
    can,
  };
};
