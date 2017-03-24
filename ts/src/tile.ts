import * as Fonts from 'font';

const MARGIN = 8;

interface IPosition {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export class Tile {
  public font: Fonts.Font;
  public bgcolor: string;
  private _canvas: HTMLCanvasElement;

  constructor() {
    this._canvas = <HTMLCanvasElement> document.createElement('canvas');
    this.font = new Fonts.Font();
    this.bgcolor = '';
  }

  public get canvas() : HTMLCanvasElement {
    return this._canvas;
  }

  public drawText(text: string): void {
    const canvas = <HTMLCanvasElement> document.createElement('canvas');
    this.draw(text, canvas);
    this.copy(canvas);
  }

  private draw(text: string, canvas: HTMLCanvasElement): void {
    // resize canvas
    canvas.height = this.font.size * 2;
    let context = <CanvasRenderingContext2D> canvas.getContext('2d');
    this.setFont(context);
    canvas.width = context.measureText(text).width + MARGIN * 2;
    // clear canvas
    context = <CanvasRenderingContext2D> canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    this.setFont(context);
    // draw text
    if (this.font.fill.length > 0) {
      context.fillText(text, MARGIN, MARGIN);
    }
    if (this.font.stroke.length > 0) {
      context.strokeText(text, MARGIN, MARGIN);
    }
  }

  private setFont(context: CanvasRenderingContext2D): void {
    context.fillStyle = this.font.fill;
    context.strokeStyle = this.font.stroke;
    context.lineWidth = this.font.strokeWidth;
    context.font = this.font.toString();
    context.textBaseline = 'top';
  }

  private copy(canvas: HTMLCanvasElement): void {
    // get real size
    const pos = this.getPosition(canvas);
    // resize
    let w = pos.right - pos.left + 1;
    let h = pos.bottom - pos.top + 1;
    w = w + (w % 2);
    h = h + (h % 2);
    this._canvas.width = w;
    this._canvas.height = h;
    // copy to canvas
    const dstCtx = <CanvasRenderingContext2D> this._canvas.getContext('2d');
    if (this.bgcolor.length > 0) {
      dstCtx.fillStyle = this.bgcolor;
      dstCtx.fillRect(0, 0, w, h);
    }
    dstCtx.drawImage(canvas, pos.left, pos.top, w, h, 0, 0, w, h);
  }

  private getPosition(canvas: HTMLCanvasElement): IPosition {
    const w = canvas.width;
    const h = canvas.height;
    const context = <CanvasRenderingContext2D> canvas.getContext('2d');
    const pixels = context.getImageData(0, 0, w, h);
    const data = pixels.data;
    const pos: IPosition = { top: -1, bottom: -1, left: -1, right: -1 };
    // get top and bottom
    for (let topIdx = 0; topIdx < (data.length / 4); topIdx++) {
      const bottomIdx = (data.length / 4) - topIdx;
      if (pos.top < 0 && data[topIdx * 4 + 3] > 0) {
        pos.top = Math.floor(topIdx / w);
      }
      if (pos.bottom < 0 && data[bottomIdx * 4 + 3] > 0) {
        pos.bottom = Math.floor(bottomIdx / w);
      }
      if (pos.top >= 0 && pos.bottom >= 0) {
        break;
      }
    }
    // get left and right
    for (let leftX = 0; leftX < w; leftX++) {
      const rightX = w - leftX - 1;
      for (let leftY = 0; leftY < h; leftY++) {
        const rightY = h - leftY - 1;
        const leftIdx = leftY * w + leftX;
        const rightIdx = rightY * w + rightX;
        if (pos.left < 0 && data[leftIdx * 4 + 3] > 0) {
          pos.left = leftX;
        }
        if (pos.right < 0 && data[rightIdx * 4 + 3] > 0) {
          pos.right = rightX;
        }
        if (pos.left >= 0 && pos.right >= 0) {
          break;
        }
      }
      if (pos.left >= 0 && pos.right >= 0) {
        break;
      }
    }
    return pos;
  }
}
