// Ilustraciones de estados vacíos y de error (static/illustrations, fondo transparente).
// Las dimensiones evitan saltos de layout mientras carga la imagen.
export const ILLUSTRATIONS = {
  'empty-reviews': { width: 560, height: 525 },
  'empty-approved': { width: 560, height: 464 },
  'empty-comments': { width: 482, height: 557 },
  'empty-notifications': { width: 494, height: 384 },
  'error-404': { width: 560, height: 434 },
  'error-403': { width: 560, height: 576 },
  'error-500': { width: 560, height: 464 },
  'link-expired': { width: 549, height: 467 },
  'token-cli': { width: 560, height: 538 },
} as const;

export type IllustrationName = keyof typeof ILLUSTRATIONS;
