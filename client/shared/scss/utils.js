const path = require('path');

const resources = ['_common.scss', '_variables.scss', '_colors.scss', '_mixins.scss'];

module.exports = resources.map(file => path.resolve(__dirname, file));
