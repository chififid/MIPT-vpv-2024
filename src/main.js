import * as THREE from "three";

import { initScene } from "/src/init.js";
import { addObserver } from "/src/observer.js";
import { createVelocityDisplay, createSimulationControls } from "/src/ui.js";

export function run(relativeObjects, animationCallback) {
  const { scene, camera, renderer } = initScene();
  const observer = addObserver(scene, camera);
  const velocityDisplay = createVelocityDisplay();

  let isPaused = false;
  let timeScale = 1.0;

  createSimulationControls((value) => {
    timeScale = value;
  });

  document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
      isPaused = !isPaused;
      observer.setPause(isPaused);
    }
  });

  const clock = new THREE.Clock();
  function animate() {
    let dt = clock.getDelta() * timeScale;

    if (isPaused) {
      dt = 0;
    }

    velocityDisplay.update(observer.getVelocity());
    relativeObjects.map((obj) => {
      obj.update(dt, (vel) => observer.getRelativeVelocity(vel));
    });

    animationCallback(dt);
    renderer.render(scene, camera);
  }

  async function init() {
    relativeObjects.forEach((obj) => {
      scene.add(obj.getObject());
      scene.add(obj.getMarker());
    });
    observer.setRealtiveObjects(relativeObjects);
    renderer.setAnimationLoop(animate);
  }

  init();
}
