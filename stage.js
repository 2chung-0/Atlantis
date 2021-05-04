import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/OBJLoader.js';
import { RectAreaLightHelper } from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { Water } from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/objects/Water.js';
import { Sky } from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/objects/Sky.js';
import { Lensflare, LensflareElement } from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/objects/Lensflare.js';

let container;
let camera, scene, renderer;
let water, sun;
let light1, light2, light3, light4, light5, light, rectLight1;

init();
animate();

function init() {
    // set scene
    container = document.getElementById( 'container' );

    scene = new THREE.Scene();
    sun = new THREE.Vector3();
    
    //set camera
    camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(45, 30, 250 );


    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild( renderer.domElement );

    // audio
    const listener = new THREE.AudioListener();
    camera.add( listener );
    const sound = new THREE.Audio( listener );

    const audioLoader = new THREE.AudioLoader();
    audioLoader.load( 'savingWorld.mp3', function( buffer ) {
    sound.setBuffer( buffer );
    sound.setLoop( true );
    sound.setVolume( 0.1 );
    sound.play();
    });



    const waterGeometry = new THREE.PlaneGeometry( 10000, 10000 );

    water = new Water(
        waterGeometry,
        {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: new THREE.TextureLoader().load( 'waternormals.jpg', function ( texture ) {

                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

            } ),
            sunDirection: new THREE.Vector3(),
            sunColor: 0xffffff,
            waterColor: 0x000000,
            distortionScale: 3.7,
            fog: scene.fog !== undefined
        }
    );

    water.rotation.set(Math.PI/2, Math.PI, 0);


    scene.add( water );
    water.castShadow = true;
    water.receiveShadow = true;

    const sky = new Sky();
    sky.scale.setScalar( 10000 );
    scene.add( sky );


    const skyUniforms = sky.material.uniforms;

    skyUniforms[ 'turbidity' ].value = 10;
    skyUniforms[ 'rayleigh' ].value = 2;
    skyUniforms[ 'mieCoefficient' ].value = 0.005;
    skyUniforms[ 'mieDirectionalG' ].value = 0.8;

    const parameters = {
        elevation: -10,
        azimuth: 0
    };

    const pmremGenerator = new THREE.PMREMGenerator( renderer );

    function updateSun() {

        const phi = THREE.MathUtils.degToRad( 90 - parameters.elevation );
        const theta = THREE.MathUtils.degToRad( parameters.azimuth );

        sun.setFromSphericalCoords( 1, phi, theta );

        sky.material.uniforms[ 'sunPosition' ].value.copy( sun );
        water.material.uniforms[ 'sunDirection' ].value.copy( sun ).normalize();
        
        scene.environment = pmremGenerator.fromScene( sky ).texture;

    }

    updateSun();





    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 2);
    controls.update();





    const sphere = new THREE.SphereGeometry( 0.2, 16, 4 );
    light1 = new THREE.PointLight( 0xffaa00, 2, 50 );
    light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffffff } ) ) );
    
    const lensflare = new Lensflare();
    const textureLoader = new THREE.TextureLoader();
    const textureFlare0 = textureLoader.load( "lensflare0.png" );
    lensflare.addElement( new LensflareElement( textureFlare0, 512, 0 ) );
    light1.add( lensflare );
    light1.castShadow = true;
    light1.shadow.mapSize.width = 512; // default
    light1.shadow.mapSize.height = 512; // default
    light1.shadow.camera.near = 0.5; // default
    light1.shadow.camera.far = 500; // default

    scene.add( light1 );

    light2 = new THREE.PointLight( 0x0040ff, 2, 50 );
    light2.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0x0040ff } ) ) );
    
    const lensflare1 = new Lensflare();
    const textureFlare1 = textureLoader.load( "lensflare1.png" );
    lensflare1.addElement( new LensflareElement( textureFlare1, 512, 0 ) );
    light2.add( lensflare1 );
    light2.castShadow = true;
    light2.shadow.mapSize.width = 512; // default
    light2.shadow.mapSize.height = 512; // default
    light2.shadow.camera.near = 0.5; // default
    light2.shadow.camera.far = 500; // default
    
    scene.add( light2 );

    light3 = new THREE.PointLight( 0x80ff80, 2, 50 );
    light3.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0x80ff80 } ) ) );
    scene.add( light3 );

    light4 = new THREE.PointLight( 0xffaa00, 2, 50 );
    light4.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffaa00 } ) ) );
    scene.add( light4 );


    
    light5 = new THREE.HemisphereLight( 0xebddb2, 0x000000, 0.3 );
    scene.add( light5 );

    light = new THREE.DirectionalLight( 0xebddb2, 0.2, 100 );
    light.position.set( 0, 1, 0 ); //default; light shining from top
    light.castShadow = true; // default false
    scene.add( light );

    //Set up shadow properties for the light
    light.shadow.mapSize.width = 512; // default
    light.shadow.mapSize.height = 512; // default
    light.shadow.camera.near = 0.5; // default
    light.shadow.camera.far = 500; // default



    const objLoader = new OBJLoader();
    let stage;

    const stMaterial = new THREE.MeshPhysicalMaterial( { color: 0xffffff, roughness: 0, metalness: 0 } );

    objLoader.load('stage2.obj',     
        function (obj) {
            stage = obj;
            stage.castShadow = true;
            stage.receiveShadow = true;
            stage.traverse(function (child) { child.castShadow = true; child.receiveShadow = true; });
            console.log(stage);
            stage.scale.set(0.04, 0.04, 0.04);
            stage.rotation.set(0, Math.PI, 0);
            for ( let i = 0 ; i < stage.children.length; i++) {
                stage.children[i].material = stMaterial;
            }
            scene.add(stage);
        }
        );
        
    RectAreaLightUniformsLib.init();

    for (let i = 0; i < 4; i++) {
        rectLight1 = new THREE.RectAreaLight( 0xffffff, 5, 1, 100);
        rectLight1.intensity = 1;
        rectLight1.position.set( -10, 20, 12+10*i);
        rectLight1.rotation.set(0, -Math.PI/2, 0);
        scene.add(rectLight1);
        scene.add(new RectAreaLightHelper( rectLight1));
    }

    for (let i = 0; i < 4; i++) {
        rectLight1 = new THREE.RectAreaLight( 0xffffff, 5, 1, 100);
        rectLight1.intensity = 1;
        rectLight1.position.set( 10, 20, -10*i-6);
        rectLight1.rotation.set(0, -Math.PI/2, 0);
        scene.add(rectLight1);
        scene.add(new RectAreaLightHelper( rectLight1));
    }
    




    window.addEventListener( 'resize', onWindowResize );
    document.body.addEventListener('keydown', keyPressed);
}


function animate() {
    render();
}

function render() {
    const time = Date.now() * 0.0005;

    light1.position.x = Math.sin( time * 0.7 ) * 10;
    light1.position.y = Math.cos( time * 0.5 ) * 20+20;
    light1.position.z = Math.cos( time * 0.3 ) * 10+100;

    light2.position.x = Math.cos( time * 0.3 ) * 30;
    light2.position.y = Math.sin( time * 0.5 ) * 40+20;
    light2.position.z = Math.sin( time * 0.7 ) * 30-100;

    light3.position.x = Math.sin( time * 0.7 ) * 30;
    light3.position.y = Math.cos( time * 0.3 ) * 40+20;
    light3.position.z = Math.sin( time * 0.5 ) * 30+100;

    light4.position.x = Math.sin( time * 0.3 ) * 30;
    light4.position.y = Math.cos( time * 0.7 ) * 40+20;
    light4.position.z = Math.sin( time * 0.5 ) * 30+100;

    water.material.uniforms[ 'time' ].value += 1.0 / 60.0;

    renderer.render(scene, camera);

    requestAnimationFrame(render);
}

function keyPressed(e){

    switch(e.key) {
      case 'ArrowUp':
            light5.intensity += 0.01;
            light.intensity += 0.005;
            break;
      case 'ArrowDown':
            light5.intensity -= 0.01;
            light.intensity -= 0.005;        
            break;
    }
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}



