/*

 先以generate_original_map();生成original_map.txt
 以各种编码转换original_map.txt

 encoding.map.json规格书:包含map:
 @see CeL.data.character
 @since 2017/1/11 16:15:36
 */

/*

 // [[zh:大五码]]
 node generate_code_map.js
 node generate_code_map.js Big5.txt

 // [[zh:国家标准代码]]
 node generate_code_map.js GBK.txt

 // [[ja:EUC-JP]], [[ja:EUC-JIS-2004]]
 // 0x8Fに続く2バイト文字1文字分 (0xA1から0xFEまでの2バイト) は、JIS X 0213の第2面の文字である。
 node generate_code_map.js 8F
 node generate_code_map.js EUC-JP.txt EUC-JP.8F.txt

 // [[ja:Shift_JIS]]
 node generate_code_map.js Shift_JIS.txt

 */

'use strict';

// Load CeJS library and modules.
require('../../_for include/node.loader.js');
CeL.run([
// Add color to console messages. 添加主控端报告的颜色。
'interact.console',
// for string.chars()
'data.native' ]);

var BYTE_BASE = 0x100, original_map_file = 'original_map.txt',
//
default_config = {
	// 双位元组字元集 高位字节 1バイト目: 一般从0x80起。
	start_char_code_1 : 0x80 - 2,
	// 双位元组字元集 低位字节 2バイト目: 起始必须跳过 new_line, padding_character。
	start_char_code_2 : 0x20,
	// assert: new_line map to new_line, 不可使用 '\r'
	new_line : '\n',
	// 这应该是个转换前后不会变化，且不会被纳入其他字元组中的字元。
	padding_character : '\t',
	end_char_code : BYTE_BASE - 1
},

general_encoding = 'utf8',

/** node.js file system module */
node_fs = require('fs'),
/** {String}REPLACEMENT CHARACTER U+FFFD */
UNKNOWN_CHARACTER = '�',
/** {Natural}base of 16 bit */
HEX_BASE = 0x10;

console.assert(default_config.padding_character.length === 1);
console.assert(default_config.padding_character === '\t'
		|| 0x20 <= default_config.padding_character.charCodeAt(0)
		&& default_config.padding_character.charCodeAt(0) < 0x40
		&& default_config.padding_character !== '?'
		&& default_config.padding_character !== ' ');

// 效能测试。
// array_vs_charAt();

(function main() {
	var file_list = process.argv[2];
	if (!file_list || /^[\dA-F]{0,2}$/i.test(file_list)) {
		generate_original_map(file_list);
		return;
	}

	file_list = [ file_list ];
	for (var index = 3; index < process.argv.length; index++) {
		if (process.argv[index])
			file_list.push(process.argv[index]);
	}
	parse_converted_file(file_list);
})();

// --------------------------------------------------------------------------------------

function generate_original_map(high_byte_hex) {
	var file_descriptor, char_buffer = Object.clone(default_config), new_line_Buffer = Buffer
			.from(default_config.new_line);
	if (high_byte_hex) {
		high_byte_hex = high_byte_hex.toUpperCase();
		char_buffer.high_byte_hex = high_byte_hex;
		file_descriptor = original_map_file.replace(/(\.[^.]+)$/, '.'
				+ high_byte_hex + '$1');
	} else {
		file_descriptor = original_map_file;
	}
	file_descriptor = node_fs.openSync(file_descriptor, 'w');

	// 写入设定。将如padding_character,start_char_code_2之类的设定储存在original_map_file中。
	char_buffer = JSON.stringify(char_buffer) + default_config.new_line
			+ '-'.repeat(80) + default_config.new_line;
	node_fs.writeSync(file_descriptor, Buffer.from(char_buffer));

	// 添加" "是为了预防有4bytes的字元组。若有6bytes,8bytes的字元组则须再加。
	// 最后的 +1 是为了确保能
	// .split(new RegExp('\\' + config.padding_character + '+'))
	char_buffer = Buffer.from(default_config.padding_character.repeat(4 + 1));
	if (high_byte_hex) {
		char_buffer[0] = parseInt(high_byte_hex, HEX_BASE);
		high_byte_hex = 1;
	} else {
		high_byte_hex = 0;
	}

	for (var char_code_1 = default_config.start_char_code_1; char_code_1 <= default_config.end_char_code; char_code_1++) {
		node_fs.writeSync(file_descriptor, Buffer.from(to_hex(char_code_1)
				+ ':'));
		char_buffer[high_byte_hex] = char_code_1;
		for (var char_code_2 = default_config.start_char_code_2; char_code_2 <= default_config.end_char_code; char_code_2++) {
			char_buffer[high_byte_hex + 1] = char_code_2;
			node_fs.writeSync(file_descriptor, char_buffer);
		}
		node_fs.writeSync(file_descriptor, new_line_Buffer);
	}
	node_fs.closeSync(file_descriptor);
}

// --------------------------------------------------------------------------------------

/**
 * 效能测试。
 * 
 * @see http://jsperf.com/charat-vs-array/7
 *      http://stackoverflow.com/questions/5943726/string-charatx-or-stringx
 *      https://www.sitepoint.com/javascript-fast-string-concatenation/
 */
function array_vs_charAt() {
	var array = [];
	for (var i = 0; i < 0x80 * 0x80; i++) {
		array.push(String.fromCharCode(13000 + 42000 * Math.random() | 0));
	}
	var string = array.join(''), length = array.length, result, text_length = 1e7;
	console.assert(length === string.length);

	result = [];
	console.time('array→array');
	for (var i = 0; i < text_length; i++) {
		result.push(array[length * Math.random() | 0]);
	}
	result = result.join('');
	console.log(result.slice(0, 20));
	console.timeEnd('array→array');

	result = [];
	console.time('string→array');
	for (var i = 0; i < text_length; i++) {
		result.push(string.charAt(length * Math.random() | 0));
	}
	result = result.join('');
	console.log(result.slice(0, 20));
	console.timeEnd('string→array');

	result = '';
	console.time('array→string');
	for (var i = 0; i < text_length; i++) {
		result += array[length * Math.random() | 0];
	}
	console.log(result.slice(0, 20));
	console.timeEnd('array→string');

	result = '';
	console.time('string→string');
	for (var i = 0; i < text_length; i++) {
		result += string.charAt(length * Math.random() | 0);
	}
	console.log(result.slice(0, 20));
	console.timeEnd('string→string');

	// node.js 7.4.0 一般测试最快的是 'array→string'
}

function to_hex(char) {
	if (typeof char === 'string') {
		return char.chars().map(function(c) {
			return to_hex(c.codePointAt(0));
		});
	}
	// assert: {Natural}char code
	return char.toString(HEX_BASE).toUpperCase();
}

// --------------------------------------------------------------------------------------

function parse_converted_file(file_path_list) {
	var convert_map = Object.create(null),
	// 分bytes
	total_char_length = new Array(4).fill(0);

	if (!Array.isArray(file_path_list)) {
		file_path_list = [ file_path_list ];
	}

	file_path_list.forEach(function(file_path) {
		var code_lines = node_fs.readFileSync(file_path, general_encoding)
		// remove BOM
		.trimStart().split(default_config.new_line),
		//
		line = code_lines.at(-1),
		//
		config = Object.clone(default_config);
		if (line.replace(/\r$/, '') === '') {
			code_lines.pop();
		}
		// 取得设定。
		if (code_lines[0].startsWith('{')) {
			Object.assign(config, JSON.parse(code_lines.shift()));
		}
		// 去掉注解与分隔线。
		while (code_lines.length > 0 && (!code_lines[0]
		//
		|| code_lines[0].startsWith('#') || /^[-=\s]*$/.test(code_lines[0]))) {
			code_lines.shift();
		}
		if (code_lines.length === 0) {
			CeL.error(file_path + ': Nothing get.');
			return;
		}

		if (code_lines.length ===
		//
		config.end_char_code - config.start_char_code_1 + 1) {
			CeL.log(file_path + ': ' + code_lines.length + ' lines');
		} else {
			CeL.warn(file_path + ': ' + code_lines.length
					+ ' lines (should be '
					+ (config.end_char_code - config.start_char_code_1 + 1)
					+ ')');
		}

		parse_converted_data(code_lines, convert_map, config);
	});

	var map_keys = Object.keys(convert_map).sort(), result_data,
	// 开始有mapping的高位元code
	first_high_byte = parseInt(map_keys[0].slice(0, 2), HEX_BASE);
	if (map_keys[0].length === 2) {
		result_data = convert_map[map_keys[0]];
		var char_length = typeof result_data === 'string' ? result_data
				.chars(true).length - 1 : result_data.char_length;
		first_high_byte += char_length;
		map_keys.shift();
	}

	if (general_encoding !== 'utf8'
	// 处理和 7-bit ASCII 保持一致，一般固定不会被转换编码的部分。
	|| first_high_byte === 0) {
		result_data = [];
	} else {
		// normal convert, start from \u0000
		result_data = '"\\0"';
		if (first_high_byte > 1) {
			result_data = '[' + result_data + ',' + (first_high_byte - 1) + ']';
		} else if (first_high_byte !== 1) {
			throw 'Invalid byte: ' + Object.keys(convert_map).sort()[0];
		}
		// 自\0起算，共first_high_byte个单位元字元。
		total_char_length[1] = first_high_byte;
		// 可以直接用{1:2}，不必用{_1:2}。
		result_data = [ '0:' + result_data ];
	}

	// result_data = JSON.stringify(convert_map);
	map_keys.forEach(function(key) {
		var line = convert_map[key];
		total_char_length[Math.ceil(key.length / 2)] += line.char_length
				|| line.length;
		// 可以直接用{1:2}，不必用{_1:2}。但不允许数字开头，中间混杂英文字母。
		line = (/^\d/.test(key) && /[A-F]/i.test(key) ? '_' + key : key) + ':'
				+ JSON.stringify(line);
		result_data.push(line);
	});
	// 自动生成资源档
	result_data = '// Auto generated by ' + CeL.get_script_name()
			+ '\ntypeof CeL==="function"&&CeL.character.add_map('
			+ JSON.stringify(file_path_list[0].match(/^[^.]+/)[0]) + ',{\n'
			+ result_data.join(',\n') + '\n})';

	var main_file_path = file_path_list[0].replace(/\..+/g, '.js');
	// assert: total_char_length[0]===0
	total_char_length.shift();
	while (total_char_length.at(-1) === 0) {
		total_char_length.pop();
	}
	CeL.log(main_file_path + ': ' + total_char_length.join('+') + ' = '
			+ total_char_length.sum() + ' characters');
	node_fs.writeFileSync(main_file_path, result_data);
}

function parse_converted_data(code_lines, convert_map, config) {
	var last_map_key, last_key, last_convert_to,
	//
	last_char_code = config.start_char_code_1 - 1,
	//
	last_char_count = config.end_char_code - config.start_char_code_2 + 1;

	function add_map(hex_key, convert_to, single) {
		if (last_map_key) {
			if (hex_key
					&& !single
					&& (last_map_key.length === hex_key.length
							// 检测last_key的下一个是否为hex_key
							&& (parseInt(hex_key, HEX_BASE)
									- parseInt(last_key, HEX_BASE) === 1)
					// hex_key为首个byte。
					|| hex_key.charCodeAt(0) % BYTE_BASE === parseInt(
							last_map_key.slice(-2), HEX_BASE))) {
				last_convert_to.push(convert_to);
				last_key = hex_key;
				return;
			}

			// map_key未接续。先登记last_map_key。
			if (last_map_key) {
				// 做点简易压缩。
				var buffer = '', lastest_char_code, _last_convert_to = [ '' ];
				function add_slice() {
					if (buffer.length === 0) {
						return;
					}
					// 结算连续的区段。
					// 3:要采用["char",count]的方法，应该要够长才有效益。
					if (buffer.length > 3) {
						_last_convert_to.push(buffer.length);
					} else {
						_last_convert_to
						//
						[_last_convert_to.length - 1] += buffer;
					}
					buffer = '';
				}
				last_convert_to.forEach(function(character) {
					if (character.length === 1 && character.charCodeAt(0)
					//
					=== lastest_char_code + buffer.length + 1) {
						buffer += character;
					} else {
						// character与之前的没有连续。
						add_slice();
						if (typeof _last_convert_to.at(-1) === 'string') {
							_last_convert_to
							//
							[_last_convert_to.length - 1] += character;
						} else {
							_last_convert_to.push(character);
						}
						// console.log([ buffer, character, lastest_char_code
						// ]);
						lastest_char_code = character.charCodeAt(0);
					}
				});
				add_slice();
				if (last_convert_to.length > _last_convert_to.length) {
					_last_convert_to.char_length = last_convert_to.length;
					last_convert_to = _last_convert_to.length === 1 ? _last_convert_to[0]
							: _last_convert_to;
				} else {
					last_convert_to = last_convert_to.join('');
				}

				if (config.high_byte_hex) {
					last_map_key = config.high_byte_hex + last_map_key;
				}
				if (last_map_key in convert_map) {
					CeL.warn('Duplicate byte ' + last_map_key + ': '
					//
					+ convert_map[last_map_key] + '→' + last_convert_to);
				}
				convert_map[last_map_key] = last_convert_to;
			}
			if (single) {
				convert_map[hex_key] = [ convert_to, 0 ];
				last_map_key = null;
				return;
			}
		}

		last_map_key = last_key = hex_key;
		last_convert_to = [ convert_to ];
	}

	// ---------------------------------

	code_lines.forEach(function(line) {
		var matched = line.replace(/\r$/, '')
		//
		.match(/^([\dA-F]{2}):([\s\S]+)$/);
		if (!matched) {
			// comments?
			// console.log(line);
			return;
		}
		/** {Integer}双字元(2バイト符号化文字集合)首位元/多位元组除high_byte_hex之外的第一位元 */
		var char_code_1 = parseInt(matched[1], HEX_BASE);
		if (char_code_1 !== last_char_code + 1) {
			CeL.log(last_char_code + '→' + char_code_1);
		}
		last_char_code = char_code_1;
		// CeL.log(new RegExp('\\' + config.padding_character + '+'));
		/** {String}[HEX]双字元(2バイト符号化文字集合)首位元/多位元组除high_byte_hex之外的第一位元 */
		var hex_char_1 = matched[1],
		//
		char_list = matched[2].split(new RegExp('\\' + config.padding_character
				+ '+')),
		//
		char_tmp = char_list.pop();
		if (char_tmp) {
			// separator
			CeL.error(hex_char_1 + ': 应以分隔符号结尾，但去掉最后一个时非空: '
					+ JSON.stringify(char_tmp));
		}
		if (last_char_count !== char_list.length) {
			CeL.log(hex_char_1 + ': ' + last_char_count + '→'
					+ char_list.length + ' chars');
			last_char_count = char_list.length;
		}

		if (!config.high_byte_hex
		// 检测此排是否皆相同。对high_byte_hex，此检测之结果应该在更简单之时已设定过，因此跳过此项。
		&& (char_tmp = char_list[0].chars(true)[0]) !== UNKNOWN_CHARACTER
		//
		&& char_list.every(function(character, index) {
			return char_tmp === character.chars(true)[0];
		})) {
			if (hex_char_1 === 'A0'
			// \u0020
			&& char_tmp === ' ') {
				// 对应不换行空格 non-breaking space。e.g., EUC-JP
				char_tmp = '\u00A0';
			}
			if (hex_char_1 === to_hex(char_tmp)[0]) {
				// 转换到相同字元了。因为采白名单表列，因此仍须登记。
				add_map(hex_char_1, char_tmp);
				return;
			}
			if (char_tmp.codePointAt(0) !== char_code_1) {
				CeL.log('特殊单字元转换: [' + hex_char_1 + '] → [' + char_tmp + '] ('
						+ to_hex(char_tmp) + ')');
			}
			add_map(hex_char_1, char_tmp);
			return;
		}

		char_list.forEach(function(character, index) {
			if (character.startsWith(UNKNOWN_CHARACTER)) {
				// 不能转换此character。
				return;
			}
			// 因为有[[en:Surrogate mechanism]],
			// [[en:Combining character#Unicode
			// ranges]]，不可用(character.length!==1)
			if (character.chars(true).length !== 1) {
				// assert: (character.codePointAt(0) !== char_code_1)

				if (hex_char_1 === 'A0'
				// \u0020
				&& character.charAt(0) === ' ') {
					// 对应不换行空格 non-breaking space。e.g., GBK
				}

				CeL.warn(hex_char_1 + to_hex(index + config.start_char_code_2)
				//
				+ '[' + index + ']: ' + JSON.stringify(character)
				// + ' ' + character.length + ' (' + to_hex(character) + ')'
				+ ' (' + to_hex(character) + ') will be skipped.');
				return;
			}
			// 转换至双字元/多字元:
			add_map(hex_char_1
			//
			+ to_hex(index + config.start_char_code_2), character);
		});
	});

	// 登记last_map_key。
	add_map();
}
