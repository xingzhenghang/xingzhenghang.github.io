/**
 * @name CeL function for console
 * 
 * @fileoverview 本档案包含了 console 操作用的 functions。<br />
 *               a.k.a. 一般论坛 (BBS) ANSI color 转换程式。
 * 
 * @since 2015/3/1 13:16:6
 */

'use strict';

// More examples: see /_test suite/test.js

// ------------------------------------------------------------------------------------------------

typeof CeL === 'function' && CeL.run({
	name : 'interact.console',
	// includes() @ data.code.compatibility.
	require : 'data.code.compatibility.|data.native.to_RegExp_pattern',

	// 为了方便格式化程式码，因此将 module 函式主体另外抽出。
	code : module_code
});

function module_code(library_namespace) {

	// requiring
	var to_RegExp_pattern = this.r('to_RegExp_pattern');

	/**
	 * null module constructor
	 * 
	 * @class console 处理的 functions
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

	// -------------------------------------------------------------

	/**
	 * 本 module 所有 library_namespace.debug() 可能使用到之相关函数，所须使用之最低 debug level。
	 * 
	 * @type {ℕ⁰:Natural+0}
	 * 
	 * @see function new_SGR(messages) @ base.js
	 */
	var min_debug = 3;

	// -------------------------------------------------------------
	//

	/**
	 * parse style name
	 * 
	 * @param {String|Object}style_name
	 *            style name to parse
	 * 
	 * @returns {String}style name
	 * 
	 * @see <span title="Select Graphic Rendition">SGR</span> parameters
	 */
	function SGR_style_name(style_name) {
		library_namespace.debug({
			// gettext_config:{"id":"search-style-name-$1-in-`sgr_code.style_name_alias`"}
			T : [ 'Search style name [%1] in `SGR_code.style_name_alias`...',
					style_name ]
		}, min_debug, 'SGR_style_name');
		if (typeof style_name !== 'object'
				&& (style_name in SGR_code.style_name_alias))
			style_name = SGR_code.style_name_alias[style_name];
		if (library_namespace.is_debug() && (typeof style_name === 'object'
		//
		|| !(style_name in SGR_code.style_data))) {
			library_namespace.warn([ 'SGR_style_name: ', {
				// gettext_config:{"id":"unknown-style-name-$1"}
				T : [ 'Unknown style name: [%1].', style_name ]
			} ]);
		}
		return style_name;
	}

	/**
	 * parse style value
	 * 
	 * @param style_value
	 *            style value to parse
	 * @param {String}[style_name]
	 *            style name to referrer
	 * 
	 * @returns {String} style value
	 */
	function SGR_style_value(style_value, style_name) {
		// TODO: using "brightred", "boldred"
		// http://git-scm.com/docs/git-config#Documentation/git-config.txt-color

		if (typeof style_value !== 'object'
				&& (style_value in SGR_code.color_index)) {
			if (typeof style_name !== 'string' || !(style_name in color_shift)) {
				// Expects value in color_shift.
				library_namespace.warn([ 'SGR_style_value: ', {
					// gettext_config:{"id":"invalid-name-of-color-$1"}
					T : [ 'Invalid name of color: [%1].', style_name ]
				} ]);
				return;
			}
			// color_shift[style_name] +
			return SGR_code.color_index[style_value];
		}

		if (style_value in SGR_style_value.alias)
			style_value = SGR_style_value.alias[style_value];

		if (typeof style_value === 'boolean') {
			if ((style_name in SGR_code.style_data)
					&& SGR_code.style_data[style_name][style_value ? 0 : 1] === undefined) {
				library_namespace.warn([ {
					// gettext_config:{"id":"invalid-value-$1-of-style-$2"}
					T : [ 'Invalid value [%1] of style: [%2]:',
					//
					style_value, style_name ]
				}, {
					// gettext_config:{"id":"unable-to-convert-the-value-to-a-style"}
					T : '无法将真伪值转为样式。'
				} ]);
				return;
			}
			return style_value;
		}

		if (isNaN(style_value) || (style_value |= 0) < 0) {
			library_namespace.warn([ {
				// gettext_config:{"id":"invalid-value-$1-of-style-$2"}
				T : [ 'Invalid value [%1] of style: [%2]:',
				//
				style_value, style_name ]
			}, {
				// gettext_config:{"id":"the-style-value-is-not-a-number"}
				T : '欲设定的样式值并非数字。'
			} ]);
			return;
		}

		// do more check.
		if ((style_name in SGR_code.style_data)
				&& !SGR_code.style_data[style_name].includes(style_value))
			if (style_name in color_shift) {
				if (style_value >= color_shift[style_name])
					style_value -= color_shift[style_name];
			} else {
				library_namespace.warn([ {
					// gettext_config:{"id":"invalid-value-$1-of-style-$2"}
					T : [ 'Invalid value [%1] of style: [%2]:',
					//
					style_value, style_name ]
				}, {
					// gettext_config:{"id":"the-style-value-is-not-in-the-style-sheet-$1-that-can-be-set"}
					T : [ '样式值不在可设定的样式资料[%1]中。',
					//
					SGR_code.style_data[style_name] ]
				} ]);
				return;
			}

		return style_value;
	}

	SGR_style_value.alias = {
		'true' : true,
		'false' : false
	};

	/**
	 * check if the style value is "reset" or not.
	 * 
	 * @param style_value
	 *            style value to check
	 * 
	 * @returns {Boolean} the style value is "reset".
	 */
	function is_reset_style(style_value) {
		return style_value === 0 || style_value === '0';
	}

	/**
	 * parse and add style to {SGR_style}(this).<br />
	 * 注意: 一般论坛 (BBS) 使用 VT100，遇到 \x20 (space) 即会终止解析而跳出。 但本函式依然会跳过空白而解析之。
	 * 
	 * @param style
	 *            style to add
	 * 
	 * @returns {SGR_style}(this)
	 */
	function SGR_style_add(style) {
		if (!style && !is_reset_style(style))
			// skip.
			return this;

		library_namespace.debug({
			// gettext_config:{"id":"searching-style-{$2}-$1-in-sgr_code.style_value_alias"}
			T : [ 'Searching style {%2} [%1] in SGR_code.style_value_alias...',
					typeof JSON === 'object' ? JSON.stringify(style) : style,
					typeof style ]
		}, min_debug, 'SGR_style_add');
		if (typeof style !== 'object')
			while (style in SGR_code.style_value_alias) {
				library_namespace.debug({
					// gettext_config:{"id":"find-style-$1-normalized-to-→-$2"}
					T : [ 'Find style [%1] normalized to → [%2]', style,
							SGR_code.style_value_alias[style] ]
				}, min_debug, 'SGR_style_add');
				style = SGR_code.style_value_alias[style];
			}

		library_namespace.debug({
			// gettext_config:{"id":"parse-{$2}-$1-if-it-is-a-primitive-value"}
			T : [ 'Parse {%2} [%1] if it is a primitive value.',
					typeof JSON === 'object' ? JSON.stringify(style) : style,
					typeof style ]
		}, min_debug, 'SGR_style_add');
		if (typeof style === 'string') {
			if (style.includes(SGR_code.separator)) {
				style = style.split(SGR_code.separator);

			} else if (isNaN(style)) {
				library_namespace.debug({
					// gettext_config:{"id":"test-if-$1-is-+-style-name"}
					T : [ 'Test if [%1] is "[+-] style name".', style ]
				}, min_debug, 'SGR_style_add');
				// "+bright"
				var matched = style.match(/^([+\-])([^=]*?)$/);
				if (matched && (matched[2] = SGR_style_name(matched[2].trim()))) {
					matched[1] = matched[1] !== '-';
					if (undefined === SGR_style_value(matched[1], matched[2]))
						library_namespace.warn([ 'SGR_style_add: ', {
							// gettext_config:{"id":"invalid-configuration-of-style-$1"}
							T : [ 'Invalid configuration of style: [%1].',
							// Expects integer.
							matched[2] ]
						} ]);
					else {
						library_namespace.debug({
							// gettext_config:{"id":"set-style-$1-=-$2"}
							T : [ 'Set style "%1" = %2.', matched[2],
									matched[1] ]
						}, min_debug, 'SGR_style_add');
						this[matched[2]] = matched[1];
					}
					return this;
				}

				library_namespace.debug({
					T : [
					// gettext_config:{"id":"test-if-$1-is-style-name-=-style-value-(0-1-false-true-...)"}
					'Test if [%1] is "style name = style value (0, 1, false, true, ...)".'
					//
					, style ]
				}, min_debug, 'SGR_style_add');
				matched = style.match(/^([^=]+)=(.+)$/);
				if (matched && (matched[1] = SGR_style_name(matched[1].trim()))) {
					if (undefined !== (matched[2] = SGR_style_value(matched[2]
							.trim(), matched[1])))
						this[matched[1]] = matched[2];
					return this;
				}

				// 死马当活马医。
				style = SGR_style_name(style);
			} else {
				style |= 0;
			}
		} else if (typeof style === 'number') {
			style |= 0;
		}

		if (library_namespace.is_Object(style) || style instanceof SGR_style) {
			library_namespace.debug({
				T : [
						// gettext_config:{"id":"parse-{$2}-$1-if-it-is-a-object"}
						'Parse {%2} [%1] if it is a object.',
						typeof JSON === 'object' ? JSON.stringify(style)
								: style, typeof style ]
			}, min_debug, 'SGR_style_add');
			Object.keys(style).some(
					function(style_name) {
						var style_value = style[style_name];
						if (!(style_name = SGR_style_name(style_name))) {
							// 已于 SGR_style_name() 警告过。
							return;
						}

						style_value = SGR_style_value(style_value, style_name);
						if (style_value !== undefined) {
							library_namespace.debug({
								T : [ 'Set style "%1" = [%2].', style_name,
										style_value ]
							}, min_debug + 1, 'SGR_style_add');
							this[style_name] = style_value;
						} else if (is_reset_style(style_value)) {
							library_namespace.debug({
								// gettext_config:{"id":"reset-style-{$2}-$1"}
								T : [ 'Reset style {%2} [%1].', style,
										typeof style ]
							}, min_debug + 1, 'SGR_style_add');
							this.to_reset();
							return true;
						}
					}, this);

		} else if (Array.isArray(style)) {
			style.forEach(function(value) {
				this.add(value);
			}, this);

		} else if (30 <= style && style <= 37) {
			this.foreground = style;
		} else if (40 <= style && style <= 47) {
			this.background = style;
		} else if (is_reset_style(style)) {
			library_namespace.debug({
				// gettext_config:{"id":"reset-style-{$2}-$1"}
				T : [ 'Reset style {%2} [%1].', style, typeof style ]
			}, min_debug, 'SGR_style_add');
			this.to_reset();
		} else if (library_namespace.is_debug()) {
			library_namespace.warn([ 'SGR_style_add: ', {
				// gettext_config:{"id":"unknown-style-$1"}
				T : [ 'Unknown style: [%1].', style ]
			} ]);
		}

		return this;
	}

	/**
	 * SGR style Class
	 * 
	 * @param [style]
	 *            style to set
	 * 
	 * @returns {SGR_style}(this)
	 */
	function SGR_style(style, options) {
		if (false)
			if (library_namespace.is_Object(options))
				this.options = options;
		// 对于 Object.create(null)，这边会出错。
		library_namespace.debug('Set style ['
				+ (typeof JSON === 'object' ? JSON.stringify(style) : style)
				+ ']', min_debug, 'SGR_style');
		this.add(style);
		library_namespace.debug('Set style ['
				+ (typeof JSON === 'object' ? JSON.stringify(style) : style)
				+ '] finished.', min_debug + 1, 'SGR_style');
	}

	/**
	 * indicate the color styles.<br />
	 * 实际上应该列出所有设定值超过一种的样式/格式名。
	 * 
	 * @type {Object}
	 */
	var color_shift = {
		foreground : 30,
		background : 40
	};

	Object.assign(SGR_style.prototype, {
		add : SGR_style_add,
		forEach : function(callback, thisArg) {
			// 下面当前不使用。
			if (false) {
				var style_names = Object.keys(this);
				if (this.options)
					// remove 'options'.
					style_names.splice(style_names.indexOf('options'), 2);
				style_names.forEach(callback, thisArg || this);
			}

			Object.keys(this).forEach(callback, thisArg || this);
		},

		to_reset : function() {
			library_namespace.debug('Reset style.', min_debug,
					'SGR_style.prototype.to_reset');
			this.forEach(function(style_name) {
				delete this[style_name];
			});
			this.reset = true;
			return this;
		},

		clone : function(options) {
			library_namespace.debug('Clone style [' + this + '].', min_debug,
					'SGR_style.prototype.clone');
			var result = new SGR_style();
			this.forEach(function(style_name) {
				result[style_name] = this[style_name];
			});
			if (false)
				if (options = options || this.options)
					result.options = options;
			return result;
		},

		to_Array : function() {
			var array = [];
			if (library_namespace.is_debug(min_debug))
				library_namespace.debug('style [' + Object.keys(this) + ']', 1,
						'SGR_style.prototype.to_Array');
			if (false)
				for ( var name in this)
					library_namespace.debug('[' + name + ']', min_debug + 1);
			this.forEach(function(style_name) {
				var value = this[style_name];
				library_namespace.debug('style "' + style_name + '" ['
						+ SGR_code.style_data[style_name] + '] = ('
						+ (typeof value) + ') [' + value + ']', min_debug + 1,
						'SGR_style.prototype.to_Array');
				if (style_name in color_shift) {
					if (typeof value === 'boolean')
						value = SGR_code.style_data[style_name]
						// 0: on, 1: off.
						[value ? 0 : 1];
					else if (value < color_shift[style_name])
						// 正常情况。
						value += color_shift[style_name];
					else if (isNaN(value))
						library_namespace.warn('Invalid ' + style_name
								+ ' color [' + value + ']');
				} else if (typeof value !== 'number')
					// 正常情况。
					value = SGR_code.style_data[style_name]
					// 0: on, 1: off.
					[value ? 0 : 1];
				if (typeof value === 'number')
					array.push(value);
				// else: e.g., reset.
			});
			library_namespace.debug('style array [' + array + ']',
					min_debug + 1, 'SGR_style.prototype.to_Array');
			array.sort();
			library_namespace.debug('sorted style array [' + array + ']',
					min_debug, 'SGR_style.prototype.to_Array');
			return array;
		},
		// (): use default CSI
		// (false): No CSI
		toString : function(CSI, end_code) {
			var code = this.to_Array().join(SGR_code.separator);
			library_namespace.debug('code [' + code + ']', min_debug,
					'SGR_style.prototype.toString');
			// 假如有设定 .reset，那应该会有 '0'。
			// 否则代表是空的 style，此时不回传以避免被当作 reset。
			if (code && (CSI || CSI === undefined))
				code = (CSI || SGR_code.CSI) + code
						+ (end_code || SGR_code.end_code);
			return code;
		}
	});

	// -------------------------------------------------------------

	/**
	 * cf. String.prototype.split ( separator, limit )
	 * 
	 * @returns [ {SGR_code} ]
	 */
	function SGR_split(separator, limit) {
		// TODO
		throw new Error('SGR_split: Not Yet Implemented!');
	}

	/**
	 * cf. String.prototype.slice ( start, end )
	 * 
	 * @returns {SGR_code}
	 */
	function SGR_slice() {
		var result = new SGR_code(this.text.split(start, end));
		result.style = this.style.split(start, end);
		result.style.forEach(function(style, index) {
			result[index] = result[index].clone();
		});
		return result;
	}

	/**
	 * 会改变 (this)!<br />
	 * cf. Array.prototype.concat ( ...arguments )
	 * 
	 * @param {String|SGR_code}value
	 * 
	 * @returns {SGR_code} (this)
	 */
	function SGR_concat(value) {
		var index = 0, length = argument.length,
		//
		text_list = [ this.text ], value;
		for (; index < length; index++)
			if (is_SGR_code(value = argument[index])) {
				// treat as {SGR_code}
				text_list = text_list.join('');
				this.style.forEach(function(style, index) {
					this.style[text_list.length + index] = style;
				}, this);
				text_list = [ text_list, value.text ];
			} else if (value)
				// treat as {String}
				text_list.push(value);
		this.text = text_list.join('');
		return this;
	}

	/**
	 * parse styled text.
	 * 
	 * @param {String}styled_text
	 *            text with style
	 * @param {Object}[options]
	 *            options : { CSI : '' }
	 * 
	 * @returns {Array} [ text, style ]
	 */
	function SGR_parse(styled_text, options) {
		// console.log('to_RegExp_pattern: ' + typeof to_RegExp_pattern);
		// console.log('to_RegExp_pattern: ' + to_RegExp_pattern);
		var text_now = '', style = [], matched, lastIndex = 0,
		// 
		pattern = new RegExp(to_RegExp_pattern(options.CSI || SGR_code.CSI)
				+ '([\\d{1,3}\\s\\' + (options.separator || SGR_code.separator)
				+ ']*)'
				+ to_RegExp_pattern(options.end_code || SGR_code.end_code), 'g');

		while (matched = pattern.exec(styled_text)) {
			library_namespace.debug(matched.join(), min_debug, 'SGR_parse');
			text_now += styled_text.slice(lastIndex, matched.index);
			style[text_now.length] = new SGR_style(matched[1] || 0);
			lastIndex = pattern.lastIndex;
		}

		return [ text_now + styled_text.slice(lastIndex), style ];
	}

	/**
	 * parse text token with style.
	 * 
	 * @param {Array}text_Array
	 *            text token and style.<br /> [ {String}text, {Object}style,
	 *            {String}text, .. ]<br />
	 *            预设 [0] 为 text，之后 style, text, style, ... 交替
	 * @param {Object}[options]
	 *            options : { CSI : '' }
	 * 
	 * @returns {Array} [ text, style ]
	 */
	function SGR_parse_list(text_Array, options) {
		var text_now = '', style = [],
		//
		index = 0, length = text_Array.length, text_length;

		for (; index < length; index++) {
			if (typeof text_Array[index] !== 'object')
				text_now += text_Array[index++];
			if (index < length)
				if (style[text_length = text_now.length])
					style[text_length].add(text_Array[index]);
				else
					style[text_length] = new SGR_style(text_Array[index]);
		}

		return [ text_now, style ];
	}

	/**
	 * get / set SGR style.
	 * 
	 * @param {integer}index
	 *            index of text
	 * @param {Object|String|Boolean}[style]
	 *            the style to set.<br />
	 *            undefined: 从头遍历，取得某一 index 的 style。比起 `true` 取得的更准确。<br />
	 *            0: reset style (e.g., normal color)<br />
	 *            null: remove style<br />
	 *            true: 单纯取得某一 index 的 style，不从头遍历。如此取得的可能是错误的 style。<br />
	 *            others: 设定 style。
	 * @param {integer}[to_index]
	 * 
	 * @returns {SGR_style}
	 */
	function SGR_style_at(index, style, to_index) {
		index |= 0;
		if (style === null) {
			// e.g., .style_at(index, null)
			delete this.style[index];
			return;
		}

		if (style === true) {
			// e.g., .style_at(index, true)
			return this.style[index];
		}

		var style_now;
		// 从头遍历。
		library_namespace.debug('Start traversing to ' + index, min_debug,
				'SGR_style_at');
		this.style.some(function(this_style, this_index) {
			if (this_index > index)
				return true;

			library_namespace.debug('Traversing to index ' + this_index,
					min_debug + 1, 'SGR_style_at');
			if (style_now) {
				// TODO: reduce. 决定最短显示法。
				style_now.add(this_style);
			} else
				style_now = this_style.clone();
		});

		if (!style_now)
			style_now = new SGR_style();

		if (style) {
			// 设定
			library_namespace.debug('Set style of "' + this.text + '"[' + index
					+ '] = [' + style + ']', min_debug, 'SGR_style_at');
			if (!this.style[index])
				this.style[index] = style_now;
			style_now.add(style = new SGR_style(style));

			library_namespace
					.debug('Set `to_index`', min_debug, 'SGR_style_at');
			if (index < to_index) {
				// TODO: 更有效率点。
				while (index < to_index)
					if (this.style[index]) {
						var inter_style = this.style[index];
						delete inter_style.reset;
						style.forEach(function(style_name) {
							// 覆写设定。
							delete inter_style[style_name];
						})
					}
			}
		} else if (is_reset_style(style)) {
			this.style[index] = style_now.add(0);
		} else {
			// e.g., .style_at(index)
		}

		return style_now;
	}

	/**
	 * get full stylied String.
	 * 
	 * @param {Boolean}[get_Array]
	 *            get Array, else String.
	 * 
	 * @returns {String}
	 */
	function SGR_style_toString(get_Array) {
		var sequence = this.text.split('');
		this.style.forEach(function(style, index) {
			sequence[index] = style.toString()
			// 在最后一个 item 时可能只剩 style。
			+ (sequence[index] || '');
		}, this);
		return get_Array ? sequence : sequence.join('');
	}

	/**
	 * 测试 value 是否为 SGR_code instance。
	 * 
	 * @param value
	 *            测试值。
	 * 
	 * @returns {Boolean} 测试值为 SGR_code instance
	 */
	function is_SGR_code(value) {
		return value instanceof SGR_code;
	}

	// -------------------------------------------------------------

	/**
	 * ANSI escape code (or escape sequences) Class
	 * 
	 * @param {String|Array}text
	 *            text / text token
	 * @param {Object}[options]
	 *            options : { CSI : '' }
	 * 
	 * @see <a href="https://en.wikipedia.org/wiki/ANSI_escape_code#graphics"
	 *      accessdate="2015/3/1 8:1" title="ANSI escape code (or escape
	 *      sequences)"><span title="Select Graphic Rendition">SGR</span>
	 *      parameters</a><br />
	 *      <a href="http://vt100.net/docs/vt510-rm/SGR" accessdate="2015/3/1
	 *      8:1">SGR—Select Graphic Rendition</a>
	 */
	function SGR_code(text, options) {
		if (false)
			if (typeof options === 'string')
				options = {
					CSI : options
				};

		if (false) {
			console.trace([ text, library_namespace.is_Object(text), options,
					library_namespace.is_Object(options) ]);
		}
		if (library_namespace.is_Object(text) && !options) {
			// 把 text 当作 options。
			options = text;
			text = null;
		}

		if (library_namespace.is_Object(options))
			this.options = options;

		options = Array.isArray(text) ? SGR_parse_list(text, options
				|| Object.create(null))
		// String(): 标准化 / normalization
		: SGR_parse(String(text), options || Object.create(null));

		this.text = options[0];

		// {inner}private properties
		// this.style[ index ] = new SGR_style();
		this.style = options[1];
	}

	Object.assign(SGR_code.prototype, {
		// SGR_style_to_HTML(style_mapping)
		// to_HTML : SGR_style_to_HTML,

		// style : SGR_style,
		slice : SGR_slice,
		// split : SGR_split,
		concat : SGR_concat,
		// TODO:
		// splice : SGR_splice,
		// chunk : SGR_chunk,

		style_at : SGR_style_at,
		// toJSON : SGR_style_toString,
		toString : SGR_style_toString
	});

	/**
	 * ECMA-48 8.3.117 SGR - SELECT GRAPHIC RENDITION<br />
	 * 为允许使用者参照，因此放在 public。<br />
	 * 注意: 一般论坛 (BBS) 使用 VT100，仅支援如 reset, bold, blink, reverse, foreground,
	 * background。
	 * 
	 * @type {Object}
	 */
	SGR_code.style_data = {
		// name : [ on, off ]
		// reset / normal
		reset : [ 0, ],
		// bold or increased intensity (bright / highlight / 高亮)
		bold : [ 1, 22 ],
		// faint, decreased intensity or second colour
		faint : [ 2, 22 ],
		// singly underlined (mono only)
		underline : [ 4, 24 ],
		// blink / 闪烁
		// 5: slowly blinking less then 150 per minute,
		// 6: rapidly blinking
		blink : [ 5, 25 ],
		// negative / positive image (反白, reverse type)
		reverse : [ 7, 27 ],
		// concealed characters (invisible image) 隐瞒,隐匿,隐蔽,隐藏来源
		conceal : [ 8, 28 ],
		// display (text color, foreground color, 文字部份前景色):
		// 30–37
		foreground : [ , library_namespace.platform.Windows
		// Windows console 不支援 39。(e.g. node.js 下)
		&& library_namespace.platform.nodejs ? 37 : 39 ],
		// background color (背景色 / 底色): 40–47
		background : [ , 49 ],
		// Overlined / Not overlined
		overline : [ 53, 55 ]
	};

	/**
	 * style name alias<br />
	 * 为允许使用者添增，因此放在 public。
	 */
	SGR_code.style_name_alias = {
		normal : 'reset',
		bright : 'bold',
		highlight : 'bold',
		hidden : 'conceal',
		text : 'foreground',
		color : 'foreground',
		fg : 'foreground',
		bg : 'background'
	};

	/**
	 * 添增 color name alias。
	 * 
	 * @example <code>

	// 使设定格式时，可使用中文颜色名称。
	CeL.interact.console.SGR.add_color_alias('黑红绿黄蓝紫青白'.split(''));

	 * </code>
	 * 
	 * @param {Array}color_list
	 *            color name list
	 */
	function add_color_alias(color_list) {
		if (Array.isArray(color_list)) {
			color_list.forEach(function(color, index) {
				SGR_code.color_index[color] = index;
			});
		}
	}

	/**
	 * style value alias: style_value_alias[alias] = normalized<br />
	 * 为允许使用者添增，因此放在 public。
	 */
	SGR_code.style_value_alias = Object.create(null);
	// SGR_code.color_index.black = 0
	SGR_code.color_index = Object.create(null);
	SGR_code.color = 'black,red,green,yellow,blue,magenta,cyan,white'
			.split(',');
	// 锁定物件。
	Object.seal(SGR_code.color);
	add_color_alias(SGR_code.color);

	// 一些初始设定。

	// alias of number
	(function() {
		for ( var property in SGR_code.style_data) {
			var value = SGR_code.style_data[property];
			if (typeof value[0] === 'number')
				SGR_code.style_value_alias[value[0]] = '+' + property;
			if (typeof value[1] === 'number')
				SGR_code.style_value_alias[value[1]] = '-' + property;
		}
	})();
	// 锁定物件。
	Object.seal(SGR_code.style_data);

	Object.assign(SGR_code, {
		min_debug_level : min_debug,
		add_color_alias : add_color_alias,
		/**
		 * {String} Control Sequence Introducer, or Control Sequence Initiator.<br />
		 * "\x1b" : [Esc]<br />
		 * some 论坛 (BBS): 按 Esc 两次, '\x1b\x1b['。
		 * 
		 * @see https://en.wikipedia.org/wiki/ANSI_escape_code#Sequence_elements
		 */
		CSI : '\x1b[',
		// do not modify this value!
		default_CSI : '\x1b[',
		separator : ';',
		end_code : 'm',

		is_SGR : is_SGR_code
	});

	// export
	_.SGR = SGR_code;
	_.SGR_style = SGR_style;

	if (false) {
		var SGR_style = CeL.interact.console.SGR_style;
		console.log('Showing ' + (new SGR_style('fg=blue')).toString() + 'blue'
				+ (new SGR_style({
					reset : true
				})).toString() + ' text');

		// for SGR: @see test.js
	}

	// ----------------------------------------------------------------------------------------------------------------

	function console_status() {
		return {
			// size. 注意: 这两个值可能会被覆写。
			width : process.stdout.columns || 80,
			height : process.stdout.rows || 25
		};
	}

	_.console_status = console_status;

	// ----------------------------------------------------------------------------------------------------------------
	// CLI progress bar

	// https://github.com/visionmedia/node-progress
	// https://github.com/bubkoo/ascii-progress
	// https://github.com/AndiDittrich/Node.CLI-Progress
	function Progress_bar(max_value, options) {
		if (max_value > 0)
			this.max_value = max_value;
		this.start_time = Date.now();
		if (options) {
			Object.assign(this, options);
			if (this.rtl && !options.start_quote && !options.end_quote) {
				var quote = this.end_quote;
				this.end_quote = this.start_quote;
				this.start_quote = quote;
			}
		}
	}

	_.Progress_bar = Progress_bar;

	Progress_bar.prototype = {
		progress_value : 0,
		max_value : 1,
		// 方向 direction
		rtl : false,

		start_quote : ' [',
		end_quote : '] ',
		use_quote : true,

		// single character
		filled : '=',
		blank : ' ',
		show : show_progress,
		tick : tick_progress,

		// schema. TODO
		format : '\r%{pre_text}%{start_quote}%{bar}%{end_quote}%{post_text}'
	}

	function show_progress(progress_value, post_text, pre_text) {
		var max_dots = this.bar_width;
		if (!max_dots) {
			// - 1: 预防显示到最后一个字元，会自动跳行。
			max_dots = console_status().width - 1;
		}
		max_dots |= 0;
		if (this.pre_text)
			max_dots -= this.pre_text.length;
		if (this.post_text)
			max_dots -= this.post_text.length;
		if (this.use_quote) {
			max_dots -= this.left_quote.length + this.right_quote.length;
		}

		// current progress value
		this.progress_value = +progress_value || 0;
		this.percentage = Math
				.round(100 * this.progress_value / this.max_value)
				+ '%';
		// TODO: .eta
		this.completed = this.progress_value >= this.max_value;
		var progress_dots = Math.round(max_dots * this.progress_value
				/ this.max_value);

		var bar_text = [ this.pre_text || '',
				this.use_quote && this.start_quote || '',
				this.filled.repeat(progress_dots),
				this.blank.repeat(max_dots - progress_dots),
				this.use_quote && this.end_quote || '',
				// suffix
				this.post_text || '' ];
		if (this.rtl) {
			bar_text.reverse();
		}
		library_namespace.log_temporary(bar_text.join('\n'));
	}

	function tick_progress(delta, post_text, pre_text) {
		this.show(this.progress_value + delta, post_text, pre_text);
	}

	return (_// JSDT:_module_
	);
}
