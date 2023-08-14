"use strict";

var _app = require("firebase-admin/app");
var _config = require("./config");
var _firebaseAdmin = require("firebase-admin");
(0, _app.initializeApp)({
  credential: _firebaseAdmin.credential.cert({
    projectId: _config.FIREBASE_PROJECT_ID,
    privateKey: _config.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: _config.FIREBASE_CLIENT_EMAIL
  })
});