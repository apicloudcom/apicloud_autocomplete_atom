'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _isObject = require('lodash/isObject');

var _isObject2 = _interopRequireDefault(_isObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UnionSchema = function () {
  function UnionSchema(itemSchema, options) {
    _classCallCheck(this, UnionSchema);

    if (!(0, _isObject2.default)(itemSchema)) {
      throw new Error('UnionSchema requires item schema to be an object.');
    }

    if (!options || !options.schemaAttribute) {
      throw new Error('UnionSchema requires schemaAttribute option.');
    }

    this._itemSchema = itemSchema;

    var schemaAttribute = options.schemaAttribute;
    this._getSchema = typeof schemaAttribute === 'function' ? schemaAttribute : function (x) {
      return x[schemaAttribute];
    };
  }

  _createClass(UnionSchema, [{
    key: 'getItemSchema',
    value: function getItemSchema() {
      return this._itemSchema;
    }
  }, {
    key: 'getSchemaKey',
    value: function getSchemaKey(item) {
      return this._getSchema(item);
    }
  }]);

  return UnionSchema;
}();

exports.default = UnionSchema;