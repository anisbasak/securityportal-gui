import { LayoutItem } from './layout-item.model';

/** Descriptor for Resource Detail */
interface Detail {
  summary: any;
  location?: LayoutItem;
  data?: LayoutItem[];
}

/** Descriptor for Resource List Item */
interface ListItem {
  title: LayoutItem;
  image?: LayoutItem;
  subtitles?: LayoutItem[];
}

/** Descriptor for Resource Block Item */
interface Block {
  data: LayoutItem[];
  link?: LayoutItem;
}

/** Organized grouping of LayoutItems for a blueprint */
export interface LayoutDescriptor {
  blueprint: string;
  detail: Detail;
  listItem: ListItem;
  block: Block;
}
