// Datos semilla del mock, tipados desde el prototipo (qa-proto-backup/qa-reviewer.html).
// Contraseñas SOLO de mock: viven aquí, nunca en .env.
import type {
  ActivityEvent,
  ApiToken,
  Comment,
  ElementRef,
  Notification,
  Organization,
  Project,
  ProjectRole,
  Review,
  Round,
  Screen,
  ScreenElement,
  User,
  Verdict,
} from '$lib/api/types';

export const ORG: Organization = { name: 'Pangea' };
export const DEMO_PASSWORD = 'demo1234';

export const USERS: Record<string, User> = {
  u1: {
    id: 'u1',
    name: 'Kevin Martínez',
    email: 'kevin@ejemplo.co',
    orgRole: 'admin',
    status: 'active',
    last: 'Hace 5 min',
  },
  u2: {
    id: 'u2',
    name: 'Laura Ríos',
    email: 'laura.rios@ejemplo.co',
    orgRole: 'admin',
    status: 'active',
    last: 'Hace 12 min',
  },
  u3: {
    id: 'u3',
    name: 'Andrés Peña',
    email: 'andres.pena@ejemplo.co',
    orgRole: 'member',
    status: 'active',
    last: 'Hoy, 9:40 a. m.',
  },
  u4: {
    id: 'u4',
    name: 'Sofía Vargas',
    email: 'sofia.vargas@ejemplo.co',
    orgRole: 'member',
    status: 'active',
    last: 'Ayer',
  },
  u5: {
    id: 'u5',
    name: 'Mateo Cárdenas',
    email: 'mateo.cardenas@ejemplo.co',
    orgRole: 'member',
    status: 'active',
    last: 'Hoy, 11:02 a. m.',
  },
  u6: {
    id: 'u6',
    name: 'Camila Torres',
    email: 'camila.torres@ejemplo.co',
    orgRole: 'member',
    status: 'active',
    last: 'Hace 3 días',
  },
  u7: {
    id: 'u7',
    name: 'Valentina Ruiz',
    email: 'valentina.ruiz@ejemplo.co',
    orgRole: 'owner',
    status: 'active',
    last: 'Hace 2 h',
  },
  u8: {
    id: 'u8',
    name: 'Julián Ospina',
    email: 'julian.ospina@ejemplo.co',
    orgRole: 'member',
    status: 'inactive',
    last: 'Hace 2 meses',
  },
};

export const PROJECTS: Project[] = [
  {
    id: 'lideris',
    name: 'Lideris',
    repo: 'pangea-soluciones/lideris-v2',
    plane: 'LIDER',
    sla: 2,
    strategy: 'by_module',
    reviews: 6,
  },
  {
    id: 'auralis',
    name: 'Auralis',
    repo: 'pangea-soluciones/auralis-admin',
    plane: 'AUR',
    sla: 3,
    strategy: 'round_robin',
    reviews: 2,
  },
];

// Rol de proyecto por usuario (simplificado: un rol por usuario en Lideris).
export const MEMBERS: Record<string, ProjectRole> = {
  u1: 'developer',
  u2: 'design_lead',
  u3: 'designer',
  u4: 'designer',
  u5: 'developer',
  u6: 'viewer',
  u7: 'project_admin',
  u8: 'designer',
};

export const SEED_TOKENS: ApiToken[] = [
  {
    id: 't1',
    label: 'Skill · Lideris (dev)',
    prefix: 'qa_pat_lideris_ab12****',
    project: 'lideris',
    createdAt: 'Hace 2 días',
    lastUsedAt: 'Hoy, 9:10 a. m.',
  },
];

/* ── Mapa de elementos (archivo, línea y selector reales del commit) ── */

const F_TAB = 'src/lib/components/organisms/preorders/detail/PreOrderProductsTab.svelte';
const F_LAYOUT = 'src/routes/(app)/(purchases)/preorders/[id]/+layout.svelte';

const EL = {
  tabs: {
    name: 'NavTabs',
    file: F_LAYOUT,
    line: 123,
    selector: 'main nav:has(a[href$="/products-services"])',
  },
  alert: { name: 'PreOrderAlerts', file: F_LAYOUT, line: 126, selector: 'main [role="alert"]' },
  search: {
    name: 'TextField · Buscar productos',
    file: F_TAB,
    line: 388,
    selector: 'input[name="search"]',
  },
  edit: {
    name: 'Button · Editar cantidades',
    file: F_TAB,
    line: 400,
    selector: 'button:has(svg.lucide-pencil)',
  },
  row: { name: 'itemRow · Card', file: F_TAB, line: 316, selector: '[data-slot="card"]' },
  stepper: {
    name: 'QuantityStepper',
    file: F_TAB,
    line: 298,
    selector: '[data-slot="card"] [data-slot="input"]',
  },
  before: {
    name: 'Texto «Antes: N»',
    file: F_TAB,
    line: 307,
    selector: '[data-slot="card"] .t-xs-regular',
  },
  bar: {
    name: 'Barra de guardado',
    file: F_TAB,
    line: 454,
    selector: 'form[action="?/updateItems"]',
  },
  count: {
    name: 'Contador de cambios',
    file: F_TAB,
    line: 462,
    selector: 'form[action="?/updateItems"] .t-sm-medium',
  },
  save: {
    name: 'Button · Guardar cambios',
    file: F_TAB,
    line: 475,
    selector: 'form[action="?/updateItems"] button[type="submit"]',
  },
  reason: { name: 'Texto «no editable»', file: F_TAB, line: 409, selector: 'main p.t-sm-regular' },
  budget: { name: 'Presupuesto', file: F_TAB, line: 436, selector: 'main .bg-secondary' },
  total: { name: 'Total aproximado', file: F_TAB, line: 443, selector: 'main .bg-accent' },
} satisfies Record<string, ElementRef>;

const boxer =
  (W: number, H: number) =>
  (
    key: keyof typeof EL,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    name?: string,
  ): ScreenElement => {
    const el = EL[key];
    return {
      id: `${key}-${x1}-${y1}`,
      name: name ?? el.name,
      file: el.file,
      line: el.line,
      selector: el.selector,
      box: { x: x1 / W, y: y1 / H, w: (x2 - x1) / W, h: (y2 - y1) / H },
    };
  };

const b720 = boxer(1280, 720);
const b891 = boxer(1267, 891);

const TOP_720 = [b720('tabs', 290, 158, 1248, 203), b720('alert', 292, 231, 1244, 316)];
const BAR_720 = [
  b720('bar', 292, 594, 1244, 667),
  b720('count', 308, 612, 460, 630),
  b720('save', 1079, 613, 1227, 648),
];
const R2_NOTE =
  'Ronda 2: la fila editada lleva fondo primary/5 y borde de 2 px (antes, anillo primary/60).';

const FI = {
  normal: '/fixtures/screen-normal.svg',
  edit: '/fixtures/screen-edit.svg',
  editR1: '/fixtures/screen-edit-r1.svg',
  editR2: '/fixtures/screen-edit-r2.svg',
};

type ScreenSeed = Omit<Screen, 'verdict'>;

const SCREENS_628: ScreenSeed[] = [
  {
    key: 'a',
    title: 'Vista normal de Productos / Servicios',
    lead: 'Así se ve la pestaña antes de editar.',
    vp: '1280 × 720',
    route: '/preorders/[id]/products-services',
    img: FI.normal,
    before: null,
    inherited: true,
    elements: [
      ...TOP_720,
      b720('search', 773, 332, 1053, 368),
      b720('edit', 1065, 332, 1240, 368),
      b720('row', 295, 392, 1241, 592),
    ],
    changes: [
      'Nuevo botón «Editar cantidades» (outline, ícono lápiz) junto al buscador.',
      'Solo aparece si la pre-orden no tiene cotizaciones y el usuario tiene permiso.',
    ],
    questions: ['¿Variante, tamaño y ubicación del botón están bien?'],
  },
  {
    key: 'b',
    title: 'Modo edición, sin cambios',
    lead: 'Después de pulsar «Editar cantidades».',
    vp: '1280 × 720',
    route: '/preorders/[id]/products-services',
    img: FI.edit,
    before: FI.normal,
    inherited: true,
    elements: [
      ...TOP_720,
      b720('search', 960, 332, 1240, 368),
      b720('row', 295, 392, 1241, 590),
      b720('stepper', 858, 498, 980, 531),
      ...BAR_720,
    ],
    changes: [
      '«Cantidad aprobada» pasa a un stepper (− / campo centrado / +).',
      'Mínimo 1, máximo la cantidad solicitada; el botón se deshabilita en el límite.',
      'Barra fija: «Sin cambios», ayuda de límites, Cancelar y Guardar (deshabilitado).',
    ],
    questions: ['¿La ayuda de límites va en la barra o mejor por fila?'],
  },
  {
    key: 'c',
    title: 'Filas modificadas',
    lead: 'Primera fila de 10 a 7 y segunda de 17 a 12.',
    vp: '1280 × 720',
    route: '/preorders/[id]/products-services',
    img: FI.editR2,
    r1: FI.editR1,
    before: FI.edit,
    changedIn: 2,
    roundNote: R2_NOTE,
    diff: [{ x: 0.225, y: 0.5333, w: 0.75, h: 0.2889 }],
    elements: [
      ...TOP_720,
      b720('search', 960, 332, 1240, 368),
      b720('row', 295, 392, 1241, 590),
      b720('stepper', 858, 487, 980, 521),
      b720('before', 858, 525, 915, 541),
      ...BAR_720,
    ],
    changes: [
      'Fila modificada: fondo suave y borde en color primario, con «Antes: N» bajo el stepper.',
      '«Cantidad adjudicada» y totales se recalculan con la cantidad nueva.',
      'La barra cuenta los cambios y habilita «Guardar cambios».',
    ],
    questions: ['¿El fondo primary/5 con borde de 2 px ya se distingue lo suficiente?'],
  },
  {
    key: 'd',
    title: 'Desplazamiento a 1280 × 720',
    lead: 'La segunda fila modificada, después de bajar en la lista.',
    vp: '1280 × 720',
    route: '/preorders/[id]/products-services',
    img: FI.editR2,
    r1: FI.editR1,
    before: null,
    changedIn: 2,
    roundNote: `${R2_NOTE} La barra no cambió: ver el comentario 1.`,
    diff: [{ x: 0.225, y: 0.4444, w: 0.75, h: 0.3333 }],
    elements: [
      ...TOP_720,
      b720('row', 295, 318, 1241, 550, 'itemRow · Card, fila 2'),
      b720('stepper', 860, 425, 982, 458),
      b720('before', 860, 463, 910, 478),
      ...BAR_720,
    ],
    changes: [
      'Encabezado, pestañas y alerta no se desplazan; la lista corre en el espacio restante.',
      'Con la barra fija, a 720 px de alto se ve una tarjeta a la vez.',
    ],
    questions: ['¿Barra más compacta o alerta colapsable para ganar alto?'],
  },
  {
    key: 'e',
    title: 'Modo edición a 1440 × 810',
    lead: 'Mismo estado con más espacio.',
    vp: '1440 × 810',
    route: '/preorders/[id]/products-services',
    img: FI.editR2,
    r1: FI.editR1,
    before: null,
    changedIn: 2,
    roundNote: R2_NOTE,
    diff: [{ x: 0.2, y: 0.4667, w: 0.775, h: 0.3778 }],
    elements: [
      b720('tabs', 258, 140, 1250, 180),
      b720('alert', 258, 205, 1248, 280),
      b720('search', 995, 295, 1244, 327),
      b720('row', 262, 348, 1245, 469, 'itemRow · Card, fila 1'),
      b720('row', 262, 484, 1245, 592, 'itemRow · Card, fila 2'),
      b720('stepper', 832, 404, 940, 436),
      b720('stepper', 832, 549, 940, 582),
      b720('bar', 258, 607, 1248, 672),
      b720('save', 1101, 624, 1232, 656),
    ],
    changes: ['Caben dos filas y la columna del producto respira.'],
    questions: [],
  },
  {
    key: 'f',
    title: 'Modo edición a 1024 × 720',
    lead: 'Ancho mínimo del rango objetivo.',
    vp: '1024 × 720',
    route: '/preorders/[id]/products-services',
    img: FI.editR2,
    r1: FI.editR1,
    before: null,
    changedIn: 2,
    roundNote: R2_NOTE,
    diff: [{ x: 0.2904, y: 0.5567, w: 0.6819, h: 0.2334 }],
    elements: [
      b891('tabs', 355, 190, 1228, 245),
      b891('alert', 362, 282, 1222, 415),
      b891('search', 871, 436, 1217, 480),
      b891('row', 366, 509, 1218, 703),
      b891('bar', 362, 735, 1222, 825),
      b891('save', 1018, 757, 1201, 802),
    ],
    changes: [
      'Bajo 1280 px la fila pasa a tarjeta apilada.',
      'La barra fija tapa parte de la primera tarjeta.',
    ],
    questions: ['¿Aceptable así o la tarjeta debería ser más compacta?'],
  },
  {
    key: 'g',
    title: 'Pre-orden ya cotizada (no editable)',
    lead: 'PRE-000117, con cotizaciones.',
    vp: '1280 × 720',
    route: '/preorders/[id]/products-services',
    img: FI.normal,
    before: null,
    inherited: true,
    elements: [
      b720('tabs', 290, 158, 1248, 203),
      b720('search', 960, 232, 1240, 267),
      b720('reason', 295, 292, 880, 312),
      b720('row', 295, 336, 1241, 472),
      b720('budget', 295, 505, 1040, 555),
      b720('total', 1075, 497, 1240, 575),
    ],
    changes: ['Sin botón de edición; se muestra un texto gris explicando por qué.'],
    questions: ['¿Texto suelto, alerta informativa o botón deshabilitado con tooltip?'],
  },
];

const ROUNDS_628: Round[] = [
  {
    n: 1,
    by: 'u1',
    when: 'Ayer, 2:31 p. m.',
    note: 'Primera versión: 7 pantallas capturadas por la skill.',
    verdicts: {
      a: 'approved',
      b: 'approved',
      c: 'changes_requested',
      d: 'changes_requested',
      e: 'approved',
      f: 'approved',
      g: 'approved',
    },
    submission: {
      by: 'u2',
      when: 'Ayer, 5:10 p. m.',
      result: 'changes_requested',
      approved: 5,
      changes: 2,
      body: 'Buen trabajo. Dos ajustes: la fila editada necesita más contraste y la barra pesa mucho a 720 px de alto.',
    },
  },
  {
    n: 2,
    by: 'u1',
    when: 'Hoy, 10:05 a. m.',
    note: 'Fila editada con fondo primary/5 y borde de 2 px. La barra compacta la propongo para otra tarjeta (respuesta en el comentario de «Desplazamiento»). Ronda simulada para el prototipo.',
    changed: ['c', 'd', 'e', 'f'],
  },
];

function placeholderScreens(titles: string[]): ScreenSeed[] {
  return titles.map((t, i) => ({
    key: String.fromCharCode(97 + i),
    title: t,
    lead: 'Captura no incluida en el prototipo.',
    vp: '1280 × 720',
    route: '—',
    img: null,
    before: null,
    elements: [],
    changes: [],
    questions: [],
  }));
}

const SEED_VERDICTS: Record<string, Record<string, Verdict>> = {
  'QR-0012': { a: 'approved', b: 'approved', g: 'approved' },
  'QR-0010': { a: 'changes_requested', b: 'approved', c: 'approved' },
  'QR-0009': { a: 'approved' },
  'QR-0008': { a: 'approved', b: 'approved' },
  'QR-0007': { a: 'approved' },
};

function withVerdicts(screens: ScreenSeed[], reviewId: string): Screen[] {
  const verdicts = SEED_VERDICTS[reviewId] ?? {};
  return screens.map((s) => ({ ...s, verdict: verdicts[s.key] ?? 'pending' }));
}

export const SEED_REVIEWS: Review[] = [
  {
    id: 'QR-0012',
    title: 'Edición en bloque de las cantidades aprobadas',
    context: 'Pre-orden · pestaña Productos / Servicios',
    card: 'LIDER-628',
    pr: 868,
    base: 'develop',
    head: 'feature/LIDER-628-pre-order-items-edit-develop',
    project: 'lideris',
    module: 'Compras',
    author: 'u1',
    assignees: ['u2'],
    status: 'open',
    round: 2,
    priority: 'media',
    due: { label: 'Mañana, 5:00 p. m.', tone: 'soon' },
    updated: 'Hace 2 h',
    screens: withVerdicts(SCREENS_628, 'QR-0012'),
    rounds: ROUNDS_628,
    summary: {
      steps: [
        ['Editar', 'Pulsa «Editar cantidades»; todas las filas pasan a stepper.'],
        ['Ajustar', 'Cambia las cantidades en cualquier página o búsqueda.'],
        ['Revisar', 'Cada fila cambiada muestra su valor anterior; la barra cuenta los cambios.'],
        ['Guardar', 'Un solo «Guardar cambios» envía todo junto.'],
      ].map((step) => ({ title: step[0] ?? '', body: step[1] ?? '' })),
      rules: [
        'Rango por fila: de 1 hasta la cantidad solicitada.',
        'Solo sin cotizaciones.',
        'Requiere permiso para editar pre-órdenes.',
      ],
    },
    notCaptured: [
      'Guardando: spinner en «Guardar cambios».',
      'Guardado: toast y salida del modo edición.',
      'Error: mensaje en rojo dentro de la barra.',
      'Sin permiso: no aparece el botón.',
    ],
  },
  {
    id: 'QR-0011',
    title: '2ª navegación en las páginas hijas de los módulos',
    context: 'Compras, Pagos, Proveedores, Citas y Atención',
    card: 'LIDER-631',
    pr: 870,
    base: 'develop',
    head: 'feature/LIDER-631-module-nav-child-pages',
    project: 'lideris',
    module: 'Navegación',
    author: 'u1',
    assignees: ['u3'],
    status: 'open',
    round: 1,
    priority: 'alta',
    due: { label: 'En 2 días', tone: 'ok' },
    updated: 'Hace 1 h',
    screens: withVerdicts(
      placeholderScreens([
        'Detalle de pre orden',
        'Nueva cotización',
        'Detalle de proveedor',
        'Nuevo proveedor',
        'Actualizar cita',
        'Detalle del paciente',
      ]),
      'QR-0011',
    ),
    rounds: [],
    summary: { steps: [], rules: [] },
    notCaptured: [],
  },
  {
    id: 'QR-0010',
    title: 'Alerta de documentos faltantes del proveedor',
    context: 'Proveedores · detalle',
    card: 'LIDER-629',
    pr: 859,
    base: 'develop',
    head: 'feat/LIDER-629-supplier-missing-docs-alert-develop',
    project: 'lideris',
    module: 'Proveedores',
    author: 'u5',
    assignees: ['u4'],
    status: 'changes_requested',
    round: 1,
    priority: 'media',
    due: { label: 'Esperando al autor', tone: 'muted' },
    updated: 'Ayer',
    screens: withVerdicts(
      placeholderScreens(['Alerta en el detalle', 'Alerta en el listado', 'Documento cargado']),
      'QR-0010',
    ),
    rounds: [],
    summary: { steps: [], rules: [] },
    notCaptured: [],
  },
  {
    id: 'QR-0009',
    title: 'Corrección del director en solicitudes',
    context: 'Compras · solicitudes',
    card: 'LIDER-624',
    pr: 855,
    base: 'develop',
    head: 'feat/LIDER-624-requests-director',
    project: 'lideris',
    module: 'Compras',
    author: 'u5',
    assignees: ['u3'],
    status: 'open',
    round: 2,
    priority: 'urgente',
    due: { label: 'Venció hace 1 día', tone: 'late' },
    updated: 'Hace 2 días',
    screens: withVerdicts(
      placeholderScreens(['Solicitud con corrección', 'Diálogo de corrección', 'Historial']),
      'QR-0009',
    ),
    rounds: [],
    summary: { steps: [], rules: [] },
    notCaptured: [],
  },
  {
    id: 'QR-0008',
    title: 'Filtros de autorizaciones en el rail',
    context: 'Autorizaciones · listado',
    card: 'LIDER-621',
    pr: 850,
    base: 'develop',
    head: 'feat/LIDER-621-authorizations-filters',
    project: 'lideris',
    module: 'Autorizaciones',
    author: 'u1',
    assignees: ['u4'],
    status: 'approved',
    round: 2,
    priority: 'media',
    due: { label: 'Aprobada', tone: 'muted' },
    updated: 'Hace 4 días',
    screens: withVerdicts(placeholderScreens(['Rail con filtros', 'Filtros aplicados']), 'QR-0008'),
    rounds: [],
    summary: { steps: [], rules: [] },
    notCaptured: [],
  },
  {
    id: 'QR-0007',
    title: 'Monto en el diálogo de aprobación',
    context: 'Pagos · solicitudes de pago',
    card: 'LIDER-605',
    pr: 830,
    base: 'develop',
    head: 'fix/LIDER-605-approve-dialog-amount',
    project: 'lideris',
    module: 'Pagos',
    author: 'u1',
    assignees: ['u2'],
    status: 'closed',
    round: 1,
    priority: 'baja',
    due: { label: 'PR fusionado', tone: 'muted' },
    updated: 'Hace 8 días',
    screens: withVerdicts(placeholderScreens(['Diálogo de aprobación']), 'QR-0007'),
    rounds: [],
    summary: { steps: [], rules: [] },
    notCaptured: [],
  },
];

export const SEED_COMMENTS: Comment[] = [
  {
    id: 'c1',
    review: 'QR-0012',
    screen: 'c',
    round: 1,
    author: 'u2',
    when: 'Ayer, 4:58 p. m.',
    body: 'El anillo primary/60 se pierde con brillo alto. Probemos un fondo primary/5 en la fila editada, además del borde.',
    anchor: { x: 0.52, y: 0.62 },
    el: { name: EL.row.name, file: EL.row.file, line: EL.row.line, selector: EL.row.selector },
    resolved: false,
    followUp: null,
    replies: [
      {
        author: 'u1',
        when: 'Hoy, 10:04 a. m.',
        body: 'Hecho en la ronda 2: fondo primary/5 y borde de 2 px.',
      },
    ],
  },
  {
    id: 'c2',
    review: 'QR-0012',
    screen: 'd',
    round: 1,
    author: 'u2',
    when: 'Ayer, 5:02 p. m.',
    body: 'A 720 px la barra se come mucho alto. ¿La bajamos a una sola línea con el contador a la izquierda?',
    anchor: { x: 0.6, y: 0.88 },
    el: { name: EL.bar.name, file: EL.bar.file, line: EL.bar.line, selector: EL.bar.selector },
    resolved: false,
    followUp: null,
    replies: [
      {
        author: 'u1',
        when: 'Hoy, 10:04 a. m.',
        body: 'La barra es la misma en todas las pantallas de edición; propongo hacerla en otra tarjeta para no frenar esta.',
      },
    ],
  },
  {
    id: 'c3',
    review: 'QR-0012',
    screen: 'a',
    round: 1,
    author: 'u2',
    when: 'Ayer, 4:40 p. m.',
    body: 'Botón correcto. Variante outline está bien junto al buscador.',
    anchor: null,
    el: { name: EL.edit.name, file: EL.edit.file, line: EL.edit.line, selector: EL.edit.selector },
    resolved: true,
    followUp: 'resolved',
    replies: [],
  },
];

export const SEED_ACTIVITY: ActivityEvent[] = [
  {
    who: 'u1',
    what: 'subió la ronda 2 desde la skill (4 pantallas cambiaron)',
    review: 'QR-0012',
    when: 'Hoy, 10:05 a. m.',
    icon: 'UploadCloud',
    tone: 'info',
  },
  {
    who: 'u1',
    what: 'respondió 2 comentarios de la ronda 1',
    review: 'QR-0012',
    when: 'Hoy, 10:04 a. m.',
    icon: 'MessageSquareReply',
    tone: 'muted',
  },
  {
    who: 'u2',
    what: 'envió la ronda 1: 5 aprobadas, 2 con ajuste',
    review: 'QR-0012',
    when: 'Ayer, 5:10 p. m.',
    icon: 'Send',
    tone: 'warning',
  },
  {
    who: 'u1',
    what: 'publicó la revisión (7 pantallas) desde la skill',
    review: 'QR-0011',
    when: 'Hoy, 1:10 p. m.',
    icon: 'UploadCloud',
    tone: 'info',
  },
  {
    who: 'u1',
    what: 'publicó la revisión (7 pantallas) desde la skill',
    review: 'QR-0012',
    when: 'Ayer, 2:31 p. m.',
    icon: 'UploadCloud',
    tone: 'info',
  },
  {
    who: 'u4',
    what: 'envió la revisión con 1 ajuste',
    review: 'QR-0010',
    when: 'Ayer, 4:52 p. m.',
    icon: 'Send',
    tone: 'warning',
  },
];

export const SEED_NOTIFICATIONS: Notification[] = [
  {
    text: 'Kevin Martínez subió la ronda 2 de QR-0012: 4 pantallas cambiaron',
    when: 'Hoy, 10:05 a. m.',
    unread: true,
  },
  {
    text: 'QR-0009 venció: Andrés Peña tiene la revisión asignada',
    when: 'Hace 1 día',
    unread: true,
  },
  { text: 'Sofía Vargas envió QR-0010 con 1 ajuste', when: 'Ayer', unread: false },
];
