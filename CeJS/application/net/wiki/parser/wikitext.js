﻿/**
 * @name CeL function for MediaWiki (Wikipedia / 维基百科): parse wikitext /
 *       wikicode 解析维基语法
 * 
 * @fileoverview 本档案包含了 MediaWiki 自动化作业用程式库的子程式库。
 * 
 * TODO:<code>

parser [[WP:维基化]] [[w:en:Wikipedia:AutoWikiBrowser/General fixes]] [[w:en:Wikipedia:WikiProject Check Wikipedia]]
https://www.mediawiki.org/wiki/API:Edit_-_Set_user_preferences

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
	name : 'application.net.wiki.parser.wikitext',
	// for_each_token
	require : 'application.net.wiki.parser.',

	// 设定不汇出的子函式。
	no_extend : 'this,*',

	// 为了方便格式化程式码，因此将 module 函式主体另外抽出。
	code : module_code
});

function module_code(library_namespace) {

	// requiring
	var wiki_API = library_namespace.application.net.wiki;
	// @inner
	var PATTERN_wikilink = wiki_API.PATTERN_wikilink, PATTERN_wikilink_global = wiki_API.PATTERN_wikilink_global, PATTERN_file_prefix = wiki_API.PATTERN_file_prefix, PATTERN_URL_WITH_PROTOCOL_GLOBAL = wiki_API.PATTERN_URL_WITH_PROTOCOL_GLOBAL, PATTERN_category_prefix = wiki_API.PATTERN_category_prefix, PATTERN_invalid_page_name_characters = wiki_API.PATTERN_invalid_page_name_characters;

	var
	/** {Number}未发现之index。 const: 基本上与程式码设计合一，仅表示名义，不可更改。(=== -1) */
	NOT_FOUND = ''.indexOf('_');

	// --------------------------------------------------------------------------------------------

	// CeL.wiki.HTML_to_wikitext(HTML)
	// Please use CeL.wiki.wikitext_to_plain_text() instead!
	// TODO: 应该 parse HTML。
	// @see [[Module:Plain text]],
	// https://www.mediawiki.org/w/api.php?action=help&modules=flow-parsoid-utils
	// https://www.mediawiki.org/w/api.php?action=help&modules=parse
	// https://www.mediawiki.org/w/api.php?action=help&modules=expandtemplates
	function HTML_to_wikitext(HTML, options) {
		return HTML
		//
		.replace(/<\/i><i>/g, '').replace(/<\/b><b>/g, '').replace(
				/<\/strong><strong>/g, '')
		//
		.replace(/<i>([\s\S]+?)<\/i>/g, "''$1''").replace(
				/<b>([\s\S]+?)<\/b>/g, "'''$1'''").replace(
				/<strong>([\s\S]+?)<\/strong>/g, "'''$1'''")
		//
		.replace_till_stable(/<span(?: [^<>]*)?>([^<>]*?)<\/span>/g, "$1")
		//
		.replace(/<a ([^<>]+)>([\s\S]+?)<\/a>/g,
		//
		function(all, attributes, innerHTML) {
			var href = attributes.match(/href="([^"]+)"/);
			return '[' + (href ? href[1] : '#') + ' ' + innerHTML + ']';
		})
		//
		.replace(/\s*<br(?:[^\w<>][^<>]*)?>[\r\n]*/ig, '\n').replace(
				/<p ?\/>\n*/ig, '\n\n')
		// ignore style, remove <p style="...">...</p>
		// .replace(/<p[^<>]*>([^<>]*)<\/p>[\s\n]*/g, '$1\n\n')
		.replace(/<p>([\s\S]+?)<\/p>\n*/g, '$1\n\n')
		//
		.replace(/\r?\n/g, '\n').replace(/\n{3,}/g, '\n\n');
	}

	// --------------------------------------------------------------------------------------------

	/**
	 * excluding the disambiguator, and remove diacritics of page_title
	 * 
	 * @param {String}page_title
	 *            页面标题。
	 * @param {Boolean}to_lower_case
	 *            for case-insensitive compare
	 * 
	 * @returns {String} sort key
	 */
	function page_title_to_sort_key(page_title, to_lower_case) {
		if (!page_title)
			return;
		if (page_title.title) {
			// input page_data
			page_title = page_title.title;
		}
		// excluding the disambiguator
		// e.g., [[Abdoul Karim Sylla (footballer, born 1981)]]
		// → "Abdoul Karim Sylla"
		var sort_key = page_title.toString().replace(/ \([^()]+\)$/, '');
		if (sort_key.normalize) {
			// with diacritics removed. to Latin alphabet
			// https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
			sort_key = sort_key.normalize("NFD")
					.replace(/[\u0300-\u036f]/g, "");
		}
		if (to_lower_case)
			sort_key = sort_key.toLowerCase();
		return sort_key;
	}

	// TODO: check if the sort_key is the same as page title or DEFAULTSORT
	function set_sort_key_of_category(sort_key) {
		if (typeof sort_key === 'undefined' || sort_key === null)
			return;

		var category_token = this;
		// const
		var old_sort_key = category_token.sort_key
				&& page_title_to_sort_key(category_token.sort_key);
		if (old_sort_key) {
			if (old_sort_key === sort_key) {
				// Nothing changed
				return;
			}
			if (old_sort_key.length > sort_key
					|| !old_sort_key.startsWith(sort_key)) {
				library_namespace.debug('The sort key of <code><nowiki>'
						+ category_token + '</nowiki></code> will be set to '
						+ JSON.stringify(sort_key) + '!', 1,
						'set_sort_key_of_category');
			}
		}
		category_token[2] = category_token.sort_key = sort_key;
		return true;
	}

	// --------------------------------------------------------------------------------------------
	// parse wikitext.

	/**
	 * 不包含可 parse 之要素，不包含 text 之 type。<br />
	 * 不应包含 section title，因可能有 "==[[]]==" 的情况。
	 * 
	 * @type {Object}
	 */
	var atom_type = {
		namespace : true,
		// https://phabricator.wikimedia.org/T173889
		page_title : true,
		// external_link : true,
		url : true,
		style : true,
		tag_single : true,
		comment : true
	};

	// tree level
	var KEY_DEPTH = 'depth';

	/**
	 * 设定 token 为指定 type。将 token 转为指定 type。
	 * 
	 * @param {Array}token
	 *            parse_wikitext() 解析 wikitext 所得之，以 {Array} 组成之结构。
	 * @param {String}type
	 *            欲指定之类型。 e.g., 'transclusion'.
	 * 
	 * @returns {Array}token
	 * 
	 * @see wiki_token_toString
	 */
	function set_wiki_type(token, type, parent) {
		// console.trace(token);
		if (typeof token === 'string') {
			token = [ token ];
		} else if (!Array.isArray(token)) {
			library_namespace.warn('set_wiki_type: The token is not Array!');
		} else if (token.type && token.type !== 'plain') {
			// 就算 token.type !== type，可能是 <span> 中嵌套 <span> 的形式，
			// 不该直接 `return token` 。

			// 预防token本来就已经有设定类型。
			token = [ token ];
		}
		// assert: Array.isArray(token)
		token.type = type;
		if (type in atom_type) {
			token.is_atom = true;
		}
		// check
		if (false && !wiki_token_toString[type]) {
			throw new Error('.toString() not exists for type [' + type + ']!');
		}

		token.toString = wiki_token_toString[type];
		// Object.defineProperty(token, 'toString', wiki_token_toString[type]);

		if (false) {
			var depth;
			if (parent >= 0) {
				// 当作直接输入 parent depth。
				depth = parent + 1;
			} else if (parent && parent[KEY_DEPTH] >= 0) {
				depth = parent[KEY_DEPTH] + 1;
			}
			// root 的 depth 为 (undefined|0)===0
			token[KEY_DEPTH] = depth | 0;
		}

		return token;
	}

	// --------------------------------------------------------------------------------------------

	/**
	 * 将特殊标记解译/还原成 {Array} 组成之结构。
	 * 
	 * @param {Array}queue
	 *            temporary queue.
	 * @param {String}include_mark
	 *            解析用之起始特殊标记。
	 * @param {String}end_mark
	 *            结束之特殊标记。
	 * 
	 * @see parse_wikitext()
	 */
	function resolve_escaped(queue, include_mark, end_mark, options) {
		if (false) {
			library_namespace.debug('queue: ' + queue.join('\n--- '), 4,
					'resolve_escaped');
			console.log('resolve_escaped: ' + JSON.stringify(queue));
		}

		var resolve_filter = options && options.resolve_filter;

		function resolving_item(item) {
			// result queue
			var result = [];

			item.split(include_mark).forEach(function(piece, index) {
				if (index === 0) {
					if (piece) {
						result.push(piece);
					}
					return;
				}

				index = piece.indexOf(end_mark);
				var token;
				if (index === NOT_FOUND || index === 0
				//
				|| !((token = +piece.slice(0, index)) in queue)) {
					result.push(include_mark + piece);
					return;
				}
				token = queue[token];
				if (resolve_filter && !resolve_filter(token)) {
					result.push(include_mark + piece);
					return;
				}
				result.push(token);
				if (piece = piece.slice(index + end_mark.length))
					result.push(piece);
			});

			if (result.length > 1) {
				// console.log(result);
				set_wiki_type(result, 'plain');
			} else {
				result = result[0];
			}
			if (!resolve_filter && result.includes(include_mark)) {
				throw new Error('resolve_escaped: 仍有 include mark 残留！');
			}
			return result;
		}

		if (options && ('resolve_item' in options)) {
			return resolving_item(options.resolve_item);
		}

		var length = queue.length;
		for (var index = queue.last_resolved_length | 0; index < length; index++) {
			var item = queue[index];
			if (false)
				library_namespace.debug([ 'item', index, item ], 4,
						'resolve_escaped');
			if (typeof item !== 'string') {
				// already resolved
				// assert: Array.isArray(item)
				continue;
			}

			var result = resolving_item(item);
			queue[index] = result;
		}
		if (!resolve_filter)
			queue.last_resolved_length = length;
		// console.log('resolve_escaped end: '+JSON.stringify(queue));
	}

	// 经测试发现 {{...}} 名称中不可有 [{}<>\[\]]
	// while(/{{{[^{}\[\]]+}}}/g.exec(wikitext));
	// [|{}] or [|{}=]
	// 但允许 "{{\n name}}"
	// 模板名#后的内容会忽略。
	/** {RegExp}模板的匹配模式。 */
	// var PATTERN_transclusion =
	// /{{[\s\n]*([^\s\n#\|{}<>\[\]][^#\|{}<>\[\]]*)(?:#[^\|{}]*)?((?:(\||{{\s*!\s*}})[^<>\[\]]*)*?)}}/g;
	/**
	 * {RegExp}wikilink内部连结的匹配模式。
	 * 
	 * @see PATTERN_wikilink
	 */
	// var PATTERN_link =
	// /\[\[[\s\n]*([^\s\n\|{}<>\[\]�][^\|{}<>\[\]�]*)((?:(\||{{\s*!\s*}})[^\|{}<>\[\]]*)*)\]\]/g;
	/**
	 * Wikimedia projects 的 external link 匹配模式。
	 * 
	 * matched: [ all external link wikitext, URL, delimiter, link name ]
	 * 
	 * 2016/2/23: 经测试，若为结尾 /$/ 不会 parse 成 external link。<br />
	 * 2016/2/23: "[ http...]" 中间有空白不会被判别成 external link。
	 * 
	 * @type {RegExp}
	 * 
	 * @see PATTERN_URL_GLOBAL, PATTERN_URL_WITH_PROTOCOL_GLOBAL,
	 *      PATTERN_URL_prefix, PATTERN_WIKI_URL, PATTERN_wiki_project_URL,
	 *      PATTERN_external_link_global
	 * 
	 * @see https://zh.wikipedia.org/w/api.php?action=query&meta=siteinfo&siprop=protocols&utf8&format=json
	 */
	var PATTERN_external_link_global = /\[((?:https?:|ftps?:)?\/\/[^\s\|<>\[\]{}\/][^\s\|<>\[\]{}]*)(?:([^\S\r\n]+)([^\]]*))?\]/ig,

	// 若包含 br|hr| 会导致 "aa<br>\nbb</br>\ncc" 解析错误！
	/** {String}以"|"分开之 wiki tag name。 [[Help:Wiki markup]], HTML tags. 不包含 <a>！ */
	markup_tags = 'bdi|b|del|ins|i|u|font|big|small|sub|sup|h[1-6]|cite|code|em|strike|strong|s|tt|var|div|center|blockquote|[oud]l|table|caption|thead|tbody|tr|th|td|pre|ruby|r[tbp]|p|span|abbr|dfn|kbd|samp|data|time|mark'
			// [[Help:Parser tag]], [[Help:Extension tag]]
			+ '|includeonly|noinclude|onlyinclude'
			// https://phabricator.wikimedia.org/T263082
			// 会读取目标语言的 MediaWiki 转换表
			// [[w:zh:Wikipedia:互助客栈/技术#新的语言转换语法已经启用]]
			// 使用 <langconvert> 的页面，优先级顺序大概是：-{}- 页面语言切换 > <langconvert> > 转换组？
			+ '|langconvert'
			// [[Special:Version#mw-version-parser-extensiontags]]
			// <ce> is deprecated, using <chem>
			// Replace all usages of <ce> with <chem> on wiki
			// https://phabricator.wikimedia.org/T155125
			+ '|categorytree|ce|chem|charinsert|gallery|graph|hiero|imagemap|indicator|inputbox|nowiki|mapframe|maplink|math|poem|quiz|ref|references|score|section|source|syntaxhighlight|templatedata|templatestyles|timeline'

			// https://www.mediawiki.org/wiki/Extension:DynamicPageList_(Wikimedia)
			// + '|DynamicPageList'

			// [[w:en:Template:Term]]
			+ '|li|dt|dd',
	// @see function get_PATTERN_full_tag()
	PATTERN_invalid_end_tag = new RegExp('<(/)(' + markup_tags
			+ ')([\\s/][^<>]*)?>', 'ig'),

	// "<nowiki />", "<nowiki>...<nowiki>" are valid,
	// but "<nowiki> without end tag" is invalid.
	// 必须要写成 <nowiki/>

	// Parser extension tags @ [[Special:Version]]
	// For {{#lst}}, {{#section:}}
	// [[w:en:Help:Labeled section transclusion]]
	// TODO: 标签（tag）现在可以本地化 [[mw:Extension:Labeled_Section_Transclusion/zh]]
	// templatestyles: https://www.mediawiki.org/wiki/Extension:TemplateStyles

	// https://zh.wikipedia.org/w/api.php?action=query&meta=siteinfo&siprop=extensiontags&utf8&format=json
	// 优先权高低: <onlyinclude> → <nowiki> → <noinclude>, <includeonly>
	// [[mw:Transclusion#Partial transclusion markup]]
	// <noinclude>, <includeonly> 在解析模板时优先权必须高于其他 tags。
	wiki_extensiontags = 'includeonly|noinclude|'
			// 在其内部的 wikitext 不会被 parse。允许内部采用 table 语法的 tags。例如
			// [[mw:Manual:Extensions]]
			// configurations.extensiontags
			+ 'pre|nowiki|gallery|indicator|langconvert|timeline|hiero|imagemap|source|syntaxhighlight|poem|quiz|score|templatestyles|templatedata|graph|maplink|mapframe|charinsert|ref|references|inputbox|categorytree|section|math|ce|chem',
	/**
	 * {RegExp}HTML tags 的匹配模式 of <nowiki>。这些 tag 就算中间置入 "<!--" 也不会被当作
	 * comments，必须在 "<!--" 之前解析。 PATTERN_WIKI_TAG_of_wiki_extensiontags
	 */
	PATTERN_wiki_extensiontags = wiki_API.get_PATTERN_full_tag(
			wiki_extensiontags, true),

	// MediaWiki 可接受的 HTML void elements 标签. self-closed HTML tags
	// NO b|span|sub|sup|li|dt|dd|center|small
	// 包含可使用，亦可不使用 self-closing 的 tags。
	// self-closing: void elements + foreign elements
	// https://www.w3.org/TR/html5/syntax.html#void-elements
	// @see [[phab:T134423]]
	// https://www.mediawiki.org/wiki/Manual:OutputPage.php
	// https://www.mediawiki.org/wiki/Help:Lint_errors/self-closed-tag
	self_closed_tags = 'area|base|br|col|embed|hr|img|input|keygen|link|meta|param|source|track|wbr',
	/** {RegExp}HTML self closed tags 的匹配模式。 */
	PATTERN_WIKI_TAG_VOID = new RegExp('<(\/)?(' + self_closed_tags
	// [[w:en:Help:Labeled section transclusion]]
	// Allow `<section begin=chapter1 />`
	+ '|' + wiki_extensiontags
	// allow "<br/>"
	+ ')(\/|\\s[^<>]*)?>', 'ig');

	/** {RegExp}HTML tags 的匹配模式。 */
	// var PATTERN_WIKI_TAG = wiki_API.get_PATTERN_full_tag(markup_tags);
	wiki_extensiontags = wiki_extensiontags.split('|').to_hash();
	markup_tags = markup_tags.split('|');
	/** {RegExp}HTML tags 的匹配模式 without <nowiki>。 */
	var PATTERN_non_wiki_extensiontags = wiki_API
			.get_PATTERN_full_tag(markup_tags.filter(function(tag) {
				return !(tag in wiki_extensiontags);
			}));

	var PATTERN_HTML_tag = wiki_API
			.get_PATTERN_full_tag('[^<>\\s]+', null, 'i');

	/**
	 * Test if the section title is old dot-encoded.
	 * 
	 * e.g.,<code>
	[[台湾话#.E5.8F.97.E6.97.A5.E6.9C.AC.E8.AA.9E.E5.BD.B1.E9.9F.BF.E8.80.85|(其他参考资料)]]
	[[Kingdom of Italy#Fascist regime .281922.E2.80.931943.29|Fascist Italy]]
	</code>
	 * 
	 * @see [[w:en:Help:Link#Section linking (anchors)]], [[w:en:WP:ANCHOR]]
	 *      https://en.wikipedia.org/wiki/Percent-encoding#Types_of_URI_characters
	 */
	var PATTERN_is_dot_encoded = /^([\w\s\-~!*'();:@&=+$,/?#\[\]]|\.[\dA-F]{2})+$/;

	// [[MediaWiki:Converter-manual-rule-error]]: 在手动语言转换规则中检测到错误
	var VALUE_converter_rule_error = 'converter-manual-rule-error';

	/**
	 * .toString() of wiki elements: wiki_token_toString[token.type]<br />
	 * parse_wikitext() 将把 wikitext 解析为各 {Array} 组成之结构。当以 .toString() 结合时，将呼叫
	 * .join() 组合各次元素。此处即为各 .toString() 之定义。<br />
	 * 所有的 key (type) 皆为小写。
	 * 
	 * @type {Object}
	 * 
	 * @see parse_wikitext()
	 */
	var wiki_token_toString = {
		// internal/interwiki link : language links : category links, file,
		// subst 替换引用, ... : title
		// e.g., [[m:en:Help:Parser function]], [[m:Help:Interwiki linking]],
		// [[:File:image.png]], [[wikt:en:Wiktionary:A]],
		// [[:en:Template:Editnotices/Group/Wikipedia:Miscellany for deletion]]
		// [[:en:Marvel vs. Capcom 3: Fate of Two Worlds]]
		// [[w:en:Help:Link#Http: and https:]]
		//
		// 应当使用 [[w:zh:维基百科:编辑提示|编辑提示]] 而非 [[:zh:w:维基百科:编辑提示|编辑提示]]，
		// 见 [[User:Cewbot/Stop]]。
		//
		// @see [[Wikipedia:Namespace]]
		// https://www.mediawiki.org/wiki/Markup_spec#Namespaces
		// [[ m : abc ]] is OK, as "m : abc".
		// [[: en : abc ]] is OK, as "en : abc".
		// [[ :en:abc]] is NOT OK.
		namespaced_title : function() {
			return this.join(this.oddly ? '' : ':');
		},
		// page title, template name
		page_title : function() {
			return this.join(':');
		},
		// link 的变体。但可采用 .name 取得 file name。
		file : function() {
			var wikitext = '[[' + this[0]
			// anchor 网页锚点
			+ this[1];
			if (this.length > 2) {
				var pipe = this.pipe;
				for (var index = 2; index < this.length; index++) {
					// `pipe &&`: for .file.call([])
					wikitext += (pipe && pipe[index - 2] || '|') + this[index];
				}
			}
			return wikitext + ']]';
		},
		// link 的变体。但可采用 .name 取得 category name。
		category : function() {
			return '[[' + this[0]
			// anchor 网页锚点
			+ this[1]
			//
			+ (this.length > 2 ? (this.pipe || '|')
			//
			+ this[2] : '') + ']]';
		},
		// 内部连结 (wikilink / internal link) + interwiki link
		link : function() {
			return '[[' + this[0]
			//
			+ (this[1] || '') + (this.length > 2
			// && this[2] !== undefined && this[2] !== null
			? (this.pipe || '|')
			// + (this[2] || '')
			+ this[2] : '') + ']]';
		},
		// 外部连结 external link, external web link
		external_link : function() {
			// assert: this.length === 1 or 3
			// assert: this.length === 3
			// && this[1].trim() === '' && this[2] === this[2].trimStart()
			return '[' + this.join('') + ']';
		},
		url : function() {
			return this.join('');
		},
		// template parameter
		parameter : function() {
			return '{{{' + this.join('|') + '}}}';
		},
		// e.g., template
		transclusion : function() {
			return '{{' + this.join('|') + '}}';
		},
		magic_word_function : function() {
			return '{{' + this[0] + this.slice(1).join('|') + '}}';
		},

		// [[Help:Table]]
		table : function() {
			// this: [ table style, row, row, ... ]
			return '{|' + this.join('')
					+ ('ending' in this ? this.ending : '\n|}');
		},
		// table attributes / styles, old name before 2021/1/24: table_style
		table_attributes : function() {
			return this.join('') + (this.suffix || '');
		},
		// table caption
		caption : function() {
			// this: [ main caption, invalid caption, ... ]
			return (this.delimiter || '') + this.join('');
		},
		table_row : function() {
			// this: [ row style, cell, cell, ... ]
			return (this.delimiter || '') + this.join('');
		},
		table_cell : function() {
			// this: [ contents ]
			// this.delimiter:
			// /\n[!|]|!!|\|\|/ or undefined (在 style/第一区间就已当作 cell)
			return (this.delimiter || '') + this.join('');
		},

		// 手工字词转换 language conversion -{}-
		convert : function(language, lang_fallbacks, force_show) {
			if (!language) {
				return '-{'
				//
				+ ('flag' in this ? (this._flag || this.flag) + '|' : '')
						+ this.join(';') + '}-';
			}

			if (language === 'rule') {
				// gets the rule of conversion only
				return this.join(';');
			}

			if (language === 'normalized rule') {
				// @see function item_to_conversion(item) @
				// CeL.application.net.wiki
				var rule = parse_wikitext('-{A|'
				// .toString('rule')
				+ this.join(';') + '}-', {
					normalize : true,
				})
				// .toString('rule')
				.join(';');
				if (lang_fallbacks) {
					// as 通用的转换式
					// function normalized_general_rule(token)
					// const rule = token.toString('normalized rule', true);

					// 通用的转换式不该为连结。
					rule = rule.replace(/:\[\[([^\[\]]+)\]\]($|;)/g, ':$1$2')
							.replace(/^\[\[([^\[\]]+)\]\]$/g, '$1');
				}
				return rule;
			}

			var flag = this.flag;
			if (!force_show && (flag in {
				// add rule for convert code (but no display in placed code)
				H : true,
				T : true,
				'-' : true
			})) {
				return '';
			}

			if (flag in {
				// raw content
				R : true,
				// description
				D : true
			}) {
				return this.join(';');
			}

			language = language.trim().toLowerCase();
			if (Array.isArray(flag)) {
				if (!flag.includes(language)) {
					// 单纯显示不繁简转换的文字。
					return this.join(';');
				}
				// TODO: 显示繁简转换后的文字。
				return this.join(';');
			}

			// TODO: 后援语种 fallback language variant。

			// https://zh.wikipedia.org/w/api.php?action=query&meta=siteinfo&siprop=general%7Cnamespaces%7Cnamespacealiases%7Cstatistics
			// language fallbacks: [[mw:Localisation statistics]]
			// (zh-tw, zh-hk, zh-mo) → zh-hant (→ zh?)
			// (zh-cn, zh-sg, zh-my) → zh-hans (→ zh?)
			// [[Wikipedia_talk:地区词处理#zh-my|马来西亚简体华语]]
			// [[MediaWiki:Variantname-zh-tw]]
			if (!this.conversion[language]) {
				if (/^zh-(?:tw|hk|mo)/.test(language)) {
					language = 'zh-hant';
				} else if (/^zh/.test(language)) {
					language = 'zh-hans';
				}
			}

			var convert_to = this.conversion[language];
			if (Array.isArray(convert_to)) {
				// e.g., -{H|zh-tw:a-{b}-c}-
				var not_all_string;
				convert_to = convert_to.map(function(token) {
					if (typeof token === 'string')
						return token;
					if (token.type === 'convert'
							&& typeof token.converted === 'string')
						return token.converted;
					not_all_string = true;
				});
				if (!not_all_string)
					convert_to = convert_to.join('');
				else
					convert_to = this.conversion[language];
			}

			if (convert_to)
				return convert_to;
			if (typeof this.converted === 'string' && this.converted)
				return this.converted;

			// e.g., "-{zh-cn:下划线; zh-tw:底线}-" .toString('zh')
			// console.trace([ this, arguments ]);
			return VALUE_converter_rule_error;
		},

		// Behavior switches
		'switch' : function() {
			// assert: this.length === 1
			return '__' + this[0] + '__';
		},
		// italic type
		italic : function() {
			return "''" + this.join('') + (this.no_end ? '' : "''");
		},
		// emphasis
		bold : function() {
			return "'''" + this.join('') + (this.no_end ? '' : "'''");
		},

		// section title / section name
		// show all section titles:
		// parser=CeL.wiki.parser(page_data);parser.each('section_title',function(token,index){console.log('['+index+']'+token.title);},false,1);
		// @see for_each_token()
		// parser.each('plain',function(token){},{slice:[1,2]});
		section_title : function(get_inner) {
			// this.join(''): 必须与 wikitext 相同。见 parse_wikitext.title。
			var inner = this.join('');
			if (get_inner) {
				// section_title.toString(true): get inner
				// Must .trim() yourself.
				return inner;
			}

			var level = '='.repeat(this.level);
			return level + inner + level
			// this.postfix maybe undefined, string, {Array}
			+ (this.postfix || '');
		},

		// [[Help:Wiki markup]], HTML tags
		tag : function() {
			// this: [ {String}attributes, {Array}inner nodes ].tag
			// 欲取得 .tagName，请用 this.tag.toLowerCase();
			// 欲取得 .inner nodes，请用 this[1];
			// 欲取得 .innerHTML，请用 this[1].toString();
			return '<' + this.tag + (this[0] || '') + '>' + this[1]
					+ ('ending' in this ? this.ending : '</' + this.tag + '>');
		},
		tag_attributes : function() {
			return this.join('');
		},
		tag_inner : function() {
			// console.trace(this);
			return this.join('');
		},
		tag_single : function() {
			// this: [ {String}attributes ].tag
			// 欲取得 .tagName，请用 this.tag.toLowerCase();
			// 有 .slash 代表 invalid tag。
			return '<' + (this.slash || '') + this.tag + this.join('') + '>';
		},

		// comments: <!-- ... -->
		comment : function() {
			// "<\": for Eclipse JSDoc.
			return '<\!--' + this.join('') + (this.no_end ? '' : '-->');
		},
		line : function() {
			// https://www.mediawiki.org/wiki/Markup_spec/BNF/Article
			// NewLine = ? carriage return and line feed ? ;
			return this.join('\n');
		},
		list : function() {
			return this.join('');
		},
		list_item : function() {
			return (this.list_prefix || '') + this.join('');
		},
		pre : function() {
			return ' ' + this.join('\n ');
		},
		hr : function() {
			return this[0];
		},
		paragraph : function() {
			return this.join('\n') + (this.separator || '');
		},
		// plain text 或尚未 parse 的 wikitext.
		plain : function() {
			return this.join('');
		}
	};

	// const , for <dl>
	var DEFINITION_LIST = 'd';

	// !!default_magic_words_hash[magic_word] === 必须指定数值，采用 {{#MW:value}}
	// else 可单用 {{MW}}
	var default_magic_words_hash = Object.create(null);
	// https://www.mediawiki.org/wiki/Help:Magic_words
	// https://zh.wikipedia.org/w/api.php?action=query&meta=siteinfo&siprop=functionhooks&utf8&format=json
	('DISPLAYTITLE|DEFAULTSORT|DEFAULTSORTKEY|DEFAULTCATEGORYSORT|デフォルトソート'
			+ '|ns|nse|lc|lcfirst|uc|ucfirst' + '|padleft|padright'
			+ '|formatnum' + '|urlencode|anchorencode'
			+ '|localurl|fullurl|filepath'

			// https://www.mediawiki.org/wiki/Help:Magic_words#Transclusion_modifiers
			// https://en.wikipedia.org/wiki/Help:Transclusion#Transclusion_modifiers
			+ '|int|msg|raw|msgnw|subst|safesubst'
	// 这些需要指定数值。 e.g., {{NS:1}}: OK, {{NS}} will get " ", {{NS:}} will get ""
	).split('|').forEach(function name(magic_word) {
		default_magic_words_hash[magic_word.toUpperCase()] = true;
	});
	// https://zh.wikipedia.org/w/api.php?action=query&meta=siteinfo&siprop=variables&utf8&format=json
	('!|='
			+ '|CURRENTYEAR|CURRENTMONTH|CURRENTDAY|CURRENTTIME|CURRENTHOUR|CURRENTWEEK|CURRENTTIMESTAMP'
			+ '|NAMESPACE|NAMESPACENUMBER'
			+ '|FULLPAGENAME|PAGENAME|BASEPAGENAME|SUBPAGENAME|SUBJECTPAGENAME|ARTICLEPAGENAME|TALKPAGENAME|ROOTPAGENAME'
			+ '|FULLPAGENAMEE|PAGENAMEE|BASEPAGENAMEE|SUBPAGENAMEE|SUBJECTPAGENAMEE|ARTICLEPAGENAMEE|TALKPAGENAMEE|ROOTPAGENAMEE'
	// 这些不用指定数值。
	).split('|').forEach(function name(magic_word) {
		default_magic_words_hash[magic_word.toUpperCase()] = false;
	});

	// matched: [ all, inner parameters ]
	var PATTERN_language_conversion = /-{(|[^\n{].*?)}-/g;

	// parse 手动转换语法的转换标签的语法
	// 经测试，":"前面与后面不可皆有空白。
	// (\s{2,}): 最后的单一/\s/会被转换为"&#160;"
	// matched: [ all, 指定转换字串, 指定转换词, spaces,
	// this language code, colon, this language token, last spaces ]
	var PATTERN_conversion_slice = /^(([\s\S]+?)=>)?(\s*)(zh(?:-(?:cn|tw|hk|mo|sg|my|hant|hans))?)(\s*:|:\s*)(\S.*?)(\s{2,})?$/;

	// 状态开关: [[mw:Help:Magic words#Behavior switches]]
	var PATTERN_BEHAVIOR_SWITCH = /__([A-Z]+(?:_[A-Z]+)*)__/g;
	PATTERN_BEHAVIOR_SWITCH = /__(NOTOC|FORCETOC|TOC|NOEDITSECTION|NEWSECTIONLINK|NONEWSECTIONLINK|NOGALLERY|HIDDENCAT|NOCONTENTCONVERT|NOCC|NOTITLECONVERT|NOTC|INDEX|NOINDEX|STATICREDIRECT|NOGLOBAL)__/g;

	// [[w:en:Wikipedia:Extended image syntax]]
	// [[mw:Help:Images]]
	var file_options = {
		// Type, display format, 表示形式
		thumb : 'format',
		thumbnail : 'format',
		frame : 'format',
		framed : 'format',
		frameless : 'format',

		// Border, 外枠, 縁取る, 境界
		border : 'border',

		// Location, Horizontal alignment option, 配置位置
		right : 'location',
		left : 'location',
		// 居中, 不浮动
		center : 'location',
		// 不浮动
		none : 'location',

		// Vertical alignment option, 垂直方向の位置
		baseline : 'alignment',
		middle : 'alignment',
		sub : 'alignment',
		'super' : 'alignment',
		'text-top' : 'alignment',
		'text-bottom' : 'alignment',
		top : 'alignment',
		bottom : 'alignment',

		// Link option
		// link : 'link',

		// alt : 'alt',
		// lang : 'language',

		// https://en.wikipedia.org/wiki/Wikipedia:Creation_and_usage_of_media_files#Setting_a_video_thumbnail_image
		// thumbtime : 'video_thumbtime',
		// start : 'video_start',
		// end : 'video_end',

		// page : 'book_page',
		// 'class' : 'CSS_class',

		// Size, Resizing option
		// 放大倍数
		upright : 'size'
	};

	function join_string_of_array(array) {
		for (var index = 1; index < array.length;) {
			if (typeof array[index] !== 'string') {
				index++;
				continue;
			}

			if (array[index] === '') {
				array.splice(index, 1);
				continue;
			}

			if (typeof array[index - 1] === 'string') {
				array[index - 1] += array[index];
				array.splice(index, 1);
			} else {
				index++;
			}
		}

		return array;
	}

	function is_parsed_element(value) {
		return Array.isArray(value) && value.type;
	}

	// 可算 function preprocess_section_link_token(token, options) 的简化版。
	// 可能保留 "\n" 必须自己 .trim()。
	function wiki_token_to_key(token) {
		if (!Array.isArray(token))
			return token;

		var has_no_string;
		// key token must accept '\n'. e.g., "key_ \n _key = value"
		var _token = token.filter(function(t) {
			if (t.type === 'plain')
				t = wiki_token_to_key(t);

			if (!Array.isArray(t))
				return t;

			// 去除注解 comments。
			if (t.type === 'comment') {
				return;
			}

			has_no_string = true;
			return true;
		});

		// console.trace([ has_no_string, _token ]);
		if (token.type === 'plain' && !has_no_string)
			return _token.join('');
		return set_wiki_type(_token, token.type);
	}

	/**
	 * parse The MediaWiki markup language (wikitext / wikicode). 解析维基语法。
	 * 维基语法解析器
	 * 
	 * TODO:<code>

	<p<!-- -->re>...</pre>

	parse {{Template:Single chart}}

	</code>
	 * 
	 * 此功能之工作机制/原理：<br />
	 * 找出完整的最小单元，并将之 push 入 queue，并把原 string 中之单元 token 替换成:<br />
	 * {String}include_mark + ({ℕ⁰:Natural+0}index of queue) + end_mark<br />
	 * e.g.,<br />
	 * "a[[p]]b{{t}}" →<br />
	 * "a[[p]]b\00;", queue = [ ["t"].type='transclusion' ] →<br />
	 * "a\01;b\00;", queue = [ ["t"].type='transclusion', ["p"].type='link' ]<br />
	 * 最后再依 queue 与剩下的 wikitext，以 resolve_escaped() 作 resolve。
	 * 
	 * @param {String}wikitext
	 *            wikitext to parse
	 * @param {Object}[options]
	 *            附加参数/设定选择性/特殊功能与选项
	 * @param {Array}[queue]
	 *            temporary queue. 基本上仅供内部使用。
	 * 
	 * @returns {Array}parsed data
	 * 
	 * @see https://blog.wikimedia.org/2013/03/04/parsoid-how-wikipedia-catches-up-with-the-web/
	 *      https://phabricator.wikimedia.org/diffusion/GPAR/
	 * 
	 * @see [[w:en:Help:Wikitext]], [[Wiki标记式语言]]
	 *      https://www.mediawiki.org/wiki/Markup_spec/BNF/Article
	 *      https://www.mediawiki.org/wiki/Markup_spec/BNF/Inline_text
	 *      https://www.mediawiki.org/wiki/Markup_spec
	 *      https://www.mediawiki.org/wiki/Wikitext
	 *      https://doc.wikimedia.org/mediawiki-core/master/php/html/Parser_8php.html
	 *      Parser.php: PHP parser that converts wiki markup to HTML.
	 *      https://mwparserfromhell.readthedocs.io/
	 */
	function parse_wikitext(wikitext, options, queue) {
		if (!wikitext) {
			return wikitext;
		}

		function _set_wiki_type(token, type) {
			// 这可能性已经在下面个别处理程序中侦测并去除。
			if (false && typeof token === 'string'
					&& token.includes(include_mark)) {
				queue.push(token);
				resolve_escaped(queue, include_mark, end_mark);
				token = [ queue.pop() ];
			}

			return set_wiki_type(token, type, wikitext);

			// 因为parse_wikitext()采用的是从leaf到root的解析法，因此无法在解析leaf时就知道depth。
			// 故以下废弃。
			var node = set_wiki_type(token, type);
			library_namespace.debug('set depth ' + depth_of_children
					+ ' to children [' + node + ']', 3, '_set_wiki_type');
			node[KEY_DEPTH] = depth_of_children;
			return node;
		}

		// 正规化并提供可随意改变的同内容参数，以避免修改或覆盖附加参数。
		// 每个parse_wikitext()都需要新的options，需要全新的。
		// options = Object.assign({}, options);
		options = library_namespace.setup_options(options);

		var session = wiki_API.session_of_options(options);

		if (false) {
			// assert: false>=0, (undefined>=0)
			// assert: (NaN | 0) === 0
			var depth_of_children = ((options[KEY_DEPTH]) | 0) + 1;
			// assert: depth_of_children >= 1
			library_namespace.debug('[' + wikitext + ']: depth_of_children: '
					+ depth_of_children, 3, 'parse_wikitext');
			options[KEY_DEPTH] = depth_of_children;
		}

		var
		/**
		 * 解析用之起始特殊标记。<br />
		 * 需找出一个文件中不可包含，亦不会被解析的字串，作为解析用之起始特殊标记。<br />
		 * e.g., '\u0000' === '\x00' === '\0'.<br />
		 * include_mark + ({ℕ⁰:Natural+0}index of queue) + end_mark
		 * 
		 * assert: /\s/.test(include_mark) === false
		 * 
		 * @see [[mw:Strip marker]]
		 * 
		 * @type {String}
		 */
		include_mark = options.include_mark || '\x00',
		/**
		 * {String}结束之特殊标记。 end of include_mark. 不可为数字 (\d) 或
		 * include_mark，不包含会被解析的字元如 /;/。应为 wikitext 所不容许之字元。<br />
		 * e.g., '\x01' === '\u0001'.<br />
		 */
		end_mark = options.end_mark || '\x01',
		/** {Boolean}是否顺便作正规化。预设不会规范页面内容。 */
		normalize = options.normalize,
		/** {Array}是否需要初始化。 [ {String}prefix added, {String}postfix added ] */
		initialized_fix = !queue && [ '', '' ],
		// 这项设定不应被继承。
		no_resolve = options.no_resolve;
		if (no_resolve) {
			delete options.no_resolve;
		}

		if (/\d/.test(end_mark) || include_mark.includes(end_mark))
			throw new Error('Error end of include_mark!');

		if (initialized_fix) {
			// 初始化。
			if (!wikitext.replace) {
				if (Array.isArray(wikitext) && wikitext.type) {
					library_namespace.debug('Treat [' + wikitext
							+ '] as parsed token and return directly!', 3,
							'parse_wikitext');
					return wikitext;
				}
				console.trace(wikitext);
			}
			wikitext = wikitext
			// 注意: 2004年5月早期的中文维基百科换行采用 "\r\n"，因此必须保留 "\r"。
			// .replace(/\r\n/g, '\n')
			.replace(
			// 先 escape 掉会造成问题之 characters。
			new RegExp(include_mark.replace(/([\s\S])/g, '\\$1'), 'g'),
					include_mark + end_mark);
			if (!wikitext.startsWith('\n') &&
			// /\n([*#:;]+|[= ]|{\|)/:
			// https://www.mediawiki.org/wiki/Markup_spec/BNF/Article#Wiki-page
			// https://www.mediawiki.org/wiki/Markup_spec#Start_of_line_only
			/^(?:[*#;:=\s]|{\|)/.test(wikitext))
				wikitext = (initialized_fix[0] = '\n') + wikitext;
			if (!wikitext.endsWith('\n'))
				wikitext += (initialized_fix[1] = '\n');
			// setup temporary queue
			queue = [];
		}

		var section_title_hierarchy = queue.section_title_hierarchy
				|| (queue.section_title_hierarchy = []);
		if (!section_title_hierarchy[0]) {
			// As root
			section_title_hierarchy[0] = options.target_array
					|| Object.create(null);
			section_title_hierarchy[0].child_section_titles = [];
		}

		if (!queue.conversion_table) {
			// [[MediaWiki:Conversiontable/zh-hant]]
			queue.conversion_table = Object.create(null);
		}

		if (typeof options.prefix === 'function') {
			wikitext = options.prefix(wikitext, queue, include_mark, end_mark)
					|| wikitext;
		}

		// 预防有特殊 elements 置入其中。此时将之当作普通 element 看待。
		// cf. deep resolve_escaped()
		function shallow_resolve_escaped(text) {
			if (text.includes(include_mark)) {
				// 经过改变，需再进一步处理。
				text = parse_wikitext(text, options, queue);
			}
			return text;
		}

		// console.trace(wikitext);

		// ------------------------------------------------------------------------
		// parse functions

		function parse_language_conversion(all, parameters) {
			// -{...}- 自 end_mark 向前回溯。
			var index = parameters.lastIndexOf('-{'),
			// 在先的，在前的，前面的； preceding
			// (previous 反义词 following, preceding 反义词 exceeds)
			previous;
			if (index > 0) {
				previous = '-{' + parameters.slice(0, index);
				parameters = parameters.slice(index + '}-'.length);
			} else {
				previous = '';
			}
			library_namespace.debug(previous + ' + ' + parameters, 4,
					'parse_wikitext.convert');

			// console.log(parameters);

			var conversion = Object.create(null),
			//
			conversion_list = [], latest_language;

			var _flag = parameters.match(/^([a-zA-Z\-;\s]*)\|(.*)$/), flag;
			if (_flag) {
				parameters = _flag[2];
				var flag_hash = Object.create(null);
				_flag = _flag[1];
				flag = _flag.split(';').map(function(f) {
					f = f.trim();
					if (f)
						flag_hash[f] = true;
					return f;
				}).filter(function(f) {
					return !!f;
				});
				if (flag.length === 0) {
					flag = '';
				} else {
					// https://doc.wikimedia.org/mediawiki-core/master/php/ConverterRule_8php_source.html
					// 仅取首先符合者。
					[ 'R', 'N', '-', 'T', 'H', 'A', 'D' ].some(function(f) {
						if (flag_hash[f]) {
							flag = f;
							return true;
						}
					});
				}
			}

			var conversion_table = flag && (flag in {
				// '+' add rules for alltext
				// '+' : true,

				// these flags above are reserved for program

				// remove convert (not implement)
				// '-' : true,

				// add rule for convert code (but no display in placed code)
				H : true,
				// add rule for convert code (all text convert)
				A : true
			}) && queue.conversion_table;

			// console.log('parameters: ' + JSON.stringify(parameters));
			parameters = parameters.split(';');
			parameters.forEach(function(converted, index) {
				if (normalize) {
					// remove tail spaces
					converted = converted.trim();
				}
				if (PATTERN_conversion_slice.test(converted)
				// e.g., "-{ a; zh-tw: tw }-" 之 " a"
				|| conversion_list.length === 0
				// 最后一个是空白。
				|| !converted.trim() && index + 1 === parameters.length) {
					conversion_list.push(converted);
				} else {
					conversion_list[conversion_list.length - 1]
					// e.g., "-{zh-tw: tw ; tw : tw2}-"
					+= ';' + converted;
				}
			});
			// console.log(conversion_list);
			var convert_from_hash = conversion_table && Object.create(null);
			var unidirectional = [];
			/**
			 * [[Help:高级字词转换语法#基本语法]]
			 * 
			 * <code>

			-{zh-cn:cn; zh-tw:tw;}-
			→
			conversion_table['cn'] = conversion_table['tw'] =
			{'zh-cn':'cn','zh-tw':'tw'}


			-{txt=>zh-cn:cn; txt=>zh-tw:tw;}-
			→
			conversion_table['txt'] =
			{'zh-cn':'cn','zh-tw':'tw'}


			-{txt=>zh-cn:cn; zh-cn:cn; zh-tw:tw;}-
			→
			conversion_table['txt'] =
			{'zh-cn':'cn'}
			∪
			conversion_table['cn'] = conversion_table['tw'] =
			{'zh-cn':'cn','zh-tw':'tw'}

			</code>
			 */
			// TODO: 剖析不出任何对应规则的话，则为 R 旗标转换，即是停用字词转换，显示原文（R stands for raw）。
			conversion_list = conversion_list.map(function(token) {
				var matched = token.match(PATTERN_conversion_slice);
				// console.log(matched);
				if (!matched
				// e.g., -{A|=>zh-tw:tw}-
				|| matched[1] && !(matched[2] = matched[2].trim())) {
					// 经过改变，需再进一步处理。
					return parse_wikitext(token, options, queue);
				}

				// matched.shift();
				matched = matched.slice(1);

				// matched: [ 指定转换字串, 指定转换词, spaces,
				// this language code, colon, this language token, last spaces ]
				if (!matched[6])
					matched.pop();

				// 语言代码 language variant 用字模式
				var language_code = matched[3].trim(), convert_to
				// 经过改变，需再进一步处理。
				= matched[5] = parse_wikitext(matched[5], options, queue);
				if (!convert_to) {
					// 'converter-manual-rule-error'
					return parse_wikitext(token, options, queue);
				}
				conversion[language_code] = convert_to;
				if (!matched[2]) {
					matched.splice(2, 1);
				}
				// 指定仅转换某些特殊词汇。
				// unidirectional_convert_from
				var uniconvert_from;
				if (matched[0]) {
					uniconvert_from = matched[1].trim();
					if (!uniconvert_from) {
						// if $from is empty, strtr() could return a wrong
						// result.
					}
					matched.splice(1, 1);
				} else {
					matched.splice(0, 2);
				}
				token = _set_wiki_type(matched, 'plain');
				token.is_conversion = true;

				if (!conversion_table) {
					;
				} else if (uniconvert_from) {
					// 单向转换 unidirectional convert
					unidirectional.push(uniconvert_from);
					if (!conversion_table[uniconvert_from]) {
						conversion_table[uniconvert_from]
						// Initialization
						= Object.create(null);
					} else if (conversion_table[uniconvert_from].conversion) {
						conversion_table[uniconvert_from] = Object.clone(
						// assert:
						// conversion_table[uniconvert_from].type==='convert'
						conversion_table[uniconvert_from].conversion);
					}

					if (false && options.conflict_conversion
					// overwrite
					&& conversion_table[uniconvert_from][language_code]) {
						options.conflict_conversion.call(conversion_table,
								uniconvert_from, language_code,
								conversion_table[uniconvert_from]
								//
								[language_code], convert_to);
					}

					conversion_table[uniconvert_from][language_code]
					// settle
					= convert_to;

				} else if (typeof convert_to === 'string') {
					// 后面的设定会覆盖先前的设定。
					convert_from_hash[language_code] = convert_to;
				} else if (convert_to && convert_to.type === 'plain') {
					// 双向转换 bidirectional convert
					// -{H|zh-cn:俄-{匊}-斯;zh-tw:俄-{匊}-斯;zh-hk:俄-{匊}-斯;}-
					// 当作 "俄匊斯"
					var not_all_string;
					convert_to = convert_to.map(function(token) {
						if (typeof token === 'string')
							return token;
						if (token.type === 'convert'
								&& typeof token.converted === 'string')
							return token.converted;
						not_all_string = true;
					});
					if (!not_all_string) {
						// 后面的设定会覆盖先前的设定。
						convert_from_hash[language_code] = convert_to.join('');
					}
				}

				// console.log(JSON.stringify(token));
				return token;
			});
			if (normalize) {
				// 正规化后可以不保留 -{...;}- 最后的 ';'
				conversion_list = conversion_list.filter(function(token) {
					return !!token;
				});
				conversion_list.sort(function(_1, _2) {
					// assert: {Array} _1, _2
					return _1[0] < _2[0] ? -1 : _1[0] > _2[0] ? 1 : 0;
				});
			}
			// console.log(conversion_list);
			parameters = _set_wiki_type(conversion_list, 'convert');
			parameters.conversion = conversion;
			if (unidirectional.length > 0)
				parameters.unidirectional = unidirectional.unique();
			if (typeof _flag === 'string') {
				if (_flag !== flag)
					parameters._flag = _flag;
				parameters.flag = flag;
				if (flag === 'T')
					options.conversion_title = parameters;
			}
			// console.log(convert_from_hash);
			convert_from_hash && Object.values(convert_from_hash)
			//
			.forEach(function(convert_from_string) {
				// console.log(convert_from_string);
				conversion_table[convert_from_string] = parameters;
			});
			// console.log(JSON.stringify(wikitext));
			// console.log(conversion_table);

			if (queue.switches && (queue.switches.__NOCC__
			// 使用魔术字 __NOCC__ 或 __NOCONTENTCONVERT__ 可避免转换。
			|| queue.switches.__NOCONTENTCONVERT__)) {
				parameters.no_convert = true;
			} else if (Object.keys(conversion).length === 0) {
				// assert: parameters.length === 1
				// e.g., "-{ t {{T}} }-"
				// NOT "-{ zh-tw: tw {{T}} }-"
				parameters.converted = parameters[0];
			} else if (options.language) {
				// TODO: 先检测当前使用的语言，然后转成在当前环境下转换过、会显示出的结果。
				var converted = parameters.toString(options.language);
				if (converted !== VALUE_converter_rule_error)
					parameters.converted = converted;
			}

			queue.push(parameters);
			return previous + include_mark + (queue.length - 1) + end_mark;
		}

		function is_invalid_page_name(page_name) {
			return page_name.is_link || page_name.tag
			// <nowiki /> 能断开如 [[L<nowiki />L]]
			&& page_name.tag.toLowerCase() in extensiontag_hash;
		}

		// TODO: 紧接在连结后面的 /[a-zA-Z\x80-\x10ffff]+/ 会显示为连结的一部分。
		// https://phabricator.wikimedia.org/T263266
		function parse_wikilink(all_link, page_and_anchor, page_name, anchor,
				pipe_separator, display_text) {
			// 自 end_mark 向前回溯。
			var previous;
			if (display_text && display_text.includes('[[')) {
				var index = all_link.lastIndexOf('[[');
				previous = all_link.slice(0, index);
				all_link = all_link.slice(index);
				index = all_link.match(PATTERN_wikilink);
				if (index) {
					page_and_anchor = index[1];
					// `{{NAMESPACE}}:{{PAGENAME}}`
					page_name = index[2];
					anchor = index[3];
					pipe_separator = index[4];
					display_text = index[5];
				} else {
					// revert
					all_link = previous + all_link;
					previous = '';
				}
			} else {
				previous = '';
			}

			if (display_text && /\n=+[^=]=+/.test(display_text)) {
				// incase '[[A|B]\n==T==\n<code>[[]]</code>'
				// TODO: fix '[[A|B]<code>]]still code'
				return previous + all_link;
			}

			var matched = display_text
			// @see PATTERN_for_transclusion
			&& display_text.match(/{{([^{}][\s\S]*?)$/);
			if (matched && !matched[1].includes('}}')) {
				// e.g., `[[File:i.png|\n{{t|]]}}\n]]`
				return previous + all_link;
			}

			library_namespace.debug('[' + previous + '] + [' + all_link + ']',
					4, 'parse_wikitext.link');

			var file_matched, category_matched;
			if (!page_name) {
				// assert: [[#anchor]]
				page_name = '';
				// anchor, fragment, section_title
				anchor = page_and_anchor;
			} else if (!page_name.trim()) {
				// e.g., "[[ ]]", "[[ #...]]"
				return previous + all_link;
			} else {
				if (!anchor) {
					anchor = '';
				}
				if (normalize) {
					page_name = page_name.trim();
				}
				// test [[file:name|...|...]]
				file_matched = page_name.match(PATTERN_file_prefix);
				if (!file_matched) {
					category_matched = page_name
					// test [[Category:name|order]]
					.match(PATTERN_category_prefix);
					// console.log([ page_name, category_matched ]);
				} else if (file_matched[1]) {
					// console.trace(file_matched);
					file_matched = null;
				}
				// [[::zh:title]] would be rendered as plaintext
				if (/^\s*:\s*:/.test(page_name)) {
					return previous + all_link;
				}
				if (page_name.includes(include_mark)) {
					// console.trace(page_name);
					// 预防有特殊 elements 置入link其中。
					page_name = parse_wikitext(page_name, options, queue);
					if (false) {
						console.log([ all_link, page_and_anchor, page_name,
								anchor, display_text ]);
					}
					var matched = /* !display_text && */previous
					// e.g., [[file:a.JPG|thumb|[[<ref>a</ref>]] ]]
					&& PATTERN_file_prefix.test(previous.slice(2))
							&& 'link_inside_file';
					// matched: will be extracted later via resolve_filter
					if (!matched
					// e.g., [[[[T]]]]
					// e.g., '[[<ref>a</ref>|b]]'
					&& (is_invalid_page_name(page_name)
					// e.g., [[:[[Portal:中国大陆新闻动态|中国大陆新闻]] 3月16日新闻]]
					// [[[[t|l]], t|l]]
					|| page_name.some(is_invalid_page_name))) {
						// console.trace(page_name);
						// page_name.oddly = 'link_inside_link';
						return previous + all_link;
					}
					page_name = [ page_name ];
					page_name.oddly = matched || true;
				} else {
					var matched = (session || wiki_API).namespace(page_name, {
						get_name : true
					});
					page_name = [ page_name ];
					page_name.namespace = matched;
					if (matched
							&& (matched = page_name[0]
									.match(/^([^:]+):([\s\S]*)$/))) {
						page_name[0] = matched[1];
						page_name[1] = matched[2];
					} else {
						// e.g., [[File]]
						page_name.namespace = '';
						// page_name = page_name.split(normalize ? /\s*:\s*/ :
						// ':');
					}
				}
				page_name = _set_wiki_type(page_name, 'namespaced_title');
			}
			if (normalize) {
				// assert: anchor && anchor.startsWith('#')
				anchor = anchor.trimEnd();
			}
			if (anchor) {
				// 经过改变，需再进一步处理。
				// e.g., '[[t#-{c}-]]'
				anchor = parse_wikitext(anchor, options, queue);
			}

			// [ page_name, section_title / #anchor 网页锚点, display_text ]
			var parameters = [ page_name, anchor ];
			if (false) {
				// page_title, full_page_name, {{FULLPAGENAME}}:
				// `{{NAMESPACE}}:{{PAGENAME}}`
				parameters.page_name = wiki_API.normalize_title(page_name);
			}

			// assert: 'a'.match(/(b)?/)[1]===undefined
			if (typeof display_text === 'string') {
				if (file_matched) {
					// caption 可以放在中间，但即使是空白也会被认作是 caption:
					// ;;; [[File:a.svg|caption|thumb]]
					// === [[File:a.svg|thumb|caption]]
					// !== [[File:a.svg|NG caption|thumb|]]
					// === [[File:a.svg|thumb|NG caption|]]

					// 先处理掉里面的功能性代码。 e.g.,
					// [[File:a.svg|alt=alt_of_{{tl|t}}|NG_caption|gykvg=56789{{tl|t}}|{{#ifexist:abc|alt|link}}=abc|{{#ifexist:abc|left|456}}|{{#expr:100+300}}px|thumb]]
					// e.g., [[File:a.svg|''a''|caption]]
					display_text = parse_wikitext(display_text, Object.assign({
						no_resolve : true
					}, options), queue);

					display_text = resolve_escaped(
					// recover {{!}}
					queue, include_mark, end_mark, {
						resolve_item : display_text,
						resolve_filter : function(token) {
							return token.is_magic_word && token.name === '!'
							// e.g., '[[file:a.JPG|thumb|[[<ref>a</ref>|b]] ]]'
							|| token.type === 'plain'
							//
							&& token.oddly === 'link_inside_file';
						}
					}).toString();

					parameters.index_of = Object.create(null);
					pipe_separator = [ pipe_separator ];

					// [ file namespace, anchor / section_title,
					// parameters 1, parameters 2, parameters..., caption ]
					var token, file_option,
					// parameters 有分大小写与繁简体，并且各种类会以首先符合的为主。
					PATTERN = /([^\|]*?)(\||{{\s*!\s*}}|$)/ig;
					// assert: 这会将剩下来的全部分完。
					while (token = PATTERN.exec(display_text)) {
						var matched = token[1].match(
						// [ all, head space, option name or value, undefined,
						// undefined, tail space ]
						// or
						// [ all, head space, option name, "="+space, value,
						// tail space ]
						/^([\s\n]*)([^={}\[\]<>\s\n][^={}\[\]<>]*?)(?:(=[\s\n]*)([\s\S]*?))?([\s\n]*)$/
						// TODO: 经测试，link等号前方不可有空格，alt等号前方可有空格。必须用小写的"alt"。
						// 现在的处理方法只允许等号前面不可有空格。
						// 档案选项名称可以在地化，不一定都是 [a-z]。
						);
						if (!matched) {
							// e.g., " a<br/>b "
							matched = token[1]
									.match(/^([\s\n]*)([\s\S]*?)([\s\n]*)$/);
							if (matched[1] || matched[3]) {
								// image_description
								parameters.caption
								// 相当于 .trim()
								= matched[2] = parse_wikitext(matched[2],
										options, queue);
								if (!matched[3])
									matched.pop();
								matched.shift();
								if (!matched[0])
									matched.shift();
								_set_wiki_type(matched, 'plain');
							} else {
								parameters.caption
								// assert: 前后都没有空白。
								= matched = parse_wikitext(token[1], options,
										queue);
							}
							parameters.push(matched);
							if (!token[2]) {
								break;
							}
							pipe_separator.push(token[2]);
							continue;
						}

						// 除了 alt, caption 外，这些 option tokens 不应包含功能性代码。

						matched[2]
						//
						= parse_wikitext(matched[2], options, queue);

						// has equal sign "="
						var has_equal = typeof matched[4] === 'string';
						if (has_equal) {
							// e.g., |alt=text|
							matched[4] = parse_wikitext(matched[4], options,
									queue);
							// [ head space, option name, "="+space, value,
							// tail space ]
							file_option = matched.slice(1);
						} else {
							// e.g., |right|
							// [ head space, option name or value, tail space ]
							file_option = [ matched[1],
							//
							matched[2], matched[5] ];
						}
						file_option = _set_wiki_type(file_option, 'plain');

						// 'right' of |right|, 'alt' of |alt=foo|
						var option_name = file_option[1],
						//
						option_value = has_equal && file_option[3];

						// reduce
						while (!file_option[0]) {
							file_option.shift();
						}
						while (!file_option.at(-1)) {
							file_option.pop();
						}
						if (file_option.length === 1) {
							file_option = file_option[0];
						}

						// console.log('-'.repeat(80)+64545646);
						// console.log(has_equal);
						// console.log(file_option);
						parameters.push(file_option);

						// 各参数设定。
						if (!has_equal && (option_name in file_options)) {
							if (!parameters[file_options[option_name]]
							// 'location' 等先到先得。
							|| file_options[option_name] !== 'location'
							// Type, display format
							&& file_options[option_name] !== 'format') {
								parameters[file_options[option_name]]
								//
								= option_name;
							}

						} else if (!has_equal
						//
						&& /^(?:(?:\d+)?x)?\d+ *px$/.test(option_name)) {
							// 以后到的为准。
							parameters.size = option_name;

						} else if (has_equal
								// 这些选项必须有 "="。无 "=" 的话，会被当作 caption。
								&&
								// page: DjVuファイルの场合、 page="ページ番号"で开始ページを指定できます。
								/^(?:link|alt|lang|page|thumbtime|start|end|class)$/
										.test(option_name)) {
							// 以后到的为准。
							if (option_name === 'link') {
								// pass .session
								option_value = wiki_API.normalize_title(
										option_value, options);
							}
							parameters[option_name] = option_value;
							parameters.index_of[option_name] = parameters.length - 1;

						} else if (has_equal
								&& /^(?:thumb|thumbnail|upright)$/
										.test(option_name)) {
							// 以后到的为准。
							// upright=1 →
							// parameters.size='upright'
							// parameters.upright='1'
							parameters[file_options
							//
							[option_name]] = option_name;
							parameters[option_name] = option_value;

						} else if (has_equal) {
							// 即使是空白也会被认作是 caption。
							// 相当于 .trim()
							if (typeof option_name === 'string'
									&& typeof option_value === 'string') {
								parameters.caption = option_name + '='
										+ option_value;
							} else {
								parameters.caption = [ option_name, '=',
										option_value ];
								parameters.caption
								//
								.toString = file_option.toString;
							}

						} else {
							// 相当于 .trim()
							parameters.caption = option_name;
						}

						if (!token[2]) {
							break;
						}
						pipe_separator.push(token[2]);
					}

				} else {
					var parsed_display_text = parse_wikitext(display_text,
							options, queue);
					// 需再进一步处理 {{}}, -{}- 之类。
					// [[w:en:Wikipedia:Categorization#Sort keys]]
					parameters[category_matched ? 'sort_key'
					// [[w:en:Wikipedia:Piped link]] the displayed text
					: 'display_text'] = parsed_display_text
					if (false && !category_matched) {
						parameters.plain_display_text = wiki_API
								.wikitext_to_plain_text(display_text, options);
					}
					parameters.push(parsed_display_text);
				}
			}

			if (false
			// 前面已经直接 return。
			&& page_name.oddly === 'link_inside_link') {
				// e.g., `[[File:a[[b]].jpg|thumb|t]]`
				// console.trace(parameters);
				// parameters.is_link = false;

				for (var index = 2; index < parameters.length; index++) {
					// recover missed '|' before display_text
					var this_pipe_separator = Array.isArray(pipe_separator) ? pipe_separator[index - 2]
							: pipe_separator;
					if (typeof parameters[index] === 'string') {
						parameters[index] = this_pipe_separator
								+ parameters[index];
					} else if (parameters[index].type === 'plain') {
						parameters[index].unshift(this_pipe_separator);
					} else {
						parameters[index] = [ this_pipe_separator,
								parameters[index] ];
					}
				}

				parameters = parameters.flat();
				parameters.unshift('[[');
				parameters.push(']]');
				join_string_of_array(parameters);
				_set_wiki_type(parameters, 'plain');

			} else {
				if (file_matched || category_matched) {
					// shown by link, is a linking to a file
					// e.g., token[0][0].trim() === "File"; token[0]: namespace
					parameters.is_link = page_name[0].toString().trim() === '';

					if (file_matched) {
						parameters.name
						// set file name without "File:"
						= wiki_API.normalize_title(file_matched[2]);
					} else if (category_matched) {
						parameters.name
						// set category name without "Category:"
						= wiki_API.normalize_title(category_matched[1]);
					}
				} else {
					parameters.is_link = true;
				}

				if (false) {
					// NG: Array.isArray(pipe_separator) for file
					pipe_separator = parse_wikitext(pipe_separator, options,
							queue);
				}
				parameters.pipe = pipe_separator;

				anchor = anchor.toString()
				// remove prefix: '#'
				.slice(1).trimEnd();
				var original_hash = anchor;
				if (PATTERN_is_dot_encoded.test(anchor)) {
					// Change to [[percent-encoding]].
					anchor = anchor.replace(/\.([\dA-F]{2})/g, '%$1');
				}
				// console.log([ original_hash, anchor ]);
				try {
					// if
					// (/^([\w\s\-.~!*'();:@&=+$,/?#\[\]]|%[\dA-F]{2})+$/.test(anchor))
					anchor = decodeURIComponent(anchor);
					if (/[\x00-\x1F\x7F]/.test(anchor)) {
						// e.g. [[w:ja:エヴァンゲリオン (架空の兵器)#Mark.09]]
						anchor = original_hash;
					}
				} catch (e) {
					// e.g., error after convert /\.([\dA-F]{2})/g
					anchor = original_hash;
				}
				// console.log(anchor);
				// wikilink_token.anchor without "#" 网页锚点 section_title
				parameters.anchor = wiki_API.parse.anchor.normalize_anchor(
						anchor, true)
				// 只去除结尾的空白，保留前面的一个。
				.replace(/^\s+/, ' ').trimEnd();
				// TODO: [[Special:]]
				// TODO: [[Media:]]: 连结到图片但不显示图片
				if (page_name.oddly === 'link_inside_file') {
					// @see wiki_token_toString.link
					if (parameters.length > 2)
						parameters.splice(2, 0, parameters.pipe || '|');
					parameters.unshift('[[');
					parameters.push(']]');
					_set_wiki_type(parameters, 'plain');
					parameters.oddly = page_name.oddly;
				} else {
					_set_wiki_type(parameters, file_matched ? 'file'
							: category_matched ? 'category' : 'link');
				}
				if (category_matched)
					parameters.set_sort_key = set_sort_key_of_category;
			}
			// console.trace(parameters);

			// [ page_name, anchor / section_title,
			// display_text without pipe_separator '|' ]
			// anchor && anchor.startsWith('#')
			queue.push(parameters);
			return previous + include_mark + (queue.length - 1) + end_mark;
		}

		function parse_external_link(all, URL, delimiter, parameters) {
			// assert: all === URL + (delimiter || '') + (parameters || '')
			// including "'''". e.g., [http://a.b/''t'']
			var matched = URL.match(/^(.+?)(''.*)$/);
			if (matched) {
				URL = matched[1];
				if (delimiter) {
					parameters = matched[2] + delimiter + parameters;
				} else {
					// assert: parameters === undefined
					parameters = matched[2];
				}
				delimiter = '';
			}
			URL = [ URL.includes(include_mark)
			// 预防有特殊 elements 置入其中。此时将之当作普通 element 看待。
			? parse_wikitext(URL, options, queue)
			// 以 token[0].toString() 取得 URL。
			: _set_wiki_type(URL, 'url') ];
			if (delimiter || parameters) {
				// assert: /^\s*$/.test(delimiter)
				// && typeof delimiter === 'string'
				// && typeof parameters === 'string'
				// assert: parameters 已去除最前面的 delimiter (space)。
				if (normalize) {
					parameters = parameters.trimEnd();
					if (delimiter)
						delimiter = ' ';
				}
				// 纪录 delimiter as {String}token[1]，
				// 否则 .toString() 时 .join() 后会与原先不同。
				URL.push(delimiter,
				// 经过改变，需再进一步处理。
				parse_wikitext(parameters, options, queue));
			}
			_set_wiki_type(URL, 'external_link');
			queue.push(URL);
			return include_mark + (queue.length - 1) + end_mark;
		}

		// (|...): allow "{{{}}}", e.g., [[w:zh:Template:Policy]]
		var PATTERN_for_template_parameter = /{{{(|[^{}][\s\S]*?)}}}/g;
		function parse_template_parameter(all, parameters) {
			// 自 end_mark 向前回溯。
			var index = parameters.lastIndexOf('{{{'), previous;
			if (index > 0) {
				previous = '{{{' + parameters.slice(0, index);
				parameters = parameters.slice(index + '{{{'.length);
			} else {
				previous = '';
			}

			index = parameters.lastIndexOf('{{');
			if (index > 0 && !parameters.slice(index).includes('}}')) {
				// e.g., `{{{T}}{{t|{{u}}}}`
				return all;
			}

			library_namespace.debug(previous + ' + ' + parameters, 4,
					'parse_wikitext.parameter');

			parameters = parameters.split('|');
			parameters = parameters.map(function(token, index) {
				return index === 0
				// 预防有特殊 elements 置入其中。此时将之当作普通 element 看待。
				&& !token.includes(include_mark)
				// parameter name passed
				// https://www.mediawiki.org/wiki/Help:Templates
				? normalize ? token.trim() : token
				// 经过改变，需再进一步处理。
				: parse_wikitext(token, options, queue);
			});
			_set_wiki_type(parameters, 'parameter');
			queue.push(parameters);
			return previous + include_mark + (queue.length - 1) + end_mark;
		}

		// console.trace(session.configurations);
		var magic_words_hash = session
				&& session.configurations.magic_words_hash
				|| default_magic_words_hash;

		var extensiontag_hash = session
				&& session.configurations.extensiontag_hash
				|| wiki_extensiontags;
		var PATTERN_extensiontags = session
				&& session.configurations.PATTERN_extensiontags
				|| PATTERN_wiki_extensiontags;
		var PATTERN_non_extensiontags = session
				&& session.configurations.PATTERN_non_extensiontags
				|| PATTERN_non_wiki_extensiontags;

		// or use ((PATTERN_transclusion))
		// allow {{|=...}}, e.g., [[w:zh:Template:Policy]]
		// PATTERN_template
		var PATTERN_for_transclusion = /{{([^{}][\s\S]*?)}}/g;
		function parse_transclusion(all, parameters, offset, original_string) {
			// 自 end_mark 向前回溯。
			var index = parameters.lastIndexOf('{{'),
			// 因为可能有 "length=1.1" 之类的设定，因此不能采用 Array。
			// token.parameters[{String}key] = {String}value
			_parameters = Object.create(null),
			// token.index_of[{String}key] = {Integer}index
			parameter_index_of = Object.create(null);
			var previous = '';
			if (!(offset >= 0)) {
				offset = original_string.indexOf(all,
						PATTERN_for_transclusion.lastIndex);
			}
			// assert: offset >= 0
			var _previous = offset > 0 ? original_string.slice(offset - 1,
					offset) : '';
			if (index > 0) {
				previous = _previous = '{{' + parameters.slice(0, index);
				parameters = parameters.slice(index + '{{'.length);
			}

			var _following = offset + all.length;
			_following = original_string.slice(_following, _following + 1);
			if (_following === '}' && _previous.endsWith('{')) {
				return all;
				previous = previous.slice(0, -'{'.length);
				// Should be previous + '{{{...}}}'
				return previous
						+ all.slice(previous.length).replace(
								PATTERN_for_template_parameter,
								parse_template_parameter);
			}

			library_namespace.debug('[' + previous + '] + [' + parameters
					+ '] + [' + _following + ']', 4,
					'parse_wikitext.transclusion');

			// e.g., for `{{#if:|''[[{{T}}|D]]''|}}`
			parameters = parse_wikitext(parameters, Object.assign({
				// inside_transclusion: 尚未切分 "|"
				inside_transclusion : true,
				no_resolve : true
			}, options), queue);

			parameters = parameters.split('|');

			// matched: [ all, function name token, function name, argument 1 ]
			var matched = parameters[0]
			/**
			 * <code>

			{{<!-- -->#<!-- -->in<!-- -->{{#if:1|voke}}<!-- -->:IP<!-- -->Address|is<!-- -->{{#if:1|Ip}}|8.8.8.8}}

			</code>
			 */
			.match(/^([\s\n]*([^:]+):)([\s\S]*)$/i);
			var invoke_properties;

			// if is parse function
			// [[mw:Help:Extension:ParserFunctions]]
			// [[mw:Extension:StringFunctions]]
			// [[mw:Help:Magic words#Parser_functions]]
			// [[w:en:Help:Conditional expressions]]
			if (matched) {
				// console.log(matched);

				// parse function name
				matched.pfn = wiki_token_to_key(
				//
				parse_wikitext(matched[2], options, queue));
				if (/^ *#/.test(matched.pfn)) {
					if (typeof matched.pfn === 'string')
						matched.pfn = matched.pfn.trim();

					// allow {{#in<!-- -->voke:...}}
					invoke_properties = /^ *#invoke *$/.test(matched.pfn)
							&& Object.create(null);
					// will set later
					parameters[0] = '';
					// ParserFunctions 可能会有特殊 elements 置入其中。
					// e.g., {{ #expr: {{CURRENTHOUR}}+8}}
					parameters.splice(1, 0, matched[3]);
				} else {
					matched = null;
				}
			}
			// assert: !!matched === token is parse function

			// parameter serial starts from 1.
			var parameter_serial = 1;
			parameters = parameters.map(function(token, _index) {
				// trimEnd() of value, will push spaces in token[3].
				var tail_spaces = token.match(/[\s\n]*$/)[0];
				if (tail_spaces) {
					token = token.slice(0, -tail_spaces.length);
				}
				// 预防经过改变，需再进一步处理。
				token = parse_wikitext(token, options, queue);

				if (_index === 0) {
					// console.log(token);
					if (tail_spaces) {
						if (typeof token === 'string') {
							token += tail_spaces;
						} else {
							// assert: Array.isArray(token)
							if (token.type !== 'plain') {
								token = _set_wiki_type([ token ], 'plain');
							}
							token.push(tail_spaces);
						}
					}

					if (false && typeof token === 'string') {
						return _set_wiki_type(token.split(normalize ? /\s*:\s*/
								: ':'), 'page_title');
					}
					// 有特殊 elements 置入其中。
					// e.g., {{ {{t|n}} | a }}
					return token;
				}

				// 规格书 parse parameters to:
				// numeral parameter: ['', '', value]
				// [name, '=', value]: [1, '=', value], ['', '=', value],
				// [[' name'], ' = ', [value], ' '].key = name

				// {Number}parameter_index =
				// template_token.index_of[parameter_name];
				//
				// parameter_token = template_token[parameter_index];
				// {String}parameter_name = parameter_token.key;
				// if (typeof parameter_name !== 'string') throw new
				// Error('Invalid parameter_token');
				//
				// trimmed parameter_value = parameter_token[2].toString();

				// https://test.wikipedia.org/wiki/L

				if (token.type !== 'plain') {
					// e.g., "{{#time:n月j日|2020-09-15|{{PAGELANGUAGE}}}}"
					token = _set_wiki_type([ token ], 'plain');
				}

				// assert: Array.isArray(token) && token.type === 'plain'

				var matched = undefined;
				// scan for `key=value`
				token.some(function(t, index) {
					if (typeof t !== 'string') {
						return;
						// return t && t.type !== 'comment';
					}
					// allow {{|=...}}, e.g., [[w:zh:Template:Policy]]
					if (t.includes('=')) {
						// index of "=", index_of_assignment
						matched = index;
						return true;
					}
				});

				if (matched === undefined) {
					if (token.length === 1) {
						// assert: {String}token[0]
						// console.trace(token);
						token.unshift('', '');
					} else {
						// assert: token.length > 1
						token = _set_wiki_type([ '', '', token ], 'plain');
					}
					// assert: token === [ '', '', value ]
					if (tail_spaces) {
						token.push(tail_spaces);
					}

					var value = token[2];
					if (Array.isArray(value) && value.some(function(t) {
						// e.g., {{t|p<nowiki></nowiki>=v}}
						return typeof t === 'string' && t.includes('=');
					})) {
						// has_invalid_key_element
						token.invalid = true;
						// token.key = undefined;
						if (library_namespace.is_debug(3)) {
							library_namespace.error(
							//
							'parse_wikitext.transclusion: Invalid parameter ['
							//
							+ token + ']');
						}
					} else {
						if (typeof value === 'string')
							value = value.trim();
						// 位移2个。
						// frame.args[index] @ Lua module codes
						// === token.parameters[index]
						if (invoke_properties && _index === 1) {
							invoke_properties.module_name
							// token[1]: module name 模组名称
							= wiki_token_to_key(value, options);
						} else if (invoke_properties && _index === 2) {
							invoke_properties.function_name
							// token[2]: lua function name 函式名称
							= wiki_token_to_key(value, options);
						} else {
							// 警告: 不该寻找下一个可用的 parameter serial。
							// 无名parameters有自己一套计数，不因具名parameters而跳过。
							// Only the last value provided will be used.
							if (false) {
								while (parameter_index_of[parameter_serial]) {
									// 寻找下一个可用的 parameter_serial。
									parameter_serial++;
								}
							}
							token.key = parameter_serial;
							// token.value = value;
							parameter_index_of[parameter_serial] = _index;
							_parameters[parameter_serial++] = value;
						}
					}
					return token;
				}

				// extract parameter name
				// https://www.mediawiki.org/wiki/Help:Templates#Named_parameters
				// assert: parameter name should these characters
				// https://test.wikipedia.org/wiki/Test_n
				// OK in parameter name: ":\\\/#\"'\n"
				// NG in parameter name: "=" /\s$/

				// 要是有合规的 `parameter_name`，
				// 则应该是 [ {String} parameter_name + " = ", ... ]。
				// prevent {{| ...{{...|...=...}}... = ... }}

				matched = token.splice(0, matched + 1);
				token = _set_wiki_type([ matched,
				//
				matched.pop(), token ], 'plain');

				// matched: [ key, value ]
				// matched = token[1].match(/^([^=]*)=([\s\S]*)$/);

				// trimEnd() of key, trimStart() of value
				matched = token[1].match(/\s*=\s*/);

				// assert: matched >= 0
				if (matched.index > 0) {
					// 将 "=" 前的非空白字元补到 key 去。
					token[0].push(token[1].slice(0, matched.index));
				}
				// key token must accept '\n'. e.g., "key_ \n _key = value"
				// assert: token[0].type === 'plain'
				token.key = token[0].filter(function(t) {
					if (typeof t === 'string')
						return true;
					// 去除注解 comments。
					// e.g., '{{L|p<!-- -->=v}}'
					if (t.type !== 'comment') {
						matched.has_non_string = true;
						return true;
					}
				});
				matched.k = token.key.join('');
				if (!matched.has_non_string
				// 合并 parameter name。
				&& token.key.length === token[0].length) {
					// token[0]: all {String}
					token[0] = matched.k;
				} else {
					_set_wiki_type(token[0], 'plain');
				}
				token.key = matched.k.trim();
				matched.i = matched.index + matched[0].length;
				if (matched.i < token[1].length) {
					// 将 "=" 后的非空白字元补到 value 去。
					token[2].unshift(token[1].slice(matched.i));
				}
				token[1] = matched[0];

				parameter_index_of[token.key] = _index;

				var value = token[2];
				// assert: Array.isArray(value) && value.type === 'plain'
				if (value.length < 2) {
					token[2] = value = value.length === 0 ? '' : value[0];
					if (!value && (matched = tail_spaces.match(/^[^\n]+/))) {
						// tail spaces: 删掉 \n 前的所有 spaces。
						// [p, ' =', '', ' \n '] → [p, ' = ', '', '\n ']
						token[1] += matched[0];
						tail_spaces = tail_spaces.slice(matched[0].length);
					}
					// 处理某些特殊属性的值。
					if (false && /url$/i.test(key)) {
						try {
							// 有些参数值会回避"="，此时使用decodeURIComponent可能会更好。
							value = decodeURI(value);
						} catch (e) {
							// TODO: handle exception
						}
					}
				}
				// assert: token.length === 2
				if (tail_spaces) {
					token.push(tail_spaces);
				}

				// 若参数名重复: @see [[Category:调用重复模板参数的页面]]
				// 如果一个模板中的一个参数使用了多于一个值，则只有最后一个值会在显示对应模板时显示。
				// parser 调用超过一个Template中参数的值，只会使用最后指定的值。

				// parameter_index_of[token.key] = _index;
				_parameters[token.key] = token.value = value;
				return token;
			});

			// add properties

			// console.trace(matched);
			if (matched) {
				// 预防经过改变，需再进一步处理。
				parameters[0] = parse_wikitext(matched[1], options, queue);
				parameters.name = matched.pfn;
				// 若指定 .valueOf = function()，
				// 会造成 '' + token 执行 .valueOf()。
				parameters.evaluate = wiki_API.evaluate_parser_function_token;
				if (invoke_properties)
					Object.assign(parameters, invoke_properties);

			} else {
				// console.log(JSON.stringify(parameters[0]));

				// e.g., token.name ===
				// 'Wikipedia:削除依頼/ログ/{{#time:Y年Fj日|-7 days +9 hours}}'

				// ----------------------------------------

				// console.trace(parameters[0]);
				if (typeof parameters[0] === 'string') {
					parameters.name = parameters[0];
				} else {
					// assert: Array.isArray(parameters[0]) &&
					// (parameters[0].type === 'page_title'
					// || parameters[0].type = 'plain')
					parameters.name = parameters[0].filter(function(t) {
						return t.type !== 'comment';
					}).join('');
				}
				// console.trace(parameters.name);
				// 后面不允许空白。 must / *DEFAULTSORT:/
				parameters.name = parameters.name.trimStart();
				// whitespace between the opening braces and the "subst:"
				// [^...]: incase `{{ {{UCFIRST:T}} | tl }}`
				// @see PATTERN_invalid_page_name_characters
				var PATTERN_MAGIC_WORD = /^([^{}\[\]\|<>\t\n#�:]+):([\s\S]*)$/;
				var namespace = parameters.name.match(PATTERN_MAGIC_WORD);
				// console.trace([ parameters.name, namespace ]);
				if (!namespace)
					namespace = [ , parameters.name ];
				// incase "{{ DEFAULTSORT : }}"
				namespace[1] = namespace[1].trim()
				// 'Defaultsort' → 'DEFAULTSORT'
				.toUpperCase();

				if ((namespace[1] in magic_words_hash)
				// 例如 {{Fullurl}} 应被视作 template。
				// test if token is [[Help:Magic words]]
				&& (magic_words_hash[namespace[1]] === false
				// 这些需要指定数值。 has ":"
				|| namespace[0])) {
					// console.log(parameters);

					parameters.name = namespace[1];
					// 此时以 parameters[0].slice(1) 可获得首 parameter。
					parameters.is_magic_word = true;

					// assert: !!matched === false

					// e.g., `{{safesubst:#if:|{{{1}}}|user}}`
					if (typeof parameters[0] === 'string') {
						matched = parameters[0].match(PATTERN_MAGIC_WORD);
						if (matched) {
							parameters[0] = matched[2];
							// 保持 parameters[0] 为 magic word。
							parameters.unshift(matched[1] + ':');
						}
					} else if (Array.isArray(parameters[0])
					// e.g., `{{safesubst:#if:{{{2|}}}}}`
					// e.g., `{{safesubst:#if:{{{2|}}}|{{{2}}}|{{{1}}}}}`
					&& typeof parameters[0][0] === 'string') {
						matched = parameters[0][0].match(PATTERN_MAGIC_WORD);
						if (matched) {
							parameters[0][0] = matched[2];
							// 保持 parameters[0] 为 magic word。
							parameters.unshift(matched[1] + ':');
						}
					}

					if (!matched) {
						// e.g., {{FULLPAGENAME}}
						// https://en.wikipedia.org/wiki/Help:Magic_words#Variables
						if (parameters.length > 1) {
							// e.g., `{{ = | a=1}}`
							parameters.splice(1, 0, '');
						}
						matched = true;
					}

					// assert: !!matched === true

				} else {
					if ((Array.isArray(parameters[0]) ? parameters[0]
							: [ parameters[0] ]).some(function(token, index,
							list) {
						if (typeof token === 'string') {
							// {{t<!-- -->{|p}}
							return PATTERN_invalid_page_name_characters
									.test(index === list.length - 1 ? token
									// e.g., '{{t\n |p}}'
									.replace(/\s+$/, '') : token);
						}
						return !(token.type in {
							// incase:
							// {{Wikipedia:削除依頼/ログ/{{今日}}}}
							transclusion : true,
							// incase:
							// {{Wikipedia:削除依頼/ログ/{{#time:Y年Fj日
							// |-7 days +9 hours}}}}
							magic_word_function : true,
							// {{tl{{{1|}}}|p}}
							parameter : true,

							// allow {{tl<!-- t= -->}}
							comment : true
						});
					})) {
						// console.log(parameters);

						// e.g., `{{ {{tl|t}} | p }}` is invalid:
						// → `{{ {{t}} | p }}`
						return all;
					}

					// ------------------------------------

					namespace = parameters.name.match(/^:(\s*:)?/);
					if (namespace && namespace[1]) {
						// e.g., {{::T}}
						return all;
					}
					// 正规化 template name。
					// 'ab/cd' → 'Ab/cd'
					parameters.name = wiki_API.normalize_title(parameters.name,
							options);
					// console.log(parameters.name);

					// parameters.name: template without "Template:" prefix.
					// parameters.page_title (.page_name): page title with
					// "Template:" prefix.

					if (!namespace) {
						namespace = wiki_API.namespace(parameters.name,
						// {{:T}}嵌入[[T]]
						Object.assign({
							is_page_title : true
						}, options));
					}
					// wiki_API.namespace.hash using lower case
					if (namespace === wiki_API.namespace.hash.template) {
						// e.g., {{Template:name|...}}
						parameters.page_title = parameters.name;
						parameters.name = wiki_API.remove_namespace(
								parameters.name, options);
					} else if (namespace === wiki_API.namespace.hash.main) {
						parameters.page_title
						// {{T}}嵌入[[Template:T]]
						// {{Template:T}}嵌入[[Template:T]]
						= wiki_API.to_namespace(parameters.name, 'Template',
								options);
					} else {
						// {{Wikipedia:T}}嵌入[[Wikipedia:T]]
						parameters.page_title = parameters.name;
					}

					if (true) {
						;
					} else if (typeof parameters[0] === 'string') {
						var index = parameters[0]
								.indexOf(parameters.page_title);
						if (index !== NOT_FOUND) {
							parameters.page_title = _set_wiki_type(
									parameters.page_title
											.split(normalize ? /\s*:\s*/ : ':'),
									'page_title');
							parameters[0] = [
									parameters[0].slice(0, index),
									parameters.page_title,
									parameters[0].slice(0, index
											+ parameters.page_title.length) ];
						} else if (false) {
							parameters[0] = _set_wiki_type(token
									.split(normalize ? /\s*:\s*/ : ':'),
									'page_title');
						}
					} else {
						parameters.page_title = _set_wiki_type(
								parameters.page_title
										.split(normalize ? /\s*:\s*/ : ':'),
								'page_title');
					}
				}
			}
			// 参数有分大小写与繁简体。
			parameters.parameters = _parameters;
			parameters.index_of = parameter_index_of;

			_set_wiki_type(parameters, matched ? 'magic_word_function'
					: 'transclusion');
			queue.push(parameters);
			return previous + include_mark + (queue.length - 1) + end_mark;
		}

		// parser 标签中的空属性现根据HTML5规格进行解析。
		// <pages from= to= section=1>
		// 将解析为 <pages from="to=" section="1">
		// 而不是像以前那样的 <pages from="" to="" section="1">。
		// 请改用 <pages from="" to="" section=1> or <pages section=1>。

		// [ all attributes, name, value, unquoted value, text without "=" ]
		var PATTERN_tag_attribute = /\s*(\w+)(?:=|{{\s*=\s*(?:\|[\s\S]*?)?}})("[^"]*"|'[^']*'|([^\s"'{}\|]*))|\s*([^\s"'{}\|]*)/g;

		function extract_tag_attributes(attributes) {
			// assert: typeof attributes === 'string'
			var attribute_hash = Object.create(null);

			/**
			 * TODO: parse for templates <code>

			对于 [[w:en:Template:Infobox aircraft begin]]
			{|{{Infobox aircraft begin
			 |parameters go here
			}}
			|}

			可能把整个模板内容全部当作 attributes。

			</code>
			 */
			if (attributes.replace(
			// TODO: allow all magic words
			/{{\s*(?:=|ANCHORENCODE:[^{}\|]*)\s*(?:\|[\s\S]*?)?}}/ig, '')
					.includes('{{')) {
				library_namespace.debug('Skip tag attributes with template: '
						+ attributes, 3);
				return attribute_hash;
			}

			/**
			 * <code>

			`value = parse_wikitext(value, options);` 会错误的写入 options.target_array
			e.g.,
			wikitext = `<span id="修改[[WP:命名常规#地名|命名常规#地名]]一节"></span>`; parsed = CeL.wiki.parser(wikitext).parse();

			</code>
			 */
			var _options = options.target_array
			// 重新造一个 options 以避免污染。
			? Object.assign(Object.clone(options), {
				target_array : null
			}) : options;

			var attributes_list = [], matched;
			while ((matched = PATTERN_tag_attribute.exec(attributes))
					&& matched[0]) {
				// console.trace(matched);
				attributes_list.push(parse_wikitext(matched[0], _options));
				var name = matched[1];
				if (!name) {
					// console.assert(!!matched[4]);
					if (matched[4]) {
						name = parse_wikitext(matched[4], _options);
						// assert: name.toString() === matched[4]
						attribute_hash[/* name.toString() */matched[4]] = name;
					}
					continue;
				}

				// parse attributes
				// name = parse_wikitext(name, _options);
				var value = matched[3]
				// 去掉 "", ''
				|| matched[2].slice(1, -1);
				if (wiki_API.HTML_to_wikitext)
					value = wiki_API.HTML_to_wikitext(value);
				value = parse_wikitext(value, _options);
				attribute_hash[name] = value;
			}
			if (false) {
				console
						.assert(PATTERN_tag_attribute.lastIndex === attributes.length);
			}
			// reset PATTERN index
			PATTERN_tag_attribute.lastIndex = 0;

			return attribute_hash;
		}

		// parse attributes of HTML tags
		// Warning: `{|\n|-\n!id="h style=color:red|h\n|}`
		// will get id==="h_style=color:red", NOT id==="h"!
		function parse_tag_attributes(attributes) {
			// assert: typeof attributes === 'string'
			attributes = _set_wiki_type(
			// e.g., '{{tl|<b a{{=}}"A">i</b>}}'
			shallow_resolve_escaped(attributes || '', options, queue),
					'tag_attributes');
			// 注意: attribute_token.attributes 中的 template 都不包含
			// template_token.expand() !
			// 可利用 for_each_token() 设定 template_token.expand()。
			attributes.attributes = extract_tag_attributes(attributes
					.toString());
			return attributes;
		}

		// ------------------------------------------------

		// <pre> 中的 -{...}-, <nowiki></nowiki> 可作用。
		// 拣选有作用的节点。
		function pick_functional_tokens_for_pre(token) {
			if (!Array.isArray(token))
				return;
			if (token.type === 'convert' || token.type === 'tag'
					&& token.tag === 'nowiki') {
				token.has_functional_sub_token = true;
			}
			var _options;
			for (var index = 0; index < token.length; index++) {
				var sub_token = token[index];
				if (sub_token.type === 'tag_inner'
				// e.g., `<nowiki>-{zh-cn:这;zh-tw:这}-</nowiki>` inside <pre>
				// re-parse for finding functional tokens
				&& token.has_functional_sub_token) {
					sub_token.forEach(function(_sub_token, index) {
						_options = _options
						// 重新造一个 options 以避免污染。
						|| Object.assign(Object.clone(options), {
							target_array : null
						});
						sub_token[index] = parse_wikitext(
						// re-parse {String} sub tokens
						_sub_token.toString(), _options);
					});
				}
				pick_functional_tokens_for_pre(sub_token);
				if (sub_token.has_functional_sub_token) {
					token.has_functional_sub_token = true;
				} else if (sub_token.type && !(sub_token.type in {
					tag_attributes : true,
					tag_inner : true
				})) {
					token[index] = sub_token.toString();
				}
			}
		}

		function parse_HTML_tag(all, tag, attributes, inner, ending, end_tag,
				offset, original_string) {
			// console.log('queue start:');
			// console.log(queue);
			// console.trace(arguments);

			if (!ending && /=.*\n/.test(inner)
			// "\n== <code>code<code> =="会被当作title。
			// [[w:zh:Special:Diff/46814116]]
			&& /\n=.*/.test(original_string.slice(0, offset))) {
				return all;
			}

			var matched = tag.toLowerCase() in extensiontag_hash;
			// '<code>...' is OK.
			if (!ending && matched) {
				// e.g., '<syntaxhighlight>...'
				return all;
			}

			// HTML tags that must be closed.
			// <pre>...</pre>, <code>int f()</code>
			// 像是 <b>|p=</b> 会被分割成不同 parameters，
			// 但 <nowiki>|p=</nowiki>, <math>|p=</math> 不会被分割！
			if (!matched && options.inside_transclusion && inner.includes('|')) {
				return all;
			}

			var previous = '', following = '';
			if ((tag.toLowerCase() in {
				tr : true,
				th : true,
				td : true
			})
			// 这几个 tags 比较特殊:
			&& (matched = inner.match(
			// `<th>a<td>b` 会被直接截断，视为 `<th>a</th><td>b</td>`
			new RegExp('<(' + (/^t[hd]$/i.test(tag) ? 'th|td' : tag)
			// 而非 `<th>a<td>b</td></th>`。
			+ ')([\\s/][^<>]*)?>', 'i')))) {
				following = inner.slice(matched.index) + ending + following;
				inner = inner.slice(0, matched.index);
				ending = end_tag = '';
			}

			matched = (tag.toLowerCase() !== 'nowiki'
			// 假如 start tag 是 <nowiki />，则需要自 inner 搜寻是否有 <nowiki>。
			|| attributes && attributes.endsWith('/'))
			// 自 end_mark (tag 结尾) 向前回溯，检查是否有同名的 tag。
			&& Array.from(inner.matchAll(new RegExp(
			// 但这种回溯搜寻不包含 <nowiki>
			// @see console.log(parser[418]);
			// https://zh.moegirl.org.cn/index.php?title=Talk:%E6%8F%90%E9%97%AE%E6%B1%82%E5%8A%A9%E5%8C%BA&oldid=3704938
			// <nowiki>{{subst:unwiki|<nowiki>{{黑幕|黑幕内容}}</nowiki&gt;}}</nowiki>
			'<(' + tag
			// @see function get_PATTERN_full_tag()
			+ ')([\\s/][^<>]*)?>', 'ig')));
			if (!matched) {
			} else if (matched.length === 0) {
				// e.g., '<nowiki/></nowiki>'
				matched = null;
			} else if (tag.toLowerCase() !== 'nowiki') {
				// 非 <nowiki>: get last ccurrence. cf. .lastIndexOf()
				matched = matched.at(-1);
			} else if (!matched.some(function(tag_matched) {
				// ↑ 搜寻第一个非 <nowiki .../> 者
				if (!tag_matched[0].endsWith('/>')) {
					matched = tag_matched;
					return true;
				}
			})) {
				matched = null;
			}

			if (matched) {
				matched = matched.index - inner.length - ending.length;
				previous += all.slice(0, matched);
				matched = all.slice(matched).match(PATTERN_HTML_tag);
				// 大小写可能不同。
				tag = matched[1];
				attributes = matched[2];
				inner = matched[3];
			}

			if (!ending && initialized_fix && initialized_fix[1]
			// 这一段是本函数加上去的。
			&& inner.endsWith(initialized_fix[1])) {
				following = initialized_fix[1] + following;
				inner = inner.slice(0, -initialized_fix[1].length);
			}

			// assert: 此时不在表格 td/th 或 template parameter 中。

			if (library_namespace.is_debug(3)) {
				library_namespace.info('parse_wikitext.tag: <' + tag
						+ '> passed:\n' + previous);
				library_namespace.debug(attributes, 0);
				library_namespace.log(inner);
			}

			// 2016/9/28 9:7:7
			// 因为 wiki_extensiontags 内部可能已解析成其他的单元，
			// 因此还是必须 parse_wikitext()。
			// e.g., '<nowiki>-{}-</nowiki>'
			// 经过改变，需再进一步处理。
			library_namespace.debug('<' + tag + '> 内部需再进一步处理。', 4,
					'parse_wikitext.tag');
			attributes = parse_tag_attributes(attributes);
			inner = parse_wikitext(inner, options, queue);

			// 处理特殊 tags。
			// <source>-{...}-</source>内之-{}-与<nowiki>-{...}-</nowiki>一样无效。
			if ((tag.toLowerCase() in {
				pre : true,
				// Should be `tag.toLowerCase() in extensiontag_hash`
				// without includeonly|noinclude|onlyinclude
				syntaxhighlight : true,
				source : true,
				nowiki : true
			}) && Array.isArray(inner)) {
				library_namespace.debug('-'.repeat(70)
						+ '\n<pre> 中仅留 -{}-, <nowiki> 有效用。', 3,
						'parse_wikitext.transclusion');
				// console.log(inner);
				if (inner.type && inner.type !== 'plain') {
					// 当 inner 本身就是特殊 token 时，先把它包装起来。
					inner = _set_wiki_type([ inner ], 'plain');
				}
				if (tag.toLowerCase() === 'pre') {
					pick_functional_tokens_for_pre(inner);

				} else {
					inner.forEach(function(sub_token, index) {
						// 处理每个子 token。 经测试，<nowiki>中 -{}- 也无效。
						if (!sub_token.type || sub_token.type in {
							tag_attributes : true,
							tag_inner : true
						}) {
							return;
						}
						inner[index] = sub_token.toString();
					});
				}
				if (inner.length <= 1) {
					inner = inner[0];
				}
				// console.log(inner);
			}

			// [ ... ]: 在 inner 为 Template 之类时，
			// 不应直接在上面设定 type=tag_inner，以免破坏应有之格式！
			// 但仍需要设定 type=tag_inner 以应 for_each_token() 之需，因此多层[]包覆。
			inner = _set_wiki_type(Array.isArray(inner)
			// 仅有一个 plain 的话就直接采用其内容，减少多层嵌套。
			&& inner.type === 'plain' ? inner : [ inner || '' ], 'tag_inner');
			all = [ attributes, inner ];

			if (normalize) {
				tag = tag.toLowerCase();
			} else if (tag !== end_tag) {
				all.ending = ending;
			}
			all.tag = tag;
			// {String}Element.tagName
			// all.tagName = tag.toLowerCase();

			all = _set_wiki_type(all, 'tag');
			// 在遍历 tag inner 的子 node 时，真正需要的 .parent 是 all tag 而非 inner。
			// e.g., `special page configuration.js`
			// if (parent.type === 'tag_inner' && parent.parent.type === 'tag'
			// && (parent.parent.tag === 's' || parent.parent.tag === 'del'))
			// { ... }
			inner.parent = all;
			// attributes.parent = all;
			if (attributes && attributes.attributes) {
				all.attributes = attributes.attributes;
				// delete attributes.attributes;
			}
			queue.push(all);
			// console.log('queue end:');
			// console.log(queue);
			return previous + include_mark + (queue.length - 1) + end_mark
					+ following;
		}

		function parse_single_tag(all, slash, tag, attributes) {
			if ((tag.toLowerCase() in extensiontag_hash)
					&& !(attributes && attributes.endsWith('/'))) {
				// e.g., '<nowiki><s>S'
				return all;
			}

			if (attributes) {
				if (normalize) {
					attributes = attributes.replace(/[\s\/]*$/, ' /');
				}
				attributes = parse_tag_attributes(attributes);
				if (false && attributes.type === 'plain') {
					// assert: 经过 parse_tag_attributes(), 应该不会到这边。
					all = attributes;
				} else
					all = [ attributes ];
			} else {
				// use '' as attributes in case
				// the .join() in .toString() doesn't work.
				all = [ '' ];
			}

			if (normalize) {
				tag = tag.toLowerCase();
			}
			if (slash) {
				// prefix slash: This is invalid.
				all.slash = slash;
			}
			all.tag = tag;
			// {String}Element.tagName
			// all.tagName = tag.toLowerCase();

			_set_wiki_type(all, 'tag_single');
			if (attributes && attributes.attributes) {
				all.attributes = attributes.attributes;
				delete attributes.attributes;
			}
			queue.push(all);
			return include_mark + (queue.length - 1) + end_mark;
		}

		// ------------------------------------------------

		function parse_table(all, parameters, ending) {

			var index = all.lastIndexOf('\n{|');
			var previous;
			if (index > 0) {
				previous = all.slice(0, index);
				parameters = all.slice(index + '\n-{'.length,
						ending ? -ending.length : all.length);
			} else {
				previous = '';
			}

			function append_table_cell(table_cell, delimiter, table_row_token) {
				if (!table_cell && !delimiter) {
					// e.g., '' after 'style=""' in `{|\n|-style=""\n|t\n|}`
					return;
				}

				if (false && typeof delimiter !== 'string') {
					// e.g., 'ss' and 'ee' in
					// `{|class="wikitable"\n|-\nss||f\n|-\nee\n|}`
					table_row_token.push(shallow_resolve_escaped(table_cell));
					return;
				}

				var PATTERN_table_cell_content = /^([^|]*)\|([\s\S]*)$/;
				// cell attributes /
				// cell style / format modifier (not displayed)
				var table_cell_attributes = table_cell
						.match(PATTERN_table_cell_content);
				var data_type, value;
				if (table_cell_attributes) {
					// parse cell attributes
					table_cell = table_cell_attributes[2];
					table_cell_attributes = _set_wiki_type(
							parse_tag_attributes(table_cell_attributes[1]),
							'table_attributes');
					// '|': from PATTERN_table_cell_content
					table_cell_attributes.suffix = '|';
					data_type = table_cell_attributes.attributes
					// @see
					// [[w:en:Help:Sorting#Specifying_a_sort_key_for_a_cell]]
					&& table_cell_attributes.attributes['data-sort-type'];
				}

				// e.g., "{|\n|<s>S||'''B</s>\n|}"
				var table_cell_token = parse_wikitext(table_cell, options,
						queue);
				table_cell_token = _set_wiki_type(table_cell_token,
						'table_cell');
				if (table_row_token.type === 'caption') {
					table_cell_token.caption = table_cell_token.toString()
							.trim();
					// 表格标题以首次出现的为主。
					if (!table_row_token.caption) {
						table_row_token.caption = table_cell_token.caption;
					}
				}
				if (table_cell_attributes) {
					table_cell_token.unshift(table_cell_attributes);
				}
				if (delimiter)
					table_cell_token.delimiter = delimiter;

				data_type = data_type && data_type.trim();
				if (data_type === 'number') {
					if (library_namespace.is_digits(table_cell)) {
						value = +table_cell;
					}
				} else if (data_type === 'isoDate') {
					value = Date.parse(table_cell);
				}
				if (value || value === 0)
					table_cell_token.value = value;

				if (table_cell_token.is_header = table_row_token.cell_is_header_now) {
					// TODO: data-sort-type in table header
					// @see
					// [[w:en:Help:Sorting#Configuring the sorting]]

					table_row_token.header_count++;
				} else {
					table_row_token.data_count++;
				}
				if (false) {
					// is cell <th> or <td> ?
					table_cell_token.table_cell_type = table_cell_token.is_header ? 'th'
							: 'td';
				}

				table_row_token.push(table_cell_token);
			}

			// 分隔 <td>, <th>
			// 必须有实体才能如预期作 .exec()。
			// matched: [ all, inner, delimiter ]
			var PATTERN_table_cell;
			// invalid:
			// | cell !! cell
			// valid:
			// ! header !! header
			// ! header || header
			// | cell || cell
			var PATTERN_table_cell_th = /([\s\S]*?)(\n[|!]|[|!]{2}|$)/g;
			// default pattern for normal row.
			var PATTERN_table_cell_td = /([\s\S]*?)(\n[|!]|\|\||$)/g;
			function append_table_row(table_row, delimiter, table_token) {
				if (!table_row && !delimiter) {
					// e.g., '' after 'style=""' in `{|\nstyle=""\n|-\n|}`
					return;
				}

				if (typeof JSON === 'object') {
					library_namespace.debug('parse table_row / row style: '
					//
					+ JSON.stringify(table_row), 5, 'parse_wikitext.table');
				}

				// 注意: caption 不被当作 table_row 看待。
				var type = delimiter === '\n|+' ?
				// 'table_caption'
				'caption' : 'table_row';
				var table_row_token = _set_wiki_type([], type);
				table_row_token.delimiter = delimiter;
				// Warning:
				// only using table_row_token.header_count may lost some td
				// <th> counter
				table_row_token.header_count = 0;
				// <td> counter
				table_row_token.data_count = 0;

				PATTERN_table_cell = PATTERN_table_cell_td;
				table_row_token.cell_is_header_now = false;

				var last_delimiter;
				// caption allow `{|\n|+style|caption 1||caption 2\n|}`
				var matched = type !== 'caption' && table_row.match(/^.+/);
				if (matched) {
					// "\n|-" 后面紧接著，换行前的 string 为
					// table row style / format modifier (not displayed)
					table_row_token.push(_set_wiki_type(
							parse_tag_attributes(matched[0]),
							'table_attributes'));
					PATTERN_table_cell.lastIndex = matched[0].length;
				} else {
					// reset PATTERN index
					PATTERN_table_cell.lastIndex = 0;
				}

				while (matched = PATTERN_table_cell.exec(table_row)) {
					// console.log(matched);
					append_table_cell(matched[1], last_delimiter,
							table_row_token);
					if (!matched[2]) {
						// assert: /$/, no separator, ended.
						if (false) {
							console
									.assert(PATTERN_table_cell.lastIndex === table_row.length);
						}
						// reset PATTERN index
						// PATTERN_table_cell.lastIndex = 0;
						break;
					}
					// matched[2] 属于下一 cell。
					last_delimiter = matched[2];
					if (/^\n/.test(last_delimiter)
					//
					&& table_row_token.cell_is_header_now !==
					// !!matched: convert to header
					(matched = last_delimiter === '\n!')) {
						// switch pattern
						var lastIndex = PATTERN_table_cell.lastIndex;
						table_row_token.cell_is_header_now = matched;
						PATTERN_table_cell = matched ? PATTERN_table_cell_th
								: PATTERN_table_cell_td;
						PATTERN_table_cell.lastIndex = lastIndex;
					}
				}

				// 处理表格标题。
				if (table_row_token.caption
				// 表格标题以首次出现的为主。
				&& !table_token.caption) {
					table_token.caption = table_row_token.caption;
				}
				delete table_row_token.cell_is_header_now;
				table_token.push(table_row_token);
			}

			var table_token = _set_wiki_type([], 'table');
			if (ending !== '\n|}') {
				// ending 可能是 '\n'
				table_token.ending = '';
			} else {
				ending = '';
			}
			// 添加新行由一个竖线和连字符 "|-" 组成。
			var PATTERN_table_row = /([\s\S]*?)(\n\|[\-+]|$)/g;
			// default: table_row. try `{|\n||1||2\n|-\n|3\n|}`
			var last_delimiter;
			var matched = parameters.match(/^.+/);
			if (matched) {
				// the style of whole <table>
				table_token.push(_set_wiki_type(
						parse_tag_attributes(matched[0]), 'table_attributes'));
				PATTERN_table_row.lastIndex = matched[0].length;
			}
			while (matched = PATTERN_table_row.exec(parameters)) {
				// console.log(matched);
				append_table_row(matched[1], last_delimiter, table_token);
				if (!matched[2]) {
					// assert: /$/, no separator, ended.
					if (false) {
						console
								.assert(PATTERN_table_row.lastIndex === parameters.length);
					}
					// reset PATTERN index
					// PATTERN_table_row.lastIndex = 0;
					break;
				}
				// matched[2] 属于下一 row。
				last_delimiter = matched[2];
			}

			if (false) {
				console.assert(table_token.every(function(table_row_token) {
					return table_row_token.type === 'table_attributes'
							|| table_row_token.type === 'caption'
							|| table_row_token.type === 'table_row';
				}));
			}

			queue.push(table_token);
			// 因为 "\n" 在 wikitext parser 中为重要标记，可能是 initialized_fix 加入的，
			// 因此 wiki_token_toString.table() 不包括开头的 "\n"，并须 restore 之。
			return previous + '\n' + include_mark + (queue.length - 1)
					+ end_mark + ending;
		}

		function parse_behavior_switch(all, switch_word) {
			var parameters = _set_wiki_type(switch_word, 'switch');
			if (!queue.switches) {
				queue.switches = Object.create(null);
			}
			if (!queue.switches[switch_word]) {
				queue.switches[switch_word] = [ parameters ];
			} else {
				// 照理来说通常不应该要有多个 switches...
				queue.switches[switch_word].push(parameters);
			}
			queue.push(parameters);
			return include_mark + (queue.length - 1) + end_mark;
		}

		function parse_apostrophe_type(all, apostrophes, parameters, ending) {
			// console.log([ all, apostrophes, parameters, ending ]);
			var index = parameters.lastIndexOf(apostrophes), previous = '';
			if (index !== NOT_FOUND) {
				previous = apostrophes + parameters.slice(0, index);
				parameters = parameters.slice(index + apostrophes.length);
			}
			// 预防有特殊 elements 置入其中。此时将之当作普通 element 看待。
			parameters = parse_wikitext(parameters, options, queue);
			// console.log(parameters);
			// 注意: parameters.length 可能大于1
			var type = parameters && parameters.type;
			if (apostrophes !== ending
			// 这样下面 `_set_wiki_type(parameters, type)` 时会出错。
			&& (type === 'bold' || type === 'italic')) {
				// e.g., "'''''''t'''''''"
				return all;
			}
			if (apostrophes === "'''''") {
				// e.g., "''''''t''''''"
				parameters = _set_wiki_type(parameters, 'bold');
				if (apostrophes !== ending)
					parameters.no_end = true;
				parameters = [ parameters ];
				type = 'italic';
			} else {
				type = apostrophes === "''" ? 'italic' : 'bold';
			}
			parameters = _set_wiki_type(parameters, type);
			var following;
			if (apostrophes === ending) {
				following = '';
			} else {
				following = ending;
				// assert: ending === '' || ending === '\n'
				parameters.no_end = true;
			}
			queue.push(parameters);
			return previous + include_mark + (queue.length - 1) + end_mark
					+ following;
		}

		function parse_section(all, previous, section_level, parameters,
				postfix) {
			function not_only_comments(token) {
				return typeof token === 'string' ? !/^[ \t]+$/.test(token)
				// assert: is_parsed_element(tail)
				: token.type !== 'comment';
			}
			if (postfix && postfix.includes(include_mark)) {
				if (false) {
					console.assert(postfix.includes(include_mark)
							&& postfix.includes(end_mark))
					console.log(JSON.stringify(postfix));
				}
				var tail = parse_wikitext(postfix, options, queue);
				// console.log(tail);
				if (is_parsed_element(tail) && (tail.type === 'plain'
				//
				? tail.some(not_only_comments) : not_only_comments(tail))) {
					// console.log(all);
					return all;
				}
				// tail = "<!-- ... -->", "\s+" or ["<!-- ... -->", "\s+", ...]
				postfix = tail;
			}

			// console.log('==> ' + JSON.stringify(all));
			if (normalize) {
				parameters = parameters.trim();
			}

			parameters = wiki_API.section_link.pre_parse_section_title(
					parameters, options, queue);
			parameters = _set_wiki_type(parameters, 'section_title');

			// Use plain section_title instead of title with wikitext.
			// 因为尚未resolve_escaped()，直接使用未parse_wikitext()者会包含未解码之code!
			// parameters.title = parameters.toString().trim();

			// console.trace(options);
			// wiki_API.section_link() 会更动 parse_wikitext() 之结果，
			// 因此不直接传入 parsed，而是 .toString() 另外再传一次。
			parameters.link = wiki_API.section_link(parameters.toString(),
			// options: pass session. for options.language
			Object.assign(Object.clone(options), {
				// 重新造一个 options 以避免污染。
				target_array : null
			}));
			/** {String}section title in wikitext */
			parameters.title = parameters.link.id;

			if (postfix && !normalize)
				parameters.postfix = postfix;
			var level = section_level.length;
			// assert: level >= 1
			parameters.level = level;

			parameters.child_section_titles = [];
			// 去尾。
			section_title_hierarchy.truncate(level);
			section_title_hierarchy[level] = parameters;
			// console.log(section_title_hierarchy);
			while (level > 0) {
				// 注意：可能 level 2 跳到 4，不一定连续！
				// level 1 的 child_section_titles 可能包含 level 3!
				var parent_section_title = section_title_hierarchy[--level];
				if (parent_section_title) {
					// Create linkages
					if (level > 0) {
						if (false) {
							library_namespace.log(parent_section_title + ' → '
									+ parameters);
						}
						parameters.parent_section_title = parent_section_title;
					} else {
						// assert: is root section list, parent_section_title
						// === parsed.child_section_titles
						// === section_title_hierarchy[0]
					}
					parent_section_title.child_section_titles.push(parameters);
					break;
				}
			}

			queue.push(parameters);
			// 因为 "\n" 在 wikitext 中为重要标记，因此 restore 之。
			return previous + include_mark + (queue.length - 1) + end_mark;
		}

		// @see {{Ordered list}}
		function parse_list_line(line) {
			function push_list_item(item, list_prefix, no_parse) {
				if (!no_parse) {
					// 经过改变，需再进一步处理。
					item = parse_wikitext(item, options, queue);
				}
				// console.trace(item);
				item = _set_wiki_type(item, 'list_item');
				// 将 .list_prefix 结合在 list_item 之上。
				// (list_item_token.list_prefix)。
				item.list_prefix = list_prefix;
				if (latest_list) {
					// Will be used by function remove_token_from_parent()
					item.parent = latest_list;
					// concole.assert(item.parent[item.index] === item);
					item.index = latest_list.length;
					item.list_index = latest_list.length ? latest_list.at(-1).list_index + 1
							: 0;
					if (latest_list.list_type === '#') {
						item.serial = item.list_index
						// (isNaN(item.start_serial) ? 1 : item.start_serial)
						+ 1;
					}
					latest_list.push(item);
				}
				return item;
			}

			var index = 0, position = 0;
			while (index < list_prefixes_now.length
			// 确认本行与上一行有多少相同的列表层级。
			&& list_prefixes_now[index] ===
			//
			(list_conversion[line.charAt(position)] || line.charAt(position))) {
				// position += list_prefixes_now[index++].length;
				index++;
				position++;
			}

			// console.log(list_now);
			list_prefixes_now.truncate(position);
			list_now.truncate(position);

			var list_prefix,
			// is <dt>
			is_dt,
			// latest_list === list_now[list_now.length - 1]
			latest_list = list_now[position - 1],
			// 寻找从本行开始的新列表。
			matched = line.slice(position).match(/^([*#;:]+)(\s*)(.*)$/);
			if (!matched) {
				if (position > 0) {
					// console.log([ position, line ]);
					// '\n': from `wikitext.split('\n')`
					list_prefix = '\n' + line.slice(0, position);
					is_dt = list_prefix.endsWith(';');
					line = line.slice(position);
					matched = line.match(/^\s+/);
					if (matched) {
						// 将空白字元放在 .list_prefix 可以减少很多麻烦。
						list_prefix += matched[0];
						line = line.slice(matched[0].length);
					}

					if (is_dt) {
						// line is not push_list_item() still,
						// when the `line` push_list_item(), its index will be
						// latest_list.length.
						latest_list.dt_index.push(latest_list.length);

						// search "; title : definition"
						if (matched = line.match(/^(.*)(:\s*)(.*)$/)) {
							push_list_item(matched[1], list_prefix);
							list_prefix = matched[2];
							line = matched[3];
						}
					}

					push_list_item(line, list_prefix);
				} else {
					// 非列表。
					// assert: position === -1
					lines_without_style.push(line.slice(position));
				}
				return;
			}

			if (position > 0) {
				// '\n': from `wikitext.split('\n')`
				list_prefix = '\n' + line.slice(0, position);
				if (list_prefix.endsWith(';')) {
					// line is not push_list_item() still,
					// when the `line` push_list_item(), its index will be
					// latest_list.length.
					latest_list.dt_index.push(latest_list.length);
				}
			} else {
				list_prefix = '';
			}

			var list_symbols = matched[1].split('');
			line = matched[3];
			list_symbols.forEach(function handle_list_item(list_type) {
				// 处理直接上多层选单的情况。
				// e.g., ";#a\n:#b"
				var list = _set_wiki_type([], 'list');
				// 注意: 在以 API 取得页面列表时，也会设定 pages.list_type。
				list.list_type = list_conversion[list_type] || list_type;
				if (list.list_type === DEFINITION_LIST) {
					// list[list.dt_index[NO]] 为 ";"。
					list.dt_index = [];
				}

				if (latest_list) {
					var list_item = push_list_item([ list ],
					//
					list_prefix, true);
					if (false) {
						// is setup @ push_list_item()
						// list_item.parent = latest_list;
						// concole.assert(list_item.parent[list_item.index] ===
						// list_item);
						// list_item.index = latest_list.length - 1;
					}
					// 要算在上一个。
					list_item.list_index--;
					list_item.serial > 1 && list_item.serial--;
					list_item.no_need_to_count = true;
					list_prefix = list_type;
				} else {
					list_prefix += list_type;
					queue.push(list);
					lines_without_style.push(
					//
					include_mark + (queue.length - 1) + end_mark);
				}

				latest_list = list;
				list_now.push(list);
				list_prefixes_now.push(list.list_type);
			});

			// console.trace(latest_list);
			is_dt = list_prefix.endsWith(';');

			// matched[2]: 将空白字元放在 .list_prefix 可以减少很多麻烦。
			list_prefix += matched[2];

			// is <dt>, should use: ';' ===
			// latest_list.list_prefix.at(-1)
			// assert: latest_list.length === latest_list.list_prefix.length - 1
			if (is_dt) {
				// assert: latest_list.length === 0
				// latest_list.dt_index.push(latest_list.length);
				latest_list.dt_index.push(0);

				// search "; title : definition"
				if (matched = line.match(/^(.*)(:\s*)(.*)$/)) {
					push_list_item(matched[1], list_prefix);
					list_prefix = matched[2];
					line = matched[3];
				}
			}

			push_list_item(line, list_prefix);
		}

		function parse_hr_tag(line, index) {
			var matched = line.match(/^(-{4,})(.*)$/);
			if (!matched
			// 例如在模板、link 中，一开始就符合的情况。
			|| index === 0 && !initialized_fix) {
				lines_without_style.push(line);
				return;
			}

			var hr = _set_wiki_type(matched[1], 'hr');

			queue.push(hr);
			lines_without_style.push(include_mark + (queue.length - 1)
					+ end_mark + matched[2]);
		}

		function parse_preformatted(line, index) {
			if (!line.startsWith(' ')
			// 例如在模板、link 中，一开始就符合的情况。
			|| index === 0 && !initialized_fix) {
				if (list_now) {
					// reset
					list_now = null;
				}
				lines_without_style.push(line);
				return;
			}

			// 经过改变，需再进一步处理。
			// 1: ' '.length
			line = parse_wikitext(line.slice(1), options, queue);

			if (list_now) {
				list_now.push(line);
				return;
			}

			list_now = _set_wiki_type([ line ], 'pre');

			queue.push(list_now);
			lines_without_style.push(include_mark + (queue.length - 1)
					+ end_mark);
		}

		// ------------------------------------------------------------------------
		// parse sequence start / start parse

		// parse 范围基本上由小到大。
		// e.g., transclusion 不能包括 table，因此在 table 前。

		// 得先处理完有开阖的标示法，之后才是单一标示。
		// e.g., "<pre>\n==t==\nw\n</pre>" 不应解析出 section_title。

		// 可顺便作正规化/维护清理/修正明显破坏/修正维基语法/维基化，
		// 例如修复章节标题 (section title, 节タイトル) 前后 level 不一，
		// table "|-" 未起新行等。

		// ----------------------------------------------------
		// 因为<nowiki>可以打断其他的语法，包括"<!--"，因此必须要首先处理。

		wikitext = wikitext.replace_till_stable(PATTERN_extensiontags,
				parse_HTML_tag);

		// ----------------------------------------------------
		// comments: <!-- ... -->

		// <nowiki> 之优先度高于 "<!-- -->"。
		// 置于 <nowiki> 中，如 "<nowiki><!-- --></nowiki>" 则虽无功用，但会当作一般文字显示，而非注解。

		// "<\": for Eclipse JSDoc.
		if (initialized_fix) {
			wikitext = wikitext.replace(/<\!--([\s\S]*?)-->/g,
			// 因为前后标记间所有内容无作用、能置于任何地方（除了 <nowiki> 中，"<no<!-- -->wiki>"
			// 之类），又无需向前回溯；只需在第一次检测，不会有遗珠之憾。
			function(all, parameters) {
				// 预防有特殊 elements 置入其中。此时将之当作普通 element 看待。
				// e.g., "<!-- <nowiki>...</nowiki> ... -->"
				parameters = parse_wikitext(parameters, options, queue);
				// 不再作 parse。
				parameters = parameters.toString();
				queue.push(_set_wiki_type(parameters, 'comment'));
				return include_mark + (queue.length - 1) + end_mark;
			})
			// 缺 end mark: "...<!--..."
			.replace(/<\!--([\s\S]*)$/, function(all, parameters) {
				if (initialized_fix[1]) {
					parameters = parameters.slice(0,
					//
					-initialized_fix[1].length);
					initialized_fix[1] = '';
				}
				// 预防有特殊 elements 置入其中。此时将之当作普通 element 看待。
				// e.g., "<!-- <nowiki>...</nowiki> ... -->"
				parameters = parse_wikitext(parameters, options, queue);
				// 不再作 parse。
				parameters = parameters.toString();
				parameters = _set_wiki_type(parameters, 'comment');
				if (!normalize)
					parameters.no_end = true;
				queue.push(parameters);
				return include_mark + (queue.length - 1) + end_mark;
			});
		}

		// ----------------------------------------------------

		// 为了 "{{Tl|a<ref>[http://a.a.a b|c {{!}} {{CURRENTHOUR}}]</ref>}}"，
		// 将 -{}-, [], [[]] 等，所有中间可穿插 "|" 的置于 {{{}}}, {{}} 前。

		// ----------------------------------------------------
		// language conversion -{}- 以后来使用的为主。
		// TODO: -{R|里}-
		// TODO: -{zh-hans:<nowiki>...</nowiki>;zh-hant:<nowiki>...</nowiki>;}-
		// TODO: 特别注意语法中带有=>的单向转换规则 [[w:zh:模组:CGroup/IT]]
		// 注意: 有些 wiki，例如 jawiki，并没有开启 language conversion。
		// https://zh.wikipedia.org/wiki/Help:中文维基百科的繁简、地区词处理#常用的转换工具语法
		// [[w:zh:H:Convert]], [[w:zh:H:AC]]
		// [[mw:Help:Magic words]], [[mw:Writing systems/LanguageConverter]]
		// https://doc.wikimedia.org/mediawiki-core/master/php/LanguageConverter_8php_source.html
		// https://doc.wikimedia.org/mediawiki-core/master/php/ConverterRule_8php_source.html

		// https://phabricator.wikimedia.org/source/mediawiki/browse/master/includes/languages/data/ZhConversion.php
		// https://github.com/wikimedia/mediawiki/blob/master/includes/languages/data/ZhConversion.php
		// https://doc.wikimedia.org/mediawiki-core/master/php/ZhConversion_8php_source.html

		// {{Cite web}}汉字不被转换: 可以使用script-title=ja:。
		// TODO: 使用魔术字 __NOTC__ 或 __NOTITLECONVERT__ 可避免标题转换。
		// TODO:
		// 自动转换程序会自动规避「程式码」类的标签，包括<pre>...</pre>、<code>...</code>两种。如果要将前两种用于条目内的程式范例，可以使用空转换标签-{}-强制启用转换。

		wikitext = wikitext.replace_till_stable(PATTERN_language_conversion,
				parse_language_conversion);

		// ----------------------------------------------------
		// wikilink
		// [[~:~|~]], [[~:~:~|~]]

		// 须注意: [[p|\nt]] 可，但 [[p\n|t]] 不可！

		// 注意: [[p|{{tl|t}}]] 不会被解析成 wikilink，因此 wikilink 应该要摆在 transclusion
		// 前面检查，或是使 display_text 不包含 {{}}。

		// 但注意: "[[File:title.jpg|thumb|a{{tl|t}}|param\n=123|{{tl|t}}]]"
		// 可以解析成图片, Caption: "{{tl|t}}"

		wikitext = wikitext.replace_till_stable(
		// or use ((PATTERN_link))
		PATTERN_wikilink_global, parse_wikilink);

		// ----------------------------------------------------
		// external link
		// [http://... ...]
		// TODO: [{{URL template}} ...]
		wikitext = wikitext.replace_till_stable(PATTERN_external_link_global,
				parse_external_link);

		// ----------------------------------------------------
		// [[w:zh:Help:模板]]
		// 在模板页面中，用三个大括弧可以读取参数。

		// 有些需要反复解析。
		// e.g., '{{{t|{{u}}}}}', '{{{q|{{w|{{{t|{{u}}}}}}}}}}'
		while (true) {
			var original_wikitext = wikitext;

			// {{{...}}} 需在 {{...}} 之前解析。
			// MediaWiki 会把{{{{{{XYZ}}}}}}解析为{{{ {{{XYZ}}} }}}而不是{{ {{ {{XYZ}}
			// }} }}
			wikitext = wikitext.replace_till_stable(
					PATTERN_for_template_parameter, parse_template_parameter);

			// ----------------------------------------------------
			// 模板（英语：Template，又译作「样板」、「范本」）
			// {{Template name|}}
			wikitext = wikitext.replace_till_stable(
			//
			PATTERN_for_transclusion, parse_transclusion);

			if (original_wikitext === wikitext)
				break;
		}

		// ----------------------------------------------------
		// table: \n{| ... \n|}
		// TODO: 在遇到过长过大的表格时，耗时甚久。 [[w:en:List of Leigh Centurions players]],
		// [[w:zh:世界大桥列表]]

		// 因为 table 中较可能包含 {{Template}}，但 {{Template}} 少包含 table，
		// 因此先处理 {{Template}} 再处理 table。
		// {|表示表格开始，|}表示表格结束。

		wikitext = wikitext.replace_till_stable(
		// [[Help:Table]]
		/\n{\|([\s\S]*?)(\n?$|\n\|})/g, parse_table);

		// ----------------------------------------------------

		// 在章节标题、表格 td/th 或 template parameter 结束时，
		// e.g., "| t || <del>... || </del> || <s>... || </s> ||",
		// "{{t|p=v<s>...|p2=v}}</s>"
		// HTML font style tag 会被表格截断，自动重设属性，不会延续下去。
		// 所以要先处理表格再处理 HTML tag。

		// 由于 <tag>... 可能被 {{Template}} 截断，因此先处理 {{Template}} 再处理 <t></t>。
		// 先处理 <t></t> 再处理 <t/>，预防单独的 <t> 被先处理了。

		// ----------------------------------------------------
		// [[Help:HTML in wikitext]]

		// <del>不采用 global variable，预防 multitasking 并行处理。</del>
		// reset PATTERN index
		// PATTERN_WIKI_TAG.lastIndex = 0;

		// console.log(PATTERN_TAG);
		// console.trace(PATTERN_non_extensiontags);
		// console.trace(wikitext);

		wikitext = wikitext.replace_till_stable(PATTERN_non_extensiontags,
				parse_HTML_tag);

		// ----------------------------------------------------
		// single tags. e.g., <hr />

		// reset PATTERN index
		// PATTERN_WIKI_TAG_VOID.lastIndex = 0;

		// assert: 有 end tag 的皆已处理完毕，到这边的是已经没有 end tag 的。
		wikitext = wikitext.replace_till_stable(PATTERN_WIKI_TAG_VOID,
				parse_single_tag);
		// 处理有明确标示为 simgle tag 的。
		// 但 MediaWiki 现在会将 <b /> 转成 <b>，因此不再处理这部分。
		wikitext = wikitext.replace_till_stable(PATTERN_invalid_end_tag,
				parse_single_tag);

		// ----------------------------------------------------

		wikitext = wikitext.replace(PATTERN_BEHAVIOR_SWITCH,
				parse_behavior_switch);

		// 若是要处理<b>, <i>这两项，也必须调整 wiki_API.section_link()。

		// ''''b''''' → <i><b>b</b></i>
		// 因此先从<b>开始找。

		// 再解析一次。
		// e.g., for `[[{{T|P}}]]`, `[[{{#if:A|A|B}}]]`
		wikitext = wikitext.replace_till_stable(
		// or use ((PATTERN_link))
		PATTERN_wikilink_global, parse_wikilink);

		// '''~''' 不能跨行！ 注意: '''{{font color}}''', '''{{tsl}}'''
		// ''~'' 不能跨行！
		wikitext = wikitext.replace_till_stable(
				/('''''|'''?)([^'\n].*?'*)(\1)/g, parse_apostrophe_type);
		// \n, $ 都会截断 italic, bold
		// <tag> 不会截断 italic, bold
		wikitext = wikitext.replace_till_stable(
		// '\n': initialized_fix[1]
		/('''''|'''?)([^'\n].*?)(\n|$)/g, parse_apostrophe_type);
		// '', ''' 似乎会经过微调: [[n:zh:Special:Permalink/120676]]

		// ~~~, ~~~~, ~~~~~: 不应该出现

		// ----------------------------------------------------
		// parse_wikitext.section_title

		// postfix 没用 \s，是因为 node 中， /\s/.test('\n')，且全形空白之类的确实不能用在这。

		// @see PATTERN_section
		var PATTERN_section = new RegExp(
		// 采用 positive lookahead (?=\n|$) 是为了循序匹配 section title，不跳过任何一个。
		// 不采用则 parse_wiki 处理时若遇到连续章节，不会按照先后顺序，造成这边还不能设定
		// section_title_hierarchy，只能在 parsed.each_section() 设定。
		/(^|\n)(={1,6})(.+)\2((?:[ \t]|mark)*)(?=\n|$)/g.source.replace('mark',
				library_namespace.to_RegExp_pattern(include_mark) + '\\d+'
						+ library_namespace.to_RegExp_pattern(end_mark)), 'g');
		// console.log(PATTERN_section);
		// console.log(JSON.stringify(wikitext));

		// 应该一次遍历就找出所有的 section title，否则 section_title_hierarchy 会出错。
		wikitext = wikitext.replace(PATTERN_section, parse_section);

		// console.log('10: ' + JSON.stringify(wikitext));

		if (false) {
			// another method to parse.
			wikitext = '{{temp|{{temp2|p{a}r{}}}}}';
			pattern = /{{[\s\n]*([^\s\n#\|{}<>\[\]][^#\|{}<>\[\]]*)/g;
			matched = pattern.exec(wikitext);
			end_index = wikitext.indexOf('}}', pattern.lastIndex);

			PATTERN_wikilink;
		}

		// ----------------------------------------------------
		// 处理 / parse bare / plain URLs in wikitext: https:// @ wikitext
		// @see [[w:en:Help:Link#Http: and https:]]

		// console.log('11: ' + JSON.stringify(wikitext));

		// 在 transclusion 中不会被当作 bare / plain URL。
		if (!options.inside_transclusion) {
			wikitext = wikitext.replace(PATTERN_URL_WITH_PROTOCOL_GLOBAL,
			//
			function(all, previous, URL) {
				all = _set_wiki_type(URL, 'url');
				// 须注意:此裸露 URL 之 type 与 external link 内之type相同！
				// 因此需要测试 token.is_bare 以确定是否在 external link 内。
				all.is_bare = true;
				queue.push(all);
				return previous + include_mark + (queue.length - 1) + end_mark;
			});

			// ----------------------------------------------------
			// 处理 / parse list @ wikitext
			// @see [[w:en:MOS:LIST]], [[w:en:Help:Wikitext#Lists]]
			// 注意: 这里仅处理在原wikitext中明确指示列表的情况，无法处理以模板型式表现的列表。

			// 列表层级。 e.g., ['#','*','#',':']
			var list_prefixes_now = [], list_now = [],
			//
			lines_without_style = [],
			//
			list_conversion = {
				';' : DEFINITION_LIST,
				':' : DEFINITION_LIST
			};

			// console.log('12: ' + JSON.stringify(wikitext));
			// console.log(queue);

			wikitext = wikitext.split('\n');
			// e.g., for "<b>#ccc</b>"
			var first_line = !initialized_fix && wikitext.shift();

			wikitext.forEach(parse_list_line);
			wikitext = lines_without_style;

			// ----------------------------------------------------
			// parse horizontal rule, line, HTML <hr /> element: ----, -{4,}
			// @see [[w:en:Help:Wikitext#Horizontal rule]]
			// Their use in Wikipedia articles is deprecated.
			// They should never appear in regular article prose.

			// reset
			lines_without_style = [];

			wikitext.forEach(parse_hr_tag);
			wikitext = lines_without_style;

			// ----------------------------------------------------
			// parse preformatted text, HTML <pre> element: \n + space
			// @seealso [[w:en:Help:Wikitext#Pre]]

			// reset
			lines_without_style = [];
			// pre_list
			list_now = null;

			wikitext.forEach(parse_preformatted);
			wikitext = lines_without_style;

			// Release memory. 释放被占用的记忆体。
			lines_without_style = null;

			if (!initialized_fix) {
				// recover
				wikitext.unshift(first_line);
			}
			wikitext = wikitext.join('\n');
		}

		// ↑ parse sequence finished *EXCEPT FOR* paragraph
		// ------------------------------------------------------------------------

		// console.log('13: ' + JSON.stringify(wikitext));
		if (typeof options.postfix === 'function')
			wikitext = options.postfix(wikitext, queue, include_mark, end_mark)
					|| wikitext;

		// console.log('14: ' + JSON.stringify(wikitext));
		if (initialized_fix) {
			// 去掉初始化时添加的 fix。
			// 须预防有些为完结的标记，把所添加的部分吃掉了。此时不能直接 .slice()，
			// 而应该先检查是不是有被吃掉的状况。
			if (initialized_fix[0] || initialized_fix[1])
				wikitext = wikitext.slice(initialized_fix[0].length,
				// assert: '123'.slice(1, undefined) === '23'
				// if use length as initialized_fix[1]:
				// assert: '1'.slice(0, [ 1 ][1]) === '1'
				initialized_fix[1] ? -initialized_fix[1].length : undefined);
		}

		// ----------------------------------------------------
		// MUST be last: 处理段落 / parse paragraph @ wikitext

		// console.log('15: ' + JSON.stringify(wikitext));
		// [ all, text, separator ]
		var PATTERN_paragraph = /([\s\S]*?)((?:\s*?\n){2,}|$)/g;
		if (initialized_fix && options.parse_paragraph
				&& /\n\s*?\n/.test(wikitext)) {
			// 警告: 解析段落的动作可能破坏文件的第一层结构，会使文件的第一层结构以段落为主。
			wikitext = wikitext.replace(PATTERN_paragraph,
			// assert: 这个 pattern 应该能够完全分割 wikitext。
			function(all, text, separator) {
				if (!all) {
					return '';
				}
				all = text.split('\n');
				// console.log(all);
				// 经过改变，需再进一步处理。
				all = all.map(function(t) {
					return parse_wikitext(t, options, queue);
				});
				// console.log(all);
				all = _set_wiki_type(all, 'paragraph');
				if (separator)
					all.separator = separator;
				// console.log('queue index: ' + queue.length);
				queue.push(all);
				return include_mark + (queue.length - 1) + end_mark;
			});
		}

		// console.log(wikitext);
		if (no_resolve) {
			return wikitext;
		}

		// console.log('16: ' + JSON.stringify(wikitext));
		queue.push(wikitext);
		if (false) {
			console.log('='.repeat(80));
			console.log(queue);
			console.log(JSON.stringify(wikitext));
			console.log(options);
		}
		resolve_escaped(queue, include_mark, end_mark);

		wikitext = queue.at(-1);
		// console.log(wikitext);
		if (initialized_fix
		// 若是解析模板，那么添加任何的元素，都可能破坏转换成字串后的结果。
		// plain: 表示 wikitext 可能是一个页面。最起码是以 .join('') 转换成字串的。
		&& (wikitext.type === 'plain'
		// options.no_reduce, options.is_page
		|| options.with_properties)) {
			if (Array.isArray(options.target_array) && Array.isArray(wikitext)) {
				// 可借以复制必要的属性。
				// @see function parse_page(options)
				options.target_array.truncate();
				// copy parsed data to .target_array
				Array.prototype.push.apply(options.target_array, wikitext);
				wikitext = options.target_array;
			}

			if (queue.switches)
				wikitext.switches = queue.switches;

			if (!library_namespace.is_empty_object(queue.conversion_table))
				wikitext.conversion_table = queue.conversion_table;
			if (options.conversion_title)
				wikitext.conversion_title = queue.conversion_title;
		}

		// Release memory. 释放被占用的记忆体。
		queue = null;

		if (initialized_fix
		// 若是解析模板，那么添加任何的元素，都可能破坏转换成字串后的结果。
		// plain: 表示 wikitext 可能是一个页面。最起码是以 .join('') 转换成字串的。
		&& wikitext.type === 'plain' && !options.parse_paragraph) {
			// console.log(wikitext);
			// 纯文字分段。仅切割第一层结构。
			for (var index = 0; index < wikitext.length; index++) {
				var token = wikitext[index], matched;
				// console.log('---> [' + index + '] ' + token);
				if (typeof token === 'string') {
					if (!/\n\s*?\n/.test(token)) {
						continue;
					}
					// 删掉原先的文字 token = wikitext[index]。
					wikitext.splice(index, 1);
					// 从这里开始，index 指的是要插入字串的位置。
					while ((matched = PATTERN_paragraph.exec(token))
							&& matched[0]) {
						// console.log('#1 ' + token);
						// console.log(matched);
						// text, separator 分开，在做 diff 的时候会更容易处理。
						if (matched[1] && matched[2]) {
							wikitext.splice(index, 0, matched[1], matched[2]);
							index += 2;
						} else {
							// assert:
							// case 1: matched[2] === '',
							// matched[0] === matched[1]
							// case 2: matched[1] === '',
							// matched[0] === matched[2]
							wikitext.splice(index++, 0, matched[0]);
						}
					}
					// 回复 index 的位置。
					index--;
					// reset PATTERN index
					PATTERN_paragraph.lastIndex = 0;

				} else {
					// assert: typeof wikitext[index] === 'object'
					if (index > 0
							&& typeof (token = wikitext[index - 1]) === 'string'
							&& (matched = token
									.match(/^([\s\S]*[^\s\n])([\s\n]*\n)$/))) {
						// e.g., ["abc \n","{{t}}"] → ["abc"," \n","{{t}}"]
						// console.log('#2 ' + token);
						// console.log(matched);
						// text, space 分开，在做 diff 的时候会更容易处理。
						wikitext.splice(index - 1, 1, matched[1], matched[2]);
						index++;
					}
					token = wikitext[index + 1];
					// console.log('>>> ' + token);
					if (typeof token === 'string'
							&& (matched = token.match(/^(\n+)([^\n][\s\S]*?)$/))) {
						// e.g., ["{{t}}","\nabc"] → ["{{t}}","\n","abc"]
						// console.log('#3 ' + token);
						// console.log(matched);
						// text, space 分开，在做 diff 的时候会更容易处理。
						wikitext.splice(index + 1, 1, matched[1], matched[2]);
					}
				}
			}

			// console.trace(section_title_hierarchy[0]);
			if (!options.target_array)
				Object.assign(wikitext, section_title_hierarchy[0]);
		}

		if (false) {
			library_namespace.debug('set depth ' + (depth_of_children - 1)
					+ ' to node [' + wikitext + ']', 3, 'parse_wikitext');
			wikitext[KEY_DEPTH] = depth_of_children - 1;
		}

		return wikitext;
	}

	// ------------------------------------------------------------------------

	// export 导出.

	// CeL.wiki.parse.*
	Object.assign(parse_wikitext, {
		wiki_token_toString : wiki_token_toString,
		wiki_token_to_key : wiki_token_to_key,

		set_wiki_type : set_wiki_type
	});

	Object.assign(wiki_API, {
		// {Object} file option hash
		file_options : file_options,

		markup_tags : markup_tags,
		wiki_extensiontags : wiki_extensiontags,

		DEFINITION_LIST : DEFINITION_LIST,

		// PATTERN_language_conversion : PATTERN_language_conversion,

		page_title_to_sort_key : page_title_to_sort_key,

		// Please use CeL.wiki.wikitext_to_plain_text() instead!
		HTML_to_wikitext : HTML_to_wikitext,
		// wikitext_to_plain_text : wikitext_to_plain_text,

		parse : parse_wikitext
	});

	// --------------------------------------------------------------------------------------------

	// 不设定(hook)本 module 之 namespace，仅执行 module code。
	return library_namespace.env.not_to_extend_keyword;
}
