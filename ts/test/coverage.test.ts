import test from 'ava';
import * as coveoanalytics from './coverage';

test('coverage', t => {
  const _ = coveoanalytics;
  t.is(_.Dummy.return1(), 1);
});
