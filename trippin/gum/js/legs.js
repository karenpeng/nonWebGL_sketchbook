var geom = {};
var paperjs = {};
var skeleton = {};
var util = {};

var Presets, RAD_2_DEG, SkeletonScene, Vec2, Vec3, improvedNoise, lerp, limit, midPoint,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

geom.Vec4 = (function() {

  Vec4.prototype.x = 0;

  Vec4.prototype.y = 0;

  Vec4.prototype.z = 0;

  Vec4.prototype.w = 0;

  function Vec4(x, y, z, w) {
    this.x = x != null ? x : 0;
    this.y = y != null ? y : 0;
    this.z = z != null ? z : 0;
    this.w = w != null ? w : 0;
  }

  Vec4.create = function(x, y, z, w) {
    return new Vec4(x, y, z, w);
  };

  Vec4.prototype.set = function(x, y, z, w) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this;
  };

  Vec4.prototype.transformMat4 = function(m) {
    var w, x, y, z;
    x = m.a14 * this.w + m.a11 * this.x + m.a12 * this.y + m.a13 * this.z;
    y = m.a24 * this.w + m.a21 * this.x + m.a22 * this.y + m.a23 * this.z;
    z = m.a34 * this.w + m.a31 * this.x + m.a32 * this.y + m.a33 * this.z;
    w = m.a44 * this.w + m.a41 * this.x + m.a42 * this.y + m.a43 * this.z;
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this;
  };

  return Vec4;

})();

geom.Vec2 = (function() {

  Vec2.prototype.x = 0;

  Vec2.prototype.y = 0;

  function Vec2(x, y) {
    this.x = x != null ? x : 0;
    this.y = y != null ? y : 0;
  }

  Vec2.create = function(x, y) {
    return new Vec2(x, y);
  };

  Vec2.prototype.set = function(x, y) {
    this.x = x;
    this.y = y;
    return this;
  };

  Vec2.prototype.add = function(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  };

  Vec2.prototype.sub = function(v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  };

  Vec2.prototype.scale = function(f) {
    this.x *= f;
    this.y *= f;
    return this;
  };

  Vec2.prototype.distance = function(v) {
    var dx, dy;
    dx = v.x - this.x;
    dy = v.y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  Vec2.prototype.dot = function(b) {
    return this.x * b.x + this.y * b.y;
  };

  Vec2.prototype.copy = function(v) {
    this.x = v.x;
    this.y = v.y;
    return this;
  };

  Vec2.prototype.clone = function() {
    return new Vec2(this.x, this.y);
  };

  Vec2.prototype.dup = function() {
    return this.clone();
  };

  Vec2.prototype.asAdd = function(a, b) {
    this.x = a.x + b.x;
    this.y = a.y + b.y;
    return this;
  };

  Vec2.prototype.asSub = function(a, b) {
    this.x = a.x - b.x;
    this.y = a.y - b.y;
    return this;
  };

  Vec2.prototype.length = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  };

  Vec2.prototype.normalize = function() {
    this.scale(1 / this.length());
    return this;
  };

  Vec2.prototype.toString = function() {
    return "{" + this.x + "," + this.y + "}";
  };

  return Vec2;

})();

/*

	GeneralUtil: Misc helper functions
*/


util.General = (function() {

  function General() {}

  General.copyObject = function(from, to) {
    var k, v;
    for (k in from) {
      v = from[k];
      to[k] = v;
    }
  };

  General.propertyById = function(obj, id) {
    var i, k, v;
    i = 0;
    for (k in obj) {
      v = obj[k];
      if (i === id) {
        return obj[k];
      }
      i++;
    }
    return void 0;
  };

  General.randomSeed = 1;

  General.randomFromSeed = function() {
    var x;
    x = Math.sin(this.randomSeed++) * 10000;
    return x - Math.floor(x);
  };

  General.randomPropery = function(obj) {
    var count, p, result;
    count = 0;
    result = null;
    for (p in obj) {
      if (Math.random() < 1 / ++count) {
        result = p;
      }
    }
    return obj[result];
  };

  General.copyToNewObject = function(from) {
    var k, to, v;
    to = {};
    for (k in from) {
      v = from[k];
      to[k] = v;
    }
    return to;
  };

  General.objectPropertyLength = function(obj) {
    var i, k, v;
    i = 0;
    for (k in obj) {
      v = obj[k];
      i++;
    }
    return i;
  };

  General.randomFromArray = function(array) {
    return array[Math.floor(Math.random() * array.length)];
  };

  General.randomFromRange = function(start, end) {
    return start + (Math.random() * (end - start));
  };

  return General;

})();

midPoint = function(a, b) {
  return new paper.Point((a.x + b.x) / 2, (a.y + b.y) / 2);
};

RAD_2_DEG = 180 / Math.PI;

lerp = function(a, b, t) {
  return Vec3.create(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, a.z + (b.z - a.z) * t);
};

limit = function(f, min, max) {
  return Math.max(min, Math.min(f, max));
};

Function.prototype.getter = function(prop, get) {
  return Object.defineProperty(this.prototype, prop, {
    get: get,
    configurable: true
  });
};

Function.prototype.setter = function(prop, set) {
  return Object.defineProperty(this.prototype, prop, {
    set: set,
    configurable: true
  });
};

geom.Vec3 = (function() {

  Vec3.prototype.x = 0;

  Vec3.prototype.y = 0;

  Vec3.prototype.z = 0;

  function Vec3(x, y, z) {
    this.x = x != null ? x : 0;
    this.y = y != null ? y : 0;
    this.z = z != null ? z : 0;
  }

  Vec3.create = function(x, y, z) {
    return new Vec3(x, y, z);
  };

  Vec3.prototype.set = function(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  };

  Vec3.prototype.add = function(v) {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  };

  Vec3.prototype.sub = function(v) {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    return this;
  };

  Vec3.prototype.scale = function(f) {
    this.x *= f;
    this.y *= f;
    this.z *= f;
    return this;
  };

  Vec3.prototype.distance = function(v) {
    var dx, dy, dz;
    dx = v.x - this.x;
    dy = v.y - this.y;
    dz = v.z - this.z;
    return Math.sqrt(dx * dx + dy * dy);
  };

  Vec3.prototype.squareDistance = function(v) {
    var dx, dy, dz;
    dx = v.x - this.x;
    dy = v.y - this.y;
    dz = v.z - this.z;
    return dx * dx + dy * dy;
  };

  Vec3.prototype.copy = function(v) {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;
  };

  Vec3.prototype.clone = function() {
    return new Vec3(this.x, this.y, this.z);
  };

  Vec3.prototype.dup = function() {
    return this.clone();
  };

  Vec3.prototype.cross = function(v) {
    var vx, vy, vz, x, y, z;
    x = this.x;
    y = this.y;
    z = this.z;
    vx = v.x;
    vy = v.y;
    vz = v.z;
    this.x = y * vz - z * vy;
    this.y = z * vx - x * vz;
    this.z = x * vy - y * vx;
    return this;
  };

  Vec3.prototype.dot = function(b) {
    return this.x * b.x + this.y * b.y + this.z * b.z;
  };

  Vec3.prototype.asAdd = function(a, b) {
    this.x = a.x + b.x;
    this.y = a.y + b.y;
    this.z = a.z + b.z;
    return this;
  };

  Vec3.prototype.asSub = function(a, b) {
    this.x = a.x - b.x;
    this.y = a.y - b.y;
    this.z = a.z - b.z;
    return this;
  };

  Vec3.prototype.asCross = function(a, b) {
    return this.copy(a).cross(b);
  };

  Vec3.prototype.length = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  };

  Vec3.prototype.lengthSquared = function() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  };

  Vec3.prototype.normalize = function() {
    this.scale(1 / this.length());
    return this;
  };

  Vec3.prototype.transformQuat = function(q) {
    var iw, ix, iy, iz, qw, qx, qy, qz, x, y, z;
    x = this.x;
    y = this.y;
    z = this.z;
    qx = q.x;
    qy = q.y;
    qz = q.z;
    qw = q.w;
    ix = qw * x + qy * z - qz * y;
    iy = qw * y + qz * x - qx * z;
    iz = qw * z + qx * y - qy * x;
    iw = -qx * x - qy * y - qz * z;
    this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return this;
  };

  Vec3.prototype.transformMat4 = function(m) {
    var x, y, z;
    x = m.a14 + m.a11 * this.x + m.a12 * this.y + m.a13 * this.z;
    y = m.a24 + m.a21 * this.x + m.a22 * this.y + m.a23 * this.z;
    z = m.a34 + m.a31 * this.x + m.a32 * this.y + m.a33 * this.z;
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  };

  Vec3.prototype.toString = function() {
    return "{" + this.x + "," + this.y + "," + this.z + "}";
  };

  return Vec3;

})();

Vec3 = geom.Vec3;

Vec2 = geom.Vec2;

skeleton.Limb = (function() {

  Limb.prototype.boneLength = 75;

  Limb.prototype.currentBoneIndex = 0;

  Limb.prototype.rootPosition = null;

  function Limb(rootPosition, motionPath, pathPointId) {
    this.rootPosition = rootPosition;
    this.motionPath = motionPath;
    this.pathPointId = pathPointId;
    this.bones = [];
    this.init();
    this;

  }

  Limb.prototype.load = function(data) {
    var b, bone, i, parentBone, _i, _len, _ref;
    this.pathPointId = data.pathPointId;
    this.motionPath = data.motionPath;
    parentBone = null;
    i = 0;
    _ref = data.bones;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      b = _ref[_i];
      b.position = new Vec2(b.position.x, b.position.y);
      b.endPosition = new Vec2(b.endPosition.x, b.endPosition.y);
      this.bones.push(bone = new skeleton.Bone(b));
      if (i === 0) {
        bone.addHandle();
      } else {
        bone.parentBone = parentBone;
      }
      parentBone = bone;
      i++;
    }
    this.init();
    return this;
  };

  Limb.prototype.init = function() {
    var b, _i, _len, _ref, _results;
    _ref = this.bones;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      b = _ref[_i];
      _results.push(b.propagate());
    }
    return _results;
  };

  Limb.prototype.update = function() {
    var b, i, target, _i, _len, _ref, _results;
    target = this.motionPath.getPoint(this.pathPointId);
    i = 0;
    while (i < this.bones.length) {
      this.solve(target);
      i++;
    }
    _ref = this.bones;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      b = _ref[_i];
      _results.push(b.update());
    }
    return _results;
  };

  Limb.prototype.solve = function(target) {
    var angle, b, bone, boneDirection, cross, directionToTarget, dot, _i, _len, _ref;
    bone = this.bones[this.currentBoneIndex];
    boneDirection = Vec2.create().asSub(this.bones[this.bones.length - 1].endPosition, bone.position);
    directionToTarget = Vec2.create().asSub(target, bone.position);
    if (boneDirection.length() > 0 && directionToTarget.length() > 0) {
      boneDirection.normalize();
      directionToTarget.normalize();
      dot = boneDirection.dot(directionToTarget);
      cross = Vec3.create().asCross(Vec3.create(boneDirection.x, boneDirection.y, 0), Vec3.create(directionToTarget.x, directionToTarget.y, 0));
      angle = Math.acos(dot);
      if (!isNaN(angle)) {
        if (cross.z > 0) {
          bone.angle += angle;
        } else {
          bone.angle -= angle;
        }
        bone.angle = limit(bone.angle, bone.minAngle, bone.maxAngle);
      }
    }
    this.currentBoneIndex = (this.currentBoneIndex - 1 + this.bones.length) % this.bones.length;
    _ref = this.bones;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      b = _ref[_i];
      b.propagate();
    }
  };

  Limb.prototype["export"] = function() {
    var b, data, _i, _len, _ref;
    data = {
      bones: [],
      pathId: this.motionPath.id,
      pathPointId: this.pathPointId
    };
    _ref = this.bones;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      b = _ref[_i];
      data.bones.push(b["export"]());
    }
    return data;
  };

  Limb.prototype.sendToBack = function() {
    var b, _i, _len, _ref, _results;
    _ref = this.bones;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      b = _ref[_i];
      _results.push(b.line.sendToBack());
    }
    return _results;
  };

  Limb.getter("position", function() {
    return this.bones[0].p1;
  });

  return Limb;

})();

Presets = {
  "zombie": {
    "motions": [
      {
        "id": 0,
        "points": [
          {
            "x": 299,
            "y": 487
          }, {
            "x": 355,
            "y": 503
          }, {
            "x": 300,
            "y": 514
          }, {
            "x": 290,
            "y": 500
          }
        ]
      }, {
        "id": 1,
        "points": [
          {
            "x": 464,
            "y": 283
          }, {
            "x": 500,
            "y": 311
          }, {
            "x": 445,
            "y": 321
          }, {
            "x": 411,
            "y": 290
          }
        ]
      }
    ],
    "limbs": [
      {
        "bones": [
          {
            "position": {
              "x": 317,
              "y": 337
            },
            "endPosition": {
              "x": 312.8713472147316,
              "y": 411.8862752857872
            },
            "length": 75,
            "angle": 1.6258728714771764,
            "accAngle": 1.6258728714771764,
            "minAngle": 0.4363323129985824,
            "maxAngle": 2.356194490192345
          }, {
            "position": {
              "x": 312.8713472147316,
              "y": 411.8862752857872
            },
            "endPosition": {
              "x": 295.8015527066628,
              "y": 484.9179267490555
            },
            "length": 75,
            "angle": 0.17453292519943295,
            "accAngle": 1.8004057966766094,
            "minAngle": 0.17453292519943295,
            "maxAngle": 1.5707963267948966
          }
        ],
        "pathId": 0,
        "pathPointId": 0
      }, {
        "bones": [
          {
            "position": {
              "x": 317,
              "y": 330
            },
            "endPosition": {
              "x": 329.6247495551317,
              "y": 403.929802506636
            },
            "length": 75,
            "angle": 1.4016610843232848,
            "accAngle": 1.4016610843232848,
            "minAngle": 0.4363323129985824,
            "maxAngle": 2.356194490192345
          }, {
            "position": {
              "x": 329.6247495551317,
              "y": 403.929802506636
            },
            "endPosition": {
              "x": 329.2199253163094,
              "y": 478.92870994758255
            },
            "length": 75,
            "angle": 0.17453292519943295,
            "accAngle": 1.5761940095227178,
            "minAngle": 0.17453292519943295,
            "maxAngle": 1.5707963267948966
          }
        ],
        "pathId": 0,
        "pathPointId": 1
      }, {
        "bones": [
          {
            "position": {
              "x": 328,
              "y": 248
            },
            "endPosition": {
              "x": 374.5566372570595,
              "y": 266.2340211504369
            },
            "length": 50,
            "angle": 0.3732895668601383,
            "accAngle": 0.3732895668601383,
            "minAngle": 0.17453292519943295,
            "maxAngle": 2.9670597283903604
          }, {
            "position": {
              "x": 374.5566372570595,
              "y": 266.2340211504369
            },
            "endPosition": {
              "x": 421.11327489837225,
              "y": 284.46804131976603
            },
            "length": 50,
            "angle": -2.1073424255447017e-8,
            "accAngle": 0.3732895457867141,
            "minAngle": -1.5707963267948966,
            "maxAngle": 0
          }
        ],
        "pathId": 1,
        "pathPointId": 0
      }, {
        "bones": [
          {
            "position": {
              "x": 316,
              "y": 250
            },
            "endPosition": {
              "x": 362.55498549974783,
              "y": 268.238237993794
            },
            "length": 50,
            "angle": 0.37338014294998206,
            "accAngle": 0.37338014294998206,
            "minAngle": 0.17453292519943295,
            "maxAngle": 2.9670597283903604
          }, {
            "position": {
              "x": 362.55498549974783,
              "y": 268.238237993794
            },
            "endPosition": {
              "x": 409.10997127126655,
              "y": 286.4764752938646
            },
            "length": 50,
            "angle": -1.4901161193847656e-8,
            "accAngle": 0.37338012804882087,
            "minAngle": -1.5707963267948966,
            "maxAngle": 0
          }
        ],
        "pathId": 1,
        "pathPointId": 1
      }
    ]
  },
  "powerwalker": {
    "motions": [
      {
        "id": 0,
        "points": [
          {
            "x": 372,
            "y": 478
          }, {
            "x": 212,
            "y": 482
          }, {
            "x": 299,
            "y": 411
          }, {
            "x": 341,
            "y": 466
          }
        ]
      }, {
        "id": 1,
        "points": [
          {
            "x": 412,
            "y": 221
          }, {
            "x": 309,
            "y": 331
          }, {
            "x": 153,
            "y": 269
          }, {
            "x": 404,
            "y": 317
          }
        ]
      }
    ],
    "limbs": [
      {
        "bones": [
          {
            "position": {
              "x": 300,
              "y": 300
            },
            "endPosition": {
              "x": 288.23399463024725,
              "y": 374.07132453007
            },
            "length": 75,
            "angle": 1.728327136708383,
            "accAngle": 1.728327136708383,
            "minAngle": 0.4363323129985824,
            "maxAngle": 2.356194490192345
          }, {
            "position": {
              "x": 288.23399463024725,
              "y": 374.07132453007
            },
            "endPosition": {
              "x": 263.78439079810903,
              "y": 444.9741938122894
            },
            "length": 75,
            "angle": 0.17453292519943295,
            "accAngle": 1.902860061907816,
            "minAngle": 0.17453292519943295,
            "maxAngle": 1.5707963267948966
          }
        ],
        "pathId": 0,
        "pathPointId": 0
      }, {
        "bones": [
          {
            "position": {
              "x": 287,
              "y": 309
            },
            "endPosition": {
              "x": 334.6568054228309,
              "y": 366.91225169936354
            },
            "length": 75,
            "angle": 0.8822387305349422,
            "accAngle": 0.8822387305349422,
            "minAngle": 0.4363323129985824,
            "maxAngle": 2.356194490192345
          }, {
            "position": {
              "x": 334.6568054228309,
              "y": 366.91225169936354
            },
            "endPosition": {
              "x": 335.85899227545934,
              "y": 441.9026160588689
            },
            "length": 75,
            "angle": 0.6725277517398338,
            "accAngle": 1.554766482274776,
            "minAngle": 0.17453292519943295,
            "maxAngle": 1.5707963267948966
          }
        ],
        "pathId": 0,
        "pathPointId": 1
      }, {
        "bones": [
          {
            "position": {
              "x": 305,
              "y": 221
            },
            "endPosition": {
              "x": 276.41235882819245,
              "y": 262.02129656936717
            },
            "length": 50,
            "angle": 2.1794370752889045,
            "accAngle": 2.1794370752889045,
            "minAngle": 0.17453292519943295,
            "maxAngle": 2.9670597283903604
          }, {
            "position": {
              "x": 276.41235882819245,
              "y": 262.02129656936717
            },
            "endPosition": {
              "x": 310.065844467397,
              "y": 299.00024874938237
            },
            "length": 50,
            "angle": -1.3469923596785272,
            "accAngle": 0.8324447156103774,
            "minAngle": -1.5707963267948966,
            "maxAngle": 0
          }
        ],
        "pathId": 1,
        "pathPointId": 0
      }, {
        "bones": [
          {
            "position": {
              "x": 289,
              "y": 223
            },
            "endPosition": {
              "x": 293.22310032830467,
              "y": 272.8213350244358
            },
            "length": 50,
            "angle": 1.4862335735325785,
            "accAngle": 1.4862335735325785,
            "minAngle": 0.17453292519943295,
            "maxAngle": 2.9670597283903604
          }, {
            "position": {
              "x": 293.22310032830467,
              "y": 272.8213350244358
            },
            "endPosition": {
              "x": 340.12070997480333,
              "y": 290.1595647335104
            },
            "length": 50,
            "angle": -1.1321141147794582,
            "accAngle": 0.35411945875312023,
            "minAngle": -1.5707963267948966,
            "maxAngle": 0
          }
        ],
        "pathId": 1,
        "pathPointId": 1
      }
    ]
  },
  "runner": {
    "motions": [
      {
        "id": 0,
        "points": [
          {
            "x": 398,
            "y": 474
          }, {
            "x": 242,
            "y": 485
          }, {
            "x": 104,
            "y": 426
          }, {
            "x": 276,
            "y": 356
          }
        ]
      }, {
        "id": 1,
        "points": [
          {
            "x": 427,
            "y": 255
          }, {
            "x": 309,
            "y": 331
          }, {
            "x": 153,
            "y": 269
          }, {
            "x": 341,
            "y": 337
          }
        ]
      }
    ],
    "limbs": [
      {
        "bones": [
          {
            "position": {
              "x": 300,
              "y": 300
            },
            "endPosition": {
              "x": 363.5487618600752,
              "y": 339.8315812647634
            },
            "length": 75,
            "angle": 0.5598838081501917,
            "accAngle": 0.5598838081501917,
            "minAngle": 0.4363323129985824,
            "maxAngle": 2.356194490192345
          }, {
            "position": {
              "x": 363.5487618600752,
              "y": 339.8315812647634
            },
            "endPosition": {
              "x": 333.6695395158648,
              "y": 408.6228021588952
            },
            "length": 75,
            "angle": 1.4206729806371432,
            "accAngle": 1.980556788787335,
            "minAngle": 0.17453292519943295,
            "maxAngle": 1.5707963267948966
          }
        ],
        "pathId": 0,
        "pathPointId": 0
      }, {
        "bones": [
          {
            "position": {
              "x": 300,
              "y": 300
            },
            "endPosition": {
              "x": 259.15329859937196,
              "y": 362.90108889906384
            },
            "length": 75,
            "angle": 2.1467354853261087,
            "accAngle": 2.1467354853261087,
            "minAngle": 0.4363323129985824,
            "maxAngle": 2.356194490192345
          }, {
            "position": {
              "x": 259.15329859937196,
              "y": 362.90108889906384
            },
            "endPosition": {
              "x": 208.0044909144708,
              "y": 417.7536136578477
            },
            "length": 75,
            "angle": 0.17453292519943295,
            "accAngle": 2.3212684105255414,
            "minAngle": 0.17453292519943295,
            "maxAngle": 1.5707963267948966
          }
        ],
        "pathId": 0,
        "pathPointId": 1
      }, {
        "bones": [
          {
            "position": {
              "x": 306,
              "y": 235
            },
            "endPosition": {
              "x": 322.7940328052133,
              "y": 282.0952275940718
            },
            "length": 50,
            "angle": 1.2282562785416824,
            "accAngle": 1.2282562785416824,
            "minAngle": 0.17453292519943295,
            "maxAngle": 2.9670597283903604
          }, {
            "position": {
              "x": 322.7940328052133,
              "y": 282.0952275940718
            },
            "endPosition": {
              "x": 371.22462889814506,
              "y": 294.52411982481
            },
            "length": 50,
            "angle": -0.9770445412848041,
            "accAngle": 0.2512117372568783,
            "minAngle": -1.5707963267948966,
            "maxAngle": 0
          }
        ],
        "pathId": 1,
        "pathPointId": 0
      }, {
        "bones": [
          {
            "position": {
              "x": 300,
              "y": 228
            },
            "endPosition": {
              "x": 252.8203676575487,
              "y": 244.55543089234234
            },
            "length": 50,
            "angle": 2.8041144299539837,
            "accAngle": 2.8041144299539837,
            "minAngle": 0.17453292519943295,
            "maxAngle": 2.9670597283903604
          }, {
            "position": {
              "x": 252.8203676575487,
              "y": 244.55543089234234
            },
            "endPosition": {
              "x": 239.36508312918255,
              "y": 292.7109634743906
            },
            "length": 50,
            "angle": -0.960853755852035,
            "accAngle": 1.8432606741019488,
            "minAngle": -1.5707963267948966,
            "maxAngle": 0
          }
        ],
        "pathId": 1,
        "pathPointId": 1
      }
    ]
  },
  "limbo": {
    "motions": [
      {
        "id": 0,
        "points": [
          {
            "x": 362,
            "y": 428
          }, {
            "x": 390,
            "y": 463
          }, {
            "x": 298,
            "y": 463
          }, {
            "x": 239.46209746420635,
            "y": 423.8591962224897
          }
        ]
      }, {
        "id": 1,
        "points": [
          {
            "x": 415,
            "y": 319
          }, {
            "x": 342,
            "y": 338
          }, {
            "x": 334,
            "y": 317
          }, {
            "x": 361,
            "y": 308
          }
        ]
      }
    ],
    "limbs": [
      {
        "bones": [
          {
            "position": {
              "x": 308,
              "y": 331
            },
            "endPosition": {
              "x": 374.5082758270537,
              "y": 365.6648128007717
            },
            "length": 75,
            "angle": 0.48047168235450993,
            "accAngle": 0.48047168235450993,
            "minAngle": 0.4363323129985824,
            "maxAngle": 2.356194490192345
          }, {
            "position": {
              "x": 374.5082758270537,
              "y": 365.6648128007717
            },
            "endPosition": {
              "x": 339.843463026282,
              "y": 432.1730886278254
            },
            "length": 75,
            "angle": 1.5707963267948966,
            "accAngle": 2.0512680091494064,
            "minAngle": 0.17453292519943295,
            "maxAngle": 1.5707963267948966
          }
        ],
        "pathId": 0,
        "pathPointId": 0
      }, {
        "bones": [
          {
            "position": {
              "x": 283,
              "y": 340
            },
            "endPosition": {
              "x": 331.623429193575,
              "y": 397.1030833971108
            },
            "length": 75,
            "angle": 0.8654305194801979,
            "accAngle": 0.8654305194801979,
            "minAngle": 0.4363323129985824,
            "maxAngle": 2.356194490192345
          }, {
            "position": {
              "x": 331.623429193575,
              "y": 397.1030833971108
            },
            "endPosition": {
              "x": 306.4664098267896,
              "y": 467.7580505019024
            },
            "length": 75,
            "angle": 1.0474241801514457,
            "accAngle": 1.9128546996316436,
            "minAngle": 0.17453292519943295,
            "maxAngle": 1.5707963267948966
          }
        ],
        "pathId": 0,
        "pathPointId": 1
      }, {
        "bones": [
          {
            "position": {
              "x": 243,
              "y": 290
            },
            "endPosition": {
              "x": 292.08095037272415,
              "y": 299.54255262024725
            },
            "length": 50,
            "angle": 0.19202906209476675,
            "accAngle": 0.19202906209476675,
            "minAngle": 0.17453292519943295,
            "maxAngle": 2.9670597283903604
          }, {
            "position": {
              "x": 292.08095037272415,
              "y": 299.54255262024725
            },
            "endPosition": {
              "x": 341.1873576575547,
              "y": 308.95322547484926
            },
            "length": 50,
            "angle": -0.002686286493216179,
            "accAngle": 0.18934277560155058,
            "minAngle": -1.5707963267948966,
            "maxAngle": 0
          }
        ],
        "pathId": 1,
        "pathPointId": 0
      }, {
        "bones": [
          {
            "position": {
              "x": 224,
              "y": 301
            },
            "endPosition": {
              "x": 273.2403876506104,
              "y": 309.6824088833465
            },
            "length": 50,
            "angle": 0.17453292519943295,
            "accAngle": 0.17453292519943295,
            "minAngle": 0.17453292519943295,
            "maxAngle": 2.9670597283903604
          }, {
            "position": {
              "x": 273.2403876506104,
              "y": 309.6824088833465
            },
            "endPosition": {
              "x": 322.6058451991277,
              "y": 317.62291271027937
            },
            "length": 50,
            "angle": -0.015047608094652136,
            "accAngle": 0.1594853171047808,
            "minAngle": -1.5707963267948966,
            "maxAngle": 0
          }
        ],
        "pathId": 1,
        "pathPointId": 1
      }
    ]
  }
};

SkeletonScene = (function() {

  SkeletonScene.prototype.options = {
    width: 600,
    height: 600,
    container: "#container",
    showExportWindow: false,
    showConstraints: false,
    showMotionPaths: true,
    showHandles: true
  };

  SkeletonScene.prototype.showSettings = true;

  SkeletonScene.prototype.preset = null;

  SkeletonScene.prototype.debugColor = "#333";

  SkeletonScene.prototype.debugHighlightColor = "#999";

  SkeletonScene.prototype.draggedItem = null;

  SkeletonScene.prototype.isPlaying = true;

  SkeletonScene.instance = null;

  SkeletonScene.events = null;

  function SkeletonScene() {
    this["export"] = __bind(this["export"], this);

    this["import"] = __bind(this["import"], this);

    this.loadPreset = __bind(this.loadPreset, this);

    this.update = __bind(this.update, this);

    var $canvas;
    SkeletonScene.instance = this;
    SkeletonScene.events = document;
    $canvas = $("<canvas width='" + this.options.width + "' height ='" + this.options.height + "'/>");
    $(this.options.container).append($canvas);
    this.dom = this.canvas = $canvas[0];
    paper.setup(this.canvas);
    this.project = paper.project;
    this.view = paper.view;
    this.addExportWindow();
    $(window).resize(this.onResize);
    if (this.showSettings) {
      this.addGui();
    }
    this.addDragEvents();
    this.loadPreset("zombie");
    this.update();
  }

  SkeletonScene.prototype.update = function() {
    this.body.update();
    this.view.draw();
    if (this.isPlaying) {
      return window.requestAnimFrame(this.update, null);
    }
  };

  SkeletonScene.prototype.generateNewBody = function() {
    this.body = new skeleton.Body();
    return this.body.loadDefault();
  };

  SkeletonScene.prototype.onResize = function(e) {};

  SkeletonScene.prototype.addGui = function() {
    var gui, k, presetAr, v,
      _this = this;
    gui = new dat.GUI();
    gui.add(this.options, "showExportWindow").onChange(function() {
      return document.dispatchEvent(new Event("toggleExportWindow"));
    });
    gui.add(this.options, "showConstraints").onChange(function() {
      return document.dispatchEvent(new Event("toggleConstraints"));
    });
    gui.add(this.options, "showHandles").onChange(function() {
      return document.dispatchEvent(new Event("toggleHandles"));
    });
    gui.add(this.options, "showMotionPaths").onChange(function() {
      return document.dispatchEvent(new Event("toggleMotionPaths"));
    });
    presetAr = [];
    for (k in Presets) {
      v = Presets[k];
      presetAr.push(k);
    }
    gui.add(this, "preset", presetAr).onChange(function(e) {
      return _this.loadPreset(e);
    });
    gui.add(this, "export");
    gui.add(this, "import");
    return this.gui = gui;
  };

  SkeletonScene.prototype.clear = function() {
    var project;
    project = SkeletonScene.instance.project;
    return project.activeLayer.removeChildren();
  };

  SkeletonScene.prototype.loadPreset = function(key) {
    var obj;
    this.clear();
    obj = Presets[key];
    this.body = new skeleton.Body();
    return this.body.load(obj);
  };

  SkeletonScene.prototype["import"] = function() {
    var obj;
    this.clear();
    obj = JSON.parse(this.exportWindow.val());
    this.body = new skeleton.Body();
    this.body.load(obj);
    return console.log(obj);
  };

  SkeletonScene.prototype["export"] = function() {
    var data, dataStr;
    this.exportWindow.show();
    data = this.body["export"]();
    dataStr = JSON.stringify(data);
    return this.exportWindow.val(dataStr);
  };

  SkeletonScene.prototype.addExportWindow = function() {
    var _this = this;
    this.exportWindow = $("#debugTxt");
    if (!SkeletonScene.instance.options.showExportWindow) {
      this.exportWindow.hide();
    }
    return SkeletonScene.events.addEventListener("toggleExportWindow", function() {
      if (SkeletonScene.instance.options.showExportWindow) {
        return _this.exportWindow.show();
      } else {
        return _this.exportWindow.hide();
      }
    });
  };

  SkeletonScene.prototype.addDragEvents = function() {
    var project,
      _this = this;
    project = SkeletonScene.instance.project;
    $(document).mousedown(function(e) {
      var h, hitResult, x, y;
      _this.draggedItem = null;
      x = e.pageX;
      y = e.pageY;
      hitResult = project.hitTest(new paper.Point(e.pageX, e.pageY));
      if (hitResult != null ? hitResult.item : void 0) {
        h = hitResult.item;
        if (h.isDraggable) {
          _this.draggedItem = h;
          if (typeof h.eMouseDown === "function") {
            h.eMouseDown(x, y);
          }
          h.fillColor = _this.debugHighlightColor;
          return;
        }
      }
    });
    $(document).mousemove(function(e) {
      var x, y, _base;
      if (_this.draggedItem != null) {
        x = e.pageX;
        y = e.pageY;
        return typeof (_base = _this.draggedItem).eMouseMove === "function" ? _base.eMouseMove(x, y) : void 0;
      }
    });
    return $(document).mouseup(function(e) {
      var _base;
      if (_this.draggedItem) {
        _this.draggedItem.fillColor = _this.debugColor;
        if (typeof (_base = _this.draggedItem).eMouseUp === "function") {
          _base.eMouseUp(x, y);
        }
        return _this.draggedItem = null;
      }
    });
  };

  return SkeletonScene;

})();

window.requestAnimFrame = (function() {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
    return window.setTimeout(callback, 1000 / 60);
  };
})();

geom.MotionPath = (function() {

  MotionPath.prototype.numSteps = 12;

  MotionPath.prototype.debug = true;

  MotionPath.prototype.debugColor = new paper.Color(1, 1, 1, 0.2);

  MotionPath.prototype.debugHighlightColor = "#999";

  MotionPath.prototype.subPoints = null;

  MotionPath.prototype.circles = null;

  MotionPath.prototype.activeDrag = null;

  MotionPath.prototype.pathFrame = 0;

  MotionPath.prototype.id = -1;

  MotionPath.idIncrement = 0;

  function MotionPath(centerPoint) {
    var _this = this;
    this.centerPoint = centerPoint;
    this.getPoint = __bind(this.getPoint, this);

    this.points = [];
    this.handles = [];
    this.subPoints = [];
    SkeletonScene.events.addEventListener("toggleMotionPaths", function() {
      return _this.visible = SkeletonScene.instance.options.showMotionPaths;
    });
    if (this.centerPoint) {
      this.id = geom.MotionPath.idIncrement++;
      this.init();
    }
    this;

  }

  MotionPath.prototype.load = function(data) {
    var p, _i, _len, _ref;
    this.id = data.id;
    _ref = data.points;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      p = _ref[_i];
      this.addHandle(p.x, p.y);
    }
    this.createSubPoints();
    return this;
  };

  MotionPath.prototype.addHandle = function(x, y) {
    var circ, p;
    p = new Vec2(x, y);
    this.points.push(p);
    circ = new paper.Path.Circle(new paper.Point(p.x, p.y), 8);
    circ.fillColor = this.debugColor;
    circ.linkedPoint = p;
    circ.target = this;
    circ.isDraggable = true;
    circ.eMouseMove = this.onMoveHandle;
    circ.visible = SkeletonScene.instance.options.showMotionPaths;
    return this.handles.push(circ);
  };

  MotionPath.prototype.init = function() {
    var angle, i, maxAngle, maxR, minAngle, minR, numPoints, rx, ry;
    numPoints = 4;
    maxAngle = Math.PI * 2 / 8;
    minAngle = maxAngle * 0.7;
    angle = 0;
    maxR = 100;
    minR = 50;
    i = 0;
    while (i < numPoints) {
      angle += minAngle + Math.random() * (maxAngle - minAngle);
      ry = minR + Math.random() * (maxR - minR);
      rx = ry * 1.2;
      this.addHandle(this.centerPoint.x + rx * Math.cos(angle), this.centerPoint.y + ry * Math.sin(angle));
      i++;
    }
    return this.createSubPoints();
  };

  MotionPath.prototype.createSubPoints = function() {
    var c, i, p, p0, p1, p2, p3, t, _i, _len, _ref, _results;
    i = 0;
    while (i < this.points.length) {
      p0 = this.points[i];
      p1 = this.points[(i + 1) % this.points.length];
      p2 = this.points[(i + 2) % this.points.length];
      p3 = this.points[(i + 3) % this.points.length];
      t = 0;
      while (t < 1) {
        p = Vec2.create(0, 0, 0);
        this.calculatePoint(p, p0, p1, p2, p3, t);
        this.subPoints.push(p);
        t += 1 / this.numSteps;
      }
      i++;
    }
    if (this.debug) {
      this.subPointCircles = [];
      i = 0;
      while (i < this.subPoints.length) {
        p = this.subPoints[i];
        c = new paper.Path.Circle(new paper.Point(p.x, p.y), 2);
        c.fillColor = this.debugColor;
        c.linkedPoint = this.subPoints[i];
        c.visible = SkeletonScene.instance.options.showMotionPaths;
        this.subPointCircles.push(c);
        i++;
      }
      _ref = this.handles;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        c = _ref[_i];
        _results.push(c.bringToFront());
      }
      return _results;
    }
  };

  MotionPath.prototype.recalculate = function() {
    var i, j, p, p0, p1, p2, p3, t, _results;
    i = 0;
    j = 0;
    while (i < this.points.length) {
      p0 = this.points[i];
      p1 = this.points[(i + 1) % this.points.length];
      p2 = this.points[(i + 2) % this.points.length];
      p3 = this.points[(i + 3) % this.points.length];
      t = 0;
      while (t < 1) {
        p = this.subPoints[j];
        this.calculatePoint(p, p0, p1, p2, p3, t);
        t += 1 / this.numSteps;
        j++;
      }
      i++;
    }
    if (this.debug) {
      i = 0;
      _results = [];
      while (i < this.subPointCircles.length) {
        this.subPointCircles[i].position.x = this.subPoints[i].x;
        this.subPointCircles[i].position.y = this.subPoints[i].y;
        _results.push(i++);
      }
      return _results;
    }
  };

  MotionPath.prototype.calculatePoint = function(p, p0, p1, p2, p3, t) {
    p.x = p0.x * 1 / 6 * (1 - 3 * t + 3 * t * t - t * t * t) + p1.x * 1 / 6 * (4 - 6 * t * t + 3 * t * t * t) + p2.x * 1 / 6 * (1 + 3 * t + 3 * t * t - 3 * t * t * t) + p3.x * 1 / 6 * (t * t * t);
    p.y = p0.y * 1 / 6 * (1 - 3 * t + 3 * t * t - t * t * t) + p1.y * 1 / 6 * (4 - 6 * t * t + 3 * t * t * t) + p2.y * 1 / 6 * (1 + 3 * t + 3 * t * t - 3 * t * t * t) + p3.y * 1 / 6 * (t * t * t);
  };

  MotionPath.prototype.update = function() {
    if (this.debug) {
      this.subPointCircles[this.pathFrame].fillColor = this.debugColor;
    }
    this.pathFrame = (this.pathFrame + 1) % this.subPoints.length;
    if (this.debug) {
      return this.subPointCircles[this.pathFrame].fillColor = this.debugHighlightColor;
    }
  };

  MotionPath.prototype.getPoint = function(i) {
    switch (i) {
      case 1:
        return this.subPoints[(this.pathFrame + Math.floor(this.subPoints.length / 2)) % this.subPoints.length];
      default:
        return this.subPoints[this.pathFrame];
    }
  };

  MotionPath.prototype["export"] = function() {
    var data;
    return data = {
      id: this.id,
      points: this.points
    };
  };

  MotionPath.prototype.onMoveHandle = function(x, y) {
    this.position.x = x;
    this.position.y = y;
    this.linkedPoint.x = x;
    this.linkedPoint.y = y;
    this.target.recalculate();
  };

  MotionPath.setter('visible', function(v) {
    var c, _i, _j, _len, _len1, _ref, _ref1, _results;
    _ref = this.subPointCircles;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      c = _ref[_i];
      c.visible = v;
    }
    _ref1 = this.handles;
    _results = [];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      c = _ref1[_j];
      _results.push(c.visible = v);
    }
    return _results;
  });

  MotionPath.getter('visible', function() {
    return this.subPointCircles[0].visible;
  });

  return MotionPath;

})();

geom.Nurbs = (function() {

  function Nurbs() {}

  Nurbs.findSpan = function(p, u, U) {
    var high, low, mid, n;
    n = U.length - p - 1;
    if (u >= U[n]) {
      return n - 1;
    }
    if (u <= U[p]) {
      return p;
    }
    low = p;
    high = n;
    mid = Math.floor((low + high) / 2);
    while (u < U[mid] || u >= U[mid + 1]) {
      if (u < U[mid]) {
        high = mid;
      } else {
        low = mid;
      }
      mid = Math.floor((low + high) / 2);
    }
    return mid;
  };

  Nurbs.calcBasisFunctions = function(span, u, p, U) {
    var N, j, left, lv, r, right, rv, saved, temp;
    N = [];
    left = [];
    right = [];
    N[0] = 1.0;
    j = 1;
    while (j <= p) {
      left[j] = u - U[span + 1 - j];
      right[j] = U[span + j] - u;
      saved = 0.0;
      r = 0;
      while (r < j) {
        rv = right[r + 1];
        lv = left[j - r];
        temp = N[r] / (rv + lv);
        N[r] = saved + rv * temp;
        saved = lv * temp;
        ++r;
      }
      N[j] = saved;
      ++j;
    }
    return N;
  };

  Nurbs.calcBSplinePoint = function(p, U, P, u) {
    var C, N, Nj, j, point, span, wNj;
    span = this.findSpan(p, u, U);
    N = this.calcBasisFunctions(span, u, p, U);
    C = new geom.Vec4(0, 0, 0, 0);
    j = 0;
    while (j <= p) {
      point = P[span - p + j];
      Nj = N[j];
      wNj = point.w * Nj;
      C.x += point.x * wNj;
      C.y += point.y * wNj;
      C.z += point.z * wNj;
      C.w += point.w * Nj;
      ++j;
    }
    return C;
  };

  Nurbs.calcBasisFunctionDerivatives = function(span, u, p, n, U) {
    var a, d, ders, i, j, j1, j2, k, left, lv, ndu, pk, r, right, rk, rv, s1, s2, saved, temp, zeroArr;
    zeroArr = [];
    i = 0;
    while (i <= p) {
      zeroArr[i] = 0.0;
      ++i;
    }
    ders = [];
    i = 0;
    while (i <= n) {
      ders[i] = zeroArr.slice(0);
      ++i;
    }
    ndu = [];
    i = 0;
    while (i <= p) {
      ndu[i] = zeroArr.slice(0);
      ++i;
    }
    ndu[0][0] = 1.0;
    left = zeroArr.slice(0);
    right = zeroArr.slice(0);
    j = 1;
    while (j <= p) {
      left[j] = u - U[span + 1 - j];
      right[j] = U[span + j] - u;
      saved = 0.0;
      r = 0;
      while (r < j) {
        rv = right[r + 1];
        lv = left[j - r];
        ndu[j][r] = rv + lv;
        temp = ndu[r][j - 1] / ndu[j][r];
        ndu[r][j] = saved + rv * temp;
        saved = lv * temp;
        ++r;
      }
      ndu[j][j] = saved;
      ++j;
    }
    j = 0;
    while (j <= p) {
      ders[0][j] = ndu[j][p];
      ++j;
    }
    r = 0;
    while (r <= p) {
      s1 = 0;
      s2 = 1;
      a = [];
      i = 0;
      while (i <= p) {
        a[i] = zeroArr.slice(0);
        ++i;
      }
      a[0][0] = 1.0;
      k = 1;
      while (k <= n) {
        d = 0.0;
        rk = r - k;
        pk = p - k;
        if (r >= k) {
          a[s2][0] = a[s1][0] / ndu[pk + 1][rk];
          d = a[s2][0] * ndu[rk][pk];
        }
        j1 = (rk >= -1 ? 1 : -rk);
        j2 = (r - 1 <= pk ? k - 1 : p - r);
        j = j1;
        while (j <= j2) {
          a[s2][j] = (a[s1][j] - a[s1][j - 1]) / ndu[pk + 1][rk + j];
          d += a[s2][j] * ndu[rk + j][pk];
          ++j;
        }
        if (r <= pk) {
          a[s2][k] = -a[s1][k - 1] / ndu[pk + 1][r];
          d += a[s2][k] * ndu[r][pk];
        }
        ders[k][r] = d;
        j = s1;
        s1 = s2;
        s2 = j;
        ++k;
      }
      ++r;
    }
    r = p;
    k = 1;
    while (k <= n) {
      j = 0;
      while (j <= p) {
        ders[k][j] *= r;
        ++j;
      }
      r *= p - k;
      ++k;
    }
    return ders;
  };

  Nurbs.calcBSplineDerivatives = function(p, U, P, u, nd) {
    var CK, Pw, du, i, j, k, nders, point, span, w;
    du = (nd < p ? nd : p);
    CK = [];
    span = this.findSpan(p, u, U);
    nders = this.calcBasisFunctionDerivatives(span, u, p, du, U);
    Pw = [];
    i = 0;
    while (i < P.length) {
      point = P[i].clone();
      w = point.w;
      point.x *= w;
      point.y *= w;
      point.z *= w;
      Pw[i] = point;
      ++i;
    }
    k = 0;
    while (k <= du) {
      point = Pw[span - p].clone().multiplyScalar(nders[k][0]);
      j = 1;
      while (j <= p) {
        point.add(Pw[span - p + j].clone().multiplyScalar(nders[k][j]));
        ++j;
      }
      CK[k] = point;
      ++k;
    }
    k = du + 1;
    while (k <= nd + 1) {
      CK[k] = new THREE.Vector4(0, 0, 0);
      ++k;
    }
    return CK;
  };

  Nurbs.prototype.calcKoverI = function(k, i) {
    var denom, j, nom;
    nom = 1;
    j = 2;
    while (j <= k) {
      nom *= j;
      ++j;
    }
    denom = 1;
    j = 2;
    while (j <= i) {
      denom *= j;
      ++j;
    }
    j = 2;
    while (j <= k - i) {
      denom *= j;
      ++j;
    }
    return nom / denom;
  };

  Nurbs.calcRationalCurveDerivatives = function(Pders) {
    var Aders, CK, i, k, nd, point, v, wders;
    nd = Pders.length;
    Aders = [];
    wders = [];
    i = 0;
    while (i < nd) {
      point = Pders[i];
      Aders[i] = new geom.Vec3(point.x, point.y, point.z);
      wders[i] = point.w;
      ++i;
    }
    CK = [];
    k = 0;
    while (k < nd) {
      v = Aders[k].clone();
      i = 1;
      while (i <= k) {
        v.sub(CK[k - i].clone().multiplyScalar(this.calcKoverI(k, i) * wders[i]));
        ++i;
      }
      CK[k] = v.divideScalar(wders[0]);
      ++k;
    }
    return CK;
  };

  Nurbs.calcNURBSDerivatives = function(p, U, P, u, nd) {
    var Pders;
    Pders = this.calcBSplineDerivatives(p, U, P, u, nd);
    return this.calcRationalCurveDerivatives(Pders);
  };

  Nurbs.calcSurfacePoint = function(p, q, U, V, P, u, v) {
    var Nu, Nv, Sw, k, l, point, temp, uspan, vspan, w;
    uspan = this.findSpan(p, u, U);
    vspan = this.findSpan(q, v, V);
    Nu = this.calcBasisFunctions(uspan, u, p, U);
    Nv = this.calcBasisFunctions(vspan, v, q, V);
    temp = [];
    l = 0;
    while (l <= q) {
      temp[l] = new geom.Vec4(0, 0, 0, 0);
      k = 0;
      while (k <= p) {
        point = P[uspan - p + k][vspan - q + l].clone();
        w = point.w;
        point.x *= w;
        point.y *= w;
        point.z *= w;
        temp[l].add(point.multiplyScalar(Nu[k]));
        ++k;
      }
      ++l;
    }
    Sw = new geom.Vec4(0, 0, 0, 0);
    l = 0;
    while (l <= q) {
      Sw.add(temp[l].multiplyScalar(Nv[l]));
      ++l;
    }
    Sw.divideScalar(Sw.w);
    return new geom.Vec4(Sw.x, Sw.y, Sw.z);
  };

  return Nurbs;

})();

Vec3 = geom.Vec3;

Vec2 = geom.Vec2;

skeleton.Arm = (function(_super) {

  __extends(Arm, _super);

  function Arm(rootPosition, motionPath, targetFunc) {
    this.rootPosition = rootPosition;
    this.motionPath = motionPath;
    this.targetFunc = targetFunc;
    this.boneLength = 50;
    Arm.__super__.constructor.call(this, this.rootPosition, this.motionPath, this.targetFunc);
  }

  Arm.prototype.init = function() {
    var b1, b2;
    this.bones.push(b1 = new skeleton.Bone({
      position: new Vec2(this.rootPosition.x, this.rootPosition.y),
      endPosition: new Vec2(this.rootPosition.x, this.rootPosition.y + this.boneLength),
      length: this.boneLength,
      angle: 0,
      accAngle: 0,
      minAngle: 10 / RAD_2_DEG,
      maxAngle: 170 / RAD_2_DEG
    }));
    b1.addHandle();
    this.bones.push(b2 = new skeleton.Bone({
      position: new Vec2(this.rootPosition.x, this.rootPosition.y + this.boneLength),
      endPosition: new Vec2(this.rootPosition.x, this.rootPosition.y + this.boneLength * 2),
      length: this.boneLength,
      angle: 0,
      accAngle: 0,
      minAngle: -90 / RAD_2_DEG,
      maxAngle: 0 / RAD_2_DEG
    }));
    b2.parentBone = b1;
    return Arm.__super__.init.call(this);
  };

  return Arm;

})(skeleton.Limb);

skeleton.Body = (function() {

  Body.prototype.motions = null;

  Body.prototype.limbs = null;

  Body.prototype.playing = false;

  function Body() {
    this.clear();
    this;

  }

  Body.prototype.clear = function() {
    this.motions = [];
    this.limbs = [];
    return this.currentBoneIndex = 0;
  };

  Body.prototype.loadDefault = function() {
    var height, hipPos, shoulderPos, torsoLength, width;
    width = SkeletonScene.instance.options.width;
    height = SkeletonScene.instance.options.height;
    hipPos = {
      x: width / 2,
      y: height / 2
    };
    this.motions.push(this.legMotion = new geom.MotionPath({
      x: hipPos.x + 10,
      y: hipPos.y + 100
    }));
    this.limbs.push(this.leftLeg = new skeleton.Leg(hipPos, this.legMotion, 0));
    this.limbs.push(this.rightLeg = new skeleton.Leg(hipPos, this.legMotion, 1));
    torsoLength = 75;
    shoulderPos = {
      x: hipPos.x,
      y: hipPos.y - torsoLength
    };
    this.motions.push(this.armMotion = new geom.MotionPath({
      x: hipPos.x,
      y: hipPos.y
    }));
    this.limbs.push(this.leftArm = new skeleton.Arm(shoulderPos, this.armMotion, 0));
    this.limbs.push(this.rightArm = new skeleton.Arm(shoulderPos, this.armMotion, 1));
    return this.playing = true;
  };

  Body.prototype.addHumanLines = function() {
    var headDir, headPos;
    this.lineHip = new paper.Path.Line(this.limbs[0].position, this.limbs[1].position);
    this.lineHip.strokeColor = "white";
    this.lineHip.strokeWidth = 2;
    this.midHip = midPoint(this.limbs[0].position, this.limbs[1].position);
    this.lineShoulder = new paper.Path.Line(this.limbs[2].position, this.limbs[3].position);
    this.lineShoulder.strokeColor = "white";
    this.lineShoulder.strokeWidth = 2;
    this.midShoulder = midPoint(this.limbs[2].position, this.limbs[3].position);
    headDir = this.midShoulder.clone();
    headDir.x -= this.midHip.x;
    headDir.y -= this.midHip.y;
    headDir = headDir.normalize();
    headPos = this.midShoulder.clone();
    headPos.x += headDir.x * 30;
    headPos.y += headDir.y * 30;
    this.head = new paper.Path.Circle(headPos, 10);
    this.head.fillColor = "#00ff00";
    this.shapeTorso = new paper.Path();
    this.shapeTorso.add(this.limbs[0].position);
    this.shapeTorso.add(this.limbs[1].position);
    this.shapeTorso.add(this.limbs[3].position);
    this.shapeTorso.add(this.limbs[2].position);
    this.shapeTorso.closePath();
    this.shapeTorso.fillColor = "#999";
    this.shapeTorso.strokeWidth = 2;
    this.shapeTorso.strokeColor = "white";
    this.shapeTorso.sendToBack();
    return this.limbs[2].sendToBack();
  };

  Body.prototype.load = function(data) {
    var l, m, _i, _j, _len, _len1, _ref, _ref1;
    this.clear();
    _ref = data.motions;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      m = _ref[_i];
      this.motions.push(new geom.MotionPath().load(m));
    }
    _ref1 = data.limbs;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      l = _ref1[_j];
      l.motionPath = this.motions[l.pathId];
      this.limbs.push(new skeleton.Limb().load(l));
    }
    console.log("loaded!", this);
    return this.playing = true;
  };

  Body.prototype["export"] = function() {
    var data, l, m, _i, _j, _len, _len1, _ref, _ref1;
    data = {
      motions: [],
      limbs: []
    };
    _ref = this.motions;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      m = _ref[_i];
      data.motions.push(m["export"]());
    }
    _ref1 = this.limbs;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      l = _ref1[_j];
      data.limbs.push(l["export"]());
    }
    return data;
  };

  Body.prototype.update = function() {
    var l, m, _i, _j, _len, _len1, _ref, _ref1, _results;
    if (!this.playing) {
      return;
    }
    _ref = this.limbs;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      l = _ref[_i];
      l.update();
    }
    _ref1 = this.motions;
    _results = [];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      m = _ref1[_j];
      _results.push(m.update());
    }
    return _results;
  };

  return Body;

})();

skeleton.Bone = (function() {

  Bone.prototype.position = null;

  Bone.prototype.endPosition = null;

  Bone.prototype.length = null;

  Bone.prototype.angle = null;

  Bone.prototype.accAngle = null;

  Bone.prototype.minAngle = null;

  Bone.prototype.maxAngle = null;

  Bone.prototype.parentBone = null;

  Bone.prototype.line = null;

  Bone.prototype.p1 = null;

  Bone.prototype.p2 = null;

  Bone.prototype.debug = true;

  Bone.prototype.debugColor = "#999";

  Bone.prototype.constraintColor = "#ff0000";

  Bone.prototype.fillColor = "#ffffff";

  function Bone(options) {
    var _this = this;
    util.General.copyObject(options, this);
    this.p1 = new paper.Point(this.position.x, this.position.y);
    this.p2 = new paper.Point(this.endPosition.x, this.endPosition.y + 100);
    this.line = new paper.Path.Line(this.p1, this.p2);
    this.p1 = this.line.segments[0].point;
    this.p2 = this.line.segments[1].point;
    this.minLine = new paper.Path.Line(this.p1, this.p2);
    this.maxLine = new paper.Path.Line(this.p1, this.p2);
    this.minLine.strokeColor = this.constraintColor;
    this.maxLine.strokeColor = this.constraintColor;
    this.maxLine.visible = this.minLine.visible = SkeletonScene.instance.options.showConstraints;
    SkeletonScene.events.addEventListener("toggleConstraints", function() {
      return _this.toggleConstraints(SkeletonScene.instance.options.showConstraints);
    });
    SkeletonScene.events.addEventListener("toggleHandles", function() {
      if (_this.handle) {
        return _this.handle.visible = SkeletonScene.instance.options.showHandles;
      }
    });
    this.line.strokeColor = this.fillColor;
    this.line.strokeWidth = 2;
  }

  Bone.prototype.toggleConstraints = function(val) {
    this.minLine.visible = val;
    return this.maxLine.visible = val;
  };

  Bone.prototype.addHandle = function() {
    this.handle = new paper.Path.Circle(this.p1, 10);
    this.handle.position = this.p1;
    this.handle.linkVector = this.position;
    this.handle.isDraggable = true;
    this.handle.eMouseMove = this.onMoveHandle;
    this.handle.fillColor = this.debugColor;
    return this.handle.visible = SkeletonScene.instance.options.showHandles;
  };

  Bone.prototype.addFoot = function() {
    var foot;
    foot = new paper.Path();
    foot.add(new paper.Point(0, 0));
    foot.add(new paper.Point(20, 10));
    foot.add(new paper.Point(0, 10));
    foot.lastAngle = 0.0;
    this.foot = foot;
    this.foot.position = this.p2;
    return foot.fillColor = this.fillColor;
  };

  Bone.prototype.propagate = function() {
    if (this.parentBone) {
      this.position.set(this.parentBone.endPosition.x, this.parentBone.endPosition.y);
      this.accAngle = this.angle + this.parentBone.accAngle;
    } else {
      this.accAngle = this.angle;
    }
    this.endPosition.x = this.position.x + this.length * Math.cos(this.accAngle);
    this.endPosition.y = this.position.y + this.length * Math.sin(this.accAngle);
    if (this.position.y > this.ground) {
      this.position.y = this.ground;
    }
    if (this.endPosition.y > this.ground) {
      return this.endPosition.y = this.ground;
    }
  };

  Bone.prototype.drawConstraints = function() {
    var maxX, maxY, minX, minY, prevAccAngle;
    prevAccAngle = 0;
    if (this.parentBone) {
      prevAccAngle = this.parentBone.accAngle;
    }
    minX = this.position.x + 30 * Math.cos(this.minAngle + prevAccAngle);
    minY = this.position.y + 30 * Math.sin(this.minAngle + prevAccAngle);
    maxX = this.position.x + 30 * Math.cos(this.maxAngle + prevAccAngle);
    maxY = this.position.y + 30 * Math.sin(this.maxAngle + prevAccAngle);
    this.minLine.segments[0].point.x = this.position.x;
    this.minLine.segments[0].point.y = this.position.y;
    this.maxLine.segments[0].point.x = this.position.x;
    this.maxLine.segments[0].point.y = this.position.y;
    this.minLine.segments[1].point.x = minX;
    this.minLine.segments[1].point.y = minY;
    this.maxLine.segments[1].point.x = maxX;
    return this.maxLine.segments[1].point.y = maxY;
  };

  Bone.prototype["export"] = function() {
    return {
      position: this.position,
      endPosition: this.endPosition,
      length: this.length,
      angle: this.angle,
      accAngle: this.accAngle,
      minAngle: this.minAngle,
      maxAngle: this.maxAngle
    };
  };

  Bone.prototype.update = function() {
    this.p1.x = this.position.x;
    this.p1.y = this.position.y;
    this.p2.x = this.endPosition.x;
    this.p2.y = this.endPosition.y;
    return this.drawConstraints();
  };

  Bone.prototype.onMoveHandle = function(x, y) {
    this.position.x = x;
    this.position.y = y;
    this.linkVector.x = x;
    return this.linkVector.y = y;
  };

  return Bone;

})();

Vec3 = geom.Vec3;

Vec2 = geom.Vec2;

skeleton.Leg = (function(_super) {

  __extends(Leg, _super);

  function Leg(rootPosition, motionPath, targetFunc) {
    this.rootPosition = rootPosition;
    this.motionPath = motionPath;
    this.targetFunc = targetFunc;
    this.boneLength = 75;
    Leg.__super__.constructor.call(this, this.rootPosition, this.motionPath, this.targetFunc);
  }

  Leg.prototype.init = function() {
    var b1, b2;
    this.bones.push(b1 = new skeleton.Bone({
      position: new Vec2(this.rootPosition.x, this.rootPosition.y),
      endPosition: new Vec2(this.rootPosition.x, this.rootPosition.y + this.boneLength),
      length: this.boneLength,
      angle: 0,
      accAngle: 0,
      minAngle: 25 / RAD_2_DEG,
      maxAngle: 135 / RAD_2_DEG
    }));
    b1.addHandle();
    this.bones.push(b2 = new skeleton.Bone({
      position: new Vec2(this.rootPosition.x, this.rootPosition.y + this.boneLength),
      endPosition: new Vec2(this.rootPosition.x, this.rootPosition.y + this.boneLength * 2),
      length: this.boneLength,
      angle: 0,
      accAngle: 0,
      minAngle: 10 / RAD_2_DEG,
      maxAngle: 90 / RAD_2_DEG
    }));
    b2.parentBone = b1;
    return Leg.__super__.init.call(this);
  };

  return Leg;

})(skeleton.Limb);

/*

	util.Color: Basic color class for converting HSV, RGB, and HEX etc
*/


util.Color = (function() {

  function Color() {}

  Color.hexToRgb = function(a) {
    if (typeof a === "string") {
      a = a.match(/\w\w/g);
    }
    return ["0x" + a[0] - 0, "0x" + a[1] - 0, "0x" + a[2] - 0];
  };

  Color.componentToHex = function(c) {
    var hex;
    hex = c.toString(16);
    if (hex.length === 1) {
      return "0" + hex;
    } else {
      return hex;
    }
  };

  Color.rgbToHex = function(r, g, b) {
    return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
  };

  Color.hsvToHex = function(h, s, v) {
    var b, f, g, i, p, q, r, t;
    r = void 0;
    g = void 0;
    b = void 0;
    i = void 0;
    f = void 0;
    p = void 0;
    q = void 0;
    t = void 0;
    if (h && s === undefined && v === undefined) {
      s = h.s;
      v = h.v;
      h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
      case 0:
        r = v;
        g = t;
        b = p;
        break;
      case 1:
        r = q;
        g = v;
        b = p;
        break;
      case 2:
        r = p;
        g = v;
        b = t;
        break;
      case 3:
        r = p;
        g = q;
        b = v;
        break;
      case 4:
        r = t;
        g = p;
        b = v;
        break;
      case 5:
        r = v;
        g = p;
        b = q;
    }
    return this.rgbToHex(Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255));
  };

  return Color;

})();

/*

	Improved Noise: fast noise filter

	Source: http://mrl.nyu.edu/~perlin/noise/
*/


util.ImprovedNoise = (function() {
  var fade, grad, i, p;

  function ImprovedNoise() {}

  fade = function(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  };

  lerp = function(t, a, b) {
    return a + t * (b - a);
  };

  grad = function(hash, x, y, z) {
    var h, u, v;
    h = hash & 15;
    u = (h < 8 ? x : y);
    v = (h < 4 ? y : (h === 12 || h === 14 ? x : z));
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  };

  p = [151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180];

  i = 0;

  while (i < 256) {
    p[256 + i] = p[i];
    i++;
  }

  ImprovedNoise.prototype.noise = function(x, y, z) {
    var A, AA, AB, B, BA, BB, X, Y, Z, floorX, floorY, floorZ, u, v, w, xMinus1, yMinus1, zMinus1;
    floorX = ~~x;
    floorY = ~~y;
    floorZ = ~~z;
    X = floorX & 255;
    Y = floorY & 255;
    Z = floorZ & 255;
    x -= floorX;
    y -= floorY;
    z -= floorZ;
    xMinus1 = x - 1;
    yMinus1 = y - 1;
    zMinus1 = z - 1;
    u = fade(x);
    v = fade(y);
    w = fade(z);
    A = p[X] + Y;
    AA = p[A] + Z;
    AB = p[A + 1] + Z;
    B = p[X + 1] + Y;
    BA = p[B] + Z;
    BB = p[B + 1] + Z;
    return lerp(w, lerp(v, lerp(u, grad(p[AA], x, y, z), grad(p[BA], xMinus1, y, z)), lerp(u, grad(p[AB], x, yMinus1, z), grad(p[BB], xMinus1, yMinus1, z))), lerp(v, lerp(u, grad(p[AA + 1], x, y, zMinus1), grad(p[BA + 1], xMinus1, y, z - 1)), lerp(u, grad(p[AB + 1], x, yMinus1, zMinus1), grad(p[BB + 1], xMinus1, yMinus1, zMinus1))));
  };

  return ImprovedNoise;

})();

improvedNoise = new util.ImprovedNoise();
