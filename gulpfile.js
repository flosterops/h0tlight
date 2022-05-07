const folders = {
	build  : "build/",
	source : "source/"
};
const browsersyncSettings = {
	server: folders.build,
	port: 8001,
	ui: { port: 8002 },
	notify: true,
	open: false
};

const { dest, parallel, series, src, watch } = require('gulp');
const gulp_autoprefixer = require('autoprefixer');
const gulp_browsersync  = require('browser-sync');
const gulp_del          = require('del');
const gulp_fs           = require('graceful-fs');
const gulp_concat       = require('gulp-concat');
const gulp_copy         = require('gulp-copy');
const gulp_data         = require('gulp-data');
const gulp_eslint       = require('gulp-eslint');
const gulp_htmlmin      = require('gulp-htmlmin');
const gulp_nunjucks     = require('gulp-nunjucks');
const gulp_postcss      = require('gulp-postcss');
const gulp_rename       = require('gulp-rename');
const gulp_sass         = require('gulp-sass');
const gulp_sourcemaps   = require('gulp-sourcemaps');
const gulp_uglify       = require('gulp-uglify');




function clean() {
	return gulp_del(folders.build + "*");
}




function copy() {
	return src([
			folders.source + "**/.htaccess",
			folders.source + "**/*.html",
			folders.source + "**/robots.txt",
			folders.source + "**/sitemap.xml",
			folders.source + "assets/download/**",
			folders.source + "assets/fonts/**",
			folders.source + "assets/icons/**",
			folders.source + "assets/img/**",
			folders.source + "assets/pdf/**",
			folders.source + "assets/videos/**"
		])
		.pipe(gulp_copy(folders.build, { prefix: 1 }))
}




function javascript() {
	var scripts = gulp_fs.readFileSync(folders.source + 'assets/js/scripts.js', 'utf8')
		.replace(/\s/g, '')
		.replace(/\n/g, '')
		.replace(/\r/g, '')
		.replace(/\"/g, '')
		.replace(/quiet/g, '')
		.replace(/\@(codekit|prepros)\-(append|prepend)/gi, '')
		.replace(/\/\//gi, folders.source + 'assets/js/')
		.replace(/;$/, '')
		.split(';');

	return src(scripts)
		.pipe(gulp_sourcemaps.init())
		.pipe(gulp_concat('scripts.min.js'))
		.pipe(gulp_uglify())
		.pipe(gulp_sourcemaps.write('.'))
		.pipe(dest(folders.build + 'assets/js'));
}




function sass() {
	return src(folders.source + 'assets/sass/**/*.scss')
		.pipe(gulp_sourcemaps.init())
		.pipe(gulp_sass({
			includePaths: [
				'./node_modules/bourbon/core',
				],
			outputStyle: 'compressed',
			sourceComments: false
		}).on('error', gulp_sass.logError))
		.pipe(gulp_postcss([gulp_autoprefixer()]))
		.pipe(gulp_rename({extname: '.min.css'}))
		.pipe(gulp_sourcemaps.write('.'))
		.pipe(dest(folders.build + 'assets/css'));
}




function nunjucks() {
	return src([folders.source + '**/*.njk', "!" + folders.source + 'assets/templates/**/*.njk'])
		.pipe(gulp_data(function() {
			return require('./' + folders.source + 'app.json')
		}))
		.pipe(gulp_nunjucks.compile(null,{ autoescape: false }))
		.pipe(gulp_rename({extname: '.html'}))
		.pipe(gulp_htmlmin({
			collapseWhitespace            : true,
			html5                         : true,
			minifyCSS                     : true,
			minifyJS                      : true,
			removeComments                : true,
			removeScriptTypeAttributes    : true,
			removeStyleLinkTypeAttributes : true
		}))
		.pipe(dest(folders.build))
}




function browserSync() {
	if (!browsersyncSettings.files) {
		browsersyncSettings.files = [
			'./**/*.css',
			'./**/*.gif',
			'./**/*.html',
			'./**/*.jpeg',
			'./**/*.jpg',
			'./**/*.js',
			'./**/*.json',
			'./**/*.m4v',
			'./**/*.mp4',
			'./**/*.pdf',
			'./**/*.php',
			'./**/*.png',
			'./**/*.svg',
			'./**/*.txt',
			'./**/*.webm',
			'./**/*.xml'
		];
	}
	gulp_browsersync.create();
	gulp_browsersync.init(browsersyncSettings);
}




function eslint() {
	return src([folders.source + 'assets/js/scripts/modules/**/*.js'])
		.pipe(gulp_eslint({
			rules: {
				'accessor-pairs': 0,
				'array-bracket-spacing': 0,
				'array-callback-return': 0,
				'arrow-body-style': 0,
				'arrow-parens': 0,
				'arrow-spacing': 0,
				'block-scoped-var': 0,
				'block-spacing': 0,
				'brace-style': 0,
				'callback-return': 0,
				'camelcase':  0,
				'capitalized-comments': 0,
				'class-methods-use-this': 0,
				'comma-dangle':  1,
				'comma-spacing': 0,
				'comma-style': 0,
				'complexity': 0,
				'computed-property-spacing': 0,
				'consistent-return': 0,
				'consistent-this': 0,
				'constructor-super': 1,
				'curly': 0,
				'default-case': 0,
				'dot-location': 0,
				'dot-notation': 0,
				'eol-last': 0,
				'eqeqeq': 0,
				'func-call-spacing': 0,
				'func-name-matching': 0,
				'func-names': 0,
				'func-style': 0,
				'generator-star-spacing': 0,
				'global-require': 0,
				'guard-for-in': 0,
				'handle-callback-err': 0,
				'id-blacklist': 0,
				'id-length': 0,
				'id-match': 0,
				'indent': 0,
				'init-declarations': 0,
				'jsx-quotes': 0,
				'key-spacing': 0,
				'keyword-spacing': 0,
				'line-comment-position': 0,
				'linebreak-style': 0,
				'lines-around-comment': 0,
				'lines-around-directive': 0,
				'max-depth': 0,
				'max-len': 0,
				'max-lines': 0,
				'max-nested-callbacks': 0,
				'max-params': 0,
				'max-statements': 0,
				'max-statements-per-line': 0,
				'multiline-ternary': 0,
				'new-cap': 0,
				'new-parens': 0,
				'newline-after-var': 0,
				'newline-before-return': 0,
				'newline-per-chained-call': 0,
				'no-alert': 0,
				'no-array-constructor': 0,
				'no-await-in-loop': 0,
				'no-bitwise': 0,
				'no-caller': 0,
				'no-case-declarations': 1,
				'no-catch-shadow': 0,
				'no-class-assign': 1,
				'no-compare-neg-zero': 0,
				'no-cond-assign': 1,
				'no-confusing-arrow': 0,
				'no-console': 1,
				'no-const-assign': 1,
				'no-constant-condition': 1,
				'no-continue': 0,
				'no-control-regex': 1,
				'no-debugger': 1,
				'no-delete-var': 1,
				'no-div-regex': 0,
				'no-dupe-args': 1,
				'no-dupe-class-members': 1,
				'no-dupe-keys': 1,
				'no-duplicate-imports': 0,
				'no-else-return': 0,
				'no-empty': 1,
				'no-empty-character-class': 1,
				'no-empty-function': 0,
				'no-empty-pattern': 1,
				'no-eq-null': 0,
				'no-eval': 0,
				'no-ex-assign': 1,
				'no-extend-native': 0,
				'no-extra-bind': 0,
				'no-extra-boolean-cast': 1,
				'no-extra-labels': 0,
				'no-extra-parens': 1,
				'no-extra-semi': 1,
				'no-fallthrough': 1,
				'no-floating-decimal': 0,
				'no-func-assign': 1,
				'no-global-assign': 0,
				'no-implicit-coercion': 0,
				'no-implicit-globals': 0,
				'no-implied-eval': 0,
				'no-inline-comments': 0,
				'no-inner-declarations': 1,
				'no-invalid-regexp': 1,
				'no-invalid-this': 0,
				'no-irregular-whitespace': 1,
				'no-iterator': 0,
				'no-label-var': 0,
				'no-labels': 0,
				'no-lone-blocks': 0,
				'no-lonely-if': 0,
				'no-loop-func': 0,
				'no-magic-numbers': 0,
				'no-mixed-operators': 0,
				'no-mixed-requires': 0,
				'no-mixed-spaces-and-tabs': 0,
				'no-multi-assign': 0,
				'no-multi-spaces': 0,
				'no-multi-str': 0,
				'no-multiple-empty-lines': 0,
				'no-negated-condition': 0,
				'no-nested-ternary': 0,
				'no-new': 0,
				'no-new-func': 0,
				'no-new-object': 0,
				'no-new-require': 0,
				'no-new-symbol': 1,
				'no-new-wrappers': 0,
				'no-obj-calls': 1,
				'no-octal': 1,
				'no-octal-escape': 0,
				'no-param-reassign': 0,
				'no-path-concat': 0,
				'no-plusplus': 0,
				'no-process-env': 0,
				'no-process-exit': 0,
				'no-proto': 0,
				'no-redeclare': 1,
				'no-regex-spaces': 1,
				'no-restricted-globals': 0,
				'no-restricted-imports': 0,
				'no-restricted-modules': 0,
				'no-restricted-properties': 0,
				'no-restricted-syntax': 0,
				'no-return-assign': 0,
				'no-return-await': 0,
				'no-script-url': 0,
				'no-self-assign': 1,
				'no-self-compare': 1,
				'no-sequences': 0,
				'no-shadow': 0,
				'no-shadow-restricted-names': 0,
				'no-sparse-arrays': 1,
				'no-sync': 0,
				'no-tabs': 0,
				'no-template-curly-in-string': 1,
				'no-ternary': 0,
				'no-this-before-super': 1,
				'no-throw-literal': 0,
				'no-trailing-spaces': 0,
				'no-undef': 1,
				'no-undef-init': 0,
				'no-undefined': 0,
				'no-underscore-dangle': 0,
				'no-unexpected-multiline': 1,
				'no-unmodified-loop-condition': 0,
				'no-unneeded-ternary': 0,
				'no-unreachable': 1,
				'no-unsafe-finally': 1,
				'no-unsafe-negation': 0,
				'no-unused-expressions': 0,
				'no-unused-labels': 1,
				'no-unused-vars': 1,
				'no-use-before-define': 0,
				'no-useless-call': 0,
				'no-useless-computed-key': 1,
				'no-useless-concat': 0,
				'no-useless-constructor': 0,
				'no-useless-escape': 0,
				'no-useless-rename': 0,
				'no-useless-return': 0,
				'no-var': 0,
				'no-void': 0,
				'no-warning-comments': 0,
				'no-whitespace-before-property': 0,
				'no-with': 0,
				'nonblock-statement-body-position': 0,
				'object-curly-newline': 0,
				'object-curly-spacing': 0,
				'object-property-newline': 0,
				'object-shorthand': 0,
				'one-var': 0,
				'one-var-declaration-per-line': 0,
				'operator-assignment': 0,
				'operator-linebreak': 0,
				'padded-blocks': 0,
				'prefer-arrow-callback': 0,
				'prefer-const': 0,
				'prefer-destructuring': 0,
				'prefer-numeric-literals': 0,
				'prefer-promise-reject-errors': 0,
				'prefer-rest-params': 0,
				'prefer-spread': 0,
				'prefer-template': 0,
				'quote-props': 0,
				'quotes': 0,
				'radix': 0,
				'require-await': 0,
				'require-jsdoc': 0,
				'require-yield': 0,
				'rest-spread-spacing': 0,
				'semi': 0,
				'semi-spacing': 0,
				'sort-imports': 0,
				'sort-keys': 0,
				'sort-vars': 0,
				'space-before-blocks': 0,
				'space-before-function-paren': 0,
				'space-in-parens': 0,
				'space-infix-ops': 0,
				'space-unary-ops': 0,
				'spaced-comment': 0,
				'strict': 0,
				'symbol-description': 0,
				'template-curly-spacing': 0,
				'template-tag-spacing': 0,
				'unicode-bom': 0,
				'use-isnan': 1,
				'valid-jsdoc': 0,
				'valid-typeof': 1,
				'vars-on-top': 0,
				'wrap-iife': 0,
				'wrap-regex': 0,
				'yield-star-spacing': 0,
				'yoda': 0,
			},
			globals: ['$', 'jQuery'],
			envs: ['browser']
		}))
		.pipe(gulp_eslint.format())
		.pipe(gulp_eslint.failAfterError());
}




function startWatch() {
	watch(folders.source + '**/*.js', series(javascript, eslint));
	watch(folders.source + '**/*.scss', sass);
	watch(folders.source + 'app.json', nunjucks);
	watch(folders.source + '**/*.njk', nunjucks);
	watch(
		[
			folders.source + '**/*.gif',
			folders.source + '**/*.html',
			folders.source + '**/*.jpg',
			folders.source + '**/*.json',
			folders.source + '**/*.png',
			folders.source + '**/*.svg'
		],
		copy
	);
}



exports.build = series(
	clean,
	copy,
	parallel(
		sass,
		javascript,
		nunjucks
	)
);

exports.default = series(
	clean,
	copy,
	parallel(
		sass,
		javascript,
		nunjucks
	),
	eslint,
	parallel(
		browserSync,
		startWatch
	)
);