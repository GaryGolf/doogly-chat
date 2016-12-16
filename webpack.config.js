const path = require('path')
const debug = process.env.NODE_ENV !== 'production'

module.exports = {

	context: path.resolve(__dirname,'src'),
	entry: {
		client: './client/index'
	},
	output: {
		path: path.resolve(__dirname,'public'),
		filename: 'bundle.js'
	},
	devtool:  debug ? 'source-map' : null ,
	resolve: {
			extensions: ['','.js','.jsx','.ts','.tsx']
	},
	module: {
		loaders: [
			{ test: /\.tsx?$/, include: [path.resolve(__dirname,'src/client')], loader: 'ts', }
		],
		preLoaders: [
			// All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
			{ test: /\.tsx?$/, loader: "source-map-loader" }
		]
	},
	plugins: [
  	],
	externals: {
		'react': 'React',
		'react-dom': 'ReactDOM',
		'socket.io-client': 'io'
	}
}