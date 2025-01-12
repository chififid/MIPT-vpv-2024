import * as THREE from "three";

export function initScene(fov) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(fov);
  const renderer = new THREE.WebGLRenderer();
  document.body.appendChild(renderer.domElement);

  setSceneSizes(camera, renderer);

  const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1); // Цвет сверху и снизу
  hemisphereLight.position.set(0, 20, 0); // Расположим свет сверху
  scene.add(hemisphereLight);

  const sunLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
  sunLight1.position.set(10, 10, 10);
  scene.add(sunLight1);
  
  const sunLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
  sunLight2.position.set(-10, 10, 10);
  scene.add(sunLight2);
  
  const sunLight3 = new THREE.DirectionalLight(0xffffff, 0.3);
  sunLight3.position.set(0, -10, -10);
  scene.add(sunLight3);


  const worldLight = new THREE.AmbientLight(0x333333);
  scene.add(worldLight);

  return { scene, camera, renderer };
}

function setSceneSizes(camera, renderer) {
  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener('resize', onResize, false);
  onResize();
}

// Функция для создания градиентного фона
function createGradientTexture(topColor, bottomColor) {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 256;

  const context = canvas.getContext('2d');
  const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, `#${topColor.toString(16)}`); // Верхний цвет
  gradient.addColorStop(1, `#${bottomColor.toString(16)}`); // Нижний цвет

  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  return texture;
}
