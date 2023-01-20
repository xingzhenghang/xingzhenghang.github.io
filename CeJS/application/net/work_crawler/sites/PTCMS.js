/**
 * @name CeL module for downloading PTCMS novels.
 * 
 * @fileoverview 本档案包含了解析并处理、批量下载中国大陆常见小说管理系统: PT小说聚合程序 (PTCMS系统) 各个版本的工具。
 * 
 * <code>

 CeL.PTCMS(configuration).start(work_id);

 </code>
 * 
 * TODO: 去掉前后网站广告。
 * 
 * @see https://www.ptcms.com/
 * @see http://down.chinaz.com/test/201210/2252_1.htm 杰奇小说连载系统 杰奇原创文学系统,
 *      https://zhidao.baidu.com/question/518711125119801445.html 奇文网络小说管理系统
 *      终点小说网站管理系统 露天中文小说网站管理系统 https://zhidao.baidu.com/question/474414436.html
 *      https://www.ptcms.com/ 关关采集器
 * 
 * @see https://github.com/LZ0211/Wedge/tree/master/lib/Sites/plugins
 *      https://github.com/lufengfan/NovelDownloader
 *      https://github.com/unclezs/NovelHarvester
 * @see http://www.sodu.cc/default.html
 *      https://kknews.cc/zh-tw/culture/oqyx5.html https://tw.hjwzw.com/
 * @see http://www.76wx.com/ http://www.xssk.net/
 * 
 * @since 2017/6/19 21:15:40 模组化。
 */

// More examples:
// @see https://github.com/kanasimi/work_crawler/blob/master/81xsw.js
// @see https://github.com/kanasimi/work_crawler/blob/master/23us.js
'use strict';

// --------------------------------------------------------------------------------------------

// 不采用 if 陈述式，可以避免 Eclipse JSDoc 与 format 多缩排一层。
typeof CeL === 'function' && CeL.run({
	// module name
	name : 'application.net.work_crawler.sites.PTCMS',

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

	function is_server_error(result) {
		// TODO: 81xsw 有时会 403，需要重新再撷取一次。

		return result in {
			// 88dus 有时会 502，需要重新再撷取一次。
			'502 Bad Gateway' : true,
			// 630book 有时会 503，需要重新再撷取一次。
			'503 Service Unavailable' : true,
			// 630book 有时会 "500 - 内部服务器错误。"
			'服务器错误' : true
		};
	}

	var default_configuration = {

		// auto_create_ebook, automatic create ebook
		// MUST includes CeL.application.locale!
		need_create_ebook : true,
		// recheck:从头检测所有作品之所有章节。
		// 'changed': 若是已变更，例如有新的章节，则重新下载/检查所有章节内容。
		recheck : 'changed',

		// base_URL : 'http://www.*.com/',
		// charset : 'gbk',

		// 解析 作品名称 → 作品id get_work()
		// search_URL : '',

		// for 笔趣阁
		parse_search_result_biquge : function(html, get_label) {
			// console.log(html);
			var matched = html
					.match(/og:url" content="[^<>"]+?\/(?:\d+_)?(\d+)\/"/);
			if (matched) {
				return [ [ +matched[1] ],
						[ get_label(html.between('og:title" content="', '"')) ] ];
			}

			matched = html.match(/blockcontent">([\s\S]+)<\/div>/);
			if (matched) {
				/**
				 * <code>

				// xbiquge.cc.js:
				<div class="blocktitle">出现错误！</div><div class="blockcontent"><div style="padding: 10px"><br /> 错误原因：对不起，两次搜索的间隔时间不得少于 30 秒<br /><br /> 请 <a href="javascript:history.back(1)">返 回</a> 并修正<br /><br /></div><div style="width: 100%; text-align: right; line-height: 200%; padding-right: 10px;">[<a href="javascript:window.close()">关闭本窗口</a>]</div></div>

				</code>
				 */
				matched = get_label(matched[1]).replace(/\n[\s\S]*/, '');
				library_namespace.error(matched);
			}

			// console.trace(html);
			var id_list = [], id_data = [];
			html.each_between('<li>', '</li>', function(text) {
				matched = text.match(
				/**
				 * <code>

				// biquge.js:
				<span class="s2"><a href="https://www.xs.la/211_211278/" target="_blank">
				万古剑神</a>
				</span>

				// xbiquge.js:
				<span class="s2"><a href="http://www.xbiquge.cc/book/24276/">元尊</a></span>


				// xbiquke.js
				<span class="s1">1</span>
				<span class="s2">
				    <a href="/29_29775/" target="_blank">
				        我真不是邪神走狗
				    </a>
				</span>
				<span class="s4">
				    <a href="/author/29775/">
				        万劫火
				    </a>
				</span>
				<span class="s3">
				    <a style="color: Red;" href="/29_29775/22709468.html" target="_blank" title="番外·童年（一）">
				    番外·童年（一）</a>
				</span>
				
				<span class="s6">2021-11-26 02:30:39</span>


				</code>
				 */
				/<a href="[^<>"]*?\/(?:\d+_)?(\d+)\/"[^<>]*>([\s\S]+?)<\/a>/);
				// console.log([ text, matched ]);
				if (matched) {
					id_list.push(+matched[1]);
					id_data.push(get_label(matched[2]));
				}
			});
			return [ id_list, id_data ];
		},

		// 取得作品的章节资料。 get_work_data()
		// work_URL : function(work_id) {
		// /** @see this.work_URL in CeL.application.net.work_crawler */ },
		parse_work_data : function(html, get_label, extract_work_data) {
			// console.log(html);
			// 由 meta data 取得作品资讯。
			var work_data = {
				// 必要属性：须配合网站平台更改。
				title : html.between('og:novel:title" content="', '"')
				// e.g., 88dushu.js
				|| html.between('og:title" content="', '"')
				// 通常与og:title相同
				|| html.between('og:novel:book_name" content="', '"'),

				// 选择性属性：须配合网站平台更改。
				author : html.between('og:novel:author" content="', '"'),
				// e.g., 连载[中], [已]完成
				status : html.between('og:novel:status" content="', '"'),
				category : html.between('og:novel:category" content="', '"'),
				// https://www.booktxt.net/: '<div id="fmimg">'
				image : html.between('<div id="fmimg">', '</div>').between(
						'<img src="', '"')
						// general
						|| html.between('og:image" content="', '"'),
				last_update :
				//
				html.between('og:novel:update_time" content="', '"')
				// e.g., 630book
				|| html.between('og:novel:update_time" content=\'', "'"),
				latest_chapter : html.between(
						'og:novel:latest_chapter_name" content="', '"'),
				description : get_label(
				//
				html.between('og:description" content="', '"')
				// e.g., 630book
				|| html.between('<div id="intro">', '</div>'))
				// 偶尔会有没填上描述的书籍。
				|| '',
				language : 'cmn-Hans-CN',
				site_name : get_label(
				//
				html.between('<div class="logo">', '</div>')
				//
				|| html.between('<div class="header_logo">', '</div>')
				// e.g., 630book
				|| html.between('<strong class="logo">', '</strong>'))
			};
			// 由 meta data 取得作品资讯。
			extract_work_data(work_data, html);

			if (is_server_error(work_data.title)) {
				return this.REGET_PAGE;
			}

			if (this.extract_work_data) {
				// e.g., xbiquke.js
				this.extract_work_data(work_data, html, get_label,
						extract_work_data);
			}

			if (/^\d{1,2}-\d{1,2}$/.test(work_data.last_update)) {
				// e.g., 07-01 → 2017-07-01
				work_data.last_update = (new Date).getFullYear() + '-'
						+ work_data.last_update;
			}

			if (work_data.site_name.includes('?$')) {
				// e.g., 88dushu.js
				work_data.site_name = html.between("AddFavorite('", "'");
			}

			// console.log(work_data);
			return work_data;
		},
		// 取得包含章节列表的文字范围。
		// get_chapter_list_contents : function(html) {return html.between();},
		get_chapter_list : function(work_data, html, get_label) {
			// determine base directory of work
			work_data.base_url = work_data.url.endsWith('/') ? work_data.url
					: work_data.url.replace(/\.[^.]+$/, '/');
			if (work_data.base_url.startsWith(this.base_URL)) {
				work_data.base_url = work_data.base_url
						.slice(this.base_URL.length - 1);
			}

			if (this.get_chapter_list_contents) {
				html = this.get_chapter_list_contents(html);
			}
			// console.log(html);

			work_data.chapter_list = [];
			var part_title, matched,
			// 章节以及篇章连结的模式。
			// [ all, tag name, attributes, 连结内容 HTML ]
			PATTERN_chapter = /<(li|dd|dt)([^<>]*)>([\s\S]*?)<\/\1>/g;
			while (matched = PATTERN_chapter.exec(html)) {
				if (false) {
					delete matched.input;
					console.log(matched);
				}

				if (matched[1] === 'dt' ||
				// e.g., 88dushu.js
				matched[1] === 'li' && matched[2].includes('class="fj"')) {
					part_title = get_label(matched[3]);
					if (part_title.includes('最新章节') && part_title.length > 20) {
						// e.g., 《...》最新章节（提示：已启用缓存技术，最新章节可能会延时显示，登录书架即可实时查看。）
						// e.g., ...最新章节列表 (本页已经缓存，请加入书架查看...最新章节)
						part_title = 'pass';
					} else if (part_title.includes('正文')) {
						// e.g., 《...》正文卷, 《...》正文
						part_title = '';
					}
					// console.log(part_title);

				} else if (part_title !== 'pass'
				// 取得连结内容。
				&& (matched = matched[3].between('<a ', '</a>'))) {
					var chapter_data = {
						// 从href取得章节的网址。
						url : matched.between('href="', '"')
						// xbiquge.js: 交错使用 "", ''
						|| matched.between("href='", "'")
						// booktxt.js: 交错使用 "", ''
						|| matched.between('href ="', '"'),
						part_title : part_title,
						// 从title/显示的文字取得章节的标题。
						title : matched.between('title="', '"')
								|| get_label(matched.between('>'))
					};
					work_data.chapter_list.push(chapter_data);
				}
			}
			// console.log(work_data.chapter_list);
		},

		// 取得每一个章节的内容与各个影像资料。 get_chapter_data()
		chapter_URL : function(work_data, chapter_NO) {
			var url = work_data.chapter_list[chapter_NO - 1].url;
			// console.trace(url);
			url = url.startsWith('/') || url.includes('://') ? url
					: work_data.base_url + url;
			// console.trace(url);
			return url;
		},
		parse_chapter_data : function(html, work_data, get_label, chapter_NO) {
			if (!html && this.skip_error === true) {
				// Skip empty chapter
				return;
			}

			// 在取得小说章节内容的时候，若发现有章节被目录漏掉，则将之补上。
			this.check_next_chapter(work_data, chapter_NO, html,
					this.PATTERN_next_chapter);

			var chapter_data = work_data.chapter_list[chapter_NO - 1],
			//
			sub_title = get_label(html.between('<h1>', '</h1>'))
			// || get_label(html.between('<H1>', '</H1>'))
			// || chapter_data.title
			, text = (html
			// general: <div id="content">
			// xbiquge.js: <div id="content" name="content">
			.between('<div id="content"', '</div>').between('>')
			// 去除掉广告。
			// e.g., 88dushu.js
			|| html.between('<div class="yd_text2">', '</div>')).replace(
					/<script[^<>]*>[^<>]*<\/script>/g, ''),
			//
			KEY_interval_cache = 'original_chapter_time_interval';

			if (is_server_error(sub_title) && text.length < 2000) {
				this[KEY_interval_cache] = this.chapter_time_interval;
				// 当网站不允许太过频繁的访问/access时，可以设定下载之前的等待时间(ms)。
				this.chapter_time_interval = 10 * 1000;
				return this.REGET_PAGE;
			}
			if (KEY_interval_cache in this) {
				// recover time interval
				if (this[KEY_interval_cache] > 0) {
					this.chapter_time_interval = this[KEY_interval_cache];
				} else {
					delete this.chapter_time_interval;
				}
				delete this[KEY_interval_cache];
			}

			if (this.remove_ads) {
				text = this.remove_ads(text);
			}
			// console.log(text);

			this.add_ebook_chapter(work_data, chapter_NO, {
				title : chapter_data.part_title,
				sub_title : sub_title,
				text : text
			});
		}

	};

	// --------------------------------------------------------------------------------------------

	function new_PTCMS_novels_crawler(configuration) {
		configuration = configuration ? Object.assign(Object.create(null),
				default_configuration, configuration) : default_configuration;

		if (configuration.parse_search_result === 'biquge') {
			configuration.parse_search_result = configuration.parse_search_result_biquge;
		}

		// 每次呼叫皆创建一个新的实体。
		return new library_namespace.work_crawler(configuration);
	}

	return new_PTCMS_novels_crawler;
}
