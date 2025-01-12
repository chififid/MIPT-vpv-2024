import { Vector3 } from "three";
import { getRelativeObject } from "/src/relativeObject.js";
import { run } from "/src/main.js";

const ro = [
  await getRelativeObject(
    "/src/assets/cube.gltf",
    new Vector3(0, -2 , -3),
    new Vector3(0, 0.3, 0),
    new Vector3(1, 0, 0),
    new Vector3(0.3, 0.3, 0.3)
  ),
  await getRelativeObject(
    "/src/assets/cube.gltf",
    new Vector3(-1, 0, -3),
    new Vector3(0, 0, 0),
    new Vector3(1, 0, 0),
    new Vector3(0.3, 0.3, 0.3)
  ),
  await getRelativeObject(
    "/src/assets/cube.gltf",
    new Vector3(1, 0, -3),
    new Vector3(0, 0, 0),
    new Vector3(0.5, 0.2, 0.2),
    new Vector3(0.3, 0.3, 0.3)
  ),
];

run(ro, () => {});
