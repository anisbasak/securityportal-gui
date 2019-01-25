import { GalleryImage } from './gallery-image.model';

export interface GalleryLightboxData {
  images: GalleryImage[];
  index?: number;
}
