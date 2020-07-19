<img width="100%"  src="assets/header.png">

# cz-custom-changelog

[![npm package][npm-image]][npm-url] [![npm downloads](https://img.shields.io/npm/dt/rn-ticker.svg)](https://www.npmjs.com/package/rn-ticker)

## Install

```
npm install -g cz-custom-changelog
```

## Configuration

This is a fork from cz-conventional-changelog

### package.json

Like commitizen, you specify the configuration of cz-custom-changelog through the package.json's `config.commitizen` key.

```json5
{
// ...  default values
    "config": {
        "commitizen": {
            "path": "./node_modules/cz-custom-changelog",
            "maxHeaderWidth": 72,
            "maxLineWidth": 100,
            "defaultType": "",
            "defaultScope": "",
            "defaultSubject": "",
            "defaultBody": "",
            "defaultIssues": "",
            "types": {
              ...
              "feat": {
                "description": "A new feature",
                "title": "Features"
              },
              ...
            }
        }
    }
// ...
}
```

### Environment variables

The following environment varibles can be used to override any default configuration or package.json based configuration.

- CZ_TYPE = defaultType
- CZ_SCOPE = defaultScope
- CZ_SUBJECT = defaultSubject
- CZ_SUBJECT_LETTER_CASE = defaultSubject
- CZ_BODY = defaultBody
- CZ_MAX_HEADER_WIDTH = maxHeaderWidth
- CZ_MAX_LINE_WIDTH = maxLineWidth

### Commitlint

If using the [commitlint](https://github.com/custom-changelog/commitlint) js library, the "maxHeaderWidth" configuration property will default to the configuration of the "header-max-length" rule instead of the hard coded value of 100. This can be ovewritten by setting the 'maxHeaderWidth' configuration in package.json or the CZ_MAX_HEADER_WIDTH environment variable.

<!-- Markdown link & img dfn's -->

[npm-image]: https://img.shields.io/npm/v/cz-custom-changelog.svg?style=flat-square
[npm-url]: https://www.npmjs.org/package/cz-custom-changelog
[npm-downloads]: https://img.shields.io/npm/dm/datadog-metrics.svg?style=flat-square
