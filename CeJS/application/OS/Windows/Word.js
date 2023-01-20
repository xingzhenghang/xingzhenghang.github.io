/**
 * @name CeL function for Word
 * @fileoverview 本档案包含了 Word 专用的 functions。
 * 
 * @since
 */

'use strict';
// 'use asm';

// --------------------------------------------------------------------------------------------

// 不采用 if 陈述式，可以避免 Eclipse JSDoc 与 format 多缩排一层。
typeof CeL === 'function' && CeL.run({
	// module name
	name : 'application.OS.Windows.Word',

	require : 'data.code.compatibility.|data.native.'
	// CeL.write_file()
	+ '|application.storage.',

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

	// save to .xml file → .docx file
	// 必须先安装 Word。
	// 存成 doc 档案依然可以开启，但不能以右键选单列印。
	function xml_save_to_doc(Word_file_path, xml, options) {
		if (options === true) {
			options = {
				// preserve xml file
				preserve : options
			};
		} else
			options = library_namespace.setup_options(options);

		if (!Word_file_path.includes('.')) {
			Word_file_path += '.docx';
		}

		// default: save to "%HOMEPATH%\Documents"
		if (!Word_file_path.includes(':\\') && !/^[\\\/]/.test(Word_file_path))
			Word_file_path = library_namespace.working_directory()
					+ Word_file_path;

		var xml_file_path = Word_file_path.replace(/[^.]*$/, 'xml');

		library_namespace.write_file(xml_file_path, xml);
		if (!require('fs').existsSync(xml_file_path)) {
			library_namespace.error('无法写入 source xml 档案！ ' + xml_file_path);
			return;
		}

		// CScript.exe: Microsoft ® Console Based Script Host
		// WScript.exe: Microsoft ® Windows Based Script Host
		// WScript.exe 会直接跳出，因此必须使用 CScript.exe。
		var command = 'CScript.exe //Nologo //B "'
				+ library_namespace.get_module_path(module_name,
						'xml_to_Word.js') + '" "' + xml_file_path + '" "'
				+ Word_file_path + '"';

		library_namespace.debug('Execute command: ' + command, 1,
				'xml_save_to_doc', 3);
		library_namespace.debug('xml_save_to_doc: convert ' + xml_file_path
				+ ' → ' + Word_file_path);
		// console.log(command);
		// console.log(JSON.stringify(command));
		execSync(command);

		if (!options.preserve) {
			library_namespace.remove_file(xml_file_path);
		}
	}

	_.xml_save_to_doc = xml_save_to_doc;

	return (_// JSDT:_module_
	);
}
