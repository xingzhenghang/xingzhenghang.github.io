﻿/**
 * @name CeL function for MediaWiki (Wikipedia / 维基百科): Page
 * 
 * @fileoverview 本档案包含了 MediaWiki 自动化作业用程式库的子程式库。
 * 
 * TODO:<code>

</code>
 * 
 * @since
 * 
 * @see https://mwn.toolforge.org/docs/interfaces/_page_.mwnpage.html
 */

// More examples: see /_test suite/test.js
// Wikipedia bots demo: https://github.com/kanasimi/wikibot
'use strict';
// 'use asm';

// --------------------------------------------------------------------------------------------

// 不采用 if 陈述式，可以避免 Eclipse JSDoc 与 format 多缩排一层。
typeof CeL === 'function' && CeL.run({
	// module name
	name : 'application.net.wiki.page.Page',

	require : 'data.code.compatibility.'
	//
	+ '|application.net.wiki.page.'
	//
	+ '|application.net.wiki.list.',

	// 设定不汇出的子函式。
	no_extend : 'this,*',

	// 为了方便格式化程式码，因此将 module 函式主体另外抽出。
	code : module_code
});

function module_code(library_namespace) {

	// requiring
	var wiki_API = library_namespace.application.net.wiki, KEY_SESSION = wiki_API.KEY_SESSION;
	// @inner
	// var get_namespace = wiki_API.namespace;

	// ------------------------------------------------------------------------

	if (false) {
		// call new_Page()
		page = wiki_session.Page(page_title);
		// {Number}p.ns
		// {String}p.title

		// await page.backlinks({get_list:true}) will get {Array}list.
		// page.backlinks() is asyncIterator
		//
		// https://www.codementor.io/@tiagolopesferreira/asynchronous-iterators-in-javascript-jl1yg8la1
		// https://stackoverflow.com/questions/55531247/using-javascripts-symbol-asynciterator-with-for-await-of-loop
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols
		// for await (const page_data of page.backlinks()) {
		// console.log(page_data); }

		// TODO:

		// typeof await(page.content() || page.read()) === 'string';

		typeof page.wikitext === 'string';

		// page.fetch() is asyncIterator 泛用方法 相当于 wiki.query()

		// page.revisions() is asyncIterator

		// typeof await(page.is_biography()) === 'boolean';
	}

	function Page(page_title, options, session) {
		this[KEY_SESSION] = session;

		// page_data 之 structure 按照 wiki API 本身之 return
		// page_data = {pageid,ns,title,revisions:[{revid,timestamp,'*'}]}
		Object.assign(this, {
			// pageid : 0,
			ns : session.namespace(page_title) || 0,
			title : session.normalize_title(page_title)
		});
	}

	// ------------------------------------------------------------------------

	function Page__list(options) {
		// options.type, options[KEY_SESSION] are setted in Page__list_async()
		var promise = new Promise(function executor(resolve, reject) {
			wiki_API.list(this.title, function(list) {
				if (list.error)
					reject(list.error);
				else
					resolve(list);
			}, options);
		}.bind(this));
		return promise;
	}

	var Symbol_asyncIterator = typeof Symbol === 'function'
			&& Symbol.asyncIterator;

	var done_object = {
		// value : generator.page_count,
		done : true
	};

	function Page__list_async(method, options) {
		var session = this[KEY_SESSION];
		options = wiki_API.add_session_to_options(session, options);
		options.type = method;
		if (!Symbol_asyncIterator || options && options.get_list) {
			return Page__list.call(this, options);
		}

		// --------------------------------------

		var list_generator = Object.create(null);
		list_generator[Symbol_asyncIterator] = (function() {
			function get_next_object() {
				return {
					value : generator.queue.shift(),
					done : false
				};
			}

			var generator = {
				queue : [],
				next : function() {
					if (generator.resolve) {
						throw new Error(
								'Call resolve() before latest promise resolved');
					}

					if (generator.queue.length > 0) {
						// 执行顺序3: 中间最多的是这个程序一直反复 loop
						return Promise.resolve(get_next_object());
					}

					// assert: generator.queue.length === 0
					if (generator.done) {
						// 执行顺序4: 最后一次 iterate
						return Promise.resolve(done_object);
					}

					// 执行顺序1
					return new Promise(function(resolve, reject) {
						generator.resolve = resolve;
					});
				}
			};

			options.for_each = function(item) {
				generator.queue.push(item);
				var resolve = generator.resolve;
				if (resolve) {
					delete generator.resolve;
					// 执行顺序2
					resolve(get_next_object());
				}
			};
			wiki_API.list(this.title, function(list) {
				// generator.page_count = list.length;
				generator.done = true;
				var resolve = generator.resolve;
				if (resolve) {
					// 基本上不会执行到这边 @ node.js
					delete generator.resolve;
					resolve(done_object);
				}
			}, options);

			return generator;
		}).bind(this);
		return list_generator;
	}

	// ------------------------------------------------------------------------

	// export 导出.

	Object.assign(wiki_API.prototype, {
		Page : function new_Page(page_title, options) {
			return new Page(page_title, options,/* session */this);
		}
	});

	wiki_API.list.type_list.forEach(function(method) {
		// if (!method.includes('all'))
		Page.prototype[method] = function Page__list_frontend(options) {
			return Page__list_async.call(this, method, options);
		};
	});

	return Page;
}
