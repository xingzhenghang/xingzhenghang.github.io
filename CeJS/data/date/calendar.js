
/**
 * @name	CeL function for calendrical calculations.
 *
 * If you need a online demo of these calendars, please visit:
 * http://lyrics.meicho.com.tw/lib/JS/_test%20suite/era.htm
 *
 * @fileoverview
 * 本档案包含了历法转换的功能。
 *
 * @since 2014/4/12 15:37:56
 */

// https://www.funaba.org/cc
// http://www.fourmilab.ch/documents/calendar/
// http://the-light.com/cal/converter/
// http://keith-wood.name/calendars.html
// http://www.cc.kyoto-su.ac.jp/~yanom/pancanga/index.html

/*

TODO:
https://en.wikipedia.org/wiki/Vikram_Samvat
the official calendar of Nepal

*/


'use strict';
if (typeof CeL === 'function')
CeL.run(
{
name : 'data.date.calendar',
// |application.astronomy.
// data.math.find_root
require : 'data.code.compatibility.|data.native.set_bind|data.date.String_to_Date|data.date.is_leap_year|data.date.Julian_day|data.math.',

code : function(library_namespace) {

//	requiring
var set_bind = this.r('set_bind'), String_to_Date = this.r('String_to_Date'), is_leap_year = this.r('is_leap_year'), Julian_day = this.r('Julian_day');



/**
 * null module constructor
 * @class	calendars 的 functions
 */
var _// JSDT:_module_
= function() {
	//	null module constructor
};


/**
 * for JSDT: 有 prototype 才会将之当作 Class
 */
_// JSDT:_module_
.prototype = {
};


//----------------------------------------------------------------------------------------------------------------------------------------------------------//
// 工具函数。


var
// copy from data.date.
/** {Number}一整天的 time 值。should be 24 * 60 * 60 * 1000 = 86400000. */
ONE_DAY_LENGTH_VALUE = new Date(0, 0, 2) - new Date(0, 0, 1);

var
// 24 hours
ONE_DAY_HOURS = (new Date(1, 1, 1, -1)).getHours() | 0,
// set weekday name converter.
KEY_WEEK = 'week';


function _Date(year, month, date) {
	if (year < 100) {
		// 仅使用 new Date(0) 的话，会含入 timezone offset (.getTimezoneOffset)。
		// 因此得使用 new Date(0, 0)。
		var d = new Date(0, 0);
		d.setFullYear(year, month, date);
		return d;
	}
	return new Date(year, month, date);
}

function _time(year, month, date, hour) {
	if (year < 100) {
		// 仅使用 new Date(0) 的话，会含入 timezone offset (.getTimezoneOffset)。
		// 因此得使用 new Date(0, 0)。
		var d = new Date(0, 0);
		d.setFullYear(year, month, date, hour);
		return d;
	}
	return new Date(year, month, date, hour);
}



/**
 * format 回传处理。
 *
 * <code>
 * API:

Date_to_Calendar({Date}, {Object}options)

options.format = 'serial':
	return 数字序号 (numerical serial №) [ {Integer}year, {Natural}month, {Natural}date ]

options.format = 'item':
	一般会:
	return [ {Integer}year, {String}month name, {Natural}date ]
	return [ {Integer}year, {String}month name, {Natural}date, {小数}余下不到一日之时间值 remainder (单位:日) ]

options.format = 'text':
	return {String} 当地语言之表现法。常是 "weekday, date month year"。

others:
	default: text

 * </code>
 *
 * @param {Array}date [
 *            {Integer}year, {Natural}month, {Natural}date ],<br />
 *            date[KEY_WEEK] = {Integer}weekday
 * @param {Object}[options]
 *            options that called
 * @param {Array|Function}to_name [
 *            {Function}year serial to name, {Function}month serial to name,
 *            {Function}date serial to name, {Function}weekday serial to name ]
 * @returns
 */
function _format(date, options, to_name, is_leap, combine) {
	var format = options && options.format;

	if (format === 'serial')
		return date;

	if (typeof to_name === 'function')
		// 当作 month_to_name。
		date[1] = to_name(date[1], is_leap, options);
	else if (Array.isArray(to_name))
		to_name.forEach(function(func, index) {
			date[ index === 3 ? KEY_WEEK : index ]
			//
			= func(date[index], is_leap, index);
		});
	else
		library_namespace.warn('_format: 无法辨识之 to_name: ' + to_name);

	if (format === 'item')
		return date;

	if (options && typeof options.numeral === 'function') {
		date[0] = options.numeral(date[0]);
		date[2] = options.numeral(date[2]);
	}

	if (typeof combine === 'function') {
		format = combine(date);
	} else {
		format = date.slice(0, 3);
		// direction
		if (combine !== true)
			format = format.reverse();
		format = format.join(' ');
	}

	if (options) {
		if (options.postfix)
			format += options.postfix;
		if (options.prefix)
			format = options.prefix + format;
	}

	// add weekday name
	if (date[KEY_WEEK])
		format = date[KEY_WEEK] + ', ' + format;
	return format;
}



/**
 * 创建测试器。<br />
 * test: 经过正反转换运算，应该回到相同的日子。
 * 
 * @param {Function}to_Calendar
 * @param {Function}to_Date
 * @param {Object}[options]
 * 
 * @returns {Function}测试器。
 */
function new_tester(to_Calendar, to_Date, options) {
	options = Object.assign(Object.create(null),
			new_tester.default_options, options || {});
	var epoch = (options.epoch || to_Date.epoch) - 0 || 0,
	//
	month_days = options.month_days, CE_format = options.CE_format,
	//
	continued_month = options.continued_month,
	//
	get_month_serial = options.month_serial;

	return function(begin_Date, end_Date, error_limit) {
		begin_Date = typeof begin_Date === 'number' ? epoch + (begin_Date | 0)
				* ONE_DAY_LENGTH_VALUE : begin_Date - 0;
		var tmp = typeof end_Date === 'string'
				&& end_Date.trim().match(/^\+(\d+)$/);
		end_Date = tmp || typeof end_Date === 'number' ? (tmp ? begin_Date
				: epoch)
				+ end_Date * ONE_DAY_LENGTH_VALUE : end_Date - 0;
		if (isNaN(begin_Date) || isNaN(end_Date))
			return;

		var begin = Date.now(), last_show = begin, date_name, old_date_name, error = [];
		if (!(0 < error_limit && error_limit < 1e9))
			error_limit = new_tester.default_options.error_limit;

		for (; begin_Date <= end_Date && error.length < error_limit; begin_Date += ONE_DAY_LENGTH_VALUE) {
			// 正解: Date → calendar date
			date_name = to_Calendar(new Date(begin_Date), options);
			if (old_date_name
					//
					&& (date_name[2] - old_date_name[2] !== 1 || old_date_name[1] !== date_name[1])) {
				if (date_name[0] !== old_date_name[0]
				// 每世纪记录一次使用时间。
				&& date_name[0] % 100 === 0 && Date.now() - last_show > 20000) {
					console.log((begin_Date - epoch) / ONE_DAY_LENGTH_VALUE
							+ ' days: ' + date_name.join() + ' ('
							+ (new Date(begin_Date)).format(CE_format) + ')'
							+ ', 使用时间 ' + ((last_show = Date.now()) - begin)
							+ ' ms.');
				}
				// 确定 old_date_name 的下一个天为 date_name。
				// 月差距
				tmp = get_month_serial(date_name)
						- get_month_serial(old_date_name);

				if (date_name[2] - old_date_name[2] === 1)
					tmp = tmp !== 0
							&& !continued_month(date_name[1], old_date_name[1])
							&& '隔日(日期名接续)，但月 serial 差距 !== 0';
				else if (date_name[2] !== 1)
					tmp = '日期名未接续: 隔月/隔年，但日期非以 1 起始';
				else if (!(old_date_name[2] in month_days))
					tmp = '日期名未接续: 前一月末日数 ' + old_date_name[2]
							+ '未设定于 month_days 中';
				else if (tmp !== 1 && (tmp !== 0
				// 这边不再检查年份是否差一，因为可能是闰月。
				// || date_name[0] - old_date_name[0] !== 1
				) && !continued_month(date_name[1], old_date_name[1]))
					tmp = '月名未接续 (' + old_date_name[1] + '→' + date_name[1]
							+ ': 相差' + tmp + ')';
				else if (date_name[2] === old_date_name[2])
					tmp = '前后日期名相同';
				else if (date_name[0] !== old_date_name[0]
						&& date_name[0] - old_date_name[0] !== 1
						// Skip last day of -1 → first day of 1
						&& date_name[0] !== 1 && old_date_name[0] !== -1)
					tmp = '前后年份不同: ' + old_date_name[0] + '→' + date_name[0];
				else
					// 若 OK，必得设定 tmp!
					tmp = false;

				if (tmp) {
					error.push(tmp + ': 前一天 ' + old_date_name.join('/')
							+ ' ⇨ 隔天 ' + date_name.join('/') + ' ('
							+ (new Date(begin_Date)).format(CE_format) + ', '
							+ begin_Date + ')');
				}
			}
			old_date_name = date_name;

			// 反解: calendar date → Date
			tmp = to_Date(date_name[0], date_name[1], date_name[2]);
			if (begin_Date - tmp !== 0) {
				tmp = '正反解到了不同日期: ' + (new Date(begin_Date)).format(CE_format)
						+ ', ' + (begin_Date - epoch) / ONE_DAY_LENGTH_VALUE
						+ ' days → ' + date_name.join(',') + ' → '
						+ (tmp ? tmp.format(CE_format) : tmp);
				error.push(tmp);
				if (error.length < 9)
					console.error(tmp);
			}
		}

		library_namespace.info((new Date - begin) + ' ms, error '
				+ error.length + '/' + error_limit);
		if (true || error.length)
			return error;
	};
}


new_tester.default_options = {
	// length of the months
	month_days : {
		29 : '阴阳历大月',
		30 : '阴阳历小月'
	},
	CE_format : {
		parser : 'CE',
		format : '%Y/%m/%d %HH CE'
	},
	// 延续的月序，月序未中断。continued/non-interrupted month serial.
	continued_month : function(month, old_month) {
		return month === 1 && (old_month === 12 || old_month === 13);
	},
	// get month serial
	// 其他方法: 见 Hindu_Date.test
	month_serial : function(date_name) {
		var month = date_name[1];
		if (isNaN(month)) {
			var matched = month.match(/^\D?(\d{1,2})$/);
			if (!matched)
				throw 'tester: Illegal month name: ' + month;
			month = matched[1] | 0;
		}
		return month;
	},
	// get 数字序号 (numerical serial).
	format : 'serial',
	error_limit : 20
};


function continued_month_中历(month, old_month) {
	var matched;
	if (typeof old_month === 'string')
		return (matched = old_month.match(/^闰(\d{1,2})$/))
				&& (matched[1] - month === 1 || month === 1 && matched[1] == 12);
	if (typeof month === 'string')
		return (matched = month.match(/^闰(\d{1,2})$/))
				&& (matched[1] - old_month === 0 || matched[1] == 1
						&& old_month === 12);
	return month === 1 && old_month === 12;
}

/**
 * 提供 to calendar date 之 front-end (wrapper)
 * 
 * @param {Function}calendar_Date
 *            to calendar date
 * @param {Function}[new_year_Date]
 *            to calendar new year's day
 * 
 * @returns {Function} parser
 */
function _parser(calendar_Date, new_year_Date) {

	return function(date, minute_offset, options) {
		var period_end = options && options.period_end;

		if (!isNaN(date)) {
			if (new_year_Date)
				// use the new year's day
				return new_year_Date(date);

			// use year/1/1
			// String → Number
			date |= 0;
			return calendar_Date(period_end ? 1 + date : date, 1, 1);
		}

		if (date = date.match(/(-?\d{1,4})[\/\-](\d{1,2})(?:[\/\-](\d{1,2}))?/)) {
			if (period_end)
				date[date[3] ? 3 : 2]++;
			return calendar_Date(date[1] | 0, date[2] | 0, date[3] && (date[3] | 0) || 1);
		}
	};

}

//----------------------------------------------------------------------------------------------------------------------------------------------------------//
// 长历: 伊斯兰历
// گاه‌شماری هجری قمری
// https://fa.wikipedia.org/wiki/%DA%AF%D8%A7%D9%87%E2%80%8C%D8%B4%D9%85%D8%A7%D8%B1%DB%8C_%D9%87%D8%AC%D8%B1%DB%8C_%D9%82%D9%85%D8%B1%DB%8C
// تقويم هجري
// https://ar.wikipedia.org/wiki/%D8%AA%D9%82%D9%88%D9%8A%D9%85_%D9%87%D8%AC%D8%B1%D9%8A

// Tabular Islamic calendar / lunar Hijri calendar (AH, A.H. = anno hegirae), lunar Hejrī calendar / التقويم الهجري المجدول /
// http://en.wikipedia.org/wiki/Tabular_Islamic_calendar
// 伊斯兰历(回回历)
// 陈垣编的《中西回史日历》(中华书局1962年修订重印)。
// 陈氏中西回史日历冬至订误，鲁实先


// There are 11 leap years in a 30 year cycle.
var Tabular_cycle_years = 30 | 0, Tabular_half_cycle = 15 | 0,
// 平年日数。6=(12个月 / 2)
// 每年有12个月。奇数个月有30天，偶数个月有29天，除第12/最后一个月在闰年有30天。
Tabular_common_year_days = (30 + 29) * 6 | 0,
// 每一30年周期内设11闰年。
Tabular_leaps_in_cycle = 11 | 0,
//
Tabular_cycle_days = Tabular_common_year_days * Tabular_cycle_years
		+ Tabular_leaps_in_cycle,

// Tabular_leap_count[shift + Tabular_cycle_years]
// = new Array( 30 : [ 各年于30年周期内已累积 intercalary days ] )
Tabular_leap_count = [],
// 各月1日累积日数。
// = [0, 30, 30+29, 30+29+30, ..]
// Tabular_month_days.length = 12
Tabular_month_days = [ 0 ];

(function() {
	for (var month = 0, count = 0; month < 12;)
		Tabular_month_days.push(count += (month++ % 2 === 0 ? 30 : 29));
	// assert: Tabular_common_year_days === Tabular_month_days.pop();
})();

function Tabular_list_leap() {
	for (var s = -Tabular_cycle_years; s <= Tabular_cycle_years; s++) {
		for (var year = 1, shift = s, leap = []; year <= Tabular_cycle_years; year++)
			if ((shift += Tabular_leaps_in_cycle) > Tabular_half_cycle)
				shift -= Tabular_cycle_years, leap.push(year);
		library_namespace.log(s + ': ' + leap);
	}
}

// 0: 2,5,7,10,13,16,18,21,24,26,29
// -3: 2,5,8,10,13,16,19,21,24,27,29
// 1: 2,5,7,10,13,15,18,21,24,26,29
// -5: 2,5,8,11,13,16,19,21,24,27,30

// shift: 小余, -30–30.
function get_Tabular_leap_count(shift, year_serial) {
	if (0 < (shift |= 0))
		shift %= Tabular_cycle_years;
	else
		shift = 0;
	// + Tabular_cycle_years: 预防有负数。
	if (!((shift + Tabular_cycle_years) in Tabular_leap_count))
		// 计算各年于30年周期内已累积 intercalary days。
		for (var year = 0, count = 0,
		// new Array(Tabular_cycle_years)
		intercalary_days_count = Tabular_leap_count[shift + Tabular_cycle_years] = [ 0 ];
		//
		year < Tabular_cycle_years; year++) {
			if ((shift += Tabular_leaps_in_cycle) > Tabular_half_cycle)
				shift -= Tabular_cycle_years, count++;
			intercalary_days_count.push(count);
		}

	return Tabular_leap_count[shift + Tabular_cycle_years][year_serial];
}

// Tabular date to Date.
function Tabular_Date(year, month, date, shift) {
	return new Date(Tabular_Date.epoch +
	// 计算距离 Tabular_Date.epoch 日数。
	(Math.floor((year = year < 0 ? year | 0 : year > 0 ? year - 1 : 0)
	// ↑ No year 0.
	/ Tabular_cycle_years) * Tabular_cycle_days
	// 添上闰年数。
	+ get_Tabular_leap_count(shift,
	// 确认 year >=0。
	(year %= Tabular_cycle_years) < 0 ? (year += Tabular_cycle_years) : year)
	// 添上整年之日数。
	+ year * Tabular_common_year_days
	// 添上整月之日数。
	+ Tabular_month_days[(month || 1) - 1]
	// 添上月初至 date 日数。
	+ (date || 1) - 1) * ONE_DAY_LENGTH_VALUE);
}

// 622/7/15 18:0 Tabular begin offset
// 伊斯兰历每日以日落时分日。例如 AH 1/1/1 可与公元 622/7/16 互换，
// 但 AH 1/1/1 事实上是从 622/7/15 的日落时算起，一直到 622/7/16 的日落前为止。
// '622/7/16'.to_Date('CE').format(): '622/7/19' === new Date(622, 7 - 1, 19)
Tabular_Date.epoch = String_to_Date('622/7/16', {
	parser : 'CE'
}).getTime();

var Tabular_month_name_of_serial = '|محرم|صفر|ربيع الأول|ربيع الثاني|جمادى الأول|جمادى الآخر|رجب |شعبان|رمضان|شوال|ذو القعدة|ذو الحجة'.split('|');
Tabular_Date.month_name = function(month_serial) {
	return Tabular_month_name_of_serial[month_serial];
};

Tabular_Date.is_leap = function(year, shift) {
	// 转正。保证变数值非负数。
	if ((year %= Tabular_cycle_years) < 1)
		year += Tabular_cycle_years;
	return get_Tabular_leap_count(shift, year)
			- get_Tabular_leap_count(shift, year - 1);
};

// 有更快的方法。
function Date_to_Tabular(date, options) {
	var month,
	// 距离 Tabular_Date.epoch 的日数。
	tmp = (date - Tabular_Date.epoch) / ONE_DAY_LENGTH_VALUE,
	//
	delta = tmp - (date = Math.floor(tmp)),
	// 距离 Tabular_Date.epoch 的30年周期之年数。
	year = Math.floor(date / Tabular_cycle_days) * Tabular_cycle_years;

	// 本30年周期内之日数。
	date %= Tabular_cycle_days;
	// 保证 date >=0。
	if (date < 0)
		date += Tabular_cycle_days;

	// month: 本30年周期内之积年数: 0–30。
	// 30: 第29年年底。
	month = (date / Tabular_common_year_days) | 0;
	year += month;
	date %= Tabular_common_year_days;

	// 不动到原 options。
	options = Object.assign({
		postfix:' هـ'
	},options);

	// 求出为本年第几天之序数。
	// 减去累积到第 month 年首日，应该有几个闰日。
	tmp = get_Tabular_leap_count(options.shift, month);
	if (date < tmp)
		// 退位。
		year--, date += Tabular_common_year_days
		//
		- get_Tabular_leap_count(options.shift, month - 1);
	else
		date -= tmp;


	// 至此确定年序数与求出本年第几天之序数。

	// 这边的计算法为 Tabular Islamic calendar 特殊设计过，并不普适。
	// 理据: 每月日数 >=29 && 末月累积日数 - 29*月数 < 29 (不会 overflow)

	// tmp 可能是本月，或是下月累积日数。
	tmp = Tabular_month_days[month = (date / 29) | 0];
	if (date < tmp
	// assert: month === 12: 年内最后一天。
	|| month === 12)
		// tmp 是下月累积日数。
		tmp = Tabular_month_days[--month];
	// 本月日数。
	date -= tmp;

	// 日期序数→日期名。year/month/date index to serial.
	// There is no year 0.
	if (year >= 0)
		year++;

	// [ year, month, date, 余下时间值(单位:日) ]
	return _format([ year, month + 1, date + 1, delta ], options,
			Tabular_Date.month_name);
}

/*

CeL.run('data.date.calendar');


CeL.Tabular_Date.test(-2e4, 4e6, 4).join('\n') || 'OK';
// "OK"

'624/6/23'.to_Date('CE').to_Tabular({format : 'serial'})
// [2, 12, 30, 0]

CeL.Tabular_Date(3, 7, 1).format('CE')

*/
Tabular_Date.test = new_tester(Date_to_Tabular, Tabular_Date);


_.Tabular_Date = Tabular_Date;


//----------------------------------------------------------------------------------------------------------------------------------------------------------//
// 长历: הַלּוּחַ הָעִבְרִי / Hebrew calendar / Jewish Calendar / 希伯来历 / 犹太历计算
// https://en.wikipedia.org/wiki/Hebrew_calendar
// http://www.stevemorse.org/jcal/rules.htm
// http://www.jewishgen.org/infofiles/m_calint.htm


// Hebrew_month_serial[month_name] = month serial (1–12 or 13)
var Hebrew_month_serial = Object.create(null),
// Hour is divided into 1080 parts called haliq (singular of halaqim)
Hebrew_1_HOUR = 1080 | 0,
// hour length in halaqim
Hebrew_1_DAY = 24 * Hebrew_1_HOUR | 0,
// month length in halaqim
// The Jewish month is defined to be 29 days, 12 hours, 793 halaqim.
Hebrew_1_MONTH = 29 * Hebrew_1_DAY + 12 * Hebrew_1_HOUR + 793 | 0,
// Metonic cycle length in halaqim
// Metonic cycle = 235 months (about 19 years): Hebrew calendar 采十九年七闰法
//Hebrew_1_cycle = (19 * 12 + 7) * Hebrew_1_MONTH | 0,

ONE_HOUR_LENGTH_VALUE = Date.parse('1/1/1 2:0') - Date.parse('1/1/1 1:0'),
// 1 hour of Date / 1 hour of halaqim (Hebrew calendar).
// (length of halaqim) * halaqim_to_Date_ratio = length value of Date
halaqim_to_Date_ratio = ONE_HOUR_LENGTH_VALUE / Hebrew_1_HOUR,

// http://www.stevemorse.org/jcal/rules.htm
// Molad of Tishri in year 1 occurred on Monday at 5hr, 204hq (5hr, 11mn, 20 sc)
// i.e., evening before Monday daytime at 11 min and 20 sec after 11 PM
Hebrew_epoch_halaqim = 5 * Hebrew_1_HOUR + 204 | 0,
// https://en.wikipedia.org/wiki/Molad
// The traditional epoch of the cycle was 5 hours 11 minutes and 20 seconds
// after the mean sunset (considered to be 6 hours before midnight) at the epoch
// of the Hebrew calendar (first eve of Tishrei of Hebrew year 1).
Hebrew_epoch_shift_halaqim = -6 * Hebrew_1_HOUR | 0,
// for reduce error.
Hebrew_epoch_shift = Math.round(Hebrew_epoch_shift_halaqim
		* halaqim_to_Date_ratio),
// 1/Tishri/1: Julian -3761/10/7
//
// https://en.wikipedia.org/wiki/Hebrew_calendar
// The Jewish calendar's epoch (reference date), 1 Tishrei AM 1, is equivalent
// to Monday, 7 October 3761 BC/BCE in the proleptic Julian calendar, the
// equivalent tabular date (same daylight period) and is about one year before
// the traditional Jewish date of Creation on 25 Elul AM 1, based upon the Seder
// Olam Rabbah.
//
// http://www.stevemorse.org/jcal/jcal.html
// http://www.fourmilab.ch/documents/calendar/
Hebrew_epoch = String_to_Date('-3761/10/7', {
	parser : 'Julian'
}).getTime();

// ---------------------------------------------------------------------------//
// Hebrew to Date

// Hebrew year, month, date
// get_days: get days of year
function Hebrew_Date(year, month, date, get_days) {
	// no year 0. year: -1 → 0
	if (year < 0 && !Hebrew_Date.year_0)
		year++;

	var is_leap = Hebrew_Date.is_leap(year),
	//
	days = isNaN(date) ? 0 : date - 1 | 0,
	// days diff (year type)
	// add_days = -1 (defective) / 0 (normal) / 1 (complete)
	add_days = Hebrew_Date.days_of_year(year) - 354 | 0;

	if (add_days > 1)
		add_days -= 30;

	if (!month)
		// month index 0
		month = 0;
	else if (isNaN(month = Hebrew_Date.month_index(month, is_leap)))
		return;

	// month: month index (0–11 or 12)

	if (month > 2 || month === 2 && add_days > 0) {
		// 所有后面的月份皆须加上此 add_days。
		days += add_days;
		if (is_leap && month > 5)
			// subtract the 30 days of leap month Adar I.
			month--, days += 30;
	}

	days += (month >> 1) * (30 + 29);
	if (month % 2 === 1)
		days += 30;

	// days: days from new year day

	return get_days ? days : Hebrew_Date.new_year_days(year, days, true);
}

// Are there year 0?
// 警告：除了 Hebrew_Date(), Date_to_Hebrew() 之外，其他函数皆假定有 year 0！
Hebrew_Date.year_0 = false;

//---------------------------------------------------------------------------//
// tools for month name

// https://en.wikipedia.org/wiki/Hebrew_Academy
// Academy name of specified month serial.
// common year: Nisan: 1, Iyyar: 2, .. Adar: 12
// leap year: Nisan: 1, Iyyar: 2, .. (Adar I): 12, (Adar II/Adar/Ve'Adar): 13
// Tishri: 下半年的开始。 http://en.wikipedia.org/wiki/Babylonian_calendar
(Hebrew_Date.month_name_of_serial = "|Nisan|Iyyar|Sivan|Tammuz|Av|Elul|Tishri|Marẖeshvan|Kislev|Tevet|Shvat|Adar"
		.split('|'))
//
.forEach(function(month_name, month_serial) {
	if (month_serial > 0)
		Hebrew_month_serial[month_name.toLowerCase()] = month_serial;
});
// other common names.
// all should be in lower case!
Object.assign(Hebrew_month_serial, {
	nissan : 1,
	iyar : 2,
	siwan : 3,
	tamuz : 4,
	ab : 5,
	tishrei : 7,
	heshvan : 8,
	marcheshvan : 8,
	cheshvan : 8,
	'marẖeshwan' : 8,
	chisleu : 9,
	chislev : 9,
	tebeth : 10,
	shevat : 11,
	shebat : 11,
	sebat : 11,
	// 'adar 1':12,
	// 'adar 2':12,

	// Occasionally instead of Adar I and Adar II, "Adar" and "Ve'Adar" are used
	// (Ve means 'and' thus: And Adar).
	veadar : 13,
	"ve'adar" : 13
});

// return Academy name of specified month serial.
// common year: 1: Nisan, 2: Iyyar, .. 12: Adar
// leap year: 1: Nisan, 2: Iyyar, .. 12: Adar, 13: Adar II
Hebrew_Date.month_name = function(month_serial, is_leap_year) {
	if (month_serial >= 12 && (month_serial === 13 || is_leap_year))
		return month_serial === 12 ? 'Adar I' : 'Adar II';
	return Hebrew_Date.month_name_of_serial[month_serial];
};

// return month serial.
// common year: Nisan: 1, Iyyar: 2, .. Adar: 12
// leap year: Nisan: 1, Iyyar: 2, .. (Adar I): 12, (Adar II/Adar/Ve'Adar): 13
Hebrew_Date.month_serial = function(month_name, is_leap_year) {
	if (typeof month_name === 'string') {
		// normalize month name.
		month_name = month_name.trim().toLowerCase();
		if (/^adar\s*[1i]$/i.test(month_name))
			// Only in Leap years.
			return 12;
		if (/^adar\s*(2|ii)$/i.test(month_name))
			// Only in Leap years.
			return 13;
		if (month_name === 'adar')
			if (is_leap_year)
				return 13;
			else if (is_leap_year === undefined) {
				if (library_namespace.is_debug(2))
					library_namespace
							.warn('May be 12, but will return 13 for Adar.');
				return 13;
			}
		if (month_name in Hebrew_month_serial)
			return Hebrew_month_serial[month_name];
	}

	library_namespace.error('Hebrew_Date.month_serial: Unknown month name: '
			+ month_name);
	return month_name;
};

// month: month name or serial
//
// return 0: Tishri, 1: Heshvan, ..
//
// common year: 0–11
// leap year: 0–12
//
// for numeral month name (i.e. month serial):
// Hebrew year begins on 7/1, then month 8, 9, .. 12, 1, 2, .. 6.
//
// common year: 7→0 (Tishri), 8→1, .. 12→5 (Adar),
// 1→6 (Nisan), 2→7, .. 6→11 (Elul)
//
// leap year: 7→0 (Tishri), 8→1, .. 12→5 (Adar I), 13→6 (Adar II),
// 1→7 (Nisan), 2→8, .. 6→12 (Elul)
Hebrew_Date.month_index = function(month, is_leap_year) {
	if (isNaN(month))
		// month name to serial
		month = Hebrew_Date.month_serial(month, is_leap_year);

	if (month === (month | 0))
		if (month === 13)
			// Adar II
			return 6;
		else if (1 <= month && month <= 12 && (month -= 7) < 0)
			// leap 1→-6→7, ..
			// common: 1→-6→6, ..
			month += is_leap_year ? 13 : 12;

	if (Number.isNaN(month))
		library_namespace.error('Hebrew_Date.month_index: Unknown month: '
				+ month);
	return month;
};

//---------------------------------------------------------------------------//


/*

for (y = 0; y < 19; y++)
	if (Hebrew_Date.is_leap(y))
		console.log(y);

*/

// the years 3, 6, 8, 11, 14, 17, and 19
// are the long (13-month) years of the Metonic cycle
Hebrew_Date.is_leap = function(year) {
	year = (7 * (year | 0) + 1) % 19;
	// 转正。保证变数值非负数。
	if (year < 0)
		year += 19;
	return year < 7;
};


/*
累积 leap:
(7 * year - 6) / 19 | 0

Simplify[12*(year - 1) + (7*year - 6)/19]
1/19 (-234 + 235 year)
*/
// 累积 months of new year begins (7/1)
Hebrew_Date.month_count = function(year, month_index) {
	return Math.floor((235 * year - 234 | 0) / 19) + (month_index | 0);
};

// halaqim of molad from Hebrew_epoch
// month_index 0: Tishri
// CeL.Hebrew_Date.molad(1,0,true).format('CE')==="-3761/10/6 23:11:20.000"
Hebrew_Date.molad = function(year, month_index, get_Date) {
	year = Hebrew_Date.month_count(year, month_index) * Hebrew_1_MONTH
			+ Hebrew_epoch_halaqim;
	return get_Date ? new Date(Hebrew_epoch + Hebrew_epoch_shift + year
			* halaqim_to_Date_ratio) : year;
};

// return [ week_day (0:Sunday, 1:Monday, .. 6),
// hour (0–23 from sunset 18:0 of previous day), halaqim (0–) ]
// @see
// http://www.stevemorse.org/jcal/molad.htm?year=1
Hebrew_Date.molad_date = function(year, month_index) {
	var halaqim = Hebrew_Date.molad(year, month_index),
	// the first day of 1/1/1 is Monday, index 1.
	week_day = (Math.floor(halaqim / Hebrew_1_DAY) + 1) % 7 | 0;
	// 转正。保证变数值非负数。
	if (week_day < 0)
		week_day += 7;
	halaqim %= Hebrew_1_DAY;
	if (halaqim < 0)
		halaqim += Hebrew_1_DAY;
	return [ week_day, halaqim / Hebrew_1_HOUR | 0, halaqim % Hebrew_1_HOUR | 0 ];
};

// cache
var Hebrew_delay_days = [], Hebrew_new_year_days = [];

/*
test:

for (year = 0; year < 1e4; year++)
	if (CeL.Hebrew_Date.delay_days(year) === 2
			&& (!CeL.Hebrew_Date.delay_days(year - 1) || !CeL.Hebrew_Date
					.delay_days(year + 1)))
		throw year;

*/

// return 0, 1, 2
Hebrew_Date.delay_days = function(year) {
	if ((year |= 0) in Hebrew_delay_days)
		return Hebrew_delay_days[year];

	var delay_days = Hebrew_Date.molad_date(year),
	//
	week_day = delay_days[0] | 0, hour = delay_days[1] | 0, halaqim = delay_days[2] | 0;

	// phase 1
	// http://www.stevemorse.org/jcal/rules.htm
	// Computing the beginning of year (Rosh Hashanah):
	if (delay_days =
	// (2) If molad Tishri occurs at 18 hr (i.e., noon) or later, Tishri 1 must
	// be delayed by one day.
	hour >= 18
	// (3) If molad Tishri in a common year falls on Tuesday at 9 hr 204 hq
	// (i.e., 3:11:20 AM) or later, then Tishri 1 is delayed by one day
	|| week_day === 2 && (hour > 9 || hour === 9 && halaqim >= 204)
			&& !Hebrew_Date.is_leap(year)
			// (4) If molad Tishri following a leap year falls on Monday at 15
			// hr 589 hq (9:32:43 1/3 AM) or later, Tishri 1 is delayed by one
			// day
			|| week_day === 1 && (hour > 15 || hour === 15 && halaqim >= 589)
			&& Hebrew_Date.is_leap(year - 1)
	// default: no delayed
	? 1 : 0)
		week_day++;

	// phase 2
	// (1) If molad Tishri occurs on Sunday, Wednesday, or Friday, Tishri 1 must
	// be delayed by one day
	//
	// since the molad Tishri of year 2 falls on a Friday, Tishri 1 of that year
	// should have been delayed by rule 1 so that Yom Kippor wouldn't be on the
	// day after the Sabbath. However Adam and Eve would not yet have sinned as
	// of the start of that year, so there was no predetermined need for them to
	// fast on that first Yom Kippor, and the delay rule would not have been
	// needed. And if year 2 was not delayed, the Sunday to Friday of creation
	// would not have been from 24-29 Elul but rather from 25 Elul to 1 Tishri.
	// In other words, Tishri 1 in the year 2 is not the first Sabbath, but
	// rather it is the day that Adam and Eve were created.
	//
	// http://www.stevemorse.org/jcal/jcal.js
	// year 3 wants to start on Wed according to its molad, so delaying year
	// 3 by the WFS rule would require too many days in year 2, therefore
	// WFS must be suspended for year 3 as well
	if (3 * week_day % 7 < 3 && 3 < year)
		delay_days++;

	return Hebrew_delay_days[year] = delay_days | 0;
};

// return days of year's first day.
Hebrew_Date.new_year_Date_original = function(year, days) {
	days = new Date(Hebrew_epoch + Hebrew_Date.molad(year)
			* halaqim_to_Date_ratio
			+ (Hebrew_Date.delay_days(year) + (days | 0))
			* ONE_DAY_LENGTH_VALUE);
	// set to 0:0 of the day
	days.setHours(0, 0, 0, 0);
	return days;
};

// calculate days from 1/1/1.
// simplify from Hebrew_Date.new_year_Date_original()
// new_year_days(1) = 0
// new_year_days(2) = 354
// new_year_days(3) = 709
// CeL.Hebrew_Date.new_year_days(1,0,true).format('CE')
Hebrew_Date.new_year_days = function(year, days, get_Date) {
	if (!(year in Hebrew_new_year_days))
		Hebrew_new_year_days[year] = Math.floor(Hebrew_Date.molad(year)
				/ Hebrew_1_DAY)
				//
				+ Hebrew_Date.delay_days(year) | 0;
	year = Hebrew_new_year_days[year] + (days | 0);
	return get_Date ? new Date(Hebrew_epoch + year * ONE_DAY_LENGTH_VALUE)
			: year;
};

// return days of year's first day.
// Please use Hebrew_Date.new_year_days(year, days, true) instead.
if (false)
	Hebrew_Date.new_year_Date = function(year, days) {
		return Hebrew_Date.new_year_days(year, days, true);
	};



/*

test:

for (var year = 0, d, d2; year <= 1e5; year++) {
	d = CeL.Hebrew_Date.days_of_year_original(year);
	d2 = CeL.Hebrew_Date.days_of_year(year);
	if (d !== d2)
		throw year + ': ' + d + '!==' + d2;
	// common year has 353 (defective), 354 (normal), or 355 (complete) days
	d -= 354;
	if (d > 1)
		d -= 30;
	if (d !== Math.sign(d))
		throw year + ': ' + d2 + ' days';
}
console.log('OK');

*/

// day count of year.
Hebrew_Date.days_of_year_original = function(year) {
	// common year has 353 (defective), 354 (normal), or 355 (complete) days
	// leap year has 383 (defective), 384 (normal), or 385 (complete) days
	return (Hebrew_Date.new_year_Date_original(year + 1) - Hebrew_Date
			.new_year_Date_original(year))
			/ ONE_DAY_LENGTH_VALUE | 0;
};

// day count of year.
// days_of_year(1) = 354
// days_of_year(2) = 354
// days_of_year(3) = 384
// common year has 353 (defective), 354 (normal), or 355 (complete) days
// leap year has 383 (defective), 384 (normal), or 385 (complete) days
Hebrew_Date.days_of_year = function(year) {
	return Hebrew_Date.new_year_days(year + 1)
			- Hebrew_Date.new_year_days(year);
};

// month days of normal common year
var Hebrew_normal_month_days = [];
(function() {
	for (var m = 0; m < 12; m++)
		Hebrew_normal_month_days.push(m % 2 === 0 ? 30 : 29);
})();

Hebrew_Date.year_data = function(year) {
	var days = Hebrew_Date.days_of_year(year) | 0,
	// copy from normal
	data = Hebrew_normal_month_days.slice();
	data.days = days;

	days -= 354;
	if (days > 1)
		days -= 30, data.leap = true, data.splice(5, 0, 30);
	// assert: days = -1 (defective) / 0 (normal) / 1 (complete)
	data.add_days = days;

	if (days > 0)
		data[1]++;
	else if (days < 0)
		data[2]--;

	return Object.assign(data, {
		delay_days : Hebrew_Date.delay_days(year),
		new_year_days : Hebrew_Date.new_year_days(year)
	});
};

//---------------------------------------------------------------------------//
// Date to Hebrew

/*

days = new_year_days + Δ
# 0 <= Δ < 385
new_year_days = days - Δ

Math.floor(Hebrew_Date.molad(year) / Hebrew_1_DAY) + Hebrew_Date.delay_days(year)
= new_year_days

→

Math.floor((Hebrew_Date.month_count(year, month_index) * Hebrew_1_MONTH + Hebrew_epoch_halaqim) / Hebrew_1_DAY) + Hebrew_Date.delay_days(year)
= new_year_days

→

Math.floor((Math.floor((235 * year - 234 | 0) / 19) * Hebrew_1_MONTH + Hebrew_epoch_halaqim) / Hebrew_1_DAY) + Hebrew_Date.delay_days(year)
= new_year_days

→

(((235 * year - 234) / 19 + Δ2) * Hebrew_1_MONTH + Hebrew_epoch_halaqim) / Hebrew_1_DAY + Δ1 + delay_days
= new_year_days

# 0 <= (Δ1, Δ2) <1
# delay_days = 0, 1, 2

→

year
= ((((days - Δ - Δ1 - delay_days) * Hebrew_1_DAY - Hebrew_epoch_halaqim) / Hebrew_1_MONTH - Δ2) * 19 + 234) / 235
<= ((days * Hebrew_1_DAY - Hebrew_epoch_halaqim) / Hebrew_1_MONTH * 19 + 234) / 235
< (days * Hebrew_1_DAY - Hebrew_epoch_halaqim) / Hebrew_1_MONTH * 19 / 235 + 1


test:

var begin = new Date;
for (var year = 0, new_year_days, days = 0; year <= 1e5; year++)
	for (new_year_days = CeL.Hebrew_Date.new_year_days(year + 1); days < new_year_days; days++)
		if (CeL.Hebrew_Date.year_of_days(days) !== year)
			throw 'CeL.Hebrew_Date.year_of_days(' + days + ') = '
					+ CeL.Hebrew_Date.year_of_days(days) + ' != ' + year;
console.log('CeL.Hebrew_Date.year_of_days() 使用时间: ' + (new Date - begin) / 1000);
//CeL.Hebrew_Date.year_of_days() 使用时间: 154.131

*/

// return year of the day;
Hebrew_Date.year_of_days = function(days) {
	// 即使预先计算参数(coefficient)，以加快速度，也不会显著加快。@ Chrome/36
	var year = Math.ceil((days * Hebrew_1_DAY - Hebrew_epoch_halaqim)
			/ Hebrew_1_MONTH * 19 / 235) + 1 | 0;

	// assert: 最多减两次。
	// 经测试 0–4e6，96% 皆为减一次。
	// [ 139779, 3859350, 871 ]
	while (days < Hebrew_Date.new_year_days(year))
		year--;

	return year;
};


/*
d = '-3761/10/7'.to_Date('CE').to_Hebrew();
*/
function Date_to_Hebrew(date, options) {
	var tmp, month, days = date - Hebrew_epoch - Hebrew_epoch_shift,
	//
	hour = days % ONE_DAY_LENGTH_VALUE,
	//
	year = Hebrew_Date.year_of_days(days = Math.floor(days
			/ ONE_DAY_LENGTH_VALUE) | 0),
	//
	is_leap = Hebrew_Date.is_leap(year),
	//
	add_days = Hebrew_Date.days_of_year(year) - 354 | 0;

	// 转正。保证变数值非负数。
	if (hour < 0)
		hour += ONE_DAY_LENGTH_VALUE;

	days -= Hebrew_Date.new_year_days(year);
	// assert: days: days from new year day

	if (add_days > 1)
		// assert: is_leap === true
		add_days -= 30;
	// assert: add_days = -1 (defective) / 0 (normal) / 1 (complete)

	// 将 days 模拟成 normal common year.
	// 因此需要作相应的处理:
	// 从前面的日期处理到后面的，
	// 自开始被影响，与 normal common year 不同的那天起将之改成与 normal common year 相同。
	// days → month index / days index of month
	if (add_days !== 0)
		if (add_days === 1) {
			// 30 + 29: complete year 开始被影响的一日。
			if (days === 30 + 29)
				// 因为 normal common year 没有办法表现 8/30，须特别处理 8/30。
				month = 1, days = 29, tmp = true;
			else if (days > 30 + 29)
				days--;
		} else if (days >= 30 + 29 + 29)
			// 30 + 29 + 29: defective year 开始被影响的一日。
			// assert: add_days === -1
			days++;

	if (!tmp) {
		// is_leap 还会用到，因此将 tmp 当作暂用值。
		// 3 * (30 + 29): leap year 开始被影响的一日。
		if (tmp = is_leap && days >= 3 * (30 + 29))
			days -= 30;

		// 计算有几组 (30 + 29) 月份。
		month = days / (30 + 29) | 0;
		// 计算 date in month。
		days -= month * (30 + 29);
		// 每组 (30 + 29) 月份有 2个月。
		month <<= 1;
		// normal common year 每组 (30 + 29) 月份，首月 30日。
		if (days >= 30)
			month++, days -= 30;
		if (tmp)
			// 加上 leap month.
			month++;
	}

	// 日期序数→日期名。year/month/date index to serial.
	// index 0 → serial 7
	month += 7;
	// add_days: months of the year.
	tmp = is_leap ? 13 : 12;
	if (month > tmp)
		month -= tmp;
	if (year <= 0 && !Hebrew_Date.year_0)
		// year: 0 → -1
		--year;

	// 前置处理。
	if (!library_namespace.is_Object(options))
		if (options === true)
			options = {
				// month serial to name
				month_name : true
			};
		else
			options = Object.create(null);

	return _format([ year, month, days + 1,
	// hour
	Math.floor(hour / ONE_HOUR_LENGTH_VALUE) | 0,
	// halaqim
	(hour % ONE_HOUR_LENGTH_VALUE) / halaqim_to_Date_ratio ], options,
			Hebrew_Date.month_name, is_leap);
}


/*

CeL.Hebrew_Date.test(-2e4, 4e6, 4).join('\n') || 'OK';
// "OK"

'-3762/9/18'.to_Date('CE').to_Hebrew({format : 'serial'})
// -1/6/29

CeL.Hebrew_Date(3, 7, 1).format('CE')

*/
Hebrew_Date.test = new_tester(Date_to_Hebrew, Hebrew_Date, {
	epoch : Hebrew_epoch
});


_.Hebrew_Date = Hebrew_Date;

//----------------------------------------------------------------------------------------------------------------------------------------------------------//
// 长历: Mesoamerican Long Count calendar / 马雅长纪历
// <a href="https://en.wikipedia.org/wiki/Mesoamerican_Long_Count_calendar" accessdate="2014/4/28 22:15" title="Mesoamerican Long Count calendar">中美洲长纪历</a>

// GMT correlation: starting-point is equivalent to August 11, 3114 BCE in the proleptic Gregorian calendar
// https://en.wikipedia.org/wiki/Template:Maya_Calendar
// GMT 584283
// GMT+2 584285
// Thompson (Lounsbury) 584,285
// 注意：据 mayaman@ptt 言，<q>目前比较流行的是GMT+2  如果你要统治者纪年的话</q>。
Maya_Date.epoch = (new Date(-3114 + 1, 8 - 1, 11/* + 2*/)).getTime();

// Era Base date, the date of creation is expressed as 13.13.13.13.13.13.13.13.13.13.13.13.13.13.13.13.13.13.13.13.0.0.0.0 4 Ajaw 8 Kumk'u
/*
// get offset:
// 4 Ajaw → 3/13, 19/20
for (i = 0, d = 3, l = 20; i < l; i++, d += 13)
	if (d % l === 19)
		throw d;
// 159
*/
var
Tzolkin_day_offset = 159,
Tzolkin_day_period = 13 * 20,
/*
// get offset:
// 8 Kumk'u → 348/(20 * 18 + 5)
365 - 17 = 348
*/
Haab_day_offset = 348, Haab_day_period = 20 * 18 + 5;

function Maya_Date(date, minute_offset, options) {
	if (typeof date === 'string')
		date = date.split(/[,.]/);
	else if (!Array.isArray(date))
		return new Date(NaN);

	var days = 0, length = date.length - 1, i = 0,
	// e.g., 8.19.15.3.4 1 K'an 2 K'ayab'
	matched = date[length].match(/^(\d{1,2})\s/);
	if (matched)
		date[length] = matched[1] | 0;
	if (matched = date[0].match(/\s(\d{1,2})$/))
		date[0] = matched[1] | 0;
	length--;

	while (i < length)
		days = days * 20 + (date[i++] | 0);
	days = (days * 18 + (date[i] | 0)) * 20 + (date[++i] | 0);

	if (options && options.period_end)
		days++;

	return new Date(days * ONE_DAY_LENGTH_VALUE + Maya_Date.epoch);
}

Maya_Date.days = function(date) {
	return Math.floor((date - Maya_Date.epoch) / ONE_DAY_LENGTH_VALUE);
};

Maya_Date.to_Long_Count = function(date, get_Array) {
	var days = Maya_Date.days(date),
	// Mesoamerican Long Count calendar.
	Long_Count;
	if (!Number.isFinite(days))
		// NaN
		return;
	if (days <= 0)
		// give a 13.0.0.0.0
		// but it should be:
		// 13.13.13.13.13.13.13.13.13.13.13.13.13.13.13.13.13.13.13.13.0.0.0.0
		days += 13 * 20 * 20 * 18 * 20;
	Long_Count = [ days % 20 ];
	days = Math.floor(days / 20);
	Long_Count.unshift(days % 18);
	days = Math.floor(days / 18) | 0;
	while (days > 0 || Long_Count.length < 5) {
		Long_Count.unshift(days % 20);
		days = days / 20 | 0;
	}
	return get_Array ? Long_Count : Long_Count.join('.');
};

Maya_Date.Tzolkin_day_name = "Imix'|Ik'|Ak'b'al|K'an|Chikchan|Kimi|Manik'|Lamat|Muluk|Ok|Chuwen|Eb'|B'en|Ix|Men|Kib'|Kab'an|Etz'nab'|Kawak|Ajaw"
		.split('|');
// <a href="https://en.wikipedia.org/wiki/Tzolk%27in" accessdate="2014/4/30
// 18:56">Tzolk'in</a>
// type = 1: {Array} [ 13-day cycle index, 20-day cycle index ] (index: start
// from 0),
//
// 2: {Array} [ 13-day cycle name, 20-day cycle ordinal/serial: start from 1,
// 20-day cycle name ],
//
// 3: {Array} [ 13-day cycle name, 20-day cycle name ],
// others (default): {String} (13-day cycle name) (20-day cycle name)
Maya_Date.to_Tzolkin = function(date, type) {
	var days = Maya_Date.days(date) + Tzolkin_day_offset;
	// 转正。保证变数值非负数。
	if (days < 0)
		days = days % Tzolkin_day_period + Tzolkin_day_period;

	// 20: Maya_Date.Tzolkin_day_name.length
	days = [ days % 13, days % 20 ];
	if (type === 1)
		return days;

	days[0]++;
	var day_name = Maya_Date.Tzolkin_day_name[days[1]];
	if (type === 2) {
		days[1]++;
		days[2] = day_name;
	} else if (type === 3)
		days[1] = day_name;
	else
		// 先日子，再月份。
		days = days[0] + ' ' + day_name;
	return days;
};

Maya_Date.Haab_month_name = "Pop|Wo'|Sip|Sotz'|Sek|Xul|Yaxk'in'|Mol|Ch'en|Yax|Sak'|Keh|Mak|K'ank'in|Muwan'|Pax|K'ayab|Kumk'u|Wayeb'"
		.split('|');
// <a href="https://en.wikipedia.org/wiki/Haab%27" accessdate="2014/4/30
// 18:56">Haab'</a>
// type = 1: {Array} [ date index, month index ] (index: start from 0),
//
// 2: {Array} [ date ordinal/serial: start from 1, month ordinal/serial: start
// from 1, date name, month name ],
//
// 3: {Array} [ date name, month name ],
// others (default): {String} (date name) (month name)
Maya_Date.to_Haab = function(date, type) {
	var days = (Maya_Date.days(date) + Haab_day_offset) % Haab_day_period;
	// 转正。保证变数值非负数。
	if (days < 0)
		days += Haab_day_period;

	// 20 days in a month.
	days = [ days % 20, days / 20 | 0 ];
	if (type === 1)
		return days;

	// Day numbers began with a glyph translated as the "seating of" a named
	// month, which is usually regarded as day 0 of that month, although a
	// minority treat it as day 20 of the month preceding the named month. In
	// the latter case, the seating of Pop is day 5 of Wayeb'. For the majority,
	// the first day of the year was Seating Pop. This was followed by 1 Pop, 2
	// Pop ... 19 Pop, Seating Wo, 1 Wo and so on.
	days[2] = days[0] === 0 ? 'Seating' : days[0];
	days[3] = Maya_Date.Haab_month_name[days[1]];
	if (type === 2)
		days[1]++;
	else {
		days.splice(0, 2);
		if (type !== 3)
			// 先日子，再月份。
			days = days.join(' ');
	}
	return days;
};


_.Maya_Date = Maya_Date;


//----------------------------------------------------------------------------------------------------------------------------------------------------------//
// 长历: 西双版纳傣历计算。傣历 / Dai Calendar
// 适用范围: 傣历 714年（1352/3/28–）至 3190年期间内。

/*

基本上按张公瑾:《西双版纳傣文〈历法星卜要略〉历法部分译注》、《傣历中的纪元纪时法》计算公式推算，加上过去暦书多有出入，因此与实暦恐有一两天差距。
《中国天文学史文集 第三集》


http://blog.sina.com.cn/s/blog_4131e58f0101fikx.html
傣历和农历一样，用干支纪年和纪日。傣历干支约于东汉时由汉地传入，使用年代早于纪元纪时的方法。不过傣族十二地支所代表的对象和汉族不完全相同，如「子」不以表鼠而代表大象，「辰」不代表龙，而代表蛟或大蛇。


[张公瑾,陈久金] 傣历中的干支及其与汉历的关系 (傣历中的干支及其与汉历的关系, 《中央民族学院学报》1977年第04期)
值得注意的是, 傣历中称干支日为“腕乃” 或‘婉傣” , 意思是“ 里面的日子” 或“傣族的日子” , 而一周一匕日的周日, 明显地是从外面传进来的, 则称为“腕诺” 或,’m 命” , 即“外面的日子· 或“ 你的日子’, , 两者你我相对, 内外有8lJ, 是很清楚的。很明显, 傣历甲的干支纪年与纪日是从汉历中吸收过来的, 而且已经成了傣历中不可分害少的组成部分。在傣文的两本最基本的推算历法书‘苏定》和《苏力牙》中, 干支纪年与纪日的名称冠全书之首, 可见汉历成份在傣历中的重要性。


《中央民族学院学报》 1979年03期
傣历中的纪元纪时法
张公瑾
傣历中的纪元纪时法,与公历的纪时法相近似,即以某一个时间为傣历纪元开始累计的时间,以后就顺此按年月日往下记,至今年(1979年)10月1日(农历己未年八月十一)为傣历1341年12月月出11日,这是一种情况。
还有一种情况是:公元1979年10月1日又是傣历纪元的第1341年、傣历纪元的第16592月,并是傣历纪元的第489982日。对这种年月日的累计数,现译称为傣历纪元年数、纪元积月数和纪元积日数。


TODO:
有极少例外，如1190年未闰（八月满月），而1191年闰。

*/


/*
year:
傣历纪元年数。

应可处理元旦，空日，除夕，闰月，后六月，后七月等。

Dai_Date(纪元积日数)
Dai_Date(纪元年数, 特殊日期)
	特殊日期: 元旦/除夕/空1/空2
Dai_Date(纪元年数, 0, 当年日序数)
Dai_Date(纪元年数, 月, 日)
	月: 1–12/闰/后6/后7

元旦：
	Dai_Date(year, 0)
	Dai_Date(year, '元旦')
当年日序 n：
	Dai_Date(year, 0, n)
空日（当年元旦之前的）：
	Dai_Date(year, '空1日')
	Dai_Date(year, '空2日')
	Dai_Date(year, 0, -1)
	Dai_Date(year, 0, -2)
除夕（当年元旦之前的）：
	Dai_Date(year, '除夕')
闰月：
	Dai_Date(year, '闰9', date)
	Dai_Date(year, '双9', date)
	Dai_Date(year, '闰', date)

后六月：
	Dai_Date(year, '后6', date)

后七月：
	Dai_Date(year, '后7', date)


注意：由于傣历元旦不固定在某月某日，因此同一年可能出现相同月分与日期的日子。例如傣历1376年（公元2014年）就有两个六月下五日。

为了维持独一性，此处以"后六月"称第二次出现的六月同日。

*/
function Dai_Date(year, month, date, get_days) {
	if (isNaN(year = Dai_Date.to_valid_year(year)))
		return get_days ? NaN : new Date(NaN);

	var days = typeof date === 'string'
			&& (date = date.trim()).match(/^(\D*)(\d+)/), is_leap;
	// 处理如「六月下一日」或「六月月下一日」即傣历6月16日。
	if (days) {
		date = days[2] | 0;
		if (/月?上/.test(days[1]))
			date += 15;
	} else
		date |= 0;

	if (typeof month === 'string')
		if (/^[闰双后][9九]?月?$/.test(month))
			month = 9, is_leap = true;
		else if (days = month.match(/^后([67])/))
			month = days[1];

	if (isNaN(month) || month < 1 || 12 < month) {
		// 确定元旦之前的空日数目。
		days = Dai_Date.vacant_days(year - 1);
		switch (month) {
		case '空2日':
			// 若有空2日，其必为元旦前一日。
			date--;
		case '空日':
		case '空1日':
			date -= days;
		case '除夕':
			date -= days + 1;
		}

		// 当作当年日序。
		days = Dai_Date.new_year_days(year) + date | 0;

	} else {
		// 将 (month) 转成月序：
		// 6月 → 0
		// 7月 → 1
		// ...
		// 12月 → 6
		// 1月 → 7
		if ((month -= 6) < 0
		// 后6月, 后7月
		|| days)
			month += 12;

		// 处理应为年末之6月, 7月的情况。
		if (month < 2 && 0 < date
		// 七月: 7/1 → 6/30, 7/2 → 6/31..
		&& (month === 0 ? date : 29 + date) <
		//
		Dai_Date.new_year_date_serial(year))
			month += 12;

		days = Dai_Date.days_6_1(year) + date - 1
		//
		+ (month >> 1) * (29 + 30) | 0;
		if (month % 2 === 1)
			days += 29;

		if ((month > 3 || month === 3 && is_leap)
		// 处理闰月。
		&& Dai_Date.is_leap(year))
			days += 30;
		if (month > 2 && Dai_Date.is_full8(year))
			days++;
	}

	return get_days ? days : new Date(Dai_Date.epoch + days
			* ONE_DAY_LENGTH_VALUE);
}

// 适用范围: 傣历 0–103295 年
Dai_Date.to_valid_year = function(year, ignore_range) {
	if (false && year < 0)
		library_namespace.warn('Dai_Date.to_valid_year: 公式不适用于过小之年分：' + year);
	return !isNaN(year) && (ignore_range ||
	// 一般情况
	// -1e2 < year && year < 103296
	// from new_year_date_serial()
	0 <= year && (year < 2 || 714 <= year && year <= 3190)
	//
	) && year == (year | 0) ? year | 0 : NaN;
};

// 傣历采十九年七闰法，平年有12个月，闰年有13个月。闰月固定在9月，所以闰年又称为「双九月」年
// 闰9月, 闰九月。
// 适用范围: 傣历 0– 年
Dai_Date.is_leap = function(year) {
	// 傣历零年当年九月置闰月。
	return year == 0 ||
	// 摄 = (year + 1) % 19;
	(((7 * year | 0) - 6) % 19 + 19) % 19 < 7;
};


// 当年日数。365 or 366.
Dai_Date.year_days = function(year) {
	return Dai_Date.new_year_days(year + 1) - Dai_Date.new_year_days(year);
};

// 当年空日数目。1 or 2.
// 注意：这边之年分，指的是当年除夕后，即明年（隔年）元旦之前的空日数目。与 Dai_Date() 不同！
// e.g., Dai_Date.vacant_days(100) 指的是傣历100年除夕后，即傣历101年元旦之前的空日数目。
// 依 Dai_Date.date_of_days() 的做法，空日本身会被算在前一年内。
Dai_Date.vacant_days = function(year) {
	// 傣历泼水节末日之元旦（新年的第一天）与隔年元旦间，一般为365日（有「宛脑」一天）或366日（有「宛脑」两天）。
	return Dai_Date.year_days(year) - 364;
};

/*

傣历算法剖析

原法@历法星卜要略, 傣历中的纪元纪时法：
x := year + 1
y := Floor[(year + 4)/9]
z := Floor[(year - y)/3]
r := Floor[(x - z)/2]
R := year - r + 49049
S := Floor[(36525875 year + R)/100000]
d := S + 1
Simplify[d]

1 + Floor[(
  49049 + 36525876 year -
   Floor[1/2 (1 + year - Floor[1/3 (year - Floor[(4 + year)/9])])])/
  100000]


简化法：
x := year + 1
y := ((year + 4)/9)
z := ((year - y)/3)
r := ((x - z)/2)
R := year - r + 49049
S := ((36525875 year + R)/100000)
d := S + 1
Simplify[d]

(1609723 + 394479457 year)/1080000


// test 简化法 @ Javascript:
for (var year = -1000000, days; year <= 1000000; year++) {
	if (CeL.Dai_Date.new_year_days(year) !== CeL.Dai_Date
			.new_year_days_original(year))
		console.error('new_year_days: ' + year);
	var days = CeL.Dai_Date.new_year_days(year);
	if (CeL.Dai_Date.year_of_days(days) !== year
			|| CeL.Dai_Date.year_of_days(days - 1) !== year - 1)
		console.error('year_of_days: ' + year);
}


// get:
-976704
-803518
-630332
-523297
-350111
-176925
-69890
103296
276482
449668
556703
729889
903075

*/

// 元旦纪元积日数, accumulated days
// 原法@历法星卜要略：
Dai_Date.new_year_days_original = function(year) {
	return 1 + Math
			.floor((49049 + 36525876 * year - Math.floor((1 + year - Math
					.floor((year - Math.floor((4 + year) / 9)) / 3)) / 2)) / 100000);
};


// 元旦纪元积日数, accumulated days
// 简化法：适用于 -69889–103295 年
Dai_Date.new_year_days = function(year, get_remainder) {
	// 防止 overflow。但效果相同。
	// var v = 365 * year + 1 + (279457 * year + 529723) / 1080000,
	var v = (394479457 * year + 1609723) / 1080000 | 0,
	//
	f = Math.floor(v);
	// 余数
	return get_remainder ? v - f : f;
};

// 简化法：适用于 -3738–1000000 年
Dai_Date.year_of_days = function(days) {
	return Math.floor((1080000 * (days + 1) - 1609723) / 394479457) | 0;
};


// 纪元积月数, accumulated month


/*

原法@傣历中的纪元纪时法：
day = 元旦纪元积日数

b := 11 day + 633
c := Floor[(day + 7368)/8878]
d := Floor[(b - c)/692]
dd := day + d
e := Floor[dd/30]
f := Mod[dd, 30]
Simplify[e]
Simplify[f]

e:
Floor[1/30 (day +
    Floor[1/692 (633 + 11 day - Floor[(7368 + day)/8878])])]

f:
Mod[day + Floor[1/692 (633 + 11 day - Floor[(7368 + day)/8878])], 30]

*/


// cache
var new_year_date_serial = [ 30 ];

// 元旦之当月日序基数
// d = 30–35: 7/(d-29)
// others: 6/d
Dai_Date.new_year_date_serial = function(year, days, ignore_year_limit) {
	if (year in new_year_date_serial)
		return new_year_date_serial[year];

	if (isNaN(year = Dai_Date.to_valid_year(year, ignore_year_limit)))
		return NaN;

	// days: 元旦纪元积日数。
	if (isNaN(days))
		days = Dai_Date.new_year_days(year) | 0;
	else if (days < 0)
		library_namespace.warn('Dai_Date.new_year_date_serial: 输入负数日数 [' + days + ']!');

	// 参考用元旦之当月日序基数：常常须作调整。
	var date = (days +
	// 小月补足日数
	Math.floor((633 + 11 * days - Math.floor((7368 + days) / 8878)) / 692)
	// (date / 30 | 0) 是元旦所在月的纪元积月数
	) % 30 | 0;

	// 年初之6/1累积日数
	var days_diff
	// 平年年初累积日数
	= year * 354
	// 闰月年初累积日数 = 30 * (年初累积闰月数 (7r-6)/19+1=(7r+13)/19)
	+ 30 * (((7 * (year - 1) - 6) / 19) + 2 | 0)
	// 八月满月年初累积日数。.194: 经手动测试，误差=0 or 1日@部分0–1400年
	+ (.194 * year | 0)
	// 为傣历纪元始于 7/1，而非 6/1；以及 date 由 6/1 而非 6/0 起始而调整。
	- 30
	// 至上方为年初之6/1累积日数，因此需要再加上元旦之当月日序基数，才是元旦纪元积日数。
	+ date
	// 计算两者差距。
	- days | 0;

	// assert: -31 < days_diff < 2
	// for (var i = 0, j, y; i < 1200; i++) if ((j = CeL.Dai_Date.new_year_date_serial(i)) > 1 || j < -31) y = i;
	// 599
	// for (var i = 1200, j, y; i < 103296; i++) if ((j = CeL.Dai_Date.new_year_date_serial(i)) > 1 || j < -31) throw i;
	// 3191
	// return days_diff;
	if (false && library_namespace.is_debug(3)
			&& !(-31 < days_diff && days_diff < 2))
		library_namespace.warn('days_diff of ' + year + ': ' + days_diff);

	// 判断 date 在 6月 或 7月：选择与应有日数差距较小的。
	if (Math.abs(days_diff) > Math.abs(days_diff + 30))
		// 七月. 7/date0 → 6/30, 7/date1 → 6/31..
		date += 30;

	// 微调：当前后年 6/1 间不是指定的日数时，应当前后移动一两日。但据调查发现，除前一年是双九月暨八月满月外，毋须微调。
	// 六月出一日与隔年六月出一日间，平年354天（八月小月）或355天（八月满月），双九月之年384天。
	if (Dai_Date.is_leap(year - 1)) {
		var last_days = Dai_Date.new_year_days(year - 1);
		if ((days - date) - (
		// 前一年是双九月暨八月满月，则将八月满月推移至本年，元旦之当月日序基数后调一日。
		last_days - Dai_Date.new_year_date_serial(year - 1, last_days, true)) === 354 + 30 + 1)
			date++;
	}

	// cache
	return new_year_date_serial[year] = date | 0;
};


// 6/1 纪元积日数, accumulated days
// 简化法：适用于 -69889–103295 年
Dai_Date.days_6_1 = function(year, days) {
	// days: 元旦纪元积日数。
	if (isNaN(days))
		days = Dai_Date.new_year_days(year) | 0;

	var date = Dai_Date.new_year_date_serial(year, days) | 0;

	return days - date + 1 | 0;
};


/*



(394479457 * 19) / 1080000
=
7495109683/1080000
=
6939.916373148^_  (period 3)


354*19+30*7
=
6936


19/(7495109683/1080000-6936)
=
20520000/4229683
=
4.851427400114854943030009577549901493799889968113449636769469...

「八月满月」 4.8514274 年一次?


→
(year+k)/4.85142740011485494303|0 = 累积八月满月?
0<=k<4.85142740011485494303

八月满月 years:
1166–:
1167, 1172, 1176,


d := 20520000/4229683
Floor[(1168+k)/d]-Floor[(1167+k)/d]==1





var d = 20520000 / 4229683, year;
function get_diff(k){return ((year+1+k)/d|0)-((year+k)/d|0);}

for(var i=0,last=-1,v,a=[];i<d;i+=.01,last=v)if(last!==(v=get_diff(i)))a.push(String(i).slice(0,7)+': '+v);a.join('\n');

function get_full8_range(full8_years) {
	var range = [ 0, Infinity ];

	// 八月满月 years
	full8_years.forEach(function(y) {
		year = y;

		var low, high, b = 1;
		if (y > 1200 && y < 1280)
			b = 0;
		if (get_diff(b) == get_diff(b + 1)
				|| get_diff(b + 1) == get_diff(b + 2))
			throw '1==2 or 2==3 on ' + y;

		low = get_boundary(get_diff, 1, b, b + 1);
		y = (low - 1) * 4229683;
		if (Math.abs(y - Math.round(y)) > 1e-5)
			throw 'Error low on ' + year;
		if (range[0] < y)
			range[0] = Math.round(y);

		high = get_boundary(get_diff, 1, b + 1, b + 2);
		if (Math.abs(high - low - 1) > 1e-5)
			throw 'high-low!=1 on ' + year;
		y = (high - 2) * 4229683;
		if (Math.abs(y - Math.round(y)) > 1e-5)
			throw 'Error high on ' + year;
		if (range[1] > y)
			range[1] = Math.round(y);
	});

	range.push('function full8_days(year){return (4229683*year+'
			+ (4229683 + ((range[0] + range[1]) >> 1)) + ')/20520000|0;}');
	return range;
}


get_full8_range([ 1167, 1172, 1176, 1207, 1216, 1221, 1226, 1281, 1295 ])



year = 1167;
get_boundary(get_diff, 1, 1, 2);
// 1.1940034276800588=1+820573/4229683
get_boundary(get_diff, 1, 2, 3);
// 2.194003427680059=2+820573/4229683

.194003427680059≈820573/4229683

1+820573/4229683
<=k<
2+820573/4229683



year = 1172;
get_boundary(get_diff, 1, 1, 2);
// 1.045430827794803=1+192158/4229683
get_boundary(get_diff, 1, 2, 3);
// 2.045430827794803=2+192158/4229683


year = 1176;
get_boundary(get_diff, 1, 1, 2);
// 1.8968582279097745=1+3793426/4229683
get_boundary(get_diff, 1, 2, 3);
// 2.8968582279097745=2+3793426/4229683


1+820573/4229683
<=k<
2+192158/4229683




function _get_diff(k){return ((4229683*(year+1)+k)/20520000|0)-((4229683*(year)+k)/20520000|0);}

八月满月 year:


year = 1207;
get_diff(1) != get_diff(2) && (get_boundary(get_diff, 1, 1, 2) - 1) * 4229683
// 3793426
get_diff(2) != get_diff(3) && (get_boundary(get_diff, 1, 2, 3) - 2) * 4229683
// 3793426


year = 1216;
(get_boundary(get_diff, 1, 1, 2) - 1) * 4229683
// 2995789
(get_boundary(get_diff, 1, 2, 3) - 2) * 4229683

year = 1221;
(get_boundary(get_diff, 1, 1, 2) - 1) * 4229683
// 2367374

year = 1226;
(get_boundary(get_diff, 1, 1, 2) - 1) * 4229683
// 1738959

year = 1281;
(get_boundary(get_diff, 1, 1, 2) - 1) * 4229683
// 4229683

year = 1295;
(get_boundary(get_diff, 1, 1, 2) - 1) * 4229683
// 4229683



1+820573/4229683
<=k<
2+1738959/4229683

(1+820573/4229683+2+1738959/4229683)/2


Math.floor(year / 19) * (19 * 354 + 7 * 30) + (7 * y / 19)

但由前面几组即可发现，不存在此k值。

事实上，1398年年初累积八月满月日数为271。
因此另设
年初累积八月满月日数为:
Math.floor(a*year+b)

1397年为八月满月，
1397年年初累积八月满月日数为270
1398年年初累积八月满月日数为271
→
(271-2)/1397<a<(271+1)/(1397+1)
-(271+1)/(1397+1)<b<(1397-4*(271-2))/1397


// 八月满月 full8_years: { full8_year : 隔年年初累积八月满月日数 }
function get_full8_range(full8_years) {
	var range = [ 0, 1, -1, 1 ], days, boundary;

	for ( var year in full8_years) {
		days = full8_years[year |= 0] | 0;
		// range[0]<a<range[1]
		// range[2]<b<range[3]
		boundary = (days - 2) / year;
		if (range[0] < boundary)
			range[0] = boundary;
		boundary = (days + 1) / (year + 1);
		if (range[1] > boundary)
			range[1] = boundary;
		boundary = -boundary;
		if (range[2] < boundary)
			range[2] = boundary;
		boundary = (year - 4 * (days - 2)) / year;
		if (range[3] > boundary)
			range[3] = boundary;
	}

	return range;
}

get_full8_range({
	1184 : 230,
	1207 : 234,
	1216 : 236,
	1221 : 237,
	1226 : 238,
	1397 : 271
});
[0.19256756756756757, 0.1945364238410596, -0.1945364238410596, 0.22972972972972974]


*/

// 当年是否为八月满月。
Dai_Date.is_full8 = function(year) {
	if (year == 0)
		// 0年 days_diff = 29，排成无八月满月较合适。
		return 0;
	var days_diff = Dai_Date.days_6_1(year + 1) - Dai_Date.days_6_1(year) - 354
			| 0;
	// assert: 0: 无闰月, 30: 闰9月.
	// assert: 双九月与八月满月不置在同一年。
	if (days_diff >= 30)
		days_diff -= 30;
	// assert: days_diff == 0 || 1
	return days_diff;
};

/*

CeL.Dai_Date(0).format({
	parser : 'CE',
	format : '%Y/%m/%d %年干支年%日干支日',
	locale : 'cmn-Hant-TW'
});

for (var y = 1233, i = 0, m; i < 12; i++) {
	m = i + 6 > 12 ? i - 6 : i + 6;
	console.log(y + '/' + m + '/' + 1 + ': ' + CeL.Dai_Date(y, m, 1).format({
		parser : 'CE',
		format : '%年干支年%日干支日',
		locale : 'cmn-Hant-TW'
	}));
}

*/

Dai_Date.date_name = function(date) {
	return date > 15 ? '下' + (date - 15) : date === 15 ? '望' : '出' + date;
};

// 当年日序 : 节日名
var Dai_festivals = {
	1 : '泼水节 元旦',
	364 : '泼水节 除夕',
	365 : '泼水节 空1日',
	366 : '泼水节 空2日'
};

// return 纪元积日数之 [ year, month, date, festival ];
Dai_Date.date_of_days = function(days, options) {
	// 前置处理。
	if (!library_namespace.is_Object(options))
		options = Object.create(null);

	var date, festival,
	//
	year = Dai_Date.to_valid_year(Dai_Date.year_of_days(days),
			options.ignore_year_limit),
	//
	date_name = options.format === 'serial' ? function(d) {
		return d;
	} : Dai_Date.date_name;
	if (isNaN(year))
		// 超出可转换之范围。
		return [];

	date = Dai_Date.new_year_days(year) | 0;
	// 节日
	festival = Dai_festivals[days - date + 1];
	// 取得自 6/1 起之日数(当年日序数)
	date = days - Dai_Date.days_6_1(year, date);
	if (date >= (29 + 30 + 29)) {
		if (Dai_Date.is_full8(year)) {
			if (date === (29 + 30 + 29))
				return [ year, 8, date_name(30), festival ];
			date--;
		}
		if (date >= 2 * (29 + 30) && Dai_Date.is_leap(year)) {
			if (date < 2 * (29 + 30) + 30) {
				if ((date -= 2 * (29 + 30) - 1) === 15)
					festival = '关门节';
				return [ year, '闰9', date_name(date), festival ];
			}
			date -= 30;
		}
	}

	// month starts @ 6.
	var month = 6 + ((date / (29 + 30) | 0) << 1) | 0;
	if ((date %= 29 + 30) >= 29)
		month++, date -= 29;
	date++;
	if (month > 12) {
		month -= 12;
		if (month >= 6 && ((month > 6 ? date + 29 : date)
		// 在 date < 今年元旦日序的情况下，由于仍具有独一性，因此不加上'后'。
		>= Dai_Date.new_year_date_serial(year)))
			// 会将空日视为前面的一年。
			month = '后' + month;
	}
	if (!festival && date === 15)
		if (month === 12)
			festival = '开门节';
		else if (month === 9 && !Dai_Date.is_leap(year))
			festival = '关门节';

	return [ year, month, date_name(date), festival ];
};


// 傣历纪元起算日期。
Dai_Date.epoch = String_to_Date('638/3/22', {
	parser : 'Julian'
}).getTime()
// 傣历纪元积日数 = JDN - 1954166
- Dai_Date.new_year_days(0) * ONE_DAY_LENGTH_VALUE;


/*

console.error(CeL.Dai_Date.test(-20 * 366, 20000 * 366).join('\n'));
console.error(CeL.Dai_Date.test('699/3/21'.to_Date('CE'), 4).join('\n'));

console.error(CeL.Dai_Date.test(1000 * 366, 2000 * 366).join('\n'));
console.error(CeL.Dai_Date.test(new Date('1845/4/11'), 4).join('\n'));

// get:
-42657868800000 (-7304): -20/6/20
-42626332800000 (-6939): -19/6/1
-42594796800000 (-6574): -18/6/12
-42563174400000 (-6208): -17/6/24
-42531638400000 (-5843): -16/6/5
-42500102400000 (-5478): -15/6/15
-42468566400000 (-5113): -14/6/26
-42436944000000 (-4747): -13/6/8
-42405408000000 (-4382): -12/6/19
-42342336000000 (-3652): -10/6/10
-42310713600000 (-3286): -9/6/22
-42279177600000 (-2921): -8/6/3
-42247641600000 (-2556): -7/6/14
-42216105600000 (-2191): -6/6/25
-42184483200000 (-1825): -5/6/6
-42152947200000 (-1460): -4/6/17
-42121411200000 (-1095): -3/6/28
-42089875200000 (-730): -2/6/9
-42058252800000 (-364): -1/6/21


2014/4/27 13:44:6
CeL.Dai_Date.test(CeL.Dai_Date.new_year_days(0,0,1),CeL.Dai_Date.new_year_days(3192,0,1)).join('\n')
日期名未接续: 0/6/9/泼水节 空1日 ⇨ 1/6/12/泼水节 元旦 (639/3/22 CE)
日期名未接续: 1/5/22/泼水节 空2日 ⇨ 2/6/0/泼水节 元旦 (640/3/22 CE)
...

CeL.Dai_Date.test(CeL.Dai_Date.new_year_days(712,0,1),CeL.Dai_Date.new_year_days(3192,0,1)).join('\n')
...
日期名未接续: 712/5/9/泼水节 空1日 ⇨ 713/6/0/泼水节 元旦 (1351/3/28 CE)
...
日期名未接续: 3190/后7/29/泼水节 空2日 ⇨ 3191/6/0/泼水节 元旦 (3829/5/16 CE)
...

CeL.Dai_Date.test(CeL.Dai_Date.new_year_days(714, 0, 1), CeL.Dai_Date.new_year_days(3191, 0, 1) - 1).join('\n') || 'OK';
// "OK"

*/

Dai_Date.test = new_tester(function(date) {
	return date.to_Dai({
		ignore_year_limit : true,
		format : 'serial'
	});
}, Dai_Date);


_.Dai_Date = Dai_Date;



//----------------------------------------------------------------------------------------------------------------------------------------------------------//
// Myanmar calendar, 缅历, 缅甸历法, မြန်မာသက္ကရာဇ်.

// References:

// Wikipedia: Burmese calendar
// https://en.wikipedia.org/wiki/Burmese_calendar

// Irwin(1909)
// The Burmese & Arakanese calendars
// Irwin, Alfred Macdonald Bulteel. (A.M.B. Irwin) 1853-
// https://archive.org/details/burmesearakanese00irwiiala

// Cool Emerald(2015)
// Cool Emerald: Algorithm, Program and Calculation of Myanmar Calendar
// http://cool-emerald.blogspot.sg/2013/06/algorithm-program-and-calculation-of.html
// "My algorithm is only designed for ME years >= 0"

// Cool Emerald(2015/5)
// https://plus.google.com/u/1/+YanNaingAye-Mdy/posts/1eMwo3CbrWZ


// Irwin(1909) paragraph 34.
// According to the Surya Siddhanta a maha-yug of
// 4,320,000 years contains
// 1,577,917,828 days.
// 1,603,000,080 didi.
// 25,082,252 kaya.
// 51,840,000 solar months.
// 53,433,336 lunar months.
// 1,593,336 adimath.
//
// https://en.wikipedia.org/wiki/Yuga
// MAHAYUG: 1200*(4*360)+1200*(3*360)+1200*(2*360)+1200*(1*360) = 4320000
//
// mean tropical year days  (Thandeikta solar year, ayana hnit)
// ≈ 365.2587564814814814814814814814814814814814814814814814814814...
var Myanmar_YEAR_DAYS = 1577917828 / 4320000,
// ONE_DAY_LENGTH_VALUE * Myanmar_YEAR_DAYS
// = 31558356560
Myanmar_YEAR_LENGTH_VALUE = ONE_DAY_LENGTH_VALUE / 4320000 * 1577917828,
// mean synodic month days (Thandeikta lunar month)
// ≈ 29.53058794607171822474269620747617180405879954790769567522417...
Myanmar_MONTH_DAYS = 1577917828 / 53433336,

// accumulated solar days of every month.
// = Myanmar_YEAR_DAYS / 12 - Myanmar_MONTH_DAYS
// = 26189096670773/28854001440000
// ≈ 0.907641760718405232047427249313951652731323908882427781565952...
// cf. epact: the moon age when tropical year starts. https://en.wikipedia.org/wiki/Epact
Myanmar_month_accumulated_days = Myanmar_YEAR_DAYS / 12 - Myanmar_MONTH_DAYS,

// https://en.wikipedia.org/wiki/Kali_Yuga
// According to the Surya Siddhanta, Kali Yuga began at midnight (00:00) on 18 February 3102 BCE in the proleptic Julian calendar
//
// Cool Emerald(2015)
// The Kali Yuga year number can be obtained by adding 3739 to the Myanmar year.
// The start of Kali Yuga in the Myanmar calendar is found to be 588465.560139 in Julian date. (MO - 3739 SY)
Myanmar_Kali_Yuga_offset = 3739,
// The first era: The era of Myanmar kings
// The second era: The era under British colony
Myanmar_era_2_year = 1217,
// The third era: The era after Independence
Myanmar_era_3_year = 1312,
// Irwin(1909) paragraph 50.
// The difference in time between the entry of the apparent sun and that of the mean sun into the sign Meiktha is called in India Sodhya, and in Burma Thingyan. The length of this period is fixed at 2 yet 10 nayi and 3 bizana (2 days 4 hours 1 minute and 12 seconds).
// The day on which the Thingyan commences is called Thingyan Kya, and the day on which it ends Thingyan Tet.
// = 187272000
Myanmar_Thingyan_LENGTH_VALUE = new Date(0, 0, 2, 4, 1, 12) - new Date(0, 0, 0, 0, 0, 0),
// Cool Emerald(2015)
// A typical Myanmar calendar mentions the beginning of the year called the atat time and it is the end of the Thingyan. The starting time of the Thingyan is called the akya time.
// The length of the Thingyan currently recognized by Myanmar Calendar Advisory Board is 2.169918982 days ( 2days, 4 hours, 4 minutes and 41 seconds). When the time of ancient Myanmar kings, 2.1675 days (2 days, 4 hours, 1 min and 12 seconds) was used as the length of the Thingyan.
// = 187481000
Myanmar_Thingyan_3rd_LENGTH_VALUE = new Date(0, 0, 2, 4, 4, 41) - new Date(0, 0, 0, 0, 0, 0),
// local timezone offset value
TIMEZONE_OFFSET_VALUE = String_to_Date.default_offset * (ONE_DAY_LENGTH_VALUE / 24 / 60),

// Myanmar_cache[reference][year] = year data = {
//	Tagu_1st: time value of Tagu 1st,
//	watat: watat type (0: common / 1: little watat / 2: big watat),
//	full_moon: time value of full moon day of watat year
// }
Myanmar_cache = [ [], [] ],
// Myanmar_month_days[ watat : 0, 1, 2 ]
// = [ days of month 1 (Tagu), days of month 2, ... ]
Myanmar_month_days = [],
// Myanmar_month_days_count[ watat : 0, 1, 2 ]
// = [ accumulated days of month 1 (Tagu), accumulated days of month 2, ... ]
Myanmar_month_days_count = [],

// @see https://github.com/yan9a/mcal/blob/master/mc.js
// 1060: beginning of well-known (historical) Myanmar year
// well-known exceptions
Myanmar_adjust_watat = {
	// Thandeikta (ME 1100 - 1216)
	1201 : true,
	1202 : false,

	// The second era (the era under British colony: 1217 ME - 1311 ME)
	1263 : true,
	1264 : false,

	// The third era (the era after Independence	1312 ME and after)
	1344 : true,
	1345 : false
},
// well-known exceptions
Myanmar_adjust_fullmoon = {
	// Thandeikta (ME 1100 - 1216)
	1120 : 1,
	1126 : -1,
	1150 : 1,
	1172 : -1,
	1207 : 1,

	// The second era (the era under British colony: 1217 ME - 1311 ME)
	1234 : 1,
	1261 : -1,

	// The third era (the era after Independence	1312 ME and after)
	1377 : 1
},
// for fullmoon: Cool Emerald - Based on various evidence such as inscriptions, books, etc...
// Cool Emerald(2015/11)
// got modified dates based on feedback from U Aung Zeya who referred to multiple resources such as Mhan Nan Yar Za Win, Mahar Yar Za Win, J. C. Eade, and inscriptions etc...
Myanmar_adjust_CE = {
	// Makaranta system 1 (ME 0 - 797)
	205 : 1,
	246 : 1,
	471 : 1,
	572 : -1,
	651 : 1,
	653 : 2,
	656 : 1,
	672 : 1,
	729 : 1,
	767 : -1,

	// Makaranta system 2 (ME 798 - 1099)
	813 : -1,
	849 : -1,
	851 : -1,
	854 : -1,
	927 : -1,
	933 : -1,
	936 : -1,
	938 : -1,
	949 : -1,
	952 : -1,
	963 : -1,
	968 : -1,
	1039 : -1
},
// for fullmoon: Tin Naing Toe & Dr. Than Tun
// Cool Emerald(2015/5)
// from T. N. Toe (1999) which he said referred from Dr. Than Tun and Irwin. I am currently building that of Irwin (xIRWIN)  and J. C. Eade (xEADE) to add in the calendar.﻿
Myanmar_adjust_TNT = {
	205 : 1,
	246 : 1,
	813 : -1,
	854 : -1,
	1039 : -1
},
// references before 1060.
Myanmar_reference =[ Myanmar_adjust_CE, Myanmar_adjust_TNT ];



// Year 0 date
// https://en.wikipedia.org/wiki/Burmese_calendar
// (Luce Vol. 2 1970: 336): According to planetary positions, the current Burmese era technically began at 11:11:24 on 22 March 638.
if (false)
	Myanmar_Date.epoch = String_to_Date('638/3/22 11:11:24', {
		parser : 'Julian'
	}).getTime();

// Cool Emerald(2015/5)
// ME 1377 (my=1377) Myanmar calendar says new year time is 2015-Apr-16 20:35:57
// = 638/3/22 13:12:53.880 local time	(new Date(CeL.Myanmar_Date.epoch).format('CE'))
// Myanmar_Date.epoch = new Date(2015, 4 - 1, 16, 20, 35, 57) - 1377 * Myanmar_YEAR_LENGTH_VALUE;

// Cool Emerald(2018/7)
// beginning of 0 ME: MO is estimated as Julian Date 1954168.050623.
Myanmar_Date.epoch = library_namespace.JD_to_Date(1954168.050623).getTime();

// 'နှောင်း': Hnaung (e.g., Hnaung Tagu, Late Tagu)
Myanmar_Date.month_name = 'ဦးတပေါင်း|တန်ခူး|ကဆုန်|နယုန်|ဝါဆို|ဝါခေါင်|တော်သလင်း|သီတင်းကျွတ်|တန်ဆောင်မုန်း|နတ်တော်|ပြာသို|တပို့တွဲ|တပေါင်း|နှောင်းတန်ခူး|နှောင်းကဆုန်'
	.split('|');
// intercalary month
// 'ဒု': Second (e.g., Second Waso)
Myanmar_Date.month_name.waso = [ 'ပဝါဆို', 'ဒုဝါဆို' ];

Myanmar_Date.month_name.en = 'Early Tabaung|Tagu|Kason|Nayon|Waso|Wagaung|Tawthalin|Thadingyut|Tazaungmon|Nadaw|Pyatho|Tabodwe|Tabaung|Late Tagu|Late Kason'
	.split('|');
Myanmar_Date.month_name.en.waso = [ 'First Waso', 'Second Waso' ];

// Irwin(1909) paragraph 38.
// In Burma the zero of celestial longitude does not move with the precession of the equinoxes as in Europe.
// Irwin(1909) paragraph 104.
// The equinox is said to have coincided with Thingyan Kya about 207 years before Poppasaw's epoch, i.e., about 411 A.D.
// Irwin(1909) paragraph 107.
// Through the accumulation of precession, Thingyan Kya is now about 24 days after the vernal equinox.

// initialization of accumulated days / month name
(function() {
	function push_queue() {
		(m = month_name.slice())
		// reverse index
		.forEach(function(value, index) {
			m[value] = index;
		});

		(m.en = month_name.en.slice())
		// reverse index
		.forEach(function(value, index) {
			m[value] = index;
		});

		queue.month = m;
		Myanmar_month_days_count.push(queue);
	}

	var m, count = 0, days, queue = [ count ],
	// days in the month
	month_days = [],
	// new year's day often falls on middle Tagu, even Kason.
	month_name = Myanmar_Date.month_name.slice();
	month_name.en = Myanmar_Date.month_name.en.slice();

	for (m = 0; m < month_name.length; m++) {
		month_days.push(days = m % 2 === 0 ? 29 : 30);
		queue.push(count += days);
	}
	push_queue();

	Myanmar_month_days.push(month_days.slice());
	month_days.splice(5 - 1, 0, 30);
	Myanmar_month_days.push(month_days.slice());
	month_days[2]++;
	Myanmar_month_days.push(month_days);

	// insert leap month, 2nd Waso
	queue = queue.slice();
	// 5: index of 2nd Waso
	queue.splice(5, 0, queue[5 - 1]);

	// adapt intercalary month name.
	m = Myanmar_Date.month_name.waso;
	month_name.splice(5 - 1, 1, m[0], m[1]);
	m = Myanmar_Date.month_name.en.waso;
	month_name.en.splice(5 - 1, 1, m[0], m[1]);

	// add accumulated days to all months after 2nd Waso
	for (m = 5; m < month_name.length; m++)
		queue[m] += 30;
	push_queue();

	queue = queue.slice();
	// add 1 day to all months after 30 days Nayon
	// 3: index of Nayon
	for (m = 3; m < month_name.length; m++)
		queue[m]++;
	push_queue();
})();


// Cool Emerald(2015)
// The day before the akya day is called the akyo day (the Thingyan eve).
// the day after the atat day is called new year's day.
// The days between the akya day and the atat day are called akyat days.
/**
 * get year start date of Myanmar calendar.<br />
 * Using integer to calculate Myanmar new year's day.
 *
 * @param {Integer}year
 *            year of Myanmar calendar.
 * @param {Object}[options]
 *            options to use
 *
 * @returns {Date} system Date (proleptic Gregorian calendar with year 0)
 */
Myanmar_Date.new_year_Date = function(year, options) {
	var date = Myanmar_Date.epoch + year * Myanmar_YEAR_LENGTH_VALUE,
	// remainder: time value after local midnight of the date.
	// (date + TIMEZONE_OFFSET_VALUE): convert ((date)) to UTC so we can use .mod(ONE_DAY_LENGTH_VALUE) to reckon the time value.
	// Because (date at UTC+0 midnight).mod(ONE_DAY_LENGTH_VALUE) === 0.
	remainder = (date + TIMEZONE_OFFSET_VALUE).mod(ONE_DAY_LENGTH_VALUE), info,
	// get detail information.
	detail = options && options.detail;

	if (detail)
		info = {
			// * Thingyan start: Thingyan Kya, akya time
			start_time : date - (year < Myanmar_era_3_year ? Myanmar_Thingyan_LENGTH_VALUE
			//
			: Myanmar_Thingyan_3rd_LENGTH_VALUE),
			// * Thingyan end: Thingyan Tet, atat time
			end_time : date
		};

	// Convert the date to local midnight of next day, the new year's day.
	// assert: The remainder should bigger than 0.
	date += ONE_DAY_LENGTH_VALUE - remainder;

	if (!detail)
		// local midnight of new year's day
		return options && options.get_value ? date : new Date(date);

	// get time and more information.
	// new year's day (local midnight)
	info.new_year = date;
	// Thingyan end day: atat day (local midnight)
	info.end = date - ONE_DAY_LENGTH_VALUE;

	date = info.start_time;
	// assert: The remainder should bigger than 0.
	date -= (date + TIMEZONE_OFFSET_VALUE).mod(ONE_DAY_LENGTH_VALUE);
	// Thingyan (သႀကၤန္), Myanmar new year festival: akya day (local midnight)
	info.start = date;
	// Thingyan eve: akyo day (local midnight)
	info.eve = date - ONE_DAY_LENGTH_VALUE;

	if (false)
		for (date in info)
			info[date] = (new Date(info[date])).format('CE');

	// info.eve: Thingyan eve: akyo day
	// info.start: Thingyan start day, Myanmar new year festival, 泼水节: akya day
	// info.start_time: Thingyan start: Thingyan Kya, akya time
	//
	// days between akya day, atat day: akyat days
	//
	// info.end: Thingyan end day: atat day
	// info.end_time: Thingyan end: Thingyan Tet, atat time
	// info.new_year: new year's day
	return info;
};



/*

# Myanmar leap year

Myanmar leap year on 2,5,7,10,13,15,18 / 19

** But Wikipedia denotes prior to 1740, it's 2, 5, 8, 10, 13, 16, 18.

for(var i=0;i<19;i++){for(var y=0,_y,l=[];y<19;y++){_y=(7*y+i)%19;if(_y<7)l.push(y);}console.log(i+':'+l);}
// 9:2,5,7,10,13,15,18
@see Tabular_list_leap()

→ Myanmar year is a leap year if:
(7*year+9).mod(19)<7

*/

/**
 * check if it's a watat year.<br />
 *
 * @param {Integer}year
 *            year of Myanmar calendar.
 * @param {Integer}[reference]
 *            reference to use. see Myanmar_reference.
 *
 * @returns {Date} system Date (proleptic Gregorian calendar with year 0)
 */
Myanmar_Date.watat_data = function(year, reference) {
	var cache = Myanmar_cache[reference |= 0];
	if (year in cache)
		return cache[year];

	var accumulated_months = year < Myanmar_era_2_year ? -1 : year < Myanmar_era_3_year ? 4 : 8,
	// reckon excess days
	excess_days = ((year + Myanmar_Kali_Yuga_offset) * Myanmar_YEAR_DAYS) % Myanmar_MONTH_DAYS;
	// adjust excess days
	if (excess_days < Myanmar_month_accumulated_days * (12 - accumulated_months))
		excess_days += Myanmar_MONTH_DAYS;

	// Using historical data directly.
	var watat = year in Myanmar_adjust_watat ? Myanmar_adjust_watat[year]
	// find watat by 19 years metonic cycle.
	// see "# Myanmar leap year" above.
	: year < Myanmar_era_2_year ? (7 * year + 9).mod(19) < 7
	// find watat based on excess days. value below denotes threshold for watat.
	: excess_days >= Myanmar_MONTH_DAYS - Myanmar_month_accumulated_days * accumulated_months;

	// the full moon day of Second Waso only needs to reckon in the watat year.
	if (!watat)
		return cache[year] = {
			watat : 0
		};

	// reckon the full moon day of second Waso

	// Use TIMEZONE_OFFSET_VALUE & Math.floor() to convert between UTC and local time,
	// to get local midnight of specified date.
	var fullmoon = Math.floor((Myanmar_Date.epoch + TIMEZONE_OFFSET_VALUE) / ONE_DAY_LENGTH_VALUE
		// full moon accumulated days from Myanmar_Date.epoch
		+ (year * Myanmar_YEAR_DAYS - excess_days + 4.5 * Myanmar_MONTH_DAYS
		// 1.1, 0.85:
		// The constant which is used to adjust the full moon time of Second Waso is denoted by WO and its value for the third era is therefore -0.5.
		// By analyzing ME table [Toe, 1999], to fit them to our method,
		// we've got two offsets as 1.1 and 0.85 for before and after ME 1100
		// respectively
		- (year < 1100 ? 1.1 : year < Myanmar_era_2_year ? 0.85
		// 4 / accumulated_months:
		// it is 4 and half month from the latest new moon before new year
		// 2 nd era is 1 day earlier and 3rd ear is 0.5 day earlier (i.e. to make full
		// moon at midnight instead of noon)
		: 4 / accumulated_months))
		);

	// adjust for exceptions
	var table
	// 1060: beginning of well-known (historical) Myanmar year
	= year < 1060 ? reference && Myanmar_reference[reference] || Myanmar_reference[0] : Myanmar_adjust_fullmoon;
	if (year in table)
		fullmoon += table[year];

	return cache[year] = {
		// is watat year
		watat : true,
		// to get local midnight of specified date.
		fullmoon : fullmoon * ONE_DAY_LENGTH_VALUE - TIMEZONE_OFFSET_VALUE
	};
};


/**
 * get information of year. e.g., watat year, full moon day.<br />
 * Here we use the algorithm developed by Yan Naing Aye.
 *
 * @param {Integer}year
 *            year of Myanmar calendar.
 * @param {Object}[options]
 *            options to use
 *
 * @returns {Object} year data {<br />
 *          watat : 0: common / 1: little watat / 2: big watat,<br />
 *          Tagu_1st : The first day of Tagu<br />
 *          fullmoon : full moon day of 2nd Waso<br /> }
 *
 * @see http://cool-emerald.blogspot.sg/2013/06/algorithm-program-and-calculation-of.html
 * @see http://mmcal.blogspot.com
 */
Myanmar_Date.year_data = function(year, options) {
	var year_data = Myanmar_Date.watat_data(year),
	//
	reference = (options && options.reference) | 0;
	// "TypeError: invalid 'in' operand year_data" for minus years
	if ('Tagu_1st' in year_data)
		return year_data;

	var last_watat_year = year, last_watat_data;
	while (0 === (last_watat_data
	// find the lastest watat year before this year.
	= Myanmar_Date.watat_data(--last_watat_year, reference)).watat);

	if (year_data.watat)
		// This year is a watat year, and test if it is a big watat year.
		year_data.watat
		// assert: (... % 354) should be 30 or 31.
		= (year_data.fullmoon - last_watat_data.fullmoon) / ONE_DAY_LENGTH_VALUE
		// 354: common year days.
		% 354 === 31 ? 2 : 1;

	// Tagu 1st time value
	// The first day of Tagu is not only determined by the full moon day of that year.
	year_data.Tagu_1st = last_watat_data.fullmoon + (354 * (year - last_watat_year) - 102) * ONE_DAY_LENGTH_VALUE;

	return year_data;
};


/**
 * get days count of specified year.<br />
 * The sum of all days should be 365 or 366.
 *
 * @param {Integer}year
 *            year of Myanmar calendar.
 * @param {Object}[options]
 *            options to use
 *
 * @returns {Array} days count
 */
Myanmar_Date.month_days = function(year, options) {
	var year_data = Myanmar_Date.year_data(year),
	end = Myanmar_Date.new_year_Date(year + 1, {
		get_value : true
	}),
	// the last day of the year counts from Tagu 1.
	date = Date_to_Myanmar(end - ONE_DAY_LENGTH_VALUE, {
		format : 'serial'
	}),
	//
	month_days = Myanmar_month_days[year_data.watat].slice(0, date[1] - 1);
	month_days.end = end;
	month_days.end_date = date;
	month_days.push(date[2]);

	month_days.start_date
	// date (new year's day) counts from Tagu 1.
	= date = Date_to_Myanmar(month_days.start = Myanmar_Date.new_year_Date(year, {
		get_value : true
	}), {
		format : 'serial'
	});

	if (date[1] < 1)
		// assert: date[1] === 0
		// Early Tabaung: 30 days
		month_days.unshift(30 + 1 - date[2]);
	else
		month_days.splice(0, date[1], month_days[date[1] - 1] + 1 - date[2]);

	if (options && ('start_month' in options)
	// assert: options.start_month < date[1]. e.g., ((0))
	&& (end = date[1] - options.start_month) > 0)
		Array.prototype.unshift.apply(month_days, new Array(end).fill(0));

	return month_days;
};


/**
 * get Date of Myanmar calendar.<br />
 * Myanmar date → Date
 *
 * @param {Integer}year
 *            year of Myanmar calendar.
 * @param {Natural}month
 *            month of Myanmar calendar.<br />
 *            Using 1 for Oo Tagu (Early Tagu) and 13 (14) for Hnaung Tagu (Late Tagu).
 * @param {Natural}date
 *            date of Myanmar calendar.
 * @param {Object}[options]
 *            options to use
 *
 * @returns {Date} system Date (proleptic Gregorian calendar with year 0)
 */
function Myanmar_Date(year, month, date, options) {
	var year_data = Myanmar_Date.year_data(year, options);
	if (isNaN(date))
		date = 1;

	// reckon days count from Tagu 1
	var month_days = Myanmar_month_days_count[year_data.watat];
	if (isNaN(month))
		// e.g., CeL.Myanmar_Date(1370,'Tawthalin',18).format()
		// @see 'reverse index' of push_queue()
		// may get invalid month name.
		month = month_days.month[month];

	// e.g., 654/3/23 CE
	// treat as the last month, 'Early Tabaung' (30 days) of last year.
	if (month === 0)
		// - 1: serial to index.
		date -= 30 + 1;
	else
		// -1: serial to index.
		date += month_days[month - 1 || 0] - 1;

	return new Date(year_data.Tagu_1st + date * ONE_DAY_LENGTH_VALUE);
}

_.Myanmar_Date = Myanmar_Date;


/**
 * get Myanmar calendar (of Date).<br />
 * Date → Myanmar date
 *
 * @param {Date}date
 *            system date to convert.
 * @param {Object}[options]
 *            options to use
 *
 * @returns {Array} [ year, month, date ]
 */
function Date_to_Myanmar(date, options) {
	// 前置处理。
	if (!library_namespace.is_Object(options))
		options = Object.create(null);

	// reckon the year of ((date))
	var year = Math.floor((date - Myanmar_Date.epoch)
			/ Myanmar_YEAR_LENGTH_VALUE),
	//
	year_data = Myanmar_Date.year_data(year, options),
	// days count from Tagu 1
	days = (date - year_data.Tagu_1st) / ONE_DAY_LENGTH_VALUE,
	// 30 > mean month days. So the true month may be month or month + 1.
	month = days / 30 | 0,
	// for notes
	weekday = options.notes && date.getDay(),
	//
	accumulated_days = Myanmar_month_days_count[year_data.watat];

	// Test next month, or should be this month.
	var Myanmar_date = days - accumulated_days[month + 1];
	if (Myanmar_date < 0)
		days -= accumulated_days[month];
	else
		days = Myanmar_date, month++;

	if (days < 0)
		if (month !== 0)
			throw 'Unknown error of ' + date.format('CE');
		else
			// month: 0 → -1
			// e.g., 654/3/23 CE
			// Early Tabaung: 30 days
			month--, days += 30;
	// month: month index, Tagu: 0
	// assert: now days >=0.

	// +1: index to ordinal.
	Myanmar_date = [ year, month + 1, ++days | 0 ];
	if (0 < (days %= 1))
		Myanmar_date.push(days);

	// Early Tabaung: 30 days
	var month_days = month < 0 ? 30
	//
	: accumulated_days[month + 1] - accumulated_days[month];

	/**
	 * calendar notes / 历注<br />
	 * Myanmar Astrological Calendar Days
	 *
	 * notes: {Array} all notes with Myanmar language
	 *
	 * @see http://cool-emerald.blogspot.sg/2013/12/myanmar-astrological-calendar-days.html
	 */
	if (typeof weekday === 'number') {
		var notes = [],
		// 0–11, do not count First Waso.
		month_index = month,
		//
		tmp = ((date - Myanmar_Date.epoch)
				% Myanmar_YEAR_LENGTH_VALUE) / ONE_DAY_LENGTH_VALUE | 0;

		// at start or end of year.
		if (tmp < 2 || 359 < tmp) {
			var new_year_info = Myanmar_Date.new_year_Date(tmp < 2 ? year : year + 1, {
				detail : true
			});
			if (tmp < 2) {
				if (date - new_year_info.new_year === 0)
					// New year's day
					notes.push("နှစ်ဆန်းတစ်ရက် (New year's day)");
			} else {
				days = date - new_year_info.eve;
				if (days >= 0 && new_year_info.new_year - date >= 0) {
					days = days / ONE_DAY_LENGTH_VALUE | 0;
					tmp = (new_year_info.new_year - new_year_info.eve) / ONE_DAY_LENGTH_VALUE | 0;
					switch (days) {
					case 0:
						// Thingyan eve (akyo day)
						tmp = 'သင်္ကြန်အကြို (Thingyan eve)';
						break;

					case 1:
						// Thingyan start day. akya day. akya time:
						tmp = 'သင်္ကြန်အကျ (Thingyan start at ' + (new Date(new_year_info.start_time))
							.format({
								parser : 'CE',
								format : '%H:%M:%S'
							}) + ')';
						break;

					case tmp - 1:
						// Thingyan end day. atat day. atat time:
						tmp = 'သင်္ကြန်အတက် (Thingyan end at ' + (new Date(new_year_info.end_time))
							.format({
								parser : 'CE',
								format : '%H:%M:%S'
							}) + ')';
						break;

					default:
						// Thingyan akyat, days between akya day, atat day: akyat days
						tmp = 'သင်္ကြန်အကြတ် (Thingyan akyat)';
						break;
					}

					notes.push(tmp);
				}
			}
		}

		if (month_index < 0)
			// assert: month_index === -1 (Early Tabaung)
			month_index = 11;
		else if (year_data.watat && month > 3)
			// month after First Waso.
			month_index--;

		days = Myanmar_date[2];
		// full moon days, new moon days and waxing and waning 8 are sabbath days. The day before sabbath day is sabbath eve.
		if (days === 8 || days === 15 || days === 23 || days === month_days)
			// Sabbath
			notes.push('ဥပုသ်');
		else if (days === 7 || days === 14 || days === 22 || days === month_days - 1)
			// Sabbath Eve
			notes.push('အဖိတ်');

		// Yatyaza: ရက်ရာဇာ
		tmp = [ {
			3 : 1,
			4 : 2,
			5 : 1,
			6 : 2
		}, {
			3 : 2,
			4 : 1,
			5 : 2,
			6 : 1
		}, {
			0 : 2,
			1 : 2,
			2 : 1,
			4 : 1
		}, {
			0 : 1,
			2 : 2,
			3 : 3
		} ][month_index % 4][weekday];
		if (tmp)
			if (tmp === 3)
				// Yatyaza, Pyathada (afternoon) / Afternoon Pyathada
				notes.push('ရက်ရာဇာ', 'မွန်းလွဲပြဿဒါး');
			else
				// [ , 'Yatyaza', 'Pyathada' ]
				notes.push([ , 'ရက်ရာဇာ', 'ပြဿဒါး' ][tmp]);

		//for(month=0;month<12;month++){i=month===8?7:(((month+3)%12)*2)%7+1;console.log(month+':'+i);}
		if ((weekday - (month_index === 8 ? 7 : ((month_index + 3) % 12) * 2 + 1)) % 7 >= -1) {
			// Thamanyo
			tmp = 'သမားညို';
			if (month_index === 10 && weekday === 3)
				// (afternoon)
				tmp = 'မွန်းလွဲ' + tmp;
			notes.push(tmp);
		}

		// days: waxing or waning day, 1–14
		if ((days = Myanmar_date[2]) > 15)
			days -= 15;
		if (days === [ 8, 3, 7, 2, 4, 1, 5 ][weekday])
			// Amyeittasote
			notes.push('အမြိတ္တစုတ်');
		if (days === [ 1, 4, 8, 9, 6, 3, 7 ][weekday])
			// Warameittugyi
			notes.push('ဝါရမိတ္တုကြီး');
		if (days + weekday === 12)
			// Warameittunge
			notes.push('ဝါရမိတ္တုငယ်');
		if (days === [ 1, 4, 6, 9, 8, 7, 8 ][weekday])
			// Yatpote
			notes.push('ရက်ပုပ်');
		if ([ [ 1, 2 ], [ 6, 11 ], [ 6 ], [ 5 ], [ 3, 4, 6 ], [ 3, 7 ], [ 1 ] ][weekday].includes(days))
			// Thamaphyu
			notes.push('သမားဖြူ');
		if ([ [ 2, 19, 21 ], [ 1, 2, 4, 12, 18 ], [ 10 ], [ 9, 18 ], [ 2 ], [ 21 ], [ 17, 26 ] ][weekday].includes(Myanmar_date[2]))
			// Nagapor
			notes.push('နဂါးပေါ်');
		if (days % 2 === 0
		//
		&& days === (month_index % 2 ? month_index + 3 : month_index + 6) % 12)
			// Yatyotema
			notes.push('ရက်ယုတ်မာ');
		if (days - 1 === (((month_index + 9) % 12) / 2 | 0))
			// Mahayatkyan
			notes.push('မဟာရက်ကြမ်း');
		if (days === [ 8, 8, 2, 2, 9, 3, 3, 5, 1, 4, 7, 4 ][month_index])
			// Shanyat
			notes.push('ရှမ်းရက်');
		// Nagahle
		// http://www.cool-emerald.com/2013/12/blog-post.html#nagahlem
		notes.push('နဂါးခေါင်းလှည့်: ' + nagahle_direction[((month_index + 1) % 12) / 3 | 0]);

		if (notes.length > 0)
			Myanmar_date.notes = notes;
	}

	if (options.format === 'serial') {

	} else if (options.locale === 'my') {
		// ↑ my: Myanmar language

		// Produce a Myanmar date string
		// @see https://6885131898aff4b870269af7dd32976d97cca04b.googledrive.com/host/0B7WW8_JrpDFXTHRHbUJkV0FBdFU/mc_main_e.js
		// function m2str(my, myt, mm, mmt, ms, d, wd)

		// CeL.numeral.to_Myanmar_numeral()
		var numeral = library_namespace.to_Myanmar_numeral || function(number) {
			return number;
		};
		// Myanmar year
		Myanmar_date[0] = 'မြန်မာနှစ် ' + numeral(year) + ' ခု၊ ';
		// month
		Myanmar_date[1] = accumulated_days.month[Myanmar_date[1]];
		// date
		days = Myanmar_date[2];
		Myanmar_date[2] = days < 15 ? 'လဆန်း ' + numeral(days) + ' ရက်'
		// The 15th of the waxing (လပြည့် [la̰bjḛ]) is the civil full moon day.
		: days === 15 ? 'လပြည့်'
		// The civil new moon day (လကွယ် [la̰ɡwɛ̀]) is the last day of the month (14th or 15th waning).
		: days >= 29 && days === month_days ? 'လကွယ်' : 'လဆုတ် ' + numeral(days - 15) + ' ရက်';
		// time
		if (options.time) {
			days = date.getHours();
			// hour
			Myanmar_date[4] = (days === 0 ? 'မွန်းတက် ၁၂ '
			: days === 12 ? 'မွန်းလွဲ ၁၂ '
			: days < 12 ? 'မနက် ' + numeral(h)
				: ((days -= 12) > 6 ? 'ည '
				: days > 3 ? 'ညနေ '
				// assert: 0 < days <= 3
				: 'နေ့လယ် '
				)+ numeral(h)
			) + 'နာရီ၊';
			// assert: Myanmar_date.length === 5
			// minute, second
			Myanmar_date.push(numeral(date.getMinutes()) + ' မိနစ်၊', numeral(date.getSeconds()) + ' စက္ကန့်');
		}
		// weekday
		Myanmar_date[3] = '၊ '
			+ [ 'တနင်္ဂနွေ', 'တနင်္လာ', 'အင်္ဂါ', 'ဗုဒ္ဓဟူး',
				'ကြာသပတေး', 'သောကြာ', 'စနေ' ][date.getDay()] + 'နေ့၊';

		// Myanmar_date = [ year, month, date, weekday, hour, minute, second ]
		// Using Myanmar_date.join(' ') to get full date name.

	} else {
		Myanmar_date[1] = accumulated_days.month.en[Myanmar_date[1]];
		days = Myanmar_date[2];
		Myanmar_date[2] = days < 15 ? 'waxing ' + days
		// The 15th of the waxing (လပြည့် [la̰bjḛ]) is the civil full moon day.
		: days === 15 ? 'full moon'
		// The civil new moon day (လကွယ် [la̰ɡwɛ̀]) is the last day of the month (14th or 15th waning).
		: days >= 29 && days === month_days ? 'new moon' : 'waning ' + (days - 15);
	}

	return Myanmar_date;
}

// west,north,east,south
var nagahle_direction = 'အနောက်,မြောက်,အရှေ့,တောင်'.split(',');


/*

// confirm
CeL.run('https://googledrive.com/host/0B7WW8_JrpDFXTHRHbUJkV0FBdFU/mc.js');

for(var y=-100;y<2000;y++){var d=chk_my(y);CeL.assert([d.myt,CeL.Myanmar_Date.year_data(y).watat],'t'+y);d=j2w(d.tg1,1);CeL.assert([d.y+'/'+d.m+'/'+d.d,CeL.Myanmar_Date(y).format('%Y/%m/%d')],y);}
// true


'654/3/23'.to_Date('CE').to_Myanmar()

CeL.Myanmar_Date.test(-2e4, 4e6, 4).join('\n') || 'OK';
// "OK"

*/
Myanmar_Date.test = new_tester(Date_to_Myanmar, Myanmar_Date, {
	epoch : Date.parse('638/3/22'),
	continued_month : function(month, old_month) {
		// month === 0: e.g., 654/3/23 CE
		// month === 2: e.g., Late Tagu / Late Kason → Kason
		return month <= 2 && 0 <= month
		// The old month is the last month of last year.
		&& 12 <= old_month && old_month <= 14;
	}
});



//----------------------------------------------------------------------------------------------------------------------------------------------------------//
// 长历: Hindu calendar / 印度历
// https://en.wikipedia.org/wiki/Hindu_calendar

/*
基本计算参照来源:
http://www.cc.kyoto-su.ac.jp/~yanom/pancanga/
Based on Pancanga (version 3.14) with small changes.

S. P. Bhattacharya and S. N. Sen, Ahargana in Hindu Astronomy, IJHS 4.1-2 (1969) 144-55.
http://insa.nic.in/writereaddata/UpLoadedFiles/IJHS/Vol04_1And2_14_SPBhattacharyya.pdf



http://ephemeris.com/history/india.html
Like Ptolemy, Hindu astronomers used epicycles (small circular motions within the larger circular orbit around the Earth) to describe the motion of the planets in a geocentric Solar System. One method of epicycles ("manda" in Sanskrit) was given in the Surya Siddhanta.

http://www.ima.umn.edu/~miller/Nelsonlecture1.pdf
古印度占星术(天文学)中，星体运行主要依循绕著地球公转的轨道，但星体本身绕著此轨道小公转。而所有轨道皆正圆(?)，皆以恒定速率公转、小公转。
因此星体经度可以从纪元积日数 (Ahargana)乘以平均速率，加上 apogee (远地点)参数估算推得。


@see
https://archive.org/details/indiancalendarwi00seweuoft
https://en.wikipedia.org/wiki/Hindu_calendar
http://vedicastro.com/vedic-system-of-calculating-ascendant/
https://en.wikipedia.org/wiki/Hindu_astrology
http://www2u.biglobe.ne.jp/~suchowan/when_exe/When/Ephemeris/Hindu.html
http://zh.scribd.com/doc/133208102/Horoscope-Construction-and-Organisation
http://www.hamsi.org.nz/p/blog-page_19.html
http://www.encyclopedia.com/doc/1G2-2830904948.html

https://astrodevam.com/blog/tag/sayana-lagna/
http://jyotisha.00it.com/Difference.htm
http://vedicastro.com/basic-concepts-of-astronomy-relevant-to-astrology/
http://www.rubydoc.info/gems/when_exe/0.4.1/When/Ephemeris/Hindu

http://www.astrogyan.com/panchang/day-24/month-06/year-2015/indian_calender_june_24_2015.html
https://github.com/suchowan/when_exe/blob/master/lib/when_exe/region/indian.rb

Indian Calendar
http://www.math.nus.edu.sg/aslaksen/calendar/indian.html

*/


// copy from application.astronomy
var
/**
 * 周角 = 360°, 1 turn, 1 revolution, 1 perigon, full circle, complete
 * rotation, a full rotation in degrees.
 */
TURN_TO_DEGREES = 360 | 0,
/**
 * degrees * DEGREES_TO_RADIANS = radians.
 * 
 * DEGREES_TO_RADIANS = 2π/360 =
 * 0.017453292519943295769236907684886127134428718885417254560971... ≈
 * 1.745329251994329576923691e-2
 * 
 * @see https://github.com/kanasimi/IAU-SOFA/blob/master/src/sofam.h
 */
DEGREES_TO_RADIANS = 2 * Math.PI / TURN_TO_DEGREES,

// $PlanetCircumm{}
Hindu_circum = {
	sun : 13 + 50 / 60,
	moon : 31 + 50 / 60
},

Hindu_apogee = {
	sun : 77 + 17 / 60
},

//https://en.wikipedia.org/wiki/Ujjain
Hindu_day_offset = 75.777222 / TURN_TO_DEGREES,
//Month names based on the rāshi (Zodiac sign) into which the sun transits
//within a lunar month
//https://en.wikipedia.org/wiki/Hindu_zodiac
Hindu_zodiac_signs = 12 | 0,
Hindu_zodiac_angle = TURN_TO_DEGREES / Hindu_zodiac_signs | 0,

Hindu_month_count = Hindu_zodiac_signs,
Hindu_month_angle = TURN_TO_DEGREES / Hindu_month_count | 0,

// 自日出起算。日出 (6:0) 为印度历当日起始。Day begins at sunrise.
Hindu_days_begin = .25,

// names
Hindu_leap_prefix = 'Adhika ',
// month names (मासाः, भारतीयमासाः)
// https://sa.wikipedia.org/wiki/%E0%A4%AD%E0%A4%BE%E0%A4%B0%E0%A4%A4%E0%A5%80%E0%A4%AF%E0%A4%AE%E0%A4%BE%E0%A4%B8%E0%A4%BE%E0%A4%83
Hindu_month_name =
	//'|Chaitra|Vaiśākha|Jyeṣṭha|Āṣāḍha|Śrāvaṇa|Bhādrapada, Bhādra or Proṣṭhapada|Āśvina|Kārtika|Agrahāyaṇa, Mārgaśīrṣa|Pauṣa|Māgha|Phālguna'
	'|Chaitra (चैत्र)|Vaiśākha (वैशाख)|Jyeṣṭha (ज्येष्ठ)|Āṣāḍha (आषाढ)|Śrāvaṇa (श्रावण)|Bhādra (भाद्रपद)|Āśvina (अश्विन्)|Kārtika (कार्तिक)|Agrahāyaṇa (मार्गशीर्ष)|Pauṣa (पौष)|Māgha (माघ)|Phālguna (फाल्गुन)'
	.split('|'),
Hindu_year_name =
	'Prabhava|Vibhava|Shukla|Pramoda|Prajāpati|Āngirasa|Shrīmukha|Bhāva|Yuva|Dhātri|Īshvara|Bahudhānya|Pramādhi|Vikrama|Vrisha|Chitrabhānu|Svabhānu|Tārana|Pārthiva|Vyaya|Sarvajeeth|Sarvadhāri|Virodhi|Vikrita|Khara|Nandana|Vijaya|Jaya|Manmatha|Durmukhi|Hevilambi|Vilambi|Vikāri|Shārvari|Plava|Shubhakruti|Sobhakruthi|Krodhi|Vishvāvasu|Parābhava|Plavanga|Kīlaka|Saumya|Sādhārana|Virodhikruthi|Paridhāvi|Pramādicha|Ānanda|Rākshasa|Anala|Pingala|Kālayukthi|Siddhārthi|Raudra|Durmathi|Dundubhi|Rudhirodgāri|Raktākshi|Krodhana|Akshaya'
	.split('|'),
// Nakshatra (Sanskrit: नक्षत्र, IAST: Nakṣatra) 二十七宿
// https://en.wikipedia.org/wiki/Nakshatra
Nakṣatra =
	// 'Ashwini (अश्विनि)|Bharani (भरणी)|Kritika (कृत्तिका)|Rohini(रोहिणी)|Mrigashīrsha(म्रृगशीर्षा)|Ārdrā (आर्द्रा)|Punarvasu (पुनर्वसु)|Pushya (पुष्य)|Āshleshā (आश्लेषा)|Maghā (मघा)|Pūrva or Pūrva Phalgunī (पूर्व फाल्गुनी)|Uttara or Uttara Phalgunī (उत्तर फाल्गुनी)|Hasta (हस्त)|Chitra (चित्रा)|Svātī (स्वाति)|Viśākhā (विशाखा)|Anurādhā (अनुराधा)|Jyeshtha (ज्येष्ठा)|Mula (मूल)|Pūrva Ashādhā (पूर्वाषाढ़ा)|Uttara Aṣāḍhā (उत्तराषाढ़ा)|Śrāvaṇa (श्र‌ावण)|Śrāviṣṭha (श्रविष्ठा) or Dhanishta|Shatabhisha (शतभिषा)or Śatataraka|Pūrva Bhādrapadā (पूर्वभाद्रपदा)|Uttara Bhādrapadā (उत्तरभाद्रपदा)|Revati (रेवती)'
	'Aśvinī अश्विनी|Bharaṇī भरणी|Kṛttikā कृत्तिका|Rohiṇī रोहिणी|Mṛgaśirṣa मृगशिर्ष|Ārdrā आद्रा|Punarvasu पुनर्वसु|Puṣya पुष्य|Aśleṣā आश्ळेषा / आश्लेषा|Maghā मघा|Pūrva or Pūrva Phalguṇī पूर्व फाल्गुनी|Uttara or Uttara Phalguṇī उत्तर फाल्गुनी|Hasta हस्त|Citrā चित्रा14|Svāti स्वाति|Viśākha विशाखा|Anurādhā अनुराधा|Jyeṣṭha ज्येष्ठा|Mūla मूल/मूळ|Pūrvāṣāḍha पूर्वाषाढा|Uttarāṣāḍha उत्तराषाढा|Śravaṇa श्रवण|Śraviṣṭhā or Dhaniṣṭha श्रविष्ठा or धनिष्ठा|Śatabhiṣak or Śatatārakā शतभिषक् / शततारका|Pūrva Bhādrapadā पूर्वभाद्रपदा / पूर्वप्रोष्ठपदा|Uttara Bhādrapadā उत्तरभाद्रपदा / उत्तरप्रोष्ठपदा|Revatī रेवती'
	.split('|'),
//Hindu_weekday_name
// the Vāsara (ancient nomeclature), vāra (modern nomeclature), like in ravi-vāra, somā-vāra, etc. or weekday
Vāsara = 'Ravi vāsara रविवासर|Soma vāsara सोमवासर|Maṅgala vāsara मंगलवासर|Budha vāsara बुधवासर|Guru vāsara गुरुवासर|Śukra vāsara शुक्रवासर|Śani vāsara शनिवासर'.split('|'),

/*
https://en.wikipedia.org/wiki/Kali_Yuga
According to the Surya Siddhanta, Kali Yuga began at midnight (00:00) on 18 February 3102 BCE in the proleptic Julian calendar, or 14 January 3102 BC in the proleptic Gregorian calendar.

http://www.new1.dli.ernet.in/data1/upload/insa/INSA_1/2000c4e3-359.pdf
K. Chandra Hari, HISTORICAL NOTES. Indian Journal of History of Science, 39.3 (2004) 359-364.
Kali epoch: 18 February 3102 BC 06:00 Ujjain Mean time
Varahamihira Epoch: Tuesday, Caitra 1,427 Saka (22 March 505 AD)
Brahmagupta epoch: Sunday Caitra 1, 587 Saka (23 March 665 AD). JDN (Bag)= 1964031 : This refers to the day beginning at 12:00 GMT of Sunday and not the 00:00 GMT of Sunday or mean sunrise at Ujjain.
Epoch of KaraYJ,akutuhala: Bag placed the KaraYJ, akutuhala epoch at Thursday, Caitra-s ukla mean sunrise Saka1105 (24 February 1183 AD), Kalilnda6 = 1564737.
Epoch ofGrahaliighava: Caitra S(l), 19 March 1520 AD, Kalidina = 1687850
*/
Kali_epoch = String_to_Date('-3102/2/18', {
	parser : 'Julian'
}).getTime(),

Hindu_year_offset = {
	// Saka 0 = Kali Yuga 3179, サカ纪元
	Saka : 3179,
	Vikrama : 3044
},


Hindu_constants = Object.create(null);

// सूर्य सिद्धांत
// https://en.wikipedia.org/wiki/Surya_Siddhanta
// based on SuryaSiddhanta (c. 1200).
// Saura, HIL, p.15
// It is partly based on Vedanga Jyotisha, which itself might reflect traditions going back to the Indian Iron Age (around 700 BCE).
Hindu_constants.Surya_Siddhanta = {
	// revolutions in a mahayuga
	// asterisrn
	star : 1582237828,

	// planets
	// revolutions in a mahayuga
	sun : 4320000,
	moon : 57753336,
	mercury : 17937060,
	venus : 7022376,
	mars : 2296832,
	jupiter : 364220,
	saturn : 146568,

	// http://www.hamsi.org.nz/p/blog-page_19.html
	// Candrocca, the apogee of Moon. 月球远地点
	moon_apogee : 488203,
	// Rahu, the south lunar nodes, 月球升交点
	north_lunar_node : -232238
};

// https://en.wikipedia.org/wiki/Var%C4%81hamihira#Pancha-Siddhantika
// based on older constants in Pancasiddhantika (c. 575).
// Latadeva/Ardharatrika, HIL, p.15
Hindu_constants.Pancha_Siddhantika = {
	star : 1582237800,

	sun : 4320000,
	moon : 57753336,
	mercury : 17937000,
	venus : 7022388,
	mars : 2296824,
	jupiter : 364220,
	saturn : 146564,

	moon_apogee : 488219,
	north_lunar_node : -232226
};

var Hindu_default_system = Hindu_constants.Surya_Siddhanta;


//Hindu_Date.constants = Hindu_constants;

(function() {
	for ( var system in Hindu_constants) {
		system = Hindu_constants[system];
		var civil_days = system.star - system.sun;
		// assert: 0 < system[object]: 星体每天移动的角度 (degrees)。
		// so we can use ((days * system[object]))
		// to get the mean longitude of the object in the Indian astronomy.
		for ( var object in system)
			system[object] *= TURN_TO_DEGREES / civil_days;
		system.year_days = TURN_TO_DEGREES / system.sun;
		// cache for Hindu_Date.conjunction()
		system.conjunction = Object.create(null);
		system.moon_sun = 1 / (system.moon - system.sun);
		system.moon_days = system.moon_sun * TURN_TO_DEGREES;
	}

	for ( var object in Hindu_circum)
		Hindu_circum[object] /= TURN_TO_DEGREES;
})();

/*
manda correction 修正

manda (Sanskrit: मन्द)
http://www.sanskritdictionary.com/scans/?col=3&img=mw0787.jpg
the (upper) apsis of a planet's course or (according to some) its anomalistic motion - See more at: http://www.sanskritdictionary.com/manda/171277/1#sthash.ASB1VNSi.dpuf
http://www.sanskritdictionary.com/?q=luna&iencoding=iast&lang=sans

http://www.physics.iitm.ac.in/~labs/amp/kerala-astronomy.pdf
two correctionsnamely manda samskara and sighra samskara are applied to the mean planet to obtain the true longitude.
Themandasamskara is equivalentto taking into account tbe eccentricity of the planet's orbit. DitTerent computational schemes for the manda samsknra arc discussed in Indian astronomical literature.
http://ephemeris.com/history/india.html
Like Ptolemy, Hindu astronomers used epicycles (small circular motions within the larger circular orbit around the Earth) to describe the motion of the planets in a geocentric Solar System. One method of epicycles ("manda" in Sanskrit) was given in the Surya Siddhanta.
*/
Hindu_Date.longitude_correction = function(circum, argument) {
	// circum: Hindu_circum[object]
	return Math.asin(circum * Math.sin(argument * DEGREES_TO_RADIANS))
			/ DEGREES_TO_RADIANS;
};

// the true longitudes of Sun in the Indian astronomy
//sub get_tslong
Hindu_Date.true_solar_longitude = function(days, system) {
	var mean_longitude = days * system.sun;
	return mean_longitude - Hindu_Date.longitude_correction
	// mean solar longitude → true solar longitude
	(Hindu_circum.sun, mean_longitude - Hindu_apogee.sun);
};

// the true longitudes of Moon in the Indian astronomy
//sub get_tllong
Hindu_Date.true_lunar_longitude = function(days, system) {
	var mean_longitude = days * system.moon;
	return mean_longitude - Hindu_Date.longitude_correction
	// mean lunar longitude → true lunar longitude
	(Hindu_circum.moon, mean_longitude
	//
	- days * system.moon_apogee - TURN_TO_DEGREES / 4);
};



//sub get_conj
Hindu_Date.conjunction = function(days, system, angle, next, no_recursion) {
	if (!(angle >= 0))
		// 日月夹角 angle in degrees: 0–TURN_TO_DEGREES
		angle = (Hindu_Date.true_lunar_longitude(days, system) - Hindu_Date
				.true_solar_longitude(days, system)).mod(TURN_TO_DEGREES);

	// 设定初始近似值。
	if (next)
		days += (TURN_TO_DEGREES - angle) * system.moon_sun;
	else
		days -= angle * system.moon_sun;

	// 使用 cache 约可省一半时间。

	// index: month count from Kali_epoch
	var index = Math.round(days / system.moon_days);
	if (index in system.conjunction) {
		return system.conjunction[index];
	}

	// console.log('count [' + index + ']:' + days);
	var longitude;
	// 范围设在 [ days - 1, days + 1 ] 会在 Hindu_Date.test(1969867, 1969868) 出问题。
	days = library_namespace.find_root(function(days) {
		longitude = Hindu_Date.true_solar_longitude(days, system);
		angle = (Hindu_Date.true_lunar_longitude(days, system) - longitude)
				.mod(TURN_TO_DEGREES);
		// console.log(days + ': ' + longitude + ',' + angle);
		// angle: -180–180
		return angle > TURN_TO_DEGREES / 2 ? angle - TURN_TO_DEGREES : angle;
	}, days - 1, days + 1);

	if (!Number.isFinite(days))
		throw 'Hindu_Date.conjunction: Cannot find days!';

	// ** 在此计算 month, year 不能节省时间，纯粹为了降低复杂度用。
	longitude = longitude.mod(TURN_TO_DEGREES);

	// $masa_num
	// month index
	// 月分名以当月月初之后首个太阳进入的 Rāśi (zodiac sign) 为准。
	var month = longitude / Hindu_zodiac_angle + 1,
	// 只有恰好在前后的时候，才需要检测。否则月中跨越 zodiac 的次数应该都是 1。
	transit = Math.abs(month - Math.round(month)) > .1 && 1;
	month = (month | 0).mod(Hindu_zodiac_signs);
	if (!transit) {
		if (no_recursion)
			// 不递回
			return {
				month : month
			};
		// 检测下一次日月合朔时的 longitude 与资讯。
		transit = (Hindu_Date.conjunction(days, system, 0, true, true).month - month)
				.mod(Hindu_zodiac_signs);
	}

	// 日月合朔时的 conjunction information
	return system.conjunction[index] = {
		// start days (Kali-ahargana, NOT date!)
		days : days,
		// month index: 0–(Hindu_zodiac_signs-1)
		month : month,
		// How many times the sun transits into next rāshis.
		// 太阳在月中跨越 zodiac 的次数。
		// 0: Adhika means "extra", leap month.
		// 1: normal month.
		// 2: Kṣaya means "loss". (Ksaya)
		transit : transit,
		// Kali year: 以太阳实际进入 Meṣa 所在月份来分年，当月为新年第一月。
		year : Math.floor((month < 2
		// https://en.wikipedia.org/wiki/Hindu_calendar#Year_of_the_lunisolar_calendar
		// * If an adhika Chaitra is followed by a nija Chaitra, the new year
		// starts with the nija Chaitra.
		// * If an adhika Chaitra is followed by a Chaitra-Vaishākha kshaya, the
		// new year starts with the adhika Chaitra.
		// * If a Chaitra-Vaiśākha Kṣaya occurs with no adhika Chaitra before
		// it, then it starts the new year.
		&& (0 < month || 0 < transit)
		// If a Chaitra-Phālguna Kṣaya' occurs, it starts the new year.
		|| month === Hindu_zodiac_signs - 1 && transit === 2
		// 当在年初年尾时，若判别已经过、或将进入 Meṣa，特别加点数字以当作下一年。
		// 采用 2 个月是为了预防有 leap。
		? days + 60 : days) / system.year_days),
		longitude : longitude
	};
};


function Hindu_Date(year, month, date, options) {
	// 前置处理。
	if (!library_namespace.is_Object(options))
		options = Object.create(null);

	if (options.era in Hindu_year_offset)
		year += Hindu_year_offset[options.era];

	var system = options.system && Hindu_constants[options.system]
			|| Hindu_default_system,
	// 太阳在月中跨越 zodiac 的次数。
	transit = 1, matched;

	if (typeof month === 'string')
		if (month.startsWith(Hindu_leap_prefix))
			transit = 0, month = month.slice(Hindu_leap_prefix.length);
		else if (matched = month.match(/(\d{1,2})[\-–]\d{1,2}/))
			transit = 2, month = matched[1];

	var diff, last_diff = Infinity, days,
	// 设定初始近似值。
	conjunction = Hindu_Date.conjunction(year * system.year_days + --month
			* system.moon_days, system);

	// 找寻准确值。
	while (diff = (year - conjunction.year)
			* system.year_days
			+ (month - conjunction.month
			// If we want to get a normal month after leap month, add 1.
			// 这时 conjunction 为上个月的。
			+ (conjunction.transit === 0 && transit > 0
					&& month === conjunction.month ? 1 : 0)) * system.moon_days) {
		// 进来至此的机会应该不多。
		// console.log('Hindu_Date: diff: ' + diff);

		// 应该越来越接近。
		if (!(Math.abs(diff) < last_diff))
			throw new Error('Hindu_Date(' + [ year,
			//
			transit ? month + 1 : '"' + Hindu_leap_prefix + (month + 1) + '"',
			//
			date ] + '): 无法找到准确值!');
		last_diff = Math.abs(diff);
		conjunction = Hindu_Date
				.conjunction(conjunction.days + diff, system, 0);
	}

	// assert: 年月份皆已正确。

	if (transit !== conjunction.transit)
		// 做补救措施。
		if (transit === 0 && month === 0) {
			// 处理如 4115/Adhika 1 (1015/2/22 CE)，为 4116/1 前一个月的情况。
			// assert: conjunction.transit === 1,
			// 取到了本年1月，但本应该取年末之 Adhika 1。
			conjunction = Hindu_Date.conjunction((year + 1) * system.year_days
					- system.moon_days, system);
		} else if (transit === 0 && conjunction.transit === 1
				&& month === conjunction.month) {
			// If we want to get the leap month before normal month, sub 1.
			// 这时 conjunction 为下个月的。
			conjunction = Hindu_Date.conjunction(conjunction.days
					- system.moon_days, system, 0);
		} else if (transit === 2 && conjunction.transit === 1
				&& month === conjunction.month) {
			// e.g., Hindu_Date(5393,'2-3',29)
			conjunction = Hindu_Date.conjunction(conjunction.days
					- system.moon_days, system, 0);
		}

	// last check.
	if (transit !== conjunction.transit || year !== conjunction.year
			|| month !== conjunction.month)
		throw new Error('Hindu_Date(' + [ year,
		//
		transit ? month + 1 : '"' + Hindu_leap_prefix + (month + 1) + '"',
		//
		date ] + '): 无法找到准确值: 日期或 transit 错误。 transit: ' + transit + ', get '
				+ conjunction.transit);

	// 合朔后首个日出开始为当月起始。
	// conjunction.days 为日月合朔时刻。
	var days = Math.floor(conjunction.days - Hindu_days_begin) + date;

	// 还是取到 midnight (0:0)。
	return new Date(Kali_epoch + days * ONE_DAY_LENGTH_VALUE);
}


_.Hindu_Date = Hindu_Date;


function Date_to_Hindu(date, options) {
	// 前置处理。
	if (!library_namespace.is_Object(options))
		options = Object.create(null);

	// $year/$month/$day → $JulianDay
	// → $ahar, $mllong, $mslong, $tllong, $tslong, $tithi, $clong, $nclong
	// → $YearSaka|$YearVikrama/$adhimasa $masa_num/$sukla_krsna $tithi_day

	// Kali-ahargana, civil days
	// Ahargana: Heap of days, sum of days, day count, 纪元积日数
	// http://www.indiadivine.org/content/topic/1445853-calendar/
	// Every kerala Panchanga (ephemeris) gives the Ahargana (kalidina) alias 'day count' for for every day.
	// http://cs.annauniv.edu/insight/Reading%20Materials/astro/sharptime/ahargana.htm
	// In Sanskrit 'ahoratra' means one full day and 'gana' means count. Hence, the Ahargana on any given day stands for the number of lunar days that have elapsed starting from an epoch.
	// http://www.ibiblio.org/sripedia/oppiliappan/archives/jun05/msg00030.html
	// 6, 6, 2005, Monday has been the 1865063rd day(5106.4 year) in Kali Yuga (Kali-ahargana: 1865063)
	var days = (date - Kali_epoch) / ONE_DAY_LENGTH_VALUE + Hindu_days_begin;

	// 后面的演算基于在 Ujjain 的天文观测，因此需要转换 local days 至 Ujjain 对应的日数。
	if (!isNaN(options.minute_offset))
		// desantara
		days += Hindu_day_offset - options.minute_offset / 60 / 24;

	var system = options.system && Hindu_constants[options.system]
			|| Hindu_default_system,
	//
	true_lunar_longitude = Hindu_Date.true_lunar_longitude(days, system).mod(TURN_TO_DEGREES),
	// 日月夹角 angle in degrees: 0–TURN_TO_DEGREES
	angle = (true_lunar_longitude - Hindu_Date.true_solar_longitude(days, system)).mod(TURN_TO_DEGREES),
	// 上一次日月合朔时的 longitude
	conjunction = Hindu_Date.conjunction(days, system, angle),
	// 太阳在月中跨越 zodiac 的次数。
	transit = conjunction.transit;

	// https://en.wikipedia.org/wiki/Tithi
	// reckon tithi: the longitudinal angle between the Moon and the Sun to increase by 12°.
	// tithi 相当于中历日期，或月龄。
	// When a new moon occurs before sunrise on a day, that day is said to be the first day of the lunar month.
	if(false)
		Hindu_date = angle / Hindu_month_count | 0;
	// 为了使日期在例如 1315/10/8 能延续，因此采用减去月初日期的方法，而非上者。
	var Hindu_date = days - conjunction.days | 0;

	Hindu_date = [ conjunction.year, conjunction.month + 1, Hindu_date + 1 ];
	// $YearKali → other era
	if (options.era in Hindu_year_offset)
		Hindu_date[0] -= Hindu_year_offset[options.era];

	Hindu_date.transit = transit;
	if (transit > 1)
		Hindu_date[1] += '–' + (Hindu_date[1] < Hindu_zodiac_signs ? Hindu_date[1] + 1 : 1);
	// month type. e.g., [ 'leap', '', 'loss' ]
	// Adhika Māsa (Adhika or "extra"), nija ("original") or Śuddha ("unmixed"), Kṣaya-Māsa (Ksaya or "loss")
	if (options.epithet) {
		Hindu_date[1] = options.epithet[Hindu_date.transit] + Hindu_date[1];
	} else if (transit === 0)
		Hindu_date[1] = Hindu_leap_prefix + Hindu_date[1];

	if (options.format === 'serial') {
		if (options.note) {
			// $naksatra
			// 时不时有重号或跳号现象。似乎是正常？
			Hindu_date.Nakṣatra = Nakṣatra[true_lunar_longitude * 27 / TURN_TO_DEGREES | 0];
			Hindu_date.Vāsara = Vāsara[date.getDay()];
		}

	} else {
		// 12: Manmatha (2015-16)
		Hindu_date[0] = Hindu_year_name[(Hindu_date[0] + 11).mod(Hindu_year_name.length)];

		if (transit === 0)
			// reset
			Hindu_date[1] = conjunction.month + 1;
		// TODO: epithet nija ("original") or Śuddha ("unmixed").
		Hindu_date[1] = (isNaN(Hindu_date[1]) ? Hindu_date[1].replace(/\d+/g, function($0) {
			return Hindu_month_name[$0];
		}) : Hindu_month_name[Hindu_date[1]])
		// epithet / prefix
		+ (transit === 0 ? ' adhika-' : transit > 1 ? ' kṣaya-' : ' ')
		// māsa = lunar month
		+ 'māsa';

		// https://en.wikipedia.org/wiki/Tithi

		Hindu_date[2] = Hindu_date[2] < 15
		// https://en.wikipedia.org/wiki/Amavasya
		// Amavasya (Sanskrit: अमावस्या) means new moon night in Sanskrit.
		// Shukla Paksha is a period of 15 days, which begins on the Shukla Amavasya (New Moon) day and culminating Poornima (Full Moon) day and is considered auspicious.
		? Hindu_date[2] === 1 ? 'Amavasya (अमावस्या)'
		// http://marathidictionary.org/meaning.php?id=55359&lang=Marathi
		// शुक्लपक्ष - suklapaksa - [śuklapakṣa]
		// the period of the waxing moon.
		// Śukla Pakṣa, 'bright part' of the month
		: 'Śukla Pakṣa (शुक्लपक्ष) ' + Hindu_date[2]
		// https://en.wikipedia.org/wiki/Purnima
		// Purnima (also called Poornima, Sanskrit: पूर्णिमा) Pūrṇimā (the full moon)
		: Hindu_date[2] === 15 ? 'Purnima (पूर्णिमा)'
		// http://www.marathidictionary.org/meaning.php?id=12728&lang=Marathi
		// कृष्णपक्ष - krsnapaksa - [kṛṣṇapakṣa]
		// the fortnight of the waning moon
		// Kṛṣṇa Pakṣa, the'dark part' of the month.
		: 'Kṛṣṇa Pakṣa (कृष्णपक्ष) ' + (Hindu_date[2] - 15);

		if (options.format === 'name')
			Hindu_date = Hindu_date.join(' ');
	}

	return Hindu_date;
}


/*

var Kali_epoch = CeL.String_to_Date('-3102/2/18', {
	parser : 'Julian'
}).getTime();
('0001/1/1'.to_Date('CE')-Kali_epoch)/86400000

'0001/1/1'.to_Date('CE').to_Hindu({era:'Saka'})
'0300/1/1'.to_Date('CE').to_Hindu({era:'Saka'})
for(d=new Date(-1,0,1).getTime();d<new Date();d+=86400000)new Date(d).to_Hindu({era:'Saka'})

s=new Date;for(d=new Date(1600,0,1).getTime();d<new Date();d+=86400000)new Date(d).to_Hindu({era:'Saka'});new Date-s;

?? 1315. October 8 to November 5 were Kārtika Adhika-Māsa. November 6 to December 5 were Kārtika-Mārgaśīrṣa Kṣaya-Māsa. December 6 onwards was Pauṣa.
'1315/10/8'.to_Date('CE').to_Hindu({era:'Saka'})

*/

/*

CeL.Hindu_Date.test(15e5, 2e6, 4).join('\n') || 'OK';
CeL.Hindu_Date(4115,'Adhika 1',1)
CeL.Hindu_Date(4124,'Adhika 2',1)
CeL.Hindu_Date(4134,'8-9',1)
// 1455/1/19
new Date(-16249536000000).to_Hindu()


CeL.Hindu_Date.test(1969867, 1969868, 4).join('\n') || 'OK';
// Hindu_Date(5393,2,1): 无法找到准确值: 日期或 transit 错误。 transit: 2, get 1
CeL.Hindu_Date(5393,2,1)


new Date(-25541942400000).to_Hindu()


CeL.Hindu_Date.test(2574530, 4e6, 4).join('\n') || 'OK';
new Date(3947,11,26).to_Hindu()
new Date(62416454400000).to_Hindu()

CeL.Hindu_Date.test(-2e4, 4e6, 4).join('\n') || 'OK';
// "OK"
// 564259 ms, error 0/4

*/
Hindu_Date.test = new_tester(Date_to_Hindu, Hindu_Date, {
	epoch : Kali_epoch,
	month_serial : function(date_name) {
		return (Hindu_Date(date_name[0], date_name[1], 1)
		// 计算月份差距。
		- Hindu_Date(date_name[0], 1, 1))
		// 29 <= 最小月份日数，但又不致跳月。
		/ 29 / ONE_DAY_LENGTH_VALUE | 0;
	},
	continued_month : function(month, old_month) {
		if (typeof old_month === 'string')
			if (old_month.startsWith(Hindu_leap_prefix))
				return month === +old_month.slice(Hindu_leap_prefix.length);
		return month === 1 && (old_month === 12 || old_month === 13);
	}
});



//----------------------------------------------------------------------------------------------------------------------------------------------------------//
// 长历: भारतीय राष्ट्रीय पंचांग / Indian national calendar / Saka calendar / 印度国定历
// https://en.wikipedia.org/wiki/Indian_national_calendar

// Years are counted in the Saka Era, which starts its year 0 in the year 78 of the Common Era.
// epochal year of 78 CE
var Saka_epochal_year = 78 | 0,
// 前六个月日数。
Indian_national_6_months_days = 6 * 31 | 0,
// Indian_national_month_name[month_serial] = month name
Indian_national_month_name = '|Chaitra|Vaishākha|Jyaishtha|Āshādha|Shrāvana|Bhādrapada|Āshwin|Kārtika|Agrahayana|Pausha|Māgha|Phālguna'.split('|');

function Indian_national_Date(year, month, date) {
	// has year 0

	year += Saka_epochal_year;
	// 预设当作闰年，3/21 起 Indian_national_6_months_days 日 + 6*30日。
	if (--month > 0
	// 则只有平年一月份需特别处理。
	|| is_leap_year(year))
		date--;
	date += month < 6 ? 31 * month : Indian_national_6_months_days + 30
			* (month - 6);

	return _Date(year, 3 - 1, 21 + date);
}

// Usage officially started at Chaitra 1, 1879 Saka Era, or March 22, 1957.
Indian_national_Date.epoch = _Date(Saka_epochal_year, 3 - 1, 22).getTime();

Indian_national_Date.is_leap = function(year) {
	return is_leap_year(Saka_epochal_year + year);
};

Indian_national_Date.month_name = function(month_serial) {
	return Indian_national_month_name[month_serial];
};


function Date_to_Indian_national(date, options) {
	var year = date.getFullYear() | 0, month = date.getMonth() | 0, days;

	if (month < 3 - 1 || month === 3 - 1 && ((days = date.getDate()) < 21
	// 3/20 or 3/21 (平年) 与之前，起始点算在前一年。
	// In leap years, Chaitra has 31 days and starts on March 21 instead.
	|| days === 21 && !is_leap_year(year)))
		year--;

	days = (date - _Date(year, 3 - 1, 21)) / ONE_DAY_LENGTH_VALUE | 0;
	// assert : days >= 0

	if (days >= Indian_national_6_months_days)
		days -= Indian_national_6_months_days,
		//
		month = 6 + days / 30 | 0, days %= 30;

	else if ((month = days / 31 | 0) > 0)
		days %= 31;
	else if (!is_leap_year(year))
		days--;

	// 日期序数→日期名。year/month/date index to serial.
	return _format([ year - Saka_epochal_year, month + 1, days + 1 ], options,
			Date_to_Indian_national.to_name);
}

Date_to_Indian_national.to_name = [ library_namespace.to_Devanagari_numeral,
		Indian_national_Date.month_name,
		library_namespace.to_Devanagari_numeral ];

/*

CeL.Indian_national_Date.test(-2e4, 4e6, 4).join('\n') || 'OK';
// "OK"

'0078/3/24'.to_Date().to_Indian_national()
// [0, 1, 3]

*/
Indian_national_Date.test = new_tester(Date_to_Indian_national,
		Indian_national_Date, {
			month_days : {
				31 : 'first 6 months',
				30 : 'last 6 months'
			}
		});


_.Indian_national_Date = Indian_national_Date;


//----------------------------------------------------------------------------------------------------------------------------------------------------------//
// 长历: 现行孟加拉历
// The Bengali Calendar or Bangla Calendar (বঙ্গাব্দ Bônggabdô or Banggabda) (New revised tropical version - Bangladesh)
// https://en.wikipedia.org/wiki/Bengali_calendar
// http://www.pallab.com/services/bangladateconverter.aspx

// TODO:
// traditional unrevised Bangla calendar 现行于 West Bengal，听说 "Bangla Panjikas according to Surya Siddhanta"，但未详述计算方法。
// http://www.ponjika.com/pBosor.aspx
// http://usingha.com/1.html

// epochal year
// the starting date: 14 April 594 CE
var Bangla_epochal_year = 594 - 1 | 0,
// normalized string. e.g., 'আষাঢ়'.normalize() === 'আষাঢ়'
Bangla_month_name = '|Bôishakh (বৈশাখ)|Jyôishţhô (জ্যৈষ্ঠ)|Ashaŗh (আষাঢ়)|Shrabôn (শ্রাবণ)|Bhadrô (ভাদ্র)|Ashbin (আশ্বিন)|Kartik (কার্তিক)|Ôgrôhayôn (অগ্রহায়ণ)|Poush (পৌষ)|Magh (মাঘ)|Falgun (ফাল্গুন)|Chôitrô (চৈত্র)'
		.split('|'),
// 0: Sunday.
Bangla_weekday_name = 'Rôbibar (রবিবার)|Sombar (সোমবার)|Mônggôlbar (মঙ্গলবার)|Budhbar (বুধবার)|Brihôspôtibar (বৃহস্পতিবার)|Shukrôbar (শুক্রবার)|Shônibar (শনিবার)'
		.split('|');

function Bangla_Date(year, month, date, options) {
	// has year 0

	// according to the revised version of the calendar, now followed in
	// Bangladesh, Pôhela Bôishakh always falls on 14 April.
	year += Bangla_epochal_year;
	date = 14 + Math.min(5, --month) + month * 30 + date - 1;
	if (month === 11 && library_namespace.is_leap_year(year + 1))
		// 为闰年。
		date++;

	if (year < 100 && year >= 0)
		(date = new Date(0, 0)).setFullYear(year, 4 - 1, date);
	else
		date = new Date(year, 4 - 1, date);

	return date;
}

_.Bangla_Date = Bangla_Date;

Bangla_Date.month_name = function(month_serial) {
	return Bangla_month_name[month_serial];
};

Bangla_Date.weekday_name = function(weekday_serial) {
	return Bangla_weekday_name[weekday_serial];
};


// Date.parse 不会比 new Date 快 @ Chrome/45.0.2427.7
function to_date_value(year, month, date) {
	if (year < 100 && year > 0)
		// assert: new Date(Date.parse('0001-01-01')).format() === 1/1/1
		return Date.parse((year < 10 ? '000' : '00') + year + '-'
				+ (month < 10 ? '0' + month : month) + '-'
				+ (date < 10 ? '0' + date : date));
	return Date.parse(year + '/' + month + '/' + date);
}


function Date_to_Bangla(date, options) {
	var _year = date.getFullYear(), year = _year, month = date.getMonth();
	if (month <= 4 - 1 &&
	//
	(month < 4 - 1 || date.getDate() < 14))
		// 取上一年的 4/14，使 days >= 0
		year--;
	// Date.parse 不会比 new Date 快 @ Chrome/45.0.2427.7
	var days = (date - new Date(year, 4 - 1, 14)) / ONE_DAY_LENGTH_VALUE;
	// assert: days >= 0
	if (days < 5 * 31) {
		month = days / 31 | 0;
		days %= 31;
	} else {
		days -= 5 * 31;
		month = 5 + days / 30 | 0;
		days %= 30;
		if (month >= 11 && library_namespace.is_leap_year(_year)
		// 是否为 11/31 或 12/30?
		&& --days < 0) {
			// is 11/31?
			days = --month === 10 ? 30 : 29;
		}
	}

	date = [ year - Bangla_epochal_year, month + 1, (days | 0) + 1,
			date.getDay() ];
	if (days %= 1)
		date.push(days);

	// 日期序数→日期名。year/month/date index to serial.
	return _format(date, options, Date_to_Bangla.to_name);
}

Date_to_Bangla.to_name = [ library_namespace.to_Bangla_numeral,
		Bangla_Date.month_name, library_namespace.to_Bangla_numeral,
		Bangla_Date.weekday_name ];

/*

new Date('540/1/12').to_Bangla({format : 'serial'})
CeL.Bangla_Date(-54, 9, 28).format()
new Date('540/1/14').to_Bangla({format : 'serial'})

new Date('540/3/11').to_Bangla({format : 'serial'})
new Date('540/3/13').to_Bangla({format : 'serial'})
new Date('540/4/13').to_Bangla({format : 'serial'})

CeL.Bangla_Date.test(-2e4, 4e6, 4).join('\n') || 'OK';
// "OK"

*/
Bangla_Date.test = new_tester(Date_to_Bangla, Bangla_Date, {
	epoch : new Date(Bangla_epochal_year + 1, 4 - 1, 14),
	month_days : {
		31 : 'first 5 months or leap month',
		30 : 'last 7 months'
	}
});


// ----------------------------------------------------------------------------------------------------------------------------------------------------------//

/**
 * 长历: 1941/1/1 CE (พ.ศ. 2484) 起的泰国佛历元旦是每年(CE) 1/1。
 * 1889/4/1 (พ.ศ. 2432)  起泰国元旦是每年(CE) 4/1。这之前泰国元旦是每年阴历五月初五，应落在 CE:3,4月。
 * @see https://en.wikipedia.org/wiki/Thai_solar_calendar
 * @see https://th.wikipedia.org/wiki/%E0%B8%9B%E0%B8%8F%E0%B8%B4%E0%B8%97%E0%B8%B4%E0%B8%99%E0%B9%84%E0%B8%97%E0%B8%A2
 * @see https://th.wikipedia.org/wiki/%E0%B8%9B%E0%B8%8F%E0%B8%B4%E0%B8%97%E0%B8%B4%E0%B8%99%E0%B8%AA%E0%B8%B8%E0%B8%A3%E0%B8%B4%E0%B8%A2%E0%B8%84%E0%B8%95%E0%B8%B4%E0%B9%84%E0%B8%97%E0%B8%A2
 * @see https://th.wikipedia.org/wiki/%E0%B8%AA%E0%B8%96%E0%B8%B2%E0%B8%99%E0%B8%B5%E0%B8%A2%E0%B9%88%E0%B8%AD%E0%B8%A2:%E0%B9%80%E0%B8%AB%E0%B8%95%E0%B8%B8%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%93%E0%B9%8C%E0%B8%9B%E0%B8%B1%E0%B8%88%E0%B8%88%E0%B8%B8%E0%B8%9A%E0%B8%B1%E0%B8%99
 */

var Thai_lunar, Thai_epochal_year = -543 | 0;

function Date_to_Thai(date, month, year, options) {
	if (typeof month === 'object') {
		options = month;
	} else {
		options = Object.create(null);
	}
	var _Date, weekday = options.weekday;
	// normalize date
	if (library_namespace.is_Date(date)) {
		_Date = date;
		weekday = date.getDay();
		// month start from 0.
		month = date.getMonth() + 1;
		// http://www.wat.austhai.biz/Home/thai-calendar
		// http://www.myhora.com/%E0%B8%9B%E0%B8%8F%E0%B8%B4%E0%B8%97%E0%B8%B4%E0%B8%99/
		year = date.getFullYear();
		date = date.getDate();
	}

	var use_Thai_lunar = (year < 1889 || year === 1889 && month < 4)
	//
	&& (Thai_lunar || (Thai_lunar = library_namespace.era(
	//
	'ปฏิทินจันทรคติไทย', {
		get_era : true
	}))), 准, holidays = [];
	if (use_Thai_lunar) {
		if ((_Date || (_Date = new Date(year, month - 1, date)))
				- Thai_lunar.start < 0)
			准 = '年';
	} else if (year < 1889) {
		准 = '年';
	}
	if (use_Thai_lunar && !准
	//
	&& (use_Thai_lunar = Thai_lunar.Date_to_date_index(_Date))) {
		// @see 光绪15年3月
		date = Thai_lunar.日名(use_Thai_lunar[2], use_Thai_lunar[1],
				use_Thai_lunar[0]);
		year = date[2];
		month = date[1];
		date = date[0];
		if (month < 5 || month === 5 && date < 5) {
			// 这之前泰国元旦是每年阴历五月初五，应落在 CE:3,4月。
			year--;
		} else if (month === 5 && date === 5) {
			// 新年
			holidays.push('วันขึ้นปีใหม่');
		}

	} else if (year < 1941) {
		// @see 中历1939年11月, 中历1940年2月, 中历1940年12月
		// 月份不动，按照公元的排。
		if (month < 4) {
			year -= Thai_epochal_year + 1;
		} else {
			if (year >= 1889 && month === 4 && date === 1) {
				holidays.push('วันขึ้นปีใหม่');
			}
			year -= Thai_epochal_year;
		}

	} else {
		// 1941/1/1 CE (พ.ศ. 2484) 起
		year -= Thai_epochal_year;
		if (month === 1 && date === 1) {
			// 1941/1/1 CE (พ.ศ. 2484) 起的泰国佛历元旦是每年(CE) 1/1。
			holidays.push('วันขึ้นปีใหม่');
		} else if (month === 4 && 13 <=date && date <= 15) {
			// 泼水节
			holidays.push('สงกรานต์');
		} 
	}

	if (options.format === 'serial') {
		date = [ year, month, date ];
		if (use_Thai_lunar) {
			date.is_lunar = true;
		}
		if (准) {
			date.准 = 准;
		}
		if (year > 0) {
			date.生肖 = library_namespace.十二生肖_LIST[(year + 5).mod(12)];
		}
		if (holidays.length > 0) {
			date.holidays = holidays;
		}
		return date;
	}

	if (use_Thai_lunar) {
		// https://th.wikipedia.org/wiki/%E0%B8%9B%E0%B8%8F%E0%B8%B4%E0%B8%97%E0%B8%B4%E0%B8%99%E0%B9%84%E0%B8%97%E0%B9%80%E0%B8%94%E0%B8%B4%E0%B8%A1
		date = [
				date > 0 ? (date > 15 ? 'วันขึ้น' : 'วันแรม')
						+ library_namespace.to_Thai_numeral(date % 15) : '',
				month === '双8' ? 'เดือนแปดหลัง(๘-๘)'
				// ↑ 'เดือนแปดหลัง' = เดือน แปด หลัง or "เดือน 8 หลัง"
				// or "๘๘" or "๘-๘" or "กำลังสร้าง เดือน ๘"
				: (month = Date_to_Thai.lunar_month_name[month]) ? 'เดือน'
						+ month + '('
						+ library_namespace.to_Thai_numeral(month) + ')' : '',
				year > 0 ? 'ปี' + Date_to_Thai.year_name[(year + 5).mod(12)]
						: '' ];
		// date.unshift('ตรงกับ');

	} else {
		date = [
				(weekday = Date_to_Thai.weekday_name[weekday]) ? 'วัน'
						+ weekday : '', date || '',
				Date_to_Thai.month_name[month] || '', year || '' ];

		if (date[0] && (date[1] || date[2] || date[3])) {
			date[0] += 'ที่';
		}

		if (!date[2] && !isNaN(date[3])) {
			// year only?
			// add 佛灭纪元 พุทธศักราช
			date[3] = 'พ.ศ. ' + date[3];
		}
	}

	return date.filter(function(n) {
		return n;
	}).join(' ');
}


// ปีนักษัตร
Date_to_Thai.year_name = 'ชวด|ฉลู|ขาล|เถาะ|มะโรง|มะเส็ง|มะเมีย|มะแม|วอก|ระกา|จอ|กุน'
	.split('|');

// start from 1.
Date_to_Thai.month_name = '|มกราคม|กุมภาพันธ์|มีนาคม|เมษายน|พฤษภาคม|มิถุนายน|กรกฎาคม|สิงหาคม|กันยายน|ตุลาคม|พฤศจิกายน|ธันวาคม'
	.split('|');
Date_to_Thai.lunar_month_name = '|อ้าย|ยี่|สาม|สี่|ห้า|หก|เจ็ด|แปด|เก้า|สิบ|สิบเอ็ด|สิบสอง'
	.split('|');

// 0: Sunday.
Date_to_Thai.weekday_name = 'อาทิตย์|จันทร์|อังคาร|พุธ|พฤหัสบดี|ศุกร์|เสาร์'
		.split('|');

Date_to_Thai.weekday_color = 'red|yellow|pink|green|orange|blue|purple'.split('|');
Date_to_Thai.weekday_bgcolor = 'red|yellow|pink|#0d0|orange|#88f|#d0d'.split('|');

_.Date_to_Thai = Date_to_Thai;

// -------------------------------------

//e.g., new Date(1935,3,4).format({parser:'Thai'})
//e.g., new Date(1935,3,4).format('Thai')
function Thai_parser(date_value, format, locale, options) {
	var Thai_date = Date_to_Thai(date_value, {
		format : 'serial'
	});
	return library_namespace.parse_escape(format || Thai_parser.default_format, function(s) {
		return s.replace(/%([Ymd])/g, function(all, s) {
			s = Thai_parser.convertor[s];
			return typeof s === 'function' ? s(date_value) : Thai_date[s] || all;
		});
	});
};

Thai_parser.default_format = '%Y/%m/%d';
Thai_parser.convertor = {
		Y :	0,
		m :	1,
		d :	2
};

// 注册parser以供泰国君主使用。
library_namespace.Date_to_String.parser.Thai = Thai_parser;


//----------------------------------------------------------------------------------------------------------------------------------------------------------//
// 长历: "تقویم بهائی" / "گاه‌شماری بهائی" / 巴哈伊历法 / Bahá'í calendar / Badí‘ calendar
// https://en.wikipedia.org/wiki/Bah%C3%A1'%C3%AD_calendar
// http://www.bahai.us/welcome/principles-and-practices/bahai-calendar/
// http://bahaical.org/default.aspx?ln=fa


// month (Bahai_Ha): month serial of Ayyám-i-Há (intercalary days)
// assert: Bahai_Ha != 1, 2, 3, .. 19.
var Bahai_Ha = -1 | 0,
// start hour of day: -6.
Bahai_start_hour_of_day = -6 | 0,
// i.e., 18:0
Bahai_start_hour_of_day_non_negative = (Bahai_start_hour_of_day % ONE_DAY_HOURS + ONE_DAY_HOURS)
		% ONE_DAY_HOURS | 0,
// 1844 CE
Bahai_epochal_year = 1844 | 0,
//
Bahai_year_months = 19 | 0,
//
Bahai_Vahid_years = 19 | 0, Bahai_Kull_i_Shay_years = 19 * Bahai_Vahid_years | 0,
// Years in a Váḥid
Bahai_year_name = "Alif|Bá’|Ab|Dál|Báb|Váv|Abad|Jád|Bahá'|Ḥubb|Bahháj|Javáb|Aḥad|Vahháb|Vidád|Badí‘|Bahí|Abhá|Váḥid".split('|'),
// Bahai_month_name[month_serial] = month name
// the days of the month have the same names as the names of the month
Bahai_month_name = '|Bahá|Jalál|Jamál|‘Aẓamat|Núr|Raḥmat|Kalimát|Kamál|Asmá’|‘Izzat|Mashíyyat|‘Ilm|Qudrat|Qawl|Masá’il|Sharaf|Sulṭán|Mulk|‘Alá’'.split('|');
Bahai_month_name[Bahai_Ha] = 'Ayyám-i-Há';

function Bahai_Date(year, month, date) {
	if (month == Bahai_year_months)
		month = 0, year++;
	else if (month == Bahai_Ha)
		month = Bahai_year_months;

	date = new Date(_Date(Bahai_epochal_year - 1 + year, 3 - 1, 2
	// , Bahai_start_hour_of_day
	).getTime() + (month * Bahai_year_months + date - 1)
			* ONE_DAY_LENGTH_VALUE);

	return date;
}

// 1844/3/21
Bahai_Date.epoch = new Date(Bahai_epochal_year, 3 - 1, 21).getTime();

Bahai_Date.month_name = function(month_serial) {
	return Bahai_month_name[month_serial];
};

// return [ Kull-i-Shay’, Váḥid, Bahá'í year ]
Bahai_Date.Vahid = function(year, numerical) {
	var Kull_i_Shay = Math.floor(--year / Bahai_Kull_i_Shay_years) + 1 | 0, Vahid = year
			% Bahai_Kull_i_Shay_years | 0;
	// 转正。保证变数值非负数。
	if (Vahid < 0)
		Vahid += Bahai_Kull_i_Shay_years;
	year = Vahid % Bahai_Vahid_years | 0;
	return [ Kull_i_Shay, (Vahid / Bahai_Vahid_years | 0) + 1,
			numerical ? year + 1 : Bahai_year_name[year] ];
};


function Date_to_Bahai(date, options) {
	var year = date.getFullYear(), month = date.getMonth(), days, delta;

	if (month < 3 - 1 || month === 3 - 1 && date.getDate() === 1
			&& date.getHours() < Bahai_start_hour_of_day_non_negative)
		// 3/1 18: 之前，起始点算在前一年。
		year--;

	days = (date - _Date(year, 3 - 1, 2, Bahai_start_hour_of_day))
			/ ONE_DAY_LENGTH_VALUE;
	// assert: days>=0
	delta = days % 1;
	month = (days |= 0) / Bahai_year_months | 0;
	days %= Bahai_year_months;
	if (month === 0)
		// ‘Alá’
		month = Bahai_year_months, year--;
	else if (month === Bahai_year_months)
		month = Bahai_Ha;

	// 前置处理。
	if (!library_namespace.is_Object(options))
		options = Object.create(null);

	// 日期序数→日期名。year/month/date index to serial.
	year -= Bahai_epochal_year - 1;
	date = options.single_year ? [ year ] : Bahai_Date.Vahid(year,
			options.numerical_date || options.format === 'serial');
	++days;
	if (options.format !== 'serial') {
		days = Bahai_Date.month_name(days);
		month = Bahai_Date.month_name(month);
	}
	date.push(month, days, delta);
	if (options.format !== 'serial' && options.format !== 'item') {
		// popup delta.
		date.pop();
		date = date.reverse().join(' ');
	}

	return date;
}



/*

CeL.Bahai_Date.test(-2e4, 4e6, 4).join('\n') || 'OK';
// "OK"

'1845/3/2'.to_Date('CE').to_Bahai({single_year : true})
// -1/6/29

*/
Bahai_Date.test = new_tester(Date_to_Bahai, Bahai_Date, {
	month_days : {
		19 : 'common month',
		4 : 'intercalary month',
		5 : 'intercalary month + intercalary day'
	},
	continued_month : function(month, old_month) {
		return old_month === Bahai_year_months && month === 1
				|| old_month === Bahai_year_months - 1 && month === Bahai_Ha
				|| old_month === Bahai_Ha && month === Bahai_year_months;
	},
	CE_format : {
		parser : 'CE',
		format : '%Y/%m/%d %H: CE'
	},
	single_year : true
});


_.Bahai_Date = Bahai_Date;


//----------------------------------------------------------------------------------------------------------------------------------------------------------//
// 长历: 科普特历 / Coptic calendar / Alexandrian calendar
// 埃及东正教仍然在使用。
// Egyptian calendar → Era of Martyrs (Diocletian era) = Coptic calendar

// http://orthodoxwiki.org/Coptic_calendar
// Egypt used the Coptic Calendar till the Khedive Ismael adopted the Western Gregorian Calendar in the nineteenth century and applied it in Egypt's government departments.
// The Coptic calendar has 13 months, 12 of 30 days each and an intercalary month at the end of the year of 5 or 6 days, depending whether the year is a leap year or not. The year starts on 29 August in the Julian Calendar or on the 30th in the year before (Julian) Leap Years. The Coptic Leap Year follows the same rules as the Julian Calendar so that the extra month always has six days in the year before a Julian Leap Year.
// The Feast of Neyrouz marks the first day of the Coptic year. Its celebration falls on the 1st day of the month of Thout, the first month of the Coptic year, which for AD 1901 to 2098 usually coincides with 11 September, except before a Gregorian leap year when it's September 12. Coptic years are counted from AD 284, the year Diocletian became Roman Emperor, whose reign was marked by tortures and mass executions of Christians, especially in Egypt. Hence, the Coptic year is identified by the abbreviation A.M. (for Anno Martyrum or "Year of the Martyrs"). The A.M. abbreviation is also used for the unrelated Jewish year (Anno Mundi).
// To obtain the Coptic year number, subtract from the Julian year number either 283 (before the Julian new year) or 284 (after it).
// http://orthodoxwiki.org/Calendar

// https://en.wikipedia.org/wiki/Era_of_Martyrs
// The Era of the Martyrs (Latin: anno martyrum or AM), also known as the Diocletian era (Latin: anno Diocletiani), is a method of numbering years used by the Church of Alexandria beginning in the 4th century anno Domini and by the Coptic Orthodox Church of Alexandria from the 5th century to the present.

var Coptic_common_month = 30,
//
Coptic_common_year_days = 12 * Coptic_common_month + 5 | 0,
// Coptic 4 year cycle days.
Coptic_cycle_days = 4 * Coptic_common_year_days + 1 | 0,
//
Coptic_month_name = '|Thout|Paopi|Hathor|Koiak|Tobi|Meshir|Paremhat|Paremoude|Pashons|Paoni|Epip|Mesori|Pi Kogi Enavot'
		.split('|');

function Coptic_Date(year, month, date, get_days, year_0) {
	// no year 0. year: -1 → 0
	if (year < 0 && !year_0)
		year++;

	var days = Math.floor(--year / 4) * Coptic_cycle_days | 0;
	// 转正。保证变数值非负数。
	if ((year %= 4) < 0)
		year += 4;
	days += year * Coptic_common_year_days | 0;
	// all days @ year 3 of the cycle (0–3) needs to add 1 day for the
	// intercalary day of year 3.
	if (year === 3)
		days++;

	days += (month - 1) * Coptic_common_month + date - 1 | 0;
	return get_days ? days : new Date(Coptic_Date.epoch + days
			* ONE_DAY_LENGTH_VALUE);
}

// year 1/1/1 begins on 284/8/29.
// year 0/1/1 begins on 283/8/30.
// the Coptic_Date.epoch is Coptic 1/1/1!
Coptic_Date.epoch = String_to_Date('284/8/29', {
	parser : 'Julian'
}).getTime();

// leap year: 3, 3+4, 3+8, ..
// e.g., year 3: 286/8/29–287/8/29 CE, 366 days.
Coptic_Date.is_leap = function(year) {
	// 转正。保证变数值非负数。
	if ((year %= 4) < 0)
		year += 4;
	return year === 3;
};

Coptic_Date.month_name = function(month) {
	return Coptic_month_name[month];
};


function Date_to_Coptic(date, options) {
	var days = Math.floor((date - Coptic_Date.epoch) / ONE_DAY_LENGTH_VALUE) | 0,
	//
	year = Math.floor(days / Coptic_cycle_days) * 4 + 1 | 0,
	//
	month = 3 * Coptic_common_year_days | 0;
	// 转正。保证变数值非负数。
	if ((days %= Coptic_cycle_days) < 0)
		days += Coptic_cycle_days;

	if (days === month)
		// (3+4k)/13/6.
		// e.g., 287/8/29
		year += 2, month = 12, date = 5;
	else {
		if (days < month) {
			month = days / Coptic_common_year_days | 0;
			year += month;
			days -= month * Coptic_common_year_days;
		} else
			year += 3, days -= month + 1;

		month = days / Coptic_common_month | 0;
		date = days % Coptic_common_month;
	}

	// 日期序数→日期名。year/month/date index to serial.
	if (year <= 0 && (!options || !options.year_0))
		// year: 0 → -1
		--year;

	return _format([ year, month + 1, date + 1 ], options,
			Coptic_Date.month_name);
}


/*

CeL.Coptic_Date.test(-2e4, 4e6, 4).join('\n') || 'OK';
// "OK"

*/
Coptic_Date.test = new_tester(Date_to_Coptic, Coptic_Date, {
	month_days : {
		30 : 'common month',
		5 : 'intercalary month',
		6 : 'intercalary month + intercalary day'
	}
});


_.Coptic_Date = Coptic_Date;


//----------------------------------------------------------------------------------------------------------------------------------------------------------//
// 长历: የኢትዮጵያ ዘመን አቆጣጠር / 衣索比亚历 / 埃塞俄比亚历 / Ethiopian calendar
// https://am.wikipedia.org/wiki/%E1%8B%A8%E1%8A%A2%E1%89%B5%E1%8B%AE%E1%8C%B5%E1%8B%AB_%E1%8B%98%E1%88%98%E1%8A%95_%E1%8A%A0%E1%89%86%E1%8C%A3%E1%8C%A0%E1%88%AD
// The Ethiopian months begin on the same days as those of the Coptic calendar, but their names are in Ge'ez.
// http://www.ethiopiancalendar.net/


function Ethiopian_Date(year, month, date, year_0) {
	// no year 0. year: -1 → 0
	if (year < 0 && !year_0)
		year++;

	year += Ethiopian_year_to_Coptic;

	return Coptic_Date(year, month, date, false, true);
}

// year 1/1/1 begins on 8/8/29.
// Ethiopians and followers of the Eritrean churches today use the Incarnation Era, which dates from the Annunciation or Incarnation of Jesus on March 25 of 9 AD (Julian), as calculated by Annianus of Alexandria c. 400; thus its first civil year began seven months earlier on August 29, 8 AD. Meanwhile, Europeans eventually adopted the calculations made by Dionysius Exiguus in 525 AD instead, which placed the Annunciation eight years earlier than had Annianus.
Ethiopian_Date.epoch = String_to_Date('008/8/29', {
	parser : 'Julian'
}).getTime();

var Ethiopian_year_to_Coptic = (new Date(Ethiopian_Date.epoch)).getFullYear()
		- (new Date(Coptic_Date.epoch)).getFullYear(),
//
Ethiopian_month_name = '|Mäskäräm (መስከረም)|Ṭəqəmt(i) (ጥቅምት)|Ḫədar (ኅዳር)|Taḫśaś ( ታኅሣሥ)|Ṭərr(i) (ጥር)|Yäkatit (Tn. Läkatit) (የካቲት)|Mägabit (መጋቢት)|Miyazya (ሚያዝያ)|Gənbot (ግንቦት)|Säne (ሰኔ)|Ḥamle (ሐምሌ)|Nähase (ነሐሴ)|Ṗagʷəmen/Ṗagume (ጳጐሜን/ጳጉሜ)'
		.split('|');

Ethiopian_Date.month_name = function(month) {
	return Ethiopian_month_name[month];
};


function Date_to_Ethiopian(date, options) {
	date = Date_to_Coptic(date, {
		format : 'serial',
		year_0 : true
	});
	date[0] -= Ethiopian_year_to_Coptic;

	// 日期序数→日期名。year/month/date index to serial.
	if (date[0] <= 0 && (!options || !options.year_0))
		// year: 0 → -1
		--date[0];

	return _format(date, options, Ethiopian_Date.month_name);
}



/*

CeL.Ethiopian_Date.test(-2e4, 4e6, 4).join('\n') || 'OK';
// "OK"

*/
Ethiopian_Date.test = new_tester(Date_to_Ethiopian, Ethiopian_Date, {
	month_days : {
		30 : 'common month',
		5 : 'intercalary month',
		6 : 'intercalary month + intercalary day'
	}
});


_.Ethiopian_Date = Ethiopian_Date;


//----------------------------------------------------------------------------------------------------------------------------------------------------------//
// Հայկական եկեղեցական տոմար, 教会亚美尼亚历法, Armenian calendar
// https://hy.wikipedia.org/wiki/%D5%80%D5%A1%D5%B5%D5%AF%D5%A1%D5%AF%D5%A1%D5%B6_%D5%A5%D5%AF%D5%A5%D5%B2%D5%A5%D6%81%D5%A1%D5%AF%D5%A1%D5%B6_%D5%BF%D5%B8%D5%B4%D5%A1%D6%80

// Հայկյան տոմար, 传统/古亚美尼亚历法
// https://hy.wikipedia.org/wiki/%D5%80%D5%A1%D5%B5%D5%AF%D5%B5%D5%A1%D5%B6_%D5%BF%D5%B8%D5%B4%D5%A1%D6%80
// http://haytomar.com/index.php?l=am
// http://www.anunner.com/grigor.brutyan/ՀԱՅԿԱԿԱՆ_ՕՐԱՑՈՒՅՑԸ_ԻՐ_ՍԿԶԲՆԱՒՈՐՈՒՄԻՑ_ՄԻՆՉԵՎ_ՄԵՐ_ՕՐԵՐԸ_(համառօտ_ակնարկ)

// 每月天数。
var Armenian_MONTH_DAYS = 30,
// 一年12个月。
Armenian_MONTH_COUNT = 12,
// Epagomenal days
Armenian_Epagomenal_days = 5,
// 365-day year with no leap year
Armenian_year_days = Armenian_MONTH_COUNT * Armenian_MONTH_DAYS + Armenian_Epagomenal_days,
// ամիս
Armenian_month_name = 'Նավասարդի|Հոռի|Սահմի|Տրե|Քաղոց|Արաց|Մեհեկան|Արեգի|Ահեկի|Մարերի|Մարգաց|Հրոտից|Ավելյաց'.split('|'),
// օր
Armenian_date_name = 'Արէգ|Հրանդ|Արամ|Մարգար|Ահրանք|Մազդեղ կամ Մազդեկան|Աստղիկ|Միհր|Ձոպաբեր|Մուրց|Երեզկան կամ Երեզհան|Անի|Պարխար|Վանատուր|Արամազդ|Մանի|Ասակ|Մասիս|Անահիտ|Արագած|Գրգուռ|Կորդուիք|Ծմակ|Լուսնակ|Ցրոն կամ Սփյուռ|Նպատ|Վահագն|Սիմ կամ Սեին|Վարագ|Գիշերավար'.split('|'),
//
Armenian_epagomenal_date_name = 'Լուծ|Եղջերու|Ծկրավորի|Արտախույր|Փառազնոտի'.split('|'),
// շաբատվա օր
Armenian_weekday_name = 'Արեգակի|Լուսնի|Հրատի|Փայլածուի|Լուսնթագի|Արուսյակի|Երևակի'.split('|'),
// 夜间时段 → 日间时段
// starts from 0:0 by http://haytomar.com/converter.php?l=am
Armenian_hour_name = 'Խաւարականն|Աղջամուղջն|Մթացեալն|Շաղաւոտն|Կամաւօտն|Բաւականն|Հաւթափեալն|Գիզկան|Լուսաճեմն|Առաւոտն|Լուսափայլն|Փայլածումն|Այգն|Ծայգն|Զօրացեալն|Ճառագայթեալն|Շառաւիղեալն|Երկրատեսն|Շանթակալն|Հրակաթն|Հուրթափեալն|Թաղանթեալն|Առաւարն|Արփողն'.split('|');

// Armenian year 1 began on 11 July AD 552 (Julian).
Armenian_Date.epoch = String_to_Date('552/7/11', {
	parser : 'Julian'
}).getTime();

function Armenian_Date(year, month, date) {
	// no year 0. year: -1 → 0
	if (year < 0)
		year++;

	return new Date(Armenian_Date.epoch + (
	// days from Armenian_Date.epoch.
	(year - 1) * Armenian_year_days
	//
	+ (month - 1) * Armenian_MONTH_DAYS
	//
	+ date - 1) * ONE_DAY_LENGTH_VALUE);
}


function Date_to_Armenian(date, options) {
	var days = (date - Armenian_Date.epoch) / ONE_DAY_LENGTH_VALUE,
	// տարի
	year = Math.floor(days / Armenian_year_days) + 1;
	// no year 0
	if (year < 1)
		year--;

	days = days.mod(Armenian_year_days);
	var month = days / Armenian_MONTH_DAYS | 0;
	days %= Armenian_MONTH_DAYS;

	days = [ year, month + 1, days + 1 | 0 ];

	if (options && options.format === 'name') {
		//days[0] = 'տարի ' + days[0];
		days[1] = Armenian_month_name[month];
		days[2] = (month > Armenian_MONTH_COUNT
		//
		? Armenian_epagomenal_date_name : Armenian_date_name)[days[2] - 1];
		days = days.join(' / ')
		// add weekday, շաբատվա օր.
		+ ', ' + Armenian_weekday_name[date.getDay()] + ' օր';
	}

	return days;
}


/*

CeL.Armenian_Date.test(-2e4, 4e6, 4).join('\n') || 'OK';
// "OK"

*/
Armenian_Date.test = new_tester(Date_to_Armenian, Armenian_Date, {
	month_days : {
		30 : 'common month 1–12',
		5 : 'Epagomenal days',
	}
});


_.Armenian_Date = Armenian_Date;





//----------------------------------------------------------------------------------------------------------------------------------------------------------//
// Egyptian calendar, 古埃及历法.
// ** 自 22 BCE 之后不改制。


// References:

/**
 * A Chronological Survey of Precisely Dated Demotic and Abnormal Hieratic
 * Sources, Version 1.0 (February 2007)
 * 
 * From year 21 of Ptolemy II Philadelphos until the very beginning of the reign
 * of Ptolemy V Epiphanes, a so-called financial calendar was in use
 * 
 * @see http://www.trismegistos.org/top.php
 */


// Date Converter for Ancient Egypt
// http://aegyptologie.online-resourcen.de/Date_converter_for_Ancient_Egypt


// https://en.wikipedia.org/wiki/Egyptian_calendar#Ptolemaic_and_Roman_calendar
// According to Roman writer Censorinus (3rd century AD), the Egyptian New Year's Day fell on July 20 in the Julian Calendar in 139 CE, which was a heliacal rising of Sirius in Egypt.
// In 238 BCE, the Ptolemaic rulers decreed that every 4th year should be 366 days long rather than 365 (the so-called Canopic reform). The Egyptians, most of whom were farmers, did not accept the reform, as it was the agricultural seasons that made up their year. The reform eventually went into effect with the introduction of the "Alexandrian calendar" (or Julian calendar) by Augustus in 26/25 BCE, which included a 6th epagomenal day for the first time in 22 BCE. This almost stopped the movement of the first day of the year, 1 Thoth, relative to the seasons, leaving it on 29 August in the Julian calendar except in the year before a Julian leap year, when a 6th epagomenal day occurred on 29 August, shifting 1 Thoth to 30 August.
Egyptian_Date.epoch = String_to_Date('139/7/20', {
	parser : 'Julian'
});

var Egyptian_epochal_year = Egyptian_Date.epoch.getFullYear() | 0,
// 开始 reform 之闰年 (no year 0)。22 BCE, Egyptian year -23 (shift 0)
// +1: no year 0.
// = -22
Egyptian_reform_year = -23 + 1,
// the reform epochal year of Egyptian calendar (no year 0).
// 自此年 (Egyptian year, shift 0) 起计算，第四年年末为第一个闰年。
// = -25 (-25/8/29)
Egyptian_reform_epochal_year = Egyptian_reform_year - 4 + 1,
//
Egyptian_reform_epoch,
//
Egyptian_month_days = 30,
//
Egyptian_year_days = 12 * Egyptian_month_days + 5,
//
Egyptian_year_circle = 4,
// additional 1 day every Egyptian_year_circle years
Egyptian_reform_year_days = Egyptian_year_days + 1 / Egyptian_year_circle


Egyptian_Date.epoch = Egyptian_Date.epoch.getTime();

// -1: adapt year 0.
// = -62903980800000
Egyptian_reform_epoch = Egyptian_Date(Egyptian_reform_epochal_year - 1, 1, 1, {
	shift : 0,
	no_reform : true,
	get_value : true
});


// -1: adapt year 0.
// = -26
Egyptian_Date.reform_epochal_year = Egyptian_reform_epochal_year - 1;

// [30,30,30,30,30,30,30,30,30,30,30,30,5]
Egyptian_Date.month_days = new Array(13).fill(0).map(function(v, index) {
	return index === 12 ? 5 : Egyptian_month_days;
});

Egyptian_Date.leap_month_days = Egyptian_Date.month_days.slice();
Egyptian_Date.leap_month_days[Egyptian_Date.leap_month_days.length - 1]++;



// 521 BCE 与之前应采 -1，520 BCE 之后采 0 则可几近与 CE 同步。但 520+1460=1980 BCE 与之前应采 -2。
// https://en.wikipedia.org/wiki/Sothic_cycle
Egyptian_Date.default_shift = 0;

// https://en.wikipedia.org/wiki/Transliteration_of_Ancient_Egyptian
// https://en.wikipedia.org/wiki/Egyptian_hieroglyphs
Egyptian_Date.season_month = function(month) {
	var serial = month - 1, season = serial / 4 | 0;
	// Skip 5 epagomenal days.
	if (season = Egyptian_Date.season_name[season])
		return ((serial % 4) + 1) + ' ' + season;
	//return 'nꜣ hrw 5 n ḥb';
};

// https://en.wikipedia.org/wiki/Season_of_the_Inundation
Egyptian_Date.season_name = 'Akhet|Peret|Shemu'.split('|');

Egyptian_Date.month_name = function(month_serial) {
	return Egyptian_Date.month_name.Greek[month_serial];
};

// Latin script of Greek
Egyptian_Date.month_name.Greek = '|Thoth|Phaophi|Athyr|Choiak|Tybi|Mechir|Phamenoth|Pharmouthi|Pachon|Payni|Epiphi|Mesore|Epagomenai'
		.split('|');

// Latin script of Egyptian Arabic
Egyptian_Date.month_name.Egyptian_Arabic = '|توت|بابه|هاتور|(كياك (كيهك|طوبه|أمشير|برمهات|برموده|بشنس|بئونه|أبيب|مسرا|Epagomenai'
		.split('|');


/**
 * Egyptian calendar
 *
 * @param {Integer}year
 *            year of Egyptian calendar.
 * @param {Natural}month
 *            month of Egyptian calendar. for epagomenal day: 13.
 * @param {Natural}date
 *            date of Egyptian calendar.
 *
 * @returns {Date} system Date (proleptic Gregorian calendar with year 0)
 */
function Egyptian_Date(year, month, date, options) {
	// no year 0. year: -1 → 0
	if (year < 0)
		year++;

	// adapt shift.
	var shift = options ? options.shift : undefined;
	if (shift === undefined)
		shift = Egyptian_Date.default_shift;
	if (shift && !isNaN(shift))
		year += shift;

	// calculate days.
	date = (year - Egyptian_epochal_year) * Egyptian_year_days
	//
	+ (month ? (month - 1) * Egyptian_month_days : 0)
	//
	+ (date ? date - 1 : 0);

	if (year >= Egyptian_reform_year
	//
	&& (!options || !options.no_reform))
		date += Math.floor((year - Egyptian_reform_epochal_year) / Egyptian_year_circle);

	date = date * ONE_DAY_LENGTH_VALUE + Egyptian_Date.epoch;

	// is the latter year
	if (shift === true && (year = new Date(date).format({
		parser : 'CE',
		format : '%Y/%m/%d'
	}).match(/^(-?\d+)\/1\/1$/))
	//
	&& library_namespace.is_leap_year(year[1], 'CE'))
		date += Egyptian_year_days * ONE_DAY_LENGTH_VALUE;

	return options && options.get_value ? date : new Date(date);
}


_.Egyptian_Date = Egyptian_Date;




function Date_to_Egyptian(date, options) {
	var shift = options && ('shift' in options) && options.shift || Egyptian_Date.default_shift,
	//
	days = (date - Egyptian_Date.epoch) / ONE_DAY_LENGTH_VALUE,
	year = Math.floor(days / Egyptian_year_days) + Egyptian_epochal_year;

	if (year >= Egyptian_reform_year && (!options || !options.no_reform)) {
		// reformed. adapt reform days.
		days = (date - Egyptian_reform_epoch) / ONE_DAY_LENGTH_VALUE;
		// 计算有几个 Egyptian_year_days
		year = Math.floor((days
		// 采用此方法可以直接用 (...) / Egyptian_reform_year_days 即得到年分。
		+ 1 - 1 / Egyptian_year_circle) / Egyptian_reform_year_days);
		// 取得年内日数。
		days -= Math.floor(year * Egyptian_reform_year_days);
		year += Egyptian_reform_epochal_year;
	} else {
		// 取得年内日数。
		days = days.mod(Egyptian_year_days);
	}

	// assert: days >= 0

	var month = days / Egyptian_month_days | 0;
	days = days.mod(Egyptian_month_days) + 1;

	if (!isNaN(shift))
		year -= shift;
	if (year <= 0)
		// year: 0 → -1
		year--;

	date = [ year, month + 1, days | 0 ];
	if (days %= 1)
		date.push(days);

	return _format(date, options, Egyptian_Date.month_name, null, true);
}


/*


CeL.Egyptian_Date(-726,1,1,-1).format('CE')
"-527/1/1".to_Date('CE').to_Egyptian({shift:-1})


CeL.Egyptian_Date(-727,1,1).format('CE')
'-726/2/21'.to_Date('CE').to_Egyptian({format:'serial'})

'-727'.to_Date('Egyptian').format('CE')
// "-726/2/21 0:0:0.000"

// OK
CeL.Egyptian_Date(-23,1,1).format('CE')
'-23/8/29'.to_Date('CE').to_Egyptian({format:'serial'})

CeL.Egyptian_Date(-22,1,1).format('CE')
'-22/8/30'.to_Date('CE').to_Egyptian({format:'serial'})


CeL.Egyptian_Date.test(new Date(-5000, 1, 1), 4e6, 4).join('\n') || 'OK';
// "OK"

*/
Egyptian_Date.test = new_tester(Date_to_Egyptian, Egyptian_Date, {
	month_days : {
		30 : 'common month 1–12',
		5 : 'Epagomenal days',
		6 : 'Epagomenal days (leap)'
	}
});


//----------------------------------------------------------------------------------------------------------------------------------------------------------//
// The Byzantine Creation Era, also "Creation Era of Constantinople," or "Era of the World" (Greek: Έτη Γενέσεως Κόσμου κατά 'Ρωμαίους [1] also Έτος Κτίσεως Κόσμου or Έτος Κόσμου )
// http://orthodoxwiki.org/Byzantine_Creation_Era
// https://en.wikipedia.org/wiki/Byzantine_calendar
// https://en.wikipedia.org/wiki/Anno_Mundi

/*

the names of the months were transcribed from Latin into Greek,
the first day of the year was September 1, so that both the Ecclesiastical and Civil calendar years ran from 1 September to 31 August, (see Indiction), which to the present day is the Church year, and,
the date of creation, its year one, was September 1, 5509 BC to August 31, 5508 BC.

*/

var Byzantine_epochal_year = -5509,
// "Religions du Pont-Euxin : actes du VIIIe Symposium de Vani, Colchide, 1997" p87
//
// BASILICA The Official Newsletter of Byzantium Novum Issue #9 (May 2015)
// https://xa.yimg.com/kq/groups/9483617/384276876/name/Basilica+issue+9.pdf
Byzantine_month_name = '|Petagnicios|Dionisius|Eiclios|Artemesios|Licios|Bosporius|Iateos|Agrantos|Malatorus|Ereo|Carneios|Machanios'
	.split('|');

function Byzantine_Date(year, month, date) {
	// no year 0. year: -1 → 0
	if (year < 0)
		year++;

	// 9/1 起才是此年。
	if (month < 9)
		year++;

	// Byzantine calendar to Julian calendar
	year += Byzantine_epochal_year;

	return Julian_day.to_Date(Julian_day.from_YMD(year, month, date));

	return String_to_Date.parser.Julian(
	// slow~~
	year + '/' + month + '/' + date, undefined, {
		no_year_0 : false,
		year_padding : 0
	});
}

_.Byzantine_Date = Byzantine_Date;

Byzantine_Date.month_name = function(month_serial) {
	return Byzantine_month_name[month_serial];
};


function Date_to_Byzantine(date, options) {
	date = Julian_day.to_YMD(Julian_day(date));
	if (false)
		// slow~~
		date = library_namespace.Date_to_String.parser.Julian(date, '%Y/%m/%d', undefined, {
			no_year_0 : false
		}).split('/');

	date[0] -= Byzantine_epochal_year;
	if ((date[1] |= 0) < 9)
		date[0]--;
	// no year 0
	if (date[0] < 1)
		date[0]--;

	date[2] = +date[2];

	return _format(date, options, Byzantine_Date.month_name);
}

/*

'0001-01-01'.to_Date('Julian').to_Byzantine()
'-1-01-01'.to_Date('Julian').to_Byzantine()
CeL.String_to_Date.parser.Julian('100/1/1', undefined, {no_year_0 : false,year_padding : 0}).format('CE')

CeL.Byzantine_Date.test(-2e4, 4e6, 4).join('\n') || 'OK';
// "OK"
// 53167 ms, error 0/4

*/
Byzantine_Date.test = new_tester(Date_to_Byzantine, Byzantine_Date, {
	epoch : new Date(-1, 12, 1),
	month_days : {
		28 : 'common February',
		29 : 'leap February',
		30 : 'short month',
		31 : 'long month'
	}
});


//----------------------------------------------------------------------------------------------------------------------------------------------------------//
// Nanakshahi calendar, 印度锡克教日历 基本上与 Gregorian calendar 同步。
// https://en.wikipedia.org/wiki/Nanakshahi_calendar
// The Nanakshahi (Punjabi: ਨਾਨਕਸ਼ਾਹੀ, nānakashāhī) calendar is a tropical solar calendar
// New Year's Day falls annually on what is March 14 in the Gregorian Western calendar.
// year one is the year of Guru Nanak's birth (1469 CE). As an example, April 2014 CE is Nanakshahi 546.
// http://www.purewal.biz/fixed_sangrand_dates.pdf
// http://www.purewal.biz/Gurbani_and_Nanakshahi_Calendar.pdf
// Nanakshahi Sangrand Dates in Gregorian Calendar - Forever from 14 March 2003 CE / 535 NS

// Nanakshahi epoch: Gregorian 1469/3/14
var Nanakshahi_year_offset = 1469 - 1,
// 此 month name 会令 Eclipse 加大行距。
// https://en.wikipedia.org/wiki/Nanakshahi_calendar#Months_of_the_Nanakshahi_calendar
Nanakshahi_month_name = '|Chet (ਚੇਤ)|Vaisakh (ਵੈਸਾਖ)|Jeth (ਜੇਠ)|Harh (ਹਾੜ)|Sawan (ਸਾਵਣ)|Bhadon (ਭਾਦੋਂ)|Assu (ਅੱਸੂ)|Katak (ਕੱਤਕ)|Maghar (ਮੱਘਰ)|Poh (ਪੋਹ)|Magh (ਮਾਘ)|Phagun (ਫੱਗਣ)'.split('|');

Nanakshahi_Date.month_name = function(month_serial) {
	return Nanakshahi_month_name[month_serial];
};

function Nanakshahi_Date(year, month, date) {
	// no year 0. year: -1 → 0
	if (year < 0)
		year++;

	var JDN = Julian_day.from_YMD(year + 1468, 3, 14, true) + date - 1
	// Nanakshahi 前5个月 31日。
	+ (month > 5 ? 5 * 31 + (month - 6) * 30 : (month - 1) * 31);

	return Julian_day.to_Date(JDN);
}

_.Nanakshahi_Date = Nanakshahi_Date;


function Date_to_Nanakshahi(date, options) {
	var year = date.getFullYear(), month = date.getMonth();
	// Nanakshahi epoch: Gregorian 1469/3/14
	if (month < 3 - 1 || month === 3 - 1 && date.getDate() < 14)
		year--;
	var days = Julian_day(date)
	// get the first day of this Nanakshahi year.
	- Julian_day.from_YMD(year, 3, 14, true) | 0;
	// assert: 0 <= days <= 366

	// Nanakshahi 前5个月 31日。
	if (days < 5 * 31)
		month = days / 31 | 0, date = days % 31;
	else {
		days -= 5 * 31;
		month = 5 + (days / 30 | 0);
		if (month === 12)
			// The leap day, i.e., the last day of the leap year.
			month = 11, date = 30;
		else
			date = days % 30;
	}

	year -= Nanakshahi_year_offset;
	if (year <= 0)
		// year: 0 → -1
		year--;
	date = [ year, month + 1, date + 1 ];

	return _format(date, options, Date_to_Nanakshahi.to_name);
}

Date_to_Nanakshahi.to_name = [ library_namespace.to_Gurmukhi_numeral,
	Nanakshahi_Date.month_name, library_namespace.to_Gurmukhi_numeral ];


/*

CeL.Nanakshahi_Date.test(-2e4, 4e6, 4).join('\n') || 'OK';
// 40717 ms, error 0/4

*/
Nanakshahi_Date.test = new_tester(Date_to_Nanakshahi, Nanakshahi_Date, {
	epoch : new Date(1469, 3 - 1, 14),
	month_days : {
		30 : 'short month 6–12',
		31 : 'long month 1–5'
	}
});


//----------------------------------------------------------------------------------------------------------------------------------------------------------//
// 儒略改革历, Revised Julian calendar
// http://orthodoxwiki.org/Revised_Julian_Calendar
// The Revised Julian Calendar is a calendar that was considered for adoption by several Orthodox churches at a synod in Constantinople in May 1923. The synod synchronized the new calendar with the Gregorian Calendar by specifying that October 1, 1923, in the Julian Calendar will be October 14 in the Revised Julian Calendar, thus dropping thirteen days.
// https://en.wikipedia.org/wiki/Revised_Julian_calendar

// Revised Julian Calendar epoch: 0/1/1
var Revised_Julian_epoch = new Date(0, 0),
//
Revised_Julian_days = [ , 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ],
// 本年累积月份日数。
Revised_Julian_accumulated_days = [ , 0 ];

Revised_Julian_epoch.setFullYear(0, 0, 2);
Revised_Julian_epoch = Revised_Julian_epoch.getTime();

Revised_Julian_days.forEach(function(days, index) {
	if (index > 0)
		Revised_Julian_accumulated_days.push(days
				+ Revised_Julian_accumulated_days[index]);
});

/**
 * Get the days count from epoch.
 * 
 * @param {Integer}year
 *            year of Revised Julian calendar. (Astronomical year numbering)
 * @param {Natural}month
 *            month of Revised Julian calendar.
 * 
 * @returns {Integer} days count from epoch.
 */
Revised_Julian_Date.days = function(year, month) {
	// 要用来计算 leap 日数的年分。未过3月则应当做前一年计算。
	var y = month >= 3 ? year : year - 1, m900 = y.mod(900);

	// days from epoch
	return 365 * year
	// 计算 leap 日数。
	+ Math.floor(y / 4) - Math.floor(y / 100)
	// Years evenly divisible by 4 are leap years, except that years evenly
	// divisible by 100 are not leap years, unless they leave a remainder of 200
	// or 600 when divided by 900, in which case they are leap years.
	+ 2 * Math.floor(y / 900) + (m900 >= 600 ? 2 : m900 >= 200 ? 1 : 0)
	// 本年累积月份日数。
	+ Revised_Julian_accumulated_days[month];
}

/**
 * Revised Julian calendar → system Date
 * 
 * @param {Integer}year
 *            year of Revised Julian calendar.
 * @param {Natural}month
 *            month of Revised Julian calendar.
 * @param {Natural}date
 *            date of Revised Julian calendar.
 * 
 * @returns {Date} system Date (proleptic Gregorian calendar with year 0)
 */
function Revised_Julian_Date(year, month, date) {
	// no year 0. year: -1 → 0
	if (year < 0)
		year++;

	date += Revised_Julian_Date.days(year, month) - 1;

	return new Date(Revised_Julian_epoch + date * ONE_DAY_LENGTH_VALUE);
}

_.Revised_Julian_Date = Revised_Julian_Date;


/**
 * system Date → Revised Julian calendar
 * 
 * @param {Date}date
 *            system date to convert.
 * @param {Object}[options]
 *            options to use
 * 
 * @returns {Array} [ year, month, date ]
 */
function Date_to_Revised_Julian(date, options) {
	var days = (date - Revised_Julian_epoch) / ONE_DAY_LENGTH_VALUE,
	// 估测
	year = date.getFullYear() | 0, month = date.getMonth() + 1 | 0;

	// TODO: ugly method. Try to improve it.
	while (true) {
		date = days - Revised_Julian_Date.days(year, month);
		// 经测试，在前后万年范围内，最多仅修正一次。
		if (date < 0) {
			if (month === 3) {
				date = days - Revised_Julian_Date.days(year, month = 2);
				break;
			}
			if (--month < 1)
				month = 12, year--;
		} else if (date >= Revised_Julian_days[month]) {
			if (month === 2) {
				days -= Revised_Julian_Date.days(year, 3);
				if (days >= 0)
					month = 3, date = days;
				break;
			}
			if (++month > 12)
				month = 1, year++;
		} else
			break;
	}

	if (year <= 0)
		// year: 0 → -1
		year--;

	return [ year, month, date + 1 ];
}

/*

CeL.Revised_Julian_Date(6400,3,1).format()
new Date('6400/3/1').to_Revised_Julian()

CeL.Revised_Julian_Date.test(-2e4, 4e6, 4).join('\n') || 'OK';
// 59804 ms, error 0/4
// 修正 138217 次。平均 29+ 日（每个月）会修正一次。

*/
Revised_Julian_Date.test = new_tester(Date_to_Revised_Julian, Revised_Julian_Date, {
	epoch : Revised_Julian_epoch,
	month_days : {
		28 : 'common February',
		29 : 'leap February',
		30 : 'short month',
		31 : 'long month'
	}
});



//----------------------------------------------------------------------------------------------------------------------------------------------------------//
// 《太初历》于汉成帝末年，由刘歆重新编订，改称三统历。
// 汉简历日考征 许名玱
// http://www.bsm.org.cn/show_article.php?id=2033
// http://www.bsm.org.cn/show_article.php?id=2042
// http://www.bsm.org.cn/show_article.php?id=2262
// 汉书 律历志
// http://ctext.org/han-shu/lv-li-zhi-shang/zh

// 历法:岁:回归年,月:朔望月,日:平太阳日
// 历法上之"岁首"指每岁(岁)起算点(之月序数)，常为中气(一般为冬至)时间。月首朔旦，朔旦到朔旦为一月(朔望月)。日首夜半，夜半到夜半为一日(平太阳日)。
// 当前农历之"岁"指冬至月首至冬至月首之间(回归年)，"年"指正月首(1月1日)至正月首之间，故岁首为11月1日夜半(子夜时刻)。
// 元嘉历之"岁"指正月首(1月1日)至正月首之间，与"年"相同。

/*

index: Math.ceil(太初历_月日数/(2*太初历_节气日数-太初历_月日数))-1 = 32月为太初历首个无中气月(闰月)
积年3, index: 8月 = 3年闰6月为太初历首个无中气月(闰月)
惟此推步非实历。


*/
function 太初历数() {
	// 元始黄钟初九自乘，一龠之数，得日法。
	var 日法 = 9 * 9,
	// 章岁。十九年七闰，是为一章(十九岁七闰)
	// 朔不得中，是谓闰月。无中置闰
	闰法 = 19,
	// 经历一统千五百三十九年，冬至与月朔相合夜半时刻。
	统法 = 日法 * 闰法,
	// 参统法，得元法。
	// 经历一元四千六百一十七年，冬至与月朔相合甲子夜半。
	元法 = 3 * 统法,
	// 47: 参天九，两地十，得会数。
	// 三统历以一百三十五月为「朔望之会」，有廿三交食，四十七「朔望之会」，得六千三百四十五月(47×135＝6345)为「会月」，则交食起于冬至朔旦。
	会数 = 3 * 9 + 2 * 10,
	// 五位乘会数，得章月。案：章月即一章(十九年)之朔望月数二百三十五(十九年七闰；12×19+7＝235)。
	章月 = 5 * 会数,
	// 朔望月长: 29+43/81 = 2392/81
	// 以朔策廿九日又八十一分之四十三日化为分数，得八十一分之二千三百九十二日；即一日为八十一分，则一月有二千三百九十二分。二千三百九十二，名之曰「月法」
	月法 = 29 * 日法 + 43,
	//
	月日数 = 月法 / 日法,
	// 四分月法，得通法。
	通法 = 月法 / 4,
	// 以章月乘通法，得中法。
	中法 = 章月 * 通法,
	// 30+2020/4617 = 70265/4617 ≈ 487/16 = 30.4375
	中气日数 = 中法 / 元法,
	// 一统之日数。
	周天 = 章月 * 月法,
	// 岁中十二。以三统乘四时，得岁中。案：即一岁有十二中气。
	岁中 = 3 * 4,
	// 以章月加闰法，得月周。
	// 一章中月亮经天周数；一章中恒星月数。
	// 朔望月大于恒星月，三统历以一章二百三十五朔望月等于二百五十四恒星月，恰为「章月加闰法」之数，刘歆故云。
	月周 = 章月 + 闰法,
	// 参天数二十五，两地数三十
	// 此为交食周期，三统历据实测，以一百三十五朔望月有二十三交食
	朔望之会 = 3 * 25 + 2 * 30,
	// 合廿七章，五百一十三岁
	会月 = 会数 * 朔望之会,
	// 合八十一章，一千五百三十九年。
	统月 = 3 * 会月,
	// 合三统，四千六百一十七年，则交食起于甲子朔旦冬至，所谓「九会而元复」。
	元月 = 3 * 统月,
	// 一章有二百二十八中气(19×12＝228)，名曰「章中」。一章二百三十五朔望月，七个月无中气，三统闰法「朔不得中，是谓闰月。」
	章中 = 闰法 * 岁中,
	//
	统中 = 日法 * 章中,
	//
	元中 = 3 * 统中,
	// 什乘元中，以减周天，得策余。
	// 三统历岁实(冬至点间的时间间隔,回归年)三百六十五日又一千五百三十九分之三百八十五日，去其六周甲子，余五日又一千五百三十九分之三百八十五日，化为分数，取其分子，得八千八十，名曰「策余」。
	策余 = 周天 - 10 * 元中,
	//
	周至 = 3 * 闰法,
	// 太初元年上元积年
	上元积年 = 143127,
	// 闰余0
	积月 = 1770255,
	// 小余0
	朔积日 = 52277160,
	// 小余0
	气积日 = 52277160;

	// 步算

}


// copy from CeL.astronomy.SOLAR_TERMS
var SOLAR_TERMS = ["春分","清明","谷雨","立夏","小满","芒种","夏至","小暑","大暑","立秋","处暑","白露","秋分","寒露","霜降","立冬","小雪","大雪","冬至","小寒","大寒","立春","雨水","惊蛰"];

/**
 * 每年节气数: 每年24节气.<br />年节气数 = 岁中(岁中) * 2 = 岁中 + 气法?
 * 
 * Should be library_namespace.SOLAR_TERMS.length
 * 
 * @type {Natural} constant
 */
var 年节气数 = SOLAR_TERMS.length;

// 程式处理时，应在可精准处理的范围内尽量减少工序。因此不须时时作 mod 演算以降低数字大小。

/**
 * 指定历数后，产出平气平朔、无中置闰复原历法(厯法)之历算推步方法。实际应为「需要置闰时，置闰于首个无中月」，而非「无中月必置闰」。
 * 
 * TODO: 招差术
 * 
 * @param {Number|Array}历数_月日数
 *            {Number}每月日数 or [ {Natural}月长, {Natural}月之日长, {Integer}初始朔余 ].<br />
 *            朔策(朔望月长) = 月法 / 日法 = 通周 / 日法
 * @param {Number|Array}历数_节气日数
 *            {Number}每节气日数 = 岁实 / 年节气数 or [ {Natural}节气长, {Natural}节气之日长,
 *            {String}节气小余名 ], 周天 = 中法 / 元法 / 2<br />
 *            岁实(冬至点间的时间间隔,回归年) = 12 * 中法 / 元法
 * @param {Integer}历元JDN
 *            上元, 历法起算点之 JDN, e.g., 夜半甲子朔旦冬至之日。
 * @param {Object}[options]
 *            options to use.<br />
 *            {String}options.历名: 平气平朔无中置闰历名。
 * 
 * @returns {Array} [ {Function}to_Date, {Function}from_Date ]
 * 
 * @see https://github.com/suchowan/when_exe/blob/master/lib/when_exe/region/chinese/twins.rb
 */
function 平气平朔无中置闰(历数_月日数, 历数_节气日数, 历元JDN, options) {

	/**
	 * 取得平气平朔太阴太阳历法积日当天之积月。
	 * 
	 * @param {Integer}积日
	 *            积日
	 * 
	 * @returns {Integer}积月
	 * 
	 * @deprecated
	 */
	function deprecated_平气平朔太阴太阳历法_积月(积日, get_积日) {
		var 积月 = Math.ceil(积日 / 历数_月日数),
		// 先测试下个月的月始积日。
		月始积日 = Math.floor(积月 * 历数_月日数);
		if (积日 < 月始积日)
			// 应采用上个月。
			月始积日 = Math.floor(--积月 * 历数_月日数);
		return get_积日 ? [ 积月, 月始积日 ] : 积月;
	}

	/**
	 * 取得平气平朔太阴太阳历法积日当天之积月数。
	 * 
	 * @param {Integer}积日
	 *            积日数
	 * 
	 * @returns {Integer}积月数
	 */
	function 平气平朔太阴太阳历法_积月(积日) {
		// 每年以朔分月（朔日为每月初一）。
		// +1: 明日子夜时刻小余=0时，今日之积月还是该算前一个。
		var _积月 = (积日 + 1 + 历元闰余日数) / 历数_月日数, 积月 = Math.floor(_积月);
		return _积月 === 积月 ? 积月 - 1 : 积月;
	}

	function 平气平朔太阴太阳历法_年初积月(积年) {
		 return 平气平朔太阴太阳历法_积月(Math.floor(积年 * 年节气数 * 历数_节气日数));
	}

	/**
	 * 取得平气平朔太阴太阳历法积日当天之积节气数。
	 * 
	 * 自历元累积节气数。今日之内变换之节气都算今天的。
	 * 
	 * @param {Integer}积日
	 *            积日数
	 * 
	 * @returns {Integer}积节气数
	 */
	function 平气平朔太阴太阳历法_积节气(积日) {
		if (false)
			return Math.floor(((积日 + 1) % 历数_节气日数 === 0 ? 积日 : 积日 + 1)
					/ 历数_节气日数);
		// +1: 明日子夜时刻节气小余=0时，今日之节气还是该算前一个。
		var _积节气 = (积日 + 1) / 历数_节气日数, 积节气 = Math.floor(_积节气);
		return _积节气 === 积节气 ? 积节气 - 1 : 积节气;
	}

	/**
	 * get Date of 平气平朔太阴太阳历法.<br />
	 * 平气平朔太阴太阳历法 → Date
	 * 
	 * @param {Integer}year
	 *            year of 平气平朔太阴太阳历法.
	 * @param {Natural}month
	 *            month of 平气平朔太阴太阳历法.
	 * @param {Natural}date
	 *            date of 平气平朔太阴太阳历法.
	 * @param {Object}[options]
	 *            options to use
	 * 
	 * @returns {Date} system Date (proleptic Gregorian calendar with year 0)
	 * 
	 * @deprecated
	 */
	function deprecated_平气平朔太阴太阳历法_Date(year, month, date, options) {
		// 输入闰月(leap month)。
		var 为闰月;
		if (isNaN(month)) {
			--year;
			为闰月 = month.match(/^闰(\d{1,2})$/);
		} else if (month < 11 + 月位移) {
			// 1–10月算作前一年，从前一年起算。
			--year;
			month -= 月位移;
		} else {
			month -= 11 + 月位移 - 1 + 2;
		}

		var 年初积月 = Math.floor(year * 年节气数 * 历数_节气日数 / 历数_月日数);
		// 当年首日之积日
		// var days = Math.floor(年初积月 * 历数_月日数);

		if (为闰月) {
			// +1: 闰月为本月之下一月。
			month = (为闰月[1] | 0) + 1 - 月位移;
			// assert: 月位移=0时，1 <= month <= 12
			// TODO: 检查本月是否真为闰月。

		} else if (Math.floor((year + 1) * 年节气数 * 历数_节气日数 / 历数_月日数
		// +1e-10: 为了补偿 (历数_节气日数 = 节气长 / 节气之日长) 的误差。
		// 若做的是整数乘除法，则无须此项修正。
		// 此数值必须比最小之可能分数值(小余=1)更小，小最起码可能造成浮点误差的程度。
		//
		// 在 CeL.大明历_Date(73527, 10, 1) 须采 ">= 12".
		// 但如此拖慢效能过多；改 +1e-10，采 +5e-3 可回避之。(workaround)
		+ 5e-3) - 年初积月 > 12) {
			// 需检查哪个是闰月。
			// 说明见 function Date_to_平气平朔太阴太阳历法()
			var 闰月 = Math.ceil(((年初积月 + 1) * 历数_月日数 - year * 年节气数 * 历数_节气日数)
					/ (2 * 历数_节气日数 - 历数_月日数));
			while (Math.floor((年初积月 + 闰月) * 历数_月日数) <= (year * 年节气数 + (闰月 - 1) * 2)
					* 历数_节气日数)
				闰月--;
			// 若于闰月后，则需要添加入一个月(即闰月)。
			if (闰月 <= month + 1)
				month++;
		} else if (false && 闰月序(年初积月, year) <= month + 1)
			// error: CeL.太初历_Date(19,11,1).format('CE');
			month++;

		return Julian_day.to_Date(历元JDN
		// 积月日数+date
		+ Math.floor((年初积月 + month - 1
		// +2: 11月→1月
		+ 2) * 历数_月日数) + date - 1);
	}

	// 取得首个无中气月份之年初起算index。
	// @returns	应为 undefined or 1–12. 1: 闰1月, 2: 闰2月
	function 闰月序(年初积月, 积年) {
		// console.log([ 年初积月, 积年 ]);
		var 下一年的年初积月 = 平气平朔太阴太阳历法_年初积月(积年 + 1);
		// 年月数 > 12 (应为13)，则置闰月。
		if (下一年的年初积月 - 年初积月 !== 12 + 1) {
			return;
		}

		if (固定置闰) {
			// e.g., 年终置闰法, 置闰于年底。
			return 固定置闰;
		}

		// 无中置闰法: 计算、搜寻本年度第一个无中气的月份。

		// 初始值: {Real}第二个月(一般为12月)合朔积日时间 (单位:日)
		var 合朔积日时间 = (年初积月 + 1) * 历数_月日数,
		// 初始值: {Real}岁首中气(一般为冬至)时间 (单位:日)
		中气积日时间 = 积年 * 年节气数 * 历数_节气日数,
		// 时间差 = 合朔积日时间 - 中气积日时间 (单位:日)
		// -1: 预防中气出现在日末。只要在当日，都应算当日的。
		闰月 = (合朔积日时间 - 中气积日时间 - 1) / (2 * 历数_节气日数 - 历数_月日数) | 0;
		// assert: 闰月 = 自第二个月(年初起算index 1)起算的 index: 0–12
		// 年初起算index 0 必存有岁首中气(一般为冬至)，可跳过。
		if (闰月 < 1)
			闰月 = 1;
		// +1e-9: 预防浮点舍入误差 Round-off error。
		// e.g., 太初历 @ -1644/11/25 CE, 元嘉历 @ 17844/4/4 CE (+1e-10: NG)
		合朔积日时间 += 闰月 * 历数_月日数 + 1e-9;
		中气积日时间 += 闰月 * 2 * 历数_节气日数 + 1e-9;
		// 用加的，并且由前往后搜寻，取得首个无中气之月。
		while (中气积日时间 < Math.floor(合朔积日时间)) {
			闰月++;
			合朔积日时间 += 历数_月日数;
			中气积日时间 += 2 * 历数_节气日数;
		}
		// 自第二个月(年初起算index 1)起算，index ((闰月))个月时，恰好((中气>=朔日))
		// 是故此时年初起算index ((闰月-1+1)) 为闰月。

		// assert: {Natural}闰月=1–12
		// 但 +1e-10 在 `CeL.元嘉历_Date(23104, 12, 30).format('CE');` 会出现13!
		return 闰月;

		/** <code>

		// --------------------------------------
		// 以下先估算方法常常会漏失，已经废弃。

		// 先估算、取得最大可能值：
		// 因为分子实际应取第一天子夜，而非第一天月小余为0的时刻；因此实际值一定小于此。
		闰月 = Math.ceil(
		// 需要追赶之日数: 自冬至起，至第2(index:1)个月第一天子夜。
		((年初积月 + 1) * 历数_月日数 - 积年 * 年节气数 * 历数_节气日数) /
		// 每个月可追赶之日数. 中气与中气间之日数 = 2* 历数_节气日数
		(2 * 历数_节气日数 - 历数_月日数));
		// 检查是否(月初积日>前一节气时间)，若非，则表示应该往前找。
		// 闰有进退，以无中气御之。例：
		// (index:1)月(子夜时刻)与冬至(节气index:0)相较，
		// (index:2)月(子夜时刻)与(节气index:1)相较。
		while (Math.floor((年初积月 + 闰月) * 历数_月日数) <= (积年 * 年节气数 + (闰月 - 1) * 2)
				* 历数_节气日数)
			// 最多应该只会 loop Math.ceil(1/(2 * 历数_节气日数 - 历数_月日数)) = 2次?
			闰月--;
		// 若在闰月 index 之后，则 -1 以接下来进一步转换成月名。
		闰月 = 月 >= 闰月 && 月-- === 闰月;

		</code> */
	}

	/**
	 * 平气平朔太阴太阳历法历算推步。<br />
	 * system Date → 平气平朔太阴太阳历法(平气平朔无中置闰历日)
	 * 
	 * @param {Date}date
	 *            system date to convert.
	 * @param {Object}[options]
	 *            options to use
	 * 
	 * @returns {Array} [ 年, 月, 日 ]
	 */
	function Date_to_平气平朔太阴太阳历法(date, options) {
		// 正规化并提供可随意改变的同内容参数，以避免修改或覆盖附加参数。
		options = library_namespace.new_options(options);

		// 积日:自历元起算，至本日子夜所累积的完整日数。历元当日为0。
		// 积月/积节气:本日之内(子夜0:0至23:59最后一刻)变换，则子夜起即算变换月/节气了。
		// 积年:本月之内变换，则月初首日子夜起即算变换年了。

		// 00 01 02 03 04 05 06 07 08 09 10 11 month index
		// 11 12 01 02 03 04 05 06 07 08 09 10 月

		// 小余余分: 大余者日也 小余者日之奇分也
		var 加注小余 = options.小余,
		// for 气朔表
		加注节气 = options.节气,
		// 自历元至本日开始累积日数，本日距离历元 (西汉武帝元封7年11月1日甲子朔旦冬至) 之日数。
		// 历元西汉武帝元封7年11月1日当日积日为0日。
		积日 = Julian_day(date) - 历元JDN,
		// 自历元至本日结束累积月数。
		积月 = 平气平朔太阴太阳历法_积月(积日),
		// 自历元至本日结束累积节气数。
		积节气 = 平气平朔太阴太阳历法_积节气(积日),
		// 自历元至本月底累积年数。将在之后调整。
		积年 = Math.floor(积节气 / 年节气数),
		// 日 = 积日 - 月始积日
		// +1: 日期自1起算。
		日 = 积日 - Math.floor(积月 * 历数_月日数 - 历元闰余日数) + 1;

		// --------------------------------------------------------------------

		// new method

		// 年初冬至日之积月。
		// 冬至所在月为十一月(天正月)，之后为十二月、正月、二月……复至十一月。
		var 年初积月 = 平气平朔太阴太阳历法_年初积月(积年);
		// 月序(0–11, 有闰月年份的末月:12)
		var 月 = 积月 - 年初积月;

		var 闰月 = 闰月序(年初积月, 积年);
		if (闰月) {
			// 若在闰月 index 之后，则 -1 以接下来进一步转换成月名。
			// 月 → 去除闰月后之 index。
			闰月 = 月 >= 闰月 && 月-- === 闰月;
			// 闰月: 本月是否为闰月
		}

		// 月序 → 月份名称
		月 += 历元月序;
		var 年 = 积年 + 历元年序;
		if (月 > 12) {
			月 -= 12;
			年++;
		}

		/**
		 * old complicated method
		 * 
		 * <code>

		var 下一冬至积日;

		// 最末月须确定积年，因为可能位在下一年了。
		// -2: 仅有在此范围内，才有必要检测本日是否与冬至在同一个月，又在冬至之前。
		if (积节气.mod(年节气数) >= 年节气数 - 2
		// 检测下一个冬至的积日数
		&& (下一冬至积日 = Math.ceil(积节气 / 年节气数) * 年节气数 * 历数_节气日数)
		// 下一个月月初积日
		< Math.floor((积月 + 1) * 历数_月日数)
		// 检测是否与下一个冬至在同一个月，或之前 (e.g., 583/11/20 CE to 大明历)。
		&& 积月 <= 平气平朔太阴太阳历法_积月(下一冬至积日)) {
			// 本日与冬至在同一个月，又在冬至时刻之前。
			积年++;
			年初积月 = 积月;
		} else {
			// 一般情况:冬至时刻或之后。
			// 岁实 = 冬至点间的时间间隔 = 年节气数 * 历数_节气日数
			年初积月 = 平气平朔太阴太阳历法_积月(Math.floor((积年 + 0) * 年节气数 * 历数_节气日数));
		}
		// 至此((积年))调整完毕。

		// 确定月份。
		// get 年初起算之月份index: 0–11
		月 = 积月 - 年初积月;

		if (闰月 = 闰月序(年初积月, 积年)) {
			// 若在闰月 index 之后，则 -1 以接下来进一步转换成月名。
			// 月 → 去除闰月后之 index。
			闰月 = 月 >= 闰月 && 月-- === 闰月;
			// 闰月: 本月是否为闰月
		}

		// month index (0–11) to month serial (1–12)
		// original: (月-岁首差).mod(12)+1
		// 12: 12个月
		// 10: index 0 → 10+1月
		月 = ((月 + 10 + 月位移) % 12) + 1;

		// 11→12→(跨年)1→2→...→10
		年 = 月 < 11 + 月位移 ? 积年 + 1 : 积年;

		</code>
		 */

		// --------------------------------------------------------------------


		if (加注小余 && 月之日长 && 日 === 1) {
			// 加注小余: 添加朔余（月分小余、前小余）。
			// 推朔术：以通数乘积分，为朔积分，满日法为积日，不尽为小余。
			日 += ' (朔余' + (积月 * 月长 + 历元闰余小分).mod(月之日长) + ')';
			// 这边采用 `- 历元闰余小分` 可以获得和
			// http://www.bsm.org.cn/show_article.php?id=2372 许名玱 青川郝家坪秦牍《田律》历日考释
			// 相同的朔余。但照理来说，应该要用 `+ 历元闰余小分` 才对？
		}

		if (正月偏移) {
			// -1, +1: 月序数从1开始。
			月 = (月 - 1 + 正月偏移).mod(12) + 1;
		}
		date = [ 年, 闰月 ? '闰' + 月 : 月, 日 ];

		// 检查当天是否为节气日。
		// 测试今天之内有无变换至下一节气:今昨天相较。
		// assert: 积节气 - 平气平朔太阴太阳历法_积节气(积日 - 1) === (0 or 1)
		if (加注节气 && 积节气 > 平气平朔太阴太阳历法_积节气(积日 - 1)) {
			// 今天之内变换至下一节气。
			if (SOLAR_TERMS) {
				if (加注小余) {
					加注小余 = 节气之日长 &&
					// 后小余, 气小余
					' (' + 节气小余名 + (积节气 * 节气长).mod(节气之日长) + ')';
				}
				积节气 = SOLAR_TERMS[(积节气 + 历元节气偏移).mod(年节气数)];
				if (加注小余)
					积节气 += 加注小余;
			}
			date.push(积节气);
		}

		return date;
	}

	/**
	 * get Date of 平气平朔太阴太阳历法.<br />
	 * 平气平朔太阴太阳历法 → Date
	 * 
	 * @param {Integer}year
	 *            year of 平气平朔太阴太阳历法.
	 * @param {Natural}month
	 *            month of 平气平朔太阴太阳历法.
	 * @param {Natural}date
	 *            date of 平气平朔太阴太阳历法.
	 * @param {Object}[options]
	 *            options to use
	 * 
	 * @returns {Date} system Date (proleptic Gregorian calendar with year 0)
	 */
	function 平气平朔太阴太阳历法_Date(year, month, date, options) {
		// 正规化并提供可随意改变的同内容参数，以避免修改或覆盖附加参数。
		options = library_namespace.new_options(options);

		// 输入闰月(leap month)。
		var 为闰月 = isNaN(month) && month.match(/^闰(\d{1,2})$/);
		// 还原至 {Integer}积年>=0, {Integer}月_index(0–11)。
		var 月_index = 为闰月 ? 为闰月[1] : month;
		if (正月偏移) {
			// -1, +1: 月序数从1开始。
			月_index = (月_index - 1 - 正月偏移).mod(12) + 1;
		}
		月_index -= 历元月序;
		var 积年 = year - 历元年序;
		if (月_index < 0) {
			// 应该用前1年的历数
			月_index += 12;
			积年--;
		}

		var 年初积月 = 平气平朔太阴太阳历法_年初积月(积年);
		var 闰月 = 闰月序(年初积月, 积年);
		// 过闰月
		if (闰月 <= 月_index
		// 或闰月当月
		|| 闰月 === 月_index + 1 && 为闰月) {
			月_index++;
		}

		var 积月 = 年初积月 + 月_index;
		// -1: 日 starts from 1
		var 积日 = Math.floor(积月 * 历数_月日数 - 历元闰余日数) + (date - 1);

		return Julian_day.to_Date(历元JDN + 积日);
	}

	// ------------------------------------------------------------------------

	// 正规化并提供可随意改变的同内容参数，以避免修改或覆盖附加参数。
	options = library_namespace.new_options(options);

	// 初始化历法数据。

	var 月长, 月之日长,
	//
	节气长, 节气之日长, 节气小余名, 初始朔余;

	if (历数_月日数 > 0)
		(历数_月日数 = library_namespace.to_rational_number(历数_月日数)).pop();
	if (Array.isArray(历数_月日数)) {
		// TODO:
		// 初始朔余 = 历数_月日数[2] | 0;
		// e.g., 月长 27759 / 月之日长 940
		// {正实数}
		历数_月日数 = (月长 = +历数_月日数[0]) / (月之日长 = +历数_月日数[1]);
	}

	if (历数_节气日数 > 0)
		(历数_节气日数 = library_namespace.to_rational_number(历数_节气日数)).pop();
	if (Array.isArray(历数_节气日数)) {
		节气小余名 = 历数_节气日数[2] || '节气小分';
		// {正实数}
		历数_节气日数 = (节气长 = +历数_节气日数[0]) / (节气之日长 = +历数_节气日数[1]);
	}

	var 历元节气 = options.历元节气 || '冬至';
	// const 冬至序 = SOLAR_TERMS.indexOf('冬至') = 18;
	var 历元节气偏移 = SOLAR_TERMS.indexOf(历元节气);
	if (!(历元节气偏移 >= 0))
		throw new Error('历元节气错误: 没有此节气: ' + 历元节气);
	// 冬至建子 → 0
	var 历元月建序 = Math.ceil((历元节气偏移 - SOLAR_TERMS.indexOf('冬至')) / 2).mod(12) | 0;
	// 寅: 2, 子: 0
	var 岁首月建序 = library_namespace.stem_branch_index(options.岁首月建 || options.建正 || '寅') | 0;
	var 建正序 = options.建正 ? library_namespace.stem_branch_index(options.建正) : 岁首月建序;
	// 当年月序数 + 正月偏移 = 实际月份名称
	// 处理岁首不在正月(1月)的情况。每年从正月开始的，此数值应该皆为0。
	// e.g, 颛顼历从10月开始新的一年，岁首月序=月序1+正月偏移9=实际月份名称10
	var 正月偏移 = 岁首月建序 - 建正序;

	// {Integer}历元冬至预设在十一月建子。
	// assert: 历元月序>0 
	var 历元月序 = +options.历元月序;
	// {Integer}通常历元冬至位在第0年。过了年后才是第一年。
	var 历元年序 = 1;
	if (!历元月序) {
		// 一般历元在冬至11月，建正为寅的历法，应该是:
		// (0 - 2).mod(12) + 1 = 11 
		// 历元月序 = (历元月建序 - 岁首月建序).mod(12) + 1;

		历元月序 = 历元月建序 - 岁首月建序;
		if (历元月序 < 0) {
			// 一般历元在冬至11月，建正为寅的历法，历元在第一年之前。
			历元月序 += 12;
			历元年序--;
		}
		// +1: 月序数从1开始，(1年)1月。
		历元月序++;
	}
	if ('历元年序' in options)
		历元年序 = +options.历元年序;

	var 历元闰余日数 = +options.历元闰余日数 || 0;
	if (历元闰余日数) {
		// 1e-9: 预防浮点舍入误差 Round-off error。
		// e.g., 鲁历 5784/闰12/29 ⇨ 隔天 5785/1/0 (3784/1/19 CE) (+1e-10: NG)
		历元闰余日数 += 历元闰余日数 < 0 ? -1e-9 : 1e-9;
	}
	// {Integer} e.g., 鲁历: 1460 = 940 + 521
	var 历元闰余小分 = Math.round(历元闰余日数 * 月之日长);

	// 固定置闰于月序数(1–12)，指定本年历数中index:[固定置闰]为闰月。因此不应为首个月[0]，可为末个[12]。
	var 固定置闰;
	if (options.固定置闰 >= 1) {
		固定置闰 = options.固定置闰 | 0;
	} else if (options.固定置闰 === '年终') {
		// 年终置闰法, 置闰于年底。
		// 一般古六历: 固定置闰 = 12
		固定置闰 = 岁首月建序 - 历元月建序;
		if (固定置闰 < 1) {
			固定置闰 += 12;
		}
	}

	// 历元夜半甲子朔旦冬至: 岁首=11, 岁首差=2, 月位移=0
	// assert: 若有设置月位移(实际为月序位移，而非包括闰月之月数！)，则月位移=1 or 2
	// TODO: 月位移仍有 bug，并且需要简化。
	// var 月位移 = (历元月序 - 11).mod(2);

	// free
	options = null;

	return [ 平气平朔太阴太阳历法_Date, Date_to_平气平朔太阴太阳历法 ];
}


var to_历 = Object.create(null);
// warpper
function add_平气平朔太阴太阳历法(config) {
	for ( var 历名 in config) {
		var 历数 = config[历名];
		if (typeof 历数 === 'string')
			历数 = 历数.split(',');
		// 历数:
		// [ 历数_月日数, 历数_节气日数, 历元JDN, 行用起讫JDN, options ]
		// 行用起讫JDN: {Integer}起JDN or [ 起JDN, 讫JDN ]; 讫JDN 指结束行用之<b>隔日</b>!
		if (typeof 历数[0] === 'string')
			历数[0] = 历数[0].split('/');
		if (typeof 历数[1] === 'string')
			历数[1] = 历数[1].split('/');

		if (typeof 历数[3] === 'string')
			历数[3] = library_namespace.parse_period(历数[3]);
		if (Array.isArray(历数[3])) {
			历数[3][0] = 历数[3][0] && Julian_day.to_Date(Julian_day(历数[3][0], 'CE'), null,
					true) || undefined;
			历数[3][1] = 历数[3][1] && Julian_day.to_Date(Julian_day(历数[3][1], 'CE'), null,
					true) || undefined;
		}

		var 历术 = 平气平朔无中置闰(历数[0], 历数[1], 历数[2] | 0, 历数[4]);

		var 章岁 = 历数[0][0] * 历数[1][1], 章闰 = 年节气数 * 历数[0][1] * 历数[1][0] % 章岁,
		// test 十九年七闰法
		GCD = library_namespace.GCD(章岁, 章闰);
		章闰 /= GCD, 章岁 /= GCD;
		历术[0].闰法 = 章岁 + '年' + 章闰 + '闰';
		library_namespace.debug(历名 + ': ' + 历术[0].闰法, 1, 'add_平气平朔太阴太阳历法');

		(_[历名 + '_Date'] = 历术[0]).行用 = 历数[3];
		to_历['to_' + 历名] = set_bind(历术[1]);
		历术[0].test = new_tester(历术[1], 历术[0], {
			epoch : add_平气平朔太阴太阳历法.epoch,
			continued_month : continued_month_中历
		});
	}
}

add_平气平朔太阴太阳历法.epoch = Julian_day.YMD_to_Date(-2000, 1, 1, null, true);


// 古六历至隋大业历采平气平朔，唐戊寅元暦至明大统历采平气定朔，清时宪历（于顺治二年颁行）后大致采定气定朔。
// 王广超:明清之际定气注历之转变	唐初历法即已应用定气作为太阳改正，但是注历依然采用平气。
// 梅文鼎深受王锡阐的影响，学术取向上与王有很多相似之处，对节气注历的看法即是一例。在《历学疑问补》中，梅文鼎谈到对“定气注历”的看法。首先，梅氏指出中国传统历算家并非不知定气，只是以恒气注历，以定气算日月交食，

// 张培瑜《中国先秦史历表》 http://bbs.nongli.net/dispbbs_2_19913.html
// 近代学者认为春秋时期各诸侯国行用不同的历法。《左传》早期作者杂采各国史策，因而历日杂用三正。例如，一般认为当时晋国很可能行用夏历。
add_平气平朔太阴太阳历法({
	// 历名 : '每月日数,每节气日数,历元JDN,行用起讫日期,options'

	// 古六历或古六历, 四分历术（四分法, 战国四分历）, 年终置闰法, 置闰于年底
	// https://zh.wikipedia.org/wiki/古六历
	// http://www.bsm.org.cn/show_article.php?id=2372 许名玱 青川郝家坪秦牍《田律》历日考释
	// https://github.com/suchowan/when_exe/blob/master/lib/when_exe/region/chinese/twins.rb
	// https://github.com/ytliu0/ChineseCalendar/issues/2

	// 2019/7/11 21:21:26
	// 和 青川郝家坪秦牍《田律》历日考释
	// http://www.bsm.org.cn/show_article.php?id=2372
	// 比较的结果，除了殷历差一个月（但这边做出的历表和廖育栋(Yuk Tung Liu)老师的相符合，不晓得是不是许名玱老师另外做过调整？）
	// https://ytliu0.github.io/ChineseCalendar/table_chinese.html
	// 以及鲁历的朔余有差别之外（见前面"加注小余"段），其他部分（月序数、朔余、节气小余）都能够重现出来了。

	// 4560年: 1元, 秦始皇26年(-222/10/31)秦灭六国

	// 黄帝历上元辛卯至今2760863年算外，相当2760863-713=前2760150年，近元在2760150%4560=前1350年。 
	// 最接近前1350年1月1日的冬至，
	// CeL.date.stem_branch_index(new Date(CeL.Julian_day.to_Date(CeL.Julian_day.from_YMD(-1351,12,27,'CE',true),'CE',true)))===CeL.date.stem_branch_index('甲子')
	// 在公元前1351年12月27日，
	// CeL.Julian_day.from_YMD(-1351,12,27,'CE',true)=1228331
	黄帝历 : [ '27759/940', '487/32', 1228331, [ '-479/12/19', '-222/10/31' ], {
		固定置闰 : /* 12 */'年终',
		// 历元节气 : '冬至',
		// 历元闰余日数 : 0,

		// 建正: 正月(一月)月建。岁首月建可能采用其他月建。
		建正 : '子'
	} ],

	// 颛顼历上元乙卯至今2761019年算外，相当2761019-713=前2760306年，近元在2760306%4560=前1506年。
	// 己巳日夜半立春合朔齐同: 最接近前1506年1月1日的立春己巳，
	// CeL.date.stem_branch_index(new Date(CeL.Julian_day.to_Date(CeL.Julian_day.from_YMD(-1506,2,9,'CE',true),'CE',true)))===CeL.date.stem_branch_index('己巳')
	// 在公元前1506年2月9日，
	// CeL.Julian_day.from_YMD(-1506,2,9,'CE',true)=1171396
	颛顼历 : [ '27759/940', '487/32', 1171396, [ '-479/12/19', '-222/10/31' ], {
		固定置闰 : '年终',
		历元节气 : '立春',
		// 历元月序 : 4
		建正 : '寅',
		// 以夏历孟冬十月为一年之开始。
		岁首月建 : '亥'
	} ],
	// 后期颛顼历 : '27759/940,487/32,1171396',

	// 夏历上元乙丑至今2760589年算外，相当2760589-713=前2759876年，近元在2759876%4560=前1076年。
	// 甲子日夜半冬至合朔齐同版，最接近前1076年1月1日的冬至，
	// CeL.date.stem_branch_index(new Date(CeL.Julian_day.to_Date(CeL.Julian_day.from_YMD(-1077,12,28,'CE',true),'CE',true)))===CeL.date.stem_branch_index('甲子')
	// 在公元前1077年12月28日，
	// CeL.Julian_day.from_YMD(-1077,12,28,'CE',true)=1328411
	古夏历 : [ '27759/940', '487/32', 1328411, [ '-722/1/16', '-222/10/31' ], {
		固定置闰 : '年终',
		岁首月建 : '寅'
	} ],
	// 张培瑜《中国先秦史历表》
	// 汉魏时期所传夏历已有以人正甲子朔旦雨水或十一月甲子朔旦冬至为历元两种推算方法（上元甲子应为乙丑，《开元占经》给出的干支符合）。

	// 殷历上元甲寅至今2761080年算外，相当2761080-713=前2760367年，近元在2760367%4560=前1567年。
	// 最接近前1567年1月1日的冬至，
	// CeL.date.stem_branch_index(new Date(CeL.Julian_day.to_Date(CeL.Julian_day.from_YMD(-1568,12,26,'CE',true),'CE',true)))===CeL.date.stem_branch_index('甲子')
	// 在公元前1568年12月26日，
	// CeL.Julian_day.from_YMD(-1568,12,26,'CE',true)=1149071
	殷历 : [ '27759/940', '487/32', 1149071, [ '-722/1/16', '-222/10/31' ], {
		固定置闰 : '年终',
		// 岁首建丑
		岁首月建 : '丑'
	} ],

	// 周历上元丁巳至今2761137年算外，相当2761137-713=前2760424年，近元在2760424%4560=前1624年。
	// 最接近前1624年1月1日的冬至，
	// CeL.date.stem_branch_index(new Date(CeL.Julian_day.to_Date(CeL.Julian_day.from_YMD(-1625,12,25,'CE',true),'CE',true)))===CeL.date.stem_branch_index('甲子')
	// 在公元前1625年12月25日，
	// CeL.Julian_day.from_YMD(-1625,12,25,'CE',true)=1128251
	周历 : [ '27759/940', '487/32', 1128251, [ '-722/1/16', '-222/10/31' ], {
		固定置闰 : /* 12 */'年终',
		// 岁首建子
		岁首月建 : '子'
	} ],

	// 鲁历上元庚子至今2761334年算外，相当前2760621年，近元在前1821年。
	// 鲁历 : '27759/940,487/32,1048991',
	//
	// https://ytliu0.github.io/ChineseCalendar/guliuli_chinese.html
	// 《开元占经》给出的鲁历上元积年是2761334，历代多位学者已发现这数字不正确。
	// 张培瑜推算2761514年算外，相当2761514-713=前2760801年，近元在2760801%4560=前2001年。
	// 最接近前2001年1月1日的冬至，
	// CeL.date.stem_branch_index(new Date(CeL.Julian_day.to_Date(CeL.Julian_day.from_YMD(-2002,12,25,'CE',true),'CE',true)))===CeL.date.stem_branch_index('甲子')
	// 在公元前2002年12月25日，
	// CeL.Julian_day.from_YMD(-2002,12,25,'CE',true)=990551
	鲁历 : [ '27759/940', '487/32', 990551, [ '-479/12/19', '-222/10/31' ], {
		固定置闰 : /* 12 */'年终',
		// 岁首建子
		// 张培瑜《中国先秦史历表》
		// 鲁历蔀首之岁正月朔日在冬至之前1/19 个月，即1又521/940日。
		历元闰余日数: 1 / 19 * (27759 / 940),
		岁首月建 : '子'
	} ],

	// ------------------------------------------------------------------------

	// 《太初历》于汉成帝末年，由刘歆重新编订，改称三统历。行用于太初元年夏五月至后汉章帝元和二年二月甲寅(104 BCE–85 CE)
	// 历元: 西汉武帝元封7年11月1日 (天正月, 冬至十一月), 105/12/25 BC, -105/12/25
	// 至于元封七年，复得阏逢摄提格之岁，中冬(仲冬)十一月甲子朔旦冬至，日月在建星，太岁在子，已得太初本星度新正。
	// 朔策(朔望月长) = 月法 / 日法 = 2392 / 81 ≈ 29.530864197530864
	// 中法 / 元法 / 2 = 140530 / 4617 / 2 ≈ 30.43751353692874/2 ≈ 15.21875676846437
	// 太初历岁实(冬至点间的时间间隔,回归年长) = 12 * 中法 / 元法 ≈ 365.2501624431449
	//太初历 : '2392/81,70265/4617/节气小余,1683431,-104/6/20~85/3/18',
	太初历 : [ '2392/81', '70265/4617/节气小余', 1683431, '-104/6/20~85/3/18', {
		// 历元年序 : 143126
	} ],

	// 后汉四分历以文帝后元三年十一月甲子朔旦冬至(西汉文帝后元3年10月29日, -162/12/25)为历元。上距鲁哀公十四年春孔子获麟320年。
	// http://www.bsm.org.cn/show_article.php?id=2053
	// lcm(29+499/940, 365+1/4) = 27759/4 = 6939.75日
	// 27759/(365+1/4) = 76年
	后汉四分历 : '27759/940,487/32/节气小余,1662611,85/3/18~237/4/13',

	// 乾象历_历元JDN = -898129 = 1796292 - 7377 * 35855 / 2356 | 0
	// 上元己丑以来，至建安十一年丙戌，岁积七千三百七十八年。
	// 1796292: 后汉四分历 东汉献帝建安10年冬至
	// http://www.xysa.net/a200/h350/05jinshu/t-017.htm
	// http://sidneyluo.net/a/a05/017.htm
	// https://zh.wikisource.org/wiki/%E6%99%89%E6%9B%B8/%E5%8D%B7017
	//
	// 太阳年 = 周天 / 纪法 = 365+145/589=215130/589
	// 节气: 求二十四气: 置冬至小余，加大余十五，小余五百一十五，满二千三百五十六从大余，命如法。
	// 215130/589 / 年节气数 = 35855/2356 = 15 515/2356
	//
	// 朔望月 = 通法 / 日法 = 29+773/1457=43026/1457
	乾象历 : '43026/1457,35855/2356/节气小余,-898129,223/2/18~280/5/16',

	// 景初历 小余 历元
	// https://zh.wikisource.org/wiki/%E6%99%89%E6%9B%B8/%E5%8D%B7018
	// 壬辰以来，至景初元年丁已岁，积四千四十六，算上。
	// (CeL.stem_branch_index('壬辰')-CeL.stem_branch_index('丁已')).mod(60)===(CeL.from_Chinese_numeral('四千四十六')-1).mod(60)
	// 此元以天正建子黄钟之月为历初，元首之岁，夜半甲子朔旦冬至。
	//
	// 太阳年 = 周天 / 纪法 = 365+455/1843 = 673150/1843
	// 节气 推二十四气术
	// 673150/1843/24 =336575/22116 = 15 4835/22116
	// 求次气，加大余十五，小余四百二，小分十一，小分满气法(12)从小余，小余满纪法(1843)从大余，命如前，次气日也。
	// 15+(402+11/12)/1843 = 336575/22116
	//
	// 朔望月 = 通数 / 日法 = 29+2419/4559 = 134630/4559
	// 推朔术曰：以通数乘积月，为朔积分。如日法而一，为积日，不尽为小余。以六十去积日，余为大余。大余命以纪，算外，所求年天正十一月朔日也。
	// 求次月，加大余二十九，小余二千四百一十九，小余满日法从大余，命如前，次月朔日也。小余二千一百四十(朔虚分)以上，其月大也。
	//
	// 近点月 = 通周 /日法 = 27+2528/4559 = 125621/4559
	//
	// 壬辰以来，至景初元年丁已岁，积4046，算上。此元以天正建子黄钟之月为历初，元首之岁，夜半甲子朔旦冬至。元法11058。纪法1843。纪月22795。章岁。19。章月235。章闰7。通数134630。日法4559。余数9670。周天673150。纪岁中12。气法12。没分67315。没法967。月周24638。通法47。会通790110。朔望合数67315。入交限数722795。通周125621。周日日余2528。周虚2031。斗分455。
	// 十九年七闰法: 周天/纪法 / (通数/日法) = 673150/1843 / (134630/4559) = 24 * (336575/22116) / (134630/4559) = 12 7/19
	//
	// 景初历_历元JDN = 330191 = 1807615 - 4045 * 年节气数 * 336575 / 22116 | 0,
	// 1807615: 后汉四分历 青龙4年冬至
	景初历 : '134630/4559,336575/22116,330191,237/4/13~452/2/6',

	// 姜岌厯: 姜岌造《三纪甲子历》，始悟以月食冲检日宿度所在。
	// 晋书/卷018:
	// 甲子上元以来，至鲁隐西元年已未岁，凡八万二千七百三十六，至晋孝武太元九年甲申岁，凡八万三千八百四十一，算上。元法七千三百五十三。纪法二千四百五十一。通数十七万九千四十四。日法六千六十二。月周三万二千七百六十六。气分万二千八百六十。元月九万九百四十五。纪月三万三百一十五。没分四万四千七百六十一。没法六百四十三。斗分六百五。周天八十九万五千二百二十。一名纪日。章月二百三十五。章岁十九。章闰七。岁中十二。会数四十七。日月八百九十三岁凡四十七会分尽。气中十二。甲子纪交差九千一百五十七。甲申纪交差六千三百三十七。甲辰纪交差三千五百一十七。周半一百二十七。朔望合数九百四十一。会岁八百九十三。会月万一千四十五。小分二千一百九十六。章数一百二十九。小分二千一百八十三。周闰大分七万六千二百六十九。历周四十四万七千六百一十。半周天会分三万八千一百三十四。差分一万一千九百八十六。会率一千八百八十二。小分法二千二百九。入交限一万一百四。小周二百五十四。甲子纪差率四万九千一百七十八。甲申纪差率五万八千二百三十一。甲辰纪差率六万七千二百八十四。通周十六万七千六十三。周日日余三千三百六十二。周虚二千七百一。
	// 甲子上元以来，至鲁隐西元年已未岁，凡82736，至晋孝武太元9年甲申岁，凡83841，算上。元法7353。纪法2451。通数179044。日法6062。月周32766。气分12860。元月90945。纪月30315。没分44761。没法643。斗分605。周天895220。1名纪日。章月235。章岁19。章闰7。岁中12。会数47。日月893岁凡47会分尽。气中12。甲子纪交差9157。甲申纪交差6337。甲辰纪交差3517。周半127。朔望合数941。会岁893。会月11045。小分2196。章数129。小分2183。周闰大分76269。历周447610。半周天会分38134。差分11986。会率1882。小分法2209。入交限10104。小周254。甲子纪差率49178。甲申纪差率58231。甲辰纪差率67284。通周167063。周日日余3362。周虚2701。
	// 周天/纪法 / (通数/日法) = 895220/2451 / (179044/6062) = 12 898/2451
	//
	// 12 7/19 = 5×47/19
	//
	// 895220/2451 / (179044/6062) = (2^2×5×17×2633)/(3×19×43) /
	// ((2^2×17×2633)/(2×7×433))
	// FactorInteger[895220/2451 / (179044/6062)] = (2×5×7×433)/(3×19×43)
	//
	// (2^2×5×17×2633)/(3×19×43) / ((2^2×17×2633)/m)=12 7/19 → m = 6063
	// 为使十九年七闰，通数应为6063。应为传钞错？
	//
	// 179044/6063 = 29 3217/6063
	// 895220/2451/24 = 223805/14706 = 15 3215/14706
	// 三纪历 历元JDN = -28760989 = 1861305 - 83840 * 24 * 223805/14706 | 0
	// 1861305: 景初历东晋孝武帝太元8年11月冬至
	三纪历 : '179044/6063,223805/14706,-28760989,384/5/7~417/9/21',

	// 唐开元占经 卷一百五：古今历积年及章率 http://ctext.org/wiki.pl?if=gb&chapter=449774
	// 《梁赵厯》上元甲寅，至今六万一千七百四十算上。 元法四十三万二千，纪法七万二千，蔀法七千二百，章岁六百，章月七千四百二十一（亦曰时法），章闰二百二十二，周天二百六十二万九千七百五十九，亦曰通数余数三万七千七百五十九，斗分一千七百五十九，日法八万九千五十二，亦曰蔀日月周九万六千二百五十二，小周八千二十二，会数一百七十三，度余二万七千七百一十九，会虚六万一千三百三十三，交会差一百四十七，度余三千三百一十一，迟疾差六百余四千五百三十，周日二十七日，余四万九千三百八十，周虚三万九千六百七十二。
	// 上元甲寅，至今(开元2年)61740算上。元法432000，纪法72000，蔀法7200，章岁600，章月7421，(亦曰时法)章闰222，周天2629759，(亦曰通数)余数37759，斗分1759，日法89052，(亦曰蔀)日月周96252，小周8022，会数173，度余27719，会虚61333，交会差147，度余3311，迟疾差600余4530，周日27日，余49380，周虚39672。
	//
	// 畴人传卷第六: 赵𢾺，河西人也。善历算。沮渠蒙逊元始时，修元始术。上元甲寅至元始元年壬子，积六万一千四百三十八算上，元法四十三万二千，纪法七万二千，蔀法七千二百。章岁六百，章月七千四百二十一，亦曰时法。章闰二百二十一，周天二百六十二万九千七百五十九，亦曰通数。余数三万七千七百五十九，斗分一千七百五十九，日法八万九千五十二，亦曰蔀月。月周九万六千二百五十二，小周八千二十一，会数一百七十三，度余二万七千七百一十九，会虚六万一千三百三十三，交会差一百四十七，度余三千三百一十一，迟疾差六百，余四万一千五百三十。周日二十七，日余四万九千三百八十。周虚三万九千六百七十二。《宋书 大且渠蒙逊传》、《魏书 律历志》、《开元占经》
	// 上元甲寅至元始元年壬子，积61438算上，元法432000，纪法72000，蔀法7200。章岁600，章月7421，亦曰时法。章闰221，周天2629759，亦曰通数。余数37759，斗分1759，日法89052，亦曰蔀月。月周96252，小周8021，会数173，度余27719，会虚61333，交会差147，度余3311，迟疾差600，余41530。周日27，日余49380。周虚39672。
	//
	// 周天/蔀法 / (通数/日法) = 2629759/7200 / (2629759/89052) = 12 221/600
	// 玄始历 历元JDN = -20568349 = 1871530 - 61438 * 24 * 2629759/172800 | 0
	// 1871530: 子夜最接近北凉太祖永安11年11月(北凉太祖玄始0年11月, 411/12)天文冬至之JDN
	玄始历 : '2629759/89052,2629759/172800,-20568349,452/2/6~522/2/12',

	// https://zh.wikisource.org/wiki/%E5%AE%8B%E6%9B%B8/%E5%8D%B713
	// 《元嘉历法》：上元庚辰甲子纪首至太甲元年癸亥，三千五百二十三年，至元嘉二十年癸未，五千七百三年，算外。
	// 元嘉历以寅月（正月）为岁首，寅月中气雨水为气首；历元在正月朔旦夜半雨水时刻。
	//
	// 元嘉历_历元JDN = -200089 = 1882912 - 5703 * 年节气数 * 111035 / 7296 | 0,
	// 1882912: 子夜最接近元嘉20年1月天文雨水(5703/11/3 22:)之JDN(5703/11/4)。
	//
	// 通数/日法 = 29+399/752 = 22207/752
	//
	// 度法，三百四。
	// 365+75/304 = 111035/304
	// 111035/304/24 = 111035/7296 = 15 1595/7296 = 15+(66+11/24)/304 = 15+66/304+11/304/24
	// 推二十四气术：置入纪年算外，以余数乘之，满度法三百四为积没，不尽为小余。以六旬去积没，不尽为大余，命以纪，算外，所求年雨水日也。求次气，加大余十五，小余六十六，小分十一，小分满气法从小余，小余满度法从大余，次气日也。雨水在十六日以后者，如法减之，得立春。
	元嘉历 : [ '22207/752', '111035/7296', -200089, '445/1/24~510/1/26', {
		历元节气 : '雨水',
		// 历元当天是1月1日
		// 历元月序 : 1
	} ],

	// 大明历_历元JDN = -17080189 = 1890157 - 51939 * 年节气数 * 3605951 / 236946 | 0,
	// 上元甲子至宋大明七年癸卯，五万一千九百三十九年算外。
	// 1890157: 元嘉历 大明6年11月冬至
	//
	// 14423804/39491/24 = 3605951/236946
	// 采391年置144闰月法: 24 * (3605951/236946) / (116321/3939) = 12 144/391
	大明历 : '116321/3939,3605951/236946,-17080189,510/1/26~589/2/21',

	// 魏书/卷107上
	// 壬子元以来，至今大魏正光三年岁在壬寅，积十六万七千七百五十，算外
	// 正光历 历元JDN = -59357929 = 1911706 - 167750 * 年节气数 * 2213377/145440 | 0,
	// 1911706: 北魏孝明帝正光2年11月天文冬至日
	// 
	// 周天分/日法 = 2213377/74952 = 29 39769/74952
	// 周天分/蔀法/年节气数 = 2213377/6060/24 = 2213377/145440
	// 推二十四气术：求次气，加大余十五、小余一千三百二十四、小分一，小分满气法二十四，从小余一；小余满蔀法，从大余一
	// (2213377/6060/24%1)*6060 = 1324 1/24
	正光历 : '2213377/74952,2213377/145440,-59357929,522/2/12~540/1/25',

	// 上元甲子以来，至大魏兴和二年岁在庚申，积二十九万三千九百九十七，算上。
	// 兴和历 历元JDN = -105462049 = 1918281 - 293996 * 年节气数 * 6158017/404640 | 0,
	// 1918281: 孝静帝兴和1年11月天文冬至
	// 周天/蔀法/年节气数 = 6158017/16860/24 = 6158017/404640
	// 通数/日法 = 6158017/208530 = 29 110647/208530
	兴和历 : '6158017/208530,6158017/404640,-105462049,540/1/25~550/5/31',

	// https://github.com/suchowan/when_exe/blob/master/lib/when_exe/region/chinese/twins.rb
	// 隋书/卷17:
	// 上元甲子，至天保元年庚午，积十一万五百六算外，章岁六百七十六，度法二万三千六百六十，斗分五千七百八十七，历余十六万二千二百六十一。
	// 上元甲子(0)，至天保元年(550)庚午(6)，积110506算外，章岁676，度法23660，斗分5787，历余162261。
	// 110506%60=46, 110526%60=6, 积年110506→应为110526 + 60n。
	// 天保历 历元JDN = -38447089 = 1921934 - 110526 * 24 * 8641687/567840 | 0,
	// 1921934: 近东魏孝静帝武定7年11月天文冬至
	//
	// 唐开元占经 卷一百五 http://ctext.org/wiki.pl?if=gb&chapter=449774
	// 齐宋景天保厯上元甲子至今一十一万六百九十筭外 元法一百四十一万九千六百　纪法二千三万六千六百　蔀法三万三千六百六十(亦名日度法)章岁六百七十六(亦名日度法)章闰二百四十九(亦名闰法)章中八千一百一十二　章月八千三百六十一　日法二十九万二千六百三十五　周天八百六十四万一千六百八十五(亦名通数 亦名蔀法 亦名没分)余数一十二万四千八十七(亦名没分)斗名五千七百八十七　岁中十二　气法二十四　㑹数一百七十三　余九万一千五十八　㑹通五千七十一万六千九百一十三　㑹虚二十七万一千五百七十七　周日二十七　余一十六万二千二百六十一　通周八百六万三千四百六　周虚一十三万三百七十四　小周九千三十七　月周三十一万六千二百九十五　望十四余二十二万三千九百五十三半　交限数一百五十八　余一十五万九千七百三十九半　经月二十九　余一十五万五千二百七十二　虚分十三万七千三百六十三
	// 齐宋景天保厯上元甲子至今110690筭外 元法1419600　纪法20036600　蔀法33660(亦名日度法)章岁676(亦名日度法)章闰249(亦名闰法)章中8112　章月8361　日法292635　周天8641685(亦名通数 亦名蔀法 亦名没分)余数124087(亦名没分)斗名5787　岁中12　气法24　㑹数173　余91058　㑹通50716913　㑹虚271577　周日27　余162261　通周8063406　周虚130374　小周9037　月周316295　望十四余223953半　交限数158　余159739半　经月29　余155272　虚分137363
	// 日法/蔀法=292635/23660=12 249/676=12 章闰/章岁，故日法、蔀法应无误。蔀法33660→应为23660。
	// 因 "经月29　余155272"，29*292635+155272=8641687，周天8641685→应为8641687。
	//
	// 周天/日法 = 8641687/292635 = 29 155272/292635 = 经月+朔余/日法
	// 月法?/蔀法 = 8641687/23660 = 365 5787/23660 = 365+斗名/蔀法
	// 8641687/23660/24 = 8641687/567840
	天保历 : '8641687/292635,8641687/567840,-38447089,550/5/31~577/4/4',

	// 隋书/卷17
	// 及武帝时，甄鸾造《天和历》。上元甲寅至天和元年丙戌，积八十七万五千七百九十二算外，章岁三百九十一，蔀法二万三千四百六十，日法二十九万一百六十，朔余十五万三千九百九十一，斗分五千七百三十一，会余九万三千五百一十六，历余一十六万八百三十，冬至斗十五度，参用推步。终于宣政元年。
	// 及武帝时，甄鸾造《天和历》。上元甲寅(50)至天和元年(566)丙戌(22)，积875792算外，章岁391，蔀法23460，日法290160，朔余十五万三千九百九十一，斗分5731，会余93516，历余160830，冬至斗十五度，3用推步。终于宣政元年。
	// 875792%60=(22-50)%60
	// 天和历  历元JDN = -317950249 = 1927776 - 875792 * 24 * 8568631/563040 | 0,
	// 1927777: 近北周武帝保定5年11月天文冬至
	//
	// 唐开元占经 卷一百五 http://ctext.org/wiki.pl?if=gb&chapter=449774
	// 周甄变天和厯上元甲寅至今八十七万五千九百四十算外 章岁三百九十一　章闰一百四十四　蔀法三万三千四百六十　日法二十九万一百六十　朔余一十九万三千九百九十一　斗分五千七百三十一　㑹余九万三千五百一十六　厯余一十六万八百三十　冬至日在斗十五度
	// 周甄变天和厯上元甲寅至今875940算外 章岁391　章闰144　蔀法33460　日法290160　朔余193991　斗分5731　㑹余93516　厯余160830　冬至日在斗15度
	//
	// 8568631/23460 = 365 5731/23460 = 365+斗名/蔀法
	// 8568631/23460/24 = 8568631/563040
	// 8568631/290160 = 29 153991/290160 = 29+朔余/日法
	天和历 : '8568631/290160,8568631/563040,-317950249,566/2/6~579/3/14',

	// 隋书/卷17
	// 大象元年，太史上士马显等，又上《丙寅元历》...上元丙寅至大象元年己亥，积四万一千五百五十四算上。日法五万三千五百六十三，亦名蔀会法。章岁四百四十八，斗分三千一百六十七，蔀法一万二千九百九十二。章中为章会法。日法五万三千五百六十三，历余二万九千六百九十三，会日百七十三，会余一万六千六百一十九，冬至日在斗十二度。小周余、盈缩积，其历术别推入蔀会，分用阳率四百九十九，阴率九。每十二月下各有日月蚀转分，推步加减之，乃为定蚀大小余，而求加时之正。
	// 上元丙寅至大象元年己亥，积41554算上。日法53563，亦名蔀会法。章岁448，斗分3167，蔀法12992。章中为章会法。日法53563，历余29693，会日百七十三，会余16619，冬至日在斗12度。小周余、盈缩积，其历术别推入蔀会，分用阳率499，阴率9。每12月下各有日月蚀转分，推步加减之，乃为定蚀大小余，而求加时之正。
	// 大象历  历元JDN = -13244449 = 1932525 - 41553 * 24 * 1581749/103936 | 0,
	// 1932525: 北周武帝宣政1年11月5日 天文冬至日
	//
	// 唐开元占经 卷一百五 http://ctext.org/wiki.pl?if=gb&chapter=449774
	// 周马显景寅元厯上元景寅至今四万一千六百八十八算外 章岁四百四十八　章闰一百六十五　斗分三千一百六十七　蔀法一万三千九百九十二　日法五万三千五百六十三亦曰蔀㑹法厯余二万九千六百九十三　㑹日一百七十三　㑹余一万六千六百一十九　冬至日在斗十二度
	// 周马显景寅元厯上元景寅至今41688算外 章岁448　章闰165　斗分3167　蔀法13992　日法53563(亦曰蔀㑹法)厯余29693　㑹日173　㑹余16619　冬至日在斗12度
	//
	// 4745247/12992/24 = 1581749/103936
	大象历 : '1581749/53563,1581749/103936,-13244449,579/3/14~584/2/17',

	// 隋书卷17
	// 张宾所造历法，其要：以上元甲子已来，至开皇四年岁在甲辰，积四百一十二万九千一，算上。蔀法，一十万二千九百六十。章岁，四百二十九。章月，五千三百六。通月，五百三十七万二千二百九。日法，一十八万一千九百二十。斗分，二万五千六十三。会月，一千二百九十七。会率，二百二十一。会数，一百一十半。会分，一十一亿八千七百二十五万八千一百八十九。会日法，四千二十万四千三百二十。会日，百七十三。余，五万六千一百四十三。小分，一百一十。交法，五亿一千二百一十万四千八百。交分法，二千八百一十五。阴阳历，一十三。余，十一万二百六十三。小分，二千三百二十八。朔差，二。余，五万七千九百二十一。小分，九百七十四。蚀限，一十二。余，八万一千三百三。小分，四百三十三半。定差，四万四千五百四十八。周日，二十七。余，一十万八百五十九。亦名少大法木精曰岁星，合率四千一百六万三千八百八十九。火精曰荧惑，合率八千二十九万七千九百二十六。土精曰镇星，合率三千八百九十二万五千四百一十三。金精曰太白，合率六千一十一万九千六百五十五。水精曰辰星，合率一千一百九十三万一千一百二十五。
	// 张宾所造历法，其要：以上元甲子已来，至开皇4年岁在甲辰，积4129001，算上。蔀法，102960。章岁，429。章月，5306。通月，5372209。日法，181920。斗分，25063。会月，1297。会率，221。会数，110半。会分，1187258189。会日法，40204320。会日，173。余，56143。小分，110。交法，512104800。交分法，2815。阴阳历，13。余，110263。小分，2328。朔差，2。余，57921。小分，974。蚀限，12。余，81303。小分，433半。定差，44548。周日，27。余，100859。亦名少大法木精曰岁星，合率41063889。火精曰荧惑，合率80297926。土精曰镇星，合率38925413。金精曰太白，合率60119655。水精曰辰星，合率11931125。
	//
	// 唐开元占经 卷一百五 http://ctext.org/wiki.pl?if=gb&chapter=449774
	// 隋张賔厯上元甲子至今四百一十二万九千一百三十筭外 元法六百一十七万七千六百　纪法一百二万九千六百　蔀法十万二千九百六十亦名度法章岁四百二十九　章闰一百五十八　章月五千三百六通月五百三十七万二千二百九　日法十八万一千一百二十亦名周法虚分八万五千三百九十一　朔时法一万五千六百一十　周天分三千七百六十万五千四百六十三亦曰没分余数五十三万九千八百六十三亦曰没法岁中十二　斗分三万五千六十三气法二十四　气时法八千五百八十　㑹月一千二百九十七　㑹率二百二十二　合数一百一十半　㑹分一十一亿八千七百二十五万八千一百八十九　㑹通六十九亿六千七百七十五万五千七十三亦曰交数㑹日法四千二十万四千三百二十㑹日一百七十三　余五万六千一百四十三　小分一百一十　㑹虚一十二万五千七百七十六小分一百一十一　㑹日限一百五十八　㑹九万八千八百三十八　小分二百二十半　朔望合日数十四　余一十三万九千二百二十四　小分一百一十半　交法五亿一千二百一十万四千八百三分法二千八百一十五　隂阳厯一十三　余三万二百六十三　小分二千三百二十八　厯合二十七　余三万八千六百七　小分一千八百四十一　朔差二　余五万七千九百二十二　小分九百七十四　望差一　余二万八千九百六十一小分一千八百九十四半　蚀限十二　余八万一千三百三　小分四百三十三半　定差四万四千五百四十八　通周五百一万二千六百九十九余岁一万三千八百九十七　限三千八百一十三　周日二十七　余十万八百五十九亦名小大法周虚八万一千六十一　通率七　差虚十三万七千三百七十二　转率二百四十　分率七百五十八日周一百三十七万六千四百　小周五千七百三十五　朔望合数十四度　余一十三万九千二百二十四半
	// 隋张賔厯上元甲子至今4129130筭外 元法6177600　纪法1029600　蔀法十万二千九百六十亦名度法章岁429　章闰158　章月5306通月5372209　日法十八万一千一百二十亦名周法虚分85391　朔时法15610　周天分37605463亦曰没分余数539863亦曰没法岁中十二　斗分35063气法24　气时法8580　㑹月1297　㑹率222　合数110半　㑹分1187258189　㑹通6967755073亦曰交数㑹日法40204320㑹日173　余56143　小分110　㑹虚125776小分111　㑹日限158　㑹98838　小分220半　朔望合日数十四　余139224　小分110半　交法512104803分法2815　隂阳厯13　余30263　小分2328　厯合27　余38607　小分1841　朔差2　余57922　小分974　望差1　余28961小分1894半　蚀限十二　余81303　小分433半　定差44548　通周5012699余岁13897　限3813　周日27　余十万八百五十九亦名小大法周虚81061　通率7　差虚十三万七千三百七十二　转率240　分率758日周1376400　小周5735　朔望合数十四度　余139224半
	// 开皇历  历元JDN = -1506155749 = 1934351 - 4129000 * 24 * 37605463/2471040 | 0,
	// 1934351: 隋文帝开皇3年11月29日 天文冬至日
	//
	// 通月/日法 = 5372209/181920 = 29 96529/181920
	// 周天分/蔀法 = 37605463/102960 = 365 25063/102960
	// 37605463/102960/24 = 37605463/2471040
	开皇历 : '5372209/181920,37605463/2471040,-1506155749,584/2/17~597/1/24',

	// 隋书卷17
	// 自甲子元至大业四年戊辰，百四十二万七千六百四十四年，算外。章岁，四百一十。章闰，百五十一。章月，五千七十一。日法，千一百四十四。月法，三万三千七百八十三。辰法，二百八十六。岁分，一千五百五十七万二千九百六十三。度法，四万二千六百四十。没分，五百一十九万一千三百一十一没法，七万四千五百二十一。周天分，一千五百五十七万四千四百六十六。斗分，一万八百六十六。气法，四十六万九千四十。气时法，一万六百六十。周日，二十七。日余，一千四百一十三。周通，七万二百九。周法，二千五百四十八。
	// 自甲子元至大业4年戊辰，1427644年，算外。章岁，410。章闰，151。章月，5071。日法，1144。月法，33783。辰法，286。岁分，15572963。度法，42640。没分，5191311没法，74521。周天分，15574466。斗分，10866。气法，469040。气时法，10660。周日，27。日余，1413。周通，70209。周法，2548。
	// 因 (15573963/42640)/(33783/1144) = 12 151/410，岁分15572963→应为15573963。
	//
	// 唐开元占经 卷一百五 http://ctext.org/wiki.pl?if=gb&chapter=449774
	// 大业历  历元JDN = -519493909 = 1943118 - 1427644 * 24 * 5191321/341120 | 0,
	// 1943118: 近隋炀帝大业3年11月26日 天文冬至日
	//
	// 月法/日法 = 33783/1144
	// 岁分/度法 = 15573963/42640 = 365 10363/42640
	// 15573963/42640/24 = 5191321/341120
	大业历 : '33783/1144,5191321/341120,-519493909,597/1/24~619/1/21',

	// 贞观十九年（645年）之后采用平朔法。
	// 新唐书/卷025:
	// 《戊寅历》上元戊寅岁至武德九年丙戌，积十六万四千三百四十八算外。章岁六百七十六。亦名行分法。章闰二百四十九。章月八千三百六十一。月法三十八万四千七十五。日法万三千六。时法六千五百三度法、气法九千四百六十四气时法千一百八十三。岁分三百四十五万六千六百七十五。岁余二千三百一十五。周分三百四十五万六千八百四十五半。斗分一千四百八十五半。没分七万六千八百一十五。没法千一百三。历日二十七，历余万六千六十四。历周七十九万八千二百。历法二万八千九百六十八。余数四万九千六百三十五。章月乘年，如章岁得一，为积月。以月法乘积月，如日法得一，为朔积日；余为小余。日满六十，去之；余为大余。命甲子算外，得天正平朔。加大余二十九、小余六千九百一，得次朔。加平朔大余七、小余四千九百七十六、小分四之三，为上弦。又加，得望。又加，得下弦。余数乘年，如气法得一，为气积日。命日如前，得冬至。加大余十五、小余二千六十八、小分八之一，得次气日。加四季之节大余十二、小余千六百五十四、小分四，得土王。凡节气小余，三之，以气时法而一，命子半算外，各其加时。置冬至小余，八之，减没分，余满没法为日。加冬至去朔日算，依月大小去之，日不满月算，得没日。余分尽为减。加日六十九、余七百八，得次没。
	// 《戊寅历》上元戊寅岁至武德9年丙戌，积164348算外。章岁676。亦名行分法。章闰249。章月8361。月法384075。日法13006。时法6503度法、气法9464气时法1183。岁分3456675。岁余2315。周分3456845半。斗分1485半。没分76815。没法1103。历日27，历余16064。历周798200。历法28968。余数49635。章月乘年，如章岁得1，为积月。以月法乘积月，如日法得1，为朔积日；余为小余。日满60，去之；余为大余。命甲子算外，得天正平朔。加大余29、小余6901，得次朔。加平朔大余7、小余4976、小分4之3，为上弦。又加，得望。又加，得下弦。余数乘年，如气法得1，为气积日。命日如前，得冬至。加大余15、小余2068、小分8之1，得次气日。加4季之节大余12、小余1654、小分4，得土王。凡节气小余，3之，以气时法而1，命子半算外，各其加时。置冬至小余，8之，减没分，余满没法为日。加冬至去朔日算，依月大小去之，日不满月算，得没日。余分尽为减。加日69、余708，得次没。
	//
	// 唐开元占经 卷一百五 http://ctext.org/wiki.pl?if=gb&chapter=449774
	// 傅仁均戊寅厯上元戊寅至今一十六万四千四百三十六筭外 章岁六百七十六亦名行分法章闰二百四十九　章月八千六百六十一　月法三十八万四千七十五日法一万三千六　时法六千五百三　度法九千四百六十四亦名气法气时法一千一百八十三　岁分三百四十五万六千六百七十五　岁余二千三百一十五　周天分三百四十五万六千八百四十五斗分二千四百八十五半　没分七万六千八百一十五没法一千一百三　厯日二十七　厯日余一万六千六十四　厯周七十九万八千二百　厯法二万八千九百六十八　余数四万九千六百三十五
	// 傅仁均戊寅厯上元戊寅至今164436筭外 章岁676亦名行分法章闰249　章月8661　月法384075 日法13006　时法6503　度法9464亦名气法气时法1183　岁分3456675　岁余2315　周天分3456845 斗分2485半　没分76815没法1103　厯日27　厯日余16064　厯周798200　厯法28968　余数49635
	// 平朔戊寅元历  历元JDN = -58077529 = 1949692 - 164348 * 24 * 1152225/75712 | 0,
	// 1949692: 近唐高祖武德8年11月14日 天文冬至日
	//
	// 岁分/度法/年节气数 = 3456675/9464/24 = 1152225/75712
	// 月法/日法 = 384075/13006
	//
	// 为避连四大月，贞观十九年（645年）之后采用平朔法。麟德元年（664年），被《麟德历》取代。
	//
	// https://github.com/suchowan/when_exe/blob/master/lib/when_exe/region/chinese/calendars.rb
	平朔戊寅元历 : '384075/13006,1152225/75712,-58077529,645/2/2~666/2/9',

	// 文武天皇元年（697年）から仪凤暦が単独で用いられるようになった（ただし、前年の持统天皇10年说・翌年の文武天皇2年说もある）。ただし、新暦の特徴の1つであった进朔は行われなかったとされている。その后67年间使用されて、天平宝字8年（764年）に大衍暦に改暦された。
	// https://github.com/suchowan/when_exe/blob/master/lib/when_exe/region/japanese/twins.rb
	// 122357/335/24 = 122357/8040
	// 续日本纪/卷第廿四: 天平宝字七年八月戊子: 废仪凤暦始用大衍暦。
	平朔仪凤暦 : '39571/1340,122357/8040,-96608689,696/2/9~764/2/7'
});




/*

'-86/12/25'.to_Date('CE').to_太初历()
CeL.太初历_Date(38,10,1).format('CE');

CeL.太初历_Date.test(-2e4, 1e7, 4).join('\n') || 'OK';
// 110476 ms, error 0/4


CeL.后汉四分历_Date.test(-2e4, 1e7, 4).join('\n') || 'OK';
// 103443 ms, error 0/4

CeL.乾象历_Date.test(-2e4, 1e7, 4).join('\n') || 'OK';
// 100272 ms, error 0/4


CeL.景初历_Date.test(-2e4, 1e7, 4).join('\n') || 'OK';
// 105011 ms, error 0/4





CeL.元嘉历_Date.test(-2e4, 1e7, 4).join('\n') || 'OK';
// 106947 ms, error 0/4


CeL.大明历_Date.test(-2e4, 1e7, 4).join('\n') || 'OK';
// 97203 ms, error 0/4


CeL.颛顼历_Date.test(-2e4, 1e7, 4).join('\n') || 'OK';
// OK

CeL.鲁历_Date.test(-2e4, 1e7, 4).join('\n') || 'OK';
// OK


*/



//----------------------------------------------------------------------------------------------------------------------------------------------------------//
// 以下为应用天文演算的历法。

//----------------------------------------------------------------------------------------------------------------------------------------------------------//
// Le calendrier républicain, ou calendrier révolutionnaire français (法国共和历, French Republican Calendar).

// ** Warning: need application.astronomy

// 每月天数。
var French_Republican_MONTH_DAYS = 30,
// epochal year of 1792 CE
French_Republican_epochal_year = 1792 - 1,
// month name
French_Republican_month_name = '|Vendémiaire|Brumaire|Frimaire|Nivôse|Pluviôse|Ventôse|Germinal|Floréal|Prairial|Messidor|Thermidor|Fructidor|Jours complémentaires'
		.split('|'),
// weekday name
French_Republican_weekday_name = 'Primidi|Duodi|Tridi|Quartidi|Quintidi|Sextidi|Septidi|Octidi|Nonidi|Décadi'
		.split('|'),
// 预防 load 时尚未 ready.
French_Republican_year_starts = function(year) {
	if (library_namespace.solar_term_calendar)
		return (French_Republican_year_starts
		// 每年第一天都从秋分日开始。
		= library_namespace.solar_term_calendar('秋分',
		// French: UTC+1
		1 * 60))(year);
};

French_Republican_year_starts.year_of = function(date) {
	French_Republican_year_starts();
	if (this !== French_Republican_year_starts.year_of)
		return French_Republican_year_starts.year_of(date);
};

// 先尝试看看。
French_Republican_year_starts();

French_Republican_Date.month_name = function(month) {
	return French_Republican_month_name[month];
};

/**
 * calendrier républicain → Gregorian Date @ local
 *
 * TODO: time
 *
 * @param {Integer}year
 *            year of calendrier républicain.
 * @param {Natural}month
 *            month of calendrier républicain. Using 13 for the complementary
 *            days.
 * @param {Natural}date
 *            date of calendrier républicain.
 *
 * @returns {Date} system Date (proleptic Gregorian calendar with year 0)
 */
function French_Republican_Date(year, month, date, shift) {
	// no year 0. year: -1 → 0
	if (year < 1)
		year++;

	return new Date(
			French_Republican_year_starts(year + French_Republican_epochal_year)
					// 一年分为12个月，每月30天，每月分为3周，每周10天，废除星期日，每年最后加5天，闰年加6天。
					+ ((month - 1) * French_Republican_MONTH_DAYS + date - 1 + (shift || 0))
					* ONE_DAY_LENGTH_VALUE);
}

_.Republican_Date = French_Republican_Date;

function Date_to_French_Republican(date, options) {
	var days = French_Republican_year_starts.year_of(date),
	//
	year = days[0] - French_Republican_epochal_year;
	days = days[1];

	date = Math.floor(days).divided(French_Republican_MONTH_DAYS);
	// year/0/0 → year/1/1
	date[0]++;
	date[1]++;

	if (days %= 1)
		// Each day was divided in 10 hours of 100 minutes.
		// 共和历的时间单位为十进位制，一旬为十日，一日为十小时，一小时为一百分钟，一分钟为一百秒
		date.push(days);
	// no year 0
	if (year < 1)
		year--;
	date.unshift(year);

	// 不动到原 options。
	date[KEY_WEEK] = French_Republican_weekday_name[
		//
		(date[2] - 1) % French_Republican_weekday_name.length];
	days = _format(date, options, French_Republican_Date.month_name);
	if (typeof days === 'string' && (year = days.match(/^(.+? \d+ \D+ )(-?\d+)$/))) {
		if (year[2] > 0 && library_namespace.to_Roman_numeral)
			year[2] = library_namespace.to_Roman_numeral(year[2]);

		var décade = (((date[2] - 1) / French_Republican_weekday_name.length) | 0) + 1;
		// e.g., output:
		// Septidi, 7 Floréal an CCXXIII
		days = 'Décade ' + décade + ' Jour du ' + year[1] + 'an ' + year[2];
	}
	if (false)
		days.décade = (((date[2] - 1) / French_Republican_weekday_name.length) | 0) + 1;
	return days;
}

/*

CeL.Republican_Date.test(-2e4, 4e6, 4).join('\n') || 'OK';
// "OK"

*/
French_Republican_Date.test = new_tester(Date_to_French_Republican, French_Republican_Date, {
	epoch : Date.parse('1792/9/22'),
	month_days : {
		30 : 'common month',
		5 : 'common complementary days',
		6 : 'complementary days in leap year'
	}
});


//----------------------------------------------------------------------------------------------------------------------------------------------------------//
// گاه‌شماری هجری خورشیدی (Solar Hijri calendar, the solar heǰrī calendar)

// ** Warning: need application.astronomy

// 现在伊朗(1925/3/31–)和阿富汗(1922 CE–)的官方历。
// The present Iranian calendar was legally adopted on 31 March 1925, under the early Pahlavi dynasty.
// Afghanistan legally adopted the official Jalali calendar in 1922 but with different month names.

// http://www.iranicaonline.org/articles/afghanistan-x-political-history
// the solar heǰrī calendar officially replaced the lunar calendar in 1301 Š./1922.
// 阿富汗官方语言 	达利语（波斯语）、普什图语

// Persian calendar, Kurdish calendar, Afghan calendar
// http://www.calendarhome.com/calculate/convert-a-date
// http://www.viewiran.com/calendar-converter.php


// epochal year of 622 CE
var Solar_Hijri_epochal_year = 622 - 1,
// month name, 春4 夏4 秋4 冬4
// https://fa.wikipedia.org/wiki/%DA%AF%D8%A7%D9%87%E2%80%8C%D8%B4%D9%85%D8%A7%D8%B1%DB%8C_%D9%87%D8%AC%D8%B1%DB%8C_%D8%AE%D9%88%D8%B1%D8%B4%DB%8C%D8%AF%DB%8C
Solar_Hijri_month_name = {
	// 伊朗现代波斯语名称, گاه‌شماری در ایران
	'ایران' : '|فروردین|اردیبهشت|خرداد|تیر|مرداد|شهریور|مهر|آبان|آذر|دی|بهمن|اسفند'.split('|'),
	// 阿富汗波斯语名称 （古伊朗波斯语名称）
	'افغانستان' : '|حمل|ثور|جوزا|سرطان|اسد|سنبله|میزان|عقرب|قوس|جدی|دلو|حوت'.split('|'),
	// 普什图语（پښتو），帕图语
	'پشتو' : '|وری|غویی|غبرګولی|چنګاښ|زمری|وږی|تله|لړم|لیندۍ|مرغومی|سلواغه|کب'.split('|'),
	// 库德语
	'کردی' : '|خاکه‌لێوه|گوڵان|جۆزەردان|پووشپەڕ|گەلاوێژ|خەرمانان|ڕەزبەر|خەزەڵوەر|سەرماوەز|بەفرانبار|ڕێبەندان|رەشەمە'.split('|')
},
// weekday name. In the Iranian calendar, every week begins on Saturday and ends on Friday.
Solar_Hijri_weekday_name = ''
		.split('|'),
// 预防 load 时尚未 ready.
Solar_Hijri_year_starts = function(year) {
	if (library_namespace.solar_term_calendar)
		return (Solar_Hijri_year_starts
				// 透过从德黑兰（或东经52.5度子午线）和喀布尔精准的天文观测，确定每年的第一天（纳吾肉孜节）由春分开始。
				// the first noon is on the last day of one calendar year and the second
				// noon is on the first day (Nowruz) of the next year.
				// 如果春分点在连续两个正午之间，那第一个正午落在上一年的最后一天，第二个正午落在下一年的第一天。
				//
				// https://en.wikipedia.org/wiki/Solar_Hijri_calendar#Solar_Hijri_and_Gregorian_calendars
				= library_namespace.solar_term_calendar('春分',
						// 3.5: UTC+3.5 → minute offset
						// 12: 移半天可以取代正午之效果。
						(3.5 + 12) * 60))(year);
};

Solar_Hijri_year_starts.year_of = function(date) {
	Solar_Hijri_year_starts();
	if (this !== Solar_Hijri_year_starts.year_of)
		return Solar_Hijri_year_starts.year_of(date);
};

// 先尝试看看。
Solar_Hijri_year_starts();

Solar_Hijri_Date.month_name = function(month_serial, is_leap, options) {
	return Solar_Hijri_month_name[options && options.locale || 'ایران'][month_serial];
};

/**
 * Solar Hijri calendar
 *
 * @param {Integer}year
 *            year of Solar Hijri calendar.
 * @param {Natural}month
 *            month of Solar Hijri calendar
 *            days.
 * @param {Natural}date
 *            date of Solar Hijri calendar.
 *
 * @returns {Date} system Date (proleptic Gregorian calendar with year 0)
 */
function Solar_Hijri_Date(year, month, date) {
	// no year 0. year: -1 → 0
	if (year < 1)
		year++;

	return new Date(Solar_Hijri_year_starts(year + Solar_Hijri_epochal_year)
	// 伊朗历月名由12 个波斯名字组成。前6个月是每月31天，下5个月是30天，最后一个月平年29天，闰年30天。
	// The first six months (Farvardin–Shahrivar) have 31 days, the next
	// five (Mehr–Bahman) have 30 days, and the last month (Esfand) has 29
	// days or 30 days in leap years.
	+ (--month * 30 + Math.min(month, 6) + date - 1)
			* ONE_DAY_LENGTH_VALUE);
}

_.Solar_Hijri_Date = Solar_Hijri_Date;

function Date_to_Solar_Hijri(date, options) {
	var days = Solar_Hijri_year_starts.year_of(date),
	//
	year = days[0] - Solar_Hijri_epochal_year;
	days = days[1];

	date = Math.floor(days);
	if (date < 31 * 6)
		date = date.divided(31);
	else {
		date = (date - 31 * 6).divided(30);
		date[0] += 6;
	}
	// year/0/0 → year/1/1
	date[0]++;
	date[1]++;

	if (days %= 1)
		date.push(days);
	// no year 0
	if (year < 1)
		year--;
	date.unshift(year);

	// 不动到原 options。
	options = Object.assign({
		numeral : library_namespace.to_Perso_numeral
	}, options);
	days = _format(date, options, Solar_Hijri_Date.month_name);
	return days;
}

/*

CeL.Solar_Hijri_Date.test(-2e4, 4e6, 4).join('\n') || 'OK';
// "OK"

*/
Solar_Hijri_Date.test = new_tester(Date_to_Solar_Hijri, Solar_Hijri_Date, {
	epoch : Date.parse('622/3/22'),
	month_days : {
		31 : 'month 1–6',
		30 : 'month 7–11, 12 (leap year)',
		29 : 'common month 12'
	}
});


//----------------------------------------------------------------------------------------------------------------------------------------------------------//
// 彝历
// TODO: 彝文历算书《尼亥尼司》研究

// 每月天数。
var Yi_MONTH_DAYS = 36,
// 一年10个月。
Yi_MONTH_COUNT = 10,
// 首年（东方之年）以虎为首，依序纪日不间断。
Yi_DAY_OFFSET = 0,
// 木火土铜水, 分公母/雌雄. 以「铜」代「金」、以「公母」代「阴阳」
Yi_month_name = [],
//
Yi_year_name = '东,东南,南,西南,西,西北,北,东北'.split(','),
// 预防 load 时尚未 ready.
Yi_year_starts = function(year) {
	if (library_namespace.solar_term_calendar)
		return (Yi_year_starts = library_namespace.solar_term_calendar('冬至',
		// 8: UTC+8 → minute offset
		8 * 60))(year);
};

Yi_year_starts.year_of = function(date) {
	Yi_year_starts();
	if (this !== Yi_year_starts.year_of)
		return Yi_year_starts.year_of(date);
};


// 先尝试看看。
Yi_year_starts();

Yi_month_name.length = 1;
'木火土铜水'.split('').forEach(function(五行) {
	// 阴阳
	Yi_month_name.push(五行 + '公月', 五行 + '母月');
});
// 过年日于历算法中，古称「岁余日」。
Yi_month_name.push('岁余日');

Yi_Date.month_name = function(month, is_leap, options) {
	return Yi_month_name[month];
};

/**
 * Yi calendar
 *
 * @param {Integer}year
 *            year of Yi calendar.
 * @param {Natural}month
 *            month of Yi calendar.
 *            过年日: 11
 * @param {Natural}date
 *            date of Yi calendar.
 *
 * @returns {Date} system Date (proleptic Gregorian calendar with year 0)
 */
function Yi_Date(year, month, date) {
	// no year 0. year: -1 → 0
	if (year < 1)
		year++;

	if (month !== (month | 0) || !(0 < month && month < 12)) {
		library_namespace.error('Invalid month: ' + month
				+ ' Should be 1–10. 11 for leap year.');
		return new Date(NaN);
	}
	return new Date(Yi_year_starts(year)
	// 2000年: 以 2000/12/21 冬至为基准，1–10月往前数，过年日(11月)往后数。
	+ (date - 1 - ((Yi_MONTH_COUNT + 1) - month) * Yi_MONTH_DAYS)
			* ONE_DAY_LENGTH_VALUE);
}

_.Yi_Date = Yi_Date;

function Date_to_Yi(date, options) {
	var days = Yi_year_starts.year_of(date),
	//
	year = days[0],
	//
	month = (Yi_year_starts(year + 1) - date) / ONE_DAY_LENGTH_VALUE,
	//
	_date = date;
	// console.log([ month, days ])
	days = days[1];

	// no year 0
	if (year < 1)
		year--;

	if ( // days < 5 ||
	Yi_MONTH_COUNT * Yi_MONTH_DAYS < month) {
		date = [ year, Yi_MONTH_COUNT + 1, days + 1 ];
	} else {
		date = [ year + 1,
		//
		Yi_MONTH_COUNT + 1 - Math.ceil(month / Yi_MONTH_DAYS),
		//
		days = 1 + (-month).mod(Yi_MONTH_DAYS) ];
		if (days %= 1) {
			date[2] |= 0;
			date.push(days);
		}
	}

	if (options && options.format === 'name') {
		// 由下面测试，发现 1991–2055 以 +1 能得到最多年首由虎日起，为东方之年之情况。
		if (false) {
			for (var y = 1900, n; y < 2100; y++) {
				n = CeL.Yi_Date(y, 1, 1).to_Yi({
					format : 'name'
				});
				if (n.includes('虎日'))
					console.log(y + n);
			}
		}
		date[0]
		// 但依 hosi.org，2015/5北方之年，应该采 -1。
		//= Yi_year_name[(date[0] - 1).mod(Yi_year_name.length)] + '方之年';
		+= '年';

		date[1] = Yi_Date.month_name(month = date[1]);

		days = date[2];
		if (library_namespace.十二生肖_LIST) {
			days = library_namespace.十二生肖_LIST[(Yi_DAY_OFFSET +
			//
			library_namespace.stem_branch_index(_date))
			//
			% library_namespace.十二生肖_LIST.length];
		}
		date[2] = (month < Yi_MONTH_COUNT + 1 ? (1 + ((date[2] - 1)
		//
		/ library_namespace.十二生肖_LIST.length | 0)) + '轮' : '') + days + '日';
		date = date.join('');
	}

	return date;
}

/*

CeL.Yi_Date.test(-2e4, 4e6, 4).join('\n') || 'OK';
// "OK"

*/
Yi_Date.test = new_tester(Date_to_Yi, Yi_Date, {
	epoch : Date.parse('1000/1/1'),
	continued_month : function(month, old_month) {
		return month === 1 && old_month === 11;
	},
	month_days : {
		36 : '10个月',
		5 : '过年日',
		6 : '闰年过年日'
	}
});



//----------------------------------------------------------------------------------------------------------------------------------------------------------//
// reform of lunisolar calendar

/*

https://en.wikipedia.org/wiki/Lunisolar_calendar#Determining_leap_months

tropical year:
365.2421896698 − 6.15359×10−6T − 7.29×10−10T2 + 2.64×10−10T3
It will get shorter

synodic month:
The long-term average duration is 29.530587981 days (29 d 12 h 44 min 2.8016 s)

ContinuedFraction[365.2421896698/29.530587981]
{12, 2, 1, 2, 1, 1, 17, 2, 1, 2, 20}

FromContinuedFraction[{12, 2, 1, 2, 1, 1, 17, 2, 1, 2, 20}]
687688/55601≈12.3683
// too long
// After these time, the value itself changes. We need another rule.

FromContinuedFraction[{12, 2, 1, 2, 1, 1}]
235/19≈12.3684
// Metonic cycle

(235*29.530587981-19*365.2421896698)*24*60
124.663404672
// About 2 hours error after 19 tropical years
// Surely it's great.

FromContinuedFraction[{12, 2, 1, 2, 1, 1, 17}]
4131/334≈12.3683

(365.2421896698*334-29.530587981*4131)*24*60
46.656291168
// About 1 hour error after 334 tropical years
// But still too long. And the cycle changes with time.

*/



/*

//2667年冬至: JD 747310.9998001553, -2667/1/10 19:59:42.734, 日干支 0, 月日视黄经差 1.1136104778852314, score 1.5306026653852314
//3673年冬至: JD 3062950.8316446813, 3673/12/21 15:57:34.100, 日干支 0, 月日视黄经差 -1.5341348762158304, score 1.7006387824658304


for 理想单调（monotone）之平气平朔无中置闰历法

// find 历元

TODO: 去除ΔT影响

CeL.LEA406.default_type = 'a';
for (var year = -10000; year < 5000; year++) {
	//冬至
	var JD = CeL.equinox(year, 3);
	//甲子
	if (Math.abs(JD % 60 - 61 / 6) > 2) continue;
	//朔旦
	if (CeL.lunar_phase_of_JD(JD, {
			index: true
		}) !== 0 && CeL.lunar_phase_of_JD(JD - 1, {
			index: true
		}) !== 0)
		continue;
	//精算
	JD = CeL.solar_term_JD(year, 18);
	var 日干支 = JD - 61 / 6 | 0,
	//取子夜
	JD0=(JD-日干支<.5?日干支:日干支+1)+61 / 6;
	日干支 = (JD0 - 61 / 6 | 0).mod(60);
	var score = (CeL.JD_to_Date(JD0) - 0) / 24;
	score = Math.abs(JD - JD0) + (日干支 > 30 ? 60 - 日干支 : 日干支) + Math.abs(CeL.lunar_phase_angel_of_JD(JD0)/29.5);
	if (score > 1) continue;
	console.log(year + '年冬至: JD ' + JD + ', ' + CeL.JD_to_Date(JD0).format() + ', 日干支 ' + 日干支 + ', 月日视黄经差 ' + CeL.lunar_phase_angel_of_JD(JD0) + ', score ' + score);
}

//-2610年冬至: JD 768129.8507179104, -2610/12/20 0:0:0.000, 日干支 0, 月日视黄经差 2.9119043939281255, score 0.4146573797018283
//640年冬至: JD 1955169.7904528817, 640/12/22 0:0:0.000, 日干支 0, 月日视黄经差 -0.4712520273751579, score 0.3921884300238532
//2185年冬至: JD 2519469.9652989875, 2185/12/22 0:0:0.000, 日干支 0, 月日视黄经差 -2.492848316425807, score 0.2858710118122517

('-2610/12/20'.to_Date()-'2185/12/22'.to_Date())/86400000=1751340
// 回归年
1751340/(2185+2609)=365.3191489361702

*/


//----------------------------------------------------------------------------------------------------------------------------------------------------------//

// http://en.wikipedia.org/wiki/Easter
// http://en.wikipedia.org/wiki/Computus
// http://www.merlyn.demon.co.uk/estralgs.txt
function jrsEaster(YR) { // Fast JRSEaster, unsigned 32-bit year
  var gn, xx, cy, DM
  gn = YR % 19					// gn ~ GoldenNumber
  xx = (YR/100)|0
  cy = ((3*(xx+1)/4)|0) - (((13+xx*8)/25)|0)	// cy ~ BCPcypher
  xx = ( 6 + YR + ((YR/4)|0) - xx + ((YR/400)|0) ) % 7
  DM = 21 + (gn*19 + cy + 15)%30 ; DM -= ((gn>10) + DM > 49) // PFM
  return DM + 1 + (66-xx-DM)%7 /* Day-of-March */ }


//----------------------------------------------------------------------------------------------------------------------------------------------------------//
// export methods.

// register
Object.assign(String_to_Date.parser, {
	// e.g., "8.19.15.3.4 1 K'an 2 K'ayab'".to_Date('Maya').format()
	Maya : Maya_Date,
	Myanmar : _parser(Myanmar_Date, Myanmar_Date.new_year_Date),
	Egyptian : _parser(Egyptian_Date)
});

library_namespace.set_method(Date.prototype, Object.assign({
	to_Long_Count : set_bind(Maya_Date.to_Long_Count),
	to_Tabular : set_bind(Date_to_Tabular),
	to_Hebrew : set_bind(Date_to_Hebrew),
	to_Dai : function(options) {
		// 转成纪元积日数。
		return Dai_Date.date_of_days((this - Dai_Date.epoch)
				/ ONE_DAY_LENGTH_VALUE | 0, options);
	},
	to_Myanmar : set_bind(Date_to_Myanmar),
	to_Hindu : set_bind(Date_to_Hindu),
	to_Indian_national : set_bind(Date_to_Indian_national),
	to_Bangla : set_bind(Date_to_Bangla),
	to_Thai : set_bind(Date_to_Thai),
	to_Bahai : set_bind(Date_to_Bahai),
	to_Coptic : set_bind(Date_to_Coptic),
	to_Ethiopian : set_bind(Date_to_Ethiopian),
	to_Armenian : set_bind(Date_to_Armenian),
	to_Egyptian : set_bind(Date_to_Egyptian),
	to_Byzantine : set_bind(Date_to_Byzantine),
	to_Nanakshahi : set_bind(Date_to_Nanakshahi),
	to_Revised_Julian : set_bind(Date_to_Revised_Julian),

	// 以下为应用天文演算的历法。
	to_Republican : set_bind(Date_to_French_Republican),
	to_Solar_Hijri : set_bind(Date_to_Solar_Hijri),
	// to_Yi_calendar
	to_Yi : set_bind(Date_to_Yi)
}, to_历));


return (
	_// JSDT:_module_
);
}


});

