/*

Basic color class for converting HSV, RGB, and HEX etc

*/

var HSVColor;

HSVColor = (function() {

  function HSVColor() {}

  HSVColor.hexToRgb = function(a) {
    if (typeof a === "string") {
      a = a.match(/\w\w/g);
    }
    return ["0x" + a[0] - 0, "0x" + a[1] - 0, "0x" + a[2] - 0];
  };

  HSVColor.componentToHex = function(c) {
    var hex;
    hex = c.toString(16);
    if (hex.length === 1) {
      return "0" + hex;
    } else {
      return hex;
    }
  };

  HSVColor.rgbToHex = function(r, g, b) {
    return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
  };

  HSVColor.hsvToHex = function(h, s, v) {
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

  return HSVColor;

})();
