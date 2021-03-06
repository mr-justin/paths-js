// Generated by uRequire v0.7.0-beta.15 target: 'dist' template: 'nodejs'
(function () {
  
var __isAMD = !!(typeof define === 'function' && define.amd),
    __isNode = (typeof exports === 'object'),
    __isWeb = !__isNode;

var Polygon = require('./polygon');

module.exports = (function () {
  return function (arg) {
    var bottom, left, right, top;
    left = arg.left, right = arg.right, top = arg.top, bottom = arg.bottom;
    return Polygon({
      points: [
        [
          right,
          top
        ],
        [
          right,
          bottom
        ],
        [
          left,
          bottom
        ],
        [
          left,
          top
        ]
      ],
      closed: true
    });
  };
}).call(this);


}).call(this)