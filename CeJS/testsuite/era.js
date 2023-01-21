'use strict';

/**
 * @memo <code>

 TODO:
 视觉化互动式史地资讯平台:整合 GIS + 视觉化年表 (e.g., HuTime)
 当年年度/每月资讯
 残历定年：允许前后一、二日误差

 图层 layer:
 +重大地震
 地震列表	https://zh.wikipedia.org/wiki/%E5%9C%B0%E9%9C%87%E5%88%97%E8%A1%A8
 +著名事件/历史大事纪年表/大事记
 与历史事件结合，能够直观的藉点取时间轴，即获得当时世界上所有已知发生之事件以及出处依据（参考文献来源、出典考据）、注解。
 台湾地方志宝鉴 http://140.112.30.230/Fangjr/
 战后台湾历史年表 http://twstudy.iis.sinica.edu.tw/twht/
 +著名人物/历史名人生辰,生卒,出生逝世年份月日@线图
 +君主

 </code>
 */

/**
 * @note <code>

 </code>
 */
if (false) {

	var g = CeL.SVG.createNode('g'), l = CeL.SVG.createNode('line', {
		x1 : 0,
		y1 : 0,
		x2 : 10,
		y2 : 30,
		stroke : '#a76',
		'stroke-width' : 1
	});
	g.appendChild(l);
	SVG_object.svg.appendChild(g);

	g.style.setProperty('display', 'none');
	g.style.setProperty('display', '');

	// http://www.w3.org/TR/SVG11/coords.html#TransformAttribute
	g.setAttribute('transform', 'translate(20,30)');

	//

	CeL.era.periods()[0].forEach(function(row) {
		row.forEach(function(country) {
			var dynasties = [];
			for ( var name in country.sub)
				dynasties.push(country.sub[name]);
			dynasties.sort(CeL.era.compare_start);
			dynasties.forEach(function(dynasty) {
				CeL.log(dynasty.toString('period'));
			});
		});
	});

	//

	'' + CeL.era.periods([ '中国', '燕国' ])[0];
}

// ---------------------------------------------------------------------//

// 2022/4/20 18:31:47 采用单一语系档，转移至系统语系档: CeJS/application/locale/resources/*.js
// 现在此处仅提供一个使用范例。
if (false) {
	// for i18n: define gettext() user domain resources path / location.
	// gettext() will auto load (CeL.env.domain_location + language + '.js').
	// e.g., resources/cmn-Hant-TW.js, resources/ja-JP.js
	CeL.env.domain_location = CeL.env.resources_directory_name + '/';
}
// declaration for gettext()
var _;

// google.load('visualization', '1', {packages: ['corechart']});
function initializer() {
	var queue = [
			[ 'interact.DOM', 'application.debug.log',
					'interact.form.select_input', 'interact.integrate.SVG',
					'data.date.era', 'application.astronomy' ],
			[ 'data.date.calendar', function() {
				// for 太阳视黄经
				CeL.VSOP87.load_terms('Earth');
				var type = CeL.get_cookie('LEA406_type');
				if (type)
					if (type === 'a' || type === 'b') {
						CeL.LEA406.default_type = type;
						CeL.info('改采 LEA-406' + type);
					} else
						CeL.warn('Invalid type: [' + type + ']');
				// for 月亮视黄经
				CeL.LEA406.load_terms('V');
				CeL.LEA406.load_terms('U');
				// for 月出月落
				CeL.LEA406.load_terms('R');

			} ], function() {
				// alias for CeL.gettext, then we can use _('message').
				_ = CeL.gettext;

				CeL.Log.set_board('panel_for_log');
				// CeL.set_debug();

				// Set a callback to run when the Google Visualization API is
				// loaded.
				// google.setOnLoadCallback(affairs);

			} ];

	if (location.protocol === 'file:') {
		// 当 include 程式码，执行时不 catch error 以作防范。
		CeL.env.no_catch = true;
	} else {
		// add some function only for web environment
	}

	// console.info('Start loading..');
	// 因为载入时间较长，使用此功能可降低反应倦怠感，改善体验。
	CeL.env.era_data_load = function(country, queue) {
		function set_done(index) {
			CeL.set_class('loading_progress' + index, {
				loading : false,
				loaded : true,
			});
		}

		if (CeL.is_Object(country)) {
			// console.info('Starting ' + queue);
			var nodes = [ {
				// gettext_config:{"id":"loading"}
				T : 'Loading...'
			} ], length = queue.length;
			if (!length)
				throw new Error('No era data got!');

			queue.forEach(function(country) {
				nodes.push({
					T : country,
					id : 'loading_progress' + --length,
					C : 'onprogress'
				});
			});
			nodes[1].C += ' loading';

			CeL.remove_all_child('loading_progress');
			CeL.new_node(nodes, 'loading_progress');

		} else if (!queue) {
			// console.info('all loaded.');
			set_done(0);
			setTimeout(affairs, 0);

		} else {
			// console.info(queue);
			set_done(queue.length);
			if (0 <= (queue = queue.length - 1))
				CeL.set_class('loading_progress' + queue, 'loading');
		}
	};

	CeL.run(queue);
}

// ---------------------------------------------------------------------//

// 年差距/位移
function Year_numbering(year_shift, year_only, has_year_0, reverse) {
	year_shift |= 0;
	if (year_only)
		return function(date) {
			var year = date.format({
				parser : 'CE',
				format : '%Y',
				no_year_0 : false
			});
			if (reverse)
				// 反向记数, reverse counting.
				year = year_shift - year;
			else
				year = year_shift + (year | 0);
			if (!has_year_0 && year <= 0)
				// 本纪元前。
				year--;
			return {
				// gettext_config:{"id":"c.-$1"}
				T : [ '约%1年', year ]
			};
		};

	return function(date, year_only) {
		if (date.精 === '年')
			year_only = true;
		date = date.format({
			parser : 'CE',
			format : '%Y/%m/%d',
			no_year_0 : false
		}).split('/');
		var year = date[0];
		if (reverse)
			// 反向记数, reverse counting.
			year = year_shift - year;
		else
			year = year_shift + (year | 0);
		if (!has_year_0 && year <= 0)
			// 本纪元前。
			year--;
		return year + (year_only ? '年' : '/' + date[1] + '/' + date[2]);
	};

	// Gregorian calendar only.
	return function(date) {
		var year = date.getFullYear() + year_shift | 0;
		if (year <= 0)
			// 纪元前。
			year--;
		return year
				+ (date.精 === '年' ? '年' : '/' + (date.getMonth() + 1) + '/'
						+ date.getDate());
	}
}

// const, include [[en:Thai (Unicode block)]]
var PATTERN_NOT_ALL_ALPHABET = /[^a-z\s\d\-,'"\u0E00-\u0E7F]/i,
//
// gettext_config:{"id":"common-era"}
CE_name = '公元', CE_PATTERN = new RegExp('^' + CE_name + '[前-]?\\d'), pin_column,
// 可选用的文字式年历栏位。
selected_columns = {
	// JDN : true,
	adjacent_contemporary : true
},
// 依特定国家自动增加这些栏。
auto_add_column = {
	中国 : [ 'Year naming/岁次', '历注/月干支', '历注/日干支' ],
	// gettext_config:{"id":"myanmar"}
	'မြန်မာ' : [ 'Gregorian reform/Great Britain', 'calendar/Myanmar' ],
	'ไทย' : [ 'Year numbering/Thai_Buddhist', 'calendar/Dai' ],
	India : [ 'calendar/Hindu' ],
	Mesopotamian : [ 'calendar/Hebrew' ],
	Egypt : [ 'calendar/Egyptian'
	// , 'calendar/Coptic'
	],
	Maya : [ 'calendar/Long_Count', 'calendar/Tzolkin', 'calendar/Haab' ]
},
// 可选用的文字式年历 title = { id : [th, function (date) {} ] }
calendar_columns, calendar_column_alias,
//
default_column = [
		{
			// gettext_config:{"id":"date-of-calendar-era"}
			T : '朝代纪年日期',
			R : 'date of calendar era: Y/m/d\nYear of ruler / month of the year / day of the month.'
		}, {
			a : {
				T : CE_name
			},
			R : 'Common Era: Y/m/d\nReform after 1582/10/4. -1: 1 BCE',
			href : 'https://en.wikipedia.org/wiki/Common_Era'
		} ];

// 承袭中历。
// gettext_config:{"id":"vietnam"}
auto_add_column.日本 = auto_add_column.한국 = auto_add_column['Việt Nam'] = auto_add_column.中国;

function pin_text(gettext) {
	// unfold / fold
	// gettext_config:{"id":"unpin"}
	var text = pin_column ? 'Unpin'
	// gettext_config:{"id":"pin"}
	: 'Pin';
	if (gettext)
		text = _(text);
	return text;
}

/**
 * 增加此栏。
 * 
 * @param {String|Array|Undefined}name
 *            可选用的文字式年历栏位名称。
 * @param {Boolean}no_jump
 *            是否重绘文字式年历。
 * @param {Boolean}to_remove
 *            是否为删除，而非添加。
 * @param {Boolean}no_warning
 *            无此栏位时不警告。例如当设定"采用历法"属性，若是无此历法则忽略之。
 * 
 * @returns {Boolean}false
 */
function add_calendar_column(name, no_jump, to_remove, no_warning) {
	if (Array.isArray(name)) {
		if (name.length > 1) {
			name.forEach(function(column) {
				add_calendar_column(column, true, to_remove, no_warning);
			});
			// 此时未判断是否有更动。
			if (!no_jump)
				translate_era();
			return false;
		}
		if (name.length !== 1)
			// name.length === 0
			return;
		name = name[0];
	}

	if ((typeof name !== 'string' || !name) && !(name = this && this.title))
		return;
	// assert: typeof name === 'string' && name !== ''

	// e.g., title="除去此栏: 东亚阴阳历/玄始历"
	if (to_remove && (name = name.match(/:\s+(.+)$/)))
		name = name[1];

	var column = name.trim();
	if (typeof to_remove !== 'boolean' && column.charAt(0) === '-')
		column = column.slice(1).trim(), to_remove = true;

	if ((column in calendar_columns)
	// get full column name
	|| (column = calendar_column_alias[column]) && (column in calendar_columns)) {
		if (to_remove)
			// 直接除掉不留。
			delete selected_columns[column];
		else
			selected_columns[column] = true;
		if (!no_jump)
			translate_era();
	} else if (!no_warning) {
		CeL.warn('add_calendar_column: Unkonwn column: [' + name + ']');
	}

	return false;
}

function remove_calendar_column(name, no_jump) {
	return add_calendar_column.call(this, name, no_jump, true);
}

// 文字式年历。 text_calendar
function show_calendar(era_name) {
	var start = new Date, era_caption,
	// 为了不更动到原先的 default_column。作 deep clone.
	title = CeL.clone(default_column, true), output = [ {
		tr : title
	} ], 前年名, 前月名, 前纪年名, 后纪年名,
	//
	main_date = CeL.era(era_name), main_date_value,
	// 取得指定纪年之文字式历谱:年历,朔闰表,历日谱。
	dates = CeL.era.dates(era_name, {
		含参照用 : PATTERN_J_translate.test(era_name),
		add_country : true,
		numeral : output_numeral
	}), is_年谱, i, j, matched, hidden_column = [], group;

	if (!dates)
		return;

	if (dates.length > show_calendar.LIMIT) {
		CeL.warn('show_calendar: 输出年段/时段纪录过长（' + dates.length
				+ ' 笔），已超过输出总笔数限制！将截取前 ' + show_calendar.LIMIT + ' 笔。');
		dates.length = show_calendar.LIMIT;
	}

	// 添加各个栏位标头。
	// 这样会依照添加进 selected_columns 的顺序显示栏位。
	for (i in selected_columns) {
		if (j = calendar_columns[i]) {
			if (typeof (j = j[0]) === 'function')
				j = j(era_name, dates);
			title.push({
				th : [ j, ' ', {
					span : '×',
					// gettext_config:{"id":"remove-the-column"}
					title : _('除去此栏') + ': ' + i,
					C : 'remove_mark',
					onclick : remove_calendar_column
				} ]
			});
		} else
			// invalid one.
			delete selected_columns[i];
	}

	for (i in calendar_columns) {
		if (!(i in selected_columns)
		// 可能有些先行占位的，因此须做检测。
		&& Array.isArray(calendar_columns[i])
		// "增加此栏"区
		&& typeof calendar_columns[i][1] === 'function') {
			j = calendar_columns[i][0];
			if (typeof j === 'function')
				j = j(era_name, dates);

			if (!j.T && j.a)
				j = j.a;
			if ((matched = i.match(/^([^\/]+)\//)) && matched[1] !== group) {
				group = matched[1];
				hidden_column.pop();
				hidden_column.push([ {
					hr : null
				}, {
					// gettext_config:{"id":"group"}
					T : '分类'
				}, ': ', {
					T : group,
					R : calendar_columns[group][0]
				}, calendar_columns[group][1] ? [ {
					span : calendar_columns[group][1],
					C : 'calendar_column_notice'
				}, {
					br : null
				} ] : ' ' ]);
			}
			hidden_column.push({
				span : j.T ? {
					T : j.T
				} : i,
				title : i,
				C : 'add_mark',
				onclick : add_calendar_column
			}, ' | ');
		}
	}
	hidden_column.pop();

	if (main_date) {
		main_date_value = new Date(main_date.getTime());
		// 转换成本地子夜时间值。
		main_date_value.setHours(0, 0, 0, 0);
		main_date_value = main_date_value.getTime();
		if (false && main_date.日 === 1 && !era_name.includes('日'))
			// 仅输入纪元名称时，不特别标示符合之栏位。
			// 但为了提醒实际转换出的结果为何者，还是强制标示。
			main_date_value = null;
	}

	// 遍历
	function add_traversal(name, is_next) {
		if (name)
			output.push({
				tr : {
					td : [
					// setup icon ⏫⏬
					is_next ? is_next === true ? {
						span : '🔽',
						R : '↓next'
					} : is_next : {
						span : '🔼',
						R : '↑previous'
					}, ' ', {
						a : name.toString(),
						title : name.toString(),
						href : '#',
						target : '_self',
						onclick : click_title_as_era
					} ],
					colspan : title.length
				}
			});
	}

	// 添加前一纪年之日期捷径。
	if (dates.previous)
		add_traversal(dates.previous);
	// 添加同一朝代共存纪年之日期捷径。
	if (main_date.共存纪年 && (i = main_date.朝代)) {
		if (Array.isArray(i))
			i = i[0];
		main_date.共存纪年.forEach(function(era_name) {
			if (era_name.toString().startsWith(i))
				add_traversal(era_name, {
					span : '↔',
					R : 'contemporary'
				});
		});
	}

	dates.forEach(function(date) {
		if (!era_caption)
			era_caption = era_name.includes(date.纪年名) ? date.纪年名
			//
			: /[\/年]/.test(era_name) ? date.纪年 : era_name;

		var tmp, matched, list = [], list_同国 = [];
		if (date.共存纪年) {
			tmp = date.国家;
			date.共存纪年.forEach(function(era, index) {
				list.push('[' + (index + 1) + ']', add_contemporary(era,
						output_numeral));
				if (tmp === era[0])
					list_同国.push('[' + ((list_同国.length / 2 | 0) + 1) + ']',
							add_contemporary(era, output_numeral));
			});
			date.共存纪年 = list;
			date.同国共存纪年 = list_同国;
			// reset
			list = [];
			list_同国 = [];
		}

		if (tmp = date.精 === '年')
			is_年谱 = true;

		var fields = CeL.era.reduce_name(date.format({
			parser : 'CE',
			format : tmp ? '%纪年名/%年|%Y'
			//
			: '%纪年名/%年/%月/%日|%Y/%m/%d',
			locale : 'cmn-Hant-TW',
			as_UTC_time : true
		})).split('|');

		var conversion = fields[0].split('/'),
		//
		纪年名_pattern = '%1 %2年',
		//
		转换用纪年名 = CeL.era.concat_name([ conversion[0], conversion[1] + '年' ]);
		if (!CeL.era.NEED_SPLIT_POSTFIX.test(conversion[0]))
			纪年名_pattern = 纪年名_pattern.replace(' ', '');

		// 后处理: 进一步添加纪年/月名之日期捷径。
		if (前年名 !== 转换用纪年名) {
			conversion[0] = {
				a : conversion[0],
				title : 前年名 = 转换用纪年名,
				href : '#',
				target : '_self',
				C : 'to_select',
				onclick : click_title_as_era
			};
			conversion[1] = Object.assign({}, conversion[0], {
				a : conversion[1]
			});
		}

		if (conversion.length > 2) {
			纪年名_pattern += '%3月%4日';
			// 月名可能会是: 正/腊/闰12/后12/Nīsannu月
			转换用纪年名 += conversion[2] + '月';
			if (前月名 !== 转换用纪年名) {
				conversion[2] = {
					a : conversion[2],
					title : 前月名 = 转换用纪年名,
					href : '#',
					target : '_self',
					C : 'to_select',
					onclick : click_title_as_era
				};
			}
		}

		conversion.unshift(_(纪年名_pattern));
		fields[0] = show_calendar.convert_field
		// 太耗资源。
		? {
			T : conversion
		} : _.apply(null, conversion);

		conversion = fields[1].split('/');
		if (conversion.length > 1) {
			// gettext_config:{"id":"$1-$2-$3"}
			纪年名_pattern = '%1/%2/%3';
		} else if (conversion[0] < 0) {
			// 转正。
			conversion[0] = -conversion[0];
			// gettext_config:{"id":"$1-bce"}
			纪年名_pattern = '%1 BCE';
		} else {
			// gettext_config:{"id":"$1-ce"}
			纪年名_pattern = '%1 CE';
		}
		conversion.unshift(_(纪年名_pattern));
		if (show_calendar.convert_field) {
			// 太耗资源。
			fields[1] = {
				T : conversion
			};
			// 后处理: 标注公历换月。
			if (conversion[3] === '1')
				fields[1].S = 'color:#f80;';

		} else {
			fields[1] = _.apply(null, conversion);
			// 后处理: 标注公历换月。
			if (conversion[3] === '1')
				fields[1] = {
					span : fields[1],
					S : 'color:#f80;'
				};
		}

		fields.forEach(function(data, index) {
			list.push({
				td : data
			});
		});

		// 增加此栏: 添加各个栏位。
		for (tmp in selected_columns) {
			if (conversion = calendar_columns[tmp]) {
				tmp = conversion[1](date) || '';
				if (tmp && tmp.S) {
					// 将 style 如 background-color 转到 td 上。
					conversion = {
						td : tmp,
						S : tmp.S
					};
					delete tmp.S;
				} else {
					conversion = {
						td : tmp
					};
				}
				list.push(conversion);
			}
		}
		// console.log(list);

		// 处理改朝换代巡览。
		var 未延续前纪年 = (后纪年名 !== date.纪年名);
		if (date.前纪年 !== 前纪年名) {
			if (未延续前纪年)
				add_traversal(date.前纪年);
			前纪年名 = date.前纪年;
		}

		tmp = [];
		if (main_date_value) {
			// 把`date`作和`main_date_value`相同的操作。
			date.setHours(0, 0, 0, 0);
			// 假如主要的日期正是这一天，那么就著上特别的颜色。
			if (main_date_value === date.getTime()) {
				tmp.push('selected');
				main_date_value = null;
			}
		}
		if (date.准 || date.精) {
			// 不确定之数值
			tmp.push('uncertain');
		}

		output.push({
			tr : list,
			C : tmp.join(' ')
		});

		if (date.后纪年 !== 后纪年名) {
			if (未延续前纪年)
				add_traversal(后纪年名, true);
			后纪年名 = date.后纪年;
		}
	});

	if (后纪年名)
		add_traversal(后纪年名, true);

	// 添加后一纪年之日期捷径。
	if (dates.next)
		add_traversal(dates.next, true);

	era_caption = era_caption ? [ '📅', {
		a : era_caption,
		title : era_caption,
		href : '#',
		target : '_self',
		C : 'to_select',
		onclick : click_title_as_era
	}, CeL.era.NEED_SPLIT_POSTFIX.test(era_caption) ? ' ' : '', {
		// gettext_config:{"id":"calendar-date"}
		T : is_年谱 ? '年谱'
		// gettext_config:{"id":"calendar-table"}
		: '历谱'
	}, ' (', {
		// gettext_config:{"id":"total-$1-time-period-records"}
		T : [ dates.type ? '共有 %1 个时段{{PLURAL:%1|纪录}}'
		// gettext_config:{"id":"total-$1-year-records"}
		: '共有 %1 个年段{{PLURAL:%1|纪录}}', dates.length ]
	}, ')' ]
	//
	: [ {
		// gettext_config:{"id":"no-calendar-to-list"}
		T : '无可供列出之历谱！',
		S : 'color:#f00;background-color:#ff3;'
	}, /[\/年]/.test(era_name) ? '' : [ {
		br : null
	}, '→', {
		a : {
			// gettext_config:{"id":"try-to-append-date"}
			T : '尝试加注日期'
		},
		href : '#',
		title : CeL.era.concat_name([ era_name,
		//
		(main_date.年 || 1) + '年', main_date.月 ? main_date.月 + '月' : '',
		//
		main_date.日 === 1 ? '' : main_date.日 ? main_date.日 + '日' : '' ]),
		onclick : click_title_as_era
	} ] ];

	title = {
		table : [ {
			caption : era_caption
		}, {
			tbody : output
		},
		],
	// , id : 'text_calendar'
		C : 'mdui-table-fluid mdui-table'
	};
	if (hidden_column.length > 0) {
		hidden_column.unshift(': ');
		title = [ {
			div : [ {
				// gettext_config:{"id":"remove-all"}
				T : '全不选',
				R : 'Remove all columns. 除去所有栏',
				onclick : function() {
					for ( var column in selected_columns)
						delete selected_columns[column];
					translate_era();
				},
				C : 'column_select_option_button',
				S : 'font-size:.7em;'
			}, {
				T : pin_text(),
				R : 'Click to pin / unpin',
				onclick : function() {
					pin_column = !pin_column;
					CeL.set_text('pin_icon', pin_column ? '🔒' : '🔓');
					this.innerHTML = pin_text(true);
				},
				C : 'column_select_option_button'
			}, {
				span : [ {
					span : '🔓',
					id : 'pin_icon'
				}, {
					// gettext_config:{"id":"add-the-column"}
					T : '增加此栏'
				} ],
				C : 'column_select_button',
				onclick : function() {
					if (CeL.toggle_display('column_to_select') === 'none') {
						CeL.set_class(this, 'shrink', {
							remove : true
						});
						pin_column = false;
					} else {
						CeL.set_class(this, 'shrink');
					}
					return false;
				}
			}, {
				span : hidden_column,
				id : 'column_to_select'
			} ],
			C : 'add_mark_layer'
		}, title ];
	}
	CeL.remove_all_child('calendar');
	CeL.new_node(title, 'calendar');
	if (pin_column)
		CeL.toggle_display('column_to_select', true);
	// text_calendar
	select_panel('calendar', true);

	CeL.debug('本次执行 [' + era_name + '] 使用时间: ' + start.age() + '。 LEA-406'
			+ CeL.LEA406.default_type);
}

show_calendar.convert_field = false;
show_calendar.LIMIT = 200;

// ---------------------------------------------------------------------//
// 开发人员使用 function。

function 压缩历数() {
	CeL.set_text('pack_result', CeL.era.pack(CeL.set_text('pack_source').trim()
	// 为方便所作的权益措施。
	.replace(/\\t/g, '\t')));
	return false;
}

function 解压缩历数() {
	var data = CeL.set_text('pack_source').trim().replace(/\\t/g, '\t').split(
			'|');

	if (data.length > 1) {
		data[2] = CeL.era.extract(data[2]);
		data = data.join('|');

	} else
		data = CeL.era.extract(data[0]);

	CeL.set_text('pack_result', data);

	return false;
}

function 解析历数() {
	var calendar = CeL.set_text('pack_source').trim().replace(/\\t/g, '\t');

	calendar = calendar.includes('|')
	// 当作纪年名
	? CeL.era.set(calendar, {
		extract_only : true
	})
	// 当作历数资料
	: CeL.era(calendar, {
		get_era : true
	});

	if (calendar && Array.isArray(calendar = calendar.calendar)) {
		calendar.forEach(function(year_data, index) {
			if (year_data.leap)
				year_data[year_data.leap] = '闰' + year_data[year_data.leap];
			calendar[index] = year_data.join('\t');
		});
		CeL.set_text('pack_result', calendar.join('\n'));
	}
	return false;
}

// ---------------------------------------------------------------------//

var era_name_classifier, MIN_FONT_SIZE = 10,
// 250: 经验值。Chrome 35 在字体太大时会化ける。
// Chrome/38 (WebKit/537.36): OK
// Chrome/40: NG @ 300.
MAX_FONT_SIZE = /WebKit/i.test(navigator.userAgent) ? 250 : Infinity;

function draw_title_era() {
	var hierarchy = this.title;
	if (hierarchy)
		hierarchy = hierarchy.split(era_name_classifier);
	draw_era(hierarchy);
	return false;
}

function set_SVG_text_properties(recover) {
	var def = document.getElementById(String(this.getAttribute('xlink:href'))
			.replace(/^#/, ''));

	if (def && this.working !==
	// 避免重复设定。
	(recover = typeof recover === 'boolean' && recover)) {
		this.working = recover;

		var def_style = def.style;
		if (recover)
			CeL.remove_all_child('era_graph_target');
		else {
			var name_showed = this.title.match(CeL.era.PERIOD_PATTERN);
			name_showed = name_showed ? '[' + _(name_showed[1]) + ']'
					: _(this.title);

			CeL.set_text('era_graph_target', name_showed);
			// 在 Firefox/36.0 中，或许因字体改变，造成 onmouseover 会执行两次。
			if (!def.base_font_size) {
				def.base_font_size = def_style['font-size'];
				def.base_color = def_style.color;
			}
			// bring to top. put it on top.
			// http://www.carto.net/papers/svg/manipulating_svg_with_dom_ecmascript/
			this.parentNode.appendChild(this);
		}
		CeL.debug((recover ? 'recover' : 'settle'), 1,
				'set_SVG_text_properties');

		var style = this.style;
		style['font-size'] = def_style['font-size']
		//
		= recover ? def.base_font_size : (3 * MIN_FONT_SIZE) + 'px';
		// '': default
		def_style['stroke'] = recover ? '' : '#000000';
		def_style.color = style.color = recover ? def.base_color : '#f00';

		if (recover)
			delete this.working;
	}
}

// Firefox/30.0 尚未支援 writing-mode。IE, Chrome 支援。
// https://bugzilla.mozilla.org/show_bug.cgi?id=145503
// https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/writing-mode
var support_writing_mode = !/Firefox/i.test(navigator.userAgent);

function recover_SVG_text_properties() {
	set_SVG_text_properties.call(this, true);
}

function date_to_loc(date, start_date) {
	var ratio = SVG_object && SVG_object.ratio;
	if (!ratio) {
		CeL.warn('date_to_loc: '
				+ (SVG_object ? '尚未设定 ratio!' : no_SVG_message));
		return;
	}

	date = (date - (start_date || SVG_object.start)) * ratio | 0;
	if (!start_date)
		// 此时取得 left，需要加上 draw_era.left。else 取得 width。
		date += draw_era.left;
	return date;
}

// ---------------------------------------------------------------------//

// area width, height.
// TODO: return [top, left, width, height]
/**
 * <code>
 show_range(CeL.era('清德宗光绪六年三月十三日'), 80, '清德宗光绪六年三月十三日');
 </code>
 */
function show_range(date_range, height_range, title, style) {
	var ratio = SVG_object && SVG_object.ratio;
	if (!ratio) {
		CeL.warn('show_range: 尚未设定 ratio!');
		return;
	}

	if (Array.isArray(date_range))
		// 不改变原 arguments。
		date_range = date_range.slice();
	else
		date_range = [ date_range ];
	if (Array.isArray(height_range))
		// 不改变原 arguments。
		height_range = height_range.slice();
	else
		height_range = [ height_range ];

	// date_range: Date
	if (date_range[1] < date_range[0]) {
		// swap date_range
		var tmp = date_range[0];
		date_range[0] = date_range[1];
		date_range[1] = tmp;
	}
	date_range[1] = date_to_loc(date_range[1], date_range[0]);
	date_range[0] = date_to_loc(date_range[0]);
	// assert: date_range = [ left, width ]

	if (CeL.is_debug(2) && (
	// 于之后
	draw_era.width <= date_range[0]
	// 于之前
	|| date_range[0] + date_range[1] <= 0))
		CeL.warn('show_range: 所欲显示之范围不在当前图表内！ [' + (title || date_range) + ']');
	height_range[0] |= 0;
	if (!(0 < height_range[0] && height_range[0] < draw_era.height))
		CeL.warn('show_range: 所欲显示之范围高度不在当前图表内！ [' + height_range + ']');

	if (show_range.min_width <= date_range[1]) {
		// height_range: px
		height_range[1] -= height_range[0];
		if (!(show_range.min_height <= height_range[1]))
			height_range[1] = show_range.min_height;

		SVG_object.addRect(date_range[1], height_range[1], date_range[0],
				height_range[0], null, 1, style && style.color || '#e92');
	} else {
		// 去掉 [1]
		date_range.length = 1;
		SVG_object.addCircle(show_range.radius, date_range[0], height_range[0],
				style && style.color || '#0f0', 1, '#f00');
	}

	var lastAdd = SVG_object.lastAdd;
	lastAdd.range = date_range[1];
	if (title)
		SVG_object.addTitle(title);

	return lastAdd;
}
// in px
show_range.radius = 3;
show_range.min_width = 3;
show_range.min_height = 3;

/**
 * 可绘制特定时段，例如展现在世期间所占比例。
 * 
 * @example <code>
 *
 add_tag('汉和帝刘肇（79年–106年2月13日）');
 add_tag('清德宗光绪六年三月十三日');

 </code>
 * 
 * @param {String}period
 * @param {Object}[data]
 * @param {String}[group]
 */
function add_tag(period, data, group, register_only, options) {
	if (!period || !(period = String(period).trim()))
		return;

	var title = '',
	//
	arg_passed = CeL.parse_period(period),
	// from date
	date = draw_era
			.get_date(Array.isArray(arg_passed) ? arg_passed[0] : period);

	if (!date) {
		// Cannot parse
		CeL.warn('add_tag: 无法解析 [' + period + ']!');
		return;
	}

	if (Array.isArray(arg_passed)) {
		// to date
		arg_passed = draw_era.get_date(arg_passed[1], true);
		if (!arg_passed) {
			CeL.warn('add_tag: 无法解析 [' + period + ']!');
			return;
		}
		// 因为是 period_end，因此须取前一单位。
		if (arg_passed.format(draw_era.date_options) === '1/1/1')
			// TODO: 以更好的方法考虑 no_year_0 的问题。
			arg_passed = '-1/12/31 23:59:59.999'.to_Date('CE');
		else
			arg_passed = new Date(arg_passed - 1);
		title = '–' + arg_passed.format(draw_era.date_options) + ', '
				+ date.age(arg_passed, options);
		arg_passed = [ [ date, arg_passed ], ,
		// , { color : '' }
		];
	} else {
		arg_passed = [ date, ,
		// , { color : '' }
		];
	}
	title = date.format(draw_era.date_options) + title;

	// 处理 title: [group] data.title \n period (date) \n data.description
	title = [ (group ? '[' + group + '] ' : '')
	//
	+ (data && (typeof data === 'string' ? data : data.title) || ''),
	//
	period === title ? period : period + ' (' + title + ')' ];
	if (data && data.description)
		title.push(data.description);
	arg_passed[2] = title.join('\n').trim();

	arg_passed.period = period;
	// arg_passed.title = title;

	if (group && (group = String(group).trim()))
		arg_passed.group = group;
	if (data)
		arg_passed.data = data;

	var target = group || draw_era.default_group;
	CeL.debug('Using group [' + target + ']', 2);
	if (!draw_era.tags[target]) {
		if (target !== draw_era.default_group)
			CeL.log('add_tag: create new group [' + target + ']');
		Object.defineProperty(
		//
		draw_era.tags[target] = Object.create(null), 'hide', {
			writable : true
		});
	}
	target = draw_era.tags[target];
	if (target[period])
		if (options && options.rename_duplicate) {
			for (var i = 0, n;;)
				if (!target[n = period + '#' + ++i]) {
					period = n;
					break;
				}
		} else if (options && typeof options.for_duplicate === 'function')
			arg_passed = options.for_duplicate(target[period], arg_passed);
		else if (CeL.is_debug()) {
			CeL.warn('add_tag: 已经有此时段存在！将跳过之，不会以新的覆盖旧的。 '
					+ (group ? '[' + group + ']' : '') + '[' + period + ']');
			return;
		}

	CeL.debug('登录 ' + (group ? '[' + group + ']' : '') + '[' + period + ']', 2,
			'add_tag');
	target[period] = arg_passed;

	if (register_only) {
		// 因为不跑 add_tag.show()，因此得登录数量。
		add_tag.group_count[group] = (add_tag.group_count[group] | 0) + 1;
	} else {
		add_tag.show(arg_passed, options);
		select_panel('era_graph', true);
	}
}

// add_tag.group_count[group] = {Integer}count
add_tag.group_count = Object.create(null);

add_tag.show = function(array_data, options) {
	if (!Array.isArray(array_data))
		// illegal data.
		return;

	var group = array_data.group || draw_era.default_group,
	// 决定高度。
	height = (10 + 20 * (add_tag.group_count[group] = (add_tag.group_count[group] | 0) + 1))
			% draw_era.height;
	if (height < 5)
		// 确定不会过小。
		height = 5;
	array_data[1] = height;

	var lastAdd = show_range.apply(null, array_data);
	if (!lastAdd)
		// no SVG support?
		return;

	// 点击后消除。
	lastAdd.style.cursor = 'pointer';
	lastAdd.onclick = options && options.onclick || add_tag.remove_self;

	// settle search id
	lastAdd.period = array_data.period;
	// lastAdd.data = array_data;
	if (array_data.group)
		lastAdd.group = array_data.group;

	return lastAdd;
};

add_tag.remove_self = function() {
	CeL.debug('去除登录 ' + (this.group ? '[' + this.group + ']' : '') + '['
			+ this.period + ']', 2, 'add_tag.remove_self');
	var target = draw_era.tags[this.group || draw_era.default_group];
	if (target)
		delete target[this.period];
	return SVG_object.removeSelf.call(this);
};

add_tag.show_calendar = function() {
	/**
	 * <code>
	 * lastAdd.period = array_data.period;
	 * </code>
	 * 
	 * @see add_tag.show
	 */
	translate_era(this.period);
};

// add_tag.load('台湾地震');
// if(add_tag.load('台湾地震', true)) return;
add_tag.load = function(id, callback) {
	var data = add_tag.data_file[id];

	if (!data) {
		CeL.error('未设定之资料图层: [' + id + ']');
		return 'ERROR';
	}
	if (callback && (typeof callback !== 'function'))
		return data.loaded;

	if (!data.loaded) {
		data.loaded = 'loading @ ' + new Date;
		// [0]: path
		CeL.run(data[0], function() {
			data.loaded = 'loaded @ ' + (new Date).format();
			if (typeof callback === 'function')
				callback(id, data);
		});
	}
};

// 将由 资源档.js 呼叫。
// 会改变 options!
add_tag.parse = function(group, data, line_separator, date_index, title_index,
		description_index, field_separator, options) {
	// 前置处理。
	if (!options)
		if (CeL.is_Object(field_separator)) {
			field_separator = (options = field_separator).field_separator;
		} else if (!field_separator && CeL.is_Object(description_index)) {
			field_separator = (options = description_index).field_separator;
			description_index = options.description_index;
		}
	if (!field_separator)
		field_separator = '\t';
	if (date_index === undefined)
		date_index = 0;
	if (title_index === undefined)
		title_index = 1;
	if (!CeL.is_Object(options))
		options = Object.create(null);
	if (!('onclick' in options))
		options.onclick = add_tag.show_calendar;

	data = data.split(line_separator || '|');
	var register_only = data.length > add_tag.parse.draw_limit;
	data.forEach(function(line) {
		if (!line)
			return;
		line = line.split(field_separator);
		var title = typeof title_index === 'function' ? title_index(line)
				: line[title_index];
		if (title)
			line.title = title;

		if (description_index !== undefined) {
			var description
			//
			= typeof description_index === 'function' ? description_index(line)
					: line[description_index];
			if (description)
				line.description = description;
		}
		add_tag(line[date_index], line, group, register_only, options);
	});
	if (register_only) {
		CeL.info('资料过多，总共' + data.length + '笔，因此将不自动显示于线图上。若手动开启显示，速度可能极慢！');
		draw_era.tags[group].hide = true;
	}

	if (calendar_columns[title_index = '资料图层/' + group]) {
		CeL.warn('已初始化过 calendar_columns。以现行配置，不应有此情形。');
		return;
	}

	var
	// copy from data.date.
	/** {Number}一整天的 time 值。should be 24 * 60 * 60 * 1000 = 86400000. */
	ONE_DAY_LENGTH_VALUE = new Date(0, 0, 2) - new Date(0, 0, 1);
	var
	// period to search
	periods = CeL.sort_periods(draw_era.tags[group], function(period) {
		return Array.isArray(period = period[0]) ? +period[0] : +period;
	}, function(period) {
		return Array.isArray(period = period[0]) ? +period[1] : +period
				+ ONE_DAY_LENGTH_VALUE;
	});
	selected_columns[title_index] = true;
	data = add_tag.data_file[group];
	calendar_columns[title_index] = [ data[2] ? {
		a : {
			T : group
		},
		href : data[2],
		R : '资料来源: ' + data[1] + (data = data[3] ? '\n' + data[3] : '')
	} : {
		T : group,
		R : '资料来源: ' + data[1] + (data = data[3] ? '\n' + data[3] : '')
	}, function(date) {
		if (/* date.准 || */date.精)
			return;

		var contemporary = periods.get_contemporary(date);
		if (!contemporary)
			return;
		var list = [];
		contemporary.forEach(function(period) {
			period = period[2].split('\n');
			// group (栏位标题, e.g., "[古籍异象] ") 已附于顶端标头，因此删除之。
			var data = period[0].replace(/^\[[^\[\]]+\]\s*/, ''),
			//
			style = period[0].length > 9 ? 'font-size:.9em;' : '';
			if (period[2]) {
				data = [ data, {
					br : null
				}, {
					span : period[2],
					C : 'description'
				} ];
			}
			list.push({
				div : data,
				C : 'data_layer_column',
				S : style
			});
		})
		return list;
	} ];
};

// 资料过多，将不自动显示于线图上。
add_tag.parse.draw_limit = 400;

// 登录预设可 include 之资料图层
add_tag.data_file = {
	// gettext_config:{"id":"lifetime-of-chinese-rulers"}
	'中国皇帝生卒' : [ CeL.env.domain_location + 'emperor.js',
	// 资料来源 title, URL, memo
	'中国皇帝寿命列表', 'https://zh.wikipedia.org/wiki/中国皇帝寿命列表', '仅列到年份，尚不够精确。' ],

	// 台湾历史地震时间轴视觉化（英文：Visulation）
	// gettext_config:{"id":"taiwan-earthquakes"}
	'台湾地震' : [ CeL.env.domain_location + 'quake.js', '台湾地震年表',
			'http://921kb.sinica.edu.tw/history/quake_history.html' ],

	'古籍异象' : [
			CeL.env.domain_location + 'abnormal.js',
			'中国古籍异象',
			'http://sciencehistory.twbbs.org/?p=982',
			'因资料数量庞大，载入与处理速度缓慢，请稍作等待。\n'
					+ '本资料档源于徐胜一教授 国科会1996年计划成果(重整中国历史时期之气候资料之「历史气候编年档」)' ]
};

// ---------------------------------------------------------------------//

/**
 * @memo <code>

 var d = show_range([ new Date(1899, 0, 1), new Date(1939, 0, 1) ], 80,
 'test block', {
 color : '#e92'
 });

 </code>
 */

/**
 * 画个简单的时间轴线图。<br />
 * TODO:<br />
 * 加上年代。<br />
 * 使用 or 扩展成甘特图 Gantt chart API。<br />
 * 
 * @param {Array}hierarchy
 *            指定之纪年层次。
 * @returns
 */
function draw_era(hierarchy) {

	// 清理场地。
	SVG_object.clean();
	delete SVG_object.start;
	CeL.remove_all_child('era_graph_target');
	add_tag.group_count = Object.create(null);

	SVG_object.hierarchy = hierarchy;
	var periods = CeL.era.periods(hierarchy, draw_era.options),
	// [ eras, blocks, 历史时期 periods ]
	count_layers = [ 0, 0, 0 ],
	//
	period_hierarchy = Array.isArray(hierarchy) && hierarchy.length > 0 ? hierarchy
			.join(era_name_classifier)
			+ era_name_classifier
			: '';

	// 尺规最小刻度宽。
	if (isNaN(draw_era.ruler_min_scale_pixel))
		// 4: 经验法则，don't know why.
		draw_era.ruler_min_scale_pixel = SVG_object.addText.defaultCharWidthPx * 4;

	if (Array.isArray(periods) && periods.length > 0) {
		var start_time = periods.start, ratio = periods.end;

		if (periods.生 || periods.卒) {
			if (draw_era.options.adapt_lifetime) {
				// 若君主在世时段于本 period 之外，则扩张范围。
				// 最起码纪年的部分都得要显现，其他只要有生或卒纪录，就尝试扩张。
				if (periods.生)
					start_time = Math.min(start_time - 0, draw_era
							.get_date(periods.生[0]) - 0);
				if (periods.卒)
					ratio = Math.max(ratio - 0,
							draw_era.get_date(periods.卒[0]) - 0);
			}
			// 以 tag 显示君主生卒标记。
			if (!periods.added && periods.生 && periods.卒) {
				periods.added = true;
				add_tag(periods.生[0] + '－' + periods.卒[0], period_hierarchy,
				// gettext_config:{"id":"lifetime-of-rulers"}
				'君主生卒', true, {
					岁 : true
				});
			}
		}

		// 登记。
		SVG_object.start = start_time;
		SVG_object.end = ratio;
		SVG_object.ratio =
		// draw era width / (时间跨度 time span)。
		ratio = draw_era.width / (ratio - start_time);

		// 前一个尺规刻度。
		var previous_ruler_scale = -Infinity,
		// 取得 period 之起始 x 座标。
		get_from_x = function(period) {
			return draw_era.left
			//
			+ (period ? (period.start - start_time) * ratio : draw_era.width);
		}, short_period = [],
		// @ periods.forEach()
		layer_count, layer_from_y, layer_height,
		// 当is_Era时，代表现在正在处理的是君主的所有纪年。这时只要第一个标示为女性，则所有的纪年都应该要为女性。
		is_女性, period_list,
		// 真正执行绘制之 function。
		draw_period = function(period, index) {
			var style, unobvious,
			// https://en.wikipedia.org/wiki/Circa
			存疑资料 = period.准 || period.精,
			//
			date_options = period.精 === '年' ? draw_era.year_options
					: draw_era.date_options,
			// IE 中，period.start 可能为 Date 或 Number。
			period_start = new Date(period.start - 0),
			// Era.name 为 Array。
			is_Era = Array.isArray(period.name),
			//
			name = is_Era ? period.name[0] : period.name,
			//
			name_showed = name.match(CeL.era.PERIOD_PATTERN),
			// 线图阶层:历史时期。
			is_历史时期 = !!(name_showed = name_showed && name_showed[1]),
			//
			from_x = get_from_x(period),
			//
			width = (period.end - period.start) * ratio,
			//
			vertical_text,
			//
			font_size;

			if (is_Era) {
				is_女性 = is_女性 || period.君主性别 && period.君主性别.includes('女');
			} else if (is_女性 = period.attributes.君主性别) {
				is_女性 = is_女性.includes('女');
			}

			// name_showed = is_历史时期 ? '[' + name_showed + ']' : name;
			if (!name_showed)
				name_showed = name;
			name_showed = _(name_showed);

			// 对纪年时间过短，太窄时，线图之处理：采垂直排列。
			vertical_text = name_showed.length > 1
					&& (support_writing_mode ? width < layer_height
					// 缩紧条件:基本上能正的看字，还是以正的为好。
					: width < layer_height / 2);

			font_size = vertical_text
			//
			? Math.min(width * .8, layer_height / name_showed.length)
			//
			: Math.min(layer_height * .8, width / name_showed.length);

			if (font_size < MIN_FONT_SIZE) {
				font_size = MIN_FONT_SIZE;
				// 难辨识、不清楚、不显著、隐晦不明显时段。
				unobvious = true;
				var duration = [ '(',
				//
				period_start.format(date_options), ];
				if (!isNaN(period.end))
					duration.push('–', (new Date(period.end - 0))
							.format(date_options));
				duration.push(') ');
				short_period.push({
					a : name_showed,
					href : '#',
					target : '_self',
					title : period_hierarchy + name,
					onclick : is_Era ? click_title_as_era : draw_title_era
				}, {
					span : duration,
					C : 'duration'
				});
			} else if (font_size > MAX_FONT_SIZE)
				font_size = MAX_FONT_SIZE;

			if (!(name in draw_era.date_cache) && !isNaN(period.end)) {
				var end_time = new Date(period.end - 0);
				// 警告: .setDate(-1) 此为权宜之计。
				end_time.setDate(end_time.getDate() - 1);
				draw_era.date_cache[name] = {
					start : period_start.format(date_options),
					end : end_time.format(date_options)
				};
			}

			var duration = CeL.age_of(period.start, period.end);
			SVG_object.addRect(width, layer_height, from_x, layer_from_y, null,
					1, 存疑资料 ? '#ddd' : unobvious ?
					// 此处需要与 #era_graph_unobvious 之
					// background-color 一致。
					'#ffa' : is_历史时期 ? '#afa' : is_女性 ? '#fce' : '#ddf')
			//
			.addTitle(name + ' (' + duration + ')');

			// 绘制/加上时间轴线图年代刻度。
			if (
			// 尺规最小刻度宽。
			draw_era.ruler_min_scale_pixel
			// 测试本尺规刻度与上一尺规刻度距离是否过密。
			< from_x - previous_ruler_scale
			// 测试本尺规是否过窄。
			&& draw_era.ruler_min_scale_pixel
			//
			< get_from_x(period_list[index + 1]) - from_x)
				SVG_object.addText(period_start.format(
				//
				period.精 === '年' ? draw_era.ruler_date_year_options
						: draw_era.ruler_date_options),
						previous_ruler_scale = from_x, layer_from_y
								+ SVG_object.addText.defaultCharWidthPx * 2, {
							color : '#f42'
						});

			// TODO:
			// https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/SVG_Image_Tag

			style = {
				color : 存疑资料 ? '#444' : layer_count === 1 ? '#15a' : '#a2e',
				cursor : 'pointer',
				// 清晰的小字体
				'font-family' : '标楷体,DFKai-SB',
				'font-size' : font_size + 'px'
			};
			if (vertical_text && support_writing_mode
			// 若全部都是英文字母，则以旋转为主。
			&& PATTERN_NOT_ALL_ALPHABET.test(name_showed)) {
				// top to bottom
				style['writing-mode'] = 'tb';
				// no rotation
				style['glyph-orientation-vertical'] = 0;

				// 置中: x轴设在中线。
				SVG_object.addText(name_showed, from_x + width / 2,
						layer_from_y
								+ (layer_height - name_showed.length
										* font_size) / 2, style);
			} else {
				// 置中
				SVG_object.addText(name_showed, from_x
						+ (width - name_showed.length * font_size) / 2,
				// .7:
				// 经验法则，don't know why.
				layer_from_y + (layer_height + font_size * .7) / 2, style);

				if (vertical_text)
					// 文字以方块的中心为原点，顺时针旋转90度。
					SVG_object.lastAdd.setAttribute('transform', 'rotate(90 '
							+ (from_x + width / 2) + ' '
							+ (layer_from_y + layer_height / 2) + ')');
			}
			SVG_object.addTitle(name + ' (' + duration + ')');

			var lastAdd = SVG_object.lastAdd;
			if (font_size === MIN_FONT_SIZE) {
				lastAdd.title = name;
				lastAdd.onmouseover
				//
				= set_SVG_text_properties;
				lastAdd.onmouseout
				//
				= recover_SVG_text_properties;
			}

			if (!lastAdd.dataset)
				// 目前仅 Chrome 支援。
				lastAdd.dataset = Object.create(null);
			lastAdd.dataset.hierarchy
			//
			= period_hierarchy + name;
			lastAdd.onclick
			//
			= is_Era ? draw_era.click_Era : draw_era.click_Period;
			count_layers[is_Era ? 0 : is_历史时期 ? 2 : 1]++;
		};

		periods.forEach(function(region) {
			layer_count = region.length;
			layer_from_y = draw_era.top;
			layer_height = draw_era.height / layer_count;

			region.forEach(function(pl) {

				(period_list = pl).forEach(draw_period);

				layer_from_y += layer_height;
			});
		});

		draw_era.last_hierarchy = hierarchy;

		if (period_hierarchy = short_period.length > 0) {
			short_period.unshift({
				// 过短纪年
				// gettext_config:{"id":"unobvious-periods"}
				T : '难辨识时段：'
			});
			// 清理场地。
			CeL.remove_all_child('era_graph_unobvious');
			CeL.new_node(short_period, 'era_graph_unobvious');
		}
		CeL.toggle_display('era_graph_unobvious', period_hierarchy);
	}

	draw_era.draw_navigation(hierarchy, undefined, count_layers);

	// -----------------------------

	// 绘制额外图资。
	if (CeL.is_Object(draw_era.tags)) {
		periods = [];
		for ( var group in draw_era.tags) {
			CeL.debug('Draw group: [' + group + ']', 2);
			var data = draw_era.tags[group];
			if (!data.hide)
				for ( var period in data)
					add_tag.show(data[period]);
			periods.push({
				b : [ group === draw_era.default_group ? [ '(', {
					// gettext_config:{"id":"general-data-layer"}
					T : 'general data layer'
				}, ')' ] : {
					T : group
				}, {
					span : add_tag.group_count[group] || '',
					C : 'count'
				} ],
				R : group,
				C : data.hide ? 'hide' : '',
				onclick : function() {
					var data = draw_era.tags[this.title];
					data.hide = !data.hide;
					draw_era.redraw();
					return false;
				}
			});
		}

		if (period_hierarchy = periods.length > 0) {
			periods.unshift({
				// gettext_config:{"id":"data-layer"}
				T : '资料图层',
				title : '点击以设定资料图层',
				onclick : function() {
					select_panel('configuration', true);
					return false;
				},
				S : 'cursor: pointer;'
			}, ' :');
			// 清理场地。
			CeL.remove_all_child('data_layer_menu');
			CeL.new_node(periods, 'data_layer_menu');
		}
		CeL.toggle_display('data_layer_menu', period_hierarchy);
	} else {
		CeL.debug('No group found.', 2);
	}
}

draw_era.options = {
	merge_periods : true
};

draw_era.redraw = function() {
	draw_era(SVG_object.hierarchy);
};

draw_era.get_date = function(date, period_end) {
	var matched = date.match(CeL.String_to_Date.parser_PATTERN),
	//
	options = {
		date_only : true,
		period_end : period_end
	};
	if (matched && (matched[1] in CeL.String_to_Date.parser))
		return CeL.String_to_Date.parser[matched[1]](matched[2], 0, options);
	return CeL.era(date, options);
};

// click and change the option of this.title
draw_era.change_option = function() {
	var option = this.title.replace(/\s[\s\S]*/, ''), configured = draw_era.options[option];
	// reset option status
	CeL.set_class(this, 'configured', {
		remove : configured
	});
	draw_era.options[option] = !configured;
	draw_era.redraw();
	return false;
};

draw_era.default_group = '\n';
// draw_era.tags[group][period] = [ date_range, height_range, title, style ];
draw_era.tags = Object.create(null);

draw_era.draw_navigation = function(hierarchy, last_is_Era, count_layers) {
	var period_hierarchy = '',
	//
	navigation_list = [ {
		// gettext_config:{"id":"navigation"}
		T : '导览列：'
	}, {
		a : {
			// gettext_config:{"id":"all-countries"}
			T : '所有国家'
		},
		href : '#',
		target : '_self',
		onclick : draw_title_era
	} ];

	if (Array.isArray(hierarchy))
		hierarchy.forEach(function(name, index) {
			period_hierarchy += (period_hierarchy ? era_name_classifier : '')
					+ name;
			var name_showed = name.match(CeL.era.PERIOD_PATTERN);
			name_showed = name_showed ? '[' + _(name_showed[1]) + ']'
			//
			: _(name);

			navigation_list.push(' » ', last_is_Era
					&& index === hierarchy.length - 1 ? {
				span : name_showed,
				title : period_hierarchy
			} : {
				a : name_showed,
				href : '#',
				target : '_self',
				title : period_hierarchy,
				onclick : draw_title_era
			});
			if (name in draw_era.date_cache) {
				name = draw_era.date_cache[name];
				navigation_list.push(' (', {
					a : name.start,
					href : '#',
					target : '_self',
					title : name.start,
					onclick : draw_era.click_navigation_date
				}, {
					span : '–',
					// e.g., 国祚
					title : name.start.to_Date({
						parser : 'CE',
						year_padding : 0
					}).age(name.end.to_Date({
						parser : 'CE',
						year_padding : 0
					}))
				}, {
					a : name.end,
					href : '#',
					target : '_self',
					title : name.end,
					onclick : draw_era.click_navigation_date
				}, ')');
			}
		});

	if (count_layers && count_layers.sum() > 2)
		// 在导览列记上纪年/国家/君主/历史时期数量。
		Array.prototype.push.apply(navigation_list, count_layers.map(function(
				count, index) {
			return count > 0 ? {
				T : [ draw_era.draw_navigation.count_title[index], count ],
				C : 'era_graph_count'
			} : '';
		}));

	// 清理场地。
	CeL.remove_all_child('era_graph_navigation');
	CeL.new_node(navigation_list, 'era_graph_navigation');
};
// [ 纪年 eras, blocks (国家/君主), 历史时期 periods ]
draw_era.draw_navigation.count_title = [ '%1 eras', '%1 blocks', '%1 periods' ];

draw_era.click_navigation_date = function() {
	era_input_object.setValue(this.title);
	// gettext_config:{"id":"contemporary-period"}
	output_format_object.setValue('共存纪年');
	translate_era();
	return false;
};

draw_era.click_Era = function() {
	var hierarchy = this.dataset.hierarchy.split(era_name_classifier)
	// 去除"时期"如 "period:~"
	// e.g., 处理太平天囯时，因为其属大清时期，惟另有大清政权，因此若未去除时期，将无法解析"大清太平天囯"。
	.filter(function(name) {
		// 若有 '' 将导致空的索引。不如直接去除。
		return name && !CeL.era.PERIOD_PATTERN.test(name);
	});
	var era = CeL.era(hierarchy.join('' /* or use ' ' */));
	draw_era.draw_navigation(hierarchy, true);

	era_input_object.setValue(CeL.era.reduce_name(era.format({
		format : era.精 === '年' ? '%纪年名 %年年' : '%纪年名 %年年%月月%日日',
		locale : 'cmn-Hant-TW'
	})));
	translate_era();
	return false;
};

draw_era.click_Period = function() {
	draw_era(this.dataset.hierarchy.split(era_name_classifier));
	select_panel('era_graph', true);
	return false;
};

// 定义绘制范围。
draw_era.left = 10;
draw_era.top = 0;
draw_era.width = 1000;
draw_era.height = 400;
// 底部预留高度。
draw_era.bottom_height = 0;

draw_era.date_options = {
	parser : 'CE',
	format : '%Y/%m/%d'
};
draw_era.year_options = {
	parser : 'CE',
	format : '%Y'
};

draw_era.ruler_date_options = {
	parser : 'CE',
	format : '%Y.%m'
};
draw_era.ruler_date_year_options = {
	parser : 'CE',
	format : '%Y'
};

draw_era.date_cache = Object.create(null);

// ---------------------------------------------------------------------//

var last_selected, select_panels = {
	// 查询范例
	// gettext_config:{"id":"example"}
	example : '测试范例',
	// 之前输入资料
	// gettext_config:{"id":"record"}
	input_history : '输入纪录',

	// concept:'工具说明',
	// 使用技巧
	// gettext_config:{"id":"concept"}
	FAQ : '使用说明',

	// gettext_config:{"id":"timeline"}
	era_graph : '纪年线图',
	// 年表
	// gettext_config:{"id":"calendar-table"}
	calendar : '历谱',
	// gettext_config:{"id":"configuration"}
	configuration : '设定',
	// 整批转换
	// gettext_config:{"id":"batch"}
	batch_processing : '批次转换',
	// gettext_config:{"id":"tagging"}
	tag_text : '标注文本',
	// gettext_config:{"id":"development"}
	pack_data : '历数处理',
	// gettext_config:{"id":"feedback"}
	comments : '问题回报'
};

function select_panel(id, show) {
	if (!(id in select_panels))
		return;

	if (last_selected === id) {
		show = CeL.toggle_display(last_selected, show) === 'none';
		CeL.set_class(last_selected + click_panel.postfix, 'selected', {
			remove : show
		});
		if (show)
			last_selected = null;
		return;
	}

	if (last_selected) {
		CeL.toggle_display(last_selected, false);
		CeL.set_class(last_selected + click_panel.postfix, 'selected', {
			remove : true
		});
	}

	CeL.set_class(id + click_panel.postfix, 'selected');
	CeL.toggle_display(last_selected = id, true);
}

click_panel.postfix = '_panel';
click_panel.postfix_RegExp = new RegExp(click_panel.postfix + '$');
function click_panel(e) {
	select_panel(this.id.replace(click_panel.postfix_RegExp, ''));
	return false;
}

// ---------------------------------------------------------------------//

var original_input, era_input_object, last_input, output_numeral, SVG_object, output_format_object,
// 正解
output_format_types = {
	// gettext_config:{"id":"date-of-common-era"}
	'公元日期' : CE_name + '%Y年%m月%d日',
	// gettext_config:{"id":"date-of-calendar-era"}
	'朝代纪年日期' : '%纪年名%年年%月月%日日',
	// gettext_config:{"id":"contemporary-period"}
	'共存纪年' : '共存纪年',
	// gettext_config:{"id":"stem-branches"}
	'年月日干支' : '%年干支年%月干支月%日干支日',
	'年月日时干支' : '%年干支年%月干支月%日干支日%时干支时',
	// gettext_config:{"id":"four-pillars"}
	'四柱八字' : '%八字',
	// 'Julian Day' : 'JD%JD',
	// gettext_config:{"id":"julian-day-number"}
	'Julian Day Number' : 'JDN%JDN'
};

function input_era(key) {
	CeL.log(key + ',' + list + ',' + force);
	original_input.apply(this, arguments);
}

var 准确程度_MESSAGE = {
	传说 : '为传说时代之资料'
},
// Japan convert
J_translate = {
	R : '令和',
	H : '平成',
	S : '昭和',
	T : '大正',
	M : '明治'
}, PATTERN_J_translate = new RegExp(Object.values(J_translate).join('|')),
// http://maechan.net/kanreki/index.php
// 和暦入力时の元号は、『明治』『大正』『昭和』『平成』に限り、各々『M』『T』『S』『H』の头文字でも入力できます。
// e.g., "H30.4.30"
// [ all, イニシャル/略号, year, left ]
PATTERN_J_prefix = new RegExp('^([' + Object.keys(J_translate).join('')
		+ '])\\s*(\\d{1,2})(\\D.*)?$', 'i'),
//
country_color = {
	中国 : '#dd0',

	日本 : '#9cf',
	// 天皇 : '#9cf',

	한국 : '#ccf',
	// 朝鲜 : '#ccf',
	// 新罗 : '#ccf',
	// 百济 : '#ccf',
	// 高句丽 : '#ccf',
	// 高丽 : '#ccf',
	// 대한민국 : '#ccf',
	// '일제 강점기' : '#ccf',
	// 조선주체연호 : '#ccf',

	// gettext_config:{"id":"vietnam"}
	'Việt Nam' : '#9f9',
// 越南 : '#9f9',
// 黎 : '#9f9',
// 阮 : '#9f9',
// 莫 : '#9f9'
}, had_inputted = Object.create(null), country_PATTERN;

(function() {
	country_PATTERN = [];
	for ( var n in country_color)
		country_PATTERN.push(n);
	country_PATTERN = new RegExp('(' + country_PATTERN.join('|') + ')', 'i');
})();

// 添加共存纪年。
function add_contemporary(era, output_numeral) {
	if (!Array.isArray(era))
		era = [ , era ];
	var matched, node = output_numeral === 'Chinese' ? CeL
			.to_Chinese_numeral(era[1].toString()) : era[1].toString();
	node = {
		a : era[1].疑 || era[1].传说 ? {
			span : node + '<sub>('
			// 特别标示存在疑问、不准确的纪年。
			+ (era[1].疑 ? '疑' : '传说') + ')</sub>',
			R : '存在疑问、不准确的纪年',
			S : 'color: #777;'
		} : node,
		title : era[1].toString(),
		href : '#',
		target : '_self',
		onclick : click_title_as_era,
		// gettext_config:{"id":"contemporary-period"}
		C : '共存纪年',
	};
	if (era[0] in country_color)
		matched = era[0];
	else if (false && (matched = era[1].match(country_PATTERN)))
		matched = matched[1];
	if (matched) {
		node.S = 'background-color: ' + country_color[matched] + ';';
	}
	return node;
}

// 国旗
var national_flags = {},
// country codes
国家_code = {
	中国 : 'zh',
	English : 'en',
	日本 : 'ja',
	ไทย : 'th',
// 不列其他国家，如越南尚应以中文 Wikipedia 为主，因其过去纪年原名采用汉字。
// 直到当地 Wikipedia 全面加入纪年使用当时之原名，且资料较中文 Wikipedia 周全时，再行转换。
};

/** {Boolean}标记当下正在处理的纪年。 */
translate_era.draw_recent_era = true;

// @see copy_attributes @ CeL.data.date.era.sign_note
function translate_era(era) {

	// add 文字式年历注解
	function add_注(key, name, add_node) {
		function add_item(note, index) {
			output.push({
				br : null
			}, typeof name === 'object' && name || {
				T : name || key
			});
			if (0 < index)
				output.push(' ' + (index + 1));
			if (note) {
				if (typeof note === 'string') {
					note = note
							.replace(/\n/g, '<br />')
							.replace(
									// @see PATTERN_URL_WITH_PROTOCOL_GLOBAL
									// @ CeL.application.net.wiki
									/\[((?:https?|ftp):\/\/(?:[^\0\s\|<>\[\]{}\/][^\0\s\|<>\[\]{}]*)) ([^\[\]]+)\]/ig,
									function(all, URL, text) {
										return '<a href="' + URL
												+ '" target="_blank">'
												+ text.trim() + '</a>';
									});
				}
				if (add_node) {
					note = typeof add_node === 'function' ? add_node(note)
							: add_node;
				}
				output.push(':', {
					span : ' ',
					C : 'note'
				}, {
					span : CeL.era.to_HTML(note),
					C : 'note'
				});
			}
		}

		if (key === true) {
			if (!Array.isArray(output))
				output = [ output ];
			add_item(true);
		}

		if (date[key] || add_node === true) {
			if (!Array.isArray(output))
				output = [ output ];
			if (Array.isArray(date[key]))
				date[key].forEach(add_item);
			else
				add_item(date[key]);
		}
	}

	function add_注_link(note) {
		return {
			a : note,
			href : 'https://'
					+ (国家_code[date.国家] || (PATTERN_NOT_ALL_ALPHABET.test(note)
					// 预设： 中文 Wikipedia
					? 'zh' : 'en')) + '.wikipedia.org/wiki/'
					+ encodeURIComponent(note),
			C : 'note'
		};
	}

	if (!era && !(era = era_input_object.setValue())) {
		era = (new Date).format('%Y/%m/%d');
		// CeL.era('') 解析出来包含时间，可能造成日期不一致的问题。
		// 例如在中午打开本网页、直接按下"共存纪年"的情况。
	}

	era = era.trim();

	var output, date;
	if (('era_graph' in select_panels) && CeL.parse_period.PATTERN.test(era))
		return add_tag(era);

	if (translate_era.draw_recent_era)
		add_tag(era);

	// 前置处理。

	if (date = era.match(PATTERN_J_prefix))
		era = J_translate[date[1]] + date[2] + (date[3] || '年');

	date = CeL.era(era, {
		// 寻精准 : 4,
		numeral : output_numeral,
		add_country : true
	});
	if (date) {
		set_era_by_url_data(era);

		output = date.历法 || {
			// gettext_config:{"id":"france"}
			France : 'France',
			// gettext_config:{"id":"great-britain"}
			British : 'Great Britain',
			// gettext_config:{"id":"spain"}
			España : 'Spain'
		}[date.国家];
		if (output && !(output in had_inputted)) {
			add_calendar_column(output.includes(';') ? output.split(';')
					: output, true, false, true);
			had_inputted[output] = true;
		}

		output = date.国家;
		if (!(output in had_inputted)) {
			// 依特定国家自动增加这些栏。
			if (auto_add_column[output])
				add_calendar_column(auto_add_column[output], true);
			had_inputted[output] = true;
		}

		if (date.纪年名)
			// 因为纪年可能横跨不同时代(朝代)，因此只要确定找得到，那就以原先的名称为主。
			show_calendar(era);

		var format = output_format_object.setValue();
		if (!format) {
			format = output_format_object.setValue(
			// '%Y年'.replace(/-(\d+年)/, '前$1')
			CE_name + '%Y年'.replace(/^-/, '前')
					+ (date.精 === '年' ? '' : '%m月%d日'));
		}

		// gettext_config:{"id":"contemporary-period"}
		if (format === '共存纪年')
			if (Array.isArray(output = date.共存纪年))
				output.forEach(function(era, index) {
					output[index] = [ ' [' + (index + 1) + '] ',
							add_contemporary(era, output_numeral) ];
				});
			else
				output = {
					span : '无共存纪年',
					C : 'fadeout'
				};

		else {
			// get the result
			output = date.format({
				parser : 'CE',
				format : format,
				locale : 'cmn-Hant-TW',
				numeral : output_numeral,
				as_UTC_time : true
			});
			if (output_numeral === 'Chinese')
				output = CeL.to_Chinese_numeral(output);
			output = output.replace(/-(\d+年)/, '前$1');
			if (output !== era) {
				output = {
					a : output,
					title : (CE_PATTERN.test(output) ? '共存纪年:' : '') + output,
					href : '#',
					target : '_self',
					onclick : click_title_as_era
				};
			}
		}

		// -----------------------------
		// 显示其他与本纪年相关的注解与属性。

		// 还需要更改 ((sign_note.copy_attributes))!
		add_注('历法', [ '📅', {
			// gettext_config:{"id":"calendar-used"}
			T : '采用历法'
		} ], function(历法) {
			return {
				a : 历法,
				href : '#',
				title : 历法,
				onclick : add_calendar_column
			};
		});
		// 📚
		add_注('据', [ '📜', {
			// gettext_config:{"id":"data-source"}
			T : '出典'
		} ]);

		var is_女性 = date.君主性别 && date.君主性别.includes('女'),
		// 君主名号 👸 🤴 👸🏻 🤴🏻 👸🏼 🤴🏼 👸🏽 🤴🏽 👸🏾 🤴🏾 👸🏿 🤴🏿
		// 👨 👩
		// 名字徽章 📛 🏷 🆔
		君主姓名_label = [ is_女性 ? '👸🏻' : '🤴🏻', {
			// gettext_config:{"id":"personal-name"}
			T : '君主名'
		} ];
		// gettext_config:{"id":"personal-name"}
		add_注('君主名', 君主姓名_label, add_注_link);
		if (date.ruler) {
			add_注('君主', 君主姓名_label, add_注_link);
			add_注('ruler', 君主姓名_label, add_注_link);
		}
		// gettext_config:{"id":"courtesy-name"}
		add_注('表字');
		// gettext_config:{"id":"art-name"}
		add_注('君主号', null, add_注_link);
		// gettext_config:{"id":"true-name"}
		add_注('讳', [ is_女性 ? '👸🏻' : '🤴🏻', {
			a : {
				T : '讳'
			},
			href : 'https://zh.wikipedia.org/wiki/名讳'
		} ], add_注_link);
		if (Array.isArray(date.name) && date.name[1]
				&& date.name[1].includes('天皇'))
			// append name.
			if (Array.isArray(date.谥))
				// 不动到原 data。
				(date.谥 = date.谥.slice()).unshift(date.name[1]);
			else
				date.谥 = date.谥 ? [ date.name[1], date.谥 ] : [ date.name[1] ];
		// gettext_config:{"id":"posthumous-name"}
		add_注('谥', [ is_女性 ? '👼🏻' : '👼🏻', {
			a : {
				// 谥号
				// gettext_config:{"id":"posthumous-name"}
				T : '谥'
			},
			href : 'https://zh.wikipedia.org/wiki/谥号'
		} ], add_注_link);
		// gettext_config:{"id":"temple-name"}
		add_注('庙号', [ is_女性 ? '👸🏻' : '🤴🏻', {
			a : {
				// gettext_config:{"id":"temple-name"}
				T : '庙号'
			},
			href : 'https://zh.wikipedia.org/wiki/庙号'
		} ]);
		// for 琉球国
		add_注('童名');
		add_注('神号');
		// 君主资料
		add_注('生', [ '🎂', {
			// gettext_config:{"id":"born"}
			T : '出生'
		} ], function(note) {
			return {
				a : note,
				title : '共存纪年:' + note,
				href : '#',
				onclick : click_title_as_era,
				C : 'note'
			};
		});
		add_注('卒', [ '⚰️', {
			// gettext_config:{"id":"died"}
			T : '逝世'
		} ], function(note) {
			return {
				a : note,
				title : '共存纪年:' + note,
				href : '#',
				onclick : click_title_as_era,
				C : 'note'
			};
		});
		// TODO: 终年/享年/享寿/寿命/年龄

		// gettext_config:{"id":"reign"}
		add_注('在位', [ '👑', {
			// gettext_config:{"id":"reign"}
			T : '在位'
		} ], function(note) {
			return {
				a : note,
				href : '#',
				title : note,
				onclick : click_title_as_era
			};
		});
		add_注('加冕', [ '👑', {
			// gettext_config:{"id":"coronation"}
			T : '加冕'
		} ]);

		if (date.前任) {
			add_注('前任', [ '🔼', {
				// gettext_config:{"id":"predecessor"}
				T : '前任'
			} ]);
		} else if (date.name.前任) {
			add_注(true, [ '🔼', {
				// gettext_config:{"id":"predecessor"}
				T : '前任'
			} ], {
				a : /* date.name.前任[2] + */date.name.前任[1],
				href : '#',
				title : date.name.前任.slice(1).reverse().join(''),
				onclick : click_title_as_era
			});
		}
		if (date.继任) {
			add_注('继任', [ '🔽', {
				// gettext_config:{"id":"successor"}
				T : '继任'
			} ]);
		} else if (date.name.继任) {
			add_注(true, [ '🔽', {
				// gettext_config:{"id":"successor"}
				T : '继任'
			} ], {
				a : /* date.name.继任[2] + */date.name.继任[1],
				href : '#',
				title : date.name.继任.slice(1).reverse().join(''),
				onclick : click_title_as_era
			});
		}

		add_注('父', [ '👨', {
			// gettext_config:{"id":"father"}
			T : '父亲'
		} ]);
		add_注('母', [ '🤱', {
			// gettext_config:{"id":"mother"}
			T : '母亲'
		} ]);

		add_注('配偶', [ is_女性 ? '🤵‍♂️' : '👰‍♀️', {
			// gettext_config:{"id":"spouse"}
			T : '配偶'
		} ]);

		// 📓
		add_注('注', [ '📝', {
			T : '注'
		} ]);

		if (Array.isArray(date.name)) {
			// gettext_config:{"id":"timeline"}
			add_注('纪年线图', {
				a : [ '📊', {
					// gettext_config:{"id":"showing-timeline"}
					T : '展示线图'
				} ],
				D : {
					hierarchy : date.name.slice(0, 4).reverse().slice(0, -1)
							.join('/')
				},
				href : '#',
				onclick : draw_era.click_Period,
				S : 'cursor:pointer;background-color:#ffa;color:#a26;'
			}, true);
		}

		if (date.准 || date.精 || date.传说) {
			if (!Array.isArray(output))
				output = [ output ];
			output.unshift({
				em : [ '此输出值', date.疑 ? '尚存有争议或疑点，' : '',
				//
				date.传说 ? 准确程度_MESSAGE['传说'] + '，'
				// @see 这里会设定如 era.准 = "疑"
				: date.准 === '疑' || date.准 === '传说' ? ''
				//
				: '仅约略准确至' + (date.准 || date.精)
				//
				+ (/^\d+[年月日]$/.test(date.准 || date.精) ? '前后，' : '，'),
						'仅供参考非已确认之实历： ' ]
			});
		}

		// -----------------------------

		CeL.remove_all_child('era_output');
		CeL.new_node(output, 'era_output');
		CeL.era.setup_nodes(null, {
			add_date : true,
			onclick : parse_text.onclick
		});

	}

	if (era && era !== last_input) {
		CeL.new_node({
			div : [ date ? '✔️' : '❌', {
				a : last_input = era,
				title : era,
				href : '#',
				target : '_self',
				onclick : click_title_as_era
			} ]
		}, 'input_history');
	}
}

// ---------------------------------------------------------------------//

/**
 * 当点击网页元素(this)时，将此元素的标题(this.title)当作纪年名称来处理。
 */
function click_title_as_era() {
	var era = String(this.title), matched = era.split(':');
	if (matched && matched.length === 2
	//
	&& (matched[0] = matched[0].trim())
	//
	&& (matched[1] = matched[1].trim())) {
		era = matched[1];
		// set output format
		matched = matched[0];
		if (matched in output_format_types)
			matched = output_format_types[matched];
		output_format_object.setValue(matched).replace(/-(\d+年)/, '前$1');
	}

	era_input_object.setValue(era);
	translate_era(era);
	return false;
}

// ---------------------------------------------------------------------//

function 批次转换() {
	var date, count = 0, data = CeL.set_text('batch_source').trim().split('\n'),
	//
	prefix = CeL.set_text('batch_prefix'),
	//
	format = output_format_object.setValue(),
	//
	period_end = CeL.set_text('batch_period_end') === '结束';
	if (!format)
		format = output_format_object.setValue('%Y/%m/%d');
	// gettext_config:{"id":"contemporary-period"}
	if (format !== '共存纪年')
		format = {
			parser : 'CE',
			format : format,
			locale : 'cmn-Hant-TW',
			numeral : output_numeral,
			as_UTC_time : true
		};
	// 开始转换。
	data.forEach(function(line, index) {
		if ((line = line.trim()) && (date = CeL.era(prefix + line, {
			period_end : period_end
		}))) {
			count++;
			// gettext_config:{"id":"contemporary-period"}
			data[index] = format === '共存纪年' ? date.共存纪年 || '' : date
					.format(format);
		}
	});
	CeL.set_text('batch_result', data.join('\n'));
	CeL.log('共转换 ' + count + '/' + data.length + ' 笔。');
	return false;
}

// ---------------------------------------------------------------------//

function parse_text(text, node) {
	if (!CeL.era)
		return false;

	if (text)
		CeL.set_text('original_text', text);
	else
		text = CeL.set_text('original_text');

	// 标注文本 点击(点选解析)功能。
	CeL.era.to_HTML(text, node || 'parsed_text', {
		add_date : parse_text.add_date,
		onclick : parse_text.onclick
	});

	return false;
}

// parse_text.add_date = true;

parse_text.onclick = function() {
	var era = CeL.era.node_era(this, 'String');
	if (era) {
		era = CeL.era.reduce_name(era.to_Date('era').format({
			parser : 'CE',
			format : '%纪年名 %年年%月月%日日',
			locale : 'cmn-Hant-TW'
		}));
		era_input_object.setValue(era);
		translate_era(era);
	} else
		CeL.warn('解析结果为 [' + era + ']');

	return false;
};

function parsed_text_set_date(add_date) {
	CeL.get_element('parsed_text_add_date').innerHTML
	//
	= (parse_text.add_date = typeof add_date === 'boolean' ? add_date
			: !parse_text.add_date) ? '<em>添加</em>' : '不添加';
	return false;
}

// ---------------------------------------------------------------------//

var set_era_by_url_data_running;
// 依 location.hash 显示相应的纪年日期。
function set_era_by_url_data(era) {
	if (set_era_by_url_data_running)
		return;
	set_era_by_url_data_running = true;

	if (typeof era === 'string') {
		location.hash = '#era=' + era;
		// gettext_config:{"id":"era-$1"}
		document.title = _('纪年 %1', era);

	} else {

		var column, items,
		// 直接处理 hash / search。
		// e.g., "era.htm#era=%E5%A4%A7%E6%B0%B82%E5%B9%B4&column="
		// #era=景元元年&column=-contemporary&layer=台湾地震
		// #hierarchy=中国/东汉/安帝
		// #hierarchy=中国/清&layer=台湾地震
		data = new URLSearchParams(location.search)
		//
		.set_parameters(location.hash.slice(1));

		// column=增加此栏,增加此栏
		if (column = data.get('column'))
			add_calendar_column(column.split(','), true);

		// era=纪年名称
		if (!(era = data.get('era'))
				&& !/[&=]/.test(items = location.search.slice(1)
						|| location.hash.slice(1)))
			era = items;

		// layer=增加资料图层,增加资料图层
		if (items = data.get('layer')) {
			if (!Array.isArray(items))
				items = items.split(',')
			items.forEach(function(item) {
				add_tag.load(item);
			});
		}

		if (era) {
			// gettext_config:{"id":"era-$1"}
			document.title = _('纪年 %1', era);
			click_title_as_era.call({
				title : decodeURIComponent(era)
			});
		} else if (column && era_input_object.setValue())
			translate_era();
		else if (items = data.get('hierarchy'))
			draw_era(Array.isArray(items) ? items : items.split(/[,\/]/));
	}

	set_era_by_url_data_running = false;
}

// ---------------------------------------------------------------------//

var thdl_solar_term,
// 明清实历节气
initialize_thdl_solar_term = function() {
	var
	// copy from data.date.
	/** {Number}一整天的 time 值。should be 24 * 60 * 60 * 1000 = 86400000. */
	ONE_DAY_LENGTH_VALUE = new Date(0, 0, 2) - new Date(0, 0, 1);
	var
	// STARTS_FROM: 节气间间隔以 STARTS_FROM 日起跳。
	STARTS_FROM = 14, DIGITS = 4, MAX_DIGITS = 10 + 26,
	//
	last_date = null, start_year, result = [],
	// 采用 "1516-01-10" 会被当作 UTC+0 解析。
	data = ',,,,,,,,,,,,,,,,,,,,1516/1/10,15,15,15;xohayhfyt;yx7pjq7ut;13mepi9aok;1mmes224b9;xohayhfyt;dhgfgfgggfgfgfffffeffeff;13m8seg9xw;1mmes224b9;xohayhfyt;yx7pjq7ut;13m8seg9yt;gegffgffffgfffgffffgfdff;xohayhfyt;yx7pjq7ut;13m8seg9xw;1mmes224b9;xohayhfyt;yx7pjq7ut;13m8seg9xw;1mmes224b9;xohayhfyt;yx7pjq7ut;13m8seg9xw;1mmes224b9;xohayhfyt;yx7pjq7ut;13m8seg9xw;1mmes224b9;xohayhfyt;yx7pjq7ut;13m8seg9xw;1mmes224b9;xohayhfyt;yx7pjq7ut;13m8seg9xw;1mmes224b9;xohayhfyt;yx7pjq7ut;13m8seg9xw;1mmes224b9;xohayhfyt;yx7pjq7ut;13m8seg9xw;1mmes224b9;xohayhfyt;yx7pjq7ut;13m8seg9xw;1mmes224b9;xohayhfyt;yx7pjq7ut;13m8seg9xw;1mmes224b9;xohayhfyt;yx7pjq7ut;13m8seg9xt;1mmes224b9;xohayhfyt;yx7pjq7ut;13m8seg9xw;1mmes224b9;xohayhfyt;yx7pjq7ut;13m8seg9xw;1mmes224b9;xohayhfyt;yx7pjq7ut;13m8seg9xw;1mmes224b9;xohayhfyt;yx7pjq8g5;13m8seg9xw;1mmes224b9;xohayhfyt;yx7pjq8g5;13m8seg9xw;1mmes226ol;xohayhfyt;yx7pjq8g5;13m8seg9xw;1mmes224b9;xohayhfyt;yx7pjq8g5;13m8seg9xw;1mmes224b9;xohayhfyt;yx7pjq8g5;13m8seg9xw;1mmes224b9;xohayhfyt;yx7pjq7ut;13m8seg9xw;1mmes224b9;xohayhfyt;yx7pjq7ut;13m8seg9xw;1mmes224b9;xohayhfyt;yx7pjq7ut;13m8seg9xw;1mmes224b9;xohayhfyt;yx7pjq7ut;13m8seg9xw;1mmes224b9;yukmozl05;yx7pjq7ut;13m8seg9xw;1mmes224b9;xr4dt80et;yxve4kklh;13m8seg9xx;xohayh6c5;xr4dt80et;yx7pjq7ut;13m8seg9xw;1mmes224b9;xohb0cv85;yx7pjq7ut;13m8seg9xt;1mmer82a8l;xohb0cv85;yx7pjq7ut;ffgfggfgggfgdhffffefffef;1mmer7lff9;xohb0cv85;yx7pjq7ut;yxvhgfp75;13wxjfez4l;xohayhfyt;yx7pjq5hh;yxvhgfp75;13wxjfez4l;xohayh6hh;yx7pjq5hh;yxvhgfp75;13mephsfv9;xohaqzhg5;xr4dt80ht;f2aum04lt;13mephsfwl;xohayh6hh;xr4dt80et;yx7pr7ww5;13m8seg9xx;xohayh6hh;xr40hri1h;yx7pr7ww5;13m8seg9xw;1mmes226ol;xohb0cv85;yx7pjq7ut;13m8seg9xt;1mmer7lff9;xohb0cv85;yx7pjq7ut;yxvhgfp75;13wxjfj6tx;xohb0cv85;yx7pjq7ut;yxvhgfp75;13wxjfj6tx;xohayhfyt;yul02bio5;yv8rz2dsh;13mephsfv9;xohayh6hh;xr4dt80g5;yxve4kklt;13mephsfv9;xohayh6hh;xr4dt80g5;yx7pr7wwh;13m8t916q8;13m8sega39;xr40hri1h;yx7pr7ww5;13mephsfvl;xofton505;xohb0cv85;yx7pjq7ut;13m8seg9xw;1mmer83c5x;xohb0cv85;yx7pjq7ut;yxvhgfpsk;1mmer7i9n9;xohb0cv85;yx7pjq7ut;yxvhgfpsh;13wxjfj6tx;xohayhfyt;yx7pjq7ut;13m8seg9ch;13wxjfez4l;xohayhfyt;yx7pjq7ut;yxve4kklt;13mephsfv9;xohayh6hh;xr4dt80g5;yxdmuk2tt;13m8seg9xx;fffgfgggfggffdifefffefff;xr40hri2t;ffgfgfgggfggffffffefdhef;13m8seg9xx;xoftoixat;xohb0cv9h;yx7pjq7ut;13m8seg9xx;xofsuocut;xohb0cv85;yx7pjq7ut;13m8seg9xw;1mmer83cb9;xohb0cv8h;yx7pjq7ut;yxvhgfpsl;xofsu28et;xohayhfyt;yx7pjq7v5;13m8p2l5cl;xofsu289h;xohayhfyt;yx7pjq7ut;13m8p2l5cl;xofsu289h;xohayh6hh;yx7c89phh;13m8ov3fpw;1mmer7h7px;xofsuocut;yx7c89n45;yxvdx2vkk;1mm8u451sl;xofsuocut;ymoian3ut;yx7pjq7v5;1mm8u451sl;xofsu7i1h;yx7c89n45;yx7pjq7v5;13m8seg9xx;xofsu7i1h;xr40fw2th;yx7pjq7v5;13m8seg9xx;xofsu6g45;xr40fw2th;yx7pjq7v5;13m8p2l5cl;xoffilq1h;xohayhg05;yx7pjq7v5;13m8p2l5cl;xp3h7ew45;xohayhfyt;yx7pjq7ut;13m8p2l5cl;xofsu289h;xoha4inth;yx7c89phh;13m8ov3gb8;1mm8u451sl;xofsuocut;yx7c89phh;yxvdx2vkk;1mm8u451sl;fffgfgdiggfgfgffefffefff;yx7c89n45;yx7pjq7v5;1mbq06iij9;xofsu7i1h;yx7c6e7ut;yx7pjq7v5;13m8seg9xx;xofsu7i1h;xr40fw2th;yy1b0f1ht;13m8p2l5cl;xofsu6g4h;xohayhg05;yx7pjq7v5;13m8p2l5cl;xofsu28et;xohayhg05;yx7pjq7v5;13m8p2l5cl;xofsu28et;xohayhfyt;yx7c89phh;13m8ov3gb9;xofsu289h;xofsuomc5;yx7c89phh;14sc0lllck;1mm8u451sl;xofsuocut;yx7c89phh;yx7pjq7v8;1mm8u451sl;xofsuocut;yx7c89n45;yx7pjq7v5;1mbq06iij9;xofsu7i1h;yx7c6e7ut;yx7pjq7v5;13m8seg9xx;xofsu7i1h;xohayhg05;yx7pjq7v5;13m8p2l5cl;xofsu7i1h;xohayhg05;yx7pjq7v5;13m8p2mgr9;xofsu28et;xohayhg05;yx7c89pht;13ll0p8hn9;xofsu28et;xofsuomdh;yx7c89pht;13melyfm8l;xo9vqq2hh;xofsuomc5;yx7c89phh;13m8ov3gb9;xo9vqq2c5;xofsuomc5;yx7c89phh;yx7pjq8gk;1mbvx9uogl;xofsuocut;yx7c89phh;yx7pjq7v8;1mbq06iij9;xofsu7i1h;xr40fw2th;yx7pjq7v5;13m8p2l5cl;xofsu7i1h;xohayhg05;yx7pjq7v5;13m8p2l5cl;xofsu7i1h;xohayhg05;yx7pjq7v5;13m8p2l5cl;xofsu6g45;xohayhg05;yx7c89pht;13wrispzkl;xo9if9k45;xofsuomdh;yx7c89pht;13m8ov3gb9;xo9vr6xat;xofsuomc5;yx7c89phh;13lkn6aa8l;xo9vqq2hh;xofsuomc5;yx7c89phh;yx7pjq8gk;1mbq06iij9;xofsuocut;yx7beaxc5;yx7pjq7v8;1mbq06iij9;xofsu7i1h;xohayhg05;yx7pjq7v5;13m8p2l5cl;xofsu7i1h;xohayhg05;yx7pjq7v5;13m8p2l5cl;xofsu7i1h;xohayhg05;yx7c89pht;13m8p2l5cl;xofsu6g45;xofsuomdh;yx7c89pht;13m8ov3gb9;xo9vqq2hg;13wxjg1d8l;yx7c89pht;13ll0hqslx;xo9vqq2hh;xofsuomdh;yx7c89pht;13ll0hqslx;xo9vqq2hi;8qguh9mvp;yx7c89phh;yx7pjpwlw;1mbq06iij9;xofsuocut;yx7c89phh;yx7pjq8gk;1mbpwundxx;fffgfggfggfgffgfdfgfefff;xohayhidh;yx7pjq7v8;13m8p2l5cl;xofsu7hud;xohaymqf9;yx7c89pht;13m8p2l5cl;xofsu7i1h;xoftoneit;yx7c89pht;13m8p2l5cl;xo9vqvc45;xofsuomdh;yx7c89pht;13m8ov3dxx;xo9vqq2hh;xofsuomdh;yx7c89pht;13ll0hqslx;xo9vqq2hh;fffgfggfggfgfgfffef00000'
			.split(';');

	data.forEach(function(year_data, index) {
		if (year_data.includes(',')) {
			// 无简化方法。
			year_data = year_data.split(',');
			year_data.forEach(function(solar_term, index) {
				if (!year_data[index])
					return;
				if (year_data[index] > 0) {
					last_date += year_data[index] * ONE_DAY_LENGTH_VALUE;
				} else {
					last_date = year_data[index].to_Date('CE');
					if (!start_year)
						result.start = start_year
						// - 1: 1516 春分前末几个节气，算前一年的。
						= last_date.getFullYear() - 1;
					last_date = last_date.getTime();
				}
				year_data[index] = last_date;
			});

		} else if (year_data.length === 24) {
			// 次简化方法。
			year_data = year_data.split('');

			year_data.forEach(function(solar_term, index) {
				last_date += parseInt(solar_term, MAX_DIGITS)
						* ONE_DAY_LENGTH_VALUE;
				year_data[index] = last_date;
			});

		} else {
			// 最简化方法。
			year_data = parseInt(year_data, MAX_DIGITS)
			//
			.toString(DIGITS).split('');
			while (year_data.length < 24)
				// 补 0。
				year_data.unshift(0);
			// assert: year_data.length === 24
			year_data.forEach(function(solar_term, index) {
				last_date += ((year_data[index] | 0) + STARTS_FROM)
						* ONE_DAY_LENGTH_VALUE;
				year_data[index] = last_date;
			});
		}

		// for debug
		if (false && year_data.length !== 24)
			throw index + ':' + data[index];
		result[index + start_year] = year_data;
	});

	thdl_solar_term = result;
	thdl_solar_term.准 = 1645;

	initialize_thdl_solar_term = null;
}

// ---------------------------------------------------------------------//

/**
 * 地理座标（经纬度）<br />
 * the observer's geographic location [ latitude (°), longitude (°), time zone
 * (e.g., UTC+8: 8), elevation or geometric height (m) ]<br />
 * 观测者 [ 纬度（北半球为正,南半球为负）, 经度（从Greenwich向东为正，西为负）, 时区, 海拔标高(观测者距海平面的高度) ]
 * 
 * @type {Array}
 */
var local_coordinates;

// ---------------------------------------------------------------------//

/**
 * 
 * @param date
 * @param JD
 * @param 节气序
 * @param 起算干支序
 * @param [LIST]
 * 
 * @returns {Array}[干支轮序,干支起算之序]
 */
function 节气后第几轮干支(date, JD, 节气序, 起算干支序, LIST) {
	if (typeof 节气序 === 'string') {
		节气序 = CeL.astronomy.SOLAR_TERMS.indexOf(节气序);
	}
	if (!(节气序 >= 0)) {
		return;
	}

	if (!JD) {
		JD = CeL.Date_to_JD(date.offseted_value());
	}

	// -Math.floor(d) === Math.ceil(-d)
	var 节气后经过日数 = date.getFullYear();
	// 冬至(18)之后节气，应算前一年之节气。
	if (节气序 >= 18) {
		--节气后经过日数;
	}
	节气后经过日数 = Math.ceil(JD - CeL.solar_term_JD(节气后经过日数, 节气序));
	if (节气后经过日数 < 0) {
		return;
	}

	if (typeof 起算干支序 === 'string') {
		if (!LIST) {
			LIST = CeL.date.STEM_LIST.includes(起算干支序) ? CeL.date.STEM_LIST
					: CeL.date.BRANCH_LIST;
		}
		起算干支序 = LIST.indexOf(起算干支序);
	}
	if (!(起算干支序 >= 0)) {
		return;
	}

	var 干支起算之序 = (CeL.date.stem_branch_index(date) - 起算干支序).mod(LIST.length),
	//
	干支轮序 = 节气后经过日数 - 干支起算之序;
	if (false && 干支轮序 < 0) {
		return;
	}

	干支轮序 = Math.floor(干支轮序 / LIST.length);

	return [ 干支轮序, 干支起算之序, 节气后经过日数 ];
}

// ---------------------------------------------------------------------//

/**
 * 若非在行用/适用期间，则淡化显示之。
 * 
 * @param {Date}date
 *            date to detect
 * @param {String}show
 *            text to show
 * @param {Date}start
 *            start date of adaptation
 * @param {Date}end
 *            end date of adaptation. 指结束行用之<b>隔日</b>!
 * 
 * @returns formated style
 */
function adapt_by(date, show, start, end) {
	if (Array.isArray(start) && !end) {
		end = start[1], start = start[0];
	}
	return start && date - start < 0 || end && end - date <= 0 ? {
		span : show || date,
		S : 'color:#aaa;'
	} : show || date;
}

/**
 * 利用 cookie 记录前次所选栏位。
 */
function column_by_cookie(to_set) {
	if (to_set) {
		// 将所选栏位存于 cookie。
		if (JSON.stringify)
			CeL
					.set_cookie('selected_columns', JSON
							.stringify(selected_columns));
	} else
		// 取得并设定存于 cookie 之栏位。
		try {
			var data = CeL.get_cookie('selected_columns');
			if (data && CeL.is_Object(data = JSON.parse(data)))
				selected_columns = data;
		} catch (e) {
			// TODO: handle exception
		}
}

// 设定是否挡住一次 contextmenu。
var no_contextmenu;
window.oncontextmenu = function(e) {
	if (no_contextmenu) {
		no_contextmenu = false;
		return false;
	}
};

var SVG_min_width = 600, SVG_min_height = 500, SVG_padding = 30,
//
no_SVG_message = '您的浏览器不支援 SVG，或是 SVG 动态绘图功能已被关闭，无法绘制纪年时间轴线图。';
function affairs() {
	if (!_) {
		// console.warn('程式初始化作业尚未完成。');
		setTimeout(affairs, 80);
		return;
	}

	CeL.log({
		// gettext_config:{"id":"initializing"}
		T : 'Initializing...'
	}, true);

	CeL.toggle_display('input_panel', true);

	_.create_menu('language_menu', [ 'TW', 'CN', 'ja', 'ko', 'en', 'fr', 'pt',
			'pms' ], function() {
		draw_era.redraw();
	});

	// translate all nodes to show in specified language (or default domain).
	_.translate_nodes();

	// -----------------------------

	// google.visualization.CandlestickChart
	// Org Chart 组织图
	// Geo Chart 地理图

	// onInput(key,list,force)

	era_input_object = new CeL.select_input('era_input', CeL.era
			.get_candidate(), 'includeKeyWC');
	era_input_object.focus();

	CeL.get_element('era_input').onkeypress
	//
	= CeL.get_element('output_format').onkeypress = function(e) {
		if (!e)
			e = window.event;
		// press <kbd>Enter</kbd>
		if (13 === (e.keyCode || e.which || e.charCode))
			translate_era();
	};

	CeL.get_element('output_format').onchange
	//
	= CeL.get_element('translate').onclick = function() {
		translate_era();
		return false;
	};

	var i, v, o = output_format_types, list = [],
	// output_format_types 反解: auto-generated
	output_format_types_reversed = Object.create(null);
	// reset output_format_types to local language expression.
	output_format_types = Object.create(null);
	// 在地化的输出格式。
	if (_.is_domain_name('ja'))
		// gettext_config:{"id":"6-luminaries"}
		o['六曜'] = '%六曜';
	for (i in o) {
		output_format_types[_(i)] = v = o[i];
		list.push({
			span : {
				T : i
			},
			R : output_format_types_reversed[v] = i,
			D : {
				format : v
			},
			C : 'format_button  mdui-btn mdui-color-theme-accent mdui-ripple',
			onclick : function() {
				output_format_object.setValue(this.dataset.format);
				translate_era();
				return false;
			}
		}, ' ');
	}
	CeL.new_node(list, 'format_type_bar');

	output_format_object = new CeL.select_input('output_format',
			output_format_types_reversed, 'includeKeyWC');
	// original_input = era_input_object.onInput;
	// era_input_object.onInput = input_era;
	// era_input_object.setSearch(set_search_list);

	// CeL.Log.toggle(false);

	list = [];
	o = [];
	i = [ '共存纪年:546/3/1', '共存纪年:1546-3-1', '年月日时干支:一八八〇年四月二十一日七时',
			'年月日时干支:一八八〇年庚辰月庚辰日7时', CE_name + '日期:一八八〇年庚辰月庚辰日庚辰时', '初始元年11月1日',
			'明思宗崇祯1年1月26日', CE_name + '日期:天聪二年甲寅月戊子日',
			CE_name + '日期:天聪2年寅月戊子日', '清德宗光绪六年三月十三日', '清德宗光绪庚辰年三月十三日',
			'清德宗光绪庚辰年庚辰月庚辰日', '清德宗光绪六年三月十三日辰正一刻', '魏少帝嘉平4年5月1日',
			'魏少帝嘉平4年闰5月1日', '魏少帝嘉平4年闰月1日', '景元元年', '景元元年7月', '元文宗天历2年8月8日',
			'元文宗天历3/1/2', '旧暦2016年', '共存纪年:JD2032189', '平成26年6月8日', 'H26.6.8',
			'汉和帝刘肇（79年–106年2月13日）' ];
	i.forEach(function(era) {
		list.push({
			div : [ '✔️', {
				a : era,
				title : era,
				href : '#',
				target : '_self',
				onclick : click_title_as_era
			} ]
		});
		o.push(era.replace(/^[^:]+:/, ''));
	});
	CeL.new_node(list, 'example');
	CeL.set_text('batch_source', o.join('\n'));

	// 添加公元日期于纪年后
	(CeL.get_element('parsed_text_add_date').onclick = parsed_text_set_date)
			(true);

	// -----------------------------

	SVG_object = CeL.get_element('era_graph_SVG');
	// 纪年线图按滑鼠右键可回上一层。
	SVG_object.onclick =
	// Chrome use this.
	SVG_object.onmousedown = function era_graph_move_up(e) {
		if (!e)
			e = window.event;
		// http://stackoverflow.com/questions/2405771/is-right-click-a-javascript-event
		if (
		// Gecko (Firefox), WebKit (Safari/Chrome) & Opera
		'which' in e ? e.which === 3
		// IE, Opera
		: ('button' in e) && e.button === 2) {
			var hierarchy = draw_era.last_hierarchy;
			if (Array.isArray(hierarchy) && hierarchy.length > 0) {
				hierarchy.pop();
				draw_era(hierarchy);
				no_contextmenu = true;
				e.stopPropagation();
				return false;
			}
		}
	};

	// 为取得 offsetHeight，暂时先 display。
	CeL.toggle_display('era_graph', true);
	CeL.toggle_display(SVG_object, true);
	era_name_classifier = CeL.era.pack.era_name_classifier;
	var SVG_width = SVG_object.offsetWidth, SVG_height = SVG_object.offsetHeight;
	CeL.debug('SVG: ' + SVG_width + '×' + SVG_height);
	if (SVG_width < SVG_min_width || SVG_height < SVG_min_height) {
		CeL.error('当前视窗过小。将采用萤幕之大小，请将视窗放到最大。');
		if (SVG_width < SVG_min_width)
			SVG_width = Math.max((screen.availWidth || screen.width)
					- SVG_padding, SVG_min_width);
		if (SVG_height < SVG_min_height)
			SVG_height = Math.max((screen.availHeight || screen.height)
					- SVG_padding, SVG_min_height);

	}
	draw_era.width = SVG_width - 2 * draw_era.left;
	// 须扣掉 era_graph_navigation 高度。
	draw_era.height = SVG_height - draw_era.top - draw_era.bottom_height
			- CeL.get_element('era_graph_navigation').offsetHeight;

	SVG_object = new CeL.SVG(SVG_width, SVG_height);

	var is_IE11 = /Trident\/7/.test(navigator.appVersion);
	if (SVG_object.status_OK() && !is_IE11) {
		SVG_object.attach('era_graph_SVG');
		draw_era();
	} else {
		CeL.get_element('era_graph').style.display = 'none';
		SVG_object = null;
		delete select_panels['era_graph'];
		// delete select_panels['data_layer'];
		CeL.toggle_display('data_layer', false);
		if (is_IE11)
			// 多按几次就会 hang 住。
			CeL.error('IE 11 尚无法使用线图。请考虑使用 Chrome 或 Firefox 等网页浏览器。');
		CeL.warn(no_SVG_message);
	}

	// -----------------------------

	if (SVG_object) {

		// 设置选项
		CeL.new_node([
				{
					// gettext_config:{"id":"options-of-timeline"}
					T : '纪年线图选项：'
				},
				{
					// gettext_config:{"id":"markup-current-era"}
					T : '标记正处理的纪年',
					R : 'Markup current era. 标记当下正在处理的纪年。',
					onclick : function() {
						var configured = translate_era.draw_recent_era;
						// reset option status
						CeL.set_class(this, 'configured', {
							remove : configured
						});
						translate_era.draw_recent_era = !configured;
						draw_era.redraw();
						return false;
					},
					C : 'option'
							+ (translate_era.draw_recent_era ? ' configured'
									: '')
				},
				{
					// gettext_config:{"id":"combine-historical-periods"}
					T : '合并历史时期',
					R : 'merge_periods\ne.g., 三国两晋南北朝, 五代十国',
					onclick : draw_era.change_option,
					C : 'option'
							+ (draw_era.options.merge_periods ? ' configured'
									: '')
				},
				{
					// gettext_config:{"id":"adapt-lifetime-of-rulers"}
					T : '扩张范围至君主在世时段',
					R : 'adapt_lifetime',
					onclick : draw_era.change_option,
					C : 'option'
							+ (draw_era.options.adapt_lifetime ? ' configured'
									: '')
				} ], 'era_graph_options');

		// 资料图层
		list = [ {
			h3 : {
				// gettext_config:{"id":"data-layer"}
				T : '资料图层'
			}
		}, {
			// gettext_config:{"id":"please-select-the-layer-you-want-to-load"}
			T : '请选择所欲载入之资料图层。'
		} ];

		v = add_tag.data_file;
		for (i in v) {
			o = {
				a : i,
				href : '#',
				target : '_self',
				title : i,
				C : 'data_item',
				onclick : function() {
					var group = this.title,
					//
					status = add_tag.load(group, true);
					if (status)
						CeL.info('data layer [' + group + ']: ' + status);
					else
						add_tag.load(group, function() {
							CeL.new_node({
								span : '✓',
								C : 'loaded_mark'
							}, [ this.parentNode, 1 ]);
							this.className += ' loaded';
							CeL.new_node([ ' ... ', {
								// gettext_config:{"id":"function-(domain_name-arg)-{-return-$1-+-(1-<-arg-1-?-entries-entry-)-+-loaded.-}"}
								T : [ '已载入 %1 笔资料。',
								//
								add_tag.group_count[group] ],
								C : 'status'
							} ], this.parentNode);
						}.bind(this));
					return false;
				}
			};

			i = v[i];
			if (i[1])
				o = [ o, ' (', {
					T : '资料来源'
				}, ': ', i[2] ? {
					a : i[1],
					href : i[2],
					target : '_blank'
				} : i[1], ')' ];

			if (i[3]) {
				if (!Array.isArray(o))
					o = [ o ];
				o.push({
					span : i[3],
					C : 'description'
				});
			}

			list.push({
				div : o,
				C : 'data_line'
			});
		}

		CeL.new_node(list, 'data_layer');
	}

	// -----------------------------

	list = [];
	for (i in select_panels) {
		CeL.toggle_display(i, false);
		if (select_panels[i])
			list.push({
				a : {
					T : select_panels[i]
				},
				id : i + click_panel.postfix,
				href : "#",
				C : 'note_botton mdui-btn mdui-color-theme-accent mdui-ripple',
				onclick : click_panel
			}, ' | ');
		else
			delete select_panels[i];
	}
	list.pop();
	CeL.remove_all_child('note_botton_layer');
	CeL.clear_class('note_botton_layer');
	CeL.new_node(list, 'note_botton_layer');

	select_panel('era_graph' in select_panels ? 'era_graph' : 'FAQ', true);

	// -----------------------------

	var data_load_message = {
		// gettext_config:{"id":"data-will-be-presented-at-next-calculation"}
		T : 'Data will be presented at next calculation.',
		R : 'Data is not yet loaded.',
		S : 'color:#888;font-size:.8em;'
	},
	// copy from data.date.
	/** {Number}一整天的 time 值。should be 24 * 60 * 60 * 1000 = 86400000. */
	ONE_DAY_LENGTH_VALUE = new Date(0, 0, 2) - new Date(0, 0, 1),
	// 月相 添加文字版本图像 in Unicode 🌚新月脸 🌛上弦月脸 🌝满月脸 🌜下弦月脸 🥮月饼 🎑赏月
	LUNAR_PHASE_SYMBOL = {
		// 新月 New Moon
		朔 : '🌑',
		// 蛾眉月 Waxing Crescent Moon
		新月 : '🌒',
		// First Quarter Moon
		上弦 : '🌓',
		// Waxing Gibbous Moon
		盈凸月 : '🌔',
		// 满月 Full Moon
		望 : '🌕',
		// Waning Gibbous Moon
		亏凸月 : '🌖',
		// Last Quarter Moon
		下弦 : '🌗',
		// 残月 Waning Crescent Moon
		晦日 : '🌘'
	},
	// "Apple Color Emoji","Segoe UI Emoji","NotoColorEmoji","Segoe UI
	// Symbol","Android Emoji","EmojiSymbols"
	sunrise_sunset_icons = [ '🌃', '🌅'/* 🌄 */, '☀️', '🌇' ],
	//
	建除_LIST = '建除满平定执破危成收开闭'.split(''),
	// https://github.com/zealotrush/ben_rime/blob/master/symbols.yaml
	ZODIAC_SYMBOLS = '♈♉♊♋♌♍♎♏♐♑♒♓'.split(''),
	// 白羊宫,金牛宫,双子宫,巨蟹宫,狮子宫,室女宫,天秤宫,天蝎宫,人马宫,摩羯宫,宝瓶宫,双鱼宫
	ZODIAC_SIGNS = [
	// gettext_config:{"id":"aries"}
	"Aries",
	// gettext_config:{"id":"taurus"}
	"Taurus",
	// gettext_config:{"id":"gemini"}
	"Gemini",
	// gettext_config:{"id":"cancer"}
	"Cancer",
	// gettext_config:{"id":"leo"}
	"Leo",
	// gettext_config:{"id":"virgo"}
	"Virgo",
	// gettext_config:{"id":"libra"}
	"Libra",
	// gettext_config:{"id":"scorpio"}
	"Scorpio",
	// gettext_config:{"id":"sagittarius"}
	"Sagittarius",
	// gettext_config:{"id":"capricorn"}
	"Capricorn",
	// gettext_config:{"id":"aquarius"}
	"Aquarius",
	// gettext_config:{"id":"pisces"}
	"Pisces" ],
	// for 皇纪.
	kyuureki, Koki_year_offset = 660, Koki_year = Year_numbering(Koki_year_offset),
	// for 泰国佛历
	// THAI_Year_numbering = Year_numbering(543),
	//
	Gregorian_reform = new Date(1582, 10 - 1, 15), Revised_Julian_reform = new Date(
			1923, 10 - 1, 14);

	var method_nodes = [ {
		a : '采用 LEA-406'
		//
		+ (CeL.LEA406.default_type === 'a' ? 'b' : 'a'),
		href : '#',
		S : 'cursor:pointer',
		onclick : function() {
			CeL.set_cookie('LEA406_type',
			//
			CeL.LEA406.default_type === 'a' ? 'b' : 'a');
			history.go(0);
			return false;
		}
	}, '（a 较精准，b 较快。点选后将', {
		em : '随即重新整理'
	}, '，以更改设定！）' ];
	CeL.new_node(method_nodes, 'method_layer');
	method_nodes = [ '🌌 Because using complete LEA-406'
	//
	+ CeL.LEA406.default_type, ' to calculate the position of moon,'
	//
	+ ' it often takes seconds to minutes to display.', {
		br : null
	}, '因为采用了完整的 LEA-406'
	//
	+ CeL.LEA406.default_type + ' 来计算月亮位置，关于月亮位置之项目，例如「', {
		// gettext_config:{"id":"lunar-phase"}
		T : '月相'
	}, '」栏每次执行常需耗费数秒至一两分钟，敬请见谅。您尚可' ].concat(method_nodes);

	// add 东亚阴阳历法
	function add_历法(历名, 说明, link) {
		if (!CeL[历名 + '_Date']) {
			// 当设定了不存在的历法，也不该抛出异常。
			CeL.error('历法不存在: ' + 历名);
			return;
		}

		if (!说明)
			说明 = '';
		else if (Array.isArray(说明))
			说明 = 说明.join('\n');
		var 行用 = CeL[历名 + '_Date'].行用;
		if (行用) {
			行用 = [ new Date(行用[0]), new Date(行用[1]) ];
			说明 += '\n行用期间: ' + 行用[0].format(draw_era.date_options) + '–'
					+ 行用[1].format(draw_era.date_options) + ' ('
					+ 行用[0].age(行用[1]) + ')';
		}
		if (CeL[历名 + '_Date'].闰法)
			说明 += '\n闰法: ' + CeL[历名 + '_Date'].闰法;
		return [ {
			a : {
				T : 历名
			},
			R : 说明.trim() + '\n* 以平气平朔无中置闰规则计算得出，非实历。',
			href : 'https://' + (历名.includes('暦') ? 'ja' : 'zh')
			//
			+ '.wikipedia.org/wiki/' + encodeURIComponent(link || 历名)
		}, function(date) {
			if (date.精 !== '年') {
				var 历日 = date['to_' + 历名]({
					小余 : true,
					节气 : true
				}), show = 历日.join('/'),
				//
				matchhed = show.match(/^([^闰]+)(闰)([^闰]+)$/);
				if (matchhed) {
					// 特别标注闰月
					(show = matchhed).shift();
					show[1] = {
						T : '闰',
						S : 'color:#52f;'
					};
				}
				return adapt_by(date, /^1 /.test(历日[2]) ? {
					span : show,
					S : 'color:#f94;'
				} : show, CeL[历名 + '_Date'].行用);
			}
		} ];
	}

	function add_阴阳暦(岁首) {
		if (岁首)
			岁首 = {
				岁首 : 岁首
			};
		return function(date) {
			if (/* date.准 || */date.精)
				return;
			// [ 年, 月, 日 ]
			var 历 = CeL.夏历(date, 岁首);
			date = '月' + 历[2] + '日';
			if (typeof 历[1] === 'string' && 历[1].charAt(0) === '闰')
				date = [ {
					T : '闰',
					S : 'color:#52f;'
				}, 历[1].slice(1) + date ];
			else
				date = 历[1] + date;
			return 历[2] === 1 ? {
				span : date,
				S : 'color:#f94;'
			} : date;
		}
	}

	function degree_layer(degree) {
		return isNaN(degree) ? data_load_message : {
			div : {
				span : CeL.format_degrees(degree, 0)
				// &nbsp;
				.replace(/ /g, CeL.DOM.NBSP),
				// degree % TURN_TO_DEGREES
				R : degree % 360
			},
			C : 'monospaced',
			S : 'text-align:right;'
		};
	}

	// calendar_columns
	list = {
		week : [ {
			a : {
				// gettext_config:{"id":"week-day"}
				T : '星期'
			},
			// 0: 周日/星期日/礼拜天, 1: 周一, 余类推
			R : '星期/周/礼拜',
			href : 'https://en.wikipedia.org/wiki/Week',
			S : 'font-size:.7em;'
		}, function(date) {
			if (/* !date.准 && */!date.精)
				return {
					span : date.format({
						format : '%A',
						locale : _.get_domain_name()
					}),
					S : date.getDay() === 0 ? 'color:#f34'
					//
					: date.getDay() === 6 ? 'color:#2b3' : ''
				};
		} ],

		JDN : [ {
			a : {
				// gettext_config:{"id":"jdn"}
				T : 'JDN'
			},
			// gettext_config:{"id":"julian-day-number"}
			R : _('Julian Day Number')

			+ '\n以 UTC 相同日期当天正午12时为准。\n因此 2000/1/1 转为 2451545。',
			href : 'https://en.wikipedia.org/wiki/Julian_Day_Number'
		}, function(date) {
			var date_String = CeL.Date_to_JDN(date.offseted_value(0))
			//
			+ (date.精 === '年' ? '–' : '');
			return date_String;
		} ],

		JD : [ {
			a : {
				// gettext_config:{"id":"jd"}
				T : 'JD'
			},
			// gettext_config:{"id":"julian-date"}
			R : _('Julian Date') + '\n以「纪元使用地真正之时间」相同日期当天凌晨零时为准。\n'
			//
			+ '因此对中国之朝代、纪年，2000/1/1 将转为 2451544.1666... (2000/1/1 0:0 UTC+8)',
			href : 'http://en.wikipedia.org/wiki/Julian_day'
		}, function(date) {
			var date_String = CeL.Date_to_JD(date.offseted_value()).to_fixed(4)
			//
			+ (date.精 === '年' ? '–' : '');
			return date_String;
		} ],

		ISO : [ {
			a : {
				T : 'ISO 8601'
			},
			R : '日期格式 YYYY-MM-DD'
			//
			+ '\nThe standard uses the proleptic Gregorian calendar.',
			href : 'https://en.wikipedia.org/wiki/ISO_8601',
			S : 'font-size:.8em;'
		}, function(date) {
			var year = date.getFullYear() | 0;
			return date.精 === '年' ? _('%1年', year)
			//
			: year.pad(year < 0 ? 5 : 4) + date.format('-%2m-%2d');
		} ],

		ordinal_date : [ {
			a : {
				// gettext_config:{"id":"ordinal-date"}
				T : '年日期'
			},
			R : '表示年内的天数。日期格式 YYYY-DDD',
			href : 'https://en.wikipedia.org/wiki/Ordinal_date'
		}, function(date) {
			var year = date.getFullYear() | 0;
			return date.精 === '年' ? _('%1年', year)
			// TODO: use "%j"
			: year.pad(4) + '-' + CeL.ordinal_date(date).pad(3);
		} ],

		week_date : [ {
			a : {
				// gettext_config:{"id":"week-date"}
				T : '周日期'
			},
			R : '表示年内的星期数天数，再加上星期内第几天。',
			href : 'https://en.wikipedia.org/wiki/ISO_week_date'
		}, function(date) {
			return date.精 === '年' ? _('%1年', date.getFullYear())
			// TODO: use "%W"
			: CeL.week_date(date, true);
		} ],

		Unix : [ {
			a : {
				// gettext_config:{"id":"unix-time"}
				T : 'Unix time'
			},
			R : 'Unix time (a.k.a. POSIX time or Epoch time), Unix时间戳记不考虑闰秒。',
			href : 'https://en.wikipedia.org/wiki/Unix_time'
		}, CeL.date.Unix_time ],

		Excel : [ {
			a : {
				T : 'Excel'
			},
			R : 'Microsoft Excel for Windows 使用 1900 日期系统。',
			href : 'http://support.microsoft.com/kb/214094',
			S : 'font-size:.8em;'
		}, function(date) {
			return (date = date.to_Excel())
			//
			&& (date | 0) || CeL.Excel_Date.error_value;
		} ],

		Excel_Mac : [ {
			a : {
				T : 'Excel Mac'
			},
			R : 'Microsoft Excel for Mac 使用 1904 日期系统。',
			href : 'http://support.microsoft.com/kb/214094',
			S : 'font-size:.8em;'
		}, function(date) {
			return (date = date.to_Excel(true))
			//
			&& (date | 0) || CeL.Excel_Date.error_value;
		} ],

		君主年岁 : [ {
			a : {
				// gettext_config:{"id":"age-of-ruler"}
				T : '君主实岁'
			},
			R : '统治者年纪岁数，采周岁（又称实岁、足岁）。未设定出生时间则无资料。\n'
			//
			+ '由于出生时间常常不够准确，因此计算所得仅供估计参考用！',
			href : 'https://zh.wikipedia.org/wiki/%E5%91%A8%E5%B2%81',
			S : 'font-size:.8em;'
		}, function(date) {
			var 出生 = date.生;
			if (Array.isArray(出生)) {
				出生 = 出生[0];
			}
			if (!出生 || !(出生 = CeL.era(出生, {
				date_only : true
			}))) {
				return;
			}
			return 出生.age(date, {
				岁 : true
			});
		} ],

		contemporary : [ {
			// gettext_config:{"id":"contemporary-period"}
			T : '共存纪年',
			R : '本日/本年同时期存在之其他纪年。对未有详实资料者，仅约略准确至所列日期！'
		}, function(date) {
			return date.共存纪年;
		} ],

		adjacent_contemporary : [ {
			// gettext_config:{"id":"contemporary-period-(same-country)"}
			T : '同国共存纪年',
			R : '本日/本年同时期相同国家存在之其他纪年。对未有详实资料者，仅约略准确至所列日期！'
		}, function(date) {
			return date.同国共存纪年;
		} ],

		// --------------------------------------------------------------------
		// data layer
		资料图层 : null,

		// --------------------------------------------------------------------
		// 天文计算 astronomical calculations
		astronomy : [ '天文计算 astronomical calculations', method_nodes ],

		precession : [ {
			a : {
				// gettext_config:{"id":"general-precession"}
				T : 'general precession'
			},
			R : '纪元使用当地、当日零时综合岁差，指赤道岁差加上黄道岁差 (Table B.1) 的综合效果。'
			//
			+ '\nKai Tang (2015).'
			//
			+ ' A long time span relativistic precession model of the Earth.'
			//
			+ '\n在J2000.0的时候与P03岁差差大概几个角秒，主要由于周期拟合的时候，很难保证长期与短期同时精度很高。',
			href : 'https://en.wikipedia.org/wiki/Axial_precession'
		}, function(date) {
			if (/* date.准 || */date.精)
				return;

			var precession = CeL.precession(
			//
			CeL.TT(new Date(date.offseted_value())));
			return [ CeL.format_degrees(precession[0], 2), {
				b : ', ',
				S : 'color:#e60;'
			}, CeL.format_degrees(precession[1], 2) ];
		} ],

		solarterms : [ {
			a : {
				// gettext_config:{"id":"solar-term-(astronomical)"}
				T : '天文节气'
			},
			R : '节气 + 交节时刻(@当地时间)或七十二候。计算得出，非实历。于 2015 CE 之误差约前后一分钟。\n'
			//
			+ '节气之后每五日一候，非采用 360/72 = 5° 一候。\n'
			// 合称四立的立春、立夏、立秋、立冬，四立与二分二至称为 「分至启闭」，亦称为八节
			+ '二十四节气 / 二分点 (春分秋分) 和二至点 (夏至冬至) / 七十二候 (物候)',
			href : 'https://zh.wikipedia.org/wiki/节气'
		}, function(date) {
			if (/* date.准 || */date.精)
				return;

			var JD = CeL.Date_to_JD(date.offseted_value());
			date = CeL.solar_term_of_JD(JD, {
				pentads : true,
				time : 2
			});
			return !date || date.includes('候') ? date : {
				a : {
					b : date
				},
				href : 'https://zh.wikipedia.org/wiki/' + date.slice(0, 2)
			};
		} ],

		solarterm_days : [ {
			a : {
				// gettext_config:{"id":"solar-term-ages"}
				T : '节气经过日数'
			},
			R : '天文节气 经过日数',
			href : 'https://zh.wikipedia.org/wiki/节气',
			S : 'font-size:.8em;'
		}, function(date) {
			if (/* date.准 || */date.精)
				return;

			var JD = CeL.Date_to_JD(date.offseted_value());

			date = CeL.solar_term_of_JD(JD, {
				days : true
			});
			return CeL.SOLAR_TERMS[date[1]] + ' ' + date[2];
		} ],

		sun_apparent : [ {
			a : {
				// Sun's apparent position
				// apparent longitude of the Sun
				// gettext_config:{"id":"sun-s-apparent-longitude"}
				T : "Sun's apparent longitude"
			},
			R : '纪元使用当地、当日零时，太阳的视黄经。\n'
			//
			+ 'the apparent geocentric celestial longitude of the Sun.'
			//
			+ '\nUsing VSOP87D.ear.',
			href : 'https://en.wikipedia.org/wiki/Apparent_longitude'
		}, function(date) {
			if (/* date.准 || */date.精)
				return;

			var JD = CeL.TT(new Date(date.offseted_value()));
			return degree_layer(CeL.solar_coordinates(JD).apparent);
		} ],

		moon_longitude : [ {
			a : {
				// gettext_config:{"id":"moon-longitude"}
				T : 'Moon longitude'
			},
			R : '纪元使用当地、当日零时，月亮的黄经。\n'
			//
			+ 'the ecliptic longitude of the Moon.'
			//
			+ '\nUsing LEA-406.',
			href : 'https://en.wikipedia.org/wiki/Apparent_longitude'
		}, function(date) {
			if (/* date.准 || */date.精)
				return;

			var JD = CeL.TT(new Date(date.offseted_value()));

			return degree_layer(CeL.lunar_coordinates(JD, {
				degrees : true
			}).V);
		} ],

		moon_latitude : [ {
			a : {
				// gettext_config:{"id":"moon-latitude"}
				T : 'Moon latitude'
			},
			R : '纪元使用当地、当日零时，月亮的黄纬。\n'
			//
			+ 'the ecliptic latitude of the Moon.\n'
			//
			+ 'Using LEA-406.',
			href : 'https://en.wikipedia.org/wiki/Ecliptic_coordinate_system'
		}, function(date) {
			if (/* date.准 || */date.精)
				return;

			var JD = CeL.TT(new Date(date.offseted_value()));

			return degree_layer(CeL.lunar_coordinates(JD, {
				degrees : true
			}).U);
		} ],

		moon_sun : [ {
			a : {
				// 月日视黄经差角
				// gettext_config:{"id":"apparent-longitude-moon-sun"}
				T : '月日视黄经差'
			},
			R : '纪元使用当地、当日零时，月亮的视黄经-太阳的视黄经\n'
			//
			+ 'the apparent geocentric celestial longitude: Moon - Sun.'
			//
			+ '\nUsing VSOP87D.ear and LEA-406.',
			href : 'https://zh.wikipedia.org/wiki/冲_(天体位置)'
		}, function(date) {
			if (/* date.准 || */date.精)
				return;

			var JD = CeL.TT(new Date(date.offseted_value()));

			return degree_layer(CeL.lunar_phase_angle_of_JD(JD));
		} ],

		lunar_phase : [ {
			a : {
				// gettext_config:{"id":"lunar-phase"}
				T : '月相'
			},
			R : 'lunar phase, 天文月相附加可能的日月食资讯。计算得出之纪元使用当地、当日零时月相，非实历。'
			//
			+ '\nUsing VSOP87D.ear and LEA-406.',
			href : 'https://zh.wikipedia.org/wiki/月相'
		}, function(date) {
			if (/* date.准 || */date.精)
				return;

			var JD = CeL.Date_to_JD(new Date(date.offseted_value())),
			//
			phase = CeL.lunar_phase_of_JD(JD, {
				eclipse : true,
				// gettext_config:{"id":"new-moon-eve"}
				晦 : '晦日'
			});
			if (Array.isArray(phase)) {
				// gettext_config:{"id":"new-moon"}
				var is_solar = phase[0] === '朔',
				//
				eclipse_info = phase[2];
				phase = [ {
					span : LUNAR_PHASE_SYMBOL[phase[0]]
				}, {
					b : {
						T : phase[0]
					}
				}, ' ', (JD = CeL.JD_to_Date(phase[1])).format({
					parser : 'CE',
					// format : '%Y/%m/%d %H:%M:%S'
					format : '%H:%M:%S',
					offset : date['minute offset']
				}), eclipse_info ? [ ' ', {
					a : {
						T : eclipse_info.name
					},
					// gettext_config:{"id":"moon-latitude"}
					R : _('Moon latitude') + ': '
					//
					+ CeL.format_degrees(eclipse_info.Δlongitude, 2),
					href : 'https://zh.wikipedia.org/wiki/'
					//
					+ encodeURIComponent(
					//
					CeL.JD_to_Date(eclipse_info.TT).format({
						parser : 'CE',
						format : '%Y年%m月%d日',
						offset : 0
					}).replace(/^-/, '前') + (is_solar ? '日' : '月') + '食')
				}, '?', eclipse_info.saros ? [ {
					br : null
				}, {
					// 沙罗周期标示。
					a : {
						// gettext_config:{"id":"saros-$1"}
						T : [ 'saros %1',
						//
						eclipse_info.saros[1] + '#' + eclipse_info.saros[2] ]
					},
					href : 'https://en.wikipedia.org/wiki/'
					//
					+ (is_solar ? 'Solar' : 'Lunar')
					//
					+ '_Saros_' + eclipse_info.saros[1]
				}, {
					a : '@NASA',
					R : 'NASA CATALOG OF ECLIPSE SAROS SERIES',
					href : 'http://eclipse.gsfc.nasa.gov/'
					//
					+ (is_solar ? 'SEsaros/SEsaros' : 'LEsaros/LEsaros')
					//
					+ eclipse_info.saros[1].pad(3) + '.html'
				},
				// 2016/8/10 17:37:17
				// NASA未提供日偏食或月食之map。但是本工具之判断尚不准确。此时得靠前面之"@NASA"连结取得进一部资讯。
				is_solar && eclipse_info.type !== 'partial' ? [ ' (', {
					a : {
						T : 'path'
					},
					R : 'Eclipse Path by NASA',
					href : 'http://eclipse.gsfc.nasa.gov/SEsearch/'
					//
					+ 'SEsearchmap.php?Ecl='
					//
					+ CeL.JD_to_Date(eclipse_info.TT).format({
						parser : 'CE',
						format : '%5Y%2m%2d',
						offset : 0
					}) + '#map'
				}, ')' ] : '' ] : '', ' ', isNaN(eclipse_info.TT) ? '' : {
					span : CeL.JD_to_Date(CeL.UT(eclipse_info.TT)).format({
						parser : 'CE',
						format : '%H:%M:%S',
						offset : date['minute offset']
					}),
					R : 'maximum eclipse, 本地食甚时间.' + (eclipse_info.magnitude
					//
					? ' 食甚食分: ' + eclipse_info.magnitude.to_fixed(3) : '')
				}, '?' ] : '' ];
			} else if (phase)
				phase = [ {
					span : LUNAR_PHASE_SYMBOL[phase]
				}, {
					b : {
						T : phase
					}
				} ];
			return phase;
		} ],

		sunrise_sunset : [ {
			a : {
				// 日出日没
				// gettext_config:{"id":"sunrise-sunset"}
				T : '日出日落'
			},
			R : '所设定之地理座标当地当日之日出日落时刻。约有两三分的精确度。',
			href : 'https://en.wikipedia.org/wiki/Sunrise'
		}, function(date) {
			if (/* date.准 || */date.精)
				return;

			var JDN = CeL.Date_to_JDN(date.offseted_value(0)),
			//
			data = [];

			CeL.rise_set(local_coordinates, JDN)
			//
			.forEach(function(JD, index) {
				if (JD)
					data.push(CeL.JD_to_Date(JD).format({
						parser : 'CE',
						format : '%Y/%m/%d %H:%M:%S',
						offset : local_coordinates[2] * 60
					}), ' ' + sunrise_sunset_icons[index], {
						T : (index % 2 === 0 ? '' : 'sun')
						//
						+ CeL.rise_set.type_name[index]
					}, {
						br : null
					});
			});

			return data;
		} ],

		twilight : [ {
			a : {
				// gettext_config:{"id":"twilight"}
				T : '曙暮光'
			},
			R : '所设定之地理座标当地当日之曙光暮光时刻。约有两三分的精确度。',
			href : 'https://en.wikipedia.org/wiki/Twilight'
		}, function(date) {
			if (/* date.准 || */date.精)
				return;

			var JDN = CeL.Date_to_JDN(date.offseted_value(0)),
			//
			data = [];

			CeL.rise_set(local_coordinates, JDN, '456789'.split(''))
			//
			.forEach(function(JD, index) {
				if (JD)
					data.push(CeL.JD_to_Date(JD).format({
						parser : 'CE',
						format : '%Y/%m/%d %H:%M:%S',
						offset : local_coordinates[2] * 60
					}), ' ', {
						T : CeL.rise_set.type_name[index + 4]
					}, index === 2 ? {
						hr : null,
						S : 'margin:.1em;'
					} : {
						br : null
					});
			});

			return data;
		} ],

		moon_rise_set : [ {
			a : {
				// gettext_config:{"id":"moonrise-moonset"}
				T : '月出月落'
			},
			R : '所设定之地理座标当地当日之月出月落时刻。约有两三分的精确度。',
			href : 'http://www.cwb.gov.tw/V7/astronomy/moonrise.htm'
		}, function(date) {
			if (/* date.准 || */date.精)
				return;

			var JDN = CeL.Date_to_JDN(date.offseted_value(0)),
			//
			data = [];

			CeL.rise_set(local_coordinates, JDN, null, 'moon')
			//
			.forEach(function(JD, index) {
				if (JD)
					data.push(CeL.JD_to_Date(JD).format({
						parser : 'CE',
						format : '%Y/%m/%d %H:%M:%S',
						offset : local_coordinates[2] * 60
					}), ' ', {
						T : (index % 2 === 0 ? '' : 'moon')
						//
						+ CeL.rise_set.type_name[index]
					}, {
						br : null
					});
			});

			return data;
		} ],

		ΔT : [ {
			a : {
				T : 'ΔT'
			},
			R : 'Universal Time = Terrestrial Time - ΔT\n'
			//
			+ '简略的说，日常生活时间 UT = 天文计算用时间 TT - ΔT',
			href : 'http://eclipse.gsfc.nasa.gov/SEcat5/deltatpoly.html'
		}, function(date) {
			if (/* date.准 || */date.精)
				return;

			var JD = CeL.Date_to_JD(date.offseted_value()),
			//
			ΔT = CeL.deltaT.JD(JD);
			return CeL.age_of(0, ΔT * 1000)
			//
			+ ' (' + ΔT.to_fixed(Math.abs(ΔT) < 60 ? 4 : 2) + ' s)';
		} ],

		JD_of_TT : [ {
			a : {
				T : 'JD of TT'
			},
			R : '纪元使用当地、当日零时之天文计算用时间 TT, apply ΔT to UT.',
			href : 'https://en.wikipedia.org/wiki/Terrestrial_Time'
		}, function(date) {
			if (/* date.准 || */date.精)
				return;

			return CeL.TT(new Date(date.offseted_value()));
		} ],

		// --------------------------------------------------------------------
		// 各国历法 Historical calendar
		// gettext_config:{"id":"calendar"}
		"calendar" : '计算日期的方法。计算得出，不一定是实暦。',

		Gregorian : [ {
			a : {
				// gettext_config:{"id":"gregorian-calendar"}
				T : 'Gregorian calendar'
			},
			R : 'proleptic Gregorian calendar WITH year 0.'
			//
			+ ' Adopted in 1582/10/15 CE.\n包含0年的外推格里历',
			href : 'https://en.wikipedia.org/wiki/'
			//
			+ 'Proleptic_Gregorian_calendar',
			S : 'font-size:.8em;'
		}, function(date) {
			return adapt_by(date, date.format('%Y/%m/%d'), Gregorian_reform);
		} ],

		Julian : [ {
			a : {
				// gettext_config:{"id":"julian-calendar"}
				T : 'Julian calendar'
			},
			R : 'proleptic Julian calendar WITHOUT year 0,'
			//
			+ ' used before 1582/10/15 CE.\n不包含0年的外推儒略历',
			href : 'https://en.wikipedia.org/wiki/Proleptic_Julian_calendar',
			S : 'font-size:.8em;'
		}, function(date) {
			return adapt_by(date, date.format({
				parser : 'Julian',
				format : date.精 === '年' ? '%Y年' : '%Y/%m/%d'
			}), null, Gregorian_reform);
		} ],

		Revised_Julian : [ {
			a : {
				// gettext_config:{"id":"revised-julian-calendar"}
				T : 'Revised Julian calendar'
			},
			R : 'proleptic Revised Julian calendar WITHOUT year 0.'
			//
			+ ' Adopted in 1923/10/14 CE.\n不包含0年的外推儒略改革历',
			href : 'https://en.wikipedia.org/wiki/Revised_Julian_calendar',
			S : 'font-size:.8em;'
		}, function(date) {
			return adapt_by(date, date.精 === '年' ? date.to_Revised_Julian({
				format : 'serial'
			})[0] : date.to_Revised_Julian().join('/'), Revised_Julian_reform);
		} ],

		Tabular : [ {
			a : {
				// gettext_config:{"id":"islamic-calendar"}
				T : '伊斯兰历'
			},
			R : 'Tabular Islamic calendar\n日落后为伊斯兰历隔日。',
			href : 'http://en.wikipedia.org/wiki/Tabular_Islamic_calendar'
		}, function(date) {
			return date.精 === '年' ? date.to_Tabular({
				format : 'serial'
			})[0] + ' AH' : [ date.to_Tabular({
				format : 'serial'
			}).slice(0, 3).join('/') + ' AH; ', {
				span : date.to_Tabular(),
				dir : 'rtl',
				S : 'unicode-bidi: -moz-isolate;'
			} ];
		} ],

		Solar_Hijri : [ {
			a : {
				// gettext_config:{"id":"modern-iranian-calendar"}
				T : 'گاه‌شماری هجری خورشیدی'
			},
			R : 'Solar Hijri calendar / 现代伊朗历/阿富汗历(阳历) / ヒジュラ太阳暦/アフガン暦/ジャラリ暦',
			href : 'https://fa.wikipedia.org/wiki/گاه‌شماری_هجری_خورشیدی'
		}, function(date) {
			return date.精 === '年' ? date.to_Solar_Hijri({
				format : 'serial'
			})[0] + ' SH' : [ date.to_Solar_Hijri({
				format : 'serial'
			}).slice(0, 3).join('/') + ' SH; ', {
				span : date.to_Solar_Hijri(),
				dir : 'rtl',
				S : 'unicode-bidi: -moz-isolate;'
			} ];
		} ],

		Bangla : [ {
			a : {
				// gettext_config:{"id":"bangla-calendar"}
				T : 'Bangla calendar'
			},
			R : 'revised Bengali Calendar or Bangla Calendar. 现行孟加拉历.'
			//
			+ '\n自日出起算。日出 (6:0) 为孟加拉历当日起始。Day begins at sunrise.',
			href : 'https://en.wikipedia.org/wiki/Bengali_calendar'
		}, function(date) {
			return date.精 === '年' ? date.to_Bangla({
				format : 'serial'
			})[0] + ' BS' : date.to_Bangla({
				format : 'serial'
			}).slice(0, 3).join('/') + ' BS; ' + date.to_Bangla();
		} ],

		Hebrew : [ {
			a : {
				// gettext_config:{"id":"hebrew-calendar"}
				T : '希伯来历'
			},
			R : 'Hebrew calendar, 犹太历\n日落后为隔日。'
			//
			+ '\na Jewish "day" begins and ends at shkiah (sunset)',
			href : 'https://he.wikipedia.org/wiki/הלוח_העברי'
		}, function(date) {
			return date.精 === '年' ? date.to_Hebrew({
				format : 'serial'
			})[0] + '年' : date.to_Hebrew({
				format : 'serial'
			}).slice(0, 3).join('/') + '; ' + date.to_Hebrew();
		} ],

		Long_Count : [ {
			a : {
				// gettext_config:{"id":"long-count"}
				T : '长纪历'
			},
			R : 'Mesoamerican Long Count calendar / 中美洲马雅长纪历',
			href : 'https://en.wikipedia.org/wiki/'
			//
			+ 'Mesoamerican_Long_Count_calendar'
		}, function(date) {
			return CeL.Maya_Date.to_Long_Count(date)
			//
			+ (date.精 === '年' ? '–' : '');
		} ],

		// TODO: 马雅 Short Count
		// https://en.wikipedia.org/wiki/Maya_calendar#Short_Count

		Tzolkin : [ {
			a : {
				// gettext_config:{"id":"maya-tzolk-in"}
				T : "Maya Tzolk'in"
			},
			R : "中美洲马雅 Tzolk'in 历",
			href : "https://en.wikipedia.org/wiki/Tzolk'in",
			S : 'font-size:.8em;'
		}, function(date) {
			return CeL.Maya_Date.to_Tzolkin(date)
			//
			+ (date.精 === '年' ? '–' : '');
		} ],

		Haab : [ {
			a : {
				// gettext_config:{"id":"maya-haab"}
				T : "Maya Haab'"
			},
			R : "中美洲马雅 Haab' 历",
			href : "https://en.wikipedia.org/wiki/Haab'",
			S : 'font-size:.8em;'
		}, function(date) {
			return CeL.Maya_Date.to_Haab(date) + (date.精 === '年' ? '–' : '');
		} ],

		Dai : [ {
			a : {
				// gettext_config:{"id":"dai-calendar"}
				T : '傣历',
			},
			R : '西双版纳傣历纪元始于公元638年3月22日，可转换之范围于傣历714年（1352/3/28–）至3190年期间内。\n'
			//
			+ '傣历有0年。非精确时，可能有最多前后2年的误差。',
			href : 'https://zh.wikipedia.org/wiki/傣历'
		}, function(date) {
			var dai;
			return date - CeL.Dai_Date.epoch < 0
			// 超出可转换之范围。
			|| isNaN((dai = date.to_Dai({
			// format : 'serial'
			}))[0]) ? {
				// gettext_config:{"id":"c.-$1"}
				T : [ '约%1年', date.to_Dai({
					ignore_year_limit : true
				})[0] ]
			} : date.精 === '年' ? dai[0] + '年' : dai.slice(0, 3).join('/')
			//
			+ '(周' + (date.getDay() + 1) + ')' + (dai[3] ? ' ' + dai[3] : '');
		} ],

		Myanmar : [ {
			a : {
				// gettext_config:{"id":"myanmar-calendar"}
				T : 'မြန်မာ ပြက္ခဒိန်',
			},
			R : '缅甸历法. Myanmar calendar, Burmese calendar.\n'
			//
			+ '缅历有0年。非精确时，可能有最多前后2日的误差。\n'
			//
			+ '本工具所使用之演算法仅适用于缅历0年至1500年。',
			href : 'https://en.wikipedia.org/wiki/Burmese_calendar'
		}, function(date) {
			if (date.精 === '年')
				return 'ME' + date.to_Myanmar({
					format : 'serial'
				})[0];

			var Myanmar_date = date.to_Myanmar({
				notes : true,
				format : 'serial'
			});

			var result = [ Myanmar_date.slice(0, 3).join('/'), '; ',
			//
			date.to_Myanmar().slice(0, 3).join(' '), {
				br : null
			}, {
				span : date.to_Myanmar({
					locale : 'my'
				}).join(' '),
				C : 'Myanmar'
			} ], notes;

			// calendar notes. Myanmar Astrological Calendar Days.
			if (Myanmar_date.notes) {
				result.push({
					br : null
				}, {
					span : notes = [],
					C : 'notes Myanmar'
				});
				Myanmar_date.notes.forEach(function(note) {
					if (note.includes('Thingyan') || note.includes('New year'))
						note = {
							b : note,
							S : 'color:#853;'
						};
					notes.push(note, {
						b : ', ',
						S : 'color:#15e;'
					});
				});
				notes.pop();
			}

			// only for Myanmar year 2 to 1500
			// https://github.com/yan9a/mcal/blob/master/mc_main_m.js
			// BY:2,EY:1500
			if (!(Myanmar_date[0] >= 2) || !(Myanmar_date[0] <= 1500)) {
				result = {
					span : result,
					S : 'color:#888 !important'
				};
			}

			return result;
		} ],

		Yi : [ {
			a : {
				// gettext_config:{"id":"yi-calendar"}
				T : '彝历',
			},
			R : '彝族十月太阳历。采岁末过年日以冬至起头之法，而非采四年一闰法！\n'
			//
			+ '彝历一日分12时段，自当天拂晓前鸡鸣起。\n'
			//
			+ '若公元12月27日对彝历1月1日，则自公元12月27日约凌晨3点起跨入彝历1月1日。\n' +
			//
			'过年日于历算法中，古称「岁余日」。',
			href : 'https://zh.wikipedia.org/wiki/彝历'
		}, function(date) {
			var yi;
			// 超出可转换之范围。
			return isNaN((yi = date.to_Yi({
			// format : 'serial'
			}))[0]) ? {
				// gettext_config:{"id":"c.-$1"}
				T : [ '约%1年', date.to_Yi({
					ignore_year_limit : true
				})[0] ]
			} : date.精 === '年' ? yi[0] + '年' : yi.slice(0, 3).join('/')
			//
			+ '; ' + date.to_Yi({
				format : 'name'
			});
		} ],

		Hindu : [ {
			a : {
				// gettext_config:{"id":"hindu-calendar"}
				T : 'हिन्दू पंचांग',
			},
			R : 'Hindu calendar, 印度历, 自日出起算。'
			//
			+ '\n日出 (6:0) 为印度历当日起始。Day begins at sunrise.',
			href : 'https://en.wikipedia.org/wiki/Hindu_calendar'
		}, function(date) {
			if (date.精 === '年')
				return 'Saka ' + date.to_Hindu({
					era : 'Saka',
					format : 'serial'
				})[0] + '年';

			var Hindu_date = date.to_Hindu({
				era : 'Saka',
				// epithet : [ '闰', '', '缺' ],
				note : true,
				format : 'serial'
			}), named_date = date.to_Hindu({
				era : 'Saka'
			});
			return [ 'Saka ' + Hindu_date.slice(0, 3).join('/'), {
				br : null
			}, {
				span : named_date[0],
				R : 'year'
			}, ' ', {
				span : named_date[1],
				R : 'month',
				S : 'color:#4a2;'
			}, ' ', {
				span : named_date[2],
				R : 'date',
				S : 'color:#633;'
			}, {
				br : null
			}, ' Nakṣatra: ' + Hindu_date.Nakṣatra, {
				br : null
			}, 'Vāsara: ' + Hindu_date.Vāsara ];
		} ],

		Indian_national : [ {
			a : {
				// gettext_config:{"id":"indian-national-calendar"}
				T : 'भारतीय राष्ट्रीय पंचांग'
			},
			R : '印度国定历, Indian national calendar',
			href : 'https://en.wikipedia.org/wiki/Indian_national_calendar'
		}, function(date) {
			return date.精 === '年' ? date.to_Indian_national({
				format : 'serial'
			})[0] + '年' : date.to_Indian_national({
				format : 'serial'
			}).slice(0, 3).join('/')
			//
			+ '; ' + date.to_Indian_national();
		} ],

		// Chinese Buddhist calendar
		Buddhist : [ {
			a : {
				// gettext_config:{"id":"chinese-buddhist"}
				T : '佛历'
			},
			R : '佛纪，1911–。佛历年 = 公历年 + 543，若过佛诞日（印度历二月初八，农历四月初八。）再加1年。\n'
			//
			+ '有采用0年。非精确时，可能有最多前后一年的误差。',
			href : 'https://zh.wikipedia.org/wiki/佛历'
		}, function(date) {
			var year = date.getFullYear() | 0;
			if (year < 1911) {
				year += 543;
				if (date.getMonth() >= 4)
					year++;
				return {
					// gettext_config:{"id":"c.-$1"}
					T : [ '约%1年', year ]
				};
			}

			var era = CeL.era('中历', {
				get_era : true
			});
			if (date - era.start > 0) {
				era = era.Date_to_date_index(date);
				// 过佛诞日（农历四月初八）再加1年。
				// era: index (0~)
				if (era[1] > 3 || era[1] === 3 && era[2] >= 7)
					year++;
			}
			return (year + 543) + (date.精 === '年' ? '年' : '/'
			//
			+ (date.getMonth() + 1) + '/' + date.getDate());
		} ],

		Nanakshahi : [ {
			a : {
				// gettext_config:{"id":"nanakshahi-calendar"}
				T : 'ਨਾਨਕਸ਼ਾਹੀ'
			},
			R : 'Nanakshahi calendar, 印度锡克教日历, ナーナク暦. ਨਾਨਕਸ਼ਾਹੀ ਕੈਲੰਡਰ'
			//
			+ '\nAdopted in 2003/3/14 CE (535/1/1 NS). 自 2003 行用。',
			href : "https://en.wikipedia.org/wiki/Nanakshahi_calendar"
		}, function(date) {
			return date.精 === '年' ? date.to_Nanakshahi({
				format : 'serial'
			})[0] + ' NS' : date.to_Nanakshahi({
				format : 'serial'
			}).slice(0, 3).join('/') + ' NS; ' + date.to_Nanakshahi();
		} ],

		Bahai : [ {
			a : {
				// gettext_config:{"id":"bahá-í-calendar"}
				T : 'گاه‌شماری بهائی'
			},
			R : "Bahá'í / Badí‘ calendar, 巴哈伊历",
			// https://fa.wikipedia.org/wiki/گاه‌شماری_بهائی
			href : "https://en.wikipedia.org/wiki/Bahá'í_calendar"
		}, function(date) {
			return date.精 === '年' ? date.to_Bahai({
				format : 'serial'
			}).slice(0, 2).join('-') + '年' : date.to_Bahai({
				format : 'serial'
			}).slice(0, 5).join('/') + '; ' + date.to_Bahai();
		} ],

		Coptic : [ {
			a : {
				// gettext_config:{"id":"coptic-calendar"}
				T : '科普特历'
			},
			R : 'Coptic calendar,'
			//
			+ ' 纪年纪月纪日与 Diocletian era (Era of the Martyrs) 相同。',
			href : 'https://en.wikipedia.org/wiki/Coptic_calendar'
		}, function(date) {
			return date.精 === '年' ? date.to_Coptic({
				format : 'serial'
			})[0] + '年' : date.to_Coptic({
				format : 'serial'
			}).slice(0, 3).join('/') + '; ' + date.to_Coptic();
		} ],

		Ethiopian : [ {
			a : {
				// gettext_config:{"id":"ethiopian-calendar"}
				T : '衣索比亚历'
			},
			R : 'Ethiopian calendar',
			href : 'https://en.wikipedia.org/wiki/Ethiopian_calendar'
		}, function(date) {
			return date.精 === '年' ? date.to_Ethiopian({
				format : 'serial'
			})[0] + '年' : date.to_Ethiopian({
				format : 'serial'
			}).slice(0, 3).join('/') + '; ' + date.to_Ethiopian();
		} ],

		Armenian : [ {
			a : {
				// gettext_config:{"id":"armenian-calendar"}
				T : '教会亚美尼亚历'
			},
			R : 'year / month / date, weekday\n'
			//
			+ 'Armenian calendar, 教会亚美尼亚历法, Հայկական եկեղեցական տոմար',
			href : 'https://hy.wikipedia.org/wiki/Հայկական_եկեղեցական_տոմար'
		}, function(date) {
			return date.精 === '年' ? date.to_Armenian({
				format : 'serial'
			})[0] + '年' : date.to_Armenian({
				format : 'serial'
			}).slice(0, 3).join('/') + '; ' + date.to_Armenian({
				format : 'name'
			});
		} ],

		Byzantine : [ {
			a : {
				// gettext_config:{"id":"byzantine-calendar"}
				T : 'Byzantine calendar'
			},
			R : 'Byzantine Creation Era',
			href : 'https://en.wikipedia.org/wiki/Byzantine_calendar',
			S : 'font-size:.8em;'
		}, function(date) {
			return date.精 === '年' ? date.to_Byzantine({
				format : 'serial'
			})[0] + '年' : date.to_Byzantine({
				format : 'serial'
			}).slice(0, 3).join('/') + '; ' + date.to_Byzantine();
		} ],

		Egyptian : [ {
			a : {
				// gettext_config:{"id":"egyptian-calendar"}
				T : '古埃及历'
			},
			R : 'Ancient civil Egyptian calendar. 每年皆为准确的365日。'
			//
			+ '\nThe first 6th epagomenal day is 22/8/29 BCE.'
			//
			+ '\nThe year is meaningless,'
			//
			+ ' it is just slightly synchronize with the common era.',
			href : 'https://en.wikipedia.org/wiki/Egyptian_calendar'
		}, function(date) {
			if (date.精 === '年')
				return {
					// gettext_config:{"id":"c.-$1"}
					T : [ '约%1年', date.to_Egyptian({
						format : 'serial'
					})[0] ]
				};

			var tmp = date.to_Egyptian({
				format : 'serial'
			}).slice(0, 3),
			//
			season_month = CeL.Egyptian_Date
			//
			.season_month(tmp[1]);

			date = tmp.join('/') + '; ' + tmp[0] + ' '
			//
			+ CeL.Egyptian_Date.month_name(tmp[1]);
			tmp = ' ' + tmp[2];
			if (season_month)
				date = [ date, {
					sub : ' (' + season_month + ')',
					S : 'color:#291;'
				}, tmp ];
			else
				date += tmp;

			return date;
		} ],

		Republican : [ {
			a : {
				// gettext_config:{"id":"french-republican-calendar"}
				T : 'Calendrier républicain'
			},
			R : 'Le calendrier républicain,'
			//
			+ ' ou calendrier révolutionnaire français.\n'
			//
			+ '每年第一天都从法国秋分日开始。法国共和历行用期间 1792/9/22–1805/12/31，'
			//
			+ '后来巴黎公社 1871/5/6–23 曾一度短暂恢复使用。',
			href : 'https://fr.wikipedia.org/wiki/Calendrier_républicain'
		}, function(date) {
			return date.精 === '年' ? date.to_Republican({
				format : 'serial'
			})[0] + '年' : date.to_Republican({
				format : 'serial'
			}).slice(0, 3).join('/') + '; ' + date.to_Republican();
		} ],

		// --------------------------------------------------------------------
		// 中国传统历法 Chinese calendar, 太阴太阳暦
		// https://zh.wikipedia.org/wiki/阴阳历
		// gettext_config:{"id":"east-asian-calendar"}
		"东亚阴阳历" : [ 'East Asian lunisolar calendar. '
		//
		+ '中国、日本、朝鲜历代计算日期的方法。计算得出，不一定是实暦。',
		//
		[ '夏、商、西周观象授时，本工具于这些历法采用天文演算，较耗时间。', {
			b : [ '实际天象可选用上方「', {
				// gettext_config:{"id":"solar-term-(astronomical)"}
				T : '天文节气'
			}, '」、「', {
				// gettext_config:{"id":"lunar-phase"}
				T : '月相'
			}, '」栏。' ]
		}, '「', {
			// gettext_config:{"id":"lunar-phase"}
			T : '月相'
		}, '」栏并附注可能之日月食。' ] ],

		"天文夏历" : [ {
			a : {
				// gettext_config:{"id":"astronomical-chinese-lunisolar"}
				T : '天文夏历'
			},
			R : 'traditional Chinese lunisolar calendar.'
			//
			+ '\n当前使用之农历/阴历/夏历/黄历历法. 计算速度较慢！'
			//
			+ '\n以定气定朔无中置闰规则计算得出之纪元使用当地、当日零时之传统定朔历法（阴阳历），非实历。预设岁首为建寅。',
			href : 'https://zh.wikipedia.org/wiki/农历',
			S : 'font-size:.7em;'
		}, add_阴阳暦() ],

		"天文殷历" : [ {
			a : {
				T : '天文殷历'
			},
			R : '以定气定朔无中置闰规则计算得出，非实历。殷历预设岁首为建丑。计算速度较慢！',
			href : 'https://zh.wikipedia.org/wiki/古六历',
			S : 'font-size:.7em;'
		}, add_阴阳暦('丑') ],

		"天文周历" : [ {
			a : {
				T : '天文周历'
			},
			R : '以定气定朔无中置闰规则计算得出，非实历。周历预设岁首为建子。计算速度较慢！',
			href : 'https://zh.wikipedia.org/wiki/古六历',
			S : 'font-size:.7em;'
		}, add_阴阳暦('子') ],

		// http://www.bsm.org.cn/show_article.php?id=2372 许名玱 青川郝家坪秦牍《田律》历日考释
		"黄帝历" : add_历法('黄帝历',
				'非黄帝纪元。古六历之一，年终置闰称闰月。复原推得，与实历恐有数日误差。应为战国初创制，仅行用于战国时期。'),
		"颛顼历" : add_历法('颛顼历', '古六历之一，年终置闰称后九月。复原推得，与实历恐有数日误差。应为战国初创制，行用于战国至秦朝。'),
		"古夏历" : add_历法('古夏历',
				'非今夏历。古六历之一，年终置闰称闰月。复原推得，与实历恐有数日误差。应为战国初创制，仅行用于战国时期。',
				'夏历 (古六历)'),
		"殷历" : add_历法('殷历', '古六历之一，年终置闰称闰月。复原推得，与实历恐有数日误差。应为战国初创制，仅行用于战国时期。'),
		"周历" : add_历法('周历', '古六历之一，年终置闰称闰月。复原推得，与实历恐有数日误差。应为战国初创制，仅行用于战国时期。'),
		"鲁历" : add_历法('鲁历', '古六历之一，年终置闰称闰月。复原推得，与实历恐有数日误差。应为战国初创制，仅行用于战国时期。'),

		// http://www.bsm.org.cn/show_article.php?id=2262
		// 许名玱 汉简历日考征（三）——气朔篇（太初历之一）
		太初历 : add_历法('太初历', '从汉武帝太初元年夏五月（前104年）至后汉章帝元和二年二月甲寅（85年），太初历共实行了188年。'),
		后汉四分历 : add_历法('后汉四分历', '东汉章帝元和二年二月四日甲寅至曹魏青龙五年二月末（东吴用至黄武二年）施用《四分历》。'),
		乾象历 : add_历法('乾象历', '三国东吴孙权黄武二年正月（223年）施行，直到天纪三年（280年）东吴灭亡。'),
		景初历 : add_历法('景初历',
				'魏明帝景初元年（237年）施行。南北朝刘宋用到444年，被《元嘉历》取代。北魏用到451年，被《玄始历》取代。'),
		三纪历 : add_历法('三纪历', '姜岌在十六国后秦白雀元年（384年）编制。同年起施行三十多年。'),
		玄始历 : add_历法('玄始历', '北凉、北魏于452年用玄始历、元始历至正光三年（522年）施行《正光历》。'),
		元嘉历 : add_历法('元嘉历', [ '刘宋二十二年，普用元嘉历。梁武帝天监九年（510年）被《大明历》取代。',
				'文武天皇元年（697年）からは元嘉暦を廃して仪凤暦を正式に采用することとなった。' ]),
		大明历 : add_历法('大明历', [ '大明历，亦称「甲子元历」。梁天监九年（510年）施行至陈后主祯明三年（589年）。',
				'惟实历陈永定3年闰4月，太建7年闰9月；与之不甚合。' ], '大明历_(祖冲之)'),
		正光历 : add_历法('正光历', '魏孝明帝改元正光，于正光三年（522年）施行。兴和二年被《兴和历》取代。'),
		兴和历 : add_历法('兴和历', '正光三年（522年）施行到东魏灭亡。'),
		天保历 : add_历法('天保历', '天保元年施用至齐幼主承光元年（577年）', '天保历_(中国)'),
		天和历 : add_历法('天和历', '北周天和元年（566年）采用甄鸾《天和历》。施用至宣政元年（578年）'),
		大象历 : add_历法('大象历',
				'北周大象元年（579年）太史上士马显等撰写了新历《丙寅元历》取代《天和历》，颁用至隋文帝开皇四年（584年）'),
		开皇历 : add_历法('开皇历', '隋开皇四年（584年）张宾修订，颁用至开皇十六年（596年）。'),
		大业历 : add_历法('大业历', '隋开皇十七年（597年）张胄玄撰，颁用至大业四年（608年）'),
		平朔戊寅元历 : add_历法('平朔戊寅元历',
				'采用定朔法，贞观十九年（645年）之后采用平朔法。麟德元年（664年），被《麟德历》取代。', '戊寅元历'),
		平朔仪凤暦 : add_历法(
				'平朔仪凤暦',
				'文武天皇元年（697年）から仪凤暦が単独で用いられるようになった（ただし、前年の持统天皇10年说・翌年の文武天皇2年说もある）。ただし、新暦の特徴の1つであった进朔は行われなかったとされている。その后67年间使用されて、天平宝字8年（764年）に大衍暦に改暦された。',
				'仪凤暦'),

		// --------------------------------------------------------------------
		// 列具历注, 具注历谱, calendar notes
		// gettext_config:{"id":"calendar-note"}
		"历注" : '具注历日/历书之补充注释，常与风水运势、吉凶宜忌相关。',
		// TODO: 农民历, 暦注计算 http://koyomi8.com/sub/rekicyuu.htm
		// TODO: http://www.bsm.org.cn/show_article.php?id=543
		// 李贤注：“历法，春三月己巳、丁丑，夏三月甲申、壬辰，秋三月己亥、丁未，冬三月甲寅、壬戌，为八魁。”
		// TODO: 天李、入官忌、日忌和归忌
		// TODO: [[数九]]: 从冬至开始每过九天记为一九，共记九九
		// 后汉书注 苏竟杨厚列传 「八魁」注称:「春三月己巳、丁丑,夏三月甲申、壬辰,秋三月己亥、丁未,冬三月甲寅、壬戌,为八魁。」
		// see 钦定协纪辨方书
		// http://www.cfarmcale2100.com.tw/
		// http://www.asahi-net.or.jp/~ax2s-kmtn/ref/calendar_j.html#zassetsu
		// http://www.asahi-net.or.jp/~ax2s-kmtn/ref/astrology_j.html
		// 值年太岁星君: https://zh.wikipedia.org/wiki/%E5%A4%AA%E6%AD%B2

		// 没灭日 大小歳/凶会 下段 雑注 日游 节月
		// http://www.wagoyomi.info/guchu.cgi

		// gettext_config:{"id":"month-of-the-sexagenary-cycle"}
		"月干支" : [ {
			a : {
				// gettext_config:{"id":"month-of-the-sexagenary-cycle"}
				T : '月干支'
			},
			R : '月干支/大小月。此为推算所得，于部分非寅正起始之年分可能有误！'
			//
			+ '\n警告：仅适用于中历、日本之旧暦与纪年！对其他纪年，此处之值可能是错误的！',
			href : 'https://zh.wikipedia.org/wiki/干支#干支纪月',
			S : 'font-size:.7em;'
		}, function(date) {
			return (date.月干支 || '') + (date.大小月 || '');
		} ],

		// gettext_config:{"id":"day-of-the-sexagenary-cycle"}
		"日干支" : [ function(era_name) {
			return era_name && era_name.includes('月') ? {
				a : {
					// gettext_config:{"id":"day-of-the-sexagenary-cycle"}
					T : '日干支'
				},
				R : '警告：仅适用于中历、日本之旧暦与纪年！对其他纪年，此处之值可能是错误的！',
				href : 'https://zh.wikipedia.org/wiki/干支#干支纪日',
				S : 'font-size:.7em;'
			} : {
				T : '朔日',
				R : '实历每月初一之朔日。若欲求天文朔日，请采「'
				// gettext_config:{"id":"lunar-phase"}
				+ _('月相') + '」栏。'
			};
		}, function(date) {
			return /* !date.准 && */!date.精 && date.format({
				format : '%日干支',
				locale : CeL.gettext.to_standard('Chinese')
			});
		} ],

		Chinese_solar_terms : [ {
			a : {
				// gettext_config:{"id":"solar-term-(chinese)"}
				T : '明清节气'
			},
			R : '明朝、清朝 (1516–1941 CE) 之中国传统历法实历节气 from 时间规范资料库.\n'
			//
			+ '以清朝为主。有些严重问题须注意，见使用说明。',
			href : 'http://140.112.30.230/datemap/reference.php'
		}, function(date) {
			if (/* date.准 || */date.精)
				return;

			initialize_thdl_solar_term && initialize_thdl_solar_term();

			var year = date.getFullYear();
			if (year < thdl_solar_term.start)
				return;

			var time, year_data = thdl_solar_term[year];
			if (!year_data
			//
			|| (time = date.getTime()) < year_data[0])
				// 试试看前一年。
				year_data = thdl_solar_term[--year];

			year_data = year_data && CeL.SOLAR_TERMS[year_data.indexOf(time)];
			if (year_data)
				return date.getFullYear() < thdl_solar_term.准 ? {
					span : year_data,
					R : '推算所得，非实历。',
					S : 'color:#888;'
				} : year_data;
		} ],

		// 日柱的五行 日の五行 : 以六十甲子纳音代
		"日纳音" : [ {
			a : {
				T : '日纳音'
			},
			R : '六十甲子纳音、纳音五行。中历历注、日本の暦注の一つ。\n'
			//
			+ '日纳音较月纳音、年纳音常用。司马雄 民俗宝典·万年历 称日纳音为五行',
			href : 'https://zh.wikipedia.org/wiki/纳音'
		}, function(date) {
			return /* !date.准 && */!date.精 && CeL.era.纳音(date);
		} ],

		"月纳音" : [ {
			a : {
				T : '月纳音'
			},
			R : '中历历注。纳音五行',
			href : 'https://zh.wikipedia.org/wiki/纳音'
		}, function(date) {
			return /* !date.准 && */!date.精 && CeL.era.纳音(date, '月');
		} ],

		// e.g., 毛耀顺主编《中华五千年长历》 "纳音属水"
		"年纳音" : [ {
			a : {
				T : '年纳音'
			},
			R : '中历历注。纳音五行',
			href : 'https://zh.wikipedia.org/wiki/纳音'
		}, function(date) {
			return /* !date.准 && */!date.精 && CeL.era.纳音(date, '年');
		} ],

		// http://koyomi8.com/sub/rekicyuu_doc01.htm#jyuunicyoku
		//
		// 钦定四库全书 御定星厯考原卷五 日时总类 月建十二神
		// http://ctext.org/wiki.pl?if=en&chapter=656830
		// 厯书曰厯家以建除满平定执破危成收开闭凡十二日周而复始观所值以定吉凶每月交节则叠两值日其法从月建上起建与斗杓所指相应如正月建寅则寅日起建顺行十二辰是也
		//
		// 钦定协纪辨方书·卷四
		// https://archive.org/details/06056505.cn
		//
		// http://blog.sina.com.cn/s/blog_3f5d24310100gj7a.html
		// http://blog.xuite.net/if0037212000/02/snapshot-view/301956963
		// https://sites.google.com/site/chailiong/home/zgxx/huangli/huandao
		"建除" : [ {
			a : {
				// gettext_config:{"id":"jianchu"}
				T : '建除'
			},
			R : '中历历注、日本の暦注の一つ。(中段十二直)'
			//
			+ '\n建除十二神(十二值位/十二值星/通胜十二建)、血忌等，都被归入神煞体系。'
			//
			+ '\n交节采天文节气，非实历。',
			href : 'https://zh.wikipedia.org/wiki/建除十二神',
			S : 'font-size:.8em;'
		}, function(date) {
			if (/* date.准 || */date.精)
				return;

			var JD = CeL.Date_to_JD(date.offseted_value());

			var 建除 = CeL.stem_branch_index(date)
			// .5: 清明、立夏之类方为"节"，因此配合节气序，需添加之 offset。
			// 添上初始 offset (9) 并保证 index >= 0。
			// -1e-8: 交节当日即开始叠。因此此处之 offset 实际上算到了当日晚 24时，属明日，需再回调至当日晚。
			+ 建除_LIST.length + 9 + .5 - 1e-8
			// 交节则叠两值日。采天文节气，非实历。
			// 30 = TURN_TO_DEGREES / (SOLAR_TERMS_NAME / 2)
			// = 360 / (24 / 2)
			- CeL.solar_coordinates(JD + 1).apparent / 30 | 0;
			建除 = 建除_LIST[建除 % 建除_LIST.length]
			return 建除 === '建' ? {
				span : 建除,
				S : 'color:#f24;font-weight:bold;'
			} : 建除;
		} ],

		"伏腊" : [ {
			a : {
				T : '伏腊'
			},
			R : '中历历注。伏腊日: 三伏日+腊日+起源自佛教之腊八节\n'
			//
			+ '尹湾汉墓简牍论考: 秦汉之前无伏腊。秦汉时伏腊尚无固定规则，此处所列仅供参考。或在汉成帝鸿嘉年间已成历例。'
			//
			+ '\n交节采天文节气，非实历。',
			href : 'https://zh.wikipedia.org/wiki/三伏'
		}, function(date) {
			if (/* date.准 || */date.精)
				return;

			var JD = CeL.Date_to_JD(date.offseted_value()),
			//
			solar_term = CeL.solar_term_of_JD(JD, {
				days : true
			}), 干支轮序;

			if (7 <= solar_term[1] && solar_term[1] <= 10) {
				// 三伏天: solar_term[1] @ 小暑(7)~处暑(10)
				// 入伏=初伏第一天 @ 小暑(7)
				// 中伏第一天 @ 小暑(7)~大暑(8)
				// 末伏第一天 @ 立秋(9)
				// 出伏

				if (9 <= solar_term[1]
				//
				&& (干支轮序 = 节气后第几轮干支(date, JD, 9, '庚'))) {
					if (干支轮序[0] === 0) {
						return '末伏';
					}
					if (干支轮序[0] === 1 && 干支轮序[1] === 0) {
						// 出伏，即伏天结束。
						return '出伏';
					}
					if (!(干支轮序[0] < 0)) {
						return;
					}
				}
				// 夏至(6)
				干支轮序 = 节气后第几轮干支(date, JD, 6, '庚');
				if (!干支轮序 || !(2 <= 干支轮序[0])) {
					return;
				}
				if (干支轮序[0] === 2) {
					return 干支轮序[1] === 0 ? '入伏' : '初伏';
				}
				// 中伏可能为10天或20天。
				return '中伏';
			}

			if (solar_term[1] === 19 || solar_term[1] === 20) {
				// 腊日: solar_term[1] @ 小寒(19) or 大寒(20)
				// 冬至(18)后第三个戌日为腊日
				干支轮序 = 节气后第几轮干支(date, JD, 18, '戌');
				// return 干支轮序 && 干支轮序.join(', ')
				if (干支轮序 && 干支轮序[0] === 2 && 干支轮序[1] === 0) {
					return {
						T : '腊日',
						R : '《说文‧肉部》：「腊，冬至后三戌腊祭百神。」非起源自佛教之腊八节！'
					};
				}
			}

			// gettext_config:{"id":"china"}
			if (date.国家 === '中国' && date.月 === 12 && date.日 === 8) {
				return {
					T : '腊八节',
					R : '起源自佛教之腊八节'
				};
			}
		} ],

		"反支" : [ {
			a : {
				T : '反支'
			},
			R : '中历历注。反枳（反支）依睡虎地《日书》（12日一反支）和孔家坡《日书》（6日一反支，独属孔家坡者以淡色标示。）'
			//
			+ '\n警告：仅适用于中历、日本之旧暦与纪年！对其他纪年，此处之值可能是错误的！',
			href : 'http://www.bsm.org.cn/show_article.php?id=867',
			S : 'font-size:.8em;'
		}, function(date) {
			return /* !date.准 && */!date.精 && CeL.era.反支(date, {
				span : '反支',
				S : 'color:#888;'
			});
		} ],

		"血忌" : [ {
			a : {
				T : '血忌'
			},
			R : '中历历注。血忌在唐宋历书中仍为典型历注项目，后世因之，直至清末，其推求之法及吉凶宜忌都无改变。血忌被归入神煞体系。',
			href : 'http://shc2000.sjtu.edu.cn/030901/lishu.htm',
			S : 'font-size:.8em;'
		}, function(date) {
			return /* !date.准 && */!date.精 && CeL.era.血忌(date);
		} ],

		"孟仲季" : [ {
			a : {
				// 十二月律
				T : '孟仲季月'
			},
			R : '孟仲季之月名别称, 孟仲季+春夏秋冬',
			href : 'https://zh.wikipedia.org/wiki/十二律#音律与历法的配合',
			S : 'font-size:.8em;'
		}, function(date) {
			var 孟仲季 = /* !date.准 && */!date.精 && CeL.era.孟仲季(date);
			if (孟仲季) {
				return CeL.era.季(date, {
					icon : true
				}) + 孟仲季;
			}
		} ],

		"月律" : [ {
			a : {
				T : '十二月律'
			},
			R : '十二月律',
			href : 'https://zh.wikipedia.org/wiki/十二律',
			S : 'font-size:.8em;'
		}, function(date) {
			return /* !date.准 && */!date.精 && CeL.era.月律(date);
		} ],

		// gettext_config:{"id":"japanese-month-name"}
		"月の别名" : [ {
			a : {
				// gettext_config:{"id":"japanese-month-name"}
				T : '月の别名'
			},
			R : '各月の别名',
			href : 'https://ja.wikipedia.org/wiki/日本の暦'
			// #各月の别名
			+ '#.E5.90.84.E6.9C.88.E3.81.AE.E5.88.A5.E5.90.8D',
			S : 'font-size:.8em;'
		}, function(date) {
			return /* !date.准 && */!date.精 && CeL.era.月の别名(date);
		} ],

		"六曜" : [ {
			a : {
				// gettext_config:{"id":"6-luminaries"}
				T : '六曜'
			},
			R : '日本の暦注の一つ。\n警告：仅适用于日本之旧暦与纪年！对其他国家之纪年，此处之六曜值可能是错误的！'
			//
			+ '\n六辉（ろっき）や宿曜（すくよう）ともいうが、これは七曜との混同を避けるために、明治以后に作られた名称である。',
			href : 'https://ja.wikipedia.org/wiki/六曜',
			S : 'font-size:.8em;'
		}, function(date) {
			return /* !date.准 && */!date.精 && CeL.era.六曜(date);
		} ],

		"七曜" : [ {
			a : {
				// gettext_config:{"id":"7-luminaries"}
				T : '七曜'
			},
			R : '中历历注、日本の暦注の一つ。',
			href : 'https://ja.wikipedia.org/wiki/曜日',
			S : 'font-size:.8em;'
		}, function(date) {
			return /* !date.准 && */!date.精 && CeL.era.七曜(date);
		} ],

		// 暦注上段
		"曜日" : [ {
			a : {
				// gettext_config:{"id":"week-day-(japanese)"}
				T : '曜日'
			},
			R : '日本の暦注の一つ, Japanese names of week day',
			href : 'https://ja.wikipedia.org/wiki/曜日'
		}, function(date) {
			var 七曜 = /* !date.准 && */!date.精 && CeL.era.七曜(date);
			return 七曜 && {
				// gettext_config:{"id":"week-day-(japanese)"}
				span : 七曜 + '曜日',
				S : 七曜 === '日' ? 'color:#f34'
				//
				: 七曜 === '土' ? 'color:#2b3' : ''
			};
		} ],

		"年禽" : [ {
			a : {
				T : '年禽'
			},
			R : '中历历注。二十八宿年禽。见演禽诀。',
			href : 'http://blog.sina.com.cn/s/blog_4aacc33b0100b8eh.html'
		}, function(date) {
			return /* !date.准 && */!date.精 && CeL.era.二十八宿(date, '年');
		} ],

		"月禽" : [ {
			a : {
				T : '月禽'
			},
			R : '中历历注。二十八宿年禽。见演禽诀。',
			href : 'http://blog.sina.com.cn/s/blog_4aacc33b0100b8eh.html'
		}, function(date) {
			return /* !date.准 && */!date.精 && CeL.era.二十八宿(date, '月');
		} ],

		/**
		 * 廿八宿禽 日禽
		 * 
		 * @see <a
		 *      href="https://ja.wikipedia.org/wiki/%E6%9A%A6%E6%B3%A8%E4%B8%8B%E6%AE%B5"
		 *      accessdate="2015/3/7 13:52">暦注下段</a>
		 *      https://zh.wikisource.org/wiki/演禽通纂_(四库全书本)/全览
		 */
		// gettext_config:{"id":"28-mansions"}
		"二十八宿" : [ {
			a : {
				// gettext_config:{"id":"28-mansions"}
				T : '二十八宿'
			},
			R : '中历历注、日本の暦注の一つ。又称二十八舍、二十八星、禽星或日禽。见演禽诀。'
			//
			+ '28 Mansions, 28 asterisms.',
			href : 'https://zh.wikipedia.org/wiki/二十八宿',
			S : 'font-size:.8em;'
		}, function(date) {
			return /* !date.准 && */!date.精 && CeL.era.二十八宿(date);
		} ],

		// 27宿
		// gettext_config:{"id":"27-mansions"}
		"二十七宿" : [ {
			a : {
				// gettext_config:{"id":"27-mansions"}
				T : '二十七宿'
			},
			R : '日本の暦注の一つ\n警告：仅适用于日本之旧暦与纪年！对其他国家之纪年，此处之值可能是错误的！'
			//
			+ '27 Mansions, 27 asterisms.',
			href : 'https://ja.wikipedia.org/wiki/二十七宿',
			S : 'font-size:.8em;'
		}, function(date) {
			return /* !date.准 && */!date.精 && CeL.era.二十七宿(date);
		} ],

		"日家九星" : [ {
			a : {
				T : '日家九星'
			},
			R : '日本の暦注の一つ。此处采日本算法配合天文节气。',
			href : 'http://koyomi8.com/sub/9sei.htm'
		}, function(date) {
			if (/* date.准 || */date.精)
				return;

			var 九星 = CeL.era.日家九星(date),
			//
			S = 九星.days === 0 ? '#faa' : 九星.闰 ? '#afa'
			//
			: 九星.type === '阴遁' ? '#efa' : '';

			九星 = 九星.九星 + ' ' + 九星.days
			// ↘:阴遁, ↗:阳遁
			+ (九星.type === '阴遁' ? '↘' : '↗');

			return S ? {
				span : 九星,
				S : 'background-color:' + S
			} : 九星;
		} ],

		// http://ctext.org/wiki.pl?if=en&chapter=457831
		// 钦定协纪辨方书·卷八 三元九星
		// https://archive.org/details/06056509.cn
		"月九星" : [ {
			a : {
				T : '月九星'
			},
			R : '三元月九星，每年以立春交节时刻为界，每月以十二节交节时刻为界。此处算法配合天文节气。',
			href : 'https://archive.org/details/06056509.cn'
		}, function(date) {
			// 入中宫
			return CeL.era.月九星(date);
		} ],

		"年九星" : [ {
			a : {
				T : '年九星'
			},
			R : '三元年九星，每年以立春交节时刻为界。此处算法配合天文节气。年月之五代紫白飞星尚无固定规则，至宋方有定制。',
			href : 'https://archive.org/details/06056509.cn'
		}, function(date) {
			// 入中宫
			return CeL.era.年九星(date);
		} ],

		"三元九运" : [ {
			a : {
				T : '三元九运'
			},
			R : '二十年一运，每年以立春交节时刻为界，立春后才改「运」。玄空飞星一派风水三元九运，又名「洛书运」。',
			// http://www.hokming.com/fengshui-edit-threeyuennineyun.htm
			href : 'http://www.twwiki.com/wiki/三元九运',
			S : 'font-size:.8em;'
		}, function(date) {
			return CeL.era.三元九运(date);
		} ],

		// e.g., 毛耀顺主编《中华五千年长历》 "干木支火"
		"年五行" : [ {
			a : {
				T : '年五行'
			},
			R : '阴阳五行纪年',
			href : 'https://zh.wikipedia.org/wiki/五行'
			// #五行与干支表
			+ '#.E4.BA.94.E8.A1.8C.E4.B8.8E.E5.B9.B2.E6.94.AF.E8.A1.A8'
		}, function(date) {
			return [ '干', {
				T : CeL.era.五行(date),
				S : 'color:#2a6;'
			}, '支', {
				T : CeL.era.五行(date, true),
				S : 'color:#2a6;'
			} ];
		} ],

		astrological : [ {
			a : {
				// gettext_config:{"id":"zodiac-sign"}
				T : 'zodiac sign'
			},
			R : 'Astrological signs, Western zodiac signs',
			href : 'https://en.wikipedia.org/wiki/'
			//
			+ 'Astrological_sign#Western_zodiac_signs',
			S : 'font-size:.8em;'
		}, function(date) {
			if (/* date.准 || */date.精)
				return;

			var JD = CeL.Date_to_JD(date.offseted_value());

			// +1: 只要当天达到此角度，即算做此宫。
			var index = CeL.solar_coordinates(JD + 1).apparent / 30 | 0;
			return [ ZODIAC_SYMBOLS[index], CeL.DOM.NBSP, {
				T : ZODIAC_SIGNS[index]
			} ];
		} ],

		// --------------------------------------------------------------------
		// 纪年法/纪年方法。 Cyclic year, year recording/representation method
		// gettext_config:{"id":"year-naming"}
		'Year naming' : '区别与纪录年份的方法，例如循环纪年。',

		岁次 : [ {
			a : {
				// gettext_config:{"id":"year-of-the-sexagenary-cycle"}
				T : '岁次'
			},
			R : '年干支/干支纪年'
			//
			+ '\n警告：仅适用于中历、日本之旧暦与纪年！对其他纪年，此处之值可能是错误的！',
			href : 'https://zh.wikipedia.org/wiki/干支#干支纪年'
		}, function(date) {
			return date.岁次;
		} ],

		生肖 : [ {
			a : {
				// gettext_config:{"id":"chinese-zodiac"}
				T : '生肖'
			},
			R : '十二生肖纪年，属相',
			href : 'https://zh.wikipedia.org/wiki/生肖'
		}, function(date) {
			return CeL.era.生肖(date, true) + CeL.era.生肖(date);
		} ],

		绕迥 : [ {
			a : {
				T : '绕迥'
			},
			R : '藏历(时轮历)纪年法，绕迥（藏文：རབ་བྱུང༌།，藏语拼音：rabqung，威利：rab-byung）\n'
			//
			+ '又称胜生周。第一绕迥自公元1027年开始。\n此处采公历改年而非藏历，可能有最多前后一年的误差。',
			href : 'https://zh.wikipedia.org/wiki/绕迥'
		}, function(date) {
			return CeL.era.绕迥(date);
		} ],

		// --------------------------------------------------------------------
		// 编年法/编年方法。
		// gettext_config:{"id":"year-numbering"}
		'Year numbering' : '以不重复数字计算年份的方法',

		民国 : [ {
			a : {
				// gettext_config:{"id":"minguo"}
				T : '民国'
			},
			R : '民国纪年',
			href : 'https://zh.wikipedia.org/wiki/民国纪年'
		}, Year_numbering(-1911) ],
		// TODO: 黄帝纪元应以农历为主!
		// 1912年1月1日，中华民国临时政府成立，临时大总统孙中山当日就通电：「中华民国改用阳历，以黄帝纪元四千六百零九年十一月十三日为中华民国元年元旦。」
		黄帝 : [
				{
					a : {
						// gettext_config:{"id":"huangdi"}
						T : '黄帝纪元'
					},
					R : '依据中华民国建国时官方认定的黄帝纪元，清末辛亥年（孔子纪元2462年，西元1911年）为黄帝纪元4609年，民国元年为黄帝纪元4610年。黄帝纪元比孔子纪元早2147年，比西元早2698年。',
					href : 'https://zh.wikipedia.org/wiki/黄帝纪元',
					S : 'font-size:.8em;'
				}, Year_numbering(2698) ],

		火空海 : [ {
			a : {
				T : '火空海'
			},
			R : '藏历绕迥纪年始于公元1027年，即时轮经传入西藏的年代，之前的403年使用火空海纪年。',
			href : 'https://zh.wikipedia.org/wiki/火空海'
		}, Year_numbering(-623, true) ],

		皇纪 : [
				{
					a : {
						// gettext_config:{"id":"japanese-imperial-year"}
						T : '皇纪'
					},
					R : '神武天皇即位纪元（じんむてんのうそくいきげん）。略称は皇纪（こうき）という。外にも、皇暦（すめらこよみ、こうれき）、神武暦（じんむれき）、神武纪元（じんむきげん）、日纪（にっき）などともいう。\n神武天皇即位纪元の元年は、キリスト纪元（西暦）前660年である。日本では明治6年（1873年）を纪元2533年と定め公式に使用した。',
					href : 'https://ja.wikipedia.org/wiki/神武天皇即位纪元'
				},
				function(date) {
					if (!kyuureki) {
						// IE8 中，直到执行 affairs() 时 CeL.era 可能还没准备好，
						// 因此 kyuureki === null。
						kyuureki = CeL.era('旧暦', {
							get_era : true
						});
						Koki_year_offset += kyuureki.calendar.start;
					}
					var date_index;
					if (date.精 === '年'
							|| date - kyuureki.start < 0
							|| kyuureki.end - date < 0
							|| !(date_index = kyuureki.Date_to_date_index(date)))
						return Koki_year(date, true);

					date_index[0] += Koki_year_offset;
					date_index[1]++;
					date_index[2]++;
					return date_index.join('/');

				} ],

		檀纪 : [ {
			a : {
				// gettext_config:{"id":"dangi"}
				T : '단군기원'
			},
			R : '단군기원(檀君纪元) 또는 단기(檀纪)',
			href : 'https://ko.wikipedia.org/wiki/단군기원'
		}, Year_numbering(2333) ],
		开国 : [ {
			a : {
				T : '开国'
			},
			R : '朝鲜王朝开国纪年 개국',
			href : 'https://ko.wikipedia.org/wiki/개국_(조선)'
		}, Year_numbering(-1391) ],

		Thai_Buddhist : [ {
			a : {
				// gettext_config:{"id":"thai-buddhist"}
				T : '泰国佛历'
			},
			R : '以佛历纪年(佛灭纪元)之泰国历',
			href : 'https://th.wikipedia.org/wiki/ปฏิทินไทย'
		}, function(date) {
			if (date.精 || date.准) {
				var year = date.getFullYear() + 543;
				return 'พ.ศ. ' + (year - 1) + '–' + year;
			}
			var numeral = CeL.Date_to_Thai(date, {
				format : 'serial'
			}), 生肖 = numeral.生肖 ? ' ' + numeral.生肖 + '年' : '';
			return numeral.准 ? {
				T : 'พ.ศ. ' + numeral[0] + 生肖,
				S : 'color:#888'
			} : {
				T : numeral.join('/') + '; ' + CeL.Date_to_Thai(date) + 生肖
				//
				+ (numeral.holidays ? '; ' + numeral.holidays.join(', ') : ''),
				S : 'color:#000;background-color:'
				//
				+ CeL.Date_to_Thai.weekday_bgcolor[date.getDay()]
			};

			// @deprecated
			var numeral = THAI_Year_numbering(date), tmp = numeral.split('/');
			if (!date.精 && !date.准 && tmp.length === 3)
				numeral = CeL.Date_to_Thai(tmp[2], tmp[1], tmp[0], {
					weekday : date.getDay()
				});
			return numeral;
		} ],

		AUC : [ {
			a : {
				// gettext_config:{"id":"ab-urbe-condita"}
				T : '罗马建城'
			},
			R : 'AUC (Ab urbe condita), 罗马建城纪年. 有采用0年。非精确时。',
			href : 'https://en.wikipedia.org/wiki/Ab_urbe_condita',
			S : 'font-size:.8em;'
		}, Year_numbering(754 - 1, true, false) ],

		Seleucid : [ {
			a : {
				// gettext_config:{"id":"seleucid-era"}
				T : 'Seleucid era'
			},
			R : 'Seleucid era or Anno Graecorum, 塞琉古纪元。非精确时，可能有最多前后一年的误差。',
			href : 'https://en.wikipedia.org/wiki/Seleucid_era',
			S : 'font-size:.8em;'
		}, Year_numbering(311, true) ],

		BP : [ {
			a : {
				// gettext_config:{"id":"before-present"}
				T : 'Before Present'
			},
			R : 'Before Present (BP) years, 距今。非精确时。usage: 2950±110 BP.',
			href : 'https://en.wikipedia.org/wiki/Before_Present'
		}, Year_numbering(1950, true, true, true) ],

		HE : [ {
			a : {
				// gettext_config:{"id":"holocene-calendar"}
				T : 'Holocene calendar'
			},
			R : 'Holocene calendar, 全新世纪年或人类纪年。'
			//
			+ '在公历年数上多加 10000。有采用0年。 1 BCE = 10000 HE',
			href : 'https://en.wikipedia.org/wiki/Holocene_calendar'
		}, Year_numbering(10000) ]

	};

	calendar_columns = Object.create(null);
	calendar_column_alias = Object.create(null);
	o = null;
	for (i in list) {
		if (Array.isArray(list[i])
		//
		&& typeof list[i][1] === 'function')
			calendar_columns[calendar_column_alias[i] = o ? o + '/' + i : i] = list[i];
		else
			calendar_columns[o = i] = Array.isArray(list[i]) ? list[i]
					: [ list[i] ];
		// gettext_config:{"id":"data-layer"}
		if (i === '资料图层') {
			// 先行占位
			for (i in add_tag.data_file)
				calendar_columns[calendar_column_alias[i] = '资料图层/' + i] = null;
		}
	}

	// gettext_config:{"id":"gregorian-reform"}
	v = 'Gregorian reform';
	calendar_columns[v] = [
			'各地启用公历之日期对照',
			'各地启用公历(格里历)之日期不同。 See <a href="https://en.wikipedia.org/wiki/Adoption_of_the_Gregorian_calendar" accessdate="2017/7/24 14:40" title="Adoption of the Gregorian calendar">adoption of the Gregorian Calendar</a>.' ];
	for (i in CeL.Gregorian_reform_of.regions) {
		o = function(date) {
			return date.format({
				parser : 'CE',
				format : '%Y/%m/%d',
				no_year_0 : false,
				reform : this.r
			});
		}.bind({
			r : i
		});
		calendar_columns[calendar_column_alias[i] = v + '/' + i] = [ {
			T : i,
			R : i + ', Gregorian reform on '
			//
			+ new Date(CeL.Gregorian_reform_of.regions[i]).format('%Y/%m/%d')
		}, o ];
	}

	default_column.forEach(function(i, index) {
		default_column[index] = {
			th : i
		};
	});

	CeL.add_listener('unload', function() {
		column_by_cookie(true);
	});

	column_by_cookie();

	// -----------------------------
	// configuration

	function change_coordinates(coordinates) {
		var name;
		if (typeof coordinates === 'string') {
			if (coordinates.includes(':')) {
				coordinates = coordinates.split(/:/);
				name = coordinates[0];
				coordinates = coordinates[1];
				document.getElementById('coordinates').value = coordinates;
			}
		} else
			coordinates = this.value;
		// [ latitude, longitude ]
		coordinates = CeL.parse_coordinates(coordinates);
		if (coordinates && typeof coordinates[0] === 'number'
				&& typeof coordinates[1] === 'number') {
			// 自动判别时区。
			coordinates[2] = Math.round(coordinates[1] / 360 * 24);
			if (name) {
				coordinates.place = name;
				document.getElementById('place_name').value = name;
			}
			document.getElementById('latitude').value = coordinates[0];
			document.getElementById('longitude').value = coordinates[1];
			document.getElementById('time_zone').value = coordinates[2];
			CeL.log('设定地理座标（经纬度）：' + (name ? name + '，' : '')
					+ coordinates.slice(0, 2).map(function(c) {
						return c.to_fixed(4);
					}).join(', ') + '，时区：UTC' + (coordinates[2] < 0 ? '' : '+')
					+ coordinates[2]);
			local_coordinates = coordinates;
		}
		return false;
	}
	document.getElementById('coordinates').onchange = change_coordinates;
	document.getElementById('time_zone').onchange = function() {
		local_coordinates[2] = this.value;
	};

	// 首都、国都或京（京师／城／都）
	// https://zh.wikipedia.org/wiki/%E4%B8%AD%E5%9B%BD%E9%A6%96%E9%83%BD
	var place_nodes = [ '🗺️', {
		// 常用地点
		// gettext_config:{"id":"famous-places"}
		T : '著名地点：'
	} ], place_list = {
		中国 : {
			北京市 : '39°54′57″N 116°23′26″E',
			// 长安
			西安市 : '34°16′N 108°54′E',
			洛阳 : '34°37′53.45″N 112°27′16.85″E',
			南京市 : '32°02′38″N 118°46′43″E',
			殷墟 : '36°07′17″N 114°19′01″E'
		},
		日本 : {
			// 旧东京天文台1 (东京都港区麻布台。世界测地系で东経 139°44′28.8869″、北纬 35°39′29.1572″)
			// http://eco.mtk.nao.ac.jp/koyomi/yoko/
			东京都 : '35° 41′ 22.4″ N, 139° 41′ 30.2″ E',
			京都市 : '35° 0′ 41.8″ N, 135° 46′ 5.2″ E'
		},
		한국 : {
			// 首尔
			서울 : '37° 34′ 0″ N, 126° 58′ 41″ E'
		},
		// gettext_config:{"id":"vietnam"}
		'Việt Nam' : {
			// 河内市
			'Hà Nội' : '21°01′42.5″N 105°51′15.0″E'
		},
		others : {
			台北市 : '25°2′N 121°38′E'
		}
	};
	for ( var country in place_list) {
		var country_places = place_list[country];
		place_nodes.push({
			br : null
		}, {
			T : country,
			C : 'country'
		}, ': ');
		for ( var place in country_places) {
			i = place + ':' + country_places[place];
			place_nodes.push({
				a : {
					T : place
				},
				href : '#',
				title : i,
				onclick : function() {
					return change_coordinates(this.title);
				}
			}, ' ');
		}
	}
	change_coordinates(i);
	CeL.new_node(place_nodes, 'place_list');

	// -----------------------------

	CeL.get_element('公元年_中历月日').onkeypress = function(e) {
		if (!e)
			e = window.event;
		// press <kbd>Enter</kbd>
		if (13 === (e.keyCode || e.which || e.charCode)) {
			var date = CeL.set_text('公元年_中历月日'), 公元日期 = CeL.era.中历(date);
			if (公元日期) {
				CeL.set_text('中历月日转公元日期', 公元日期.format({
					parser : 'CE',
					format : '%Y/%m/%d'
				}));
				CeL.get_element('中历月日转公元日期').select();
				CeL.set_text('中历月日转纪年日期', 公元日期.era);
				CeL.get_element('中历月日转纪年日期').title = 公元日期.era;
				return false;
			} else if (date) {
				CeL.warn('Cannot convert: [' + date + ']!');
			}
		}
	};

	CeL.get_element('中历月日转纪年日期').onclick = click_title_as_era;

	// -----------------------------

	var batch_prefix_span = new CeL.select_input(0, Object
			.keys(auto_add_column));
	batch_prefix_span.attach('batch_prefix');
	batch_prefix_span.setSearch('includeKeyWC');

	// -----------------------------

	/**
	 * @memo <code>

	var data = google.visualization.arrayToDataTable([
			[ 'Mon', 28, 28, 38, 38 ], [ 'Tue', 31, 38, 55, 66 ]
	// Treat first row as data as well.
	], true);

	// https://developers.google.com/chart/interactive/docs/gallery/candlestickchart
	var chart = new google.visualization.CandlestickChart(document
			.getElementById('era_graph'));
	chart.draw(data, {
		legend : 'none'
	});

	 </code>
	 */

	// https://developer.mozilla.org/en-US/docs/Web/API/Window.onhashchange
	(window.onhashchange = set_era_by_url_data)();

	CeL.log('初始化完毕。您可开始进行操作。');
}

document.getElementById('loading_progress').innerHTML
// 改善体验，降低反应倦怠感。
= 'The main page is loaded. Initializing the library...<br />已载入主网页。正进行程式初始化作业，请稍待片刻…';

// CeL.set_debug(2);
CeL.run(initializer);
