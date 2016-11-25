/*---------------
Required Setup
---------------*/
var gulp = require('gulp'),
// Watches single files
watch = require('gulp-watch'),
gulpShopify = require('gulp-shopify-upload'),
// Grabs API credentials
config = require('./config.json');

/*---------------
Shopify
---------------*/
gulp.task('shopifywatch', function() {
  var options = {
    "basePath": "./Timber/"
  };

  return watch('./Timber/+(assets|layout|config|snippets|templates|locales)/**')
  .pipe(gulpShopify(config.shopify_api_key, config.shopify_api_password, config.shopify_url, null, options));
});

/*---------------
Run Gulp
---------------*/
gulp.task('default', [
  'shopifywatch'
]);
