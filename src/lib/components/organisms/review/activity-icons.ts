import {
  CircleCheck,
  GitMerge,
  MessageSquare,
  MessageSquareReply,
  Rocket,
  RotateCcw,
  Send,
  Stamp,
  Upload,
  UserPlus,
} from '@lucide/svelte';
import type { Component } from 'svelte';

import type { ActivityType } from '$lib/api/types';

export const ACTIVITY_ICON: Record<ActivityType, Component<{ class?: string }>> = {
  review_published: Rocket,
  round_uploaded: Upload,
  review_assigned: UserPlus,
  verdict_set: Stamp,
  comment_created: MessageSquare,
  comment_replied: MessageSquareReply,
  comment_resolved: CircleCheck,
  review_submitted: Send,
  review_reopened: RotateCcw,
  review_closed: GitMerge,
};
