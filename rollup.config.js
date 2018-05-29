// import statements
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import sass from 'rollup-plugin-sass';
import autoprefixer from 'autoprefixer';
import postcss from 'postcss';
import livereload from 'rollup-plugin-livereload';
import serve from 'rollup-plugin-serve';
import commonjs from 'rollup-plugin-commonjs';

const input = [
	'src/accordion.js', 
	'src/main2.js'
]

export default {
	input: input,
	output: {
		dir: 'dist',
		format: 'cjs',
		// sourcemap:true
	},
	experimentalCodeSplitting: true,
	experimentalDynamicImport: true,
	plugins: [
		serve(),
		livereload({
			watch: 'dist'
		}),
		commonjs(),
		resolve(),
		babel(),
		sass({
			processor: css => postcss([autoprefixer])
				.process(css)
				.then(result => result.css),
			output: 'bundle.css'
	  })
	]
 };