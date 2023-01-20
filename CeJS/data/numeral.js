/**
 * @name CeL function for numeral systems
 * @fileoverview 本档案包含了记数系统用的 functions。
 * 
 * @since
 * 
 * @see <a href="https://en.wikipedia.org/wiki/List_of_numeral_systems"
 *      accessdate="2015/4/30 21:50">List of numeral systems</a>
 */

'use strict';

if (false) {
	CeL.run('data.numeral', function() {
		CeL.to_Chinese_numeral(1000);
	});
}

// --------------------------------------------------------------------------------------------

// 不采用 if 陈述式，可以避免 Eclipse JSDoc 与 format 多缩排一层。
typeof CeL === 'function' && CeL.run({
	// module name
	name : 'data.numeral',
	// data.native: .chars()
	require : 'data.code.compatibility.|data.native.',

	// 为了方便格式化程式码，因此将 module 函式主体另外抽出。
	code : module_code
});

function module_code(library_namespace) {
	var
	/** {Number}未发现之index。 const: 基本上与程式码设计合一，仅表示名义，不可更改。(=== -1) */
	NOT_FOUND = ''.indexOf('_');
	// nothing required

	/**
	 * null module constructor
	 * 
	 * @class 处理记数系统的 functions
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

	// -----------------------------------------------------------------------------------------------------------------
	// 中文数字 (Chinese numerals)

	function to_search_pattern(keys) {
		var key, chars = [], long_keys = [];
		function add(key) {
			if (key)
				if (key.length === 1)
					chars.push(key);
				else
					long_keys.push(key);
		}

		if (Array.isArray(keys))
			keys.forEach(add);
		else
			for (key in keys)
				add(key);

		chars = chars.length > 0 ? '[' + chars.join('') + ']' : '';
		if (long_keys.length > 0 && chars)
			long_keys.push(chars);

		// /(?:long_keys|long_keys|[chars])/g
		// /[chars]/g
		return new RegExp(long_keys.length > 0 ? '(?:' + long_keys.join('|')
				+ ')' : chars, 'g');
	}

	var
	// 小写数字
	Chinese_numerals_Normal_digits = '〇一二三四五六七八九',
	//
	Chinese_numerals_Normal_digits_Array
	//
	= Chinese_numerals_Normal_digits.split(''),
	//
	Chinese_numerals_Normal_digits_pattern
	//
	= to_search_pattern(Chinese_numerals_Normal_digits_Array),
	//
	numerals_Normal_pattern = new RegExp('('
	//
	+ Chinese_numerals_Normal_digits_pattern.source + '|\\d+)', 'g'),
	// 筹算: 步十百千万
	amount_pattern = new RegExp(numerals_Normal_pattern.source + '?([十百千])',
			'g'),

	// 正式大写数字
	Chinese_numerals_Formal_digits = '零壹贰参肆伍陆柒捌玖',
	//
	Chinese_numerals_Formal_digits_Array
	//
	= Chinese_numerals_Formal_digits.split(''),
	//
	Chinese_numerals_Formal_digits_pattern
	//
	= to_search_pattern(Chinese_numerals_Formal_digits_Array),

	// http://thdl.ntu.edu.tw/suzhou/
	// 苏州码子又称花码、番仔码、草码、菁仔码
	Suzhou_numerals_digits = '〇〡〢〣〤〥〦〧〨〩',
	// Counting Rod Numerals As of Unicode version 8.0
	Counting_rod_numerals_digits
	// https://en.wikipedia.org/wiki/Counting_Rod_Numerals
	= '𝍠𝍡𝍢𝍣𝍤𝍥𝍦𝍧𝍨𝍩𝍪𝍫𝍬𝍭𝍮𝍯𝍰𝍱',
	// 全形阿拉伯数字 U+FF10~U+FF19 FULLWIDTH DIGIT
	FULLWIDTH_DIGITS = '０１２３４５６７８９',
	//
	positional_Chinese_numerals_digits
	//
	= Chinese_numerals_Normal_digits
	//
	+ Chinese_numerals_Formal_digits
	//
	+ Suzhou_numerals_digits.slice(1) + FULLWIDTH_DIGITS,
	//
	positional_Chinese_numerals_digits_pattern
	//
	= new RegExp('[' + positional_Chinese_numerals_digits + ']', 'g'),
	//
	only_positional_Chinese_numerals_digits_pattern
	//
	= new RegExp('^[' + positional_Chinese_numerals_digits + ']+$'),

	// 旧时/非正式/通用数字 正规化
	numeral_convert_pair = {
		// o : '〇',
		Ｏ : '〇',
		'○' : '〇',
		弌 : '壹',
		弍 : '贰',
		两 : '二',
		叁 : '参',
		叁 : '参',
		弎 : '参',
		亖 : '四',
		// Firefox/3.0.19 无法 parse '䦉': 错误: invalid property id
		'䦉' : '肆',

		// [[ja:大字 (数字)]]
		壱 : '壹',
		弐 : '贰',
		貮 : '贰',
		参 : '参',
		陆 : '陆',
		// 去除常用字以防 false positive
		// 漆 : '柒',
		// 俗亦以「什」代拾，然易窜为「仟」。
		// 什 : '拾',

		// 念圆 : '贰拾圆',
		// 念 : '贰拾',
		廿 : '二十',
		卄 : '二十',
		卅 : '三十',
		// http://www.bsm.org.cn/show_article.php?id=1888
		// "丗五年" = "卅五年"
		丗 : '三十',
		// e.g., 卌又三年
		卌 : '四十',
		// 罕作「圩」
		// 圩 : '五十',
		皕 : '二百',
		// 古亦作「陌」。
		陌 : '佰',
		// 古亦作「阡」。
		阡 : '仟',
		万 : '万',
		万万 : '亿',
		// 太常使用。
		// 经 : '京',
		杼 : '秭',
		壤 : '穰',

		厘 : '厘'
	// 太常使用。
	// 毛 : '毫'
	},
	//
	numeral_convert_pattern,

	// denomination, 万进系统单位
	// http://zh.wikipedia.org/wiki/%E4%B8%AD%E6%96%87%E6%95%B0%E5%AD%97
	// http://zh.wikipedia.org/wiki/%E5%8D%81%E8%BF%9B%E5%88%B6
	// http://zh.wikipedia.org/wiki/%E4%B8%AD%E6%96%87%E6%95%B0%E5%AD%97
	// http://lists.w3.org/Archives/Public/www-style/2003Apr/0063.html
	// http://forum.moztw.org/viewtopic.php?t=3043
	// http://www.moroo.com/uzokusou/misc/suumei/suumei.html
	// http://espero.51.net/qishng/zhao.htm
	// http://www.nchu.edu.tw/~material/nano/newsbook1.htm
	// http://www.moroo.com/uzokusou/misc/suumei/suumei1.html
	// 十亿（吉）,兆（万亿）,千兆（拍）,百京（艾）,十垓（泽）,秭（尧）,秭:禾予;沟(土旁);,无量大数→,无量,大数;[载]之后的[极]有的用[报]
	// 异体：阿僧[禾氏],For Korean:阿僧祗;秭:禾予,抒,杼,For Korean:枾 For
	// Korean:不可思议(不:U+4E0D→U+F967)
	// Espana应该是梵文所译
	// 因为根据「大方广佛华严经卷第四十五卷」中在「无量」这个数位以后还有无边、无等、不可数、不可称、不可思、不可量、不可说、不可说不可说，Espana应该是指上面其中一个..因为如果你有心查查Espana其实应该是解作西班牙文的「西班牙」
	Chinese_numerals_Denominations
	// ',万,亿,兆,京,垓,秭,穰,沟,涧,正,载,极,恒河沙,阿僧祇,那由他,不可思议,无量大数'
	= ',万,亿,兆,京,垓,秭,穰,沟,涧,正,载,极',
	//
	Chinese_numerals_Denominations_Array
	//
	= Chinese_numerals_Denominations.split(','),
	//
	Chinese_numerals_Denominations_pattern
	//
	= to_search_pattern(Chinese_numerals_Denominations_Array),
	//
	Chinese_numerals_token_pattern
	//
	= new RegExp('(.*?)('
	//
	+ Chinese_numerals_Denominations_pattern.source + ')', 'g'),

	// TODO:
	// http://zh.wikipedia.org/wiki/%E5%8D%81%E9%80%80%E4%BD%8D
	// 比漠微细的，是自天竺的佛经上的数字。而这些「佛经数字」已成为「古代用法」了。
	// 小数单位(十退位)：分,厘(厘),毫(毛),丝(秒),忽,微,纤,沙,尘（纳）,埃,渺,漠(皮),模糊,逡巡,须臾（飞）,瞬息,弹指,刹那（阿）,六德(德),虚,空,清,净
	// or:,虚,空,清,净→,空虚,清净（仄）,阿赖耶,阿摩罗,涅槃寂静（攸）
	// 六厘英金庚款公债条例: 年息定为?厘, 年利率?厘
	Chinese_numerals_Decimal_denominations = '分厘毫丝忽微纤沙尘埃渺漠',
	//
	numerals_Decimal_token_pattern
	//
	= new RegExp(numerals_Normal_pattern.source
	//
	+ '([' + Chinese_numerals_Decimal_denominations + '])', 'g'),

	// 下数系统单位
	Chinese_numerals_Normal_base_denomination
	// 筹算: 步十百千万
	= (',十,百,千' + Chinese_numerals_Denominations).split(','),
	//
	Chinese_numerals_Formal_base_denomination
	//
	= (',拾,佰,仟' + Chinese_numerals_Denominations).split(','),
	//
	Chinese_numerals_Normal_pattern = new RegExp('(?:负?(?:['
			+ Chinese_numerals_Normal_digits + '\\d ]['
			+ Chinese_numerals_Normal_base_denomination.join('') + ']*|['
			+ Chinese_numerals_Normal_base_denomination.join('')
			+ ']+)+(又|分之)?)+', 'g'),
	//
	Chinese_numerals_Normal_Full_matched = new RegExp('^(?:负?['
			+ Chinese_numerals_Normal_digits + '\\d '
			+ Chinese_numerals_Normal_base_denomination.join('') + '又]+|分之)+$'),
	//
	numeral_value = Object.create(null);

	_.Chinese_numerals_Normal_digits = Chinese_numerals_Normal_digits;
	_.Chinese_numerals_Formal_digits = Chinese_numerals_Formal_digits;
	_.Chinese_numerals_Denominations
	//
	= Chinese_numerals_Denominations_Array.join('');

	(function() {
		var base, scale = 0;
		Chinese_numerals_Normal_digits_Array
		//
		.forEach(function(digits) {
			numeral_value[digits] = scale;
			scale++;
		});

		base = scale;
		'十,百,千'.split(',')
		// 筹算: 步十百千万
		.forEach(function(denomination) {
			numeral_value[denomination] = scale;
			scale *= base;
		});

		base = scale;
		Chinese_numerals_Denominations_Array
		//
		.forEach(function(denomination) {
			if (denomination) {
				numeral_value[denomination] = scale;
				scale *= base;
			}
		});

		scale = .1;
		Chinese_numerals_Decimal_denominations.split('')
		//
		.forEach(function(denomination) {
			if (denomination) {
				numeral_value[denomination] = scale;
				scale /= 10;
			}
		});

		for (scale = 1;
		//
		scale < Suzhou_numerals_digits.length; scale++) {
			base = Suzhou_numerals_digits.charAt(scale);
			numeral_value[base] = scale;
			numeral_convert_pair[base]
			//
			= Chinese_numerals_Normal_digits[scale];
		}

		for (scale = 0;
		//
		scale < FULLWIDTH_DIGITS.length; scale++) {
			base = FULLWIDTH_DIGITS.charAt(scale);
			numeral_value[base] = scale;
			numeral_convert_pair[base]
			//
			= Chinese_numerals_Normal_digits[scale];
		}

		numeral_convert_pattern
		//
		= to_search_pattern(numeral_convert_pair);
	})();

	// 对所有非正规之数字。
	// TODO (bug): 十廿, 二廿
	function normalize_Chinese_numeral(number_String) {
		return number_String
		// .replace(/\s+/g, '')
		//
		.replace(numeral_convert_pattern, function($0) {
			return numeral_convert_pair[$0];
		});
	}

	_.normalize_Chinese_numeral = normalize_Chinese_numeral;

	function Chinese_numerals_Formal_to_Normal(number_String) {
		return number_String.replace(Chinese_numerals_Formal_digits_pattern,
				function($0) {
					return Chinese_numerals_Normal_digits
					//
					.charAt(Chinese_numerals_Formal_digits.indexOf($0));
				})
		//
		.replace(/[拾佰仟]/g, function(denomination) {
			return '十百千'.charAt('拾佰仟'.indexOf(denomination));
		});
	}

	_.Chinese_numerals_Formal_to_Normal
	//
	= Chinese_numerals_Formal_to_Normal;

	function Chinese_numerals_Normal_to_Formal(number_String) {
		return number_String.replace(Chinese_numerals_Normal_digits_pattern,
				function($0) {
					return Chinese_numerals_Formal_digits
					//
					.charAt(Chinese_numerals_Normal_digits.indexOf($0));
				})
		//
		.replace(/[十百千]/g, function($0) {
			return '拾佰仟'.charAt('十百千'.indexOf($0));
		});

	}

	_.Chinese_numerals_Normal_to_Formal
	//
	= Chinese_numerals_Normal_to_Formal;

	/**
	 * 将汉字中文数字转换为半形阿拉伯数字表示法(小数系统 0-99999)
	 * 
	 * @deprecated use from_Chinese_numeral.
	 */
	function deprecated_from_Chinese_numeral(number_String) {
		if (!number_String || !isNaN(number_String))
			return number_String;

		number_String = Chinese_numerals_Formal_to_Normal(
		//
		normalize_Chinese_numeral('' + number_String));

		var i = 0, l, m,
		//
		n = Chinese_numerals_Normal_digits_Array,
		// 筹算: 万千百十步
		d = '万千百十'.split(''), r = 0,
		/**
		 * @see <a
		 *      href="http://zh.wikipedia.org/wiki/%E6%97%A5%E8%AA%9E%E6%95%B8%E5%AD%97"
		 *      accessdate="2012/9/10 21:0">日语数字</a>
		 */
		p = ('' + number_String).replace(/\s/g, '')
		//
		.replace(/[Ｏ○]/g, '〇');
		for (; i < n.length; i++)
			n[n[i]] = i;
		for (i = 0; i < d.length; i++) {
			if (p && NOT_FOUND !==
			//
			(m = d[i] ? p.indexOf(d[i]) : p.length))
				if (!m && d[i] === '十')
					r += 1, p = p.slice(1);
				else if (isNaN(l = n[
				//
				p.slice(0, m).replace(/^〇+/, '')]))
					return number_String;
				else
					r += l, p = p.slice(m + 1);
			if (d[i])
				r *= 10;
		}

		return r;
	}

	// More examples: see /_test suite/test.js

	function from_positional_Chinese_numeral(number_String) {
		return isNaN(number_String = number_String.replace(
				positional_Chinese_numerals_digits_pattern, function(digit) {
					return numeral_value[digit];
				})) ? number_String : +number_String;
	}

	function to_positional_Chinese_numeral(number_String, formal) {
		formal = formal ? Chinese_numerals_Formal_digits_Array
		//
		: Chinese_numerals_Normal_digits_Array;
		return ('' + number_String)
		//
		.replace(/\d/g, function(digit) {
			return formal[digit];
		});
	}

	_.positional_Chinese_numerals_digits
	//
	= positional_Chinese_numerals_digits;
	_.from_positional_Chinese_numeral
	//
	= from_positional_Chinese_numeral;
	_.to_positional_Chinese_numeral
	//
	= to_positional_Chinese_numeral;

	// 将汉字中文数字转换为半形阿拉伯数字表示法。(正常情况下:小数系统 0-9999)
	function from_Chinese_numeral_token(amount) {
		if (!isNaN(amount))
			return +amount;

		// reset
		amount_pattern.lastIndex = 0;

		var token_sum = 0, matched, lastIndex = 0;
		while (matched = amount_pattern.exec(amount)) {
			lastIndex = amount_pattern.lastIndex;
			// [ , digit, denomination ]
			// for "一千零十一" 等。
			token_sum += (matched[1]
			//
			&& matched[1] !== '〇' ? numeral_value[matched[1]] : 1)
			//
			* numeral_value[matched[2]];
		}

		// lastIndex 后面的全部放弃。
		amount = amount.slice(lastIndex).replace(/^〇+/, '');
		numerals_Normal_pattern.lastIndex = 0;

		matched = numerals_Normal_pattern.exec(amount);
		if (matched)
			token_sum += isNaN(matched = matched[0])
			//
			? numeral_value[matched] : +matched;

		return token_sum || 0;
	}

	/**
	 * 将汉字中文数字转换为阿拉伯数字表示法。<br />
	 * 注意：本函数不会检查 number_String 之正规与否！
	 */
	function from_Chinese_numeral(number_String) {
		if (!number_String || !isNaN(number_String))
			return number_String;

		number_String = Chinese_numerals_Formal_to_Normal(
		//
		normalize_Chinese_numeral('' + number_String));
		// console.log(Chinese_numerals_Normal_pattern);
		// console.log(JSON.stringify(number_String));

		if (!Chinese_numerals_Normal_Full_matched.test(number_String)) {
			// 部分符合，仅针对符合部分处理。
			Chinese_numerals_Normal_pattern.lastIndex = 0;
			return number_String.replace(
			//
			Chinese_numerals_Normal_pattern, function($0) {
				// console.log('-- ' + JSON.stringify($0));
				// 避免前后空格被吃掉。
				var token = $0.match(/^(\s*)(\S.*?)(\s*)$/);
				if (!token) {
					// 可能会是" "
					return $0;
				}
				var digit = token[2].charAt(0);
				token[2] = ('负十'.includes(digit)
						|| positional_Chinese_numerals_digits.includes(digit)
						|| (digit = token[2].charAt(1)) && ('十'.includes(digit)
						//
						|| positional_Chinese_numerals_digits.includes(digit))
				// 不处理过大的位值，例如 "正"。
				? from_Chinese_numeral(token[2]) : token[2]);
				return token[1] + token[2] + token[3];
			});
		}

		var sum = 0, lastIndex = 0,
		//
		negative = number_String.charAt(0) === '负',
		//
		matched = number_String
		//
		.match(/^(负)?(?:(.+)又)?(.+)分之(.+)$/);
		if (matched) {
			sum = (matched[2]
			//
			&& from_Chinese_numeral(matched[2]) || 0)
					+ from_Chinese_numeral(matched[4])
					/ from_Chinese_numeral(matched[3]);
			return negative ? -sum : sum;
		}

		// reset
		Chinese_numerals_token_pattern.lastIndex = 0;

		// console.log([ number_String, Chinese_numerals_token_pattern ]);
		while (matched = Chinese_numerals_token_pattern
		//
		.exec(number_String)) {
			// [ , amount, denomination ]
			// console.log(matched);
			sum += from_Chinese_numeral_token(matched[1] || 1)
					* numeral_value[matched[2]];
			lastIndex = Chinese_numerals_token_pattern.lastIndex;
		}

		number_String = number_String.slice(lastIndex);

		// reset
		numerals_Decimal_token_pattern.lastIndex = 0;

		// console.log([ sum, number_String, numerals_Decimal_token_pattern ]);
		if (lastIndex = numerals_Decimal_token_pattern
		//
		.exec(number_String)) {
			// 输入 '捌佰3分' 之类。
			// console.log(lastIndex);
			lastIndex = lastIndex.index;
			matched = [ , number_String.slice(0, lastIndex),
					number_String.slice(lastIndex) ];
		} else {
			// 输入 '捌佰3又3分' 之类。
			matched = number_String.match(/(.*)[点又.](.*)/)
					|| [ , number_String ];
		}

		if (false) {
			console
					.trace([ sum, matched, Chinese_numerals_Normal_Full_matched ]);
			console.trace([ only_positional_Chinese_numerals_digits_pattern
					.test(matched[1]) ]);
		}
		sum += only_positional_Chinese_numerals_digits_pattern.test(matched[1])
		// e.g., CeL.from_Chinese_numeral('第一二三四章')
		? from_positional_Chinese_numeral(matched[1])
				: from_Chinese_numeral_token(matched[1]);

		// console.trace(sum);

		if (number_String = matched[2]) {
			// 处理小数。
			for (var base = .1, lastIndex = 0;; base /= 10) {
				numerals_Decimal_token_pattern.lastIndex = lastIndex;
				if (matched = numerals_Decimal_token_pattern
				//
				.exec(number_String)) {
					lastIndex
					//
					= numerals_Decimal_token_pattern.lastIndex;
					// 单位
					base = numeral_value[matched[2]];
					matched = matched[1];
				} else {
					numerals_Normal_pattern.lastIndex = lastIndex;
					if (matched = numerals_Normal_pattern
					//
					.exec(number_String)) {
						lastIndex
						//
						= numerals_Normal_pattern.lastIndex;
						matched = matched[0];
					} else
						break;
				}
				if (isNaN(matched))
					matched = numeral_value[matched];
				else if (matched > 9)
					matched = matched.replace(/^(\d)/, '$1.');
				else
					matched = +matched;
				sum += matched * base;
			}
		}

		return negative ? -sum : sum;
	}

	/**
	 * 将阿拉伯数字转为中文数字<b>下数系统</b>大写(Long scale)、小写(Short scale)两种表示法/中文数字读法<br />
	 * 处理1-99999的数,尚有bug。
	 */
	function to_Chinese_numeral_Low_scale(number_String, formal) {
		// 用r=[]约多花一倍时间!
		var i = 0, r = '', l = number_String.length - 1, d,
		//
		tnum = formal ? Chinese_numerals_Formal_digits_Array
				: Chinese_numerals_Normal_digits_Array,
		//
		zero = tnum[0],
		//
		tbd = formal ? Chinese_numerals_Formal_base_denomination
				: Chinese_numerals_Normal_base_denomination;

		for (; i <= l; i++)
			// if(d=parseInt(number_String.charAt(i)))比较慢
			if ((d = number_String.charAt(i)) !== '0')
				// '〇一二三四五六七八'.charAt(d) 比较慢
				r += tnum[d] + tbd[l - i];
			else if (r.slice(-1) != zero)
				if (Math.floor(number_String.slice(i + 1)))
					r += zero;
				else
					break;
		return r;
	}

	if (false)
		(function() {
			// 2.016,2.297,2.016
			var d = new Date, v = '12345236', i = 0, a;
			for (; i < 10000; i++)
				a = to_Chinese_numeral(v);
			alert(v + '\n→' + a + '\ntime:' + gDate(new Date - d));
		});

	/**
	 * 将阿拉伯数字转为万进中文数字表示法。 num>1京时仅会取概数，此时得转成string再输入！ TODO: 统整:尚有bug。 廿卅 小数
	 * 
	 * @param {Number}number
	 *            native number
	 * @param {Boolean}[formal]
	 *            kind
	 * 
	 * @returns {String} 中文数字
	 * 
	 */
	function to_Chinese_numeral(number, formal) {
		// number = parseFloat(number);
		number = (typeof number === 'number'
		//
		? number.toString(10)
		//
		: '' + number)
		// 避免前后空格被吃掉。
		// .replace(/[,\s]/g, '')
		;

		if (!/^[+\-]?(?:\d+(?:\.\d*)?|(?:\d*\.)?\d+)$/.test(number)) {
			// 非数值
			return number.replace(
			//
			/[+\-]?(?:\d+(?:\.\d*)?|(?:\d*\.)?\d+)/g, function($0) {
				// 避免前后空格被吃掉。
				var token = $0.match(/^(\s*)(\S.*?)(\s*)$/);
				if (!token) {
					// 可能会是" "
					return $0;
				}
				// console.log(token);
				return token[1] + to_Chinese_numeral(token[2], formal)
						+ token[3];
			});
		}

		var j,
		// i:integer,整数;
		i,
		// d:decimal,小数
		d = number.indexOf('.'), k, l, m, addZero = false,
		//
		tnum = formal ? Chinese_numerals_Formal_digits_Array
		//
		: Chinese_numerals_Normal_digits_Array,
		//
		zero = tnum[0];
		if (d === NOT_FOUND)
			d = 0;
		else
			for (number = number.replace(/0+$/, ''),
			//
			i = number.slice(d + 1),
			//
			number = number.slice(0, d),
			//
			d = '', j = 0; j < i.length; j++)
				// 小数
				d += tnum[i.charAt(j)];

		// 至此 number 为整数。
		if (number.charAt(0) === '-')
			i = '负', number = number.slice(1);
		else
			i = '';
		number = number.replace(/^0+/, '');

		m = number.length % 4, j = m - 4, l = (number.length - (m || 4)) / 4;
		// addZero=false, l=Math.floor((number.length-1)/4)
		for (; j < number.length; m = 0, l--)
			// 这边得用 parseInt( ,10):
			// parseInt('0~')会用八进位，其他也有奇怪的效果。
			if (Math.floor(m = m ? number.slice(0, m) : number
					.substr(j += 4, 4))) {
				m = to_Chinese_numeral_Low_scale(m, formal);
				if (addZero = addZero && m.charAt(0) != zero) {
					i += zero + m
					//
					+ Chinese_numerals_Denominations_Array[l];
					addZero = false;
				} else
					i += m
					//
					+ Chinese_numerals_Denominations_Array[l];
			} else
				addZero = true;

		// 习惯用法： 一十 → 十
		return (i ? i.replace(/^(负)?[一壹]([十拾])/, '$1$2') : zero)
				+ (d ? '点' + d : '');
	}

	_.from_Chinese_numeral = from_Chinese_numeral;
	_.to_Chinese_numeral = to_Chinese_numeral;

	/**
	 * 各区文化特色 - 货币转换:<br />
	 * 转换成新台币中文大写金额表示法。<br />
	 * Converted into money notation.
	 * 
	 * @example <code>

	// More examples: see /_test suite/test.js

	 * </code>
	 * 
	 * @param {Number|String}amount
	 *            货币数量。
	 * @returns {String} 新台币金额中文大写表示法。
	 * 
	 * @requires to_Chinese_numeral()
	 */
	function to_TWD(amount) {
		if (typeof amount === 'string')
			amount = amount.replace(/[\s,$]+/g, '');

		amount = to_Chinese_numeral(amount, true)
		// 银行习惯用法，零可以不用写。
		.replace(/([佰仟万亿兆京垓秭穰沟涧正载极])零/g, '$1')
		// 100000 → 壹拾万圆整
		.replace(/^拾/, '壹拾');

		// 大写金额数字应紧接“人民币/港币/台币”字样填写，不得留有空位。
		return '新台币' + (amount.includes('点') ? amount.replace(
		//
		/点(.)(.)?(.)?/, function($0, $1, $2, $3) {
			return '圆' + $1 + '角'
			// 日本明治时代台湾 1圆=100钱=1000厘, 不使用"零"这个数字
			// e.g., "五百三圆二十三钱五厘"
			+ ($2 ? $2 + '分' + ($3 ? $3 + '文' : '') : '');
		}) :
		// 在“元”(或“圆”)之后、应写“整”(或“正”)字
		// 在“角”之后，可以不写“整”(或“正”)字
		// 大写金额数字有“分”的，“分”后面不写“整”(或“正”)字。
		amount + '圆整');
	}

	_// JSDT:_module_
	.to_TWD = to_TWD;

	/**
	 * Japanese numerals
	 * 
	 * @param {Number}number
	 *            native number
	 * 
	 * @returns {String} Japanese numerals
	 */
	function to_Japanese_numeral(number) {
		return to_Chinese_numeral(number).replace(/〇/g, '').replace(/万/, '万');
	}

	_.to_Japanese_numeral = to_Japanese_numeral;

	// https://en.wikipedia.org/wiki/Long_and_short_scales
	// http://blog.functionalfun.net/2008/08/project-euler-problem-17-converting.html
	var English_numerals = {
		0 : "zero",
		1 : "one",
		2 : "two",
		3 : "three",
		4 : "four",
		5 : "five",
		6 : "six",
		7 : "seven",
		8 : "eight",
		9 : "nine",
		10 : "ten",
		11 : "eleven",
		12 : "twelve",
		13 : "thirteen",
		14 : "fourteen",
		15 : "fifteen",
		16 : "sixteen",
		17 : "seventeen",
		18 : "eighteen",
		19 : "nineteen",
		20 : "twenty",
		30 : "thirty",
		40 : "forty",
		50 : "fifty",
		60 : "sixty",
		70 : "seventy",
		80 : "eighty",
		90 : "ninety",
		100 : "hundred",
		1000 : "thousand",
		1000000 : "million",
		1000000000 : "billion",
		1000000000000 : "trillion",
		1000000000000000 : "quadrillion",
		// Number.isSafeInteger(1000000000000000000) === false
		'1000000000000000000' : "quintillion"
	};

	// @inner
	function to_English_numeral_small(number) {
		// assert: number = 1 ~ 999
		// hundreds
		var conversion = number / 100 | 0;

		if (number %= 100)
			if (number in English_numerals)
				number = English_numerals[number];
			else {
				// units
				var _1 = number % 10;
				_1 = _1 ? English_numerals[_1] : '';
				// tens
				number = number / 10 | 0;
				if (number) {
					number = English_numerals[number * 10];
					if (_1)
						number += '-' + _1;
				} else
					number = _1;
			}

		if (conversion) {
			conversion = English_numerals[conversion] + ' '
					+ English_numerals[100];
			if (number)
				conversion += ' and ' + number;
		} else
			conversion = number;
		return conversion;
	}

	// written out numbers in words. Get number name.
	// British usage
	// @see http://www.grammarbook.com/numbers/numbers.asp
	function to_English_numeral(number) {
		if (number != Math.floor(number)) {
			library_namespace.error('Cannot conver [' + number + ']!');
		}

		number = Math.floor(number);
		if (number < 0)
			return "negative " + to_English_numeral(-number);
		if (number < 91 && (number in English_numerals))
			// for zero.
			return English_numerals[number];

		var base = 1000, unit = 1, conversion = [], remainder,
		// remainder, 0 ~ 999 (1000-1)
		small = number % base;
		while (number = Math.floor(number / base)) {
			unit *= base;
			if (remainder = number % base)
				conversion.unshift(to_English_numeral_small(remainder) + ' '
						+ English_numerals[unit]);
		}

		if (conversion = conversion.join(', ')) {
			if (small)
				conversion += ' and '
				//
				+ to_English_numeral_small(small);
		} else
			conversion = small ? to_English_numeral_small(small) : '';
		return conversion;
	}

	_.to_English_numeral = to_English_numeral;

	// -----------------------------------------------------------------------------------------------------------------
	// (十进位)位值直接转换用
	// https://en.wikipedia.org/wiki/Positional_notation

	function convert_positional(digit_set, name) {
		var digits;
		if (typeof digit_set !== 'string' || 10 !==
		//
		(digits = digit_set.chars()).length) {
			library_namespace.error('Invalid digits of [' + name + ']: ('
					+ digits.length + ') [' + digit_set + ']');
			return;
		}

		var PATTERN_numeral = new RegExp(
				digit_set.length === digits.length ? '[' + digit_set + ']'
						: digits.join('|'), 'g');
		digits.forEach(function(digit, index) {
			numeral_convert_pair[digit] = index;
		});

		/**
		 * native number → positional numeral system
		 * 
		 * @param {Number}number
		 *            native number
		 * 
		 * @returns {String} specified numerals
		 */
		function to_numeral(number) {
			return String(number).replace(/\d/g, function(digit) {
				return digits[digit];
			});
		}

		/**
		 * positional numeral system → native number
		 * 
		 * @param {String}number
		 *            specified numerals
		 * 
		 * @returns {Number} native number
		 */
		to_numeral.from = function from_numeral(number) {
			number = String(number).replace(PATTERN_numeral, function(digit) {
				return numeral_convert_pair[digit];
			});
			if (!isNaN(number))
				number = Number(number);
			return number;
		}

		return to_numeral;
	}

	// http://wikimediafoundation.org/wiki/Template:ConvertDigit
	// https://github.com/esetera/Objavi/blob/master/digits.txt
	// https://de.wikipedia.org/wiki/Zahlzeichen_in_Unicode
	// TODO: https://en.wiktionary.org/wiki/8
	(function() {
		var positional_digits = {
			// Eastern Arabic numerals
			// https://en.wikipedia.org/wiki/Eastern_Arabic_numerals
			// 中东阿拉伯文数字, 标准阿拉伯文数字
			// Western Arabic / Hindu–Arabic numeral system: 0123456789
			// 在埃及，「二」通常用另一种写法。
			Arabic : '٠١٢٣٤٥٦٧٨٩',
			// Perso-Arabic variant, Persian, Urdu, 东阿拉伯文数字
			Perso : '۰۱۲۳۴۵۶۷۸۹',

			Balinese : '᭐᭑᭒᭓᭔᭕᭖᭗᭘᭙',

			// Bengali numerals (সংখ্যা shôngkhæ), 孟加拉文数字,
			// Bengali-Assamese numerals
			// https://en.wikipedia.org/wiki/Bengali_numerals
			// ৴৵৶৷৸৹
			Bangla : '০১২৩৪৫৬৭৮৯',

			Brahmi : '𑁦𑁧𑁨𑁩𑁪𑁫𑁬𑁭𑁮𑁯',
			Chakma : '𑄶𑄷𑄸𑄹𑄺𑄻𑄼𑄽𑄾𑄿',
			Cham : '꩐꩑꩒꩓꩔꩕꩖꩗꩘꩙',

			// 天城文（देवनागरी / devanāgarī）
			// https://hi.wikipedia.org/wiki/%E0%A4%AE%E0%A5%80%E0%A4%A1%E0%A4%BF%E0%A4%AF%E0%A4%BE%E0%A4%B5%E0%A4%BF%E0%A4%95%E0%A4%BF:Gadget-Numeral_converter.js
			// https://hi.wikipedia.org/wiki/%E0%A4%B5%E0%A4%BF%E0%A4%95%E0%A4%BF%E0%A4%AA%E0%A5%80%E0%A4%A1%E0%A4%BF%E0%A4%AF%E0%A4%BE:%E0%A4%85%E0%A4%82%E0%A4%95_%E0%A4%AA%E0%A4%B0%E0%A4%BF%E0%A4%B5%E0%A4%B0%E0%A5%8D%E0%A4%A4%E0%A4%95
			Devanagari : '०१२३४५६७८९',

			Gujarati : '૦૧૨૩૪૫૬૭૮૯',
			// Gurmukhī numerals
			// https://en.wikipedia.org/wiki/Gurmukh%C4%AB_alphabet#Numerals
			Gurmukhi : '੦੧੨੩੪੫੬੭੮੯',
			Javanese : '꧐꧑꧒꧓꧔꧕꧖꧗꧘꧙',
			Kannada : '೦೧೨೩೪೫೬೭೮೯',
			// Kayah Li
			Kayah_Li : '꤀꤁꤂꤃꤄꤅꤆꤇꤈꤉',

			// Khmer, Cambodian, 高棉文数字.
			// https://km.wikipedia.org/wiki/%E1%9E%91%E1%9F%86%E1%9E%96%E1%9F%90%E1%9E%9A%E1%9E%82%E1%9F%86%E1%9E%9A%E1%9E%BC:Number_table_sorting
			Khmer : '០១២៣៤៥៦៧៨៩',

			// Tai Tham Hora 十进位数字系统。
			Lanna : '᪀᪁᪂᪃᪄᪅᪆᪇᪈᪉',
			// Tai Tham Tham 十进位数字系统。老傣文，又称老傣仂文、兰纳文. Lanna script
			Tai_Tham : '᪐᪑᪒᪓᪔᪕᪖᪗᪘᪙',

			// 寮国/寮文数字
			Lao : '໐໑໒໓໔໕໖໗໘໙',
			Lepcha : '᱀᱁᱂᱃᱄᱅᱆᱇᱈᱉',
			Limbu : '᥆᥇᥈᥉᥊᥋᥌᥍᥎᥏',
			Malayalam : '൦൧൨൩൪൫൬൭൮൯',
			// Meitei-Mayek
			Meitei_Mayek : '꯰꯱꯲꯳꯴꯵꯶꯷꯸꯹',
			Mongolian : '᠐᠑᠒᠓᠔᠕᠖᠗᠘᠙',
			// or Burmese. 缅甸文数字.
			// 警告:其中非空!
			Myanmar : '၀၁၂၃၄၅၆၇၈၉',
			// 缅甸掸邦文十进位数字系统。
			// 警告:其中非空!
			Myanmar_Shan : '႐႑႒႓႔႕႖႗႘႙',
			// Neu-Tai-Lue.
			Neu_Tai_Lue : '᧐᧑᧒᧓᧔᧕᧖᧗᧘᧙',
			// N'Ko, r to l
			NKo : '߀߁߂߃߄߅߆߇߈߉',
			Oriya : '୦୧୨୩୪୫୬୭୮୯',
			// Ol Chiki decimal numeral system. 桑塔尔文十进位数字系统。
			Ol_Chiki : '᱐᱑᱒᱓᱔᱕᱖᱗᱘᱙',
			Osmanya : '𐒠𐒡𐒢𐒣𐒤𐒥𐒦𐒧𐒨𐒩',
			Saurashtra : '꣐꣑꣒꣓꣔꣕꣖꣗꣘꣙',
			Sharada : '𑇐𑇑𑇒𑇓𑇔𑇕𑇖𑇗𑇘𑇙',
			// Sorang-Sompeng
			Sorang_Sompeng : '𑃰𑃱𑃲𑃳𑃴𑃵𑃶𑃷𑃸𑃹',
			Sundanese : '᮰᮱᮲᮳᮴᮵᮶᮷᮸᮹',
			Takri : '𑛀𑛁𑛂𑛃𑛄𑛅𑛆𑛇𑛈𑛉',
			// Tamil (Grantha), 泰米尔文数字
			// https://www.adobe.com/type/browser/pdfs/1965.pdf
			Tamil : '௦௧௨௩௪௫௬௭௮௯',
			Telugu : '౦౧౨౩౪౫౬౭౮౯',
			// 藏文数字
			Tibetan : '༠༡༢༣༤༥༦༧༨༩',
			// 泰文数字 th:ตัวเลขไทย
			// https://th.wikipedia.org/wiki/%E0%B8%95%E0%B8%B1%E0%B8%A7%E0%B9%80%E0%B8%A5%E0%B8%82%E0%B9%84%E0%B8%97%E0%B8%A2
			Thai : '๐๑๒๓๔๕๖๗๘๙',
			Vai : '꘠꘡꘢꘣꘤꘥꘦꘧꘨꘩'
		};

		for ( var name in positional_digits) {
			var to_numeral = convert_positional(positional_digits[name], name);
			if (to_numeral) {
				_['to_' + name + '_numeral'] = to_numeral;
				_['from_' + name + '_numeral'] = to_numeral.from;
			}
		}
	})();

	// -----------------------------------------------------------------------------------------------------------------
	// Roman numerals
	// https://en.wikipedia.org/wiki/Roman_numerals
	// https://en.wiktionary.org/wiki/Appendix:Roman_numerals
	// TODO: to Alternative forms
	var Roman_numeral_alternative = {
		'ↅ' : 'VI',
		'ↆ' : 'L',
		// Safari 11: Invalid character
		'Ⅼ' : 'L',
		'Ⅽ' : 'C',
		'Ⅾ' : 'D',
		'Ⅿ' : 'M',
		'ⅼ' : 'L',
		'ⅽ' : 'C',
		'ⅾ' : 'D',
		'ⅿ' : 'M',
		'ↀ' : 'M'
	}, PATTERN_Roman_numeral_alternative,
	//
	Roman_numeral_pair = {},
	// 
	PATTERN_Roman = [],

	// assert: 2个一组为十进位。
	Roman_numeral_value = 'IVXLCDMↁↂↇↈ'.split(''),
	// Roman_numeral_value[apostrophus_starts] 开始为 apostrophus 表示法。
	apostrophus_starts = Roman_numeral_value.indexOf('ↁ');

	Roman_numeral_value.forEach(function(digit, index) {
		var is_unit = index % 2 === 0, next;
		Roman_numeral_pair[digit] = (is_unit ? 1 : 5)
				* Math.pow(10, index / 2 | 0);
		if (is_unit) {
			var next = Roman_numeral_value[index + 1];
			PATTERN_Roman.unshift('('
					+ (next ? digit + '[' + next
							+ Roman_numeral_value[index + 2] + ']|' + next
							+ '?' : '') + digit + '*)');
		}
	});

	// 千百十个: /(M*)(C[DM]|D?C*)(X[LC]|L?X*)(I[VX]|V?I*)/i
	PATTERN_Roman = new RegExp(PATTERN_Roman.join(''), 'i');
	// console.log(PATTERN_Roman);
	// /(ↈ*)(ↂ[ↇↈ]|ↇ?ↂ*)(M[ↁↂ]|ↁ?M*)(C[DM]|D?C*)(X[LC]|L?X*)(I[VX]|V?I*)/i

	// apostrophus: expressed in "apostrophus" notation.
	function to_Roman_numeral(number, apostrophus) {
		if (!(number > 0) || number != (number | 0)) {
			/**
			 * the word nulla (the Latin word meaning "none") was used by
			 * medieval computists in lieu of 0.<br />
			 * About 725, Bede or one of his colleagues used the letter N, the
			 * initial of nulla, in a table of epacts, all written in Roman
			 * numerals.
			 */
			// return number === 0 ? 'N' : number;
			return number;
		}

		/** {Natural}已处理的 Roman 数字。 */
		var value = [],
		/** {Natural}剩下尚未处理的数值。 */
		left = number | 0;

		// 将 apostrophus 转成可接受的最大 index。
		apostrophus = apostrophus ? Roman_numeral_value.length
				: apostrophus_starts;

		// index += 2: assert: 2个一组为十进位。
		for (var index = 0; left > 0; index += 2) {
			if (index >= apostrophus) {
				library_namespace.error(
				// OUT OF RANGE: number ≥ 1000000
				'The number is too large to be expressed in Roman numerals: '
						+ number);
				return;
			}

			var digits,
			/** {Integer}位值。 */
			position = left % 10;
			left = left / 10 | 0;
			if ((position + 1) % 5 === 0 && apostrophus >
			// position = 4 or 9 时之特殊处置。必须有此数字表示法，才允许通过。
			(digits = index + (position === 4 ? 1 : 2))) {
				digits = Roman_numeral_value[index]
						+ Roman_numeral_value[digits];
			} else {
				if (position > 4
				// [index + 1] 可能已经越界。
				&& (digits = Roman_numeral_value[index + 1])) {
					position -= 5;
				} else {
					digits = '';
				}
				digits += Roman_numeral_value[index].repeat(position);
			}
			value.push(digits);
		}

		return value.reverse().join('');
	}

	function Roman_position(previous, position) {
		if (!position)
			return previous;

		if (position.length === 1)
			return previous + Roman_numeral_pair[position];

		var _1 = Roman_numeral_pair[position[0]],
		//
		_2 = Roman_numeral_pair[position[1]];
		if (_2 > _1)
			// assert: position.length === 2
			return previous + _2 - _1;

		return previous + _1 + _2 * (position.length - 1);
	}

	// TODO: 'Ↄ', 'ↄ'
	function from_Roman_numeral(number) {
		var matched = normalize_Roman_numeral(number).match(PATTERN_Roman);

		return matched ? matched.slice(1).reduce(Roman_position, 0) : number;
	}

	function normalize_Roman_numeral(number) {
		return String(number)
		// 正规化。
		.replace(PATTERN_Roman_numeral_alternative, function(digit) {
			return Roman_numeral_alternative[digit];
		});
	}

	_.to_Roman_numeral = to_Roman_numeral;
	_.from_Roman_numeral = from_Roman_numeral;
	_.normalize_Roman_numeral = normalize_Roman_numeral;

	'ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩⅪⅫ'.split('').forEach(function(digit, index) {
		Roman_numeral_alternative[digit] = to_Roman_numeral(index + 1);
	});
	'ⅰⅱⅲⅳⅴⅵⅶⅷⅸⅹⅺⅻ'.split('').forEach(function(digit, index) {
		Roman_numeral_alternative[digit] = to_Roman_numeral(index + 1);
	});
	PATTERN_Roman_numeral_alternative = new RegExp('['
			+ Object.keys(Roman_numeral_alternative) + ']', 'g');

	if (false)
		(function() {
			for (var i = 1; i < 50000; i++)
				if (i !== CeL.from_Roman_numeral(CeL.to_Roman_numeral(i)))
					throw 'Error: ' + i + ' → ' + CeL.to_Roman_numeral(i)
							+ ' → '
							+ CeL.from_Roman_numeral(CeL.to_Roman_numeral(i));
		});

	// -----------------------------------------------------------------------------------------------------------------

	return (_// JSDT:_module_
	);
}
