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
      code?: string;
      permission?: string;
    }

    interface Locals {
      user?: SessionUser;
      permissions: Set<string>;
    }
  }
}

export {};
