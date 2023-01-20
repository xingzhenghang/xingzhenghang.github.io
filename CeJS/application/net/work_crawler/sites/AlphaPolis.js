/**
 * @name CeL module for downloading AlphaPolis user novels / comics.
 * 
 * @fileoverview 本档案包含了解析并处理、批量下载 アルファポリス - 电网浮游都市 - 小说 / 漫画 的工具。
 * 
 * <code>

 CeL.AlphaPolis({
 // configuration
 site : '' || CeL.get_script_name()
 }).start(work_id);

 </code>
 * 
 * @since 2020/7/18 5:31:55 模组化。
 */

// More examples:
// @see
// https://github.com/kanasimi/work_crawler/blob/master/novel.ja-JP/AlphaPolis.js
// https://github.com/kanasimi/work_crawler/blob/master/comic.ja-JP/AlphaPolis_user_manga.js
// https://github.com/kanasimi/work_crawler/blob/master/comic.ja-JP/AlphaPolis_official_manga.js
'use strict';

// --------------------------------------------------------------------------------------------

// 不采用 if 陈述式，可以避免 Eclipse JSDoc 与 format 多缩排一层。
typeof CeL === 'function' && CeL.run({
	// module name
	name : 'application.net.work_crawler.sites.AlphaPolis',

	require : 'application.net.work_crawler.',

	// 设定不汇出的子函式。
	no_extend : '*',

	// 为了方便格式化程式码，因此将 module 函式主体另外抽出。
	code : module_code
});

function module_code(library_namespace) {

	// requiring

	// --------------------------------------------------------------------------------------------

	var default_configuration = {

		// 当网站不允许太过频繁的访问/access时，可以设定下载之前的等待时间(ms)。
		// 模仿实际人工请求。
		// chapter_time_interval : '5s',

		base_URL : 'https://www.alphapolis.co.jp/',

		// @deprecated: novel
		// till 20170619, use POST. 20170620 AlphaPolis 改版, use UTF-8.
		search_URL_2016_to_20170619 : function(work_title) {
			return [ 'top/search/', {
				// 2: 小说
				'data[tab]' : 2,
				'data[refer]' : work_title
			} ];
		},

		// 解析 作品名称 → 作品id get_work()
		search_URL : function(work_title) {
			return 'search?category='
					+ this.work_type.split('/').reverse().join('_') + '&query='
					+ encodeURIComponent(work_title.replace(/\s+\d+$/, ''));
		},
		// for AlphaPolis_user_manga.js , AlphaPolis_official_manga.js
		parse_search_result : function(html, get_label) {
			// console.log(html);
			var _this = this, id_data = [],
			// {Array}id_list = [id,id,...]
			id_list = [];
			html.each_between(' class="title">', '</a>', function(text) {
				// console.log(text);
				var id = text.between(' href="/' + _this.work_type + '/', '"');
				if (id) {
					id_list.push(id.replace(/\//, '-'));
					id_data.push(get_label(text.between('>')));
				}
			});
			// console.log([ id_list, id_data ]);
			return [ id_list, id_data ];
		},

		// 取得作品的章节资料。 get_work_data()
		work_URL : function(work_id) {
			return this.work_type + '/' + work_id.replace('-', '/');
		},
		// for AlphaPolis.js , AlphaPolis_user_manga.js
		parse_work_data : function(html, get_label, extract_work_data) {
			var work_data = {
				// 必要属性：须配合网站平台更改。
				// 2019/8/16 19:0 改版。
				title : get_label(html.between('<h1 class="title">', '</h1>')
						|| html.between('<h2 class="title">', '</h1>')),

				// 选择性属性：须配合网站平台更改。
				// e.g., 连载中, 连载中
				status : [],
				// get the first <div class="author">...</div>
				author : get_label(html.between('<div class="author">', '</a>')),
				last_update : get_label(html.between('<th>更新日时</th>', '</td>')),
				description : get_label(
						html.between('<div class="abstract">', '</div>'))
						.replace(/\n{2}/g, '\n'),
				ranking : get_label(html.between('<div class="ranking">',
				// also category
				'</div>')).replace(/\t/g, '').replace(/\n{3}/g, '\0').replace(
						/\n/g, ' ').split('\0'),
				// site_name : 'アルファポリス'
				language : html.between('data-lang="', '"') || 'ja-JP'

			}, PATTERN, matched;

			if (work_data.title === 'Not Found' && !work_data.author) {
				// 对于已经失效的作品，直接中断下载。
				throw work_data.title;
			}

			if (work_data.site_name) {
				// "アルファポリス - 电网浮游都市 - " → "アルファポリス"
				work_data.site_name = work_data.site_name.replace(/ +- .+/, '');
			}

			// 2019/1 才发现改 pattern 了。
			PATTERN = /<span class="tag">([\s\S]+?)<\/span>/g;
			while (matched = PATTERN.exec(html.between(
					'<div class="content-tags">', '</div>'))) {
				work_data.status.push(get_label(matched[1]));
			}

			html.between('<div class="content-statuses">', '</div>')
			// additional tags
			.each_between(' class="content-status', '<',
			//
			function(text) {
				work_data.status.push(get_label(text.between('>')));
			});
			work_data.status = work_data.status.unique();

			// <h2>作品の情报</h2>
			extract_work_data(work_data, html,
					/<th>([\s\S]+?)<\/th>[\s\n]*<td[^<>]*>([\s\S]+?)<\/td>/g);

			extract_work_data(work_data, html);

			if (work_data.image
			// ignore site default image
			&& work_data.image.endsWith('\/ogp.png')) {
				delete work_data.image;
			}

			// console.log(work_data);
			return work_data;
		},
		// for AlphaPolis.js , AlphaPolis_user_manga.js
		get_chapter_list : function(work_data, html) {
			work_data.chapter_list = [];
			var _this = this;
			html = html.between('<div class="nav">', '<div class="freespace">')
			//
			.each_between('<a href="/'
			//
			+ _this.work_type + '/', '</a>', function(text) {
				work_data.chapter_list.push({
					url : '/' + _this.work_type + '/'
					//
					+ text.between(null, '"'),
					date : text.between('<span class="open-date">', '</span>')
					//
					.to_Date({
						zone : work_data.time_zone
					}),
					title : text.between(' class="title">',
					// '<span class="title"><span
					// class="bookmark-dummy"></span>',
					// '</span>'
					'<span class="open-date">')
				});
			});
		},

		// for AlphaPolis_user_manga.js , AlphaPolis_official_manga.js
		parse_chapter_data : function(html, work_data, get_label, chapter_NO) {
			// console.log(html);
			var chapter_data = work_data.chapter_list[chapter_NO - 1];
			Object.assign(chapter_data, {
				// 设定必要的属性。
				title : get_label(html.between('<h2>', '</h2>')),
				image_list : []
			});

			html.each_between('_pages.push("', '"', function(url) {
				if (url.includes('://'))
					chapter_data.image_list.push(url);
			});

			return chapter_data;
		}
	};

	// --------------------------------------------------------------------------------------------

	function new_AlphaPolis_crawler(configuration, callback, initializer) {
		// library_namespace.set_debug(9);
		configuration = configuration ? Object.assign(Object.create(null),
				default_configuration, configuration) : default_configuration;

		if (configuration.need_create_ebook) {
			library_namespace.run([ 'application.storage.EPUB'
			// CeL.detect_HTML_language()
			, 'application.locale' ]);
		}

		// 每次呼叫皆创建一个新的实体。
		var crawler = new library_namespace.work_crawler(configuration);

		// for 年齢确认 eternityConfirm()
		crawler.setup_value('cookie', [ 'confirm='
				+ Math.floor(Date.now() / 1000)
				// location.hostname
				+ ';domain=' + crawler.base_URL.match(/\/\/([^\/]+)/)[1]
				+ ';path=/;' ]);

		return crawler;
	}

	return new_AlphaPolis_crawler;
}
