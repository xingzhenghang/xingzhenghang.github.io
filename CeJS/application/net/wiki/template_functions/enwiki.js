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

// --------------------------------------------------------------------------------------------

// 不采用 if 陈述式，可以避免 Eclipse JSDoc 与 format 多缩排一层。
typeof CeL === 'function' && CeL.run({
	// module name
	name : 'application.net.wiki.template_functions.enwiki',

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

	function parse_template_Pin_message(token, index, parent, options) {
		var parameters = token.parameters, message_expire_date;
		if (parameters[1]) {
			options = library_namespace.new_options(options);
			options.get_timevalue = true;
			message_expire_date = wiki_API.parse.date(parameters[1], {
				get_timevalue : true,
			});
		}
		token.message_expire_date = message_expire_date || Infinity;
	}

	// --------------------------------------------------------------------------------------------

	// Not completed! Only for get_all_anchors().
	function expand_template_Football_box(options) {
		var parameters = this.parameters;
		// [[Module:Football box]]
		return '<div id="' + (parameters.id || '') + '">'
		// TODO: The content is skipped.
		+ '</div>';
	}

	function parse_template_Football_box(token, index, parent, options) {
		token.expand = expand_template_Football_box;
	}

	// --------------------------------------------------------------------------------------------

	// export 导出.

	wiki_API.template_functions.functions_of_site[module_site_name] = {
		'Pin message' : parse_template_Pin_message,

		// 一些会添加 anchors 的特殊模板。
		'Football box' : parse_template_Football_box
	};

	// --------------------------------------------------------------------------------------------

	// 不设定(hook)本 module 之 namespace，仅执行 module code。
	return library_namespace.env.not_to_extend_keyword;
}
