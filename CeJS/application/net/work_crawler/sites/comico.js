/**
 * @name CeL module for downloading comico comics.
 * 
 * @fileoverview 本档案包含了解析并处理、批量下载 韩国 NHN comico Corp. 漫画 的工具。
 * 
 * 2021/12/22 改版
 * 
 * <code>

CeL.comico(configuration, function(crawler) {
	start_crawler(crawler, typeof module === 'object' && module);
}, function(crawler) {
	setup_crawler(crawler, typeof module === 'object' && module);
});

 </code>
 * 
 * @see http://comico.kr/
 * 
 * @since 2018/8/19 5:49:8 模组化。
 */

// More examples:
// @see
// https://github.com/kanasimi/work_crawler/blob/master/comic.cmn-Hans-CN/comico.js
'use strict';

// --------------------------------------------------------------------------------------------

// 不采用 if 陈述式，可以避免 Eclipse JSDoc 与 format 多缩排一层。
typeof CeL === 'function' && CeL.run({
	// module name
	name : 'application.net.work_crawler.sites.comico',

	require : 'application.net.work_crawler.',

	// 设定不汇出的子函式。
	no_extend : '*',

	// 为了方便格式化程式码，因此将 module 函式主体另外抽出。
	code : module_code
});

function module_code(library_namespace) {

	// requiring

	// --------------------------------------------------------------------------------------------

	function add_navigation_data(data, html) {
		var navigation_data;
		try {
			navigation_data = JSON.parse(html.between(
			// コミコ 日文版有时 json 结构有问题。
			// e.g., http://www.comico.jp/articleList.nhn?titleNo=3410
			'<script type="application/ld+json">', '</script>')
			// e.g., http://www.comico.com.tw/2870/17/
			.replace(/\t+"/g, '"'));
		} catch (e) {
			// TODO: handle exception
		}
		return Object.assign(data, navigation_data);
	}

	var PATTERN_work_info = /<(p|div) class="[^<>"]+?__(author|(?:sub-)?description|meta)">([\s\S]+?)<\/\1>/g,
	// assert: (NO_ticket_notified>=0) === false
	// gettext_config:{"id":"no-read-volumes-are-available"}
	NO_ticket_notified = '已无阅读卷可用。', auto_use_ticket_notified,
	// 可以用阅读卷阅读的章节。
	READABLE_FLAG = 'W',
	//
	default_configuration = {
		// 所有的子档案要修订注解说明时，应该都要顺便更改在CeL.application.net.comic中Comic_site.prototype内的母comments，并以其为主体。

		// e.g., 20099 俺のメンタルは限界です\0003 3话 「マンガを描く原点」\20099-3-022.jpg
		MIN_LENGTH : 180,

		// one_by_one : true,
		base_URL : '',

		// have already read the chapter
		set_downloaded_if_read : true,

		convert_id : {
			// switch
			// 警告: 需要自行呼叫 insert_id_list(id_list);
			adult : function(insert_id_list, get_label) {
				// TW only: 此前被当作是一般作品。
				library_namespace.info([ this.id + ': ', {
					// gettext_config:{"id":"subsequent-titles-of-the-work-are-considered-to-be-web-limited-works"}
					T : '此后的作品标题都被当作是网页限定作品。'
				} ]);
				// webonly
				this.adult = true;
				insert_id_list();
			}
		},

		// 解析 作品名称 → 作品id get_work()
		search_URL : function(work_title) {
			var url = (this.adult ? 'webonly/' : '')
			// ↑ webonly, オトナ限定: TW only
			+ 'search/index.nhn?searchWord='
					+ encodeURIComponent(work_title.replace(/\s+\d+$/, ''));
			if (this.base_URL.includes('\/\/plus.comico')) {
				url = this.base_URL
						.replace('\/\/plus.comico', '\/\/www.comico')
						+ url;
			}
			return url;
		},
		// 每个项目的<li>开头。
		search_head_token : '<li class="list-article02__item">',
		// title 不能用 [^<>"]+ : for case of "蔷薇的叹息 <蔷薇色的疑云 I>"
		PATTERN_search : /<a href="[^<>"]*?\/(\d+)\/"[^<>]*? title="([^"]+)"/,
		parse_search_result : function(html, get_label) {
			// console.log(html);
			html = html.between(' id="officialList">') || html;
			// console.log(html);
			var _this = this, id_list = [], id_data = [];
			html.each_between(this.search_head_token, '</li>', function(token) {
				// console.log(token);
				var matched = token.match(_this.PATTERN_search);
				// console.log(matched);
				if (matched) {
					// コミコ有些整本卖的作品，而非一话一话。
					id_list.push(matched[1]);
					id_data.push(get_label(matched[2]));
				}
			});

			return [ id_list, id_data ];
		},

		// 取得作品的章节资料。 get_work_data()
		work_URL : function(work_id) {
			return work_id + '/';
		},
		parse_work_data : function(html, get_label, extract_work_data) {
			// console.log(html);

			if (this.archive_old_works) {
				// 因为不会遍历所有章节档案，得到的是错误的 `work_data.last_file_modified_date`。
				// 因此必须避免执行 check_and_archive_old_work()。
				library_namespace.warn([ this.id + ': ', {
					// gettext_config:{"id":"this-website-does-not-support-the-function-of-archiving-old-works-(.archive_old_works)"}
					T : '本网站不支援封存旧作品功能 (.archive_old_works)！'
				} ]);
				this.archive_old_works = false;
			}

			var cmnData = html.between('var cmnData =', '</script>'), matched;
			if (!cmnData) {
				// 公式作品の「掲载终了日」について、お知らせいたします。
				// 出版社の都合により、以下2作品を掲载终了とさせていただきます。
				// 更新中の掲载终了につき、大変ご迷惑をおかけし申し訳ございません。

				// 下记の公式作品は既に掲载终了しています。
				matched = get_label(html.between(
				// <p class="m-section-error__heading">お探しのページは存在しません</p>
				'<p class="m-section-error__heading">', '</p>'));
				if (matched) {
					throw new Error(matched);
				}
			}

			eval('cmnData=' + cmnData);

			var title = (html.between('<h1 class="article', '</h1>') || html
					.between('<h1', '</h1>')).between('>'), tags = [];
			/**
			 * e.g., http://www.comico.com.tw/challenge/3263/ 去除label
			 * 
			 * <code>

			<h1 class="article-hero03__ttl"><i class="i-label i-label--fill article-hero03__ttl-icon">精选</i><span class="o-hidden _challengeTitle">小恶魔与草莓男友</span></h1>

			</code>
			 */
			if (title.includes('</i>')) {
				tags.push(get_label(title.between(null, '</i>')));
				title = title.between('</i>');
			}
			var work_data = {
				// 必要属性：须配合网站平台更改。
				// <h1 class="article-hero05__ttl">美丽的代价</h1>
				title : get_label(title),

				// 选择性属性：须配合网站平台更改。
				tags : tags
			};

			extract_work_data(work_data, html);

			// e.g., '<li class="article-hero03__list-tag-item">中篇故事</li>'
			html.each_between('list-tag-item">', '</li>', function(text) {
				tags.push(get_label(text));
			});

			// JavaScript Object Notation for Linked Data 关联的资料
			matched = html.between('<script type="application/ld+json">',
					'</script>');
			if (matched) {
				// Structured Data 结构化资料
				// https://search.google.com/structured-data/testing-tool
				try {
					matched = JSON.parse(matched);
					work_data.linked_data = matched;
				} catch (e) {
					// library_namespace.error(matched);
				}
			}

			while (matched = PATTERN_work_info.exec(html)) {
				if (matched[3] = get_label(matched[3]).replace(/\t/g, ''))
					work_data[matched[2]] = matched[3];
			}

			Object.assign(add_navigation_data(work_data, html),
			// 警告: 这会留下个人资讯！
			cmnData, {
				// 更新日期：每周连载时间/是否为完结作品。 e.g., 完结作品, 每周六, 隔周周日
				status : get_label(html.between('__info-value">', '</dd>')
				// コミコ e.g., 完结作品, 毎周金曜日
				|| html.between('<span class="o-txt-bold">', '</span>'))
						.replace(/[\s\n]{2,}/g, '  '),
				// 可用的阅读券数量。
				ticket_left : (cmnData.eventRentalTicket || 0)
				// 若是不用等的话，表示已收到阅读券，还有一张可用。
				+ (cmnData.time && cmnData.time.leftTime === 0 ? 1 : 0),
				last_checked : null
			});
			if (cmnData.time && cmnData.time.leftTime > 0) {
				library_namespace.info({
					// gettext_config:{"id":"the-next-time-you-receive-a-reading-voucher-you-will-need-$1"}
					T : [ '下次收到阅读券还要 %1。',
					// レンタル券で无料 レンタル券が届きました（1日で回复）
					// 作品を1话レンタルできます
					library_namespace.age_of(0, 1000 * cmnData.time.leftTime) ]
				});
			}

			// console.log(work_data);
			return work_data;
		},
		chapter_list_URL : function(work_id, work_data) {
			// console.log(work_data);
			// library_namespace.set_debug(9);
			var api = work_data.api && work_data.api.articleListAPI;
			if (!api) {
				api = work_data.isOfficial === false
				// 2019/10: 'api/getArticleListAll.nhn' 没有 .freeFlg
				// 标记，无法自动使用阅读卷。
				// 但是对新手村作品如 '3729 神光拜达摩' 来说，
				// 用 'api/getArticleListAll.nhn' 才能取得所有作品之列表。
				//
				// https://github.com/kanasimi/work_crawler/issues/384
				// 第一次执行时，尚未取得 .isOfficial 标记，必须先采用 api/getArticleList.nhn
				? 'api/getArticleListAll.nhn'
				// 2019/9: 'api/getArticleList.nhn'
				: 'api/getArticleList.nhn'
			}
			return [ api, {
				titleNo : work_id
			} ];
		},
		get_chapter_list : function(work_data, html, get_label) {
			if (!Array.isArray(work_data.downloaded_chapter_list))
				work_data.downloaded_chapter_list = [];

			// console.log(html);
			var recerse_count = 0;
			html = JSON.parse(html);
			html = html.result;
			// for 'api/getArticleList.nhn', there is no .totalPageCnt
			if (('totalPageCnt' in html) && html.totalPageCnt !== 1) {
				console.log(html);
				throw new Error(work_data.title + ': ' + 'Total page is '
						+ html.totalPageCnt + ', not 1!');
			}
			// 作品改变 titleNo 时，旧 id 可能会回传 `{"result":{}}`
			html.list.forEach(function(chapter_data, index) {
				chapter_data.url = chapter_data.articleDetailUrl;
				// 原先都将标题设在 subtitle，title 没东西。
				chapter_data.title = get_label(chapter_data.subtitle);
				if (this.set_downloaded_if_read
						&& !work_data.downloaded_chapter_list[index]) {
					work_data.downloaded_chapter_list[index]
					// 记录是否已经下载过本章节。
					= chapter_data.read;
				}
				if (index > 0) {
					recerse_count += Math.sign(html.list[index - 1].articleNo
							- chapter_data.articleNo);
				}
			}, this);
			work_data.chapter_list = html.list;
			// 预防尾大不掉。
			delete html.list;
			// console.log(recerse_count);
			if (recerse_count > 0) {
				library_namespace.info([ work_data.title + ': ', {
					// gettext_config:{"id":"change-the-list-of-reversed-chapters-to-positive-order"}
					T : '将倒序章节列表转为正序。'
				} ]);
				work_data.chapter_list.reverse();
			}
			Object.assign(work_data, html);

			// 先检查是不是还有还有没读过的章节。
			if (work_data.ticket_left > 0) {
				if (work_data.last_download) {
					work_data.chapter_list.some(function(chapter_data, index) {
						if (++index >= work_data.last_download.chapter) {
							return true;
						}
						if (!chapter_data.freeFlg) {
							throw new Error(this.id + ': '
									+ '网站改版？未发现 .freeFlg！');
						}
						if (!work_data.downloaded_chapter_list[index]
								&& chapter_data.freeFlg === READABLE_FLAG) {
							library_namespace.info([ work_data.title + ': ', {
								// gettext_config:{"id":"there-are-still-$1-reading-volume-but-$2-$3-chapter-has-not-been-downloaded-yet.-so-checking-from-this-chapter"}
								T : [ '还有%1张{{PLURAL:%1|阅读卷}}，且第 %2/%3 章还有没下载过，从此章开始检查。',
								//
								work_data.ticket_left, index,
								//
								work_data.chapter_list.length ]
							} ]);
							work_data.last_checked
							// 记录最后检查过的章节。
							= work_data.last_download.chapter;
							work_data.last_download.chapter = index;
							return true;
						}
					});
				} else {
					work_data.recheck = true;
				}
			}
		},

		consume_url : 'consume/index.nhn',
		pre_parse_chapter_data
		// 执行在解析章节资料 process_chapter_data() 之前的作业 (async)。
		// 必须自行保证执行 callback()，不丢出异常、中断。
		: function(XMLHttp, work_data, callback, chapter_NO) {
			// console.log(work_data);
			var chapter_data = work_data.chapter_list[chapter_NO - 1],
			//
			skip_chapter = !chapter_data.price || chapter_data.isPurchased && {
				// gettext_config:{"id":"«$1»-has-been-purchased"}
				T : [ '已购买章节《%1》。', chapter_data.title ]
			};
			// console.log(chapter_data);
			if (!skip_chapter && chapter_data.expireDate > 0) {
				skip_chapter = {
					// gettext_config:{"id":"you-can-read-«$3»-in-this-section-before-$1-(and-$2)"}
					T : [ '在 %1 之前（还有 %2）可以阅读本章节《%3》。',
					//
					new Date(chapter_data.expireDate).format('%m/%d %H:%M'),
					//
					library_namespace.age_of(Date.now(),
					//
					chapter_data.expireDate), chapter_data.title ]
				};
			}
			if (!skip_chapter
					&& work_data.downloaded_chapter_list[chapter_NO - 1]) {
				// TODO: 应该检查是不是真的有图片档案存在。若有档案不见，
				// 或者有损坏档案，
				// 那么就把 work_data.downloaded_chapter_list[index] 设成 false。
				skip_chapter = {
					// gettext_config:{"id":"the-section-«$1»-has-been-downloaded-before-and-will-not-be-re-purchased"}
					T : [ '之前已下载过章节《%1》，不再重新购买。', chapter_data.title ]
				};
			}
			if (!skip_chapter && chapter_data.freeFlg !== READABLE_FLAG) {
				// N: TW: 本章节需要钱(coin)来阅读。
				if (chapter_data.freeFlg === 'N'
				// P: JP: 本章节需要钱(30コイン) or point(15ポイント)来阅读。
				|| chapter_data.freeFlg === 'P') {
					skip_chapter = true;
				} else {
					skip_chapter = {
						// gettext_config:{"id":"the-status-of-this-chapter-is-unknown-($1).-skipping-$1-does-not-use-reading-volumes"}
						T : [ '本章节状况不明(%1)。跳过《%1》不采用阅读卷。',
								chapter_data.freeFlg, chapter_data.title ]
					};
				}
			}
			if (!skip_chapter && !(work_data.ticket_left > 0)) {
				if (work_data.ticket_left !== NO_ticket_notified) {
					work_data.ticket_left = NO_ticket_notified;
					skip_chapter = [ {
						T : NO_ticket_notified
					}, {
						T : [ '跳过《%1》，不使用阅读券。', chapter_data.title ]
					} ];
				} else
					skip_chapter = true;
			}
			if (!skip_chapter && !this.auto_use_ticket) {
				skip_chapter = auto_use_ticket_notified ? true
						// @see https://github.com/kanasimi/work_crawler
						: {
							// gettext_config:{"id":"the-tool-is-not-set-to-automatically-use-the-reading-volume.-if-you-are-not-using-the-installation-package-and-want-to-have-the-tool-automatically-use-the-reading-volume-please-open-the-file-manager"}
							T : '未设定让本工具自动使用阅读卷。若您并非使用安装包，并想要让本工具自动使用阅读卷，请打开档案总管，到安装本工具的目录下（若是您使用安装包，就不能够设定帐号密码了。），在「work_crawler.configuration.js」这个 .js 组态档案中设定好帐号密码资料，并设定「auto_use_ticket:true」。您可以参考 work_crawler.default_configuration.js 这个档案来做设定。'
						};
				auto_use_ticket_notified = true;
			}

			if (skip_chapter) {
				if (skip_chapter !== true) {
					if (!Array.isArray(skip_chapter)) {
						skip_chapter = [ skip_chapter ];
					}
					skip_chapter.unshift(work_data.title, ': ');
					library_namespace.info(skip_chapter);
				}
				callback();
				return;
			}

			// http://www.comico.com.tw/notice/detail.nhn?no=751
			library_namespace.info([ work_data.title + ': ', {
				// gettext_config:{"id":"reading-«$1»-with-a-reading-voucher"}
				T : [ '用阅读券阅读《%1》。', chapter_data.title ]
			} ]);
			var _this = this, html = XMLHttp.responseText;
			this.get_URL(this.consume_url, function(XMLHttp) {
				// console.log(XMLHttp.responseText);

				var matched = XMLHttp.responseText && XMLHttp.responseText
				// var msg = '很抱歉，帐号需要通过电话认证才可购买。';
				.match(/[\s;]msg *= *'([^']+)/);
				if (matched) {
					library_namespace
							.error(work_data.title + ': ' + matched[1]);
					// 归零。
					work_data.ticket_left = 1;
				}

				if (--work_data.ticket_left === 0
				// 仅仅下载有阅读券的章节，然后就回到最后读取的章节。
				&& work_data.last_checked > 0) {
					// 回到原先应该检查的章节号码。
					work_data.jump_to_chapter = work_data.last_checked;
					delete work_data.last_checked;
				}
				// XMLHttp 只是一个转址网页，必须重新撷取网页。
				_this.get_URL(chapter_data.url, callback);

			}, {
				titleNo : work_data.id,
				articleNo : chapter_data.articleNo,
				// K: 专用阅读券, P: 用point, C: 用coin购买
				paymentCode : 'K',
				// 使用coin时才需要
				// https://github.com/zhongfly/comico/blob/master/comico.py
				// ['http://www.comico.com.tw/consume/coin/publish.nhn',{paymentCode:'C'}]
				// JSON.parse(result).result.coinUseToken
				coinUseToken : '',
				// 5, 6, コミコ:36, ...?
				productNo : html
				//
				.between(' name="productNo" value="', '"') || 5,
				// coin price
				price : chapter_data.price,
				// 用coin租用价格，一般能租用的都可以用阅读券。 コミコ: 20
				rentalPrice : html.between(' name="rentalPrice" value="', '"')
						|| '',
				// point price, コミコ 漫画作品无此项, TW only
				pointRentalPrice : html.between(
						' name="pointRentalPrice" value="', '"') || 120
			});
		},
		parse_chapter_data : function(html, work_data, get_label, chapter_NO) {
			// http://static.comico.com.tw/tw/syn/spn/js/manga/article/plusMangaDetailApp/app.1.12.0.js
			var chapter_data = work_data.chapter_list[chapter_NO - 1],
			//
			cmnData = html.between('var cmnData =', '</script>');
			// console.log(cmnData);
			if (cmnData) {
				eval('cmnData=' + cmnData);
			} else if (cmnData = html.between(
			// e.g., http://plus.comico.jp/manga/24517/8/
			'<p class="m-section-error__heading">', '</p>')) {
				var message = work_data.title + ' §' + chapter_NO + ' '
						+ chapter_data.title + ': ' + cmnData;
				if (cmnData !== 'お探しのページは存在しません') {
					throw new Error(message);
				}
				library_namespace.error(message);
				return chapter_data;
			}

			var matched, image_url_list = html.between(
			// TW: <div class="locked-episode__kv _lockedEpisodeKv"
			// コミコ: <div class="locked-episode locked-episode--show-kv">
			'<div class="locked-episode', '</div>');
			if (image_url_list) {
				chapter_data.limited = true;
				// TW: style="background-image: url('...');">
				image_url_list = image_url_list.between("url('", "'")
				// コミコ: <img src=".jpg" width="88" height="88" alt="" />
				|| image_url_list.between(' src="', '"');
				// 日文版plus.comico 此时虽然有 {Array}cmnData.imageData
				// 但缺少hash而不能取得。
				if (/\.jpg$/.test(image_url_list)) {
					// 日文版plus.comico 此时仅有一个缩图可用，跳过不取。
					cmnData.imageData = [];
				} else if (cmnData.imageData
						&& cmnData.imageData.filter(function(url) {
							return url && !/\.jpg$/.test(url);
						}).length > 0) {
					// 应该不会到这里来了。
					cmnData.imageData.unshift(image_url_list);
				} else {
					// 中文版的状况。
					cmnData.imageData = [ image_url_list ];
				}

			} else if (image_url_list = html
			// comico_jp: <div class="comic-image _comicImage">
			// e.g., 新手村
			.between(' _comicImage">', '</div>')) {
				// 一般正常可取得图片的情况。
				// 去除 placeholder。 <div class="comic-image__blank-layer">
				image_url_list = image_url_list.between(null, '<div ')
						|| image_url_list;
				image_url_list = image_url_list.all_between(' src="', '"');
				// assert: {Array}image_url_list
				if (cmnData.imageData) {
					// 中文版, 日文版plus.comico 将除第一张外所有图片网址放在
					// {Array}cmnData.imageData 里面。
					if (image_url_list.length === 1) {
						cmnData.imageData.unshift(image_url_list[0]);

					} else if (
					/**
					 * e.g.,
					 * http://www.comico.jp/detail.nhn?titleNo=27605&articleNo=1
					 * <code>

					<div class="swiper-wrapper _swiperWrapper _comicImage">
					<!-- Slides -->
					<div class="swiper-slide _swiperSlide o-hidden">
					<div dir="ltr">
					<div id="_popIn_video"></div>

					</code>
					 */
					!html.includes(' class="swiper-slide _swiperSlide')) {
						// gettext_config:{"id":"web-page-revision?-unable-to-parse"}
						var message = '网页改版？无法解析！';
						if (library_namespace.gettext)
							message = library_namespace.gettext(message);
						throw new Error('parse_chapter_data: '
								+ work_data.title + ' §' + chapter_NO + ': '
								+ message);
						Array.prototype.unshift.apply(cmnData.imageData,
								image_url_list);
					}

				} else {
					// コミコ 日文版一般漫画将所有图片放在这之间，无 cmnData.imageData。
					cmnData.imageData = image_url_list;
				}

			} else if (matched = html
			// e.g., https://www.comico.jp/detail.nhn?titleNo=4235&articleNo=219
			.match(/<h2 class="[^"<>]*o-txt-error[^"<>]*">([\s\S]+?)<\/h2>/)) {
				var message = get_label(matched[1]);
				throw new Error(work_data.title + ' §' + chapter_NO + ': '
						+ message);

			} else if (html.includes('<p class="error-section__ttl">')) {
				var message = get_label(html.between(
				/**
				 * <code>

				<div class="error-section o-mt100 o-mb100">
				<p class="error-section__ttl">无法阅读</p>
				<p class="error-section__description">本话正在审查当中。<br/>审查完成后将会开放阅读</p>
				<p class="o-mt30"><a href="" class="btn03" onclick="javascript:history.back();">离开</a></p>
				        <!-- /.m-section-error --></div>

				</code>
				 */
				'<p class="error-section__ttl">', '</p>'))
				//
				+ ': ' + get_label(html.between(
				//
				'<p class="error-section__description">', '</p>'));
				throw new Error(work_data.title + ' §' + chapter_NO + ': '
						+ message);

			} else {
				console.log(html);
				// gettext_config:{"id":"web-page-revision?-unable-to-parse"}
				var message = '网页改版？无法解析！';
				if (library_namespace.gettext)
					message = library_namespace.gettext(message);
				throw new Error(work_data.title + ' §' + chapter_NO + ': '
						+ message);
			}

			if (cmnData.url) {
				// e.g., http://plus.comico.jp/manga/24529/13/
				// 预防 chapter_data.url 被污染。
				cmnData._url = cmnData.url;
				delete cmnData.url;
			}
			// console.log(work_data);
			// console.log(chapter_data);
			// console.log(cmnData);

			Object.assign(add_navigation_data(chapter_data, html), {
				// 设定必要的属性。
				image_list : cmnData.imageData.map(function(url) {
					if (chapter_data.limited
					// http://comicimg.comico.jp/tmb/00000/1/hexhex_hexhexhex.jpg"
					&& url.includes('.jp/tmb/') && /\.jpg$/.test(url))
						return;
					// chapter_data.isOfficial ? 官方作品 : 新手村
					if (chapter_data.isOfficial && chapter_data.freeFlg !== 'Y'
					// 付费章节: 中文版提供第一张的完整版，日文版只提供缩图。
					// 图片都应该要有hash，且不该是缩图。
					&& (url.includes('.jp/tmb/') || /\.jpg$/.test(url))) {
						var message = library_namespace.gettext
						// gettext_config:{"id":"invalid-image-url-$1"}
						? library_namespace.gettext('Invalid image url: %1',
								url) : 'Invalid image url: ' + url;
						throw new Error(work_data.title + ' §' + chapter_NO
								+ ' ' + chapter_data.title + ': ' + message);
					}
					return {
						url : url
					};
				})
			}, cmnData);

			return chapter_data;
		},

		// @see work_crawler_loader.js
		after_download_list : function() {
			// logout
		}

	};

	// --------------------------------------------------------------------------------------------

	/**
	 * full module name.
	 * 
	 * @type {String}
	 */
	var module_name = this.id;

	function new_comico_comics_crawler(configuration, callback, initializer) {
		configuration = configuration ? Object.assign(Object.create(null),
				default_configuration, configuration) : default_configuration;

		// 每次呼叫皆创建一个新的实体。
		var crawler = new library_namespace.work_crawler(configuration);
		if (typeof initializer === 'function') {
			initializer(crawler);
		}

		// for 年龄确认您是否已满18岁？
		crawler.setup_value('cookie', 'islt18age=' + Date.now());

		// https://github.com/nodejs/node/issues/27384
		// node.js v12 disable TLS v1.0 and v1.1 by default
		require('tls').DEFAULT_MIN_VERSION = 'TLSv1';

		if (crawler.password && crawler.loginid) {
			library_namespace.log([ (crawler.id || module_name) + ': ', {
				// gettext_config:{"id":"login-as-$1"}
				T : [ 'Login as [%1]', crawler.loginid ]
			} ]);

			var account_api_host = crawler.base_URL.replace(/^.+?[a-z]+\./,
			// https://id.comico.com.tw/login/login.nhn
			// https://id.comico.jp/login/login.nhn
			'https://id.');

			crawler.get_URL(account_api_host + 'login/login.nhn', after_login,
			//
			{
				autoLoginChk : 'Y',
				loginid : crawler.loginid,
				password : crawler.password,
				nexturl : ''
			});

		} else {
			callback(crawler);
		}

		function after_login(XMLHttp) {
			// XMLHttp 只是一个转址网页。

			// 必须先进入收件箱才能取得所有"有期限的物品"
			crawler.get_URL(
			// https://id.comico.com.tw/settings/inbox/
			account_api_host + 'settings/inbox/', function to_inbox(XMLHttp) {

				// 收件箱: 全部接收 有期限的物品
				// 受け取りBOX: すべて受け取る
				crawler.get_URL(
				// https://id.comico.com.tw/api/incentiveall/index.nhn
				account_api_host + 'api/incentiveall/index.nhn', get_ticket);

			});
		}

		function get_ticket(XMLHttp) {
			// e.g., XMLHttp.responseText ===
			// '{"result":[121703625,121703626,121703627,121703628]}'
			// console.log(XMLHttp.responseText);
			var item_list = JSON.parse(XMLHttp.responseText).result;
			if (item_list.length > 0) {
				// TODO: 显示物品的资讯。
				library_namespace.info({
					// gettext_config:{"id":"$1-items-with-a-time-limit-have-been-received"}
					T : [ '已收到 %1 个有期限的{{PLURAL:%1|项目}}。', item_list.length ]
				});
			}

			// 最新消息
			// http://www.comico.com.tw/notice/

			callback(crawler);
		}

	}

	return new_comico_comics_crawler;
}
