/**
 * @name CeL function for MediaWiki (Wikipedia / 维基百科): page, revisions
 * 
 * @fileoverview 本档案包含了 MediaWiki 自动化作业用程式库的子程式库。
 * 
 * TODO:<code>


</code>
 * 
 * @since 2019/10/10 拆分自 CeL.application.net.wiki
 */

// More examples: see /_test suite/test.js
// Wikipedia bots demo: https://github.com/kanasimi/wikibot
'use strict';
// 'use asm';

// --------------------------------------------------------------------------------------------

// 不采用 if 陈述式，可以避免 Eclipse JSDoc 与 format 多缩排一层。
typeof CeL === 'function' && CeL.run({
	// module name
	name : 'application.net.wiki.page',

	require : 'data.native.'
	// CeL.data.fit_filter()
	+ '|data.'
	// CeL.date.String_to_Date(), Julian_day(), .to_millisecond(): CeL.data.date
	+ '|data.date.'
	// for library_namespace.directory_exists
	+ '|application.storage.'
	// for library_namespace.get_URL
	+ '|application.net.Ajax.' + '|application.net.wiki.'
	// load MediaWiki module basic functions
	+ '|application.net.wiki.namespace.'
	// for wiki_API.estimated_message()
	// + '|application.net.wiki.task.'
	//
	+ '|application.net.wiki.query.|application.net.wiki.Flow.',

	// 设定不汇出的子函式。
	no_extend : 'this,*',

	// 为了方便格式化程式码，因此将 module 函式主体另外抽出。
	code : module_code
});

function module_code(library_namespace) {

	// requiring
	var wiki_API = library_namespace.application.net.wiki, KEY_SESSION = wiki_API.KEY_SESSION;
	// @inner
	var is_api_and_title = wiki_API.is_api_and_title, normalize_title_parameter = wiki_API.normalize_title_parameter, set_parameters = wiki_API.set_parameters;

	var
	/** node.js file system module */
	node_fs = library_namespace.platform.nodejs && require('fs');

	var
	/** {Number}未发现之index。 const: 基本上与程式码设计合一，仅表示名义，不可更改。(=== -1) */
	NOT_FOUND = ''.indexOf('_');

	var gettext = library_namespace.cache_gettext(function(_) {
		gettext = _;
	});

	// ------------------------------------------------------------------------

	// wiki.page() 范例。
	if (false) {
		CeL.wiki.page('史记', function(page_data) {
			CeL.show_value(page_data);
		});

		wiki.page('巴黎协议 (消歧义)', {
			query_props : 'pageprops'
		});
		// wiki.last_page

		// for "Date of page creation" 页面建立日期 @ Edit history 编辑历史 @ 页面资讯
		// &action=info
		wiki.page('巴黎协议', function(page_data) {
			// e.g., '2015-12-17T12:10:18.000Z'
			console.log(CeL.wiki.content_of.edit_time(page_data));
		}, {
			rvdir : 'newer',
			rvprop : 'timestamp',
			rvlimit : 1
		});

		wiki.page('巴黎协议', function(page_data) {
			// {Date}page_data.creation_Date
			console.log(page_data);
		}, {
			get_creation_Date : true
		});

		// for many pages, e.g., more than 200, please use:
		wiki.work({
			// redirects : 1,
			each : for_each_page_data,
			last : last_operation,
			no_edit : true,
			page_options : {
				// multi : 'keep index',
				// converttitles : 1,
				redirects : 1
			}
		}, page_list);

		// 组合以取得资讯。
		wiki.page(title, function(page_data) {
			console.log(page_data);
		}, {
			prop : 'revisions|info',
			// rvprop : 'ids|timestamp',
			// https://www.mediawiki.org/w/api.php?action=help&modules=query%2Binfo
			// https://www.mediawiki.org/wiki/API:Info
			additional_query : 'inprop=talkid|subjectid'
					+ '|preload|displaytitle|varianttitles'
		});

		// 组合以取得资讯。
		wiki.page(title, function(page_data) {
			console.log(page_data);
			if ('read' in page_data.actions)
				console.log('readable');
		}, {
			prop : 'info',
			// https://www.mediawiki.org/wiki/API:Info
			additional_query : 'inprop=intestactions&intestactions=read'
		// + '&intestactionsdetail=full'
		});

		// Get all summaries <del>and diffs</del>
		wiki.page('Heed (cat)', function(page_data) {
			console.log(page_data);
		}, {
			rvprop : 'ids|timestamp|comment',
			rvlimit : 'max'
		});
	}

	// assert: !!KEY_KEEP_INDEX === true
	var KEY_KEEP_INDEX = 'keep index',
	// assert: !!KEY_KEEP_ORDER === true
	KEY_KEEP_ORDER = 'keep order';

	// https://www.mediawiki.org/wiki/API:Query#Query_modules
	function setup_query_modules(title, callback, options) {
		var session = wiki_API.session_of_options(options);
		// console.trace(session.API_parameters.query);
		wiki_API_page.query_modules = Object.keys(session.API_parameters.query)
		// Should be [ 'prop', 'list', 'meta' ]
		.filter(function(key) {
			var parameters = session.API_parameters.query[key];
			return parameters.limit && parameters.submodules;
		});
		library_namespace.info([ 'setup_query_modules: ', {
			// gettext_config:{"id":"found-$2-query-modules-$1"}
			T : [ 'Found %2 query {{PLURAL:%2|module|modules}}: %1',
			// gettext_config:{"id":"Comma-separator"}
			wiki_API_page.query_modules.join(gettext('Comma-separator')),
			//
			wiki_API_page.query_modules.length ]
		} ]);

		wiki_API_page.apply(this, arguments);
	}

	/**
	 * 读取页面内容，取得页面源码。可一次处理多个标题。
	 * 
	 * 前文有 wiki.page() 范例。
	 * 
	 * 注意: 用太多 CeL.wiki.page() 并行处理，会造成 error.code "EMFILE"。
	 * 
	 * TODO:
	 * https://www.mediawiki.org/w/api.php?action=help&modules=expandtemplates
	 * or https://www.mediawiki.org/w/api.php?action=help&modules=parse
	 * 
	 * @example <code>

	// 前文有 wiki.page() 范例。

	</code>
	 * 
	 * @param {String|Array}title
	 *            title or [ {String}API_URL, {String}title or {Object}page_data ]
	 * @param {Function}[callback]
	 *            回调函数。 callback(page_data, error) { page_data.title; var
	 *            content = CeL.wiki.content_of(page_data); }
	 * @param {Object}[options]
	 *            附加参数/设定选择性/特殊功能与选项
	 * 
	 * @see https://www.mediawiki.org/w/api.php?action=help&modules=query%2Brevisions
	 */
	function wiki_API_page(title, callback, options) {
		if (wiki_API.need_get_API_parameters('query+revisions', options,
				wiki_API_page, arguments)) {
			return;
		}
		var action = {
			action : 'query'
		};
		if (wiki_API.need_get_API_parameters(action, options,
				setup_query_modules, arguments)) {
			return;
		}

		if (typeof callback === 'object' && options === undefined) {
			// shift arguments
			options = callback;
			callback = undefined;
		}

		// 正规化并提供可随意改变的同内容参数，以避免修改或覆盖附加参数。
		options = library_namespace.new_options(options);

		if (false && library_namespace.is_Set(title)) {
			title = Array.from(title);
		}

		// console.log('title: ' + JSON.stringify(title));
		if (options.get_creation_Date) {
			// 警告:仅适用於单一页面。
			wiki_API_page(title, function(page_data, error) {
				if (error || !wiki_API.content_of.page_exists(page_data)) {
					// console.trace('error? 此页面不存在/已删除。');
					callback(page_data, error);
					return;
				}

				// e.g., '2015-12-17T12:10:18.000Z'
				// page_data.revisions[0].timestamp;

				page_data.creation_Date
				// CeL.wiki.content_of.edit_time(page_data)
				= wiki_API.content_of.edit_time(page_data);
				if (typeof options.get_creation_Date === 'function') {
					options.get_creation_Date(page_data.creation_Date,
							page_data);
				}
				if (false) {
					console.log(page_data.creation_Date.format('%Y/%m/%d'));
				}

				delete options.get_creation_Date;
				// 去掉仅有timestamp，由旧至新的.revisions。
				delete page_data.revisions;
				// 若有需要顺便取得页面内容，需要手动设定如:
				// {get_creation_Date:true,prop:'revisions'}
				if (('query_props' in options) || ('prop' in options)) {
					wiki_API_page(title, function(_page_data, error) {
						// console.trace(title);
						callback(Object.assign(page_data, _page_data), error);
					}, options);
				} else {
					// console.trace(title);
					callback(page_data);
				}

			}, {
				rvdir : 'newer',
				rvprop : 'timestamp',
				rvlimit : 1
			});
			return;
		}

		if (options.query_props) {
			var query_props = options.query_props, page_data,
			//
			get_properties = function(page) {
				if (page) {
					if (page_data)
						Object.assign(page_data, page);
					else
						page_data = page;
				}
				var prop;
				while (query_props.length > 0
				//
				&& !(prop = query_props.shift()))
					;

				if (!prop || page_data
				//
				&& (('missing' in page_data) || ('invalid' in page_data))) {
					// 此页面不存在/已删除。
					callback(page_data);
				} else {
					library_namespace.debug('Get property: [' + prop + ']', 1,
							'wiki_API_page');
					options.prop = prop;
					wiki_API_page(title, get_properties, options);
				}
			};

			delete options.query_props;
			if (typeof query_props === 'string') {
				query_props = query_props.split('|');
			}
			if (Array.isArray(query_props)) {
				if (!options.no_content)
					query_props.push('revisions');
				get_properties();
			} else {
				library_namespace.error([ 'wiki_API_page: ', {
					// gettext_config:{"id":"invalid-parameter-$1"}
					T : [ 'Invalid parameter: %1', '.query_props' ]
				} ]);
				throw new Error('wiki_API_page: '
				// gettext_config:{"id":"invalid-parameter-$1"}
				+ gettext('Invalid parameter: %1', '.query_props'));
			}
			return;
		}

		// console.trace(title);
		action = normalize_title_parameter(title, options);
		// console.trace(action);
		if (!action) {
			library_namespace.error([ 'wiki_API_page: ', {
				// gettext_config:{"id":"invalid-title-$1"}
				T : [ 'Invalid title: %1', wiki_API.title_link_of(title) ]
			} ]);
			// console.trace(title);
			callback(undefined, new Error(gettext(
			// gettext_config:{"id":"invalid-title-$1"}
			'Invalid title: %1', wiki_API.title_link_of(title))));
			return;
			throw new Error('wiki_API_page: '
			// gettext_config:{"id":"invalid-title-$1"}
			+ gettext('Invalid title: %1', wiki_API.title_link_of(title)));
		}

		// console.trace(action);
		// console.trace(options);

		if (!wiki_API_page.query_modules
		//
		|| !wiki_API_page.query_modules.some(function(module) {
			return module in options;
		})) {
			options.prop = 'revisions';
		}

		var get_content = options.prop
		// {String|Array}
		&& options.prop.includes('revisions');
		if (get_content) {
			var session = wiki_API.session_of_options(options);
			// 2019 API:
			// https://www.mediawiki.org/wiki/Manual:Slot
			// https://www.mediawiki.org/wiki/API:Revisions
			// 检测有没有此项参数。
			if (!session || session.API_parameters['query+revisions'].slots) {
				action[1].rvslots = options.rvslots || 'main';
			}

			// 处理数目限制 limit。单一页面才能取得多 revisions。多页面(≤50)只能取得单一 revision。
			// https://www.mediawiki.org/w/api.php?action=help&modules=query
			// titles/pageids: Maximum number of values is 50 (500 for bots).
			if ('rvlimit' in options) {
				if (options.rvlimit > 0 || options.rvlimit === 'max')
					action[1].rvlimit = options.rvlimit;
			} else if (!action[1].titles && !action[1].pageids) {
				// assert: action[1].title || action[1].pageid
				// || action[1].pageid === 0
				// default: 仅取得单一 revision。
				action[1].rvlimit = 1;
			}

			// Which properties to get for each revision
			get_content = Array.isArray(options.rvprop)
			//
			&& options.rvprop.join('|')
			//
			|| options.rvprop || wiki_API_page.default_rvprop;

			action[1].rvprop = get_content;

			get_content = get_content.includes('content');
		}

		// 自动搜寻/转换繁简标题。
		if (!('converttitles' in options)) {
			options.converttitles = wiki_API.site_name(options, {
				get_all_properties : true
			}).language;
			if (!wiki_API_page.auto_converttitles
					.includes(options.converttitles)) {
				delete options.converttitles;
			} else {
				options.converttitles = 1;
			}
		}

		// Which properties to get for the queried pages
		// 输入 prop:'' 或再加上 redirects:1 可以仅仅确认页面是否存在，以及页面的正规标题。
		if (Array.isArray(options.prop)) {
			options.prop = options.prop.join('|');
		}

		for ( var parameter in {
			// e.g., rvdir=newer
			// Get first revisions
			rvdir : true,
			rvcontinue : true,
			converttitles : true,
			// e.g., prop=info|revisions
			// e.g., prop=pageprops|revisions
			// 没 .pageprops 的似乎大多是没有 Wikidata entity 的？
			prop : true
		}) {
			if (parameter in options) {
				action[1][parameter] = options[parameter];
			}
		}

		set_parameters(action, options);

		action[1].action = 'query';

		// TODO:
		// wiki_API.extract_parameters(options, action, true);

		library_namespace.debug('get url token: ' + action, 5, 'wiki_API_page');
		// console.trace([ action, options ]);

		var post_data = library_namespace.Search_parameters();
		// 将<s>过长的</s>标题列表改至 POST，预防 "414 Request-URI Too Long"。
		// https://github.com/kanasimi/wikibot/issues/32
		// 不同 server 可能有不同 GET 请求长度限制。不如直接改成 POST。
		if (Array.isArray(action[1].pageids)) {
			post_data.pageids = action[1].pageids;
			delete action[1].pageids;
		}
		if (Array.isArray(action[1].titles)) {
			post_data.titles = action[1].titles;
			delete action[1].titles;
		}

		// console.trace(wiki_API.session_of_options(options));
		// console.trace(action);
		wiki_API.query(action, typeof callback === 'function'
		//
		&& function process_page(data) {
			// console.trace('Get page: ' + title);
			if (library_namespace.is_debug(2)
			// .show_value() @ interact.DOM, application.debug
			&& library_namespace.show_value) {
				library_namespace.show_value(data, 'wiki_API_page: data');
			}

			var error = data && data.error;
			// 检查 MediaWiki 伺服器是否回应错误资讯。
			if (error) {
				library_namespace.error('wiki_API_page: ['
				//
				+ error.code + '] ' + error.info);
				/**
				 * e.g., Too many values supplied for parameter 'pageids': the
				 * limit is 50
				 */
				if (data.warnings && data.warnings.query
				//
				&& data.warnings.query['*']) {
					library_namespace.warn(
					//
					'wiki_API_page: ' + data.warnings.query['*']);
				}
				if (error.code === 'toomanyvalues' && error.limit > 0) {
					var session = wiki_API.session_of_options(options);
					if (session && !(session.slow_query_limit < error.limit)) {
						library_namespace.warn([ 'wiki_API_page: ', {
							// gettext_config:{"id":"reduce-the-maximum-number-of-pages-per-fetch-to-a-maximum-of-$1-pages"}
							T : [ '调降取得页面的上限，改成每次最多 %1 个页面。', error.limit ]
						} ]);
						// https://www.mediawiki.org/w/api.php
						// slow queries: 500; fast queries: 5000
						// The limits for slow queries also apply to multivalue
						// parameters.
						session.slow_query_limit = error.limit;
					}

					// 尝试自动将所要求的 query 切成小片。
					// TODO: 此功能应放置于 wiki_API.query() 中。
					if (options.try_cut_slice && Array.isArray(title)
					// 2: 避免 is_api_and_title(title)
					&& title.length > 2) {
						// TODO: 将 title 切成 slice，重新 request。
						options.multi = true;
						options.slice_size = error.limit;
						// console.trace(title);
						wiki_API_page(title, callback, options);
						return;
					}
				}
				callback(data, error);
				return;
			}

			if (false && data.warnings && data.warnings.result
			/**
			 * <code>
			// e.g., 2021/5/23:
			{
			  continue: { rvcontinue: '74756|83604874', continue: '||' },
			  warnings: {
			    result: {
			      '*': 'This result was truncated because it would otherwise be larger than the limit of 12,582,912 bytes.'
			    }
			  },
			  query: {
			    pages: {
			      '509': [Object],
			      ...
			    }
			  }
			}
			</code>
			 * limit: 12 MB. 此时应该有 .continue。
			 */
			&& data.warnings.result['*']) {
				if (false && data.warnings.result['*'].includes('truncated'))
					data.truncated = true;
				library_namespace.warn(
				//
				'wiki_API_page: ' + data.warnings.result['*']);
			}

			if (!data || !data.query
			// assert: data.cached_response && data.query.pages
			|| !data.query.pages && !data.query.redirects) {
				// e.g., 'wiki_API_page: Unknown response:
				// [{"batchcomplete":""}]'
				library_namespace.warn([ 'wiki_API_page: ', {
					// gettext_config:{"id":"unknown-api-response-$1"}
					T : [ 'Unknown API response: %1', (typeof data === 'object'
					//
					&& typeof JSON !== 'undefined'
					//
					? JSON.stringify(data) : data) ]
				} ]);
				// library_namespace.set_debug(6);
				if (library_namespace.is_debug()
				// .show_value() @ interact.DOM, application.debug
				&& library_namespace.show_value)
					library_namespace.show_value(data);
				callback(undefined, 'Unknown response');
				return;
			}

			var page_list = [],
			//
			index_of_title = page_list.index_of_title = Object.create(null),
			// library_namespace.storage.write_file()
			page_cache_prefix = library_namespace.write_file
			//
			&& options.page_cache_prefix;

			var continue_id;
			if ('continue' in data) {
				// console.trace(data['continue']);
				// page_list['continue'] = data['continue'];
				if (data['continue']
				//
				&& typeof data['continue'].rvcontinue === 'string'
				//
				&& (continue_id = data['continue'].rvcontinue
				// assert: page_list['continue'].rvcontinue = 'date|oldid'。
				.match(/\|([1-9]\d*)$/))) {
					continue_id = Math.floor(continue_id[1]);
				}
				if (false && data.truncated)
					page_list.truncated = true;

			}

			// ------------------------

			// https://zh.wikipedia.org/w/api.php?action=query&prop=info&converttitles=zh&titles=A&redirects=&maxlag=5&format=json&utf8=1
			// 2020/10/9: for [[A]]￫[[B]]￫[[A]], we will get
			// {"batchcomplete":"","query":{"redirects":[{"from":"A","to":"B"},{"from":"B","to":"A"}]}}

			var redirect_from;
			if (data.query.redirects) {
				page_list.redirects = data.query.redirects;
				if (Array.isArray(data.query.redirects)) {
					page_list.redirect_from
					// 记录经过重导向的标题。
					= redirect_from = Object.create(null);
					data.query.redirects.forEach(function(item) {
						redirect_from[item.to] = item.from;
					});

					if (!data.query.pages) {
						data.query.pages = {
							title : data.query.redirects[0].from
						};
						if (data.query.pages.title ===
						//
						redirect_from[data.query.redirects[0].to]) {
							library_namespace.warn([ 'wiki_API_page: ', {
								// gettext_config:{"id":"circular-redirect-$1↔$2"}
								T : [ 'Circular redirect: %1↔%2',
								//
								wiki_API.title_link_of(
								//
								data.query.pages.title),
								//
								wiki_API.title_link_of(
								//
								data.query.redirects[0].to) ]
							} ]);
							data.query.pages.redirect_loop = true;
						}
						data.query.pages = {
							'' : data.query.pages
						};
					}
				}
			}

			var convert_from;
			if (data.query.converted) {
				page_list.converted = data.query.converted;
				if (Array.isArray(data.query.converted)) {
					page_list.convert_from = convert_from
					// 记录经过转换的标题。
					= Object.create(null);
					data.query.converted.forEach(function(item) {
						convert_from[item.to] = item.from;
					});
				}
			}
			if (data.query.normalized) {
				page_list.normalized = data.query.normalized;
				// console.log(data.query.normalized);
				page_list.convert_from = convert_from
				// 记录经过转换的标题。
				|| (convert_from = Object.create(null));
				data.query.normalized.forEach(function(item) {
					convert_from[item.to] = item.from;
				});
			}

			// ------------------------

			var pages = data.query.pages;
			// console.log(options);
			var need_warn = /* !options.no_warning && */!options.allow_missing
			// 其他 .prop 本来就不会有内容。
			&& get_content;

			for ( var pageid in pages) {
				var page_data = pages[pageid];
				if (!wiki_API.content_of.has_content(page_data)) {

					if (continue_id && continue_id === page_data.pageid) {
						// 找到了 page_list.continue 所指之 index。
						// effect length
						page_list.OK_length = page_list.length;
						// 当过了 continue_id 之后，表示已经被截断，则不再警告。
						need_warn = false;
					}

					if (need_warn) {
						/**
						 * <code>
						{"title":"","invalidreason":"The requested page title is empty or contains only the name of a namespace.","invalid":""}
						</code>
						 */
						// console.trace(page_data);
						library_namespace.warn([ 'wiki_API_page: ', {
							T : [ 'invalid' in page_data
							// gettext_config:{"id":"invalid-title-$1"}
							? 'Invalid title: %1'
							// 此页面不存在/已删除。Page does not exist. Deleted?
							: 'missing' in page_data
							// gettext_config:{"id":"does-not-exist"}
							? 'Does not exist: %1'
							// gettext_config:{"id":"no-content"}
							: 'No content: %1',
							//
							(page_data.title
							//
							? wiki_API.title_link_of(page_data)
							//
							: 'id ' + page_data.pageid)
							//
							+ (page_data.invalidreason
							//
							? '. ' + page_data.invalidreason : '') ]
						} ]);
					}

				} else if (page_cache_prefix) {
					library_namespace.write_file(page_cache_prefix
					//
					+ page_data.title + '.json',
					/**
					 * 写入cache。
					 * 
					 * 2016/10/28 21:44:8 Node.js v7.0.0 <code>
					DeprecationWarning: Calling an asynchronous function without callback is deprecated.
					</code>
					 */
					JSON.stringify(pages), wiki_API.encoding, function() {
						// 因为此动作一般说来不会影响到后续操作，因此采用同时执行。
						library_namespace.debug(
						// gettext_config:{"id":"the-cache-file-is-saved"}
						'The cache file is saved.', 1, 'wiki_API_page');
					});
				}

				if (redirect_from && redirect_from[page_data.title]
				//
				&& !page_data.redirect_loop) {
					page_data.original_title = page_data.redirect_from
					// .from_title, .redirect_from_title
					= redirect_from[page_data.title];
					// e.g., "研究生教育" redirects to → "学士后"
					// redirects to → "深造文凭"
					while (redirect_from[page_data.original_title]) {
						page_data.original_title
						//
						= redirect_from[page_data.original_title];
					}
				}
				// 可以利用 page_data.convert_from
				// 来判别标题是否已经过繁简转换与 "_" → " " 转换。
				if (convert_from) {
					if (convert_from[page_data.title]) {
						page_data.convert_from
						// .from_title, .convert_from_title
						= convert_from[page_data.title];
						// 注意: 这边 page_data.original_title
						// 可能已设定为 redirect_from[page_data.title]
						if (!page_data.original_title
						// 通常 wiki 中，redirect_from 会比 convert_from 晚处理，
						// 照理来说不应该会到 !convert_from[page_data.original_title] 这边，
						// 致使重设 `page_data.original_title`？
						|| !convert_from[page_data.original_title]) {
							page_data.original_title = page_data.convert_from;
						}
					}
					// e.g., "人民法院_(消歧义)" converted → "人民法院 (消歧义)"
					// converted → "人民法院 (消歧义)" redirects → "人民法院"
					while (convert_from[page_data.original_title]) {
						page_data.original_title
						// .from_title, .convert_from_title
						= convert_from[page_data.original_title];
					}
				}
				index_of_title[page_data.title] = page_list.length;
				page_list.push(page_data);
			}

			if (data.warnings && data.warnings.query
			//
			&& typeof data.warnings.query['*'] === 'string') {
				if (need_warn) {
					library_namespace.warn(
					//
					'wiki_API_page: ' + data.warnings.query['*']);
					// console.log(data);
				}
				/**
				 * 2016/6/27 22:23:25 修正: 处理当非 bot 索求过多页面时之回传。<br />
				 * e.g., <code>
				 * { batchcomplete: '', warnings: { query: { '*': 'Too many values supplied for parameter \'pageids\': the limit is 50' } },
				 * query: { pages: { '0000': [Object],... '0000': [Object] } } }
				 * </code>
				 */
				if (data.warnings.query['*'].includes('the limit is ')) {
					// TODO: 注记此时真正取得之页面数。
					// page_list.OK_length = page_list.length;
					page_list.truncated = true;
				}
			}

			// options.multi: 明确指定即使只取得单页面，依旧回传 Array。
			if (!options.multi) {
				if (page_list.length <= 1) {
					// e.g., pages: { '1850031': [Object] }
					library_namespace.debug('只取得单页面 '
					//
					+ wiki_API.title_link_of(page_list)
					//
					+ '，将回传此页面内容，而非 Array。', 2, 'wiki_API_page');
					page_list = page_list[0];
					if (is_api_and_title(title, true)) {
						title = title[1];
					}
					if (!options.do_not_import_original_page_data
					//
					&& wiki_API.is_page_data(title)) {
						// 去除掉可能造成误判的错误标记 'missing'。
						// 即使真有错误，也由page_list提供即可。
						if ('missing' in title) {
							delete title.missing;
							// 去掉该由page_list提供的资料。因为下次呼叫时可能会被利用到。例如之前找不到页面，.pageid被设成-1，下次呼叫被利用到就会出问题。
							// ** 照理说这两者都必定会出现在page_list。
							// delete title.pageid;
							// delete title.title;
						}
						// import data to original page_data. 尽可能多保留资讯。
						page_list = Object.assign(title, page_list);
					}
					if (page_list && get_content
					//
					&& (page_list.is_Flow = wiki_API.Flow.is_Flow(page_list))
					// e.g., { flow_view : 'header' }
					&& options.flow_view) {
						// Flow_page()
						wiki_API.Flow.page(page_list, callback, options);
						return;
					}

				} else {
					library_namespace.debug('Get ' + page_list.length
					//
					+ ' page(s)! The pages will all '
					//
					+ 'passed to the callback as Array!', 2, 'wiki_API_page');
				}

			} else if ((options.multi === KEY_KEEP_INDEX
			// options.keep_order
			|| options.multi === KEY_KEEP_ORDER)
			//
			&& is_api_and_title(title, true)
			//
			&& Array.isArray(title[1]) && title[1].length >= 2) {
				var order_hash = title[1].map(function(page_data) {
					return options.is_id ? page_data.pageid
					//
					|| page_data : wiki_API.title_of(page_data);
				}).to_hash(), ordered_list = [];
				// console.log(title[1].join('|'));
				// console.log(order_hash);

				if (false) {
					// another method
					// re-sort page list
					page_list.sort(function(page_data_1, page_data_2) {
						return order_hash[page_data_1.original_title
						//
						|| page_data_1.title]
						//
						- order_hash[page_data_2.original_title
						//
						|| page_data_2.title];
					});
					console.log(page_list.map(function(page_data) {
						return page_data.original_title
						//
						|| page_data.title;
					}).join('|'));
					throw new Error('Reorder the list of pages');
				}

				// 维持页面的顺序与输入的相同。
				page_list.forEach(function(page_data) {
					var original_title = page_data.original_title
					//
					|| page_data.title;
					if (original_title in order_hash) {
						ordered_list[order_hash[original_title]] = page_data;
					} else {
						console.log(order_hash);
						console.log(original_title);
						console.log('-'.repeat(70));
						console.log('Page list:');
						console.log(title[1].map(function(page_data) {
							return wiki_API.title_of(page_data);
						}).join('\n'));
						console.log(page_data);
						throw new Error('wiki_API_page: 取得了未指定的页面: '
						//
						+ wiki_API.title_link_of(original_title));
					}
				});
				// 紧凑化，去掉没有设定到的页面。
				if (options.multi === KEY_KEEP_ORDER) {
					ordered_list = ordered_list.filter(function(page_data) {
						return !!page_data;
					});
				}

				// copy attributes form original page_list
				[ 'OK_length', 'truncated', 'normalized', 'index_of_title',
				//
				'redirects', 'redirect_from', 'converted', 'convert_from' ]
				// 需要注意page_list可能带有一些已经设定的属性值，因此不能够简单的直接指派到另外一个值。
				.forEach(function(attribute_name) {
					if (attribute_name in page_list) {
						ordered_list[attribute_name]
						//
						= page_list[attribute_name];
					}
				});
				page_list = ordered_list;
			}

			if (options.save_response) {
				// 附带原始回传查询资料。
				// save_data, query_data
				// assert: !('response' in page_list)
				page_list.response = data;
			}

			if (options.expandtemplates) {
				if (options.titles_left)
					throw new Error('There are options.titles_left!');

				// 需要expandtemplates的情况。
				if (!Array.isArray(page_list)) {
					// TODO: test
					var revision = wiki_API.content_of.revision(page_list);
					// 出错时 revision 可能等于 undefined。
					if (!revision) {
						callback(page_list);
						return;
					}
					wiki_API_expandtemplates(
					//
					wiki_API.revision_content(revision), function() {
						callback(page_list);
					}, Object.assign({
						page : page_list,
						title : page_data.title,
						revid : revision.revid,
						includecomments : options.includecomments,

						session : options[KEY_SESSION]
					}, options.expandtemplates));
					return;
				}

				// TODO: test
				page_list.run_serial(function(run_next, page_data, index) {
					var revision = wiki_API.content_of.revision(page_data);
					wiki_API_expandtemplates(
					//
					wiki_API.revision_content(revision),
					//
					run_next, Object.assign({
						page : page_data,
						title : page_data.title,
						revid : revision && revision.revid,
						includecomments : options.includecomments,

						session : options[KEY_SESSION]
					}, options.expandtemplates));
				}, function() {
					callback(page_list);
				});
				return;
			}

			if (options.titles_left) {
				if (options.titles_buffer) {
					options.titles_buffer.append(page_list);
					page_list.truncate();
					library_namespace.error(
					//
					'wiki_API_page: Lost properties: '
					//
					+ Object.keys(page_list).join(', '));
				} else {
					options.titles_buffer = page_list;
				}
				if (false) {
					console.trace('get next page slices ('
					//
					+ options.slice_size + '): ' + options.titles_left);
				}
				wiki_API_page(null, callback, options);
				return;
			}

			// 一般正常回传。

			if (false && page_list && page_list.title) {
				console.trace('Get page and callback: ' + page_list.title);
			}
			if (options.titles_buffer)
				page_list = options.titles_buffer.append(page_list);
			page_list.revisions_parameters = action[1];
			// console.trace(page_list);
			// console.trace(options);

			// page 之 structure 将按照 wiki API 本身之 return！
			// page_data = {pageid,ns,title,revisions:[{timestamp,'*'}]}
			callback(page_list);

		}, post_data, options);
	}

	// default properties of revisions
	// ids, timestamp 是为了 wiki_API_edit.set_stamp 检查编辑冲突用。
	wiki_API_page.default_rvprop = 'ids|timestamp|content';

	// @see https://www.mediawiki.org/w/api.php?action=help&modules=query
	wiki_API_page.auto_converttitles = 'zh,gan,iu,kk,ku,shi,sr,tg,uz'
			.split(',');

	// ------------------------------------------------------------------------

	/**
	 * 回溯看看是哪个 revision 增加/删除了标的文字。
	 * 
	 * @param {String}title
	 *            page title
	 * @param to_search
	 *            filter / text to search.<br />
	 *            to_search(diff, revision, old_revision):<br />
	 *            `diff` 为从旧的版本 `old_revision` 改成 `revision` 时的差异。
	 * @param {Function}callback
	 *            回调函数。
	 * @param {Object}[options]
	 *            附加参数/设定选择性/特殊功能与选项
	 */
	function tracking_revisions(title, to_search, callback, options) {
		options = Object.assign({
			rvlimit : 20
		}, options, {
			save_response : true
		});

		if (options.search_diff && typeof to_search !== 'function') {
			throw new TypeError(
					'Only {Function}filter to search for .search_diff=true!');
		}

		function do_search(revision, old_revision) {
			var value = revision.revid ? wiki_API.revision_content(revision)
					: revision;

			if (!value)
				return;

			if (typeof to_search === 'string')
				return value.includes(to_search);

			if (options.search_diff)
				return to_search([ , value ], revision, old_revision);

			// return found;
			return library_namespace.fit_filter(to_search, value);
		}

		var newer_revision, revision_count = 0;
		function search_revisions(page_data, error) {
			if (error) {
				callback(null, page_data, error);
				return;
			}

			var revision_index = 0, revisions = page_data.revisions;
			if (!newer_revision && revisions.length > 0) {
				newer_revision = revisions[revision_index++];
				newer_revision.lines = wiki_API
						.revision_content(newer_revision).split('\n');
				// console.trace([do_search(newer_revision),options]);
				if (!options.search_diff && !options.search_deleted) {
					var result = do_search(newer_revision);
					if (!result) {
						// 最新版本就已经不符合需求。
						callback(null, page_data);
						return;
					}
					if (library_namespace.is_thenable(result)) {
						result.then(function(result) {
							if (!result) {
								// 最新版本就已经不符合需求。
								callback(null, page_data);
								return;
							}
							search_next_revision();
						});
						return;
					}
				}
			}

			// console.log(revisions.length);
			search_next_revision();

			function search_next_revision() {
				// console.trace(revision_index + '/' + revisions.length);
				if (revision_index === revisions.length) {
					finish_search();
					return;
				}

				var this_revision = revisions[revision_index++];
				// MediaWiki using line-diff
				this_revision.lines = wiki_API.revision_content(this_revision)
						.split('\n');
				var diff_list;
				try {
					diff_list = newer_revision.diff_list
					//
					= library_namespace.LCS(this_revision.lines,
					//
					newer_revision.lines, {
						diff : true,
						// MediaWiki using line-diff
						line : true,
						treat_as_String : true
					});
				} catch (e) {
					// e.g., RangeError: Maximum call stack size exceeded @
					// backtrack()
					callback(null, page_data, e);
					return;
				}

				var found, diff_index = 0;

				search_next_diff();

				function search_next_diff() {
					// console.trace(diff_index + '/' + diff_list.length);
					var result = undefined;
					if (diff_index === diff_list.length) {
						if (options.revision_post_processor) {
							result = options
									.revision_post_processor(newer_revision);
						}
						if (library_namespace.is_thenable(result)) {
							result.then(finish_search_revision);
						} else {
							finish_search_revision();
						}
						// console.trace(result);
						// var session = wiki_API.session_of_options(options);
						// console.trace(session);
						// console.trace(session && session.actions);
						return;
					}

					var diff = diff_list[diff_index++];
					// console.trace(diff);
					if (options.search_diff) {
						result = to_search(diff, newer_revision, this_revision);
					} else {
						// var removed_text = diff[0], added_text = diff[1];
						result =
						// 警告：在 line_mode，"A \n"→"A\n" 的情况下，
						// "A" 会同时出现在增加与删除的项目中，此时必须自行检测排除。
						do_search(diff[options.search_deleted ? 0 : 1])
						//
						&& !do_search(diff[options.search_deleted ? 1 : 0]);
					}

					// console.trace(library_namespace.is_thenable(result));
					if (library_namespace.is_thenable(result)) {
						result.then(search_next_diff);
					} else {
						search_next_diff();
					}
				}

				function finish_search_revision(page_data, error) {
					delete newer_revision.lines;
					// console.trace([this_revision.revid,found,do_search(this_revision)])
					if (found) {
						delete this_revision.lines;
						// console.log(diff_list);
						callback(newer_revision, page_data);
						return;
					}
					newer_revision = this_revision;

					if (revision_index === revisions.length) {
						delete this_revision.lines;
					}
					search_next_revision();
				}
			}

			function finish_search() {
				revision_count += page_data.revisions;
				if (revision_count > options.limit) {
					// not found
					callback(null, page_data);
					return;
				}

				// console.trace(page_data.response);
				// console.trace(page_data.response['continue']);
				var rvcontinue = page_data.response['continue'];
				if (rvcontinue) {
					options.rvcontinue = rvcontinue.rvcontinue;

					// console.trace(options);
					library_namespace.debug('tracking_revisions: search next '
							+ options.rvlimit
							+ (options.limit > 0 ? '/' + options.limit : '')
							+ ' revisions...', 2);
					get_pages();
					return;
				}

				// assert: 'batchcomplete' in page_data.response

				// if no .rvcontinue, append a null revision,
				// and do not search continued revisions.
				var result = !options.search_deleted
						&& do_search(newer_revision);
				if (library_namespace.is_thenable(result)) {
					result.then(do_callback);
				} else {
					do_callback(result);
				}

				function do_callback(result) {
					if (result) {
						callback(newer_revision, page_data);
					} else {
						// not found
						callback(null, page_data);
					}
				}
			}

		}

		function get_pages() {
			wiki_API.page(title, search_revisions, options);
		}

		get_pages();
	}

	wiki_API.tracking_revisions = tracking_revisions;

	// ------------------------------------------------------------------------

	// 强制更新快取/清除缓存并重新载入/重新整理/刷新页面。
	// @see https://www.mediawiki.org/w/api.php?action=help&modules=purge
	// 极端做法：[[WP:NULL|Null edit]], re-edit the same contents
	wiki_API.purge = function(title, callback, options) {
		var action = normalize_title_parameter(title, options);
		if (!action) {
			throw new Error('wiki_API.purge: '
			// gettext_config:{"id":"invalid-title-$1"}
			+ gettext('Invalid title: %1', wiki_API.title_link_of(title)));
		}

		// POST_parameters
		var post_data = action[1];
		action[1] = {
			// forcelinkupdate : 1,
			// forcerecursivelinkupdate : 1,
			action : 'purge'
		};

		wiki_API.query(action, typeof callback === 'function'
		//
		&& function(data, error) {
			// copy from wiki_API.redirects_here()

			if (wiki_API.query.handle_error(data, error, callback)) {
				return;
			}

			// data:
			// {"batchcomplete":"","purge":[{"ns":0,"title":"Title","purged":""}]}

			if (!data || !data.purge) {
				library_namespace.warn([ 'wiki_API_purge: ', {
					// gettext_config:{"id":"unknown-api-response-$1"}
					T : [ 'Unknown API response: %1', (typeof data === 'object'
					//
					&& typeof JSON !== 'undefined'
					//
					? JSON.stringify(data) : data) ]
				} ]);
				if (library_namespace.is_debug()
				// .show_value() @ interact.DOM, application.debug
				&& library_namespace.show_value)
					library_namespace.show_value(data);
				callback(undefined, data);
				return;
			}

			var page_data_list = data.purge;
			// page_data_list: e.g., [{ns:4,title:'Meta:Sandbox',purged:''}]
			if (page_data_list.length < 2 && (!options || !options.multi)) {
				// 没有特别设定的时候，回传与输入的形式相同。输入单页则回传单页。
				page_data_list = page_data_list[0];
			}

			// callback(page_data) or callback({Array}page_data_list)
			callback(page_data_list);
		}, post_data, options);
	};

	// ------------------------------------------------------------------------

	/**
	 * 取得页面之重定向资料（重新导向至哪一页）。
	 * 
	 * 注意: 重定向仅代表一种强烈的关联性，而不表示从属关系(对于定向到章节的情况)或者等价关系。
	 * 例如我们可能将[[有罪推定]]定向至[[无罪推定]]，然而双方是完全相反的关系。
	 * 只因为[[无罪推定]]是一种比较值得关注的特性，而[[有罪推定]]没有特殊的性质(common)。因此我们只谈[[无罪推定]]，不会特别拿[[有罪推定]]出来谈。
	 * 
	 * TODO:
	 * https://www.mediawiki.org/w/api.php?action=help&modules=searchtranslations
	 * 
	 * @example <code>

	CeL.wiki.redirect_to('史记', function(redirect_data, page_data) {
		CeL.show_value(redirect_data);
	});

	 </code>
	 * 
	 * @param {String|Array}title
	 *            title or [ {String}API_URL, {String}title or {Object}page_data ]
	 * @param {Function}[callback]
	 *            回调函数。 callback({String}title that redirects to or {Object}with
	 *            redirects to what section, {Object}page_data, error)
	 * @param {Object}[options]
	 *            附加参数/设定选择性/特殊功能与选项
	 * 
	 * @see https://www.mediawiki.org/w/api.php?action=help&modules=query%2Brevisions
	 */
	wiki_API.redirect_to = function(title, callback, options) {
		wiki_API.page(title, function(page_data, error) {
			if (error || !wiki_API.content_of.page_exists(page_data)) {
				// error? 此页面不存在/已删除。
				callback(undefined, page_data, error);
				return;
			}

			// e.g., [ { from: 'AA', to: 'A', tofragment: 'aa' } ]
			// e.g., [ { from: 'AA', to: 'A', tofragment: '.AA.BB.CC' } ]
			var redirect_data = page_data.response.query.redirects;
			if (redirect_data) {
				if (redirect_data.length !== 1) {
					// 可能是多重重定向？
					// e.g., A→B→C
					library_namespace.warn('wiki_API.redirect_to: ' + 'Get '
							+ redirect_data.length + ' redirects for ['
							// title.join(':')
							+ title + ']!');
					library_namespace.warn(redirect_data);
				}
				// 仅取用并回传第一笔资料。
				redirect_data = redirect_data[0];
				// assert: redirect_data && redirect_data.to === page_data.title

				// test if is #REDIRECT [[title#section]]
				if (redirect_data.tofragment) {
					try {
						redirect_data.to_link = redirect_data.to + '#'
						// 须注意: 对某些 section 可能 throw！
						+ decodeURIComponent(redirect_data.tofragment
						//
						.replace(/\./g, '%'));
					} catch (e) {
						redirect_data.to_link = redirect_data.to + '#'
						//
						+ redirect_data.tofragment;
					}
					library_namespace.debug(wiki_API.title_link_of(title)
					// →
					+ ' redirected to section [[' + redirect_data.to + '#'
							+ redirect_data.tofragment + ']]!', 1,
							'wiki_API.redirect_to');
					callback(redirect_data, page_data);
					return;
				}

			}

			// page_data.title is normalized title.
			callback(page_data.title, page_data);

		}, Object.assign({
			// 输入 prop:'' 或再加上 redirects:1 可以仅仅确认页面是否存在，以及页面的正规化标题。
			prop : '',
			redirects : 1,
			// 处理繁简转换的情况: 有可能目标页面存在，只是繁简不一样。
			// TODO: 地区词处理。
			converttitles : 1,
			// Only works if the wiki's content language supports variant
			// conversion. en, crh, gan, iu, kk, ku, shi, sr, tg, uz and zh.
			// converttitles : 1,
			save_response : true
		}, options));
	};

	// ------------------------------------------------------------------------

	// TODO: html to wikitext
	// https://zh.wikipedia.org/w/api.php?action=help&modules=flow-parsoid-utils

	/**
	 * 展开 template 内容
	 * 
	 * 这种方法不能展开 module
	 * 
	 * @example <code>

	wiki.page(title, function(page_data) {
		console.log(CeL.wiki.content_of(page_data, 'expandtemplates'));
	}, {
		expandtemplates : true
	});

	 </code>
	 * 
	 * @see wiki_API.protect
	 */
	function wiki_API_expandtemplates(wikitext, callback, options) {
		var post_data = {
			text : wikitext,
			prop : 'wikitext'
		};

		options = library_namespace.new_options(options);

		for ( var parameter in wiki_API_expandtemplates.parameters) {
			if (parameter in options) {
				if (options[parameter] || options[parameter] === 0)
					post_data[parameter] = options[parameter];
			}
		}

		wiki_API.query({
			action : 'expandtemplates'
		}, function(data, error) {
			if (wiki_API.query.handle_error(data, error, callback)) {
				return;
			}

			if (options.page) {
				// use page_data.expandtemplates.wikitext
				Object.assign(options.page, data);
			}

			typeof callback === 'function'
			//
			&& callback(data.expandtemplates);

		}, post_data, options);
	}

	wiki_API_expandtemplates.parameters = {
		title : undefined,
		// text : wikitext,
		revid : undefined,
		prop : undefined,
		includecomments : undefined,

		templatesandboxprefix : undefined,
		templatesandboxtitle : undefined,
		templatesandboxtext : undefined,
		templatesandboxcontentmodel : undefined,
		templatesandboxcontentformat : undefined
	};

	wiki_API.expandtemplates = wiki_API_expandtemplates;

	// ------------------------------------------------------------------------

	// wiki_session.convert_languages()
	function get_language_variants(text, uselang, callback, options) {
		if (!text) {
			// String(test)
			callback(text === 0 ? '0' : '');
			return;
		}

		if (!uselang) {
			callback(text, new Error('get_language_variants: '
					+ 'No uselang specified!'));
			return;
		}

		if (wiki_API.need_get_API_parameters('parse', options,
				get_language_variants, arguments)) {
			return;
		}

		options = library_namespace.setup_options(options);

		var is_JSON;
		if (typeof text === 'object') {
			is_JSON = text;
			text = JSON.stringify(text);
		}

		// 作基本的 escape。不能用 encodeURIComponent()，这样会把中文也一同 escape 掉。
		// 多一层 encoding，避免 MediaWiki parser 解析 HTML。
		text = escape(text)
		// recover special characters (e.g., Chinese words) by unescape()
		.replace(/%u[\dA-F]{4}/g, unescape);
		// assert: 此时 text 不应包含任何可被 MediaWiki parser 解析的语法。

		// + {{int:Conversionname}}
		// assert: '!' === encodeURIComponent('!')
		text = '!' + text + '!';

		var post_data = {
			// https://zh.wikipedia.org/w/api.php?action=query&meta=siteinfo&siprop=languages&utf8=1
			contentmodel : 'wikitext',
			// 'zh-hans'
			uselang : uselang,
			// prop=text|links
			prop : 'text',
			text : text
		};

		var session = wiki_API.session_of_options(options);

		// 由于用 [[link]] 也不会自动 redirect，因此直接转换即可。
		wiki_API.query([
				session && session.API_URL
						|| wiki_API.api_URL(uselang.replace(/\-.*$/, '')),
				// https://www.mediawiki.org/w/api.php?action=help&modules=parse
				{
					action : 'parse'
				} ], function(data, error) {
			if (error || !data) {
				callback(undefined, error);
				return;
			}
			data = data.parse;
			try {
				// 罕见情况下，有可能 data === dundefined
				data = data.text['*']
				// 去掉 MediaWiki parser 解析器所自行添加的 token 与注解。
				.replace(/<!--[\s\S]*?-->/g, '')
				// 去掉前后包覆。 e.g., <p> or <pre>
				.replace(/![^!]*$/, '').replace(/^[^!]*!/, '');

				// recover special characters
				data = unescape(data);
				if (is_JSON) {
					data = JSON.parse(data);
					if (Array.isArray(is_JSON)
							&& is_JSON.length !== data.length) {
						throw new Error(
						//
						'wiki_API.convert_Chinese: fault on {Array}: '
								+ is_JSON.length + ' !== ' + data.length);
					}
				}
			} catch (e) {
				callback(text, e);
				return;
			}
			callback(data);
		}, post_data);
	}

	if (false) {
		CeL.wiki.convert_Chinese('中国', function(converted_text) {
			converted_text === "中国";
		});

		CeL.wiki.convert_Chinese([ '繁体', '简体' ], function(converted_hans) {
			converted_hans[0] === "繁体";
		}, {
			uselang : 'zh-hans'
		});
	}

	// wiki API 繁简转换
	wiki_API.convert_Chinese = function convert_Chinese(text, callback, options) {
		var uselang = typeof options === 'string' ? options : options
				&& options.uselang;

		get_language_variants(text, uselang || 'zh-hant', callback, options);
	};

	// ------------------------------------------------------------------------

	/**
	 * 检查页面是否被保护。
	 * 
	 * 采用如:
	 * 
	 * @example <code>

	wiki.page(title, function(page_data) {
		console.log(CeL.wiki.is_protected(page_data));
	}, {
		prop : 'revisions|info',
		// rvprop : 'ids|timestamp',
		// https://www.mediawiki.org/w/api.php?action=help&modules=query%2Binfo
		// https://www.mediawiki.org/wiki/API:Info#inprop.3Dprotection
		additional_query : 'inprop=protection'
	});

	 </code>
	 * 
	 * @see wiki_API.protect
	 */
	wiki_API.is_protected = function has_protection(page_data) {
		var protection_list = page_data.protection || page_data;
		if (!Array.isArray(protection_list)) {
			return;
		}

		// https://www.mediawiki.org/w/api.php?action=help&modules=query%2Binfo
		// https://www.mediawiki.org/wiki/API:Info#inprop.3Dprotection
		return protection_list.some(function(protection) {
			return protection.type === 'edit' && protection.level === 'sysop';
		});
	};

	// ================================================================================================================
	// 监视最近更改的页面。

	function get_recent_via_API(callback, options) {
		var session = wiki_API.session_of_options(options);
		if (!session) {
			// 先设定一个以方便操作。
			session = new wiki_API(null, null, options.language
					|| wiki_API.language);
		}
		// use get_list()
		// 注意: arguments 与 get_list() 之 callback 连动。
		session.recentchanges(callback, options);
	}

	// 一定会提供的功能。
	wiki_API.recent_via_API = get_recent_via_API;
	// 预防已经被设定成 `get_recent_via_databases` @ CeL.application.net.wiki.Toolforge。
	if (!wiki_API.recent) {
		// 可能会因环境而不同的功能。让 wiki_API.recent 采用较有效率的实现方式。
		wiki_API.recent =
		// wiki_API.SQL.config ? get_recent_via_databases :
		get_recent_via_API;
	}

	// ----------------------------------------------------

	// Listen to page modification. 监视最近更改的页面。
	// 注意: 会改变 options！
	// 注意: options之属性名不可与 wiki_API.recent 冲突！
	// 警告: 同时间只能有一只程式在跑，否则可能会造成混乱！
	function add_listener(listener, options) {
		if (!options) {
			options = Object.create(null);
		} else if (typeof options === 'number' && options > 0) {
			// typeof options === 'number': 避免
			// TypeError: Cannot convert object to primitive value
			// TypeError: Cannot convert a Symbol value to a number
			options = {
				interval : options
			};
		} else if (typeof options === 'string'
		//
		|| library_namespace.is_RegExp(options)) {
			options = {
				// language : '',
				// title_filter
				title : options
			};
		}

		if (isNaN(options.max_page) || options.max_page >= 1) {
			// normal
		} else {
			throw new Error(
					'add_listener: '
							+ 'assert: isNaN(options.max_page) || options.max_page >= 1');
		}

		if (!(options.limit > 0)) {
			// https://www.mediawiki.org/w/api.php?action=help&modules=query%2Brevisions
			options.rvlimit = 'max';
		}

		var session = wiki_API.session_of_options(options),
		// @see .SQL_config
		where = options.SQL_options
		//
		|| (options.SQL_options = Object.create(null));
		where = where.where || (where.where = Object.create(null));
		// console.log(session);

		if (!session
		//
		&& (options.with_diff || options.with_content)) {
			// 先设定一个以方便操作。
			session = new wiki_API(null, null, options.language
					|| wiki_API.language);
		}

		// console.log(options);
		// console.log(session);
		var recent_options, use_SQL = 'use_SQL' in session ? session.use_SQL
				: wiki_API.SQL && wiki_API.SQL.config;
		if (!use_SQL) {
			;
		} else if ('use_SQL' in options) {
			// options.use_SQL: Try to use SQL. Use SQL as possibile.
			use_SQL = options.use_SQL;
		} else if (typeof options.parameters === 'object') {
			// auto-detect
			use_SQL = Object.keys(options.parameters).filter(function(item) {
				// 只设定了 rcprop: SQL 将会取得所有资讯，仅设定此条件时采用 SQL 不会影响效果。
				return item && item !== 'rcprop';
			}).length === 0;
		}

		var get_recent = use_SQL ? wiki_API.recent : wiki_API.recent_via_API,
		// 仅取得最新文件版本。注意: 这可能跳过中间编辑的版本，造成有些修订被忽略。
		latest_only = 'latest' in options ? options.latest : true;
		if (use_SQL) {
			// console.log(options);
			recent_options = Object.clone(options.SQL_options);
			if (options[KEY_SESSION]) {
				// pass API config to get_recent()
				recent_options[KEY_SESSION] = options[KEY_SESSION];
			}
		} else {
			recent_options = Object.clone(options);
			if (!recent_options.parameters)
				recent_options.parameters = Object.create(null);
			if (recent_options.rcprop) {
				if (!recent_options.parameters.rcprop)
					recent_options.parameters.rcprop = recent_options.rcprop;
				delete recent_options.rcprop;
			}
			// console.log(recent_options);
			// https://www.mediawiki.org/w/api.php?action=help&modules=query%2Brecentchanges
			recent_options.parameters = Object.assign({
				// 尽可能多取一点以减少查询次数。
				rclimit : 'max'
			}, recent_options.parameters, {
				// 这些必须强制设定，否则演算法会出问题。

				// List newest first (default).
				// Note: rcstart has to be later than rcend.
				// rcdir : 'older',
				rcdir : 'newer',

				// new Date().toISOString()
				// rcstart : 'now',
				rctype : 'edit|new'
			});
			if (latest_only) {
				recent_options.parameters.rctoponly = 1;
			}
			if (recent_options.parameters.rcprop
			// 为了之后设定 last_query_time，因此必须要加上 timestamp 这一项 information。
			&& !recent_options.parameters.rcprop.includes('timestamp')) {
				if (Array.isArray(recent_options.parameters.rcprop)) {
					recent_options.parameters.rcprop.push('timestamp');
				} else if (typeof recent_options.parameters.rcprop === 'string') {
					recent_options.parameters.rcprop += '|timestamp';
				} else {
					throw new Error('Unkonwn rcprop: '
							+ recent_options.parameters.rcprop);
				}
			}
		}

		var namespace = wiki_API.namespace(options.namespace);
		if (namespace !== undefined) {
			// 不指定 namespace，或者指定 namespace 为 ((undefined)): 取得所有的 namespace。
			if (use_SQL) {
				recent_options.namespace = namespace;
			} else {
				recent_options.parameters.rcnamespace = namespace;
			}
		}

		if (options.type) {
			if (use_SQL) {
				recent_options.type = options.type;
			} else {
				recent_options.parameters.rctype = options.type;
			}
			// TODO: other options
		}

		if (options.with_diff && !options.with_diff.diff
				&& !options.with_diff.with_diff) {
			// options to LCS() diff
			if (options.with_diff === true) {
				options.with_diff = {
					LCS : true,

					// line : false,
					// index : 2,
					// with_list : true

					// MediaWiki using line-diff
					line : true
				};
			}
			options.with_diff.diff = true;
		}

		// 注意:
		// {String|Natural}options.start, options.delay:
		// 将会用 CeL.date.to_millisecond() 来解析。
		// 推荐用像是 "2days", "3min", "2d", "3m" 这样子的方法来表现。
		//
		// {Date}options.start: 从这个时间点开始回溯。
		// {Natural}options.start: 回溯 millisecond 数。
		// {Natural}options.delay > 0: 检查的延迟时间。等待 millisecond 数。

		var delay_ms = library_namespace.to_millisecond(options.delay),
		//
		interval = library_namespace.to_millisecond(options.interval) || 500,
		// assert: {Date}last_query_time start time
		last_query_time,
		// TODO: 仅仅采用 last_query_revid 做控制，不需要侦测是否有重复。 latest_revid
		last_query_revid = options.revid | 0;

		// @see function adapt_task_configurations() @ wiki.js
		if (!options.configuration_adapter) {
			// 采用预设的 configuration_adapter。
			options.configuration_adapter = session.task_configuration
					&& session.task_configuration.configuration_adapter;
		}
		// {String}设定页面。 注意: 必须是已经转换过、正规化后的最终页面标题。
		var configuration_page_title = typeof options.configuration_adapter === 'function'
				&& wiki_API.normalize_title(options.configuration_page)
				|| session.task_configuration
				&& session.task_configuration.configuration_page_title;
		/** {Number}延迟 adapt 设定的时间: 预设为过5分钟才 adapt configuration */
		var delay_time_to_adapt_task_configurations = 'delay_time_to_adapt_task_configurations' in options ? options.delay_time_to_adapt_task_configurations
				: session.delay_time_to_adapt_task_configurations;

		if (!(delay_ms > 0))
			delay_ms = 0;

		if (options.delay && !('start' in options)) {
			// e.g., 指定延迟两分钟时，就直接检查两分钟前开始的资料。
			options.start = options.delay;
		}

		if (library_namespace.is_Date(options.start)) {
			last_query_time = isNaN(options.start.getTime()) ? new Date
					: options.start;
		} else if (options.start
				&& !isNaN(last_query_time = Date.parse(options.start))) {
			last_query_time = new Date(last_query_time);
		} else if ((last_query_time = library_namespace
				.to_millisecond(options.start)) > 0) {
			// treat as time back to 回溯这么多时间。
			if (last_query_time > library_namespace.to_millisecond('31d')) {
				library_namespace.info([ 'add_listener: ', {
					// gettext_config:{"id":"wikimedia-wikis-can-be-backtracked-up-to-about-$1"}
					T : [ 'Wikimedia wikis 最多可回溯约 %1。',
					// @see https://www.mediawiki.org/wiki/Manual:$wgRCMaxAge
					library_namespace.age_of(
					// 在 2017 CE 最多可回溯约 30天。
					library_namespace.to_millisecond('30D'), {
						max_unit : 'day'
					}) ]
				}, {
					// gettext_config:{"id":"the-period-you-specified-$1-($2)-may-be-too-long"}
					T : [ '您所指定的时间 [%1]（%2）恐怕过长。', options.start,
					//
					library_namespace.age_of(last_query_time, {
						max_unit : 'day'
					}) ]
				} ]);
			}
			last_query_time = new Date(Date.now() - last_query_time);
		} else {
			// default: search from NOW
			last_query_time = new Date;
		}

		library_namespace.info([ 'add_listener: ', {
			T : [ Date.now() - last_query_time > 100
			// gettext_config:{"id":"start-monitoring-and-scanning-$2-pages-changed-since-$3-using-$1"}
			? '开始以 %1 监视、扫描 %2 自 %3 起更改的页面。'
			// gettext_config:{"id":"start-monitoring-and-scanning-the-recently-changed-pages-of-$2-using-$1"}
			: '开始以 %1 监视、扫描 %2 最近更改的页面。', use_SQL ? 'SQL' : 'API',
			//
			session ? wiki_API.site_name(session) : wiki_API.language,
			//
			library_namespace.indicate_date_time(last_query_time, {
				base_date : Date.now()
			}) ]
		} ]);

		if (configuration_page_title) {
			library_namespace.info([ 'add_listener: ', {
				// gettext_config:{"id":"configuration-page-$1"}
				T : [ 'Configuration page: %1',
				//
				wiki_API.title_link_of(configuration_page_title) ]
			} ]);
		}

		if (false) {
			library_namespace.debug('recent_options: '
			// TypeError: Converting circular structure to JSON
			+ JSON.stringify(recent_options), 1, 'add_listener');
		}
		// console.trace(recent_options);

		// 取得页面资料。
		function receive() {

			function receive_next() {
				// 预防上一个任务还在执行的情况。
				// https://zh.moegirl.org.cn/index.php?limit=500&title=Special%3A%E7%94%A8%E6%88%B7%E8%B4%A1%E7%8C%AE&contribs=user&target=Cewbot&namespace=&tagfilter=&start=2019-08-12&end=2019-08-13
				if (next_task_id) {
					library_namespace
							.info('已经设定过下次任务。可能是上一个任务还在查询中，或者应该会 timeout？将会清除之前的任务，重新设定任务。');
					// for debug:
					console.log(next_task_id);
					clearTimeout(next_task_id);
				}

				var real_interval_ms = Date.now() - receive_time;
				library_namespace
						.debug('interval from latest receive() starts: '
								+ real_interval_ms + ' ms (' + Date.now()
								+ ' - ' + receive_time + ')', 3, 'receive_next');
				next_task_id = setTimeout(receive,
				// 减去已消耗时间，达到更准确的时间间隔控制。
				Math.max(interval - real_interval_ms, 0));
			}

			var next_task_id = undefined;
			// 上一次执行 receive() 的时间。
			var receive_time = Date.now();

			library_namespace.debug('Get recent change from '
					+ (library_namespace.is_Date(last_query_time)
							&& last_query_time.getTime() ? last_query_time
							.toISOString() : last_query_time)
					+ ', last_query_revid=' + last_query_revid, 1,
					'add_listener.receive');

			// 根据不同的实现方法采用不一样的因应方式。
			if (use_SQL) {
				if (!library_namespace.is_Date(last_query_time)) {
					// assert: !!(last_query_time)
					// 可能来自"设定成已经取得的最新一个编辑rev。"
					last_query_time = new Date(last_query_time);
				}
				where.timestamp = '>=' + last_query_time
				// MediaWiki format
				.format('%4Y%2m%2d%2H%2M%2S');
				where.this_oldid = '>' + last_query_revid;
				if (delay_ms > 0) {
					where[''] = 'rc_timestamp<='
					// 截止期限。
					+ new Date(Date.now() - delay_ms)
					// MediaWiki format
					.format('%4Y%2m%2d%2H%2M%2S');
				}
			} else {
				// rcend
				recent_options.parameters.rcstart = library_namespace
						.is_Date(last_query_time) ? last_query_time
						.toISOString() : last_query_time;
				if (false) {
					console.log('set rcstart: '
							+ recent_options.parameters.rcstart);
				}
				if (delay_ms > 0) {
					recent_options.parameters.rcend
					// 截止期限。
					= new Date(Date.now() - delay_ms).toISOString();
				}
			}

			get_recent(function process_rows(rows) {
				// console.trace(rows);
				if (!rows) {
					library_namespace.warn((new Date).toISOString()
							+ ': No rows get.');
					return;
				}

				if (false) {
					library_namespace.log(recent_options.parameters
							|| recent_options.SQL_options);
					console.log(rows);
				}

				// 去除之前已经处理过的页面。
				if (rows.length > 0) {
					// 判别新旧顺序。
					var has_new_to_old = rows.length > 1
					// 2019/9/12: 可能有乱序。
					&& rows.some(function(row, index) {
						return index > 0 && rows[index - 1].revid > row.revid;
					});
					if (has_new_to_old) {
						// e.g., use SQL
						library_namespace.debug('判别新旧顺序: 有新到旧或乱序: Get '
								+ rows.length + ' recent pages:\n'
								+ rows.map(function(row) {
									return row.revid;
								}), 2, 'add_listener');
						library_namespace.debug('把从新的排列到旧的或乱序转成从旧的排列到新的: '
								+ rows.map(function(row) {
									return row.revid;
								}), 1, 'add_listener');
						// 因可能有乱序，不能光以 .reverse() 转成 old to new。
						rows.sort(function(row_1, row_2) {
							return row_1.revid - row_2.revid;
						});
					}

					library_namespace.debug(
							'准备去除掉重复的纪录。之前已处理到 last_query_revid='
									+ last_query_revid + ', 本次取得 '
									+ rows.length + ' record(s). revid: '
									+ rows.map(function(row) {
										return row.revid;
									}), 3);
					// e.g., use API 常常会回传和上次有重叠的资料
					while (rows.length > 0
					// 去除掉重复的纪录。因为是从旧的排列到新的，因此从起头开始去除。
					&& rows[0].revid <= last_query_revid) {
						rows.shift();
					}

					if (rows.length > 0) {
						// assert: options.max_page >= 1
						if (rows.length > options.max_page) {
							// 直接截断，仅处理到 .max_page。
							rows.truncate(options.max_page);
						}

						// cache the lastest record
						last_query_time = rows.at(-1);
						// 纪录/标记本次处理到哪。
						// 注意：type=edit会增加revid，其他type似乎会沿用上一个revid。
						last_query_revid = last_query_time.revid;
						last_query_time = last_query_time.timestamp;
						// 确保 {Date}last_query_time
						// last_query_time = new Date(last_query_time);
					}

					// 预设全部都处理完，因此先登记。假如仅处理其中的一部分，届时再特别登记。
					library_namespace.debug('The lastest record: '
							+ JSON.stringify(last_query_time), 4);
				}
				library_namespace.debug('去除掉重复的纪录之后 last_query_revid='
				//
				+ last_query_revid + ', ' + rows.length + ' record(s) left.'
				//
				+ (rows.length > 0 ? ' revid: ' + rows.map(function(row) {
					return row.revid;
				}).join(', ') + '. title: ' + rows.map(function(row) {
					return row.title;
				}).join(', ') : ''), 1);
				library_namespace.log_temporary('add_listener: '
						+ last_query_time + ' ('
						+ library_namespace.indicate_date_time(
						//
						last_query_time) + ')');

				// 使 wiki.listen() 可随时监视设定页面与紧急停止页面的变更。
				// 警告: 对于设定页面的监听，仅限于设定页面也在监听范围中时方起作用。
				// 例如设定了 namespace，可能就监听不到设定页面的变更。
				var configuration_row, configuration_adapter,
				//
				configuration_adapter__run;
				if (configuration_page_title) {
					// 检测看看是否有 configuration_page_title
					rows.forEach(function(row, index) {
						if (row.title === configuration_page_title) {
							configuration_row = row;
						}
					});
				}
				if (configuration_row) {
					configuration_adapter__run = function() {
						// clearTimeout(session.adapt_task_configurations_timer);
						delete session.adapt_task_configurations_timer;
						library_namespace.info([ 'add_listener: ', {
							// gettext_config:{"id":"the-configuration-page-$1-has-been-modified.-re-parse"}
							T : [ '设定页面 %1 已变更。重新解析……',
							//
							wiki_API.title_link_of(configuration_page_title) ]
						} ]);
						session.adapt_task_configurations(configuration_row,
								options.configuration_adapter, 'once');
					};
					if (delay_time_to_adapt_task_configurations >= 0) {
						configuration_adapter = function() {
							if (session.adapt_task_configurations_timer) {
								clearTimeout(
								//
								session.adapt_task_configurations_timer);
							}
							library_namespace.info([ 'add_listener: ', {
								// gettext_config:{"id":"wait-$1-to-apply-the-settings"}
								T : [ '等待 %1 以应用设定。',
								//
								library_namespace.age_of(0,
								//
								delay_time_to_adapt_task_configurations) ]
							} ]);
							session.adapt_task_configurations_timer =
							//
							setTimeout(configuration_adapter__run,
							//
							delay_time_to_adapt_task_configurations);
						};
					} else {
						configuration_adapter = configuration_adapter__run;
					}
				}

				rows.query_delay = Date.now() - Date.parse(last_query_time);
				rows.forEach(function(row) {
					// row.last_query_time = last_query_time;
					row.query_delay = rows.query_delay;
				});
				if (options.filter && rows.length > 0) {
					// @see CeL.data.fit_filter()
					// TODO: 把筛选功能放到 get_recent()，减少资料处理的成本。
					rows = rows.filter(
					// 筛选函数。rcprop必须加上筛选函数需要的资料，例如编辑摘要。
					typeof options.filter === 'function' ? options.filter
					// 筛选标题。警告: 从API取得的标题不包括 "/" 之后的文字，因此最好还是等到之后 listener
					// 处理的时候，才来对标题筛选。
					: library_namespace.is_RegExp(options.filter)
					// 筛选PATTERN
					? function(row) {
						return row.title && options.filter.test(row.title);
					} : Array.isArray(options.filter) ? function(row) {
						return row.title && options.filter.includes(row.title);
					} : function(row) {
						if (false)
							library_namespace.log([ row.title, options.filter,
							//
							wiki_API.normalize_title(options.filter) ]);
						// assert: typeof options.filter === 'string'
						return row.title
						// treat options.filter as page title
						&& (row.title.includes(options.filter)
						// 区分大小写
						|| row.title.startsWith(
						//
						wiki_API.normalize_title(options.filter)));
					});
					library_namespace.debug('Get ' + rows.length
							+ ' recent pages after filter:\n'
							+ rows.map(function(row) {
								return row.revid;
							}), 2, 'add_listener');
					// console.log([ row.title, options.filter ]);
				}

				// TODO: configuration_row 应该按照 rows 的顺序，
				// 并且假如特别 filter 到设定页面的时候，那么设定页面还是应该要被 listener 检查。
				if (configuration_row && !rows.includes(configuration_row)) {
					if (library_namespace.is_debug()) {
						library_namespace.debug(
								'unshift configuration_row revid='
										+ configuration_row.revid + ':', 1,
								'add_listener');
						console.log(configuration_row);
					}
					// 保证 configuration_page_title 的变更一定会被检查到。
					rows.unshift(configuration_row);
				}

				var quit_listening, waiting_queue = [];
				var check_result = function check_result(result, run_next) {
					if (library_namespace.is_thenable(result)) {
						if (run_next) {
							// 先执行完本页面再执行下一个页面。
							result.then(run_next, function(error) {
								library_namespace.error(error);
								run_next();
							});
						} else {
							waiting_queue.push(result);
						}

					} else {
						if (result) {
							last_query_time = new Date;
							return quit_listening = result;
						}
						run_next && run_next();
					}

				}, check_and_receive_next = function check_and_receive_next(
						result) {
					// if listener() return true, the operation will be stopped.
					if (quit_listening) {
						library_namespace.debug(
						//
						'The listener() returns non-null, quit listening.', 0,
								'add_listener.check_and_receive_next');

					} else if (waiting_queue.length > 0) {
						library_namespace.debug('Waiting '
								+ waiting_queue.length
								+ ' work(s) and then get next recent pages', 2,
								'add_listener.check_and_receive_next');
						Promise.allSettled(waiting_queue).then(receive_next);

					} else {
						library_namespace.debug('Get next recent pages', 2,
								'add_listener.check_and_receive_next');
						receive_next();
					}
				};

				if (rows.length > 0) {
					library_namespace.log_temporary('add_listener.with_diff: '
							+ 'Fetching ' + rows.length
							+ ' page(s) starting from '
							+ wiki_API.title_link_of(rows[0]));

					library_namespace.debug('Fetching ' + rows.length
							+ ' recent pages:\n' + rows.map(function(row) {
								return row.revid;
							}), 2, 'add_listener.with_diff');

					// 比较页面修订差异。
					if (options.with_diff || options.with_content >= 2) {
						// console.trace([ rows[0].query_delay, rows.length ]);
						// https://www.mediawiki.org/w/api.php?action=help&modules=query%2Brevisions
						// rvdiffto=prev 已经 parsed，因此仍须自行解析。
						// TODO: test
						// 因为采用.run_serial(.page())，因此约一秒会跑一页面。
						// TODO: 改 .shift()
						rows.run_serial(function(run_next, row, index, list) {
							// console.log(row);
							if (false) {
								console.trace([ index + '/' + rows.length,
										row.title ]);
							}
							// 应该不会出现这种状况。
							if (false && !row.pageid) {
								run_next();
								return;
							}

							library_namespace.debug('Get page: ' + (index + 1)
									+ '/' + rows.length + ' '
									+ wiki_API.title_link_of(row) + ' revid='
									+ row.revid, 2, 'add_listener.with_diff');

							var page_options = {
								// 这里的rvstartid指的是新→旧。
								// 偶尔有可能出现: [badid_rvstartid] No revision was
								// found for parameter "rvstartid".
								rvstartid : row.revid
							};
							// or: row.old_revid >= 0
							if (row.old_revid > 0) {
								page_options.rvendid = row.old_revid;
							}

							page_options = {
								is_id : true,
								rvlimit : options.with_content >= 3
								// default: 仅取最近的两个版本作 diff
								? options.with_content : 2,
								// https://www.mediawiki.org/w/api.php?action=help&modules=query%2Brevisions
								parameters : page_options,
								rvprop
								// e.g.,
								// minor:'',anon:''/* e.g., IP user 匿名用户 */,
								// bot flag: ('bot' in row)
								: 'ids|timestamp|content|user|flags|size'
							};
							if (false) {
								Object.assign(page_options, options.with_diff);
							}

							// console.trace([ row, page_options ]);
							library_namespace.log_temporary(
							//
							'add_listener.with_diff: ' + 'Fetching '
									+ (index + 1) + '/' + rows.length + ': '
									+ wiki_API.title_link_of(row) + ' ('
									+ library_namespace.indicate_date_time(
									//
									last_query_time) + ')');
							session.page(row, function(page_data, error) {
								library_namespace.log_temporary(
								// 'Get ' +
								(index + 1)
										+ '/'
										+ rows.length
										+ ' ('
										+ (100 * (index + 1) / rows.length)
												.to_fixed(1) + '%) '
										+ wiki_API.title_link_of(row) + ' ('
										+ library_namespace.indicate_date_time(
										// Date.parse(wiki_API.content_of.revision(page_data).timestamp)
										last_query_time) + ')');
								if (quit_listening || !page_data || error) {
									if (error)
										console.error(error);
									run_next();
									return;
								}

								// console.log(wiki_API.title_link_of(page_data));
								var revisions = page_data.revisions;
								// console.trace([ page_options, revisions ]);
								if (latest_only && (!revisions || !revisions[0]
								// 确定是最新版本 revisions[0].revid。
								|| revisions[0].revid !== row.revid)) {
									library_namespace.log(
									//
									'add_listener.with_diff: '
									//
									+ wiki_API.title_link_of(row)
									//
									+ ': 从 recentchanges table 取得的版本 '
									//
									+ row.revid + ' 不同于从页面内容取得的最新版本 '
									//
									+ (revisions && revisions[0]
									//
									&& revisions[0].revid) + '，跳过这一项。');
									run_next();
									return;
								}

								// merge page data
								Object.assign(row, page_data);

								// console.log(revisions);
								if (revisions && revisions.length >= 1
								//
								&& revisions[0] && revisions[0].timestamp) {
									// 设定成已经取得的最新一个编辑rev。
									last_query_time
									// 确保 {Date}last_query_time
									// = new Date(revisions[0].timestamp);
									= revisions[0].timestamp;
									// last_query_revid = revisions[0].revid;
								}

								// assert: (row.is_new || revisions.length > 1)
								if (revisions && revisions.length >= 1
										&& options.with_diff) {

									// wiki_API.content_of(row, -1);
									var from = revisions.length >= 2
											&& wiki_API.revision_content(
											// select the oldest revision.
											revisions.at(-1)) || '',
									// 解析页面结构。
									to = wiki_API.revision_content(
									//
									revisions[0]);

									if (!options.with_diff.line) {
										from = wiki_API.parser(from).parse();
										row.from_parsed = from;
										// console.log(from);
										from = from.map(function(token) {
											if (!token && (token !== ''
											// 有时会出意外。
											|| from.length !== 1)) {
												console.log(row);
												throw new Error(row.title);
											}
											return token.toString();
										});

										to = wiki_API.parser(row).parse();
										to = to.map(function(token) {
											if (!token && (token !== ''
											//
											|| to.length !== 1)) {
												console.log(row);
												throw new Error(row.title);
											}
											return token.toString();
										});

										// verify parser

										if (wiki_API.revision_content(
										//
										revisions[0])
										//
										!== to.join('')) {
											console.log(
											//
											wiki_API.revision_content(
											//
											revisions[0]));
											console.log(to);
											to
											//
											= wiki_API.revision_content(
											//
											revisions[0]);
											console.log(library_namespace.LCS(
											//
											to, parse_wikitext(to).toString(),
													'diff'));
											throw new Error(
											//
											'Parser error (to): ' +
											// debug 用. check parser, test
											// if parser working properly.
											wiki_API.title_link_of(page_data));
										}

										if (revisions.length > 1 &&
										//
										wiki_API.revision_content(
										//
										revisions.at(-1))
										//
										!== from.join('')) {
											console.log(library_namespace.LCS(
											//
											wiki_API.revision_content(
											//
											revisions.at(-1)),
											//
											from.join(''), 'diff'));
											throw new Error(
											//
											'Parser error (from): ' +
											// debug 用. check parser, test
											// if parser working properly.
											wiki_API.title_link_of(page_data));
										}
									}

									if (options.with_diff.LCS) {
										// console.trace([ from, to ]);
										row.diff = library_namespace.LCS(from,
												to, options.with_diff);

									} else {
										row.diff = from.diff_with(to,
												options.with_diff);
									}
								}

								if (configuration_row === row) {
									configuration_adapter();
									run_next();
									return;
								}

								check_result(listener.call(options, row, index,
										rows), run_next);
							}, page_options);

						}, check_and_receive_next);
						return;
					}

					// use options.with_content as the options of wiki.page()
					if (options.with_content || configuration_row) {
						// TODO: 考虑所传回之内容过大，i.e. 回传超过 limit (12 MB)，被截断之情形。
						session.page(rows, function(page_list, error) {
							if (error || !Array.isArray(page_list)) {
								// e.g., 还原编辑
								// wiki_API.page: Unknown response:
								// [{"batchcomplete":""}]
								if (error !== 'Unknown response')
									library_namespace.error(error
											|| 'add_listener: No page got!');
								receive_next();
								return;
							}

							// 配对。
							var page_id_hash = Object.create(null);
							page_list.forEach(function(page_data, index) {
								page_id_hash[page_data.pageid] = page_data;
							});
							rows.some(function(row, index) {
								if (false) {
									console.log('-'.repeat(40));
									console.log(JSON.stringify(row));
									console.log(JSON.stringify(
									//
									page_id_hash[row.pageid]));
								}
								Object.assign(row, page_id_hash[row.pageid]);
								if (configuration_row === row) {
									configuration_adapter();
									return;
								}

								return check_result(listener.call(options, row,
										index, rows));
							});
							// Release memory. 释放被占用的记忆体。
							page_id_hash = page_list = null;
							check_and_receive_next();

						}, Object.assign({
							// Deprecated: rvdiffto, rvcontentformat
							// rvdiffto : 'prev',
							// rvcontentformat : 'text/javascript',
							// is_id : true,
							multi : true
						}, options.with_content));
						return;
					}

					// 除非设定 options.input_Array，否则单笔单笔输入。
					if (options.input_Array) {
						check_result(listener.call(options, rows));
					} else {
						rows.some(function(row, index, rows) {
							return check_result(listener.call(options, row,
									index, rows));
						}, options);
					}

				} else if (options.even_empty) {
					// default: skip empty, 除非设定 options.even_empty.
					check_result(listener.call(options,
					//
					options.input_Array ? rows : {
						// 模拟rows单笔之结构。
						row : Object.create(null)
					}));
				}

				check_and_receive_next();

			}, recent_options);
		}

		receive();
	}

	// wiki.listen()
	wiki_API.listen = add_listener;

	// ================================================================================================================
	// Wikimedia dump

	/**
	 * 取得最新之 Wikimedia dump。
	 * 
	 * assert: library_namespace.platform.nodejs === true
	 * 
	 * TODO: using
	 * /public/dumps/public/zhwiki/latest/zhwiki-latest-pages-articles.xml.bz2
	 * 
	 * @param {String}[wiki_site_name]
	 *            project code name. e.g., 'enwiki'
	 * @param {Function}callback
	 *            回调函数。
	 * @param {Object}[options]
	 *            附加参数/设定选择性/特殊功能与选项
	 * 
	 * @see https://en.wikipedia.org/wiki/Wikipedia:Database_download#Where_do_I_get_it.3F
	 * 
	 * @inner
	 */
	function get_latest_dump(wiki_site_name, callback, options) {
		if (false && !wiki_API.wmflabs) {
			// 最起码须有 bzip2, wget 特定版本输出讯息 @ /bin/sh
			// Wikimedia Toolforge (2017/8 之前旧称 Tool Labs)
			// https://wikitech.wikimedia.org/wiki/Labs_labs_labs#Toolforge
			throw new Error('Only for Wikimedia Toolforge!');
		}

		if (typeof wiki_site_name === 'function'
				&& typeof callback !== 'function' && !options) {
			// shift arguments
			options = callback;
			callback = wiki_site_name;
			wiki_site_name = null;
		}

		// 正规化并提供可随意改变的同内容参数，以避免修改或覆盖附加参数。
		options = library_namespace.new_options(options);

		if (!wiki_site_name) {
			// console.log(options);
			// console.log(options[KEY_SESSION]);
			// throw new Error(options[KEY_SESSION].language);
			wiki_site_name = wiki_API.site_name(options || options.project
					|| options.family);
		}

		// dump host: http "301 Moved Permanently" to https
		var host = options.host || 'https://dumps.wikimedia.org/',
		// e.g., '20160305'.
		latest = options.latest;
		if (!latest) {
			library_namespace.get_URL(
			// Get the latest version.
			host + wiki_site_name + '/', function(XMLHttp) {
				var response = XMLHttp.responseText;
				var latest = 0, previous, matched,
				//
				PATTERN = / href="(\d{8,})/g;
				while (matched = PATTERN.exec(response)) {
					matched = Math.floor(matched[1]);
					if (latest < matched)
						previous = latest, latest = matched;
				}
				// 不动到原来的 options。
				options = Object.clone(options);
				// default: 'latest'
				options.latest = latest || 'latest';
				if (previous)
					options.previous = previous;
				get_latest_dump(wiki_site_name, callback, options);
			});
			return;
		}

		var directory = options.directory || './',
		//
		filepath = options.filepath || options.filename || wiki_site_name + '-'
				+ latest + '-pages-articles.xml';

		/**
		 * <code>
		head -n 80 zhwiki-20160305-pages-meta-current1.xml
		less zhwiki-20160305-pages-meta-current1.xml
		tail -n 80 zhwiki-20160305-pages-meta-current1.xml
		</code>
		 */

		/**
		 * e.g., <code>
		callback = function(data) { console.log(data); };
		latest = '20160305';
		wiki_site_name = 'enwiki';
		// directory to restore dump files.
		// 指定 dump file 放置的 directory。
		// e.g., '/shared/cache/', '/shared/dumps/', '~/dumps/'
		// https://wikitech.wikimedia.org/wiki/Help:Toolforge/Developing#Using_the_shared_Pywikibot_files_.28recommended_setup.29
		// /shared/: shared files
		dump_directory = '/shared/cache/'
		filepath = wiki_site_name + '-' + latest + '-pages-articles-multistream-index.txt';
		</code>
		 */

		// 若是目标目录不存在/已删除则尝试创建之。
		try {
			node_fs.statSync(directory);
		} catch (e) {
			library_namespace.info('get_latest_dump: ' + '存放 dump file 的目录['
					+ directory + ']不存在/已删除，尝试创建之。');
			node_fs.mkdirSync(directory, parseInt('777', 8));
			node_fs.writeFileSync(directory
					+ '_FEEL_FREE_TO_REMOVE_THIS_DIRECTORY_ANYTIME', '');
			// 若是没有办法创建目录，那就直接throw。
		}

		var data_file_OK;
		try {
			// check if data file exists and big enough
			data_file_OK = node_fs.statSync(directory + filepath).size > 1e7;
		} catch (e) {
		}

		if (data_file_OK) {
			library_namespace.log('get_latest_dump: Using data file (.xml): ['
					+ directory + filepath + ']');
			callback(directory + filepath);
			return;
		}

		// ----------------------------------------------------

		function extract() {
			library_namespace.log('get_latest_dump.extract: ' + 'Extracting ['
					+ source_directory + archive + '] to [' + directory
					+ filepath + ']...');
			// share the xml dump file. 应由 caller 自行设定。
			// process.umask(parseInt('0022', 8));
			require('child_process').exec(
			//
			'/bin/bzip2 -cd "' + source_directory + archive + '" > "'
			//
			+ directory + filepath + '"', function(error, stdout, stderr) {
				if (error) {
					library_namespace.error(error);
				} else {
					library_namespace.log('get_latest_dump.extract: '
					//
					+ 'Done. Running callback...');
				}
				callback(directory + filepath);
			});
		}

		var public_dumps_directory = '/public/dumps/public/',
		// search the latest file in the local directory.
		// https://wikitech.wikimedia.org/wiki/Help:Tool_Labs#Dumps
		// 可在 /public/dumps/public/zhwiki/ 找到旧 dumps。 (using `df -BT`)
		// e.g.,
		// /public/dumps/public/zhwiki/20160203/zhwiki-20160203-pages-articles.xml.bz2
		source_directory, archive = options.archive || filepath + '.bz2';

		if (wiki_API.wmflabs) {
			source_directory = public_dumps_directory + wiki_site_name + '/'
					+ latest + '/';
			library_namespace.debug('Check if public dump archive exists: ['
					+ source_directory + archive + ']', 1, 'get_latest_dump');
			try {
				// 1e7: Only using the cache when it exists and big enough.
				// So we do not using node_fs.accessSync() only.
				if (node_fs.statSync(source_directory + archive).size > 1e7) {
					library_namespace
							.log('get_latest_dump: Using public dump archive file ['
									+ source_directory + archive + '].');
					extract();
					return;
				}
			} catch (e) {
			}
		}

		// ----------------------------------------------------

		source_directory = directory;

		library_namespace.debug('Check if file exists: [' + source_directory
				+ archive + ']', 1, 'get_latest_dump');
		try {
			if (node_fs.statSync(source_directory + archive).size > 1e7) {
				library_namespace.log('get_latest_dump: ' + 'Archive ['
						+ source_directory + archive + '] exists.');
				extract();
				return;
			}
		} catch (e) {
		}

		// ----------------------------------------------------

		library_namespace.log('get_latest_dump: Try to save archive to ['
				+ source_directory + archive + ']...');
		// https://nodejs.org/api/child_process.html
		var child = require('child_process').spawn('/usr/bin/wget',
		// -O=""
		[ '--output-document=' + source_directory + archive,
		// 经测试，采用 .spawn() 此种方法毋须考虑 '"' 之类 quote 的问题。
		host + wiki_site_name + '/' + latest + '/' + archive ]);

		child.stdout.setEncoding('utf8');
		child.stderr.setEncoding('utf8');

		/**
		 * http://stackoverflow.com/questions/6157497/node-js-printing-to-console-without-a-trailing-newline
		 * 
		 * In Windows console (Linux, too), you should replace '\r' with its
		 * equivalent code \033[0G:
		 */
		child.stdout.on('data', function(data) {
			library_namespace.log_temporary(data);
		});

		child.stderr.on('data', function(data) {
			data = data.toString('utf8');
			/**
			 * <code>
			 e.g.,
			259000K .......... .......... .......... .......... .......... 21%  282M 8m26s
			999950K .......... .......... .......... .......... .......... 82% 94.2M 1m46s
			1000000K .......... .......... .......... .......... .......... 82%  103M 1m46s
			</code>
			 */
			// [ all, downloaded, percentage, speed, remaining 剩下时间 ]
			var matched = data.match(/([^\n\.]+)[.\s]+(\d+%)\s+(\S+)\s+(\S+)/);
			if (matched) {
				data = matched[2] + '  ' + matched[1] + '  ' + matched[4]
						+ '                    \r';
			} else if (data.includes('....') || /\d+[ms]/.test(data)
					|| /\.\.\s*\d+%/.test(data))
				return;
			process.stderr.write(data);
		});

		child.on('close', function(error_code) {
			if (error_code) {
				library_namespace.error('get_latest_dump: ' + 'Error code '
						+ error_code);
				// 有时最新版本可能 dump 到一半，正等待中。
				if (options.previous) {
					library_namespace.info(
					// options.previous: latest 的前一个版本。
					'get_latest_dump: Use previous version: ['
							+ options.previous + '].');
					options.latest = options.previous;
					delete options.previous;
					get_latest_dump(wiki_site_name, callback, options);
				} else {
					callback();
				}
				return;
			}

			library_namespace.log('get_latest_dump: ' + 'Got archive file ['
					+ source_directory + archive + '].');
			extract();
		});
	}

	/**
	 * 还原 XML text 成原先之文本。
	 * 
	 * @param {String}xml
	 *            XML text
	 * 
	 * @returns {String}还原成原先之文本。
	 * 
	 * @inner
	 */
	function unescape_xml(xml) {
		return xml.replace(/&quot;/g, '"')
		// 2016/3/11: Wikimedia dumps do NOT include '&apos;'.
		.replace(/&lt;/g, '<').replace(/&gt;/g, '>')
		// MUST be the last one.
		.replace(/&amp;/g, '&');
	}

	/**
	 * Parse Wikimedia dump xml text.
	 * 
	 * @param {String}xml
	 *            xml text
	 * @param {ℕ⁰:Natural+0}[start_index]
	 *            start index to parse.
	 * @param {Function}[filter]
	 *            filter :<br />
	 *            function(pageid, revid) { return {Boolean}need_process; }
	 * 
	 * @returns {Object}page_data =
	 *          {pageid,ns,title,revisions:[{revid,timestamp,'*'}]}
	 */
	function parse_dump_xml(xml, start_index, filter) {
		if (!(start_index >= 0))
			start_index = 0;

		// 主要页面内容所在。
		var revision_index = xml.indexOf('<revision>', start_index);
		if (revision_index === NOT_FOUND
		// check '<model>wikitext</model>'
		// || xml.indexOf('<model>wikitext</model>') === NOT_FOUND
		) {
			// 有 end_mark '</page>' 却没有 '<revision>'
			library_namespace.error('parse_dump_xml: ' + 'Bad data:\n'
					+ xml.slice(0, index));
			return;
		}

		var pageid = xml.between('<id>', '</id>', start_index) | 0,
		// ((revid|0)) 可能出问题。
		revid = Math.floor(xml.between('<id>', '</id>', revision_index));

		if (filter && !filter(pageid, revid)) {
			if (false)
				library_namespace.debug('Skip id ' + pageid, 4,
						'parse_dump_xml');
			return;
		}

		// 模拟 revisions
		// 注意: 这必须依照 revisions model 变更!
		var revision = {
			// rev_id
			revid : revid,
			parentid : Math.floor(xml.between('<parentid>', '</parentid>',
					revision_index)),
			minor : xml.slice(revision_index).includes('<minor />'),
			user : unescape_xml(xml.between('<username>', '</username>',
					revision_index)),
			// e.g., '2000-01-01T00:00:00Z'
			timestamp : xml.between('<timestamp>', '</timestamp>',
					revision_index),
			slots : {
				main : {
					contentmodel : xml.between('<model>', '</model>',
							revision_index),
					contentformat : xml.between('<format>', '</format>',
							revision_index),
					// old: e.g., '<text xml:space="preserve" bytes="80">'??
					// 2016/3/11: e.g., '<text xml:space="preserve">'
					// 2020/5/16: <text bytes="41058" xml:space="preserve">
					'*' : unescape_xml(xml.between('<text ', '</text>',
							revision_index).between('>'))
				}
			},
			comment : unescape_xml(xml.between('<comment>', '</comment>',
					revision_index))
		};

		if (revision.minor)
			revision.minor = '';
		else
			delete revision.minor;

		// page_data 之 structure 按照 wiki API 本身之 return
		// page_data = {pageid,ns,title,revisions:[{revid,timestamp,'*'}]}
		// includes redirection 包含重新导向页面.
		// includes non-ns0.
		var page_data = {
			pageid : pageid,
			ns : xml.between('<ns>', '</ns>', start_index) | 0,
			title : unescape_xml(xml
					.between('<title>', '</title>', start_index)),
			revisions : [ revision ]
		};

		return page_data;
	}

	// @inner
	function almost_latest_revid_of_dump(filepath, callback, options) {
		// 65536 === Math.pow(2, 16); as a block
		var buffer = Buffer.alloc(65536);
		var position = Math.max(0, node_fs.statSync(filepath).size
				- buffer.length);
		// file descriptor
		var fd = node_fs.openSync(filepath, 'r');
		var latest_revid_of_dump;

		while (true) {
			node_fs.readSync(fd, buffer, 0, buffer.length, position);
			var contents = buffer.toString('utf8');
			var matched, PATTERN = /<revision>[\s\n]*<id>(\d{1,16})<\/id>[\s\S]*?$/g;
			// Warning: almost_latest_revid_of_dump() 只能快速取得最新创建几篇文章的最新
			// revid，而非最后的 revid。
			while (matched = PATTERN.exec(contents)) {
				matched = +matched[1];
				if (!(latest_revid_of_dump > matched))
					latest_revid_of_dump = matched;
			}
			if (latest_revid_of_dump > 0) {
				callback(latest_revid_of_dump);
				return;
			}

			if (position > 0) {
				position = Math.max(0, position - buffer.length
				// +256: 预防跳过 /<id>(\d{1,16})<\/id>/。
				// assert: buffer.length > 256
				+ 256);
			} else {
				// No data get.
				callback();
				return;
			}
		}
	}

	/**
	 * 读取/parse Wikimedia dumps 之 xml 档案。
	 * 
	 * assert: library_namespace.platform.nodejs === true
	 * 
	 * 注意: 必须自行 include 'application.platform.nodejs'。 <code>
	   CeL.run('application.platform.nodejs');
	 * </code><br />
	 * 
	 * @param {String}[filepath]
	 *            欲读取的 .xml 档案路径。
	 * @param {Function}for_each_page
	 *            Calling for each page. for_each_page({Object}page_data)
	 * @param {Object}[options]
	 *            附加参数/设定选择性/特殊功能与选项
	 * 
	 * @returns {String}file path
	 * 
	 * @see <a href="http://dumps.wikimedia.org/backup-index.html">Wikimedia
	 *      database backup dumps</a>
	 * @see https://www.mediawiki.org/wiki/Help:Export
	 * 
	 * @since 2016/3/11
	 */
	function read_dump(filepath, for_each_page, options) {
		if (typeof filepath === 'function'
				&& typeof for_each_page !== 'function' && !options) {
			// shift arguments
			options = for_each_page;
			for_each_page = filepath;
			filepath = null;
		}

		if (typeof filepath !== 'string' || !filepath.endsWith('.xml')) {
			if (filepath) {
				library_namespace.log('read_dump: ' + 'Invalid file path: ['
						+ filepath + '], try to get the latest dump file...');
			}
			get_latest_dump(filepath, function(filepath) {
				read_dump(filepath, for_each_page, options);
			}, options);
			// 警告: 无法马上取得档案时，将不会回传任何资讯！
			return;
		}

		options = library_namespace.setup_options(options);

		if (options.get_latest_revid) {
			almost_latest_revid_of_dump(filepath, for_each_page, options);
			return;
		}

		if (typeof options.first === 'function') {
			options.first(filepath);
		}

		var run_last = function(quit_operation) {
			library_namespace.debug('Finish work.', 1, 'read_dump');
			if (run_last && typeof options.last === 'function') {
				options.last.call(file_stream, anchor, quit_operation);
			}
			// run once only.
			run_last = null;
		},
		/** {String}file encoding for dump file. */
		encoding = options.encoding || wiki_API.encoding,
		/** {String}处理中之资料。 */
		buffer = '',
		/** end mark */
		end_mark = '</page>',
		/**
		 * 锚/定位点.<br />
		 * anchor[pageid] = [ position of the xml dump file, page length in
		 * bytes ]
		 * 
		 * @type {Array}
		 */
		anchor = options.anchor && [],
		//
		filter = options.filter,
		/**
		 * dump file stream.
		 * 
		 * filepath: XML file path.<br />
		 * e.g., 'enwiki-20160305-pages-meta-current1.xml'
		 * 
		 * @type {String}
		 */
		file_stream = new node_fs.ReadStream(filepath, {
			// 加大 buffer。据测试，改到 1 MiB 反而慢。
			highWaterMark : 128 * 1024
		}),
		/**
		 * 掌握进度用。 (100 * file_status.pos / file_status.size | 0) + '%'<br />
		 * 此时 stream 可能尚未初始化，(file_stream.fd===null)，<br />
		 * 因此不能使用 fs.fstatSync()。
		 * 
		 * @type {Object}
		 */
		// file_status = node_fs.fstatSync(file_stream.fd);
		// file_status = node_fs.statSync(filepath),
		/** {Natural}档案长度。掌握进度用。 */
		// file_size = node_fs.statSync(filepath).size,
		/**
		 * byte counter. 已经处理过的资料长度，为 bytes，非 characters。指向 buffer 起头在 file
		 * 中的位置。
		 * 
		 * @type {ℕ⁰:Natural+0}
		 */
		bytes = 0;
		// 若是预设 encoding，会造成 chunk.length 无法获得正确的值。
		// 若是为了能掌握进度，则不预设 encoding。
		// 2016/3/26: 但这会造成破碎/错误的编码，只好放弃。
		file_stream.setEncoding(encoding);

		file_stream.on('error', options.onerror || function(error) {
			library_namespace.error('read_dump: '
			//
			+ 'Error occurred: ' + error);
		});

		/**
		 * 工作流程: 循序读取档案内容。每次读到一个区块/段落 (chunk)，检查是不是有结束标记。若是没有，则得继续读下去。<br />
		 * 有结束标记，则取出开始标记至结束标记中间之页面文字资料，纪录起始与结尾档案位置，放置于 anchor[pageid]，并开始解析页面。<br />
		 * 此时 bytes 指向档案中 start position of buffer，可用来设定锚/定位点。
		 */

		library_namespace.info('read_dump: ' + 'Starting read dump file...');

		/**
		 * Parse Wikimedia dump xml file slice.
		 * 
		 * TODO: 把工具函数写到 application.platform.nodejs 里面去。
		 */
		function parse_buffer(index) {
			index = buffer.indexOf(end_mark, index);
			if (index === NOT_FOUND)
				// 资料尚未完整，继续读取。
				return;

			// 回头找 start mark '<page>'
			var start_index = buffer.lastIndexOf('<page>', index);
			if (start_index === NOT_FOUND) {
				throw new Error('parse_buffer: '
						+ 'We have end mark without start mark!');
			}

			var page_data = parse_dump_xml(buffer, start_index, filter);
			if (!page_data) {
				if (false)
					library_namespace.debug(
					//
					'跳过此笔纪录。 index: ' + index + ', buffer: ' + buffer.length,
							3, 'parse_dump_xml');
				bytes += Buffer.byteLength(buffer.slice(0, index
						+ end_mark.length), encoding);
				// 截断。
				buffer = buffer.slice(index + end_mark.length);
				// 虽然跳过此笔纪录，但既然还能处理，便需要继续处理。
				return true;
			}

			var pageid = page_data.pageid,
			//
			start_pos = Buffer.byteLength(buffer.slice(0, start_index),
					encoding),
			// 牺牲效能以确保采用无须依赖 encoding 特性之实作法。
			page_bytes = Buffer.byteLength(buffer.slice(start_index, index
					+ end_mark.length), encoding),
			// [ start position of file, length in bytes ]
			page_anchor = [ bytes + start_pos, page_bytes ];
			if (false && anchor && (pageid in anchor))
				library_namespace.error('parse_buffer: '
						+ 'Duplicated page id: ' + pageid);
			if (anchor)
				anchor[pageid] = page_anchor;
			// 跳到下一笔纪录。
			bytes += start_pos + page_bytes;
			// 截断。
			buffer = buffer.slice(index + end_mark.length);

			if (wiki_API.quit_operation ===
			/**
			 * function({Object}page_data, {Natural}position: 到本page结束时之档案位置,
			 * {Array}page_anchor)
			 */
			for_each_page(page_data, bytes, page_anchor/* , file_status */)) {
				// console.log(file_stream);
				library_namespace.info('read_dump: '
						+ 'Quit operation, 中途跳出作业...');
				file_stream.end();
				// Release memory. 释放被占用的记忆体。
				buffer = null;
				run_last(true);
				return;
			}

			return true;
		}

		file_stream.on('data', function(chunk) {

			// 之前的 buffer 已经搜寻过，不包含 end_mark。
			var index = buffer.length;

			/**
			 * 当未采用 .setEncoding(encoding)，之后才 += chunk.toString(encoding)；
			 * 则一个字元可能被切分成两边，这会造成破碎/错误的编码。
			 * 
			 * This properly handles multi-byte characters that would otherwise
			 * be potentially mangled if you simply pulled the Buffers directly
			 * and called buf.toString(encoding) on them. If you want to read
			 * the data as strings, always use this method.
			 * 
			 * @see https://nodejs.org/api/stream.html#stream_class_stream_readable
			 */
			buffer += chunk;
			// buffer += chunk.toString(encoding);

			// --------------------------------------------

			/**
			 * 以下方法废弃 deprecated。 an alternative method: 另一个方法是不设定
			 * file_stream.setEncoding(encoding)，而直接搜寻 buffer 有无 end_mark '</page>'。直到确认不会打断
			 * character，才解 Buffer。若有才分割、执行 .toString(encoding)。但这需要依赖最终
			 * encoding 之特性，并且若要采 Buffer.concat() 也不见得更高效， and
			 * Buffer.prototype.indexOf() needs newer node.js. 或许需要自己写更底层的功能，直接
			 * call fs.read()。此外由于测试后，发现瓶颈在网路传输而不在程式码执行，因此不如牺牲点效能，确保采用无须依赖
			 * encoding 特性之实作法。
			 */

			;

			// --------------------------------------------
			while (parse_buffer(index))
				// 因为 buffer 已经改变，reset index.
				index = 0;

			// 页面大小系统上限 2,048 KB = 2 MB。
			if (buffer.length > 3e6) {
				library_namespace.error('read_dump: ' + 'buffer too long ('
						+ buffer.length
						+ ' characters)! Paused! 有太多无法处理的 buffer，可能是格式错误？');
				console.log(buffer.slice(0, 1e3) + '...');
				file_stream.pause();
				// file_stream.resume();
				// throw buffer.slice(0,1e3);
			}
		});

		file_stream.on('end', run_last);

		// * @returns {String}file path
		// * @returns {node_fs.ReadStream}file handler
		// return file_stream;
	}

	wiki_API.read_dump = read_dump;

	// ================================================================================================================

	/**
	 * 由 Wikimedia Toolforge 上的 database replication 读取所有 ns0，且未被删除页面最新修订版本之版本编号
	 * rev_id (包含重定向)。<br />
	 * 从 `page` 之 page id 确认 page 之 namespace，以及未被删除。然后选择其中最大的 revision id。
	 * 
	 * should get: { i: page id, r: latest revision id }
	 * 
	 * AND `page`.`page_is_redirect` = 0
	 * 
	 * https://stackoverflow.com/questions/14726789/how-can-i-change-the-default-mysql-connection-timeout-when-connecting-through-py
	 * 
	 * @type {String}
	 * 
	 * @see https://www.mediawiki.org/wiki/Manual:Page_table#Sample_MySQL_code
	 *      https://phabricator.wikimedia.org/diffusion/MW/browse/master/maintenance/tables.sql
	 */
	var all_revision_SQL = 'SELECT `page`.`page_id` AS `i`, `page`.`page_latest` AS `r` FROM `page` INNER JOIN `revision` ON `page`.`page_latest` = `revision`.`rev_id` WHERE `revision`.`rev_id` > 0 AND `revision`.`rev_deleted` = 0 AND `page`.`page_namespace` = 0';

	if (false) {
		/**
		 * 采用此 SQL 之极大问题: page.page_latest 并非最新 revision id.<br />
		 * the page.page_latest is not the latest revision id of a page in
		 * Wikimedia Toolforge database replication.
		 */
		all_revision_SQL = 'SELECT `page_id` AS `i`, `page_latest` AS `l` FROM `page` p INNER JOIN `revision` r ON p.page_latest = r.rev_id WHERE `page_namespace` = 0 AND r.rev_deleted = 0';
		/**
		 * 2019/7 deprecated: too late
		 */
		all_revision_SQL = 'SELECT `rev_page` AS `i`, MAX(`rev_id`) AS `r` FROM `revision` INNER JOIN `page` ON `page`.`page_id` = `revision`.`rev_page` WHERE `page`.`page_namespace` = 0 AND `revision`.`rev_deleted` = 0 GROUP BY `rev_page`';
	}
	if (false) {
		// for debug.
		all_revision_SQL += ' LIMIT 8';
	}

	/**
	 * 应用功能: 遍历所有页面。 CeL.wiki.traversal()
	 * 
	 * TODO: 配合 revision_cacher，进一步加快速度？
	 * 
	 * @param {Object}[config]
	 *            configuration
	 * @param {Function}for_each_page
	 *            Calling for each page. for_each_page({Object}page_data)
	 */
	function traversal_pages(config, for_each_page) {
		if (typeof config === 'function' && for_each_page === undefined) {
			// shift arguments.
			for_each_page = config;
			config = Object.create(null);
		} else {
			// 正规化并提供可随意改变的同内容参数，以避免修改或覆盖附加参数。
			config = library_namespace.new_options(config);
		}

		if (config.use_dump_only) {
			library_namespace.debug('use dump only: '
					+ '仅仅使用 dump，不采用 API 取得最新页面内容。', 1, 'traversal_pages');
			// @see process_dump.js
			if (config.use_dump_only === true) {
				// 这边的 ((true)) 仅表示要使用，并采用预设值；不代表设定 dump file path。
				config.use_dump_only = null;
			}
			read_dump(config.use_dump_only, for_each_page, {
				// 一般来说只会用到 config.last，将在本函数中稍后执行，
				// 因此先不开放 config.first, config.last。

				// options.first(filepath) of read_dump()
				// first : config.first,

				// options.last.call(file_stream, anchor, quit_operation)
				// of read_dump()
				// last : config.last,

				// directory to restore dump files.
				// 指定 dump file 放置的 directory。
				// e.g., '/shared/cache/', '/shared/dumps/', '~/dumps/'
				// https://wikitech.wikimedia.org/wiki/Help:Tool_Labs/Developing#Using_the_shared_Pywikibot_files_.28recommended_setup.29
				// /shared/: shared files
				directory : config.dump_directory
			});
			return;
		}

		// 若不想使用 dump，可不设定 .filter。
		// 经测试，全部使用 API，最快可入50分钟内，一般在 1-2 hours 左右。
		var dump_file;
		// 若 config.filter 非 function，表示要先比对 dump，若修订版本号相同则使用之，否则自 API 撷取。
		// 并以 try_dump() 当作 filter()。
		// 设定 config.filter 为 ((true)) 表示要使用预设为最新的 dump，
		// 否则将之当作 dump file path。
		if (config.filter && (typeof config.filter !== 'function')) {
			dump_file = config.filter;
			if (dump_file === true) {
				// 这边的 ((true)) 仅表示要使用，并不代表设定 dump file path。
				dump_file = null;
			}
		}

		var latest_revid_of_dump = config.latest_revid_of_dump;
		if (!(latest_revid_of_dump > 0)) {
			read_dump(dump_file, function(latest_revid_of_dump) {
				config.latest_revid_of_dump = latest_revid_of_dump;
				traversal_pages(config, for_each_page);
			}, {
				get_latest_revid : true,
				directory : config.dump_directory
			});
			return;
		}

		/** {Array}id/title list */
		var id_list, rev_list,
		//
		use_language = wiki_API.site_name(config, {
			get_all_properties : true
		}).language,
		/** {Object}用在 wiki_API.cache 之 configuration。 */
		cache_config = {
			// all title/id list
			file_name : config.file_name
			// all_newer_pages.*.json 存有当前语言维基百科所有较新页面的id以及最新版本 (*:当前语言)
			|| traversal_pages.list_file + '.' + use_language + '.json',
			operator : function(list) {
				if (!Array.isArray(list)) {
					throw new Error('traversal_pages: No list get!');
				}
				if (list.length === 3
						&& JSON.stringify(list[0]) === JSON
								.stringify(traversal_pages.id_mark)) {
					library_namespace.info('traversal_pages: '
					// cache file 内容来自 The production replicas (database)，
					// 为经过下方 generate_revision_list() 整理过之资料。
					+ '此资料似乎为 page id，来自 production replicas: ['
							+ this.file_name + ']');
					// Skip list[0] = traversal_pages.id_mark
					rev_list = list[2];
					list = list[1];
					// 读取 production replicas 时，储存的是 pageid。
					list.is_id = true;
				} else {
					library_namespace.error('traversal_pages: '
					//
					+ 'cache 档案未设定 rev_list：可能是未知格式？ ' + this.file_name);
				}
				id_list = list;
			}
		};

		// default: 采用 page_id 而非 page_title 来 query。
		var is_id = 'is_id' in config ? config.is_id : true;
		// node.js v0.11.16: In strict mode code, functions can only be declared
		// at top level or immediately within another function.
		function run_SQL_callback(error, rows, fields) {
			if (error) {
				library_namespace.error('traversal_pages: '
				//
				+ 'Error reading database replication!');
				library_namespace.error(error);
				config.no_database = error;
				delete config.list;
			} else {
				library_namespace.log('traversal_pages: ' + 'All '
						+ rows.length + ' pages. 转换中...');
				// console.log(rows.slice(0, 2));
				var id_list = [], rev_list = [];
				rows.forEach(function(row) {
					// .i, .r: @see all_revision_SQL
					id_list.push(is_id ? row.i | 0 : row.i.toString('utf8'));
					rev_list.push(row.r);
				});
				config.list = [ traversal_pages.id_mark, id_list, rev_list ];
				// config.is_id = is_id;
			}
			// 因为已经取得所有列表，重新呼叫traversal_pages()。
			traversal_pages(config, for_each_page);
		}
		function generate_revision_list() {
			library_namespace.info('traversal_pages: '
			// Wikimedia Toolforge database replicas.
			+ '尝试读取 Wikimedia Toolforge 上之 database replication 资料，'
					+ '一次读取完版本号 ' + latest_revid_of_dump
					+ ' 之后，所有页面最新修订版本之版本号 rev_id...');
			var SQL = is_id ? all_revision_SQL : all_revision_SQL.replace(
					/page_id/g, 'page_title');
			SQL = SQL.replace(/(`rev_id` > )0 /, '$1' + latest_revid_of_dump
					+ ' ');
			// assert: 当有比 dump_fire 里面的更新的版本时，会被筛选出。
			var SQL_config = config && config.SQL_config
			//
			|| wiki_API.new_SQL_config
			// 光从 use_language 无法获得如 wikinews 之资讯。
			&& wiki_API.new_SQL_config(config[KEY_SESSION] || use_language);
			wiki_API.run_SQL(SQL, run_SQL_callback, SQL_config);
			return wiki_API.cache.abort;
		}

		if (Array.isArray(config.list)) {
			library_namespace.debug('采用输入之 list，列表长度 ' + config.list.length
					+ '。', 1, 'traversal_pages');
			cache_config.list = config.list;

		} else if (wiki_API.wmflabs && !config.no_database) {
			library_namespace.debug('若没有 cache，则尝试读取 database 之资料。', 1,
					'traversal_pages');

			cache_config.list = generate_revision_list;

		} else {
			library_namespace.debug('采用 API type = allpages。', 1,
					'traversal_pages');
			cache_config.type = 'allpages';
		}

		function cache__for_each_page() {
			// 有设定 config[KEY_SESSION] 才能获得如 bot 之类，一次读取/操作更多页面的好处。
			var session = wiki_API.session_of_options(config)
			//
			|| new wiki_API(config.user, config.password, config.language);
			// includes redirection 包含重新导向页面.
			library_namespace.log('traversal_pages: ' + '开始遍历所有 dump 页面...');

			/**
			 * 工作原理:<code>

			 * 经测试，读取 file 会比读取 MariaDB 快，且又更胜于经 API 取得资料。
			 * 经测试，遍历 xml dump file 约 3分钟(see process_dump.js)，会比随机存取快得多。
			 * database replicas @ Wikimedia Toolforge 无 `text` table，因此实际页面内容不仅能经过 replicas 存取。

			# 先将最新的 xml dump file 下载到本地(实为 network drive)并解开: read_dump()
			# 由 Wikimedia Toolforge database replication 读取所有 ns0 且未被删除页面最新修订版本之版本号 rev_id (包含重定向): traversal_pages() + all_revision_SQL
			# 遍历 xml dump file，若 dump 中为最新修订版本，则先用之 (约 95%)；纯粹筛选约需近 3 minutes: try_dump()
			# 经 API 读取余下 dump 后近 5% 更动过的页面内容: traversal_pages() + wiki_API.prototype.work
			# 于 Wikimedia Toolforge，解开 xml 后；自重新抓最新修订版本之版本号起，网路连线顺畅时整个作业时间约 12分钟。

			</code>
			 */

			function try_dump() {
				var start_read_time = Date.now(),
				// max_length = 0,
				count = 0, limit = config.limit,
				//
				file_size, rev_of_id = [], is_id = id_list.is_id;

				id_list.forEach(function(id, index) {
					if (id in rev_of_id)
						library_namespace.warn('traversal_pages: '
								+ '存在重复之id: ' + id);
					rev_of_id[id] = rev_list[index];
				});

				// Release memory. 释放被占用的记忆体。
				id_list = null;
				rev_list = null;

				read_dump(dump_file,
				// e.g., /shared/cache/zhwiki-20200401-pages-articles.xml
				function(page_data, position, page_anchor) {
					// filter

					// TODO
					if (false && limit > 0 && count > limit) {
						library_namespace.log(count + '笔资料，已到 limit，跳出。');
					}

					if (++count % 1e4 === 0) {
						library_namespace.log(
						// 'traversal_pages: ' +
						wiki_API.estimated_message(
						//
						position, file_size, start_read_time,
						// e.g.,
						// "2730000 (99%): 21.326 page/ms [[Category:大洋洲火山岛]]"
						count) + '. ' + wiki_API.title_link_of(page_data));
					}

					// ----------------------------
					// Check data.

					if (false) {
						if (!CeL.wiki.content_of.page_exists(page_data)) {
							// error? 此页面不存在/已删除。
							return [ CeL.wiki.edit.cancel, '条目不存在或已被删除' ];
						}
						if (page_data.ns !== 0
								&& page_data.title !== 'Wikipedia:サンドボックス') {
							return [ CeL.wiki.edit.cancel,
							// 本作业は记事だけを编集する
							'本作业仅处理条目命名空间或模板或 Category' ];
							throw new Error('非条目: '
							//
							+ wiki_API.title_link_of(page_data)
							//
							+ '! 照理来说不应该出现非条目的情况。');
						}

						/** {Object}revision data. 修订版本资料。 */
						var revision = page_data && page_data.revisions
						// @see function parse_dump_xml()
						&& page_data.revisions[0],
						/** {Natural}所取得之版本编号。 */
						revid = revision && revision.revid;

						/** {String}page title = page_data.title */
						var title = CeL.wiki.title_of(page_data),
						/**
						 * {String}page content, maybe undefined. 条目/页面内容 =
						 * CeL.wiki.revision_content(revision)
						 */
						content = CeL.wiki.content_of(page_data);

						// 当取得了多个版本，欲取得最新的一个版本：
						// content = CeL.wiki.content_of(page_data, 0);

						// 似乎没 !page_data.title 这种问题。
						if (false && !page_data.title)
							library_namespace.warn('* No title: [['
									+ page_data.pageid + ']]!');

						// typeof content !== 'string'
						if (!content) {
							content =
							// e.g., 没有页面内容 or: 此页面不存在/已删除。
							// gettext_config:{"id":"no-content"}
							gettext('No content: ')
									+ CeL.wiki.title_link_of(page_data);
							// CeL.log(content);
							return [ CeL.wiki.edit.cancel, content ];
						}

						var last_edit_Date = CeL.wiki.content_of
								.edit_time(page_data);

						// [[Wikipedia:快速删除方针]]
						if (CeL.wiki.revision_content(revision)) {
							// max_length = Math.max(max_length,
							// CeL.wiki.revision_content(revision).length);

							// filter patterns

						} else {
							library_namespace.warn('* '
							// gettext_config:{"id":"no-content"}
							+ CeL.gettext('No content: ')
									+ CeL.wiki.title_link_of(page_data));
						}

						/** {Array} parsed page content 页面解析后的结构。 */
						var parsed = CeL.wiki.parser(page_data).parse();
						// debug 用.
						// check parser, test if parser working properly.
						CeL.assert([ content, parsed.toString() ],
						// gettext_config:{"id":"wikitext-parser-checking-$1"}
						CeL.gettext('wikitext parser checking: %1', CeL.wiki
								.title_link_of(page_data)));
						if (CeL.wiki.content_of(page_data) !== parsed
								.toString()) {
							console.log(CeL.LCS(CeL.wiki.content_of(page_data),
									parsed.toString(), 'diff'));
							throw new Error('Parser error: '
									+ CeL.wiki.title_link_of(page_data));
						}

						// using for_each_token()
						parsed.each('link', function(token, index) {
							console.log(token);
						});
					}

					// 注记为 dump。可以 ((messages)) 判断是在 .work() 中执行或取用 dump 资料。
					// page_data.dump = true;
					// page_data.dump = dump_file;

					// ------------------------------------
					// 有必要中途跳出时则须在 for_each_page() 中设定：
					// @ for_each_page(page_data, messages):
					if (false && need_quit) {
						if (messages) {
							// 当在 .work() 中执行时。
							messages.quit_operation = true;
							// 在 .edit() 时不设定内容。但照理应该会在 .page() 中。
							return;
						}
						// 当在本函数，下方执行时，不包含 messages。
						return CeL.wiki.quit_operation;
					}
					// ------------------------------------

					return for_each_page(page_data);

				}, {
					session : config[KEY_SESSION],
					// directory to restore dump files.
					directory : config.dump_directory,
					// options.first(filepath) of read_dump()
					first : function(xml_filepath) {
						dump_file = xml_filepath;
						try {
							file_size = node_fs.statSync(xml_filepath).size;
						} catch (e) {
							// 若不存在 dump_directory，则会在此出错。
							if (e.code === 'ENOENT') {
								library_namespace.error('traversal_pages: '
										+ 'You need to create '
										+ 'the dump directory manually!');
							}
							throw e;
						}
					},
					// @see function parse_dump_xml(xml, start_index, filter)
					filter : function(pageid, revid) {
						if (!(pageid in rev_of_id)) {
							// 开始执行时，dump_file 里面的是最新的页面。
							// 注意: 若执行中有新的变更，不会 traversal 到本页面最新版本！
							return true;
						}

						// Warning: almost_latest_revid_of_dump()
						// 只能快速取得最新创建几篇文章的最新 revid，而非最后的 revid。
						if (latest_revid_of_dump < revid) {
							// assert: latest_revid_of_dump < revid
							latest_revid_of_dump = revid;
							// assert: revid <= rev_of_id[pageid]
							if (revid === rev_of_id[pageid]) {
								// 开始执行时，dump_file 里面的是最新的页面。
								// 注意: 若执行中有新的变更，不会 traversal 到本页面最新版本！
								delete rev_of_id[pageid];
								return true;
							}
						}
					},
					// options.last.call(file_stream, anchor, quit_operation)
					// of read_dump()
					last : function(anchor, quit_operation) {
						var need_API = Object.keys(rev_of_id);
						need_API.is_id = is_id;

						// Release memory. 释放被占用的记忆体。
						rev_of_id = null;

						// 警告: 这个数字可能不准确
						var all_articles = count + need_API.length;
						var percent = (1000 * count / all_articles | 0);
						percent = percent / 10;
						// e.g.,
						// "All 1491092 pages in dump xml file, 198.165 s."
						// includes redirection 包含重新导向页面.
						library_namespace.log('traversal_pages: ' + 'All '
								+ count + '/' + all_articles
								+ ' pages using dump xml file (' + percent
								+ '%), '
								+ ((Date.now() - start_read_time) / 1000 | 0)
								+ ' s elapsed.');
						config.latest_revid_of_dump = latest_revid_of_dump;
						// library_namespace.set_debug(3);
						// 一般可以达到 95% 以上采用 dump file 的程度，10分钟内跑完。
						run_work(need_API, quit_operation);
					}
				});
			}

			function run_work(id_list, quit_operation) {
				if (quit_operation) {
					library_namespace.info(
					// 直接结束作业
					'traversal_pages: 已中途跳出作业，不再读取 production database。');
					// 模拟 wiki_API.prototype.work(config) 之config.last()，与之连动。
					// 此处仅能传入 .work() 在执行 .last() 时提供的 arguments。
					// 但因为 .work() 在执行 .last() 时也没传入 arguments，
					// 因此此处亦不传入 arguments。
					if (typeof config.last === 'function') {
						config.last();
					}
					return;
				}

				if (typeof config.filter === 'function')
					library_namespace.log('traversal_pages: '
							+ '开始读取 production，执行 .work(): '
							+ (id_list && id_list.length) + ' pages...');
				session.work({
					is_id : id_list.is_id,
					no_message : true,
					no_edit : 'no_edit' in config ? config.no_edit : true,
					each : for_each_page,
					// 取得多个页面内容所用之 options。
					// e.g., { rvprop : 'ids|timestamp|content' }
					// Warning: 这对经由 dump 取得之 page 无效！
					page_options : config.page_options,
					// run this at last.
					// 在wiki_API.prototype.work()工作最后执行此config.last()。
					// config.last(/* no meaningful arguments */)
					// 没传入 arguments的原因见前 "config.last();"。
					last : config.last
				}, id_list);
			}

			// 工作流程: config.filter() → run_work()

			if (config.filter && (typeof config.filter !== 'function')) {
				config.filter = try_dump;
			}

			if (typeof config.filter === 'function') {
				// preprocessor before running .work()
				// 可用于额外功能。
				// e.g., 若 revision 相同，从 dump 而不从 API 读取。
				// id_list, rev_list 采用相同的 index。
				config.filter(run_work, for_each_page, id_list, rev_list);
			} else {
				run_work(id_list);
			}

		}

		wiki_API.cache(cache_config, cache__for_each_page, {
			// cache path prefix
			// e.g., task name
			prefix : config.directory
		});
	}

	/**
	 * ((traversal_pages.id_mark)) indicate it's page id instead of page title.
	 * 表示此 cache list 为 page id，而非 page title。 须采用绝不可能用来当作标题之 value。<br />
	 * 勿用过于复杂、无法 JSON.stringify() 或过于简单的结构。
	 */
	traversal_pages.id_mark = {
		id_mark : 'id_mark'
	};

	/** {String}default list file name (will append .json by wiki_API.cache) */
	traversal_pages.list_file = 'all_newer_pages';

	// --------------------------------------------------------------------------------------------

	if (false) {
		(function() {
			/**
			 * usage of revision_cacher()
			 */

			var
			/** {revision_cacher}记录处理过的文章。 */
			processed_data = new CeL.wiki.revision_cacher(base_directory
					+ 'processed.' + use_language + '.json');

			function for_each_page(page_data) {
				// Check if page_data had processed useing revid.
				if (processed_data.had(page_data)) {
					// skipped_count++;
					return [ CeL.wiki.edit.cancel, 'skip' ];
				}

				// 在耗费资源的操作后，登记已处理之 title/revid。其他为节省空间，不做登记。
				// 初始化本页之 processed data: 只要处理过，无论成功失败都作登记。
				var data_to_cache = processed_data.data_of(page_data);
				// or:
				// 注意: 只有经过 .data_of() 的才造出新实体。
				// 因此即使没有要取得资料，也需要呼叫一次 .data_of() 以造出新实体、登记 page_data 之 revid。
				processed_data.data_of(page_data);
				processed_data.data_of(title, revid);

				// page_data is new than processed data

				// main task...

				// 成功才登记。失败则下次重试。
				processed_data.remove(title);

				// 可能中途 killed, crashed，因此尚不能 write_processed()，
				// 否则会把 throw 的当作已处理过。
			}

			function finish_work() {
				// 由于造出 data 的时间过长，可能丢失 token，
				// 因此将 processed_data 放在 finish_work() 阶段。
				processed_data.renew();
			}

			function onfail() {
				// 确保没有因特殊错误产生的漏网之鱼。
				titles.unique().forEach(processed_data.remove, processed_data);
			}

			// Finally: Write to cache file.
			processed_data.write();
		})();
	}

	/**
	 * 记录处理过的文章。
	 * 
	 * @param {String}cache_file_path
	 *            记录处理过的文章。
	 * @param {Object}[options]
	 *            附加参数/设定选择性/特殊功能与选项
	 * 
	 * @constructor
	 */
	function revision_cacher(cache_file_path, options) {
		this.read(cache_file_path, options);
	}

	revision_cacher.prototype = {
		KEY_DATA : 'data',
		// id or 'revid'
		KEY_ID : 'id',
		encoding : wiki_API.encoding,
		// 连续跳过超过此页面数 .show_skip 则会显示讯息。
		show_skip : 9,

		// renew cache data
		renew : function() {
			// Object.create(null)
			this[this.KEY_DATA] = {};
		},
		read : function(cache_file_path, options) {
			if (typeof cache_file_path === 'object' && !options) {
				options = cache_file_path;
				cache_file_path = options.file;
			}
			if (cache_file_path) {
				this.file = cache_file_path;
			}

			var setup_new;
			if (options === true) {
				setup_new = false;
				options = {
					// Do NOT discard old data, use the old one.
					// 保存旧资料不废弃。
					// 为了预防 this[this.KEY_DATA] 肥大，一般应将旧资料放在 this.cached，
					// 本次新处理的才放在 this[this.KEY_DATA]。
					preserve : true
				};
			} else {
				options = library_namespace.setup_options(options);
				setup_new = !options.preserve;
			}

			// this.options = options;

			// for .id_only, .KEY_ID, .encoding, .show_skip
			Object.assign(this, options);

			// reset skipped_count
			// this.skipped = 0;
			// 连续跳过计数。
			if (this.show_skip > 0) {
				this.continuous_skip = 0;
			}

			/**
			 * {Object}旧资料/旧结果报告。
			 * 
			 * cached_data[local page title] = { this.KEY_ID : 0,
			 * user_defined_data }
			 * 
			 * if set .id_only, then:<br />
			 * cached_data[local page title] = {Natural}revid<br />
			 * 这可进一步减少空间消耗。cached_data cache 已经处理完成操作的 data，但其本身可能也会占用一些以至大量RAM。
			 */
			var cached_data;
			try {
				cached_data = node_fs.readFileSync(cache_file_path,
						this.encoding);
			} catch (e) {
				// nothing get.
			}
			cached_data = cached_data && JSON.parse(cached_data) || {};
			this.cached = cached_data;

			if (setup_new) {
				Object.seal(cached_data);
				this.renew();
			} else {
				// this[this.KEY_DATA]: processed data
				this[this.KEY_DATA] = cached_data;
			}
		},
		write : function(cache_file_path, callback) {
			node_fs.writeFile(cache_file_path || this.file, JSON
					.stringify(this[this.KEY_DATA]), this.encoding, function(
					error) {
				// 因为此动作一般说来不会影响到后续操作，因此采用同时执行。
				library_namespace.debug('Write to cache file: done.', 1,
						'revision_cacher.write');
				if (typeof callback === 'function')
					callback(error);
			});
			return;

			node_fs.writeFileSync(cache_file_path || this.file, JSON
					.stringify(this[this.KEY_DATA]), this.encoding);
			library_namespace.debug('Write to cache file: done.', 1,
					'revision_cacher.write');
			if (typeof callback === 'function')
				callback(error);
		},

		// 注意: 若未 return true，则表示 page_data 为正规且 cache 中没有，或较 cache 新的页面资料。
		had : function(page_data) {
			// page_data 为正规?
			if (!wiki_API.content_of.page_exists(page_data)) {
				// error? 此页面不存在/已删除。
				return 'not exists';
			}

			var
			/** {String}page title = page_data.title */
			title = wiki_API.title_of(page_data),
			/** {Natural}所取得之版本编号。 */
			revid = wiki_API.content_of.revision(page_data);
			if (revid) {
				revid = revid.revid;
			}

			// console.log(CeL.wiki.content_of(page_data));

			library_namespace.debug(wiki_API.title_link_of(title) + ' revid '
					+ revid, 4, 'revision_cacher.had');
			if (title in this.cached) {
				var this_data = this[this.KEY_DATA], setup_new = this_data !== this.cached,
				//
				cached = this.cached[title], cached_revid = this.id_only ? cached
						: cached[this.KEY_ID];
				library_namespace.debug(wiki_API.title_link_of(title)
						+ ' cached revid ' + cached_revid, 4,
						'revision_cacher.had');
				if (cached_revid === revid) {
					if (setup_new) {
						// copy old data.
						// assert: this_data[title] is modifiable.
						this_data[title] = cached;
					}
					// this.skipped++;
					this.continuous_skip++;
					library_namespace.debug('Skip ' + this.continuous_skip
							+ ': ' + wiki_API.title_link_of(title) + ' revid '
							+ revid, 2, 'revision_cacher.had');
					return true;
				}
				// assert: cached_revid < revid
				// rebuild data
				if (setup_new) {
					delete this_data[title];
				}
				// 因为要显示连续跳过计数资讯，因此不先跳出。
				// return false;
			}

			if (this.continuous_skip > 0) {
				if (this.continuous_skip > this.show_skip) {
					library_namespace.debug(
					// 实际运用时，很少会到这边。
					'Skip ' + this.continuous_skip + ' pages.', 1,
							'revision_cacher.had');
				}
				this.continuous_skip = 0;
			}
		},
		// 注意: 只有经过 .data_of() 的才造出新实体。
		// 因此即使没有要取得资料，也需要呼叫一次 .data_of() 以造出新实体、登记 page_data 之 revid。
		data_of : function(page_data, revid) {
			var this_data = this[this.KEY_DATA],
			/** {String}page title = page_data.title */
			title = typeof page_data === 'string' ? page_data : wiki_API
					.title_of(page_data);

			if (title in this_data) {
				return this_data[title];
			}

			// 登记 page_data 之 revid。
			if (!revid && (!(revid = wiki_API.content_of.revision(page_data))
			/** {Natural}所取得之版本编号。 */
			|| !(revid = revid.revid))) {
				library_namespace.error('revision_cacher.data_of: '
				// 照理来说，会来到这里的都应该是经过 .had() 确认，因此不该出现此情况。
				+ 'No revision id (.revid): (' + (typeof page_data) + ') '
						+ JSON.stringify(page_data).slice(0, 800));
				return;
			}

			if (this.id_only) {
				// 注意: 这个时候回传的不是 {Object}
				return this_data[title] = revid;
			}

			/** {Object}本页之 processed data。 */
			var data = this_data[title] = {};
			data[this.KEY_ID] = revid;
			return data;
		},
		remove : function(page_data) {
			var this_data = this[this.KEY_DATA],
			/** {String}page title = page_data.title */
			title = typeof page_data === 'string' ? page_data : wiki_API
					.title_of(page_data);

			if (title in this_data) {
				delete this_data[title];
			}
		}
	};

	// ------------------------------------------------------------------------

	function get_path_of_category(file_name, options) {
		options = library_namespace.setup_options(options);
		var category = this;
		var session = wiki_API.session_of_options(options);

		var path = [ session.remove_namespace(category.title) ];
		while (category.parent_categories) {
			var _category = category.parent_categories[0];
			category.parent_categories.forEach(function(__category) {
				if (__category.depth < _category.depth)
					_category = __category;
			});
			category = _category;
			path.unshift(session.remove_namespace(category.title));
		}

		var directory = path.join(library_namespace.env.path_separator);
		if (options.directory) {
			directory = library_namespace.append_path_separator(
					options.directory, directory);
		}
		if (options.create_directory !== false
				&& !library_namespace.directory_exists(directory)) {
			library_namespace.create_directory(directory,
					options.create_directory || {
						recursive : true
					});
		}

		if (file_name)
			path.push(session.remove_namespace(file_name));
		path = path.join(library_namespace.env.path_separator);
		// console.trace([ directory, path ]);
		return path;
	}

	if (false) {
		/**
		 * <code>
		When executing `session.download('Category:name', ...)`,
		wiki_API_download() will:
		# Get category tree without files, using session.category_tree(). session.category_tree() will use categoryinfo and categorymembers (category only) to increase speed.
		# Back to wiki_API_download(). For each category, get file_info (imageinfo with URL, latest date) with generator:categorymembers to get files in category.
		# For each file, check the file name and timestamp (get from generator:categorymembers), only download new file. (function download_next_file with options.max_threads)
		</code>
		 */
		wiki_session.download('Category:name', {
			directory : './',
			max_threads : 4,
			// depth of categories
			depth : 4,
			// Only download files with these formats.
			// download_derivatives : ['wav', 'mp3', 'ogg'],
			// Warning: Will skip downloading if there is no new file!
			download_derivatives : 'mp3',
			// A function to filter result pages. Return `true` if you want to
			// keep the element.
			page_filter : function(page_data) {
				return page_data.title.includes('word');
			}
		}, function(file_data_list, error) {
		});
		wiki_session.download('File:name', {
			directory : './'
		}, function(file_data, error) {
		});
	}

	// Download files to local path.

	// TODO:
	// 镜像: 从本地目录中删除远端不存在的文件
	// https://commons.wikimedia.org/w/api.php?action=help&modules=query%2Bvideoinfo
	// https://commons.wikimedia.org/w/api.php?action=help&modules=query%2Btranscodestatus
	// https://commons.wikimedia.org/w/api.php?action=help&modules=query%2Bstashimageinfo

	// wiki_API.download()
	// wiki_session.download(file_title, local_path || options, callback);
	function wiki_API_download(titles, options, callback) {
		// Download non-vector version of .svg
		// @see https://phabricator.wikimedia.org/T60663
		// wiki_session.download('File:Example.svg',{width:100});

		// assert: this: session
		var session = this;

		// console.trace(next);
		if (typeof titles === 'string' || wiki_API.is_page_data(titles)) {
			if (session.is_namespace(titles, 'Category')) {
				// Get category tree without files, using
				// session.category_tree().
				session.category_tree(titles, function(list, error) {
					if (error) {
						callback(undefined, error);
					} else {
						// assert: list.list_type === 'category_tree'
						wiki_API_download
								.call(session, list, options, callback);
					}
				},
				// pass options.depth: depth of categories
				Object.assign({
					namespace : 'Category',
					set_attributes : true
				}, options));
				return;
			}

			titles = [ titles ];
		} else if (!Array.isArray(titles)
				&& !(library_namespace.is_Object(titles) && titles[wiki_API.KEY_generator_title])) {
			session.next(callback, titles, new Error('Invalid file_title!'));
			return;
		}

		if (titles.list_type === 'category_tree' && !options.no_category_tree
		// && session.is_namespace(titles.namespace, 'Category')
		) {
			// Back to wiki_API_download(). For each category, get file_info
			// (imageinfo with URL, latest date) with generator:categorymembers
			// to get files in category.
			if (!titles.categories_to_process) {
				titles.categories_to_process = Object
						.values(titles.flat_subcategories);
				titles.categories_to_process.total_length = titles.categories_to_process.length;
				// options = library_namespace.new_options(options);
				wiki_API.add_session_to_options(session, options);
				options.download_file_to
				// Will create directory structure for download files.
				= function(file_url, page_data, index, pages, options) {
					// console.trace(pages);
					// console.trace(titles.flat_subcategories);
					// console.trace(pages.title);
					// console.trace(session.remove_namespace(pages.title[wiki_API.KEY_generator_title]));
					var category = titles.flat_subcategories[session
							.remove_namespace(pages.title[wiki_API.KEY_generator_title])];
					// console.trace([page_data, category]);
					var file_path = decodeURIComponent(file_url
							.match(/[^\\\/]+$/)[0]);
					file_path = get_path_of_category.call(category, file_path,
							options);
					// console.trace(file_path);
					return file_path;
				};
			}
			if (titles.categories_to_process.length === 0) {
				session.next(callback, titles);
				return;
			}
			var categories_to_process = titles.categories_to_process.pop();
			library_namespace
					.info('wiki_API_download: '
							+ (titles.categories_to_process.total_length - titles.categories_to_process.length)
							+ '/'
							+ titles.categories_to_process.total_length
							+ ' '
							+ wiki_API
									.title_link_of(categories_to_process.title)
							+ '	of ' + wiki_API.title_link_of(titles.title));
			wiki_API_download.call(session, wiki_API.generator_parameters(
					'categorymembers', {
						title : categories_to_process.title,
						namespace : session.namespace('File'),
						limit : 'max'
					}), options, wiki_API_download.bind(session, titles,
					options, callback));
			return;
		}

		if (false && titles.length < 5000) {
			// 不处理这个部分以节省资源。
			titles = titles.map(function(page) {
				// assert: page title starts with "File:"
				return session.normalize_title(page.title || page);
			}).filter(function(page_title) {
				return !!page_title;
			}).unique();
		}

		if (titles.length === 0) {
			library_namespace.debug('No file to download.', 1,
					'wiki_API_download');
			session.next(callback, titles);
			return;
		}

		if (typeof options === 'string') {
			options = titles.length > 1 ? {
				directory : options
			} : {
				file_name : options
			};
		} else {
			options = library_namespace.new_options(options);
		}

		// ----------------------------------------------------------

		var file_info_type = options.file_info_type
				|| (options.download_derivatives ? 'videoinfo' : 'imageinfo');
		if (options.download_derivatives && file_info_type !== 'videoinfo') {
			library_namespace
					.warn('wiki_API_download: '
							+ 'You should set options.file_info_type = "videoinfo" for downloading derivatives!');
		}

		var threads_now = 0;
		// For each file, check the file name and timestamp (get from
		// generator:categorymembers), only download new file.
		function download_next_file(data, error, XMLHttp) {
			var page_data;
			if (options.index > 0 && (page_data = titles[options.index - 1])) {
				// cache file name really writed to
				// @see function get_URL_cache_node()
				if (XMLHttp && XMLHttp.cached_file_path) {
					page_data.cached_file_path = XMLHttp.cached_file_path;
				}
				if (error === library_namespace.get_URL_cache.NO_NEWS) {
					page_data.no_new_data = true;
				} else if (error) {
					page_data.error = error;
					titles.error_titles.push([ page_data.title, error ]);
					library_namespace.error('Cannot download '
							+ page_data.title + ': ' + error);
				}
			}

			// console.trace([ threads_now, options.index, titles.length ]);
			if (options.index >= titles.length) {
				if (threads_now === 0) {
					// All titles downloaded.
					session.next(callback, titles,
							titles.error_titles.length > 0
									&& titles.error_titles);
				}
				return;
			}

			// ----------------------------------
			// prepare to download

			page_data = titles[options.index++];
			// console.trace(titles);
			// console.trace([ options.index, page_data ]);
			// assert: !!page_data === true
			var file_info = page_data && page_data[0];
			if (!file_info) {
				if (page_data) {
					titles.error_titles.push([ page_data && page_data.title,
							'No file_info get' ]);
					library_namespace.error('Cannot download '
							+ page_data.title + (error ? ': ' + error : ''));
				}
				download_next_file();
				return;
			}

			// download newer only
			// console.trace(file_info);
			options.web_resource_date = file_info.timestamp;

			// console.trace(page_data);
			// console.trace(file_info);

			// @see
			// [[Commons:FAQ#What_are_the_strangely_named_components_in_file_paths?]]
			// to get the URL directly.
			var file_url = file_info.thumburl || file_info.url;
			var file_url_list = options.download_derivatives;

			if (!file_url_list || !Array.isArray(file_info.derivatives)) {
				download_file(file_url, true);
				return;
			}

			// --------------------------------------------

			// console.trace([ file_url_list, file_info ]);
			if (typeof file_url_list === 'function')
				file_url_list = file_url_list(page_data);

			file_url = Array.isArray(file_url_list) ? file_url_list
					: [ file_url_list ];
			file_url_list = [];
			file_url.forEach(function(file_url) {
				if (typeof file_url !== 'string')
					return;

				if (file_url.startsWith('https://')) {
					file_url_list.push(file_url);
					return;
				}

				file_url = file_url.toLowerCase();
				file_info.derivatives.forEach(function(media_info) {
					// e.g., type: 'audio/ogg; codecs="vorbis"'
					if (media_info.type.toLowerCase().startsWith(file_url)
					// e.g., shorttitle: 'WAV source'
					|| media_info.shorttitle.toLowerCase()
					// e.g., shorttitle: 'Ogg Vorbis'
					.startsWith(file_url) || media_info.transcodekey
					// e.g., transcodekey: 'mp3'
					&& media_info.transcodekey.toLowerCase() === file_url) {
						file_url_list.push(media_info.src);
					}
				});
			});
			// console.trace(file_url_list);

			if (file_url_list.length === 0) {
				// 放弃下载本档案。
				download_next_file();
				return;
			}

			// Release memory. 释放被占用的记忆体。
			file_url = null;

			// 警告: 这边会自动产生多线程下载!
			file_url_list.forEach(function(file_url, index) {
				download_file(file_url,
				//
				index === file_url_list.length);
			});
		}

		function download_file(file_url, multi_threads) {
			// console.trace([ file_url, options ]);

			var error;
			// !see options.file_name_processor @ function get_URL_cache_node()
			if (typeof options.download_file_to === 'function') {
				var index = options.index - 1;
				try {
					options.file_name = options.download_file_to(file_url,
							titles[index], index, titles, options);
				} catch (e) {
					error = e;
					console.error(e);
					titles.error_titles.push([ page_data.title, e ]);
				}
			}

			if (!error) {
				threads_now++;
				library_namespace.get_URL_cache(file_url, function() {
					threads_now--;
					download_next_file.apply(null, arguments);
				}, options);
			}

			if (multi_threads
					&& (options.index < titles.length ? threads_now < options.max_threads
							: threads_now === 0)) {
				download_next_file();
			}
		}

		// https://commons.wikimedia.org/w/api.php?action=help&modules=query%2Bimageinfo
		var file_info_options = Object.assign({
			type : file_info_type,
			// 'url|size|mime|timestamp'
			iiprop : 'url|timestamp',
			viprop : 'url|timestamp|derivatives',
			page_filter : options.page_filter,
			multi : true
		}, options.file_info_options);
		if (options.width > 0)
			file_info_options.iiurlwidth = options.width;
		if (options.height > 0)
			file_info_options.iiurlheight = options.height;

		// console.trace(file_info_options);
		// page title to raw data URL
		wiki_API.list(titles, function(pages, target) {
			// console.trace([pages, target, options]);
			if (pages.error) {
				session.next(callback, titles, pages.error);
				return;
			}
			// console.trace([ pages, file_info_options ]);
			titles = pages;
			options.index = 0;
			titles.error_titles = [];
			// console.trace(titles);
			download_next_file();
		}, wiki_API.add_session_to_options(session, file_info_options));
	}

	// ------------------------------------------------------------------------

	// export 导出.

	// @static
	Object.assign(wiki_API, {
		download : wiki_API_download,

		parse_dump_xml : parse_dump_xml,
		traversal : traversal_pages,

		revision_cacher : revision_cacher
	});

	return wiki_API_page;
}
