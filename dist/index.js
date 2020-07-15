"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _conventionalCommitTypes = require("conventional-commit-types");

var _commitizen = require("commitizen");

var _engine = _interopRequireDefault(require("./engine"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var config = _commitizen.configLoader.load() || {};
var options = {
  types: config.types || _conventionalCommitTypes.types,
  defaultType: process.env.CZ_TYPE || config.defaultType,
  defaultScope: process.env.CZ_SCOPE || config.defaultScope,
  defaultSubject: process.env.CZ_SUBJECT || config.defaultSubject,
  defaultBody: process.env.CZ_BODY || config.defaultBody,
  defaultIssues: process.env.CZ_ISSUES || config.defaultIssues,
  disableScopeLowerCase: process.env.DISABLE_SCOPE_LOWERCASE || config.disableScopeLowerCase,
  maxHeaderWidth: process.env.CZ_MAX_HEADER_WIDTH && parseInt(process.env.CZ_MAX_HEADER_WIDTH) || config.maxHeaderWidth || 100,
  maxLineWidth: process.env.CZ_MAX_LINE_WIDTH && parseInt(process.env.CZ_MAX_LINE_WIDTH) || config.maxLineWidth || 100
};

(function (options) {
  try {
    var commitlintLoad = require('@commitlint/load');

    commitlintLoad().then(function (clConfig) {
      if (clConfig.rules) {
        var maxHeaderLengthRule = clConfig.rules['header-max-length'];

        if (_typeof(maxHeaderLengthRule) === 'object' && maxHeaderLengthRule.length >= 3 && !process.env.CZ_MAX_HEADER_WIDTH && !config.maxHeaderWidth) {
          options.maxHeaderWidth = maxHeaderLengthRule[2];
        }
      }
    });
  } catch (err) {}
})(options);

var _default = (0, _engine["default"])(options);

exports["default"] = _default;