import { Vector3 } from "three";
import { getRelativeObject } from "/src/relativeObject.js";
import { run } from "/src/main.js";

const ro = [
  await getRelativeObject(
    "/src/assets/cube.gltf",
    new Vector3(0, 1, -5),
    new Vector3(0, 0, 0),
    new Vector3(0, 0, 0),
    new Vector3(0.6, 0.3, 0.3)
  ),
  await getRelativeObject(
    "/src/assets/cube.gltf",
    new Vector3(2, -1, -5),
    new Vector3(-0.707, 0, 0),
    new Vector3(0, 0, 0),
    new Vector3(0.6, 0.3, 0.3)
  ),
];

run(ro, () => {});
