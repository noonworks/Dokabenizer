import { Setting } from 'setting';
import { Tile } from 'tile';
import { Panel } from 'panel';

/*
function afterCreated(blob: number): void {
  let img = document.getElementById('dokabenized_img');
  if (img === null) {
    img = document.createElement('img');
    img.id = 'dokabenized_img';
    // document.body.appendChild(img);
  }
  // img.src = URL.createObjectURL(blob);
}
*/

function dokabenize(): void {
  const setting = new Setting();
  console.log('dokabenizing...');
  const tile = new Tile();
  tile.drawText(setting.text);
  const panel = new Panel(tile);
  /*
  const gif = new GIF({
    workers: 2,
    quality: 10,
    workerScript: 'js/gif.worker.js'
  });
  */
  for (let i = 0; i <= setting.manager.maxFrame; i++) {
    const delay = setting.manager.getDelay(i);
    if (delay === 0) {
      continue;
    }
    console.log(delay);
    panel.render(setting.manager.getAngle(0));
    // gif.addFrame(panel.canvas, {delay: delay, copy: true});
  }
  /*
  gif.on('finished', afterCreated);
  gif.render();
  */
}

function initialize(): void {
  const button = <HTMLButtonElement> document.getElementById('dokabenize');
  button.addEventListener('click', dokabenize, false);
  console.log('initialized');
}

addEventListener('load', initialize, false);
