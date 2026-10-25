import type { Comment, Review, ReviewStatus } from '$lib/api/types';

const STATUS_LABELS: Record<ReviewStatus, string> = {
  draft: 'Borrador',
  open: 'Abierta',
  in_review: 'En revisión',
  changes_requested: 'Requiere ajustes',
  approved: 'Aprobada',
  closed: 'Cerrada',
};

// Texto que `/design-review status` devuelve a Claude Code en la sesión de la feature.
export function feedbackText(
  review: Review,
  comments: readonly Comment[],
  names: Record<string, string>,
): string {
  const name = (id: string): string => names[id] ?? id;
  const approved = review.screens.filter((s) => s.verdict === 'approved').length;
  const changes = review.screens.filter((s) => s.verdict === 'changes_requested');
  const pending = review.screens.filter((s) => s.verdict === 'pending').length;

  const lines = [`$ /design-review status ${review.id}`, ''];
  lines.push(`${review.id} · ${review.card} · PR #${review.pr} · Ronda ${review.round}`);
  lines.push(
    `Estado: ${STATUS_LABELS[review.status]} · revisa ${review.assignees.map(name).join(', ')} · ${review.due.label}`,
  );
  lines.push(
    `Pantallas: ${approved} aprobadas · ${changes.length} con ajuste · ${pending} sin veredicto`,
  );

  if (changes.length) {
    lines.push('', 'Ajuste pedido en');
    for (const s of changes) lines.push(`  - ${s.key} · ${s.title}`);
  }

  const open = comments.filter((c) => c.review === review.id && !c.resolved);
  lines.push('', `Comentarios abiertos (${open.length})`);
  if (!open.length) lines.push('  Ninguno.');
  open.forEach((c, i) => {
    const s = review.screens.find((x) => x.key === c.screen);
    const state =
      c.round < review.round
        ? c.followUp === 'still'
          ? 'diseño confirma que sigue igual'
          : `de la ronda ${c.round}, diseño aún no confirma`
        : `nuevo en la ronda ${c.round}`;
    lines.push('', `${i + 1}. [${c.screen} · ${s ? s.title : ''}] ${state}`);
    if (c.el) {
      lines.push(`   ${c.el.file}:${c.el.line}`);
      lines.push(`   ${c.el.name} · ${c.el.selector}`);
    } else if (c.anchor) {
      lines.push(
        `   Punto (${Math.round(c.anchor.x * 100)} %, ${Math.round(c.anchor.y * 100)} %) sin componente asociado`,
      );
    }
    lines.push(`   ${name(c.author)}: «${c.body}»`);
    for (const r of c.replies) lines.push(`   ${name(r.author)} respondió: «${r.body}»`);
  });

  lines.push(
    '',
    'Siguiente paso: aplica los ajustes y corre /design-review para subir la próxima ronda.',
  );
  lines.push('Solo se recapturan las pantallas que cambien; las demás heredan su veredicto.');
  return lines.join('\n');
}
