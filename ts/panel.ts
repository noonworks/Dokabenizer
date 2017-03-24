import { Tile } from './tile';
import * as THREE from 'three';

const PADDING = 10;
const FOV = 30;

export class Panel {
  private _canvas: HTMLCanvasElement;
  private _context: CanvasRenderingContext2D;
  private _renderer: THREE.WebGLRenderer;
  private _scene: THREE.Scene;
  private _tile: Tile;
  private _camera: THREE.PerspectiveCamera;
  private _geometry: THREE.PlaneGeometry;
  private _material: THREE.MeshBasicMaterial;
  private _plane: THREE.Mesh;
  private _far: number;

  constructor(tile: Tile) {
    this._canvas = <HTMLCanvasElement> document.createElement('canvas');
    this._context = <CanvasRenderingContext2D> this._canvas.getContext('2d');
    this._renderer = new THREE.WebGLRenderer({ alpha: true, preserveDrawingBuffer: true });
    this._scene = new THREE.Scene();
    this.tile = tile;
  }

  public get canvas(): HTMLCanvasElement {
    return this._canvas;
  }

  public set tile(t: Tile) {
    this._tile = t;
    /* if (this._tile.bgcolor.length === 0) {
      this._renderer.alpha = true;
    } else {
      this._renderer.alpha = false;
    } */
    this.setSize();
    this.addPlane();
  }

  public render(rotation: number): void {
    this._plane.rotation.x = rotation;
    this._renderer.render(this._scene, this._camera);
    if (this._tile.bgcolor.length !== 0) {
      this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
    } else {
      this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }
    this._context.drawImage(this._renderer.domElement, 0, 0);
  }

  private setSize(): void {
    let width = this._tile.canvas.width + PADDING * 2;
    let height = this._tile.canvas.height + PADDING * 2;
    if (width % 10 !== 0) {
      width += 10 - (width % 10);
    }
    if (height % 10 !== 0) {
      height += 10 - (height % 10);
    }
    const canvasHeight = height + this._tile.canvas.height;
    // h0 = harf of the tile height
    const h0px = this._tile.canvas.height / 2;
    // z0 = camera to near clip = 1
    const z0px = height / 2 / Math.tan(Math.PI * FOV / 360);
    // h1 = harf of the plane height = 1 / 2 = z0 / 2
    const h1px = z0px / 2;
    // z1 = camera to the plane (calculate with Similarity of triangle)
    const z1px = z0px * h1px / h0px;
    // pixel to virtual
    this._far = z1px / z0px;
    // resize objects
    this._renderer.setSize(width, canvasHeight);
    this._camera = new THREE.PerspectiveCamera(FOV, width / canvasHeight, 1, 100);
    this._canvas.width = width;
    this._canvas.height = height;
    this._context = <CanvasRenderingContext2D> this._canvas.getContext('2d');
    if (this._tile.bgcolor.length !== 0) {
      this._context.fillStyle = this._tile.bgcolor;
    }
  }

  private addPlane(): void {
    this.clear();
    this._geometry = new THREE.PlaneGeometry(this._tile.canvas.width / this._tile.canvas.height, 1);
    // move the object up to harf of it (set rotate-axis to the bottom of it)0
    this._geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0.5, 0));
    const tx = new THREE.Texture(this._tile.canvas);
    tx.needsUpdate = true;
    tx.minFilter = THREE.LinearFilter;
    tx.magFilter = THREE.LinearFilter;
    this._material = new THREE.MeshBasicMaterial({map: tx});
    this._plane = new THREE.Mesh(this._geometry, this._material);
    // set distance from camera
    this._plane.position.z = -1 * this._far;
    this._scene.add(this._plane);
  }

  private clear(): void {
    if (this._geometry) {
      this._geometry.dispose();
    }
    if (this._material) {
      this._material.dispose();
    }
    if (this._plane) {
      this._scene.remove(this._plane);
    }
  }
}
