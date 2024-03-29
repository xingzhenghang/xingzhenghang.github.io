﻿/**
 * @name CeL function for MediaWiki (Wikipedia / 维基百科):
 *       常用模板特设功能。本工具档放置的是几乎所有wiki计划通用的模板，或者少数wiki计划特有、且大量使用的著名模板。
 * 
 * 注意: 本程式库必须应各 wiki project 模板内容改动而改写。
 * 
 * @fileoverview 本档案包含了 MediaWiki 自动化作业用程式库的子程式库。
 * 
 * <code>

TODO:
[[w:en:Wikipedia:Database reports/Templates transcluded on the most pages]]
[[w:en:Wikipedia:High-risk templates]]

</code>
 * 
 * @see [[Special:MostTranscludedPages]], [[Template:High-use]]
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
	name : 'application.net.wiki.template_functions.general_functions',

	require : 'data.native.'
	// Should also load essential MediaWiki modules
	+ '|application.net.wiki.template_functions.',

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

	function empty_string(/* options */) {
		// var token = this;
		return '';
	}

	function expand_template_get_parameter_1(options) {
		var parameters = this.parameters;
		return parameters[1] ? parameters[1].toString() : '';
	}

	function trim_param(param) {
		return param && param.toString().trim();
	}

	// --------------------------------------------------------------------------------------------
	// token.expand() 可将模板转换成一般 wiki 语法。
	// https://www.mediawiki.org/w/api.php?action=help&modules=expandtemplates
	// 用于 function preprocess_section_link_token()。

	// --------------------------------------------------------------------------------------------

	function expand_template_Void(options) {
		return '';
	}

	function parse_template_Void(token, index, parent, options) {
		token.expand = expand_template_Void;
	}

	// --------------------------------------------------------------------------------------------

	// Not completed! Only for get_all_anchors()
	// @ zh.moegirl [[FLOWERS(Innocent Grey)]]
	function parse_template_Center(token) {
		token.expand = expand_template_get_parameter_1;
	}

	// --------------------------------------------------------------------------------------------

	// Not completed! Only for get_all_anchors()
	// @ zh.moegirl [[ARGONAVIS from BanG Dream! 翻唱曲列表]]
	function parse_template_Font(token) {
		token.expand = expand_template_get_parameter_1;
	}

	// --------------------------------------------------------------------------------------------

	// {{color|英文颜色名称或是RGB 16进制编码|文字}}
	function expand_template_Color(options) {
		var parameters = this.parameters;
		return '<span style="color:' + (parameters[1] || '') + '">'
				+ (parameters[2] || parameters[1] || '') + '</span>';
	}

	function parse_template_Color(token) {
		token.expand = expand_template_Color;
	}

	// --------------------------------------------------------------------------------------------

	function expand_template_At(options) {
		var parameters = this.parameters;
		return '[[File:At_sign.svg|' + (parameters[1] || 15) + 'px|link=]]';
	}

	function parse_template_At(token) {
		token.expand = expand_template_At;
	}

	// --------------------------------------------------------------------------------------------

	function expand_template_User_link(options) {
		var parameters = this.parameters;
		return '[[User:' + (parameters[1]) + '|'
				+ (parameters[2] || parameters[1]) + ']]';
	}

	function parse_template_User_link(token) {
		token.expand = expand_template_User_link;
	}

	// --------------------------------------------------------------------------------------------

	function expand_module_If_empty(options) {
		/* const */var token = options && options.template_token_called
				|| this;
		/* const */var parameters = token.parameters;
		// Error.stackTraceLimit = Infinity;
		// console.trace([ this, parameters, options ]);
		// console.trace(options && options.template_token_called);
		for (/* let */var index = 0; index < token.length; index++) {
			var value = parameters[index];
			if (value)
				return value;
		}
		return '';
	}

	function parse_module_If_empty(token) {
		token.expand = expand_module_If_empty;
	}

	// --------------------------------------------------------------------------------------------

	// Not completed! Only for get_all_anchors()
	// @ zh.moegirl [[ARGONAVIS from BanG Dream! 翻唱曲列表]]
	function expand_template_Colored_link(options) {
		var parameters = this.parameters;
		// {{Colored link|颜色|页面名称链接|显示名称}}]
		return '[[:' + parameters[2] + '|<span style="color:' + parameters[1]
				+ '">' + (parameters[3] || parameters[2]) + '</span>]]';
	}

	function parse_template_Colored_link(token) {
		token.expand = expand_template_Colored_link;
	}

	// --------------------------------------------------------------------------------------------
	// 一些会添加 anchors 的特殊模板。

	// {{Anchor|anchor|别名1|别名2}}
	function expand_template_Anchor(options) {
		var parameters = this.parameters;
		var wikitext = [];
		for (/* let */var index = 1; index < this.length; index++) {
			var anchor = parameters[index];
			if (!anchor) {
				continue;
			}

			if (typeof anchor !== 'string') {
				// e.g., `{{Anchor|{{u|Emojibot}}}}` @ zhwiki

				library_namespace.warn('expand_template_Anchor: 特殊 anchor: #'
						+ anchor);
				// console.trace(anchor);

				// old jawiki {{Anchor}}
				// e.g., [[终着駅シリーズ]]: {{Anchor|[[牛尾正直]]}}
				// {{Anchor|A[[B|C]]}} → "AC"
				anchor = wiki_API.wikitext_to_plain_text(anchor.toString());
			}

			// 多空格、断行会被转成单一 " "。
			anchor = anchor.replace(/[\s\n]{2,}/g, ' ');

			// class="anchor"
			wikitext.push('<span id="' + anchor + '"></span>');
		}
		return wikitext.join('');
	}

	function parse_template_Anchor(token, index, parent, options) {
		token.expand = expand_template_Anchor;
	}

	// --------------------------------------------------------------------------------------------

	function expand_template_Visible_anchor(options) {
		var parameters = this.parameters;
		// {{Visible anchor}}（别名{{Vanc}}）は似たテンプレートですが、1个目のリンク先が表示されます。
		return expand_template_Anchor.call(this, options)
		// + '<span class="vanchor-text">'
		+ (parameters.text || parameters[1] || '')
		// + '</span>'
		;
	}

	function parse_template_Visible_anchor(token, index, parent, options) {
		token.expand = expand_template_Visible_anchor;
	}

	// --------------------------------------------------------------------------------------------

	function expand_template_Term(options) {
		var parameters = this.parameters;
		var wikitext = '<dt id="'
				+ wiki_API.wikitext_to_plain_text(
				//
				parameters.id || parameters.term || parameters[1] || '')
						.replace(/"/g, '').toLowerCase()
				+ '">'
				+ (parameters.content || parameters[2] || parameters.term
						|| parameters[1] || '') + '</dt>';
		// console.log(wikitext);
		return wikitext;
	}

	function parse_template_Term(token, index, parent, options) {
		token.expand = expand_template_Term;
	}

	// --------------------------------------------------------------------------------------------

	function expand_template_Wikicite(options) {
		var parameters = this.parameters;
		// class="citation wikicite"
		var wikitext = '<cite id='
				+ (parameters.ref || parameters.id
						&& ('"Reference-' + parameters.id + '"')) + '>'
				+ parameters.reference + '</cite>';
		// console.log(wikitext);
		return wikitext;
	}

	function parse_template_Wikicite(token, index, parent, options) {
		token.expand = expand_template_Wikicite;
	}

	// --------------------------------------------------------------------------------------------

	function expand_template_SfnRef(options) {
		var parameters = this.parameters;
		var anchor = 'CITEREF';
		for (var index = 1; index <= 5 && parameters[index]; index++) {
			anchor += trim_param(parameters[index]);
		}
		// TODO: test year

		// anchor = anchor.replace(/\s+/g, ' ');

		return anchor;
	}

	function parse_template_SfnRef(token, index, parent, options) {
		token.expand = expand_template_SfnRef;
	}

	// --------------------------------------------------------------------------------------------

	// @see local function sfn (frame) @
	// https://en.wikipedia.org/wiki/Module:Footnotes
	function expand_template_Sfn(options) {
		var parameters = this.parameters;
		var anchor = 'cite_ref-FOOTNOTE';
		for (var index = 1; index <= 5 && parameters[index]; index++) {
			anchor += trim_param(parameters[index]);
		}

		if (parameters.p)
			anchor += trim_param(parameters.p);
		if (parameters.pp)
			anchor += trim_param(parameters.pp);
		if (parameters.loc)
			anchor += trim_param(parameters.loc);

		anchor = anchor.replace(/\s+/g, ' ');

		var wikitext = [];
		var reference_index = 1;
		var pointer_index = 0;
		// TODO: 这个数值必须按照 reference_index 递增。
		var ref_anchor = anchor + '-' + reference_index;
		wikitext.push('<ref name="' + ref_anchor + '">'
		// TODO: + content
		+ '</ref>',

		//
		'<a id="' + anchor + '_' + reference_index + '-'
		// TODO: 这个数值必须按照 pointer_index 递增。
		+ pointer_index + '" href="#' + ref_anchor + '">'
		// TODO: 这个数值必须按照 reference_index 递增。
		+ '[' + reference_index + ']' + '</a>');

		return wikitext.join('');
	}

	function parse_template_Sfn(token, index, parent, options) {
		token.expand = expand_template_Sfn;
	}

	// --------------------------------------------------------------------------------------------

	// @see createEpisodeNumberCellSecondary() @ [[Module:Episode list]]
	var EpisodeNumbers = [ 'EpisodeNumber', 'EpisodeNumber2', 'EpisodeNumber3' ];

	function expand_template_Episode_list(options) {
		// console.trace(this);
		var parameters = this.parameters;
		var anchor_prefix = this.anchor_prefix || '';
		var wikitext = [];
		for (var index = 0; index < EpisodeNumbers.length; index++) {
			var anchor = trim_param(parameters[EpisodeNumbers[index]]);
			// console.trace([ EpisodeNumbers[index], anchor ]);
			// @see getEpisodeText() @ [[Module:Episode list]]
			var matched = anchor && anchor.match(/^\w+/);
			if (matched) {
				anchor = matched[0];
				// 极度简化版。
				wikitext.push('<th id="' + anchor_prefix + 'ep' + anchor
						+ '"></th>');
			}
		}

		// @see createProductionCodeCell() @ [[Module:Episode list]]
		var anchor = trim_param(parameters.ProdCode);
		if (anchor) {
			wikitext.push('<td id="' + 'pc' + anchor + '"></td>');
		}

		// console.trace(wikitext);
		return wikitext.join('');
	}

	function parse_template_Episode_list(token, index, parent, options) {
		token.expand = expand_template_Episode_list;
	}

	function expand_template_Episode_table(options) {
	}

	function parse_template_Episode_table(token, index, parent, options) {
		// token.expand = expand_template_Episode_table;
		var parameters = token.parameters;
		var episodes = parameters.episodes;
		var anchor_prefix = trim_param(parameters.anchor);
		// console.trace(anchor_prefix);
		if (anchor_prefix && episodes) {
			var session = wiki_API.session_of_options(options) || wiki_API;
			wiki_API.parser.parser_prototype.each.call(episodes,
			//
			'transclusion', function(token) {
				if (session.is_template(token, [ 'Episode list',
						'Episode list/sublist' ])) {
					token.anchor_prefix = anchor_prefix;
				}
			}, options);
		}
	}

	// --------------------------------------------------------------------------------------------

	function parse_template_Pin_message(token, index, parent, options) {
		var parameters = token.parameters;
		var expire_date = parameters[1]
				&& wiki_API.parse.date(parameters[1], options);
		// console.trace([ expire_date, parameters ]);
		token.message_expire_date = expire_date || Infinity;
	}

	// --------------------------------------------------------------------------------------------

	// 有缺陷的简易型 Lua patterns to JavaScript RegExp
	function Lua_pattern_to_RegExp_pattern(pattern) {
		return String(pattern).replace(/%l/g, 'a-z').replace(/%u/g, 'A-Z')
		// e.g., %d, %s, %S, %w, %W
		.replace(/%/g, '\\');
	}

	// https://en.wikipedia.org/wiki/Module:Check_for_unknown_parameters
	function check_template_for_unknown_parameters(template_token, options) {
		var valid_parameters = this.valid_parameters, valid_RegExp_parameters = this.valid_RegExp_parameters;
		var invalid_parameters = Object.keys(template_token.parameters)
		//
		.filter(function() {
			if (valid_parameters.has(parameter))
				return;
			return !valid_RegExp_parameters.some(function(pattern) {
				return pattern.test(parameter);
			});
		}, this);

		if (invalid_parameters.length === 0) {
			return;
		}

		var return_value = {
			invalid_parameters : invalid_parameters
		};
		var unknown_text = this.parameters.unknown || 'Found _VALUE_, ';
		var preview_text = this.parameters.preview;
		unknown_text = invalid_parameters.map(function(parameter) {
			return unknown_text.replace(/_VALUE_/g, parameter);
		}).join('').replace(/[,\s]+$/, '');
		if (preview_text) {
			preview_text = invalid_parameters.map(function(parameter) {
				return preview_text.replace(/_VALUE_/g, parameter);
			}).join('').replace(/[,\s]+$/, '');
		}
		return {
			invalid_parameters : invalid_parameters,
			preview_text : preview_text || unknown_text,
			unknown_text : unknown_text
		};
	}

	function parse_module_Check_for_unknown_parameters(token, index, parent,
			options) {
		var parameters = token.parameters, valid_parameters = token.valid_parameters = new Set, valid_RegExp_parameters = token.valid_RegExp_parameters = [];
		for (var index = 1; index < token.length; index++) {
			var value = parameters[index];
			if (value)
				valid_parameters.add(String(value));
			if (value = parameters['regexp' + index]) {
				try {
					value = new RegExp('^'
							+ Lua_pattern_to_RegExp_pattern(value) + '$');
					valid_RegExp_parameters.push(value);
				} catch (e) {
					library_namespace.error([
					//
					'parse_module_Check_for_unknown_parameters: ', {
						T : [
						// gettext_config:{"id":"cannot-convert-lua-pattern-to-regexp-pattern-$1"}
						'Cannot convert Lua pattern to RegExp pattern: %1',
						//
						value ]
					} ]);
				}
			}
		}
		token.check_template = check_template_for_unknown_parameters
				.bind(token);
	}

	// --------------------------------------------------------------------------------------------

	function expand_module_IPAddress(options) {
		// console.trace(this);
		var parameters = this.parameters;
		// console.trace(parameters);
		if (this.function_name === 'isIp') {
			// [ , 'IPAddress', 'isIp', '...' ]
			var is_IP = library_namespace.is_IP(parameters[1]);
			return is_IP ? String(is_IP) : '';
		}
		// TODO:
	}

	function parse_module_IPAddress(token, index, parent, options) {
		token.expand = expand_module_IPAddress;
	}

	// --------------------------------------------------------------------------------------------

	function expand_template_Template_link(options) {
		var parameters = this.parameters;
		return '&#123;&#123;[[Template:' + parameters[1] + '|' + parameters[1]
				+ ']]&#125;&#125;';
	}

	function parse_template_Template_link(token, index, parent, options) {
		token.expand = expand_template_Template_link;
	}

	// --------------------------------------------------------------------------------------------

	// export 导出.

	// general_functions 必须在个别 wiki profiles 之前载入。
	// 如 CeL.application.net.wiki.template_functions.jawiki 依赖于
	// general_functions！
	wiki_API.template_functions.functions_of_all_sites = {
		Void : parse_template_Void,
		Center : parse_template_Center,

		// 一些会用于章节标题的特殊模板。 for preprocess_section_link_token()
		Font : parse_template_Font,
		Color : parse_template_Color,
		'Colored link' : parse_template_Colored_link,

		'@' : parse_template_At,
		'User link' : parse_template_User_link,

		'Module:If empty' : parse_module_If_empty,

		// 一些会添加 anchors 的特殊模板。
		// 会生成网页锚点的模板或模组。
		// Templates or modules that generate web anchors
		Anchor : parse_template_Anchor,
		'Module:Anchor' : parse_template_Anchor,
		'Visible anchor' : parse_template_Visible_anchor,
		Term : parse_template_Term,
		Wikicite : parse_template_Wikicite,
		// Sfn : parse_template_Sfn,
		SfnRef : parse_template_SfnRef,
		'Episode table' : parse_template_Episode_table,
		'Episode list' : parse_template_Episode_list,
		'Episode list/sublist' : parse_template_Episode_list,

		// wiki/routine/20210429.Auto-archiver.js: avoid being archived
		'Pin message' : parse_template_Pin_message,

		'Module:Check for unknown parameters' : parse_module_Check_for_unknown_parameters,

		'Module:IPAddress' : parse_module_IPAddress,

		// TODO
		// 'Module:Unsubst' : parse_module_Unsubst,

		// 'Template link'
		Tl : parse_template_Template_link
	};

	// --------------------------------------------------------------------------------------------

	// 不设定(hook)本 module 之 namespace，仅执行 module code。
	return library_namespace.env.not_to_extend_keyword;
}
