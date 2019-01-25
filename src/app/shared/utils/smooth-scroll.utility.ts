// Utility function adapted from Pawel Grzybek
// https://pawelgrzybek.com/page-scroll-in-vanilla-javascript/
// Custom additions are promisification and typings

function smoothScroll (element: HTMLElement, container: HTMLElement, duration: number = 200, easing: string = 'linear'): Promise<null> {

  // define timing functions
  const easings: any = {
    linear(t) {
      return t;
    },
    easeInQuad(t) {
      return t * t;
    },
    easeOutQuad(t) {
      return t * (2 - t);
    },
    easeInOutQuad(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    easeInCubic(t) {
      return t * t * t;
    },
    easeOutCubic(t) {
      return (--t) * t * t + 1;
    },
    easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },
    easeInQuart(t) {
      return t * t * t * t;
    },
    easeOutQuart(t) {
      return 1 - (--t) * t * t * t;
    },
    easeInOutQuart(t) {
      return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
    },
    easeInQuint(t) {
      return t * t * t * t * t;
    },
    easeOutQuint(t) {
      return 1 + (--t) * t * t * t * t;
    },
    easeInOutQuint(t) {
      return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
    }
  };

  // Returns document.documentElement for Chrome and Safari
  // document.body for rest of the world
  function checkBody(): HTMLElement {
    document.documentElement.scrollTop += 1;
    const bodyEl = (document.documentElement.scrollTop !== 0) ? document.documentElement : document.body;
    document.documentElement.scrollTop -= 1;
    return bodyEl;
  }

  const body: HTMLElement = container || checkBody();
  const start: number = body.scrollTop;
  const startTime: number = Date.now();

  // Height checks to prevent requestAnimationFrame from infinitely looping
  // If the function tries to scroll below the visible document area
  // it should only scroll to the bottom of the document
  const documentHeight = Math.max(document.body.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.clientHeight,
    document.documentElement.scrollHeight,
    document.documentElement.offsetHeight
  );
  const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
  const destination = documentHeight - element.offsetTop < windowHeight ? documentHeight - windowHeight : element.offsetTop;

  return new Promise((resolve, reject) => {
    function scroll() {
      const now = Date.now();
      const time = Math.min(1, ((now - startTime) / duration));
      const timeFunction: number = easings[easing](time);
      body.scrollTop = (timeFunction * (destination - start)) + start;

      if (body.scrollTop === destination) {
        resolve();
        return;
      }
      requestAnimationFrame(scroll);
    }

    scroll();
  });
}

export { smoothScroll };
