/**
 * @name CeL function for mathematics.
 * @fileoverview 本档案包含了数学演算相关的 functions。
 * 
 * TODO: 方程式图形显示 by SVG
 * 
 * @see http://www.wolframalpha.com/<br />
 *      http://www.numberempire.com/
 */

// More examples: see /_test suite/test.js
'use strict';
// 'use asm';

// --------------------------------------------------------------------------------------------

// 不采用 if 陈述式，可以避免 Eclipse JSDoc 与 format 多缩排一层。
typeof CeL === 'function' && CeL.run({
	// module name
	name : 'data.math',

	require : 'data.code.compatibility.|data.native.set_bind',

	// 设定不汇出的子函式。
	// no_extend : '*',

	// 为了方便格式化程式码，因此将 module 函式主体另外抽出。
	code : module_code
});

function module_code(library_namespace) {

	// requiring
	var set_bind = this.r('set_bind');
	var has_bigint = library_namespace.env.has_bigint;

	/**
	 * null module constructor
	 * 
	 * @class 数学相关的 functions
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

	/**
	 * <code>

	数位
	十分位 tenths digit
	整数 whole number

	 </code>
	 */

	// ---------------------------------------------------------------------//
	// basic constants. 定义基本常数。
	var

	/**
	 * empty product, or nullary product, 乘法单位元素.<br />
	 * number * MULTIPLICATIVE_IDENTITY === number.<br />
	 * 2/2, 3/3, ..
	 * 
	 * MULTIPLICATIVE_IDENTITY = 1
	 * 
	 * @type {Number}
	 * @constant
	 * 
	 * @see https://en.wikipedia.org/wiki/Identity_element
	 *      https://en.wikipedia.org/wiki/Empty_product
	 */
	MULTIPLICATIVE_IDENTITY = 1 / 1,
	/**
	 * Any nonzero number raised by the exponent 0 is 1.<br />
	 * (any number) ^ 0 === Math.pow(number, 0) === ZERO_EXPONENT<br />
	 * Math.pow(2, 0), Math.pow(3, 0), ..
	 * 
	 * ZERO_EXPONENT = 1
	 * 
	 * @type {Number}
	 * @constant
	 * 
	 * @see https://en.wikipedia.org/wiki/Exponentiation
	 */
	ZERO_EXPONENT = Math.pow(1, 0),
	/**
	 * absorbing element, zero element.<br />
	 * number * ABSORBING_ELEMENT === ABSORBING_ELEMENT<br />
	 * Math.pow(2, 0), Math.pow(3, 0), ..
	 * 
	 * @type {Number}
	 * @constant
	 * 
	 * @see https://en.wikipedia.org/wiki/Absorbing_element
	 */
	ABSORBING_ELEMENT = 0,
	/**
	 * multiplication sign. e.g., '⋅', '*', '×'.
	 * 
	 * @type {String}
	 * @constant
	 * 
	 * @see https://en.wikipedia.org/wiki/Multiplication_sign
	 *      https://en.wikipedia.org/wiki/Interpunct
	 */
	MULTIPLICATION_SIGN = '⋅',
	/**
	 * default base = 10.<br />
	 * 内定：10位数。应与 parseInt() 一致。
	 * 
	 * @type {Natural}
	 * @constant
	 */
	DEFAULT_BASE = parseInt('10'),
	/**
	 * The biggest integer we can square. 超过此数则无法安全操作平方。
	 * 
	 * @type {Natural}
	 * @constant
	 */
	sqrt_max_integer = Math.sqrt(Number.MAX_SAFE_INTEGER) | 0;

	// ---------------------------------------------------------------------//

	/**
	 * use Horner's method to calculate the value of polynomial.
	 * 
	 * @param {Array}coefficients
	 *            coefficients of polynomial.<br />
	 *            coefficients: [ degree 0, degree 1, degree 2, ... ]
	 * @param {Number}variable
	 *            value of (x)
	 * 
	 * @returns {Number} the value of polynomial
	 * 
	 * @see https://en.wikipedia.org/wiki/Horner%27s_method
	 */
	function polynomial_value(coefficients, variable) {
		return coefficients.reduceRight(function(value, coefficient) {
			return value * variable + coefficient;
		});
	}

	_.polynomial_value = polynomial_value;

	_// JSDT:_module_
	.
	/**
	 * 辗转相除 n1/n2 或 小数 n1/1 转成 整数/整数。
	 * 
	 * @param {Natural}n1
	 *            number 1
	 * @param {Natural}[n2]
	 *            number 2
	 * @param {Natural}times
	 *            maximum times 次数, 1,2,..
	 * 
	 * @return {Array} 连分数序列 (continued fraction) ** 负数视 _.mutual_division.done
	 *         而定!
	 */
	mutual_division = function mutual_division(n1, n2, times) {
		var q = [], c;
		if (isNaN(times) || times <= 0)
			times = 80;
		if (!n2 || isNaN(n2))
			n2 = 1;

		if (!Number.isInteger(n1)) {
			c = n1;
			var i = 9, f = n2;
			while (i--) {
				// 以整数运算比较快！这样会造成整数多4%，浮点数多1/3倍的时间，但仍值得。
				f *= DEFAULT_BASE;
				c *= DEFAULT_BASE;
				if (Number.isInteger(c)) {
					n1 = c;
					n2 = f;
					break;
				}
			}
		}

		// 连分数负数之处理。更没问题的: (n1 < 0?1:0) ^ (n2 < 0?1:0)
		if (_.mutual_division.mode && ((n1 < 0) ^ (n2 < 0))) {
			// 使两数皆为正
			if (n2 < 0)
				n2 = -n2;
			else
				n1 = -n1;

			q.push(-(1 + (n1 - (c = n1 % n2)) / n2));
			n1 = n2;
			n2 -= c;
		}

		// old:
		if (false) {
			while (b && n--) {
				// 2.08s@10000
				// 可能因为少设定（=）一次c所以较快。但（若输入不为整数）不确保d为整数？用Math.floor((a-(c=a%b))/b)可确保，速度与下式一样快。
				c = a % b;
				d.push((a - c) / b);
				a = b;
				b = c;
				// 2.14s@10000:mutual_division(.142857)
				// d.push(c=Math.floor(a/b)),c=a-b*c,a=b,b=c;
				// 2.2s@10000
				// d.push(Math.floor(a/b)),b=a%(c=b),a=c;
			}
			if (n)
				d.push(0);
		}

		// 2.4s@10000
		// 可能因为少设定（=）一次c所以较快。但（若输入不为整数）不确保d为整数？用Math.floor((a-(c=a%b))/b)可确保，速度与下式一样快。
		while (times--)
			if (n2) {
				c = n1 % n2;
				q.push((n1 - c) / n2);
				n1 = n2;
				n2 = c;
			} else {
				// [ ... , done mark, (最后非零的余数。若原 n1, n2 皆为整数，则此值为
				// GCD。但请注意:这边是已经经过前面为了以整数运算，增加倍率过的数值!!) ]
				q.push(_.mutual_division.done, n1);
				// library_namespace.debug('done: ' + q);
				break;
			}

		/**
		 * <code>
		// 2.26s@10000
		while(b&&n--)if(d.push((a-(c=a%b))/b),a=b,!(b=c)){d.push(0);break;}

		var m=1;c=1;while(m&&n--)d.push(m=++c%2?b?(a-(a%=b))/b:0:a?(b-(b%=a))/a:0);//buggy
		</code>
		 */

		return q;
	};

	_// JSDT:_module_
	.mutual_division.done = -7;// ''

	_// JSDT:_module_
	.
	/**
	 * !!mode:连分数处理，对负数仅有最初一数为负。
	 */
	mutual_division.mode = 0;

	_// JSDT:_module_
	.
	/**
	 * 取得连分数序列的数值。
	 * 
	 * @param {Array}sequence
	 *            序列
	 * @param {Natural}[max_no]
	 *            maximum no. 取至第 max_no 个
	 * 
	 * @return {Array}连分数序列的数值
	 * 
	 * @requires mutual_division.done
	 */
	continued_fraction = function(sequence, max_no) {
		if (!Array.isArray(sequence) || !sequence.length)
			return sequence;

		if (sequence.at(-2) === _.mutual_division.done)
			sequence.length -= 2;

		if (sequence.length < 1)
			return sequence;

		if (!max_no/* || max_no < 2 */|| max_no > sequence.length)
			max_no = sequence.length;

		var a, b;
		if (max_no % 2) {
			b = 1;
			a = 0;
		} else {
			a = 1;
			b = 0;
		}
		if (false) {
			sequence[max_no++] = 1;
			if (--max_no % 2) {
				b = sequence[max_no];
				a = s[--max_no];
			} else {
				a = sequence[max_no];
				b = sequence[--max_no];
			}
		}

		if (false)
			library_namespace.debug('a=' + a + ', b=' + b + ', max_no='
					+ max_no);
		while (max_no--)
			if (max_no % 2)
				b += a * sequence[max_no];
			else
				a += b * sequence[max_no];
		if (false)
			library_namespace.debug('a=' + a + ', b=' + b);
		return [ a, b ];
	};

	// quadratic (m√r + i) / D → continued fraction [... , [period ...]]
	// Rosen, Kenneth H. (2011). Elementary Number Theory and its Applications
	// (6th edition). Boston: Pearson Addison-Wesley. pp. 508–511.
	// https://en.wikipedia.org/wiki/Periodic_continued_fraction
	// https://en.wikipedia.org/wiki/Square_root_of_2
	// https://en.wikipedia.org/wiki/Square_root#As_periodic_continued_fractions
	// https://en.wikipedia.org/wiki/Generalized_continued_fraction#Roots_of_positive_numbers
	function quadratic_to_continued_fraction(r, m, i, D) {
		if (r < 0) {
			throw 'The root is negative!';
		}
		if (!i)
			i = 0;
		if (!D)
			D = 1;
		if (!m)
			m = 1;
		else if (m < 0) {
			m = -m;
			i = -i;
			D = -D;
		}

		// (m√r + i) / D
		// = (√(r m^2) + i) / D
		// = (√(d in book) + P0) / Q0
		var d = m * m * r,
		//
		P = i, Q = D,
		// A: α in book.
		A, a, sequence = [], ptr = sequence, start_PQ;

		// Be sure Q0 | (d - P0^2)
		if ((d - P * P) % Q !== 0)
			P *= Q, d *= Q * Q, Q *= Q;

		// assert: now: Q0 | (d - P0^2)

		for (var sqrt = Math.sqrt(d), t;;) {
			if (start_PQ) {
				if (P === start_PQ[0] && Q === start_PQ[1])
					return sequence;
			} else if (0 < (t = sqrt - P) && t < Q) {
				// test if α is purely periodic.
				start_PQ = [ P, Q ];
				sequence.push(ptr = []);
			}
			ptr.push(a = Math.floor(A = (sqrt + P) / Q));
			library_namespace.debug(((sequence === ptr ? 0
					: sequence.length - 1)
					+ ptr.length - 1)
					+ ': P='
					+ P
					+ ', Q='
					+ Q
					+ ', α≈'
					+ (DEFAULT_BASE * A | 0)
					/ DEFAULT_BASE + ', a=' + a, 3);

			// set next Pn = a(n-1)Q(n-1) - P(n-1), Qn = (d - Pn^2) / Q(n-1).
			P = a * Q - P;
			Q = (d - P * P) / Q;
			if (Q === 0)
				// is not a quadratic irrationality?
				return sequence;
			// assert: Pn, Qn are both integers.
		}
	}
	_.quadratic_to_continued_fraction = quadratic_to_continued_fraction;

	// get the first solution of Pell's equation: x^2 - d y^2 = 1 or -1.
	// https://en.wikipedia.org/wiki/Pell%27s_equation
	// Rosen, Kenneth H. (2005). Elementary Number Theory and its Applications
	// (5th edition). Boston: Pearson Addison-Wesley. pp. 542-545.
	function solve_Pell(d, n, NO) {
		// TODO
		// use CeL.data.math.quadratic.solve_Pell instead
		;
	}
	// _.solve_Pell = solve_Pell;

	_// JSDT:_module_
	.
	/**
	 * The best rational approximation. 取得值最接近之有理数 (use 连分数 continued fraction),
	 * 取近似值. c.f., 调日法 在分子或分母小于下一个渐进分数的分数中，其值是最接近精准值的近似值。
	 * 
	 * @param {Number}number
	 *            number
	 * @param {Number}[rate]
	 *            比例在 rate 以上
	 * @param {Natural}[max_no]
	 *            maximum no. 最多取至序列第 max_no 个 TODO : 并小于 l: limit
	 * 
	 * @return {Array}[分子, 分母, 误差]
	 * 
	 * @requires mutual_division,continued_fraction
	 * @see https://en.wikipedia.org/wiki/Continued_fraction#Best_to_rational_numbers
	 */
	to_rational_number = function(number, rate, max_no) {
		if (!rate)
			// This is a magic number: 我们无法准确得知其界限为何。
			rate = 65536;
		var d = _
				.mutual_division(number, 1, max_no && max_no > 0 ? max_no : 20), i = 0, a, b = d[0], done = _.mutual_division.done;

		if (!b)
			b = d[++i];
		while (++i < d.length && (a = d[i]) !== done)
			if (a / b < rate)
				b = a;
			else
				break;

		if (false)
			library_namespace.debug(number
					+ ' '
					+
					// 连分数表示 (continued fraction)
					(d.length > 1 && d.at(-2) === _.mutual_division.done ? '='
							+ ' [<em>'
							+ d[0]
							+ ';'
							+ d.slice(1, i).join(', ')
							+ '</em>'
							+ (i < d.length - 2 ? ', '
									+ d.slice(i, -2).join(', ') : '')
							+ '] ... ' + d.slice(-1)
							:
							// 约等于的符号是≈或≒，不等于的符号是≠。
							// https://zh.wikipedia.org/wiki/%E7%AD%89%E4%BA%8E
							'≈'
									+ ' [<em>'
									+ d[0]
									+ ';'
									+ d.slice(1, i).join(', ')
									+ '</em>'
									+ (i < d.length ? ', '
											+ d.slice(i).join(', ') : '')
									+ ']: ' + d.length + ',' + i + ',' + d[i]));
		d = _.continued_fraction(d, i);
		if (d[1] < 0) {
			d[0] = -d[0];
			d[1] = -d[1];
		}
		if (false)
			library_namespace.debug('→ ' + d[0] + '/' + d[1]);

		// [ {Integer}±numerator, {Natural}denominator ]
		return [ d[0], d[1], d[0] / d[1] - number ];
	};

	// 正规化带分数。 to_mixed_fraction
	// 2019/7/10 14:22:6
	// mixed_fraction =
	// [ {Integer}±whole, {Integer}±numerator, {Natural|Undefined}denominator ]
	function normalize_mixed_fraction(mixed_fraction) {
		if (typeof mixed_fraction === 'number') {
			// treat as float
			mixed_fraction = [ mixed_fraction ];
		}

		var whole = mixed_fraction[0] || ABSORBING_ELEMENT;
		var numerator = mixed_fraction[1] || ABSORBING_ELEMENT;
		var denominator = mixed_fraction[2] || MULTIPLICATIVE_IDENTITY;

		// {Natural}denominator >= 1
		if (denominator < 0) {
			denominator = -denominator;
			numerator = -numerator;
		}

		// {Natural}denominator ∈ ℤ
		if (!Number.isInteger(denominator)) {
			// assert: is float
			denominator = _.to_rational_number(denominator);
			numerator *= typeof numerator === 'bigint' ? BigInt(denominator[1])
					: denominator[1];
			denominator = denominator[0];
		}

		// {Integer}±numerator ∈ ℤ
		if (!Number.isInteger(numerator)) {
			// assert: is float
			numerator = _.to_rational_number(numerator);
			denominator *= typeof denominator === 'bigint' ? BigInt(numerator[1])
					: numerator[1];
			numerator = numerator[0];
		}

		// assert: {Natural}denominator, {Integer}±numerator

		// TODO: 约分here。

		var using_bigint;

		// {Integer}±whole ∈ ℤ
		if (typeof whole === 'number' && !Number.isInteger(whole)) {
			// assert: whole is float
			whole = _.to_rational_number(whole);
			var LCM = _.LCM(denominator, whole[1]);
			if (typeof LCM === 'bigint') {
				using_bigint = true;
				// convert all numbers to the same type.
				numerator = BigInt(numerator);
				denominator = BigInt(denominator);
				whole = whole.map(BigInt);
			}
			numerator = numerator
					// (LCM / denominator) === GCD * whole[1]
					* (LCM / denominator)
					+ (whole[0] < 0 ? -(-whole[0] % whole[1]) : whole[0]
							% whole[1]) * (LCM / whole[1]);
			denominator = LCM;
			if (using_bigint) {
				whole = whole[0] / whole[1];
			} else {
				whole = whole[0] < 0 ? -Math.floor(-whole[0] / whole[1]) : Math
						.floor(whole[0] / whole[1]);
			}
		}
		// TODO: convert all numbers to the same type.

		// whole, numerator 必须同符号。
		if (whole * numerator < 0) {
			if (whole < 0) {
				whole++;
				// numerator > 0
				numerator -= denominator;
			} else {
				whole--;
				// numerator < 0
				numerator += denominator;
			}
		}

		// 处理假分数。同时会处理绝对值为整数之问题。
		if (Math.absolute(numerator) >= denominator) {
			whole += using_bigint ? numerator / denominator : Math
					.floor(numerator / denominator);
			numerator %= denominator;
		}
		// 约分。
		if (numerator == ABSORBING_ELEMENT) {
			// normalize
			denominator = MULTIPLICATIVE_IDENTITY;
		} else {
			var GCD = _.GCD(numerator, denominator);
			if (GCD >= 2) {
				if (using_bigint)
					GCD = BigInt(GCD);
				numerator /= GCD;
				denominator /= GCD;
			}
		}

		// export
		mixed_fraction = Object.assign([ whole, numerator, denominator ], {
			valueOf : mixed_fraction_valueOf,
			toString : mixed_fraction_toString
		});
		return mixed_fraction;
	}

	function mixed_fraction_valueOf() {
		if (!this[1])
			return this[0];

		return this[0] + this[1] / this[2];
	}

	function mixed_fraction_toString() {
		if (!this[1])
			return String(this[0]);

		if (!this[0])
			return this[1] + '/' + this[2];

		return this[0] + (this[1] < 0 ? '' : '+') + this[1] + '/' + this[2];
	}

	_.normalize_mixed_fraction = normalize_mixed_fraction;

	// ------------------------------------------------------------------------

	// 正规化数字成 integer 或 bigint
	// 在大量计算前，尽可能先转换成普通 {Number} 以加快速度。
	// cohandler(may convert to number)
	function to_int_or_bigint(value, cohandler) {
		var number;
		if (typeof value === 'bigint') {
			number = Number(value);
			if (Number.isSafeInteger(number)) {
				cohandler && cohandler(true);
				return number;
			} else {
				cohandler && cohandler(false);
				return value;
			}
		}

		// 这方法无法准确处理像 `1e38/7`, `10/7` 这样的情况。
		if (typeof value === 'number') {
			number = Math.round(value);
			if (!Number.isSafeInteger(number)) {
				throw new RangeError('Cannot convert number ' + value
						+ ' to safe integer!');
			}
			cohandler && cohandler(true);
			return Math.round(number);
		}

		number = parseInt(value);
		if (Number.isSafeInteger(number)) {
			cohandler && cohandler(true);
			return number;
		}

		if (!has_bigint)
			throw new RangeError('Cannot convert ' + number
					+ ' to safe integer!');

		cohandler && cohandler(false);
		return BigInt(value);
	}

	// Let all elements of {Array}this the same type: int, else bigint.
	// 可能的话应该将绝对值最大的数字放在前面，早点判别出是否需要用 {BigInt}。
	function array_to_int_or_bigint() {
		// assert: {Array}this

		// cache int values
		if (this.some(function(value, index) {
			value = to_int_or_bigint(value);
			this[index] = value;
			return typeof value === 'bigint';
		}, this)) {
			// must using bigint
			this.forEach(function(value, index) {
				this[index] = BigInt(value);
			}, this);
		}

		// assert: all elements of `this` is in the same type.
		// typeof this[0] === typeof this[1]
		return this;
	}

	// 可用于 {BigInt} 之 Math.abs
	// https://en.wikipedia.org/wiki/Absolute_value
	function absolute(value) {
		return value < 0 ? -value : value;
	}

	Math.absolute = absolute;

	/**
	 * 求多个数之 GCD(Greatest Common Divisor, 最大公因数/公约数).<br />
	 * Using Euclidean algorithm(辗转相除法).<br />
	 * 
	 * TODO: 判断互质.
	 * 
	 * @param {Integers}number_array
	 *            number array
	 * 
	 * @returns {Natural} GCD of the numbers specified
	 */
	function GCD(number_array) {
		if (arguments.length > 1) {
			// Array.from()
			number_array = Array.prototype.slice.call(arguments);
		}

		// 正规化数字。
		number_array = number_array.map(function(value) {
			return Math.absolute(to_int_or_bigint(value));
		})
		// 由小至大排序可以减少计算次数?? 最起码能够延后使用 {BigInt} 的时机。
		.sort(library_namespace.general_ascending)
		// .unique_sorted()
		;
		// console.log(number_array);

		// 不在此先设定 gcd = number_array[0]，是为了让每个数字通过资格检验。
		var index = 0, length = number_array.length, gcd = 0, remainder, number;
		// assert: 所有数字皆已先转换成数字，并已转为绝对值。

		while (index < length) {
			number = number_array[index++];
			if (number >= 1) {
				gcd = number;
				break;
			}
		}
		// console.log(gcd);

		while (index < length && 2 <= gcd) {
			number = number_array[index++];
			if (!(number >= 1))
				continue;

			if (typeof number === 'bigint') {
				number %= BigInt(gcd);
				// [ gcd, number ] = [ gcd, number ].to_int_or_bigint();
				remainder = [ gcd, number ].to_int_or_bigint();
				gcd = remainder[0];
				number = remainder[1];
			}
			// assert: typeof gcd === typeof number
			// console.log([ gcd, number ]);

			// Euclidean algorithm 辗转相除法。
			while ((remainder = number % gcd) >= 1) {
				number = gcd;
				// 使用绝对值最小的余数。为了要处理 {BigInt}，因此不采用 Math.min()。
				// gcd = Math.min(remainder, gcd - remainder);
				gcd = gcd - remainder < remainder ? gcd - remainder : remainder;
			}
		}

		if (typeof gcd === 'bigint'
				&& Number.isSafeInteger(number = Number(gcd))) {
			gcd = number;
		}
		return gcd;
	}

	_// JSDT:_module_
	.GCD = GCD;

	_// JSDT:_module_
	.
	/**
	 * 求多个数之 LCM(Least Common Multiple, 最小公倍数): method 1.<br />
	 * Using 类辗转相除法.<br />
	 * 
	 * @param {Integers}number_array
	 *            number array
	 * 
	 * @returns {Natural} LCM of the numbers specified
	 */
	LCM = function LCM(number_array) {
		if (arguments.length > 1) {
			// Array.from()
			number_array = Array.prototype.slice.call(arguments);
		}

		// 正规化数字。
		number_array = number_array.map(function(value) {
			return Math.absolute(to_int_or_bigint(value));
		})
		// .sort().reverse()
		;
		if (number_array.some(function(number) {
			return number == 0;
		})) {
			// 允许 0:
			return 0;
		}

		var lcm = number_array[0];
		for (var index = 1, length = number_array.length; index < length; index++) {
			var number = number_array[index];
			// assert: {Integer}number
			var gcd = _.GCD(number, lcm);
			if (typeof number === typeof gcd) {
				number /= gcd;
				if (typeof number === typeof lcm) {
					gcd = lcm * number;
					if (Number.isSafeInteger(gcd)) {
						lcm = gcd;
					} else if (has_bigint) {
						lcm = BigInt(lcm) * BigInt(number);
					} else {
						throw new RangeError('LCM is not safe integer!');
					}
				} else {
					// assert: {BigInt}number or {BigInt}lcm
					lcm = BigInt(lcm) * BigInt(number);
				}
			} else {
				// assert: {BigInt}number, {Number}gcd
				lcm = BigInt(lcm) * (number / BigInt(gcd));
			}
		}
		return lcm;
	};

	_// JSDT:_module_
	.
	/**
	 * 求多个数之 LCM(Least Common Multiple, 最小公倍数): method 1.<br />
	 * Using 类辗转相除法.<br />
	 * 
	 * TODO: 更快的方法： 短除法? 一次算出 GCD, LCM?
	 * 
	 * @param {Integers}number_array
	 *            number array
	 * 
	 * @returns {Natural} LCM of the numbers specified
	 */
	LCM3 = function LCM3(number_array) {
		if (arguments.length > 1) {
			// Array.from()
			number_array = Array.prototype.slice.call(arguments);
		}

		// 正规化数字。
		number_array = number_array.map(function(value) {
			return Math.absolute(to_int_or_bigint(value));
		})
		// .sort().reverse()
		;
		if (number_array.some(function(number) {
			return number == 0;
		})) {
			// 允许 0:
			return 0;
		}

		var lcm = number_array[0], using_bigint;
		for (var index = 1, length = number_array.length; index < length; index++) {
			var number = number_array[index];
			// assert: {Integer}number
			if (typeof number !== typeof lcm) {
				// assert: number, lcm 有一个是 bigint。
				using_bigint = true;
				lcm = BigInt(lcm);
				number = BigInt(number);
			}
			// console.log([ lcm, number ]);
			var number0 = number;
			var lcm0 = lcm;
			// 倒反版的 Euclidean algorithm 辗转相除法.
			// 反复让两方各自加到比对方大的倍数，当两者相同时，即为 lcm。
			while (lcm !== number) {
				// console.log([ lcm0, number0, lcm, number ]);
				if (lcm > number) {
					var remainder = -lcm % number0;
					if (remainder) {
						number = lcm + remainder + number0;
						if (!using_bigint && has_bigint
								&& !Number.isSafeInteger(number)) {
							using_bigint = true;
							number0 = BigInt(number0);
							lcm0 = BigInt(lcm0);
							number = BigInt(lcm + remainder) + number0;
							lcm = BigInt(lcm);
						}
					} else {
						// number0 整除 lcm: 取 lcm 即可.
						break;
					}
				} else {
					var remainder = -number % lcm0;
					if (remainder) {
						lcm = number + remainder + lcm0;
						if (!using_bigint && has_bigint
								&& !Number.isSafeInteger(lcm)) {
							using_bigint = true;
							number0 = BigInt(number0);
							lcm0 = BigInt(lcm0);
							lcm = BigInt(number + remainder) + BigInt(lcm0);
							number = BigInt(number);
						}
					} else {
						// lcm0 整除 number: 取 number 即可.
						lcm = number;
						break;
					}
				}
			}
		}
		return lcm;
	};

	_// JSDT:_module_
	.
	/**
	 * 求多个数之 LCM(Least Common Multiple, 最小公倍数): method 2.<br />
	 * Using 类辗转相除法.<br />
	 * 
	 * @param {Integers}number_array
	 *            number array
	 * 
	 * @returns {Integer} LCM of the numbers specified
	 */
	LCM2 = function LCM2(number_array) {
		if (arguments.length > 1) {
			// Array.from()
			number_array = Array.prototype.slice.call(arguments);
		}

		var i = 0, l = number_array.length, lcm = 1, r, n, num, gcd;
		for (; i < l && lcm; i++) {
			// 每个数字都要做运算，虽可确保正确，但没有效率!
			if (!isNaN(num = n = Math.abs(parseInt(number_array[i])))) {
				gcd = lcm;
				// Euclidean algorithm.
				while (r = n % gcd)
					n = gcd, gcd = r;
				lcm = num / gcd * lcm;
			}
		}
		return lcm;
	};

	/**
	 * Get <a href="https://en.wikipedia.org/wiki/Extended_Euclidean_algorithm"
	 * accessdate="2013/8/3 19:45">Extended Euclidean algorithm</a><br />
	 * 
	 * @param {Integer}n1
	 *            number 1
	 * @param {Integer}n2
	 *            number 2
	 * @returns [ GCD, m1, m2 ]: GCD = m1 * n1 + m2 * n2
	 * 
	 * @see division_with_remainder() @ data.math
	 * @since 2013/8/3 20:24:30
	 */
	function extended_GCD(n1, n2) {
		var remainder, quotient, using_g1 = false, using_bigint,
		// 前一group [dividend 应乘的倍数, divisor 应乘的倍数]
		m1g1 = 1, m2g1 = 0;
		if (typeof n1 === 'bigint' || typeof n2 === 'bigint') {
			// convert all numbers to the same type.
			n1 = BigInt(n1);
			n2 = BigInt(n2);
			m1g1 = BigInt(m1g1);
			m2g1 = BigInt(m2g1);
			using_bigint = true;
		}
		// 前前group [dividend 应乘的倍数, divisor 应乘的倍数]
		var m1g2 = /* 0 */m2g1, m2g2 = /* 1 */m1g1;

		while (remainder = n1 % n2) {
			quotient = (n1 - remainder) / n2;
			if (!using_bigint) {
				// assert: typeof quotient === 'number'
				quotient = Math.floor(quotient);
			}
			// 现 group = remainder = 前前group - quotient * 前一group
			if (using_g1 = !using_g1)
				m1g1 -= quotient * m1g2, m2g1 -= quotient * m2g2;
			else
				m1g2 -= quotient * m1g1, m2g2 -= quotient * m2g1;
			// swap numbers
			n1 = n2;
			n2 = remainder;
		}
		return using_g1 ? [ n2, m1g1, m2g1 ] : [ n2, m1g2, m2g2 ];
	}

	// extended GCD algorithm
	_.EGCD = extended_GCD;

	/**
	 * 带余除法 Euclidean division。<br />
	 * 除非设定 closest，否则预设 remainder ≥ 0.
	 * 
	 * @param {Number}dividend
	 *            被除数。
	 * @param {Number}divisor
	 *            除数。
	 * @param {Boolean}[closest]
	 *            get the closest quotient
	 * 
	 * @returns {Array} [ {Integer}quotient 商, {Number}remainder 余数 ]
	 * 
	 * @see http://stackoverflow.com/questions/14997165/fastest-way-to-get-a-positive-modulo-in-c-c
	 * @see extended_GCD() @ data.math
	 * 
	 * @since 2015/10/31 10:4:45
	 */
	function division_with_remainder(dividend, divisor, closest) {
		if (false)
			return [ Math.floor(dividend / divisor),
			// 转正。保证余数值非负数。
			(dividend % divisor + divisor) % divisor ];

		var remainder = dividend % divisor;
		if (closest) {
			if (remainder != 0
			// 0 !== 0n
			&& Math.absolute(remainder + remainder) > Math.absolute(divisor))
				if (remainder < 0)
					remainder += Math.absolute(divisor);
				else
					remainder -= Math.absolute(divisor);

		} else if (remainder < 0) {
			// assert: (-0 < 0) === false
			remainder += Math.absolute(divisor);
		}

		dividend = (dividend - remainder) / divisor;
		if (typeof dividend === 'number') {
			dividend = Math.round(dividend);
		} else {
			// assert: typeof dividend === 'bigint'
		}

		return [ dividend, remainder ];
	}

	// 带余数除法 division with remainder
	_.division = division_with_remainder;

	/**
	 * 取得所有分母为 denominator，分子分母互质的循环小数的循环节位数。<br />
	 * Repeating decimal: get period (repetend length)
	 * 
	 * @param {Natural}denominator
	 *            分母
	 * @param {Boolean}with_transient
	 *            亦取得非循环节部分位数
	 * @param {Natural}min
	 *            必须最小长度，在测试大量数字时使用。若发现长度必小于 min 则即时跳出。效果不俗 (test
	 *            Euler_26(1e7))。
	 * 
	 * @returns {Array}[{Number}period length 循环节位数 < denominator,
	 *          {Number}transient 非循环节部分位数 ]
	 * 
	 * @see https://en.wikipedia.org/wiki/Repeating_decimal#Reciprocals_of_composite_integers_coprime_to_10
	 */
	function period_length(denominator, with_transient, min) {
		// 去除所有 2 或 5 的因子。
		var non_repeating = 0, non_repeating_5 = 0;
		while (denominator % 5 === 0)
			denominator /= 5, non_repeating_5++;
		while (denominator % 2 === 0)
			denominator /= 2, non_repeating++;
		if (non_repeating < non_repeating_5)
			non_repeating = non_repeating_5;

		if (denominator === 1 || denominator <= min)
			return with_transient ? [ 0, non_repeating ] : 0;

		for (var length = 1, remainder = 1;; length++) {
			remainder = remainder * DEFAULT_BASE % denominator;
			if (remainder === 1)
				return with_transient ? [ length, non_repeating ] : length;
		}
	}

	_.period_length = period_length;

	// ---------------------------------------------------------------------//

	/**
	 * 从数集 set 中挑出某些数，使其积最接近指定的数 target。<br />
	 * To picks some numbers from set, so the product is approximately the
	 * target number.
	 * 
	 * TODO: improve/optimize
	 * 
	 * @param {Array}set
	 *            number set of {Natural}
	 * @param {Natural}target
	 *            target number
	 * @param {Object}[options]
	 *            附加参数/设定特殊功能与选项
	 * 
	 * @returns {Array}某些数，其积最接近 target。
	 * 
	 * @see http://stackoverflow.com/questions/19572043/given-a-target-sum-and-a-set-of-integers-find-the-closest-subset-of-numbers-tha
	 */
	function closest_product(set, target, options) {
		var status, minor_data;
		if (Array.isArray(options)) {
			status = options;
			minor_data = status[0];
			options = minor_data.options;

		} else {
			// 初始化
			if (!options)
				options = new Boolean;
			else if (typeof options === 'number')
				options = {
					direction : options
				};
			else if (typeof options === 'boolean')
				options = {
					sorted : options
				};
			minor_data = [ Infinity ];
			minor_data.options = options;
			// status = [ [minor, set of minor], product, set of product ]
			status = [ minor_data, ZERO_EXPONENT, [] ];
			if (!options.sorted)
				set = set.clone()
				// 由小至大排序。
				.sort(library_namespace.ascending);
		}

		// direction = -1: 仅接受小于 target 的积。
		// direction = +1: 仅接受大于 target 的积。
		var direction = options.direction,
		//
		product = status[1], selected = status[2];

		set.some(function(natural, index) {
			if (selected[index])
				// 已经处理过，跳过。
				return;

			var _product = product * natural, _selected,
			/** {Number}差 ≥ 0 */
			difference = Math.abs(target - _product),
			// 是否发现新极小值。采用 minor_data 而不 cache 是因为此间 minor_data 可能已经改变。
			_status = difference <= minor_data[0];
			library_namespace.debug(target + '=' + (target - _product) + '+'
					+ natural + '×' + product + ', ' + product + '='
					+ (set.filter(function(n, index) {
						return selected[index];
					}).join('⋅') || 1), 6, 'closest_product');

			if (target < _product) {
				library_namespace.debug('target < _product, direction: '
						+ direction, 6, 'closest_product');
				if (!_status || direction < 0) {
					library_namespace.debug('积已经过大，之后不会有合适的。', 5,
							'closest_product');
					return true;
				}
			}

			_selected = selected.clone();
			_selected[index] = true;

			if (_status && (!(direction > 0) || target <= _product)) {
				_status = set.filter(function(n, index) {
					return _selected[index];
				}).join(closest_product.separator);
				if (difference === minor_data[0]) {
					if (minor_data.includes(_status)) {
						library_namespace.debug('已经处理过相同的，跳过。', 5,
								'closest_product');
						return;
					}
					minor_data.push(_status);
				} else {
					minor_data.clear();
					minor_data.push(difference, _status);
				}
				library_namespace.debug('发现极小值:' + target + '=' + difference
						+ '+' + natural + '×' + product + ', ' + product + '='
						+ (set.filter(function(n, index) {
							return selected[index];
						}).join('⋅') || 1), 3, 'closest_product');
			}

			_status = [ minor_data, _product, _selected ];
			library_namespace.debug('继续探究是否有更小的差:' + _status.join(';'), 4,
					'closest_product');
			closest_product(set, target, _status);
		});

		return minor_data.length > 1 && minor_data;
	}

	closest_product.separator = MULTIPLICATION_SIGN;

	_.closest_product = closest_product;

	// TODO:将数列分为积最接近的两组。

	/**
	 * Get <a
	 * href="https://en.wikipedia.org/wiki/Modular_multiplicative_inverse"
	 * accessdate="2013/8/3 20:10">modular multiplicative inverse</a> (模反元素)
	 * 
	 * TODO:<br />
	 * untested!
	 * 
	 * @param {Integer}number
	 *            number
	 * @param {Integer}modulo
	 *            modulo
	 * 
	 * @returns {Integer} modular multiplicative inverse
	 * 
	 * @since 2013/8/3 20:24:30
	 */
	function modular_inverse(number, modulo) {
		number = extended_GCD(number, modulo);
		if (number[0] == 1)
			return (number = number[1]) < 0 ? number + modulo : number;
	}

	_.modular_inverse = modular_inverse;

	// factorial_cache[ n ] = n!
	// factorial_cache = [ 0! = 1, 1!, 2!, ... ]
	var factorial_cache = [ 1 ], factorial_cache_to;
	/**
	 * Get the factorial (阶乘) of (natural).<br />
	 * 
	 * @param {ℕ⁰:Natural+0}natural
	 *            safe integer. 0–18
	 * 
	 * @returns {Natural}natural的阶乘.
	 * 
	 * @see https://en.wikipedia.org/wiki/Factorial
	 */
	function factorial(natural) {
		var length = factorial_cache.length;
		if (length <= natural && !factorial_cache_to) {
			var f = factorial_cache[--length];
			while (length++ < natural)
				if (isFinite(f *= length))
					factorial_cache.push(f);
				else {
					factorial_cache_to = length - 1;
					break;
				}
		}
		return natural < length ? factorial_cache[natural] : Infinity;
	}

	// var factorial_map = CeL.math.factorial.map(9);
	// generate factorial map
	factorial.map = function(natural) {
		if (!natural)
			natural = 9;
		if (factorial_cache.length <= natural && !factorial_cache_to)
			factorial(natural);
		return factorial_cache.slice(0, natural + 1);
	};

	_.factorial = factorial;

	// ---------------------------------------------------------------------//

	/**
	 * http://www.math.umbc.edu/~campbell/NumbThy/Class/Programming/JavaScript.html
	 * http://aoki2.si.gunma-u.ac.jp/JavaScript/
	 */

	/**
	 * 得到开方数，相当于 Math.floor(Math.sqrt(number)) === Math.sqrt(number) | 0. get
	 * integer square root. TODO: use 牛顿法
	 * 
	 * @param {Number}
	 *            positive number
	 * 
	 * @return r, r^2 ≤ number < (r+1)^2
	 * 
	 * @see <a href="http://www.azillionmonkeys.com/qed/sqroot.html"
	 *      accessdate="2010/3/11 18:37">Paul Hsieh's Square Root page</a><br />
	 *      <a
	 *      href="http://www.embeddedrelated.com/usenet/embedded/show/114789-1.php"
	 *      accessdate="2010/3/11 18:34">Suitable Integer Square Root Algorithm
	 *      for 32-64-Bit Integers on Inexpensive Microcontroller? |
	 *      Comp.Arch.Embedded | EmbeddedRelated.com</a>
	 */
	function floor_sqrt(number) {
		// return Math.sqrt(number) | 0;

		if (!Number.isFinite(number = Math.floor(number)))
			return;
		var g = 0, v, h, t;
		while ((t = g << 1) < (v = number - g * g)) {
			// library_namespace.debug(t + ', ' + v);
			h = 1;
			while (h * (h + t) <= v)
				// 因为型别转关系，还是保留 << 而不用 *2
				h <<= 1;// h *= 2;
			g += h >> 1;// h / 2;//
		}
		if (false)
			library_namespace.debug('end: ' + t + ', ' + v);
		return g;
	}

	_.floor_sqrt = floor_sqrt;

	// count digits of integer: using .digit_length()
	function ceil_log(number, base) {
		if (!number)
			return 0;
		if (!base)
			base = DEFAULT_BASE;
		// assert: base >= 2, base === (base | 0)
		number = Math.abs(number);
		// ideal
		return Math.ceil(base === 10 ? Math.log10(number) : base === 2 ? Math
				.log2(number)
		// TODO: base = 2^n
		: Math.log(number) / Math.log(base));

		// slow... should use multiply by exponents
		// Logarithm
		var log = 0;
		if (number < ZERO_EXPONENT) {
			while (number < ZERO_EXPONENT) {
				number *= base;
				if (false)
					library_namespace.debug(number);
				log--;
			}
			if (number !== ZERO_EXPONENT)
				// 修正。
				log++;
		} else {
			while (number > ZERO_EXPONENT) {
				// 因为可能损失 base^exp + (...) 之剩余部分，因此不能仅采用 Math.floor(number /
				// base)
				// 但如此较费时。
				number /= base;
				if (false)
					library_namespace.log(number);
				log++;
			}
		}
		return log;
	}

	// add binding
	_.ceil_log = ceil_log;

	/** {Object}all possible last 2 digits of square number */
	var square_ending = Object.create(null);
	[ 0, 1, 4, 9, 16, 21, 24, 25, 29, 36, 41, 44, 49, 56, 61, 64, 69, 76, 81,
			84, 89, 96 ].forEach(function(n) {
		square_ending[n] = null;
	});

	// Squarity testing
	// 检测 ({Natural}number) 是否为完全平方数
	// a square number or perfect square. TODO: use 牛顿法
	// is square number, n²
	function is_square(number) {
		// 快速判定 possible_square(number)
		// https://www.johndcook.com/blog/2008/11/17/fast-way-to-test-whether-a-number-is-a-square/
		// 0x0213 = parseInt('1111110111101100', 2).toString(0x10)
		if (0xFDEC & (1 << (number & 0xF))) {
			return false;
		}
		// TRUE only if number % 16 === 0, 1, 4, 9
		// %16 有4个: http://oeis.org/A023105

		if (!((number % 100) in square_ending)) {
			return false;
		}

		number = Math.sqrt(number);
		return number === (number | 0) && number;

		// another method
		// https://en.wikipedia.org/wiki/Methods_of_computing_square_roots
		// https://gmplib.org/manual/Perfect-Square-Algorithm.html
		var sqrt = floor_sqrt(number);
		return sqrt * sqrt === number && sqrt;
	}

	_.is_square = is_square;

	// 检测 ({Natural}f1 * {Natural}f2) 是否为完全平方数
	function product_is_square(f1, f2) {
		if (f1 === f2) {
			return true;
			// e.g., r * p^2, r * p^2
		}

		// e.g., p^2 * r, q^2 * r
		var product = f1 * f2;
		if (Number.isSafeInteger(product)) {
			return is_square(product);
		}

		// 除法不比较快。
		if (f1 > f2) {
			// swap
			var tmp = f1;
			f1 = f2;
			f2 = tmp;
		}
		if (!Number.isSafeInteger(f2)) {
			library_namespace.error('The number ' + f2
					+ ' is NOT a safe number!');
		}
		// assert: f1 < f2
		if (f2 % f1 === 0) {
			// e.g., r, r * p^2
			return is_square(f2 / f1);
		}

		if (is_square(f1)) {
			// e.g., p^2, q^2
			return is_square(f2);
		}
		if (is_square(f2)) {
			return false;
		}

		for (var index = 0, length = Math.min(10, primes.length); index < length; index++) {
			var p = primes[index], p2 = p * p;
			tmp = false;
			while (f1 % p2 === 0) {
				f1 /= p2;
				tmp = true;
			}
			while (f2 % p2 === 0) {
				f2 /= p2;
				tmp = true;
			}
			if (f1 % p === 0) {
				while (f1 % p === 0 && f2 % p === 0) {
					f1 /= p;
					f2 /= p;
					tmp = true;
				}
			}
			if (tmp) {
				product = f1 * f2;
				if (Number.isSafeInteger(product)) {
					return is_square(product);
				}
			}
		}

		// 找GCD。较慢，但没办法。
		var gcd = GCD(f1, f2);
		return is_square(f1 / gcd)
		//
		&& is_square(f2 / gcd);
	}

	_.product_is_square = product_is_square;

	/**
	 * <code>

	n(n+1)/2=T, n∈ℕ, n=?
	n(n+1)/2=T, n=?
	n = 1/2 (sqrt(8 T+1)-1)
	Reduce[(n (1 + n))/2 == T, n]
	n = 1/2 (sqrt(8 T+1)-1)


	Reduce[n(3n−1)/2==P, n]
	n = 1/6 (sqrt(24 P+1)+1)

	// hexagonal
	Reduce[n(2n−1)==H, n]
	n = 1/4 (sqrt(8 H+1)+1)

	</code>
	 */

	function is_triangular(natural) {
		// https://en.wikipedia.org/wiki/Triangular_number
		var sqrt = is_square(8 * natural + 1);
		return sqrt && sqrt % 2 === 1;
	}

	_.is_triangular = is_triangular;

	function is_generalized_pentagonal(generalized) {
		// https://en.wikipedia.org/wiki/Pentagonal_number
		return is_square(24 * generalized + 1);
	}
	_.is_generalized_pentagonal = is_generalized_pentagonal;

	function is_pentagonal(natural) {
		// https://en.wikipedia.org/wiki/Pentagonal_number
		var sqrt = is_square(24 * natural + 1);
		return sqrt && sqrt % 6 === 5;
	}
	_.is_pentagonal = is_pentagonal;

	// 素勾股数 primitive Pythagorean triple
	var 素勾股数 = [], last_Pythagorean_m = 2;

	/**
	 * primitive Pythagorean triples 素勾股数组/素商高数组/素毕氏三元数
	 * 
	 * @param {Natural}limit
	 *            limit of m. 若欲改成 limit of 斜边，请输入斜边长后自行 filter。
	 * 
	 * @returns {Array}primitive Pythagorean triple list
	 * 
	 * @see https://en.wikipedia.org/wiki/Pythagorean_triple#Generating_a_triple
	 *      The triple generated by Euclid's formula is primitive if and only if
	 *      m and n are coprime and m − n is odd.
	 */
	function Pythagorean_list(limit) {
		if (last_Pythagorean_m < limit) {
			for (var m = last_Pythagorean_m; m < limit; m++) {
				for (var m2 = m * m, m_2 = 2 * m, n, n2 = n = m % 2 === 0 ? 1
						: 0;
				// 设 m > n 互质且均是正整数，m 和 n 有一个是偶数，
				// 计算出来的 (a, b, c) 就是素勾股数。所有素勾股数可用列式找出
				n < m; n += 2, n2 = n * n) {
					if (GCD(m, n) === 1) {
						var a = m2 - n2, b = m_2 * n, c = m2 + n2;
						// let a < b < c
						素勾股数.push(a < b ? [ a, b, c ] : [ b, a, c ]);
					}
				}
			}
			last_Pythagorean_m = limit;
		}

		return 素勾股数;
	}

	_.Pythagorean_list = Pythagorean_list;

	// ---------------------------------------------------------------------//

	// Catalan_number[0] = 1
	var Catalan_number_list = [ 1 ];

	// Catalan numbers
	// @see https://en.wikipedia.org/wiki/Catalan_number
	function Catalan_number(NO) {
		if (NO < Catalan_number_list.length) {
			// use cache
			return Catalan_number_list[NO];
		}

		var n = Catalan_number_list.length - 1,
		//
		this_Catalan_number = Catalan_number_list[n];
		for (; n < NO; n++) {
			this_Catalan_number = this_Catalan_number * (4 * n + 2) / (n + 2);
			Catalan_number_list.push(this_Catalan_number);
		}
		return this_Catalan_number;
	}

	_.Catalan_number_list = Catalan_number_list;
	_.Catalan_number = Catalan_number;

	// ---------------------------------------------------------------------//

	/** {Array}Collatz_conjecture_steps[number] = steps. cache 以加快速度。 */
	var Collatz_conjecture_steps_cache = [ , 1 ];
	if (false) {
		// 此法费时 1.5 倍， 12s → 19s
		Collatz_conjecture_steps_cache = new Array(1000001);
		Collatz_conjecture_steps_cache[1] = 1;
	}
	// assert: Collatz_conjecture_steps_cache[1] === 1 (因程式判别方法需要此项)

	// Collatz conjecture
	// https://en.wikipedia.org/wiki/Collatz_conjecture
	function Collatz_conjecture(natural) {
		if (!(natural > 0))
			return;

		var chain = [ natural ];
		while (natural > 1) {
			chain.push(natural % 2 === 0 ? natural /= 2
					: (natural = natural * 3 + 1));
		}
		// Collatz_conjecture_steps_cache[natural] = chain.length;

		// return all terms
		return chain;
	}

	// 为计算 steps 特殊化。
	// assert: CeL.Collatz_conjecture.steps(natural) ===
	// CeL.Collatz_conjecture(natural).length
	function Collatz_conjecture_steps(natural) {
		if (!(natural > 0))
			return;

		var chain = [];
		while (!(natural in Collatz_conjecture_steps_cache)) {
			chain.push(natural);
			if (natural % 2 === 0)
				natural /= 2;
			else
				natural = natural * 3 + 1;
		}

		var steps = Collatz_conjecture_steps_cache[natural] + chain.length, s = steps;
		// 纪录 steps。
		chain.forEach(function(natural) {
			Collatz_conjecture_steps_cache[natural] = s--;
		});
		return steps;
	}

	/**
	 * <code>

	backwards 反向:
	1000000: 153 steps
	999999: 259 steps
	999667: 290 steps
	999295: 396 steps
	997823: 440 steps
	970599: 458 steps
	939497: 507 steps
	837799: 525 steps

	 </code>
	 */

	// search the longest chain / sequence below ((natural))
	function Collatz_conjecture_longest(natural) {
		if (!(natural > 0))
			return;

		// maximum steps
		var max_steps = 0, max_steps_natural;
		// brute force
		for (var n = 1, steps, _n; n <= natural; n++) {
			if (n in Collatz_conjecture_steps_cache)
				steps = Collatz_conjecture_steps_cache[_n = n];
			else {
				steps = Collatz_conjecture_steps(_n = n);
				// 预先快速处理所有 2倍数字。采用此方法，约可增加 5% 速度。不采用此方法，n 正反向速度差不多。
				while (_n * 2 <= natural) {
					Collatz_conjecture_steps_cache[_n *= 2] = ++steps;
				}
			}
			if (max_steps < steps) {
				library_namespace.debug(natural + ': ' + steps + ' steps', 3,
						'Collatz_conjecture.longest');
				max_steps = steps;
				max_steps_natural = _n;
			}
		}
		return [ max_steps_natural, max_steps ];
	}

	_.Collatz_conjecture = Collatz_conjecture;
	Collatz_conjecture.steps = Collatz_conjecture_steps;
	Collatz_conjecture.longest = Collatz_conjecture_longest;

	// ---------------------------------------------------------------------//

	// https://en.wikipedia.org/wiki/Memoization
	/** {Array}质数列表。 cache / memoization 以加快速度。 */
	var primes = [ 2, 3, 5 ],
	/**
	 * last prime tested.<br />
	 * assert: last_prime_tested is ((6n ± 1)). 因此最起码应该从 5 开始。
	 * 
	 * @type {Natural}
	 */
	last_prime_tested = primes.at(-1);

	// https://en.wikipedia.org/wiki/Sieve_of_Eratosthenes
	// the sieve of Eratosthenes 筛法
	function prime_sieve(limit, limit_index) {
		// var list = _.number_array(limit + 1, 0, Int8Array);
		var list = new Array(limit + 1);
		// 重建 re-build list (table)
		primes.forEach(function(prime) {
			for (var number = prime; number <= limit;) {
				// list[number += prime] = 1;
				list[number += prime] = true;
			}
		});

		for (var n = last_prime_tested; n <= limit;) {
			if (list[++n])
				continue;
			// n is prime
			// library_namespace.debug(n + ' is prime');
			primes.push(n);
			if (limit_index && primes.length > limit_index)
				break;
			// 登记所有倍数。
			for (var number = n; number <= limit;) {
				// list[number += prime] = 1;
				list[number += prime] = true;
			}
		}

		last_prime_tested = primes.at(-1);
		return primes;
	}

	_.prime_sieve = prime_sieve;

	// integer: number to test
	function test_is_prime(integer, index, sqrt) {
		// assert: Number.isInteger(integer), integer ≥ 0
		index |= 0;
		if (!sqrt)
			sqrt = floor_sqrt(integer);
		// 采用试除法, use trial division。
		// 从第一个质数一直除到 ≤ sqrt(integer) 之质数
		for (var prime, length = primes.length; index < length;) {
			if (integer % (prime = primes[index++]) === 0)
				// return: prime factor found
				return integer === prime ? false : prime;
			if (sqrt < prime)
				return false;
		}
		// 质数列表中的质数尚无法检测 integer。
	}

	/**
	 * Get the prime[index] or prime list.
	 * 
	 * @param {Natural}[index]
	 *            prime index starts from 1
	 * @param {Natural}[limit]
	 *            the upper boundary of prime value
	 * 
	 * @returns {Natural}prime value
	 */
	function prime(index, limit) {
		if (!(index > 0)) {
			if (limit > 0) {
				index = prime_pi(limit);
				return primes.slice(0, index);
			}
			return primes;
		}

		if (primes.length < index) {
			if (false && index - primes.length > 1e6) {
				// using the sieve of Eratosthenes 筛法
				// 没比较快。
				// 详细数量应采 prime π(x)。
				// https://zh.wikipedia.org/wiki/%E8%B3%AA%E6%95%B8%E5%AE%9A%E7%90%86
				prime_sieve(limit || index * 10, index);
			} else {
				// assert: last_prime_tested is ((6n ± 1))
				/**
				 * {Boolean}p1 === true: last_prime_tested is 6n+1.<br />
				 * else: last_prime_tested is 6n-1
				 */
				var p1 = last_prime_tested % 6 === 1;

				for (; primes.length < index
						&& Number.isSafeInteger(last_prime_tested);) {
					last_prime_tested += (p1 = !p1) ? 2 : 4;
					// 实质为 https://en.wikipedia.org/wiki/Sieve_of_Eratosthenes
					if (!test_is_prime(last_prime_tested, 2))
						primes.push(last_prime_tested);
					if (limit && limit <= last_prime_tested)
						break;
				}
				library_namespace.debug('last prime tested = '
						+ last_prime_tested, 2, 'prime');
			}
		}

		return primes[index - 1];
	}

	_.prime = prime;

	// prime #5484598 = 94906249, the biggest prime <
	// Math.sqrt(Number.MAX_SAFE_INTEGER) - 1.
	// the 2nd biggest prime is 94906247.

	// CeL.prime(CeL.prime_pi(Number.MAX_SAFE_INTEGER = 2^53 - 1)) =
	// 9007199254740881
	function prime_pi(value) {
		value = Math.floor(Math.abs(value));
		if (last_prime_tested < value)
			prime(value, value);
		// +1: index of function prime() starts from 1!
		return primes.search_sorted(value, true) + 1;
	}
	_.prime_pi = prime_pi;

	/**
	 * Get the primorial (质数阶乘, p_n#) of (NO).<br />
	 * 
	 * @param {Natural}NO
	 *            safe integer. 1–13
	 * 
	 * @returns {Natural}p_NO的质数阶乘.
	 * 
	 * @see https://en.wikipedia.org/wiki/Primorial
	 */
	function primorial(NO) {
		if (!(NO >= 1))
			return MULTIPLICATIVE_IDENTITY;
		prime(NO);
		var index = 0, product = MULTIPLICATIVE_IDENTITY;
		while (index < NO)
			product *= primes[index++];
		return product;
	}

	/**
	 * Get the primorial (质数阶乘, n#) of (natural).<br />
	 * 
	 * @param {Natural}natural
	 *            safe integer. 2–42
	 * 
	 * @returns {Natural}natural的质数阶乘.
	 * 
	 * @see https://en.wikipedia.org/wiki/Primorial
	 */
	function primorial_natural(natural) {
		// 2: primes[0]
		if (!(natural >= 2))
			return MULTIPLICATIVE_IDENTITY;
		var index = 0, length = prime_pi(natural), product = MULTIPLICATIVE_IDENTITY;
		while (index < length)
			product *= primes[index++];
		return product;
	}

	_.primorial = primorial;
	primorial.natural = primorial_natural;

	// return multiplicand × multiplier % modulus
	// assert: 三者皆为 natural number, and Number.isSafeInteger() is OK.
	// max(multiplicand, multiplier) < modulus. 否则会出现错误!
	function multiply_modulo(multiplicand, multiplier, modulus) {
		var quotient = multiplicand * multiplier;
		if (Number.isSafeInteger(quotient))
			return quotient % modulus;

		// 避免 overflow
		if (multiplicand > multiplier)
			quotient = multiplicand, multiplicand = multiplier,
					multiplier = quotient;
		if (quotient === 1)
			throw new Error('Please use data.math.integer instead!');
		quotient = Math.floor(modulus / multiplicand);
		quotient = (multiplicand * (multiplier % quotient) - Math
				.floor(multiplier / quotient)
				* (modulus % multiplicand))
				% modulus;
		return quotient;
	}
	_.multiply_modulo = multiply_modulo;

	// return integer ^ exponent % modulus
	// assert: 三者皆为 natural number, and Number.isSafeInteger() is OK. 否则会出现错误!
	function power_modulo(integer, exponent, modulus) {
		for (var remainder = 1, power = integer % modulus;;) {
			if (exponent % 2 === 1)
				remainder = multiply_modulo(remainder, power, modulus);
			if ((exponent >>= 1) === 0)
				return remainder;
			if ((power = multiply_modulo(power, power, modulus)) === 1)
				return remainder;
		}
	}
	_.power_modulo = power_modulo;

	function power_modulo(natural, exponent, modulus) {
		var remainder = 1;
		for (natural %= modulus; exponent > 0; natural = natural * natural
				% modulus, exponent >>= 1)
			if (exponent % 2 === 1)
				remainder = remainder * natural % modulus;
		return remainder;
	}
	_.power_modulo = power_modulo;

	// Miller–Rabin primality test
	// return true: is composite, undefined: probable prime (PRP) / invalid
	// number
	// https://en.wikipedia.org/wiki/Miller%E2%80%93Rabin_primality_test
	function Miller_Rabin(natural, times) {
		if (natural % 2 === 0)
			return natural !== 2;
		if (!(natural < sqrt_max_integer) || natural < 2)
			return;

		var n_1 = natural - 1, d = n_1, s = 0, a, x;
		do {
			s++, d /= 2;
		} while (d % 2 === 0);
		// assert: s > 0

		if (!(times |= 0))
			times = 3;

		for (var prime_index = 0; prime_index < times;) {
			// 3rd 起用大数( > 307) 侦测。
			x = power_modulo(prime(++prime_index + (prime_index < 3 ? 0 : 60)),
					d, natural);
			if (x === 1 || x === n_1)
				continue;

			var i = 1, j = 1;
			for (; i < s; i++) {
				x = x * x % natural;
				if (x === 1)
					return true;
				if (x === n_1) {
					j = 0;
					break;
				}
			}
			if (j)
				// composite
				return true;
		}

		// probable prime to base 2, 3.

		// probable prime (PRP), probably prime
		// https://en.wikipedia.org/wiki/Probable_prime
	}
	_.Miller_Rabin = Miller_Rabin;

	/**
	 * Test if ((natural)) is not prime. 是否不为质数。
	 * 
	 * 对大数，仅能确定为合数，不是质数；不能保证是质数。
	 * 
	 * @param {Natural}natural
	 *            natural number to test
	 * 
	 * @returns true: is composite.<br />
	 *          false: is prime.<br />
	 *          prime: min prime factor. The least prime divisor of ((natural)).<br />
	 *          undefined: probable prime (PRP) / invalid number.
	 */
	function not_prime(natural) {
		if (!Number.isSafeInteger(natural) || natural < 2)
			return true;

		var result;

		if (false) {
			var sqrt = floor_sqrt(natural = result);
			result = 0;
			while ((result = test_is_prime(natural, result, sqrt)) === undefined) {
				// 多取一些质数。
				prime((result = primes.length) + 1);
			}
		}

		// warming up. 为 Miller_Rabin() 暖身。
		prime(70);

		// 先从耗费少的检测开始。

		// 先检测此数是否在质数列表中。
		if (natural <= last_prime_tested)
			// -1: NOT_FOUND
			return primes.search_sorted(natural) === -1;

		result = primes.length < 1e3
				&& last_prime_tested * last_prime_tested < natural
		// ↑ 1e3: 当有太多质数要测，test_is_prime()就不划算了。
		? undefined : test_is_prime(natural);
		if (result === undefined)
			result = Miller_Rabin(natural);
		if (result === undefined) {
			if (primes.length < 1e5)
				// 多取一些质数。一般说来，产生这表的速度颇快。
				prime(1e5);
			result = test_is_prime(natural);
		}

		return result;
	}

	_.not_prime = not_prime;

	function Pollards_rho_1980(natural) {
		if (natural % 2 === 0)
			return 2;
		if (natural % 3 === 0)
			return 3;
		if (!(natural < sqrt_max_integer) || natural < 2)
			return;

		// reset initial value
		// assert: natural > max(y, m, c)
		var x = natural - 4, y = 2 + (Math.random() * x | 0), m = 2 + (Math
				.random()
				* x | 0), c = 2 + (Math.random() * x | 0), r = 1, q = 1, i, k, ys, G;
		do {
			for (x = y, i = r; i--;)
				// f(x) = (x^2 + c) % N
				y = (y * y % natural + c) % natural;
			k = 0;
			do {
				for (ys = y, i = Math.min(m, r - k); i--;) {
					// f(x) = (x^2 + c) % N
					y = (y * y % natural + c) % natural;
					q = q * Math.abs(x - y) % natural;
				}
				G = GCD(q, natural);
				k += m;
			} while (k < r && G === 1);
			r *= 2;
			// TODO: 当 r 过大，例如为十位数以上之质数时，过于消耗时间。
		} while (G === 1);

		if (natural === G)
			do {
				// f(x) = (x^2 + c) % N
				ys = (ys * ys % natural + c) % natural;
				G = GCD(Math.abs(x - ys), natural);
			} while (G === 1);

		return natural === G && G;
	}

	_.Pollards_rho = Pollards_rho_1980;

	// ---------------------------------------------------------------------//

	// CeL.factorize(natural > 1).toString(exponentiation_sign,
	// multiplication_sign)
	function factors_toString(exponentiation_sign, multiplication_sign) {
		if (!exponentiation_sign && !Number.prototype.to_super)
			exponentiation_sign = true;

		if (!multiplication_sign)
			// https://en.wikipedia.org/wiki/Multiplication_sign
			multiplication_sign = '⋅';
		else if (multiplication_sign === true)
			// https://en.wikipedia.org/wiki/Interpunct
			multiplication_sign = '×';
		// others: '*'

		var list = [];

		for ( var factor in this) {
			if (this[factor] > ZERO_EXPONENT)
				// expand exponentiation
				factor += exponentiation_sign === true ? (multiplication_sign + factor)
						.repeat(this[factor] - ZERO_EXPONENT)
						// https://en.wikipedia.org/wiki/Exponentiation#In_programming_languages
						// exponentiation_sign: ^, **, ↑, ^^, ⋆
						: exponentiation_sign ? exponentiation_sign
								+ this[factor]
						// https://en.wikipedia.org/wiki/Prime_factor
						// To shorten prime factorizations, factors are often
						// expressed in powers (multiplicities).
						: this[factor].to_super();
			list.push(factor);
		}

		return list.join(multiplication_sign);
	}

	// 计算所有因数个数。
	// 计算所有质因数个数: Object.keys(factors).length
	// 质因数列表: Object.keys(factors)
	function count_all_factors() {
		var count = MULTIPLICATIVE_IDENTITY;
		for ( var prime in this) {
			// exponent
			count *= this[prime] + 1;
		}
		// re-define count
		Object.defineProperty(this, 'count', {
			enumerable : false,
			value : count
		});
		return count;
	}

	// 欧拉函数 φ(n), Euler's totient function, Euler's phi function
	// 是小于或等于n的正整数中与n互质的数的数目。
	// https://en.wikipedia.org/wiki/Euler's_totient_function
	function coprime() {
		var count = this.natural;
		for ( var prime in this) {
			count = count / prime * (prime - 1);
		}
		// re-define coprime
		Object.defineProperty(this, 'coprime', {
			enumerable : false,
			value : count
		});
		return count;
	}

	/**
	 * 取得某数的质因数分解，整数分解/因式分解/素因子分解, prime factorization, get floor factor.<br />
	 * 唯一分解定理(The Unique Factorization Theorem)告诉我们素因子分解是唯一的，这即是称为算术基本定理 (The
	 * Fundamental Theorem of Arithmeric) 的数学金科玉律。<br />
	 * 
	 * use Object.keys(factors) to get primes
	 * 
	 * @param {Natural}natural
	 *            integer number ≥ 2
	 * @param {Natural}radix
	 *            output radix
	 * @param {Natural}index
	 *            start prime index
	 * 
	 * @return {Object}prime factors { prime1:power1, prime2:power2, ... }
	 * 
	 * @requires floor_sqrt
	 * 
	 * @see <a href="http://homepage2.nifty.com/m_kamada/math/10001.htm"
	 *      accessdate="2010/3/11 18:7">Factorizations of 100...001</a>
	 */
	function factorize(natural, radix, index, factors) {
		if (!Number.isSafeInteger(natural) || natural < 2
		/**
		 * javascript 可以表示的最大整数值 = 10^21-2^16-1 = 999999999999999934463
		 * 
		 * @see http://www.highdots.com/forums/javascript/how-js-numbers-represented-internally-166538-4.html
		 */
		// && !(1 < (natural = Math.floor(Math.abs(natural))) && natural <
		// 999999999999999934469)
		)
			return;

		if (!radix)
			radix = undefined;
		try {
			radix.toString(radix);
		} catch (e) {
			// IE8?
			radix = DEFAULT_BASE;
		}
		if (!factors)
			factors = Object.create(null);
		Object.defineProperties(factors, {
			natural : {
				enumerable : false,
				value : natural
			},
			toString : {
				enumerable : false,
				value : factors_toString
			},
			count : {
				enumerable : false,
				configurable : true,
				get : count_all_factors
			},
			coprime : {
				enumerable : false,
				configurable : true,
				get : coprime
			}
		});

		index |= 0;
		var p = 1, sqrt = floor_sqrt(natural);
		for (var power, length = primes.length; p <= sqrt;)
			// 采用试除法, use trial division。
			if (natural % (p = index < length ? primes[index++]
			// find enough primes
			: prime(++index)) === 0) {
				for (power = 1; (natural /= p) % p === 0;)
					power++;
				factors[p.toString(radix)] = power;
				sqrt = floor_sqrt(natural);
			}
		if (1 < natural)
			factors[natural.toString(radix)] = 1;
		return factors;

		// 为了获得确实结果，在 (Number.MAX_SAFE_INTEGER) 范围内不采用 Pollard's rho。
		// 事实上，若加上 (natural < sqrt_max_integer) 的限制，
		// 一般说来在此范围内使用 Pollard's rho 亦不切实际。

		if (sqrt < p) {
			// assert: natural is now prime.
			if (1 < natural)
				factors[natural.toString(radix)] = 1;
			return factors;
		}
		var fA = [], fac = function(i) {
			if (sqrt_max_integer <= natural || not_prime(i)) {
				var p, count = 3;
				while (count-- && !(p = Pollards_rho_1980(i)))
					;
				if (p) {
					fac(p);
					fac(i / p);
					return;
				} else
					library_namespace
							.warn('factorize: 无法分解'
									+ (library_namespace.is_debug()
											&& Miller_Rabin(i) ? '合数' : '')
									+ '因子 [' + i.toString()
									+ ']；您或许有必要自行质因数分解此数！');
			}
			fA.push(i);
		};
		fac(natural);

		if (Array.isArray(factors)) {
			// TODO
		}

		fA.sort(library_namespace.ascending);
		fA.forEach(function(p) {
			p = p.toString(radix);
			if (p in factors)
				factors[p]++;
			else
				factors[p] = 1;
		});

		return factors;
	}

	factorize._toString = factors_toString;

	_.factorize = factorize;

	// test
	(function() {
		function count(n) {
			var a = factorize(n), s = '', v = 1;
			if (a) {
				for ( var i in a) {
					s += '*' + i + (a[i] > 1 ? '^' + a[i] : '');
					v *= Math.pow(i, a[i]);
				}
				s = s.substr(1) + '=' + v + '=' + n;
			} else
				s = 'error! ' + n;
			document.getElementById('result').value += s
					+ '\n-------------------------------------------\n';
		}
	});

	/**
	 * 得到第一个质数因子。
	 * 
	 * @param {Natural}natural
	 *            natural number ≥ 2
	 * 
	 * @returns{Natural}the first prime factor of ((natural))
	 */
	function first_factor(natural) {
		for (var p = 1, sqrt = floor_sqrt(natural), index = 0, length = primes.length; p <= sqrt;)
			// 采用试除法, use trial division。
			if (natural % (p = index < length ? primes[index++]
			// find enough primes
			: prime(++index)) === 0)
				return p;
		return natural;
	}

	_.first_factor = first_factor;

	/**
	 * Get the summation map 1–limit of proper factors.
	 * 
	 * A proper factor of a positive integer n is a factor of n other than 1 or
	 * n (Derbyshire 2004, p. 32).<br />
	 * A positive divisor of n which is different from n is called a proper
	 * divisor or an aliquot part of n.
	 * 
	 * @param {Natural}limit
	 *            处理到哪个数字。include limit itself.
	 * @param {Object}[options]
	 *            附加参数/设定特殊功能与选项
	 * 
	 * @returns {Natural}summation of proper factors
	 * 
	 * @see http://mathworld.wolfram.com/ProperFactor.html
	 */
	function factor_sum_map(limit, options) {
		var add_1, add_self,
		// default: {Natural}∑ summation of proper factors
		get_sum = true, processor, list;

		if (options) {
			if (typeof options === 'function')
				processor = options.processor;
			add_1 = options.add_1;
			add_self = options.add_self;
			list = options.list;
			if (options.all_factors)
				add_1 = add_self = true;
			processor = options.processor;
			if (typeof processor === 'string' && factor_sum_map[processor])
				processor = factor_sum_map[processor];
			if (typeof processor !== 'function') {
				processor = undefined;
				// options.list: get factor list instead of summation.
				get_sum = !options.get_list;
			}
		}

		// assert: limit ≥ 1
		// ++limit: number up to ((limit)), but need ((limit+1)) elements.
		++limit;

		var
		// ((index)) starts from 2.
		// skip 0: needless, natural numbers starts from 1.
		// skip 1: already precessed by .fill(1).
		index = list ? 0 : 2,
		// options.add_1: every number has factor 1,
		// set this if you want include 1 into sum.
		factor_map = get_sum ? _.number_array(limit, add_1 ? 1 : 0,
				options.type)
		//
		: add_1 ? [ , [ 1 ] ] : [];

		if (false)
			// factor_map[0] is nonsense 无意义，预设成 0。
			factor_map[0] = 0;

		if (options && typeof options.preprocessor === 'function')
			factor_map = options.preprocessor(factor_map) || factor_map;

		// generate factor map: a kind of sieve method 筛法.
		// https://en.wikipedia.org/wiki/Sieve_theory
		for (;; index++) {
			var number = list ? list[index] : index;
			if (!(number < limit))
				break;
			for (var n = add_self ? number : 2 * number; n < limit; n += number) {
				// 处理所有 ((number)) 之倍数。
				if (processor)
					// processor : function(factor_map, factor, natural) {;}
					processor(factor_map, number, n);
				else if (get_sum)
					// 将所有 ((number)) 之倍数都加上 ((number))。
					// Append ((number)) to every multiple of ((number)).
					//
					// factor_map[0] is nonsense 无意义
					// factor_map[number>0]
					// = summation of the proper factors of number.
					factor_map[n] += number;
				else if (n in factor_map)
					factor_map[n].push(number);
				else
					factor_map[n] = add_1 ? [ 1, number ] : [ number ];
			}
		}

		library_namespace.debug('factor map: [' + factor_map.length + '] '
				+ factor_map.slice(0, 30).join(';') + '...', 1,
				'factor_sum_map');

		return factor_map;
	}

	_.factor_sum_map = factor_sum_map;

	// count factors
	factor_sum_map.count = function(factor_map, factor, natural) {
		factor_map[natural]++;
	};

	/**
	 * count coprime numbers below ((limit)).<br />
	 * 计算所有比各数字小，并与各数字互质的数。<br />
	 * 欧拉函数 φ(n), Euler's totient function, Euler's phi function
	 * 是小于或等于n的正整数中与n互质的数的数目。
	 * 
	 * @param {Natural}limit
	 *            natural number ≥ 2
	 * 
	 * @returns {Array}coprime map
	 * 
	 * @see function coprime()<br />
	 *      https://en.wikipedia.org/wiki/Euler's_totient_function
	 * 
	 */
	function coprime_map(limit, options) {
		return factor_sum_map(limit, {
			add_self : true,
			// 初始化。
			preprocessor : function(factor_map) {
				factor_map.forEach(function(v, i) {
					factor_map[i] = i;
				});
			},
			list : prime(0, limit),
			processor : function(factor_map, prime, number) {
				factor_map[number] = factor_map[number] / prime * (prime - 1);
			}
		});
	}

	_.coprime_map = coprime_map;

	/**
	 * Get perfect number list.
	 * 
	 * @param {Natural}limit
	 *            处理到哪个数字。include limit itself.
	 * @param {Number}type
	 *            type>0: abundant number.<br />
	 *            type<0: deficient number.<br />
	 *            default: perfect number
	 * 
	 * @returns {Array}number list
	 */
	function perfect_numbers(limit, type) {
		var numbers = [], factor_map = factor_sum_map(limit, {
			add_1 : true
		});

		// skip 0: needless, natural numbers starts from 1.
		// 仅对过剩数才需要做此处置。
		if (type > 0)
			factor_map[0] = 0;

		// 虽然设定 add_1，但对 1 本身，应该为 0。
		factor_map[1] = 0;

		factor_map.forEach(type > 0 ? function(factor_sum, index) {
			// abundant number or excessive number. 过剩数又称作丰数或盈数
			// https://en.wikipedia.org/wiki/Abundant_number
			if (factor_sum > index)
				numbers.push(index);
		} : type < 0 ? function(factor_sum, index) {
			// deficient or deficient number. 亏数又称作缺数
			// https://en.wikipedia.org/wiki/Deficient_number
			if (factor_sum < index)
				numbers.push(index);
		} : function(factor_sum, index) {
			// perfect numbers. 完全数，又称完美数或完备数
			// https://en.wikipedia.org/wiki/Perfect_number
			if (factor_sum === index)
				numbers.push(index);
		});

		library_namespace.debug('numbers: [' + numbers.length + '] '
				+ numbers.slice(0, 30) + '...', 1, 'perfect_numbers');

		return numbers;
	}

	_.perfect_numbers = perfect_numbers;

	// ---------------------------------------------------------------------//

	// 回文数 palindromic number or numeral palindrome
	// http://www.csie.ntnu.edu.tw/~u91029/Palindrome.html
	function palindrome_list(limit, base) {
		if (!base)
			base = DEFAULT_BASE;
		// 个位数皆为回文数。
		var list = new Array(Math.min(base, limit)).fill(ABSORBING_ELEMENT)
				.map(function(v, i) {
					return i;
				});
		if (limit <= base)
			return list;

		for (var power = 1, next_power = base, n;;) {
			// 2e 位数(e), e.g., 1001
			// left: 10^e–10^(e+1)-1
			for (var l = power; l < next_power; l++) {
				var left = l.toString(base),
				// right side
				right = left.split('').reverse().join('');
				n = parseInt(left + right, base);
				if (n >= limit)
					break;
				list.push(n);
			}
			if (n >= limit)
				break;

			// 2e+1 位数, e.g., 10201
			// left: 10^e–10^(e+1)-1
			for (var l = power; l < next_power; l++) {
				var left = l.toString(base),
				// right side
				right = left.split('').reverse().join('');
				for (var middle = 0; middle < base; middle++) {
					n = parseInt(left + middle + right, base);
					if (n >= limit)
						break;
					list.push(n);
				}
			}
			if (n >= limit)
				break;

			power = next_power;
			next_power *= base;
		}

		return list;
	}

	_.palindrome_list = palindrome_list;

	function is_palindrome(natural, base) {
		if (typeof natural !== 'srting')
			// assert: typeof natural !== 'number'
			natural = natural.toString(base);
		// 将这个数的数字按相反的顺序重新排列后，所得到的数和原来的数一样。
		return natural === natural.split('').reverse().join('');
	}

	_.is_palindrome = is_palindrome;

	// ---------------------------------------------------------------------//

	_// JSDT:_module_
	.
	/**
	 * 猜测一个数可能的次方数。
	 * 
	 * @param {Number}
	 *            number 数字
	 * @param {Boolean}
	 *            type false: base 为整数, true: base 为有理数
	 * 
	 * @returns [{Integer} base 分子, {Integer} base 分母, {Integer} exponent 分子,
	 *          {Integer} exponent 分母]
	 * 
	 * @since 2005/2/18 19:20 未完成
	 */
	guess_exponent = function(number, type) {
		var bn, bd, en = 1, ed, sq = [ 1, number ], t, q,
		// default error, accuracy, stopping tolerance, 容许误差
		error = Number.EPSILON,
		//
		g = function(n) {
			q = _.to_rational_number(n, 99999);
			if ((!type || q[1] === 1) && !(q[0] > 99999 && q[1] > 99999)
					&& q[2] / n < error)
				bn = q[0], bd = q[1], ed = t;
		};

		if (!ed)
			g(sq[t = 1]);
		if (!ed)
			g(sq[t = 2] = sq[1] * sq[1]);
		if (!ed)
			g(sq[t = 3] = sq[1] * sq[2]);
		if (!ed)
			g(sq[t = 4] = sq[2] * sq[2]);
		if (!ed)
			g(sq[t = 5] = sq[2] * sq[3]);
		if (!ed)
			bn = number, bd = ed = 1;

		return [ bn, bd, en, ed ];
	};

	/**
	 * get random prime(s)
	 * 
	 * @param {Integer}count
	 *            个数
	 * @param {Array}exclude
	 *            排除
	 * @param {Boolean}all_different
	 * 
	 * @returns random prime / random prime array
	 * 
	 * @since 2009/10/21 11:57:47
	 */
	function get_random_prime(count, exclude, all_different) {
		var i, j, p = [], l;
		if (!count || count < 1)
			count = 1;
		if (!get_random_prime.excluded)
			get_random_prime.excluded = [];
		if (exclude)
			exclude = [];

		// 先行准备好足够的 primes。
		prime(2 * count, 2 * count);

		for (j = 0; j < count; j++) {
			// timeout
			l = 80;
			do {
				i = Math.round(10 * Math.tan(Math.random() * 1.5));
				if (!--l)
					// timeout
					return;
			} while (get_random_prime.excluded[i]);
			p.push(primes[i]);
			if (exclude)
				exclude.push(i);
		}

		// 选完才排除本次选的
		if (exclude)
			for (j = 0, l = exclude.length; j < l; j++) {
				i = exclude[j];
				if (get_random_prime.excluded[i])
					get_random_prime.excluded[i]++;
				else
					get_random_prime.excluded[i] = 1;
			}

		return count === 1 ? p[0] : p;
	}

	// return [GCD, n1, n2, ..]
	get_random_prime.get_different_number_set = function(count, till, GCD_till) {
		delete this.excluded;
		if (!GCD_till)
			GCD_till = 1e5;
		if (!till)
			till = 1e5;

		/**
		 * 求乘积, 乘到比till小就回传.
		 * 
		 * @param nums
		 *            num array
		 * @param till
		 * @returns {Number}
		 */
		function get_product(nums, till) {
			var p = 1, i = 0, l = nums.length;
			for (; i < l; i++) {
				if (till && p * nums[i] > till)
					break;
				p *= nums[i];
			}
			return p;
		}

		var GCD = get_product(this(20, 1), GCD_till), na = [], n_e = [], n, i = 0, out;
		n_e[GCD] = 1;

		for (; i < count; i++) {
			out = 80; // timeout
			do {
				n = this(20);
				n.unshift(GCD);
				n = get_product(n, till);
			} while (n_e[n] && --out);
			n_e[n] = 1;
			na.push(n);
		}

		if (typeof lcm == 'function')
			na.LCM = lcm(na);
		na.GCD = GCD;
		return na;
	};

	// ------------------------------------------------------------------------------------------------------//

	/**
	 * 求取反函数 caculator[-1](result)
	 * 
	 * @deprecated
	 */
	function get_boundary(caculator, result, down, up, limit) {
		if (up - down === 0)
			return up;

		var boundary, value, increase;
		// assert: caculator(down) – caculator(up) 为严格递增/严格递减函数。
		if (caculator(up) - caculator(down) < 0) {
			// swap.
			boundary = up;
			up = down;
			down = boundary;
		}

		// assert: caculator(down) < caculator(up)
		increase = down < up;
		if (!(limit > 0))
			limit = 800;

		do {
			boundary = (up + down) / 2;
			// console.log(down + ' – ' + boundary + ' – ' + up);
			if (boundary === down || boundary === up)
				return boundary;
			value = result - caculator(boundary);
			if (value === 0) {
				if (result - caculator(down) === 0) {
					down = boundary;
					value = true;
				}
				if (result - caculator(up) === 0) {
					up = boundary;
					value = true;
				}
				if (value && (increase ? up - down > 0 : up - down < 0))
					continue;
				return boundary;
			}
			if (value > 0)
				down = boundary;
			else
				up = boundary;
		} while (--limit > 0 && (increase ? up - down > 0 : up - down < 0));

		throw 'get_boundary: caculator is not either strictly increasing or decreasing?';
	}

	/**
	 * 求根/求取反函数 equation^-1(y)。 using Secant method.
	 * 
	 * @param {Function}equation
	 *            演算式, mapping function
	 * @param {Number}x0
	 *            内插法(线性插值 Interpolation)求值之自变数 variable 下限，设定初始近似值。
	 * @param {Number}x1
	 *            内插法(线性插值 Interpolation)求值之自变数 variable 上限，设定初始近似值。
	 * @param {Number}[y]
	 *            目标值。default: 0. get (equation^-1)(y)
	 * @param {Object}[options]
	 *            附加参数/设定特殊功能与选项
	 * 
	 * @returns {Number}root: equation(root)≈y
	 * 
	 * @see Interpolation 以内插值替换
	 *      https://en.wikipedia.org/wiki/Root-finding_algorithm
	 *      https://en.wikipedia.org/wiki/Secant_method
	 */
	function secant_method(equation, x0, x1, y, options) {
		// default error, accuracy, stopping tolerance, 容许误差
		var error = Number.EPSILON;
		if (!options)
			options = Object.create(null);
		else if (options > 0)
			error = options;
		else if (options.error > 0)
			error = Math.abs(options.error);

		y = +y || 0;

		var count = (options.count || 40) | 0,
		// assert: y0 = equation(x0)
		y0 = 'y0' in options ? options.y0 : equation(x0),
		// assert: y1 = equation(x1)
		y1 = 'y1' in options ? options.y1 : equation(x1),
		//
		x2 = x1, y2 = y1;

		if (typeof options.start_OK === 'function'
		// 初始测试: Invalid initial value, 不合理的初始值，因此毋须继续。
		&& !options.start_OK(y0, y1))
			return;

		// main loop
		while (error < Math.abs(y2 - y) && count-- > 0
		// 分母不应为 0 或 NaN。
		&& (y0 -= y1)
		// 测试已达极限，已经得到相当好的效果。无法取得更精准值。
		// assert: else: x0===x, 可能是因为误差已过小。
		&& ((x2 = x1 - (x1 - x0) * (y - y1) / y0) !== x1 || x1 !== x0)) {
			// evaluate result
			y2 = equation(x2);
			if (false)
				library_namespace.debug(count + ': ' + x2 + ',' + y2 + ' → '
						+ (y2 - y));
			// shift items
			x0 = x1, y0 = y1;
			x1 = x2, y1 = y2;
		}

		return x2;
	}

	_.secant_method = secant_method;

	/**
	 * 求根/求取反函数 equation^-1(y)。 using Sidi's generalized secant method.
	 * 
	 * @param {Function}equation
	 *            演算式, mapping function
	 * @param {Number}x0
	 *            求值之自变数 variable 下限，设定初始近似值。
	 * @param {Number}x1
	 *            求值之自变数 variable 上限，设定初始近似值。
	 * @param {Number}[y]
	 *            目标值。default: 0. get (equation^-1)(y)
	 * @param {Object}[options]
	 *            附加参数/设定特殊功能与选项
	 * 
	 * @returns {Number}root: equation(root)≈y
	 * 
	 * @see https://en.wikipedia.org/wiki/Root-finding_algorithm
	 * @see https://en.wikipedia.org/wiki/Sidi's_generalized_secant_method
	 */
	function Sidi_method(equation, x0, x1, y, options) {
		// default error, accuracy, stopping tolerance, 容许误差
		var error = Number.EPSILON;
		if (!options)
			options = Object.create(null);
		else if (typeof options === 'number' && options > 0)
			// ↑ @Firefox/44.0:
			// isNaN(Object.create(null)): TypeError: can't convert v to number
			// Number.isNaN(Object.create(null)) === false
			error = options;
		else if (options.error > 0)
			error = Math.abs(options.error);

		y = +y || 0;

		var count = (options.count || 40) | 0,
		// assert: y0 = equation(x0)
		y0 = 'y0' in options ? options.y0 : equation(x0),
		// assert: y1 = equation(x1)
		y1 = 'y1' in options ? options.y1 : equation(x1);

		if (typeof options.start_OK === 'function'
		// 初始测试: Invalid initial value, 不合理的初始值，因此毋须继续。
		&& !options.start_OK(y0, y1))
			return;

		// initialization
		var x2 = x1 - (x1 - x0) * (y1 - y) / (y1 - y0),
		//
		y2 = equation(x2), x3 = x2, y3 = y2,
		// divided differences, 1阶差商
		y10 = (y1 - y0) / (x1 - x0), y21 = (y2 - y1) / (x2 - x1),
		// 2阶差商
		y210 = (y21 - y10) / (x2 - x0),
		// 暂时使用。
		denominator;

		// main loop of Sidi's generalized secant method (take k = 2)
		while (error < Math.abs(y3 - y)
				&& count-- > 0
				// 检查是否两个差距极小的不同输入，获得相同输出。
				&& y21 !== 0
				// 分母不应为 0 或 NaN。
				&& (denominator = y21 + y210 * (x2 - x1))
				// Avram Sidi (2008), "Generalization Of The Secant Method For
				// Nonlinear Equations"
				// 可能需要考量会不会有循环的问题。
				&& ((x3 = x2 - (y2 - y) / denominator) !== x2 || x2 !== x1 || x1 !== x0)) {
			// evaluate result
			y3 = equation(x3);
			if (false)
				console.log(count + ': ' + x3 + ',' + y3 + ' → error '
						+ (y3 - y));
			// shift items
			x0 = x1, y0 = y1;
			x1 = x2, y1 = y2;
			x2 = x3, y2 = y3;
			// reckon divided differences
			y10 = y21;
			y21 = (y2 - y1) / (x2 - x1);
			// y210 = (y21 - y10) / (x2 - x0);
			// incase y21 === y10
			if (y210 = y21 - y10)
				y210 /= x2 - x0;
			if (false)
				console.log('divided differences: ' + [ y10, y21, y210 ]);
		}

		return x3;
	}

	_.Sidi_method = Sidi_method;

	/**
	 * 以 Brent's method 求根/求取反函数 equation^-1(y)。
	 * 
	 * TODO: 牛顿法, options.derivative
	 * 
	 * @param {Function}equation
	 *            演算式, mapping function
	 * @param {Number}x0
	 *            求值之自变数 variable 下限，设定初始近似值。
	 * @param {Number}x1
	 *            求值之自变数 variable 上限，设定初始近似值。
	 * @param {Number}[y]
	 *            目标值。default: 0. get (equation^-1)(y)
	 * @param {Object}[options]
	 *            附加参数/设定特殊功能与选项
	 * 
	 * @returns {Number}root: equation(root)≈y
	 * 
	 * @see https://en.wikipedia.org/wiki/Root-finding_algorithm
	 * @see https://en.wikipedia.org/wiki/Brent%27s_method
	 * @see http://www.boost.org/doc/libs/1_58_0/boost/math/tools/minima.hpp
	 * @see http://people.sc.fsu.edu/~jburkardt/cpp_src/brent/brent.cpp
	 * @see http://www.cscjournals.org/manuscript/Journals/IJEA/volume4/Issue1/IJEA-33.pdf
	 * @see http://www.cscjournals.org/manuscript/Journals/IJEA/volume2/Issue1/IJEA-7.pdf
	 */
	function Brent_method(equation, x0, x1, y, options) {
		// default error, accuracy, stopping tolerance, 容许误差
		// @see Number.EPSILON
		var error = 0;
		if (!options)
			options = Object.create(null);
		else if (typeof options === 'number' && options > 0)
			error = options;
		else if (options.error > 0)
			error = Math.abs(options.error);

		y = +y || 0;

		var count = (options.count || 40) | 0,
		// assert: y0 = equation(x0)
		y0 = 'y0' in options ? options.y0 : equation(x0),
		// assert: y1 = equation(x1)
		y1 = 'y1' in options ? options.y1 : equation(x1);

		if (typeof options.start_OK === 'function'
		// 初始测试: Invalid initial value, 不合理的初始值，因此毋须继续。
		&& !options.start_OK(y0, y1))
			return;

		if (y0 === y)
			return x0;
		if (y1 === y)
			return x1;
		if (!((y0 - y) * (y1 - y) < 0))
			// the root is not bracketed.
			// 但亦有可能只是所取范围过大，若中间多挑几点，或许能找到合适的值。
			// 回退至使用 Sidi's generalized secant method。
			return Sidi_method(equation, x0, x1, y, options);

		// copy from double zero () @
		// http://people.sc.fsu.edu/~jburkardt/cpp_src/brent/brent.cpp
		// rewrite when I have time...

		var a = x0, b = x1, c, d, e, sa, sb, sc, fa, fb, fc, m, tol, p, q, r, s;

		//
		// Make local copies of A and B.
		//
		c = sa = a;
		fc = fa = y0 - y;
		sb = b;
		fb = y1 - y;

		d = e = b - a;

		while (true) {
			if (Math.abs(fc) < Math.abs(fb)) {
				sa = sb, sb = c, c = sa;
				fa = fb, fb = fc, fc = fa;
			}

			// tol = 2 * Number.EPSILON * Math.abs(sb) + error;
			tol = 0;
			if (sa === sb || Math.abs(m = (c - sb) / 2) <= tol || fb === 0) {
				break;
			}

			if (Math.abs(e) < tol || Math.abs(fa) <= Math.abs(fb)) {
				d = e = m;
			} else {
				s = fb / fa;

				if (sa === c) {
					p = 2 * m * s;
					q = 1 - s;
				} else {
					q = fa / fc;
					r = fb / fc;
					p = s * (2 * m * q * (q - r) - (sb - sa) * (r - 1));
					q = (q - 1) * (r - 1) * (s - 1);
				}

				if (0 < p) {
					q = -q;
				} else {
					p = -p;
				}

				s = e;
				e = d;

				if (2 * p < 3 * m * q - Math.abs(tol * q)
						&& p < Math.abs(0.5 * s * q)) {
					d = p / q;
				} else {
					d = e = m;
				}
			}
			sa = sb;
			fa = fb;

			if (tol < Math.abs(d)) {
				sb = sb + d;
			} else if (0 < m) {
				sb = sb + tol;
			} else {
				sb = sb - tol;
			}

			fb = equation(sb) - y;

			if ((0 < fb && 0 < fc) || (fb <= 0 && fc <= 0)) {
				c = sa;
				fc = fa;
				d = e = sb - sa;
			}
		}

		return sb;
	}

	_.Brent_method = Brent_method;

	_.find_root = Brent_method;

	/**
	 * 不用微分求取局部极小值 get local minimum using Brent's golden section search
	 * 
	 * 注意: 不同的输入，即使对同一极值，亦可能会得出不同的输出值。
	 * 
	 * @param {Function}equation
	 *            演算式, mapping function
	 * @param {Number}min
	 *            求值之自变数 variable 下限，设定初始近似值。
	 * @param {Number}max
	 *            maximum. 求值之自变数 variable 上限，设定初始近似值。
	 * @param {Object}[options]
	 *            附加参数/设定特殊功能与选项
	 * 
	 * @returns {Number}[x,fx]: equation(x)≈fx≈minimum
	 * 
	 * @see https://en.wikipedia.org/wiki/Maxima_and_minima
	 *      https://en.wikipedia.org/wiki/Golden_section_search
	 *      https://zh.wikipedia.org/wiki/%E6%9E%81%E5%80%BC#.E6.B1.82.E6.9E.81.E5.80.BC.E7.9A.84.E6.96.B9.E6.B3.95
	 *      https://zh.wikipedia.org/wiki/%E5%8F%98%E5%88%86%E6%B3%95
	 *      http://maths-people.anu.edu.au/~brent/pub/pub011.html
	 *      http://math.stackexchange.com/questions/58787/looking-for-numerical-methods-for-finding-local-maxima-and-minima-of-a-function
	 */
	function Brent_minima(equation, min, max, options) {
		// default error, accuracy, stopping tolerance, 容许误差
		// @see Number.EPSILON
		var error = 0;
		if (!options)
			options = Object.create(null);
		else if (options > 0)
			error = options;
		else if (options.error > 0)
			error = Math.abs(options.error);

		var count = (options.count || 40) | 0, data, data_u;

		// copy from std::pair<T, T> brent_find_minima @
		// http://www.boost.org/doc/libs/1_58_0/boost/math/tools/minima.hpp
		// rewrite when I have time...

		var tolerance = error,
		// minima so far
		x,
		// second best point
		w,
		// previous value of w
		v,
		// most recent evaluation point
		u,
		// The distance moved in the last step
		delta,
		// The distance moved in the step before last
		delta2,
		// function evaluations at u, v, w, x
		fu, fv, fw, fx,
		// midpoint of ((min)) and ((max))
		mid,
		// minimal relative movement in x
		fract1, fract2,
		// golden ratio, don't need too much precision here!
		golden = 0.3819660;

		x = w = v = max;
		fx = equation(x);
		if (Array.isArray(fx))
			data = fx[1], fx = fx[0];
		fw = fv = fx;
		delta2 = delta = 0;

		do {
			// get midpoint
			mid = (min + max) / 2;
			// work out if we're done already:
			fract1 = tolerance * Math.abs(x) + tolerance / 4;
			fract2 = 2 * fract1;
			if (Math.abs(x - mid) <= (fract2 - (max - min) / 2))
				break;

			if (Math.abs(delta2) > fract1) {
				// try and construct a parabolic fit:
				var r = (x - w) * (fx - fv), q = (x - v) * (fx - fw), p = (x - v)
						* q - (x - w) * r;
				q = 2 * (q - r);
				if (q > 0)
					p = -p;
				q = Math.abs(q);
				var td = delta2;
				delta2 = delta;
				// determine whether a parabolic step is acceptible or not:
				if ((Math.abs(p) >= Math.abs(q * td / 2))
						|| (p <= q * (min - x)) || (p >= q * (max - x))) {
					// nope, try golden section instead
					delta2 = (x >= mid) ? min - x : max - x;
					delta = golden * delta2;
				} else {
					// whew, parabolic fit:
					delta = p / q;
					u = x + delta;
					if (((u - min) < fract2) || ((max - u) < fract2))
						delta = (mid - x) < 0 ? -Math.abs(fract1) : Math
								.abs(fract1);
				}
			} else {
				// golden section:
				delta2 = (x >= mid) ? min - x : max - x;
				delta = golden * delta2;
			}
			// update current position:
			u = (Math.abs(delta) >= fract1) ? (x + delta)
					: (delta > 0 ? (x + Math.abs(fract1)) : (x - Math
							.abs(fract1)));
			fu = equation(u);
			if (Array.isArray(fu))
				data_u = fu[1], fu = fu[0];
			if (fu <= fx) {
				// good new point is an improvement!
				// update brackets:
				if (u >= x)
					min = x;
				else
					max = x;
				if (x === u)
					// 无改变。
					break;
				// update control points:
				v = w, w = x, x = u;
				fv = fw, fw = fx, fx = fu;
				data = data_u;
			} else {
				// Oh dear, point u is worse than what we have already,
				// even so it *must* be better than one of our endpoints:
				if (u < x)
					min = u;
				else
					max = u;
				if ((fu <= fw) || (w == x)) {
					// however it is at least second best:
					v = w, w = u;
					fv = fw, fw = fu;
				} else if ((fu <= fv) || (v == x) || (v == w)) {
					// third best:
					v = u;
					fv = fu;
				}
			}

		} while (--count);

		(x = new Number(x)).y = fx;
		if (data !== undefined)
			if (library_namespace.is_Object(data))
				Object.assign(x, data);
			else
				x.data = data;
		return x;
	}

	_.Brent_minima = Brent_minima;

	// 不用微分求取求取局部极小值 get local minimum
	_.find_minima = Brent_minima;
	_.find_maxima = function(equation, min, max, options) {
		return Brent_minima(function(x) {
			return -equation(x);
		}, min, max, options);
	};
	// 不用微分求取局部极值 get local maximum and minimum
	// _.find_extremum = Brent_minima;

	// ------------------------------------------------------------------------------------------------------//

	// 组合数学反向思考: 有重复的=全-没有重复的
	// 解法之所以错误往往是因为重复计数。

	// 装载问题
	// http://codex.wiki/post/117994-555

	// 正整数拆分/数字拆解演算法：将数字拆分成最大元素不大于 max 的组合
	// http://www.nowamagic.net/algorithm/algorithm_IntegerDivisionDynamicProgramming.php
	// https://openhome.cc/Gossip/AlgorithmGossip/SeparateNumber.htm
	// https://en.wikipedia.org/wiki/Knapsack_problem

	/**
	 * Get the count of integer partitions. 整数分拆: 将正整数 sum 拆分，表达成一些正整数的和。
	 * 
	 * TODO: part
	 * 
	 * @param {Natural}sum
	 *            integer to be apart.
	 * @param {Natural|Array}[part_count]
	 *            TODO: 给出恰好划分成 part_count 个整数的划分。
	 * @param {Array}[summands]
	 *            给出只包括 summands 的划分。
	 * @param {Array}cache
	 *            cache[sum][summands] = count
	 * 
	 * @returns {Natural}组合方法数
	 * 
	 * @see 贪心算法,贪心法 https://en.wikipedia.org/wiki/Greedy_algorithm
	 * 
	 * @inner
	 */
	function count_partitions(sum, part_count, summands, cache) {
		var key = summands.join(''), _c = cache[sum];
		// https://en.wikipedia.org/wiki/Memoization
		if (!_c)
			_c = cache[sum] = [];
		else if (key in _c)
			return _c[key];

		library_namespace.debug([ sum, summands ], 3);
		// 不更动 summands
		summands = summands.slice();
		var summand = summands.pop(), count = sum / summand | 0;
		sum %= summand;
		if (summands.length === 0) {
			// 检查当前解是否是可行解。
			// 若有余数，表示此法不通。
			// e.g., 以2元分3元
			return sum === 0 ? 1 : 0;
		}

		var counter = 0;
		for (; count >= 0; count--, sum += summand) {
			library_namespace.debug(summand + '⋅' + count + '+' + sum + '; '
					+ counter + '; ' + summands, 3);
			if (sum === 0) {
				// e.g., 以 5元分100元，当count===20时，此时也算一次。
				counter++;
			} else {
				counter += count_partitions(sum, part_count, summands, cache);
			}
		}
		return _c[key] = counter;
	}

	/**
	 * Get the count of integer partitions. 整数分拆: 将正整数 sum 拆分，表达成一些正整数的和。
	 * 兑换/分桶/分配问题
	 * 
	 * TODO: part, count of summands, options
	 * 
	 * TODO: 部分应该有 O(1) 的方法。 see
	 * http://www.mobile01.com/topicdetail.php?f=37&t=2195318&p=3
	 * 
	 * @param {Natural}sum
	 *            integer to be apart.
	 * @param {Natural|Array}[part_count]
	 *            TODO: 给出恰好划分成 part_count 个整数的划分。
	 * @param {Array}[summands]
	 *            给出只包括 summands 的划分。
	 * 
	 * @returns {Natural}组合方法数
	 * 
	 * @see https://en.wikipedia.org/wiki/Partition_%28number_theory%29
	 *      组合数学/总价值固定之钱币排列组合方法数<br />
	 *      http://www.cnblogs.com/python27/p/3303721.html
	 *      http://mathworld.wolfram.com/Partition.html
	 *      http://mathworld.wolfram.com/PartitionFunctionP.html
	 *      http://www.zhihu.com/question/21075235
	 *      http://blog.csdn.net/iheng_scau/article/details/8170669
	 */
	function integer_partitions(sum, part_count, summands) {
		// assert: sum≥0
		if (!sum)
			return 0;

		if (!summands || !summands.length) {
			if (part_count)
				throw 'integer_partitions: NYI';

			if (sum < 0)
				// p(n) = 0 for n negative.
				return 0;
			// the partition function p(n)
			// https://en.wikipedia.org/wiki/Partition_%28number_theory%29#Partitions_in_a_rectangle_and_Gaussian_binomial_coefficients
			var count = _.number_array(sum + 1);
			// p(0) = 1
			count[0] = 1;
			for (var i = 1; i <= sum; i++)
				for (var j = i; j <= sum; j++)
					count[j] += count[j - i];
			library_namespace.debug(count, 3);
			return count[sum];
		}

		// 检查是否有解。
		if (sum % GCD.apply(null, summands) !== 0)
			return;
		summands = summands.slice().sort(library_namespace.ascending);

		return count_partitions(sum, part_count, summands, []);
	}

	_.integer_partitions = integer_partitions;

	// ------------------------------------------------------------------------------------------------------//

	_// JSDT:_module_
	.
	/**
	 * VBScript has a Hex() function but JScript does not.
	 * 
	 * @param {Number}number
	 *            number
	 * 
	 * @return {String} number in hex
	 * 
	 * @example alert('0x'+CeL.hex(16725))
	 */
	hex = function(number) {
		return ((number = Number(number)) < 0 ? number + 0x100000000 : number)
				.toString(16);
	};

	_// JSDT:_module_
	.
	/**
	 * 补数计算。 正数的补数即为自身。若要求得互补之后的数字，请设成负数。
	 * 
	 * @param {Number}number
	 *            number
	 * 
	 * @return {Number} base 1: 1's Complement, 2: 2's Complement, (TODO: 3, 4,
	 *         ..)
	 * @example alert(complement())
	 * @see http://www.tomzap.com/notes/DigitalSystemsEngEE316/1sAnd2sComplement.pdf
	 *      https://en.wikipedia.org/wiki/Method_of_complements
	 *      https://en.wikipedia.org/wiki/Signed_number_representations
	 * @since 2010/3/12 23:47:52
	 */
	complement = function() {
		return this.from.apply(this, arguments);
	};

	_// JSDT:_module_
	.complement.prototype = {

		base : 2,

		// 1,2,..
		bits : 8,

		// radix complement or diminished radix complement.
		// https://en.wikipedia.org/wiki/Method_of_complements
		diminished : 0,

		/**
		 * 正负符号. 正: 0/false, 负 negative value:!=0 / true
		 */
		sign : 0,

		// get the value
		valueOf : function() {
			return this.sign ? -this.value : this.value;
		},

		/**
		 * set value
		 */
		set : function(value) {
			var m = Number(value), a = Math.abs(m);
			if (isNaN(m) || m && a < 1e-8 || a > 1e12) {
				library_namespace.debug('complement.set: error number: '
						+ value);
				return;
			}

			this.sign = m < 0;
			// this.value 仅有正值
			this.value = a;

			return this;
		},

		/**
		 * input
		 */
		from : function(number, base, diminished) {
			// 正规化
			number = ('' + (number || 0)).replace(/\s+$|^[\s0]+/g, '') || '0';
			if (false)
				library_namespace.debug(number + ':' + number.length + ','
						+ this.bits);

			// 整数部分位数
			var value = number.indexOf('.'), tmp;
			// -1: NOT_FOUND
			if (value == -1)
				value = number.length;
			// TODO: not good, need to optimize
			if (value > this.bits)
				// throw 'overflow';
				library_namespace.error('complement.from: overflow: ' + value);

			if (typeof diminished === 'undefined')
				// illegal setup
				diminished = this.diminished;
			else
				this.diminished = diminished;

			if ((base = Math.floor(base)) && base > 0) {
				if (base === 1)
					base = 2, this.diminished = 1;
				this.base = base;
			} else
				// illegal base
				base = this.base;
			if (false)
				library_namespace.debug(base + "'s Complement");

			// TODO: 仅对 integer 有效
			value = parseInt(number, base);
			tmp = Math.pow(base, this.bits - 1);
			if (value >= tmp * base)
				// throw 'overflow';
				library_namespace.error('complement.from: overflow: ' + value);

			// library_namespace.debug('compare ' + value + ',' + tmp);
			if (value < tmp)
				this.sign = 0;
			else {
				library_namespace.debug('负数 '
						+ (tmp * base - (diminished ? 1 : 0)) + '-' + value
						+ '=' + (tmp * base - (diminished ? 1 : 0) - value), 3);
				this.sign = 1;
				value = tmp * base - (diminished ? 1 : 0) - value;
			}

			this.value = value;
			// library_namespace.debug(number + ' → '+this.valueOf());

			return this;
		},

		/**
		 * output
		 */
		to : function(base, diminished) {
			if (!(base = Math.floor(base)) || base < 1)
				base = this.base;
			else if (base === 1)
				base = 2, diminished = 1;
			if (typeof diminished === 'undefined')
				diminished = this.diminished;

			var value = this.value, tmp = Math.pow(base, this.bits - 1);
			if (value > tmp || value === tmp && (diminished || !this.sign))
				// throw 'overflow';
				library_namespace.error('complement.to: overflow: '
						+ (this.sign ? '-' : '+') + value);

			if (this.sign) {
				tmp *= base;
				if (diminished)
					// TODO: 仅对 integer 有效
					tmp--;
				// library_namespace.debug('负数 ' + value + '，summation=' + tmp);
				// 负数，添上两补数之和
				value = tmp - value;
			}

			if (false)
				library_namespace.debug('value: ' + (this.sign ? '-' : '+')
						+ value);

			value = value.toString(Math.max(2, this.base));

			return value;
		}

	};

	_// JSDT:_module_
	.complement.prototype.toString = _.complement.prototype.to;

	/**
	 * haversines
	 * 
	 * @param {Number}θ
	 *            angle (in radians)
	 * 
	 * @returns {Number}haversines(θ)
	 * 
	 * @see https://en.wikipedia.org/wiki/Haversine_formula
	 */
	function hav(θ) {
		return (1 - Math.cos(θ)) / 2;
		// hav(θ) = sin^2(θ/2)
	}

	// ---------------------------------------------------------------------//

	/**
	 * 取差集。<br />
	 * 警告: 若有成员为 {Object}，或许先自行处理会比较有效率。
	 * 
	 * set_1 → set_1 - set_2 <br />
	 * set_2 → set_2 - set_1
	 * 
	 * @param {Array|Object}set_1
	 *            set / hash 1
	 * @param {Array|Object}set_2
	 *            set / hash 2
	 * @param {Boolean}[clone]
	 *            clone === true 表示先 clone，不直接在原物件上写入结果。但若为 {Array}，则*必定*为
	 *            clone!
	 * 
	 * @returns {Array}[ complement of set_1, complement of set_2 ]
	 */
	function get_set_complement(set_1, set_2, clone) {
		if (!set_1 || !set_2 || typeof set_1 !== 'object'
				|| typeof set_2 !== 'object') {
			throw new Error('get_set_complement: Invalid type');
		}

		var hash_1, hash_2;
		// 确保 keys 准备好，并把为 hash 的全部转到 hash_*。
		if (!Array.isArray(set_1)) {
			hash_1 = clone ? Object.clone(set_1) : set_1;
			set_1 = Object.keys(hash_1);
		}
		if (!Array.isArray(set_2)) {
			hash_2 = clone ? Object.clone(set_2) : set_2;
			set_2 = Object.keys(hash_2);
		}

		// assert: set_1, set_2 are {Array}

		// 从比较小的来处理比较快。
		// 若 set_1 比较短，则看 hash_2 是否存在；若没 hash_2 则将key指到比较短的 _2。
		// 依之后的演算法，hash_2 必须存在，又需建造，因此务必为比较短的，因为消耗高。
		// 因此若是另一方已经有 hash，则直接用之。
		var key_is_2 = !(set_1.length > set_2.length ? hash_1 : hash_2);
		library_namespace.debug('key_is_2: ' + key_is_2, 3,
				'get_set_complement');

		if (key_is_2) {
			// swap 1, 2
			var tmp = set_1;
			set_1 = set_2;
			set_2 = tmp;
			tmp = hash_1;
			hash_1 = hash_2;
			hash_2 = tmp;
		}

		var no_hash_2 = !hash_2;
		if (no_hash_2) {
			library_namespace.debug('建造 hash: 依之后的演算法，hash_2 必须存在。', 3,
					'get_set_complement');
			hash_2 = set_2.to_hash();
		}

		var resort_1 = [];

		set_1.forEach(function(item) {
			// assert: item is in _1
			// 处理 set_1 之成员为 {Object} 的情况。
			// 警告:这边需要与 Array.prototype.product() 采用相同的 to string 方法。
			var key = typeof item === 'object' ? JSON.stringify(item) : item;
			if (key in hash_2) {
				library_namespace.debug('key 在 _1 + 在 _2: 在两方都删掉: ' + key, 5,
						'get_set_complement');
				delete hash_2[key];
				if (hash_1) {
					delete hash_1[key];
				}
			} else {
				library_namespace.debug('key 在 _1 不在 _2: 留下 _1 的 key: ' + key,
						5, 'get_set_complement');
				if (!hash_1) {
					resort_1.push(item);
				}
				// _2 本来就没有，不动。
			}
		});

		set_1 = resort_1;
		if (no_hash_2) {
			// 得造出 set_2。

			// 维持 set_2 的顺序，并避免去掉重复。
			var keep_order = true;
			if (keep_order) {
				var resort_2 = [];
				set_2.forEach(function(item) {
					// 处理 set_2 之成员为 {Object} 的情况。
					// 警告:这边需要与前面采用相同的 to string 方法。
					var key = typeof item === 'object' ? JSON.stringify(item)
							: item;
					if (key in hash_2) {
						resort_2.push(item);
					}
				});
				set_2 = resort_2;
			} else {
				// 这会比较快，但实际应用上会造成不确定性：不能确定截掉的是哪一个。
				set_2 = Object.keys(hash_2);
			}

			hash_2 = undefined;
		}

		if (key_is_2) {
			// swap 1, 2
			var tmp = set_1;
			set_1 = set_2;
			set_2 = tmp;
			tmp = hash_1;
			hash_1 = hash_2;
			hash_2 = tmp;
		}

		return [ hash_1 || set_1, hash_2 || set_2 ];
	}

	_.get_set_complement = get_set_complement;

	// ---------------------------------------------------------------------//

	// CeL.math.number_array()
	if (library_namespace.typed_arrays) {
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays
		(_.number_array = function number_array_ArrayBuffer(size, fill, type) {
			if (false) {
				var buffer = new ArrayBuffer(type.BYTES_PER_ELEMENT * size);
			}
			// DataView
			var array = new (type || _.number_array.default_type)(
			// buffer
			size);
			if (fill)
				array.fill(fill);
			return array;
		})
		// should TypedArray. e.g., Int32Array, Uint32Array
		.default_type = Int32Array;
	} else {
		_.number_array = function number_array_Array(size, fill) {
			// 经过 .fill() 以定义每个元素，这样在 .forEach() 时才会遍历到。
			return new Array(size).fill(fill || 0);
		};
	}

	/**
	 * Create digit value table. 建构出位数值表。
	 * 
	 * 对一般问题，所要求的，即是以 greedy algorithm （贪心算法,贪心法）递归搜索，从
	 * digit_table[0–末位数]各选出一位数值，使其总合为0。<br />
	 * 因为各位数值有其特性，因此可能存有些技巧以降低所需处理之数据量。
	 * 
	 * @param {Array}initial_value
	 *            当位数每一位数值应当减去的初始值。
	 * @param {Object}[options]
	 *            附加参数/设定特殊功能与选项
	 * 
	 * @returns {Array}digit value table
	 */
	function digit_table(initial_value, options) {
		var base = options && options.base || DEFAULT_BASE;

		if (typeof initial_value === 'string') {
			if (initial_value === 'factorial') {
				initial_value = factorial.map(base - 1);
			} else {
				var matched = initial_value.match(/power[\s:=]*(\d+)/i);
				if (matched) {
					matched = +matched[1];
					// initial_value[digit] = digit^power
					initial_value = _.number_array(base).map(
							function(id, index) {
								return Math.pow(index, matched);
							});
				}
			}
		}

		// assert: initial_value 之元素皆 {Natural} > 0
		library_namespace.debug(initial_value, 3);

		/**
		 * value of each digit.
		 * 
		 * table[exponent=0–(maximum exponent)][digit=0–9] =<br />
		 * {Number} digit*base^exponent - digit^exponent
		 * 
		 * @type {Array} [][]
		 */
		var table = [],
		/**
		 * accumulated min. 自个位数起累积的最小值。
		 * 
		 * sum_min[exponent=0–(maximum exponent)] =<br />
		 * ∑自0至(exponent-1)位累积的(digit value之最小值)
		 * 
		 * @type {Array}
		 */
		sum_min = [];
		table.min = sum_min;

		// 准备好 digit_value table, min/maximum value。
		for (var exponent = 0,
		/** {Natural}power = base^exponent */
		power = 1;
		// 不需要此项限制，照理来说应该在其之前即已跳出。
		// exponent < base
		; exponent++) {
			/** {Array}value_array[digit=0–9] = {Number}位数值(digit value) */
			var value_array = _.number_array(base),
			/** {Number}本位数各数字位数值的最小值，不包含0 */
			min = Infinity;
			// 计算 (base^exponent) 之位数值(digit value)，并记录最小值。
			for (var digit = 0; digit < base; digit++) {
				var digit_value = value_array[digit] = digit * power
						- initial_value[digit];
				// 因为0不能当数字头，[0] 不设定极值。
				if (digit > 0 && digit_value < min)
					min = digit_value;
			}
			/** {Number}本位数各数字位数值的最小值，包含0 */
			var min_0 = Math.min(min, value_array[0]);
			// console.log(value_array);
			if (exponent > 0) {
				// 记录自个位数起之累积之最小值。
				var last_min = sum_min[exponent - 1];
				min += last_min;
				min_0 += last_min;
			}
			if (min > 0)
				// 对 n 位数，数值范围为 base^(n-1)–base^n-1。但位数值和若已经过大，
				// 代表此位数以上，如第 (n+1) 位数，就算每个位数值和都取最小值，总和也不可能为0。
				break;
			sum_min.push(min_0);
			table.push(value_array);
			power *= base;
		}

		if (!options || !options.find)
			return table;

		// ------------------------------------------
		// process: 以 greedy algorithm （贪心算法,贪心法）递归搜索

		/**
		 * calculate sum of digit values
		 */
		function calculate_sum(sum, exponent, digits) {
			// 测试是否应终结。
			if (exponent < 0) {
				// 0,1 为当然结果。
				if (sum === 0 && (digits = +digits) > min)
					result.push(digits);
				return;
			}

			if (sum > 0 && sum + sum_min[exponent] > 0)
				// 接下来的总和也不可能为0。
				return;

			// 递归搜索
			table[exponent--].forEach(function(v, d) {
				calculate_sum(digits || d ? sum + v : sum, exponent,
				// 对于 0 开头者，视做少一位数，同时不计算本位数之 [0]。
				digits || d ? digits + d : digits);
			});
		}

		var result = [],
		/** {Natural}所得值需要大于此值。 */
		min;
		if (options && ('min' in options))
			min = options.min;
		else if (!initial_value.some(function(v, d) {
			if (d && v !== d) {
				min = d;
				return true;
			}
		}))
			min = 0;

		calculate_sum(0, table.length - 1, '');

		library_namespace.debug(result, 2);
		return result;
	}

	_.digit_table = digit_table;

	// ---------------------------------------------------------------------//

	// assert: {ℕ⁰:Natural+0}((this))
	// fast than String(natural).chars(), natural.toString().chars() or
	// natural.toString(base).chars()
	// TODO: 处理小数/负数/大数
	function Number_digits(base) {
		if (!((base |= 0) >= 2))
			base = DEFAULT_BASE;
		var natural = Math.floor(Math.abs(this)), digits = [];
		do {
			digits.unshift(natural % base);
		} while ((natural = Math.floor(natural / base)) > 0);
		return digits;
	}

	// 数字和, 位数和
	// natural.digits(base).sum()
	// https://en.wikipedia.org/wiki/Digit_sum
	// to get digit root: using natural.digit_sum(base) % base
	function Number_digit_sum(base) {
		if (!((base |= 0) >= 2))
			base = DEFAULT_BASE;
		var natural = Math.floor(Math.abs(this)), sum = ABSORBING_ELEMENT;
		do {
			sum += natural % base;
		} while ((natural = Math.floor(natural / base)) > 0);
		return sum;
	}

	// count digits of integer
	// = floor(log_10(base)) + 1
	// TODO: 测试二分搜寻 [base,base^2,base^3,...] 方法之效率。 e.g., [10,100,100,...]
	function Number_digit_length(base) {
		if (!((base |= 0) >= 2))
			base = DEFAULT_BASE;
		return (base === 10 ? Math.log10(this) | 0
		//
		: base === 2 ? Math.log2(this) | 0
		// TODO: base = 2^n
		: Math.log(this) / Math.log(base) | 0) + 1;

		// slow... should use multiply by exponents, or Math.clz32()
		var natural = Math.floor(Math.abs(this)), digits = 0;
		do {
			digits++;
		} while ((natural = Math.floor(natural / base)) > 0);
		return digits;
	}

	// reverse the digits
	// assert: {ℕ⁰:Natural+0}((this))
	// TODO: 处理小数/负数/大数
	function Number_reverse(base) {
		if (!base)
			base = DEFAULT_BASE;
		// ABSORBING_ELEMENT
		var natural = +this, reversed = 0;
		while (natural > 0) {
			reversed = reversed * base + (natural % base);
			natural = Math.floor(natural / base);
		}
		return reversed;
	}

	function Number_is_palindromic(base) {
		return this === this.reverse(base);
	}

	// for palindromic number or numeral palindrome 回文数, 回文数
	// http://articles.leetcode.com/2012/01/palindrome-number.html
	function String_is_palindromic(chars) {
		if (!chars)
			return false;
		for (var index = 0, l_index = chars.length - 1; index < l_index; index++, l_index--)
			if (chars.charAt(index) !== chars.charAt(l_index))
				return false;
		return true;
	}

	function Number_tail(natural, base) {
		// TODO
		;
	}

	// ---------------------------------------------------------------------//

	/**
	 * Test if the array is an arithmetic progression.<br />
	 * 判断 ((this)) 是否为等差数列/连续整数。<br />
	 * O(n)
	 * 
	 * @param {String}type
	 *            'integer': arithmetic integers,<br />
	 *            'consecutive': consecutive integers 连续整数型别, if the array
	 *            contains only consecutive integers / consecutive values;<br />
	 *            'odd': odd consecutive integers,<br />
	 *            'even': even consecutive integers
	 * 
	 * @returns {Boolean}is AP
	 * 
	 * @see https://simple.wikipedia.org/wiki/Consecutive_integer
	 */
	function Array_is_AP(type) {
		var length = this.length;
		if (length <= 1)
			return length === 1;

		var number = this[1],
		/** {Boolean}为奇数或偶数型别。 */
		parity = type === 'odd' || type === 'even';
		if (parity && number % 2 !== (type === 'odd' ? 1 : 0))
			return false;

		var difference = number - this[0];
		if (type && difference !== (parity ? 2 : type === 'consecutive' ? 1
		// 当前只要设定 type，皆为整数型别。
		: Math.floor(difference)))
			return false;

		for (var index = 2; index < length; index++)
			if (this[index] !== (number += difference))
				return false;

		return true;
	}

	/**
	 * <code>

	Sum[m + n ((M - m)/(l - 1)), {n, 0, -1 + l}]
	=
	l(m+M)/2

	Sum[(m + n (M - m)/(l - 1) - b)^2, {n, 0, l - 1}]
	=
	(l (6 b^2 (l-1)-6 b (l-1) (m+M)+(2 l-1) m^2+2 (l-2) m M+(2 l-1) M^2))/(6 (l-1))

	 </code>
	 */

	/**
	 * Test if the array combines an arithmetic progression.<br />
	 * 判断 ((this)) 是否可组成等差数列/连续整数，不计较次序。<br />
	 * O(n)
	 * 
	 * @param {String}type
	 *            'integer': arithmetic integers,<br />
	 *            'consecutive': consecutive integers 连续整数型别, if the array
	 *            contains only consecutive integers / consecutive values;<br />
	 *            'odd': odd consecutive integers,<br />
	 *            'even': even consecutive integers
	 * @param {Integer}MIN
	 *            acceptable minimum
	 * 
	 * @returns {Number}difference or {Boolean}false
	 * 
	 * @see https://simple.wikipedia.org/wiki/Consecutive_integer
	 */
	function Array_combines_AP(type, MIN) {
		var length = this.length;
		if (length <= 1)
			return length === 1;

		var min = Infinity,
		// maximum
		max = -Infinity,
		// ABSORBING_ELEMENT
		sum = 0,
		// 不能仅由 min/max/sum 即定夺是否等差。
		// 但尚未确认如此条件即已充分!!
		square_sum = 0, square_base = this[0],
		/** {Boolean}为奇数或偶数型别。 */
		parity = type === 'odd' || type === 'even';

		if (this.some(function(number) {
			if (number < min) {
				min = number;
				if (min < MIN)
					return true;
			}
			if (max < number)
				max = number;
			if (parity ? max - min > 2 * (length - 1) : type === 'consecutive'
					&& max - min > length - 1)
				return true;
			sum += number;
			number -= square_base;
			square_sum += number * number;
		}))
			return false;

		if (2 * sum !== (max + min) * length)
			return false;

		// check sum of square
		var min_p_max = min + max, min_m_max = min * max;
		if (square_sum !== ((2 * length * (min_p_max * min_p_max - min_m_max)
				- min_p_max * min_p_max - 2 * min_m_max)
				/ (6 * (length - 1)) - square_base * (min_p_max - square_base))
				* length)
			return false;

		if (parity && min % 2 !== (type === 'odd' ? 1 : 0))
			return false;

		var difference = (max - min) / (length - 1);
		if (type && difference !== (parity ? 2 : type === 'consecutive' ? 1
		// 当前只要设定 type，皆为整数型别。
		: Math.floor(difference)))
			return false;

		return difference;
	}

	// ---------------------------------------------------------------------//

	// 检查是否有重复的数字。
	// use CeL.PATTERN_duplicated(string) to test if string contains duplicated
	// chars.
	_.PATTERN_duplicated = /(.).*?\1/;

	// all the same characters
	_.PATTERN_all_same = /^(.)\1*$/;

	// http://en.cppreference.com/w/cpp/algorithm/is_permutation
	function Array_is_permutation(sequence_2) {
		var sequence_1 = this, last = sequence_1.length;
		if (last !== sequence_2.length)
			return false;
		if (sequence_1 === sequence_2)
			return true;
		while (last-- > 0 && sequence_1[last] === sequence_2[last])
			;
		if (last < 0)
			return true;
		last++;
		// assert: sequence_1, sequence_2 有不同。
		var start = 0;
		while (sequence_1[start] === sequence_2[start])
			start++;
		// count elements
		var processed = new Set();
		for (; start < last; start++) {
			var element = sequence_1[start];
			if (processed.has(element))
				// skip element counted
				continue;
			processed.add(element);
			// O(n^2)
			var index = start, difference = sequence_2[index++] === element ? 0
					: 1;
			for (; index < last; index++) {
				if (sequence_1[index] === element)
					difference++;
				if (sequence_2[index] === element)
					difference--;
			}
			if (difference !== 0)
				return false;
		}
		return true;
	}

	// 纯量变数 (scalar variable)
	function String_is_permutation(sequence_2) {
		var sequence_1 = this, last = sequence_1.length;
		if (last !== sequence_2.length)
			return false;
		// 直接比较较快。
		if (sequence_1 === sequence_2)
			return true;
		// processed elements
		var processed = Object.create(null);
		for (var start = 0; start < last; start++) {
			var element = sequence_1.charAt(start);
			if (element in processed)
				// skip element counted
				continue;
			processed[element] = null;
			if (sequence_1.count_of(element, start + 1) + 1
			// O(n^2)
			!== sequence_2.count_of(element)) {
				return false;
			}
		}
		return true;
	}

	/**
	 * 关于寻找相同排列的数字，亦可采用纪录各数字和的方法。<br />
	 * 另外，若数字之数量远小于计算 .is_permutation() 之工作量，则 cache .sort() 反而会快很多。
	 */
	function Number_is_permutation(sequence_2) {
		return this.digit_sum() === (+sequence_2).digit_sum()
		// ↑ 先测试数字和是否相同。
		&& String(this).is_permutation(String(sequence_2));
	}

	// ---------------------------------------------------------------------//

	/**
	 * 按升序/降序排列处理每一序列至最后。<br />
	 * contain exactly the same digits, but in a different order.
	 * 
	 * 注意: 不会先做排序!
	 * 
	 * @param {Function}handler
	 *            处理 function
	 * @param {Boolean}descending
	 *            default: ascending (small→big 升序序列为最小排列，降序序列为最大的排列), or will
	 *            be descending (big→small 降序)
	 * @param {Boolean}inplace
	 *            no clone, do not clone array.
	 * 
	 * @returns {Array}the last array processed
	 */
	function Array_for_permutation(handler, descending, inplace) {
		var array = inplace ? this : this.clone(), last_index = array.length - 1;
		if (last_index >= 0)
			handler(array);
		if (last_index < 1)
			return;

		var index;
		do {
			// 求出下一个按升序排列序列。
			// http://en.cppreference.com/w/cpp/algorithm/next_permutation
			// http://leonard1853.iteye.com/blog/1450085
			// http://www.cplusplus.com/reference/algorithm/next_permutation/
			index = last_index;
			for (var now = array[index], _next; index > 0;) {
				// search [index]=now < [index+1]=_next
				_next = now;
				now = array[--index];
				if (descending ? now > _next : now < _next) {
					var later_index = last_index;
					// search [index]=now < [later_index]=_next
					while (true) {
						_next = array[later_index];
						if (descending ? _next < now : _next > now)
							break;
						later_index--;
					}
					// swap [index]=now, [later_index]=_next
					array[later_index] = now;
					array[index] = _next;
					// reverse elements 元素: [index+1] to [last_index]
					for (index++, later_index = last_index; index < later_index; index++, later_index--) {
						_next = array[index];
						array[index] = array[later_index];
						array[later_index] = _next;
					}
					if (handler(array))
						index = 0;
					break;
				}
			}
		} while (index > 0);
		return array;
	}

	function String_for_permutation(handler, descending, sort) {
		if (this.length < 2) {
			handler(this);
			return;
		}
		var array = this.split('');
		if (sort)
			typeof sort === 'function' ? array.sort(sort) : array.sort();
		return array.for_permutation(function(array) {
			return handler(array.join(''));
		}, descending, true);
	}

	function Number_for_permutation(handler, descending, sort, base) {
		if (!base)
			base = 10;
		if (this < base) {
			handler(this);
			return;
		}
		var array = this.digits();
		if (sort) {
			if (typeof sort === 'function')
				array.sort(sort);
			else
				array.sort();
		}
		return +array.for_permutation(function(array) {
			return handler(+array.join(''));
		}, descending, true).join('');
	}

	// ---------------------------------------------------------------------//
	// combinatorics 组合数学

	/**
	 * <code>

	[1,2,4,8,16,32].for_combination(3,function(s){console.log(s);})
	CeL.for_combination(6,3,function(s){console.log(s);})
	TODO:
	CeL.for_combination(6,3,function(s){console.log(s);},true)

	</code>
	 */

	// 自 elements 中提取出 select 个元素的组合方法。
	// 共 C(elements, select) = elements! / select! / (elements-select)! 种组合数量。
	// next_combination
	// select ((select)) elements, ((select))-selection
	function for_combination(elements, select, handler, descending) {
		if (!((select |= 0) > 0))
			// nothing select
			return;

		var map;
		if (Array.isArray(elements)) {
			// elements as map array
			map = elements;
			elements = map.length;
		}

		var index = 0,
		/** {Array}index array */
		selected = [];

		// initialization
		for (; index < select; index++)
			selected.push(index);

		while (true) {
			// TODO: descending
			handler(map ? selected.map(function(index) {
				return descending ? map[elements - index] : map[index];
			}) : descending ? selected.map(function(index) {
				return elements - index - 1;
			}).reverse() : selected);

			index = 1;
			for (; index < select
					&& selected[index] === selected[index - 1] + 1; index++)
				;
			if (++selected[--index] === elements)
				break;
			--index;
			if (selected[index] !== index)
				for (; index >= 0; index--)
					selected[index] = index;
		}
	}

	_.for_combination = for_combination;

	function Array_for_combination(select, handler, descending, inplace) {
		return for_combination(inplace ? this : this.clone(), select, handler,
				descending);
	}

	// ---------------------------------------------------------------------//
	// export 导出.

	_.MULTIPLICATIVE_IDENTITY = MULTIPLICATIVE_IDENTITY;
	_.ZERO_EXPONENT = ZERO_EXPONENT;
	_.ABSORBING_ELEMENT = ABSORBING_ELEMENT;
	_.MULTIPLICATION_SIGN = MULTIPLICATION_SIGN;

	library_namespace.set_method(String.prototype, {
		is_palindromic : set_bind(String_is_palindromic),

		is_permutation : String_is_permutation,
		for_permutation : String_for_permutation
	});

	library_namespace.set_method(String, {
		is_palindromic : String_is_palindromic
	});

	library_namespace.set_method(Number.prototype, {
		// division, divided_by
		divided : set_bind(division_with_remainder, true),
		floor_sqrt : set_bind(floor_sqrt),
		ceil_log : set_bind(ceil_log),

		digits : Number_digits,
		digit_sum : Number_digit_sum,
		digit_length : Number_digit_length,
		reverse : Number_reverse,
		is_palindromic : Number_is_palindromic,

		is_permutation : Number_is_permutation,
		for_permutation : Number_for_permutation
	});

	library_namespace.set_method(Array.prototype, {
		to_int_or_bigint : array_to_int_or_bigint,
		is_AP : Array_is_AP,
		combines_AP : Array_combines_AP,
		is_permutation : Array_is_permutation,
		for_permutation : Array_for_permutation,
		for_combination : Array_for_combination
	});

	library_namespace.set_method(Math, {
		hav : hav
	});

	return (_// JSDT:_module_
	);
}
