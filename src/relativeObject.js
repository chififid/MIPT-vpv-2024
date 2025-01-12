import * as THREE from "three";
import { Vector3 } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export class RelativeObject {
  constructor(
    obj,
    position = new Vector3(0, 0, 0),
    velocity = new Vector3(0, 0, 0),
    angVelocity = new Vector3(0, 0, 0),
    scale = new Vector3(1, 1, 1),
  ) {
    const centerdObj = obj.clone();
    сenterObj(centerdObj);

    this.object = centerdObj;
    this.projObject = centerdObj.clone();
    this.projObject.children[0].geometry =
      centerdObj.children[0].geometry.clone();

    this.scale = scale.clone();
    this.position = position.clone();
    this.velocity = velocity.clone();
    this.angVelocity = angVelocity.clone();

    this.marker = this.createMarker();
  }

  static loadFromGltf(modelPath) {
    return new Promise((resolve, reject) => {
      const loader = new GLTFLoader();
      loader.load(
        modelPath,
        (gltf) => {
          resolve(new RelativeObject(gltf.scene));
        },
        undefined,
        (error) => reject(error)
      );
    });
  }

  createMarker() {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = 256;
    canvas.height = 128;

    context.fillStyle = "white";
    context.font = "12px Arial";
    context.textAlign = "center";

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(2, 1, 1);
    return sprite;
  }

  updateMarkerText(gamma, relVelLength, dimensions) {
    const canvas = this.marker.material.map.image;
    const context = canvas.getContext("2d");

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillText(`Gamma: ${gamma.toFixed(2)}`, canvas.width / 2, 90);
    context.fillText(`RelVel: ${relVelLength.toFixed(2)}`, canvas.width / 2, 105);
    context.fillText(`Dims: ${dimensions.x.toFixed(2)}x${dimensions.y.toFixed(2)}x${dimensions.z.toFixed(2)}`, canvas.width / 2, 120);

    this.marker.material.map.needsUpdate = true;
  }

  update(dt, getObserverVelocity) {
    // Геометрии (точки в системах отсчета)
    const localGeometry = this.object.children[0].geometry;
    const projGeometry = this.projObject.children[0].geometry;

    // Значения
    const relVel = getObserverVelocity(this.velocity);
    const gamma = 1 / Math.sqrt(1 - relVel.lengthSq());

    // Перемещаем центр масс
    const dx = relVel.clone().multiplyScalar(dt);
    this.position.add(dx);

    // Преобразуем точки в глобальную систему наблюдателя с помощью преобразований Лоренца
    const vertices = localGeometry.attributes.position.array;
    for (let i = 0; i < vertices.length; i += 3) {
      const localPoint = new THREE.Vector3(
        vertices[i],
        vertices[i + 1],
        vertices[i + 2]
      );

      const transformedPoint = this.lorentzTransform(
        dt,
        localPoint,
        relVel,
        this.angVelocity,
        gamma
      );

      transformedPoint.add(this.position);
      projGeometry.attributes.position.setXYZ(
        i / 3,
        transformedPoint.x,
        transformedPoint.y,
        transformedPoint.z
      );
    }

    projGeometry.attributes.position.needsUpdate = true;
    projGeometry.computeBoundingSphere();
    projGeometry.computeVertexNormals();

    // Обновляем локальное перемещение точек
    const localDt = dt / gamma;
    const localRotAngle = this.angVelocity.length() * localDt;
    const localRotAxis = this.angVelocity.clone().normalize();

    const rotationMatrix = new THREE.Matrix4().makeRotationAxis(
      localRotAxis,
      localRotAngle
    );
    localGeometry.applyMatrix4(rotationMatrix);

    // Рассчитываем размеры объекта в системе отсчета наблюдателя
    projGeometry.computeBoundingBox();
    const boundingBox = projGeometry.boundingBox;
    const dimensions = new THREE.Vector3();
    boundingBox.getSize(dimensions);

    // Обновляем текст маркера
    this.updateMarkerText(gamma, relVel.length(), dimensions);
    this.updateMarkerPos();
  }

  updateMarkerPos() {
    this.marker.position.copy(this.position.clone().add(new Vector3(0, 2.5 * this.scale.y, 0)));
  }

  lorentzTransform(dt, lastPoint, vel, angVel, gamma) {
    const velMod = vel.length();
    const direction = vel.clone().normalize();

    const lastXParallel = direction.dot(lastPoint);
    const dv = angVel.clone().multiply(lastPoint);
    const localDt =
      (dt + velMod * lastXParallel * gamma) /
      (gamma * (1 - vel.dot(dv)));
    const point = lastPoint.clone().add(dv.clone().multiplyScalar(localDt));

    const xParallel = direction.dot(point);
    const xPerpendicular = point
      .clone()
      .sub(direction.clone().multiplyScalar(xParallel));

    const transformedParallel = gamma * (xParallel - velMod * localDt);
    const transformedPoint = xPerpendicular
      .clone()
      .add(direction.multiplyScalar(transformedParallel));

    return transformedPoint;
  }

  setPosition(newPosition) {
    this.position.copy(newPosition);
  }

  setVelocity(newVelocity) {
    this.velocity.copy(newVelocity);
  }

  setAngVelocity(newAngVelocity) {
    this.angVelocity.copy(newAngVelocity);
  }

  setScale(newScale) {
    const geometry = this.object.children[0].geometry;
    geometry.scale(newScale.x, newScale.y, newScale.z);
    geometry.attributes.position.needsUpdate = true;
    geometry.computeBoundingSphere();
    geometry.computeVertexNormals();
    this.marker.scale.set(newScale.y * 4, newScale.y * 2, newScale.y * 2);
    this.scale.copy(newScale);
  }

  rotate(newRotation) {
    const geometry = this.object.children[0].geometry;
    geometry.rotateX(newRotation.x);
    geometry.rotateY(newRotation.y);
    geometry.rotateZ(newRotation.z);
    geometry.attributes.position.needsUpdate = true;
    geometry.computeBoundingSphere();
    geometry.computeVertexNormals();
  }

  getObject() {
    return this.projObject;
  }

  getMarker() {
    return this.marker;
  }
}

export function getRelativeObject(
  modelPath,
  initialPosition = new Vector3(0, 0, 0),
  initialVelocity = new Vector3(0, 0, 0),
  initialAngVelocity = new Vector3(0, 0, 0),
  initialScale = new Vector3(1, 1, 1),
  initialAng = new Vector3(0, 0, 0),
) {
  return RelativeObject.loadFromGltf(modelPath).then((relativeObject) => {
    relativeObject.setPosition(initialPosition);
    relativeObject.setVelocity(initialVelocity);
    relativeObject.setAngVelocity(initialAngVelocity);
    relativeObject.setScale(initialScale);
    relativeObject.rotate(initialAng);
    return relativeObject;
  });
}

function сenterObj(object) {
  const geometry = object.children[0].geometry;
  geometry.computeBoundingBox();
  const center = new THREE.Vector3();
  geometry.boundingBox.getCenter(center);
  geometry.translate(-center.x, -center.y, -center.z);
}
