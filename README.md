# DOM-Wars
Turn-Based Strategy Game Experimentation leveraging most just the DOM.
Site made using VueJS (with vue-router, vuex) and Google's MDL.

### Branches
- `master` is used as the primary branch where development occurs.
- `gh-pages` is used by github as the source branch for the page hosting.

When a deployment is required, simply execute `npm run deploy` from the `master` branch.
Under the hood, this will build and export the `/dist` directory into the `gh-pages` branch, which then allow it to be served via GitHub :)

`npm run deploy` is only necessary whenever a deployment is required.

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# run unit tests
npm run unit

# run all tests
npm test

# Deploy to github pages
npm run deploy
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
