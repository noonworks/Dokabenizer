export const DEFAULT_SIZE: number = 120;
export const DEFAULT_FILL: string = 'rgb(200,40,40)';
export const DEFAULT_STROKE: string = 'rgb(100,10,30)';
export const DEFAULT_STROKE_WIDTH: number = 4;
export const DEFAULT_FONTS: string[] = ['NewDokabenFont'];

export class Font {
  constructor(public size: number = DEFAULT_SIZE,
              public fill: string = DEFAULT_FILL,
              public stroke: string = DEFAULT_STROKE,
              public strokeWidth: number = DEFAULT_STROKE_WIDTH,
              public fonts: string[] = DEFAULT_FONTS) {
  }

  public toString(): string {
    if (this.fonts.length > 0) {
      return '' + this.size + "px '" + this.fonts.join("','") + "'";
    }
    return '' + this.size + 'px';
  }
}
