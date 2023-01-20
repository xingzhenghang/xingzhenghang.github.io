/**
 * @name WWW work crawler sub-functions
 * 
 * @fileoverview WWW work crawler functions: part of ebook
 * 
 * @since 2019/10/13 拆分自 CeL.application.net.work_crawler
 */

'use strict';

// --------------------------------------------------------------------------------------------

if (typeof CeL === 'function') {
	// 忽略没有 Windows Component Object Model 的错误。
	CeL.env.ignore_COM_error = true;

	CeL.run({
		// module name
		name : 'application.net.work_crawler.ebook',

		require : 'application.net.work_crawler.',

		// 设定不汇出的子函式。
		no_extend : 'this,*',

		// 为了方便格式化程式码，因此将 module 函式主体另外抽出。
		code : module_code
	});
}

function module_code(library_namespace) {

	// requiring
	var Work_crawler = library_namespace.net.work_crawler, crawler_namespace = Work_crawler.crawler_namespace;

	var gettext = library_namespace.locale.gettext,
	/** node.js file system module */
	node_fs = library_namespace.platform.nodejs && require('fs');

	var
	/** {Number}未发现之index。 const: 基本上与程式码设计合一，仅表示名义，不可更改。(=== -1) */
	NOT_FOUND = ''.indexOf('_');

	// --------------------------------------------------------------------------------------------

	// 在下载/获取小说章节内容的时候，若发现有章节被目录漏掉，则将之补上。

	// 通常应该会被 parse_chapter_data() 呼叫。
	function check_next_chapter(work_data, chapter_NO, html,
			PATTERN_next_chapter) {
		// /下一[章页][：: →]*<a [^<>]*?href="([^"]+.html)"[^<>]*>/
		var next_url = html && html.match(PATTERN_next_chapter ||
		// PTCMS default. e.g., "下一章 →" /下一章[：: →]*/
		// PATTERN_next_chapter: [ all, next chapter url ]
		/**
		 * <code>
		<a href="//read.qidian.com/chapter/abc123">下一章</a>

		https://www.fxnzw.com/fxnread/45100_8000445.html
		<a hidefocus href="/fxnread/45100_8000446.html" title="第二章 正一宗 最仙游">【下一章】</a>
		</code>
		 */
		/ href=["']([^<>"']+)["'][^<>]*>(?:<button[^<>]*>)?【?下一[章页]/);
		// console.log(chapter_NO + ': ' + next_url[1]);

		if (!next_url)
			return;

		// 去掉开头的 "./"。
		next_url = new library_namespace.URI(next_url[1],
		// TODO: {Array}this.chapter_URL()
		this.chapter_URL(work_data, chapter_NO).replace(/[^\/]+$/, ''))
				.toString();
		if (!next_url)
			return;

		var full_next_url = this.full_URL(next_url),
		//
		next_chapter = work_data.chapter_list[chapter_NO],
		// chapter_data.url
		next_chapter_url = next_chapter && next_chapter.url;

		if (next_chapter_url && !next_chapter_url.startsWith('/')
		// e.g., '123.htm', '123/123.htm'
		&& !next_chapter_url.includes('://')) {
			next_chapter_url = this.chapter_URL(work_data, chapter_NO).replace(
					/[^\/]*$/, next_chapter_url);
		}

		if (false) {
			console.trace([ full_next_url, work_data.url, next_chapter_url,
					this.full_URL(next_chapter_url) ]);
		}
		if (full_next_url === work_data.url
		// 许多网站会把最新章节的下一页设成章节列表，因此必须排除章节列表的网址。
		|| full_next_url === work_data.chapter_list_URL
		// 有些在目录上面的章节连结到了错误的页面，只能靠下一页来取得正确页面。
		|| full_next_url === this.full_URL(next_chapter_url)) {
			return;
		}

		if (false) {
			// 不采用插入的方法，直接改掉下一个章节。
			library_namespace.info(library_namespace.display_align([
			// gettext_config:{"id":"chapter-$1"}
			[ gettext('章节编号%1：', chapter_NO), next_chapter_url ],
					[ '→ ', next_url ] ]));
			next_chapter.url = next_url;
		}

		if (work_data.chapter_list.some(function(chapter_data) {
			return chapter_data.url === next_url
					|| chapter_data.url === full_next_url;
		})) {
			// url 已经在 chapter_list 里面。
			return;
		}

		var this_chapter_data = work_data.chapter_list[chapter_NO - 1];
		var message = [ 'check_next_chapter: ', {
			// gettext_config:{"id":"insert-a-chapter-url-after-chapter-$1-$2"}
			T : [ 'Insert a chapter url after chapter %1: %2', chapter_NO
			//
			+ (this_chapter_data && this_chapter_data.url
			//
			? ' (' + this_chapter_data.url + ')' : ''),
			//
			next_url ]
		},
		// 原先下一个章节的 URL 被往后移一个。
		next_chapter_url ? ' → ' + next_chapter_url : '' ];
		if (next_chapter_url) {
			// Insert a chapter url
			library_namespace.log(message);
		} else {
			// Append a chapter url at last
			library_namespace.debug(message);
		}

		// 动态插入章节。
		var chapter_data_to_insert = {
			// title : '',
			url : next_url
		};
		// Copy attributes
		[ 'part_title' ].forEach(function(key) {
			var value = this_chapter_data[key];
			if (value)
				chapter_data_to_insert[key] = value;
		});
		work_data.chapter_list.splice(chapter_NO, 0, chapter_data_to_insert);
		// 重新设定章节数量。
		work_data.chapter_count = work_data.chapter_list.length;
		return true;
	}

	// --------------------------------------------------------------------------------------------
	// 本段功能须配合 CeL.application.storage.EPUB 并且做好事前设定。
	// 可参照 https://github.com/kanasimi/work_crawler

	// extract "繁简转换 cache.7z" or "繁简转换 cache.zip"
	function extract_convert_cache_directory(work_data) {
		var cache_directory = work_data.convert_options.cache_directory
				.replace(/[\\\/]$/, '');
		if (library_namespace.directory_exists(cache_directory)) {
			library_namespace.info('extract_convert_cache_directory: '
			// 语言转换 TAG_text_converted
			// gettext_config:{"id":"overwrite-the-files-in-the-cache-directory-$1-for-traditional-and-simplified-chinese-conversions"}
			+ gettext('将覆写繁简中文转换快取目录 [%1] 中的档案。', cache_directory));
		}

		var cache_archive_file = cache_directory + '.7z';
		if (!library_namespace.file_exists(cache_archive_file)
				&& !library_namespace.file_exists(
				//
				cache_archive_file = cache_directory + '.zip')) {
			return;
		}

		cache_archive_file = new library_namespace.storage.archive(
				cache_archive_file);
		return new Promise(function(resolve, reject) {
			library_namespace.log_temporary({
				// gettext_config:{"id":"decompress-the-cache-files-for-traditional-and-simplified-chinese-conversions-$1"}
				T : [ '解压缩繁简中文转换快取档案：[%1]。',
						cache_archive_file.archive_file_path ]
			});
			cache_archive_file.extract({
				// 解压缩 "!short_sentences_word_list.json" 时会跳出 prompt。
				yes : true,
				output : work_data.directory
			}, function(data, error) {
				error ? reject(error) : resolve(data);
			});
		});
	}

	function archive_convert_cache_directory(work_data) {
		var cache_directory = work_data.convert_options.cache_directory
				.replace(/[\\\/]$/, '');
		var cache_archive_file = cache_directory + '.7z';

		cache_archive_file = new library_namespace.storage.archive(
				cache_archive_file);
		return new Promise(function(resolve, reject) {
			library_namespace.log_temporary({
				// gettext_config:{"id":"compress-the-cache-files-for-traditional-and-simplified-chinese-conversions-$1"}
				T : [ '压缩繁简中文转换快取档案：[%1]。',
						cache_archive_file.archive_file_path ]
			});
			cache_archive_file.update(cache_directory, {
				only_when_newer_exists : 'file',
				level : 'max',
				remove : true,
				recurse : true
			}, function(data, error) {
				error ? reject(error) : resolve(data);
			});
		});
	}

	// ----------------------------------------------------

	// 当文章内文以章节标题起始时，去除章节标题的部分。
	function trim_start_title(text, chapter_data) {
		var title = chapter_data.title || chapter_data;

		var index = text.indexOf(title);
		if (index === NOT_FOUND)
			return text;

		var previous = library_namespace.HTML_to_Unicode(text.slice(0, index));
		previous = previous.replace(/<\/?\w[^<>]*>|[\s]+/g, '');
		// console.trace(previous);
		return previous ? text : text.slice(index + title.length);
	}

	// CeL.work_crawler.trim_start_title()
	Work_crawler.trim_start_title = trim_start_title;

	// ----------------------------------------------------

	function set_last_update_Date(work_data, force) {
		if (!library_namespace.is_Date(work_data.last_update_Date)
				&& typeof work_data.last_update === 'string'
				&& work_data.last_update) {
			var last_update_Date = work_data.last_update;
			// assert: typeof last_update_Date === 'string'

			var matched = last_update_Date
			// dm5.js: "02月27号"
			.match(/^(\d{1,2})[-/月](\d{1,2})[日号]?$/);
			if (matched) {
				// for month-date. e.g., '02-11'
				last_update_Date = '/' + matched[1] + '/' + matched[2];
				var year = (new Date).getFullYear(), date = year
						+ last_update_Date;
				last_update_Date = Date.parse(date) > Date.now() ? (year - 1)
						+ last_update_Date : date;
			}

			last_update_Date = last_update_Date.to_Date({
				// 注意: 若此时尚未设定 work_data.time_zone，可能会获得错误的结果。
				zone : work_data.time_zone
			});
			// 注意：不使用 cache。
			if (force || ('time_zone' in work_data))
				work_data.last_update_Date = last_update_Date;
		}
		return work_data.last_update_Date;
	}

	// gettext_config:{"id":"language-conversion"}
	var TAG_text_converted = '语言转换';
	function create_ebook(work_data, options) {
		// var forced_recreate = options && options.forced_recreate;

		// 检查 ebook 先备条件。 check_ebook_prerequisites
		var cecc = this.convert_text_language_using
				&& this.convert_text_language_using.cecc;
		// console.trace(cecc);
		if (cecc && cecc.load_text_to_check) {
			var promise_load_text_to_check = cecc.load_text_to_check({
				work_title : work_data.title,
				convert_to_language : this.convert_to_language
			}, {
				reset : true
			});
			if (library_namespace.is_thenable(promise_load_text_to_check)) {
				// console.trace(promise_load_text_to_check);
				// 先初始化完毕后再重新执行。
				return promise_load_text_to_check.then(create_ebook.bind(this,
						work_data));
			}
		}

		work_data.convert_options = {
			work_title : work_data.title,
			// only for debug CeCC 繁简转换。
			cache_directory : library_namespace
					.append_path_separator(work_data.directory + '繁简转换 cache'),
			cache_file_for_short_sentences : true,

			// default (undefined) or 'word': 每个解析出的词单独作 zh_conversion。
			// 'combine': 结合未符合分词辞典规则之词一并转换。converter 必须有提供输入阵列的功能。
			// false: 按照原始输入，不作 zh_conversion。
			forced_convert_mode : 'combine',

			// 检查辞典档的规则。debug 用，会拖累效能。
			// check_dictionary : true,

			// 不检查/跳过通同字/同义词，通用词汇不算错误。用于无法校订原始文件的情况。
			// skip_check_for_synonyms : true,

			// 超过此长度才创建个别的 cache 档案，否则会放在 .cache_file_for_short_sentences。
			min_cache_length : 20
		};

		if (this.convert_to_language
				&& (!options || !options.no_extract_convert_cache_directory)) {
			extract_convert_cache_directory(work_data);
			// work_data.convert_cache_directory_extracted = Date.now();
			if (false) {
				var promise_extract_convert_cache_directory = extract_convert_cache_directory(work_data);
				if (promise_extract_convert_cache_directory) {
					// 先初始化完毕后再重新执行。
					return promise_extract_convert_cache_directory
							.then(create_ebook.bind(this, work_data, {
								// 跳过不需要的前置作业。
								no_extract_convert_cache_directory : true
							}));
				}
			}
		}

		// return needing to wait language converted
		var text_list = [ work_data.title, TAG_text_converted,
		// 执行到这边可能还没取得这两个数值。
		work_data.author, work_data.site_name ];
		// console.trace('Convert: ' + text_list);
		// 先测试是否使用 asynchronous 的 LTP server。
		var promise_language_convert = this.cache_converted_text(text_list,
		// 尽可能只使用 cache，不去动到 LTP server。
		Object.assign({
			skip_server_test : true
		}, work_data.convert_options));
		if (promise_language_convert) {
			// 先初始化完毕后再重新执行。
			// 注意: 这会造成 create_ebook() 这边之前的程式码执行两遍!
			return promise_language_convert.then(create_ebook.bind(this,
			// 跳过不需要的前置作业。本次执行不再重复解开 cache 档，但仍需要
			// cecc.load_text_to_check() 以载入作品的特设检核。
			work_data, Object.assign({
				no_extract_convert_cache_directory : true
			}, options)));
		}

		// ebook 先备条件检查完毕。
		// ------------------------------------------------

		if (!this.site_id) {
			this.site_id = this.id;
		}

		crawler_namespace.set_last_update_Date(work_data, true);

		var ebook_directory = work_data.directory + work_data.directory_name
		// + ' ebook'
		, ebook_files = library_namespace.read_directory(ebook_directory),
		//
		ebook_file_path = ebook_path.call(this, work_data, null, {
		// allow_non_cache : true
		});
		// ebook_file_path = ebook_file_path[0] + ebook_file_path[1];

		if ((!Array.isArray(ebook_files) || !ebook_files.includes('mimetype'))
				&& !this.discard_old_ebook_file
				&& library_namespace.file_exists(ebook_file_path[0]
						+ ebook_file_path[1])) {
			// 若是没有cache，但是有旧的epub档，那么就将之解压缩。
			// 其用意是为了保留媒体档案与好的旧章节，预防已经无法下载/获取。
			// 由于这个动作，当旧的电子书存在时将不会清场。若有必要清场（如太多冗赘），须设定.discard_old_ebook_file或自行将旧电子书删除。
			var ebook_archive = new library_namespace.storage.archive(
					ebook_file_path[0] + ebook_file_path[1]);
			library_namespace.log_temporary({
				// ebook_archive.archive_file_path
				// gettext_config:{"id":"extract-ebook-as-cache-$1"}
				T : [ 'Extract ebook as cache: [%1]', ebook_file_path[1] ]
			});
			ebook_archive.extract({
				output : ebook_directory
			});
		}

		// library_namespace.log('using CeL.application.storage.EPUB');
		var ebook = new library_namespace.EPUB(ebook_directory, {
			rebuild : Object.hasOwn(this, 'rebuild_ebook')
			// rebuild: 重新创建, 不使用旧的.opf资料. start over, re-create
			? work_data.rebuild_ebook : work_data.reget_chapter
					|| work_data.regenerate,
			id_type : this.site_id,
			// 以下为 epub <metadata> 必备之元素。
			// 小说ID
			identifier : work_data.id,
			title : this.convert_text_language(work_data.title, {
				// Will used in ebook_path()
				persistence : true
			}),
			language : this.convert_to_language ? 'zh-'
					+ library_namespace.gettext
							.to_standard(this.convert_to_language)
					: work_data.language || this.language,
			// 作品内容最后编辑时间。
			modified : work_data.last_update_Date
		}), subject = [];
		// keywords,キーワード 太多杂讯，如:
		// '万古剑神,,万古剑神全文阅读,万古剑神免费阅读,万古剑神txt下载,万古剑神txt全集下载,万古剑神蒙白'
		// category: PTCMS
		// ジャンル,キーワード: yomou.js (此两者为未分割的字串。)
		'status,genre,tags,category,categories,类型,カテゴリ'.split(',')
		// 标签 类别 类型 类型 types
		.forEach(function(type) {
			if (work_data[type])
				subject = subject.concat(work_data[type]);
		});
		if (this.convert_to_language) {
			subject.push(this.convert_text_language(TAG_text_converted),
			//
			gettext.get_alias(this.convert_to_language));
		}
		subject = subject.unique();

		var setup_ebook_options = {
			ebook : ebook,
			subject : subject,
			description : crawler_namespace.get_label(work_data.description
			// .description 中不可存在 tag。
			.replace(/\n*<br[^<>]*>\n*/ig, '\n'))
		};

		text_list = [ work_data.author, setup_ebook_options.description,
				work_data.site_name ];
		text_list.append(subject);
		// 将 ebook 相关作业纳入 {Promise}，可保证先添加完章节资料、下载完资源再 pack_ebook()。
		promise_language_convert = this.cache_converted_text(text_list,
				work_data.convert_options)
				|| Promise.resolve();
		return ebook.working_promise = promise_language_convert
				.then(setup_ebook.bind(this, work_data, setup_ebook_options));
	}

	// @inner only called by create_ebook()
	function setup_ebook(work_data, options) {
		var ebook = options.ebook, subject = options.subject
				.map(this.convert_text_language.bind(this));
		ebook.time_zone = work_data.time_zone || this.time_zone;

		// http://www.idpf.org/epub/31/spec/epub-packages.html#sec-opf-dcmes-optional
		ebook.set({
			// 作者名
			creator : this.convert_text_language(work_data.author),
			// 🏷标签, ジャンル genre, タグ, キーワード
			subject : subject,
			// 作品描述: 剧情简介, synopsis, あらすじ
			description : this.convert_text_language(options.description),
			publisher : this.convert_text_language(work_data.site_name) + ' ('
					+ this.base_URL + ')',
			// source URL
			source : work_data.url
		});

		if (this.vertical_writing || this.RTL_writing) {
			if (this.RTL_writing === undefined) {
				this.RTL_writing = typeof this.vertical_writing === 'string' ? /rl$/
						.test(this.vertical_writing)
						: !!this.vertical_writing;
			}
			ebook.set_writing_mode(this.vertical_writing, this.RTL_writing);
		}

		if (work_data.image) {
			// cover image of work
			ebook.set_cover(this.full_URL(work_data.image));
		}

		return work_data[this.KEY_EBOOK] = ebook;
	}

	// 找出段落开头。
	// '&nbsp;' 已经被 normailize_contents() @CeL.EPUB 转换为 '&#160;'
	var PATTERN_PARAGRAPH_START_CMN = /(^|\n|<\/?(?:br|p)(?:[^a-z][^<>]*)?>)(?:&#160;|[\s　]){4,}([^\s　\n&])/ig,
	//
	PATTERN_PARAGRAPH_START_JP = new RegExp(PATTERN_PARAGRAPH_START_CMN.source
			.replace('{4,}', '{2,}'), PATTERN_PARAGRAPH_START_CMN.flags);

	// 通常应该会被 parse_chapter_data() 呼叫。
	function add_ebook_chapter(work_data, chapter_NO, data) {
		var ebook = work_data && work_data[this.KEY_EBOOK];
		if (!ebook) {
			return;
		}

		// 可用来移除广告。
		if (this.pre_add_ebook_chapter) {
			// 去除掉中间插入的广告连结。
			// 修正这个网站的语法错误。
			// 去除掉结尾的广告。
			this.pre_add_ebook_chapter(data/* , work_data, chapter_NO */);
		}

		if (typeof data === 'string') {
			data = {
				text : data
			};
		}

		if (!data.sub_title) {
			if ('title' in data) {
				// throw '请将 parse_chapter_data() 中章节名称设定在 sub_title 而非 title!';
				// 当仅设定title时，将之当做章节名称而非part名称。
				data.sub_title = data.title;
				delete data.title;
			} else if (Array.isArray(work_data.chapter_list)
					&& work_data.chapter_list[chapter_NO - 1].title) {
				data.sub_title = work_data.chapter_list[chapter_NO - 1].title;
			}
		}

		if (Array.isArray(data.title)) {
			data.title = data.title
					.join(library_namespace.EPUB.prototype.title_separator);
		}
		// assert: !data.title || typeof data.title === 'string'

		var chapter_data = Array.isArray(work_data.chapter_list)
				&& work_data.chapter_list[chapter_NO - 1],
		// 卷篇集幕部册册本辑/volume/part/book
		part_title = crawler_namespace.get_label(data.title || chapter_data
				&& chapter_data.part_title || ''),
		// 章节名称 / 篇章名称 / 章节节回折篇话话页页/chapter/section
		chapter_title = crawler_namespace.get_label(data.sub_title
				|| chapter_data
				&& (chapter_data.chapter_title || chapter_data.title) || '');

		var options = {
			chapter_data : chapter_data,
			part_title : part_title,
			chapter_title : chapter_title
		};

		// console.trace(work_data.convert_options);

		data.text = library_namespace.HTML_to_Unicode(
		// 处理 HTML tags 以减少其对 this.convert_text_language() 的影响。
		// TODO: <p> @ qidian.js
		library_namespace.EPUB.normailize_contents(data.text
		// remove all new-lines
		.replace(/[\r\n]+/g, '')
		// "<br />", "<br/>" → "\n"
		.replace(/\s*<br(?:[^\w<>][^<>]*)?>[\r\n]*/ig, '\n')
		// .trim()
		), true);
		// console.log(data.text);

		// return needing to wait language converted
		var text_list = [ part_title, chapter_title, data.text ];
		// console.trace(work_data.convert_options);
		var promise_language_convert = this.cache_converted_text(text_list,
				work_data.convert_options);
		if (promise_language_convert) {
			return ebook.working_promise = ebook.working_promise
			//
			.then(function() {
				return promise_language_convert.then(
				// TODO: 这边失败，例如 timeout 的话，会直接跳到最后一章并且出现错误。
				add_ebook_chapter_actual_work.bind(this, work_data, chapter_NO,
						data, options));
			}.bind(this));
		} else {
			// 将 ebook 相关作业纳入 {Promise}，可保证先添加完章节资料、下载完资源再 pack_ebook()。
			return ebook.working_promise = ebook.working_promise
					.then(add_ebook_chapter_actual_work.bind(this, work_data,
							chapter_NO, data, options));
		}
	}

	// @inner only called by add_ebook_chapter(work_data, chapter_NO, data)
	function add_ebook_chapter_actual_work(work_data, chapter_NO, data, options) {
		var chapter_data = options.chapter_data, part_title = options.part_title, chapter_title = options.chapter_title;

		// @see epub_hans_to_hant.js
		if (this.convert_to_language) {
			part_title = this.convert_text_language(part_title);
			chapter_title = this.convert_text_language(chapter_title);
			library_namespace.log_temporary({
				T : [ this.convert_to_language === 'TW'
				// gettext_config:{"id":"convert-simplified-chinese-to-traditional-chinese-«$1»"}
				? '将简体中文转换成繁体中文：《%1》'
				// gettext_config:{"id":"convert-traditional-chinese-to-simplified-chinese-«$1»"}
				: '将繁体中文转换成简体中文：《%1》', chapter_title ]
			});
			process.title = gettext(this.convert_to_language === 'TW'
			// gettext_config:{"id":"traditionalize-$1"}
			? '繁化: %1'
			// gettext_config:{"id":"simplify-$1"}
			: '简化: %1', chapter_title) + ' @ ' + this.id;
			data.original_text = data.text;
			data.text = this.convert_text_language(data.text)
			// TODO: 把半形标点符号转换为全形标点符号
			.replace(/["'](?:zh-(?:cmn-)?|cmn-)?(?:Hans-)?CN["']/ig,
			// "zh-TW"
			'"zh-cmn-Hant-TW"');
			this.clear_converted_text_cache({
				text : data.original_text
			});
			// free
			delete data.original_text;
		}

		data.text = data.text
		// recover HTML tags
		.replace(/\n/g, '<br />');

		// 一开始就该定一个不太需要改变的位数。
		// 不少小说超过1000个章节。
		var file_title = chapter_NO.pad(work_data.chapter_NO_pad_digits || 4)
				+ ' '
				+ (part_title ? part_title
						+ library_namespace.EPUB.prototype.title_separator : '')
				+ chapter_title;

		var item_data = {
			title : file_title,
			// include images / 自动载入内含资源, 将外部media内部化
			internalize_media : true,
			file : library_namespace.to_file_name(file_title + '.xhtml'),
			// 一般说来必须设定 work_data.chapter_list。
			date : data.date || chapter_data && chapter_data.date,
			// 设定 item_data.url 可以在阅读电子书时，直接点选标题就跳到网路上的来源。
			url : data.url
					|| this.full_URL(this.chapter_URL(work_data, chapter_NO)),
			// pass Referer, User-Agent
			get_URL_options : Object.assign({
				error_retry : this.MAX_ERROR_RETRY
			}, this.get_URL_options),
			words_so_far : work_data.words_so_far
		};

		var _this = this;
		var language = work_data.language
		// e.g., 'cmn-Hans-CN'
		&& work_data.language.match(/^(ja|(?:zh-)?cmn)(?:$|[^a-z])/)
		// e.g., xshuyaya.js
		|| this.language && [ , this.language ];
		if (language) {
			language = language[1].replace(/^zh-cmn/, 'cmn');
		}

		var item = {
			title : part_title,
			sub_title : chapter_title,
			// contents
			text : data.text,
			post_processor : function(contents) {
				// console.log([ language, contents ]);
				// 正规化小说章节文字。
				if (language === 'ja') {
					contents = contents.replace(PATTERN_PARAGRAPH_START_JP,
					// 日本语では行头から一文字の字下げをする。
					'$1　$2');
				} else if (language) {
					// assert: language: "cmn" (中文)
					// TODO: 下载完毕后作繁简转换。
					// TODO: 处理内缩。
					// TODO: 处理文章开头的内缩。
					contents = contents.replace(PATTERN_PARAGRAPH_START_CMN,
					// 中文每段落开头空两个字。
					'$1　　$2');
				}

				// TODO: 可去除一开始重复的章节标题。

				if (typeof _this.contents_post_processor === 'function') {
					contents = _this.contents_post_processor(contents,
							work_data);
				}

				if (contents.length < _this.MIN_CHAPTER_SIZE) {
					crawler_namespace.set_work_status(work_data, '§'
					//
					+ chapter_NO + ': '
					// gettext_config:{"id":"too-few-words-($1-characters)"}
					+ (contents.length ? gettext('字数太少（%1 个{{PLURAL:%1|字元}}）',
					// gettext_config:{"id":"no-content"}
					contents.length) : 'No content'));
				}
				return contents;
			}
		};
		// library_namespace.log('file_title: ' + file_title);

		var ebook = work_data && work_data[this.KEY_EBOOK];
		item = ebook.add(item_data, item);

		// 登记本作品到本章节总计的字数。
		function count_words_so_far(item) {
			if (item && !item.error && item_data.word_count > 0) {
				work_data.words_so_far = (work_data.words_so_far || 0)
						+ item_data.word_count;
			}
			// console.trace(work_data.words_so_far);
		}
		if (library_namespace.is_thenable(item)) {
			item = item.then(count_words_so_far);
		} else {
			count_words_so_far(item);
		}

		return item;
	}

	// 一般小说, 长篇小说
	// @see .chapter_unit
	// [ all, author, title, site name, date, chapter count, work id ]
	var PATTERN_ebook_file = /^\((?:一般|长篇|短篇|言情|日系)?小[说说]\) \[([^\[\]]+)\] ([^\[\]]+) \[(.*?) (\d{8})(?: (\d{1,4})[章节节回折篇话话页页])?\]\.(.+)\.epub$/i;
	function parse_ebook_name(file_name) {
		library_namespace.debug(file_name, 3, 'parse_ebook_name');
		var matched = typeof file_name === 'string'
				&& file_name.match(PATTERN_ebook_file);
		// console.log(matched);
		if (matched) {
			return {
				file_name : file_name,
				author : matched[1],
				title : matched[2],
				// titles :
				// matched[2].trim().split(library_namespace.EPUB.prototype.title_separator),
				site_name : matched[3],
				// e.g., "20170101"
				date : matched[4],
				chapter_count : matched[5],
				// book id in this site
				id : matched[6]
			};
		}
	}

	function get_file_status(file_name, directory) {
		var status = node_fs.lstatSync((directory || '') + file_name);
		status.name = file_name;
		return status;
	}

	// @inner
	// remove duplicate title ebooks.
	// 封存旧的ebooks，移除较小的旧档案。
	function remove_old_ebooks(only_id) {
		// only_id = undefined;
		if (only_id !== undefined) {
			// assert: {String|Number}only_id
			only_id = only_id.toString();
			var _only_id = this.parse_ebook_name(only_id);
			if (_only_id)
				only_id = _only_id.id;
		}

		var _this = this;

		if (!this.ebook_archive_directory) {
			this.ebook_archive_directory = this.main_directory
					+ this.archive_directory_name;
			if (!library_namespace
					.directory_exists(this.ebook_archive_directory)) {
				library_namespace.create_directory(
				// 先创建封存用目录。
				this.ebook_archive_directory);
			}
		}

		function for_each_old_ebook(directory, for_old_smaller, for_else_old) {
			var last_id, last_file,
			//
			ebooks = library_namespace.read_directory(directory);
			// console.log(ebooks);

			if (!ebooks) {
				// 照理来说应该在之前已经创建出来了。
				library_namespace.warn({
					// gettext_config:{"id":"there-is-no-directory-for-archive-files-$1"}
					T : [ '不存在封存档案用的目录：%1', _this.ebook_archive_directory ]
				});
				return;
			}

			ebooks
			// assert: 依 id 旧至新排列
			.sort().map(_this.parse_ebook_name.bind(_this))
			//
			.forEach(function(data) {
				if (!data
				// 仅针对 only_id。
				|| only_id && data.id !== only_id) {
					return;
				}
				// console.log('-'.repeat(60));
				// console.log(data);
				if (!last_id || last_id !== data.id) {
					last_id = data.id;
					last_file = data.file_name;
					return;
				}

				var this_file = get_file_status(
				//
				data.file_name, directory);
				// console.log(this_file);
				if (typeof last_file === 'string') {
					last_file = get_file_status(
					//
					last_file, directory);
				}
				// console.log(last_file);
				// assert: this_file, last_file are all {Object}(file status)

				if (this_file.size >= last_file.size) {
					for_old_smaller(last_file, this_file);
				} else if (for_else_old) {
					for_else_old(last_file, this_file);
				}

				last_file = this_file;
			});
		}

		// 封存较小的ebooks旧档案。
		for_each_old_ebook(this.main_directory, function(last_file) {
			last_file = last_file.name;
			library_namespace.log(_this.main_directory + last_file
			// 新档比较大。删旧档或将之移至archive。
			+ '\n→ ' + _this.ebook_archive_directory + last_file);
			library_namespace.move_file(
			//
			_this.main_directory + last_file,
			//
			_this.ebook_archive_directory + last_file);

		}, this.milestone_extension && function(last_file) {
			last_file = _this.main_directory + last_file.name;
			var extension = (typeof _this.milestone_extension === 'string'
			// allow .milestone_extension = true
			? _this.milestone_extension : '.milestone') + '$1',
			// 旧档比较大!!将之标注成里程碑纪念/纪录。
			rename_to = last_file.replace(/(.[a-z\d\-]+)$/i, extension);
			// assert: PATTERN_ebook_file.test(rename_to) === false
			// 不应再被纳入检测。
			library_namespace.info(library_namespace.display_align([
			// Set milestone: 日本小说网站有时会商业化，将之前的作品内容大幅删除。这时若删掉旧档，就会失去这些内容。
			// gettext_config:{"id":"preserve"}
			[ gettext('保留旧档：'), last_file ],
			// gettext_config:{"id":"move-to-→"}
			[ gettext('搬移至 →'), rename_to ] ]));
			library_namespace.move_file(last_file, rename_to);
		});

		// ✘ 移除.ebook_archive_directory中，较小的ebooks旧档案。
		// 仅留存最新的一个ebooks旧档案。
		for_each_old_ebook(this.ebook_archive_directory, function(last_file,
				this_file) {
			library_namespace.info([ {
				// gettext_config:{"id":"removed-old-files"}
				T : '移除旧档案：'
			},
			// 新档比较大。删旧档。
			_this.ebook_archive_directory + last_file.name + ' ('
			// https://en.wikipedia.org/wiki/Religious_and_political_symbols_in_Unicode
			+ this_file.size + ' = ' + last_file.size + '+'
			// ✞ Memorial cross, Celtic cross
			+ (this_file.size - last_file.size) + ')' ]);
			library_namespace.remove_file(
			//
			_this.ebook_archive_directory + last_file.name);
		});
	}

	// ebook_path.call(this, work_data, file_name)
	function ebook_path(work_data, file_name, options) {
		if (!file_name) {
			if (!work_data.author || !work_data.site_name) {
				library_namespace
						.error('ebook_path: 尚未设定作者或下载站点，可能导致先前 cache 无用。');
			}
			// e.g., "(一般小说) [author] title [site 20170101 1话].id.epub"
			file_name = [
					'(一般小说) [',
					this.convert_text_language(work_data.author
					// , options
					),
					'] ',
					this.convert_text_language(work_data.title),
					' [',
					this.convert_text_language(work_data.site_name
					// , options
					),
					' ',
					work_data.last_update_Date.format('%Y%2m%2d'),
					work_data.chapter_count >= 1
					//
					? ' ' + work_data.chapter_count
					//
					+ (work_data.chapter_unit || this.chapter_unit) : '',
					']',
					this.RTL_writing ? ' ('
							+ (/^ja/.test(work_data.language) ? '縦书き' : '纵书')
							+ ')' : '',
					this.convert_to_language ? ' ('
							+ library_namespace.gettext.to_standard(
							//
							this.convert_to_language) + ')' : '', '.',
					typeof work_data.directory_id === 'function'
					// 自行指定作品放置目录与 ebook 用的 work id。
					&& work_data.directory_id() || work_data.id, '.epub' ];

			file_name = file_name.join('');
		}
		file_name = library_namespace.to_file_name(file_name);
		// assert: PATTERN_ebook_file.test(file_name) === true

		// console.trace('ebook_path: file_name: ' + file_name);
		return [ work_data.ebook_directory || this.main_directory, file_name ];
	}

	function pack_ebook(work_data, file_name) {
		// remove_old_ebooks.call(this);

		var ebook = work_data && work_data[this.KEY_EBOOK];
		if (!ebook) {
			return;
		}

		ebook.working_promise = ebook.working_promise.then(pack_up_ebook.bind(
				this, work_data, file_name));

		if (this.convert_to_language) {
			ebook.working_promise = ebook.working_promise
					.then(archive_convert_cache_directory.bind(this, work_data));
		}

		ebook.working_promise = ebook.working_promise.then(
		//
		library_namespace.null_function, function(error) {
			library_namespace.error(error);
			// re-throw
			throw error;
		});

		return ebook.working_promise;
	}

	function pack_up_ebook(work_data, file_name) {
		var file_path = ebook_path.call(this, work_data, file_name);

		this.clear_converted_text_cache(true);
		var cecc = this.convert_text_language_using
				&& this.convert_text_language_using.cecc;
		// console.trace(cecc);
		if (cecc && cecc.report_text_to_check) {
			cecc.report_text_to_check({
				convert_to_language : this.convert_to_language
			});
		}

		// gettext_config:{"id":"archive-epub-ebook-$1"}
		process.title = gettext('打包 epub 电子书：%1', work_data.title) + ' @ '
				+ this.id;
		// https://github.com/ObjSal/p7zip/blob/master/GUI/Lang/ja.txt
		library_namespace.debug({
			// gettext_config:{"id":"archive-epub-ebook-$1"}
			T : [ '打包 epub 电子书：%1', file_path[1] ]
		}, 1, 'pack_ebook');

		var ebook = work_data && work_data[this.KEY_EBOOK];

		// this: this_work_crawler
		ebook.pack(file_path, this.remove_ebook_directory, remove_old_ebooks
				.bind(this, work_data.id));
		// 等待打包...
	}

	// --------------------------------------------------------------------------------------------

	// export 导出.

	// @inner
	Object.assign(crawler_namespace, {
		set_last_update_Date : set_last_update_Date,
		create_ebook : create_ebook
	});

	// @instance
	Object.assign(Work_crawler.prototype, {
		// for CeL.application.storage.EPUB
		// auto_create_ebook, automatic create ebook
		// MUST includes CeL.application.locale!
		// need_create_ebook : true,
		KEY_EBOOK : 'ebook',
		milestone_extension : true,
		add_ebook_chapter : add_ebook_chapter,
		pack_ebook : pack_ebook,
		/** 在包装完电子书之后，把电子书目录整个删掉。 请注意：必须先安装 7-Zip **18.01 以上的版本**。 */
		remove_ebook_directory : true,
		/** 章节数量无变化时，依旧利用 cache 重建资料(如ebook)。 */
		// regenerate : true,
		/** 进一步处理书籍之章节内容。例如繁简转换、错别字修正、裁剪广告。 */
		contents_post_processor : function(contents, work_data) {
			return contents;
		} && null,
		// 话: 日文
		// 「卷」为漫画单行本，「话」为杂志上的连载，「卷」包含了以往杂志上所有发行的「话」
		chapter_unit : '话',
		parse_ebook_name : parse_ebook_name,

		// 在获取小说章节内容的时候，若发现有章节被目录漏掉，则将之补上。
		check_next_chapter : check_next_chapter
	});

	// 不设定(hook)本 module 之 namespace，仅执行 module code。
	return library_namespace.env.not_to_extend_keyword;
}
