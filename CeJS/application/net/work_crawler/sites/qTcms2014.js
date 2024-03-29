﻿/**
 * @name CeL module for downloading **maybe** qTcms 2014 version comics.
 * 
 * @fileoverview 本档案包含了解析并处理、批量下载中国大陆常见漫画管理系统: **可能为** 旧型晴天漫画CMS (晴天漫画系统 晴天漫画程序,
 *               NOT 晴天新漫画系统) 的工具。
 * 
 * <code>

 CeL.qTcms2014(configuration).start(work_id);

 </code>
 * 
 * @see http://manhua.qingtiancms.com/
 * 
 * @since 2019/1/21 模组化。
 */

// More examples:
// @see archive/733dm.201811.js , archive/733dm.201808.js
// https://github.com/kanasimi/work_crawler/blob/master/comic.cmn-Hans-CN/katui.js
'use strict';

// --------------------------------------------------------------------------------------------

// 不采用 if 陈述式，可以避免 Eclipse JSDoc 与 format 多缩排一层。
typeof CeL === 'function' && CeL.run({
	// module name
	name : 'application.net.work_crawler.sites.qTcms2014',

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

		// 本站常常无法取得图片，因此得多重新检查。
		// recheck:从头检测所有作品之所有章节与所有图片。不会重新撷取图片。对漫画应该仅在偶尔需要从头检查时开启此选项。
		// recheck : true,
		// 当无法取得chapter资料时，直接尝试下一章节。在手动+监视下recheck时可并用此项。
		// skip_chapter_data_error : true,

		// allow .jpg without EOI mark.
		// allow_EOI_error : true,
		// 当图像档案过小，或是被侦测出非图像(如不具有EOI)时，依旧强制储存档案。
		// skip_error : true,

		// one_by_one : true,
		// base_URL : 'http://www.___.net/',
		charset : 'gb2312',

		// 取得伺服器列表。
		// use_server_cache : true,
		// katui: /skin/2014mh/global.js
		// pufei: /skin/2014mh/global.js?v=41
		// taduo: /skin/2014mh/global.js?v=42
		server_URL : 'skin/2014mh/global.js',
		parse_server_list : function(html) {
			var server_list = [],
			// e.g., WebimgServerURL[0]="http://img.tsjjx.com/"
			// WebimgServerURL[0]="http://www.733mh.com/fd.php?url=http://img.tsjjx.com/";
			matched, PATTERN = /\nWebimgServerURL\[\d\]\s*=\s*"([^"]+)"/g;
			while (matched = PATTERN.exec(html)) {
				server_list.push(matched[1].between('url=') || matched[1]);
			}
			// console.log(server_list);
			return server_list;
		},

		// 解析 作品名称 → 作品id get_work()
		search_URL : function(work_title) {
			return [ 'e/search/index.php', {
				// orderby : 1,
				// myorder : 1,
				tbname : 'mh',
				// tempid:1 @ https://www.dagumanhua.com/
				tempid : 3,
				show : 'title,player,playadmin,bieming,pinyin',
				keyboard : work_title
			} ];
		},
		parse_search_result : function(html) {
			// console.log(html);
			html = html.between('id="dmList"', '</div>');
			var id_list = [], id_data = [];
			html.each_between('<li>', '</li>', function(token) {
				var matched = token.match(
				// pufei.js: <dt><a href="/manhua/32695/index.html"
				// title="我靠美食来升级">我靠美食来升级</a></dt>
				/<dt><a href="\/(?:mh|manhua)\/(\d+)(?:\/index\.html)?" title="([^"]+)">/
				//
				);
				id_list.push(matched[1]);
				id_data.push(matched[2]);
			});
			// console.log([ id_list, id_data ]);
			return [ id_list, id_data ];
		},

		// 取得作品的章节资料。 get_work_data()
		work_URL : function(work_id) {
			return 'manhua/' + work_id + '/';
		},
		parse_work_data : function(html, get_label) {
			var text = html.between('<div class="detailInfo">',
					'<div class="intro'),
			// work_data={id,title,author,authors,chapters,last_update,last_download:{date,chapter}}
			work_data = {
				// 必要属性：须配合网站平台更改。
				title : get_label(
				//
				text.between('<div class="titleInfo">', '</h1>')),

				// 选择性属性：须配合网站平台更改。
				status : get_label(text.between('</h1><span>', '</span>')),
				description : get_label(html.between(
						'<div class="introduction" id="intro1">', '</div>'))
			};
			text.each_between('<li class="twoCol">', '</li>', function(token) {
				work_data[get_label(token.between('<span>', '</span>'))
						.replace(/：$/, '')] = get_label(token
						.between('</span>'));
			});
			Object.assign(work_data, {
				author : work_data.作者,
				last_update : work_data.更新时间
			});
			return work_data;
		},
		get_chapter_list : function(work_data, html, get_label) {
			html = html.between('<div id="section">',
					'<div class="description">');
			work_data.chapter_list = [];
			var matched,
			// [ , chapter_url, chapter_title ]
			PATTERN_chapter = /<a href="(\/manhua\/[^"]+)" title="([^"]+)"/g;
			while (matched = PATTERN_chapter.exec(html)) {
				work_data.chapter_list.push({
					url : matched[1],
					title : get_label(matched[2])
				});
			}
			if (work_data.chapter_list.length > 1) {
				// 转成由旧至新之顺序。
				work_data.chapter_list.reverse();
			}
		},

		parse_chapter_data : function(html, work_data, get_label, chapter_NO) {
			function decode(packed) {
				var photosr = [];
				// decode chapter data @ every picture page
				eval(eval(Buffer.from(packed, 'base64').toString().slice(4)));
				// 通常[0]===undefined
				return photosr.filter(function(url) {
					return url;
				});
			}

			var chapter_data = html && html.between('packed="', '"');
			if (!chapter_data || !(chapter_data = decode(chapter_data))) {
				return;
			}
			// console.log(JSON.stringify(chapter_data));
			// console.log(chapter_data.length);
			// library_namespace.set_debug(6);

			if (typeof this.postfix_image_url === 'function')
				chapter_data = chapter_data.map(this.postfix_image_url);

			chapter_data = Object.assign(
			// 设定必要的属性。
			work_data.chapter_list[chapter_NO - 1], {
				image_list : chapter_data
			});
			// console.log(JSON.stringify(chapter_data));

			return chapter_data;
		}

	};

	// --------------------------------------------------------------------------------------------

	function new_qTcms2014_comics_crawler(configuration) {
		configuration = configuration ? Object.assign(Object.create(null),
				default_configuration, configuration) : default_configuration;

		// 每次呼叫皆创建一个新的实体。
		return new library_namespace.work_crawler(configuration);
	}

	return new_qTcms2014_comics_crawler;
}
