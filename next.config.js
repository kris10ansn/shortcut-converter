const withSASS = require("@zeit/next-sass");
const withCSS = require("@zeit/next-css");
module.exports = withCSS(
    withSASS({
        cssModules: true,
    })
);
