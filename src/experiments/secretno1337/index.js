import { Vector3 } from "three";
import { getRelativeObject } from "/src/relativeObject.js";
import { run } from "/src/main.js";

const ro = [
  await getRelativeObject(
    "/src/assets/secretno1337.gltf",
    new Vector3(-5 , 0, -8),
    new Vector3(0.5, 0, -0.2),
    new Vector3(0.3, 0.6, 0),
    new Vector3(1, 1, 1),
    new Vector3(0, 0, 0),
  ),
];

run(ro, () => {});
