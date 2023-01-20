/**
 * @name CeL function for Excel
 * @fileoverview 本档案包含了 Excel 专用的 functions。
 * 
 * @since
 */

'use strict';
// 'use asm';

// --------------------------------------------------------------------------------------------

// 不采用 if 陈述式，可以避免 Eclipse JSDoc 与 format 多缩排一层。
typeof CeL === 'function' && CeL.run({
	// module name
	name : 'application.OS.Windows.Excel',

	require : 'data.code.compatibility.|data.native.'
	// library_namespace.parse_CSV()
	+ '|data.CSV.|application.storage.',

	// 设定不汇出的子函式。
	// no_extend : '*',

	// 为了方便格式化程式码，因此将 module 函式主体另外抽出。
	code : module_code
});

function module_code(library_namespace) {

	var module_name = this.id;

	/**
	 * null module constructor
	 * 
	 * @class Node.js 的 functions
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

	// const: node.js only
	var execSync = require('child_process').execSync;

	// read .XLSX file → {Array}data list
	// 转成 tsv 再做处理用的 wrapper 函数。
	// 必须先安装 Excel
	function read_Excel_file(Excel_file_path, options) {
		if (typeof options === 'string') {
			options = {
				sheet_name : options
			};
		} else
			options = library_namespace.setup_options(options);

		// default: save to "%HOMEPATH%\Documents"
		if (!Excel_file_path.includes(':\\')
				&& !/^[\\\/]/.test(Excel_file_path))
			Excel_file_path = library_namespace.working_directory()
					+ Excel_file_path;

		var sheet_name = options.sheet_name, text_file_path = options.save_to
				|| Excel_file_path.replace(/(?:\.[^.]+)?$/, (sheet_name ? '#'
						+ sheet_name : '')
						+ '.tsv');

		if (!text_file_path.includes(':\\') && !/^[\\\/]/.test(text_file_path))
			text_file_path = library_namespace.working_directory()
					+ text_file_path;

		// 先将 Microsoft Office spreadsheets (Excel .XLSX 档)汇出成 Unicode 文字档。
		// CScript.exe: Microsoft ® Console Based Script Host
		// WScript.exe: Microsoft ® Windows Based Script Host
		// WScript.exe 会直接跳出，因此必须使用 CScript.exe。
		var command = 'CScript.exe //Nologo //B "'
				+ library_namespace.get_module_path(module_name,
						'Excel_to_text.js') + '" "' + Excel_file_path + '" "'
				+ (sheet_name || '') + '" "' + text_file_path + '"';

		// check if updated: 若是没有更新过，那么用旧的文字档案就可以。
		var target_file_status = library_namespace.fso_status(text_file_path);
		if (target_file_status) {
			var soutce_file_status = library_namespace
					.fso_status(Excel_file_path);
			if (Date.parse(target_file_status.mtime)
					- Date.parse(soutce_file_status.mtime) > 0)
				command = null;
		}

		if (command) {
			if (!require('fs').existsSync(Excel_file_path)) {
				library_namespace.error('Excel 档案不存在！ ' + Excel_file_path);
				return;
			}

			library_namespace.debug('Execute command: ' + command, 1,
					'read_Excel_file');
			// console.log(command);
			// console.log(JSON.stringify(command));
			execSync(command);
		} else {
			library_namespace.debug('Using cache file: ' + text_file_path, 1,
					'read_Excel_file');
		}

		// console.log(text_file_path);
		// 'auto': Excel 将活页簿储存成 "Unicode 文字"时的正常编码为 UTF-16LE
		var content = library_namespace.read_file(text_file_path, 'auto');
		// console.log(content);
		if (!content) {
			library_namespace.error('没有内容。请检查工作表是否存在！');
			return;
		}

		if (typeof options.content_processor === 'function') {
			content = options.content_processor(content);
		}

		// content = '' + content;
		var remove_title_row = options.remove_title_row;
		if (remove_title_row === undefined) {
			// auto detect title line
			var matched = content.trim().match(/^([^\n]*)\n([^\n]*)/);
			if (matched && !matched[1].trim().includes('\t')
			// 第一行单纯只有一个标题 cell。
			&& matched[2].trim().includes('\t')) {
				remove_title_row = true;
			}
		}
		if (remove_title_row) {
			content = content.replace(/^([^\n]*)\n/,
			//
			function(line, table_title) {
				remove_title_row = table_title;
				return '';
			});
		}

		var table = library_namespace.parse_CSV(content, Object.assign({
			has_title : true,
			field_delimiter : '\t'
		}, options));

		if (remove_title_row) {
			library_namespace.debug('remove title line: ' + remove_title_row,
					1, 'read_Excel_file');
			table.table_title = remove_title_row;
		}

		return table;
	}

	_.read_Excel_file = read_Excel_file;

	function write_Excel_file(file_path, content, options) {
		library_namespace.write_file(file_path, library_namespace
				.to_CSV_String(content, Object.assign({
					field_delimiter : '\t',
					line_separator : '\r\n'
				}, options)));
	}

	_.write_Excel_file = write_Excel_file;

	return (_// JSDT:_module_
	);
}
