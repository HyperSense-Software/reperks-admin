import { NavItem } from '@/interfaces';

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: 'dashboard',
    label: 'Dashboard',
    isActive: false,
  },
  {
    title: 'Portfolio',
    url: '#',
    icon: 'portfolio',
    label: 'Portfolio',
    isActive: false,
    items: [
      {
        title: 'Assets',
        url: '/dashboard/assets',
      },
      {
        title: 'Tenants',
        url: '/dashboard/tenants',
      },
    ],
  },
  {
    title: 'Offers',
    url: '/dashboard/offers',
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
