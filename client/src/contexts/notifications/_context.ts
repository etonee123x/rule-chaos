import { createContext } from 'react';

export enum NotificationType {
  Success = 'Success',
  Error = 'Error',
  Info = 'Info',
}

export interface Notification {
  id: number;
  title: string;
  description?: string;
  type: NotificationType;
}

export type Notify = (parameter: Pick<Notification, 'title' | 'description' | 'type'>) => void;

export type NotifyWithKnownType = (parameter: Omit<Parameters<Notify>[0], 'type'>) => void;

export interface NotificationsContext {
  notifications: Array<Notification>;
  notify: {
    success: NotifyWithKnownType;
    error: NotifyWithKnownType;
    info: NotifyWithKnownType;
  } & Notify;
}

export const NotificationsContext = createContext<NotificationsContext | null>(null);
