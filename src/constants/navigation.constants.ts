import { NavItem } from '@/interfaces';

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: 'dashboard',
    label: 'Dashboard',
    isActive: false,
    items: [
      {
        title: 'History',
        url: '#',
      },
      {
        title: 'Starred',
        url: '#',
      },
      {
        title: 'Settings',
        url: '#',
      },
    ],
  },
  {
    title: 'Portfolio',
    url: '/portfolio',
    icon: 'portfolio',
    label: 'Portfolio',
    isActive: false,
    items: [
      {
        title: 'Assets',
        url: '#',
      },
      {
        title: 'Tenants',
        url: '#',
      },
    ],
  },
  {
    title: 'Offers',
    url: '/offers',
    icon: 'offers',
    label: 'Offers',
  },
  {
    title: 'Notifications',
    url: '/notifications',
    icon: 'notifications',
    label: 'Notifications',
  },
];
