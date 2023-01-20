/**
 * @name CeL function for MediaWiki (Wikipedia / 维基百科): 特色内容特设功能。
 * 
 * 注意: 本程式库必须应各wiki特色内容改动而改写。
 * 
 * @fileoverview 本档案包含了 MediaWiki 自动化作业用程式库的子程式库。
 * 
 * @example <code>

CeL.run('application.net.wiki.featured_content');
wiki.get_featured_content('FFA', function(FC_data_hash) {});
wiki.get_featured_content('GA', function(FC_data_hash) {});
wiki.get_featured_content('FA', function(FC_data_hash) {});
wiki.get_featured_content('FL', function(FC_data_hash) {});

</code>
 * 
 * @since 2020/1/22 9:18:43
 */

// Wikipedia bots demo: https://github.com/kanasimi/wikibot
'use strict';
// 'use asm';

// --------------------------------------------------------------------------------------------

// 不采用 if 陈述式，可以避免 Eclipse JSDoc 与 format 多缩排一层。
typeof CeL === 'function' && CeL.run({
	// module name
	name : 'application.net.wiki.featured_content',

	require : 'data.native.' + '|application.net.wiki.'
	// load MediaWiki module basic functions
	+ '|application.net.wiki.namespace.'
	// for to_exit
	+ '|application.net.wiki.parser.'
	//
	+ '|application.net.wiki.page.|application.net.wiki.list.',

	// 设定不汇出的子函式。
	no_extend : 'this,*',

	// 为了方便格式化程式码，因此将 module 函式主体另外抽出。
	code : module_code
});

function module_code(library_namespace) {
	// requiring
	var wiki_API = library_namespace.application.net.wiki, KEY_SESSION = wiki_API.KEY_SESSION;
	// @inner
	// var is_api_and_title = wiki_API.is_api_and_title,
	// normalize_title_parameter = wiki_API.normalize_title_parameter;

	var to_exit = wiki_API.parser.parser_prototype.each.exit;

	// --------------------------------------------------------------------------------------------

	function featured_content() {
	}

	function get_parsed(page_data) {
		if (!page_data)
			return;

		var parsed = typeof page_data.each === 'function'
		// `page_data` is parsed data
		? page_data : wiki_API.parser(page_data);

		return parsed;
	}

	// ------------------------------------------------------------------------

	/** 特色内容为列表 */
	var KEY_IS_LIST = 'is_list';
	/** 为已撤销的特色内容 */
	var KEY_ISFFC = 'is_former';
	/** 特色内容类别 */
	var KEY_CATEGORY = 'category';
	/** 指示用。会在 parse_each_zhwiki_FC_item_list_page() 之后就删除。 */
	var KEY_LIST_PAGE = 'list page';

	function remove_KEY_LIST_PAGE(FC_data_hash) {
		for ( var title in FC_data_hash) {
			delete FC_data_hash[title][KEY_LIST_PAGE];
		}
	}

	var featured_content_configurations = {
		zhwiki : {
			// @see [[Category:特色内容]]
			list_source : {
				FA : '典范条目‎',
				FL : '特色列表‎',
				FP : '特色图片‎',
				GA : '优良条目‎',
			},
			get_FC : /* get_zhwiki_FC_via_list_page */get_FC_via_category
		},
		jawiki : {
			// @see [[ja:Category:记事の选考]]
			list_source : {
				FA : 'ウィキペディア 秀逸な记事',
				FL : 'ウィキペディア 秀逸な一覧',
				FP : 'ウィキペディア 秀逸な画像',
				GA : 'ウィキペディア 良质な记事'
			},
			get_FC : get_FC_via_category
		},
		enwiki : {
			// @see [[en:Category:Featured content]]
			list_source : {
				FFA : {
					page : 'Wikipedia:Former featured articles',
					handler : parse_enwiki_FFA
				},
				DGA : 'Delisted good articles',
				FA : 'Featured articles',
				FL : 'Featured lists‎',
				FP : 'Featured pictures‎',
				FT : 'Featured topics‎',
				GA : 'Good articles'
			},
			get_FC : get_FC_via_category
		}
	};

	function get_site_configurations(session) {
		// e.g., 'zhwiki'
		var site_name = wiki_API.site_name(session);
		var FC_configurations = featured_content_configurations[site_name];
		return FC_configurations;
	}

	// @see 20190101.featured_content_maintainer.js
	// 注意: 这边尚未处理 redirects 的问题!!
	function parse_each_zhwiki_FC_item_list_page(page_data, redirects_to_hash,
			sub_FC_list_pages) {
		var using_GA = options.type === 'GA';
		/** {String}将显示的类型名称。 */
		var TYPE_NAME = using_GA ? '优良条目' : '特色内容';
		/** {Array}错误记录 */
		var error_logs = [];
		var FC_data_hash = this.FC_data_hash
		// FC_data_hash[redirected FC_title] = { FC_data }
		|| (this.FC_data_hash = Object.create(null));

		/**
		 * {String}page title = page_data.title
		 */
		var title = wiki_API.title_of(page_data);
		/**
		 * {String}page content, maybe undefined. 条目/页面内容 =
		 * wiki_API.revision_content(revision)
		 */
		var content = wiki_API.content_of(page_data);
		//
		var matched;
		/** 特色内容为列表 */
		var is_list = /list|列表/.test(title)
		// e.g., 'Wikipedia:FL'
		|| /:[DF]?[FG]L/.test(page_data.original_title || title),
		// 本页面为已撤消的条目列表。注意: 这包含了被撤销后再次被评为典范的条目。
		is_FFC = [ page_data.original_title, title ].join('|');

		// 对于进阶的条目，采用不同的 is_FFC 表示法。
		is_FFC = using_GA && /:FF?A/.test(is_FFC) && 'UP'
				|| /:[DF][FG][AL]|已撤消的|已撤销的/.test(is_FFC);

		if (is_FFC) {
			// 去掉被撤销后再次被评为典范的条目/被撤销后再次被评为特色的列表/被撤销后再次被评选的条目
			content = content.replace(/\n== *(?:被撤销后|被撤销后)[\s\S]+$/, '');
		}

		// 自动侦测要使用的模式。
		function test_pattern(pattern, min) {
			var count = 0, matched;
			while (matched = pattern.exec(content)) {
				if (matched[1] && count++ > (min || 20)) {
					return pattern;
				}
			}
		}

		var catalog,
		// matched: [ all, link title, display, catalog ]
		PATTERN_Featured_content = test_pattern(
		// @see [[Template:FA number]] 被标记为粗体的条目已经在作为典范条目时在首页展示过
		// 典范条目, 已撤销的典范条目, 已撤销的特色列表: '''[[title]]'''
		// @see PATTERN_category
		/'''\[\[([^{}\[\]\|<>\t\n#�]+)(?:\|([^\[\]\|�]*))?\]\]'''|\n==([^=].*?)==\n/g)
				// 特色列表: [[:title]]
				|| test_pattern(/\[\[:([^{}\[\]\|<>\t\n#�]+)(?:\|([^\[\]\|�]*))?\]\]|\n==([^=].*?)==\n/g)
				// 优良条目转换到子页面模式: 警告：本页中的所有嵌入页面都会被机器人当作优良条目的分类列表。请勿嵌入非优良条目的分类列表。
				|| test_pattern(/{{(Wikipedia:[^{}\|]+)}}/g, 10)
				// 优良条目子分类列表, 已撤消的优良条目: all links NOT starting with ':'
				|| /\[\[([^{}\[\]\|<>\t\n#�:][^{}\[\]\|<>\t\n#�]*)(?:\|([^\[\]\|�]*))?\]\]|\n===([^=].*?)===\n/g;
		library_namespace.log(wiki_API.title_link_of(title)
				+ ': '
				+ (is_FFC ? 'is former'
						+ (is_FFC === true ? '' : ' (' + is_FFC + ')')
						: 'NOT former') + ', '
				+ (is_list ? 'is list' : 'is article') + ', using pattern '
				+ PATTERN_Featured_content);

		// reset pattern
		PATTERN_Featured_content.lastIndex = 0;
		// 分类/类别。
		if (matched = title.match(/\/(?:分类|分类)\/([^\/]+)/)) {
			catalog = matched[1];
		}

		if (false) {
			library_namespace.log(content);
			console.log([ page_data.original_title || title, is_FFC, is_list,
					PATTERN_Featured_content ]);
		}
		while (matched = PATTERN_Featured_content.exec(content)) {
			// 还没繁简转换过的标题。
			var original_FC_title = wiki_API.normalize_title(matched[1]);

			if (matched.length === 2) {
				sub_FC_list_pages.push(original_FC_title);
				continue;
			}

			// assert: matched.length === 4

			if (matched[3]) {
				// 分类/类别。
				catalog = matched[3].replace(/<!--[\s\S]*?-->/g, '').trim()
						.replace(/\s*（\d+）$/, '');
				continue;
			}

			// 去除并非文章，而是工作连结的情况。 e.g., [[File:文件名]], [[Category:维基百科特色内容|*]]
			if (this.namespace(original_FC_title, 'is_page_title') !== 0) {
				continue;
			}

			// 转换成经过繁简转换过的最终标题。
			var FC_title = redirects_to_hash
					&& redirects_to_hash[original_FC_title]
					|| original_FC_title;

			if (FC_title in FC_data_hash) {
				// 基本检测与提醒。
				if (FC_data_hash[FC_title][KEY_ISFFC] === is_FFC) {
					library_namespace.warn(
					//
					'parse_each_zhwiki_FC_item_list_page: Duplicate '
							+ TYPE_NAME + ' title: ' + FC_title + '; '
							+ JSON.stringify(FC_data_hash[FC_title]) + '; '
							+ matched[0]);
					error_logs.push(wiki_API.title_link_of(title)
							+ '有重复条目: '
							+ wiki_API.title_link_of(original_FC_title)
							+ (original_FC_title === FC_title ? '' : ', '
									+ wiki_API.title_link_of(FC_title)));
				} else if (!!FC_data_hash[FC_title][KEY_ISFFC] !== !!is_FFC
						&& (FC_data_hash[FC_title][KEY_ISFFC] !== 'UP' || is_FFC !== false)) {
					error_logs
							.push(wiki_API.title_link_of(FC_title)
									+ ' 被同时列在了现存及已撤销的'
									+ TYPE_NAME
									+ '清单中: '
									+ wiki_API.title_link_of(original_FC_title)
									+ '@'
									+ wiki_API.title_link_of(title)
									+ ', '
									+ wiki_API
											.title_link_of(FC_data_hash[FC_title][KEY_LIST_PAGE][1])
									+ '@'
									+ wiki_API
											.title_link_of(FC_data_hash[FC_title][KEY_LIST_PAGE][0]));
					library_namespace.error(wiki_API.title_link_of(FC_title)
							+ ' 被同时列在了现存及已撤销的' + TYPE_NAME + '清单中: ' + is_FFC
							+ '; ' + JSON.stringify(FC_data_hash[FC_title]));
				}
			}
			var FC_data = FC_data_hash[FC_title] = Object.create(null);
			FC_data[KEY_IS_LIST] = is_list;
			FC_data[KEY_ISFFC] = is_FFC;
			if (catalog)
				FC_data[KEY_CATEGORY] = catalog;
			FC_data[KEY_LIST_PAGE] = [ title, original_FC_title ];
		}

		return error_logs;
	}

	function get_zhwiki_FC_via_list_page(options, callback) {
		var session = this;
		var using_GA = options.type === 'GA';
		var FC_list_pages = (using_GA ? 'WP:GA' : 'WP:FA|WP:FL').split('|');
		var Former_FC_list_pages = (using_GA ? 'WP:DGA|WP:FA|WP:FFA'
				: 'WP:FFA|WP:FFL').split('|');
		var page_options = {
			redirects : 1,
			multi : true
		};

		this.page(FC_list_pages.concat(Former_FC_list_pages), function(
				page_data_list) {
			var sub_FC_list_pages = [];
			page_data_list.forEach(function(page_data) {
				parse_each_zhwiki_FC_item_list_page.call(session, page_data,
						options.redirects_to_hash, sub_FC_list_pages);
			});

			if (sub_FC_list_pages.length === 0) {
				remove_KEY_LIST_PAGE(session.FC_data_hash);
				callback && callback(session.FC_data_hash);
				return;
			}

			session.page(sub_FC_list_pages, function(page_data_list) {
				page_data_list.forEach(function(page_data) {
					parse_each_zhwiki_FC_item_list_page.call(session,
							page_data, options.redirects_to_hash);
				});
				remove_KEY_LIST_PAGE(session.FC_data_hash);
				callback && callback(session.FC_data_hash);
			}, page_options);
		}, page_options);
	}

	// ------------------------------------------------------------------------

	function parse_enwiki_FFA(page_data, type_name) {
		/**
		 * {String}page content, maybe undefined. 条目/页面内容 =
		 * wiki_API.revision_content(revision)
		 */
		var content = wiki_API.content_of(page_data);
		content = content.replace(/^[\s\S]+?\n(==.+?==)/, '$1')
		// remove == Former featured articles that have been re-promoted ==
		.replace(/==\s*Former featured articles.+?==[\s\S]*$/, '');
		var FC_data_hash = this.FC_data_hash;
		var PATTERN_Featured_content = /\[\[(.+?)\]\]/g, matched;
		while (matched = PATTERN_Featured_content.exec(content)) {
			var FC_title = matched[1];
			var FC_data = FC_data_hash[FC_title];
			if (FC_data) {
				if (!FC_data.types.includes(type_name)) {
					// 把重要的放在前面。
					FC_data.types.unshift(type_name);
				}
				// Do not overwrite
				continue;
			}

			FC_data = FC_data_hash[FC_title] = {
				type : type_name,
				types : [ type_name ]
			};
			FC_data[KEY_ISFFC] = true;
			// FC_data[KEY_IS_LIST] = is_list;
		}
	}

	// ------------------------------------------------------------------------

	function normalize_type_name(type) {
		return type;
	}

	function get_FC_via_category(options, callback) {
		var FC_configurations = get_site_configurations(this);

		var type_name = normalize_type_name(options.type);
		var list_source = FC_configurations.list_source[type_name];
		// console.trace([ FC_configurations, type_name, list_source ]);
		if (!list_source) {
			throw new Error('Unknown type: ' + options.type);
		}

		// ----------------------------

		var FC_data_hash = this.FC_data_hash
		// FC_data_hash[redirected FC_title] = { FC_data }
		|| (this.FC_data_hash = Object.create(null));

		// ----------------------------

		var session = this;
		if (list_source.page) {
			this.page(list_source.page, function(page_data) {
				list_source.handler.call(session, page_data, type_name);
				callback && callback(FC_data_hash);
			});
			return;
		}

		// ----------------------------

		var category_title = list_source;

		/** 特色内容为列表 */
		var is_list = /list|列表/.test(category_title);
		wiki_API.list(category_title, function(list/* , target, options */) {
			list.forEach(function(page_data) {
				var FC_title = page_data.title;
				var FC_data = FC_data_hash[FC_title];
				if (!FC_data) {
					FC_data = FC_data_hash[FC_title] = {
						type : type_name,
						types : [ type_name ]
					};
				} else if (FC_data.type !== type_name) {
					if (FC_data.type !== 'FFA' || type_name === 'FA') {
						if (options.on_conflict) {
							options.on_conflict(FC_title, {
								from : FC_data.type,
								to : type_name,
								category : category_title
							});
						} else {
							library_namespace.warn('get_FC_via_category: '
									+ FC_title + ': ' + FC_data.type + '→'
									+ type_name);
						}
					}
					if (!FC_data.types.includes(type_name)) {
						// 把重要的放在前面。
						FC_data.types.unshift(type_name);
					}
					FC_data.type = type_name;
				}
				FC_data[KEY_IS_LIST] = is_list;
				// FC_data[KEY_ISFFC] = false;
				// if (catalog) FC_data[KEY_CATEGORY] = catalog;
			});
			callback && callback(FC_data_hash);

		}, {
			// [KEY_SESSION]
			session : this,
			// namespace: '0|1',
			type : 'categorymembers'
		});
	}

	// --------------------------------------------------------------------------------------------

	// export 导出.
	// Object.assign(featured_content, {});

	// ------------------------------------------------------------------------

	// wrapper for local function
	wiki_API.prototype.get_featured_content_configurations = function get_featured_content_configurations() {
		return get_site_configurations(this);
	};

	// callback(wiki.FC_data_hash);
	// e.g.,
	// wiki.FC_data_hash[title]={type:'GA',types:['GA','FFA'],is_former:true,is_list:false}
	wiki_API.prototype.get_featured_content = function get_featured_content(
			options, callback) {
		var FC_configurations = this.get_featured_content_configurations();
		var get_FC_function = FC_configurations && FC_configurations.get_FC;
		if (!get_FC_function) {
			library_namespace.error('get_featured_content: '
					+ 'Did not configured how to get featured content! '
					+ wiki_API.site_name(this));
			return;
		}

		if (typeof options === 'string') {
			options = {
				type : options
			};
		} else {
			options = library_namespace.setup_options(options);
		}
		get_FC_function.call(this, options, callback);
	};

	// 不设定(hook)本 module 之 namespace，仅执行 module code。
	return library_namespace.env.not_to_extend_keyword;
	// return featured_content;
}
