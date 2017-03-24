import * as Fonts from './font';
import { test } from 'ava';

test('create with default values', async t => {
  const f = new Fonts.Font();
  t.is(f.size, Fonts.DEFAULT_SIZE);
  t.is(f.fill, Fonts.DEFAULT_FILL);
  t.is(f.stroke, Fonts.DEFAULT_STROKE);
  t.is(f.strokeWidth, Fonts.DEFAULT_STROKE_WIDTH);
  t.is(f.fonts, Fonts.DEFAULT_FONTS);
  t.is(f.toString(), '' + Fonts.DEFAULT_SIZE + "px '" + Fonts.DEFAULT_FONTS.join("','") + "'");
});

test('toString', async t => {
  const f = new Fonts.Font(10, '', '', 0, ['test font 1', 'test font 2']);
  t.is(f.toString(), "10px 'test font 1','test font 2'");
  f.fonts = ['test font only one'];
  t.is(f.toString(), "10px 'test font only one'");
  f.fonts = [];
  t.is(f.toString(), '10px');
});
