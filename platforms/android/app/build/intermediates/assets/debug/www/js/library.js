function convert(r, g, b) {
    var h = Math.tan((3 * (g - b)) / ((r - g) + (r - b)));
    var v = ((r + g + b) / 3);
    var s = 1 - ((Math.min(r, g, b)) / v);
    return {h: h, s: s, v: v};
}