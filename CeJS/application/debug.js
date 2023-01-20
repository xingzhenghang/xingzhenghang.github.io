/**
 * @name CeL function for debug
 * @fileoverview 本档案包含了 debug 用的 functions。
 * @since
 * @see http://code.google.com/apis/ajax/playground/
 */

'use strict';

// --------------------------------------------------------------------------------------------

// 不采用 if 陈述式，可以避免 Eclipse JSDoc 与 format 多缩排一层。
typeof CeL === 'function' && CeL.run({
	// module name
	name : 'application.debug',

	require : 'data.code.compatibility.|interact.DOM.',

	// 设定不汇出的子函式。
	// 'log': 为预防覆写基底之 log 而加。
	no_extend : 'this,log',

	// 为了方便格式化程式码，因此将 module 函式主体另外抽出。
	code : module_code
});

function module_code(library_namespace) {

	// JSalert[generateCode.dLK]='getScriptName';
	// ,*var ScriptName=getScriptName();
	/**
	 * 显示讯息视窗<br />
	 * alert() 改用VBScript的MsgBox可产生更多效果，但NS不支援的样子。
	 * 
	 * @param message
	 *            message or object
	 * @param {Number}
	 *            [wait] the maximum length of time (in seconds) you want the
	 *            pop-up message box displayed.
	 * @param {String}
	 *            [title] title of the pop-up message box.
	 * @param {Number}
	 *            [type] type of buttons and icons you want in the pop-up
	 *            message box.
	 * @return {Integer} number of the button the user clicked to dismiss the
	 *         message box.
	 * @requires CeL.get_script_name
	 * @see <a
	 *      href="http://msdn.microsoft.com/library/en-us/script56/html/wsmthpopup.asp">Popup
	 *      Method</a>
	 * @_memberOf _module_
	 */
	function JSalert(message, wait, title, type) {
		var _f = arguments.callee;
		if (typeof _f.cmd === 'undefined') // 控制是否弹跳出视窗
			_f.cmd = typeof WScript === 'object'
					&& /cscript\.exe$/i.test(WScript.FullName);

		// if(!message)message+='';
		// if(typeof message==='undefined')message='';else
		// if(!message)message+='';

		// 有时传入如message==null会造成error
		// WScript.Echo()会视情况：视窗执行时弹跳出视窗，cmd执行时直接显示。但需要用cscript执行时才有效果。
		// http://www.microsoft.com/technet/scriptcenter/guide/sas_wsh_mokz.mspx
		// 可以用 WScript.Echo(t1,t2,..)，中间会以' '间隔
		if (_f.cmd && argument.length < 2)
			return WScript.Echo(message);

		if (!title &&
		// typeof getScriptName === 'function'
		this.get_script_name)
			title = getScriptName();

		if (isNaN(type))// typeof type!=='number'
			type = 64;

		if (false && typeof WshShell != 'object')
			if (typeof WScript === 'object')
				WshShell = WScript.CreateObject("WScript.Shell");
			else
				return undefined;

		if (this.WshShell !== 'object')
			if (typeof WScript === 'object')
				this.WshShell = WScript.CreateObject("WScript.Shell");
			else
				return undefined;

		return this.WshShell.Popup(
		// ''+message: 会出现 typeof message==='object' 却不能显示的
		'' + message, wait, title, type);
	}

	// ---------------------------------------------------------------------//

	// popup object Error(错误)
	// popErr[generateCode.dLK]='JSalert,setTool,parse_Function';
	// error object, title, additional text(etc. function name)
	function popErr(e, t, f) {
		var T = typeof e;
		if (false)
			alert((T == 'object') + ',' + (e.constructor) + ',' + (Error) + ','
					+ (e instanceof Error));
		// 这里e instanceof Error若是T=='object'&&e.constructor==Error有时不能达到效果！
		// use: for(i in e)
		T = e instanceof Error ? 'Error '
				+ (e.number & 0xFFFF)
				+ (e.name ? ' [' + e.name + ']' : '')
				+ ' (facility code '
				+ (e.number >> 16 & 0x1FFF)
				+ '):\n'
				+ e.description
				+ (!e.message || e.message === e.description ? '' : '\n\n'
						+ e.message) : !e || T === 'string' ? e : '(' + T + ')'
				+ e;
		f = f ? ('' + f).replace(/\0/g, '\\0') + '\n\n' + T : T;
		// .caller只在执行期间有效。_function_self_.caller可用 arguments.callee.caller
		// 代替，却不能用arguments.caller
		// arguments.callee.caller 被弃用了。
		// http://www.opera.com/docs/specs/js/ecma/
		// http://bytes.com/forum/thread761008.html
		// http://www.javaeye.com/post/602661
		// http://groups.google.com/group/comp.lang.javascript/browse_thread/thread/cd3d6d6abcdd048b
		if (typeof WshShell === 'object')
			WshShell.Popup(f, 0, t || 'Error '
			//
			+ (arguments.callee.caller === null ? 'from the top level'
			//
			: 'on ' + (typeof parse_Function == 'function'
			//
			? parse_Function(arguments.callee.caller).funcName
			//
			: 'function')) + ' of ' + ScriptName, 16);
		else
			alert(f);
		return T;
	}

	// ---------------------------------------------------------------------//

	var show_value_max_length = 80, toString = Object.prototype.toString;

	function show_value_get_type(value) {
		var type = toString.call(value), _type;
		if (type === '[object Object]')
			try {
				// test DOM.
				if (/^\[[^]]+\]$/.test(_type = '' + value))
					return _type;
			} catch (e) {
			}
		return type || typeof value;
	}

	// show value[key]
	function show_value_single(key, value, filter, key_is_name) {
		var name, value_String, no_more, nodes = [];

		library_namespace.debug('add name', 3, 'show_value_single');
		if (key_is_name && key === undefined)
			name = '(null name)';
		else
			try {
				name = '' + key;
				nodes.push({
					span : name || '(null name)',
					S : name ? 'color:#a93;' : 'color:#888;'
				}, ': ');
				if (name)
					name = '[' + name + ']';
			} catch (e) {
				// no .toString()?
				// e.g., Object.create(null)
				name = '(error name)';
				nodes.push({
					span : '(error to get valuable name: ' + e.message + ')',
					S : 'color:#e32;'
				}, ': ');
			}

		if (!key_is_name)
			try {
				value = value[key];
			} catch (e) {
				value_String = true;
				nodes.push({
					span : '(error to get value of ' + name + ': ' + e.message
							+ ')',
					S : 'color:#e32;'
				});
			}

		if (!value_String)
			if (value === undefined || value === null)
				// 在 IE 中，typeof null, undefined === object。
				nodes.push({
					span : '(' + value + ')',
					S : 'color:#888;'
				});
			else if (typeof (no_more = show_value.type_handler
					.get(value_String = show_value_get_type(value))) !== 'function'
					|| no_more(value, nodes)) {
				library_namespace.debug('add type', 3, 'show_value_single');
				if (no_more = value_String.match(/^\[object ([^]]+)\]$/))
					no_more = (value_String = no_more[1]) in {
						// 这几种将作特殊处理。
						Object : 1,
						Array : 1,
						Function : 1
					} && !/^\s*function[\s(]/.test('' + value);

				nodes.push({
					span : value_String,
					S : 'color:#6a3;'
				});
				try {
					if (!isNaN(value.length))
						nodes.push('[' + value.length + ']');
				} catch (e) {
				}

				library_namespace.debug('add value', 3, 'show_value_single');
				try {
					// 为特殊值作特殊处理。
					if (no_more) {
						var is_Array = value_String === 'Array', val, full_listed;
						value_String = is_Array ? '[ ' : '{ ';
						for (key in value)
							try {
								if (Object.hasOwn(value, key)) {
									if (!is_Array)
										value_String += '' + key;
									if ((val = '' + value[key]).length < 9) {
										if (!is_Array)
											value_String += ':';
										value_String += val;
									}
									// value_String += '<span
									// style="color:#a42;">|</span>';
									value_String += ', ';
									full_listed = true;
								}

								if (value_String.length >= show_value_max_length) {
									value_String += ' .. ';
									full_listed = false;
									break;
								}

							} catch (e) {
							}

						prototype = null;
						if (full_listed)
							value_String = value_String.slice(0, -2);
						value_String += (is_Array ? ' ]' : ' }');
						// no_more = true;

					} else
						no_more = (value_String = '' + value).length < show_value_max_length;

					key = (no_more ? value_String : value_String.slice(0,
							show_value_max_length)).replace(/</g, '&lt;')
					// .replace(/\t/g, ' ')
					;
					value_String = value_String ? 'color:#33a;' : 'color:#888;';
					key = typeof value in {
						number : 1,
						string : 1,
						'boolean' : 1
					} ? {
						// 对于没有 children property/method/member 的，例如纯量，则不显示深入连结。
						span : key ? [
								'[',
								library_namespace.is_negative_zero(value) ? '-0'
										: key, ']' ]
								: '(blank)',
						R : no_more ? '' : '' + value,
						S : value_String
					}
							: {
								a : key,
								S : value_String,
								href : '#',
								onclick : function() {
									show_value_children.call(this, value,
											filter);
									return false;
								}
							};
					nodes.push(' ', key, no_more ? '' : '..');
				} catch (e) {
					nodes.push(' error on stringify value'
							+ (key_is_name ? '' : ' of ' + name) + ': '
							+ e.message);
				}
			}

		try {
			return nodes;
		} finally {
			// Release memory. 释放被占用的记忆体.
			key = name = value_String = no_more = nodes = null;
		}
	}

	var RegExp_properties = 'lastIndex,source'.split(',');
	(function() {
		var r = /./;
		// RegExp_flags @ data.code.compatibility
		for ( var flag in library_namespace.RegExp_flags.flags)
			if (typeof r[flag] === 'boolean')
				RegExp_properties.push(flag);
	})();

	function show_value_children(value, filter) {
		var key, nodes = [], parent = this.parentNode, proto, length;
		if (parent.childNodes.length > 1
				&& parent.lastChild.className === 'show_value_block') {
			key = parent.lastChild.style;
			// toggle
			key.display = key.display === 'none' ? '' : 'none';
			return;
		}

		try {
			length = value && value.length;
		} catch (e) {
			library_namespace.warn('show_value_children: ' + e.message);
		}

		try {
			proto = [];
			for (key in value) {
				if (length && (key === '0' || key === 0))
					// 代表已经遍历过。
					length = 0;
				if (!filter || filter.test(key))
					(Object.hasOwn(value, key) ? nodes : proto).push({
						div : show_value_single(key, value, filter),
						S : 'margin-left:1em;'
					});
			}

			if (library_namespace.is_RegExp(value))
				// RegExp 有许多无法 enumerable 的 properties。
				RegExp_properties.forEach(function(key) {
					if (!filter || filter.test(key))
						nodes.push({
							div : show_value_single(key, value, filter),
							S : 'margin-left:1em;'
						});
				});

		} catch (e) {
			library_namespace.warn('show_value_children: ' + e.message);
		}

		if (isNaN(length) || length > 0)
			try {
				// 处理 childNodes[] 之类。
				for (key = 0; key < length || value[key] !== undefined; key++)
					if (!filter || filter.test(key)) {
						nodes.push({
							div : show_value_single(key, value, filter),
							S : 'margin-left:1em;'
						});
					}
			} catch (e) {
				library_namespace.warn('show_value_children: ' + e.message);
			}

		if (proto && proto.length > 0) {
			nodes.push({
				a : 'inherited:',
				href : '#',
				S : 'margin-left:1em;',
				onclick : function() {
					var style = this.nextSibling.style;
					style.display = style.display === 'none' ? '' : 'none';
					return false;
				}
			}, {
				div : proto,
				S : nodes.length > 0 ? 'display:none;' : ''
			});
		}
		nodes = {
			div : nodes.length > 0 ? nodes : '(no properties)',
			C : 'show_value_block',
			S : nodes.length > 0 ? '' : 'color:#888;'
		};
		library_namespace.new_node(nodes, [ parent, 2 ]);

		// key = value = nodes = parent = proto = null;
	}

	var has_native_log = typeof console === 'object'
			&& library_namespace.is_native_Function(console.log);

	/**
	 * debug 用: Show contents of object/class.<br />
	 * 
	 * TODO: update, paging + real-time search
	 * 
	 * @see <a href="http://fillano.blog.ithome.com.tw/post/257/59403"
	 *      accessdate="2013/1/19 16:11" title="Fillano's Learning Notes |
	 *      在Javascript中使用Reflection与Proxy
	 *      Pattern实作AOP">一些内建的物件，他的属性可能会是[[DontEnum]]，也就是不可列举的，而自订的物件在下一版的ECMA-262中，也可以这样设定他的属性。</a>
	 */
	function show_value(object, name, filter) {
		if (has_native_log) {
			// if (name) console.log(name + ':');
			// console.log(object);
			return;
		}
		if (name === undefined && typeof object !== 'object'
				&& typeof object !== 'function')
			try {
				name = '' + object;
			} catch (e) {
			}

		library_namespace.log([ 'show_value: ',
				show_value_single(name, object, filter, true) ]);
	}

	// function() return true: 继续处理。
	show_value.type_handler = new Map;

	// show_value(1);
	if (false)
		show_value({
			test_null : null,
			test_undefined : undefined,
			test_Boolean_true : true,
			test_Boolean_false : false,
			test_Number : 43.2,
			test_String : 'a string',
			test_Array : [ -34.3, 'a\\f', {
				r : 4,
				w : {
					a : 5
				}
			} ],
			test_Object : {
				l : {
					e : 3
				},
				r : 5
			}
		});

	return [ JSalert, popErr, show_value ];
}
