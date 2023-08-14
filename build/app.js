"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _morgan = _interopRequireDefault(require("morgan"));
var _cors = _interopRequireDefault(require("cors"));
var _initialSetup = require("./libs/initialSetup");
var _authRoutes = _interopRequireDefault(require("./routes/auth.routes.js"));
var _category = _interopRequireDefault(require("./routes/category.routes"));
var _recipe = _interopRequireDefault(require("./routes/recipe.routes"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
// Routes

var app = (0, _express["default"])();
(0, _initialSetup.createRoles)();
app.use((0, _cors["default"])());
app.use(_express["default"].json());
app.use((0, _morgan["default"])('dev'));

// Routes
app.use('/auth', _authRoutes["default"]);
app.use('/category', _category["default"]);
app.use('/recipe', _recipe["default"]);
var _default = app;
exports["default"] = _default;