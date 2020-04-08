"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createUnequalNumber = exports.createUnequal = void 0;

var _factory = require("../../utils/factory");

var _algorithm = require("../../type/matrix/utils/algorithm03");

var _algorithm2 = require("../../type/matrix/utils/algorithm07");

var _algorithm3 = require("../../type/matrix/utils/algorithm12");

var _algorithm4 = require("../../type/matrix/utils/algorithm14");

var _algorithm5 = require("../../type/matrix/utils/algorithm13");

var name = 'unequal';
var dependencies = ['typed', 'config', 'equalScalar', 'matrix', 'DenseMatrix'];
var createUnequal =
/* #__PURE__ */
(0, _factory.factory)(name, dependencies, function (_ref) {
  var typed = _ref.typed,
      config = _ref.config,
      equalScalar = _ref.equalScalar,
      matrix = _ref.matrix,
      DenseMatrix = _ref.DenseMatrix;
  var algorithm03 = (0, _algorithm.createAlgorithm03)({
    typed: typed
  });
  var algorithm07 = (0, _algorithm2.createAlgorithm07)({
    typed: typed,
    DenseMatrix: DenseMatrix
  });
  var algorithm12 = (0, _algorithm3.createAlgorithm12)({
    typed: typed,
    DenseMatrix: DenseMatrix
  });
  var algorithm13 = (0, _algorithm5.createAlgorithm13)({
    typed: typed
  });
  var algorithm14 = (0, _algorithm4.createAlgorithm14)({
    typed: typed
  });
  /**
   * Test whether two values are unequal.
   *
   * The function tests whether the relative difference between x and y is
   * larger than the configured epsilon. The function cannot be used to compare
   * values smaller than approximately 2.22e-16.
   *
   * For matrices, the function is evaluated element wise.
   * In case of complex numbers, x.re must unequal y.re, or x.im must unequal y.im.
   * Strings are compared by their numerical value.
   *
   * Values `null` and `undefined` are compared strictly, thus `null` is unequal
   * with everything except `null`, and `undefined` is unequal with everything
   * except `undefined`.
   *
   * Syntax:
   *
   *    math.unequal(x, y)
   *
   * Examples:
   *
   *    math.unequal(2 + 2, 3)       // returns true
   *    math.unequal(2 + 2, 4)       // returns false
   *
   *    const a = math.unit('50 cm')
   *    const b = math.unit('5 m')
   *    math.unequal(a, b)           // returns false
   *
   *    const c = [2, 5, 1]
   *    const d = [2, 7, 1]
   *
   *    math.unequal(c, d)           // returns [false, true, false]
   *    math.deepEqual(c, d)         // returns false
   *
   *    math.unequal(0, null)        // returns true
   * See also:
   *
   *    equal, deepEqual, smaller, smallerEq, larger, largerEq, compare
   *
   * @param  {number | BigNumber | Fraction | boolean | Complex | Unit | string | Array | Matrix | undefined} x First value to compare
   * @param  {number | BigNumber | Fraction | boolean | Complex | Unit | string | Array | Matrix | undefined} y Second value to compare
   * @return {boolean | Array | Matrix} Returns true when the compared values are unequal, else returns false
   */

  var unequal = typed('unequal', {
    'any, any': function anyAny(x, y) {
      // strict equality for null and undefined?
      if (x === null) {
        return y !== null;
      }

      if (y === null) {
        return x !== null;
      }

      if (x === undefined) {
        return y !== undefined;
      }

      if (y === undefined) {
        return x !== undefined;
      }

      return _unequal(x, y);
    },
    'SparseMatrix, SparseMatrix': function SparseMatrixSparseMatrix(x, y) {
      return algorithm07(x, y, _unequal);
    },
    'SparseMatrix, DenseMatrix': function SparseMatrixDenseMatrix(x, y) {
      return algorithm03(y, x, _unequal, true);
    },
    'DenseMatrix, SparseMatrix': function DenseMatrixSparseMatrix(x, y) {
      return algorithm03(x, y, _unequal, false);
    },
    'DenseMatrix, DenseMatrix': function DenseMatrixDenseMatrix(x, y) {
      return algorithm13(x, y, _unequal);
    },
    'Array, Array': function ArrayArray(x, y) {
      // use matrix implementation
      return unequal(matrix(x), matrix(y)).valueOf();
    },
    'Array, Matrix': function ArrayMatrix(x, y) {
      // use matrix implementation
      return unequal(matrix(x), y);
    },
    'Matrix, Array': function MatrixArray(x, y) {
      // use matrix implementation
      return unequal(x, matrix(y));
    },
    'SparseMatrix, any': function SparseMatrixAny(x, y) {
      return algorithm12(x, y, _unequal, false);
    },
    'DenseMatrix, any': function DenseMatrixAny(x, y) {
      return algorithm14(x, y, _unequal, false);
    },
    'any, SparseMatrix': function anySparseMatrix(x, y) {
      return algorithm12(y, x, _unequal, true);
    },
    'any, DenseMatrix': function anyDenseMatrix(x, y) {
      return algorithm14(y, x, _unequal, true);
    },
    'Array, any': function ArrayAny(x, y) {
      // use matrix implementation
      return algorithm14(matrix(x), y, _unequal, false).valueOf();
    },
    'any, Array': function anyArray(x, y) {
      // use matrix implementation
      return algorithm14(matrix(y), x, _unequal, true).valueOf();
    }
  });

  function _unequal(x, y) {
    return !equalScalar(x, y);
  }

  return unequal;
});
exports.createUnequal = createUnequal;
var createUnequalNumber = (0, _factory.factory)(name, ['typed', 'equalScalar'], function (_ref2) {
  var typed = _ref2.typed,
      equalScalar = _ref2.equalScalar;
  return typed(name, {
    'any, any': function anyAny(x, y) {
      // strict equality for null and undefined?
      if (x === null) {
        return y !== null;
      }

      if (y === null) {
        return x !== null;
      }

      if (x === undefined) {
        return y !== undefined;
      }

      if (y === undefined) {
        return x !== undefined;
      }

      return !equalScalar(x, y);
    }
  });
});
exports.createUnequalNumber = createUnequalNumber;