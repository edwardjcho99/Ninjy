"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAddScalar = void 0;

var _factory = require("../../utils/factory");

var _number = require("../../plain/number");

var name = 'addScalar';
var dependencies = ['typed'];
var createAddScalar =
/* #__PURE__ */
(0, _factory.factory)(name, dependencies, function (_ref) {
  var typed = _ref.typed;

  /**
   * Add two scalar values, `x + y`.
   * This function is meant for internal use: it is used by the public function
   * `add`
   *
   * This function does not support collections (Array or Matrix).
   *
   * @param  {number | BigNumber | Fraction | Complex | Unit} x   First value to add
   * @param  {number | BigNumber | Fraction | Complex} y          Second value to add
   * @return {number | BigNumber | Fraction | Complex | Unit}     Sum of `x` and `y`
   * @private
   */
  var addScalar = typed(name, {
    'number, number': _number.addNumber,
    'Complex, Complex': function ComplexComplex(x, y) {
      return x.add(y);
    },
    'BigNumber, BigNumber': function BigNumberBigNumber(x, y) {
      return x.plus(y);
    },
    'Fraction, Fraction': function FractionFraction(x, y) {
      return x.add(y);
    },
    'Unit, Unit': function UnitUnit(x, y) {
      if (x.value === null || x.value === undefined) throw new Error('Parameter x contains a unit with undefined value');
      if (y.value === null || y.value === undefined) throw new Error('Parameter y contains a unit with undefined value');
      if (!x.equalBase(y)) throw new Error('Units do not match');
      var res = x.clone();
      res.value = addScalar(res.value, y.value);
      res.fixPrefix = false;
      return res;
    }
  });
  return addScalar;
});
exports.createAddScalar = createAddScalar;