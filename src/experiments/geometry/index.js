import { Vector3 } from "three";
import { getRelativeObject } from "/src/relativeObject.js";
import { run } from "/src/main.js";

const ro = [
  await getRelativeObject(
    "/src/assets/wheel.gltf",
    new Vector3(0, 0, -1),
    new Vector3(0, 0, 0),
    new Vector3(0, 0, 0),
    new Vector3(0.1, 0.1, 0.1),
    new Vector3(Math.PI/2, 0, 0)
  ),
  await getRelativeObject(
    "/src/assets/head.gltf",
    new Vector3(1, 0, -1),
    new Vector3(0, 0, 0),
    new Vector3(0, 0, 0),
    new Vector3(0.1, 0.1, 0.1),
    new Vector3(0, 0, 0)
  ),
];

run(ro, () => {});
