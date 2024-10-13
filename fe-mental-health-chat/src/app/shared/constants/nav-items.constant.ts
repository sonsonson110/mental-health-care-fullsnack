import { NavItem } from '../../core/models/nav-item.model';

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
    iconName: 'article',
    route: 'posts',
  },
  {
    displayName: 'Therapists',
    iconName: 'diversity_3',
    route: 'therapists-discovery',
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
    route: 'private-sessions',
  },
];

export const therapistNavItems: NavItem[] = [
  {
    displayName: 'Client chats',
    iconName: 'supervisor_account',
    route: 'client-chats',
  },
  {
    displayName: 'Manage registrations',
    iconName: 'app_registration',
    route: 'manage-registrations',
  },
  {
    displayName: 'Manage sessions',
    iconName: 'edit_calendar',
    route: 'manage-sessions',
  },
];
