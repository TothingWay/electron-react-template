const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin')
module.exports = {
  babel: {
    plugins: [
      [
        'import',
        {
          libraryName: 'antd',
          libraryDirectory: 'lib',
          style: 'css',
        },
      ],
    ],
  },
  webpack: {
    plugins: [
      new AntdDayjsWebpackPlugin({
        preset: 'antdv3',
      }),
    ],
  },
}
