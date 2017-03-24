export const MAX_ROTATE: number = 0;
export const MIN_ROTATE: number = -0.5;
export const ROTATE_RANGE: number = Math.abs(MAX_ROTATE - MIN_ROTATE);

export class Manager {
  private _fps: number;
  private _time: number;
  private _before: number;
  private _after: number;
  private _delayPerFrame: number;
  private _maxFrame: number;

  constructor(fps: number, time: number, before: number, after: number) {
    this.fps = fps;
    this.time = time;
    this.before = before;
    this.after = after;
  }

  private setMaxFrame(): void {
    this._maxFrame =  Math.ceil(this._time / this._delayPerFrame) + 1;
  }

  public set fps(v: number) {
    if (v <= 0) {
      v = 1;
    }
    if (v > 1000) {
      v = 1000;
    }
    this._fps = v;
    this._delayPerFrame = Math.floor(1000 / this._fps);
    this.setMaxFrame();
  }

  public get fps(): number {
    return this._fps;
  }

  public set time(v: number) {
    if (v < 1) {
      v = 1;
    }
    this._time = Math.floor(v);
    this.setMaxFrame();
  }

  public get time(): number {
    return this._time;
  }

  public set before(v: number) {
    if (v < 0) {
      v = 0;
    }
    this._before = Math.floor(v);
  }

  public get before(): number {
    return this._before;
  }

  public set after(v: number) {
    if (v < 0) {
      v = 0;
    }
    this._after = Math.floor(v);
  }

  public get after(): number {
    return this._after;
  }

  public get delayPerFrame(): number {
    return this._delayPerFrame;
  }

  public get maxFrame(): number {
    return this._maxFrame;
  }

  public getFrameIndex(msec: number): number {
    msec = msec % (this._time + this._before + this._after);
    if (msec < this._before) {
      return 0;
    }
    if (msec >= this._before + this._time) {
      return this._maxFrame;
    }
    return Math.floor((msec - this._before) * this._fps / 1000) + 1;
  }

  public getNowAngle(msec: number): number {
    return this.getAngle(this.getFrameIndex(msec));
  }

  public getNowDelay(msec: number): number {
    return this.getDelay(this.getFrameIndex(msec));
  }

  public getAngle(frame: number): number {
    frame = frame % (this._maxFrame + 1);
    if (frame === 0) {
      return MIN_ROTATE * Math.PI;
    }
    if (frame === this._maxFrame) {
      return MAX_ROTATE * Math.PI;
    }
    const d = this._delayPerFrame * (frame - 1) + this.getDelay(frame) / 2;
    return (ROTATE_RANGE * d / this._time + MIN_ROTATE) * Math.PI;
  }

  public getDelay(frame: number): number {
    frame = frame % (this._maxFrame + 1);
    if (frame === 0) {
      return this._before;
    }
    if (frame === this._maxFrame) {
      return this._after;
    }
    const d = this._delayPerFrame;
    if (d === 1) {
      return 1;
    }
    const fMax = this._time / d;
    return (frame > fMax) ? (this._time % d) : d;
  }
}
