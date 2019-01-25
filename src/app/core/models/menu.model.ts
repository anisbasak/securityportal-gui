interface MenuData {
  title: string;
  path: string;
  icon: string;
}

interface MenuItem {
  type: 'item';
  data: MenuData;
}

interface MenuHeader {
  type: 'header';
  data: {
    title: string;
    children: MenuData[];
  };
}

export type MenuObject = MenuHeader | MenuItem;
