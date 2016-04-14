# module [![NPM version](http://img.shields.io/npm/v/module.svg?style=flat-square)](https://www.npmjs.org/package/module)

Generate the minimal skeleton/boilerplate of a new Node.js module.

## Installation

Install the package with NPM:

```bash
$ npm install -g module
```

## Usage

Example:

```bash
# Create a module in the current working directory:
$ module

# Create a module in the "hello" directory (relative path):
$ module hello

# Create a module in the "hello" directory (absolute path):
$ module /tmp/hello
```

If the specified directory doesn't exist yet, it will be automatically created.
