/**
 * @name CeL function for MediaWiki (Wikipedia / 维基百科): edit
 * 
 * @fileoverview 本档案包含了 MediaWiki 自动化作业用程式库的子程式库。
 * 
 * TODO:<code>


</code>
 * 
 * @since 2019/10/11 拆分自 CeL.application.net.wiki
 */

// More examples: see /_test suite/test.js
// Wikipedia bots demo: https://github.com/kanasimi/wikibot
'use strict';
// 'use asm';

// --------------------------------------------------------------------------------------------

// 不采用 if 陈述式，可以避免 Eclipse JSDoc 与 format 多缩排一层。
typeof CeL === 'function' && CeL.run({
	// module name
	name : 'application.net.wiki.edit',

	require : 'application.net.wiki.'
	// load MediaWiki module basic functions
	+ '|application.net.wiki.namespace.'
	// for BLANK_TOKEN
	+ '|application.net.wiki.task.'
	//
	+ '|application.net.wiki.page.',

	// 设定不汇出的子函式。
	no_extend : 'this,*',

	// 为了方便格式化程式码，因此将 module 函式主体另外抽出。
	code : module_code
});

function module_code(library_namespace) {

	// requiring
	var wiki_API = library_namespace.application.net.wiki, KEY_SESSION = wiki_API.KEY_SESSION;

	// @inner
	var PATTERN_category_prefix = wiki_API.PATTERN_category_prefix, BLANK_TOKEN = wiki_API.BLANK_TOKEN;

	var gettext = library_namespace.cache_gettext(function(_) {
		gettext = _;
	});

	// ------------------------------------------------------------------------

	/**
	 * check if need to stop / 检查是否需要紧急停止作业 (Emergency shutoff-compliant).
	 * 
	 * 此功能之工作机制/原理：<br />
	 * 在 .edit() 编辑（机器人执行作业）之前，先检查是否有人在紧急停止页面留言要求停止作业。<br />
	 * 只要在紧急停止页面有指定的章节标题、或任何章节，就当作有人留言要停止作业，并放弃编辑。
	 * 
	 * TODO:<br />
	 * https://www.mediawiki.org/w/api.php?action=query&meta=userinfo&uiprop=hasmsg
	 * 
	 * @param {Function}callback
	 *            回调函数。 callback({Boolean}need stop)
	 * @param {Object}[options]
	 *            附加参数/设定选择性/特殊功能与选项
	 * 
	 * @see https://www.mediawiki.org/wiki/Manual:Parameters_to_index.php#Edit_and_submit
	 *      https://www.mediawiki.org/wiki/Help:Magic_words#URL_encoded_page_names
	 *      https://www.mediawiki.org/wiki/Help:Links
	 *      https://zh.wikipedia.org/wiki/User:Cewbot/Stop
	 */
	wiki_API.check_stop = function(callback, options) {
		// 前置处理。
		if (!library_namespace.is_Object(options))
			if (typeof options === 'string') {
				options = {
					title : options
				};
			} else {
				options = Object.create(null);
			}

		/**
		 * 紧急停止作业将检测之页面标题。 check title:<br />
		 * 只检查此紧急停止页面。
		 * 
		 * @type {String}
		 */
		var title = options.title;
		if (typeof title === 'function') {
			title = title(options.token);
		}
		if (!title && !(title = wiki_API.check_stop.title(options.token))) {
			callback();
			return;
		}

		library_namespace.debug({
			// gettext_config:{"id":"check-the-emergency-stop-page-$1"}
			T : [ '检查紧急停止页面 %1', wiki_API.title_link_of(title) ]
		}, 1, 'wiki_API.check_stop');

		var session = options[KEY_SESSION] || this;
		wiki_API.page([ session.API_URL, title ], function(page_data) {
			var content = wiki_API.content_of(page_data),
			// default: NOT stopped
			stopped = false, PATTERN;

			if (!content) {
				library_namespace.info([ 'wiki_API.check_stop: ', {
					// gettext_config:{"id":"the-emergency-stop-page-was-not-found-($1)"}
					T : [ 'The emergency stop page was not found (%1).',
					//
					wiki_API.title_link_of(title) ]
				}, {
					// gettext_config:{"id":"the-operation-will-proceed-as-usual"}
					T : 'The operation will proceed as usual.'
				} ]);

			} else if (typeof options.checker === 'function') {
				// 以 options.checker 的回传来设定是否stopped。
				stopped = options.checker(content);
				if (stopped) {
					library_namespace.warn([ 'wiki_API.check_stop: ', {
						// gettext_config:{"id":"emergency-stop-edit-has-been-set"}
						T : '已设定紧急停止编辑作业！'
					} ]);
				}
				content = null;

			} else {
				// 指定 pattern
				PATTERN = options.pattern
				// options.section: 指定的紧急停止章节标题, section title to check.
				/** {String}紧急停止作业将检测之章节标题。 */
				|| options.section
				/**
				 * for == 停止作业: 20150503 机器人作业 == <code>
				 * (new RegExp('\n==(.*?)' + '20150503' + '\\s*==\n')).test('\n== 停止作业:20150503 ==\n') === true
				 * </code>
				 */
				&& new RegExp('\n==(.*?)' + options.section + '(.*?)==\n');
			}

			if (content) {
				if (!library_namespace.is_RegExp(PATTERN)) {
					// use default pattern
					PATTERN = wiki_API.check_stop.pattern;
				}
				library_namespace.debug(
				//
				'wiki_API.check_stop: 采用 pattern: ' + PATTERN);
				stopped = PATTERN.test(content, page_data);
				if (stopped) {
					library_namespace.warn([ 'wiki_API.check_stop: ', {
						// gettext_config:{"id":"there-is-a-messages-on-the-emergency-stop-page-$1-to-stop-the-editing-operation"}
						T : [ '紧急停止页面 %1 有留言要停止编辑作业！',
						//
						wiki_API.title_link_of(title) ]
					} ]);
				}
			}

			callback(stopped);
		}, options);
	};

	/**
	 * default page title to check:<br />
	 * [[{{TALKSPACE}}:{{ROOTPAGENAME}}/Stop]]
	 * 
	 * @param {Object}token
	 *            login 资讯，包含“csrf”令牌/密钥。
	 * 
	 * @returns {String}
	 */
	wiki_API.check_stop.title = function(token) {
		return token.login_user_name ? 'User talk:' + token.login_user_name
				+ '/Stop' : '';
	};

	/**
	 * default check pattern: 任何章节/段落 section<br />
	 * default: 只要在紧急停止页面有任何章节，就当作有人留言要求 stop。
	 * 
	 * @type {RegExp}
	 */
	wiki_API.check_stop.pattern = /\n=(.+?)=\n/;

	// ------------------------------------------------------------------------

	// [[Help:Edit summary]] actual limit is 500 [[Unicode codepoint]]s.
	function add_section_to_summary(summary, section_title) {
		if (!section_title)
			return summary || '';
		// 所有"/*锚点*/"注解都会 .trim() 后转成网页锚点连结。
		return '/* ' + section_title + ' */ ' + (summary || '');
	}

	/**
	 * 编辑页面。一次处理一个标题。<br />
	 * 警告:除非 text 输入 {Function}，否则此函数不会检查页面是否允许机器人帐户访问！此时需要另外含入检查机制！
	 * 
	 * 2016/7/17 18:55:24<br />
	 * 当采用 section=new 时，minor=1 似乎无效？
	 * 
	 * @example <code>

	// 2021/10/7 13:29:12

	// Create new page with template.
	const variable_Map = new CeL.wiki.Variable_Map({ FC_list: '* 1\n* 2' });
	variable_Map.template = function (page_data) {
		// Will run at the page created.
		// assert: !wiki_API.content_of(page_data) === true;
		return 'FC_list:\n' + this.format('FC_list');
	};
	await wiki.edit_page(new_page_title, variable_Map, { summary: 'test' });


	// Update page only (must setup manually first)
	const variable_Map = new CeL.wiki.Variable_Map({ FC_list: '* 1\n* 2' });
	// setup manually
	await wiki.edit_page('Wikipedia:沙盒', p => p.wikitext + '\nFC_list:\n' + variable_Map.format('FC_list'), { summary: 'test' });
	variable_Map.set('FC_list', '*2\n*3');
	await wiki.edit_page('Wikipedia:沙盒', variable_Map, { summary: 'test' });

	</code>
	 * 
	 * @param {String|Array}title
	 *            page title 页面标题。 {String}title or [ {String}API_URL,
	 *            {String}title or {Object}page_data ]
	 * @param {String|Function}text
	 *            page contents 页面内容。 {String}text or {Function}text(page_data)
	 * @param {Object}token
	 *            login 资讯，包含“csrf”令牌/密钥。
	 * @param {Object}[options]
	 *            附加参数/设定选择性/特殊功能与选项
	 * @param {Function}callback
	 *            回调函数。 callback(page_data, {String|any}error, result)
	 * @param {String}timestamp
	 *            页面时间戳记。 e.g., '2015-01-02T02:52:29Z'
	 * 
	 * @see https://www.mediawiki.org/w/api.php?action=help&modules=edit
	 */
	function wiki_API_edit(title, text, token, options, callback, timestamp) {
		var action = {
			action : 'edit'
		};
		if (wiki_API.need_get_API_parameters(action, options,
				wiki_API[action.action], arguments)) {
			return;
		}

		// console.trace(title);
		// console.log(text);
		if (library_namespace.is_thenable(text)) {
			if (library_namespace.is_debug(3))
				console.trace(text);
			text = text.then(function(text) {
				// console.trace(text);
				wiki_API_edit(title, text, token, options, callback,
				//
				timestamp);
			}, function(error) {
				callback(title, error);
			});
			var session = wiki_API.session_of_options(options);
			if (session && session.running) {
				if (false) {
					console.trace(session.actions);
					console.trace(session.actions[0]);
					console.trace('wiki_API_edit: '
							+ 'Calling wiki_API.prototype.next() '
							+ [ session.running, session.actions.length ]);
					text.then(function(text) {
						console.trace(text);
					});
				}
				session.next(/* promise */text);
			}
			return;
		}

		var is_undo = options && options.undo;
		if (is_undo) {
			// 一般 undo_count 超过1也不一定能成功？因此设定输入 {undo:1} 时改 {undo:true} 亦可。
			if (is_undo === true) {
				options.undo = is_undo = 1;
			} else if (!(is_undo >= 1)) {
				delete options.undo;
			}
		}

		var undo_count = options
				&& (options.undo_count || is_undo
						&& (is_undo < wiki_API_edit.undo_count_limit && is_undo));

		if (wiki_API.Variable_Map.is_Variable_Map(text)) {
			// 对于新创或空白页面，应已设定 {String}text.template。
			text = text.to_page_text_updater();
		}

		if (undo_count || typeof text === 'function') {
			library_namespace.debug('先取得内容再 edit / undo '
					+ wiki_API.title_link_of(title) + '。', 1, 'wiki_API_edit');
			// console.log(title);
			var _options;
			if (undo_count) {
				_options = Object.clone(options);
				_options.get_page_before_undo = true;
				if (!_options.rvlimit) {
					_options.rvlimit = undo_count;
				}
				if (!_options.rvprop) {
					_options.rvprop =
					// user: 提供 user name 给 text() 用。
					typeof text === 'function' ? 'ids|timestamp|user'
					// 无须 content，尽量减少索求的资料量。
					: 'ids|timestamp';
				}
			} else {
				_options = Object.clone(options);
				delete _options.rollback_action;
			}

			wiki_API.page(title, function(page_data, error) {
				if (options && (!options.ignore_denial
				// TODO: 每经过固定时间，或者编辑特定次数之后，就再检查一次。
				&& wiki_API_edit.denied(page_data, options.bot_id,
				// 若您不想接受机器人的通知、提醒或警告，请使用{{bots|optout=notification_name}}模板。
				// Please using {{bots|optout=notification_name}},
				// the bot will skip this page.
				options.notification_name))) {
					library_namespace.warn([ 'wiki_API_edit: ', {
						// gettext_config:{"id":"editing-of-$1-has-been-rejected-$2"}
						T : [ 'Editing of %1 has been rejected: %2',
						//
						wiki_API.title_link_of(page_data),
						//
						options.notification_name ]
					} ]);
					callback(page_data, 'denied');

				} else {
					// @see wiki_API.prototype.next()
					if (false) {
						console.trace('Set .page_to_edit: '
								+ wiki_API.title_link_of(page_data) + ' ('
								+ title + ')' + ' ('
								+ wiki_API.title_link_of(options.page_to_edit)
								+ ')');
						console.trace(options);
					}
					if (options) {
						if (!page_data && !error) {
							console.trace('No page_data or error set!');
							throw new Error('wiki_API_edit: '
							//
							+ 'No page_data or error set!');
						}
						options.page_to_edit = page_data;
						options.last_page_error = error;
						if (undo_count) {
							delete options.undo_count;
							// page_data =
							// {pageid:0,ns:0,title:'',revisions:[{revid:0,parentid:0,user:'',timestamp:''},...]}
							var revision = wiki_API.content_of
									.revision(page_data);
							if (revision) {
								timestamp = revision.timestamp;
								// 指定 rev_id 版本编号。
								options.undo = revision.revid;
							}
							options.undoafter = page_data.revisions
							// get the oldest revision
							.at(-1).parentid;
						}
					}

					// 这里不直接指定 text，是为了使(回传要编辑资料的)设定值函数能即时依page_data变更 options。
					if (undo_count) {
						// text = '';
					}
					if (typeof text === 'function') {
						// or: text(wiki_API.content_of(page_data),
						// page_data.title, page_data)
						// .call(options,): 使(回传要编辑资料的)设定值函数能以this即时变更 options。
						// 注意: 更改此介面需同时修改 wiki_API.prototype.work 中 'edit' 之介面。
						text = text.call(options, page_data);
					}
					// 需要同时改变 wiki_API.prototype.next！
					wiki_API_edit(title, text, token, options, callback,
							timestamp);
				}
			}, _options);
			return;
		}

		// assert: typeof text === 'string'

		if (options.discard_changes) {
			// 手动放弃修改。
			text = [ wiki_API_edit.cancel, text || options.discard_changes ];
		}

		var not_passed = !is_undo
				&& wiki_API_edit.check_data(text, title, options,
						'wiki_API_edit');
		if (not_passed) {
			library_namespace.debug('直接执行 callback。', 2, 'wiki_API_edit');
			// console.trace([not_passed, text]);
			callback(title, options.error_with_symbol ? text : not_passed);
			return;
		}

		// 处理 [ {String}API_URL, {String}title or {Object}page_data ]
		if (Array.isArray(title)) {
			action = [ title[0], action ];
			title = title[1];
		}
		if (options && options.write_to) {
			// 设定写入目标。一般为 debug、test 测试期间用。
			// e.g., write_to:'Wikipedia:沙盒',
			title = options.write_to;
			library_namespace.debug('依 options.write_to 写入至 '
					+ wiki_API.title_link_of(title), 1, 'wiki_API_edit');
		}

		// 造出可 modify 的 options。
		if (options) {
			library_namespace.debug('#1: ' + Object.keys(options).join(','), 4,
					'wiki_API_edit');
		}
		// 前置处理。
		if (is_undo) {
			options = library_namespace.setup_options(options);
		} else {
			options = Object.assign({
				text : text
			}, options);
		}
		if (wiki_API.is_page_data(title)) {
			// 将 {Object}page_data 最新版本的 timestamp 标记注记到 options 去。
			wiki_API_edit.set_stamp(options, title);
			if (title.pageid)
				options.pageid = title.pageid;
			else
				options.title = title.title;
		} else {
			options.title = title;
		}
		if (timestamp || options.page_to_edit) {
			// 若是 timestamp 并非最新版，则会放弃编辑。
			wiki_API_edit.set_stamp(options, timestamp);
		}
		if (options.sectiontitle && options.section !== 'new') {
			options.summary = add_section_to_summary(options.summary,
					options.sectiontitle);
			delete options.sectiontitle;
		}

		// the token should be sent as the last parameter.
		library_namespace.debug('options.token = ' + JSON.stringify(token), 6,
				'wiki_API_edit');
		options.token = (library_namespace.is_Object(token)
		//
		? token.csrftoken : token) || BLANK_TOKEN;
		library_namespace.debug('#2: ' + Object.keys(options).join(','), 4,
				'wiki_API_edit');

		var post_data = wiki_API.extract_parameters(options, action);

		wiki_API.query(action, function(data, error) {
			// console.log(data);
			if (error) {
			} else if (data.error) {
				// 检查 MediaWiki 伺服器是否回应错误资讯。
				error = data.error;
				error.toString = wiki_API.query.error_toString;
			} else if (data.edit && data.edit.result !== 'Success') {
				error = {
					code : data.edit.result,
					info : data.edit.info
					/**
					 * 新用户要输入过多或特定内容如 URL，可能遇到:<br />
					 * [Failure] 必需输入验证码
					 */
					|| (data.edit.captcha ? '必需输入验证码'

					/**
					 * 垃圾连结 [[MediaWiki:Abusefilter-warning-link-spam]] e.g.,
					 * youtu.be, bit.ly
					 * 
					 * @see 20170708.import_VOA.js
					 */
					: data.edit.spamblacklist
					//
					? 'Contains spam link 包含被列入黑名单的连结: '
					//
					+ data.edit.spamblacklist
					//
					: JSON.stringify(data.edit)),
					toString : wiki_API.query.error_toString
				};
			}

			if (error || !data) {
				/**
				 * <code>
				wiki_API_edit: Error to edit [User talk:Flow]: [no-direct-editing] Direct editing via API is not supported for content model flow-board used by User_talk:Flow
				wiki_API_edit: Error to edit [[Wikiversity:互助客栈/topic list]]: [tags-apply-not-allowed-one] The tag "Bot" is not allowed to be manually applied.
				[[Wikipedia:首页/明天]]是连锁保护
				wiki_API_edit: Error to edit [[Wikipedia:典范条目/2019年1月9日]]: [cascadeprotected] This page has been protected from editing because it is transcluded in the following page, which is protected with the "cascading" option turned on: * [[:Wikipedia:首页/明天]]
				 * </code>
				 * 
				 * @see https://doc.wikimedia.org/mediawiki-core/master/php/ApiEditPage_8php_source.html
				 */
				if (!data || !data.error) {
				} else if (data.error.code === 'no-direct-editing'
				// .section: 章节编号。 0 代表最上层章节，new 代表新章节。
				&& options.section === 'new') {
					library_namespace.debug({
						// gettext_config:{"id":"unable-to-edit-in-the-normal-way-so-try-it-as-a-flow-discussion-page"}
						T : '无法以正常方式编辑，尝试当作 Flow 讨论页面。'
					}, 1, 'wiki_API_edit');
					// console.log(options);
					// edit_topic()
					wiki_API.Flow.edit(title,
					// 新章节/新话题的标题文字。输入空字串""的话，会用 summary 当章节标题。
					options.sectiontitle,
					// [[mw:Flow]] 会自动签名，因此去掉签名部分。
					text.replace(/[\s\n\-]*~~~~[\s\n\-]*$/, ''), options.token,
							options, callback);
					return;
				} else if (data.error.code === 'missingtitle') {
					// "The page you specified doesn't exist."
					// console.log(options);
				}
				/**
				 * <del>遇到过长/超过限度的页面 (e.g., 过多 transclusion。)，可能产生错误：<br />
				 * [editconflict] Edit conflict detected</del>
				 * 
				 * when edit:<br />
				 * [contenttoobig] The content you supplied exceeds the article
				 * size limit of 2048 kilobytes
				 * 
				 * 页面大小系统上限 2,048 KB = 2 MB。
				 * 
				 * 须注意是否有其他竞相编辑的 bots。
				 */
				library_namespace.warn([ 'wiki_API_edit: ', {
					// gettext_config:{"id":"failed-to-edit-the-page-$1-$2"}
					T : [ 'Failed to edit the page %1: %2',
					//
					wiki_API.title_link_of(title), String(error) ]
				} ]);
			} else if (data.edit && ('nochange' in data.edit)) {
				// 在极少的情况下，data.edit === undefined。
				library_namespace.info([ 'wiki_API_edit: ', {
					// gettext_config:{"id":"no-changes-to-page-content-$1"}
					T : [ 'No changes to page content: %1',
					//
					wiki_API.title_link_of(title) ]
				} ]);
			}
			if (typeof callback === 'function') {
				// assert: wiki_API.is_page_data(title)
				// BUT title IS NOT latest page data!
				// It contains only basic page information,
				// e.g., .pageid, .ns, .title
				// title.title === wiki_API.title_of(title)
				callback(title, error, data);
				// console.trace(title);
			}
		}, post_data, options);
	}

	/**
	 * 放弃编辑页面用。 CeL.wiki.edit.cancel<br />
	 * assert: true === !!wiki_API_edit.cancel
	 * 
	 * @type any
	 */
	wiki_API_edit.cancel = typeof Symbol === 'function' ? Symbol('CANCEL_EDIT')
	//
	: {
		cancel : '放弃编辑页面用'
	};

	/** {Natural}小于此数则代表当作 undo 几个版本。 */
	wiki_API_edit.undo_count_limit = 100;

	/**
	 * 对要编辑的资料作基本检测。
	 * 
	 * @param data
	 *            要编辑的资料。
	 * @param title
	 *            title or id.
	 * @param {String}caller
	 *            caller to show.
	 * 
	 * @returns error: 非undefined表示((data))为有问题的资料。
	 */
	wiki_API_edit.check_data = function check_data(data, title, options, caller) {
		var action;
		// return CeL.wiki.edit.cancel as a symbol to skip this edit,
		// do not generate warning message.
		// 可以利用 ((return [ CeL.wiki.edit.cancel, 'reason' ];)) 来回传 reason。
		// ((return [ CeL.wiki.edit.cancel, 'skip' ];)) 来跳过 (skip)
		// 本次编辑动作，不特别显示或处理。
		// 被 skip/pass 的话，连警告都不显现，当作正常状况。
		if (data === wiki_API_edit.cancel) {
			// 统一规范放弃编辑页面讯息。
			data = [ wiki_API_edit.cancel ];
		}

		// data.trim()
		if (!data && (!options || !options.allow_empty)) {
			action = [ 'empty', gettext(typeof data === 'string'
			// 内容被清空。白纸化。
			// gettext_config:{"id":"content-is-empty"}
			? 'Content is empty'
			// gettext_config:{"id":"content-is-not-settled"}
			: 'Content is not settled') ];

		} else if (Array.isArray(data) && data[0] === wiki_API_edit.cancel) {
			action = data.slice(1);
			if (action.length === 1) {
				// error messages
				// gettext_config:{"id":"abandon-change"}
				action[1] = action[0] || gettext('Abandon change');
			}
			if (!action[0]) {
				// error code
				action[0] = 'cancel';
			}

			library_namespace.debug('采用个别特殊讯息: ' + action, 2, caller
					|| 'wiki_API_edit.check_data');
		}

		if (action) {
			if (action[1] !== 'skip') {
				// 被 skip/pass 的话，连警告都不显现，当作正常状况。
				library_namespace.warn((caller || 'wiki_API_edit.check_data')
						+ ': ' + wiki_API.title_link_of(title) + ': '
						// gettext_config:{"id":"no-reason-provided"}
						+ (action[1] || gettext('No reason provided')));
			} else {
				library_namespace.debug(
						'Skip ' + wiki_API.title_link_of(title), 2, caller
								|| 'wiki_API_edit.check_data');
			}
			return action[0];
		}
	};

	/**
	 * 处理编辑冲突用。 to detect edit conflicts.
	 * 
	 * 注意: 会改变 options! Warning: will modify options！
	 * 
	 * 此功能之工作机制/原理：<br />
	 * 在 .page() 会取得每个页面之 page_data.revisions[0].timestamp（各页面不同）。于 .edit()
	 * 时将会以从 page_data 取得之 timestamp 作为时间戳记传入呼叫，当 MediaWiki 系统 (API)
	 * 发现有新的时间戳记，会回传编辑冲突，并放弃编辑此页面。<br />
	 * 详见 [https://github.com/kanasimi/CeJS/blob/master/application/net/wiki.js
	 * wiki_API_edit.set_stamp]。
	 * 
	 * @param {Object}options
	 *            附加参数/设定选择性/特殊功能与选项
	 * @param {String}timestamp
	 *            页面时间戳记。 e.g., '2015-01-02T02:52:29Z'
	 * 
	 * @returns {Object}options
	 * 
	 * @see https://www.mediawiki.org/wiki/API:Edit
	 */
	wiki_API_edit.set_stamp = function(options, timestamp) {
		if (false && options.page_to_edit) {
			console.trace(options.page_to_edit);
			if (wiki_API.is_page_data(timestamp)) {
				console.trace(options.page_to_edit === timestamp);
			}
			// options.baserevid =
		}

		if (wiki_API.is_page_data(timestamp)
		// 在 .page() 会取得 page_data.revisions[0].timestamp
		&& (timestamp = wiki_API.content_of.revision(timestamp))) {
			// console.trace(timestamp);
			if (timestamp.revid) {
				// 添加编辑之基准版本号以侦测/避免编辑冲突。
				options.baserevid = timestamp.revid;
			}
			// 自 page_data 取得 timestamp.
			timestamp = timestamp.timestamp;
		}

		// timestamp = '2000-01-01T00:00:00Z';
		if (timestamp) {
			library_namespace.debug(timestamp, 3, 'wiki_API_edit.set_stamp');
			options.basetimestamp = options.starttimestamp = timestamp;
		}

		return options;
	};

	/**
	 * Get the contents of [[Template:Bots]].
	 * 
	 * @param {String}content
	 *            page contents 页面内容。
	 * 
	 * @returns {Array}contents of [[Template:Bots]].
	 * 
	 * @see https://zh.wikipedia.org/wiki/Template:Bots
	 */
	wiki_API_edit.get_bot = function(content) {
		// TODO: use parse_template(content, 'bots')
		var bots = [], matched, PATTERN = /{{[\s\n]*bots[\s\n]*(\S[\s\S]*?)}}/ig;
		while (matched = PATTERN.exec(content)) {
			library_namespace.debug(matched.join('<br />'), 1,
					'wiki_API_edit.get_bot');
			if (matched = matched[1].trim().replace(/(^\|\s*|\s*\|$)/g, '')
			// .split('|')
			)
				bots.push(matched);
		}
		if (0 < bots.length) {
			library_namespace.debug(bots.join('<br />'), 1,
					'wiki_API_edit.get_bot');
			return bots;
		}
	};

	/**
	 * 测试页面是否允许机器人帐户访问，遵守[[Template:Bots]]。机器人另须考虑{{Personal announcement}}的情况。
	 * 
	 * [[Special:Log/massmessage]] Delivery of "message" to [[User talk:user]]<br />
	 * was skipped because the target has opted-out of message delivery<br />
	 * failed with an error code of protectedpage / contenttoobig
	 * 
	 * @param {String}content
	 *            page contents 页面内容。
	 * @param {String}bot_id
	 *            机器人帐户名称。
	 * @param {String}notification_name
	 *            message notifications of action. 按通知种类而过滤(optout)。
	 *            ignore_opted_out allows /[a-z\d\-\_]+/ that will not affects
	 *            RegExp. ignore_opted_out will splits with /[,|]/.
	 * 
	 * @returns {Boolean|String}封锁机器人帐户访问。
	 */
	wiki_API_edit.denied = function(content, bot_id, notification_name) {
		if (!content)
			return;
		var page_data;
		if (wiki_API.is_page_data(content)) {
			page_data = content;
			content = wiki_API.content_of(content);
		}
		// assert: !content || typeof content === 'string'

		if (typeof content === 'string') {
			content = content.replace(/<!--[\s\S]*-->/g, '').replace(
					/<nowiki\s*>[\s\S]*<\/nowiki>/g, '');
		}
		if (!content)
			return;

		library_namespace.debug('contents to test: [' + content + ']', 3,
				'wiki_API_edit.denied');

		var bots = wiki_API_edit.get_bot(content),
		/** {String}denied messages */
		denied, allow_bot;

		if (bots) {
			library_namespace.debug('test ' + bot_id + '/' + notification_name,
					3, 'wiki_API_edit.denied');
			// botlist 以半形逗号作间隔。
			bot_id = (bot_id = bot_id && bot_id.toLowerCase()) ? new RegExp(
					'(?:^|[\\s,])(?:all|' + bot_id + ')(?:$|[\\s,])', 'i')
					: wiki_API_edit.denied.all;

			if (notification_name) {
				if (typeof notification_name === 'string'
				// 以 "|" 或半形逗号 "," 隔开 optout。
				&& notification_name.includes(',')) {
					notification_name = notification_name.split(',');
				}
				if (Array.isArray(notification_name)) {
					notification_name = notification_name.map(function(name) {
						return name.trim();
					}).join('|');
				}
				if (typeof notification_name === 'string') {
					// 预设必须包含 optout=all
					notification_name = new RegExp('(?:^|[\\s,])(?:all|'
							+ notification_name.trim() + ')(?:$|[\\s,])');
				} else if (!library_namespace.is_RegExp(notification_name)) {
					library_namespace.warn(
					//
					'wiki_API_edit.denied: Invalid notification_name: ['
							+ notification_name + ']');
					notification_name = null;
				}
				// 警告: 自订 {RegExp}notification_name 可能颇危险。
			}

			bots.some(function(data) {
				// data = data.toLowerCase();
				library_namespace.debug('test [' + data + ']', 1,
						'wiki_API_edit.denied');

				var matched,
				/** {RegExp}封锁机器人访问之 pattern。 */
				PATTERN;

				// 过滤机器人所发出的通知/提醒
				// 页面/用户以bots模板封锁通知
				if (notification_name) {
					PATTERN =
					//
					/(?:^|\|)[\s\n]*optout[\s\n]*=[\s\n]*([^{}|]+)/ig;
					while (matched = PATTERN.exec(data)) {
						if (notification_name.test(matched[1])) {
							// 一被拒绝即跳出。
							return denied = 'Opt out of ' + matched[1];
						}
					}
				}

				// 检查被拒绝之机器人帐户名称列表（以半形逗号作间隔）
				PATTERN = /(?:^|\|)[\s\n]*deny[\s\n]*=[\s\n]*([^|]+)/ig;
				while (matched = PATTERN.exec(data)) {
					if (bot_id.test(matched[1])) {
						// 一被拒绝即跳出。
						return denied = 'Banned: ' + matched[1];
					}
				}

				// 检查被允许之机器人帐户名称列表（以半形逗号作间隔）
				PATTERN = /(?:^|\|)[\s\n]*allow[\s\n]*=[\s\n]*([^|]+)/ig;
				while (matched = PATTERN.exec(data)) {
					if (!bot_id.test(matched[1])) {
						// 一被拒绝即跳出。
						return denied = 'Not in allowed bots list: ['
								+ matched[1] + ']';
					}

					if (page_data)
						allow_bot = matched[1];
				}

			});
		}

		// {{Nobots}}判定
		if (!denied && /{{[\s\n]*nobots[\s\n]*}}/i.test(content))
			denied = 'Ban all compliant bots.';

		if (denied) {
			// console.trace(content);
			library_namespace.warn('wiki_API_edit.denied: '
			//
			+ (page_data ? wiki_API.title_link_of(page_data) + ' ' : '')
					+ denied);
			return denied;
		}

		if (allow_bot) {
			// 特别标记本 bot 为被允许之 bot。
			page_data.allow_bot = allow_bot;
		}
	};

	/**
	 * pattern that will be denied.<br />
	 * i.e. "deny=all", !("allow=all")
	 * 
	 * @type {RegExp}
	 */
	wiki_API_edit.denied.all = /(?:^|[\s,])all(?:$|[\s,])/;

	// ------------------------------------------------------------------------

	// 不用 copy_to 的原因是 copy_to(wiki) 得远端操作 wiki，不能保证同步性。
	// this_wiki.copy_from(wiki) 则呼叫时多半已经设定好 wiki，直接在本this_wiki中操作比较不会有同步性问题。
	// 因为直接采wiki_API.prototype.copy_from()会造成.page().copy_from()时.page()尚未执行完，
	// 这会使执行.copy_from()时尚未取得.last_page，因此只好另开function。
	// @see [[Template:Copied]], [[Special:Log/import]]
	// TODO: 添加 wikidata sitelinks 语言连结。处理分类。处理模板。
	function wiki_API_prototype_copy_from(title, options, callback) {
		if (typeof options === 'function') {
			// shift arguments
			callback = options;
			options = undefined;
		}

		options = wiki_API.add_session_to_options(this, options);

		var _this = this, copy_from_wiki;
		function edit() {
			// assert: wiki_API.is_page_data(title)
			var content_to_copy = wiki_API.content_of(title);
			if (typeof options.processor === 'function') {
				// options.processor(from content_to_copy, to content)
				content_to_copy = options.processor(title, wiki_API
						.content_of(_this.last_page));
			}
			if (!content_to_copy) {
				library_namespace
						.warn('wiki_API_prototype_copy_from: Nothing to copy!');
				_this.next();
			}

			var content;
			if (options.append && (content
			//
			= wiki_API.content_of(_this.last_page).trimEnd())) {
				content_to_copy = content + '\n' + content_to_copy;
				options.summary = 'Append from '
						+ wiki_API.title_link_of(title, copy_from_wiki) + '.';
			}
			if (!options.summary) {
				options.summary = 'Copy from '
				// TODO: 复制到非维基项目外的私人维基，例如moegirl时，可能需要用到[[zhwiki:]]这样的prefix。
				+ wiki_API.title_link_of(title, copy_from_wiki) + '.';
			}
			_this.actions.unshift(
			// wiki.edit(page, options, callback)
			[ 'edit', content_to_copy, options, callback ]);
			_this.next();
		}

		if (wiki_API.is_wiki_API(title)) {
			// from page 为另一 wiki_API
			copy_from_wiki = title;
			// wiki.page('title').copy_from(wiki)
			title = copy_from_wiki.last_page;
			if (!title) {
				// wiki.page('title').copy_from(wiki);
				library_namespace.debug('先撷取同名title: '
						+ wiki_API
								.title_link_of(this.last_page, copy_from_wiki));
				// TODO: create interwiki link
				copy_from_wiki.page(wiki_API.title_of(this.last_page),
				//
				function(page_data) {
					library_namespace.debug('Continue coping page');
					// console.log(copy_from_wiki.last_page);
					wiki_API_prototype_copy_from.call(_this, copy_from_wiki,
							options, callback);
				});
				return;
			}
		}

		if (wiki_API.is_page_data(title)) {
			// wiki.page().copy_from(page_data)
			edit();

		} else {
			// treat title as {String}page title in this wiki
			// wiki.page().copy_from(title)
			var to_page_data = this.last_page;
			// 即时性，不用 async。
			// wiki_API.page(title, callback, options)
			wiki_API.page(title, function(from_page_data) {
				// recover this.last_page
				_this.last_page = to_page_data;
				title = from_page_data;
				edit();
			}, options);
		}

		return this;
	}

	wiki_API_edit.copy_from = wiki_API_prototype_copy_from;

	// ------------------------------------------------------------------------

	/**
	 * 上传档案/媒体。
	 * 
	 * arguments: Similar to wiki_API_edit<br />
	 * wiki_API.upload(file_path, token, options, callback);
	 * 
	 * TODO: https://commons.wikimedia.org/wiki/Commons:Structured_data<br />
	 * 档案资讯 添加/编辑 说明 (Must be plain text. Cannot use wikitext!)
	 * https://commons.wikimedia.org/w/api.php?action=help&modules=wbsetlabel
	 * wikitext_to_plain_text(wikitext)
	 * 
	 * @param {String}file_path
	 *            file path/url
	 * @param {Object}token
	 *            login 资讯，包含“csrf”令牌/密钥。
	 * @param {Object}[options]
	 *            附加参数/设定选择性/特殊功能与选项
	 * @param {Function}[callback]
	 *            回调函数。 callback(page_data, error, result)
	 * 
	 * @see https://commons.wikimedia.org/w/api.php?action=help&modules=upload
	 *      https://www.mediawiki.org/wiki/API:Upload
	 */
	wiki_API.upload = function upload(file_path, token, options, callback) {
		var action = {
			action : 'upload'
		};
		if (wiki_API.need_get_API_parameters(action, options,
				wiki_API[action.action], arguments)) {
			return;
		}

		// must set options.ignorewarnings to reupload

		// 前置处理。
		options = library_namespace.new_options(options);

		// When set .variable_Map, after successful update, the content of file
		// page will be auto-updated too.
		if (!('page_text_updater' in options) && options.variable_Map) {
			// auto set options.page_text_updater
			options.page_text_updater = options.variable_Map;
		}
		if (options.page_text_updater) {
			// https://www.mediawiki.org/w/api.php?action=help&modules=upload
			// A "csrf" token retrieved from action=query&meta=tokens
			options.token = token;
		}

		// 备注 comment won't accept templates and external links
		if (!options.comment && options.summary) {
			library_namespace.warn(
			// 错置?
			'wiki_API.upload: Please use .comment instead of .summary!');
			options.comment = options.summary;
		}

		var structured_data = library_namespace
				.new_options(options.structured_data);

		// upload_text: media description
		if (!options.text) {
			// 从 options / file_data / media_data 自动抽取出文件资讯。
			options.text = {
				description : options.description,
				date : library_namespace.is_Date(options.date) ? options.date
						.toISOString().replace(/\.\d+Z$/, 'Z') : options.date,
				source : options.source_url || options.media_url
						|| options.file_url,
				author : /^Q\d+/.test(options.author) ? '{{label|'
						+ options.author + '}}' : options.author,
				permission : options.permission,
				other_versions : options.other_versions
						|| options['other versions'],
				other_fields : options.other_fields || options['other fields']
			};
			if (!structured_data.date)
				structured_data.date = options.text.date;
		} else {
			[ "description", "date", "source", "author", "permission",
					"other_versions", "other_fields" ]
					.forEach(function(parameter) {
						if (parameter in options) {
							library_namespace
									.error('wiki_API.upload: Cannot assign both options.text and options.'
											+ parameter
											+ '! Maybe you want to change options.text to options.additional_text?');
						}
					});
		}

		// options.location: [latitude, longitude, altitude / height / -depth ]
		if (options.location) {
			if (isNaN(options.location[0]) || isNaN(options.location[1])) {
				delete options.location;
			} else if (!structured_data.location) {
				structured_data.location = options.location;
			}
		}
		if (options.location && options.variable_Map) {
			if (options.location[0] && !options.variable_Map.has('latitude'))
				options.variable_Map.set('latitude', options.location[0]);
			if (options.location[1] && !options.variable_Map.has('longitude'))
				options.variable_Map.set('longitude', options.location[1]);
			if (options.location[2] && !options.variable_Map.has('altitude'))
				options.variable_Map.set('altitude', options.location[2]);
		}

		if (library_namespace.is_Object(options.text)) {
			var variable_Map = options.variable_Map;
			if (variable_Map) {
				for ( var property in options.text) {
					var value = options.text[property];
					if (!variable_Map.has(property)
					//
					&& wiki_API.is_valid_parameters_value(value)
					//
					&& !Variable_Map__PATTERN_mark.test(value)
					// 自动将每次更新可能会改变的值转成可更新标记。
					&& [ 'date', 'source' ].includes(property)) {
						variable_Map.set(property, value);
					}
					if (variable_Map.has(property)) {
						options.text[property] = variable_Map.format(property);
					}
				}
			}

			options.text = [ '== {{int:filedesc}} ==',
			// 将 .text 当作文件资讯。
			wiki_API.template_text(options.text, {
				name : 'Information',
				separator : '\n| '
			}) ];

			// https://commons.wikimedia.org/wiki/Commons:Geocoding#Adding_a_location_template
			// If the image page has an {{Information}} template, or similar,
			// the {{Location}} template should come immediately after it.
			if (options.location) {
				options.text.push(wiki_API.template_text([
						options.location_template_name || 'Location',
						variable_Map ? variable_Map.format('latitude')
								: options.location[0],
						variable_Map ? variable_Map.format('longitude')
								: options.location[1] ]));
			}

			options.text = options.text.join('\n');
		}

		if (options.license) {
			options.text += '\n== {{int:license-header}} ==\n'
					+ wiki_API.template_text.join_array(options.license);
		}

		// Additional wikitext to place before categories.
		if (options.additional_text) {
			options.text += '\n' + options.additional_text.trim();
		}

		// append categories
		if (options.categories) {
			options.text += '\n'
			//
			+ wiki_API.template_text.join_array(options.categories
			//
			.map(function(category_name) {
				if (category_name && !category_name.includes('[[')) {
					if (!PATTERN_category_prefix.test(category_name))
						category_name = 'Category:' + category_name;
					// NG: CeL.wiki.title_link_of()
					category_name = '[[' + category_name + ']]';
				}
				return category_name;
			}));
		}

		// assert: typeof options.text === 'string'

		// TODO: check {{Information|permission=license}}
		var post_data = wiki_API.extract_parameters(options, action);

		post_data.token = token;

		// One of the parameters "filekey", "file" and "url" is required.
		if (false && file_path.includes('://')) {
			post_data.url = file_path;
			// The "filename" parameter must be set.
			if (!post_data.filename) {
				post_data.filename = file_path.match(/[\\\/]*$/)[0];
			}
			// Uploads by URL are not allowed from this domain.
		} else {
			// 自动先下载 fetch 再上传。
			// file: 必须使用 multipart/form-data 以档案上传的方式传送。
			if (!options.form_data) {
				// options.form_data 会被当作传入 to_form_data() 之 options。
				options.form_data = true;
			}
			post_data.file = file_path.includes('://') ? {
				// to_form_data() will get file using get_URL()
				url : file_path
			} : {
				file : file_path
			};
		}

		if (!post_data.filename) {
			// file path → file name
			post_data.filename = file_path.match(/[^\\\/]*$/)[0]
			// {result:'Warning',warnings:{badfilename:''}}
			.replace(/#/g, '-');
			// https://www.mediawiki.org/wiki/Manual:$wgFileExtensions
		}

		if (!structured_data['media type']) {
			var matched;
			if (library_namespace.MIME_of) {
				matched = library_namespace.MIME_of(post_data.filename);
			} else if (matched = post_data.filename
					.match(/\.(png|jpeg|gif|webp|bmp)$/i)) {
				matched = 'image/' + matched[1].toLowerCase();
			}
			if (matched) {
				structured_data['media type'] = matched;
			}
		}

		var session = wiki_API.session_of_options(options);
		if (options.show_message && post_data.file.url) {
			library_namespace.log(file_path + '\nUpload to → '
					+ wiki_API.title_link_of(session.to_namespace(
					// 'File:' +
					post_data.filename, 'File')));
		}

		if (session && session.API_URL && options.check_media) {
			// TODO: Skip exists file
			// @see 20181016.import_earthquake_shakemap.js
		}

		// no really update
		if (options.test_only) {
			if (options.test_only !== 'no message') {
				delete options[KEY_SESSION];
				delete options.text;
				action = post_data.text;
				delete post_data.text;

				console.log('-'.repeat(80));
				console.log(options);
				console.log(post_data);
				library_namespace.info('wiki_API.upload: test edit text:\n'
						+ action);
			}
			callback(null, 'Test edit');
			return;
		}

		wiki_API.query(action, upload_callback.bind(null,
		//
		function check_structured_data(data, error) {
			// console.trace([ data, error ]);

			if (!structured_data.date) {
				structured_data.date = options.date;
			}
			if (structured_data.location
			// assert: Array.isArray(structured_data.location)
			&& !structured_data.location.precision) {
				structured_data.location.precision = .1;
			}
			// normalize structured_data
			Object.keys(structured_data).forEach(function(name) {
				if (structured_data[name] === undefined) {
					delete structured_data[name];
					return;
				}
				var property_id = structured_data_mapping[name];
				if (property_id && !(property_id in structured_data)) {
					structured_data[property_id] = structured_data[name];
					delete structured_data[name];
				}
			});
			// console.trace([ post_data.filename, structured_data ]);
			if (library_namespace.is_empty_object(structured_data)) {
				callback(data, error);
				return;
			}

			// --------------------------------------------

			// 确保不会直接执行 session.edit_structured_data()，而是将之推入 session.actions。
			session.running = true;

			session.edit_structured_data(session.to_namespace(
			// 'File:' + data.filename
			post_data.filename, 'File'),
			//
			function fill_structured_data(entity) {
				var summary_list = [], data = Object.create(null);
				for ( var property_id in structured_data) {
					if (entity.claims
					//
					&& wiki_API.data.value_of(entity.claims[property_id])) {
						if (false) {
							console.log([ property_id, wiki_API.data.value_of(
							//
							entity.claims[property_id]) ]);
						}
						continue;
					}

					var value = structured_data[property_id];
					data[property_id] = value;
					var config = structured_data_config[property_id];
					var summary_name = config && config[KEY_summary_name]
							|| property_id;
					summary_name = wiki_API.title_link_of('d:Property:'
							+ property_id, summary_name);
					summary_list.push(summary_name + '=' + value);
				}

				// console.log(entity.claims);
				// console.trace([ summary_list, data ]);

				if (summary_list.length === 0)
					return [ wiki_API.edit.cancel, 'skip' ];

				// gettext_config:{"id":"Comma-separator"}
				this.summary += summary_list.join(gettext('Comma-separator'));
				return data;

			}, {
				// 标记此编辑为机器人编辑。
				bot : options.bot,
				summary : 'Modify structured data: '
			}, function structured_data_callback(_data, _error) {
				// console.trace([ _data, error, _error ]);
				if (error) {
					if (data && data.error
							&& data.error.code === 'fileexists-no-change')
						;
				}
				callback(data, error || _error);
			});

			// 本执行序拥有执行权，因此必须手动执行 session.next()，否则会中途跳出。
			session.next();

		}, options), post_data, options);

	};

	var KEY_summary_name = 'summary_name',
	// {inner} alias
	structured_data_mapping = {
		// 描述地坐标 (P9149) [[Commons:Structured data/Modeling/Location]]
		location : 'P9149',
		// 描绘内容 (P180) [[Commons:Structured data/Modeling/Depiction]]
		depicts : 'P180',

		// [[Commons:Structured data/Modeling/Properties table]]
		// TODO: 文件格式 (P2701)
		'file format' : 'P2701',
		// TODO: 资料大小 (P3575)
		'data size' : 'P3575',

		'media type' : 'P1163',

		// 成立或建立时间 (P571) [[Commons:Structured data/Modeling/Date]]
		'created datetime' : 'P571',
		date : 'P571'
	}, structured_data_config = Object.create(null);
	Object.keys(structured_data_mapping).forEach(function(name) {
		var property_id = structured_data_mapping[name];
		var property_config = structured_data_config[property_id];
		if (!property_config) {
			structured_data_config[property_id]
			//
			= property_config = Object.create(null);
		}
		if (!property_config[KEY_summary_name])
			property_config[KEY_summary_name] = name;
	});

	function upload_callback(callback, options, data, error) {
		if (error || !data || (error = data.error)
		/**
		 * <code>
		{upload:{result:'Warning',warnings:{exists:'file_name',nochange:{}},filekey:'',sessionkey:''}}
		{upload:{result:'Warning',warnings:{"duplicate":["file_name"]}}
		{upload:{result:'Warning',warnings:{"was-deleted":"file_name","duplicate-archive":"file_name"}}
		{upload:{result:'Success',filename:'',imageinfo:{}}}
		{upload:{result:'Success',filename:'',warnings:{duplicate:['.jpg','.jpg']},imageinfo:{}}}

		{"error":{"code":"fileexists-no-change","info":"The upload is an exact duplicate of the current version of [[:File:name.jpg]].","stasherrors":[{"message":"uploadstash-exception","params":["UploadStashBadPathException","Path doesn't exist."],"code":"uploadstash-exception","type":"error"}],"*":"See https://test.wikipedia.org/w/api.php for API usage. Subscribe to the mediawiki-api-announce mailing list at &lt;https://lists.wikimedia.org/mailman/listinfo/mediawiki-api-announce&gt; for notice of API deprecations and breaking changes."},"servedby":"mw1279"}
		{"error":{"code":"verification-error","info":"File extension \".gif\" does not match the detected MIME type of the file (image/jpeg).","details":["filetype-mime-mismatch","gif","image/jpeg"],"*":"See https://commons.wikimedia.org/w/api.php for API usage. Subscribe to the mediawiki-api-announce mailing list at &lt;https://lists.wikimedia.org/postorius/lists/mediawiki-api-announce.lists.wikimedia.org/&gt; for notice of API deprecations and breaking changes."},"servedby":"mw1450"}
		</code>
		 */
		|| !(data = data.upload) || data.result !== 'Success') {
			// console.error(error);
			if (!error) {
				if (data && data.result) {
					error = data.result;
					if (data.warnings) {
						error += ': ' + JSON.stringify(data.warnings);
					}
				} else {
					error = 'Error on uploading';
				}
			}
			if (options.show_message) {
				console.log(data);
				library_namespace.error(typeof error === 'object' ? JSON
						.stringify(error) : error);
				if (data && data.warnings) {
					library_namespace.warn(JSON.stringify(data.warnings));
				} else {
					// library_namespace.warn(JSON.stringify(data));
				}
			}
			// @see function wiki_operator()
			if (typeof error === 'string') {
				error = new Error(error);
			} else if (library_namespace.is_Object(error)) {
				error = new Error(JSON.stringify(error));
			}

			typeof callback === 'function' && callback(data, error);
			return;
		}

		if (options.show_message) {
			console.log(data);
		}

		if (!options.page_text_updater
		// uploaded a new version
		// {result:'Success',filename:'file_name',warnings:{exists:'file_name'},imageinfo:{...}}
		|| !data.warnings || !data.warnings.exists) {
			typeof callback === 'function' && callback(data);
			return;
		}

		// update description text for a existed file
		if (!options.summary && options.comment) {
			options.summary = options.comment;
		}
		delete options.text;
		delete options.form_data;
		if (wiki_API.Variable_Map.is_Variable_Map(options.page_text_updater)) {
			options.page_text_updater = options.page_text_updater
					.to_page_text_updater();
		}
		var session = wiki_API.session_of_options(options);
		// 'File:' +
		var file_path = session.to_namespace(data.filename, 'File');
		// library_namespace.info('upload_callback: options.page_text_updater');
		// console.log(JSON.stringify(data));
		// console.log(file_path);
		// console.trace(options);
		wiki_API.edit(file_path, options.page_text_updater, options.token,
				options, callback);
	}

	// ------------------------------------------
	// 使用于需要多次更新页面内容的情况。

	if (false) {
		(function() {
			// TODO:
			var update_Variable_Map = new CeL.wiki.Variable_Map;
			update_Variable_Map.set('variable_name', wikitext_value);
			update_Variable_Map.set('timestamp', {
				// .may_not_update: 可以不更新。 e.g., timestamp
				may_not_update : true,
				wikitext : '<onlyinclude>~~~~~</onlyinclude>'
			});
			update_Variable_Map.template = '...\n' + '*date: '
					+ update_Variable_Map.format('timestamp') + '\n'
					+ update_Variable_Map.format('variable_name') + '...';
			wiki.edit(page, update_Variable_Map, options);
		})();
	}

	/**
	 * <code>CeL.wiki.Variable_Map</code> is used to update content when
	 * update pages or files. It will insert comments around the value, prevent
	 * others from accidentally editing the text that will be overwritten.
	 * 
	 * @param {Array}iterable
	 *            initial values
	 */
	function Variable_Map(iterable) {
		if (library_namespace.is_Object(iterable))
			iterable = Object.entries(iterable);
		try {
			Map.call(this, iterable);
			// Object.assign(iterable, Map.prototype);
			return;
		} catch (e) {
			// node.js 0.11: Constructor Map requires 'new'
		}

		iterable = new Map(iterable);
		// Copy all methods
		Object.assign(iterable, Variable_Map.prototype);
		return iterable;
	}
	Variable_Map.prototype = {
		format : Variable_Map_format,
		update : Variable_Map_update,
		to_page_text_updater : Variable_Map_to_page_text_updater,
		constructor : Variable_Map
	};

	Variable_Map.is_Variable_Map = function is_Variable_Map(value) {
		return value && value.constructor === Variable_Map;
	};

	// @see https://en.wikipedia.org/wiki/User:DrTrigonBot/Subster
	function Variable_Map_format(variable_name, default_value) {
		var start_mark = '<!-- update '
				+ variable_name
				+ ': '
				// gettext_config:{"id":"the-text-between-update-comments-will-be-automatically-overwritten-by-the-bot"}
				+ gettext('The text between update comments will be automatically overwritten by the bot.')
				+ ' -->';
		var end_mark = '<!-- update end: ' + variable_name + ' -->';
		var value;
		if (this.has(variable_name)) {
			value = this.get(variable_name);
			if (library_namespace.is_Object(value)) {
				// TODO: value.wikitext === undefined
				value = value.wikitext;
			}
		} else {
			value = default_value === undefined ? '' : default_value;
		}
		return start_mark + value + end_mark;
	}

	// [ all_mark, start_mark, variable_name, original_value, end_mark ]
	var Variable_Map__PATTERN_mark = /(<!--\s*update ([^():]+)[\s\S]*?-->)([\s\S]+?)(<!--\s*update end:\s*\2(?:\W[\s\S]*?)?-->)/g;
	var Variable_Map__PATTERN_template_mark = /({{Auto-generated\s*\|([^{}|]+)}})([\s\S]+?)({{Auto-generated\s*\|\2\|end}})/;

	function Variable_Map_update(wikitext, options) {
		var changed = options && options.force_change, variable_Map = this;
		// console.trace(variable_Map);

		function replacer(all_mark, start_mark, variable_name, original_value,
				end_mark) {
			if (false) {
				console.trace([ all_mark, variable_name,
						variable_Map.has(variable_name) ]);
			}
			// console.trace(variable_Map);
			if (variable_Map.has(variable_name)) {
				var value = variable_Map.get(variable_name), may_not_update;
				if (library_namespace.is_Object(value)) {
					// console.trace([ variable_name, value.may_not_update ]);
					// .may_not_update: 可以不更新。 e.g., timestamp
					may_not_update = value.may_not_update;
					value = value.wikitext;
				}
				if (value !== original_value) {
					if (!may_not_update)
						changed = variable_name;
					// preserve start_mark, end_mark
					return start_mark + value + end_mark;
				}
			}
			return all_mark;
		}

		// TODO:
		if (false) {
			wikitext = wikitext.replace(Variable_Map__PATTERN_template_mark,
					replacer);
		}
		wikitext = wikitext.replace(Variable_Map__PATTERN_mark, replacer);
		// console.trace(changed);
		if (!changed) {
			return [ wiki_API.edit.cancel,
					'Variable_Map_update: ' + 'Nothing to update' ];
		}
		// console.trace(wikitext);
		return wikitext;
	}

	// @inner
	function Variable_Map__page_text_updater(page_data) {
		// console.trace(page_data);
		/**
		 * {String}page content, maybe undefined. 条目/页面内容 =
		 * CeL.wiki.revision_content(revision)
		 */
		var content = wiki_API.content_of(page_data);
		// console.trace(content);

		var force_change;
		if (!content || !content.trim()) {
			content = this.template;
			if (typeof content === 'function')
				content = this.template(page_data);
			force_change = !!content;
		}

		if (content) {
			// console.trace(content);
			// console.trace(this.update(content));

			// using function Variable_Map_update(wikitext)
			return this.update(content, {
				force_change : force_change
			});
		}

		if (false) {
			// or: 此页面不存在/已删除。
			// gettext_config:{"id":"no-content"}
			content = gettext('No content: ')
					+ wiki_API.title_link_of(page_data);
		}
		content = 'Variable_Map__page_text_updater: '
				+ wiki_API.title_link_of(page_data)
				+ ': No .template specified.';
		// library_namespace.log(content);
		return [ wiki_API_edit.cancel, content ];
	}
	function Variable_Map_to_page_text_updater() {
		return Variable_Map__page_text_updater.bind(this);
	}

	Variable_Map.plain_text = function plain_text(wikitext) {
		return wiki_link.replace(/<!--[\s\S]*?-->/g, '');
	};

	wiki_API.Variable_Map = Variable_Map;

	// ------------------------------------------------------------------------

	// export 导出.

	return wiki_API_edit;
}
