# Instructions

## Installation

To be able to use this frontend code for Angular 2, you need to:

1. Install the latest `node`
2. Install the latest `npm`
3. Install the project dependencies
   - In the terminal, go to the `angular` directory (this one) and execute `$ npm install`. This should install project dependencies locally. If you wish, you can add the `-g` flag to make the installation global.
4. Compile the TypeScript code

### Caution

When installing `npm`, `node` or the TypeScript compiler (`tsc`, through the dependencies) it's not uncommon to install old versions. Make sure you have at least:

- `node` >= v4.x.x
- `npm` >= 3.x.x
- `tsc` >= 2.x.x

If you don't have these versions, you may encounter unintuitive errors.

## Usage

Once you have finished the installation, you can compile your code with `$ tsc` in the terminal while being in the directory for the Angular 2 code (this directory). To avoid having to re-run the compilation process everytime you make a change to the code, you can leave a terminal open with the command `$ tsc -w`. This will continously compile the code for you whenever you make changes.

## Resources

- Angular 2 documentation: https://angular.io/docs/ts/latest/
- TypeScript documentation: https://www.typescriptlang.org/docs/tutorial.html

## Careful with typos

It's very hard to relate the errors to the typos, so be careful and program incrementally.

## Print JSON objects to DOM

It's easier to diagnose what's going on.

## Careful with the syntax

":" vs "="

## There's no form checking right now

Could be included later

## There are no safeguards if moving around
