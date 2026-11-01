import type {
  ActivityEvent,
  AuditEvent,
  Comment,
  NotificationPrefs,
  Project,
  ProjectMember,
  Review,
  User,
} from '$lib/api/types';
import {
  DEFAULT_PREFS,
  MEMBERSHIPS,
  PROJECTS,
  SEED_ACTIVITY,
  SEED_AUDIT,
  SEED_COMMENTS,
  SEED_DEVICES,
  SEED_INVITES,
  SEED_NOTIFICATIONS,
  SEED_RECOVERIES,
  SEED_REVIEWS,
  SEED_TOKENS,
  USERS,
  type DeviceSeed,
  type InviteSeed,
  type NotificationSeed,
  type RecoverySeed,
  type TokenSeed,
} from './seeds';

// Store en memoria: se reinicia al reiniciar el server. Un solo proceso, sin concurrencia real.
class MockStore {
  reviews: Review[] = [];
  comments: Comment[] = [];
  notifications: NotificationSeed[] = [];
  prefs = new Map<string, NotificationPrefs>();
  activity: ActivityEvent[] = [];
  audit: AuditEvent[] = [];
  users: User[] = [];
  projects: Project[] = [];
  memberships: ProjectMember[] = [];
  invites: InviteSeed[] = [];
  recoveries: RecoverySeed[] = [];
  tokens: TokenSeed[] = [];
  devices: DeviceSeed[] = [];
  /** Códigos inexistentes probados por persona, para el 429 de `GET /device/:userCode`. */
  deviceMisses = new Map<string, number[]>();
  private seq = 100;

  constructor() {
    this.reset();
  }

  reset(): void {
    this.reviews = structuredClone(SEED_REVIEWS);
    this.comments = structuredClone(SEED_COMMENTS);
    this.notifications = structuredClone(SEED_NOTIFICATIONS);
    this.prefs = new Map();
    this.activity = structuredClone(SEED_ACTIVITY);
    this.audit = structuredClone(SEED_AUDIT);
    this.users = structuredClone(USERS);
    this.projects = structuredClone(PROJECTS);
    this.memberships = structuredClone(MEMBERSHIPS);
    this.invites = structuredClone(SEED_INVITES);
    this.recoveries = structuredClone(SEED_RECOVERIES);
    this.tokens = structuredClone(SEED_TOKENS);
    this.devices = structuredClone(SEED_DEVICES);
    this.deviceMisses = new Map();
  }

  nextId(prefix: string): string {
    this.seq += 1;
    return `${prefix}${this.seq}`;
  }

  prefsOf(userId: string): NotificationPrefs {
    return this.prefs.get(userId) ?? { ...DEFAULT_PREFS };
  }
}

export const store = new MockStore();
