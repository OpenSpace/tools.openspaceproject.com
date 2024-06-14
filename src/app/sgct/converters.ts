import { convertXmlToJson } from "./helper";
import { Sgct as config } from "./sgct";
import { validate } from "jsonschema";
import { rename, toBoolean, toMat4, toNumber, toObject, toString, toVec2,
  toVec3 } from "./converter_helpers";
import schema from "./sgct.schema.json";




function convertVersion(obj: any): config {
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

function convertFromMpcdi(obj: any): config {
  // The current data version
  const CurrentVersion = 1;

  obj.version = CurrentVersion;
  obj["masteraddress"] = "DSHOST";
  obj["firmsync"] = false;
  obj["users"] = [{
    "eyeseparation": 0.065,
    "pos": {"x": 0.0, "y": 0.0, "z": 0.0}
  }];
  obj["settings"] = { "display": { "swapinterval": 0 }};

  const nodePrefix = "surface";
  let warpArray: string[] = [];
  // Obtain mesh filename
  if ("files" in obj) {
    obj.files.forEach((fset: any) => {
      fset.fileset.forEach((warpFile: any) => {
        if ("geometryWarpFile" in warpFile) {
          warpFile.geometryWarpFile.forEach((wFile: any) => {
            if ("path" in wFile) {
              warpArray.push(wFile.path[0])
            }
          });
        }
      });
    });
  }
  let nodes: object[] = [];
  // Obtain display information for each node
  if ("display" in obj) {
    obj.display.forEach((displayElem: any) => {
      if ("buffer" in displayElem) {
        displayElem.buffer.forEach((buffElem: any) => {
          let node: any = {};
          let windowElem: any = {};
          if ("id" in buffElem) {
            let nodeNum = buffElem.id[0];
            nodeNum = Number(nodeNum.substring(nodePrefix.length));
            node["address"] = `DSGP${nodeNum}`;
            node["port"] = 20400 + nodeNum;
            node["name"] = `DSGP${nodeNum}`;
            node["swaplock"] = false;

            windowElem["border"] = false;
            windowElem["fxaa"] = false;
            windowElem["msaa"] = 1;
            if ("region" in buffElem) {
              let region = buffElem["region"][0];
              windowElem["pos"] = {"x": 0, "y": 0};
              if ("xResolution" in buffElem && "yResolution" in buffElem) {
                let x = parseInt(buffElem.xResolution);
                let y = parseInt(buffElem.yResolution);
                windowElem["size"] = {"x" : x, "y" : y};
                //Double the resolution for rendering due to the texture shape(s)
                windowElem["res"] = {"x" : x * 2, "y" : y * 2};
              }
              let viewport: any = {};
              viewport["tracked"] = true;
              if (nodeNum <= warpArray.length) {
                viewport["mesh"] = `mesh/${warpArray[nodeNum - 1]}`
              }
              if ("x" in region && "y" in region) {
                let x = parseFloat(region["x"][0]);
                let y = parseFloat(region["y"][0]);
                viewport["pos"] = {"x" : x, "y" : y};
              }
              if ("xSize" in region && "ySize" in region) {
                let xSize = parseFloat(region["xSize"][0]);
                let ySize = parseFloat(region["ySize"][0]);
                viewport["size"] = {"x" : xSize, "y" : ySize};
              }

              let projection: any = {};
              projection["type"] = "TextureMappedProjection";
              if ("frustum" in region) {
                let frustum = region["frustum"][0];

                projection["fov"] = {};
                if ("downAngle" in frustum) {
                  projection["fov"].down = Math.abs(parseFloat(frustum.downAngle[0]));
                }
                if ("upAngle" in frustum) {
                  projection["fov"].up = Math.abs(parseFloat(frustum.upAngle[0]));
                }
                if ("leftAngle" in frustum) {
                  projection["fov"].left = Math.abs(parseFloat(frustum.leftAngle[0]));
                }
                if ("rightAngle" in frustum) {
                  projection["fov"].right = Math.abs(parseFloat(frustum.rightAngle[0]));
                }

                projection["orientation"]= {};
                if ("yaw" in frustum) {
                  projection["orientation"].yaw = parseFloat(frustum.yaw[0]);
                }
                if ("pitch" in frustum) {
                  projection["orientation"].pitch = parseFloat(frustum.pitch[0]);
                }
                if ("roll" in frustum) {
                  projection["orientation"].roll = parseFloat(frustum.roll[0]);
                }
              }

              viewport["projection"] = projection;
              windowElem["viewports"] = [];
              windowElem["viewports"].push(viewport);
            }
            node["windows"] = [ windowElem ];
          }
          nodes.push(node);
        });
      }
    });
  }
  obj["nodes"] = nodes;

  //Remove extra fields from original mpcdi file
  delete obj.color;
  delete obj.date;
  delete obj.files;
  delete obj.geometry;
  delete obj.profile;
  delete obj.display;

  return obj;
}


/**
 * Function to convert any SGCT configuration file into the newest file format.
 * It will automatically detect what the source version is.
 *
 * @param content The content to be converted
 * @param filename The full name of the file from which the content came
 * @returns The converted files
 */
export async function convertFileVersion(content: string,
                                         extension: string): Promise<string>
{
  let converted = {};
  // let extension = filename.substring(filename.lastIndexOf("."));

  if (extension === ".xml") {
    let obj = await convertXmlToJson(content);
    converted = convertVersion(obj);
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



/**
 * Function to convert an old MPCDI format configuration to the newest JSON format.
 *
 * @param content The content to be converted
 * @param filename The full name of the file from which the content came
 * @returns The converted files
 */
export async function convertFileMPCDI(content: string): Promise<string> {
  let obj = await convertXmlToJson(content);
  let converted = convertFromMpcdi(obj);

  // Check the result against the JSON schema that we have
  let result = validate(converted, schema);
  if (!result.valid) {
    alert(result.toString());
  }

  let convertedContent = JSON.stringify(converted, null, 2);
  return convertedContent;
}
