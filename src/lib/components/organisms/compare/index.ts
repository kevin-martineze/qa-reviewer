// Strategy: cada modo de comparación es un componente con las mismas props.
// Agregar un modo (p. ej. «diferencia») = un archivo nuevo y una línea aquí.
import SideBySide from './SideBySide.svelte';
import Slider from './Slider.svelte';
import Toggle from './Toggle.svelte';
import type { CompareRegistry } from './types';

export const COMPARE_MODES: CompareRegistry = {
  side: SideBySide,
  slider: Slider,
  toggle: Toggle,
};

export type { CompareProps } from './types';
