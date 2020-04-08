"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createDeprecatedVar = exports.createVariance = void 0;

var _collection = require("../../utils/collection");

var _is = require("../../utils/is");

var _factory = require("../../utils/factory");

var _improveErrorMessage = require("./utils/improveErrorMessage");

var _log = require("../../utils/log");

var DEFAULT_NORMALIZATION = 'unbiased';
var name = 'variance';
var dependencies = ['typed', 'add', 'subtract', 'multiply', 'divide', 'apply', 'isNaN'];
var createVariance =
/* #__PURE__ */
(0, _factory.factory)(name, dependencies, function (_ref) {
  var typed = _ref.typed,
      add = _ref.add,
      subtract = _ref.subtract,
      multiply = _ref.multiply,
      divide = _ref.divide,
      apply = _ref.apply,
      isNaN = _ref.isNaN;

  /**
   * Compute the variance of a matrix or a  list with values.
   * In case of a (multi dimensional) array or matrix, the variance over all
   * elements will be calculated.
   *
   * Additionally, it is possible to compute the variance along the rows
   * or columns of a matrix by specifying the dimension as the second argument.
   *
   * Optionally, the type of normalization can be specified as the final
   * parameter. The parameter `normalization` can be one of the following values:
   *
   * - 'unbiased' (default) The sum of squared errors is divided by (n - 1)
   * - 'uncorrected'        The sum of squared errors is divided by n
   * - 'biased'             The sum of squared errors is divided by (n + 1)
   *
   *
   * Note that older browser may not like the variable name `var`. In that
   * case, the function can be called as `math['var'](...)` instead of
   * `math.var(...)`.
   *
   * Syntax:
   *
   *     math.variance(a, b, c, ...)
   *     math.variance(A)
   *     math.variance(A, normalization)
   *     math.variance(A, dimension)
   *     math.variance(A, dimension, normalization)
   *
   * Examples:
   *
   *     math.variance(2, 4, 6)                     // returns 4
   *     math.variance([2, 4, 6, 8])                // returns 6.666666666666667
   *     math.variance([2, 4, 6, 8], 'uncorrected') // returns 5
   *     math.variance([2, 4, 6, 8], 'biased')      // returns 4
   *
   *     math.variance([[1, 2, 3], [4, 5, 6]])      // returns 3.5
   *     math.variance([[1, 2, 3], [4, 6, 8]], 0)   // returns [4.5, 8, 12.5]
   *     math.variance([[1, 2, 3], [4, 6, 8]], 1)   // returns [1, 4]
   *     math.variance([[1, 2, 3], [4, 6, 8]], 1, 'biased') // returns [0.5, 2]
   *
   * See also:
   *
   *    mean, median, max, min, prod, std, sum
   *
   * @param {Array | Matrix} array
   *                        A single matrix or or multiple scalar values
   * @param {string} [normalization='unbiased']
   *                        Determines how to normalize the variance.
   *                        Choose 'unbiased' (default), 'uncorrected', or 'biased'.
   * @param dimension {number | BigNumber}
   *                        Determines the axis to compute the variance for a matrix
   * @return {*} The variance
   */
  return typed(name, {
    // variance([a, b, c, d, ...])
    'Array | Matrix': function ArrayMatrix(array) {
      return _var(array, DEFAULT_NORMALIZATION);
    },
    // variance([a, b, c, d, ...], normalization)
    'Array | Matrix, string': _var,
    // variance([a, b, c, c, ...], dim)
    'Array | Matrix, number | BigNumber': function ArrayMatrixNumberBigNumber(array, dim) {
      return _varDim(array, dim, DEFAULT_NORMALIZATION);
    },
    // variance([a, b, c, c, ...], dim, normalization)
    'Array | Matrix, number | BigNumber, string': _varDim,
    // variance(a, b, c, d, ...)
    '...': function _(args) {
      return _var(args, DEFAULT_NORMALIZATION);
    }
  });
  /**
   * Recursively calculate the variance of an n-dimensional array
   * @param {Array} array
   * @param {string} normalization
   *                        Determines how to normalize the variance:
   *                        - 'unbiased'    The sum of squared errors is divided by (n - 1)
   *                        - 'uncorrected' The sum of squared errors is divided by n
   *                        - 'biased'      The sum of squared errors is divided by (n + 1)
   * @return {number | BigNumber} variance
   * @private
   */

  function _var(array, normalization) {
    var sum = 0;
    var num = 0;

    if (array.length === 0) {
      throw new SyntaxError('Function variance requires one or more parameters (0 provided)');
    } // calculate the mean and number of elements


    (0, _collection.deepForEach)(array, function (value) {
      try {
        sum = add(sum, value);
        num++;
      } catch (err) {
        throw (0, _improveErrorMessage.improveErrorMessage)(err, 'variance', value);
      }
    });
    if (num === 0) throw new Error('Cannot calculate variance of an empty array');
    var mean = divide(sum, num); // calculate the variance

    sum = 0;
    (0, _collection.deepForEach)(array, function (value) {
      var diff = subtract(value, mean);
      sum = add(sum, multiply(diff, diff));
    });

    if (isNaN(sum)) {
      return sum;
    }

    switch (normalization) {
      case 'uncorrected':
        return divide(sum, num);

      case 'biased':
        return divide(sum, num + 1);

      case 'unbiased':
        {
          var zero = (0, _is.isBigNumber)(sum) ? sum.mul(0) : 0;
          return num === 1 ? zero : divide(sum, num - 1);
        }

      default:
        throw new Error('Unknown normalization "' + normalization + '". ' + 'Choose "unbiased" (default), "uncorrected", or "biased".');
    }
  }

  function _varDim(array, dim, normalization) {
    try {
      if (array.length === 0) {
        throw new SyntaxError('Function variance requires one or more parameters (0 provided)');
      }

      return apply(array, dim, function (x) {
        return _var(x, normalization);
      });
    } catch (err) {
      throw (0, _improveErrorMessage.improveErrorMessage)(err, 'variance');
    }
  }
}); // For backward compatibility, deprecated since version 6.0.0. Date: 2018-11-09

exports.createVariance = createVariance;
var createDeprecatedVar =
/* #__PURE__ */
(0, _factory.factory)('var', ['variance'], function (_ref2) {
  var variance = _ref2.variance;
  return function () {
    (0, _log.warnOnce)('Function "var" has been renamed to "variance" in v6.0.0, please use the new function instead.');

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return variance.apply(variance, args);
  };
});
exports.createDeprecatedVar = createDeprecatedVar;