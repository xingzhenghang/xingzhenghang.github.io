/**
 * @name CeL module for downloading jieqi article novels.
 * 
 * @fileoverview 本档案包含了解析并处理、批量下载中国大陆常见小说管理系统: 杰奇小说连载系统 的工具。
 * 
 * <code>

 CeL.jieqi_article(configuration).start(work_id);

 </code>
 * 
 * @see http://www.jieqi.com/files/page/html/product/article.html 杰奇网络 杰奇小说连载系统
 *      （2004-2015?，新版为杰奇原创文学系统）
 * 
 * @since 2019/2/20 16:58:20 模组化。
 */

// More examples:
// @see https://github.com/kanasimi/work_crawler/blob/master/81xsw.js
// @see https://github.com/kanasimi/work_crawler/blob/master/23us.js
'use strict';

// --------------------------------------------------------------------------------------------

// 不采用 if 陈述式，可以避免 Eclipse JSDoc 与 format 多缩排一层。
typeof CeL === 'function' && CeL.run({
	// module name
	name : 'application.net.work_crawler.sites.jieqi_article',

	require : 'application.net.work_crawler.'
	//
	+ '|application.storage.EPUB.',

	// 设定不汇出的子函式。
	no_extend : '*',

	// 为了方便格式化程式码，因此将 module 函式主体另外抽出。
	code : module_code
});

function module_code(library_namespace) {

	// requiring

	// --------------------------------------------------------------------------------------------

	var default_configuration = {

		// auto_create_ebook, automatic create ebook
		// MUST includes CeL.application.locale!
		need_create_ebook : true,
		// recheck:从头检测所有作品之所有章节与所有图片。不会重新撷取图片。对漫画应该仅在偶尔需要从头检查时开启此选项。default:false
		// recheck='changed': 若是已变更，例如有新的章节，则重新下载/检查所有章节内容。否则只会自上次下载过的章节接续下载。
		recheck : 'changed',

		// base_URL : '',
		charset : 'gbk',

		// 解析 作品名称 → 作品id get_work()
		search_URL : function(work_title) {
			return [ 'modules/article/search.php', {
				searchtype : 'articlename',
				searchkey : work_title
			} ];
		},
		parse_search_result : function(html, get_label) {
			// console.log(html);
			var id_list = [], id_data = [];
			var matched = html.match(/og:novel:book_name" content="([^<>"]+)"/);

			if (matched) {
				// 直接进入作品资讯页面。
				id_data.push(get_label(matched[1]));
				matched = html
				// e.g., <meta property="og:novel:read_url"
				// content="https://www.zhuishubang.com/120382/"/>
				.match(/og:novel:read_url" content="[^<>"]*?\/(\d+)\/"/);
				id_list.push(+matched[1]);

			} else {
				html.between('<div id="content">', '</table>')
				//
				.between('<table').each_between('<tr>', '</tr>',
				//
				function(text) {
					var matched = text
					// <td class="odd"><a
					// href="https://www.kanshushenzhan.com/132800/">万古剑神</a></td>
					.match(/ href="[^<>"]+\/(\d+)\/">(.+?)<\/a>/);
					id_list.push(+matched[1]);
					id_data.push(get_label(matched[2]));
				});
			}

			return [ id_list, id_data ];
		},

		// 取得作品的章节资料。 get_work_data()
		work_URL : function(work_id) {
			return work_id + '/';
		},
		parse_work_data : function(html, get_label, extract_work_data) {
			var work_data = {
				// 必要属性：须配合网站平台更改。

				// 选择性属性：须配合网站平台更改。
				// <div class="routeLeft"><a href="/">看书神站</a> > <a
				// href="/all/">书库</a>
				site_name : get_label(html.between('<div class="routeLeft">',
						'</a>'))
			};
			// overwrite .description
			extract_work_data(work_data, html, null, true);
			extract_work_data(work_data, html.between('<div class="bookPhr">',
					'<div class="renew">'), /<dd>([^：]+)(.+)<\/dd>/g);

			var matched = html.between('<div class="renew">', '</div>').match(
			// <div class="renew">最新章节：<a href="/111269/40729086.html">第535章
			// 大结局</a><span>2018-08-01</span></div>
			/<a href="([^<>"]+)">(.+?)<\/a>(?:<span>([^<>]+?)<\/span>)?/);
			Object.assign(work_data, {
				latest_chapter : work_data.latest_chapter_name,
				latest_chapter_url : matched[1],
				last_update : work_data.update_time || matched[3]
			});

			// console.log(work_data);
			return work_data;
		},
		get_chapter_list : function(work_data, html, get_label) {
			work_data.chapter_list = [];

			html = html.between('<div class="chapterCon">', '</ul>');

			var matched,
			// <li><a href="/111269/40724950.html">第1章 甩你一脸</a></li>
			PATTERN_chapter = /<a href="([^"<>]+)">([^<>]+)<\/a>/g;

			while (matched = PATTERN_chapter.exec(html)) {
				// console.log(matched);
				var chapter_data = {
					url : matched[1],
					title : get_label(matched[2])
				};
				work_data.chapter_list.push(chapter_data);
			}

			if (this.inverted_order)
				work_data.chapter_list.reverse();
			// console.log(work_data);
		},
		// inverted_order : true,

		// 取得每一个章节的内容与各个影像资料。 get_chapter_data()
		parse_chapter_data : function(html, work_data, get_label, chapter_NO) {
			// 在取得小说章节内容的时候，若发现有章节被目录漏掉，则将之补上。
			this.check_next_chapter(work_data, chapter_NO, html);

			// var chapter_data = work_data.chapter_list[chapter_NO - 1];

			var sub_title = work_data.previous_sub_title
					|| get_label(html.between('<h2>', '</h1>')),
			// e.g., https://www.huaxiangju.com/25087/6323179.html
			text = html.between('<div class="articleCon">');
			text = text.between(null, '<div class="page">')
					|| html.between(null, '</div>');
			text = text.between('<p>', {
				tail : '</p>'
			});

			if (false && !html.includes('<div class="articleCon">')) {
				// console.log(html);
				console.log(html.between('<div class="articleCon">', '</div>'));
				console.log(text);
			}

			if (this.remove_ads) {
				text = this.remove_ads(text);
			}
			// console.log(text);

			this.add_ebook_chapter(work_data, chapter_NO, {
				sub_title : sub_title,
				text : text
			});
		}

	};

	// --------------------------------------------------------------------------------------------

	function new_jieqi_article_novels_crawler(configuration) {
		configuration = configuration ? Object.assign(Object.create(null),
				default_configuration, configuration) : default_configuration;

		// 每次呼叫皆创建一个新的实体。
		return new library_namespace.work_crawler(configuration);
	}

	return new_jieqi_article_novels_crawler;
}
