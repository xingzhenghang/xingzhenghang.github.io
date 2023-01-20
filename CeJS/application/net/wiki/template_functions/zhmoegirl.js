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
	name : 'application.net.wiki.template_functions.zhmoegirl',

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

	// for get_all_anchors()
	function expand_template_A(options) {
		var parameters = this.parameters;
		// {{a|锚点名称|显示文字}}
		return '<span id="' + parameters[1] + '">'
				+ (parameters[2] || parameters[1]) + '</span>';
	}

	function parse_template_A(token, index, parent, options) {
		token.expand = expand_template_A;
	}

	// --------------------------------------------------------------------------------------------

	// [[Module:Ruby]]
	function expand_module_Ruby(parameters) {
		// converted wikitext
		var wikitext = [];
		wikitext.push('<ruby'
				+ (parameters.id ? ' id="' + parameters.id + '"' : '') + '>');
		wikitext.push('<rb'
				+ (parameters.rbid ? ' id="' + parameters.rbid + '"' : '')
				+ '>' + (parameters[1] || '') + '</rb>');
		wikitext.push('（');
		wikitext.push('<rt'
				+ (parameters.rtid ? ' id="' + parameters.rtid + '"' : '')
				+ '>' + (parameters[2] || '') + '</rt>');
		wikitext.push('）');
		wikitext.push('</ruby>');
		return wikitext.join('');
	}

	// for get_all_anchors()
	function expand_template_Ruby(options) {
		var parameters = this.parameters;
		// {{Ruby|文字|注音|文字的语言标签|注音的语言标签}}
		return expand_module_Ruby(parameters);
	}

	function parse_template_Ruby(token, index, parent, options) {
		token.expand = expand_template_Ruby;
	}

	// --------------------------------------------------------------------------------------------

	// for preprocess_section_link_token()
	function expand_template_Dead(options) {
		var parameters = this.parameters;
		return parameters[1];
	}

	function parse_template_Dead(token) {
		token.expand = expand_template_Dead;
	}

	// --------------------------------------------------------------------------------------------

	// for preprocess_section_link_token()
	function expand_template_黑幕(options) {
		var parameters = this.parameters;
		return parameters[1];
	}

	function parse_template_黑幕(token) {
		token.expand = expand_template_黑幕;
	}

	// --------------------------------------------------------------------------------------------

	// for preprocess_section_link_token()
	// {{Lj|...}} 是日语{{lang|ja|...}}的缩写 @ zh.moegirl
	function expand_template_Lj(options) {
		var parameters = this.parameters;
		return '-{' + parameters[1] + '}-';
	}

	function parse_template_Lj(token) {
		token.expand = expand_template_Lj;
	}

	// --------------------------------------------------------------------------------------------

	// Not completed! Only for get_all_anchors() @ [[ACGN作品中出场的铁路车站列表]]
	function expand_template_铁路车站名(options) {
		var parameters = this.parameters;
		return '<span id="' + (parameters.name || parameters[1]) + '">'
		// TODO: The content is skipped.
		+ '</span>';
	}

	function parse_template_铁路车站名(token) {
		token.expand = expand_template_铁路车站名;
	}

	// --------------------------------------------------------------------------------------------

	// Not completed! Only for get_all_anchors() as section title
	// @ [[ARGONAVIS from BanG Dream! 翻唱曲列表]]
	function expand_template_ARGONAVIS_Icon(options) {
		// TODO: The content is skipped.
		return '';
	}

	function parse_template_ARGONAVIS_Icon(token) {
		token.expand = expand_template_ARGONAVIS_Icon;
	}

	// --------------------------------------------------------------------------------------------

	// Not completed! Only for get_all_anchors()
	// @ zh.moegirl [[FLOWERS(Innocent Grey)]]
	function expand_template_Gradient_Text(options) {
		var parameters = this.parameters;
		// {{Gradient_Text|渐变色代码|文字内容|title=鼠标悬停在文字上显示的注释}}
		return parameters[2] || '';
	}

	function parse_template_Gradient_Text(token) {
		token.expand = expand_template_Gradient_Text;
	}

	// --------------------------------------------------------------------------------------------

	// export 导出.

	wiki_API.template_functions.functions_of_site[module_site_name] = {
		// 一些会添加 anchors 的特殊模板。
		A : parse_template_A,
		Ruby : parse_template_Ruby,
		铁路车站名 : parse_template_铁路车站名,

		// 一些会用于章节标题的特殊模板。 for preprocess_section_link_token()
		Dead : parse_template_Dead,
		黑幕 : parse_template_黑幕,
		Lj : parse_template_Lj,
		'ARGONAVIS/Icon' : parse_template_ARGONAVIS_Icon,
		'Gradient Text' : parse_template_Gradient_Text
	};

	// library_namespace.info(module_site_name + ': 采用 zhwiki 的模板特设功能设定。');
	wiki_API.template_functions.functions_of_site[module_site_name][wiki_API.template_functions.KEY_dependent_on] = [ 'zhwiki' ];

	// --------------------------------------------------------------------------------------------

	// 不设定(hook)本 module 之 namespace，仅执行 module code。
	return library_namespace.env.not_to_extend_keyword;
}
