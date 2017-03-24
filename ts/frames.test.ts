import * as Frames from './frames';
import { test } from 'ava';
import { AssertContext } from 'ava';

const DEFAULT_FPS = 8;
const DEFAULT_TIME = 1500;
const DEFAULT_BEFORE = 800;
const DEFAULT_AFTER = 1700;

test('set values to fps', async t => {
  const mgr = new Frames.Manager(DEFAULT_FPS, DEFAULT_TIME, DEFAULT_BEFORE, DEFAULT_AFTER);
  // 0 < fps <= 1000, allow point
  mgr.fps = 8;
  t.is(mgr.fps, 8);
  t.is(mgr.delayPerFrame, 125);
  t.is(mgr.maxFrame, 13);
  mgr.fps = 1500;
  t.is(mgr.fps, 1000);
  t.is(mgr.delayPerFrame, 1);
  t.is(mgr.maxFrame, 1501);
  mgr.fps = 0.5;
  t.is(mgr.fps, 0.5);
  t.is(mgr.delayPerFrame, 2000);
  t.is(mgr.maxFrame, 2);
  mgr.fps = 0;
  t.is(mgr.fps, 1);
  t.is(mgr.delayPerFrame, 1000);
  t.is(mgr.maxFrame, 3);
  mgr.fps = -500;
  t.is(mgr.fps, 1);
  t.is(mgr.delayPerFrame, 1000);
  t.is(mgr.maxFrame, 3);
});

test('set values to time', async t => {
  const mgr = new Frames.Manager(DEFAULT_FPS, DEFAULT_TIME, DEFAULT_BEFORE, DEFAULT_AFTER);
  // 1 <= time, integer only
  mgr.time = 1500;
  t.is(mgr.time, 1500);
  t.is(mgr.maxFrame, 13);
  mgr.time = 2.5;
  t.is(mgr.time, 2);
  t.is(mgr.maxFrame, 2);
  mgr.time = 0.5;
  t.is(mgr.time, 1);
  t.is(mgr.maxFrame, 2);
  mgr.time = 0;
  t.is(mgr.time, 1);
  t.is(mgr.maxFrame, 2);
  mgr.time = -500;
  t.is(mgr.time, 1);
  t.is(mgr.maxFrame, 2);
});

test('set values to before', async t => {
  const mgr = new Frames.Manager(DEFAULT_FPS, DEFAULT_TIME, DEFAULT_BEFORE, DEFAULT_AFTER);
  // 0 <= before, integer only
  mgr.before = 1500;
  t.is(mgr.before, 1500);
  mgr.before = 2.5;
  t.is(mgr.before, 2);
  mgr.before = 0.5;
  t.is(mgr.before, 0);
  mgr.before = 0;
  t.is(mgr.before, 0);
  mgr.before = -500;
  t.is(mgr.before, 0);
});

test('set values to after', async t => {
  const mgr = new Frames.Manager(DEFAULT_FPS, DEFAULT_TIME, DEFAULT_BEFORE, DEFAULT_AFTER);
  // 0 <= after, integer only
  mgr.after = 1500;
  t.is(mgr.after, 1500);
  mgr.after = 2.5;
  t.is(mgr.after, 2);
  mgr.after = 0.5;
  t.is(mgr.after, 0);
  mgr.after = 0;
  t.is(mgr.after, 0);
  mgr.after = -500;
  t.is(mgr.after, 0);
});

test('edge cases 8FPS', async t => {
  const mgr = new Frames.Manager(8, DEFAULT_TIME, DEFAULT_BEFORE, DEFAULT_AFTER);
  doEdgeCases(mgr, t);
});

test('edge cases 7FPS', async t => {
  const mgr = new Frames.Manager(7, DEFAULT_TIME, DEFAULT_BEFORE, DEFAULT_AFTER);
  doEdgeCases(mgr, t);
});

test('edge cases 1500FPS', async t => {
  const mgr = new Frames.Manager(1500, DEFAULT_TIME, DEFAULT_BEFORE, DEFAULT_AFTER);
  doEdgeCases(mgr, t);
});

test('edge cases 1750FPS', async t => {
  const mgr = new Frames.Manager(1750, DEFAULT_TIME, DEFAULT_BEFORE, DEFAULT_AFTER);
  doEdgeCases(mgr, t);
});

test('edge cases 0.5FPS', async t => {
  const mgr = new Frames.Manager(0.5, DEFAULT_TIME, DEFAULT_BEFORE, DEFAULT_AFTER);
  doEdgeCases(mgr, t);
});

test('edge cases 0.75FPS', async t => {
  const mgr = new Frames.Manager(0.75, DEFAULT_TIME, DEFAULT_BEFORE, DEFAULT_AFTER);
  doEdgeCases(mgr, t);
});

function doEdgeCases(mgr: Frames.Manager, t: AssertContext): void {
  const maxTime = mgr.time + mgr.before + mgr.after;
  const maxFrame = mgr.maxFrame;
  // before
  t.is(mgr.getNowAngle(0), Frames.MIN_ROTATE * Math.PI);
  t.is(mgr.getNowAngle(Math.floor(mgr.before / 2)), Frames.MIN_ROTATE * Math.PI);
  t.is(mgr.getNowAngle(mgr.before - 1), Frames.MIN_ROTATE * Math.PI);
  t.is(mgr.getFrameIndex(0), 0);
  t.is(mgr.getFrameIndex(Math.floor(mgr.before / 2)), 0);
  t.is(mgr.getFrameIndex(mgr.before - 1), 0);
  // first in move
  const first = mgr.getNowAngle(mgr.before);
  t.true(first < Frames.MAX_ROTATE * Math.PI);
  t.true(first > Frames.MIN_ROTATE * Math.PI);
  t.is(mgr.getFrameIndex(mgr.before), 1);
  // middle
  const middle = mgr.getNowAngle(mgr.before + Math.floor(mgr.time / 2));
  t.true(middle < Frames.MAX_ROTATE * Math.PI);
  t.true(middle > Frames.MIN_ROTATE * Math.PI);
  const middleFrame = mgr.getFrameIndex(mgr.before + Math.floor(mgr.time / 2));
  t.true(middleFrame < maxFrame);
  t.true(middleFrame > 0);
  // last in move
  const last = mgr.getNowAngle(mgr.before + mgr.time - 1);
  t.true(last < Frames.MAX_ROTATE * Math.PI);
  t.true(last > Frames.MIN_ROTATE * Math.PI);
  t.is(mgr.getFrameIndex(mgr.before + mgr.time - 1), maxFrame - 1);
  // after
  t.is(mgr.getNowAngle(mgr.before + mgr.time), Frames.MAX_ROTATE * Math.PI);
  t.is(mgr.getNowAngle(mgr.before + mgr.time + Math.floor(mgr.after / 2)), Frames.MAX_ROTATE * Math.PI);
  t.is(mgr.getNowAngle(maxTime - 1), Frames.MAX_ROTATE * Math.PI);
  t.is(mgr.getFrameIndex(mgr.before + mgr.time), maxFrame);
  t.is(mgr.getFrameIndex(mgr.before + mgr.time + Math.floor(mgr.after / 2)), maxFrame);
  t.is(mgr.getFrameIndex(maxTime - 1), maxFrame);
  // second lap - before
  t.is(mgr.getNowAngle(maxTime), Frames.MIN_ROTATE * Math.PI);
  t.is(mgr.getNowAngle(maxTime + Math.floor(mgr.before / 2)), Frames.MIN_ROTATE * Math.PI);
  t.is(mgr.getNowAngle(maxTime + mgr.before - 1), Frames.MIN_ROTATE * Math.PI);
  t.is(mgr.getFrameIndex(maxTime), 0);
  t.is(mgr.getFrameIndex(maxTime + Math.floor(mgr.before / 2)), 0);
  t.is(mgr.getFrameIndex(maxTime + mgr.before - 1), 0);
  // second lap - first in move
  const firstInSecondLap = mgr.getNowAngle(maxTime + mgr.before);
  t.true(firstInSecondLap < Frames.MAX_ROTATE * Math.PI);
  t.true(firstInSecondLap > Frames.MIN_ROTATE * Math.PI);
  t.is(mgr.getFrameIndex(maxTime + mgr.before), 1);
}

test('delay array 8FPS', async t => {
  // 8FPS 125msec * 12frame = 1500msec
  const mgr = new Frames.Manager(8, DEFAULT_TIME, DEFAULT_BEFORE, DEFAULT_AFTER);
  t.is(mgr.delayPerFrame, 125);
  t.is(mgr.maxFrame, 13);
  const expected: number[] = [DEFAULT_BEFORE];
  for (let i = 0; i < 12; i++) {
    expected.push(125);
  }
  expected.push(DEFAULT_AFTER);
  checkDelayArray(mgr, expected, t);
});

test('delay array 7FPS', async t => {
  // 7FPS 142msec * 10frame + 80msec * 1frame = 1500msec
  const mgr = new Frames.Manager(7, DEFAULT_TIME, DEFAULT_BEFORE, DEFAULT_AFTER);
  t.is(mgr.delayPerFrame, 142);
  t.is(mgr.maxFrame, 12);
  const expected: number[] = [DEFAULT_BEFORE];
  for (let i = 0; i < 10; i++) {
    expected.push(142);
  }
  expected.push(80);
  expected.push(DEFAULT_AFTER);
  checkDelayArray(mgr, expected, t);
});

test('delay array 1500FPS', async t => {
  // 1500FPS 1msec * 1500frame = 1500msec
  const mgr = new Frames.Manager(1500, DEFAULT_TIME, DEFAULT_BEFORE, DEFAULT_AFTER);
  t.is(mgr.delayPerFrame, 1);
  t.is(mgr.maxFrame, 1501);
  const expected: number[] = [DEFAULT_BEFORE];
  for (let i = 0; i < DEFAULT_TIME; i++) {
    expected.push(1);
  }
  expected.push(DEFAULT_AFTER);
  checkDelayArray(mgr, expected, t);
});

test('delay array 1750FPS', async t => {
  // 1750FPS 1msec * 1500frame = 1500msec
  const mgr = new Frames.Manager(1750, DEFAULT_TIME, DEFAULT_BEFORE, DEFAULT_AFTER);
  t.is(mgr.delayPerFrame, 1);
  t.is(mgr.maxFrame, 1501);
  const expected: number[] = [DEFAULT_BEFORE];
  for (let i = 0; i < DEFAULT_TIME; i++) {
    expected.push(1);
  }
  expected.push(DEFAULT_AFTER);
  checkDelayArray(mgr, expected, t);
});

test('delay array 0.5FPS', async t => {
  // 0.5FPS 1500msec * 1frame = 1500msec
  const mgr = new Frames.Manager(0.5, DEFAULT_TIME, DEFAULT_BEFORE, DEFAULT_AFTER);
  t.is(mgr.delayPerFrame, 2000);
  t.is(mgr.maxFrame, 2);
  const expected: number[] = [DEFAULT_BEFORE, DEFAULT_TIME, DEFAULT_AFTER];
  checkDelayArray(mgr, expected, t);
});

test('delay array 0.75FPS', async t => {
  // 0.75FPS 1333msec * 1frame + 167msec * 1frame = 1500msec
  const mgr = new Frames.Manager(0.75, DEFAULT_TIME, DEFAULT_BEFORE, DEFAULT_AFTER);
  t.is(mgr.delayPerFrame, 1333);
  t.is(mgr.maxFrame, 3);
  const expected: number[] = [DEFAULT_BEFORE, 1333, 167, DEFAULT_AFTER];
  checkDelayArray(mgr, expected, t);
});

function checkDelayArray(mgr: Frames.Manager, expected: number[], t: AssertContext): void {
  for (let i = 1; i < mgr.maxFrame; i++) {
    t.is(mgr.getDelay(i), expected[i], 'fps:' + mgr.fps + ' frame:' + i);
  }
}

test('msec loop 8FPS', async t => {
  const mgr = new Frames.Manager(8, DEFAULT_TIME, DEFAULT_BEFORE, DEFAULT_AFTER);
  doMsecLoop(mgr, t);
});

test('msec loop 7FPS', async t => {
  const mgr = new Frames.Manager(7, DEFAULT_TIME, DEFAULT_BEFORE, DEFAULT_AFTER);
  doMsecLoop(mgr, t);
});

test('msec loop 1500FPS', async t => {
  const mgr = new Frames.Manager(1500, DEFAULT_TIME, DEFAULT_BEFORE, DEFAULT_AFTER);
  doMsecLoop(mgr, t);
});

test('msec loop 1750FPS', async t => {
  const mgr = new Frames.Manager(1750, DEFAULT_TIME, DEFAULT_BEFORE, DEFAULT_AFTER);
  doMsecLoop(mgr, t);
});

test('msec loop 0.5FPS', async t => {
  const mgr = new Frames.Manager(0.5, DEFAULT_TIME, DEFAULT_BEFORE, DEFAULT_AFTER);
  doMsecLoop(mgr, t);
});

test('msec loop 0.75FPS', async t => {
  const mgr = new Frames.Manager(0.75, DEFAULT_TIME, DEFAULT_BEFORE, DEFAULT_AFTER);
  doMsecLoop(mgr, t);
});

function doMsecLoop(mgr: Frames.Manager, t: AssertContext): void {
  let preFrame = -1;
  let preAngle = (Frames.MIN_ROTATE - 1) * Math.PI;
  for (let msec = 0; msec < mgr.time + mgr.before + mgr.after; msec++) {
    const frame = mgr.getFrameIndex(msec);
    const angleNow = mgr.getNowAngle(msec);
    const delayNow = mgr.getNowDelay(msec);
    const angle = mgr.getAngle(frame);
    const delay = mgr.getDelay(frame);
    t.is(angleNow, angle, 'fps:' + mgr.fps + ' msec:' + msec);
    t.is(delayNow, delay, 'fps:' + mgr.fps + ' msec:' + msec);
    t.true(delay >= 1, 'fps:' + mgr.fps + ' msec:' + msec);
    if (frame !== preFrame) {
      t.true(angle > preAngle, 'fps:' + mgr.fps + ' msec:' + msec);
      t.true(frame > preFrame, 'fps:' + mgr.fps + ' msec:' + msec);
      preAngle = angle;
      preFrame = frame;
    } else {
      t.is(angle, preAngle, 'fps:' + mgr.fps + ' msec:' + msec);
      t.is(frame, preFrame, 'fps:' + mgr.fps + ' msec:' + msec);
    }
    if (frame > 0 && frame < mgr.maxFrame) {
      if (frame === mgr.maxFrame - 1) {
        const exp = (mgr.fps >= 1000) ? 1 : mgr.time % mgr.delayPerFrame;
        if (exp === 0) {
          t.is(delay, mgr.delayPerFrame, 'fps:' + mgr.fps + ' msec:' + msec);
        } else {
          t.is(delay, exp, 'fps:' + mgr.fps + ' msec:' + msec);
        }
      } else {
        t.is(delay, mgr.delayPerFrame, 'fps:' + mgr.fps + ' msec:' + msec);
      }
    }
  }
}
