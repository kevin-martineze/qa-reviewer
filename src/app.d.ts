import type { SessionUser } from '$lib/api/types';

interface PageMeta {
  title: string;
  description?: string;
  crumbs?: Array<{ label: string; href?: string }>;
  tab?: string;
}

declare global {
  namespace App {
    interface PageData {
      meta?: PageMeta;
    }

    interface Error {
      message: string;
      errorId?: string;
      code?: 'forbidden' | 'not_found' | 'gone' | 'unavailable' | 'error';
      permission?: string;
    }

    interface Locals {
      /** Token del API guardado en la cookie httpOnly. Solo lo usa el server. */
      sessionToken?: string;
      user?: SessionUser;
      /** Proyecto activo (cookie `qa_project`); define `permissions`. */
      projectId: string | null;
      permissions: Set<string>;
    }
  }
}

export {};
