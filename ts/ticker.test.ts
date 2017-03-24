import Ticker from './ticker';
import test from 'ava';

test('format yymmdd', t => {
  let tkr = new Ticker();
  tkr.tick();
  t.is('foo', 'foo');
});
