import { Vector3 } from "three";
import { getRelativeObject } from "/src/relativeObject.js";
import { run } from "/src/main.js";

const ro = [
  await getRelativeObject(
    "/src/assets/city.gltf",
    new Vector3(-15, -5.8, -15),
    new Vector3(0, 0, 0),
    new Vector3(0, 0, 0),
    new Vector3(0.3, 0.3, 0.3),
    new Vector3(0, Math.PI, 0),
  ),
];

run(ro, () => {});
