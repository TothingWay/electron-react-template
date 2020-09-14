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
}
