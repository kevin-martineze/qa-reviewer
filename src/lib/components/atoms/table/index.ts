/**
 * table atom — re-export de shadcn con un override: `Table` trae el
 * contenedor con `scroll-x-hint`. NO importar desde `$lib/components/ui/table` directo.
 */
import Table from './Table.svelte';

export {
  Body,
  Caption,
  Cell,
  Footer,
  Head,
  Header,
  Row,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '$lib/components/ui/table';
export { Table, Table as Root };
