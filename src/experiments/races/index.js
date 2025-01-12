import { Vector3 } from "three";
import { getRelativeObject } from "/src/relativeObject.js";
import { run } from "/src/main.js";

const ro = [
  await getRelativeObject(
    "/src/assets/plane.gltf",
    new Vector3(0, -0.3, 0),
    new Vector3(0, 0, 0),
    new Vector3(0, 0, 0),
    new Vector3(100, 0.1, 100)
  ), 
  await getRelativeObject(
    "/src/assets/car.gltf",
    new Vector3(-0.5, -0.16, 0),
    new Vector3(0, 0, -0.3),
    new Vector3(0, 0, 0),
    new Vector3(0.1, 0.1, 0.1)
  ),
  await getRelativeObject(
    "/src/assets/car.gltf",
    new Vector3(.5, -0.16, 0),
    new Vector3(0, 0, 0),
    new Vector3(0, 0, 0),
    new Vector3(0.1, 0.1, 0.1)
  ),
  await getRelativeObject(
    "/src/assets/car.gltf",
    new Vector3(.5, -0.16, -2),
    new Vector3(0, 0, -0.1),
    new Vector3(0, 0, 0),
    new Vector3(0.1, 0.1, 0.1)
  ),
  await getRelativeObject(
    "/src/assets/car.gltf",
    new Vector3(-.8, -0.16, 2),
    new Vector3(0, 0, -0.9),
    new Vector3(0, 0, 0),
    new Vector3(0.1, 0.1, 0.1)
  ),
];

run(ro, () => {});
