import Ticker from './ticker';
import test from 'ava';

function doAfter(func: () => number, delay: number): Promise<number> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(func());
    }, delay);
  });
}

test('before start', async t => {
  const tkr = new Ticker();
  t.true(tkr.paused);
  t.is(tkr.tick(), 0);
});

test('start', async t => {
  const tkr = new Ticker();
  tkr.start();
  t.false(tkr.paused);
  const ticked: number = await doAfter(() => { return tkr.tick(); }, 50);
  t.not(ticked, 0);
});

test('pause', async t => {
  const tkr = new Ticker();
  tkr.start();
  const paused: number = await doAfter(() => { return tkr.pause(); }, 50);
  t.not(paused, 0);
  t.true(tkr.paused);
  const paused2: number = await doAfter(() => { return tkr.pause(); }, 50);
  t.is(paused, paused2);
  t.true(tkr.paused);
});

test('pause and restart', async t => {
  const tkr = new Ticker();
  tkr.start();
  const paused: number = await doAfter(() => { return tkr.pause(); }, 50);
  const restarted: number = await doAfter(() => { const p = tkr.tick(); tkr.restart(); return p; }, 50);
  t.is(paused, restarted);
  t.false(tkr.paused);
  const ticked: number = await doAfter(() => { return tkr.tick(); }, 50);
  t.true(restarted < ticked);
});

test('pause and reset', async t => {
  const tkr = new Ticker();
  tkr.start();
  const paused: number = await doAfter(() => { return tkr.pause(); }, 50);
  tkr.reset();
  const afterReset: number = await doAfter(() => { return tkr.tick(); }, 50);
  t.is(afterReset, 0);
  t.true(paused > afterReset);
  t.true(tkr.paused);
});

test('pause and reset and restart', async t => {
  const tkr = new Ticker();
  tkr.start();
  const paused: number = await doAfter(() => { return tkr.pause(); }, 50);
  tkr.reset();
  const restarted: number = await doAfter(() => { const p = tkr.tick(); tkr.restart(); return p; }, 50);
  t.is(restarted, 0);
  t.not(paused, restarted);
  t.true(restarted < paused);
  t.false(tkr.paused);
  const ticked: number = await doAfter(() => { return tkr.tick(); }, 50);
  t.true(restarted < ticked);
});

test('pause and start', async t => {
  const tkr = new Ticker();
  tkr.start();
  const paused: number = await doAfter(() => { return tkr.pause(); }, 50);
  const started: number = await doAfter(() => { t.is(tkr.tick(), paused); tkr.start(); return tkr.tick(); }, 50);
  t.not(started, paused);
  t.true(started < paused);
  t.false(tkr.paused);
  const ticked: number = await doAfter(() => { return tkr.tick(); }, 50);
  t.true(started < ticked);
});
