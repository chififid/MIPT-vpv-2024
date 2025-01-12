function update(dt, getObserverVelocity) {
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

  // Обновляем локальное перемещение точек
  const localDt = dt / gamma;
  const localRotAngle = this.angVelocity.length() * localDt;
  const localRotAxis = this.angVelocity.clone().normalize();

  const rotationMatrix = new THREE.Matrix4().makeRotationAxis(
    localRotAxis,
    localRotAngle
  );
  localGeometry.applyMatrix4(rotationMatrix);
}

function lorentzTransform(dt, lastPoint, vel, angVel, gamma) {
  const velMod = vel.length();
  const direction = vel.clone().normalize();

  const lastXParallel = direction.dot(lastPoint);
  const dv = angVel.clone().multiply(lastPoint);
  const localDt =
    (dt + velMod * lastXParallel * gamma) / (gamma * (1 - vel.dot(dv)));
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
