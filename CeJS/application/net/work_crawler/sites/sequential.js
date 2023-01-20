/**
 * @name CeL module for downloading sequential comics.
 * 
 * @fileoverview 本档案包含了处理、批量下载 可预测图片网址序列的漫画 的工具。
 * 
 * <code>

 CeL.work_crawler.sequential(configuration).start(work_id);

 </code>
 * 
 * 本档案为仅仅利用可预测的图片网址序列去下载漫画作品，不 fetch 作品与章节页面的范例。
 * 
 * @since 2019/6/17 21:5:52 模组化。
 */

// More examples:
// @see
// https://github.com/kanasimi/work_crawler/blob/master/comic.en-US/mrblue.js
// https://github.com/kanasimi/work_crawler/blob/master/comic.en-US/bookcube.js
'use strict';

// --------------------------------------------------------------------------------------------

// 不采用 if 陈述式，可以避免 Eclipse JSDoc 与 format 多缩排一层。
typeof CeL === 'function' && CeL.run({
	// module name
	name : 'application.net.work_crawler.sites.sequential',

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

		one_by_one : true,
		// 这类型网站必须靠侦测到错误时，转到下一个章节来运作；因此当图片下载错误时不能直接中断跳出。
		skip_error : true,
		// 但是不保留损坏的档案。
		preserve_bad_image : false,
		MAX_ERROR_RETRY : 2,

		// base_URL : '',

		// 规范 work id 的正规模式；提取出引数中的作品id 以回传。
		extract_work_id : function(work_information) {
			// e.g., "wt_HQ0005"
			if (/^[a-z_\-\d]+$/i.test(work_information))
				return work_information;
		},

		// 取得作品的章节资料。 get_work_data()
		work_URL : function(work_id) {
			// 必须是图片网址的起始部分。
			return '' + work_id + '/';
		},
		skip_get_work_page : true,
		// 解析出作品资料/作品详情。
		parse_work_data : function(html, get_label) {
			// 先给一个空的初始化作品资料以便后续作业。
			return Object.create(null);
		},
		// 解析出章节列表。
		get_chapter_list : function(work_data, html, get_label) {
			if (!Object.hasOwn(this, 'start_chapter_NO')
					&& work_data.last_download.chapter > this.start_chapter_NO) {
				// 未设定 .start_chapter_NO 且之前下载过，则接续上一次的下载。
				this.start_chapter_NO = work_data.last_download.chapter;
			}

			if (!Array.isArray(work_data.chapter_list)) {
				// 先给一个空的章节列表以便后续作业。
				work_data.chapter_list = [];
			}

			// reuse work_data.chapter_list
			while (work_data.chapter_list.length < this.start_chapter_NO) {
				// 随便垫入作品资料网址 给本次下载开始下载章节前所有未设定的章节资料，
				// 这样才能准确从 .start_chapter_NO 开始下载。后续章节网址会动态增加。
				work_data.chapter_list.push(this.work_URL(work_data.id));
			}
			// console.log(work_data);
		},

		// 依照给定序列取得图片网址。
		get_image_url : function(work_data, chapter_NO, image_index) {
			return this.work_URL(work_data.id) + chapter_NO + '/'
					+ (image_index + 1) + '.jpg';
		},

		skip_get_chapter_page : true,
		// 解析出章节资料。
		parse_chapter_data : function(html, work_data, get_label, chapter_NO) {
			// 设定必要的属性。
			var chapter_data = {
				// 先给好本章节第一张图片的网址。后续图片网址会动态增加。
				image_list : [ this.get_image_url(work_data, chapter_NO, 0) ]
			};

			// console.log(chapter_data);
			return chapter_data;
		},

		// 设定动态改变章节中的图片数量。
		dynamical_count_images : true,

		// 每个图片下载结束都会执行一次。
		after_get_image : function(image_list, work_data, chapter_NO) {
			// console.log(image_list);
			var latest_image_data = image_list[image_list.index];
			// console.log(latest_image_data);
			if (!latest_image_data.has_error) {
				library_namespace.debug([ work_data.id + ': ', {
					// gettext_config:{"id":"the-previous-image-in-this-chapter-was-successfully-downloaded.-download-the-next-image-in-this-chapter"}
					T : '本章节上一张图片下载成功。下载本章节下一幅图片。'
				} ], 3);
				image_list.push(this.get_image_url(work_data, chapter_NO,
						image_list.length));
				return;
			}

			if (image_list.length === 1) {
				library_namespace.debug([ work_data.id + ': ', {
					// gettext_config:{"id":"the-first-image-failed-to-download.-ending-download-for-this-work"}
					T : '第一张图就下载失败了。结束下载本作品。'
				} ], 3);
				return;
			}

			// CeL.debug(work_data.id + ': 本章节上一张图片下载失败。下载下一个章节的图片。');
			work_data.chapter_list.push(this.work_URL(work_data.id));
			// 动态增加章节，必须手动增加章节数量。
			work_data.chapter_count++;
		}

	};

	// --------------------------------------------------------------------------------------------

	function new_sequential_comics_crawler(configuration, callback, initializer) {
		configuration = configuration ? Object.assign(Object.create(null),
				default_configuration, configuration) : default_configuration;

		// 每次呼叫皆创建一个新的实体。
		return new library_namespace.work_crawler(configuration);
	}

	return new_sequential_comics_crawler;
}
