'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _isObject = require('lodash/isObject');

var _isObject2 = _interopRequireDefault(_isObject);

var _UnionSchema = require('./UnionSchema');

var _UnionSchema2 = _interopRequireDefault(_UnionSchema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ArraySchema = function () {
  function ArraySchema(itemSchema) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, ArraySchema);

    if (!(0, _isObject2.default)(itemSchema)) {
      throw new Error('ArraySchema requires item schema to be an object.');
    }

    if (options.schemaAttribute) {
      var schemaAttribute = options.schemaAttribute;
      this._itemSchema = new _UnionSchema2.default(itemSchema, { schemaAttribute: schemaAttribute });
    } else {
      this._itemSchema = itemSchema;
    }
  }

  _createClass(ArraySchema, [{
    key: 'getItemSchema',
    value: function getItemSchema() {
      return this._itemSchema;
    }
  }]);

  return ArraySchema;
}();

exports.default = ArraySchema;