"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.multerUpload = void 0;
var _multer = _interopRequireDefault(require("multer"));
var _path = require("path");
var _uuid = require("uuid");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var MIMETYPES = ['image/jpg', 'image/png', 'image/jpeg', 'image/webp'];
var storage = _multer["default"].diskStorage({
  destination: (0, _path.join)(__dirname, '../../uploads'),
  filename: function filename(_, file, cb) {
    var fileExtension = (0, _path.extname)(file.originalname);
    cb(null, "".concat((0, _uuid.v4)()).concat(fileExtension));
  }
});
var fileFilter = function fileFilter(_, file, cb) {
  if (MIMETYPES.includes(file.mimetype)) cb(null, true);else cb('Solo archivos con la extensión: jpg, jpeg, png, webp.');
};
var multerUpload = (0, _multer["default"])({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fieldSize: 10000000
  }
});
exports.multerUpload = multerUpload;