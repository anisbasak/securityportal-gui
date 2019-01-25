// Utility function adapted from David Merfield release under CC0 license
// https://github.com/davidmerfield/randomColor
import { Injectable } from '@angular/core';

/** Color configuration. */
export interface Color {
  hueRange: number[];
  lowerBounds: number[][];
  saturationRange: number[];
  brightnessRange: number[];
}

/** Mapping of color names to colors. */
interface ColorDictionary {
  [keys: string]: Color;
}

export type ColorLuminosityOption = 'bright' | 'dark' | 'light' | 'random';
export type ColorFormatOption = 'hsvArray' | 'rgb' | 'rgba' | 'rgbArray' | 'hsl' | 'hsla' | 'hslArray' | 'hex';

/** Options for the generator. */
export interface GeneratorOptions {
  /**
   * Controls the hue of the generated color. You can pass a string representing a color
   * name: red, orange, yellow, green, blue, purple, pink and monochrome are currently
   * supported. If you pass a hexidecimal color string such as #00FFFF, it will extract
   * its hue value and use that to generate colors.
   */
  hue?: string;
  /** Controls the luminosity of the generated color. */
  luminosity?: ColorLuminosityOption;
  /**
   * An integer or string which when passed will cause randomColor to return the
   * same color each time.
   */
  seed?: any;
  /** A string which specifies the format of the generated color. Defaults to `hex`. */
  format?: ColorFormatOption;
  /**
   * A decimal between 0 and 1. Only relevant when using a format with an alpha
   * channel (rgba and hsla). Defaults to a random value.
   */
  alpha?: number;
}

@Injectable()
export class RandomColorGenerator {

  private seed;
  private colorDictionary: ColorDictionary = {};

  constructor() {
    this.loadColorBounds();
  }

  /** Retrieve a bright color based on a string seed. */
  hashedColor(val: string): string {
    return this.getRandomColor({seed: val, luminosity: 'bright'}) as string;
  }

  getRandomColors(options: GeneratorOptions, count: number): (string | number[])[] {
    const colors = [];

    while (count > colors.length) {
      // Since we're generating multiple colors, incremement the seed. Otherwise we'd just
      // generate the same color each time...
      if (this.seed && options.seed) {
        options.seed += 1;
      }

      colors.push(this.getRandomColor(options));
    }

    return colors;
  }

  getRandomColor(options: GeneratorOptions): string | number[] {
    options = options || {};

    if (options.seed != null && options.seed === parseInt(options.seed, 10)) {
      // An integer was passed as a seed
      this.seed = options.seed;
    } else if (typeof options.seed === 'string') {
      // A string was passed as a seed
      this.seed = stringToInteger(options.seed);
    } else if (options.seed != null) {
      // Something was passed as a seed but it wasn't an integer or string
      throw new TypeError('The seed value must be an integer or string');
    } else {
      // No seed, reset the value outside.
      this.seed = null;
    }

    const H = this.pickHue(options.hue);
    const S = this.pickSaturation(H, options.hue, options.luminosity);
    const B = this.pickBrightness(H, S, options.luminosity);

    // Return the HSB color in the desired format
    return this.setFormat([H, S, B], options.format, options.alpha);
  }


  /** Add a color to the color dictionary. */
  defineColor(name: string, hueRange: number[], lowerBounds: number[][]): void {
    const sMin = lowerBounds[0][0];
    const sMax = lowerBounds[lowerBounds.length - 1][0];
    const bMin = lowerBounds[lowerBounds.length - 1][1];
    const bMax = lowerBounds[0][1];

    this.colorDictionary[name] = {
      hueRange: hueRange,
      lowerBounds: lowerBounds,
      saturationRange: [sMin, sMax],
      brightnessRange: [bMin, bMax]
    };

  }

  /** Select a random hue within a range. */
  private pickHue(hue: string): number {
    const hueRange = this.getHueRange(hue);
    const randomHue = this.randomWithin(hueRange);

    // Instead of storing red as two seperate ranges,
    // we group them, using negative numbers
    return randomHue < 0 ? 360 + randomHue : randomHue;
  }

  /** Select a random saturation based on the hue and options. */
  private pickSaturation(hue: number, hueOption: string, luminosity: ColorLuminosityOption): number {
    if (hueOption === 'monochrome') {
      return 0;
    }

    if (luminosity === 'random') {
      return this.randomWithin([0, 100]);
    }

    const saturationRange = this.getSaturationRange(hue);

    let sMin = saturationRange[0];
    let sMax = saturationRange[1];

    switch (luminosity) {
      case 'bright': sMin = 55;        break;
      case 'dark':   sMin = sMax - 10; break;
      case 'light':  sMax = 55;        break;
    }

    return this.randomWithin([sMin, sMax]);
  }

  /** Select a random brightness based on hue, saturation, and options. */
  private pickBrightness(H: number, S: number, luminosity: ColorLuminosityOption): number {
    let bMin = this.getMinimumBrightness(H, S);
    let bMax = 100;

    switch (luminosity) {
      case 'dark':   bMax = bMin + 20;         break;
      case 'light':  bMin = (bMax + bMin) / 2; break;
      case 'random': bMin = 0; bMax = 100;     break;
    }

    return this.randomWithin([bMin, bMax]);
  }

  private randomWithin(range: number[]): number {
    if (this.seed === null) {
      return Math.floor(range[0] + Math.random() * (range[1] + 1 - range[0]));
    } else {
      // Seeded random algorithm from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
      const max = range[1] || 1;
      const min = range[0] || 0;
      this.seed = (this.seed * 9301 + 49297) % 233280;
      const rnd = this.seed / 233280.0;
      return Math.floor(min + rnd * (max - min));
    }
  }

  /** Return a color in HSV in the specified format. */
  private setFormat(hsv: number[], format: ColorFormatOption, alpha?: number) {
    switch (format) {

      case 'hsvArray':
        return hsv;

      case 'hslArray':
        return HSVtoHSL(hsv);

      case 'hsl':
        const hsl = HSVtoHSL(hsv);
        return 'hsl(' + hsl[0] + ', ' + hsl[1] + '%, ' + hsl[2] + '%)';

      case 'hsla':
        const hslColor = HSVtoHSL(hsv);
        const hslAlpha = alpha || Math.random();
        return 'hsla(' + hslColor[0] + ', ' + hslColor[1] + '%, ' + hslColor[2] + '%, ' + hslAlpha + ')';

      case 'rgbArray':
        return HSVtoRGB(hsv);

      case 'rgb':
        const rgb = HSVtoRGB(hsv);
        return 'rgb(' + rgb.join(', ') + ')';

      case 'rgba':
        const rgbColor = HSVtoRGB(hsv);
        const rgbAlpha = alpha || Math.random();
        return 'rgba(' + rgbColor.join(', ') + ', ' + rgbAlpha + ')';

      default:
        return HSVtoHex(hsv);
    }

  }

  private getMinimumBrightness(H: number, S: number): number {
    const lowerBounds = this.getColorInfo(H).lowerBounds;

    for (let i = 0; i < lowerBounds.length - 1; i++) {
      const s1 = lowerBounds[i][0];
      const v1 = lowerBounds[i][1];

      const s2 = lowerBounds[i + 1][0];
      const v2 = lowerBounds[i + 1][1];

      if (S >= s1 && S <= s2) {
        const m = (v2 - v1) / (s2 - s1);
        const b = v1 - m * s1;

        return m * S + b;
      }
    }

    return 0;
  }

  private getHueRange(colorInput: string): number[] {
    if (typeof parseInt(colorInput, 10) === 'number') {
      const number = parseInt(colorInput, 10);
      if (number < 360 && number > 0) {
        return [number, number];
      }
    }

    if (typeof colorInput === 'string') {
      if (this.colorDictionary[colorInput]) {
        const color = this.colorDictionary[colorInput];
        if (color.hueRange) {
          return color.hueRange;
        }
      } else if (colorInput.match(/^#?([0-9A-F]{3}|[0-9A-F]{6})$/i)) {
        const hue = HexToHSB(colorInput)[0];
        return [hue, hue];
      }
    }

    return [0, 360];
  }

  /** Get a saturation range by hue. */
  private getSaturationRange(hue: number): number[] {
    return this.getColorInfo(hue).saturationRange;
  }

  /** Get a color from the dictionary by hue. */
  private getColorInfo(hue: number): Color {
    // Maps red colors to make picking hue easier
    if (hue >= 334 && hue <= 360) {
      hue -= 360;
    }

    for (const colorName in this.colorDictionary) {
      if (this.colorDictionary.hasOwnProperty(colorName)) {
        const color = this.colorDictionary[colorName];
        if (color.hueRange && hue >= color.hueRange[0] && hue <= color.hueRange[1]) {
          return this.colorDictionary[colorName];
        }
      }
    }

    throw Error('Color not found');
  }

  /** Add predefined colors to the color dictionary. */
  private loadColorBounds(): void {

    this.defineColor(
      'monochrome',
      null,
      [[0, 0], [100, 0]]
    );

    this.defineColor(
      'red',
      [-26, 18],
      [[20, 100], [30, 92], [40, 89], [50, 85], [60, 78], [70, 70], [80, 60], [90, 55], [100, 50]]
    );

    this.defineColor(
      'orange',
      [19, 46],
      [[20, 100], [30, 93], [40, 88], [50, 86], [60, 85], [70, 70], [100, 70]]
    );

    this.defineColor(
      'yellow',
      [47, 62],
      [[25, 100], [40, 94], [50, 89], [60, 86], [70, 84], [80, 82], [90, 80], [100, 75]]
    );

    this.defineColor(
      'green',
      [63, 178],
      [[30, 100], [40, 90], [50, 85], [60, 81], [70, 74], [80, 64], [90, 50], [100, 40]]
    );

    this.defineColor(
      'blue',
      [179,  257],
      [[20, 100], [30, 86], [40, 80], [50, 74], [60, 60], [70, 52], [80, 44], [90, 39], [100, 35]]
    );

    this.defineColor(
      'purple',
      [258,  282],
      [[20, 100], [30, 87], [40, 79], [50, 70], [60, 65], [70, 59], [80, 52], [90, 45], [100, 42]]
    );

    this.defineColor(
      'pink',
      [283,  334],
      [[20, 100], [30, 90], [40, 86], [60, 84], [80, 80], [90, 75], [100, 73]]
    );
  }

}

/** Convert an HSV representation to hex. */
function HSVtoHex(hsv: number[]): string {
  const rgb = HSVtoRGB(hsv);

  const componentToHex = (c: number): string => {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return '#' + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);
}

/** Convert an HSV representation to RGB. */
function HSVtoRGB(hsv: number[]): number[] {
  // this doesn't work for the values of 0 and 360
  // here's the hacky fix
  let h = hsv[0];
  if (h === 0) {
    h = 1;
  }
  if (h === 360) {
    h = 359;
  }

  // Rebase the h,s,v values
  h = h / 360;
  const s = hsv[1] / 100;
  const v = hsv[2] / 100;

  const h_i = Math.floor(h * 6);
  const f = h * 6 - h_i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  let r = 256;
  let g = 256;
  let b = 256;

  switch (h_i) {
    case 0: r = v; g = t; b = p;  break;
    case 1: r = q; g = v; b = p;  break;
    case 2: r = p; g = v; b = t;  break;
    case 3: r = p; g = q; b = v;  break;
    case 4: r = t; g = p; b = v;  break;
    case 5: r = v; g = p; b = q;  break;
  }

  return [Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255)];
}

/** Convert a hex representation to HSB. */
function HexToHSB(hex: string): number[] {
  hex = hex.replace(/^#/, '');
  hex = hex.length === 3 ? hex.replace(/(.)/g, '$1$1') : hex;

  const red = parseInt(hex.substr(0, 2), 16) / 255;
  const green = parseInt(hex.substr(2, 2), 16) / 255;
  const blue = parseInt(hex.substr(4, 2), 16) / 255;

  const cMax = Math.max(red, green, blue);
  const delta = cMax - Math.min(red, green, blue);
  const saturation = cMax ? (delta / cMax) : 0;

  switch (cMax) {
    case red: return [ 60 * (((green - blue) / delta) % 6) || 0, saturation, cMax ];
    case green: return [ 60 * (((blue - red) / delta) + 2) || 0, saturation, cMax ];
    case blue: return [ 60 * (((red - green) / delta) + 4) || 0, saturation, cMax ];
  }
}

/** Convert an HSV representation to HSL. */
function HSVtoHSL(hsv: number[]): number[] {
  const h = hsv[0];
  const s = hsv[1] / 100;
  const v = hsv[2] / 100;
  const k = (2 - s) * v;

  return [
    h,
    Math.round(s * v / (k < 1 ? k : 2 - k) * 10000) / 100,
    k / 2 * 100
  ];
}

/** Hash a string to an integer value. */
function stringToInteger(string: string): number {
  let total = 0;
  for (let i = 0; i !== string.length; i++) {
    if (total >= Number.MAX_SAFE_INTEGER) {
      break;
    }
    total += string.charCodeAt(i);
  }
  return total;
}
