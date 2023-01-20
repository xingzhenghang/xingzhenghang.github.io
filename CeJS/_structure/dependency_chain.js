/**
 * @name CeL function for dependency chain
 * @fileoverview 本档案包含了相依, dependency relation, dependency chain 用的 functions。<br />
 * 
 * TODO:<br />
 * 增加效率。这可能得更动架构设计。<br />
 * throw new DEPENDENCY_ERROR(id);
 * 
 * @example <code>
 * CeL.run([ module_1, module_2 ], function callback(){});
 * </code>
 * 
 * @since 2012/12/18
 * 
 */

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
