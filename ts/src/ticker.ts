export default class Ticker {
  private _seed: number;
  private _pausedMs: number;
  private _paused: boolean;

  constructor() {
    this._seed = 0;
    this._pausedMs = 0;
    this._paused = true;
  }

  get paused(): boolean {
    return this._paused;
  }

  public start(): void {
    this.reset();
    this.restart();
  }

  public reset(): void {
    this._pausedMs = 0;
  }

  public restart(): void {
    this._paused = false;
    this._seed = (new Date()).getTime();
  }

  public pause(): number {
    this._pausedMs = this.tick();
    this._paused = true;
    return this._pausedMs;
  }

  public tick(): number {
    if (this._paused) {
      return this._pausedMs;
    }
    return (new Date()).getTime() - this._seed + this._pausedMs;
  }
}
