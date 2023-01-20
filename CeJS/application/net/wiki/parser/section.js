/**
 * @name CeL function for MediaWiki (Wikipedia / 维基百科): parse sections and
 *       anchors
 * 
 * @fileoverview 本档案包含了 MediaWiki 自动化作业用程式库的子程式库。
 * 
 * TODO:<code>

</code>
 * 
 * @since 2021/12/15 6:7:47 拆分自 CeL.application.net.wiki.parser 等
 */

// More examples: see /_test suite/test.js
// Wikipedia bots demo: https://github.com/kanasimi/wikibot
'use strict';
// 'use asm';

// --------------------------------------------------------------------------------------------

// 不采用 if 陈述式，可以避免 Eclipse JSDoc 与 format 多缩排一层。
typeof CeL === 'function' && CeL.run({
	// module name
	name : 'application.net.wiki.parser.section',

	require : 'application.net.wiki.parser.'
	//
	+ '|application.net.wiki.parser.wikitext',

	// 设定不汇出的子函式。
	no_extend : 'this,*',

	// 为了方便格式化程式码，因此将 module 函式主体另外抽出。
	code : module_code
});

function module_code(library_namespace) {

	// requiring
	var wiki_API = library_namespace.application.net.wiki, KEY_SESSION = wiki_API.KEY_SESSION;
	// @inner
	var PATTERN_BOT_NAME = wiki_API.PATTERN_BOT_NAME;
	var for_each_token = wiki_API.parser.parser_prototype.each;

	var
	/** {Number}未发现之index。 const: 基本上与程式码设计合一，仅表示名义，不可更改。(=== -1) */
	NOT_FOUND = ''.indexOf('_');

	// --------------------------------------------------------------------------------------------

	// 这些 <tag> 都不能简单解析出来。
	// @see wiki_extensiontags
	var untextify_tags = {
		ref : true,
		// e.g., <references group="gg"/>
		references : true,
		math : true
	};

	// Is {String} and will not used in normal wikitext or parse_wikitext().
	var element_placeholder = '__element_placeholder__',
	//
	PATTERN_element_placeholder = new RegExp(element_placeholder, 'g');

	// @inner
	function preprocess_section_link_token(token, options) {
		// console.trace(token);
		if (!token) {
			// e.g., CeL.wiki.parse('=={{lang|en}}==')
			return token;
		}

		// 前置作业: 处理模板之类特殊节点。
		if (typeof options.preprocess_section_link_token === 'function') {
			token = options.preprocess_section_link_token(token, options);
		}
		// console.log(token);

		token = wiki_API.repeatedly_expand_template_token(token, options);
		// console.trace(token);

		// ------------------------

		if (token.type in {
			plain : true,
			tag_inner : true
		}) {
			for_each_token.call(token, function(sub_token, index, parent) {
				// console.trace(sub_token);
				sub_token = preprocess_section_link_token(sub_token, options);
				// console.trace(sub_token);
				return sub_token;
			}, options);
			return token;
		}

		if (token.type === 'comment') {
			return '';
		}

		if (token.type === 'hr') {
			return token.toString();
		}

		// console.log(token);
		if (token.type === 'tag'/* || token.type === 'tag_single' */) {
			// token: [ tag_attributes, tag_inner ]
			if (token.tag === 'nowiki') {
				// escape characters inside <nowiki>
				return preprocess_section_link_token(token[1] ? token[1]
						.toString() : '', options);
			}

			// 容许一些特定标签能够显示格式。以继承原标题的粗体斜体和颜色等等格式。
			// @see markup_tags
			if (token.tag in {
				// 展现格式用的 tags
				b : true,
				i : true,
				q : true,
				s : true,
				u : true,
				big : true,
				small : true,
				sub : true,
				sup : true,
				em : true,
				ins : true,
				del : true,
				strike : true,
				strong : true,
				mark : true,
				font : true,
				code : true,
				ruby : true,
				rb : true,
				rt : true,
				center : true,
				// container
				span : true,
				div : true,

				// nowiki : true,
				langconvert : true
			}) {
				// reduce HTML tags. e.g., <b>, <sub>, <sup>, <span>
				token.tag_attributes = token.shift();
				token.original_type = token.type;
				token.type = 'plain';
				token.toString = wiki_API.parse.wiki_token_toString[token.type];
				return token;
			}

			// console.trace(token);

			// 其他 HTML tag 大多无法准确转换。
			options.root_token_list.imprecise_tokens.push(token);

			if (token.tag in untextify_tags) {
				// trick: 不再遍历子节点。避免被进一步的处理。
				token.is_atom = true;
				token.unconvertible = true;
				return token;
			}

			// TODO: <a>

			// token that may be handlable 请检查是否可处理此标题。
			options.root_token_list.tokens_maybe_handlable.push(token);
			// reduce HTML tags. e.g., <ref>
			var new_token = preprocess_section_link_tokens(token[1] || '',
					options);
			new_token.tag = token.tag;
			return new_token;
		}

		if (token.type === 'tag_single') {
			if (token.tag in {
				templatestyles : true,
				// For {{#lst}}, {{#section:}}
				// [[w:en:Help:Labeled section transclusion]]
				// e.g., @ [[w:en:Island Line, Isle of Wight]]
				section : true,
				// hr : true,
				// e.g., <br />
				br : true,
				nowiki : true
			}) {
				return '';
			}

			options.root_token_list.imprecise_tokens.push(token);

			// 从上方 `token.type === 'tag'` 复制过来的。
			if (token.tag in untextify_tags) {
				// trick: 不再遍历子节点。避免被进一步的处理。
				token.is_atom = true;
				token.unconvertible = true;
				return token;
			}

			// token that may be handlable 请检查是否可处理此标题。
			options.root_token_list.tokens_maybe_handlable.push(token);
			return token;
		}

		if (false && token.type === 'convert') {
			// TODO: e.g., '==-{[[:三宝颜共和国]]}-=='
			token = token.converted;
			// 接下来交给 `token.type === 'link'` 处理。
		}

		if ((token.type === 'file' || token.type === 'category')
				&& !token.is_link) {
			// 显示时，TOC 中的图片、分类会被消掉，图片在内文中才会显现。
			return options.use_element_placeholder ? element_placeholder : '';
		}

		// TODO: interlanguage links will be treated as normal link!
		if (token.type === 'link' || token.type === 'category'
		// e.g., [[:File:file name.jpg]]
		|| token.type === 'file') {
			// escape wikilink
			// return display_text
			if (token.length > 2) {
				token = token.slice(2);
				token.type = 'plain';
				// @see wiki_API.parse.wiki_token_toString.file, for
				// token.length > 2
				token.toString = function() {
					return this.join('|')
				};
				token = preprocess_section_link_tokens(token, options);
			} else {
				// 去掉最前头的 ":"。 @see wiki_API.parse.wiki_token_toString
				token = token[0].toString().replace(/^ *:?/, '') + token[1];
			}
			// console.log(token);
			return token;
		}

		// 这边仅处理常用模板。需要先保证这些模板存在，并且具有预期的功能。
		// 其他常用 template 可加在 wiki.template_functions[site_name] 中。
		//
		// 模板这个部分除了解析模板之外没有好的方法。
		// 正式应该采用 parse 或 expandtemplates 解析出实际的 title，之后 callback。
		// https://www.mediawiki.org/w/api.php?action=help&modules=parse
		if (token.type === 'transclusion') {
			// 各语言 wiki 常用 template-linking templates:
			// {{Tl}}, {{Tlg}}, {{Tlx}}, {{Tls}}, {{T1}}, ...
			if (/^(?:T[l1n][a-z]{0,3}[23]?)$/.test(token.name)) {
				// TODO: should expand as
				// "&#123;&#123;[[Template:{{{1}}}|{{{1}}}]]&#125;&#125;"
				token.shift();
				return token;
			}

			if ((token.name in {
				// {{lang|语言标签|内文}}
				Lang : true
			}) && token.parameters[2]) {
				return preprocess_section_link_token(token.parameters[2],
						options);
			}

			// moved to CeL.application.net.wiki.template_functions.zhmoegirl
			if (false
					&& token.name === 'Lj'
					&& wiki_API.site_name(wiki_API.session_of_options(options)) === 'zhmoegirl') {
				return preprocess_section_link_token(wiki_API.parse('-{'
						+ token.parameters[1] + '}-'), options);
			}

			// TODO: [[Template:User link]], [[Template:U]]

			// TODO: [[Template:疑问]], [[Template:Block]]

			// console.trace(token);

			// 警告: 在遇到标题包含模板时，因为不能解析连模板最后产出的结果，会产生错误结果。
			options.root_token_list.imprecise_tokens.push(token);
			// trick: 不再遍历子节点。避免被进一步的处理。
			token.is_atom = true;
			token.unconvertible = true;
			return token;
		}

		if (token.type === 'external_link') {
			// escape external link
			// console.log('>> ' + token);
			// console.log(token[2]);
			// console.log(preprocess_section_link_tokens(token[2], options));
			if (token[2]) {
				return preprocess_section_link_tokens(token[2], options);
			}
			// TODO: error: 用在[URL]无标题连结会失效。需要计算外部连结的序号。
			options.root_token_list.imprecise_tokens.push(token);
			// trick: 不再遍历子节点。避免被进一步的处理。
			token.is_atom = true;
			token.unconvertible = true;
			return token;
		}

		if (token.type === 'switch') {
			options.root_token_list.imprecise_tokens.push(token);
			return '';
		}

		if (token.type === 'bold' || token.type === 'italic') {
			// 去除粗体与斜体。
			token.original_type = token.type;
			token.type = 'plain';
			token.toString = wiki_API.parse.wiki_token_toString[token.type];
			return token;
		}

		if (typeof token === 'string') {
			// console.log('>> ' + token);
			// console.log('>> [' + index + '] ' + token);
			// console.log(parent);

			// decode '&quot;', '%00', ...
			token = library_namespace.HTML_to_Unicode(token);
			if (/\S/.test(token)) {
				// trick: 不再遍历子节点。避免被进一步的处理，例如"&amp;amp;"。
				token = [ token ];
				token.is_atom = true;
				token.unconvertible = true;
				token.is_plain = true;
			}
			// console.trace(token);
			return token;
		}

		if (token.type in {
			convert : true,
			url : true
		}) {
			// 其他可处理的节点。
			return token;
		}

		// console.trace(token);
		if (token.type in {
			magic_word_function : true,
			parameter : true
		}) {
			// TODO: return token.evaluate()
			token.unconvertible = true;
		}

		// console.trace(token);

		// token that may be handlable 请检查是否可处理此标题。
		if (!token.unconvertible)
			options.root_token_list.tokens_maybe_handlable.push(token);
		if (!token.is_plain) {
			// `token.is_plain`: 由 {String} 转换而成。
			options.root_token_list.imprecise_tokens.push(token);
		}
		return token;
	}

	// @inner
	function preprocess_section_link_tokens(tokens, options) {
		if (tokens.type !== 'plain') {
			tokens = wiki_API.parse.set_wiki_type([ tokens ], 'plain');
		}

		if (false) {
			library_namespace.info('preprocess_section_link_tokens: tokens:');
			console.log(tokens);
		}
		// console.trace(tokens);

		if (!tokens.imprecise_tokens) {
			// options.root_token_list.imprecise_tokens
			tokens.imprecise_tokens = [];
			tokens.tokens_maybe_handlable = [];
		}

		if (!options.root_token_list)
			options.root_token_list = tokens;

		options.modify = true;

		// console.trace(tokens);
		return preprocess_section_link_token(tokens, options);
	}

	// TODO: The method now is NOT a good way!
	// extract_plain_text_of_wikitext(), get_plain_display_text()
	// @see [[w:en:Module:Delink]]
	// 可考虑是否采用 CeL.wiki.expand_transclusion()
	function wikitext_to_plain_text(wikitext, options) {
		options = library_namespace.new_options(options);

		wikitext = wiki_API.parse(String(wikitext), options);
		// console.trace(wikitext);
		wikitext = preprocess_section_link_tokens(wikitext, options);

		// console.trace(wikitext);
		return wikitext.toString();
	}

	// --------------------------------

	// 用在 summary 必须设定 is_URI !
	function section_link_escape(text, is_URI) {
		// escape wikitext control characters,
		// including language conversion -{}-
		if (true) {
			text = text.replace(
			// 尽可能减少字元的使用量，因此仅处理开头，不处理结尾。
			// @see [[w:en:Help:Wikitext#External links]]
			// @see PATTERN_page_name
			is_URI ? /[\|{}<>\[\]%]/g
			// 为了容许一些特定标签能够显示格式，"<>"已经在preprocess_section_link_token(),section_link()里面处理过了。
			// display_text 在 "[[", "]]" 中，不可允许 "[]"
			: /[\|{}<>]/g && /[\|{}\[\]]/g,
			// 经测试 anchor 亦不可包含[\[\]{}\t\n�]。
			function(character) {
				if (is_URI) {
					return '%' + character.charCodeAt(0)
					// 会比 '&#' 短一点。
					.toString(16).toUpperCase();
				}
				return '&#' + character.charCodeAt(0) + ';';
			}).replace(/[ \n]{2,}/g, ' ');
		} else {
			// 只处理特殊字元而不是采用encodeURIComponent()，这样能够保存中文字，使其不被编码。
			text = encodeURIComponent(text);
		}

		return text;
	}

	// @inner
	// return [[维基连结]]
	// TODO: using external link to display "�"
	function section_link_toString(page_title, style) {
		var anchor = (this[1] || '').replace(/�/g, '?'),
		// 目前 MediaWiki 之 link anchor, display_text 尚无法接受
		// REPLACEMENT CHARACTER U+FFFD "�" 这个字元。
		display_text = (this[2] || '').replace(/�/g, '?');

		display_text = display_text ?
		//
		style ? '<span style="' + style + '">' + display_text + '</span>'
				: display_text : '';

		return wiki_API.title_link_of((page_title || this[0] || '') + '#'
				+ anchor, display_text);
		return '[[' + (page_title || this[0] || '') + '#' + anchor + '|'
				+ display_text + ']]';
	}

	// 用来保留 display_text 中的 language conversion -{}-，
	// 必须是标题里面不会存在的字串，并且也不会被section_link_escape()转换。
	var section_link_START_CONVERT = '\x00\x01', section_link_END_CONVERT = '\x00\x02',
	//
	section_link_START_CONVERT_reg = new RegExp(library_namespace
			.to_RegExp_pattern(section_link_START_CONVERT), 'g'),
	//
	section_link_END_CONVERT_reg = new RegExp(library_namespace
			.to_RegExp_pattern(section_link_END_CONVERT), 'g');

	// wiki_API.section_link.pre_parse_section_title()
	function pre_parse_section_title(parameters, options, queue) {
		parameters = parameters.toString()
		// 先把前头的空白字元提取出来，避免被当作 <pre>。
		// 先把前头的列表字元提取出来，避免被当作 list。
		// 这些会被当作普通文字。
		.match(/^([*#;:=\s]*)([\s\S]*)$/);
		// console.trace(parameters);
		var prefix = parameters[1];
		// 经过改变，需再进一步处理。
		parameters = wiki_API.parse(parameters[2], options, queue);
		// console.trace(parameters);
		if (parameters.type !== 'plain') {
			parameters = wiki_API.parse.set_wiki_type([ parameters ], 'plain');
		}
		if (prefix) {
			if (typeof parameters[0] === 'string')
				parameters[0] = prefix + parameters[0];
			else
				parameters.unshift(prefix);
		}
		return parameters;
	}

	section_link.pre_parse_section_title = pre_parse_section_title;

	/**
	 * 从话题/议题/章节标题产生连结到章节标题的wikilink。
	 * 
	 * @example <code>

	// for '== section_title ==',
	CeL.wiki.section_link('section_title')

	</code>
	 * 
	 * @param {String}section_title
	 *            section title in wikitext inside "==" (without '=='s). 章节标题。
	 *            节のタイトル。
	 * @param {Object}[options]
	 *            附加参数/设定选择性/特殊功能与选项
	 * 
	 * @returns {Array}link object (see below)
	 * 
	 * @see [[phabricator:T18691]] 未来章节标题可能会有分享连结，这将更容易连结到此章节。
	 * @see [[H:MW]], {{anchorencode:章节标题}}, [[Template:井戸端から诱导の使用]], escapeId()
	 * @see https://phabricator.wikimedia.org/T152540
	 *      https://lists.wikimedia.org/pipermail/wikitech-l/2017-August/088559.html
	 */
	function section_link(section_title, options) {
		if (typeof options === 'string') {
			options = {
				page_title : options
			};
		} else if (typeof options === 'function') {
			options = {
				// TODO
				callback : options
			};
		} else {
			options = library_namespace.new_options(options);
			options.use_element_placeholder = true;
		}

		// console.trace(wiki_API.parse(section_title, null, []));
		// TODO: "==''==text==''==\n"
		var parsed_title = pre_parse_section_title(section_title, options);
		// pass session.
		parsed_title = preprocess_section_link_tokens(parsed_title, options);

		// 注意: 当这空白字字出现在功能性token中时，可能会出错。
		var id = parsed_title.toString().trim().replace(
				PATTERN_element_placeholder, '')
		//
		.replace(/[ \n]{2,}/g, ' '),
		// anchor 网页锚点: 可以直接拿来做 wikilink anchor 的章节标题。
		// 有多个完全相同的 anchor 时，后面的会加上"_2", "_3",...。
		// 这个部分的处理请见 function for_each_section()
		anchor = section_link_escape(id
		// 处理连续多个空白字元。长度相同的情况下，尽可能保留原貌。
		.replace(/([ _]){2,}/g, '$1').replace(/&/g, '&amp;'), true);

		// var session = wiki_API.session_of_options(options);
		// TODO: for zhwiki, the anchor should NOT includes "-{", "}-"

		// console.log(parsed_title);
		for_each_token.call(parsed_title, function(token, index, parent) {
			if (token.type === 'convert') {
				// @see wiki_API.parse.wiki_token_toString.convert
				// return token.join(';');
				token.toString = function convert_for_recursion() {
					var converted = this.converted;
					if (converted === undefined) {
						// e.g., get display_text of
						// '==「-{XX-{zh-hans:纳; zh-hant:纳}-克}-→-{XX-{奈}-克}-」=='
						return section_link_START_CONVERT
						// @see wiki_API.parse.wiki_token_toString.convert
						+ this.join(';') + section_link_END_CONVERT;
					}
					if (Array.isArray(converted)) {
						// e.g., '==-{[[:三宝颜共和国]]}-=='
						converted = converted.toString()
						// e.g.,
						// '==「-{XX-{zh-hans:纳; zh-hant:纳}-克}-→-{XX-{奈}-克}-」=='
						// recover language conversion -{}-
						.replace(section_link_START_CONVERT_reg, '-{').replace(
								section_link_END_CONVERT_reg, '}-');
						converted = section_link(converted, Object.assign(
						//
						Object.clone(options), {
							// recursion, self-calling, 递回呼叫
							is_recursive : true
						}))[2];
					}
					return section_link_START_CONVERT
					// + this.join(';')
					+ converted + section_link_END_CONVERT;
				};
			} else if (token.original_type) {
				// revert type
				token.type = token.original_type;
				token.toString
				//
				= wiki_API.parse.wiki_token_toString[token.type];
				// 保留 display_text 中的 ''', '', <b>, <i>, <span> 属性。
				if (token.type === 'tag') {
					// 容许一些特定标签能够显示格式: 会到这里的应该都是一些被允许显示格式的特定标签。
					token.unshift(token.tag_attributes);
				}
			} else if (token.type === 'tag' || token.type === 'tag_single') {
				parent[index] = token.toString().replace(/</g, '&lt;').replace(
						/>/g, '&gt;');

			} else if (token.is_plain) {
				if (false) {
					// use library_namespace.DOM.Unicode_to_HTML()
					token[0] = library_namespace.Unicode_to_HTML(token[0])
					// reduce size
					.replace(/&gt;/g, '>');
				}
				// 仅作必要的转换
				token[0] = token[0].replace(/&/g, '&amp;')
				// 这边也必须 escape "<>"。这边可用 "%3C", "%3E"。
				.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g,
						'&quot;').replace(/'/g, "&apos;");
			}
		}, Object.assign(Object.clone(options), {
			modify : true
		}));
		// console.log(parsed_title);
		// console.trace(parsed_title.toString().trim());

		// display_text 应该是对已经正规化的 section_title 再作的变化。
		var display_text = parsed_title.toString().replace(
				PATTERN_element_placeholder, '').trim();
		display_text = section_link_escape(display_text);
		if (!options.is_recursive) {
			// recover language conversion -{}-
			display_text = display_text.replace(section_link_START_CONVERT_reg,
					'-{').replace(section_link_END_CONVERT_reg, '}-');
		}

		// link = [ page title 页面标题, anchor 网页锚点 / section title 章节标题,
		// display_text / label 要显示的连结文字 default: section_title ]
		var link = [ options && options.page_title,
		// Warning: anchor, display_text are with "&amp;",
		// id is not with "&amp;".
		anchor, display_text ];
		// console.log(link);
		if (parsed_title.imprecise_tokens
		// section_title_token.link.imprecise_tokens
		&& parsed_title.imprecise_tokens.length > 0) {
			link.imprecise_tokens = parsed_title.imprecise_tokens;
			// section_title_token.link.tokens_maybe_handlable
			if (parsed_title.tokens_maybe_handlable
					&& parsed_title.tokens_maybe_handlable.length > 0) {
				link.tokens_maybe_handlable = parsed_title.tokens_maybe_handlable
						.unique();
				link.tokens_maybe_handlable.forEach(function(parsed) {
					for_each_token.call(parsed, function(token, index, parent) {
						if (token.type === 'convert') {
							token.toString
							// recover .toString of token.type === 'convert'
							// @see convert_for_recursion()
							= wiki_API.parse.wiki_token_toString[token.type];
						}
					});
				});
			}
		}
		Object.assign(link, {
			// link.id = {String}id
			// section title, NOT including "<!-- -->" and "&amp;"
			id : id,
			// original section title, including "<!-- -->",
			// not including "&amp;".
			title : section_title,
			// only for debug
			// parsed_title : parsed_title,

			// anchor : anchor.toString().trimEnd(),
			// display_text : display_text,

			// section.section_title.link.toString()
			toString : section_link_toString
		});
		// 用以获得实际有效的 anchor 网页锚点。 effect anchor: parsed.each_section()
		// and then section_title_token.link.id
		return link;
	}

	// --------------------------------------------------------------------------------------------

	/**
	 * 快速取得第一个标题 lead section / first section / introduction 序言 导入文 文字用。
	 * 
	 * TODO: expandtemplates for cascading protection
	 * 
	 * @example <code>

	CeL.wiki.lead_text(content);

	</code>
	 * 
	 * @param {String}wikitext
	 *            wikitext to parse
	 * 
	 * @returns {String}lead section wikitext 文字
	 * 
	 * @see [[mw:Extension:Labeled_Section_Transclusion#Transclude_the_introduction]]
	 *      {{subst:#lsth:page title}}
	 * 
	 * @see 文章的开头部分[[WP:LEAD|导言章节]] (lead section, introduction),
	 *      [[en:Wikipedia:Hatnote]] 顶注
	 */
	function lead_text(wikitext) {
		var page_data;
		if (wiki_API.is_page_data(wikitext)) {
			page_data = wikitext;
			wikitext = wiki_API.content_of(page_data);
		}
		if (!wikitext || typeof wikitext !== 'string') {
			return wikitext;
		}

		var matched = wikitext.indexOf('\n=');
		if (matched >= 0) {
			wikitext = wikitext.slice(0, matched);
		}

		// match/去除一开始的维护模板/通知模板。
		// <del>[[File:file|[[link]]...]] 因为不容易除尽，放弃处理。</del>
		while (matched = wikitext.match(/^[\s\n]*({{|\[\[)/)) {
			// 注意: 此处的 {{ / [[ 可能为中间的 token，而非最前面的一个。但若是没有中间的 token，则一定是第一个。
			matched = matched[1];
			// may use wiki_API.title_link_of()
			var index_end = wikitext.indexOf(matched === '{{' ? '}}' : ']]');
			if (index_end === NOT_FOUND) {
				library_namespace.debug('有问题的 wikitext，例如有首 "' + matched
						+ '" 无尾？ [' + wikitext + ']', 2, 'lead_text');
				break;
			}
			// 须预防 -{}- 之类 language conversion。
			var index_start = wikitext.lastIndexOf(matched, index_end);
			wikitext = wikitext.slice(0, index_start)
			// +2: '}}'.length, ']]'.length
			+ wikitext.slice(index_end + 2);
		}

		if (page_data) {
			page_data.lead_text = lead_text;
		}

		return wikitext.trim();
	}

	// ------------------------------------------

	/**
	 * 撷取出页面简介。例如使用在首页优良条目简介。
	 * 
	 * @example <code>

	CeL.wiki.extract_introduction(page_data).toString();

	</code>
	 * 
	 * @param {Array|Object}first_section
	 *            first section or page data
	 * @param {String}[title]
	 *            page title.
	 * 
	 * @returns {Undefined|Array} introduction object
	 * 
	 * @since 2019/4/10
	 */
	function extract_introduction(first_section, title) {
		var parsed;
		if (wiki_API.is_page_data(first_section)) {
			if (!title)
				title = wiki_API.title_of(first_section);
			parsed = page_parser(first_section).parse();
			parsed.each_section(function(section, index) {
				if (!section.section_title) {
					first_section = section;
				}
			});
		}
		if (!first_section)
			return;

		// --------------------------------------

		var introduction_section = [], representative_image;
		if (parsed) {
			introduction_section.page = parsed.page;
			introduction_section.title = title;
			// Release memory. 释放被占用的记忆体。
			parsed = null;
		}
		introduction_section.toString = first_section.toString;

		// --------------------------------------

		var index = 0;
		for (; index < first_section.length; index++) {
			var token = first_section[index];
			// console.log(token);
			if (token.type === 'file') {
				// {String}代表图像。
				if (!representative_image) {
					representative_image = token;
				}
				continue;
			}

			if (token.type === 'transclusion') {
				if (token.name === 'NoteTA') {
					// preserve 转换用词
					// TODO:
					// 因为该页会嵌入首页，所以请不要使用{{noteTA}}进行繁简转换；请用-{zh-hans:简体字;zh-hant:繁体字}-进行单个词汇转换。
					// [[繁体字]] → [[繁体字|-{zh-hans:简体字;zh-hant:繁体字}-]]
					introduction_section.push(token);
					continue;
				}

				if (token.name in {
					Cfn : true,
					Sfn : true,
					Sfnp : true,
					Efn : true,
					NoteTag : true,
					R : true,
					Clear : true
				}) {
					// Skip references
					continue;
				}

				// 抽取出代表图像。
				if (!representative_image) {
					representative_image = token.parameters.image
							|| token.parameters.file
					// ||token.parameters['Image location']
					;
				}
				if (!representative_image) {
					token = token.toString();
					// console.log(token);
					var matched = token
							.match(/\|[^=]+=([^\|{}]+\.(?:jpg|png|svg|gif|bmp))[\s\n]*[\|}]/i);
					if (matched) {
						representative_image = matched[1];
					}
				}

				continue;
			}

			if ((token.type === 'tag' || token.type === 'tag_single')
					&& token.tag === 'ref') {
				// 去掉所有参考资料。
				continue;
			}

			if (token.type === 'table'
			// e.g., __TOC__
			|| token.type === 'switch') {
				// 去掉所有参考资料。
				continue;
			}

			if (!token.toString().trim()) {
				continue;
			}

			if (token.type === 'bold' || token.type === 'plain'
					&& token.toString().includes(title)) {
				// title_piece
				introduction_section.title_token = token;
			}

			if (token.type === 'link') {
				if (!token[0] && token[1]) {
					// 将[[#章节|文字]]的章节连结改为[[条目名#章节|文字]]的形式。
					token[0] = title;
				}
			}

			// console.log('Add token:');
			// console.log(token);
			introduction_section.push(token);
			if (introduction_section.title_token)
				break;
		}

		// ------------------

		// 已经跳过导航模板。把首段余下的其他内容全部纳入简介中。
		while (++index < first_section.length) {
			token = first_section[index];
			// remove {{Notetag}}, <ref>
			if ((token.type === 'tag' || token.type === 'tag_single')
					&& token.tag === 'ref' || token.type === 'transclusion'
					&& token.name === 'Notetag')
				continue;
			introduction_section.push(token);
		}
		index = introduction_section.length;
		// trimEnd() 去头去尾
		while (--index > 0) {
			if (introduction_section[index].toString().trim())
				break;
			introduction_section.pop();
		}

		// --------------------------------------

		// 首个段落不包含代表图像。检查其他段落以抽取出代表图像。
		if (!representative_image) {
			parsed.each('file', function(token) {
				representative_image = token;
				return for_each_token.exit;
			});
		}

		// --------------------------------------

		if (typeof representative_image === 'string') {
			// assert: {String}representative_image

			// remove [[File:...]]
			representative_image = representative_image.replace(/^\[\[[^:]+:/i,
					'').replace(/\|[\s\S]*/, '').replace(/\]\]$/, '');
			representative_image = wiki_API.parse('[[File:'
					+ wiki_API.title_of(representative_image) + ']]');
		}
		introduction_section.representative_image = representative_image;

		return introduction_section;
	}

	// ------------------------------------------

	/**
	 * <code>

	CeL.wiki.sections(page_data);
	page_data.sections.forEach(for_sections, page_data.sections);

	CeL.wiki.sections(page_data)
	//
	.forEach(for_sections, page_data.sections);

	</code>
	 */

	// 将 wikitext 拆解为各 section list
	// get {Array}section list
	//
	// @deprecated: 无法处理 '<pre class="c">\n==t==\nw\n</pre>'
	// use for_each_section() instead.
	function deprecated_get_sections(wikitext) {
		var page_data;
		if (wiki_API.is_page_data(wikitext)) {
			page_data = wikitext;
			wikitext = wiki_API.content_of(page_data);
		}
		if (!wikitext || typeof wikitext !== 'string') {
			return;
		}

		var section_list = [], index = 0, last_index = 0,
		// 章节标题。
		section_title,
		// [ all title, "=", section title ]
		PATTERN_section = /\n(={1,2})([^=\n]+)\1\s*?\n/g;

		section_list.toString = function() {
			return this.join('');
		};
		// 章节标题list。
		section_list.title = [];
		// index hash
		section_list.index = Object.create(null);

		while (true) {
			var matched = PATTERN_section.exec(wikitext),
			// +1 === '\n'.length: skip '\n'
			// 使每个 section_text 以 "=" 开头。
			next_index = matched && matched.index + 1,
			//
			section_text = matched ? wikitext.slice(last_index, next_index)
					: wikitext.slice(last_index);

			if (false) {
				// 去掉章节标题。
				section_text.replace(/^==[^=\n]+==\n+/, '');
			}

			library_namespace.debug('next_index: ' + next_index + '/'
					+ wikitext.length, 3, 'get_sections');
			// console.log(matched);
			// console.log(PATTERN_section);

			if (section_title) {
				// section_list.title[{Number}index] = {String}section title
				section_list.title[index] = section_title;
				if (section_title in section_list) {
					// 重复标题。
					library_namespace.debug('重复 section title ['
							+ section_title + '] 将仅取首个 section text。', 2,
							'get_sections');

				} else {
					if (!(section_title >= 0)) {
						// section_list[{String}section title] =
						// {String}wikitext
						section_list[section_title] = section_text;
					}

					// 不采用 section_list.length，预防 section_title 可能是 number。
					// section_list.index[{String}section title] = {Number}index
					section_list.index[section_title] = index;
				}
			}

			// 不采用 section_list.push(section_text);，预防 section_title 可能是 number。
			// section_list[{Number}index] = {String}wikitext
			section_list[index++] = section_text;

			if (matched) {
				// 纪录下一段会用到的资料。

				last_index = next_index;

				section_title = matched[2].trim();
				// section_title = wiki_API.section_link(section_title).id;
			} else {
				break;
			}
		}

		if (page_data) {
			page_data.sections = section_list;
			// page_data.lead_text = lead_text(section_list[0]);
		}

		// 检核。
		if (false && wikitext !== section_list.toString()) {
			// debug 用. check parser, test if parser working properly.
			throw new Error('get_sections: Parser error'
			//
			+ (page_data ? ': ' + wiki_API.title_link_of(page_data) : ''));
		}
		return section_list;
	}

	/**
	 * 为每一个章节(讨论串)执行特定作业 for_section(section)
	 * 
	 * If you want to get **every** sections, please using
	 * `parsed..each('section_title', ...)` or traversals hierarchy of
	 * `parsed.child_section_titles` instead of enumerating `parsed.sections`.
	 * `parsed.sections` do NOT include titles like this:
	 * {{Columns-list|\n==title==\n...}}
	 * 
	 * CeL.wiki.parser.parser_prototype.each_section
	 * 
	 * TODO: 这会漏算没有日期标示的签名
	 * 
	 * @example <code>

	// TODO: includeing `<h2>...</h2>`, `==<h2>...</h2>==`

	parsed = CeL.wiki.parser(page_data);

	parsed.each_section(function(section, section_index) {
		if (!section.section_title) {
			// first_section = section;
			// Skip lead section / first section / introduction.
			return;
		}
		console.log('#' + section.section_title);
		console.log([ section.users, section.dates ]);
		console.log([section_index, section.toString()]);

		section.each('link', function(token) {
			console.log(token.toString());
		}, {
			// for section.users, section.dates
			get_users : true,
			// 采用 parsed 的 index，而非 section 的 index。
			// 警告: 会从 section_title 开始遍历 traverse！
			use_global_index : true
		});

		return parsed.each.exit;
	}, {
		level_filter : [ 2, 3 ],
		get_users : true
	});

	parsed.each_section();
	parsed.sections.forEach(...);

	</code>
	 */
	function for_each_section(for_section, options) {
		options = library_namespace.new_options(options);
		// this.options is from function page_parser(wikitext, options)
		if (!options[KEY_SESSION] && this.options && this.options[KEY_SESSION]) {
			// set options[KEY_SESSION] for
			// `var date = wiki_API.parse.date(token, options);`
			options[KEY_SESSION] = this.options[KEY_SESSION];
		}

		// this: parsed
		var _this = this, page_title = this.page && this.page.title,
		// parsed.sections[0]: 常常是设定与公告区，或者放置维护模板/通知模板。
		all_root_section_list = this.sections = [];

		/**
		 * 2021/11/3 18:23:24: .parent_section 归于 .parent_section_title，
		 * .subsections 归于 .child_section_titles。
		 */
		// var section_hierarchy = [ this.subsections = [] ];
		//
		/** `section link anchor` in section_title_hash: had this title */
		var section_title_hash = Object.create(null);
		// this.section_title_hash = section_title_hash;

		// to test: 没有章节标题的文章, 以章节标题开头的文章, 以章节标题结尾的文章, 章节标题+章节标题。
		// 加入 **上一个** section, "this_section"
		function add_root_section(next_section_title_index) {
			// assert: _this.type === 'plain'
			// section_title === parsed[section.range[0] - 1]
			var this_section_title_index = all_root_section_list.length > 0 ? all_root_section_list
					.at(-1).range[1]
					: undefined,
			// range: 本 section inner 在 root parsed 中的 index.
			// parsed[range[0]] to parsed[range[1] - 1]
			range = [ this_section_title_index >= 0
			// +1: 这个范围不包括 section_title。
			? this_section_title_index + 1 : 0, next_section_title_index ],
			//
			section = _this.slice(range[0], range[1]);
			if (this_section_title_index >= 0) {
				// page_data.parsed[section.range[0]-1]===section.section_title
				section.section_title = _this[this_section_title_index];
			}
			// 添加常用属性与方法。
			// TODO: using Object.defineProperties(section, {})
			Object.assign(section, {
				type : 'section',
				// section = parsed.slice(range[0], range[1]);
				// assert: parsed[range[0]] === '\n',
				// is the tail '\n' of "==title== "
				range : range,
				each : for_each_token,
				replace_by : replace_section_by,
				toString : _this.toString
			});
			section[wiki_API.KEY_page_data] = _this.page;
			all_root_section_list.push(section);
		}

		// max_section_level
		var level_filter
		// 要筛选的章节标题层级 e.g., {level_filter:[1,2]}
		= Array.isArray(options.level_filter)
		// assert: 必须皆为 {Number}
		? (Math.max.apply(null, options.level_filter) | 0) || 2
		// e.g., { level_filter : 3 }
		: 1 <= options.level_filter && (options.level_filter | 0)
		// default: level 2. 仅处理阶级2的章节标题。
		|| 2;

		// get topics / section title / stanza title using for_each_token()
		// 读取每一个章节的资料: 标题,内容
		// TODO: 不必然是章节，也可以有其它不同的分割方法。
		// TODO: 可以读取含入的子页面
		this.each('section_title', function(section_title_token,
		// section 的 index of parsed。
		section_title_index, parent_token) {
			var section_title_link = section_title_token.link;
			if (page_title) {
				// [0]: page title
				section_title_link[0] = page_title;
			}
			var id = section_title_link.id;
			if (id in section_title_hash) {
				// The index of 2nd title starts from 2
				var duplicate_NO = 2, base_anchor = id;
				// 有多个完全相同的 anchor 时，后面的会加上 "_2", "_3", ...。
				// [[w:en:Help:Section#Section linking]]
				while ((id = base_anchor + ' ' + duplicate_NO)
				// 测试是否有重复的标题 duplicated section title。
				in section_title_hash) {
					duplicate_NO++;
				}
				if (!section_title_link.duplicate_NO) {
					section_title_link.duplicate_NO = duplicate_NO;
					// hack for [[w:en:WP:DUPSECTNAME|Duplicate section names]]
					if (Array.isArray(section_title_link[1]))
						section_title_link[1].push('_' + duplicate_NO);
					else
						section_title_link[1] += '_' + duplicate_NO;
					// 用以获得实际有效的 anchor 网页锚点。 effect anchor
					section_title_link.id = id;
					// console.trace(section_title_token);
				}
			}
			// 登记已有之 anchor。
			section_title_hash[id] = null;

			var level = section_title_token.level;
			// console.trace([ level, level_filter, id ]);
			if (parent_token === _this
			// ↑ root sections only. Do not include
			// {{Columns-list|\n==title==\n...}}

			// level_filter: max_section_level
			&& level <= level_filter) {
				// console.log(section_title_token);
				add_root_section(section_title_index);
			} else {
				// library_namespace.warn('Ignore ' + section_title_token);
				// console.log([ parent_token === _this, level ]);
			}

			// ----------------------------------

			if (false) {
				// 此段已搬到 parse_section() 中。
				if (section_hierarchy.length > level) {
					// 去尾。
					section_hierarchy.length = level;
				}
				section_hierarchy[level] = section_title_token;
				// console.log(section_hierarchy);
				while (--level >= 0) {
					// 注意: level 1 的 subsections 可能包含 level 3!
					var parent_section = section_hierarchy[level];
					if (parent_section) {
						if (parent_section.subsections) {
							if (false) {
								library_namespace.log(parent_section + ' → '
										+ section_title_token);
							}
							parent_section.subsections
									.push(section_title_token);
							section_title_token
							//
							.parent_section = parent_section;
						} else {
							// assert: is root section list, parent_section ===
							// this.subsections === section_hierarchy[0]
							parent_section.push(section_title_token);
						}
						break;
					}
				}
				section_title_token.subsections = [];
			}

		}, Object.assign({
			// 不可只检查第一层之章节标题。就算在 template 中的 section title 也会被记入 TOC。
			// e.g.,
			// [[w:en:Wikipedia:Vital_articles/Level/5/Everyday_life/Sports,_games_and_recreation]]
			// max_depth : 1,

			modify : false
		},
		// options.for_each_token_options
		options));
		// add the last section
		add_root_section(this.length);
		if (all_root_section_list[0].range[1] === 0) {
			// 第一个章节为空。 e.g., 以章节标题开头的文章。
			// 警告：此时应该以是否有 section.section_title 来判断是否为 lead_section，
			// 而非以 section_index === 0 判定！
			all_root_section_list.shift();
		}

		// ----------------------------

		// 读取每一个章节的资料: 参与讨论者,讨论发言的时间
		// 统计各讨论串中签名的次数和发言时间。
		// TODO: 无法判别先日期，再使用者名称的情况。 e.g., [[w:zh:Special:Diff/54030530]]
		if (options.get_users) {
			all_root_section_list.forEach(function(section) {
				// console.log(section);
				// console.log('section: ' + section.toString());

				// [[WP:TALK]] conversations, dialogues, discussions, messages
				// section.discussions = [];
				// 发言用户名顺序
				section.users = [];
				// 发言时间日期
				section.dates = [];
				for (var section_index = 0,
				// list buffer
				buffer = [], this_user, token;
				// Only check the first level. 只检查第一层。
				// TODO: parse [[Wikipedia:削除依頼/暂定2车线]]: <div>...</div>
				// check <b>[[User:|]]</b>
				section_index < section.length || buffer.length > 0;) {
					token = buffer.length > 0 ? buffer.shift()
							: section[section_index++];
					while (/* token && */token.type === 'list') {
						var _buffer = [];
						token.forEach(function(list_item) {
							// 因为使用习惯问题，每个列表必须各别计算使用者留言次数。
							_buffer.append(list_item);
						});
						token = _buffer.shift();
						Array.prototype.unshift.apply(buffer, _buffer);
					}

					if (typeof token === 'string') {
						// assert: {String}token
						if (!token.trim() && token.includes('\n\n')) {
							// 预设签名必须与日期在同一行。不可分段。
							this_user = null;
							continue;
						}

					} else {
						// assert: {Array}token
						token = token.toString();
						// assert: wikiprojects 计划的签名("~~~~~")必须要先从名称再有日期。
						// 因此等到出现日期的时候再来处理。
						// 取得依照顺序出现的使用者序列。
						var user_list = wiki_API.parse.user.all(token, true);
						if (false && section.section_title
								&& section.section_title.title.includes('')) {
							console.log('token: ' + token);
							console.log('user_list: ' + user_list);
						}

						// 判别一行内有多个使用者名称的情况。
						// 当一行内有多个使用者名称的情况，会取最后一个签名。
						if (user_list.length > 0) {
							this_user = user_list.at(-1);
							// ↑ 这个使用者名称可能为 bot。
							if (options.ignore_bot
									&& PATTERN_BOT_NAME.test(this_user)) {
								this_user = null;
							}
						}

						// --------------------------------
						if (false) {
							// 以下为取得多个使用者名称的情况下，欲判别出签名的程式码。由于现在仅简单取用最后一个签名，已经被废弃。

							if (user_list.length > 1
							// assert: 前面的都只是指向机器人页面的连结。
							&& /^1+0$/.test(user_list.map(function(user) {
								return PATTERN_BOT_NAME.test(user) ? 1 : 0;
							}).join(''))) {
								user_list = user_list.slice(-1);
							}

							// 因为现在有个性化签名，需要因应之。应该包含像[[w:zh:Special:Diff/48714597]]的签名。
							if (user_list.length === 1) {
								this_user = user_list[0];
							} else {
								// 同一个token却没有找到，或找到两个以上签名，因此没有办法准确判别到底哪一个才是真正的留言者。
								// console.log(token);
								// console.log(token.length);
								// console.log(this_user);
								if (user_list.length >= 2
								// 若是有其他非字串的token介于名称与日期中间，代表这个名称可能并不是发言者，那么就重设名称。
								// 签名长度不应超过255位元组。
								|| token.length > 255 - '[[U:n]]'.length) {
									// 一行内有多个使用者名称的情况，取最后一个？
									// 例如签名中插入自己的旧名称或者其他人的情况
									this_user = null;
								}
								if (!this_user) {
									continue;
								}
							}
						}

						// 继续解析日期，预防有类似 "<b>[[User:]] date</b>" 的情况。
					}

					if (!this_user) {
						continue;
					}
					var date = wiki_API.parse.date(token, options);
					// console.log([ this_user, date ]);
					if (!date
					// 预设不允许未来时间。
					|| !options.allow_future && !(Date.now() - date > 0)) {
						continue;
					}
					// 同时添加使用者与日期。
					section.dates.push(date);
					section.users.push(this_user);
					// reset
					this_user = null;
				}

				if (section.dates.length === 0) {
					section.dates = wiki_API.parse.date(section.toString(),
					// 一些通知只能取得日期，文中未指定用户名。
					Object.assign({
						get_date_list : true
					}, options));
					section.dates.need_to_clean = true;
				}

				var min_timevalue, max_timevalue;
				// console.trace(section.dates);
				section.dates.forEach(function(date) {
					if (!date || isNaN(date = +date)) {
						return;
					}
					if (!(min_timevalue <= date))
						min_timevalue = date;
					else if (!(max_timevalue >= date))
						max_timevalue = date;
				});
				if (section.dates.need_to_clean)
					section.dates = [];
				// console.trace([ min_timevalue, max_timevalue ]);
				if (min_timevalue) {
					section.dates.min_timevalue = min_timevalue;
					section.dates.max_timevalue = max_timevalue
							|| min_timevalue;
				}
				if (false) {
					section.dates.max_timevalue = Math.max.apply(null,
							section.dates.map(function(date) {
								return date.getTime();
							}));
				}

				if (false) {
					parsed.each_section();
					// scan / traversal section templates:
					parsed.each.call(parsed.sections[section_index],
							'template', function(token) {
								;
							});
				}

				if (false) {
					// 首位发言者, 发起人 index
					section.initiator_index = parsed.each_section.index_filter(
							section, true, 'first');
				}

				// 最后发言日期 index
				var last_update_index = for_each_section.index_filter(section,
						true, 'last');
				// section.users[section.last_update_index] = {String}最后更新发言者
				// section.dates[section.last_update_index] = {Date}最后更新日期
				if (last_update_index >= 0) {
					section.last_update_index = last_update_index;
				}
				// 回应数量
				section.replies
				// 要先有不同的人发言，才能算作有回应。
				= section.users.unique().length >= 2 ? section.users.length - 1
						: 0;
				// console.log('users: ' + section.users);
				// console.log('replies: ' + section.replies);
			});
		}

		// console.trace(for_section);
		if (typeof for_section === 'function') {
			level_filter
			// 要筛选的章节标题层级 e.g., {level_filter:[1,2]}
			= Array.isArray(options.level_filter) ? options.level_filter
			// e.g., { level_filter : 3 }
			: 1 <= options.level_filter && (options.level_filter | 0)
			// default: level 2. 仅处理阶级2的章节标题。
			|| 2;

			var section_filter = function(section) {
				var section_title = section.section_title;
				if (!section_title)
					return true;
				if (Array.isArray(level_filter))
					return level_filter.includes(section_title.level);
				return level_filter === section_title.level;
			};

			// TODO: return (result === for_each_token.remove_token)
			// TODO: move section to another page
			if (library_namespace.is_async_function(for_section)) {
				// console.log(all_root_section_list);
				return Promise.allSettled(all_root_section_list.map(function(
						section, section_index) {
					return section_filter(section)
							&& for_section.apply(this, arguments);
				}));

				// @deprecated
				all_root_section_list
						.forEach(function(section, section_index) {
							if (false) {
								console.log('Process: ' + section.section_title
								// section_title.toString(true): get inner
								&& section.section_title.toString(true));
							}
							if (!section_filter(section))
								return;
							return eval('(async function() {'
									+ ' try { return await for_section(section, section_index); }'
									+ ' catch(e) { library_namespace.error(e); }'
									+ ' })();');
						});
			} else {
				// for_section(section, section_index)
				all_root_section_list.some(function(section) {
					// return parsed.each.exit;
					return section_filter(section) && (for_each_token.exit ===
					// exit if the result calls exit
					for_section.apply(this, arguments));
				}, this);
			}
		}
		return this;
	}

	function replace_section_by(wikitext, options) {
		options = library_namespace.setup_options(options);
		var parsed = this[wiki_API.KEY_page_data].parsed;
		// assert: parsed[range[0]] === '\n',
		// is the tail '\n' of "==title== "
		var index = this.range[0];
		if (typeof wikitext === 'string')
			wikitext = wikitext.trim();
		if (options.preserve_section_title === undefined
		// 未设定 options.preserve_section_title，则预设若有 wikitext，则保留 section title。
		? !wikitext : !options.preserve_section_title) {
			// - 1: point to section_title
			index--;
		}
		if (wikitext) {
			parsed[index] += wikitext + '\n\n';
		} else {
			parsed[index] = '';
		}
		while (++index < this.range[1]) {
			// 清空到本章节末尾。
			parsed[index] = '';
		}
	}

	// var section_index_filter =
	// CeL.wiki.parser.parser_prototype.each_section.index_filter;
	for_each_section.index_filter = function filter_users_of_section(section,
			filter, type) {
		// filter: user_name_filter
		var _filter;
		if (typeof filter === 'function') {
			_filter = filter;
		} else if (Array.isArray(filter)) {
			_filter = function(user_name) {
				// TODO: filter.some()
				return filter.includes(user_name);
			};
		} else if (library_namespace.is_Object(filter)) {
			_filter = function(user_name) {
				return user_name in filter;
			};
		} else if (library_namespace.is_RegExp(filter)) {
			_filter = function(user_name) {
				return filter.test(user_name);
			};
		} else if (typeof filter === 'string') {
			_filter = function(user_name) {
				return filter === user_name;
			};
		} else if (filter === true) {
			_filter = function() {
				return true;
			};
		} else {
			throw 'for_each_section.index_filter: Invalid filter: ' + filter;
		}

		// ----------------------------

		if (!type) {
			var user_and_date_indexs = [];
			section.users.forEach(function(user_name, index) {
				if (_filter(user_name)) {
					user_and_date_indexs.push(index);
				}
			});

			return user_and_date_indexs;
		}

		// ----------------------------

		var index_specified, date_specified;

		section.dates.forEach(function(date, index) {
			// assert: {Date}date is valid
			date = date.getTime();
			if (type === 'first' ? date_specified <= date : type === 'last'
					&& date < date_specified) {
				return;
			}

			var user_name = section.users[index];
			if (_filter(user_name)) {
				date_specified = date;
				index_specified = index;
			}
		});

		return index_specified;
	};

	// ------------------------------------------------------------------------

	// CeL.wiki.parse.anchor.normalize_anchor()
	function normalize_anchor(anchor, preserve_spaces) {
		if (anchor) {
			anchor =
			// '&#39;' → "'"
			library_namespace.HTML_to_Unicode(anchor.toString())
			// 警告: 实际上的网页锚点应该要 .replace(/ /g, '_')
			// 但由于 wiki 页面中使用[[#P Q]]与[[#P_Q]]效果相同，
			// 都会产生<a href="#P_Q">，因此采用"P Q"。
			.replace(/[_\xa0]/g, ' ');
			if (!preserve_spaces) {
				// " a " → "a"
				anchor = anchor.trim();
			}
		}
		return anchor;
	}
	get_all_anchors.normalize_anchor = normalize_anchor;

	if (false) {
		wiki_session.register_redirects(
				CeL.wiki.parse.anchor.essential_templates, {
					namespace : 'Template'
				});

		// ...

		var anchor_list = CeL.wiki.parse.anchor(wikitext, CeL.wiki
				.add_session_to_options(wiki_session));

		// ------------------

		// bad method: work without session
		var anchor_list = CeL.wiki.parse.anchor(wikitext);
	}

	// CeL.wiki.parse.anchor()
	function get_all_anchors(wikitext, options) {
		if (!wikitext) {
			return [];
		}

		// const
		var anchor_hash = Object.create(null);
		function register_anchor(anchor, token, preserve_spaces) {
			anchor = normalize_anchor(anchor, preserve_spaces);
			if (typeof anchor === 'string' && anchor.length > 1024) {
				if (false) {
					Error.stackTraceLimit = Infinity;
					console.trace([ anchor, token.toString() ]);
					console.trace(token);
					throw new Error('Invalid anchor! (' + anchor.length
							+ ' characters)');
				}
				// 经过测试只会取前1024字元。 [[w:zh:Special:Diff/51003951]]
				anchor = anchor.slice(0, 1024);
			}
			if (false && /^===/.test(anchor)) {
				console.trace([ anchor, token ]);
			}
			// 以首个出现的为准。
			if (anchor && !(anchor in anchor_hash)) {
				anchor_hash[anchor] = token;
			}
		}

		// options: pass session. for options.language
		// const
		/** {Array} parsed page content 页面解析后的结构。 */
		var parsed = wiki_API.parser(wikitext, options).parse();
		if (false) {
			library_namespace.assert
					&& library_namespace.assert(
							[ wikitext, parsed.toString() ],
							'wikitext parser check for wikitext');
			console.trace(parsed);
		}
		// console.trace(parsed[0][0].attributes.id);

		var session = wiki_API.session_of_options(options);
		// console.log(wiki_API.site_name(session));
		// var was_running = session.running;
		// var latest_action_count = session.actions && session.actions.length;

		parsed.each_section();
		options = library_namespace.setup_options(options);
		var promise
		//
		= parsed.each('section_title', function(section_title_token) {
			// console.log(section_title_token);
			/* const */var section_title_link = section_title_token.link;

			// 忽略 <ref> 之类非固定的元素。不深入解开 <ref> 内模板可节省许多时间。
			if (options.ignore_variable_anchors) {
				var first_imprecise_token = undefined;
				for_each_token.call(section_title_token, function(token, index,
						parent) {
					// console.trace(sub_token);
					if (token.tag === 'ref') {
						first_imprecise_token = token;
						return for_each_token.exit;
					}
					if (false && token.type === 'transclusion'
							&& /^Cite \w+/.test(template_token.name)) {
						first_imprecise_token = token;
						return for_each_token.exit;
					}
					// e.g., [https://url ]
					if (token.type === 'external_link' && !token[2]) {
						first_imprecise_token = token;
						return for_each_token.exit;
					}
				});
				if (first_imprecise_token) {
					library_namespace.log('get_all_anchors: 跳过包含不固定锚点的章节标题: '
							+ section_title_token);
					return;
				}
			}

			// TODO: 忽略包含不合理元素的编辑，例如 url。
			// .imprecise_tokens 是在 .parse() 时即已设定。

			if (section_title_link.imprecise_tokens
			// 尝试展开模板。
			&& options.try_to_expand_templates) {
				var promise = wiki_API.expand_transclusion(section_title_token
						.toString(), options);
				var set_section_title_link = function(parsed) {
					if (library_namespace.assert) {
						library_namespace.assert(parsed.type === 'plain'
								&& parsed[0].type === 'section_title');
					}
					section_title_link = wiki_API.section_link(parsed[0]
					// @see wiki_token_toString.section_title @
					// CeL.application.net.wiki.parser.wikitext
					.join(''), options);
					if (false) {
						console
								.trace([ section_title_token.toString(),
										parsed, parsed.toString(),
										section_title_link, options ]);
					}
					// free
					set_section_title_link = null;
				};
				// console.trace([ promise, section_title_token.toString() ]);
				if (library_namespace.is_thenable(promise)) {
					// console.trace('re-generate link token.');
					promise = promise.then(function(parsed) {
						set_section_title_link(parsed);
						for_converted_section_title();
					});
					return promise;
				}
				set_section_title_link(promise);
			}

			for_converted_section_title();

			function for_converted_section_title() {
				if (!section_title_link.imprecise_tokens) {
					// console.trace(section_title_link);
					// `section_title_token.title` will not transfer "[", "]"
					register_anchor(
					//
					section_title_link.id, section_title_token, true);

				} else if (section_title_link.tokens_maybe_handlable) {
					// exclude "=={{T}}=="
					library_namespace
							.warn('Title maybe handlable 请检查是否可处理此标题: '
									+ section_title_token.title);
					console.log(section_title_link.tokens_maybe_handlable
					//
					.map(function(token) {
						// if (token.type === 'transclusion') return token;
						return token.toString();
					}));
					// Also show .imprecise_tokens
					console.trace(section_title_token);
				} else {
					library_namespace.warn(
					//
					'若包含的是模板，请检查是否可于 template_functions 添加此标题中的模板: '
							+ section_title_token.title);
					// Also show .imprecise_tokens
					console.trace(section_title_link);
				}
			}
		});

		options = Object.assign({
			allow_promise : options && options.try_to_expand_templates
		}, options);
		var _options = Object.assign(Object.clone(options), {
			print_anchors : false
		});

		// console.trace(promise);
		if (!promise) {
			return parse_template_anchors();
		}

		promise = promise.then(parse_template_anchors);
		if (false && session && session.actions && session.actions[0]) {
			/**
			 * <code>
			e.g., for
			node 20201008.fix_anchor.js use_project=en "check_page=WABC (AM)"
			</code>
			 */
			console.trace([ session.running, session.actions.length,
			// session.actions[0].waiting_for_previous_combination_operation,
			session.actions, wikitext ]);
			console.trace([ latest_action_count, session.actions.length,
					was_running, session.running ]);
			if (latest_action_count > 0 && was_running) {
				console.trace(session.actions[0]);
				session.actions[0].waiting_for_previous_promise = true;
				// session.next(promise);
			}
		}
		return promise;

		// ------------------------------------------------

		function parse_template_anchors() {
			// console.trace(parsed.toString());
			// 处理包含于 template 中之 anchor 网页锚点 (section title / id="" / name="")
			var promise = parsed.each('transclusion', function(template_token) {
				if (false && template_token.name === 'template_token') {
					console.trace([ template_token.name,
					//
					template_token.expand ]);
				}

				var anchors = wiki_API.repeatedly_expand_template_token(
						template_token, options);
				if (template_token !== anchors) {
					// 处理包括 {{Anchor}}, {{Anchors}}, {{Visible anchor}},
					// {{term}}
					if (!anchors || typeof anchors.toString !== 'function')
						return;

					template_token = anchors;
					// console.trace(anchors);
					anchors = get_all_anchors(anchors.toString(), _options);
					// console.trace(anchors);
					anchors.forEach(function(anchor) {
						register_anchor(anchor, template_token);
					});
					if (template_token.type !== 'transclusion')
						return;
				}

				// e.g., {{Cite book|...|ref=anchor}} @ [[日本の原子爆弾开発]]
				// {{Cite journal|...|ref=anchor}}
				if (/^Cite \w+/.test(template_token.name)
						|| (session || wiki_API)
						// {{Citation|...|ref=anchor}}
						.is_template('Citation', template_token, options)) {
					// console.trace(JSON.stringify(template_token.name));
					var parameters = template_token.parameters;
					var anchor = parameters.ref;
					// console.trace(JSON.stringify(anchor));
					if (anchor) {
						if (anchor !== 'none') {
							// e.g., {{SfnRef|...}}
							anchor = wiki_API.wikitext_to_plain_text(anchor);
							register_anchor(anchor, template_token);
						}
						return;
					}

					// https://en.wikipedia.org/wiki/Template:Citation/doc#Anchors_for_Harvard_referencing_templates
					anchor = '';
					if (parameters.last)
						anchor += parameters.last.toString().trim();
					// @see [[w:en:Module:Citation/CS1]]
					// local function make_citeref_id (namelist, year)
					for (var index = 1; index <= 4; index++) {
						if (parameters['last' + index])
							anchor += parameters['last' + index].toString()
									.trim();
					}

					var year = parameters.year;
					if (!year) {
						year = parameters.date;
						// TODO: extract year
						year = year && year.toString().match(/[12]\d{3}/);
						if (year)
							year = year[0];
					}
					if (year)
						anchor += year.toString().trim();

					if (anchor)
						register_anchor('CITEREF' + anchor, template_token);
					return;
				}

				if (false && options && options.print_anchors) {
					library_namespace
							.warn('get_all_anchors: Cannot expand template: '
									+ template_token);
				}
			});

			return promise ? promise.then(parse_other_token_anchors)
					: parse_other_token_anchors();
		}

		function parse_other_token_anchors() {
			// 处理 <span class="anchor" id="anchor"></span>, <ref name="anchor">,
			// id in table cell attribute
			parsed.each('tag_attributes', function(attribute_token, index,
					parent) {
				// console.log(parent);
				// console.trace(attribute_token);
				// console.log(attribute_token.attributes);
				// const
				var anchor = attribute_token.attributes.id
						|| attribute_token.attributes.name;
				// console.trace(anchor);
				// <ref name="..."> 会转成 id="cite_re-..."
				if (parent.tag ? parent.tag.toLowerCase() !== 'ref'
				// e.g., @ [[w:en:Daniel Ricciardo]]
				: parent.type === 'table_attributes') {
					// e.g., <span id="anchor">, <div id="anchor">
					if (Array.isArray(anchor)) {
						if (anchor.type !== 'plain') {
							anchor = wiki_API.parse.set_wiki_type([ anchor ],
									'plain');
						}
						// e.g., {{Wikicite|ref={{sfnref|...}} }} .expand() 之后，
						// 解析 id="{{sfnref|...}}"
						for_each_token.call(anchor, 'transclusion', function(
								template_token, index, parent) {
							// replace by expanded text
							if (template_token.expand)
								parent[index] = template_token.expand();
						}, _options);
						// preserve old properties
						var toString = anchor.toString;
						anchor = anchor.map(function(token) {
							if (token.type === 'magic_word_function'
							// && token.is_magic_word
							&& token.name === 'ANCHORENCODE') {
								return token[1];
							}
							return token;
						});
						// recover
						anchor.toString = toString;
					}
					if (false && /{{/.test(normalize_anchor(anchor))) {
						// Should not go to here.
						console.trace([ anchor, attribute_token ]);
					}
					register_anchor(anchor, attribute_token);
				}
			});

			var anchor_list = Object.keys(anchor_hash);
			if (options && options.print_anchors) {
				library_namespace.info('get_all_anchors: anchors:');
				console.trace(anchor_list.length > 100 ? JSON
						.stringify(anchor_list) : anchor_list);
			}
			return anchor_list;
		}
	}

	// CeL.wiki.parse.anchor.essential_templates
	// required, indispensable
	get_all_anchors.essential_templates = [ 'Citation' ];

	// ------------------------------------------------------------------------

	// export 导出.
	// @static
	Object.assign(wiki_API, {
		lead_text : lead_text,
		extract_introduction : extract_introduction,
		// sections : deprecated_get_sections,

		// preprocess_section_link_tokens : preprocess_section_link_tokens,
		section_link : section_link,
		section_link_escape : section_link_escape,

		// HTML_to_wikitext : HTML_to_wikitext,
		wikitext_to_plain_text : wikitext_to_plain_text
	});

	Object.assign(wiki_API.parser.parser_prototype, {
		each_section : for_each_section
	});

	Object.assign(wiki_API.parse, {
		anchor : get_all_anchors
	});

	// --------------------------------------------------------------------------------------------

	// 不设定(hook)本 module 之 namespace，仅执行 module code。
	return library_namespace.env.not_to_extend_keyword;
}
