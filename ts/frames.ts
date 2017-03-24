const MAX_ROTATE: number = 0;
const MIN_ROTATE: number = -0.5;
const ROTATE_RANGE: number = Math.abs(MAX_ROTATE - MIN_ROTATE);

export interface IFrame {
  angle: number;
  delay: number;
}

export class Manager {
  constructor(public fps: number = 8, public time: number = 1500,
              public before: number = 800, public after: number = 1700) {}

  public getAngle(msec: number): number {
    msec = msec % (this.time + this.before + this.after);
    if (msec < this.before) {
      return MIN_ROTATE * Math.PI;
    }
    if (msec >= this.before + this.time) {
      return MAX_ROTATE * Math.PI;
    }
    let maxframe = Math.floor(this.fps * this.time / 1000) + 1;
    let f = Math.floor((msec - this.before) / (1000 / this.fps)) + 1;
    return (ROTATE_RANGE / maxframe * f + MIN_ROTATE) * Math.PI;
  }

  public getFrame(frameIndex: number): IFrame {
    let maxframe = Math.floor(this.fps * this.time / 1000) + 1;
    frameIndex = frameIndex % (maxframe + 1);
    if (frameIndex === 0) {
      return {angle: MIN_ROTATE * Math.PI, delay: this.before};
    }
    if (frameIndex === maxframe) {
      return {angle: MAX_ROTATE * Math.PI, delay: this.after};
    }
    let delay = Math.floor(1000 / this.fps);
    if (delay < 1) {
      delay = 1;
    }
    return {angle: (ROTATE_RANGE / maxframe * frameIndex + MIN_ROTATE) * Math.PI, delay};
  }
}
