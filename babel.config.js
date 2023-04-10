module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
                targets: {
                    esmodules: true,
                    node: 'current'
                }
            }
        ]
    ],
    plugins: [
        ['@babel/plugin-proposal-decorators', { legacy: true }]
    ]
};
