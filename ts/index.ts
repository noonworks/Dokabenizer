import * as frames from './frames';
import Ticker from './ticker';

let t = new Ticker();
t.tick();
let mgr = new frames.Manager();
mgr.getAngle(0);
