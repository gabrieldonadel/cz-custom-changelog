import wrap from 'word-wrap'
import { green, red } from 'chalk'

const filter = array => array.filter(x => x)

const headerLength = ({ type, scope }) => type.length + 2 + (scope ? scope.length + 2 : 0)

const maxSummaryLength = (options, answers) => options.maxHeaderWidth - headerLength(answers)

export default options => {
  const { types } = options

  const length = Object.keys(types).reduce((res, x) => (x.length > res ? x.length : res), 0) + 1

  const choices = Object.entries(types).map(([key, type]) => ({
    name: (key + ':').padEnd(length) + ' ' + type.description,
    value: key,
  }))

  const filterSubject = subject => {
    subject = subject.trim()
    const firstChar = subject.charAt(0)
    const transformedFirstChar = options.defaultSubjectLowerCase
      ? firstChar.toLowerCase()
      : firstChar.toUpperCase()

    if (transformedFirstChar !== firstChar) {
      subject = transformedFirstChar + subject.slice(1, subject.length)
    }
    while (subject.endsWith('.')) {
      subject = subject.slice(0, subject.length - 1)
    }
    return subject
  }

  return {
    prompter: (cz, commit) => {
      cz.prompt([
        {
          type: 'list',
          name: 'type',
          message: "Select the type of change that you're committing:",
          choices,
          default: options.defaultType,
        },
        {
          type: 'input',
          name: 'scope',
          message:
            'What is the scope of this change (e.g. component or file name): (press enter to skip)',
          default: options.defaultScope,
          filter: value =>
            options.disableScopeLowerCase ? value.trim() : value.trim().toLowerCase(),
        },
        {
          type: 'input',
          name: 'subject',
          message: answers =>
            'Write a short, imperative tense description of the change (max ' +
            maxSummaryLength(options, answers) +
            ' chars):\n',
          default: options.defaultSubject,
          validate: (subject, answers) => {
            const filteredSubject = filterSubject(subject)
            return filteredSubject.length == 0
              ? 'subject is required'
              : filteredSubject.length <= maxSummaryLength(options, answers)
              ? true
              : 'Subject length must be less than or equal to ' +
                maxSummaryLength(options, answers) +
                ' characters. Current length is ' +
                filteredSubject.length +
                ' characters.'
          },
          transformer: (subject, answers) => {
            const filteredSubject = filterSubject(subject)
            const color = filteredSubject.length <= maxSummaryLength(options, answers) ? green : red
            return color(`(${filteredSubject.length}) ${subject}`)
          },
          filter: filterSubject,
        },
        {
          type: 'input',
          name: 'body',
          message: 'Provide a longer description of the change: (press enter to skip)\n',
          default: options.defaultBody,
        },
        {
          type: 'confirm',
          name: 'isBreaking',
          message: 'Are there any breaking changes?',
          default: false,
        },
        {
          type: 'input',
          name: 'breakingBody',
          default: '-',
          message:
            'A BREAKING CHANGE commit requires a body. Please enter a longer description of the commit itself:\n',
          when: answers => answers.isBreaking && !answers.body,
          validate: (breakingBody, answers) =>
            breakingBody.trim().length > 0 || 'Body is required for BREAKING CHANGE',
        },
        {
          type: 'input',
          name: 'breaking',
          message: 'Describe the breaking changes:\n',
          when: answers => answers.isBreaking,
        },

        {
          type: 'confirm',
          name: 'isIssueAffected',
          message: 'Does this change affect any open issues?',
          default: !!options.defaultIssues,
        },
        {
          type: 'input',
          name: 'issuesBody',
          default: '-',
          message:
            'If issues are closed, the commit requires a body. Please enter a longer description of the commit itself:\n',
          when: answers => answers.isIssueAffected && !answers.body && !answers.breakingBody,
        },
        {
          type: 'input',
          name: 'issues',
          message: 'Add issue references (e.g. "fix #123", "re #123".):\n',
          when: ({ isIssueAffected }) => isIssueAffected,
          default: options.defaultIssues ? options.defaultIssues : undefined,
        },
      ]).then(answers => {
        const wrapOptions = {
          trim: true,
          cut: false,
          newline: '\n',
          indent: '',
          width: options.maxLineWidth,
        }

        // parentheses are only needed when a scope is present
        const scope = answers.scope ? '(' + answers.scope + ')' : ''

        // Hard limit this line in the validate
        const head = answers.type + scope + ': ' + answers.subject

        // Wrap these lines at options.maxLineWidth characters
        const body = answers.body ? wrap(answers.body, wrapOptions) : false

        // Apply breaking change prefix, removing it if already present
        let breaking = false
        if (answers.breaking && answers.breaking.trim()) {
          breaking = wrap(
            'BREAKING CHANGE: ' + answers.breaking.trim().replace(/^BREAKING CHANGE: /, ''),
            wrapOptions
          )
        }

        const issues = answers.issues ? wrap(answers.issues, wrapOptions) : false

        commit(filter([head, body, breaking, issues]).join('\n\n'))
      })
    },
  }
}
