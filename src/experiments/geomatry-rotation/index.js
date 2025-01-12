import { Vector3 } from "three";
import { getRelativeObject } from "/src/relativeObject.js";
import { run } from "/src/main.js";

const ro = [
  await getRelativeObject(
    "/src/assets/mol.gltf",
    new Vector3(2, 0, -0.3),
    new Vector3(-0.5, 0, 0),
    new Vector3(0, 0, 3),
    new Vector3(0.01 , 0.02, 0.01),
    new Vector3(0, 0, 0)
  ),
];

run(ro, () => {});
