// Type definitions for gif.js
declare module gif {
  export interface IGIFOptions {
    transparent: number | null;
    quality: number;
    workerScript: string;
    workers: number;
  }

  export class GIF {
    constructor(option: IGIFOptions);
    addFrame(canvas: HTMLCanvasElement, option?: {}): void;
    on(name: string, func: {}): void;
    render(): void;
  }
}
import GIF = gif.GIF;
