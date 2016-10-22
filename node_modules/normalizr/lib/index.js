'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Schema = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.arrayOf = arrayOf;
exports.valuesOf = valuesOf;
exports.unionOf = unionOf;
exports.normalize = normalize;

var _EntitySchema = require('./EntitySchema');

var _EntitySchema2 = _interopRequireDefault(_EntitySchema);

var _IterableSchema = require('./IterableSchema');

var _IterableSchema2 = _interopRequireDefault(_IterableSchema);

var _UnionSchema = require('./UnionSchema');

var _UnionSchema2 = _interopRequireDefault(_UnionSchema);

var _isEqual = require('lodash/isEqual');

var _isEqual2 = _interopRequireDefault(_isEqual);

var _isObject = require('lodash/isObject');

var _isObject2 = _interopRequireDefault(_isObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function defaultAssignEntity(normalized, key, entity) {
  normalized[key] = entity;
}

function visitObject(obj, schema, bag, options) {
  var _options$assignEntity = options.assignEntity;
  var assignEntity = _options$assignEntity === undefined ? defaultAssignEntity : _options$assignEntity;


  var defaults = schema && schema.getDefaults && schema.getDefaults();
  var schemaAssignEntity = schema && schema.getAssignEntity && schema.getAssignEntity();
  var normalized = (0, _isObject2.default)(defaults) ? _extends({}, defaults) : {};
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      var entity = visit(obj[key], schema[key], bag, options);
      assignEntity.call(null, normalized, key, entity, obj, schema);
      if (schemaAssignEntity) {
        schemaAssignEntity.call(null, normalized, key, entity, obj, schema);
      }
    }
  }
  return normalized;
}

function defaultMapper(iterableSchema, itemSchema, bag, options) {
  return function (obj) {
    return visit(obj, itemSchema, bag, options);
  };
}

function polymorphicMapper(iterableSchema, itemSchema, bag, options) {
  return function (obj) {
    var schemaKey = iterableSchema.getSchemaKey(obj);
    var result = visit(obj, itemSchema[schemaKey], bag, options);
    return { id: result, schema: schemaKey };
  };
}

function visitIterable(obj, iterableSchema, bag, options) {
  var itemSchema = iterableSchema.getItemSchema();
  var curriedItemMapper = defaultMapper(iterableSchema, itemSchema, bag, options);

  if (Array.isArray(obj)) {
    return obj.map(curriedItemMapper);
  } else {
    return Object.keys(obj).reduce(function (objMap, key) {
      objMap[key] = curriedItemMapper(obj[key]);
      return objMap;
    }, {});
  }
}

function visitUnion(obj, unionSchema, bag, options) {
  var itemSchema = unionSchema.getItemSchema();
  return polymorphicMapper(unionSchema, itemSchema, bag, options)(obj);
}

function defaultMergeIntoEntity(entityA, entityB, entityKey) {
  for (var key in entityB) {
    if (!entityB.hasOwnProperty(key)) {
      continue;
    }

    if (!entityA.hasOwnProperty(key) || (0, _isEqual2.default)(entityA[key], entityB[key])) {
      entityA[key] = entityB[key];
      continue;
    }

    console.warn('When merging two ' + entityKey + ', found unequal data in their "' + key + '" values. Using the earlier value.', entityA[key], entityB[key]);
  }
}

function visitEntity(entity, entitySchema, bag, options) {
  var _options$mergeIntoEnt = options.mergeIntoEntity;
  var mergeIntoEntity = _options$mergeIntoEnt === undefined ? defaultMergeIntoEntity : _options$mergeIntoEnt;


  var entityKey = entitySchema.getKey();
  var id = entitySchema.getId(entity);

  if (!bag.hasOwnProperty(entityKey)) {
    bag[entityKey] = {};
  }

  if (!bag[entityKey].hasOwnProperty(id)) {
    bag[entityKey][id] = {};
  }

  var stored = bag[entityKey][id];
  var normalized = visitObject(entity, entitySchema, bag, options);
  mergeIntoEntity(stored, normalized, entityKey);

  return id;
}

function visit(obj, schema, bag, options) {
  if (!(0, _isObject2.default)(obj) || !(0, _isObject2.default)(schema)) {
    return obj;
  }

  if (schema instanceof _EntitySchema2.default) {
    return visitEntity(obj, schema, bag, options);
  } else if (schema instanceof _IterableSchema2.default) {
    return visitIterable(obj, schema, bag, options);
  } else if (schema instanceof _UnionSchema2.default) {
    return visitUnion(obj, schema, bag, options);
  } else {
    return visitObject(obj, schema, bag, options);
  }
}

function arrayOf(schema, options) {
  return new _IterableSchema2.default(schema, options);
}

function valuesOf(schema, options) {
  return new _IterableSchema2.default(schema, options);
}

function unionOf(schema, options) {
  return new _UnionSchema2.default(schema, options);
}

exports.Schema = _EntitySchema2.default;
function normalize(obj, schema) {
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  if (!(0, _isObject2.default)(obj)) {
    throw new Error('Normalize accepts an object or an array as its input.');
  }

  if (!(0, _isObject2.default)(schema) || Array.isArray(schema)) {
    throw new Error('Normalize accepts an object for schema.');
  }

  var bag = {};
  var result = visit(obj, schema, bag, options);

  return {
    entities: bag,
    result: result
  };
}