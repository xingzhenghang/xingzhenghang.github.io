﻿/**
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

// --------------------------------------------------------------------------------------------

// 不采用 if 陈述式，可以避免 Eclipse JSDoc 与 format 多缩排一层。
typeof CeL === 'function' && CeL.run({
	// module name
	name : 'application.net.wiki.template_functions.jawiki',

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

	function expand_template_Enlink(options) {
		var parameters = this.parameters;
		var lang = parameters[3] || 'en';
		var wikitext;
		if (parameters.a === 'on') {
			wikitext = lang;
		} else {
			wikitext = (parameters[3] ? parameters[3] + ':' : '')
					+ (parameters[2] || parameters[1]);
			if (parameters.i === 'on')
				wikitext = "''" + wikitext + "''";
		}

		wikitext = '[[:' + lang + ':' + parameters[1]
		//
		+ '|' + wikitext + ']]';

		if (!parameters.p || parameters.p === 'on')
			wikitext = '&nbsp;(' + wikitext + '&nbsp;';
		if (!parameters.s || parameters.s === 'on')
			wikitext = '<small>' + wikitext + '</small>';
		return ' (' + parameters[1] + ')';
	}

	function parse_template_Enlink(token) {
		token.expand = expand_template_Enlink;
	}

	// --------------------------------------------------------------------------------------------

	function expand_template_to_display_language(options) {
		// console.trace(this.toString());
		var parameters = this.parameters;
		return parameters[1];
	}

	function parse_template_to_display_language(token) {
		token.expand = expand_template_to_display_language;
	}

	// --------------------------------------------------------------------------------------------

	function expand_template_拡张汉字(options) {
		var parameters = this.parameters;
		return parameters[2] || parameters[1];
	}

	function parse_template_拡张汉字(token) {
		token.expand = expand_template_拡张汉字;
	}

	// --------------------------------------------------------------------------------------------

	// Not completed! Only for get_all_anchors().
	// 転送先のアンカーはTemplate:RFDの中に纳まっている
	// e.g., {{RFD notice
	// |'''対象リダイレクト:'''[[Wikipedia:リダイレクトの削除依頼/受付#RFD长崎市电|长崎市电（受付依頼）]]|...}}
	function expand_template_RFD(options) {
		var parameters = this.parameters;
		// {{RFD|リダイレクト元ページ名|リダイレクト先ページ名}}
		return '<span id="RFD' + parameters[1] + '"></span>'
		// TODO: + ...
		;
	}

	function parse_template_RFD(token) {
		token.expand = expand_template_RFD;
	}

	// --------------------------------------------------------------------------------------------

	// export 导出.

	wiki_API.template_functions.functions_of_site[module_site_name] = {
		// 一些会添加 anchors 的特殊模板。
		Anchors : wiki_API.template_functions.functions_of_all_sites.Anchor,

		Enlink : parse_template_Enlink,

		ARIB外字フォント : parse_template_to_display_language,
		CP932フォント : parse_template_to_display_language,
		JIS90フォント : parse_template_to_display_language,
		JIS2004フォント : parse_template_to_display_language,
		MacJapanese : parse_template_to_display_language,
		変体仮名フォント : parse_template_to_display_language,
		絵文字フォント : parse_template_to_display_language,
		补助汉字フォント : parse_template_to_display_language,
		通货フォント : parse_template_to_display_language,
		拡张汉字 : parse_template_拡张汉字,

		RFD : parse_template_RFD
	};

	// --------------------------------------------------------------------------------------------

	// 不设定(hook)本 module 之 namespace，仅执行 module code。
	return library_namespace.env.not_to_extend_keyword;
}
