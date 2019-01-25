export function getImageSrc(md5: string): string {
  return `/api/file/${md5}`;
}
