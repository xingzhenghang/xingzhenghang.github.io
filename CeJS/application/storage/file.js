/**
 * @name CeL file function
 * @fileoverview 本档案包含了 file functions。
 * @since
 * @see <a href="http://dev.w3.org/2006/webapi/FileAPI/" accessdate="2010/6/20
 *      14:49">File API</a>
 */

'use strict';
// 'use asm';

// --------------------------------------------------------------------------------------------

// 不采用 if 陈述式，可以避免 Eclipse JSDoc 与 format 多缩排一层。
typeof CeL === 'function' && CeL.run({
	// module name
	name : 'application.storage.file',

	// Math.log2()
	require : 'data.code.compatibility.'
	// .chunk()
	+ '|data.native.'
	// MIME_of()
	// +'|application.net.MIME.'
	,

	// 设定不汇出的子函式。
	// no_extend : '*',

	// 为了方便格式化程式码，因此将 module 函式主体另外抽出。
	code : module_code
});

function module_code(library_namespace) {

	/**
	 * null module constructor
	 * 
	 * @class 档案操作相关之 function。
	 */
	var _// JSDT:_module_
	= function() {
		// null module constructor
	};

	/**
	 * for JSDT: 有 prototype 才会将之当作 Class
	 */
	_// JSDT:_module_
	.prototype = {};

	// ---------------------------------------------------------------
	// path处理

	// @see CeL.simplify_path()

	// 去除hostname等，如输入http://hostname/aaa/bbb/ccc得到aaa/bbb/ccc/
	// 假如输入的格式不正确，可能得出不预期的回应值！
	/*
	 * 对library_namespace.env.path_separator.length>1的情形（严谨）
	 */
	function deprecated_getPathOnly(p) {
		// discard hash & search
		var i = p.lastIndexOf('?'), j = p.lastIndexOf('#'), dirSpL = library_namespace.env.path_separator.length;
		if (i === -1)
			i = j;
		else if (j !== -1 && i > j)
			i = j;
		if (i !== -1)
			p = p.slice(0, i);
		// 去除http://hostname/等
		if (p.slice(0, 5) === 'file:///')
			// 对file:///特别处理！
			p = p.substr('file:///'.length);
		else if ((i = p.indexOf(':' + library_namespace.env.path_separator
		//
		+ library_namespace.env.path_separator)) !== -1
		//
		&& (i = p.indexOf(library_namespace.env.path_separator, i + (':'
		//
		+ library_namespace.env.path_separator
		//
		+ library_namespace.env.path_separator).length)) !== -1)
			// http://hostname/path→path
			p = p.substr(i + dirSpL);
		else if (p.slice(0, dirSpL) === library_namespace.env.path_separator)
			// /usr/local/→usr/local/
			if (p.substr(dirSpL, dirSpL) !== library_namespace.env.path_separator)
				p = p.substr(dirSpL);
			else if ((i = p.indexOf(library_namespace.env.path_separator,
					dirSpL + dirSpL)) > dirSpL + dirSpL)
				// 去除\\hostname\
				p = p.substr(i + dirSpL);
			else if (i !== -1)
				// \\\zzzz的情形：不合法的路径
				throw new Error(1, 'illegal path:' + p);
		return p;
	}

	// 对library_namespace.env.path_separator.length==1的情形简化
	// getPathOnly[generateCode.dLK]='library_namespace.env.path_separator';//,isFile
	function getPathOnly(p) {
		// discard hash & search
		var i = p.lastIndexOf('?'), j = p.lastIndexOf('#');
		if (i === -1)
			i = j;
		else if (j !== -1 && i > j)
			i = j;
		if (i !== -1)
			p = p.slice(0, i);
		// 去除http://hostname/等
		if (p.slice(0, 8) === 'file:///')
			// 对file:///（应该是file:）特别处理！
			p = p.substr(8);
		else if ((i = p.indexOf(':' + library_namespace.env.path_separator
				+ library_namespace.env.path_separator)) !== -1
				&& (i = p.indexOf(library_namespace.env.path_separator, i + 3) !== -1))
			// http://hostname/path→path
			p = p.substr(i + 1);
		else if (p.charAt(0) === library_namespace.env.path_separator)
			// /usr/local/→usr/local/
			if (p.charAt(1) !== library_namespace.env.path_separator)
				p = p.substr(1);
			else if ((i = p.indexOf(library_namespace.env.path_separator, 2)) > 2)
				// 去除\\hostname\ 不去除：.replace(/[^\\]+$/,'')
				p = p.substr(i + 1);
			else if (i !== -1)
				// \\\zzzz的情形：不合法的路径
				throw new Error(1, 'illegal path:' + p);
		// !isWeb()&&~
		if (typeof isFile === 'function' && isFile(p))
			p = p.replace(new RegExp(
					library_namespace.env.path_separator_pattern + '[^'
							+ library_namespace.env.path_separator_pattern
							+ ']+$'), library_namespace.env.path_separator);
		return p;
	}

	var path_separator_candidates = [ '/', '\\' ], path_separator_candidates_length = path_separator_candidates.length,
	// path_separator_candidates_Regex
	// =new RegExp(path_separator_candidates.join(''), 'g'),
	path_separator_RegExp;

	_// JSDT:_module_
	.guess_path_separator = function(path) {
		if (typeof path !== 'string' || !path)
			return;

		var count = 0, candidate, i, m;

		if (!path_separator_RegExp)
			// 初始设定
			for (path_separator_RegExp = [], i = 0; i < path_separator_candidates_length; i++)
				path_separator_RegExp[i] = new RegExp('\\'
						+ path_separator_candidates[i], 'g');

		// 侦测最符合的
		for (i = 0; i < path_separator_candidates_length; i++) {
			m = path.match(path_separator_RegExp[i]);
			if (m && m.length > count)
				count = m.length, candidate = path_separator_candidates[i];
		}

		return candidate || library_namespace.env.path_separator;
	};

	_// JSDT:_module_
	.
	/**
	 * 取得 base_path 相对于 working_path 的路径。
	 * <p>
	 * 当前处于 working_path，欲取得 base_path 下所指到的 resource_file_path，可使用: <code>
	 * get_relative_path(base_path, working_path) + resource_file_path
	 * </code>
	 * </p>
	 * TODO: 找出最大连续相同路径。
	 * 
	 * @example <code>

	CeL.run('application.storage.file',function(){CeL.set_debug(2);CeL.log(CeL.get_relative_path('a/b/same/d/file','same/e/'));});

	CeL.set_debug(2);CeL.get_relative_path('a/b/same/d/f/file','e/r/t/same/e/',1);

	base_path = CeL.get_relative_path('kanashimi/www/cgi-bin/game/');

	//	想要保持 Protocol，但却是不同机器时。	<a href="http://nedbatchelder.com/blog/200710.html#e20071017T215538" accessdate="2011/8/28 0:18" title="Ned Batchelder: October 2007">Http-https transitions and relative URLs</a>
	CeL.get_relative_path('cgi-bin/game/photo/','//lyrics.meicho.com.tw/game/game.pl?seg=diary21',1);

	 * </code>
	 * 
	 * @param {String}
	 *            base_path 给定 base path 的范本结构, base_path_structure.
	 * @param {String}
	 *            working_path 当前处于 working_path.
	 * @param {Boolean}
	 *            get_full_path 借由 working_path 推测 base path 的 full path.
	 *            否则回传相对路径(relative path)，会增加 ../ 等。
	 * @returns {String} 推测的 base path 相对于 working_path 的 path.
	 * 
	 * @since 2003/10/1 15:57
	 * @since 2011/8/28 00:16:40
	 * @requres getPathOnly,library_namespace.env.path_separator,library_namespace.env.path_separator_pattern
	 * @_memberOf _module_
	 */
	get_relative_path = function(base_path, working_path, get_full_path) {

		library_namespace.debug('phase 1: 简化并审查 path<br />base_path ['
				+ base_path + ']<br />working_path [' + working_path + ']', 2,
				'get_relative_path');

		if (!working_path)
			working_path = library_namespace.get_script_base_path();
		else
			working_path = library_namespace.simplify_path(working_path);

		if (!working_path)
			return;

		if (!base_path)
			base_path = (library_namespace.is_WWW() ? location.href
					: typeof WshShell === 'object' ? WshShell.CurrentDirectory
							: typeof WScript === 'object' ? WScript.ScriptFullName
									// TODO: path_separator_candidates
									: '').replace(/[^\/\\]+$/, '');
		else
			base_path = library_namespace.simplify_path(base_path);

		if (!base_path
		// base_path 需要是绝对路径
		// || !is_absolute_path(base_path)
		)
			return working_path;

		library_namespace
				.debug(
						'phase 2: 将 path 分解成 Array，从尾至头比对，以 base_path 为基准，找寻 working_path 是否有相同的目录名。<br />base_path ['
								+ base_path
								+ ']<br />working_path ['
								+ working_path + ']', 2, 'get_relative_path');

		// 在 IE 或 HTA 中，path_separator === '\\' 但输入的 path 为 '/'；
		// 甚至于 working_path, base_path 两者可能不同。
		var path_separator =
		// library_namespace.env.path_separator
		_.guess_path_separator(working_path);

		working_path = working_path.split(path_separator);
		if (!working_path.at(-1))
			// 防止输入 a/b/c/ 而非 a/b/c 的情况。
			working_path.pop();
		base_path = base_path.split(_.guess_path_separator(base_path));
		// alert(working_path + '\n' + base_path);

		var file_name = base_path.pop();

		var index_base_path = base_path.length, index_working_path, working_path_length = working_path.length, directory, not_found = true;
		for (; index_base_path && not_found;)
			// 取得第 index_base_path 识别用目录名
			if (directory = base_path[--index_base_path]) {
				for (index_working_path = working_path_length; index_working_path;)
					if (directory === working_path[--index_working_path]) {
						not_found = false;
						// 第一个找到就 break 了。
						// TODO: 找出最大连续相同路径。
						break;
					}
			}

		library_namespace.debug('phase 3: '
				+ (not_found ? +'找不到' : '找到 index: base_path['
						+ index_base_path + '], working_path['
						+ index_working_path + ']'), 2, 'get_relative_path');
		if (not_found)
			library_namespace.debug("Can't find base directory of this file!\n"
					+ working_path + '\n\nTreat base directory as:\n'
					+ base_path, 2, 'get_relative_path'),
					directory = get_full_path ? working_path.concat(base_path)
							: base_path;
		else {
			if (get_full_path)
				directory = working_path.slice(0, index_working_path + 1);
			else {
				directory = [];
				for (var i = index_working_path + 1; i < working_path_length; i++)
					directory.push('..');
			}

			// directory.append(base_path, index_base_path + 1);
			directory = directory.concat(base_path.slice(index_base_path + 1));
		}

		directory.push(file_name);
		return directory.join(path_separator);
	};

	_// JSDT:_module_
	.
	/**
	 * cf: get_file_name(), parse_URL
	 * 
	 * @param {String}
	 *            path path name
	 * @return
	 * @_memberOf _module_
	 */
	parse_path = function(path) {
		if (typeof path !== 'string' || !path)
			return;

		var path_data = {
			input_data : path
		}, m;

		if (m = path.match(/^(([A-Za-z]):\\)?(([^\\]+\\)*)([^\\]*)?$/)) {
			path_data.is_absolute = !!(path_data.drive = m[2]);
			path_data.path_name = m[3];
			path_data.file_name = m[5];
			library_namespace.debug('type: Windows/MS-DOS file path', 2);
		} else if (m = path
				.match(/^file:\/\/\/([A-Za-z]):\/(([^\/]+\/)*)([^\/]*)?$/)) {
			path_data.is_absolute = true;
			path_data.drive = m[1];
			path_data.path_name = m[2];
			path_data.file_name = m[4];
			library_namespace.debug(
					'type: URL of Windows/MS-DOS local file path', 2);
		} else if (m = path.match(/^((\/)?([^\/]+\/)*)([^\/]*)?$/)) {
			path_data.is_absolute = !!m[2];
			path_data.path_name = m[1];
			path_data.file_name = m[4];
			library_namespace.debug('type: UNIX file path', 2);
		} else {
			library_namespace.debug('Failure to parse [' + path + ']');
		}

		// 正规化
		path_data.path_name = path_data.path_name.replace(/[\/\\]/g,
				library_namespace.env.path_separator);

		m = path_data.file_name.match(/^(.*?)(\.([^.]*))?$/);
		path_data.name = m[1];
		path_data.extension = m[3];

		path_data.path = path_data.path_name + path_data.file_name;
		path_data.location = path_data.drive + ':\\' + path_data.path;
		path_data.directory = path_data.drive + ':\\' + path_data.path_name;

		return path_data;
	};

	_// JSDT:_module_
	.
	/**
	 * Test if local path is absolute or relative path, not very good solution.
	 * TODO: test FULL path.
	 * 
	 * @param {String}
	 *            local path
	 * @return
	 * @requires library_namespace.env.path_separator,library_namespace.env.path_separator_pattern
	 * @_memberOf _module_
	 */
	is_absolute_path = function(path) {
		// alert(typeof path + '\n' + path);
		return /^(\/|[A-Z]+:([\\\/]|$)|\\\\[^\\])/i.test(path);

		return path
				&& (library_namespace.env.path_separator === '/'
						&& path.charAt(0) === library_namespace.env.path_separator || new RegExp(
						'^(\\\\|[A-Za-z]+:)'
								+ library_namespace.env.path_separator_pattern)
						.test(path))
		// ?true:false
		;
	};

	// 转成path（加'\'）
	function turnToPath(p) {
		return p ? p + (p.slice(-1) == '\\' ? '' : '\\') : '';
	}
	// 仅取得path部分(包括 library_namespace.env.path_separator)，不包括档名。
	// getFilePath[generateCode.dLK]='library_namespace.env.path_separator';
	function getFilePath(p) {
		var i = p.lastIndexOf(library_namespace.env.path_separator);
		if (i == -1)
			p += library_namespace.env.path_separator; // 相对路径?
		else if (i < p.length - 1)
			p = p.slice(0, i + 1); // 取得path部分
		return p;
	}

	// get_file_path[generateCode.dLK]='is_absolute_path,getPathOnly,get_relative_path';
	/**
	 * 传回包括档名之绝对/相对路径，假如是资料夹，也会回传资料夹路径。可包含'.','..'等 the return value include ? #
	 * of URI<br />
	 * 在Win/DOS下输入'\'..会加上base driver。<br />
	 * 若只要相对路径，可用 library_namespace.simplify_path()。取得如'..\out'的绝对路径可用
	 * get_file_path('../out',1)
	 * 
	 * @param {String}path
	 *            路径
	 * @param {Number}[mode]
	 *            0:传回auto(维持原状), 1:传回绝对路径, 2:传回相对路径。
	 * @param {String}[base_path]
	 *            base path
	 * 
	 * @returns
	 */
	function get_file_path(path, mode, base_path) {
		if (!path)
			return '';

		// old, deprecated:
		if (false)
			return (path.lastIndexOf('\\') === -1
					&& path.lastIndexOf('/') === -1 ?
			// get_file_object
			getFolder(getScriptFullName()) : '')
					+ path;

		var matched;
		if (path.charAt(0) === '\\'
				&& (matched = get_relative_path(base_path).match(
						/^(\\\\|[A-Z]:)/i)))
			path = matched[1] + path;

		path = library_namespace.simplify_path(path);
		if (mode === 1) {
			// 当为相对路径时前置 base path。
			if (!is_absolute_path(path))
				path = library_namespace
						.simplify_path((base_path ? getPathOnly(base_path)
								: get_relative_path())
								+ path);
		} else if (mode === 2 && is_absolute_path(path))
			path = get_relative_path(base_path, path, 1);

		return path;
	}

	_.get_file_path = get_file_path;

	// get_file_name[generateCode.dLK]='get_file_path,library_namespace.env.path_separator';
	/**
	 * 传回档名部分，the return value include ? # of URI<br />
	 * 
	 * @param {String}path
	 *            路径
	 * @param {String}[base_path]
	 *            base path
	 * @param {Number}[mode]
	 *            0:档名,1:(当输入为不可信赖的字串时)去除档名中不允许的字元，割掉? #等
	 * 
	 * @returns 档名部分
	 */
	function get_file_name(path, base_path, mode) {
		path = get_file_path(path, 0, base_path);

		// 比起(mode=path.lastIndexOf(library_namespace.env.path_separator))==-1?path:path.substr(mode+1);此法比较直接，不过感觉多一道手续…
		path = path
		// 不能用.substr(path.lastIndexOf(library_namespace.env.path_separator))+library_namespace.env.path_separator,因为path.lastIndexOf(library_namespace.env.path_separator)可能==-1
		.slice(path.lastIndexOf(library_namespace.env.path_separator) + 1);

		if (mode) {
			if (path.match(/[#?]/))
				path = path.substr(0, RegExp.lastIndex - 1);
			// 处理 illegal file name. 去除档名中不被允许的字元。cf.
			// application.net.to_file_name()
			// [ \.]
			path = path.replace(/[\\\/:*?"<>|]/g, '_');
		}
		return path;
	}

	_.get_file_name = get_file_name;

	// 传回档案/资料夹物件
	// FileSystemObjectのバグ(制限)で、环境によっては2G以上の领域を认识できません。WSH5.6ではこのバグが修正されています。
	// get_file_object[generateCode.dLK]='isFile,parse_shortcut,get_file_path,library_namespace.env.path_separator,getFolder,initialization_WScript_Objects';
	// path,mode=0:auto(维持原状),1:绝对路径,2:相对路径,base
	function get_file_object(p, m, bp) {
		// path
		try {
			return isFile(p = parse_shortcut(get_file_path(p, m, bp), 1)) ? fso
					.GetFile(p) : fso.GetFolder(p);
		} catch (e) {
			return p.indexOf(library_namespace.env.path_separator) === -1 ? get_file_object(
					getFolder(WScript.ScriptFullName) + p, m, bp)
					: null;
		}
	}
	// alert(get_file_path('\program files\\xxx\\xxx.exe',2));

	_// JSDT:_module_
	.
	/**
	 * 取得 file 之 file name extension(副档名).
	 * 
	 * @example <code>
	 * // get 'htm'.
	 * get_file_extension('test.htm');
	 * </code>
	 * @param {String}file_name
	 *            档案名称
	 * @returns {String} file name extension(副档名)
	 */
	get_file_extension = function(file_name) {
		var m = ('' + file_name).match(/\.([^.]*)$/);
		return m ? m[1] : '';
	};

	_// JSDT:_module_
	.
	/**
	 * 设定/更改 file 之 extension(副档名).
	 * 
	 * @example <code>
	 * // get 'test.html'.
	 * set_file_extension('test.htm','html');
	 * </code>
	 * @param {String}file_name
	 *            档案名称
	 * @param {String}change_to
	 *            更改成 change_to
	 * @returns {String} 更改 extension 后之 file name.
	 */
	set_file_extension = function(file_name, change_to) {
		if (change_to)
			file_name = ('' + file_name).replace(/\.[^.]*$/, '') + '.'
					+ change_to;
		return file_name;
	};

	// http://stackoverflow.com/questions/1547899/which-characters-make-a-url-invalid
	// URL_encoded('http://authority.ddbc.edu.tw/time/search.php?chk=nextLevel&julianSwitch=off&dpk=新罗')
	// === false;
	function URL_encoded(URL) {
		return /^(?:https?|ftp):\/\/(?:[a-zA-Z0-9\-._~\/?#\[\]@!$&'()*+,;=]|%[a-fA-Z0-9]{2})+$/
				.test(URL);
	}

	/**
	 * cache 相关函数:
	 * 
	 * @see application.storage.file.get_cache_file
	 *      application.OS.Windows.file.cacher
	 *      application.net.Ajax.get_URL_cache application.net.wiki
	 *      wiki_API.cache() CeL.wiki.cache()
	 */

	var get_file = library_namespace.get_file,
	// @see https://nodejs.org/api/fs.html
	write_file = library_namespace.platform.nodejs
			&& require('fs').writeFileSync;

	/**
	 * 档案 cache 作业操作之辅助套装函数。
	 * 
	 * @param {String|Object}URL
	 *            请求目的URL or options
	 * @param {Object}[options]
	 *            附加参数/设定特殊功能与选项
	 * 
	 * @returns cache data
	 */
	function cache_file(URL, options) {

		// 前置处理。
		if (!library_namespace.is_Object(options))
			options = Object.create(null);

		// 决定将 URL 存放至何处(存成哪个档案)。
		var file_path = options.file_name || get_file_name;
		if (typeof file_path === 'function')
			file_path = file_path(URL);

		if (options.base_path)
			file_path = options.base_path + file_path;

		if (!URL_encoded(URL))
			URL = encodeURI(URL);

		var file_encoding = options.file_encoding || options.encoding
				|| cache_file.encoding, data;

		if (!options.force) {
			try {
				// get cache file
				data = get_file(file_path, file_encoding);
				// data = read_file(file_name, encoding);
			} catch (e) {
				library_namespace.debug('尝试读取 cache file [' + file_path
						+ '] 失败。', 1, 'cache_file');
			}
		}

		if (data === undefined) {
			library_namespace.debug('重新取得 [' + URL + ']。', 1, 'cache_file');
			if ((data = get_file(URL, options.encoding))
			// 预防此时尚未 loaded.
			&& (write_file || (write_file = library_namespace.write_file))) {
				if (/\.s?html?$/i.test(file_path)) {
					// 插入网域识别标记之网页注解 MOTW (Mark of the Web)。
					// e.g., about:internet
					// http://msdn.microsoft.com/en-us/library/ms537628(v=vs.85).aspx
					var MOTW = String(URL.length), line_separator = data
							.match(/\r?\n/);
					MOTW = '<!-- saved from url=('
							+ '0000'.slice(MOTW.length)
							+ MOTW
							+ ')'
							+ URL
							+ ' -->'
							+ (line_separator ? line_separator[0]
									: library_namespace.env.line_separator);
					data = MOTW + data;
				}
				library_namespace.debug('write to [' + file_path + ']');
				write_file(file_path, data, file_encoding);
			}
		}

		if (/\.json$/i.test(file_path) && JSON.parse)
			data = JSON.parse(data);
		return data;
	}

	_.cache_file = cache_file;

	/** {String}预设 file encoding for fs of write_file。 */
	cache_file.encoding = library_namespace.platform.nodejs ? 'utf8' : 'UTF-8';

	// ---------------------------------------------------------------
	// 可以参考 CeL.application.net.MIME
	// https://github.com/sindresorhus/file-type/blob/master/index.js

	function to_magic_array(header) {
		return header.split('').map(function(char) {
			return char.charCodeAt(0).toString(16);
		}).join('');
	}

	function uint32_from_buffer(buffer, byteOffset) {
		// NG: (new Uint32Array(buffer, 4, 4))[0]
		byteOffset |= 0;
		return (((buffer[byteOffset + 3] * 256) + buffer[byteOffset + 2]) * 256 + buffer[byteOffset + 1])
				* 256 + buffer[byteOffset];
	}

	// Magic_number[type]={Object}data
	var Magic_number = {
		// text
		html : {
			// other file extensions
			extensions : [ 'htm', 'shtml' ],
			min_size : 52
		},
		pdf : {
			magic : to_magic_array('%PDF'),
			min_size : 800
		},

		// image
		gif : {
			// Header: GIF89a
			magic : to_magic_array('GIF89a'),
			// end of image data + GIF file terminator
			eof : '00 3B',
			min_size : 800
		},
		gif87a : {
			// Header: GIF87a
			magic : to_magic_array('GIF87a'),
			// end of image data + GIF file terminator
			eof : '00 3B',
			extensions : [ 'gif' ],
			extensions_without_type : true,
			min_size : 800
		},
		// PNG图像
		// https://www.w3.org/TR/PNG/#11IEND
		// https://en.wikipedia.org/wiki/PNG
		// https://en.wikipedia.org/wiki/APNG
		png : {
			// IHDR数据块: ‰PNG....
			magic : '89 50 4E 47 0D 0A 1A 0A',
			// http://blog.xuite.net/tzeng015/twblog/113272013-5.2.3+分析PNG图像文件结构（6）
			// IEND数据块: IEND®B`‚...
			eof : '00 00 00 00 49 45 4E 44 AE 42 60 82',
			min_size : 100
		},
		jpg : {
			// ÿØ
			magic : 'FF D8 FF',
			// http://stackoverflow.com/questions/4585527/detect-eof-for-jpg-images
			// check EOI, End Of Image mark of .jpeg: ÿÙ
			eof : 'FF D9',
			// other file extensions
			extensions : [ 'jpeg' ],
			min_size : 3e3
		},
		tif : {
			// II*.
			magic : '49 49 2A 00',
			// other file extensions
			extensions : [ 'tiff' ],
			min_size : 3e3
		},
		ico : {
			magic : '00 00 01 00',
			min_size : 50
		},

		// https://www.garykessler.net/library/file_sigs.html
		// archives
		zip : {
			// PK.. PKZIP压缩软体的发明者 Phil Katz，ZIP原名Deflate
			magic : '50 4B 03 04',
			min_size : 100
		},
		'7z' : {
			// 7z¼¯'.
			magic : '37 7A BC AF 27 1C',
			min_size : 100
		},
		rar : {
			// Rar!...
			magic : '52 61 72 21 1A 07 00',
			min_size : 100
		},
		rar5 : {
			// Rar!....
			magic : '52 61 72 21 1A 07 01 00',
			min_size : 100
		},

		// sound
		mp3 : {
			// 49 44 33 04 00
			magic : to_magic_array('ID3'),
			min_size : 100
		},

		// video
		mpg : {
			// 00 00 01 Bx
			magic : '00 00 01',
			eof : '00 00 01 B7',
			extensions : [ 'mpeg' ],
			min_size : 1e3
		},

		// RIFF types: 会自动判别RIFF标头，不用特别指定。
		wav : {
			min_size : 100,
			verify : function(file_contents) {
				// TODO: file_contents.slice(4, 8): File Size (little endian)

				return file_contents.slice(8, 15).toString() === 'WAVEfmt';
			}
		},
		avi : {
			min_size : 100,
			verify : function(file_contents) {
				// TODO: file_contents.slice(4, 8): File Size (little endian)

				return file_contents.slice(8, 16).toString() === 'AVI LIST';
			}
		},
		webp : {
			min_size : 100,
			// https://developers.google.com/speed/webp/docs/riff_container#webp_file_header
			// https://en.wikipedia.org/wiki/WebP
			verify : function(file_contents) {
				// TODO: file_contents.slice(4, 8): File Size (little endian)

				// "WEBPVP8 " for lossy images,
				// "WEBPVP8L" for lossless images.
				return file_contents.slice(8, 15).toString() === 'WEBPVP8';
			}
		}
	},
	// Magic_number_data[byte count]=[{Natural}Magic_number:{Object}data]
	Magic_number_data = [], MAX_magic_byte_count = Math
			.log2(Number.MAX_SAFE_INTEGER) / 8 | 0;

	Object.entries(Magic_number).forEach(function(type) {
		var magic_data = type[1];
		if (typeof magic_data === 'string') {
			// e.g., jpg:'FF D8 FF'
			magic_data = {
				magic : magic_data
			};
		}
		// 档案格式。
		magic_data.type = type = type[0];
		// 副档名。
		// TODO: 大小写。
		if (magic_data.extensions) {
			if (!Array.isArray(magic_data.extensions)) {
				magic_data.extensions = [ magic_data.extensions ];
			}
			if (!magic_data.extensions_without_type
			//
			&& !magic_data.extensions.includes(type)) {
				// 以 type name 为主
				magic_data.extensions.unshift(type);
			}
		} else {
			magic_data.extensions = [ type ];
		}

		if (!magic_data.magic) {
			// 不采用 Magic number 测试
			return;
		}

		magic_data.magic = magic_data.magic.replace(/[ ,]+/g, '');
		var magic_byte_count = magic_data.magic_byte_count
		//
		= magic_data.magic.length / 2 | 0, magic;
		if (magic_byte_count > MAX_magic_byte_count) {
			magic_byte_count = MAX_magic_byte_count;
			magic = magic_data.magic.slice(0, magic_byte_count * 2);
		} else {
			magic = magic_data.magic;
		}
		if (!Magic_number_data[magic_byte_count]) {
			Magic_number_data[magic_byte_count] = [];
		}
		Magic_number_data[magic_byte_count][parseInt(magic, 0x10)]
		//
		= magic_data;
		if (magic_data.eof) {
			magic_data.eof = magic_data.eof.replace(/[ ,]+/g, '');
			magic_data.reversed_eof_bytes
			//
			= magic_data.eof.chunk(2).map(function(hex) {
				return parseInt(hex, 0x10);
			}).reverse();
			if (false) {
				console.log(magic_data.type + ': eof: ' + magic_data.eof);
				console.log(magic_data.reversed_eof_bytes);
			}
		}
	});

	/**
	 * detect / 验证档案格式。
	 * 
	 * @param {Buffer}file_contents
	 *            file contents
	 * @param {Object|String}options
	 *            附加参数/设定选择性/特殊功能与选项
	 * 
	 * @returns
	 * 
	 * @since 2017/4/10
	 */
	function verify_file_type(file_contents, options) {
		if (typeof options === 'string') {
			options = {
				type : options
			};
		} else {
			// 前置作业。
			options = library_namespace.setup_options(options);
		}

		var magic_data, damaged;
		// console.log(Magic_number_data);
		for (var i = 0, magic_number = 0; i < Math.min(
				Magic_number_data.length, MAX_magic_byte_count);) {
			magic_number = magic_number * 0x100 + file_contents[i];
			// console.log(magic_number);
			if (Magic_number_data[++i]
					&& (magic_data = Magic_number_data[i][magic_number])) {
				break;
			}
		}

		if (!magic_data && file_contents.slice(0, 4).toString() === 'RIFF') {
			// https://en.wikipedia.org/wiki/Resource_Interchange_File_Format
			// https://en.wikipedia.org/wiki/WebP
			var RIFF_type = file_contents.slice(8, 12).toString(),
			// an unsigned, little-endian 32-bit integer with the length of
			// this chunk (except this field itself and the chunk
			// identifier).
			chunk_size = uint32_from_buffer(file_contents, 4);
			library_namespace.debug('verify_file_type: RIFF type: ' + RIFF_type
					+ ', ' + chunk_size + ' bytes, stream length: '
					+ file_contents.length);
			// console.log(file_contents.slice(0, 24));
			magic_data = Magic_number[RIFF_type.toLowerCase()];
			if (file_contents.length - chunk_size !== 8) {
				// file damaged
				damaged = true;
			} else if (magic_data && (typeof magic_data.verify === 'function')) {
				damaged = !magic_data.verify(file_contents);
			}
		}

		if (!magic_data) {
			var contents_String = file_contents.toString();
			// e.g., "<!DOCTYPE html>", "<!DOCTYPE html PUBLIC "...
			if (contents_String.trimStart().startsWith('<!DOCTYPE html')
			// TODO: 此处为太过简陋的测试
			|| /<html[ a-z\d-="']*>/i.test(contents_String)) {
				magic_data = Magic_number.html;
			}
		}

		if (!magic_data) {
			// 无法判别。
			if (options.type in Magic_number) {
				return {
					verified : false
				};
			}
			return {};
		}

		var result = {
			type : magic_data.type,
			// 副档名。
			extension : magic_data.extensions[0],
			extensions : magic_data.extensions
		};

		if (magic_data.min_size > 0) {
			result.too_small = file_contents.length < magic_data.min_size;
		}

		if (damaged) {
			// file damaged
			result.damaged = true;

		} else if (magic_data.reversed_eof_bytes) {
			// verify 档案损毁
			var file_index = file_contents.length;
			if (magic_data.reversed_eof_bytes.some(function(byte, index) {
				if (false) {
					console.log('magic: ' + byte + ' vs. '
							+ file_contents[file_index - 1]);
				}
				return byte !== file_contents[--file_index];
			})) {
				// file damaged
				result.damaged = true;
			}
		}

		if (options.type) {
			// TODO: check 副档名
			result.verified = options.type === result.type;
		}

		return result;
	}

	_.file_type = verify_file_type;

	// ---------------------------------------------------------------

	return (_// JSDT:_module_
	);
}
