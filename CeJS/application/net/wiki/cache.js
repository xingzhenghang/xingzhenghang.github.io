/**
 * @name CeL function for MediaWiki (Wikipedia / 维基百科): cache
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
	name : 'application.net.wiki.cache',

	require : 'data.native.'
	// for library_namespace.get_URL
	+ '|application.net.Ajax.' + '|application.net.wiki.'
	// load MediaWiki module basic functions
	+ '|application.net.wiki.namespace.',

	// 设定不汇出的子函式。
	no_extend : '*',

	// 为了方便格式化程式码，因此将 module 函式主体另外抽出。
	code : module_code
});

function module_code(library_namespace) {

	// requiring
	var wiki_API = library_namespace.application.net.wiki, KEY_SESSION = wiki_API.KEY_SESSION;

	// --------------------------------------------------------------------------------------------

	/** {Object|Function}fs in node.js */
	var node_fs;
	try {
		if (library_namespace.platform.nodejs)
			// @see https://nodejs.org/api/fs.html
			node_fs = require('fs');
		if (typeof node_fs.readFile !== 'function')
			throw true;
	} catch (e) {
		// enumerate for wiki_API.cache
		// 模拟 node.js 之 fs，以达成最起码的效果（即无 cache 功能的情况）。
		library_namespace.warn(this.id
				+ ': 无 node.js 之 fs，因此不具备 cache 或 SQL 功能。');
		node_fs = {
			// library_namespace.storage.read_file()
			readFile : function(file_path, options, callback) {
				library_namespace.error('Cannot read file ' + file_path);
				if (typeof callback === 'function')
					callback(true);
			},
			// library_namespace.storage.write_file()
			writeFile : function(file_path, data, options, callback) {
				library_namespace.error('Cannot write to file ' + file_path);
				if (typeof options === 'function' && !callback)
					callback = options;
				if (typeof callback === 'function')
					callback(true);
			}
		};
	}

	// --------------------------------------------------------------------------------------------

	/**
	 * cache 相关函数:
	 * 
	 * @see application.storage.file.get_cache_file
	 *      application.OS.Windows.file.cacher
	 *      application.net.Ajax.get_URL_cache<br />
	 *      application.net.wiki<br />
	 *      wiki_API.cache() CeL.wiki.cache()
	 */

	if (false) {
		// examples

		CeL.wiki.cache({
			type : 'page',
			file_name : 'file_name',
			list : 'WP:SB',
			operator : function(data) {
				console.log(data);
			}
		}, function callback(data) {
			console.log(data);
		}, {
			// default options === this
			// namespace : '0|1',
			// [KEY_SESSION]
			// session : wiki,
			// title_prefix : 'Template:',
			// cache path prefix
			prefix : 'base_directory/'
		});

		CeL.set_debug(6);
		CeL.wiki.cache({
			type : 'callback',
			file_name : 'file_name',
			list : function(callback) {
				callback([ 1, 2, 3 ]);
			},
			operator : function(data) {
				console.log(data);
			}
		}, function callback(data) {
			console.log(data);
		}, {
			// default options === this
			// namespace : '0|1',
			// [KEY_SESSION]
			// session : wiki,
			// title_prefix : 'Template:',
			// cache path prefix
			prefix : './'
		});

		CeL.set_debug(6);
		var wiki = Wiki(true);
		CeL.wiki.cache({
			type : 'wdq',
			file_name : 'countries',
			list : 'claim[31:6256]',
			operator : function(list) {
				// console.log(list);
				result = list;
			}
		}, function callback(list) {
			// console.log(list);
		}, {
			// default options === this
			// namespace : '0|1',
			// [KEY_SESSION]
			session : wiki,
			// title_prefix : 'Template:',
			// cache path prefix
			prefix : './'
		});
	}

	/**
	 * cache 作业操作之辅助套装函数。
	 * 
	 * 注意: only for node.js. 必须自行 include 'application.platform.nodejs'。 <code>
	   CeL.run('application.platform.nodejs');
	 * </code><br />
	 * 注意: 需要自行先创建各 type 之次目录，如 page, redirects, embeddedin, ...<br />
	 * 注意: 会改变 operation, _this！ Warning: will modify operation, _this!
	 * 
	 * 连续作业: 依照 _this 设定 {Object}default options，即传递于各 operator 间的 ((this))。<br />
	 * 依照 operation 顺序个别执行单一项作业。
	 * 
	 * 单一项作业流程:<br />
	 * 设定档名。<br />
	 * 若不存在此档，则:<br />
	 * >>> 依照 operation.type 与 operation.list 取得资料。<br />
	 * >>> 若 Array.isArray(operation.list) 则处理多项列表作业:<br />
	 * >>>>>> 个别处理单一项作业，每次执行 operation.each() || operation.each_retrieve()。<br />
	 * >>> 执行 data = operation.retrieve(data)，以其回传作为将要 cache 之 data。<br />
	 * >>> 写入cache。<br />
	 * 执行 operation.operator(data)
	 * 
	 * TODO: file_stream<br />
	 * TODO: do not write file
	 * 
	 * @param {Object|Array}operation
	 *            作业设定。
	 * @param {Function}[callback]
	 *            所有作业(operation)执行完后之回调函数。 callback(response data)
	 * @param {Object}[_this]
	 *            传递于各 operator 间的 ((this))。注意: 会被本函数更动！
	 */
	function wiki_API_cache(operation, callback, _this) {
		if (library_namespace.is_Object(callback) && !_this) {
			// 未设定/不设定 callback
			// shift arguments.
			_this = callback;
			callback = undefined;
		}

		var index = 0;
		/**
		 * 连续作业时，转到下一作业。
		 * 
		 * node.js v0.11.16: In strict mode code, functions can only be declared
		 * at top level or immediately within another function.
		 */
		function next_operator(data) {
			library_namespace.debug('处理连续作业序列，转到下一作业: ' + (index + 1) + '/'
					+ operation.length, 2, 'wiki_API_cache.next_operator');
			// [ {Object}operation, {Object}operation, ... ]
			// operation = { type:'embeddedin', operator:function(data) }
			if (index < operation.length) {
				var this_operation = operation[index++];
				// console.log(this_operation);
				if (!this_operation) {
					// Allow null operation.
					library_namespace.debug('未设定 operation[' + (index - 1)
							+ ']。Skip this operation.', 1,
							'wiki_API_cache.next_operator');
					next_operator(data);

				} else {
					if (!('list' in this_operation)) {
						// use previous data as list.
						library_namespace.debug(
								'未特别指定 list，以前一次之回传 data 作为 list。', 3,
								'wiki_API_cache.next_operator');
						library_namespace.debug('前一次之回传 data: '
								+ (data && JSON.stringify(data).slice(0, 180))
								+ '...', 3, 'wiki_API_cache.next_operator');
						this_operation.list = data;
					}
					if (data) {
						library_namespace.debug('设定 .last_data_got: '
								+ (data && JSON.stringify(data).slice(0, 180))
								+ '...', 3, 'wiki_API_cache.next_operator');
						this_operation.last_data_got = data;
					}
					// default options === _this: 传递于各 operator 间的 ((this))。
					wiki_API_cache(this_operation, next_operator, _this);
				}

			} else if (typeof callback === 'function') {
				if (false && Array.isArray(data)) {
					// TODO: adapt to {Object}operation
					library_namespace.log('wiki_API_cache: Get ' + data.length
							+ ' page(s).');
					// 自订list
					// data = [ '' ];
					if (_this.limit >= 0) {
						// 设定此初始值，可跳过之前已经处理过的。
						data = data.slice(0 * _this.limit, 1 * _this.limit);
					}
					library_namespace.debug(data.slice(0, 8).map(
							wiki_API.title_of).join('\n')
							+ '\n...');
				}

				// last 收尾
				callback.call(_this, data);
			}
		}

		if (Array.isArray(operation)) {
			next_operator();
			return;
		}

		// ----------------------------------------------------
		/**
		 * 以下为处理单一次作业。
		 */
		library_namespace.debug('处理单一次作业。', 2, 'wiki_API_cache');
		library_namespace.debug(
				'using operation: ' + JSON.stringify(operation), 6,
				'wiki_API_cache');

		if (typeof _this !== 'object') {
			// _this: 传递于各 operator 间的 ((this))。
			_this = Object.create(null);
		}

		var file_name = operation.file_name,
		/** 前一次之回传 data。每次产出的 data。 */
		last_data_got = operation.last_data_got;

		if (typeof file_name === 'function') {
			// @see wiki_API_cache.title_only
			file_name = file_name.call(_this, last_data_got, operation);
		}

		var
		/** {String}method to get data */
		type = operation.type,
		/** {Boolean}是否自动尝试建立目录。 */
		try_mkdir = typeof library_namespace.fs_mkdir === 'function'
				&& operation.mkdir,
		//
		operator = typeof operation.operator === 'function'
				&& operation.operator,
		//
		list = operation.list;

		if (!file_name) {
			// 若自行设定了档名，则慢点执行 list()，先读读 cache。因为 list() 可能会颇耗时间。
			// 基本上，设定 this.* 应该在 operation.operator() 中，而不是在 operation.list() 中。
			if (typeof list === 'function') {
				// TODO: 允许非同步方法。
				list = list.call(_this, last_data_got, operation);
			}

			if (!operation.postfix) {
				if (type === 'file')
					operation.postfix = '.txt';
				else if (type === 'URL')
					operation.postfix = '.htm';
			}

			// 自行设定之档名 operation.file_name 优先度较 type/title 高。
			// 需要自行创建目录！
			file_name = _this[type + '_prefix'] || type;
			file_name = [ file_name
			// treat file_name as directory
			? /[\\\/]/.test(file_name) ? file_name : file_name + '/' : '',
			//
			wiki_API.is_page_data(list) ? list.title
			// 若 Array.isArray(list)，则 ((file_name = ''))。
			: typeof list === 'string' && wiki_API.normalize_title(list, true) ];
			if (file_name[1]) {
				file_name = file_name[0]
				// 正规化档名。
				+ file_name[1].replace(/\//g, '_');
			} else {
				// assert: node_fs.readFile('') 将执行 callback(error)
				file_name = '';
			}
		}

		if (file_name) {
			if (!('postfix' in operation) && !('postfix' in _this)
					&& /\.[a-z\d\-]+$/i.test(file_name)) {
				// 若已设定 filename extension，则不自动添加。
				operation.postfix = '';
			}

			file_name = [ 'prefix' in operation ? operation.prefix
			// _this.prefix: cache path prefix
			: 'prefix' in _this
			//
			? _this.prefix : wiki_API_cache.prefix, file_name,
			// auto detect filename extension
			'postfix' in operation ? operation.postfix
			//
			: 'postfix' in _this ? _this.postfix : wiki_API_cache.postfix ];
			library_namespace.debug('Pre-normalized cache file name: ['
					+ file_name + ']', 5, 'wiki_API_cache');
			if (false)
				library_namespace.debug('file name param:'
						+ [ operation.file_name, _this[type + '_prefix'], type,
								JSON.stringify(list) ].join(';'), 6,
						'wiki_API_cache');
			// 正规化档名。
			file_name = file_name.join('').replace(/[:*?<>]/g, '_');
		}
		library_namespace.debug('Try to read cache file: [' + file_name + ']',
				3, 'wiki_API_cache');

		var
		/**
		 * 采用 JSON<br />
		 * TODO: parse & stringify 机制
		 * 
		 * @type {Boolean}
		 */
		using_JSON = 'json' in operation ? operation.json : /\.json$/i
				.test(file_name),
		/** {String}file encoding for fs of node.js. */
		encoding = _this.encoding || wiki_API.encoding;
		// list file path
		_this.file_name = file_name;

		// console.log('Read file: ' + file_name);
		node_fs.readFile(file_name, encoding, function(error, data) {
			/**
			 * 结束作业。
			 */
			function finish_work(data) {
				library_namespace.debug('finish work', 3,
						'wiki_API_cache.finish_work');
				last_data_got = data;
				if (operator)
					operator.call(_this, data, operation);
				library_namespace.debug('loading callback', 3,
						'wiki_API_cache.finish_work');
				if (typeof callback === 'function')
					callback.call(_this, data);
			}

			if (!operation.reget && !error && (data ||
			// 当资料 Invalid，例如采用 JSON 却获得空资料时；则视为 error，不接受此资料。
			('accept_empty_data' in _this
			//
			? _this.accept_empty_data : !using_JSON))) {
				// gettext_config:{"id":"using-cached-data"}
				library_namespace.debug('Using cached data.', 3,
						'wiki_API_cache');
				library_namespace.debug('Cached data: ['
						+ (data && data.slice(0, 200)) + ']...', 5,
						'wiki_API_cache');
				if (using_JSON && data) {
					try {
						data = JSON.parse(data);
					} catch (e) {
						library_namespace.error(
						// error. e.g., "undefined"
						'wiki_API_cache: Cannot parse as JSON: ' + data);
						// 注意: 若中途 abort，此时可能需要手动删除大小为 0 的 cache file！
						data = undefined;
					}
				}
				finish_work(data);
				return;
			}

			library_namespace.debug(
					operation.reget ? 'Dispose cache. Reget again.'
					// ↑ operation.reget: 放弃 cache，重新取得资料。
					: 'No valid cached data. Try to get data...', 3,
					'wiki_API_cache');

			/**
			 * 写入 cache 至档案系统。
			 */
			function write_cache(data) {
				if (operation.cache === false) {
					// 当设定 operation.cache: false 时，不写入 cache。
					library_namespace.debug(
							'设定 operation.cache === false，不写入 cache。', 3,
							'wiki_API_cache.write_cache');

				} else if (/[^\\\/]$/.test(file_name)) {
					library_namespace.info('wiki_API_cache: '
							+ 'Write cache data to [' + file_name + '].'
							+ (using_JSON ? ' (using JSON)' : ''));
					library_namespace.debug('Cache data: '
							+ (data && JSON.stringify(data).slice(0, 190))
							+ '...', 3, 'wiki_API_cache.write_cache');
					var write = function() {
						// 为了预防需要建立目录，影响到后面的作业，
						// 因此采用 fs.writeFileSync() 而非 fs.writeFile()。
						node_fs.writeFileSync(file_name, using_JSON ? JSON
								.stringify(data) : data, encoding);
					};
					try {
						write();
					} catch (error) {
						// assert: 此 error.code 表示上层目录不存在。
						var matched = error.code === 'ENOENT'
						// 未设定 operation.mkdir 的话，预设会自动尝试建立目录。
						&& try_mkdir !== false
						//
						&& file_name.match(/[\\\/][^\\\/]+$/);
						if (matched) {
							// 仅测试一次。设定 "已尝试过" flag。
							try_mkdir = false;
							// create parent directory
							library_namespace.fs_mkdir(file_name.slice(0,
									matched.index));
							// re-write file again.
							try {
								write();
							} catch (e) {
								library_namespace.error(
								//
								'wiki_API_cache: Error to write cache data!');
								library_namespace.error(e);
							}
						}
					}
				}

				finish_work(data);
			}

			// node.js v0.11.16: In strict mode code, functions can only be
			// declared
			// at top level or immediately within another function.
			/**
			 * 取得并处理下一项 data。
			 */
			function get_next_item(data) {
				if (index < list.length) {
					// 利用基本相同的参数以取得 cache。
					_operation.list = list[index++];
					var message = '处理多项列表作业: ' + type + ' ' + index + '/'
							+ list.length;
					if (list.length > 8) {
						library_namespace.info('wiki_API_cache.get_next_item: '
								+ message);
					} else {
						library_namespace.debug(message, 1,
								'wiki_API_cache.get_next_item');
					}
					wiki_API_cache(_operation, get_next_item, _this);
				} else {
					// last 收尾
					// All got. retrieve data.
					if (_operation.data_list)
						data = _operation.data_list;
					if (typeof operation.retrieve === 'function')
						data = operation.retrieve.call(_this, data);
					write_cache(data);
				}
			}

			if (typeof list === 'function' && type !== 'callback') {
				library_namespace.debug('Call .list()', 3, 'wiki_API_cache');
				list = list.call(_this, last_data_got, operation);
				// 对于 .list() 为 asynchronous 函数的处理。
				if (list === wiki_API_cache.abort) {
					library_namespace.debug('It seems the .list()'
							+ ' is an asynchronous function.' + ' I will exit'
							+ ' and wait for the .list() finished.', 3,
							'wiki_API_cache');
					return;
				}
			}
			if (list === wiki_API_cache.abort) {
				library_namespace
						.debug('Abort operation.', 1, 'wiki_API_cache');
				finish_work();
				return;
			}

			if (Array.isArray(list)) {
				if (!type) {
					library_namespace.debug('采用 list (length ' + list.length
							+ ') 作为 data。', 1, 'wiki_API_cache');
					write_cache(list);
					return;
				}
				if (list.length > 1e6) {
					library_namespace.warn(
					//
					'wiki_API_cache: 警告: list 过长/超过限度 (length ' + list.length
							+ ')，将过于耗时而不实际！');
				}

				/**
				 * 处理多项列表作业。
				 */
				var index = 0, _operation = Object.clone(operation);
				// 个别页面不设定 .file_name, .end。
				delete _operation.end;
				if (_operation.each_file_name) {
					_operation.file_name = _operation.each_file_name;
					delete _operation.each_file_name;
				} else {
					delete _operation.file_name;
				}
				if (typeof _operation.each === 'function') {
					// 每一项 list 之项目执行一次 .each()。
					_operation.operator = _operation.each;
					delete _operation.each;
				} else {
					if (typeof _operation.each_retrieve === 'function')
						_operation.each_retrieve = _operation.each_retrieve
								.bind(_this);
					else
						delete _operation.each_retrieve;
					/**
					 * 预设处理列表的函数。
					 */
					_operation.operator = function(data) {
						if ('each_retrieve' in operation)
							// 资料事后处理程序 (post-processor):
							// 将以 .each_retrieve() 的回传作为要处理的资料。
							data = operation.each_retrieve.call(_this, data);
						if (_operation.data_list) {
							if (Array.isArray(data))
								Array.prototype.push.apply(
										_operation.data_list, data);
							else if (data)
								_operation.data_list.push(data);
						} else {
							if (Array.isArray(data))
								_operation.data_list = data;
							else if (data)
								_operation.data_list = [ data ];
						}
					};
				}
				library_namespace.debug('处理多项列表作业, using operation: '
						+ JSON.stringify(_operation), 5, 'wiki_API_cache');

				get_next_item();
				return;
			}

			// ------------------------------------------------
			/**
			 * 以下为处理单一项作业。
			 */

			var to_get_data, list_type;
			if (// type in get_list.type
			wiki_API.list.type_list.includes(type)) {
				list_type = type;
				type = 'list';
			}

			switch (type) {
			case 'callback':
				if (typeof list !== 'function') {
					library_namespace
							.warn('wiki_API_cache: list is not function!');
					callback.call(_this, last_data_got);
					break;
				}
				// 手动取得资料。使用 list=function(callback){callback(list);}
				to_get_data = function(list, callback) {
					library_namespace.log('wiki_API_cache: '
							+ 'manually get data and then callback(list).');
					if (typeof list === 'function') {
						// assert: (typeof list === 'function') 必须自己回 call！
						list.call(_this, callback, last_data_got, operation);
					}
				};
				break;

			case 'file':
				// 一般不应用到。
				// get file 内容。
				to_get_data = function(file_path, callback) {
					library_namespace.log('wiki_API_cache: Get file ['
							+ file_path + '].');
					node_fs.readFile(file_path, operation.encoding, function(
							error, data) {
						if (error)
							library_namespace.error(
							//
							'wiki_API_cache: Error get file [' + file_path
									+ ']: ' + error);
						callback.call(_this, data);
					});
				};
				break;

			case 'URL':
				// get URL 页面内容。
				to_get_data = function(URL, callback) {
					library_namespace.log('wiki_API_cache: Get URL of [' + URL
							+ '].');
					library_namespace.get_URL(URL, callback);
				};
				break;

			case 'wdq':
				to_get_data = function(query, callback) {
					if (_this[KEY_SESSION]) {
						if (!_this[KEY_SESSION].data_session) {
							_this[KEY_SESSION].set_data();
							_this[KEY_SESSION].run(function() {
								// retry again
								to_get_data(query, callback);
							});
							return;
						}
						operation[KEY_SESSION]
						//
						= _this[KEY_SESSION].data_session;
					}

					library_namespace.log('wiki_API_cache: Wikidata Query ['
							+ query + '].');
					// wikidata_query(query, callback, options)
					wiki_API.wdq(query, callback, operation);
				};
				break;

			case 'page':
				// get page contents 页面内容。
				// title=(operation.title_prefix||_this.title_prefix)+operation.list
				to_get_data = function(title, callback) {
					library_namespace.log('wiki_API_cache: Get content of '
							+ wiki_API.title_link_of(title));
					// 防止污染。
					var _options = library_namespace.new_options(_this,
							operation);
					// 包含 .list 时，wiki_API.page() 不会自动添加 .prop。
					delete _options.list;
					wiki_API.page(title, function(page_data) {
						callback(page_data);
					}, _options);
				};
				break;

			case 'redirects_here':
				// 取得所有重定向到(title重定向标的)之页面列表，(title重定向标的)将会排在[0]。
				// 注意: 无法避免双重重定向问题!
				to_get_data = function(title, callback) {
					// wiki_API.redirects_here(title, callback, options)
					wiki_API.redirects_here(title, function(root_page_data,
							redirect_list) {
						if (!operation.keep_redirects && redirect_list
								&& redirect_list[0]) {
							if (false) {
								console.assert(redirect_list[0].redirects
								//
								.join() === redirect_list.slice(1).join());
							}
							// cache 中不需要此累赘之资料。
							delete redirect_list[0].redirects;
							delete redirect_list[0].redirect_list;
						}
						callback(redirect_list);
					}, Object.assign({
						// Making .redirect_list[0] the redirect target.
						include_root : true
					}, _this, operation));
				};
				break;

			case 'list':
				to_get_data = function(title, callback) {
					var options = Object.assign({
						type : list_type
					}, _this, operation);
					wiki_API.list(title, function(pages) {
						if (!options.for_each || options.get_list) {
							library_namespace.log(list_type
							// allpages 不具有 title。
							+ (title ? ' '
							//
							+ wiki_API.title_link_of(title) : '') + ': '
									+ pages.length + ' page(s).');
						}
						pages.query_title = title;
						// page list, title page_data
						callback(pages);
					}, options);
				};
				break;

			default:
				if (typeof type === 'function')
					to_get_data = type.bind(Object.assign(Object.create(null),
							_this, operation));
				else if (type)
					throw new Error('wiki_API_cache: Bad type: ' + type);
				else {
					library_namespace.debug('直接采用 list 作为 data。', 1,
							'wiki_API_cache');
					write_cache(list);
					return;
				}
			}

			// 回复 recover type
			// if (list_type) type = list_type;

			var title = list;

			if (typeof title === 'string') {
				// 可以用 operation.title_prefix 覆盖 _this.title_prefix
				if ('title_prefix' in operation) {
					if (operation.title_prefix)
						title = operation.title_prefix + title;
				} else if (_this.title_prefix)
					title = _this.title_prefix + title;
			}
			library_namespace.debug('处理单一项作业: ' + wiki_API.title_link_of(title)
					+ '。', 3, 'wiki_API_cache');
			to_get_data(title, write_cache);
		});
	}

	/** {String}预设 file encoding for fs of node.js。 */
	wiki_API.encoding = 'utf8';
	/** {String}档名预设前缀。 */
	wiki_API_cache.prefix = '';
	/** {String}档名预设后缀。 */
	wiki_API_cache.postfix = '.json';
	/**
	 * 若 operation.list() return wiki_API_cache.abort，<br />
	 * 则将直接中断离开 operation，不执行 callback。<br />
	 * 此时须由 operation.list() 自行处理 callback。
	 */
	wiki_API_cache.abort = typeof Symbol === 'function' ? Symbol('ABORT_CACHE')
	//
	: {
		cache : 'abort'
	};
	/**
	 * 只取档名，仅用在 operation.each_file_name。<br />
	 * <code>{
	 * each_file_name : CeL.wiki.cache.title_only,
	 * }</code>
	 * 
	 * @type {Function}
	 */
	wiki_API_cache.title_only = function(last_data_got, operation) {
		var list = operation.list;
		if (typeof list === 'function') {
			operation.list = list = list.call(this, last_data_got, operation);
		}
		return operation.type + '/' + remove_page_title_namespace(list);
	};

	// ------------------------------------------------------------------------

	// export 导出.

	// wiki_API.cache = wiki_API_cache;
	return wiki_API_cache;
}
