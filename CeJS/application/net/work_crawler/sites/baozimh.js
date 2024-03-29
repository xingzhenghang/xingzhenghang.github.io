﻿/**
 * @name CeL module for downloading baozimh comics.
 * 
 * @fileoverview 本档案包含了解析并处理、批量下载 包子漫画 的工具。
 * 
 * <code>

CeL.baozimh({
	// configuration
	site : '' || CeL.get_script_name()
}).start(work_id);

 </code>
 * 
 * @since 2022/11/3 5:55:24
 * @since 2022/11/3 5:55:24 模组化。
 */

// More examples:
// @see
// https://github.com/kanasimi/work_crawler/blob/master/comic.cmn-Hant-TW/baozimh.js
'use strict';

// --------------------------------------------------------------------------------------------

// 不采用 if 陈述式，可以避免 Eclipse JSDoc 与 format 多缩排一层。
typeof CeL === 'function' && CeL.run({
	// module name
	name : 'application.net.work_crawler.sites.baozimh',

	require : 'application.net.work_crawler.',

	// 设定不汇出的子函式。
	no_extend : '*',

	// 为了方便格式化程式码，因此将 module 函式主体另外抽出。
	code : module_code
});

// ----------------------------------------------------------------------------

function module_code(library_namespace) {

	// requiring

	/**
	 * <code>
	 <a href="/user/page_direct?comic_id=yuanlaiwoshixiuxiandalao-luanshijiaren&amp;section_slot=0&amp;chapter_slot=0" rel="noopener" class="comics-chapters__item" data-v-0c0802bc><div style="flex: 1;" data-v-0c0802bc><span data-v-0c0802bc>预告</span></div></a>
	 <code>
	 */
	var PATTERN_chapter_link = /<a [^<>]*?href="([^<>"]+?)" [^<>]* class="comics-chapters__item"[^<>]*>([\s\S]+?)<\/a>/g;

	// --------------------------------------------------------------------------------------------

	var default_configuration = {

		base_URL : 'https://www.baozimh.com/',

		// 最小容许图案档案大小 (bytes)。
		// 对于极少出现错误的网站，可以设定一个比较小的数值，并且设定.allow_EOI_error=false。因为这类型的网站要不是无法取得档案，要不就是能够取得完整的档案；要取得破损档案，并且已通过EOI测试的机会比较少。
		// 对于有些图片只有一条细横杆的情况。
		MIN_LENGTH : 50,
		// e.g., 都是黑丝惹的祸2 0409 第二季 第409话 因为我喜欢他

		// allow .jpg without EOI mark.
		// allow_EOI_error : true,
		// 当图像档案过小，或是被侦测出非图像(如不具有EOI)时，依旧强制储存档案。
		skip_error : true,
		// e.g., woshenshangyoutiaolong-pikapi 我身上有条龙/
		// 0590 第590话 父母过往/woshenshangyoutiaolong-pikapi-590-017.jpg

		// one_by_one : true,

		acceptable_types : 'jpg|webp',

		// 解析 作品名称 → 作品id get_work()
		search_URL : 'search?q=',
		parse_search_result : function(html, get_label) {
			html = html.between('<div class="pure-g classify-items">');
			// console.log(html);
			var id_list = [], id_data = [];
			html.each_between('<a href="/comic/', '</a>', function(text) {
				id_list.push(text.between(null, '"'));
				id_data.push(get_label(text.between('title="', '"')));
			});
			return [ id_list, id_data ];
		},

		// 取得作品的章节资料。 get_work_data()
		work_URL : function(work_id) {
			return 'comic/' + work_id;
		},
		parse_work_data : function(html, get_label, extract_work_data) {
			var work_data = {
				// 必要属性：须配合网站平台更改。
				title : get_label(html.between(
				// <h1 class="comics-detail__title"
				// data-v-6f225890>原来我是修仙大佬</h1>
				'<h1 class="comics-detail__title"', '</h1>').between('>')),
				author : get_label(html.between(
				// <h2 class="comics-detail__author" data-v-6f225890>乱室佳人</h2>
				'<h2 class="comics-detail__author"', '</h2>').between('>')),

				// 选择性属性：须配合网站平台更改。
				tags : html.all_between('<span class="tag"', '</span>')
				//
				.map(function(tag) {
					return get_label(tag.between('>'));
				}),
				last_update : get_label(html.between('最新：').between('<em',
						'</em>').between('>').replace(/\((.+) 更新\)/, '$1')),
				latest_chapter : get_label(html.between('最新：', '</a>')),
				description : get_label(html.between('<p class="comics-detail',
						'</p>').between('>')),
				/**
				 * cover image<code>
				<amp-img alt="原来我是修仙大佬" width="180" height="240" layout="responsive" src="https://static-tw.baozimh.com/cover/yuanlaiwoshixiuxiandalao-luanshijiaren.jpg" data-v-6f225890>
				<code>
				 */
				cover_image : html.between('layout="responsive" src="', '"')
			};

			// 由 meta data 取得作品资讯。
			extract_work_data(work_data, html);

			// console.log(work_data);
			return work_data;
		},
		get_chapter_list : function(work_data, html, get_label) {
			var _this = this;
			// reset chapter list
			work_data.chapter_list = [];
			var part_count = html.all_between('<div class="section-title"',
					'</div>').length;
			var skip_latest_chapters = true;
			html.each_between('<div class="section-title"', null,
			//
			function(text) {
				/**
				 * <code>
				<div class="section-title" data-v-6f225890>章节目录</div>
				<code>
				 */
				var part_title = text.between('>', '</div>');
				// 最新章节 最新章节
				if (/^最新章[节节]$/.test(part_title)
				// 假如只有一个 part，那就必须留下最新章节。 e.g., 妖精种植手册黑白轮回篇
				&& (skip_latest_chapters = part_count > 1)) {
					return;
				}
				_this.set_part(work_data, part_title);
				// console.log(text);
				var matched;
				while (matched = PATTERN_chapter_link.exec(text)) {
					var chapter_data = {
						// reset sub_chapter_list
						sub_chapter_list : null,
						title : get_label(matched[2]),
						// TODO: fix "&amp;"
						url : matched[1].replace(/&amp;/g, '&')
					};
					_this.add_chapter(work_data, chapter_data);
				}
			});

			// console.trace([ part_count, skip_latest_chapters ]);
			if (!skip_latest_chapters) {
				// 最新章节 为倒序。
				// e.g., 妖精种植手册黑白轮回篇
				// https://cn.baozimh.com/comic/yaojingchongzhishouceheibailunhuipian-dazui
				// 我独自升级
				// https://www.baozimh.com/comic/woduzishengji-duburedicestudio_n6ip31
				work_data.inverted_order = true;
			}

			// console.log(work_data.chapter_list);
		},

		pre_parse_chapter_data
		// 执行在解析章节资料 process_chapter_data() 之前的作业 (async)。
		// 必须自行保证执行 callback()，不丢出异常、中断。
		: function(XMLHttp, work_data, callback, chapter_NO) {
			// console.log(XMLHttp);
			// console.log(work_data);

			// 模拟归一化
			// https://www.webmota.com/comic/chapter/wangyouzhijinzhanfashi-samanhua/0_188.html
			// https://cn.webmota.com/comic/chapter/wangyouzhijinzhanfashi-samanhua/0_188.html
			function simulated_normalized_url(url) {
				return url.replace(/\/\/[a-z]+\./, '//www.');
			}

			var chapter_data = work_data.chapter_list[chapter_NO - 1];
			// console.trace(chapter_data);
			if (!chapter_data.sub_chapter_list) {
				// get_chapter_list() 获得的是动态的 url，会转成静态的。
				chapter_data.sub_chapter_list = [ XMLHttp.responseURL ];
			}
			if (chapter_data.static_url) {
				if (simulated_normalized_url(chapter_data.static_url) !== simulated_normalized_url(chapter_data.sub_chapter_list[0])) {
					// console.log(chapter_data);
					library_namespace.warn('§' + chapter_NO + '《'
							+ chapter_data.title
							+ '》: 从上一章的章节内容页面获得的 URL 不同于从章节列表获得的 URL：\n	'
							+ chapter_data.static_url + '\n	'
							+ chapter_data.sub_chapter_list[0]);
				}
				// free
				delete chapter_data.static_url;
			}

			var html = XMLHttp.responseText, matched, next_chapter_url = html;
			// console.log(html);

			/**
			 * <code>

			// 可能有上下两个 `<div class="next_chapter">`，取后一个。
			<div class="chapter-main scroll-mode"><div class="next_chapter"><a href="https://cn.webmota.com/comic/chapter/dubuxiaoyao-zhangyuewenhua/0_35.html#bottom">
			点击进入上一页
			</a></div>

			<div class="next_chapter"><a href="https://www.webmota.com/comic/chapter/shenzhita-siu/0_738_2.html">
			点击进入下一页
			<span class="iconfont icon-xiangxia"></span></a></div>

			<div class="next_chapter"><a href="https://cn.webmota.com/comic/chapter/shenzhita-siu/0_738.html">
			点击进入下一话
			<span class="iconfont icon-xiayibu"></span></a></div>
			<code>
			 */
			while (matched = next_chapter_url.between(' class="next_chapter">'))
				next_chapter_url = matched;
			next_chapter_url = next_chapter_url
			// 去掉网页锚点。
			&& next_chapter_url.between(' href="', '"').replace(/#.*$/, '');
			if (!next_chapter_url
			//
			|| !/^_\d/.test(simulated_normalized_url(next_chapter_url)
			// 确定 url 以本章节 url 开头。
			.between(simulated_normalized_url(
			//
			chapter_data.sub_chapter_list[0]).replace(/\.html$/, '')))) {
				// console.trace('下一话');
				// assert: next_chapter_url 为下一话的静态 url。
				var next_chapter_data = work_data.chapter_list[chapter_NO];
				if (next_chapter_url && next_chapter_data) {
					// 做个记录。
					if (false) {
						console.trace([ chapter_NO, next_chapter_url,
								next_chapter_data ]);
					}
					next_chapter_data.static_url = next_chapter_url;
					// 直接从静态网页获取章节内容，避免采用 CGI。
					if (!next_chapter_data.sub_chapter_list)
						next_chapter_data.sub_chapter_list = [ next_chapter_url ];
				}

				// console.trace(chapter_data);
				callback();
				return;
			}
			// assert: next_chapter_url 为下一页的静态 url。
			// console.trace('下一页');

			// 做个记录。
			chapter_data.sub_chapter_list.push(next_chapter_url);

			// console.trace(next_chapter_url);
			this.get_URL(next_chapter_url, function(XMLHttp, error) {
				if (!chapter_data.next_chapter_HTMLs)
					chapter_data.next_chapter_HTMLs = [];
				chapter_data.next_chapter_HTMLs.push(XMLHttp.responseText);
				this.pre_parse_chapter_data(XMLHttp, work_data, callback,
						chapter_NO);
			});
		},
		// 取得每一个章节的各个影像内容资料。 get_chapter_data()
		parse_chapter_data : function(html, work_data, get_label, chapter_NO) {
			var chapter_data = work_data.chapter_list[chapter_NO - 1];

			var image_list = chapter_data.image_list = [], url_Set = new Set;

			function handle_html(html) {
				html = html
				// <div class="chapter-main scroll-mode">
				.between('<div class="chapter-main scroll-mode">');
				// console.trace(html);

				/**
				 * <code>
				<img src="https://s1.baozimh.com/scomic/yuanlaiwoshixiuxiandalao-luanshijiaren/0/0-vmac/1.jpg" alt="原来我是修仙大佬 - 预告 - 1" width="1200" height="3484" data-v-25d25a4e>
				<code>
				 */
				html.each_between('<img src="', '>', function(text) {
					var url = encodeURI(text.between(null, '"'));
					if (url_Set.has(url)) {
						// 前面的部分会重复3张图片。
						return;
					}
					url_Set.add(url);
					image_list.push({
						title : get_label(text.between('alt="', '"')),
						url : url
					});
				});
			}

			handle_html(html);

			if (chapter_data.next_chapter_HTMLs) {
				chapter_data.next_chapter_HTMLs.forEach(handle_html);
				// free
				delete chapter_data.next_chapter_HTMLs;
			}
			// console.log(image_list);

			return chapter_data;
		},

		is_limited_image_url : function(image_url, image_data) {
			// e.g.,
			// https://cn.webmota.com/comic/chapter/zunshang-mankewenhua_d/0_220.html
			if (typeof image_url === 'string'
			// https://static-tw.baozimh.com/cover/404.jpg
			&& image_url.endsWith('/cover/404.jpg')) {
				return '404 Not Found';
			}
		}
	};

	// --------------------------------------------------------------------------------------------

	function new_baozimh_comics_crawler(configuration, callback, initializer) {
		// library_namespace.set_debug(9);
		configuration = configuration ? Object.assign(Object.create(null),
				default_configuration, configuration) : default_configuration;

		// 每次呼叫皆创建一个新的实体。
		var crawler = new library_namespace.work_crawler(configuration);

		return crawler;
	}

	return new_baozimh_comics_crawler;
}
