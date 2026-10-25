import type { ActivityEvent, Comment, Notification, Review } from '$lib/api/types';
import { SEED_ACTIVITY, SEED_COMMENTS, SEED_NOTIFICATIONS, SEED_REVIEWS } from './seeds';

// Store en memoria: se reinicia al reiniciar el servidor (módulo re-evaluado).
class MockStore {
  reviews: Review[] = [];
  comments: Comment[] = [];
  notifications: Notification[] = [];
  activity: ActivityEvent[] = [];

  constructor() {
    this.reset();
  }

  reset(): void {
    this.reviews = structuredClone(SEED_REVIEWS);
    this.comments = structuredClone(SEED_COMMENTS);
    this.notifications = structuredClone(SEED_NOTIFICATIONS);
    this.activity = structuredClone(SEED_ACTIVITY);
  }
}

export const store = new MockStore();
