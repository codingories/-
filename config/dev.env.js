"use strict";
const merge = require("webpack-merge");
const prodEnv = require("./prod.env");

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_API: '"https://47.100.124.12/"'
  BASE_API: '"https://pcxjyey.shseer.com/"'
});
