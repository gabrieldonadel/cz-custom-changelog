"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _wordWrap = _interopRequireDefault(require("word-wrap"));

var _longest = _interopRequireDefault(require("longest"));

var _chalk = require("chalk");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var filter = function filter(array) {
  return array.filter(function (x) {
    return x;
  });
};

var headerLength = function headerLength(_ref) {
  var type = _ref.type,
      scope = _ref.scope;
  return type.length + 2 + (scope ? scope.length + 2 : 0);
};

var maxSummaryLength = function maxSummaryLength(options, answers) {
  return options.maxHeaderWidth - headerLength(answers);
};

var filterSubject = function filterSubject(subject) {
  subject = subject.trim();
  var firstChar = subject.charAt(0);

  if (firstChar.toUpperCase() !== firstChar) {
    // toUpperCase // toLowerCase
    subject = firstChar.toUpperCase() + subject.slice(1, subject.length);
  }

  while (subject.endsWith('.')) {
    subject = subject.slice(0, subject.length - 1);
  }

  return subject;
};

var _default = function _default(options) {
  var types = options.types;
  var length = (0, _longest["default"])(Object.keys(types)).length + 1;
  var choices = Object.entries(types).map(function (_ref2) {
    var _ref3 = _slicedToArray(_ref2, 2),
        key = _ref3[0],
        type = _ref3[1];

    return {
      name: (key + ':').padEnd(length) + ' ' + type.description,
      value: key
    };
  });
  return {
    // When a user runs `git cz`, prompter will
    // be executed. We pass you cz, which currently
    // is just an instance of inquirer.js. Using
    // this you can ask questions and get answers.
    //
    // The commit callback should be executed when
    // you're ready to send back a commit template
    // to git.
    //
    // By default, we'll de-indent your commit
    // template and will keep empty lines.
    prompter: function prompter(cz, commit) {
      // Let's ask some questions of the user
      // so that we can populate our commit
      // template.
      //
      // See inquirer.js docs for specifics.
      // You can also opt to use another input
      // collection library if you prefer.
      cz.prompt([{
        type: 'list',
        name: 'type',
        message: "Select the type of change that you're committing:",
        choices: choices,
        "default": options.defaultType
      }, {
        type: 'input',
        name: 'scope',
        message: 'What is the scope of this change (e.g. component or file name): (press enter to skip)',
        "default": options.defaultScope,
        filter: function filter(value) {
          return options.disableScopeLowerCase ? value.trim() : value.trim().toLowerCase();
        }
      }, {
        type: 'input',
        name: 'subject',
        message: function message(answers) {
          return 'Write a short, imperative tense description of the change (max ' + maxSummaryLength(options, answers) + ' chars):\n';
        },
        "default": options.defaultSubject,
        validate: function validate(subject, answers) {
          var filteredSubject = filterSubject(subject);
          return filteredSubject.length == 0 ? 'subject is required' : filteredSubject.length <= maxSummaryLength(options, answers) ? true : 'Subject length must be less than or equal to ' + maxSummaryLength(options, answers) + ' characters. Current length is ' + filteredSubject.length + ' characters.';
        },
        transformer: function transformer(subject, answers) {
          var filteredSubject = filterSubject(subject);
          var color = filteredSubject.length <= maxSummaryLength(options, answers) ? _chalk.green : _chalk.red;
          return color('(' + filteredSubject.length + ') ' + subject);
        },
        filter: filterSubject
      }, {
        type: 'input',
        name: 'body',
        message: 'Provide a longer description of the change: (press enter to skip)\n',
        "default": options.defaultBody
      }, {
        type: 'confirm',
        name: 'isBreaking',
        message: 'Are there any breaking changes?',
        "default": false
      }, {
        type: 'input',
        name: 'breakingBody',
        "default": '-',
        message: 'A BREAKING CHANGE commit requires a body. Please enter a longer description of the commit itself:\n',
        when: function when(answers) {
          return answers.isBreaking && !answers.body;
        },
        validate: function validate(breakingBody, answers) {
          return breakingBody.trim().length > 0 || 'Body is required for BREAKING CHANGE';
        }
      }, {
        type: 'input',
        name: 'breaking',
        message: 'Describe the breaking changes:\n',
        when: function when(answers) {
          return answers.isBreaking;
        }
      }, {
        type: 'confirm',
        name: 'isIssueAffected',
        message: 'Does this change affect any open issues?',
        "default": !!options.defaultIssues
      }, {
        type: 'input',
        name: 'issuesBody',
        "default": '-',
        message: 'If issues are closed, the commit requires a body. Please enter a longer description of the commit itself:\n',
        when: function when(answers) {
          return answers.isIssueAffected && !answers.body && !answers.breakingBody;
        }
      }, {
        type: 'input',
        name: 'issues',
        message: 'Add issue references (e.g. "fix #123", "re #123".):\n',
        when: function when(_ref4) {
          var isIssueAffected = _ref4.isIssueAffected;
          return isIssueAffected;
        },
        "default": options.defaultIssues ? options.defaultIssues : undefined
      }]).then(function (answers) {
        var wrapOptions = {
          trim: true,
          cut: false,
          newline: '\n',
          indent: '',
          width: options.maxLineWidth
        }; // parentheses are only needed when a scope is present

        var scope = answers.scope ? '(' + answers.scope + ')' : ''; // Hard limit this line in the validate

        var head = answers.type + scope + ': ' + answers.subject; // Wrap these lines at options.maxLineWidth characters

        var body = answers.body ? (0, _wordWrap["default"])(answers.body, wrapOptions) : false; // Apply breaking change prefix, removing it if already present

        var breaking = answers.breaking ? answers.breaking.trim() : '';
        breaking = breaking ? 'BREAKING CHANGE: ' + breaking.replace(/^BREAKING CHANGE: /, '') : '';
        breaking = breaking ? (0, _wordWrap["default"])(breaking, wrapOptions) : false;
        var issues = answers.issues ? (0, _wordWrap["default"])(answers.issues, wrapOptions) : false;
        commit(filter([head, body, breaking, issues]).join('\n\n'));
      });
    }
  };
};

exports["default"] = _default;