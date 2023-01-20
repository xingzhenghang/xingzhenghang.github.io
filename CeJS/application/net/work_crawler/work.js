/**
 * @name WWW work crawler sub-functions
 * 
 * @fileoverview WWW work crawler functions: part of work
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
		name : 'application.net.work_crawler.work',

		require : 'application.net.work_crawler.'
		// library_namespace.extract_literals()
		+ '|data.code.' + '|data.Number_range_set.',

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

	// latest_chapter
	var work_data_display_fields
	// gettext_config:{"id":"work_data.title","mark_type":"combination_message_id"}
	// gettext_config:{"id":"work_data.id","mark_type":"combination_message_id"}
	// gettext_config:{"id":"work_data.author","mark_type":"combination_message_id"}
	// gettext_config:{"id":"work_data.status","mark_type":"combination_message_id"}
	// gettext_config:{"id":"work_data.chapter_count","mark_type":"combination_message_id"}
	// gettext_config:{"id":"work_data.last_update","mark_type":"combination_message_id"}
	// gettext_config:{"id":"work_data.last_download.date","mark_type":"combination_message_id"}
	// gettext_config:{"id":"work_data.last_download.chapter","mark_type":"combination_message_id"}
	// gettext_config:{"id":"work_data.url","mark_type":"combination_message_id"}
	// gettext_config:{"id":"work_data.directory","mark_type":"combination_message_id"}
	// gettext_config:{"id":"work_data.description","mark_type":"combination_message_id"}
	// gettext_config:{"id":"work_data.chapter_list","mark_type":"combination_message_id"}
	// gettext_config:{"id":"work_status-not-found","mark_type":"combination_message_id"}
	// gettext_config:{"id":"work_status-limited","mark_type":"combination_message_id"}
	// gettext_config:{"id":"work_status-finished","mark_type":"combination_message_id"}
	= 'title,id,author,status,chapter_count,last_update,last_download.date,last_download.chapter,tags,url,directory'
			.split(',');
	show_work_data.prefix = 'work_data.';

	// 在 CLI 命令列介面显示作品资讯。
	function show_work_data(work_data, options) {
		// console.log(work_data);
		var display_fields = options && options.display_fields
				|| work_data_display_fields;
		var display_list = [];
		display_fields.forEach(function(field_name) {
			var value = library_namespace
			//
			.value_of(field_name, null, work_data);
			if (value || value === 0)
				display_list.push([
						gettext(show_work_data.prefix + field_name) + '  ',
						value ]);
		});

		library_namespace.log('-'.repeat(70) + '\n');
		library_namespace.info({
			// gettext_config:{"id":"work-information"}
			T : 'Work information:'
		});

		library_namespace.log(library_namespace.display_align(display_list, {
			from_start : true
		}) + '\n');

		library_namespace.info({
			T : show_work_data.prefix + 'description'
		});
		// 概要 synopsis
		library_namespace.log(library_namespace.value_of('description', null,
				work_data)
				+ '\n');

		var chapter_list = Array.isArray(work_data.chapter_list)
				&& work_data.chapter_list;
		if (chapter_list) {
			library_namespace.info(gettext(show_work_data.prefix
					+ 'chapter_list'));
			// gettext_config:{"id":"work_data.chapter_no"}
			display_list = [ [ gettext('work_data.chapter_NO') + '  ',
			// gettext_config:{"id":"work_data.chapter_title"}
			gettext('work_data.chapter_title') ] ];
			// console.log(chapter_list[0]);
			chapter_list.forEach(function(chapter_data, index) {
				var data;
				if (library_namespace.is_Object(chapter_data)) {
					data = chapter_data.title || chapter_data.url;
					if (chapter_data.limited)
						data += ' (' + gettext('limited') + ')';
				} else {
					data = JSON.stringify(chapter_data);
				}
				// +1: chapter_NO starts from 1
				display_list.push([ '    ' + (index + 1) + '  ', data ]);
			});
			library_namespace.log(library_namespace.display_align(display_list)
					+ '\n');
		}

		library_namespace
				.info({
					// gettext_config:{"id":"you-may-set-start_chapter_no=chapter-number-or-start_chapter_title=chapter-title-to-decide-where-to-start-downloading"}
					T : '您可指定 "start_chapter_NO=章节编号数字" 或 "start_chapter_title=章节标题" 来选择要开始下载的章节。'
				});
		library_namespace.info({
			// gettext_config:{"id":"or-set-chapter_filter=chapter-title-to-download-specific-chapter"}
			T : '或指定 "chapter_filter=章节标题" 仅下载某个章节。'
		});
	}

	// --------------------------------------------------------------------------------------------

	function set_work_status(work_data, status) {
		if (status) {
			if (!work_data.process_status)
				work_data.process_status = [];
			work_data.process_status.push(status);
		}
		return work_data.process_status;
	}

	// 储存本次作业到现在的作品资讯到档案。 cache / save work data file
	function save_work_data_file(work_data, save_event) {
		if (!work_data.data_file)
			return;

		// 预防(work_data.directory)不存在。
		library_namespace.create_directory(work_data.directory);

		var ebook = work_data[this.KEY_EBOOK];
		// 为了预防 TypeError: Converting circular structure to JSON
		// ebook 结构中可能会有 circular。
		delete work_data[this.KEY_EBOOK];

		if (this.on_save_work_data_file)
			this.on_save_work_data_file(work_data, save_event);

		// 避免当 work_data 过大而出现崩溃的情况，造成资料档案被清空。因此先试试 JSON.stringify()。
		var data_to_write = Buffer.from(JSON.stringify(work_data));
		if (this.backup_work_data) {
			var backup_file = work_data.data_file + '.'
					+ this.backup_file_extension;
			library_namespace.remove_file(backup_file);
			library_namespace.move_fso(work_data.data_file, backup_file);
		}
		try {
			node_fs.writeFileSync(work_data.data_file, data_to_write);
		} catch (e) {
			library_namespace.error([ 'save_work_data_file: ', {
				// Cannot save work data of %1!
				// gettext_config:{"id":"cannot-save-work-data-of-«$1»"}
				T : [ '无法储存作品《%1》之资讯至档案！', work_data.title || work_data.id ]
			} ]);
			library_namespace.error(e);
		}

		// revert
		if (ebook)
			work_data[this.KEY_EBOOK] = ebook;
	}

	function extract_work_id(work_information) {
		// default: accept numerals only
		if (library_namespace.is_digits(work_information)
		// || /^[a-z_\-\d]+$/.test(work_information)
		)
			return work_information;
	}

	function extract_work_id_from_URL(work_information) {
		if (typeof work_information !== 'string'
				|| !/^https?:\/\//.test(work_information)) {
			// 非网址，直接跳出。
			return;
		}

		var PATTERN_work_id_of_url = this.PATTERN_work_id_of_url;
		if (!PATTERN_work_id_of_url) {
			// 自动依照. work_URL 创建作品的网址模式。
			PATTERN_work_id_of_url = this.full_URL(this.work_URL, 'work_id')
					.replace(/^.+?\/\//, '');
			if (PATTERN_work_id_of_url.endsWith('work_id/')) {
				// 允许不用"/"结尾。
				PATTERN_work_id_of_url = PATTERN_work_id_of_url.slice(0, -1);
			}
			PATTERN_work_id_of_url = this.PATTERN_work_id_of_url
			// assert:
			// 'work_id'===library_namespace.to_RegExp_pattern('work_id')
			= new RegExp(library_namespace.to_RegExp_pattern(
					PATTERN_work_id_of_url).replace('work_id', '([^\/]+)'));
			library_namespace.info([ 'extract_work_id_from_URL: ', {
				// gettext_config:{"id":"create-and-use-the-work-url-regexp-$1"}
				T : [ '创建并使用作品网址 RegExp：%1', String(PATTERN_work_id_of_url) ]
			} ]);
		}

		var matched = work_information.match(PATTERN_work_id_of_url);
		if (matched) {
			matched = matched[1];
			library_namespace.info([ 'extract_work_id_from_URL: ', {
				// gettext_config:{"id":"extract-work-id-from-the-work-url-$1"}
				T : [ '自作品网址提取出 work id：%1', matched ]
			} ]);
			return /* this.extract_work_id(matched) && */matched;
		}

		library_namespace.warn([ 'extract_work_id_from_URL: ', {
			// gettext_config:{"id":"unable-to-extract-work-id-from-the-work-url!-work-information-$1"}
			T : [ '无法自作品网址提取出 work id！作品资讯：%1', work_information ]
		} ]);
	}

	function get_work(work_title, callback) {
		this.running = true;
		var _this = this;

		if (this.must_browse_first && !this.had_browsed) {
			// e.g., novel.cmn-Hans-CN/biqugse.js 用以设定 cookie。
			this.get_URL(this.base_URL, function(XMLHttp, error) {
				this.had_browsed = Date.now();
				if (typeof this.must_browse_first === 'number'
						&& this.must_browse_first >= 0) {
					setTimeout(get_work.bind(_this, work_title, callback),
							this.must_browse_first);
				} else {
					get_work.call(_this, work_title, callback);
				}
			});
			return;
		}

		// 执行顺序: finish() → finish_up()
		// 若在this.finish_up()中处理work_data，则必须执行`this.save_work_data(work_data)`才能保存变更过的work_data。
		function finish_up(work_data) {
			if (work_data && work_data.title) {
				// 最后纪录。
				_this.save_work_data(work_data, 'finish_up');
				if (_this.need_create_ebook
				// 未找到时没有 work_data。
				&& work_data.chapter_count >= 1) {
					_this.pack_ebook(work_data);
				}
				if (false && _this.need_create_ebook && !_this.preserve_cache) {
					// 注意: 若是删除 ebook 目录，也会把 media 资源档删掉。
					// 因此只能删除造出来的 HTML 网页档案。
					library_namespace.fs_remove(
					// @see CeL.application.storage.EPUB
					work_data[this.KEY_EBOOK].path.root, true);
				}

			} else if (work_data && work_data.titles) {
				crawler_namespace.set_work_status(work_data,
				// @see `approximate_title`
				// gettext_config:{"id":"found-$1-works-$2"}
				gettext('找到%1个作品：%2', work_data.titles.length, work_data.titles
						.map(function(item) {
							return item[0] + ':' + item[1];
						}).join('; ')));
			} else {
				var status = work_data;
				work_data = Object.create(null);
				crawler_namespace.set_work_status(work_data, status
						&& typeof status === 'string' ? status : 'not found');
			}

			if (typeof _this.finish_up === 'function') {
				try {
					_this.finish_up(work_data);
				} catch (e) {
					// TODO: handle exception
				}
				// _this.save_work_data(work_data);
			}
			// console.log('' + callback);
			typeof callback === 'function' && callback.call(_this, work_data);
			_this.running = false;
		}
		if (callback && callback.options) {
			// e.g., for .get_data_only
			finish_up.options = callback.options;
		}

		// --------------------------------------

		var work_id = work_title.match(/^(title|id):(.+)$/);
		if (work_id) {
			// 明确指定为作品ID或作品标题。
			if (work_id[1] === 'id') {
				// work_title = '';
				work_id = work_id[2];
			} else {
				work_title = work_id[2];
				work_id = null;
			}

		} else {
			// 未明确指定输入的类别。先试试看能否判断出 work id。
			work_id = this.extract_work_id(work_title);

			if (!work_id
					&& (work_id = this.extract_work_id_from_URL(work_title))) {
				work_id = {
					input_url : work_title,
					id : work_id
				};
			}
		}

		if (work_id) {
			if (work_id === true) {
				library_namespace.warn([ 'get_work: ', {
					// gettext_config:{"id":"crawler.extract_work_id()-should-not-return-true!-please-modify-the-program-code"}
					T : 'crawler.extract_work_id() 不应回传 true！请修改工具档程式码！'
				} ]);
			}
			this.get_work_data(work_id, finish_up);
			return;
		}

		// --------------------------------------

		function finish(no_cache) {
			if (!no_cache) {
				// write cache
				library_namespace.write_file(search_result_file, search_result);
			}
			search_result = search_result[work_title];
			var search_result_id = _this.id_of_search_result;
			if (search_result_id) {
				// console.log([ search_result_id, search_result ]);
				search_result = typeof search_result_id === 'function' ? _this
						.id_of_search_result(search_result)
						: search_result ? search_result[search_result_id]
								: search_result;
			}
			_this.get_work_data({
				id : search_result,
				title : work_title
			}, finish_up);
		}

		/** {String}记录先前搜寻作品所获得结果的快取档案。 */
		var search_result_file = this.get_search_result_file(),
		// search cache
		// 检查看看之前是否有获取过。
		search_result = this.get_search_result() || Object.create(null);
		library_namespace.debug({
			// gettext_config:{"id":"cache-file-of-previous-search-for-works-$1"}
			T : [ 'Cache file of previous search for works: %1',
					search_result_file ]
		}, 2, 'get_work');
		// console.log(search_result);

		// assert: work_title前后不应包含space
		work_title = work_title.trim();
		// 重新搜寻 re-search, to search again, search once more, repeat a search
		if (this.search_again) {
			library_namespace.log([ this.id + ': ', {
				// gettext_config:{"id":"re-searching-title-$1"}
				T : [ '重新搜寻作品《%1》', work_title ]
			} ]);
		} else if (search_result[work_title]) {
			// 已经搜寻过此作品标题。
			library_namespace.log([ this.id + ': ', {
				// gettext_config:{"id":"cached-work-id-will-no-longer-search-again-$1"}
				T : [ '已快取作品 id，不再重新搜寻：%1',
				//
				work_title + '→' + JSON.stringify(search_result[work_title]) ]
			} ]);
			finish(true);
			return;
		}

		var search_url_data = this.search_URL, search_URL_string, post_data, get_URL_options;
		if (!search_url_data || typeof this.parse_search_result !== 'function') {
			if (callback && callback.options) {
				// e.g., for .get_data_only
				// gettext_config:{"id":"the-search-function-is-not-available-for-$1-web-site"}
				finish_up(gettext('本网路作品网站 %1 的模组未提供搜寻功能。', this.id));
				return;
			}

			search_url_data = Object.create(null);
			search_url_data[work_title] = '';
			// gettext_config:{"id":"the-search-function-is-not-available-for-$1-web-site"}
			this.onerror(gettext('本网路作品网站 %1 的模组未提供搜寻功能。', this.id)
			// gettext_config:{"id":"please-enter-the-work-id-first.-after-downloading-once-the-tool-will-automatically-record-the-title-and-id-conversion"}
			+ gettext('请先输入作品 id，下载过一次后工具会自动记录作品标题与 id 的转换。')
			// gettext_config:{"id":"can-also-be-set-manually-by-editing-the-id-of-«$1»-to-$2"}
			+ gettext('亦可手动设定，编辑《%1》之 id 于 %2', work_title, search_result_file)
					+ '\n (e.g., ' + JSON.stringify(search_url_data) + ')',
					work_title);
			finish(true);
			return Work_crawler.THROWED;
		}
		if (typeof search_url_data === 'function') {
			// 通过关键词搜索作品。 解析 作品名称 → 作品id
			// search_url_data = search_url_data.call(this, work_title,
			// crawler_namespace.get_label);
			// return [ search_url_data, POST data ]
			search_url_data = this.search_URL(work_title,
					crawler_namespace.get_label);
			if (Array.isArray(search_url_data)) {
				// use POST method, also see this.get_URL()
				// [ url, post_data, options ]
				post_data = search_url_data[1];
				get_URL_options = search_url_data[2];
				search_url_data = search_url_data[0];
			}
			search_url_data = this.full_URL(search_url_data);
			search_URL_string = search_url_data.URL || search_url_data;
		} else {
			// default:
			// assert: typeof search_url_data==='string'
			// || search_url_data==={URL:'',charset:''}
			// TODO: .replace(/%t/g, work_title)
			search_url_data = this.full_URL(search_url_data);
			// 对 {Object}search_url_data，不可动到 search_url_data。
			search_URL_string = (search_url_data.URL || search_url_data)
			//
			+ crawler_namespace.encode_URI_component(
			// e.g., 找不到"隔离带 2"，须找"隔离带"。
			work_title.replace(/\s+\d{1,2}$/, '')
			// e.g., "Knight's & Magic" @ 小说を読もう！ || 小说検索
			.replace(/&/g, ''), search_url_data.charset || this.charset);
		}

		// console.log(search_url_data);
		var regenerate_user_agent = this.regenerate_user_agent === true
				|| this.regenerate_user_agent === 'work';
		this.setup_agent(search_URL_string, regenerate_user_agent);
		if (regenerate_user_agent) {
			crawler_namespace.regenerate_user_agent(this);
		}

		// delay time
		var time_to_waiting = this.search_work_interval;
		if (time_to_waiting) {
			time_to_waiting = library_namespace.to_millisecond(time_to_waiting)
					- (Date.now() - this.latest_search_time);
			// console.trace([ this.search_work_interval, time_to_waiting ]);
		}

		function handler_search_response(XMLHttp) {
			if (this.search_work_interval)
				this.latest_search_time = Date.now();

			_this.setup_agent();
			if (!XMLHttp.responseText) {
				library_namespace.error([ 'get_work: ', {
					// gettext_config:{"id":"no-results-for-«$1»-(the-site-is-temporarily-unavailable-or-redesigned?)"}
					T : [ '没有《%1》的搜索结果（网站暂时不可用或改版？）', work_title ]
				} ]);
				// gettext_config:{"id":"no-search-results.-is-the-site-temporarily-unavailable-or-redesigned"}
				finish_up('没有搜索结果。网站暂时不可用或改版？');
				return;
			}
			// this.parse_search_result() returns 关键字搜寻结果:
			// [ {Array}id_list, 与id_list相对应之{Array}或{Object} ]
			// e.g., [ [id,id,...], [title,title,...] ]
			// e.g., [ [id,id,...], [data,data,...] ]
			// e.g., [ [id,id,...], {id:data,id:data,...} ]
			var id_data;
			try {
				// console.log(XMLHttp.responseText);
				// console.log(XMLHttp.buffer.toString(_this.charset));
				id_data = _this.parse_search_result(XMLHttp.responseText,
						crawler_namespace.get_label, work_title);
				if (id_data === undefined) {
					_this.onerror('get_work.parse_search_result: '
					// gettext_config:{"id":"the-work-url-resolution-function-parse_search_result-has-not-returned-the-result"}
					+ gettext('作品网址解析函数 parse_search_result 未回传结果！'),
							work_title);
					// gettext_config:{"id":"the-work-url-resolution-function-parse_search_result-has-not-returned-the-result"}
					finish_up(gettext('作品网址解析函数 parse_search_result 未回传结果！'));
					return Work_crawler.THROWED;
				}
				if (!id_data) {
					_this.onerror('get_work.parse_search_result: '
					// gettext_config:{"id":"the-work-url-resolution-function-parse_search_result-did-not-return-the-regular-result"}
					+ gettext('作品网址解析函数 parse_search_result 未回传正规结果！'),
							work_title);
					finish_up(gettext(
					//		
					// gettext_config:{"id":"the-work-url-resolution-function-parse_search_result-did-not-return-the-regular-result"}
					'作品网址解析函数 parse_search_result 未回传正规结果！'));
					return Work_crawler.THROWED;
				}
			} catch (e) {
				if (e)
					console.trace(e);
				library_namespace.error([ 'get_work.parse_search_result: ', {
					// gettext_config:{"id":"unable-to-parse-the-result-of-searching-for-«$1»"}
					T : [ '无法解析搜寻作品《%1》之结果！', work_title ]
				} ]);
				// gettext_config:{"id":"unable-to-parse-the-results-of-the-search-for-works"}
				finish_up('无法解析搜寻作品之结果！');
				return;
			}
			// e.g., {id:data,id:data,...}
			if (library_namespace.is_Object(id_data)) {
				id_data = [ Object.keys(id_data), id_data ];
			}
			// {Array}id_list = [id,id,...]
			var id_list = id_data[0] || [];
			// console.log(id_data);
			id_data = id_data[1];
			if (id_list.length !== 1) {
				library_namespace.warn({
					// gettext_config:{"id":"searching-«$1»-and-found-$2-work(s)-$3"}
					T : [ '搜寻《%1》找到 %2个{{PLURAL:%2|作品}}：%3', work_title,
							id_list.length, JSON.stringify(id_data) ]
				});
			}

			// 近似的标题。
			var approximate_title = [];
			if (id_list.every(function(id, index) {
				// console.log(id);
				var title;
				if (library_namespace.is_Object(id)) {
					title = id;
				} else if (Array.isArray(id_data)
						&& (id_list.length === id_data.length || isNaN(id))) {
					title = id_data[index];
				} else {
					title = id_data[id] || id_data[index];
				}

				var search_result_id = _this.title_of_search_result;
				if (search_result_id) {
					title = typeof search_result_id === 'function' ? _this
							.title_of_search_result(title)
							: title ? title[search_result_id] : title;
				}
				title = title.trim();
				// console.log([ 'compare', title, work_title ]);
				// 找看看是否有完全相同的title。
				if (title !== work_title) {
					if (title.includes(work_title) || title.replace(/\s/g, '')
					//
					=== work_title.replace(/\s/g, '')) {
						approximate_title.push([ id, title ]);
					}
					return true;
				}
				id_list = id;
			})) {
				if (approximate_title.length !== 1) {
					var message = [ approximate_title.length === 0
					// failed: not only one
					// gettext_config:{"id":"no-matches-were-found-for-«$1»"}
					? '未搜寻到与《%1》相符者。'
					// gettext_config:{"id":"found-$2-matches-with-«$1»"}
					: '找到%2个与《%1》相符者。', work_title, approximate_title.length ];
					library_namespace.error([ _this.id + ': ', {
						T : message
					}, approximate_title.length === 0
					// is_latin
					&& /^[\x20-\x7e]+$/.test(work_title) ? {
						T :
						// gettext_config:{"id":"if-you-entered-the-work-id-please-infrom-the-tool-by-setting-extract_work_id()-to-avoid-misidentifying-of-work-id-as-work-title"}
						'若您输入的是 work id，请回报议题让下载工具设定 extract_work_id()，以免将 work id 误判为 work title。'
					} : '' ]);
					message = gettext.apply(null, message);
					_this.onwarning(message, work_title);
					finish_up(approximate_title.length > 0 && {
						titles : approximate_title
					});
					return;
				}
				approximate_title = approximate_title[0];
				library_namespace.warn(library_namespace.display_align([
				// gettext_config:{"id":"using-title"}
				[ gettext('Using title:'), work_title ],
						[ '→', approximate_title[1] ] ]));
				work_title = approximate_title[1];
				id_list = approximate_title[0];
			}

			// 已确认仅找到唯一id。
			id_data = id_data[id_list];
			search_result[work_title] = typeof id_data === 'object'
			// {Array}或{Object}
			? id_data : id_list;
			if (typeof _this.post_get_work_id === 'function') {
				// post_get_work_id :
				// function(callback, work_title, search_result) {}
				_this.post_get_work_id(finish, work_title, search_result);
			} else {
				finish();
			}

		}

		function get_search_result() {
			// console.trace([ search_URL_string, search_url_data, post_data ]);
			_this.get_URL(search_URL_string, handler_search_response,
			//
			post_data, Object.assign({
				error_retry : _this.MAX_ERROR_RETRY
			}, get_URL_options), search_url_data.charset);
		}

		if (time_to_waiting > 0) {
			library_namespace.log_temporary({
				// gettext_config:{"id":"waiting-$1"}
				T : [ 'Waiting %1...',
						library_namespace.age_of(0, time_to_waiting, {
							digits : 1
						}) ]
			});
			setTimeout(get_search_result, time_to_waiting);
		} else {
			get_search_result();
		}
	}

	function extract_work_data(work_data, html, PATTERN_work_data, overwrite) {
		if (!PATTERN_work_data) {
			PATTERN_work_data =
			// 由 meta data 解析出作品资讯。 e.g.,
			// <meta property="og:title" content="《作品》" />
			// <meta property="og:novel:author" content="作者" />
			// <meta name="Keywords" content="~" />
			// <meta property="og:site_name" name="application-name"
			// content="卡提诺论坛"/>

			// qiman5.js: <meta itemprop="actor" property="og:author"
			// content="阅文漫画" />

			// matched: [ all tag, key, value ]
			/<meta\s+[^<>]*?(?:property|name)=["'](?:[^<>"']+:)?([^<>"':]+)["']\s[^<>]*?content=["']([^<>"']+)/g;
			html = html.between(null, '</head>') || html;
		}

		var matched;
		// matched: [ all, key, value ]
		while (matched = PATTERN_work_data.exec(html)) {
			// delete matched.input;
			// console.log(matched);

			var key = crawler_namespace.get_label(matched[1]).replace(
					/[:：︰\s]+$/, '').trim().replace(/[\t\n]/g, ' ').replace(
					/ {3,}/g, '  ');
			// default: do not overwrite
			if (!key || !overwrite && work_data[key])
				continue;

			var value = matched[2], link = value.match(
			// 从连结的 title 获取更完整的资讯。
			/^[:：︰\s]*<a [^<>]*?title=["']([^<>"']+)["'][^<>]*>([\s\S]*?)<\/a>\s*$/
			//
			);
			if (link) {
				link[1] = crawler_namespace.get_label(link[1]);
				link[2] = crawler_namespace.get_label(link[2]);
				if (link[1].length > link[2].length) {
					value = link[1];
				}
			}
			value = crawler_namespace.get_label(value).replace(/^[:：︰\s]+/, '')
					.trim();
			if (value) {
				work_data[key] = value.replace(/[\t\n]/g, ' ').replace(
						/ {3,}/g, '  ');
			}
		}
	}

	// --------------------------------------------------------------------------------------------

	// 去掉每次可能有变化、应该即时更新的属性。
	var ignore_old_chapter_data = new Set([ 'limited', 'skip_this_chapter',
	// 'image_length', 'image_count',
	// 'images_downloaded',
	// 'part_NO', 'NO_in_part', 'chapter_NO',
	'chapter_title', 'part_title', 'image_list' ]);

	function get_work_data(work_id, callback, error_count) {
		var work_title, input_url;
		// 预防并列执行的时候出现交叉干扰。
		this.running = true;
		if (library_namespace.is_Object(work_id)) {
			input_url = work_id.input_url;
			work_title = work_id.title;
			work_id = work_id.id;
		}
		// console.trace([ work_id, work_title ]);
		// gettext_config:{"id":"download-$1-info-@-$2"}
		process.title = gettext('下载%1 - 资讯 @ %2', work_title || work_id,
				this.id);

		var _this = this,
		// this.work_URL 中不应对 work_id 采取额外处理，例如 `work_id | 0`，
		// 否则会造成 extract_work_id_from_URL 出错。
		work_URL = this.full_URL(this.work_URL, work_id), work_data;
		library_namespace.debug('work_URL: ' + work_URL, 2, 'get_work_data');
		// console.log(work_URL);

		if (this.chapter_NO_range) {
			// Reset start_chapter_NO to test all chapters
			this.start_chapter_NO = 1;
			if (!library_namespace.Number_range_set
					.is_Number_range_set(this.chapter_NO_range)) {
				this.chapter_NO_range = new library_namespace.Number_range_set(
				//
				this.chapter_NO_range, {
					max_split_size : 1e4
				});
			}
		}

		if (this.start_chapter) {
			if (library_namespace.is_digits(this.start_chapter)
			// 为正整数章节才作设定。预设第1章节。
			&& this.start_chapter >= 1
					&& this.start_chapter == (this.start_chapter | 0)) {
				// {Natural}chapter_NO
				this.start_chapter_NO = this.start_chapter | 0;
			} else {
				// 将 this.start_chapter 当作指定开始下载的章节标题。
				this.start_chapter_title = this.start_chapter.toString()
						.toLowerCase();
			}
			delete this.start_chapter;
		}

		// ----------------------------------------------------------

		function get_work_page() {
			if (_this.skip_get_work_page) {
				process_work_data(crawler_namespace.null_XMLHttp);
				return;
			}

			// TODO: work_time_interval
			var chapter_time_interval = _this.get_chapter_time_interval(
					work_URL, work_data);
			if (chapter_time_interval > 0) {
				library_namespace.log_temporary([ 'get_work_page: ', {
					// gettext_config:{"id":"wait-for-$2-and-then-acquiring-the-work-information-page-$1"}
					T : [ '等待 %2 之后取得作品资讯页面：%1', work_URL,
					//
					library_namespace.age_of(0, chapter_time_interval, {
						digits : 1
					}) ]
				} ]);
				setTimeout(function() {
					_this.get_URL(work_URL, process_work_data);
				}, chapter_time_interval);
			} else {
				_this.get_URL(work_URL, process_work_data);
			}
		}

		get_work_page();

		// ----------------------------------------------------------

		function process_work_data(XMLHttp, error) {
			// console.log(XMLHttp);
			_this.last_fetch_time = Date.now();
			var html = XMLHttp.responseText;
			if (!html && !_this.skip_get_work_page) {
				library_namespace.error({
					T : [
					// Failed to get work data of %1: %2
					// gettext_config:{"id":"unable-to-get-information-for-$1-s-$2"}
					'无法取得 %1 的作品资讯：%2', work_id,
							XMLHttp.buffer && XMLHttp.buffer.length === 0
							//
							// gettext_config:{"id":"no-content-found"}
							? gettext('取得空的内容') : String(error) ]
				});
				if (error_count === _this.MAX_ERROR_RETRY) {
					_this
					// gettext_config:{"id":"message_need_re_download"}
					.onerror(gettext('MESSAGE_NEED_RE_DOWNLOAD'), _this.id);
					typeof callback === 'function' && callback({
						title : work_title
					});
					return Work_crawler.THROWED;
				}
				error_count = (error_count | 0) + 1;
				library_namespace.log([ 'process_work_data: ', {
					// gettext_config:{"id":"retry-$1-$2"}
					T : [ 'Retry %1/%2', error_count, _this.MAX_ERROR_RETRY ]
				}, '...' ]);
				_this.get_work_data({
					// 书号
					id : work_id,
					title : work_title
				}, callback, error_count);
				return;
			}

			try {
				// 解析出作品资料/作品详情。
				work_data = _this.parse_work_data(html,
				//
				crawler_namespace.get_label,
				// parse_work_data:function(html,get_label,extract_work_data,options){}
				extract_work_data, {
					id : work_id,
					title : work_title,
					url : work_URL
				});
				// console.log(work_data);
				if (work_data === _this.REGET_PAGE) {
					// 需要重新读取页面。e.g., 502
					var chapter_time_interval = _this
							.get_chapter_time_interval(work_URL, work_data);
					library_namespace.log_temporary([ 'process_work_data: ', {
						T : [ chapter_time_interval > 0
						// gettext_config:{"id":"wait-for-$2-and-re-acquiring-the-work-information-page-$1"}
						? '等待 %2 之后再重新取得作品资讯页面：%1'
						// gettext_config:{"id":"re-acquiring-the-work-information-page-$1"}
						: '重新取得作品资讯页面：%1', work_URL,
						//
						library_namespace.age_of(0, chapter_time_interval, {
							digits : 1
						}) ]
					} ]);
					if (chapter_time_interval > 0) {
						setTimeout(get_work_page, chapter_time_interval);
					} else {
						get_work_page();
					}
					return;
				}

			} catch (e) {
				// throw e;
				var warning = 'process_work_data: ' + (work_title || work_id)
						+ ': ' + e;
				_this.onwarning(warning);
				typeof callback === 'function' && callback({
					title : work_title
				});
				return;
			}

			// work_title: search key
			work_data.input_title = work_title;
			if (!work_data.title) {
				work_data.title = work_title;
			} else {
				// assert: {String}work_data.title
				work_data.title
				// '&amp;' → '&' for `node webtoon.js challenge_18878`
				// https://github.com/kanasimi/work_crawler/issues/409
				= library_namespace.HTML_to_Unicode(work_data.title);

				if (_this.cache_title_to_id && !work_title
				// default: `{title:id}`
				&& (!_this.id_of_search_result && !_this.title_of_search_result
				// 应对有些作品存在却因为网站本身的问题而搜寻不到的情况，例如 buka。
				// 这时 this.parse_search_result() 函数本身必须能够解析 `{title:id}`。
				|| typeof _this.parse_search_result !== 'function')) {
					// cache work title: 方便下次从 search cache 反查。

					// search cache
					var search_result_file = _this.get_search_result_file(),
					//
					search_result = _this.get_search_result()
							|| Object.create(null);
					if (!(work_data.title in search_result)) {
						search_result[work_data.title] = work_id;
						// 补上已知的转换。这样未来输入作品标题的时候就能自动转换。
						library_namespace.write_file(search_result_file,
								search_result);
					}
				}
			}

			// 从已设定的网站名称挑选一个可用的。
			if (work_data.site_name) {
				_this.site_name = work_data.site_name;
			} else if (_this.site_name) {
				work_data.site_name = _this.site_name;
			}
			// 基本检测。 e.g., "NOT FOUND", undefined
			if (crawler_namespace.PATTERN_non_CJK.test(work_data.title)
			// e.g., "THE NEW GATE", "Knight's & Magic"
			&& !/[a-z]+ [a-z\d&]/i.test(work_data.title)
			// e.g., "Eje(c)t"
			&& !/[()]/.test(work_data.title)
			// e.g., "H-Mate"
			&& !/[a-z\-][A-Z]/.test(work_data.title)
			// .title: 必要属性：须配合网站平台更改。
			&& crawler_namespace.PATTERN_non_CJK.test(work_id)) {
				if (!_this.skip_get_work_page || work_data.title)
					library_namespace.warn([ 'process_work_data: ', {
						// gettext_config:{"id":"$1-(id-$2)-is-not-a-chinese-japanese-or-korean-title"}
						T : [ work_data.title ? '《%1》（id：%2）非中日韩文作品标题。'
						// gettext_config:{"id":"the-title-of-the-work-$1-(id-$2)-could-not-be-obtained-or-set"}
						: '无法取得或未设定作品标题《%1》（id：%2）。',
						//
						work_data.title, work_id ]
					} ]);
			}

			// 自动添加之作业用属性：
			work_data.id = work_id;
			work_data.last_download = {
				// {Date}
				date : (new Date).toISOString(),
				chapter : _this.start_chapter_NO
			};
			// source URL of work
			work_data.url = work_URL;

			// gettext_config:{"id":"downloading-$1-table-of-contents-@-$2"}
			process.title = gettext('下载%1 - 目次 @ %2', work_data.title, _this.id);
			// console.log(work_data);
			var variable_set = {
				id : typeof work_data.directory_id === 'function'
				// 自行指定作品放置目录与 ebook 用的 work id。
				&& work_data.directory_id() || work_data.id,
				// this.skip_get_work_page 时， work_data.title === undefined
				title : work_data.title || '',
				// e.g., '.' + (new Date).format('%Y%2m%2d')
				// e.g., 腾讯动漫和起点中文限免作品的日期后缀。
				directory_name_extension : work_data.directory_name_extension
						|| ''
			};
			variable_set.id_title = variable_set.id
			//
			+ (variable_set.title ? ' ' + variable_set.title : '');
			if (_this.directory_name_pattern
			//
			&& library_namespace.extract_literals(
			//
			_this.directory_name_pattern, {
				id : 'i1',
				title : 't1',
				id_title : 'it1'
			}) === library_namespace.extract_literals(
			//
			_this.directory_name_pattern, {
				id : 'i2',
				title : 't2',
				id_title : 'it2'
			})) {
				library_namespace.error({
					// gettext_config:{"id":"the-custom-directory_name_pattern-$1-gives-the-same-name-to-different-works-so-the-default-directory_name_pattern-is-used-instead"}
					T : [ '自订作品目录名称模式 %1 令不同作品产生相同名称，改采预设作品目录模式！',
							JSON.stringify(_this.directory_name_pattern) ]
				});
				delete _this.directory_name_pattern;
			}
			work_data.directory_name = library_namespace.to_file_name(
			// 允许自订作品目录名/命名资料夹。
			work_data.directory_name
			// default 作品目录名/命名资料夹。
			|| library_namespace.extract_literals(
			// 自定义 自订作品目录名称模式。e.g., '${title}' 将只以作品标题为作品目录，'${id}'
			// 将只以作品id为作品目录。
			_this.directory_name_pattern
			// default directory_name_pattern 预设作品目录名称模式。
			|| Work_crawler.prototype.directory_name_pattern,
			//
			variable_set));
			// console.log(work_data.directory_name);
			// full directory path of the work.
			if (!work_data.directory) {
				var work_base_directory = _this.main_directory;
				if (work_data.base_directory_name) {
					// 允许自订作品目录，将作品移至特殊目录下。
					// @see qq.js, qidian.js
					// set base directory name below _this.main_directory
					work_base_directory += library_namespace
							.append_path_separator(work_data.base_directory_name);
					// 特殊目录可能还不存在。
					library_namespace.create_directory(work_base_directory);
					if (_this.need_create_ebook)
						work_data.ebook_directory = work_base_directory;
				}
				work_data.directory = library_namespace
						.append_path_separator(work_base_directory
								+ work_data.directory_name);
			}
			work_data.data_file = work_data.directory
					+ work_data.directory_name + '.json';

			var work_cache_directory = _this.main_directory
					+ _this.cache_directory_name,
			// .data.htm
			work_page_path = work_cache_directory + work_data.directory_name
					+ '.' + Work_crawler.HTML_extension, html;
			if (_this.preserve_work_page) {
				// 先写入作品资料 cache。
				library_namespace.create_directory(work_cache_directory);
				node_fs.writeFileSync(work_page_path);
			} else if (_this.preserve_work_page === false) {
				// 明确指定不保留，将删除已存在的作品资料 cache。
				library_namespace.debug({
					// gettext_config:{"id":"delete-existing-work-data-cache-$1"}
					T : [ '删除已存在的作品资料快取：%1', work_page_path ]
				}, 1, 'process_work_data');
				library_namespace.remove_file(work_page_path);
			}

			// .status 选择性属性：须配合网站平台更改。
			// ja:种别,状态
			if (Array.isArray(work_data.status)) {
				// e.g., ジャンル
				work_data.status = work_data.status.filter(function(item) {
					return !!item;
				})
				// .sort()
				// .join(', ')
				;
			}
			// assert: typeof work_data.status === 'string'
			// || Array.isArray(work_data.status)

			// 主要提供给 this.get_chapter_list() 使用。
			// e.g., 'ja-JP'
			if (!('language' in work_data)) {
				work_data.language
				// CeL.application.locale.detect_HTML_language()
				= library_namespace.detect_HTML_language(html)
				// CeL.application.locale.encoding.guess_text_language()
				|| library_namespace.guess_text_language(html);
			}
			// normalize work_data.language
			if (work_data.language && work_data.language.startsWith('cmn')) {
				// calibre 不认得/读不懂 "cmn-Hant-TW" 这样子的语言代码，
				// 但是读得懂 "zh-cmn-Hant-TW"。
				work_data.language = 'zh-' + work_data.language;
				if (!work_data.chapter_unit)
					work_data.chapter_unit = '章';
			}

			if (false && _this.is_finished(work_data)) {
				// 注意: 这时可能尚未建立 work_data.directory。
				// TODO: skip finished + no update works
			}

			var matched = library_namespace.get_JSON(work_data.data_file);
			if (matched) {
				delete matched.old_data;
				// cache old data
				work_data.old_data = matched;

				// work_data properties to reset. do not inherit
				// 设定不继承哪些作品资讯。
				var skip_cache = Object.assign({
					process_status : _this.recheck,

					ebook_directory : _this.need_create_ebook,
					words_so_far : _this.need_create_ebook,
					book_chapter_count : _this.need_create_ebook
				}, _this.reset_work_data_properties);
				// work_data.old_data = Object.create(null);

				// recall old work_data
				// 基本上以新资料为准，除非无法获取新资料，才改用旧资料。
				for ( var key in matched) {
					if (skip_cache[key]) {
						// Skip this cache data.
						continue;
					}

					if (!(key in work_data)) {
						// 填入旧的资料。
						work_data[key] = matched[key];

					} else if (typeof work_data[key] !== 'object'
							&& work_data[key] !== matched[key]) {
						// work_data.old_data[key] = matched[key];

						// 记录旧下载目录的资料以供调整目录时使用。
						// work_data.old_directory
						if (key === 'directory') {
							work_data.old_directory = matched[key];
						}

						var _message = String(matched[key])
								+ String(work_data[key]);
						var multi_lines = _message.length > 60
						// 采用比较简洁并醒目多色彩的显示方式。
						|| _message.includes('\n');
						// gettext_config:{"id":"new-information-→"}
						_message = multi_lines ? gettext('新资料→') : '→';
						_message = [ [ key + ':', matched[key] ],
								[ _message, work_data[key] ] ];
						_message = library_namespace.display_align(_message, {
							value_style : {
								color : 'green'
							},
							line_separator : multi_lines ? '\n' : ''
						});
						// console.log(_message);
						library_namespace.info(_message);
					}
				}
				if (matched.last_download) {
					// 纪录一下上一次下载的资讯。
					work_data.latest_download = matched.last_download;
					matched = matched.last_download.chapter;
					if (matched > _this.start_chapter_NO) {
						// 将开始/接续下载的章节编号。对已下载过的章节，必须配合 .recheck。
						work_data.last_download.chapter = matched | 0;
					}
				}
			}

			/**
			 * 对于章节列表与作品资讯分列不同页面(URL)的情况，应该另外指定 .chapter_list_URL。 e.g., <code>
			chapter_list_URL : '',
			chapter_list_URL : function(work_id) { return this.work_URL(work_id) + 'chapter/'; },
			chapter_list_URL : function(work_id, work_data) { return [ 'url', { post_data } ]; },
			 </code>
			 */
			if (_this.chapter_list_URL) {
				work_data.chapter_list_URL = work_URL = _this.full_URL(
						_this.chapter_list_URL, work_id, work_data);
				// console.trace(work_URL);
				var post_data = null;
				if (Array.isArray(work_URL)) {
					post_data = work_URL[1];
					work_URL = _this.full_URL(work_URL[0]);
				}
				_this.get_URL(work_URL, pre_process_chapter_list_data,
						post_data, true);
			} else {
				pre_process_chapter_list_data(XMLHttp);
			}
		}

		// ----------------------------------------------------------

		function pre_process_chapter_list_data(XMLHttp) {
			// 因为隐私问题？有些浏览器似乎会隐藏网址，只要输入host即可？
			if (/(?:\.html?|\/)$/.test(XMLHttp.responseURL))
				_this.setup_value('Referer', XMLHttp.responseURL);
			var html = XMLHttp.responseText;
			if (!html && !_this.skip_get_work_page) {
				var message = _this.id + ': '
				// gettext_config:{"id":"cannot-get-chapter-list-page"}
				+ gettext('Cannot get chapter list page!');
				library_namespace.error(message);
				_this.onerror(message, work_data);
				typeof callback === 'function' && callback(work_data);
				return Work_crawler.THROWED;
			}

			if (false) {
				// reset chapter_count. 此处 chapter (章节)
				// 指的为平台所给的id编号，可能是page，并非"回"、"话"！且可能会跳号！
				/** {ℕ⁰:Natural+0}章节数量 */
				work_data.chapter_count = 0;
				// work_data.chapter_count这个数值在前面skip_cache已经设定为不会更新，因此在这边不需要重新设定。
			}

			// 注意: 这时可能尚未建立 work_data.directory。
			// 但this.get_chapter_list()若用到work_data[this.KEY_EBOOK].set_cover()，则会造成没有建立基础目录的错误。
			library_namespace.debug({
				// gettext_config:{"id":"create-work_data.directory-$1"}
				T : [ 'Create work_data.directory: %1', work_data.directory ]
			});
			// 预防(work_data.directory)不存在。
			library_namespace.create_directory(work_data.directory);

			if (_this.is_finished(work_data)) {
				if (false) {
					node_fs.writeFileSync(work_data.directory
					// 已经改成产生报告档。
					+ 'finished.txt', work_data.status);
				}
				if (work_data.process_status) {
					work_data.process_status = work_data.process_status
							.unique();
					var has_last_saved_date;
					work_data.process_status = work_data.process_status
					// 之前每次都会添加新的资讯...
					.filter(function(status) {
						// gettext_config:{"id":"last-saved-date","mark_type":"part_of_string"}
						if (!String(status).startsWith('last saved date: ')) {
							return true;
						}
						if (has_last_saved_date)
							return false;
						has_last_saved_date = true;
						return true;
					});
				}
				if (!work_data.process_status
				// gettext_config:{"id":"finished"}
				|| !work_data.process_status.includes('finished')) {
					// gettext_config:{"id":"finished"}
					crawler_namespace.set_work_status(work_data, 'finished');
				}
				// cf. work_data.latest_chapter 最新章节,
				// work_data.latest_chapter_url 最新更新章节URL,
				// work_data.last_update 最新更新时间,
				// work_data.some_limited 部份章节需要付费/被锁住/被限制
				if (work_data.last_update) {
					crawler_namespace.set_work_status(work_data,
					// gettext_config:{"id":"last-updated-date","mark_type":"part_of_string"}
					'last updated date: ' + work_data.last_update);
				}
				if (work_data.last_saved
				// 已完结的时间报告只记录一次就够了。
				&& work_data.process_status.every(function(status) {
					// gettext_config:{"id":"last-saved-date","mark_type":"part_of_string"}
					return !String(status).startsWith('last saved date: ');
				})) {
					if (Date.parse(work_data.last_saved) > 0) {
						work_data.last_saved = new Date(work_data.last_saved);
					}
					crawler_namespace.set_work_status(work_data,
					// gettext_config:{"id":"last-saved-date","mark_type":"part_of_string"}
					'last saved date: '
					//
					+ (library_namespace.is_Date(work_data.last_saved)
					//
					? work_data.last_saved.format('%Y/%m/%d %H:%M:%S')
					//
					: work_data.last_saved));
				}
				// TODO: skip finished + no update works
			}

			if (true || _this.need_create_ebook) {
				// 提供给 this.get_chapter_list() 使用。
				if (!('time_zone' in work_data)) {
					// e.g., 9
					work_data.time_zone
					// CeL.application.locale.time_zone_of_language
					= library_namespace
							.time_zone_of_language(work_data.language);
				}
			}

			if (typeof _this.pre_get_chapter_list === 'function') {
				// 处理章节列表分散在多个档案时的情况。
				// e.g., dajiaochong.js
				_this.pre_get_chapter_list(
				// function(callback, work_data, html, get_label)
				check_get_chapter_list.bind(_this, html), work_data, html,
						crawler_namespace.get_label);
			} else {
				check_get_chapter_list(html);
			}
		}

		// ----------------------------------------------------------

		function check_get_chapter_list(html) {
			function onerror(error) {
				library_namespace.error([ _this.id + ': ', {
					// gettext_config:{"id":"«$2»-a-serious-error-occurred-during-execution-of-$1-which-was-aborted"}
					T : [ '《%2》：执行 %1 时发生严重错误，异常中断。',
					//
					'.get_chapter_list()', work_data.title ]
				} ]);
				_this.onerror(error, work_data);
				typeof callback === 'function' && callback(work_data);
				return Work_crawler.THROWED;
			}

			// old name: this.get_chapter_count()
			if (typeof _this.get_chapter_list === 'function') {
				try {
					// 解析出章节列表。
					var chapter_list = _this.get_chapter_list(work_data, html,
							crawler_namespace.get_label);
					if (library_namespace.is_thenable(chapter_list)) {
						// 得要从章节内容获取必要资讯例如更新时间的情况。
						// e.g., for 51shucheng.js
						chapter_list.then(process_chapter_list_data.bind(this,
								html), onerror);
						return;
					}
				} catch (e) {
					return onerror(e);
				}

				if (work_data.inverted_order) {
					_this.reverse_chapter_list_order(work_data);
					delete work_data.inverted_order;
				}
			}

			process_chapter_list_data(html);
		}

		// 解析出 章节列表/目次/完整目录列表
		function process_chapter_list_data(html) {
			// work_data.chapter_list 为非正规之 chapter data list。
			// e.g., work_data.chapter_list = [ chapter_data,
			// chapter_data={url:'',title:'',date:new Date}, ... ]
			var chapter_list = Array.isArray(work_data.chapter_list)
					&& work_data.chapter_list;

			if (chapter_list) {
				// fill required data from chapter_list

				// 之前已设定 work_data.chapter_count=0
				if (!work_data.chapter_count) {
					// 自 work_data.chapter_list 计算章节数量。
					work_data.chapter_count = chapter_list.length;
				}
				if (false) {
					// https://github.com/kanasimi/work_crawler/issues/551
					work_data.chapter_NO_pad_digits = Math.max(
					// 设定位数的最小值：小说4位数，漫画3位数，预防常常因为更新而变动。
					_this.need_create_ebook ? 4 : 3,
					//
					1 + Math.floor(Math.log10(work_data.chapter_count)));
				}

				var last_chapter_data = chapter_list.at(-1),
				//
				set_attribute = function(attribute, value) {
					if (!value)
						return;
					if (!work_data[attribute] || work_data[attribute] !== value
							&& String(value).includes(work_data[attribute])) {
						if (work_data[attribute]) {
							library_namespace.info(
							//
							library_namespace.display_align([
							//
							[ attribute + ':', work_data[attribute] ],
							// via chapter data
							// gettext_config:{"id":"from-chapter-data-→"}
							[ gettext('自章节资料→'), value ] ]));
						}
						work_data[attribute] = value;
						// 有些资讯来自章节清单。
						work_data.fill_from_chapter_list = true;
					}
				};

				if (typeof last_chapter_data === 'string') {
					set_attribute('latest_chapter_url', last_chapter_data);
				} else if (library_namespace.is_Object(last_chapter_data)) {
					set_attribute(
							'latest_chapter_url',
							Array.isArray(last_chapter_data.url) ? last_chapter_data.url[0]
									: last_chapter_data.url);
					set_attribute('latest_chapter', last_chapter_data.title);
					set_attribute('last_update', last_chapter_data.date);
				} else if (!work_data.removed) {
					// assert: work_data.removed 的情况，会在之后另外补上错误讯息。
					library_namespace.error({
						// gettext_config:{"id":"invalid-chapter_data-$1"}
						T : [ 'Invalid chapter_data: %1',
								JSON.stringify(last_chapter_data) ]
					});
				}

				// Release memory. 释放被占用的记忆体。
				last_chapter_data = set_attribute = null;
			}

			if (chapter_list && input_url) {
				// 检查是否输入特定章节的网址。注意：此方法仅在输入的章节网址包含作品网址的情况下才有作用。
				chapter_list.some(function(chapter_data, index) {
					var chapter_url;
					if (typeof chapter_data === 'string') {
						chapter_url = chapter_data;
					} else if (library_namespace.is_Object(chapter_data)) {
						chapter_url = chapter_data.url
					} else {
						library_namespace.error({
							// gettext_config:{"id":"invalid-chapter_data-$1"}
							T : [ 'Invalid chapter_data: %1',
									JSON.stringify(chapter_data) ]
						});
					}
					if (chapter_url && input_url.includes(chapter_url)) {
						work_data.download_chapter_NO_list = [ ++index ];
						library_namespace.info({
							// gettext_config:{"id":"enter-the-url-for-§$1-and-download-only-this-section"}
							T : [ '输入 §%1 的网址，仅下载此一章节。', index ]
						});
						return true;
					}
				});
			}

			if (work_data.chapter_count >= 1) {
				// 标记曾经成功获取的章节数量，代表这个部分的代码运作机制没有问题。
				_this.got_chapter_count = true;

			} else {
				// console.log(work_data);
				var warning = _this.id + ': ' + work_id
						+ (work_data.title ? ' ' + work_data.title : '') + ': ';
				if (work_data.removed) {
					// cf. work_data.filtered
					warning += typeof work_data.removed === 'string' ? work_data.removed
							// gettext_config:{"id":"the-work-does-not-exist-or-has-been-deleted"}
							: '作品不存在或已被删除。';
				} else {
					warning += gettext
					// gettext_config:{"id":"cannot-get-chapter-count"}
					.append_message_tail_space('Cannot get chapter count!')
					// (Did not set work_data.chapter_count)
					// gettext_config:{"id":"perhaps-the-work-has-been-deleted-or-blocked"}
					+ gettext(_this.got_chapter_count ? '或许作品已被删除或屏蔽？'
					// No chapter got! 若是作品不存在就不会跑到这边了
					// 或者是特殊作品？
					// gettext_config:{"id":"perhaps-the-work-has-been-deleted-or-blocked-or-has-the-website-been-revised"}
					: '或许作品已被删除或屏蔽，或者网站改版了？');
				}
				_this.onwarning(warning, work_data);

				// 无任何章节可供下载。删掉前面预建的目录。
				// 注意：仅能删除本次操作所添加/改变的档案。因此必须先确认里面是空的。不能使用{library_namespace.fs_remove(work_data.directory,,true);}。
				library_namespace.fs_remove(work_data.directory);

				typeof callback === 'function' && callback(work_data);
				return;
			}

			var chapter_list_path = _this.main_directory
			//
			+ _this.cache_directory_name + work_data.directory_name
			// .TOC.htm
			+ '.list.' + Work_crawler.HTML_extension;
			if (_this.preserve_work_page && _this.chapter_list_URL) {
				// 所在目录应该已经在上一个 _this.preserve_work_page 那个时候建造完毕。
				node_fs.writeFileSync(chapter_list_path, html);
			} else if (_this.preserve_work_page === false) {
				// 明确指定不保留，将删除已存在的章节列表页面(网页)。
				library_namespace.debug({
					// gettext_config:{"id":"remove-chapter-list-page-$1"}
					T : [ 'Remove chapter list page: %1', chapter_list_path ]
				}, 1, 'process_chapter_list_data');
				library_namespace.remove_file(chapter_list_path);
				if (false) {
					library_namespace.fs_remove(_this.main_directory
							+ _this.cache_directory_name);
				}
			}

			var recheck_flag = 'recheck' in work_data ? work_data.recheck
			// work_data.recheck 可能是程式自行判别的。
			: _this.recheck,
			/** {Integer}章节的增加数量: 新-旧, 当前-上一次的 */
			chapter_added = work_data.chapter_count
					- work_data.last_download.chapter;

			// 指定仅下载某些特殊的章节。
			if (Array.isArray(work_data.download_chapter_NO_list)) {
				recheck_flag = true;
				// 正规化 work_data.download_chapter_NO_list
				work_data.download_chapter_NO_list = work_data.download_chapter_NO_list
				// must be number
				.map(function(index) {
					return +index;
				}).filter(function(index) {
					return 0 <= index && index < chapter_list.length
					//
					&& index === Math.floor(index);
				})
				// 在 .one_by_one 的情况下允许不依照顺序下载。
				/* .sort() */.unique();

				work_data.download_chapter_NO_list.index = 0;

				library_namespace.info({
					T : [ work_data.download_chapter_NO_list.length === 0
					// gettext_config:{"id":"manually-specified-not-to-download-any-chapters"}
					? '手动指定了不下载任何章节！'
					// gettext_config:{"id":"download-only-chapter-number-$1"}
					: '仅下载章节编号：%1',
							work_data.download_chapter_NO_list.join(', ') ]
				});
			}

			if (typeof recheck_flag === 'function') {
				recheck_flag = recheck_flag.call(this, work_data);
			}

			if (recheck_flag === 'multi_parts_changed') {
				recheck_flag = chapter_list
				// 当有多个分部的时候才重新检查。
				&& chapter_list.part_NO > 1 && 'changed';
			}

			if (chapter_list && work_data.old_data
			// copy old chapter data. e.g., chapter_data.image_list
			&& Array.isArray(work_data.old_data.chapter_list)) {
				chapter_list.some(function(chapter_data, index) {
					var old_chapter_data
					//
					= work_data.old_data.chapter_list[index];
					if (!library_namespace.is_Object(old_chapter_data)
					// 检核是否有资料比较的基本条件。
					|| !chapter_data.url || !chapter_data.title) {
						return true;
					}
					if (chapter_data.url !== old_chapter_data.url
					// 检核基本资料是否相同。
					|| chapter_data.title !== old_chapter_data.title) {
						// recheck_flag = true;
						return true;
					}
					// assert: chapter_list[index] === chapter_data
					for ( var property in old_chapter_data) {
						if (!(property in chapter_data)
								&& !ignore_old_chapter_data.has(property)) {
							chapter_data[property]
							// 最后要把资料再 copy 回 chapter_data，预防程式码参照 chapter_data。
							= old_chapter_data[property];
						}
					}
				});
			}

			if (recheck_flag
			// _this.get_chapter_list() 中
			// 可能重新设定过 work_data.last_download.chapter。
			&& work_data.last_download.chapter !== _this.start_chapter_NO) {
				library_namespace.debug({
					// gettext_config:{"id":"the-.recheck-option-has-been-set-the-work-has-been-downloaded-before-and-the-catalogue-has-content"}
					T : '已设定 .recheck 选项，且之前曾下载过本作品，作品目录有内容。'
				});

				if (recheck_flag !== 'changed'
						&& typeof recheck_flag !== 'number') {
					// 强制重新更新文件。
					// recheck_flag should be true
					if (typeof recheck_flag !== 'boolean') {
						library_namespace.warn('Unknown .recheck: '
								+ recheck_flag);
					}
					if (!_this.reget_chapter) {
						if (Object.hasOwn(_this, 'reget_chapter')) {
							library_namespace.warn([ {
								T : [
								// gettext_config:{"id":"with-the-.recheck-option-set-setting-the-.reget_chapter-option-to-$1-will-have-no-effect"}
								'既已设定 .recheck 选项，则将 .reget_chapter 选项设定为 %1 将无作用！'
								//
								, JSON.stringify(_this.reget_chapter) ]
							}, {
								T :
								// gettext_config:{"id":"it-will-automatically-turn-.reget_chapter-to-true-and-explicitly-specify-reget_chapter-to-re-acquire-the-chapter-content"}
								'将自动把 .reget_chapter 转为 true，明确指定 reget_chapter 以重新取得章节内容。'
							} ]);
						}
						_this.reget_chapter = true;
					}
					// 无论是哪一种，既然是recheck则都得要从头check并生成资料。
					work_data.reget_chapter = _this.reget_chapter;
					work_data.last_download.chapter = _this.start_chapter_NO;

				} else if ( // 依变更判定是否重新更新文件。
				// for: {Natural}recheck_flag
				recheck_flag > 0 ? chapter_added < 0
				// .recheck 采用一个较大的数字可避免太过经常更新。
				|| chapter_added >= recheck_flag
				// assert: recheck_flag === 'changed'
				: chapter_added !== 0
				// TODO: check .last_update , .latest_chapter
				// 检查上一次下载的章节名称而不只是章节数量。
				) {
					// midified
					library_namespace.debug({
						// gettext_config:{"id":"the-work-has-been-changed-and-is-subject-to-the-conditions-that-need-to-be-updated"}
						T : '作品变更过，且符合需要更新的条件。'
					});
					library_namespace.info([ {
						// gettext_config:{"id":"as-the-number-of-chapters-changes-all-chapters-will-be-re-downloaded-and-checked"}
						T : '因章节数量有变化，将重新下载并检查所有章节内容：'
					}, work_data.last_download.chapter
					//
					+ '→' + work_data.chapter_count
					//
					+ ' (' + (work_data.chapter_count
					//
					> work_data.last_download.chapter ? '+' : '')
					//
					+ (work_data.chapter_count
					//
					- work_data.last_download.chapter) + ')' ]);
					// 重新下载。
					work_data.reget_chapter = true;
					// work_data.regenerate = true;
					work_data.last_download.chapter = _this.start_chapter_NO;

				} else {
					// 不可用 ('reget_chapter' in _this)，会得到 .prototype 的属性。
					if (!Object.hasOwn(_this, 'reget_chapter')) {
						work_data.reget_chapter = false;
					}
					// 如果章节删除与增加，重整结果数量相同，则检查不到，必须采用 .recheck。
					library_namespace.log([ _this.id + ': ',
					//
					chapter_added === 0 ? {
						T : [
						// gettext_config:{"id":"the-number-of-chapters-has-not-changed-total-$1-$2"}
						'章节数量无变化，共 %1 %2；', work_data.chapter_count,
						//
						work_data.chapter_unit || _this.chapter_unit ]
					} : {
						T : [
						// gettext_config:{"id":"the-number-of-chapters-with-small-changes-(only-$1-$2)-but-it-will-not-be-re-downloaded"}
						'章节数量变化过小（仅差 %1 %2），因此不重新下载；', chapter_added,
						//
						work_data.chapter_unit || _this.chapter_unit ]
					// gettext_config:{"id":"however-all-chapter-content-has-been-set-to-download"}
					}, work_data.reget_chapter ? '但已设定下载所有章节内容。'
					//
					: _this.regenerate
					// gettext_config:{"id":"rebuild-data-only-with-cache-(such-as-novels-e-books)-and-not-re-download-all-chapter-content"}
					? '仅利用快取重建资料（如小说、电子书），不重新下载所有章节内容。'
					// gettext_config:{"id":"skip-this-work-without-processing"}
					: '跳过本作品不处理。' ]);

					// 采用依变更判定时，预设不重新撷取。
					if (!('reget_chapter' in _this)) {
						work_data.reget_chapter = false;
					}
					if (work_data.reget_chapter || _this.regenerate) {
						// 即使是这一种，还是得要从头 check cache 并生成资料(如.epub)。
						work_data.last_download.chapter = _this.start_chapter_NO;
					}

				}

			} else if (_this.start_chapter_title) {
				library_namespace.info({
					T : [
					// 而重新检查下载。
					// gettext_config:{"id":"previously-downloaded-to-the-newer-$2-$3-backtracked-by-specifying-start_chapter_title=$1"}
					'之前已下载到较新的第 %2 %3，因指定 start_chapter_title=%1 而回溯。',
							_this.start_chapter_title,
							work_data.last_download.chapter,
							work_data.chapter_unit || _this.chapter_unit ]
				});
				work_data.last_download.chapter = Work_crawler.prototype.start_chapter_NO;

			} else if (_this.start_chapter_NO > Work_crawler.prototype.start_chapter_NO
					&& work_data.last_download.chapter > _this.start_chapter_NO) {
				library_namespace.info({
					// gettext_config:{"id":"previously-downloaded-to-the-newer-$2-$3-backtracked-by-specifying-start_chapter_no=$1"}
					T : [ '之前已下载到较新的第 %2 %3，因指定 start_chapter_NO=%1 而回溯。',
							_this.start_chapter_NO,
							work_data.last_download.chapter,
							work_data.chapter_unit || _this.chapter_unit ]
				});
				work_data.last_download.chapter = _this.start_chapter_NO;
			}

			if (!('reget_chapter' in work_data)) {
				// .reget_chapter 为每个作品可能不同之属性，非全站点共用属性。
				work_data.reget_chapter = typeof _this.reget_chapter === 'function' ? _this
						.reget_chapter(work_data)
						: _this.reget_chapter;
			}

			if (work_data.last_download.chapter > work_data.chapter_count) {
				library_namespace.warn({
					T : [
					// or: 对于被屏蔽的作品，将会每次都从头检查。
					// gettext_config:{"id":"the-number-of-chapters-$1-is-less-than-the-start-continued-download-chapter-number-$2-perhaps-because-the-chapter-has-been-reorganized-or-the-chapter-has-been-added-or-deleted-midway-during-the-last"}
					'章节数量 %1 比将开始/接续之下载章节编号 %2 还少，或许因为章节有经过重整，或者上次下载时中途增删过章节。',
							work_data.chapter_count,
							work_data.last_download.chapter ]
				});
				if (_this.move_when_chapter_count_error) {
					var move_to = work_data.directory
					// 先搬移原目录。
					.replace(/[\\\/]+$/, '.' + (new Date).format('%4Y%2m%2d'));
					// 常出现在 manhuatai, 2manhua。
					library_namespace.warn([ {
						T : [
						// 另存
						// gettext_config:{"id":"the-old-content-will-be-backed-up-the-directory-will-be-moved-and-then-re-downloaded-from-$1-$2"}
						'将先备份旧内容、移动目录，而后重新自第 %1 %2下载！', _this.start_chapter_NO,
						//
						work_data.chapter_unit || _this.chapter_unit ]
					}, '\n', work_data.directory, '\n→\n', move_to ]);
					// TODO: 成压缩档。
					library_namespace.fs_move(work_data.directory, move_to);
					// re-create work_data.directory
					library_namespace.create_directory(work_data.directory);
				} else {
					library_namespace.info({
						// gettext_config:{"id":"it-will-be-re-downloaded-from-$1-$2"}
						T : [ '将从头检查、自第 %1 %2重新下载。', _this.start_chapter_NO,
								work_data.chapter_unit || _this.chapter_unit ]
					});
				}
				work_data.reget_chapter = true;
				work_data.last_download.chapter = _this.start_chapter_NO;
			}

			work_data.error_images = 0;
			if (work_data.last_download.chapter === _this.start_chapter_NO) {
				work_data.image_count = 0;
			} else {
				delete work_data.image_count;
			}

			if (_this.need_create_ebook && !work_data.reget_chapter
			// 最起码应该要重新生成电子书。否则会只记录到最后几个检查过的章节。
			&& work_data.last_download.chapter !== work_data.chapter_count) {
				library_namespace.info({
					// gettext_config:{"id":"the-e-book-will-be-regenerated-from-$1$2"}
					T : [ '将从头检查、自第 %1 %2重新生成电子书。', _this.start_chapter_NO,
							work_data.chapter_unit || _this.chapter_unit ]
				});
				work_data.regenerate = true;
				work_data.last_download.chapter = _this.start_chapter_NO;
			}

			// remove cache of old work_data
			delete work_data.old_data;

			if (typeof callback === 'function' && callback.options
					&& callback.options.get_data_only) {
				// 最终废弃动作，防止执行 work_data[this.KEY_EBOOK].pack()。
				delete work_data[_this.KEY_EBOOK];
				if (work_data.latest_download) {
					// recover latest download data
					work_data.last_download = work_data.latest_download;
				} else {
					delete work_data.last_download;
				}

				// backup
				_this.save_work_data(work_data, 'process_chapter_list_data');

				callback(work_data);
				return;
			}

			// backup
			_this.save_work_data(work_data, 'process_chapter_list_data');

			if (!work_data.reget_chapter
			//
			&& !_this.regenerate && !work_data.regenerate
			// 还必须已经下载到最新章节。
			&& work_data.last_download.chapter === work_data.chapter_count) {
				// 跳过本作品不处理。
				library_namespace.log([ 'process_chapter_list_data: ', {
					// gettext_config:{"id":"skip-$1-without-processing"}
					T : [ '跳过 %1 不处理。', work_data.id
					//
					+ (work_data.author ? ' [' + work_data.author + ']' : '')
					//
					+ ' ' + work_data.title ]
				} ]);
				// 最终废弃动作，防止执行 work_data[this.KEY_EBOOK].pack()。
				delete work_data[_this.KEY_EBOOK];
				if (typeof callback === 'function') {
					// console.log(callback + '');
					callback(work_data);
				}
				return;
			}

			var ebook_promise;
			if (_this.need_create_ebook) {
				// console.log(work_data);
				// console.trace(JSON.stringify(work_data));
				ebook_promise = crawler_namespace.create_ebook.call(_this,
						work_data);
			}

			var message = [
					work_data.id,
					// TODO: {Object}work_data.author
					work_data.author ? ' [' + work_data.author + ']' : '',
					' ',
					work_data.title,
					': ',
					work_data.chapter_count >= 0
					// assert: if chapter count unknown, typeof
					// _this.pre_chapter_URL === 'function'
					// gettext_config:{"id":"unknown"}
					? work_data.chapter_count : 'Unknown',
					' ',
					work_data.chapter_unit || _this.chapter_unit,
					'.',
					work_data.status ? ' '
							+ (library_namespace.is_Object(work_data.status) ? JSON
									.stringify(work_data.status)
									: work_data.status)
							: '',
					work_data.last_download.chapter > _this.start_chapter_NO ? ' '
							// §: 章节编号
							// gettext_config:{"id":"download-from-§$1"}
							+ gettext('自 §%1 接续下载。',
									work_data.last_download.chapter)
							: '' ].join('');
			if (_this.is_finished(work_data)) {
				// 针对特殊状况提醒。
				library_namespace.info(message);
			} else {
				library_namespace.log(message);
			}

			work_data.start_downloading_time = Date.now();
			work_data.start_downloading_chapter = work_data.last_download.chapter || 1;
			if (typeof _this.after_download_chapter === 'function') {
				_this.after_download_chapter(work_data, 0);
			}

			// function create_ebook(work_data)
			// 中的 this.convert_to_language() 可能是 async 形式，需要待其完成之后，再进行下个阶段。
			function waiting_for_create_ebook() {
				library_namespace
						.log_temporary({
							T : 'Waiting for connecting to language-converting server...'
						});
				// Will wait for the get_URL() @ function get_LTP_data(options)
				// @ Chinese_converter/Chinese_converter.js
				Promise.resolve(ebook_promise).then(
						start_to_process_chapter_data);
			}
			function start_to_process_chapter_data() {
				// 开始下载 chapter。
				crawler_namespace.pre_get_chapter_data.call(_this, work_data,
						crawler_namespace.get_next_chapter_NO_item(work_data,
								work_data.last_download.chapter), callback);
			}
			if (typeof _this.after_get_work_data === 'function') {
				// 必须自行保证执行 callback()，不丢出异常、中断。
				_this.after_get_work_data(waiting_for_create_ebook, work_data);
			} else {
				waiting_for_create_ebook();
			}
		}

	}

	// --------------------------------------------------------------------------------------------

	// export 导出.

	// @inner
	Object.assign(crawler_namespace, {
		set_work_status : set_work_status
	});

	// @instance
	Object.assign(Work_crawler.prototype, {
		// 规范 work id 的正规模式；提取出引数中的作品id 以回传。
		extract_work_id : extract_work_id,
		// 自作品网址 URL 提取出 work id。 via URL
		extract_work_id_from_URL : extract_work_id_from_URL,

		show_work_data : show_work_data,

		get_work : get_work,
		get_work_data : get_work_data,
		save_work_data : save_work_data_file
	});

	// 不设定(hook)本 module 之 namespace，仅执行 module code。
	return library_namespace.env.not_to_extend_keyword;
}
