export default class Ticker {
  private _seed: number;
  private _paused_ms: number;
  private _paused: boolean;
  
  constructor() {
    this._seed = 0;
    this._paused_ms = 0;
    this._paused = true;
  }
  
  start() {
    this.reset();
    this.restart();
  }
  
  reset() {
    this._paused_ms = 0;
  }
  
  restart() {
    this._paused = false;
    this._seed = (new Date()).getTime();
  }
  
  pause() {
    this._paused_ms = this.tick();
    this._paused = true;
  }
  
  tick() {
    if (this._paused) {
      return this._paused_ms;
    }
    return (new Date()).getTime() - this._seed + this._paused_ms;
  }
}
