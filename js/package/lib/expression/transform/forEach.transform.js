"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createForEachTransform = void 0;

var _is = require("../../utils/is");

var _function = require("../../utils/function");

var _array = require("../../utils/array");

var _factory = require("../../utils/factory");

var _compileInlineExpression = require("./utils/compileInlineExpression");

var name = 'forEach';
var dependencies = ['typed'];
var createForEachTransform =
/* #__PURE__ */
(0, _factory.factory)(name, dependencies, function (_ref) {
  var typed = _ref.typed;

  /**
   * Attach a transform function to math.forEach
   * Adds a property transform containing the transform function.
   *
   * This transform creates a one-based index instead of a zero-based index
   */
  function forEachTransform(args, math, scope) {
    var x, callback;

    if (args[0]) {
      x = args[0].compile().evaluate(scope);
    }

    if (args[1]) {
      if ((0, _is.isSymbolNode)(args[1]) || (0, _is.isFunctionAssignmentNode)(args[1])) {
        // a function pointer, like forEach([3, -2, 5], myTestFunction)
        callback = args[1].compile().evaluate(scope);
      } else {
        // an expression like forEach([3, -2, 5], x > 0 ? callback1(x) : callback2(x) )
        callback = (0, _compileInlineExpression.compileInlineExpression)(args[1], math, scope);
      }
    }

    return _forEach(x, callback);
  }

  forEachTransform.rawArgs = true; // one-based version of forEach

  var _forEach = typed('forEach', {
    'Array | Matrix, function': function ArrayMatrixFunction(array, callback) {
      // figure out what number of arguments the callback function expects
      var args = (0, _function.maxArgumentCount)(callback);

      var recurse = function recurse(value, index) {
        if (Array.isArray(value)) {
          (0, _array.forEach)(value, function (child, i) {
            // we create a copy of the index array and append the new index value
            recurse(child, index.concat(i + 1)); // one based index, hence i+1
          });
        } else {
          // invoke the callback function with the right number of arguments
          if (args === 1) {
            callback(value);
          } else if (args === 2) {
            callback(value, index);
          } else {
            // 3 or -1
            callback(value, index, array);
          }
        }
      };

      recurse(array.valueOf(), []); // pass Array
    }
  });

  return forEachTransform;
}, {
  isTransformFunction: true
});
exports.createForEachTransform = createForEachTransform;