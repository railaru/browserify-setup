#  Browserify & Gulp setup

This is a lean & simple front end setup intended to help you quickly get up & running with website projects. 
It utilizes **core technology first** appraoch, meaning there are no heavy libraries added like Bootstrap, jQuery, Tailwind, etc. 
Vanilla JS is used for basic DOM operations and CSS Grid is used for layout. 

## Features

 - Compile [Sass](https://sass-lang.com/)  to CSS
 - Bundle all individual JS files to 1 file
 - ES6 modules
 - Generate a font out individual SVG files for scaling, fast color changing, good browser support (IE10+)
 - CSS autoprefixing
 
## Getting Started

These instructions will get you a copy of the project up and running on your local machine. 
Start by installing all dependancies using the NPM.
Make sure you have  [Node.js ](https://nodejs.org/en/) installed and run the following inside */src* directory:

```
npm i
```

### Pre-development 
**! Skip this step** if you're not using custom SVG icons

```
gulp iconfont
```

### Development 
This watches sass and js files,  bundles, minifies and adds a sourcemap to them.
```
gulp dev
```

### Development ES6
This does all of the above but also allows you to use modern Javascript features as well as frameworks & libraries like [React](https://reactjs.org/) and [Vue](https://vuejs.org/). 
*(The reason for 2 seperate tasks is the lenghty compiliation process when compiling ES6 which is not always needed)*
```
gulp dev--modular-js
```
### Production 
This adds sourcemaps to ES6 and vendor prefixes to the CSS. For CSS grid options reffer to: [autoprefixer](https://github.com/postcss/autoprefixer#grid-autoplacement-support-in-ie).
```
gulp production
```

## Built With

* [Node.js](https://gulpjs.com/) - Node.js® is a JavaScript runtime built on [Chrome's V8 JavaScript engine](https://v8.dev/).
* [Gulp](https://gulpjs.com/) - Gulp is a toolkit for automating time-consuming tasks in your development workflow.
* [Browserify](http://browserify.org/) - Browserify lets you require('modules') in the browser by bundling up all of your dependencies.

## Authors

 - [Rutenis Raila](https://github.com/railaru)   
 - [Bartek Laskowski](https://github.com/und3rdg)
