// webpack.config.cjs
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin"); // Import the plugin
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  entry: "./src/main.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.[contenthash].js", // Add contenthash for caching
    publicPath: "/",
    clean: true, // Clean the dist folder before each build
  },
  mode: process.env.NODE_ENV || 'development', // Set mode dynamically
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|svg|ico)$/i,
        type: "asset/resource",
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "public",
          to: "", // Copies to the root of the dist folder
          globOptions: {
            ignore: ["**/index.html"], // Don't copy index.html again
          },
        },
      ],
    }),
    // new BundleAnalyzerPlugin(), 
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    compress: true,
    port: Number(process.env.PORT) || 8080,
    host: '0.0.0.0',
    allowedHosts: 'all',
    open: true,
    hot: true,
    historyApiFallback: true, // Important for single-page apps with routing
  },
  // Add performance hints configuration (optional, adjusts warnings)
  performance: {
    maxAssetSize: 500000, // 500 KiB
    maxEntrypointSize: 500000, // 500 KiB
    hints: "warning", // Show warnings instead of errors
  },
  // Add optimization for code splitting (if you used React.lazy)
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
};