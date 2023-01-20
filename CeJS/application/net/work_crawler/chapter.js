/**
 * @name WWW work crawler sub-functions
 * 
 * @fileoverview WWW work crawler functions: part of chapter
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
		name : 'application.net.work_crawler.chapter',

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

	// --------------------------------------------------------------------------------------------

	// 检查磁碟上面是否真的有已经下载的漫画档案。
	// .check_downloaded_chapters() 必须先确保已获得最终之 chapter_data.title。
	// e.g., calling from .get_chapter_list()
	function check_downloaded_chapters(work_data) {
		var chapter_list = Array.isArray(work_data.chapter_list)
				&& work_data.chapter_list;

		if (this.need_create_ebook || !chapter_list)
			return;

		var chapter_list_to_check = [];

		chapter_list.forEach(function(chapter_data, index) {
			if (typeof chapter_data === 'string') {
				chapter_data = chapter_list[index] = {
					url : chapter_data
				};
			}

			var downloaded_file = work_data.directory
			// + 1: chapter_NO starts from 1
			+ this.get_chapter_directory_name(work_data, index + 1) + '.'
					+ this.images_archive_extension;
			// console.log('downloaded_file: ' + downloaded_file);

			if (library_namespace.storage.file_exists(downloaded_file)) {
				chapter_data.skip_this_chapter
				// gettext_config:{"id":"skip-chapters-that-have-been-downloaded-or-checked-before-and-no-longer-need-to-be-checked"}
				= gettext('跳过之前已下载或检查过，已无需再检查的章节。');
			} else {
				chapter_list_to_check.push('§' + (index + 1)
				// + 1: chapter_NO starts from 1
				+ (chapter_data.title ? ' ' + chapter_data.title : ''));
			}
		}, this);

		if (chapter_list_to_check.length === 0) {
			library_namespace.log([ 'check_downloaded_chapters: ', {
				// gettext_config:{"id":"skip-all-chapters"}
				T : '跳过所有章节'
			} ]);
		} else {
			library_namespace.log([
					'check_downloaded_chapters: ',
					{
						// gettext_config:{"id":"check-only-$1-chapters-$2"}
						T : [ '仅检查 %1个{{PLURAL:%1|章节}}：%2',
								chapter_list_to_check.length,
								//
								chapter_list_to_check.join(', ') ]
					} ]);
		}

		// console.log(work_data.chapter_list);
		// console.log(new_chapter_list);
		// work_data.chapter_list = new_chapter_list;
	}
	/**
	 * 检查磁碟上面是否真的有已经下载的档案。
	 * 
	 * @deprecated 应该改成.check_downloaded_chapters()。
	 */
	function check_downloaded_chapter_url(work_data, new_chapter_list,
			from_chapter_NO) {
		if (// this.recheck === 'multi_parts_changed' &&
		false && Array.isArray(new_chapter_list)
		// && new_chapter_list.part_NO > 1
		&& Array.isArray(work_data.chapter_list)) {

			var old_url_hash = Object.create(null);
			work_data.chapter_list.forEach(function(chapter_data, index) {
				// assert: {Object}chapter_data
				old_url_hash[chapter_data.url] = index;
			});

			var chapter_list_to_check = [];
			if (from_chapter_NO === undefined) {
				from_chapter_NO = work_data.last_download.chapter;
			}
			// console.log('from_chapter_NO = ' + from_chapter_NO);
			new_chapter_list.forEach(function(chapter_data, index) {
				if (index + 1 <= from_chapter_NO
						|| (chapter_data.url in old_url_hash)) {
					chapter_data.skip_this_chapter =
					// gettext_config:{"id":"skip-chapters-that-have-been-downloaded-or-checked-before-and-no-longer-need-to-be-checked"}
					gettext('跳过之前已下载或检查过，已无需再检查的章节。');
				} else {
					chapter_list_to_check.push('§' + (index + 1)
					//
					+ (chapter_data.title ? ' ' + chapter_data.title : ''));
				}
			}, this);
			// Release memory. 释放被占用的记忆体。
			old_url_hash = null;

			if (chapter_list_to_check.length === 0) {
				library_namespace.log([ 'check_downloaded_chapter_url: ', {
					// gettext_config:{"id":"skip-all-chapters"}
					T : '跳过所有章节'
				} ]);
			} else {
				library_namespace.log([
						'check_downloaded_chapter_url: ',
						{
							// gettext_config:{"id":"check-only-$1-chapters-$2"}
							T : [ '仅检查 %1个{{PLURAL:%1|章节}}：%2',
									chapter_list_to_check.length,
									//
									chapter_list_to_check.join(', ') ]
						} ]);
			}

			// console.log(work_data.chapter_list);
			// console.log(new_chapter_list);
			// work_data.chapter_list = new_chapter_list;
			return;
		}
	}

	/**
	 * 下载/获取下载章节资讯/章节内容前的等待时间。
	 * 
	 * @example<code>
	var chapter_time_interval = this.get_chapter_time_interval(argument_1, work_data);
	</code>
	 * 
	 * @param [argument_1]
	 *            'search': for search works.
	 * @param {Object}[work_data]
	 *            作品资讯。
	 * 
	 * @returns {Integer|Undefined}下载章节资讯/章节内容前的等待时间 (ms)。
	 */
	function get_chapter_time_interval(argument_1, work_data) {
		// this.chapter_time_interval: 下载章节资讯/章节内容前的等待时间。
		var chapter_time_interval = this.chapter_time_interval;
		if (typeof chapter_time_interval === 'function') {
			// 采用函数可以提供乱数值的间隔。
			chapter_time_interval = this.chapter_time_interval(argument_1,
					work_data);
		}
		chapter_time_interval = library_namespace
				.to_millisecond(chapter_time_interval);

		if (chapter_time_interval >= 0) {
			var delta = Date.now() - this.last_fetch_time;
			if (delta > 0)
				chapter_time_interval -= delta;
			return chapter_time_interval;
		}
	}

	// --------------------------------------------------------------------------------------------

	function get_next_chapter_NO_item(work_data, chapter_NO) {
		if (Array.isArray(work_data.download_chapter_NO_list)) {
			// assert: work_data.download_chapter_NO_list 已经筛选过。
			// ">=": work_data.download_chapter_NO_list 有可能为空，造成一开始就等于了。
			if (work_data.download_chapter_NO_list.index >= work_data.download_chapter_NO_list.length)
				return work_data.chapter_count + 1;

			return work_data.download_chapter_NO_list[work_data.download_chapter_NO_list.index++];
		}

		return chapter_NO;
	}

	// --------------------------------------------------------------------------------------------

	// @inner
	function pre_get_chapter_data(work_data, chapter_NO, callback) {
		if (this.continue_arguments) {
			// assert: this.is_stopping_now()
			// || this.is_stopping_now(true)

			// console.log(this.continue_arguments);
			var is_quitting = this.is_stopping_now(true);

			if (!is_quitting && !this.is_stopping_now()) {
				// 照理来说不应该会到这边!
				retrurn;
			}

			library_namespace.warn([ this.id + ': ',
			// 暂停下载作业, 取消下载作业机制
			{
				// gettext_config:{"id":"cancel-download-«$1»"}
				T : [ is_quitting ? '取消下载《%1》。'
				// gettext_config:{"id":"suspend-downloading-«$1»"}
				: '暂停下载《%1》。', work_data.title || work_data.id ]
			} ]);

			this.continue_arguments.forEach(function(callback, index) {
				index > 0 && callback && callback(is_quitting);
			});

			// reset flow control flag
			delete this.continue_arguments;

			if (is_quitting) {
				this.running = false;
				if (typeof callback === 'function') {
					callback(work_data);
				}

			} else {
				// stop task
				this.continue_arguments
				// = arguments
				= [ work_data, chapter_NO, callback ];
				this.running = 'stopped';
				// waiting for this.continue_task()
			}
			return;
		}

		if (this.chapter_NO_range) {
			while (!this.chapter_NO_range.is_in_the_range(chapter_NO)) {
				if (++chapter_NO === work_data.chapter_list.length) {
					continue_next_chapter.call(this, work_data, chapter_NO,
							callback);
					return;
				}
			}
		}

		// 预防并列执行的时候出现交叉干扰。
		this.running = true;

		// ----------------------------

		var chapter_data = Array.isArray(work_data.chapter_list)
				&& work_data.chapter_list[chapter_NO - 1];

		if (this.start_chapter_title && chapter_data) {
			// console.log(chapter_data);
			var chapter_directory_name = this.get_chapter_directory_name(
					work_data, chapter_NO);
			// console.log(chapter_directory_name);
			if (!chapter_directory_name.toLowerCase().includes(
					this.start_chapter_title)) {
				library_namespace.debug({
					T : [ '还没到指定开始下载的章节标题 %2，跳过[%1]不下载。', chapter_data.title,
							chapter_directory_name ]
				});
				// 执行一些最后结尾的动作。
				continue_next_chapter.call(this, work_data, chapter_NO,
						callback);
				return;
			}

			// 去除标记。
			delete this.start_chapter_title;
		}

		/** {String}skip reason */
		var skip_this_chapter = chapter_data
				// gettext_config:{"id":"skipping-this-section-without-downloading"}
				&& (chapter_data.skip_this_chapter === true ? gettext('跳过本章节不下载。')
						: chapter_data.skip_this_chapter);

		if (!skip_this_chapter && this.chapter_filter) {
			// console.log(chapter_data);

			// 不区分大小写。
			var chapter_filter = String(this.chapter_filter).toLowerCase();

			if (chapter_data && chapter_data.title
			// 筛选想要下载的章节标题关键字。例如"单行本"。
			&& !chapter_data.title.toLowerCase().includes(chapter_filter)
			//
			&& (!chapter_data.part_title
			// 亦筛选部册标题。
			|| !chapter_data.part_title.toLowerCase().includes(chapter_filter))) {
				// gettext_config:{"id":"not-in-the-range-of-chapter_filter.-skipping-this-section-without-downloading"}
				skip_this_chapter = gettext('不在 chapter_filter 所筛范围内。跳过本章节不下载。');
			}
		}

		if (skip_this_chapter) {
			// 跳过本作品不处理。
			library_namespace.log([
					'pre_get_chapter_data: ',
					{
						T : [
								// gettext_config:{"id":"skipping-$1-not-processed-$2"}
								'跳过 %1 不处理：%2',
								(chapter_data.part_title ? '['
										+ chapter_data.part_title + '] ' : '')
										+ '[' + chapter_data.title + ']',
								skip_this_chapter ]
					} ]);

			// 执行一些最后结尾的动作。
			continue_next_chapter.call(this, work_data, chapter_NO, callback);
			return;
		}

		// ----------------------------

		var actual_operation = get_chapter_data.bind(this, work_data,
				chapter_NO, callback),
		// this.chapter_time_interval: 下载章节资讯/章节内容前的等待时间。
		chapter_time_interval = this.get_chapter_time_interval(chapter_NO,
				work_data);

		var next = chapter_time_interval > 0 ? (function() {
			var message = [ this.id, ': ', work_data.title + ': ',
			// gettext_config:{"id":"waiting-for-$3-before-downloading-$1-$2"}
			gettext('下载第 %1 %2之章节内容前先等待 %3。', chapter_NO,
			//
			work_data.chapter_unit || this.chapter_unit,
			//
			library_namespace.age_of(0, chapter_time_interval, {
				digits : 1
			})) ],
			//
			estimated_message = this.estimated_message(work_data, chapter_NO);
			if (estimated_message) {
				message.push(estimated_message);
			}
			message.push('...\r');
			library_namespace.log_temporary(message.join(''));
			setTimeout(actual_operation, chapter_time_interval);
		}).bind(this) : actual_operation;

		if (typeof this.pre_chapter_URL === 'function') {
			// 在 this.chapter_URL() 之前执行 this.pre_chapter_URL()，
			// 主要用途在获取 chapter_URL 之资料。
			try {
				this.pre_chapter_URL(work_data, chapter_NO, next);
			} catch (e) {
				library_namespace.error([
						this.id + ': ',
						{
							// §: 章节编号
							// gettext_config:{"id":"«$2»-§$3-a-serious-error-occurred-during-execution-of-$1-process-aborted"}
							T : [ '《%2》§%3：执行 %1 时发生严重错误，异常中断。',
									'.pre_chapter_URL()', work_data.title,
									chapter_NO ]
						} ]);
				this.onerror(e, work_data);
				typeof callback === 'function' && callback(work_data);
				return Work_crawler.THROWED;
			}
		} else {
			next();
		}
	}

	// --------------------------------------------------------------------------------------------
	// tools of this.get_chapter_list()

	// @see dm5.js for sample of this.get_chapter_list()
	// e.g., work_data.chapter_list = [ chapter_data,
	// chapter_data={url:'',title:'',date:new Date}, ... ]
	function setup_chapter_list(work_data, reset) {
		var chapter_list = work_data.chapter_list;
		// reset: reset work_data.chapter_list
		if (reset || !Array.isArray(chapter_list)) {
			chapter_list = work_data.chapter_list = [];
			// 漫画目录名称不须包含分部号码。使章节目录名称不包含 part_NO。
			// work_data.chapter_list.add_part_NO = false;
		}
		return chapter_list;
	}
	// part / section
	// should be called by this.get_chapter_list()
	// this.set_part(work_data, 'part_title');
	function set_part_title(work_data, part_title, part_NO) {
		var chapter_list = setup_chapter_list(work_data);

		// reset latest NO in part
		delete chapter_list.NO_in_part;

		part_title = crawler_namespace.get_label(part_title);
		if (part_title) {
			library_namespace.debug(part_title, 1, 'set_part_title');
			chapter_list.part_title = part_title;
			if (part_NO >= 1 && !('add_part_NO' in chapter_list))
				chapter_list.add_part_NO = true;
			// last part NO. part_NO starts from 1
			chapter_list.part_NO = part_NO || (chapter_list.part_NO | 0) + 1;
			// TODO: chapter_list.part_NO → chapter_list.part_count
			// TODO: do not use chapter_list.NO_in_part
		} else {
			// reset
			// delete chapter_list.part_NO;
			delete chapter_list.part_title;
		}
	}
	// should be called by this.get_chapter_list()
	// this.add_chapter(work_data, chapter_data);
	//
	// 警告: 您可能必须要重设 work_data.chapter_list
	// e.g., delete work_data.chapter_list;
	function add_chapter_data(work_data, chapter_data) {
		var chapter_list = setup_chapter_list(work_data);
		if (typeof chapter_data === 'string') {
			// treat as chapter_URL
			chapter_data = {
				url : chapter_data
			};
		}

		// assert: {Onject}chapter_data
		if (chapter_list.part_title) {
			// 如果 chapter_data 设定了值，那就用 chapter_data 原先的值。
			if (chapter_data.part_NO !== chapter_list.part_NO
					&& chapter_list.part_NO >= 1) {
				if (chapter_data.part_NO >= 1) {
					library_namespace.warn([ 'add_chapter_data: ', {
						T : [
						// gettext_config:{"id":"there-is-a-conflict-with-setting-chapter_list.$1=$2-with-chapter_data.$1=$3"}
						'原已设定 chapter_list.%1=%2，后又设定 chapter_data.%1=%3，两者相冲突！'
						//
						, 'part_NO', chapter_list.part_NO,
						//
						chapter_data.part_NO ]
					} ]);
				} else if (chapter_list.add_part_NO !== false) {
					chapter_data.part_NO = chapter_list.part_NO;
				}
			}

			if (chapter_data.part_title !== chapter_list.part_title) {
				if (chapter_data.part_title) {
					library_namespace.warn([ 'add_chapter_data: ', {
						T : [
						// gettext_config:{"id":"there-is-a-conflict-with-setting-chapter_list.$1=$2-with-chapter_data.$1=$3"}
						'原已设定 chapter_list.%1=%2，后又设定 chapter_data.%1=%3，两者相冲突！'
						//
						, 'part_title', chapter_list.part_title,
						//
						chapter_data.part_title ]
					} ]);
				} else {
					chapter_data.part_title = chapter_list.part_title;
				}
			}

			if (chapter_data.NO_in_part >= 1) {
				if (chapter_list.NO_in_part >= 1
						&& chapter_list.NO_in_part !== chapter_data.NO_in_part) {
					library_namespace.warn(
					//
					'add_chapter_data: chapter_list.NO_in_part: '
							+ chapter_data.NO_in_part + '→'
							+ chapter_list.NO_in_part);
				}
				chapter_list.NO_in_part = chapter_data.NO_in_part;
			} else {
				chapter_data.NO_in_part = chapter_list.NO_in_part
				// NO_in_part, NO in part starts from 1
				= (chapter_list.NO_in_part | 0) + 1;
			}
		}

		if (false) {
			console.log(chapter_list.length + ': '
					+ JSON.stringify(chapter_data));
		}
		chapter_list.push(chapter_data);
		return chapter_data;
	}
	// 转成由旧至新之顺序。 should reset work_data.chapter_list first!
	// set: work_data.inverted_order = true;
	// this.reverse_chapter_list_order(work_data);
	// @see work_crawler/hhcool.js
	function reverse_chapter_list_order(work_data) {
		var chapter_list = work_data.chapter_list;
		if (!Array.isArray(chapter_list) || !(chapter_list.length > 1)) {
			return;
		}
		// console.log(chapter_list);

		// 即使只有一个 part，也得处理 NO_in_part, chapter_NO 的问题。
		if (!chapter_list.part_NO)
			chapter_list.part_NO = 1;

		// reverse chapter_NO
		var chapter_NO_list = chapter_list.map(function(chapter_data, index) {
			if (!(chapter_data.NO_in_part >= 1)
					&& !chapter_list.some_chapter_without_NO_in_part) {
				chapter_list.some_chapter_without_NO_in_part = true;
				if (library_namespace.is_debug()) {
					this.onwarning('reverse_chapter_list_order: ' + gettext(
					// gettext_config:{"id":"the-serial-number-of-the-work-part-(no_in_part)-is-invalid-$1"}
					'The serial number of the work part (NO_in_part) is invalid: %1'
					//
					, 'chapter_list[' + index + ']: '
					//
					+ JSON.stringify(chapter_data)), work_data);
				}
			}
			return chapter_data.chapter_NO;
		}, this);

		library_namespace.debug({
			// gettext_config:{"id":"«$1»-sort-oldest-to-newest"}
			T : [ '《%1》：转成由旧至新之顺序。', work_data.title ]
		}, 3, 'reverse_chapter_list_order');
		chapter_list.reverse();

		if (chapter_list.some_chapter_without_NO_in_part)
			return;

		// 调整 NO_in_part
		var part_title_now, parts_count_plus_1 = chapter_list.part_NO + 1, chapter_count_plus_1;
		chapter_list.forEach(function(chapter_data, index) {
			if (chapter_NO_list[index] > 0) {
				chapter_data.chapter_NO = chapter_NO_list[index];
				// should be: chapter_data.chapter_NO === index + 1
			}

			if (part_title_now !== chapter_data.part_title
					|| !chapter_count_plus_1) {
				part_title_now = chapter_data.part_title;
				chapter_count_plus_1 = chapter_data.NO_in_part + 1;
			}

			chapter_data.NO_in_part = chapter_count_plus_1
					- chapter_data.NO_in_part;

			if (chapter_data.part_NO >= 1) {
				chapter_data.part_NO = parts_count_plus_1
						- chapter_data.part_NO;
			}
			// console.log(JSON.stringify(chapter_data));
		});
	}

	// 对于某些作品，显示建议重新检查的提示；以每个作品为单位。
	function confirm_recheck(work_data, prompt) {
		if (this.recheck || work_data.recheck_confirmed) {
			return;
		}
		work_data.recheck_confirmed = true;
		library_namespace.warn([ {
			// gettext_config:{"id":"«$1»"}
			T : [ '《%1》：', work_data.title || work_data.id, prompt ]
		}, {
			T : prompt
		} ]);
	}

	function set_start_chapter_NO_next_time(work_data, chapter_NO) {
		var chapter_data = work_data.chapter_list[chapter_NO - 1];
		if (/* chapter_data.limited || */work_data.start_chapter_NO_next_time) {
			return;
		}
		library_namespace.info({
			// gettext_config:{"id":"the-next-download-will-be-started-from-$1-«$2»"}
			T : [ '下次从 %1《%2》起下载。',
					chapter_NO + '/' + work_data.chapter_list.length,
					chapter_data.title ]
		});
		if (!chapter_data.limited) {
			library_namespace.warn({
				T : [ '%1《%2》未设定 chapter_data.limited',
						chapter_NO + '/' + work_data.chapter_list.length,
						chapter_data.title ]
			});
		}
		work_data.start_chapter_NO_next_time = chapter_NO;
		// work_data.chapter_list.truncate(chapter_NO);
	}

	// 分析所有数字后的非数字，猜测章节的单位。
	function guess_chapter_unit(title_list) {
		var units = Object.create(null), PATTERN = /\d+([^\d])/g, matched;
		title_list.forEach(function(title) {
			title = library_namespace.from_Chinese_numeral(title);
			while (matched = PATTERN.exec(title)) {
				if (!(matched[1] in units))
					units[matched[1]] = Object.create(null);
				units[matched[1]][matched[0]] = null;
			}
		});

		var unit, count = 0;
		Object.keys(units)
		// using array.reduce()
		.forEach(function(_unit) {
			var _count = Object.keys(units[_unit]).length;
			if (count < _count) {
				count = _count;
				unit = _unit;
			}
		});
		return unit;
	}
	/**
	 * 依章节标题来决定章节编号。 本函数将会改变 chapter_data.chapter_NO ！
	 * 
	 * @param {Object|Array}chapter_data
	 *            chapter_data or work_data
	 * @param {Natural}default_NO
	 *            default chapter NO
	 * 
	 * @returns {Natural}章节编号 chapter NO
	 * 
	 * @see parse_chapter_data() @ ck101.js
	 */
	function set_chapter_NO_via_title(chapter_data, default_NO, default_unit) {
		function get_title(chapter_data) {
			return library_namespace.is_Object(chapter_data) ? chapter_data.title
					: chapter_data;
		}

		if (Array.isArray(chapter_data.chapter_list)) {
			// assert: `chapter_data` is work data
			confirm_recheck
					.call(this, chapter_data,
					// gettext_config:{"id":"this-section-determines-the-chapter-number-according-to-the-chapter-title.-it-is-recommended-to-set-recheck=multi_parts_changed-option-to-avoid-a-missed-situation-when-downloading-multiple-times"}
					'本作依章节标题来决定章节编号；建议设置 recheck=multi_parts_changed 选项来避免多次下载时，遇上缺话的情况。');
			// input sorted work_data, use work_data.chapter_list
			// latest_chapter_NO, start NO
			default_NO |= 0;
			if (!default_unit && chapter_data.chapter_list.length > 1
			//
			&& library_namespace.from_Chinese_numeral) {
				default_unit = guess_chapter_unit(chapter_data.chapter_list
						.map(get_title));
			}
			chapter_data.chapter_list.forEach(function(chapter_data) {
				var chapter_NO = this.set_chapter_NO_via_title(chapter_data,
						++default_NO);
				// + 1: 可能有 1 → 1.5
				if (default_NO > chapter_NO + 1) {
					library_namespace.warn({
						// gettext_config:{"id":"in-the-case-of-«$1»-the-chapter-number-is-inverted-$2"}
						T : [ '《%1》出现章节编号倒置的情况：%2', chapter_data.title,
						// 逆转 回退倒置 倒退
						default_NO + ' → ' + chapter_NO ]
					});
				}
				default_NO = chapter_NO;
			}, this);
			return;
		}

		// 处理单一章节。
		// chapter_data={title:'',chapter_NO:1}

		// console.log(chapter_data);
		var title = get_title(chapter_data);
		if (default_unit !== '季') {
			title = title.replace(/四季/g, '');
		}

		if (library_namespace.from_Chinese_numeral) {
			// for youngaceup.js, 黄昏メアレス -魔法使いと黒猫のウィズ Chronicle-
			title = library_namespace.from_Chinese_numeral(title).toString();
			// TODO: 只对所有章节皆能转成 /^[\d+]$/ 者才如此处理。
		}

		// 因为中间的章节可能已经被下架，因此依章节标题来定章节编号。
		// \d{1,4}: e.g., http://www.moae.jp/comic/otonanosonnayatsu
		var matched = title.match(/(?:^|第 ?)(\d{1,4}(?:\.\d)?) ?话/) || title
		// #1, Episode 1, act 1
		.match(/^(?:[＃#] *|(?:Episode|act)[ .:]*)?(\d{1,3})(?:$|[ .\-])/i)
		// 章节编号有prefix，或放在末尾。 e.g., 乙ゲーにトリップした俺♂, たすけてまおうさま @ pixivコミック
		// e.g., へるぷ22, チャプター24后编
		|| title.match(/^[^\d]+(\d{1,2})(?:$|[^\d])/)
		// 1限目
		|| title.match(/^(\d{1,2}) ?限目/);
		if (matched) {
			// 可能有第0话。
			if (library_namespace.is_Object(chapter_data))
				chapter_data.chapter_NO = default_NO = matched[1] | 0;
			return default_NO;
		}

		// TODO: 神落しの鬼 @ pixivコミック: ニノ巻
		// TODO: 特别编その2

		library_namespace.warn([ {
			// gettext_config:{"id":"cannot-determine-chapter-no-from-title-«$1»"}
			T : title ? [ '无法从章节标题《%1》判断章节序号。', title ] : [
			// gettext_config:{"id":"cannot-determine-chapter-no-from-chapter-data-$1"}
			'无法从章节资料判断章节序号：%1。', JSON.stringify(chapter_data) ]
		}, default_NO >= 0 ? {
			// gettext_config:{"id":"set-the-chapter-no-to-$1-according-to-the-chapter-order"}
			T : [ '依序将章节序号设定为 %1。', default_NO ]
		} : '' ]);
		if (library_namespace.is_Object(chapter_data) && default_NO >= 0)
			chapter_data.chapter_NO = default_NO;
		return default_NO;
	}
	// should be called by get_data() or this.pre_parse_chapter_data()
	// this.get_chapter_directory_name(work_data, chapter_NO);
	// this.get_chapter_directory_name(work_data, chapter_NO, chapter_data);
	// this.get_chapter_directory_name(work_data, chapter_NO, chapter_title);
	function get_chapter_directory_name(work_data, chapter_NO, chapter_data,
			no_part) {
		if (typeof chapter_data === 'boolean' && no_part === undefined) {
			// this.get_chapter_directory_name(work_data, chapter_NO, no_part);
			// shift arguments
			no_part = chapter_data;
			chapter_data = null;
		}

		var part, chapter_title;

		if (typeof chapter_data === 'string') {
			// treat chapter_data as chapter_title.
			chapter_title = work_data;

		} else if (library_namespace.is_Object(chapter_data)
				|| Array.isArray(work_data.chapter_list)
				&& library_namespace
						.is_Object(chapter_data = work_data.chapter_list[chapter_NO - 1])) {
			// console.trace(chapter_data);

			if (!('add_part_NO' in work_data.chapter_list)) {
				// 自动设定是否包含分部号码。
				// 漫画目录名称不须包含分部号码。使章节目录名称不包含 part_NO。
				work_data.chapter_list.add_part_NO = !!this.need_create_ebook;
			}

			if (chapter_data.part_title
					&& work_data.chapter_list.add_part_NO !== false
					&& !(work_data.chapter_list.part_NO >= 1)) {
				// console.trace(chapter_data);
				console.trace(work_data.chapter_list.add_part_NO);
				library_namespace
						.warn({
							T : [
									// gettext_config:{"id":"the-tool-file-has-set-part_title-$1-but-it-seems-that-the-`work_data.chapter_list.part_no`?-(part_no-$2)-should-be-set"}
									'工具档设定了 part_title %1，却似乎未设定应设定的 `work_data.chapter_list.part_NO`? (part_NO: %2)',
									JSON.stringify(chapter_data.part_title),
									JSON
											.stringify(work_data.chapter_list.part_NO) ]
						});
			}

			if (false) {
				console.log(chapter_data);
				console.log([ no_part, chapter_data.part_title,
						work_data.chapter_list.part_NO, this.add_part ]);
				throw new Error('detect parts');
			}
			if (!no_part && chapter_data.part_title
			//
			&& (Array.isArray(work_data.chapter_list)
			// 当只有一个 part (分部) 的时候，预设不会添上 part 标题，除非设定了 this.add_part。
			&& work_data.chapter_list.part_NO > 1 || this.add_part)) {
				confirm_recheck
						.call(this, work_data,
						// gettext_config:{"id":"this-work-has-a-different-part.-it-is-recommended-to-set-recheck=multi_parts_changed-option-to-avoid-a-missed-situation-when-downloading-multiple-times"}
						'本作存有不同的 part；建议设置 recheck=multi_parts_changed 选项来避免多次下载时，遇上缺话的情况。');
				part = chapter_data.NO_in_part | 0;
				if (part >= 1) {
					chapter_NO = part;
				}

				part = (work_data.chapter_list.add_part_NO !== false
				// work_data.chapter_list.add_part_NO === false:
				// 漫画目录名称不须包含分部号码。使章节目录名称不包含 part_NO。
				&& chapter_data.part_NO >= 1 ? chapter_data.part_NO.pad(2)
				// 小说才有第一部第二部之分，漫画分部不会有号码(part_NO)，因此去掉漫画目录名称名称之号码标示。
				// "01 单话 0001 第371回" → "单话 0001 第371回"
				+ ' ' : '') + chapter_data.part_title + ' ';
				part = part.trimStart();
			}
			chapter_title = chapter_data.chapter_title || chapter_data.title;

		} else {
			this.onerror('get_chapter_directory_name: '
					// gettext_config:{"id":"invalid-chapter_data-$1"}
					+ gettext('Invalid chapter_data: %1', work_data.id + ' §'
							+ chapter_NO), work_data);
			typeof callback === 'function' && callback(work_data);
			return Work_crawler.THROWED;
		}

		// assert: !chapter_data || !!chapter_data.title === true
		chapter_title = chapter_title ? chapter_title.trim() : '';

		var chapter_directory_name = (part || '')
		// 档名 NO 的基本长度（不足补零）。以 chapter_data.chapter_NO 可自定章节编号。
		+ (chapter_data && chapter_data.chapter_NO || chapter_NO)
		// 一开始就该定一个不太需要改变的位数。
		// 即使是小说，很少达到10000个章节。
		.pad(/* work_data.chapter_NO_pad_digits || */4)
		//
		+ (chapter_title ? ' '
		// 把网页编码还原成看得懂的文字。 crawler_namespace.get_label()
		+ library_namespace.HTML_to_Unicode(chapter_title) : '');

		chapter_directory_name = library_namespace
				.to_file_name(chapter_directory_name);
		return chapter_directory_name;
	}

	// @inner
	function get_chapter_data(work_data, chapter_NO, callback) {
		function get_chapter_URL() {
			var chapter_URL = _this.chapter_URL(work_data, chapter_NO);
			// console.trace(work_data);
			// console.log('chapter_URL: ' + chapter_URL);
			if (chapter_URL !== Work_crawler.SKIP_THIS_CHAPTER) {
				chapter_URL = chapter_URL && _this.full_URL(chapter_URL);
			}
			// console.log('chapter_URL: ' + chapter_URL);
			return chapter_URL;
		}

		var _this = this,
		// left: remaining chapter count
		left, image_list, waiting, chapter_label,
		//
		chapter_directory, images_archive, chapter_page_file_name,
		//
		chapter_URL;

		try {
			chapter_URL = get_chapter_URL();
			if (chapter_URL === Work_crawler.SKIP_THIS_CHAPTER) {
				typeof callback === 'function' && callback(work_data);
				return;
			}
			if (!chapter_URL && !_this.skip_get_chapter_page) {
				// gettext_config:{"id":"unable-to-receive-web-address-of-§$1"}
				throw gettext('无法取得 §%1 的网址。', chapter_NO);
			}
		} catch (e) {
			// e.g., qq.js
			_this.onerror(e, work_data);
			typeof callback === 'function' && callback(work_data);
			return Work_crawler.THROWED;
		}

		library_namespace.debug(work_data.id + ' ' + work_data.title + ' §'
				+ chapter_NO + '/' + work_data.chapter_count + ': '
				+ chapter_URL, 1, 'get_chapter_data');
		process.title = [
				chapter_NO,
				// '/', work_data.chapter_count,
				' @ ',
				work_data.title || work_data.id,
				Array.isArray(this.work_list_now)
						// 两者皆必须为字串。
						&& typeof this.work_list_now[this.work_list_now.list_serial - 1] === 'string'
						&& typeof work_data.title === 'string'
						// .includes(): 可能经过一些变化而不完全一样
						&& work_data.title
								.includes(this.work_list_now[this.work_list_now.list_serial - 1]
										.trim()) ? ' '
						+ this.work_list_now.list_serial + '/'
						+ this.work_list_now.length : '', ' @ ', this.id ]
				.join('');

		// --------------------------------------

		// 若是已经有下载好的旧目录风格档案，就把它转成新的目录风格，避免需要重复下载。
		// 过渡时期的措施: 当所有目录都改成新风格就应该关掉。
		if (false && Array.isArray(work_data.chapter_list)
				&& work_data.chapter_list.part_NO > 1 && !this.add_part) {
			var old_style_directory_path = work_data.directory
					+ this.get_chapter_directory_name(work_data, chapter_NO,
							true);
			if (library_namespace.directory_exists(old_style_directory_path)) {
				library_namespace.move_fso(old_style_directory_path,
						work_data.directory
								+ this.get_chapter_directory_name(work_data,
										chapter_NO));
			}
		}

		// --------------------------------------

		function get_data() {
			var estimated_message = _this.estimated_message(work_data,
					chapter_NO);
			library_namespace.log_temporary({
				T : [ estimated_message ?
				// gettext_config:{"id":"getting-data-of-chapter-$1-$2"}
				'Getting data of chapter %1, %2'
				// gettext_config:{"id":"getting-data-of-chapter-$1"}
				: 'Getting data of chapter %1', chapter_NO
				//
				+ (typeof _this.pre_chapter_URL === 'function' ? ''
				//
				: '/' + work_data.chapter_count), estimated_message ]
			});

			// default: 置于 work_data.directory 下。
			var chapter_file_name = work_data.directory
					+ work_data.directory_name + ' '
					+ chapter_NO.pad(work_data.chapter_NO_pad_digits || 3)
					+ '.' + Work_crawler.HTML_extension;

			function process_images(chapter_data, XMLHttp) {
				// get chapter label, will used as chapter directory name.
				chapter_label = _this.get_chapter_directory_name(work_data,
						chapter_NO, chapter_data, false);
				chapter_directory = work_data.directory + chapter_label;
				library_namespace.debug({
					// 先准备好章节目录
					// gettext_config:{"id":"creating-a-chapter-directory-$1"}
					T : [ '先创建章节目录：%1', chapter_directory ]
				}, 1, 'process_images');
				// console.log(chapter_directory);
				library_namespace.create_directory(chapter_directory);

				images_archive = work_data.directory + chapter_label + '.'
						+ _this.images_archive_extension;
				try {
					var images_archive_status = node_fs
							.statSync(images_archive);
					// console.log(images_archive_status);
					if (images_archive_status.mtime
							- work_data.last_file_modified_date > 0) {
						// 纪录最后下载的图片压缩档时间。
						work_data.last_file_modified_date = images_archive_status.mtime;
					}
				} catch (e) {
					// TODO: handle exception
				}
				images_archive = new library_namespace.storage.archive(
						images_archive);
				// cache
				Object.assign(images_archive, {
					base_directory : work_data.directory,
					file_name : chapter_label + '.'
							+ _this.images_archive_extension,
					work_directory : work_data.directory,
					to_remove : []
				});
				if (library_namespace
						.file_exists(images_archive.archive_file_path)) {
					if (library_namespace.platform.OS === 'darwin'
							&& images_archive.program_type === 'zip') {
						// In Max OS: 直接解开图片压缩档以避免麻烦。
						// Max OS 中，压缩档内的档案路径包括了目录名称，行为表现与其他的应用程式不一致，因此不容易判别。
						// 另外 Max OS 中的压缩程式缺乏了某些功能。
						library_namespace.log_temporary({
							// gettext_config:{"id":"extracting-image-files-$1"}
							T : [ '解开图片压缩档：%1', images_archive.file_name ]
						});
						images_archive.extract({
							cwd : images_archive
						});
					} else {
						// detect if images archive file is existed.
						images_archive.file_existed = true;
						library_namespace.log_temporary({
							// gettext_config:{"id":"reading-image-archive-$1"}
							T : [ '读取图片压缩档：%1', images_archive.file_name ]
						});
						images_archive.info();
						if (false && typeof _this.check_images_archive === 'function')
							_this.check_images_archive(images_archive);
					}
				}
				chapter_directory = library_namespace
						.append_path_separator(chapter_directory);

				chapter_page_file_name = work_data.directory_name + '-'
						+ chapter_label + '.' + Work_crawler.HTML_extension;
				// 注意: 若是没有 reget_chapter，则 preserve_chapter_page 不应发生效用。
				if (work_data.reget_chapter && _this.preserve_chapter_page) {
					node_fs.writeFileSync(chapter_directory
							+ chapter_page_file_name, XMLHttp.buffer);
				} else if (_this.preserve_chapter_page === false) {
					// 明确指定不保留，将删除已存在的 chapter page。
					library_namespace.debug({
						// gettext_config:{"id":"deleting-image-from-chapter-$1"}
						T : [ '删除章节内容页面：%1', chapter_page_file_name ]
					}, 1, 'process_images');
					library_namespace.remove_file(chapter_directory
							+ chapter_page_file_name);
				}
				var message = [ {
					// gettext_config:{"id":"$1-$2-$3-images"}
					T : [ '%1 [%2] %3 {{PLURAL:%3|image|images}}.', chapter_NO
					//
					+ (typeof _this.pre_chapter_URL === 'function' ? ''
					//
					: '/' + work_data.chapter_count), chapter_label, left ]
				},
				// 例如需要收费/被锁住的章节。 .locked 此章节为付费章节 本章为付费章节
				chapter_data.limited ? {
					// gettext_config:{"id":"(limited-access)"}
					T : '（本章为需要付费/被锁住的章节）'
				} : '' ];
				if (chapter_data.limited) {
					// 针对特殊状况提醒。
					library_namespace.info(message);
					if (!work_data.some_limited) {
						work_data.some_limited = true;
						crawler_namespace.set_work_status(work_data, 'limited');
					}
				} else {
					library_namespace.log(message);
				}

				// 正规化/初始化图像资料
				// http://stackoverflow.com/questions/245840/rename-files-in-sub-directories
				// for /r %x in (*.jfif) do ren "%x" *.jpg
				function normalize_image_data(image_data, index) {
					// set image file path
					function image_file_path_of_chapter_NO(chapter_NO) {
						return chapter_directory
						//
						+ work_data.id + '-' + chapter_NO + '-'
						// 一开始就该定一个不太需要改变的位数。
						// 一个章节很少到1000张图片。
						+ (index + 1).pad(3) + '.' + file_extension;
					}

					library_namespace.debug(chapter_label + ': ' + (index + 1)
							+ '/' + image_list.length, 6,
							'normalize_image_data');
					// console.log(image_data);
					if (!image_data) {
						// 若是没有设定image_data，那么就明确的给一个表示有错误的。
						return image_list[index] = {
						// 这两个会在 function get_image() 里面设定。
						// has_error : true,
						// done : true
						};
					}

					if (typeof image_data === 'string') {
						// image_data 会被用来记录一些重要的资讯。
						// 若是没回写到原先的image_list，那么将会失去这些资讯。
						image_list[index] = image_data = {
							url : image_data
						};

					}

					if (image_data.file) {
						// image_data.file: 指定图片要储存档的档名与路径 file_path。
						// 已经设定过就不再设定 image_data.file。
						return image_data;
					}

					if (typeof image_data.file_name === 'function') {
						// return {String}file name
						image_data.file_name = image_data.file_name(work_data,
								chapter_NO, index);
					}
					if (image_data.file_name) {
						image_data.file = chapter_directory
								+ image_data.file_name;
						// 采用 image_data.file_name 来设定 image_data.file。
						return image_data;
					}

					var file_extension = image_data.file_extension
							|| work_data.image_extension;
					if (!file_extension && image_data.url) {
						// 由图片的网址URL来判别可能的延伸档名。
						var matched = image_data.url.replace(/[?#].*$/, '');
						matched = matched.match(/\.([a-z\d\-_]+)$/i);
						if (matched) {
							matched = matched[1].toLowerCase();
							if (matched in _this.image_types) {
								// e.g., manhuagui.js
								library_namespace.debug({
									T : [
											// gettext_config:{"id":"file-extension-$1"}
											'File extension: %1',
											'.' + matched + ' ← '
													+ image_data.url ]
								}, 3, 'get_data');
								file_extension = matched;
							}
						}
					}
					if (!file_extension) {
						// 猜不出的会采用预设的图片延伸档名/副档名.default_image_extension。
						file_extension = _this.default_image_extension;
					}

					// 本来希望若之前没有分部，现在却增加了分部，那么若资料夹中有旧的图像档案，可以直接改名。
					// 但由于增加分部之后，chapter_directory已经加上分部名称，和原先没有分部情况下资料夹名称不同，因此抓不到原先的图像档案。
					// TODO: 重新命名旧的资料夹。
					var old_image_file_path = image_file_path_of_chapter_NO(chapter_NO),
					// 使图片档名中的章节编号等同于资料夹编号。
					// 注意：若是某个章节分成好几部分，可能造成这些章节中的图片档名相同。
					using_chapter_NO = chapter_data.chapter_NO >= 1 ? chapter_data.chapter_NO
							: chapter_data.NO_in_part >= 1
									&& chapter_data.NO_in_part;
					if (using_chapter_NO && using_chapter_NO !== chapter_NO) {
						// 若有分部，则以部编号为主。
						image_data.file = image_file_path_of_chapter_NO(using_chapter_NO);

						// 假如之前已获取过图片档案，就把旧图片改名成新的名称格式。
						// 例如之前没有分部，现在却增加了分部。
						if (!library_namespace.file_exists(image_data.file)
						// && old_image_file_path !==
						// image_data.file
						&& library_namespace.file_exists(old_image_file_path)) {
							library_namespace.move_file(old_image_file_path,
									image_data.file);
						}
					} else {
						image_data.file = old_image_file_path;
					}

					return image_data;
				}

				// console.log(image_list);
				// TODO: 当某 chapter 档案过多(如1000)，将一次 request 过多 connects 而造成问题。
				if (!_this.one_by_one) {
					// 并行下载。
					image_list.forEach(function(image_data, index) {
						image_data = normalize_image_data(image_data, index);
						_this.get_image(image_data, check_if_done,
								images_archive);
					});
					library_namespace.debug({
						// gettext_config:{"id":"$1-the-work-has-been-dispatched-and-the-images-are-downloaded-in-parallel"}
						T : [ '%1：已派发完工作，开始并行下载各图片。', chapter_label ]
					}, 3, 'get_data');
					waiting = true;
					return;
				}

				// 只有在 this.one_by_one===true 这个时候才会设定 image_list.index
				image_list.index = 0;
				var image_time_interval = _this.one_by_one !== true
						&& library_namespace.to_millisecond(_this.one_by_one),
				//
				get_next_image = function() {
					// assert: image_list.index < image_list.length
					library_namespace.log_temporary({
						T : [
						// gettext_config:{"id":"download-image-$1"}
						'下载图 %1', (image_list.index + 1)
						//
						+ (_this.dynamical_count_images ? ''
						//
						: '/' + image_list.length) ]
					});
					var image_data = normalize_image_data(
							image_list[image_list.index], image_list.index);
					if (image_time_interval > 0)
						image_data.time_interval = image_time_interval;
					_this.get_image(image_data, function(image_data, status) {
						check_if_done(image_data, status);

						// 添加计数器
						if (!(++image_list.index < image_list.length)) {
							return;
						}

						if (!(image_time_interval > 0)
						// 没有实际下载动作时，就不用等待了。
						|| status === 'image_downloaded'
								|| status === 'invalid_data') {
							get_next_image();
							return;
						}

						library_namespace.log_temporary([ 'process_images: ', {
							// gettext_config:{"id":"waiting-for-$1-before-downloading-the-$2-image"}
							T : [ '下载第 %2 张{{PLURAL:%2|图片}}前先等待 %1。',
							//
							library_namespace.age_of(0, image_time_interval, {
								digits : 1
							}), image_list.index + '/' + image_list.length ]
						} ]);
						setTimeout(get_next_image, image_time_interval);
					}, images_archive);
				};
				get_next_image();
			}

			function process_chapter_data(XMLHttp, error) {
				XMLHttp = XMLHttp || Object.create(null);
				if (/(?:\.html?|\/)$/.test(XMLHttp.responseURL)) {
					_this.setup_value('Referer', XMLHttp.responseURL.replace(
					// 因为隐私问题？有些浏览器似乎会隐藏网址，只要输入host即可？
					/(:\/\/[^/]+\/).+/, '$1'));
				}
				var html = XMLHttp.responseText;
				if (!html
						&& !_this.skip_get_chapter_page
						&& (!_this.skip_error || get_data.error_count < _this.MAX_ERROR_RETRY)) {
					library_namespace.error((work_data.title || work_data.id)
					//
					+ ': '
					// work_data.chapter_unit || _this.chapter_unit
					// gettext_config:{"id":"failed-to-get-data-of-chapter-$1"}
					+ gettext('无法取得第 %1 章的内容。', chapter_NO));
					if (get_data.error_count === _this.MAX_ERROR_RETRY) {
						if (_this.skip_chapter_data_error) {
							library_namespace.warn('process_chapter_data: '
							// Skip this chapter if do not need throw
							// gettext_config:{"id":"skip-$1-§$2-and-continue-next-chapter"}
							+ gettext('跳过 %1 §%2 并接著下载下一章。',
							//
							work_data.title, chapter_NO));
							check_if_done();
							return;
						}
						// gettext_config:{"id":"message_need_re_download"}
						_this.onerror(gettext('MESSAGE_NEED_RE_DOWNLOAD'),
								work_data);
						typeof callback === 'function' && callback(work_data);
						return Work_crawler.THROWED;
					}
					get_data.error_count = (get_data.error_count | 0) + 1;
					library_namespace.log([ 'process_chapter_data: ', {
						// gettext_config:{"id":"retry-$1-$2"}
						T : [ 'Retry %1/%2',
						//
						get_data.error_count, _this.MAX_ERROR_RETRY ]
					}, '...' ]);
					if (!work_data.reget_chapter) {
						library_namespace
								.warn({
									// gettext_config:{"id":"since-the-cache-file-is-broken-(for-example-an-empty-file)-chapter_url-will-be-retrieved-and-.reget_chapter-will-be-set"}
									T : '因快取档案坏了（例如为空档案），将重新取得 chapter_URL，设定 .reget_chapter。'
								});
						work_data.reget_chapter = true;
					}
					get_data();
					return;
				}

				var chapter_data;
				if (_this.check_chapter_NO) {
					chapter_data = Array.isArray(_this.check_chapter_NO)
					// 检测所获得内容的章节编号是否相符。
					? html.between(_this.check_chapter_NO[0],
							_this.check_chapter_NO[1])
					// {Function}return chapter NO is OK
					: _this.check_chapter_NO(html);
					var chapter_NO_text = null;
					if (typeof chapter_data !== 'boolean') {
						chapter_NO_text
						//
						= crawler_namespace.get_label(chapter_data);
						chapter_data = chapter_NO_text == chapter_NO
								// for yomou only
								|| (chapter_NO_text === '' || chapter_NO_text === undefined)
								&& work_data.status
								&& work_data.status.includes('短编')
					}
					if (!chapter_data) {
						// library_namespace.warn(html);
						library_namespace.warn(work_data.status);
						_this.onerror(new Error(_this.id
								+ ': '
								+ gettext(chapter_NO_text === null
								// gettext_config:{"id":"the-chapter-number-should-be-$1-in-order-but-the-number-cannot-be-obtained-from-the-chapter-content"}
								? '章节编号依序应为 %1，但无法自章节内容取得编号。'
								// gettext_config:{"id":"the-chapter-numbers-are-inconsistent-the-order-should-be-$1-but-the-$2-is-taken-from-the-content"}
								: '章节编号不一致：依序应为 %1，但从内容撷取出 %2。', chapter_NO,
										JSON.stringify(chapter_NO_text))),
								work_data);
						typeof callback === 'function' && callback(work_data);
						return Work_crawler.THROWED;
					}
				}

				try {
					// image_data.url 的正确设定方法:
					// = base_URL + encodeURI(CeL.HTML_to_Unicode(url))

					// 解析出章节资料。
					chapter_data = _this.parse_chapter_data
							&& _this.parse_chapter_data(html, work_data,
									crawler_namespace.get_label, chapter_NO)
							// e.g., 已在 this.pre_parse_chapter_data() 设定完
							// {Array}chapter_data.image_list
							|| Array.isArray(work_data.chapter_list)
							// default chapter_data
							&& work_data.chapter_list[chapter_NO - 1];
					if (chapter_data === _this.REGET_PAGE) {
						// 当重新读取章节内容的时候，可以改变网址。

						// 需要重新读取页面。e.g., 502
						var old_chapter_URL = chapter_URL;
						chapter_URL = get_chapter_URL();
						var chapter_time_interval = _this
								.get_chapter_time_interval(chapter_URL,
										work_data);
						var message = old_chapter_URL === chapter_URL
						// 等待几秒钟 以重新获取章节内容页面网址
						// gettext_config:{"id":"waiting-for-$2-and-re-obtaining-the-chapter-content-page-$1"}
						? chapter_time_interval > 0 ? '等待 %2 之后再重新取得章节内容页面：%1'
						// gettext_config:{"id":"re-acquiring-chapter-content-page-$1"}
						: '重新取得章节内容页面：%1'
						// gettext_config:{"id":"waiting-for-$2-and-then-get-the-chapter-content-page-$1"}
						: chapter_time_interval > 0 ? '等待 %2 之后再取得章节内容页面：%1'
						// gettext_config:{"id":"get-the-chapter-content-page-$1"}
						: '取得章节内容页面：%1';
						library_namespace.log_temporary([
						//
						'process_chapter_data: ', {
							T : [ message,
							// TODO: for Array.isArray(chapter_URL)
							chapter_URL, library_namespace.age_of(0,
							//
							chapter_time_interval, {
								digits : 1
							}) ]
						} ]);
						if (chapter_time_interval > 0) {
							setTimeout(reget_chapter_data,
									chapter_time_interval);
						} else {
							reget_chapter_data();
						}
						return;
					}

					if (!chapter_data && Array.isArray(work_data.chapter_list)) {
						// 照理来说多少应该要有资讯，因此不应用 `this.skip_error` 跳过。
						// gettext_config:{"id":"parse-out-empty-page-information"}
						throw gettext('解析出空的页面资讯！');
					}

				} catch (e) {
					library_namespace.error([ _this.id + ': ', {
						// gettext_config:{"id":"an-error-occurred-while-parsing-the-chapter-page-it-is-interrupted-at-$1"}
						T : [ '解析章节页面时发生错误，中断跳出：%1',
						//
						(Array.isArray(chapter_URL) ? chapter_URL[0]
						//
						: chapter_URL) ]
					} ]);
					_this.onerror(e, work_data);
					typeof callback === 'function' && callback(work_data);
					return Work_crawler.THROWED;
				}

				var test_limited_image_url
				//
				= typeof _this.is_limited_image_url === 'function'
				//
				&& Array.isArray(chapter_data.image_list)
				// this.is_limited_image_url(image_url, image_data)
				&& function(image_data) {
					if (!image_data)
						return true;
					var image_url = image_data.url || image_data;
					return _this.is_limited_image_url(image_url, image_data);
				};
				if (test_limited_image_url
				// 处理特殊图片: 遇到下架章节时会显示特殊图片。避免下载到下架图片。
				&& chapter_data.image_list.some(test_limited_image_url)) {
					// e.g., taduo.js 因为版权或其他问题，我们将对所有章节进行屏蔽！
					chapter_data.limited = true;
					if (chapter_data.image_list.every(test_limited_image_url)) {
						// 所有图片皆为 limited image。
						// chapter_data.image_length =
						// chapter_data.image_list.length;
						delete chapter_data.image_list;
					}
				}

				// console.log(JSON.stringify(chapter_data));
				if (!(image_list = chapter_data.image_list)
				//
				|| !((left = chapter_data.image_count) >= 1)
				//
				&& !((left = image_list.length) >= 1)) {
					if (!_this.need_create_ebook
					// 虽然是漫画，但是本章节没有获取到任何图片时的警告。
					&& (!chapter_data || !chapter_data.limited
					// 图片档案会用其他方式手动下载。 .allow_empty_chapter
					&& !chapter_data.images_downloaded)) {
						if (!chapter_data.limited) {
							// console.log(chapter_data);
						}
						// gettext_config:{"id":"this-chapter-is-a-chapter-that-requires-payment-locking"}
						var message = gettext(chapter_data.limited ? '本章为需要付费/被锁住的章节。'
								// gettext_config:{"id":"did-not-get-any-image-from-this-chapter"}
								: '本章节没有获取到任何图片！');
						_this.onwarning('process_chapter_data: '
								+ work_data.directory_name + ' §' + chapter_NO
								+ '/' + work_data.chapter_count + ': '
								+ message);
						// console.log(chapter_data);
						crawler_namespace.set_work_status(work_data, '§'
								+ chapter_NO + ': ' + message);
					}
					// 注意: 若是没有 reget_chapter，则 preserve_chapter_page 不应发生效用。
					if (work_data.reget_chapter && _this.preserve_chapter_page) {
						node_fs.writeFileSync(
						// 依然储存cache。例如小说网站，只有章节文字内容，没有图档。
						chapter_file_name, XMLHttp.buffer);
					} else if (_this.preserve_chapter_page === false) {
						// 明确指定不保留，将删除已存在的 chapter page。
						library_namespace.debug({
							// gettext_config:{"id":"deleting-image-from-chapter-$1"}
							T : [ '删除章节内容页面：%1', chapter_file_name ]
						}, 1, 'process_chapter_data');
						library_namespace.remove_file(chapter_file_name);
					}

					// 模拟已经下载完最后一张图。
					left = 1;
					check_if_done();
					return;
				}

				// console.log(chapter_data);
				if (left !== image_list.length) {
					library_namespace.error({
						// gettext_config:{"id":"the-number-of-registered-images-$1-is-different-from-the-length-of-the-images-list-$2"}
						T : [ '所登记的图形数量%1与有图形列表长度%2不同！', left,
								image_list.length ]
					});
					if (left > image_list.length) {
						left = image_list.length;
					}
				}
				if (false && !_this.one_by_one) {
					// 当一次下载上百张相片的时候，就改成一个个下载图像。
					_this.one_by_one = left > 100;
				}

				if (work_data.image_count >= 0) {
					work_data.image_count += left;
				}

				if (typeof chapter_data === 'object'
						&& Array.isArray(work_data.chapter_list)
						&& library_namespace
								.is_Object(work_data.chapter_list[chapter_NO - 1])
						&& chapter_data !== work_data.chapter_list[chapter_NO - 1]) {
					if (false) {
						// 自动引用旧的章节资讯。
						chapter_data = Object.assign(
								work_data.chapter_list[chapter_NO - 1],
								chapter_data);
					} else {
						// 自动填补章节名称。
						if (!chapter_data.title) {
							chapter_data.title = work_data.chapter_list[chapter_NO - 1].title;
						}
						if (!chapter_data.part_title
								&& (work_data.chapter_list.part_title || work_data.chapter_list[chapter_NO - 1].part_title)) {
							library_namespace
									.warn({
										// gettext_config:{"id":"the-original-chapter-data-have-sets-a-division-title-but-the-chapter-data-returned-by-.parse_chapter_data()-is-missing-the-division-title.-perhaps-you-can-use-the-original-chapter-data"}
										T : '原先的章节资料设定了分部标题，但 .parse_chapter_data() 传回的章节资料缺少了分部标题。或许您可以沿用原先的章节资料。'
									});
							// e.g.,
							if (false) {
								chapter_data = Object.assign(
										work_data.chapter_list[chapter_NO - 1],
										chapter_data);
							}
						}
					}
				}
				// TODO: 自动填补 chapter_data.url。

				if (typeof _this.pre_get_images === 'function') {
					_this.pre_get_images(XMLHttp, work_data, chapter_data,
					// pre_get_images:function(XMLHttp,work_data,chapter_data,callback){;callback();},
					function() {
						process_images(chapter_data, XMLHttp);
					});
				} else {
					process_images(chapter_data, XMLHttp);
				}
			}

			function pre_parse_chapter_data(XMLHttp, error) {
				// 可能是从 library_namespace.get_URL_cache() 过来的。
				if (XMLHttp && XMLHttp.responseURL) {
					_this.last_fetch_time = Date.now();
				}

				// 对于每一张图片都得要从载入的页面获得资讯的情况，可以参考 hhcool.js, dm5.js。

				if (typeof _this.pre_parse_chapter_data === 'function') {
					// 执行在解析章节资料 process_chapter_data() 之前的作业 (async)。
					// 必须自行保证执行 callback()，不丢出异常、中断。
					_this.pre_parse_chapter_data(XMLHttp, work_data,
					// pre_parse_chapter_data:function(XMLHttp,work_data,callback,chapter_NO){;callback();},
					function(new_XMLHttp, new_error) {
						if (new_XMLHttp) {
							// XMLHttp: 经过 this.pre_parse_chapter_data() 取得了新资源。
							process_chapter_data(new_XMLHttp, new_error);
						} else {
							// 没新资源，直接使用旧的。
							process_chapter_data(XMLHttp, error);
						}
					}, chapter_NO);
				} else {
					process_chapter_data(XMLHttp, error);
				}
			}

			function reget_chapter_data() {
				if (false && typeof chapter_URL !== 'string') {
					console.log(chapter_URL);
				}
				if (_this.skip_get_chapter_page) {
					pre_parse_chapter_data(crawler_namespace.null_XMLHttp);
					return;
				}
				// library_namespace.info('reget_chapter_data: ' + chapter_URL);
				if (Array.isArray(chapter_URL)) {
					chapter_URL[2] = Object.assign({
						error_retry : _this.MAX_ERROR_RETRY
					}, chapter_URL[2]);
				} else {
					chapter_URL = [ chapter_URL, null, true ];
				}

				_this.get_URL(chapter_URL, pre_parse_chapter_data);
			}

			if (work_data.reget_chapter) {
				reget_chapter_data();

			} else {
				// 警告: reget_chapter=false 仅适用于小说之类不下载/获取图片的情形，
				// 因为若有图片（parse_chapter_data()会回传chapter_data.image_list），将把chapter_page写入仅能从chapter_URL获取名称的于目录中。
				library_namespace.get_URL_cache(chapter_URL, function(data,
						error, XMLHttp) {
					pre_parse_chapter_data({
						buffer : data,
						responseText : data && data.toString(_this.charset),
						responseURL : XMLHttp && XMLHttp.responseURL
					});
				}, {
					file_name : chapter_file_name,
					encoding : undefined,
					charset : _this.charset,
					get_URL_options : _this.get_URL_options
				});
			}
		}
		get_data();

		// image_data: latest_image_data
		function check_if_done(image_data, status) {
			if (_this.write_image_metadata
			// 将每张图片的资讯写入同名(添加.json延伸档名)的JSON档。
			&& library_namespace.file_exists(image_data.file)) {
				var chapter_data = Array.isArray(work_data.chapter_list)
						&& work_data.chapter_list[chapter_NO - 1],
				//
				metadata = Object.assign(Object.create(null), work_data,
						chapter_data, image_data);
				delete metadata.chapter_list;
				library_namespace.write_file(image_data.file + '.json',
						metadata);
			}

			--left;

			if (typeof _this.after_get_image === 'function') {
				// 每张图片下载结束都会执行一次。图片预处理请用 .image_preprocessor()
				// var latest_image_data = image_list[image_list.index];
				// using: image_data
				_this.after_get_image(image_list, work_data, chapter_NO);
			}

			// this.dynamical_count_images: 设定动态改变章节中的图片数量。
			// Dynamically change the number of pictures in the chapter.
			// 只有在 this.one_by_one===true 时才会设定 image_list.index，
			// 因此只在设定了.one_by_one 的时候才有作用，否则就算改变 image_list 也已经来不及处理。
			if (_this.one_by_one && _this.dynamical_count_images) {
				left = image_list.length - image_list.index - 1;
			} else if (Array.isArray(image_list) && image_list.length > 1) {
				if (library_namespace.is_debug(3)) {
					library_namespace.debug([ chapter_label + ': ', {
						// gettext_config:{"id":"$1-image(s)-left"}
						T : [ '剩 %1 张{{PLURAL:%1|图}}...', left ]
					} ], 3, 'check_if_done');
				} else {
					library_namespace.log_temporary({
						// gettext_config:{"id":"$1-image(s)-left"}
						T : [ '剩 %1 张{{PLURAL:%1|图}}...', left ]
					});
				}
			}
			// console.log('check_if_done: left: ' + left);

			// 须注意若是最后一张图 get_image()直接 return 了，
			// 此时尚未设定 waiting，因此此处不可以 waiting 判断！
			if (left > 0) {
				// 还有/等待尚未下载/获取的图片档案。
				if (waiting && left < 2) {
					library_namespace.debug([ {
						// gettext_config:{"id":"waiting-for-the-image-file-that-has-not-been-downloaded-yet"}
						T : '等待尚未下载完成的图片档案：'
					}, '\n' + image_list.filter(function(image_data) {
						return !image_data.done;
					}).map(function(image_data) {
						return image_data.url + '\n→ ' + image_data.file;
					}) ]);
				}
				return;
			}
			// assert: left===0

			// 已下载完本 chapter。

			// 纪录最后下载的章节计数。
			work_data.last_download.chapter = work_data.start_chapter_NO_next_time >= 0
			// `work_data.start_chapter_NO_next_time` 为本次执行时设定的 chapter_NO。
			// cf. work_data.jump_to_chapter
			? work_data.start_chapter_NO_next_time : chapter_NO;

			// 欲限制/指定下次下载的 chapter_NO，可使用
			// work_data.chapter_list.truncate(chapter_NO);

			// 记录下载错误的档案。
			// TODO: add timestamp, work/chapter/NO, {Array}error code
			// TODO: 若错误次数少于限度，则从头撷取work。
			if (_this.error_log_file && Array.isArray(image_list)) {
				var error_file_logs = [],
				// timestamp_prefix
				log_prefix = (new Date).format('%4Y%2m%2d') + '	';
				image_list.forEach(function(image_data, index) {
					if (image_data.has_error) {
						// 记录下载错误的档案数量。
						work_data.error_images++;
						error_file_logs.push(log_prefix + image_data.file + '	'
								+ image_data.parsed_url);
					}
				});

				if (error_file_logs.length > 0) {
					error_file_logs.push('');
					var log_directory = _this.main_directory
							+ _this.log_directory_name,
					//
					error_log_file = log_directory + _this.error_log_file,
					//
					error_log_file_backup = _this.error_log_file_backup
							&& log_directory + _this.error_log_file_backup;
					library_namespace.create_directory(
					// 先创建记录用目录。
					log_directory);
					if (_this.recheck && error_log_file_backup
					//
					&& library_namespace.file_exists(error_log_file_backup)) {
						// 当从头开始检查时，重新设定错误记录档案。
						library_namespace.move_file(error_log_file,
								error_log_file_backup);
						// 移动完之后注销档案名称以防被覆写。
						_this.error_log_file_backup = null;
					}
					node_fs.appendFileSync(error_log_file,
					// 产生错误纪录档。
					error_file_logs.join(library_namespace.env.line_separator));
					crawler_namespace.set_work_status(work_data, gettext(
					// gettext_config:{"id":"$1-$2-image-download-error-recorded"}
					'%1：%2笔{{PLURAL:%2|图片}}下载错误纪录', chapter_label,
							error_file_logs.length));
				}
			}

			if (_this.archive_images && images_archive
			//
			&& Array.isArray(image_list)
			// 完全没有出现错误才压缩图片档案。
			&& (!_this.archive_all_good_images_only
			//
			|| !image_list.some(function(image_data) {
				return image_data.has_error;
			}))) {
				if (images_archive.to_remove.length > 0) {
					library_namespace.log_temporary({
						T : [
						// gettext_config:{"id":"remove-$1-damaged-images-from-the-image-compression-file-that-successfully-downloaded-this-time-$2"}
						'从图片压缩档删除%1张本次下载成功、上次下载失败的损坏图片：%2',
						//
						images_archive.to_remove.length,
						// images_archive.archive_file_path
						images_archive.file_name ]
					});
					images_archive.remove(images_archive.to_remove.unique());
				}

				var chapter_files = library_namespace
						.read_directory(chapter_directory);
				if (!chapter_files) {
					// e.g., 未设定 this.preserve_chapter_page
				} else if (chapter_files.length === 0
						|| chapter_files.length === 1
						&& chapter_files[0] === chapter_page_file_name) {
					// 只剩下 chapter_page 的时候不再 update，避免磁碟作无用读取。
					if (chapter_files.length === 1) {
						library_namespace.remove_file(chapter_directory
								+ chapter_page_file_name);
					}
					library_namespace.remove_directory(chapter_directory);
				} else {
					library_namespace.log_temporary({
						// create/update image archive: 漫画下载完毕后压缩图片档案。
						T : [ images_archive.file_existed
						// gettext_config:{"id":"update-image-archive-$1"}
						? '更新图片压缩档：%1'
						// gettext_config:{"id":"create-image-archive-$1"}
						: '创建图片压缩档：%1',
						// images_archive.archive_file_path
						images_archive.file_name ]
					});
					images_archive.update(chapter_directory, {
						// 压缩图片档案之后，删掉原先的图片档案。
						remove : _this.remove_images_after_archive,
						recurse : true
					});
					// 纪录最后下载的图片压缩档时间。
					work_data.last_file_modified_date = new Date;
				}

				if (_this.write_chapter_metadata && library_namespace
				// 将每个章节压缩档的资讯写入同名(添加.json延伸档名)的JSON档。
				.file_exists(images_archive.archive_file_path)) {
					var chapter_data = Array.isArray(work_data.chapter_list)
							&& work_data.chapter_list[chapter_NO - 1],
					//
					metadata = Object.assign(Object.create(null), work_data,
							chapter_data);
					delete metadata.chapter_list;
					library_namespace.write_file(
							images_archive.archive_file_path + '.json',
							metadata);
				}
			}

			continue_next_chapter.call(_this, work_data, chapter_NO, callback);
		}
	}

	// @inner
	function continue_next_chapter(work_data, chapter_NO, callback) {
		// 这边不纪录最后下载的章节数 work_data.last_download.chapter。
		// 因为可能是 crawler_namespace.pre_get_chapter_data() 筛选排除之后直接被呼叫的。
		// 假如是因筛选排除的，可能有些章节没有下载到，因此下一次下载的时候应该重新检查。

		// 纪录最后成功下载章节或者图片日期。
		work_data.last_saved = (new Date).toISOString();
		// 纪录已下载完之 chapter。
		this.save_work_data(work_data, 'continue_next_chapter');

		if (typeof this.after_download_chapter === 'function') {
			this.after_download_chapter(work_data, chapter_NO);
		}

		// 增加章节计数，准备下载下一个章节。
		chapter_NO = crawler_namespace.get_next_chapter_NO_item(work_data,
				chapter_NO + 1);

		// 欲直接跳过本作品，可设定：
		// <code>work_data.jump_to_chapter = work_data.chapter_count + 1;</code>
		if (work_data.jump_to_chapter >= 0) {
			// cf. work_data.start_chapter_NO_next_time
			if (work_data.jump_to_chapter !== chapter_NO) {
				// work_data.jump_to_chapter 可用来手动设定下一个要获取的章节号码。
				// 一次性的设定跳到指定的章节。
				library_namespace.info({
					// gettext_config:{"id":"$2-jump-to-chapter-$1"}
					T : [ '%2: jump to chapter %1',
							work_data.jump_to_chapter + ' ← ' + chapter_NO,
							work_data.title ]
				});
				chapter_NO = work_data.jump_to_chapter;
			}
			delete work_data.jump_to_chapter;
		}

		if (chapter_NO > work_data.chapter_count) {
			if (Array.isArray(work_data.chapter_list)
					&& work_data.chapter_list.length === work_data.chapter_count + 1) {
				library_namespace.warn(
				// gettext_config:{"id":"if-you-want-to-dynamically-add-chapters-you-must-manually-increase-the-number-of-chapters-work_data.chapter_count++"}
				'若欲动态增加章节，必须手动增加章节数量: work_data.chapter_count++！');
			}

			library_namespace.log([ this.id + ': ' + work_data.directory_name
			// 增加章节数量的讯息。
			+ ': ' + (Array.isArray(work_data.download_chapter_NO_list)
			//
			? work_data.download_chapter_NO_list.length + '/' : '')
			//
			+ work_data.chapter_count
			//
			+ ' ' + (work_data.chapter_unit || this.chapter_unit),
			// 增加字数统计的讯息。
			work_data.words_so_far > 0 ? {
				// gettext_config:{"id":"(this-download-has-processed-a-total-of-$1-word)"}
				T : [ '（本次下载共处理 %1个{{PLURAL:%1|字}}）', work_data.words_so_far ]
			} : '',
			// 增加漫画图片数量的统计讯息。
			work_data.image_count > 0 ? {
				// gettext_config:{"id":"(this-download-has-processed-a-total-of-$1-image)"}
				T : [ '（本次下载共处理 %1张{{PLURAL:%1|图}}）', work_data.image_count ]
			} : '', {
				// gettext_config:{"id":"download-completed-for-$1"}
				T : [ '于 %1 下载完毕。',
				//
				(new Date).format('%Y/%m/%d %H:%M:%S') ]
			}, work_data.some_limited ? {
				// gettext_config:{"id":"some-are-paid-restricted-chapters"}
				T : '有些为付费/受限章节。'
			} : '' ]);
			if (work_data.error_images > 0) {
				library_namespace.error([ this.id + ': ', {
					// gettext_config:{"id":"$1-this-download-has-a-total-of-$2-image-download-errors"}
					T : [ '%1：本次下载作业，本作品共 %2张{{PLURAL:%2|图片}}下载错误。',
					//
					work_data.directory_name, work_data.error_images ]
				} ]);
			}
			if (typeof callback === 'function') {
				callback(work_data);
			}

		} else {
			// 为了预防太多堆叠，因此使用 setImmediate()。
			setImmediate(crawler_namespace.pre_get_chapter_data.bind(this,
					work_data, chapter_NO, callback));
		}
	}

	// --------------------------------------------------------------------------------------------

	var PATTERN_AD_cfwx
	/**
	 * <code>

	// xshuyaya.js
	http://www.shuyy8.com/read/1242/1276110.html
	<br /><br />&nbsp;&nbsp;&nbsp;&nbsp;看最仙游最新章节到长风文学
	http://www.shuyy8.com/read/1242/1276134.html
	<br /><br />&nbsp;&nbsp;&nbsp;&nbsp;｜长｜风｜文学 [c][f][w][x].net<br /><br />&nbsp;&nbsp;&nbsp;&nbsp;
	http://www.shuyy8.com/read/1242/1276125.html
	抓起手边血曜石就跑，**长**风**文学 女子吐口献血，
	http://www.shuyy8.com/read/1242/1276140.html
	而这两百人—长—风—文学 {c}{f}{w}{x}.net中，
	http://www.shuyy8.com/read/1242/1276147.html
	你们两位牛鼻子就;长;风;文学 cf＋在这里歇息片刻，
	http://www.shuyy8.com/read/1242/1276151.html
	我刚才长风文学<br /><br />&nbsp;&nbsp;&nbsp;&nbsp;<br /><br />&nbsp;&nbsp;&nbsp;&nbsp;摸了什么……
	http://www.shuyy8.com/read/1242/1276152.html
	你需。长.风。文学 要做几件事。
	http://www.shuyy8.com/read/1242/1276155.html
	这？长？风？文学 cfwx. net才是林烦最大的优点。
	http://www.shuyy8.com/read/1242/1276163.html
	离开了木屋，—长—风—文学 {c}{f}{w}{x}.net回到迷雾之中。
	http://www.shuyy8.com/read/1242/1276167.html
	竹剑堂御剑一%长%风%文学　百单八口，
	http://www.shuyy8.com/read/1242/1276168.html
	三三＊长＊风＊文学 真人反问：
	http://www.shuyy8.com/read/1242/1276179.html
	我就先打《长〈风《文学　死你，
	http://www.shuyy8.com/read/1242/1276184.html
	入紫箫／长／风／文学 殿者，
	http://www.shuyy8.com/read/1242/1276237.html
	来此地［长][风］文学 斩妖除魔。
	http://www.shuyy8.com/read/1242/1276191.html
	五人｛长}{风｝文学 www{cf][wx}net用了隐身术从云端落下，
	http://www.shuyy8.com/read/1242/1276131.html
	没｀长｀风｀文学｀有神通，
	http://www.shuyy8.com/read/1242/1276134.html
	所以属于前者。”<br /><br />&nbsp;&nbsp;&nbsp;&nbsp;｜长｜风｜文学 [c][f][w][x].net<br /><br />&nbsp;&nbsp;&nbsp;&nbsp;“另外一种最厉害，
	http://www.shuyy8.com/read/1242/1276143.html
	在供奉们的要求之下&lt;长&gt;&lt;风&gt;文学 ，
	http://www.shuyy8.com/read/1242/1276156.html
	你和他单对单的话＝长＝风＝文学＝www＝cfwx＝net？

	// piaotian.js
	https://www.ptwxz.com/html/6/6682/3908558.html
	<br /><br />&nbsp;&nbsp;&nbsp;&nbsp;!长!风!文学“来了。”天恒旗杀毒虫效率高，
	https://www.ptwxz.com/html/6/6682/3976684.html
	斜风子不能出现在十面埋～≯长～≯风～≯文～≯学，w⊥↓＋et伏中，
	https://www.ptwxz.com/html/6/6682/4007822.html
	不能怪6长6风6文6学，w↘□□et她，

	</code>
	 */
	= /([\u0020-\u00ff—＋＝。？＊《〈｛｝［］／｜｀～≯]*)长[\u0020-\u00ff—＋＝。？＊《〈｛｝［］／｜｀～≯]{0,20}风[\u0020-\u00ff—＋＝。？＊《〈｛｝［］／｜｀～≯]{0,20}文[\u0020-\u00ff—＋＝。？＊《〈｛｝［］／｜｀～≯]{0,20}学(?:，[\u0020-\u00ff—＋＝　⊥↓↘□]+?et|｀?[\u0020-\u00ff—＋＝　]*)/g;

	/**
	 * 去除广告。 Calling inside parse_chapter_data()
	 * 
	 * @example<code>
	text = CeL.work_crawler.fix_general_ADs(text);
	</code>
	 */
	function fix_general_ADs(text) {
		text = text.replace(
				/(?:<br[^<>]*>)*(?:&nbsp;)*看[^\s\n<>]+?最新章节到[^\s\n<>]+?文学\s*/,
				'');

		text = text.replace(PATTERN_AD_cfwx, function(all, previous) {
			// 必须保留前面的换行。 e.g., http://www.shuyy8.com/read/1242/1276134.html
			var matched = previous.match(/[\s\S]+&nbsp;/);
			return matched ? matched[0] : '';
		});
		if (false) {
			// 长风文学网 http://www.cfwx.org/
			text = text.replace(/(..)长\1风\1文\1?学\s*/g, '').replace(
					/(.)长\1风\1文\1?学\s*/g, '');
		}

		// e.g.,
		// xshuyaya.js
		// http://www.shuyyw.com/read/24334/16566634.html
		// piaotian.js
		// https://www.ptwxz.com/html/14/14466/10115811.html
		// 女主从书里跑出来了怎么办 第四百三十三章 复更
		text = text.replace(/\.asxs\./g, '起点');

		return text;
	}

	Work_crawler.fix_general_ADs = fix_general_ADs;

	// --------------------------------------------------------------------------------------------

	// export 导出.

	// @inner
	Object.assign(crawler_namespace, {
		get_next_chapter_NO_item : get_next_chapter_NO_item,

		pre_get_chapter_data : pre_get_chapter_data
	});

	// @instance
	Object.assign(Work_crawler.prototype, {
		// 检查磁碟上面是否真的有已经下载的漫画档案。
		// .check_downloaded_chapters() 必须先确保已获得最终之 chapter_data.title。
		check_downloaded_chapters : check_downloaded_chapters,
		// 应该改成.check_downloaded_chapters()，检查磁碟上面是否真的有已经下载的档案。
		// check_downloaded_chapter_url : check_downloaded_chapter_url,

		// tools of this.get_chapter_list()
		set_part : set_part_title,
		add_chapter : add_chapter_data,
		reverse_chapter_list_order : reverse_chapter_list_order,
		set_start_chapter_NO_next_time : set_start_chapter_NO_next_time,
		set_chapter_NO_via_title : set_chapter_NO_via_title,
		get_chapter_directory_name : get_chapter_directory_name,

		// retry delay. cf. .one_by_one
		// {Natural|String|Function}当网站不允许太过频繁的访问读取/access时，可以设定下载章节资讯/章节内容前的等待时间。
		// chapter_time_interval : '1s',
		get_chapter_time_interval : get_chapter_time_interval
	});

	// 不设定(hook)本 module 之 namespace，仅执行 module code。
	return library_namespace.env.not_to_extend_keyword;
}
