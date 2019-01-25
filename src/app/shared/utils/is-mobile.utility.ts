export function isMobile() {
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|windows phone/;
  return mobileRegex.test(navigator.userAgent.toLowerCase());
}
