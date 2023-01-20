/**
 * @name CeL data.Convert_Pairs function
 * @fileoverview 本档案包含了 data.Convert_Pairs 处理的 functions。
 * 
 * TODO: Should use Map()
 * 
 * @since 2022/2/10 8:43:7
 */

'use strict';
// 'use asm';

// --------------------------------------------------------------------------------------------

typeof CeL === 'function' && CeL.run({
	// module name
	name : 'data.Convert_Pairs',

	require : 'data.|data.code.compatibility.|data.native.',

	// 设定不汇出的子函式。
	no_extend : '*',

	// 为了方便格式化程式码，因此将 module 函式主体另外抽出。
	code : module_code
});

function module_code(library_namespace) {

	// requiring

	// ---------------------------------------------------------------------//
	// see data.native.String_to_RegExp
	/**
	 * 主要目的：解析文字 source 成 Object，以及用来作 convert。
	 * 
	 * TODO:<br />
	 * 整合 application.OS.Windows.file.cacher
	 * 
	 * @example <code>

	 // example 1
	 var conversion_pair = new CeL.data.Convert_Pairs(CeL.get_file(path));
	 text = conversion_pair.convert(text);


	 // example 2
	 CeL.run([ 'data.file', 'application.OS.Windows.file' ]);
	 var cache_file = 'work.codes/get_work_information.cache.txt', cache_pair,
	 // target encoding
	 target_encoding = 'UTF-8';

	 cache_pair = new CeL.data.Convert_Pairs(null, {
		path : cache_file,
		encoding : target_encoding,
		remove_comments : true
	 });

	 cache_pair.add([ [ 'key 1', 'value 1' ] ]);

	 CeL.log(cache_pair.select('key 1'));

	 cache_pair.save_new();

	 * </code>
	 * 
	 * @param {Object|Array}source
	 * @param {Object}options
	 */
	function Convert_Pairs(source, options) {
		if (!is_Convert_Pairs(this)) {
			library_namespace
					.warn('Convert_Pairs: Please use (pair = new Convert_Pairs()) instead of (pair = Convert_Pairs())!');
			return new Convert_Pairs(source, options);
		}

		// 前置处理。
		options = library_namespace.setup_options(options);

		var _this = this;
		function copy_properties_from_options() {
			// 单一 instance 仅能设定一个 replace_flags。
			// Convert_Pairs.prototype.add() 不设定 this.flags。
			[ 'flags', 'may_remove_pair_Map' ].forEach(function(property) {
				if (options[property]) {
					_this[property] = options[property];
				}
			});
		}

		if (is_Convert_Pairs(source)) {
			// is_clone
			// library_namespace.is_Object(source) @ Firefox
			// assert: library_namespace.is_Object(source.pair);
			// assert: Array.isArray(source.keys);
			Object.assign(this, source);
			this.pair_Map = new Map(source.pair_Map);
			copy_properties_from_options();
		} else {
			copy_properties_from_options();
			// Warning: 手动设定 this.pair_Map 非常危险!
			// initialization.
			this.pair_Map = new Map;
			if (source)
				this.add(source, options);
		}

		if (options.path) {
			this.add_path(options);
		}
	}

	// if the value is instance of Convert_Pairs
	function is_Convert_Pairs(value) {
		return value && value.constructor === Convert_Pairs;
	}

	/**
	 * 排除/移除注解。 strip/remove javascript comments.
	 * CeL.data.Convert_Pairs.remove_comments(text)
	 * 
	 * @see http://vrana.github.io/JsShrink/
	 * @see http://trinithis.awardspace.com/commentStripper/stripper.html
	 * @see http://upshots.org/javascript/javascript-regexp-to-remove-comments
	 * @see http://marijnhaverbeke.nl//uglifyjs
	 */
	function remove_comments(text) {
		// 仅作最简单之处理，未考量: "// .. /*", "// .. */", "// /* .. */",
		// 以及 RegExp, "", '' 中注解的情况!
		return String(text)
		// /* ... */
		.replace(/\/\*[\s\S]*?\*\//g, '')
		// // ...
		.replace(/\/\/[^\r\n]*/g, '');

		// text.replace(/<!--[\s\S]*?-->/g, '');

		// TODO: /^#/
	}

	library_namespace.set_method(Convert_Pairs, {
		remove_comments : remove_comments,
		is_Convert_Pairs : is_Convert_Pairs,

		KEY_REMOVE : typeof Symbol === 'function' ? Symbol('remove the key')
				: {
					KEY_REMOVE : true
				}
	});

	// ----------------------------------------------------------------------------------

	function get_pair_Map_of_key(key) {
		// assert: typeof key === 'string'
		var pair_Map_by_length = this.special_keys_Map
				&& this.pair_Map_by_length, pair_Map;
		if (pair_Map_by_length) {
			pair_Map = pair_Map_by_length[key.length];
			if (!pair_Map)
				return;
		} else {
			pair_Map = this.pair_Map;
		}
	}

	function Convert_Pairs__get_value(key) {
		// assert: typeof key === 'string'
		var pair_Map = get_pair_Map_of_key.call(this, key);
		return pair_Map && pair_Map.get(key);
	}

	function Convert_Pairs__add(source, options) {
		// 前置处理。
		options = library_namespace.setup_options(options);

		var pair_Map = this.pair_Map;

		if (library_namespace.is_Object(source)) {
			for ( var key in source) {
				if (value === Convert_Pairs.KEY_REMOVE)
					pair_Map['delete'](key, source[key]);
				else
					pair_Map.set(key, source[key]);
			}
			delete this.special_keys_Map;
			return this;
		}

		if (typeof source === 'string') {
			if (options.remove_comments)
				source = Convert_Pairs.remove_comments(source);
			// console.trace([ source ]);
			if (!source.trim())
				return;
			// 顺便正规化。
			var separator = options.field_separator
			//
			|| this.field_separator;
			if (!separator) {
				// 侦测是 key=value,key=value，
				// 或 key \t value \n key \t value
				if (/[\r\n]/.test(source))
					separator = /[\r\n]+/;
				else if (separator = source.match(/[,;|]/))
					separator = separator[0];
				if (separator)
					library_namespace.debug('Use field separator: ['
							+ separator + ']', 2, 'Convert_Pairs.add');
			}
			if (separator)
				source = source.split(separator);
			else {
				library_namespace
						.warn('Convert_Pairs.add: Cannot determine the field separator! '
								+ source);
				source = [ source ];
			}
		}

		if (!Array.isArray(source) || source.length === 0) {
			return this;
		}

		// --------------------------------------------------------------------

		var length = source.length,
		// options: 仅纳入 key 与 value 不同之 pair。
		no_the_same_key_value = options.no_the_same_key_value,
		// key / value 分隔符号。
		separator = options.separator || this.separator,
		//
		key_is_number = options.key_is_number,
		//
		value_is_number = options.value_is_number,
		//
		item_processor = typeof options.item_processor === 'function'
				&& options.item_processor,
		//
		dictionary_path = this.path;

		if (!separator && typeof source[0] === 'string') {
			// 遍历 source 以侦测是 key=value,key=value，
			// 或 key \t value \n key \t value
			for (var i = 0; i < length; i++) {
				if (typeof source[i] === 'string'
						&& (separator = source[i].match(/[^\n]([\t=])[^\n]/))) {
					separator = separator[1];
					library_namespace.debug('Use assignment sign: '
							+ new RegExp(separator), 3, 'Convert_Pairs.add');
					break;
				}
			}
			if (!separator) {
				// console.trace(source);
				throw new Error(
						'Convert_Pairs.add: No assignment sign detected! 请手动指定！');
			}
		}

		library_namespace.debug('Add ' + source.length + ' pairs...', 3,
				'Convert_Pairs.add');
		source.forEach(function(item) {
			if (item_processor) {
				item = item_processor(/* {String} */item, options);
			}
			if (!item)
				return;

			if (false && typeof item === 'string' && !item.trim()) {
				console.log(item.charCodeAt(0));
				console.trace(JSON.stringify(item));
			}
			if (typeof item === 'string')
				item = item.split(separator);
			var key = item[0], value = item[1];
			if (!key) {
				library_namespace.warn('Convert_Pairs.add: 未设定 key: '
						+ item.join(separator));
				return;
			}
			if (!value) {
				var matched = key
						.match(library_namespace.PATTERN_RegExp_replacement);
				if (matched) {
					key = '/' + matched[1] + '/' + matched[3];
					value = matched[2];
				}
				if (!value) {
					library_namespace.warn('Convert_Pairs.add: 转换时将删除 '
							+ JSON.stringify(key));
				}
			}

			library_namespace.debug('adding [' + key + '] → ['
			// Cannot convert a Symbol value to a string
			+ String(value) + ']', source.length > 200 ? 3 : 2,
					'Convert_Pairs.add');
			if (key === value) {
				library_namespace.debug('key 与 value 相同，项目没有改变：[' + key + ']'
				//
				+ (dictionary_path ? ' (' + dictionary_path + ')' : ''), 2,
						'Convert_Pairs.add');
				if (no_the_same_key_value) {
					return;
				}
				// 长度为 1 的没有转换必要。
				if (no_the_same_key_value !== false && key.length === 1) {
					// 后来的会覆盖前面的。
					if (pair_Map.has(key))
						pair_Map['delete'](key);
					return;
				}
				// 可能是为了确保不被改变而设定。
			}

			if (value === Convert_Pairs.KEY_REMOVE) {
				library_namespace.debug('Remove [' + key + ']: '
						+ pair_Map[key], 0, 'Convert_Pairs.add');
				// if (pair_Map.has(key)) { }
				pair_Map['delete'](key);
				return;
			}

			if (key_is_number && !isNaN(key))
				key = +key;
			if (value_is_number && !isNaN(value))
				value = +value;

			if (pair_Map.has(key)) {
				if (value === pair_Map.get(key)) {
					library_namespace.info('Convert_Pairs.add: 重复设定相同的['
					//
					+ key + ']=[' + value + ']'
					//
					+ (dictionary_path ? ' (' + dictionary_path + ')' : ''));
					return;
				}
				// 后来的会覆盖前面的。
				if (library_namespace.is_debug(2)) {
					library_namespace.warn(
					//
					'Convert_Pairs.add: Duplicated key [' + key
					//
					+ '], value will be changed: [' + pair_Map.get(key)
					//
					+ '] → [' + String(value) + ']');
				}
			}
			pair_Map.set(key, value);
		});

		delete this.special_keys_Map;
		return this;
	}

	function Convert_Pairs__remove(key_hash, options) {
		if (!key_hash)
			return this;

		if (typeof key_hash === 'string')
			key_hash = [ key_hash ];

		if (Array.isArray(key_hash)) {
			var tmp = key_hash;
			key_hash = Object.create(null);
			for (var i = 0; i < tmp.length; i++)
				key_hash[tmp[i]] = null;
		}

		var remove_matched_path = options && options.remove_matched_path;
		var pair_Map = this.pair_Map, path = this.path, changed;
		// console.trace([ path, key_hash ]);
		for ( var search_key in key_hash) {
			// key_hash[key]: ignore path
			if (key_hash[search_key] === path) {
				if (remove_matched_path)
					delete key_hash[search_key];
				continue;
			}

			var pattern = search_key.match(library_namespace.PATTERN_RegExp);
			if (pattern) {
				pattern = new RegExp(pattern[1], pattern[2] || options.flags);
				library_namespace.debug('Remove pattern: ' + pattern + ' of '
						+ path, 2, 'Convert_Pairs__remove');
				var keys_to_remove = [];
				pair_Map.forEach(function(value, key) {
					if (pattern.test(key) || pattern.test(value))
						keys_to_remove.push(key);
				});
				if (keys_to_remove.length > 0) {
					library_namespace.debug(path + '\tRemove '
							+ keys_to_remove.length + ' keys.', 2,
							'Convert_Pairs__remove');
					// console.trace(keys_to_remove);
					keys_to_remove.forEach(function(key) {
						pair_Map['delete'](key);
					});
					changed = true;
				}

			} else {
				changed = pair_Map['delete'](search_key);
			}
		}

		if (changed)
			delete this.special_keys_Map;
		return this;
	}

	// add the content of file path
	function Convert_Pairs__add_path(options) {
		// console.trace(options);
		// 前置处理。
		options = library_namespace.setup_options(options);

		var path = options.path;
		if (Array.isArray(path)) {
			if (path.length < 2) {
				path = path[0];
			} else {
				path.forEach(function(file_path) {
					var _options = library_namespace.new_options(options);
					if (library_namespace.is_Object(file_path)) {
						// e.g., for .remove_comments
						Object.assign(_options, file_path);
						file_path = file_path.file_path || file_path.path;
					}

					_options.path = file_path;
					this.add_path(_options);
				}, this);
				return this;
			}
		}

		// assert: typeof path === 'string'
		// `path` is file path
		if (!path || typeof options.file_filter === 'function'
				&& !options.file_filter(path)) {
			return this;
		}

		var source;
		try {
			// 注意:此方法不可跨 domain!
			source = library_namespace.get_file(path);
		} catch (e) {
			// TODO: handle exception
		}

		if (source) {
			this.path = path;
			// 载入 resources。
			this.add(source, options);
		} else {
			library_namespace
					.warn('Convert_Pairs.add_path: Cannot get contents of ['
							+ path + ']!');
		}
		return this;
	}

	function Convert_Pairs__save(path, encoding, save_new) {
		if (!library_namespace.write_file)
			throw new Error('Please include CeL.application.storage first!');

		if (path !== this.path) {
			path = this.path;
		} else if (!save_new && this.remove_comments) {
			library_namespace.warn('移除注解后再存档，会失去原先的注解！请考虑设定 save_new flag。');
		}

		if (!encoding) {
			encoding = library_namespace.guess_encoding
					&& library_namespace.guess_encoding(path)
					|| library_namespace.open_format.TristateTrue;
		}
		library_namespace.debug([ '(' + encoding, ') [', path, ']' ], 2,
				'Convert_Pairs.save');

		var pair_Map = this.pair_Map;
		if (pair_Map.size > 0) {
			var line, data = [], separator = this.separator || '\t';
			pair_Map.forEach(function(pair) {
				var value = pair[1];
				if (Array.isArray(value))
					value = value.join(separator);
				data.push(pair[0] + separator + value);
			})

			library_namespace.debug([ save_new ? 'Appending ' : 'Writing ',
					data.length, ' data to (' + encoding, ') [', path, ']' ],
					2, 'Convert_Pairs.save');
			library_namespace.debug(data.join('<br />'), 3,
					'Convert_Pairs.save');
			library_namespace.write_file(path,
			//
			data.join(this.field_separator
					|| library_namespace.env.line_separator), encoding,
			//
			save_new ? library_namespace.IO_mode.ForAppending : undefined);
		}

		library_namespace.log([ data.length, ' new records saved. [', {
			// 重新纪录.
			a : 'save again',
			href : '#',
			onclick : function() {
				this.save(path, encoding, save_new);
				return false;
			}.bind(this)
		}, ']' ]);

		return this;
	}

	function Convert_Pairs__save_new(path, encoding) {
		return this.save(path, encoding, true);
	}

	// re-generate pattern, this.get_sorted_keys()
	function Convert_Pairs__pattern(options) {
		// 前置处理。
		options = library_namespace.setup_options(options);

		var normal_keys = [], flags = options.flags || this.flags,
		// 若 key 为 RegExp 之 source 时，.length 不代表可能 match 之长度。
		// e.g., '([\d〇一二三四五六七八九])米'
		// 因此特殊 keys 必须放在 special_keys_Map。
		special_keys_Map = this.special_keys_Map = new Map,
		//
		pair_Map = this.pair_Map;
		pair_Map.forEach(function(value, key) {
			// 必须排除掉 "(﹁﹁)" → "(﹁﹁)"
			if (!library_namespace.PATTERN_RegExp.test(key)) {
				normal_keys.push(key);
				return;
			}

			try {
				// console.trace([ key.to_RegExp(flags), value ]);
				special_keys_Map.set(key, [ key.to_RegExp(flags), value ]);
			} catch (e) {
				library_namespace.error('Convert_Pairs__pattern: '
				// Error key?
				+ '[' + key + '] → ['
				// Cannot convert a Symbol value to a string
				+ String(value) + ']: ' + e.message);

				// normal_keys.push(key);
			}
		});

		normal_keys.sort(this.comparator);

		// reset
		delete this.pair_Map_by_length;
		delete this.convert_pattern;

		if (normal_keys.length === 0) {
			;

		} else if (options.generate_pair_Map_by_length) {
			var pair_Map_by_length = this.pair_Map_by_length = [];
			normal_keys.forEach(function(key) {
				var length = key.length;
				var map = pair_Map_by_length[length];
				if (!map)
					map = pair_Map_by_length[length] = new Map;
				map.set(key, pair_Map.get(key));
			});

		} else {
			try {
				this.convert_pattern = new RegExp(
						normal_keys.join('|') || '^$', flags);
			} catch (e) {
				// @IE，当 keys 太多太长时，
				// 若是使用 new RegExp(keys.join('|'), 'g') 的方法，
				// 可能出现 "记忆体不足" 之问题。
			}
		}
		// console.log(this.convert_pattern);
		// 2022/2/13: 17
		// console.trace('最长的转换 key.length=' + pair_Map_by_length.length);

		if (options.get_normal_keys)
			return normal_keys;

		return this.convert_pattern;
	}

	function Convert_Pairs__for_each(operator, options) {
		this.pair_Map.forEach(function(value, key) {
			operator(key, value);
		});
		return this;
	}

	// select the first fitted
	function Convert_Pairs__select(selector, options) {
		if (typeof selector !== 'function') {
			var target = selector || options && options.target;
			if (!target)
				return;

			library_namespace.debug('target: ' + target + ', options: '
					+ options, 3);
			if (options === true) {
				return this.get_value(target);
			}

			if (library_namespace.is_RegExp(target)) {
				selector = function(key, value) {
					return target.test(key) && value;
				};
			} else {
				var replace_flags = this.flags;
				selector = function(key, value) {
					var pattern;
					try {
						pattern = typeof replace_flags === 'function'
						//
						? replace_flags(key)
						//
						: new RegExp(key, replace_flags);
					} catch (e) {
						// Error key?
						library_namespace.error('Convert_Pairs.select: key '
								+ (pattern || '[' + key + ']') + ': '
								+ e.message);
					}
					return pattern.test(target) && value;
				};
			}
		}

		// TODO: use `for (const key of this.pair_Map.keys())`
		for (var pair_Map = this.pair_Map, keys = Array.from(pair_Map.keys()), index = 0; index < keys.length; index++) {
			var key = keys[index], value = selector(key, pair_Map.get(key));
			if (value)
				return value;
		}
	}

	// @inner
	function generate_demarcation_points(text_list) {
		var index = 0, demarcation_points = [];
		text_list.forEach(function(text_slice) {
			demarcation_points.push(index += text_slice.length);
		});
		return demarcation_points;
	}

	// @inner
	function convert_using_pair_Map_by_length(text, options) {
		var pair_Map_by_length = this.pair_Map_by_length, max_key_length = pair_Map_by_length.length,
		// node.js v17.4.0 采用字串的方法 converted_text_slice += '' 与采用阵列的方法 .push()
		// 速度差不多。
		converted_text_list, converted_text_slice = '',
		// show_hitted
		show_matched = options && options.show_matched,
		// 分界点。
		demarcation_points;

		if (Array.isArray(text)) {
			demarcation_points = generate_demarcation_points(text);
			// console.log([ text, demarcation_points ]);
			converted_text_list = [];
			text = text.join('');
		} else {
			text = String(text);
		}

		// @see
		// https://github.com/tongwentang/tongwen-core/blob/master/src/converter/map/convert-phrase.ts
		for (var index = 0, length = text.length; index < length;) {
			// 本次要测试的文字。
			var text_to_convert = text.slice(index, Math.min(length, index
					+ max_key_length));

			var text_to_convert_length = text_to_convert.length;
			while (true) {
				var map = pair_Map_by_length[text_to_convert_length];
				if (map && map.has(text_to_convert)) {
					// Found.
					if (show_matched) {
						library_namespace.info(text_to_convert + '→'
								+ map.get(text_to_convert));
					}
					converted_text_slice += map.get(text_to_convert);
					break;
				}

				if (text_to_convert_length === 1) {
					// Nothing matched.
					converted_text_slice += text_to_convert;
					break;
				}

				// 长先短后 词先字后
				text_to_convert = text_to_convert.slice(0,
				// 截短1字元再做下一轮测试。
				--text_to_convert_length);
			}

			// console.log(index + '→' + (index + text_to_convert_length));
			index += text_to_convert_length;
			if (!demarcation_points) {
				continue;
			}

			// 依照分界点分割 converted_text_slice。
			while (true) {
				// 先计算还不够的长度。
				var _length = demarcation_points[converted_text_list.length]
						- index;
				if (!(_length <= 0)) {
					break;
				}
				// 已经累积足够的 converted_text_slice。
				_length += converted_text_slice.length;
				converted_text_list
						.push(converted_text_slice.slice(0, _length));
				converted_text_slice = converted_text_slice.slice(_length);
			}
		}

		// console.trace(converted_text_list || converted_text_slice);
		if (converted_text_list) {
			// assert: converted_text_slice === ''
			return converted_text_list;
		}

		return converted_text_slice;
	}

	// @inner
	function split_text_by_demarcation_points(text_String, converted_text,
			demarcation_points) {
		// 分割 converted_text: 因为 converted_text 可能经过多重 this.special_keys_Map 转换，
		// 在 this.special_keys_Map.forEach() 里面处理 indexes 将会非常复杂。是故采用 CeL.LCS()。
		var diff_list = library_namespace.LCS(text_String, converted_text, {
			line : false,
			diff : true
		});
		var index_of_demarcation_points = 0, increased_index = 0;
		// console.trace(diff_list);
		// console.trace(demarcation_points);

		diff_list.forEach(function(diff_pair) {
			var from_index = diff_pair.index[0];
			var to_index = diff_pair.index[1];
			// console.trace(from_index, to_index, diff_pair.last_index);
			var increased_in_this_diff = to_index && from_index
			//
			? to_index[1] - from_index[1] - increased_index
			//
			: to_index ? to_index[1] - diff_pair.last_index[1]
					: -(from_index[1] - diff_pair.last_index[0]);
			// console.trace(increased_in_this_diff, from_index, to_index,
			// diff_pair.last_index);
			// 开始的索引差距应该跟上一个结尾的索引差距相同。
			// assert: increased_index === to_index[0] - from_index[0]
			var from_start = from_index ? from_index[0]
					: diff_pair.last_index[0] + 1;
			var from_end = from_index ? from_index[1] + 1
					: diff_pair.last_index[0] + 1;
			while (demarcation_points[index_of_demarcation_points]
			//
			< from_end) {
				if (increased_in_this_diff
				//
				&& demarcation_points[index_of_demarcation_points]
				//
				> from_start) {
					// e.g., a,a → bbb；不能决定到底是 b,bb 还是 bb,b。
					var old_index
					//
					= demarcation_points[index_of_demarcation_points];
					var _diff = old_index - from_start;
					// converted_text 切割的 index。
					var to_i = to_index[0] + _diff;
					library_namespace.info('Convert_Pairs__convert: 将 ['
					//
					+ text_String.slice(from_start, old_index) + ','
					//
					+ text_String.slice(old_index, from_end) + '] 分割成 ['
					//
					+ converted_text.slice(to_index[0], to_i) + ','
					//
					+ converted_text.slice(to_i, to_index[1] + 1) + ']');
				}
				demarcation_points[index_of_demarcation_points++]
				// 这样会将本次增加的 (increased_in_this_diff) 全部排到最后一个。
				+= increased_index;
			}

			// 结尾的索引差距。
			increased_index += increased_in_this_diff;
		});

		// console.trace(increased_index, index_of_demarcation_points,
		// demarcation_points);
		if (increased_index) {
			while (index_of_demarcation_points < demarcation_points.length)
				demarcation_points[index_of_demarcation_points++] += increased_index;
		}
		// console.trace(demarcation_points);

		text_String = demarcation_points.map(function(i, index) {
			return converted_text.slice(
					index > 0 ? demarcation_points[index - 1] : 0, i);
		});

		return text_String;
	}

	// @inner
	function adapt_special_keys_Map(text_Array, options) {
		// show_hitted
		var show_matched = options && options.show_matched;

		var demarcation_points = generate_demarcation_points(text_Array);
		var text_String = text_Array.join('');
		var converted_text = text_String;
		this.special_keys_Map.forEach(function(value, key) {
			// var pattern = value[0], replace_to = value[1];
			if (show_matched && value[0].test(converted_text)) {
				library_namespace.info(value[0] + ': '
				//
				+ converted_text + '→'
						+ converted_text.replace(value[0], value[1]));
			}
			// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#specifying_a_string_as_a_parameter
			converted_text = converted_text.replace(value[0], value[1]);
			// 在这里呼叫 split_text_by_demarcation_points() 可增加精准度，但大大降低效能。
		});

		// assert: demarcation_points.at(-1) === text_String.length
		if (text_String === converted_text) {
			return text_Array;
		}

		return split_text_by_demarcation_points(text_String, converted_text,
				demarcation_points);
	}

	// @see function LCS_length()
	// https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Errors/Invalid_array_length
	// 设定小一点，LCS() 的时候才不会浪费太多时间。
	var SOFT_SLICE_LIMIT = 1000;
	// HARD_SLICE_LIMIT < 65536 但必须预防有些转换把长度拉长了。
	var HARD_SLICE_LIMIT = 65530;
	// console.assert(SOFT_SLICE_LIMIT < HARD_SLICE_LIMIT);
	// console.assert(HARD_SLICE_LIMIT ** 2 < 2 ** 32 - 1);

	var using_pair_Map_by_length = true;
	function Convert_Pairs__convert(text, options) {
		if (false && this.pair_Map) {
			library_namespace.debug(
			//
			'Convert ' + String(text).length + ' characters, using '
					+ this.pair_Map.size + ' pairs with replace_flags ['
					+ this.replace_flags + '].', 3,
			// Convert_Pairs.convert
			'Convert_Pairs__convert');
		}

		if (!this.special_keys_Map) {
			this.pattern({
				flags : this.replace_flags,
				generate_pair_Map_by_length : using_pair_Map_by_length
			});
			if (this.may_remove_pair_Map) {
				library_namespace.debug('在开始转换之后就不会再修改辞典档，因此可移除 .pair_Map。', 1,
						'Convert_Pairs__convert');
				delete this.pair_Map;
			}
		}
		// console.trace(this.convert_pattern);
		// console.trace(this.special_keys_Map);

		// show_hitted
		var show_matched = options && options.show_matched;

		// 长先短后 词先字后
		if (this.pair_Map_by_length) {
			// console.trace(text);
			text = convert_using_pair_Map_by_length.call(this, text, options);

		} else if (this.convert_pattern) {
			text = String(text).replace(this.convert_pattern, function(token) {
				// library_namespace.info(token + '→' +
				// pair_Map.get(token));
				return pair_Map.get(token);
			});
		}

		// ----------------------------------------------------------

		// console.trace([ text, this.special_keys_Map ]);

		if (!Array.isArray(text)
		// Nothing to do.
		|| this.special_keys_Map.size === 0) {
			// assert: typeof text === 'string'
			this.special_keys_Map.forEach(function(value, key) {
				// var pattern = value[0], replace_to = value[1];
				if (show_matched && value[0].test(text)) {
					library_namespace.info(value[0] + ': ' + text + '→'
							+ text.replace(value[0], value[1]));
				}
				text = text.replace(value[0], value[1]);
			});
			return text;
		}

		// assert: Array.isArray(text)
		// console.trace([ text, this.special_keys_Map ]);

		var converted_text = [];
		// 避免 RangeError: Invalid typed array length:
		// @see function LCS_length()
		for (var index = 0; index < text.length;) {
			var latest_index = index, this_slice_length = 0;
			// 限制长度在这个之内。
			while (index < text.length && this_slice_length < SOFT_SLICE_LIMIT)
				this_slice_length += text[index++].length;
			while (index < text.length) {
				this_slice_length += text[index].length;
				if (this_slice_length >= HARD_SLICE_LIMIT) {
					// 真的太长还是得强制截断。警告: 这可能造成没有办法匹配的错误情况。
					break;
				}
				// 延伸到句子结尾。
				if (/(?:[。？！…」]|\/>)[\s\n]*$/.test(text[index]))
					break;
				index++;
			}
			if (false) {
				console.log(text.slice(index - 20, index));
				console.trace(latest_index + '-' + index + '/' + text.length
						+ ': ' + this_slice_length);
			}
			converted_text.append(adapt_special_keys_Map.call(this, text.slice(
					latest_index, index), options));
		}
		// console.assert(converted_text.length === text.length);
		return converted_text;
	}

	// reverse conversion, 改成 value → key
	function Convert_Pairs__reverse(options) {
		// 前置处理。
		options = library_namespace.new_options(options);
		options.ignore_null_value = true;

		this.pair_Map = this.pair_Map.reverse_key_value(options);

		delete this.special_keys_Map;
		return this;
	}

	function Convert_Pairs__clone(options) {
		return new Convert_Pairs(this, options);
	}

	function Convert_Pairs__to_Object(source) {
		var object = Object.create(null);
		this.pair_Map.forEach(function(value, key) {
			object[key] = value;
		});
		return object;
	}

	function Convert_Pairs__comparator(key_1, key_2) {
		// 排序：长的 key 排前面。 long → short
		var diff = key_2.length - key_1.length;
		return diff !== 0 ? diff
		// assert: key_1 !== key_2
		: key_1 < key_2 ? -1 : 1;
	}

	// ---------------------------------------------------------------------//
	// export 导出.

	library_namespace.set_method(Convert_Pairs.prototype, {
		get_value : Convert_Pairs__get_value,
		add : Convert_Pairs__add,
		remove : Convert_Pairs__remove,
		add_path : Convert_Pairs__add_path,
		save : Convert_Pairs__save,
		save_new : Convert_Pairs__save_new,
		pattern : Convert_Pairs__pattern,
		// for each pair
		for_each : Convert_Pairs__for_each,
		select : Convert_Pairs__select,
		// convert from key to value.
		convert : Convert_Pairs__convert,
		reverse : Convert_Pairs__reverse,
		clone : Convert_Pairs__clone,
		to_Object : Convert_Pairs__to_Object,

		comparator : Convert_Pairs__comparator,

		/**
		 * {String} key-value 分隔符号.
		 */
		// separator : '\t',
		/**
		 * {String} 栏位分隔符号.
		 */
		// field_separator : /[\r\n]+/,
		/** default RegExp replace flags: global match, or 'ig' */
		flags : 'g'
	});

	return Convert_Pairs;
}
