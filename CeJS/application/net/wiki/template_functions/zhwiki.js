/**
 * @name CeL function for MediaWiki (Wikipedia / 维基百科): 常用模板特设功能。本工具档放置的是指定 wiki
 *       计划特有的模板。
 * 
 * 注意: 本程式库必须应各 wiki project 模板内容改动而改写。
 * 
 * @fileoverview 本档案包含了 MediaWiki 自动化作业用程式库的子程式库。
 * 
 * TODO:<code>

</code>
 * 
 * @since 2021/1/24 16:6:50
 */

// More examples: see /_test suite/test.js
// Wikipedia bots demo: https://github.com/kanasimi/wikibot
'use strict';
// 'use asm';

// @examples
(function() {
	require('./wiki loader.js');
	CeL.run('application.net.wiki.template_functions');
	var wiki = Wiki(true, 'zh');
	wiki.page('简繁转换一对多列表').parse(function(parsed) {
		// var page_data = parsed.page;
		parsed.each('Template:简繁转换', function(token) {
			console.log(token.简 + '⇄' + token.繁);
		});
	});
});

// --------------------------------------------------------------------------------------------

// 不采用 if 陈述式，可以避免 Eclipse JSDoc 与 format 多缩排一层。
typeof CeL === 'function' && CeL.run({
	// module name
	name : 'application.net.wiki.template_functions.zhwiki',

	require : 'data.native.'
	// Should also load essential MediaWiki modules
	+ '|application.net.wiki.',

	// 设定不汇出的子函式。
	no_extend : 'this,*',

	// 为了方便格式化程式码，因此将 module 函式主体另外抽出。
	code : module_code
});

function module_code(library_namespace) {

	// requiring
	var wiki_API = library_namespace.application.net.wiki;
	// @inner
	// var is_api_and_title = wiki_API.is_api_and_title,
	// normalize_title_parameter = wiki_API.normalize_title_parameter;

	var to_exit = wiki_API.parser.parser_prototype.each.exit;

	// e.g., 'zhwiki'
	var module_site_name = this.id.match(/[^.]+$/)[0];

	function empty_string(/* options */) {
		// var token = this;
		return '';
	}

	// --------------------------------------------------------------------------------------------
	// token.expand() 可将模板转换成一般 wiki 语法。
	// https://www.mediawiki.org/w/api.php?action=help&modules=expandtemplates
	// 用于 function preprocess_section_link_token()。

	// --------------------------------------------------------------------------------------------

	function expand_template_A(options) {
		var parameters = this.parameters;
		return (parameters.name ? '<span id="' + parameters.name
		//
		+ '"></span>' : '') + '[[' + parameters[1]
		//
		+ (parameters[2] ? '|' + parameters[2] : '') + ']]';
	}

	// --------------------------------------------------------------------------------------------

	// [[w:zh:Template:Al]]
	function expand_template_Al(options) {
		var token = this;
		return token.page_title_list.map(function(title) {
			return wiki_API.title_link_of(title);
		}).join('、');
	}

	function parse_template_Al(token, index, parent, options) {
		var index = 0, page_title_list = [];
		while (index < token.length) {
			var page_title = token.parameters[++index];
			// allow `{{al||title}}`
			if (page_title)
				page_title_list.push(page_title);
		}

		Object.assign(token, {
			page_title_list : page_title_list,
			expand : expand_template_Al
		});
		return page_title_list;
	}

	// --------------------------------------------------------------------------------------------

	function parse_template_不存档(token, index, parent, options) {
		token.message_expire_date = Infinity;
	}

	// --------------------------------------------------------------------------------------------

	function expand_template_楷体(options) {
		var parameters = this.parameters;
		return '<span class="template-kai">' + (parameters[1] || '楷体')
				+ '</span>';
	}

	function parse_template_楷体(token, index, parent, options) {
		token.expand = expand_template_楷体;
	}

	// --------------------------------------------------------------------------------------------

	// {{Lang|ja|参数值}} → -{参数值}-
	function expand_template_Lang(options) {
		var parameters = this.parameters;
		return /^(?:zh|gan)/.test(parameters[1]) ? parameters[2] : '-{'
				+ parameters[2] + '}-';
	}

	function parse_template_Lang(token, index, parent, options) {
		token.expand = expand_template_Lang;
	}

	// --------------------------------------------------------------------------------------------

	// [[w:zh:Template:NoteTA]]
	function parse_template_NoteTA(token, options) {
		var conversion_list = Object.assign([], {
			// 固定转换规则
			// fixed : [],

			// 公共转换组
			group_data : [],
			groups : []
		});

		var index, value = token.parameters.T;
		if (value) {
			// 标题转换
			conversion_list.title = value;
		}

		// TODO: {{NoteTA}} 使用「1=」可以同时转换标题和正文(T=)？
		for (index = 1; index < token.length; index++) {
			value = token.parameters[index];
			if (!value)
				continue;
			// [[w:zh:模组:NoteTA]]
			// @see function item_to_conversion(item) @
			// CeL.application.net.wiki
			value = wiki_API.parse('-{A|' + value + '}-', {
				normalize : true,
				with_properties : true
			});
			if (typeof value === 'string') {
				// 遇到无法转换的值别 throw。 e.g., "a\nb"
				continue;
			}
			// value.parameter_name = index;
			value.index = token.index_of[index];
			// console.log(value);
			conversion_list.push(value);
		}

		// [[w:zh:Module:NoteTA]]
		for (index = 1; index < token.length; index++) {
			var parameter_name = 'G' + index;
			value = token.parameters[parameter_name];
			if (!value)
				continue;
			value = wiki_API.parse.wiki_token_to_key(value);
			// console.trace(value);
			if (typeof value === 'string') {
				value = value.replace(/_/g, ' ').trim();
			} else {
				library_namespace.warn('parse_template_NoteTA: 非字串之公共转换组名称: ['
						+ value + '] @ ' + token);
				console.trace(value);
			}
			conversion_list.groups.push(value.toString());
			conversion_list.group_data[value.toString()] = {
				parameter_name : parameter_name,
				group_name : value,
				index : token.index_of[parameter_name]
			};
			// TODO
		}

		Object.assign(token, {
			conversion_list : conversion_list,
			expand : empty_string
		});
		return conversion_list;
	}

	// --------------------------------------------------------------------------------------------

	function template_简繁转换_to_string(template_token, parameter) {
		var words = template_token.parameters[parameter];
		if (Array.isArray(words)) {
			words = words.map(function(token) {
				if (typeof token === 'string')
					return token;
				if (token.tag === 'sup') {
					// e.g., "<sup>台/陆繁</sup>"
					return '';
				}
				if (token.type === 'transclusion') {
					if (token.name === 'Lang'
					//
					&& typeof token.parameters[2] === 'string')
						return token.parameters[2];
					if (token.name === '僻字') {
						// console.log(token.toString());
					}
					if (token.name === '僻字'
					//
					&& typeof token.parameters[1] === 'string')
						return token.parameters[1];
				}
				throw new Error('包含无法处理的字元: ' + token);
			}).join('');
		}
		words = library_namespace.HTML_to_Unicode(words);
		// [[w:zh:Unicode字符平面映射]]
		// http://ubuntu-rubyonrails.blogspot.com/2009/06/unicode.html

		words = words.replace(
		// 发音用 Pinyin diacritic-vowel combinations:
		// \u00E0-\u00FC [[w:en:Latin-1 Supplement (Unicode block)]]
		// \u0100-\u017F [[w:en:Latin Extended-A]]
		// \u01CD-\u01DC [[w:en:Latin Extended-B]]
		/[（），、a-z\u00E0-\u00FC\u0100-\u017F\u01CD-\u01DC\uD800-\uDFFF]/g, '');
		if (false && /[^\u4E00-\u9FFF\u3400-\u4DBF\uF900-\uFAFF\u2E80-\u2EFF]/
				.test(words)) {
			// words.charCodeAt(0).toString(16)
			console.log([ words, words.replace(
			// 匹配中文字符的正则表达式
			/[\u4E00-\u9FFF\u3400-\u4DBF\uF900-\uFAFF\u2E80-\u2EFF]/g,
			//
			'') ]);
			// throw words;
		}
		return words;
	}

	// for {{简繁转换}} @ [[w:zh:简繁转换一对多列表]]
	// @see wiki_API.convert_Chinese()
	function parse_template_简繁转换(token) {
		Object.assign(token, {
			简 : template_简繁转换_to_string(token, 's'),
			繁 : template_简繁转换_to_string(token, 't')
		});
	}

	// --------------------------------------------------------------------------------------------

	// export 导出.

	wiki_API.template_functions.functions_of_site[module_site_name] = {
		// 一些会用于章节标题的特殊模板。 for preprocess_section_link_token()
		A : {
			properties : {
				expand : expand_template_A
			}
		},
		Al : parse_template_Al,

		// {{Do not archive}}
		// wiki/routine/20210429.Auto-archiver.js: avoid being archived
		不存档 : parse_template_不存档,

		Lang : parse_template_Lang,
		NoteTA : parse_template_NoteTA,
		简繁转换 : parse_template_简繁转换
	};

	// --------------------------------------------------------------------------------------------

	// 不设定(hook)本 module 之 namespace，仅执行 module code。
	return library_namespace.env.not_to_extend_keyword;
}
