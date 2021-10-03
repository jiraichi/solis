import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Observable } from 'rxjs';
import { Months } from '../../../interfaces/angle';
import { DeviceOrientation, DeviceOrientationCompassHeading } from '@ionic-native/device-orientation/ngx';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-angle',
  templateUrl: './angle.page.html',
  styleUrls: ['./angle.page.scss'],
})
export class AnglePage implements OnInit {

  @ViewChild('three') three: ElementRef<HTMLElement>;

  // THREEJS STUFF
  scene: any;
  camera: any;
  controls: any;
  renderer: any;

  /*
  * Geometry is shape rendered
  * Material is texture applied to geometry
  * Earth and Sun are meshes as a result of geometry + material
  */
  geometryEarth: any;
  geometrySun: any;
  materialEarth: any;
  materialSun: any;
  earth: any;
  sun: any;

  lat: string;
  long: string;
  angles$: Observable<Months>;
  angleXAverage: number;
  angleYAverage: number;
  orientation: DeviceOrientationCompassHeading;


  constructor(
    private deviceOrientation: DeviceOrientation,
    private route: ActivatedRoute,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.lat = params.get('coordinates').split('_')[0];
      this.long = params.get('coordinates').split('_')[1];

      this.angleXAverage = +params.get('sunPosition').split('_')[0];
      this.angleYAverage = +params.get('sunPosition').split('_')[1];
    });

    this.angles$ = this.api.getAngles(this.lat, this.long);
  }

  ionViewDidEnter() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.three.nativeElement.appendChild(this.renderer.domElement);
    const earthTexture = new THREE.TextureLoader().load('assets/earth.jpg');

    this.geometryEarth = new THREE.SphereGeometry(2, 32, 32);
    this.materialEarth = new THREE.MeshBasicMaterial({map: earthTexture});
    this.earth = new THREE.Mesh(this.geometryEarth, this.materialEarth);
    this.scene.add(this.earth);


    const sunTexture = new THREE.TextureLoader().load('assets/sun.jpg');

    this.geometrySun = new THREE.SphereGeometry(0.5, 32, 32);
    this.materialSun = new THREE.MeshBasicMaterial({map: sunTexture});
    this.sun = new THREE.Mesh(this.geometrySun, this.materialSun);
    this.sun.position.set(this.angleXAverage, this.angleYAverage, -3);
    this.scene.add(this.sun);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.camera.position.set(0, 20, 100);

    this.camera.position.z = 5;

    this.controls.update();

    // USE FOLLOWIG TO DEBUG ON BROWSER
   /* const dom = this.renderer.domElement;
    dom.addEventListener('mousemove', (e) => {

      this.camera.position.x += e.movementY / 100  ;
      this.camera.position.x += 0.1;

      this.camera.lookAt(0, 0, 0);

      console.log('x', this.camera.position.x);
      console.log('y', this.camera.position.y);
      console.log('z', this.camera.position.z);
      this.renderer.render( this.scene, this.camera );
    });*/

    this.deviceOrientation.watchHeading().subscribe((res: DeviceOrientationCompassHeading) => {
      this.orientation = res;
      this.camera.lookAt(this.earth.position);
      this.camera.position.x += res.magneticHeading / 18;
      this.controls.update();
      this.renderer.render( this.scene, this.camera );
    });
  }
}
