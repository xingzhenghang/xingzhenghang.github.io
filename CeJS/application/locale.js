/**
 * @name CeL function for locale / i18n (Internationalization, ja:地域化) 系列
 * @fileoverview 本档案包含了地区语系/文化设定的 functions。
 * @since
 * @see http://blog.miniasp.com/post/2010/12/24/Search-and-Download-International-Terminology-Microsoft-Language-Portal.aspx
 *      http://www.microsoft.com/language/zh-tw/default.aspx Microsoft | 语言入口网站
 */

'use strict';
// 'use asm';

// --------------------------------------------------------------------------------------------

// 不采用 if 陈述式，可以避免 Eclipse JSDoc 与 format 多缩排一层。
typeof CeL === 'function' && CeL.run({
	// module name
	name : 'application.locale',

	// data.numeral.to_Chinese_numeral|data.numeral.to_positional_Chinese_numeral|data.numeral.to_English_numeral
	require : 'data.numeral.to_Chinese_numeral'
	//
	+ '|data.numeral.to_positional_Chinese_numeral',

	// 设定不汇出的子函式。
	// no_extend : '*',

	// 为了方便格式化程式码，因此将 module 函式主体另外抽出。
	code : module_code
});

function module_code(library_namespace) {

	var module_name = this.id,
	// requiring
	to_Chinese_numeral = this.r('to_Chinese_numeral'), to_positional_Chinese_numeral = this
			.r('to_positional_Chinese_numeral');

	/**
	 * null module constructor
	 * 
	 * @class locale 的 functions
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
	<a href="http://www.ietf.org/rfc/bcp/bcp47.txt" accessdate="2012/8/22 15:23" title="BCP 47: Tags for Identifying Languages">BCP 47</a> language tag

	http://www.whatwg.org/specs/web-apps/current-work/#the-lang-and-xml:lang-attributes
	The lang attribute (in no namespace) specifies the primary language for the element's contents and for any of the element's attributes that contain text. Its value must be a valid BCP 47 language tag, or the empty string.

	<a href="http://www.w3.org/International/articles/language-tags/" accessdate="2012/9/23 13:29">Language tags in HTML and XML</a>
	language-extlang-script-region-variant-extension-privateuse

	http://www.cnblogs.com/sink_cup/archive/2011/04/15/written_language_and_spoken_language.html
	http://zh.wikipedia.org/wiki/%E6%B1%89%E8%AF%AD

	<a href="http://en.wikipedia.org/wiki/IETF_language_tag" accessdate="2012/8/22 15:25">IETF language tag</a>

	TODO:
	en-X-US
	</code>
	 */
	function language_tag(tag) {
		return language_tag.parse.call(this, tag);
	}

	// 3_language[-3_extlang][-3_extlang][-4_script][-2w|3d_region]
	language_tag.language_RegExp = /^(?:(?:([a-z]{2,3})(?:-([a-z]{4,8}|[a-z]{3}(?:-[a-z]{3}){0,1}))?))(?:-([a-z]{4}))?(?:-([a-z]{2}|\d{3}))?((?:-(?:[a-z\d]{2,8}))*)$/;
	// x-fragment[-fragment]..
	language_tag.privateuse_RegExp = /^x((?:-(?:[a-z\d]{1,8}))+)$/;
	// 片段
	language_tag.privateuse_fragment_RegExp = /-([a-z\d]{1,8})/g;
	language_tag.parse = function(tag) {
		this.tag = tag;
		// language tags and their subtags, including private use and
		// extensions, are to be treated as case insensitive
		tag = String(tag).toLowerCase();
		var i = 1, match = language_tag.language_RegExp.exec(tag);
		if (match) {
			library_namespace.debug(match.join('<br />'), 3,
					'language_tag.parse');

			// 3_language[-3_extlang][-3_extlang][-4_script][-2w|3d_region]

			// <a href="http://en.wikipedia.org/wiki/ISO_639-3"
			// accessdate="2012/9/22 17:5">ISO 639-3 codes</a>
			// list: <a href="http://en.wikipedia.org/wiki/ISO_639:a"
			// accessdate="2012/9/22 16:56">ISO 639:a</a>
			// 国际语种代号标准。
			this.language = match[i++];
			// TODO: 查表对照转换, fill this.language
			this.extlang = match[i++];

			/**
			 * @see <a
			 *      href="http://en.wikipedia.org/wiki/ISO_15924#List_of_codes"
			 *      accessdate="2012/9/22 16:57">ISO 15924 code</a>
			 */
			// 书写文字。match[] 可能是 undefined。
			this.script = (match[i++] || '').replace(/^[a-z]/, function($0) {
				return $0.toUpperCase();
			});
			/**
			 * @see <a
			 *      href="http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements"
			 *      accessdate="2012/9/22 16:58">ISO 3166-1 alpha-2 code</a>
			 */
			// 国家/地区/区域/领域代码。match[] 可能是 undefined。
			this.region = (match[i++] || '').toUpperCase();

			// TODO: variant, extension, privateuse
			this.external = match[i++];

			if (library_namespace.is_debug(2)) {
				for (i in this) {
					library_namespace.debug(i + ' : ' + this[i], 2,
							'language_tag.parse');
				}
			}

		} else if (match = language_tag.privateuse_RegExp.exec(tag)) {

			// x-fragment[-fragment]..
			library_namespace.debug('parse privateuse subtag [' + tag + ']', 2,
					'language_tag.parse');
			tag = match[1];
			this.privateuse = i = [];
			// reset 'g' flag
			language_tag.privateuse_fragment_RegExp.exec('');
			while (match = language_tag.privateuse_fragment_RegExp.exec(tag)) {
				i.push(match[1]);
			}
			library_namespace.debug('privateuse subtag: ' + i, 2,
					'language_tag.parse');

		} else if (library_namespace.is_debug()) {
			library_namespace.warn('unrecognized language tag: [' + tag + ']');
		}

		return this;
	};

	// 查表对照转换。
	language_tag.convert = function() {
		// TODO
		throw new Error('language_tag.convert: '
		// gettext_config:{"id":"not-yet-implemented"}
		+ gettext('Not Yet Implemented!'));
	};

	/**
	 * <code>
	new language_tag('cmn-Hant-TW');
	new language_tag('zh-cmn-Hant-TW');
	new language_tag('zh-Hant-TW');
	new language_tag('zh-TW');
	new language_tag('cmn-Hant');
	new language_tag('zh-Hant');
	new language_tag('x-CJK').language;
	new language_tag('zh-Hant').language;
	</code>
	 */

	// 语系代码，应使用 language_tag.language_code(region) 的方法。
	// 主要的应该放后面。
	// mapping: region code (ISO 3166) → default language code (ISO 639)
	// https://en.wikipedia.org/wiki/Template:ISO_639_name
	language_tag.LANGUAGE_CODE = {
		// 中文
		ZH : 'zh',
		// http://www.iana.org/assignments/language-subtag-registry/language-subtag-registry
		// Preferred-Value: cmn
		CN : 'cmn-Hans',
		// cmn-Hant-HK, yue-Hant-HK
		HK : 'cmn-Hant',
		TW : 'cmn-Hant',
		// ja-JP
		JP : 'ja',
		// ko-KR
		KR : 'ko',
		// en-GB
		GB : 'en',
		// There is no "en-UK" language code although it is often used on web
		// pages. http://microformats.org/wiki/en-uk
		// https://moz.com/community/q/uk-and-gb-when-selecting-targeted-engines-in-campaign-management
		UK : 'en',
		// en-US
		US : 'en',
		FR : 'fr',
		DE : 'de',
		// ru-RU
		RU : 'ru',
		// arb-Arab
		Arab : 'arb'
	};

	/**
	 * Get the default language code of region.
	 * 
	 * @param {String}region
	 *            region code (ISO 3166)
	 * @returns {String} language code (ISO 639)
	 */
	language_tag.language_code = function(region, regular_only) {
		var code = language_tag.LANGUAGE_CODE[language_tag.region_code(region)];
		if (!code
		// identity alias
		&& !language_tag.LANGUAGE_CODE[code = region.toLowerCase()]) {
			if (library_namespace.is_debug())
				library_namespace
						.warn('language_tag.language_code: 无法辨识之国家/区域：['
								+ region + ']');
			if (regular_only)
				return;
		}
		return code;
	}

	// mapping: region name → region code (ISO 3166)
	// https://en.wikipedia.org/wiki/ISO_3166-1
	// language_tag.region_code() 会自动测试添加"国"字，因此不用省略这个字。
	language_tag.REGION_CODE = {
		台 : 'TW',
		台湾 : 'TW',
		台 : 'TW',
		台湾 : 'TW',
		// for language_tag.LANGUAGE_CODE
		中文 : 'ZH',
		陆 : 'CN',
		大陆 : 'CN',
		中国 : 'CN',
		中国大陆 : 'CN',
		jpn : 'JP',
		日 : 'JP',
		日本 : 'JP',
		港 : 'HK',
		香港 : 'HK',
		韩国 : 'KR',
		英国 : 'GB',
		美国 : 'US',
		法国 : 'FR',
		德国 : 'DE',
		俄国 : 'RU',
		俄罗斯 : 'RU',
		阿拉伯 : 'Arab'
	};

	// reverse
	(function() {
		for ( var region_code in language_tag.REGION_CODE) {
			if ((region_code = language_tag.REGION_CODE[region_code])
			// identity alias: REGION_CODE[TW] = 'TW'
			&& !language_tag.REGION_CODE[region_code])
				language_tag.REGION_CODE[region_code] = region_code;
		}
		for ( var language_code in language_tag.LANGUAGE_CODE) {
			// reversed alias
			// e.g., ja → JP
			// e.g., cmn-hans → CN
			language_tag.REGION_CODE[language_tag.LANGUAGE_CODE[language_code]
					.toLowerCase()] = language_code;
		}
		// 因为下面的操作会改变 language_tag.LANGUAGE_CODE，因此不能与上面的同时操作。
		for ( var language_code in language_tag.LANGUAGE_CODE) {
			if ((language_code = language_tag.LANGUAGE_CODE[language_code])
			// identity alias
			&& !language_tag.LANGUAGE_CODE[language_code])
				language_tag.LANGUAGE_CODE[language_code] = language_code;
		}
	})();

	/**
	 * Get the default region code of region.
	 * 
	 * @param {String}region
	 *            region name
	 * @returns {String} region code (ISO 3166)
	 */
	language_tag.region_code = function(region, regular_only) {
		var code = language_tag.REGION_CODE[region];
		if (!code) {
			library_namespace.debug('尝试解析 [' + region + ']。', 3,
					'language_tag.region_code');
			if (/^[a-z\-]+$/i.test(region)) {
				library_namespace.debug('尝试 reversed alias 的部分。', 3,
						'language_tag.region_code');
				// language_code → region_code
				// e.g., cmn-Hant → search cmn-hant
				code = language_tag.REGION_CODE[region.toLowerCase()];

			} else if (code = region.match(/^(.+)[语文]$/)) {
				code = language_tag.REGION_CODE[code[1]]
				// e.g., 英语 → search 英国
				|| language_tag.REGION_CODE[code[1] + '国'];
			} else {
				// e.g., 英 → search 英国
				code = language_tag.REGION_CODE[region + '国'];
			}

			if (!code && (code = region.match(/-([a-z]{2,3})$/)))
				// e.g., zh-tw → search TW
				code = language_tag.REGION_CODE[code[1].toUpperCase()];

			if (!code
			// identity alias
			&& !language_tag.REGION_CODE[code = region.toUpperCase()]) {
				// 依旧无法成功。
				if (library_namespace.is_debug())
					library_namespace
							.warn('language_tag.region_code: 无法辨识之国家/区域：['
									+ region + ']');
				if (regular_only)
					return;
			}
		}
		return code;
	}

	_// JSDT:_module_
	.language_tag = language_tag;

	// -----------------------------------------------------------------------------------------------------------------
	// 各个 domain 结尾标点符号的转换。

	var halfwidth_to_fullwidth_mapping = {
		'.' : '。'
	}, fullwidth_to_halfwidth_mapping = {
		'、' : ',',
		'。' : '.'
	};

	var PATTERN_language_code_is_CJK = /^(?:cmn|yue|ja)-/;

	function convert_punctuation_mark(punctuation_mark, domain_name) {
		if (!punctuation_mark)
			return punctuation_mark;

		// test domains_using_fullwidth_form
		if (PATTERN_language_code_is_CJK.test(domain_name)) {
			// 东亚标点符号。
			if (punctuation_mark in halfwidth_to_fullwidth_mapping) {
				return halfwidth_to_fullwidth_mapping[punctuation_mark];
			}

			if (/^ *\.{3,} *$/.test(punctuation_mark)) {
				// 中文预设标点符号前后无空白。
				punctuation_mark = punctuation_mark.trim();
				return '…'.repeat(punctuation_mark.length > 6 ? Math
						.ceil(punctuation_mark.length / 3) : 2);
			}

			if (/^ja-/.test(domain_name) && punctuation_mark === ',') {
				return '、';
			}

			if (punctuation_mark.length === 1) {
				// https://en.wikipedia.org/wiki/Halfwidth_and_Fullwidth_Forms_(Unicode_block)
				var char_code = punctuation_mark.charCodeAt(0);
				if (char_code < 0xff) {
					return String.fromCharCode(char_code + 0xfee0);
				}
			}

		} else if (/^[^\x20-\xfe]/.test(punctuation_mark)) {
			if (punctuation_mark in fullwidth_to_halfwidth_mapping) {
				return fullwidth_to_halfwidth_mapping[punctuation_mark];
			}

			if (/^…+$/.test(punctuation_mark)) {
				return punctuation_mark.length > 2 ? '...'
						.repeat(punctuation_mark.length) : '...';
			}

			if (punctuation_mark.length === 1) {
				var char_code = punctuation_mark.charCodeAt(0);
				if (char_code > 0xfee0) {
					return String.fromCharCode(char_code - 0xfee0);
				}
			}
		}

		if (punctuation_mark.length > 1) {
			// PATTERN_punctuation_marks
			return punctuation_mark.replace(/%(\d)|(:)\s*|./g, function(p_m,
					NO, p_m_with_spaces) {
				if (NO)
					return p_m;
				if (p_m_with_spaces) {
					if (!PATTERN_language_code_is_CJK.test(domain_name))
						return p_m;
					p_m = p_m_with_spaces;
				}
				return convert_punctuation_mark(p_m, domain_name);
			});
		}

		return punctuation_mark;
	}

	// -----------------------------------------------------------------------------------------------------------------

	var plural_rules__domain_name = 'gettext_plural_rules';
	// plural_rules[language_code]
	// = [ #plural forms, function(){ return #plural form; } ]
	var plural_rules_of_language_code = Object.create(null);

	gettext.set_plural_rules = function set_plural_rules(plural_rules_Object) {
		for ( var language_code in plural_rules_Object) {
			var plural_rule = plural_rules_Object[language_code];
			language_code = gettext.to_standard(language_code);
			if (language_code) {
				plural_rules_of_language_code[language_code] = plural_rule;
			}// else: 尚未支援的语言。
		}
	};

	// ------------------------------------

	// matched: [ all behavior switch, is NO, NO ]
	var PATTERN_plural_switch_header = /\{\{PLURAL: *(%)?(\d+) *\|/,
	// matched: [ all behavior switch, previous, is NO, NO, parameters ]
	PATTERN_plural_switches_global = new RegExp('('
			+ PATTERN_plural_switch_header.source + ')'
			+ /([\s\S]+?)\}\}/.source, 'ig');

	// 处理 {{PLURAL:%1|summary|summaries}}
	// 处理 {{PLURAL:$1|1=you|$1 users including you}}
	// 处理 {{PLURAL:42|42=The answer is 42|Wrong answer|Wrong answers}}
	// https://raw.githubusercontent.com/wikimedia/mediawiki-extensions-Translate/master/data/plural-gettext.txt
	// https://translatewiki.net/wiki/Plural
	// https://docs.transifex.com/formats/gettext#plural-forms-in-a-po-file
	function adapt_plural(converted_text, value_list, domain_name) {
		var plural_count, plural_rule = plural_rules_of_language_code[domain_name];
		if (Array.isArray(plural_rule)) {
			plural_count = plural_rule[0];
			plural_rule = plural_rule[1];
		}
		// console.trace([ domain_name, plural_count, plural_rule ]);

		converted_text = converted_text.replace_till_stable(
		//
		PATTERN_plural_switches_global, function(all, _previous, is_NO, NO,
				parameters) {
			// https://translatewiki.net/wiki/Plural
			// And you can nest it freely
			// 自 end_mark 向前回溯。
			// TODO: using lookbehind search?
			var previous = '', nest_matched;
			while (nest_matched = parameters
					.match(PATTERN_plural_switch_header)) {
				previous += _previous
				//
				+ parameters.slice(0, nest_matched.index);
				_previous = nest_matched[0];
				is_NO = nest_matched[1];
				NO = nest_matched[2];
				parameters = parameters.slice(nest_matched.index
						+ _previous.length);
			}

			var value = is_NO ? value_list[NO] : NO;
			if (value < 0)
				value = -value;
			var plural_NO = (typeof plural_rule === 'function'
			//
			? plural_rule(+value) : plural_rule) + 1;

			var converted, default_converted, delta = 1;
			parameters = parameters.split('|');
			parameters.some(function(parameter, index) {
				var matched = parameter.match(/^(\d+)=([\s\S]*)$/);
				if (matched) {
					delta--;
					index = +matched[1];
					parameter = matched[2];
					if (index == value) {
						converted = parameter;
						return true;
					}
					if (!default_converted)
						default_converted = parameter;
					return;
				}

				index += delta;
				if (plural_NO >= 1) {
					if (index === plural_NO) {
						converted = parameter;
						// Do not return. Incase {{PLURAL:5|one|other|5=5}}
					} else if (index === 2 && plural_count !== 2
					// Special case. e.g., {{PLURAL:2||s}}
					// @ zh(plural_count=1), ru(3), NOT fr(2)
					&& value != 1 && parameters.length === 2) {
						converted = parameter;
						// assert: Should be the last element of parameters.
					} else {
						default_converted = parameter;
					}
					return;
				}

				/**
				 * https://translatewiki.net/wiki/Plural
				 * 
				 * If the number of forms written is less than the number of
				 * forms required by the plural rules of the language, the last
				 * available form will be used for all missing forms.
				 */
				default_converted = parameter;
				if (index == value) {
					converted = parameter;
					return true;
				}
			});

			return previous
			//
			+ (converted === undefined ? default_converted : converted);
		});

		return converted_text;
	}

	// -----------------------------------------------------------------------------------------------------------------
	// JavaScript 国际化 i18n (Internationalization) / 在地化 本土化 l10n (Localization)
	// / 全球化 g11n (Globalization).

	/**
	 * 为各种不同 domain 转换文字（句子）、转成符合当地语言的讯息内容。包括但不仅限于各种语系。<br />
	 * 需要确认系统相应 domain resources 已载入时，请利用 gettext.use_domain(domain, callback)。
	 * 
	 * TODO: using localStorage.<br />
	 * https://translatewiki.net/wiki/Plural
	 * 
	 * @example <code>

	// More examples: see /_test suite/test.js

	 * </code>
	 * 
	 * @param {String|Function|Object}text_id
	 *            欲呼叫之 text id。<br /> ** 若未能取得，将直接使用此值。因此即使使用简单的代号，也建议使用
	 *            msg#12, msg[12] 之类的表示法，而非直接以整数序号代替。<br />
	 *            嵌入式的一次性使用，不建议如此作法: { domain : text id }
	 * @param {String|Function}conversion_list
	 *            other conversion to include
	 * 
	 * @returns {String}转换过的文字。
	 * 
	 * @since 2012/9/9 00:53:52
	 * 
	 * @see <a
	 *      href="http://stackoverflow.com/questions/48726/best-javascript-i18n-techniques-ajax-dates-times-numbers-currency"
	 *      accessdate="2012/9/9 0:13">Best JavaScript i18n techniques / Ajax -
	 *      dates, times, numbers, currency - Stack Overflow</a>,<br />
	 *      <a
	 *      href="http://stackoverflow.com/questions/3084675/internationalization-in-javascript"
	 *      accessdate="2012/9/9 0:13">Internationalization in Javascript -
	 *      Stack Overflow</a>,<br />
	 *      <a
	 *      href="http://stackoverflow.com/questions/9640630/javascript-i18n-internationalization-frameworks-libraries-for-clientside-use"
	 *      accessdate="2012/9/9 0:13">javascript i18n (internationalization)
	 *      frameworks/libraries for clientside use - Stack Overflow</a>,<br />
	 *      <a href="http://msdn.microsoft.com/en-us/library/txafckwd.aspx"
	 *      accessdate="2012/9/17 23:0">Composite Formatting</a>,
	 *      http://wiki.ecmascript.org/doku.php?id=strawman:string_format,
	 *      http://wiki.ecmascript.org/doku.php?id=strawman:string_format_take_two
	 */
	function gettext(/* message */text_id/* , ...value_list */) {
		// 转换 / convert function.
		function convert(text_id, domain_specified) {
			// 未设定个别 domain 者，将以此讯息(text_id)显示。
			// text_id 一般应采用原文(message of original language)，
			// 或最常用语言；亦可以代码(message id)表示，但须设定所有可能使用的语言。
			// console.log(text_id);

			var prefix, postfix;
			if (library_namespace.is_debug(9)) {
				console.trace(domain);
			}

			// 注意: 在 text_id 与所属 domain 之 converted_text 相同的情况下，
			// domain 中不会有这一笔记录。
			// 因此无法以 `text_id in domain` 来判别 fallback。
			if (typeof text_id === 'function' || typeof text_id === 'object') {
				using_default = true;
			} else if (!(text_id in domain)) {
				var matched = String(text_id).match(
						PATTERN_message_with_tail_punctuation_mark);
				if (matched && (matched[2] in domain)) {
					prefix = matched[1];
					postfix = matched[3];
					text_id = matched[2];
				} else {
					using_default = true;
				}
			}
			if (!using_default) {
				text_id = domain[text_id];
				if (prefix) {
					text_id = convert_punctuation_mark(prefix, domain_name)
							+ text_id;
				}
				if (postfix
				// 预防翻译后有结尾标点符号，但原文没有的情况。但这情况其实应该警示。
				// && !PATTERN_message_with_tail_punctuation_mark.test(text_id)
				) {
					text_id += convert_punctuation_mark(postfix, domain_name);
				}
			}

			return typeof text_id === 'function' ? text_id(domain_name,
					value_list, domain_specified) : text_id;
		}

		function try_domain(_domain_name, recover) {
			var original_domain_data = [ domain_name, domain ];

			domain_name = _domain_name;
			// 在不明环境，如 node.js 中执行时，((gettext_texts[domain_name])) 可能为
			// undefined。
			domain = gettext_texts[domain_name] || Object.create(null);
			var _text = String(convert(library_namespace.is_Object(text_id) ? text_id[domain_name]
					: text_id));

			if (recover) {
				domain_name = original_domain_data[0];
				domain = original_domain_data[1];
			}
			return _text;
		}

		var value_list = arguments, length = value_list.length, using_default,
		// this: 本次转换之特殊设定。
		domain_name = this && this.domain_name || gettext_domain_name,
		//
		domain, converted_text = try_domain(domain_name),
		// 强制转换/必须转换 force convert. e.g., 输入 id，因此不能以 text_id 显示。
		force_convert = using_default && this && (this.force_convert
		// for DOM
		|| this.getAttribute && this.getAttribute('force_convert'));

		// 设定 force_convert 时，最好先 `gettext.load_domain(force_convert)`
		// 以避免最后仍找不到任何一个可用的 domain。
		if (force_convert) {
			// force_convert: fallback_domain_name_list
			if (!Array.isArray(force_convert))
				force_convert = force_convert.split(',');
			force_convert.some(function(_domain_name) {
				_domain_name = gettext.to_standard(_domain_name);
				if (!_domain_name || _domain_name === domain_name)
					return;
				var _text = try_domain(_domain_name, true);
				if (!using_default) {
					domain_name = _domain_name;
					converted_text = _text;
					// using the first matched
					return true;
				}
			});
		}

		library_namespace
				.debug('Use domain_name: ' + domain_name, 6, 'gettext');

		converted_text = adapt_plural(converted_text, value_list, domain_name);

		if (length <= 1) {
			// assert: {String}converted_text
			return converted_text;
		}

		var text_list = [], matched, last_index = 0,
		// 允许 convert 出的结果为 object。
		has_object = false,
		// whole conversion specification:
		// %% || %index || %domain/index
		// || %\w(conversion format specifier)\d{1,2}(index)
		// || %[conversion specifications@]index
		//
		// 警告: index 以 "|" 终结，后接数字会被视为 patten 明确终结，并且 "|" 将被吃掉。
		// e.g., gettest("%1|123", 321) === "321123"
		// gettest("%1||123", 321) === "321||123"
		// TODO: 改成 %{index}, %{var_id}
		//
		// @see CeL.extract_literals()
		//
		// 采用 local variable，因为可能有 multithreading 的问题。
		conversion_pattern = /([\s\S]*?)%(?:(%)|(?:([^%@\s\/]+)\/)?(?:([^%@\s\d]{1,3})|([^%@]+)@)?(\d{1,2})(\|\d)?)/g;

		while (matched = conversion_pattern.exec(converted_text)) {
			if (matched[7]) {
				// 回吐最后一个 \d
				conversion_pattern.lastIndex--;
				// conversion_pattern.lastIndex -= matched[7].length
				// - '|'.length;
			}
			last_index = conversion_pattern.lastIndex;

			// matched:
			// 0: prefix + conversion, 1: prefix, 2: is_escaped "%",
			// 3: domain_specified, 4: format, 5: object_name, 6: argument NO,
			// 7: "|" + \d.
			var conversion = matched[0];

			if (matched[2]) {
				text_list.push(conversion);
				continue;
			}

			var NO = +matched[6], format = matched[4];
			if (NO < length && (!(format || (format = matched[5]))
			// 有设定 {String}format 的话，就必须在 gettext.conversion 中。
			|| (format in gettext.conversion))) {
				if (NO === 0)
					conversion = text_id;
				else {
					var domain_specified = matched[3],
					//
					domain_used = domain_specified
							&& gettext_texts[domain_specified];
					if (domain_used) {
						// 避免 %0 形成 infinite loop。
						var origin_domain = domain, origin_domain_name = domain_name;
						library_namespace.debug('临时改变 domain: ' + domain_name
								+ '→' + domain_specified, 6, 'gettext');
						domain_name = domain_specified;
						domain = domain_used;
						conversion = convert(value_list[NO], domain_specified);
						library_namespace.debug('回存/回复 domain: ' + domain_name
								+ '→' + origin_domain_name, 6, 'gettext');
						domain_name = origin_domain_name;
						domain = origin_domain;
					} else {
						conversion = convert(value_list[NO]);
					}
				}

				if (format)
					conversion = Array.isArray(NO = gettext.conversion[format])
					//
					? gettext_conversion_Array(conversion, NO, format)
					// assert: gettext.conversion[format] is function
					: NO(conversion, domain_specified || domain_name);

			} else {
				library_namespace.warn('gettext: '
				//
				+ (NO < length ? 'Unknown format [' + format + ']'
				//
				: 'given too few arguments: ' + length + ' <= No. ' + NO));
			}

			if (typeof conversion === 'object') {
				has_object = true;
				text_list.push(matched[1], conversion);
			} else {
				// String(conversion): for Symbol value
				text_list.push(matched[1] + String(conversion));
			}
		}

		text_list.push(converted_text.slice(last_index));
		return has_object ? text_list : text_list.join('');
	}

	var PATTERN_is_punctuation_mark = /^[,;:.?!~、，；：。？！～]$/;
	// matched: [ all, header punctuation mark, text_id / message, tail
	// punctuation mark ]
	var PATTERN_message_with_tail_punctuation_mark = /^(\.{3,}\s*)?([\s\S]+?)(\.{3,}|…+|:\s*(%\d)?|[,;:.?!~、，；：。？！～])$/;

	function trim_punctuation_marks(text) {
		var matched = text.match(PATTERN_message_with_tail_punctuation_mark);
		return matched ? matched[2] : text;
	}

	_.trim_punctuation_marks = trim_punctuation_marks;

	// ------------------------------------------------------------------------

	// 应对多个句子在不同语言下结合时使用。
	function Sentence_combination(sentence) {
		// call super constructor.
		// Array.call(this);

		var sentence_combination = this;
		if (sentence) {
			if (Array.isArray(sentence) && sentence.every(function(_sentence) {
				return Array.isArray(_sentence);
			})) {
				// e.g., new CeL.gettext.Sentence_combination(
				// [ [ 'message', p1 ], [ 'message' ] ])
				sentence_combination.append(sentence);
			} else {
				// e.g., new CeL.gettext.Sentence_combination(
				// [ 'message', p1, p2 ])
				sentence_combination.push(sentence);
			}
		}
	}

	function deep_convert(text) {
		if (!Array.isArray(text)) {
			var converted = gettext(text);
			if (converted === text && PATTERN_is_punctuation_mark.test(text)) {
				// e.g., text === ','
				converted = convert_punctuation_mark(text, gettext_domain_name);
			}
			return converted;
		}

		// e.g., [ '%1 elapsed.', ['%1 s', 2] ]
		var converted = [ text[0] ];
		for (var index = 1; index < text.length; index++) {
			converted[index] = deep_convert(text[index]);
		}
		return gettext.apply(null, converted);
	}

	function Sentence_combination__converting() {
		var converted_list = [];
		this.forEach(function(sentence) {
			sentence = deep_convert(sentence);
			if (sentence)
				converted_list.push(sentence);
		});

		return converted_list;
	}

	// @see CeL.data.count_word()
	// 这些标点符号和下一句中间可以不用接空白字元。
	// /[\u4e00-\u9fa5]/: 匹配中文 RegExp。
	// https://en.wikipedia.org/wiki/CJK_Unified_Ideographs_(Unicode_block)
	// https://arc-tech.hatenablog.com/entry/2021/01/20/105620
	// e.g., start quote marks
	var PATTERN_no_need_to_append_tail_space = /[\s—、，；：。？！（）［］｛｝「」『』〔〕【】〖〗〈〉《》“”‘’§(\[<{⟨‹«\u4e00-\u9fffぁ-んーァ-ヶ]$/;
	// e.g., end quote marks
	var PATTERN_no_need_to_add_header_space = /^[\s)\]>}⟩›»）］｝」』〕】〗〉》”’‰‱]/;

	function Sentence_combination__join(separator) {
		// console.trace(this);
		var converted_list = this.converting();
		if (separator || separator === '')
			return converted_list.join(separator);

		for (var index = 0; index < converted_list.length;) {
			var converted = converted_list[index];
			// console.trace([ index, converted ]);
			if (!converted
			// 要处理首字母大小写转换，所以不直接跳出。
			// || PATTERN_no_need_to_append_tail_space.test(converted)
			) {
				++index;
				continue;
			}

			var next_sentence, original_index = index, must_lower_case = /[,;、，；]\s*$/
					.test(converted) ? true
					: /[.?!。？！]\s*$/.test(converted) ? false : undefined;
			while (++index < converted_list.length) {
				next_sentence = converted_list[index];
				// console.trace([ converted, next_sentence, must_lower_case ]);
				// 处理首字母大小写转换。
				if (next_sentence && typeof must_lower_case === 'boolean') {
					var leading_spaces = next_sentence.match(/^\s+/);
					if (leading_spaces) {
						leading_spaces = leading_spaces[0];
						next_sentence = next_sentence
								.slice(leading_spaces.length);
					}
					var first_char = next_sentence.charAt(0);
					if (must_lower_case
							^ (first_char === first_char.toLowerCase())) {
						next_sentence = (must_lower_case ? first_char
								.toLowerCase() : first_char.toUpperCase())
								+ next_sentence.slice(1);
					}
					if (leading_spaces) {
						next_sentence = leading_spaces + next_sentence;
					}
					converted_list[index] = next_sentence;
				}

				// 增加子句间的空格。
				// 找出下一个（非空内容的）文字，检查是否该在本token(converted_list[original_index])结尾加上空白字元。
				if (next_sentence || next_sentence === 0) {
					if (!PATTERN_no_need_to_append_tail_space.test(converted)
					//
					&& !PATTERN_no_need_to_add_header_space.test(next_sentence)) {
						converted_list[original_index] += ' ';
					}
					break;
				}
			}
			// console.trace([ index, converted_list[index] ]);
		}

		converted_list = converted_list.join('');
		// TODO: upper-case the first char
		return converted_list;
	}

	// https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Object/create
	Sentence_combination.prototype
	// 继承一个父类别
	= Object.assign(Object.create(Array.prototype), {
		// 重新指定建构式
		constructor : Sentence_combination,
		converting : Sentence_combination__converting,
		join : Sentence_combination__join,
		toString : Sentence_combination__join
	});

	/**
	 * @example<code>

	messages = new gettext.Sentence_combination();
	messages.push(message, [ message ], [ message, arg_1, arg_2 ]);
	messages.toString();

	</code>
	 */
	gettext.Sentence_combination = Sentence_combination;

	function append_message_tail_space(text, options) {
		if (!options || typeof options === 'string' || !options.no_more_convert) {
			// Treat `options` as an argument to gettext.
			text = gettext.apply(null, arguments);
		}
		if (!text || PATTERN_no_need_to_append_tail_space.test(text)) {
			return text;
		}

		var next_sentence = options && options.next_sentence;
		return next_sentence
				&& !PATTERN_no_need_to_add_header_space.test(next_sentence)
				|| next_sentence === 0 ? text + ' ' : text;
	}

	gettext.append_message_tail_space = append_message_tail_space;

	// ------------------------------------------------------------------------

	// 不改变预设domain，直接取得特定domain的转换过的文字。
	// 警告：需要确保系统相应 domain resources 已载入并设定好。
	gettext.in_domain = function(domain_name, text_id) {
		var options = typeof domain_name === 'object' ? domain_name
		//
		: typeof domain_name === 'string' ? {
			domain_name : gettext.to_standard(domain_name)
		} : {
			domain : domain_name
		};

		if (false && Array.isArray(text_id)) {
			return gettext.apply(options, text_id);
		}

		if (arguments.length <= 2) {
			// 没有多余的参数设定(e.g., %1, %2)。
			return gettext.call(options, text_id);
		}

		var value_list = Array.prototype.slice.call(arguments);
		value_list.shift();
		return gettext.apply(options, value_list);
	};

	/**
	 * 检查指定资源是否已载入，若已完成，则执行 callback 序列。
	 * 
	 * @param {String}[domain_name]
	 *            设定当前使用之 domain name。
	 * @param {Integer}[type]
	 *            欲设定已载入/未载入之资源类型。
	 * @param {Boolean}[is_loaded]
	 *            设定/登记是否尚未载入之资源类型。
	 * @returns {Boolean} 此 type 是否已 loaded。
	 */
	function gettext_check_resources(domain_name, type, is_loaded) {
		if (!domain_name)
			domain_name = gettext_domain_name;

		var domain = gettext_resource[domain_name];
		if (!domain)
			gettext_resource[domain_name] = domain = Object.create(null);

		if (type)
			if (type = [ , 'system', 'user' ][type]) {
				if (typeof is_loaded === 'boolean') {
					library_namespace.debug('登记 [' + domain_name + '] 已经载入资源 ['
							+ type + ']。', 2, 'gettext_check_resources');
					domain[type] = is_loaded;
				}
			} else
				type = null;

		return type ? domain[type] : domain;
	}

	/**
	 * 当设定 conversion 为 Array 时，将预设采用此 function。<br />
	 * 可用在单数复数形式 (plural) 之表示上。
	 * 
	 * @param {Integer}amount
	 *            数量。
	 * @param {Array}conversion
	 *            用来转换的 Array。
	 * @param {String}name
	 *            format name。
	 * 
	 * @returns {String} 转换过的文字/句子。
	 */
	function gettext_conversion_Array(amount, conversion_Array, name) {
		var text,
		// index used.
		// TODO: check if amount < 0 or amount is not integer.
		index = amount < conversion_Array.length ? parseInt(amount)
				: conversion_Array.length - 1;

		if (index < 0) {
			library_namespace.debug({
				T : [ 'Negative index: %1', index ]
			});
			index = 1;
		} else
			while (index >= 0 && !(text = conversion_Array[index]))
				index--;

		if (!text || typeof text !== 'string') {
			library_namespace.warn({
				T : [ 'Nothing matched for amount [%1]', amount ]
			});
			return;
		}

		if (name)
			text = text.replace(/%n/g, name);

		return text.replace(/%d/g, amount);
	}

	/**
	 * 设定如何载入指定 domain resources，如语系档。
	 * 
	 * @param {String|Function}path
	 *            (String) prefix of path to load.<br />
	 *            function(domain){return path to load;}
	 */
	gettext.use_domain_location = function(path) {
		if (typeof path === 'string') {
			gettext_domain_location = path;
			// 重设 user domain resources path。
			gettext_check_resources('', 2, false);
		}
		return gettext_domain_location;
	};
	/**
	 * 取得当前使用之 domain name。
	 * 
	 * @returns 当前使用之 domain name。
	 */
	gettext.get_domain_name = function() {
		return gettext_domain_name;
	};
	gettext.is_domain_name = function(domain_name) {
		return gettext_domain_name === gettext.to_standard(domain_name);
	};

	// force: 若 domain name 已经载入过，则再度载入。
	function load_domain(domain_name, callback, force) {
		var do_not_register = domain_name === plural_rules__domain_name;
		if (!domain_name || !do_not_register
				&& !(domain_name = gettext.to_standard(domain_name))) {
			// using the default domain name.
			domain_name = gettext.default_domain;
		}

		if (!domain_name || domain_name === gettext_domain_name && !force) {
			typeof callback === 'function' && callback(domain_name);
			return;
		}

		if (!(domain_name in gettext_texts) && !!do_not_register) {
			// initialization
			gettext_texts[domain_name] = Object.create(null);
		}

		var need_to_load = [];
		// TODO: use <a href="http://en.wikipedia.org/wiki/JSONP"
		// accessdate="2012/9/14 23:50">JSONP</a>
		if (!gettext_check_resources(domain_name, 1)) {
			library_namespace.debug('准备载入系统相应 domain resources。', 2, 'gettext');
			need_to_load.push(library_namespace.get_module_path(module_name,
			// resources/
			CeL.env.resources_directory_name + '/' + domain_name + '.js'),
			//
			function() {
				if (do_not_register)
					return;
				library_namespace.debug('Resources of module included.', 2,
						'gettext');
				gettext_check_resources(domain_name, 1, true);
			});
		}

		if (typeof gettext_domain_location === 'function') {
			gettext_domain_location = gettext_domain_location();
		}

		if (typeof gettext_domain_location === 'string'
		//
		&& !gettext_check_resources(domain_name, 2)) {
			library_namespace.debug('准备载入 user 指定 domain resources，如语系档。', 2,
					'gettext');
			need_to_load.push(typeof gettext_domain_location === 'string'
			// 因 same-origin policy，采 .js 而非其他 file type 如 .json。
			? gettext_domain_location + domain_name + '.js'
					: gettext_domain_location(domain_name), function() {
				library_namespace.debug('User-defined resources included.', 2,
						'gettext');
				gettext_check_resources(domain_name, 2, true);
			});
		}

		if (need_to_load.length > 0) {
			// console.trace(need_to_load);
			library_namespace.debug('need_to_load: ' + need_to_load, 2,
					'load_domain');
			library_namespace.run(need_to_load, typeof callback === 'function'
					&& function() {
						library_namespace.debug('Running callback...', 2,
								'gettext');
						callback(domain_name);
					});
		} else {
			library_namespace.debug('Nothing to load.');
			gettext_check_resources(domain_name, 2, true);
		}
	}

	gettext.load_domain = load_domain;

	/**
	 * 取得/设定当前使用之 domain。
	 * 
	 * @example<code>

	// for i18n: define gettext() user domain resources path / location.
	// gettext() will auto load (CeL.env.domain_location + language + '.js').
	// e.g., resources/cmn-Hant-TW.js, resources/ja-JP.js
	CeL.gettext.use_domain_location(module.filename.replace(/[^\\\/]*$/,
			'resources' + CeL.env.path_separator));

	CeL.gettext.use_domain('GUESS', true);

	</code>
	 * 
	 * @param {String}[domain_name]
	 *            设定当前使用之 domain name。
	 * @param {Function}[callback]
	 *            回拨函式。 callback(domain_name)
	 * @param {Boolean}[force]
	 *            强制载入 flag。即使尚未载入此 domain，亦设定之并自动载入。但是若 domain name
	 *            已经载入过，则不会再度载入。
	 * 
	 * @returns {Object}当前使用之 domain。
	 */
	function use_domain(domain_name, callback, force) {
		if (typeof callback === 'boolean' && force === undefined) {
			// shift 掉 callback。
			force = callback;
			callback = undefined;
		}

		if (domain_name === 'GUESS') {
			domain_name = guess_language();
		}

		if (!domain_name) {
			domain_name = gettext_texts[gettext_domain_name];
			typeof callback === 'function' && callback(domain_name);
			// return domain used now.
			return domain_name;
		}

		// 查验 domain_name 是否已载入。
		var is_loaded = domain_name in gettext_texts;
		if (!is_loaded) {
			is_loaded = gettext.to_standard(domain_name);
			if (is_loaded) {
				is_loaded = (domain_name = is_loaded) in gettext_texts;
			}
		}

		if (is_loaded) {
			gettext_domain_name = domain_name;
			library_namespace.debug({
				// gettext_config:{"id":"$1-is-loaded-setting-up-user-domain-resources-now"}
				T : [ '已载入过 [%1]，直接设定使用者自订资源。', domain_name ]
			}, 2, 'gettext.use_domain');
			gettext_check_resources(domain_name, 2, true);
			typeof callback === 'function' && callback(domain_name);

		} else if (force && domain_name) {
			if (library_namespace.is_WWW()
					&& library_namespace.is_included('interact.DOM')) {
				// 显示使用 domain name 之讯息：此时执行，仍无法改采新 domain 显示讯息。
				library_namespace.debug({
					T : [ domain_name === gettext_domain_name
					// gettext_config:{"id":"force-loading-using-domain-locale-$2-($1)"}
					? '强制再次载入/使用 [%2] (%1) 领域/语系。'
					// gettext_config:{"id":"loading-using-domain-locale-$2-($1)"}
					: '载入/使用 [%2] (%1) 领域/语系。', domain_name,
							gettext.get_alias(domain_name) ]
				}, 1, 'gettext.use_domain');
			} else {
				library_namespace.debug(
				// re-load
				(domain_name === gettext_domain_name ? 'FORCE ' : '')
						+ 'Loading/Using domain/locale ['
						+ gettext.get_alias(domain_name) + '] (' + domain_name
						+ ').', 1, 'gettext.use_domain');
			}

			if (!(domain_name in gettext_texts)) {
				// 为确保回传的是最终的domain，先初始化。
				gettext_texts[domain_name] = Object.create(null);
			}

			load_domain(domain_name, function() {
				gettext_domain_name = domain_name;
				typeof callback === 'function' && callback(domain_name);
			});

		} else {
			if (domain_name) {
				if (domain_name !== gettext_domain_name)
					library_namespace.warn({
						// gettext_config:{"id":"specified-domain-$1-is-not-yet-loaded.-you-may-need-to-set-the-force-flag"}
						T : [ '所指定之 domain [%1] 尚未载入，若有必要请使用强制载入 flag。',
								domain_name ]
					});

			} else if (typeof callback === 'function'
					&& library_namespace.is_debug())
				// gettext_config:{"id":"unable-to-distinguish-domain-but-set-callback"}
				library_namespace.warn('无法判别 domain，却设定有 callback。');

			// 无论如何还是执行 callback。
			typeof callback === 'function' && callback(domain_name);
		}

		return gettext_texts[domain_name];
	}

	// using_domain
	gettext.use_domain = use_domain;

	function guess_language() {

		if (library_namespace.is_WWW()) {
			// http://stackoverflow.com/questions/1043339/javascript-for-detecting-browser-language-preference
			return gettext.to_standard(navigator.userLanguage
					|| navigator.language
					// || navigator.languages && navigator.languages[0]
					// IE 11
					|| navigator.browserLanguage || navigator.systemLanguage);
		}

		function exec(command, PATTERN, mapping) {
			try {
				// @see https://gist.github.com/kaizhu256/a4568cb7dac2912fc5ed
				// synchronously run system command in nodejs <= 0.10.x
				// https://github.com/gvarsanyi/sync-exec/blob/master/js/sync-exec.js
				// if (!require('child_process').execSync) { return; }

				var code = require('child_process').execSync(command, {
					stdio : 'pipe'
				}).toString();
				// console.trace([ command, code ]);
				if (PATTERN)
					code = code.match(PATTERN)[1];
				if (mapping)
					code = mapping[code];
				return gettext.to_standard(code);
			} catch (e) {
				// TODO: handle exception
			}
		}

		// console.trace(library_namespace.platform.is_Windows());
		if (library_namespace.platform.is_Windows()) {
			// TODO:
			// `REG QUERY HKLM\System\CurrentControlSet\Control\Nls\Language /v
			// InstallLanguage`

			// https://www.lisenet.com/2014/get-windows-system-information-via-wmi-command-line-wmic/
			// TODO: `wmic OS get Caption,CSDVersion,OSArchitecture,Version`
			// require('os').release()

			return exec(
					// https://docs.microsoft.com/zh-tw/powershell/module/international/get-winsystemlocale?view=win10-ps
					'PowerShell.exe -Command "& {Get-WinSystemLocale | Select-Object LCID}"',
					/(\d+)[^\d]*$/, guess_language.LCID_mapping)
					// WMIC is deprecated.
					// https://stackoverflow.com/questions/1610337/how-can-i-find-the-current-windows-language-from-cmd
					// get 非 Unicode 应用程式的语言与系统地区设定所定义的语言
					|| exec('WMIC.EXE OS GET CodeSet', /(\d+)[^\d]*$/,
							guess_language.code_page_mapping)
					// using windows active console code page
					// https://docs.microsoft.com/en-us/windows/console/console-code-pages
					// CHCP may get 65001, so we do not use this at first.
					|| exec('CHCP', /(\d+)[^\d]*$/,
							guess_language.code_page_mapping);
		}

		/**
		 * <code>

		@see https://www.itread01.com/content/1546711411.html

		TODO: detect process.env.TZ: node.js 设定测试环境使用

		GreenWich时间
		process.env.TZ = 'Europe/London';

		timezone = {
			'Europe/London' : 0,
			'Asia/Shanghai' : -8,
			'America/New_York' : 5
		};

		</code>
		 */

		var LANG = library_namespace.env.LANG;
		// e.g., LANG=zh_TW.Big5
		// en_US.UTF-8
		if (LANG)
			return gettext.to_standard(LANG);

		return exec('locale', /(?:^|\n)LANG=([^\n]+)/);
	}

	// https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/chcp
	guess_language.code_page_mapping = {
		437 : 'en-US',
		866 : 'ru-RU',
		932 : 'ja-JP',
		936 : 'cmn-Hans-CN',
		949 : 'ko-KR',
		950 : 'cmn-Hant-TW',
		1256 : 'arb-Arab',
		54936 : 'cmn-Hans-CN'
	// 65001: 'Unicode'
	};

	// https://zh.wikipedia.org/wiki/区域设置#列表
	guess_language.LCID_mapping = {
		1028 : 'cmn-Hant-TW',
		1033 : 'en-US',
		1041 : 'ja-JP',
		1042 : 'ko-KR',
		1049 : 'ru-RU',
		2052 : 'cmn-Hans-CN',
		2057 : 'en-GB',
		3076 : 'cmn-Hant-HK',
		14337 : 'arb-Arab'
	};

	gettext.guess_language = guess_language;

	/**
	 * 设定欲转换的文字格式。
	 * 
	 * @param {Object}text_Object
	 *            文字格式。 {<br />
	 *            text id : text for this domain }<br />
	 *            函数以回传文字格式。 {<br />
	 *            text id : function(domain name){ return text for this domain } }
	 * @param {String}[domain]
	 *            指定存入之 domain。
	 * @param {Boolean}[clean_and_replace]
	 *            是否直接覆盖掉原先之 domain。
	 */
	gettext.set_text = function set_text(text_Object, domain, clean_and_replace) {
		if (!library_namespace.is_Object(text_Object))
			return;

		if (!domain)
			domain = gettext_domain_name;

		// normalize domain
		if (!(domain in gettext_texts))
			domain = gettext.to_standard(domain);
		// console.trace(domain);

		if (clean_and_replace || !(domain in gettext_texts)) {
			gettext_texts[domain] = text_Object;
		} else {
			// specify a new domain.
			// gettext_texts[domain] = Object.create(null);

			// CeL.set_method() 不覆盖原有的设定。
			// library_namespace.set_method(gettext_texts[domain], text_Object);

			// 覆盖原有的设定。
			Object.assign(gettext_texts[domain], text_Object);
		}
	};

	// ------------------------------------

	/**
	 * 取得 domain 别名。 若欲取得某个语言在其他语言中的名称，应该设定好i18n，并以gettext()取得。
	 * 
	 * @param {String}[language]
	 *            指定之正规名称。
	 * @returns {String} 主要使用之别名。
	 * @returns {Object} { 正规名称 : 别名 }
	 */
	gettext.get_alias = function(language) {
		return arguments.length > 0 ? gettext_main_alias[language in gettext_main_alias ? language
				: gettext.to_standard(language)]
				: gettext_main_alias;
	};

	/**
	 * 设定 domain 别名。<br />
	 * 本函数会改变 {Object}list!
	 * 
	 * @param {Object}list
	 *            full alias list / 别名。 = {<br />
	 *            norm/criterion (IANA language tag) : [<br />
	 *            主要别名放在首个 (e.g., 当地使用之语言名称),<br />
	 *            最常用之 language tag (e.g., IETF language tag),<br />
	 *            其他别名 / other aliases ] }
	 */
	gettext.set_alias = function(list) {
		if (!library_namespace.is_Object(list))
			return;

		/** {String}normalized domain name */
		var norm;
		/** {String}domain alias */
		var alias;
		/** {Array}domain alias list */
		var alias_list, i, l;
		for (norm in list) {
			alias_list = list[norm];
			if (typeof alias_list === 'string') {
				alias_list = alias_list.split('|');
			} else if (!Array.isArray(alias_list)) {
				library_namespace.warn([ 'gettext.set_alias: ', {
					// gettext_config:{"id":"illegal-domain-alias-list-$1"}
					T : [ 'Illegal domain alias list: [%1]', alias_list ]
				} ]);
				continue;
			}

			// 加入 norm 本身。
			alias_list.push(norm);

			for (i = 0, l = alias_list.length; i < l; i++) {
				alias = alias_list[i];
				if (!alias) {
					continue;
				}

				library_namespace.debug({
					// gettext_config:{"id":"adding-domain-alias-$1-→-$2"}
					T : [ 'Adding domain alias [%1] → [%2]...',
					//
					alias, norm ]
				}, 2, 'gettext.set_alias');
				if (!(norm in gettext_main_alias))
					gettext_main_alias[norm] = alias;

				// 正规化: 不分大小写, _ → -
				alias = alias.replace(/_/g, '-').toLowerCase();
				alias.split(/-/).forEach(function(token) {
					if (!gettext_aliases[token])
						gettext_aliases[token] = [];
					if (!gettext_aliases[token].includes(norm))
						gettext_aliases[token].push(norm);
				});
				continue;

				// for fallback
				while (true) {
					gettext_aliases[alias] = norm;

					var index = alias.lastIndexOf('-');
					if (index < 1)
						break;
					alias = alias.slice(0, index);
				}
			}
		}
	};

	/**
	 * 将 domain 别名正规化，转为正规/标准名称。<br />
	 * to a standard form. normalize_domain_name().
	 * 
	 * TODO: fix CeL.gettext.to_standard('cmn-CN') ===
	 * CeL.gettext.to_standard('zh-CN')
	 * 
	 * @param {String}alias
	 *            指定之别名。
	 * @param {Object}[options]
	 *            附加参数/设定选择性/特殊功能与选项
	 * 
	 * @returns {String} 正规名称。
	 * @returns undefined : can't found.
	 */
	gettext.to_standard = function to_standard(alias, options) {
		if (typeof alias !== 'string')
			return;

		if (options === true) {
			options = {
				get_list : true
			};
		} else {
			options = library_namespace.setup_options(options);
		}

		// 正规化: 不分大小写, _ → -
		alias = alias.replace(/_/g, '-').toLowerCase();

		var candidates;
		alias.split(/-/)
		// 通常越后面的越有特殊性。
		.reverse().some(function(token) {
			if (!gettext_aliases[token])
				return;
			// console.log(token + ': ' +
			// JSON.stringify(gettext_aliases[token]));
			if (!candidates) {
				candidates = gettext_aliases[token];
				return;
			}

			// 取交集。
			candidates = Array.intersection(candidates,
			//
			gettext_aliases[token]);
			// console.log('candidates: ' + JSON.stringify(candidates));
			if (candidates.length < 2) {
				return true;
			}
		});

		return options.get_list ? candidates ? candidates.clone() : []
				: candidates && candidates[0];

		var index;
		// for fallback
		while (true) {
			library_namespace.debug({
				// gettext_config:{"id":"testing-domain-alias-$1"}
				T : [ 'Testing domain alias [%1]...', alias ]
			}, 6, 'gettext.to_standard');
			if (alias in gettext_aliases)
				return gettext_aliases[alias];

			index = alias.lastIndexOf('-');
			if (index < 1)
				return;
			alias = alias.slice(0, index);
		}
	};

	var time_zone_of = {
		// JST
		'ja-JP' : 9,
		// CST
		'cmn-Hans-CN' : 8,
		'cmn-Hant-TW' : 8
	};

	// @see String_to_Date.zone @ CeL.data.date
	function time_zone_of_language(language) {
		return language in time_zone_of ? time_zone_of[language]
				: time_zone_of[gettext.to_standard(language)];
	}

	_.time_zone_of_language = time_zone_of_language;

	function detect_HTML_language(HTML) {
		// e.g., <html xml:lang="ja" lang="ja">
		var matched = HTML.match(/<html ([^<>]+)>/);
		if (matched
				&& (matched = matched[1]
						.match(/lang=(?:"([^"]+)"|([^\s<>]+))/i))) {
			return gettext.to_standard(matched[1] || matched[2]);
		}

		matched = HTML.match(/<meta [^<>]+?content=(?:"([^"]+)"|([^\s<>]+))/i);
		if (matched
				&& (matched = (matched[1] || matched[2])
						.match(/charset=([^;]+)/))) {
			// TODO: combine CeL.data.character
			matched = matched[1];
			matched = {
				big5 : 'cmn-Hant-TW',
				gbk : 'cmn-Hans-CN',
				gb2312 : 'cmn-Hans-CN',
				eucjp : 'ja-JP',
				shiftjis : 'ja-JP',
				sjis : 'ja-JP'
			}[matched.toLowerCase().replace(/[\s\-]/g, '')] || matched;
			return gettext.to_standard(matched);
		}

		// Can't determine what language the html used.
	}

	_.detect_HTML_language = detect_HTML_language;

	// ------------------------------------
	// DOM 操作。

	/**
	 * 翻译/转换所有指定之 nodes。<br />
	 * translate all nodes to show in specified domain.
	 * 
	 * @param {String|NodeList|Array|HTMLElement}[filter]
	 *            指定 selector || nodes || node || default domain。
	 * 
	 * @example <code>

	//	###usage 2014/2/5

	//	###runtime translate all nodes to show in specified language
	//	including: interact.DOM will auto load application.locale.
	CeL.run('interact.DOM', function() {
		//	setup domain (language)
		CeL.gettext.use_domain(language);

		//	simple way to create a text node with language tag.
		CeL.new_node({ T : message }, node);

		// handle with document.title in IE 8.
		if (CeL.set_text.need_check_title)
			CeL.gettext.document_title = 'document_title';

		// translate all nodes to show in specified language (or default domain).
		CeL.gettext.translate_nodes();
	});

	 * </code>
	 */
	gettext.translate_nodes = function(filter) {
		if (library_namespace.for_nodes) {
			gettext_DOM_id = gettext.DOM_id_key;
			library_namespace.for_nodes(gettext.translate_node, filter);
		}
	};

	gettext.translate_node = function(node) {
		var dataset,
		// message id
		id, conversion, i = 0, key;
		try {
			// 为提高效率，不作检查。
			dataset =
			// library_namespace.is_HTML_element(node) &&
			library_namespace.DOM_data && library_namespace.DOM_data(node)
					|| node.dataset;
			id =
			// dataset && dataset[gettext.DOM_id_key];
			dataset && dataset[gettext_DOM_id];

			if (!id && gettext.document_title) {
				if (node.tagName.toLowerCase() === 'title')
					// IE 8 中，除了 document.title，本工具大部分显示皆能以 translate_nodes()
					// 处理。
					// 对 IE 8，需要先设定 gettext.document_title = '~';
					id = gettext.document_title;
				// 若是不需要设定 gettext.document_title，则将之纳入 .dataset。
				if (!library_namespace.set_text.need_check_title) {
					library_namespace.DOM_data(node, gettext_DOM_id,
							gettext.document_title);
					delete gettext.document_title;
				}
			}

		} catch (e) {
			library_namespace.warn([ 'gettext.translate_node: ', {
				// gettext_config:{"id":"failed-to-extract-gettext-id"}
				T : 'Failed to extract gettext id.'
			} ]);
		}

		if (!dataset)
			return;

		var gettext_DOM_title_id = gettext_DOM_id + '_element_title';
		if (node.title && !dataset[gettext_DOM_title_id]
				&& gettext_texts[gettext_domain_name]
				&& (node.title in gettext_texts[gettext_domain_name])) {
			dataset[gettext_DOM_title_id] = node.title;
		}
		if (dataset[gettext_DOM_title_id]) {
			node.title = gettext(dataset[gettext_DOM_title_id]);
		}

		if (id) {
			conversion = [ id ];
			while ((key = gettext_DOM_id + ++i) in dataset)
				conversion.push(dataset[key]);
			if (node.on_language_changed)
				node.on_language_changed(conversion);
			else
				library_namespace.set_text(node, gettext
						.apply(node, conversion));
		} else if (node.on_language_changed) {
			// @see CeL.DOM.new_node()
			node.on_language_changed(conversion);
		}
	};
	// for DOM use.
	// <tag data-gettext="text id" data-gettext1="conversion 1"
	// data-gettext2="conversion 2" />
	gettext.DOM_id_key = gettext_DOM_id = 'gettext';
	gettext.DOM_separator = '|';

	gettext.adapt_domain = function(language, callback) {
		library_namespace.debug({
			// gettext_config:{"id":"loading-language-domain-$1"}
			T : [ 'Loading language / domain [%1]...', language ]
		}, 1, 'gettext.adapt_domain');

		gettext.use_domain(language, function() {
			library_namespace.debug({
				// gettext_config:{"id":"language-domain-$1-loaded"}
				T : [ 'Language / domain [%1] loaded.', language ]
			}, 1, 'gettext.adapt_domain');
			try {
				// 设置页面语系。
				document.getElementsByTagName('html')[0].setAttribute('lang',
						language);
			} catch (e) {
			}
			if (library_namespace.is_WWW())
				gettext.translate_nodes();
			create_domain_menu.onchange.forEach(function(handler) {
				handler(language);
			});
			typeof callback === 'function' && callback(language);
		}, true);

		// 可能用于 element 中，直接用 return gettext.adapt_domain() 即可。
		return false;
	};

	// https://en.wikipedia.org/wiki/Regional_Indicator_Symbol
	var domain_flags = {
		'arb-Arab' : '🇦🇪'
	};

	/**
	 * create domain / language menu
	 * 
	 * @param node
	 * @param domain_Array
	 */
	function create_domain_menu(node, domain_Array, onchange) {
		if (!node || !domain_Array
		//
		|| !library_namespace.new_node) {
			return;
		}

		if (false) {
			// TODO
			library_namespace.error([ 'create_domain_menu: ', {
				// gettext_config:{"id":"cannot-find-menu-node-$1"}
				T : [ 'Cannot find menu node: [%1]', node ]
			} ]);
		}

		var menu = [],
		// default domain.
		tmp = gettext.get_domain_name();

		domain_Array.forEach(function(domain) {
			domain = gettext.to_standard(domain);
			var flag;
			if (domain in domain_flags) {
				flag = domain_flags[domain];
			} else if (flag = domain && domain.match(/-([A-Z]{2})$/)) {
				// using
				// https://en.wikipedia.org/wiki/Regional_Indicator_Symbol
				// '🇦🇧🇨🇩🇪🇫🇬🇭🇮🇯🇰🇱🇲🇳🇴🇵🇶🇷🇸🇹🇺🇻🇼🇽🇾🇿'.match(/./ug)
				var delta = '🇦'.codePointAt(0) - 'A'.codePointAt(0);
				flag = String.fromCodePoint.apply(null, flag[1].chars().map(
						function(_char) {
							return delta + _char.codePointAt(0);
						}));
			} else {
				flag = '';
			}

			var option = {
				option : flag + gettext.get_alias(domain),
				value : domain
			};
			if (domain === tmp)
				option.selected = true;
			menu.push(option);
		});

		menu = {
			select : menu,
			onchange : function(e) {
				gettext.adapt_domain(library_namespace.node_value(this));
			}
		};

		if (tmp = create_domain_menu.tag) {
			menu = [
			// '🗣',
			{
				T : tmp
			}, ': ', menu ];
		}

		if (typeof onchange === 'function')
			create_domain_menu.onchange.push(onchange);
		library_namespace.new_node(menu, node);
	}

	// gettext_config:{"id":"language"}
	create_domain_menu.tag = 'Language';
	create_domain_menu.onchange = [];

	gettext.create_menu = create_domain_menu;

	// ------------------------------------
	// conversion specifications (转换规格). e.g., 各区文化特色 - 数字、货币、时间、日期格式。

	var allow_Chinese = {
		Chinese : true
	};

	function domain_name_for_conversion(domain_name, allowed) {
		if (allowed && (domain_name in allowed))
			return domain_name;
		return gettext.to_standard(domain_name || gettext_domain_name);
	}

	// 数字系统。numeral system.
	// 英文的基数
	gettext.numeral = function(attribute, domain_name) {
		domain_name = domain_name_for_conversion(domain_name, allow_Chinese);
		library_namespace.debug({
			// gettext_config:{"id":"convert-number-$1-to-$2-format"}
			T : [ '转换数字：[%1]成 %2 格式。', attribute, domain_name ]
		}, 6);
		switch (domain_name) {
		case 'Chinese':
			return to_Chinese_numeral(attribute);

		case 'en-US':
			return library_namespace.to_English_numeral(attribute);

			// 一般民间使用，相较于中文数字，更常使用阿拉伯数字。
		case 'cmn-Hant-TW':

			// TODO: others

		default:
			return attribute;
		}
	};

	/**
	 * 小数点, radix point, decimal point, decimal mark, decimal separator, 小数点の记号.
	 * 
	 * @param {String}[domain_name]
	 *            设定当前使用之 domain name。
	 * 
	 * @returns {String} 指定/当前 domain 使用之小数点。
	 * 
	 * @see <a href="http://en.wikipedia.org/wiki/Decimal_mark"
	 *      accessdate="2012/9/22 10:7">Decimal mark</a>
	 */
	gettext.numeral.decimal_mark = function(domain_name) {
		domain_name = domain_name_for_conversion(domain_name);
		switch (domain_name) {
		case 'cmn-Hant-TW':
			// return '点';

			// TODO: others

		default:
			return '.';
		}
	};
	/**
	 * thousands separator, 千位分隔符, 桁区切りの记号.
	 * 
	 * @param {String}[domain_name]
	 *            设定当前使用之 domain name。
	 * 
	 * @returns {String} 指定/当前 domain 使用之 thousands separator。
	 * 
	 * @see <a href="http://en.wikipedia.org/wiki/Decimal_mark"
	 *      accessdate="2012/9/22 10:7">Decimal mark</a>
	 */
	gettext.numeral.thousands_separator = function(domain_name) {
		domain_name = domain_name_for_conversion(domain_name);
		switch (domain_name) {
		case 'cmn-Hant-TW':
			// return '';

			// TODO: others

		default:
			return ',';
		}
	};

	// 英文的序数
	// https://en.wikipedia.org/wiki/Ordinal_number_%28linguistics%29
	var English_ordinal_suffixes = [ 'th', 'st', 'nd', 'rd' ];

	if (false) {
		CeL.gettext('The %o1 year', 21);
	}
	gettext.ordinal = function(attribute, domain_name) {
		domain_name = domain_name_for_conversion(domain_name, allow_Chinese);
		switch (domain_name) {
		case 'Chinese':
			return '第' + gettext.numeral(attribute, domain_name);

			// TODO: others

		default:
			var ordinal = attribute | 0;
			if (ordinal !== attribute || ordinal < 1)
				return attribute;
			if (3 < attribute && attribute < 21) {
				ordinal = English_ordinal_suffixes[0];
			} else {
				ordinal = English_ordinal_suffixes[ordinal % 10]
				//
				|| English_ordinal_suffixes[0];
			}
			return attribute + ordinal;
		}
	};

	// 货币, 通货.
	gettext.currency = function(attribute, domain_name) {
		domain_name = domain_name_for_conversion(domain_name);
		switch (domain_name) {
		case 'cmn-Hant-TW':
			// data.numeral.to_TWD()
			return library_namespace.to_TWD(attribute);

		case 'en-US':
			// try: '-34235678908765456789098765423545.34678908765'
			var add_comma = function(v) {
				// 使用
				// return v.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
				// 可能会比较快，但小数也被置换了。
				return v.replace(/(\d+)(\d{3}(?:[.,]|$))/,
				//
				function($0, $1, $2) {
					return add_comma($1) + ',' + $2;
				});
			};
			return add_comma('US$' + attribute);

			// TODO: others

		default:
			return attribute;
		}
	};

	// ------------------------------------

	// 工具函数。

	// https://commons.wikimedia.org/wiki/Module:I18n/complex_date

	function year_name(ordinal, domain_name) {
		domain_name = domain_name_for_conversion(domain_name, allow_Chinese);
		switch (domain_name) {
		case 'Chinese':
			// number to Chinese year name.
			if (ordinal == 1) {
				// 一年 → 元年
				return '元';
			}

			var prefix = '';
			if (ordinal < 0) {
				prefix = '前';
				ordinal = -ordinal;
			}
			return prefix
			//
			+ (ordinal > 99 ? to_positional_Chinese_numeral(ordinal)
			//
			: to_Chinese_numeral(ordinal));

		default:
			return ordinal;
		}
	}

	function month_name(ordinal, domain_name) {
		domain_name = domain_name_for_conversion(domain_name, allow_Chinese);
		switch (domain_name) {
		case 'Chinese':
			// number to Chinese month name.
			// TODO: 冬月, 腊月.
			return typeof ordinal === 'string'
			//
			? ordinal.replace(/\d+/, function($0) {
				return Chinese_month_name[$0];
			}) : Chinese_month_name[ordinal]
					|| to_positional_Chinese_numeral(ordinal);

		case 'en-US':
			// ordinal: 1–12
			return month_name[domain_name][ordinal];

		default:
			return ordinal;
		}
	}

	function date_name(ordinal, domain_name) {
		domain_name = domain_name_for_conversion(domain_name, allow_Chinese);
		switch (domain_name) {
		case 'Chinese':
			// number to Chinese date name.
			return Chinese_date_name[ordinal]
					|| to_positional_Chinese_numeral(ordinal);

		default:
			return ordinal;
		}
	}

	var is_Date = library_namespace.is_Date,
	// 中文月名: Chinese_month_name[1]=正
	Chinese_month_name = [ '', '正' ],
	// 中文日名: Chinese_date_name[1]=初一
	Chinese_date_name = [ '' ];

	// 初一, 初二, ..初十,十一..十九,二十,廿一,廿九,三十
	(function() {
		var i = 2, date_name;
		while (i <= 12)
			Chinese_month_name.push(to_Chinese_numeral(i++));
		// 一般还是以"十一月"称冬月。
		// Chinese_month_name[11] = '冬';
		// Chinese_month_name[12] = '腊';

		for (i = 1; i <= 30;) {
			date_name = to_Chinese_numeral(i++);
			if (date_name.length < 2)
				date_name = '初' + date_name;
			else if (date_name.length > 2)
				date_name = date_name.replace(/二十/, '廿');
			Chinese_date_name.push(date_name);
		}
	})();

	Object
			.assign(
					month_name,
					{
						'en-US' : ',January,February,March,April,May,June,July,August,September,October,November,December'
								.split(','),
						Chinese : Chinese_month_name
					});

	function week_name(ordinal, domain_name, full_name) {
		// assert: ordinal: 0–6
		domain_name = domain_name_for_conversion(domain_name);
		switch (domain_name) {
		case 'cmn-Hant-TW':
		case 'cmn-Hans-CN':
			// number to Chinese week name.
			// 星期/周/礼拜
			// gettext_config:{"id":"week-day"}
			return (full_name ? '星期' : '') + week_name.cmn[ordinal];

		case 'ja-JP':
			// gettext_config:{"id":"week-day-(japanese)"}
			return week_name[domain_name][ordinal] + (full_name ? '曜日' : '');

		case 'en-US':
			var full_week_name = week_name[domain_name][ordinal];
			return full_name ? full_week_name : full_week_name.slice(0, 3);

		default:
			// unknown domain
			return ordinal;
		}
	}

	// CeL.gettext.date.week[*]
	Object.assign(week_name, {
		'en-US' : 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday'
				.split(','),
		'ja-JP' : '日月火水木金土'.split(''),
		'cmn' : '日一二三四五六'.split('')
	});

	// 日期, 用于 strftime.default_conversion @ CeL.data.date
	// or: CeL.gettext('%d1', new Date())
	gettext.date = function(date, domain_name) {
		domain_name = domain_name_for_conversion(domain_name);
		if (date && !is_Date(date) && date.to_Date)
			date = date.to_Date(domain_name);

		if (!date || !date.format)
			// warning
			return date;

		switch (domain_name) {
		case 'cmn-Hant-TW':
			// 中文日期
			return date.format('%Y年%m月%d日', {
				locale : domain_name
			});
			// 19世纪80年代, 20世纪60年代

		default:
			return date;
		}
	};

	// CeL.set_method() 不覆盖原有的设定。
	library_namespace.set_method(gettext.date, {
		year : year_name,
		month : month_name,
		date : date_name,
		week : week_name,
		full_week : function full_week_name(ordinal, domain_name) {
			return week_name(ordinal, domain_name, true);
		}
	});

	// 时间
	gettext.time = function(date, domain_name) {
		domain_name = domain_name_for_conversion(domain_name);
		if (date && !is_Date(date) && date.to_Date)
			date = date.to_Date(domain_name);

		if (!date || !date.format)
			// warning
			return date;

		switch (domain_name) {
		case 'cmn-Hant-TW':
			// 中文时间
			return date.format('%H时%M分%S秒', {
				locale : domain_name
			});

		default:
			return date;
		}
	};

	// 日期+时间
	gettext.datetime = function(date, domain_name) {
		domain_name = domain_name_for_conversion(domain_name);
		if (date && !is_Date(date) && date.to_Date)
			date = date.to_Date(domain_name);

		if (!date || !date.format)
			// warning
			return date;

		switch (domain_name) {
		case 'cmn-Hant-TW':
			// 中文日期+时间
			return date.format('%Y年%m月%d日 %H时%M分%S秒', {
				locale : domain_name
			});

		default:
			return date;
		}
	};

	// ------------------------------------

	// { format : function }
	gettext.conversion = {
		// 中文数字 (Chinese numerals)
		数 : function(number) {
			return to_Chinese_numeral(number);
		},
		// 大陆简体中文数字。
		数 : function(number, locale) {
			return locale === 'ja-JP' ? library_namespace
					.to_Japanese_numeral(number)
			//
			: to_Chinese_numeral(number).replace(/万/, '万');
		},
		// 日本语の汉数字。
		汉数 : library_namespace.to_Japanese_numeral,

		// 加成。e.g., 打六折、二成、二成七。
		成 : function(number) {
			number = to_Chinese_numeral((10 * number).to_fixed(1));
			if (number.includes('点'))
				number = number.replace(/点/, '成');
			else
				number += '成';
			return number;
		},
		// e.g., 日本语 (Japanese): 2割5分
		// http://forum.wordreference.com/showthread.php?t=1292655
		// 1割: one tenth, 3割: three tenths
		// TODO: 割引: 5分引く (5% off), 1割引く (10% off), 1%割引
		割 : function(number) {
			number = to_Chinese_numeral((10 * number).to_fixed(1));
			if (number.includes('点'))
				number = number.replace(/点/, '割') + '分';
			else
				number += '割';
			return number;
		},
		// 打折扣/discount。e.g., 打六折、打七二折、30% off（30﹪折扣，70% on sale）。
		// https://zh.wikipedia.org/wiki/%E6%8A%98%E6%89%A3
		// "% off" may use "⁒ off" 'COMMERCIAL MINUS SIGN' (U+2052).
		// commercial minus sign is used in commercial or tax related forms or
		// publications in several European countries, including Germany and
		// Scandinavia.
		折 : function(number) {
			number = (100 * number).to_fixed(0);
			// check
			if (number !== (number | 0)
			//
			|| number < 10 || 99 < number) {
				// gettext_config:{"id":"unable-to-convert-number-$1"}
				throw gettext('无法转换数字 [%1]！', number);
			}
			number = to_positional_Chinese_numeral(number)
					.replace(/(.)〇/, '$1');
			return number + '折';
		},

		// 基准利率 1码 = 0.25% = 1 / 400，码翻译自 quarter。
		码 : function(number) {
			return (400 * number) + '码';
		},

		// https://en.wikipedia.org/wiki/Parts-per_notation
		// percentage (%), 百分比, ％（全形百分号）
		'％' : function(number) {
			return (100 * number).to_fixed() + '%';
		},
		// permille (‰), 千分率
		'‰' : function(number) {
			return (1000 * number).to_fixed() + '‰';
		},
		// permyriad (‱) (Basis point), 万分率
		'‱' : function(number) {
			return (10000 * number).to_fixed() + '‱';
		},
		// ppm (parts-per-million, 10–6), ppb (parts-per-billion, 10–9),
		// ppt (parts-per-trillion, 10–12), ppq (parts-per-quadrillion, 10–15).

		// CeL.gettext('%d1', new Date())
		d : gettext.date,
		// CeL.gettext('%t1', new Date())
		t : gettext.time,
		// CeL.gettext('%T1', new Date())
		T : gettext.datetime,
		n : gettext.numeral,
		o : gettext.ordinal,
		// CeL.gettext('%c1', 1000000)
		c : gettext.currency
	};

	// ------------------------------------
	// initialization

	var gettext_DOM_id, gettext_main_alias = Object.create(null), gettext_aliases = {
	// MUST in lower case. @see gettext.to_standard
	// hans : ['cmn-Hans-CN'],
	// hant : ['cmn-Hant-TW']
	}
			&& Object.create(null),
	/**
	 * {Object}All domain data.<br />
	 * gettext_texts[domain name] = {"message":"l10n message"}
	 */
	gettext_texts = Object.create(null),
	/** {String}domain name used now */
	gettext_domain_name,
	// CeL.env.domain_location = CeL.env.resources_directory_name + '/';
	// CeL.gettext.use_domain_location(CeL.env.resources_directory_name + '/');
	gettext_domain_location = library_namespace.env.domain_location, gettext_resource = Object
			.create(null);

	// TODO: lazy evaluation

	// https://cloud.google.com/speech-to-text/docs/languages?hl=zh-tw
	// http://www.iana.org/assignments/language-subtag-registry/language-subtag-registry

	// http://www.rfc-editor.org/rfc/bcp/bcp47.txt

	// http://www.w3.org/International/articles/bcp47/

	// http://suika.fam.cx/~wakaba/wiki/sw/n/BCP%2047

	// http://www.iana.org/protocols
	// http://www.iana.org/assignments/language-subtag-registry/language-subtag-registry
	// http://www.iana.org/assignments/language-tag-extensions-registry

	// http://www-01.sil.org/iso639-3/documentation.asp?id=cmn
	// http://www.ethnologue.com/language/cmn

	// http://schneegans.de/lv/

	// https://github.com/unicode-cldr/cldr-localenames-modern
	gettext.default_domain = {
		/**
		 * 最推荐之标准 language tag : '主要别名 (e.g., 当地使用之语言名称)|最常用之 language tag
		 * (e.g., IETF language tag)|其他别名 / other aliases (e.g., 英文名称, 最细分之标准
		 * language tag)'
		 */

		// ar-AE: 阿拉伯文 (阿拉伯联合大公国)
		// ar-SA: 阿拉伯文 (沙乌地阿拉伯)
		'arb-Arab' : 'العربية|ar|Arabic|阿拉伯语|ar-arb-Arab|ar-AE|ar-SA',

		// 现代标准汉语
		'cmn-Hant-TW' : '繁体中文|zh-TW|繁体|zh-cmn-Hant-TW|TW|Hant|Chinese|传统中文|正体中文|正体|汉语|华语|中文|中国|台湾|台湾|官话|中华民国国语|Traditional Chinese',

		// Subtag: cmn, Preferred-Value: cmn
		'cmn-Hans-CN' : '简体中文|zh-CN|简体|zh-cmn-Hans-CN|CN|Hans|Chinese|简化字|简化中文|简化字|简体中文|普通话|中国|中国大陆|官话|Simplified Chinese|Mandarin Chinese',

		'cmn-Hant-HK' : '香港普通话|zh-yue-Hant-HK|Cantonese|香港华语|香港官话',

		// Min Nan Chinese. Macrolanguage: zh.
		// zh-min-nan:
		// http://taigi-pahkho.wikia.com/wiki/%E9%A0%AD%E9%A0%81
		// using 台湾闽南语推荐用字
		'nan-Hant-TW' :
		//
		'台湾闽南语|min-nan-Hant-TW|Taiwanese|zh-min-nan|zh-min-nan-Hant-TW|台语|台语|台湾话|台湾话|闽南语|河洛话|福老话',

		// 粤语审音配词字库 http://humanum.arts.cuhk.edu.hk/Lexis/lexi-can/
		'yue-Hant-HK' : '香港粤语|zh-yue-Hant-HK|Hong Kong Cantonese|港式粤语|香港话|港式广东话|港式广州话',

		// 前面的会覆盖后来的，前面的优先度较高。
		'en-US' : 'English|en-US|英语|en-eng-Latn-US|en-Latn-US|eng-Latn-US|US|USA|United States|美语|美国英语|美式英语',

		/**
		 * Subtag: en, Suppress-Script: Latn
		 * 
		 * "zh-Hant" and "zh-Hans" represent Chinese written in Traditional and
		 * Simplified scripts respectively, while the language subtag "en" has a
		 * "Suppress-Script" field in the registry indicating that most English
		 * texts are written in the Latin script, discouraging a tag such as
		 * "en-Latn-US".
		 * 
		 * @see https://www.w3.org/International/articles/bcp47/
		 */
		'en-GB' : 'British English|en-GB|英国英语|en-eng-Latn-GB|en-Latn-GB|eng-Latn-GB|en-UK|Great Britain|United Kingdom|英式英语',

		// Subtag: ja, Suppress-Script: Jpan
		'ja-JP' : '日本语|ja-JP|Japanese|日语|日文|国语|日本|JP|ja-jpn-Jpan-JP|ja-Jpan-JP|jpn-Jpan-JP',

		// Subtag: ko, Suppress-Script: Kore
		'ko-KR' : '한국어|ko-KR|Korean|韩国语|조선어|朝鲜语|조선말|고려말|韩文|韩语|ko-kor-Kore-KR|ko-Kore-KR|kor-Kore-KR|KR',

		'th-TH' : 'ไทย|th-TH|Thai|泰语|泰国',

		// Subtag: ru, Suppress-Script: Cyrl
		'ru-RU' : 'Русский|ru-RU|Russian|俄语|rus-Cyrl-RU|ru-rus-Cyrl-RU|RU',
		// Tuvan language tyv-RU-TY https://en.wikipedia.org/wiki/ISO_3166-2:RU
		'tyv-RU' : 'Тыва дыл|tyv-RU-TY|Tuvan|图瓦语',

		'fr-FR' : 'Français|fr-FR|French|法语',

		'de-DE' : 'Deutsch|de-DE|German|德语',

		'es-ES' : 'Español|es-ES|Spanish|西班牙语',

		'pt-BR' : 'Português|pt-BR|Brazilian Portuguese|巴西葡萄牙语|葡萄牙语|Português brasileiro',

		// Dutch language
		'nl-NL' : 'Nederlands|nl-NL|Dutch|荷兰语',

		// Swedish language
		'sv-SE' : 'Svenska|sv-SE|Swedish|瑞典语',

		// Macedonian language
		'mk-MK' : 'Македонски јазик|mk-MK|Macedonian|马其顿语',

		'kn-IN' : 'ಕನ್ನಡ|kn-IN|Kannada|康纳达语',
		// Kashmiri language
		// https://en.wikipedia.org/wiki/Jammu_and_Kashmir_(union_territory)
		'ks-IN' : 'کٲشِر|ks-IN-JK|Kashmiri|喀什米尔语',

		// Gun language
		'guw-BJ' : 'gungbe|guw-BJ|Gun|康纳达语',

		'lb-LU' : 'Lëtzebuergesch|lb-LU|Luxembourgish|卢森堡语',

		// Piedmontese language
		'pms-IT' : 'Piemontèis|pms-IT|Piedmontese|皮埃蒙特语'
	};
	gettext.set_alias(gettext.default_domain);

	// 初始化偏好的语言/优先言语。
	// setup default / current domain. ユーザーロケール(言语と地域)の判定。
	gettext.default_domain = library_namespace.env.default_domain
	// 预先手动强制设定。
	&& gettext.to_standard(library_namespace.env.default_domain)
			|| guess_language();
	// console.log('setup default / current domain: ' + gettext.default_domain);
	// initialization 时，gettext 可能还没 loaded。
	// 因此设在 post action。e.g., @ HTA.
	this.finish = function(name_space, waiting) {
		// 无论如何都该载入复数规则。
		load_domain(plural_rules__domain_name);

		// console.trace(gettext.default_domain);

		if (!gettext.default_domain) {
			return;
		}

		gettext.use_domain(gettext.default_domain, function() {
			gettext.adapt_domain(gettext.default_domain, waiting);
		}, true);
		return waiting;
	};

	// console.log(gettext_aliases);

	_// JSDT:_module_
	.gettext = gettext;

	// -----------------------------------------------------------------------------------------------------------------
	// 常用汉字↔旧字体/正字体/旧汉字
	// https://ja.wikipedia.org/wiki/%E5%B8%B8%E7%94%A8%E6%BC%A2%E5%AD%97

	var 旧字体_RegExp = [], 常用汉字_RegExp = [],
	// from https://github.com/marionette-of-u/RevText/blob/master/Program.cs
	旧字体 = "万与两竝乘乱龟豫争亘亚佛假会传体余倂价侮俭伪僧免儿党圆册写处剑剂剩励劳效敕勉勤劝勋区医卑单即严参双收敍台号喝营嘆嘱器团围图国圈压堕塀垒塚盐增墨坏壤壮声壹卖变奥奖娘学宝实宽寝对寿专将尧尽届属層岳峡岩巢卷带归厅广废廊辨瓣辩贰弥弹当径从德征应恋恒惠悔恼恶惨愼慨憎怀懲战戏戾拂拔择担拜据扩擧挟插搜揭摇摄击敏数齐斋断既旧昼晋晚晓暑历朗条来枢荣樱栈梅检楼乐槪样槇权横欄缺欧欢步齿历残殴殺壳每气没泽净浅滨海泪渴济涉澁溪渚温湾湿满泷滞漢潜濑灯炉点为烧煮牺状独狭猎猪献兽琢瑶甁画叠痴发盗县真硏碎碑礼社祈祉祐祖祝神祥禄禅禍禎福秘称稻穀穗稳穰突窃龙節粹肃丝经绘继续总绿緖練缘绳纵繁纤罐署飜者聪听胆脑脏臭舍舖艳艺茎庄著藏薰药虚虜虫蚕萤蛮衞装褐襃霸視觉览观触译证誉读諸謁谣謹让丰賓赞贈践转轻辞边递逸迟遥郞鄕都醉酿释铁鑛钱铸炼录镇关鬪陷险隆随隐隶杂難灵静響頻赖颜显類飮驿驱骚验髓发鸡麦黄黑默龄"
			.split(''),
	//
	常用汉字 = "万与両并乗乱亀予争亘亜仏仮会伝体余并価侮倹伪僧免児党円册写処剣剤剰励労効勅勉勤勧勲区医卑単即厳参双収叙台号喝営叹嘱器団囲図国圏圧堕塀塁冢塩増墨壊壌壮声壱売変奥奨嬢学宝実寛寝対寿専将尭尽届属层岳峡巌巣巻帯帰庁広廃廊弁弁弁弐弥弾当径従徳徴応恋恒恵悔悩悪惨慎慨憎懐惩戦戯戻払抜択担拝拠拡挙挟挿捜掲揺摂撃敏数斉斎断既旧昼晋晩暁暑暦朗条来枢栄桜桟梅検楼楽概様槙権横栏欠欧歓歩歯歴残殴杀壳毎気没沢浄浅浜海涙渇済渉渋渓渚温湾湿満滝滞汉潜瀬灯炉点为焼煮犠状独狭猟猪献獣琢瑶瓶画畳痴発盗県真研砕碑礼社祈祉祐祖祝神祥禄禅祸祯福秘称稲谷穂穏穣突窃竜节粋粛糸経絵継続総绿绪练縁縄縦繁繊缶署翻者聡聴胆脳臓臭舎舗艶芸茎荘著蔵薫薬虚虏虫蚕蛍蛮卫装褐褒覇视覚覧観触訳证誉読诸谒谣谨譲豊宾賛赠践転軽辞辺逓逸遅遥郎郷都酔醸釈鉄鉱銭鋳錬录镇関闘陥険隆随隠隷雑难霊静响频頼颜顕类饮駅駆騒験髄髪鶏麦黄黒黙齢"
			.split('');

	旧字体.forEach(function(character) {
		旧字体_RegExp.push(new RegExp(character, 'g'));
	});

	常用汉字.forEach(function(character) {
		常用汉字_RegExp.push(new RegExp(character, 'g'));
	});

	// http://stackoverflow.com/questions/12562043/fastest-way-to-replace-string-in-js
	function to_旧字体(text) {
		常用汉字_RegExp.forEach(function(pattern, index) {
			text = text.replace(pattern, 旧字体[index]);
		});
		return text;
	}

	function to_常用汉字(text) {
		旧字体_RegExp.forEach(function(pattern, index) {
			text = text.replace(pattern, 常用汉字[index]);
		});
		return text;
	}

	_.to_旧字体 = to_旧字体;
	_.to_常用汉字 = to_常用汉字;

	// -----------------------------------------------------------------------------------------------------------------

	return (_// JSDT:_module_
	);
}
