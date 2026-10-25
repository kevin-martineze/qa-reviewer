import {
  AtSign,
  Bell,
  Clock,
  MessageSquareReply,
  Send,
  TriangleAlert,
  UploadCloud,
  UserPlus,
} from '@lucide/svelte';
import type { Component } from 'svelte';

import type { NotificationType } from '$lib/api/types';

export const NOTIFICATION_ICON: Record<NotificationType, Component<{ class?: string }>> = {
  review_assigned: UserPlus,
  round_uploaded: UploadCloud,
  review_submitted: Send,
  mention: AtSign,
  reply: MessageSquareReply,
  due_soon: Clock,
  overdue: TriangleAlert,
};

export const FALLBACK_ICON = Bell;
