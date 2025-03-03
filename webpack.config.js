const path = require("path");

module.exports = [
    // CommonJS Build
    {
        entry: "./src/editable-form/editable-form-bootstrap5.js",
        output: {
            path: path.resolve(__dirname, "dist/bootstrap5-editable/js"),
            filename: "bootstrap-editable.js",
            library: {
                type: "commonjs2"
            }
        },
        module: {
            rules: [
                {
                    test: /\.css$/i,
                    use: ["style-loader", "css-loader"],
                }
            ]
        }
    },

    // ES Module Build
    {
        entry: "./src/editable-form/editable-form-bootstrap5.js",
        output: {
            path: path.resolve(__dirname, "dist/bootstrap5-editable/js"),
            filename: "bootstrap-editable.esm.js",
            library: {
                type: "module"
            }
        },
        experiments: {
            outputModule: true, // Ensures Webpack treats this as an ES module
        },
        module: {
            rules: [
                {
                    test: /\.css$/i,
                    use: ["style-loader", "css-loader"],
                }
            ]
        }
    }
];