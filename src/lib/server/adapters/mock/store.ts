import type {
  ActivityEvent,
  Comment,
  Notification,
  ProjectMember,
  Review,
  User,
} from '$lib/api/types';
import {
  MEMBERSHIPS,
  SEED_ACTIVITY,
  SEED_COMMENTS,
  SEED_INVITES,
  SEED_NOTIFICATIONS,
  SEED_RECOVERIES,
  SEED_REVIEWS,
  USERS,
} from './seeds';
import type { InviteSeed, RecoverySeed } from './seeds';

// Store en memoria: se reinicia al reiniciar el servidor (módulo re-evaluado).
class MockStore {
  reviews: Review[] = [];
  comments: Comment[] = [];
  notifications: Notification[] = [];
  activity: ActivityEvent[] = [];
  users: Record<string, User> = {};
  memberships: ProjectMember[] = [];
  invites: InviteSeed[] = [];
  recoveries: RecoverySeed[] = [];

  constructor() {
    this.reset();
  }

  reset(): void {
    this.reviews = structuredClone(SEED_REVIEWS);
    this.comments = structuredClone(SEED_COMMENTS);
    this.notifications = structuredClone(SEED_NOTIFICATIONS);
    this.activity = structuredClone(SEED_ACTIVITY);
    this.users = structuredClone(USERS);
    this.memberships = structuredClone(MEMBERSHIPS);
    this.invites = structuredClone(SEED_INVITES);
    this.recoveries = structuredClone(SEED_RECOVERIES);
  }
}

export const store = new MockStore();
