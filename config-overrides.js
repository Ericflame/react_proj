//配置具体的修改规则
const { override, fixBabelImports,addLessLoader,addDecoratorsLegacy} = require('customize-cra');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
	}),
	addLessLoader({
			javascriptEnabled: true,
			modifyVars: { '@primary-color': '#fcc2d7' },
	}),
	addDecoratorsLegacy()
);