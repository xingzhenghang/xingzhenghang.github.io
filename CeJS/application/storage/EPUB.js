/**
 * @name CeL function for Electronic Publication (EPUB)
 * @fileoverview 本档案包含了解析与创建 EPUB file 电子书的 functions。
 * 
 * @example<code>


var ebook = new CeL.EPUB(package_base_directory);
// initialize

// append chapter
ebook.add({title:,file:,media:},{String}text);
// {Array}ebook.chapters. 每次手动改变.chapters，最后必须执行.arrange()整理。
ebook.chapters.splice(0,1,{title:,file:,media:[]});ebook.arrange();
ebook.flush(): write TOC, contents
ebook.check(): 确认档案都在

{String}ebook.directory.book
{String}ebook.directory.text + .xhtml
{String}ebook.directory.style + .css
{String}ebook.directory.media + .jpg, .png, .mp3


依照检核结果修改以符合标准: EpubCheck
https://github.com/IDPF/epubcheck
java -jar epubcheck.jar *.epub

http://www.idpf.org/epub/31/spec/epub-changes.html
The EPUB 2 NCX file for navigation is now marked for removal in EPUB 3.1.


TODO:
スタイル设定

split epubs based on groups / size

 </code>
 * 
 * @since 2017/1/24 11:55:51
 * @see [[en:file format]], [[document]], [[e-book]], [[EPUB]], [[Open eBook]]
 *      http://www.idpf.org/epub/31/spec/epub-packages.html
 *      https://www.w3.org/Submission/2017/SUBM-epub-packages-20170125/
 *      http://epubzone.org/news/epub-3-validation http://validator.idpf.org/
 *      http://imagedrive.github.io/spec/epub30-publications.xhtml
 *      https://github.com/futurepress/epub.js
 */

'use strict';

// --------------------------------------------------------------------------------------------

// 不采用 if 陈述式，可以避免 Eclipse JSDoc 与 format 多缩排一层。
typeof CeL === 'function' && CeL.run({
	// module name
	// application.storage.format.EPUB
	name : 'application.storage.EPUB',

	require :
	// Object.entries()
	'data.code.compatibility.'
	// .MIME_of()
	+ '|application.net.MIME.'
	// .count_word()
	+ '|data.'
	// JSON.to_XML()
	+ '|data.XML.'
	// get_URL_cache()
	// + '|application.net.Ajax.'
	// write_file(), read_file()
	+ '|application.storage.'
	// gettext()
	+ '|application.locale.gettext'
	// for .to_file_name()
	// + '|application.net.'
	// for .gettext
	// + '|application.locale.'
	// for .storage.archive.archive_under()
	+ '|application.storage.archive.'
	//
	,

	// 设定不汇出的子函式。
	no_extend : '*',

	// 为了方便格式化程式码，因此将 module 函式主体另外抽出。
	code : module_code
});

function module_code(library_namespace) {

	// requiring
	var
	// library_namespace.locale.gettext
	gettext = this.r('gettext'),
	/** {Number}未发现之index。 const: 基本上与程式码设计合一，仅表示名义，不可更改。(=== -1) */
	NOT_FOUND = ''.indexOf('_');

	var mimetype_filename = 'mimetype',
	// http://www.idpf.org/epub/dir/
	// https://w3c.github.io/publ-epub-revision/epub32/spec/epub-ocf.html#sec-container-metainf
	// All OCF Abstract Containers must include a directory called META-INF
	// in their Root Directory.
	// e.g., META-INF/container.xml
	container_directory_name = 'META-INF', container_file_name = 'container.xml',
	// Dublin Core Metadata Element Set 前置码, 前缀
	// http://dublincore.org/documents/dces/
	metadata_prefix = 'dc:',
	// key for additional information / configuration data
	KEY_DATA = 'item data',
	// 将 ebook 相关作业纳入 {Promise}，可保证先添加完章节资料、下载完资源再 .pack()。
	KEY_working_queue = 'working queue',

	/** {String}path separator. e.g., '/', '\' */
	path_separator = library_namespace.env.path_separator;

	// -------------------------------------------------------------------------
	// setup 相关函式。

	function setup_container(base_directory) {
		// read container file: [[manifest file]] container.xml
		this.container = library_namespace
				.read_file((base_directory || this.path.root)
						+ container_directory_name + path_separator
						+ container_file_name);

		var rootfile_path = (this.root_directory_name
		//
		? this.root_directory_name + '/' : '') + this.package_document_name;
		// console.log(this.container.toString());
		if (this.container
				&& (this.container = JSON.from_XML(this.container.toString(), {
					preserve_spaces : false
				}))) {
			// console.log(this.container);
			// parse container
			var rootfile = this.container.container.rootfiles;
			if (Array.isArray(rootfile)) {
				library_namespace.error({
					// <rootfile>
					// gettext_config:{"id":"this-library-not-yet-support-multiple-rootfiles-(.opf)"}
					T : '本函式库尚不支援多 rootfile (.opf)！'
				});
				rootfile = rootfile.filter(function(root_file) {
					return /\.opf$/i.test(root_file['full-path']);
				})[0] || rootfile[0];
			}

			if (false) {
				var matched = rootfile['full-path']
						.match(/^(?:(.*)[\\\/])?([^\\\/]+)$/);
				if (matched) {
					// console.log(matched);
					if (this.root_directory_name !== matched[1]) {
						library_namespace.info('root_directory_name: '
								+ matched[1] + '→' + this.root_directory_name);
					}
					this.root_directory_name = matched[1] || '';
					if (this.package_document_name !== matched[2]) {
						library_namespace
								.info('package_document_name: ' + matched[2]
										+ '→' + this.package_document_name);
					}
					this.package_document_name = matched[2];
				} else {
					library_namespace.info('rootfile path: '
							+ rootfile['full-path'] + '→' + rootfile_path);
				}
			}

			if (false && rootfile['full-path'] !== rootfile_path) {
				library_namespace.info('rootfile path: '
						+ rootfile['full-path'] + '→' + rootfile_path);
				// TODO: remove directories+files
				;
				rootfile['full-path'] = rootfile_path;
			}

		} else {
			// default container
			this.container = {
				container : {
					rootfiles : {
						rootfile : null,
						'full-path' : rootfile_path,
						'media-type' : "application/oebps-package+xml"
					}
				},
				version : "1.0",
				xmlns : "urn:oasis:names:tc:opendocument:xmlns:container"
			};
		}
	}

	function Ebook(base_directory, options) {
		options = library_namespace.setup_options(options);
		if (!/[\\\/]$/.test(base_directory)) {
			base_directory += path_separator;
		}

		if ('root_directory_name' in options) {
			this.root_directory_name = options.root_directory_name || '';
		}
		if (options.package_document_name) {
			this.package_document_name = options.package_document_name;
		}

		this.setup_container(base_directory);

		if (options.id_prefix) {
			if (/^[a-z][a-z\d]*$/i.test(options.id_prefix)) {
				this.id_prefix = options.id_prefix;
			} else {
				// gettext_config:{"id":"invalid-id-prefix-$1"}
				throw new Error(gettext('Invalid id prefix: %1',
						options.id_prefix));
			}
		}

		if (!this.root_directory_name) {
			library_namespace.warn({
				// gettext_config:{"id":"if-the-e-book-chapter-directory-is-not-set-all-chapter-content-will-be-placed-directly-under-the-e-book-root-directory"}
				T : '未设定电子书章节目录，将把所有章节内容直接放在电子书根目录底下！'
			});
		}

		var root_directory = base_directory
				+ (this.root_directory_name ? this.root_directory_name
						+ path_separator : '');
		this.directory = Object.assign({
			// 'text'
			text : '',
			style : 'style',
			media : 'media'
		}, options.directory);
		// 注意: 为了方便使用，这边的 this.directory 都必须添加 url 用的 path separator: '/'。
		for ( var d in this.directory) {
			var _d = this.directory[d];
			if (_d) {
				this.directory[d] = encode_file_name.call(this, _d).replace(
						/[\\\/]*$/, path_separator);
			}
		}
		// absolute directory path
		this.path = {
			// container
			root : base_directory,
			book : root_directory,
			text : root_directory + this.directory.text,
			style : root_directory + this.directory.style,
			media : root_directory + this.directory.media,
		};
		// 注意: 为了方便使用，这边的 this.directory 都必须添加 url 用的 path separator: '/'。
		for ( var d in this.directory) {
			this.directory[d] = './'
					+ this.directory[d].replace(/[\\\/]+$/, '/');
		}

		// The resources downloading now.
		// @see add_chapter()
		this.downloading = Object.create(null);

		/**
		 * <code>
		this.metadata = {
			'dc:tagname' : [ {Object} ],
			meta : { [property] : [ {Object} ] },
			link : { href : {Object} }
		}
		</code>
		 * 
		 * @see set_meta_information()
		 */
		this.metadata = Object.create(null);

		var raw_data;
		if (options.rebuild) {
			// rebuild: 重新创建, 不使用旧的.opf资料. start over, re-create
			// TODO: remove directories+files
			// this.use_cache = false;
			this.rebuild = true;
		} else {
			raw_data = library_namespace
			// book data
			.read_file(this.path.book + this.package_document_name);
		}
		this.set_raw_data(raw_data && JSON.from_XML(raw_data.toString()),
				options);

		this[KEY_working_queue] = Promise.resolve();
	}

	// 先准备好目录结构。
	function initialize(force) {
		if (this.initializated && !force) {
			return;
		}

		library_namespace.create_directory(Object.values(this.path)
		// 从root排到sub-directory，预防create_directory时parent-directory尚未创建。
		.sort());

		// create structure
		library_namespace.write_file(this.path.root + mimetype_filename,
		/**
		 * The mimetype file must be an ASCII file that contains the string
		 * application/epub+zip. It must be unencrypted, and the first file in
		 * the ZIP archive.
		 */
		'application/epub+zip');

		var directory = this.path.root + container_directory_name
				+ path_separator;
		library_namespace.create_directory(directory);
		library_namespace.write_file(directory + container_file_name,
		//
		JSON.to_XML(this.container, this.to_XML_options));

		this.initializated = true;
	}

	function date_to_String(date) {
		return (library_namespace.is_Date(date) ? date : new Date(date
		// .to_Date({zone:9})
		|| Date.now()))
		// CCYY-MM-DDThh:mm:ssZ
		.toISOString().replace(/\.\d{3}Z$/, 'Z');
	}

	Ebook.date_to_String = date_to_String;

	function rebuild_index_of_id(rebuild_resources, force) {
		var list = rebuild_resources ? this.resources : this.chapters, index_of_id = rebuild_resources ? this.resource_index_of_id
				: this.chapter_index_of_id;

		if (!force
		// TODO: detect change
		&& list.old_length === list.length) {
			return;
		}

		library_namespace.debug({
			// gettext_config:{"id":"rebuild-index_of_id"}
			T : '重建 index_of_id……'
		}, 1, 'rebuild_index_of_id');
		list.forEach(function(item, index) {
			if (item.id) {
				index_of_id[item.id] = index;
			}
		});
		list.old_length = list.length;
	}

	// {JSON}raw_data
	function set_raw_data(raw_data, options) {
		options = library_namespace.setup_options(options);

		// console.trace(JSON.stringify(raw_data));
		// console.trace(JSON.stringify(options));
		if (!raw_data) {
			if (!options.id_type) {
				options.id_type = 'workid';
			}
			// assert: typeof options.id_type === 'string'

			// 这边必须符合 JSON.from_XML() 获得的格式。
			raw_data = {
				package : [ {
					// http://www.idpf.org/epub/31/spec/epub-packages.html#sec-opf-dcmes-required
					metadata : [ {
						'dc:identifier' : options.identifier
						//
						|| options.id || new Date().toISOString(),
						id : options.id_type,
					// ** 以下非必要，供如 calibre 使用。
					// http://www.idpf.org/epub/31/spec/epub-packages.html#attrdef-identifier-scheme
					// 'opf:scheme' : options.id_type
					}, {
						'dc:title' : options.title || ''
					}, {
						// TODO: calibre 不认得 "cmn-Hant-TW"
						'dc:language' : options.language || 'en'
					}, {
						// epub 发行时间应用 dc:date。
						// the publication date of the EPUB Publication.
						'dc:date' : date_to_String()
					}, {
						// 作品内容最后编辑时间。应该在new Ebook()后自行变更此值至稍早作品最后更动的时间。
						meta : date_to_String(options.modified),
						// Date on which the resource was changed.
						// http://dublincore.org/documents/dcmi-terms/#terms-modified
						property : "dcterms:modified"
					} ],
					'xmlns:dc' : "http://purl.org/dc/elements/1.1/",
					// ** 以下非必要，供如 calibre 使用。
					'xmlns:opf' : "http://www.idpf.org/2007/opf",
					'xmlns:dcterms' : "http://purl.org/dc/terms/",
					'xmlns:xsi' : "http://www.w3.org/2001/XMLSchema-instance",
					// ** 以下非必要，仅供 calibre 使用。
					'xmlns:calibre' :
					// raw_data.package[0]['xmlns:calibre']
					"http://calibre.kovidgoyal.net/2009/metadata"
				}, {
					manifest : [ {
						item : null,
						id : 'style',
						href : '.css',
						// https://idpf.github.io/epub-cmt/v3/
						// e.g., 'image/jpeg'
						'media-type' : "text/css"
					}, {
						item : null,
						id : 'c1',
						href : '.xhtml',
						'media-type' : "application/xhtml+xml"
					} ] && []
				}, {
					// represent the default reading order
					// of the given Rendition.
					spine : [ {
						itemref : null,
						idref : 'id'
					} ] && []
				} ],
				// determine version.
				// http://www.idpf.org/epub/31/spec/
				// EpubCheck 尚不支援 3.1
				version : "3.0",
				xmlns : "http://www.idpf.org/2007/opf",
				// http://www.idpf.org/epub/31/spec/epub-packages.html#sec-package-metadata-identifiers
				// e.g., "AMAZON_JP", "MOBI-ASIN"
				'unique-identifier' : options.id_type
			};
		}
		this.raw_data = raw_data;

		// http://epubzone.org/news/epub-3-and-global-language-support
		if (options.language) {
			if (library_namespace.gettext.load_domain) {
				library_namespace.debug('Load language ' + options.language);
				library_namespace.gettext.load_domain(options.language);
			}
			// 似乎不用加也没问题。
			this.raw_data['xml:lang'] = options.language;
		}

		// console.log(JSON.stringify(raw_data));

		this.raw_data_ptr = Object.create(null);
		var resources = [];
		raw_data.package.forEach(function(node) {
			if (typeof node === 'string' && !node.trim()) {
				return;
			}
			resources.push(node);
			if (!library_namespace.is_Object(node)) {
				return;
			}
			// {Array}raw_data.package[0].metadata
			// {Array}raw_data.package[1].manifest
			// {Array}raw_data.package[2].spine
			if (Array.isArray(node.metadata)) {
				this.raw_data_ptr.metadata = node.metadata;
			} else if (Array.isArray(node.manifest)) {
				this.raw_data_ptr.manifest = node.manifest;
			} else if (Array.isArray(node.spine)) {
				this.raw_data_ptr.spine = node.spine;
				this.raw_data_ptr.spine_parent = node;
			}
		}, this);

		// 整理，去掉冗余。
		raw_data.package.clear();
		Array.prototype.push.apply(raw_data.package, resources);

		set_meta_information.call(this, this.raw_data_ptr.metadata);
		// console.log(JSON.stringify(this.metadata));
		// console.log(this.metadata);

		resources = this.raw_data_ptr.manifest;
		var chapters = this.raw_data_ptr.spine,
		// id to resources index
		index_of_id = Object.create(null);

		resources.forEach(function(resource, index) {
			if (typeof resource === 'string') {
				var matched = resource.match(/<!--\s*({.+})\s*-->/);
				if (matched
				//
				&& library_namespace.is_Object(resources[--index])) {
					try {
						// 以非正规方法存取资讯:封入注释的诠释资料。
						resources[index][KEY_DATA] = JSON.parse(matched[1]
						// @see write_chapters()
						// 在 HTML 注释中不能包含 "--"。
						.replace(/(?:%2D){2,}/g, function($0) {
							return '-'.repeat($0.length / 3);
						}));
					} catch (e) {
						// TODO: handle exception
					}
				}
				return;
			}

			var id = resource.id;
			if (id) {
				if (id in index_of_id) {
					;
				} else {
					index_of_id[id] = index;
				}
			}
		});

		// reset
		// 这两者必须同时维护
		this.chapters = [];
		// id to resources index, index_of_id
		// this.chapter_index_of_id[id]
		// = {ℕ⁰:Natural+0}index (of item) of this.chapters
		this.chapter_index_of_id = Object.create(null);
		this.resource_index_of_id = Object.create(null);

		// rebuild by the order of <spine>
		// console.log(chapters);
		chapters.forEach(function(chapter) {
			if (!library_namespace.is_Object(chapter)) {
				return;
			}
			var index = index_of_id[chapter.idref];
			if (!(index >= 0)) {
				throw new Error('id of <spine> not found in <manifest>: ['
						+ chapter.idref + ']');
			}
			if (!(index in resources)) {
				library_namespace.warn({
					// gettext_config:{"id":"<spine>-contains-a-duplicate-id-will-be-skipping-$1"}
					T : [ '<spine> 中包含了重复的 id，将跳过之：%1', chapter.idref ]
				});
				return;
			}
			chapter = resources[index];
			if (chapter.properties === 'nav') {
				// Exactly one item must be declared as the EPUB Navigation
				// Document using the nav property.
				// 滤掉 toc nav。
				this.TOC = chapter;
			} else {
				this.chapters.push(chapter);
			}
			// 已处理完。
			delete resources[index];
		}, this);

		// e.g., .css, images. 不包含 xhtml chapters
		this.resources = resources.filter(function(resource) {
			return library_namespace.is_Object(resource);
		}, this);

		// rebuild_index_of_id.call(this);
		// rebuild_index_of_id.call(this, true);
	}

	// -------------------------------------------------------------------------
	// 设定 information 相关函式。

	// to_meta_information_key
	function to_meta_information_tag_name(tag_name) {
		return tag_name === 'meta' || tag_name === 'link'
				|| tag_name.startsWith(metadata_prefix) ? tag_name
				: metadata_prefix + tag_name;
	}

	/**
	 * Setup the meta information of the ebook.
	 * 
	 * @param {String}tag_name
	 *            tag name (key) to setup.
	 * @param {Object|String}value
	 *            Set to the value.
	 * 
	 * @returns the value of the tag
	 */
	function set_meta_information(tag_name, value) {
		if (library_namespace.is_Object(tag_name) && value === undefined) {
			/**
			 * @example <code>

			ebook.set({
				// 作者名
				creator : 'author',
				// 作品内容最后编辑时间。
				meta : {
					meta : last_update_Date,
					property : "dcterms:modified"
				},
				subject : [ genre ].concat(keywords)
			});

			 * </code>
			 */
			Object.entries(tag_name).forEach(function(pair) {
				// 以能在一次设定中多次设定不同的<meta>
				if (pair[0].startsWith('meta:')) {
					pair[0] = 'meta';
				}
				set_meta_information.call(this, pair[0], pair[1]);
			}, this);
			return;
		}

		if (Array.isArray(tag_name) && value === undefined) {
			/**
			 * @example <code>

			ebook.set([
				{'dc:identifier':'~',id:'~'},
				{'dc:title':'~'},
				{'dc:language':'ja'},
			]);

			 * </code>
			 */
			tag_name.forEach(function(element) {
				if (!library_namespace.is_Object(element)) {
					return;
				}
				for ( var tag_name in element) {
					set_meta_information.call(this, tag_name, element);
					break;
				}
			}, this);
			return;
		}

		/**
		 * @example <code>

		ebook.set('title', '~');
		ebook.set('date', new Date);
		ebook.set('subject', ['~','~']);

		ebook.set('dc:title', {'dc:title':'~'});

		 * </code>
		 */

		// normalize tag name
		tag_name = to_meta_information_tag_name(tag_name);

		// normalize value
		if (typeof value === 'string') {
			if (value.includes('://')) {
				// 正规化 URL。处理/escape URL。
				// e.g., <dc:source>
				// && → &amp;&
				value = value.replace_till_stable(/&&/g, '&amp;&')
				// &xxx= → &amp;xxx=
				.replace(/&(.*?)([^a-z\d]|$)/g, function(all, mid, end) {
					if (end === ';') {
						return all;
					}
					return '&amp;' + mid + end;
				});
			}
		}
		if (value !== undefined) {
			if (!library_namespace.is_Object(value)) {
				var element = Object.create(null);
				// 将value当作childNode
				element[tag_name] = value;
				value = element;
			}
			library_namespace.debug(tag_name + '=' + JSON.stringify(value), 6);
		}

		var container = this.metadata,
		// required attribute
		required;
		if (tag_name === 'meta') {
			// 无.property时以.name作为key
			// e.g., <meta name="calibre:series" content="~" />
			required = value && value.property ? 'property' : 'name';
		} else if (tag_name === 'link') {
			required = 'href';
		}

		function set_value() {
			if (!container.some(function(element, index) {
				if (element[tag_name] === value[tag_name]) {
					library_namespace.debug(
							{
								// gettext_config:{"id":"duplicate-element-$1"}
								T : [ 'Duplicate element: %1',
										JSON.stringify(element) ]
							}, 3);
					// 以新的取代旧的。
					container[index] = value;
					return true;
				}
			})) {
				container.push(value);
			}
		}

		/**
		 * <code>

		this.metadata = {
			'dc:tagname' : [ {Object} ],
			meta : { [property] : [ {Object} ] },
			link : { href : {Object} }
		}

		</code>
		 */
		if (required) {
			// 若已经有此key则沿用旧container直接设定。
			container = container[tag_name]
					|| (container[tag_name] = Object.create(null));
			if (value === undefined) {
				// get container object
				return container.map(function(element) {
					return element[tag_name] || element.content;
				});
			}
			// set object
			if (!value[required]) {
				// gettext_config:{"id":"invalid-metadata-value-$1"}
				throw new Error(gettext('Invalid metadata value: %1',
				//
				JSON.stringify(value)));
			}
			if (tag_name === 'link') {
				// required === 'href'
				// 相同 href 应当仅 includes 一次
				container[value[required]] = value;
			} else {
				// 将其他属性纳入<meta property="..."></meta>。
				// assert: tag_name === 'meta'
				container = container[value[required]]
						|| (container[value[required]] = []);
				set_value();
			}

		} else {
			// assert: tag_name.startsWith(metadata_prefix)
			container = container[tag_name] || (container[tag_name] = []);
			if (value === undefined) {
				// get container object
				return container.map(function(element) {
					return element[tag_name];
				});
			}
			// set object
			set_value();
		}

		return value;
	}

	// -------------------------------------------------------------------------
	// 编辑 chapter 相关函式。

	/**
	 * 必须先确认没有冲突。
	 * 
	 * @inner
	 */
	function add_manifest_item(item, is_resource) {
		if (typeof is_resource === 'boolean' ? is_resource
				: detect_file_type(item.href) !== 'text') {
			// 检测是否存在相同资源(.href)并做警告。
			if (item.id in this.resource_index_of_id) {
				var index = this.resource_index_of_id[item.id];
				library_namespace.error([ 'add_manifest_item: ', {
					// gettext_config:{"id":"resources-with-the-same-id-already-exist-so-the-resources-that-follow-will-deleted"}
					T : '已经存在相同 id 之资源，后面的资源将直接消失！'
				} ]);
				console.error(this.resources[index]);
				console.error(item);
				// 留著 resource
				// remove_chapter.call(this, index, true, true);
				this.resources[index] = item;
			} else {
				this.resource_index_of_id[item.id] = this.resources.length;
				this.resources.push(item);
			}

		} else {
			// 检测是否存在相同资源(.href)并做警告。
			if (item.id in this.chapter_index_of_id) {
				var index = this.chapter_index_of_id[item.id];
				library_namespace.error([ 'add_manifest_item: ', {
					// gettext_config:{"id":"resources-with-the-same-chapter-already-exist-so-the-resources-that-follow-will-deleted"}
					T : '已经存在相同 id 之章节，后面的章节将直接消失！'
				} ]);
				console.error(this.chapters[index]);
				console.error(item);
				// remove_chapter.call(this, index, true);
				this.chapters[index] = item;
			} else {
				this.chapter_index_of_id[item.id] = this.chapters.length;
				this.chapters.push(item);
			}
		}
	}

	/** const */
	var cover_image_properties = "cover-image";

	// 表纸设定
	// http://idpf.org/forum/topic-715
	// https://wiki.mobileread.com/wiki/Ebook_Covers#OPF_entries
	// http://www.idpf.org/epub/301/spec/epub-publications.html#sec-item-property-values
	// TODO:
	// <item id="cover" href="cover.xhtml" media-type="application/xhtml+xml" />
	function set_cover_image(item_data, contents) {
		if (!item_data) {
			return;
		}

		if (typeof item_data === 'string') {
			if (item_data.startsWith('//')) {
				item_data = 'https:' + item_data;
			}
			if (item_data.includes('://')) {
				var matched;
				item_data = {
					url : item_data,
					file : library_namespace.MIME_of(item_data)
					//
					&& item_data.match(/[^\\\/]+$/i)[0]
					//
					|| 'cover.' + (item_data.type && (matched = item_data.type
					//
					.match(/^image\/([a-z\d]+)$/)) ? matched[1] : 'jpg')
				};
			}
		}

		var item = normalize_item.call(this, item_data);
		// <item id="cover-image" href="cover.jpg" media-type="image/jpeg" />
		item.id = 'cover-image';
		item.properties = cover_image_properties;

		// TODO: <meta name="cover" content="cover-image" />
		return this.add(item, contents);
	}

	// Must call after `ebook.set()`.
	// @see function create_ebook() @
	// CeL.application.net.work_crawler.ebook
	function set_writing_mode(vertical_writing, RTL_writing) {
		if (vertical_writing || typeof vertical_writing === 'boolean') {
			var writing_mode = typeof vertical_writing === 'string' ? /^(?:lr|rl)$/
					.test(vertical_writing) ? 'vertical-' + vertical_writing
					: vertical_writing
					// e.g., vertical_writing === true
					: 'vertical-rl';

			if (RTL_writing === undefined) {
				RTL_writing = /rl$/.test(writing_mode);
			}

			if (!this.had_set_vertical_writing) {
				// library_namespace.log('set vertical_writing');
				// another method: <html dir="rtl">
				this.add({
					// title : 'mainstyle',
					file : 'main_style.css'
				}, 'html { '
				// https://en.wikipedia.org/wiki/Horizontal_and_vertical_writing_in_East_Asian_scripts
				// 东亚文字排列方向 垂直方向自右而左的书写方式。即 top-bottom-right-left
				+ 'writing-mode:' + writing_mode + ';'
				// https://blog.tommyku.com/blog/how-to-make-epubs-with-vertical-layout/
				+ '-epub-writing-mode:' + writing_mode + ';'
				// for Kindle Readers (kindlegen)?
				+ '-webkit-writing-mode:' + writing_mode + '; }');

				// 只能设定一次。
				this.had_set_vertical_writing = true;
			}
		}

		// https://medium.com/parenting-tw/从零开始的电子书-epub-壹-72da1aca6571
		// 设置电子书的页面方向
		if (typeof RTL_writing === 'boolean') {
			var spine_parent = this.raw_data_ptr.spine_parent;
			spine_parent['page-progression-direction'] = RTL_writing ? "rtl"
					: "ltr";
		}
	}

	/**
	 * encode to XML identifier.
	 * 
	 * 因为这可能用来作为档名，因此结果也必须为valid档名。
	 * 
	 * @see http://stackoverflow.com/questions/1077084/what-characters-are-allowed-in-dom-ids
	 * 
	 * @see https://www.w3.org/TR/html401/types.html#type-name
	 * 
	 * ID and NAME tokens must begin with a letter ([A-Za-z]) and may be
	 * followed by any number of letters, digits ([0-9]), hyphens ("-"),
	 * underscores ("_"), colons (":"), and periods (".").
	 * 
	 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
	 * 
	 * encodeURIComponent escapes all characters except the following:
	 * alphabetic, decimal digits, - _ . ! ~ * ' ( )
	 */
	function encode_identifier(string) {
		if (typeof string !== 'string') {
			// gettext_config:{"id":"unable-to-encode-invalid-id-$1"}
			throw new Error(gettext('无法编码无效的 id：%1', JSON.stringify(string)));
		}

		if (!string) {
			return '';
		}

		// 皆加上id_prefix，之后的便以接续字元看待，不必多作处理。
		var id = this.id_prefix + encodeURIComponent(string)
		// escape other invalid characters
		// 把"_"用来做hex辨识符。
		.replace(/[_!~*'()]/g, function($0) {
			var hex = $0.charCodeAt(0).toString(0x10).toUpperCase();
			if (hex.length % 2 === 1) {
				hex = '0' + hex;
			}
			// return hex.replace(/([\s\S]{2})/g, '_$1');
			return '%' + hex;
		}).replace(/%/g, '_');

		if (id.length > this.MAX_ID_LENGTH) {
			var MAX_ID_LENGTH = this.MAX_ID_LENGTH;
			id = id.replace(/^([\s\S]+)(\.[^.]+)$/, function(all, name,
					extension) {
				if (extension.length < 10) {
					return name.slice(0, MAX_ID_LENGTH - extension.length)
							+ extension;
				}
				return all.slice(0, MAX_ID_LENGTH);
			});
			if (id.length > MAX_ID_LENGTH) {
				id = id.slice(0, this.MAX_ID_LENGTH);
			}
		}
		return id;
	}

	var PATTERN_NEED_ENCODE_ID = /^[^a-z]|[^a-z\d\-]/i, PATTERN_NEED_ENCODE_FILE_NAME = /[^a-z\d\-.]/i;
	// EpubCheck 不可使用/不接受中文日文档名。
	function encode_file_name(file_name) {
		if (PATTERN_NEED_ENCODE_FILE_NAME.test(file_name)) {
			// need encode
			// TODO: limit length
			return encode_identifier.call(this, file_name);
		}
		return file_name;
	}

	function decode_identifier(identifier) {
		if (!identifier.startsWith(this.id_prefix)) {
			return identifier;
		}

		identifier = identifier.slice(this.id_prefix.length).replace(/_/g, '%');
		try {
			return decodeURIComponent(identifier);
		} catch (e) {
			library_namespace.error([ 'decode_identifier: ', {
				// gettext_config:{"id":"unable-to-decode-$1"}
				T : [ '无法解码：[%1]', identifier ]
			} ]);
			throw e;
		}
	}

	// assert: "_!~*'()" ===
	// decode_identifier.call(this, encode_identifier.call(this, "_!~*'()"))

	function is_manifest_item(value) {
		if (!library_namespace.is_Object(value)) {
			return false;
		}

		for ( var key in value) {
			return key === 'item' && value.item === null
			// http://www.idpf.org/epub/31/spec/epub-packages.html#sec-item-elem
			&& value.id && value.href && value['media-type'];
		}
		return false;
	}

	// file path → file name
	function get_file_name_of_url(url) {
		return (url && String(url) || '').match(/[^\\\/]*$/)[0];
	}

	// file name or url
	// return value must in this.path and this.directory
	function detect_file_type(file_name) {
		if (/\.x?html?$/i.test(file_name)) {
			return 'text';
		}
		if (/\.css$/i.test(file_name)) {
			return 'style';
		}

		var main_type = library_namespace.main_MIME_type_of(file_name);
		if (main_type === 'text') {
			return 'text';
		}
		if (main_type === 'image' || main_type === 'audio'
				|| main_type === 'video') {
			return 'media';
		}

		// 可能仅是在测试是否可以侦测得出 type。
		library_namespace.debug({
			// gettext_config:{"id":"unable-to-determine-the-type-of-file-for-$1"}
			T : [ '无法判别档案 [%1] 的类型。', file_name ]
		});
	}

	function normalize_item(item_data, strict) {
		if (is_manifest_item(item_data)) {
			if (strict && (KEY_DATA in item_data)) {
				item_data = Object.clone(item_data);
				// item[KEY_DATA] 必须在 write_chapters() 时去除掉。
				delete item_data[KEY_DATA];
			}
			return item_data;
		}

		if (typeof item_data === 'string') {
			// 为URL做箝制处理。
			if (item_data.includes('://')) {
				item_data = {
					url : item_data
				};
			} else if (library_namespace.MIME_of(item_data)) {
				if (/[\\\/]/.test(item_data)) {
					item_data = {
						href : item_data
					};
				} else {
					item_data = {
						file : item_data
					};
				}
			} else {
				item_data = {
					// タイトル
					title : item_data
				};
			}
		}

		// item_data.file = library_namespace.to_file_name(item_data.file);

		var id, href;
		if (library_namespace.is_Object(item_data)) {
			id = item_data.id || item_data.title;
			href = item_data.href;
			if (!href
					&& (href = get_file_name_of_url(item_data.file
							|| item_data.url))) {
				// 自行决定合适的 path+档名。 e.g., "media/1.png"
				href = this.directory[detect_file_type(href)] + href;
			}
		}

		if (!id) {
			if (!href) {
				library_namespace.error({
					// gettext_config:{"id":"invalid-item-data-$1"}
					T : [ '项目资讯无效：%1', JSON.stringify(item_data) ]
				});
				console.error(item_data);
				return;
			}

			// 对档案，以href(path+档名)作为id。
			// 去掉 file name extension 当作id。
			id = href.replace(/\.[a-z\d\-]+$/i, '').replace(
					this.directory[detect_file_type(href)], '');

		} else if (!href) {
			// default: xhtml file
			href = this.directory.text + id + '.xhtml';
		}

		var _this = this;
		href = href.replace(/[^\\\/]+$/, function(file_name) {
			file_name = encode_file_name.call(_this, file_name);

			// 截断 trim 主档名，限制在 _this.MAX_ID_LENGTH 字元。
			// WARNING: assert: 截断后的主档名不会重复，否则会被覆盖!
			return file_name.replace(/^(.*)(\.[^.]+)$/, function(all, main,
					extension) {
				return main.slice(0, _this.MAX_ID_LENGTH - extension.length)
						+ extension;
			})
		});

		// escape: 不可使用中文日文名称。
		// 采用能从 id 复原成 title 之演算法。
		// 未失真的 title = decode_identifier.call(this, item.id)
		if (PATTERN_NEED_ENCODE_ID.test(id)) {
			id = encode_identifier.call(this, id);
		}
		while (id in this.chapter_index_of_id) {
			var index = this.chapter_index_of_id[id], previous_data = this.chapters[index][KEY_DATA];
			if (item_data.title && item_data.title === previous_data.title
			// 测试新旧章节两者是否实质相同。若是相同的话就直接覆盖。
			&& (!item_data.url || item_data.url === previous_data.url)) {
				break;
			}

			// 若 id / href 已存在，可能是因为有重复的标题，这时应发出警告。
			library_namespace.info([ 'normalize_item: ', {
				// gettext_config:{"id":"this-id-already-exists-will-change-the-id-of-former-chapter"}
				T : '先前已经存在相同 id 之章节，将更改后者之 id。'
			}, '\n	',
			//
			previous_data.title + '	' + (previous_data.url || '') + '\n',
			//
			'	' + item_data.title + '	' + (item_data.url || '') ]);
			// console.error(index+'/'+this.chapters.length);
			// console.error(this.chapters[index]);
			// console.error(item_data);
			var NO;
			// assert: 这两者都必须被执行
			id = id.replace(/(?:\-([1-9]\d{0,4}))?$/, function(all, _NO) {
				NO = (_NO | 0) + 1;
				return '-' + NO;
			});
			href = href.replace(/(?:\-([1-9]\d{0,4}))?(\.[^.]+)?$/, function(
					all, _NO, extension) {
				return (NO === (_NO | 0) + 1 ? '' : all) + '-' + NO
				//
				+ extension;
			});
		}

		var item = {
			item : null,
			id : id,
			// e.g., "media/1.png"
			href : href,
			'media-type' : item_data['media-type'] || item_data.type
					|| library_namespace.MIME_of(href)
		};

		if (library_namespace.is_debug()
		// ↑ 可能是placeholder，因此仅作debug。
		&& !/^[a-z]+\/[a-z\d+]+$/.test(item['media-type'])) {
			library_namespace.warn({
				// gettext_config:{"id":"media-type-is-not-set-or-media-type-is-invalid-$1"}
				T : [ '未设定 media-type，或 media-type 无效：%1',
				//
				JSON.stringify(item) ]
			});
		}

		if (!strict) {
			if (!item_data.url && href.includes('://')) {
				item_data.url = href;
			}
			item[KEY_DATA] = item_data;
		}

		return item;
	}

	function index_of_chapter(title) {
		rebuild_index_of_id.call(this);

		var chapter_index_of_id = this.chapter_index_of_id;
		if (library_namespace.is_Object(title)) {
			if (title.id === this.TOC.id) {
				return 'TOC';
			}

			if (title.id in chapter_index_of_id) {
				return chapter_index_of_id[title];
			}
			title = title.title;
		} else if (title in chapter_index_of_id) {
			// title 为 id
			return chapter_index_of_id[title];
		}

		var encoded = encode_identifier.call(this, title);

		if (encoded in chapter_index_of_id) {
			// title 为 title
			return chapter_index_of_id[encoded];
		}

		// 剩下的可能为 href, url
		if (false && !/\.x?html?$/i.test(title)) {
			return NOT_FOUND;
		}

		for (var chapters = this.chapters, index = 0, length = chapters.length; index < length; index++) {
			var item = chapters[index];
			// console.log('> ' + title);
			// console.log(item);
			if (
			// title === item.id ||
			// title === decode_identifier.call(this, item.id) ||
			title === item.href || item[KEY_DATA]
					&& title === item[KEY_DATA].url) {
				return index;
			}
		}

		// Nothing found.
		return NOT_FOUND;
	}

	function is_the_same_item(item1, item2) {
		return item1 && item2 && item1.id === item2.id
				&& item1.href === item2.href;
	}

	function escape_ampersand(text) {
		// https://stackoverflow.com/questions/12566098/what-are-the-longest-and-shortest-html-character-entity-names
		return text.replace(/&([^&;]{0,50})([^&]?)/g, function(entity, postfix,
				semicolon) {
			if (semicolon === ';' && (/^#\d{1,10}$/.test(postfix)
			// "&CounterClockwiseContourIntegral;"
			|| /^[a-z]\w{0,49}$/i.test(postfix))) {
				return entity;
			}
			// TODO: &copy, &shy
			return '&amp;' + postfix + semicolon;
		});
	}

	function to_XHTML_URL(url) {
		return escape_ampersand(encodeURI(url));
	}

	// 正规化 XHTML 书籍章节内容。
	// assert: normailize_contents(contents) ===
	// normailize_contents(normailize_contents(contents))
	function normailize_contents(contents) {
		library_namespace.debug({
			// gettext_config:{"id":"formalizating-xhtml-chapter-content-$1"}
			T : [ '正规化 XHTML 书籍章节内容：%1', contents ]
		}, 6);
		contents = contents
		// 去掉 "\r"，全部转为 "\n"。
		.replace(/\r\n?/g, '\n')
		// 去除 '\b', '\f' 之类无效的 XML字元 https://www.w3.org/TR/REC-xml/#NT-Char
		// e.g., http://www.alphapolis.co.jp/content/sentence/213451/
		// e.g., "，干笑一声" @ https://www.ptwxz.com/html/9/9503/7886636.html
		// ""==="\b"
		// .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, '')
		// 已去掉 "\r"，全部转为 "\n"。
		.replace(/[\x00-\x08\x0b-\x1f]/g, '')
		// 最多允许两个 "\n" 以为分段。
		.replace(/\n{3,}/g, '\n\n')
		// .replace(/<br \/>\n/g, '\n')
		// .replace(/\n/g, '\r\n')

		//
		.replace(/<hr(?:\s[^<>]*)?>/ig, '<hr />')
		// <BR> → <br />
		.replace(/<br(?:[^\w<>][^<>]*)?>/ig, '<br />')

		// .trim(), remove head/tail <BR>
		.replace(/^(?:<br *\/>|[\s\n]|&nbsp;|&#160;)+/ig, '')
		// 这会卡住:
		// .replace(/(?:<br *\/>|[\s\n]+)+$/ig, '')
		.replace(/(?:<br *\/>|[\s\n]|&nbsp;|&#160;)+$/ig, '')

		// for ALL <img>
		.replace(/(<img ([^<>]+)>)(\s*<\/img>)?/ig,
		// 改正明显错误。
		function(all, opening_tag, inner) {
			inner = inner.trim();
			if (inner.endsWith(' \/')) {
				return opening_tag;
			}
			return '<img ' + inner.replace(/[\s\/]+$/g, '') + ' \/>';
		})

		// 2017/2/2 15:1:26
		// 标准可以没 <rb>。若有<rb>，反而无法通过 EpubCheck 检测。
		// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ruby
		.replace(/<\/?rb\s*>/g, '')

		// e.g., id="text" → id="text"
		// .replace(/ ([a-z]+)=([a-z]+)/g, ' $1="$2"')

		// [[non-breaking space]]
		// EpubCheck 不认识 HTML character entity，
		// 但却又不允许 <!DOCTYPE html> 加入其他宣告。
		.replace(/&nbsp;/g, '&#160;');

		contents = escape_ampersand(contents);

		// contents = contents.replace(/<script[^<>]*>[\s\S]*?<\/script>/g, '');

		library_namespace.debug({
			// gettext_config:{"id":"the-content-of-the-chapter-after-formalization-$1"}
			T : [ '正规化后之章节内容：%1', contents ]
		}, 6);
		return contents;
	}

	Ebook.normailize_contents = normailize_contents;

	// 注册 callback
	function add_listener(event, listener) {
		event = 'on_' + event;
		if (listener) {
			if (this[event]) {
				this[event].push(listener);
			} else {
				this[event] = [ listener ];
			}
		}
		return this[event];
	}

	// item data / config
	function add_chapter(item_data, contents) {
		if (!item_data) {
			return;
		}

		if (Array.isArray(item_data)) {
			if (contents) {
				// gettext_config:{"id":"set-multiple-files-to-the-same-content-$1"}
				throw new Error(gettext('设定多个档案为相同的内容：%1', item_data));
			}
			return item_data.map(function(_item_data) {
				return add_chapter.call(this, _item_data);
			}, this);
		}

		var _this = this, item = normalize_item.call(this, item_data);
		item_data = item[KEY_DATA] || Object.create(null);
		// assert: library_namespace.is_Object(item_data)
		// console.log(item_data);
		// console.log(item);
		// console.trace(item);

		rebuild_index_of_id.call(this);
		rebuild_index_of_id.call(this, true);

		// 有contents的话，采用contents做为内容。并从item.href撷取出档名。
		if (!contents && item_data.url) {
			// 没contents的一律当作resource。
			var resource_href_hash = Object.create(null),
			//
			file_type = detect_file_type(item_data.file || item.href)
					|| detect_file_type(item_data.url),
			//
			file_path = this.path[file_type || 'media']
					+ get_file_name_of_url(item.href);
			// item_data.reget_resource: 强制重新取得资源档。
			if (!item_data.reget_resource
			// 必须存在资源档。
			&& library_namespace.file_exists(file_path)
			// 假如 media-type 不同，就重新再取得一次档案。
			&& item['media-type'] === library_namespace.MIME_of(item_data.url)
			//
			&& this.resources.some(function(resource) {
				if (resource[KEY_DATA]
				//
				&& resource[KEY_DATA].url === item_data.url
				// TODO: reget resource
				// && item['media-type'] && item['media-type'] !== 'undefined'
				) {
					// gettext_config:{"id":"already-have-the-same-resource-file-$1-$2"}
					var message = gettext('已经有相同的资源档 [%1] %2。',
					//
					item['media-type'], resource[KEY_DATA].url);
					if (item_data.href
					// 有手动设定.href
					&& item_data.href !== resource.href) {
						library_namespace.error([ message + '\n', {
							// gettext_config:{"id":"but-.href-is-different-please-manually-fix-it-$1"}
							T : [ '但 .href 不同，您必须手动修正：%1',
							//
							resource.href + '→' + item_data.href ]
						} ]);
					} else {
						library_namespace.log(message);
					}
					// 回传重复的resource。
					item = resource;
					return true;
				}
				resource_href_hash[resource.href] = resource;
			})) {
				return item;
			}

			// 避免冲突，检测是不是有不同 URL，相同档名存在。
			while (file_path in this.downloading) {
				if (this.downloading[file_path].url === item_data.url) {
					library_namespace.log([ 'add_chapter: ', {
						// gettext_config:{"id":"the-file-is-already-in-the-download-queue-skipping-the-repeated-download-request-$1"}
						T : [ '档案已在下载队列中，跳过重复下载动作：%1', file_path ]
					} ]);
					// console.log(this.downloading[file_path]);
					return item;
				}

				library_namespace.debug([ 'add_chapter: ', {
					T : [
					// gettext_config:{"id":"there-are-resources-in-the-download-queue-that-have-the-same-file-name-but-different-urls-url-$1-in-the-download-queue-≠-url-$2-to-be-downloaded-try-to-change-to-another-file-name"}
					'下载队列中存在相同档名，却有著不同网址的资源：下载队列中 URL [%1] ≠ 准备下载之 URL [%2]，尝试改成另一个档案名称。'
					//
					, this.downloading[file_path].url, item_data.url ]
				} ]);

				file_path = file_path.replace(
				// 必须是encode_identifier()之后不会变化的档名。
				/(?:-(\d+))?(\.[a-z\d\-]+)?$/, function(all, NO, ext_part) {
					return '-' + ((NO | 0) + 1) + (ext_part || '');
				});
			}

			// 避免冲突，检测是不是有不同 URL，相同档名存在。
			while (item.href in resource_href_hash) {
				item.href = item.href.replace(
				// 必须是encode_identifier()之后不会变化的档名。
				/(?:-(\d+))?(\.[a-z\d\-]+)?$/, function(all, NO, ext_part) {
					return '-' + ((NO | 0) + 1) + (ext_part || '');
				});
			}

			if (item_data.href && item_data.href !== item.href) {
				// 有手动设定.href。
				library_namespace.error([ 'add_chapter: ', {
					// gettext_config:{"id":"to-update-changed-file-name-you-need-to-manually-change-the-original-file-name-from-the-original-folder"}
					T : '储存档名改变，您需要自行修正原参照档案中之档名：'
				}, '\n', item_data.href + ' →\n' + item.href ]);
			}

			// 避免冲突，检测是不是有不同id，相同id存在。
			while ((item.id in this.resource_index_of_id)
					|| (item.id in this.chapter_index_of_id)) {
				item.id = item.id.replace(
				// 必须是encode_identifier()之后不会变化的档名。
				/(?:-(\d+))?(\.[a-z\d\-]+)?$/, function(all, NO, ext_part) {
					return '-' + ((NO | 0) + 1) + (ext_part || '');
				});
			}

			if (item_data.id && item_data.id !== item.id) {
				// 有手动设定.href
				library_namespace.error([ 'add_chapter: ', {
					// gettext_config:{"id":"the-id-changes-you-need-to-correct-the-file-name-in-the-original-folder"}
					T : 'id 改变，您需要自行修正原参照档案中之档名：'
				}, '\n', item_data.id + ' →\n' + item.id ]);
			}

			if (!item_data.type) {
				// 先猜一个，等待会取得资源后再用XMLHttp.type设定。
				// item_data.type = library_namespace.MIME_of('jpg');
			}
			// 先登记预防重复登记 (placeholder)。
			add_manifest_item.call(this, item, true);

			// 先给个预设的media-type。
			item['media-type'] = library_namespace.MIME_of(item_data.url);

			item_data.file_path = file_path;
			// 自动添加.downloading登记。
			this.downloading[item_data.file_path] = item_data;

			// 需要先准备好目录结构以存入media file。
			this.initialize();

			library_namespace.log([ 'add_chapter: ', {
				// gettext_config:{"id":"fetching-url-$1"}
				T : [ '自网路取得 URL：%1', item_data.url ]
			} ]);

			// assert: CeL.application.net.Ajax included
			library_namespace.get_URL_cache(item_data.url, function(contents,
					error, XMLHttp) {
				// save MIME type
				if (XMLHttp && XMLHttp.type) {
					if (item['media-type']
					// 需要连接网站的重要原因之一是为了取得 media-type。
					&& item['media-type'] !== XMLHttp.type) {
						library_namespace.error([ 'add_chapter: ', {
							T : [
							// gettext_config:{"id":"the-resource-that-has-been-obtained-has-a-media-type-of-$1-which-is-different-from-the-media-type-$2-obtained-from-the-extension-file"}
							'已取得之资源，其内容之媒体类型为 [%1]，与从副档名所得到的媒体类型 [%2] 不同！',
							//
							XMLHttp.type, item['media-type'] ]
						} ]);
					}
					// 这边已经不能用 item_data.type。
					item['media-type'] = XMLHttp.type;

				} else if (!item['media-type']) {
					library_namespace.error({
						// gettext_config:{"id":"unable-to-identify-the-media-type-of-the-acquired-resource-$1"}
						T : [ '无法判别已取得资源之媒体类型：%1', item_data.url ]
					});
				}

				// 基本检测。
				if (/text/i.test(item_data.type)) {
					library_namespace.error({
						// gettext_config:{"id":"the-resource-obtained-type-$1-is-not-a-image-file-$2"}
						T : [ '所取得之资源，类型为[%1]，并非图像档：%2', item_data.type,
								item_data.url ]
					});
				}

				// 已经取得资源：
				library_namespace.log([ 'add_chapter: ', {
					// gettext_config:{"id":"resource-acquired-$1-$2"}
					T : [ '已取得资源：[%1] %2', item['media-type'],
					//
					item_data.url + '\n→ ' + item.href ]
				} ]);

				// item_data.write_file = false;

				// 注销 .downloading 登记。
				if (item_data.file_path in _this.downloading) {
					delete _this.downloading[item_data.file_path];
				} else {
					library_namespace.error({
						// gettext_config:{"id":"the-file-is-not-in-the-download-queue-$1"}
						T : [ '档案并未在下载队列中：%1', item_data.file_path ]
					});
				}
				if (false) {
					library_namespace.log([ 'add_chapter: ', {
						// gettext_config:{"id":"still-downloading"}
						T : '资源仍在下载中：'
					} ]);
					console.log(_this.downloading);
					console.log(_this.add_listener('all_downloaded'));
				}
				if (_this.add_listener('all_downloaded')
				// 在事后检查.on_all_downloaded，看是不是有callback。
				&& library_namespace.is_empty_object(_this.downloading)) {
					library_namespace.debug({
						// gettext_config:{"id":"all-resources-have-been-downloaded.-start-performing-subsequent-$1-register-jobs"}
						T : [ '所有资源下载完毕。开始执行后续 %1 个已登记之{{PLURAL:%1|作业}}。',
						//
						_this.add_listener('all_downloaded').length ]
					}, 2, 'add_chapter');
					_this.add_listener('all_downloaded').forEach(
					//
					function(listener) {
						listener.call(_this);
					});
					// 注销登记。
					delete _this['on_all_downloaded'];
				}
			}, {
				file_name : item_data.file_path,
				// rebuild时不会读取content.opf，因此若无法判别media-type时则需要reget。
				// 须注意有没有同名但不同内容之档案。
				reget : this.rebuild && !item['media-type'],
				encoding : undefined,
				charset : file_type === 'text' && item_data.charset
				//
				|| 'buffer',
				get_URL_options : Object.assign({
					/**
					 * 每个页面最多应该不到50张图片或者其他媒体。
					 * 
					 * 最多平行取得档案的数量。 <code>
					incase "MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 connect listeners added. Use emitter.setMaxListeners() to increase limit"
					</code>
					 */
					max_listeners : 50,
					error_retry : 4
				}, item_data.get_URL_options)
			});
			return item;
		}

		// 有contents时除非指定.use_cache，否则不会用cache。
		// 无contents时除非指定.force(这通常发生于呼叫端会自行写入档案的情况)，否会保留cache。
		if ((contents ? item_data.use_cache : !item_data.force)
		// 若是已存在相同资源(.id + .href)则直接跳过。 need unique links
		&& (is_the_same_item(item, this.TOC)
		//
		|| (item.id in this.chapter_index_of_id) && is_the_same_item(item,
		//
		this.chapters[this.chapter_index_of_id[item.id]])
		//
		|| (item.id in this.resource_index_of_id) && is_the_same_item(item,
		//
		this.resources[this.resource_index_of_id[item.id]]))) {
			library_namespace.debug({
				// gettext_config:{"id":"already-have-the-same-chapter-or-resource-file-it-will-not-be-overwritten-$1"}
				T : [ '已经有相同的篇章或资源档，将不覆写：%1',
				//
				item_data.file || decode_identifier.call(this, item.id) ]
			}, 2);
			return;
		}

		// modify from CeL.application.net.work_crawler
		function full_URL_of_path(url, base_URL) {
			if (!url.includes('://')) {
				if (url.startsWith('/')) {
					if (url.startsWith('//')) {
						// 借用 base_URL 之 protocol。
						return base_URL.match(/^(https?:)\/\//)[1] + url;
					}
					// url = url.replace(/^[\\\/]+/g, '');
					// 只留存 base_URL 之网域名称。
					return base_URL.match(/^https?:\/\/[^\/]+/)[0] + url;
				} else {
					// 去掉开头的 "./"
					url = url.replace(/^\.\//, '');
				}
				if (url.startsWith('.')) {
					library_namespace.warn([ 'full_URL_of_path: ', {
						// gettext_config:{"id":"invalid-url-$1"}
						T : [ '网址无效：%1', url ]
					} ]);
				}
				url = base_URL + url;
			}
			return url;
		}

		function check_text(contents) {
			contents = normailize_contents(contents);

			if (item_data.internalize_media) {
				// include images / 自动载入内含资源, 将外部media内部化
				var links = [];
				// TODO: <object data=""></object>
				contents = contents.replace(/ (src|href)="([^"]+)"/ig,
				//
				function(all, attribute_name, url) {
					if (/^\s*(data|mailto):/.test(url)) {
						// https://en.wikipedia.org/wiki/Data_URI_scheme
						library_namespace.log([ 'check_text: ', {
							// gettext_config:{"id":"skip-data-uri-scheme-$1"}
							T : [ '跳过资料 URI scheme：%1', url ]
						}, '\n', {
							// gettext_config:{"id":"of-file-$1"}
							T : [ '档案路径：%1', item_data.file ]
						} ]);
						return all;
					}

					try {
						url = decodeURI(url);
					} catch (e) {
						library_namespace.warn([ 'check_text: ', {
							// gettext_config:{"id":"invalid-url-$1"}
							T : [ '网址无效：%1', url ]
						} ]);
						return all;
					}
					// url = library_namespace.HTML_to_Unicode(url);
					// e.g.,
					// https://ck101.com/forum.php?mod=viewthread&tid=4016100
					url = url.replace(/&amp;/g, '&');

					// [ url, path, file_name, is_directory ]
					var matched = url.match(/^([\s\S]*\/)([^\/]+)(\/)?$/);
					if (!matched || attribute_name.toLowerCase() !== 'src'
					// skip web page, do not modify the link of web pages
					&& (matched[3] || /\.html?$/i.test(matched[2]))) {
						library_namespace.log([ 'check_text: ', {
							// gettext_config:{"id":"skip-web-page-resource-$1"}
							T : [ '跳过网页资源：%1', url ]
						}, '\n', {
							// gettext_config:{"id":"of-file-$1"}
							T : [ '档案路径：%1', item_data.file ]
						} ]);
						return all;
					}

					var file_name = matched[2],
					// links.push的href档名在之后add_chapter()时可能会被改变。因此在xhtml文件中必须要先编码一次。
					href = _this.directory.media
							+ encode_file_name.call(_this, file_name);
					url = full_URL_of_path(url, item_data.base_URL
							|| item_data.url);
					links.push({
						url : url,
						href : _this.directory.media + file_name,
						get_URL_options : Object.assign({
							error_retry : 4
						}, item_data.get_URL_options)
					});
					return matched ? ' title="'
					// recover url
					+ to_XHTML_URL(url) + '" ' + attribute_name + '="' + href
							+ '"' : all;
				});

				contents = contents.replace(/<a ([^<>]+)>([^<>]+)<\/a>/ig,
				// <a href="*.png">挿絵</a> → <img alt="挿絵" src="*.png" />
				function(all, attributes, innerText) {
					var href = attributes
							.match(/(?:^|\s)href=(["'])([^"'])\1/i)
							|| attributes.match(/(?:^|\s)href=()([^"'\s])/i);
					if (!href || /\.html?$/i.test(href[2])) {
						return all;
					}
					return '<img '
							+ (attributes.includes('alt="') ? '' : 'alt="'
									+ innerText + '" ')
							+ attributes.replace(/(?:^|\s)href=(["'])/ig,
									' src=$1').trim() + ' />';
				});

				contents = contents.replace(/<img ([^<>]+)>/ig, function(tag,
						attributes) {
					return '<img ' + attributes.replace(
					// <img> 中不能使用 name="" 之类
					/(?:^|\s)(?:name|border|onmouse[a-z]+|onload)\s*=\s*\S+/ig,
					//
					'').trim() + '>';
				});

				if (links.length > 0) {
					links = links.unique();
					// console.log(links);
					_this.add(links);
				}
			}

			return contents;
		}

		if (contents) {
			if (detect_file_type(item.href) !== 'text') {
				// assert: item, contents 为 resource。

			} else if (library_namespace.is_Object(contents)) {
				// 预设自动生成。
				library_namespace.debug(contents, 6);
				var // gettext = setup_gettext.call(this),
				html = [ '<?xml version="1.0" encoding="UTF-8"?>',
				// https://www.w3.org/QA/2002/04/valid-dtd-list.html
				// https://cweiske.de/tagebuch/xhtml-entities.htm
				// '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"',
				// ' "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">',
				'<!DOCTYPE html>',
				//
				'<html xmlns="http://www.w3.org/1999/xhtml">', '<head>',
				// https://developer.mozilla.org/zh-TW/docs/Web_%E9%96%8B%E7%99%BC/Historical_artifacts_to_avoid
				// <meta http-equiv="Content-Type"
				// content="text/html; charset=UTF-8" />
				'<meta charset="UTF-8" />' ];

				this.resources.forEach(function(resource) {
					if (resource['media-type'] === 'text/css') {
						html.push(
						// add all styles
						'<link rel="stylesheet" type="text/css" href="'
								+ resource.href + '" />');
					}
				});

				// console.log([ contents.title, contents.sub_title ]);
				html.push('<title>', [ contents.title, contents.sub_title ]
				//
				.filter(function(title) {
					return !!title;
				}).join(this.title_separator), '</title>', '</head><body>');

				// ------------------------------

				// 设定item_data.url可以在阅读电子书时，直接点选标题就跳到网路上的来源。
				var url_header = item_data.url
						&& ('<a href="' + to_XHTML_URL(item_data.url) + '">'), title_layer = [];
				// 卷标题 part/episode > chapter > section
				if (contents.title) {
					title_layer
							.push('<h2>', url_header ? url_header
									+ contents.title + '</a>' : contents.title,
									'</h2>');
				}
				// 章标题
				if (contents.sub_title) {
					title_layer.push('<h3>', url_header ? url_header
							+ contents.sub_title + '</a>' : contents.sub_title,
							'</h3>');
				} else if (!contents.title) {
					library_namespace.warn([ 'add_chapter: ', {
						// gettext_config:{"id":"title-not-set-$1"}
						T : [ '未设定标题：%1……',
						//
						String(contents.text).slice(0, 200) || '(无内容)' ]
					} ]);
				}
				// console.log(title_layer);

				// ------------------------------

				html.push(
				// 将作品资讯栏位置右。
				'<div id="chapter_information" style="float:right;">');

				if (item_data.date) {
					// 掲载日/掲载开始日, 最新投稿/最终投稿日
					var date_list = item_data.date;
					date_list = (Array.isArray(date_list) ? date_list
							: [ date_list ]).map(function(date) {
						return library_namespace.is_Date(date)
						//
						? date.format('%Y-%2m-%2d') : date;
					}).filter(function(date) {
						return !!date;
					}).join(', ');
					if (date_list) {
						// 加入本章节之最后修订日期标示。
						html.push('<p class="date">', date_list, '</p>');
					}
				}

				if (false) {
					html.push('<div>', contents.chapter, '</div>');
				}

				var post_processor = contents.post_processor;
				contents = check_text(contents.text);
				if (typeof post_processor === 'function') {
					// 进一步处理书籍之章节内容。例如繁简转换、错别字修正、裁剪广告。
					// 因为这个函数可能有记录功能，因此就算是空内容，也必须执行。
					contents = post_processor(contents);
				}
				if (contents.length > 5e5) {
					// 这长度到这边往往已经耗费数十秒。
					library_namespace.debug({
						T : [
						// gettext_config:{"id":"content-length-$1-characters"}
						'Content Length: %1 {{PLURAL:%1|character|characters}}'
						//
						, contents.length ]
					});
				}
				if (!(item_data.word_count > 0)) {
					item_data.word_count = library_namespace.count_word(
							contents, 1 + 2);
					if (!(item_data.word_count > 0)) {
						library_namespace.debug({
							// gettext_config:{"id":"no-content-received-$1"}
							T : [ 'No content received: %1',
							//
							item_data.title || item_data.id || item_data.url ]
						});
					}
				}

				var messages = new gettext.Sentence_combination(
				// gettext_config:{"id":"$1-word(s)-in-this-chapter"}
				[ '本章共 %1 {{PLURAL:1|个字}}', item_data.word_count ]);
				// item_data.words_so_far: 本作品到前一个章节总计的字数。
				// @see function count_words_so_far(item) @
				// CeL.application.net.work_crawler.ebook
				if (item_data.words_so_far > 0) {
					messages.push(',',
					// gettext_config:{"id":"$1-word(s)-accumulated"}
					[ '累计 %1 {{PLURAL:1|个字}}', item_data.words_so_far + item_data.word_count ]);
				}

				// 加入本章节之字数统计标示。
				html.push('<p class="word_count">', messages, '</p>');
				// console.trace(html.join(this.to_XML_options.separator));

				html.push('</div>');

				// ------------------------------

				html.append(title_layer);

				// 加入本章节之内容。
				html.push('<div class="text">', contents, '</div>', '</body>',
						'</html>');

				contents = contents.length > this.MIN_CONTENTS_LENGTH ? html
						.join(this.to_XML_options.separator) : '';

			} else {
				contents = check_text(contents);
			}
		}

		var text = undefined;
		if ((!contents || !(contents.length >= this.MIN_CONTENTS_LENGTH))
		// 先尝试读入旧的资料。
		&& (text = library_namespace.read_file(this.path.text + item.href))) {
			contents = text;
			// 取得纯内容部分。
			if (false) {
				contents = text.between('<div class="text">', {
					tail : '</div>'
				});
			}
		}

		if (contents && contents.length >= this.MIN_CONTENTS_LENGTH) {
			// 应允许文字叙述式 word count。
			if (!item_data.word_count && item_data.word_count !== 0) {
				item_data.word_count = library_namespace.count_word(contents,
						1 + 2);
			}

			if (text) {
				library_namespace.warn([ 'add_chapter: ', {
					T : [
					// gettext_config:{"id":"because-the-content-you-want-to-set-is-too-short-or-has-no-content-the-old-content-($1-characters)-will-be-used-from-the-cache-file"}
					'因为欲设定的内容长度过短或者无内容，将从快取档案中取得旧的内容（%1 个{{PLURAL:%1|字元}}）：',
					//
					contents.length ]
				}, ' \n',
				//
				(item_data.file || decode_identifier.call(this, item.id))
				//
				+ (item_data.url ? ' (' + item_data.url + ')' : '') ]);
			} else if (item_data.write_file !== false) {
				library_namespace.debug({
					T : [
					// gettext_config:{"id":"writing-$1-chars-to-$2"}
					'Writing %1 {{PLURAL:%1|character|characters}} to [%2]...',
							contents.length, this.path.text + item.href ]
				});
				// 需要先准备好目录结构。
				this.initialize();
				// 将内容文字写入档案。
				library_namespace.write_file(this.path.text + item.href,
						contents);
			} else {
				library_namespace.debug({
					// gettext_config:{"id":"only-the-project-data-index-is-set-and-the-file-$1-is-not-automatically-written.-you-need-to-do-this-yourself"}
					T : [ '仅设定项目资料索引，未自动写入档案 [%1]，您需要自己完成这动作。',
							this.path.text + item.href ]
				});
			}

		} else if (!item_data.force) {
			library_namespace.info([ 'add_chapter: ', {
				// gettext_config:{"id":"skip-content-that-is-too-short-($1-characters)"}
				T : [ contents ? '跳过长度过短的内容（%1 个{{PLURAL:%1|字元}}）：'
				//
				// gettext_config:{"id":"skip-the-no-content-empty-chapter"}
				: '跳过无内容/空章节：', contents && contents.length ]
			},
			//
			(item_data.file || decode_identifier.call(this, item.id))
			//
			+ (item_data.url ? ' (' + item_data.url + ')' : '') ]);
			// gettext_config:{"id":"too-short"}
			item.error = gettext('too short');
			return item;
		}

		if (item_data.TOC) {
			library_namespace.debug({
				// gettext_config:{"id":"if-this-chapter-already-exists-remove-it-first-$1"}
				T : [ '若是已存在此章节则先移除：%1', item.id ]
			}, 3);
			remove_chapter.call(this, item.id);

			// EPUB Navigation Document
			item.properties = 'nav';
			this.TOC = item;

		} else {
			if (this.TOC && this.TOC.id === item.id) {
				// @see remove_chapter()
				library_namespace.remove_file(this.path.text + this.TOC.href);
				delete this.TOC;
			} else {
				// remove_chapter.call(this, item, true);
			}

			// console.log(item);
			// chapter or resource
			add_manifest_item.call(this, item,
					item['media-type'] === 'text/css');
		}
		return item;
	}

	function remove_chapter(title, preserve_data, is_resource) {
		// TODO: is_resource

		var index;
		if (title >= 0) {
			index = title;
		} else {
			index = index_of_chapter.call(this, title);
			if (!(index >= 0)) {
				return;
			}
		}

		var item = preserve_data ? this.chapters[index] : this.chapters.splice(
				index, 1);
		library_namespace.remove_file(this.path.text + item.href);
		return [ index, item ];
	}

	// -------------------------------------------------------------------------
	// 打包相关函式。

	function setup_gettext() {
		var language = set_meta_information.call(this, 'language');
		if (language && (language = language[0])) {
			library_namespace.debug({
				// gettext_config:{"id":"using-language-$1"}
				T : [ 'Using language: %1', language ]
			});
		}

		var gettext = library_namespace.gettext.in_domain
		// @see application/locale/resources/locale.csv
		? library_namespace.gettext.in_domain.bind(null, language)
				: library_namespace.gettext;

		return gettext;
	}

	// 自动生成目录。
	function generate_TOC() {
		var original_domain = library_namespace.gettext.get_domain_name
				&& library_namespace.gettext.get_domain_name();
		if (original_domain) {
			var use_domain = original_domain && this.metadata['dc:language'];
			use_domain = use_domain && use_domain[0]['dc:language'];
			if (use_domain && original_domain !== use_domain) {
				// 确保目录使用的语言与书籍相同。
				library_namespace.gettext.use_domain(use_domain);
			} else {
				original_domain = null;
			}
		}

		var // gettext = setup_gettext.call(this),
		// 一般说来，title 应该只有一个。
		book_title = set_meta_information.call(this, 'title').join(', '),
		//
		TOC_html = [ '<?xml version="1.0" encoding="UTF-8"?>',
		// https://www.w3.org/QA/2002/04/valid-dtd-list.html
		// https://cweiske.de/tagebuch/xhtml-entities.htm
		// '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"',
		// ' "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">',
		'<!DOCTYPE html>',
		//
		'<html xmlns="http://www.w3.org/1999/xhtml"',
		//
		' xmlns:epub="http://www.idpf.org/2007/ops">',
		// The 'head' element should have a 'title' child element.
		'<head>', '<meta charset="UTF-8" />' ];

		this.resources.forEach(function(resource) {
			if (resource['media-type'] === 'text/css') {
				// add all styles
				TOC_html.push('<link rel="stylesheet" type="text/css" href="'
						+ resource.href + '" />');
			}
		});

		TOC_html.push('<title>', book_title, '</title>', '</head>',
		//
		'<body>', '<h1>', book_title, '</h1>');

		this.resources.some(function(resource) {
			// only allow 1 cover-image
			if (resource.properties === cover_image_properties) {
				TOC_html.push(JSON.to_XML({
					img : null,
					alt : "cover-image",
					title : resource[KEY_DATA] && resource[KEY_DATA].url
					//
					|| resource.href,
					src : resource.href
				}));
				return true;
			}
		});

		TOC_html.push('<h2>',
		// 作品资讯, 小说情报, 电子书籍绍介, 作品情报, book information
		// gettext_config:{"id":"work-information"}
		gettext('Work information'), '</h2>', '<div id="work_data">', '<dl>');

		/**
		 * <code>
		this.metadata = {
			'dc:tagname' : [ {Object} ],
			meta : { [property] : [ {Object} ] },
			link : { href : {Object} }
		}
		</code>
		 */
		function add_information(data) {
			var key = data[0].replace(metadata_prefix, ''),
			// data = [ tag_name or property, element list ]
			values = data[1].map(function(element) {
				var value = data[0] in element ? element[data[0]]
				// for <meta>, data[0] is property
				: element.meta || element.content || '';
				if (library_namespace.is_Date(value)) {
					// e.g., dcterms:modified, <dc:date>
					// value = date_to_String(value);
					value = value.toLocaleTimeString();
				}
				return value;
			});

			if (key === 'language') {
				if (library_namespace.gettext.get_alias) {
					values = values.map(function(value) {
						return library_namespace.gettext.get_alias(value);
					});
				}
			} else if (key === 'source') {
				// if (library_namespace.locale.gettext)
				if (library_namespace.locale) {
					values = values.map(function(value) {
						if (/^https?:\/\/\S+$/.test(value)) {
							value = '<a href="' + value + '">'
							//
							+ value + '</a>';
						}
						return value;
					});
				}
			} else if (key === 'description') {
				// console.log(values);
				values = values.map(function(value) {
					// 作品介绍可以换行。
					return value.replace(/\n/g, '<br />');
				});
			}

			TOC_html.push('<dt>',
			// gettext_config:{"id":"toc.identifier","mark_type":"combination_message_id"}
			// gettext_config:{"id":"toc.title","mark_type":"combination_message_id"}
			// gettext_config:{"id":"toc.language","mark_type":"combination_message_id"}
			// gettext_config:{"id":"toc.date","mark_type":"combination_message_id"}
			// gettext_config:{"id":"toc.creator","mark_type":"combination_message_id"}
			// gettext_config:{"id":"toc.subject","mark_type":"combination_message_id"}
			// gettext_config:{"id":"toc.description","mark_type":"combination_message_id"}
			// gettext_config:{"id":"toc.publisher","mark_type":"combination_message_id"}
			// gettext_config:{"id":"toc.source","mark_type":"combination_message_id"}
			// gettext_config:{"id":"toc.dcterms-modified","mark_type":"combination_message_id"}
			// gettext_config:{"id":"toc.calibre-series","mark_type":"combination_message_id"}
			gettext('TOC.' + key), '</dt>',
			//
			'<dd>', values.join(', '), '</dd>');
		}

		// console.log(this.metadata);
		Object.entries(this.metadata).forEach(function(data) {
			if (data[0] === 'meta' || data[0] === 'link') {
				// 待会处理。
				return;
			}

			// data = [ tag_name, element list ]
			add_information(data);
		});

		if (library_namespace.is_Object(this.metadata.meta)) {
			Object.entries(this.metadata.meta).forEach(add_information);
		}

		// Skip this.metadata.link

		var // gettext = setup_gettext.call(this),
		// 字数计算, 合计文字数
		total_word_count = 0;
		this.chapters.forEach(function(chapter) {
			var this_word_count = chapter[KEY_DATA]
					&& chapter[KEY_DATA].word_count;
			if (this_word_count > 0) {
				total_word_count += this_word_count;
			}
		});
		if (total_word_count > 0) {
			// TODO: 总共几个字，平均每章节几个字
			TOC_html.push('<dt>',
			// gettext_config:{"id":"word-count"}
			gettext('word count'), '</dt>', '<dd>',
			// gettext_config:{"id":"$1-words"}
			gettext('%1 {{PLURAL:%1|word|words}}', total_word_count) + ' / '
			// gettext_config:{"id":"$1-chapters"}
			+ gettext('%1 {{PLURAL:%1|chapter|chapters}}',
			//
			this.chapters.length) + ' ≈ '
			// 平均文字数
			+ Math.round(total_word_count / this.chapters.length), '</dd>');
		}
		TOC_html.push('</dl>', '</div>');

		// The toc nav element must occur exactly once in an EPUB
		// Navigation Document.
		TOC_html.push('<nav epub:type="toc" id="toc">', '<h2>',
		// 作品目录 目次 Table of contents
		// gettext_config:{"id":"contents"}
		gettext('Contents'), '</h2>', '<ol>');

		// recovery
		if (original_domain)
			library_namespace.gettext.use_domain(original_domain);

		// --------------------------------------

		var chapter_list = [];

		this.chapters.map(function(chapter) {
			var data = chapter[KEY_DATA] || Object.create(null);
			// console.log(data);
			var date = Array.isArray(data.date) ? data.date[0] : data.date;
			// console.log(date);
			var chapter_item;
			if (date) {
				if (library_namespace.is_Date(date)) {
					date = date.format('%Y-%2m-%2d');
				}
				// 首发时间
				chapter_item = [ ' ', {
					small : '(' + date + ')'
				} ];
			} else {
				chapter_item = [];
			}

			var title = data.title
			// 未失真的 title = decode_identifier.call(this, item.id)
			|| decode_identifier.call(this, chapter.id);

			var url = chapter.href;
			var parent_list = chapter_list;

			if (this.add_TOC_hierarchy) {
				var NO = title.match(/^(\d{1,4}\s)(.+)$/);
				if (NO) {
					title = NO[2];
					NO = NO[1];
				}
				var title_hierarchy = title.split(this.title_separator);
				/**
				 * 阶层显示目录。 <code>

				chapter_list = [
					// chapter without part:
					{li:
						{a:['title',' ',{small:'date'}],href:'url'}
					},
					// chapter with part:
					{li: [
						{a:['title']},
						{ol:[{li:'chapters'}]}
					] }
				]

				</code>
				 */
				while (parent_list.length > 0) {
					// get the last <li>
					var anchor = parent_list.at(-1);
					var part_title = (Array.isArray(anchor.li) ? anchor.li[0]
							: anchor.li).a[0];
					// @see chapter with part
					if (part_title !== title_hierarchy[0].trim()) {
						break;
					}
					title_hierarchy.shift();
					if (!Array.isArray(anchor.li)) {
						// assert: anchor.li =
						// {a:['title',' ',{small:'date'}],href:'url'}
						anchor.li = [ anchor.li, {
							ol : /* next parent_list */[]
						} ];
					}
					parent_list = anchor.li[1].ol;
				}

				while (title_hierarchy.length > 1) {
					// assert: {String}title_hierarchy[0] ===
					// title_hierarchy[0].trim() !== ''
					var anchor = {
						li : [ {
							a : [ title_hierarchy.shift().trim() ],
							href : url
						}, {
							ol : /* next parent_list */[]
						} ]
					};
					parent_list.push(anchor);
					parent_list = anchor.li[1].ol;
				}
				// assert: title_hierarchy.length === 1
				title = (NO || '') + title_hierarchy.shift().trim();
				// assert: {String}title === title.trim() !== ''
			}

			// calibre 的目录只取 <a> 的内容。
			if (true) {
				// 以这方法，目录中会出现日期。
				chapter_item.unshift(title);
				chapter_item = {
					a : chapter_item,
					href : url
				};
			} else {
				// 以这方法，目录中不会出现日期。
				chapter_item.unshift({
					a : title,
					href : url
				});
			}
			parent_list.push({
				li : chapter_item
			});
		}, this);

		if (chapter_list.length === 1) {
			var anchor_li = chapter_list[0].li;
			// anchor_li: [ {a:['title']}, {ol:[{li:'chapters'}]} ]
			var part_title = Array.isArray(anchor_li) && anchor_li[0].a;
			if (Array.isArray(part_title)) {
				part_title = part_title[0];
			}
			if (part_title && part_title.includes('正文')) {
				// 只有一卷，叫作"正文卷"。
				chapter_list = anchor_li[1].ol;
			}
		}

		// console.log(chapter_list);
		// console.log(JSON.stringify(chapter_list));

		var to_XML_options = Object.clone(this.to_XML_options);
		// No declaration needed.
		delete to_XML_options.declaration;
		TOC_html.push(JSON.to_XML(chapter_list, to_XML_options), '</ol>',
				'</nav>', '</body>', '</html>');

		return TOC_html.join(this.to_XML_options.separator);
	}

	function write_chapters(callback) {
		// 对 media 过多者，可能到此尚未下载完。
		// add_chapter() 的过程可能资源档还没下载完，整本书的章节就已经下载完了。
		// 应该多加上对资源档是否已完全下载完毕的检查。
		if (!library_namespace.is_empty_object(this.downloading)) {
			// 注册 callback，等所有媒体档案下载完再收尾。
			this.add_listener('all_downloaded', write_chapters.bind(this,
					callback));
			library_namespace.debug([ 'write_chapters: ', {
				// gettext_config:{"id":"waiting-for-all-resources-loaded"}
				T : 'Waiting for all resources loaded...'
			} ], 0);
			// console.log(this.downloading);
			return;
		}

		library_namespace.debug({
			// gettext_config:{"id":"start-writing-e-book-materials"}
			T : '开始写入电子书资料……'
		}, 2, 'write_chapters');
		'identifier,title,language,dcterms:modified'.split(',')
		// little check
		.forEach(function(item) {
			var is_meta = item.includes(':'),
			//
			container = this.metadata[
			//
			is_meta ? 'meta' : to_meta_information_tag_name(item)];
			if (is_meta) {
				container = container[item];
			}
			if (!container || !(container.length >= 1)) {
				library_namespace.warn({
					// gettext_config:{"id":"missing-resource-item-$1"}
					T : [ '丢失资源项目 %1', item ]
				});
			}
		}, this);

		this.initialize();

		var meta = this.metadata.meta, link = this.metadata.link;
		// sort: 将 meta, link 置于末尾。
		delete this.metadata.meta;
		delete this.metadata.link;
		this.metadata.meta = meta;
		this.metadata.link = link;
		/**
		 * <code>

		this.metadata = {
			'dc:tagname' : [ {Object} ],
			meta : { [property] : [ {Object} ] },
			link : { href : {Object} }
		}

		</code>
		 */
		this.raw_data_ptr.metadata.clear();
		Object.entries(this.metadata).forEach(function(data) {
			if (data[0] === 'meta' || data[0] === 'link') {
				// 待会处理。
				return;
			}

			// TODO: 正规化{Object}data[1]，如值中有 {Date}。
			var _data;
			// calibre 里面的标签采用逗号","做为分隔，若是直接输入{Array}subject，
			// JSON.to_XML(this.raw_data, this.to_XML_options)
			// 的时候会以 this.to_XML_options.separator : '\n' 为分隔，
			// 造成无法判别，因此需要特别处理。
			if (data[0] === 'dc:subject') {
				_data = data[1].map(function(object) {
					object = Object.clone(object);
					for ( var tag in object) {
						if (Array.isArray(object[tag]))
							object[tag] = object[tag].join(',');
						// only apply to children.
						// 资料结构和 new_node 类似:
						// {tagName:children,attrName:attr,...}
						break;
					}
					return object;
				});
			} else {
				_data = data[1];
			}
			this.raw_data_ptr.metadata.append(_data);
		}, this);

		if (library_namespace.is_Object(this.metadata.meta)) {
			Object.values(this.metadata.meta).forEach(function(list) {
				// element list
				// TODO: 正规化{Object}data[1]，如值中有 {Date}。
				this.raw_data_ptr.metadata.append(list);
			}, this);
		}

		if (library_namespace.is_Object(this.metadata.link)) {
			this.raw_data_ptr.metadata.push(Object.values(this.metadata.link));
		}

		// console.log(chapters);
		if (!this.TOC
		// TODO: check if the TOC file exists.
		) {
			// 不能用 this.add()，因为当 .pack() 时，必须在 archive 前先 add_chapter()。
			add_chapter.call(this, {
				title : 'TOC',
				TOC : true
			}, this.generate_TOC());
		}

		var chapters = this.chapters.clone();
		// add TOC as the first chapter.
		chapters.unshift(this.TOC);
		// console.log(this.resources.concat(chapters));

		// {Array}raw_data.package[0].metadata
		// {Array}raw_data.package[1].manifest
		// {Array}raw_data.package[2].spine

		// rebuild package. 但不能动到定义，因此不直接 =[]，采用.push()。
		this.raw_data_ptr.manifest.clear();
		this.resources.concat(chapters).forEach(function(resource) {
			this.raw_data_ptr.manifest.push(
			// 再做一次检查，预防被外部touch过。
			normalize_item.call(this, resource, true));
			if (resource[KEY_DATA]) {
				var info = Object.create(null), configured;
				this.preserve_attributes.forEach(function(name) {
					if (resource[KEY_DATA][name]) {
						configured = true;
						info[name] = resource[KEY_DATA][name];
					}
				});
				if (configured) {
					info = JSON.stringify(info);
					if (/%2D(?:-|%2D)|-%2D/.test(info)) {
						library_namespace.error(
						// gettext_config:{"id":"the-instructed-material-to-be-enclosed-in-the-comment-itself-contains-text-such-as-$2d$2d-or-$2d-which-will-cause-an-error-in-decoding"}
						'所欲封入注释的诠释资料本身含有 "%2D%2D" 或 "%2D-" 之类文字，将造成解码时出现错误！');
						library_namespace.info(info);
					}
					this.raw_data_ptr.manifest.push('<!-- '
					// The string "--" is not permitted within comments.
					// 在 HTML 注释中不能包含 "--"。
					// TODO: 还没排除 "%2D--" 之类问题。
					+ info.replace(/-{2,}/g, function($0) {
						return '%2D'.repeat($0.length);
					}) + ' -->');
				}
			}
		}, this);

		this.raw_data_ptr.spine.clear();
		this.raw_data_ptr.spine.push(chapters.filter(function(chapter) {
			return !!chapter.id;
		}).map(function(chapter) {
			return {
				itemref : null,
				idref : chapter.id
			};
		}))

		library_namespace.write_file(this.path.book
				+ this.package_document_name,
		// 写入电子书封包资料。
		JSON.to_XML(this.raw_data, this.to_XML_options));

		typeof callback === 'function' && callback();
	}

	// package, bale packing 打包 epub。
	function archive_to_ZIP(target_file, remove, callback, file_list) {
		if (!library_namespace.is_empty_object(this.downloading)) {
			// 注册 callback，等所有媒体档案下载完再收尾。
			this.add_listener('all_downloaded', archive_to_ZIP.bind(this,
					target_file, remove, callback, file_list));
			library_namespace.info([ 'archive_to_ZIP: ', {
				// gettext_config:{"id":"waiting-for-all-resources-loaded"}
				T : 'Waiting for all resources loaded...'
			} ], 0);
			return;
		}

		if (Array.isArray(callback) && !file_list) {
			file_list = callback;
			callback = null;
		}
		if (false && Array.isArray(file_list)) {
			// 警告: 必须自行先排除 mimetype 这个档案。
			file_list = file_list.filter(function(path) {
				return path !== mimetype_filename;
			});
		}

		library_namespace.debug({
			// gettext_config:{"id":"start-building-e-books"}
			T : '开始建构电子书……'
		}, 2, 'archive_to_ZIP');
		// check arguments
		if (Array.isArray(target_file) && target_file.length === 2) {
			// [ target_directory, target_file_name ]
			var target_directory = target_file[0];
			target_file = target_file[1];

			if (!target_directory) {
				target_directory = this.path.root;
			} else if (!/[\\\/]$/.test(target_directory)) {
				target_directory += path_separator;
			}

			if (!target_file) {
				target_file = this.path.root.match(/([^\\\/]+)[\\\/]$/)[1];
			}

			// target_file = library_namespace.to_file_name(target_file);

			target_file = target_directory + target_file;
		}
		// assert: typeof target_file === 'string'

		if (!/\.[^\\\/.]+$/.test(target_file)) {
			// add file extension
			target_file += '.epub';
		}

		// this.flush();

		// remove empty directories
		Object.keys(this.path).sort()
		// 删除目录时，应该从深层目录开始。
		.reverse().forEach(function(name) {
			var directory = this.path[name],
			//
			fso_list = library_namespace.read_directory(directory);
			if (!fso_list || fso_list.length === 0) {
				library_namespace.debug({
					// gettext_config:{"id":"removing-empty-directory-$1"}
					T : [ '移除空目录：%1', directory ]
				}, 1, 'archive_to_ZIP');
				library_namespace.remove_directory(directory);
			}
		}, this);

		// 先删除旧的电子书档案以防干扰。
		library_namespace.remove_file(target_file);

		library_namespace.debug({
			// gettext_config:{"id":"creating-an-ebook-with-7zip-$1"}
			T : [ '以 7zip 创建电子书：%1……', target_file ]
		}, 1, 'archive_to_ZIP');

		var archive_file = library_namespace.storage.archive.archive_under(
		// 注意: 这需要先安装 7z.exe 程式。
		this.path.root,
		// 确保 mimetype 这个档在第一顺位。
		target_file, {
			level : 0,
			files : [ mimetype_filename ],
			type : 'zip'
		}),
		// 改变后的档案长度必须要和原先的相同，这样比较保险，不会更改到档案结构。
		mimetype_first_order_name = mimetype_filename.replace(/^./, '!');
		// assert: mimetype_filename.length === mimetype_first_order_name.length

		// https://support.microsoft.com/en-us/help/830473/command-prompt-cmd-exe-command-line-string-limitation
		// On computers running Microsoft Windows XP or later, the maximum
		// length of the string that you can use at the command prompt is 8191
		// characters.
		if (Array.isArray(file_list) && file_list.join('" "').length > 7800) {
			library_namespace.warn([ archive_to_ZIP.name + ': ', {
				// gettext_config:{"id":"the-file-list-is-too-long-so-it-is-changed-to-compress-the-entire-directory"}
				T : '档案列表过长，改成压缩整个目录。'
			} ]);
			// 当 epub 电子书非本工具产生时，可能有不同的目录，必须重新读取。
			file_list = library_namespace.read_directory(this.path.root)
			// archive all directory without mimetype
			.filter(function(fso_name) {
				return fso_name !== mimetype_filename;
			});

		} else if (!file_list) {
			file_list = [ container_directory_name,
					Ebook.prototype.root_directory_name ]
		}

		// 请注意： rename 必须先安装 7-Zip **16.04 以上的版本**。
		archive_file.rename([ mimetype_filename, mimetype_first_order_name ]);

		// console.log([ this.path, file_list ]);
		library_namespace.storage.archive.archive_under(this.path.root,
		// archive others.
		archive_file, {
			// set MAX lavel
			level : 9,
			files : file_list,
			recurse : true,
			extra : (remove ? '-sdel ' : ''),
			type : 'zip'
		});

		// recover mimetype
		archive_file.rename([ mimetype_first_order_name, mimetype_filename ]);

		library_namespace.debug({
			// gettext_config:{"id":"the-e-book-is-created-$1"}
			T : [ '电子书创建完毕：%1', target_file ]
		}, 1, 'archive_to_ZIP');

		// 若需要留下/重复利用media如images，请勿remove。
		if (remove) {
			// rd /s /q this.path.root
			// 这会删除整个目录，包括未被 index 的档案。
			var error = library_namespace
					.remove_directory(this.path.root, true);
			if (error) {
				// the operatoin failed
				library_namespace.error(error);
			}
		}
		typeof callback === 'function' && callback();
	}

	Ebook.prototype = {
		// default root directory name
		// Open eBook Publication Structure (OEBPS)
		// @see [[Open eBook]]
		// http://www.idpf.org/epub/31/spec/epub-ocf.html#gloss-ocf-root-directory
		root_directory_name : 'EPUB',
		// 开放包裹格式 Open Packaging Format metadata file
		// http://www.idpf.org/epub/31/spec/epub-spec.html#gloss-package-document
		// e.g., EPUB/content.opf
		package_document_name : 'content.opf',

		title_separator : ' - ',
		// 阶层显示目录。
		add_TOC_hierarchy : true,

		to_XML_options : {
			declaration : true,
			separator : '\n'
		},

		// 预设所容许的章节最短内容字数。最少应该要容许一句话的长度。
		MIN_CONTENTS_LENGTH : 4,

		// 应该用[A-Za-z]起始，但光单一字母不容易辨识。
		id_prefix : 'i',
		/**
		 * {Natural}id 与档案名称最大长度。
		 * 
		 * calibre 会把电子书解开，放在如
		 * C:\Users\user\AppData\Local\calibre-cache\ev\tmpunbkaj\a\
		 * 目录底下。这个数值可以限制 id 与档案名称最大长度，预防写入的时候出现错误。
		 * 
		 * 因为有以下情况，因此80还不够:<br />
		 * 第五十六章 守夜人 https://ck101.com/thread-2676074-6-1.html#post_88380114
		 * 第五十六章 守夜人的惶恐 https://ck101.com/thread-2676074-74-1.html#post_91512116
		 */
		MAX_ID_LENGTH : 100,

		setup_container : setup_container,
		initialize : initialize,
		set_raw_data : set_raw_data,
		set : set_meta_information,
		set_writing_mode : set_writing_mode,
		// book.set_cover(url)
		// book.set_cover({url:'url',file:'file_name'})
		// book.set_cover(file_name, contents)
		set_cover : set_cover_image,
		arrange : function arrange() {
			rebuild_index_of_id.call(this, false, true);
			rebuild_index_of_id.call(this, true, true);
		},
		add : function add(item_data, contents) {
			// console.trace(item_data);
			return this[KEY_working_queue] = this[KEY_working_queue]
			// clean error
			['catch'](library_namespace.null_function).then(
					add_chapter.bind(this, item_data, contents));
		},
		remove : function remove(item_data, contents) {
			return this[KEY_working_queue] = this[KEY_working_queue]
			// clean error
			['catch'](library_namespace.null_function)
			//
			.then(remove_chapter.bind(this, title, preserve_data, is_resource));
		},

		add_listener : add_listener,

		generate_TOC : generate_TOC,
		flush : write_chapters,
		// pack up
		archive : archive_to_ZIP,
		// preserve additional properties
		preserve_attributes : 'meta,url,file,type,date,word_count'.split(','),
		pack : function(target_file, remove, callback) {
			// console.trace(target_file);
			return this[KEY_working_queue] = this[KEY_working_queue]
			// clean error
			['catch'](library_namespace.null_function).then(
					write_chapters.bind(this))
			// clean error
			['catch'](library_namespace.null_function).then(
					archive_to_ZIP.bind(this, target_file, remove, callback));
		}
	};

	return Ebook;
}
