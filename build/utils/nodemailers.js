"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _nodemailer = _interopRequireDefault(require("nodemailer"));
var _config = require("./config");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var transporter = _nodemailer["default"].createTransport({
  service: 'gmail',
  auth: {
    user: _config.EMAIL,
    pass: _config.PASSWORD
  }
});
var _default = transporter;
exports["default"] = _default;