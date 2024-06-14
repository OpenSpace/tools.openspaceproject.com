/**
 * Rename the oldKey into newKey for the obj. If the key does not exist, no action is
 * performed.
 */
export function rename(obj: object, oldKey: string, newKey: string) {
  console.assert(oldKey !== newKey);

  // Check if the old key exists in the object
  let prop = Object.getOwnPropertyDescriptor(obj, oldKey);
  if (!prop)  return;

  // Copy the property to the new key
  Object.defineProperty(obj, newKey, prop);

  // and remove the old key
  delete (obj as any)[oldKey];
}

/**
 * Converts the value stored in the key into a string. The value stored at the key must be
 * an object itself.
 *
 * ```
 * let obj = {
 *   key: {
 *     0: 1.0
 *   }
 * }
 * let r = toString(obj, "key");
 * console.assert(r.key === "1.0");
 */
export function toString(obj: object, key: string) {
  if (!(key in obj))  return;
  let val = (obj as any)[key];
  if (typeof val !== "object")  throw `Wrong type for key ${key}`;
  if (val.length !== 1)  throw `Wrong length ${val.length} for key ${key}`;

  (obj as any)[key] = String(val[0]);
}

/**
 * Converts the value stored in the key into a number. The value stored at the key must be
 * an object itself.
 *
 * ```
 * let obj = {
 *   key: {
 *     0: "1.0"
 *   }
 * }
 * let r = toNumber(obj, "key");
 * console.assert(r.key === 1.0);
 */
export function toNumber(obj: object, key: string) {
  if (!(key in obj))  return;
  let val = (obj as any)[key];
  if (typeof val !== "object")  throw `Wrong type for key ${key}`;
  if (val.length !== 1)  throw `Wrong length ${val.length} for key ${key}`;

  (obj as any)[key] = Number(val[0]);
}

/**
 * Converts the value stored in the key into a boolean. The value stored at the key must
 * be an object itself.
 *
 * ```
 * let obj = {
 *   key: {
 *     0: "true"
 *   }
 * }
 * let r = toBoolean(obj, "key");
 * console.assert(r.key);
 */
export function toBoolean(obj: object, key: string) {
  if (!(key in obj))  return;
  let val = (obj as any)[key];
  if (typeof val !== "object")  throw `Wrong type for key ${key}`;
  if (val.length !== 1)  throw `Wrong length ${val.length} for key ${key}`;

  (obj as any)[key] = (val[0] === "true");
}

/**
 * Converts the object contained at the key into a new object containing the keys `x` and
 * `y`.
 *
 * ```
 * let obj = {
 *   key: {
 *     0: { x: 1.0, y: 2.0 }
 *   }
 * }
 * let r = toVec2(obj, "key");
 * console.assert(r.key.x === 1.0);
 * console.assert(r.key.y === 2.0);
 */
export function toVec2(obj: object, key: string) {
  if (!(key in obj))  return;
  let val = (obj as any)[key];
  if (typeof val !== "object")  throw `Wrong type for key ${key}`;
  if (val.length !== 1)  throw `Wrong length ${val.length} for key ${key}`;

  (obj as any)[key] = {
    x: Number(val[0]["x"]),
    y: Number(val[0]["y"])
  }
}

/**
 * Converts the object contained at the key into a new object containing the keys `x`,
 * `y`, and `z`.
 *
 * ```
 * let obj = {
 *   key: {
 *     0: { x: 1.0, y: 2.0, z: 3.0 }
 *   }
 * }
 * let r = toVec3(obj, "key");
 * console.assert(r.key.x === 1.0);
 * console.assert(r.key.y === 2.0);
 * console.assert(r.key.z === 3.0);
 */
export function toVec3(obj: object, key: string) {
  if (!(key in obj))  return;
  let val = (obj as any)[key];
  if (typeof val !== "object")  throw `Wrong type for key ${key}`;
  if (val.length !== 1)  throw `Wrong length ${val.length} for key ${key}`;

  (obj as any)[key] = {
    x: Number(val[0]["x"]),
    y: Number(val[0]["y"]),
    z: Number(val[0]["z"])
  }
}

/**
 * Converts the object contained at the key into a new object containing the keys `x0`,
 * `x1`, `x2`, `x3`, `y0`, ..., `w2`, `w3`. The resulting object has all of the values in
 * an array.
 *
 * ```
 * let obj = {
 *   key: {
 *     0: {
 *       x0:  1.0, x1:  2.0, x2:  3.0, x3:  4.0,
 *       y0:  5.0, y1:  6.0, y2:  7.0, y3:  8.0,
 *       z0:  9.0, z1: 10.0, z2: 11.0, z3: 12.0,
 *       w0: 13.0, w1: 14.0, w2: 15.0, w3: 16.0
 *     }
 *   }
 * }
 * let r = toMat4(obj, "key");
 * console.assert(
 *   r.key === {
 *      1.0,  2.0,  3.0,
 *      4.0,  5.0,  6.0,
 *      7.0,  8.0,  9.0,
 *     10.0, 11.0, 12.0,
 *     13.0, 14.0, 15.0
 *   });
 */
export function toMat4(obj: object, key: string) {
  if (!(key in obj))  return;
  let val = (obj as any)[key];
  if (typeof val !== "object")  throw `Wrong type for key ${key}`;
  if (val.length !== 1)  throw `Wrong length ${val.length} for key ${key}`;

  let vs = val[0];

  let values = [];
  toBoolean(obj, "transpose");
  if ((obj as any)["transpose"]) {
    values = [
      Number(vs.x0), Number(vs.x1), Number(vs.x2), Number(vs.x3),
      Number(vs.y0), Number(vs.y1), Number(vs.y2), Number(vs.y3),
      Number(vs.z0), Number(vs.z1), Number(vs.z2), Number(vs.z3),
      Number(vs.w0), Number(vs.w1), Number(vs.w2), Number(vs.w3)
    ];
  }
  else {
    values = [
      Number(vs.x0), Number(vs.y0), Number(vs.z0), Number(vs.w0),
      Number(vs.x1), Number(vs.y1), Number(vs.z1), Number(vs.w1),
      Number(vs.x2), Number(vs.y2), Number(vs.z2), Number(vs.w2),
      Number(vs.x3), Number(vs.y3), Number(vs.z3), Number(vs.w3)
    ];
  }
  (obj as any)[key] = values;
}

/**
 * Converts the object contained at the key into a new object.
 *
 * ```
 * let obj2 = { ... }
 * let obj = {
 *   key: {
 *     0: obj2
 *   }
 * }
 * let r = toObject(obj, "key");
 * console.assert(r.key === obj2);
 */
export function toObject(obj: object, key: string) {
  if (!(key in obj))  return;
  let val = (obj as any)[key];
  if (typeof val !== "object")  throw `Wrong type for key ${key}`;
  if (val.length !== 1)  throw `Wrong length ${val.length} for key ${key}`;

  (obj as any)[key] = val[0];
}

