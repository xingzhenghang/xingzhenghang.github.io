/**
 * @name CeL module for downloading hhcool comics.
 * 
 * @fileoverview 本档案包含了解析并处理、批量下载 汗汗酷漫 漫画 的工具。
 * 
 * <code>

CeL.hhcool(configuration, function(crawler) {
	start_crawler(crawler, typeof module === 'object' && module);
}, function(crawler) {
	setup_crawler(crawler, typeof module === 'object' && module);
});

 </code>
 * 
 * using zh-cmn-Hant-CN .aspx
 * 
 * TODO: http://coco.hhxxee.com/ http://99.hhxxee.com/ http://99770.hhxxee.com/
 * 
 * @since 2019/4/25 5:6:7 模组化。
 */

// More examples:
// @see
// https://github.com/kanasimi/work_crawler/blob/master/comic.cmn-Hans-CN/hhcool.js
'use strict';

// --------------------------------------------------------------------------------------------

// 不采用 if 陈述式，可以避免 Eclipse JSDoc 与 format 多缩排一层。
typeof CeL === 'function' && CeL.run({
	// module name
	name : 'application.net.work_crawler.sites.hhcool',

	require : 'application.net.work_crawler.',

	// 设定不汇出的子函式。
	no_extend : '*',

	// 为了方便格式化程式码，因此将 module 函式主体另外抽出。
	code : module_code
});

function module_code(library_namespace) {

	// requiring

	// --------------------------------------------------------------------------------------------

	/**
	 * e.g., <code>

	// 汗汗酷漫
	<li><a title='野生的最终BOSS出现了' href='/manhua/32449.html'><img src='http://img.94201314.net/comicui/32449.JPG'><br>野生的最终BOSS出现了</a></li>

	// 动漫伊甸园
	<li><a title='树莺吟' target=_blank href='/comicinfo/37621.html'><img src='http://img.94201314.net/comicui/37621.JPG'><br>树莺吟</a></li>

	</code>
	 */
	var PATTERN_search = /<li><a title='([^<>'"]+)'[^<>]*? href='\/[^\/]+\/(\d+).html'>.+?<\/li>/g;

	/**
	 * e.g., <code>
	 <div class='cVolTag'>周刊杂志每周每月连载单集</div><ul class='cVolUl'><li>...</a></li></ul>
	 <div class='cVolTag'>漫画正片外的剧情之番外篇</div><ul class='cVolUl'><li>...</a></li></ul>

	 <li><a class='l_s' href='/cool282192/1.html?s=7' target='_blank' title='双星之阴阳师09卷'>双星之阴阳师09卷</a></li>
	 </code>
	 */
	// matched: [all, part_title, url, title, inner]
	var PATTERN_chapter = /<div class='cVolTag'>([^<>]+)|<li><a [^<>]*?href='([^'<>]+)'[^<>]*? title='([^'<>]+)'[^<>]*>(.+?)<\/a>/g;

	var PATTERN_image = /<img (?:.*?) name="([^<>"]+)" (?:.*?)hdNextImg" value="([^<>"]+)"/;

	var default_configuration = {

		// 所有的子档案要修订注解说明时，应该都要顺便更改在CeL.application.net.comic中Comic_site.prototype内的母comments，并以其为主体。

		// 本站常常无法取得图片，因此得多重新检查。
		// 当有多个分部的时候才重新检查。
		recheck : 'multi_parts_changed',
		// 当无法取得chapter资料时，直接尝试下一章节。在手动+监视下recheck时可并用此项。
		// skip_chapter_data_error : true,

		// 当图像不存在 EOI (end of image) 标记，或是被侦测出非图像时，依旧强制储存档案。
		// allow image without EOI (end of image) mark. default:false
		allow_EOI_error : true,
		// 当图像档案过小，或是被侦测出非图像(如不具有EOI)时，依旧强制储存档案。
		// skip_error : true,

		// 最小容许图案档案大小 (bytes)。
		// 对于极少出现错误的网站，可以设定一个比较小的数值，并且设定.allow_EOI_error=false。因为这类型的网站要不是无法取得档案，要不就是能够取得完整的档案；要取得破损档案，并且已通过EOI测试的机会比较少。
		// 对于有些图片只有一条细横杆的情况。
		MIN_LENGTH : 400,

		// one_by_one : true,

		// base_URL : '',

		// /manhua/
		base_comic_path : 'manhua',

		// 解析 作品名称 → 作品id get_work()
		search_URL : 'comic/?act=search&st=',
		parse_search_result : function(html) {
			html = html.between('<div class="cComicList">', '</div>');
			var id_list = [], id_data = [], matched;
			while (matched = PATTERN_search.exec(html)) {
				id_list.push(+matched[2]);
				id_data.push(matched[1]);
			}
			return [ id_list, id_data ];
		},

		// 取得作品的章节资料。 get_work_data()
		work_URL : function(work_id) {
			// e.g., http://www.hhcool.com/manhua/32449.html
			return this.base_comic_path + '/' + work_id + '.html';
		},
		parse_work_data : function(html, get_label, extract_work_data) {
			html = html.between('<div id="about_kit">',
					'<div class="cVolList">');
			html = html.between(null, '<div class="cInfoAct">') || html;

			var work_data = {
				// 必要属性：须配合网站平台更改。
				title : get_label(html.between('<h1>', '</h1>'))

			// 选择性属性：须配合网站平台更改。
			// <meta property="og:novel:status" content="已完结"/>
			};
			extract_work_data(work_data, html, /<li>([^:]+)(.+?)<\/li>/g);
			work_data.status = work_data.状态;
			work_data.last_update = work_data.更新;
			return work_data;
		},
		get_chapter_list : function(work_data, html, get_label) {
			html = html.between('<div class="cVolList">', '<div id="foot">');

			work_data.chapter_list = [];
			// 漫画目录名称不须包含分部号码。使章节目录名称不包含 part_NO。
			// 将会在 function get_chapter_directory_name() 自动设定。
			// work_data.chapter_list.add_part_NO = false;

			// 转成由旧至新之顺序。
			work_data.inverted_order = true;

			var matched;
			while (matched = PATTERN_chapter.exec(html)) {
				// delete matched.input;
				// console.log(matched);
				if (matched[1]) {
					this.set_part(work_data, get_label(matched[1]));
					continue;
				}

				this.add_chapter(work_data, {
					title : get_label(matched[3].replace(work_data.title, '')),
					url : matched[2]
				});
			}

			// console.log(work_data.chapter_list);
		},

		pre_parse_chapter_data
		// 执行在解析章节资料 process_chapter_data() 之前的作业 (async)。
		// 必须自行保证执行 callback()，不丢出异常、中断。
		: function(XMLHttp, work_data, callback, chapter_NO) {
			var html = XMLHttp.responseText;

			var chapter_list = [], URL = XMLHttp.responseURL,
			// 每一张图片都得要从载入的页面获得资讯。
			matched, PATTERN = /csel2\((\d{1,3})\)/g;

			while (matched = PATTERN.exec(html)) {
				chapter_list.push(matched[1]);
			}

			work_data.cache_directory = work_data.directory
					+ this.cache_directory_name;
			library_namespace.create_directory(work_data.cache_directory);
			if (!work_data.image_list) {
				// image_list[chapter_NO] = [url, url, ...]
				work_data.image_list = [];
			}
			var _this = this,
			//
			this_image_list = work_data.image_list[chapter_NO] = [];

			function for_each_chapter(run_next, NO, index) {
				var url = URL.replace(/\/\d{1,3}\.html/, '/' + NO + '.html'),
				//
				save_to = work_data.cache_directory
						+ chapter_NO.pad(work_data.chapter_NO_pad_digits || 3)
						+ '-' + NO.pad(work_data.chapter_NO_pad_digits || 3)
						+ '.html';

				function for_each_image_page(html, error) {
					if (error) {
						library_namespace.error({
							// gettext_config:{"id":"an-error-occurred-while-downloading-and-the-file-contents-could-not-be-obtained-smoothly"}
							T : '下载时发生错误，无法顺利取得档案内容！'
						});
						library_namespace.error(error);
						_this.onerror(error);
						return;
					}

					var image_data = html.match(PATTERN_image);

					// decode chapter image url data
					image_data = [ unsuan(image_data[1]), unsuan(image_data[2]) ];

					if (image_data[0] !== '\x00') {
						if (!this_image_list[index]) {
							this_image_list[index] = image_data[0];
						} else if (this_image_list[index] !== image_data[0]) {
							_this.onerror([ {
								// gettext_config:{"id":"different-url-$1-≠-$2"}
								T : [ 'Different url: %1 ≠ %2',
								//
								this_image_list[index], image_data[0] ]
							}, '\n', {
								// gettext_config:{"id":"maybe-the-downloaded-file-has-an-error?-you-can-try-to-download-it-later-or-use-the-.recheck-option-to-ignore-the-cache-and-re-download-the-page-for-each-image"}
								T : '或许是下载的档案出现错误？您可尝试过段时间再下载，或选用 .recheck 选项来忽略快取、重新下载每个图片的页面。'
							} ]);
							run_next();
							return;
						}
					}
					if (image_data[1] !== '\x00') {
						this_image_list[index + 1] = image_data[1];
					}
					// console.log([ index, image_data ])

					run_next();
				}

				// 没 cache 的话，每一次都要重新取得每个图片的页面，速度比较慢。
				library_namespace.get_URL_cache(url, for_each_image_page, {
					get_URL_options : _this.get_URL_options,
					no_write_info : true,
					file_name : save_to,
					reget : _this.recheck
				});
			}

			chapter_list.run_serial(for_each_chapter, callback);
		},

		parse_chapter_data : function(html, work_data, get_label, chapter_NO) {
			var PATTERN = / id="hdDomain"(?:.*?) value="([^<>"]+)"/,
			// 不同作品放在不同的location。
			matched = html.match(PATTERN);
			this.server_list = matched[1].split('|');

			var chapter_data = work_data.chapter_list[chapter_NO - 1];

			// console.log(work_data.image_list[chapter_NO]);
			chapter_data.image_list = work_data.image_list[chapter_NO]
					.map(function(url) {
						return encodeURI(library_namespace.HTML_to_Unicode(url));
					});

			return chapter_data;
		}

	};

	function unsuan(s) {
		var x = s.substring(s.length - 1);
		var w = "abcdefghijklmnopqrstuvwxyz";
		var xi = w.indexOf(x) + 1;
		var sk = s.substring(s.length - xi - 12, s.length - xi - 1);
		s = s.substring(0, s.length - xi - 12);
		var k = sk.substring(0, sk.length - 1);
		var f = sk.substring(sk.length - 1);
		for (var i = 0; i < k.length; i++) {
			eval("s=s.replace(/" + k.substring(i, i + 1) + "/g,'" + i + "')");
		}
		var ss = s.split(f);
		s = "";
		for (i = 0; i < ss.length; i++) {
			s += String.fromCharCode(ss[i]);
		}
		return s;
	}

	// --------------------------------------------------------------------------------------------

	function new_hhcool_comics_crawler(configuration, callback, initializer) {
		configuration = configuration ? Object.assign(Object.create(null),
				default_configuration, configuration) : default_configuration;

		// 每次呼叫皆创建一个新的实体。
		var crawler = new library_namespace.work_crawler(configuration);
		if (typeof initializer === 'function') {
			initializer(crawler);
		}

		var decode_filename = 'script/view.js', unsuan;
		library_namespace.get_URL_cache(crawler.base_URL + decode_filename,
		//
		function(contents, error) {
			if (false) {
				eval('unsuan=function'
						+ contents.between('function unsuan', '\nvar'));
			}
			callback(crawler);
		}, crawler.main_directory + decode_filename.match(/[^\\\/]+$/)[0]);

	}

	return new_hhcool_comics_crawler;
}
