/**
 * @name CeL function for MediaWiki (Wikipedia / 维基百科): task control
 * 
 * @fileoverview 本档案包含了 MediaWiki 自动化作业用程式库的子程式库。
 * 
 * TODO:<code>


</code>
 * 
 * @since 2020/5/24 6:21:13 拆分自 CeL.application.net.wiki
 */

// More examples: see /_test suite/test.js
// Wikipedia bots demo: https://github.com/kanasimi/wikibot
'use strict';
// 'use asm';

// --------------------------------------------------------------------------------------------

// 不采用 if 陈述式，可以避免 Eclipse JSDoc 与 format 多缩排一层。
typeof CeL === 'function' && CeL.run({
	// module name
	name : 'application.net.wiki.task',

	require : 'data.native.'
	// for library_namespace.get_URL
	+ '|application.net.Ajax.' + '|application.net.wiki.'
	// load MediaWiki module basic functions
	+ '|application.net.wiki.namespace.',

	// 设定不汇出的子函式。
	no_extend : 'this,*',

	// 为了方便格式化程式码，因此将 module 函式主体另外抽出。
	code : module_code
});

function module_code(library_namespace) {

	// requiring
	var wiki_API = library_namespace.application.net.wiki, KEY_SESSION = wiki_API.KEY_SESSION, KEY_CORRESPOND_PAGE = wiki_API.KEY_CORRESPOND_PAGE;
	// @inner
	var is_api_and_title = wiki_API.is_api_and_title, add_session_to_options = wiki_API.add_session_to_options;

	var gettext = library_namespace.cache_gettext(function(_) {
		gettext = _;
	});

	var
	/** {Number}未发现之index。 const: 基本上与程式码设计合一，仅表示名义，不可更改。(=== -1) */
	NOT_FOUND = ''.indexOf('_');

	// ------------------------------------------------------------------------

	// get_data_key(), get_data_page()
	function get_wikibase_key(id) {
		if (!id)
			return;
		if (id[KEY_CORRESPOND_PAGE])
			id = id[KEY_CORRESPOND_PAGE];
		return id.site && id.title && id;
	}

	// check if session.last_data is usable, 非过期资料。
	function last_data_is_usable(session) {
		// When "servers are currently under maintenance", session.last_data is
		// a string.
		if (typeof session.last_data === 'object' && !session.last_data.error
		// 若是session.last_data与session.last_page连动，必须先确认是否没变更过session.last_page，才能当作cache、跳过重新撷取entity之作业。
		&& (!(KEY_CORRESPOND_PAGE in session.last_data)
		// assert:
		// wiki_API.is_page_data(session.last_data[KEY_CORRESPOND_PAGE])
		|| session.last_page === session.last_data[KEY_CORRESPOND_PAGE])) {
			library_namespace.debug('Use cached data: [['
			//
			+ (KEY_CORRESPOND_PAGE in session.last_data
			// may use wiki_API.title_link_of()
			? session.last_page.id : session.last_data.id) + ']]', 1,
					'last_data_is_usable');
			return true;
		}
	}

	// --------------------------------------------------------------------------------------------
	// instance 实例相关函数。

	/**
	 * Register promise relying on wiki session actions. 设定依赖于本 wiki_API action
	 * 的 promise。
	 * 
	 * @param promise
	 *            promise to set
	 * 
	 * @example session.set_promise_relying(result);
	 */
	wiki_API.prototype.set_promise_relying = function set_promise_relying(
			promise) {
		// Promise.isPromise()
		if (library_namespace.is_thenable(promise)
		// no rely on wiki_API
		// && !promise.not_relying_on_wiki_API
		) {
			// assert: promise 依赖于本 wiki_API action thread。
			library_namespace.debug('设定依赖于本 wiki_API action 的 promise。', 3,
					'set_promise_relying');
			if (library_namespace.is_debug(3)) {
				console.trace([ this.running, promise, this.actions ]);
			}
			this.actions.promise_relying = library_namespace
					.is_thenable(this.actions.promise_relying) ? this.actions.promise_relying
					.then(promise)
					: promise;
			return true;
		}
	};

	wiki_API.prototype.test_promise_relying = function test_promise_relying() {
		// this.actions.promise_relying is relying on this action.
		// 为了侦测这些promise是否已fulfilled，必须先this.running，预防其他执行绪钻空隙。

		this.running = true;

		var _this = this;
		function status_handler(fulfilled, this_thenable) {
			if (this_thenable !== _this.actions.promise_relying) {
				library_namespace.debug(
						'有其他执行绪钻空隙，执行了 .set_promise_relying()。需要再检测一次。', 3,
						'test_promise_relying');
				_this.test_promise_relying();
				return;
			}

			if (fulfilled) {
				delete _this.actions.promise_relying;
				if (0 < _this.actions.length) {
					// assert: other threads added _this.actions
					// after library_namespace.status_of_thenable()
					library_namespace.debug('有其他执行绪钻空隙，设定了 .actions。', 3,
							'test_promise_relying');
					_this.next();
				} else {
					library_namespace
							.debug(
									'依赖于本 wiki_API action 的 promise 皆已 fulfilled。本 action 结束。',
									3, 'test_promise_relying');
					_this.running = false;
				}
				return;
			}

			// incase session.next() will wait for this.actions.promise_relying
			// calling back if CeL.is_thenable(result).
			// e.g., await wiki.for_each_page(need_check_redirected_list,
			// ... @ 20200122.update_vital_articles.js
			// So we need to run `session.next()` manually.

			// await wiki.for_each_page(need_check_redirected_list,
			// ... @ 20200122.update_vital_articles.js:
			// 从 function work_page_callback() return 之后，会回到 function
			// wiki_API_edit()。
			// `this_thenable` 会等待 push 进 session.actions 的
			// this.page(this_slice, main_work, page_options)，
			// 但 return 的话，会保持 session.running === true &&
			// session.actions.length > 0
			// 并且 abort。执行不到 this_thenable.then()。

			if (0 < _this.actions.length) {
				// 有些 promise 依赖于本 wiki_API action，假如停下来的话将会导致直接 exit跳出。
				if (false) {
					console
							.trace('test_promise_relying: Calling wiki_API.prototype.next() '
									+ [ _this.running, _this.actions.length ]);
				}
				_this.next();
			} else {
				if (false) {
					console.trace('test_promise_relying: No .actions left! '
							+ [ _this.running, _this.actions.length ]);
				}
				// delete _this.actions.promise_relying;
				_this.running = false;
			}
		}

		library_namespace.status_of_thenable(this.actions.promise_relying,
				status_handler);
	};

	/** 代表欲自动设定 options.page_to_edit */
	wiki_API.VALUE_set_page_to_edit = true;

	// @inner
	function set_page_to_edit(options, page_data, error, page_title) {
		if (!options
				|| options.page_to_edit !== wiki_API.VALUE_set_page_to_edit) {
			return;
		}

		if (page_title) {
			if (!options.page_title_to_edit) {
				options.page_title_to_edit = page_title;
			} else if (page_title !== options.page_title_to_edit) {
				library_namespace.info('set_page_to_edit: '
						+ '跳过改变页面 .page_title_to_edit 的标题: '
						+ wiki_API.title_link_of(options.page_title_to_edit)
						+ '→' + wiki_API.title_link_of(page_title));
			}
		}
		if (options.page_title_to_edit
				&& options.page_title_to_edit !== (page_data.original_title || page_data.title)) {
			library_namespace.info('set_page_to_edit: '
					+ '所取得页面 .page_to_edit 的标题改变: '
					+ wiki_API.title_link_of(options.page_title_to_edit) + '→'
					+ wiki_API.title_link_of(page_data.title));
			console.trace(options);
		}

		options.page_to_edit = page_data;
		options.last_page_error = error;
		// options.last_page_options = options;
	}

	// @inner
	wiki_API.KEY_waiting_callback_result_relying_on_this = typeof Symbol === 'function' ? Symbol('waiting callback_result_relying_on_this')
			: '\0waiting callback_result_relying_on_this';

	/**
	 * 设定工作/添加新的工作。
	 * 
	 * 注意: 每个 callback 皆应在最后执行 session.next()。
	 * 
	 * 警告: 若 callback throw，可能导致工作中断，不会自动复原，得要以 wiki.next() 重起工作。
	 * 
	 * 工作原理: 每个实体会hold住一个queue ({Array}this.actions)。 当设定工作时，就把工作推入伫列中。
	 * 另外内部会有另一个行程负责依序执行每一个工作。
	 * 
	 * @see wiki_API_prototype_method() @ CeL.application.net.wiki.list
	 */
	wiki_API.prototype.next = function next(callback_result_relying_on_this) {
		if (this.actions[wiki_API.KEY_waiting_callback_result_relying_on_this]) {
			// assert: 此时为 session.next() 中执行 callback。

			// callback_result_relying_on_this 执行中应该只能 push 进
			// session.actions，不可执行 session.next()!

			// e.g., 'edit_structured_data' 之 callback 直接采用
			// _this.next(next[4], data, error);
			// 若 next[4] 会再次 call session.edit_structured_data()，
			// 可能造成执行 callback_result_relying_on_this 后，
			// 到 'structured_data' 跳出准备 wiki_API.data()，
			// 回到 callback_result_relying_on_this 主程序
			// 就直接跑到 'edit_structured_data' 这边来，结果选了错误的 this.last_page。
			// e.g., check_structured_data() @ CeL.application.net.wiki.edit

			callback_result_relying_on_this = Array.prototype.slice
					.call(arguments);
			callback_result_relying_on_this.unshift('run');
			this.actions.push(callback_result_relying_on_this);

			library_namespace
					.debug(
							'在 callback_result_relying_on_this 中 call this.next() 并且 waiting callback 而跳出。为避免造成多执行序，将执行权交予 call callback_result_relying_on_this() 之母执行序，子执行序这边跳出。',
							1, 'wiki_API.prototype.next');
			// console.trace(this.actions.length);
			return;
		}

		// ------------------------------------------------

		var _this = this;

		if (callback_result_relying_on_this) {
			var process_callback = function process_callback(callback) {
				if (typeof callback !== 'function') {
					_this.set_promise_relying(callback);
					return;
				}

				// run this.next() after callback() finished.
				_this.actions[wiki_API.KEY_waiting_callback_result_relying_on_this] = true;

				try {
					callback = callback
					// _this.next(callback, ...callback_arguments);
					.apply(_this, process_callback.args);
				} catch (e) {
					if (library_namespace.env.has_console)
						console.error(e);
					else
						library_namespace.error(e);
				}

				delete _this.actions[wiki_API.KEY_waiting_callback_result_relying_on_this];

				if (callback)
					_this.set_promise_relying(callback);
			};
			process_callback.args = Array.prototype.slice.call(arguments, 1);
			// console.trace(process_callback.args);

			if (Array.isArray(callback_result_relying_on_this))
				callback_result_relying_on_this.forEach(process_callback);
			else
				process_callback(callback_result_relying_on_this);
			// free / reset
			process_callback = callback_result_relying_on_this = null;
		}

		// assert: false ===
		// library_namespace.is_thenable(callback_result_relying_on_this)

		// ------------------------------------------------------------------------------

		this.running = 0 < this.actions.length;
		if (!this.running) {
			if (library_namespace.is_thenable(this.actions.promise_relying)) {
				this.test_promise_relying();
			} else {
				// this.thread_count = 0;
				// delete this.current_action;
				library_namespace.debug('The queue is empty.', 2,
						'wiki_API.prototype.next');
				// console.trace(this.actions);
			}
			return;
		}

		// 继续执行接下来的行动。

		// ------------------------------------------------

		library_namespace.debug('剩余 ' + this.actions.length + ' action(s)', 2,
				'wiki_API.prototype.next');
		if (library_namespace.is_debug(3)) {
			console
					.trace([
							this.running,
							this.actions.length,
							this.actions.promise_relying,
							this.actions[wiki_API.KEY_waiting_callback_result_relying_on_this],
							next ]);
		}
		if (library_namespace.is_debug(3)
		// .show_value() @ interact.DOM, application.debug
		&& library_namespace.show_value)
			library_namespace.show_value(this.actions.slice(0, 10));
		var next = this.actions.shift();
		// 不改动 next。
		var type = next[0], list_type;
		if (// type in get_list.type
		wiki_API.list.type_list.includes(type)) {
			list_type = type;
			type = 'list';
		}
		// this.current_action = next;
		// console.trace(next);

		if (library_namespace.is_debug(3)) {
			library_namespace.debug(
			//
			'处理 ' + (this.token.lgname ? this.token.lgname + ' ' : '') + '['
			//
			+ next.map(function(arg) {
				// for function
				var message;
				if (arg && arg.toString) {
					message = arg.toString();
				} else {
					try {
						message = JSON.stringify(arg);
					} catch (e) {
						// message = String(arg);
						message = library_namespace.is_type(arg);
					}
				}
				return message && message.slice(0, 80);
			}) + ']', 1, 'wiki_API.prototype.next');
		}

		// ------------------------------------------------

		// 若需改变，需同步更改 wiki_API.prototype.next.methods
		switch (type) {

		// setup options

		case 'set_URL':
			// next[1] : callback
			wiki_API.setup_API_URL(this /* session */, next[1]);
			this.next();
			break;

		case 'set_language':
			// next[1] : callback
			wiki_API.setup_API_language(this /* session */, next[1]);
			this.next();
			break;

		case 'set_data':
			// 设定 this.data_session。
			// using @inner
			// setup_data_session(session, callback, API_URL, password, force)
			wiki_API.setup_data_session(this /* session */,
			// 确保 data_session login 了才执行下一步。
			function() {
				// console.trace(_this);
				// console.trace(_this.data_session);
				// next[1] : callback of set_data
				_this.next(next[1]);
			}, next[2], next[3], next[4]);
			break;

		// ------------------------------------------------
		// account

		case 'login':
			library_namespace.debug(
					'正 log in 中，当 login 后，会自动执行 .next()，处理余下的工作。', 2,
					'wiki_API.prototype.next');
			// rollback
			this.actions.unshift(next);
			break;

		case 'logout':
			// 结束
			// next[1] : callback
			wiki_API.logout(this /* session */, next[1]);
			// this.next();
			break;

		// ------------------------------------------------
		// page access

		case 'query':
			console.trace('use query');
			throw new Error('Please use .query_API() instead of only .query()!');
			library_namespace
					.error('Please use .query_API() instead of only .query()!');
		case 'query_API':
			// wiki_API.query(post_data, callback, options)
			if (next[4] === undefined && library_namespace.is_Object(next[3])
					&& next[3].post_data_only) {
				// shift arguments
				next[4] = next[3];
				next[3] = next[1];
				next[1] = '';
			}

			// wiki_API.query(action, callback, post_data, options)
			wiki_API.query(next[1], function query_API_callback(data, error) {
				// 再设定一次，预防有执行期中间再执行的情况。
				// e.g., wiki.query_api(action,function(){wiki.page();})
				// 注意: 这动作应该放在callback()执行完后设定。
				// next[2] : callback
				_this.next(next[2], data, error);
			}, next[3],
			// next[4] : options
			add_session_to_options(this, next[4]));
			break;

		case 'siteinfo':
			// wiki.siteinfo(options, callback)
			// wiki.siteinfo(callback)
			if (typeof next[1] === 'function' && !next[2]) {
				// next[1] : callback
				next[2] = next[1];
				next[1] = null;
			}

			wiki_API.siteinfo(add_session_to_options(this, next[1]), function(
					data, error) {
				// next[2] : callback
				// run next action
				_this.next(next[2], data, error);
			});
			break;

		case 'page':
			// console.trace(next);
			// this.page(page data, callback, options);
			if (library_namespace.is_Object(next[2]) && !next[3]) {
				// 直接输入 options，未输入 callback。
				next.splice(2, 0, null);
			}

			var revisions_parameters = next[1] && next[1].revisions_parameters
					|| Object.create(null);
			// → 此法会采用所输入之 page data 作为 this.last_page，不再重新撷取 page。
			if (wiki_API.is_page_data(next[1])

			// 检查是否非 cached 的内容。
			&& (!next[3] || (!next[3].rvprop
			//
			|| next[3].rvprop === revisions_parameters.rvprop))

			&& (!next[3]
			// 重复编辑同一个页面？
			|| next[3].page_to_edit !== wiki_API.VALUE_set_page_to_edit)

			// 必须有页面内容，要不可能仅有资讯。有时可能已经撷取过却发生错误而没有页面内容，此时依然会再撷取一次。
			&& (wiki_API.content_of.has_content(next[1],
			//
			next[3] && next[3].rvlimit - 1)
			// 除非刚刚才取得，同一个执行绪中不需要再度取得内容。
			|| next[3] && next[3].allow_missing
			// 确认真的是不存在的页面。预防一次撷取的页面内容太多，或者其他出错情况，实际上没能成功取得页面内容，
			// next[1].revisions:[]
			&& (('missing' in next[1]) || ('invalid' in next[1])))) {
				library_namespace.debug('采用所输入之 '
						+ wiki_API.title_link_of(next[1])
						+ ' 作为 this.last_page。', 2, 'wiki_API.prototype.next');
				// console.trace(next);
				this.last_page = next[1];
				// console.trace(next[1]);
				set_page_to_edit(next[3], next[1], this.last_page,
						this.last_page_error);
				// next[2] : callback
				this.next(next[2], next[1]);
				break;
			}
			// free
			revisions_parameters = null;

			if (this.last_page_title === next[1]
					&& this.last_page_options === next[3]) {
				// 这必须防范改动页面之后重新取得。
				library_namespace.debug('采用前次的回传以避免重复取得页面。', 2,
						'wiki_API.prototype.next');
				// console.trace('采用前次的回传以避免重复取得页面: ' + next[1]);
				set_page_to_edit(next[3], next[1], this.last_page_error);
				// next[2] : callback
				this.next(next[2], this.last_page,
				// @see "合并取得页面的操作"
				this.last_page_error);
				break;
			}

			// ----------------------------------

			if (typeof next[1] === 'function') {
				// this.page(callback): callback(last_page)
				set_page_to_edit(next[3], this.last_page, this.last_page_error);
				// next[1] : callback
				this.next(next[1], this.last_page, this.last_page_error);
				break;
			}

			// ----------------------------------

			if (false) {
				console.trace(_this.thread_count + '/' + _this.actions.length
						+ 'actions: '
						+ _this.actions.slice(0, 9).map(function(action) {
							return action[0];
						}));
				// console.log(next);
			}

			// 准备撷取新的页面。为了预防旧的页面资料被误用，因此将此将其删除。
			// 例如在 .edit() 的callback中再呼叫 .edit():
			// wiki.page().edit(,()=>wiki.page().edit(,))
			delete this.last_page;

			// console.trace(next[1]);

			// next[3] : options
			if (next[3]) {
				if (next[3].page_to_edit === wiki_API.VALUE_set_page_to_edit) {
					// page-edit 组合式操作。设定等待先前的取得页面操作中。
					next[3].waiting_for_previous_combination_operation = true;
				}
				// 设定个仅 debug 用、无功能的注记。
				next[3].actions_when_fetching_page = [ next ]
						.append(this.actions);
			}

			// this.page(title, callback, options)
			// next[1] : title
			// next[3] : options
			// [ {String}API_URL, {String}title or {Object}page_data ]
			wiki_API.page(is_api_and_title(next[1]) ? next[1] : [ this.API_URL,
					next[1] ],
			//
			function wiki_API_next_page_callback(page_data, error) {
				// console.trace([ page_data, error ]);
				if (false) {
					if (Array.isArray(page_data)) {
						console.trace(page_data.length
								+ ' pages get: '
								+ page_data.slice(0, 10).map(
										function(page_data) {
											return page_data.title;
										}));
					} else {
						console.trace([ page_data, error ]);
					}
				}
				// assert: 当错误发生，例如页面不存在/已删除，依然需要模拟出 page_data。
				// 如此才能执行 .page().edit()。
				_this.last_page
				// 正常情况。确保this.last_page为单页面。需要使用callback以取得result。
				= Array.isArray(page_data) ? page_data[0] : page_data;
				// 用于合并取得页面的操作。 e.g.,
				// node 20201008.fix_anchor.js use_language=zh archives
				_this.last_page_title = next[1];
				_this.last_page_options = next[3];
				_this.last_page_error = error;

				// next[3] : options
				set_page_to_edit(next[3], page_data, error, next[1]);

				var original_title = next[1];
				// assert: typeof original_title === 'string'
				var next_action = _this.actions[0];
				if (false && next_action
				//
				&& next_action[0] === 'edit'
				// next_action[2]: options
				&& typeof next_action[2] === 'object'
				//
				&& (!next_action[2].page_to_edit
				//
				|| next_action[2].page_to_edit
				//
				=== wiki_API.VALUE_set_page_to_edit)) {
					if (!next_action[2].page_title_to_edit
					//
					|| next_action[2].page_title_to_edit === original_title) {
						if (original_title !== page_data.title) {
							library_namespace.info(
							//
							'wiki_API.prototype.next.page: ' + '所取得页面的标题改变: '
									+ wiki_API.title_link_of(original_title)
									+ '→'
									+ wiki_API.title_link_of(page_data.title));
						}
						// 手动指定要编辑的页面。避免多执行续打乱 wiki.last_page。
						next_action[2].page_to_edit = page_data;
						next_action[2].page_title_to_edit = original_title;
						next_action[2].last_page_options = next[3];
						next_action[2].last_page_error = error;
					} else {
						library_namespace.error(
						//
						'wiki_API.prototype.next.page: ' + '无法设定欲编辑的页面资讯: '
								+ wiki_API.title_link_of(original_title) + '→'
								+ wiki_API.title_link_of(page_data.title)
								+ ' 不等于 ' + wiki_API.title_link_of(
								//
								next_action[2].page_title_to_edit));
						console.trace([ next, next_action ]);
					}
				}

				if (!page_data) {
					// console.trace([ '' + next[2], page_data, error ]);
				}

				// console.trace(_this.actions);
				// next[2] : callback
				_this.next(next[2], page_data, error);
			},
			// next[3] : options
			add_session_to_options(this, next[3]));
			break;

		case 'tracking_revisions':
			if (typeof next[3] === 'object') {
				// shift arguments
				next[4] = next[3];
				next[3] = null;
			}
			wiki_API.tracking_revisions(next[1], next[2], function(revision,
					error) {
				_this.next(next[3], revision, error);
			},
			// next[4] : options
			add_session_to_options(this, next[4]));
			break;

		case 'parse':
			// e.g., wiki.page('title', options).parse(callback, options);
			if (library_namespace.is_Object(next[1]) && !next[2]) {
				// 直接输入 options，未输入 callback。
				next.splice(1, 0, null);
			}

			// next[2] : options
			var parsed = wiki_API.parser(this.last_page,
					add_session_to_options(this, next[2])).parse();
			// next[3] : callback
			this.next(next[1], parsed);
			break;

		case 'purge':
			if (typeof next[1] === 'string' || typeof next[1] === 'number') {
				// purge() 可以直接输入页面，不必先 .page('Title')
				// wiki.purge('Title', callback, options)
				// wiki.purge('Title', options)
				// wiki.purge(pageid, callback, options)
				// wiki.purge('pageid|pageid', options)
			} else {
				// wiki.page('Title').purge()
				// wiki.page('Title').purge(callback, options)
				// wiki.page('Title').purge(options)
				next.splice(1, 0, this.last_page);
			}

			if (library_namespace.is_Object(next[2]) && !next[3]) {
				// 直接输入 options，未输入 callback。
				next.splice(2, 0, null);
			}

			// next: [ 'purge', pages, callback, options ]

			if (!next[1]) {
				library_namespace
						.warn('wiki_API.prototype.next.purge: No page inputed!');
				// next[3] : callback
				this.next(next[3], undefined, 'no page');

			} else {
				wiki_API.purge([ this.API_URL, next[1] ],
				//
				function wiki_API_next_purge_callback(purge_pages, error) {
					// next[2] : callback
					_this.next(next[2], purge_pages, error);
				},
				// next[3] : options
				add_session_to_options(this, next[3]));
			}
			break;

		case 'redirect_to':
			// this.redirect_to(page data, callback, options);
			if (library_namespace.is_Object(next[2]) && !next[3]) {
				// 直接输入 options，未输入 callback。
				next.splice(2, 0, null);
			}

			// this.redirect_to(title, callback, options)
			// next[1] : title
			// next[3] : options
			// [ {String}API_URL, {String}title or {Object}page_data ]
			wiki_API.redirect_to(is_api_and_title(next[1]) ? next[1] : [
					this.API_URL, next[1] ],
			//
			function wiki_API_next_redirect_to_callback(redirect_data,
					page_data, error) {
				// next[2] : callback
				_this.next(next[2], redirect_data, page_data, error);
			},
			// next[3] : options
			add_session_to_options(this, next[3]));
			break;

		case 'list':
			// get_list(). e.g., 反向连结/连入页面。

			// next[1] : 大部分是 page title,
			// 但因为有些方法不需要用到页面标题(recentchanges,allusers)因此对于这一些方法需要特别处理。
			if (typeof next[1] === 'function' && typeof next[2] !== 'function') {
				next.splice(1, 0, '');
			}

			// 注意: arguments 与 get_list() 之 callback 连动。
			wiki_API[list_type]([ this.API_URL, next[1] ],
			//
			function wiki_API_next_list_callback(pages, error) {
				// [ page_data ]
				_this.last_pages = pages;

				if (typeof next[2] === 'function') {
					// 注意: arguments 与 get_list() 之 callback 连动。
					callback_result_relying_on_this
					// next[2] : callback(pages, error)
					= next[2].call(_this, pages, error);
				} else if (next[2] && next[2].each) {
					// next[2] : 当作 work，处理积存工作。
					if (pages) {
						_this.work(next[2]);
					} else {
						// 只有在本次有处理页面时，才继续下去。
						library_namespace.info('无页面可处理（已完成？），中断跳出。');
					}
				}

				_this.next(callback_result_relying_on_this);
			},
			// next[3] : options
			add_session_to_options(this, next[3]));
			break;

		// case 'category_tree':
		// @see wiki_API.prototype.category_tree @ application.net.wiki.list

		// register page alias. usually used for templates
		case 'register_redirects':
			// wiki.register_redirects(page_title_list, callback, options)
			// wiki.register_redirects(page_title_list, options)
			if (library_namespace.is_Object(next[2]) && !next[3]) {
				// 未设定/不设定 callback
				// shift arguments
				next.splice(2, 0, undefined);
			}

			// next[3] : options
			next[3] = Object.assign({
				// [KEY_SESSION]
				session : this,
				// Making .redirect_list[0] the redirect target.
				include_root : true,
				// converttitles: 1,
				// multiple pages
				multi : Array.isArray(next[1]) && next[1].length > 1
			}, next[3]);

			// next[1]: page_title
			if (next[3].namespace)
				next[1] = this.to_namespace(next[1], next[3].namespace);
			// console.trace(next[1]);
			next[1] = this.normalize_title(next[1]);
			if (!next[1]) {
				library_namespace.error([
				//
				'wiki_API.prototype.next.register_redirects: ', {
					// gettext_config:{"id":"invalid-title-$1"}
					T : [ 'Invalid title: %1',
					//
					wiki_API.title_link_of(next[1]) ]
				} ]);
				// next[2] : callback(root_page_data, error)
				this.next(next[2], next[1], new Error(gettext(
				// gettext_config:{"id":"invalid-title-$1"}
				'Invalid title: %1', wiki_API.title_link_of(next[1]))));
				break;
			}

			if (next[3].reget) {
			} else if (Array.isArray(next[1])) {
				next[1] = next[1].filter(function(page_title) {
					return page_title && !(page_title in _this.redirects_data);
				}).unique();
				if (next[1].length === 0) {
					// next[2] : callback(root_page_data, error)
					this.next(next[2]);
					break;
				}

			} else if (next[1] in this.redirects_data) {
				if (false) {
					console.trace('已处理过 have registered, use cache: ' + next[1]
							+ '→' + this.redirects_data[next[1]]);
				}
				// next[2] : callback(root_page_data, error)
				this.next(next[2]);
				break;
			}

			if (Array.isArray(next[1])) {
				// next[3] : options
				var slice_size = next[3].one_by_one ? 1
				// 50: 避免 HTTP status 414: Request-URI Too Long
				: next[3].slice_size >= 1 ? Math.min(50, next[3].slice_size)
						: 50;
				while (next[1].length > slice_size) {
					_this.actions.unshift([ next[0],
					// keep request order
					slice_size === 1 ? next[1].pop()
					//
					: next[1].splice(next[1].length - slice_size, slice_size),
							next[2], next[3] ]);
					// remove callback: only run callback at the latest
					// time.
					next[2] = undefined;
				}
			}

			// console.trace(JSON.stringify(next[1]));
			// 解析出所有 next[1] 别名
			// next[1]: page_title
			wiki_API.redirects_here(next[1], function(root_page_data,
					redirect_list, error) {
				if (error) {
					// console.trace(error);
					// next[2] : callback(root_page_data, error)
					_this.next(next[2], null, error);
					return;
				}

				if (false) {
					console.trace(root_page_data);
					console.trace(redirect_list);
					console.assert(!redirect_list
							|| redirect_list === root_page_data.redirect_list);
				}

				var registered_page_list = Array.isArray(next[1]) ? next[1]
						: [ next[1] ];
				// from: alias, to: 正式名称
				function register_title(from, to) {
					if (!from
					// || (from in _this.redirects_data)
					) {
						return;
					}
					// assert: from ===
					// _this.normalize_title(from)
					// the namespace of from, to is normalized
					_this.redirects_data[from] = to;
					registered_page_list.push(from);
				}
				function register_root_alias(page_data) {
					if (page_data.original_title) {
						// console.trace(page_data);
						register_title(page_data.original_title,
						//
						page_data.title);
					}
					if (page_data.redirect_from) {
						register_title(page_data.redirect_from,
						//
						page_data.title);
					}
				}
				function register_redirect_list(redirect_list, page_title) {
					// console.trace(redirect_list);
					// 本名
					var target_page_title = redirect_list[0].title;
					var is_missing = !target_page_title
							|| ('missing' in redirect_list[0])
							|| ('invalid' in redirect_list[0]);
					if (!is_missing) {
						redirect_list.forEach(function(page_data) {
							register_title(page_data.title, target_page_title);
						});
					}

					if (next[3].no_message) {
						return;
					}

					var message = 'register_redirects: '
							+ (page_title === target_page_title ? ''
									: (wiki_API.title_link_of(page_title)
									// JSON.stringify(page_title)
									// Should not go to here
									|| page_title) + ' → ')
							+ wiki_API.title_link_of(target_page_title) + ': ';

					if (is_missing) {
						message += 'Missing';
						library_namespace.warn(message);
						return;
					}

					message += gettext(redirect_list.length === 1
					// gettext_config:{"id":"no-page-redirects-to-this-page"}
					? '无页面重定向至本页'
					// gettext_config:{"id":"total-$1-pages-redirected-to-this-page"}
					: '共有%1个{{PLURAL:%1|页面}}重定向至本页', redirect_list.length - 1);
					if (1 < redirect_list.length && redirect_list.length < 6) {
						message += ': '
						//
						+ redirect_list.slice(1).map(function(page_data) {
							// return page_data.title;
							return wiki_API.title_link_of(page_data);
						}).join(gettext('Comma-separator'));
					}
					library_namespace.info(message);
				}

				if (redirect_list) {
					// e.g., wiki_API.redirects_here({String})
					// console.trace([ next[1], root_page_data ]);
					register_redirect_list(redirect_list,
					//
					Array.isArray(next[1]) ?
					// assert: next[1].length === 1
					next[1][0] : next[1]);
					register_root_alias(root_page_data);
				} else {
					// e.g., wiki_API.redirects_here({Array})
					root_page_data.forEach(function(page_data) {
						// console.trace(page_data.redirect_list);
						// console.trace(page_data.original_title);
						register_redirect_list(page_data.redirect_list
								|| [ page_data ], page_data.original_title
								|| page_data.title);
						register_root_alias(page_data);
					});
				}

				// console.trace(_this.redirects_data);

				if (false) {
					console.trace([ next[3].no_languagevariants,
							!_this.has_languagevariants ]);
				}
				if (next[3].no_languagevariants || !_this.has_languagevariants
				// /[\u4e00-\u9fa5]/: 匹配中文。
				// https://en.wikipedia.org/wiki/CJK_Unified_Ideographs_(Unicode_block)
				// || !/[\u4e00-\u9fa5]/.test(next[1])
				) {
					// next[2] : callback(root_page_data, error)
					_this.next(next[2], root_page_data);
					return;
				}

				// 处理 converttitles。
				// console.trace('处理繁简转换问题: ' + registered_page_list);
				// console.trace(root_page_data);
				// console.trace(JSON.stringify(_this.redirects_data));
				function register_redirect_list_via_mapper(original_list,
						list_to_map) {
					// console.trace(next[3].uselang + ': ' + list_to_map);
					list_to_map.forEach(function(map_from, index) {
						// if (map_from in _this.redirects_data) return;
						var map_to
						//
						= _this.redirects_data[original_list[index]];
						// console.log(map_from + ' → ' + map_to);
						_this.redirects_data[map_from] = map_to;
					});
				}

				// next[3] : options
				next[3].uselang = 'zh-hant';
				wiki_API.convert_Chinese(registered_page_list, function(
						converted_hant) {
					register_redirect_list_via_mapper(registered_page_list,
							converted_hant);
					next[3].uselang = 'zh-hans';
					wiki_API.convert_Chinese(registered_page_list, function(
							converted_hans) {
						register_redirect_list_via_mapper(registered_page_list,
								converted_hans);
						_this.next(next[2], root_page_data);
					}, next[3]);
				}, next[3]);
			},
			// next[3] : options
			next[3]);
			break;

		case 'search':
			if (!next[3])
				next[3] = Object.create(null);
			if (!next[3].next_mark)
				next[3].next_mark = Object.create(null);

			wiki_API.search([ this.API_URL, next[1] ],
			//
			function wiki_API_search_callback(pages, error) {
				// undefined || [ page_data ]
				_this.last_pages = pages;
				// 设定/纪录后续检索用索引值。
				// 若是将错误的改正之后，应该重新自 offset 0 开始 search。
				// 因此这种情况下基本上不应该使用此值。
				if (pages && pages.sroffset) {
					next[3].next_mark.sroffset = pages.sroffset;
				}

				if (typeof next[2] === 'function') {
					callback_result_relying_on_this
					// next[2] : callback(...)
					= next[2].call(_this, pages || [], error);
				} else if (next[2] && next[2].each) {
					// next[2] : 当作 work，处理积存工作。
					// next[2].each(page_data, messages, config)
					_this.work(next[2]);
				}

				_this.next(callback_result_relying_on_this);
			},
			// next[3] : options
			add_session_to_options(this, next[3]));
			break;

		case 'copy_from':
			// Will soon stop after break.
			this.running = false;
			// `wiki_API_prototype_copy_from`
			wiki_API.edit.copy_from.apply(this, next.slice(1));
			// TODO: callback: this.next();
			break;

		case 'download':
			// Will soon stop after break.
			this.running = false;
			wiki_API.download.apply(this, next.slice(1));
			break;

		// ----------------------------------------------------------------------------------------

		case 'check':
			// 正规化并提供可随意改变的同内容参数，以避免修改或覆盖附加参数。
			next[1] = library_namespace.new_options(this.check_options,
			// next[1]: options
			typeof next[1] === 'boolean' ? {
				force : next[1]
			} : typeof options === 'string' ? {
				title : next[1]
			} : next[1]);

			// ('stopped' in this): 已经有 cache。
			if (this.checking_now || ('stopped' in this)
			// force to check
			&& !next[1].force) {
				if (this.checking_now) {
					library_namespace.debug('checking now...', 3,
							'wiki_API.prototype.next');
				} else {
					library_namespace.debug('Skip check_stop().', 1,
							'wiki_API.prototype.next');
				}
				// 在多执行绪的情况下，避免 `RangeError: Maximum call stack size exceeded`。
				// next[2] : callback(...)
				setTimeout(this.next.bind(this, next[2], this.stopped), 0);

			} else {
				// 仅检测一次。在多执行绪的情况下，可能遇上检测多次的情况。
				this.checking_now = next[1].title || true;

				library_namespace.debug('以 .check_stop() 检查与设定是否须停止编辑作业。', 1,
						'wiki_API.prototype.next');
				library_namespace
						.debug('Using options to call check_stop(): '
								+ JSON.stringify(next[1]), 2,
								'wiki_API.prototype.next');
				next[1].token = this.token;
				// 正作业中之 wiki_API instance。
				next[1][KEY_SESSION] = this;
				wiki_API.check_stop(function(stopped) {
					delete _this.checking_now;
					library_namespace.debug('check_stop: ' + stopped, 1,
							'wiki_API.prototype.next');
					_this.stopped = stopped;
					// next[2] : callback(...)
					_this.next(next[2], stopped);
				},
				// next[1] : options
				next[1]);
			}
			break;

		case 'edit':
			// wiki.edit(page contents, options, callback)
			if (typeof next[2] === 'string') {
				// wiki.edit(page contents, summary, callback)
				next[2] = {
					summary : next[2]
				};
			}

			// console.trace(next, this.last_page);

			// Warning: 复杂操作时，应该以 options 来承载编辑页面资讯，
			// 不该以 .page().edit() 依赖预设的 .last_page。
			// 因为在 .page() 与 .edit() 间可能插入其他操作，改变 .last_page。

			// 在多执行绪的情况下，例如下面
			// `next[1] = next[1].call(next[2], next[2].page_to_edit)`
			// 的时候，this.last_page 可能会被改变，因此先作个 cache。
			// next[2]: options
			// console.trace(next[2]);
			next[2] = library_namespace.setup_options(next[2]);
			// `next[2].page_to_edit`: 手动指定要编辑的页面。
			if ((!next[2].page_to_edit || next[2].page_to_edit === wiki_API.VALUE_set_page_to_edit)
					&& !next[2].last_page_error
					&& (this.last_page || this.last_page_error)
					&& (!next[2].page_title_to_edit || next[2].page_title_to_edit === this.last_page_title)) {
				// console.trace([ next, this.last_page ]);
				// e.g., page 本身是非法的页面标题。当 session.page() 出错时，将导致没有 .last_page。
				if (false) {
					console.trace('Set .page_to_edit:'
							+ wiki_API.title_link_of(this.last_page) + ' ('
							+ wiki_API.title_link_of(next[2].page_to_edit)
							+ ')');
					// console.trace(next[2]);
				}
				set_page_to_edit(next[2], this.last_page, this.last_page_error,
						this.last_page_title);
				// next[2].page_to_edit = this.last_page;
				next[2].last_page_options = this.last_page_options;
				// next[2].last_page_error = this.last_page_error;
			}
			// console.trace(next[2]);
			// console.trace(next);

			// TODO: {String|RegExp|Array}filter

			if (false && next[2].page_to_edit !== this.last_page) {
				console.trace('session.edit:'
						+ (next[2].page_to_edit && next[2].page_to_edit.title));
				console.log('last_page:'
						+ (this.last_page && this.last_page.title));
			}

			if (!next[2].page_to_edit
					|| next[2].page_to_edit === wiki_API.VALUE_set_page_to_edit) {
				if (this.actions.promise_relying
				// Should be set by case 'page':
				&& next[2].waiting_for_previous_combination_operation) {
					// e.g., `await wiki.edit_page(wiki.to_talk_page(page_data)`
					// @ routine/20191129.check_language_conversion.js
					if (library_namespace.is_debug(0)) {
						library_namespace
								.error('wiki_API.prototype.next: 可能是 .page() 之后，.edit() 受到 this.actions.promise_relying 触发，造成双重执行？直接跳出，尝试等待其他执行绪回来执行。');
					}
					this.actions.unshift(next);
					break;
				}

				if (next[2].last_page_error || this.last_page_error) {
					library_namespace
							.warn('wiki_API.prototype.next: 无法取得页面，跳出编辑: '
									+ next[2].page_title_to_edit);
					library_namespace.error(next[2].last_page_error
							|| this.last_page_error);
					this.next(next[3], undefined, 'page fetch error',
							next[2].last_page_error && next[2] || this);
					break;
				}

				if (false && next[2].page_title_to_edit) {
					library_namespace.warn('wiki_API.prototype.next: 尝试先取得页面: '
							+ next[2].page_title_to_edit);
					this.actions.unshift([ 'page', next[2].page_title_to_edit,
							next[2] ], next);
					break;
				}

				library_namespace
						.warn('wiki_API.prototype.next: No page in the queue. You must run .page() first! 另请注意: 您不能在 callback 中呼叫 .edit() 之类的 wiki 函数！请在 callback 执行完毕后再执行新的 wiki 函数！例如放在 setTimeout() 中。');
				if (typeof console === 'object' && console.trace) {
					console.trace(this);
					console
							.trace(next[2]
									&& next[2].actions_when_fetching_page);
					console
							.trace([
									this.running,
									this.actions.length,
									this.actions.promise_relying,
									this.actions[wiki_API.KEY_waiting_callback_result_relying_on_this],
									next ]);
				}
				// throw new Error('No page in the queue.');
				if (library_namespace.is_debug(0)) {
					library_namespace
							.error('wiki_API.prototype.next: 直接跳出，尝试等待其他执行绪回来执行。');
				}
				this.actions.unshift(next);
				break;

				// next[3] : callback
				this.next(next[3], undefined, 'no page');
				break;
			}
			// assert: wiki_API.is_page_data(next[2].page_to_edit)

			if (typeof next[1] !== 'string'
			// @see check_and_delete_revisions
			&& next[2] && next[2].section !== 'new'
			//
			&& !wiki_API.content_of.had_fetch_content(next[2].page_to_edit)) {
				console.trace(this);
				console.trace('actions_when_fetching_page:',
						next[2].actions_when_fetching_page);
				console.trace('next:', next);
				console.trace('page_to_edit:', next[2].page_to_edit);
				console.trace('this.actions:', this.actions);
				throw new Error(
						'wiki_API.prototype.next: There are multiple threads competing with each other? 有多个执行绪互相竞争？');
				library_namespace
						.error('wiki_API.prototype.next: 有多个执行绪互相竞争？本执行绪将会直接跳出，等待另一个取得页面内容的执行绪完成后，由其处理。');
				this.actions.unshift(next);
				break;
			}

			var check_and_delete_revisions = function() {
				if (!next[2].page_to_edit
						|| next[2].page_to_edit === wiki_API.VALUE_set_page_to_edit) {
					return;
				}
				var next_action = _this.actions[0];
				if (next_action && next_action[0] === 'edit'
				// 明确指定内容时，只要知道标题即可，不必特地检查是否有内容。
				&& typeof next_action[1] !== 'string'
				//
				&& next_action[2] && next_action[2].section !== 'new'
				//
				&& next[2].page_to_edit === next_action[2].page_to_edit) {
					// assert: wiki.page().edit().edit()
					// e.g., 20160906.archive_moegirl.js
					// Should reget page
					if (false) {
						console.trace('Get page: '
								+ wiki_API.title_link_of(next[2].page_to_edit));
					}
					_this.actions
							.unshift([ 'page', next_action[2].page_to_edit ]);
				}
				// 因为已经更动过内容，为了预防 this.last_page 取得已修改过的错误资料，因此将之删除。但留下标题资讯。
				delete next[2].page_to_edit.revisions;
				// next[2].page_to_edit.revisions_removed_since_modified = true;
				// 预防连续编辑采用相同编辑选项。 var edit_options;
				// wiki.page(A).edit(,edit_options);
				// wiki.page(B).edit(,edit_options);

				// delete next[2].page_to_edit;
				next[2].page_to_edit = wiki_API.VALUE_set_page_to_edit;
			};

			if (!('stopped' in this)) {
				library_namespace.debug(
						'edit: rollback, check if need stop 紧急停止.', 2,
						'wiki_API.prototype.next');
				this.actions.unshift([ 'check', null, function() {
					library_namespace.debug(
					//
					'edit: recover next[2].page_to_edit: '
					//
					+ wiki_API.title_link_of(next[2].page_to_edit) + '.',
					//
					2, 'wiki_API.prototype.next');
					// _this.last_page = next[2].page_to_edit;
				} ], next);
				this.next();
				break;
			}

			if (this.stopped && !next[2].skip_stopped) {
				library_namespace.warn('wiki_API.prototype.next: 已停止作业，放弃编辑'
						+ wiki_API.title_link_of(next[2].page_to_edit) + '！');
				// next[3] : callback
				this.next(next[3], next[2].page_to_edit.title, '已停止作业');
				break;
			}

			if (next[2].page_to_edit.is_Flow) {
				// next[2]: options to call edit_topic()=CeL.wiki.Flow.edit
				// .section: 章节编号。 0 代表最上层章节，new 代表新章节。
				if (next[2].section !== 'new') {
					library_namespace
							.warn('wiki_API.prototype.next: The page to edit is Flow. I cannot edit it directly: '
									+ wiki_API
											.title_link_of(next[2].page_to_edit));
					// next[3] : callback
					this.next(next[3],
					// 2017/9/18 Flow已被重新定义为结构化讨论 / 结构式讨论。
					// is [[mw:Structured Discussions]].
					next[2].page_to_edit.title, 'is Flow');
					break;
				}

				if (!next[2].page_to_edit.header) {
					// rollback
					this.actions.unshift(next);
					// 先取得关于讨论板的描述。以此为依据，检测页面是否允许机器人帐户访问。
					// Flow_page()
					wiki_API.Flow.page(next[2].page_to_edit, function() {
						// next[3] : callback
						if (typeof next[3] === 'function')
							callback_result_relying_on_this = next[3].call(
									this, next[2].page_to_edit.title);
						check_and_delete_revisions();
						_this.next(callback_result_relying_on_this);
					}, {
						flow_view : 'header',
						// [KEY_SESSION]
						session : this
					});
					break;
				}

				if ((!next[2] || !next[2].ignore_denial)
						&& wiki_API.edit.denied(next[2].page_to_edit,
								this.token.login_user_name, next[2]
										&& next[2].notification_name)) {
					// {{bot}} support for flow page
					// 采用 next[2].page_to_edit 的方法，
					// 在 multithreading 下可能因其他 threading 插入而造成问题，须注意！
					library_namespace
							.warn('wiki_API.prototype.next: Denied to edit flow '
									+ wiki_API
											.title_link_of(next[2].page_to_edit));
					// next[3] : callback
					this.next(next[3], next[2].page_to_edit.title, 'denied');
					break;
				}

				library_namespace.debug('直接采用 Flow 的方式增添新话题。');
				// use/get the contents of next[2].page_to_edit
				if (typeof next[1] === 'function') {
					// next[1] =
					// next[1](wiki_API.content_of(next[2].page_to_edit),
					// next[2].page_to_edit.title, next[2].page_to_edit);
					// 需要同时改变 wiki_API.edit！
					// next[2]: options to call
					// edit_topic()=CeL.wiki.Flow.edit
					// .call(options,): 使(回传要编辑资料的)设定值函数能以this即时变更 options。
					next[1] = next[1].call(next[2], next[2].page_to_edit);
				}

				// edit_topic()
				wiki_API.Flow.edit([ this.API_URL, next[2].page_to_edit ],
				// 新章节/新话题的标题文字。输入空字串""的话，会用 summary 当章节标题。
				next[2].sectiontitle,
				// 新话题最初的内容。因为已有 contents，直接喂给转换函式。
				// [[mw:Flow]] 会自动签名，因此去掉签名部分。
				next[1].replace(/[\s\n\-]*~~~~[\s\n\-]*$/, ''),
				//
				this.token,
				// next[2]: options to call edit_topic()=CeL.wiki.Flow.edit
				add_session_to_options(this, next[2]), function(title, error,
						result) {
					// next[3] : callback
					if (typeof next[3] === 'function')
						callback_result_relying_on_this = next[3].call(_this,
								title, error, result);
					check_and_delete_revisions();
					_this.next(callback_result_relying_on_this);
				});
				break;
			}

			if ((!next[2] || !next[2].ignore_denial)
					&& wiki_API.edit.denied(next[2].page_to_edit,
							this.token.login_user_name, next[2]
									&& next[2].notification_name)) {
				// 采用 next[2].page_to_edit 的方法，
				// 在 multithreading 下可能因其他 threading 插入而造成问题，须注意！
				library_namespace
						.warn('wiki_API.prototype.next: Denied to edit '
								+ wiki_API.title_link_of(next[2].page_to_edit));
				// next[3] : callback
				this.next(next[3], next[2].page_to_edit.title, 'denied');
				break;
			}

			// ----------------------------------------------------------------------
			// wiki_API.edit()

			var original_queue,
			// 必须在最终执行刚好一次 check_next() 以 `this.next()`。
			check_next = function check_next(callback_result, no_next) {
				if (original_queue) {
					// assert: {Array}original_queue.length > 0
					if (false) {
						console.trace('回填/回复 queue[' + original_queue.length
								+ ']');
					}
					_this.actions.append(original_queue);
					// free
					original_queue = null;
				}
				if (no_next) {
					_this.set_promise_relying(callback_result);
				} else {
					// 无论如何都再执行 this.next()，并且设定 this.running。
					// e.g., for
					// 20200209.「S.P.A.L.」関连ページの贴り换えのbot作业依頼.js

					// console.trace([ _this.running, _this.actions.length ]);
					// setTimeout(_this.next.bind(_this), 0);
					_this.next(callback_result);
				}
			};

			if (typeof next[1] === 'function') {
				// 为了避免消耗 memory，尽可能把本 sub 任务先执行完。
				// e.g., 20200206.reminded_expired_AfD.js
				// 采用 cache queue 再回填/回复 queue，在程序把 edit 动作与后面的动作连成一体、相互影响时会出错。
				if (false && this.actions.length > 0) {
					original_queue = this.actions.clone();
					this.actions.truncate();
					// console.trace('queue[' + original_queue.length + ']');
				}
				// console.trace('next:');
				// console.log(next);

				// next[1] = next[1](wiki_API.content_of(next[2].page_to_edit),
				// next[2].page_to_edit.title, next[2].page_to_edit);
				// 需要同时改变 wiki_API.edit！
				// next[2]: options to call edit_topic()=CeL.wiki.Flow.edit
				// .call(options,): 使(回传要编辑资料的)设定值函数能以this即时变更 options。
				next[1] = next[1].call(next[2], next[2].page_to_edit);
			}

			if (next[2] && next[2].skip_nochange
			// 采用 skip_nochange 可以跳过实际 edit 的动作。
			&& next[1] === wiki_API.content_of(next[2].page_to_edit)) {
				// console.log(next[2]);
				// console.trace(next[2].page_to_edit.title);
				library_namespace.debug('Skip '
				//
				+ wiki_API.title_link_of(next[2].page_to_edit)
				// 'nochange', no change
				+ ': The same content.', 1, 'wiki_API.prototype.next');
				check_next(typeof next[3] === 'function'
				// next[3] : callback
				&& next[3].call(this, next[2].page_to_edit.title, 'nochange'));
				break;
			}

			next[2].rollback_action = function rollback_action() {
				if (false) {
					console.trace('rollback action: '
							+ wiki_API.title_link_of(next[2].page_to_edit));
				}
				_this.actions.unshift(
				// 重新登入以后，编辑页面之前再取得一次页面内容。
				[ 'page', next[2].page_to_edit.title ], next);
				check_next(null, true);
			};

			wiki_API.edit([ this.API_URL, next[2].page_to_edit ],
			// 因为已有 contents，直接喂给转换函式。
			next[1], this.token,
			// next[2]: options to call wiki_API.edit()
			add_session_to_options(this, next[2]),
			//
			function wiki_API_next_edit_callback(title, error, result) {
				// 删掉自己加的东西。
				// e.g., 重复利用当过 .edit() 的 options，必须先 `delete
				// options.rollback_action`。
				delete next[2].rollback_action;
				// next[2].page_to_edit = wiki_API.VALUE_set_page_to_edit;
				// delete next[2].page_to_edit;

				// next[3] : callback
				if (typeof next[3] === 'function') {
					callback_result_relying_on_this = next[3].apply(_this,
							arguments);
				}
				// console.trace('assert: 应该有 next[2].page_to_edit。');
				// console.trace(next[2].page_to_edit);
				check_and_delete_revisions();
				check_next(callback_result_relying_on_this);
				// console.trace(title);
				// console.trace(_this.actions);
			});
			break;

		// ----------------------------------------------------------------------------------------

		case 'upload':
			var tmp = next[1];
			if (typeof tmp === 'object'
			// wiki.upload({Object}file_data + options, callback)
			&& (tmp = tmp.file_path
			// Get media from URL first.
			|| tmp.media_url || tmp.file_url)) {
				// shift arguments
				next.splice(1, 0, tmp);

			} else if (typeof next[2] === 'string') {
				// wiki.upload(file_path, comment, callback)
				next[2] = {
					comment : next[2]
				};
			}

			// wiki.upload(file_path, options, callback)
			wiki_API.upload(next[1], this.token.csrftoken,
			// next[2]: options to call wiki_API.edit()
			add_session_to_options(this, next[2]), function(result, error) {
				// next[3] : callback
				_this.next(next[3], result, error);
			});
			break;

		case 'cache':
			if (library_namespace.is_Object(next[2]) && !next[3]) {
				// 未设定/不设定 callback
				// shift arguments
				next.splice(2, 0, undefined);
			}

			// 因为 wiki_API.cache(list) 会使用到 wiki_API.prototype[method]，
			// 算是 .next() 编制外功能；
			// 因此需要重新设定 this.running，否则可能中途停止。
			// 例如 this.running = true，但是实际上已经不会再执行了。
			// TODO: 这可能会有bug。
			this.running = 0 < this.actions.length;

			// wiki.cache(operation, callback, _this);
			wiki_API.cache(next[1], function() {
				// overwrite callback() to run this.next();
				// next[2] : callback
				if (typeof next[2] === 'function')
					_this.set_promise_relying(next[2].apply(this, arguments));
				// 因为 wiki_API.cache(list) 会使用到 wiki_API.prototype[method]；
				// 其最后会再 call wiki_API.next()，是以此处不再重复 call .next()。
				// _this.next();
			},
			// next[3]: options to call wiki_API.cache()
			Object.assign({
				// default options === this

				// including main, File, Template, Category
				// namespace : '0|6|10|14',

				// title_prefix : 'Template:',

				// cache path prefix
				// prefix : base_directory,

				// [KEY_SESSION]
				session : this
			}, next[3]));
			break;

		case 'listen':
			if (!wiki_API.wmflabs) {
				// 因为 wiki_API.cache(list) 会使用到 wiki_API.prototype[method]；
				// 其最后会再 call wiki_API.next()，是以此处不再重复 call .next()。

				// 因为接下来的操作会呼叫 this.next() 本身，
				// 因此必须把正在执行的标记消掉。
				this.running = false;
			}

			// wiki.listen(listener, options);
			wiki_API.listen(next[1],
			// next[2]: options to call wiki_API.listen()
			add_session_to_options(this, next[2]));

			if (wiki_API.wmflabs) {
				this.next();
			}
			break;

		// ------------------------------------------------
		// Wikidata access

		case 'data':
			if (!('data_session' in this)) {
				// rollback, 确保已设定 this.data_session。
				this.actions.unshift([ 'set_data' ], next);
				this.next();
				break;
			}

			if (typeof next[1] === 'function') {
				library_namespace.debug(
						'直接将 last_data 输入 callback: ' + next[1], 3,
						'wiki_API.prototype.next.data');
				if (last_data_is_usable(this)) {
					this.next(next[1], this.last_data);
					break;
				}

				library_namespace.debug('last data 不能用。', 3,
						'wiki_API.prototype.next.data');
				// delete this.last_data;
				if (!wiki_API.is_page_data(this.last_page)) {
					this.next(next[1], undefined, {
						code : 'no_id',
						message : 'Did not set id! 未设定欲取得之特定实体 id。'
					});
					break;
				}
				next.splice(1, 0, this.last_page);
			}

			if (typeof next[2] === 'function') {
				// 未设定/不设定 property
				// shift arguments
				next.splice(2, 0, null);
			}

			if (wiki_API.is_entity(next[1])) {
				this.last_data = next[1];
				// next[3] : callback
				this.next(next[3], this.last_data);
				break;
			}

			// 因为前面利用cache时会检查KEY_CORRESPOND_PAGE，且KEY_CORRESPOND_PAGE只会设定在page_data，
			// 因此这边自属于page_data之输入项目设定 .last_page
			if (wiki_API.is_page_data(next[1])
			// 预防把 wikidata entity 拿来当作 input 了。
			&& !wiki_API.is_entity(next[1])) {
				this.last_page = next[1];
			}
			// wikidata_entity(key, property, callback, options)
			wiki_API.data(next[1], next[2], function(data, error) {
				// 就算发生错误，依然设定一个 dummy，预防 edit_data 时引用可能非所欲的 this.last_page。
				_this.last_data = data || {
					key : next[1],
					error : error
				};
				if (false) {
					// 因为在wikidata_entity()里面设定了[KEY_SESSION]，因此JSON.stringify()会造成:
					// TypeError: Converting circular structure to JSON
					library_namespace.debug('设定 entity data: '
							+ JSON.stringify(_this.last_data), 3,
							'wiki_API.prototype.next.data');
				}
				// next[3] : callback
				_this.next(next[3], data, error);
			},
			// next[4] : options
			add_session_to_options(this.data_session, next[4]));
			break;

		case 'edit_data':
			if (!('data_session' in this)) {
				// rollback, 确保已设定 this.data_session。
				this.actions.unshift([ 'set_data' ], next);
				this.next();
				break;
			}

			// wiki.edit_data([id, ]data[, options, callback])

			if (typeof next[1] === 'function'
			//
			|| library_namespace.is_Object(next[1])
					&& !wiki_API.is_entity(next[1])) {
				library_namespace.debug('未设定/不设定 id，第一个 next[1] 即为 data。', 6,
						'wiki_API.next.edit_data');
				// next = [ 'edit_data', data[, options, callback] ]
				if (library_namespace.is_Object(next[2]) && next[2]['new']) {
					// create item/property
					next.splice(1, 0, null);

				} else {
					// 自动填补 id。
					// 直接输入 callback。
					if (typeof next[2] === 'function' && !next[3]) {
						// 未输入 options，但输入 callback。
						next.splice(2, 0, null);
					}

					// next = [ 'edit_data', data, options[, callback] ]

					if (false) {
						// TypeError: Converting circular structure to JSON
						library_namespace.debug('this.last_data: '
								+ JSON.stringify(this.last_data), 6,
								'wiki_API.next.edit_data');
						library_namespace.debug('this.last_page: '
								+ JSON.stringify(this.last_page), 6,
								'wiki_API.next.edit_data');
					}
					if (last_data_is_usable(this)) {
						// shift arguments
						next.splice(1, 0, this.last_data);

					} else if (this.last_data && this.last_data.error
					// @see last_data_is_usable(session)
					&& this.last_page === this.last_data[KEY_CORRESPOND_PAGE]) {
						library_namespace.debug('前一次之wikidata实体取得失败', 6,
								'wiki_API.next.edit_data');
						// next[3] : callback
						this.next(next[3], undefined, {
							code : 'last_data_failed',
							message : '前一次之wikidata实体取得失败: ['
							// 例如提供的 foreign title 错误，
							+ (this.last_data[KEY_CORRESPOND_PAGE]
							// 或是 foreign title 为 redirected。
							|| (this.last_data.site
							// 抑或者存在 foreign title 页面，但没有 wikidata entity。
							+ ':' + this.last_data.title)) + ']'
						});
						break;

					} else if (this.last_page) {
						library_namespace.debug('自 .last_page '
								+ wiki_API.title_link_of(this.last_page)
								+ ' 取得特定实体。', 6, 'wiki_API.next.edit_data');
						// e.g., edit_data({Function}data)
						next.splice(1, 0, this.last_page);

					} else {
						// next[3] : callback
						this.next(next[3], undefined, {
							code : 'no_id',
							message : 'Did not set id! 未设定欲取得之特定实体 id。'
						});
						break;
					}
				}
			}

			// needless: 会从 get_data_API_URL(options) 取得 API_URL。
			if (false && !Array.isArray(next[1])) {
				// get_data_API_URL(this)
				next[1] = [ this.data_session.API_URL, next[1] ];
			}

			// next = [ 'edit_data', id, data[, options, callback] ]

			if (typeof next[3] === 'function' && !next[4]) {
				// 未输入 options，但输入 callback。
				next.splice(3, 0, null);
			}

			// 因为前面利用cache时会检查KEY_CORRESPOND_PAGE，且KEY_CORRESPOND_PAGE只会设定在page_data，
			// / / 因此这边自属于page_data之输入项目设定 .last_page
			if (wiki_API.is_page_data(next[1])
			// 预防把 wikidata entity 拿来当作 input 了。
			&& !wiki_API.is_entity(next[1])) {
				this.last_page = next[1];
			}
			// wikidata_edit(id, data, token, options, callback)
			wiki_API.edit_data(next[1], next[2], this.data_session.token,
			// next[3] : options
			add_session_to_options(this.data_session, next[3]),
			// callback
			function(data, error) {
				if (false && data && !wiki_API.is_entity(data)) {
					console.trace(data);
					throw 'data is NOT entity';
				}
				_this.last_data = data || {
					// 有发生错误:设定 error log Object。
					last_data : _this.last_data,
					key : next[1],
					error : error
				};
				// next[4] : callback
				_this.next(next[4], data, error);
			});
			break;

		case 'merge_data':
			if (!('data_session' in this)) {
				// rollback, 确保已设定 this.data_session。
				this.actions.unshift([ 'set_data' ], next);
				this.next();
				break;
			}

			// next = [ 'merge_data', to, from[, options, callback] ]
			if (typeof next[3] === 'function' && !next[4]) {
				// 未输入 options，但输入 callback。
				next.splice(3, 0, null);
			}

			// next = [ 'merge_data', to, from, options[, callback] ]
			// wikidata_merge(to, from, token, options, callback)
			wiki_API.merge_data(next[1], next[2], this.data_session.token,
			// next[3] : options
			add_session_to_options(this.data_session, next[3]),
			// next[4] : callback
			function(data, error) {
				// 此 wbmergeitems 之回传 data 不包含 item 资讯。
				// next[4] : callback
				_this.next(next[4], data, error);
			});
			break;

		case 'query_data':
			// wdq, query data
			// wikidata_query(query, callback, options)
			wiki_API.wdq(next[1], function(data) {
				_this.last_list = Array.isArray(data) ? data : null;
				// next[2] : callback
				_this.next(next[2], data);
			}, next[3]);
			break;

		// ------------------------------------------------
		// [[commons:Commons:Structured data]]
		// 共享资源后端使用维基库（Wikibase），与维基数据（Wikidate）使用的技术相同。

		case 'structured_data':
			// session.structured_data('File:media_file_name', (entity, error)
			// => {});
			// session.structured_data('File:media_file_name', property,
			// (entity, error) => {}, options);

			if (typeof next[1] === 'function') {
				library_namespace.debug('直接取得 last_page 之 data: ' + next[1], 3,
						'wiki_API.prototype.next.structured_data');
				if (!wiki_API.is_page_data(this.last_page)) {
					this.next(next[1], undefined, {
						code : 'no_id',
						message : 'Did not set id! 未设定欲取得之特定实体 id。'
					});
					break;
				}
				next.splice(1, 0, this.last_page);
			}

			if (!is_api_and_title(next[1]) && !get_wikibase_key(next[1])) {
				// e.g., wiki_API.is_page_data(next[1]) ||
				// is_api_and_title(next[1]) || get_wikibase_key(next[1])
				next[1] = [ wiki_API.site_name(this), next[1] ];
			}

			if (next[1][get_wikibase_key(next[1]) ? 'site' : 0] !== 'commonswiki') {
				library_namespace
						.warn('wiki_API.prototype.next.structured_data: Should only using on commonswiki!');
			}
			if (!this.is_namespace(next[1][get_wikibase_key(next[1]) ? 'title'
					: 1], 'File')) {
				library_namespace
						.warn('wiki_API.prototype.next.structured_data: Should only using on files! ('
								+ next[1][get_wikibase_key(next[1]) ? 'title'
										: 1] + ')');
			}

			if (typeof next[2] === 'function') {
				// 未设定/不设定 property
				// shift arguments
				next.splice(2, 0, null);
			}

			if (wiki_API.is_entity(next[1][1])
					&& wiki_API.is_page_data(next[1][1])) {
				library_namespace.debug('直接将 next[1] 输入 callback: '
						+ next[1][1], 1,
						'wiki_API.prototype.next.edit_structured_data');
				this.last_page = next[1][1];
				// next[3] : callback
				this.next(next[3], this.last_page);
				break;
			}

			if (wiki_API.is_page_data(next[1][1])) {
				next[1][1] = wiki_API.title_of(next[1][1]);
			}

			if (wiki_API.is_entity(this.last_page)
					&& next[1][1] === this.last_page.title) {
				// next[3] : callback
				this.next(next[3], this.last_page);
				break;
			}

			// next[4] : options
			next[4] = add_session_to_options(this, next[4]);
			next[4].data_API_URL = this.API_URL;

			// delete _this.last_page;
			// console.trace(this.actions.length, next);
			// wikidata_entity(key, property, callback, options)
			wiki_API.data(next[1], next[2], function(data, error) {
				// console.trace([ data, error ]);
				if (data) {
					// e.g.,
					// {pageid:,ns:,title:,type:'mediainfo',id:'M000',labels:{},descriptions:{},statements:{}}
					// {id:'M123456',missing:''}
					if (wiki_API.is_page_data(next[1][1])) {
						_this.last_page = Object.assign(
						//
						wiki_API.is_page_data(next[1][1]), data);
						_this.last_page[KEY_CORRESPOND_PAGE]
						//
						= data[KEY_CORRESPOND_PAGE];
					} else {
						_this.last_page = data;
					}
				} else {
					_this.last_page = {
						title : wiki_API.title_of(next[1][1]),
						error : error
					};
				}
				// next[3] : callback
				_this.next(next[3], data, error);
				// console.trace(_this.actions.length, _this.actions);
			},
			// next[4] : options
			next[4]);
			break;

		case 'edit_structured_data':
			// wiki.edit_structured_data(['File:media_file_name', ]data[,
			// options, callback]);
			// wiki.structured_data('File:media_file_name').edit_structured_data(data[,
			// options, callback]);
			// wiki.page('File:media_file_name').edit_structured_data(data[,
			// options, callback]);

			if (typeof next[1] === 'string') {
				// next[1]: title
				next[1] = [ wiki_API.site_name(this), next[1] ];

			} else if (typeof next[1] === 'function'
			//
			|| library_namespace.is_Object(next[1])
					&& !wiki_API.is_entity(next[1])
					&& !get_wikibase_key(next[1])) {
				library_namespace.debug('未设定/不设定 id，第一个 next[1] 即为 data。', 6,
						'wiki_API.next.edit_structured_data');
				// console.trace(next);
				next.splice(1, 0, this.last_page);
			}

			if (wiki_API.is_entity(this.last_page)
					&& next[1]
					&& this.last_page.title === (is_api_and_title(next[1]) ? next[1][1]
							: get_wikibase_key(next[1]) ? get_wikibase_key(next[1]).title
									// wiki_API.is_page_data(next[1])
									: next[1].title)) {
				next[1] = this.last_page;
			} else if (this.last_page.id && ('missing' in this.last_page)
					&& get_wikibase_key(this.last_page)
					&& get_wikibase_key(this.last_page).title === next[1][1]) {
				// 完全还没设定过 structured data 的档案是长这样子:
				// {id:'M123456',missing:''}
				next[1] = this.last_page;
			}

			// next = ['edit_structured_data', id, data[, options, callback]]

			if (typeof next[3] === 'function') {
				// shift arguments
				next.splice(3, 0, null);
			}

			// next = ['edit_structured_data', id, data, options, callback]

			if (false) {
				console.trace(this.actions.length, next, wiki_API
						.is_entity(next[1]));
			}
			if (wiki_API.is_entity(next[1])) {
				library_namespace.debug('沿用原有 entity。', 6,
						'wiki_API.next.edit_structured_data');

			} else if (get_wikibase_key(next[1])
			// 有 [KEY_CORRESPOND_PAGE] 代表已经 .structured_data() 过。
			&& next[1][KEY_CORRESPOND_PAGE]) {
				next[1] = get_wikibase_key(next[1]);

			} else {
				// console.trace(next[1]);
				if (false) {
					console.trace(this.actions.length, next, wiki_API
							.is_page_data(next[1]), is_api_and_title(next[1]),
							get_wikibase_key(next[1]));
				}
				if (wiki_API.is_page_data(next[1]) || is_api_and_title(next[1])) {
					library_namespace.debug('先取得 last_page 之 data: ' + next[1],
							3, 'wiki_API.prototype.next.edit_structured_data');
					this.actions.unshift([ 'structured_data', next[1] ], next);
					// next[1] will be replace by `this.last_page` later.
					this.next();
				} else if (get_wikibase_key(next[1])) {
					// e.g., media 没设定过 structured data。
					// {id:'M000',missing:''}
					this.actions.unshift([ 'structured_data',
							get_wikibase_key(next[1]) ], next);
					// next[1] will be replace by `this.last_page` later.
					this.next();
				} else {
					this.next(next[4], undefined, {
						code : 'no_id',
						message : 'Did not set id! 未设定欲取得之特定实体 id。'
					});
				}
				break;
			}

			// assert: wiki_API.is_entity(next[1])

			// console.trace(next[1]);
			next[1] = Object.clone(next[1]);

			if (!next[1].claims && next[1].statements) {
				next[1].claims = next[1].statements;
				delete next[1].statements;
			}

			// next[3] : options
			next[3] = add_session_to_options(this, next[3]);
			next[3].data_API_URL = this.API_URL;

			// console.trace(next);
			// wikidata_edit(id, data, token, options, callback)
			wiki_API.edit_data(next[1], next[2], this.token,
			// next[3] : options
			next[3],
			// callback
			function(data, error) {
				// console.trace(_this.actions.length, next);
				// next[4] : callback
				_this.next(next[4], data, error);
			});
			break;

		// ------------------------------------------------

		// administrator functions

		case 'move_page':
			if (type === 'move_page') {
				// wiki.move_page(from, to, options, callback)
				// wiki.move_page(from, to, callback)
				if (typeof next[3] === 'function') {
					// shift arguments
					next.splice(3, 0, {
						from : next[1]
					});
				} else {
					next[3] = library_namespace.setup_options(next[3]);
					next[3].from = next[1];
				}
				// remove `from`
				next.splice(1, 1);
				type = 'move_to';
			}

		case 'move_to':
			// wiki_API.move_to(): move a page from `from` to target `to`.

			// wiki.page(from title)
			// .move_to(to, [from title,] options, callback)

			// wiki.move_to(to, from, options, callback)
			// wiki.move_to(to, from, options)
			// wiki.move_to(to, from, callback)
			// wiki.move_to(to, from)

			// wiki.page(from).move_to(to, options, callback)
			// wiki.page(from).move_to(to, options)
			// wiki.page(from).move_to(to, callback)
			// wiki.page(from).move_to(to)

			var move_to_title = null;
			if (type === 'move_to') {
				if (typeof next[1] === 'string') {
					move_to_title = next[1];
					// shift arguments
					next.splice(1, 1);
				}
			}

		case 'remove':
			// wiki.page(title).remove([title,] options, callback)
			if (type === 'remove') {
				// 正名。
				type = 'delete';
			}

		case 'delete':
			// wiki.page(title).delete([title,] options, callback)

		case 'protect':
			// wiki.page(title).protect([title,] options, callback)

		case 'rollback':
			// wiki.page(title).rollback([title,] options, callback)

			// --------------------------------------------

			// 这些控制用的功能，不必须取得页面内容。
			if (typeof next[1] === 'string') {
				// 输入的第一个参数是页面标题。
				// e.g.,
				// wiki.remove(title, options, callback)
				this.last_page = {
					title : next[1]
				};
				// shift arguments
				next.splice(1, 1);
			}

			if (typeof next[1] === 'function') {
				// shift arguments
				// insert as options
				next.splice(1, 0, undefined);
			}
			if (!next[1]) {
				// initialize options
				next[1] = Object.create(null);
			}

			if (type === 'move_to') {
				if (move_to_title) {
					next[1].to = move_to_title;
				}
			}

			// 保护/回退
			if (this.stopped && !next[1].skip_stopped) {
				library_namespace.warn('wiki_API.prototype.next: 已停止作业，放弃 '
				//
				+ type + ' [['
				//
				+ (next[1].title || next[1].pageid || this.last_page
				//
				&& this.last_page.title) + ']]！');
				// next[2] : callback
				this.next(next[2], next[1], '已停止作业');

			} else {
				next[1][KEY_SESSION] = this;
				wiki_API[type](next[1], function(response, error) {
					// next[2] : callback
					_this.next(next[2], response, error);
				});
			}
			break;

		// ------------------------------------------------
		// 流程控制

		case 'wait':
			// rollback
			this.actions.unshift(next);
			break;

		case 'run':
			// session.run(function)
			// session.run(function, argunent_1, argunent_2, ...)
			if (typeof next[1] === 'function') {
				// next[1] : callback
				if (this.run_after_initializing
						&& !next[1].is_initializing_process) {
					library_namespace.debug(
							'It is now initializing. Push function into queue: '
									+ next[1], 1);
					this.run_after_initializing.push(next);
				} else {
					try {
						// pass arguments
						callback_result_relying_on_this = next[1].apply(this,
								next.slice(2));
					} catch (e) {
						// TODO: handle exception
						library_namespace.error(e);
					}
				}
			}
			// 避免偶尔会一直 call this.next()，造成
			// RangeError: Maximum call stack size exceeded
			setTimeout(this.next.bind(this, callback_result_relying_on_this), 0);
			break;

		case 'run_async':
			var is_function = false;
			// next[1] : callback
			if (typeof next[1] === 'function') {
				is_function = true;
				// pass arguments
				next[1] = next[1].apply(this, next.slice(2));
			}

			if (library_namespace.is_thenable(next[1])) {
				var callback = this.next.bind(this);
				next[1].then(callback, callback);
			} else if (is_function) {
				// ** MUST call `this.next();` in the callback function!
			} else {
				this.next();
			}
			break;

		// ------------------------------------------------

		default:
			// Should not go to here!
			library_namespace.error('Unknown operation: [' + next.join() + ']');
			this.next();
			break;
		}

	};

	/**
	 * wiki_API.prototype.next() 已登记之 methods。<br />
	 * 之后会再自动加入 get_list.type 之 methods。<br />
	 * NG: ,login
	 * 
	 * @type {Array}
	 * 
	 * @see function wiki_API_prototype_methods()
	 */
	wiki_API.prototype.next.methods = 'query_API|siteinfo|page|tracking_revisions|parse|redirect_to|purge|check|copy_from|download|edit|upload|cache|listen|category_tree|register_redirects|search|remove|delete|move_page|move_to|protect|rollback|logout|run|run_async|set_URL|set_language|set_data|data|edit_data|merge_data|query_data|structured_data|edit_structured_data|query'
			.split('|');

	// ------------------------------------------------------------------------

	// e.g., " (99%): 0.178 page/ms, 1.5 minutes estimated."
	function estimated_message(processed_amount, total_amount, starting_time,
			pages_processed, unit) {
		/** {Natural}ms */
		var time_elapsed = Date.now() - starting_time;
		// estimated time of completion 估计时间 预计剩下时间 预估剩余时间 预计完成时间还要多久
		var estimated = time_elapsed / processed_amount
				* (total_amount - processed_amount);
		if (estimated > 99 && estimated < 1e15/* Infinity */) {
			estimated = library_namespace.age_of(0, estimated, {
				digits : 1
			});
			estimated = ', ' + estimated + ' estimated';
		} else {
			estimated = '';
		}

		var speed;
		if (pages_processed > 0) {
			if (!unit) {
				// page(s)
				unit = 'page';
			}
			speed = pages_processed / time_elapsed;
			speed = speed < 1 ? (1e3 * speed).toFixed(2) + ' ' + unit + '/s'
					: speed.toFixed(3) + ' ' + unit + '/ms';
			speed = ': ' + speed;
		} else {
			speed = '';
		}

		return (pages_processed > 0 ? pages_processed === total_amount ? processed_amount
				+ '/' + total_amount
				: pages_processed + ' '
				: /* Need add message yourself */'')
				+ ' ('
				+ (100 * processed_amount / total_amount | 0)
				+ '%)'
				+ speed + estimated;
	}

	// --------------------------------------------------------------------------------------------

	// 或者还可以去除 "MediaWiki message delivery" 这些系统预设的非人类发布者。
	/** {RegExp}pattern to test if is a robot name. CeL.wiki.PATTERN_BOT_NAME */
	var PATTERN_BOT_NAME = /bot(?:$|[^a-z])|[机机][器械]人|ボット(?:$|[^a-z])|봇$/i;
	// ↑ /(?:$|[^a-z])/: e.g., PxBot~testwiki, [[ko:User:2147483647 (bot)]],
	// a_bot2, "DynBot Srv2", "Kwjbot II", "Purbo T"
	// TODO: [[User:CommonsDelinker]], BotMultichill, "Flow talk page manager",
	// "Maintenance script", "MediaWiki default", "MediaWiki message delivery"

	/**
	 * default date format for work task. 预设的日期格式 '%4Y%2m%2dT%2H%2M%2S'
	 * 
	 * @type {String}
	 * @see ISO 8601
	 */
	wiki_API.prototype.work_date_format = '%H:%M:%S';
	wiki_API.prototype.work_title_date_format = '%4Y-%2m-%2d %H:%M:%S';

	/**
	 * 规范 log 之格式。(for wiki_API.prototype.work)
	 * 
	 * 若有必要跳过格式化的讯息，应该自行调用 message.push({String}message) 而非
	 * message.add({String}message)。
	 * 
	 * @param {String}message
	 *            message
	 * @param {String}[title]
	 *            message title.
	 * @param {Boolean}[use_ordered_list]
	 *            use ordered list.
	 */
	function add_message(message, title, use_ordered_list) {
		if (typeof message !== 'string') {
			message = message && String(message) || '';
		}
		message = message.trim();
		if (message) {
			if (title) {
				var namespace = wiki_API.namespace(title, this[KEY_SESSION]);
				title = wiki_API.title_link_of(title);
				if (title) {
					if (namespace !== 0) {
						// 对于非条目作特殊处理。
						title = "'''" + title + "'''";
					}
					title += ' ';
				}
			}
			message = (use_ordered_list ? '# ' : '* ') + (title || '')
					+ message;
			this.push(message);
		}
	}

	function reset_messages() {
		// 设定 time stamp。
		this.start = this.last = new Date;
		// clear
		this.clear();
	}

	/**
	 * 输入 URI component list，得出自 [0] 至 [边际index-1] 以 encodeURIComponent()
	 * 串联起来，长度不超过 limit_length。<br />
	 * 
	 * 用于避免 HTTP status 414: Request-URI Too Long
	 * 
	 * @param {Array}piece_list
	 *            URI component list: page id / title / data
	 * @param {Natural}[limit]
	 *            max count
	 * @param {Natural}[limit_length]
	 *            max length in bytes
	 * 
	 * @returns {Number}边际index。
	 * 
	 * @inner
	 */
	function check_max_length(piece_list, limit, limit_length) {
		// 8000: 8192 - (除了 piece_list 外必要之字串长)。
		//
		// 8192: https://httpd.apache.org/docs/current/mod/core.html
		// default LimitRequestLine: 8190
		//
		// assert: 除了 piece_list 外必要之字串长 < 192
		// e.g.,
		// "https://zh.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content|timestamp&titles=...&format=json&utf8=1"
		if (!(limit_length > 0)) {
			// https://github.com/kanasimi/wikibot/issues/32
			// 不同 server 可能有不同 GET 请求长度限制。不如直接改成 POST。
			limit_length = 8000;
		}
		if (false && !(limit > 0)) {
			limit = 5000;
		}

		var length = 0, index = piece_list.length;

		if (false)
			piece_list.slice(0, limit_length / 30).join('|').slice(0,
					limit_length).replace(/[^|]+$/, '');

		if (piece_list.some(function(piece, i) {
			if (!piece || !(piece.pageid >= 0)) {
				length = 1;
				return true;
			}
			// console.log([ piece, length ]);
			length += piece.pageid.toString().length + 3;
			if (i === index || i >= limit || length >= limit_length) {
				// console.log({ i, index, limit, limit_length, length });
				index = i;
				length = 0;
				return true;
			}
		}) && length > 0) {
			library_namespace.debug('Some pieces are not page data.', 1,
					'check_max_length');
			length = 0;
			piece_list.some(function(piece, i) {
				length += encodeURIComponent(piece && piece.title
				// +3 === encodeURIComponent('|').length: separator '|'
				|| piece).length + 3;
				if (i >= limit || length >= limit_length) {
					index = i;
					return true;
				}
			});
		}
		// console.log(piece_list);
		library_namespace.debug('1–' + index + '/' + piece_list.length
				+ ', length ' + length, 2, 'check_max_length');
		if (false && typeof piece_list[2] === 'string')
			library_namespace.log(piece_list.slice(0, index).join('|'));

		return index;
	}

	// https://www.mediawiki.org/w/api.php
	// Use higher limits in API queries (slow queries: 500; fast queries: 5000).

	// @inner
	function max_slice_size(session, config, this_slice) {
		var max_size;
		if (session.slow_query_limit > 0) {
			max_size = session.slow_query_limit;
		} else {
			if (session.login_user_info
					&& Array.isArray(session.login_user_info.rights)) {
				// session.token &&
				// PATTERN_BOT_NAME.test(session.token.login_user_name)
				max_size = session.login_user_info.rights
						.includes('apihighlimits');
			} else {
				// default: max_size = 50;
			}

			var prop = 'query+siteinfo';
			prop = session.API_parameters && session.API_parameters[prop]
			prop = prop && prop.prop;
			// console.trace([max_size, prop]);

			max_size = max_size ? prop && prop.highlimit || 500
			// https://www.mediawiki.org/w/api.php?action=help&modules=query
			// Maximum number of values is 50 (500 for clients allowed higher
			// limits).
			: prop && prop.lowlimit || 50;
		}

		if (config && (config.slice | 0) >= 1) {
			max_size = Math.min(config.slice | 0, max_size);
		}

		// 自动判别最大可用 index，预防 "414 Request-URI Too Long"。
		// 因为 8000/500-3 = 13 > 最长 page id，因此即使 500页也不会超过。
		// 为提高效率，不作 check。
		if (this_slice && (!config || !config.is_id))
			max_size = check_max_length(this_slice, max_size);

		return max_size;
	}

	// unescaped syntaxes in summary
	function summary_to_wikitext(summary) {
		// unescaped_summary
		var wikitext = summary.toString().replace(/</g, '&lt;').replace(
		// 避免 wikitext 添加 Category。
		// 在编辑摘要中加上使用者连结，似乎还不至于惊扰到使用者。因此还不用特别处理。
		// @see PATTERN_category @ CeL.wiki
		/\[\[\s*(Category|分类|分类|カテゴリ|분류)\s*:/ig, '[[:$1:');
		if (false) {
			// 在 [[t|{{t}}]] 时无效，改采 .replace(/{{/g,)。
			wikitext = wikitext.replace(
			// replace template
			/{{([a-z\d]+)/ig, function(all, name) {
				if (/^tl\w$/i.test(name))
					return all;
				return '{{tlx|' + name;
			});
		}
		wikitext = wikitext.replace(/{{/g, '&#123;&#123;');
		return wikitext;
	}

	// wiki_API.prototype.work(config, page_list): configuration:
	({
		// 注意: 与 wiki_API.prototype.work(config)
		// 之 config.before/config.after 连动。
		before : function before(messages, pages) {
		},
		// {Function|Array} 每个 page 执行一次。
		each : function each(page_data, messages) {
			return 'text to replace';
		},
		// 注意: 与 wiki_API.prototype.work(config)
		// 之 config.before/config.after 连动。
		after : function after(messages, pages) {
		},
		// run this at last. 在 wiki_API.prototype.work() 工作最后执行此 config.last()。
		last : function last(error) {
			// this: options
		},
		// 不作编辑作业。
		no_edit : true,
		// 设定写入目标。一般为 debug、test 测试期间用。
		write_to : '',
		/** {String}运作记录存放页面。 */
		log_to : 'User:Robot/log/%4Y%2m%2d',
		// 「新条目、修饰语句、修正笔误、内容扩充、排版、内部链接、分类、消歧义、维基化」
		/** {String}编辑摘要。总结报告。编辑理由。 edit reason. */
		summary : ''
	});

	/**
	 * robot 作业操作之辅助套装函数。此函数可一次取得50至300个页面内容再批次处理。<br />
	 * 不会推入 this.actions queue，即时执行。因此需要先 get list！
	 * 
	 * 注意: arguments 与 get_list() 之 callback 连动。
	 * 
	 * @param {Object}config
	 *            configuration. { page_options: { prop: 'revisions', rvprop:
	 *            'ids|timestamp|user' } }
	 * @param {Array}pages
	 *            page data list
	 */
	wiki_API.prototype.work = function do_batch_work(config, pages) {
		// console.log(JSON.stringify(pages));
		if (typeof config === 'function')
			config = {
				each : config
			};
		if (!config || !config.each) {
			library_namespace.warn('wiki_API.work: Bad callback!');
			return;
		}
		if (!('no_edit' in config)) {
			// default: 未设定 summary 则不编辑页面。
			config.no_edit = !config.summary;
		} else if (!config.no_edit && !config.summary) {
			library_namespace
					.warn('wiki_API.work: Did not set config.summary when edit page (config.no_edit='
							+ config.no_edit + ')!');
		}

		if (!pages)
			pages = this.last_pages;
		// config.run_empty: 即使无页面/未取得页面，依旧强制执行下去。
		if (!pages && !config.run_empty) {
			// 采用推入前一个 this.actions queue 的方法，
			// 在 multithreading 下可能因其他 threading 插入而造成问题，须注意！
			library_namespace
					.warn('wiki_API.work: No list. Please get list first!');
			return;
		}

		library_namespace.debug('wiki_API.work: 开始执行作业: 先作环境建构与初始设定。');
		if (config.summary) {
			// '开始处理 ' + config.summary + ' 作业'
			library_namespace.sinfo([ 'wiki_API.work: Start the operation [',
					'fg=yellow', String(config.summary), '-fg', ']' ]);
		}

		/**
		 * <code>
		 * default handler [ text replace function(title, content), {Object}options, callback(title, error, result) ]
		 * </code>
		 */
		var each,
		// options 在此暂时作为 default options。
		options = config.options || {
			// 预设会取得大量页面。 multiple pages
			multi : true,
			// prevent creating new pages
			// Throw an error if the page doesn't exist. 若页面不存在/已删除，则产生错误。
			// 要取消这项，须注意在重定向页之对话页操作之可能。
			nocreate : 1,
			// 该编辑是一个小修订 (minor edit)。
			minor : 1,
			// denotes this is a bot edit. 标记此编辑为机器人编辑。
			// [[WP:AL|机器人对其他使用者对话页的小修改将不会触发新讯息提示]]。
			bot : 1,
			// [[Special:tags]]
			// 指定不存在的标签，可能会造成 [tags-apply-not-allowed-one]
			// The tag "..." is not allowed to be manually applied.
			// tags : 'bot|test|bot trial',
			tags : '',
			// 设定写入目标。一般为 debug、test 测试期间用。
			write_to : '',
			// Allow content to be emptied. 允许内容被清空。白纸化。
			allow_empty : false,
			// 采用 skip_nochange 可以跳过实际 edit 的动作。
			// 对于大部分不会改变页面的作业，能大幅加快速度。
			skip_nochange : true,
			// For `{{bots|optout=n1,n2}}`
			notification_name : ''
		}, callback,
		/** {ℕ⁰:Natural+0}全无变更页面数。 */
		nochange_count = 0;

		if (library_namespace.is_Set(pages)) {
			pages = Array.from(pages);
		}

		if (Array.isArray(pages) && pages.length === 0) {
			if (!config.no_warning) {
				library_namespace.info('wiki_API.work: 列表中没有项目，快速完结。');
			}
			if (typeof config.last === 'function') {
				this.run(config.last.bind(options));
			}
			return;
		}

		if (typeof config.each === 'function') {
			// {Function}
			each = [ config.each ];
		} else if (Array.isArray(config.each)) {
			// assert: config.each = [ function for_each_page,
			// append to this / assign to this @ each(), callback ]
			each = config.each;
		} else {
			throw new Error('wiki_API.work: Invalid function for each page!');
		}

		if (!config.options) {
			// 直接将 config 的设定导入 options。
			// e.g., write_to
			for (callback in options) {
				if (callback in config) {
					// 主要是 edit 用的 options。
					if (!config[callback] && (callback in {
						nocreate : 1,
						minor : 1,
						bot : 1,
						tags : 1
					})) {
						// 即使设定 minor=0 似乎也会当作设定了，得完全消灭才行。
						delete options[callback];
					} else {
						options[callback] = config[callback];
					}
				}
			}
		}
		// console.trace([ config, options ]);

		if (each[1]) {
			// library_namespace.info('wiki_API.work: Set append_to_this:');
			// console.trace(each[1]);
			Object.assign(config.no_edit ? config : options, each[1]);
		}
		callback = config.summary;
		// 采用 {{tlx|template_name}} 时，[[Special:RecentChanges]]页面无法自动解析成 link。
		options.summary = callback
		// 是为 Robot 运作。
		? PATTERN_BOT_NAME.test(callback) ? callback
		// Robot: 若用户名包含 'bot'，则直接引用之。
		: (this.token.login_user_name && this.token.login_user_name.length < 9
				&& PATTERN_BOT_NAME.test(this.token.login_user_name)
		//
		? this.token.login_user_name : 'Robot')
				+ ': ' + callback
		// 未设置时，一样添附 Robot。
		: 'Robot';

		// assert: 因为要作排程，为预防冲突与不稳定的操作结果，自此以后不再 modify options。

		var done = 0, session = this, error_to_return,
		//
		log_item = Object.assign(Object.create(null),
				wiki_API.prototype.work.log_item, config.log_item), messages = [];
		messages[KEY_SESSION] = this;
		/** config.no_message: {Boolean}console 不显示讯息，也不处理 {Array}messages。 */
		messages.add = config.no_message ? library_namespace.null_function
				: add_message;
		// config.no_message: no_log
		messages.reset = config.no_message ? library_namespace.null_function
				: reset_messages;
		messages.reset();

		callback = each[2];
		// each 现在转作为对每一页面执行之工作。
		each = each[0];
		if (!callback) {
			// TODO: [[ja:Special:Diff/62546431|有时最后一笔记录可能会漏失掉]]
			callback = config.no_message ? library_namespace.null_function
			// default logger.
			: function do_batch_work_summary(title, error, result) {
				if (false)
					console.trace([ done, nochange_count,
							title && title.title || title ]);
				if (error) {
					// ((return [ CeL.wiki.edit.cancel, 'skip' ];))
					// 来跳过 (skip) 本次编辑动作，不特别显示或处理。
					// 被 skip/pass 的话，连警告都不显现，当作正常状况。
					if (error === 'skip') {
						done++;
						nochange_count++;
						return;
					}

					if (error === 'nochange') {
						done++;
						// 未经过 wiki 操作，于 wiki_API.edit 发现为[[WP:NULLEDIT|无改变]]的。
						// 无更动 没有变更 No modification made
						nochange_count++;
						// gettext_config:{"id":"no-change"}
						error = gettext('no change');
						result = 'nochange';
					} else {
						// console.trace([ error_to_return, error ]);
						error_to_return = error_to_return || error;
						// 有错误发生。
						// e.g., [protectedpage]
						// The "editprotected" right is required to edit this
						// page
						if (config.onerror)
							config.onerror(error);
						result = [ 'error', error ];
						// gettext_config:{"id":"finished-$1"}
						error = gettext('finished: %1',
						// {{font color}}
						'<span style="color:red; background-color:#ff0;">'
								+ error + '</span>');
					}

				} else if (!result || !result.edit) {
					// 有时 result 可能会是 ""，或者无 result.edit。这通常代表 token lost。
					library_namespace.error('wiki_API.work: 无 result.edit'
							+ (result && result.edit ? '.newrevid' : '')
							+ '！可能是 token lost！');
					if (false) {
						console.trace(Array.isArray(title) && title[1]
								&& title[1].title ? title[1].title : title);
					}
					error = 'no "result.edit'
							+ (result && result.edit ? '.newrevid".' : '.');
					result = [ 'error', 'token lost?' ];

				} else {
					// 成功完成。
					done++;
					if (result.edit.newrevid) {
						// https://en.wikipedia.org/wiki/Help:Wiki_markup#Linking_to_old_revisions_of_pages.2C_diffs.2C_and_specific_history_pages
						// https://zh.wikipedia.org/?diff=000
						// cf. [[Special:Permalink/0|title]],
						// [[Special:Diff/prev/0]]
						error = ' [[Special:Diff/' + result.edit.newrevid + '|'
						// may use wiki_API.title_link_of()
						// gettext_config:{"id":"finished"}
						+ gettext('finished') + ']]';
						result = 'succeed';
					} else if ('nochange' in result.edit) {
						// 经过 wiki 操作，发现为[[WP:NULLEDIT|无改变]]的。
						nochange_count++;
						// gettext_config:{"id":"no-change"}
						error = gettext('no change');
						result = 'nochange';
					} else {
						// 有时无 result.edit.newrevid。
						library_namespace.error('无 result.edit.newrevid');
						// gettext_config:{"id":"finished"}
						error = gettext('finished');
						result = 'succeed';
					}
				}

				// error: message, result: result type.

				if (log_item[Array.isArray(result)
				// {Array}result = [ main error code, sub ]
				? result.join('_') in log_item ? result.join('_') : result[0]
						: result]) {
					// gettext_config:{"id":"$1-elapsed-$3-at-$2"}
					error = gettext('%1 elapsed, %3 at %2',
					// 纪录使用时间, 历时, 费时, elapsed time
					messages.last.age(new Date), (messages.last = new Date)
					//
					.format({
						zone : session.configurations.timeoffset / 60,
						// config.work_date_format || this.work_date_format
						format : config.work_date_format
								|| session.work_date_format
					}), error);

					// 对各个条目的纪录加入计数。
					messages.add(error, title, true);
				}
			};
		}

		if (Array.isArray(pages) && pages.slice(0, 10).every(function(item) {
			return typeof item === 'string';
		})) {
			// 传入标题列表。
			messages.input_title_list = true;
		}

		if (false && Array.isArray(pages) && !titles) {
			library_namespace.warn('wiki_API.work: rebuild titles.');
			titles = pages.map(function(page) {
				return page.title;
			});
		}

		var session = this;
		var maybe_nested_thread = // config.is_async_each ||
		session.running && session.actions.length === 0;
		if (false) {
			console.trace([ maybe_nested_thread, session.running,
					session.actions.length ]);
			console.log(each + '');
			// console.log(session.actions);
		}
		var main_work = function(data, error) {
			if (error) {
				library_namespace.error('wiki_API.work: Get error: '
						+ (error.info || error));
				// console.log(error);
				data = [];
			} else if (!Array.isArray(data)) {
				if (!data && this_slice_size === 0) {
					library_namespace.info('wiki_API.work: ' + config.summary
					// 任务/工作
					+ ': 未取得或设定任何页面。这个部份的任务已完成？');
					data = [];
				} else if (data) {
					// 可能是 page data 或 title。
					data = [ data ];
				} else {
					library_namespace
							.error('wiki_API.work: No valid data got!');
					data = [];
				}
			}

			// 传入标题列表，则由程式自行控制，毋须设定后续检索用索引值。
			if (!messages.input_title_list
			// 后续检索用索引值存储所在的 options.next_mark，将会以此值写入 log。
			&& (pages = config.next_mark)
			// pages: 后续检索用索引值之暂存值。
			&& (pages = JSON.stringify(pages))) {
				// 当有 .next_mark 时，其实用不到 log page 之 continue_key。
				if (!session
				// 忽略表示完结的纪录，避免每个工作阶段都显示相同讯息。
				|| pages !== '{}'
				// e.g., 后続の索引: {"continue":"-||"}
				&& !/^{"[^"]+":"[\-|]{0,9}"}$/.test(pages)) {
					// console.log(config);
					// console.log(options);
					// console.log(session.continue_key + ':' +
					// JSON.stringify(pages));
					messages.add(session.continue_key + ': ' + pages);
				}
			}

			if (!config.no_message) {
				// 使用时间, 历时, 费时, elapsed time
				pages = gettext(
				// gettext_config:{"id":"first-it-takes-$1-to-get-$2-pages"}
				'First, it takes %1 to get %2 {{PLURAL:%2|page|pages}}.',
						messages.last.age(new Date), data.length);
				// 在「首先使用」之后才设定 .last，才能正确抓到「首先使用」。
				messages.last = new Date;
				if (log_item.get_pages) {
					messages.add(pages);
				}
				library_namespace.debug(pages, 2, 'wiki_API.work');
				if (library_namespace.is_debug()
				// .show_value() @ interact.DOM, application.debug
				&& library_namespace.show_value)
					library_namespace.show_value(data, 'pages');
			}

			pages = data;

			// run before every batch task. 在处理每个批次前执行此function。
			// 注意: 一次取得大量页面时，回传内容不一定会按照原先输入的次序排列！
			// 若有必要，此时得用 config.before() 自行处理！
			if (typeof config.before === 'function') {
				// titles 可能为 undefined！
				// 注意: 与 wiki_API.prototype.work(config)
				// 之 config.before/config.after 连动。
				//
				// 2016/6/22 change API 应用程式介面变更:
				// .first(messages, titles, pages) → .before(messages, pages,
				// titles)
				// 2019/8/7 change API 应用程式介面变更:
				// .before(messages, pages, titles) → .before(messages, pages)
				// 按照需求程度编排 arguments，并改变适合之函数名。
				config.before.call(session, messages, pages);
			}

			/**
			 * 处理回传超过 limit (12 MB)，被截断之情形。
			 */
			if ('OK_length' in pages) {
				if (setup_target) {
					// -pages.length: 先回溯到 pages 开头之 index。
					work_continue -= pages.length - pages.OK_length;
				} else {
					library_namespace.error('wiki_API.work: 回传内容超过限度而被截断！仅取得 '
							+ pages.length + '/' + this_slice_size + ' 个页面');
				}

				library_namespace.debug('一次取得大量页面时，回传内容超过限度而被截断。将回退 '
						+ (pages.length - pages.OK_length)
						+ '页'
						+ (pages[pages.OK_length] ? '，下次将自 '
								+ pages.OK_length
								+ '/'
								+ pages.length
								+ ' '
								+ wiki_API
										.title_link_of(pages[pages.OK_length])
								+ ' id ' + pages[pages.OK_length].pageid
								+ ' 开始' : '') + '。', 1, 'wiki_API.work');
				pages = pages.slice(0, pages.OK_length);

			} else if (!config.no_warning && pages.length !== this_slice_size) {
				// assert: data.length < this_slice_size
				library_namespace.warn('wiki_API.work: 取得 ' + pages.length
						+ '/' + this_slice_size + ' 个页面，应有 '
						+ (this_slice_size - pages.length) + ' 个不存在或重复页面。');
			}

			// --------------------------------------------

			var page_index = 0;
			// for each page: 主要机制是一页页处理。
			function process_next_task_page() {
				if (false)
					console.trace('process_next_task_page: ' + page_index + '/'
							+ pages.length);
				if (messages.quit_operation) {
					// 警告: 直接清空 .actions 不安全！
					// session.actions.clear();
					work_continue = target.length;
					page_index = pages.length;
				}
				if (!(page_index < pages.length)) {
					if (false) {
						console.trace(
						// gettext_config:{"id":"processed-$1-pages"}
						gettext('Processed %1 {{PLURAL:%1|page|pages}}.',
								pages.length));
					}
					// setTimeout(): 跳出exit
					// callback。避免在callback中呼叫session.next()的问题。
					setTimeout(function() {
						session.run(finish_up);
					}, 0);
					return;
				}

				// ------------------------------

				var page = pages[page_index++];
				if (library_namespace.is_debug(2)
				// .show_value() @ interact.DOM, application.debug
				&& library_namespace.show_value)
					library_namespace.show_value(page, 'page');
				if (!page) {
					// nochange_count++;
					// Skip invalid page. 预防如 .work(['']) 的情况。
					process_next_task_page();
					return;
				}

				function work_page_callback(page_data, error) {
					// TODO: if (error) {...}
					// console.trace([ error_to_return, error ]);
					// console.log([ page_data, config.page_options ]);
					library_namespace.log_temporary(page_index + '/'
							+ pages.length + ' ('
							+ (100 * page_index / pages.length).to_fixed(1)
							+ '%) ' + wiki_API.title_link_of(page_data));

					function handle_page_error(error) {
						// console.trace([ error_to_return, error ]);
						error_to_return = error_to_return || error;
						if (typeof error === 'object') {
							console.error(error);
						} else {
							library_namespace.error([ 'wiki_API.work: ', {
								T : [
								// gettext_config:{"id":"page-handling-function-error-$1"}
								'Page handling function error: %1',
								//
								String(error) ]
							} ]);
						}
					}

					var result;
					try {
						result = each.call(config, page_data, messages, config);
					} catch (error) {
						handle_page_error(error);
					}

					if (library_namespace.is_thenable(result)) {
						result = result.then(function() {
							session.run(process_next_task_page);
						}, function(error) {
							// console.trace([ result, error ]);
							handle_page_error(error);
							session.run(process_next_task_page);
						});
					} else {
						// console.trace('session.run(process_next_task_page)
						// ');
						setTimeout(function() {
							session.run(process_next_task_page);
						}, 0);
					}
					return result;
				}

				// clone() 是为了能个别改变 summary。以及其他会利用 work_options 的操作。
				// 例如: each() { options.summary += " -- ..."; }
				var work_options =
				// 采用 single_page_options 以利用 options，
				// 避免 session.page().edit() 被插断。
				Object.clone(single_page_options);

				// console.trace([ page ]);
				// console.trace('session.running = ' + session.running);
				// 设定页面内容。
				session.page(page, config.no_edit && work_page_callback,
						work_options);

				if (config.no_edit) {
					// 不作编辑作业。
					return;
				}

				Object.assign(work_options, options, {
					// 预防 page 本身是非法的页面标题。当 session.page() 出错时，将导致没有 .last_page。
					page_to_edit : page
				});
				// console.trace(page.title||page);
				// console.trace(work_options);
				// 编辑页面内容。
				session.edit(function(page_data) {
					if (('missing' in page_data)
					//
					|| ('invalid' in page_data)) {
						// return [ wiki_API.edit.cancel, 'skip' ];
					}

					// console.trace([ page, page_data, work_options ]);
					// edit/process
					if (!config.no_message) {
						var _messages = [ 'wiki_API.work: '
						// gettext_config:{"id":"edit-$1"}
						+ gettext('Edit %1', page_index + '/' + pages.length)
								+ ' ' ];
						if ('missing' in page_data) {
							_messages.push('fg=yellow',
							// gettext_config:{"id":"missing-page"}
							'Missing page');
						} else if ('invalid' in page_data) {
							_messages.push('fg=yellow',
							// gettext_config:{"id":"invalid-page-title"}
							'Invalid page title');
						} else {
							_messages.push('', '[[', 'fg=yellow',
							//
							page_data.title, '-fg', ']]');
						}
						library_namespace.sinfo(_messages);
					} else {
						library_namespace.log_temporary(page_index + '/'
								+ pages.length + ' ('
								+ (100 * page_index / pages.length).to_fixed(1)
								+ '%) ' + wiki_API.title_link_of(page_data));
					}

					function handle_edit_error(error) {
						// console.trace([ error_to_return, error ]);
						// console.log([ 'session.running = ' +
						// session.running,
						// session.actions.length ]);
						// `error_to_return` will record the first error.

						error_to_return = error_to_return || error;
						if (typeof error === 'object') {
							console.error(error);
						} else {
							library_namespace.error([ 'wiki_API.work: ', {
								T : [
								// gettext_config:{"id":"page-edit-function-error-$1"}
								'Page edit function error: %1', String(error) ]
							} ]);
						}
					}

					// 以 each() 的回传作为要改变成什么内容。
					var content;
					try {
						content = each.call(
						// 注意: this === work_options
						// 注意: this !== work_config === `config`
						// @see wiki_API.edit()
						this, page_data, messages, config);

						// check_result_and_process_next(content);
						if (library_namespace.is_thenable(content)) {
							return content.then(function(content) {
								return content;
							}, handle_edit_error);
						}
					} catch (error) {
						handle_edit_error(error);
						// return [wiki_API.edit.cancel, 'skip'];
					}

					// console.trace(content);
					return content;

				}, work_options, function work_edit_callback(title, error,
						result) {
					// Do not set `error_to_return` here: `error` maybe 'skip'.
					// console.trace([ error_to_return, error ]);

					// console.trace(arguments);
					// nomally call do_batch_work_summary()
					callback.apply(session, arguments);
					session.run(process_next_task_page);
				});

			}

			process_next_task_page();

			// 不应用 .run(finish_up)，而应在 callback 中呼叫 finish_up()。
			function finish_up() {
				if (false) {
					console.trace(
					// gettext_config:{"id":"$1-pages-processed"}
					gettext('%1 {{PLURAL:%2|page|pages}} processed',
							pages.length, pages.length));
					console.log(pages[0].title);
				}
				if (!config.no_message) {
					library_namespace.debug('收尾。', 1, 'wiki_API.work');
					var count_summary;

					// pages: this_slice, this piece
					if (config.no_edit) {
						if (pages.length === initial_target_length) {
							// 一次取得所有页面。
							count_summary = '';
						} else
							count_summary = pages.length + '/';
					} else if (pages.length === initial_target_length) {
						if (done === pages.length) {
							// 一次取得所有页面。
							count_summary = '';
						} else
							count_summary = done + '/';
					} else {
						if (done === pages.length)
							count_summary = done + '//';
						else
							count_summary = done + '/' + pages.length + '//';
					}

					if (work_continue && work_continue < initial_target_length) {
						count_summary += ' '
						// 纪录整体作业进度 overall progress。
						+ work_continue + '/' + initial_target_length + ' ('
						//
						+ (100 * work_continue / initial_target_length | 0)
								+ '%)';
						// do NOT use:
						// gettext_config:{"id":"the-bot-operation-is-completed-$1$-in-total"}
						false && gettext('本次机械人作业已完成%1%', '...%');

					} else {
						count_summary += initial_target_length;
					}

					count_summary = new gettext.Sentence_combination([
					// gettext_config:{"id":"$1-pages-processed"}
					'%1 {{PLURAL:%2|page|pages}} processed'
					//
					+ (log_item.report ? ',' : ''),
					//
					count_summary, pages.length ]);
					// console.trace(count_summary);

					// TODO: auto add section title @ summary

					if (log_item.report) {
						if (nochange_count > 0) {
							count_summary.push(done === nochange_count
							// 未改变任何条目。 No pages have been changed
							// gettext_config:{"id":"no-page-modified"}
							? 'No page modified' + ',' : [
							// gettext_config:{"id":"$1-pages-have-not-changed"}
							'%1 {{PLURAL:%1|page|pages}} have not changed,',
									nochange_count ]);
						}
						// 使用时间, 历时, 前后总共费时, elapsed time
						// gettext_config:{"id":"$1-elapsed"}
						count_summary.push([ '%1 elapsed.',
								messages.start.age(new Date) ]);
						messages.unshift(count_summary.toString());
						count_summary.truncate(1);
					}
					count_summary = count_summary.toString()
					// 手动剪掉非完结的标点符号。
					.replace(/[,，、]$/, '');
					if (session.stopped) {
						messages
						// gettext_config:{"id":"stopped-give-up-editing"}
						.add(gettext("'''Stopped''', give up editing."));
					}
					if (done === nochange_count && !config.no_edit) {
						// gettext_config:{"id":"no-changes"}
						messages.add(gettext('No changes.'));
					}
					if (log_item.title && config.summary) {
						messages.unshift(summary_to_wikitext(config.summary),
								'');
					}
				}

				// run after every batch task. 在处理每个批次后执行此function。
				if (typeof config.after === 'function') {
					// 对于量过大而被分割者，每次分段结束都将执行一次 config.after()。
					// 注意: 与 wiki_API.prototype.work(config)
					// 之 config.before/config.after 连动。
					//
					// 2016/6/22 change API 应用程式介面变更:
					// .last(messages, titles, pages) → .after(messages, pages,
					// titles)
					// 2019/8/7 change API 应用程式介面变更:
					// .after(messages, pages, titles) → .after(messages, pages)
					// 按照需求程度编排 arguments，并改变适合之函数名。
					config.after.call(session, messages, pages);
				}

				var log_to = 'log_to' in config ? config.log_to
				// default log_to
				: session.token.login_user_name ? 'User:'
						+ session.token.login_user_name + '/log/'
						+ (new Date).format('%4Y%2m%2d') : null,
				// e.g., 480 : UTC+8
				timezone = session.configurations.timeoffset / 60,
				// options for summary.
				log_options = {
					// new section. append 章节/段落 after all, at bottom.
					section : 'new',
					// 新章节的标题。章节标题尽量使用可被引用的格式。
					sectiontitle : (new Date).format({
						zone : timezone,
						format : config.work_title_date_format
						//
						|| session.work_title_date_format
					}) + ' UTC' + (timezone < 0 ? '' : '+') + timezone + ': '
					//
					+ count_summary + (config.log_section_title_postfix
					//
					? ' ' + config.log_section_title_postfix : ''),
					// Robot: 若用户名包含 'bot'，则直接引用之。
					// 注意: session.token.login_user_name 可能为 undefined！
					summary : (session.token.login_user_name
							&& PATTERN_BOT_NAME
									.test(session.token.login_user_name) ? session.token.login_user_name
							: 'Robot')
							+ ': '
							+ config.summary
							+ (/[\s.。]$/.test(config.summary) ? '' : ' ')
							+ count_summary,
					// prevent creating new pages
					// Throw an error if the page doesn't exist.
					// 若页面不存在/已删除，则产生错误。
					nocreate : 1,
					// denotes this is a bot edit. 标记此编辑为机器人编辑。
					bot : 1,
					// 就算设定停止编辑作业，仍强制编辑。一般仅针对测试页面或自己的页面，例如写入 log。
					skip_stopped : true
				};

				if (config.no_message) {
					;
				} else if (log_to && messages.join('\n')
				//
				&& (done !== nochange_count
				// 若全无变更，则预设仅从 console 提示，不写入 log 页面。因此无变更者将不显示。
				|| config.log_nochange)) {
					// console.trace(log_to);
					// CeL.set_debug(6);
					log_options.page_to_edit = wiki_API.VALUE_set_page_to_edit;
					session.page(log_to, log_options)
					// 将 robot 运作记录、log summary 报告结果写入 log 页面。
					// TODO: 以表格呈现。
					.edit(messages.join('\n'), log_options,
					// wiki_API.work() 添加网页报告。
					function(title, error, result) {
						if (error) {
							library_namespace.warn('wiki_API.work: '
							//
							+ 'Cannot write log to '
							//
							+ wiki_API.title_link_of(log_to)
							//
							+ '! Try to write to '
							//
							+ wiki_API.title_link_of('User:'
							//
							+ session.token.login_user_name));
							library_namespace.log('\nlog:<br />\n'
							//
							+ messages.join('<br />\n'));
							// console.trace([ log_options, messages ]);

							log_options.page_to_edit
							//
							= wiki_API.VALUE_set_page_to_edit;

							// 改写于可写入处。e.g., 'Wikipedia:Sandbox'
							// TODO: bug: 当分批时，只会写入最后一次。
							session.page('User:'
							//
							+ session.token.login_user_name, log_options)
							//
							.edit(messages.join('\n'), log_options);
						}
					});
				} else {
					library_namespace.log('\nlog:<br />\n'
							+ messages.join('<br />\n'));
				}

				// --------------------
				// 处理记忆体泄漏问题 @ 20191129.check_language_conversion.js
				// console.log(process.memoryUsage());
				// delete session.last_pages;
				// 警告: 预设处理程序会清理掉解析后的资料。这可能造成严重错误，例如页面被清空！
				if (!log_options.do_not_clean_parsed && Array.isArray(pages)) {
					// console.trace('主动清理 page_data.parsed 以释放记忆体。');
					// console.log(pages[0]);
					// free:
					// 必须要主动清理 page_data.parsed 才能释放记忆体。
					// @ 20191129.check_language_conversion.js
					// 不晓得是哪个环节索引了 page_data。
					pages.forEach(function(page_data, index) {
						if (page_data.parsed) {
							page_data.parsed.truncate();
							delete page_data.parsed;
						}
						// 以下效果不显著。
						// Object.clean(page_data.parsed);
						// Object.clean(page_data);
						// delete pages[index];
					});
				}
				// `node --expose-gc *.js`
				// global.gc && global.gc();
				// console.trace([ target.length, process.memoryUsage(), session
				// ]);
				// --------------------

				if (setup_target
						&& (config.untouch_page_list ? work_continue : 0) < target.length) {
					// 继续下一批。
					// setup_target();
					setTimeout(setup_target, 0);
					return;
				}

				// run this at last.
				// 在wiki_API.prototype.work()工作最后执行此config.last()。
				// config.callback()
				// 只有在成功时，才会继续执行。
				//
				// 2016/6/22 change API 应用程式介面变更:
				// .after() → .last()
				// 改变适合之函数名。
				if (typeof config.last === 'function') {
					// last(error)
					session.run(config.last.bind(log_options, error_to_return));
				}

				if (!config.no_message) {
					session.run(function() {
						library_namespace.log('wiki_API.work: '
								// 已完成作业
								+ '结束 .work() 作业'
								+ (config.summary ? ' [' + config.summary + ']'
										: '。'));
					});
				}
			}

		};

		var target = pages,
		// const 可用来纪录整体作业进度 overall progress。因为这个作业耗时较长 标注进度可让人知道已经做了多少
		initial_target_length = config.initial_target_length = target.length,
		//
		slice_size = max_slice_size(this, config),
		/** {ℕ⁰:Natural+0}自此 index 开始继续作业 */
		work_continue = 0, this_slice_size, setup_target;

		// 首先取得多个页面内容所用之 options。
		// e.g., page_options:{rvprop:'ids|content|timestamp'}
		// @see
		// https://www.mediawiki.org/w/api.php?action=help&modules=query%2Brevisions
		var page_options = {
			// call_from_wiki_API__work : 1 + Math.random(),

			// 为了降低记忆体使用，不把所有属性添附至原有的 {Object}page_data 资料结构中。
			do_not_import_original_page_data : true,
			handle_continue_response : 'merge_response',
			allow_missing : config.no_warning,
			// multiple pages
			multi : true
		};
		// console.trace(page_options);
		// https://www.mediawiki.org/w/api.php?action=help&modules=query
		Object.keys(page_options).append(
				[ 'is_id', 'redirects', 'converttitles' ])
		//
		.forEach(function(parameter) {
			if (parameter in config) {
				library_namespace.debug('Copy [' + parameter
				//
				+ '] to page_options', 2, 'wiki_API.work');
				page_options[parameter] = config[parameter];
			}
		});
		Object.assign(page_options,
		// 可以之处理数目限制 limit。单一页面才能取得多 revisions。多页面(≤50)只能取得单一 revision。
		config.page_options);

		// 个别页面会采用的 page options 选项。
		var single_page_options = Object.assign({
			// 已经在多个页面的时候取得过内容，因此不需要再确认一次。只是要过个水设定一下。
			// 若是没有设定这个选项，那么对于错误的页面，将会再尝试取得。
			allow_missing : true
		}, config.page_options);
		// 在个别页面还采取 .multi 这个选项会造成错误。
		delete single_page_options.multi;

		if (!config.no_edit) {
			var check_options = config.check_options;
			if (!check_options && typeof config.log_to === 'string'
			// 若 log_to 以数字作结，自动将其当作 section。
			&& (check_options = config.log_to.match(/\d+$/))) {
				check_options = {
					section : check_options[0]
				};
			}

			if (check_options) {
				// wiki_API.check_stop()
				this.check(check_options);
			}
		}

		// console.log(JSON.stringify(pages));
		// console.log(pages === target);
		// console.log(JSON.stringify(target));
		if (Array.isArray(target)) {
			if (!config.untouch_page_list) {
				// 避免 read-only page list。
				target = target.slice();
			}
			// Split when length is too long. 分割过长的 page list。
			setup_target = (function() {
				var this_slice = config.untouch_page_list ? target.slice(
						work_continue, work_continue + slice_size)
				// 执行完一批就删除一批，以减少记忆体使用。
				: target.splice(0, slice_size);
				var max_size = max_slice_size(this, config, this_slice);

				if (false) {
					console
							.log([ 'max_size:', max_size, this_slice.length,
									initial_target_length, config.is_id,
									work_continue ]);
				}
				if (max_size < slice_size) {
					if (!config.untouch_page_list) {
						// 回填本次无法处理之 pages。
						Array.prototype.unshift.apply(target, this_slice
								.slice(max_size));
					}
					this_slice = this_slice.slice(0, max_size);
				}
				if (work_continue === 0 && max_size === initial_target_length) {
					library_namespace.debug('设定一次先取得所有 ' + max_size
							+ ' 个页面之 revisions (page contents 页面内容)。', 2,
							'wiki_API.work');
				} else {
					done = gettext(
					// gettext_config:{"id":"processing-chunks-$1-$2"}
					'处理分块 %1–%2', work_continue + 1, (work_continue
					// start–end/all
					+ Math.min(max_size, initial_target_length)) + '/'
							+ initial_target_length);
					// Add percentage message.
					if (initial_target_length > 1e4
					// 数量太大或执行时间过长时，就显示剩余时间讯息。
					|| Date.now() - config.start_working_time > 2 * 60 * 1000) {
						done += estimated_message(work_continue,
								initial_target_length,
								config.start_working_time);
					}
					// done += '。';
					nochange_count = 'wiki_API.work: ';
					done = config.summary ? [ nochange_count, 'fg=green',
							String(config.summary), '-fg', ': ' + done ]
							: [ nochange_count + done ];
					library_namespace.sinfo(done);
				}

				// reset count and log.
				done = nochange_count = 0;
				messages.reset();

				this_slice_size = this_slice.length;
				work_continue += this_slice_size;

				// 假如想要全部转换成 pageids，必须考量有些页面可能没有 pageid 的问题。
				if (false)
					console.trace('一次取得本 slice 所有页面内容。'
							+ [ maybe_nested_thread, session.running,
									session.actions.length ]);
				// console.trace(page_options);
				this.page(this_slice, main_work, page_options);
			}).bind(this);

			config.start_working_time = Date.now();
			setup_target();

		} else {
			// assert: target is {String}title or {Object}page_data
			library_namespace.debug('取得单一页面之 (page contents 页面内容)。', 2,
					'wiki_API.work');
			this.page(target, main_work, page_options);
		}
	};

	/**
	 * 选择要纪录的项目。在大量编辑时，可利用此缩减 log。
	 * 
	 * @type {Object}
	 */
	wiki_API.prototype.work.log_item = {
		title : true,
		report : true,
		get_pages : true,
		// 跳过[[WP:NULLEDIT|无改变]]的。
		// nochange : false,
		error : true,
		succeed : true
	};

	// --------------------------------------------------------------------------------------------
	// 以下皆泛用，无须 wiki_API instance。

	// ------------------------------------------------------------------------

	wiki_API.assert_user_right = function(assert_type, callback, options) {
		TODO;

		// besure {Function}callback
		callback = typeof callback === 'function' && callback;

		var session = wiki_API.session_of_options(options);
		// 支援断言编辑功能。
		var action = 'assert=' + (assert_type || 'user');
		if (session.API_URL) {
			library_namespace.debug('API URL: [' + session.API_URL + ']。', 3,
					'wiki_API.assert_user_right');
			action = [ session.API_URL, action ];
		}
		library_namespace.debug('action: [' + action + ']。', 3,
				'wiki_API.assert_user_right');

		library_namespace.debug('准备确认权限。', 1, 'wiki_API.assert_user_right');
		wiki_API.query(action, function(data) {
			// console.trace(data);
			// 确认尚未登入，才作登入动作。
			if (data === '') {
				// 您已登入。
				library_namespace.debug('You are already logged in.', 1,
						'wiki_API.assert_user_right');
				callback(data);
				return;
			}

			callback(data);
		});
	};

	// 未登录/anonymous时的token
	var BLANK_TOKEN = '+\\';

	// get token
	// https://www.mediawiki.org/w/api.php?action=help&modules=query%2Btokens
	wiki_API.prototype.get_token = function(callback, options) {
		// assert: this (session) 已登入成功， callback 已设定好。
		// 前置处理。
		if (typeof options === 'string') {
			options = {
				type : options
			};
		} else {
			options = library_namespace.setup_options(options);
		}
		var type = options.type
		// default_type: csrf (cross-site request forgery) token
		|| 'csrf';
		// TODO: for {Array}type
		var session = this, token = session.token;
		if (!options.force && token[type + 'token']) {
			// 已存有此 token。
			callback(token[type + 'token']);
			return this;
		}

		library_namespace.debug('Try to get the ' + type + 'token ...', 1,
				'wiki_API.prototype.get_token');
		// console.log(this);
		wiki_API.query([ session.API_URL,
		// https://www.mediawiki.org/wiki/API:Tokens
		// 'action=query&meta=tokens&type=csrf|login|watchlist'
		'action=query&meta=tokens' + (type ? '&type=' + type : '') ],
		//
		function(data) {
			if (data && data.query && data.query.tokens) {
				// 设定 tokens。
				Object.assign(session.token, data.query.tokens);
				if (!session.token[type + 'token'])
					session.token[type + 'token'] = BLANK_TOKEN;
				library_namespace.debug(
				//
				type + 'token: ' + session.token[type + 'token']
				//
				+ (session.token[type + 'token'] === BLANK_TOKEN
				//
				? ' (login as anonymous!)' : ''),
				//
				1, 'wiki_API.prototype.token');
				// console.log(this);
				callback(session.token[type + 'token'] || session.token);
				return;
			}

			library_namespace.error(
			//
			'wiki_API.prototype.token: Unknown response: ['
			//
			+ (data && data.warnings && data.warnings.tokens
			//
			&& data.warnings.tokens['*'] || data) + ']');
			if (library_namespace.is_debug()
			// .show_value() @ interact.DOM, application.debug
			&& library_namespace.show_value)
				library_namespace.show_value(data);
			callback();
		},
		// Tokens may not be obtained when using a callback
		Object.create(null), session);
		return this;
	};

	if (false) {
		login_user_name = CeL.wiki
				.extract_login_user_name(login_options.user_name);
		user_name === CeL.wiki.normalize_title(wiki.token.login_user_name);
	}
	// "owner_name@user_name" → "user_name"
	// Should use session.login_user_info.name
	wiki_API.extract_login_user_name = function(lgname) {
		// https://www.mediawiki.org/w/api.php?action=help&modules=login
		// 'Main account name@bot name'
		var matched = lgname.match(/^([^@\n]+)@/);
		// 机器人名称： user name or pure bot name
		return wiki_API.normalize_title(matched
		// e.g., "alias_bot_name@main_bot_name" → "main_bot_name"
		? matched[1].trim() : lgname);

		return wiki_API.normalize_title(lgname.replace(/@[^@]+$/, '').trim());
	};

	// 登入认证用。
	// https://www.mediawiki.org/wiki/API:Login
	// https://www.mediawiki.org/wiki/API:Edit
	// 认证用 cookie:
	// {zhwikiSession,centralauth_User,centralauth_Token,centralauth_Session,wikidatawikiSession,wikidatawikiUserID,wikidatawikiUserName}
	//
	// TODO: https://www.mediawiki.org/w/api.php?action=help&modules=clientlogin
	wiki_API.login = function(user_name, password, login_options) {
		var error;
		function _next() {
			// popup 'login'.
			// assert: session.actions[0] === ['login']
			if (session.actions[0] && session.actions[0][0] === 'login')
				session.actions.shift();

			if (false) {
				console.trace([ session.login_user_info,
						session.token.login_user_name ]);
			}
			if (!error && (!session.login_user_info
			// get the user right to check 'apihighlimits'
			|| session.login_user_info.name !== session.token.login_user_name)) {
				session.running = false;
				session.userinfo('rights|blockinfo|centralids', function(
						userinfo, error) {
					// console.trace(userinfo);
					session.login_user_info = userinfo;
					_next();
				});
				return;
			}

			callback
			// 注意: new wiki_API() 后之操作，应该采 wiki_session.run()
			// 的方式，确保此时已经执行过 pre-loading functions @ function wiki_API():
			// wiki_session.siteinfo(), wiki_session.adapt_task_configurations()
			&& session.run(callback.bind(session,
			// instead of session.token.lgname
			session.token.login_user_name, error));
			library_namespace.debug('已登入 [' + session.token.lgname
					+ ']。自动执行 .next()，处理余下的工作。', 1, 'wiki_API.login');
			session.next();
		}

		function _done(data, _error) {
			// 注意: 在 mass edit 时会 lose token (badtoken)，需要保存 password。
			if (!session.preserve_password) {
				// 舍弃 password。
				delete session.token.lgpassword;
			}

			if (session.token.lgname) {
				session.token.login_user_name
				//
				= wiki_API.extract_login_user_name(session.token.lgname);
			}

			// reset query limit for login as bot.
			delete session.slow_query_limit;

			// console.log(JSON.stringify(data));
			if (data && data.warnings) {
				// console.log(JSON.stringify(data.warnings));
			}

			if (_error) {
				error = _error;
			} else if (data && (data = data.login)) {
				if (data.result === 'Success') {
					wiki_API.login.copy_keys.forEach(function(key) {
						if (data[key]) {
							session.token[key] = data[key];
						}
					});

					delete session.login_failed_count;
					// 纪录最后一次成功登入。
					// session.last_login = new Date;
				} else {
					// login error
					if (!(session.login_failed_count > 0)) {
						session.login_failed_count = 1;
					} else if (++session.login_failed_count > wiki_API.login.MAX_ERROR_RETRY) {
						// 连续登入失败太多次就跳出程序。
						throw 'wiki_API.login: Login failed '
								+ session.login_failed_count + ' times! Exit!';
					}
					// delete session.last_login;

					/**
					 * 当没有登入成功时的处理以及警讯。
					 * 
					 * e.g., data = <code>
					{"login":{"result":"Failed","reason":"Incorrect password entered.\nPlease try again."}}

					{"login":{"result":"Failed","reason":"You have made too many recent login attempts. Please wait 5 minutes before trying again."}}

					{"warnings":{"main":{"*":"Subscribe to the mediawiki-api-announce mailing list at <https://lists.wikimedia.org/mailman/listinfo/mediawiki-api-announce> for notice of API deprecations and breaking changes."},"login":{"*":"Main-account login via \"action=login\" is deprecated and may stop working without warning. To continue login with \"action=login\", see [[Special:BotPasswords]]. To safely continue using main-account login, see \"action=clientlogin\"."}},"login":{"result":"Success","lguserid":263674,"lgusername":"Cewbot"}}
					 * </code>
					 */
					library_namespace.error('wiki_API.login: login ['
							+ session.token.lgname + '] failed '
							+ session.login_failed_count + '/'
							+ wiki_API.login.MAX_ERROR_RETRY + ': ['
							+ data.result + '] ' + data.reason + ' ('
							+ session.API_URL + ')');
					if (data.result !== 'Failed' || data.result !== 'NeedToken') {
						// Unknown result
					}
					error = data;
				}
			}
			session.get_token(_next);
		}

		// ------------------------------------------------

		var callback, session, API_URL;
		if (!login_options && !password
				&& library_namespace.is_Object(user_name)) {
			// .login(option); treat user_name as option

			// session = CeL.wiki.login(login_options);
			login_options = Object.clone(user_name);
			// console.log(login_options);
			user_name = login_options.user_name;
			// user_password
			password = login_options.password;
		}
		if (library_namespace.is_Object(login_options)) {
			API_URL = login_options.API_URL/* || login_options.project */;
			session = wiki_API.session_of_options(login_options);
			// besure {Function}callback
			callback = typeof login_options.callback === 'function'
					&& login_options.callback;
		} else if (typeof login_options === 'function') {
			callback = login_options;
			// 前置处理。
			login_options = Object.create(null);
		} else if (typeof login_options === 'string') {
			// treat login_options as API_URL
			API_URL = login_options;
			login_options = Object.create(null);
		} else {
			// 前置处理。
			login_options = library_namespace.new_options(login_options);
		}

		// console.trace([ user_name, password, API_URL ]);
		library_namespace.debug('API_URL: ' + API_URL + ', default language: '
				+ wiki_API.language, 3, 'wiki_API.login');

		if (session) {
			delete login_options.is_running;
		} else {
			// 初始化 session 与 agent。这里 callback 当作 API_URL。
			if (user_name && password) {
				login_options.is_running = 'login';
			} else {
				// 后面会直接 return
			}
			session = new wiki_API(user_name, password, login_options);
		}
		// console.trace([ user_name, password ]);
		if (!user_name || !password) {
			library_namespace.warn([ 'wiki_API.login: ', {
				T :
				// gettext_config:{"id":"no-user-name-or-password-provided.-the-login-attempt-was-abandoned"}
				'No user name or password provided. The login attempt was abandoned.'
			} ]);
			// console.trace('Stop login');
			callback && session.run(callback.bind(session));
			return session;
		}

		// copy configurations
		library_namespace.import_options(login_options, copy_login_options,
				session);

		if (!('login_mark' in login_options) || login_options.login_mark) {
			// hack: 这表示正 log in 中，当 login 后，会自动执行 .next()，处理余下的工作。
			// @see wiki_API.prototype.next
			if (login_options.is_running) {
				// assert: session.actions === [ 'login' ]
			} else if (login_options.login_mark) {
				// 将 'login' 置于工作伫列最前头。
				session.actions.unshift([ 'login' ]);
			} else {
				// default: 依顺序将 'login' 置于最末端。
				session.actions.push([ 'login' ]);
			}
		}
		// 支援断言编辑功能。
		var action = {
			assert : 'user'
		};
		if (session.API_URL) {
			library_namespace.debug('API URL: [' + session.API_URL + ']。', 3,
					'wiki_API.login');
			action = [ session.API_URL, action ];
		}
		library_namespace.debug('action: [' + action + ']。', 3,
				'wiki_API.login');

		library_namespace.debug('准备登入 [' + user_name + ']。', 1,
				'wiki_API.login');
		wiki_API.query(action, function(data) {
			// console.trace(data);
			// 确认尚未登入，才作登入动作。
			if (data === '' && !login_options.force) {
				// 您已登入。
				library_namespace.debug('You are already logged in.', 1,
						'wiki_API.login');
				_done();
				return;
			}

			delete session.token.csrftoken;
			// Credentials type: Password-based authentication
			// https://www.mediawiki.org/w/api.php?action=help&modules=query%2Btokens
			// wiki_API.query(action, callback, post_data, login_options)
			wiki_API.query([ session.API_URL, {
				// Fetching a token via "action=login" is deprecated.
				// Use "action=query&meta=tokens&type=login" instead.
				// https://www.mediawiki.org/wiki/MediaWiki_1.37/Deprecation_of_legacy_API_token_parameters
				action : 'query',
				meta : 'tokens',
				type : 'login'
			} ], function(data, _error) {
				// console.trace(data);
				// error && console.error(error);
				if (_error || !data || !data.query || !data.query.tokens
						|| !data.query.tokens.logintoken) {
					library_namespace.error(
					//		
					'wiki_API.login: 无法 login！ Abort! Response:');
					error = _error;
					library_namespace.error(error || data);
					callback
							&& session.run(callback.bind(session, null, error
									|| data));
					return;
				}

				Object.assign(session.token, data.query.tokens);
				// console.log(data.query.tokens);
				// https://www.mediawiki.org/w/api.php?action=help&modules=login
				var token = Object.create(null);
				for ( var parameter in wiki_API.login.parameters) {
					var key = wiki_API.login.parameters[parameter];
					if (key in session.token)
						token[parameter] = session.token[key];
				}
				// console.log(token);
				wiki_API.query([ session.API_URL, {
					action : 'login'
				} ], _done, token, session);
			}, null, session);

			return;

			// deprecated:

			// https://www.mediawiki.org/w/api.php?action=help&modules=login
			var token = Object.assign(Object.create(null), session.token);
			// console.log(token);
			// .csrftoken 是本函式为 cache 加上的，非正规 parameter。
			delete token.csrftoken;
			wiki_API.query([ session.API_URL,
			// 'action=query&meta=tokens&type=login|csrf'
			'action=login' ], function(data, error) {
				// console.trace(data);
				// error && console.error(error);
				if (data && data.login && data.login.result === 'NeedToken') {
					token.lgtoken = session.token.lgtoken = data.login.token;
					wiki_API.query([ session.API_URL, 'action=login' ], _done,
							token, session);
				} else {
					library_namespace.error(
					//		
					'wiki_API.login: 无法 login！ Abort! Response:');
					library_namespace.error(data);
					if (callback)
						session.run(callback.bind(session, null, data));
				}
			}, token, session);

		}, null, session);

		return session;
	};

	/** {Natural}登入失败时最多重新尝试下载的次数。 */
	wiki_API.login.MAX_ERROR_RETRY = 2;

	wiki_API.login.parameters = {
		lgname : 'lgname',
		lgpassword : 'lgpassword',
		lgtoken : 'logintoken',
		lgdomain : 'lgdomain'
	};

	var copy_login_options = {
		preserve_password : 'boolean'
	};

	/** {Array}欲 copy 至 session.token 之 keys。 */
	wiki_API.login.copy_keys = 'lguserid,lgtoken,cookieprefix,sessionid'
			.split(',');

	// ------------------------------------------------------------------------

	wiki_API.logout = function(session, callback) {
		var API_URL = typeof session === 'string' ? session : wiki_API
				.API_URL_of_options(session);
		wiki_API.query([ API_URL, 'action=logout' ], function(data) {
			// data: {}
			// console.log(data);
			delete session.token;
			if (typeof callback === 'function') {
				callback.call(session, data);
			}
		});
	};

	// --------------------------------------------------------------------------------------------

	// export 导出.

	// @inner
	library_namespace.set_method(wiki_API, {
		max_slice_size : max_slice_size,

		BLANK_TOKEN : BLANK_TOKEN
	});

	// ------------------------------------------

	// @static
	Object.assign(wiki_API, {
		estimated_message : estimated_message,

		PATTERN_BOT_NAME : PATTERN_BOT_NAME
	});

	// 不设定(hook)本 module 之 namespace，仅执行 module code。
	return library_namespace.env.not_to_extend_keyword;
}
