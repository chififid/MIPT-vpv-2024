import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import { Vector3 } from "three";

export class Observer {
  constructor(camera, domElement) {
    this.controls = new PointerLockControls(camera, domElement);
    this.velocity = new Vector3(0, 0, 0);
    this.accelerationModule = 0.03;
    this.moveStep = 0.1;
    this.relativeObjects = [];
    this.isPaused = false;

    document.addEventListener("keydown", (event) => this.onKeyDown(event));
    domElement.addEventListener("click", () => {
      this.controls.lock();
    });
  }

  onKeyDown(event) {
    if (this.isPaused) {
      this.handlePauseMovement(event);
      return;
    }

    const lastVelocity = this.velocity.clone();

    switch (event.code) {
      case "KeyW":
        this.velocity.z -= this.accelerationModule;
        break;
      case "KeyS":
        this.velocity.z += this.accelerationModule;
        break;
      case "KeyA":
        this.velocity.x -= this.accelerationModule;
        break;
      case "KeyD":
        this.velocity.x += this.accelerationModule;
        break;
      case "KeyE":
        this.velocity.y += this.accelerationModule;
        break;
      case "KeyQ":
        this.velocity.y -= this.accelerationModule;
        break;
      case "KeyZ":
        this.velocity.copy(new Vector3(0, 0, 0));
        break;
    }

    if (this.velocity.length() >= 1) {
      this.velocity.copy(lastVelocity);
    }
  }

  handlePauseMovement(event) {
    const movement = new Vector3();

    switch (event.code) {
      case "KeyW":
        movement.z -= this.moveStep;
        break;
      case "KeyS":
        movement.z += this.moveStep;
        break;
      case "KeyA":
        movement.x -= this.moveStep;
        break;
      case "KeyD":
        movement.x += this.moveStep;
        break;
      case "KeyE":
        movement.y += this.moveStep;
        break;
      case "KeyQ":
        movement.y -= this.moveStep;
        break;
    }

    this.moveScene(movement);
  }

  moveScene(movement) {
    this.relativeObjects.forEach((obj) => {
      obj.setPosition(obj.position.clone().sub(movement));
    });
  }

  getRelativeVelocity(objectVelocity) {
    const u = this.velocity.clone();
    const v = objectVelocity.clone();

    const beta = u.length();
    const direction = u.clone().normalize();

    const vParallel = direction.clone().multiplyScalar(v.dot(direction));
    const vPerpendicular = v.clone().sub(vParallel);

    const parallelSign = Math.sign(v.dot(direction));
    const parallelMagnitude = vParallel.length();
    const transformedParallel = direction.multiplyScalar(
      (parallelMagnitude * parallelSign - beta) /
      (1 - beta * parallelMagnitude * parallelSign)
    );

    const gamma = 1 / Math.sqrt(1 - beta * beta);
    const transformedPerpendicular = vPerpendicular.multiplyScalar(1 / gamma);

    return transformedParallel.add(transformedPerpendicular);
  }

  setRealtiveObjects(val) {
    this.relativeObjects = val;
  }

  setPause(val) {
    this.isPaused = val;
  }

  getVelocity() {
    return this.velocity.clone();
  }

  getObject() {
    return this.controls.getObject();
  }
}

export function addObserver(scene, camera) {
  const observer = new Observer(camera, document.body);
  scene.add(observer.getObject());
  return observer;
}
