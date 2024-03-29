
/*
	本档案为自动生成，请勿手动编辑！
	This file is auto created from _structure/structure.js, base.js, module.js, dependency_chain.js, initialization.js
		by auto-generate tool: build.nodejs(.js) @ 2023.
*/

'use strict';

if (typeof CeL !== 'function') {



/**
 * <code>
TODO
将 module_name 改成 arguments
http://threecups.org/?p=129

http://cdnjs.com/

listen language change event
play board

use <a href="http://prototyp.ical.ly/index.php/2007/03/01/javascript-design-patterns-1-the-singleton/" accessdate="2010/4/25 0:23" title="prototyp.ical.ly &amp;raquo; Javascript Design Patterns - 1. The Singleton">Singleton pattern</a>,
Module 模式或单例模式（<a href="http://zh.wikipedia.org/wiki/%E5%8D%95%E4%BE%8B%E6%A8%A1%E5%BC%8F" accessdate="2010/4/25 0:25" title="单例模式">Singleton</a>）<a href="http://www.comsharp.com/GetKnowledge/zh-CN/TeamBlogTimothyPage_K950.aspx" accessdate="2010/4/25 0:24" title="那些相见恨晚的 JavaScript 技巧 - 基于 COMSHARP CMS">为 Douglas Crockford 所推崇</a>，并被大量应用在 Yahoo User Interface Library YUI。

http://wiki.forum.nokia.com/index.php/JavaScript_Performance_Best_Practices
http://ioio.name/core-javascript-pitfalls.html

CommonJS
http://www.heliximitate.cn/studyblog/archives/tag/commonjs





</code>
 */



/**
 * <code>
// TODO
// 2011/7/31 21:18:01




//module

//typeof CeL_id === 'string' && typeof this[CeL_id] === 'function' &&
typeof CeL === 'function' && CeL.run({
name:[module_name],
require:[function_name,module_name],

code:function(CeL){

var private_value=1;

function module_function_1(arg) {
	;
}
module_function_1.required='';


function module_class_1(arg) {
	;
}

function get_value(){
	return private_value;
}

module_class_1.prototype.print=function(){};
module_class_1.print=function(){};


return {module_function_1,module_class_1};

}

});



</code>
 */



// void(
// typeof CeL !== 'function' &&
(
/**
 * We can redefine native values only for undefined.<br />
 * http://weblogs.asp.net/bleroy/archive/2006/08/02/Define-undefined.aspx<br />
 * <br />
 * Will speed up references to undefined, and allows redefining its name. (from
 * jQuery)<br />
 * <br />
 * 用在比较或是 return undefined<br />
 * 在旧的 browser 中，undefined 可能不存在。
 */
function (globalThis) {

	if (false)
		if (typeof globalThis !== 'object' && typeof globalThis !== 'function')
			throw new Error('No globalThis object specified!');

	var
		// https://developers.google.com/closure/compiler/docs/js-for-compiler
		/** @const */ library_name = 'CeL',

		/**
		 * library version.
		 * 
		 * @type {String}
		 * @ignore
		 */
		library_version = '4.5.6',


		/**
		 * default debug level
		 * 
		 * @type {ℕ⁰:Natural+0}
		 * @ignore
		 */
		debug = 0,
		// 原生 console。
		// typeof console !== 'undefined' && console
		has_console = typeof console === 'object'
		//
		&& (typeof console.log === 'function'
		// in IE 8, typeof console.log === 'object'.
		|| typeof console.log === 'object')
		&& typeof console.error === typeof console.log
		&& typeof console.trace === typeof console.log,


		old_namespace,

		// default not_native_keyword.
		KEY_not_native = typeof Symbol === 'function' ? Symbol('not_native') : 'not_native',

		// _base_function_to_extend,

		function_name_pattern;


	// members of library -----------------------------------------------

	// define 'undefined'
	try {
		// undefined === void 0
		if (undefined !== undefined) {
			throw 1;
		}
		// eval('if(undefined!==undefined){throw 1;}');
	} catch (e) {
		// Firefox/49.0 WebExtensions 可能 throw:
		// Error: call to eval() blocked by CSP
		// @see
		// https://developer.mozilla.org/en-US/docs/Archive/Firefox_OS/Firefox_OS_apps/Building_apps_for_Firefox_OS/CSP

		// or: undefined=void 0
		if (e === 1)
			eval('undefined=this.undefined;');
	}


	try {
		old_namespace = globalThis[library_name];
	} catch (e) {
		// throw { message: '' };
		throw new Error(library_name + ': Cannot get the global scope object!');
	}



	if (false) {
		_Global.JustANumber = 2;
		var _GlobalPrototype = _Global.constructor.prototype;
		_GlobalPrototype.JustANumber = 2;
	}

	// 若已经定义过，跳过。因为已有对 conflict 的对策，因此跳过。
	if (false)
		if (globalThis[library_name] !== undefined)
			return;


	/**
	 * Will speed up references to DOM: window, and allows redefining its name.
	 * (from jQuery)
	 * 
	 * @ignore
	 */
	// window = this;


	/**
	 * 本 JavaScript framework 的框架基本宣告。<br />
	 * base name-space declaration of JavaScript library framework
	 * 
	 * @name CeL
	 * @class Colorless echo JavaScript kit/library: library base name-space
	 */
	function _() {
		/**
		 * function CeL: library root<br />
		 * declaration for debug
		 */
		// this.globalThis = arguments[0] || arguments.callee.ce_doc;
		// return new (this.init.apply(globalThis, arguments));
	};

	// if (typeof _.prototype !== 'object')
	_// JSDT:_module_
	.
	/**
	 * framework main prototype definition for JSDT: 有 prototype 才会将之当作 Class
	 */
	prototype = {
	};

	// _.library_version =
	_.version = library_version;
	_.build_date = new Date("2022-12-31T23:38:14.390Z");

	// name-space 归属设定

	_// JSDT:_module_
	.
	get_old_namespace = function () {
		return old_namespace;
	};

	_// JSDT:_module_
	.
	recover_namespace = function () {
		if (old_namespace === undefined)
			delete globalThis[library_name];
		else
			globalThis[library_name] = old_namespace;
		return _;
	};



	_// JSDT:_module_
	.
	/**
	 * JavaScript library framework main class name.
	 * 
	 * @see <a
	 *      href="http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-262.pdf">ECMA-262</a>:
	 *      Object.Class: A string value indicating the kind of this object.
	 * @constant
	 */
	Class = library_name;

	var is_WWW = typeof window === 'object'
		&& (globalThis === window
			// 2021/11/16 e.g., under https://web.archive.org/
			// `window is {Proxy} of `globalThis`
			|| window.window === window && _ === window[library_name])
		// 由条件严苛的开始。
		&& typeof navigator === 'object'
			// Internet Explorer 6.0 (6.00.2900.2180),
			// Internet Explorer 7.0 (7.00.5730.13) 中，
			// navigator === window.navigator 不成立！
			&& navigator == window.navigator
		&& typeof location === 'object'
			&& location === window.location
		// object || function
		&& typeof setTimeout !== 'undefined'
			&& setTimeout === window.setTimeout
		&& typeof document === 'object'
			&& document === window.document
		// 下两个在 IE5.5 中都是 Object
		// && _.is_type(window, 'globalThis')
		// && _.is_type(document, 'HTMLDocument')

		// && navigator.userAgent
	,
	is_W3CDOM =
		is_WWW
		// W3CDOM, type: Object @ IE5.5
		&& document.createElement
		// &&!!document.createElement
		// type: Object @ IE5.5
		&& document.getElementsByTagName;

	_// JSDT:_module_
	.
	/**
	 * Are we in a web environment?
	 * 
	 * @param {Boolean}
	 *            W3CDOM Test if we are in a World Wide Web Consortium (W3C)
	 *            Document Object Model (DOM) environment.
	 * 
	 * @return We're in a WWW environment.
	 * 
	 * @since 2009/12/29 19:18:53
	 * @see use lazy evaluation / lazy loading
	 * @_memberOf _module_
	 */
	is_WWW = function (W3CDOM) {
		return W3CDOM ? is_W3CDOM : is_WWW;
	};


	_// JSDT:_module_
	.
	/**
	 * 本 library 专用之 evaluate()。
	 * 
	 * 若在 function 中 eval 以获得 local variable，在旧 browser 中须加 var。<br />
	 * e.g., 'var local_variable=' + ..<br />
	 * 不加 var 在旧 browser 中会变成 global 变数。
	 * 
	 * @param {String}code
	 *            script code to evaluate
	 * 
	 * @returns value that evaluate process returned
	 * @see window.eval === window.parent.eval
	 *      http://stackoverflow.com/questions/3277182/how-to-get-the-global-object-in-javascript
	 *      http://perfectionkills.com/global-eval-what-are-the-options/
	 */
	eval_code = globalThis.execScript ?
	function (code) {
		// 解决 CeL.run() 在可以直接取得 code 的情况下，于旧版 JScript 可能会以 eval() 来 include，
		// 这将造成 var 的值不会被设定到 global scope。

		// use window.execScript(code, "JavaScript") in JScript:
		// window.execScript() 将直接使用全局上下文环境，
		// 因此，execScript(Str)中的字符串Str可以影响全局变量。——也包括声明全局变量、函数以及对象构造器。

		// window.execScript doesn’t return a value.
		return globalThis.execScript(code, "JavaScript");
	}
	:
	function eval_code(code) {
		/**
		 * JSC eval() takes an optional second argument which can be 'unsafe'.<br />
		 * Mozilla/SpiderMonkey eval() takes an optional second argument which
		 * is the scope object for new symbols.
		 */
		if (false) {
			_.debug(globalThis.eval, 2);
			_.debug(globalThis.eval && globalThis.eval !== arguments.callee);
		}
		// NO globalThis.eval.call(global, code) :
		// http://perfectionkills.com/global-eval-what-are-the-options/

		// TODO: 似乎不总是有用。见 era.htm。
		return globalThis.eval && globalThis.eval !== eval_code ? globalThis.eval(code)
			// QuickJS 2020-04-12 必须把本段注解全部删除，否则不能正常执行。应为 bug。
			// 这种表示法 Eclipse Kepler (4.3.2) SR2 之 JsDoc 尚无法处理。
			: (0, eval)(code);
	};


	try {
		_// JSDT:_module_
		.
		/**
		 * evaluate @ Global scope.<br />
		 * 
		 * By the ECMA-262, new Function() will 'Pass in the Global Environment
		 * as the Scope parameter.'<br />
		 * 
		 * copy from jQuery core.js
		 * 
		 * @param {String}code
		 *            script code to evaluate
		 * 
		 * @returns value that evaluate process returned
		 * @see <a
		 *      href="http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context"
		 *      accessdate="2011/8/6 8:56">Eval JavaScript in a global context |
		 *      Java.net</a> use execScript on Internet Explorer
		 */
		global_eval = new Function('code', 'return '
			+ (
					typeof execScript === 'function' ? 'execScript('
					: is_WWW ? 'window.eval(' : 'eval.call(null,'
			)
			+ 'code)');
	} catch (e) {
		// Firefox/49.0 WebExtensions 可能 throw:
		// Error: call to Function() blocked by CSP
		_.global_eval = function(code) {
			_.error('global_eval: Cannot eval()!');
		};
	}


	// 2019/6/3 18:16:44 CeL.null_Object() → Object.create(null)
	if (typeof Object.create !== 'function') {
		// https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Object/create
		// 先暂时给一个，用于 `Object.create(null)`。
		(Object.create = function create(proto, propertiesObject) {
			// new Object();
			var new_Object = {};
			new_Object.__proto__ = proto;
			if(typeof propertiesObject === "object") {
				Object.defineProperties(new_Object, propertiesObject);
			}
	        return new_Object;
		})[KEY_not_native] = true;
	}

	/**
	 * setup options. 前置处理 options，正规化 read-only 参数。
	 * 
	 * @example<code>
	   //	// 前导作业/前置处理。
	   //	if (!library_namespace.is_Object(options))
	   //		options = Object.create(null);
	   // →
	   //	options = library_namespace.setup_options(options);
	   //	options = library_namespace.setup_options(options, true);
	 * </code>
	 * 
	 * @param {Object}[options]
	 *            附加参数/设定选择性/特殊功能与选项。
	 * @param {Boolean}[new_one]
	 *            重新造出可被更改的选项。当会更改到options时，再设定此项。
	 * 
	 * @returns {Object}选项。
	 * 
	 * @since 2016/3/13 13:58:9
	 */
	function _setup_options(options, new_one) {
		if (options && !new_one) {
			return options;
		}

		// create a new one. copy options.
		// or use Object.clone(options)
		options = Object.assign(Object.create(null), options);
		// 注册为副本。
		options.new_NO = (options.new_NO | 0) + 1;
		return options;
	}
	/**
	 * setup options. 前置处理 options，正规化并提供可随意改变的同内容参数，以避免修改或覆盖附加参数。<br />
	 * 仅用在<b>不会改变</b> options 的情况。
	 * 
	 * @example<code>
	   //	// 前导作业/前置处理。
	   //	if (!library_namespace.is_Object(options))
	   //		options = Object.create(null);
	   // →
	   //	options = library_namespace.setup_options(options);
	 * </code>
	 * 
	 * @param {Object}[options]
	 *            附加参数/设定选择性/特殊功能与选项。
	 * 
	 * @returns {Object}选项。
	 * 
	 * @since 2016/3/13 13:58:9
	 */
	function setup_options(options) {
		if (typeof options === 'string') {
			// e.g., 'bot' → {bot:true}
			// e.g., 'bot|minor' → {bot:true,minor:true}
			var _options = Object.create(null), i = 0;
			for (options = options.split('|'); i < options.length; i++) {
				if (options[i]) {
					_options[options[i]] = true;
				}
			}
			return _options;
		}
		// e.g., number: Invalid option?
		return (typeof options === 'object' /* || typeof options === 'function' */)
		// typeof null === 'object'
		&& options || Object.assign(Object.create(null), options);
	}
	/**
	 * setup options. 前置处理 / clone options，避免修改或覆盖附加参数。<br />
	 * 重新造出可被更改的选项。当会更改到 options 时，再使用此函数。
	 * 
	 * @example<code>

	// 前导作业/前置处理。
	// 重新造一个 options 以避免污染。
	if (!library_namespace.is_Object(options))
		options = Object.create(null);
	// →
	options = library_namespace.new_options(options);
	// 使用新语法。
	options = { ...options };

	</code>
	 * 
	 * @param {Object}[options]
	 *            附加参数/设定选择性/特殊功能与选项。
	 * 
	 * @returns {Object}选项。
	 * 
	 * @since 2016/03/14 16:34:09
	 */
	function new_options(options) {
		// create a new one. copy options.
		// or use Object.clone(options)
		var length = arguments.length;
		if (_.is_Object(options)) {
			if ((new_options.new_key in options) && length === 1) {
				// converted
				return options;
			}
			options = Object.assign(Object.create(null), options);
		} else {
			options = Object.create(null);
		}
		if (length > 1) {
			for(var i = 1; i < length; i++)
				// if (_.is_Object(arguments[i]))
				if (arguments[i])
					Object.assign(options, arguments[i]);
		}
		Object.defineProperty(options, new_options.new_key, {
			// let [new_options.new_key] deletable
			configurable : true,
			// 不允许 enumerable 以避免此属性被使用。
			// enumerable : false
			value : true
		});
		return options;
	}
	new_options.new_key = 'is new options';
	// 不会更动 options 的用此。
	_.setup_options = setup_options;
	// 会更动 options 的用此。
	_.new_options = new_options;


	var modify_function_hash = Object.create(null);

	_// JSDT:_module_
	.
	/**
	 * simple evaluates to get the value of specified variable identifier name.
	 * 
	 * 不使用 eval() 的方法，一层一层 call name-space。
	 * 
	 * BUG: 无论是不是相同 name_space，只要 variable_name 相同，即会执行 modify_function。<br />
	 * 以记忆体空间换取时间效率，会增加记忆体空间之使用。
	 * 
	 * 在两个子层(a.b.c)下，这样作效率较差@Chrome/5.0.375.29:<br />
	 * function(v){try{return(new Function('return('+v+')'))();}catch(e){}}
	 * 
	 * TODO:<br />
	 * 不存在时 throw.
	 * 
	 * @param {String}variable_name
	 *            variable identifier name. e.g., /[a-z\d$_]+(.[a-z\d_]+)+/i
	 * @param {Function}[modify_function]
	 *            注册: 当以 .set_value() 改变时，顺便执行此函数:<br />
	 *            modify_function(value, variable_name).
	 * @param {Object|Function}[name_space]
	 *            initialize name-space. default: globalThis.
	 * @param [value]
	 *            设定 variable 为 value.
	 * 
	 * @returns value of specified variable identifier name
	 * 
	 * @since 2010/1/1 18:11:40
	 * @note 'namespace' 是 JScript.NET 的保留字。
	 * 
	 * @see https://github.com/tc39/proposal-optional-chaining
	 */
	value_of = function (variable_name, modify_function, name_space, value) {
		var variable_name_array;
		if (Array.isArray(variable_name) && variable_name.length > 0) {
			variable_name_array = variable_name;
			variable_name = variable_name.join('.');
			// 在 Object("") 的情况下，typeof this==='object'。此时不可用 typeof。
		} else if (typeof variable_name === 'string' && variable_name)
			variable_name_array = variable_name.split('.');
		else
			// return variable_name: 预防 value_of(null/undefined/NaN)
			return variable_name;

		// _.debug('get value of [' + variable_name + ']');
		if (_.is_Function(modify_function)) {
			if (variable_name in modify_function_hash)
				modify_function_hash[variable_name].push(modify_function);
			else
				modify_function_hash[variable_name] = [modify_function];
		}

		var i = 0,
		// TODO:
		// 可处理如:
		// obj1 . obj2 [ ' obj3.4 * \[ ' ] [''] . obj5 [ " obj6 \" \' \] . " ]
		// or detect obj1 .. obj2
		l = variable_name_array.length,
		v = name_space ||
			// `CeL.env.global`, NOT `CeL.env.globalThis`
			globalThis,
		// do set value
		do_set = arguments.length > 3;
		if (false)
			_.debug('globalThis.' + _.Class + ' = ' + _.env.global[_.Class]);

		if (do_set)
			l--;

		try {
			while (i < l) {
				// _.debug('to [' + variable_name_array[i] + ']: ' +
				// v[variable_name_array[i]]),
				if (variable_name_array[i] in v)
					v = v[variable_name_array[i++]];
				else
					throw 1;
			}

			if (do_set) {
				v[variable_name_array[i]] = value;
				do_set = modify_function_hash[variable_name];
				if (do_set)
					for (i in do_set)
						try {
							do_set[i](value, variable_name);
						} catch (e) {
							// TODO: handle exception
						}
			}

		} catch (e) {
			variable_name_array[i] = '<em>' + variable_name_array[i] + '</em><span class="debug_weaken">';
			if (false)
				alert(_.log.buffer.length + ',' + _.log.max_length + '\n'
						+ _.debug);
			_.debug('Cannot ' + (do_set ? 'set' : 'get') +
					' variable [<span title="' + variable_name + '">' + variable_name_array.join('.') + '</span></span>]!', 2, 'value_of');
			// throw
			return undefined;
		}

		return v;
	};


	_// JSDT:_module_
	.
	/**
	 * simple evaluates to set value of specified variable identifier name.<br />
	 * 不使用 eval().
	 * 
	 * @param {String}variable_name
	 *            variable identifier name. e.g., /[a-z\d$_]+(.[a-z\d_]+)+/i
	 * @param [value]
	 *            设定 variable 为 value.
	 * @param {Object|Function}[name_space]
	 *            initialize name-space. default: globalThis.
	 * 
	 * @returns name-space of specified variable identifier name.<br />
	 *          e.g., return a.b.c when call .set_value('a.b.c.d').
	 * @since 2011/8/27 15:43:03
	 */
	set_value = function (variable_name, value, name_space) {
		return _.value_of(variable_name, null, name_space, value);
	};


	// ------------------------------------------------------------------------

	_// JSDT:_module_
	.
	/**
	 * is index 用, only digits. 整数 >= 0.<br />
	 * cf. Number.isInteger()
	 * 
	 * @param value
	 *            value to test
	 * @returns if value only digits.
	 */
	is_digits = function (value) {
		// 须预防 TypeError: Cannot convert object to primitive value。
		return typeof value !== 'object'
		// value == value | 0
		// value == (value >>> 0)
		&& /^\d+$/.test(value);
	};


	if (false)
		if (!globalThis.is_digits)
			globalThis.is_digits = _.is_digits;


	/**
	 * 测试各 type:
	 * 
	 * undefined:<br />
	 * 变数值存在且变数 'undefined' 存在时: variable === undefined<br />
	 * 否则: typeof(variable) === 'undefined'
	 * 
	 * TODO:<br />
	 * void(1) === void(0) === undefined
	 * 
	 * number, boolean, string:<br />
	 * typeof(variable) === '~'<br />
	 * 
	 * TODO:<br />
	 * NaN<br />
	 * int/float
	 * 
	 * object:<br />
	 * null
	 * 
	 * 不同 frame 中的 Array 拥有不同的 constructor
	 */
	/**
	 * A cache to the function we use to get the type of specified value.<br />
	 * Get the [[Class]] property of this object.<br />
	 * 不使用 Object.toString() 是怕被 overridden
	 * 
	 * @type {Function}
	 * @inner
	 */
	var get_object_type = Function.prototype.bind
		? Function.prototype.call.bind(Object.prototype.toString)
		: function (o) { return Object.prototype.toString.call(o); };

	_.get_object_type = get_object_type;

	_// JSDT:_module_
	.
	/**
	 * 判断为何种 type。主要用在 Error, DOMException 等 native methods / native objects /
	 * built-in objects 之判别。
	 * 
	 * @param value
	 *            variable or class instance to test
	 * @param {String}[want_type]
	 *            type to compare: number, string, boolean, undefined, object,
	 *            function
	 * @param {Boolean}[get_Class]
	 *            get the class name of a class(function) instance.
	 * 
	 * @returns {Boolean} The type is matched.
	 * @returns {String} The type of value
	 * @returns {undefined} error occurred
	 * 
	 * @example<code>

	CeL.is_type(value_to_test, 'Array');

	</code>
	 * 
	 * @since 2009/12/14 19:50:14
	 * @see <a
	 *      href="http://lifesinger.org/blog/2009/02/javascript-type-check-2/"
	 *      accessdate="2009/12/6 19:10">JavaScript类型检测小结（下） - 岁月如歌</a><br />
	 *      <a
	 *      href="http://thinkweb2.com/projects/prototype/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/"
	 *      accessdate="2009/12/6 19:10">Perfection kills &raquo; `instanceof`
	 *      considered harmful (or how to write a robust `isArray`)</a>
	 */
	is_type = function is_type(value, want_type, get_Class) {
		var type;
		if (want_type && (type = typeof want_type) !== 'string')
			want_type = type;

		type = value === null ? String(value) : typeof value;

		if (get_Class)
			try {
				if (type === 'function' && value.Class)
					// get the class name of a class
					// 若 value 为 function 时，测试其本身之 Class。
					type = value.Class;
				else if (type === 'function' || type === 'object')
					if (('constructor' in value) && (get_Class = value.constructor).Class)
						// get the class name of a class instance
						// 若 value 为 function 且无 Class，或为 object 时，测试其
						// constructor 之 Class。
						type = get_Class.Class;
					else if (get_Class = _.get_function_name(get_Class))
						// get Class by function name
						type = get_Class;
			} catch (e) {
				_.error(_.Class + '.is_type: Fault to get ths class name of value!');
			}

		if (type !== 'object')
			// type maybe 'unknown' or 'date'!
			return want_type ? type === want_type.toLowerCase() : type;

		try {
			get_Class = get_object_type(value);
		} catch (e) {
			_.error(_.Class + '.is_type: Fault to get object type of value!');
			get_Class = '';
		}

		if (want_type)
			return get_Class === (want_type.charAt(0) === '[' ? want_type
					: '[object ' + want_type + ']');

		want_type = get_Class.match(/^\[object ([^\]]+)\]$/);
		if (want_type)
			return want_type[1];

		return type;
	};


	_// JSDT:_module_
	.
	/**
	 * get a type test function
	 * 
	 * @example<code>
	 * // 大量验证时，推荐另外在本身 scope 中造出捷径：
	 * _.OtS = Object.prototype.toString;
	 * var is_Person = CeL.type_tester('Person', 'OtS');
	 * // test
	 * if(is_Person(value))
	 *  // it's really a Person object
	 *  ;
	 * </code>
	 * 
	 * @param {String}want_type
	 *            object type to compare
	 * @param {String}[toString_reference]
	 *            a reference name to Object.prototype.toString
	 * 
	 * @returns {Function} type test function
	 * @since 2009/12/20 08:38:26
	 */
	type_tester = function type_tester(want_type, toString_reference) {
		var t = '[object ' + want_type + ']';

		if (false)
		return new Function('v', 'return "' + t + '"==='
				+ (toString_reference ||
				// 在 Google Chrome 中，
				// 'Object.prototype.toString' 可以与其 reference 同速度，
				// 但其他的 reference 会快些。
				'Object.prototype.toString'
				)
				+ '.call(v);');

		return typeof toString_reference === 'string'
			&& toString_reference ?
				new Function('v', 'return "' + t
					+ '"===' + toString_reference + '.call(v);')

				// slow@Chrome
				: function (v) { return t === get_object_type(v); };
				// faster@Chrome
				// : new Function('v', 'return "' + t +
				// '"===Object.prototype.toString.call(v);');

	};

	_// JSDT:_module_
	.
	/**
	 * Test if the value is a native Function.
	 * 
	 * @param v
	 *            value to test
	 * @returns {Boolean} the value is a native Function.
	 * @since 2009/12/20 08:38:26
	 */
	is_Function =
		// _.type_tester('Function');
		function is_Function(v) {
		// typeof 比 Object.prototype.toString 快，
		// 不过得注意有些 native object 可能 type 是 'function'，但不具有 function 特性。
		return get_object_type(v) === '[object Function]';

		// 须注意，在 firefox 3 中，
		// typeof [object HTMLObjectElement] 之外的 HTMLElement 皆 ===
		// 'function'，

		// 因此光用 typeof() === 'function' 而执行下去会得出
		// [XPCWrappedNative_NoHelper] Component is not available

		if (false)
			return typeof v === 'function'
					|| get_object_type(v) === '[object Function]';
	};


	_// JSDT:_module_
	.
	/**
	 * Test if the value is a native ECMAScript Object / plain {Object}. is an
	 * ordinary object.<br />
	 * 去除 null, undefined。 TODO:<br />
	 * test null<br />
	 * BUG: IE8 中 is_Object(ELEMENT_NODE) === true！
	 * 
	 * @param v
	 *            value to test
	 * @returns {Boolean} the value is an ordinary object (a native Object).
	 *          else: exotic object, ECMAScript function object (pure function),
	 *          a primitive value.
	 * @since 2009/12/20 08:38:26
	 */
	is_Object =
		// MSIE 6.0 - 9.0 (JScript 9.0.16450):
		// Object.prototype.toString.call(undefined) === '[object Object]'
		// Object.prototype.toString.call(null) === '[object Object]'
		get_object_type(null) === '[object Object]' || get_object_type(undefined) === '[object Object]' ?
		function is_Object(v) {
			// &&: 除非为必要条件，否则越难达到、评估成本越小的应摆前面。
			return get_object_type(v) === '[object Object]'
			// && typeof v !== 'undefined' && v !== null
			&& v
			// incase CeL.is_Object(new CeL.URI())
			&& (!v.__proto__ || v.__proto__.constructor === Object);
		}
		:
		// _.type_tester('Object');
		function is_Object(v) {
			// 非如此不得与 jQuery 平起平坐…
			return get_object_type(v) === '[object Object]'
			// incase CeL.is_Object(new CeL.URI())
			// (!v.__proto__ || v instanceof Object)
			&& (!v.__proto__ || v.__proto__.constructor === Object);
		};

	_// JSDT:_module_
	.
	is_empty_object = function is_empty_object(value) {
		if (typeof value === 'object') {
			for (var key in value) {
				if (!Object.hasOwn || Object.hasOwn(value, key)) {
					return false;
				}
			}
			return true;
		}
		// return undefined: not object.
	};

	_.is_RegExp = _.type_tester('RegExp');

	// Object.getPrototypeOf
	_.is_Date = false && (new Date).__proto__ === Date.prototype ? function(value) {
		return value && value.__proto__ === Date.prototype;
	} : _.type_tester('Date');


	// ----------------------------------------------------------------------------------------------------------------------------------------------------------//

	function is_version(version_now, version_to_test, exactly) {
		if (!isNaN(version_now)) {
			if (!version_to_test) {
				// 数字化版本号
				return +version_now;
			}
			return exactly ? version_now == version_to_test
					: version_now > version_to_test;
		}

		if (typeof version_now === 'string') {
			version_now = version_now.replace(/^v(?:er)/i, '');
			version_to_test = version_to_test && String(version_to_test).replace(/^v(?:er)/i, '');
			if (exactly) {
				return version_now === version_to_test;
			}
			version_now = version_now.split('.');
			if (!version_to_test) {
				// 数字化版本号 function digitize_version(version)
				// v0.9 → 0.09
				// v0.10 → 0.10
				// v0.12 → 0.12
				// v4.9 → 4.09
				// v15.12.0 → 15.12
				// v16.1 → 16.01
				// 预防: +1.9 > +1.10 == 1.1
				return +version_now[0] + version_now[1] / 100;
			}

			version_to_test = version_to_test.split('.');
			var diff = version_now[0] - version_to_test[0];
			if (diff)
				return diff > 0;

			if (!version_to_test[1])
				return true;
			diff = version_now[1] - version_to_test[1];
			if (diff)
				return diff > 0;

			return !version_to_test[2] || +version_now[2] >= +version_to_test[2];
		}

		if (!version_to_test)
			return version_now;
	}

	/**
	 * 检测 Web browser / engine 相容性，runtime environment 执行环境。
	 * 
	 * Warning: should use CeL.platform('node', '12.10'), NOT
	 * CeL.platform('node', 12.10)
	 * 
	 * @param {String|Object}key
	 *            Web browser / engine name.
	 * @param {String|Number}[version]
	 *            最低版本。
	 * @param {Boolean}[exactly]
	 *            需要准确相同。
	 * 
	 * @returns {Boolean} 相容
	 */
	function platform(key, version, exactly) {
		// CeL.platform({name: version}, exactly);
		var tmp;
		if (_.is_Object(key)) {
			for (tmp in key) {
				// version 当作 exactly
				if (platform(tmp, key[tmp], version))
					return true;
			}
			return false;
		}
	
		key = String(key).toLowerCase();
		if (key in platform.alias)
			key = platform.alias[key];
		// CeL.platform(name, version, exactly);
		tmp = platform.browser;
		if (tmp && tmp.toLowerCase() === key
				&& (!version || is_version(platform.version, version, exactly))) {
			return true;
		}

		tmp = platform.engine;
		if (tmp && tmp.toLowerCase() === key
				&& (!version || is_version(platform.engine_version, version, exactly))) {
			return true;
		}

		tmp = platform.OS;
		if (tmp && tmp.toLowerCase().indexOf(
			//
			key === 'windows' ? 'win' : key) === 0) {
			return true;
		}

		return false;
	};

	platform.alias = {
		ie : 'msie',
		explorer : 'msie',
		'internet explorer' : 'msie'
	};

	platform.toString = function() {
		return platform.browser + ' ' + platform.version;
	};

	try {
		/**
		 * is_nodejs, shortcut for node.js: nodejs version.<br />
		 * Node.js 有比较特殊的 global scope 处理方法。<br />
		 * 有可能为 undefined!
		 * 
		 * @type {String|Undefined}
		 */
		platform.nodejs =
			// typeof global === 'object' &&
			typeof require === 'function' && require('fs')
			//
			&& typeof process === 'object' && typeof process.versions === 'object'
			//
			&& typeof console === 'object' && typeof console.log === 'function'
			// use `CeL.platform('node', version_to_test)`
			// if you want to test the version
			&& process.versions.node;
	} catch(e) {
		// require('fs') error?
	}

	platform.is_Windows = function() {
		// https://www.lisenet.com/2014/get-windows-system-information-via-wmi-command-line-wmic/
		// TODO: `wmic OS get Caption,CSDVersion,OSArchitecture,Version`

		// WMIC is deprecated.
		// https://docs.microsoft.com/zh-tw/dotnet/api/system.environment.osversion
		// nvironment.OSVersion属性不提供可靠的方式，来识别正确的作业系统和它的版本。 因此，我们不建议使用此方法。
		// `PowerShell.exe -Command "&
		// {[System.Environment]::OSVersion.Version}"`

		// Windows: process.platform.toLowerCase().startsWith('win')
		// @see os.version()
		return platform.OS && platform.OS.toLowerCase().indexOf('win') === 0;
	};

	if (is_WWW)
		(function() {
			// e.g., 'Win32'
			platform.OS = navigator.platform;
			// shortcut for Windows
			platform.Windows = platform.is_Windows();
	
			var userAgent = String(navigator.userAgent), matched;
			platform.mobile = /mobile/i.test(userAgent);

			// 特别的网页浏览器放前面。因此 "IE" 应置于后。
			if (matched = userAgent
					.match(/(Chromium|Chrome|Opera|Safari|Firefox|(?:MS)?IE)[\/ ](\d+\.\d+)/i)) {
				platform.browser = matched[1];
				platform.version = +matched[2];
			} else if (matched = userAgent.match(/rv:(\d+\.\d+)/)) {
				// http://msdn.microsoft.com/zh-tw/library/ie/hh869301%28v=vs.85%29.aspx
				// 依赖使用者代理字串的网站应该更新为使用现代技术，例如功能侦测、调适型配置以及其他现代做法。
				// 浏览器版本现在由新的修订版 ("rv") 权杖报告。
				// The revision token indicates the version of IE11
				platform.browser = 'MSIE';
				platform.version = +matched[1];
			}
	
			// Web browser layout engine.
			var tmp = navigator.product;
			if (matched = userAgent
					.match(/(Gecko|WebKit|Blink|KHTML|Presto|Trident)[\/ ](\d+(?:\.\d+))/i)) {
				if (tmp && tmp !== matched[1] && has_console) {
					// e.g., IE 11
					console.error('platform: navigator engine error! [' + tmp
							+ '] != [' + matched[1] + ']');
				}
				platform.engine = matched[1];
				platform.engine_version = +matched[2];
			} else
				// Firefox: Gecko
				platform.engine = tmp;
		})();

	// for node.js: .platform.browser, .platform.is_interactive will setup in
	// _structure/module.js.

	_.platform = platform;

	// ------------------------------------------------------------------------

	var
	// is Microsoft Windows Script Host (WSH)
	script_host = !is_WWW && typeof WScript === 'object';

	// for JScript: 在 IE8, IE9 中，get_object_type(WScript) 为 '[object Object]' !!
	if (script_host = script_host && (!_.is_Object(WScript) || String(WScript) === 'Windows Script Host') && WScript.FullName) {
		_// JSDT:_module_
		.
		/**
		 * the fully qualified path of the host executable.<br />
		 * 'cscript' || 'wscript'
		 * 
		 * @see http://msdn.microsoft.com/en-us/library/z00t383b(v=vs.84).aspx
		 * @_memberOf _module_
		 */
		script_host = script_host = script_host.replace(/^(.+)\\/, '').toLowerCase().replace(/\.exe$/, '');
	}

	// 需要测试的环境 (both old and new; node, WScript, ...)：
	// Unix (e.g., Tool Labs) (included + jsub + interactive 互动形式)
	// Windows console (both included / interactive 互动形式)

	// cache. (('')) for unknown environment.
	var script_full_path = '';

	if (is_WWW) {
		script_full_path = unescape(window.location.pathname) || script_full_path;

	} else if (script_host) {
		// 在 .hta 中取代 WScript.ScriptFullName。
		script_full_path = WScript.ScriptFullName || script_full_path;

	} else if (platform.nodejs) {
		// 2021/4/20 11:36:5 require.main===undefined @ new electron-builder
		// package
		// may use `module.filename`
		if (require.main) {
			// for newer node.js. 须放置于 ((__filename)) 判断前!
			script_full_path = require.main.filename || script_full_path;

		} else if (false /* 20160609 deprecated */) {
			// 以 require('/path/to/node.loader.js') 之方法 include library 时，
			// ((__filename)) 会得到 loader 之 path，
			// 且不能从 globalThis.__filename 获得 script path，只好另寻出路。

			// isTTY: 为 nodejs: interactive 互动形式。
			// 但 isTTY 在 command line 执行程式时也会为 true！
			// && (process.stdout && !process.stdout.isTTY

			// Unix node console 时 include 的话无 require.main，而 __filename 为
			// node.loader.js 之 full path。

			// for old node.js
			// @see __dirname
			script_full_path = typeof __filename === 'string' && __filename || script_full_path;
			// process.argv[1]: 这不一定会包含 path！
			// || process.argv && process.argv[1])

			if (!script_full_path) {
				// debug
				console.error('No script_full_path @ nodejs!');
				console.log(process);
				console.log('require.main: ' + JSON.stringify(require.main));
				console.log('require.main.filename: ' + (require.main && require.main.filename));
				console.log('__filename: ' + __filename);
				console.trace(script_full_path);
			}
		}

	} else if (_.is_Object(old_namespace)) {
		// for jslibs 与特殊环境. 需确认已定义 _.is_Object()
		script_full_path = old_namespace.loader_script || script_full_path;
	}



	_// JSDT:_module_
	.
	/**
	 * 取得执行 script 之 path。
	 * 
	 * @returns {String}执行 script 之 path。
	 * @returns '' Unknown environment
	 */
	get_script_full_name = function () {
		return script_full_path;
	};

	_// JSDT:_module_
	.
	/**
	 * 取得执行 script 之名称(不包括 .js 等 extension).
	 * 
	 * 在有 script 的情况，应该为 script name。<br />
	 * 在 node.js interactive 的情况，应该为 ''。
	 * 
	 * @returns {String} 执行 script 之 名称。
	 * @returns '' unknown environment
	 */
	get_script_name = function (get_file_name) {
		var full_path = _.get_script_full_name(), m = full_path.match(/[^\\\/]*$/);
		return get_file_name ? m[0] : m[0].replace(/\.[^.]*$/, '');
	};

	if (false)
		_// JSDT:_module_
		.
		deprecated_get_script_name = function () {
			// deprecated
			var n, i, j;

			if (script_host) {
				n = WScript.ScriptName;
				i = n.lastIndexOf('.');
				return i === -1 ? n : n.slice(0, i);
			}

			if (is_WWW) {
				n = unescape(window.location.pathname), j = n.lastIndexOf('.');
				if (!(i = n.lastIndexOf('\\') + 1))
					// location.pathname 在 .hta 中会回传 '\' 形式的 path
					i = n.lastIndexOf('/') + 1;
				// return window.document.title;
				return i < j ? n.slice(i, j) : n.slice(i);
			}
		};


	// ----------------------------------------------------------------------------------------------------------------------------------------------------------//
	// 环境变数处理。

	// 先建一个出来以利使用。
	_.env = Object.create(null);

	_// JSDT:_module_
	.
	/**
	 * Setup environment variables. 重新设定环境变数 (environment variables) enumeration
	 * 与程式会用到的 library 相关变数 / configuration。
	 * 
	 * @param {String}[OS_type]
	 *            type of OS
	 * @param {Boolean}[reset]
	 *            reset the environment variables
	 * 
	 * @returns {Object} environment variables set
	 */
	reset_env = function reset_env(OS_type, reset) {
		// CeL.env[环境变数名称]=环境变数之值. this === _ === library_namespace
		var OS, env = !reset && _.env || (_.env = Object.create(null)),
		//
		win_env_keys = 'PROMPT|HOME|PUBLIC|SESSIONNAME|LOCALAPPDATA|OS|Path|PROCESSOR_IDENTIFIER|SystemDrive|SystemRoot|TEMP|TMP|USERNAME|USERPROFILE|ProgramData|ProgramFiles|ProgramFiles(x86)|ProgramW6432|windir'.split('|');

		if (platform.nodejs) {
			// import all environment variables
			Object.assign(env, process.env);
		}

		/**
		 * library main file base name
		 * 
		 * @name CeL.env.main_script_name
		 * @type {String}
		 */
		env.main_script_name = 'ce';

		/**
		 * default extension of script file.<br />
		 * setup_extension @ CeL.get_script_base_path() 可能会再设定一次，侦测为 .txt 的情况。
		 * @type {String}
		 * @see <a
		 *      href="http://soswitcher.blogspot.com/2009/05/blogger-host-javascript-file-for-free.html"
		 *      accessdate="2010/3/11 23:30">Blogger - Host Javascript File for
		 *      Free - Blogger,Javascript - Blogger Blog by Switcher</a>
		 * @name CeL.env.script_extension
		 */
		env.script_extension = '.js';

		/**
		 * library main file name<br />
		 * setup_extension @ CeL.get_script_base_path() 可能会再设定一次，侦测为 .txt 的情况。
		 * 
		 * full path: {@link CeL.env.registry_path} +
		 * {@link CeL.env.main_script}
		 * 
		 * @example<code>
		 * CeL.log('full path: [' + CeL.env.registry_path + CeL.env.main_script + ']');
		 * </code>
		 * 
		 * @name CeL.env.main_script
		 * @type {String}
		 */
		env.main_script = env.main_script_name + env.script_extension;

		/**
		 * module 中的这 member 定义了哪些 member 不被 extend。
		 * 
		 * @name CeL.env.not_to_extend_keyword
		 * @type {String}
		 */
		env.not_to_extend_keyword = 'no_extend';

		/**
		 * 非 native 的 method (native methods / native objects / built-in
		 * objects)， 可由 [KEY_not_native] ([CeL.env.not_native_keyword]) 来判别是否为
		 * native method。<br />
		 * e.g., use Object.defineProperty[CeL.env.not_native_keyword] to test
		 * if the browser don't have native support for Object.defineProperty().
		 * 
		 * @name CeL.env.not_native_keyword
		 * @type {String}
		 */
		env.not_native_keyword = KEY_not_native;

		/**
		 * 本 library source 档案使用之 encoding。<br />
		 * Windows 中不使用会产生语法错误!
		 * 
		 * e.g., 'UTF-16', 'UTF-8'
		 * 
		 * @name CeL.env.source_encoding
		 * @type {String}
		 */
		env.source_encoding = 'UTF-16';

		/**
		 * creator group / 组织名称 organization name
		 * 
		 * @name CeL.env.organization
		 * @type {String}
		 */
		env.organization = 'Colorless echo';

		/**
		 * default globalThis object. 有可能为 undefined!
		 * 
		 * @name CeL.env.globalThis
		 * @type {Object}
		 */
		env.global = globalThis;
		// from now on, `CeL.env.global` 已被覆盖。

		/**
		 * 在 registry 中存放 library 资料的 base path
		 * 
		 * @name CeL.env.registry_base
		 * @type {String}
		 */
		env.registry_base = 'HKCU\\Software\\' + env.organization + '\\' + _.Class
					+ '\\';
		/**
		 * 在 registry 中存放 library 在 File System 中的 base path 的 key name
		 * 
		 * @name CeL.env.registry_base
		 * @type {String}
		 */
		env.registry_path_key_name = env.registry_base + 'path';
		// if(typeof WScript === 'object')
		try {
			// WScript.Echo(env.registry_path_key_name);
			// WScript.Echo(_.get_script_base_path());
			
			var WshShell = WScript.CreateObject("WScript.Shell");
			/**
			 * 存放在 registry 中的 path，通常指的是 library 在 File System 中的 base path。<br />
			 * 将在 setup_library_base_path 以此设定 base path，并以此决定 module path。
			 * 
			 * @name CeL.env.registry_path
			 * @type {String}
			 * @see https://msdn.microsoft.com/en-us/library/x83z1d9f.aspx
			 * 
			 */
			env.registry_path = WshShell.RegRead(env.registry_path_key_name)
			// 去除 filename
			// .replace(/[^\\\/]+$/, '')
			;
			// _.debug(env.registry_path);

			// @see getEnvironment() @ CeL.application.OS.Windows
			var WshEnvironment = WshShell.Environment("Process");
			for (var index = 0; index < win_env_keys.length; index++) {
				var key = win_env_keys[index], value = WshEnvironment(key);
				if (value)
					env[key] = value;
			}

		} catch (e) {
			// _.warn(e.message);
		}

		if (platform.nodejs) {
			// 环境变数 in node.js
			if (false) {
				for (var index = 0; index < win_env_keys.length; index++) {
					var key = win_env_keys[index], value = process.env[key];
					if (value)
						env[key] = value;
				}
			}

			var node_os = require('os');

			if (!env.home
			// home directory 用户个人文件夹 家目录
			&& !(env.home = typeof node_os.homedir === 'function' && node_os.homedir()
			/**
			 * @see https://nodejs.org/api/os.html#os_os_userinfo_options
			 * 
			 * The value of homedir returned by os.userInfo() is provided by the
			 * operating system. This differs from the result of os.homedir(),
			 * which queries environment variables for the home directory before
			 * falling back to the operating system response.
			 * 
			 * os.userInfo() Throws a SystemError if a user has no username or
			 * homedir.
			 */
			|| typeof node_os.userInfo === 'function' && node_os.userInfo() && node_os.userInfo().homedir
			// http://stackoverflow.com/questions/9080085/node-js-find-home-directory-in-platform-agnostic-way
			|| process.env.HOME || process.env.USERPROFILE)
			// e.g., Windows 10
			&& process.env.HOMEDRIVE && process.env.HOMEPATH) {
				/** {String}user home directory */
				env.home = process.env.HOMEDRIVE + process.env.HOMEPATH;
			}

			if (!env.user) {
				env.user = typeof node_os.userInfo === 'function' && node_os.userInfo() && node_os.userInfo().username
				|| process.env.USER || process.env.USERNAME
				// e.g., macOS
				|| process.env.LOGNAME;
			}

			env.line_separator = node_os.EOL || env.line_separator;

			// Release memory. 释放被占用的记忆体。
			node_os = null;
		}

		// 条件式编译(条件コンパイル) for version>=4, 用 /*@ and @*/ to 判别。
		// http://msdn.microsoft.com/en-us/library/ie/8ka90k2e(v=vs.94).aspx
		/**
		 * Conditional compilation is not supported in Internet Explorer 11
		 * Standards mode and Windows Store apps. Conditional compilation is
		 * supported in Internet Explorer 10 Standards mode and in all earlier
		 * versions.
		 */
/**
 * <code>
/*@cc_on
@if(@_PowerPC||@_mac)
OS='Mac';
@else
@if(@_win32||@_win64||@_win16)
OS='Windows';
@else
OS='UNIX'; // unknown
@end
@end@
 */

		/**
		 * 本次执行所在 OS 平台。
		 * 
		 * @name CeL.env.OS
		 * @type {String}
		 */
		env.OS = OS = OS_type || OS
				// @see os.version()
				|| platform.nodejs && process.platform
				// 假如未设定则由 path 判断。
				|| (_.get_script_full_name().indexOf('\\') !== -1 ? 'Windows' : 'UNIX')
				//
				|| env.OS;

		var is_UNIX = env.OS.toLowerCase() in {
			// macOS @ node.js
			darwin : true,
			linux : true,
			freebsd : true,
			unix : true
		};

		/**
		 * 文件预设 line separator / NewLine / new_line / line delimiter。<br />
		 * in VB: vbCrLf
		 * 
		 * @name CeL.env.line_separator
		 * @type {String}
		 */
		env.line_separator =
				is_UNIX ? '\n' : OS === 'Mac' ? '\r'
				// e.g., 'win32'
				: '\r\n';

		/**
		 * file system 预设 path separator。<br />
		 * platform-dependent path separator character, 决定目录(directory)分隔。
		 * 
		 * @name CeL.env.path_separator
		 * @type {String}
		 * 
		 * @see https://stackoverflow.com/questions/125813/how-to-determine-the-os-path-separator-in-javascript
		 */
		env.path_separator =
			platform.nodejs && require('path') && require('path').sep
			|| (is_UNIX ? '/' : '\\');

		if (env.home && !/[\\\/]$/.test(env.home)) {
			// CeL.append_path_separator(CeL.env.home)
			env.home += env.path_separator;
		}

		/**
		 * library 之外部档案 (external source files) 放置地。 纯目录名，不加目录分隔。
		 * 
		 * @name CeL.env.external_directory_name
		 * @type {String}
		 */
		env.external_directory_name = 'external';

		/**
		 * library 之资源文件 (resource files) 放置地。 纯目录名，不加目录分隔。 resources/
		 * 
		 * @name CeL.env.resources_directory_name
		 * @type {String}
		 */
		env.resources_directory_name = 'resources';

		/**
		 * 预设 module name separator。
		 * 
		 * @name CeL.env.module_name_separator
		 * @type {String}
		 */
		env.module_name_separator = '.';
		/**
		 * path_separator pattern in 通用(regular)运算式。
		 * 
		 * @name CeL.env.path_separator_pattern
		 * @type {String}
		 */
		env.path_separator_pattern = _.to_RegExp_pattern ?
				_.to_RegExp_pattern(env.path_separator)
				: (env.path_separator === '\\' ? '\\' : '') + env.path_separator;
		/**
		 * 预设语系。<br />
		 * 0x404:中文-台湾,<br />
		 * 0x0411:日文-日本
		 * 
		 * @name CeL.env.locale
		 * @see <a
		 *      href="http://msdn.microsoft.com/zh-tw/library/system.globalization.cultureinfo(VS.80).aspx">CultureInfo
		 *      类别</a>
		 * @type {Number}
		 */
		env.locale = 0x404;

		/**
		 * script name.
		 * 
		 * @name CeL.env.script_name
		 * @type {String}
		 */
		env.script_name = _.get_script_name();
		/**
		 * base path of script.
		 * 
		 * TODO:<br />
		 * 以 reg 代替
		 * 
		 * @name CeL.env.script_base_path
		 * @type {String}
		 */
		env.script_base_path = _.get_script_full_name()
			// 去除 filename
			.replace(/[^\\\/]+$/, '');

		/**
		 * Legal identifier name in RegExp.<br />
		 * 这 pattern 会占去两个笔纪录: first letter, and least.<br />
		 * .replace(/_/ [g],'for first letter')<br />
		 * .replace(/\\d/,'for least')<br />
		 * 这边列出的只是合法 identifier 的*子集*，且未去除 reserved words!<br />
		 * 请注意实际判别须加入 ^..$
		 * 
		 * 不用 \d 而用 0-9 是因为 \d 还包括了 MATHEMATICAL BOLD DIGIT。<br />
		 * <a href="http://blog.est.im/archives/3229" accessdate="2010/11/16
		 * 20:6">基于正则的URL匹配安全性考虑</a>
		 * 
		 * @name CeL.env.identifier_RegExp
		 * @type {RegExp}
		 * @see ECMA-262 7.6 Identifier Names and Identifiers
		 */
		env.identifier_RegExp = /([a-zA-Z$_]|\\u[0-9a-fA-F]{4})([a-zA-Z$_0-9]+|\\u[0-9a-fA-F]{4}){0,63}/;

		/**
		 * Legal identifier name in String from env.identifier_RegExp.
		 * 
		 * @name CeL.env.identifier_String
		 */
		env.identifier_String = env.identifier_RegExp.source;

		// test for-of statement (IterationStatement)
		try {
			env.has_for_of = new Function('for(var i of [7])return i===7;')();
		} catch (e) {
			// TODO: handle exception
		}

		// arrow function
		try {
			env.has_arrow_function = new Function('a','return((a)=>a+1)(a);')(2) === 3;
		} catch (e) {
			// TODO: handle exception
		}

		// RegExp lookbehind assertions
		// from ECMA-262, 9th edition, ECMAScript 2018
		try {
			env.has_RegExp_lookbehind = '$12.34'.match(new RegExp('(?<=\\D)\\d+'))[0] === '12'
				// http://2ality.com/2017/05/regexp-lookbehind-assertions.html
				&& 'a1ba2ba3b'.match(new RegExp('(?<=b)a.b', 'g')).join(',') === 'a2b,a3b'
				&& '0b11b22b33b4'.match(new RegExp('(?<!1)b\\d', 'g')).join(',') === 'b1,b3,b4';
		} catch (e) {
			// TODO: handle exception
		}

		// BigInt
		try {
			env.has_bigint = typeof BigInt === 'function' && typeof BigInt(1) === 'bigint'
				&& eval('999999n*8888888n*777777777n===6913572635062427358024n');
		} catch (e) {
			// TODO: handle exception
		}

		// ** 亦即，所有预先设定 (configuration) 应该放置于 CeL.env 之下。
		// 把 old_namespace.env 下原先的环境设定 copy 过来。
		// 例如用在直接读取档案内容并 eval()，要设定 env.script_extension, env.main_script 的情况。
		if (_.is_Object(old_namespace) && _.is_Object(old_namespace.env)) {
			Object.assign(env, old_namespace.env);
		}

		return env;
	};


	_// JSDT:_module_
	.
	// TODO
	get_identifier_RegExp = function (pattern, flag, add_for_first_letter, add_for_all_letter) {
		var s = _.env.identifier_String;
		if (add_for_first_letter)
			s = s.replace(/_/g, add_for_first_letter);
		if (add_for_all_letter)
			s = s.replace(/0-9/g, add_for_all_letter);

		return new RegExp(
				(get_object_type(pattern) === '[object RegExp]' ? pattern.source : pattern)
					.replace(/$identifier/g, s), flag || '');
	};


	// ----------------------------------------------------------------------------------------------------------------------------------------------------------//

	/**
	 * setting pair.<br />
	 * 提供给函数设定 flag / optional argument 处理用。
	 * 
	 * @example <code>

	var setting = setting_pair({});

	 * </code>
	 * 
	 * @param default_setting
	 *            预设 setting.
	 * 
	 * @returns {Function}
	 */
	function setting_pair(default_setting) {
		var setting_now = default_setting || Object.create(null),
		setting_handle = function (name, value) {
			if (_.is_Object(name)) {
				// setter
				for (var i in name) {
					// _.debug('[' + i + ']=[' + name[i] + ']'),
					if (typeof name[i] !== 'undefined')
						setting_now[i] = name[i];
					else if (i in setting_now)
						delete setting_now[i];
				}
				return setting_now;
			}

			if (Array.isArray(name)) {
				// getter
				var r = [];
				name.forEach(function (n, i) {
					if (n in setting_now)
						r[i] = setting_now[n];
				});
				return r;
			}

			if (false)
				if (arguments.length > 1)
					_.debug('[' + name + ']=[' + value + ']');
			return arguments.length > 1 ? (setting_now[name] = value)
					: name ? setting_now[name] : setting_now;
		};
		setting_handle.reset = function (setting) {
			return setting_now = setting || Object.create(null);
		};

		// additional setting.
		for (var i = 1, length = arguments.length, o; i < length; i++)
			if (_.is_Object(o = arguments[i]))
				setting_handle(o);

		return setting_handle;
	}


	/**
	 * <code>

	setting_pair.prototype.handle = function(name, value) {
		var setting_now = this.setting_now;

		if (_.is_Object(name)) {
			// setter
			for ( var i in name) {
				//_.debug('[' + i + ']=[' + name[i] + ']'),
				if(typeof name[i] !== 'undefined')
					setting_now[i] = name[i];
				else if(i in setting_now)
					delete setting_now[i];
			}
			return setting_now;
		}

		if (Array.isArray(name)) {
			// getter
			var i, r = [], n;
			for (i in name) {
				n = name[i];
				if (n in setting_now)
					r[i] = setting_now[n];
			}
			return r;
		}

		//if(arguments.length > 1) _.debug('[' + name + ']=[' + value + ']');
		return arguments.length > 1 ? (setting_now[name] = value)
				: setting_now[name];
	};
	setting_pair.prototype.reset = function(setting) {
		return this.setting_now = setting || Object.create(null);
	};

	</code>
	 */


	_// JSDT:_module_
	.
	setting_pair = setting_pair;

	// ----------------------------------------------------------------------------------------------------------------------------------------------------------//
	// for debug & log.


	_// JSDT:_module_
	.
	/**
	 * Tell if it's now debugging.
	 * 
	 * @param {ℕ⁰:Natural+0}[debug_level]
	 *            if it's now in this debug level.
	 * 
	 * @returns {Boolean} It's now in specified debug level.
	 * @returns {ℕ⁰:Natural+0} It's now in what debug level (Integer).
	 */
	is_debug = function (debug_level) {
		return typeof debug_level !== 'number' ? debug || 0
				: debug >= debug_level;
	};

	_// JSDT:_module_
	.
	/**
	 * Set debugging level
	 * 
	 * @param {ℕ⁰:Natural+0}[debug_level]
	 *            The debugging level to set.
	 * 
	 * @type {ℕ⁰:Natural+0}
	 * @returns {ℕ⁰:Natural+0} debugging level now
	 */
	set_debug = function (debug_level) {
		if (!isNaN(debug_level))
			debug = Math.max(0, debug_level);

		else if (typeof debug_level === 'undefined' && !debug)
			debug = 1;

		if (Error.stackTraceLimit > 0) {
			// Node.js: default: 10
			Error.stackTraceLimit = debug > 2 ? 100 : debug > 0 ? 15 : 10;
		}

		return debug;
	};





	_// JSDT:_module_
	.
	/**
	 * Get the hash key of text.
	 * 
	 * @param {String}text
	 *            text to test
	 * 
	 * @returns {String} hash key
	 */
	_get_hash_key = function (text) {
		// text = String(text);
		// text = '' + text;
		var l = text.length, take = 30, from = .3;
		from = Math.floor(l * from);
		if (false)
			_.log(from + '~' + l + ': '
					+ (l - from < take ? text : text.substr(from, take)));
		return l - from < take ? text : text.substr(from, take);
	};

	/**
	 * <code>

	Chrome/22.0.1229.64
	fast->slow:
	(1000000*Math.random())>>>0
		but int32 only
	parseInt(1000000*Math.random())
	Math.floor(1000000*Math.random())

	</code>
	 */



	// for JScript<=5
	try {
		// @deprecated /^\s*function[\s\n]+(\w+)[\s\n]*\(/
		// ^\\s*: JScript 6-9 native object 需要这个。
		// function_name_pattern = new
		// RegExp('^\\s*function[\\s\\n]+(\\w+)[\\s\\n]*\\(');

		_.PATTERN_function = function_name_pattern =
		// [ all, function name, function arguments, function body ]
		/^\s*function(?:[\s\n]+([^\s\n]*?)[\s\n]*)?\([\s\n]*([^)]*?)[\s\n]*\)[\s\n]*{[\s\n]*([\s\S]*)[\s\n]*}[\s\n;]*$/;

		// TODO: arrow function expression
		// [ all, function arguments, function body ]
		// e.g., "(n) => {return n>0;}"
		/^\s*\([\s\n]*([^)]*?)[\s\n]*\)[\s\n]*=>[\s\n]*{[\s\n]*([\s\S]*)[\s\n]*}[\s\n;]*$/;

	} catch (e) {
		function_name_pattern = function emulate_function_name(fs) {
			fs = String(fs);
			var l = 'function ', r, s;

			if (fs.indexOf(l) === 0) {
				l = l.length;
				s = {
					' ': 1,
					'\n': 1,
					'\r': 1,
					'\t': 1
				};
				while (fs.charAt(l) in s)
					l++;
				r = fs.indexOf('(', l);
				while (fs.charAt(--r) in s) { }

				return [, fs.slice(l, r + 1)];
			}
		};
		// TODO
		if (typeof RegExp !== 'object')
			globalThis.RegExp = function () { };
	}

	/**
	 * 获得函数名。
	 * 
	 * @param {Function}fr
	 *            function reference
	 * @param {String}ns
	 *            name-space
	 * @param {Boolean}force_load
	 *            force reload this name-space
	 * 
	 * @returns
	 * @see 可能的话请改用 {@link CeL.native.parse_function}(F).funcName
	 * @since 2010/1/7 22:10:27
	 */
	function get_function_name(fr, ns, force_load) {
		if (!fr)
			try {
				fr = arguments.caller;
			} catch (e) {
				if (!fr)
					return '';
			}

		if (fr.name)
			return fr.name;

		var
		// 初始化变数 'm'。
		// 不用 insteadof 是怕传入奇怪的东西，例如 {String} script code.
		m = typeof fr,
		// function body text (函数的解译文字)
		ft, b, load, k, i;

		if (m === 'function') {
			// 勿更改传入之 argument
			if(false){
				if ('toString' in fr) {
					m = fr.toString;
					delete fr.toString;
				}
				ft = String(fr);
				if (m)
					fr.toString = m;
			}

			// TODO: cache Function.prototype.toString
			ft = Function.prototype.toString.call(fr);
		} else if (m === 'string')
			// typeof fr === 'string'
			ft = fr;
		else
			return '';

		// 以函数的解译文字获得函数名
		m = _.is_RegExp(function_name_pattern) ?
				// 包含引数: + '(' + (f ? m[2] : '') + ')';
				((m = ft.match(function_name_pattern)) && m[1] || /^[a-zA-Z_\d.]{1,30}$/.test(ft) && ft || 0)
				: function_name_pattern instanceof Function ?
					function_name_pattern(ft)
					: 0;
		if (m) {
			// _.debug('matched ' + m, 1, _.Class + '.get_function_name');
			return m;
		}
		// 无法从 function code 本身得到 name 之资讯。
		// 匿名函数?

		// 查询是否是已注册之 function。
		b = get_function_name.b;
		if (b)
			load = get_function_name.ns;
		else
			get_function_name.b = b = Object.create(null), get_function_name.ns = load = Object.create(null);

		if (!ns)
			ns = _;

		// cache functions
		if ((_.is_Function(ns) || _.is_Object(ns)) && ns.Class
						&& (force_load || !load[ns.Class])) {
			for (i in ns)
				if (typeof ns[i] === 'function') {
					k = _._get_hash_key(String(ns[i]));
					m = ns.Class + _.env.module_name_separator + i;
					// _.debug(m + ': ' + k + (', ' + ns[i]).slice(0, 200));
					if (!(m in load)) {
						load[m] = 1;
						if (!b[k])
							b[k] = [];
						b[k].push([m, ns[i]]);
					}
				}
			load[ns.Class] = 1;
		}

		// 将函数与 cache 比对以获得函数名。
		// TODO: Array.prototype.indexOf()
		m = b[_._get_hash_key(ft)];
		if (m)
			for (i = 0; i < m.length; i++) {
				b = m[i][1];
				if (// typeof fr === 'function' &&
						fr === b || ft === String(b))
					return m[i][0];
			}

		return '';// '(unknown)';
	};

	_// JSDT:_module_
	.
	get_function_name = get_function_name;


	// noop
	_// JSDT:_module_
	.
	null_function =
		// new Function;
		function () { };


	_// JSDT:_module_
	.
	constant_function = function(value) {
		value = String(value);

		if (!(value in constant_function)
			// true/false/Number/null/undefined/global variables only!
			// && ((value in globalThis) || !isNaN(value))
			) {
			constant_function[value] = new Function('return(' + value + ')');
		}
		return constant_function[value];
	};

	try {
		_.constant_function(false);
	} catch (e) {
		// Firefox/49.0 WebExtensions 可能 throw:
		// Error: call to Function() blocked by CSP
		_.constant_function = function(value) {
			return function() {
				return value;
			};
		};
	}

	// ---------------------------------------------------------------------//
	// Initialization

	// ---------------------------------------------------------------------//
	// 处理 styled/stylized messages.
	// @see
	// https://stackoverflow.com/questions/22155879/how-do-i-create-formatted-javascript-console-log-messages

	/**
	 * 将 messages 去掉 style，转成 plain text messages。
	 * 
	 * @param {Array}messages
	 *            附加格式的讯息。 messages with style.
	 * 
	 * @returns {String}plain text messages.
	 */
	function SGR_to_plain(messages) {
		return Array.isArray(messages) ? messages.filter(function(message, index) {
			return index % 2 === 0;
		}).join('')
		// '' + messages
		: messages;
	}

	/** {Object}cache for CeL.interact.console.SGR */
	var SGR, SGR_debug;

	/**
	 * 在已经存在 SGR 的功能下，以之格式化讯息。
	 * 
	 * @param {Array}messages
	 *            附加格式的讯息。 messages with style. 将当作 new SGR() 之 arguments。
	 * 
	 * @returns {String}formatted messages. 格式化后的讯息。
	 * 
	 * @see 'interact.console'
	 */
	function new_SGR(messages) {
		// 注意: 在 call stack 中有 SGR 时会造成:
		// RangeError: Maximum call stack size exceeded
		// 因此不能用于测试 SGR 本身! 故须避免之。
		// CeL.is_debug(min_debug): assert: SGR 在这 level 以上才会呼叫 .debug()。
		// TODO: 检测 call stack。
		return _.is_debug(SGR_debug)
		// 若 SGR.CSI 被改过，则即便显示亦无法得到预期之结果，不如跳过。
		|| SGR.CSI !== SGR.default_CSI ? SGR_to_plain(messages)
		// 显示具格式（如 color 颜色）的 messages。
		: new SGR(messages).toString();
	}

	/**
	 * 处理 console 之 message。添加主控端报告的显示格式（如 color 颜色）。<br />
	 * 若无法执行 new SGR()，则会将 messages 转成 plain text。实作部分详见 SGR。
	 * 
	 * @param {Array}messages
	 *            附加格式的讯息。 messages with style.
	 * 
	 * @returns {String}格式化后的讯息。
	 * 
	 * @see to_SGR() @ 'application.debug.log'
	 */
	function to_SGR(messages) {
		if (_.SGR) {
			SGR = _.SGR;
			SGR_debug = SGR.min_debug_level;
			return (_.to_SGR = new_SGR)(messages);
		}
		// 将 messages 去掉 style，转成 plain text messages。
		return SGR_to_plain(messages);
	}

	// 在 WWW 的环境下，则直接 pass style 设定。
	_.to_SGR = is_WWW ? SGR_to_plain : to_SGR;

	// --------------------------------

	var
	/** {RegExp}是否具有 caller。能辨识纪录之 caller。须排除"C:\"之类。 */
	PATTERN_log_caller = /^([a-z_\d.]{2,}:\s*)([\s\S]+)$/i,
	/** {Boolean}使用 styled 纪录。 */
	using_style = !_.env.no_log_style,
	/** {Object}default style of console. */
	default_style = {
		// trace : '',
		// debug 另外设定。
		// debug : '',
		log : 'green',
		// information
		info : 'cyan',
		// warning
		warn : 'yellow',
		error : 'red;bg=white'
	};

	// a simple simulation of CeL.application.locale.gettext
	// Please include application.locale if you need a full version.
	// cache gettext only inside sync function, or using CeL.gettext instead:
	// application.locale 会自动 overwrite .gettext。
	// 假如多次使用，不如直接 include application.locale。
	function simple_gettext(text_id) {
		if (false && _.locale && _.locale.gettext) {
			_.gettext = _.locale.gettext;
			return _.gettext.apply(null, arguments);
		}

		// a simplified version
		// assert: typeof text_id === 'string'
		var arg = arguments;
		return text_id.replace(/%(\d+)/g, function(all, NO) {
			return NO < arg.length ?
			// extract_message_from_nodes(arg[NO])
			arg[NO] : all;
		});
	}

	_.gettext = simple_gettext;

	/**
	 * @example <code>

	var gettext = CeL.cache_gettext(function(_) { gettext = _; });
	var gettext = CeL.cache_gettext(_ => gettext = _);

	 </code>
	 */
	_.cache_gettext = function(adapter) {
		return function _gettext() {
			var gettext = _.locale && _.locale.gettext;
			if (gettext) {
				adapter(gettext);
			} else {
				gettext = simple_gettext;
			}

			return gettext.apply ? gettext.apply(null, arguments)
			// 这方法没有准确符合arguments的长度，有缺陷。
			: gettext(arguments[0], arguments[1], arguments[2], arguments[3]);
		};
	};

	if (platform.nodejs && process.versions) {
		process.versions[library_name.toLowerCase()] = library_version;
		if (using_style === undefined) {
			// 若为 nodejs，预设使用 styled 纪录。
			// using_style = _.platform.nodejs
			using_style = !!process.versions.node;
		}
	}

	function is_DOM_node(node) {
		return _.is_Object(node) && ('T' in node
		// || 'span' in node
		);
	}

	// 在没有载入 new_node() @ CeL.DOM 的情况下尝试解析 DOM object
	function extract_message_from_nodes(nodes, style_array) {
		if (Array.isArray(nodes)) {
			// nodes.forEach()
			for (var index = 0; index < nodes.length; index++) {
				var node = nodes[index];
				nodes[index] = extract_message_from_nodes(node, style_array);
				if (_.gettext.append_message_tail_space && node && node.T) {
					var inner = nodes[index + 1];
					// 只是简易处理，不完善。
					// @see CeL.interact.DOM.new_node()
					inner = _.gettext.apply(null, Array.isArray(inner) ? inner : [ inner ]);
					nodes[index] = _.gettext.append_message_tail_space(nodes[index], {
						no_more_convert : true,
						next_sentence : inner
					});
				}
			}
			return nodes.join('');
		}

		if (!_.is_Object(nodes)) {
			if (style_array) {
				style_array.push(style_array.has_style ? [
				style_array.has_style.fg ? '-fg' : '',
				style_array.has_style.bg ? '-bg' : ''].join(';') : '', nodes);
				if (style_array.has_style)
					style_array.has_style = true;
			}
			return nodes;
		}

		var tag_name = nodes.$;
		if (!tag_name) {
			for (tag_name in nodes) {
				break;
			}
		}

		var inner = nodes[tag_name];
		if (tag_name !== 'T') {
			inner = extract_message_from_nodes(inner);
		} {
			inner = _.gettext.apply(null, Array.isArray(inner) ? inner : [ inner ]);
		}

		var color_index = _.SGR && _.SGR.color_index,
		//
		style = color_index && (nodes.style || nodes.S);
		// console.log(style);
		// parse CSS to SGR color style
		if (typeof style === 'string') {
			style.replace(/(?:^|[;\s])(background-)?color\s*:\s*([^\s;]+)/g, function(all, bg, color) {
				color = color.toLowerCase();
				if (!(color in color_index))
					return;
				if (typeof style === 'string') {
					style = Object.create(null);
				}
				style[bg ? 'bg' : 'fg'] = color;
			});
			if (typeof style === 'string') {
				style = '';
			}
		} else if (style && ((style.color in color_index)
			|| (style.backgroundColor in color_index))) {
			style = {
				fg : (style.color in color_index) && style.color || '',
				bg : (style.backgroundColor in color_index) && style.backgroundColor || ''
			};
		} else
			style = '';

		if (style_array) {
			style_array.push(style, inner);
			if (style)
				style_array.has_style = style;
		}
		// 不再传入 style_array
		return inner;
	}

	/**
	 * 预先处理 log messages。
	 * 
	 * TODO: 判别 console 是否具备 stylify/着色功能。
	 * 
	 * @param {Array|String}messages
	 *            欲记录讯息。
	 * @param {Boolean}[from_styled_logger]
	 *            caller is styled logger.
	 * 
	 * @returns {Array}styled messages
	 */
	function preprocess_log_messages(messages, type, from_styled_logger) {
		// console.log(using_style);
		// console.trace(messages);
		if (!using_style) {
			// 不采用 styled log。不自动着色。
			return typeof messages === 'string' ? messages : SGR_to_plain(messages);
		}

		var style_array;
		if (Array.isArray(messages)) {
			// messages.forEach()
			for (var index = 0; index < messages.length; index++) {
				if (is_DOM_node(messages[index])) {
					style_array = true;
					break;
				}
			}

		} else if (is_DOM_node(messages)) {
			style_array = true;
		}
		if (style_array) {
			// 从头到尾没有特殊格式的话，就转成纯粹的字串。
			messages = extract_message_from_nodes(messages, style_array = [ '' ]);
			if (style_array.has_style) {
				// reset style
				if (_.is_Object(style_array.has_style)) {
					style_array.push([
		  				style_array.has_style.fg ? '-fg' : '',
  						style_array.has_style.bg ? '-bg' : ''].join(';'), '');
				}
				messages = style_array;
			}
			// console.trace(style_array);
		}

		var matched;
		if (typeof messages === 'string') {
			// 自动着色。
			matched = messages.match(PATTERN_log_caller);
			if (matched) {
				// e.g., CeL.log("function_name: messages");
				messages = [ matched[1], default_style[type], matched[2], 0 ];
			} else {
				messages = [ '', default_style[type], messages, 0 ];
			}

		} else if (from_styled_logger) {
			// assert: Array.isArray(messages)
			// 自动着色。
			// TODO: 效果不佳。
			matched = messages[0].match(PATTERN_log_caller);
			if (matched) {
				// e.g., CeL.log([ 'function_name: messages 0', 'style',
				// 'messages 1' ]);
				messages.splice(0, 1, '', default_style[type], matched[1], 0, matched[2]);
				// 最后设定 reset，避免影响到后头之显示。
				if (messages.length % 2 === 0)
					messages.push('', 0);
				else
					messages.push(0);
			}
		}

		return _.to_SGR(messages);
	}

	_.preprocess_log_messages = preprocess_log_messages;

	/**
	 * 不能放在 if (has_console) {} 中 @ node.js v0.10.25:
	 * 
	 * <code>
	   SyntaxError: In strict mode code, functions can only be declared at top level or immediately within another function.
	   </code>
	 */
	function setup_log(type) {
		// 将 CeL[type] 转成 console[_type]。
		var _type = type;
		if (!console[_type])
			// e.g., 不见得在所有平台上都有 console.info() 。
			return;

		_[type] = function(messages, clear) {
			if (clear && console.clear)
				console.clear();
			// IE8 中，无法使用 console.log.apply()。
			// return console[type].apply(console, arguments);
			console[_type](preprocess_log_messages(messages, type));
		};

		/**
		 * setup frontend of styled messages. 使可输入 CeL.s*().
		 * 
		 * <code>
		   CeL.slog([ 'CeJS: This is a ', 'fg=yellow', 'styled', '-fg', ' message.' ]);
		   CeL.sinfo('CeJS: There are some informations.');
		   </code>
		 */
		_['s' + type] = function(messages, clear) {
			if (clear && console.clear)
				console.clear();
			console[_type](preprocess_log_messages(messages, type, true));
		};
	}

	// temporary decoration of debug console,
	// in case we call for nothing and raise error
	if (has_console) {
		_.env.has_console = has_console;

		// 利用原生 console 来 debug。
		// 不直接指定 console.*: 预防 'Uncaught TypeError: Illegal invocation'.

		(function() {
			for ( var type in default_style) {
				// default style: foreground 前景
				default_style[type] = 'fg=' + default_style[type];
				setup_log(type);
			}
		})();

		// caller: from what caller
		_.debug = function (messages, level, caller) {
			if (!_.is_debug(level))
				return;

			if (caller) {
				caller = _.get_function_name(caller) + ': ';
				if (typeof messages === 'object') {
					if (Array.isArray(messages)) {
						// e.g., CeL.debug([{T:'msg'},'msg2'],1,'caller');
						messages.unshift(caller);
					} else {
						// e.g., CeL.debug({T:'msg'},1,'caller');
						messages = [ caller, messages ];
					}
				} else {
					// e.g., CeL.debug('msg',1,'caller');
					messages = caller + messages;
				}
			}
			// console.trace()
			console.log(preprocess_log_messages(messages, 'debug'));
		};
		// styled logger
		_.sdebug = function (messages, level, caller) {
			if (!_.is_debug(level))
				return;
			if (caller) {
				if (!Array.isArray(messages))
					// assert: (typeof messages === 'string')
					messages = [ messages ];
				messages.unshift('fg=blue', _.get_function_name(caller) + ': ', 0);
				messages = _.to_SGR(messages);
			} else {
				messages = preprocess_log_messages(messages, 'debug', true);
			}
			// console.trace()
			console.log(messages);
		}

	} else {
		_.error = _.warn = _.log = function (message) {
			/**
			 * 请注意:<br />
			 * _.log.buffer === this.log.buffer !== log.buffer<br />
			 * 
			 * 在 WScript 中 需要用 _.log，其他则可用 log。<br />
			 * 因此应该将所有类似的值指定给双方，并注意不是[常数]的情况。
			 */
			var _s = _.log;
			// _s.function_to_call.apply(null,arguments);
			// _s.function_to_call.apply(globalThis, arguments);

			_s.buffer.push(message);

			if (!(_s.max_length >= 0))
				_s.max_length = 0;

			// 没加 'debug &&' 在 IE 中会跳出大量 alert.
			if (debug && _s.buffer.length > _s.max_length) {
				_s.function_to_call.call(globalThis, _s.buffer.join('\n\n'));
				// reset buffer
				_s.buffer = [];
			}
		};

		_.debug = function (message, level, from) {
			if (_.is_debug(level))
				return _.log((from && (from = _.get_function_name(from)) ? from + ': ' : '[debug] ') + message);
		};

		/**
		 * test:<br />
		 * var k=function l(){alert(l.m);};k.m=1;alert(l.m+','+k.m);k();
		 * 
		 * JScript 中<br />
		 * k();<br />
		 * 为 undefined, 其他会把 "l." 代换成 "k."？
		 * 
		 * @inner
		 */
		// _.debug.buffer = _.error.buffer = _.warn.buffer =
		_.log.buffer = [];


		// _.debug.max_length = _.error.max_length = _.warn.max_length =
		_.log.max_length = 0;
		// if(!isNaN(CeL.log.max_length)) CeL.log.max_length = 20;


		var max_log_length = 1000,
		prepare_message = function (message) {
			message = String(message);
			if (message.length > 2 * max_log_length)
				message = message.slice(0, max_log_length) + '\n\n...\n\n' + message.slice(-max_log_length);
			return message;
		};

		// _.debug.function_to_call = _.error.function_to_call =
		// _.warn.function_to_call =

		_.log.function_to_call =
			// console 已在前面特别处理，以作美化。
			// typeof JSalert === 'function' ? JSalert :
			script_host ?
				function (message) { WScript.Echo(prepare_message(message)); } :
			// for jslibs
			typeof _configuration === 'object' && typeof _configuration.stdout === 'function' ?
				function (message) { _configuration.stdout(prepare_message(message) + '\n'); } :
			// for JSDB
			typeof writeln === 'function' ?
				function (message) { writeln(prepare_message(message)); } :
			// 预设以讯息框代替。
			typeof alert === 'object' || typeof alert === 'function' ?
				function (message) { alert(prepare_message(message)); } :
			// 无任何可用之反映管道。
			_.null_function;
	}

	// cache
	_.debug_console = function debug_console() {};
	_.debug_console.log = _.log;
	_.debug_console.warn = _.warn;
	_.debug_console.error = _.error;
	_.debug_console.debug = _.debug;

	// CeL.log_temporary(): temporary message
	// console_message(), log_status(), interactive_message()
	// Will re-set @ set_initializor() @ module.js
	_.log_temporary = _.null_function;

	// ---------------------------------------------------------------------//
	// 补强 (shim, polyfill) 用的 functions。
	// setup Object.defineProperty()

	/**
	 * 修改/加入属性 propertyKey 至物件 object。<br />
	 * shim for 先前过旧的版本。
	 * 
	 * @param {Object|Function}object
	 *            要加入或修改属性的目标物件。
	 * @param {String}propertyKey
	 *            属性名称。
	 * @param {Object}attributes
	 *            属性的描述元。
	 * @returns 目标物件 object。
	 * 
	 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
	 */
	function defineProperty(object, propertyKey, attributes) {
		if ('value' in attributes) {
			object[propertyKey] = attributes.value;

		} else if (typeof attributes.get === 'function') {
			try {
				object[propertyKey] = attributes.get();
				if (_.is_debug(2))
					_.warn('Object.defineProperty: 将设定成 get() 所得之值 ['
							+ object[propertyKey] + ']！');
			} catch (error) {
				// TODO: handle exception
			}
			// ignore .set
		}
		// else: nothing to set.

		return object;
	}
	defineProperty[KEY_not_native] = true;

	if (typeof Object.defineProperty !== 'function') {
		// 会动到原来的 Object.defineProperty。
		Object.defineProperty = defineProperty;
	} else {
		try {
			(function () {
				// workaround for Object.defineProperty @ IE8
				// http://kangax.github.com/es5-compat-table/
				// In Internet Explorer 8 Object.defineProperty only accepts DOM
				// objects (MSDN reference).
				// http://blogs.msdn.com/b/ie/archive/2010/09/07/transitioning-existing-code-to-the-es5-getter-setter-apis.aspx
				// Trying to use Object.defineProperty() on native objects
				// throws an error.
				var o = {};
				if (Object.defineProperty({}, 'p', { value : o }).p !== o)
					throw 1;

			})();

		} catch (e) {
			// backup original Object.defineProperty.
			var _defineProperty = Object._defineProperty = Object.defineProperty;
			// copy from interact.DOM
			// for IE5-8
			(Object.defineProperty = function IE5_to_8_defineProperty(target, propertyKey, attributes) {
				if (Object.prototype.toString.call(target) === '[object Object]'
					// e.g., IE 5-8. 这种判别方法有漏洞!
					&& typeof target.nodeType === 'number')
					try {
						return _defineProperty(target, propertyKey, attributes);
					} catch (e) {
					}

				// 不作错误侦测: 不能设定，就直接 throw。
				return defineProperty(target, propertyKey, attributes);
			})[KEY_not_native] = true;
		}
	}

	// 确认 Object.defineProperty() 是否能正确设值。
	if (!Object.defineProperty[KEY_not_native]) {
		try {
			(function() {
				var i, value = 7, old_value = value,
				//
				test_Funciton = function() {
				};
				Object.defineProperty(test_Funciton, 'size', {
					// enumerable : false,
					// configurable : false,
					get : function() {
						return value;
					},
					set : function(v) {
						if (value - 1 === v)
							value = v;
					}
				});
				for (i in test_Funciton)
					if (i === 'size')
						throw 1;
				try {
					test_Funciton.size = value + 1;
				} catch (e) {
				}
				try {
					delete test_Funciton.size;
				} catch (e) {
				}
				if (test_Funciton.size !== value)
					throw 1;
				test_Funciton.size = value - 1;
				if (test_Funciton.size !== value || test_Funciton.size === old_value)
					throw 1;
			})();

		} catch (e) {
			// Don't have standard Object.defineProperty()!
			Object.defineProperty[KEY_not_native] = true;
		}
	}

	// ---------------------------------------------------------------------------//
	// 这里添加本 library base 会用到的，或重要的，过于基本的 native function
	// (标准已规定，但先前版本未具备的内建物件功能)。

	// 添加 method, to add method, use set_method() or Object.defineProperties()
	// or Object.defineProperty()
	// 延展物件, to add property, use Object.assign()

	// 因为 set_method() 会用到 is_debug()，因此须先确保 is_debug() 已 loaded。

	// ^\s*: JScript 6-9 native object 需要这个。
	// console.log() @ node.js: "function () {...}"
	// TODO: see ((function_name_pattern)) above
	// @see
	// https://tc39.github.io/Function-prototype-toString-revision/#prod-NativeFunction
	// [ all, IdentifierName ]
	// 旧的 JS environment 无法取得 FormalParameters。
	var native_pattern = /^\s*function\s+(\w*)\s*\([^()]*\)\s*{\s*\[native code\]\s*}\s*$/;

	_.is_native_Function = function(variable) {
		return typeof variable === 'function'
		// is a builtin function
		&& native_pattern.test(Function.prototype.toString.call(variable));
	};

	/**
	 * 若 variable 为 Standard Built-in ECMAScript Objects / native object /
	 * native ECMASCript object, 则回传其 name / Constructor name。<br />
	 * 现行实作并未有标准支持！
	 * 
	 * @param variable
	 *            欲测试之 variable。
	 * @returns native object 之 name。
	 */
	function native_name(variable) {
		try {
			var value, match;

			// TODO: Function.prototype.bind 可能造成非 native Function 却形如 "[native
			// code]" @ Firefox 20。
			// 注意: '' + Object.create(null) 会 throw TypeError: Cannot convert
			// object to primitive value
			if (typeof variable === 'function'
			//
			&& (match = Function.prototype.toString.call(variable).match(native_pattern)))
				return match[1];

			match = String(variable.constructor).match(native_pattern);
			if (match && (value = _.value_of(match[1])) && variable === value.prototype)
				return match[1] + '.prototype';

			if (variable === Math)
				// '' + Math === "[object Math]" @ Chrome/36
				return 'Math';

		} catch (e) {
			// TODO: handle exception
		}
	}

	_// JSDT:_module_
	.
	native_name = native_name;

	// need_to_check_in_for_in = undefined || { 'valueOf' : {}.valueOf,
	// 'toString' : {}.toString };
	var need_to_check_in_for_in = (function() {
		var key = {}, need_to_check = {
			_valueOf : key.valueOf,
			_toString : key.toString
		};
		for (key in {
			// IE8 中，以 for ( in ) 迭代，会漏掉 valueOf, toString 这两个。
			valueOf : function() {
			},
			toString : function() {
			}
		})
			delete need_to_check['_' + key];

		for (key in need_to_check)
			return need_to_check;
	})();

	/**
	 * 设定物件方法:<br />
	 * extend properties to name_space.<br />
	 * 将 from_name_space 下的 variable_set 延展/覆盖到 name_space。<br />
	 * Object.defineProperties() without overwrite extend properties to
	 * name_space.
	 * 
	 * @example <code>
	 * var o={a:0,b:1,c:'a',d:2,e:'g',f:4};
	 * CeL.set_method({a:1,b:2,c:3},o,[function(key){return !CeL.is_digits(o[key]);},'b','c','d','e','s']);
	 * // {a:1,b:1,c:3,d:2}
	 * </code>
	 * 
	 * 注意: CeL.set_method() 不覆盖原有的设定。欲覆盖原有的设定请用 Object.assign()。
	 * 
	 * @param {Object|Function}name_space
	 *            target name-space. extend to what name-space.
	 * @param {Object|Function}properties
	 *            欲延展那些 properties.
	 * @param {Undefined|Boolean|String|Array|Object|Function}[filter]
	 *            {Boolean} false: preserve NONE. overwrite even 冲突.<br />
	 *            {Boolean} true: preserve ALL. don't overwrite if 冲突.<br />
	 *            <br />
	 *            {Null} null: the same as false.<br />
	 *            undefined: default: if the target has the same key, preserve
	 *            the same type.<br />
	 *            {String} preserve type, should be this type. 若已存在此 type，或 eval
	 *            后回传 true (function)，则不 overwrite。<br />
	 *            <br />
	 *            {Object} {key : 'preserve type'}<br />
	 *            {Array} [keys]: copy 所有 type 不同之 keys。<br />
	 *            {Function} filter(key, name_space, properties) return true:
	 *            preserve, false: copy the key.
	 * @param {Object}[attributes]
	 *            attributes used in Object.defineProperty()
	 * @returns target name-space
	 * @see https://www.audero.it/blog/2016/12/05/monkey-patching-javascript/
	 * @since 2014/5/5<br />
	 *        2014/5/6 refactoring 重构
	 */
	function set_method(name_space, properties, filter, attributes) {
		if (!attributes)
			attributes = Object.create(null);

		if (!name_space) {
			_.debug('没有指定扩展的对象，扩展到 set_method.default_target。', 1, 'set_method');
			if (!(name_space = set_method.default_target))
				if (name_space === null
				// && _.is_Object(properties)
				)
					return name_space;
				else
					name_space = Object.create(null);
		}

		if (name_space === properties) {
			_.debug('(' + properties + '): 目标与来源相同。', 2, 'set_method');
			return;
		}

		var key;
		// assert: 在 Array.isArray() 设定前，不可以使用 filter。
		if (filter && Array.isArray(filter)) {
			// filter: Array → Object
			key = filter;
			filter = Object.create(null);
			if (typeof key[0] === 'string')
				// set default value: overwrite.
				key.unshift(false);
			key.forEach(function(k, i, o) {
				if (i === 0)
					key = o[i];
				else
					filter[o[i]] = key;
			});
		}

		function setter() {
			// !_.is_Function()
			var value = filter, not_native_keyword = _.env.not_native_keyword || KEY_not_native;
			if (_.is_Object(filter))
				if (key in properties)
					value = filter[key];
				else
					// 仅考虑 filter 与 properties 皆包含的属性。
					return;

			if (typeof value === 'function'
				//
				&& (value = value(key, name_space, properties)) === true)
					// 直接跳过，保留原值。
					return;

			if (typeof value === 'string') {
				// _.is_type()
				value = typeof name_space[key] === value;
			} else if (value) {
				if (value === true)
					// 侦测是否已经存在 target name_space。
					value = key in name_space;
				else
					_.warn('set_method.setter: Unknown filter: [' + value + ']');
			} else if (value !== false) {
				// undefined, null, NaN
				value = typeof name_space[key] === typeof properties[key]
				// 假如原先有的并非原生函数，应该是有比较好、针对性的实作方法，那么就用新的覆盖旧的。
				&& name_space[key] && !name_space[key][not_native_keyword];
			}

			if (value)
				return;

			attributes.value = value = properties[key];
			// 以新的覆盖旧的。
			if (name_space[key] && name_space[key][not_native_keyword]) {
				try {
					delete name_space[key];
				} catch (e) {
					// TODO: handle exception
				}
			}

			// Opera/9.80 中，set_method(Number, ..) 会造成：
			// Object.defineProperty: first argument not an Object
			try {
				Object.defineProperty(name_space, key, attributes);
			} catch (e) {
				name_space[key] = value;
			}

			// 放这边，确保 not_native_keyword 一定会被设定。
			var name = native_name(name_space);
			if (name && typeof value === 'function') {
				try {
					Object.defineProperty(value,
					// 设定非 native 之 flag.
					not_native_keyword, {
						value : true
					});
				} catch (e) {
					value[not_native_keyword] = true;
				}
			} else if (typeof value === 'function') {
				value[not_native_keyword] = true;
			}

			// Warning: 由于执行时可能处于 log() stack 中，若 log() 会用到 set_method()，这边又
			// call .debug()，可能会循环呼叫，造成 stack overflow。
			if (_.is_debug(name ? 1 : 3)) {
				// 若更动 native Object 等，则作个警示。
				_.debug((name || '(' + _.is_type(name_space) + ')')
						+ '.' + key + ' = (' + (typeof value) + ')'
						+ (_.is_debug(4) || typeof value !== 'function'
								&& typeof value !== 'object' && typeof value !== 'symbol' ? ' [' + value + ']'
								: ''), 1, 'set_method');
			}
		}

		// TODO: 若 {Function}properties 另外处理，依现行实作会出问题?
		for (key in (_.is_Object(filter) ? filter : properties))
			setter();

		if (need_to_check_in_for_in
			// Object 的情况，已经在前面处理完了。
			&& !_.is_Object(filter)) {
			if (!filter)
				filter = false;
			for (key in need_to_check_in_for_in)
				// assert: !== 须由左至右运算。
				// assert: i = 0; [ 1, 2 ][i] !== [ 2, 2 ][i = 1];
				if (need_to_check_in_for_in[key] !== properties[key = key.slice(1)])
					setter();
		}

		return name_space;
	}
	_.set_method = set_method;


	/**
	 * Test if the value is a native Array.
	 * 
	 * @param v
	 *            value to test
	 * @returns {Boolean} the value is a native Array.
	 * @since 2009/12/20 08:38:26
	 */
	set_method(Array, {
		isArray: // _.type_tester('Array');
		function isArray(v) {
			// instanceof 比 Object.prototype.toString 快
			return v instanceof Array
					|| get_object_type(v) === '[object Array]';
		}
	});


	// Warning: 在 node.js v0.10.48 下，对于以 set/get 来设定 target[key]
	// 的情况，可能造成设定完后 process, console 变成未定义之变数。
	// node.js v0.12.18 下没有这个问题。
	_.need_avoid_assign_to_setter = platform.nodejs && !platform('node', '0.12');

	set_method(Object, {
		// Object.defineProperties()
		defineProperties : function defineProperties(object, properties) {
			var key;
			for (key in properties)
				Object.defineProperty(object, key, properties[key]);
			if (need_to_check_in_for_in)
				for (key in need_to_check_in_for_in)
					// assert: !== 须由左至右运算。
					// assert: i = 0; [ 1, 2 ][i] !== [ 2, 2 ][i = 1];
					if (need_to_check_in_for_in[key] !== properties[key = key
							.slice(1)])
						Object.defineProperty(object, key, properties[key]);
			return object;
		},
		// https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Object/create
		// Object.create() 指定其原型物件与属性，创建一个新物件。
		create : function create(proto, propertiesObject) {
			if (proto === null && !propertiesObject) {
				/**
				 * 取得裸 Object (naked Object)。
				 * 
				 * TODO: 快速回应的方法。但不见得在所有环境都适用，还需要再经过测试。
				 * 
				 * @returns 裸 Object (naked Object)。
				 */
				return {};
			}

			if (proto !== null && typeof proto !== 'object' && typeof proto !== 'function') {
				throw TypeError('Object prototype may only be an Object or null');
			}

			var object = new Object();
			object.__proto__ = proto;
			/**
			 * Object.create(null) 可取得裸 Object (naked Object)。Object prototype
			 * may only be an Object or null<br />
			 * 预防 Object.prototype 有东西，并消除 .toString() 之类。<br />
			 * 
			 * 注意: '' + Object.create(null) 会 throw TypeError: Cannot convert
			 * object to primitive value
			 * 
			 * @see <a href="http://hax.iteye.com/blog/1663476"
			 *      accessdate="2013/1/8 20:17">如何创建一个JavaScript裸对象 - hax的技术部落格 -
			 *      ITeye技术网站</a>
			 */
			for ( var attribute in object) {
				// This will also delete .__proto__
				delete object[attribute];
			}

			if (typeof propertiesObject === 'object')
				Object.defineProperties(object, propertiesObject);
			return object;
		},
		// 延展物件
		// to add property, use Object.assign()
		// application.debug.log use this.
		assign : function assign(target, source) {
			target = Object(target);
			for (var index = 1, length = arguments.length, key; index < length;) {
				source = Object(arguments[index++]);
				for (key in source) {
					// Warning: 可能得注意 `need_avoid_assign_to_setter`
					// @see CeL.application.net.URI()
					target[key] = source[key];
				}
				if (need_to_check_in_for_in)
					for (key in need_to_check_in_for_in)
						// assert: !== 须由左至右运算。
						// assert: i = 0; [ 1, 2 ][i] !== [ 2, 2 ][i = 1];
						if (need_to_check_in_for_in[key] !== source[key = key
								.slice(1)])
							target[key] = source[key];
			}
			return target;
		}
	});

	set_method(Array.prototype, {
		// https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/forEach
		forEach: function forEach(callbackfn, thisArg) {
			for (var index = 0, length = this.length,
				// 使用 Function.prototype.call。
					use_call = thisArg !== undefined && thisArg !== null
					&& typeof callbackfn.call === 'function';
				index < length; index++)
				// 为允许 delete，先作 check。
				if (index in this) {
					if (use_call) {
						callbackfn.call(thisArg, this[index], index, this);
					} else {
						// 少一道手续。
						callbackfn(this[index], index, this);
					}
				}
		}
	});

	// ---------------------------------------------------------------------//

	// @see CeL.data.code.compatibility.is_thenable()
	// cf. Promise.isPromise()
	function is_thenable(value) {
		return value
		// https://github.com/then/is-promise/blob/master/index.js
		// && (typeof value === 'object' || typeof value === 'function')
		&& typeof value.then === 'function';
	}

	function is_async_function(value) {
		// https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/AsyncFunction
		// 注意 AsyncFunction 不是一个全域物件。 它可以以下程式码获得。
		// Object.getPrototypeOf(async function(){}).constructor
		return typeof value === 'function'
		// to allow async functions:
		// https://github.com/tc39/ecmascript-asyncawait/issues/78
		&& value.constructor.name === 'AsyncFunction';
	}


	function run_and_then(first_to_run, and_then, error_catcher) {
		if (!error_catcher) {
			var result = first_to_run();
			if (is_thenable(result))
				return result.then(and_then);

			return and_then(result);
		}

		try {
			var result = first_to_run();
			if (is_thenable(result))
				return result.then(and_then, error_catcher);

			return and_then(result);
		} catch(e) {
			return error_catcher(e);
		}
	}

	set_method(_, {
		is_thenable : is_thenable,
		is_async_function : is_async_function,
		run_and_then : run_and_then
	});

	// ----------------------------------------------------------------------------------------------------------------------------------------------------------//
	// 依赖于 set_method() 设定完之后才能使用的方法


	// ----------------------------------------------------------------------------------------------------------------------------------------------------------//
	// for software verification(验证) and validation(验收).

	// _.preserve_verify_code = false;



	// ----------------------------------------------------------------------------------------------------------------------------------------------------------//
	// 最终设定。

	if (false) {
		var test_obj = _(2, 'test: Initialization');

		test_obj.test_print('OK!');
	}

	if (false) {
		if (has_console) {
			console.log('globalThis: ' + typeof globalThis);
			console.log(library_name + ': ' + typeof globalThis[library_name]);
		}
	}

	/**
	 * 能执行到最后都没出错才设定到 globalThis。
	 * 
	 * @ignore
	 */
	globalThis[library_name] = _;
	if (typeof module === 'object'
	// NG if we have specified module.exports: ((module.exports === exports))
	// http://weizhifeng.net/node-js-exports-vs-module-exports.html
	// 如果module.exports当前没有任何属性的话，exports会把这些属性赋予module.exports。
	&& typeof module.exports === 'object') {
		module.exports = _;
	}

	// test globalThis.
	try {
		if (_ !== eval(library_name))
			throw 1;
		// TODO: test delete globalThis object.
	} catch (e) {
		if (e === 1) {
			// 若失败，表示其他对 globalThis 的操作亦无法成功。可能因为 globalThis 并非真的
			// Global，或权限被限制了？
			_.warn('无法正确设定 globalThis object!');
		} else if (e && e.message && e.message.indexOf('by CSP') !== -1) {
			// Firefox/49.0 WebExtensions 可能 throw:
			// Error: call to eval() blocked by CSP
			_.env.no_eval = true;
			// use chrome.tabs.executeScript(null, {code:''});
		}
	}


}
)(
	/**
	 * Global Scope object 整体<br />
	 * 于 CeL.eval_code 使用.<br />
	 * 
	 * TODO:<br />
	 * Function constructor evaluates in a scope of that function, not in a
	 * global scope.<br />
	 * http://perfectionkills.com/global-eval-what-are-the-options/
	 * 
	 * @ignore
	 * @see <a
	 *      href="http://stackoverflow.com/questions/3277182/how-to-get-the-global-object-in-javascript"
	 *      accessdate="2011/8/6 10:7">How to get the Global Object in
	 *      JavaScript? - Stack Overflow</a>
	 */

	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis
	typeof globalThis === 'object' && globalThis.Array === Array && globalThis

	// In strict mode, this inside globe functions is undefined.
	// https://developer.mozilla.org/en/JavaScript/Strict_mode
	|| typeof window !== 'undefined' && window
	// isWeb() ? window : this;

	// https://github.com/tc39/proposal-global
	// 由于在HTML Application环境中，self并不等于window，但是应该要用window，所以先跳过这一项。
	// 因着HTA的问题，要采用也必须放在window之后。
	|| typeof self !== 'undefined' && self

	// e.g., node.js
	|| typeof global === 'object' && global.Array === Array && global
	// http://nodejs.org/api/globals.html
	// node.js requires this method to setup REALLY global various:
	// require isn't actually a global but rather local to each module.
	// However, this causes CSP violations in Chrome apps.
	|| Function('return this')()
	// (function(){return this;})()
)
// ) // void(
;







/**
 * <code>
 TODO:

 瘦身


 等呼叫时才 initialization


 http://headjs.com/#theory
 Head JS :: The only script in your HEAD

 Multiversion Support
 http://requirejs.org/docs/api.html



 <a href="http://msdn.microsoft.com/en-us/library/2b36h1wa.aspx" accessdate="2012/12/19 19:48">arguments Object</a>:
 The arguments object is not available when running in fast mode, the default for JScript. To compile a program from the command line that uses the arguments object, you must turn off the fast option by using /fast-. It is not safe to turn off the fast option in ASP.NET because of threading issues.


 </code>
 */

if (typeof CeL === 'function') {
	(function(_) {

		// var _// JSDT:_module_
		// = this;

		if (false) {
			// IE8 中，以 for ( in ) 迭代，会漏掉这两个。
			var need_check_toString = (function() {
				var a, OK = 0;
				for (a in {
					valueOf : function() {
					},
					toString : function() {
					},
					p : 1
				})
					if (a === 'valueOf' || a === 'toString')
						OK++;
				return OK !== 2;
			})();

			/**
			 * <code>
			CeL.extend(function f_name(){}, object || string, initial arguments);
			CeL.extend({name:function(){},.. }, object || string);
			CeL.extend([function1,function12,..], object || string);
			
			set .name
			</code>
			 */

			/**
			 * 延展物件 (learned from jQuery):<br />
			 * extend variable_set to name_space.<br />
			 * 将 from_name_space 下的 variable_set 延展/覆盖到 name_space。<br />
			 * 
			 * @remark MooTools 1.4.5 会 overwrite 此函数!
			 * 
			 * @param {Object|Array|String}variable_set
			 *            欲延展之 variable set.
			 * @param {Object|Function}name_space
			 *            target name-space. extend to what name-space.
			 * @param {Object|Function}from_name_space
			 *            When inputing function names, we need a base
			 *            name-space to search these functions.
			 * @param {true|String|Function}reserve_type
			 *            若已存在此 type (true|String)，或 eval 后回传 true (function)，则不
			 *            overwrite。
			 * @returns target names-pace
			 * @see <a
			 *      href="http://blog.darkthread.net/blogs/darkthreadtw/archive/2009/03/01/jquery-extend.aspx"
			 *      accessdate="2009/11/17 1:24" title="jQuery.extend的用法 -
			 *      黑暗执行绪">jQuery.extend的用法</a>,<br />
			 *      <a
			 *      href="http://www.cnblogs.com/rubylouvre/archive/2009/11/21/1607072.html"
			 *      accessdate="2010/1/1 1:40">jQuery源码学习笔记三 - Ruby's Louvre -
			 *      博客园</a>
			 * @since 2009/11/25 21:17:44
			 * @deprecated 2014/5/6 → CeL.set_method()
			 */
			var extend = function(variable_set, name_space, from_name_space,
					reserve_type) {

				if (typeof name_space === 'undefined' || name_space === null) {
					_
							.debug('没有指定扩展的对象，扩展到 extend.default_target。', 3,
									'extend');
					if (!(name_space = extend.default_target))
						if (name_space === null
								&& typeof from_name_space === 'undefined'
						// && _.is_Object(variable_set)
						)
							return variable_set;
						else
							name_space = {};
				}

				if (typeof from_name_space === 'undefined'
						|| from_name_space === null)
					from_name_space = extend.default_target;
				else if (variable_set === null
						&& _.is_Function(from_name_space))
					variable_set = from_name_space;

				var variable_name, setter = function(v) {
					if (!reserve_type
							|| (
							// true: any type.
							reserve_type === true ? !(variable_name in name_space)
									: typeof reserve_type === 'function' ? !reserve_type(
											name_space[variable_name], v)
											: !_.is_type(
													name_space[variable_name],
													reserve_type))) {

						// Warning: 由于执行时可能处于 log() stack 中，若 log() 会用到
						// extend()，这边又 call .debug()，可能会循环呼叫，造成 stack overflow。
						if (_.is_debug()) {
							var target_name = _.native_name(name_space);
							// 若更动 native Object 等，则作个警示。
							_.debug((target_name || '(' + _.is_type(name_space)
									+ ')')
									+ '.'
									+ variable_name
									+ ' = ('
									+ (typeof v)
									+ ')'
									+ (_.is_debug(4) || typeof v !== 'function'
											&& typeof v !== 'object' ? ' [' + v
											+ ']' : ''), target_name ? 1 : 3,
									'extend.setter');
						}

						name_space[variable_name] = v;
					}
				};

				if (_.is_Object(variable_set)
				// 若 function 另外处理，依现行实作会出问题！
				|| _.is_Function(variable_set)) {
					if (need_check_toString) {
						if ('valueOf' in variable_set)
							variable_set['. added_' + 'valueOf'] = variable_set.valueOf;
						if ('toString' in variable_set)
							variable_set['. added_' + 'toString'] = variable_set.toString;
					}

					for (variable_name in variable_set) {
						if (need_check_toString)
							variable_name = variable_name.replace(/^\. added_/,
									'');
						if (from_name_space)
							if (variable_name in from_name_space) {
								setter(from_name_space[variable_name]);
								// 这边的处置可能不甚周延。
							} else {
								if (false && (variable_set[variable_name] in from_name_space))
									setter(from_name_space[variable_set[variable_name]]);
							}
						else
							setter(variable_set[variable_name]);
					}

					if (need_check_toString) {
						if ('valueOf' in variable_set)
							delete variable_set['. added_' + 'valueOf'];
						if ('toString' in variable_set)
							delete variable_set['. added_' + 'toString'];
					}
				} else if (Array.isArray(variable_set)
						&& !Array.isArray(name_space)) {
					variable_set
							.forEach(function(o) {
								if (typeof o === 'object'
										|| (o in from_name_space))
									extend(o, name_space, from_name_space,
											reserve_type);
							});

				} else if (typeof variable_set === 'string') {
					if (!from_name_space) {
						_.debug('预设从本 library 自身 extend to target name-space。',
								3, 'extend');
						from_name_space = _;
					}

					if (name_space === from_name_space)
						_
								.debug('(' + variable_set + '): 目标与来源相同。', 2,
										'extend');
					else if ((variable_name = variable_set) in from_name_space) {
						setter(from_name_space[variable_name]);
						_.debug('(' + (typeof from_name_space[variable_name])
								+ ') ' + variable_name + '\n='
								+ from_name_space[variable_name] + '\n\nto:\n'
								+ name_space, 2, 'extend');
					} else
						try {
							setter(_.value_of(variable_name));
							_.debug('.' + variable_name + ' = '
									+ name_space[variable_name], 2, 'extend');
						} catch (e) {
							_.warn(_.Class + '.extend:\n' + e.message);
						}

				} else if (typeof variable_set === 'function') {
					if (_.parse_function) {
						// TODO
						throw new Error(1,
								'extend: Not Yet Implemented! (for function)');
					} else {
						_.warn(_.Class + '.extend: Warning: Please include '
								+ _.Class + '.parse_function() first!');
					}

				}

				return name_space;
			};

			// extend.default_target = _;

			_// JSDT:_module_
			.extend = extend;
		}

		// .object_hash 之类会用到。
		_.set_method(Array.prototype, {
			indexOf : function indexOf(element, index) {
				index = index > 1 ? Math.floor(index) : 0;
				for (var length = this.length; index < length; index++)
					if (index in this && this[index] === element)
						return index;
				return -1;
			}
		});

		// ----------------------------------------------------------------------------------------------------------------------------------------------------------//

		/**
		 * @examples <code>

		var some_function =  args  =>   some_operators  ;
		var some_function = (args) => { some_operators };
		some_function = CeL.function_placeholder(() => some_function = CeL.some_function || some_function, some_function);

		var some_function = function(args) { some_operators; };
		some_function = CeL.function_placeholder(function(){
			return some_function = CeL.some_function || some_function;
		}, some_function);

		</code>
		 */

		function function_placeholder(setter, fallback) {
			var full_version = setter();
			if (full_version && full_version !== fallback
					&& _.is_Function(full_version)) {
				_.debug('采用完整功能版函数', 1, 'function_placeholder');
			} else {
				full_version = fallback;
			}
			return (full_version || fallback).apply(arguments);
		}
		_.function_placeholder = function_placeholder;

		_// JSDT:_module_
		.
		/**
		 * 设定 name_space 下的 function_name 待执行时换作 initializor 的 return。<br />
		 * 换句话说，执行 name_space 下的 function_name (name_space[function_name]) 时把
		 * name_space[function_name] 换成 new_function (initializor 的 return)。
		 * 
		 * for Lazy Function Definition Pattern.<br />
		 * 惰性求值（lazy evaluation or call-by-need），又称懒惰求值、懒汉求值。
		 * 
		 * TODO:<br />
		 * 使用本函数不能完全解决先前已经指定 identifier 的情况。<br />
		 * 因此对于会使用本函数的函数，尽量别使用 .use_function() 来 include，否则可能会出现问题!
		 * 
		 * @example <code>
		 * library_namespace.set_initializor('function_name', function(function_name){return function(){};}, _);
		 * </code>
		 * 
		 * @param {String}function_name
		 *            function name to replace: name_space.function_name
		 * @param {Function}initializor
		 *            will return function identifier to replace with
		 * @param name_space
		 *            in which name-space
		 * @returns new_function
		 * @see http://realazy.org/blog/2007/08/16/lazy-function-definition-pattern/,
		 *      http://peter.michaux.ca/article/3556
		 */
		set_initializor = function(function_name, initializor, name_space) {
			var do_replace;
			if (arguments.length < 3 && _.is_Function(function_name)
					&& (do_replace = _.get_function_name(function_name))) {
				// e.g., library_namespace.set_initializor(get_HTA, _);
				name_space = initializor;
				initializor = function_name;
				function_name = do_replace;
				// _.debug('Get function name [' + function_name + '].');
			}

			if (!name_space)
				name_space = _;
			if (!initializor)
				initializor = name_space[function_name];

			do_replace = function() {
				if (false) {
					_.debug(name_space[function_name] === do_replace);
					_.debug(name_space.Class + '[' + function_name + ']='
							+ name_space[function_name]);
					_.debug('do_replace=' + do_replace);
				}
				var old_function = name_space[function_name], new_function;
				if (old_function === do_replace) {
					// 实际执行。
					try {
						new_function = initializor.call(name_space,
								function_name, arguments);
						// new_function = initializor.apply(_, arguments);
						if (false)
							_.debug('new_function = [' + (typeof new_function)
									+ ']' + new_function);
					} catch (r) {
						// 可能因时机未到，或是 initialization arguments 不合适。不作 replace。
						return r;
						// throw r;
					}

					if (typeof new_function !== 'function')
						// 确定会回传 function 以供后续执行。
						initializor = new_function, new_function = function() {
							if (false)
								_.debug('new function return [' + initializor
										+ '].', 1, 'set_initializor');
							return initializor;
						};

					// searching for other extends
					if (_[function_name] === old_function) {
						_.debug('Replace base name-space function ['
								+ function_name + '].', 1, 'set_initializor');
						_[function_name] = new_function;
					} else
						_.debug('Base name-space function [' + function_name
								+ ']: ' + _[function_name] + '.', 1,
								'set_initializor');

					// 设定 name_space[function_name]。
					_.debug('Replace function [' + function_name + '].', 1,
							'set_initializor');
					name_space[function_name] = new_function;
					if (false) {
						_.debug(name_space[function_name] === do_replace);
						_.debug(name_space.Class + '[' + function_name + ']='
								+ name_space[function_name]);
					}
				} else {
					// 已经替换过。
					if (_.is_debug(2))
						_.warn('set_initializor: The function ['
								+ function_name
								+ '] had replaced with a new one.');
					new_function = old_function;
				}

				// _.debug('new function: ' + new_function);
				// _.debug('return ' + new_function.apply(_, arguments));
				return new_function.apply(_, arguments);
			};

			return name_space[function_name] = do_replace;
		};

		// ----------------------------------------------------------------------------------------------------------------------------------------------------------//

		_.is_HTA = _.is_WWW()
		// http://msdn.microsoft.com/en-us/library/ms536496(v=vs.85).aspx
		// HTAs do not support the AutoComplete in HTML forms feature, or the
		// window.external object.
		&& window.external === null && window.ActiveXObject
				&& document.getElementsByTagName('APPLICATION').length === 1;

		function new_XMLHttpRequest() {
			return new XMLHttpRequest();
		}

		// 'Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'
		// 'Msxml2.XMLHTTP.6.0','Msxml2.XMLHTTP.5.0','Msxml2.XMLHTTP.4.0','Msxml2.XMLHTTP.3.0',["MSXML2",
		// "Microsoft", "MSXML"].['XMLHTTP','DOMDocument'][".6.0", ".4.0",
		// ".3.0", ""]
		function new_MS_XMLHTTP() {
			return new ActiveXObject('Microsoft.XMLHTTP');
		}

		/**
		 * 设定取得 XMLHttpRequest object 的方法。<br />
		 * The XMLHttpRequest object can't be cached. So we cache the method to
		 * get the XMLHttpRequest controller.
		 * 
		 * 在 HTA 中，XMLHttpRequest() 比 ActiveXObject('Microsoft.XMLHTTP')
		 * 更容易遇到拒绝存取。例如在同一目录下的 .txt 档。<br />
		 * 但在 IE 中，ActiveXObject 可能造成主动式内容之问题。<br />
		 * jQuery: Microsoft failed to properly implement the XMLHttpRequest in
		 * IE7, so we use the ActiveXObject when it is available.
		 * 
		 * @inner
		 * @ignore
		 */
		if (_.is_HTA)
			try {
				_.new_XMLHttp = new_MS_XMLHTTP() && new_MS_XMLHTTP;
			} catch (e) {
			}

		if (!_.new_XMLHttp)
			try {
				// normal method to get a new XMLHttpRequest controller.
				// 相当于 new XMLHttpRequest()
				// Ajax 程式应该考虑到 server 没有回应时之处置
				_.new_XMLHttp = new_XMLHttpRequest() && new_XMLHttpRequest;
			} catch (e) {
			}

		// _.is_HTA 的情况，已经测在前面试过了。
		if (!_.new_XMLHttp && !_.is_HTA)
			try {
				_.new_XMLHttp = new_MS_XMLHTTP() && new_MS_XMLHTTP;
			} catch (e) {
			}

		// 皆无：use XMLDocument.
		// The document.all().XMLDocument is a Microsoft IE subset of
		// JavaScript.
		// http://www.bindows.net/
		// http://www.java2s.com/Code/JavaScriptReference/Javascript-Properties/XMLDocument.htm

		if (_.new_XMLHttp
				// https://github.com/electron/electron/issues/2288
				// How to detect if running in electron?
				// https://github.com/cheton/is-electron/blob/master/index.js
				&& (typeof process !== 'object'
						|| typeof process.versions !== 'object' || !process.versions.electron)) {

		} else if (_.platform.nodejs) {
			// for node.js, node_fs
			_.new_XMLHttp = require('fs');
			_.platform.browser = process.versions.electron ? 'electron'
					: 'node';
			_.platform.version = process.versions.electron
					|| process.versions.node;
			// @see os.version()
			_.platform.OS = process.platform;
			// shortcut for Windows
			_.platform.Windows = _.platform.is_Windows();

			// argument vector
			_.env.argv = process.argv;
			// env hash: see CeL.env.arg_hash @ CeL.application.platform.nodejs

			if (_.platform.browser === 'node')
				_.platform.is_CLI = true;
			else if (_.platform.browser === 'electron')
				// is GUI
				_.platform.is_CLI = false;

			// 为 CLI interactive 互动形式。
			// @see WScript.Interactive @ CeL.application.OS.Windows.job
			_.platform.is_interactive
			// isTTY: 为 nodejs: interactive 互动形式。
			// 但 isTTY 在 command line 执行程式时也会为 true！
			= process.stdout && process.stdout.isTTY
			// Windows 7 to Windows 10
			|| process.env.SESSIONNAME === 'Console';

			if (_.platform.is_interactive) {
				_.log_temporary = function log_temporary(message) {
					// message + ' ...\r'
					process.stdout.write('\r'
							+ _.preprocess_log_messages(message) + '  \r');
				};
			}

			// TODO:
			// https://github.com/driverdan/node-XMLHttpRequest/blob/master/lib/XMLHttpRequest.js
			var node_read_file = _.new_XMLHttp = _.new_XMLHttp.readFileSync;

			// The encoding can be 'utf8', 'ascii', or 'base64'.
			// http://nodejs.org/api/fs.html#fs_fs_createreadstream_path_options
			_.get_file = function get_file(path, encoding) {
				// for node.js
				if (_.platform.Windows && /^\/[a-z]:\//i.test(path)) {
					// 在 electron package 中，script_base_path 可能形如 '/D:/'...。
					// node.js 在读取 "/D:/"... 这一种档案时会转换成 "/D:/D:/"...
					path = path.slice(1);
				}

				var data, i, l, tmp;
				try {
					data = node_read_file(path, encoding);
				} catch (e) {
					data = node_read_file(path);
				}

				if (typeof data !== 'string') {
					// auto detect encoding
					l = data.length;
					if (data[0] === 255 && data[1] === 254) {
						_.debug(path + ': UTF-16LE', 4);
						// 去掉 BOM。
						// pass byte order mark (BOM), the first 2 bytes.
						i = 2;
						tmp = [];
						while (i < l)
							tmp.push(String.fromCharCode(data[i++] + 256
									* data[i++]));
					} else if (data[0] === 254 && data[1] === 255) {
						_.debug(path + ': UTF-16BE', 4);
						// pass byte order mark (BOM), the first 2 bytes.
						i = 2;
						tmp = [];
						while (i < l)
							tmp.push(String.fromCharCode(256 * data[i++]
									+ data[i++]));
					} else if (!encoding && data[0] === 239 && data[1] === 187
							&& data[2] === 191) {
						// 或许是存成了 UTF-8？
						// https://en.wikipedia.org/wiki/Byte_order_mark#Representations_of_byte_order_marks_by_encoding
						_.debug('get_file: Treat file as UTF-8 with BOM: ['
								+ path + ']', 2);
						// tmp = null;
						if (false) {
							// http://nodejs.org/api/fs.html#fs_fs_readfilesync_filename_options
							data = node_read_file(path, 'utf8')
							// pass byte order mark (BOM), the first 1 byte:
							// \uFEFF.
							.slice(1);
						} else {
							// console.log([ path, data.slice(0, 10) ]);
							// assert: data.toString().charCodeAt(0) === 65279
							// data.toString().charAt(0) === \uFEFF

							// buffer.toString('utf8', 0, length);
							data = data.toString(/* Default: 'utf8' */)
							// pass byte order mark (BOM), the first 1 byte:
							// \uFEFF.
							// 采用 data.toString('utf8', 3)，奇怪的是有时仍然会得到
							// [65279,...] @ node.js 14.7.0 。
							// 不如全部 .toString() 之后再 .slice(1)。
							.slice(1);
						}

					} else
						try {
							i = node_read_file(path, 'utf8');
							_.debug('get_file: Treat file as UTF-8: [' + path
									+ ']', 2);
							// tmp = null;
							data = i;
						} catch (e) {
							// console.warn(e);
							if (l > 1)
								_
										.debug('get_file: Unknown byte order mark (BOM) of ['
												+ path
												+ ']: '
												+ data[0]
												+ ','
												+ data[1]);
							// 当作 ASCII 处理。
							i = 0;
							tmp = [];
							while (i < l)
								// data.toString('utf-8', 0, length);
								tmp.push(String.fromCharCode(data[i++]));
						}
					if (tmp)
						data = tmp.join('');
				}

				return data;
			};

		} else if (typeof _configuration === 'object'
		// for jslibs
		&& typeof File === 'function') {
			_.platform.browser = 'jsio';
			LoadModule('jsio');
			_.get_file = function(path) {
				// _configuration.stderr(path);
				var c, i, data = new File(path).Open('r').Read(), l = data.length, tmp = [], next_code = function() {
					c = data.charCodeAt(i++);
					return c < 0 ? c + 256 : c;
				};

				_configuration.stderr(path + ': ' + data.charCodeAt(0) + ','
						+ data.charCodeAt(1));
				if (data.charCodeAt(0) === -1 && data.charCodeAt(1) === -2) {
					// _.debug(path + ': UTF-16LE');
					for (i = 2; i < l;)
						tmp.push(String.fromCharCode(next_code() + 256
								* next_code()));
					data = tmp.join('');
				} else if (data.charCodeAt(0) === -2
						&& data.charCodeAt(1) === -1) {
					// _.debug(path + ': UTF-16BE');
					for (i = 2; i < l;)
						tmp.push(String.fromCharCode(next_code() * 256
								+ next_code()));
					data = tmp.join('');
				}

				return data;
			};

		} else if (typeof Stream === 'function') {
			// for JSDB
			_.platform.browser = 'JSDB';
			_.get_file = function(path) {
				// _.log('get_file: ' + path);
				try {
					return new Stream(path
					// , 'r'
					).readFile();
				} catch (e) {
					// _.log(e.message);
				}

				var data = new Stream(path, 'b'), tmp = [],
				// The byte order mark (BOM).
				BOM = [ data.readUInt8(), data.readUInt8() ];
				if (BOM[0] === 255 && BOM[1] === 254) {
					// _.debug(path + ': UTF-16LE');
					while (!data.eof)
						tmp.push(String.fromCharCode(data.readUInt8() + 256
								* data.readUInt8()));
				} else if (BOM[0] === 254 && BOM[1] === 255) {
					// _.debug(path + ': UTF-16BE');
					while (!data.eof)
						tmp.push(String.fromCharCode(data.readUInt8() * 256
								+ data.readUInt8()));
				} else {
					data.rewind();
					while (!data.eof)
						tmp.push(data.get());
				}
				data.close();
				return tmp.join('');
			};

		} else
			_.get_file = function() {
				// No XMLHttpRequest controller.

				var m = 'get_file: This scripting engine does not support XMLHttpRequest.';
				_.warn(m);
				throw new Error(m);
				// firefox: This function must return a result of type any.
				// return undefined;
			};

		_// JSDT:_module_
		.
		/**
		 * Ask privilege in mozilla projects: Firefox 2, 3.<br />
		 * get_file() 遇到需要提高权限时使用。<br />
		 * enablePrivilege 似乎只能在执行的 function 本身或 caller 呼叫才有效果，跳出函数即无效，不能
		 * cache，因此提供 callback。<br />
		 * 就算按下「记住此决定」，重开浏览器后需要再重新授权。
		 * 
		 * @param {String|Error}
		 *            privilege privilege that asked 或因权限不足导致的 Error
		 * @param {Function|Array}
		 *            callback|[callback,arguments] Run this callback if getting
		 *            the privilege. If it's not a function but a
		 *            number(经过几层/loop层数), detect if there's a loop or run the
		 *            caller.
		 * @returns OK / the return of callback
		 * @throws error
		 * @since 2010/1/2 00:40:42
		 */
		require_netscape_privilege = function require_netscape_privilege(
				privilege, callback) {
			var _s = require_netscape_privilege, f, i,
			/**
			 * raise error. error 有很多种，所以仅以 'object' 判定。
			 * 
			 * @inner
			 * @ignore
			 */
			re = function(m) {
				// _.debug('Error: ' + m);
				throw privilege && typeof privilege === 'object' ?
				// Error object
				privilege :
				// new Error (message)
				new Error(m);
			};

			if (!_s.enabled)
				re('Privilege requiring disabled.');

			// test loop
			// 得小心使用: 指定错可能造成 loop!
			if (!isNaN(callback) && callback > 0 && callback < 32) {
				try {
					/**
					 * @Firefox 4: <code>
					 * TypeError: 'caller', 'callee', and 'arguments' properties may not be accessed on strict mode functions or the arguments objects for calls to them
					 * </code>
					 */
					for (f = _s, i = 0; i < callback; i++) {
						f = f.caller;
						if (f)
							// TODO: do not use arguments
							f = f.arguments.callee;
					}

					if (f === _s)
						// It's looped
						re('Privilege requiring looped.');

					callback = 1;

				} catch (e) {
					// TODO: handle exception
				}

			}

			f = _s.enablePrivilege;
			// _.debug('enablePrivilege: ' + f);
			// '我们需要一点权限来使用 XMLHttpRequest.open。\n* 请勾选记住这项设定的方格。'
			if (!f
					&& !(_s.enablePrivilege = f = _
							.value_of('netscape.security.PrivilegeManager.enablePrivilege')))
				// 更改设定，预防白忙。
				_s.enabled = false, re('No enablePrivilege get.');

			if (_.is_type(privilege, 'DOMException') && privilege.code === 1012)
				// http://jck11.pixnet.net/blog/post/11630232
				// Mozilla的安全机制是透过PrivilegeManager来管理，透过PrivilegeManager的enablePrivilege()函式来开启这项设定。
				// 须在open()之前呼叫enablePrivilege()开启UniversalBrowserRead权限。

				// http://code.google.com/p/ubiquity-xforms/wiki/CrossDomainSubmissionDeployment
				// Or: In the URL type "about:config", get to
				// "signed.applets.codebase_principal_support" and change its
				// value to true.

				// 由任何网站或视窗读取私密性资料
				privilege = 'UniversalBrowserRead';

			else if (!privilege || typeof privilege !== 'string')
				re('Unknown privilege.');

			// _.debug('privilege: ' + privilege);
			try {
				if (false)
					_.log(_.Class
							+ '.require_netscape_privilege: Asking privilege ['
							+ privilege + ']..');
				f(privilege);
			} catch (e) {
				if (privilege !== 'UniversalBrowserRead' || !_.is_local())
					_
							.warn(_.Class
									+ '.require_netscape_privilege: User denied privilege ['
									+ privilege + '].');
				throw e;
			}

			// _.debug('OK. Get [' + privilege + ']');

			if (callback === 1) {
				// _.debug('再执行一次 caller..');
				try {
					callback = _s.caller;
				} catch (e) {
					// TODO: handle exception
				}
				return callback.apply(_, callback.arguments);

				if (false) {
					i = callback.apply(_, callback.arguments);
					_.debug(('return ' + i).slice(0, 200));
					return i;
				}
			} else if (_.is_Function(callback))
				// 已审查过，为 function
				return callback();
			else if (Array.isArray(callback))
				return callback[0].apply(_, callback[1]);
		};

		/**
		 * 当需要要求权限时，是否执行。（这样可能弹出对话框）<br />
		 * Firefox 5 之后，就算要求了，对 local 也没用，甚至会 hang 住挂掉，因此取消了。
		 * 
		 * @type Boolean
		 */
		_// JSDT:_module_
		.require_netscape_privilege.enabled = false;

		// ----------------------------------------------------------------------------------------------------------------------------------------------------------//

		var is_Opera = _.is_WWW(true) && navigator.appName === 'Opera';

		/**
		 * 以同时依序(synchronously)的方式，载入最基本之资源取得功能。<br />
		 * Get resource files by {@link XMLHttpRequest}.<br />
		 * 依序载入 resources，用于 include JavaScript 档之类需求时，取得档案内容之轻量级函数。<br />
		 * 除 Ajax，本函数亦可用在 CScript 执行中。<br />
		 * see also: .application.net.Ajax.get_URL()
		 * 
		 * @example<code>

		//	get contents of [path/to/file]:
		var file_contents = CeL.get_file('path/to/file');

		</code>
		 * 
		 * @param {String}
		 *            path URI / full path.
		 *            <em style="text-decoration:line-through;">不能用相对path！</em>
		 * @param {String}
		 *            [encoding] file encoding
		 * @returns {String} data content of path
		 * @returns {undefined} when error occurred: no Ajax function, ..
		 * @throws uncaught
		 * exception @ Firefox: 0x80520012 (NS_ERROR_FILE_NOT_FOUND), <a
		 *           href="http://www.w3.org/TR/2007/WD-XMLHttpRequest-20070227/#exceptions">NETWORK_ERR</a>
		 *           exception
		 * @throws 'Access
		 * to restricted URI denied' 当 access 到上一层目录时 @ Firefox
		 * @see <a
		 *      href=http://blog.joycode.com/saucer/archive/2006/10/03/84572.aspx">Cross
		 *      Site AJAX</a>, <a
		 *      href="http://domscripting.com/blog/display/91">Cross-domain Ajax</a>,
		 *      <a
		 *      href="http://forums.mozillazine.org/viewtopic.php?f=25&amp;t=737645"
		 *      accessdate="2010/1/1 19:37">FF3 issue with iFrames and XSLT
		 *      standards</a>, <a
		 *      href="http://kb.mozillazine.org/Security.fileuri.strict_origin_policy"
		 *      accessdate="2010/1/1 19:38">Security.fileuri.strict origin
		 *      policy - MozillaZine Knowledge Base</a> Chrome: <a
		 *      href="http://code.google.com/p/chromium/issues/detail?id=37586"
		 *      title="between builds 39339 (good) and 39344 (bad)">NETWORK_ERR:
		 *      XMLHttpRequest Exception 101</a>
		 */
		function get_file(path, encoding, post_data) {
			if (_.is_Object(encoding)) {
				post_data = encoding;
				encoding = null;
			}
			if (_.is_Object(path)) {
				post_data = path.post || post_data;
				encoding = path.encoding || encoding;
			}

			var method = post_data ? 'POST' : 'GET',
			/**
			 * The XMLHttpRequest object can't be cached.
			 * 
			 * @inner
			 * @ignore
			 */
			object = _.new_XMLHttp();

			// 4096: URL 长度限制，与浏览器有关。
			if (typeof path === 'string' && path.length > 4096
					&& (post_data = path.match(/^([^?]{6,200})\?(.+)$/)))
				path = post_data[1], post_data = post_data[2], method = 'PUT';
			else
				post_data = null;

			try {
				// IE 10 中，local file 光 .open() 就 throw 了。
				object.open(method, path, false);

				// 有些版本的 Mozilla 浏览器在伺服器送回的资料未含 XML mime-type
				// 档头（header）时会出错。为了避免这个问题，可以用下列方法覆写伺服器传回的档头，以免传回的不是 text/xml。
				// http://squio.nl/blog/2006/06/27/xmlhttprequest-and-character-encoding/
				// http://www.w3.org/TR/XMLHttpRequest/ search encoding
				if (encoding && object.overrideMimeType)
					/**
					 * old:<code>
					object.overrideMimeType('text/xml;charset=' + encoding);
					</code>
					 * 但这样会被当作 XML 解析，产生语法错误。
					 * 
					 * TODO:<br />
					 * try:<code>
					object.overrideMimeType('text/plain;charset=' + encoding);
					</code>
					 */
					object.overrideMimeType('application/json;charset='
							+ encoding);

				// http://www.w3.org/TR/2007/WD-XMLHttpRequest-20070227/#dfn-send
				// Invoking send() without the data argument must give the same
				// result as if it was invoked with null as argument.

				// 若档案不存在，会 throw。
				object.send(post_data);

				if (65533 === object.responseText.charCodeAt(0)
				/**
				 * e.g., @ <code>Mozilla/5.0 (Windows NT 6.1; rv:29.0) Gecko/20100101 Firefox/29.0</code>
				 */
				&& navigator.userAgent.indexOf(' Gecko/2') !== -1) {
					_.env.same_origin_policy = true;
					var error = new Error(
							'get_file: Cannot parse UTF-32 encoding of ['
									+ path + '] @ Firefox!');
					// 于 load_named() 使用，避免显示 '重新读取(reload)，或是过段时间再尝试或许可以解决问题。'
					error.type = 'encode';
					throw error;
				}

				delete get_file.error;

			} catch (e) {
				if (e.number === -1072896658
				// || e.message.indexOf('c00ce56e') !== -1
				) {
					// http://support.microsoft.com/kb/304625
					throw new Error(
							'指定的资源回传了系统不支援的文字编码，因此无法解码资料。请检查此网页回传之 header，确认系统可解码 Content-Type 之 charset。');
				}

				/**
				 * Chome:
				 * <code>XMLHttpRequest cannot load file:///X:/*.js. Cross origin requests are only supported for HTTP.</code>
				 * 
				 * Opera 11.50: 不会 throw，但是 .responseText === ''。
				 * 
				 * Apple Safari 3.0.3 may throw NETWORK_ERR: XMLHttpRequest
				 * Exception 101
				 */
				get_file.error = e;

				if (_.is_debug(2)) {
					_.warn(_.Class + '.get_file: Loading [' + path
							+ '] failed!');
					_.error(e);
				}

				/** <code>[XPCWrappedNative_NoHelper] Cannot modify properties of a WrappedNative @ firefox</code> */
				// e.object = o;
				if (
				// 5: 系统找不到指定的资源。/存取被拒。
				// IE 10 中，5: "存取被拒。"。same origin policy 下，即使是档案存在，值一样为
				// 5，因此无法以资判别。
				// (e.number & 0xFFFF) !== 5 &&
				_.is_WWW()
						&& (_.is_local() || ((object = path
								.match(/:(\/\/)?([^\/]+)/)) && object[2] !== window.location.hostname))) {
					// 八九不离十: no Cross-site scripting (XSS).
					if (_.is_debug()) {
						_
								.warn('get_file: '
										+ (_.is_local() ? '呼叫了上层 local file'
												: '所要求档案之 domain ['
														+ object[2]
														+ '] 与所处之 domain ['
														+ window.location.hostname
														+ '] 不同')
										+ '！<br />\n您可能需要尝试使用 '
										+ _.Class
										+ '.run()!\nSet up <a href="http://en.wikipedia.org/wiki/Same_origin_policy" accessdate="2012/12/2 18:19">same origin policy</a> flag.');
					}
					_.env.same_origin_policy = true;
					throw new Error('get_file: Different domain!');
				}

				object = _.require_netscape_privilege(e,
						[ get_file, arguments ]);
				if (false)
					_.debug('require_netscape_privilege return ['
							+ typeof (object) + ('] ' + object).slice(0, 200)
							+ ' ' + (e === object ? '=' : '!') + '== '
							+ 'error (' + e + ')');
				if (e === object)
					throw e;

				return object;
			}

			// workaround for Opera: Opera 11.50:
			// 不会 throw，但是 .responseText === ''。
			if (object.responseText === '' && is_Opera)
				throw new Error('get_file: Nothing get @ Opera');

			// 当在 local 时，成功的话 status === 0。失败的话，除 IE 外，status 亦总是 0。
			// status was introduced in Windows Internet Explorer 7.
			// http://msdn.microsoft.com/en-us/library/ms534650%28VS.85%29.aspx
			// 因此，在 local 失败时，仅 IE 可由 status 探测，其他得由 responseText 判别。
			if (false)
				_.debug('Get [' + path + '], status: [' + object.status + '] '
						+ object.statusText);

			// .responseXML
			return object.status === 400 ? [ object.status, object.responseText ]
					: object.responseText;
		}

		if (!_.get_file)
			_.get_file = get_file;

		// ----------------------------------------------------------------------------------------------------------------------------------------------------------//

		/**
		 * 较为安全的执行，可当作 JSON.parse()。<br />
		 * we only need simple JSON.parse @ .get_script_base_path
		 * 
		 * @param {String}text
		 *            string to evaluate
		 * @param {Boolean}cache_error
		 *            是否 cache error.<br />
		 *            Warning: deprecated. 请自行 cache.
		 * @param {Function}[filter]
		 *            callback/receiver to filter the value<br />
		 *            Warning: deprecated. Please use Object.filter () instead.
		 * 
		 * @returns evaluated value
		 */
		function eval_parse(text, cache_error, filter) {
			if (cache_error)
				try {
					return eval_parse(text, filter);
				} catch (e) {
					if (_.is_debug(2))
						_.error('eval_parse: SyntaxError: [' + text + ']');
					// throw e;
					return;
				}

			if (text)
				// borrow from Google, jQuery
				// TODO: 对 {String}text 只是做简单处理，势必得再加强。
				text = ((new Function("return({o:" + text + "\n})"))()).o;

			return text;
		}

		// see Array.from of dependency_chain.js
		function tag_list_default(tag, context) {
			// 必须考量输入的可能是 document.styleSheets 的情况。
			// 须注意: @ IE8, false === CeL.is_NodeList(document.styleSheets);
			return tag
					&& Array.prototype.slice
							.call(typeof tag === 'string' ? (context || document)
									.getElementsByTagName(tag)
									: tag) || [];
		}
		function tag_list_compatible(tag, context) {
			var list = [], i = 0, nodes = typeof tag === 'string' ? (context || document)
					.getElementsByTagName(tag)
					: tag, length = nodes && nodes.length || 0;
			while (i < length)
				list.push(nodes[i++]);
			return list;
		}
		_// JSDT:_module_
		.
		// 代替 .getElementsByTagName(), get <tag> nodes, 并将之转成不变化的 native Array.
		get_tag_list = _.is_WWW(1) ? function(tag, context) {
			var list;
			try {
				// 一般做法。
				list = tag_list_default(tag, context);
				_.get_tag_list = tag_list_default;
			} catch (e) {
				// Array.prototype.slice.call(document.getElementsByTagName('a'))
				// Array.prototype.slice.call(document.getElementsByTagName('a'),0)
				// get error @ IE8 (Script engine: JScript 5.8.18702):
				// Error 5014 [TypeError] (facility code 10): 必须要有 JScript 物件
				// @ IE8: typeof document.getElementsByTagName('a') === 'object'
				list = tag_list_compatible(tag, context);
				// 成功才设定。
				if ((e.number & 0xFFFF) === 5014) {
					_.debug('get_tag_list: 使用旧的实现方法。');
					_.get_tag_list = tag_list_compatible;
				}
			}
			return list;
		} : function() {
			_.warn('get_tag_list: No method availed!');
			return [];
		};

		_// JSDT:_module_
		.
		/**
		 * 得知 script file 之相对 base path
		 * 
		 * @param {String}
		 *            JSFN script file name (NOT path name)
		 * @returns {String} relative base path
		 * @example <code>
		<script type="text/javascript" src="../baseFunc.js"></script>
		// 引数为本.js档名。若是更改.js档名，亦需要同时更动此值！
		var base_path = CeL.get_script_base_path('baseFunc.js');

		const main_script_path = CeL.get_script_base_path(/\.js/i, module);

		# perl:
		use File::Basename;
		</code>
		 */
		get_script_base_path = function(JSFN, terminal_module) {
			if (terminal_module === undefined && typeof module === 'object')
				terminal_module = module;

			// alert('JSFN: ' + JSFN);
			if (!JSFN) {
				if (_.is_WWW()) {
					// window.location.pathname
					JSFN = window.location.href.replace(/#.*$/, '');
					try {
						JSFN = typeof decodeURI === 'function' ? decodeURI(JSFN)
								: unescape(JSFN);
					} catch (e) {
						// TODO: handle exception
					}
				} else if (typeof terminal_module === 'object') {
					// for node.js
					JSFN = terminal_module.filename;
				} else if (_.script_host) {
					JSFN = WScript.ScriptFullName;
				} else if (false && typeof WshShell === 'object') {
					// 用在把档案拉到此档上时不方便。
					JSFN = WshShell.CurrentDirectory;
				}
				return typeof JSFN === 'string' ? JSFN.replace(/[^\\\/]+$/, '')
						: '';
			}

			// ----------------------------------

			// TODO: using import.meta.url

			// console.log([ typeof require, typeof require.main ]);
			// console.trace(require.main);
			var filename, test_filename = function(module) {
				var path = module.filename;
				if (false) {
					console.log('get_script_base_path: ' + JSFN + ' @ ' + path);
				}
				if (path
				// 在 electron 中可能会是 index.html 之类的。
				// && /\.js/i.test(path)
				&& (_.is_RegExp(JSFN) ? JSFN.test(path)
				//
				: path.indexOf(JSFN) !== -1)) {
					filename = path;
				}
			};
			if (typeof require === 'function'
			// There is no `require.main` @ electron 9.2-
			&& typeof require.main === 'object') {
				// for node.js 14.7+
				var _module = require.main;
				filename = null;
				while (_module) {
					test_filename(_module);
					if (_module === terminal_module)
						break;
					_module = _module.children;
				}
				if (!filename && terminal_module)
					test_filename(terminal_module);
				if (filename)
					return filename;
			}

			// There is no `module.parent` @ node.js 14.7+
			if (typeof module === 'object') {
				// for electron
				var _module = module;
				filename = null;
				while (_module) {
					// Warning: 此处不计 `terminal_module`!
					test_filename(_module);
					_module = _module.parent;
				}
				if (filename)
					return filename;
			}

			// ----------------------------------

			// We don't use is_Object or so.
			// 通常会传入的，都是已经验证过的值，不会出现需要特殊认证的情况。
			// 因此精准繁复的验证只用在可能输入奇怪引数的情况。
			if (!_.is_WWW())
				return '';

			// form dojo: d.config.baseUrl = src.substring(0, m.index);
			var i = 0, node = document.getElementById(_.env.main_script_name),
			// TODO: 若是有 id，则以 id 为主。
			o = node ? [ node ] : _.get_tag_list('script'), l = o.length, j, base_path, index;
			// console.log('-----------------------------------');
			// console.log(o);

			for (; i < l; i++)
				try {
					// o[i].src 多是 full path, o[i].getAttribute('src')
					// 仅取得其值，因此可能是相对的。
					j = node = o[i];
					j = j.getAttribute && j.getAttribute('src') || j.src;

					index = j.lastIndexOf(JSFN);
					// alert(j + ',' + JSFN + ',' + I);
					if (index !== -1) {
						// 正规化: URL 使用 '/' 而非 '\'
						// TODO: 尚未完善。
						if (j.indexOf('/') === -1 && j.indexOf('\\') !== -1)
							j = j.replace(/\\/g, '/');

						/**
						 * 处理<code>
						<script type="text/javascript" src="path/to/ce.js">//{"run":"initializer"}</script>
						</code>
						 */
						if (setup_extension) {
							if (JSFN === _.env.main_script)
								setup_extension(_.env.script_extension, node);
							else if (JSFN === _.env.main_script_name)
								setup_extension(j.slice(index + JSFN.length),
										node);
						}

						base_path = j.slice(0, index);
						if (j.length === index + JSFN.length) {
							// test 是否以 JSFN 作为结尾。
							// 注意: 依照现行的实作方法，用loader来载入JSFN时，必须以 JSFN 作为结尾。
							break;
						}
					}
				} catch (e) {
				}

			// _.log()

			// base_path || './'
			return base_path || '';
		};
		if (false)
			console.log(_.get_tag_list('script').map(function(n) {
				return n.getAttribute('src')
			}));

		/**
		 * 处理<code>
		<script type="text/javascript" src="path/to/ce.js">//{"run":"initializer"}</script>
		</code>
		 * TODO: modify the dirty hack.
		 */
		var setup_extension = function(extension, node) {
			if (extension === _.env.script_extension
			// || extension === '.js' || extension === '.txt'
			) {
				// TODO: unload 时 delete .script_node
				// _.script_node = node;
				var env = _.env, config, matched;
				try {
					config = node.innerText || (config = node.firstChild)
							&& config.nodeValue;
					// IE8 没有 .innerText || .nodeValue
					if (!config
							&& typeof (config = node.innerHTML) === 'string')
						config = (matched = config
								.match(/^[\s\n]*<!--(.+?)-->[\s\n]*$/)) ? matched[1]
								: config.replace(/<!--([\s\S]*?)-->/g, '');
					if (config) {
						// http://www.whatwg.org/specs/web-apps/current-work/multipage/scripting-1.html#inline-documentation-for-external-scripts
						// If there is a src attribute, the element must be
						// either empty or contain only script documentation
						// that also matches script content restrictions.
						if (matched = config.match(/\/\*([\s\S]+?)\*\//))
							config = matched[1];
						if (config = (typeof JSON === 'object' && JSON.parse || eval_parse)
								(config.replace(/[\s\r\n]*\/\//g, '')))
							env.script_config = config;
					}
				} catch (e) {
					_.error('setup_extension: Invalid configuration: ['
							+ node.outerHTML + ']');
					_.error(e);
				}

				env.main_script = env.main_script.replace(new RegExp('\\'
						+ env.script_extension + '$'), extension);
				env.script_extension = extension;

				// alert(env.main_script + '\n' + env.script_extension);

				// done.
				setup_extension = null;
			}
		};

		// ----------------------------------------------------------------------------------------------------------------------------------------------------------//

		_// JSDT:_module_
		.
		/**
		 * test 是否符合 module pattern.
		 * 
		 * TODO: improve
		 * 
		 * @param {String}
		 *            test_string string to test
		 * @returns {Boolean} 是否符合 module pattern
		 */
		is_module_pattern = function(test_string) {
			var env = _.env;
			var r = env.module_identifier_RegExp;
			if (!r) {
				// initial module_identifier_RegExp
				r = env.identifier_RegExp.source;
				r = env.module_identifier_RegExp = new RegExp('^' + r + '(\\.'
						+ r + ')*$');
			}

			return r.test(test_string);
		};

		_// JSDT:_module_
		.
		/**
		 * test function.request 的项目是否为 module.<br />
		 * 以 ./ 开头可以确保必定是 path.
		 * 
		 * TODO: 现在还有很大问题!
		 * 
		 * @param {String}resource_String
		 *            resource to test
		 * @returns {Boolean} resource 是否为 module (true: is module, false: is
		 *          URL?)
		 */
		match_module_name_pattern = function match_module_name_pattern(
				resource_String) {
			return typeof resource_String !== 'string'
					|| resource_String.charAt(0) === '.'
					|| resource_String.charAt(0) === '/'
					|| resource_String.indexOf(':') !== -1
					// || resource_String.indexOf('%')!==-1
					|| /\.(js|css)$/i.test(resource_String) ? false : /\.$/
					.test(resource_String)
					|| _.is_module_pattern(resource_String);
		};

		_// JSDT:_module_
		.
		/**
		 * reduce path. 减缩 path. 转化所有 /., /.., // 尚未处理：: * ?
		 * 
		 * @example <code>

		CeL.simplify_path('http://hostname.org/pp/../aaa/bbb/../ccc/../ddd');

		</code>
		 * 
		 * @param {String}path
		 *            欲转化之 path
		 * @returns {String} path
		 * @since 2009/11/23 22:32:52
		 */
		simplify_path = function simplify_path(path, options) {
			_.debug('[' + typeof path + '] [' + path + ']', 8, 'simplify_path');
			if (false && typeof path !== 'string')
				return path;
			// path = '' + path;
			path = String(path);
			if (!path)
				return;
			if (/^"([^"]+)"$|^'([^']+)'$/.test(path)) {
				// JSON.parse(path);
				path = path.slice(1, -1);
			}

			// Windows environment variables 在真实 path 前,尚未测试！
			// Using function ExpandEnvironmentStrings(string) @
			// CeL.application.platform.nodejs instead!
			if (false && typeof WinEnvironment === 'object'
					&& (t = path.match(/%(.+)%/g))) {
				for ( var i in t)
					if (WinEnvironment[i])
						path.replace(new RegExp(i, "ig"), WinEnvironment[i]);
			}

			// 有 head 表示 is absolute
			var head, tail, is_URL;
			// 对于 URL 如：
			// https://web.archive.org/web/http://site.org
			// http://site.org?p=//\\#a/b/c
			// 由于有太多不可不可预测因素，因此需特别处理之。
			if (/[\w\-]:\/\//.test(path)) {
				// [ all, protocol + ://, path ]
				is_URL = path.match(/^((?:(?:file:\/|[\w\-]+:)?\/)?\/)(.*?)$/);
				if (is_URL) {
					// e.g.,
					// 'http://example.org/path/to/'
					// '//example.org/path/to/'
					// '/example.org/path/to/'
					head = is_URL[1];
					path = is_URL[2];
				} else {
					// e.g., '/path/to/http://example.org/path/to/'
				}
				is_URL = true;
				if (tail = path.match(/^([^#?]+)([#?].*?)$/) || '') {
					path = tail[1];
					tail = tail[2];
				}
				if (/\/$/.test(path)) {
					// 保存 path 最后的 '/'。
					path = path.slice(0, -1);
					tail = '/' + tail;
				}
				path = path.replace(/:\/\//g, encodeURIComponent(':/') + '/');
			} else {
				path = path.replace(
						/^(?:[a-zA-Z]:\\?|\\\\(?:[^\\\/]+)\\?|\\|\/)/,
						function($0) {
							head = $0;
							return '';
						})
				// 不应去除前后空白. TODO: use String.prototype.trim()
				// .replace(/\s+$|^\s+/g,'')
				// .replace(/\/\/+/g,'/')
				;
				if (tail = path.match(/^(.*?)([\\\/]+)$/))
					path = tail[1], tail = tail[2].charAt(0);
			}

			var separator_matched = path.match(/[\\\/]/) || tail
					&& tail.match(/^[\\\/]/);
			if (!separator_matched)
				return (head || '') + path + (tail || '') || '.';
			path = path.split(/[\\\/]+/);

			for (var i = 0, length = path.length; i < length; i++) {
				if (path[i] === '.') {
					// ./ → ''
					// /./ → /
					path[i] = '';

				} else if (path[i] === '..') {
					// xx/../ → ''
					var j = i;
					while (j > 0)
						if (path[--j] && path[j] !== '..') {
							// 找到第一个非 '', '..' 的以相消。
							path[i] = path[j] = '';
							break;
						}
				}
			}

			// '//path' → '/path', '///path' → '/path'
			while (path.length > 0 && !path[0]
			// '/../path' → '/path'
			|| path[0] === '..' && head)
				path.shift();
			while (path.length > 0 && !path[path.length - 1]) {
				// 因为有 separator 结尾的话，应该都放在 tail 了；因此此处能去掉所有的空结尾。
				path.pop();
			}

			path = path.join(separator_matched[0])
			// 对 archive.org 之类的网站，不可以简化 '://'。
			// 若为了预防有些情况下需要保留 '//'，此条需要 comment out。
			// '//' → '/'
			.replace(/([\\\/])[\\\/]+/g, '$1')
			// .replace(head ? /^([\\\/]\.\.)+/g : /^(\.[\\\/])+/g, '')
			;

			// postfix
			if (is_URL)
				// recover. '%3A%2F': encodeURIComponent(':/')
				path = path.replace(/%3A%2F\//g, '://');
			if (head)
				path = head + path;
			else if (!path)
				path = '.';
			if (tail)
				path += tail;

			if (false && options && options.directory_only) {
				// 去除档名，只余目录。如输入 http://hostname.org/aaa/bbb/ccc，得到
				// http://hostname.org/aaa/bbb/
				// 假如输入sss/ddd，会把ddd除去！需输入sss/ddd/以标示ddd为目录.
				path = path.replace(/[^\\\/]+$/, '');
			}

			_.debug('→ [' + path + ']', 8, 'simplify_path');
			return path;
		};

		_// JSDT:_module_
		.
		/**
		 * 将输入的 string 分割成各 module 单元。已去除 library name。<br />
		 * need environment_adapter()<br /> ** 并没有对 module 做完善的审核!
		 * 
		 * @param {String}
		 *            module_name module name
		 * @returns {Array} module unit array
		 */
		split_module_name = function(module_name) {
			if (false)
				_.debug('['
						+ module_name
						+ ']→['
						+ module_name.replace(/\.\.+|\\\\+|\/\/+/g, '.').split(
								/\.|\\|\/|::/) + ']');
			if (typeof module_name === 'string') {
				module_name = module_name
				// .replace(/\.\.+|\\\\+|\/\/+/g, '.')
				// '.': CeL.env.module_name_separator
				.replace(/[\\\/]+/g, '.').split(/[.\\\/]|::/);
			}

			if (Array.isArray(module_name) && module_name.length) {
				// 去除 library name。
				if (// module_name.length > 1 &&
				_.Class === module_name[0])
					module_name.shift();
				return module_name;
			} else
				return [ '' ];
		};

		_// JSDT:_module_
		.
		/**
		 * 取得 module 之 name。以 library name 起始。
		 * 
		 * @returns {String} module name start with library name
		 */
		to_module_name = function(module, separator) {
			if (_.is_Function(module))
				module = module.Class;
			else if (module === _.env.main_script_name)
				module = _.Class;

			if (typeof module === 'string')
				module = _.split_module_name(module);

			var name = '';
			if (Array.isArray(module)) {
				if (typeof separator !== 'string')
					separator = _.env.module_name_separator;
				if (module[0] !== _.Class)
					name = _.Class + separator;
				name += module.join(separator);
			}

			return name;
		};

		// ----------------------------------------------------------------------------------------------------------------------------------------------------------//

		_// JSDT:_module_
		.is_local = function() {
			// cache
			return (_.is_local = _.constant_function(!_.is_WWW()
					|| window.location.protocol === 'file:'))();
		};

		// ----------------------------------------------------------------------------------------------------------------------------------------------------------//

		_.reset_env();

	}
	// 不用 apply()，因为比较旧的浏览器没有 apply()。
	)(CeL);
}







if (typeof CeL === 'function')
	(function(library_namespace) {

		var
		/** {Number}未发现之index。 const: 基本上与程式码设计合一，仅表示名义，不可更改。(=== -1) */
		NOT_FOUND = ''.indexOf('_');

		// ---------------------------------------------------------------------//
		// 为一些比较旧的版本或不同浏览器而做调适。

		// @see data.code.compatibility.

		// cache.
		var Array_slice = Array.prototype.slice;

		/**
		 * Function.prototype.apply();<br />
		 * apply & call: after ECMAScript 3rd Edition.<br />
		 * 不直接用 value undefined: for JS5.
		 * 
		 * 传回某物件的方法，以另一个物件取代目前的物件。
		 * apply是将现在正在执行的function其this改成apply的引数。所有函数内部的this指针都会被赋值为oThis，这可实现将函数作为另外一个对象的方法运行的标的.
		 * xxx.apply(oThis,arrayArgs): 执行xxx，执行时以 oThis 作为 this，arrayArgs作为
		 * arguments.
		 * 
		 * @param apply_this_obj
		 * @param apply_args
		 * @returns apply 后执行的结果。
		 * @see http://msdn.microsoft.com/en-us/library/4zc42wh1(VS.85).aspx
		 *      http://www.cnblogs.com/sunwangji/archive/2007/06/26/791428.html
		 *      http://www.cnblogs.com/sunwangji/archive/2006/08/21/482341.html
		 *      http://msdn.microsoft.com/en-us/library/4zc42wh1(VS.85).aspx
		 *      http://www.interq.or.jp/student/exeal/dss/ejs/3/1.html
		 *      http://blog.mvpcn.net/fason/
		 *      http://d.hatena.ne.jp/m-hiyama/20051017/1129510043
		 *      http://noir.s7.xrea.com/archives/000203.html
		 *      http://www.tohoho-web.com/js/object.htm#inheritClass
		 * 
		 * @since 2011/11/20
		 */
		function apply(apply_this_obj, apply_args) {
			var temp_apply_key, _arg_list = [], r, i = 0, l = apply_args
					&& apply_args.length;

			if (apply_this_obj !== null
					&& typeof apply_this_obj !== 'undefined')
				try {
					apply_this_obj[temp_apply_key = 'temp_apply'] = this;
				} catch (e) {
					temp_apply_key = null;
				}

			if (l) {
				for (; i < l; i++)
					_arg_list[i] = 'apply_args[' + i + ']';
				if (!temp_apply_key)
					apply_this_obj = this;
				r = eval('apply_this_obj'
						+ (temp_apply_key ? '.' + temp_apply_key : '') + '('
						+ _arg_list.join(',') + ')');
			} else
				r = temp_apply_key ? apply_this_obj[temp_apply_key]() : this();

			if (temp_apply_key)
				delete apply_this_obj[temp_apply_key];
			return r;
		}

		/**
		 * Function.prototype.call();<br />
		 * call 方法是用来呼叫代表另一个物件的方法。call 方法可让您将函式的物件内容从原始内容变成由 thisObj 所指定的新物件。
		 * 如果未提供 thisObj 的话，将使用 global 物件作为 thisObj。
		 * 
		 * @see http://msdn.microsoft.com/library/CHT/jscript7/html/jsmthcall.asp
		 * @since 2011/11/20
		 */
		function call(this_obj) {
			// 因 arguments 非 instanceof Array，
			// arguments.slice(sp) → Array.prototype.slice.call(arguments, sp).
			return this.apply(this_obj, Array_slice.call(arguments, 1));
		}

		function copy_properties_keys(from, to) {
			Object.keys(from).forEach(function(property) {
				to[property] = from[property];
			});
			return to;
		}
		var copy_properties = library_namespace.copy_properties = function copy_properties_old(
				from, to) {
			// TODO: using Object.getOwnPropertyNames() to copy others
			if (Object.keys) {
				copy_properties = library_namespace.copy_properties = copy_properties_keys;
				return copy_properties(from, to);
			}

			for ( var property in from)
				to[property] = from[property];
			return to;
		};
		// 有 Object.keys() 则使用 Object.keys()。
		copy_properties(Object.create(null), Object.create(null));

		/**
		 * Function.prototype.bind();
		 * 
		 * @since 2011/11/20
		 * @see <a
		 *      href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind"
		 *      accessdate="2012/2/4 16:39">bind</a>
		 */
		function bind(this_obj) {
			var func = this, args;
			if (arguments.length < 2)
				return this_obj === null || typeof this_obj === 'undefined' ? func
						: copy_properties(func, function() {
							if (false)
								library_namespace.debug('this_obj: ['
										+ this_obj + '],<br />\nfunction: ('
										+ typeof func + ') [' + func + ']', 1,
										'bind');
							return func.apply(this_obj, arguments);
						});

			args = Array_slice.call(arguments, 1);
			return copy_properties(func, function() {
				var counter = arguments.length, arg, i;
				if (!counter)
					return func.apply(this_obj, args);

				// TODO: TEST: 对于少量 arguments，将 arguments 添入于 .concat() 以加快速度。
				arg = args.concat();
				i = counter + args.length;
				while (counter--)
					arg[--i] = arguments[counter];
				return func.apply(this_obj, arg);
			});
		}

		// public interface.
		library_namespace.set_method(Function.prototype, {
			apply : apply,
			call : call,
			bind : bind
		});

		// ---------------------------------------------------------------------//
		// for Iterator

		// for the Iterator interface

		/**
		 * 
		 * @param object
		 *            object to iterate
		 * @param {String|Function}kind
		 *            kind (The possible values are: "key", "value",
		 *            "key+value"), or next function(index, Iterator, arguments)
		 */
		function create_list_iterator(object, kind, get_Array, use_origin) {
			var key, iterator;
			if (use_origin && Array.isArray(object))
				iterator = object;
			else
				for (key in (iterator = []))
					// delete any properties that can be iterated.
					delete iterator[key];
			// assert: Array.isArray(iterator)

			if (!kind && typeof kind !== 'function')
				kind = Array.isArray(object) ? 'value'
				// 当作 Object。视 for(in) 而定。
				: 'key';

			// define iterator
			if (typeof object.forEach === 'function')
				object.forEach(kind === 'value' ? function(value) {
					iterator.push(value);
				} : kind === 'key' ? function(value, key) {
					iterator.push(key);
				} : function(value, key) {
					iterator.push([ key, value ]);
				});
			else
				for (key in object)
					iterator.push(
					//
					kind === 'key' ? key
					//
					: kind === 'value' ? object[key]
					// "key+value"
					: [ key, object[key] ]);

			if (get_Array)
				return iterator;

			return new Array_Iterator(iterator, true);
		}

		// ---------------------------------------------------------------------//

		/**
		 * test code for Map, Set, Array.from():
		 * 
		 * TODO:<br />
		 * test: Array.from(Iterator, other arrayLike)
		 * 
		 * @example <code>

		// More examples: see /_test suite/test.js

		 * </code>
		 * 
		 */

		// Array.from()
		function from(items, mapfn, thisArg) {
			if (typeof items === 'undefined' || items === null) {
				throw new Error('Cannot convert undefined or null to object');
			}
			var array, i, iterator = items && !Array.isArray(items)
			// 测试是否有 iterator。
			&& (
			// items['@@iterator'] ||
			items.constructor === Set ? 'values'
			//
			: (items.entries ? 'entries' : items.values && 'values'));

			if (!iterator && typeof items.next === 'function') {
				// items itself is an iterator.
				iterator = items;
			}

			if (iterator) {
				array = [];

				// need test library_namespace.env.has_for_of
				// for(i of items) array.push(i);

				if (typeof iterator === 'function')
					iterator = iterator.call(items);
				else if (iterator && typeof items[iterator] === 'function')
					iterator = items[iterator]();
				else if (!iterator.next)
					throw new Error('Array.from: invalid iterator!');

				while (!(i = iterator.next()).done)
					array.push(i.value);
				return array;
			}

			if (typeof mapfn !== 'function') {
				try {
					// for IE, Array.prototype.slice.call('ab').join() !== 'a,b'
					return typeof items === 'string' ? items.split('')
							: Array_slice.call(items);
				} catch (e) {
					if ((e.number & 0xFFFF) !== 5014)
						throw e;
					mapfn = null;
				}
			}

			var length = items && items.length | 0;
			array = [];
			if (mapfn) {
				for (i = 0; i < length; i++) {
					array.push(thisArg ? mapfn.call(thisArg, items[i], i)
					// 不采用 .call() 以加速执行。
					: mapfn(items[i], i));
				}
			} else {
				while (i < length)
					array.push(items[i++]);
			}

			return array;
		}

		library_namespace.set_method(Array, {
			from : from
		});

		function Array_Iterator_next() {
			// this: [ index, array, use value ]
			library_namespace.debug(this.join(';'), 6, 'Array_Iterator.next');
			var index;
			while ((index = this[0]++) < this[1].length)
				if (index in this[1])
					return {
						value : this[2] ? this[1][index]
						//
						: [ index, this[1][index] ],
						done : false
					};

			// 已经 done 的不能 reuse。
			this[0] = NaN;
			return {
				value : undefined,
				done : true
			};
		}

		function Array_Iterator(array, use_value) {
			// library_namespace.debug(array);
			// reset index to next index.
			// define .next() function onto items.
			this.next = Array_Iterator_next.bind([ 0, array, use_value ]);
		}
		Array_Iterator.prototype.toString = function() {
			return "[object Array Iterator]";
		};

		// export.
		library_namespace.Array_Iterator = Array_Iterator;

		// ---------------------------------------------------------------------//
		// 测试是否具有标准的 ES6 Set/Map collections (ECMAScript 6 中的集合类型)。

		var is_Set, is_Map, has_native_Set, has_native_Map,
		//
		KEY_not_native = library_namespace.env.not_native_keyword,
		// use Object.defineProperty[library_namespace.env.not_native_keyword]
		// to test if the browser don't have native support for
		// Object.defineProperty().
		has_native_Object_defineProperty = !Object.defineProperty[KEY_not_native];

		try {
			has_native_Set = !!(new Set());
			has_native_Map = !!(new Map());

			// TODO: use library_namespace.type_tester()
			is_Set = function(value) {
				return Object.prototype.toString.call(value) === "[object Set]";
			};
			is_Map = function(value) {
				return Object.prototype.toString.call(value) === "[object Map]";
			};

			// (new Map()).entries();
			(new Map()).forEach();

		} catch (e) {

			// browser 非标准 ES6 collections。
			// 想办法补强。

			// TODO: WeakMap 概念验证码:
			// var _WeakMap=function(v){return function(){return eval('v');};};
			// var a={s:{a:3}},g=_WeakMap(a.s);
			// delete a.s;/* .. */alert(g());
			// https://code.google.com/p/es-lab/source/browse/trunk/src/ses/WeakMap.js

			if (!has_native_Object_defineProperty || !has_native_Set
					|| !has_native_Map)
				(function() {
					library_namespace
							.debug('完全使用本 library 提供的 ES6 collections 实作功能。');

					// ---------------------------------------

					/**
					 * hash 处理。在尽可能不动到 value/object 的情况下，为其建立 hash。<br />
					 * 在 ES5 下，尽可能模拟 ES6 collections。<br />
					 * 在先前过旧的版本下，尽可能达到堪用水准。
					 * 
					 * @see <a
					 *      href="https://github.com/Benvie/harmony-collections/blob/master/harmony-collections.js"
					 *      accessdate="2012/12/12 17:0"
					 *      title="harmony-collections/harmony-collections.js at
					 *      master · Benvie/harmony-collections ·
					 *      GitHub">harmony-collections</a>
					 */
					var max_hash_length = 80,
					// operator
					ADD = 1, DELETE = 2,
					// id 注记。
					Map_id = 'Map id\n' + Math.random(),
					// Object.prototype.toString.call()
					get_object_type = library_namespace.get_object_type,
					// private operator, access/pass keys.
					// ** WARNING:
					// Should be Array (see forEach).
					// 只要是 object，会以 reference 传递，可以 "===" 判断即可。
					OP_HASH = [],
					//
					OP_SIZE = [],
					//
					OP_KEYS = [], OP_VALUES = [], OP_ENTRIES = [],
					// 取得裸 Object (naked Object) 与属性判别函数。
					new_hash_set = function new_hash_set() {
						var hash_map = Object.create(null);
						// [ hash_map, has_hash() ]
						return [ hash_map, function(key) {
							return key in hash_map;
						} ];
					};

					// 测试可否用 \0 作为 id。
					(function() {
						var o = {}, a = [], t = {}, id = '\0' + Map_id;
						o[id] = a[id] = t;
						if (o[id] === t && a[id] === t)
							Map_id = id;
					})();

					try {
						new_hash_set();

					} catch (e) {
						// 使用较原始的方法。
						new_hash_set = function() {
							var hash_map = {};
							return [ hash_map,
							// has_hash()
							Object.hasOwn ? function(key) {
								return Object.hasOwn(hash_map, key);
							} : Object.prototype.hasOwnProperty
							//
							? function(key) {
								return Object.prototype.hasOwnProperty
								//
								.call(hash_map, key);
							} : Object.prototype ? function(key) {
								return key in hash_map
								//
								&& hash_map[key] !== Object.prototype[key];
							} : function(key) {
								return key in hash_map;
							} ];
						};
					}

					/**
					 * 判别是否为 <a href="http://zh.wikipedia.org/wiki/-0"
					 * accessdate="2013/1/6 19:0" title="负零">−0</a>。
					 * 
					 * @see <a href="http://en.wikipedia.org/wiki/Signed_zero"
					 *      accessdate="2012/12/15 12:58">Signed zero</a>, <a
					 *      href="http://www.cnblogs.com/ziyunfei/archive/2012/12/10/2777099.html"
					 *      accessdate="2012/12/15 13:0">[译]JavaScript中的两个0 -
					 *      紫云飞 - 博客园</a>
					 */
					var is_negative_zero = Object.is && !Object.is(+0, -0)
					// Object.is() 采用 SameValue Algorithm。
					? function(value) {
						return Object.is(value, -0);
					}
					// 相容方法。
					: function(value) {
						return value === -0 && 1 / value === -Infinity;
					};
					library_namespace.is_negative_zero = is_negative_zero;

					/**
					 * 键值对。
					 * 
					 * TODO: comparator
					 * 
					 * @constructor
					 * 
					 * @see <a
					 *      href="https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Map"
					 *      accessdate="2012/12/10 7:48">Map - JavaScript | MDN</a>
					 */
					function Map(iterable, comparator) {
						if (this === null || this === undefined
								|| this === library_namespace.env.global) {
							// 采用 Map()，而非 new 呼叫。
							// called as a function rather than as a
							// constructor.
							return new Map(iterable, comparator);
						}

						var size,
						// {Object}map hash to key (object) Array.
						//
						// get hash map of (
						// hash → [value/object 1, value/object 2, ..]
						// )
						hash_map,
						// has this hash.
						has_hash,
						// {Object}value objects 的 id hash map。可用来维持插入顺序。
						// value_of_id[
						// id: {String}hash + "_" + {ℕ⁰:Natural+0}index
						// ] = value.
						//
						// 在 Set 中 value_of_id={ id: key object }，
						// 因此可以更快的作 forEach()。
						value_of_id;

						// 快速处理法。
						Object.defineProperty(this, 'clear', {
							// enumerable : false,
							value : function clear() {
								// reset.
								var set = new_hash_set();
								hash_map = set[0];
								has_hash = set[1];
								value_of_id = Object.create(null);
								size = 0;
							}
						});
						// 初始化。
						this.clear();

						Object.defineProperty(this, 'size', {
							// enumerable : false,
							// configurable : false,
							get : function() {
								return size;
							},
							set : function(v) {
								if (Array.isArray(v) && v[1] === OP_SIZE)
									size = v[0];
							}
						});

						// 假扮的 interface（仮面）:
						// 借用标准 method 介面，
						// 若是传入 OP_*，则表示为 private method，作出内部特殊操作。
						// 否则作出正常表现。
						//
						// 使用这方法以尽量减少多余的 property 出现，
						// 并维持 private method 之私密特性。
						Object.defineProperty(this, 'values', {
							// enumerable : false,
							value : function values() {
								// arguments[0]: 隐藏版 argument。
								if (arguments[0] === OP_ENTRIES)
									// 传入 OP_*，则表示为 private method。
									// 回传 private property 以便操作。
									return [ hash_map, value_of_id ];
								if (arguments[0] === OP_VALUES)
									return create_list_iterator(value_of_id,
											'value', true);

								// 作出正常表现。
								return create_list_iterator(value_of_id,
										'value');
							}
						});

						// 为了能初始化 iterable，因此将设定函数放在 constructor 中。

						Object.defineProperty(this, 'has', {
							// enumerable : false,
							value : function has(key) {
								// arguments[1]: 隐藏版 argument。
								return arguments[1] === OP_HASH ?
								// 传入 OP_HASH，则表示为 private method，回传 has_hash()。
								has_hash(key) :
								// 作出正常表现。
								!!hash_of_key.call(this, key);
							}
						});

						if (iterable)
							// initialization. 为 Map 所作的初始化工作。
							try {
								if (Array.isArray(iterable)) {
									// "key+value"
									for (var index = 0; index < iterable.length; index++) {
										var entry = iterable[index];
										this.set(entry[0], entry[1]);
									}
								} else if (iterable.forEach) {
									var _this = this;
									iterable.forEach(function(v, k) {
										_this.set(k, v);
									});
								} else {
									throw 1;
									for ( var k in iterable)
										this.set(k, iterable[k]);
								}
							} catch (e) {
								if (false) {
									library_namespace.info('' + this.set);
									library_namespace.info(Array
											.isArray(iterable) ? 'isArray'
											: iterable.forEach ? 'forEach'
													: 'throw');
									library_namespace.error(e);
								}
								throw new TypeError(
								//
								'Map: Input value is not iterable: '
								//
								+ (library_namespace.is_Object(iterable)
								//
								? library_namespace.is_type(iterable)
								//
								: iterable));
							}
					}

					/**
					 * collections 之核心功能：get hash of specified value/object.<br />
					 * 所有对 hash_map 之变更皆由此函式负责。<br />
					 * 
					 * 本函式仅能以下列方式呼叫：<br />
					 * <code>
					 * hash_of_key.call(this, ..)
					 * </code>
					 * 
					 * TODO: hash collision DoS
					 * 
					 * @param key
					 *            key object
					 * @param {Integer}operator
					 *            操作
					 * @param value
					 *            value object
					 * 
					 * @private
					 * 
					 * @returns [ hash, index ]
					 */
					function hash_of_key(key, operator, value) {
						if (arguments.length === 0)
							return;

						var hash = this.values(OP_ENTRIES), type = typeof key, map = this,
						//
						hash_map = hash[0], value_of_id = hash[1],
						//
						add_size = has_native_Object_defineProperty ?
						// set inner 'size' property
						function(v) {
							map.size = [ map.size + v, OP_SIZE ];
						} : function(v) {
							map.size += v;
						},
						//
						add_value = function(no_size_change) {
							value_of_id[hash + '_' + index] = value;
							if (!no_size_change)
								add_size(1);
						},
						//
						delete_one = function() {
							delete value_of_id[hash + '_' + index];
							add_size(-1);
						};

						// https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Operators/typeof
						switch (type) {

						case 'string':
							hash = key;
							break;

						case 'number':
							if (is_negative_zero(key)) {
								// 直接避免纷争。
								//
								// 实际应使用 SameValue Algorithm。
								// 因为本处实作采用 Array.prototype.indexOf()，
								// 而 indexOf() 采用严格相等运算符(===)；
								// 实际上应该处理所有 "===" 判断为相等，
								// 但以 SameValue Algorithm 并不相等的值。
								hash = '-0';
								break;
							}

						case 'boolean':
						case 'undefined':
							hash = String(key);
							break;

						// 对以上纯量，无法判别个别 instance。

						case 'function':
							if (library_namespace.is_Function(key)) {
								// 若设定 function.toString，仅能得到 key.toString()。
								hash = String(key);
								// 尽量增加 hash 能取得的特征。
								hash = hash.length + '|' + hash;
								break;
							}
						case 'object':
							try {
								if (!(hash = key[Map_id])) {
									// 对于 Object/Arrry，在更改内容的情况下，可能无法得到相同的特征码，
									// 因此还是加个 id 注记比较保险。
									hash = String(Math.random());
									Object.defineProperty(key, Map_id, {
										// configurable : true,
										// writable : false,
										// enumerable : false,
										value : hash
									});
									if (hash !== key[Map_id])
										throw new Error('无法设定 hash id: .['
												+ Map_id + ']');
								}
								break;
							} catch (e) {
								// TODO: handle exception
							}

							// 警告:采用不保险的方法。
							if (Array.isArray(key)) {
								hash = (2 * key.length < max_hash_length ? key
										: key.slice(0, max_hash_length / 2))
										.toString();
								break;
							}

							if (library_namespace.is_Object(key)) {
								hash = '{';
								var i;
								for (i in key) {
									hash += i + ':' + key[i] + ',';
									// 不须过长。
									if (hash.length > max_hash_length) {
										i = null;
										break;
									}
								}
								if (i !== null)
									// 已完结的时候，加个 ending mark。
									hash += '}';
								break;
							}

							// TODO:
							// test DOM, COM object.

							// case 'xml':
							// case 'date':

						default:
							try {
								hash = get_object_type(key) + key;
							} catch (e) {
								hash = '[' + type + ']' + key;
							}
							break;
						}

						// assert: typeof hash === 'string'

						// 正规化 hash。
						hash = hash.slice(0, max_hash_length).replace(
								/_(\d+)$/, '-$1');
						if (library_namespace.is_debug(6)
								&& library_namespace.is_WWW())
							library_namespace.debug('hash: [' + hash + ']', 0,
									'hash_of_key');

						if (this.has(hash, OP_HASH)) {
							var list = hash_map[hash],
							// 实际上应该以 SameValue Algorithm, Object.is() 判断。
							// NaN 等于 NaN, -0 不等于 +0.
							index = list.indexOf(key);
							if (library_namespace.is_debug(6)
									&& library_namespace.is_WWW())
								library_namespace.debug('index: [' + index
										+ ']', 0, 'hash_of_key');

							if (index === NOT_FOUND) {
								// 测试是否为本身与本身不相等的特殊情形。

								// TODO:
								// 侦测 ELEMENT_NODE.isSameNode,
								// Array 之深度检测等。

								// incase NaN. 可用 Number.isNaN().
								// 但不可用 isNaN(key), 因为 isNaN(非数字) === true.
								if (key !== key) {
									for (var i = 0, length = list.length; i < length; i++) {
										// 若具有所有可侦测的相同特征(特征码相同+本身与本身不相等)，
										// 则判别为相同。
										if (list[i] !== list[i]) {
											index = i;
											break;
										}
									}
								}

							}

							if (index === NOT_FOUND) {
								if (operator === ADD) {
									if (library_namespace.is_debug(5)
											&& library_namespace.is_WWW())
										library_namespace.debug(
												'冲突(collision) : ' + type
														+ ' @ hash [' + hash
														+ '], index ' + index
														+ ' / ' + list.length,
												0, 'hash_of_key');

									index = list.push(key) - 1;
									add_value();
								} else
									hash = undefined;

							} else if (operator === DELETE) {
								if (library_namespace.is_debug(6)
										&& library_namespace.is_WWW())
									library_namespace.debug('remove key: ['
											+ hash + ']', 0, 'hash_of_key');
								if (list.length < 2)
									// assert: list.length ===1 && list[0] ===
									// key.
									delete hash_map[hash];
								else
									// assert: list[index] === key.
									delete list[index];
								delete_one();
								return true;
							} else if (operator === ADD) {
								if (library_namespace.is_debug(6)
										&& library_namespace.is_WWW())
									library_namespace.debug('modify key: ['
											+ hash + ']', 0, 'hash_of_key');
								add_value(true);
							}

						} else if (operator === ADD) {
							// add new one.
							hash_map[hash] = [ key ];
							index = 0;
							add_value();
						} else
							hash = undefined;

						return operator === DELETE ? false : hash
								&& [ hash, index ];
					}

					function forEach(callbackfn, thisArg) {
						var id, match, key = this.values(OP_ENTRIES), value,
						//
						hash_map = key[0], value_of_id = key[1],
						//
						use_call = thisArg !== undefined && thisArg !== null
								&& typeof callback.call === 'function',
						//
						list = Array.isArray(callbackfn)
								&& (callbackfn === OP_ENTRIES ? function(v, k) {
									list.push([ k, v ]);
								} : callbackfn === OP_KEYS && function(v, k) {
									list.push(k);
								});

						if (list)
							callbackfn = list, list = [];

						for (id in value_of_id) {
							match = id.match(/^([\s\S]*)_(\d+)$/);
							// assert: match succeed.
							key = hash_map[match[1]][match[2] | 0];
							value = value_of_id[id];
							if (use_call)
								callbackfn.call(thisArg, value, key, this);
							else
								callbackfn(value, key, this);
						}

						if (list) {
							// 这里可以检测 size。
							// assert: size === list.length
							return new Array_Iterator(list, true);
						}
					}

					// public interface of Map.
					Object.assign(Map.prototype, {
						set : function set(key, value) {
							hash_of_key.call(this, key, ADD, value);
						},
						get : function get(key) {
							var hash = hash_of_key.call(this, key);
							if (hash)
								return this.values(OP_ENTRIES)[1][hash
										.join('_')];
						},
						'delete' : function Map_delete(key) {
							return hash_of_key.call(this, key, DELETE);
						},
						keys : function keys() {
							return this.forEach(OP_KEYS);
						},
						entries : function entries() {
							return this.forEach(OP_ENTRIES);
						},
						forEach : forEach,
						toString : function() {
							// Object.prototype.toString.call(new Map)
							// === "[object Map]"
							return '[object Map]';
						},
						// place holder for Map.prototype.values()
						// will reset runtime
						values : function() {
						}
					});

					// ---------------------------------------

					/**
					 * 一个不包含任何重复值的有序列表。<br />
					 * 
					 * NOTE:<br />
					 * 为了维持插入顺序，因此将 Set 作为 Map 之下层 (Set inherits
					 * Map)。副作用为牺牲（加大了）空间使用量。
					 * 
					 * @constructor
					 */
					function Set(iterable, comparator) {
						if (this === null || this === undefined
								|| this === library_namespace.env.global) {
							// 采用 Set()，而非 new 呼叫。
							// called as a function rather than as a
							// constructor.
							return new Set(iterable, comparator);
						}

						var map = new Map(undefined, comparator);

						Object.defineProperty(this, 'size', {
							// enumerable : false,
							// configurable : false,
							get : function() {
								return map.size;
							},
							set : function(v) {
								if (Array.isArray(v) && v[1] === OP_SIZE)
									map.size = v[0];
							}
						});

						this.values = has_native_Object_defineProperty ?
						//
						function values() {
							// arguments[0]: 隐藏版 argument。
							return arguments[0] === OP_VALUES ?
							//
							map[arguments[1]](arguments[2], arguments[3])
							// 作出正常表现。
							// 用 values 会比 keys 快些。
							: map.values();
						}
						// 先前过旧的版本。
						: function values() {
							// arguments[0]: 隐藏版 argument。
							if (arguments[0] === OP_VALUES) {
								var r = map[arguments[1]](arguments[2],
										arguments[3]);
								this.size = map.size;
								return r;
							}

							// 作出正常表现。
							// 用 values 会比 keys 快些。
							return map.values();
						};

						if (iterable)
							// initialization. 为 Set 所作的初始化工作。
							try {
								if (iterable.forEach) {
									iterable.forEach(function(v) {
										this.add(v);
									}, this);
								} else {
									for ( var i in iterable)
										this.add(iterable[i]);
								}
							} catch (e) {
								throw new TypeError(
								//
								'Set: Input value is not iterable: '
								//
								+ (library_namespace.is_Object(iterable)
								//
								? library_namespace.is_type(iterable)
								//
								: iterable));
							}
					}

					// public interface of Set.
					Object.assign(Set.prototype, {
						add : function add(value) {
							// 在 Set 中 value_of_id={ id: key object }，
							// 因此将 value 设成与 key 相同，可以更快的作 forEach()。
							return this.values(OP_VALUES, 'set', value, value);
						},
						// 对于 Map 已有的 function name，不能取相同的名称。
						// 相同名称的 function 在旧版 IE 会出问题：前面的会被后面的取代。
						// 因此无法使用 "function clear()"，
						// 仅能使用 "function Set_clear()"。
						// 余以此类推。
						clear : function Set_clear() {
							return this.values(OP_VALUES, 'clear');
						},
						'delete' : function Set_delete(value) {
							return this.values(OP_VALUES, 'delete', value);
						},
						has : function Set_has(value) {
							return this.values(OP_VALUES, 'has', value);
						},
						entries : function Set_entries() {
							var entries = [];
							this.values(OP_VALUES, 'values', OP_VALUES)
									.forEach(function(value) {
										entries.push([ value, value ]);
									});
							return new Array_Iterator(entries, true);
						},
						// 在 JScript 10.0.16438 中，两个 "function forEach()" 宣告，会造成
						// Map.prototype.forEach 也被设到 Set.prototype.forEach，但
						// Map.prototype.forEach !== Set.prototype.forEach。
						forEach : function Set_forEach(callbackfn, thisArg) {
							this.values(OP_VALUES, 'values', OP_VALUES)
									.forEach(callbackfn, thisArg);
						},
						toString : function() {
							// Object.prototype.toString.call(new Set)
							// === "[object Set]"
							return '[object Set]';
						},
						// place holder for Set.prototype.values()
						// will reset runtime
						values : function() {
						}
					});

					// ---------------------------------------

					// export.
					var global = library_namespace.env.global;
					(global.Set = library_namespace.Set = Set)[KEY_not_native] = true;
					(global.Map = library_namespace.Map = Map)[KEY_not_native] = true;

					if (false && Array.from === Array_from) {
						library_namespace
								.debug('做个标记，设定 Set.prototype[@@iterator]。');
						Set.prototype['@@iterator'] = 'values';
					}

					is_Set = function(value) {
						// value.__proto__ === Set.prototype
						return value && value.constructor === Set;
					};
					is_Map = function(value) {
						// value.__proto__ === Map.prototype
						return value && value.constructor === Map;
					};

				})();

			// ---------------------------------------------------------------------//

			// 现在只有 mozilla firefox 20 会执行到这。
			else if (library_namespace.env.has_for_of)

				// 现在只有 mozilla firefox 20 会需要这项补强。
				(function() {
					function collection_clear() {
						if (this.size > 0) {
							var list = [];
							this.forEach(function(v, k) {
								list.push(k);
							});
							list.forEach(function(k) {
								this['delete'](k);
							}, this);
							// last check.
							if (this.size > 0)
								library_namespace.warn(
								//
								'collection_clear: 仍有元素存在于 collection 中！');
						}
					}

					try {
						// 确定有 Set。
						var s = new Set(), a = [], Set_forEach;
						if (!s.forEach) {
							// shim (backward compatible) for
							// Set.prototype.forEach().
							// https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Set

							// use eval() because for(..of..) is not supported
							// in current (2013) environment.
							eval('Set_forEach=function(callback,thisArg){var i,use_call=thisArg!==undefined&&thisArg!==null&&typeof callback.call==="function";for(i of this)if(use_call)callback.call(thisArg,i,i,this);else callback(i,i,this);}');
							s.add('2 ');
							s.add(1);
							Set_forEach.call(s, function(i) {
								a.push(i);
							});

							if (a.join('|') === '2 |1') {
								library_namespace
										.debug('采用 Set_forEach() 作为 Set.prototype.forEach()。');
								Object.defineProperty(Set.prototype, 'forEach',
										{
											// enumerable : false,
											value : Set_forEach
										});
							}
						}

						if (!Set.prototype.clear)
							Object.defineProperty(Set.prototype, 'clear', {
								// enumerable : false,
								value : collection_clear
							});

						if (typeof Set.prototype.size === 'function') {
							var Set_size = Set.prototype.size;
							Object.defineProperty(Set.prototype, 'size', {
								// enumerable : false,
								get : Set_size
							});
						}

					} catch (e) {
					}

					try {
						// 确定有 Map。
						var m = new Map(), a = [], Map_forEach;
						if (!m.forEach) {
							// use eval() because for(..of..) is not supported
							// in current (2013) environment.
							eval('Map_forEach=function(callback,thisArg){var k,v,use_call=thisArg!==undefined&&thisArg!==null&&typeof callback.call==="function";for([k,v] of this)if(use_call)callback.call(thisArg,v,k,this);else callback(v,k,this);}');
							m.set('1 ', 2);
							m.set(' 3', 4);
							Map_forEach.call(m, function(v, k) {
								a.push(k, v);
							});
							if (a.join('|') === '1 |2| 3|4') {
								library_namespace
										.debug('采用 Map_forEach() 作为 Map.prototype.forEach()。');
								Object.defineProperty(Map.prototype, 'forEach',
										{
											// enumerable : false,
											value : Map_forEach
										});
							}
						}

						if (!Map.prototype.clear)
							Object.defineProperty(Map.prototype, 'clear', {
								// enumerable : false,
								value : collection_clear
							});

						if (typeof Map.prototype.size === 'function') {
							var Map_size = Map.prototype.size;
							Object.defineProperty(Map.prototype, 'size', {
								// enumerable : false,
								get : Map_size
							});
						}

					} catch (e) {
					}

					// TODO: .size

				})();

		}

		// IE11 无法使用 new Set([ , ])，但 firefox 23 可以。
		var Set_from_Array = new Set([ 1, 2 ]);
		library_namespace.Set_from_Array = Set_from_Array =
		//
		Set_from_Array.size === 2 ? function(array) {
			return new Set(array);
		} : function(array) {
			var set = new Set;
			if (typeof array.forEach === 'function')
				array.forEach(function(value) {
					set.add(value);
				});
			else
				set.add(array);
			return set;
		};

		// e.g., IE 11 has no Set.prototype.values()
		if (typeof Set.prototype.values !== 'function'
		//
		&& typeof Set.prototype.forEach === 'function')
			Set.prototype.values = function Set_prototype_values() {
				var values = [];
				this.forEach(function(v) {
					values.push(v);
				});
				return new Array_Iterator(values, true);
			};

		library_namespace.is_Set = is_Set;
		library_namespace.is_Map = is_Map;

		// ---------------------------------------------------------------------//

		var
		// 计数用。
		CONST_COUNT = 0,

		// const: 程序处理方法。
		// {Integer} PARALLEL (平行处理), SEQUENTIAL (循序/依序执行, in order).
		PARALLEL = 0, SEQUENTIAL = 1,

		// const: major status of object.
		// UNKNOWN 不可为 undefined，会造成无法判别。
		UNKNOWN = 'unknown',
		// LOADING, INCLUDING, reloading, reincluding.
		// WORKING = ++CONST_COUNT,
		// 主要的两种处理结果。
		// IS_OK = ++CONST_COUNT, IS_FAILED = ++CONST_COUNT,
		//
		PROCESSED = ++CONST_COUNT,

		// const: 详细 status/detailed information of object.
		// LOADING = ++CONST_COUNT, LOAD_FAILED = ++CONST_COUNT,
		//
		INCLUDING = ++CONST_COUNT, INCLUDE_FAILED = ++CONST_COUNT;
		// included: URL 已嵌入/挂上/named source code registered/函数已执行。
		// INCLUDED = ++CONST_COUNT;

		// ---------------------------------------------------------------------//

		/**
		 * 程式码主档内建相依性(dependency chain)和关联性处理 class。
		 * 
		 * @example <code>

		// More examples: see /_test suite/test.js

		 * </code>
		 * 
		 */
		function dependency_chain() {
			this.relations = new Map;
		}

		/**
		 * 取得指定 item 之 relation 结构。<br />
		 * TODO: 无此 item 时，预设不顺便加入此 item。
		 * 
		 * @param [item]
		 *            指定 item。未指定 item 时，回传所有 item 之 Array。
		 * @param {Boolean}[no_add]
		 *            无此 item 时，是否不顺便加入此 item。
		 * @returns 指定 item 之 relation 结构。
		 */
		function dependency_chain_get(item, no_add) {
			var relations = this.relations, relation;
			if (arguments.length === 0)
				// 未指定 item 时，回传所有 items。
				return relations.keys();

			if (!(relation = relations.get(item)) && !no_add)
				// initialization. 为 item 所作的初始化工作。
				relations.set(item, relation = {
					previous : new Set,
					next : new Set,
					// fallback
					item : item
				});

			return relation;
		}

		/**
		 * 将 previous → next (independent → dependent) 之相依性添加进 dependency chain。
		 * 
		 * @param previous
		 *            previous(prior) item.
		 * @param next
		 *            next item.
		 * @returns {dependency_chain} dependency chain
		 */
		function dependency_chain_add(previous, next) {
			if (0 < arguments.length
			//
			&& (previous !== undefined || (previous = next) !== undefined))
				if (previous === next || next === undefined) {
					// initialization. 为 previous 所作的初始化工作。
					this.get(previous);

				} else {
					// 维护双向指标。
					this.get(previous).next.add(next);
					this.get(next).previous.add(previous);
				}

			return this;
		}

		/**
		 * 自 dependency chain 中，删除此 item。
		 * 
		 * @param item
		 *            指定欲删除之 item。
		 * @returns {Boolean} item 是否存在，且成功删除。
		 */
		function dependency_chain_delete(item) {
			var relation, relations;
			if (!(relation = (relations = this.relations).get(item)))
				// 注意：此处与 ECMAScript [[Delete]] (P) 之预设行为不同！
				return false;

			if (library_namespace.is_debug() && relation.previous.size > 0)
				library_namespace.warn('删除一个还有 ' + relation.previous.size
						+ ' 个 previous 的元素。循环相依？');

			// 维护双向指标。
			relation.previous.forEach(function(previous) {
				var next_of_previous = relations.get(previous).next;

				// 维持/传递相依关联性。
				relation.next.forEach(function(next) {
					// 维护双向指标。

					// assert: previous, next 存在 relations 中。
					// 因此采取下列方法取代 <code>this.add(previous, next);</code> 以加快速度。
					next_of_previous.add(next);
					relations.get(next).previous.add(previous);
				});

				// 一一去除 previous 的关联性。
				next_of_previous['delete'](item);
			});

			// 一一去除 next 的关联性。
			relation.next.forEach(function(next) {
				relations.get(next).previous['delete'](item);
			});

			// delete self.
			relations['delete'](item);

			return true;
		}

		/**
		 * 取得需求链中独立之元素 (get the independent one)，<br />
		 * 或者起码是循环相依(循环参照, circular dependencies)的一员。
		 * 
		 * @param [item]
		 *            指定取得此 item 之上游。
		 * 
		 * @returns 独立之元素/节点，或者起码是循环相依的一员。
		 * 
		 * @see <a href="http://en.wikipedia.org/wiki/Loop_dependence_analysis"
		 *      accessdate="2012/12/10 8:54">Loop dependence analysis</a>
		 */
		function dependency_chain_independent(item) {
			var relations = this.relations, no_independent;
			if (relations.size > 0)
				try {
					if (!arguments.length) {
						library_namespace.debug('自 ' + relations.size
								+ ' 个元素中，随便取得一个没 previous 的元素。', 5,
								'dependency_chain.independent');
						// 用 for .. of 会更好。
						relations.forEach(function(declaration, _item) {
							library_namespace.debug('item [' + _item + ']', 6,
									'dependency_chain.independent');
							item = _item;
							if (declaration.previous.size === 0)
								throw 1;
						});

						if (library_namespace.is_debug())
							library_namespace
									.warn('dependency_chain.independent: 没有独立之元素!');
						no_independent = true;
					}

					var
					// 已经处理过的 item Set。
					chain = new Set,
					// 当前要处理的 item Set。
					current,
					// 下一个要处理的 item Set。
					next = new Set;

					next.add(item);
					item = undefined;

					while ((current = next).size > 0) {
						next = new Set;
						// 针对 item 挑一个没 previous 的元素。
						current.forEach(function(_item) {
							var declaration = relations.get(_item);
							if (declaration.previous.size === 0) {
								item = _item;
								throw 2;
							}

							if (!chain.has(_item))
								chain.add(_item);
							else {
								// 否则最起码挑一个在 dependency chain 中的元素。
								item = _item;
								if (no_independent)
									throw 3;
							}

							// 把所有未处理过的 previous 排入 next 排程。
							// 遍历 previous，找出独立之元素。
							declaration.previous.forEach(function(previous) {
								// assert: previous !== _item
								if (!chain.has(previous))
									next.add(previous);
								else if (no_independent) {
									item = previous;
									throw 4;
								}
							});

						});
					}
				} catch (e) {
					if (isNaN(e)) {
						library_namespace.warn('dependency_chain.independent: '
								+ e.message);
						library_namespace.error(e);
					}
				}

			return item;
		}

		// public interface of dependency_chain.
		Object.assign(dependency_chain.prototype, {
			get : dependency_chain_get,
			add : dependency_chain_add,
			// quote 'delete' for "必须要有识别项" @ IE8.
			'delete' : dependency_chain_delete,
			independent : dependency_chain_independent
		});

		// export.
		library_namespace.dependency_chain = dependency_chain;

		// ---------------------------------------------------------------------//
		// <b>named source code declaration</b> / <b>module controller</b> 之处理。

		/**
		 * named source code declaration.<br />
		 * named_code = { id : source code declaration }.<br />
		 * assert: is_controller(named_code 之元素) === true.<br />
		 * 
		 * cache 已经 include 了哪些 resource/JavaScript 档（存有其路径）/class(函式)。<br />
		 * 预防重复载入。
		 * 
		 * note:<br />
		 * named source code/module 定义: 具 id （预设不会重复载入）、行使特殊指定功能之 source。<br />
		 * module 特性: 可依名称自动判别 URL。 预设会搭入 library name-space 中。
		 * 
		 * @inner
		 * @ignore
		 * @type {Object}
		 */
		var named_code = Object.create(null),
		// modules_loaded 获得的是依相依性先后，不会有 require 的顺序。
		modules_loaded = new Set;

		/**
		 * @example <code>

		// Get all modules loaded
		Object.values(CeL.get_named_code()).map(declaration => declaration.id);
		</code>
		 */
		function get_named_code(id) {
			if (!id) {
				// TODO: return a duplicate.
				return named_code;
			}
			return named_code[id];
		}

		// const modules_loaded = CeL.get_modules_loaded();
		function get_modules_loaded() {
			return Array.from(modules_loaded);
		}

		// export.
		library_namespace.get_named_code = get_named_code;
		library_namespace.get_modules_loaded = get_modules_loaded;

		/**
		 * 在 module 中稍后求值，仅对 function 有效。<br />
		 * TODO: use get method. TODO: replace 变数.
		 */
		function load_later() {
			var name = String(this);
			if (library_namespace.is_debug()) {
				library_namespace.debug('load_later: 演算 [' + name + ']。', 5,
						'load_later');
				if (name !== this)
					library_namespace.warn('变数名与 "this" 不同！');
			}
			var method;
			try {
				method = library_namespace.value_of(name);
				if (!method || (typeof method !== 'function' &&
				// JScript 中，有些函式可能为object。
				typeof method !== 'object'))
					// 非函式，为常量？
					return method;
				return method.apply(
				// 处理 bind。
				library_namespace.value_of(name.replace(/\.[^.]+$/, '')),
						arguments);
			} catch (e) {
				library_namespace.error(e);
			}
			if (!method) {
				library_namespace.warn('load_later: 无法演算 [' + name + ']！');
				return method;
			}

			if (library_namespace.is_debug())
				library_namespace
						.warn('load_later: 可能是特殊 object，因无法 bind 而出错。尝试跳过 bind。');
			var length = arguments.length;
			try {
				if (length > 0)
					return method.apply(null, arguments);
			} catch (e) {
				if (library_namespace.is_debug())
					library_namespace.error(e);
			}

			if (library_namespace.is_debug())
				library_namespace
						.warn('load_later: 可能是特殊 object，因无法 apply 而出错。尝试跳过 apply。');
			try {
				switch (length) {
				case 0:
					return method();
				case 1:
					return method(arguments[0]);
				case 2:
					return method(arguments[0], arguments[1]);
				case 3:
					return method(arguments[0], arguments[1], arguments[2]);
				case 4:
					return method(arguments[0], arguments[1], arguments[2],
							arguments[3]);
				default:
					if (length > 5)
						library_namespace.warn('load_later: 共指派了 ' + length
								+ ' 个 arguments，过长。将仅取前 5 个。');
					return method(arguments[0], arguments[1], arguments[2],
							arguments[3], arguments[4]);
				}
			} catch (e) {
				library_namespace.error(e);
			}

			library_namespace.warn('load_later: 无法执行 [' + name
					+ ']！跳过执行动作，直接回传之。');
			return method;
		}

		/**
		 * Get named source code declaration.<br />
		 * 注意：亦包括 URL/path!!见 check_and_run_normalize()。<br />
		 * 对相同 id 会传回相同之 declaration。<br />
		 * 
		 * @param {String}name
		 *            source code (module) name/id, URL/path, variable name.
		 * @param {Object}[setup_declaration]
		 *            source code 之设定选项。
		 * 
		 * @return {Object} named source code declaration.
		 */
		function get_named(name, setup_declaration) {
			if (typeof name !== 'string' || !name)
				return name;

			// module declaration/controller.
			var declaration, id,
			// 看看是否为 named source code。
			is_module = library_namespace.match_module_name_pattern(name);

			// TODO:
			// 就算输入 module path 亦可自动判别出为 module，而非普通 resource。

			// 先尝试是否为变数/数值名。
			id = library_namespace.value_of(name);
			if (id !== undefined
					// 若存在此值，且并未载入过（载入过的皆应该有资料），才判别为变数/数值名。
					&& (!(declaration = library_namespace.to_module_name(name)) || !(declaration in named_code))) {
				library_namespace.is_debug('treat [' + name
						+ '] as variable name.', 2, 'get_named');
				return id;
			}

			// 再看看是否为 named source code。
			if (is_module) {
				// 正规化 name。登记 full module name。e.g., 'CeL.data.code'.
				id = declaration || library_namespace.to_module_name(name);
			} else if (!/^(?:[a-z\-]+:[\/\\]{2}|(?:[.]{2}[\/\\])+)?(?:[^.]+(?:\.[^.]+)*[\/\\])*[^.]+(?:\.[^.]+)*$/i
			// 最后看是否为 resource。
			.test(id = library_namespace.simplify_path(name))
					&& library_namespace.is_debug())
				library_namespace.warn('get_named: 输入可能有误的 URL/path: [' + id
						+ ']');

			if (!(declaration = named_code[id])) {
				if (!is_module
						|| !(declaration = named_code[library_namespace
								.get_module_path(id)])) {
					/**
					 * initialization. 为 declaration 所作的初始化工作。<br />
					 * 因为 URL 可能也具有 named code 功能，因此一视同仁都设定 full function。
					 */
					declaration = named_code[id] = {
						id : id,
						callback : new Set,
						error_handler : new Set,
						load_later : load_later,
						base : library_namespace,
						r : function require_variable(variable_name) {
							// require variable without eval()
							if (variable_name in declaration.variable_hash) {
								variable_name = declaration.variable_hash[variable_name];
							} else {
								library_namespace
										.warn('require_variable: unregistered variable ['
												+ variable_name
												+ '] @ module [' + id + '].');
							}
							return library_namespace.value_of(variable_name);
						}
					};

					/**
					 * note:<br />
					 * "use" 是 JScript.NET 的保留字。或可考虑 "requires"。<br />
					 * use -> using because of 'use' is a keyword of JScript.
					 */
					// declaration.use = use_function;
					if (is_module)
						// 判别 URL 并预先登记。但先不处理。
						named_code[library_namespace.get_module_path(id)] = declaration;
				}

				if (is_module) {
					library_namespace.debug('treat resource [' + name
							+ '] as module.', 5, 'get_named');
					// declaration.module = id;
					declaration.module_name = name;
					// 若是先 call URL，再 call module，这时需要补充登记。
					if (!(id in named_code))
						named_code[id] = declaration;
				} else {
					library_namespace.debug('treat resource [' + name
							+ '] as URL/path. 登记 [' + id + ']', 5, 'get_named');
					declaration.URL = id;
				}
			}
			if (false && declaration.module_name
					&& declaration.module_name !== declaration.id) {
				id = declaration.id = declaration.module_name;
			}

			if (library_namespace.is_Object(setup_declaration) &&
			// 已载入过则 pass。
			(!declaration.included || declaration.force)) {
				library_namespace.debug(
						'included' in declaration ? 'named source code [' + id
								+ '] 已经载入过，却仍然要求再度设定细项。' : '设定 [' + id
								+ '] 之 source code 等 options。', 2, 'get_named');

				var setup_callback = function(name) {
					var i = setup_declaration[name];
					// TODO: 这种判断法不好。
					if (i) {
						if (typeof i === 'function'
								&& typeof i.forEach !== 'function')
							i = [ i ];
						try {
							if (i && typeof i.forEach === 'function') {
								// 初始设定函式本身定义的 callback 应该先执行。
								// i = new Set(i);
								i = Set_from_Array(i);
								if (i.size > 0) {
									library_namespace.debug('[' + id
											+ '] 初始设定函式本身定义了 ' + i.size + ' 个 '
											+ name + '。', 2, 'get_named');
									declaration[name]
											.forEach(function(callback) {
												i.add(callback);
											});
									declaration[name] = i;
								}
							}
						} catch (e) {
							// TODO: handle exception
						}
					}
				};
				// 需要特别做处理的设定。
				setup_callback('callback');
				setup_callback('error_handler');
				// .finish 会直接设定，不经特别处理！
				if (typeof setup_declaration.extend_to === 'object'
						|| typeof setup_declaration.extend_to === 'function')
					declaration.extend_to = setup_declaration.extend_to;

				// 将 setup_declaration 所有 key of named_code_declaration 之属性 copy
				// / overwrite 到 declaration。
				library_namespace.set_method(declaration, setup_declaration,
						function(key) {
							return !(key in named_code_declaration);
						}, {
							configurable : true,
							writable : true
						});
			}

			return declaration;
		}

		// {String|Array}name
		function is_included_assertion(name, assertion) {
			if (assertion)
				throw typeof assertion === 'string' ? assertion : new Error(
						'Please include module [' + name + '] first!');
			return false;
		}
		/**
		 * 判断 module 是否已经成功载入。<br />
		 * 
		 * TODO<br />
		 * 以及检测是否破损。<br />
		 * prefix.
		 * 
		 * @param {String|Array}name
		 *            resource/module name || name list
		 * @param {Boolean|String}[assertion]
		 *            throw the assertion if NOT included.
		 * 
		 * @returns {Boolean} 所指定 module 是否已经全部成功载入。<br />
		 *          true: 已经成功载入。<br />
		 *          false: 载入失败。
		 * @returns undefined 尚未载入。
		 */
		function is_included(name, assertion) {
			if (Array.isArray(name)) {
				var i = 0, l = name.length, yet_included = [];
				for (; i < l; i++)
					if (!is_included(name[i]))
						yet_included.push(name[i]);
				if (yet_included.length > 0)
					return is_included_assertion(yet_included, assertion);
				return true;
			}

			if (is_controller(name) || is_controller(name = get_named(name)))
				return name.included;

			return is_included_assertion(name, assertion);
		}
		// export.
		library_namespace.is_included = is_included;

		/**
		 * 解析 dependency list，以获得所需之 URL/path/module/variable name。<br />
		 * 
		 * note: URL paths 请在 code 中载入。
		 * 
		 * @param {controller}declaration
		 * 
		 * @returns {Array|Object} dependency sequence
		 * @returns {controller}declaration
		 */
		function parse_require(declaration) {
			/** {Array|String}dependency list */
			var code_required = typeof declaration.require === 'function'
			// WARNING: {Function}declaration.require必须能独立执行，不能有其他依赖。
			// 并且在单次执行中，重复call时必须回传相同的结果。
			// 一般来说，应该是为了依照执行环境includes相同API之不同实作时使用。
			// e.g.,
			// .write_file()在不同platform有不同实作方法，但对caller应该只需要includes同一library。
			? declaration.require(library_namespace) : declaration.require;

			if (false) {
				// TODO: 自 declaration.code 撷取出 requires。
				var matched, pattern = /=\s*this\s*\.\s*r\s*\(\s*["']\s*([^()"']+)\s*["']\s*\)/g;
				while (matched = pattern.exec(declaration.code)) {
					code_required.push(matched[1]);
				}
			}

			if (code_required) {
				library_namespace.debug('解析 [' + declaration.id
				//
				+ '] 之 dependency list，以获得所需之 URL/path/module/variable name: ['
						+ code_required + ']。', 5, 'parse_require');

				if (typeof code_required === 'string')
					code_required = code_required.split('|');

				if (Array.isArray(code_required)) {
					// 挑出所有需要的 resources，
					// 把需要的 variable 填入 variable_hash 中，
					// 并去除重复。
					var require_resources = Object.create(null),
					// required variables.
					// variable_hash = {
					// variable name : variable full name
					// }.
					variable_hash = declaration.variable_hash = Object
							.create(null);

					code_required.forEach(function(variable) {
						// [ variable full name, module name, variable name ]
						var matched = variable.match(/^(.+)\.([^.]*)$/);
						if (matched && library_namespace
						//
						.match_module_name_pattern(matched[1])) {
							// module/variable name?
							// 类似 'data.split_String_to_Object' 的形式，为 function。
							// 类似 'data.' 的形式，为 module。
							if (matched[2])
								variable_hash[matched[2]]
								//
								= library_namespace.to_module_name(
								//
								matched[1], '.') + '.' + matched[2];
							require_resources[matched[1]] = null;
						} else {
							// URL/path?
							require_resources[variable] = null;
						}
					});

					// cache. 作个纪录。
					declaration.require_resources = code_required = [];
					for ( var i in require_resources)
						code_required.push(i);

					// 处理完把待处理清单消掉。
					delete declaration.require;

				} else {
					// TODO: 此处实尚未规范，应不可能执行到。
					library_namespace.warn('parse_require: 无法解析 ['
							+ declaration.id + '] 之 dependency：['
							+ declaration.require + ']！');
				}
			}

			if (code_required && code_required.length > 0) {
				var require_now = [];
				code_required.forEach(function(item) {
					var declaration = get_named(item);
					// 确定是否还没载入，必须 load。还没载入则放在 require_now 中。
					if (is_controller(declaration)
							&& !('included' in declaration))
						require_now.push(item);
				});

				if (Array.isArray(require_now) && require_now.length > 0) {
					library_namespace.debug('检查并确认 required module/URL，尚须处理 '
							+ require_now.length + ' 项: ['
							+ require_now.join('<b style="color:#47e;">|</b>')
							+ ']。', 5, 'parse_require');
					// 临时/后续/后来新增
					return [
							SEQUENTIAL,
							require_now.length === 1 ? require_now[0]
									: require_now, declaration ];
				}
			}

			return declaration;
		}

		// ---------------------------------------------------------------------//
		// file loading 之处理。

		// cache
		var document_head, tag_of_type = Object.create(null), URL_of_tag = Object
				.create(null), TO_FINISH = Object.create(null),
		// 需要修补 load events on linking elements?
		no_sheet_onload = library_namespace.is_WWW(true) && navigator.userAgent,
		// external resources tester.
		external_RegExp = library_namespace.env.module_name_separator,
		// Node.js 有比较特殊的 global scope 处理方法。
		is_nodejs = library_namespace.platform.nodejs,
		// tag_map[tag name]=[URL attribute name, type/extension list];
		tag_map = {
			script : [ 'src', 'js' ],
			link : [ 'href', 'css' ],
			img : [ 'src', 'png|jpg|gif' ]
		};
		external_RegExp = new RegExp('(?:^|\\' + external_RegExp + ')'
				+ library_namespace.env.resources_directory_name + '\\'
				+ external_RegExp + '|^(?:' + library_namespace.Class + '\\'
				+ external_RegExp + ')?'
				+ library_namespace.env.external_directory_name + '\\'
				+ external_RegExp);

		if (no_sheet_onload)
			(function() {
				// Safari css link.onload problem:
				// Gecko and WebKit don't support the onload
				// event on link nodes.
				// http://www.zachleat.com/web/load-css-dynamically/
				// http://www.phpied.com/when-is-a-stylesheet-really-loaded/
				// http://stackoverflow.com/questions/2635814/javascript-capturing-load-event-on-link
				no_sheet_onload = no_sheet_onload.toLowerCase();

				// move from 'interact.DOM'.
				var is_Safari = no_sheet_onload.indexOf('safari') !== NOT_FOUND
						&& no_sheet_onload.indexOf('chrome') === NOT_FOUND
						&& no_sheet_onload.indexOf('chromium') === NOT_FOUND,
				//
				is_old_Firefox = no_sheet_onload.match(/ Firefox\/(\d+)/i);
				if (is_old_Firefox)
					is_old_Firefox = (is_old_Firefox[1] | 0) < 9;

				no_sheet_onload = is_Safari || is_old_Firefox;
				library_namespace.debug(
						'看似需要修补 load events on linking elements.', 5);
			})();

		// TODO: watchdog for link.onload
		// function link_watchdog() {}

		function all_requires_loaded(declaration) {
			var require_resources = declaration.require_resources;
			return !Array.isArray(require_resources)
			//
			|| require_resources.every(function(module_name) {
				var item = get_named(module_name);
				return item && item.included;
			});
		}

		/**
		 * 载入 named source code（具名程式码: module/URL）。<br />
		 * Include / requires specified module.<br />
		 * 
		 * <p>
		 * 会先尝试使用 .get_file()，以 XMLHttpRequest
		 * 同时依序(synchronously,会挂住,直至收到回应才回传)的方式依序取得、载入 module。<br />
		 * 
		 * 若因为浏览器安全策略(browser 安全性设定, e.g., same origin policy)等问题，无法以
		 * XMLHttpRequest 取得、循序载入时，则会以异序(asynchronously,不同时)的方式并行载入 module。<br />
		 * 因为 module 尚未载入，在此阶段尚无法判别此 module 所需之 dependency list。
		 * </p>
		 * 
		 * TODO:<br />
		 * unload module.<br />
		 * test: 若两函数同时 require 相同 path，可能造成其中一个通过，一个未载入?<br />
		 * for <a href="http://en.wikipedia.org/wiki/JSONP"
		 * accessdate="2012/9/14 23:50">JSONP</a>
		 * 
		 * @param {String|Object}item
		 *            source code (module/URL/path) name/id.
		 * @param {Object}[options]
		 *            load options.
		 * @param {Function}[caller]
		 *            当以异序(asynchronously,不同时)的方式并行载入 module 时，将排入此 caller
		 *            作为回调/回拨函式。
		 * 
		 * @returns {Number} status.<br />
		 *          PROCESSED: done.<br />
		 *          INCLUDE_FAILED: error occurred. fault.<br />
		 *          INCLUDING: loading asynchronously,
		 *          以异序(asynchronously,不同时)的方式并行载入(in parallel with)。<br />
		 */
		function load_named(item, options, caller) {
			var id = typeof item === 'string' ? item : is_controller(item)
					&& item.id,
			//
			force = is_controller(item) && item.force,
			//
			declaration = id && named_code[id];
			if (!id || !is_controller(declaration)) {
				// 内部 bug？
				library_namespace.error('load_named: 没有 [' + id + '] 的资料！');
				return PROCESSED;
			}

			// id 正规化(normalization)处理。
			id = declaration.id;
			// 预先定义/正规化，避免麻烦。
			if (!library_namespace.is_Object(options))
				options = Object.create(null);

			/**
			 * need waiting callback / handler: .finish() 回传此值会使其中的 .run() 执行到了
			 * waiting 之后才继续载入其他组件。
			 */
			function waiting() {
				return load_named(item, {
					finish_only : TO_FINISH
				}, caller);
			}

			function run_callback(name) {
				var callback = declaration[name], args, need_waiting = [];
				if (callback) {
					// 因为不能保证 callback 之型态，可能在 module 中被窜改过，
					// 因此需要预先处理。
					if (typeof callback === 'function'
							&& typeof callback.forEach !== 'function')
						callback = [ callback ];
					if (Array.isArray(callback)) {
						// callback = new Set(callback);
						callback = Set_from_Array(callback);
						declaration[name] = new Set;
					}

					// TODO: assert: callback 为 Set。
					if (callback.size > 0
					// && typeof callback.forEach === 'function'
					) {
						// 获利了结，出清。
						library_namespace.debug('继续完成 ' + callback.size
								+ ' 个所有原先 ' + name
								+ ' queue 中之执行绪，或是 named source code 所添加之函数。',
								5, 'load_named.run_callback');

						// 作 cache。
						// 需预防 arguments 可被更改的情况！
						args = Array.prototype.slice.call(arguments, 1);

						callback.forEach(library_namespace.env.no_catch
						//
						? function(callback) {
							if (typeof callback === 'function'
									&& callback.apply(declaration, args)
									//
									=== waiting)
								// callback 需要 waiting。
								need_waiting.push(callback);
						} : function(callback) {
							try {
								// 已经过鉴别。这边的除了 named source code
								// 所添加之函数外，
								// 应该都是 {Function}
								// check_and_run.run。
								// TODO: using setTimeout?
								library_namespace.debug('run ' + name + ' of ['
										+ id + ']: [' + callback + ']', 5,
										'load_named.run_callback');
								if (typeof callback === 'function'
										&& callback.apply(declaration, args)
										//
										=== waiting)
									// callback 需要 waiting。
									need_waiting.push(callback);
							} catch (e) {
								library_namespace.error('执行 [' + id + '] 之 '
										+ name + ' 时发生错误！ ' + e.message);
								library_namespace.debug('<code>'
										+ ('' + callback).replace(/</g, '&lt;')
												.replace(/\n/g, '<br />')
										+ '</code>', 1,
										'load_named.run_callback');
							}
						});

						callback.clear();
					}
				}

				// Release memory. 释放被占用的记忆体. 早点 delete 以释放记忆体空间/资源。
				// assert: declaration.error_handler 为 Set。
				if (declaration.error_handler) {
					// @ work.hta
					// 有可能已经载入，因此 `delete declaration.error_handler;` 了。
					declaration.error_handler.clear();
				}

				if (need_waiting.length > 0) {
					need_waiting.forEach(function(cb) {
						callback.add(cb);
					});
					return true;
				}
			}

			if ('finish_only' in options)
				options.finish_only = options.finish_only === TO_FINISH;

			// 存在 .included 表示已经处理过（无论成功失败）。
			// URL 已嵌入/含入/挂上/module registered/函数已执行。
			if (force || !('included' in declaration)) {
				if (!options.finish_only && declaration.is_waiting_now
				// 在网页环境插入 <script> 时，可能因相依的模组尚未载入，先行跳出，但此时已具有
				// declaration.code。在所依赖的模组载入前，若另一个线程载入本模组，因为已有
				// declaration.code，若不检查则可能直接就开始执行，造成依赖的函式不存在。
				//
				// e.g., CeL.application.net.wiki.namespace 需要
				// CeL.application.net，会先载入 CeL.application.net，并等待
				// CeL.application.net 依赖的模组载入。
				// 但 CeL.application.net.wiki 以 .finish + CeL.run() 载入
				// CeL.application.net.wiki.namespace ，此 CeL.run() 线程中
				// CeL.application.net.wiki.namespace 独立，且已有
				// declaration.code，但实际上 CeL.application.net 尚未载入。
				&& !all_requires_loaded(declaration)) {
					if (caller)
						declaration.callback.add(caller);

					// 因无法即时载入，先行退出。
					return INCLUDING;

				} else if (declaration.code) {
					// ---------------------------------------
					// including code.
					// TODO: 拆开。

					library_namespace.debug(
							'准备嵌入 (include) [<b style="color:#F2a;background-color:#EF0;">'
									+ id + '</b>]。执行 module 初始设定函式。', 2,
							'load_named');
					modules_loaded.add(id);

					var initializer, error_Object;
					if (library_namespace.env.no_catch) {
						// {Function}declaration.code:
						// function module_code(library_namespace) {}
						initializer = declaration.code(library_namespace);
					} else {
						try {
							// 真正执行 module 初始设定函式 / class template。
							// 因为 module 常会用到 library，因此将之当作 argument。
							initializer = declaration.code(library_namespace);
						} catch (e) {
							error_Object = e;
							library_namespace.error('load_named: [' + id
									+ '] 之初始设定函式执行失败！');
							library_namespace.error(e);
						}
					}

					if (Array.isArray(initializer)) {
						library_namespace.debug('初始设定函式回传 Array，先转成 Object。',
								1, 'load_named');
						var list = initializer;
						initializer = Object.create(null);
						list.forEach(function(method) {
							var name = typeof method === 'function'
									&& library_namespace
											.get_function_name(method);
							if (name) {
								library_namespace.debug('设定 method：[' + name
										+ ']。', 2, 'load_named');
								initializer[name] = method;
							} else {
								library_namespace
										.warn('load_named: 非函式之初始设定值：['
												+ method + ']！');
							}
						});
					}

					if (typeof initializer === 'function'
							|| library_namespace.is_Object(initializer)) {

						library_namespace.debug('预先一层一层定义、准备好 [' + id
								+ '] 之上层 name-space。', 2, 'load_named');
						var module_name_list = library_namespace
								.split_module_name(id),
						//
						i = 0, l = module_name_list.length - 1, name_space = library_namespace, name, sub_name_space;
						for (; i < l; i++) {
							sub_name_space = name_space[name = module_name_list[i]];
							if (!sub_name_space) {
								sub_name_space = name_space[name] = {
									null_constructor_name : library_namespace
											.to_module_name(module_name_list
													.slice(0, i + 1))
								};
								library_namespace.debug('创建 name-space ['
										+ sub_name_space.null_constructor_name
										+ ']', 2, 'load_named');
							}
							name_space = sub_name_space;
						}
						// assert: name_space 这时是 module 的 parent module。
						name = module_name_list[l];
						if (name_space[name]) {
							if (name_space[name].null_constructor_name) {
								library_namespace.debug(
										'可能因下层 module 先被载入，已预先定义过 [' + id
												+ ']。将把原先的 member 搬过来。', 2,
										'load_named');

								delete name_space[name].null_constructor_name;
								// ** WARNING:
								// 这边可能出现覆写基底 method 之情形！
								// e.g., application.debug.log @
								// application.debug

								// ** WARNING:
								// 须注意是否因 name_space 为 function，预设会当作 function
								// 处理，而出问题！
								Object.assign(initializer, name_space[name]);
							} else {
								library_namespace.warn(
								//
								'load_named: 已存在 name-space [' + id + ']！');
							}
						} else {
							// 尚未被定义或宣告过。
						}

						// TODO: alias

						library_namespace.debug('[' + id
								+ '] 顺利执行到最后，准备作 hook 设定。', 3, 'load_named');
						name_space[name] = initializer;

						// 载入 module 时执行 extend 工作。
						var no_extend,
						/**
						 * 扩充标的基底。extend to what name-space。<br />
						 * Extend to specified name-space that you can use
						 * [name_space]._func_ to run it.
						 */
						extend_to = 'extend_to' in declaration
						//
						? declaration.extend_to
						/**
						 * 预设会 extend 到 library 本身之下。<br />
						 * extend to root of this library.<br />
						 * 
						 * e.g., call CeL._function_name_ and we can get the
						 * specified function.
						 */
						: library_namespace;

						if (extend_to) {
							library_namespace.debug(
							//
							'设定完 name space。执行扩充 member 的工作。'
							//
							+ (extend_to === library_namespace
							//
							? '将 extend 到 library 本身之下。' : ''),
							//
							2, 'load_named');

							// 可以 no_extend 设定不汇出的子函式。
							// 所有无特殊名称的 sub-module 皆应设定 `no_extend : 'this,*'`，
							// 避免本身被 extend 到 library namespace 下，污染如 CeL.data。
							// e.g., application.net.wiki.* ,
							// application.net.work_crawler.*
							if (no_extend = declaration[library_namespace.env.not_to_extend_keyword]) {
								if (typeof no_extend === 'string')
									no_extend = no_extend.split(',');
								if (Array.isArray(no_extend)) {
									l = Object.create(null);
									no_extend.forEach(function(i) {
										l[i] = 1;
									});
									no_extend = l;
								}
							}

							if (!library_namespace.is_Object(no_extend))
								no_extend = Object.create(null);

							// 去掉 function 预设可列举的成员。
							// Firefox/3.0.19 中，.prototype 亦可列举。
							// TODO: how to cache.
							(l = function() {
							}).prototype = Object.create(null);
							for (i in l)
								no_extend[i] = 1;

							if (!('this' in no_extend)) {
								library_namespace.debug('扩充 module 本身到标的基底下。',
										2, 'load_named');
								l = extend_to[name];
								// 只处理双方皆为 Object 的情况。
								if (typeof l === 'object'
										&& typeof initializer === 'object') {
									library_namespace.debug('标的基底 [' + l.Class
											+ '] 已有 [' + name + ']，将合并/搬移成员。',
											1, 'load_named');
									// 若没有重新架构，之后的搬移动作可能污染原先之 name-space!
									if (!('reconstructed' in l))
										extend_to[name] = l = Object.assign({
											reconstructed : true
										}, l);
									for (i in initializer) {
										if (i in l)
											library_namespace.debug(
											//
											'标的基底 [' + name + '] 已有 [' + i
													+ ']，将取代之。', 1,
													'load_named');
										l[i] = initializer[i];
									}

								} else {
									if (l && l.Class
											&& library_namespace.is_debug())
										library_namespace.warn(
										// 标的基底已有 (l)，将直接以新的 module (id) 取代之。
										'load_named: 将以 ('
										// 未来 extend_to[name] 将代表 (id).
										+ (typeof initializer) + ') [' + id
												+ '] 取代扩充标的基底之同名 module ('
												+ (typeof l) + ') ['
												+ (l.Class || name) + ']。');
									extend_to[name] = initializer;
								}
							}

							if (!('*' in no_extend))
								for (i in initializer) {
									if ((i in no_extend)
											|| extend_to[i] === initializer[i])
										continue;

									if ((i in extend_to)
											&& library_namespace.is_debug())
										library_namespace.warn(
										//
										'load_named: 将以 [' + id + '.' + i
										//
										+ '] 取代扩充标的基底之同名 property'
										//
										+ (library_namespace.is_debug(2) ? ' ['
										//
										+ extend_to[i] + ']' : '') + '。');

									extend_to[i] = initializer[i];
								}
						} else
							library_namespace.debug('跳过扩充 member 之工作。', 5,
									'load_named');

						// 对 name-space 做有必要的操作。
						/**
						 * @see <a
						 *      href="http://developer.51cto.com/art/200907/134913.htm"
						 *      accessdate="2012/12/11 20:51"
						 *      title="JavaScript类和继承：constructor属性 -
						 *      51CTO.COM">JavaScript类和继承：constructor属性</a>
						 */
						if (typeof initializer === 'function') {
							if (!initializer.prototype.constructor)
								initializer.prototype.constructor = initializer;
						}
						if (!initializer.Class)
							initializer.Class = id;

						if (false)
							initializer.toString = function() {
								return '[class ' + name + ']';
							};

						// 设定登记 module 已载入。
						// TODO:
						// 若某 module 很快就 loaded，则剩下的应当亦可很快 loaded。
						// 除非是其他 domain 的。
						declaration.included = true;

					} else if (initializer === library_namespace.env.not_to_extend_keyword) {
						// assert: module 本身已经做好相关设定。目的仅在执行 module_code。
						// e.g., CeL.application.net.wiki.admin
						library_namespace
								.debug(
										{
											T : [
													'不设定(hook) module [%1] 之 namespace，仅执行 module code。',
													id ]
										}, 1, 'load_named');
						// 设定登记 module 已载入。
						declaration.included = true;

					} else {
						if (!error_Object)
							library_namespace.error(error_Object = new Error(
									'load_named: [' + id
											+ '] 之初始设定函式执行成功，但回传无法处理之值：['
											+ initializer + ']！'));
						declaration.included = false;
						// error callback 仅在每次真正尝试过后才执行。
						run_callback('error_handler', error_Object);
						if (!item.skip_error)
							return INCLUDE_FAILED;
					}

				} else {

					var file_contents,
					// URL is `skip_loading_modules` here.
					// 只是为了省下一个变数而重复利用。
					URL = library_namespace.get_old_namespace();
					URL = URL && URL.skip_loading_modules;
					if (Array.isArray(URL) && (URL.includes(id)
					// id 为相对路径。
					|| id.slice(0, library_base_path.length)
					// e.g., https://github.com/kanasimi/CeJS_wiki
					=== library_base_path
					//
					&& URL.includes(id.slice(library_base_path.length)))) {
						library_namespace.debug('Skip loading module/path: '
								+ id);
						return PROCESSED;
					}

					// ---------------------------------------
					// loading code.
					// TODO: 拆开。

					URL = declaration.URL
							|| library_namespace.get_module_path(id);
					// external_directory_name 下可以放置外部 library/resource files.
					var is_external = function(failed) {
						var external = external_RegExp.test(id);
						if (external) {
							declaration.included = !failed;
							library_namespace.debug(
							//
							'由于引用的是 library 外部档案，自动将之设定为 included '
									+ (declaration.included ? '成功' : '失败')
									+ '。', 5, 'load_named.is_external');
						}
						return external;
					};

					library_namespace.debug(
					//
					'准备载入 (load) [<a style="color:#ef0;background-color:#018;" href="'
							+ encodeURI(URL) + '">' + id + '</a>]。', 5,
							'load_named');

					// ---------------------------------------
					// loading code: 采用循序/依序执行的方法。

					if (!library_namespace.env.same_origin_policy
							&& !library_namespace.env.no_eval
							&& /\.js$/i.test(URL))
						try {
							// 对 .js 先试试 .get_file()。
							file_contents = library_namespace.get_file(URL);
							if (library_namespace.is_debug(2)
									&& library_namespace.is_WWW())
								if (typeof file_contents === 'string')
									library_namespace.debug('取得档案内容: ('
									//
									+ file_contents.length + ' bytes) ['
									//
									+ file_contents.slice(0, 200)
									//
									.replace(/ /g, '&nbsp;')
									//
									.replace(/\n/g, '<br />') + ']'
									//
									+ (file_contents.length > 200 ? '...'
									//
									: ''), 5, 'load_named');
							if (file_contents) {
								// 对 cscript/wscript，若 /^var variable =
								// /.test(file_contents)，会造成 global 无法设定此
								// variable。
								if (library_namespace.script_host
										//
										&& typeof library_namespace.pre_parse_local_code === 'function')
									file_contents = library_namespace
											.pre_parse_local_code(
													file_contents, URL, id);

								if (is_nodejs) {
									if (typeof require === 'function') {
										// console.trace(URL);
										declaration.result = require(
										// Using require() in node.js
										library_namespace.platform.Windows
												&& /^\/[a-z]:\//i.test(URL)
										// @see CeL..get_file() @ module.js
										? URL.slice(1) : URL);
									} else {
										// Node.js 有比较特殊的 global scope 处理方法。
										eval(file_contents);
									}
								} else {
									// eval @ global. 这边可能会出现 security 问题。
									// TODO: do not use eval. 以其他方法取代 eval 的使用。
									library_namespace.eval_code(file_contents);
								}
								// Release memory. 释放被占用的记忆体.
								file_contents = !!file_contents;
								if (!declaration.module_name)
									declaration.included = true;

							} else {
								declaration.included = false;
								library_namespace.warn('Get no result from ['
										+ id + ']! Some error occurred?');
							}

							// 以 .get_file() 成功依序载入结束。
							// console.trace(URL);
							declaration.URL = URL;

							if (!('included' in declaration) && !is_external())
								library_namespace.warn(
								//
								'load_named: 虽已处理完 [<a href="'
								//
								+ encodeURI(URL) + '">' + id + '</a>] ，'
								//
								+ '但程式码并未使用所规范的方法来载入，导致 included flag 未被设定！');

							if (declaration.included) {
								library_namespace.debug(
								//
								'已 include [<a href="' + encodeURI(URL) + '">'
										+ id + '</a>]。', 5, 'load_named');
								return PROCESSED;
							}

							// Date.now();
							declaration.last_call = new Date();

							// error callback 仅在每次真正尝试过后才执行。
							run_callback('error_handler');
							if (!item.skip_error)
								return INCLUDE_FAILED;

						} catch (e) {

							// 若为 local，可能是因为浏览器安全策略被挡掉了。
							if (!library_namespace.is_local()
									|| library_namespace.is_debug(2)) {
								// http://www.w3.org/TR/DOM-Level-2-Core/ecma-script-binding.html
								// http://reference.sitepoint.com/javascript/DOMException
								if (library_namespace
										.is_type(e, 'DOMException')
										&& e.code === 1012) {
									library_namespace.error(
									//
									'load_named:\n' + e.message + '\n'
									//
									+ URL + '\n\n程式可能呼叫了一个'
									//
									+ (library_namespace.is_local()
									//
									? '不存在的，\n或是绕经上层目录' : 'cross domain')
									//
									+ '的档案？\n\n请尝试使用相对路径，\n或 call .run()。');
								} else if (
								// 系统找不到指定的资源/存取被拒。
								library_namespace.is_type(e, 'Error')
										&& (e.number & 0xFFFF) === 5
										|| library_namespace.is_type(e,
												'XPCWrappedNative_NoHelper')
										&& ('' + e.message)
												.indexOf('NS_ERROR_FILE_NOT_FOUND') !== NOT_FOUND) {
									if (library_namespace.is_debug())
										library_namespace.error(
										//
										'load_named: 档案可能不存在或存取被拒？\n['
										//
										+ URL + ']' + (
										//
										library_namespace.get_error_message
										//
										? ('<br />' + library_namespace
										//
										.get_error_message(e))
										//
										: '\n' + e.message));
								} else if (library_namespace.is_debug())
									library_namespace.error(
									//
									'load_named: Cannot load [<a href="'
									//
									+ encodeURI(URL) + '">' + id + '</a>]!' + (
									//
									library_namespace.get_error_message
									//
									? ('<br />' +
									//
									library_namespace.get_error_message(e)
									//
									+ '<br />') : '\n[' + (e.constructor)
									//
									+ '] '
									//
									+ (e.number ? (e.number & 0xFFFF) : e.code)
									//
									+ ': ' + e.message + '\n')
									// 对于encode之类问题，reload不能解决。
									+ (e.type === 'encode'
									//
									? '往后将改采用插入 HTML tag 的替代方式载入。'
									//
									: '抱歉！在载入其他网页时发生错误，有些功能可能失常。\n'
									//
									+ '重新读取(reload)，或是过段时间再尝试或许可以解决问题。'));
							}

							// 不能直接用
							// .get_file()，得采用异序(asynchronously,不同时)的方式并行载入。
							library_namespace.debug('Cannot load [' + id
							//
							+ ']! 以 .get_file() 依序载入的方法失败：' + e.message
									+ (id === URL ? '' : ' (' + URL + ')'), 2,
									'load_named');
							if (is_nodejs
									&& (e instanceof SyntaxError || library_namespace
											.is_debug())) {
								console.error(e);
							}

							// 除非为 eval 错误，否则不设定 .included。
							if (!library_namespace.env.same_origin_policy) {
								// 执行 code 时出问题。
								declaration.included = false;
								// error callback 仅在每次真正尝试过后才执行。
								run_callback('error_handler', e);
								if (!item.skip_error)
									return INCLUDE_FAILED;
							}
						}

					// ---------------------------------------
					// loading code:
					// 循序/依序执行的方法失败，采用异序(asynchronously,不同时)的方式并行载入。

					// 若之前已尝试取得过 code，则即使失败也不再使用异序(asynchronously,不同时)的方式并行载入。
					if (!file_contents)
						if (library_namespace.is_WWW()) {
							// 动态载入 / Dynamic Loading / Including other
							// JavaScript/CSS
							// files asynchronously.
							// TODO: http://headjs.com/#theory
							// http://code.google.com/apis/ajax/documentation/#Dynamic
							// http://en.wikipedia.org/wiki/Futures_and_promises

							var type = declaration.type, use_write = item.use_write, node, timeout_id = 'L',
							//
							clean = function(failed) {
								if (timeout_id !== 'L')
									clearTimeout(timeout_id);
								timeout_id = 0;
								onload = null;

								if (type === 'js')
									// callback 完自动移除 .js。
									// 随即移除会无效。
									// 移除 .css 会失效。
									setTimeout(function() {
										document_head.removeChild(node);
										node = null;
									}, 0);

								if (node) {
									try {
										delete node.onload;
									} catch (e) {
										// error on IE5–9: Error: "Object
										// doesn't support this action".
										node.onload = null;
									}
									try {
										delete node.onreadystatechange;
									} catch (e) {
										// error on IE5–9: Error: "Object
										// doesn't support this action".
										node.onreadystatechange = null;
									}
								}

								// 有可能本次载入失败，但之前已成功过；
								// 这情况下不设定 declaration.included。
								if (!declaration.included) {
									if (!declaration.module_name) {
										// 为 URL/path，只要载入就算成功。
										declaration.included = !failed;
									} else if (!is_external(failed)) {
										if (failed) {
											// 载入却没设定 included，算失败。
											declaration.included = false;
										} else if (!declaration.variable_hash) {
											library_namespace.warn(
											//
											'load_named: [<a href="'
											//
											+ encodeURI(URL) + '">' + id
											//
											+ '</a>] 的程式码似乎并未使用所规范的方法来载入？');
											// IE 8 中，当测试不存在的档案时，
											// 会藉 .readyState ===
											// 'complete'，执行到这边。
											// 因此除了借由载入时间，无法分辨档案到底存不存在。
											declaration.included = UNKNOWN;
										} else {
											declaration.is_waiting_now = true;
											if (library_namespace.is_debug(2)) {
												library_namespace
														.warn('load_named: 未能直接载入 (load) ['
																+ id
																+ ']！可能因为 code 还有其他未能掌控，且尚未载入的相依性。');
											}
										}
									}

									if (('included' in declaration)
											&& !declaration.included) {
										// error callback 仅在每次真正尝试过后才执行。
										// 预防还有没处理的 error callback。
										run_callback('error_handler');
									}
								}

								if ((declaration.included || item.skip_error)
								// 若无 callback 就少耗点资源，别再 call load_named() 了。
								&& declaration.callback
										&& declaration.callback.size > 0)
									// module 若设定了 included 时，
									// 回调/回拨函式应该由 named source code 本身收拾。
									// 这边不做处理。
									//
									// 这边呼叫 load_named() 主要是为了利用 load_named()
									// 最后收尾程序的部分。
									load_named(item, options, caller);
							},
							//
							onload = function(e) {
								var r;
								// navigator.platform === 'PLAYSTATION 3' 时仅用
								// 'complete'? from requireJS
								if (timeout_id
										&& (!(r =
										// 'readyState' in this ?
										// this.readyState : e.type !== 'load'
										this.readyState) || r === 'loaded' || r === 'complete'))
									clean();
							};

							try {
								if (type) {
									if (typeof type === 'string')
										type = type.toLocaleLowerCase();
								} else if (type = URL.match(/[^.\\\/]+$/))
									type = type[0].toLocaleLowerCase();

								if (!(node = tag_of_type[type])) {
									library_namespace.warn('无法判别 [' + id
											+ '] 之类型!');
									throw 1;
								}

								if (use_write || type !== 'js'
										&& type !== 'css')
									throw 0;

								// HTML5: document.head ===
								// document.getElementsByTagName('head')[0]
								if (document_head === undefined) {
									if (!(document_head = document.head
											|| document
													.getElementsByTagName('head')[0]))
										(document.body.parentNode || document.body)
												.appendChild(document_head = document
														.createElement('head'));
									if (!document_head)
										document_head = null;
								}
								if (!document_head) {
									library_namespace
											.warn('无法判别 tag &gt;head>!');
									throw 2;
								}

								// TODO: use document.createElementNS()
								// TODO:某些旧版 Firefox 使用 createElement('script')
								// 不被接受，因此可能需要用写的。
								node = document.createElement(node);
								node.width = node.height = 0;

								// http://www.developer.nokia.com/Community/Wiki/JavaScript_Performance_Best_Practices
								// ** onload 在 local 好像无效?
								// TODO:
								// http://www.xdarui.com/articles/66.shtml
								// 使用 attachEvent 注册事件，然后用
								// detachEvent。在ie6上就算把onreadystatechange重置为null了，但只是把引用给断开了，而回调还存在内存之中，只是无法访问了而已，有可能造成内存的溢出。
								node.onload = node.onreadystatechange = onload;

								switch (type) {
								case 'js':
									node.type = 'text/javascript';
									/**
									 * TODO:<br />
									 * see jquery-1.4a2.js: globalEval<br />
									 * if (is_code) s.text = path;<br />
									 * 
									 * http://www.lampblog.net/2010/12/html5%E4%B8%ADscript%E7%9A%84async%E5%B1%9E%E6%80%A7%E5%BC%82%E6%AD%A5%E5%8A%A0%E8%BD%BDjs/<br />
									 * 如果 async 属性为
									 * true，则脚本会相对于文档的其余部分异步执行，这样脚本会可以在页面继续解析的过程中来执行。<br />
									 * 如果 async 属性为 false，而 defer 属性为
									 * true，则脚本会在页面完成解析时得到执行。<br />
									 * 如果 async 和 defer 属性均为
									 * false，那么脚本会立即执行，页面会在脚本执行完毕继续解析。<br />
									 * 
									 * http://www.cnblogs.com/darrel/archive/2011/08/02/2124783.html<br />
									 * 当script的 async 属性被置为 true
									 * 时，脚本的执行序为异步的。即不按照挂载到 Dom 的序顺执行 ，相反如果是
									 * false 则按挂载的顺序执行。<br />
									 */
									node.async = true;
									// node.setAttribute('src', URL);
									node.src = URL;
									// timeout for giving up.
									if (options.timeout > 0)
										timeout_id = setTimeout(function() {
											// 失败！
											if (!options.skip_error
													|| library_namespace
															.is_debug())
												library_namespace.warn([
												//
												'load_named: ', {
													// gettext_config:{"id":"load-failed"}
													T : 'Load failed'
												}, ' (', {
													T : 'timeout'
												}, ' ' + options.timeout
												//
												+ ' ms): [' + id + ']' ]);
											clean(true);
										}, options.timeout);
									break;

								case 'css':
									node.type = 'text/css';
									// .css 移除会失效。
									// CSS 不设定 timeout。
									// node.media = 'all',//'print'
									node.rel = 'stylesheet';
									// https://developer.mozilla.org/en-US/docs/HTML/Element/link#Stylesheet_load_events
									node.onerror = onload;
									node.href = URL;
									break;

								default:
								}

								library_namespace.debug('插入 .' + type + ' ['
										+ URL + ']', 2, 'load_named');

								// 在 IE 10 中，当 .appendChild() 时，
								// 会先中断，执行所插入 node 的内容。
								// 因此必须确保在 .appendChild() 前，便已设定好 callback！
								if (caller)
									declaration.callback.add(caller);

								/**
								 * from jquery-1.4a2.js:<br />
								 * Use insertBefore instead of appendChild to
								 * circumvent an IE6 bug when using globalEval
								 * and a base node is found.<br />
								 * This arises when a base node is used (#2709).<br />
								 * 
								 * 不过这会有问题: 后加的 CSS file 优先权会比较高。因此，可以的话还是用
								 * appendChild。
								 * 
								 * @see http://github.com/jquery/jquery/commit/d44c5025c42645a6e2b6e664b689669c3752b236<br />
								 */
								if (false)
									document_head.insertBefore(node,
											document_head.firstChild);
								if (false)
									document_head.parentNode.insertBefore(node,
											document_head);
								document_head.appendChild(node);

								// TODO: This is a ugly hack/workaround.
								if (no_sheet_onload && type === 'css') {
									var test_img = document
											.createElement('img');
									test_img.onerror = function() {
										onload && onload.call(this);
										test_img = null;
									};
									test_img.src = URL;
								}

								declaration.last_call = new Date();

								library_namespace.debug('[' + declaration.id
										+ ']: need asynchronous. 登记完后直接休眠。', 5,
										'load_named');

								// 因无法即时载入，先行退出。
								return INCLUDING;

							} catch (e) {
								if (typeof e !== 'number') {
									declaration.callback['delete'](caller);
									library_namespace.error(e);
								}
								use_write = true;
							}

							if (use_write
							// && TODO: 正在 load 页面
							) {
								if (library_namespace.is_debug(2)
										&& library_namespace.is_WWW())
									library_namespace
											.debug('直接写入，Writing code for ['
													+ URL + '].');

								if (!library_namespace.onload_queue)
									library_namespace.onload_queue = [];
								var onload = library_namespace.onload_queue.length, encode_URL = encodeURI(URL);
								// TODO: Not Yet Tested! test callback..
								library_namespace.onload_queue[onload] = function() {
									clean();
								};
								onload = ' onload="' + library_namespace.Class
										+ '.onload_queue[' + onload + ']()"';

								// TODO: 若在 window.onload 之后使用 document.write()
								// 会清空页面!
								document.write(type === 'js'
								//
								? '<script type="text/javascript" src="'
										+ encode_URL
										// language="JScript"
										+ '"' + onload + '><\/script>'
										: type === 'css' ?
										// TODO: security concern: 对
										// path 作 filter。
										'<link type="text/css" rel="stylesheet" href="'

										+ encode_URL + '"' + onload
												+ '><\/link>'
										//
										: '<img src="' + encode_URL + '" />');
							}

						} else if (library_namespace.is_debug(2)) {
							library_namespace.warn(
							// 误在非 HTML 环境执行，却要求 HTML 环境下的 resource？
							'load_named: No method availed!'
									+ ' 没有可以载入 resource 的方法！');
						}

					if (!declaration.included
					// 在 web 环境才警告 web 资源档载入问题。
					// 此时 type 尚未设定。
					&& (library_namespace.is_WWW() || !/\.css/i.test(id)))
						library_namespace.warn(
						//
						'load_named: 载入 [' + id + '] 失败！');
				}

				// force 仅使用一次。
				// delete item.force;

			} else {
				library_namespace.debug('之前已处理过 [' + id + '] 之载入程序：'
						+ (declaration.included ? '成功' : '无法') + '载入。', 5,
						'load_named');
			}

			// ---------------------------------------
			// 最后收尾程序。
			if (declaration.included || item.skip_error
			//
			|| options.finish_only) {

				if (options.finish_only) {
					if (library_namespace.is_debug(2)
							&& library_namespace.is_WWW())
						library_namespace.debug('[' + id
								+ '].finish() 已执行完毕。执行回调/回拨函式…', 5,
								'load_named');
				} else {
					// TODO: 将 callback 纳入 dependency chain。
					if (library_namespace.is_debug(2)
							&& library_namespace.is_WWW())
						library_namespace.debug('[' + id + '] 已'
								+ (declaration.included ? '成功' : '')
								+ '载入完毕。执行回调/回拨函式…', 5, 'load_named');

					// force 仅使用一次。
					// if (is_controller(item) && item.force) delete item.force;

					// 初始设定函式本身定义的 callback，.finish() 应该先执行。
					if (run_callback('finish',
					// 传入 module name space。
					library_namespace.value_of(id), waiting,
					//
					function sub_modules_to_full_module_path(sub_modules) {
						if (Array.isArray(sub_modules)) {
							return sub_modules
									.map(sub_modules_to_full_module_path);
						}
						// library_namespace.get_module_path(...)
						return id + library_namespace.env.module_name_separator
								+ sub_modules;
					})) {
						if (library_namespace.is_debug(2)
								&& library_namespace.is_WWW()) {
							library_namespace.debug('[' + id
									+ '].finish() 需要 waiting。等待其执行完毕…', 5,
									'load_named');
						}
						// 因无法即时载入，先行退出。
						return INCLUDING;
					}
				}

				run_callback('callback',
				// 传入 id。
				id);

				if (library_namespace.is_debug(2) && library_namespace.is_WWW())
					library_namespace.debug('[' + id
							+ '] 之善后/收尾工作函式已执行完毕，清除 cache/stack…', 5,
							'load_named');
				// Release memory. 释放被占用的记忆体. delete cache, 早点 delete
				// 以释放记忆体空间/资源。
				// 预防出现问题，如 memory leak 等。
				delete declaration.code;
				delete declaration.finish;
				delete declaration.last_call;
				delete declaration.require_resources;
				delete declaration.variable_hash;
				delete declaration.callback;
				delete declaration.error_handler;
				delete declaration.is_waiting_now;
				// delete declaration.use;

				// TODO: destroy item。

				// declaration.status = PROCESSED;
				if (!declaration.included)
					return INCLUDE_FAILED;

			} else if ('included' in declaration) {
				// error callback 仅在每次真正尝试过后才执行。
				// 这边不再 run_callback('error_handler');
				return INCLUDE_FAILED;

			} else if (library_namespace.is_debug(2)
					&& library_namespace.is_WWW())
				library_namespace
						.debug(
								'module ['
										+ module
										+ '] is <b>NOT YET</b> loaded。通常为 module code 或呼叫 code 之问题。',
								2, 'load_named');

			library_namespace.debug('[' + id + '] 处理完毕。', 5, 'load_named');
			return PROCESSED;
		}

		// ---------------------------------------------------------------------//

		/**
		 * module_declaration.
		 */
		var named_code_declaration = {
			/**
			 * 本 module 之 module name/id。<br />
			 * TODO: 不设定时会从呼叫时之 path 取得。
			 * 
			 * @type String
			 * @constant
			 * @inner
			 * @ignore
			 */
			name : 'module name',

			// dependency. function name, module name.
			require : 'module_name.required_function|module_name.',

			/**
			 * 执行成功后，最后阶段收拾善后/收尾工作之函式。post action.<br />
			 * 可处理在 module setup/设定 时尚无法完成的工作，例如 including external resources。
			 * 
			 * 因为需要经过特别处理，本设定不可直接汇入！
			 */
			finish : function() {
				// @see this.finish = function() below
			},
			/**
			 * 执行失败后之异常/例外处理函式。<br />
			 * error handler, errorcallback, callback on error.<br />
			 * 
			 * 因为需要经过特别处理，本设定不可直接汇入！
			 */
			// error_handler : function(error_Object) { this === declaration; },
			/**
			 * 扩充标的基底。extend to what name-space。<br />
			 * 预设 extend 到哪个 name space。<br />
			 * 
			 * 若有设定，但不为真值，则完全不 extend。
			 * 
			 * 因为需要经过特别处理，本设定不可直接汇入！
			 */
			// extend_to : '',
			/**
			 * 不 extend 到 extend_to 下的 member (property, method) 列表。<br />
			 * '*': 不 extend 所有 member.<br />
			 * this: 连 module 本身都不 extend 到 extend_to 下。
			 * 
			 * @type String
			 * @type Array
			 * @ignore
			 */
			no_extend : 'this,*,no_extend_member',

			/**
			 * 初始设定函式。<br />
			 * 欲 include 整个 module 时，需囊括之 source code。
			 * 
			 * @param {Function}library_namespace
			 *            namespace of library. 通常即 CeL。<br />
			 *            亦可以 this.base 取得。
			 * 
			 * @type Function
			 */
			code : function(library_namespace) {
				/**
				 * full module name starts with library name
				 * `library_namespace.Class` (CeL).
				 * 
				 * If you want module name without library name prefix in module
				 * code, using `this.module_name` instead.
				 * 
				 * @type {String}
				 */
				var module_name = this.id,
				/**
				 * 呼叫初始设定函式时，采用之初始设定 options/arguments。
				 */
				load_option = this.load_option,
				/**
				 * 预先宣告本模组需要用到的变数名称。<br />
				 * list of dependency function/module/variable required.<br />
				 * module 须以 CeL.env.module_name_separator ('.') 结尾。<br />
				 * 若输入 String，则以 (TODO:separator 或) '|' 分割。
				 * 
				 * @type {Array|String}
				 * 
				 * @see parse_require()
				 */
				required_function = this.r('required_function');

				// 初始设定本模组需要用到的变数。
				// 2016/5/7 11:42:45: 为了避免使用 eval()，已改成 this.r()。
				// eval(this.use());

				// or...
				// nothing required.
				// 本 module 为许多 module 所用，应尽可能勿 requiring 其他 module。

				// 宣告暴露到外部的变量和函数。
				var to_export = function() {
					// null module constructor
				};

				var private_value = 1;
				function get_value() {
					return private_value;
				}

				to_export.method = function() {
					required_function(1, 2, 3);
				};

				// for inherit.
				to_export.grant = function(subclass) {
				};

				// 收尾工作。
				this.finish = function(name_space, waiting,
						sub_modules_to_full_module_path) {
					// in this scope, this === declaration;

					var sub_modules = [ 'sub_module_1', 'sub_module_2' ];
					var sub_sub_modules = [ 'sub_module.sub_sub_module' ];

					// 若 return waiting 表示需要等待，例如 asynchronous。
					// 这时*必须*在完成操作最后自行呼叫 waiting() 以唤醒剩下的作业！
					library_namespace.run(
							sub_modules_to_full_module_path(sub_modules),
							sub_modules_to_full_module_path(sub_sub_modules),
							waiting);
					// need waiting
					return waiting;
				};

				return to_export;
			}
		};

		// 本段落接下来为 comments.
		if (false) {
			var named_code_declaration_auto_filled = {

				// 执行完后 callback 原先的执行绪/function。
				callback : new Set,

				// 以下在 setup named source code 时设定。
				base : CeL,
				// for import.
				use : use_function,
				URL : 'path',

				// 载入后设定。
				status : 'included, failed,..',
				included : false
			};

			// code style @_named_code_.js.

			// 'use strict';

			// 若 library base 尚未 load 或本 module 已经 loaded，
			// 则预设会跳过载入。
			typeof CeL === 'function' && CeL.run(named_code_declaration);

			//
			// 载入 module 之方法。
			code.call(module_declaration);
			// Release memory. 释放被占用的记忆体. 早点 delete 以释放记忆体空间/资源。
			// 预防出现问题，如 memory leak 等。
			delete module_declaration.code;
			delete module_declaration.finish;

			//
			// inherit inside children code.
			var children = parent_code.grant();
		}

		// ---------------------------------------------------------------------//

		/**
		 * 是否为 check_and_run 之 controller。
		 * 
		 * @constant
		 * @private
		 * @inner
		 * @ignore
		 */
		var is_controller = library_namespace.is_Object;

		var
		/**
		 * 可允许被复制的 options。预防不该出现的也被复制了。<br />
		 * 
		 * @constant
		 * @private
		 * @inner
		 * @ignore
		 */
		check_and_run_options = {
			/**
			 * 欲 include 之 module name/id。
			 * 
			 * @type String
			 */
			name : 'module name',
			/**
			 * 欲 include 之 URL/path。
			 * 
			 * @type String
			 */
			URL : 'URL/path',
			/**
			 * not parallel.<br />
			 * Array 之预设 options 为平行处理。
			 * 
			 * @type Boolean
			 */
			sequential : '循序/依序执行',
			/**
			 * 载入 resource 之时间限制 (millisecond)。
			 * 
			 * @type Integer
			 */
			timeout : '载入 resource 之时间限制。',
			/**
			 * 呼叫初始设定函式时，采用之初始设定 options/arguments。
			 */
			load_option : '呼叫初始设定函式时，采用之初始设定 options/arguments。',
			/**
			 * 保证上次 item 执行至此次 item 一定会等超过这段时间 → change .start_time。 TODO
			 * 
			 * @type Integer
			 */
			interval : '时间间隔',
			/**
			 * resource 之 type: 'js', 'css', 'img'.<br />
			 * 未设定则由 extension 自动判别。
			 * 
			 * @type String
			 */
			type : 'MIME type',
			/**
			 * use document.write() instead of insert a element to <head>.
			 * 
			 * @type Boolean
			 */
			use_write : 'use document.write()',
			/**
			 * option 之作用方法。有 'once', 'reset'。
			 * 
			 * @type String
			 */
			operate : 'option 之作用方法。',
			/**
			 * 强制重新加载当前文档。
			 * 
			 * @type Boolean
			 */
			force : "force reload even it's included.",
			/**
			 * 忽略所有错误。<br />
			 * ignore error.
			 * 
			 * @type Boolean
			 */
			skip_error : 'NO stop on error'
		};

		// 全 library 共用之相依关系。这会在外部资源以 .run() 载入时登录。
		// 因为外部资源的载入除了本身的注记外无法探知。
		// var relation_map = new dependency_chain;

		// ---------------------------------------------------------------------//

		/**
		 * 主要处理程序之内部 front end。<br />
		 * TODO: 为求相容，不用 .bind()。
		 * 
		 * @param {Array}initial_Array
		 *            初始设定 items.
		 * @param {Object}options
		 *            初始设定 options.
		 * 
		 * @returns {check_and_run}
		 */
		function check_and_run(initial_Array, options) {
			// initialization. 初始化工作。
			this.status = new Map;
			// 纪录 **正在 load** 之 sequence 所需之 dependency list。
			this.relation_map = new dependency_chain;
			this.run = check_and_run_run.bind(this);

			if (library_namespace.is_debug()) {
				check_and_run.count = (check_and_run.count || 0) + 1;
				var debug_id = 'check_and_run<b style="color:#d42;background-color:#ff4;">['
						+ check_and_run.count
						+ ': %/'
						+ initial_Array.length
						+ ']</b>';
				if (has_native_Object_defineProperty)
					Object.defineProperty(this, 'debug_id', {
						// enumerable : false,
						// configurable : false,
						get : function() {
							return debug_id.replace(/%/,
									this.relation_map.relations.size);
						}
					});
				else
					this.debug_id = debug_id;
				if (library_namespace.is_debug(5))
					library_namespace.log(this.debug_id + ': 初始登记：('
							+ initial_Array.length + ') [' + initial_Array
							+ ']。');
			}

			// 设定好 options。
			this.set_options(options, true);

			// @see function check_and_run_register()
			this.register(initial_Array);
		}

		/**
		 * use strict mode.<br />
		 * 这得要直接贴在标的 scope 内才有用。
		 */
		function use_strict() {
			var v, i = 0;
			try {
				// find a undefined variable name.
				while (true)
					eval(v = 'tmp_' + i++);
			} catch (i) {
			}

			try {
				// OK 表示在 eval 中可以设定 var.
				// 若是 'use strict'; 则不可在 eval() 中置新 var.
				eval(v + '=1;delete ' + v);
				return false;
			} catch (i) {
			}
			return true;
		}

		/**
		 * module 中需要 include function/module/variable 时设定 local variables 使用。<br />
		 * 本函数将把所需 function extend 至当前 namespace 下。
		 * 
		 * TODO: auto test strict.
		 * 
		 * @example <code>
		//	requires (inside module)
		//	事先定义 @ 'use strict';
		var split_String_to_Object;
		//	之所以需要使用 eval 是因为要 extend 至当前 namespace 下。
		//	若无法 load CeL.data，将会 throw
		eval(this.use());
		//	use it
		split_String_to_Object();

		//TODO
		//	不用 eval 的方法 1: function 预设都会 extend 至当前 library_namespace 下。
		library_namespace.use_function(this, 'data.split_String_to_Object');
		library_namespace.use_function(this, 'data.split_String_to_Object', false);
		//	若无法 load CeL.data，将会 throw
		//	use it
		library_namespace.split_String_to_Object();

		//TODO
		//	不用 eval 的方法 2: 设定 extend_to
		var o={};
		//	若无法 load CeL.data，将会 throw
		library_namespace.use_function(this, 'data.split_String_to_Object', o);
		//	use it
		o.split_String_to_Object();
		</code>
		 * 
		 * @param {Function|Object}extend_to
		 *            把 variable extend 至 name-space extend_to
		 * 
		 */
		function use_function(extend_to, no_strict) {
			if (!is_controller(this)) {
				library_namespace.error('No "this" binded!');
				return '';
			}

			if (no_strict)
				no_strict = [];

			var eval_code = [], variable_name, value, full_name,
			/**
			 * 要 extend 到 extend_to 下的 variables。<br />
			 * function/module/variable required.<br />
			 * 
			 * variable_hash[variable name] = variable full name, <br />
			 * 包括所在 module name。
			 * 
			 * @see check_and_run_normalize()
			 */
			variable_hash = this.variable_hash;

			if (library_namespace.is_Object(variable_hash)) {
				for (variable_name in variable_hash) {
					value = library_namespace
							.value_of(full_name = variable_hash[variable_name]);
					if (extend_to) {
						extend_to[variable_name] = value === undefined ? this.load_later
								.bind(full_name)
								: value;
					} else {
						no_strict && no_strict.push(variable_name);
						eval_code.push('try{' + variable_name + '='
								+ (value === undefined ?
								// 有些 module 尚未载入。
								// 可能因为循环参照(circular dependencies)，
								// 事实上 required 并未 loaded。
								'this.load_later.bind("' + full_name + '")' :
								/**
								 * escaped variable name.<br />
								 * 预防有保留字，所以用 bracket notation。 <br />
								 * 例如 Chrome 中会出现 'Unexpected token native'。
								 * 
								 * @see <a
								 *      href="http://www.dev-archive.net/articles/js-dot-notation/"
								 *      accessdate="2012/12/14 22:58">Dot
								 *      Notation and Square Bracket Notation in
								 *      JavaScript</a>
								 */
								full_name.replace(/\.([a-z\d_]+)/gi, '["$1"]'))
								// throw 到这边，较可能是因为尚未定义 variable_name。
								// 因此不再尝试用 load_later。
								+ ';}catch(e){}');
					}
				}
			}

			// 应注意 module_name 为保留字之类的情况，会挂在这边 return 后的 eval。
			return extend_to
					|| (Array.isArray(no_strict) && no_strict.length > 0 ? 'var '
							+ no_strict.join(',') + ';'
							: '') + eval_code.join('');
		}

		/**
		 * 正规化之前置作业:用于将 item 全部转为 {Object} controller。
		 * 
		 * @param item
		 *            正规化此 item。
		 * 
		 * @returns 正规化后之 item。
		 */
		function check_and_run_normalize(item) {

			if (item === PARALLEL || item === SEQUENTIAL)
				item = item === SEQUENTIAL;

			var name;

			switch (typeof item) {

			case 'boolean':
				return {
					// 循序/依序执行, one by one. in order / sequentially.
					// successively.
					sequential : item
				};

			case 'number':
				return {
					timeout : item > 0 ? item | 0 : 0
				};

			case 'function':
				// 注意:对 function 有特殊行为，
				// 不 return {Object} controller。
				return item;

			case 'string':
				// 包括 module/URL/path/变数/数值名。
				if (is_controller(name = get_named(item))
						|| typeof name === 'function') {
					return name;
				}
				name = undefined;
				break;

			case 'object':
				if (name = is_controller(item)
						&& (item.id || item.name || item.URL)) {
					// 测试是否处于 named source code 中。 item.code 为程式码(function)。
					// 即使不处于 named source code 中，也应该是有特殊 option 的设定块。
					// 因此还是得过个 get_named() 正规化一下 .id。
					var is_setup_declaration = typeof item.code === 'function',
					//
					declaration = get_named(name, item);

					if (declaration) {
						if (is_setup_declaration)
							return (declaration.force || !('included' in declaration)) ? parse_require(declaration)
									: declaration;
						library_namespace.debug('正规化载入 id [' + declaration.id
								+ '] 的 controller。', 5,
								'check_and_run_normalize');
						// 将 declaration.{id,name,URL} copy 至 item。
						if (false)
							library_namespace.extend({
								id : 1,
								name : 1,
								URL : 1
							}, item, declaration, 'string');
						library_namespace.set_method(item, declaration, [
								function(key) {
									return typeof declaration[key] !== 'string'
								}, 'id', 'name', 'URL' ]);
					}
				}

			}

			// Array.isArray() 的频率最高。
			if (Array.isArray(item) || name)
				return item;

			// 其他都将被忽略!
			if (item) {
				library_namespace
						.warn('check_and_run.normalize: Unknown item: ('
								+ (typeof item) + ') [' + item + ']!');
			}

		}

		/**
		 * 预设 options。
		 */
		check_and_run.options = {
			// default timeout (millisecond) after options.interval.
			// 若短到 3s， 在大档案作 auto_TOC() 会逾时。
			timeout : library_namespace.is_local() ? 20000 : 60000
		};

		/**
		 * 设定功能选项。
		 * 
		 * @param {Object}options
		 *            功能选项。
		 * @param {Boolean}reset
		 *            是否重置功能选项。
		 */
		function check_and_run_set_options(options, reset) {
			if (reset)
				Object.assign(this.options = Object.create(null),
						check_and_run.options);

			if (library_namespace.is_Object(options)) {
				if (false)
					library_namespace.extend(check_and_run_options,
							this.options, options);

				// TODO: .extend() 预设会 overwrite check_and_run_options.*。
				var i, this_options = this.options;
				for (i in options)
					if (i in check_and_run_options)
						this_options[i] = options[i];
			}
		}

		/**
		 * 登记/注册整个 array 之元素与相依性。<br />
		 * 增加项目至当前的工作组。
		 * 
		 * @param {Array}array
		 *            欲注册之 Array。
		 * 
		 * @returns {Number} status.
		 */
		function check_and_run_register(array, previous) {

			// library_namespace.assert(Array.isArray(array));

			// 因为可能动到原 Array，因此重制一个。
			// array = Array.prototype.slice.call(array);
			// 若是在后面还出现与前面相同的元素，则可能造成循环参照(circular dependencies)，此时仅取前面一个相依姓，。
			// array = (new Set(array)).values();

			var i = 0, j, length = array.length, sequential, item, next = array, something_new, relation_map = this.relation_map, status = this.status, _this = this;
			if (length === 0) {
				status.set(array, PROCESSED);
				if (previous !== undefined)
					// 需登记相依性之 array。
					relation_map.add(previous, array);
				return PROCESSED;
			}
			if (status.get(array) === PROCESSED)
				return PROCESSED;

			for (; i < length; i++)
				// 正规化 arguments。
				if ((item = check_and_run_normalize(array[i]))
						&& status.get(item) !== PROCESSED) {

					if (Array.isArray(item)) {
						if (item.length === 0
								|| _this.register(item, previous) === PROCESSED)
							continue;
					} else if (typeof item !== 'function'
							&& (!is_controller(item) || ('included' in item)
									&& !item.force))
						continue;

					if (!is_controller(item) || item === array[i]) {
						// 若输入的是纯量 option，会造成每次都创建新的 Object。
						// 这会让此 Array 总是有 something_new。
						something_new = true;
					}

					if (previous !== undefined)
						// 需登记相依性之 array 至 relation map。
						relation_map.add(previous, item);

					// 在中途设定执行次序(running sequence)。
					if (is_controller(item) && ('sequential' in item)
							&& sequential !== (j = !!item.sequential))
						if (sequential = j)
							library_namespace.debug('自 ' + (i + 1) + '/'
									+ length
									+ ' 起依序载入：将元素一个接一个，展开至 relation map。', 5,
									this.debug_id + '.register');
						else {
							// 找出下一个所有平行载入元素都载入完后，才能开始的元素。
							j = i;
							while (++j < length)
								// TODO: cache.
								if (is_controller(next = check_and_run_normalize(array[j]))
										&& next.sequential)
									break;
							if (j === length)
								next = array;
							library_namespace.debug((i + 1) + '-' + j + '/'
									+ length + ' 平行载入：所有 ' + (j - i)
									+ ' 个元素皆 loaded 之后，才算是处理完了 Array。', 5,
									this.debug_id + '.register');
						}

					if (sequential)
						previous = item;
					else
						relation_map.add(item, next);
				}

			if (!something_new) {
				// 没东西。skip.
				return PROCESSED;
			}

			if (sequential) {
				// array 的每个元素都载入后，才能处理阵列本身。
				relation_map.add(previous, array);
			}
		}

		/**
		 * check_and_run 之实际载入程序。
		 * 
		 * @returns {Number} status.
		 */
		function check_and_run_run() {
			var item, relation_map = this.relation_map;

			// 解决库存的工作：
			// 开始测试是否有独立 object 可直接处理/解决。
			// 对每一项都先找出独立不依赖它者的，先处理。
			while ((item = relation_map.independent()) || item === 0) {
				// 开始处理当前的 item。

				// 所有加入 relation_map 的应该都已经 normalize 过。
				// item = check_and_run_normalize(item);

				if (typeof item === 'function') {
					library_namespace.debug(
							'直接执行 function ['
									+ (library_namespace
											.get_function_name(item) || item)
									+ ']。', 5, this.debug_id + '.run');
					if (library_namespace.env.no_catch)
						// 当 include 程式码，执行时不 catch error 以作防范。
						item();
					else
						try {
							// TODO: 可否加点 arguments?
							item();
						} catch (e) {
							library_namespace.error(
							//
							'check_and_run.run: Error to run function: '
									+ e.message);
							if (library_namespace.env.has_console) {
								// console.trace(e);
								console.error(e);
							}
							library_namespace.debug('<code>'
									+ ('' + item).replace(/</g, '&lt;')
											.replace(/\n/g, '<br />')
									+ '</code>', 5, this.debug_id + '.run');
							return INCLUDE_FAILED;
						}

				} else if (Array.isArray(item)) {
					library_namespace.debug('登记 Array(' + item.length + ') ['
							+ item + ']。', 5, this.debug_id + '.run');
					if (this.register(item) !== PROCESSED)
						// 不清除。继续处理 Array。
						item = null;

				} else if (is_controller(item)) {
					library_namespace.debug('处理 controller [' + item.id + ']。',
							5, this.debug_id + '.run');

					// import controller.
					// 先处理 options 再载入。
					var options = this.options;
					if (item.operate === 'once')
						options = item;
					else
						this.set_options(item, item.operate === 'reset');

					if (item.id)
						// 若是已处理过则跳过。
						// 因为 item 不一定为 named_code[] 之 declaration，因此只能以
						// is_included() 来判别是否 included。
						if (!item.force && is_included(item.id) !== undefined) {
							library_namespace.debug(
									(is_included(item.id) ? '已经 included'
											: '之前曾 include 失败')
											+ ': [' + item.id + ']!', 5,
									this.debug_id + '.run');
						} else {
							if (library_namespace.is_debug(2)
									&& library_namespace.is_WWW())
								library_namespace.debug('尝试'
										+ (is_included(item.id) ? '重新' : '')
										+ '载入 '
										+ (item.module_name ? 'module'
												: 'resource') + ' [' + item.id
										+ ']。', 5, this.debug_id + '.run');
							// include module/URL resource.
							var result = load_named(item, options, this.run);
							// force 仅使用一次。预防已经重复处理。
							if (item.force)
								delete item.force;
							if (result === INCLUDING) {
								if (false)
									// 在 IE 10 中，当 .appendChild() 时，
									// 会先中断，执行所插入 node 的内容。
									// 因此必须确保在 .appendChild() 前，便已设定好 callback！
									item.callback.add(this.run);

								// item.status = INCLUDING;

								library_namespace.debug('正等待 loading ['
										+ item.id
										+ '] 中。推入排程开始蛰伏，waiting for callback。',
										5, this.debug_id + '.run');
								// 因无法即时载入，先行退出。
								return result;
							} else if (result === INCLUDE_FAILED)
								library_namespace.debug('Error to include ['
										+ item.id + ']', 5, this.debug_id
										+ '.run');
							else
								// assert: PROCESSED
								library_namespace.debug('[' + item.id
										+ ']: included.', 5, this.debug_id
										+ '.run');
						}

				} else
					library_namespace.warn('check_and_run.run: Unknown item: ['
							+ item + ']!');

				if (item !== null) {
					// current item is done. 本载入组已全部载入。
					library_namespace.debug('已处理过'
							+ (item.id ? ' [' + item.id + ']' : '此 '
									+ library_namespace.is_type(item))
							+ '，消除其相依关系。', 5, this.debug_id + '.run');
					this.status.set(item, PROCESSED);
					// 执行完清除 relation map 中之登录。
					relation_map['delete'](item);
				}

				// 移到下一 group/工作组。
			}

			if (relation_map.relations.size > 0) {
				// 确认没有其他在 queue 中的。
				library_namespace.warn('check_and_run.run: 已无独立元素，却仍有 '
						+ relation_map.relations.size + ' 个元素未处理！');
			}

			// destroy this.relation_map。
			// delete this.relation_map;
			library_namespace.debug('本次序列已处理完毕。', 5, this.debug_id + '.run');
		}

		// public interface of check_and_run.
		Object.assign(check_and_run.prototype, {
			// TODO: 警告：由于 set_options 之故，
			// 在 module code 的 scope 内，options 已被定义，而非 undefined!
			// 一般会得到 options={timeout: 20000}
			set_options : check_and_run_set_options,
			register : check_and_run_register
		});

		// ---------------------------------------------------------------------//
		// for module 操作.

		/**
		 * library 相对于 HTML file 的 base path。<br />
		 * 同目录时，应为 "./"。
		 * 
		 * @example <code>

		 // 在特殊环境下，设置 library base path。
		 var CeL = { library_path : 'path/to/ce.js' };

		 * </code>
		 */
		var library_base_path,
		/**
		 * 设定 library base path，并以此决定 module path。
		 */
		setup_library_base_path = function() {
			if (!library_base_path) {
				// 当执行程式为 library base (ce.js)，则采用本执行程式所附带之整组 library；
				if (false) {
					console.log([ library_namespace.env.script_name,
							library_namespace.env.main_script_name,
							library_namespace.env.registry_path ]);
				}

				var old_namespace = library_namespace.get_old_namespace();
				// 采用已经特别指定的路径。
				if (library_namespace.is_Object(old_namespace)
						&& (library_base_path = old_namespace.library_path)) {
					// e.g., require() from electron
					// /path
					// C:\path
					if (!/^([A-Z]:)?[\\\/]/i.test(library_base_path)) {
						// assert: library_base_path is relative path
						// library_namespace.debug(library_namespace.get_script_full_name());
						library_base_path = library_namespace
								.simplify_path(library_namespace
										.get_script_full_name().replace(
												/[^\\\/]*$/, library_base_path));
					}
					library_base_path = library_namespace.simplify_path(
							library_base_path).replace(/[^\\\/]*$/, '');
				}

				// 否则先尝试存放在 registry 中的 path。
				if (!library_base_path
						&& library_namespace.env.script_name !== library_namespace.env.main_script_name) {
					library_base_path = library_namespace.env.registry_path;
				}

				// 尽可能先检查较具特征、比较长的名称: "ce.js"→"ce"。
				if (!library_base_path) {
					library_base_path = library_namespace
							.get_script_base_path(library_namespace.env.main_script)
							|| library_namespace
									.get_script_base_path(library_namespace.env.main_script_name)
							|| library_namespace.get_script_base_path();
				}

				if (library_base_path) {
					setup_library_base_path = function() {
						return library_base_path;
					};
					library_namespace.debug('library base path: [<a href="'
							+ encodeURI(library_base_path) + '">'
							+ library_base_path + '</a>]', 2,
							'setup_library_base_path');
				} else {
					library_namespace
							.warn('setup_library_base_path: Cannot detect the library base path!');
				}
			}

			library_namespace.env.library_base_path = library_base_path;
			// console.log(library_base_path);
			return library_base_path;
		};

		/**
		 * get the path of specified module.<br />
		 * 外部程式使用时，通常用在 include 相对于 library / module 本身路径固定的 resource 档案。<br />
		 * 例如 file_name 改成相对于 library 本身来说的路径。
		 * 
		 * @example <code>

		// 存放 data 的 path path =
		library_namespace.get_module_path(this, '');

		 * </code>
		 * 
		 * @param {String}[module_name]
		 *            module name.<br />
		 *            未提供则设成 library base path，此时 file_name 为相对于 library
		 *            本身路径的档案。
		 * @param {String}[file_name]
		 *            取得与 module 目录下，档名为 file_name 之 resource file path。<br />
		 *            若填入 '' 可取得 parent 目录。
		 * 
		 * @returns {String} module path
		 */
		function get_module_path(module_name, file_name) {
			// module_name = get_module_name(module_name);

			library_namespace.debug('test [' + module_name + ']', 4,
					'get_module_path');
			var file_path = library_base_path || setup_library_base_path(),
			//
			separator = file_path.indexOf('\\') === NOT_FOUND ? '/' : '\\';

			file_path += library_namespace.split_module_name(module_name).join(
					separator)
					+ (typeof file_name === 'string' ? (module_name ? separator
							: '')
							+ file_name : (module_name ? ''
							: library_namespace.env.main_script_name)
							+ library_namespace.env.script_extension);

			if (library_namespace.getFP)
				file_path = library_namespace.getFP(file_path, 1);

			library_namespace.debug('Path of module [' + module_name
					+ '] / file [' + file_name + ']: [<a href="'
					+ encodeURI(file_path) + '">' + file_path + '</a>]', 2,
					'get_module_path');

			return file_path;
		}

		// export.
		library_namespace.get_module_path = get_module_path;

		// Forced loading of compatibility modules. 强制载入相容性模组。
		if (!library_namespace.env.force_including_compatibility_module
		// check from newer to older
		// node 4 does not has Array.prototype.includes()
		// node 16 does not has Array.prototype.at()
		&& Array.prototype.at
		//
		&& has_native_Set
		// node 10.19.0 does not has `globalThis`
		&& typeof globalThis !== 'undefined' && globalThis
		//
		&& globalThis.globalThis === globalThis
		//
		&& typeof Promise === 'function'
		// node 10.19.0 does not has Promise.allSettled()
		&& typeof Promise.allSettled === 'function'
		// node 7.9 does not has String.prototype.trimStart()
		&& String.prototype.trimEnd && String.prototype.padEnd
		// node 6.2.2 does not has Object.values(), Object.entries()
		&& Object.entries
		// Chrome/73.0.3683.20, Firefox/67.0 has .matchAll(),
		// node 11.9 DO NOT has .matchAll().
		&& String.prototype.matchAll) {
			library_namespace.debug(
			//		
			'已经有近代的执行环境特性，跳过 shim、相容性 test 专用的 functions。');
			get_named('data.code.compatibility', true).included = true;
		}

		/**
		 * (module 中)模拟继承时使用。<br />
		 * クラスを継承する。
		 * 
		 * TODO:<br />
		 * thread-safe<br />
		 * initial_arguments 继承时的 initial arguments。<br />
		 * initializer
		 * 
		 * @param child
		 *            继承的子类别。
		 * @param parent
		 *            继承的亲类别。
		 * 
		 * @see <a
		 *      href="http://en.wikipedia.org/wiki/Inheritance_(computer_science)"
		 *      accessdate="2012/12/18 18:54">Inheritance</a>,<br />
		 *      <a href="http://fillano.blog.ithome.com.tw/post/257/17355"
		 *      accessdate="2010/1/1 0:6">Fillano's Learning Notes |
		 *      物件导向Javascript - 实作继承的效果</a>,<br />
		 *      <a href="http://www.crockford.com/javascript/inheritance.html"
		 *      accessdate="2010/1/1 0:6">Classical Inheritance in JavaScript</a>,<br />
		 *      <a href="http://phrogz.net/JS/classes/OOPinJS.html"
		 *      accessdate="2012/12/18 19:16">OOP in JS, Part 1 : Public/Private
		 *      Variables and Methods</a>
		 * 
		 */
		function inherit(child, parent) {
			var i = 1, j, prototype;
			/**
			 * normalize parent.
			 */
			function normalize() {
				if (typeof parent === 'string') {
					library_namespace.debug(
							'get the module namespace of specific parent module name ['
									+ parent + '].', 2, 'inherit');
					parent = library_namespace.value_of(library_namespace
							.to_module_name(parent));
				}
				if (library_namespace.is_Function(parent))
					return parent;
				library_namespace.error('inherit: 无法判别出合理之 parent[' + i + ']！');
			}

			if (!normalize())
				return;

			/**
			 * copy the prototype properties using new.<br />
			 * 另可在 constructor 中: parent.call(this, argument);
			 * 
			 * @see <a
			 *      href="https://developer.mozilla.org/en-US/docs/JavaScript/Guide/Inheritance_Revisited"
			 *      accessdate="2012/12/18 18:59">Inheritance revisited</a>
			 */
			try {
				// Object.setPrototypeOf(prototype, parent.prototype);
				prototype = new parent;
			} catch (e) {
				prototype = parent;
			}
			// TODO
			if (false)
				if (Object.create)
					prototype = Object.create(prototype);

			if (typeof child === 'function')
				// 搬回原先 child 的原型。
				for (j in child.prototype)
					prototype[j] = child.prototype[j];
			else if (!child)
				child = function() {
				};

			(child.prototype = prototype).constructor = child;

			// 处理其他 parent 的 prototype。
			for (var parent_prototype, length = arguments.length; ++i < length;) {
				parent = arguments[i];
				if (normalize()) {
					parent_prototype = parent.prototype;
					for (j in parent_prototype)
						prototype[j] = parent_prototype[j];
				}
			}

			return child;
		}

		// export.
		library_namespace.inherit = inherit;

		// ---------------------------------------------------------------------//

		/**
		 * control/setup source codes to run.<br />
		 * 基本上使用异序(asynchronously,不同时)的方式，<br />
		 * 除非所需资源已经载入，或是有办法以 {@link XMLHttpRequest} 取得资源。<br />
		 * 
		 * 本函数实为 DOM 载入后，正常 .run 载入处理程序之对外 front end。<br />
		 * 
		 * @param running_sequence
		 * 
		 * running sequence:<br />
		 * {Integer} PARALLEL (平行处理), SEQUENTIAL (循序/依序执行, in order).<br />
		 * {ℕ⁰:Natural+0} timeout (ms): 载入 resource 之时间限制 (millisecond)。<br />
		 * {Array} 另一组动作串 (required sequence): [{String|Function|Integer}, ..] →
		 * 拆开全部当作 PARALLEL loading.<br />
		 * {String} library module name to import, resource (URL/file path)
		 * (e.g., JavaScript/CSS/image) to import.<br />
		 * {Function} function to run/欲执行之 function。<br />
		 * {Object} options: loading with additional config. See
		 * check_and_run_options.
		 * 
		 * @example <code>
		 * </code>
		 * 
		 * 正确:<br />
		 * <code>
		CeL.run('code.log', function() {
			CeL.warn('WARNING message');
		});
		</code>
		 * 
		 * 错误:<br />
		 * <code>
		CeL.run('code.log');
		//	注意：以下的 code 中，CeL.warn() 不一定会被执行（可能会、可能不会），因为执行时 log 可能尚未被 include。
		//	在已经 included 的情况下有可能直接就执行下去。
		//	此时应该改用 CeL.run();
		CeL.warn('WARNING message');
		</code>
		 * 
		 * TODO:<br />
		 * 进度改变时之 handle：一次指定多个 module 时可以知道进度，全部 load 完才 callback()。
		 * 
		 */
		function normal_run() {
			if (arguments.length > 1 || arguments[0]) {
				if (library_namespace.is_debug(2) && library_namespace.is_WWW()) {
					library_namespace.debug('初始登记/处理 ' + arguments.length
							+ ' items。', 2, 'normal_run');
				}
				var to_run = Array.prototype.slice.call(arguments);
				if (to_run.length > 1) {
					// 预设 options 为依序处理。（按顺序先后，尽可能同时执行。）
					to_run.unshift(SEQUENTIAL);
				}

				// 注意: 每次执行 CeL.run() 都会创出新的1组 check_and_run() 与
				// dependency_chain
				to_run = new check_and_run(to_run);

				library_namespace.debug('做完初始登记，开始跑程序。', 2, 'normal_run');
				return to_run.run();
			}

			library_namespace.debug('未输入可处理之序列！', 3, library_namespace.Class
					+ 'run', 'normal_run');
		}

		/**
		 * check included resources. 检查已载入的资源档，预防重复载入。
		 * 
		 * @param {String}tag
		 *            tag name to check.
		 * @param {String}URL_attribute
		 *            attribute name of the tag.
		 */
		function check_resources(tag, URL_attribute) {
			if (URL_attribute || (URL_attribute = URL_of_tag[tag])) {
				library_namespace.get_tag_list(tag).forEach(function(node) {
					var URL = node[URL_attribute];
					if (typeof URL === 'string' && URL && is_controller(URL
					//
					= get_named(URL.replace(/#[^#?]*$/, '')))) {
						library_namespace.debug(
						//
						'add included: [' + URL.id + ']',
						//
						2, 'check_resources');
						URL.included = true;
					}
				});
			} else {
				library_namespace.warn(
				//
				'check_resources: 无法判别 tag [' + tag + '] 之 URL attribute！');
			}
		}

		// export.
		library_namespace.check_resources = check_resources;

		/**
		 * 设定 library 之初始化程序。
		 */
		var library_initializer = function() {

			setup_library_base_path();

			if (library_namespace.is_WWW()) {
				for ( var tag in tag_map) {
					URL_of_tag[tag] = tag_map[tag][0];
					tag_map[tag][1].split('|').forEach(function(type) {
						tag_of_type[type] = tag;
					});
				}
				[ 'script', 'link' ].forEach(function(tag) {
					check_resources(tag);
				});
			}

			/**
			 * 初始化 user 设定: 处理在 <script> 中插入的初始设定。
			 * 
			 * TODO: 若是设定: <code>

			<script type="text/javascript" src="lib/JS/ce.js">// {"run":["css.css","js.js"]}</script>

			 * </code> 则 .css 后的 .js 可能执行不到，会被跳过。
			 */
			var queue = library_namespace.env.script_config;
			if (library_namespace.is_Object(queue) && (queue = queue.run))
				library_initializer.queue.push(queue);
			queue = library_initializer.queue;

			// 已处理完毕，destroy & set free。
			library_initializer = function() {
				library_namespace.log('library_initializer: 已处理完毕。');
			};

			// use CeL={initializer:function(){}}; as callback
			var old_namespace = library_namespace.get_old_namespace(), initializer;
			if (library_namespace.is_Object(old_namespace)
					&& (initializer = old_namespace.initializer)) {
				if (Array.isArray(initializer))
					Array.prototype.push.call(queue, initializer);
				else
					queue.push(initializer);
			}

			// 处理积存工作。
			// export .run().
			return (library_namespace.run = normal_run)(queue);
		};
		library_initializer.queue = [];

		if (false) {
			console.log('is_WWW: ' + library_namespace.is_WWW()
					+ ', document.readyState: ' + document.readyState);
			console.log(library_namespace.get_tag_list('script').map(
					function(n) {
						return n.getAttribute('src')
					}));
		}
		// 需要确定还没有 DOMContentLoaded
		// https://stackoverflow.com/questions/9457891/how-to-detect-if-domcontentloaded-was-fired
		if (!library_namespace.is_WWW() || document.readyState === "complete"
				|| document.readyState === "loaded"
				|| document.readyState === "interactive") {
			library_initializer();

		} else {
			// 先检查插入的<script>元素，预防等档案载入完之后，<script>已经被移除。
			setup_library_base_path();
			library_namespace.run = function pre_loader() {
				if (!library_initializer)
					// 已初始化。这是怕有人不用 .run()，而作了 cache。
					return normal_run.apply(null, arguments);

				// onload, 推入queue，以等待程式库载入之后执行。
				library_initializer.queue.push(Array.prototype.slice
						.call(arguments));
			};

			/**
			 * 以 event listener 确保初始化程序被执行。
			 * 
			 * @see http://w3help.org/zh-cn/causes/SD9022<br />
			 *      统一为 window 对象的 onload 事件绑定函数，避免在 Firefox 中产生
			 *      document.body.onload 事件理解歧义。<br />
			 *      统一使用 DOM 规范的事件监听方法（或 IE 专有事件绑定方法）为 IFRAME 标记绑定 onload
			 *      事件处理函数。
			 */
			if (document.addEventListener) {
				// https://developer.mozilla.org/en/Gecko-Specific_DOM_Events
				document.addEventListener("DOMContentLoaded",
						library_initializer, false);
			} else if (window.attachEvent) {
				window.attachEvent("onload", library_initializer);
			} else {
				library_namespace
						.warn('No event listener! Using window.onload.');
				if (!window.onload) {
					window.onload = library_initializer;
				} else {
					(function() {
						var old_onload = window.onload;
						window.onload = function() {
							old_onload();
							library_initializer();
						};
					})();
				}
			}
		}

		// ---------------------------------------------------------------------//

	})(CeL);






// args.append(['turnCode.js']);
// args=args.concat(['turnCode.js']);
// --------------------------------------------------------------------------------------------------------------------
// 不作 initialization
// CeL.no_initialization = false;
if (typeof CeL === 'function' && !CeL.no_initialization) {
	if (CeL.env.script_name === CeL.env.main_script_name)
		// 仅仅执行 ce.js 此档时欲执行的程序。
		(function(_) {

			// WScript.Echo(_.env.script_name);
			// _.debug(_.env.script_name);

			// _.set_debug(2);
			_
					.run([ 'application.OS.Windows',
							'application.OS.Windows.registry' ]);
			// _.debug(_.reg);
			if (!_.reg) {
				// 会到这边，表示所有可用的 path 都无法利用；
				// registry 的 path，或是本 include 的附属 module 都有问题。
				// 像是 library base 造成的问题，不该出现于此。
				WScript.Echo('无法载入 module，您可能需要手动检查 registry，看看是否设定到了错误的路径？');
				return;
			}

			// 将 path 写入 registry
			var path_key_name = _.env.registry_path_key_name,
			// 此时 script 即为 main_script
			library_base_path = _.env.script_base_path, path_in_registry = _.reg
					.getValue(path_key_name)
					|| '(null)';
			// WScript.Echo('registry:\n' + path_in_registry + '\npath now:\n' +
			// library_base_path);
			if (path_in_registry !== library_base_path) {
				// 执行程式之 path 与 registry 所列 path 不同，且 registry 所列 path 有问题或不被使用。
				// registry 所列 path !== 执行程式之 path
				// Change library base path.
				WScript
						.Echo('Change the base path of [' + _.Class
								+ '] from:\n' + path_in_registry + '\n to\n'
								+ library_base_path + '\n\nkey name:\n'
								+ path_key_name);
				_.reg.setValue.cid = 1;
				_.reg.setValue(path_key_name, library_base_path, 0, 0, 1);
				_.reg.setValue(_.env.registry_base + 'main_script',
						library_base_path + _.env.script_name
								+ _.env.script_extension, 0, 0, 1);
				_.reg.setValue.cid = 0;
			}

			// TODO
			// 拖曳档案到本档案上面时之处置。
			// initialization_WScript_Objects();
			if (
			// args instanceof Array
			typeof args === 'object') {
				// getEnvironment();
				// alert('Get arguments ['+args.length+']\n'+args.join('\n'));
				if (args.length) {
					var i = 0, p, enc, f, backupDir = dBasePath('kanashimi\\www\\cgi-bin\\program\\log\\');
					if (!fso.FolderExists(backupDir)) {
						try {
							fso.CreateFolder(backupDir);
						} catch (e) {
							backupDir = dBasePath('kanashimi\\www\\cgi-bin\\game\\log\\');
						}
					}
					if (!fso.FolderExists(backupDir)) {
						try {
							fso.CreateFolder(backupDir);
						} catch (e) {
							if (2 === alert('无法建立备份资料夹[' + backupDir
									+ ']！\n接下来的操作将不会备份！', 0, 0, 1 + 48))
								WScript.Quit();
							backupDir = '';
						}
					}
					// addCode.report=true; // 是否加入报告
					for (; i < args.length; i++) {
						if ((f = parse_shortcut(args[i], 1))
								.match(/\.(js|vbs|hta|[xs]?html?|txt|wsf|pac)$/i)
								&& isFile(f)) {
							p = alert(
									'是否以预设编码['
											+ ((enc = autodetectEncode(f)) === simpleFileDformat ? '内定语系('
													+ simpleFileDformat + ')'
													: enc) + ']处理下面档案？\n' + f,
									0, 0, 3 + 32);
							if (p === 2)
								break;
							else if (p === 6) {
								if (backupDir)
									fso.CopyFile(f, backupDir + getFN(f), true);
								addCode(f);
							}
						}
					}
				} else if (1 === alert('We will generate a reduced ['
						+ _.env.script_name + ']\n  to [' + _.env.script_name
						+ '.reduced.js].\nBut it takes several time.', 0, 0,
						1 + 32))
					reduceScript(0, _.env.script_name + '.reduced.js');
			}// else window.onload=init;

			// _._iF=undefined;

		})(CeL);
}

// test WinShell
// http://msdn.microsoft.com/en-us/library/bb787810(VS.85).aspx
if (false) {
	alert(WinShell.Windows().Item(0).FullName);

	var i, cmd, t = '', objFolder = WinShell.NameSpace(0xa), objFolderItem = objFolder
			.Items().Item(), colVerbs = objFolderItem.Verbs(); // 假如出意外，objFolder==null
	for (i = 0; i < colVerbs.Count; i++) {
		t += colVerbs.Item(i) + '\n';
		if (('' + colVerbs.Item(i)).indexOf('&R') != -1)
			cmd = colVerbs.Item(i);
	}
	objFolderItem.InvokeVerb('' + cmd);
	alert('Commands:\n' + t);

	// objShell.NameSpace(FolderFrom).CopyHere(FolderTo,0); // copy folder
	// objFolderItem=objShell.NameSpace(FolderFrom).ParseName("clock.avi");objFolderItem.Items().Item().InvokeVerb([动作]);
	// objShell.NameSpace(FolderFromPath).Items.Item(mName).InvokeVerb();

	// Sets or gets the date and time that a file was last modified.
	// http://msdn.microsoft.com/en-us/library/bb787825(VS.85).aspx
	// objFolderItem.ModifyDate = "01/01/1900 6:05:00 PM";
	// objShell.NameSpace("C:\Temp").ParseName("Test.Txt").ModifyDate =
	// DateAdd("d", -1, Now()) CDate("19 October 2007")

	// Touch displays or sets the created, access, and modified times of one
	// or more files. http://www.stevemiller.net/apps/
}

// 测试可写入的字元:0-128,最好用1-127，因为许多编辑器会将\0转成' '，\128又不确定
if (false) {
	var t = '', f = 'try.js', i = 0;
	for (; i < 128; i++)
		t += String.fromCharCode(i);
	if (simpleWrite(f, t))
		alert('Write error!\n有此local无法相容的字元?');
	else if (simpleRead(f) != t)
		alert('内容不同!');
	else if (simpleWrite(f, dQuote(t) + ';'))
		alert('Write error 2!\n有此local无法相容的字元?');
	else if (eval(simpleRead(f)) != t)
		alert('eval内容不同!');
	else
		alert('OK!');
}








}


