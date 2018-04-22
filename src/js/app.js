import * as THREE from 'three';
import {TimelineMax} from 'gsap';
var OrbitControls = require('three-orbit-controls')(THREE);
import fragment from './fragment.glsl';
import vertex from './vertex.glsl';

import './lib/curves.js';


console.log(THREE.Curves.TorusKnot);



let camera, pos, controls, scene, renderer, geometry, geometry1, material,plane,another;
let destination = {x:0,y:0};
let textures = [];

function init() {
  scene = new THREE.Scene();
  scene.destination = {x:0,y:0};

  renderer = new THREE.WebGLRenderer({ alpha: true });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerWidth);

  var container = document.getElementById('container');
  container.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.001, 100
  );
  camera.position.set( 0, 0, 32 );


  controls = new OrbitControls(camera, renderer.domElement);


  material = new THREE.ShaderMaterial( {
    side: THREE.DoubleSide,
    uniforms: {
      time: { type: 'f', value: 0 }
    },
    // wireframe: true,
    vertexShader: vertex,
    fragmentShader: fragment,
  });

  //new THREE.PlaneGeometry( 1,1, 64, 64 )

  function CustomSinCurve( scale ) {

    THREE.Curve.call( this );

    this.scale = ( scale === undefined ) ? 1 : scale;

  }

  CustomSinCurve.prototype = Object.create( THREE.Curve.prototype );
  CustomSinCurve.prototype.constructor = CustomSinCurve;

  CustomSinCurve.prototype.getPoint = function( t ) {

    t = (Math.PI * 2) * t;
    var s = Math.sin(t);
    var c = Math.cos(t);
    var r = 2 + 6 * c;
    var ty = 1 + (-r * c) * 0.205 - 0.25;
    var tx = (-r * s) * 0.205;
    var tz = s * 0.65;

    return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);

  };


  // first object
  let path = new CustomSinCurve( 10 );
  geometry = new THREE.TubeGeometry( path, 100, 3, 100, true );
  plane = new THREE.Mesh(geometry,material);
  plane.position.x = 10;
  plane.rotation.y = -Math.PI*0.5;
  scene.add(plane);



  // second object
  path = new THREE.Curves.KnotCurve( );
  let geometry1 = new THREE.TubeGeometry( path, 100, 1.5, 100, true );
  another = new THREE.Mesh(geometry1,material);
  another.position.x = -16;
  another.rotation.x = -Math.PI*0.5;
  another.rotation.z = -Math.PI*0.45;
  another.rotation.y = Math.PI*0.1;
  scene.add(another);

  resize();

 
}

window.addEventListener('resize', resize); 
function resize() {
  var w = window.innerWidth;
  var h = window.innerHeight;
  renderer.setSize( w, h );
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

let time = 0;
function animate() {
  time = time+0.05;
  material.uniforms.time.value = time;

  // plane.rotation.y = time/50;
  
  requestAnimationFrame(animate);
  render();
}

function render() {
  scene.rotation.x += (scene.destination.x - scene.rotation.x)*0.05;
  scene.rotation.y += (scene.destination.y - scene.rotation.y)*0.05;
  renderer.render(scene, camera);
}

let ww = window.innerWidth;
let wh = window.innerHeight;
function onMousemove(e) {
  var x = (e.clientX-ww/2)/(ww/2);
  var y = (e.clientY-wh/2)/(wh/2);
  scene.destination.x = y*0.5;
  scene.destination.y = x*0.5;
}
window.addEventListener('mousemove', onMousemove);

init();
animate();




