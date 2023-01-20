/**
 * @name CeL function for <a
 *       href="http://en.wikipedia.org/wiki/Random_number_generation"
 *       accessdate="2012/3/9 9:36" title="random number generator (RNG)">number
 *       generator</a>
 * @fileoverview 本档案包含了生成数字用的 functions。
 * @since 2010/1/21 17:58:15
 * @example <code>
 * CeL.run('application.math.number_generator', function() {
 * 	// ..
 * });
 * </code>
 */

'use strict';
// 'use asm';

// --------------------------------------------------------------------------------------------

// 不采用 if 陈述式，可以避免 Eclipse JSDoc 与 format 多缩排一层。
typeof CeL === 'function' && CeL.run({
	name : 'application.math.number_generator',
	require : 'data.native.to_fixed|data.math.to_rational_number',
	code : module_code
});

function module_code(library_namespace) {
	// requiring
	var to_rational_number = this.r('to_rational_number');

	if (!Number.prototype.to_fixed) {
		Number.prototype.to_fixed = library_namespace.to_fixed;
	}

	/**
	 * null module constructor
	 * 
	 * @class 出数学题目用的 functions
	 */
	var _// JSDT:_module_
	= function() {
		// null module constructor
	};

	/**
	 * for JSDT: 有 prototype 才会将之当作 Class
	 */
	_// JSDT:_module_
	.prototype = {};

	_// JSDT:_module_
	.
	/**
	 * 转换数学式成容易阅读的形式。
	 * 
	 * @param formula
	 *            数学式.
	 * @param {Boolean}[mode]
	 *            转换模式.
	 * @returns
	 */
	express_formula = function(formula, mode) {
		if (Array.isArray(formula))
			formula = formula.join('');

		return _.express_formula.extra[formula]
		//
		|| (typeof formula === 'string' && formula ? mode
		//
		? formula.replace(/\+/g, '加').replace(/\-/g, '减')
		//
		.replace(/\*/g, '乘').replace(/\//g, '除')
		//
		: formula.replace(/\s*([+\-*\/])\s*/g, function($0, $1) {
			return ' ' + {
				'+' : '+',
				'-' : '-',
				'*' : '×',
				// obelus (symbol: ÷, plural: obeli)
				'/' : '÷'
			}[$1] + ' ';
		}) : '');
	};

	_// JSDT:_module_
	.express_formula.extra = {
		'+-*/' : '四则',
		// [Mathematics] to find a common denominator / the lowest common
		// denominator
		f_cd : '通分',
		reduction : '约分',
		converting_mixed : '代换(假分数←→带分数)',
		compare_size : '比大小',
		with_decimal : '与小数运算'
	};

	/**
	 * http://163.32.181.11/ymt91050/m/%E6%95%B8%E5%AD%B8%E7%B7%B4%E7%BF%92%E9%A1%8C.htm
	 * http://webmail.ysps.tp.edu.tw/~wenji/material.htm
	 * 
	 * 一位小数加法(直式)
	 * 
	 * 一位小数减法(横式)
	 */

	_// JSDT:_module_
	.
	/**
	 * 将问题 pattern 中的 '??' 等转成实际数字，生成实际问题。
	 * 
	 * @param {String}problem_pattern
	 *            problem pattern. e.g., '???.??', '[??/?]', 可用 + - * /.
	 * @param {Integer}method
	 *            method. 1: 只是要取得乱数. 2: 取得整个数值的乱数. others: 产出整个题目。
	 * @returns
	 */
	parse_problem = function(problem_pattern, method) {
		if (typeof problem_pattern !== 'string' || !problem_pattern)
			return problem_pattern;

		var _s = _.parse_problem,
		/**
		 * gn: generate number
		 */
		gn = function(n, z) {
			/**
			 * z: can start with zero
			 */
			if (!z)
				n = n.replace(/\?/, function($0) {
					return 1 + Math.floor(Math.random() * 9);
				});
			return n.replace(/\?/g, function($0) {
				return Math.floor(Math.random() * 10);
			});
		}, gn2 = function(n) {
			return n.replace(
					/(\?*|0)\.(\?+)/g,
					function($0, $1, $2) {
						return ($1.indexOf('?') === -1 ? '0' : gn($1)) + '.'
								+ gn($2, 1);
					}).replace(/\?+/g, function($0) {
				return gn($0);
			});
		};

		if (false && !problem_pattern
		//
		.match(/^(((\?*|0)\.)?\?+|[+\-*\/]|\s){3,}$/))
			library_namespace.debug('No match: ' + problem_pattern);

		problem_pattern = problem_pattern.replace(/\[((\d\-\d|\d+)+)\]/g,
		//
		function($0, $1) {
			var n = $1.replace(/(\d)\-(\d)/g, function($0, $1, $2) {
				var i = Math.min($1, $2), n = '', M = Math.max($1, $2);
				for (; i < M; i++)
					n += i;
				return n;
			});
			return n.charAt(Math.floor(Math.random() * n.length));
		}).replace(/(\d)(\?+)/g, function($0, $1, $2) {
			return $1 + gn($2, 1);
		});

		problem_pattern = gn2(problem_pattern);

		// method === 1: 只是要取得乱数
		return method === 1 ? problem_pattern
		// method === 2: 取得整个数值的乱数
		: method === 2 ? problem_pattern.replace(/0+$|^0+/g, '') : _s
				.express(problem_pattern);
	};

	_// JSDT:_module_
	.parse_problem.express = function(q) {
		return typeof q !== 'string' ? [ q, q ]
		//
		: [ q.replace(/\/\//g, '/')
		//
		.replace(/\s*÷\s*/g, '/').replace(/\s*×\s*/g, '*')
		// .replace(/\s*=+\s*/g, '===')
		, q.replace(/\/\//g, '\\').replace(/[+\-*\/]/g, function($0) {
			return _.express_formula($0);
		}).replace(/\\/g, '/') ];
	};

	_// JSDT:_module_
	.
	/**
	 * 随机生成 count 个不同之数字。
	 * 
	 * @param {String}pattern
	 *            生成数字之 pattern
	 * @param {Number}count
	 *            生成个数，预设 2。仅要一个时直接 call .parse_problem() 即可。
	 * @param {Function}comparator
	 *            回传以 comparator 排序后的数列。
	 * @return {Array} [numbers] 排序过之数字
	 */
	get_different_numbers = function(pattern, count, comparator) {
		if (!count || isNaN(count))
			count = 2;

		var i = 0, s, seeds = [], seed_hash = {}, limit;
		for (; i < count; i++) {
			limit = 50;
			while (limit--
			//
			&& (!(s = parseFloat(_.parse_problem(pattern, 1)).to_fixed())
			//
			|| (s in seed_hash)))
				;
			if (!limit) {
				library_namespace
						.warn('Fault to generate number using pattern ['
								+ pattern + ']!');
			}

			seeds.push(s);
			seed_hash[s] = i;
		}

		if (comparator) {
			library_namespace.is_Function(comparator) ? seeds.sort(comparator)
					: seeds.sort();
		}

		return seeds;
	};

	_// JSDT:_module_
	.
	/**
	 * 演算解答.
	 * 
	 * @param {String}problem
	 *            problem
	 * @returns {String}answer in float, (带)分数, ..
	 * @see data.math.quotient
	 */
	evaluate_value = function(problem) {
		// if(!isNaN(problem))return problem;
		if (!problem)
			return;

		problem = _.parse_problem.express(String(problem))[0];

		var answer, m = problem.match(/^(\d+(\.\d+)?)\/(\d+)$/);

		function adding(v) {
			if (v !== Math.floor(v)) {
				m = to_rational_number(v);
				// 处理真分数、假分数。
				answer += ' '
				// 约等于的符号是≈或≒，不等于的符号是≠。
				+ (m[2] < 1e-13 ? ' = ' : ' <span title="大约">≈</span> ')
				// http://zh.wikipedia.org/wiki/%E7%AD%89%E4%BA%8E
				+ '<span class="fraction">' + m[0] + ' / ' + m[1] + '</span>';

				// 处理带分数。 mixed numeral (often called a mixed number, also
				// called a mixed fraction)
				if (m[0] >= m[1]) {
					problem = m[0] % m[1];
					answer += ' = <span class="mixed_numeral">'
					//
					+ (m[0] - problem) / m[1]
					//
					+ ' + ' + problem + ' / ' + m[1] + '</span>';
				}
			}
		}

		if (m) {
			answer = Math.floor(m[1] / m[3]).to_fixed(12) + ' ... '
			//
			+ (m[1] % m[3]).to_fixed()
			//
			+ (m[1] % m[3] ? ' <span title="大约">≈</span> '
			//
			+ (m[1] / m[3]).to_fixed() : ''), adding(m[1] / m[3]);
		} else {
			try {
				// 直接执行
				// 须预防 6/2/3 的情况
				m = 'return('
						+ problem.replace(/(\d+)\s+(\d+\/\d+)/g, '($1+$2)')
						+ '\n)';
				m = (new Function(m))();
				if (false) {
					library_namespace.debug('{return('
							+ problem.replace(/(\d+)\s+(\d+\/\d+)/g, '($1+$2)')
							+ ');}' + ' = ' + m);
				}
				if (isNaN(m)) {
					library_namespace
							.warn('evaluate_value: No problem generated for ['
									+ problem + '].');
				} else {
					answer = m.to_fixed();
					adding(m);
				}
			} catch (e) {
				library_namespace.warn('evaluate_value: 无法演算 [' + problem
						+ '] (' + m + '). ' + e);
				answer = '`' + problem + '`';
			}
		}

		return answer;
	};

	return (_// JSDT:_module_
	);
}
