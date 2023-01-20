/**
 * @name CeL function for MediaWiki (Wikipedia / 维基百科): wikidata
 * 
 * @fileoverview 本档案包含了 MediaWiki 自动化作业用程式库的子程式库。
 * 
 * TODO:<code>

https://www.wikidata.org/wiki/Help:QuickStatements

</code>
 * 
 * @since 2019/10/11 拆分自 CeL.application.net.wiki
 * 
 * @see https://github.com/maxlath/wikibase-sdk
 *      https://github.com/OpenRefine/OpenRefine/wiki/Reconciliation
 */

// More examples: see /_test suite/test.js
// Wikipedia bots demo: https://github.com/kanasimi/wikibot
'use strict';
// 'use asm';

// --------------------------------------------------------------------------------------------

// 不采用 if 陈述式，可以避免 Eclipse JSDoc 与 format 多缩排一层。
typeof CeL === 'function' && CeL.run({
	// module name
	name : 'application.net.wiki.data',

	require : 'data.native.|data.date.' + '|application.net.wiki.'
	// load MediaWiki module basic functions
	+ '|application.net.wiki.namespace.'
	//
	+ '|application.net.wiki.query.|application.net.wiki.page.'
	// wiki_API.edit.check_data()
	+ '|application.net.wiki.edit.'
	// wiki_API.parse.redirect()
	+ '|application.net.wiki.parser.'
	//
	+ '|application.net.Ajax.get_URL',

	// 设定不汇出的子函式。
	no_extend : 'this,*',

	// 为了方便格式化程式码，因此将 module 函式主体另外抽出。
	code : module_code
});

function module_code(library_namespace) {

	// requiring
	var wiki_API = library_namespace.application.net.wiki, KEY_SESSION = wiki_API.KEY_SESSION, KEY_HOST_SESSION = wiki_API.KEY_HOST_SESSION;
	// @inner
	var API_URL_of_options = wiki_API.API_URL_of_options, is_api_and_title = wiki_API.is_api_and_title, is_wikidata_site_nomenclature = wiki_API.is_wikidata_site_nomenclature, language_code_to_site_alias = wiki_API.language_code_to_site_alias;
	var KEY_CORRESPOND_PAGE = wiki_API.KEY_CORRESPOND_PAGE, PATTERN_PROJECT_CODE_i = wiki_API.PATTERN_PROJECT_CODE_i;

	var get_URL = this.r('get_URL');

	var
	/** {Number}未发现之index。 const: 基本上与程式码设计合一，仅表示名义，不可更改。(=== -1) */
	NOT_FOUND = ''.indexOf('_');

	var gettext = library_namespace.cache_gettext(function(_) {
		gettext = _;
	});

	// ------------------------------------------------------------------------

	// 用来取得 entity value 之属性名。 函数 : wikidata_entity_value
	// 为了方便使用，不采用 Symbol()。
	var KEY_get_entity_value = 'value';

	// ------------------------------------------------------------------------

	// 客制化的设定。
	// wikidata_site_alias[site code] = Wikidata site code
	// @see https://www.wikidata.org/w/api.php?action=help&modules=wbeditentity
	// for sites
	var wikidata_site_alias = {
		// 为粤文维基百科特别处理。
		yuewiki : 'zh_yuewiki',

		// 为日文特别修正: 'jp' is wrong!
		jpwiki : 'jawiki'
	};

	function get_data_API_URL(options, default_API_URL) {
		// library_namespace.debug('options:', 0, 'get_data_API_URL');
		// console.trace(options);

		var API_URL = options && options.data_API_URL, session;

		if (API_URL) {
		} else if (wiki_API.is_wiki_API(
		//
		session = wiki_API.session_of_options(options))) {
			if (session.data_session) {
				API_URL = session.data_session.API_URL;
			}
			if (!API_URL && session[KEY_HOST_SESSION]) {
				// is data session. e.g., https://test.wikidata.org/w/api.php
				API_URL = session.API_URL;
			}
			if (!API_URL) {
				// e.g., lingualibre
				API_URL = session.data_API_URL;
			}
		} else {
			API_URL = API_URL_of_options(options);
		}

		if (!API_URL) {
			API_URL = default_API_URL || wikidata_API_URL;
		}

		library_namespace.debug('API_URL: ' + API_URL, 3, 'get_data_API_URL');
		return API_URL;
	}

	// --------------------------------------------------------------------------------------------
	// Wikidata 操作函数
	// https://www.wikidata.org/wiki/Wikidata:Data_access

	/**
	 * @see <code>

	// https://meta.wikimedia.org/wiki/Wikidata/Notes/Inclusion_syntax
	{{label}}, {{Q}}, [[d:Q1]]

	http://wdq.wmflabs.org/api_documentation.html
	https://github.com/maxlath/wikidata-sdk

	</code>
	 * 
	 * @since
	 */

	/**
	 * 测试 value 是否为实体项目 wikidata entity / wikibase-item.
	 * 
	 * is_wikidata_page()
	 * 
	 * @param value
	 *            value to test. 要测试的值。
	 * @param {Boolean}[strict]
	 *            严格检测。
	 * 
	 * @returns {Boolean}value 为实体项目。
	 */
	function is_entity(value, strict) {
		return library_namespace.is_Object(value)
		// {String}id: Q\d+ 或 P\d+。
		&& (strict ? /^[PQ]\d{1,10}$/.test(value.id) : value.id)
		//
		&& library_namespace.is_Object(value.labels);
	}

	/**
	 * API URL of wikidata.<br />
	 * e.g., 'https://www.wikidata.org/w/api.php',
	 * 'https://test.wikidata.org/w/api.php'
	 * 
	 * @type {String}
	 */
	var wikidata_API_URL = wiki_API.api_URL('wikidata');

	/**
	 * Combine ((session)) with Wikidata. 立即性(asynchronous)设定 this.data_session。
	 * 
	 * @param {wiki_API}session
	 *            正作业中之 wiki_API instance。
	 * @param {Function}[callback]
	 *            回调函数。 callback({Array}entity list or {Object}entity or
	 * @param {String}[API_URL]
	 *            language code or API URL of Wikidata
	 * @param {String}[password]
	 *            user password
	 * @param {Boolean}[force]
	 *            无论如何重新设定 this.data_session。
	 * 
	 * @inner
	 */
	function setup_data_session(session, callback, API_URL, password, force) {
		if (force === undefined) {
			if (typeof password === 'boolean') {
				// shift arguments.
				force = password;
				password = null;
			} else if (typeof API_URL === 'boolean' && password === undefined) {
				// shift arguments.
				force = API_URL;
				API_URL = null;
			}
		}

		if (session.data_session && API_URL & !force) {
			return;
		}

		if (session.data_session) {
			library_namespace.debug('直接清空伫列。', 2, 'setup_data_session');
			// TODO: 强制中断所有正在执行之任务。
			session.data_session.actions.clear();
		}

		if (!API_URL
		// https://test.wikipedia.org/w/api.php
		// https://test2.wikipedia.org/w/api.php
		&& /test\d?\.wikipedia/.test(session.API_URL)) {
			API_URL = 'test.wikidata';

		} else if (typeof API_URL === 'string' && !/wikidata/i.test(API_URL)
				&& !PATTERN_PROJECT_CODE_i.test(API_URL)) {
			// e.g., 'test' → 'test.wikidata'
			API_URL += '.wikidata';
		}

		// data_configuration: set Wikidata session
		var data_login_options = {
			user_name : session.token.lgname,
			// wiki.set_data(host session, password)
			password : password || session.token.lgpassword,
			// API_URL: host session
			API_URL : typeof API_URL === 'string' && wiki_API.api_URL(API_URL)
					|| get_data_API_URL(session),
			preserve_password : session.preserve_password
		};
		// console.trace([ data_login_options, session.API_URL ]);
		if (false && data_login_options.API_URL === session.API_URL) {
			// TODO: test
			// e.g., lingualibre
			library_namespace.debug('设定 session 的 data_session 即为本身。', 2,
					'setup_data_session');
			session.data_session = session;
		} else if (data_login_options.user_name && data_login_options.password) {
			session.data_session = wiki_API.login(data_login_options);
		} else {
			// 警告: 可能需要设定 options.is_running
			session.data_session = new wiki_API(data_login_options);
		}

		library_namespace.debug('Setup 宿主 host session.', 2,
				'setup_data_session');
		session.data_session[KEY_HOST_SESSION] = session;
		library_namespace.debug('run callback: ' + callback, 2,
				'setup_data_session');
		session.data_session.run(callback);
	}

	// ------------------------------------------------------------------------

	function normalize_wikidata_key(key) {
		if (typeof key !== 'string') {
			library_namespace.error('normalize_wikidata_key: key: '
					+ JSON.stringify(key));
			// console.trace(key);
			throw new Error('normalize_wikidata_key: key should be string!');
		}
		return key.replace(/_/g, ' ').trim();
	}

	/**
	 * 搜索标签包含特定关键字(label=key)的项目。
	 * 
	 * 此搜索有极大问题:不能自动侦测与转换中文繁简体。 或须转成英语再行搜寻。
	 * 
	 * @example<code>

	CeL.wiki.data.search('宇宙', function(entity) {result=entity;console.log(entity[0]==='Q1');}, {get_id:true});
	CeL.wiki.data.search('宇宙', function(entity) {result=entity;console.log(entity==='Q1');}, {get_id:true, limit:1});
	CeL.wiki.data.search('形状', function(entity) {result=entity;console.log(entity==='P1419');}, {get_id:true, type:'property'});

	</code>
	 * 
	 * @param {String}key
	 *            要搜寻的关键字。item/property title.
	 * @param {Function}[callback]
	 *            回调函数。 callback({Array}entity list or {Object}entity or
	 *            {String}entity id, error)
	 * @param {Object}[options]
	 *            附加参数/设定选择性/特殊功能与选项
	 */
	function wikidata_search(key, callback, options) {
		if (!key) {
			callback(undefined, 'wikidata_search: No key assigned.');
			return;
		}
		if (typeof options === 'function')
			options = {
				filter : options
			};
		else if (typeof options === 'string') {
			options = {
				language : options
			};
		} else {
			// 正规化并提供可随意改变的同内容参数，以避免修改或覆盖附加参数。
			options = library_namespace.new_options(options);
		}

		var language = options.language;
		var type = options.type;
		// console.trace([ key, is_api_and_title(key, 'language') ]);
		if (is_api_and_title(key, 'language')) {
			if (is_wikidata_site_nomenclature(key[0])) {
				wikidata_entity(key, function(entity, error) {
					// console.log(entity);
					var id = !error && entity && entity.id;
					// 预设找不到 sitelink 会作搜寻。
					if (!id && !options.no_search) {
						key = key.clone();
						if (key[0] = key[0].replace(/wiki.*$/, '')) {
							wikidata_search(key, callback, options);
							return;
						}
					}
					callback(id, error);
				}, {
					props : ''
				});
				return;
			}
			// for [ {String}language, {String}key ].type
			if (key.type)
				type = key.type;
			language = key[0];
			key = key[1];
		}

		// console.log('key: ' + key);
		key = normalize_wikidata_key(key);
		language = language || wiki_API.site_name(options, {
			get_all_properties : true
		}).language;

		var action = {
			action : 'wbsearchentities',
			// search. e.g.,
			// https://www.wikidata.org/w/api.php?action=wbsearchentities&search=abc&language=en&utf8=1
			search : key,
			// https://www.wikidata.org/w/api.php?action=help&modules=wbsearchentities
			language : language
		};

		if (options.limit || wikidata_search.default_limit) {
			action.limit = options.limit || wikidata_search.default_limit;
		}

		if (type) {
			// item|property
			// 预设值：item
			action.type = type;
		}

		if (options['continue'] > 0)
			action['continue'] = options['continue'];

		action = [ API_URL_of_options(options) || wikidata_API_URL, action ];

		wiki_API.query(action, function handle_result(data, error) {
			error = wiki_API.query.handle_error(data, error);
			// 检查伺服器回应是否有错误资讯。
			if (error) {
				library_namespace.error('wikidata_search: ' + error);
				callback(data, error);
				return;
			}

			/**
			 * e.g., <code>
			{"searchinfo":{"search":"Universe"},"search":[{"id":"Q1","title":"Q1","pageid":129,"repository":"wikidata","url":"//www.wikidata.org/wiki/Q1","concepturi":"http://www.wikidata.org/entity/Q1","label":"universe","description":"totality consisting of space, time, matter and energy","match":{"type":"label","language":"en","text":"universe"}}],"search-continue":1,"success":1}
			</code>
			 */
			// console.trace(data);
			// console.trace(data.search);
			var list;
			if (!Array.isArray(data.search)) {
				list = [];
			} else if (!('filter' in options)
					|| typeof options.filter === 'function') {
				list = data.search.filter(options.filter ||
				// default filter
				function(item) {
					// 自此结果能得到的资讯有限。
					// label: 'Universe'
					// match: { type: 'label', language: 'zh', text: '宇宙' }
					if (item.match && key.toLowerCase()
					// .trim()
					=== item.match.text.toLowerCase()
					// 通常不会希望取得维基百科消歧义页。
					// @see 'Wikimedia disambiguation page' @
					// [[d:MediaWiki:Gadget-autoEdit.js]]
					&& !/disambiguation|消歧义|消歧义|暧昧さ回避/.test(item.description)) {
						return true;
					}
				});
			}

			if (Array.isArray(options.list)) {
				options.list.push(list);
			} else {
				options.list = [ list ];
			}
			list = options.list;

			if (!options.limit && data['search-continue'] > 0) {
				options['continue'] = data['search-continue'];
				wikidata_search(key, callback, options);
				return;
			}

			if (Array.isArray(list.length) && list.length > 1) {
				// clone list
				list = list.clone();
			} else {
				list = list[0];
			}
			if (options.get_id) {
				list = list.map(function(item) {
					return item.id;
				});
			}
			// multiple pages
			if (!options.multi && (
			// options.limit <= 1
			list.length <= 1)) {
				list = list[0];
			}
			// console.trace(options);
			callback(list);
		}, null, options);
	}

	// wikidata_search_cache[{String}"zh:性质"] = {String}"P31";
	var wikidata_search_cache = {
	// 载于, 出典, source of claim
	// 'en:stated in' : 'P248',
	// 导入自, source
	// 'en:imported from Wikimedia project' : 'P143',
	// 来源网址, website
	// 'en:reference URL' : 'P854',
	// 检索日期
	// 'en:retrieved' : 'P813'
	},
	// entity (Q\d+) 用。
	// 可考量加入 .type (item|property) 为 key 的一部分，
	// 或改成 wikidata_search_cache={item:{},property:{}}。
	wikidata_search_cache_entity = Object.create(null);

	// wikidata_search.default_limit = 'max';

	// TODO: add more types: form, item, lexeme, property, sense, sense
	// https://www.wikidata.org/w/api.php?action=help&modules=wbsearchentities
	wikidata_search.add_cache = function add_cache(key, id, language, is_entity) {
		var cached_hash = is_entity ? wikidata_search_cache_entity
				: wikidata_search_cache;
		language = wiki_API.site_name(language, {
			get_all_properties : true
		}).language;
		cached_hash[language + ':' + key] = id;
	};

	// wrapper function of wikidata_search().
	wikidata_search.use_cache = function use_cache(key, callback, options) {
		if (!options && library_namespace.is_Object(callback)) {
			// shift arguments.
			options = callback;
			callback = undefined;
		}
		// console.trace(options);
		if (options && options.must_callback && !callback) {
			library_namespace.warn('设定 options.must_callback，却无 callback!');
		}

		var language_and_key,
		// 须与 wikidata_search() 相同!
		// TODO: 可以 guess_language(key) 猜测语言。
		language = options && options.language || wiki_API.site_name(options, {
			get_all_properties : true
		}).language,
		// https://www.wikidata.org/w/api.php?action=help&modules=wbsearchentities
		cached_hash = options && options.type && options.type !==
		// default_options.type: 'property'
		wikidata_search.use_cache.default_options.type ? wikidata_search_cache_entity
				: wikidata_search_cache;
		// console.trace([ key, language, options ]);

		key = normalize_value_of_properties(key, language);
		var entity_type = key && key.type;

		if (typeof key === 'string') {
			key = normalize_wikidata_key(key);
			language_and_key = language + ':' + key;

		} else if (Array.isArray(key)) {
			// console.trace(key);
			if (is_api_and_title(key, 'language')) {
				// key.join(':')
				language_and_key = key[0] + ':'
				//
				+ normalize_wikidata_key(key[1]);
			} else {
				// 处理取得多 keys 之 id 的情况。
				var index = 0,
				//
				cache_next_key = function() {
					library_namespace.debug(index + '/' + key.length, 3,
							'use_cache.cache_next_key');
					if (index === key.length) {
						// done. callback(id_list)
						var id_list = key.map(function(k) {
							if (is_api_and_title(k, 'language')) {
								return cached_hash[k[0] + ':'
								//
								+ normalize_wikidata_key(k[1])];
							}
							k = normalize_wikidata_key(k);
							return cached_hash[language + ':' + k];
						});
						// console.trace(id_list);
						callback(id_list);
						return;
					}
					// console.trace(options);
					wikidata_search.use_cache(key[index++], cache_next_key,
					//
					Object.assign({
						API_URL : get_data_API_URL(options)
					}, wikidata_search.use_cache.default_options, {
						// 警告: 若是设定 must_callback=false，会造成程序不 callback 而中途跳出!
						must_callback : true
					}, options));
				};
				cache_next_key();
				return;
			}

		} else {
			// 避免若是未match is_api_and_title(key, 'language')，
			// 可能导致 infinite loop!
			key = 'wikidata_search.use_cache: Invalid key: [' + key + ']';
			// console.warn(key);
			callback(undefined, key);
			return;
		}
		library_namespace.debug('search '
				+ (language_and_key || JSON.stringify(key)) + ' ('
				+ is_api_and_title(key, 'language') + ')', 4,
				'wikidata_search.use_cache');

		if ((!options || !options.force)
		// TODO: key 可能是 [ language code, labels|aliases ] 之类。
		// &&language_and_key
		&& (language_and_key in cached_hash)) {
			library_namespace.debug('has cache: [' + language_and_key + '] → '
					+ cached_hash[language_and_key], 4,
					'wikidata_search.use_cache');
			key = cached_hash[language_and_key];

			if (/^[PQ]\d{1,10}$/.test(key)) {
			}
			if (options && options.must_callback) {
				callback(key);
				return;
			} else {
				// 只在有 cache 时才即刻回传。
				return key;
			}
		}

		if (!options || library_namespace.is_empty_object(options)) {
			options = Object.clone(wikidata_search.use_cache.default_options);
		} else if (!options.get_id) {
			if (!options.must_callback) {
				// 在仅设定 .must_callback 时，不显示警告而自动补上应有的设定。
				library_namespace.warn('wikidata_search.use_cache: 当把实体名称 ['
						+ language_and_key
						+ '] 转换成 id 时，应设定 options.get_id。 options: '
						+ JSON.stringify(options));
			}
			options = Object.assign({
				get_id : true
			}, options);
		} else if (entity_type) {
			options = Object.clone(options);
		}

		if (entity_type)
			options.type = entity_type;

		// console.log(arguments);
		wikidata_search(key, function(id, error) {
			// console.log(language_and_key + ': ' + id);
			// console.trace(options.search_without_cache);
			if (!id) {
				library_namespace
						.error('wikidata_search.use_cache: Nothing found: ['
								+ language_and_key + ']');
				// console.log(options);
				// console.trace('wikidata_search.use_cache: Nothing found');

			} else if (!options.search_without_cache && typeof id === 'string'
					&& /^[PQ]\d{1,10}$/.test(id)) {
				library_namespace.info('wikidata_search.use_cache: cache '
				// 搜寻此类型的实体。 预设值：item
				+ (options && options.type || 'item')
				//
				+ ' [' + language_and_key + '] → ' + id);
			}
			if (!options.search_without_cache) {
				// 即使有错误，依然做 cache 纪录，避免重复侦测操作。
				cached_hash[language_and_key] = id;
			}
			// console.trace([ language_and_key, id ]);

			// console.trace('' + callback);
			if (callback)
				callback(id, error);
		}, options);
	};

	// default options passed to wikidata_search()
	wikidata_search.use_cache.default_options = {
		// 若有必要用上 options.API_URL，应在个别操作内设定。

		// 通常 property 才值得使用 cache。
		// entity 可采用 'item'
		// https://www.wikidata.org/w/api.php?action=help&modules=wbsearchentities
		type : 'property',
		// limit : 1,
		get_id : true
	};

	// ------------------------------------------------------------------------

	/**
	 * {Array}时间精度(精密度)单位。
	 * 
	 * 注意：须配合 index_precision @ CeL.data.date！
	 * 
	 * @see https://doc.wikimedia.org/Wikibase/master/php/md_docs_topics_json.html#json_datavalues_time
	 */
	var time_unit = 'gigayear,100 megayear,10 megayear,megayear,100 kiloyear,10 kiloyear,millennium,century,decade,year,month,day,hour,minute,second,microsecond'
			.split(','),
	// 精密度至日: 11。
	INDEX_OF_PRECISION = time_unit.to_hash();
	// 千纪: 一千年, https://en.wikipedia.org/wiki/Kyr
	time_unit.zh = '十亿年,亿年,千万年,百万年,十万年,万年,千纪,世纪,年代,年,月,日,时,分,秒,毫秒,微秒,纳秒'
			.split(',');

	/**
	 * 将时间转为字串。
	 * 
	 * @inner
	 */
	function time_toString() {
		var unit = this.unit;
		if (this.power) {
			unit = Math.abs(this[0]) + unit[0];
			return this.power > 1e4 ? unit + (this[0] < 0 ? '前' : '后')
			//
			: (this[0] < 0 ? '前' : '') + unit;
		}

		return this.map(function(value, index) {
			return value + unit[index];
		}).join('');
	}

	/**
	 * 将经纬度座标转为字串。
	 * 
	 * @inner
	 */
	function coordinate_toString(type) {
		// 经纬度座标 coordinates [ latitude 纬度, longitude 经度 ]
		return Marh.abs(this[0]) + ' ' + (this[0] < 0 ? 'S' : 'N')
		//
		+ ', ' + Marh.abs(this[1]) + ' ' + (this[1] < 0 ? 'W' : 'E');
	}

	// https://www.wikidata.org/wiki/Help:Statements
	// https://www.mediawiki.org/wiki/Wikibase/DataModel#Statements
	// statement = claim + rank + references
	// claim = snak + qualifiers
	// snak: data type + value

	/**
	 * 将特定的属性值转为 JavaScript 的物件。
	 * 
	 * @param {Object}data
	 *            从Wikidata所得到的属性值。
	 * @param {Function}[callback]
	 *            回调函数。 callback(转成JavaScript的值)
	 * @param {Object}[options]
	 *            附加参数/设定选择性/特殊功能与选项
	 * 
	 * @returns 转成JavaScript的值。
	 * 
	 * @see https://www.mediawiki.org/wiki/Wikibase/API#wbformatvalue
	 *      https://www.mediawiki.org/wiki/Wikibase/DataModel/JSON#Claims_and_Statements
	 *      https://www.mediawiki.org/wiki/Wikibase/API
	 *      https://www.mediawiki.org/wiki/Wikibase/Indexing/RDF_Dump_Format#Value_representation
	 *      https://www.wikidata.org/wiki/Special:ListDatatypes
	 */
	function wikidata_datavalue(data, callback, options) {
		// console.log(data);
		// console.log(JSON.stringify(data));
		if (library_namespace.is_Object(callback) && !options) {
			// shift arguments.
			options = callback;
			callback = undefined;
		}

		// 正规化并提供可随意改变的同内容参数，以避免修改或覆盖附加参数。
		options = library_namespace.new_options(options);

		callback = typeof callback === 'function' && callback;

		var value = options.multi && !Array.isArray(data) ? [ data ] : data;

		if (Array.isArray(value)) {
			if (!options.single) {
				if (options.multi) {
					delete options.multi;
				}
				// TODO: array + ('numeric-id' in value)
				// TODO: using Promise.allSettled([])
				if (callback) {
					// console.log(value);
					value.run_parallel(function(run_next, item, index) {
						// console.log([ index, item ]);
						wikidata_datavalue(item, function(v, error) {
							// console.log([ index, v ]);
							value[index] = v;
							run_next();
						}, options);
					}, function() {
						callback(value);
					});
				}
				return value.map(function(v) {
					return wikidata_datavalue(v, undefined, options);
				});
			}

			// 选择推荐值/最佳等级。
			var first;
			if (value.every(function(v) {
				if (!v) {
					return true;
				}
				if (v.rank !== 'preferred') {
					if (!first) {
						first = v;
					}
					return true;
				}
				// TODO: check v.mainsnak.datavalue.value.language
				value = v;
				// return false;
			})) {
				// 没有推荐值，选择首个非空的值。
				value = first;
			}
		}

		if (is_entity(value)) {
			// get label of entity
			value = value.labels;
			var language = wiki_API.site_name(options, {
				get_all_properties : true
			}).language;
			language = language && value[language] || value[wiki_API.language]
			// 最起码选个国际通用的。
			|| value.en;
			if (!language) {
				// 随便挑一个语言的 label。
				for (language in value) {
					value = value[language];
					break;
				}
			}
			return value.value;
		}

		if (!value) {
			callback && callback(value);
			return value;
		}

		// TODO: value.qualifiers, value['qualifiers-order']
		// TODO: value.references
		value = value.mainsnak || value;
		if (value) {
			// console.log(value);
			// console.log(JSON.stringify(value));

			// 与 normalize_wikidata_value() 须同步!
			if (value.snaktype === 'novalue') {
				value = null;
				callback && callback(value);
				return value;
			}
			if (value.snaktype === 'somevalue') {
				// e.g., [[Q1]], Property:P1419 形状
				// Property:P805 主条目
				if (callback && data.qualifiers
						&& Array.isArray(value = data.qualifiers.P805)) {
					if (value.length === 1) {
						value = value[0];
					}
					delete options[library_namespace.new_options.new_key];
					// console.log(value);
					wikidata_datavalue(value, callback, options);
					return;
				}
				value = wikidata_edit.somevalue;
				callback && callback(value);
				return value;
			}
		}
		// assert: value.snaktype === 'value'
		value = value.datavalue || value;

		var type = value.type;
		// TODO: type 可能为 undefined!

		if ('value' in value) {
			if (type === 'literal'
			// e.g., SPARQL: get ?linkcount of:
			// ?item wikibase:sitelinks ?linkcount
			&& value.datatype === 'http://www.w3.org/2001/XMLSchema#integer') {
				// assert: typeof value.value === 'string'
				// Math.floor()
				value = +value.value;
			} else {
				value = value.value;
			}
		}

		if (typeof value !== 'object') {
			// e.g., typeof value === 'string'
			callback && callback(value);
			return value;
		}

		if ('text' in value) {
			// e.g., { text: 'Ὅμηρος', language: 'grc' }
			value = value.text;
			callback && callback(value);
			return value;
		}

		if ('amount' in value) {
			// qualifiers 纯量数值
			value = +value.amount;
			callback && callback(value);
			return value;
		}

		if ('latitude' in value) {
			// 经纬度座标 coordinates [ latitude 纬度, longitude 经度 ]
			var coordinate = [ value.latitude, value.longitude ];
			if (false) {
				// geodetic reference system, 大地座标系/坐标系统测量基准
				var system = value.globe.match(/[^\\\/]+$/);
				system = system && system[0];
				switch (system) {
				case 'Q2':
					coordinate.system = 'Earth';
					break;
				case 'Q11902211':
					coordinate.system = 'WGS84';
					break;
				case 'Q215848':
					coordinate.system = 'WGS';
					break;
				case 'Q1378064':
					coordinate.system = 'ED50';
					break;
				default:
					if (system)
						coordinate.system = system;
					else
						// invalid data?
						;
				}
			}
			// TODO: precision
			coordinate.precision = value.precision;
			coordinate.toString = coordinate_toString;
			value = coordinate;
			callback && callback(value);
			return value;
		}

		if ('time' in value) {
			// date & time. 时间日期
			var matched, year, precision = value.precision;
			// console.trace([ value, precision ]);

			if (precision <= INDEX_OF_PRECISION.year) {
				// 时间尺度为1年以上
				matched = value.time.match(/^[+\-]\d+/);
				year = +matched[0];
				var power = Math.pow(10, INDEX_OF_PRECISION.year - precision);
				matched = [ year / power | 0 ];
				matched.unit = [ time_unit.zh[precision] ];
				matched.power = power;

			} else {
				// 时间尺度为不到一年
				matched = value.time.match(
				// [ all, Y, m, d, H, M, S ]
				/^([+\-]\d+)-(\d+)-(\d+)T(\d+):(\d+):(\d+)Z$/);
				matched = matched.slice(1, precision -
				// +1: is length, not index
				// +1: year starts from 1.
				INDEX_OF_PRECISION.year + 1 + 1).map(function(value) {
					return +value;
				});
				year = matched[0];
				matched.unit = time_unit.zh.slice(INDEX_OF_PRECISION.year,
						precision + 1);
			}

			// proleptic Gregorian calendar:
			// http://www.wikidata.org/entity/Q1985727
			// proleptic Julian calendar:
			// http://www.wikidata.org/entity/Q1985786
			var type = value.calendarmodel.match(/[^\\\/]+$/);
			if (type && type[0] === 'Q1985786') {
				matched.Julian = true;
				// matched.type = 'Julian';
			} else if (type && type === 'Q1985727') {
				// matched.type = 'Gregorian';
			} else {
				// matched.type = type || value.calendarmodel;
			}

			var Julian_day;
			if (year >= -4716
			//
			&& (Julian_day = library_namespace.Julian_day)) {
				// start JDN
				matched.JD = Julian_day.from_YMD(year, matched[1], matched[2],
						!matched.Julian);
			}
			matched.toString = time_toString;
			// console.trace([ matched, value, precision ]);
			callback && callback(matched);
			return matched;
		}

		if ('numeric-id' in value) {
			// wikidata entity. 实体
			value = 'Q' + value['numeric-id'];
			if (callback) {
				library_namespace.debug('Trying to get entity ' + value, 1,
						'wikidata_datavalue');
				// console.log(value);
				// console.log(wiki_API.site_name(options,{get_all_properties:true}).language);
				wikidata_entity(value, options.get_object ? callback
				// default: get label 标签标题
				: function(entity, error) {
					// console.log([ entity, error ]);
					if (error) {
						library_namespace.debug(
								'Failed to get entity ' + value, 0,
								'wikidata_datavalue');
						callback && callback(undefined, error);
						return;
					}
					entity = entity.labels || entity;
					entity = entity[wiki_API.site_name(options, {
						get_all_properties : true
					}).language] || entity;
					callback
							&& callback('value' in entity ? entity.value
									: entity);
				}, {
					languages : wiki_API.site_name(options, {
						get_all_properties : true
					}).language
				});
			}
			return value;
		}

		library_namespace.warn('wikidata_datavalue: 尚无法处理此属性: [' + type
				+ ']，请修改本函数。');
		callback && callback(value);
		return value;
	}

	// 取得value在property_list中的index。相当于 property_list.indexOf(value)
	// type=-1: list.lastIndexOf(value), type=1: list.includes(value),
	// other type: list.indexOf(value)
	wikidata_datavalue.get_index = function(property_list, value, type) {
		function to_comparable(value) {
			if (Array.isArray(value) && value.JD) {
				// e.g., new Date('2000-1-1 UTC+0')
				var date = new Date(value.join('-') + ' UTC+0');
				if (isNaN(date.getTime())) {
					library_namespace
							.error('wikidata_datavalue.get_index: Invalid Date: '
									+ value);
				}
				value = date;
			}
			// e.g., library_namespace.is_Date(value)
			return typeof value === 'object' ? JSON.stringify(value) : value;
		}

		property_list = wikidata_datavalue(property_list, undefined, {
			// multiple
			multi : true
		}).map(to_comparable);

		value = to_comparable(value && value.datavalue ? wikidata_datavalue(value)
				: value);

		if (!isNaN(value) && property_list.every(function(v) {
			return typeof v === 'number';
		})) {
			value = +value;
		}

		// console.log([ value, property_list ]);

		if (type === 0) {
			return [ property_list, value ];
		}
		if (type === 1) {
			return property_list.includes(value);
		}
		if (type === -1) {
			return property_list.lastIndexOf(value);
		}
		return property_list.indexOf(value);
	};

	// ------------------------------------------------------------------------

	/**
	 * get label of entity. 取得指定实体的标签。
	 * 
	 * CeL.wiki.data.label_of()
	 * 
	 * @param {Object}entity
	 *            指定实体。
	 * @param {String}[language]
	 *            指定取得此语言之资料。
	 * @param {Boolean}[use_title]
	 *            当没有标签的时候，使用各语言连结标题。
	 * @param {Boolean}[get_labels]
	 *            取得所有标签。
	 * 
	 * @returns {String|Array}标签。
	 */
	function get_entity_label(entity, language, use_title, get_labels) {
		if (get_labels) {
			if (use_title) {
				use_title = get_entity_link(entity, language);
				if (!Array.isArray(use_title))
					use_title = use_title ? [ use_title ] : [];
			}
			return entity_labels_and_aliases(entity, language, use_title);
		}

		var labels = entity && entity.labels;
		if (labels) {
			var label = labels[language || wiki_API.language];
			if (label)
				return label.value;
			if (!language)
				return labels;
		}

		if (use_title) {
			return get_entity_link(entity, language);
		}
	}

	/**
	 * get site link of entity. 取得指定实体的语言连结标题。
	 * 
	 * CeL.wiki.data.title_of(entity, language)
	 * 
	 * @param {Object}entity
	 *            指定实体。
	 * @param {String}[language]
	 *            指定取得此语言之资料。
	 * 
	 * @returns {String}语言标题。
	 */
	function get_entity_link(entity, language) {
		var sitelinks = entity && entity.sitelinks;
		if (sitelinks) {
			var link = sitelinks[wiki_API.site_name(language)];
			if (link) {
				return link.title;
			}
			if (!language) {
				link = [];
				for (language in sitelinks) {
					link.push(sitelinks[language].title);
				}
				return link;
			}
		}
	}

	// https://www.wikidata.org/w/api.php?action=help&modules=wbgetentities
	// Maximum number of values is 50
	var MAX_ENTITIES_TO_GET = 50;

	/**
	 * 取得特定实体的特定属性值。
	 * 
	 * @example<code>

	CeL.wiki.data('Q1', function(entity) {result=entity;});
	CeL.wiki.data('Q2', function(entity) {result=entity;console.log(JSON.stringify(entity).slice(0,400));});
	CeL.wiki.data('Q1', function(entity) {console.log(entity.id==='Q1'&&JSON.stringify(entity.labels)==='{"zh":{"language":"zh","value":"宇宙"}}');}, {languages:'zh'});
	CeL.wiki.data('Q1', function(entity) {console.log(entity.labels['en'].value+': '+entity.labels['zh'].value==='universe: 宇宙');});
	// Get the property of wikidata entity.
	// 取得Wikidata中指定实体项目的指定属性/陈述。
	CeL.wiki.data('Q1', function(entity) {console.log(entity['en'].value+': '+entity['zh'].value==='universe: 宇宙');}, 'labels');
	// { id: 'P1', missing: '' }
	CeL.wiki.data('Q1|P1', function(entity) {console.log(JSON.stringify(entity[1])==='{"id":"P1","missing":""}');});
	CeL.wiki.data(['Q1','P1'], function(entity) {console.log(entity);});

	CeL.wiki.data('Q11188', function(entity) {result=entity;console.log(JSON.stringify(entity.labels.zh)==='{"language":"zh","value":"世界人口"}');});

	CeL.wiki.data('P6', function(entity) {result=entity;console.log(JSON.stringify(entity.labels.zh)==='{"language":"zh","value":"政府首长"');});

	CeL.wiki.data('宇宙', '形状', function(entity) {result=entity;console.log(entity==='宇宙的形状');})
	CeL.wiki.data('荷马', '出生日期', function(entity) {result=entity;console.log(''+entity==='前8世纪');})
	CeL.wiki.data('荷马', function(entity) {result=entity;console.log(CeL.wiki.entity.value_of(entity.claims.P1477)==='Ὅμηρος');})
	CeL.wiki.data('艾萨克·牛顿', '出生日期', function(entity) {result=entity;console.log(''+entity==='1643年1月4日,1642年12月25日');})

	// 实体项目值的链接数据界面 (无法筛选所要资料，传输量较大。)
	// 非即时资料!
	CeL.get_URL('https://www.wikidata.org/wiki/Special:EntityData/Q1.json',function(r){r=JSON.parse(r.responseText);console.log(r.entities.Q1.labels.zh.value)})

	// ------------------------------------------------------------------------

	wiki = CeL.wiki.login(user_name, pw, 'wikidata');
	wiki.data(id, function(entity){}, {is_key:true}).edit_data(function(entity){});
	wiki.page('title').data(function(entity){}, options).edit_data().edit()

	wiki = Wiki(true)
	wiki.page('宇宙').data(function(entity){result=entity;console.log(entity);})

	wiki = Wiki(true, 'wikidata');
	wiki.data('宇宙', function(entity){result=entity;console.log(entity.labels['en'].value==='universe');})
	wiki.data('宇宙', '形状', function(entity){result=entity;console.log(entity==='宇宙的形状');})
	wiki.query('CLAIM[31:14827288] AND CLAIM[31:593744]', function(entity) {result=entity;console.log(entity.labels['zh-tw'].value==='维基资料');})

	</code>
	 * 
	 * @param {String|Array}key
	 *            entity id. 欲取得之特定实体 id。 e.g., 'Q1', 'P6'
	 * @param {String}[property]
	 *            取得特定属性值。
	 * @param {Function}[callback]
	 *            回调函数。 callback(转成JavaScript的值, error)
	 * @param {Object}[options]
	 *            附加参数/设定选择性/特殊功能与选项
	 * 
	 * @see https://www.mediawiki.org/wiki/Wikibase/DataModel/JSON
	 * @see https://www.wikidata.org/w/api.php?action=help&modules=wbgetentities
	 */
	function wikidata_entity(key, property, callback, options) {
		if (typeof property === 'function' && !options) {
			// shift arguments.
			options = callback;
			callback = property;
			property = null;
		}

		if (typeof options === 'string') {
			options = {
				props : options
			};
		} else if (typeof options === 'function') {
			options = {
				filter : options
			};
		} else {
			// 正规化并提供可随意改变的同内容参数，以避免修改或覆盖附加参数。
			options = library_namespace.new_options(options);
		}

		var API_URL = get_data_API_URL(options);

		// ----------------------------
		// convert property: title to id
		if (typeof property === 'string' && !/^P\d{1,5}$/.test(property)) {
			if (library_namespace.is_debug(2)
					&& /^(?:(?:info|sitelinks|sitelinks\/urls|aliases|labels|descriptions|claims|datatype)\|)+$/
							.test(property + '|'))
				library_namespace.warn(
				//
				'wikidata_entity: 您或许该采用 options.props = ' + property);
			/** {String}setup language of key and property name. 仅在需要 search 时使用。 */
			property = [ wiki_API.site_name(options, {
				get_all_properties : true
			}).language, property ];
		}

		// console.log('property: ' + property);
		if (is_api_and_title(property, 'language')) {
			// TODO: property 可能是 [ language code, 'labels|aliases' ] 之类。
			property = wikidata_search.use_cache(property, function(id, error) {
				wikidata_entity(key, id, callback, options);
			}, options);
			if (!property) {
				// assert: property === undefined
				// Waiting for conversion.
				return;
			}
		}

		// ----------------------------
		// convert key: title to id
		if (typeof key === 'number') {
			key = [ key ];
		} else if (typeof key === 'string'
				&& !/^[PQ]\d{1,10}(\|[PQ]\d{1,10})*$/.test(key)) {
			/** {String}setup language of key and property name. 仅在需要 search 时使用。 */
			key = [ wiki_API.site_name(options, {
				get_all_properties : true
			}).language, key ];
		}

		if (Array.isArray(key)) {
			if (is_api_and_title(key)) {
				if (is_wikidata_site_nomenclature(key[0])) {
					key = {
						site : key[0],
						title : key[1]
					};

				} else {
					wikidata_search(key, function(id) {
						// console.trace(id);
						if (id) {
							library_namespace.debug(
							//
							'entity ' + id + ' ← [[:' + key.join(':') + ']]',
									1, 'wikidata_entity');
							wikidata_entity(id, property, callback, options);
							return;
						}

						// 可能为重定向页面？
						// 例如要求 "A of B" 而无此项，
						// 但 [[en:A of B]]→[[en:A]] 且存在 "A"，则会回传本"A"项。
						wiki_API.page(key.clone(), function(page_data) {
							var content = wiki_API.content_of(page_data),
							// 测试检查是否为重定向页面。
							redirect = wiki_API.parse.redirect(content);
							if (redirect) {
								library_namespace.info(
								//
								'wikidata_entity: 处理重定向页面: [[:' + key.join(':')
										+ ']] → [[:' + key[0] + ':' + redirect
										+ ']]。');
								wikidata_entity([ key[0],
								// wiki_API.normalize_title():
								// 此 API 无法自动转换首字大小写之类！因此需要自行正规化。
								wiki_API.normalize_title(redirect) ], property,
										callback, options);
								return;
							}

							library_namespace.error(
							//
							'wikidata_entity: Wikidata 不存在/已删除 [[:'
									+ key.join(':') + ']] 之数据，'
									+ (content ? '但' : '且无法取得/不')
									+ '存在此 Wikipedia 页面。无法处理此 Wikidata 数据要求。');
							callback(undefined, 'no_key');
						});

					}, Object.assign({
						API_URL : API_URL,
						get_id : true,
						limit : 1
					}, options));
					// Waiting for conversion.
					return;
				}

			} else if (key.length > MAX_ENTITIES_TO_GET) {
				if (!key.not_original) {
					key = key.clone();
					key.not_original = true;
				}
				var result, _error;
				var get_next_slice = function get_next_slice() {
					library_namespace.info('wikidata_entity: ' + key.length
							+ ' items left...');
					wikidata_entity(key.splice(0, MAX_ENTITIES_TO_GET),
					//
					property, function(entities, error) {
						// console.log(Object.keys(entities));
						if (result)
							Object.assign(result, entities);
						else
							result = entities;
						_error = error || _error;
						if (key.length > 0) {
							get_next_slice();
						} else {
							callback(result, _error);
						}
					}, options);
				}
				get_next_slice();
				return;

			} else {
				key = key.map(function(id) {
					if (/^[PQ]\d{1,10}$/.test(id))
						return id;
					if (library_namespace.is_digits(id))
						return 'Q' + id;
					library_namespace.warn(
					//
					'wikidata_entity: Invalid id: ' + id);
					return '';
				}).join('|');
			}
		}

		// ----------------------------

		if (!key || library_namespace.is_empty_object(key)) {
			library_namespace.error('wikidata_entity: 未设定欲取得之特定实体 id。');
			callback(undefined, 'no_key');
			return;
		}

		// 实体项目 entity
		// https://www.wikidata.org/w/api.php?action=wbgetentities&ids=Q1&props=labels&utf8=1
		// TODO: claim/声明/属性/分类/陈述/statement
		// https://www.wikidata.org/w/api.php?action=wbgetclaims&ids=P1&props=claims&utf8=1
		// TODO: 维基百科 sitelinks
		// https://www.wikidata.org/w/api.php?action=wbgetentities&ids=Q1&props=sitelinks&utf8=1
		var action;
		// 不采用 wiki_API.is_page_data(key)
		// 以允许自行设定 {title:title,language:language}。
		// console.trace(key);
		if (key.title) {
			if (false) {
				console.trace([ key.site,
						wiki_API.site_name(key.language, options), key ]);
			}
			action = 'sites=' + (key.site ||
			// 在 options 包含之 wiki session 中之 key.language。
			// e.g., "cz:" 在 zhwiki 将转为 cs.wikipedia.org
			wiki_API.site_name(key.language, options)) + '&titles='
					+ encodeURIComponent(key.title);
		} else {
			if (typeof key === 'object') {
				console.trace(key);
				callback(undefined,
						'wikidata_entity: Input object instead of string');
				return;
			}
			action = 'ids=' + key;
		}
		library_namespace.debug('action: [' + action + ']', 2,
				'wikidata_entity');
		// https://www.wikidata.org/w/api.php?action=help&modules=wbgetentities
		action = [ API_URL, 'action=wbgetentities&' + action ];

		if (property && !('props' in options)) {
			options.props = 'claims';
		}
		var props = options.props;
		if (Array.isArray(props)) {
			props = props.join('|');
		}
		if (wiki_API.is_page_data(key) && typeof props === 'string') {
			// for data.lastrevid
			if (!props) {
				props = 'info';
			} else if (!/(?:^|\|)info(?:$|\|)/.test(props)) {
				props += '|info';
			}
		}
		// 可接受 "props=" (空 props)。
		if (props || props === '') {
			// retrieve properties. 仅撷取这些属性。
			action[1] += '&props=' + props;
			if (props.includes('|')) {
				// 对于多种属性，不特别取之。
				props = null;
			}
		}
		if (options.languages) {
			// retrieve languages, language to callback. 仅撷取这些语言。
			action[1] += '&languages=' + options.languages;
		}
		// console.log(options);
		// console.log(action);
		// console.trace([ key, arguments, action ]);
		// console.log(wiki_API.session_of_options(options));

		// library_namespace.log('wikidata_entity: API_URL: ' + API_URL);
		// library_namespace.log('wikidata_entity: action: ' + action);
		var _arguments = arguments;
		// TODO:
		wiki_API.query(action, function handle_result(data, error) {
			error = wiki_API.query.handle_error(data, error);
			// 检查伺服器回应是否有错误资讯。
			if (error) {
				if (error.code === 'param-missing') {
					library_namespace.error(
					/**
					 * 可能是错把 "category" 之类当作 sites name??
					 * 
					 * wikidata_entity: [param-missing] A parameter that is
					 * required was missing. (Either provide the item "ids" or
					 * pairs of "sites" and "titles" for corresponding pages)
					 */
					'wikidata_entity: 未设定欲取得之特定实体 id。请确定您的要求，尤其是 sites 存在: '
							+ decodeURI(action[0]));
				} else {
					library_namespace.error('wikidata_entity: ' + error);
				}
				callback(data, error);
				return;
			}

			// assert: library_namespace.is_Object(data):
			// {entities:{Q1:{pageid:129,lastrevid:0,id:'P1',labels:{},claims:{},...},P1:{id:'P1',missing:''}},success:1}
			// @see https://www.mediawiki.org/wiki/Wikibase/DataModel/JSON
			// @see https://www.wikidata.org/wiki/Special:ListDatatypes
			if (data && data.entities) {
				data = data.entities;
				var list = [];
				for ( var id in data) {
					list.push(data[id]);
				}
				data = list;
				if (data.length === 1) {
					data = data[0];
					if (props && (props in data)) {
						data = data[props];
					} else {
						if (wiki_API.is_page_data(key)) {
							library_namespace.debug('id - ' + data.id
									+ ' 对应页面: ' + wiki_API.title_link_of(key),
									1, 'wikidata_entity');
							data[KEY_CORRESPOND_PAGE] = key;
							if (false && !data.lastrevid) {
								library_namespace
										.log('wikidata_entity: action: '
												+ action);
								console.trace(_arguments);
							}
						}
						// assert: KEY_get_entity_value, KEY_SESSION
						// is NOT in data
						Object.defineProperty(data, KEY_get_entity_value, {
							value : wikidata_entity_value
						});
						if (options && options[KEY_SESSION]) {
							// for .resolve_item
							data[KEY_SESSION] = options[KEY_SESSION];
						}
					}
				}
			}

			if (property && data) {
				property = (data.claims
				// session.structured_data()
				// [[commons:Commons:Structured data]]
				|| data.statements || data)[property];
			}
			if (property) {
				wikidata_datavalue(property, callback, options);
			} else {
				callback(data);
			}
		}, null, options);
	}

	/**
	 * 取得特定属性值。
	 * 
	 * @param {String}[property]
	 *            取得特定属性值。
	 * @param {Object}[options]
	 *            附加参数/设定选择性/特殊功能与选项
	 * @param {Function}[callback]
	 *            回调函数。 callback(转成JavaScript的值)
	 * 
	 * @returns 属性的值
	 * 
	 * @inner
	 */
	function wikidata_entity_value(property, options, callback) {
		if (Array.isArray(property)) {
			// e.g., entity.value(['property','property'])
			var property_list = property;
			property = Object.create(null);
			property_list.forEach(function(key) {
				property[key] = null;
			});
		}
		if (library_namespace.is_Object(property)) {
			// e.g., entity.value({'property':'language'})
			if (callback) {
				;
			}
			// TODO: for callback
			for ( var key in property) {
				var _options = property[key];
				if (typeof _options === 'string'
						&& PATTERN_PROJECT_CODE_i.test(_options)) {
					_options = Object.assign({
						language : _options.toLowerCase()
					}, options);
				} else {
					_options = options;
				}
				property[key] = wikidata_entity_value.call(this, key, _options);
			}
			return property;
		}

		var value, language = wiki_API.site_name(options, {
			get_all_properties : true
		}).language, matched = typeof property === 'string'
				&& property.match(/^P(\d+)$/i);

		if (matched) {
			property = +matched[1];
		}

		if (property === 'label') {
			value = this.labels && this.labels[language];
		} else if (property === 'alias') {
			value = this.aliases && this.aliases[language];
		} else if (property === 'sitelink') {
			value = this.sitelinks && this.sitelinks[language];
		} else if (typeof property === 'number') {
			value = this.claims && this.claims['P' + property];
		} else if (value = wikidata_search.use_cache(property, Object.assign({
			type : 'property'
		}, options))) {
			// 一般 property
			value = this.claims && this.claims[value];
		} else {
			library_namespace
					.error('wikidata_entity_value: Cannot deal with property ['
							+ property + ']');
			return;
		}

		if (options && options.resolve_item) {
			value = wikidata_datavalue(value);
			if (Array.isArray(value)) {
				// 有的时候因为操作错误，所以会有相同的属性值。但是这一种情况应该要更正原资料。
				// value = value.unique();
			}
			this[KEY_SESSION][KEY_HOST_SESSION].data(value, callback);
			return value;
		}

		return wikidata_datavalue(value, callback, options);
	}

	// ------------------------------------------------------------------------

	// test if is Q4167410: Wikimedia disambiguation page 维基媒体消歧义页
	// [[Special:链接到消歧义页的页面]]: 页面内容含有 __DISAMBIG__ (或别名) 标签会被作为消歧义页面。
	// CeL.wiki.data.is_DAB(entity)
	function is_DAB(entity, callback) {
		var property = entity && entity.claims && entity.claims.P31;
		var entity_is_DAB = property ? wikidata_datavalue(property) === 'Q4167410'
				//
				: entity
						&& /\((?:disambiguation|消歧义|消歧义|暧昧さ回避)\)$/
								.test(typeof entity === 'string' ? entity
										: entity.title);

		// wikidata 的 item 或 Q4167410 需要手动加入，非自动连结。
		// 因此不能光靠 Q4167410 准确判定是否为消歧义页。其他属性相同。
		// 准确判定得自行检查原维基之资讯，例如检查 action=query&prop=info。

		// 基本上只有 Q(entity, 可连结 wikipedia page) 与 P(entity 的属性) 之分。
		// 再把各 wikipedia page 手动加入 entity 之 sitelink。

		// TODO: 检查 __DISAMBIG__ page property

		// TODO: 检查 [[Category:All disambiguation pages]]

		// TODO: 检查标题是否有 "(消歧义)" 之类。

		// TODO: 检查
		// https://en.wikipedia.org/w/api.php?action=query&titles=title&prop=pageprops
		// 看看是否 ('disambiguation' in page_data.pageprops)；
		// 这方法即使在 wikipedia 没 entity 时依然有效。

		if (callback) {
			callback(entity_is_DAB, entity);
		}
		return entity_is_DAB;
	}

	// ------------------------------------------------------------------------

	// TODO: 自 root 开始寻找所有的 property
	function property_tree(root, property, callback, options) {
		if (typeof options === 'string') {
			options = {
				retrieve : options
			};
		} else {
			options = library_namespace.setup_options(options);
		}

		var entity_now = root,
		// 撷取具有代表性的特性。 label/sitelink/property/entity
		retrieve = options.retrieve || 'label',
		//
		tree = [];

		function next_entity() {
			wikidata_entity(entity_now, function(data, error) {
				;
			});
		}

		next_entity();
	}

	// ------------------------------------------------------------------------

	// export 导出.
	Object.assign(wikidata_entity, {
		search : wikidata_search,
		// 标签
		label_of : get_entity_label,
		// 标题
		title_of : get_entity_link,
		value_of : wikidata_datavalue,
		is_DAB : is_DAB,

		// CeL.wiki.data.include_label()
		include_label : include_label
	});

	// ------------------------------------------------------------------------

	// P143 (导入自, 'imported from Wikimedia project') for bot, P248 (载于, stated
	// in) for humans
	// + 来源网址 (P854) reference URL
	// + 检索日期 (P813) retrieved date

	// @see wikidata_search_cache
	// wikidata_datatype_cache.P31 = {String}datatype of P31;
	var wikidata_datatype_cache = Object.create(null);

	// callback(datatype of property, error)
	function wikidata_datatype(property, callback, options) {
		if (is_api_and_title(property, 'language')) {
			property = wikidata_search.use_cache(property, function(id, error) {
				wikidata_datatype(id, callback, options);
			}, Object.assign(Object.create(null),
					wikidata_search.use_cache.default_options, options));
			if (!property) {
				// assert: property === undefined
				// Waiting for conversion.
				return;
			}
		}

		if (property > 0) {
			property = 'P' + property;
		}
		if (!/^P\d{1,5}$/.test(property)) {
			callback(undefined, 'wikidata_datatype: Invalid property: ['
					+ property + ']');
			return;
		}

		var datatype = wikidata_datatype_cache[property];
		if (datatype) {
			callback(datatype);
			return;
		}

		var action = [ get_data_API_URL(options),
		// https://www.wikidata.org/w/api.php?action=wbgetentities&props=datatype&ids=P7
		'action=wbgetentities&props=datatype&ids=' + property ];
		wiki_API.query(action, function handle_result(data, error) {
			error = wiki_API.query.handle_error(data, error);
			// 检查伺服器回应是否有错误资讯。
			if (error) {
				library_namespace.error('wikidata_datatype: ' + error);
				callback(data, error);
				return;
			}

			// data =
			// {"entities":{"P7":{"type":"property","datatype":"wikibase-item","id":"P7"}},"success":1}
			// data.entities[property].datatype
			if (!(data = data.entities) || !(data = data[property])) {
				callback(data, 'Invalid/Unknown return for ['
				//
				+ property + ']');
				return;
			}

			library_namespace.debug('datatype of property [' + property
					+ ']: [' + data.datatype + ']', 1, 'wikidata_datatype');
			// cache
			wikidata_datatype_cache[property] = data.datatype;
			callback(data.datatype);
		}, null, options);
	}

	// ------------------------------------------------------------------------

	// auto-detect if are multiple values
	function is_multi_wikidata_value(value, options) {
		if (value === wikidata_edit.remove_all)
			return false;

		if ('multi' in options)
			return options.multi;

		if (!Array.isArray(value))
			return false;

		// auto-detect: guess if is multi

		// 去除 [ language, key to search ] 的情形。
		if (is_api_and_title(value, 'language'))
			return false;

		// 去除经纬度+高度的情形。
		if (value.length === 2 || value.length === 3)
			if (typeof value[0] === 'number' && typeof value[1] === 'number')
				return false;

		return true;
	}

	// https://github.com/DataValues/Number/blob/master/src/DataValues/DecimalValue.php#L43
	// const QUANTITY_VALUE_PATTERN = '/^[-+]([1-9]\d*|\d)(\.\d+)?\z/';

	// return quantity acceptable by wikidata API ({String}with sign)
	// https://www.wikidata.org/wiki/Help:Statements#Quantitative_values
	// https://phabricator.wikimedia.org/T119226
	function wikidata_quantity(value, unit) {
		// assert: typeof value === 'number'
		value = +value;
		// TODO: 极大极小值。
		// 负数已经自动加上 "-"
		return value < 0 ? String(value)
		// `value || 0`: for NaN
		: '+' + (value || 0);
	}

	/**
	 * 尽可能模拟 wikidata (wikibase) 之 JSON 资料结构。
	 * 
	 * TODO: callback
	 * 
	 * @param value
	 *            要解析的值
	 * @param {String}[datatype]
	 *            资料型别
	 * @param {Object}[options]
	 *            附加参数/设定选择性/特殊功能与选项
	 * 
	 * @returns {Object}wikidata (wikibase) 之 JSON 资料结构。
	 * 
	 * @see https://www.wikidata.org/w/api.php?action=help&modules=wbparsevalue
	 *      https://www.mediawiki.org/wiki/Wikibase/API#wbparsevalue
	 *      https://phabricator.wikimedia.org/T112140
	 */
	function normalize_wikidata_value(value, datatype, options,
			argument_to_pass) {
		if (library_namespace.is_Object(datatype) && options === undefined) {
			// 输入省略了datatype。
			// input: normalize_wikidata_value(value, options)
			options = datatype;
			datatype = undefined;
		} else if (typeof options === 'string'
				&& /^[PQ]\d{1,5}$/i.test(options)) {
			options = {
				property : options
			};
		} else if (typeof options === 'string'
				&& PATTERN_PROJECT_CODE_i.test(options)) {
			options = {
				language : options.toLowerCase()
			};
		} else {
			options = library_namespace.setup_options(options);
		}

		if (value_is_to_remove(value)) {
			if (typeof options.callback === 'function')
				options.callback(value, argument_to_pass);
			return value;
		}

		var is_multi = is_multi_wikidata_value(value, options);
		// console.trace([ 'is_multi: ' + is_multi, 'value:', value ]);
		if (is_multi) {
			if (!Array.isArray(value)) {
				value = [ value ];
			}
			// 正规化并提供可随意改变的同内容参数，以避免修改或覆盖附加参数。
			options = library_namespace.new_options(options);
			delete options.multi;
			var left = value.length, callback = options.callback;
			options.callback = function(normalized_data, index) {
				if (!(0 <= index && index < value.length)) {
					throw new Error('normalize_wikidata_value: Invalid index: '
							+ index);
				}
				library_namespace.debug('Set [' + index + ']: '
						+ JSON.stringify(normalized_data), 3,
						'normalize_wikidata_value');
				// console.log(normalized_data);
				value[index] = normalized_data;
				if (--left === 0 && typeof callback === 'function') {
					library_namespace.debug('is_multi: Run callback:', 3,
							'normalize_wikidata_value');
					// console.log(value);
					// console.log(callback + '');
					callback(value, argument_to_pass);
				}
			};
			value = value.map(function(v, index) {
				return normalize_wikidata_value(v, datatype, options, index);
			});
			return value;
		}

		// --------------------------------------

		if (!datatype && options.property
				&& typeof options.callback === 'function'
				&& (!('get_type' in options) || options.get_type)) {
			// 先取得/确认指定 property 之 datatype。
			wikidata_datatype(options.property, function(datatype) {
				var matched = datatype
						&& datatype.match(/^wikibase-(item|property)$/);
				var entity_id = library_namespace.is_Object(value)
						&& value.value || value;
				if (matched && entity_id && !/^[PQ]\d{1,10}$/.test(entity_id)) {
					if (typeof value === 'object') {
						library_namespace.error(
						//
						'normalize_wikidata_value: Invalid object value!');
						console.trace([ value, datatype, options.property ]);
						normalize_wikidata_value(value, datatype, options,
								argument_to_pass);
						return;
					}

					library_namespace.debug('将属性名称转换成 id (' + datatype + '): '
							+ JSON.stringify(value), 3,
							'normalize_wikidata_value');
					// console.log(options);
					wikidata_search.use_cache(value, function(id, error) {
						// console.trace(options);
						// console.trace('' + options.callback);
						normalize_wikidata_value(id ||
						// 'normalize_wikidata_value: Nothing found: [' + value
						// + ']'
						value, datatype, options, argument_to_pass);
					}, Object.assign(Object.create(null),
					// 因wikidata_search.use_cache.default_options包含.type设定，必须将特殊type设定放在汇入default_options后!
					wikidata_search.use_cache.default_options, {
						type : matched[1],
						// 警告: 若是设定 must_callback=false，会造成程序不 callback 而中途跳出!
						must_callback : true
					}, options));
				} else {
					normalize_wikidata_value(value, datatype || NOT_FOUND,
							options, argument_to_pass);
				}
			}, options);
			return;
		}

		// --------------------------------------
		// 处理单一项目。
		var snaktype, datavalue_type, error;

		function normalized() {
			var normalized_data = {
				snaktype : snaktype || 'value'
			};
			if (options.property) {
				normalized_data.property = options.property;
			}
			if (options.hash) {
				normalized_data.hash = options.hash;
			}
			if (datatype) {
				normalized_data.datavalue = {
					value : value,
					type : datavalue_type
				};
				normalized_data.datatype = datatype;
			}
			if (error) {
				normalized_data.error = error;
				library_namespace.error(error);
				// console.trace(normalized_data);
			}

			// console.log(JSON.stringify(normalized_data));
			// console.log(normalized_data);
			if (typeof options.callback === 'function') {
				options.callback(normalized_data, argument_to_pass);
			}
			return normalized_data;
		}

		// delete: {P1:CeL.wiki.edit_data.remove_all}
		// delete: {P1:value,remove:true}
		// snaktype novalue 无数值: {P1:null}
		// snaktype somevalue 未知数值: {P1:CeL.wiki.edit_data.somevalue}
		// snaktype value: {P1:...}

		if (value === null) {
			snaktype = 'novalue';
			return normalized();
		}

		if (value === wikidata_edit.somevalue) {
			snaktype = 'somevalue';
			return normalized();
		}

		if (datatype === NOT_FOUND) {
			// 例如经过 options.get_type 却没找到。
			// 因为之前应该已经显示过错误讯息，因此这边直接放弃作业。
			return normalized();
		}

		// --------------------------------------
		// 处理一般赋值。

		if (!datatype) {
			// auto-detect: guess datatype

			// https://www.wikidata.org/w/api.php?action=help&modules=wbparsevalue
			// https://www.wikidata.org/w/api.php?action=wbgetentities&ids=P3088&props=datatype
			// +claims:P1793
			//
			// url: {P856:"https://url"}, {P1896:"https://url"}
			// monolingualtext: {P1448:"text"} ← 自动判别language,
			// monolingualtext: {P1448:"text",language:"zh-tw"}
			// string: {P1353:"text"}
			// external-id: {P212:'id'}
			// math: {P2534:'1+2'}
			// commonsMedia: {P18:'file.svg'}
			//
			// quantity: {P1114:0}
			// time: {P585:new Date} date.precision=1
			// wikibase-item: {P1629:Q1}
			// wikibase-property: {P1687:P1}
			// globe-coordinate 经纬度:
			// {P625: [ {Number}latitude 纬度, {Number}longitude 经度 ]}

			if (typeof value === 'number') {
				datatype = 'quantity';
			} else if (Array.isArray(value)
					&& (value.length === 2 || value.length === 3)) {
				datatype = 'globe-coordinate';
			} else if (library_namespace.is_Date(value)) {
				datatype = 'time';
			} else {
				value = String(value);
				var matched = value.match(/^([PQ])(\d{1,10})$/i);
				if (matched) {
					datatype = /^[Qq]$/.test(matched[1]) ? 'wikibase-item'
							: 'wikibase-property';
				} else if ('language' in options) {
					datatype = 'monolingualtext';
				} else if (/^(?:https?|ftp):\/\//i.test(value)) {
					datatype = 'url';
				} else if (/\.(?:jpg|png|svg)$/i.test(value)) {
					datatype = 'commonsMedia';
				} else {
					// TODO: other types: external-id, math
					datatype = 'string';
				}
			}
			// console.log('guess datatype: ' + datatype + ', value: ' + value);
		}

		// --------------------------------------

		if (typeof value === 'object' && value.snaktype && value.datatype) {
			// 若 value 已经是完整的 wikidata object，则直接回传之。
			if (datatype !== value.datatype) {
				library_namespace.error(
				// 所指定的与 value 的不同。
				'normalize_wikidata_value: The datatype of the value ['
						+ value.datatype + '] is different from specified: ['
						+ datatype + ']');
			}

			if (typeof options.callback === 'function') {
				options.callback(value, argument_to_pass);
			}
			return value;
		}

		// --------------------------------------
		// 依据各种不同的 datatype 生成结构化资料。

		switch (datatype) {
		case 'globe-coordinate':
			datavalue_type = 'globecoordinate';
			value = {
				latitude : +value[0],
				longitude : +value[1],
				// altitude / height / -depth
				altitude : typeof value[2] === 'number' ? value[2] : null,
				// 1: 整个地球?
				precision : value.precision || options.precision || 0.000001,
				globe : options.globe || 'http://www.wikidata.org/entity/Q2'
			};
			break;

		case 'monolingualtext':
			// console.trace([ value, datatype ]);
			datavalue_type = datatype;
			value = {
				text : value,
				language : wiki_API.site_name(options, {
					get_all_properties : true
				}).language || guess_language(value)
			};
			// console.log('use language: ' + value.language);
			break;

		case 'quantity':
			datavalue_type = datatype;
			var unit = options.unit || 1;
			value = wikidata_quantity(value);
			value = {
				amount : value,
				// unit of measure item (empty for dimensionless values)
				// e.g., 'http://www.wikidata.org/entity/Q857027'
				unit : String(unit)
			};
			// optional https://www.wikidata.org/wiki/Help:Data_type
			if (typeof options.upperBound === 'number')
				value.upperBound = wikidata_quantity(options.upperBound);
			// optional https://www.wikidata.org/wiki/Help:Data_type
			if (typeof options.lowerBound === 'number')
				value.lowerBound = wikidata_quantity(options.lowerBound);
			if (options.add_bound) {
				// isNaN(null)
				if (!('upperBound' in value))
					value.upperBound = value.amount;
				if (!('lowerBound' in value))
					value.lowerBound = value.amount;
			}
			break;

		case 'time':
			datavalue_type = datatype;
			var precision = value && value.precision || options.precision;
			// 规范日期。
			if (!library_namespace.is_Date(value)) {
				var date_value;
				// TODO: 解析各种日期格式。
				if (value && isNaN(date_value = Date.parse(value))) {
					// Warning:
					// String_to_Date()只在有载入CeL.data.date时才能用。但String_to_Date()比parse_date()功能大多了。
					date_value = library_namespace.String_to_Date(value, {
						// 都必须当作UTC+0，否则被转换成UTC+0时会出现偏差。
						zone : 0
					});
					if (date_value) {
						if (('precision' in date_value)
						//
						&& (date_value.precision in INDEX_OF_PRECISION)) {
							precision = INDEX_OF_PRECISION[date_value.precision];
						}
						date_value = date_value.getTime();
					} else {
						date_value = parse_date(value, true) || NaN;
					}
				}
				if (isNaN(date_value)) {
					error = 'Invalid Date: [' + value + ']';
				} else {
					// TODO: 按照date_value设定.precision。
					value = new Date(date_value);
				}
			} else if (isNaN(value.getTime())) {
				error = 'Invalid Date';
			}

			// console.trace([ value, precision ]);
			if (isNaN(precision)) {
				if (precision in INDEX_OF_PRECISION) {
					precision = INDEX_OF_PRECISION[precision];
				} else {
					if (precision) {
						library_namespace
								.warn('normalize_wikidata_value: Invalid precision of time, using precision=day instead: '
										+ precision);
					}
					precision = INDEX_OF_PRECISION.day;
				}
			}
			if (error) {
				value = String(value);
			} else {
				if (precision === INDEX_OF_PRECISION.day) {
					// 当 precision=INDEX_OF_PRECISION.day 时，时分秒*必须*设置为 0!
					value.setUTCHours(0, 0, 0, 0);
				}
				value = value.toISOString();
			}
			value = {
				// Data value corrupt: $timestamp must resemble ISO 8601, given
				time : value
				// '2000-01-01T00:00:00.000Z' → '2000-01-01T00:00:00Z'
				.replace(/\.\d{3}Z$/, 'Z')
				// '2000-01-01T00:00:00Z' → '+2000-01-01T00:00:00Z'
				.replace(/^(\d{4}-)/, '+$1'),
				timezone : options.timezone || 0,
				before : options.before || 0,
				after : options.after || 0,
				precision : precision,
				calendarmodel : options.calendarmodel
				// using `https://` will cause to
				// "⧼wikibase-validator-bad-prefix⧽" error!
				// proleptic Gregorian calendar:
				|| 'http://www.wikidata.org/entity/Q1985727'
			};
			break;

		case 'wikibase-item':
		case 'wikibase-property':
			datavalue_type = 'wikibase-entityid';
			// console.log(value);
			var matched = typeof value === 'string'
					&& value.match(/^([PQ])(\d{1,10})$/i);
			if (matched) {
				value = {
					'entity-type' : datatype === 'wikibase-item' ? 'item'
							: 'property',
					'numeric-id' : +matched[2],
					// 在设定时，id 这项可省略。
					id : value
				};
			} else {
				// console.trace(datatype);
				// console.trace(arguments);
				error = 'normalize_wikidata_value: Illegal ' + datatype + ': '
						+ JSON.stringify(value);
			}
			break;

		case 'commonsMedia':
		case 'url':
		case 'external-id':
		case 'math':
		case 'string':
			datavalue_type = 'string';
			// Data value corrupt: Can only construct StringValue from strings
			value = String(value);
			break;

		default:
			error = 'normalize_wikidata_value: Unknown datatype [' + datatype
					+ '] and value [' + JSON.stringify(value) + ']';
		}

		return normalized();
	}

	/**
	 * @inner only for set_claims()
	 */
	var entity_properties = {
		// 值的部分为单纯表达意思用的内容结构，可以其他的值代替。
		pageid : 1,
		ns : 0,
		title : 'Q1',
		lastrevid : 1,
		modified : '2000-01-01T00:00:00Z',
		type : 'item',
		id : 'Q1',

		// [[commons:Commons:Structured_data]]
		// statements : [],

		labels : [],
		descriptions : [],
		aliases : [],
		claims : [],

		// https://www.wikidata.org/wiki/Wikidata:Glossary
		// snak: property + value
		// snaks : [],

		sitelinks : []
	},
	//
	KEY_property_options = typeof Symbol === 'function' ? Symbol('options')
			: 'options',
	/**
	 * 放置不应该成为 key 的一些属性名称
	 * 
	 * @inner only for set_claims()
	 */
	claim_properties = {
		// 值的部分为单纯表达意思用的内容结构，可以其他的值代替。
		// mainsnak : {},
		// snaktype : '',
		// datavalue : {},
		// id : '',
		type : '',
		rank : '',
		language : '',
		// 警告: 此属性应置于个别 claim 中。
		remove : true,
		// additional_properties, KEY_property_options
		// options : {},
		multi : true,
		qualifiers : [],
		references : []
	};

	// get qualifiers / references of property_data
	function get_property(property_data, type) {
		if (!property_data)
			return;

		return property_data[KEY_property_options]
				&& type in property_data[KEY_property_options] ? property_data[KEY_property_options][type]
				: property_data[type];
	}

	// @inner
	// 为欲删除之index。
	function value_is_to_remove(value) {
		// {key:{remove:true}}
		return library_namespace.is_Object(value)
		// {Function}Array.prototype.remove
		&& (value.remove || value.remove === 0);
	}

	// @inner
	// @since 2020/6
	function normalize_value_of_properties(value, language) {
		if (library_namespace.is_Object(value)) {
			// convert language+value object
			// {language:'language',value:'value'}
			if (value.language && ('value' in value)) {
				// e.g., {language:'ja',value:'日本'}
				return [ value.language, value.value ];
			}

			var language_and_key;
			if (value_is_to_remove(value)) {
				// {key:{remove:true}}

			} else if ((language_and_key = Object.keys(value)).length === 1
			//
			&& is_api_and_title(language_and_key = [
			// e.g., {key:{ja:'日本'}}
			language_and_key[0], value[language_and_key[0]] ], 'language')) {
				return language_and_key;
			}

		} else if (Array.isArray(value) && value.length === 2
		// TODO: using is_api_and_title(value, 'language')
		// treat as [ language, key to search ]
		&& !value[0] && language) {
			value[0] = language;
		}

		return value;
	}

	// example 1:
	//
	// {Object}可接受的原始输入形式之一
	// {载于:'宇宙',导入自:'zhwiki',来源网址:undefined,台湾物种名录物种编号:{value:123,remove:true},language:'zh',references:{...}}+exists_property_hash
	//
	// {Array}可接受的原始输入形式之2: 直接转换为{Array}阵列
	// [{载于:'宇宙',导入自:'zhwiki',来源网址:undefined,台湾物种名录物种编号:{value:123,remove:true},language:'zh',references:{...}}]
	// +exists_property_hash
	//
	// {Array}可接受的原始输入形式之2'
	// 分析每一个个别的{Object}项目，将{Object}简易的属性杂凑转换成{Array}属性名称列表。这期间可能会改变要求项目的项目数 →
	// [{载于:'宇宙',options:AP},{导入自:'zhwiki',options:AP},{来源网址:undefined,options:AP},{台湾物种名录物种编号:123,remove:true,options:AP}]
	// + additional_properties: AP={language:'zh',references:{...}}
	// + exists_property_hash
	// * {Object|Array}AP.references 当作个别{Object} properties 项目的参照。
	// * 若某项有 .mainsnak 或 .snaktype 则当作输入了已正规化、全套完整的资料，不处理此项。
	//
	// {Array}可接受的原始输入形式之3
	// 将{Array}属性名称列表转换成{Array}属性 id 列表 →
	// [{P248:'宇宙',property:'P248'},{P143:'zhwiki',property:'P143'},{P854:undefined,property:'P854'},{P3088:123,remove:true,property:'P3088'}]
	// + additional_properties + exists_property_hash
	//
	// 去掉 exists_property_hash 已有、重复者。
	// 处理 remove:true & remove all。
	//
	// get datatype of each property →
	// [{P248:'Q1'},{P143:'Q30239'},{P854:undefined},{P3088:123,remove:true}]
	// + additional_properties + exists_property_hash
	//
	// normalize property data value →
	// [{P248:{normalized value of P248}},{P143:{normalized value of P143}}
	// ,{property:P854,remove:true,value:undefined},{property:P3088,remove:true,value:123}]
	// + additional_properties
	//
	// 去掉壳 → data = [{normalized value of P248},{normalized value of P143}
	// ,{property:P854,remove:true,value:undefined},{property:P3088,remove:true,value:123}]
	// .additional=additional_properties
	//
	// callback(data)

	// example 2:
	//
	// [{生物俗名:['SB2#1','SB2#2','SB2#3'],multi:true,language:'zh-tw',references:{台湾物种名录物种编号:123456}},
	// {読み仮名 : 'かな',language : 'ja',references : {'imported from Wikimedia
	// project' : 'jawiki'}}]
	// +exists_property_hash
	//
	// {Array}可接受的原始输入形式之2'
	// 分析每一个个别的{Object}项目，将{Object}简易的属性杂凑转换成{Array}属性名称列表。这期间可能会改变要求项目的项目数 →
	// [{生物俗名:'SB2#1',options:AP1},{生物俗名:'SB2#2',options:AP1},{生物俗名:'SB2#3',options:AP1},
	// {読み仮名 : 'かな',options(KEY_property_options):AP2}]
	// +additional_properties:AP1={language:'zh-tw',references:{台湾物种名录物种编号:123456}}
	// +additional_properties:AP2={language:'ja',references:{'imported from
	// Wikimedia project':'jawiki'}}

	/**
	 * 规范化属性列表。
	 * 
	 * @param {Object|Array}properties
	 *            要转换的属性。
	 * @param {Function}callback
	 *            回调函数。 callback({Array}property list, error)
	 * @param {Object}[exists_property_hash]
	 *            已经存在的属性杂凑。可以由 wikidata API 取得。
	 * @param {Object}[options]
	 *            附加参数/设定选择性/特殊功能与选项
	 */
	function normalize_wikidata_properties(properties, callback,
			exists_property_hash, options) {
		// console.log(properties);
		// console.trace(options);
		// console.trace('normalize_wikidata_properties');

		if (options.process_sub_property)
			properties = properties[options.process_sub_property];

		library_namespace.debug('normalize properties: '
				+ JSON.stringify(properties), 3,
				'normalize_wikidata_properties');

		// console.log('-'.repeat(40));
		// console.log(properties);

		if (library_namespace.is_Object(properties)) {
			// {Array}可接受的原始输入形式之2: 直接转换为{Array}阵列
			properties = [ properties ];

		} else if (!Array.isArray(properties)) {
			if (properties) {
				library_namespace
						.error('normalize_wikidata_properties: Invalid properties: '
								+ JSON.stringify(properties));
			}

			callback(properties);
			return;
		}

		// 分析每一个个别的{Object}项目，将{Object}简易的属性杂凑转换成{Array}属性名称列表。这期间可能会改变要求项目的项目数

		// 索求、需要转换的属性名称 property key
		var demands = [],
		// demands 对应的 property
		property_corresponding = [],
		//
		options_language = wiki_API.site_name(options, {
			get_all_properties : true
		}).language;

		// console.trace(options);
		// console.log(options_language);
		// console.log('-'.repeat(20));
		// console.log(properties);

		var old_properties = properties;
		// 把正规化之后的放入 properties。
		properties = [];
		old_properties.forEach(function(property) {
			// console.trace(property);
			if (!property) {
				// Skip null property.
				return;
			}

			// .process_sub_property 指的是可以全部删除的，即 .references。
			if (options.process_sub_property && value_is_to_remove(property)) {
				properties.push(property);
				return;
			}

			// e.g., property:{P1:'',P2:'',language:'zh',references:{}}
			// assert: library_namespace.is_Object(property)

			// * 若某项有 .mainsnak 或 .snaktype 则当作输入了已正规化、全套完整的资料，不处理此项。
			if (property.mainsnak || property.snaktype || property.snaks) {
				properties.push(property);
				// Skip it.
				return;
			}

			// [KEY_property_options]: additional properties
			// 参照用设定: 设定每个属性的时候将参照的设定，包含如 .language 等。
			var additional_properties = property[KEY_property_options],
			//
			check = function(property_data) {
				// console.trace(property_data);
				var language = get_property(property_data, 'language')
						|| options_language;
				var value = property_data.value
				//
				= normalize_value_of_properties(property_data.value, language);
				if (is_api_and_title(value, 'language')) {
					// treat as [ language, key to search ]
					if (!value.type)
						value.type = 'item';
					demands.push(value);
					property_corresponding.push(property_data);
				}

				var property_key = property_data.property;
				if (!/^[PQ]\d{1,10}$/.test(property_key)) {
					// 有些设定在建构property_data时尚存留于((property))，这时得要自其中取出。

					// console.log(property);
					// console.log(options);
					// console.trace(language);
					// throw language;
					if (language) {
						property_key = [ language, property_key ];
					} else {
						property_key = [ , property_key ];
					}
					// e.g., qualifiers: { 'series ordinal': 1 }
					// The 'series ordinal' is property name.
					property_key.type = 'property';
					demands.push(property_key);
					property_corresponding.push(property_data);
				}

				if (property.language)
					property_data.language = property.language;
				properties.push(property_data);
			};

			// .property: property key
			if (property.property) {
				check(property);
				return;
			}

			// e.g.,
			// properties:{P1:'',P2:'',language:'zh',references:{}}
			// assert: library_namespace.is_Object(properties)

			// 将{Object}简易的属性杂凑转换成{Array}属性名称列表 →
			// 因为需要动到不可回复的操作，因此不更动到原先的属性。
			// 初始化
			additional_properties = Object.assign({
				// 先记录泛用 properties。
				language : get_property(property, 'language')
						|| options_language
			}, additional_properties);

			// console.trace(property);

			// properties应该为{Array}属性名称/id列表阵列。
			// 将 参照用设定 设为空，以便之后使用。
			// 把应该用做参照用设定的移到 property[KEY_property_options]，
			// 其他的属性值搬到新的 properties。
			for ( var key in property) {
				if (key === KEY_property_options) {
					continue;
				}

				var value = property[key];
				if (key in claim_properties) {
					additional_properties[key] = value;
					continue;
				}

				var language = additional_properties.language;

				value = normalize_value_of_properties(value, language);

				// console.trace(value);

				var is_multi = value !== wikidata_edit.remove_all
				//
				&& ('multi' in additional_properties
				//
				? additional_properties.multi
				//
				: is_multi_wikidata_value(value, property));
				if (is_multi) {
					// e.g., [ 'jawiki', ['日本', '米国'] ]
					if (is_api_and_title(value, 'language')
					// [ 'jawiki', '日本' ] 可能会混淆。
					&& Array.isArray(value[1])) {
						value = value[1].map(function(v) {
							// return [ value[0], v ];
							return {
								language : value[0],
								value : v
							};
						});
					}
					// console.log(value);

					// set multiple values
					(Array.isArray(value) ? value : [ value ])
					//
					.forEach(function(v) {
						var property_data = {
							// 将属性名称 property key 储存在 .property
							property : key,
							value : v
						};
						property_data[KEY_property_options]
						//
						= additional_properties;
						check(property_data);
					});
				} else {
					var property_data = {
						// 将属性名称 property key 储存在 .property
						property : key,
						value : value
					};
					property_data[KEY_property_options]
					//
					= additional_properties;
					check(property_data);
				}
			}
			// 这应该仅用于指示本 property，因此处理过后已经无用。
			delete additional_properties.multi;
		});

		// console.log('-'.repeat(60));
		// console.log(properties);

		// Release memory. 释放被占用的记忆体。
		old_properties = null;

		// --------------------------------------

		function process_property_id_list(property_id_list) {
			// console.trace(property_id_list);
			// console.trace(property_corresponding);

			// 将{Array}属性名称列表转换成{Array}属性 id 列表 →
			if (property_id_list.length !== property_corresponding.length) {
				throw new Error(
				//
				'normalize_wikidata_properties: property_id_list.length '
						+ property_id_list.length
						+ ' !== property_corresponding.length '
						+ property_corresponding.length);
			}

			property_id_list.forEach(function(id, index) {
				var property_data = property_corresponding[index];
				// console.trace([ id, property_data ]);
				// @see check() above
				var value = property_data.value;
				if (value_is_to_remove(value)) {
					// value.key = property_data.property;
					// 纪录 id，以供之后 remove_qualifiers() 使用。
					value.property = id;
					// console.trace(value);
					return;
				}

				if (is_api_and_title(value, 'language')) {
					// treat as [ language, key to search ]
					property_data.value = id;
					return;
				}

				if (Array.isArray(id) && id.length > 0) {
					library_namespace.error(
					//
					'normalize_wikidata_properties: Get multi properties: '
							+ id + ' for ' + JSON.stringify(property_data));
					return;
				}

				// 没找到的时候，id 为 undefined。
				if (/^[PQ]\d{1,10}$/.test(id)) {
					if (!('value' in property_data)) {
						property_data.value
						//
						= property_data[property_data.property];
					}
					property_data.property = id;
					return;
				}

				library_namespace.error(
				//
				'normalize_wikidata_properties: Skip invalid property key: '
						+ JSON.stringify(property_data));
			});

			function property_value(property_data) {
				return 'value' in property_data ? property_data.value
						: property_data[property_data.property];
			}

			// 跳过要删除的。
			function is_property_to_remove(property_data) {
				if (!('remove' in property_data)
						&& property_data[KEY_property_options]
						&& ('remove' in property_data[KEY_property_options])) {
					if (typeof property_data[KEY_property_options].remove
					//
					=== 'function') {
						console.log(property_data[KEY_property_options]);
						throw new Error(
						//		
						'wikidata_search.use_cache: .remove is function');
					}
					property_data.remove
					// copy configuration.
					// 警告: 此属性应置于个别 claim 中，而非放在参照用设定。
					// 注意: 这操作会更改 property_data!
					= property_data[KEY_property_options].remove;
				}

				if (value_is_to_remove(property_data)) {
					return true;
				}
				var value = property_value(property_data);
				if (value === wikidata_edit.remove_all
				// 若遇删除此属性下所有值，必须明确指定 wikidata_edit.remove_all，避免错误操作。
				// && value === undefined
				) {
					// 正规化 property_data.remove: 若有删除操作，必定会设定 .remove。
					// 注意: 这操作会更改 property_data!
					property_data.remove = wikidata_edit.remove_all;
					return true;
				}
			}

			// console.trace(exists_property_hash);
			// 去掉 exists_property_hash 已有、重复者。
			if (exists_property_hash) {
				// console.trace(exists_property_hash);
				properties = properties.filter(function(property_data) {
					// 当有输入 exists_property_hash 时，所有的相关作业都会在这段处理。
					// 之后 normalize_next_value()不会再动到 exists_property_hash 相关作业。
					var property_id = property_data.property;
					if (!property_id) {
						// 在此无法处理。例如未能转换 key 成 id。
						return true;
					}
					var value = property_value(property_data),
					//
					exists_property_list = exists_property_hash[property_id];
					// console.trace(exists_property_hash);
					// console.trace(property_id);
					// console.trace(property_data);
					// console.trace(exists_property_list);

					if (!(property_id in wikidata_datatype_cache)
							&& exists_property_list) {
						var datatype = exists_property_list[0]
								&& exists_property_list[0].mainsnak
								&& exists_property_list[0].mainsnak.datatype;
						if (datatype) {
							// 利用原有 datatype 加快速度。
							wikidata_datatype_cache[property_id] = datatype;
						}
					}

					// console.trace('Check
					// is_property_to_remove(property_data)');
					if (is_property_to_remove(property_data)) {
						library_namespace.debug(
								'test 删除时，需要存在此 property 才有必要处置。', 1,
								'normalize_wikidata_properties');
						// console.trace(exists_property_list);
						if (!exists_property_list) {
							library_namespace.debug('Skip '
							//
							+ property_id
							//
							+ (value ? '=' + JSON.stringify(value) : '')
									+ ': 无此属性 id，无法删除。', 1,
									'normalize_wikidata_properties');
							return false;
						}

						// ((true >= 0))
						if (typeof property_data.remove === 'number'
								&& property_data.remove >= 0) {
							if (property_data.remove in exists_property_list) {
								return true;
							}
							// 要删除的值不存在。
							library_namespace.warn(
							//
							'normalize_wikidata_properties: Skip '
							//
							+ property_id
							//
							+ (value ? '=' + JSON.stringify(value) : '')
							//
							+ ': 不存在指定要删除的 index ' + property_data.remove + '/'
									+ exists_property_list.length + '，无法删除。');
							return false;
						}

						if (!property_data.remove || property_data.remove
						//
						=== wikidata_edit.remove_all) {
							return true;
						}

						if (property_data.remove !== true) {
							library_namespace.warn(
							//
							'normalize_wikidata_properties: Invalid .remove ['
							//
							+ property_data.remove + ']: ' + property_id
							//
							+ (value ? '=' + JSON.stringify(value) : '')
							//
							+ ', will still try to remove the property.');
							// property_data.remove = true;
						}

						// 直接检测已有的 index，设定于 property_data.remove。
						// 若有必要删除，从最后一个相符的删除起。
						var duplicate_index = wikidata_datavalue.get_index(
								exists_property_list, value, -1);
						// console.log(exists_property_list);
						// console.log(value);
						// console.trace(duplicate_index);

						if (duplicate_index !== NOT_FOUND) {
							// delete property_data.value;
							property_data.remove = duplicate_index;
							return true;
						}
						// 要删除的值不存在。
						library_namespace.debug(
						//
						'Skip ' + property_id
						//
						+ (value ? '=' + JSON.stringify(value)
						//
						+ ': 此属性无此值，无法删除。' : ': 无此属性 id，无法删除。')
						//
						, 1, 'normalize_wikidata_properties');
						if (false) {
							console.trace(wikidata_search.use_cache([
									property_data.language, value ], {
								get_id : true
							}));
						}
						return false;
					}

					// console.trace(exists_property_list);
					if (!exists_property_list) {
						// 设定值时，不存在此 property 即有必要处置。
						return true;
					}

					// 检测是否已有此值。
					if (false) {
						console.log(wikidata_datavalue.get_index(
								exists_property_list, value, 0));
					}
					// 若有必要设定 qualifiers / references，从首个相符的设定起。
					var duplicate_index = wikidata_datavalue.get_index(
							exists_property_list, value);
					if (duplicate_index === NOT_FOUND) {
						if (false) {
							console.log(JSON.stringify(exists_property_list));
							console.trace('No duplicate_index of value: '
									+ value);
						}
						return true;
					}

					// console.trace(property_data);

					var rank = get_property(property_data, 'rank'),
					//
					qualifiers = get_property(property_data, 'qualifiers'),
					/*
					 * {Object|Array}property_data[KEY_property_options].references
					 * 当作每个 properties 的参照。
					 */
					references = get_property(property_data, 'references');
					library_namespace.debug('Skip ' + property_id + '['
							+ duplicate_index + ']: 此属性已存在相同值 [' + value + ']。'
							+ (rank || qualifiers || references
							//
							? '但依旧处理其 rank / qualifiers / references 设定，'
							//
							+ '以防设定了 .force_add_sub_properties。' : ''), 1,
							'normalize_wikidata_properties');
					if (rank || typeof qualifiers === 'object'
							|| typeof references === 'object') {
						// delete property_data.value;
						property_data.exists_index = duplicate_index;
						// console.trace(property_data);
						return true;
					}
					return false;
				});
			}

			// console.trace(properties);
			var index = 0,
			//
			normalize_next_value = function normalize_next_value() {
				library_namespace.debug(index + '/' + properties.length, 3,
						'normalize_next_value');
				if (index === properties.length) {
					library_namespace.debug(
							'done: 已经将可查到的属性名称转换成属性 id。 callback(properties);',
							2, 'normalize_next_value');
					callback(properties);
					return;
				}

				var property_data = properties[index++];
				if (is_property_to_remove(property_data)) {
					// 跳过要删除的。
					normalize_next_value();
					return;
				}

				// * 若某项有 .mainsnak 或 .snaktype 则当作输入了已正规化、全套完整的资料，不处理此项。
				if (property_data.mainsnak || property_data.snaktype
						|| property_data.snaks) {
					// console.trace(property_data);
					normalize_next_value();
					// Skip it.
					return;
				}

				function normalize_wikidata_value__callback(normalized_value) {
					// console.trace(options);
					// console.trace(normalized_value);
					if (typeof options.value_filter === 'function') {
						normalized_value = options
								.value_filter(normalized_value);
					}

					if (Array.isArray(normalized_value) && options.aoto_select) {
						// 采用首个可用的，最有可能是目标的。
						normalized_value.some(function(value) {
							if (value && !value.error
									&& value.datatype !== NOT_FOUND) {
								normalized_value = value;
								return true;
							}
						});
					}

					if (Array.isArray(normalized_value)
							|| normalized_value.error
							|| normalized_value.datatype === NOT_FOUND) {
						// 将无法转换的放在 .error。
						if (properties.error) {
							properties.error.push(property_data);
						} else {
							properties.error = [ property_data ];
						}

						if (Array.isArray(normalized_value)) {
							library_namespace.error(
							// 得到多个值而非单一值。
							'normalize_next_value: get multiple values instead of just one value: ['
									+ value + '] → '
									+ JSON.stringify(normalized_value));
							// console.trace(value);

						} else if (false && normalized_value.error) {
							// 之前应该已经在 normalize_wikidata_value() 显示过错误讯息。
							library_namespace.error('normalize_next_value: '
									+ normalized_value.error);
						}
						// 因为之前应该已经显示过错误讯息，因此这边直接放弃作业，排除此 property。

						properties.splice(--index, 1);
						normalize_next_value();
						return;
					}

					if (false) {
						console.log('-'.repeat(60));
						console.log(normalized_value);
						console.trace(property_data.property + ': '
						//
						+ JSON.stringify(exists_property_hash
						//
						[property_data.property]));
					}

					var rank = get_property(property_data, 'rank');

					var qualifiers = get_property(property_data, 'qualifiers');
					/*
					 * {Object|Array}property_data[KEY_property_options].references
					 * 当作每个 properties 的参照。
					 */
					var references = get_property(property_data, 'references');

					if (exists_property_hash[property_data.property]
					// 二次筛选:因为已经转换/取得了 entity id，可以再次做确认。
					&& (normalized_value.datatype === 'wikibase-item'
					// and 已经转换了 date time
					|| normalized_value.datatype === 'time')
					//
					&& wikidata_datavalue.get_index(
					//
					exists_property_hash[property_data.property],
					//
					normalized_value, 1)) {
						if (!options.force_add_sub_properties || !rank
								&& !qualifiers && !references) {
							var message = '[' + value + ']';
							if (value !==
							//
							wikidata_datavalue(normalized_value)) {
								message += ' ('
								//
								+ wikidata_datavalue(normalized_value) + ')';
							}
							if (!rank && !qualifiers && !references) {
								library_namespace.debug('Skip exists value: '
										+ message, 1, 'normalize_next_value');
							} else if (!options.no_skip_attributes_note) {
								library_namespace.warn([
								//
								'normalize_next_value: ', {
									T : [
									// gettext_config:{"id":"skip-the-$1-for-$2-and-do-not-set-them-because-the-values-already-exist-and-$3-is-not-set"}
									'跳过 %2 之 %1 设定，因数值已存在且未设定 %3。'
									//
									, [ rank ? 'rank' : 0,
									//
									qualifiers ? 'qualifiers' : 0,
									//
									references ? 'references' : 0
									//
									].filter(function(v) {
										return !!v;
									})
									// gettext_config:{"id":"Comma-separator"}
									.join(gettext('Comma-separator')),
									//
									property_data.property + ' = ' + message,
									//
									'options.force_add_sub_properties' ]
								} ]);
							}
							properties.splice(--index, 1);
							normalize_next_value();
							return;
						}

						// TODO: 依旧增添 rank / qualifiers / references。
						library_namespace.debug('Skip '
								+ property_data.property + ': 此属性已存在相同值 ['
								+ value + '] ('
								+ wikidata_datavalue(normalized_value)
								+ ')，但依旧处理其 '
								+ 'rank / qualifiers / references 设定。', 1,
								'normalize_next_value');
						// NG: property_data.exists_index = index - 1;
						// console.trace(property_data);
					}

					if (false) {
						// normalize property data value →
						property_data[property_data.property]
						//
						= normalized_value;
					}

					// console.log('-'.repeat(60));
					// console.log(normalized_value);
					// 去掉壳 →
					properties[index - 1] = normalized_value;
					// 复制/搬移需要用到的属性。
					if (property_data.exists_index >= 0) {
						normalized_value.exists_index
						//
						= property_data.exists_index;
					}
					if (property_data.language) {
						normalized_value.language = property_data.language;
					}
					// console.trace(normalized_value);

					if (rank) {
						// {String}
						normalized_value.rank = rank;
					}

					if (typeof qualifiers === 'object') {
						// {Array|Object}
						normalized_value.qualifiers = qualifiers;
					}

					if (typeof references === 'object') {
						// {Array|Object}
						normalized_value.references = references;
					}

					// console.trace(normalized_value);
					normalize_next_value();
				}

				// get datatype of each property →
				var language = get_property(property_data, 'language')
						|| options_language,
				//
				_options = Object.assign(Object.clone(options),
				//
				property_data[KEY_property_options], {
					// multi : false,
					callback : normalize_wikidata_value__callback,
					property : property_data.property
				});
				if (language) {
					_options.language = language;
				}

				// console.log('-'.repeat(60));
				// console.trace(property_data);
				var value = property_value(property_data);
				// console.log('-'.repeat(60));
				// console.trace([ value, property_data ]);
				// console.log(_options);
				normalize_wikidata_value(value, property_data.datatype,
						_options);
			};

			normalize_next_value();
		}

		// console.trace(demands);

		// 将{Array}属性名称列表转换成{Array}属性 id 列表 →
		wikidata_search.use_cache(demands, process_property_id_list, Object
				.assign(Object.create(null),
						wikidata_search.use_cache.default_options, options));

	}

	// ----------------------------------------------------

	function entity_id_to_link(id) {
		if (!id && id !== 0) {
			return '';
		}
		if (/^P\d+$/.test(id)) {
			return '[[Property:' + id + ']]';
		}
		return '[[' + id + ']]';
	}

	function append_parameters(POST_data, options) {
		if (options.bot) {
			POST_data.bot = 1;
		}
		if (options.summary) {
			POST_data.summary = options.summary;
		}
		if (options.tags) {
			POST_data.tags = options.tags;
		}
		// TODO: baserevid, 但这需要每次重新取得 revid。

		if (options.token) {
			// the token should be sent as the last parameter.
			// delete POST_data.token;
			POST_data.token = options.token;
		} else {
			// throw new Error('No token specified!');
		}
		// console.trace(POST_data);
	}

	// @inner
	function set_rank(exists_property_data, property_data, callback, options,
			API_URL, session, exists_rank) {
		// console.trace(arguments);
		var message = 'Set '
				+ entity_id_to_link(wikidata_datavalue(exists_property_data))
				+ '.rank=' + property_data.rank + '←'
				+ exists_property_data.rank;
		library_namespace.debug(exists_property_data.id + ': ' + message, 1,
				'set_rank');
		var original_rank = exists_property_data.rank;
		exists_property_data.rank = property_data.rank;
		var POST_data = {
			claim : JSON.stringify(exists_property_data)
		};

		append_parameters(POST_data, options);
		POST_data.summary = POST_data.summary.trimEnd() + ' (' + message + ')';

		wiki_API.query([ API_URL, 'action=wbsetclaim' ],
		// https://www.wikidata.org/w/api.php?action=help&modules=wbsetclaim
		function handle_result(data, error) {
			// console.trace([ GUID, data, error ]);
			error = wiki_API.query.handle_error(data, error);
			// 检查伺服器回应是否有错误资讯。
			if (error) {
				library_namespace.error('set_rank: ' + message + ': ' + error);
				// recover
				exists_property_data.rank = original_rank;
			}
			// data:
			// {"pageinfo":{"lastrevid":1566340699},"success":1,"claim":{"mainsnak":{"snaktype":"value","property":"P1476","hash":"443d60bb6a5c6380dfdcf1c398b408edddd3b4e1","datavalue":{"value":{"text":"title","language":"en"},"type":"monolingualtext"},"datatype":"monolingualtext"},"type":"statement","id":"Q73311308$0B9608D8-FD38-4462-BD6D-FDE58DD48BAE","rank":"deprecated"}}
			callback(data, error);
		}, POST_data, session);
	}

	// @inner
	function set_single_qualifier(GUID, qualifier, callback, options, API_URL,
			session) {
		var POST_data = {
			// TODO: baserevid
			claim : GUID,
			snaktype : qualifier.snaktype,
			property : qualifier.property,
			value : JSON
					.stringify(qualifier.snaktype === 'value' ? qualifier.datavalue.value
							: '')
		// snakhash : ''
		};

		append_parameters(POST_data, options);

		library_namespace.debug(GUID + ': Set ' + qualifier.property + '='
				+ qualifier.datavalue.value, 1, 'set_single_qualifier');
		wiki_API.query([ API_URL, 'action=wbsetqualifier' ],
		// https://www.wikidata.org/w/api.php?action=help&modules=wbsetqualifier
		function handle_result(data, error) {
			// console.trace([ GUID, data, error ]);
			error = wiki_API.query.handle_error(data, error);
			// 检查伺服器回应是否有错误资讯。
			if (error) {
				library_namespace.error('set_single_qualifier: Set '
						+ qualifier.property + '='
						// e.g., ""
						+ JSON.stringify(qualifier.datavalue.value) + ': '
						+ error);
				// console.trace([ GUID, qualifier ]);
			}
			// data:
			// {"pageinfo":{"lastrevid":1},"success":1,"claim":{"mainsnak":{"snaktype":"value","property":"P1","hash":"","datavalue":{"value":{"entity-type":"item","numeric-id":1,"id":"Q1"},"type":"wikibase-entityid"},"datatype":"wikibase-item"},"type":"statement","qualifiers":{"P1":[{"snaktype":"value","property":"P1111","hash":"050a39e5b316e486dc21d365f7af9cde9ad25a3e","datavalue":{"value":{"amount":"+8937","unit":"1","upperBound":"+8937","lowerBound":"+8937"},"type":"quantity"},"datatype":"quantity"}]},"qualifiers-order":["P1"],"id":"","rank":"normal"}}
			callback(data, error);
		}, POST_data, session);
	}

	function remove_qualifiers(GUID, qualifier, callback, options, API_URL,
			session, exists_qualifiers) {
		// console.trace(exists_qualifiers);

		var qualifier_list = exists_qualifiers
				&& exists_qualifiers[qualifier.property];
		if (!Array.isArray(qualifier_list)) {
			var error = 'remove_qualifiers: No property [' + qualifier.property
					+ '] found!';
			library_namespace.error(error);
			callback(undefined, new Error(error));
			return;
		}

		if (qualifier.value_processor)
			qualifier.value_processor(qualifier_list);

		var qualifier_hashs = qualifier_list.map(function(qualifier) {
			return qualifier.hash;
		}).join('|');

		var POST_data = {
			// TODO: baserevid
			claim : GUID,
			qualifiers : qualifier_hashs
		};

		append_parameters(POST_data, options);
		// console.trace(session.token);

		wiki_API.query([ API_URL, 'action=wbremovequalifiers' ],
		// https://www.wikidata.org/w/api.php?action=help&modules=wbremovequalifiers
		function handle_result(data, error) {
			error = wiki_API.query.handle_error(data, error);
			// 检查伺服器回应是否有错误资讯。
			if (error) {
				library_namespace.error('remove_qualifiers: ' + error);
			}
			// console.trace(data);
			// console.trace(JSON.stringify(data));
			// data = { pageinfo: { lastrevid: 1 }, success: 1 }
			callback(data, error);
		}, POST_data, session);
	}

	// 量词/限定词
	function set_qualifiers(GUID, property_data, callback, options, API_URL,
			session, exists_qualifiers) {
		// console.trace(property_data);
		// console.trace(options);

		normalize_wikidata_properties(property_data.qualifiers, function(
				qualifiers) {
			if (!Array.isArray(qualifiers)) {
				if (qualifiers) {
					library_namespace
							.error('set_qualifiers: Invalid qualifiers: '
									+ JSON.stringify(qualifiers));
				} else {
					// assert: 本次没有要设定 qualifiers 的资料。
				}
				callback();
				return;
			}

			// console.log(JSON.stringify(property_data.qualifiers));
			// console.log(property_data.qualifiers);

			// console.log(JSON.stringify(qualifiers));
			// console.trace(qualifiers);

			var qualifier_index = 0, latest_data_with_claim;
			function set_next_qualifier(data, error) {
				// console.trace([ qualifier_index, qualifiers, error ]);
				if (data && data.claim)
					latest_data_with_claim = data;
				if (error || qualifier_index === qualifiers.length) {
					// console.trace([ data, error ]);
					callback(data, error);
					return;
				}

				var qualifier = qualifiers[qualifier_index++];
				if (typeof qualifier === 'function') {
					qualifier = qualifier(latest_data_with_claim
							&& latest_data_with_claim.claim
							// 警告: 这并非最新资料!
							&& latest_data_with_claim.claim.qualifiers
							|| exists_qualifiers);
				}
				// console.trace(qualifier);
				if (value_is_to_remove(qualifier)) {
					remove_qualifiers(GUID, qualifier, set_next_qualifier,
							options, API_URL, session, exists_qualifiers);
					return;
				}

				set_single_qualifier(GUID, qualifier, set_next_qualifier,
						options, API_URL, session);
			}
			set_next_qualifier();

		}, exists_qualifiers
		// 确保会设定 .remove / .exists_index = duplicate_index。
		|| Object.create(null),
		//
		Object.assign({
			language : property_data.qualifiers.language
					|| get_property(property_data, 'language') || options
					&& options.language,
			// [KEY_SESSION]
			session : session
		}));
	}

	// ----------------------------------------------------

	function set_single_references(GUID, references, callback, options,
			API_URL, session, exists_references) {
		// console.log(references);
		// console.trace(JSON.stringify(references));
		var POST_data = {
			// TODO: baserevid
			statement : GUID,
			snaks : JSON.stringify(references)
		};

		if (options.reference_index >= 0) {
			POST_data.index = options.reference_index;
		}

		append_parameters(POST_data, options);

		wiki_API.query([ API_URL, {
			action : 'wbsetreference'
		} ],
		// https://www.wikidata.org/w/api.php?action=help&modules=wbsetreference
		function handle_result(data, error) {
			error = wiki_API.query.handle_error(data, error);
			// console.log(data);
			// console.log(JSON.stringify(data));
			// 检查伺服器回应是否有错误资讯。
			if (error) {
				// e.g., set_single_references: [failed-save] Edit conflict.
				library_namespace.error('set_single_references: ' + error);
			}
			// data =
			// {"pageinfo":{"lastrevid":1},"success":1,"reference":{"hash":"123abc..","snaks":{...},"snaks-order":[]}}
			callback(data, error);

		}, POST_data, session);
	}

	function remove_references(GUID, reference_data, callback, options,
			API_URL, session, exists_references) {
		// console.trace(reference_data);
		// console.trace(exists_references);

		if (reference_data.value_processor)
			reference_data.value_processor(reference_list);

		var POST_data = {
			// TODO: baserevid
			statement : GUID,
			references : reference_data.reference_hash
		};

		append_parameters(POST_data, options);
		// console.trace(session.token);
		// console.trace(POST_data);

		wiki_API.query([ API_URL, 'action=wbremovereferences' ],
		// https://www.wikidata.org/w/api.php?action=help&modules=wbremovereferences
		function handle_result(data, error) {
			error = wiki_API.query.handle_error(data, error);
			// 检查伺服器回应是否有错误资讯。
			if (error) {
				library_namespace.error('remove_referencess: ' + error);
			}
			// console.trace(data);
			// console.trace(JSON.stringify(data));
			// data = { pageinfo: { lastrevid: 1 }, success: 1 }
			callback(data, error);
		}, POST_data, session);

	}

	/**
	 * references: {Pid:value}
	 * 
	 * @inner only for set_claims()
	 */
	function set_references(GUID, property_data, callback, options, API_URL,
			session, exists_references) {
		// console.trace(property_data);

		normalize_wikidata_properties(property_data, function(references) {
			if (!Array.isArray(references)) {
				var error;
				if (references) {
					var error = new Error(
							'set_references: Invalid references: '
									+ JSON.stringify(references));
					library_namespace.error(error);
				} else {
					// assert: 本次没有要设定 references 的资料。
				}
				callback(exists_references, error);
				return;
			}

			// console.trace(references);
			// console.trace(exists_references);

			// ----------------------------------

			// e.g., references:[{P1:'',language:'zh'},{P2:'',references:{}}]
			property_data.references = references;

			// console.log(references);

			// console.log(JSON.stringify(property_data.references));
			// console.log(property_data.references);

			var references_snaks = [];
			function serialize_reference(reference_data) {
				if (value_is_to_remove(reference_data)) {
					if (!exists_references || exists_references.length === 0) {
						library_namespace.error(
						//		
						'set_references: No reference to remove.');
						return;
					}

					var index = reference_data.reference_index >= 0
					//
					? reference_data.reference_index
					// default: remove latest reference
					: exists_references.length - 1;
					if (!exists_references[index]) {
						library_namespace.error(
						//		
						'set_references: No reference[' + index
								+ '] to remove.');
						return;
					}

					reference_data.reference_hash =
					//
					exists_references[index].hash;
					references_to_remove.push(reference_data);
					return;
				}

				if (reference_data.snaks) {
					// reference_data.snaks.forEach(serialize_reference);
					references_snaks.push(reference_data.snaks);
				} else if (!reference_data.property) {
					library_namespace
							.error('set_references: Invalid references: '
									+ JSON.stringify(reference_data));
				} else if (references[reference_data.property]) {
					references[reference_data.property].push(reference_data);
				} else {
					references[reference_data.property] = [ reference_data ];
				}
			}

			references = Object.create(null);
			property_data.references.forEach(serialize_reference);

			// ----------------------------------

			var reference_index = 0, references_to_remove = [];
			var latest_data_with_claim = exists_references;
			function remove_next_references(data, error) {
				if (error) {
					callback(data || latest_data_with_claim, error);
					return;
				}

				latest_data_with_claim = data;
				if (reference_index === references_to_remove.length) {
					process_next_references_snaks();
					return;
				}

				remove_references(GUID,
						references_to_remove[reference_index++],
						remove_next_references, options, API_URL, session,
						exists_references);
			}

			// console.trace(references);
			remove_next_references();

			// ----------------------------------

			function process_next_references_snaks(data, error) {
				if (references_snaks.length > 0) {
					set_single_references(GUID, references_snaks.shift(),
							process_next_references_snaks, options, API_URL,
							session, exists_references);
					return;
				}

				if (library_namespace.is_empty_object(references)) {
					callback(data || latest_data_with_claim, error);
					return;
				}

				latest_data_with_claim = data;
				set_single_references(GUID, references, callback, options,
						API_URL, session, exists_references);
			}

		}, exists_references && exists_references[0].snaks
		// 确保会设定 .remove / .exists_index = duplicate_index。
		|| Object.create(null),
		//
		Object.assign({
			// .process_sub_property 指的是可以全部删除的，即 .references。
			process_sub_property : 'references',
			language : property_data.references.language
					|| get_property(property_data, 'language') || options
					&& options.language,
			// [KEY_SESSION]
			session : session
		}));
	}

	// ----------------------------------------------------

	/**
	 * remove/delete/删除 property/claims
	 * 
	 * @inner only for set_claims()
	 */
	function remove_claims(exists_property_list, callback, options, API_URL,
			session, index) {
		if (index === wikidata_edit.remove_all) {
			// delete one by one
			index = exists_property_list.length;
			var remove_next_claim = function() {
				if (index-- > 0) {
					remove_claims(exists_property_list, remove_next_claim,
							options, API_URL, session, index);
				} else {
					callback();
				}
			};
			remove_next_claim();
			return;
		}

		library_namespace.debug('delete exists_property_list[' + index + ']: '
				+ JSON.stringify(exists_property_list[index]), 1,
				'remove_claims');
		var POST_data = {
			claim : exists_property_list[index].id
		};

		append_parameters(POST_data, options);

		wiki_API.query([ API_URL, {
			action : 'wbremoveclaims'
		} ], function handle_result(data, error) {
			error = wiki_API.query.handle_error(data, error);
			// console.log(data);
			// 检查伺服器回应是否有错误资讯。
			if (error) {
				library_namespace.error('remove_claims: ' + error);
			}
			// data =
			// {pageinfo:{lastrevid:1},success:1,claims:['Q1$123-ABC']}
			callback(data, error);
		}, POST_data, session);
	}

	/**
	 * edit property/claims
	 * 
	 * @inner only for wikidata_edit()
	 */
	function set_claims(data, token, callback, options, session, entity) {
		library_namespace.debug('normalize data: ' + JSON.stringify(data), 3,
				'set_claims');

		if (!data.claims) {
			library_namespace.debug(
					'把所有不是正规属性的当作是 claims property key，搬到 data.claims。'
							+ '正规属性留在原处。', 5, 'set_claims');
			data.claims = Object.create(null);
			for ( var key in data) {
				if (!(key in entity_properties)) {
					data.claims[key] = data[key];
					delete data[key];
				}
			}
		}
		if (library_namespace.is_empty_object(data.claims)) {
			delete data.claims;
		}

		var POST_data = {
			entity : options.id || entity && entity.id,
			// placeholder 占位符
			property : null,
			snaktype : null,
			value : null
		},
		// action to set properties. 创建Wikibase陈述。
		// https://www.wikidata.org/w/api.php?action=help&modules=wbcreateclaim
		claim_action = [ get_data_API_URL(options), {
			action : 'wbcreateclaim'
		} ],
		// process to what index of {Array}claims
		claim_index = 0;

		if (!POST_data.entity) {
			// console.log(options);
			if (!options.title) {
				throw new Error('set_claims: No entity id specified!');
			}

			// 取得 id
			wikidata_entity({
				site : options.site,
				title : decodeURIComponent(options.title)
			}, function(_entity, error) {
				if (error) {
					callback(undefined, error);
					return;
				}
				// console.log(_entity);
				options = Object.assign({
					id : _entity.id
				}, options);
				delete options.site;
				delete options.title;
				set_claims(data, token, callback,
				//
				options, session, entity && entity.claims ? entity : _entity);
			},
			// 若是未输入 entity，那就取得 entity 内容以帮助检查是否已存在相同属性值。
			Object.assign(entity && entity.claims ? {
				props : ''
			} : Object.create(null), options));
			return;
		}

		if (!entity || !entity.claims) {
			library_namespace.debug('未输入 entity 以供检查是否已存在相同属性值。', 1,
					'set_claims');
		}

		// TODO: 可结合成 wbsetclaim
		// https://www.wikidata.org/w/api.php?action=help&modules=wbsetclaim

		append_parameters(POST_data, options);

		// the token should be sent as the last parameter.
		POST_data.token = token;

		var set_next_claim = function() {
			var claims = data.claims;
			// assert: {Array}claims
			// console.trace(data.claims);
			library_namespace.debug('claims: ' + JSON.stringify(claims), 3,
					'set_next_claim');
			// console.log(claim_index + '-'.repeat(60));
			// console.log(data);
			// console.log(claims);
			if (claim_index === claims.length) {
				library_namespace.debug('done. 已处理完所有能处理的。 callback();', 2,
						'set_next_claim');
				// 去除空的设定。
				if (library_namespace.is_empty_object(data.claims)) {
					delete data.claims;
				}

				// console.log('' + callback);
				callback();
				return;
			}

			var property_data = claims[claim_index];
			if (!property_data) {
				// Should not go to here!
				library_namespace
						.error('set_next_claim: No property_data get!');
				console.trace([ claim_index, claims ]);
				shift_to_next();
				return;
			}
			var mainsnak = property_data.mainsnak || property_data, property_id = mainsnak.property, exists_property_list = entity
					&& entity.claims && entity.claims[property_id];
			// console.trace([ property_id, mainsnak, property_data ]);

			if (property_data.remove === wikidata_edit.remove_all) {
				// assert: 有此属性id
				// delete: {P1:CeL.wiki.edit_data.remove_all}
				library_namespace.debug(
						'delete ' + property_id + ' one by one', 1,
						'set_next_claim');
				remove_claims(exists_property_list, shift_to_next, POST_data,
						claim_action[0], session, property_data.remove);
				return;
			}

			// ((true >= 0))
			if (typeof property_data.remove === 'number'
					&& property_data.remove >= 0) {
				// delete: {P1:value,remove:true}
				library_namespace.debug('delete ' + property_id + '['
						+ property_data.remove + ']', 1, 'set_next_claim');
				remove_claims(exists_property_list, shift_to_next, POST_data,
						claim_action[0], session, property_data.remove);
				return;
			}

			if (value_is_to_remove(property_data)) {
				library_namespace.error('set_next_claim: Invalid .remove ['
						+ property_data.remove + '].');
				shift_to_next();
				return;
			}

			if (property_data.exists_index >= 0) {
				library_namespace.debug('Skip ' + property_id + '['
						+ property_data.exists_index + ']: 此属性已存在相同值 ['
						+ wikidata_datavalue(property_data) + ']'
						+ (options.force_add_sub_properties
						//
						? '，但依旧处理其 rank / qualifiers / references 设定' : '')
						+ '。', 1, 'set_next_claim');
				// console.trace([ property_data, claims ]);

				if (!options.force_add_sub_properties || !property_data.rank
						&& !property_data.qualifiers
						&& !property_data.references) {
					// default: 跳过已存在相同属性值之 rank / qualifiers / references 设定。
					// 因为此时 rank / qualifiers / references 可能为好几组设定，不容易分割排除重复
					// rank / qualifiers / references，结果将会造成重复输入。
					shift_to_next();
					return;
				}

				var process_references = function process_references() {
					if (!property_data.references) {
						shift_to_next();
						return;
					}

					// 即使已存在相同属性值，依然添增/处理其 references 设定。
					var exists_references = entity.claims[property_id][property_data.exists_index].references;
					// console.trace(exists_references);
					set_references(
							exists_property_list[property_data.exists_index].id,
							property_data, shift_to_next, POST_data,
							claim_action[0], session,
							// should use .references[*].snaks
							exists_references);
				};

				var process_qualifiers = function process_qualifiers(result,
						error) {
					if (!error && result && result.claim)
						entity.claims[property_id][property_data.exists_index] = result.claim;
					// 即使已存在相同属性值，依然添增/处理其 qualifiers 设定。
					var exists_qualifiers = entity.claims[property_id][property_data.exists_index].qualifiers;
					// console.trace(exists_qualifiers);
					// console.trace(property_data);
					POST_data.language = get_property(property_data, 'language')
							|| data.language;
					if (property_data.qualifiers) {
						set_qualifiers(
								exists_property_list[property_data.exists_index].id,
								property_data, process_references, POST_data,
								claim_action[0], session,
								// should use .qualifiers[*].snaks
								exists_qualifiers);
					} else {
						process_references();
					}
				};

				var process_rank = function process_rank() {
					// 即使已存在相同属性值，依然添增/处理其 rank 设定。
					var exists_rank = entity.claims[property_id][property_data.exists_index].rank;
					// console.trace(exists_rank);
					// console.trace(property_data);
					if (property_data.rank
							&& property_data.rank !== exists_property_list[property_data.exists_index].rank) {
						// TODO: using
						// https://www.wikidata.org/w/api.php?action=help&modules=wbsetclaim
						set_rank(
								exists_property_list[property_data.exists_index],
								property_data, process_qualifiers, POST_data,
								claim_action[0], session, exists_rank);
					} else {
						process_qualifiers();
					}
				};

				process_rank();

				return;
			}

			POST_data.property = property_id;
			// 照 datavalue 修改 POST_data。
			POST_data.snaktype = mainsnak.snaktype;
			if (POST_data.snaktype === 'value') {
				POST_data.value = JSON.stringify(mainsnak.datavalue.value);
			} else {
				// 不直接删掉 POST_data.value，因为此值为 placeholder 占位符。
				POST_data.value = '';
			}

			// console.log(JSON.stringify(POST_data));
			// console.trace(POST_data);

			wiki_API.query(claim_action, function handle_result(_data, error) {
				/**
				 * e.g., <code>
				_data: { pageinfo: { lastrevid: 000 }, success: 1, claim: { mainsnak: { ... }, type: 'statement', id: 'Q...', rank: 'normal' } }
				</code>
				 */
				// console.trace(_data);
				error = wiki_API.query.handle_error(_data, error);
				// console.trace([ error, property_data ]);
				// console.trace(data);
				if (data.language)
					POST_data.language = data.language;
				// console.trace(POST_data);
				// 检查伺服器回应是否有错误资讯。
				if (error) {
					/**
					 * e.g., <code>
					set_next_claim: [invalid-entity-id] Invalid entity ID. (The serialization "読み仮名" is not recognized by the configured id builders)
					</code>
					 */
					try {
						library_namespace.error('set_next_claim: ' + error);
						library_namespace.warn('claim_action: '
								+ JSON.stringify(claim_action));
						library_namespace.warn('data to write: '
								+ JSON.stringify(POST_data));
					} catch (e) {
					}
					// console.log(claim_index);
					// console.log(claims);
					claim_index++;
					set_next_claim();
					return;
				}

				process_rank();

				function process_rank() {
					if (property_data.rank
							&& property_data.rank !== _data.claim.rank) {
						library_namespace.debug('设定完主要数值，接著设定 rank。', 1,
								'set_next_claim');
						set_rank(_data.claim, property_data,
								process_qualifiers, POST_data, claim_action[0],
								session);

					} else {
						process_qualifiers();
					}
				}

				function process_qualifiers(result, error) {
					if (!error && result && result.claim)
						_data.claim = result.claim;
					if (property_data.qualifiers) {
						library_namespace.debug(
								'设定完主要数值 / rank，接著设定 qualifiers。', 1,
								'set_next_claim');
						set_qualifiers(_data.claim.id, property_data,
								process_references, POST_data, claim_action[0],
								session);

					} else {
						process_references();
					}
				}

				function process_references() {
					if (property_data.references) {
						// _data =
						// {"pageinfo":{"lastrevid":00},"success":1,"claim":{"mainsnak":{"snaktype":"value","property":"P1","datavalue":{"value":{"text":"name","language":"zh"},"type":"monolingualtext"},"datatype":"monolingualtext"},"type":"statement","id":"Q1$1-2-3","rank":"normal"}}

						library_namespace.debug(
								'设定完主要数值 / rank / qualifiers，接著设定 references。',
								1, 'set_next_claim');
						set_references(_data.claim.id, property_data,
								shift_to_next, POST_data, claim_action[0],
								session);

					} else {
						shift_to_next();
					}
				}

			}, POST_data, session);
			// console.log('set_next_claim: Waiting for ' + claim_action);
		},
		//
		shift_to_next = function() {
			var claims = data.claims;
			library_namespace.debug(claim_index + '/' + claims.length, 3,
					'shift_to_next');
			// 排掉能处理且已经处理完毕的 claim。
			if (claim_index === 0) {
				claims.shift();
			} else {
				// assert: claim_index>0
				claims.splice(claim_index, 1);
			}
			set_next_claim();
		};

		// 先正规化再 edit。
		normalize_wikidata_properties(data.claims, function(claims) {
			if (!Array.isArray(claims)) {
				if (claims) {
					library_namespace.error('set_claims: Invalid claims: '
							+ JSON.stringify(claims));
				} else {
					// assert: 本次没有要设定 claim 的资料。
				}
				callback();
				return;
			}

			// e.g., claims:[{P1:'',language:'zh'},{P2:'',references:{}}]
			data.claims = claims;

			// console.log(claims);
			// console.trace(JSON.stringify(claims));
			set_next_claim();
		}, entity && entity.claims
		// 确保会设定 .remove / .exists_index = duplicate_index。
		|| Object.create(null),
		//
		Object.assign({
			language : data.language,
			// [KEY_SESSION]
			session : session
		}, options));
	}

	if (false) {
		// examples

		// Cache the id of "性质" first. 先快取必要的属性id值。
		CeL.wiki.data.search.use_cache('性质', function(id_list) {
			// Get the id of property '性质' first.
			// and here we get the id of '性质': "P31"
			CeL.log(id_list);
			// 执行剩下的程序. run rest codes.
		}, {
			must_callback : true,
			type : 'property'
		});

		// ----------------------------
		// rest codes:

		// Set up the wiki instance.
		var wiki = CeL.wiki.login(user_name, password, 'zh');

		wiki.data('维基数据沙盒2', function(data_JSON) {
			CeL.wiki.data.search.use_cache('性质', function(id_list) {
				data_JSON.value('性质', {
					// resolve wikibase-item
					resolve_item : true
				}, function(entity) {
					// get "Wikidata Sandbox"
					CeL.log(entity.value('label', 'en'));
				});
			}, {
				must_callback : true,
				type : 'property'
			});
		});

		// If we have run CeL.wiki.data.search.use_cache('性质')
		// first or inside it...
		wiki.data('维基数据沙盒2', function(data_JSON) {
			data_JSON.value('性质', {
				// resolve wikibase-item
				resolve_item : true
			}, function(entity) {
				// get "Wikidata Sandbox"
				CeL.log(entity.value('label', 'en'));
			});
		});

		// Old style. The same effect as codes above.
		wiki.data('维基数据沙盒2', function(data_JSON) {
			// Here we are running the callback.
			CeL.wiki.data.search.use_cache('性质', function(id_list) {
				wiki.data(data_JSON.value('性质'), function(entity) {
					// via wikidata_entity_value()
					// get "维基数据测试沙盒"
					CeL.log(entity.value('label'));
				});
			}, {
				must_callback : true,
				type : 'property'
			});
		});

		wiki.data('维基数据沙盒2', function(data_JSON) {
			wiki.data(data_JSON.value('性质'), function(entity) {
				// via wikidata_entity_value()
				// get "维基数据测试沙盒"
				CeL.log(entity.value('label'));
			});
		});

		// edit properties
		wiki.edit_data(function(entity) {
			// add new / set single value with references
			return {
				生物俗名 : '维基数据沙盒2',
				language : 'zh-tw',
				references : {
					台湾物种名录物种编号 : 123456,
					// [[d:Special:AbuseFilter/54]]
					// 导入自 : 'zhwiki',
					载于 : '台湾物种名录物种',
					来源网址 : 'https://www.wikidata.org/',
					检索日期 : new Date
				}
			};

			// set multiple values
			return {
				labels : {
					ja : 'ウィキデータ・サンドボックス2',
					'zh-tw' : [ '维基数据沙盒2', '维基数据沙盒#2', '维基数据沙盒-2' ]
				},
				descriptions : {
					'zh-tw' : '作为沙盒以供测试功能'
				},
				claims : [ {
					生物俗名 : [ 'SB2#1', 'SB2#2', 'SB2#3' ],
					multi : true,
					language : 'zh-tw',
					references : {
						台湾物种名录物种编号 : 123456
					}
				}, {
					読み仮名 : 'かな',
					language : 'ja',
					references : {
						// P143
						'imported from Wikimedia project' : 'jawikipedia'
					}
				} ]
			};

			// remove specified value 生物俗名=SB2
			return {
				生物俗名 : 'SB2',
				language : 'zh-tw',
				remove : true
			};

			// to remove ALL "生物俗名"
			return {
				生物俗名 : CeL.wiki.edit_data.remove_all,
				language : 'zh-tw'
			};

		}, {
			bot : 1,
			summary : 'bot test: edit properties'
		});

		// ----------------------------

		// add property/claim to Q13406268
		wiki.data('维基数据沙盒2', function(data_JSON) {
			data_JSON;
		}).edit_data(function(entity) {
			return {
				生物俗名 : '维基数据沙盒2',
				language : 'zh-tw'
			};
		}, {
			bot : 1,
			summary : 'bot test: edit property'
		});

		// delete property/claim (all 生物俗名)
		wiki.data('维基数据沙盒2', function(data_JSON) {
			data_JSON;
		}).edit_data(function(entity) {
			return {
				生物俗名 : CeL.wiki.edit_data.remove_all,
				language : 'zh-tw'
			};
		}, {
			bot : 1,
			summary : 'bot test: edit property'
		});

		// delete property/claim (生物俗名=维基数据沙盒2)
		wiki.data('维基数据沙盒2', function(data_JSON) {
			data_JSON;
		}).edit_data(function(entity) {
			return {
				生物俗名 : '维基数据沙盒2',
				language : 'zh-tw',
				remove : true
			};
		}, {
			bot : 1,
			summary : 'bot test: edit property'
		});

		wiki.data('维基数据沙盒2', function(data_JSON) {
			data_JSON;
		}).edit_data(function(entity) {
			return {
				生物俗名 : '维基数据沙盒2',
				language : 'zh-tw',
				references : {
					台湾物种名录物种编号 : 123456,
					// [[d:Special:AbuseFilter/54]]
					// 导入自 : 'zhwiki',
					载于 : '台湾物种名录物种',
					来源网址 : 'https://www.wikidata.org/',
					检索日期 : new Date
				}
			};
		}, {
			bot : 1,
			summary : 'bot test: edit property'
		});

		// ----------------------------

		// using [,'2008 Canadian federal election'] or {en:'2008 Canadian
		// federal election'} to search the entity named '2008 Canadian federal
		// election' in English, else will treat as plain text '2008 Canadian
		// federal election'

		// remove claim: 'candidacy in election'
		// = '2008 Canadian federal election'
		wiki.data('Wikidata Sandbox 2', function(data) {
			result = data;
		}).edit_data(function(entity) {
			return {
				'candidacy in election' :
				//
				[ , '2008 Canadian federal election' ],
				remove : true,
				language : 'en'
			};
		}, {
			bot : 1,
			summary : 'bot test: edit property'
		});

		// create claim: 'candidacy in election'
		// = '2008 Canadian federal election' with qualifiers and references
		wiki.data('Wikidata Sandbox 2', function(data) {
			result = data;
		}).edit_data(function(entity) {
			return {
				'candidacy in election' :
				//
				[ , '2008 Canadian federal election' ],
				qualifiers : {
					'votes received' : 8937,
					'electoral district' : 'Terrebonne—Blainville',
					'parliamentary group' : 'Liberal Party of Canada'
				},
				references : {
					'reference URL' : "http://example.com/",
					publisher : 'Library of Parliament (Canada)',
					retrieved : new Date
				},
				language : 'en'
			};
		}, {
			bot : 1,
			summary : 'bot test: edit property'
		});

		// remove 'votes received' of claim: 'candidacy in election'
		// = '2008 Canadian federal election'
		wiki.data('Wikidata Sandbox 2', function(data) {
			result = data;
		}).edit_data(function(entity) {
			return {
				'candidacy in election' :
				//
				[ , '2008 Canadian federal election' ],
				qualifiers : {
					'votes received' : {
						remove : true
					}
				},
				language : 'en'
			};
		}, {
			bot : 1,
			summary : 'bot test: edit property',
			force_add_sub_properties : true
		});

		// add 'votes received' of claim: 'candidacy in election'
		// = '2008 Canadian federal election'
		wiki.data('Wikidata Sandbox 2', function(data) {
			result = data;
		}).edit_data(function(entity) {
			return {
				'candidacy in election' :
				//
				[ , '2008 Canadian federal election' ],
				qualifiers : {
					'votes received' : 8938
				},
				language : 'en'
			};
		}, {
			bot : 1,
			summary : 'bot test: edit property',
			force_add_sub_properties : true
		});

		// remove 'parliamentary group' of claim: 'candidacy in election'
		// = '2008 Canadian federal election'
		wiki.data('Wikidata Sandbox 2', function(data) {
			result = data;
		}).edit_data(function(entity) {
			return {
				'candidacy in election' :
				//
				[ , '2008 Canadian federal election' ],
				qualifiers : {
					'parliamentary group' : {
						remove : true
					}
				},
				language : 'en'
			};
		}, {
			bot : 1,
			summary : 'bot test: edit property',
			force_add_sub_properties : true
		});

		// add 'member of political party' of claim: 'candidacy in election'
		// = '2008 Canadian federal election'
		wiki.data('Wikidata Sandbox 2', function(data) {
			result = data;
		}).edit_data(function(entity) {
			return {
				'candidacy in election' :
				//
				[ , '2008 Canadian federal election' ],
				qualifiers : {
					'member of political party' : 'Liberal Party of Canada'
				},
				language : 'en'
			};
		}, {
			bot : 1,
			summary : 'bot test: edit property',
			force_add_sub_properties : true
		});

		// remove ALL references of claim: 'candidacy in election'
		// = '2008 Canadian federal election'
		wiki.data('Wikidata Sandbox 2', function(data) {
			result = data;
		}).edit_data(function(entity) {
			return {
				'candidacy in election' :
				//
				[ , '2008 Canadian federal election' ],
				references : {
					remove : true
				},
				language : 'en'
			};
		}, {
			bot : 1,
			summary : 'bot test: edit property',
			force_add_sub_properties : true
		});
	}

	// ----------------------------------------------------

	// TODO:
	// data.labels + data.aliases:
	// {language_code:[label,{value:label,language:language_code,remove:''},...],...}
	// or will auto-guess language 未指定语言者将会自动猜测:
	// [label,{value:label,language:language_code,remove:''},{value:label,remove:''}]
	// or
	// [ [language_code,label], [language_code,label], ... ]
	//
	// 正规化 →
	// {language_code:[label_1,label_2,...],...}
	//
	// 去掉重复的标签 →
	// {language_code:[label_1,label_2,...],...}
	// + .remove: {language_code:[label_1,label_2,...],...}
	//
	// → data.labels = {language_code:{value:label,language:language_code},...}
	// + data.aliases =
	// {language_code:[{value:label,language:language_code}],...}

	// adjust 调整 labels to aliases
	// @see wikidata_edit.add_labels
	function normalize_labels_aliases(data, entity, options) {
		var label_data = data.labels;
		if (typeof label_data === 'string') {
			label_data = [ label_data ];
		}

		if (library_namespace.is_Object(label_data)) {
			// assert: 调整 {Object}data.labels。
			// for
			// {en:[{value:label,language:language_code},{value:label,language:language_code},...]}
			var labels = [];
			for ( var language in label_data) {
				var label = label_data[language];
				if (Array.isArray(label)) {
					label.forEach(function(l) {
						// assert: {Object}l
						labels.push({
							language : language,
							value : l
						});
					});
				} else {
					labels.push(typeof label === 'string' ? {
						language : language,
						value : label
					}
					// assert: {Object}label || [language,label]
					: label);
				}
			}
			label_data = labels;

		} else if (!Array.isArray(label_data)) {
			if (label_data !== undefined) {
				// error?
			}
			return;
		}

		// assert: {Array}label_data = [label,label,...]

		// for
		// [{value:label,language:language_code},{value:label,language:language_code},...]

		// 正规化 →
		// labels = {language_code:[label_1,label_2,...],...}
		var labels = Object.create(null),
		// 先指定的为主labels，其他多的labels放到aliases。
		aliases = data.aliases || Object.create(null),
		// reconstruct labels
		error_list = label_data.filter(function(label) {
			if (!label && label !== '') {
				// Skip null label.
				return;
			}

			if (typeof label === 'string') {
				label = {
					language : wiki_API.site_name(options, {
						get_all_properties : true
					}).language || guess_language(label),
					value : label
				};
			} else if (is_api_and_title(label, 'language')) {
				label = {
					language : label[0] || guess_language(label[1]),
					value : label[1]
				};
			} else if (!label.language
			//
			|| !label.value && !('remove' in label)) {
				library_namespace.error('set_labels: Invalid label: '
						+ JSON.stringify(label));
				return true;
			}

			if (!(label.language in labels) && entity && entity.labels
					&& entity.labels[label.language]) {
				labels[label.language]
				// 不佚失原label。
				= entity.labels[label.language].value;
			}

			if (!labels[label.language] || !labels[label.language].value
			//
			|| ('remove' in labels[label.language])) {
				// 设定成为新的值。
				labels[label.language] = label;
				return;
			}

			// 先指定的为主labels，其他多的labels放到aliases。
			if (aliases[label.language]) {
				// assert: Array.isArray(aliases[label.language])
				aliases[label.language].push(label);
			} else {
				aliases[label.language] = [ label ];
			}
		});

		// 去除空的设定。
		if (library_namespace.is_empty_object(labels)) {
			delete data.labels;
		} else {
			data.labels = labels;
		}

		if (library_namespace.is_empty_object(aliases)) {
			delete data.aliases;
		} else {
			data.aliases = aliases;
		}

		// return error_list;
	}

	/**
	 * edit labels
	 * 
	 * @inner only for wikidata_edit()
	 */
	function set_labels(data, token, callback, options, session, entity) {
		if (!data.labels) {
			// Nothing to set
			callback();
			return;
		}

		normalize_labels_aliases(data, entity, options);

		var data_labels = data.labels;
		// e.g., data.labels={language_code:label,language_code:[labels],...}
		if (!library_namespace.is_Object(data_labels)) {
			library_namespace.error('set_labels: Invalid labels: '
					+ JSON.stringify(data_labels));
			callback();
			return;
		}

		var labels_to_set = [];
		for ( var language in data_labels) {
			var label = data_labels[language];
			if (!library_namespace.is_Object(label)) {
				library_namespace.error('set_labels: Invalid label: '
						+ JSON.stringify(label));
				continue;
			}

			labels_to_set.push(label);
		}

		if (labels_to_set.length === 0) {
			callback();
			return;
		}

		var POST_data = {
			id : options.id,
			language : '',
			value : ''
		};

		append_parameters(POST_data, options);

		// the token should be sent as the last parameter.
		POST_data.token = token;

		var index = 0,
		// https://www.wikidata.org/w/api.php?action=help&modules=wbsetlabel
		action = [ get_data_API_URL(options), 'action=wbsetlabel' ];

		function set_next_labels() {
			if (index === labels_to_set.length) {
				library_namespace.debug('done. 已处理完所有能处理的。 callback();', 2,
						'set_next_labels');
				// 去除空的设定。
				if (library_namespace.is_empty_object(data.labels)) {
					delete data.labels;
				}

				callback();
				return;
			}

			var label = labels_to_set[index++];
			// assert: 这不会更改POST_data原有keys之顺序。
			// Object.assign(POST_data, label);

			POST_data.language = label.language;
			// wbsetlabel 处理 value='' 时会视同 remove。
			POST_data.value = 'remove' in label ? ''
			// assert: typeof label.value === 'string' or 'number'
			: label.value;

			// 设定单一 Wikibase 实体的标签。
			wiki_API.query(action, function handle_result(data, error) {
				error = wiki_API.query.handle_error(data, error);
				// 检查伺服器回应是否有错误资讯。
				if (error) {
					/**
					 * e.g., <code>

					</code>
					 */
					library_namespace.error('set_next_labels: ' + error);
				} else {
					// successful done.
					delete data_labels[label.language];
				}

				set_next_labels();

			}, POST_data, session);
		}

		set_next_labels();

		// TODO: set sitelinks
		// TODO: 可拆解成 wbsetsitelink
	}

	/**
	 * edit aliases
	 * 
	 * @inner only for wikidata_edit()
	 */
	function set_aliases(data, token, callback, options, session, entity) {
		if (!data.aliases) {
			// Nothing to set
			callback();
			return;
		}

		// console.log(data.aliases);

		var data_aliases = data.aliases, aliases_queue;
		if (Array.isArray(data_aliases)) {
			aliases_queue = data_aliases;
			data_aliases = Object.create(null);
			aliases_queue.forEach(function(alias) {
				// 判别 language。
				var value = alias && alias.value, language = alias.language
						|| options.language || guess_language(value);
				if (language in data_aliases) {
					data_aliases[language].push(alias);
				} else {
					data_aliases[language] = [ alias ];
				}
			});

		} else if (!library_namespace.is_Object(data_aliases)) {
			library_namespace.error('set_aliases: Invalid aliases: '
					+ JSON.stringify(data_aliases));
			callback();
			return;
		}

		aliases_queue = [];
		for ( var language in data_aliases) {
			var alias_list = data_aliases[language];
			if (!Array.isArray(alias_list)) {
				if (alias_list === wikidata_edit.remove_all) {
					// 表示 set。
					aliases_queue.push([ language, [] ]);
				} else if (alias_list && typeof alias_list === 'string') {
					// 表示 set。
					aliases_queue.push([ language, [ alias_list ] ]);
				} else {
					library_namespace.error('set_aliases: Invalid aliases: '
							+ JSON.stringify(alias_list));
				}
				continue;
			}

			var aliases_to_add = [], aliases_to_remove = [];
			alias_list.forEach(function(alias) {
				if (!alias) {
					// 跳过没东西的。
					return;
				}
				if ('remove' in alias) {
					if (alias.remove === wikidata_edit.remove_all) {
						// 表示 set。这将会忽略所有remove。
						aliases_to_remove = undefined;
					} else if ('value' in alias) {
						if (aliases_to_remove) {
							aliases_to_remove.push(alias.value);
						}
					} else {
						library_namespace
								.error('set_aliases: No value to value for '
										+ language);
					}
				} else if ('set' in alias) {
					// 表示 set。这将会忽略所有remove。
					aliases_to_remove = undefined;
					aliases_to_add = [ alias.value ];
					// 警告:当使用 wbeditentity，并列多个未设定 .add 之 alias 时，
					// 只会加入最后一个。但这边将会全部加入，因此行为不同！
				} else if (alias.value === wikidata_edit.remove_all) {
					// 表示 set。这将会忽略所有remove。
					aliases_to_remove = undefined;
				} else {
					aliases_to_add.push(alias.value);
				}
			});

			if (aliases_to_add.length > 0 || aliases_to_remove > 0) {
				aliases_queue.push([ language, aliases_to_add.unique(),
						aliases_to_remove && aliases_to_remove.unique() ]);
			}
		}

		if (aliases_queue.length === 0) {
			callback();
			return;
		}

		// console.log(aliases_queue);

		var POST_data = {
			id : options.id,
			language : ''
		// set : '',
		// add : '',
		// remove : ''
		};

		append_parameters(POST_data, options);

		var
		// https://www.wikidata.org/w/api.php?action=help&modules=wbsetaliases
		action = [ get_data_API_URL(options), 'action=wbsetaliases' ];

		function set_next_aliases() {
			if (aliases_queue.length === 0) {
				library_namespace.debug('done. 已处理完所有能处理的。 callback();', 2,
						'set_next_aliases');
				// 有错误也已经提醒。
				delete data.aliases;

				callback();
				return;
			}

			var aliases_data = aliases_queue.pop();
			// assert: 这不会更改POST_data原有keys之顺序。

			POST_data.language = aliases_data[0];
			if (aliases_data[2]) {
				delete POST_data.set;
				POST_data.add = aliases_data[1].join('|');
				POST_data.remove = aliases_data[2].join('|');
			} else {
				delete POST_data.add;
				delete POST_data.remove;
				POST_data.set = aliases_data[1].join('|');
			}

			// the token should be sent as the last parameter.
			delete POST_data.token;
			POST_data.token = token;

			// 设定单一 Wikibase 实体的标签。
			wiki_API.query(action, function handle_result(data, error) {
				error = wiki_API.query.handle_error(data, error);
				// 检查伺服器回应是否有错误资讯。
				if (error) {
					/**
					 * e.g., <code>

					</code>
					 */
					library_namespace.error('set_next_aliases: ' + error);
				} else {
					// successful done.
				}

				set_next_aliases();

			}, POST_data, session);
		}

		set_next_aliases();
	}

	/**
	 * edit descriptions
	 * 
	 * @inner only for wikidata_edit()
	 */
	function set_descriptions(data, token, callback, options, session, entity) {
		if (!data.descriptions) {
			// Nothing to set
			callback();
			return;
		}

		// console.log(data.descriptions);

		var data_descriptions = data.descriptions;
		if (typeof data_descriptions === 'string') {
			data_descriptions = [ data_descriptions ];
		}

		if (library_namespace.is_Object(data_descriptions)) {
			// assert: 调整 {Object}data.descriptions。
			// for
			// {en:[{value:label,language:language_code},{value:label,language:language_code},...]}
			var descriptions = [];
			for ( var language in data_descriptions) {
				var description = data_descriptions[language];
				if (Array.isArray(description)) {
					description.forEach(function(d) {
						// assert: {Object}d
						descriptions.push({
							language : language,
							value : d
						});
					});
				} else {
					descriptions.push(typeof description === 'string' ? {
						language : language,
						value : description
					}
					// assert: {Object}description || [language,description]
					: description);
				}
			}
			data_descriptions = descriptions;

		} else if (!Array.isArray(data_descriptions)) {
			if (data_descriptions !== undefined) {
				// error?
			}
			return;
		}

		// 正规化 →
		// descriptions = {language_code:description,...}
		var descriptions = Object.create(null),
		//
		default_lang = session.language || session[KEY_HOST_SESSION].language
				|| wiki_API.language,
		// reconstruct labels
		error_list = data_descriptions.filter(function(description) {
			var language;
			if (typeof description === 'string') {
				language = wiki_API.site_name(options, {
					get_all_properties : true
				}).language || guess_language(description) || default_lang;
			} else if (is_api_and_title(description, 'language')) {
				language = description[0] || guess_language(description[1])
						|| default_lang;
				description = description[1];
			} else if (!description || !description.language
			//
			|| !description.value && !('remove' in description)) {
				library_namespace
						.error('set_descriptions: Invalid descriptions: '
								+ JSON.stringify(description));
				return true;
			} else {
				language = description.language
						|| wiki_API.site_name(options, {
							get_all_properties : true
						}).language || guess_language(description.value)
						|| default_lang;
				if ('remove' in description) {
					description = '';
				} else {
					description = description.value;
				}
			}

			// 设定成为新的值。
			descriptions[language] = description || '';
		});

		// 去除空的设定。
		if (library_namespace.is_empty_object(descriptions)) {
			delete data.descriptions;
			callback();
			return;
		}

		// console.log(descriptions);

		var POST_data = {
			id : options.id,
			language : '',
			value : ''
		};

		append_parameters(POST_data, options);

		// the token should be sent as the last parameter.
		POST_data.token = token;

		var description_keys = Object.keys(descriptions),
		// https://www.wikidata.org/w/api.php?action=help&modules=wbsetdescription
		action = [ get_data_API_URL(options), 'action=wbsetdescription' ];

		function set_next_descriptions() {
			if (description_keys.length === 0) {
				library_namespace.debug('done. 已处理完所有能处理的。 callback();', 2,
						'set_next_descriptions');
				// 有错误也已经提醒。
				delete data.descriptions;

				callback();
				return;
			}

			var language = description_keys.pop();
			// assert: 这不会更改POST_data原有keys之顺序。

			POST_data.language = language;
			POST_data.value = descriptions[language];

			// 设定单一 Wikibase 实体的标签。
			wiki_API.query(action, function handle_result(data, error) {
				error = wiki_API.query.handle_error(data, error);
				// 检查伺服器回应是否有错误资讯。
				if (error) {
					/**
					 * e.g., <code>

					{"error":{"code":"failed-save","info":"The save has failed.","messages":[{"name":"wikibase-api-failed-save","parameters":[],"html":{"*":"The save has failed."}},{"name":"abusefilter-warning","parameters":["Adding non-latin script language description in latin script","48"],"html":{"*":"..."}}],"*":"See https://www.wikidata.org/w/api.php for API usage. Subscribe to the mediawiki-api-announce mailing list at &lt;https://lists.wikimedia.org/postorius/lists/mediawiki-api-announce.lists.wikimedia.org/&gt; for notice of API deprecations and breaking changes."},"servedby":"mw1377"}

					</code>
					 */
					library_namespace.error('set_next_descriptions: '
							+ language + '=' + JSON.stringify(POST_data.value)
							+ ': ' + error);
				} else {
					// successful done.
				}

				set_next_descriptions();

			}, POST_data, session);
		}

		set_next_descriptions();
	}

	function set_sitelinks(data, token, callback, options, session, entity) {
		// console.trace(data);
		var sitelinks = data.sitelinks;
		if (library_namespace.is_Object(sitelinks)) {
			// Convert to {Array}
			data.sitelinks = Object.keys(sitelinks).map(function(sitelink) {
				var sitelink_data = sitelinks[sitelink];
				if (typeof sitelink_data === 'string') {
					return {
						site : sitelink,
						title : sitelink_data
					};
				}
				// assert: library_namespace.is_Object(sitelink_data)
				// e.g., {title:'',badges:['',],new:'item'}
				if (!sitelink_data.site) {
					sitelink_data.site = sitelink;
				} else {
					// assert: sitelink_data.site === sitelink
				}
				return sitelink_data;
			});
		}
		// console.trace(data);

		// TODO:
		// https://www.wikidata.org/w/api.php?action=help&modules=wbsetsitelink

		callback();
	}

	// ----------------------------------------------------

	/**
	 * @example<code>
	//	2021/7/3 18:9:28

	language_string	=	{language:'zh-tw', value:''}
	// simplify → value

	sitelink = {
		site:			'zhwiki',
		title:			'',
		//badges:		['Q17437798']
	}
	// simplify → title??

	snak = {
		snaktype:'value',
		property:		'P00',
		//hash:'R/O',
		datavalue: {
			value:'', type:'string'
			//value:{'entity-type':'item','id':'Q000'}, type:'wikibase-entityid'
		},
		//datatype:	'可省略'
	}
	// simplify → string, {Date}, number, ...

	snaks = {
		//hash:'R/O'
		snaks:			[ snak, ],
		//snaks-order:	[ 'P00', ]
	}

	claim = {
		mainsnak:		snak,
		type:			'statement',
		qualifiers:		[ snak, ],
		//qualifiers-order: [ 'P00', ],
		//id:'R/O: Q00$...',
		//rank:			'normal|preferred|deprecated',
		references:		[ snaks, ],
	}

	//data_to_modify
	entity = {
		//id:			'Q000',
		labels:			[ language_string, ],
		aliases:		[ language_string, ],
		descriptions:	[ language_string, ],
		claims:			[ claim, ],
		sitelinks:		[ sitelink, ],
		type:	'item'
	}

	// ------------------------------------------

	// TODO:
	
	// 目的在制造出方便存取组成成分，并且其值能直接用在 wbeditentity 的 object。
	entity = await CeL.wiki.data.Entity('Q000', options)
	entity = await CeL.wiki.data.Entity([language,value], options)

	entity.add_label(value, options)
	entity.get_label(language, options): language_string

	entity.add_alias(value, options)
	entity.get_aliases(language, options): [ language_string, ]

	entity.add_description(value, options)
	entity.get_description(language, options): language_string

	await entity.add_sitelink(title, options)
	entity.get_sitelink(site, options): {Sitelink}

	await entity.add_claim(Claim)
	entity.get_claims(property): [ Claim, ]

	// publish, 写入网路上的wiki伺服器
	await entity.write()
	// reget, 取得最新版本
	await entity.refresh()

	await claim.set_mainsnak(Snak)
	//claim.get_mainsnak(): Snak===claim.mainsnak

	await claim.add_qualifier(Snak)
	claim.get_qualifier(property): Snak

	await claim.add_references([ Snak, ])
	claim.get_references(filter): [ Snak, ]

	snak.get_value(): String, number, Date, ...

	// ------------------------------------------

	// TODO:
	//data_to_modify
	.edit_data({
		//new:		'item',
		id:			Q_label,

		labels:			{ language: ''  , },
		aliases:		{ language:['',], },
		descriptions:	{ language: ''  , },
		claims:	{
			P_label: [ {
				mainsnak || value:	snak_value,
				qualifiers:	{P_label:snak_value,},
				//qualifiers-order: [ 'P00', ],
				//rank:	'normal|preferred|deprecated',
				references:	[
					[
						{P_label:snak_value,},
						//{snaks-order:[ 'P00', ]}
					],
				],
			}, ],
		},
		sitelinks:	{
			site:		'',
			site:		{title:'',badges:['',]}
		}
	});

	Q_label: 'Q000'	|| 'language:title'
	P_label: 'P00'	|| 'language:title'
	snak_value:	'Q000' || 'string value' || 123 || Date()
		|| {value:'', type:'string'}
		|| {datavalue: {value:'', type:'string'}, datatype:''}

	</code>
	 */

	/**
	 * Creates or modifies Wikibase entity. 创建或编辑Wikidata实体。
	 * 
	 * 注意: 若是本来已有某个值（例如 label），采用 add 会被取代。或须侦测并避免更动原有值。
	 * 
	 * @example<code>

	 wiki = Wiki(true, 'test.wikidata');

	// Create new item.
	wiki.edit_data({},{new:'item',bot:1,summary:'Create new item'});
	wiki.edit_data({labels:{en:"Evolution in Mendelian Populations"},P698:"17246615",P932:"1201091"},{bot:1,summary:'Test edit'});

	 // TODO:
	 wiki.page('宇宙').data(function(entity){result=entity;console.log(entity);}).edit(function(){return '';}).edit_data(function(){return {};});
	 wiki.page('宇宙').edit_data(function(entity){result=entity;console.log(entity);});

	 </code>
	 * 
	 * @param {String|Array}id
	 *            id to modify or entity you want to create.<br />
	 *            item/property 将会创建实体。
	 * @param {Object|Function}data
	 *            used as the data source to modify. 要编辑（更改或创建）的资料。可能被更改！<br />
	 *            {Object}data or {Function}data(entity)
	 * @param {Object}token
	 *            login 资讯，包含“csrf”令牌/密钥。
	 * @param {Object}[options]
	 *            附加参数/设定选择性/特殊功能与选项
	 * @param {Function}callback
	 *            回调函数。 callback(entity, error)
	 * 
	 * @see https://www.wikidata.org/wiki/Wikidata:Creating_a_bot
	 * @see https://www.wikidata.org/wiki/Wikidata:Bots<br />
	 *      Monitor
	 *      https://www.wikidata.org/wiki/Wikidata:Database_reports/Constraint_violations<br />
	 *      Bots should add instance of (P31 性质) or subclass of (P279 上一级分类) or
	 *      part of (P361 属于) if possible<br />
	 *      Bots importing from Wikipedia should add in addition to imported
	 *      from (P143) also reference URL (P854) with the value of the full URL
	 *      and either retrieved (P813) or include the version id of the source
	 *      page in the full URL.
	 */
	function wikidata_edit(id, data, token, options, callback) {
		if (typeof options === 'function' && !callback) {
			// shift arguments.
			callback = options;
			options = null;
		}

		if (!library_namespace.is_Object(options)) {
			// 前置处理。
			options = Object.create(null);
		}

		if (!id && !options['new']) {
			callback(undefined, {
				code : 'no_id',
				message : 'Did not set id! 未设定欲取得之特定实体 id。'
			});
			return;
		}

		if (typeof data === 'function') {
			if (is_entity(id)) {
				library_namespace.debug('喂给(回传要编辑资料的)设定值函数 ' + id.id + ' ('
						+ (get_entity_label(id) || get_entity_link(id)) + ')。',
						2, 'wikidata_edit');
				// .call(options,):
				// 使(回传要编辑资料的)设定值函数能以 `this` 即时变更 options.summary。
				data = data.call(options, id);

			} else {
				if (false) {
					library_namespace.debug(
					// TypeError: Converting circular structure to JSON
					'Get id from ' + JSON.stringify(id), 3, 'wikidata_edit');
				}
				// console.trace(id);
				// console.trace(options);
				// library_namespace.set_debug(6)
				wikidata_entity(id, options.props, function(entity, error) {
					if (error) {
						library_namespace.debug('Get error '
								+ JSON.stringify(error), 3, 'wikidata_edit');
						callback(undefined, error);
						return;
					}
					if (false) {
						// TypeError: Converting circular structure to JSON
						library_namespace.debug('Get entity '
								+ JSON.stringify(entity), 3, 'wikidata_edit');
					}
					if ('missing' in entity) {
						// TODO: e.g., 此页面不存在/已删除。
						// return;
					}

					delete options.props;
					delete options.languages;
					// console.trace(entity);

					// .call(options,):
					// 使(回传要编辑资料的)设定值函数能以 `this` 即时变更 options.summary。
					// entity 可能是 {id:'M000',missing:''}
					data = data.call(options, entity, error);
					wikidata_edit(id, data, token, options, callback);
				}, options);
				return;
			}
		}

		var entity;
		if (is_entity(id)) {
			// 输入 id 为实体项目 entity
			entity = id;
			options.id = options.id || entity.id;
			if (!options.baserevid) {
				if (id.lastrevid > 0) {
					// 检测编辑冲突用。
					options.baserevid = id.lastrevid;
				} else {
					console.trace(id);
					throw new Error(
							'wikidata_edit: Invalid entity: No .lastrevid!');
				}
			}
			id = id.id;
		}

		var action = wiki_API.edit.check_data(data, id, options,
				'wikidata_edit');
		if (action) {
			library_namespace.debug('直接执行 callback。', 2, 'wikidata_edit');
			callback(undefined, action);
			return;
		}

		if (!id) {
			if (!options['new'])
				library_namespace
						.debug('未设定 id，您可能需要手动检查。', 2, 'wikidata_edit');

		} else if (is_entity(id)
		// && /^Q\d{1,10}$/.test(id.id)
		) {
			options.id = id.id;

		} else if (wiki_API.is_page_data(id)) {
			options.site = wiki_API.site_name(options);
			options.title = id.title;

		} else if (id === 'item' || id === 'property') {
			options['new'] = id;

		} else if (/^Q\d{1,10}$/.test(id)) {
			// e.g., 'Q1'
			options.id = id;

		} else if (is_api_and_title(id)) {
			options.site = wiki_API.site_name(id[0]);
			options.title = id[1];

		} else if (!options.id || options.id !== id) {
			library_namespace.warn('wikidata_edit: Invalid id: ' + id);
			// console.trace(id);
		}

		var session = wiki_API.session_of_options(options);
		// set_claims() 中之 get_data_API_URL() 会用到 options[KEY_SESSION];
		// delete options[KEY_SESSION];

		// edit 实体项目 entity
		action = [
		// https://www.wikidata.org/w/api.php?action=help&modules=wbeditentity
		get_data_API_URL(options), {
			action : 'wbeditentity'
		} ];
		// console.trace(options);
		// console.log(action);

		// 还存在此项可能会被汇入 query 中。但须注意删掉后未来将不能再被利用！
		delete options.API_URL;

		if (library_namespace.is_Object(token)) {
			token = token.csrftoken;
		}

		function do_wbeditentity() {
			for ( var key in data) {
				if (Array.isArray(data[key]) ? data[key].length === 0
						: library_namespace.is_empty_object(data[key])) {
					delete data[key];
				}
			}
			if (library_namespace.is_empty_object(data) && !options['new']) {
				callback(data);
				return;
			}

			var POST_data = Object.clone(options);
			delete POST_data.data_API_URL;
			delete POST_data[KEY_SESSION];
			// data 会在 set_claims() 被修改，因此不能提前设定。
			POST_data.data = JSON.stringify(data);
			if (library_namespace.is_debug(2)) {
				library_namespace.debug('POST_data.data: ' + POST_data.data, 2,
						'wikidata_edit.do_wbeditentity');
				console.log(data);
			}

			// the token should be sent as the last parameter.
			POST_data.token = token;

			// console.trace(POST_data);
			wiki_API.query(action, function handle_result(data, error) {
				error = wiki_API.query.handle_error(data, error);
				// 检查伺服器回应是否有错误资讯。
				if (error) {
					library_namespace.error(
					// e.g., "数据库被禁止写入以进行维护，所以您目前将无法保存您所作的编辑"
					// Mediawiki is in read-only mode during maintenance
					'wikidata_edit.do_wbeditentity: '
					//
					+ (POST_data.id ? POST_data.id + ': ' : '')
					// [readonly] The wiki is currently in read-only mode
					+ error);
					try {
						console.trace([ action, POST_data ]);
					} catch (e) {
						library_namespace.warn('action: '
						//
						+ JSON.stringify(action));
					}
					if (false) {
						// TypeError: Converting circular structure to JSON
						library_namespace.warn('data to write: '
								+ JSON.stringify(POST_data));
					}
					callback(data, error);
					return;
				}

				if (data.entity) {
					data = data.entity;
				}
				callback(data);
			}, POST_data, session);
		}

		if (false && Array.isArray(data)) {
			// TODO: 按照内容分类。
			library_namespace
					.warn('wikidata_edit.do_wbeditentity: Treat {Array}data as {claims:data}!');
			data = {
				claims : data
			};
		}

		// TODO: 创建实体项目重定向。
		// https://www.wikidata.org/w/api.php?action=help&modules=wbcreateredirect

		// console.trace(data);
		// console.trace(options);
		// console.trace(entity);

		if (!entity && options['new']
		// combine_edit_queries
		// https://doc.wikimedia.org/Wikibase/master/php/md_docs_topics_changeop_serializations.html
		|| options.wbeditentity_only) {
			delete options.wbeditentity_only;
			// 直接呼叫 wbeditentity
			do_wbeditentity();
			return;
		}

		delete options['new'];

		// TODO: 避免 callback hell: using ES7 async/await?
		// TODO: 用更简单的方法统合这几个函数。
		library_namespace.debug('Run set_labels', 2, 'wikidata_edit');
		// 先 set_labels() 可以在 history 早一点看到描述。
		set_labels(data, token, function() {
			library_namespace.debug('Run set_descriptions',
			//
			2, 'wikidata_edit');
			set_descriptions(data, token, function() {
				library_namespace.debug('Run set_aliases', 2, 'wikidata_edit');
				set_aliases(data, token, function() {
					library_namespace.debug('Run set_claims', 2,
							'wikidata_edit');
					set_claims(data, token, function() {
						library_namespace.debug('Run set_sitelinks', 2,
								'wikidata_edit');
						set_sitelinks(data, token, do_wbeditentity, options,
								session, entity);
					}, options, session, entity);
				}, options, session, entity);
			}, options, session, entity);
		}, options, session, entity);
	}

	// CeL.wiki.edit_data.somevalue
	// snaktype somevalue 未知数值 unknown value
	wikidata_edit.somevalue = {
		// 单纯表达意思用的内容结构，可以其他的值代替。
		unknown_value : true
	};

	// CeL.wiki.edit_data.remove_all
	// 注意: 不可为 index!
	wikidata_edit.remove_all = {
		// 单纯表达意思用的内容结构，可以其他的值代替。
		remove_all : true
	};

	/**
	 * 取得指定实体，指定语言的所有 labels 与 aliases 值之列表。
	 * 
	 * @param {Object}entity
	 *            指定实体的 JSON 值。
	 * @param {String}[language]
	 *            指定取得此语言之资料。
	 * @param {Array}[list]
	 *            添加此原有之 label 列表。<br />
	 *            list = [ {String}label, ... ]
	 * 
	 * @returns {Array}所有 labels 与 aliases 值之列表。
	 */
	function entity_labels_and_aliases(entity, language, list) {
		if (!Array.isArray(list))
			// 初始化。
			list = [];

		if (!entity)
			return list;

		if (false && language && is_entity(entity) && !list) {
			// faster

			/** {Object|Array}label */
			var label = entity.labels[language],
			/** {Array}aliases */
			list = entity.aliases && entity.aliases[language];

			if (label) {
				label = label.value;
				if (list)
					// 不更动到原 aliases。
					(list = list.map(function(item) {
						return item.value;
					})).unshift(label);
				else
					list = [ label ];
			} else if (!list) {
				return [];
			}

			return list;
		}

		function add_list(item_list) {
			if (Array.isArray(item_list)) {
				// assert: {Array}item_list 为 wikidata_edit() 要编辑（更改或创建）的资料。
				// assert: item_list = [{language:'',value:''}, ...]
				list.append(item_list.map(function(item) {
					return item.value;
				}));

			} else if (!language) {
				// assert: {Object}item_list
				for ( var _language in item_list) {
					// assert: Array.isArray(aliases[label])
					add_list(item_list[_language]);
				}

			} else if (language in item_list) {
				// assert: {Object}item_list
				item_list = item_list[language];
				if (Array.isArray(item_list))
					add_list(item_list);
				else
					list.push(item_list.value);
			}
		}

		entity.labels && add_list(entity.labels);
		entity.aliases && add_list(entity.aliases);
		return list;
	}

	// common characters.
	// FULLWIDTH full width form characters 全形 ØωⅡ
	var PATTERN_common_characters_FW = /[\s\-ー・·．˙•，、。？！；：“”‘’「」『』（）－—…《》〈〉【】〖〗〔〕～←→↔⇐⇒⇔]+/g,
	// [[:en:Chùa Báo Quốc]]
	// {{tsl|ja|オメガクインテット|*ω*Quintet}}
	// {{tsl|en|Tamara de Lempicka|Tamara Łempicka}}
	// {{link-en|Željko Ivanek|Zeljko Ivanek}}
	// @see sPopP.RepeatC @ CeL.interact.DOM
	/** {RegExp}常用字母的匹配模式。应该是英语也能接受的符号。 */
	PATTERN_common_characters = /[\s\d_,.:;'"!()\-+\&<>\\\/\?–`@#$%^&*=~×☆★♪♫♬♩○●©®℗™℠]+/g,
	// 不能用来判别语言、不能表达意义的泛用符号/字元。无关紧要（不造成主要意义）的字元。
	PATTERN_only_common_characters = new RegExp('^['
			+ PATTERN_common_characters.source.slice(1, -2)
			//
			+ PATTERN_common_characters_FW.source.slice(1, -2) + ']*$'),
	// non-Chinese / non-CJK: 必须置于所有非中日韩语言之后测试!!
	// 2E80-2EFF 中日韩汉字部首补充 CJK Radicals Supplement
	/** {RegExp}非汉文化字母的匹配模式。 */
	PATTERN_non_CJK = /^[\u0008-\u2E7F]+$/i,
	/**
	 * 判定 label 标签标题语言使用之 pattern。
	 * 
	 * @type {Object}
	 * 
	 * @see [[以人口排列的语言列表]], [[维基百科:维基百科语言列表]], [[Special:统计#其他语言的维基百科]],
	 *      application.locale.encoding
	 */
	label_language_patterns = {
		// 常用的[[英文字母]]需要放置于第一个测试。
		en : /^[a-z]+$/i,

		// [[西班牙语字母]]
		// 'áéíñóúü'.toLowerCase().split('').sort().unique_sorted().join('')
		es : /^[a-záéíñóúü]+$/i,
		// [[:en:French orthography]]
		// http://character-code.com/french-html-codes.php
		fr : /^[a-z«»àâæçèéêëîïôùûüÿœ₣€]+$/i,
		// [[德语字母]], [[:de:Deutsches Alphabet]]
		de : /^[a-zäöüß]+$/i,

		// [[Arabic script in Unicode]] [[阿拉伯字母]]
		// \u10E60-\u10E7F
		ar : /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+$/,

		// 印度 [[印地语]][[天城文]]
		bh : /^[\u0900-\u097F\uA8E0-\uA8FF\u1CD0-\u1CFF]+$/,
		// [[:en:Bengali (Unicode block)]]
		bn : /^[\u0980-\u09FF]+$/,

		// [[俄语字母]], [\p{IsCyrillic}]+
		ru : /^[\u0401-\u0451]+$/,

		// [[Unicode and HTML for the Hebrew alphabet]] [[希伯来字母]]
		// [[Hebrew (Unicode block)]]
		he : /^[\u0591-\u05F4]+$/,

		// [[越南文字母]]
		vi : /^[aăâbcdđeêghiklmnoôơpqrstuưvxy]+$/i

	}, label_CJK_patterns = {
		ja : /^[\u3041-\u30FF\u31F0-\u31FF\uFA30-\uFA6A]+$/,
		// [[朝鲜字母]]
		ko : /^[\uAC00-\uD7A3\u1100-\u11FF\u3131-\u318E]+$/
	};

	/**
	 * 猜测 label 标签标题之语言。
	 * 
	 * @param {String}label
	 *            标签标题
	 * @param {String}[CJK_language]
	 *            预设之中日韩语言 code。
	 * 
	 * @returns {String|Undefined}label 之语言。
	 */
	function guess_language(label, CJK_language) {
		if (!label
		// 先去掉所有泛用符号/字元。
		|| !(label = label.replace(PATTERN_common_characters, ''))) {
			// 删掉泛用符号/字元后已无东西剩下。
			return;
		}

		// non_CJK: 此处事实上为非中日韩汉字之未知语言。
		var non_CJK = PATTERN_non_CJK.test(label),
		//
		patterns = non_CJK ? label_language_patterns : label_CJK_patterns;

		for ( var language in patterns) {
			if (patterns[language].test(label)) {
				return language;
			}
		}

		if (!non_CJK) {
			return CJK_language;
		}

		library_namespace.warn(
		//
		'guess_language: Unknown non-CJK label: [' + label + ']');
		return '';
	}

	/**
	 * 回传 wikidata_edit() 可用的个别 label 或 alias 设定项。
	 * 
	 * @param {String}label
	 *            label 值。
	 * @param {String}[language]
	 *            设定此 label 之语言。
	 * @param {String}[default_lang]
	 *            default language to use
	 * @param {Array}[add_to_list]
	 *            添加在此编辑资料列表中。
	 * 
	 * @returns {Object}个别 label 或 alias 设定项。
	 */
	wikidata_edit.add_item = function(label, language, default_lang,
			add_to_list) {
		if (!language || typeof language !== 'string') {
			// 无法猜出则使用预设之语言。
			language = guess_language(label) || default_lang;
			if (!language) {
				return;
			}
		}
		label = {
			language : language,
			value : label,
			add : 1
		};
		if (add_to_list) {
			add_to_list.push(label);
		}
		return label;
	};

	// --------------------------------

	// 测试是否包含前，正规化 label。
	// 注意: 因为会变更 label，不可将此输出作为最后 import 之内容！
	function key_of_label(label) {
		return label && String(label)
		// 去掉无关紧要（不造成主要意义）的字元。 ja:"・", "ー"
		.replace(PATTERN_common_characters_FW, '').toLowerCase()
		// 去掉复数。 TODO: 此法过于简略。
		.replace(/s$/, '')
		// 当有大小写转换后相同的标签时应跳过。
		// should not append the alias when the alias is the same with label
		// after lower cased.
		.toLowerCase()
		// 保证回传 {String}。 TODO: {Number}0
		|| '';
	}

	// 测试是否包含等价或延伸（而不仅仅是完全相同的） label。
	// 复杂版 original.includes(label_to_test)
	// TODO: 可省略 /[,;.!]/
	function include_label(original, label_to_test) {
		// 没东西要测试，表示也毋须作进一步处理。
		if (!label_to_test) {
			return true;
		}
		// 原先没东西，表示一定没包含。
		if (!original) {
			return false;
		}

		label_to_test = key_of_label(label_to_test);

		if (Array.isArray(original)) {
			return original.some(function(label) {
				return key_of_label(label).includes(label_to_test);
			});
		}

		// 测试正规化后是否包含。
		return key_of_label(original).includes(label_to_test);
	}

	/**
	 * 当想把 labels 加入 entity 时，输入之则可自动去除重复的 labels，并回传 wikidata_edit() 可用的编辑资料。
	 * merge labels / alias
	 * 
	 * TODO: 不区分大小写与空格（这有时可能为 typo），只要存在即跳过。或最起码忽略首字大小写差异。
	 * 
	 * @param {Object}labels
	 *            labels = {language:[label list],...}
	 * @param {Object}[entity]
	 *            指定实体的 JSON 值。
	 * @param {Object}[data]
	 *            添加在此编辑资料中。
	 * 
	 * @returns {Object}wikidata_edit() 可用的编辑资料。
	 */
	wikidata_edit.add_labels = function(labels, entity, data) {
		var data_alias;

		// assert: {Object}data 为 wikidata_edit() 要编辑（更改或创建）的资料。
		// data={labels:[{language:'',value:'',add:},...],aliases:[{language:'',value:'',add:},...]}
		if (data && (Array.isArray(data.labels) || Array.isArray(data.aliases))) {
			// {Array}data_alias
			data_alias = entity_labels_and_aliases(data);
			if (false) {
				if (!Array.isArray(data.labels))
					data.labels = [];
				else if (!Array.isArray(data.aliases))
					data.aliases = [];
			}

		} else {
			// 初始化。
			// Object.create(null);
			data = {
			// labels : [],
			// aliases : []
			};
		}

		var count = 0;
		// excludes existing label or alias. 去除已存在的 label/alias。
		for ( var language in labels) {
			// 此语言要添加的 label data。
			var label_data = labels[language];
			if (language === 'no') {
				library_namespace.debug('change language [' + language
						+ '] → [nb]', 2, 'wikidata_edit.add_labels');
				// using the language code "nb", not "no", at no.wikipedia.org
				// @see [[phab:T102533]]
				language = 'nb';
			}
			if (!Array.isArray(label_data)) {
				if (label_data)
					;
				library_namespace.warn('wikidata_edit.add_labels: language ['
						+ language + '] is not Array: (' + (typeof label_data)
						+ ')' + label_data);
				continue;
			}

			// TODO: 提高效率。
			var alias = entity_labels_and_aliases(entity, language, data_alias),
			/** {Boolean}此语言是否有此label */
			has_this_language_label = undefined,
			/** {Array}本次 label_data 已添加之 label list */
			new_alias = undefined,
			//
			matched = language.match(/^([a-z]{2,3})-/);

			if (matched) {
				// 若是要添加 'zh-tw'，则应该顺便检查 'zh'。
				entity_labels_and_aliases(entity, matched[1], alias);
			}

			label_data
			// 确保 "title" 在 "title (type)" 之前。
			.sort()
			// 避免要添加的 label_data 本身即有重复。
			.unique_sorted()
			// 处理各 label。
			.forEach(function(label) {
				if (!label || typeof label !== 'string') {
					// warnning: Invalid label.
					return;
				}

				var label_without_type = /\([^()]+\)$/.test(label)
				// e.g., label === "title (type)"
				// → label_without_type = "title"
				&& label.replace(/\s*\([^()]+\)$/, '');

				// 测试是否包含等价或延伸（而不仅仅是完全相同的） label。
				// TODO: 每个 label 每次测试皆得重新 key_of_label()，效率过差。
				if (include_label(alias, label)
				//
				|| label_without_type
				// 当已有 "title" 时，不添加 "title (type)"。
				&& (include_label(alias, label_without_type)
				// assert: !new_alias.includes(label)，已被 .unique() 除去。
				|| new_alias && include_label(new_alias, label_without_type))) {
					// Skip. 已有此 label 或等价之 label。
					return;
				}

				count++;
				if (new_alias)
					new_alias.push(label);
				else
					new_alias = [ label ];

				var item = wikidata_edit.add_item(label, language);

				if (has_this_language_label === undefined)
					has_this_language_label
					// 注意: 若是本来已有某个值（例如 label），采用 add 会被取代。或须侦测并避免更动原有值。
					= entity.labels && entity.labels[language]
					//
					|| data.labels && data.labels.some(function(item) {
						return item.language === language;
					});

				if (!has_this_language_label) {
					// 因为预料会增加的 label/aliases 很少，因此采后初始化。
					if (!data.labels)
						data.labels = [];
					// 第一个当作 label。直接登录。
					data.labels.push(item);
				} else {
					// 因为预料会增加的 label/aliases 很少，因此采后初始化。
					if (!data.aliases)
						data.aliases = [];
					// 其他的当作 alias
					data.aliases.push(item);
				}
			});

			if (new_alias) {
				if (data_alias)
					data_alias.append(new_alias);
				else
					data_alias = new_alias;
			}
		}

		if (count === 0) {
			// No labels/aliases to set. 已无剩下需要设定之新 label/aliases。
			return;
		}

		if (false) {
			// 已采后初始化。既然造出实例，表示必定有资料。
			// trim 修剪；修整
			if (data.labels.length === 0)
				delete data.labels;
			if (data.aliases.length === 0)
				delete data.aliases;
		}

		return data;
	};

	// ------------------------------------------------------------------------

	/**
	 * 合并自 wikidata 的 entity。
	 * 
	 * TODO: wikidata_merge([to, from1, from2], ...)
	 * 
	 * @param {String}to
	 *            要合并自的ID
	 * @param {String}from
	 *            要合并到的ID
	 * @param {Object}token
	 *            login 资讯，包含“csrf”令牌/密钥。
	 * @param {Object}[options]
	 *            附加参数/设定选择性/特殊功能与选项
	 * @param {Function}[callback]
	 *            回调函数。 callback(转成JavaScript的值. e.g., {Array}list)
	 */
	function wikidata_merge(to, from, token, options, callback) {
		if (!/^Q\d{1,10}$/.test(to)) {
			wikidata_entity(to, function(entity, error) {
				if (error) {
					callback(undefined, error);
				} else {
					wikidata_merge(entity.id, from, callback, options);
				}
			});
			return;
		}

		if (!/^Q\d{1,10}$/.test(from)) {
			wikidata_entity(from, function(entity, error) {
				if (error) {
					callback(undefined, error);
				} else {
					wikidata_merge(to, entity.id, callback, options);
				}
			});
			return;
		}

		// 正规化并提供可随意改变的同内容参数，以避免修改或覆盖附加参数。
		options = library_namespace.new_options(options);

		// 要忽略冲突的项的元素数组，只能包含值“description”和/或“sitelink”和/或“statement”。
		// 多值 (以 | 分隔)：description、sitelink、statement
		// 网站链接和描述
		var ignoreconflicts = 'ignoreconflicts' in options ? options.ignoreconflicts
				// 最常使用的功能是合并2页面。可忽略任何冲突的 description, statement。
				// https://www.wikidata.org/wiki/Help:Statements
				: 'description';

		var session = wiki_API.session_of_options(options);
		if (KEY_SESSION in options) {
			delete options[KEY_SESSION];
		}

		var action = 'action=wbmergeitems&fromid=' + from + '&toid=' + to;
		if (ignoreconflicts) {
			action += '&ignoreconflicts=' + ignoreconflicts;
		}

		action = [
		// 合并重复项。
		// https://www.wikidata.org/w/api.php?action=help&modules=wbmergeitems
		get_data_API_URL(options), action ];

		// the token should be sent as the last parameter.
		options.token = library_namespace.is_Object(token) ? token.csrftoken
				: token;

		wiki_API.query(action, function handle_result(data, error) {
			error = wiki_API.query.handle_error(data, error);
			// 检查伺服器回应是否有错误资讯。
			if (error) {
				library_namespace.error('wikidata_merge: '
				// [failed-modify] Attempted modification of the item failed.
				// (Conflicting descriptions for language zh)
				+ error);
			}

			// Will create redirection.
			// 此 wbmergeitems 之回传 data 不包含 item 资讯。
			// data =
			// {"success":1,"redirected":1,"from":{"id":"Q1","type":"item","lastrevid":1},"to":{"id":"Q2","type":"item","lastrevid":2}}
			// {"success":1,"redirected":0,"from":{"id":"Q1","type":"item","lastrevid":1},"to":{"id":"Q2","type":"item","lastrevid":2}}
			callback(data, error);
		}, options, session);
	}

	// ------------------------------------------------------------------------

	/** {String}API URL of Wikidata Query. */
	var wikidata_query_API_URL = 'https://wdq.wmflabs.org/api';

	/**
	 * 查询 Wikidata Query。
	 * 
	 * @example<code>

	 CeL.wiki.wdq('claim[31:146]', function(list) {result=list;console.log(list);});
	 CeL.wiki.wdq('CLAIM[31:14827288] AND CLAIM[31:593744]', function(list) {result=list;console.log(list);});
	 //	查询国家
	 CeL.wiki.wdq('claim[31:6256]', function(list) {result=list;console.log(list);});


	 // Wikidata filter claim
	 // https://wdq.wmflabs.org/api_documentation.html
	 // https://wdq.wmflabs.org/wdq/?q=claim[31:146]&callback=eer
	 // https://wdq.wmflabs.org/api?q=claim[31:146]&callback=eer
	 CeL.get_URL('https://wdq.wmflabs.org/api?q=claim[31:146]', function(data) {result=data=JSON.parse(data.responseText);console.log(data.items);})
	 CeL.get_URL('https://wdq.wmflabs.org/api?q=string[label:宇宙]', function(data) {result=data=JSON.parse(data.responseText);console.log(data.items);})

	 </code>
	 * 
	 * @param {String}query
	 *            查询语句。
	 * @param {Function}[callback]
	 *            回调函数。 callback(转成JavaScript的值. e.g., {Array}list, error)
	 * @param {Object}[options]
	 *            附加参数/设定选择性/特殊功能与选项
	 */
	function wikidata_query(query, callback, options) {
		var action = [ options && options.API_URL || wikidata_query_API_URL,
				'?q=', encodeURIComponent(query) ];

		if (options) {
			if (typeof options === 'string') {
				options = {
					props : options
				};
			} else if (Array.isArray(options)) {
				options = {
					props : options.join(',')
				};
			} else {
				// 已使用过。
				delete options.API_URL;
			}

			if (options.wdq_props)
				action.push('&props=', options.wdq_props);
			if (options.noitems)
				// 毋须 '&noitems=1'
				action.push('&noitems');
			// &callback=
		}

		get_URL(action.join(''), function(data) {
			var items;
			// error handling
			try {
				items = JSON.parse(data.responseText).items;
			} catch (e) {
			}
			if (!items || options && options.get_id) {
				callback(undefined, data && data.status || 'Failed to get '
						+ query);
				return;
			}
			if (items.length > 50) {
				// 上限值为 50 (机器人为 500)。
				library_namespace.debug('Get ' + items.length
						+ ' items, more than 50.', 2, 'wikidata_query');
				var session = wiki_API.session_of_options(options);
				// session && session.data(items, callback, options);
				if (session && !session.data_session) {
					// 得先登入。
					session.set_data(function() {
						wikidata_entity(items, callback, options);
					});
					return;
				}
			}
			wikidata_entity(items, callback, options);
		});
	}

	/** {String}API URL of Wikidata Query Service (SPARQL). */
	var wikidata_SPARQL_API_URL = 'https://query.wikidata.org/bigdata/namespace/wdq/sparql';
	// https://query.wikidata.org/sparql
	// https://commons-query.wikimedia.org/sparql
	// https://www.dictionnairedesfrancophones.org/sparql

	/**
	 * 查询 Wikidata Query Service (SPARQL)。
	 * 
	 * @example<code>

	 CeL.wiki.SPARQL('SELECT ?item ?itemLabel ?itemDescription WHERE { ?item wdt:P31 wd:Q146 . SERVICE wikibase:label { bd:serviceParam wikibase:language "en" } }', function(list) {result=list;console.log(list);})

	 </code>
	 * 
	 * @param {String}query
	 *            查询语句。
	 * @param {Function}[callback]
	 *            回调函数。 callback(转成JavaScript的值. e.g., {Array}list, error)
	 * @param {Object}[options]
	 *            附加参数/设定选择性/特殊功能与选项
	 * 
	 * @see https://www.mediawiki.org/wiki/Wikidata_query_service/User_Manual
	 *      https://www.wikidata.org/wiki/Wikidata:Data_access#SPARQL_endpoints
	 */
	function wikidata_SPARQL(query, callback, options) {
		// options.API_URL: custom SPARQL endpoint
		var action = options && options.API_URL;
		if (!action) {
			var session = wiki_API.session_of_options(options);
			action = session && session.SPARQL_API_URL;
		}
		// console.trace(action);
		action = [ action || wikidata_SPARQL_API_URL, '?query=',
				encodeURIComponent(query), '&format=json' ];

		get_URL(action.join(''), function(data, error) {
			if (error) {
				callback(undefined, error);
				return;
			}
			// console.log(data.responseText);
			try {
				data = JSON.parse(data.responseText);
			} catch (e) {
				// e.g., java.util.concurrent.TimeoutException
				callback(undefined, e);
				return;
			}
			// {"head":{"vars":["item"]},"results":{"bindings":[{"item":{"type":"uri","value":"http://www.wikidata.org/entity/Q1"}},...]}}
			// console.log(JSON.stringify(data));

			var items = data.results;
			if (!items || !Array.isArray(items = items.bindings)) {
				callback(data);
				return;
			}

			// 正常情况
			items.for_id = for_erach_SPARQL_item_process_id;
			// e.g., items.id_list('item'); items.id_list();
			// .get_item_ids()
			items.id_list = get_SPARQL_id_list;
			callback(items);
		});
	}

	var default_item_name = 'item';
	function for_erach_SPARQL_item_process_id(processor, item_list, item_name) {
		item_list = item_list || this;
		item_list.forEach(function(item, index) {
			var matched = item[item_name || default_item_name];
			if (matched && matched.type === "uri") {
				matched = matched.value && matched.value.match(/Q\d+$/);
				if (matched) {
					// processor('Q000', item, index, item_list)
					processor(matched[0], item, index, item_list);
					return;
				}
			}
			// Unknown item.
			processor(undefined, item, index, item_list);
		});
	}

	function get_SPARQL_id_list(options) {
		if (typeof options === 'string') {
			options = {
				item_name : options
			};
		}
		var id_list = [];
		for_erach_SPARQL_item_process_id(function(id, item) {
			// console.trace([ id, item ]);
			id_list.push(id);
		}, this, options && options.item_name || default_item_name);
		return id_list;
	}

	// --------------------------------------------------------------------------------------------

	/** {String}API URL of PetScan. */
	var wikidata_PetScan_API_URL = 'https://petscan.wmflabs.org/',
	// 常用 parameters。
	PetScan_parameters = 'combination,sparql'.split(',');

	/**
	 * PetScan can generate lists of Wikipedia (and related projects) pages or
	 * Wikidata items that match certain criteria, such as all pages in a
	 * certain category, or all items with a certain property.
	 * 
	 * @example<code>

	// [[:Category:日本のポップ歌手]]直下の记事のうちWikidataにおいて性别(P21)が女性(Q6581072)となっているもの
	CeL.wiki.petscan('日本のポップ歌手',function(items){result=items;console.log(items);},{language:'ja',sparql:'SELECT ?item WHERE { ?item wdt:P21 wd:Q6581072 }'})

	 </code>
	 * 
	 * @param {String}categories
	 *            List of categories, one per line without "category:" part.
	 * @param {Function}[callback]
	 *            回调函数。 callback({Array}[{Object}item])
	 * @param {Object}[options]
	 *            附加参数/设定选择性/特殊功能与选项
	 */
	function petscan(categories, callback, options) {
		var _options;
		if (options) {
			if (typeof options === 'string') {
				options = {
					language : options
				};
			} else {
				_options = options;
			}
		} else {
			options = Object.create(null);
		}

		var language = options.language || wiki_API.language, parameters;
		if (is_api_and_title(categories, 'language')) {
			language = categories[0];
			categories = categories[1];
		}

		if (_options) {
			parameters = Object.create(null);
			PetScan_parameters.forEach(function(parameter) {
				if (parameter in options) {
					parameters[parameter] = options[parameter];
				}
			});
			Object.assign(parameters, options.parameters);
		}
		_options = {
			language : language,
			wikidata_label_language : language,
			categories : Array.isArray(categories)
			// List of categories, one per line without "category:" part.
			// 此时应设定 combination:union/subset
			? categories.join('\n') : categories,
			project : options.project || options.family || 'wikipedia',
			// 确保输出为需要的格式。
			format : 'wiki',
			doit : 'D'
		};
		if (parameters) {
			Object.assign(parameters, _options);
		} else {
			parameters = _options;
		}

		var url = new library_namespace.URI(options.API_URL
				|| wikidata_PetScan_API_URL);
		url.search_params.set_parameters(parameters);

		get_URL(url.to_String(), function(data, error) {
			if (error) {
				callback(undefined, error);
				return;
			}
			data = data.responseText;
			var items = [], matched,
			/**
			 * <code>
			!Title !! Page ID !! Namespace !! Size (bytes) !! Last change !! Wikidata
			| [[Q234598|宇多田ヒカル]] || 228187 || 0 || 49939 || 20161028033707
			→ format form PetScan format=json
			{"id":228187,"len":49939,"namespace":0,"title":"Q234598","touched":"20161028033707"},
			 </code>
			 */
			PATTERN =
			// [ all, title, sitelink, miscellaneous ]
			// TODO: use PATTERN_wikilink
			/\n\|\s*\[\[([^{}\[\]\|<>\t\n�]+)\|([^\[\]\t\n]*?)\]\]\s*\|\|([^\t\n]+)/g
			//
			;
			while (matched = PATTERN.exec(data)) {
				var miscellaneous = matched[3].split(/\s*\|\|\s*/),
				//
				item = {
					id : +miscellaneous[0],
					len : +miscellaneous[2],
					namespace : +miscellaneous[1],
					title : matched[1],
					touched : miscellaneous[3]
				};
				if (matched[2]) {
					// Maybe it's label...
					item.sitelink = matched[2];
				}
				if ((matched = miscellaneous[4])
				// @see function to_talk_page(page_title, options)
				&& (matched = matched.match(/\[\[:d:([^{}\[\]\|<>\t\n#�:]+)/))) {
					item.wikidata = matched[1];
				}
				items.push(item);
			}
			callback(items);
		});
	}

	// ------------------------------------------------------------------------

	// export 导出.

	// @inner
	library_namespace.set_method(wiki_API, {
		setup_data_session : setup_data_session
	});

	// ------------------------------------------

	// @static
	Object.assign(wiki_API, {
		PATTERN_common_characters : PATTERN_common_characters,
		PATTERN_only_common_characters : PATTERN_only_common_characters,

		guess_language : guess_language,

		is_entity : is_entity,

		// data : wikidata_entity,
		edit_data : wikidata_edit,
		merge_data : wikidata_merge,
		//
		wdq : wikidata_query,
		SPARQL : wikidata_SPARQL,
		petscan : petscan
	});

	return wikidata_entity;
}
