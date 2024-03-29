﻿/**
 * @name WWW work crawler sub-functions
 * 
 * @fileoverview WWW work crawler functions: part of command-line arguments
 * 
 * @since 2019/10/20 拆分自 CeL.application.net.work_crawler.task
 */

'use strict';

// --------------------------------------------------------------------------------------------

if (typeof CeL === 'function') {
	// 忽略没有 Windows Component Object Model 的错误。
	CeL.env.ignore_COM_error = true;

	CeL.run({
		// module name
		name : 'application.net.work_crawler.arguments',

		require : 'application.net.work_crawler.',

		// 设定不汇出的子函式。
		no_extend : 'this,*',

		// 为了方便格式化程式码，因此将 module 函式主体另外抽出。
		code : module_code
	});
}

function module_code(library_namespace) {

	// requiring
	var Work_crawler = library_namespace.net.work_crawler;

	var gettext = library_namespace.locale.gettext;

	// --------------------------------------------------------------------------------------------

	/**
	 * 正规化定义参数的规范，例如数量包含可选范围，可用 RegExp。如'number:0~|string:/v\\d/i',
	 * 'number:1~400|string:item1;item2;item3'。亦可仅使用'number|string'。
	 * 
	 * @see CeL.data.fit_filter()
	 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/text#pattern
	 */
	function generate_argument_condition(condition) {
		if (library_namespace.is_Object(condition))
			return condition;

		var condition_data = Object.create(null), matched, PATTERN = /([a-z]+)(?::(\/(\\[\s\S]|[^\/])+\/([i]*)|[^|]+))?(?:\||$)/g;
		while (matched = PATTERN.exec(condition)) {
			var type = matched[1], _condition = undefined;
			if (!matched[2]) {
				;

			} else if (matched[3]) {
				_condition = new RegExp(matched[3], matched[4]);

			} else if (type === 'number' && (_condition = matched[2].match(
			// @see CeL.date.parse_period.PATTERN
			/([+\-]?\d+(?:\.\d+)?)?\s*[–~－—─～〜﹣至]\s*([+\-]?\d+(?:\.\d+)?)?/))) {
				_condition = {
					min : _condition[1] && +_condition[1],
					max : _condition[2] && +_condition[2]
				};

			} else if (type === 'number'
					&& (matched[2] === 'natural' || matched[2] === 'ℕ')) {
				_condition = function is_natural(value) {
					return value >= 1 && value === Math.floor(value);
				};

			} else if (type === 'number'
					&& (matched[2] === 'natural+0' || matched[2] === 'ℕ+0')) {
				// Naturals with zero: non-negative integers 非负整数。
				_condition = function is_non_negative(value) {
					return value >= 0 && value === Math.floor(value);
				};

			} else if (type === 'number' && matched[2] === 'integer') {
				_condition = function is_integer(value) {
					return value === Math.floor(value);
				};

			} else {
				_condition = matched[2].split(';');
			}

			condition_data[type] = _condition;
		}

		return condition_data;
	}

	/**
	 * 初始设定好命令列选项之型态资料集。
	 * 
	 * @param {Object}[arg_hash]
	 *            参数型态资料集。
	 * @param {Boolean}[append]
	 *            添加至当前的参数型态资料集。否则会重新设定参数型态资料集。
	 * 
	 * @returns {Object}命令列选项之型态资料集。
	 */
	function setup_argument_conditions(arg_hash, append) {
		if (append) {
			arg_hash = Object.assign(Work_crawler.prototype.import_arg_hash,
					arg_hash);
		} else if (arg_hash) {
			// default: rest import_arg_hash
			Work_crawler.prototype.import_arg_hash = arg_hash;
		} else {
			arg_hash = Work_crawler.prototype.import_arg_hash;
		}

		Object.keys(arg_hash).forEach(function(key) {
			arg_hash[key] = generate_argument_condition(arg_hash[key]);
		});
		// console.log(arg_hash);
		return arg_hash;
	}

	Work_crawler.setup_argument_conditions = setup_argument_conditions;

	/**
	 * 检核 crawler 的设定参数。
	 * 
	 * @param {String}key
	 *            参数名称
	 * @param value
	 *            欲设定的值
	 * 
	 * @returns {Boolean} true: Error occudded
	 * 
	 * @see CeL.data.fit_filter()
	 */
	function verify_arg(key, value) {
		if (!(key in this.import_arg_hash)) {
			return true;
		}

		var type = typeof value, arg_type_data = this.import_arg_hash[key];
		// console.log(arg_type_data);

		if (!(type in arg_type_data)) {
			library_namespace.warn([ 'verify_arg: ', {
				// gettext_config:{"id":"the-allowed-data-type-for-$1-is-$4-but-it-was-set-to-{$2}-$3"}
				T : [ '"%1" 这个值所允许的数值类型为 %4，但现在被设定成 {%2} %3',
				//
				key, typeof value, value,
				//
				library_namespace.is_Object(arg_type_data)
				//
				? Object.keys(arg_type_data).map(function(type) {
					return gettext(type);
				}).join('|') : arg_type_data ]
			} ]);

			return true;
		}

		arg_type_data = arg_type_data[type];
		if (Array.isArray(arg_type_data)) {
			if (arg_type_data.length === 1
					&& typeof arg_type_data[0] === 'string') {
				var fso_type = arg_type_data[0]
						.match(/^fso_(file|files|directory|directories)$/);
				if (fso_type) {
					fso_type = fso_type[1];
					if (typeof value === 'string')
						value = value.split('|');
					// assert: Array.isArray(value)
					var error_fso = undefined, checker = fso_type
							.startsWith('file') ? library_namespace.storage.file_exists
							: library_namespace.storage.directory_exists;
					if (value.some(function(fso_path) {
						if (!checker(fso_path)) {
							error_fso = fso_path;
							return true;
						}
					})) {
						library_namespace.warn([ 'verify_arg: ', {
							// gettext_config:{"id":"some-$2-path(s)-specified-by-$1-do-not-exist-$3"}
							T : [ '至少一个由「%1」所指定的%2路径不存在：%3', key,
							// gettext_config:{"id":"file","mark_type":"combination_message_id"}
							// gettext_config:{"id":"files","mark_type":"combination_message_id"}
							// gettext_config:{"id":"directory","mark_type":"combination_message_id"}
							// gettext_config:{"id":"directories","mark_type":"combination_message_id"}
							gettext(fso_type), error_fso ]
						} ]);
						return true;
					}
					return;
				}
			}

			// e.g., "string:value1,value2"
			if (arg_type_data.includes(value)) {
				// verified
				return;
			}

		} else if (arg_type_data && ('min' in arg_type_data)) {
			// assert: type === 'number'
			if ((!arg_type_data.min || arg_type_data.min <= value)
					&& (!arg_type_data.max || value <= arg_type_data.max)) {
				// verified
				return;
			}

		} else if (typeof arg_type_data === 'function') {
			if (arg_type_data(value))
				return;

		} else {
			if (arg_type_data !== undefined) {
				library_namespace.warn([ 'verify_arg: ', {
					// gettext_config:{"id":"unable-to-process-$1-condition-with-value-type-$2"}
					T : [ '无法处理 "%1" 在数值类型为 %2 时之条件！', key, arg_type_data ]
				} ]);
			}
			// 应该修改审查条件式，而非数值本身的问题。
			return;
		}

		library_namespace.warn([ 'verify_arg: ', {
			// gettext_config:{"id":"$1-is-set-to-the-problematic-value-{$2}-$3"}
			T : [ '"%1" 被设定成了有问题的值：{%2} %3', key, typeof value, value ]
		} ]);

		return true;
	}

	/**
	 * 设定 crawler 的参数。 normalize and setup value
	 * 
	 * @example<code>

	crawler.setup_value(key, value);

	// 应该用:
	this.setup_value(key, value);
	// 不应用:
	this[key] = value;
	delete this[key];

	</code>
	 * 
	 * @param {any}
	 *            key
	 * @param {any}
	 *            value
	 * 
	 * @return {String}has error
	 */
	function setup_value(key, value) {
		if (!key)
			// gettext_config:{"id":"key-value-not-given"}
			return '未提供键值';

		if (library_namespace.is_Object(key)) {
			// assert: value === undefined
			value = key;
			for (key in value) {
				this.setup_value(key, value[key]);
			}
			// TODO: return error
			return;
		}

		// assert: typeof key === 'string'

		switch (key) {
		case 'proxy':
			// 使用代理伺服器 proxy_server
			// TODO: check .proxy
			library_namespace.info({
				// gettext_config:{"id":"using-proxy-server-$1"}
				T : [ 'Using proxy server: %1', value ]
			});
			this.get_URL_options.proxy = this[key] = value;
			return;

		case 'cookie':
			// set-cookie, document.cookie
			if (this.get_URL_options.agent) {
				library_namespace.merge_cookie(this.get_URL_options.agent,
						value);
			} else if (this.get_URL_options.cookie) {
				if (!/;\s*$/.test(this.get_URL_options.cookie))
					this.get_URL_options.cookie += ';';
				this.get_URL_options.cookie += value;
			} else {
				this.get_URL_options.cookie = value;
			}
			// console.trace(this.get_URL_options);
			return;

		case 'timeout':
			value = library_namespace.to_millisecond(value);
			if (!(value >= 0)) {
				// gettext_config:{"id":"failed-to-parse-time"}
				return '无法解析的时间';
			}
			this.get_URL_options.timeout = this[key] = value;
			break;

		// case 'agent':
		// @see function setup_agent(URL)

		case 'user_agent':
			if (!value) {
				// gettext_config:{"id":"user-agent-is-not-set"}
				return '未设定 User-Agent。';
			}
			this.get_URL_options.headers['User-Agent'] = this[key] = value;
			break;

		case 'Referer':
			if (!value
			// value === '': Unset Referer
			&& value !== '') {
				// gettext_config:{"id":"referer-cannot-be-undefined"}
				return 'Referer 不可为 undefined。';
			}
			library_namespace.debug({
				// gettext_config:{"id":"configure-referer-$1"}
				T : [ '设定 Referer：%1', JSON.stringify(value) ]
			}, 2);
			this.get_URL_options.headers.Referer = value;
			// console.log(this.get_URL_options);
			return;

		case 'allow_EOI_error':
			if (this.using_default_MIN_LENGTH) {
				this[key] = value;
				// 因为 .allow_EOI_error 会影响到 .MIN_LENGTH
				this.setup_value('MIN_LENGTH', 'default');
				return;
			}
			break;

		case 'MIN_LENGTH':
			// 设定预设可容许的最小图像大小。
			if (!(value >= 0)) {
				if (value === 'default') {
					this.using_default_MIN_LENGTH = true;
					value = this.allow_EOI_error ? 4e3 : 1e3;
				} else
					// gettext_config:{"id":"min-image-size-should-be-greater-than-0"}
					return '最小图片大小应大于等于零';
			} else {
				delete this.using_default_MIN_LENGTH;
			}
			break;

		case 'main_directory':
			if (!value || typeof value !== 'string')
				return;
			value = value.replace(/[\\\/]/g,
			// 正规化成当前作业系统使用的目录分隔符号。
			library_namespace.env.path_separator);
			// main_directory 必须以 path separator 作结。
			value = library_namespace.append_path_separator(value);
			break;
		}

		if (key in this.import_arg_hash) {
			this.verify_arg(key, value);
		}

		if (value === undefined) {
			// delete this[key];
		}
		this[key] = value;
	}

	// import command line arguments 以命令行参数为准
	// 从命令列引数来的设定，优先等级比起作品预设设定更高。
	function import_args() {
		// console.log(library_namespace.env.arg_hash);
		if (!library_namespace.env.arg_hash) {
			return;
		}

		for ( var key in library_namespace.env.arg_hash) {
			if (!(key in this.import_arg_hash) && !(key in this)) {
				continue;
			}

			var value = library_namespace.env.arg_hash[key];

			if (this.import_arg_hash[key] === 'number') {
				try {
					// value = +value;
					// 这样可以处理如"1e3"
					value = JSON.parse(value);
				} catch (e) {
					library_namespace.error('import_args: '
					// gettext_config:{"id":"cannot-parse-$1"}
					+ gettext('无法解析 %1', key + '=' + value));
					continue;
				}
			}

			var old_value = this[key], error = this.setup_value(key, value);
			if (error) {
				library_namespace.error('import_args: '
				// gettext_config:{"id":"unable-to-set-$1-$2"}
				+ gettext('无法设定 %1：%2', key + '=' + old_value, error));
			} else {
				library_namespace.log(library_namespace.display_align([
						[ key + ': ', old_value ],
						// + ' ': 增加间隙。
						// gettext_config:{"id":"from-command-line"}
						[ gettext('由命令列') + ' → ', value ] ]));
			}
		}
	}

	// --------------------------------------------------------------------------------------------

	// export 导出.

	// @instance
	Object.assign(Work_crawler.prototype, {
		verify_arg : verify_arg,
		setup_value : setup_value,
		import_args : import_args,
		// 数值规范。命令列可以设定的选项之型态资料集。通常仅做测试微调用。
		// GUI 选项于 work_crawler/gui_electron/gui_electron_functions.js 设定。
		// 以纯量为主，例如逻辑真假、数字、字串。无法处理函数！
		// 现在 import_arg_hash 之说明已与 I18n 统合在一起。
		// work_crawler/work_crawler_loader.js与gui_electron_functions.js各参考了import_arg_hash的可选参数。
		// @see work_crawler/gui_electron/gui_electron_functions.js
		// @see work_crawler/resource/locale of work_crawler - locale.csv

		// gettext_config:{"id":"number","mark_type":"combination_message_id"}
		// gettext_config:{"id":"function","mark_type":"combination_message_id"}
		// gettext_config:{"id":"boolean","mark_type":"combination_message_id"}
		// gettext_config:{"id":"string","mark_type":"combination_message_id"}
		// gettext_config:{"id":"fso_file","mark_type":"combination_message_id"}
		// gettext_config:{"id":"fso_files","mark_type":"combination_message_id"}
		// gettext_config:{"id":"fso_directory","mark_type":"combination_message_id"}
		// gettext_config:{"id":"fso_directories","mark_type":"combination_message_id"}
		import_arg_hash : {
			// 预设值设定于 Work_crawler_prototype @ CeL.application.net.work_crawler

			// set download directory, fso:directory
			main_directory : 'string:fso_directory',

			// crawler.show_work_data(work_data);
			show_information_only : 'boolean',

			one_by_one : 'boolean',
			// 筛选想要下载的章节标题关键字。例如"单行本"。
			chapter_filter : 'string',
			// 开始/接续下载的章节。将依类型转成 .start_chapter_title 或
			// .start_chapter_NO。对已下载过的章节，必须配合 .recheck。
			start_chapter : 'number:natural|string',
			// 开始/接续下载的章节编号。
			start_chapter_NO : 'number:natural',
			// 下载此章节编号范围。例如 "20-30,50-60"。
			chapter_NO_range : 'string',
			// 开始/接续下载的章节标题。
			start_chapter_title : 'string',
			// 指定了要开始下载的列表序号。将会跳过这个讯号之前的作品。
			// 一般仅使用于命令列设定。default:1
			start_list_serial : 'number:natural|string',
			// 重新整理列表档案 rearrange list file
			rearrange_list_file : 'boolean',
			// string: 如 "3s"
			chapter_time_interval : 'number:natural+0|string|function',
			MIN_LENGTH : 'number:natural+0',
			timeout : 'number:natural+0|string',
			// 容许错误用的相关操作设定。
			MAX_ERROR_RETRY : 'number:natural+0',
			allow_EOI_error : 'boolean',
			skip_error : 'boolean',
			skip_chapter_data_error : 'boolean',

			directory_name_pattern : 'string',

			preserve_work_page : 'boolean',
			preserve_chapter_page : 'boolean',
			remove_ebook_directory : 'boolean',
			// 当新获取的档案比较大时，覆写旧的档案。
			overwrite_old_file : 'boolean',
			vertical_writing : 'boolean|string',
			// RTL_writing : 'boolean',
			convert_to_language : 'string:TW;CN',
			// 不解开原电子书的选项: 就算存在旧电子书档案，也不解压缩、利用旧资料。
			discard_old_ebook_file : 'boolean',

			user_agent : 'string',
			// 代理伺服器 proxy_server: "username:password@hostname:port"
			proxy : 'string',
			// 设定下载时要添加的 cookie。 document.cookie: "key=value"
			cookie : 'string',

			// 可接受的图片类别（延伸档名）。以 "|" 字元作分隔，如 "webp|jpg|png"。未设定将不作检查。
			// 输入 "images" 表示接受所有图片。
			acceptable_types : 'string',
			// 漫画下载完毕后压缩图片档案。
			archive_images : 'boolean',
			// 完全没有出现错误才压缩图片档案。
			archive_all_good_images_only : 'boolean',
			// 压缩图片档案之后，删掉原先的图片档案。
			remove_images_after_archive : 'boolean',
			images_archive_extension : 'string',

			// 重新撷取用的相关操作设定。
			regenerate : 'boolean',
			reget_chapter : 'boolean',
			recheck : 'boolean|string:changed;multi_parts_changed',
			search_again : 'boolean',
			cache_title_to_id : 'boolean',

			write_chapter_metadata : 'boolean',
			write_image_metadata : 'boolean',

			// 封存旧作品。
			archive_old_works : 'boolean|string',
			// 以作品完结时间为分界来封存旧作品。预设为最后一次下载时间。
			use_finished_date_to_archive_old_works : 'boolean',
			// 同时自作品列表中删除将封存之作品。
			modify_work_list_when_archive_old_works : 'boolean',

			// 储存偏好选项 save_options。
			save_preference : 'boolean'
		}

	});

	setup_argument_conditions();

	// 不设定(hook)本 module 之 namespace，仅执行 module code。
	return library_namespace.env.not_to_extend_keyword;
}
