/**
 * @name CeL function for MediaWiki (Wikipedia / 维基百科): query
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
	name : 'application.net.wiki.query',

	require : 'application.net.Ajax.get_URL'
	// URLSearchParams()
	+ '|application.net.'
	// library_namespace.age_of()
	+ '|data.date.' + '|application.net.wiki.'
	// load MediaWiki module basic functions
	+ '|application.net.wiki.namespace.'
	// for BLANK_TOKEN
	+ '|application.net.wiki.task.',

	// 设定不汇出的子函式。
	no_extend : 'this,*',

	// 为了方便格式化程式码，因此将 module 函式主体另外抽出。
	code : module_code
});

function module_code(library_namespace) {

	// requiring
	var get_URL = this.r('get_URL');

	var wiki_API = library_namespace.application.net.wiki, KEY_SESSION = wiki_API.KEY_SESSION;
	// @inner
	var setup_API_URL = wiki_API.setup_API_URL, BLANK_TOKEN = wiki_API.BLANK_TOKEN;

	var gettext = library_namespace.cache_gettext(function(_) {
		gettext = _;
	});

	// --------------------------------------------------------------------------------------------
	// 以下皆泛用，无须 wiki_API instance。

	// badtoken 超过这个次数则直接跳出。
	var max_badtoken_count = 2;

	function check_session_badtoken(result, callback, options) {
		var session = wiki_API.session_of_options(options);
		if (!session) {
			// run next action
			callback(result);
			return;
		}

		if (result ? result.error
		// 当运行过多次，就可能出现 token 不能用的情况。需要重新 get token。
		? result.error.code === 'badtoken'
		// The "token" parameter must be set.
		|| result.error.code === 'notoken'
		//
		: options.rollback_action && !options.get_page_before_undo
		// 有时 result 可能会是 ""，或者无 result.edit。这通常代表 token lost。
		&& (!result.edit
		// flow:
		// {status:'ok',workflow:'...',committed:{topiclist:{...}}}
		&& result.status !== 'ok'
		// e.g., success:1 @ wikidata
		&& !result.success) : result === '') {
			// Invalid token
			if (session.badtoken_count > 0)
				session.badtoken_count++;
			else
				session.badtoken_count = 1;
			library_namespace.warn([ 'check_session_badtoken: ',
			//
			(new Date).format(), ' ', wiki_API.site_name(session), ': ', {
				// gettext_config:{"id":"it-seems-that-the-token-is-lost"}
				T : '似乎丢失了令牌。'
			}, '(' + session.badtoken_count + '/' + max_badtoken_count + ')' ]);
			// console.trace(options);
			// console.trace(result);

			if (session.badtoken_count >= (isNaN(session.max_badtoken_count) ? max_badtoken_count
					// 设定 `session.max_badtoken_count = 0` ，那么只要登入一出问题就直接跳出。
					: session.max_badtoken_count)) {
				throw new Error('check_session_badtoken: ' + gettext(
				// gettext_config:{"id":"too-many-badtoken-errors!-please-re-execute-the-program"}
				'Too many badtoken errors! Please re-execute the program!'));
				// delete session.badtoken_count;
			}

			if (!library_namespace.platform.nodejs) {
				// throw new Error();
				library_namespace.warn([ 'check_session_badtoken: ', {
					// gettext_config:{"id":"not-using-node.js"}
					T : 'Not using node.js!'
				} ]);
				callback(result);
				return;
			}

			// 下面的 workaround 仅适用于 node.js。

			// 不应该利用 `session[wiki_API.KEY_HOST_SESSION].token.lgpassword`，
			// 而是该设定 `session.preserve_password`。
			if (!session.token.lgpassword) {
				// console.log(result);
				// console.trace(session);
				// 死马当活马医，仍然尝试重新取得 token... 没有密码无效。
				throw new Error('check_session_badtoken: ' + gettext(
				// gettext_config:{"id":"no-password-preserved"}
				'未保存密码！'));
			}

			// console.log(result);
			// console.log(options.action);
			// console.trace(session);
			// library_namespace.set_debug(3);
			if (typeof options.rollback_action === 'function') {
				// rollback action
				options.rollback_action();
			} else if (options.requery) {
				// hack: 登入后重新执行
				session.actions.unshift([ 'run', options.requery ]);
			} else {
				var message = 'check_session_badtoken: ' + gettext(
				// gettext_config:{"id":"did-not-set-$1"}
				'Did not set %1!', 'options.rollback_action()');
				throw new Error(message);
				library_namespace.error(message);
				console.trace(options);
			}

			// reset node agent.
			// 应付 2016/1 MediaWiki 系统更新，
			// 需要连 HTTP handler 都重换一个，重起 cookie。
			// 发现大多是因为一次处理数十页面，可能遇上 HTTP status 413 的问题。
			setup_API_URL(session, true);
			if (false && result === '') {
				// force to login again: see wiki_API.login
				delete session.token.csrftoken;
				delete session.token.lgtoken;
				// library_namespace.set_debug(6);
			}
			// TODO: 在这即使 rollback 了 action，
			// 还是可能出现丢失 next[2].page_to_edit 的现象。
			// e.g., @ 20160517.解消済み仮リンクをリンクに置き换える.js

			// 直到 .edit 动作才会出现 badtoken，
			// 因此在 wiki_API.login 尚无法侦测是否 badtoken。
			if ('retry_login' in session) {
				if (++session.retry_login > ('max_retry_login' in session ? session.max_retry_login
						: 2)) {
					// 当错误 login 太多次时，直接跳出。
					throw new Error('check_session_badtoken: '
					// gettext_config:{"id":"too-many-failed-login-attempts-$1"}
					+ gettext('Too many failed login attempts: %1',
					//
					'[' + session.token.lgname + ']'));
				}
				library_namespace.info('check_session_badtoken: Retry '
						+ session.retry_login);
			} else {
				session.retry_login = 0;
			}

			library_namespace.info([ 'check_session_badtoken: ', {
				// gettext_config:{"id":"try-to-get-the-token-again"}
				T : '尝试重新取得令牌。'
			} ]);
			wiki_API.login(session.token.lgname,
			//
			session.token.lgpassword, {
				force : true,
				// [KEY_SESSION]
				session : session,
				// 将 'login' 置于最前头。
				login_mark : true
			});

		} else {
			if (result && result.edit) {
				if ('retry_login' in session) {
					console.trace('已成功 edit，去除 retry flag。');
					delete session.retry_login;
				}
				if ('badtoken_count' in session) {
					console.trace('已成功 edit，去除 badtoken_count flag。');
					delete session.badtoken_count;
				}
			}
			// run next action
			callback(result);
			// 注意: callback() 必须采用 handle_error() 来测试是否出问题!
		}
	}

	var need_to_wait_error_code = new Set([ 'maxlag', 'ratelimited' ]);

	/**
	 * 实际执行 query 操作，直接 call API 之核心函数。 wiki_API.query()
	 * 
	 * 所有会利用到 wiki_API.prototype.work ← wiki_API.prototype.next ← <br />
	 * wiki_API.page, wiki_API.edit, ... ← wiki_API_query ← get_URL ← <br />
	 * need standalone http agent 的功能，都需要添附 session 参数。
	 * 
	 * -----------------------------------------
	 * 
	 * accept action: {URL}
	 * 
	 * action: {Search_parameters|URLSearchParams}parameters:<br />
	 * will get API_URL from options for undefined API
	 * 
	 * action: [ {String|Undefined}API,
	 * {Object|Search_parameters|URLSearchParams|String}parameters ]:<br />
	 * will get API_URL from options for undefined API
	 * 
	 * -----------------------------------------
	 * 
	 * @param {String|Array}action
	 *            {String}action or [ {String}api URL, {String}action,
	 *            {Object}other parameters ]
	 * @param {Function}callback
	 *            回调函数。 callback(response data, error)
	 * @param {Object}[POST_data]
	 *            data when need using POST method
	 * @param {Object}[options]
	 *            附加参数/设定选择性/特殊功能与选项<br />
	 *            wiki_API.edit 可能输入 session 当作 options。
	 * 
	 * @see api source:
	 *      https://phabricator.wikimedia.org/diffusion/MW/browse/master/includes/api
	 * 
	 * @since 2021/2/27 6:13:20 remove wiki_API.use_Varnish: 这方式已被 blocked。
	 */
	function wiki_API_query(action, callback, POST_data, options) {
		// 前置处理。
		options = library_namespace.setup_options(options);

		if (typeof callback !== 'function') {
			throw new Error('wiki_API_query: No {Function}callback!');
		}

		// 处理 action
		// console.trace([action, POST_data]);
		library_namespace.debug('action: ' + action, 2, 'wiki_API_query');
		// new URLSearchParams() 会将数值转成字串。 想二次利用 {Object}, {Array}，得采用
		// new CeL.URI() 而非 new URL()。
		if ((action instanceof URL) || library_namespace.is_URI(action)) {
			// Skip normalized URL
		} else if (typeof action === 'string' && /^https?:\/\//.test(action)) {
			action = new library_namespace.URI(action);
		} else if (typeof action === 'string'
		// TODO: {Map}, {Set}
		|| (action instanceof URLSearchParams)
				|| library_namespace.is_Search_parameters(action)
				// check if `action` is plain {Object}
				|| library_namespace.is_Object(action)) {
			action = [ , action ];
		} else if (!Array.isArray(action)) {
			// Invalid URL?
			library_namespace.warn([ 'wiki_API_query: ', {
				// gettext_config:{"id":"invalid-url-$1"}
				T : [ '网址无效：%1', '[' + typeof action + '] ' + action ]
			} ]);
			console.trace(action);
		}
		if (Array.isArray(action)) {
			// [ {String}api URL, {String}action, {Object}other parameters ]
			// → {URI}URL
			if (!library_namespace.is_Search_parameters(action[1])) {
				if (typeof action[1] === 'string'
				// https://www.mediawiki.org/w/api.php?action=help&modules=query
				&& !/^[a-z]+=/.test(action[1]) && !options.post_data_only) {
					library_namespace.warn([ 'wiki_API_query: ', {
						// gettext_config:{"id":"did-not-set-$1"}
						T : [ 'Did not set %1!', 'action' ]
					}, {
						// gettext_config:{"id":"will-set-$1-automatically"}
						T : [ '将自动设定 %1。', JSON.stringify('action=') ]
					} ]);
					console.trace(action);
					action[1] = 'action=' + action[1];
				}
				action[1] = library_namespace.Search_parameters(action[1]);
			}
			library_namespace.debug('api URL: ('
					+ (typeof action[0])
					+ ') ['
					+ action[0]
					+ ']'
					+ (action[0] === wiki_API.api_URL(action[0]) ? '' : ' → ['
							+ wiki_API.api_URL(action[0]) + ']'), 3,
					'wiki_API_query');
			action[0] = wiki_API.api_URL(action[0], options);
			action[0] = library_namespace.URI(action[0]);
			action[0].search_params.set_parameters(action[1]);
			if (action[2]) {
				// additional parameters
				action[0].search_params.set_parameters(action[2]);
			}
			action = action[0];
		} else {
			// {URL|CeL.URI}action
			action = library_namespace.URI(action);
		}
		// assert: library_namespace.is_URI(action)
		// console.trace(action);

		// additional parameters
		if (options.additional_query) {
			action.search_params.set_parameters(options.additional_query);
			delete options.additional_query;
		}
		// console.trace([ action, options ]);

		var session = wiki_API.session_of_options(options);
		if (isNaN(action.search_params.maxlag)) {
			// respect maxlag
			var maxlag = !isNaN(options.maxlag) ? options.maxlag : session
					&& !isNaN(session.maxlag) ? session.maxlag
					: wiki_API_query.default_maxlag;
			if (maxlag >= 0)
				action.search_params.maxlag = maxlag;
		}

		// respect edit time interval. 若为 query，非 edit (modify)，则不延迟等待。
		var need_check_edit_time_interval
		// method 2: edit 时皆必须设定 token。
		= POST_data && POST_data.token,
		// 检测是否间隔过短。支援最大延迟功能。
		to_wait,
		// edit time interval in ms
		edit_time_interval = options.edit_time_interval >= 0
		//
		? options.edit_time_interval :
		// ↑ wiki_API.edit 可能输入 session 当作 options。
		// options[KEY_SESSION] && options[KEY_SESSION].edit_time_interval ||
		wiki_API_query.default_edit_time_interval;

		if (need_check_edit_time_interval) {
			to_wait = edit_time_interval
					- (Date.now() - wiki_API_query.last_operation_time[action.origin]);
		}

		// TODO: 伺服器负载过重的时候，使用 exponential backoff 进行延迟。
		if (to_wait > 0) {
			library_namespace.debug({
				// gettext_config:{"id":"waiting-$1"}
				T : [ 'Waiting %1...', library_namespace.age_of(0, to_wait, {
					digits : 1
				}) ]
			}, 2, 'wiki_API_query');
			setTimeout(function() {
				wiki_API_query(action, callback, POST_data, options);
			}, to_wait);
			return;
		}
		if (need_check_edit_time_interval) {
			// reset timer
			wiki_API_query.last_operation_time[action.origin] = Date.now();
		} else {
			library_namespace.debug('非 edit (modify)，不延迟等待。', 3,
					'wiki_API_query');
		}

		var original_action = action.toString();

		// https://www.mediawiki.org/wiki/API:Data_formats
		// 因不在 white-list 中，无法使用 CORS。
		if (session && session.general_parameters) {
			action.search_params.set_parameters(session.general_parameters);
		} else if (!action.search_params.format
				&& wiki_API.general_parameters.format) {
			action.search_params.set_parameters(wiki_API.general_parameters);
		}
		// console.trace(action);

		// 开始处理 query request。
		if (!POST_data && wiki_API_query.allow_JSONP) {
			library_namespace.debug(
					'采用 JSONP callback 的方法。须注意：若有 error，将不会执行 callback！', 2,
					'wiki_API_query');
			library_namespace.debug('callback : (' + (typeof callback) + ') ['
					+ callback + ']', 3, 'wiki_API_query');
			get_URL(action, {
				callback : callback
			});
			return;
		}

		// console.log('-'.repeat(79));
		// console.log(options);
		var get_URL_options = Object.assign(
		// 防止污染，重新造一个 options。不污染 wiki_API_query.get_URL_options
		Object.clone(wiki_API_query.get_URL_options), options.get_URL_options);

		if (session) {
			// assert: {String|Undefined}action.search_params.action
			if (action.search_params.action === 'edit' && POST_data
			//
			&& (!POST_data.token || POST_data.token === BLANK_TOKEN)
			// 防止未登录编辑
			&& session.token
			//
			&& (session.token.lgpassword || session.preserve_password)) {
				// console.log([ action, POST_data ]);
				library_namespace.error('wiki_API_query: 未登录编辑？');
				throw new Error('wiki_API_query: 未登录编辑？');
			}

			// assert: get_URL_options 为 session。
			if (!session.get_URL_options) {
				library_namespace.debug(
						'为 wiki_API instance，但无 agent，需要造出 agent。', 2,
						'wiki_API_query');
				setup_API_URL(session, true);
			}
			Object.assign(get_URL_options, session.get_URL_options);
			// console.trace([ get_URL_options, session.get_URL_options ]);
		}

		if (options.form_data) {
			// @see wiki_API.upload()
			library_namespace.debug('Set form_data', 6);
			// throw 'Set form_data';
			// options.form_data 会被当作传入 to_form_data() 之 options。
			// to_form_data() will get file using get_URL()
			get_URL_options.form_data = options.form_data;
		}

		var agent = get_URL_options.agent;
		if (agent && agent.last_cookie && (agent.last_cookie.length > 80
		// cookie_cache: 若是用同一个 agent 来 access 过多 Wikipedia 网站，
		// 可能因载入 wikiSession 过多，如 last_cookie.length >= 86，
		// 而造成 413 (请求实体太大)。
		|| agent.cookie_cache)) {
			if (agent.last_cookie.length > 80) {
				library_namespace.debug('重整 cookie[' + agent.last_cookie.length
						+ ']。', 1, 'wiki_API_query');
				if (!agent.cookie_cache)
					agent.cookie_cache
					// {zh:['','',...],en:['','',...]}
					= Object.create(null);
				var last_cookie = agent.last_cookie;
				agent.last_cookie = [];
				while (last_cookie.length > 0) {
					var cookie_item = last_cookie.pop();
					if (!cookie_item) {
						// 不知为何，也可能出现这种 cookie_item === undefined 的情况。
						continue;
					}
					var matched = cookie_item.match(/^([a-z_\d]{2,20})wiki/);
					if (matched) {
						var language = matched[1];
						if (language in agent.cookie_cache)
							agent.cookie_cache[language].push(cookie_item);
						else
							agent.cookie_cache[language] = [ cookie_item ];
					} else {
						agent.last_cookie.push(cookie_item);
					}
				}
				library_namespace.debug('重整 cookie: → ['
						+ agent.last_cookie.length + ']。', 1, 'wiki_API_query');
			}

			var language = wiki_API.get_first_domain_name_of_session(session);
			if (!language) {
				library_namespace.debug('未设定 session，自 API_URL 撷取 language: ['
						+ action[0] + ']。', 1, 'wiki_API_query');
				// TODO: 似乎不能真的撷取到所需 language。
				language = wiki_API.site_name(action.origin, {
					get_all_properties : true
				});
				language = language && language.language || wiki_API.language;
				// e.g., wiki_API_query: Get "ja" from
				// ["https://ja.wikipedia.org/w/api.php?action=edit&format=json&utf8",{}]
				library_namespace.debug(
						'Get "' + language + '" from ' + action, 1,
						'wiki_API_query');
			}
			language = language.replace(/-/g, '_');
			if (language in agent.cookie_cache) {
				agent.last_cookie.append(agent.cookie_cache[language]);
				delete agent.cookie_cache[language];
			}
		}

		// console.trace(action);
		// console.log(POST_data);

		// merge `options.cached_response` to `response`
		// 以 cached_response 为基础，后设定者为准。
		function merge_cached_response(response) {
			// console.trace([ this.cached_response, response ]);
			this.cached_response = library_namespace.deep_merge_object(
					this.cached_response, response);
			if (false) {
				// console.trace(JSON.stringify(this.cached_response));
				console.trace([ this.cached_response.query.pages[75032],
						response.query.pages[75032] ]);
			}
			return this.cached_response;
		}

		// 2021/5/4 17:32:39 看来 intitle: 最多只能取得 10000 pages，再多必须多加排除条件，例如
		// -incategory:""。
		// 编辑页面后重新执行，或许可以取得不同的页面清单。
		if (options.handle_continue_response === 'merge_response') {
			options.handle_continue_response = merge_cached_response;
		} else if (options.handle_continue_response === true) {
			options.handle_continue_response = function default_handle_continue_response(
					response, action, POST_data) {
				// console.trace([ action, POST_data ]);
				// console.trace([ response, JSON.stringify(response) ]);
				// console.log(response);

				if (!action.search_params.action === 'query') {
					return;
				}

				var list = response.query[
				// e.g., prop: 'revisions'
				action.search_params.prop
				//
				|| action.search_params.list || action.search_params.meta];
				if (Array.isArray(list)) {
					// console.log(list);
					if (this.cached_list) {
						// assert: Array.isArray(this.cached_list)
						this.cached_list.append(list);
					} else {
						this.cached_list = list;
					}
				}
			};
		}

		function XMLHttp_handler(XMLHttp, error) {
			var status_code, response;
			if (error) {
				// assert: !!XMLHttp === false
				status_code = error;
			} else {
				status_code = XMLHttp.status;
				response = XMLHttp.responseText;
			}

			if (error || /^[45]/.test(status_code)) {
				// e.g., 503, 413
				if (typeof get_URL_options.onfail === 'function') {
					get_URL_options.onfail(error || status_code);
				} else if (typeof callback === 'function') {
					// console.trace(get_URL_options);
					library_namespace.warn(
					// Get error:
					// status_code maybe 'Error' for connect ETIMEDOUT
					'wiki_API_query: ' + status_code + ': '
					// 避免 TypeError:
					// Cannot convert object to primitive value
					+ action);
					callback(response, error || status_code);
				}
				return;
			}

			// response = XMLHttp.responseXML;
			library_namespace.debug('response ('
					+ response.length
					+ ' characters): '
					+ (library_namespace.platform.nodejs ? '\n' + response
							: response.replace(/</g, '&lt;')), 3,
					'wiki_API_query');

			// "<\": for Eclipse JSDoc.
			if (/<\html[\s>]/.test(response.slice(0, 40))) {
				response = response.between('source-javascript', '</pre>')
						.between('>')
						// 去掉所有 HTML tag。
						.replace(/<[^>]+>/g, '');

				// '&#123;' : (")
				// 可能会导致把某些 link 中 URL 编码也给 unescape 的情况?
				if (response.includes('&#'))
					response = library_namespace.HTML_to_Unicode(response);
			}

			// console.trace(response);
			// library_namespace.log(response);
			// library_namespace.log(library_namespace.HTML_to_Unicode(response));
			if (response) {
				try {
					response = JSON.parse(response);
				} catch (e) {
					// <title>414 Request-URI Too Long</title>
					// <title>414 Request-URI Too Large</title>
					if (response.includes('>414 Request-URI Too ')) {
						library_namespace.debug(
						//
						action.toString(), 1, 'wiki_API_query');
					} else {
						// TODO: 处理 API 传回结尾乱编码的情况。
						// https://phabricator.wikimedia.org/T134094
						// 不一定总是有效。

						library_namespace.error(
						//
						'wiki_API_query: Invalid content: ['
								+ String(response).slice(0, 40000) + ']');
						library_namespace.error(e);
					}

					// error handling
					if (get_URL_options.onfail) {
						get_URL_options.onfail(e);
					} else if (typeof callback === 'function') {
						callback(response, e);
					}

					// exit!
					return;
				}
			}

			if (response && response.error
			// https://www.mediawiki.org/wiki/Manual:Maxlag_parameter
			&& (need_to_wait_error_code.has(response.error.code)
			//
			|| Array.isArray(response.error.messages)
			//
			&& response.error.messages.some(function(message) {
				return message.name === 'actionthrottledtext';
			}))) {
				var waiting = response.error.info
				// /Waiting for [^ ]*: [0-9.-]+ seconds? lagged/
				.match(/([0-9.-]+) seconds? lagged/);
				waiting = waiting && +waiting[1] * 1000 || edit_time_interval;
				// console.trace(response);
				library_namespace.debug('The ' + response.error.code
				// 请注意，由于上游服务器逾时，缓存层（Varnish 或 squid）也可能会生成带有503状态代码的错误消息。
				+ (response.error.code === 'maxlag' ? ' ' + maxlag + ' s' : '')
				// waiting + ' ms'
				+ ' hitted. Waiting ' + library_namespace.age_of(0, waiting, {
					digits : 1
				}) + ' to re-execute wiki_API.query().', 1, 'wiki_API_query');
				// console.log([ original_action, POST_data ]);
				setTimeout(wiki_API_query.bind(null, original_action, callback,
						POST_data, options), waiting);
				return;
			}

			// console.trace(response);
			if (options.handle_continue_response && !response.error
					&& ('continue' in response)) {
				// 2021/4/20 6:55:23 不晓得为什么，在
				// 20210416.Sorting_category_and_sort_key_of_Thai_names.js 尝试
				// wbentityusage 的时候似乎会一直跑一直跑跑不完，基本上一次平移一篇文章，只好放弃了。

				// console.trace([ action, POST_data ]);
				// console.trace([ response, JSON.stringify(response) ]);

				// e.g., merge response to cached data
				options.handle_continue_response(response, action, POST_data);

				if (false) {
					// Do not touch original action and POST_data.
					action = new library_namespace.URI(action);
					POST_data = library_namespace.is_Object(POST_data)
							&& Object.clone(POST_data) || POST_data;
				}
				// delete response['continue']['continue'];
				// response['continue'].rawcontinue = 1;
				for ( var continue_key in response['continue']) {
					var value = response['continue'][continue_key];
					action.search_params[continue_key] = value;
					if (action.href.length > 2000) {
						delete action.search_params[continue_key];
						if (!POST_data)
							POST_data = Object.create(null);
						POST_data[continue_key] = value;
					}
				}
				// reget next data
				get_URL(action, XMLHttp_handler, null, POST_data,
						get_URL_options);
				return;
			}

			if (options.handle_continue_response === merge_cached_response) {
				response = options.handle_continue_response(response);
				delete response['continue'];
				// console.trace(response.query.pages[75032]);
			}

			// ----------------------------------

			if (typeof options.rollback_action !== 'function') {
				if (need_check_edit_time_interval
						&& (!POST_data || !POST_data.token)) {
					throw new Error(
					//
					'wiki_API_query: Edit without options.rollback_action!');
				}
				// Re-run wiki_API.query() after get new token.
				options.requery = wiki_API_query.bind(null, original_action,
						callback, POST_data, options);
			}

			// console.trace(action);
			// callback(response);
			// options.action = action;
			check_session_badtoken(response, callback, options);
		}

		get_URL(action, XMLHttp_handler, null, POST_data, get_URL_options);
	}

	wiki_API_query.get_URL_options = {
		headers : {
			// for mw_web_session use
			'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',

			/**
			 * By default, using the user agent get_URL_node.default_user_agent
			 * set in Ajax.js. To set another user agent:<code>

			CeL.wiki.query.get_URL_options.headers['User-Agent']='testbot/1.0'
			
			</code>
			 * 
			 * @see https://meta.wikimedia.org/wiki/User-Agent_policy
			 */
			'User-Agent' : CeL.net.Ajax.get_URL.default_user_agent
		},
		// default error retry 连线逾期/失败时再重新取得页面之重试次数。
		error_retry : 4,
		// default timeout: 1 minute
		timeout : library_namespace.to_millisecond('1 min')
	};

	/**
	 * edit (modify / create) 时之最大延迟参数。<br />
	 * default: 使用5秒的最大延迟参数。较高的值表示更具攻击性的行为，较低的值则更好。
	 * 
	 * 在 Wikimedia Toolforge 上 edit wikidata，单线程均速最快约 1584 ms/edits。
	 * 
	 * @type {ℕ⁰:Natural+0}
	 * 
	 * @see https://www.mediawiki.org/wiki/Manual:Maxlag_parameter
	 *      https://www.mediawiki.org/wiki/API:Etiquette 礼仪
	 *      https://grafana.wikimedia.org/d/000000170/wikidata-edits
	 */
	wiki_API_query.default_maxlag = 5;

	// 用户相关功能，避免延迟回应以使用户等待。 The user is waiting online.
	// for manually testing only
	// delete CeL.wiki.query.default_maxlag;

	/**
	 * edit (modify / create) 时之编辑时间间隔。<br />
	 * default: 使用5秒 (5000 ms) 的编辑时间间隔。
	 * 
	 * @type {ℕ⁰:Natural+0}
	 */
	wiki_API_query.default_edit_time_interval = 5000;

	// 用户相关功能，避免延迟回应以使用户等待。 The user is waiting online.
	// Only respect maxlag. 因为数量太多，只好增快速度。
	// CeL.wiki.query.default_edit_time_interval = 0;
	// wiki_session.edit_time_interval = 0;

	// local rule
	// @see function setup_API_language()
	wiki_API_query.edit_time_interval = {
	// [[:ja:WP:bot]]
	// Botの速度は、おおよそ毎分 6 编集を限度としてください。
	// e.g., @ User contributions,
	// Due to high database server lag, changes newer than 30 seconds may
	// not be shown in this list.
	// 由于资料库回应延迟，此清单可能不会显示最近 30 秒内的变更。
	// Changes newer than 25 seconds may not be shown in this list.
	// 此清单可能不会显示最近 25 秒内的变更。

	// [[w:ja:Wikipedia‐ノート:Bot#フラグ付きボットの速度制限変更提案]]
	// 「おおよそ毎分 6 编集」から「おおよそ毎分 12 编集」に缓和する
	// jawiki : 10000
	};

	/**
	 * 对于可以不用 XMLHttp 的，直接采 JSONP callback 法。
	 * 
	 * @type {Boolean}
	 */
	wiki_API_query.allow_JSONP = library_namespace.is_WWW(true) && false;

	/**
	 * URL last queried.<br />
	 * wiki_API_query.last_operation_time[API_URL] = {Date}last queried date
	 * 
	 * @type {Object}
	 */
	wiki_API_query.last_operation_time = Object.create(null);

	// @inner
	function join_pages() {
		return this.join('|');
	}

	/**
	 * 取得 page_data 之 title parameter。<br />
	 * e.g., page_data({pageid:8,title:'abc'}) → is_id?{pageid:8}:{title:'abc'}<br />
	 * page_data({title:'abc'}) → {title:'abc'}<br />
	 * 'abc' → {title:'abc'}<br />
	 * ['abc','def] → {title:['abc','def]}<br />
	 * 
	 * @param {Object}page_data
	 *            page data got from wiki API.
	 * @param {Boolean}[multi]
	 *            page_data is {Array}multi-page_data
	 * @param {Boolean}[is_id]
	 *            page_data is page_id instead of page_data
	 * @param {String}[param_name]
	 *            param name. default: 'title' or 'titles'.
	 */
	wiki_API_query.title_param = function(page_data, multi, is_id, param_name) {
		var pageid;

		if (Array.isArray(page_data)) {
			// auto detect multiple pages
			if (multi === undefined) {
				multi = pageid && pageid.length > 1;
			}

			pageid = [];
			// 确认所有 page_data 皆有 pageid 属性。
			if (page_data.every(function(page) {
				// {ℕ⁰:Natural+0}page.pageid
				if (page && page.pageid >= 0 && page.pageid < Infinity) {
					pageid.push(page.pageid);
					return true;
				}
			})) {
				// pageid = pageid.join('|');
				pageid.toString = join_pages;

			} else {
				if (wiki_API.is_page_data(page_data)) {
					library_namespace.warn('wiki_API_query.title_param: '
							+ '看似有些非正规之页面资料。');
					library_namespace.info('wiki_API_query.title_param: '
							+ '将采用 title 为主要查询方法。');
				}
				// reset
				pageid = page_data.map(function(page) {
					// {String}title or {title:'title'}
					return (typeof page === 'object' ? page.title
					// assert: page && typeof page === 'string'
					: page) || '';
				});
				pageid.toString = join_pages;
				if (is_id) {
					// Warning: using .title
				} else {
					page_data = pageid;
					pageid = undefined;
				}
				library_namespace.debug((pageid || page_data).toString(), 2,
						'wiki_API_query.title_param');
			}

		} else if (wiki_API.is_page_data(page_data)) {
			if (page_data.pageid > 0)
				// 有正规之 pageid 则使用之，以加速 search。
				pageid = page_data.pageid;
			else
				page_data = page_data.title;

		} else if (is_id !== false && typeof page_data === 'number'
		// {ℕ⁰:Natural+0}pageid should > 0.
		// pageid 0 回传格式不同于 > 0 时。
		// https://www.mediawiki.org/w/api.php?action=query&prop=revisions&pageids=0
		&& page_data > 0 && page_data === (page_data | 0)) {
			pageid = page_data;

		} else if (!page_data) {
			library_namespace.error([ 'wiki_API_query.title_param: ', {
				// gettext_config:{"id":"invalid-title-$1"}
				T : [ 'Invalid title: %1', wiki_API.title_link_of(page_data) ]
			} ]);
			// console.warn(page_data);
		}

		var parameters = new library_namespace.Search_parameters();
		if (pageid !== undefined) {
			parameters[multi ? 'pageids' : 'pageid'] = pageid;
		} else if (page_data) {
			parameters[param_name || (multi ? 'titles' : 'title')] = page_data;
		}

		return parameters;
	};

	/**
	 * get id of page
	 * 
	 * @param {Object}page_data
	 *            page data got from wiki API.
	 * @param {Boolean}[title_only]
	 *            get title only
	 * 
	 * @see get_page_title === wiki_API.title_of
	 */
	wiki_API_query.id_of_page = function(page_data, title_only) {
		if (Array.isArray(page_data)) {
			return page_data.map(function(page) {
				wiki_API_query.id_of_page(page, title_only);
			});
		}
		if (wiki_API.is_page_data(page_data)) {
			// 有 pageid 则使用之，以加速。
			return !title_only && page_data.pageid || page_data.title;
		}

		if (!page_data) {
			library_namespace.error([ 'wiki_API_query.id_of_page: ', {
				// gettext_config:{"id":"invalid-title-$1"}
				T : [ 'Invalid title: %1', wiki_API.title_link_of(page_data) ]
			} ]);
		}
		return page_data;
	};

	// ------------------------------------------------------------------------

	if (false) {
		// 1.
		// 注意: callback 仅有在出错时才会被执行!
		// callback() 必须采用下列方法来测试是否出问题!
		if (wiki_API.query.handle_error(data, error, callback)) {
			return;
		}
		// ...
		callback(data);

		// 2.
		error = wiki_API.query.handle_error(data, error);
		if (error) {
			// ...
			callback(data, error);
			return;
		}
		// ...
		callback(data);

		// TODO: 3.
		wiki_API.query(action, wiki_API.query.handle_error.bind({
			// on_error, on_OK 可省略。
			on_error : function(error) {
				library_namespace.error('function_name: ' + '...' + error);
			},
			on_OK : function(data) {
				// ...
			},
			callback : callback
		}));
	}

	function error_toString() {
		// TODO: 从 translatewiki 获取翻译。
		// e.g., for (this.code==='protectedpage'),
		// (this.info || this.message) ===
		// https://translatewiki.net/wiki/MediaWiki:Protectedpagetext/en
		return '[' + this.code + '] ' + (this.info || this.message);
	}

	wiki_API_query.error_toString = error_toString;

	/**
	 * 泛用先期处理程式。 response_handler(response)
	 * 
	 * wiki_API.query.handle_error(data, error)
	 */
	function handle_error(/* result of wiki_API.query() */data, error,
			callback_only_on_error) {
		// console.trace(arguments);
		// console.log(JSON.stringify(data));
		if (library_namespace.is_debug(3)
		// .show_value() @ interact.DOM, application.debug
		&& library_namespace.show_value)
			library_namespace.show_value(data, 'wiki_API_query.handle_error');

		if (!error && !data) {
			error = new Error('No data get!');
		}

		if (error) {
			if (typeof callback_only_on_error === 'function') {
				callback_only_on_error(data, error);
			}
			return error;
		}

		// assert: data && !error

		if (data.warnings) {
			for ( var action in data.warnings) {
				library_namespace.warn('handle_error: '
						+ data.warnings[action]['*']);
			}
			console.trace(data.warnings);
		}

		// 检查 MediaWiki 伺服器是否回应错误资讯。
		error = data.error;
		if (!error) {
			// No error, do not call callback_only_on_error()
			return;
		}

		error.toString = error_toString;

		if (// library_namespace.is_Object(error) &&
		// e.g., {code:'',info:'','*':''}
		error.code) {
			if (false) {
				library_namespace.error('wiki_API_query: ['
				//
				+ error.code + '] ' + error.info);
			}

			var message = error.toString();
			/**
			 * <code>

			{"error":{"code":"failed-save","info":"The save has failed.","messages":[{"name":"wikibase-api-failed-save","parameters":[],"html":{"*":"The save has failed."}},{"name":"abusefilter-warning","parameters":["Adding non-latin script language description in latin script","48"],"html":{"*":"..."}}],"*":"See https://www.wikidata.org/w/api.php for API usage. Subscribe to the mediawiki-api-announce mailing list at &lt;https://lists.wikimedia.org/postorius/lists/mediawiki-api-announce.lists.wikimedia.org/&gt; for notice of API deprecations and breaking changes."},"servedby":"mw1377"}

			</code>
			 */
			if (Array.isArray(error.messages)) {
				error.messages.forEach(function(_message) {
					if (!_message)
						return;
					message += ' [' + _message.name + ']';
					if (_message.html && typeof _message.html['*'] === 'string'
							&& _message.html['*'].length < 200) {
						message += ' ' + _message.html['*'];
					}
					if (Array.isArray(_message.parameters)
							&& _message.parameters.length > 0) {
						message += ' ' + JSON.stringify(_message.parameters);
					}
				});
			}

			error = new Error(message);
			error.message = message;
			error.code = data.error.code;
			// error.info = data.error.info;
			error.data = data.error;

		} else if (typeof error === 'string') {
			error = new Error(error);
		} else {
			// error = new Error(JSON.stringify(error));
		}

		if (typeof callback_only_on_error === 'function') {
			callback_only_on_error(data, error);
		}
		return error;
	}

	wiki_API_query.handle_error = handle_error;

	// ------------------------------------------------------------------------

	// export 导出.

	return wiki_API_query;
}
