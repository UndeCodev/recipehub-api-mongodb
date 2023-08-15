"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateRecipe = exports.searchTerm = exports.getRecipesByAuthor = exports.getRecipes = exports.getRecipeByName = exports.getRecipeById = exports.deleteRecipe = exports.createRecipe = void 0;
var _mongoose = require("mongoose");
var _imagekit = require("../utils/imagekit");
var _Recipe = _interopRequireDefault(require("../models/Recipe"));
var _Category = _interopRequireDefault(require("../models/Category"));
var _User = _interopRequireDefault(require("../models/User"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; } // Models
var getRecipes = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(req, res) {
    var recipes;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return _Recipe["default"].find().select('title category totalTime images').populate({
            path: 'author',
            select: 'name rol images',
            populate: [{
              path: 'rol',
              select: {
                _id: 0
              }
            }]
          }).populate({
            path: 'category',
            select: {
              _id: 0
            }
          });
        case 3:
          recipes = _context.sent;
          if (recipes.length) {
            _context.next = 6;
            break;
          }
          return _context.abrupt("return", res.status(404).json({
            message: 'No hay recetas por mostrar.'
          }));
        case 6:
          res.json(recipes);
          _context.next = 12;
          break;
        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](0);
          res.status(409).json({
            message: _context.t0.message
          });
        case 12:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 9]]);
  }));
  return function getRecipes(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
exports.getRecipes = getRecipes;
var getRecipeByName = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(req, res) {
    var category, categoryFound, recipesFound;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          category = req.params.category;
          _context2.prev = 1;
          if (category) {
            _context2.next = 4;
            break;
          }
          return _context2.abrupt("return", res.status(400).json({
            message: 'Falta la categoría a buscar.'
          }));
        case 4:
          _context2.next = 6;
          return _Category["default"].findOne({
            category: {
              $in: category
            }
          });
        case 6:
          categoryFound = _context2.sent;
          if (categoryFound) {
            _context2.next = 9;
            break;
          }
          return _context2.abrupt("return", res.status(404).json({
            message: 'No se encontró ninguna categoría con este nombre.'
          }));
        case 9:
          _context2.next = 11;
          return _Recipe["default"].find({
            category: {
              $in: categoryFound._id
            }
          }).select('title category totalTime images').populate({
            path: 'category',
            select: {
              _id: 0
            }
          }).populate({
            path: 'author',
            select: 'name images rol',
            populate: {
              path: 'rol',
              select: {
                _id: 0
              }
            }
          });
        case 11:
          recipesFound = _context2.sent;
          if (recipesFound) {
            _context2.next = 14;
            break;
          }
          return _context2.abrupt("return", res.status(404).json({
            message: 'No se encontraron recetas con esta categoría.'
          }));
        case 14:
          res.json(recipesFound);
          _context2.next = 20;
          break;
        case 17:
          _context2.prev = 17;
          _context2.t0 = _context2["catch"](1);
          res.status(409).json({
            message: _context2.t0.message
          });
        case 20:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[1, 17]]);
  }));
  return function getRecipeByName(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
exports.getRecipeByName = getRecipeByName;
var getRecipeById = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
    var id, recipeFound;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          id = req.params.id;
          _context3.prev = 1;
          if (id) {
            _context3.next = 4;
            break;
          }
          return _context3.abrupt("return", res.status(400).json({
            message: 'Falta la categoría a buscar.'
          }));
        case 4:
          _context3.next = 6;
          return _Recipe["default"].findById(id).populate({
            path: 'category',
            select: {
              _id: 0
            }
          }).populate({
            path: 'author',
            select: 'name images rol',
            populate: {
              path: 'rol',
              select: {
                _id: 0
              }
            }
          });
        case 6:
          recipeFound = _context3.sent;
          if (recipeFound) {
            _context3.next = 9;
            break;
          }
          return _context3.abrupt("return", res.status(404).json({
            message: 'No se encontró ninguna receta con este ID.'
          }));
        case 9:
          res.json(recipeFound);
          _context3.next = 15;
          break;
        case 12:
          _context3.prev = 12;
          _context3.t0 = _context3["catch"](1);
          res.status(409).json({
            message: _context3.t0.message
          });
        case 15:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[1, 12]]);
  }));
  return function getRecipeById(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();
exports.getRecipeById = getRecipeById;
var searchTerm = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(req, res) {
    var searchTerm, recipes;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          searchTerm = req.query.searchTerm;
          _context4.prev = 1;
          if (searchTerm) {
            _context4.next = 4;
            break;
          }
          return _context4.abrupt("return", res.json(null));
        case 4:
          _context4.t0 = _Recipe["default"];
          _context4.t1 = {
            title: {
              $regex: searchTerm,
              $options: 'i'
            }
          };
          _context4.t2 = {
            description: {
              $regex: searchTerm,
              $options: 'i'
            }
          };
          _context4.next = 9;
          return _Category["default"].findOne({
            category: {
              $regex: searchTerm,
              $options: 'i'
            }
          }).select('_id');
        case 9:
          _context4.t3 = _context4.sent;
          _context4.t4 = {
            category: _context4.t3
          };
          _context4.t5 = [_context4.t1, _context4.t2, _context4.t4];
          _context4.t6 = {
            $or: _context4.t5
          };
          _context4.next = 15;
          return _context4.t0.find.call(_context4.t0, _context4.t6).select('_id title').limit(5);
        case 15:
          recipes = _context4.sent;
          res.json(recipes);
          _context4.next = 22;
          break;
        case 19:
          _context4.prev = 19;
          _context4.t7 = _context4["catch"](1);
          res.status(409).json({
            message: _context4.t7.message
          });
        case 22:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[1, 19]]);
  }));
  return function searchTerm(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();
exports.searchTerm = searchTerm;
var getRecipesByAuthor = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(req, res) {
    var id, userFound;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          id = req.params.id;
          _context5.prev = 1;
          if (id) {
            _context5.next = 4;
            break;
          }
          return _context5.abrupt("return", res.status(404).json({
            message: 'Falta el ID del autor.'
          }));
        case 4:
          if ((0, _mongoose.isValidObjectId)(id)) {
            _context5.next = 6;
            break;
          }
          return _context5.abrupt("return", res.status(400).json({
            message: 'El ID del autor proporcionado no es válido.'
          }));
        case 6:
          _context5.next = 8;
          return _User["default"].findOne({
            _id: {
              $in: id
            }
          }).populate({
            path: 'recipes',
            select: 'title category totalTime author images',
            populate: [{
              path: 'author',
              select: 'name images rol',
              populate: {
                path: 'rol',
                select: {
                  _id: 0
                }
              }
            }, {
              path: 'category',
              select: {
                _id: 0
              }
            }]
          }).select('recipes');
        case 8:
          userFound = _context5.sent;
          if (userFound) {
            _context5.next = 11;
            break;
          }
          return _context5.abrupt("return", res.status(404).json({
            message: 'No se encontró ningún usuario con este ID.'
          }));
        case 11:
          res.json(userFound.recipes);
          _context5.next = 17;
          break;
        case 14:
          _context5.prev = 14;
          _context5.t0 = _context5["catch"](1);
          res.status(409).json({
            message: _context5.t0.message
          });
        case 17:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[1, 14]]);
  }));
  return function getRecipesByAuthor(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();
exports.getRecipesByAuthor = getRecipesByAuthor;
var updateRecipe = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req, res) {
    var id, category, categoryUpdated;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          id = req.params.id;
          category = req.body.category;
          _context6.prev = 2;
          if ((0, _mongoose.isValidObjectId)(id)) {
            _context6.next = 5;
            break;
          }
          return _context6.abrupt("return", res.status(400).json({
            message: 'El id proporcionado no es válido.'
          }));
        case 5:
          if (category) {
            _context6.next = 7;
            break;
          }
          return _context6.abrupt("return", res.status(400).json({
            message: 'Falta el campo de la categoría a modificar.'
          }));
        case 7:
          _context6.next = 9;
          return _Category["default"].findByIdAndUpdate(id, {
            category: category
          }, {
            "new": true
          });
        case 9:
          categoryUpdated = _context6.sent;
          if (categoryUpdated) {
            _context6.next = 12;
            break;
          }
          return _context6.abrupt("return", res.status(404).json({
            message: 'No se encontró ninguna categoría con este id.'
          }));
        case 12:
          res.json(categoryUpdated);
          _context6.next = 18;
          break;
        case 15:
          _context6.prev = 15;
          _context6.t0 = _context6["catch"](2);
          res.status(409).json({
            message: _context6.t0.message
          });
        case 18:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[2, 15]]);
  }));
  return function updateRecipe(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();
exports.updateRecipe = updateRecipe;
var deleteRecipe = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(req, res) {
    var id, recipeDeleted;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          id = req.params.id;
          _context7.prev = 1;
          if ((0, _mongoose.isValidObjectId)(id)) {
            _context7.next = 4;
            break;
          }
          return _context7.abrupt("return", res.status(400).json({
            message: 'El id proporcionado no es válido.'
          }));
        case 4:
          _context7.next = 6;
          return _Recipe["default"].findByIdAndDelete(id);
        case 6:
          recipeDeleted = _context7.sent;
          if (recipeDeleted) {
            _context7.next = 9;
            break;
          }
          return _context7.abrupt("return", res.status(404).json({
            message: 'No se encontró ninguna receta con este id.'
          }));
        case 9:
          _context7.next = 11;
          return _User["default"].findByIdAndUpdate(recipeDeleted.author, {
            $pull: {
              recipes: recipeDeleted._id
            }
          });
        case 11:
          res.sendStatus(204);
          _context7.next = 17;
          break;
        case 14:
          _context7.prev = 14;
          _context7.t0 = _context7["catch"](1);
          res.status(409).json({
            message: _context7.t0.message
          });
        case 17:
        case "end":
          return _context7.stop();
      }
    }, _callee7, null, [[1, 14]]);
  }));
  return function deleteRecipe(_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}();
exports.deleteRecipe = deleteRecipe;
var createRecipe = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8(req, res) {
    var _req$body, title, description, category, servings, yieldRecipe, totalTime, ingredients, steps, times, videoURL, userId, file, _newRecipe$yieldRecip, _newRecipe$videoURL, recipeFound, categoryFound, authorFound, newRecipe, _yield$uploadImage, fileId, photoURL, thumbnailUrl, recipeSaved, userUpdated;
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _req$body = req.body, title = _req$body.title, description = _req$body.description, category = _req$body.category, servings = _req$body.servings, yieldRecipe = _req$body.yieldRecipe, totalTime = _req$body.totalTime, ingredients = _req$body.ingredients, steps = _req$body.steps, times = _req$body.times, videoURL = _req$body.videoURL, userId = _req$body.userId;
          file = req.file;
          _context8.prev = 2;
          if (file) {
            _context8.next = 5;
            break;
          }
          return _context8.abrupt("return", res.status(404).json({
            message: 'Imagen de portada de receta necesaria.'
          }));
        case 5:
          if ((0, _mongoose.isValidObjectId)(category)) {
            _context8.next = 7;
            break;
          }
          return _context8.abrupt("return", res.status(404).json({
            message: 'Id de la categoría no válido.'
          }));
        case 7:
          _context8.next = 9;
          return _Recipe["default"].findOne({
            title: {
              $in: title
            }
          });
        case 9:
          recipeFound = _context8.sent;
          if (!recipeFound) {
            _context8.next = 12;
            break;
          }
          return _context8.abrupt("return", res.status(404).json({
            message: 'Ya existe una receta con este nombre.'
          }));
        case 12:
          _context8.next = 14;
          return _Category["default"].findById(category);
        case 14:
          categoryFound = _context8.sent;
          if (categoryFound) {
            _context8.next = 17;
            break;
          }
          return _context8.abrupt("return", res.status(404).json({
            message: 'Categoría no encontrada.'
          }));
        case 17:
          if ((0, _mongoose.isValidObjectId)(userId)) {
            _context8.next = 19;
            break;
          }
          return _context8.abrupt("return", res.status(404).json({
            message: 'Id del usuario no válido.'
          }));
        case 19:
          _context8.next = 21;
          return _User["default"].findOne({
            _id: {
              $in: userId
            }
          });
        case 21:
          authorFound = _context8.sent;
          if (authorFound) {
            _context8.next = 24;
            break;
          }
          return _context8.abrupt("return", res.status(404).json({
            message: 'Autor no encontrado.'
          }));
        case 24:
          // Body of the new recipe
          newRecipe = new _Recipe["default"]({
            title: title,
            description: description,
            category: categoryFound._id,
            servings: servings,
            totalTime: totalTime,
            ingredients: JSON.parse(ingredients),
            steps: JSON.parse(steps),
            times: JSON.parse(times),
            author: authorFound._id
          }); // Optional parameters
          (_newRecipe$yieldRecip = newRecipe.yieldRecipe) !== null && _newRecipe$yieldRecip !== void 0 ? _newRecipe$yieldRecip : newRecipe.yieldRecipe = yieldRecipe;
          (_newRecipe$videoURL = newRecipe.videoURL) !== null && _newRecipe$videoURL !== void 0 ? _newRecipe$videoURL : newRecipe.videoURL = videoURL;

          // Upload cover recipe
          _context8.next = 29;
          return (0, _imagekit.uploadImage)({
            folder: 'recipes',
            filePath: file.path,
            fileName: file.filename
          });
        case 29:
          _yield$uploadImage = _context8.sent;
          fileId = _yield$uploadImage.fileId;
          photoURL = _yield$uploadImage.photoURL;
          thumbnailUrl = _yield$uploadImage.thumbnailUrl;
          newRecipe.images = {
            fileId: fileId,
            photoURL: photoURL,
            thumbnailUrl: thumbnailUrl
          };
          _context8.next = 36;
          return newRecipe.save();
        case 36:
          recipeSaved = _context8.sent;
          _context8.next = 39;
          return _User["default"].findByIdAndUpdate(newRecipe.author, {
            $push: {
              recipes: recipeSaved._id
            }
          });
        case 39:
          userUpdated = _context8.sent;
          if (userUpdated) {
            _context8.next = 42;
            break;
          }
          return _context8.abrupt("return", res.status(404).json({
            message: 'No se pudo guardar la receta con el usuario.'
          }));
        case 42:
          res.json(recipeSaved);
          _context8.next = 48;
          break;
        case 45:
          _context8.prev = 45;
          _context8.t0 = _context8["catch"](2);
          res.status(409).json({
            message: _context8.t0.message
          });
        case 48:
        case "end":
          return _context8.stop();
      }
    }, _callee8, null, [[2, 45]]);
  }));
  return function createRecipe(_x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}();
exports.createRecipe = createRecipe;