import { Manager } from 'frames';
import { Tile } from 'tile';
import { Panel } from 'panel';

function main(): void {
  const mgr = new Manager(8, 1500, 800, 1700);
  const tile = new Tile();
  const panel = new Panel(tile);
  tile.drawText('AbcD');
  panel.render(mgr.getAngle(0));
}

main();
