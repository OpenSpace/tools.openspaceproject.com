import { convertXmlToJson } from "./helper";
import { Sgct as config } from "./sgct";
import { validate } from "jsonschema";
import schema from "./sgct.schema.json";


/**
 * Rename the oldKey into newKey for the obj. If the key does not exist, no action is
 * performed.
 */
function rename(obj: object, oldKey: string, newKey: string) {
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
function toString(obj: object, key: string) {
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
function toNumber(obj: object, key: string) {
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
function toBoolean(obj: object, key: string) {
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
function toVec2(obj: object, key: string) {
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
function toVec3(obj: object, key: string) {
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
function toMat4(obj: object, key: string) {
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
function toObject(obj: object, key: string) {
  if (!(key in obj))  return;
  let val = (obj as any)[key];
  if (typeof val !== "object")  throw `Wrong type for key ${key}`;
  if (val.length !== 1)  throw `Wrong length ${val.length} for key ${key}`;

  (obj as any)[key] = val[0];
}



function convert(obj: any): config {
  // The current data version
  const CurrentVersion = 1;


  if ("version" in obj && obj.version == CurrentVersion) {
    // We are at the most recent version already
    return obj;
  }


  // If the version key doesn't exist, we assume that we were handed an XML file that
  // didn't have the version information in it
  if (!("version" in obj)) {
    obj.version = CurrentVersion;

    rename(obj, "masterAddress", "masteraddress");
    toString(obj, "masteraddress");

    rename(obj, "setThreadAffinity", "threadaffinity");
    toNumber(obj, "threadaffinity");

    rename(obj, "debugLog", "debuglog");
    toBoolean(obj, "debuglog");

    rename(obj, "externalControlPort", "externalcontrolport");
    toNumber(obj, "externalcontrolport");

    rename(obj, "firmSync", "firmsync");
    toBoolean(obj, "firmsync");

    rename(obj, "Scene", "scene");
    toObject(obj, "scene");
    if ("scene" in obj) {
      rename(obj.scene, "Offset", "offset");
      toVec3(obj.scene, "offset");

      rename(obj.scene, "Orientation", "orientation");
      toObject(obj.scene, "orientation");
      if ("orientation" in obj.scene) {
        Object.keys(obj.scene.orientation).forEach((key, _) => {
          toNumber(obj.scene.orientation, key);
        });
      }

      rename(obj.scene, "Scale", "scale");
      if ("scale" in obj.scene) {
        obj.scene.scale = obj.scene.scale[0].value;
        toNumber(obj.scene, "value");
      }
      rename(obj.scene, "Scale", "scale");
      toNumber(obj.scene, "scale");
    }

    rename(obj, "User", "users");
    if ("users" in obj) {
      obj.users.forEach((user: any) => {
        toString(user, "name");

        rename(user, "eyeSeparation", "eyeseparation");
        toNumber(user, "eyeseparation");

        rename(user, "Pos", "pos");
        toVec3(user, "pos");

        rename(user, "Orientation", "orientation");
        toObject(user, "orientation");
        if ("orientation" in user) {
          Object.keys(user.orientation).forEach((key: any) => {
            toNumber(user.orientation, key);
          });
        }

        rename(user, "Matrix", "matrix");
        toMat4(user, "matrix");

        rename(user, "Tracking", "tracking");
        toObject(user, "tracking");
        if ("tracking" in user) {
          Object.keys(user.tracking).forEach((key: any) => {
            toString(user.tracking, key);
          });
        }
      });
    }

    rename(obj, "Settings", "settings");
    toObject(obj, "settings");
    if ("settings" in obj) {
      rename(obj.settings, "DepthBufferTexture", "depthbuffertexture");
      toBoolean(obj.settings, "depthbuffertexture");

      rename(obj.settings, "NormalTexture", "normaltexture");
      toBoolean(obj.settings, "normaltexture");

      rename(obj.settings, "PositionTexture", "positiontexture");
      toBoolean(obj.settings, "positiontexture");

      rename(obj.settings, "Precision", "precision");
      toNumber(obj.settings, "precision");

      rename(obj.settings, "Display", "display");
      toObject(obj.settings, "display");
      if ("display" in obj.settings) {
        rename(obj.settings.display, "swapInterval", "swapinterval");
        toNumber(obj.settings.display, "swapinterval");

        rename(obj.settings.display, "refreshRate", "refreshrate");
        toNumber(obj.settings.display, "refreshrate");
      }
    }

    rename(obj, "Capture", "capture");
    toObject(obj, "capture");
    if ("capture" in obj) {
      toString(obj.capture, "path");

      toString(obj.capture, "format");

      rename(obj.capture, "range-begin", "rangebegin");
      toNumber(obj.capture, "rangebegin");

      rename(obj.capture, "range-end", "rangeend");
      toNumber(obj.capture, "rangeend");
    }

    rename(obj, "Tracker", "trackers");
    if ("trackers" in obj) {
      obj.trackers.forEach((tracker: any) => {
        toString(tracker, "name");

        rename(tracker, "Device", "devices");
        if ("devices" in tracker) {
          tracker.devices.forEach((device: any) => {
            toString(device, "name");

            rename(device, "Sensor", "sensors");
            if ("sensors" in device) {
              device.sensors.forEach((sensor: any) => {
                rename(sensor, "vrpnAddress", "vrpnaddress");
                toString(sensor, "vrpnaddress");

                toNumber(sensor, "id");
              });
            }

            rename(device, "Buttons", "buttons");
            if ("buttons" in device) {
              device.buttons.forEach((button: any) => {
                rename(button, "vrpnAddress", "vrpnaddress");
                toString(button, "vrpnaddress");

                toNumber(button, "count");
              });
            }

            rename(device, "Axes", "axes");
            if ("axes" in device) {
              device.axes.forEach((axis: any) => {
                rename(axis, "vrpnAddress", "vrpnaddress");
                toString(axis, "vrpnaddress");

                toNumber(axis, "count");
              });
            }

            rename(device, "Offset", "offset");
            toVec3(device, "offset");

            rename(device, "Orientation", "orientation");
            toObject(device, "orientation");
            if ("orientation" in device) {
              Object.keys(device.orientation).forEach((key: any) => {
                toNumber(device.orientation, key);
              });
            }

            rename(device, "Matrix", "matrix");
            toMat4(device, "matrix");
          });
        }

        rename(tracker, "Offset", "offset");
        toVec3(tracker, "offset");

        rename(tracker, "Orientation", "orientation");
        toObject(tracker, "orientation");
        if ("orientation" in tracker) {
          Object.keys(tracker.orientation).forEach((key: any) => {
            toNumber(tracker.orientation, key);
          });
        }

        rename(tracker, "Scale", "scale");
        toNumber(tracker, "scale");

        rename(tracker, "Matrix", "matrix");
        toMat4(tracker, "matrix");
      });
    }

    rename(obj, "Node", "nodes");
    obj.nodes.forEach((node: any) => {
      rename(node, "ip", "address");
      toString(node, "address");

      toNumber(node, "port");

      rename(node, "dataTransferPort", "datatransferport");
      toNumber(node, "datatransferport");

      rename(node, "swapLock", "swaplock");
      toBoolean(node, "swaplock");

      rename(node, "Window", "windows");
      node.windows.forEach((window: any) => {
        toNumber(window, "id");
        toString(window, "name");

        // tags change from "abc,bcd,cde" -> [ "abc", "bcd", "cde"]
        toString(window, "tags");
        if ("tags" in window) {
          window.tags = window.tags.split(",");
        }

        rename(window, "bufferBitDepth", "bufferbitdepth");
        toString(window, "bufferbitdepth");

        rename(window, "fullScreen", "fullscreen");
        toBoolean(window, "fullscreen");

        toBoolean(window, "autoiconify");

        rename(window, "hideMouseCursor", "hidemousecursor");
        toBoolean(window, "hidemousecursor");

        toBoolean(window, "floating");

        rename(window, "alwaysRender", "alwaysrender");
        toBoolean(window, "alwaysrender");

        toBoolean(window, "hidden");

        rename(window, "dbuffered", "doublebuffered");
        toBoolean(window, "doublebuffered");

        rename(window, "numberOfSamples", "msaa");
        toNumber(window, "msaa");

        toBoolean(window, "alpha");

        toBoolean(window, "fxaa");

        rename(window, "decorated", "border");
        toBoolean(window, "border");

        toBoolean(window, "mirror");

        rename(window, "draw2D", "draw2d");
        toBoolean(window, "draw2d");

        rename(window, "draw3D", "draw3d");
        toBoolean(window, "draw3d");

        rename(window, "blitWindowId", "blitwindowid");
        toNumber(window, "blitwindowid");

        toNumber(window, "monitor");

        toString(window, "mpcdi");

        // The stereo value was stored as the "type" parameter before, but we can compress
        // that value down
        rename(window, "Stereo", "stereo");
        if ("stereo" in window) {
          window.stereo = window.stereo[0].type;
          toString(window, "stereo");
        }

        rename(window, "Pos", "pos");
        toVec2(window, "pos");

        rename(window, "Size", "size");
        toVec2(window, "size");

        rename(window, "Res", "res");
        toVec2(window, "res");

        rename(window, "Viewport", "viewports");
        window.viewports.forEach((viewport: any) => {
          toString(viewport, "user");

          toString(viewport, "overlay");

          rename(viewport, "mask", "blendmask")
          rename(viewport, "BlendMask", "blendmask");
          toString(viewport, "blendmask");

          rename(viewport, "BlackLevelMask", "blacklevelmask");
          toString(viewport, "blacklevelmask");

          toString(viewport, "mesh");

          toBoolean(viewport, "tracked");

          toString(viewport, "eye");

          rename(viewport, "Pos", "pos");
          toVec2(viewport, "pos");

          rename(viewport, "Size", "size");
          toVec2(viewport, "size");

          // This value used to be supported, but is not even support in XML anymore, so
          // we can just remove it altogether
          if ("name" in viewport) {
            delete viewport.name;
          }

          if ("PlanarProjection" in viewport) {
            rename(viewport, "PlanarProjection", "projection");
            toObject(viewport, "projection");
            viewport.projection.type = "PlanarProjection";

            // FOV -> fov
            rename(viewport.projection, "FOV", "fov");
            toObject(viewport.projection, "fov");
            if ("fov" in viewport.projection) {
              Object.keys(viewport.projection.fov).forEach((key, _) => {
                toNumber(viewport.projection.fov, key);
              });

              if (viewport.projection.fov.left === viewport.projection.fov.right) {
                viewport.projection.fov.hfov =
                  viewport.projection.fov.left + viewport.projection.fov.right;

                delete viewport.projection.fov.left;
                delete viewport.projection.fov.right;
              }

              if (viewport.projection.fov.down === viewport.projection.fov.up) {
                viewport.projection.fov.vfov =
                  viewport.projection.fov.down + viewport.projection.fov.up;

                delete viewport.projection.fov.down;
                delete viewport.projection.fov.up;
              }
            }

            // Orientation -> orientation
            rename(viewport.projection, "Orientation", "orientation");
            toObject(viewport.projection, "orientation");
            if ("orientation" in viewport.projection) {
              Object.keys(viewport.projection.orientation).forEach((key, _) => {
                toNumber(viewport.projection.orientation, key);
              });

              rename(viewport.projection.orientation, "heading", "yaw");
              rename(viewport.projection.orientation, "azimuth", "yaw");
              rename(viewport.projection.orientation, "elevation", "pitch");
              rename(viewport.projection.orientation, "bank", "roll");
            }

            // Offset -> offset
            rename(viewport.projection, "Offset", "offset");
            toObject(viewport.projection, "offset");
            if ("offset" in viewport.projection) {
              Object.keys(viewport.projection.offset).forEach((key, _) => {
                toNumber(viewport.projection.offset, key);
              });
            }
          }
          else if ("FisheyeProjection" in viewport) {
            rename(viewport, "FisheyeProjection", "projection");
            toObject(viewport, "projection");
            viewport.projection.type = "FisheyeProjection";

            toNumber(viewport.projection, "fov");
            toString(viewport.projection, "quality");
            toString(viewport.projection, "interpolation");
            toNumber(viewport.projection, "diameter");
            toNumber(viewport.projection, "tilt");

            // Crop -> crop
            rename(viewport.projection, "Crop", "crop");
            toObject(viewport.projection, "crop");
            if ("crop" in viewport.projection) {
              Object.keys(viewport.projection.crop).forEach((key, _) => {
                toNumber(viewport.projection.crop, key);
              });
            }

            rename(viewport.projection, "keepAspectRatio", "keepaspectratio");
            toBoolean(viewport.projection, "keepaspectratio");

            // Offset -> offset
            rename(viewport.projection, "Offset", "offset");
            toVec3(viewport.projection, "offset");

            // Background -> background
            rename(viewport.projection, "Background", "background");
            toObject(viewport.projection, "background");
            if ("background" in viewport.projection) {
              Object.keys(viewport.projection.background).forEach((key, _) => {
                toNumber(viewport.projection.background, key);
              });
            }
          }
          else if ("SphericalMirrorProjection" in viewport) {
            rename(viewport, "SphericalMirrorProjection", "projection");
            toObject(viewport, "projection");
            viewport.projection.type = "SphericalMirrorProjection";

            toString(viewport.projection, "quality");
            toNumber(viewport.projection, "tilt");

            // Background -> background
            rename(viewport.projection, "Background", "background");
            toObject(viewport.projection, "background");
            if ("background" in viewport.projection) {
              Object.keys(viewport.projection.background).forEach((key, _) => {
                toNumber(viewport.projection.background, key);
              });
            }

            // Geometry -> geometry
            rename(viewport.projection, "Geometry", "geometry");
            toObject(viewport.projection, "geometry");
            if ("geometry" in viewport.projection) {
              Object.keys(viewport.projection.geometry).forEach((key, _) => {
                toString(viewport.projection.geometry, key);
              });
            }
          }
          else if ("SpoutOutputProjection" in viewport) {
            rename(viewport, "SpoutOutputProjection", "projection");
            toObject(viewport, "projection");
            viewport.projection.type = "SpoutOutputProjection";

            toString(viewport.projection, "quality");
            toNumber(viewport.projection, "tilt");
            toString(viewport.projection, "mapping");
            rename(viewport.projection, "mappingSpoutName", "mappingspoutname");
            toString(viewport.projection, "mappingspoutname");

            // Background -> background
            rename(viewport.projection, "Background", "background");
            toObject(viewport.projection, "background");
            if ("background" in viewport.projection) {
              Object.keys(viewport.projection.background).forEach((key, _) => {
                toNumber(viewport.projection.background, key);
              });
            }

            // Channels -> channels
            rename(viewport.projection, "Channels", "channels");
            toObject(viewport.projection, "channels");
            if ("channels" in viewport.projection) {
              rename(viewport.projection.channels, "Right", "right")
              toBoolean(viewport.projection.channels, "right")

              rename(viewport.projection.channels, "zLeft", "zleft");
              toBoolean(viewport.projection.channels, "zleft");

              rename(viewport.projection.channels, "Bottom", "bottom");
              toBoolean(viewport.projection.channels, "bottom");

              rename(viewport.projection.channels, "Top", "top");
              toBoolean(viewport.projection.channels, "top");

              rename(viewport.projection.channels, "Left", "left");
              toBoolean(viewport.projection.channels, "left");

              rename(viewport.projection.channels, "zRight", "zright");
              toBoolean(viewport.projection.channels, "zright");
            }

            // RigOrientation -> orientation
            rename(viewport.projection, "RigOrientation", "orientation");
            toObject(viewport.projection, "orientation");
            if ("orientation" in viewport.projection) {
              Object.keys(viewport.projection.orientation).forEach((key, _) => {
                toNumber(viewport.projection.orientation, key);
              });
            }
          }
          else if ("CylindricalProjection" in viewport) {
            rename(viewport, "CylindricalProjection", "projection");
            toObject(viewport, "projection");
            viewport.projection.type = "CylindricalProjection";

            toString(viewport.projection, "quality");
            toNumber(viewport.projection, "tilt");

            toNumber(viewport.projection, "rotation");
            rename(viewport.projection, "heightOffset", "heightoffset");
            toNumber(viewport.projection, "heightoffset");
            toNumber(viewport.projection, "radius");
          }
          else if ("EquirectangularProjection" in viewport) {
            rename(viewport, "EquirectangularProjection", "projection");
            toObject(viewport, "projection");
            viewport.projection.type = "EquirectangularProjection";

            toString(viewport.projection, "quality");
            toNumber(viewport.projection, "tilt");

            // rename and set type
            rename(viewport, "EquirectangularProjection", "projection");
            viewport.projection.type = "EquirectangularProjection";
          }
          else if ("Projectionplane" in viewport) {
            rename(viewport, "Projectionplane", "projection");
            toObject(viewport, "projection");
            viewport.projection.type = "ProjectionPlane";

            viewport.projection.lowerleft = viewport.projection.Pos[0];
            Object.keys(viewport.projection.lowerleft).forEach((key, _) => {
              toNumber(viewport.projection.lowerleft, key);
            });

            viewport.projection.upperleft = viewport.projection.Pos[1];
            Object.keys(viewport.projection.upperleft).forEach((key, _) => {
              toNumber(viewport.projection.upperleft, key);
            });

            viewport.projection.upperright = viewport.projection.Pos[2];
            Object.keys(viewport.projection.upperright).forEach((key, _) => {
              toNumber(viewport.projection.upperright, key);
            });

            delete viewport.projection.Pos;
          }
        });
      });
    });
  }

  return obj;
}


/**
 * Function to convert any SGCT configuration file into the newest file format.
 * It will automatically detect what the source version is.
 *
 * @param content The content to be converted
 * @param extension The extension of the file from which the content came
 * @returns The converted files
 */
export async function convertFile(content: string, extension: string): Promise<string> {
  let converted = {};

  if (extension === ".xml") {
    let obj = await convertXmlToJson(content);
    converted = convert(obj);
  }
  else {
    // Nothing to do now
  }


  // Check the result against the JSON schema that we have
  let result = validate(converted, schema);
  if (!result.valid) {
    alert(result.toString());
  }

  let convertedContent = JSON.stringify(converted, null, 2);
  return convertedContent;
}
