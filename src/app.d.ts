import type { SessionUser } from '$lib/api/types';

interface PageMeta {
  title: string;
  crumbs?: Array<{ label: string; href?: string }>;
  tab?: string;
}

declare global {
  namespace App {
    interface PageData {
      meta?: PageMeta;
    }

    interface Locals {
      user?: SessionUser;
      permissions: Set<string>;
    }
  }
}

export {};
