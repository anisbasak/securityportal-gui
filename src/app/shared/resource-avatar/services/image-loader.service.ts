import { Injectable } from '@angular/core';

@Injectable()
export class ImageLoaderService {
  load(src): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onerror = () => reject('Unable to load image');
      img.onload = () => resolve('Image ' + src + ' loaded successfully.');
    });
  }
}
