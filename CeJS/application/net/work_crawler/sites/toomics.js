﻿/**
 * @name CeL module for downloading Toomics comics.
 * 
 * @fileoverview 本档案包含了解析并处理、批量下载 Toomics 韩国漫画 之 **非韩语版**(外语版本) 的工具。
 * 
 * <code>

 CeL.toomics(configuration).start(work_id);

 </code>
 * 
 * @since 2019/7/12 20:21:25 模组化。
 */

// More examples:
// @see
// https://github.com/kanasimi/work_crawler/blob/master/comic.cmn-Hans-CN/toomics_sc.js
'use strict';

// --------------------------------------------------------------------------------------------

// 不采用 if 陈述式，可以避免 Eclipse JSDoc 与 format 多缩排一层。
typeof CeL === 'function' && CeL.run({
	// module name
	name : 'application.net.work_crawler.sites.toomics',

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

		// 所有的子档案要修订注解说明时，应该都要顺便更改在CeL.application.net.comic中Comic_site.prototype内的母comments，并以其为主体。

		// {Natural}MIN_LENGTH:最小容许图案档案大小 (bytes)。
		// 对于有些图片只有一条细横杆的情况。
		MIN_LENGTH : 200,

		// 图像档案下载失败处理方式：忽略/跳过图像错误。当404图像不存在、档案过小，或是被侦测出非图像(如不具有EOI)时，依旧强制储存档案。default:false
		// skip_error : true,

		// one_by_one : true,
		base_URL : 'https://toomics.com/',

		// LANG_PREFIX : '',

		// 解析 作品名称 → 作品id get_work()
		search_URL : function(work_title) {
			return [ this.LANG_PREFIX + '/webtoon/ajax_search', {
				toonData : work_title,
				offset : 0,
				limit : 20
			} ];
		},
		parse_search_result : function(html, get_label) {
			html = html.between('<ul>', '</ul>');
			// console.log(html);

			function parser(token) {
				// console.log(token);
				return [ +token.match(/toon=(\d+)&/)[1],
				/**
				 * <code>

				<a href="/sc/webtoon/search/?toon=4866&return=%2Fsc%2Fwebtoon%2Fepisode%2Ftoon%2F4866">
				<div class="search_box">
				<p class="img"><img src="https://thumb-g.toomics.com/upload/thumbnail/20180629102024/2019_03_15_15526329389053.jpg" alt="郑主任为何这样"></p>

				</code>
				 */
				token.between('alt="', '"') ];
			}

			return library_namespace.work_crawler
					.extract_work_id_from_search_result_link(
							/<li(?:[^<>]*)>([\s\S]+?)<\/li>/g, html, parser);
		},

		// 取得作品的章节资料。 get_work_data()
		work_URL : '/webtoon/episode/toon/',
		parse_work_data : function(html, get_label, extract_work_data) {
			// console.log(html);
			var text = html.between('<header class="ep-cover_ch"', '</header>');
			var work_data = {
				// 必要属性：须配合网站平台更改。
				title : get_label(text.between('<h1>', '</h1>')),
				author : get_label(text.between(
				/**
				 * <code>

				<span class="writer">李玄敏 <span class="text-muted">|</span> Miyune</span>
				</p>

				</code>
				 */
				'<span class="writer">', '</p>')).replace(/ +\|/g, ','),

				// 选择性属性：须配合网站平台更改。
				description : get_label(text.between('<h2>', '</h2>')),
				genre : get_label(
						text.between('<span class="type">', '</span>'))
						.replace(/\s{2,}/g, ' '),
				// e.g., Updated every Friday
				update_weekday : text.between('<span class="date">', '</span>')
			};

			extract_work_data(work_data, html);

			// console.log(work_data);
			return work_data;
		},
		get_chapter_list : function(work_data, html, get_label) {
			html = html.between('<ol class="list-ep">', '</ol>');

			var matched, PATTERN_chapter =
			//
			/<li><a href="([^<>"]+)"[^<>]*>([\s\S]+?)<\/li>/g;

			work_data.chapter_list = [];
			/**
			 * <code>

			<a href="javascript:;" onclick="Webtoon.chkec(this);location.href='/en/webtoon/detail/code/97236/ep/0/toon/4630'" onkeypress="this.onclick"
			data-e="NDYzMA==" data-c="OTcyMzY="
			data-v="">

			</code>
			 */
			html.each_between('<li', '</li>', function(token) {
				var url = token.between("location.href='", "'");
				if (!url) {
					// limited
					return;
				}
				work_data.chapter_list.push({
					title : get_label(token.between('<div class="cell-num">',
							'</div>')),
					date : token.between('datetime="', '"'),
					type : token
							.between('<span class="coin-type1">', '</span>'),
					thumb : token.between('data-original="', '"'),
					rating : token.between('<span class="star-stat">',
							'</span>'),
					url : url
				});
			});
			// console.log(work_data.chapter_list);
		},

		pre_parse_chapter_data
		// 执行在解析章节资料 process_chapter_data() 之前的作业 (async)。
		// 必须自行保证执行 callback()，不丢出异常、中断。
		: function(XMLHttp, work_data, callback, chapter_NO) {
			if (this.verificated) {
				callback()
				return;
			}

			this.get_URL(this.LANG_PREFIX
			// https://toomics.com/tc/age_verification
			// 年龄认证 如需关闭安全模式，请确认您已年满18岁。
			+ '/age_verification', function(XMLHttp) {
				// console.log(XMLHttp);
				this.get_URL(this.LANG_PREFIX
				// https://toomics.com/sc/index/set_display/?display=A&return=/sc/webtoon/detail/code/55556/ep/1/toon/2509
				+ '/index/set_display/?display=A&return=/' + this.LANG_PREFIX
						+ '/help/notice_list', function(XMLHttp) {
					// console.log(XMLHttp);
					// console.log(this.get_URL_options);
					this.verificated = true;
					callback();
				});
			});

		},

		parse_chapter_data : function(html, work_data, get_label, chapter_NO) {
			var chapter_data = work_data.chapter_list[chapter_NO - 1];
			// console.log(chapter_data);
			// console.log(html);

			Object.assign(chapter_data, {
				title : html.between('<div class="viewer-title">', '</div>')
				/**
				 * <code>

				<div class="viewer-title">
				<a href="/en/webtoon/episode/toon/4630" title="List">Too Pretty<em>Episode 1</em></a>
				</div>

				</code>
				 */
				.between('<em>', '</em>'),
				image_list : html
				// 2019: '<main class="viewer-body">'
				// 2020/8: '<main class="viewer-body viewer-body-scroll">'
				.between('<main class="viewer-body', '</main>')
				// 2019: .all_between('data-original="', '"')
				// 2020/8: .all_between('data-src="', '"')
				.all_between('data-src="', '"')
			});

			if (chapter_data.image_list.length === 0) {
				// 改版?
				// console.trace(html);
			}

			// console.log(chapter_data);
			return chapter_data;
		}

	};

	// --------------------------------------------------------------------------------------------

	function new_toomics_comics_crawler(configuration) {
		configuration = Object.assign(Object.create(null),
		//
		default_configuration, {
			work_URL : configuration.LANG_PREFIX
					+ default_configuration.work_URL
		}, configuration);

		// 每次呼叫皆创建一个新的实体。
		var crawler = new library_namespace.work_crawler(configuration);

		return crawler;
	}

	return new_toomics_comics_crawler;
}
