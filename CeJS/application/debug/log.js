/**
 * @name	CeL log function
 * @fileoverview
 * 本档案包含了记录用 functions。
 * 
 * @since	2009/11/17
 * @see
 * <a href="http://getfirebug.com/lite.html" accessdate="2010/1/1 14:54">Firebug Lite</a>,
 * <a href="http://www.mozilla.org/projects/venkman/" accessdate="2010/1/1 16:43">Venkman JavaScript Debugger project page</a>
 */

//	http://blogs.msdn.com/b/webdevtools/archive/2007/03/02/jscript-intellisense-in-orcas.aspx
///	<reference path="../../ce.js" />
/**
 * <code>
 TODO:
 https://developers.google.com/web/tools/chrome-devtools/console/console-write#styling_console_output_with_css
 console.log("%c", 将 CSS 样式规则应用到第二个参数指定的输出字符串)


 emergency/urgent situation alert
 会尽量以网页上方/顶部黄色的导航条/警告条展示
 「不再显示」功能
 .format()
 将 div format 成 log panel。
 分群, http://developer.yahoo.com/yui/examples/uploader/uploader-simple-button.html
 </code>
 */

/**
 * <code>
 to include:
 include code_for_including
 <div id="debug_panel"></div>
 var SL = new Debug.log('debug_panel'), sl = function() { SL.log.apply(SL, arguments); }, error = function() { SL.error.apply(SL, arguments); }, warn = function() { SL.warn.apply(SL, arguments); };

 http://www.comsharp.com/GetKnowledge/zh-CN/TeamBlogTimothyPage_K742.aspx

 if possible, use Firebug Lite instead.
 http://benalman.com/projects/javascript-debug-console-log/
 </code>
 */

'use strict';

// --------------------------------------------------------------------------------------------

// 不采用 if 陈述式，可以避免 Eclipse JSDoc 与 format 多缩排一层。
typeof CeL === 'function' && CeL.run({
	// module name
	name : 'application.debug.log',

	// Object.is()
	require : 'data.code.compatibility.',

	// 设定不汇出的子函式。
	no_extend : 'this,do_log,extend',

	// 为了方便格式化程式码，因此将 module 函式主体另外抽出。
	code : module_code,

	finish : finish
});

function module_code(library_namespace) {

	// WScript.Echo(this);

	var

	// class private -----------------------------------

	// class name, 需要用到这个都不是好方法。
	// cn = 'Debug.log',

	/**
	 * private storage pool
	 * 
	 * @ignore
	 */
	p = [],
	//
	has_performance_now,
	//
	log_data = function(message, options) {
		// 由于 .set_method() 会用到 .debug()，
		// 若在 log 的 core 中用上 .set_method() 会循环呼叫，造成 stack overflow。
		// ** NG: library_namespace.set_method(this, options);
		if (library_namespace.is_Object(options))
			Object.assign(this, options);

		this.date = new Date();
		if (has_performance_now)
			this.time = performance.now();
		this.message = message;
		return this;
	},

	/**
	 * default write/show log function
	 * 
	 * @ignore
	 * @param {string}id
	 *            element id
	 */
	write_log = function(id) {
		// console.log(id);
		var o, m, c, _p = p[id], _t = _p.instance,
		/**
		 * buffer
		 * 
		 * @inner
		 * @ignore
		 */
		b = _p.buf, B = _p.board, F = _p.do_function, level;

		if (_p.clean)
			_t.clear(), _p.clean = 0;

		if (!B && !F)
			return;

		while (b.length) {
			// 预防 multi-threading 时重复显示。
			m = b.shift();

			if (F)
				F(m);

			// IE8: 'constructor' 是 null 或不是一个物件
			try {
				c = m.constructor;
				if (false)
					alert((m.constructor === log_data) + '\n' + m.constructor
							+ '\n' + m);
			} catch (e) {
			}
			if (c === log_data) {
				if (!isNaN(m.level) && m.level < library_namespace.set_debug())
					continue;
				c = m.level in _t.className_set ? m.level : 0;
				o = m.add_class;
				// 添加各种标记。
				m = [ _t.message_prefix(c), _t.show_time(m.date, m.time),
						m.message ];
				c = _t.className_set[c];
				if (o)
					c += ' ' + o;

			} else {
				// add default style set
				if (c = _t.message_prefix('log'))
					m = [ c, m ];
				c = _t.className_set.log || 0;
			}
			_p.lbuf.push(m);

			if (B
			// && typeof document === 'object'
			) {
				o = _p.instance.log_tag;
				if (o) {
					o = document.createElement(o);
					if (c)
						o.className = c;

					new_node(m, o);

				} else {
					o = document.createTextNode(m);
				}
				// TODO: pause
				B.appendChild(o);
				while (B.childNodes.length > _p.max_logs) {
					B.removeChild(B.firstChild);
				}
			}
		}

		if (false) {
			if (_t.auto_hide)
				B.style.display = B.innerHTML ? 'block' : 'none';
		}
		// TODO: 有时无法卷到最新。
		if (B && _t.auto_scroll)
			B.scrollTop = B.scrollHeight - B.clientHeight;
	},

	/**
	 * save log.
	 * 
	 * @ignore
	 * @param m
	 *            message
	 * @param {string}
	 *            id element id
	 * @param force
	 *            force to clean the message area
	 */
	do_save_log = function(m, id, force) {
		// console.log(m);
		var _p = p[id], _t = _p.instance,
		// log file handler
		f = _p.logF, s = _t.save_log;
		if (!s || typeof s === 'function' && !s(m, l))
			return;

		if (m)
			_p.sbuf
					.push(m = (_t.save_date && typeof gDate === 'function' ? _t.save_line_separator
							+ gDate() + _t.save_line_separator
							: '')
							+ m);

		if (force || _t.flush || _p.sbufL > _t.save_limit)
			try {
				if (f
						|| _t.log_file
						&& (f = _p.logF = fso.OpenTextFile(_t.log_file,
						/* ForAppending */8, /* create */true,
								_t.log_encoding)))
					f.Write(_p.sbuf.join(_t.save_line_separator)),
							_p.sbuf = [], _p.sbufL = 0, _t.error_message = 0;
			} catch (e) {
				// error(e);
				_t.error_message = e;
			}
		else if (m)
			_p.sbufL += m.length;
	},

	using_DOM_new_node = false,
	// 使 log 能用到 new_node 的功能。
	// @see function_placeholder() @ module.js
	new_node = function(o, layer) {
		// console.log(o);
		if (library_namespace.is_Function(library_namespace.new_node)) {
			// alert('开始利用 library 之 new_node。');
			using_DOM_new_node = true;
			return (new_node = library_namespace.new_node)(o, layer);
		}

		var list = [];

		// workaround: 简易版 new_node().
		(function add(o) {
			var node, tag, child;
			if (Array.isArray(o))
				for (node = 0; node < o.length; node++)
					add(o[node]);
			else if (library_namespace.is_Object(o)) {
				if (o.$) {
					tag = o.$;
					list.push('<' + tag);
					delete o.$;
				}
				for (node in o) {
					if (tag)
						list.push(' ' + node + '="'
								+ ('' + o[node]).replace(/"/g, '&quot;') + '"');
					else {
						tag = node;
						list.push('<' + tag);
						child = o[node] || null;
					}
				}
				if (child === null)
					list.push(' />');
				else {
					list.push('>');
					add(child);
					list.push('</' + tag + '>');
				}
			} else
				list.push(o);
		})(o);

		layer.innerHTML = list.join('');

		return using_DOM_new_node;
	},

	show_date = function(date) {
		var h = date.getHours(), m = date.getMinutes(), s = date.getSeconds(), ms = date
				.getMilliseconds();
		return (h || m || s ? (h || m ? (h ? h + ':' : '') + m + ':' : '') + s
				: '')
				+ '.' + (ms > 99 ? '' : ms > 9 ? '0' : '00') + ms;
	},

	has_caller,

	// instance constructor ---------------------------
	// (document object)
	/**
	 * <code>

	_ = this


	TODO:
	set class in each input
	input array
	show file path & directory functional	可从 FSO operation.hta 移植。

	count
	c.f.: GLog

	dependency:

	</code>
	 */
	/**
	 * initial a log tool's instance/object
	 * 
	 * @class log function
	 * @_see usage: <a href="#.extend">_module_.extend</a>
	 * @since 2008/8/20 23:9:48
	 * @requires gDate(),line_separator,fso
	 * 
	 * @constructor
	 * @_name _module_
	 * @param {String|object
	 *            HTMLElement} obj log target: message area element or id
	 * @param {Object}
	 *            [className_set] class name set
	 */
	_// JSDT:_tmp;_module_
	= function(obj, className_set) {
		// Initial instance object. You can set it yourself.
		/**
		 * log 时 warning/error message 之 className
		 * 
		 * @_name _module_.prototype.className_set
		 */
		this.className_set = className_set || {
			/**
			 * @_description 当呼叫 {@link _module_.prototype.log} 时使用的 className,
			 *               DEFAULT className.
			 * @_name _module_.prototype.className_set.log
			 */
			log : 'debug_log',
			/**
			 * @_description 当呼叫 {@link _module_.prototype.warn} 时使用的 className
			 * @_name _module_.prototype.className_set.warn
			 */
			warn : 'debug_warn',
			/**
			 * @_description 当呼叫 {@link _module_.prototype.error} 时使用的 className
			 * @_name _module_.prototype.className_set.error
			 */
			error : 'debug_error',
			/**
			 * @_description 当显示时间时使用的 className
			 * @_name _module_.prototype.className_set.time
			 */
			time : 'debug_time',
			/**
			 * @_description 当呼叫 {@link _module_.prototype.set_board} 时设定 log
			 *               panel 使用的 className
			 * @_name _module_.prototype.className_set.panel
			 */
			panel : 'debug_panel'
		};
		this.class_hide = {};

		var prefix = {
			/**
			 * @_description 当呼叫 {@link _module_.prototype.log} 时使用的 prefix,
			 *               DEFAULT prefix.
			 * @_name _module_.prototype.message_prefix.log
			 */
			log : '',
			/**
			 * @_description 当呼叫 {@link _module_.prototype.warn} 时使用的 prefix
			 * @_name _module_.prototype.message_prefix.warn
			 */
			warn : '',
			/**
			 * @_description 表示当呼叫 {@link _module_.prototype.error}, 是错误 error
			 *               message 时使用的 prefix
			 * @_name _module_.prototype.message_prefix.error
			 */
			error : '<em>!! Error !!</em> '
		};
		/**
		 * log 时 warning/error message 之 prefix。
		 * 
		 * @_name _module_.prototype.message_prefix
		 */
		this.message_prefix = function(level) {
			return level in prefix ? prefix[level] : '';
		};

		this.id = p.length;
		p.push({
			instance : this,
			/** write buffer */
			buf : [],
			/** save buffer when we need to save the messages */
			sbuf : [],
			/** length of save buffer */
			sbufL : 0,
			/** now logged buffer */
			lbuf : []
		});
		this.set_board(obj);
	};

	try {
		has_performance_now = performance.now() > 0;
	} catch (e) {
	}

	try {
		has_caller = function(a) {
			'use strict';
			return arguments.callee.caller !== undefined;
		};
		has_caller = (function() {
			return has_caller();
		})();
	} catch (e) {
		has_caller = false;
	}

	// class public interface ---------------------------

	_// JSDT:_module_
	.
	/**
	 * do the log action
	 * 
	 * @_memberOf _module_
	 * @private
	 */
	do_log = function(id) {
		/**
		 * <code>

		这段应该只在 module namespace 重复定义时才会发生

		var I = p[id];
		if (!I) {
			alert('.do_log: not exist: [' + id + ']');
			return;
		}
		I = I.instance;
		</code>
		 */

		var I = p[id].instance;
		if (I.do_log)
			I.do_log();
	};

	_// JSDT:_module_
	.
	/**
	 * 对各种不同 error object 作应对，获得可理解的 error message。
	 * 
	 * @param e
	 *            error object
	 * @param line_separator
	 *            line separator
	 * @param caller
	 *            function caller
	 * @_memberOf _module_
	 * @see http://msdn.microsoft.com/en-us/library/ms976144.aspx The facility
	 *      code establishes who originated the error. For example, all internal
	 *      script engine errors generated by the JScript engine have a facility
	 *      code of "A".
	 *      http://msdn.microsoft.com/en-us/library/ms690088(VS.85).aspx
	 * @see http://msdn.microsoft.com/en-us/library/t9zk6eay.aspx
	 *      http://msdn.microsoft.com/en-us/library/microsoft.jscript.errorobject.aspx
	 *      Specifies the name of the type of the error. Possible values include
	 *      Error, EvalError, RangeError, ReferenceError, SyntaxError,
	 *      TypeError, and URIError.
	 */
	get_error_message = function get_error_message(e, line_separator, caller) {
		if (!line_separator)
			line_separator = _.prototype.save_line_separator;

		if (!caller || typeof caller !== 'string') {
			if (typeof caller !== 'function' && has_caller)
				caller = get_error_message.caller;

			if (caller === null)
				caller = 'from the top level';
			else if (typeof caller === 'function')
				caller = '@'
						+ (library_namespace.get_function_name(caller) || caller);
			else
				caller = '@' + library_namespace.Class;
		}

		// from popErr()
		// type
		var T = library_namespace.is_type(e),
		// message
		m = T === 'Error' ? 'Error '
				+ caller
				+ ': '
				/**
				 * <code>
					http://msdn.microsoft.com/en-us/library/cc231198(PROT.10).aspx
					<a href="http://msdn.microsoft.com/en-us/library/ms819773.aspx">Winerror.h</a>: error code definitions for the Win32 API functions
					(e.number & 0xFFFF): See 错误代码 /错误提示码 <a href="http://msdn.microsoft.com/en-us/library/ms681381%28VS.85%29.aspx">System Error Codes</a>
					http://social.msdn.microsoft.com/Search/zh-TW/?Query=%22System+Error+Codes%22+740&AddEnglish=1
					http://msdn.microsoft.com/en-us/library/aa394559(VS.85).aspx
					net helpmsg (e.number & 0xFFFF)
				</code>
				 */
				+ (e.number & 0xFFFF)
				+ (e.name ? ' [' + e.name + '] ' : ' ')
				+ '(facility code '
				+ (e.number >> 16 & 0x1FFF)
				+ '): '
				+ line_separator
				+ (e.message || '').replace(/\r?\n/g, '<br />')
				// .message 为主，.description 是旧的。
				+ (!e.description || e.description === e.message ? ''
						: line_separator
								+ line_separator
								+ ('' + e.description).replace(/\r?\n/g,
										'<br />'))

		: T === 'DOMException' ?
		// http://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-17189187
		'[' + T + '] ' + e.code + ': ' + e.message
		//
		: !e || T === 'string' ? e
		//
		: '[' + T + '] ' + (e.message || e);

		if (library_namespace.is_debug(2) && typeof e === 'object' && e)
			for (T in e)
				try {
					// Firefox has (new Error).stack
					// http://eriwen.com/javascript/js-stack-trace/
					m += '<br /> <span class="debug_debug">'
							+ T
							+ '</span>: '
							+ (typeof e[T] === 'string' && T === 'stack' ? e[T]
									.replace(/[\r\n]+$/, '')
									.replace(/(@)([a-z\-]+:\/\/.+)(:)(\d+)$/gm,
											'$1<a href="view-source:$2#$4" target="_blank">$2</a>$3$4')
									.replace(/\n/g, '<br />- ')
									: typeof e[T] === 'string'
											&& T === 'fileName' ? '<a href="view-source:'
											+ e[T]
											+ '" target="_blank">'
											+ e[T] + '</a>'
											: e[T]);
				} catch (e) {
					// TODO: handle exception
				}

		// m += ' (' + arguments.callee.caller + ')';
		return m;
	};

	_// JSDT:_module_
	.
	/**
	 * get node description
	 * 
	 * @param node
	 *            HTML node
	 * @_memberOf _module_
	 */
	node_description = function(node, flag) {
		// console.log(node);
		if (typeof node === 'string')
			node = document.getElementById(node);
		if (!node)
			return;

		var description = '';

		if (node.id)
			description += '#' + node.id;

		if (node.className)
			description += '.' + node.className;

		if (node.tagName)
			description = '&lt;' + node.tagName + description + '&gt;';

		if (!description && node.innerHTML) {
			description = node.innerHTML;
			if (description.length > 40)
				description = description.slice(0, 40);
			description = description.replace(/</g, '&lt;');
		}

		// TODO: 对 Range object 之类的处理
		// http://help.dottoro.com/ljxsqnoi.php
		return description || '(null description node: '
				+ library_namespace.is_type(node) + ')';
	};

	_// JSDT:_module_
	.default_log_target = function(message_data) {
		var level = typeof message_data === 'object' && message_data.level, logger;
		if (logger = level && library_namespace.debug_console[level])
			logger(message_data.message);
		else
			console.log(level ? '[' + level + '] ' + message_data.message
					: message_data);
	};

	_// JSDT:_module_
	.
	/**
	 * get new extend instance
	 * 
	 * @param {String|object
	 *            HTMLElement} [obj] message area element or id
	 * @return {Array} [ instance of this module, log function, warning
	 *         function, error function ]
	 * @_example<code>

	// status logger
	var SL = new _module_('log'), sl = SL[1], warn = SL[2], error = SL[3];
	sl(msg);
	sl(msg, clear);

	// general log
	function_set = new _module_.extend('panel', {});
	// 1.
	function_set = new CeL.code.log.extend('panel', {});
	logger = function_set[1];
	// 2.
	log_only = (new CeL.code.log.extend('panel', {}))[1];

	</code>
	 * @_memberOf _module_
	 * @since 2009/8/24 20:15:31
	 */
	extend = function(obj, className_set) {
		if (false) {
			CeL.Log = new CeL.code.log(
					function(m) {
						var F = typeof JSalert === 'function' ? JSalert
								: typeof alert === 'function' ? alert
										: WScript.Echo;
						F(typeof m === 'object' ? '[' + m.level + '] '
								+ m.message : m);
					});
		}

		/**
		 * new instance
		 * 
		 * @_type _module_
		 * @inner
		 * @ignore
		 */
		var log_controller = new _// JSDT:_module_
		(obj || _.default_log_target, className_set);

		// TODO: do not use arguments
		return [ log_controller, function() {
			// console.log(arguments);
			log_controller.log.apply(log_controller, arguments);
		}, function() {
			log_controller.warn.apply(log_controller, arguments);
		}, function() {
			log_controller.error.apply(log_controller, arguments);
		} ];

	};

	/**
	 * <code>
	_.option_open=function(p){

	};

	_.option_file=function(p){
	};

	_.option_folder=function(p){
	};
	</code>
	 */

	// class constructor ---------------------------
	_// JSDT:_module_
	.prototype = {

		// instance public interface -------------------

		/**
		 * 当执行写档案或任何错误发生时之错误讯息。<br />
		 * while error occurred.. should read only
		 * 
		 * @_name _module_.prototype.error_message
		 */
		error_message : '',

		/**
		 * 超过这长度才 save。<=0 表示 autoflash，非数字则不纪录。
		 * 
		 * @_name _module_.prototype.save_limit
		 * @type Number
		 */
		save_limit : 4000,

		/**
		 * 在 log 结束时执行，相当于 VB 中 DoEvent() 或 。
		 * 
		 * @_name _module_.prototype.do_event
		 */
		do_event : library_namespace.DoNoting || null,

		/**
		 * log 时使用之 tagName, 可用 div / span 等。若不设定会用 document.createTextNode
		 * 
		 * @_name _module_.prototype.log_tag
		 */
		log_tag : 'div',

		/**
		 * boolean or function(message, log level) return save or not
		 * 
		 * @_name _module_.prototype.save_log
		 * @type Boolean
		 */
		save_log : false,
		/**
		 * save log to this file path
		 * 
		 * @_name _module_.prototype.log_file
		 * @type Boolean
		 */
		log_file : false,
		/**
		 * auto save log. 若未设定，记得在 onunload 时 .save()
		 * 
		 * @_name _module_.prototype.flush
		 * @type Boolean
		 */
		flush : false,
		/**
		 * 在 save log 时 add date
		 * 
		 * @_name _module_.prototype.save_date
		 * @type Boolean
		 */
		save_date : true,
		/**
		 * 在 save log 时的换行
		 * 
		 * @_name _module_.prototype.save_line_separator
		 * @type string
		 */
		save_line_separator : library_namespace.env.line_separator || '\r\n',
		/**
		 * 在 save log 时的 encoding
		 * 
		 * @_name _module_.prototype.log_encoding
		 */
		log_encoding : -1,// -1: TristateTrue

		/**
		 * 自动卷动
		 * 
		 * @_name _module_.prototype.auto_scroll
		 * @type Boolean
		 */
		auto_scroll : true,
		/**
		 * 没有内容时自动隐藏
		 * 
		 * @deprecated TODO
		 * @_name _module_.prototype.auto_hide
		 * @type Boolean
		 */
		auto_hide : false,

		/**
		 * 等待多久才显示 log。若为 0 则直接显示。<br />
		 * e.g., 即时显示，不延迟显示： CeL.Log.interval = 0;<br />
		 * (WScript 没有 setTimeout)
		 * 
		 * @_name _module_.prototype.interval
		 */
		interval : typeof setTimeout === 'undefined' ? 0 : 1,

		/**
		 * log function (no delay)
		 * 
		 * @_name _module_.prototype.do_log
		 */
		do_log : function(level) {
			if (false)
				if (p[this.id].th)
					clearTimeout(p[this.id].th);

			// reset timeout handler
			p[this.id].th = 0;

			// TODO: 提升效率.
			if ('controller' in this)
				this.set_controller();

			write_log(this.id);
		},

		/**
		 * class instance 预设作 log 之 function
		 * 
		 * @param {String}
		 *            message message
		 * @param {Boolean}clean
		 *            clean message area
		 * @param {Object}options
		 *            选择性项目. { level : log level, 记录复杂度. }
		 * @return
		 * @_name _module_.prototype.log
		 */
		log : function(message, clean, options) {
			// console.log(message);
			var t = this, _p = p[t.id], level, force_save;

			if (library_namespace.is_Object(options)) {
				level = options.level;
				force_save = options.save;
			} else if (options) {
				force_save = level = options;
				(options = {}).level = level;
			}

			/**
			 * <code>
					var message_head = (arguments.callee.caller + '')
							.match(/function\do_save_log([^\(]+)/);
					if (message_head)
						message_head = message_head[1] + ' ';
			</code>
			 */
			do_save_log(message, t.id, force_save);

			// window.status = message;
			if (options) {
				message = new log_data(message, options);
			}

			if (clean) {
				// clean log next time
				_p.clean = 1, _p.buf = [ message ];
			} else {
				_p.buf.push(message);
			}

			if (!(t.interval > 0))
				t.do_log();
			else if (!_p.th)
				// no window.setTimeout @ node.js
				if (typeof setTimeout === 'undefined')
					t.interval = 0, t.do_log();
				else
					// _p.th = setTimeout(cn + '.do_log(' + t.id + ');',
					// t.interval);
					_p.th = setTimeout(function() {
						_.do_log(t.id);
					}, t.interval);

			if (t.do_event)
				t.do_event();
		},

		/*
		 * TODO: other methods: INFO,DEBUG,WARNING,ERROR,FATAL,UNKNOWN
		 */

		/**
		 * save message
		 * 
		 * @_name _module_.prototype.save
		 */
		save : function() {
			do_save_log('', this.id, 1/* force */);
		},

		/**
		 * <code>

		 ** important ** 这边不能作 object 之 initialization，否则因为 object 只会 copy reference，因此 new 时东西会一样。initialization 得在 _() 中作！

		 </code>
		 */
		// className_set : {},
		/**
		 * log a warning / caution / alert / 警告.
		 * 
		 * @_name _module_.prototype.warn
		 */
		warn : function(m, clean) {
			this.log(m, clean, 'warn');
		},

		/**
		 * deal with error message
		 * 
		 * @_name _module_.prototype.error
		 */
		error : function error(e, clean) {
			var caller = '';
			if (has_caller) {
				caller = '' + error.caller;
				if (caller.indexOf('.error.apply(') !== -1)
					// ** 判断 call from _.extend. TODO: 应该避免!
					caller = caller.caller;
			}

			this.log(Array.isArray(e) || library_namespace.is_Object(e) ? e : _
					.get_error_message(e, this.save_line_separator, caller),
					clean, 'error');
		},

		timezone_offset : /* msPerMinute */60000 * (new Date)
				.getTimezoneOffset(),

		/**
		 * 在 log 中依照格式显示时间。
		 * 
		 * @param {Date}date
		 * @returns {String} 依照格式显示成之时间。
		 * @_name _module_.prototype.show_time
		 * @since 2012/3/16 22:36:46
		 */
		show_time : function show_time(date, time) {
			var add_s, _diff_ms,
			//
			date_stamp = (date.getMonth() + 1) + '/' + date.getDate() + ' '
					+ show_date(date),
			//
			diff_ms = has_performance_now && this.last_show ? time
					- this.last_show : (_diff_ms = date
					- (this.last_show || this.timezone_offset));

			if (diff_ms > 0)
				if (diff_ms < 60000) {
					add_s = diff_ms >= 1000 && (diff_ms /= 1000);
					diff_ms = diff_ms.to_fixed ? String(diff_ms.to_fixed(3))
							.replace(/^0/, '')
					// : diff_ms.toFixed ? diff_ms.toFixed(3)
					: (diff_ms | 0);
					if (add_s)
						diff_ms += 's';
				} else
					diff_ms = show_date(new Date(diff_ms + this.timezone_offset));

			this.last_show = has_performance_now ? time : date;

			// 不用 CSS.quotes: 在旧版 browser 上可能无效，但本 module 须在旧版上亦正常作动。
			return '<span class="' + this.className_set.time + '" title="'
					+ date_stamp + '  '
					+ (has_performance_now ? time : '+' + _diff_ms) + ' ms">['
					+ diff_ms + ']</span> ';
		},

		/**
		 * 当记录太长时，限制记录数目在 max_logs。超过这个数目就会把之前的最旧的纪录消除掉。
		 * 
		 * @param {Natural}max_logs
		 *            最大记录数目
		 */
		set_max_logs : function(max_logs) {
			var _t = this, _p = p[_t.id];
			max_logs = Math.floor(max_logs);
			// accept NaN
			_p.max_logs = max_logs < 0 ? 0 : max_logs;
		},

		/**
		 * 设定写入到哪<br />
		 * set log board for each instance (document object)
		 * 
		 * @_name _module_.prototype.set_board
		 */
		set_board : function(o) {
			var _t = this, _p = p[_t.id];
			if (o)
				if (typeof o === 'function')
					_p.do_function = o;

				else {
					if (typeof o !== 'object' && typeof document === 'object')
						o = document.getElementById(o);
					if (o
					// TODO
					// && library_namespace.is_HTML_obj(o)
					) {
						_p.board = o;
						_t.set_controller();
						if (_t = _t.className_set.panel)
							o.className += ' ' + _t;
						delete _p.do_function;
					}
				}

			return _p.board;
		},

		// TODO: 若之后才 include 'interact.DOM'，则 controller 没办法显示出来 @ Chrome/25。
		set_controller : function(c) {
			var b = p[this.id].board;
			if (b && (c || (c = this.controller))
					&& (c = new_node(c, [ b, 0 ])) !== using_DOM_new_node) {
				if ('controller' in this)
					delete this.controller;
				// c.style.height = '1em';
				// c.style.height = '';
			}
		},

		/**
		 * 获取当前 buffer 中的 log。
		 * 
		 * @_name _module_.prototype.get_log
		 */
		get_log : function() {
			return p[this.id].lbuf;
		},

		/**
		 * show/hide log board. 切换可见状态。
		 * 
		 * @_name _module_.prototype.toggle
		 */
		toggle : function(s) {
			return library_namespace.toggle_display(p[this.id].board, s) !== 'none';
		},

		/**
		 * clear log board. TODO: use .remove_all_child().
		 * 
		 * @_name _module_.prototype.clear_board
		 */
		clear_board : function(b) {
			b.innerHTML = '';
		},

		/**
		 * 清除全部讯息 clear message
		 * 
		 * @_name _module_.prototype.clear
		 */
		clear : function() {
			var _p = p[this.id];
			if (_p.board) {
				this.clear_board(_p.board);
			}
			_p.lbuf = [];
		}

	};

	return (_// JSDT:_module_
	);

}

// ----------------------------------------------------------------------------------------------------------------------------------------------------------//

function finish(name_space) {
	// 为 module log 所作的初始化工作。

	var module_name = this.id;

	// 确认 cssRules 之后才作 delete，否则就得按顺序先增者后减。因为删掉 [2] 之后，后面全部皆会递补，[3] 会变成 [2]。
	// TODO: 一般化。
	function search_CSS_rule(style_sheet, selector) {
		var rules = style_sheet.cssRules || style_sheet.rules, i = 0, l = rules.length;
		for (; i < l; i++)
			if (selector === rules[i].selectorText)
				return i;
	}

	// WScript.Echo(n.extend);

	if (false)
		code_for_including[generateCode.dLK] = '*var Debug={log:code_for_including()};';

	// include resources of module.
	CeL.run(CeL.get_module_path(module_name, 'log.css'));

	// 为本 library 用
	if (!CeL.Log) {
		var i, l, log_controller = name_space.extend(), has_caller,
		// 侦错等级, debug level, log level.
		log_icon = {
			/**
			 * MEMO (U+1F4DD).<br />
			 * http://codepoints.net/U+1F4DD http://wiki.livedoor.jp/qvarie/
			 */
			log : '📝',
			/**
			 * emphasized text<br />
			 * U+2383 EMPHASIS SYMBOL<br />
			 * http://codepoints.net/U+2383
			 */
			em : '⎃',
			/**
			 * 资讯,消息,报告,通知,情报<br />
			 * WARNING SIGN (U+26A0) @ Miscellaneous Symbols.
			 */
			warn : '⚠',
			/**
			 * error / fault<br />
			 * U+2620 SKULL AND CROSSBONES
			 */
			error : '☠',
			/**
			 * U+2139 INFORMATION SOURCE<br />
			 * http://en.wiktionary.org/wiki/%E2%84%B9
			 */
			info : 'ℹ',
			/**
			 * U+1F41B BUG
			 */
			debug : '🐛',
			/**
			 * U+1F463 footprints
			 * https://unicode.org/emoji/charts/full-emoji-list.html
			 */
			trace : '👣'
		},
		// base path of icon
		icon_path = CeL.get_module_path(module_name, 'icon/');

		try {
			has_caller = function(a) {
				'use strict';
				return arguments.callee.caller !== undefined;
			};
			has_caller = (function() {
				return has_caller();
			})();
		} catch (e) {
			has_caller = false;
		}

		// console.log('override: CeL.Log = ' + log_controller[0]);
		CeL.Log = log_controller[0];
		// console.log('setup CeL.Log.className_set');
		Object.assign(CeL.Log.className_set, {
			info : 'debug_info',
			em : 'debug_em',
			debug : 'debug_debug'
		});

		// log 支援 gettext.
		CeL.Log.message_prefix = function(level) {
			if (level in log_icon) {
				return {
					img : null,
					'class' : 'debug_icon',
					src : icon_path + level + '.png',
					alt : '[' + log_icon[level] + ']',
					title : log_icon[level] + ' '
					// gettext_config:{"id":"log-type-fatal","mark_type":"combination_message_id"}
					// gettext_config:{"id":"log-type-error","mark_type":"combination_message_id"}
					// gettext_config:{"id":"log-type-warn","mark_type":"combination_message_id"}
					// gettext_config:{"id":"log-type-em","mark_type":"combination_message_id"}
					// gettext_config:{"id":"log-type-info","mark_type":"combination_message_id"}
					// gettext_config:{"id":"log-type-log","mark_type":"combination_message_id"}
					// gettext_config:{"id":"log-type-debug","mark_type":"combination_message_id"}
					// gettext_config:{"id":"log-type-trace","mark_type":"combination_message_id"}
					+ CeL.gettext('log-type-' + level)
				};
			}
			return '';
		};

		// TODO: copy result, paste code.
		var controller = [ ':', {
			// U+239A CLEAR SCREEN SYMBOL
			a : '⎚',
			href : '#',
			title : "clear / 清除所有讯息",
			onclick : function() {
				CeL.Log.clear();
				return false;
			}
		}, {
			// toggle / switch
			// U+1F50C ELECTRIC PLUG
			a : '🔌',
			href : '#',
			title : "切换讯息面板\nshow/hidden log panel",
			onclick : function() {
				CeL.set_class(this, 'debug_hide', {
					remove : CeL.Log.toggle()
				});
				return false;
			}
		}, {
			span : '↑',
			title : "提升侦错等级",
			S : 'cursor:pointer;font-size:.7em;',
			onselect : function() {
				return false;
			},
			onclick : function() {
				CeL.set_debug(CeL.is_debug() + 1);
				CeL.debug('提升侦错等级至 ' + CeL.is_debug(), 1, 'Log.controller');
				return false;
			}
		}, {
			span : '↓',
			title : "降低侦错等级",
			S : 'cursor:pointer;font-size:.7em;',
			onselect : function() {
				return false;
			},
			onclick : function() {
				CeL.set_debug(CeL.is_debug() - 1);
				CeL.debug('降低侦错等级至 ' + CeL.is_debug(), 0, 'Log.controller');
				return false;
			}
		}, {
			span : '↓',
			title : "取消 debug",
			S : 'cursor:pointer;font-size:.7em;text-decoration:underline;',
			onselect : function() {
				return false;
			},
			onclick : function() {
				CeL.set_debug(0);
				return false;
			}
		}, {
			br : null
		} ];
		l = {
			debug : 0,
			log : 0,
			info : 'information',
			em : 'emphasis',
			warn : 'warning',
			error : 'error'
		};
		for (i in l) {
			controller.push(' ', {
				a : log_icon[i],
				href : '#',
				title : 'toggle [' + i + ']\n切换 ' + (l[i] || i) + ' 讯息',
				onclick : function() {
					var tag = this.title.match(/\[([^\]]+)\]/);
					if (tag)
						CeL.set_class(this, 'debug_hide', {
							remove : CeL.toggle_log(tag[1])
						});
					return false;
				}
			});
		}
		// 增加 group 以便在多项输入时亦可 toggle 或排版。
		CeL.Log.controller = {
			div : [ {
				a : 'log',
				href : '#',
				title : 'log 控制项',
				onclick : function() {
					var parentNode = this.parentNode;
					if (parentNode.force_show) {
						// DOM 不可使用 delete @ IE9
						// delete parentNode.force_show;
						parentNode.force_show = false;
					} else {
						CeL.toggle_display(this.nextSibling,
						//
						parentNode.force_show = true);
					}
					return false;
				}
			}, {
				span : controller,
				C : 'debug_controller'
			} ],
			// TODO: 即使仅是移动 mouse 进入 child，也会执行多次。
			onmouseover : function() {
				CeL.toggle_display(this.firstChild.nextSibling, 1);
			},
			onmouseout : function() {
				if (!this.force_show) {
					CeL.toggle_display(this.firstChild.nextSibling, 0);
				}
			},
			C : 'debug_controller_panel'
		};

		// 在 CeL.log 被重新设定前先 cache 一下。
		var log_buffer = CeL.log && CeL.log.buffer;

		// --------------------------------------------------------------------------------------------
		// front ends of log function

		/**
		 * 警告: 在 node.js v0.10.25, v0.11.16 中，不使用 var 的模式设定 function，会造成:<br />
		 * In strict mode code, functions can only be declared at top level or
		 * immediately within another function.
		 * 
		 * 在 node.js v4.2.1 中可以顺利 pass。
		 */

		var log_front_end_fatal =
		// fatal: the most serious 致命错误。
		function log_front_end_fatal(message, error_to_throw) {
			if (CeL.is_WWW())
				try {
					console.trace(error_to_throw);
					// 模拟 throw 以 get .stack
					throw CeL.is_type(error_to_throw, 'Error') ? error_to_throw
							: new Error(error_to_throw || 'Fatal error');
				} catch (e) {
					// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error/Stack
					CeL.error(e.stack ? message
							+ '<br />stack:<div class="debug_stack">'
							+ (typeof e.stack === 'string' ? e.stack.replace(
									/\n/g, '<br />') : e.stack) + '</div>'
							: message);
					if (typeof console === 'object' && console.trace) {
						// Will show stacks
						console.trace(e);
					}
				}
			else
				CeL.error(message);

			if (typeof error_to_throw === 'undefined')
				// 预设会 throw message.
				error_to_throw = message;

			if (error_to_throw) {
				if (CeL.platform.nodejs && error_to_throw !== message)
					// node.js 中，throw Error 可能无法显示 local encoding，因此在此先显示一次。
					console.error(error_to_throw);
				throw CeL.is_type(error_to_throw, 'Error') ? error_to_throw
						: new Error(error_to_throw);
			}
		}

		var log_front_end_debug =
		// 增加 debug 讯息。
		function log_front_end_debug(message, level, caller, clean) {
			if (false) {
				alert(CeL.is_debug() + ',' + l + '(' + (l === undefined) + '),'
						+ message);
			}

			if (!CeL.is_debug(level)) {
				return;
			}

			if (typeof message === 'function') {
				// for .debug(function(){return some_function(..);}, 3);
				message = 'function: [' + message + ']<br />return: ['
						+ message() + ']';
			}

			if (!caller && has_caller) {
				// TODO: do not use arguments
				caller = caller !== arguments.callee
						&& CeL.get_function_name(arguments.callee.caller);
				if (false) {
					CeL.log(CeL.is_type(arguments.callee.caller));
					CeL.log(Array.isArray(caller));
					CeL.log(caller + ': ' + arguments.callee.caller);
					CeL.warn(CeL.debug);
				}
			}
			if (caller) {
				message = CeL.is_WWW() ? [ {
					// (caller.charAt(0) === '.' ? CeL.Class + caller :
					// caller)
					span : caller,
					'class' : 'debug_caller'
				}, ': ', message ] : CeL.to_SGR([ '', 'fg=yellow',
						caller + ': ', '-fg', message ]);
			}

			CeL.Log.log(message, clean, {
				level : 'debug',
				add_class : 'debug_' + (level || CeL.is_debug())
			});
		}

		var log_front_end_info =
		//
		function log_front_end_info(message, clean) {
			// information
			CeL.Log.log.call(CeL.Log, message, clean, 'info');
			// CeL.log.apply(CeL, arguments);
		};

		var log_front_end_toggle_log =
		// 切换(显示/隐藏)个别讯息。
		function log_front_end_toggle_log(type, show) {
			if (!type)
				type = 'debug';
			var hiding = type in CeL.Log.class_hide;
			if (typeof show === 'undefined' || show && hiding || !show
					&& !hiding)
				try {
					// need switch.
					var style_sheet = document.styleSheets[0], selector = '.'
							+ CeL.Log.className_set[type], CSS_index = hiding ? search_CSS_rule(
							style_sheet, selector)
							: undefined;
					if (isNaN(CSS_index)) {
						// assign a new index.
						CSS_index = style_sheet.cssRules
								&& style_sheet.cssRules.length ||
								// IE6
								style_sheet.rules && style_sheet.rules.length
								|| 0;
						CeL.debug('insert CSS index: ' + CSS_index, 2,
								'toggle_log');
						var style = 'display:none';
						style_sheet.insertRule ?
						/**
						 * firefox, IE 必须输入 index.<br />
						 * <a
						 * href="https://developer.mozilla.org/en/DOM/CSSStyleSheet/insertRule"
						 * accessdate="2012/5/14 13:13">insertRule - MDN</a>
						 */
						style_sheet.insertRule(selector + '{' + style + ';}',
								CSS_index) :
						/**
						 * IE6: <a
						 * href="http://msdn.microsoft.com/en-us/library/aa358796%28v=vs.85%29.aspx"
						 * accessdate="2012/5/14 13:13">IHTMLStyleSheet::addRule
						 * method (Internet Explorer)</a>
						 */
						style_sheet.addRule(selector, style, CSS_index);

						// OK 之后才设定.
						CeL.Log.class_hide[type] = CSS_index;

					} else {
						CeL.debug('delete CSS index: ' + CSS_index, 2,
								'toggle_log');
						style_sheet.deleteRule ? style_sheet
								.deleteRule(CSS_index) :
						// IE6
						style_sheet.removeRule(CSS_index);
						// OK 之后才 delete.
						delete CeL.Log.class_hide[type];
					}
					hiding = !hiding;
				} catch (e) {
					CeL
							.log('The browser may not support <a href="http://www.w3.org/TR/DOM-Level-2-Style/css" target="_blank">Document Object Model CSS</a>? Cannot toggle debug message: <em>'
									+ e.message + '</em>');
				}
			return !hiding;
		}

		var log_front_end_assert =
		/**
		 * 断定/测试/验证 verify/检查状态。<br />
		 * 
		 * @param {Boolean|Array|Function}condition
		 *            test case.<br />
		 *            {Function} testing function to run. Using default expected
		 *            value: true<br />
		 *            {Array} [ condition 1, condition 2 ]<br />
		 *            {Object} 直接将之当作 options
		 * 
		 * @param {Object}[options]
		 *            附加参数/设定选择性/特殊功能与选项。 {<br />
		 *            {String}name: test name 此次测试名称。,<br />
		 *            {String}NG: meaning of failure,<br />
		 *            {String}OK: meaning of passed,<br />
		 *            {String}hide_OK: false: 当 passed 时不显示,<br />
		 *            {Boolean}ignorable: false / need 手动 check,<br />
		 *            {String|Object}type: expected type,<br />
		 *            {Boolean}no_cache: false,<br />
		 *            {Any}expect: expected value 预期的结果。should be what value.,<br />
		 *            {Number}error_rate > 0: 容许误差率 permissible error ratio.
		 *            e.g., Number.EPSILON,<br />
		 *            {Boolean}exactly: true, need exactly (value === expected)
		 *            or false: equal (value == expected) is also OK.<br />
		 *            {Boolean}force_true: false, 当测试效能时，强迫测试结果一定成功。<br />
		 *            {String}eval: testing expression code to eval = value /
		 *            function(){return value_to_test;}<br />
		 *            {Function}callback: 回调函数。 callback(passed)<br /> }
		 * 
		 * @returns {Boolean|...} {Boolean}assertion is succeed.<br />
		 *          {...} ignorable message.
		 * 
		 * @since 2012/9/19 00:20:49, 2015/10/18 21:31:35 重构
		 */
		function log_front_end_assert(condition, options) {

			// --------------------------------
			// 前置处理作业: condition。
			if (!options) {
				if (CeL.is_Object(condition)) {
					// 直接将之当作 options
					options = condition;
					condition = options.eval;
				} else {
					// 前置处理作业: options。
					// (undefined | null).attribute is NOT accessable.
					// ('attribute' in false), ('attribute' in 0) is NOT
					// evaluable.

					// options = Object.create(null);
					// This is faster.
					options = new Boolean;

					// assert: options.attribute is accessable.
					// assert: ('attribute' in options) is evaluable.
				}
			} else if (typeof options === 'string') {
				options = {
					name : options
				};
			} else if (typeof options === 'function') {
				options = {
					callback : options
				};
			}

			var type = options.type;
			if (Array.isArray(condition)) {
				condition = condition.slice(0, type ? 1 : 2);
				if (!type && typeof condition[1] !== 'function'
						&& typeof condition[1] !== 'object')
					// record original condition.
					condition.original = condition[0];
			} else {
				// 有 options.type 将忽略 options.expect 以及 condition[1]!!
				if (type) {
					condition = [ condition ];
				} else {
					condition = [ condition,
					// default expected value: true
					'expect' in options ? options.expect : true ];
					// record original condition.
					condition.original = condition[0];
				}
			}
			// assert: condition = {Array} [ condition 1, condition 2 ]

			function condition_handler(_c, index) {
				if (options.eval && typeof _c === 'string')
					_c = CeL.eval_parse(_c);

				if (typeof _c === 'function')
					_c = _c();

				// may use .map()
				condition[index] = _c;
			}

			// fatal error
			var fatal;
			// if (!options.force_true)
			condition.forEach(options.no_cache ? condition_handler
			//
			: function(_c, index) {
				try {
					condition_handler(_c, index);
				} catch (e) {
					// 执行 condition 时出错，throw 时的处置。
					fatal = e || true;
					CeL.warn('assert: 执行 condition 时出错: ' + e.message);
					if (typeof console === 'object' && console.trace) {
						// Will show stacks
						console.trace(e);
					}
				}
			});

			// assert: condition =
			// {Array} [ 纯量 value 1, 纯量 value 2: expected value ]
			// condition = The actual value to test.

			// --------------------------------
			var exactly, equal;

			if (!fatal
			// && !options.force_true
			) {
				if (type) {
					// 处理作业: type。
					condition = condition[0];
					exactly = equal = typeof type === 'string'
					//
					? typeof condition === type || CeL.is_type(condition, type)
					// TODO: check
					// String|Function|Object|Array|Boolean|Number|Date|RegExp|Error|undefined
					: condition.constructor === type
							|| Object.getPrototypeOf(condition) === type
							|| (type = CeL.native_name(type))
							&& CeL.is_type(condition, type);
				} else if ((equal = +options.error_rate) > 0) {
					// 容许误差率 permissible error ratio / rate. e.g.,
					// Number.EPSILON
					exactly = equal = Math.abs(1 - +condition[0]
							/ +condition[1]) <= equal;
				} else {
					exactly = equal = Object.is(condition[0], condition[1]);
					if (!exactly) {
						// Do not use "==="
						equal = condition[0] == condition[1];
					}
				}
			}

			// --------------------------------
			// report.

			var MAX_LENGTH = 200;

			function get_type_of(value, with_quote) {
				var type, is_native_type;
				if (Array.isArray(value)) {
					type = 'Array';
					is_native_type = true;
				} else if (CeL.is_Object(value)) {
					type = 'Object';
					is_native_type = true;
				} else if (CeL.is_RegExp(value)) {
					type = 'RegExp';
					is_native_type = true;
				} else if (CeL.is_Date(value)) {
					type = 'Date';
					is_native_type = true;
				} else if (value instanceof Error) {
					type = 'Error';
					is_native_type = true;
				} else {
					type = typeof value;
					if (type === 'object') {
						type = CeL.is_type(value) || type;
					} else if ([ 'string', 'number', 'boolean', 'function',
					// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof
					'bigint', 'symbol' ].includes(type)) {
						is_native_type = true;
						type = type.charAt(0).toUpperCase() + type.slice(1);
					}
				}
				return with_quote ? is_native_type ? '{' + type + '}' : '('
						+ type + ')' : type;
			}

			function quote(message, add_type) {
				if (add_type &&
				// 有些 value 没必要加上 type。
				message !== null && message !== undefined
				// is not NaN
				&& message === message) {
					add_type = get_type_of(message, true) + ' ';
				} else {
					add_type = '';
				}

				if (typeof message === 'string' && add_type
						&& message.length <= MAX_LENGTH
						&& typeof JSON === 'object' && JSON.stringify) {
					message = JSON.stringify(message);
				} else {
					message = String(message).replace(/\r/g, '\\r');
					if (message.length > MAX_LENGTH)
						message = '[' + message.slice(0, MAX_LENGTH) + ']...'
								+ message.length;
					else
						message = '[' + message + ']';
				}

				return add_type + message;
			}

			var test_name = options.name ? quote(options.name) : 'Assertion';

			// --------------------------------
			// failed.

			if (!options.force_true && (!equal || !exactly &&
			// assert: exactly === true 的条件比 equal === true 严苛。
			(!('exactly' in options) || options.exactly))) {
				var error_message = options.NG;
				if (!error_message) {
					error_message = [ test_name,
					// if fault, message: 失败时所要呈现讯息。
					CeL.to_SGR([ ' ', 'fg=red', 'failed:', '-fg;-bg', ' ' ]) ];
					if (type) {
						error_message.push('type of ' + quote(condition)
								+ ' is not (' + type + ')');
					} else {
						if (('original' in condition)
								&& condition[0] !== condition.original) {
							var original = '' + condition.original;
							if (typeof condition.original === 'function') {
								var matched = original
										.match(CeL.PATTERN_function);
								if (matched) {
									original = matched[1];
								}
							}
							error_message.push(quote(original) + '→');
						}
						error_message.push(quote(condition[0], true)
						//
						+ ' !== ' + quote(condition[1], true));
					}

					if (equal) {
						error_message.push('，但 "==" 之关系成立。');
					}

					error_message = error_message.join('');
				}

				CeL.fatal(error_message, CeL.assert.throw_Error ?
				// exception to throw
				new Error(error_message) : false);

				var ignorable = options.ignorable;
				return ignorable ? ignorable === true ? 'ignored' : ignorable
						: fatal ? undefined : false;
			}

			// --------------------------------
			// passed. 无错误发生。

			if (!options.hide_OK && CeL.is_debug()) {
				var passed_message = options.OK;
				if (!passed_message) {
					passed_message = [ test_name,
					//
					CeL.to_SGR([ ' ', 'fg=green', 'passed', '-fg', ' ' ]),
					//
					quote(condition[0], true) ].join('');
				}
				CeL.debug(passed_message, 1,
				// caller: see: CeL.debug
				has_caller && CeL.get_function_name(arguments.callee.caller));
			}

			return true;
		}

		var log_front_end_test =
		/**
		 * 整套测试, unit test 单元测试。
		 * 
		 * @example <code>

		CeL.test([ [ 'aa', {
			type : String
		} ], [ 456, {
			type : 123
		} ], [ {}, {
			type : Object
		} ], [ false, {
			type : Boolean
		} ] ], 'type test');


		// --------------------------------------
		// TODO:

		// may ignore:
		CeL.setup_test(test_group_name);

		CeL.test(test_group_name, conditions, options);
		// conditions #1: [
		// [ test value: true / false, 'test_group_name' ],
		// [ test value: true / false, {name:'test_group_name'} ],
		// [ test value: true / false, {options} ],
		// [ test value: true / false ],
		// test value: true / false,
		//
		// [ [ test value 1, test value 2 ], 'test_group_name' ],
		// [ [ test value 1, test value 2 ], {name:'test_group_name'} ],
		// [ [ test value 1, test value 2 ], {options} ],
		// [ [ test value 1, test value 2 ] ],
		//
		// [ function tester(), 'test_group_name' ],
		// [ function tester() ],
		// [ function tester(callback), {need_callback:true} ],
		// function tester(),
		// function tester() { return new Promise },
		// async function tester(),
		//
		// ]

		// conditions #2:
		// function async_tester(assert)
		// async function async_tester(assert)
		//
		// CeL.test(test_group_name, function async_tester(assert, callback), {need_callback:true});
		//
		// assert(test value: true / false, 'test_group_name');
		// assert(test value: true / false, options);
		// assert(test value: true / false);
		// assert([ test value 1, test value 2 ], 'test_group_name');
		// assert([ test value 1, test value 2 ]);

		CeL.test_finished();


		</code>
		 * 
		 * @param {String}[test_group_name]
		 *            test name 此次测试名称。
		 * @param {Array|Function}conditions
		 *            condition list passed to assert(): [ [ condition / test
		 *            value, options ], [], ... ].<br />
		 *            允许 {Function}condition(assert, test_handler)
		 * @param {Object}[options]
		 *            附加参数/设定选择性/特殊功能与选项。 {<br />
		 *            {String}name: test name 此次测试名称。<br />
		 *            {Object}options: default options for running CeL.assert().<br />
		 *            {Function}callback: 回调函数。 callback(recorder,
		 *            test_group_name)<br /> }
		 * 
		 * @returns {Integer}有错误发生的数量。
		 * 
		 * @since 2012/9/19 00:20:49, 2015/10/18 23:8:9 refactoring 重构
		 */
		function log_front_end_test(test_group_name, conditions, options) {
			if ((Array.isArray(test_group_name) || typeof test_group_name === 'function')
					&& !options) {
				// shift arguments: 跳过 test_group_name。
				options = conditions;
				conditions = test_group_name;
			}

			if (!Array.isArray(conditions) && typeof conditions !== 'function') {
				throw new Error(CeL.Class
						+ '.test: Please input {Array} or {Function}!');
				return;
			}

			var assert = CeL.assert,
			// default options for running CeL.assert().
			default_options;

			if (options) {
				if (typeof options === 'function') {
					// console.log('Set callback: ' + options);
					options = {
						callback : options
					};
				} else if (typeof options === 'string') {
					if (!test_group_name)
						test_group_name = options;
					options = undefined;
				} else if ('options' in options)
					default_options = options.options;
			}

			default_options = Object.assign({
				hide_OK : true,
				no_cache : true
			}, default_options);

			var recorder = {
				// OK
				passed : [],
				// skipped
				ignored : [],
				// value is not the same.
				failed : [],
				// 执行 condition 时出错，throw。
				fatal : [],
				//
				all : []
			};

			function handler(condition_arguments) {
				if (!condition_arguments) {
					// skip this one.
					return;
				}

				recorder.all.push(condition_arguments);

				var result;
				try {
					if (typeof condition_arguments === 'function') {
						result = condition_arguments(assert_proxy);
					} else {
						// assert: Array.isArray(condition_arguments) or
						// arguments
						var options = condition_arguments[1],
						//
						condition = condition_arguments[0];
						// 前置处理作业: condition, options。
						// copy from log_front_end_assert()
						// 目的在将输入转成 {Object}，以添入 options。
						if (!options) {
							if (CeL.is_Object(condition)) {
								// 直接将之当作 options
								options = condition;
								condition = options.eval;
							}
						} else if (typeof options === 'string') {
							options = {
								name : options
							};
						} else if (typeof options === 'function') {
							options = {
								callback : options
							};
						}

						// 不污染 default_options, options
						options = Object.assign(Object.clone(default_options),
								options);

						result = assert(condition, options);
					}

				} catch (e) {
					if (typeof console === 'object' && console.trace) {
						// Will show stacks
						console.trace(e);
					}
					recorder.fatal.push(condition_arguments);
					return;
				}

				switch (result) {
				case true:
					recorder.passed.push(condition_arguments);
					break;
				case false:
					recorder.failed.push(condition_arguments);
					break;
				default:
					recorder.ignored.push(condition_arguments);
					break;
				}

				return result === true;
			}

			// 模拟 CeL.assert()
			function assert_proxy() {
				var sub_test_data = assert_proxy.tests_left[assert_proxy.latest_sub_test_name];
				if (sub_test_data)
					sub_test_data.assert_count++;
				return handler.call(null, arguments);
			}

			// --------------------------------
			// report. 当有多个 setup_test()，report() 可能执行多次！
			var report = function(sub_test_name) {
				var messages;
				if (test_group_name) {
					messages = [ 'Test '
					// asynchronous operations
					+ (assert_proxy.asynchronous ? 'asynchronous ' : '') + '[',
							'fg=cyan', test_group_name ];
					if (sub_test_name) {
						messages.push('-fg',
						// ']=>[', ': ', ']→[', '：', ': '
						': ', 'fg=cyan', sub_test_name);
					}
					messages.push('-fg', ']: ');
					messages = [ CeL.to_SGR(messages) ];
				} else {
					messages = [];
				}

				function join() {
					if (recorder.ignored.length > 0)
						messages.push(CeL.to_SGR([
								', ' + recorder.ignored.length + ' ',
								'fg=yellow', 'ignored', '-fg' ]));

					// Time elapsed, 使用/耗费时间。cf. eta, Estimated Time of Arrival
					var elapsed = Date.now() - assert_proxy.starts;
					if (elapsed >= 1000)
						messages.push(', ' + (elapsed / 1000).to_fixed(2)
								+ ' s');
					messages.push(elapsed === 0 ? ', 0 s elapsed.' : ', '
							+ ((elapsed = recorder.all.length / elapsed) < 1
							// Hz
							? (1000 * elapsed).to_fixed(2) + ' tests/s.'
									: elapsed.to_fixed(2) + ' tests/ms.'));
					// console.trace(messages);
					return messages.join('');
				}

				var error_count = recorder.failed.length
						+ recorder.fatal.length;
				function finish() {
					// 确保 callback 会在本函数之后执行。
					// 最后执行setTimeout(options.callback)，使options.callback在讯息显示完之后才执行。
					// 因为已 callback，自此后不应改变 recorder，否则不会被 callback 处理。
					if (options && typeof options.callback === 'function') {
						setTimeout(function() {
							options.callback(recorder, error_count,
									test_group_name);
						}, 0);
					}
					return error_count;
				}

				if (error_count === 0) {
					// all passed. 测试通过。
					messages.push(CeL.to_SGR([
							'All ' + recorder.passed.length + ' ', 'fg=green',
							'passed', '-fg' ]));

					log_front_end_info(join());
					return finish();
				}

				// not all passed.
				messages.push(recorder.failed.length + '/'
				//
				+ (recorder.failed.length + recorder.passed.length));
				if (recorder.failed.length + recorder.passed.length !== recorder.all.length)
					messages.push('/' + recorder.all.length);
				messages.push(CeL.to_SGR([ ' ', 'fg=red', 'failed', '-fg' ]));
				if (recorder.fatal.length > 0) {
					// fatal exception error 致命错误
					messages.push(CeL.to_SGR([
							', ' + recorder.fatal.length + ' ',
							'fg=red;bg=white', 'fatal', '-fg;-bg' ]));
				}

				// 不采用 log_controller，在 console 会出现奇怪的著色。
				// e.g., @ Travis CI
				if (recorder.passed.length > 0) {
					// CeL.warn(join());
					log_controller[2](join());
				} else {
					// CeL.error(join());
					log_controller[3](join()
					// hack: fg=whilte → fg=red
					.replace(/\x1B\[37m/g, '\x1B[31m'));
				}

				return finish();
			}

			assert_proxy.test_group_name = test_group_name;
			assert_proxy.report = report;
			assert_proxy.options = default_options;
			assert_proxy.starts = Date.now();

			// --------------------------------
			// ready to go

			if (Array.isArray(conditions)) {
				conditions.forEach(handler);
			} else {
				var tests_count = 0,
				// assert: tests_count === Object.keys(tests_left).length
				tests_left = assert_proxy.tests_left = Object.create(null),
				// assert: typeof conditions === 'function'
				setup_test = function setup_test(sub_test_name, test_function) {
					// need wait (pending)
					assert_proxy.asynchronous = true;
					if (sub_test_name) {
						assert_proxy.latest_sub_test_name = sub_test_name;
						if (sub_test_name in tests_left) {
							CeL.warn('已登记过任务组 [' + sub_test_name + ']。');
							return true;
						}
						tests_count++;
						tests_left[sub_test_name] = {
							// sub_test_data
							assert_count : 0
						};
						CeL.debug('增加任务组 [' + sub_test_name + ']。尚余 '
								+ tests_count + ' 个任务组测试中。', 1, 'CeL.log.test');
					}
					if (typeof test_function === 'function') {
						try {
							test_function(finish_test);
						} catch (e) {
							if (typeof console === 'object' && console.trace) {
								// Will show stacks
								console.trace(e);
							}
							recorder.fatal.push(sub_test_name);
						}
						if (sub_test_name)
							finish_test(sub_test_name);
					}
				},
				//
				finish_test = function finish_test(sub_test_name) {
					if (sub_test_name in tests_left) {
						delete tests_left[sub_test_name];
						tests_count--;
					} else {
						// 重复呼叫?
						CeL.warn('已登记过完成测试任务组 [' + sub_test_name + ']。');
						return;
					}
					CeL.debug('完成测试 [' + sub_test_name + ']。尚余 ' + tests_count
							+ ' 个任务组测试中。', 1, 'CeL.log.test');
					// console.trace([ tests_count, tests_left ]);
					if (tests_count === 0
					// && CeL.is_empty_object(tests_left)
					) {
						if (assert_proxy.tests_loaded)
							report(sub_test_name);
						else
							delete assert_proxy.asynchronous;
					}
				}, conditions_error = function(error) {
					assert_proxy.asynchronous = false;
					handler([ [ error, "OK" ], test_group_name ]);
				};

				try {
					var result = conditions(assert_proxy, setup_test,
							finish_test, {
								test_name : test_group_name
							});
					// allow async functions
					if (CeL.is_thenable(result)) {
						result.then(function() {
							assert_proxy.tests_loaded = true;
							// CeL.log('CeL.test: All tests loaded.');
							if (tests_count > 0) {
								CeL.error('CeL.test: ' + tests_count
										+ ' sub test(s) still running: '
										+ Object.keys(tests_left));
							}
							report();
						}, function(error) {
							console.trace(error);
							conditions_error(error);
						});
						// Waiting...
						return;
					}

					assert_proxy.tests_loaded = true;
					if (tests_count > 0) {
						// console.trace([ tests_count, tests_left ]);
						CeL.debug('尚余 ' + tests_count + ' 个任务组测试中。', 1,
								'CeL.log.test');
					}
				} catch (e) {
					// has_console
					if (typeof console === 'object' && console.error) {
						// Warning: console.error() won't show stacks @ node
						// v0.10
						// console.trace(e) will show a wrong one.
						if (e && e.stack && CeL.platform.nodejs
								&& !CeL.platform('node', 8)) {
							console.error(e.stack);
						} else {
							// Will show stacks
							console.error(e);
						}
					}
					conditions_error(e);
				}
			}

			if (!assert_proxy.asynchronous) {
				return report();
			} else {
				// Waiting...
			}
		}

		// 在 console 则沿用旧 function。
		// 这里的判别式与 base.js 中的相符: "_.to_SGR = is_WWW ? SGR_to_plain : to_SGR;"
		// 因为 base.js 中的 styled log 也需要此条件才能发动。
		// TODO: 增加 console 的 style (color)
		if (CeL.is_WWW()) {
			// 这里列出的是 base.js 中即已提供，不设定也会由原先之预设函式处理的函式。
			Object.assign(CeL, {
				log : log_controller[1],
				warn : log_controller[2],
				error : log_controller[3],

				info : log_front_end_info,

				debug : log_front_end_debug
			});
		}

		Object.assign(CeL, {
			em : function log_front_end_em(message, clean) {
				// emphasis
				CeL.Log.log.call(CeL.Log, message, clean, 'em');
			},

			// 致命错误。
			fatal : log_front_end_fatal,

			// 增加 debug 讯息。
			trace : function log_front_end_trace() {
				// 使用 .apply() 预防 override。
				// trace: the least serious
				CeL.debug.apply(CeL, arguments);
			},

			// 切换(显示/隐藏)个别讯息。
			toggle_log : log_front_end_toggle_log,

			assert : log_front_end_assert,
			// CeL.test()
			test : log_front_end_test
		});

		// 处理 loading 本 module 前即已 log 之 message。
		if (Array.isArray(log_buffer) && log_buffer.length > 0) {
			CeL.debug({
				em : 'Before loading ' + module_name
						+ ', there are some debugging message.'
			});
			log_buffer.forEach(function(message) {
				CeL.debug(message);
			});

			CeL.debug('<em>' + module_name + ' loaded.<\/em>');
		}

	}
}
