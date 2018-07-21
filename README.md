# Fanavard 97 Contest, UI Development 1397


## Personal Information:
**GroupName:** Arsh

**Leader:** Jafar Rezaei
**Phone:** 09147426907
**Email:** bomber.man87@yahoo.com

**Team Members** : Jafar Rezaei, Mohammad Toosi, Jafar Akhondali
## Project Information - Technology:

* ES6 browser compatible features[Without using babel as transpiler]
* Webpack as module bundler and dev server
* Jasmine - A unit test framework for javascript
* Karma - A test Runner framework which supports jasmine
* JsDoc3 - Generate api documents by parsing comments and source code
* tui-jsdoc-template - A template for JsDoc3 with search ability
* AesJs - A library to do AES encryption in pure javascript
* Some more github sources with MIT licence

 
 ---- 
**Installation Guide:**  
 *Using YARN(RECOMMENDED):*   
 `yarn install`
 
 *Using NPM:*   
 `npm install` 
 
 Tip : node version should be one of : `6.14.0 || ^8.10.0 || >=9.10`
 if it is not : 
 ```bash
 npm install nvm -g
 nvm install 8.10.0
 nvm use 8.10.0
 ```
 ----
**Usage:** 
 - Execute dev server: `yarn start`
 - Build dist files for production use `yarn build`

 
 ----
 **Unit Test**
 - Run unit tests: `yarn test`
 - View unit test results in your browser: `yarn view-test`
  
 
 ----
 **Api Documents**
  : Actually you can see the wiki and api-doc by clicking on bottom links that provided to , on game loader
  main page bottom. but if you want.
  
  Generate api-doc :
  - Generate API-DOCS: `yarn generate-docs`
  - View API-Docs in your browser: `yarn view-docs`
  
  Generate gitbook : 
  - `cd wiki/`
  - `npm i gitbook-cli -g`
  - `gitbook install`
  - `gitbook serve`
