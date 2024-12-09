import { NotificationType } from '../enums/notification-type.enum';

export interface NotificationResponse {
  id: string;
  title: string;
  type: NotificationType;
  metadata: never;
  createdAt: Date;
  isRead: boolean;
}
