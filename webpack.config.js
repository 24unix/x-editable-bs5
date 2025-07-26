const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = [
    // Main bundle (jQuery, Bootstrap, App)
    {
        entry: {
            jquery: "jquery",
            app: "./test.js",
        },
        output: {
            path: path.resolve(__dirname, "dist"), // Place them directly in dist/
            filename: "[name].js", // app.js, jquery.js, bootstrap.js
        },
        resolve: {
            alias: {
                jquery: path.resolve(__dirname, "node_modules/jquery"),
                bootstrap: path.resolve(__dirname, "node_modules/bootstrap"),
                "bootstrap5-editable": path.resolve(__dirname, "dist/bootstrap5-editable")
            }
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: ["style-loader", "css-loader"]
                },
                {
                    test: /\.(woff|woff2|eot|ttf|svg)$/,
                    type: "asset/resource",
                    generator: {
                        filename: "fonts/[name][ext]"
                    }
                }
            ]
        },
        plugins: [
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                "window.jQuery": "jquery",
                bootstrap: "bootstrap",
                "window.bootstrap": "bootstrap"
            }),
            new CopyWebpackPlugin({
                patterns: [
                    { from: "src/editable-form/editable-form.css", to: path.resolve(__dirname, "dist/bootstrap5-editable/css") },
                    { from: "node_modules/bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css", to: path.resolve(__dirname, "dist/bootstrap5-editable/css") },
                    { from: "node_modules/bootstrap-icons/font/fonts", to: path.resolve(__dirname, "dist/fonts") }
                ]
            })
        ]
    },

    // X-Editable Plugin (Bootstrap 5)
    {
        entry: "./src/bootstrap5-editable.js",
        output: {
            path: path.resolve(__dirname, "dist/bootstrap5-editable/js"), // X-Editable stays here
            filename: "bootstrap-editable.js",
            library: {
                name: "EditableForm",
                type: "umd"
            }
        },
        resolve: {
            alias: {
                jquery: path.resolve(__dirname, "node_modules/jquery"),
                bootstrap: path.resolve(__dirname, "node_modules/bootstrap")
            }
        }
    }
];