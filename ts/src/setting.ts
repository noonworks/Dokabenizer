import { Manager } from 'frames';
import * as Fonts from 'font';

export class Setting {
  public text: string;
  private _mgr: Manager;
  private _font: Fonts.Font;
  private _bgcolor: string;

  constructor() {
    this.text = this.readValue('in_text');
    if (this.text.length === 0) {
      this.text = 'ドカベン';
    }
    const fps = this.readInt('in_fps', 1, 8);
    const msec = this.readInt('in_time', 1, 1500);
    const before = this.readInt('in_before', 0, 800);
    const after = this.readInt('in_after', 0, 1700);
    this._mgr = new Manager(fps, msec, before, after);
    this.apply();
    // font color
    this._font = new Fonts.Font();
    const fill = this.getColor('in_fillcolor');
    const stroke = this.getColor('in_strokecolor');
    if (fill.length > 0) {
      this._font.fill = fill;
    }
    if (stroke.length > 0) {
      this._font.stroke = stroke;
    }
    // background color
    this._bgcolor = '';
    const bgBg = this.checked('in_bg');
    if (bgBg) {
      this._bgcolor = this.getColor('in_bgcolor');
    }
  }

  public set fps(v: number) {
    this._mgr.fps = v;
  }
  public get fps(): number {
    return this._mgr.fps;
  }
  public set time(v: number) {
    this._mgr.time = v;
  }
  public get time(): number {
    return this._mgr.time;
  }
  public set before(v: number) {
    this._mgr.before = v;
  }
  public get before(): number {
    return this._mgr.before;
  }
  public set after(v: number) {
    this._mgr.after = v;
  }
  public get after(): number {
    return this._mgr.after;
  }

  public get manager(): Manager {
    return this._mgr;
  }

  public get font(): Fonts.Font {
    return this._font;
  }

  public get bgcolor(): string {
    return this._bgcolor;
  }

  public apply(): void {
    (<HTMLInputElement> document.getElementById('in_text')).value = this.text;
    (<HTMLInputElement> document.getElementById('in_fps')).value = '' + this._mgr.fps;
    (<HTMLInputElement> document.getElementById('in_time')).value = '' + this._mgr.time;
    (<HTMLInputElement> document.getElementById('in_before')).value = '' + this._mgr.before;
    (<HTMLInputElement> document.getElementById('in_after')).value = '' + this._mgr.after;
  }

  private getColor(id: string): string {
    const v = this.readValue(id);
    if (v.length !== 7) {
      return '';
    }
    const ret = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(v);
    if (ret === null || ret.length <= 3) {
      return '';
    }
    const arr: string[] = [];
    for (let i = 1; i <= 3; i++) {
      const c = parseInt(ret[i], 16);
      if (isNaN(c)) {
        return '';
      }
      arr.push('' + c);
    }
    return 'rgb(' + arr.join(',') + ')';
  }

  private checked(id: string): boolean {
    const e = <HTMLInputElement> document.getElementById(id);
    return (e !== null && e.checked);
  }

  private readValue(id: string): string {
    const e = <HTMLInputElement> document.getElementById(id);
    if (e === null) {
      return '';
    }
    return e.value;
  }

  private readInt(id: string, min: number, defaultValue: number): number {
    const str = this.readValue(id);
    if (str.length === 0) {
      return defaultValue;
    }
    const i = parseInt(str, 10);
    if (isNaN(i) || (i < min)) {
      return defaultValue;
    }
    return i;
  }
}
