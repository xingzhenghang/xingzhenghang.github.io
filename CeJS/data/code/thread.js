/**
 * @name CeL function for thread
 * @fileoverview 本档案包含了 thread / process 流程控制的 functions。
 * @since 2012/2/3 19:13:49
 */

'use strict';
// 'use asm';

// --------------------------------------------------------------------------------------------

// 不采用 if 陈述式，可以避免 Eclipse JSDoc 与 format 多缩排一层。
typeof CeL === 'function' && CeL.run({
	name : 'data.code.thread',

	require : 'data.code.compatibility.',

	// 设定不汇出的子函式。
	// 完全不 export 至 library_namespace.
	no_extend : '*',

	// 为了方便格式化程式码，因此将 module 函式主体另外抽出。
	code : module_code
});

function module_code(library_namespace) {

	/**
	 * null module constructor
	 * 
	 * @class thread 的 functions
	 */
	var _// JSDT:_module_
	= function() {
		// null module constructor
	};

	/**
	 * for JSDT: 有 prototype 才会将之当作 Class
	 */
	_// JSDT:_module_
	.prototype = {
	// constructor : _
	};

	// ----------------------------------------------------------------------------------------------------------------------------------------------------------//

	var
	/**
	 * const, 不可能为 setTimeout() id.
	 */
	is_running = [ 'is running' ],
	/**
	 * const, 纪录 process hook。
	 */
	Serial_execute_process = {},
	/**
	 * const, Serial_execute core data 中，可被变更的值。
	 */
	Serial_execute_allow_to_set = {
		interval : '{Integer}设定执行之周期间隔(ms)',

		thread : '{Function}设定每次 loop 所欲执行之执行绪 (handler thread)。',

		// 传给 handler thread 之 this 与 arguments。
		'this' : '在各 thread 间当作 this 传递的 data. "this" argument send to thread.',
		argument : 'argument : 传给 handler 之 arguments',

		// loop 序号控制。单纯输入数字相当于 {start : 1, length : 自然数序号}
		index : '{Integer}index : process to 哪一序号',
		start : '{Integer}start from 哪一序号(index)',
		// length, last 二选一。
		length : '{Integer}执行 length 次',
		last : '{Integer}执行至哪一序号(end index)',

		// 设定流程控制用 signals。
		stopped : '{Boolean}process stopped',
		finished : '{Boolean}process finished',
		terminated : '{Boolean}process terminated',

		// 设定当 handler 产生错误时，是否继续执行下去。Or stop on throw error of thread.
		skip_throw : '{Boolean}skip throw of thread'
	};

	/**
	 * 设定循序执行(serial execution) 程序，并可以作 stop, resume 等流程控制 (inter-process
	 * communication)。<br />
	 * 本函数可代替回圈操作 loop, for, setTimeout / setInterval，亦可避免长时间之回圈操作被 browser
	 * 判别为耗时 loop 而 hang 住。<br />
	 * 可视作一种 iterator / forEach()。<br />
	 * This module use asynchronous method (e.g., setTimeout) to avoid the
	 * "Script Taking Too Long" message.
	 * 
	 * TODO:<br />
	 * .result[], .next() = .step(), input array as option
	 * 
	 * <code>
	// 单 thread
	var i=0,s=0;for(;i<100;i++)s+=Math.random();alert(s);
	
	CeL.run('data.code.thread');
	// 方法1
	new CeL.Serial_execute(function(i, d) {d.s+=Math.random();}, {length: 100, first: function(d) {d.s=0;}, final: function(i, d) {alert(d.s);}});
	// 方法2
	new CeL.Serial_execute(function() {this.s+=Math.random();}, {length: 100, first: function() {this.s=0;}, final: function() {alert(this.s);}});
	 * </code>
	 * 
	 * @param {Function}loop_thread
	 *            loop_thread({Integer}process_to_index) {<br />
	 *            return<br />
	 *            'SIGABRT': terminated (accident occurred), won't run
	 *            options.final();<br />
	 *            others(!0): all done<br /> }
	 * 
	 * @param {Object}[options]
	 *            设定选项。<br /> {<br />
	 *            {String}id : process id (有设定 id 则可以从
	 *            Serial_execute.process(id) 控制。),<br />
	 *            <br />
	 *            {Integer}start : start from 哪一序号(index),<br />
	 *            {Integer}index : process to 哪一序号,<br /> // length, last 二选一。<br />
	 *            {Integer}length : 执行 length 次,<br />
	 *            {Integer}last : 执行至哪一序号(end index),<br />
	 *            <br />
	 *            argument : 传给 handler 之 arguments,<br />
	 *            {Integer}interval : 周期间隔(ms),<br />
	 *            {Function}first : run first,<br />
	 *            {Function}final : run after all, 结尾, epilogue.<br />
	 *            {Boolean}skip_throw : skip throw of thread(),<br /> }
	 * 
	 * @returns {Serial_execute}process handler
	 * 
	 * @constructor
	 * 
	 * @see http://wiki.ecmascript.org/doku.php?id=strawman:async_functions
	 *      http://support.mozilla.org/en-US/kb/warning-unresponsive-script
	 *      http://support.microsoft.com/kb/175500
	 * 
	 * @since 2012/2/3 18:38:02 初成。<br />
	 *        2012/2/4 12:31:53 包装成物件。<br />
	 *        2012/11/16 19:30:53 re-write start。<br />
	 *        2012/11/23 23:51:44 re-write finished。<br />
	 *        2013/3/3 19:20:52 重新定义 options.length。<br />
	 */
	function Serial_execute(loop_thread, options) {
		if (typeof loop_thread !== 'function')
			return;

		var tmp,
		// (private) 行程间核心 data.
		core_data = {
			start_time : new Date,
			// interval : 0,
			thread : loop_thread,
			skip_throw : false,
			count : 0
		};

		// public interface.
		// 处理初始化必要，且不允许被 loop_thread 改变的 methods/设定/状态值.
		this.get = function(name) {
			if (name in core_data)
				return core_data[name];
		};
		this.set = function(name, value) {
			if (name in Serial_execute_allow_to_set) {
				if (arguments.length > 1)
					return core_data[name] = value;
				else
					delete core_data[name];
			}
		};

		if (library_namespace.is_digits(options))
			// 当作执行次数。
			options = {
				length : options
			};
		if (Array.isArray(options))
			// 当作 Array.prototype.forEach()
			options = {
				list : options
			};

		// 处理 options 中与执行相关，且不允许被 loop_thread 改变的设定。
		if (library_namespace.is_Object(options)) {
			// 将 options 之 digits 设定 copy 到 core_data。
			library_namespace.set_method(core_data, options, [ function(key) {
				return !library_namespace.is_digits(options[key]);
			}, 'start', 'last', 'index', 'interval' ]);
			if (false)
				library_namespace.extend(
						[ 'start', 'last', 'index', 'interval' ], core_data,
						options, function(i, v) {
							return !library_namespace.is_digits(v);
						});

			if (!('last' in core_data) && options.length > 0) {
				if (!library_namespace.is_digits(core_data.start))
					core_data.start = 1;
				core_data.last = core_data.start + options.length - 1;
			}
			// 从这边起，.last 表示结束之序号。

			// 将 options 之 digits 设定 copy 到 core_data。
			library_namespace.set_method(core_data, options, [ 'skip_throw',
					'final', 'this' ]);
			if (false)
				library_namespace.extend([ 'skip_throw', 'final', 'this' ],
						core_data, options);

			if ('argument' in options)
				core_data.argument = Array.isArray(tmp = options.argument) ? tmp
						: [ tmp ];

			// data list.
			if ('list' in options)
				try {
					// check if list is an array-like object, we can use []
					// operator and .length.
					var last = options.list.length - 1, test = options.list[last];
					if (!library_namespace.is_digits(last))
						// 确认 test 会被演算。
						throw '' + test;

					// 这边不作 Array.prototype.slice.call()，让 caller 可再作更动。
					// 若希望保留 const，caller 需要自己作 Array.prototype.slice.call()。
					core_data.list = options.list;

					if (!library_namespace.is_digits(options.start))
						// 若尚未设定 .start，则定为 0。
						core_data.start = 0;

					if (!library_namespace.is_digits(core_data.last))
						core_data.last = last;

					// add an item to list.
					this.add = function(item) {
						// 为确保为 generic method，不用 .push()!
						core_data.list[++core_data.last] = item;
					};
					// 取得/设定当前 index。
					this.index = function(index) {
						if (library_namespace.is_digits(index))
							core_data.index = index;
						else
							return core_data.index;
					};

				} catch (e) {
					if (library_namespace.is_Object(options.list)) {
						// TODO
					}
				}

			if (options.record) {
				// 执行结果将会依序置于此 Array。
				core_data.result = [];
			}

			// 登记 process id.
			if (tmp = options.id) {
				if (tmp in Serial_execute_process)
					library_namespace.debug('已有相同 id (' + tmp
							+ ') 之 process 执行中!');
				else
					// 作个登记。
					Serial_execute_process[core_data.id = tmp] = this;
			}

		} else
			// 还是给予个预设值，省略判断，简化流程。
			options = {};

		// 外包裹执行绪: 可写在 prototype 中。
		this.package_thread = Serial_execute_package_thread.bind(this,
				core_data);

		// 既然首尾都设定了，自动设定 index。
		if (!library_namespace.is_digits(core_data.index)
				&& library_namespace.is_digits(core_data.start)
				&& library_namespace.is_digits(core_data.last))
			// start from 哪一序号。
			core_data.index = core_data.start;

		// 必须先执行之程序。
		tmp = options.first;
		if (typeof tmp === 'function')
			if (core_data.argument)
				tmp.apply(core_data['this'] || this, core_data.argument);
			else
				tmp.call(core_data['this'] || this, core_data);

		// 预设自动开始执行。
		if (!('autostart' in options) || options.autostart)
			setTimeout(this.package_thread, 0);
	}

	/**
	 * 取得指定 id 之控制程序。
	 */
	Serial_execute.process = function(id) {
		if (id in Serial_execute_process)
			return Serial_execute_process[id];
	};

	/**
	 * signal 定义。
	 * 
	 * @see <a href="http://en.wikipedia.org/wiki/Unix_signal"
	 *      accessdate="2012/2/4 15:35">Unix signal</a>
	 */
	Serial_execute.signal = {
		// running : 0,
		STOP : 1,
		// 结束程序。
		FINISH : 2,
		// abort
		TERMINATE : 3
	};

	/**
	 * Serial_execute controller.
	 * 
	 * @param signal
	 * @param result
	 * @returns {Serial_execute_controller}
	 */
	function Serial_execute_controller(signal, result) {
		this.signal = signal;
		if (arguments.length > 1)
			this.result = result;
	}

	Serial_execute.controller = Serial_execute_controller;

	// private: 预设外包裹执行绪。iterator.
	function Serial_execute_package_thread(data, force) {

		if (data.stopped) {
			library_namespace.debug('执行绪已被中止。欲执行请先解除暂停设置。', 1,
					'Serial_execute_package_thread');
			return;
		}

		if (data.timer_id !== undefined) {
			if (data.timer_id === is_running) {
				library_namespace.debug('执行绪正执行中，忽略本次执行要求。', 1,
						'Serial_execute_package_thread');
				return;
			}
			clearTimeout(data.timer_id);
		}
		// lock
		data.timer_id = is_running;

		var result, list = data.list, to_terminate = data.terminated, argument_array,
		// 设定是否已结束。
		to_finish = to_terminate || data.finished || data.index > data.last,
		// debug 用
		id_tag = 'process [' + data.id + '] @ ' + data.index + ' / '
				+ data.start + '-' + data.last;

		if (!to_finish) {
			// 已执行几次。在 thread 中为从 1，而非从 0 开始！
			data.count++;
			library_namespace.debug('实际执行 loop thread()。', 2,
					'Serial_execute_package_thread');

			if (list)
				list = [ list[data.index], data.index, list ];

			if (data.argument) {
				// data.argument 应为 Array。
				argument_array = data.argument;
				if (list)
					// 不动到原先的 data.argument。
					// 将 data.argument 当作最前面的 arguments，之后才填入 list 的部分。
					argument_array = argument_array.concat(list);
			} else if (list)
				// 当作 Array.prototype.forEach()
				argument_array = list;

			try {
				result = argument_array ?
				//
				data.thread.apply(data['this'] || this, argument_array) :
				//
				data.thread.call(data['this'] || this, data.index, data.count);
				library_namespace.debug('loop thread() 程序执行完毕。', 2,
						'Serial_execute_package_thread');
				if (data.result)
					data.result.push(result);

			} catch (e) {
				if (e.constructor === Serial_execute_controller) {
					// signal cache
					var signal = Serial_execute.signal;
					switch (e.signal) {
					case signal.STOP:
						library_namespace.debug('Stop ' + id_tag, 1,
								'Serial_execute_package_thread');
						data.stopped = true;
						break;
					case signal.TERMINATE:
						library_namespace.debug('Terminate ' + id_tag, 1,
								'Serial_execute_package_thread');
						to_terminate = true;
						// terminate 的同时，也设定 to_finish。
					case signal.FINISH:
						to_finish = true;
						break;
					default:
						// ignore others.
						break;
					}

					result = e.result;
					if (data.result)
						data.result.push(result);
				} else {
					library_namespace.warn(id_tag + ' failed.');
					library_namespace.error(e);
					if (!data.skip_throw)
						data.stopped = true;
				}
			}
		}

		data.index++;

		if (to_finish) {
			library_namespace.debug('执行收尾/收拾工作。', 1,
					'Serial_execute_package_thread');
			if (!to_terminate && typeof data['final'] === 'function')
				try {
					argument_array = [ data.result || data.count ];
					data['final'].apply(data['this'] || this,
							data.argument ? data.argument
									.concat(argument_array) : argument_array);
				} catch (e) {
					library_namespace.error(e);
				}

			if (data.id in Serial_execute_process)
				delete Serial_execute_process[data.id];

			data.stopped = data.finished = true;
			// TODO: delete all elements in this.
		} else if (data.stopped)
			delete data.timer_id;
		else {
			data.timer_id = setTimeout(this.package_thread, data.interval | 0);
		}

		return result;
	}
	;

	library_namespace.set_method(Serial_execute.prototype, {

		// 行程控制。
		// run, continue, resume
		start : function() {
			this.set('stopped', false);
			library_namespace.debug('Resume [' + this.get('id') + ']');
			return this.package_thread();
		},

		// pause. 中止/停止执行绪。
		stop : function() {
			this.set('stopped', true);
		},

		// next one, step, moveNext.
		next : function() {
			var result = this.start();
			this.stop();
			return result;
		},

		// set position = start.
		rewind : function() {
			this.set('index', this.get('start') || 0);
		},

		// 结束程序。
		finish : function() {
			// gettext_config:{"id":"finished"}
			this.set('finished', true);
			this.set('stopped', false);
			// return this.package_thread();
		},

		// abort (abnormal termination), remove.
		terminate : function() {
			this.set('terminated', true);
			this.set('stopped', false);
			// return this.package_thread();
		},

		// -----------------------------------------------------------------------------------------------------
		// status / property

		// 每隔多少 ms 执行一次。
		interval : function(interval_ms) {
			if (library_namespace.is_digits(interval_ms))
				this.set('interval', interval_ms);
		},

		finished : function() {
			// gettext_config:{"id":"finished"}
			return this.get('finished');
		},

		stopped : function() {
			return this.get('stopped');
		},

		argument : function() {
			if (arguments.length)
				this.set('argument', arguments.length > 1
				//
				? Array.prototype.slice.call(arguments)
				//
				: Array.isArray(argument) ? argument : [ argument ]);

			return this.get('argument');
		},

		length : function() {
			return this.get('length');
		}

	});

	_.Serial_execute = Serial_execute;

	/**
	 * <code>

	// testing for data.code.thread
	
	// adding 0 to 100.
	CeL.run('data.code.thread', function() {
		if (typeof runCode === 'object')
			runCode.setR = 0;
		p = new CeL.Serial_execute(function(i) {
			CeL.debug(this.sum += i);
		}, {
			// id : 't',
			interval : 800,
			length : 100,
			first : function() {
				this.sum = 0;
				CeL.log('Setuped.');
			},
			final : function(i) {
				CeL.log('Done @ ' + i);
			}
		});
		// p.stop();
	});
	// p.next();
	// p.terminate();
	// CeL.log(p);
	
	// adding 0 to 100.
	CeL.Serial_execute(function(data) {
		data[1] += ++data[0];
		CeL.debug(data[0]);
	}, {
		argument : [[ 0, 0 ]],
		length : 100,
		final : function(data) {
			CeL.log('done @ ' + data[0] + ' : ' + data[1]);
		}
	});
	
	//	run 100 times: 0~99.
	new CeL.Serial_execute(function(i) {
		CeL.log(i + ': ' + (this.s = (this.s || 0) + i));
	}, 100);
	
	new CeL.Serial_execute(function(i) {
		this.s = (this.s || 0) + i;
		if (i === 100) {
			CeL.log(i + ':' + this.s);
			this.finish();
		}
	});
	
	
	
	
	// 当作 Array.prototype.forEach()
	
	CeL.run('data.code.thread');
	new CeL.Serial_execute(function(item, index) {
		CeL.log(item);
	}, [2, 1, 3, 6]);


	</code>
	 */

	// ----------------------------------------------------------------------------------------------------------------------------------------------------------//
	return (_// JSDT:_module_
	);
}
