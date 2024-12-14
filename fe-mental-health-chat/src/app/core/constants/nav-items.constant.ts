import { NavItem } from '../models/common/nav-item.model';

export const baseNavItems: NavItem[] = [
  {
    displayName: 'AI chatbot',
    iconName: 'smart_toy',
    route: 'ai-chats',
  },
  {
    displayName: 'Therapist chats',
    iconName: 'chat',
    route: 'therapist-chats',
  },
  {
    displayName: 'Posts',
    iconName: 'dynamic_feed',
    route: 'posts',
  },
  {
    displayName: 'Therapists',
    iconName: 'diversity_3',
    route: 'therapists',
  },
  {
    displayName: 'Profile',
    iconName: 'account_circle',
    route: 'profile',
  },
  {
    displayName: 'Public sessions',
    iconName: 'public',
    route: 'public-sessions',
  },
  {
    displayName: 'My sessions',
    iconName: 'event_note',
    route: 'my-schedules',
  },
];

export const therapistNavItems: NavItem[] = [
  {
    displayName: 'Client chats',
    iconName: 'supervisor_account',
    route: 'client-chats',
  },
  {
    displayName: 'My public sessions',
    iconName: 'campaign',
    route: 'my-public-sessions',
  },
  {
    displayName: 'Manage registrations',
    iconName: 'app_registration',
    route: 'manage-registrations',
  },
  {
    displayName: 'Manage schedules',
    iconName: 'edit_calendar',
    route: 'manage-schedules',
  },
  {
    displayName: 'Manage working time',
    iconName: 'work_history',
    route: 'manage-working-time',
  }
];
