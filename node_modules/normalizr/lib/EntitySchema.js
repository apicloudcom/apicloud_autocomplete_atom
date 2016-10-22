'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EntitySchema = function () {
  function EntitySchema(key) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, EntitySchema);

    if (!key || typeof key !== 'string') {
      throw new Error('A string non-empty key is required');
    }

    this._key = key;
    this._assignEntity = options.assignEntity;

    var idAttribute = options.idAttribute || 'id';
    this._getId = typeof idAttribute === 'function' ? idAttribute : function (x) {
      return x[idAttribute];
    };
    this._idAttribute = idAttribute;
    this._meta = options.meta;
    this._defaults = options.defaults;
  }

  _createClass(EntitySchema, [{
    key: 'getAssignEntity',
    value: function getAssignEntity() {
      return this._assignEntity;
    }
  }, {
    key: 'getKey',
    value: function getKey() {
      return this._key;
    }
  }, {
    key: 'getId',
    value: function getId(entity) {
      return this._getId(entity);
    }
  }, {
    key: 'getIdAttribute',
    value: function getIdAttribute() {
      return this._idAttribute;
    }
  }, {
    key: 'getMeta',
    value: function getMeta(prop) {
      if (!prop || typeof prop !== 'string') {
        throw new Error('A string non-empty property name is required');
      }
      return this._meta && this._meta[prop];
    }
  }, {
    key: 'getDefaults',
    value: function getDefaults() {
      return this._defaults;
    }
  }, {
    key: 'define',
    value: function define(nestedSchema) {
      for (var key in nestedSchema) {
        if (nestedSchema.hasOwnProperty(key)) {
          this[key] = nestedSchema[key];
        }
      }
    }
  }]);

  return EntitySchema;
}();

exports.default = EntitySchema;