/// <reference path="../typings/gif.d.ts" />
import { Setting } from 'setting';
import { Tile } from 'tile';
import { Panel } from 'panel';

function afterCreated(blob: number): void {
  let img = document.getElementById('dokabenized_img');
  if (img === null) {
    img = document.createElement('img');
    img.id = 'dokabenized_img';
    const e = document.getElementById('result');
    if (e === null) {
      const div = document.createElement('div');
      div.id = 'result';
      div.appendChild(img);
      document.body.appendChild(div);
    } else {
      e.appendChild(img);
    }
  }
  (<HTMLImageElement> img).src = URL.createObjectURL(blob);
}

function dokabenize(): void {
  const setting = new Setting();
  console.log('dokabenizing...');
  const tile = new Tile();
  tile.font = setting.font;
  tile.bgcolor = setting.bgcolor;
  tile.drawText(setting.text);
  const panel = new Panel(tile);
  let trans: number | null = null;
  if (setting.bgcolor.length === 0) {
    trans = 0x000000;
  }
  const gif = new GIF({
    quality: 10,
    transparent: trans,
    workerScript: 'js/gif.worker.js',
    workers: 2
  });
  for (let i = 0; i <= setting.manager.maxFrame; i++) {
    const d = setting.manager.getDelay(i);
    if (d === 0) {
      continue;
    }
    panel.render(setting.manager.getAngle(i));
    gif.addFrame(panel.canvas, {delay: d, copy: true});
  }
  gif.on('finished', afterCreated);
  gif.render();
}

function initialize(): void {
  const button = <HTMLButtonElement> document.getElementById('dokabenize');
  button.addEventListener('click', dokabenize, false);
  console.log('initialized');
}

addEventListener('load', initialize, false);
