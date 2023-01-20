/**
 * @name CeL function for MediaWiki (Wikipedia / 维基百科): parse misc 归属于
 *       wiki_API.parse === CeL.application.net.wiki.parser.wikitext
 * 
 * @fileoverview 本档案包含了 MediaWiki 自动化作业用程式库的子程式库。
 * 
 * TODO:<code>

</code>
 * 
 * @since 2021/12/14 18:53:43 拆分自 CeL.application.net.wiki.parser
 */

// More examples: see /_test suite/test.js
// Wikipedia bots demo: https://github.com/kanasimi/wikibot
'use strict';
// 'use asm';

// --------------------------------------------------------------------------------------------

// 不采用 if 陈述式，可以避免 Eclipse JSDoc 与 format 多缩排一层。
typeof CeL === 'function' && CeL.run({
	// module name
	name : 'application.net.wiki.parser.misc',

	require : 'application.net.wiki.parser.wikitext.',

	// 设定不汇出的子函式。
	no_extend : 'this,*',

	// 为了方便格式化程式码，因此将 module 函式主体另外抽出。
	code : module_code
});

function module_code(library_namespace) {

	// requiring
	var wiki_API = library_namespace.application.net.wiki;
	// @inner
	var PATTERN_URL_prefix = wiki_API.PATTERN_URL_prefix;

	// --------------------------------------------------------------------------------------------

	// @see Nullish coalescing operator (??)
	// exclude NaN, null, undefined
	function is_valid_parameters_value(value) {
		return value
		// e.g., .text === ''
		// String(value) === ''
		|| value === '' || value === 0;
	}

	wiki_API.is_valid_parameters_value = is_valid_parameters_value;

	// 仅添加有效的 parameters。基本上等同于 Object.assign()，只是不添加无效值。
	function set_template_object_parameters(template_object, parameters,
			value_mapping) {
		if (!template_object)
			template_object = Object.create(null);

		for ( var key in parameters) {
			var value = parameters[key];
			if (value_mapping)
				value = value_mapping[value];
			// 不添加无效值。
			if (is_valid_parameters_value(value)) {
				template_object[key] = value;
			}
		}

		return template_object;
	}

	/**
	 * 将 parameters 形式的 object 转成 wikitext。
	 * 
	 * @example<code>

	CeL.wiki.parse.template_object_to_wikitext('t', {
		1 : 'v1',
		2 : 'v2',
		p1 : 'vp1',
		p2 : 'vp2'
	}) === '{{t|v1|v2|p1=vp1|p2=vp2}}';

	CeL.wiki.parse.template_object_to_wikitext('t', {
		1 : 'v1',
		2 : 'v2',
		4 : 'v4',
		p1 : 'vp1'
	}) === '{{t|v1|v2|4=v4|p1=vp1}}';

	CeL.wiki.parse.template_object_to_wikitext('t', {
		1 : 'v1',
		2 : 'v2',
		p1 : 'vp1',
		q2 : 'vq2'
	}, function(text_array) {
		return text_array.filter(function(text, index) {
			return !/^q/.test(text);
		});
	}) === '{{t|v1|v2|p1=vp1}}';

	 </code>
	 * 
	 * @param {String}template_name
	 *            template name
	 * @param {Object}template_object
	 *            parameters 形式的 object。<br />
	 *            e.g., { '1': value, '2': value, parameter1 : value1 }
	 * @param {Object}[post_processor]
	 *            post-processor for text_array
	 */
	function template_object_to_wikitext(template_name, template_object,
			post_processor) {
		var text_array = [ '{{' + template_name ], index = 1;

		while (true) {
			var value = template_object[index];
			if (!is_valid_parameters_value(value)) {
				break;
			}

			if (false && typeof value !== 'string') {
				value = typeof value.toString === 'function' ? value.toString()
						: String(value);
			}
			value = String(value);

			if (value.includes('='))
				value = index + '=' + value;

			// text_array.push(value); index++;
			text_array[index++] = value;
		}

		for ( var key in template_object) {
			if (key in text_array)
				continue;
			var value = template_object[key];
			if (is_valid_parameters_value(value)) {
				value = String(value);
				if (value.includes('\n') && !text_array.at(-1).endsWith('\n')) {
					text_array[text_array.length - 1] += '\n';
				}
				text_array.push(key + '=' + value);
			}
		}

		if (post_processor) {
			// text_array = [ '{{template_name', 'parameters', ... ]
			// 不包含 '}}' !
			text_array = post_processor(text_array);
		}

		return text_array.join('|') + '}}';
	}

	// ------------------------------------------

	var KEY_remove_parameter = {
		remove_parameter : true
	};
	replace_parameter.KEY_remove_parameter = KEY_remove_parameter;

	function to_parameter_name_only(parameter_name_pairs) {
		var config = Object.create(null);
		Object.keys(parameter_name_pairs)
		//
		.forEach(function(from_parameter_name) {
			var to_parameter_name = parameter_name_pairs[from_parameter_name];
			if (typeof to_parameter_name === 'string'
			//
			|| typeof to_parameter_name === 'number') {
				config[from_parameter_name] = function(value) {
					var config = Object.create(null);
					config[to_parameter_name] = value;
					return config;
				};
			} else if (to_parameter_name === KEY_remove_parameter) {
				config[from_parameter_name] = to_parameter_name;
			} else {
				library_namespace.error(
				//
				'to_parameter_name_only: Replace to invalid parameter name: '
				//
				+ to_parameter_name);
			}
		});
		return config;
	}

	// @inner
	function mode_space_of_parameters(template_token, parameter_name) {
		if (false) {
			template_token.forEach(function(parameter, index) {
				if (index === 0)
					return;
				// TODO: 分析模板参数的空白模式典型。
				// return |$0parameter$1=$2value$3|
			});
		}

		var index = template_token.index_of[parameter_name];
		if (!(index >= 0)) {
			// 不存在此 parameter name 可 replace。
			return;
		}

		var this_parameter = template_token[index];
		// this_parameter = [ key, " = ", value ] || [ "", "", value ]

		// 判断上下文使用的 spaces。
		var spaces = this_parameter[0];
		if (Array.isArray(spaces)) {
			spaces = spaces[0];
		}
		spaces = typeof spaces === 'string' ? spaces.match(/^\s*/)[0] : '';

		/**
		 * 保留属性质结尾的排版:多行保留行先头的空白，但不包括末尾的空白。单行的则留最后一个空白。 preserve spaces for:
		 * <code>

		{{T
		 | 1 = 1
		 | 2 = 2
		 | 3 = 3
		}}

		</code>
		 */
		// var spaces = template_token[index].toString().match(/(\n *| ?)$/);
		//
		// parameter: spaces[0] + key + spaces[1] + value + spaces[2]
		spaces = [ spaces,/* " = " */this_parameter[1],
		/* tail spaces */
		this_parameter[3] || '' ];

		return spaces;
	}

	/**
	 * 将 wiki_API.parse === parse_wikitext() 获得之 template_token 中的指定 parameter
	 * 换成 replace_to。 replace_template_parameter(), set_parameter(),
	 * modify_template()
	 * 
	 * WARNING: 若不改变 parameter name，只变更 value，<br />
	 * 则应该使用 { value_only: true }，<br />
	 * 或使用 'parameter name = value' 而非仅 'value'。
	 * 
	 * @example<code>

	// remove parameter
	CeL.wiki.parse.replace_parameter(template_token, parameter_name, CeL.wiki.parse.replace_parameter.KEY_remove_parameter);

	// replace value only
	token = CeL.wiki.parse('{{t|parameter_name=12|parameter_name_2=32}}');
	changed_count = CeL.wiki.parse.replace_parameter(token, {
		parameter_name : 'replace to value',
		parameter_name_2 : 'replace to value_2',
	}, 'value_only');
	token.toString();

	// replace value and parameter name
	token = CeL.wiki.parse('{{t|parameter_name=12|parameter_name_2=32}}');
	changed_count = CeL.wiki.parse.replace_parameter(token, {
		parameter_name : 'parameter name 3=replace to value',
		parameter_name_2 : 'parameter name 4=replace to value_2',
	});
	token.toString();

	// force_add
	token = CeL.wiki.parse('{{t}}');
	CeL.wiki.parse.replace_parameter(token, {
		parameter_name : 'replace_to_value',
		parameter_name_2 : 'replace_to_value_2',
	}, { value_only : true, force_add : true, append_key_value : true });
	token.toString();

	// replace value only: old style 旧格式
	CeL.wiki.parse.replace_parameter(token, parameter_name,
		{ parameter_name : replace_to_value }
	);

	// {{T|p=v|n=v}} → {{T|V|n=v}}
	CeL.wiki.parse.replace_parameter(token, 'p', 'V');
	// replace `replace_from_parameter_name = *` to "replace to wikitext"
	CeL.wiki.parse.replace_parameter(token, replace_from_parameter_name,
		"replace to wikitext"
	);

	// replace parameter name only
	CeL.wiki.parse.replace_parameter(token, replace_from_parameter_name,
		value => {
			return { replace_to_parameter_name : value };
		}
	);
	CeL.wiki.parse.replace_parameter(token, {
		parameter_1 : replace_to_parameter_1,
		parameter_2 : replace_to_parameter_2,
	}, 'parameter_name_only');

	// replace parameter name: 不在乎 spaces 的版本。
	CeL.wiki.parse.replace_parameter(token, replace_from_parameter_name,
		value => replace_from_parameter_name + '=' + value
	);

	// replace 1 parameter to 2 parameters
	CeL.wiki.parse.replace_parameter(token, replace_from_parameter_name,
		original_value => {
			parameter_1 : value_1,
			parameter_2 : original_value,
		}
	);

	// multi-replacement
	CeL.wiki.parse.replace_parameter(token, {
		replace_from_1 : replace_to_config_1,
		replace_from_2 : replace_to_config_2,
	});

	 </code>
	 * 
	 * @see 20190912.fix_Infobox_company.js, 20190913.move_link.js
	 * 
	 * @param {Array}template_token
	 *            由 wiki_API.parse === parse_wikitext() 获得之 template_token
	 * @param {String}parameter_name
	 *            指定属性名称 parameter name
	 * @param {String|Number|Array|Object|Function}replace_to
	 *            要换成的属性名称加上赋值。 e.g., "parameter name = value" ||<br />
	 *            {parameter_1 = value, parameter_2 = value} ||<br />
	 *            function replace_to(value, parameter_name, template_token)
	 * 
	 * @returns {ℕ⁰:Natural+0} count of templates successful replaced
	 */
	function replace_parameter(template_token, parameter_name, replace_to) {
		function convert_replace_to(parameter_name) {
			if (typeof replace_to === 'function') {
				// function replace_to(value, parameter_name, template_token) {
				// return 'replace to value'; }
				replace_to = replace_to(
						template_token.parameters[parameter_name],
						parameter_name, template_token);
			}
			return replace_to;
		}

		if (library_namespace.is_Object(parameter_name)) {
			// treat `replace_to` as options
			var options = library_namespace.setup_options(replace_to);
			// Replace parameter name only, preserve value.
			if (options.parameter_name_only) {
				parameter_name = to_parameter_name_only(parameter_name);
			}

			var operated_template_count = 0, latest_OK_key, key_of_spaces, spaces, next_insert_index;
			for ( var replace_from in parameter_name) {
				replace_to = parameter_name[replace_from];
				if (convert_replace_to(replace_from) === undefined) {
					continue;
				}
				var index = template_token.index_of[replace_from];
				if (!(index >= 1)) {
					// 不存在此 parameter name 可 replace。
					if (options.value_only && options.force_add) {
						if ((!key_of_spaces || key_of_spaces !== latest_OK_key)
						//
						&& (key_of_spaces = options.append_key_value
						//
						&& latest_OK_key
						// mode_parameter
						|| Object.keys(template_token.parameters).pop())) {
							spaces = mode_space_of_parameters(template_token,
									key_of_spaces);
							// console.log(spaces);
						}
						replace_to = spaces && spaces[1] ? spaces[0]
								+ replace_from + spaces[1] + replace_to
								+ spaces[2] : replace_from + '=' + replace_to;
						if (options.append_key_value && next_insert_index >= 1) {
							// 警告: 这会使 template_token[next_insert_index]
							// 不合正规格式！但能插入在最接近前一个插入点之后。
							template_token[next_insert_index] += '|'
									+ replace_to;
						} else {
							template_token.push(replace_to);
						}
						operated_template_count = 1;
					}
					continue;
				}

				var skip_replacement = undefined;
				if (options.value_only
						&& (typeof replace_to === 'string' || typeof replace_to === 'number')) {
					var this_parameter = template_token[template_token.index_of[replace_from]];
					var parameters = template_token.parameters;

					// using this_parameter[2] to keep spaces and parameter
					// name.
					// e.g., "| key<!---->=1 |" → "| key<!---->=2 |"
					// NOT: "| key<!---->=1 |" → "| key=2 |"
					if (parameters && parameters[replace_from]) {
						this_parameter[2] = this_parameter[2].toString()
						// 留下注解之类。
						.replace(parameters[replace_from], function(all) {
							skip_replacement = 1;
							return replace_to;
						});
					}
					if (!skip_replacement)
						this_parameter[2] = replace_to;
					if (parameters) {
						// Also update parameters
						parameters[replace_from] = replace_to;
					}
					skip_replacement = 1;

					// @deprecated:
					// replace_to = { [_replace_from] : replace_to };
					// replace_to = Object.create(null);
					// replace_to[replace_from] = replace_to;
				}

				latest_OK_key = replace_from;
				next_insert_index = index;
				// console.trace([ replace_from, replace_to ]);
				if (skip_replacement) {
					operated_template_count += skip_replacement;
					continue;
				}
				operated_template_count += replace_parameter(template_token,
						replace_from, replace_to);
			}
			return operated_template_count;
		}

		// --------------------------------------

		var index = template_token.index_of[parameter_name];
		if (!(index >= 1)) {
			// 不存在此 parameter name 可 replace。
			return 0;
		}

		if (convert_replace_to(parameter_name) === undefined) {
			return 0;
		}

		if (replace_to === KEY_remove_parameter) {
			if (isNaN(parameter_name)) {
				// remove the parameter
				template_token.splice(index, 1);
				replace_to = wiki_API.parse(template_token.toString());
				Object.clone(replace_to, false, template_token);
			} else {
				// For numeral parameter_name, just replace to empty value.
				template_token[index] = '';
				// Warning: this will NOT change .index_of , .parameters !
				while (!template_token.at(-1))
					template_token.pop();
			}
			return 1;
		}

		// --------------------------------------
		// 判断上下文使用的 spaces。

		var spaces = mode_space_of_parameters(template_token, parameter_name);
		// console.trace(spaces);
		// console.trace(replace_to);

		// --------------------------------------
		// 正规化 replace_to。

		if (library_namespace.is_Object(replace_to)) {
			// console.trace(replace_to);
			replace_to = Object.keys(replace_to).map(function(key) {
				var value = replace_to[key];
				if (!key) {
					library_namespace.warn('Including empty key: '
					// TODO: allow {{|=...}}, e.g., [[w:zh:Template:Policy]]
					+ JSON.stringify(replace_to));
					key = parameter_name;
				}
				// TODO: using is_valid_parameters_value(value)
				return spaces[1] ? spaces[0] + key + spaces[1] + value
				//
				+ spaces[2] : key + '=' + value;
			});
		}
		if (Array.isArray(replace_to)) {
			replace_to = replace_to.join('|');
		} else {
			replace_to = replace_to.toString();
		}

		// assert: {String}replace_to
		// console.trace(replace_to);

		if (!spaces[1] && !isNaN(parameter_name)) {
			var matched = replace_to.match(/^\s*(\d+)\s*=\s*([\s\S]*)$/);
			if (matched && matched[1] == parameter_name
			// 假如包含 "=" 就不能省略数字指定 prefix。
			// TODO: template 本身假如会产出 "a=b" 这样的字串，恐怕会造成问题。
			&& !matched[2].replace(/{{ *= *(?:\|[^{}]*)?}}/g, '').includes('=')) {
				// e.g., replace [2] to non-named 'value' in {{t|1|2}}
				library_namespace.debug('auto remove numbered parameter: '
				// https://www.mediawiki.org/wiki/Help:Templates#Numbered_parameters
				+ parameter_name, 3, 'replace_parameter');
				// console.trace([ replace_to, matched ]);
				replace_to = matched[2];
			}
		}

		if (spaces[2].includes('\n') && !/\n\s*?$/.test(replace_to)) {
			// Append new-line without tail "|"
			replace_to += spaces[2];
		}

		if (template_token[index]
				&& template_token[index].toString() === replace_to) {
			// 不处理没有变更的情况。
			return 0;
		}

		// TODO: 不处理仅添加空白字元的情况。

		// --------------------------------------
		// a little check: parameter 的数字顺序不应受影响。

		var PATERN_parameter_name = /(?:^|\|)[\s\n]*([^=\s\n][\s\S]*?)=/;
		if (index + 1 < template_token.length) {
			// 后面没有 parameter 了，影响较小。
		} else if (isNaN(parameter_name)) {
			// TODO: NG: {{t|a=a|1}} → {{t|a|1}}
			if (!PATERN_parameter_name.test(replace_to)) {
				library_namespace
						.warn('replace_parameter: Insert named parameter and disrupt the order of parameters? '
								+ template_token);
			}
		} else {
			// NG: {{t|a|b}} → {{t|a=1|b}}
			var matched = replace_to.match(PATERN_parameter_name);
			if (!matched) {
				if (index != parameter_name) {
					library_namespace
							.warn('replace_parameter: Insert non-named parameter to ['
									+ parameter_name
									+ '] and disrupt the order of parameters? '
									+ template_token);
				}
			} else if (matched[1].trim() != parameter_name) {
				library_namespace
						.warn('replace_parameter: Insert numerical parameter name and disrupt the order of parameters? '
								+ template_token);
			}
		}

		// --------------------------------------

		library_namespace.debug(parameter_name + ': "' + template_token[index]
				+ '"→"' + replace_to + '"', 2, 'replace_parameter');
		template_token[index] = replace_to;

		return 1;
	}

	// ------------------------------------------------------------------------

	// 模板名#后的内容会忽略。
	// matched: [ , Template name ]
	var TEMPLATE_NAME_PATTERN = /{{[\s\n]*([^\s\n#\|{}<>\[\]][^#\|{}<>\[\]]*)[|}]/,
	//
	TEMPLATE_START_PATTERN = new RegExp(TEMPLATE_NAME_PATTERN.source.replace(
			/\[[^\[]+$/, ''), 'g');
	/** {RegExp}内部连结 PATTERN */
	// var LINK_NAME_PATTERN =
	// /\[\[[\s\n]*([^\s\n\|{}<>\[\]�][^\|{}<>\[\]]*)(\||\]\])/;
	/**
	 * parse template token. 取得完整的模板 token。<br />
	 * CeL.wiki.parse.template();
	 * 
	 * TODO:<br />
	 * {{link-en|{{convert|198|cuin|L|abbr=on}} ''斜置-6'' 198|Chrysler Slant 6
	 * engine#198}}
	 * 
	 * @param {String}wikitext
	 *            模板前后之 content。<br />
	 *            assert: wikitext 为良好结构 (well-constructed)。
	 * @param {String|Array}[template_name]
	 *            撷取模板名 template name。
	 * @param {Number}[parse_type]
	 *            1: [ {String}模板名, parameters ]<br />
	 *            true: 不解析 parameters。<br />
	 *            false: 解析 parameters。
	 * 
	 * @returns {Undefine}wikitext 不包含此模板。
	 * @returns {Array}token = [ {String}完整的模板 wikitext token, {String}模板名,
	 *          {Array}parameters ];<br />
	 *          token.count = count('{{') - count('}}')，正常情况下应为 0。<br />
	 *          token.index, token.lastIndex: index.<br />
	 *          parameters[0] is {{{1}}}, parameters[1] is {{{2}}}, ...<br />
	 *          parameters[p] is {{{p}}}
	 */
	function parse_template(wikitext, template_name, parse_type) {
		template_name = wiki_API.normalize_title_pattern(template_name, true,
				true);
		var matched = template_name
		// 模板起始。
		? new RegExp(/{{[\s\n]*/.source + template_name + '\\s*[|}]', 'ig')
				: new RegExp(TEMPLATE_NAME_PATTERN.source, 'g');
		library_namespace.debug('Use pattern: ' + matched, 3, 'parse_template');
		// template_name : start token
		template_name = matched.exec(wikitext);

		if (!template_name) {
			// not found.
			return;
		}

		var pattern = new RegExp('}}|'
		// 不用 TEMPLATE_NAME_PATTERN，预防把模板结尾一起吃掉了。
		+ TEMPLATE_START_PATTERN.source, 'g'), count = 1;
		// lastIndex - 1 : the last char is [|}]
		template_name.lastIndex = pattern.lastIndex = matched.lastIndex - 1;

		while (count > 0 && (matched = pattern.exec(wikitext))) {
			// 遇到模板结尾 '}}' 则减1，否则增1。
			if (matched[0] === '}}')
				count--;
			else
				count++;
		}

		wikitext = pattern.lastIndex > 0 ? wikitext.slice(template_name.index,
				pattern.lastIndex) : wikitext.slice(template_name.index);
		var result = [
		// [0]: {String}完整的模板token
		wikitext,
		// [1]: {String}模板名
		template_name[1].trim(),
		// [2] {String}parameters
		// 接下来要作用在已经裁切撷取过的 wikitext 上，需要设定好 index。
		// assert: 其他余下 parameters 的部分以 [|}] 起始。
		// -2: 模板结尾 '}}'.length
		wikitext.slice(template_name.lastIndex - template_name.index, -2) ];
		Object.assign(result, {
			count : count,
			index : template_name.index,
			lastIndex : pattern.lastIndex
		});

		if (!parse_type || parse_type === 1) {
			// {{t|p=p|1|q=q|2}} → [ , 1, 2; p:'p', q:'q' ]
			var index = 1,
			/** {Array}parameters */
			parameters = [];
			// 警告: 这边只是单纯的以 '|' 分割，但照理来说应该再 call parser 来处理。
			// 最起码应该除掉所有可能包含 '|' 的语法，例如内部连结 [[~|~]], 模板 {{~|~}}。
			result[2].split(/[\s\n]*\|[\s\n]*/)
			// 不处理 template name。
			.slice(1)
			//
			.forEach(function(token) {
				var matched = token.match(/^([^=]+)=(.*)$/);
				if (matched) {
					var key = matched[1].trim(),
					//
					value = matched[2].trim();
					if (false) {
						if (key in parameters) {
							// 参数名重复: @see [[Category:调用重复模板参数的页面]]
							// 如果一个模板中的一个参数使用了多于一个值，则只有最后一个值会在显示对应模板时显示。
							// parser 调用超过一个Template中参数的值，只有最后提供的值会被使用。
							if (Array.isArray(parameters[key]))
								parameters[key].push(value);
							else
								parameters[key] = [ parameters[key], value ];
						} else {
							parameters[key] = value;
						}
					}
					parameters[key] = value;
				} else {
					parameters[index++] = token;
				}
			});

			if (parse_type === 1) {
				parameters[0] = result[1];
				result = parameters;
				// result[0] is template name.
				// result[p] is {{{p}}}
				// result[1] is {{{1}}}
				// result[2] is {{{2}}}
			} else {
				// .shift(): parameters 以 '|' 起始，因此需去掉最前面一个。
				// 2016/5/14 18:1:51 采用 [index] 的方法加入，因此无须此动作。
				// parameters.shift();
				result[2] = parameters;
			}
		}

		return result;
	}

	// ----------------------------------------------------

	// [[w:ks:وِکیٖپیٖڈیا:وَقٕت تہٕ تأریٖخ]]
	var ks_month_name = ',جَنؤری,فَرؤری,مارٕچ,اَپریل,مٔیی,جوٗن,جُلَے,اَگَست,سَتَمبَر,اَکتوٗبَر,نَوَمبَر,دَسَمبَر'
			.split(',');

	// 因应不同的 mediawiki projects 来处理日期。机器人只识别标准时间格式，预防误判。
	// date_parser_config[language]
	// = [ {RegExp}PATTERN, {Function}parser({Array}matched) : return {String},
	// {Function}to_String({Date}date) : return {String} ]
	//
	// 可使用 parse API 来做测试。
	// https://www.mediawiki.org/w/api.php?action=help&modules=parse
	//
	// 须注意当使用者特别设定时，在各维基计划上可能采用不同语系的日期格式。
	//
	// to_String: 日期的模式, should match "~~~~~".
	//
	// @see
	// https://www.mediawiki.org/wiki/Manual:$wgDefaultUserOptions#Available_preferences
	// $wgDefaultUserOptions['date']
	var date_parser_config = {
		en : [
				// e.g., "01:20, 9 September 2017 (UTC)"
				// [, time(hh:mm), d, m, Y, timezone ]
				/([0-2]?\d:[0-6]?\d)[, ]+([0-3]?\d) ([a-z]{3,9}) ([12]\d{3})(?: \(([A-Z]{3})\))?/ig,
				function(matched, options) {
					return matched[2] + ' ' + matched[3] + ' ' + matched[4]
							+ ' ' + matched[1] + ' ' + (matched[6] || 'UTC');
				}, {
					format : '%2H:%2M, %d %B %Y (UTC)',
					// use UTC
					zone : 0,
					locale : 'en-US'
				} ],

		ks : [
				// [, time(hh:mm), d, m, Y, timezone ]
				/([0-2]?\d:[0-6]?\d)[, ]+([0-3]?\d) ([\u0624-\u06d2]{4,9}) ([12]\d{3})(?: \(([A-Z]{3})\))?/ig,
				function(matched, options) {
					matched[3] = ks_month_name.indexOf(matched[3]);
					return matched[3] > 0 && matched[4] + '-'
							+ matched[3].pad(2) + '-' + +matched[2].pad(2)
							+ ' ' + matched[1] + ' ' + (matched[6] || 'UTC');
				}, {
					format : '%2H:%2M, %d %B %Y (UTC)',
					// use UTC
					zone : 0,
					locale : 'ks-IN'
				} ],

		ja : [
				// e.g., "2017年9月5日 (火) 09:29 (UTC)"
				// [, Y, m, d, week, time(hh:mm), timezone ]
				/([12]\d{3})年([[01]?\d)月([0-3]?\d)日 \(([日月火水木金土])\)( [0-2]?\d:[0-6]?\d)(?: \(([A-Z]{3})\))?/g,
				function(matched) {
					return matched[1] + '/' + matched[2] + '/' + matched[3]
							+ matched[5] + ' ' + (matched[6] || 'UTC+9');
				}, {
					format : '%Y年%m月%d日 (%a) %2H:%2M (UTC)',
					// use UTC
					zone : 0,
					locale : 'ja-JP'
				} ],
		'zh-classical' : [
				// Warning: need CeL.data.numeral
				/([一二][〇一二三四五六七八九]{3})年([[〇一]?[〇一二三四五六七八九])月([〇一二三]?[〇一二三四五六七八九])日 （([日一二三四五六])）( [〇一二三四五六七八九]{1,2}时[〇一二三四五六七八九]{1,2})分(?: \(([A-Z]{3})\))?/g,
				function(matched, options) {
					return library_namespace
							.from_positional_Chinese_numeral(matched[1] + '/'
									+ matched[2] + '/' + matched[3]
									+ matched[5].replace('时', ':'))
							+ ' ' + (matched[6] || 'UTC+8');
				},
				function(date, options) {
					return library_namespace.to_positional_Chinese_numeral(date
							.format({
								format : '%Y年%m月%d日 （%a） %2H时%2M分 (UTC)',
								// use UTC
								zone : 0,
								locale : 'cmn-Hant-TW'
							}));
				} ],
		zh : [
				// $dateFormats, 'Y年n月j日 (D) H:i'
				// https://github.com/wikimedia/mediawiki/blob/master/languages/messages/MessagesZh_hans.php
				// e.g., "2016年8月1日 (一) 00:00 (UTC)",
				// "2016年8月1日 (一) 00:00 (CST)"
				// [, Y, m, d, week, time(hh:mm), timezone ]
				/([12]\d{3})年([[01]?\d)月([0-3]?\d)日 \(([日一二三四五六])\)( [0-2]?\d:[0-6]?\d)(?: \(([A-Z]{3})\))?/g,
				function(matched, options) {
					return matched[1] + '/' + matched[2] + '/' + matched[3]
					//
					+ matched[5] + ' '
					// 'CST' in zh should be China Standard Time.
					// But `new Date('2017/12/1 0:0 CST')` using
					// Central Standard Time (North America)
					// === new Date('2017/12/1 0:0 UTC-6')
					// !== new Date('2017/12/1 0:0 UTC+8')
					+ (!matched[6] || matched[6] === 'CST' ? 'UTC+8'
					//
					: matched[6]);
				}, {
					format : '%Y年%m月%d日 (%a) %2H:%2M (UTC)',
					// use UTC
					zone : 0,
					locale : 'cmn-Hant-TW'
				} ]
	};
	// all wikimedia using English in default.
	// e.g., wikidata, commons
	date_parser_config.multilingual = date_parser_config.en;

	// warning: number_to_signed(-0) === "+0"
	function number_to_signed(number) {
		return number < 0 ? number : '+' + number;
	}

	// @inner
	function normalize_parse_date_options(options) {
		var session = wiki_API.session_of_options(options);
		if (options === true) {
			options = {
				get_timevalue : true
			};
		} else if (typeof options === 'string'
				&& (options in date_parser_config)) {
			options = {
				language : options
			};
		} else {
			options = library_namespace.new_options(options);
		}

		var language = wiki_API.get_first_domain_name_of_session(options);
		if (session) {
			if (!language) {
				language = wiki_API.site_name(session, {
					get_all_properties : true
				});
				language = language && language.language;
			}
			if (!date_parser_config[language]) {
				// e.g., https://simple.wikipedia.org/ →
				// wiki_API.get_first_domain_name_of_session(session) ===
				// 'simple' && session.language === 'en'
				language = session.language;
			}
			if (!isNaN(options.timeoffset)) {
				options.zone = options.timeoffset / 60;
			} else if (!('timeoffset' in options)) {
				// e.g., 480 : UTC+8
				options.zone = session.configurations.timeoffset / 60;
			} else {
				library_namespace
						.warn('normalize_parse_date_options: Invalid timeoffset: '
								+ options.timeoffset);
			}
		}
		options.zone |= 0;

		options.date_parser_config = date_parser_config[language];
		if (!options.date_parser_config) {
			if (language) {
				library_namespace.error(
				//
				'normalize_parse_date_options: Invalid language: ' + language);
			}
			// console.log(session);
			// console.trace([ language, wiki_API.language ]);
			options.date_parser_config = date_parser_config[wiki_API.language];
		}

		return options;
	}

	/**
	 * parse date string / 时间戳记 to {Date}
	 * 
	 * @example <code>

	date_list = CeL.wiki.parse.date(CeL.wiki.content_of(page_data), {
		//language : 'en',
		session : session,
		get_timevalue : true,
		get_date_list : true
	});

	</code>
	 * 
	 * 技术细节警告：不同语系wiki有相异的日期辨识模式，采用和当前wiki不同语言的日期格式，可能无法辨识。
	 * 
	 * 经查本对话串中没有一般型式的一般格式的日期，造成无法辨识。下次遇到这样的问题，可以在最后由任何一个人加上本讨论串已终结、准备存档的字样，签名并且'''加上一般日期格式'''即可。
	 * 
	 * @param {String}wikitext
	 *            date text to parse.
	 * @param {Object}options
	 *            附加参数/设定选择性/特殊功能与选项
	 * 
	 * @returns {Date|Array}date of the date string
	 * 
	 * @see [[en:Wikipedia:Signatures]], "~~~~~",
	 *      [[en:Help:Sorting#Specifying_a_sort_key_for_a_cell]]
	 */
	function parse_date(wikitext, options) {
		options = normalize_parse_date_options(options);

		var date_list;
		if (options.get_date_list) {
			// get all dates. 若设定 options.get_date_list，须保证回传 {Array}。
			date_list = [];
		}
		if (!wikitext) {
			return date_list;
		}

		// <del>去掉</del>skip年分前之杂项。
		// <del>去掉</del>skip星期与其后之杂项。
		var date_parser = options.date_parser_config[1];
		var PATTERN_date = options.date_parser_config[0], matched;
		// console.log('Using PATTERN_date: ' + PATTERN_date);

		var min_timevalue, max_timevalue;
		// reset PATTERN index
		PATTERN_date.lastIndex = 0;
		while (matched = PATTERN_date.exec(wikitext)) {
			// console.log(matched);
			// Warning:
			// String_to_Date()只在有载入CeL.data.date时才能用。但String_to_Date()比parse_date()功能大多了。
			var date = date_parser(matched, options);
			// console.log(date);

			// Date.parse('2019/11/6 16:11 JST') === NaN
			date = date.replace(/ (JST)/, function(all, zone) {
				zone = library_namespace.String_to_Date
				// Warning:
				// String_to_Date()只在有载入CeL.data.date时才能用。但String_to_Date()功能大多了。
				&& (zone in library_namespace.String_to_Date.zone)
				//
				? library_namespace.String_to_Date.zone[zone] : 9;
				return ' UTC' + number_to_signed(zone);
			});

			date = Date.parse(date);
			if (isNaN(date)) {
				continue;
			}

			if (!(min_timevalue < date)) {
				min_timevalue = date;
			} else if (!(date < max_timevalue)) {
				max_timevalue = date;
			}

			if (!options.get_timevalue) {
				date = new Date(date);
			}
			if (!options.get_date_list) {
				return date;
			}
			date_list.push(date);
		}

		// Warning: 不一定总有 date_list.min_timevalue, date_list.max_timevalue
		if (min_timevalue) {
			date_list.min_timevalue = min_timevalue;
			date_list.max_timevalue = max_timevalue || min_timevalue;
		}

		return date_list;
	}

	/**
	 * 产生时间戳记。日期格式跟标准签名一样，让时间转换的小工具起效用。
	 * 
	 * assert: the same as "~~~~~".
	 * 
	 * @example <code>

	CeL.wiki.parse.date.to_String(new Date, session);

	</code>
	 */
	function to_wiki_date(date, options) {
		options = normalize_parse_date_options(options);

		// console.log(language || wiki_API.language);
		var to_String = options.date_parser_config[2];

		if (typeof to_String === 'function') {
			date = to_String(date, options);
		} else {
			// treat `to_String` as date format
			// assert: library_namespace.is_Object(to_String)
			var zone = options.zone;
			if (!isNaN(zone) && to_String.zone !== zone) {
				// 不污染原型。
				to_String = Object.clone(to_String);
				to_String.zone = zone;
				to_String.format = to_String.format
				// 显示的时间跟随 session.configurations.timeoffset。
				.replace(/\(UTC(?:[+\-]\d)?\)/, '(UTC'
						+ (zone < 0 ? zone : zone ? '+' + zone : '') + ')');
			}
			// console.trace([ date, date.format(to_String), to_String ]);
			date = date.format(to_String);
		}
		return date;
	}

	parse_date.to_String = to_wiki_date;

	// ------------------------------------------

	/**
	 * 使用者/用户对话页面所符合的匹配模式。
	 * 
	 * matched: [ all, " user name " ]
	 * 
	 * user_name = matched[1].trim()
	 * 
	 * match: [[:language_code:user_talk:user_name]]
	 * 
	 * TODO: using PATTERN_page_name
	 * 
	 * @type {RegExp}
	 * 
	 * @see 使用者签名将不能再有Lint错误和包含一些无效的HTML，嵌套替换引用也不允许，必须包含到使用者页面、使用者讨论页或使用者贡献页之一的连结。
	 *      https://www.mediawiki.org/wiki/New_requirements_for_user_signatures#Outcome
	 * @see https://zh.wikipedia.org/w/api.php?action=query&meta=siteinfo&siprop=general|namespaces|namespacealiases|statistics&utf8
	 *      https://github.com/wikimedia/mediawiki/blob/master/languages/messages/MessagesZh_hant.php
	 */
	var PATTERN_user_link =
	// user name do not allow "\/": e.g., [[user talk:user_name/Flow]]
	// 大小写无差，但NG: "\n\t"
	//
	// https://zh.wikipedia.org/wiki/Wikipedia:互助客栈/其他#增设空间“U：”、“UT：”作为“User：”、“User_talk：”的Alias
	// https://phabricator.wikimedia.org/T183711
	// Doesn't conflict with any language code or other interwiki link.
	// https://gerrit.wikimedia.org/r/#/c/400267/4/wmf-config/InitialiseSettings.php
	/\[\[ *:?(?:[a-z\d\-]{1,14}:?)?(?:user(?:[ _]talk)?|使用者(?:讨论)?|用户(?:讨论|对话)?|用户(?:讨论|对话)?|利用者(?:‐会话)?|사용자(?:토론)?|UT?) *: *((?:&#(?:\d{1,8}|x[\da-fA-F]{1,8});|[^{}\[\]\|<>\t\n#�\/])+)/i,
	// [[特殊:功绩]]: zh-classical, [[特别:投稿记录]]: ja
	// matched: [ all, " user name " ]
	PATTERN_user_contributions_link = /\[\[(?:Special|特别|特殊|特别) *: *(?:Contributions|Contribs|使用者贡献|用户贡献|(?:用户)?贡献|投稿记录|功绩)\/((?:&#(?:\d{1,8}|x[\da-fA-F]{1,8});|[^{}\[\]\|<>\t\n#�\/])+)/i,
	//
	PATTERN_user_link_all = new RegExp(PATTERN_user_link.source, 'ig'), PATTERN_user_contributions_link_all = new RegExp(
			PATTERN_user_contributions_link.source, 'ig');

	/**
	 * parse user name. 解析使用者/用户对话页面资讯。找出用户页、用户讨论页、用户贡献页的连结。
	 * 
	 * @example <code>

	if (CeL.wiki.parse.user(CeL.wiki.title_link_of(title), user)) {}

	</code>
	 * 
	 * 采用模板来显示签名连结的方法，会影响到许多判断签名的程式，不只是签名侦测。您可使用
	 * <code><nowiki>[[User:Example|<span style="color: #007FFF;">'''我的签名'''</span>]]</nowiki></code>
	 * 的方法来添加颜色，或者参考[[zhwiki:Wikipedia:签名]]的其他范例。
	 * 
	 * TODO: 应该按照不同的维基项目来做筛选。
	 * 
	 * @param {String}wikitext
	 *            wikitext to parse
	 * @param {String}[user_name]
	 *            测试是否为此 user name。 注意:这只会检查第一个符合的连结。若一行中有多个连结，应该采用
	 *            CeL.wiki.parse.user.all() !
	 * @param {Boolean}[to_full_link]
	 *            get a full link
	 * 
	 * @returns {String}user name / full link
	 * @returns {Boolean}has the user name
	 * @returns {Undefined}Not a user link.
	 */
	function parse_user(wikitext, user_name, to_full_link) {
		if (!wikitext) {
			return;
		}

		var matched = wikitext.match(PATTERN_user_link), via_contributions;
		if (!matched) {
			matched = wikitext.match(PATTERN_user_contributions_link);
			if (!matched) {
				return;
			}
			via_contributions = true;
		}

		if (typeof user_name === 'boolean') {
			to_full_link = user_name;
			user_name = undefined;
		}
		// 正规化连结中的使用者名称。
		var name_from_link = wiki_API.normalize_title(matched[1]);
		if (user_name) {
			// 用户名正规化。
			user_name = wiki_API.normalize_title(user_name);
			if (user_name !== name_from_link) {
				return false;
			}
			if (!to_full_link) {
				return true;
			}
		}

		// may use wiki_API.title_link_of()
		return to_full_link ? via_contributions ? '[[User:' + name_from_link
				+ ']]' : matched[0].trimEnd() + ']]' : name_from_link;
	}

	/**
	 * parse all user name. 解析所有使用者/用户对话页面资讯。 CeL.wiki.parse.user.all()
	 * 
	 * @example <code>

	// 取得各使用者的签名数量hash。
	var user_hash = CeL.wiki.parse.user.all(wikitext), user_list = Object.keys(user_hash);
	// 取得依照第一次出现处排序、不重复的使用者序列。
	var user_list = Object.keys(CeL.wiki.parse.user.all(wikitext));
	// 取得依照顺序出现的使用者序列。
	var user_serial_list = CeL.wiki.parse.user.all(wikitext, true);

	</code>
	 * 
	 * @param {String}wikitext
	 *            wikitext to parse/check
	 * @param {String}[user_name]
	 *            测试是否有此 user name，return {Integer}此 user name 之连结数量。
	 *            若输入true表示取得依照顺序出现的使用者序列。
	 * 
	 * @returns {Integer}link count of the user name
	 * @returns {Object}normalized user name hash: hash[name] = {Integer}count
	 */
	function parse_all_user_links(wikitext, user_name) {
		function check_pattern(PATTERN_all) {
			// reset PATTERN index
			PATTERN_all.lastIndex = 0;
			var matched;
			library_namespace.debug(PATTERN_all, 3, 'parse_all_user_links');
			while (matched = PATTERN_all.exec(wikitext)) {
				// 用户名正规化。
				var name = wiki_API.normalize_title(matched[1]);
				if (!user_name || user_name === name) {
					// console.log(name);
					if (user_list) {
						user_list.push(name);
					} else if (name in user_hash) {
						user_hash[name]++;
					} else {
						user_hash[name] = 1;
					}
				}
			}
		}

		var user_hash, user_list;
		if (user_name === true) {
			user_list = [];
			user_name = null;
		} else if (user_name) {
			// user_name should be {String}user name
			user_name = wiki_API.normalize_title(user_name);
		} else {
			user_hash = Object.create(null);
		}

		if (!wikitext) {
			return user_name ? 0 : user_list || user_hash;
		}

		library_namespace.debug(wikitext, 3, 'parse_all_user_links');
		library_namespace.debug('user name: ' + user_name, 3,
				'parse_all_user_links');

		check_pattern(PATTERN_user_link_all);
		check_pattern(PATTERN_user_contributions_link_all);

		if (user_list) {
			return user_list;
		}

		if (user_name) {
			return user_name in user_hash[user_name] ? user_hash[user_name] : 0;
		}

		return user_hash;
	}

	// CeL.wiki.parse.user.all === wiki_API.parse.user.all
	parse_user.all = parse_all_user_links;

	//
	/**
	 * redirect/重定向页所符合的匹配模式。 Note that the redirect link must be explicit – it
	 * cannot contain magic words, templates, etc.
	 * 
	 * matched: [ all, "title#section" ]
	 * 
	 * zh-classical: 重新导向
	 * 
	 * @type {RegExp}
	 * 
	 * @see function p.getTargetFromText(text) @ https://en.wikipedia.org/wiki/Module:Redirect
	 *      https://zh.wikipedia.org/w/api.php?action=query&meta=siteinfo&siprop=general|namespaces|namespacealiases|statistics&utf8
	 *      https://github.com/wikimedia/mediawiki/blob/master/languages/messages/MessagesZh_hant.php
	 *      https://en.wikipedia.org/wiki/Help:Redirect
	 *      https://phabricator.wikimedia.org/T68974
	 */
	var PATTERN_redirect = /^[\s\n]*#(?:REDIRECT|重定向|重新导向|転送|リダイレクト|넘겨주기)\s*(?::\s*)?\[\[([^{}\[\]\|<>\t\n�]+)(?:\|[^\[\]{}]+?)?\]\]/i;

	/**
	 * parse redirect page. 解析重定向资讯，或判断页面是否为重定向页面。<br />
	 * 若 wikitext 重定向到其他页面，则回传其{String}页面名: "title#section"。
	 * 
	 * 应采用如下方法，可以取得 `('redirect' in page_data) && page_data.redirect === ''` 。
	 * 
	 * @example <code>

	wiki.page(title, function(page_data) {
		var redirect_to = CeL.wiki.parse.redirect(page_data);
		// `true` or {String}redirect_to or `undefined`
		console.log(redirect_to);
	});

	wiki.page(title, function(page_data) {
		var is_protected = CeL.wiki.is_protected(page_data);
		// `true` or `undefined`
		console.log(is_protected);
	}, {
		prop : 'info'
	});

	 </code>
	 * 
	 * @param {String}page_data
	 *            page data or wikitext to parse
	 * 
	 * @returns {String}title#section
	 * @returns {Undefined}Not a redirect page.
	 * 
	 * @see all_revision_SQL: page_is_redirect
	 */
	function parse_redirect(page_data) {
		var wikitext, is_page_data = wiki_API.is_page_data(page_data);
		if (is_page_data) {
			wikitext = wiki_API.content_of(page_data);
		} else {
			// treat page_data as wikitext.
			wikitext = page_data;
		}

		if (false) {
			if (Array.isArray(wikitext)) {
				throw '您可能取得了多个版本';
				// 应该用:
				// content = CeL.wiki.content_of(page_data, 0);
				// 但是却用成了:
				// content = CeL.wiki.content_of(page_data);
			}
			if (!wikitext || typeof wikitext !== 'string') {
				throw typeof wikitext;
				return;
			}
		}

		var matched = wikitext && wikitext.match(PATTERN_redirect);
		if (matched) {
			return matched[1].trim();
		}

		if (is_page_data && ('redirect' in page_data)) {
			// assert: page_data.redirect === ''
			return true;
		}

		if (false && wikitext.includes('__STATICREDIRECT__')) {
			library_namespace.debug('虽然特别指定了重定向页面的 Magic word，但是并没有发现重定向资讯。',
					3, 'parse_redirect');
		}
	}

	// ------------------------------------------------------------------------

	// const
	// ! 变数名 (不可更改) !! 变数值 !! 注解说明
	var NAME_INDEX = 0, VALUE_INDEX = 1;
	var KEY_ORIGINAL_ARRAY = typeof Symbol === 'function' ? Symbol('KEY_ORIGINAL_ARRAY')
			: '|ORIGINAL_ARRAY';

	/**
	 * 解析设定参数 wikitext configuration → JSON
	 * 
	 * 当解析发生错误的时候，应该要在设定页面的讨论页显示错误讯息。
	 * 
	 * @example <code>

	var configuration = CeL.wiki.parse.configuration(page_data);

	value = configuration[variable_name];

	</code>
	 * 
	 * 允许使用的设定格式: <code>

	(页面开头)
	注解说明(可省略)
	本页面为 [[User:bot|]] ~~~作业的设定。每次执行作业前，机器人都会从本页面读入设定。您可以更改特定数值，但请尽量不要改变本页的格式。自动生成的报表请参见：[[报告]]
	 * 请注意：变更本页面后，必须重新执行机器人程式才有效果。

	; 单一值变数名1: 变数值
	; 单一值变数名2: 变数值

	; 列表变数名1
	: 变数值1
	: 变数值2

	 == 列表变数名2 ==
	 注解说明(可省略)
	 * 变数值1
	 * <nowiki>变数值2</nowiki>

	== 列表变数名3 ==
	注解说明(可省略)
	# 变数值1
	# <nowiki>变数值2</nowiki>

	</code>
	 * 
	 * @see [[w:zh:User:Cewbot/规范多个问题模板设定]], [[w:zh:User:Cewbot/讨论页面主题列表设定]]
	 * @see 存档 旧议 [[w:zh:Template:Easy_Archive]],
	 *      [[w:en:Template:Auto_archiving_notice]],
	 *      [[w:en:Template:Setup_auto_archiving]]
	 */
	function parse_configuration(wikitext, options) {
		// 忽略 <span> 之类。
		function filter_tags(token) {
			// console.log(token);
			if (token.type === 'tag' /* || token.type === 'tag_single' */) {
				// console.log(token);
				if (token.tag in {
					nowiki : true,
					code : true,
					syntaxhighlight : true
				}) {
					// console.trace(token);
					// console.trace(token[1].toString());
					// assert: token[1].type === 'tag_inner'
					// do not show type: 'tag_attributes' when .join('')
					token[0][0] = '';
					// token = token[1];
					// token.is_nowiki = true;
					return token;
				}
				// `<b>value</b>` -> `value`
				return filter_tags(token[1]);
			}
			if (Array.isArray(token)) {
				var value = token.map(filter_tags);
				if (false) {
					// 去掉前后的空白字元。
					while (typeof value[0] === 'string' && !value[0].trim())
						value.shift();
					while (typeof value.at(-1) === 'string'
							&& !value.at(-1).trim())
						value.pop();
					// console.trace(value);
					if (value.length === 1
							&& value[0].tag === 'syntaxhighlight'
							// https://www.mediawiki.org/wiki/Extension:SyntaxHighlight#Other_markup
							&& /^JSON/i.test(value[0].attributes.lang)) {
						return value[0];
					}
				}
				value = token.toString.call(value);
				if (token.type === 'list')
					token.value = value;
				else
					return value;
			}
			return token;
		}

		function normalize_value(value) {
			// console.trace(value);
			// console.trace(JSON.stringify(value));
			// console.trace(JSON.stringify(filter_tags(value)));
			value = filter_tags(value);
			value = value.toString().trim();
			if (false) {
				var token = wiki_API.parse(value, options);
				if (token.type === 'tag' && token.tag === 'syntaxhighlight'
						&& /^JSON/i.test(token.attributes.lang)) {
					console.trace(token[1].toString());
					return JSON.parse(token[1].toString());
				}
			}

			// console.log(JSON.stringify(value));
			value = value
			// TODO: <syntaxhighlight lang="JavaScript" line start="55">
			// https://www.mediawiki.org/wiki/Extension:SyntaxHighlight
			// <source lang="cpp">
			.replace(/<\/?(?:nowiki|code|syntaxhighlight)>/g, '')
			// wikilink → page title
			.replace(/^\[\[ *:?([^{}\[\]\|<>\t\n�]+)(?:\|[^\[\]{}]+?)?\]\]$/,
					'$1')
			// Remove comments
			.replace(/<!--[\s\S]*?-->/g, '');
			try {
				// e.g., 'true' / 'false' / number
				value = JSON.parse(value);
				// TODO: 应避免安全问题。
			} catch (e) {
				// TODO: handle exception
			}
			return value;
		}

		/** {Object}设定页面/文字所获得之个人化设定/手动设定 manual settings。 */
		var configuration = Object.create(null),
		/** {String}当前使用之变数名称 */
		variable_name,
		// using wiki_API.parser()
		parsed, configuration_page_title;

		if (wiki_API.is_page_data(wikitext)) {
			variable_name = wikitext.title;
			configuration_page_title = variable_name;
			parsed = wiki_API.parser(wikitext).parse();
			// console.trace(parsed);
			// wikitext = wiki_API.content_of(wikitext);
		} else {
			// assert: typeof wikitext === 'string'
			parsed = wiki_API.parse(wikitext, options);
		}

		if (!Array.isArray(parsed)) {
			return configuration;

			return;
			throw 'Invalid configuration wikitext';
		}

		// 仅处理第一阶层。
		parsed.forEach(function(token/* , index, parent */) {
			if (token.type === 'section_title') {
				variable_name = normalize_value(token.title);
				return;
			}

			// parse table
			// @see wiki_API.table_to_array
			if (token.type === 'table' && (token.caption || variable_name)) {
				var value_hash = Object.create(null);
				token.forEach(function(line) {
					if (line.type !== 'table_row') {
						return;
					}
					if (line.header_count > 0) {
						// TODO: using the heaser data
						return;
					}
					var row = [];
					line.forEach(function(cell) {
						if (cell.type !== 'table_cell') {
							// e.g., cell.type !== 'table_attributes'
							return;
						}

						// TODO: data-sort-type in table head

						var data_type, has_list, has_non_empty_token;
						// console.log(cell);
						cell = cell.filter(function(token) {
							if (token.type !== 'table_attributes') {
								if (token.type === 'list') {
									has_list = true;
								} else {
									has_non_empty_token
									//
									= !!token.toString().trim();
								}
								return true;
							}

							// console.log(token);
							data_type = token.toString()
							// @see
							// [[w:en:Help:Sorting#Configuring the sorting]]
							// [[w:en:Help:Sorting#Specifying_a_sort_key_for_a_cell]]
							.match(
							//
							/data-sort-type\s*=\s*(["']([^"']+)["']|\S+)/);
							if (data_type) {
								data_type = data_type[2] || data_type[1];
							}
						}).map(filter_tags);
						if (!has_list) {
							// console.log(cell);
							cell.toString = function() {
								return this.join('');
							};
							cell = normalize_value(cell);
						} else if (has_non_empty_token) {
							// 有些不合格之 token。
							cell.forEach(function(token, index) {
								if (token.type === 'list')
									cell[index] = token.value;
							});
							cell = normalize_value(cell.join(''));
						} else {
							has_list = null;
							// console.trace(cell);
							cell.forEach(function(token) {
								if (token.type === 'list') {
									if (has_list) {
										has_list.append(token
												.map(normalize_value));
									} else {
										has_list = token.map(normalize_value);
									}
								}
								// 只取 list 中的值。
							});
							cell = has_list;
						}

						// console.log([ data_type, cell ]);
						if (data_type === 'number') {
							// console.log(cell);
							if (!isNaN(data_type = +cell))
								cell = data_type;
						} else if (data_type === 'isoDate') {
							data_type = Date.parse(cell
									.replace(/<[^<>]+>/g, ''));
							if (!isNaN(data_type))
								cell = new Date(data_type);
						} else if (data_type) {
							library_namespace.warn('Invalid type: ['
									+ data_type + '] ' + cell);
						}

						// console.log(cell);
						row.push(cell);
					});
					// console.log(line);
					if (row.length >= 2) {
						// ! 变数名 (不可更改) !! 变数值 !! 注解说明
						var name = row[NAME_INDEX];
						if (name && typeof name === 'string') {
							// TODO: "false" → false
							value_hash[name] = row[VALUE_INDEX];
						}
					}
				});
				value_hash[KEY_ORIGINAL_ARRAY] = token;
				configuration[token.caption || variable_name] = value_hash;
				// 仅采用第一个列表。
				if (!token.caption)
					variable_name = null;
			}

			if (token.type !== 'list')
				return;

			if (token.list_type !== wiki_API.DEFINITION_LIST) {
				if (variable_name) {
					configuration[variable_name] = token.map(normalize_value);
					// 仅采用一个列表。
					variable_name = null;
				}
				return;
			}

			token.dt_index.forEach(function(dt_index, index) {
				variable_name = normalize_value(token[dt_index]);
				if (!variable_name)
					return;
				var next_dt_index = token.dt_index[index + 1] || token.length;
				configuration[variable_name]
				// 变数的值
				= dt_index + 2 === next_dt_index
				// 仅仅提供单一数值。
				? normalize_value(token[dt_index + 1])
				// 提供了一个列表。
				: token.slice(dt_index + 1, next_dt_index)
				//
				.map(normalize_value);
			});
			variable_name = null;
		});

		// 避免被覆盖。保证用 configuration.configuration_page_title 可以检查是否由页面取得了设定。
		// 注意: 当设定页面为空的时候，无法获得这个值。
		if (configuration_page_title) {
			configuration.configuration_page_title = configuration_page_title;
		} else {
			delete configuration.configuration_page_title;
		}

		return configuration;
	}

	// CeL.wiki.parse.configuration.KEY_ORIGINAL_ARRAY
	parse_configuration.KEY_ORIGINAL_ARRAY = KEY_ORIGINAL_ARRAY;

	// ----------------------------------------------------

	// https://zh.wikipedia.org/wiki/条目#hash 说明
	// https://zh.wikipedia.org/zh-tw/条目#hash 说明
	// https://zh.wikipedia.org/zh-hans/条目#hash 说明
	// https://zh.wikipedia.org/w/index.php?title=条目
	// https://zh.wikipedia.org/w/index.php?uselang=zh-tw&title=条目
	// https://zh.m.wikipedia.org/wiki/条目#hash
	/**
	 * Wikipedia:Wikimedia sister projects 之 URL 匹配模式。
	 * 
	 * matched: [ all, 第一 domain name (e.g., language code / family / project),
	 * title 条目名称, section 章节, link说明 ]
	 * 
	 * TODO: /wiki/条目#hash 说明
	 * 
	 * TODO: https://zh.wikipedia.org/zh-tw/标题 →
	 * https://zh.wikipedia.org/w/index.php?title=标题&variant=zh-tw
	 * 
	 * @type {RegExp}
	 * 
	 * @see PATTERN_PROJECT_CODE
	 * @see PATTERN_URL_GLOBAL, PATTERN_URL_WITH_PROTOCOL_GLOBAL,
	 *      PATTERN_URL_prefix, PATTERN_WIKI_URL, PATTERN_wiki_project_URL,
	 *      PATTERN_external_link_global
	 * @see https://en.wikipedia.org/wiki/Wikipedia:Wikimedia_sister_projects
	 */
	var PATTERN_WIKI_URL = /^(?:https?:)?\/\/([a-z][a-z\d\-]{0,14})\.(?:m\.)?wikipedia\.org\/(?:(?:wiki|zh-[a-z]{2,4})\/|w\/index\.php\?(?:uselang=zh-[a-z]{2}&)?title=)([^ #]+)(#[^ ]*)?( .+)?$/i;

	/**
	 * Convert URL to wiki link.
	 * 
	 * TODO: 在 default language 非 zh 时，使用 uselang, /zh-tw/条目 会有问题。 TODO: [[en
	 * link]] → [[:en:en link]] TODO: use {{tsl}} or {{link-en}},
	 * {{en:Template:Interlanguage link multi}}.
	 * 
	 * TODO: 与 wiki_API.title_link_of() 整合。
	 * 
	 * @param {String}URL
	 *            URL text
	 * @param {Boolean}[need_add_quote]
	 *            是否添加 [[]] 或 []。
	 * @param {Function}[callback]
	 *            回调函数。 callback({String}wiki link)
	 * @param {Object}[options]
	 *            附加参数/设定选择性/特殊功能与选项
	 * 
	 * @returns {String}wiki link
	 * 
	 * @see [[WP:LINK#跨语言链接]]
	 */
	function URL_to_wiki_link(URL, need_add_quote, callback, options) {
		URL = URL.trim();
		// URL = URL.replace(/[\s\n]+/g, ' ');

		var matched = URL.match(PATTERN_WIKI_URL);
		if (!matched) {
			library_namespace.debug('Cannot parse URL: [' + URL
					+ ']. Not a wikipedia link?', 3, 'URL_to_wiki_link');
			if (need_add_quote) {
				if (PATTERN_URL_prefix.test(URL)) {
					// 当作正常外部连结 external link。
					// e.g., 'http://a.b.c ABC'

					// TODO: parse.
					// @see function fix_86() @ 20151002.WPCHECK.js
					// matched = URL.match(/^([^\|]+)\|(.*)$/);

					URL = '[' + URL + ']';
				} else {
					// 当作正常内部连结 wikilink / internal link。
					// e.g., 'ABC (disambiguation)|ABC'
					URL = wiki_API.title_link_of(URL);
				}
			}
			if (callback) {
				callback(URL);
			}
			return URL;
		}

		/** {String}章节 = URL hash */
		var section = matched[3] || '';
		// for [[:mw:Multimedia/Media Viewer]],
		// [[:mw:Extension:MultimediaViewer|媒体检视器]]
		if (section) {
			if (section.startsWith('#/media/File:')) {
				// 8 === '#/media/'.length
				return section.slice(8);
			}

			// 须注意: 对某些 section 可能 throw！
			try {
				section = decodeURIComponent(section.replace(/\./g, '%'));
			} catch (e) {
				// TODO: handle exception
			}
		}

		/** {String}URL之语言 */
		var language = matched[1].toLowerCase(),
		/** {String}条目名称 */
		title = decodeURIComponent(matched[2]);

		function compose_link() {
			var link = (language === wiki_API.language ? ''
			//
			: ':' + language + ':') + title + section
			// link 说明
			+ (matched[4] && (matched[4] = matched[4].trim())
			//
			!== title ? '|' + matched[4]
			// [[Help:编辑页面#链接]]
			// 若"|"后直接以"]]"结束，则储存时会自动添加连结页面名。
			: !section && /\([^()]+\)$/.test(title)
			// e.g., [[title (type)]] → [[title (type)|title]]
			// 在 <gallery> 中，"[[title (type)|]]" 无效，因此需要明确指定。
			? '|' + title.replace(/\s*\([^()]+\)$/, '') : '');

			if (need_add_quote) {
				link = wiki_API.title_link_of(link);
			}

			return link;
		}

		// 无 callback，直接回传 link。
		if (!callback) {
			return compose_link();
		}

		// 若非外 project 或不同 language，则直接 callback(link)。
		if (section || language === wiki_API.language) {
			callback(compose_link());
			return;
		}

		// 尝试取得本 project 之对应连结。
		wiki_API.langlinks([ language, title ], function(to_title) {
			if (to_title) {
				language = wiki_API.language;
				title = to_title;
				// assert: section === ''
			}
			callback(compose_link());
		}, wiki_API.language, options);
	}

	// ----------------------------------------------------

	// Using JSON.parse() instead of eval()
	function eval_object(code) {
		// library_namespace.log('eval_object: eval(' + code + ')');
		// console.log(code);
		// code = eval(code);

		code = code.trim();
		if (code.startsWith("'") && code.endsWith("'")) {
			// '' to ""
			code = code.replace(
					/\\(.)|(.)/g,
					function(all, escaped_character, character) {
						if (character)
							return character === '"' ? '\\"' : all;
						return /^["\\\/bfnrtu]$/.test(escaped_character) ? all
								: escaped_character;
					}).replace(/^'|'$/g, '"');
			code = code.replace(/\t/g, '\\t');
		} else if (code.startsWith('"') && code.endsWith('"')) {
			code = code.replace(/\\(.)/g, function(all, escaped_character) {
				return /^["\\\/bfnrtu]$/.test(escaped_character) ? all
						: escaped_character;
			});
			code = code.replace(/\t/g, '\\t');
		}
		try {
			return JSON.parse(code);
		} catch (e) {
			console.trace('eval_object: Failed to parse code.');
			console.log(JSON.stringify(code));
			throw e;
		}
	}

	// 简易但很有可能出错的 converter。
	// object = CeL.wiki.parse.lua_object(page_data.wikitext);
	// @see https://www.lua.org/manual/5.3/manual.html#3.1
	// TODO: secutity check
	function parse_lua_object_code(lua_code, options) {
		options = library_namespace.setup_options(options);
		lua_code = wiki_API.content_of(lua_code);
		if (!options.force_parse
				&& !/^[;\s\n]*return[\s\n]*{/.test(lua_code.replace(
						/(\n|^)[;\s]*--[^\n]*/g, ''))) {
			library_namespace.warn('parse_lua_object_code: Invalid lua code? '
			//
			+ (typeof lua_code === 'string' && lua_code.length > 200
			//
			? lua_code.slice(0, 200) + '...' : lua_code));
			return;
		}

		// --------------------------------------
		// 将所有 String 转存至 __strings，方便判别 Array, Object。

		var __strings = [];
		library_namespace.debug("转存 `[=[ string ]=]`", 7,
				'parse_lua_object_code');
		// an opening long bracket of level 1 is written as [=[, and so on.
		lua_code = lua_code.replace(/\[(=*)\[([\s\S]*?)\](?:\1)\]/g, function(
				all, equal_signs, string) {
			// 另外储存起来以避免干扰。
			// e.g., [[w:zh:Module:CGroup/Physics]]
			__strings.push(string);
			return "__strings[" + (__strings.length - 1) + "]";
		});

		library_namespace.debug(
				"Convert `\"string\"`, `'string'` to \"string\"", 6,
				'parse_lua_object_code');
		// console.trace(lua_code);
		lua_code = lua_code
				.replace(
						/("(?:\\[\s\S]|[^\\\n"])*"|'(?:\\[\s\S]|[^\\\n'])*')(?:\\t|[\s\n]|--[^\n]*\n)*(?:(\.\.)(?:\\t|[\s\n]|--[^\n]*\n)*)?/g,
						function(all, string, concatenation) {
							string = eval_object(string);
							return JSON.stringify(string)
									+ (concatenation || '');
						});
		// console.trace(lua_code);
		if (false) {
			library_namespace
					.debug(
							"remove comments after / between strings: `''..\\n--\\n''` , ``''--`",
							6, 'parse_lua_object_code');
			// console.trace(lua_code);
			lua_code = lua_code
					.replace_till_stable(
							/"((?:\\[\s\S]|[^\\"])*)"(?:\\t|[\s\n])*(\.\.(?:\\t|[\s\n])*)?--[^\n]*/g,
							'$1$2');
		}

		// --------------------------------------

		// prevent patch fieldsep ::= ‘,’ | ‘;’ below
		// 必须是在富源干不会被更动的代码!
		var MARK_as_object = '\0as_object';
		// console.trace([ lua_code.slice(0, 800), lua_code.slice(-800) ]);

		// e.g., parse
		// https://raw.githubusercontent.com/wikimedia/mediawiki/master/includes/languages/data/ZhConversion.php
		lua_code = lua_code.replace(
		// e.g., ["A"=>"B","C"=>"D",]
		/\[\s*((?:"[^"]*"\s*=>\s*"[^"]*"\s*(?:,\s*)?)+)\]/g,
		// → {"A":"B","C":"D",}
		function(all, inner) {
			if (false) {
				console.trace([ inner.length, inner.slice(0, 800),
						inner.slice(-800) ]);
			}
			inner = inner.replace(/("[^"]*")\s*=>\s*("[^"]*")/g, function(all,
					from, to) {
				return from + ':' + to;
			});
			return MARK_as_object + inner.replace(/,\s*$/, '') + '}';
		});

		// --------------------------------------

		library_namespace.debug('concat `"string".."string"`', 6,
				'parse_lua_object_code');
		// Lua denotes the string concatenation operator by " .. " (two dots).
		lua_code = lua_code.replace_till_stable(
				/("(?:\\[\s\S]|[^\\"])+)"(?:\\t|[\s\n])*\.\.(?:\\t|[\s\n])*"/g,
				'$1');

		// --------------------------------------

		library_namespace.debug('转存 `"string"`', 6, 'parse_lua_object_code');
		// console.trace(lua_code);
		lua_code = lua_code.replace(/"(?:\\[\s\S]|[^\\\n"])*"/g, function(all) {
			// library_namespace.log(all);
			__strings.push(JSON.parse(all));
			return "__strings[" + (__strings.length - 1) + "]";
		});

		// --------------------------------------

		// 必须先处理完字串才能消掉 comments，预防有 "--a--"。

		// fix `-- comments` → `// comments`
		// lua_code = lua_code.replace(/([\n\s]|^)\s*--/g, '$1//');
		// fix `-- comments` → 直接消掉
		// lua_code = lua_code.replace(/([\n\s]|^)\s*--[^\n]*/g, '$1');
		library_namespace.debug('remove all -- comments', 6,
				'parse_lua_object_code');
		// console.trace(lua_code);
		lua_code = lua_code.replace(/--[^\n]*/g, '');

		// --------------------------------------
		var __table_values = [];
		library_namespace.debug('patch fieldsep ::= ‘,’ | ‘;’', 6,
				'parse_lua_object_code');
		// console.trace(lua_code);
		lua_code = lua_code.replace_till_stable(/{([^{}]+)}/g, function(all,
				fieldlist) {
			// console.log(fieldlist);
			var object_value = {},
			// patch {Array}table: `{ field, field, ... }`
			// field ::= ‘[’ exp ‘]’ ‘=’ exp | Name ‘=’ exp | exp
			// fields of the form exp are equivalent to [i] = exp, where i are
			// consecutive integers starting with 1.
			// [,]
			array_value = new Array(1);

			fieldlist = fieldlist.split(/[,;]/);
			fieldlist = fieldlist.forEach(function(field) {
				field = field.trim();
				if (!field) {
					// assert: the last field
					return;
				}
				var matched = field.match(
				//
				/^\[([\s\n]*__strings\[\d+\][\s\n]*)\][\s\n]*=([\s\S]+)$/
				//
				) || field.match(/^\[([\s\S]+)\][\s\n]*=([\s\S]+)$/);
				if (matched) {
					matched[1] = eval_object(matched[1]);
					object_value[matched[1]] = matched[2].trim();
					return;
				}

				// patch {Object}table: `{ name = exp }` → `{ name : exp }`
				matched = field.match(/^([\w]+)[\s\n]*=([\s\S]+)$/);
				if (matched) {
					object_value[matched[1]] = matched[2].trim();
					return;
				}

				array_value.push(field);
			});

			if (array_value.length > 1) {
				if (library_namespace.is_empty_object(object_value)) {
					__table_values.push(array_value);
				} else {
					// mixed array, object
					array_value.forEach(function(item, index) {
						if (index > 0)
							object_value[index] = item;
					});

					__table_values.push(object_value);
				}
			} else {
				__table_values.push(object_value);
			}

			return '__table_values[' + (__table_values.length - 1) + ']';
		});

		// --------------------------------------

		// Recover MARK_as_object
		// console.trace([ lua_code.slice(0, 800), lua_code.slice(-800) ]);
		lua_code = lua_code.replace(new RegExp(MARK_as_object, 'g'), '{');
		// console.trace([ lua_code.slice(0, 800), lua_code.slice(-800) ]);

		// --------------------------------------

		function recovery_code(code) {
			if (!code) {
				return code;
			}
			return code.replace(/__table_values\[(\d+)\]/g,
			//
			function(all, index) {
				var table_value = __table_values[+index];
				// console.log(table_value);
				if (Array.isArray(table_value)) {
					table_value = table_value.map(recovery_code);
					if (table_value[0] === undefined)
						table_value[0] = JSON.stringify(null);
					// console.log('[' + table_value + ']');
					// console.log(table_value);
					return '[' + table_value + ']';
				}

				var value_list = [];
				for ( var name in table_value)
					value_list.push(JSON.stringify(name) + ':'
							+ recovery_code(table_value[name]));
				return '{' + value_list + '}';
			});
		}

		library_namespace.debug('recovery_code...', 6, 'parse_lua_object_code');
		// console.trace(lua_code);
		lua_code = recovery_code(lua_code);

		// --------------------------------------

		// console.trace(lua_code);
		lua_code = lua_code.replace_till_stable(/([\W])nil([\W])/g, '$1null$2');

		// TODO: or, and

		if (false) {
			library_namespace.log(lua_code);
			lua_code = lua_code.replace(/([{,])\s*([a-z_][a-z_\d]*)\s*:/g,
					'$1"$2":');
			console.log(lua_code.replace_till_stable(
			//
			/\{(\s*[a-z_][a-z_\d]*\s*:\s*[a-z_][a-z_\d]*(\[\d+\])?\s*\,?)*\}/i,
					'_'));
		}
		lua_code = lua_code.replace(/__strings\[(\d+)\]/g, function(all, id) {
			return JSON.stringify(__strings[id]);
		});
		// lua_code = eval('(function(){' + lua_code + '})()');

		lua_code = lua_code.replace(/^[;\s\n]*return[\s\n]*{/, '{');
		lua_code = lua_code.replace(/\t/g, '\\t');

		// console.log(JSON.stringify(lua_code));
		try {
			lua_code = JSON.parse(lua_code);
		} catch (e) {
			library_namespace
					.error('parse_lua_object_code: Cannot parse code as JSON: '
					//
					+ JSON.stringify(lua_code
					// .slice(0)
					));
			// TODO: handle exception
			return;
		}
		// console.trace(lua_code);

		return lua_code;
	}

	// 简易快速但很有可能出错的 parser。
	// e.g.,
	// CeL.wiki.parse.every('{{lang}}','~~{{lang|en|ers}}ff{{ee|vf}}__{{lang|fr|fff}}@@{{lang}}',function(token){console.log(token);})
	// CeL.wiki.parse.every('{{lang|ee}}','~~{{lang|en|ers}}ff{{ee|vf}}__{{lang|fr|fff}}@@{{lang}}',function(token){console.log(token);})
	// CeL.wiki.parse.every(['template','lang'],'~~{{lang|en|ers}}ff{{ee|vf}}__{{lang|fr|fff}}@@{{lang}}',function(token){console.log(token);})
	// CeL.wiki.parse.every(/{{[Ll]ang\b[^{}]*}}/g,'~~{{lang|en|ers}}ff{{ee|vf}}__{{lang|fr|fff}}@@{{lang}}',function(token){console.log(token);},CeL.wiki.parse.template)
	function parse_every(pattern, wikitext, callback, parser) {
		// assert: pattern.global === true
		var matched, count = 0;

		if (!parser) {
			if (typeof pattern === 'string'
					&& (matched = pattern.match(/{{([^{}]+)}}/)))
				pattern = [ 'template', matched[1] ];

			if (Array.isArray(pattern)) {
				parser = wiki_API.parse[matched = pattern[0]];
				pattern = pattern[1];
				if (typeof pattern === 'string') {
					if (matched === 'template')
						pattern = new RegExp('{{ *(?:' + pattern
								+ ')(?:}}|[^a-z].*?}})', 'ig');
				}
			}
		}

		while (matched = pattern.exec(wikitext)) {
			if (parser) {
				var data = matched;
				matched = parser(matched[0]);
				if (!matched)
					// nothing got.
					continue;

				// 回复 recover index
				matched.index = data.index;
			}

			matched.lastIndex = pattern.lastIndex;
			matched.count = count++;
			callback(matched);
		}
	}

	function parse_timestamp(timestamp) {
		// return Date.parse(timestamp);
		return new Date(timestamp);
	}

	// ------------------------------------------------------------------------

	// export 导出.

	// CeL.wiki.parse.*
	// CeL.wiki.parser(wikitext) 传回 parser，可作 parser.parse()。
	// CeL.wiki.parse.*(wikitext) 仅处理单一 token，传回 parse 过的 data。
	// TODO: 统合于 CeL.wiki.parser 之中。
	Object.assign(wiki_API.parse, {
		template : parse_template,
		set_template_object_parameters : set_template_object_parameters,
		template_object_to_wikitext : template_object_to_wikitext,
		// CeL.wiki.parse.replace_parameter()
		replace_parameter : replace_parameter,

		// wiki_API.parse.date()
		date : parse_date,
		// timestamp : parse_timestamp,
		user : parse_user,
		// CeL.wiki.parse.redirect , wiki_API.parse.redirect
		redirect : parse_redirect,

		// anchor : get_all_anchors,

		configuration : parse_configuration,

		wiki_URL : URL_to_wiki_link,

		lua_object : parse_lua_object_code,

		every : parse_every
	});

	// --------------------------------------------------------------------------------------------

	// 不设定(hook)本 module 之 namespace，仅执行 module code。
	return library_namespace.env.not_to_extend_keyword;
}
