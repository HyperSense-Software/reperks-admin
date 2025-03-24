import { Icons } from '@/components/icons';
import { useTranslations } from 'next-intl';

export function useNavigationTranslation(
  items: {
    title: string;
    label: string;
    url?: string;
    icon?: keyof typeof Icons | string;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[],
) {
  const t = useTranslations('nav-items');
  return items.map((item) => {
    const mainKey = item.label.toLocaleLowerCase() + '.title';
    return {
      ...item,
      title: t.has(mainKey) ? t(mainKey) : item.title,
      items: item.items?.map((subItem) => {
        const subKey =
          item.label.toLocaleLowerCase() +
          '.items.' +
          subItem.title.toLocaleLowerCase();
        return {
          ...subItem,
          title: t.has(subKey) ? t(subKey) : subItem.title,
        };
      }),
    };
  });
}
