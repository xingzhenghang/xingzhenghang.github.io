/**
 * @name CeL function for downloading online works (novels, comics).
 * 
 * @fileoverview 本档案包含了批量下载网路作品（小说、漫画）的函式库。 WWW work crawler library.
 * 
 * <code>


TODO:

将设定储存在系统预设的设定目录
Windows: %APPDATA%\work_crawler\
UNIX: $HOME/.work_crawler/

搜寻已下载作品

save cookie @ CLI

建造可以自动生成index/说明的工具。
	自动判别网址所需要使用的下载工具，输入网址自动拣选所需的工具档案。
	从其他的资料来源网站寻找，以获取作品以及章节的资讯。
	自动记得某个作品要从哪些网站下载。

GUI开启错误纪录

增加版本上报

漫画下载流程教学

CLI progress bar
下载完毕后作繁简转换。
在单一/全部任务完成后执行的外部档+等待单一任务脚本执行的时间（秒数）
用安全一点的 eval()
	Runs untrusted code securely https://github.com/patriksimek/vm2
parse 图像。
拼接长图之后重新分割：以整个横切全部都是同一颜色白色为界，并且可以省略掉相同颜色的区块。 using .epub
	处理每张图片被分割成多个小图的情况 add .image_indexes[] ?
检核章节内容。
考虑 search_URL 搜寻的页数，当搜索获得太多结果时也要包含所有结果

detect encoded data:
https://gchq.github.io/CyberChef/

</code>
 */

// More examples: See 各网站工具档.js: https://github.com/kanasimi/work_crawler
'use strict';
// 'use asm';

// --------------------------------------------------------------------------------------------

if (typeof CeL === 'function') {
	// 忽略没有 Windows Component Object Model 的错误。
	CeL.env.ignore_COM_error = true;

	CeL.run({
		// module name
		name : 'application.net.work_crawler',

		// .includes() @ CeL.data.code.compatibility
		require : 'data.code.compatibility.'
		// .between() @ CeL.data.native
		// .append() @ CeL.data.native
		// .pad() @ CeL.data.native
		// display_align() @ CeL.data.native
		+ '|data.native.'
		// for CeL.to_file_name()
		+ '|application.net.'
		// for CeL.env.arg_hash, CeL.fs_read()
		+ '|application.platform.nodejs.|application.storage.'
		// for CeL.storage.file.file_type()
		+ '|application.storage.file.'
		// for HTML_to_Unicode()
		+ '|interact.DOM.'
		// for Date.prototype.format(), String.prototype.to_Date(),
		// .to_millisecond()
		+ '|data.date.'
		// CeL.character.load(), 仅在要设定 this.charset 时才需要载入。
		+ '|data.character.'
		// gettext(), and for .detect_HTML_language(), .time_zone_of_language()
		+ '|application.locale.gettext'
		// guess_text_language()
		+ '|application.locale.encoding.'
		// storage.archive()
		+ '|application.storage.archive.',

		// 设定不汇出的子函式。
		no_extend : '*',

		// 为了方便格式化程式码，因此将 module 函式主体另外抽出。
		code : module_code
	});
}

function module_code(library_namespace) {

	// requiring
	var
	// library_namespace.locale.gettext
	gettext = this.r('gettext'),
	/** node.js file system module */
	node_fs = library_namespace.platform.nodejs && require('fs');

	// --------------------------------------------------------------------------------------------

	function Work_crawler(configurations) {
		Object.assign(this, configurations);

		// 预设自动汇入 .env.arg_hash
		if (this.auto_import_args)
			this.import_args();

		// 在crawler=new CeL.work_crawler({})的情况下可能没办法得到准确的档案路径，因此这个路径仅供参考。
		var main_script_path = library_namespace.get_script_base_path(/\.js/i,
				module);
		if (main_script_path)
			this.main_script = main_script_path;

		// this.id 之后将提供给 this.site_id 使用。
		// 在使用gui_electron含入档案的情况下，this.id应该稍后在设定。
		if (!this.id) {
			this.id = this.main_script
			// **1** require.main.filename: 如 require('./site_id.js')
			// **2** 如 node site_id.js work_id
			&& this.main_script
			// 去掉 path
			.replace(/^[\s\S]*[\\\/]([^\\\/]+)$/, '$1')
			// 去掉 file extension
			.replace(/\.*[^.]+$/, '')
			// NOT require('./site_id.js'). 如 node site_id.js work_id
			|| this.main_directory.replace(/\.*[\\\/]+$/, '')
			// **3** others: unnormal
			|| this.base_URL.match(/\/\/([^\/]+)/)[1].toLowerCase().split('.')
			//
			.reverse().some(function(token, index) {
				if (index === 0) {
					// 顶级域名
					return false;
				}
				if (token !== 'www') {
					this.id = token;
				}
				if (token.length > 3 || index > 1) {
					// e.g., www.[id].co.jp
					return true;
				}
			}, this);
			if (!this.id && !(this.id = this.id.match(/[^\\\/]*$/)[0])) {
				library_namespace.error({
					// gettext_config:{"id":"cannot-detect-work-id-from-url-$1"}
					T : [ '无法从网址撷取作品 id：%1', this.base_URL ]
				});
			}
		}
		// gettext_config:{"id":"starting-$1"}
		process.title = gettext('Starting %1', this.id);

		if (library_namespace.is_digits(this.baidu_cse)) {
			if (!this.parse_search_result) {
				// for 百度站内搜索工具。非百度搜索系统得要自己撰写。
				this.parse_search_result = 'baidu';
			}
			// baidu cse id 百度站内搜索工具。
			if (!this.search_URL) {
				this.search_URL = {
					URL : 'http://zhannei.baidu.com/cse/search?s='
					// &ie=utf-8 &isNeedCheckDomain=1&jump=1 &entry=1
					+ this.baidu_cse + '&q=',
					charset : 'UTF-8'
				};
			}
		}

		if (typeof this.parse_search_result === 'string') {
			if (crawler_namespace.parse_search_result_set[this.parse_search_result]) {
				this.parse_search_result = crawler_namespace.parse_search_result_set[this.parse_search_result];
			} else {
				this.onerror('Work_crawler: No this parse_search_result: '
						+ this.parse_search_result, work_data);
				return Work_crawler.THROWED;
			}
		}

		// 设定预设可容许的最小图像大小。
		if (!(this.MIN_LENGTH >= 0)) {
			// 先设定一个，预防到最后都没有被设定到。
			this.setup_value('MIN_LENGTH', 'default');
		}

		this.get_URL_options = {
			// start_time : Date.now(),
			no_protocol_warn : true,
			headers : Object.assign({
			// Referer will set @ start_downloading()
			// Referer : this.base_URL
			}, this.headers)
		};

		this.setup_value('timeout', this.timeout);
		this.setup_value('user_agent', this.user_agent
				|| crawler_namespace.regenerate_user_agent(this));

		// console.log(this.get_URL_options);
		this.default_agent = this.setup_agent();
	}

	// @inner static functions
	var crawler_namespace = Object.create(null);
	Work_crawler.crawler_namespace = crawler_namespace;

	// ------------------------------------------

	// return needing to wait language converted
	// var promise_language = this.cache_converted_text(text_list);
	// if (promise_language) { return promise_language.then(); }
	function cache_converted_text(text_list, options) {
		if (!this.convert_to_language)
			return;

		var initializated = this.convert_text_language_using
				&& this.convert_to_language_using === this.convert_to_language;
		if (initializated && !this.convert_text_language_using.is_asynchronous) {
			// 无须 cache，直接用 this.convert_text_language(text) 取得繁简转换过的文字即可。
			return;
		}

		if (!this.converted_text_cache) {
			this.converted_text_cache = Object.create(null);
			this.converted_text_cache_persisted = Object.create(null);
		}

		if (!Array.isArray(text_list))
			text_list = [ text_list ];

		var _this = this;
		text_list = text_list.filter(function(text) {
			return text && text.trim()
			//
			&& !(text in _this.converted_text_cache);
		});
		if (text_list.length === 0) {
			// Already cached all text needed.
			return;
		}

		// console.trace(text_list.length + ' text to be converted.');
		if (initializated) {
			return this.convert_text_language_using(text_list, options)
			// assert: .convert_text_language_using() return thenable
			.then(function set_text_list(converted_text_list) {
				text_list.forEach(function(text, index) {
					_this.converted_text_cache[text]
					//
					= converted_text_list[index];
				});
				// console.trace(_this.converted_text_cache);
			});
		}

		// console.trace('cache_converted_text: 初始化 initialization');

		return Promise.resolve(library_namespace.using_CeCC({
			// e.g., @ function create_ebook()
			skip_server_test : options.skip_server_test,
			// 结巴中文分词还太过粗糙，不适合依此做繁简转换。
			try_LTP_server : true
		})).then(function() {
			_this.convert_to_language_using = _this.convert_to_language;

			_this.convert_text_language_using
			// setup this.convert_text_language_using
			= _this.convert_to_language === 'TW'
			// library_namespace.extension.zh_conversion.CN_to_TW();
			? library_namespace.CN_to_TW : library_namespace.TW_to_CN;
		}).then(cache_converted_text.bind(this, text_list, options));
	}

	// Release memory. 释放被占用的记忆体。
	function clear_converted_text_cache(options) {
		if (!this.convert_to_language)
			return;

		// console.trace(options);
		if (options === true) {
			options = {
				including_persistence : true
			};
		} else {
			options = library_namespace.setup_options(options);
		}

		// ('text' in options)
		if (typeof options.text === 'string') {
			delete this.converted_text_cache[options.text];
		} else {
			// console.trace(options);
			delete this.converted_text_cache;
		}

		if (options.including_persistence)
			delete this.converted_text_cache_persisted;
	}

	function convert_text_language(text, options) {
		if (!text || !text.trim() || !this.convert_to_language)
			return text;

		if (!this.convert_text_language_using.is_asynchronous)
			return this.convert_text_language_using(text);

		// 当无法取得文章内容时，可能出现 this.converted_text_cache === undefined
		if (text in this.converted_text_cache) {
			var converted_text = this.converted_text_cache[text];
			if (false && text.length !== converted_text.length) {
				throw new Error('Different length:\n' + text + '\n'
						+ converted_text);
			}
			if (options && options.persistence)
				this.converted_text_cache_persisted[text] = converted_text;
			return converted_text;
		}

		if (text in this.converted_text_cache_persisted) {
			return this.converted_text_cache_persisted[text];
		}

		if (options && options.allow_non_cache) {
			return text;
		}

		// console.trace(this.converted_text_cache);
		// console.trace(text);
		// console.trace(this);
		throw new Error(
				'You should run `this.cache_converted_text(text_list)` first!');
	}

	// --------------------------------------------------------------------------------------------

	// 这边放的是一些会在 Work_crawler_prototype 中被运算到的数值。

	/** {Natural}重试次数：下载失败、出错时重新尝试下载的次数。同一档案错误超过此数量则跳出。若值太小，在某些网站很容易出现图片坏掉的问题。 */
	Work_crawler.MAX_ERROR_RETRY = 4;

	Work_crawler.HTML_extension = 'htm';

	// 数值规范设定于 import_arg_hash @ CeL.application.net.work_crawler.arguments
	var Work_crawler_prototype = {
		// 所有的子档案要修订注解说明时，应该都要顺便更改在CeL.application.net.work_crawler中Work_crawler.prototype内的母comments，并以其为主体。

		// 下载档案储存目录路径。
		// 图片档与纪录档的下载位置。下载网路网站的作品档案后，将储存于此目录下。
		// 这个目录会在 work_crawler_loader.js 里面被 setup_crawler() 之
		// global.data_directory 覆写。
		main_directory : library_namespace.storage
		// 决定预设的主要下载目录 default_main_directory。
		.determin_download_directory(true),

		// id : '',
		// site_id is also crower_id.
		// <meta name="generator" content="site_id" />
		// site_id : '',
		// base_URL : '',
		// charset : 'GBK',

		// 预设自动汇入 .env.arg_hash
		auto_import_args : true,

		// 本工具下载时预设的使用者代理为 Chrome，所以下载的档案格式基本上依循用 Chrome 浏览时的档案格式。
		// https://github.com/kanasimi/work_crawler/issues/548
		// 下载每个作品更换一次 user agent。
		// regenerate_user_agent : 'work',
		default_user_agent : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36',

		// default directory_name_pattern 预设作品目录名称模式。
		directory_name_pattern : '${id_title}${directory_name_extension}',

		/**
		 * {Natural|String}timeout for get_URL()
		 * 下载网页或图片的逾时等待时间。若逾时时间太小（如10秒），下载大档案容易失败。
		 * 
		 * 注意: 因为 this.get_URL_options 在 constructor 中建构完毕，因此 timeout
		 * 会在一开始就设定。之后必须以 `this.setup_value('timeout', this.timeout);`
		 * 设定，否则没有效果。
		 */
		timeout : '30s',
		// 本站速度颇慢，必须等待较久否则容易中断。
		// timeout : '60s',

		/** {Natural}重试次数：下载失败、出错时重新尝试下载的次数。同一档案错误超过此数量则跳出。若值太小，在某些网站很容易出现图片坏掉的问题。 */
		MAX_ERROR_RETRY : Work_crawler.MAX_ERROR_RETRY,
		/** {Natural}图片下载未完全，出现 EOI (end of image) 错误时重新尝试的次数。 */
		MAX_EOI_ERROR : Math.min(3, Work_crawler.MAX_ERROR_RETRY),
		// {Natural}MIN_LENGTH:最小容许图片档案大小 (bytes)。
		// 若值太小，传输到一半坏掉的图片可能被当作正常图片而不会出现错误。
		// 因为当前尚未能 parse 图像，而 jpeg 档案可能在档案中间出现 End Of Image mark；
		// 因此当图像档案过小，即使侦测到以 End Of Image mark 作结，依然有坏档疑虑。
		//
		// 对于极少出现错误的网站，可以设定一个比较小的数值，并且设定.allow_EOI_error=false。因为这类型的网站要不是无法获取档案，要不就是能够获取完整的档案；要得到破损档案，并且已通过EOI测试的机会比较少。
		// MIN_LENGTH : 4e3,
		// 对于有些图片只有一条细横杆的情况。
		// MIN_LENGTH : 130,

		// {Natural}预设所容许的章节最短内容字数。最少应该要容许一句话的长度。
		MIN_CHAPTER_SIZE : 200,

		// {String}预设的图片类别/图片延伸档名/副档名/档案类别/image filename extension。
		default_image_extension : 'jpg',

		// cache directory below this.main_directory.
		// 必须以 path separator 作结。
		cache_directory_name : library_namespace.append_path_separator('cache'),
		// archive directory below this.main_directory for ebook / old comics.
		// 封存旧电子书、旧漫画用的目录。
		// 必须以 path separator 作结。
		archive_directory_name : library_namespace
				.append_path_separator('archive'),
		// log directory below this.main_directory 必须以 path separator 作结。
		log_directory_name : library_namespace.append_path_separator('log'),
		// 错误记录档案: 记录无法下载的图档。
		error_log_file : 'error_files.txt',
		// 当从头开始检查时，会重新设定错误记录档案。此时会把旧的记录档改名成为这个档案。
		// 移动完之后这个值会被设定为空，以防被覆写。
		error_log_file_backup : 'error_files.'
				+ (new Date).format('%Y%2m%2dT%2H%2M%2S') + '.txt',
		// last updated date, latest update date. 最后更新日期时间。
		// latest_chapter_url → latest_chapter_url
		// latest_chapter_name, last_update_chapter → latest_chapter
		// update_time, latest_update → last_update
		// 这些值会被复制到记录报告中，并用在 show_search_result() @ gui_electron_functions.js。
		last_update_status_keys : 'latest_chapter,last_update_chapter,latest_chapter,latest_chapter_name,latest_chapter_url,last_update,update_time'
				.split(','),
		// 记录报告档案/日志的路径。
		report_file : 'report.' + (new Date).format('%Y%2m%2dT%2H%2M%2S') + '.'
				+ Work_crawler.HTML_extension,
		report_file_JSON : 'report.json',

		backup_file_extension : 'bak',

		// default start chapter index: 1.
		// 将开始/接续下载的章节编号。对已下载过的章节，必须配合 .recheck。
		// 若是 start_chapter 在之前下载过的最后一个章节之前的话，那么就必须要设定 recheck 才会有效。
		// 之前下载到第8章且未设定 recheck，则指定 start_chapter=9 **有**效。
		// 之前下载到第8章且未设定 recheck，则指定 start_chapter=7 **无**效。必须设定 recheck。
		// start_chapter : 1,
		start_chapter_NO : 1,
		// 是否重新获取每个所检测的章节内容 chapter_page。
		// 警告: reget_chapter=false 仅适用于小说之类不获取图片的情形，
		// 因为若有图片（parse_chapter_data()会回传chapter_data.image_list），将把chapter_page写入仅能从chapter_URL获取名称的于目录中。
		reget_chapter : true,
		// 是否保留 chapter page。false: 明确指定不保留，将删除已存在的 chapter page。
		// 注意: 若是没有设定 .reget_chapter，则 preserve_chapter_page 不应发生效用。
		preserve_chapter_page : false,
		// 是否保留作品资料 cache 于 this.cache_directory_name 下。
		preserve_work_page : false,
		// 是否保留损坏图档。
		preserve_bad_image : true,
		// 是否保留 cache
		// preserve_cache : true,
		// 当新获取的档案比较大时，覆写旧的档案。
		// https://github.com/kanasimi/work_crawler/issues/242
		overwrite_old_file : true,

		// recheck:从头检测所有作品之所有章节与所有图片。不会重新撷取图片。对漫画应该仅在偶尔需要从头检查时开启此选项。default:false
		// 每次预设会从上一次中断的章节接续下载，不用特地指定 recheck。
		// 有些漫画作品分区分单行本、章节与外传，当章节数量改变、添加新章节时就需要重新检查/扫描。
		// recheck='changed': 若是已变更，例如有新的章节，则重新下载/检查所有章节内容。否则只会自上次下载过的章节接续下载。
		// recheck='multi_parts_changed': 当有多个分部的时候才重新检查。
		// recheck : true,
		// recheck=false:明确指定自上次下载过的章节接续下载。
		// recheck : false,
		//
		// 当无法获取 chapter 资料时，直接尝试下一章节。在手动+监视下 recheck 时可并用此项。 default:false
		// skip_chapter_data_error : true,

		// 重新搜寻。default:false
		// search_again : false,

		// TODO: .heif
		image_types : {
			jpg : true,
			jpeg : true,
			// 抓取到非JPG图片
			png : true,
			gif : true,
			webp : true,
			bmp : true
		},

		// 漫画下载完毕后压缩每个章节的图像档案。
		archive_images : true,
		// 完全没有出现错误才压缩图片档案。
		// archive_all_good_images_only : true,
		// 压缩图片档案之后，删掉原先的图片档案。 请注意：必须先安装 7-Zip **18.01 以上的版本**。
		remove_images_after_archive : true,
		// or .cbz
		images_archive_extension : 'zip',

		// 由文章状态/进程获取用在作品完结的措辞。
		finished_words : finished_words,
		is_finished : is_finished,

		full_URL : full_URL_of_path,

		convert_text_language : convert_text_language,
		cache_converted_text : cache_converted_text,
		clear_converted_text_cache : clear_converted_text_cache,

		// work_data properties to reset. do not inherit
		// 设定不继承哪些作品资讯。
		reset_work_data_properties : {
			limited : true,
			// work_data.recheck
			recheck : true,
			download_chapter_NO_list : true,
			// work_data.last_download
			last_download : true,
			start_chapter_NO_next_time : true,

			error_images : true,
			chapter_count : true,
			image_count : true
		}
	};

	Object.assign(Work_crawler.prototype, Work_crawler_prototype);
	// Release memory. 释放被占用的记忆体。
	Work_crawler_prototype = null;

	// --------------------------------------------------------------------------------------------

	/**
	 * 重设浏览器识别 navigator.userAgent
	 * 
	 * CeL.work_crawler.regenerate_user_agent(crawler)
	 * 
	 * @return {String}浏览器识别
	 */
	function regenerate_user_agent(crawler) {
		// 模拟 Chrome。
		crawler.user_agent = crawler.default_user_agent
		// 并且每次更改不同的 user agent。
		.replace(/( Chrome\/\d+\.\d+\.)(\d+)/,
		//
		function(all, main_ver, sub_ver) {
			return main_ver + (Math.random() * 1e4 | 0);
		});

		return crawler.user_agent;
	}

	// --------------------------------------------------------------------------------------------

	// node.innerText
	function get_label(html) {
		return html ? library_namespace.HTML_to_Unicode(
				html.replace(/<!--[\s\S]*?-->/g, '').replace(
						/<(script|style)[^<>]*>[\s\S]*?<\/\1>/g, '').replace(
						/\s*<br(?:[^\w<>][^<>]*)?>[\r\n]*/ig, '\n').replace(
						/<\/?[a-z][^<>]*>/g, '')
				// incase 以"\r"为主。 e.g., 起点中文网
				.replace(/\r\n?/g, '\n')).trim().replace(
		// \u2060: word joiner (WJ). /^\s$/.test('\uFEFF')
		/[\s\u200B\u200E\u200F\u2060]+$|^[\s\u200B\u200E\u200F\u2060]+/g, '')
		// .replace(/\s{2,}/g, ' ').replace(/\s?\n+/g, '\n')
		// .replace(/[\t\n]/g, ' ').replace(/ {3,}/g, ' ' + ' ')
		: '';
	}

	// modify from CeL.application.net
	// 本函式将使用之 encodeURIComponent()，包含对 charset 之处理。
	// @see function_placeholder() @ module.js
	crawler_namespace.encode_URI_component = function encode_URI_component(
			string, encoding) {
		if (library_namespace.character) {
			library_namespace.debug('采用 ' + library_namespace.Class
			// 有则用之。 use CeL.data.character.encode_URI_component()
			+ '.character.encode_URI_component', 1, module_name);
			crawler_namespace.encode_URI_component = library_namespace.character.encode_URI_component;
			return crawler_namespace.encode_URI_component(string, encoding);
		}
		return encodeURIComponent(string);
	};

	function full_URL_of_path(url, base_data, base_data_2) {
		if (typeof url === 'function') {
			url = url.call(this, base_data, base_data_2);
		} else if (base_data) {
			base_data = crawler_namespace.encode_URI_component(
					String(base_data), url.charset || this.charset);
			if (url.URL) {
				url.URL += base_data
			} else {
				// assert: typeof url === 'string'
				url += base_data;
			}
		}

		if (!url) {
			// error occurred: 未能解析出网址
			return url;
		}

		// combine urls
		if (typeof url === 'string' && !url.includes('://')) {
			if (/^https?:\/\//.test(url)) {
				return url;
			}

			if (url.startsWith('/')) {
				if (url.startsWith('//')) {
					// 借用 base_URL 之 protocol。
					return this.base_URL.match(/^(https?:)\/\//)[1] + url;
				}
				// url = url.replace(/^[\\\/]+/g, '');
				// 只留存 base_URL 之网域名称。
				return this.base_URL.match(/^https?:\/\/[^\/]+/)[0] + url;
			} else {
				// 去掉开头的 "./"
				url = url.replace(/^\.\//, '');
			}
			if (url.startsWith('.')) {
				library_namespace.warn([ 'full_URL_of_path: ', {
					// gettext_config:{"id":"invalid-url-$1"}
					T : [ '网址无效：%1', url ]
				} ]);
			}
			url = this.base_URL + url;
		} else if (url.URL) {
			url.URL = this.full_URL(url.URL);
		}

		return url;
	}

	// ----------------------------------------------------------------------------

	function finished_words(status) {
		status = String(status);

		// e.g., https://syosetu.org/?mode=ss_detail&nid=33378
		if (/^[(\[]?(?:完[结结成]?|Completed)[)\]]?$/i.test(status))
			return status;

		// e.g., 连载中, 连载中, 已完结, 已完成, 已完结作品, 已连载完毕, 已完/未完
		// 已载完: https://www.cartoonmad.com/comic/1029.html
		var matched = status.match(/(?:^|已)完(?:[结结成]|$)/);
		if (matched)
			return matched[0];

		// 完本: http://book.qidian.com/
		if ('完结済|完本|読み切り'.split('|').some(function(word) {
			return status.includes(word);
		})) {
			return status;
		}

		// ck101: 全文完, 全书完
		// MAGCOMI: 连载终了作品
		// comico_jp: 更新终了
		if (/全[文书]完|终了/.test(status)) {
			return status;
		}

		// 已停更
	}

	function is_finished(work_data) {
		if (!work_data)
			return;

		if ('is_finished' in work_data) {
			return work_data.is_finished;
		}

		var status_list = library_namespace.is_Object(work_data) ? work_data.status
				// treat work_data as status
				: work_data, date;
		if (!status_list) {
			if (!this.no_checking_of_long_time_no_updated
					// 检查是否久未更新。
					&& this.recheck
					&& !work_data.recheck
					&& library_namespace.is_Object(work_data)
					&& (Date.now()
					//
					- (date = crawler_namespace.set_last_update_Date(work_data)))
							// 因为没有明确记载作品是否完结，10年没更新就不再重新下载。
							/ library_namespace.to_millisecond('1D') > (work_data.recheck_days || 10 * 366)) {
				library_namespace.info([ 'is_finished: ', {
					// gettext_config:{"id":"«$1»-has-not-been-updated.-$2-is-no-longer-forced-to-re-download.-it-will-only-be-re-downloaded-if-the-number-of-chapters-changes"}
					T : [ '《%1》已 %2 没有更新，时间过久不再强制重新下载，仅在章节数量有变化时才重新下载。'
					//
					, work_data.title, library_namespace.age_of(date) ]
				} ]);
				work_data.recheck = 'changed';
			}

			return status_list;
		}
		// {String|Array}status_list

		if (!Array.isArray(status_list)) {
			return this.finished_words(status_list);
		}

		var finished;
		if (status_list.some(function(status) {
			return finished = this.finished_words(status);
		}, this)) {
			return finished;
		}
	}

	// --------------------------------------------------------------------------------------------

	// export 导出.

	// includes sub-modules
	var module_name = this.id;
	this.finish = function(name_space, waiting) {
		library_namespace.run(
		// @see work_crawler/*.js
		'arguments,task,search,work,chapter,image,ebook'.split(',')
		//
		.map(function(name) {
			return module_name + '.' + name;
		}), waiting);
		return waiting;
	};

	// @inner
	Object.assign(crawler_namespace, {
		// @see CeL.application.net.wiki
		PATTERN_non_CJK : /^[\u0000-\u2E7F]*$/i,
		get_label : get_label,
		regenerate_user_agent : regenerate_user_agent,
		null_XMLHttp : {
			responseText : ''
		}
	});

	return Work_crawler;
}
