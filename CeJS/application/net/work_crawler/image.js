/**
 * @name WWW work crawler sub-functions
 * 
 * @fileoverview WWW work crawler functions: part of image
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
		name : 'application.net.work_crawler.image',

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

	function image_path_to_url(path, server) {
		if (path.includes('://')) {
			return path;
		}

		if (!server.includes('://')) {
			// this.get_URL_options.headers.Host = server;
			server = 'http://' + server;
		}
		return server + path;
	}

	function EOI_error_path(path, XMLHttp) {
		return path.replace(/(\.[^.]*)$/, this.EOI_error_postfix
		// + (XMLHttp && XMLHttp.status ? ' ' + XMLHttp.status : '')
		+ '$1');
	}

	// 下载单一个图片。
	// callback(image_data, status)
	function get_image(image_data, callback, images_archive) {
		// console.log(image_data);
		if (!image_data || !image_data.file || !image_data.url) {
			if (image_data) {
				image_data.has_error = true;
				image_data.done = true;
			}
			// 注意: 此时 image_data 可能是 undefined
			if (this.skip_error) {
				// gettext_config:{"id":"unspecified-image-data"}
				this.onwarning(gettext('未指定图片资料'), image_data);
			} else {
				// gettext_config:{"id":"unspecified-image-data"}
				this.onerror(gettext('未指定图片资料'), image_data);
			}
			if (typeof callback === 'function')
				callback(image_data, 'invalid_data');
			return;
		}

		/**
		 * 每张图片都要检查实际存在的图片档案。当之前已存在完整的图片时，就不再尝试下载图片。<br />
		 * 工作机制：<br />
		 * 检核`image_data.file`是否存在。`image_data.file`由图片的网址URL来判别可能的延伸档名。猜不出的会采用预设的图片延伸档名/副档名.default_image_extension。
		 * 
		 * @see function process_images() @ CeL.application.net.work_crawler.chapter
		 * 
		 * 若`image_data.file`不存在，将会检核所有可接受的图片类别副档名(.acceptable_types)。
		 * 每张图片都要检核所有可接受的图片类别，会加大硬碟读取负担。 会用到 .overwrite_old_file 这个选项的，应该都是需要提报
		 * issue 的，因此这个选项不会列出来。麻烦请在个别网站遇到此情况时提报 issue，列出作品名称以及图片类别，以供这边确认图片类别。
		 * 只要存在完整无损害的预设图片类别或是可接受的图片类别，就直接跳出，不再尝试下载这张图片。否则会重新下载图片。
		 * 当下载的图片以之前的图片更大时，就会覆盖原先的图片。
		 * 若下载的图片类别并非预设的图片类别(.default_image_extension)，例如预设 JPG 但得到 PNG
		 * 档案时，会将副档名改为实际得到的图像格式。因此下一次下载时，需要设定 .acceptable_types 才能找得到图片。
		 */
		var image_downloaded = node_fs.existsSync(image_data.file)
				|| this.skip_existed_bad_file
				// 检查是否已有上次下载失败，例如 server 上本身就已经出错的档案。
				&& node_fs.existsSync(this.EOI_error_path(image_data.file)), acceptable_types;

		if (!image_downloaded) {
			// 正规化 acceptable_types
			acceptable_types = image_data.acceptable_types
					|| this.acceptable_types;
			if (!acceptable_types) {
				// 未设定将不作检查。
			} else if (typeof acceptable_types === 'string') {
				acceptable_types = acceptable_types.trim();
				if (acceptable_types === 'images') {
					// 将会测试是否已经下载过一切可接受的档案类别。
					acceptable_types = Object.keys(this.image_types);
				} else {
					acceptable_types = acceptable_types.split('|');
				}
			} else if (!Array.isArray(acceptable_types)) {
				library_namespace.warn({
					// gettext_config:{"id":"invalid-acceptable_types-$1"}
					T : [ 'Invalid acceptable_types: %1', acceptable_types ]
				});
				acceptable_types = null;
			}

			if (acceptable_types) {
				// 检核所有可接受的图片类别(.acceptable_types)。
				image_downloaded = acceptable_types.some(function(extension) {
					var alternative_filename = image_data.file.replace(
							/\.[a-z\d]+$/, '.' + extension);
					if (node_fs.existsSync(alternative_filename)) {
						image_data.file = alternative_filename;
						return true;
					}
				});
			}
		}

		// 检查压缩档里面的图片档案。
		var image_archived, bad_image_archived;
		if (images_archive && images_archive.fso_path_hash
		// 检查压缩档，看是否已经存在图像档案。
		&& image_data.file.startsWith(images_archive.work_directory)) {
			image_archived = image_data.file
					.slice(images_archive.work_directory.length);
			bad_image_archived = images_archive.fso_path_hash[this
					.EOI_error_path(image_archived)];
			if (image_archived && bad_image_archived) {
				images_archive.to_remove.push(bad_image_archived);
			}

			if (false) {
				console.log([ images_archive.fso_path_hash, acceptable_types,
						image_archived,
						images_archive.fso_path_hash[image_archived] ]);
			}
			image_downloaded = image_downloaded
					|| images_archive.fso_path_hash[image_archived]
					|| this.skip_existed_bad_file
					// 检查是否已有上次下载失败，例如 server 上本身就已经出错的档案。
					&& bad_image_archived;

			if (!image_downloaded
			// 可以接受的图片类别/图片延伸档名/副档名/档案类别 acceptable file extensions
			&& acceptable_types) {
				image_downloaded = acceptable_types.some(function(extension) {
					var alternative_filename = image_archived.replace(
							/\.[a-z\d]+$/, '.' + extension);
					return images_archive.fso_path_hash[alternative_filename];
				});
			}
		}

		if (image_downloaded) {
			// console.log('get_image: Skip ' + image_data.file);
			image_data.done = true;
			if (typeof callback === 'function')
				callback(image_data, 'image_downloaded');
			return;
		}

		// --------------------------------------

		var _this = this,
		// 漫画图片的 URL。
		image_url = image_data.url, server = this.server_list;
		if (server) {
			server = server[server.length * Math.random() | 0];
			image_url = this.image_path_to_url(image_url, server, image_data);
		} else {
			image_url = this.full_URL(image_url);
		}
		image_data.parsed_url = image_url;
		if (!crawler_namespace.PATTERN_non_CJK.test(image_url)) {
			// 工具档应先编码URL。
			library_namespace.warn({
				// gettext_config:{"id":"invalid-url-must-encode-first-$1"}
				T : [ '必须先将URL编码：%1', image_url ]
			});
			// console.trace(image_url);
			if (!/%[\dA-F]{2}/i.test(image_url))
				image_url = encodeURI(image_url);
		}

		if (!image_data.file_length) {
			image_data.file_length = [];
		}
		// console.log('get_image: image_url: ' + image_url);
		// library_namespace.set_debug(3);

		this.get_URL(image_url, function(XMLHttp) {
			// console.trace(XMLHttp.status);
			// console.log(image_data);
			if (image_data.url !== XMLHttp.responseURL) {
				// 纪录最后实际下载的图片网址。
				image_data.responseURL = XMLHttp.responseURL;
			}

			/** {Buffer}图片数据的内容。 */
			var contents = XMLHttp.buffer;

			// 修正图片结尾 tail 非正规格式之情况。
			// TODO: 应该检测删掉后是正确的图片档，才删掉 trailing new line。
			if (_this.trim_trailing_newline && contents && contents.length > 4
			// 去掉最后的换行符号：有些图片在档案最后会添加上换行符号 "\r\n"，因此被判别为非正规图片档。
			&& contents.at(-2) === 0x0D && contents.at(-1) === 0x0A) {
				contents = contents.slice(0, -2);
			}

			if (_this.image_preprocessor) {
				// 图片前处理程序 预处理器 image pre-processing
				// 例如修正图片结尾非正规格式之情况。
				// 必须自行确保不会 throw，需检查 contents 是否非 {Buffer}。
				try {
					contents = _this.image_preprocessor(contents, image_data);
				} catch (e) {
					has_error = has_error || e;
				}
				// if _this.image_preprocessor() returns `false`,
				// will treat as bad file.
				if (contents === undefined)
					contents = XMLHttp.buffer;
			}

			var has_error = !contents || !(contents.length >= _this.MIN_LENGTH)
					|| (XMLHttp.status / 100 | 0) !== 2, verified_image;

			// console.trace([ image_url, XMLHttp.responseURL ]);
			if (!image_data.is_bad
			// image_data.is_bad may be set by _this.image_preprocessor()
			&& typeof _this.is_limited_image_url === 'function') {
				// 处理特殊图片: 检查是否下载到 padding 用的 404 档案。
				image_data.is_bad = _this.is_limited_image_url(
						XMLHttp.responseURL, image_data);
				if (!image_data.is_bad)
					delete image_data.is_bad;
				else if (image_data.is_bad === true)
					image_data.is_bad = 'is limited image';
			}

			if (!has_error) {
				image_data.file_length.push(contents.length);
				library_namespace.debug({
					// gettext_config:{"id":"completed-image-testing-$1"}
					T : [ '测试图片是否完整：%1', image_data.file ]
				}, 2, 'get_image');
				var file_type = library_namespace.file_type(contents);
				verified_image = file_type && !file_type.damaged;
				if (verified_image) {
					// console.log(_this.image_types);
					if (!file_type.extensions
					//
					|| !file_type.extensions.some(function(extension) {
						return extension in _this.image_types;
					})) {
						verified_image = false;
						library_namespace
								.warn({
									T : [
									// gettext_config:{"id":"unable-to-process-image-file-of-type-$2-$1"}
									file_type.type ? '无法处理类型为 %2 之图片档：%1'
									// gettext_config:{"id":"unable-to-determine-the-type-of-image-file-$1"}
									: '无法判别图片档之类型：%1', image_data.file,
											file_type.type ]
								});
					}

					var original_extension
					//
					= image_data.file.match(/[^.]*$/)[0].toLowerCase();
					if (file_type.extensions ?
					//
					!image_data.file.endsWith('.' + file_type.extension)
					// accept '.jpeg' as alias of '.jpg'
					&& !file_type.extensions.includes(original_extension)
					// 无法判别图片档类型时，若原副档名为图片档案类别则采用之。
					: !(original_extension in _this.image_types)) {
						// 依照所验证的档案格式改变副档名。
						image_data.file = image_data.file.replace(/[^.]+$/,
						// e.g. .png
						file_type.extension
						// 若是没有办法判别延伸档名，那么就采用预设的图片延伸档名。
						|| _this.default_image_extension);
					}
				}
			}
			// verified_image===true 则必然(!!has_error===false)
			// has_error表示下载过程发生错误，光是档案损毁，不会被当作has_error!
			// has_error则必然(!!verified_image===false)

			if (false) {
				console.log([ _this.skip_error, _this.MAX_ERROR_RETRY,
				//
				_this.MIN_LENGTH, has_error, _this.skip_error
				//
				&& image_data.error_count === _this.MAX_ERROR_RETRY ]);
				// 出错次数
				library_namespace.log({
					// gettext_config:{"id":"number-of-errors-$1"}
					T : [ '{{PLURAL:%1|%1}} 次错误', image_data.error_count ]
				});
			}
			if (verified_image || image_data.is_bad || _this.skip_error
			// 有出问题的话，最起码都需retry足够次数。
			&& image_data.error_count === _this.MAX_ERROR_RETRY
			//
			|| _this.allow_EOI_error
			//
			&& image_data.file_length.length > _this.MAX_EOI_ERROR) {
				// console.log(image_data.file_length);
				if (verified_image || image_data.is_bad || _this.skip_error
				// skip error 的话，不管有没有下载/获取过档案(包括404图像不存在)，依然 pass。
				// && image_data.file_length.length === 0
				//
				|| image_data.file_length.cardinal_1()
				// ↑ 若是每次都得到相同的档案长度，那就当作来源档案本来就有问题。
				&& (_this.skip_error || _this.allow_EOI_error
				//
				&& image_data.file_length.length > _this.MAX_EOI_ERROR)) {
					// 图片下载过程结束，不再尝试下载图片:要不是过关，要不就是错误太多次了。
					var bad_file_path = _this.EOI_error_path(image_data.file,
							XMLHttp);
					if (has_error || image_data.is_bad
							|| verified_image === false) {
						image_data.file = bad_file_path;
						image_data.has_error = true;
						if (_this.preserve_bad_image) {
							library_namespace.warn([ {
								T : has_error ? contents
								// gettext_config:{"id":"force-non-image-files-to-be-saved-as-images"}
								? '强制将非图片档储存为图片。'
								// gettext_config:{"id":"force-empty-content-to-be-saved-as-an-image"}
								: '强制将空内容储存为图片。'
								// assert: (!!verified_image===false)
								// 图档损坏: e.g., Do not has EOI
								// gettext_config:{"id":"force-storage-of-damaged-image"}
								: '强制储存损坏的图片。'
							}, XMLHttp.status
							// 状态码正常就不显示。
							&& (XMLHttp.status / 100 | 0) !== 2 ? {
								// gettext_config:{"id":"http-status-code-$1"}
								T : [ 'HTTP status code %1.', XMLHttp.status ]
							} : '',
							// 显示 crawler 程式指定的错误。
							image_data.is_bad ? {
								// gettext_config:{"id":"error-$1"}
								T : [ 'Error: %1.', image_data.is_bad ]
							} : '', contents ? {
								// gettext_config:{"id":"file-size-$1"}
								T : [ 'File size: %1.',
								//
								CeL.to_KiB(contents.length) ]
							} : '',
							//
							': ' + image_data.file + '\n← ' + image_url ]);
						}
						if (!contents
						// 404之类，就算有内容，也不过是错误讯息页面。
						|| (XMLHttp.status / 100 | 0) === 4) {
							contents = '';
						}
					} else {
						// pass, 过关了。
						if (node_fs.existsSync(bad_file_path)) {
							library_namespace.info({
								// gettext_config:{"id":"delete-corrupted-old-image-file-$1"}
								T : [ '删除损坏的旧图片档：%1', bad_file_path ]
							});
							library_namespace.fs_remove(bad_file_path);
						}
						if (bad_image_archived) {
							// 登记压缩档内可以删除的损坏图档。
							images_archive.to_remove.push(bad_image_archived);
						}
					}

					var old_file_status, old_archived_file =
					// image_data.has_error?bad_image_archived:image_archived
					image_archived || bad_image_archived;
					try {
						old_file_status = node_fs.statSync(image_data.file);
					} catch (e) {
						// old/bad file not exist
					}

					if (old_archived_file && (!old_file_status
					//
					|| old_archived_file.size > old_file_status.size)) {
						// 压缩档内的图像质量更好的情况，那就采用压缩档的。
						if (old_file_status
								&& old_archived_file.size < contents.length) {
							library_namespace.warn({
								T : [ _this.archive_images
								// gettext_config:{"id":"the-quality-of-the-image-in-the-archive-is-better-than-in-the-directory-but-will-be-overwritten-after-downloading-$1"}
								? '压缩档内的图片品质比目录中的更好，但在下载完后将可能在压缩时被覆盖：%1'
								// gettext_config:{"id":"the-quality-of-the-image-in-the-archive-is-better-than-in-the-directory-$1"}
								: '压缩档内的图片品质比目录中的更好：%1',
								//
								old_archived_file.path ]
							});
						}

						old_file_status = old_archived_file;
					}

					if (!old_file_status || _this.overwrite_old_file
					// 得到更大的档案，写入更大的档案。
					&& !(old_file_status.size >= contents.length)) {
						if (_this.image_post_processor) {
							// 图片后处理程序 image post-processing
							contents = _this.image_post_processor(contents,
									image_data
							// , images_archive
							)
									|| contents;
						}

						if (!image_data.has_error || _this.preserve_bad_image) {
							library_namespace.debug({
								// gettext_config:{"id":"save-image-data-to-your-hard-drive-$1"}
								T : [ '保存图片数据到硬碟上：%1', image_data.file ]
							}, 1, 'get_image');
							// TODO: 检查旧的档案是不是文字档。例如有没有包含 HTML 标签。
							try {
								node_fs
										.writeFileSync(image_data.file,
												contents);
							} catch (e) {
								library_namespace.error(e);
								// gettext_config:{"id":"unable-to-write-to-image-file-$1"}
								var message = [ gettext('无法写入图片档案 [%1]。',
										image_data.file) ];
								if (e.code === 'ENOENT') {
									message.push(gettext(
									// TODO: show chapter_directory 当前作品章节目录：
									// gettext_config:{"id":"it-may-be-because-the-download-directory-of-the-work-has-changed-and-the-cache-data-points-to-the-old-location-that-does-not-exist"}
									'可能因为作品下载目录改变了，而快取资料指向不存在的旧位置。'));
								} else {
									message.push(gettext(
									// gettext_config:{"id":"it-may-be-because-the-work-information-cache-is-different-from-the-structure-of-the-work-chapter-on-the-current-website"}
									'可能因为作品资讯快取与当前网站上之作品章节结构不同。'));
								}
								message.push(gettext(
								// https://github.com/kanasimi/work_crawler/issues/278
								// gettext_config:{"id":"if-you-have-downloaded-this-work-before-please-save-the-original-work-catalog-or-rename-the-work-cache-file-(the-work-id.json-under-the-work-directory)-and-try-the-new-download"}
								'若您之前曾经下载过本作品的话，请封存原有作品目录，或将作品资讯快取档（作品目录下的 作品id.json）改名之后尝试全新下载。'
								//
								));
								_this.onerror(message.join('\n'), image_data);
								if (typeof callback === 'function') {
									callback(image_data,
											'image_file_write_error');
								}
								return Work_crawler.THROWED;
							}
						}
					} else if (old_file_status
							&& old_file_status.size > contents.length) {
						library_namespace.log({
							T : [
									// gettext_config:{"id":"there-is-a-large-old-file-($2)-that-will-not-be-overwritten-$1"}
									'存在较大的旧档 (%2)，将不覆盖：%1',
									image_data.file,
									old_file_status.size + '>'
											+ contents.length ]
						});
					}
					image_data.done = true;
					if (typeof callback === 'function')
						callback(image_data/* , 'OK' */);
					return;
				}
			}

			// 有错误。下载图像错误时报错。
			var message;
			if (verified_image === false) {
				// 图档损坏: e.g., Do not has EOI
				message = [ {
					// gettext_config:{"id":"image-damaged"}
					T : '图档损坏：'
				} ];
			} else {
				// 图档没资格验证。
				message = [ {
					// gettext_config:{"id":"failed-to-get-image"}
					T : '无法取得图片。'
				}, XMLHttp.status ? {
					// gettext_config:{"id":"http-status-code-$1"}
					T : [ 'HTTP status code %1.', XMLHttp.status ]
				} : '', {
					// gettext_config:{"id":"image-without-content"}
					T : !contents ? '图片无内容：' : [
					//
					contents.length < _this.MIN_LENGTH
					// gettext_config:{"id":"$1-bytes-too-small"}
					? '档案过小，仅 %1 {{PLURAL:%1|位元组}}：'
					// gettext_config:{"id":"$1-bytes"}
					: '档案仅 %1 {{PLURAL:%1|位元组}}：', contents.length ]
				} ];
			}
			message.push(image_url + '\n→ ' + image_data.file);
			library_namespace.warn(message);
			// Release memory. 释放被占用的记忆体。
			message = null;

			if (image_data.error_count === _this.MAX_ERROR_RETRY) {
				image_data.has_error = true;
				// throw new Error(_this.id + ': ' +
				// gettext('MESSAGE_NEED_RE_DOWNLOAD'));
				library_namespace.log(_this.id + ': '
				// gettext_config:{"id":"message_need_re_download"}
				+ gettext('MESSAGE_NEED_RE_DOWNLOAD'));
				// console.log('error count: ' + image_data.error_count);
				if (contents && contents.length > 10
				//
				&& contents.length < _this.MIN_LENGTH
				// 档案有验证过，只是太小时，应该不是 false。
				&& verified_image !== false
				// 就算图像是完整的，只是比较小，HTTP status code 也应该是 2xx。
				&& (XMLHttp.status / 100 | 0) === 2) {
					library_namespace.warn([ {
						// gettext_config:{"id":"perhaps-the-image-is-complete-just-too-small-and-not-up-to-standard-such-as-an-almost-blank-image"}
						T : '或许图片是完整的，只是过小而未达标，例如几乎为空白之图片。'
					}, {
						// gettext_config:{"id":"work_crawler-skip-image-error-prompt"}
						T : [ 'work_crawler-skip-image-error-prompt',
						//
						contents.length,
						//
						JSON.stringify(_this.EOI_error_postfix) ]
					} ]);

				} else if (image_data.file_length.length > 1
						&& !image_data.file_length.cardinal_1()) {
					library_namespace.warn([ {
						// gettext_config:{"id":"the-downloaded-image-is-different-in-size-$1"}
						T : [ '下载所得的图片大小不同：%1。', image_data.file_length ]
					}, {
						// gettext_config:{"id":"if-it-is-not-because-the-website-cuts-off-the-connection-early-then-you-may-need-to-increase-the-time-limit-to-provide-enough-time-to-download-the-image"}
						T : '若非因网站提早截断连线，那么您或许需要增长时限来提供足够的时间下载图片？'
					} ]);
					// TODO: 提供续传功能。
					// e.g., for 9mdm.js→dagu.js 魔剑王 第59话 4392-59-011.jpg

				} else if (!_this.skip_error) {
					library_namespace.info([ {
						// gettext_config:{"id":"if-the-error-persists-you-can-set-skip_error=true-to-ignore-the-image-error"}
						T : '若错误持续发生，您可以设定 skip_error=true 来忽略图片错误。'
					}, {
						// gettext_config:{"id":"you-must-set-the-skip_error-or-allow_eoi_error-option-to-store-corrupted-files"}
						T : '您必须设定 skip_error 或 allow_EOI_error 选项，才会储存损坏的档案。'
					}, {
						// gettext_config:{"id":"if-you-need-to-re-download-the-section-that-failed-to-download-before-turn-on-the-recheck-option"}
						T : '若您需要重新下载之前下载失败的章节，请开启 recheck 选项。'
					} ]);
				}

				// gettext_config:{"id":"failed-to-download-image"}
				_this.onerror(gettext('图片下载错误'), image_data);
				// image_data.done = false;
				if (typeof callback === 'function')
					callback(image_data, 'image_download_error');
				return Work_crawler.THROWED;
				// 网页介面不可使用process.exit()，会造成白屏
				// process.exit(1);
			}

			image_data.error_count = (image_data.error_count | 0) + 1;
			library_namespace.log([ 'get_image: ', {
				// gettext_config:{"id":"retry-$1-$2"}
				T : [ 'Retry %1/%2',
				//
				image_data.error_count, _this.MAX_ERROR_RETRY ]
			}, '...' ]);
			var get_image_again = function() {
				_this.get_image(image_data, callback, images_archive);
			}
			if (image_data.time_interval > 0) {
				library_namespace.log_temporary([ 'get_image: ', {
					// gettext_config:{"id":"waiting-for-$2-and-retake-the-image-$1"}
					T : [ '等待 %2 之后再重新取得图片：%1', image_data.url,
					//
					library_namespace.age_of(0, image_data.time_interval, {
						digits : 1
					}) ]
				} ]);
				setTimeout(get_image_again, image_data.time_interval);
			} else
				get_image_again();

		}, null, Object.assign({
			/**
			 * 最多平行下载/获取档案(图片)的数量。
			 * 
			 * <code>
			incase "MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 connect listeners added. Use emitter.setMaxListeners() to increase limit"
			</code>
			 */
			max_listeners : 300,
			fetch_type : 'image'
		}, this.get_URL_options, image_data.get_URL_options), 'buffer');
	}

	// --------------------------------------------------------------------------------------------

	// export 导出.

	// @instance
	Object.assign(Work_crawler.prototype, {
		// 可接受的图片类别（延伸档名）。以 "|" 字元作分隔，如 "webp|jpg|png"。未设定将不作检查。输入 "images"
		// 表示接受所有图片。
		// 若下载的图片不包含在指定类型中，则会视为错误。本工具只能下载特定几种图片类型。本选项仅供检查图片，非用来挑选想下载的图片类型。
		// {Array|String}可以接受的图片类别/图片延伸档名/副档名/档案类别 acceptable file extensions。
		// acceptable_types : 'images',
		// acceptable_types : 'png',
		// acceptable_types : 'webp|png',
		// acceptable_types : ['webp', 'png'],

		// 当图片不存在 EOI (end of image) 标记，或是被侦测出非图片时，依旧强制储存档案。
		// allow image without EOI (end of image) mark. default:false
		// allow_EOI_error : true,
		// 图片档案下载失败处理方式：忽略/跳过图片错误。当404图片不存在、档案过小，或是被侦测出非图片(如不具有EOI)时，依旧强制储存档案。default:false
		// skip_error : true,
		//
		// 若已经存在坏掉的图片，就不再尝试下载图片。default:false
		// skip_existed_bad_file : true,
		//
		// 循序逐个、一个个下载图片。仅对漫画有用，对小说无用。小说章节皆为逐个下载。 Download images one by one.
		// default: 同时下载本章节中所有图片。 Download ALL images at the same time.
		// 若设成{Natural}大于零的数字(ms)或{String}时间长度，那会当成下载每张图片之时间间隔 time_interval。
		// cf. .chapter_time_interval
		// one_by_one : true,
		//
		// e.g., '2-1.jpg' → '2-1 bad.jpg'
		EOI_error_postfix : ' bad',
		// 加上有错误档案之注记。
		EOI_error_path : EOI_error_path,

		image_path_to_url : image_path_to_url,

		get_image : get_image
	});

	// 不设定(hook)本 module 之 namespace，仅执行 module code。
	return library_namespace.env.not_to_extend_keyword;
}
