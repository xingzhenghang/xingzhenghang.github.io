/**
 * @name CeL function for era calendar.
 * @fileoverview 本档案包含了东亚传统历法/中国传统历法/历书/历谱/帝王纪年/年号纪年，农历、夏历、阴历，中西历/信史的日期转换功能。<br />
 *               以历史上使用过的历数为准。用意不在推导历法，而在对过去时间作正确转换。因此仅用查表法，不作繁复天文计算。
 * 
 * @since 2013/2/13 12:45:44
 * 
 * TODO:<br />
 * 检查前后相交的记年资料 每个月日数是否相同<br />
 * 岁时记事 几龙治水、几日得辛、几牛耕地、几姑把蚕、蚕食几叶
 * http://mathematicsclass.blogspot.tw/2009/06/blog-post_17.html<br />
 * bug: 西汉武帝后元2年<br />
 * 太复杂了，效率不高，重构。<br />
 * 旧唐书/卷11 <span data-era="~">宝应元年</span>..<span data-era="~">二年</span>..<span
 * data-era="~">二月甲午</span>，回纥登里可汗辞归蕃。<span data-era="~">三月甲辰</span>朔，襄州右兵马使梁崇义杀大将李昭，据城自固，仍授崇义襄州刺史、山南东道节度使。<span
 * data-era="~">丁未</span>，袁傪破袁晁之众于浙东。玄宗、肃宗归祔山陵。自<span data-era="~">三月一日</span>废朝，至于<span
 * data-era="~">晦日</span>，百僚素服诣延英门通名起居。<br />
 * CeL.era('二年春正月丁亥朔',{after:'宝应元年'})<br />
 * CeL.era('丁亥朔',{after:'宝应二年春正月'})<br />
 * CeL.era('宝应元年',{period_end:true})<br />
 * CeL.era('嘉庆十六年二月二十四日寅刻')===CeL.era('嘉庆十六年二月二十四日寅时')<br />
 * Period 独立成 class<br />
 * 南明绍宗隆武1年闰6月月干支!=甲申, should be 癸未<br />
 * 月令别名 http://140.112.30.230/datemap/monthalias.php<br />
 * 月の异称 http://www.geocities.jp/okugesan_com/yougo.html<br />
 * 西周金文纪时术语. e.g., 初吉，既生霸，既望，既死霸
 * (http://wywu.pixnet.net/blog/post/22412573-%E6%9C%88%E7%9B%B8%E8%A8%98%E6%97%A5%E8%A1%A8)
 * 
 * 未来发展：<br />
 * 加入世界各国的对应机能。<br />
 * 加入 国旗
 * 
 * @example <code>


// demo / feature: 较常用、吸引人的特性。

CeL.log('公历农历(阳历阴历)日期互换:');

var 农历, 公历;

// 公历←农历特定日期。
农历 = '农历2014年1月1日';
公历 = CeL.era(农历).format('公元%Y年%m月%d日');
CeL.log(['农历: ', 农历, ' → 公历: ', 公历]);

// 农历←公历特定日期。
公历 = '公元2014年1月1日';
农历 = CeL.era({date:公历.to_Date(), era:'农历'}).format({parser:'CE',format:'%纪年%年年%月月%日日',locale:'cmn-Hant-TW'});
CeL.log(['公历: ', 公历, ' → 农历: ', 农历]);

// 今天的农历日期。
var 今天的农历日期 = (new Date).format('Chinese');
CeL.log(['今天是农历: ', 今天的农历日期]);
今天的农历日期 = CeL.era({date:new Date, era:'农历'}).format({parser:'CE',format:'农历%年(%岁次)年%月月%日日',locale:'cmn-Hant-TW'});
CeL.log(['今天是农历: ', 今天的农历日期]);

// 取得公元 415年, 中历 三月 之 CE Date。
CeL.era.中历('415年三月');

// CeL.era('') 相当于:
// https://docs.microsoft.com/zh-tw/dotnet/api/system.datetime.parse
// DateTime.Parse("")
// https://support.office.com/en-us/article/datevalue-function-df8b07d4-7761-4a93-bc33-b7471bbff252?omkt=en-US&ui=en-US&rs=en-US&ad=US
// Excel: =DATEVALUE("")



CeL.run('data.date.era', test_era_data);

// era.onload
CeL.env.era_data_load = function(country, queue) {
	if (typeof country === 'object') {
		// 第一次呼叫 callback。
		// 在载入era模组之前设定好，可以用来筛选需要载入的国家。
		// gettext_config:{"id":"china"}
		queue.truncate().push('中国');
		return;
	}

	// assert: 已载入 {String}country
	CeL.log('era data of [' + country + '] loaded.');
	// 判断是否已载入所有历数资料。
	if (!queue) {
		CeL.log('All era data loaded.');
		// assert: CeL.era.loaded === true
	}
};


function test_era_data() {
	// 判断是否已载入所有历数资料。
	if (!CeL.era.loaded) {
		setTimeout(test_era_data, 80);
		return;
	}
}


// More examples: see /_test suite/test.js


 // should be error: 清任何一个纪年无第一八八〇年。
 '清一八八〇年四月二十一日七时'.to_Date('era').format({parser:'CE',format:'%岁次年%月干支月%日干支日%时干支时',locale:'cmn-Hant-TW'})
 // should be error
 '元一八八〇年四月二十一日七时'.to_Date('era').format({parser:'CE',format:'%岁次年%月干支月%日干支日%时干支时',locale:'cmn-Hant-TW'})



 // ---------------------------------------

 废弃:

 查找：某 era name → era data:
 1st: [朝代 or 朝代兼纪年] from dynasty{*}
 2ed: [朝代:君主(帝王) list] from dynasty{朝代:{*}}
 3ed: [朝代君主(帝王):纪年 list] from dynasty{朝代:{君主(帝王):[]}}

 查找：某日期 → era data:
 1. get start date: 定 era_start_UTC 所有 day 或之前的 index。
 2. get end date, refrence:
 遍历 era_end_UTC，处理所有（结束）日期于 day 之后的，即所有包含此日期的 data。


 </code>
 */

'use strict';
// 'use asm';

// --------------------------------------------------------------------------------------------

// 不采用 if 陈述式，可以避免 Eclipse JSDoc 与 format 多缩排一层。
typeof CeL === 'function' && CeL.run({
	name : 'data.date.era',
	// data.code.compatibility. : for String.prototype.repeat(),
	// String.prototype.trim()
	// includes() @ data.code.compatibility.
	require : 'data.code.compatibility.'
	// data.native. : for Array.prototype.search_sorted()
	+ '|data.native.'
	// application.locale. : 中文数字
	+ '|application.locale.'
	// data.date. : 干支
	+ '|data.date.String_to_Date'
	// Maya 需要用到 data.date.calendar。
	+ '|data.date.Julian_day|data.date.calendar.',
	// 为了方便格式化程式码，因此将 module 函式主体另外抽出。
	code : module_code,
	// 设定不汇出的子函式。
	// this is a sub module.
	// 完全不 export 至 library_namespace.
	no_extend : '*'
});

function module_code(library_namespace) {

	// requiring
	var String_to_Date = this.r('String_to_Date'), Julian_day = this
			.r('Julian_day');

	// ---------------------------------------------------------------------//
	// basic constants. 定义基本常数。

	// 工具函数。
	function generate_pattern(pattern_source, delete_干支, flag) {
		if (library_namespace.is_RegExp(pattern_source)) {
			if (flag === undefined && ('flags' in pattern_source))
				flag = pattern_source.flags;
			pattern_source = pattern_source.source;
		}
		pattern_source = pattern_source
		// 数字
		.replace(/数/g, '(?:[' + library_namespace
		// "有": e.g., 十有二月。
		.positional_Chinese_numerals_digits + '百千]|[十廿卅]有?)');
		if (delete_干支) {
			pattern_source = pattern_source.replace(/干支\|/g, '');
		} else {
			pattern_source = pattern_source
			// 天干
			.replace(/干/g, '[' + library_namespace.STEM_LIST + ']')
			// 地支
			.replace(/支/g, '[' + library_namespace.BRANCH_LIST + ']');
		}
		return new RegExp(pattern_source, flag || '');
	}

	function to_list(string) {
		if (typeof string === 'string') {
			if (string.includes('|'))
				string = string.split('|');
			else if (string.includes(','))
				string = string.split(',');
			else
				string = string.chars('');
		}
		return string;
	}

	var is_Date = library_namespace.is_Date,

	/**
	 * 把第2个引数阵列添加到第1个引数阵列后面
	 * 
	 * or try Array.prototype.splice()
	 */
	Array_push = Array.prototype.push.apply.bind(Array.prototype.push),

	Date_to_String_parser = library_namespace.Date_to_String.parser,
	//
	strftime = Date_to_String_parser.strftime,

	// copy from data.date.
	/** {Number}一整天的 time 值。should be 24 * 60 * 60 * 1000 = 86400000. */
	ONE_DAY_LENGTH_VALUE = new Date(0, 0, 2) - new Date(0, 0, 1),
	/** {Number}一分钟的 time 值(in milliseconds)。should be 60 * 1000 = 60000. */
	ONE_MINUTE_LENGTH_VALUE = new Date(0, 0, 1, 0, 2) - new Date(0, 0, 1, 0, 1),

	CE_REFORM_YEAR = library_namespace.Gregorian_reform_date.getFullYear(),

	CE_COMMON_YEAR_LENGTH_VALUE
	//
	= new Date(2, 0, 1) - new Date(1, 0, 1),
	//
	CE_LEAP_YEAR_LENGTH_VALUE = CE_COMMON_YEAR_LENGTH_VALUE
			+ ONE_DAY_LENGTH_VALUE,
	//
	CE_REFORM_YEAR_LENGTH_VALUE = library_namespace
	//
	.is_leap_year(CE_REFORM_YEAR, true) ? CE_LEAP_YEAR_LENGTH_VALUE
			: CE_COMMON_YEAR_LENGTH_VALUE,

	CE_COMMON_YEAR_DATA = Object.seal(library_namespace.get_month_days()),
	//
	CE_LEAP_YEAR_DATA = Object.seal(library_namespace.get_month_days(true)),
	//
	CE_REFORM_YEAR_DATA = library_namespace.get_month_days(CE_REFORM_YEAR),

	// cache
	gettext_date = library_namespace.gettext.date,

	// 专门供搜寻各特殊纪年使用。
	// @see create_era_search_pattern()
	era_search_pattern, era_key_list,

	// search_index[ {String}key : 朝代、君主(帝王)、帝王纪年、年号纪年、国家 ]
	// = Set(对应之 era_list index list)
	// = [ Set(对应之 era_list index list), 'key of search_index',
	// 'key'..
	// ]
	search_index = Object.create(null),

	// constant 常数。

	// http://zh.wikipedia.org/wiki/Talk:%E8%BE%B2%E6%9B%86
	// 将公元日时换算为夏历日时，1929年1月1日以前，应将时间换为北京紫禁城（东经116.4度）实际时间，1929年1月1日开始，则使用东八区（东经120度）的标准时间。
	DEFAULT_TIMEZONE = String_to_Date.zone.CST,

	// http://zh.wikipedia.org/wiki/%E7%AF%80%E6%B0%A3
	// 中气持续日期/前后范畴。
	中气日_days = 3,
	// 中气发生于每月此日起 (中气日_days - 1) 日间。
	// assert: 在整个作业年代中，此中气日皆有效。起码须包含
	// proleptic Gregorian calendar -1500 – 2100 CE。
	中气日 = [ 19, 18, 20, 19, 20, 20, 22, 22, 22, 22, 21, 20 ],

	/** {Number}未发现之index。 const: 基本上与程式码设计合一，仅表示名义，不可更改。(=== -1) */
	NOT_FOUND = ''.indexOf('_'),

	// 起始年月日。年月日 starts form 1.
	// 基本上与程式码设计合一，仅表示名义，不可更改。
	START_YEAR = 1, START_MONTH = 1, START_DATE = 1,

	// 闰月名前缀。
	// 基本上与程式码设计合一，仅表示名义，不可更改。
	// TODO: 闰或润均可
	LEAP_MONTH_PREFIX = '闰',

	// (年/月分资料=[年分各月资料/月分日数])[NAME_KEY]=[年/月分名称]
	NAME_KEY = 'name', LEAP_MONTH_KEY = 'leap',
	// 月次，岁次
	START_KEY = 'start',
	// 起始日名/起始日码/起始日期名
	START_DATE_KEY = 'start date',
	//
	MONTH_NAME_KEY = 'month name',
	//
	MINUTE_OFFSET_KEY = 'minute offset',

	COUNT_KEY = 'count',

	// 亦用于春秋战国时期"周诸侯国"分类
	PERIOD_KEY = '时期',
	//
	PERIOD_PREFIX = 'period:',
	//
	PERIOD_PATTERN = new RegExp('^' + PERIOD_PREFIX + '(.+)$'),
	// 日期连接号。 e.g., "–".
	// 减号"-"与太多符号用途重叠，因此不是个好的选择。
	PERIOD_DASH = '–',

	// set normal month count of a year.
	// 月数12: 每年有12个月.
	LUNISOLAR_MONTH_COUNT = 12,

	// 可能出现的最大日期值。
	MAX_DATE_NUMBER = 1e5,

	// 二进位。
	// 基本上与程式码设计合一，仅表示名义，不可更改。
	RADIX_2 = 2,

	/**
	 * parseInt( , radix) 可处理之最大 radix， 与 Number.prototype.toString ( [ radix ] )
	 * 可用之最大基数 (radix, base)。<br />
	 * 10 Arabic numerals + 26 Latin alphabet.
	 * 
	 * @inner
	 * @see <a href="http://en.wikipedia.org/wiki/Hexadecimal"
	 *      accessdate="2013/9/8 17:26">Hexadecimal</a>
	 */
	PACK_RADIX = 10 + 26,

	LEAP_MONTH_PADDING = new Array(
	// 闰月会有 LUNISOLAR_MONTH_COUNT 个月 + 1个闰月 笔资料。
	(LUNISOLAR_MONTH_COUNT + 1).toString(RADIX_2).length + 1).join(0),

	// 每年月数资料的固定长度。
	// 依当前实作法，最长可能为长度 4。
	YEAR_CHUNK_SIZE = parseInt(
	// 为了保持应有的长度，最前面加上 1。
	'1' + new Array(LUNISOLAR_MONTH_COUNT).join(
	// 农历通常是大小月相间。
	'110').slice(0, LUNISOLAR_MONTH_COUNT + 1)
	// 13 个月可以二进位 1101 表现。
	+ (LUNISOLAR_MONTH_COUNT + 1).toString(RADIX_2), RADIX_2)
	//
	.toString(PACK_RADIX).length,

	PACKED_YEAR_CHUNK_PADDING = new Array(
	// using String.prototype.repeat
	YEAR_CHUNK_SIZE + 1).join(' '),

	// 筛选出每年月数资料的 pattern。
	CALENDAR_DATA_SPLIT_PATTERN = new RegExp('[\\s\\S]{1,'
	// 或可使用: /[\s\S]{4}/g
	+ YEAR_CHUNK_SIZE + '}', 'g'),

	// date_data 0/1 设定。
	// 农历一个月是29日或30日。
	// long month / short month
	大月 = 30, 小月 = 29,
	// length of the months
	// 0:30, 1:29
	// 注意:会影响到 parse_era()!
	// 基本上与程式码设计合一，仅表示名义，不可更改。
	MONTH_DAYS = [ 大月, 小月 ],

	// month length / month days: 公历大月为31天。
	// 仅表示名义，不可更改。
	CE_MONTH_DAYS = 31,

	// 所有所处理的历法中，可能出现的每月最大日数。
	// now it's CE.
	MAX_MONTH_DAYS = CE_MONTH_DAYS,

	MONTH_DAY_INDEX = Object.create(null),

	// 辨识历数项。
	// 基本上与程式码设计合一，不可更改。
	// 见 extract_calendar_data()
	// [ all, front, date_name, calendar_data, back ]
	// 历数_PATTERN =
	// /(?:([;\t]|^))(.*?)=?([^;\t=]+)(?:([;\t]|$))/g,
	//
	// [ all, date_name, calendar_data, back ]
	历数_PATTERN = /(.*?)=?([^;\t=]+)([;\t]|$)/g,
	// 以最快速度测出已压缩历数。
	// 见 initialize_era_date()
	已压缩历数_PATTERN = /^(?:[\d\/]*=)?[\da-z]{3}[\da-z ]*$/,

	// matched: [ , is_闰月, 月序/月分号码 ]
	// TODO: 11冬月, 12腊月.
	// TODO: [闰后]
	MONTH_NAME_PATTERN = /^([闰闰])?([正元]|[01]?\d)月?$/,

	干支_PATTERN = generate_pattern(/^干支$/),

	年_SOURCE =
	// 年分名称。允许"嘉庆十八年癸酉"之类表"嘉庆十八年癸酉岁"。
	/([前\-−‐]?\d{1,4}|干支|前?数{1,4}|元)[\/.\-年]\s*(?:(?:岁次)?干支\s*)?/
	//
	.source,
	// 月分名称。
	月_SOURCE = /\s*([^\s\/.\-年月日]{1,20})[\/.\-月]/.source,
	// 日期名称。
	日_SOURCE = /\s*初?(\d{1,2}|数{1,3}|[^\s日朔晦望]{1,5})日?/.source,

	// 四季, 四时
	季_LIST = to_list('春夏秋冬'),
	// ⛱️,☀️
	季_Unicode = to_list('🌱,😎,🍂,⛄'),
	// 季名称。e.g., 春正月
	季_SOURCE = '[' + 季_LIST + ']?王?',

	孟仲季_LIST = to_list('孟仲季'),

	// see: numeralize_time()
	时刻_PATTERN = generate_pattern(
	// '(?:[早晚夜])'+
	/(支)(?:时?\s*([初正])([初一二三123])刻|时)/),

	// should matched: 月|年/|/日|月/日|/月/日|年/月/|年/月/日
	// ^(年?/)?月/日|年/|/日|月$
	// matched: [ , 年, 月, 日 ]
	// TODO: 11冬月, 12腊月.
	起始日码_PATTERN =
	// [日朔晦望]
	/^(-?\d+|元)?[\/.\-年]([闰闰]?(?:[正元]|[01]?\d))[\/.\-月]?(?:(初?\d{1,2}?|[正元])日?)?$/
	//
	,

	// e.g., 满洲帝国, 中华民国
	国_PATTERN = /^(.*[^民帝])国$/,

	// [ , 名称 ]
	名称加称号_PATTERN = /^(.{2,})(?:天皇|皇后)$/,

	// 取得/保存前置资讯。
	前置_SOURCE = '^(.*?)',
	// 取得/保存后置资讯。
	后置_SOURCE = '(.*?)$',

	// NOT: 测试是否全为数字，单纯只有数字用。
	// 测试是否为单一中文数字字元。
	单数字_PATTERN = generate_pattern(/^数$/),

	// 当前的 ERA_DATE_PATTERN 必须指明所求年/月/日，无法仅省略日。
	// 否则遇到'吴大帝太元元年1月1日'之类的无法处理。
	// 若有非数字，干支之年分名称，需要重新设计！
	// matched: [ , prefix, year, month, date, suffix ]
	ERA_DATE_PATTERN = generate_pattern(前置_SOURCE + 年_SOURCE + 季_SOURCE
			+ 月_SOURCE + 日_SOURCE + 后置_SOURCE),

	// 减缩版 ERA_DATE_PATTERN: 省略日期，或亦省略月分。 ERA_DATE_PATTERN_NO_DATE
	ERA_DATE_PATTERN_ERA_ONLY
	// matched: [ , prefix, year, numeral month, month, suffix ]
	= generate_pattern(前置_SOURCE + 年_SOURCE + 季_SOURCE
	// 月分名称。参考 (月_SOURCE)。
	+ /\s*(?:([01]?\d)|([^\s\/.\-年月日]{1,20})月)?/.source + 后置_SOURCE),

	// 减缩版 ERA_DATE_PATTERN: parse 年分 only。
	// matched: [ , prefix, year, , , suffix ]
	ERA_DATE_PATTERN_YEAR = generate_pattern(前置_SOURCE
	// 年分名称。
	+ /([前\-−‐]?\d{1,4}|干支|前?数{1,4})[\/.\-年]?()()/.source + 后置_SOURCE),

	// 用来测试如 "一八八〇"
	POSITIONAL_DATE_NAME_PATTERN = new RegExp('^['
			+ library_namespace.positional_Chinese_numerals_digits + ']{1,4}$'),

	ERA_PATTERN =
	//
	/^([东西南北前后]?\S)(.{1,3}[祖宗皇帝王君公侯伯叔主子后])(.{0,8})(?:([一二三四五六七八九十]{1,3})年)?/
	//
	,

	持续日数_PATTERN = /^\s*\+\d+\s*$/,

	// [ 纪年历数, 起始日期名, 所参照之纪年或国家 ]
	参照_PATTERN = /^(?:(.*?)=)?:(.+)$/,

	// 可指示尚存疑/争议资料，例如传说时代/神话之资料。
	// https://en.wikipedia.org/wiki/Circa
	// c., ca or ca. (also circ. or cca.), means "approximately" in
	// several European languages including English, usually in
	// reference to a date.
	//
	// r. can be used to designate the ruling period of a person in
	// dynastic power, to distinguish from his or her lifespan.
	准确程度_ENUM = {
		// 资料尚存有争议或疑点
		疑 : '尚存疑',
		// 为传说时代/神话之资料
		传说 : '传说时代'
	},

	主要索引名称 = to_list('纪年,君主,朝代,国家'),

	// 配合 parse_era() 与 get_next_era()。
	// 因为须从范围小的开始搜寻，因此范围小的得排前面！
	纪年名称索引值 = {
		era : 0,
		纪年 : 0,
		// gettext_config:{"id":"era-date"}
		"年号" : 0,
		// 纪年法: 日本年号, 元号/年号
		元号 : 0,

		// 称号
		// 统治者, 起事者, 国家最高领导人, 国家元首, 作乱/起辜/起义领导者, 民变领导人, 领袖, 首领
		君主 : 1,
		// monarch, ruler
		ruler : 1,
		// 君主姓名
		君主名 : 1,
		// 君主字,小字(乳名)
		表字 : 1,
		帝王 : 1,
		总统 : 1,
		// 天皇名
		天皇 : 1,
		// 自唐朝以后，庙号在前、谥号在后的连称方式，构成已死帝王的全号。
		// 唐朝以前的皇帝有庙号者较少，所以对殁世的皇帝一般简称谥号，如汉武帝、隋明帝，不称庙号。唐朝以后，由于皇帝有庙号者占绝大多数，所以多称庙号，如唐太宗、宋太宗等。
		// NG: 谥号
		谥 : 1,
		讳 : 1,
		称号 : 1,
		庙号 : 1,
		// 尊号: 君主、后妃在世时的称呼。不需避讳
		// 尊号 : 1,
		封号 : 1,
		分期 : 1,
		// for 琉球国
		// 童名常有重复
		// 童名 : 1,
		神号 : 1,

		君主性别 : 1,

		// dynasty
		朝代 : 2,
		政权 : 2,
		国号 : 2,
		// 王国名
		国名 : 2,

		// 王朝, 王家, 帝国, Empire

		// state 州
		// Ancient Chinese states
		// https://en.wikipedia.org/wiki/Ancient_Chinese_states
		//
		// 诸侯国名
		诸侯国 : 2,
		// 历史时期 period. e.g., 魏晋南北朝, 五代十国
		// period : 2,
		时期 : 2,

		// country
		// e.g., 中国, 日本
		国家 : 3
	// territory 疆域
	// nation
	// 民族 : 3
	// 地区, 区域. e,g, 中亚, 北亚, 东北亚
	},

	Period_属性归属 = Object.assign({
		// 君主出生日期
		生 : 1,
		// 君主逝世/死亡日期, 天子驾崩/诸侯薨
		卒 : 1,
		// 君主在位期间: 上任/退位, 执政,君主统治,统治,支配
		在位 : 1
	}, 纪年名称索引值),

	// era data refrence 对应
	// sorted by: start Date 标准时间(如UTC+8) → parse_era() 插入顺序.
	/** {Array}按照起始时间排列的所有纪年列表 */
	era_list = [],

	// era tree.
	// period_root[国家]
	// = 次阶层 Period
	period_root = new Period,

	// default date parser.
	// 采用 'Chinese' 可 parse 日干支。
	DEFAULT_DATE_PARSER = 'Chinese',
	// 不使用 parser。
	PASS_PARSER = [ 'PASS_PARSER' ],
	// 标准时间分析器名称（如公元）
	// gettext_config:{"id":"common-era"}
	standard_time_parser_name = '公元',
	// 标准时间分析器（如公元纪年日期）, 标准纪年时间
	standard_time_parser = 'CE',
	// default date format
	// 基本上与程式码设计合一，不可更改。
	DATE_NAME_FORMAT = '%Y/%m/%d',
	// pass to date formatter.
	standard_time_format = {
		parser : standard_time_parser,
		format : DATE_NAME_FORMAT
	}, standard_year_format = {
		parser : standard_time_parser,
		format : '%Y年'
	},

	// @see get_era_name(type)

	// 基本上仅表示名义。若欲更改，需考虑对外部程式之相容性。
	SEARCH_STRING = 'dynasty',
	//
	WITH_PERIOD = 'period', WITH_COUNTRY = 'country',

	// 年名后缀
	POSTFIX_年名称 = '年',

	// 十二生肖，或属相。
	// Chinese Zodiac
	十二生肖_LIST = to_list('鼠牛虎兔龙蛇马羊猴鸡狗猪'),
	// Chinese Zodiac in Unicode, 表情符号/图画文字/象形字
	十二生肖图像文字_LIST = to_list('🐁🐄🐅🐇🐉🐍🐎🐑🐒🐓🐕🐖'),
	// 阴阳五行
	// The Wu Xing, (五行 wŭ xíng) also known as the Five
	// Elements, Five
	// Phases, the Five Agents, the Five Movements, Five
	// Processes, and
	// the Five Steps/Stages
	阴阳五行_LIST = to_list('木火土金水'),

	// @see https://zh.wikipedia.org/wiki/%E5%8D%81%E4%BA%8C%E5%BE%8B
	// 十二月律
	// 黄钟之月:十一月子月
	// 蕤宾 or 蕤賔 http://sidneyluo.net/a/a05/016.htm 晋书 卷十六 ‧ 志第六 律历上
	月律_LIST = to_list('太簇,夹钟,姑洗,仲吕,蕤宾,林钟,夷则,南吕,无射,应钟,黄钟,大吕'),

	// 各月の别名, 日本月名
	// https://ja.wikipedia.org/wiki/%E6%97%A5%E6%9C%AC%E3%81%AE%E6%9A%A6#.E5.90.84.E6.9C.88.E3.81.AE.E5.88.A5.E5.90.8D
	月の别名_LIST = to_list('睦月,如月,弥生,卯月,皐月,水无月,文月,叶月,长月,神无月,霜月,师走'),
	// '大安赤口先胜友引先负仏灭'.match(/../g)
	六曜_LIST = to_list('大安,赤口,先胜,友引,先负,仏灭'),
	// 七曜, 曜日. ㈪-㈰: ㈰㈪㈫㈬㈭㈮㈯. ㊊-㊐: ㊐㊊㊋㊌㊍㊎㊏
	七曜_LIST = to_list('日月火水木金土'),
	// "十二值位星"（十二值:建除十二神,十二值位:十二建星） @ 「通胜」或农民历
	// 建、除、满、平、定、执、破、危、成、收、开、闭。
	// http://jerry100630902.pixnet.net/blog/post/333011570-%E8%AA%8D%E8%AD%98%E4%BD%A0%E7%9A%84%E5%A2%83%E7%95%8C~-%E9%99%BD%E6%9B%86%E3%80%81%E9%99%B0%E6%9B%86%E3%80%81%E9%99%B0%E9%99%BD%E5%90%88%E6%9B%86---%E7%AF%80%E6%B0%A3-
	// 十二建星每月两「建」，即正月建寅、二月建卯、三月建辰……，依此类推。正月为寅月，所以六寅日（甲寅、丙寅、戊寅、庚寅、壬寅）中必须有两个寅日和「建」遇到一起；二月为卯月，所以六卯日（乙卯、丁卯、己卯、辛卯、癸卯）中必须有两个卯日和「建」遇到一起，否则就不对。逢节（立春、惊蜇、清明、立夏、芒种、小暑、立秋、白鲁、寒露、立冬、大雪、小寒）两个建星相重，这样才能保证本月第一个与月支相同之日与「建」相遇。
	十二直_LIST = to_list('建除満平定执破危成纳开闭'),
	// "廿八星宿" @ 农民历: 东青龙7北玄武7西白虎7南朱雀7
	// It will be splitted later.
	// jp:角亢氐房心尾箕斗牛女虚危室壁奎娄胃昴毕觜参井鬼柳星张翼轸
	// diff: 虚, 参
	// 因始于中国，采中国字。
	二十八宿_LIST = '角亢氐房心尾箕斗牛女虚危室壁奎娄胃昴毕觜参井鬼柳星张翼轸',
	// 二十八宿にあり二十七宿にはない宿は、牛宿である。
	// It will be splitted and modified later.
	二十七宿_LIST = 二十八宿_LIST.replace(/牛/, ''),
	// 旧暦（太阳太阴暦）における月日がわかれば、自动的に二十七宿が决定される。
	// 各月の朔日の宿
	二十七宿_offset = to_list('室奎胃毕参鬼张角氐心斗虚'),
	// 六十甲子纳音 / 纳音五行
	// 《三命通会》《论纳音取象》
	// http://ctext.org/wiki.pl?if=gb&chapter=212352
	纳音_LIST = to_list('海中,炉中,大林,路旁,剑锋,山头,涧下,城头,白蜡,杨柳,井泉,屋上,霹雳,松柏,长流,'
	// 0 – 59 干支序转纳音: 纳音_LIST[index / 2 | 0]; '/2': 0,1→0; 2,3→1; ...
	+ '砂中,山下,平地,壁上,金泊,覆灯,天河,大驿,钗钏,桑柘,大溪,沙中,天上,石榴,大海'),
	// It will be splitted later.
	九星_LIST = '一白水星,二黑土星,三碧木星,四绿木星,五黄土星,六白金星,七赤金星,八白土星,九紫火星',
	// '一白水星,二黒土星,三碧木星,四绿木星,五黄土星,六白金星,七赤金星,八白土星,九紫火星'
	九星_JP_LIST = to_list(九星_LIST.replace(/黑/, '黒').replace(/绿/, '绿').replace(
			/黄/, '黄'));

	// ---------------------------------------------------------------------//
	// 初始调整并规范基本常数。

	九星_LIST = to_list(九星_LIST);

	(function() {
		var a = [ 2, 1 ];
		Array_push(a, [ 4, 3 ]);
		if (a.join(',') !== "2,1,4,3")
			Array_push = function(array, list) {
				return Array.prototype.push.apply(array, list);
			};

		a = library_namespace.Gregorian_reform_date;
		a = [ a.getFullYear(), a.getMonth() + 1, a.getDate() ];
		if (CE_REFORM_YEAR_LENGTH_VALUE > CE_COMMON_YEAR_LENGTH_VALUE
				&& a[1] < 3 && library_namespace
				//
				.is_different_leap_year(a[0], true))
			CE_REFORM_YEAR_LENGTH_VALUE = CE_COMMON_YEAR_LENGTH_VALUE,
					CE_REFORM_YEAR_DATA[1]--;
		var d = library_namespace.Julian_shift_days(a);
		CE_REFORM_YEAR_LENGTH_VALUE += d * ONE_DAY_LENGTH_VALUE;
		CE_REFORM_YEAR_DATA[a[1] - 1] += d;
		// TODO: 无法处理 1582/10/15-30!!

		Object.seal(CE_REFORM_YEAR_DATA);

		二十八宿_LIST = to_list(二十八宿_LIST);
		to_list('蛟龙貉兔狐虎豹獬牛蝠鼠燕猪貐狼狗雉鸡乌猴猿犴羊獐马鹿蛇蚓')
		// https://zh.wikisource.org/wiki/演禽通纂_(四库全书本)/全览
		// 角木蛟〈蛇父雉母细颈上白婴四脚〉亢金龙 氐土狢
		// 房日兎 心月狐 尾火虎〈为暗禽〉
		// 箕水豹〈为暗禽〉 斗木獬 牛金牛
		// 女土蝠 虚日䑕 危月燕
		// 室火猪 壁水㺄 奎木狼
		// 娄金狗 胃土雉 昴日鸡〈为明禽〉
		// 毕月乌 嘴火猴 参水猿
		// 井木犴 鬼金羊 柳土獐
		// 星日马 张月鹿 翼火蛇
		// 轸水蚓
		.forEach(function(动物, index) {
			二十八宿_LIST[index]
			// starts from '角木蛟'
			+= 七曜_LIST[(index + 4) % 七曜_LIST.length] + 动物;
		});

		a = 二十七宿_offset;
		// d = 二十七宿_LIST.length;
		// 二十七宿_offset[m] 可得到 m月之 offset。
		二十七宿_offset = new Array(START_MONTH);
		a.forEach(function(first) {
			二十七宿_offset.push(二十七宿_LIST.indexOf(first) - START_DATE);
		});

		二十七宿_LIST = to_list(二十七宿_LIST);

		// 为纳音配上五行。
		if (false) {
			'金火木土金火水土金木水土火木水金火木土金火水土金木水土火木水'
			// 六十甲子纳音 / 纳音五行
			.replace(/(.)/g, function($0, 五行) {
				var index = '火木水土金'.indexOf(五行);
				return index === -1 ? $0 : index;
			});
			// "401340234123012401340234123012"
			// 401340234123012
			// 401 340 234 123 012
			// 456 345 234 123 012
		}

		a = '火木水土金';
		a += a;
		for (d = 纳音_LIST.length; d-- > 0;)
			// "% 15": 30个 → 15个 loop : 0 – 14
			纳音_LIST[d] += a.charAt(4 - ((d % 15) / 3 | 0) + (d % 3));
	})();

	if (false)
		// assert: this is already done.
		主要索引名称.forEach(function(name, index) {
			纪年名称索引值[name] = index;
		});

	// 预设国家。
	// parse_era.default_country = '中国';

	// clone MONTH_DAYS
	parse_era.days = [];

	parse_era.chunk_size = YEAR_CHUNK_SIZE;

	MONTH_DAYS.forEach(function(days, index) {
		MONTH_DAY_INDEX[days] = index;
		parse_era.days.push(days);
	});

	// ---------------------------------------------------------------------//
	// private tool functions. 工具函数

	// search_index 处理。search_index public interface。
	// TODO: 增加效率。
	// search_index 必须允许以 ({String}key in search_index)
	// 的方式来侦测是否具有此 key。
	function for_each_era_of_key(key, operator, queue) {
		// 预防循环参照用。
		function not_in_queue(key) {
			if (!queue.has(key)) {
				queue.add(key);
				return true;
			}
			library_namespace.debug('skip [' + eras[i] + ']. (queue: ['
					+ queue.values() + '])', 1, 'for_each_era_of_key');
		}

		var eras = search_index[key],
		//
		for_single = function(era) {
			if (not_in_queue(era))
				operator(era);
		};

		if (!library_namespace.is_Set(queue))
			queue = new Set;
		// assert: queue is Set.

		// era: Era, Set, []
		if (Array.isArray(eras)) {
			eras[0].forEach(for_single);

			for (var i = 1; i < eras.length; i++)
				if (not_in_queue(eras[i]))
					for_each_era_of_key(eras[i], operator, queue);
		} else
			eras.forEach(for_single);
	}

	// bug: 当擅自改变子纪年时，将因 cache 而无法得到正确的 size。
	function era_count_of_key(key, queue) {
		var eras = search_index[key],
		//
		size = ('size' in eras) && eras.size;

		if (!size && Array.isArray(eras)) {
			size = eras[0].size;

			if (Array.isArray(queue)) {
				if (queue.includes(key)) {
					library_namespace.debug(
					// 将造成之后遇到此 key 时，使 for_each_era_of_key() 不断循环参照。
					'别名设定存在循环参照！您应该改正别名设定: ' + queue.join('→') + '→' + key, 1,
							'era_count_of_key');
					return 0;
				}
				queue.push(key);
			} else
				queue = [ key ];
			for (var i = 1; i < eras.length; i++)
				size += era_count_of_key(eras[i], queue);
			eras.size = size;
		}

		return size;
	}

	// 取得以 key 登录之所有 era。
	// get era Set of {String}key
	function get_era_Set_of_key(key, no_expand) {
		var eras = search_index[key];

		if (Array.isArray(eras)) {
			if (no_expand)
				// eras[0]: 所有仅包含 key 的 era Set。
				return eras[0];
			if (eras.cache)
				eras = eras.cache;
			else {
				var i = 1, length = eras.length,
				// 不动到 search_index
				set = library_namespace.Set_from_Array(eras[0]);
				for (; i < length; i++)
					for_each_era_of_key(eras[i], function(era) {
						// console.log(String(era));
						set.add(era);
					});
				eras.cache = set;
				eras = set;
			}
		}

		return eras;
	}

	// 为取得单一 era。否则应用 to_era_Date()。
	function get_era(name) {
		if (name instanceof Era) {
			return name;
		}

		var list = search_index[name];
		if (!list) {
			return;
		}

		if (Array.isArray(list)) {
			// assert: list = [ {Set}, {String}alias ]
			if (list.length === 1) {
				list = list[0];
			} else if (list.length === 2 && library_namespace.is_Set(list[0])
					&& list[0].size === 0) {
				return get_era(list[1]);
			} else {
				return;
			}
		}

		var era;
		if (library_namespace.is_Set(list)) {
			if (list.size !== 1)
				return;
			list.forEach(function(_era) {
				era = _era;
			});
		} else {
			// list is {Era}
			era = list;
		}
		return era;
	}

	// 登录 key，使 search_index[key] 可以找到 era。
	// 可处理重复 key 之情况，而不覆盖原有值。
	function add_to_era_by_key(key, era) {
		if (!key || !era || key === era)
			return;

		var eras = search_index[key];
		if (!eras)
			// 初始化 search_index[key]。
			if (typeof era !== 'string') {
				// search_index[]: Set, [原生 Set, alias String 1,
				// alias
				// String 2, ..]
				(search_index[key] = eras = library_namespace
						.Set_from_Array(Array.isArray(era)
						// era: Era, string, []
						? era : [ era ])).origin = true;
				return;

			} else
				(search_index[key] = eras = new Set).origin = true;

		if (era instanceof Era) {
			if (Array.isArray(eras)) {
				// .size, .cache 已经不准。
				delete eras.size;
				delete eras.cache;
				// 添加在原生 Set: 名称本身即为此 key。
				eras = eras[0];
			}
			eras.add(era);

			// else assert: typeof era==='string'
		} else if (Array.isArray(eras)) {
			eras.push(era);
			// .size, .cache 已经不准。
			delete eras.size;
			delete eras.cache;
		} else
			(search_index[key] = eras = [ eras, era ]).origin = true;
	}

	function append_period(object, name) {
		var start = object.start,
		// 处理精度
		format = object.精 === '年' ? standard_year_format : standard_time_format;
		name.push(' (', (is_Date(start) ? start : new Date(start))
				.format(format),
		// @see CeL.date.parse_period.PATTERN
		// [\-–~－—─～〜﹣至]
		'~', new Date(object.end
		// 向前一天以取得最后一日。
		// 并非万全之法?
		- ONE_DAY_LENGTH_VALUE).format(format), ')');
	}

	// ---------------------------------------------------------------------//
	// bar 工具函数。

	// TODO: comparator()
	// sorted_array: sorted by .[start_key]
	function order_bar(sorted_array, start_key, end_key, comparator) {
		if (sorted_array.length === 0)
			return [];

		if (!start_key)
			// .start
			start_key = 'start';
		if (!end_key)
			// .end
			end_key = 'end';

		var bars = [], all_end = -Infinity,
		// 置入最后欲回传的阶层。
		layer = [ bars ];

		function settle(do_reset) {
			// clear. 结清。
			// 写入/纪录阶层序数。

			if (bars.length > 1) {
				// sort 前一区间。
				// TODO: 若有接续前后者的，酌加权重。
				bars.sort(function(a, b) {
					// 大→小。
					return b.weight - a.weight;
				});

				if (do_reset)
					layer.push(bars = []);
			}
		}

		sorted_array.forEach(function(object) {
			var bar,
			//
			start = object[start_key], end = object[end_key];

			if (start < all_end) {
				// 有重叠。

				if (bars.length === 1 && bars[0].length > 1) {
					// 先结清一下前面没重叠的部分，只挤出最后一个元素。
					// bars : last bar
					bars = bars[0];
					// bar : 最后一个元素。
					bar = bars.pop();
					bars.end = bars.at(-1).end;
					bars.weight -= bar.end - bar.start;
					// 重建新的 bar。
					(bars = [ bar ]).weight -= bar.end - bar.start;
					bars.end = bar.end;
					// 置入最后欲回传的阶层。
					layer.push(bars = [ bars ]);
					// reset
					bar = null;
				}

				// 取 bar 之 end 最接近 object.start 者。
				var
				// 最接近间距。
				closest_gap = Infinity,
				// 最接近之 bar index。
				closest_index = undefined;

				bars.forEach(function(bar, i) {
					var gap = start - bar.end;
					if (gap === 0 || 0 < gap && (
					// TODO: comparator()
					closest_index === undefined
					//
					|| gap < end - start ? gap < closest_gap
					// 当 gap 极大时，取不同策略。
					: bar.end - bar.start - gap
					//
					< bars[closest_index].end - bars[closest_index].start
					//
					- closest_gap)) {
						closest_gap = gap;
						closest_index = i;
					}
				});

				if (closest_index !== undefined)
					bar = bars[closest_index];

			} else {
				settle(true);
				bar = bars[0];
			}

			// start = 本 object 之 weight。
			start = end - start;
			// 将本 object 加入 bars 中。
			if (bar) {
				bar.push(object);
				bar.weight += start;
			} else {
				// 初始化。
				bars.push(bar = [ object ]);
				bar.weight = start;
			}
			bar.end = end;

			if (all_end < end)
				all_end = end;
		});

		settle();
		layer[start_key] = sorted_array[0][start_key];
		layer[end_key] = all_end;

		return layer;
	}

	// TODO: comparator
	// sorted_array: sorted by .[start_key]
	function order_bar_another_type(sorted_array, start_key, end_key) {
		if (sorted_array.length === 0)
			return [];

		if (!start_key)
			start_key = 'start';
		if (!end_key)
			end_key = 'end';

		var bars = [], all_end = -Infinity,
		// 最后欲回传的阶层。
		layer = [ [] ];

		function settle() {
			if (bars.length > 0) {
				// clear. 结清。
				// 写入/纪录阶层序数。

				var layer_now;

				if (bars.length === 1) {
					layer_now = layer[0];
					bars[0].forEach(function(object) {
						layer_now.push(object);
					});

				} else {
					// sort 前一区间。
					// TODO: 若有接续前后者的，酌加权重。
					bars.sort(function(a, b) {
						// 大→小。
						return b.weight - a.weight;
					});

					bars.forEach(function(bar, i) {
						layer_now = layer[i];
						if (!layer_now)
							layer_now = layer[i] = [];
						bar.forEach(function(object) {
							layer_now.push(object);
						});
					});
				}

				// reset
				bars = [];
			}
		}

		sorted_array.forEach(function(object) {
			var bar,
			//
			start = object[start_key], end = object[end_key];

			if (start < all_end) {
				// 有重叠。
				// 取 bar 之 end 最接近 object.start 者。
				var
				// 最接近间距。
				closest_gap = Infinity,
				// 最接近之 bar index。
				closest_index = undefined;

				bars.forEach(function(bar, i) {
					var gap = start - bar.end;
					if (gap < closest_gap && 0 <= gap) {
						closest_gap = gap;
						closest_index = i;
					}
				});

				if (closest_index !== undefined)
					bar = bars[closest_index];

			} else
				settle();

			// start = 本 object 之 weight。
			start = end - start;
			// 将本 object 加入 bars 中。
			if (bar) {
				bar.push(object);
				bar.weight += start;
			} else {
				// 初始化。
				bars.push(bar = [ object ]);
				bar.weight = start;
			}
			bar.end = end;

			if (all_end < end)
				all_end = end;
		});

		settle();

		return layer;
	}

	// ---------------------------------------------------------------------//

	// 时期/时段 class。
	function Period(start, end) {
		// {Integer}
		this.start = start;
		// {Integer}
		this.end = end;
		// this.sub[sub Period name] = sub Period
		this.sub = Object.create(null);
		// 属性值 attributes
		// e.g., this.attributes[君主名] = {String}君主名
		this.attributes = Object.create(null);

		// .name, .parent, .level: see Period.prototype.add_sub()

		// 阶层序数: 0, 1, 2..
		// see get_periods()
		// this.bar = [ [], [], ..];
	}

	Period.is_Period = function(value) {
		return value.constructor === Period;
	};

	Period.prototype.add_sub = function(start, end, name) {
		var sub;
		if (typeof start === 'object' && start.start) {
			sub = start;
			name = end;
		} else
			sub = new Period(start, end);

		if (!name)
			name = sub.name;

		// 若子 period/era 之时间范围于原 period (this) 外，
		// 则扩张原 period 之时间范围，以包含本 period/era。
		if (!(this.start <= sub.start))
			this.start = sub.start;
		if (!(sub.end <= this.end))
			this.end = sub.end;

		this.sub[name] = sub;
		// {String}
		sub.name = name;
		sub.parent = this;
		sub.level = (this.level | 0) + 1;
		// return this;
		return sub;
	};

	Period.prototype.toString = function(type) {
		var name = this.name;
		if (!name)
			name = '[class Period]';
		else if (type === WITH_PERIOD) {
			append_period(this, name = [ name ]);
			name = name.join('');
		}
		return name;
	};

	// ---------------------------------------------------------------------//
	// 处理农历之工具函数。

	/**
	 * 正规化名称，尽量将中文数字、汉字数字转为阿拉伯数字。
	 * 
	 * @param {String}number_String
	 *            中文数字。
	 * 
	 * @returns {String}数字化名称
	 */
	function normalize_number(number_String) {
		number_String = String(number_String).trim()
		//
		.replace(/([十廿卅])有/g, '$1')
		// ㋀㋁㋂㋃㋄㋅㋆㋇㋈㋉㋊㋋
		.replace(/[㋀-㋋]/g, function($0) {
			return ($0.charCodeAt(0) - START_INDEX_0月) + '月';
		})
		// ㏠㏡㏢㏣㏤㏥㏦㏧㏨㏩㏪㏫㏬㏭㏮㏯㏰㏱㏲㏳㏴㏵㏶㏷㏸㏹㏺㏻㏼㏽㏾
		.replace(/[㏠-㏾]/g, function($0) {
			return ($0.charCodeAt(0) - START_INDEX_0日) + '日';
		});

		return library_namespace.Chinese_numerals_Formal_to_Normal(
		// "有": e.g., 十有二月。
		library_namespace.normalize_Chinese_numeral(number_String));
	}

	// 处理 square symbols
	// http://unicode.org/cldr/utility/list-unicodeset.jsp?a=[%E3%8B%80-%E3%8B%8B%E3%8F%A0-%E3%8F%BE%E3%8D%98-%E3%8D%B0]
	var START_INDEX_0月 = '㋀'.charCodeAt(0) - 1, START_INDEX_0日 = '㏠'
			.charCodeAt(0) - 1, START_INDEX_0时 = '㍘'.charCodeAt(0);

	/**
	 * 正规化日期名称，尽量将中文数字、汉字数字转为阿拉伯数字。
	 * 
	 * @param {String}number_String
	 *            中文数字年/月/日。
	 * 
	 * @returns {String}数字化日期名称
	 */
	function numeralize_date_name(number_String, no_alias) {
		if (!number_String)
			return number_String === 0 ? 0 : '';

		number_String = String(number_String).trim();

		// 处理元年, [闰闰]?[正元]月, 初日
		if (!no_alias)
			number_String = number_String.replace(/^初/, '')
			// 初吉即阴历初一朔日。
			.replace(/[正元吉]$/, 1)
			// TODO: 统整月令别名。
			.replace(/冬$/, 10).replace(/腊$/, 11)
			// e.g., '前104' (年) → -104
			.replace(/^前/, '-');
		else if (/正$/.test(number_String))
			// 最起码得把会当作数字的处理掉。
			return number_String;

		return POSITIONAL_DATE_NAME_PATTERN.test(number_String)
		//
		? library_namespace.from_positional_Chinese_numeral(number_String)
		//
		: library_namespace.from_Chinese_numeral(number_String);
	}

	/**
	 * 正规化时间名称，尽量将中文数字、汉字数字转为阿拉伯数字。
	 * 
	 * 至顺治二年（公元1645年）颁行时宪历后，改为日96刻，每时辰八刻（初初刻、初一刻、初二刻、初三刻、正初刻、正一刻、正二刻、正三刻）。自此每刻15分，无「四刻」之名。
	 * 
	 * @param {String}time_String
	 *            中文数字时间。
	 * 
	 * @returns {String}数字化时间名称
	 */
	function numeralize_time(time_String) {
		time_String = String(time_String).trim()
		// 时刻 to hour
		.replace(时刻_PATTERN, function($0, 时, 初正, 刻) {
			return (2
			//
			* library_namespace.BRANCH_LIST.indexOf(时)
			//
			- (初正 === '初' ? 1 : 0)) + '时'
			//
			+ (刻 && (刻 = isNaN(刻)
			//
			? '初一二三'.indexOf(刻) : +刻) ? 15 * 刻 + '分' : '');
		});

		// ㍘㍙㍚㍛㍜㍝㍞㍟㍠㍡㍢㍣㍤㍥㍦㍧㍨㍩㍪㍫㍬㍭㍮㍯㍰
		time_String.replace(/[㍘-㍰]/g, function($0) {
			return ($0.charCodeAt(0) - START_INDEX_0时) + '时';
		});

		return time_String;
	}

	/**
	 * 检查是否可能是日数。
	 * 
	 * @param {String}string
	 *            欲检查之字串。
	 * 
	 * @returns {Boolean}可能是日数。
	 */
	function maybe_month_days(string) {
		// 因为得考虑月中起始的情况，因此只检查是否小于最大可能之日数。
		return string <= MAX_MONTH_DAYS;
	}

	// 解压缩日数 data 片段。
	function extract_calendar_slice(calendar_data_String, date_name, 闰月名) {
		if (maybe_month_days(calendar_data_String))
			return [ date_name, calendar_data_String ];

		var calendar_data = calendar_data_String
		// TODO: 除此 .split() 之外，尽量不动到这些过于庞大的资料…戯言。
		// http://jsperf.com/chunk-vs-slice
		// JavaScript 中 split 固定长度比 .slice() 慢。
		.match(CALENDAR_DATA_SPLIT_PATTERN),
		//
		calendar_data_Array = [], initial_month = date_name || '';

		if (initial_month.includes('/')) {
			initial_month = initial_month.split('/');
			// 须考虑特殊情况。
			if (initial_month.length === 2 && !initial_month[0])
				// e.g., '/2': should be 1/1/2.
				initial_month = null;
			else
				// 一般情况。 e.g., 2/3/4, 2/3
				initial_month = initial_month[1];
		}
		// assert: initial_month && typeof initial_month === 'string'

		if (calendar_data.length === 0) {
			library_namespace.error('extract_calendar_slice: 无法辨识日数资料 ['
					+ calendar_data_String + ']！');
			return [ date_name, calendar_data_String ];
		}

		calendar_data.forEach(function(year_data) {
			year_data = parseInt(year_data, PACK_RADIX).toString(RADIX_2)
					.slice(1);

			var year_data_Array = [], leap_month_index, leap_month_index_list;

			// LUNISOLAR_MONTH_COUNT 个月 + 1个闰月 = 13。
			while (year_data.length > LUNISOLAR_MONTH_COUNT + 1) {
				leap_month_index = parseInt(
				// 闰月的部分以 4 (LEAP_MONTH_PADDING.length) 个二进位数字指示。
				year_data.slice(-LEAP_MONTH_PADDING.length), RADIX_2);
				year_data = year_data.slice(0, -LEAP_MONTH_PADDING.length);

				if (leap_month_index_list) {
					library_namespace
							.error('extract_calendar_slice: 本年有超过1个闰月！');
					leap_month_index_list.unshift(leap_month_index);
				} else
					leap_month_index_list = [ leap_month_index ];
			}

			leap_month_index
			// assert: 由小至大。
			= leap_month_index_list
			// 仅取最小的 1个闰月。
			&& leap_month_index_list.sort()[0];

			if (initial_month
			// && initial_month != START_MONTH
			) {
				if (闰月名)
					// 正规化闰月名。
					initial_month = initial_month.replace(闰月名,
							LEAP_MONTH_PREFIX);
				if (initial_month === LEAP_MONTH_PREFIX)
					initial_month += leap_month_index;

				if (initial_month = initial_month.match(MONTH_NAME_PATTERN)) {

					if (initial_month[1]
					//
					|| leap_month_index < initial_month[2]) {
						if (initial_month[1]) {
							if (initial_month[2] != leap_month_index)
								library_namespace
										.error('extract_calendar_slice: 起始闰月次['
												+ initial_month[2]
												+ '] != 日数资料定义之闰月次['
												+ leap_month_index + ']！');
							// 由于已经在起头设定闰月或之后起始，
							// 因此再加上闰月的指示词，会造成重复。
							leap_month_index = null;
						}

						// 闰月或之后起始，须多截1个。
						initial_month[2]++;
					}

					initial_month = initial_month[2] - START_MONTH;

					if (!(0 <= (leap_month_index -= initial_month)))
						leap_month_index = null;

					// 若有起始月分，则会 truncate 到起始月分。
					// 注意：闰月之 index 是 padding 前之资料。
					year_data = year_data.slice(initial_month);

					// 仅能使用一次。
					initial_month = null;
				}
			}
			year_data = to_list(year_data);

			year_data.forEach(function(month_days) {
				year_data_Array.push(
				//
				(leap_month_index === year_data_Array.length
				//
				? LEAP_MONTH_PREFIX + '=' : '') + MONTH_DAYS[month_days]);
			});

			calendar_data_Array.push(year_data_Array
					.join(pack_era.month_separator));
		});

		return [ date_name, calendar_data_Array.join(pack_era.year_separator) ];
	}

	// 解压缩日数 data。
	function extract_calendar_data(calendar_data, era) {
		return calendar_data.replace(历数_PATTERN,
		// replace slice
		function(all, date_name, calendar_data, back) {
			calendar_data = extract_calendar_slice(calendar_data, date_name,
					era && era.闰月名);
			return (calendar_data[0] ? calendar_data.join('=')
					: calendar_data[1])
					+ back;
		});
	}

	// date_Array = [ 年, 月, 日 ]
	function numeralize_date_format(date_Array, numeral) {
		return [ gettext_date.year(date_Array[0], numeral),
				gettext_date.month(date_Array[1], numeral),
				gettext_date.date(date_Array[2], numeral) ];
	}

	function split_era_name(name) {
		if (name = name.trim().match(ERA_PATTERN))
			return {
				朝代 : name[1],
				君主 : name[2],
				// 纪年/其他
				纪年 : name[3],
				// 日期名称
				日期 : name[4]
			};
	}

	// ---------------------------------------------------------------------//

	// 纪年 class。
	function Era(properties, previous) {
		for ( var property in properties)
			this[property] = properties[property];
	}

	// 当纪年名称以这些字元结尾时，接上日期(年月日)时就会多添加上空格。
	// ": "Casper", include [[en:Thai (Unicode block)]]
	var NEED_SPLIT_CHARS = /a-zA-Z\d\-,'"\u0E00-\u0E7F/.source,
	//
	NEED_SPLIT_PREFIX = new RegExp(
	//
	'^[' + NEED_SPLIT_CHARS + ']'),
	//
	NEED_SPLIT_POSTFIX = new RegExp(
	//
	'[' + NEED_SPLIT_CHARS.replace('\\d', '') + ']$'),
	//
	REDUCE_PATTERN = new RegExp('([^' + NEED_SPLIT_CHARS + ']) ([^'
			+ NEED_SPLIT_CHARS.replace('\\d', '') + '])', 'g');

	// 把纪年名称与日期连接起来，并且在有需要的时候添加上空格。
	// 警告: 会改变 name_with_date_Array!
	// @return {String}
	function concat_era_name(name_with_date_Array) {
		name_with_date_Array.forEach(function(slice, index) {
			var _slice = String(slice).trim();
			if (index > 0 && NEED_SPLIT_PREFIX.test(_slice)
			//
			&& NEED_SPLIT_POSTFIX.test(name_with_date_Array[index - 1])) {
				// 为需要以 space 间隔之纪元名添加 space。
				_slice = ' ' + _slice;
			}
			if (_slice !== slice)
				name_with_date_Array[index] = _slice;
		});
		return name_with_date_Array.join('');
	}

	// remove needless space in the era name
	function reduce_era_name(name) {
		return name.trim()
		// 去除不需要以 space 间隔之纪元名中之 space。
		.replace(REDUCE_PATTERN, '$1$2');
	}

	// <a
	// href="http://big5.huaxia.com/zhwh/wszs/2009/12/1670026.html"
	// accessdate="2013/5/2 19:46">《中国历史纪年表》解惑</a>
	// 谥号纪年的方法是：国号——帝王谥号——年号(无年号者不用)——年序号，如汉惠帝五年，梁武帝大同八年。
	// 自唐朝开始，改纪年方式为国号——帝王庙号——年号——年序号。如唐高宗永徽四年，清世宗雍正八年等。
	function get_era_name(type) {
		var name = this.name;
		if (type === SEARCH_STRING)
			// 搜寻时，纪年显示方法："纪年 (朝代君主(帝王), 国家)"
			// e.g., "元始 (西汉平帝刘衍, 中国)"
			return name[纪年名称索引值.纪年] + ' (' + (name[纪年名称索引值.朝代] || '')
					+ (name[纪年名称索引值.君主] || '') + ', ' + name[纪年名称索引值.国家] + ')';

		if (!name.cache) {
			// 基本上不加国家名称。
			// name → [ 朝代, 君主, 纪年 ]
			name = name.slice(0, 3).reverse();

			// 对重复的名称作适当简略调整。
			if (name[0] && name[0].includes(name[2])
			//
			|| name[1] && name[1].includes(name[2]))
				name[2] = '';
			if (name[1]) {
				// 处理如周诸侯国之类。
				// 例如 鲁国/鲁昭公 → 鲁昭公
				var matched = name[0].match(国_PATTERN);
				if (name[1].startsWith(matched ? matched[1] : name[0]))
					name[0] = '';
			}

			if (type === WITH_PERIOD)
				append_period(this, name);

			this.name.cache = reduce_era_name(name.join(' '));
			name = this.name;
		}

		return type === WITH_COUNTRY ? [ this.name[纪年名称索引值.国家], name.cache ]
				: name.cache;
	}

	// ---------------------------------------
	// 月次，岁次或名称与序号 (index) 之互换。

	// 岁序(index: start from 0)
	// →岁次(ordinal/serial/NO № #序数: start with START_YEAR)
	// →岁名(name)
	function year_index_to_name(岁序) {
		var 岁名 = this.calendar[NAME_KEY];
		if (!岁名 || !(岁名 = 岁名[岁序])) {
			岁名 = 岁序 + (START_KEY in this.calendar
			//
			? this.calendar[START_KEY] : START_YEAR);
			if (this.skip_year_0 && 岁名 >= 0)
				岁名++;
		}
		return 岁名;
	}

	// (岁名 name→)
	// 岁次(ordinal/serial/NO: start with START_YEAR)
	// →岁序(index of year[]: start from 0)
	function year_name_to_index(岁名) {
		if (!岁名)
			return;

		var 岁序 = this.calendar[NAME_KEY];
		if (!岁序 || (岁序 = 岁序.indexOf(岁名)) === NOT_FOUND) {
			岁名 = numeralize_date_name(岁名);

			if (isNaN(岁名)) {
				// 可能只是 to_era_Date() 在作测试，看是否能成功解析。
				if (library_namespace.is_debug())
					library_namespace.error(
					//
					'year_name_to_index: 纪年 [' + this + '] '
					//
					+ (岁序 ? '没有[' + 岁名 + ']年！' : '不具有特殊名称设定！'));
				return;
			}

			if (this.skip_year_0 && 岁名 > 0)
				岁名--;

			岁序 = 岁名 - (START_KEY in this.calendar
			//
			? this.calendar[START_KEY] : START_YEAR);
		}
		return 岁序;
	}

	// 月序(index: start from 0)
	// →月次(ordinal/serial/NO: start with START_MONTH)
	// →月名(name)
	function month_index_to_name(月序, 岁序) {
		岁序 = this.calendar[岁序];
		var 月名 = 岁序[NAME_KEY];
		// 以个别命名的月名为第一优先。
		if (!月名 || !(月名 = 月名[月序])) {
			月名 = 月序 + (START_KEY in 岁序 ? 岁序[START_KEY] : START_MONTH);

			if (this.岁首序 && (月名 += this.岁首序) > LUNISOLAR_MONTH_COUNT)
				月名 -= LUNISOLAR_MONTH_COUNT;
		}

		// 依 month_index_to_name() 之演算法，
		// 若为闰月起首，则 [START_KEY] 须设定为下一月名！
		// e.g., 闰3月起首，则 [START_KEY] = 4。
		if (月序 >= 岁序[LEAP_MONTH_KEY]) {
			if (!isNaN(月名) && --月名 < START_MONTH)
				// 确保月数为正。
				月名 += LUNISOLAR_MONTH_COUNT;
			if (月序 === 岁序[LEAP_MONTH_KEY]) {
				// 是为闰月。
				月名 = (this.闰月名 || LEAP_MONTH_PREFIX) + 月名;
			}
		}
		return 月名;
	}

	// (月名 name→)
	// 月次(ordinal/serial/NO: start with START_MONTH)
	// →月序(index of month[]: start from 0)
	function month_name_to_index(月名, 岁序) {
		if (!月名 || !(岁序 in this.calendar))
			return;

		var is_闰月, 岁_data = this.calendar[岁序], 月序 = 岁_data[NAME_KEY],
		// (闰月序) 与 [LEAP_MONTH_KEY] 皆为 (index of month[])！
		// 若当年 .start = 3，并闰4月，则 (闰月序 = 2)。
		闰月序 = 岁_data[LEAP_MONTH_KEY];

		if (!月序 || (月序
		// 以个别命名的月名为第一优先。
		= 月序.indexOf(numeralize_date_name(月名, true))) === NOT_FOUND) {

			月名 = String(numeralize_date_name(月名));

			if (this.闰月名)
				// 正规化闰月名。
				月名 = 月名.replace(this.闰月名, LEAP_MONTH_PREFIX);

			if (!isNaN(is_闰月 = this.岁首序))
				月名 = 月名.replace(/\d+/, function(month) {
					if ((month -= is_闰月) < 1)
						month += LUNISOLAR_MONTH_COUNT;
					return month;
				});

			if (月名 === LEAP_MONTH_PREFIX) {
				if (isNaN(月序 = 闰月序)) {
					// 可能只是 to_era_Date() 在作测试，看是否能成功解析。
					if (library_namespace.is_debug())
						library_namespace.warn(
						//
						'month_name_to_index: 纪年 [' + this + '] 之 ['
								+ this.岁名(岁序) + ']年没有闰月！');
					return;
				}

			} else if ((月序 = String(numeralize_date_name(月名)))
			// 直接用 String(numeralize_date_name(月名)).match()
			// 在 Chrome 中可能造成值为 null。
			// e.g., 北魏孝武帝永兴1年12月 历谱
			&& (月序 = 月序.match(MONTH_NAME_PATTERN))) {
				is_闰月 = 月序[1];
				月序 = 月序[2] - (START_KEY in 岁_data
				//
				? 岁_data[START_KEY] : START_MONTH);
				// 闰月或之后，月序++。
				if (is_闰月 || 月序 >= 闰月序)
					月序++;

				if (is_闰月 && 月序 !== 闰月序) {
					// 可能只是 to_era_Date() 在作测试，看是否能成功解析。
					if (library_namespace.is_debug())
						library_namespace.warn(
						//
						'month_name_to_index: 纪年 [' + this + '] 之 ['
								+ this.岁名(岁序) + ']年没有 [' + 月名 + ']月'
								+ (闰月序 ? '，只有' + this.月名(闰月序, 岁序) + '月' : '')
								+ '！');
					return;
				}

			} else {
				// 可能只是 to_era_Date() 在作测试，看是否能成功解析。
				if (library_namespace.is_debug())
					library_namespace.warn('month_name_to_index: 纪年 ['
							+ this
							+ '] 之 ['
							+ this.岁名(岁序)
							+ ']年'
							+ (岁_data[NAME_KEY] ? '不具有特殊月分名称设定！' : '没有月分名称['
									+ 月名 + ']！'));
				return;
			}
		}

		return 月序;
	}

	// 日序转成日名。
	// [ 日名, 月名, 岁名 ]
	function date_index_to_name(日序, 月序, 岁序, 日序_only) {
		if (月序 < 0 || this.calendar[岁序].length <= 月序)
			if (月序 = this.shift_month(月序, 岁序)) {
				岁序 = 月序[1];
				月序 = 月序[0];
			} else
				return;

		日序 += 月序 === 0 && (START_DATE_KEY in this.calendar[岁序])
		// 若当年首月有设定起始日名/起始日码，则使用之。
		? this.calendar[岁序][START_DATE_KEY]
		// 不采 this.calendar[START_DATE_KEY]
		// : 月序 === 0 && 岁序 === 0 && (START_DATE_KEY in this.calendar)
		//
		// ? this.calendar[START_DATE_KEY]
		//
		: START_DATE;

		return 日序_only ? 日序 : [ 日序, this.月名(月序, 岁序), this.岁名(岁序) ];
	}

	// 日名转成日序。
	function date_name_to_index(日名, 首月采用年序) {
		if (!isNaN(日名
		//
		= numeralize_date_name(日名))) {
			// 不采 this.calendar[START_DATE_KEY]
			日名 -= ((首月采用年序 in this.calendar)
			//
			&& (START_DATE_KEY in (首月采用年序 = this.calendar[首月采用年序]))
			//
			? 首月采用年序[START_DATE_KEY] : START_DATE);
		}
		return 日名;
	}

	// 取得 (岁序)年，与 (月数) 个月之后的月序与岁序。
	function shift_month(月数, 岁数, 基准月) {
		if (Array.isArray(月数))
			基准月 = 月数, 月数 = 岁数 = 0;
		else {
			if (isNaN(月数 |= 0))
				月数 = 0;
			if (Array.isArray(岁数))
				基准月 = 岁数, 岁数 = 0;
			else {
				if (isNaN(岁数 |= 0))
					岁数 = 0;
				if (!Array.isArray(基准月))
					基准月 = [ 0, 0 ];
			}
		}

		// 基准月: [ 月序, 岁序, 差距月数 ]
		var 月序 = (基准月[0] | 0) + 月数,
		//
		岁序 = 基准月[1] | 0,
		//
		差距月数 = (基准月[2] | 0) + 月数;

		if (岁数 > 0)
			while (岁数 > 0 && 岁序 < this.calendar.length)
				岁数--, 差距月数 += this.calendar[岁序++].length;
		else
			while (岁数 < 0 && 岁序 > 0)
				岁数++, 差距月数 -= this.calendar[岁序--].length;

		if (月序 > 0)
			while (true) {
				if (岁序 >= this.calendar.length) {
					if (library_namespace.is_debug())
						// 可能是孝徳天皇之类，期间过短，又尝试
						// get_month_branch_index()
						// 的。
						library_namespace.error('shift_month: 已至 [' + this
								+ '] 历数结尾，无可资利用之月分资料！');
					差距月数 = NaN;
					岁序--;
					break;
				}
				月数 = this.calendar[岁序].length;
				if (月序 < 月数)
					break;
				岁序++;
				月序 -= 月数;
			}
		else
			while (月序 < 0) {
				if (--岁序 < 0) {
					if (library_namespace.is_debug())
						library_namespace.error('shift_month: 已至 [' + this
								+ '] 历数起头，无可资利用之月分资料！');
					差距月数 = NaN;
					岁序 = 0;
					break;
				}
				月序 += this.calendar[岁序].length;
			}

		基准月[0] = 月序;
		基准月[1] = 岁序;
		基准月[2] = 差距月数;
		return !isNaN(差距月数) && 基准月;
	}

	// date index of era → Date
	function date_index_to_Date(岁序, 月序, 日序, strict) {
		if (!this.shift_month(岁序 = [ 月序, 岁序 ]))
			return;
		// 差距日数
		月序 = 岁序[0];
		岁序 = 岁序[1];
		日序 |= 0;

		var date = this.year_start[岁序],
		//
		i = 0, calendar = this.calendar[岁序];
		// TODO: use Array.prototype.reduce() or other method
		for (; i < 月序; i++)
			日序 += calendar[i];

		date += 日序 * ONE_DAY_LENGTH_VALUE;
		if (strict && this.end - date < 0)
			// 作边界检查。
			return;
		return new Date(date);
	}

	/**
	 * parse date name of calendar data.
	 * 
	 * @param {String}date_name
	 *            date name
	 * @returns [ 年名, 月名, 起始日码 ]
	 */
	function parse_calendar_date_name(date_name) {
		if (!date_name)
			return [];

		// matched: [ , 年, 月, 日 ]
		var matched = date_name.match(/^\/(\d+)$/);
		date_name = matched ? [ , , matched[1] ]
		//
		: (matched = date_name.match(起始日码_PATTERN)) ? matched.slice(1)
				: date_name.split('/');
		// 得考虑有特殊月名的情况，因此不可采
		// (name === LEAP_MONTH_PREFIX ||
		// MONTH_NAME_PATTERN.test(name))
		// 之类的测试方式。
		if (date_name.length === 1)
			// 月名
			date_name = [ , date_name[0] ];
		if (date_name.length > 3)
			library_namespace.warn('parse_calendar_date_name: 日码 ['
					+ date_name.join('/') + '].length = ' + date_name.length
					+ '，已过长！');

		date_name.forEach(function(name, index) {
			date_name[index] = numeralize_date_name(name);
		});

		// 正规化月名。
		if ((matched = date_name[1]) && typeof matched === 'string')
			if (matched = matched.match(MONTH_NAME_PATTERN))
				// 去空白与"月"字。
				date_name[1] = (matched[1] || '') + matched[2];
			else if (library_namespace.is_debug()
					&& date_name[1] !== LEAP_MONTH_PREFIX)
				library_namespace.warn(
				//
				'parse_calendar_date_name: 特殊月名: [' + date_name[1] + ']');

		return date_name;
	}

	function clone_year_data(year_data, clone_to) {
		if (!clone_to)
			clone_to = year_data.slice();
		[ START_KEY, LEAP_MONTH_KEY
		// , NAME_KEY
		]
		//
		.forEach(
		// 复制本年之月 START_KEY, LEAP_MONTH_KEY 等。
		function(key) {
			if (key in year_data) {
				var value = year_data[key];
				clone_to[key] = Array.isArray(value) ? value.slice() : value;
			}
		});
		return clone_to;
	}

	// 需在设定完个别 this_year_data 之月名后，才作本纪年泛用设定。
	function add_month_name(月名_Array, this_year_data) {
		var name_Array = this_year_data[NAME_KEY],
		//
		leap = this_year_data[LEAP_MONTH_KEY], start;
		if (start = this_year_data[START_KEY])
			start -= START_MONTH;
		else
			start = 0;

		if (!Array.isArray(name_Array))
			if (isNaN(leap)) {
				if (Array.isArray(月名_Array)) {
					// this_year_data = clone_year_data(this_year_data);
					this_year_data[NAME_KEY] = start ? 月名_Array.slice(start)
							: 月名_Array;
				}
				return;
			} else {
				// this_year_data = clone_year_data(this_year_data);
				name_Array = this_year_data[NAME_KEY] = [];
			}

		月名_Array.forEach(function(名, index) {
			if (0 <= (index -= start)) {
				if (leap <= index) {
					if (leap === index && !(index in name_Array)
							&& 月名_Array[index + start - 1])
						name_Array[index]
						// 闰月使用上一 index 月名。
						= 月名_Array[index + start - 1];
					// index 为闰月或之后，则使用在下一 index 之月名。
					index++;
				}
				// 不作覆盖。
				if (名 && !(index in name_Array))
					name_Array[index] = 名;
			}
		});
	}

	function is_正统(era, key) {
		// assert: era.正统 === undefined || typeof era.正统 === 'string' ||
		// Array.isArray(era.正统)
		return era.正统 && (era.正统 === true
		// 采用"正统"方法，可避免某些情况下因「挑选最后结束之纪年」之演算法，造成最后无可供参照之纪年。
		// 但这需要手动测试每一种参照 key，并依测试结果添加。非万全之道。
		|| key && era.正统.includes(key));
	}

	var important_properties = {
		精 : true,
		准 : true,
		历法 : true
	};
	// 复制当前参照纪年之重要属性至本纪年。
	// 注意: 由于这会在 initialize_era_date()，产生历谱时才会执行，
	// 因此像是展示线图时并不具有这些属性。若纪年本身没设定非准确属性，则会当作准确纪年来显示。
	function copy_important_properties(from_era, to_era) {
		for ( var property in important_properties) {
			if (!(property in from_era)) {
				continue;
			}
			var value = from_era[property];
			if (property in to_era) {
				// 可能是本纪年自己的，可能是从其他参照纪年获得的。
				if (to_era[property] !== value
						&& important_properties[property]) {
					library_namespace.warn('copy_important_properties: '
							+ '纪年 [' + to_era + '] 原有重要属性 [' + property
							+ '] 为"' + to_era[property] + '"，与所参照纪年 ['
							+ from_era + '] 之属性值"' + value + '" 不同！');
				}
				continue;
			}
			library_namespace.debug('复制当前参照纪年之重要属性 [' + property + '] = '
					+ value, 1, 'copy_important_properties');
			to_era[property] = value;
		}
	}

	// parse_era() 之后，初始化/parse 纪年之月分日数 data。
	// initialize era date.
	function initialize_era_date() {
		// IE 需要 .getTime()：IE8 以 new Date(Date object) 会得到 NaN！
		var days,
		/**
		 * {Date}本纪年的起始时间。
		 */
		start_time = this.start.getTime(),
		// 当前年分之各月资料 cache。calendar_data[this year]。
		this_year_data,
		//
		纪年历数 = this.calendar, this_end = this.end.getTime(),

		// 最后将作为 this.year_start 之资料。
		year_start_time = [ start_time ],
		// 最后将作为 this.calendar 之资料。
		// (年/月分资料=[年分各月资料/月分日数])[NAME_KEY]=[年/月分名称],
		// [START_KEY] = start ordinal,
		// [LEAP_MONTH_KEY] = leap month index.
		calendar_data = [],

		//
		年序, 月序;

		start_time = new Date(start_time);

		// ---------------------------------------

		if (!纪年历数 || typeof 纪年历数 !== 'string') {
			library_namespace.error('initialize_era_date: 无法辨识历数资料！');
			return;
		}

		if ((月序 = 纪年历数.match(参照_PATTERN))
		// [ 纪年历数, 起始日期名, 所参照之纪年或国家 ]
		&& ((年序 = 月序[2]) in search_index
		//
		|| (年序 in String_to_Date.parser
		//
		&& 年序 in Date_to_String_parser))) {
			var 历法 = 年序,
			// [ 年名, 月名, 起始日码 ]
			date_name = parse_calendar_date_name(月序[1]);
			library_namespace.debug(this + ': 参照纪年或国家 [' + 历法 + '] 之历数。', 2);

			// 处理纪年历数所设定之起始年名：基本上仅允许年分不同。
			// 其他月名，日数皆得与起讫时间所设定的相同。
			// 年名应可允许 '0' 与负数。
			if (date_name[0] !== '' && !isNaN(date_name[0])
			//
			&& (date_name[0] |= 0) !== START_YEAR)
				// 复制本年之 START_KEY。
				calendar_data[START_KEY] = date_name[0];

			if (历法 in search_index) {
				// ---------------------------------------

				/**
				 * e.g., test: <code>

				CeL.era.set('古历|-60~1230|-61/=:中国');
				CeL.era('古历9年');

				 * </code>
				 * 
				 * <code>

				CeL.set_debug(6);
				CeL.era.set('古历|Egyptian:-571/11~-570|:Egyptian|准=年');

				CeL.Log.clear();
				CeL.era('古历2年1月').format({parser:'CE',format:'%Y/%m/%d'});

				 * </code>
				 */

				// CeL.era.set('古历|-60~80|-60/=:中国');CeL.era('古历1年');
				// CeL.era.set('古历|25/2/17~27|:中国');CeL.era('古历1年');
				// CeL.era.set('古历|-60~1230|-61/=:中国');CeL.era('古历249年');
				// CeL.era.set('古历|-57~-48|-58/=:中国');//CeL.era('古历-58年');
				// CeL.era.set('古历|-54~-48|-55/=:中国');//CeL.era('古历-55年');
				// n='古历',sy=-55;CeL.era.set(n+'|'+(sy+1)+'~'+(sy+10)+'|'+sy+'/=:中国');//CeL.era(n+sy+'年');
				// CeL.era.set('古历|901~1820|900/=:中国');
				// CeL.era('古历54年1月').format({parser:'CE',format:'%Y/%m/%d'});
				// CeL.era.dates('古历901年',{year_limit:2000,date_only:true});
				this.参照纪年 = 历法;

				var tmp,
				// 所有候选纪年。
				// assert: 不会更动到候选纪年之资料。
				era_Array = [],

				// 当前参照之纪年。
				era,
				// 当前参照纪年之 date 指标。
				date_index,
				// era_year_data: 当前参照纪年之当前年分各月资料。
				era_year_data,
				// for lazy evaluation.
				correct_month_count,
				// 校正 this_year_data 之月份数量:
				// 参照纪元引入的可能只能用到 10月，但却具足了到 12月的资料。
				// 此时需要先将后两个月的资料剔除，再行 push()。
				// tested:
				// 百济汾西王1年
				// 成汉太宗建兴1年
				// 新罗儒礼尼师今7年
				correct_month = function(月中交接) {
					// 参照纪元 era 之参照月序。
					var era_month =
					// 参考 month_name_to_index()
					(era_year_data[START_KEY] || START_MONTH) + 月序;
					if ((LEAP_MONTH_KEY in era_year_data)
					//
					&& era_year_data[LEAP_MONTH_KEY] < 月序)
						era_month--;

					var month_diff
					//
					= (this_year_data[START_KEY] || START_MONTH)
					// 当前月序
					+ this_year_data.length;
					if ((LEAP_MONTH_KEY in this_year_data)
					//
					&& this_year_data[LEAP_MONTH_KEY] < month_diff)
						month_diff--;

					if (月中交接
					// 之前已经有东西，并非处在第一个月，「月中交接」才有意义。
					&& this_year_data.length > 0)
						month_diff--;

					// 减去参照纪元 era 之参照月序
					month_diff -= era_month;

					if (!library_namespace.is_debug())
						return;

					if (month_diff > 0) {
						library_namespace.debug('引入 [' + era + '] 前，先删掉年序 '
								+ (calendar_data.length - 1) + ' 之 '
								+ month_diff + ' 个月份。 ('
								+ this_year_data.length + ' - ' + month_diff
								+ ')', 1, 'initialize_era_date.correct_month');
						this_year_data.length -= month_diff;
					} else if (month_diff === -1 ?
					// 若是当前 this_year_data 的下一个月为闰月，
					// 亦可能出现 (month_diff = -1) 的情况。
					// 这时得避免乱喷警告。
					era_year_data[LEAP_MONTH_KEY] !== 月序
					//
					|| this_year_data[LEAP_MONTH_KEY] >= 0
					//
					&& this_year_data[LEAP_MONTH_KEY]
					//
					!== this_year_data.length :
					// 差太多了。
					month_diff < -1)
						library_namespace.warn(
						//
						'initialize_era_date.correct_month: 建构途中之历数资料，与当前正欲参照之纪元 ['
								+ era + '] 间，中断了 ' + (-month_diff) + ' 个月份！');
				},
				// 当无须改变最后一年历数，例如已在年尾时，不再复制。
				clone_last_year = function(月中交接) {
					if (!correct_month_count) {
						correct_month(月中交接);
						return;
					}

					var tmp = calendar_data.length - 1;
					if (calendar_data[tmp][COUNT_KEY]) {
						this_year_data = calendar_data[tmp];
						this_year_data.length
						//
						= this_year_data[COUNT_KEY]
						//
						+= correct_month_count;

						correct_month(月中交接);
						return;
					}

					tmp = calendar_data.pop();
					calendar_data.push(this_year_data
					// 初始化本年历数。
					= tmp.slice(0, correct_month_count));
					this_year_data[COUNT_KEY] = correct_month_count;
					if (tmp.月名)
						this_year_data.月名 = tmp.月名
								.slice(0, correct_month_count);

					clone_year_data(tmp, this_year_data);
					// 复制 era 之[NAME_KEY]。
					if (NAME_KEY in tmp)
						this_year_data[NAME_KEY] = tmp[NAME_KEY].slice(0,
								correct_month_count);

					// 去除标记。
					correct_month_count = null;

					correct_month(月中交接);
				},
				// 处理月中换日的情况，复制本年本月之月分名称与本月日数。
				copy_date = function(本月日数) {
					var 月名 = era_year_data[NAME_KEY];
					if (月名 && (月名 = 月名[月序])) {
						if (!(NAME_KEY in this_year_data))
							// 初始化本年之月分名称。
							this_year_data[NAME_KEY] = [];
						library_namespace.debug(
						//
						'复制本年本月之月分名称。月序' + 月序 + '，本月现有 '
						//
						+ this_year_data.length + '个月。', 3);
						this_year_data[NAME_KEY][
						//
						this_year_data.length] = 月名;
					}

					this_year_data.push(本月日数);
					// 本月已处理完，将月序指向下一个月。
					月序++;
				};

				// 初始化:取得所有候选纪年列表。
				tmp = start_time.getTime();
				for_each_era_of_key(历法, function(era) {
					if (// era !== this &&
					era.start - this_end < 0
					// 有交集(重叠)才纳入。
					&& tmp - era.end < 0 && (era.year_start
					// 筛选合宜的纪年。
					|| !参照_PATTERN.test(era.calendar)))
						era_Array.push(era);
				}
				// .bind(this)
				);

				// sort by era start time.
				era_Array.sort(compare_start_date);
				library_namespace.debug('[' + this + '] 参照纪年 key [' + 历法
						+ ']: 共有 ' + era_Array.length + ' 个候选纪年。', 1,
						'initialize_era_date');
				library_namespace.debug('候选纪年列表: [' + era_Array
				//
				.join('<span style="color:#c50;">|</span>') + ']。', 2,
						'initialize_era_date');

				// 因为 parse_calendar_date_name() 与 .日名()
				// 得到相反次序的资料，因此需要转回来。因为有些项目可能未指定，因此不能用 .reverse()。
				tmp = date_name[0];
				date_name[0] = date_name[2];
				date_name[2] = tmp;

				/**
				 * 参照纪年之演算机制：定 this.year_start 与 this.calendar 之过程。
				 * <dl>
				 * <dt>查找下一参照纪元。</dt>
				 * <dd>优先取用：
				 * <ul>
				 * <li>在(前纪元.end)之时间点，前后纪元之日、月名称相同，或可衔接。</li>
				 * <li>挑选最后结束之纪年，(后纪元.end)越后面者。较后结束的能减少转换次数。<br />
				 * 但这方法在魏蜀吴会出问题。以采用"正统"方法回避。</li>
				 * <li>恰好衔接(前纪元.end === 后纪元.start)。否则取用有重叠的部分之纪元。</li>
				 * </ul>
				 * </dd>
				 * <dt>确定交接日序、日名。</dt>
				 * <dt>处理年中分割，更替时间点不在本年年首的情况。</dt>
				 * <dd>分割点于本月中间而不在首尾，重叠部分本月之日数，以后一使用纪元为准。<br />
				 * 分割点于本年中间之月首，而不在本年首尾。复制本年接下来每月之历数。</dd>
				 * <dt>尽可能以复制参照的方式，复制整年之暦数。</dt>
				 * <dt>若已是最后一个纪年，则表示完成暦数参照。跳出。</dt>
				 * <dt>设定下一轮必要的初始参数，以及正确之月序。</dt>
				 * </dl>
				 * 须考量仅有几日的情形，并尽可能利用原有之历数。
				 */

				// main copy loop
				while (true) {
					/**
					 * 查找下一参照纪元。
					 */

					// 于此，年序作为前后纪元之日、月名称相同，或可衔接之纪元列表。
					年序 = [];
					// 月序作为月名称不同，但日名称相同，或可衔接之纪元列表。
					// 例如改正朔。
					月序 = [];

					// 先从 era_Array[0] 向后找到可衔接或有重叠的任何参照纪元。
					while (era = era_Array.shift()) {
						// 第二轮后，start_time 代表 (前纪元.end)，而非代表 this.start。
						days = era.start - start_time;
						if (library_namespace.is_debug(2)) {
							if (days === 0)
								tmp = 'a44;">恰好衔接';
							else {
								tmp = days / ONE_DAY_LENGTH_VALUE;
								tmp = (days < 0 ? '4a4;">重叠 ' + -tmp
										: '888;">间隔 ' + tmp)
										+ '日';
							}
							library_namespace.debug([
									'测试  / 余 ',
									era_Array.length,
									': ' + era,
									' (<span style="color:#'
									//
									+ tmp + '</span>)',
									' (',
									[
											(era.疑 ? '存在疑问、不准确的纪年' : ''),
											(era.参照历法 ? '参照历法: ' + era.参照历法
													: ''),
											(era.参照纪年 ? '参照纪年: ' + era.参照纪年
													: '') ].filter(function(m) {
										return m;
									}).join(', '), ')' ], 2,
									'initialize_era_date');
						}

						if (days > 0) {
							era_Array.unshift(era);
							break;
						}

						tmp = null;
						if (calendar_data.length === 0
						// test: 后纪元无法转换此 date。
						|| (date_index = era
						// [ 岁序, 月序, 日序 | 0 ]
						.Date_to_date_index(start_time))
						// days === 0: 恰好衔接且无重叠者。无缝接轨。毋须检测。
						&& (days === 0 || (date_name[0]
						// .日名(日序, 月序, 岁序) = [ 日名, 月名, 岁名 ]
						=== (tmp = era.日名(date_index[2],
						// 月日名连续性检测。
						// 检测前后纪元之接续日、月名称相同。是否为同一月内同一日。
						// 主要指本纪元结束时间 (this.end)
						// 在两纪元中之月日名：
						// 从 this.end 开始复制可以最节省资源，不用再重复复制重叠部分。
						date_index[1], date_index[0]))[0] || !date_name[0]
						// 检测月名是否相同。
						? !date_name[1] || date_name[1] === tmp[1]
						// 测试月名称可否衔接。
						: (!date_name[1]
						// 因为 era.end 不一定于 this 范围内，可能刚好在边界上，
						// 因此须作特殊处理。
						|| date_name[1] + 1 === tmp[1]
						// 测试是否为跨年。
						|| (tmp[1] === START_MONTH
						//
						&& (date_name[1] === LUNISOLAR_MONTH_COUNT
						//
						|| date_name[1] === LEAP_MONTH_PREFIX
						//
						+ LUNISOLAR_MONTH_COUNT)))
						// 测试日名称可否衔接。是否为年内换月。
						// era 的 date index 为首日。
						&& tmp[0] === START_DATE
						// 确认 date name 为此月最后一天的后一天。
						// 这边采用的是不严谨的测试:
						// 只要 date name <b>有可能</b>是此月最后一天就算通过。
						&& (date_name[0] === 小月 + 1
						//
						|| date_name[0] === 大月 + 1)))) {
							// 通过检验。
							年序.push([ era, days, date_index ]);

						} else if (tmp && (date_name[0] === tmp[0]
						//
						|| tmp[0] === START_DATE
						// 确认 date name
						// 为此月最后一天的后一天。
						// 这边采用的是不严谨的测试:
						// 只要 date name
						// <b>有可能</b>是此月最后一天就算通过。
						&& (date_name[0] === 小月 + 1
						//
						|| date_name[0] === 大月 + 1))) {
							月序.push([ era, days, date_index ]);

						} else if (tmp || library_namespace.is_debug(3)) {
							library_namespace.debug([ '前后纪元之接续月日名不同！' + this,
									' ', date_name.slice().reverse().join('/'),
									' != ', era.toString(), ' ',
									tmp ? tmp.reverse().join('/') : '(null)' ],
									2, 'initialize_era_date');
						}
					}

					// 仅存在月名称不同，但日名称相同，或可衔接之纪元列表。
					if (年序.length === 0) {
						if (月序.length === 0) {
							var message =
							//
							'initialize_era_date: [' + this + ']: '
							//
							+ (era_Array.length > 0
							//
							? '寻找 [' + 历法 + '] 至 [' + era_Array[0]
							//
							+ ']，中间存在有未能寻得历数之时间段！'
							//
							: '已遍历所有 [' + 历法 + ']纪年，至结尾无可供参照之纪年！');
							// 因为本函数中应初始化本纪年历数，否则之后的运算皆会出问题；
							// 因此若无法初始化，则 throw。

							if (false && era_Array.length > 0)
								throw new Error(message);

							library_namespace.error(message);
							library_namespace.error('改采用标准历法: '
									+ standard_time_parser_name + '，但这将导致['
									+ this + ']解析出错误的日期！');

							message = '因参照纪年[' + this.参照纪年
									+ ']错误，本纪年显示的是错误的日期！';
							// gettext_config:{"id":"note"}
							add_attribute(this, '注', message, true);

							this.calendar = this.calendar.replace(/:.+/g, ':'
									+ standard_time_parser);
							this.initialize();
							return;
						}
						年序 = 月序;
					}

					// 设定指标初始值，将 era 指到最佳候选。首先采用 [0]。
					era = 年序.pop();
					if (年序.length > 0 && is_正统(era[0], 历法))
						// 已是最佳(正统)候选，不用再找下去了。
						年序 = [];
					while (date_index = 年序.pop()) {
						// 寻找最佳候选: 最后结束之纪年。

						// assert: 此时若 (this.start - era[0].start ===
						// era[1] === 0)，
						// 表示 era[0] 与 date_index[0] 有相同之起讫时间。
						if ((tmp = era[0].end - date_index[0].end) < 0
						//
						|| tmp === 0 && date_index[1] === 0) {
							era = date_index;
							if (is_正统(era[0], 历法))
								break;
						}
					}

					/**
					 * 确定交接日序、日名。
					 */
					// [ 岁序, 月序, 日序 | 0 ]
					date_index = era[2]
							|| era[0].Date_to_date_index(start_time);
					library_namespace.debug(
					//
					'交接日序、日名: ' + date_index, 5);
					if (!date_index)
						throw new Error('initialize_era_date: 无法取得 [' + era[0]
								+ ']('
								+ start_time.format(standard_time_format)
								+ ') 的日期名！');
					// 重设 (年序), (月序), (date_index) 作为 era 之指标。
					年序 = date_index[0];
					月序 = date_index[1];
					date_index = date_index[2];

					era = era[0];
					// era_year_data: 当前参照纪年之当前年分各月资料。
					era_year_data = era.calendar[年序];

					if (library_namespace.is_debug())
						library_namespace.info([ 'initialize_era_date: ',
								start_time.format(standard_time_format),
								' 接续参照：', is_正统(era, 历法) ? '<em>['
								// 历法.name.join('/')
								+ 历法 + '] 正统</em> ' : '',
								era.toString(WITH_PERIOD) ]);

					copy_important_properties(era, this);

					if (false
					// && options.check_overleap
					) {
						// TODO: deep check if conflicts
						// 一一检测前后纪元时间重叠的部分历数是否有冲突。
						// also need to check KEYs
					}

					if (calendar_data.length === 0) {
						// first era. 第一轮，从新的参照纪年开始。
						// assert: 应该只有首个纪年会到这边。
						// 初始化本纪元历数 (this.calendar)。

						calendar_data[NAME_KEY] = [];

						// 该 copy 的其他纪年属性全 copy 过来。
						library_namespace.set_method(this, era,
								to_list('岁首序|闰月名'));

						// 复制首年之 START_DATE_KEY。
						tmp = era.日名(date_index, 月序, 年序, true);
						if (tmp !== START_DATE)
							calendar_data[START_DATE_KEY] = tmp;

						if (月序 > 0 || (START_KEY in era_year_data)
						// 有时 era_year_data[START_KEY] === START_MONTH。
						&& era_year_data[START_KEY] !== START_MONTH) {
							// 非首月。
							// assert: this_year_data === undefined
							calendar_data.push(
							// this_year_data 一造出来就在 calendar_data 中。
							this_year_data = []);
							// 参考 month_index_to_name()。
							tmp = 月序 + (era_year_data[START_KEY]
							//
							|| START_MONTH);
							// 依 month_index_to_name() 之演算法，
							// 若为闰月起首，则 [START_KEY] 须设定为下一月名！
							// e.g., 闰3月起首，则 [START_KEY] = 4。
							if (月序 > era_year_data[LEAP_MONTH_KEY])
								tmp--;
							this_year_data[START_KEY] = tmp;
						}

						if (date_index > 0) {
							// 非首日。处理到下一个月。
							if (!this_year_data)
								calendar_data.push(
								// 设定好 this_year_data 环境。
								this_year_data = []);

							copy_date(era_year_data[月序] - date_index);
							date_index = 0;
						}

						if (!this_year_data)
							// 首月首日。须保持 calendar_data.length ===
							// year_start_time.length
							year_start_time = [];

						if (library_namespace.is_debug(1)) {
							// check 日次。
							// tmp: 纪年历数所设定之起始日次。
							tmp = date_name[0] | 0;
							if (tmp && tmp !==
							//
							calendar_data[START_DATE_KEY])
								library_namespace.error([
										'initialize_era_date: ', '纪年 [' + this,
										'] 于历数所设定之起始日名 ', tmp,
										' 与从参照纪年 [' + era, '] 得到的日次 ',
										(calendar_data[START_DATE_KEY]
										//
										|| START_DATE), ' 不同！' ]);

							// check 月次。
							// tmp: 纪年历数所设定之起始月次。
							tmp = date_name[1] | 0;
							if (tmp && tmp !==
							//
							(this_year_data[START_KEY]
							//
							|| START_MONTH))
								library_namespace.warn([
										'initialize_era_date: ', '纪年 [' + this,
										'] 于历数所设定之起始月名 ', tmp,
										' 与从参照纪年 [' + era, '] 得到的月次 ',
										(this_year_data[START_KEY]
										//
										|| START_MONTH), ' 不同！（本年闰月次',
										//
										era_year_data[LEAP_MONTH_KEY],
										//
										'）' ]);
						}
					}

					/**
					 * 处理年中分割，更替时间点不在本年年首的情况。
					 */

					/**
					 * 分割点于本月中间而不在首尾，重叠部分本月之日数，以后一使用纪元为准。
					 */
					if (date_index > 0 || 年序 === 0 && 月序 === 0
					//
					&& (START_DATE_KEY in era.calendar)
					// 处理纪年于月中交接，交接时日序非 0 的情况。
					// assert: && era.calendar[START_DATE_KEY] !==
					// START_DATE
					) {
						library_namespace.debug(
						//
						'处理年中分割，更替时间点不在本年年首的情况。', 5);
						// 续用 this_year_data。
						// 必须设定好 this_year_data 环境。
						clone_last_year(true);

						// 先记下本月现有天数。
						// 若在 clone_last_year() 之前，此时 this_year_data
						// 可能参照的是原参照纪年，为唯读，因此不使用 .pop()。
						tmp = this_year_data.pop();

						// 参考 date_index_to_name()。
						if (calendar_data.length === 1
						// this.年序 === 0 && this.月序 === 0
						&& this_year_data.length === 0
						//
						&& (START_DATE_KEY in calendar_data))
							tmp
							//
							+= calendar_data[START_DATE_KEY] - START_DATE;
						// 由后一使用纪元得出本月实际应有天数。
						// TODO: 若前后纪元各自设有 START_DATE_KEY，恐怕仍有 bug。
						date_index = era_year_data[月序];
						if (年序 === 0 && 月序 === 0
						//
						&& (START_DATE_KEY in era.calendar))
							date_index
							//
							+= era.calendar[START_DATE_KEY] - START_DATE;
						// check
						if (tmp !== date_index
						// isNaN(tmp): 纪年起始，因此本来就没有「原先参照的纪元」之资料。
						&& !isNaN(tmp))
							library_namespace.warn([ 'initialize_era_date: ',
									'后一纪元 [' + era, '] 本月 ', date_index,
									'天，不等于原先参照的纪元(为 ', tmp, '天)！' ]);
						// 设定起始日码。
						// TODO: 若前后纪元各自设有 START_DATE_KEY，恐怕仍有 bug。
						if (calendar_data.length === 1
						// this.年序 === 0 && this.月序 === 0
						&& this_year_data.length === 0
						//
						&& (START_DATE_KEY in calendar_data))
							date_index
							// 当接续纪元时，若本已有 START_DATE_KEY 则减去之。
							-= calendar_data[START_DATE_KEY] - START_DATE;
						copy_date(date_index);
					}

					/**
					 * 处理分割点于本年中间之月首，而不在本年首尾的情况。
					 */
					if (月序 > 0 || (START_KEY in era_year_data)
					// 有时 era_year_data[START_KEY] === START_MONTH。
					&& era_year_data[START_KEY] !== START_MONTH) {
						library_namespace.debug(
						//
						'处理分割点于本年中间之月首 (月序='
						//
						+ 月序 + ')，而不在本年首尾的情况。', 5);
						clone_last_year();

						library_namespace.debug(
						//
						'复制本年接下来每月之历数: ' + 月序 + PERIOD_DASH
								+ era_year_data.length + '。', 5);
						if (月序 < era_year_data.length)
							Array_push(this_year_data, era_year_data.slice(月序));

						// 复制本年之 LEAP_MONTH_KEY。
						// 须考虑日月名称未连续的情况。
						tmp = era_year_data[LEAP_MONTH_KEY]
						// 参考 month_index_to_name()。
						+ (era_year_data[START_KEY] || START_MONTH)
						// 转成 this_year_data 中之闰月 index。
						- (this_year_data[START_KEY] || START_MONTH);
						if ((tmp > 0 || tmp === 0
						// 本月是否为闰月？若是，则 (===)。
						&& 月序 === era_year_data[LEAP_MONTH_KEY])
						// check: this_year_data[LEAP_MONTH_KEY]
						// 可能已存在。
						&& (!(LEAP_MONTH_KEY in this_year_data)
						//
						|| tmp !== this_year_data[LEAP_MONTH_KEY])) {
							library_namespace.debug(
							//
							'复制本年之 LEAP_MONTH_KEY。 index ' + tmp, 5);
							if (LEAP_MONTH_KEY in this_year_data)
								library_namespace.warn([
										'initialize_era_date: ' + this, ' 年序 ',
										calendar_data.length - 1, '，寻至' + era,
										' 年序 ', 年序, '，此年有两个闰月设定：',
										this_year_data[LEAP_MONTH_KEY],
										' vs. ', tmp, '！' ]);

							this_year_data[LEAP_MONTH_KEY] = tmp;
						}

						tmp = era_year_data[NAME_KEY];
						if (tmp && 月序 < tmp.length) {
							library_namespace.debug(
							//
							'复制本年接下来每月之月分名称 (' + 月序 + PERIOD_DASH + tmp.length
									+ ') [' + tmp + ']。', 5);
							// console.log(era_year_data);
							// console.log(this_year_data);
							if (!(NAME_KEY in this_year_data))
								// 初始化本年之月分名称。
								this_year_data[NAME_KEY] = [];
							this_year_data[NAME_KEY].length
							// 先截至当前交接之月分。
							= this_year_data.length
							// 减掉前面 copy 过之每月历数长度。
							- era_year_data.length + 月序;
							Array_push(this_year_data[NAME_KEY], tmp.slice(月序));
						}

						if (library_namespace.is_debug(1)) {
							// check 历数
							tmp = this_year_data.length;
							library_namespace.debug([ this + ' 年序 ',
									calendar_data.length - 1, ' 参考 ' + era,
									'，得历数 ', tmp, ' 个月: [',
									this_year_data.join(','), ']' ], 2,
									'initialize_era_date');
							if (START_KEY in this_year_data)
								tmp += this_year_data[START_KEY] - START_MONTH;
							if (tmp !== LUNISOLAR_MONTH_COUNT
							//
							+ (LEAP_MONTH_KEY
							//
							in this_year_data ? 1 : 0))
								library_namespace.warn([
								//
								'initialize_era_date: ' + this,
								//
								' 年序 ', calendar_data.length - 1,
								//
								'：本年参照纪年 [' + era, '] 年序 ', 年序,
								//
								'，共至 ', tmp, ' 月，阴阳历正常情况应为 ',
								//
								LUNISOLAR_MONTH_COUNT + (LEAP_MONTH_KEY
								//
								in this_year_data ? 1 : 0), ' 个月！' ]);
						}

						// 月序 = 0;
						年序++;
					}
					// else: assert: 更替时间点除了'年'外，没其他的了。本年首月首日,
					// date_index === 月序 === 0

					/**
					 * 尽可能以复制参照的方式，复制整年之暦数。
					 */
					// 第二轮后，start_time 代表 (前纪元.end)，而非代表 this.start。
					start_time = era.end;
					// date_index: is last era. 已至 this.end。
					// 保持 start_time <= this_end。
					date_index = this_end - start_time <= 0;
					if (date_index) {
						tmp = era.year_start.search_sorted(this_end, {
							found : true
						});
						if (era.year_start[tmp] < this_end)
							tmp++;
						if (tmp > era.calendar.length)
							tmp = era.calendar.length;
					} else
						for (tmp = era.calendar.length;
						// assert: era.year_start.length ===
						// era.calendar.length + 1
						start_time - era.year_start[tmp - 1] <= 0;)
							// 预防 era 之暦数超过 era.end 所在年的情况。
							// 此时须取得 era.end 在 era 暦数中真正的位置。
							tmp--;

					// 加速: 逐年复制 era 之暦数，至 this.end 或 era 已无历数为止。
					if (年序 < tmp) {
						// 有可整年复制之暦数。

						if (this_year_data
						//
						&& this_year_data[COUNT_KEY])
							delete this_year_data[COUNT_KEY];

						// year_start_time 总是与 calendar_data 作相同
						// push/pop 处理，包含与 calendar_data 相同笔数的资料。
						Array_push(year_start_time, era.year_start.slice(年序,
								tmp));
						// assert: era.year_start.length ===
						// era.calendar.length + 1
						Array_push(calendar_data, era.calendar.slice(年序, tmp));
						// 复制这些年分之 NAME_KEY。
						if (NAME_KEY in era.calendar) {
							calendar_data[NAME_KEY].length
							//
							= calendar_data.length;
							Array_push(calendar_data[NAME_KEY], era.calendar
									.slice(年序, tmp));
						}
					}

					/**
					 * 若已是最后一个纪年，则表示完成暦数参照。跳出。
					 */
					if (date_index) {
						if (this_year_data
						//
						&& this_year_data[COUNT_KEY])
							delete this_year_data[COUNT_KEY];

						// done.
						// assert: 此时 tmp 代表当前参照纪年之年序。
						break;
					}

					/**
					 * 设定下一轮必要的初始参数，以及正确之月序。
					 */
					// era 已无历数。需要跳到下个纪元。查找下一参照纪元。
					// 会到这边，基本上都是经过整年复制的。
					// 有必要重新处理（跨纪年之类）。
					//
					// 设定正确之月序。这时测试前一天。
					// assert: 取前一天则必须为纪年起始后（纪年范围内），与最后一日期间内；
					// 必能被 parse，且可取得 index。
					// [ 岁序, 月序, 日序 | 0 ]
					月序 = era.Date_to_date_index(new Date(
					// 因为已经处理本年到本年历数最后一月(倒不见得是年底)，因此需要重设 index。
					// 为预防参照源仅有几个月或数日，还不到年底，因此不重设年序、跳到下一年。
					start_time - ONE_DAY_LENGTH_VALUE));
					if (!月序)
						throw new Error('initialize_era_date: 无法取得 [' + era
								+ '].end 的日期序！');

					// 设定好交接的 date_name。
					// .日名(日序, 月序, 岁序) = [ 日名, 月名, 岁名 ]
					date_name = era.日名(月序[2], 月序[1], 月序[0]);
					if (!date_name)
						throw new Error('initialize_era_date: 无法取得 [' + era
								+ '].end 的日期名！');
					// 因为取得的是交接点前一日之日名，因此须将日名延后一日，以取得实际交接点应该有的 date。
					date_name[0]++;

					// 做标记。
					// 设定正确之月序。+1: 月序 index → length
					correct_month_count = 月序[1] + 1;
				}

				// assert: year_start_time.length ===
				// calendar_data.length
				// TODO: 若无 era 时之处理。
				year_start_time.push(era.year_start[tmp]);

				if (calendar_data[NAME_KEY].length === 0)
					delete calendar_data[NAME_KEY];

				if (!(MINUTE_OFFSET_KEY in this) && (MINUTE_OFFSET_KEY in era))
					this[MINUTE_OFFSET_KEY] = era[MINUTE_OFFSET_KEY];

				// 不再作一般性的解析。
				纪年历数 = null;

			} else {
				// ---------------------------------------

				this.参照历法 = 历法;

				// 因为了 parser 作设计可能大幅度改变各
				// method，方出此下策，沿用原先的资料结构。
				var time = start_time.getTime(),
				//
				next_time, 日数,
				//
				_to_String
				//
				= Date_to_String_parser[历法],
				//
				to_String = function(time) {
					return _to_String(time, '%Y/%m/%d').split('/');
				},
				//
				ordinal = to_String(start_time);

				if (isNaN(ordinal[0])
				// 检测
				|| date_name[1] && date_name[1] !== ordinal[1]
				//
				|| date_name[2] && date_name[2] !== ordinal[2])
					library_namespace.warn('initialize_era_date: 纪年 [' + this
							+ '] 起讫时间所设定的纪年<b>开始时间</b> [' + ordinal.join('/')
							+ ']，与从历数资料取得的 [' + date_name.join('/') + '] 不同！');

				// 不可设为 START_DATE。
				if (isNaN(ordinal[2] |= 0)) {
					library_namespace.error('initialize_era_date: 纪年 [' + this
							+ '] 无法顺利转换日期 [' + ordinal.join('/') + ']！');
					return;
				}
				// 于历数起头设定起始日码。
				if (ordinal[2] !== START_DATE) {
					// 这时还没设定 calendar_data[0] = this_year_data。
					// calendar_data[0][START_DATE_KEY] =
					calendar_data[START_DATE_KEY] = ordinal[2];
				}

				if (历法 === 'CE') {
					// 加速 CE 的演算。另可试试不采用 .calendar = [] 的方法，而直接改变
					// this.attributes。
					this.大月 = CE_MONTH_DAYS;
					// this.小月 = CE_MONTH_DAYS - 1;

					// next_time: this year.
					next_time = ordinal[0];

					if ((ordinal[1] |= 0) === START_MONTH
							&& ordinal[2] === START_DATE)
						ordinal = false;

					while (time < this_end) {
						if (next_time === CE_REFORM_YEAR) {
							next_time++;
							this_year_data = CE_REFORM_YEAR_DATA;
							time += CE_REFORM_YEAR_LENGTH_VALUE;
						} else {
							// 日数: year (next_time) is leap year.
							日数 = library_namespace
									.is_leap_year(next_time++, 历法);
							time += 日数 ? CE_LEAP_YEAR_LENGTH_VALUE
									: CE_COMMON_YEAR_LENGTH_VALUE;
							this_year_data = 日数 ? CE_LEAP_YEAR_DATA
									: CE_COMMON_YEAR_DATA;
						}

						if (ordinal) {
							// 处理第一年非 1/1 起始的情况。
							日数 = ordinal[2] -= START_DATE;
							// to_String, _to_String: tmp
							to_String = _to_String = ordinal[1] - START_MONTH
									| 0;
							while (to_String > 0)
								日数 += this_year_data[--to_String];
							time -= 日数 * ONE_DAY_LENGTH_VALUE;
							this_year_data = this_year_data.slice(_to_String);
							this_year_data[START_KEY] = ordinal[1];
							this_year_data[0] -= ordinal[2];

							ordinal = false;
						}

						year_start_time.push(time);
						calendar_data.push(
						//
						this_year_data);
					}

				} else {
					this_year_data = [];
					if ((ordinal[1] |= 0)
					//
					&& ordinal[1] !== START_MONTH)
						this_year_data[START_KEY] = ordinal[1];

					// date 设为 START_DATE，为每个月初的遍历作准备。
					ordinal[2] = START_DATE;

					if (!String_to_Date.parser[历法]) {
						library_namespace.error('未设定好 String_to_Date.parser['
								+ 历法 + ']!');
					}
					历法 = String_to_Date.parser[历法];
					// TODO: 这方法太没效率。
					while (time < this_end) {
						// 找下一月初。
						++ordinal[1];
						next_time = 历法(ordinal.join('/'), undefined, {
							// 于 CE 可避免 80 被 parse 成 1980。
							year_padding : 0
						});
						if (library_namespace.is_debug(2))
							library_namespace.debug(this + ': '
							//
							+ ordinal.join('/') + ' → '
							//
							+ next_time.format(
							//
							standard_time_format));
						日数 = (next_time - time) / ONE_DAY_LENGTH_VALUE;
						if (!(日数 > 0) && 日数 !== (日数 | 0)) {
							library_namespace.error(
							// 可能是时区问题?
							'initialize_era_date: 纪年 [' + this + '] 无法顺利转换日期 ['
									+ ordinal.join('/') + ']: 错误日数！');
							return;
						}
						this_year_data.push(日数);
						time = ordinal;
						ordinal = to_String(next_time);
						if (time.join('/') !== ordinal.join('/')) {
							// 预期应该是隔年一月。
							if (++time[0] === 0
							// CE 预设无 year 0 (第0年/第零年)。
							&& !this.零年 && !this.year0)
								++time[0];
							time[1] = START_MONTH;
							if (time.join('/') !== ordinal.join('/')) {
								library_namespace.error(
								//
								'initialize_era_date: 纪年 [' + this
										+ '] 无法顺利转换日期！[' + time.join('/')
										+ ']→[' + ordinal.join('/') + ']');
								return;
							}
							year_start_time.push(next_time.getTime());
							calendar_data.push(this_year_data);
							this_year_data = [];
						}
						time = next_time.getTime();
					}
					if (this_year_data.length > 0) {
						// 注意:这最后一个月可能超过 this.end!
						year_start_time.push(next_time.getTime());
						calendar_data.push(this_year_data);
					}
				}

				// 不再作一般性的解析。
				纪年历数 = null;
			}

		} else
			// 解压缩日数 data。
			纪年历数 = extract_calendar_data(纪年历数, this);

		// ---------------------------------------

		if (纪年历数)
			纪年历数 = 纪年历数.split(pack_era.year_separator);

		if (纪年历数) {
			// 一般性的解析。
			var 闰月名 = this.闰月名,
			// 为了测试历数是否已压缩。
			era = this;

			纪年历数.forEach(function(year_data) {
				var month_data = year_data.split(pack_era.month_separator);

				// 初始设定。
				days = 0;
				年序 = START_YEAR;
				月序 = START_MONTH;
				calendar_data.push(this_year_data = []);

				month_data.forEach(function(date_data) {
					// 当月之日数|日数 data
					// =当月之日数|日数 data
					// 年名/月名/起始日码=当月之日数|日数 data
					// /月名/起始日码=当月之日数|日数 data
					// 年名/月名=当月之日数|日数 data
					// 月名=当月之日数|日数 data

					var date_name = date_data.match(/^(?:(.*?)=)?([^;\t=]+)$/);

					if (!library_namespace.is_digits(date_data = date_name[2]
							.trim())
							// 接受 0日，是为了如 Myanmar 需要调整月名的情况。
							|| (date_data |= 0) <= 0) {
						library_namespace
								.error('initialize_era_date: 无法辨识日数资料 ['
										+ calendar_data + '] 中的 [' + date_data
										+ ']！');
						return;
					}

					// 处理日期名称。
					if (date_name
					//
					= parse_calendar_date_name(date_name[1])) {
						var tmp, 年名 = date_name[0],
						//
						月名 = date_name[1],
						// 仅允许整数。
						起始日码 = date_name[2] | 0;

						// 设定年分名称
						if (年名 && 年名 != 年序) {
							if (/^-?\d+$/.test(年名))
								// 还预防有小数。
								年名 = Math.floor(年名);
							if (typeof 年名 === 'number'
									&& !(NAME_KEY in calendar_data)
									&& !(START_KEY in calendar_data))
								calendar_data[START_KEY] = 年序 = 年名;

							else {
								if (!(NAME_KEY in calendar_data)) {
									calendar_data[NAME_KEY] = [];
									// TODO: 填补原先应有的名称。

								} else {
									if (calendar_data[NAME_KEY]
									//
									[calendar_data.length])
										library_namespace.warn(
										//
										'initialize_era_date: ' + '重复设定年分名称！');
									if (this_year_data.length > 0)
										library_namespace.warn(
										//
										'initialize_era_date: '
												+ '在年中，而非年初设定年分名称！');
								}

								calendar_data[NAME_KEY]
								//
								[calendar_data.length] = 年名;
							}

						}

						// 设定起始日码。
						if (!起始日码 || 起始日码 === START_DATE) {
							// 无须设定。

						} else if (!library_namespace.is_digits(起始日码)) {
							// 测试是否为合理之数值:不合资格。
							library_namespace.warn(
							//
							'initialize_era_date: 设定非数字的年度月中起始日码 [' + 起始日码
									+ ']！将忽略之。');
						} else {
							if (START_DATE_KEY in this_year_data)
								library_namespace.warn(
								//
								'initialize_era_date: 本年已设定过月中起始日码 [' + 起始日码
										+ ']！');
							else {
								this_year_data[START_DATE_KEY] = 起始日码;
								// 测试历数是否已压缩。
								if (已压缩历数_PATTERN.test(era.calendar))
									date_data -= 起始日码 - START_DATE;
							}

							// 于最起头才能设定 calendar_data[START_DATE_KEY]。
							// 确定在历数资料一开始即设定月中日期，而非在中途设定日期。
							if (calendar_data.length === 1)
								// 确定之前尚未设定。
								if (START_DATE_KEY in calendar_data) {
									library_namespace.warn(
									//
									'initialize_era_date: 本纪年已设定过起始日码 [' + 起始日码
											+ ']！将忽略之。');
								} else {
									calendar_data[START_DATE_KEY]
									// 设定纪年起始之月中日数。
									= 起始日码;
								}
						}

						// 设定月分名称。
						// TODO:
						if (月名 && 月名 != 月序) {
							if (library_namespace.is_digits(月名))
								月名 |= 0;
							if (typeof 月名 === 'number') {
								if (!(NAME_KEY in this_year_data)
								//
								&& !(START_KEY in this_year_data))
									this_year_data[START_KEY]
									// 若 月序
									// ==
									// 月名，则不会到这。
									= 月序 = 月名;
								else {
									if (!(NAME_KEY in this_year_data))
										// 初始化本年之月分名称。
										this_year_data[NAME_KEY] = [];
									this_year_data[NAME_KEY]
									// e.g.,
									// 唐武后久视1年
									[this_year_data.length] = 月名;
								}

							} else if (月名 === LEAP_MONTH_PREFIX || 闰月名
									&& 月名 === 闰月名
									|| (tmp = 月名.match(MONTH_NAME_PATTERN))
									&& tmp[1]
									&& (!tmp[2] || (tmp[2] |= 0) + 1 == 月序
									// 闰月起始。
									|| !(NAME_KEY in this_year_data)
									//
									&& !(START_KEY in this_year_data)))
								if (LEAP_MONTH_KEY in this_year_data)
									library_namespace
											.warn('initialize_era_date: '
													+ '本年有超过1个闰月！将忽略之。');
								else {
									this_year_data[LEAP_MONTH_KEY]
									// 闰月
									// index:
									// 闰月将排在
									// [this_year_data.length]。
									= this_year_data.length;
									if (START_KEY in this_year_data)
										// 因为闰月，减1个月序。
										月序--;
									else
										this_year_data[START_KEY]
										// 闰月起始之处理。
										= 月序 = tmp && tmp[2]
										// 将
										// START_KEY
										// 设成下一月序，以便转换月名时容易处理。
										// 因为所有闰月之后，包括闰月本身，都会减一。
										? 1 + tmp[2]
										//
										: 2 + LUNISOLAR_MONTH_COUNT
												- month_data.length;
								}
							else {
								if (!(NAME_KEY in this_year_data)) {
									// 初始化本年之月分名称。
									this_year_data[NAME_KEY] = [];
									// TODO: 填补原先应有的名称。

								} else {
									if (this_year_data[NAME_KEY]
									//
									[this_year_data.length])
										library_namespace.warn(
										//
										'initialize_era_date: ' + '重复设定月分名称！');
								}

								this_year_data[NAME_KEY]
								//
								[this_year_data.length] = 月名;
							}
						}

					}
					// 日期名称处理完毕。

					// 当月之日数。
					this_year_data.push(date_data);
					days += date_data;

					月序++;
					// build year_start_time.

					// 注意:需要依照 MONTH_DAYS 更改公式!
				});

				// 后设定。
				start_time.setDate(start_time.getDate() + days);
				year_start_time.push(start_time.getTime());
				days = 0;
				年序++;
			});
		}

		// ---------------------------------------

		if ((START_DATE_KEY in calendar_data)
		//
		&& !(START_DATE_KEY in calendar_data[0]))
			calendar_data[0][START_DATE_KEY]
			// assert: 于前面，"于历数起头设定起始日码"处未设定之值。
			= calendar_data[START_DATE_KEY];

		if (Array.isArray(月序 = this[MONTH_NAME_KEY]))
			calendar_data.forEach(function(this_year_data) {
				add_month_name(月序, this_year_data);
			});

		// 弥封。
		calendar_data.forEach(function(data) {
			Object.seal(data);
		});

		// ---------------------------------------
		// 能跑到这边才算是成功解析，能设定暦数。
		this.year_start = Object.seal(year_start_time);
		this.calendar = Object.seal(calendar_data);

		this.skip_year_0 = calendar_data[START_KEY] < 0
		// 没有 year 0 (第0年/第零年)?
		&& !this.零年 && !this.year0;

		// ---------------------------------------
		// 出厂前检测。
		year_start_time = year_start_time.at(-1);
		if (year_start_time === this_end) {
			;
		} else if (纪年历数 && this_end < year_start_time) {
			// 可能是为了压缩而被填补满了。
			days = new Date(this_end);
			// assert: 取前一天则必须为纪年起始后（纪年范围内），与最后一日期间内；
			// 必能被 parse，且可取得 index。
			days.setDate(days.getDate() - 1);
			// [ 岁序, 月序, 日序 | 0 ]
			days = this.Date_to_date_index(days);

			if (days[0] + 1 > this.calendar.length) {
				// truncate 年。
				this.calendar.length = days[0] + 1;

			} else if (days[0] + 1 < this.calendar.length)
				library_namespace
						.debug('由纪年 [' + this
								+ '] 历数资料取得的纪年<b>结束时间</b>，较其起讫时间所设定的 ['
								+ this.end.format(standard_time_format)
								+ '] 长了 '
								+ (this.calendar.length - (days[0] + 1))
								+ ' 年。可手动删除之。');

			// truncate 月。
			if (days[1] + 1 > this.calendar[days[0]].length)
				this.calendar[days[0]].length = days[1] + 1;

			// truncate 日: skip。此数据可能保留了当月实际的日数。
			// this.calendar[days[0]][days[1]] = days[2] + 1;

			// TODO: 设定最后之 year_start_time
			// 为真实之下一年开头，可能需要查询下一纪年之历数。
			// 注意:这表示，最后一个 era.year_start 可能与 .calendar
			// 有接近一整年之距离!

		} else {
			if (!this.参照纪年 && year_start_time < this_end
			//
			|| library_namespace.is_debug())
				library_namespace.warn('initialize_era_date: 纪年 ['
						+ this
						+ '] 起讫时间所设定的纪年<b>结束时间</b> ['
						+ this.end.format(standard_time_format)
						+ ']，与从历数资料取得的 ['
						+ (new Date(year_start_time))
								.format(standard_time_format) + '] 不同！');
			if (false)
				this.year_start.forEach(function(date, index) {
					console.log(index + ':'
							+ new Date(date).format(standard_time_format));
				});
		}
	}

	// get （起始）年干支序。
	// 设定"所求干支序"，将回传所求干支序之年序。
	// 未设定"所求干支序"，将回传纪年首年之年干支index。
	function get_year_stem_branch_index(所求干支序) {
		var 历数 = this.calendar, 年干支 = this.起始年干支序, 起始月分, offset;

		if (isNaN(年干支)) {
			// 尽量取得正月，不需要调整的月分。
			if ((起始月分 = 历数[0][START_KEY])
			// assert: 即使是只有一个月的短命政权，也得要把日数资料填到年底！
			&& (offset = this.year_start[1]))
				年干支 = new Date(offset);
			else {
				年干支 = new Date(this.start.getTime());
				if (起始月分)
					年干支.setMonth(年干支.getMonth() + START_MONTH - 起始月分);
			}
			年干支 = 年干支.getFullYear()
			// 中历年起始于CE年末，则应算作下一年之 YEAR_STEM_BRANCH_EPOCH。
			+ (年干支.getMonth() > 9 ? 1 : 0) - (offset ? 1 : 0);
			// e.g., 中历2001年: 2001
			this.起始年序 = 年干支;
			年干支 = (年干支 - library_namespace.YEAR_STEM_BRANCH_EPOCH)
					.mod(library_namespace.SEXAGENARY_CYCLE_LENGTH);
			this.起始年干支序 = 年干支;
		}

		if (!isNaN(所求干支序) && (年干支 = 所求干支序 - 年干支) < 0)
			年干支 += library_namespace.SEXAGENARY_CYCLE_LENGTH;

		return 年干支;
	}

	// get （起始）月干支序。

	// 设定"月干支"，将回传所求月干支之 [ 月序, 岁序 ]。
	// 未设定"月干支"，将回传纪年首年首月(index: 0, 0)之月干支index。

	// 此非纪年首年岁首之月干支序，而是纪年首年首月之月干支序。
	// 只有在未设定首年起始月数(this.calendar[0][START_KEY])的情况下，两者才会相等。
	// TODO: bug: 唐肃宗上元1年闰4月, 干支!==巳!!
	function get_month_branch_index(月干支, 岁序) {
		var 历数 = this.calendar, 起始月干支 = this.起始月干支序, 月序;

		// 确定建正：以建(何支)之月为正月(一月)。除颛顼历，通常即正朔。
		// 以冬至建子之月为历初。
		// 「三正」一说是夏正（建寅的农历月份，就是现行农历的正月）殷正（建丑，即现行农历的十二月）、周正（建子，即现行农历的十一月）；
		// 建正与岁首一般是统一的。秦始皇统一中国后，改以建亥之月（即夏历的十月）为岁首（分年/岁之月；当年第一个月），但夏正比较适合农事季节，所以并不称十月为正月（秦朝管正月叫「端月」），不改正月为四月，

		if (isNaN(起始月干支)) {
			// 月序 = START_DATE_KEY in 历数 ? 1 : 0 ;

			// 找到第一个非闰月。
			// 一般说来，闰月不应该符合中气，因此照理不需要这段筛选。
			if (false)
				while (isNaN(this.月名(月序[0], 月序[1])))
					if (!this.shift_month(1, 月序)) {
						library_namespace.error(
						//
						'get_month_branch_index: 无法取得月次（数字化月分名称）！');
						return;
					}

			// 判别此月份所包含之中气日。
			// 包冬至 12/21-23 的为建子之月。
			// 冬至所在月份为11冬月、大寒所在月份为12腊月、雨水所在月份为1正月、春分所在月份为2二月、…、小雪所在月份为10十月，无中气的月份为前一个月的闰月。
			var ST本月中气起始日, 下个月起始日差距, ST月序, 中气差距日数,
			/**
			 * 闰月或闰月之后。
			 * 
			 * @type {Boolean}
			 */
			闰月后,
			// 如果不是从当月1号开始，那么就找下一个月来测试。
			ST本月起始日 = isNaN(this.岁首序) ? START_DATE_KEY in 历数 ? 1 : 0 : -1;
			for (月序 = [ 0, 0 ];;)
				if (this.shift_month(ST本月起始日, 月序)) {
					// 标准时间ST(Standard Time) (如公历UTC+8)之 本月月初起始日
					ST本月起始日 = this.date_index_to_Date(月序[1], 月序[0]);
					// 标准时间ST(Standard Time) (如公历UTC+8)之 本月中气起始日
					ST本月中气起始日 = 中气日[ST月序 = ST本月起始日.getMonth()];
					// 中气起始日与本月月初起始日之差距日数。
					中气差距日数 = ST本月中气起始日 - ST本月起始日.getDate();
					// 下个月月初起始日，与本月月初起始日之差距日数。
					// 即本月之日数。
					下个月起始日差距 = 历数[月序[1]][月序[0]];

					if (中气差距日数 < 0) {
						if (false && 月序[2] === 0 && 0 < 中气差距日数 + 中气日_days + 2) {
							// TODO: 纪年首月之前一个月绝对包含(ST月序)中气。
							break;
						}

						// 日期(of 标准时间月)于中气前，改成下个月的中气日。
						if (++ST月序 >= 中气日.length)
							ST月序 = 0;
						ST本月中气起始日 = 中气日[ST月序];
						// 重新计算中气差距日数。
						中气差距日数 = ST本月中气起始日 - ST本月起始日.getDate();

						// 加上本标准时间月日数，
						// e.g., 3月为31日。
						// 使(中气差距日数)成为下个月的中气日差距。
						// .setDate(0) 可获得上个月的月底日。
						ST本月起始日.setMonth(ST月序, 0);
						中气差距日数 += ST本月起始日.getDate();
					}

					// 只要本月包含所有中气可能发生的时段，就当作为此月。
					if (中气差距日数 + 中气日_days < 下个月起始日差距) {
						// 标准时间月序(ST月序) No 0:
						// 包含公元当年1月之中气(大寒)，为腊月，
						// 月建丑，月建序 1(子月:0)。余以此类推。

						// 岁序(月序[1])月序(月序[0])，
						// 距离纪年初(月序[2])个月，
						// 包含公元当年(ST月序 + 1)月之中气，
						// 其月建序为(ST月序 + 1)。

						// 判定建正。

						// 寅正:
						// 中历月: B C 1 2 3 4 5 6 7 8 9 A
						// 中月序: A B 0 1 2 3 4 5 6 7 8 9

						// 中气序: B 0 1 2 3 4 5 6 7 8 9 A

						// ..月建: 子丑寅卯辰巳午未申酉戌亥
						// 月建序: 0 1 2 3 4 5 6 7 8 9 A B

						闰月后 = 月序[0] >= 历数[月序[1]][LEAP_MONTH_KEY];
						if (library_namespace.is_debug()) {
							library_namespace.debug('闰月或之后: ' + 闰月后, 1,
									'get_month_branch_index');

							// 中历月序=(历数[月序[1]].start-START_MONTH)+月序[0]-(闰月或之后?1:0)
							library_namespace.debug('中历月序 = '
									+ ((START_KEY in 历数[月序[1]]
									//
									? 历数[月序[1]][START_KEY] - START_MONTH : 0)
											+ 月序[0] - (闰月后 ? 1 : 0)), 1,
									'get_month_branch_index');

							// 岁首包含中气序=ST月序-月序
							library_namespace.debug('岁首包含中气序 = '
									+ (ST月序 - ((START_KEY in 历数[月序[1]]
									//
									? 历数[月序[1]][START_KEY] - START_MONTH : 0)
											+ 月序[0] - (闰月后 ? 1 : 0))), 1,
									'get_month_branch_index');

							// 岁首月建序=(岁首中气序+1)%LUNISOLAR_MONTH_COUNT
							library_namespace.debug('岁首月建序 = '
									+ (1 + ST月序
									//
									- ((START_KEY in 历数[月序[1]]
									//
									? 历数[月序[1]][START_KEY] - START_MONTH : 0)
											+ 月序[0] - (闰月后 ? 1 : 0))), 1,
									'get_month_branch_index');
						}

						this.岁首月建序 = ST月序 - 月序[0]
						// 岁首月建序=(ST月序+(is leap?2:1)-月序[0]
						// -(历数[月序[1]][START_KEY]-START_MONTH))%LUNISOLAR_MONTH_COUNT
						- (START_KEY in 历数[月序[1]]
						//
						? 历数[月序[1]][START_KEY] - START_MONTH : 0)
						// 过闰月要再减一。
						+ (闰月后 ? 2 : 1);

						// 将(ST月序)转为纪年首月之月建序差距。
						// 1: 月建序 - 中气序
						ST月序 += (闰月后 ? 2 : 1) - (月序[2] || 0);
						break;
					}

					// 跳过无法判断之月分，移往下个月。
					ST本月起始日 = 1;

				} else {
					// 无法判别的，秦至汉初岁首月建序预设 11。
					// 子正:岁首月建序=0
					// 设定 this.岁首序:已手动设定岁首。
					this.岁首月建序 = (this.岁首序 || 0) + 2;

					// 其他预设甲子年正月(月序0):
					// 丙寅月，月建序(index)=2+月序。
					ST月序 = this.岁首月建序 + (历数[0] && (START_KEY in 历数[0])
					//
					? 历数[0][START_KEY] - START_MONTH : 0);
					break;
				}

			this.岁首月建序 = this.岁首月建序.mod(library_namespace.BRANCH_LIST.length);

			// 对于像是"西晋武帝泰始1年12月"这种特殊日期，元年12月1日起始，但是却包含有平常的一月中气(雨水)，这种情况就得要手动设定建正。
			if (this.建正) {
				var 建正序 = library_namespace.BRANCH_LIST.indexOf(this.建正);
				if (建正序 === NOT_FOUND) {
					library_namespace.error(this + ': 建正非地支之一: ' + this.建正);
				} else if (建正序 !== this.岁首月建序) {
					// (建正序 - this.岁首月建序): 需要手动横移的序数。
					ST月序 += 建正序 - this.岁首月建序;
					this.岁首月建序 = 建正序;
				}
			}

			// 取得月干支。月干支每5年一循环。
			起始月干支 = this.get_year_stem_branch_index()
			// + 月序[1]??
			;
			// (ST月序):纪年首月之月建序差距。
			// 对11,12月，必须要算是下一年的。
			if (ST月序 === 0 || ST月序 === 1) {
				起始月干支++;
			}
			起始月干支 = (起始月干支 * LUNISOLAR_MONTH_COUNT + ST月序)
					.mod(library_namespace.SEXAGENARY_CYCLE_LENGTH);
			this.起始月干支序 = 起始月干支;
		}

		if (月干支 && isNaN(月干支))
			月干支 = library_namespace.stem_branch_index(月干支);
		if (isNaN(月干支))
			// 回传纪年首年首月之月干支index。
			return 起始月干支;

		// 找出最接近的月干支所在。
		// 回传所求干支序之 [ 月序, 岁序 ]。
		// 就算有闰月，每年也不过移动 LUNISOLAR_MONTH_COUNT。
		if (岁序 |= 0) {
			// 算出本岁序首月之月干支。
			// 有闰月的话，月干支会少位移一个月。
			起始月干支 = (起始月干支 + 历数[0].length - (历数[0][LEAP_MONTH_KEY] ? 1 : 0)
			//
			+ LUNISOLAR_MONTH_COUNT * (岁序 - 1))
					% library_namespace.SEXAGENARY_CYCLE_LENGTH;
		}
		// now: 起始月干支 = 岁序(岁序)月序(0)之月干支

		// 取得差距月数，须取得岁序(岁序)月序(0)往后(月干支)个月。
		if ((月序 = 月干支 - 起始月干支) < 0)
			// 确保所求差距月数于起始月干支后。
			月序 += library_namespace.SEXAGENARY_CYCLE_LENGTH;
		if (月序 >= LUNISOLAR_MONTH_COUNT) {

			library_namespace.error('get_month_branch_index: '
			//
			+ this.岁名(岁序) + '年并无此月干支 [' + 月干支 + ']！');

			// 判断前后差距何者较大。
			if (月序 - 历数[岁序].length
			// 若是向后月数过大，才采用向前的月分。否则普通情况采用向后的月分。
			> library_namespace.SEXAGENARY_CYCLE_LENGTH - 月序) {
				// 采用向前的月分。
				月序 = library_namespace.SEXAGENARY_CYCLE_LENGTH - 月序;
				// 警告，须检查(岁序<0)的情况。
				岁序 -= 月序 / LUNISOLAR_MONTH_COUNT | 0;
				月序 %= LUNISOLAR_MONTH_COUNT;
				月序 = 历数[岁序].length - 月序;
				if (月序 >= 历数[岁序][LEAP_MONTH_KEY])
					月序--;
			} else {
				// 普通情况采用向后的月分。
				// 警告，须检查(岁序>=历数.length)的情况。
				岁序 += 月序 / LUNISOLAR_MONTH_COUNT | 0;
				月序 %= LUNISOLAR_MONTH_COUNT;
			}

		}
		历数 = 岁序 < 历数.length && 历数[岁序];
		// 采用 '>=' 会取非闰月。
		if (历数 && 历数[LEAP_MONTH_KEY] <= 月序)
			月序--;
		return [ 月序, 岁序 ];
	}

	// date name of era → Date
	// 年, 月, 日 次/序(ordinal/serial/NO)
	// (start from START_YEAR, START_MONTH, START_DATE)
	// or 年, 月, 日 名(name)
	// or 年, 月, 日 干支
	// end_type = 1: 日, 2: 月, 3: 年, 纪年: 4.
	function date_name_to_Date(年, 月, 日, strict, end_type) {
		if (!this.year_start)
			this.initialize();

		var 干支, year_index = this.岁序(年), month_index;

		if (isNaN(year_index)
		//
		&& !isNaN(干支 = library_namespace.stem_branch_index(年)))
			// 处理年干支。
			year_index = this.get_year_stem_branch_index(干支);

		// 是否为月建。
		if (月)
			if (月.length === 1 && NOT_FOUND !== (干支
			//
			= library_namespace.BRANCH_LIST.indexOf(月))) {
				if (isNaN(this.岁首月建序))
					this.get_month_branch_index();
				month_index = 干支 - this.岁首月建序;
				if (month_index < 0)
					month_index
					//
					+= library_namespace.BRANCH_LIST.length;

			} else if (isNaN(month_index = this.月序(月, year_index || 0))
			//
			&& !isNaN(干支 = library_namespace.stem_branch_index(月))) {
				// 处理月干支。
				// 回传所求月干支之 [ 月序, 岁序 ]。
				month_index = this.get_month_branch_index(干支, year_index || 0);
				// 检查此年之此月是否为此干支。
				if (year_index !== month_index[1]) {
					if (!isNaN(year_index))
						library_namespace.error('date_name_to_Date: '
								+ this.岁名(year_index) + '年并无此月干支 [' + 月 + ']！');
					// 直接设定岁序。
					year_index = month_index[1];
				}
				month_index = month_index[0];
			}

		if (isNaN(year_index)) {
			// assert: !!年 === false
			// 可能只是 to_era_Date() 在作测试，看是否能成功解析？
			if (年 && library_namespace.is_debug()
					|| library_namespace.is_debug(2))
				library_namespace.warn('date_name_to_Date: 未设定或无法辨识年分[' + 年
						+ '] @ ' + this + '。');
			return new Date((end_type === 4 ? this.end : this.start).getTime());
		} else if (end_type === 3)
			year_index++;

		if (isNaN(month_index)) {
			// 可能只是 to_era_Date() 在作测试，看是否能成功解析？
			if (月 && library_namespace.is_debug()
					|| library_namespace.is_debug(2))
				library_namespace.warn('date_name_to_Date: 未设定或无法辨识月分[' + 月
						+ '] @ ' + this + '。');
			return year_index < this.calendar.length
					&& new Date(this.year_start[year_index]);
		} else if (end_type === 2)
			month_index++;

		switch (日) {
		// gettext_config:{"id":"new-moon"}
		case '朔':
			// 警告:藏历规定每月十五为望，所以初一可能并不是朔。伊斯兰历将新月初现定为每月的第一天，朔则在月末前三四天。
			日 = 1;
			break;
		case '望':
			// 警告:望可能在每月的十五或十六日。
			日 = 15;
			break;
		case '晦':
			日 = this.calendar[year_index][month_index];
			break;
		default:
			break;
		}

		// this.日序(): see date_name_to_index()
		干支 = 日 && this.日序(日, month_index === 0 && year_index);
		if (!isNaN(干支) && end_type === 1)
			干支++;
		// 取得基准 Date。
		year_index = this.date_index_to_Date(year_index, month_index,
		//
		干支 || 0,
		// 作边界检查。
		strict);
		// 处理日干支。
		if (isNaN(日) && !isNaN(干支 = library_namespace.stem_branch_index(日)))
			year_index = library_namespace.convert_stem_branch_date(干支,
					year_index);

		return year_index;
	}

	/**
	 * Date → date index of era
	 * 
	 * @param {Date}date
	 * @param {Boolean}accept_end
	 * @returns {Array} [ 岁序, 月序, 日序 | 0 ]
	 */
	function Date_to_date_index(date, accept_end) {
		if (!this.year_start)
			this.initialize();

		var date_value;
		if (is_Date(date)) {
			date_value = date.getTime()
			// 有些古老时代，例如"西汉哀帝元寿2年6月26日"，这两个数值有差异，必须修正。
			- (date.getTimezoneOffset() - present_local_minute_offset)
					* ONE_MINUTE_LENGTH_VALUE;
		} else {
			date_value = +date;
		}

		var 岁序 = this.year_start.search_sorted(date_value, {
			found : true
		}),
		//
		month_data = this.calendar[岁序], 月序 = 0, days,
		//
		日序 = Math.floor((date_value - this.year_start[岁序])
				/ ONE_DAY_LENGTH_VALUE);

		if (!month_data) {
			if (accept_end && 日序 === 0)
				// 刚好在边界上，越过年。
				// assert: date - this.end === 0 – ONE_DAY_LENGTH_VALUE
				return [ 岁序 - 1, 0, 0 ];

			// 可能只是 to_era_Date() 在作测试，看是否能成功解析。
			if (library_namespace.is_debug())
				library_namespace.error([
						'Date_to_date_index: 日期[',
						(is_Date(date) ? date : new Date(date))
								.format(standard_time_format),
						'] 并不在纪年 [' + this, '] 时段内！' ]);
			return;
		}

		while ((days = month_data[月序]) <= 日序)
			日序 -= days, 月序++;

		return [ 岁序, 月序, 日序 | 0 ];
	}

	// 把一年十二个月和天上的十二辰联系起来。
	// 闰月月建同本月。
	// 子月：大雪(12月7/8日)至小寒前一日，中气冬至。
	// 因此可以与12月7日最接近的月首，作为子月初一。
	function note_月建(date) {
		return date.月干支
		// assert: (date.月干支) 为干支 e.g., '甲子'
		&& date.月干支.charAt(1) || '';
	}

	function get_季(月_index, get_icon) {
		return 0 <= 月_index && (get_icon ? 季_Unicode : 季_LIST)[月_index / 3 | 0]
				|| '';
	}

	// 仅适用于夏历!
	function note_季(date, options) {
		var 月 = date.月序;

		// 此非季节，而为「冬十月」之类用。
		return get_季(月 - START_MONTH, options && options.icon);
	}

	// 仅适用于夏历!
	function note_孟仲季(date) {
		var 月 = date.月序;

		return 0 <= (月 -= START_MONTH)
		// 此非季节，而为「冬十月」之类用。
		&& (孟仲季_LIST[月 % 3] + get_季(月)) || '';
	}

	// 仅适用于夏历!
	function note_月律(date) {
		return 月律_LIST[date.月序 - START_MONTH];
	}

	function note_月の别名(date, 新暦) {
		// 新暦に适用する
		var index = 新暦 ? date.getMonth() : date.月序 - START_MONTH;
		return index >= 0 ? 月の别名_LIST[index] : '';
	}

	function note_旬(date) {
		var 日 = date.日;
		return isNaN(日) ? ''
		// 一个月的第一个十天为上旬，第二个十天为中旬，余下的天数为下旬。
		: 日 > 10 ? 日 > 20 ? '下' : '中' : '上';
	}

	function note_生肖(date, 图像文字) {
		if (date.年干支序 >= 0) {
			var LIST = 图像文字 ? 十二生肖图像文字_LIST : 十二生肖_LIST;
			return LIST[date.年干支序 % LIST.length];
		}
		return '';
	}

	function note_五行(date, using_地支) {
		var index = date.年干支序;
		if (using_地支) {
			// mapping
			index = note_五行.地支_mapping[index % note_五行.地支_mapping.length];
		}
		return index >= 0 ? (index % 2 ? '阴' : '阳')
		// http://zh.wikipedia.org/wiki/五行#五行与干支表
		+ 阴阳五行_LIST[(index >> 1) % 阴阳五行_LIST.length] : '';
	}
	note_五行.地支_mapping = [ 8, 5, 0, 1, 4, 3, 2, 5, 6, 7, 4, 9 ];

	function note_绕迥(date) {
		var 生肖 = note_生肖(date),
		// 第一绕迥(rabqung)自公元1027年开始算起
		// 每60年一绕迥，library_namespace.SEXAGENARY_CYCLE_LENGTH
		year_serial = date.getFullYear() - (1027 - 60);
		return '第' + library_namespace.to_Chinese_numeral(
		// 胜生周 丁卯周
		Math.floor(year_serial / 60)) + '绕迥'
		//
		+ (生肖 ? ' ' + ((year_serial % 60) + 1)
		//
		+ note_五行(date).replace(/金$/, '铁') + 生肖 : '');
	}

	function note_纳音(date, type) {
		if (type === '年') {
			date = date.岁次;
			if (!date)
				return;
		} else if (type === '月') {
			// date.月干支序===library_namespace.stem_branch_index(date.月干支)
			date = date.月干支;
			if (!date)
				return;
		}
		var index = library_namespace.stem_branch_index(date);
		// 0 – 59 干支序转纳音: 纳音_LIST[index / 2 | 0];
		// '/2': 0,1→0; 2,3→1; ...
		// or [index >>> 1]
		return 纳音_LIST[index / 2 | 0];
	}

	function note_二十八宿(date, type) {
		var index;
		if (type === '年') {
			// 14: 二十八宿_年禽_offset
			index = date.年序 + 14;
		} else if (type === '月') {
			// 在日宿当值之年，正月起角，顺布十二个月，其他仿此。
			// 19: 二十八宿_月禽_offset
			index = 19 + date.年序 * 12 + date.月序;
		} else {
			// http://koyomi8.com/sub/rekicyuu_doc01.htm
			// 日の干支などと同様、28日周期で一巡して元に戻り、これを缲り返すだけである。
			// 8: 二十八宿_日禽_offset
			index = 8
			// 不可用 "| 0"
			+ Math.floor(date.getTime() / ONE_DAY_LENGTH_VALUE);
		}
		return 二十八宿_LIST[index.mod(二十八宿_LIST.length)];
	}

	function note_二十七宿(date) {
		var index = 二十七宿_offset[date.月序] + date.日;
		return date.参照历法 !== 'CE' && index >= 0
		// 仅对于日本之旧暦与纪年，方能得到正确之暦注值！
		? 二十七宿_LIST[index % 二十七宿_LIST.length] : '';
	}

	function note_七曜(date) {
		// 七曜, 曜日
		return 七曜_LIST[date.getDay()];
	}

	function note_六曜(date) {
		var index = date.月序 + date.日;
		return date.参照历法 !== 'CE' && index >= 0
		// 六曜は元々は、1个月（≒30日）を5等分して6日を一定の周期とし（30÷5 =
		// 6）、それぞれの日を星毎に区别する为の単位として使われた。
		// https://ja.wikipedia.org/wiki/%E5%85%AD%E6%9B%9C
		// 旧暦の月の数字と旧暦の日の数字の和が6の倍数であれば大安となる。
		? 六曜_LIST[index % 六曜_LIST.length] : '';
	}

	function note_反支(date, 六日反支标记) {
		var 朔干支序 = (library_namespace
		// 月朔日干支序。
		.stem_branch_index(date) - date.日 + START_DATE)
				.mod(library_namespace.BRANCH_LIST.length),
		// 凡反支日，用月朔为正。戌、亥朔，一日反支。申、酉朔，二日反支。午、未朔，三日反支。辰、巳朔，四日反支。寅、卯朔，五日反支。子、丑朔，六日反支。
		第一反支日 = 6 - (朔干支序 / 2 | 0),
		//
		offset = date.日 - 第一反支日, 反支;
		if (offset % 6 === 0
		// 月朔日为子日之初一，亦可符合上述条件。
		&& 0 <= offset)
			if (offset % 12 === 0)
				// 睡虎地和孔家坡:12日一反支
				反支 = '反支';
			else if (六日反支标记)
				// 标记孔家坡:6日一反支
				反支 = 六日反支标记;

		return 反支 || '';
	}

	function note_血忌(date) {
		var index = date.月序;
		if (index > 0) {
			var 干支序 = ++index / 2 | 0;
			if (index % 2 === 1)
				干支序 += 6;
			if ((library_namespace.stem_branch_index(date)
			// 12: library_namespace.BRANCH_LIST.length
			- 干支序) % 12 === 0)
				return '血忌';
		}
		return '';

		index = [];
		to_list(library_namespace.BRANCH_LIST)
		// note: 示例如何计算出各月 index。
		.forEach(function(s) {
			index.push(library_namespace.stem_branch_index(s));
		});
		[ 1, 7, 2, 8, 3, 9, 4, 10, 5, 11, 6, 0 ];
		return index;
	}

	// a proxy for application.astronomy.立春年()
	var 立春年 = function(date, options) {
		if (library_namespace.立春年)
			return (立春年 = library_namespace.立春年)(date, options);

		var year = date.getFullYear(), month = date.getMonth();
		library_namespace.warn('立春年: 请先载入 application.astronomy。'
				+ '公历2月3至5日立春后才改「运」，但此处恒定为2月4日改，会因此造成误差。');
		if (month < 1 || month === 1 && date.getDate() < 4)
			// assert: 公历一、二月，中历过年前。
			year--;
		return year;
	};

	// 年紫白飞星
	// TODO: 八卦方位图
	function note_年九星(date) {
		// offset 64: 64 CE 为甲子:上元花甲 一运。其他如 1684, 1864年(康熙二十三年)亦可。
		// 180: 一个花甲，共有六十年。而三元三个花甲，总得一百八十年。
		var index = (64 - 立春年(date)).mod(180);
		// assert: 0 <= index < 180

		return 九星_LIST[index % 九星_LIST.length]
		//
		+ ' (' + library_namespace.to_stem_branch(-index) + ')';
	}

	// 月九星每15年一轮。
	function note_月九星(date) {
		var index = 立春年(date, true);
		// 1863年11月:上元甲子月
		// offset 47 = (1863 * 12 + 11) % 180
		index = (47 - index[0] * LUNISOLAR_MONTH_COUNT - index[1]).mod(180);
		// assert: 0 <= index < 180

		return 九星_LIST[index % 九星_LIST.length]
		//
		+ ' (' + library_namespace.to_stem_branch(-index) + ')';
	}

	/**
	 * 日家九星遁起始日。
	 * 
	 * 注意:<br />
	 * 请先载入 application.astronomy<br />
	 * 此处夏至、冬至皆指 CE 当年。例如 2000 年冬至指 2000/12 之冬至。
	 * 
	 * @param {Number}年
	 *            CE 当年
	 * @param {Boolean}[冬至]
	 *            取得冬至前后阳遁开始日JD
	 * 
	 * @returns {Array} [ 开始日JD, 闰 ]
	 * 
	 * @see http://koyomi8.com/sub/9sei.htm
	 */
	function 遁开始日(年, 冬至) {
		if (年 % 1 >= .5)
			冬至 = true;
		年 = Math.floor(年);

		var cache = 遁开始日[冬至 ? '冬' : '夏'];
		if (年 in cache)
			return cache[年];

		var 闰,
		// 60/2=30
		HALF_LENGTH = library_namespace
		//
		.SEXAGENARY_CYCLE_LENGTH / 2 | 0,
		// 夏至・冬至の日付を计算する
		// 夏至 90° 节气序 index 6, 冬至 270° 节气序 index 18.
		// 夏至后至冬至间: 夏至 JD, else 冬至 JD.
		至日JD = library_namespace.solar_term_JD(年, 冬至 ? 6 + 12 : 6),
		//
		至日干支序 = library_namespace.stem_branch_index(
		//
		library_namespace.JD_to_Date(至日JD)),
		// 取前一个甲子作分界日。
		开始日JD = 至日JD - 至日干支序;

		library_namespace.debug(
		//
		年 + '年' + (冬至 ? '冬至 ' : '夏至 ')
		//
		+ library_namespace.JD_to_Date(至日JD).format(
		//
		draw_era.date_options), 2);

		if (HALF_LENGTH <= 至日干支序) {
			// 取后一个甲子，最接近前至日。
			开始日JD += library_namespace.SEXAGENARY_CYCLE_LENGTH;
			// 3=366/2-遁周期(180), 只有在这范围内才需要检查是否以闰起始。
			if (至日干支序 < HALF_LENGTH + 3) {
				// 年 - 1 : 算前一年的冬至。
				var 前至日JD = library_namespace.solar_term_JD(冬至 ? 年 : 年 - 1,
				//
				冬至 ? 6 : 6 + 12),
				//
				前至日干支序 = library_namespace.stem_branch_index(
				//	
				library_namespace.JD_to_Date(前至日JD));
				library_namespace.debug(
				//
				'前至日 ' + library_namespace.JD_to_Date(前至日JD).format(
				//
				draw_era.date_options) + ' 干支序 ' + 前至日干支序, 2);
				if (前至日干支序 <= HALF_LENGTH) {
					// 顺便纪录前至日遁开始日
					遁开始日[冬至 ? '夏' : '冬'][冬至 ? 年 : 年 - 1] = [ 前至日JD - 前至日干支序 ];
					library_namespace.debug('遇日家九星の「闰」，开始日前移' + HALF_LENGTH
							+ '日。', 2);
					闰 = true;
					开始日JD -= HALF_LENGTH;
				}
			}
		}

		return 遁开始日[冬至 ? '冬' : '夏'][年] = [ 开始日JD, 闰 ];
	}

	/**
	 * 遁开始日 cache
	 */
	// 遁开始日.夏[年] = [ 夏至前后阴遁开始日JD, 闰 ];
	遁开始日.夏 = [];
	// 遁开始日.冬[年] = [ 冬至前后阳遁开始日JD, 闰 ];
	遁开始日.冬 = [];

	// 九星は年、月、日、时刻それぞれに割り当てられる。
	// http://koyomi.vis.ne.jp/doc/mlwa/201007040.htm
	// https://ja.wikipedia.org/wiki/%E4%B9%9D%E6%98%9F#.E6.97.A5.E3.81.AE.E4.B9.9D.E6.98.9F
	// http://koyomi8.com/sub/rekicyuu_doc01.htm#9sei
	// http://d.hatena.ne.jp/nobml/20121231/1356881216
	// http://www.fushantang.com/1012/1012d/j4083.html
	// http://blog.xuite.net/chen992/twblog/99860418-%E4%B8%89%E5%85%83%E4%B9%9D%E9%81%8B
	// http://www.kaiun.com.tw/share_detail.asp?niid=33
	// http://www.gtomb.com/news-31.html
	// http://wenku.baidu.com/view/3dcb027302768e9951e738c3.html
	// "冬至上元甲子起" "飞星之法上元甲子一白入中宫"
	// http://blog.xuite.net/nortonwu1015/twblog/137586855
	/**
	 * 日时九星推法
	 * 
	 * cf. "太乙数"
	 * 
	 * 注意:<br />
	 * 请先载入 application.astronomy<br />
	 */
	function note_日家九星(date) {
		var JD = library_namespace.Date_to_JD(date.offseted_value());

		// 像是 东晋哀帝隆和1年11月30日 363/1/1 必须多前溯 .5 才能保证后面 days >= 0。
		var index, 年 = date.getFullYear() - .5;
		if (date.getMonth() < 6)
			年 -= .5;
		// 确定 date 之前一至日。
		// +1 : JD 为当地当天0时。但交节时刻会在至日0时之后。因此需算到整日过完，即 JD+1。
		// 若交节时刻刚好落在隔日刚开始(子夜0时)，则今日还是应该算前一个。
		while (遁开始日(年 + .5)[0] < JD + 1)
			年 += .5;
		library_namespace.debug(
		//
		遁开始日(年) + ' - ' + JD + ' - ' + 遁开始日(年 + .5)
		//
		+ ' (' + (遁开始日(年 + .5)[0] - 遁开始日(年)[0]) + ')', 2);
		index = 遁开始日(年);

		// days: 遁开始日后经过天数。0–179
		var days = JD + 1 - index[0] | 0,
		//
		result = Object.create(null);
		result.days = days;
		result.闰 = index[1];

		// assert: 0 <= days < 210 (or 180=(366/2/60|0)*60)
		index = days
		//
		+ (index[1] ? library_namespace.SEXAGENARY_CYCLE_LENGTH : 0);

		if (年 % 1 === 0) {
			// 夏至后→冬至间。阴遁、逆飞。
			result.type = '阴遁';
			// 将 index 转为逆序。
			index = -index - 1;
		} else {
			// 冬至后→夏至间。
			result.type = '阳遁';
		}

		result.index = index = index.mod(九星_JP_LIST.length);
		result.九星 = 九星_JP_LIST[index];

		return result;
	}

	function note_三元九运(date) {
		// offset 64: 64 CE 为甲子:上元花甲 一运。其他如 1684, 1864年(康熙二十三年)亦可。
		// 180: 一个花甲，共有六十年。而三元三个花甲，总得一百八十年。
		var index = (立春年(date) - 64).mod(180);

		if (false && (index - 1 - (date.年干支序
		// 采用过年改「运」
		|| library_namespace
		// 60: library_namespace.SEXAGENARY_CYCLE_LENGTH
		.guess_year_stem_branch(date, true))) % 60 === 0)
			;
		else {
			// assert: index % 60 === (date.年干支序 ||
			// library_namespace.guess_year_stem_branch(date, true))
		}

		// get "运": 二十年一运
		index = index / 20 | 0;

		return '上中下'.charAt(index / 3 | 0) + '元'
		// + 1 : 运 starts from 1.
		+ library_namespace.to_Chinese_numeral(index + 1) + '运';
	}

	/**
	 * 为 era Date 增添标记，加上历注(暦注)之类。 add note, add_note
	 * 
	 * @param {Date}date
	 * @param {Object}[options]
	 *            附加参数/设定特殊功能与选项
	 */
	function sign_note(date, options) {
		add_offset_function(date, this);

		var date_index = this.notes, tmp, tmp2;

		if (!date_index) {
			// 初始化 era.notes
			date_index = this.notes
			// do cache.
			= Object.create(null);

			sign_note.copy_attributes.forEach(function(key) {
				if (this[key])
					date_index[key] = this[key];
			}, this);

			date_index.注 = Array.isArray(tmp = this.注) ? tmp
			// 备考
			: tmp ? [ tmp ] : [];

			// 查询某时间点（时刻）的日期资讯，如月干支等：
			// 对所有纪年，找出此时间点相应之历数：
			// 若年分起始未初始化，则初始化、解压缩之。
			// 依年分起始 Date value，以 binary search 找到年分。
			// 依该年之月分资料，找出此时间点相应之月分、日码(date of month)。

			// Object.seal(纪年);
			// date_index.name = this.name.slice(0, 4);
			date_index.name = this.name;

			date_index.纪年名 = this.toString();

			for (var tmp = this.name.length,
			// 设定其他属性。
			tmp2 = period_root; tmp > 0;) {
				tmp2 = tmp2.sub[this.name[--tmp]];
				if (!tmp2)
					break;
				Object.assign(date_index, tmp2.attributes);
			}

			// for '初始.君主: 孺子婴#1'
			主要索引名称.forEach(function(name, index) {
				if (tmp = this.name[index])
					if (date_index[name])
						if (Array.isArray(date_index[name]))
							date_index[name].unshift(tmp);
						else
							date_index[name]
							//
							= [ tmp, date_index[name] ];
					else
						date_index[name] = tmp;
			}, this);

		}

		// copy 属于本纪年的历注。
		Object.assign(date, date_index);

		// 接著 copy 仅属于本日期的历注。

		// [ 岁序, 月序, 日序 | 0 ]
		date_index = this.Date_to_date_index(date);
		if (!date_index) {
			library_namespace.error('sign_note: 加注日期于纪年 [' + this + '] 范围外！');
			date.error = 'out of range';
		} else {
			// 欲使用 date_index，应该考虑采 (date.年|date.年序, date.月序, date.日)。
			// 因为日期可能不是从1月1日开始。
			// Object.seal(date.index = date_index);

			date.年干支序 = tmp
			//
			= this.get_year_stem_branch_index() + date_index[0];
			date.年序 = this.起始年序 + date_index[0];

			date.岁次 = library_namespace.to_stem_branch(tmp);

			// 精密度至年。
			if (this.精 && (date.精 = this.精) === '年') {
				date.年 = this.岁名(date_index[0]);
			} else {
				// 日本の暦注。

				// .日名(日序, 月序, 岁序) = [ 日名, 月名, 岁名 ]
				tmp = this.日名(date_index[2], date_index[1], date_index[0])
						.reverse();
				tmp2 = tmp[1];
				date.闰月 = typeof tmp2 === 'string'
				//
				&& tmp2.charAt(0) === LEAP_MONTH_PREFIX;
				date.月序 = date.闰月 ? +tmp2
						.slice(/* LEAP_MONTH_PREFIX.length */1) : tmp2;

				if (options.numeral)
					tmp = numeralize_date_format(tmp, options.numeral);
				date.年 = tmp[0];
				date.月 = tmp[1];
				date.日 = tmp[2];

				if (this.年名) {
					date.年名称 = this.年名;
				}

				if (this.参照历法)
					date.参照历法 = this.参照历法;

				if (0 < +tmp[1]) {
					// http://www.geocities.jp/mishimagoyomi/12choku/12choku.htm

					// var new_year_day = this.year_start[date_index[0]];
					// TODO: 岁时记事

					// 冬至の顷（旧暦11月）に北斗七星のひしゃくの柄の部分が真北（子）に向くため、この日を「建子」の月としました。そこで旧暦11月节（大雪）后の最初の子の日を「建」と定めました。

					// 《通纬·孝经援神契》：「大雪后十五日，斗指子，为冬至，十一月中。阴极而阳始至，日南至，渐长至也。」
					// 大雪后首子日，十二直为「建」。但12节重复前一日之十二直，因此须先计算12节。
					// http://koyomi8.com/sub/rekicyuu_doc01.htm#jyuunicyoku
					if (false)
						date.十二直 = 十二直_LIST[(十二直_LIST.length - tmp[1]
						// 误:日支与当月之月建相同，则十二直为"建"。
						+ library_namespace.stem_branch_index(date))
								% 十二直_LIST.length];
				}

				// 计算当月日名/日码。
				tmp2 = this.calendar[date_index[0]];
				tmp = tmp2[date_index[1]];
				if (date_index[1] === 0
				//
				&& (START_DATE_KEY in tmp2))
					tmp += tmp2[START_DATE_KEY] - START_DATE;

				// 大月
				tmp2 = this.大月;
				date.大小月 = tmp2 ? tmp < tmp2 ? '小' : '大'
				//
				: tmp === 大月 ? '大' : tmp === 小月 ? '小' : '(' + tmp + '日)';

				// 取得当年闰月 index。
				tmp = this.calendar[
				//
				tmp2 = date_index[0]][LEAP_MONTH_KEY];
				date.月干支 = library_namespace.to_stem_branch(
				// 基准点。
				this.get_month_branch_index()
				// 就算有闰月，每年也不过移动 LUNISOLAR_MONTH_COUNT。
				+ LUNISOLAR_MONTH_COUNT * tmp2 + date_index[1]
				// 为非一月开始的纪年作修正。
				- (0 < tmp2 && (tmp2 = this.calendar[0][START_KEY])
				//
				? tmp2 - START_MONTH : 0)
				// 闰月或在闰月之后的 index，都得减一。
				- (!tmp || date_index[1] < tmp ? 0 : 1));

				// var new_year_day =
				// this.year_start[date_index[0]],new_year_day_stem_branch_index;
				// if
				// (!this.calendar[0][START_KEY]||this.calendar[0][START_KEY]===START_MONTH){new_year_day_stem_branch_index=(library_namespace.to_stem_branch(new_year_day)+START_DATE-this.calendar[START_DATE_KEY]).mod(library_namespace.SEXAGENARY_CYCLE_LENGTH);}
				// TODO: date.岁时记事=

			}
		}

		if (false)
			date.日干支 = date.format({
				format : '%日干支',
				locale : library_namespace.gettext.to_standard('Chinese')
			});

		// 后期修正。post fix.
		if (typeof this.fix === 'function')
			this.fix(date);

		// after care.
		if (date.注.length === 0)
			delete date.注;

		return date;
	}

	Object.assign(sign_note, {
		// 预设会 copy 的纪年历注。
		// @see function translate_era(era) @ _test suite/era.js
		// "精"会特别处理。
		// 据: 依据/根据/出典/原始参考文献/资料引用来源/典拠。
		copy_attributes : to_list('据,准,疑,传说,历法,'
				+ '君主名,表字,君主号,讳,谥,庙号,生,卒,君主性别,在位,加冕,年号,父,母,配偶'),
		// 历注, note
		// 减轻负担:要这些历注的自己算。
		notes : {
			"月建" : note_月建,
			"季" : note_季,
			"旬" : note_旬,
			// gettext_config:{"id":"chinese-zodiac"}
			"生肖" : note_生肖,
			// gettext_config:{"id":"wu-xing"}
			"五行" : note_五行,
			"绕迥" : note_绕迥,
			// 紫白飞星
			"年九星" : note_年九星,
			"月九星" : note_月九星,
			"日家九星" : note_日家九星,
			"三元九运" : note_三元九运,

			"孟仲季" : note_孟仲季,
			"月律" : note_月律,
			// gettext_config:{"id":"japanese-month-name"}
			"月の别名" : note_月の别名,

			"反支" : note_反支,
			"血忌" : note_血忌,
			// gettext_config:{"id":"7-luminaries"}
			"七曜" : note_七曜,
			// gettext_config:{"id":"6-luminaries"}
			"六曜" : note_六曜,
			"纳音" : note_纳音,
			// gettext_config:{"id":"28-mansions"}
			"二十八宿" : note_二十八宿,
			// gettext_config:{"id":"27-mansions"}
			"二十七宿" : note_二十七宿
		}
	});

	Object.assign(Era.prototype, {
		// 月次，岁次与 index 之互换。
		// 注意：此处"序"指的是 Array index，从 0 开始。
		// "次"则从 1 开始，闰月次与本月次相同。
		// 若无特殊设定，则"次"="名"。
		岁序 : year_name_to_index,
		月序 : month_name_to_index,
		日序 : date_name_to_index,
		岁名 : year_index_to_name,
		月名 : month_index_to_name,
		日名 : date_index_to_name,

		shift_month : shift_month,

		initialize : initialize_era_date,
		get_month_branch_index : get_month_branch_index,
		get_year_stem_branch_index : get_year_stem_branch_index,
		date_name_to_Date : date_name_to_Date,
		date_index_to_Date : date_index_to_Date,
		Date_to_date_index : Date_to_date_index,

		sign_note : sign_note,
		// 若侦测是否已经存在，则 IE 8 得特别设定。恐怕因原先已经存在?
		toString : get_era_name
	});

	// ---------------------------------------------------------------------//

	// private 工具函数：分割资料档使用之日期(起讫时间)。
	// return [ {String}起始时间, {String}讫, parser ]
	function parse_duration(date, era) {
		var tmp;
		if (typeof date === 'string' && (tmp = date.match(
		// Must include PERIOD_DASH
		// [ matched, parser, 起, 讫1, 讫2 ]
		/^\s*(?:([^:]+):)?\s*([^–~－—─～〜﹣至:]*)(?:[–~－—─～〜﹣至]\s*(.*)|(\+\d+))\s*$/
		// @see CeL.date.parse_period.PATTERN
		)))
			date = [ tmp[2], tmp[3] || tmp[4], tmp[1] ];

		if (Array.isArray(date) && date.length > 0) {
			if (!date[2]) {
				// 起始时间
				tmp = date[0];
				// 针对从下一笔纪年调来的资料。
				if (typeof tmp === 'string' && (tmp = tmp
				// @see CeL.date.parse_period.PATTERN
				// Must include PERIOD_DASH
				.match(/^\s*(?:([^:]+):)?\s*([^–~－—─～〜﹣至:]*)/)))
					date = [ tmp[2], date[1], tmp[1] ];
			}

			if (/^\d{1,2}\/\d{1,2}$/.test(date[1])
			//
			&& (tmp = date[0].match(/^(\d+\/)\d{1,2}\/\d{1,2}$/)))
				// 补上与起始时间相同年分。
				date[1] = tmp[1] + date[1];

			return date;
		}

		library_namespace.error('parse_duration: 无法判别 [' + era.toString()
				+ '] 之起讫时间！');
		// return date;
	}

	/**
	 * 工具函数：正规化日期。
	 * 
	 * @private
	 */
	function normalize_date(date, parser, period_end, get_date) {
		library_namespace.debug('以 parser [' + parser + '] 解析 [' + date + ']。',
				2, 'normalize_date');
		if (!date)
			return '';

		var parsed;
		if (!is_Date(date)
				&& !period_end
				&& (!parser || parser === 'CE')
				&& /^-?\d/.test(date)
				&& (parsed = Julian_day(date, parser || standard_time_parser,
						true)))
			// 采用 Julian_day 较快。
			date = Julian_day.to_Date(parsed);

		if (!is_Date(date)) {
			var string, to_period_end = period_end && function() {
				var tmp, matched = string.match(
				// 警告:并非万全之法!
				/(-?\d+)(?:[\/.\-年 ](\d+)(?:[\/.\-月 ](\d+))?)?/);

				if (matched) {
					matched.shift();
					while (!(tmp = matched.pop()))
						;
					matched.push(++tmp);
					string = matched.join('/');
					period_end = false;
				}
			};

			// 像是 'Maya'，在登记完 Maya 纪年后便存在。
			// 因此需要先检查 (parser in String_to_Date.parser)
			// 再检查 (parser in search_index)
			if (parser in String_to_Date.parser) {
				string = String(date).trim();
				date = string.to_Date({
					parser : parser === PASS_PARSER ? undefined : parser
							|| DEFAULT_DATE_PARSER,
					period_end : period_end,
					// 于 CE 可避免 80 被 parse 成 1980。
					year_padding : 0
				});

			} else if (parser in search_index) {
				var era_Set = search_index[parser];
				if (!(era_Set instanceof Set)
				// 确定 parser 为唯一且原生的 era key。
				|| era_Set.size !== 1) {
					library_namespace.error(
					//
					'normalize_date: 无法确认 parser：共有 ' + era_Set.size + ' 个 ['
							+ parser + ']！');
					return;
				}
				// 取得那唯一个 parser。
				era_Set.forEach(function(era) {
					parser = era;
				});
				string = date;
				period_end && to_period_end();
				date = to_era_Date({
					纪年 : parser,
					日期 : string
				}, {
					date_only : true
				});
				if (period_end) {
					// 警告:取后一日,并非万全之法!
					date.setDate(date.getDate() + 1);
				}

			} else if ((/^-?\d{1,4}$/.test(string = String(date).trim())
			// 因为 String_to_Date 不好设定仅 parse ('80') 成
			// '80/1/1'，因此在此须自己先作个 padding。
			? (string = string.replace(/^(\d{1,2})$/, '$1'.pad(4, 0)))
			//
			: '' === string.replace(
			// 先确定 .to_Date 有办法 parse。
			String_to_Date.default_parser.date_first, ''))
					//
					&& typeof string.to_Date === 'function'
					// 为了使 'Babylonian-556/4' 不被执行 string.to_Date()
					// 参考 (年_SOURCE)
					&& /^[前\-−‐]?\d/.test(string)
					//
					&& (parser = string.to_Date({
						parser : parser === PASS_PARSER ? undefined : parser
								|| DEFAULT_DATE_PARSER,
						period_end : period_end,
						// 于 CE 可避免 80 被 parse 成 1980。
						year_padding : 0
					}))) {
				date = parser;

			} else {
				// e.g., 鲁春秋-722, 秦汉历-246
				period_end && to_period_end();
				date = to_era_Date(string, {
					date_only : true
				});
				if (period_end) {
					// 警告:取后一日,并非万全之法!
					date.setDate(date.getDate() + 1);
				}
			}
		} else {
			// 已经处理过了?
		}

		if (is_Date(date)) {
			if (get_date) {
				return date;
			} else if (typeof date.format === 'function') {
				return date.format(DATE_NAME_FORMAT);
			}
		}

		library_namespace.error('normalize_date: 无法解析 [' + date + ']！');
	}

	/**
	 * 在可适度修改或检阅纪年资料的范畴内，极小化压缩纪年的历数资料。<br />
	 * 会更改到 plain_era_data！
	 * 
	 * @example <code>
	CeL.era.pack('/文宗/天历|1329/8/25~|2/8=30;29;29;30;30\t29;30;30;29');
	 * </code>
	 * 
	 * @param {Array|Object|String}plain_era_data
	 *            纪年资料。
	 * 
	 * @returns {String}压缩后的纪年资料。
	 */
	function pack_era(plain_era_data) {

		// 单笔/多笔共用函数。

		function pre_parse(era) {
			if (typeof era === 'string')
				era = era.split(pack_era.field_separator);
			if (Array.isArray(era) && era.length === 1 && era[0].includes(
			//
			pack_era.month_separator))
				// gettext_config:{"id":"era-name"}
				era.unshift('纪年', '');
			if (Array.isArray(era) && 1 < era.length) {
				// 使 pack_era() 可采用 Era / 压缩过的日期资料 为 input。
				// TODO: 尚未完善。应直接采用 parse_era 解析。
				era[0] = era[0].split(pack_era.era_name_classifier);
				(era[2] = era[2].split(pack_era.year_separator))
						.forEach(function(date, index) {
							era[2][index] = date
									.split(pack_era.month_separator);
						});
				era = {
					纪年 : era[0],
					起讫 : parse_duration(era[1], era[0])
					// @see CeL.date.parse_period.PATTERN
					// Must include PERIOD_DASH
					// assert: 已经警示过了。
					|| era[1].split(/[–~－—─～〜﹣至]/),
					历数 : era[2]
				};
			}
			return era;
		}

		// -----------------------------
		// 处理多笔纪年。

		if (Array.isArray(plain_era_data)) {
			var last_era = [],
			/** {Date}上一纪年结束日期。 */
			last_end_date, era_list = [];

			plain_era_data.forEach(function(era) {
				if (!library_namespace.is_Object(
				//
				era = pre_parse(era))) {
					library_namespace.error('pack_era: 跳过资料结构错误的纪年资料！');
					return;
				}

				// 简并纪年名称。
				var i = 0, this_era = era.纪年, no_inherit;
				if (!Array.isArray(this_era))
					this_era = [ this_era ];
				for (; i < this_era.length; i++)
					if (!no_inherit && this_era[i] === last_era[i])
						this_era[i] = '';
					else {
						no_inherit = true;
						if (this_era[i] !== parse_era.inherit)
							last_era[i] = this_era[i] || '';
					}
				era.纪年 = this_era;

				// 简并起讫日期。
				// 起讫 : [ 起, 讫, parser ]
				if (!(this_era = parse_duration(era.起讫, this_era))) {
					library_namespace.error('pack_era(Array): 跳过起讫日期错误的纪年资料！');
					return;
				}
				// 回存。
				era.起讫 = this_era;

				// 正规化日期。
				// assert: 整个 era Array 都使用相同 parser。

				// 若上一纪年结束日期 == 本纪年开始日期，
				// 则除去上一纪年结束日期。
				if (
				// cache 计算过的值。
				(this_era[0] = normalize_date(this_era[0], this_era[2]
						|| PASS_PARSER))
						&& this_era[0] === last_end_date) {
					library_namespace.debug('接续上一个纪年的日期 [' + last_end_date
							+ ']。除去上一纪年结束日期。', 2);
					last_era.date[1] = '';

					// 这是采除去本纪年开始日期时的方法。
					// this_era[0] = '';

					// 之所以不采除去本纪年的方法，是因为：
					// 史书通常纪载的是纪年开始的日期，而非何时结束。
				} else
					library_namespace.debug('未接续上一个纪年的日期: [' + last_end_date
							+ ']→[' + this_era[0] + ']。', 2);

				if (持续日数_PATTERN.test((last_era.date = this_era)[1])) {
					(last_end_date = normalize_date(this_era[0], this_era[2]
							|| PASS_PARSER, true, true)).setDate(+this_era[1]);
					last_end_date = normalize_date(last_end_date);
					library_namespace.debug('讫时间 "+d" [' + this_era[1]
							+ '] : 持续日数 [' + last_end_date + ']。', 2);
				} else {
					last_end_date = normalize_date(this_era[1].trim(),
							this_era[2] || PASS_PARSER, true);
					library_namespace.debug('讫时间 "－y/m/d" [' + this_era[1]
							+ '] : 指定 end date [' + last_end_date + ']。', 2);
				}

				era_list.push(era);
			});

			// 因为可能动到前一笔资料，只好在最后才从头再跑一次。
			library_namespace.debug('开始 pack data。', 2);
			last_era = [];
			era_list.forEach(function(era) {
				last_era.push(pack_era(era));
			});

			library_namespace.debug('共转换 ' + last_era.length + '/'
					+ era_list.length + '/' + plain_era_data.length + ' 笔纪录。');

			return last_era;
		}

		// -----------------------------
		// 处理单笔纪年。

		if (!library_namespace.is_Object(
		//
		plain_era_data = pre_parse(plain_era_data))) {
			library_namespace.error('pack_era: 无法判别纪年资料！');
			return plain_era_data;
		}

		// 至此 plain_era_data = {
		// 纪年 : [ 朝代, 君主(帝王), 纪年名称 ],
		// 起讫 : [ 起, 讫, parser ],
		// 历数 : [ [1年之月分资料], [2年之月分资料], .. ],
		// 其他附加属性 : ..
		// }

		var i = 0, j,
		//
		year_data,
		// 当前年度
		year_now = START_YEAR,
		// 当前月分
		month_now,
		// 压缩用月分资料
		month_data,
		//
		month_name,
		//
		前项已压缩,
		// {String} 二进位闰月 index
		leap_month_index_base_2, 日数,
		//
		年名, 月名, 起始日码,
		//
		to_skip = {
			纪年 : 0,
			起讫 : 1,
			历数 : 2
		}, packed_era_data,
		//
		纪年名称 = plain_era_data.纪年,
		//
		起讫时间 = parse_duration(plain_era_data.起讫, 纪年名称),
		// calendar_data
		年度月分资料 = plain_era_data.历数;

		if (!起讫时间) {
			起讫时间 = [];
			// return;
		}

		if (!Array.isArray(年度月分资料) || !年度月分资料[0]) {
			library_namespace.error('pack_era: 未设定年度月分资料！');
			return;
		}

		if (Array.isArray(纪年名称))
			纪年名称 = 纪年名称.join(pack_era.era_name_classifier)
			//
			.replace(pack_era.era_name_重复起头, pack_era.era_name_classifier)
			//
			.replace(pack_era.era_name_符号结尾, '');
		if (!纪年名称 || typeof 纪年名称 !== 'string') {
			library_namespace.error(
			//
			'pack_era: 无法判别纪年名称: [' + 纪年名称 + ']');
			return;
		}

		// 简并月分资料。
		for (; i < 年度月分资料.length; i++, year_now++) {
			year_data = 年度月分资料[i];
			// 每年自一月开始。
			month_now = START_MONTH;
			month_data = [];
			leap_month_index_base_2 = '';
			for (j = 0; j < year_data.length; j++, month_now++) {
				// 允许之日数格式：
				// 日数
				// '起始日码=日数'
				// [ 起始日码, 日数 ]
				if (isNaN(日数 = year_data[j])) {
					if (typeof 日数 === 'string')
						日数 = 日数.split('=');

					if (!Array.isArray(日数) || 日数.length !== 2) {
						library_namespace.error(
						//
						'pack_era: 无法辨识日数资料 [' + year_data[j] + ']！');
						month_data = null;

					} else {
						if (起始日码 = parse_calendar_date_name(
						//
						月名 = String(日数[0])))
							// [ 年名, 月名, 起始日码 ]
							年名 = 起始日码[0], 月名 = 起始日码[1], 起始日码 = 起始日码[2];

						else {
							library_namespace.warn(
							//
							'pack_era: 无法辨识纪年 [' + 纪年名称 + '] ' + year_now
									+ '年之年度月分资料 ' + j + '/' + year_data.length
									+ '：起始日码 [' + 月名 + ']，将之迳作为月分名！');
							年名 = 起始日码 = '';
						}

						// assert: 至此 (年名), (月名), (起始日码) 皆已设定。

						日数 = 日数[1];

						if (year_now == 年名)
							年名 = '';
						if (month_now == 月名)
							月名 = '';
						if (START_DATE == 起始日码)
							起始日码 = '';

						if ((month_name = 月名) || 年名 || 起始日码) {
							// 可能为: [闰闰]?\d+, illegal.

							if (i === 0 && j === 0 && !起始日码
									&& (month_name = month_name.match(
									//
									MONTH_NAME_PATTERN))) {
								library_namespace.info(
								//
								'pack_era: 纪年 [' + 纪年名称 + '] '
								//
								+ (年名 || year_now) + '年：起始的年月分并非 ' + year_now
										+ '/' + month_now + '，而为 ' + 年名 + '/'
										+ 月名);

								// 将元年前面不足的填满。
								// 为了增高压缩率，对元年即使给了整年的资料，也仅取从指定之日期开始之资料。
								month_data = to_list(new Array(
								// reset
								month_now = +month_name[2]
										+ (month_name[1] ? 1 : 0)).join('0'));
							}

							// 处理简略表示法: '闰=\d+'
							if (月名 === LEAP_MONTH_PREFIX)
								月名 += month_now - 1;
							// 可压缩: 必须为闰(month_now - 1)
							if ((month_name = 月名) !== LEAP_MONTH_PREFIX
									+ (month_now - 1)
									|| 年名 || 起始日码) {
								if ((month_name = 月名)
								//
								!== LEAP_MONTH_PREFIX + (month_now - 1)
										&& (i > 0 || j > 0)) {
									library_namespace.warn(
									//
									'pack_era: 纪年 [' + 纪年名称 + '] '
									//
									+ year_now + '年：日期非序号或未按照顺序。月分资料 '
											+ (j + START_MONTH) + '/'
											+ year_data.length + ' ['
											+ year_now + '/' + month_now + '/'
											+ START_DATE + '] → [' + (年名 || '')
											+ '/' + (月名 || '') + '/'
											+ (起始日码 || '') + ']');
									month_data = null;
								}

							} else if (leap_month_index_base_2) {
								library_namespace.error(
								//
								'pack_era: 本年有超过1个闰月！');
								month_data = null;

							} else {
								// 处理正常闰月。
								if (month_data) {
									leap_month_index_base_2 =
									// 二进位
									month_data.length
									//
									.toString(RADIX_2);
									// 预防
									// leap_month_index_base_2
									// 过短。
									leap_month_index_base_2
									//
									= LEAP_MONTH_PADDING
									//
									.slice(0, LEAP_MONTH_PADDING.length
									//
									- leap_month_index_base_2.length)
											+ leap_month_index_base_2;
								} else
									leap_month_index_base_2
									//
									= month_now;

								month_now--;
							}

							if (month_name = (年名 ? 年名 + '/' : '') + (月名 || '')
									+ (起始日码 ? '/' + 起始日码 : ''))
								month_name += '=';

							if (year_data[j] != (month_name += 日数))
								year_data[j] = month_name;

							if (年名 !== '' && !isNaN(年名)) {
								library_namespace.debug('year: ' + year_now
										+ ' → ' + 年名, 2);
								year_now = 年名;
							}

							if (月名 !== ''
									&& typeof 月名 === 'string'
									&& !isNaN(月名 = 月名.replace(
											MONTH_NAME_PATTERN, '$2'))
									&& month_now != 月名) {
								library_namespace.debug('month: ' + month_now
										+ ' → ' + 月名, 2);
								month_now = 月名;
							}

						} else if (year_data[j] != 日数)
							// 可省略起始日码的情况。
							year_data[j] = 日数;

					}
				}

				if (month_data)
					if (日数 in MONTH_DAY_INDEX) {
						month_data.push(MONTH_DAY_INDEX[日数]);
					} else {
						library_namespace.warn(
						//
						'pack_era: 错误的日数？[' + 日数 + ']日。');
						month_data = null;
					}
			}

			if (month_data) {
				j = LUNISOLAR_MONTH_COUNT + (leap_month_index_base_2 ? 1 : 0);
				if (month_data.length < j) {
					// padding
					Array_push(
					//
					month_data, to_list(new Array(j + 1 - month_data.length)
							.join(0)));
				} else if (month_data.length > j) {
					library_namespace.warn('pack_era: 纪年 [' + 纪年名称 + '] '
							+ year_now + '年：月分资料过长！ (' + month_data.length
							+ '>' + j + ') month_data: ' + month_data);
				}

				if (library_namespace.is_debug(2))
					j = '] ← ['
							+ month_data.join('')
							+ (leap_month_index_base_2 ? ' '
									+ leap_month_index_base_2 : '') + '] ← ['
							+ year_data.join(pack_era.month_separator) + ']';
				month_data = parseInt(
				// 为了保持应有的长度，最前面加上 1。
				'1' + month_data.join('') + leap_month_index_base_2, RADIX_2)
				//
				.toString(PACK_RADIX);

				if (month_data.length > YEAR_CHUNK_SIZE)
					library_namespace.warn('pack_era: 纪年 [' + 纪年名称 + '] '
							+ year_now + '年：月分资料过长！ (' + month_data.length
							+ '>' + YEAR_CHUNK_SIZE + ') month_data: '
							+ month_data);
				else if (month_data.length < YEAR_CHUNK_SIZE
				// 非尾
				&& i < 年度月分资料.length - 1) {
					if (month_data.length < YEAR_CHUNK_SIZE - 1
					// 非首
					&& i > 0)
						// 非首非尾
						library_namespace.warn('pack_era:纪年 [' + 纪年名称 + '] '
								+ year_now + '年：月分资料过短！ (' + month_data.length
								+ '<' + YEAR_CHUNK_SIZE + ') month_data: '
								+ month_data);
					// 注意：闰月之 index 是 padding 前之资料。
					month_data += PACKED_YEAR_CHUNK_PADDING.slice(0,
							YEAR_CHUNK_SIZE - month_data.length);
				}
				library_namespace.debug('[' + month_data + j, 2);

				if (i === 0 && /\=./.test(year_data[0]))
					month_data = year_data[0].replace(/[^=]+$/, '')
							+ month_data;
				年度月分资料[i] = month_data;

			} else {
				// 可能只是 to_era_Date() 在作测试，看是否能成功解析。
				if (library_namespace.is_debug())
					library_namespace.warn(
					//
					'pack_era: 无法压缩纪年 [' + 纪年名称 + '] ' + year_now + '年资料 ['
							+ year_data.join(pack_era.month_separator) + ']');
				// 年与年以 pack_era.year_separator 分隔。
				// 月与月以 pack_era.month_separator 分隔。
				年度月分资料[i] = (前项已压缩 ? pack_era.year_separator : '')
						+ year_data.join(pack_era.month_separator)
						+ pack_era.year_separator;
			}

			前项已压缩 = !!month_data;
		}

		年度月分资料[i - 1] = 前项已压缩 ? 年度月分资料[i - 1].replace(/\s+$/, '')
				: 年度月分资料[i - 1].slice(0, -1);

		起讫时间[0] = normalize_date(起讫时间[0], 起讫时间[2] || PASS_PARSER);
		if (!持续日数_PATTERN.test(起讫时间[1]))
			// assert: isNaN(起讫时间[1])
			起讫时间[1] = normalize_date(起讫时间[1], 起讫时间[2] || PASS_PARSER);
		// 去掉相同年分。
		// 800/1/1－800/2/1 → 800/1/1–2/1
		if ((i = 起讫时间[0].match(/^[^\/]+\//)) && 起讫时间[1].indexOf(i = i[0]) === 0)
			起讫时间[1] = 起讫时间[1].slice(i.length);
		packed_era_data = [ 纪年名称, (起讫时间[2] ? 起讫时间[2] + ':' : '')
		//
		+ 起讫时间[0] + PERIOD_DASH + 起讫时间[1], 年度月分资料.join('') ];

		// 添加其他附加属性名称。
		for (i in plain_era_data)
			if (!(i in to_skip))
				// TODO: 检查属性是否有特殊字元。
				packed_era_data.push(i + '=' + plain_era_data[i]);

		return packed_era_data.join(pack_era.field_separator);
	}

	parse_era.inherit = '=';
	pack_era.field_separator = '|';
	// assert: .length === 1
	pack_era.year_separator = '\t';
	// assert: .length === 1
	pack_era.month_separator = ';';
	pack_era.era_name_separator = pack_era.month_separator;

	pack_era.era_name_classifier = '/';
	pack_era.era_name_重复起头 = new RegExp('^\\' + pack_era.era_name_classifier
			+ '{2,}');
	// 应当用在 "朝代//" 的情况，而非 "/君主/"。
	pack_era.era_name_符号结尾 = new RegExp('\\' + pack_era.era_name_classifier
			+ '+$');

	// ---------------------------------------------------------------------//
	// private 工具函数。

	// set time zone / time offset (UTC offset by minutes)
	function set_minute_offset(date, minute_offset, detect_if_configured) {
		// 侦测/预防重复设定。
		if (detect_if_configured)
			if ('minute_offset' in date) {
				// 已设定过。
				if (date.minute_offset !== minute_offset)
					library_namespace.error('set_minute_offset: 之前已将 ' + date
							+ ' 设定成 ' + date.minute_offset + ' 分钟，现在又欲设定成 '
							+ minute_offset + ' 分钟！');
				return;
			} else
				date.minute_offset = minute_offset;
		date.setMinutes(date.getMinutes() - minute_offset);
	}

	function create_era_search_pattern(get_pattern) {
		if (!era_search_pattern) {
			era_key_list = [];
			for ( var key in search_index)
				era_key_list.push(key);
			library_namespace.debug(
			//
			'初始化 search pattern: ' + era_key_list.length + ' era keys', 3);

			// 排序:长的 key 排前面。
			era_key_list.sort(function(key_1, key_2) {
				return key_2.length - key_1.length || era_count_of_key(key_2)
						- era_count_of_key(key_1);
			});
			// 从最后搜寻起。
			// 从后端开始搜寻较容易一开始就取得最少的候选者（越后面特异度越高），能少做点处理，较有效率。
			// 且可能较正确。 e.g., "他国王+纪年+年"，应优先选用 纪年+年 而非 他国王+年。
			// 因为采用 /().*?$/ 的方法不一定能 match 到所需（按顺序）的 key，只好放弃
			// /().*?$/。
			era_search_pattern = new RegExp('(?:' + era_key_list.join('|')
			// escape.
			.replace(/([()])/g, '\\$1')
			// 处理 space。
			.replace(/\s+/g, '\\s*') + ')$',
			// 对分大小写之名称，应允许混用。
			'i');
		}

		return get_pattern ? era_search_pattern : era_key_list;
	}

	// private 工具函数。
	function compare_start_date(era_1, era_2) {
		return era_1.start - era_2.start;
	}

	// 避免重复设定或覆盖原有值。 set_attribute()
	// object[key] = value
	// TODO: {Array}value
	function add_attribute(object, key, value, prepend) {
		if (key in object) {
			// 有冲突。
			var values = object[key];
			if (Array.isArray(values)) {
				// 不重复设定。
				if (!values.includes(value))
					// prepend or append
					if (prepend)
						values.unshift(value);
					else
						values.push(value);
			} else if (values !== value)
				object[key] = prepend ? [ value, values ] : [ values, value ];
		} else {
			// 一般情况。
			object[key] = value;
		}
	}

	function parse_month_name(月名, 月名_Array) {
		月名 = 月名.split(pack_era.month_separator);
		if (月名.length > 0) {
			if (!Array.isArray(月名_Array))
				月名_Array = [];

			var index = 0, matched;
			月名.forEach(function(名) {
				名 = 名.trim();
				if ((matched = 名.match(/^(\d+)\s*:\s*(.+)$/))
						&& START_MONTH <= matched[1])
					index = matched[1] - START_MONTH, 名 = matched[2];
				if (名)
					月名_Array[index++] = 名;
			});
		}

		return 月名_Array;
	}

	function get_closed_year_start(date) {
		var year = date.getFullYear(), 前 = new Date(0, 0),
		// 仅使用 new Date(0) 的话，会含入 timezone offset (.getTimezoneOffset)。
		// 因此得使用 new Date(0, 0)。
		后 = new Date(0, 0);

		// incase year 0–99
		前.setFullYear(year, 0, 1);
		后.setFullYear(year + 1, 0, 1);

		return date - 前 < 后 - date ? 前 : 后;
	}

	// 处理朝代纪年之 main functions。

	// build data (using insertion):
	// parse era data
	function parse_era(era_data_array, options) {
		if (!era_data_array) {
			// Invalid input.
			if (options && options.国家) {
				// 可能由CeL.env.era_data_load()筛选过。
				library_namespace.error('Unknown country: ' + options.国家);
			}
			return;
		}

		function pre_parse_纪年资料(index) {
			var i, j, 附加属性, era_data = era_data_array[index];
			if (typeof era_data === 'string')
				era_data = era_data.split(pack_era.field_separator);

			else if (library_namespace.is_Object(era_data)) {
				附加属性 = era_data;
				if (era_data.data) {
					era_data = era_data.data.split(pack_era.field_separator);
					delete 附加属性.data;
				} else
					era_data = [];

				for (i in 纪年名称索引值)
					// 当正式名称阙如时，改附加属性作为正式名称。
					if (!era_data[j = 纪年名称索引值[i]] && (i in 附加属性)) {
						era_data[j] = 附加属性[i];
						delete 附加属性[i];
					}
			}

			if (!Array.isArray(era_data) || era_data.length < 2) {
				library_namespace.error('parse_era.pre_parse_纪年资料: 无法判别纪年 ['
						+ index + '] 之资料！');
				return;
			}

			if (!era_data.parsed) {

				if (era_data.length < 3) {
					if (library_namespace.is_Object(i = era_data[1]))
						附加属性 = i;
					else
						i = [ i ];
					era_data = era_data[0].split(pack_era.field_separator);
				} else
					i = era_data.slice(3);

				if (!附加属性)
					附加属性 = Object.create(null);
				i.forEach(function(pair) {
					pair = pair.trim();
					if (j = pair.match(
					// 允许 "\n"
					/^([^=]+)=([\s\S]+)$/))
						add_attribute(附加属性, j[1].trim(), j[2].trim());
					else if (/^[^\s,.;]+$/.test(pair))
						// 当作属性名称，预设将属性定为 true。
						add_attribute(附加属性, pair, true);
					else
						library_namespace.warn(
						//
						'pre_parse_纪年资料: 无法解析属性值[' + pair + ']！');
				});

				era_data.length = 3;
				era_data[3] = 附加属性;
				era_data.parsed = true;
				// 回存。
				era_data_array[index] = era_data;
			}
			return era_data;
		}

		// 前置处理。
		if (!library_namespace.is_Object(options))
			options = Object.create(null);

		if (!Array.isArray(era_data_array))
			era_data_array = [ era_data_array ];

		// 主要功能。
		var 前一纪年名称 = [],
		//
		国家 = options.国家 || parse_era.default_country,
		/** {Era}上一纪年资料 @ era_list。 */
		last_era_data,
		// 纪元所使用的当地之 time zone / time offset (UTC offset by minutes)。
		// e.g., UTC+8: 8 * 60 = 480
		// e.g., UTC-5: -5 * 60
		minute_offset = era_data_array.minute_offset
		// 直接将时间设定成「纪元使用地真正之时间」使用。
		// (era_data_array.minute_offset || 0) +
		// String_to_Date.default_offset
		;

		function for_era_data(era_data, index) {

			if (!(era_data = pre_parse_纪年资料(index)))
				return;

			var tmp, i, j, k,
			// 纪年:纪年名称
			纪年 = era_data[0],
			/** {Array}起讫日期 [ {Date}起, {Date}讫, parser ] */
			起讫 = era_data[1],
			//
			历数 = era_data[2], 附加属性 = era_data[3];

			// 至此已定出 (纪年), (起讫), (历数), (其他附加属性)，接下来作进一步解析。

			if (纪年 && !Array.isArray(纪年))
				纪年 = String(纪年).split(pack_era.era_name_classifier);
			if (!纪年 || 纪年.length === 0) {
				library_namespace.error('parse_era: 无法判别纪年 [' + index
						+ '] 之名称资讯！');
				return;
			}

			library_namespace.debug(
			//
			'前期准备：正规化纪年 [' + 纪年 + '] 之名称资讯。', 2);

			// 纪年 = [ 朝代, 君主(帝王), 纪年 ]
			// 配合 (纪年名称索引值)
			if (纪年.length === 1 && 纪年[0]) {
				// 朝代兼纪年：纪年=朝代
				前一纪年名称 = [ 纪年[2] = 纪年[0] ];

			} else {
				if (!纪年[0] && (tmp = 前一纪年名称.length) > 0) {
					// 填补 inherited 继承值/预设值。
					// 得允许前一位有纪年，后一位无；以及相反的情况。
					纪年.shift();
					tmp -= 纪年.length;
					// 3 = 最大纪年名称资料长度 = 纪年名称索引值.国家
					Array.prototype.unshift.apply(纪年, 前一纪年名称.slice(0,
							tmp > 1 ? tmp : 1));
				}
				纪年.forEach(function(name, index) {
					if (name === parse_era.inherit) {
						if (!前一纪年名称[index])
							library_namespace.error('parse_era: 前一纪年 ['
							//
							+ 前一纪年名称 + '] 并未设定 index [' + index + ']！');
						纪年[index] = 前一纪年名称[index] || '';
					}
				});

				// do clone
				前一纪年名称 = 纪年.slice();
				if (纪年[1] && !纪年[2])
					// 朝代/君主(帝王)：纪年=君主(帝王)
					纪年[2] = 纪年[1];
			}

			// 处理如周诸侯国之类。
			tmp = 纪年[0].match(国_PATTERN);
			// 例如:
			// 鲁国/昭公 → 鲁国/鲁昭公
			// 秦国/秦王政 → 秦国/秦王政 (no change)
			if (tmp && !纪年[1].includes('国') && !纪年[1].includes(tmp = tmp[1])) {
				// add_attribute(附加属性, '君主', tmp[1] + 纪年[1]);

				// 直接改才能得到效果。
				纪年[1] = tmp + 纪年[1];
			}

			纪年.reverse();

			if (国家) {
				if (!纪年[3])
					纪年[3] = 国家;

				tmp = 纪年[0].match(名称加称号_PATTERN);
				if (tmp) {
					// 为了parse不包括"天皇"，如 "推古９年" 的情况。
					纪年.push(tmp[1]);
				}
			}

			// assert: 至此
			// 前一纪年名称 = [ 朝代, 君主(帝王), 纪年 ]
			// 纪年 = [ 纪年, 君主(帝王), 朝代, 国家 ]

			tmp = false;
			if (/\d$/.test(纪年[0])) {
				tmp = '纪年名称 [' + 纪年[0] + ']';
			} else if (/\d$/.test(纪年[1])) {
				tmp = '君主名称 [' + 纪年[1] + ']';
			}
			if (tmp) {
				tmp = 'parse_era: ' + tmp
				//
				+ ' 以阿拉伯数字做结尾，请改成原生语言之数字表示法，或如罗马数字之结尾。'
				//
				+ '本函式库以阿拉伯数字标示年分，因此阿拉伯数字结尾之名称将与年分混淆。';
				// 注意: 这边的警告在载入后会被清空。
				library_namespace.warn(tmp);
				// throw new Error(tmp);
			}

			library_namespace.debug(
			//
			'前期准备：正规化纪年 [' + 纪年 + '] 起讫日期。', 2);

			if (!(起讫 = parse_duration(起讫, 纪年)))
				if (options.extract_only)
					起讫 = [ new Date(0), new Date(0) ];
				else {
					library_namespace.error('parse_era: 跳过起讫日期错误的纪年资料！');
					return;
				}

			if (!起讫[0])
				if (index > 0)
					// 本一个纪年的起始日期接续上一个纪年。
					起讫[0] = era_data_array[index - 1].end;
				else if (options.extract_only)
					起讫[0] = new Date(0);
				else {
					library_namespace.error('parse_era: 没有上一纪年以资参考！');
					return;
				}

			起讫[0] = normalize_date(起讫[0], 起讫[2], false, true);
			if (!起讫[0])
				throw new Error('parse_era: 未能 parse 起始日期: [' + 纪年 + ']！');

			if (起讫[1])
				// tmp 于此将设成是否取终点。
				tmp = true;
			else if ((tmp = pre_parse_纪年资料(index + 1))
			// 下一个纪年的起始日期接续本纪年，因此先分解下一个纪年。
			// assert: tmp[1](起讫) is String
			&& (tmp = parse_duration(tmp[1], tmp[0])) && tmp[0]) {
				起讫[1] = tmp[0];
				起讫[2] = tmp[2];
				// 既然直接采下一个纪年的起始日期，就不需要取终点了。
				tmp = false;
			} else if (options.extract_only)
				起讫[1] = new Date(0);
			else {
				library_namespace.error('parse_era: 无法求得纪年[' + 纪年.toString()
						+ ']之结束时间！');
				return;
			}

			if (持续日数_PATTERN.test(起讫[1])) {
				// 讫时间 "+d" : 持续日数
				tmp = +起讫[1];
				(起讫[1] = normalize_date(起讫[0], 起讫[2], true, true)).setDate(tmp);

			} else
				// 讫时间 "–y/m/d"
				起讫[1] = normalize_date(起讫[1], 起讫[2], tmp, true);

			last_era_data = {
				// 纪年名称资讯（范畴小→大）
				// [ 纪年, 君主(帝王), 朝代, 国家, 其他搜寻 keys ]
				name : 纪年,

				// {Date}起 标准时间(如UTC+8),开始时间.
				start : 起讫[0],
				start_JDN : library_namespace.date.Date_to_JDN(起讫[0]),
				// {Date}讫 标准时间(如UTC+8), 结束时间.
				end : 起讫[1],
				end_JDN : library_namespace.date.Date_to_JDN(起讫[1]),

				// 共存纪年/同时存在纪年 []:
				// 在本纪年开始时尚未结束的纪年 list,
				contemporary : [],

				// 年分起始 Date value (搜寻用) [ 1年, 2年, .. ],
				// year_tart:[],

				// 历数/历谱资料:
				// 各月分资料 [ [1年之月分资料], [2年之月分资料], .. ],
				// 这边还不先作处理。
				calendar : 历数

			// { 其他附加属性 : .. }
			};

			// 处理 time zone / time offset (UTC offset by minutes)
			if (!isNaN(minute_offset)) {
				// 注意:这边不设定真正的 date value，使得所得出的值为「把本地当作纪元所使用的当地」所得出之值。
				last_era_data[MINUTE_OFFSET_KEY] = minute_offset;
				// set_minute_offset(起讫[0], minute_offset, true);
				// set_minute_offset(起讫[1], minute_offset, true);
			}

			// assert: 至此
			// 起讫 = [ 起 Date, 讫 Date, parser ]

			last_era_data = new Era(last_era_data);

			library_namespace.debug('add period [' + 纪年 + ']。', 2);

			i = 纪年名称索引值.国家;
			k = undefined;
			tmp = period_root;
			// [ , 君主, 朝代, 国家 ]
			var period_attribute_hierarchy = [];
			for (var start = 起讫[0].getTime(),
			//
			end = 起讫[1].getTime();;) {
				// 若本 era 之时间范围于原 period 外，
				// 则扩张 period 之时间范围以包含本 era。
				if (!(tmp.start <= start))
					tmp.start = start;
				if (!(end <= tmp.end))
					tmp.end = end;

				if (!(j = 纪年[i]) || i <= 0) {
					if (j || (j = k)) {
						if (!tmp.era)
							tmp.era = Object.create(null);
						add_attribute(tmp.era, j, last_era_data);
						if (library_namespace.is_debug()
								&& Array.isArray(tmp.era[j]))
							library_namespace.warn(
							//
							'add_attribute: 存在相同朝代、名称重复之纪年 '
									+ tmp.era[j].length + ' 个: '
									+ last_era_data);
					}
					break;
				}

				k = j;
				if (!(j in tmp.sub))
					tmp.add_sub(start, end, j);

				period_attribute_hierarchy[i--]
				// move to sub-period.
				= (tmp = tmp.sub[j]).attributes;
			}

			library_namespace.debug('设定纪年[' + 纪年 + ']之搜寻用 index。', 2);

			纪年.forEach(function(era_token) {
				add_to_era_by_key(era_token, last_era_data);
			});

			library_namespace.debug(
			//
			'正规化纪年 [' + 纪年 + '] 之其他属性。', 2);

			for (i in 附加属性) {
				j = 附加属性[i];
				if (i in Period_属性归属) {
					i = Period_属性归属[tmp = i];
					// now: tmp = name,
					// i = Period_属性归属 index of name
					// e.g., tmp = 君主名, i = 1

					// 解开属性值。
					// j = 'a;b' → k = [ 'a', 'b' ]
					if (Array.isArray(j)) {
						k = [];
						j.forEach(function(name) {
							Array_push(k, name
							//
							.split(pack_era.era_name_separator));
						});

					} else
						k = j.split(pack_era.era_name_separator);

					// 将属性值搬移至 period_root 之 tree 中。
					// i === 0，即纪元本身时，毋须搬移。
					// 使用者测试资料时，可能导致 j 为 undefined。
					if (0 < i && (j = period_attribute_hierarchy[i])) {
						// j: attributes of hierarchy[i]
						// assert: Object.isObject(j)
						if (tmp in j)
							// 解决重复设定、多重设定问题。
							// assert: Array.isArray(j[tmp])
							Array_push(j[tmp], k);
						else
							j[tmp] = k;

						// 仅将(留下)君主、纪元年号相关的附加属性供查阅，其他较高阶的朝代、国家等则省略之。
						// 恐还需要更改 ((sign_note.copy_attributes))!
						if (Period_属性归属[tmp] <= Period_属性归属.君主)
							add_attribute(last_era_data, tmp, j[tmp]);
						// 实际效用:将此属性搬移、设定到 period_root 之 tree 中。
						delete 附加属性[tmp];
					}

					if (tmp in 纪年名称索引值) {
						library_namespace.debug(
						// 设定所有属性值之 search index。
						'设定纪年[' + 纪年 + ']之次要搜寻用 index ['
						// 例如: 元太祖→大蒙古国太祖
						+ tmp + '] (level ' + i + ')。', 2);
						k.forEach(function(name) {
							if (name
							//
							&& !纪年.includes(name)) {
								add_to_era_by_key(name,
								// 对 i 不为 0–2 的情况，将 last_era_data 直接加进去。
								i >= 0 ? 纪年[i] : last_era_data);

								// 实际效用:除了既定的((纪年名称索引值))外，
								// ((纪年)) 都被拿来放属性索引值。
								// TODO:
								// 对其他同性质的亦能加入此属性。
								// 例如设定
								// "朝代=曹魏"
								// 则所有曹魏纪年皆能加入此属性，
								// 如此则不须每个纪年皆个别设定。
								if (i === 0)
									// ((纪年)) === last_era_data.name
									纪年.push(name);
							}
						});
					}

				} else if (i === '月名' || i === MONTH_NAME_KEY) {
					if (j = parse_month_name(j, last_era_data[MONTH_NAME_KEY]))
						last_era_data[MONTH_NAME_KEY] = j;
				} else
					add_attribute(last_era_data, i, j);
			}

			// era.精=:历史上这个时期历法与公元的对照本来就无法追溯得精准至日，甚至历法本身就不够精准。
			// era.准=:历史上这个时期历法与公元的对照应该非常精准，但是本数据库的资料准确程度不足。
			// era.疑=:历史上这个时期历法与公元的对照应该非常精准，本数据库的资料尺度标示也很精准，但是本数据库的资料实际上存在疑问、可能不准确。
			// era.传说=:为传说时代/神话之资料

			// 处理 accuracy/准度/误差/正确度。
			if (!last_era_data.准) {
				for (i in 准确程度_ENUM) {
					// 这里会设定如 era.准 = "疑"
					if (last_era_data[i]) {
						last_era_data.准 = i;
						break;
					}
				}
			}
			// check 准度。
			if (i = last_era_data.准) {
				if (!/^\d*[年月日]$/.test(i) && !(i in 准确程度_ENUM))
					library_namespace.warn('parse_era: 未支援纪年[' + 纪年
							+ ']所指定之准确度：[' + i + ']');
				if (!last_era_data.calendar && !last_era_data.精)
					last_era_data.精 = '年';
			}

			// 处理 precision/精度准度/精密度准确度。
			// cf. https://en.wikipedia.org/wiki/Module:Wikidata
			i = last_era_data.精;
			if (i === '年') {
				if (!last_era_data.calendar)
					last_era_data.calendar
					// 自动指定个常用的历法。
					= ':' + standard_time_parser;
				last_era_data.大月 = CE_MONTH_DAYS;

			} else {
				if (i && i !== '月' && i !== '日')
					library_namespace.warn('parse_era: 未支援纪年[' + 纪年
							+ ']所指定之精密度：[' + i + ']');

				if (('岁首' in last_era_data)
				// 此处之"岁首"指每年开始之月序数，当前农历为1。秦历始于10。
				// 惟历法上之"岁首"指每岁起算点(之月序数)。当前农历之"岁"指冬至月首至冬至月首之间，"年"指正月首(1月1日)至正月首之间，故岁首为11月1日夜半(子夜时刻)。
				&& (i = last_era_data.岁首 | 0) !== START_MONTH
				//
				&& 0 < i && i <= LUNISOLAR_MONTH_COUNT)
					last_era_data.岁首序 = i - START_MONTH;

				if (!(0 < (last_era_data.大月 |= 0)) || last_era_data.大月 === 大月)
					delete last_era_data.大月;
			}

			if (last_era_data.参照用) {
				library_namespace.debug(
				//
				'为使后来的操作能利用此新加入纪年 [' + last_era_data
				//
				+ ']，重新设定 era_search_pattern。', 3);
				era_search_pattern = null;
			}

			if (options.extract_only)
				return;

			i = era_list.length;
			if (i === 0) {
				era_list.push(last_era_data);
				return;
			}

			if (起讫[0] - era_list[i - 1].end === 0) {
				// assert: 本纪年接续著上一个纪年。
				if (纪年[1] !== era_list[i - 1].name[1]) {
					last_era_data.name.前任 = era_list[i - 1].name;
					var _i = i, _前任 = era_list[i - 1].name[1];
					while (_i-- > 0 && _前任 === era_list[_i].name[1]) {
						era_list[_i].name.继任 = 纪年;
					}
				} else if (era_list[i - 1].name.前任) {
					last_era_data.name.前任 = era_list[i - 1].name.前任;
				}
			}

			var start = 起讫[0], start_JDN = last_era_data.start_JDN,
			//
			contemporary = last_era_data.contemporary;

			// 纪年E 插入演算：
			// 依纪年开始时间，以 binary search 找到插入点 index。
			i -= 4;
			// 因为输入资料通常按照时间顺序，
			// 因此可以先检查最后几笔资料，以加快速度。
			if (i < 9) {
				i = 0;
			} else if (0 < era_list[i].start - start) {
				i = era_list.search_sorted(last_era_data, {
					comparator : compare_start_date,
					found : true,
					start : 0
				});
			}

			// 这一段其实可以不要。下一段while()可以补充这一段的功能。但是使用`.start_JDN`应该会比`.start`快一点点。
			while (i < era_list.length && era_list[i].start_JDN < start_JDN) {
				i++;
			}
			// assert: era_list[i].start_JDN >= start_JDN

			while (i < era_list.length && era_list[i].start - start <= 0) {
				// 预防本纪年实为开始时间最早者，
				// 因此在这边才处理是否该插入在下一 index。

				// 因为 .search_sorted(, {found : true})
				// 会回传 <= 的值，
				// 因此应插入在下一 index。

				// 这方法还会跳过相同时间的纪年，将本纪年插入在相同时间的纪念群最后面，成为最后一个。
				// 需要注意: [MINUTE_OFFSET_KEY]将会有作用，会按照时区排列。
				i++;
			}

			// 以 Array.prototype.splice(插入点 index, 0, 纪年) 插入纪年E，
			// 使本纪年E 之 index 为 (插入点 index)。
			era_list.splice(i, 0, last_era_data);

			// 向后处理"共存纪年" list：
			// 依纪年开始时间，
			// 将所有纪年E 之后(其开始时间 >= 纪年E 开始时间)，
			// 所有开始时间在其结束时间前的纪年，
			// 插入纪年E 于"共存纪年" list。
			for (k = last_era_data.end_JDN,
			// 从本纪年E 之下个纪年起。
			j = i + 1; j < era_list.length; j++) {
				// next {Era}
				tmp = era_list[j];
				if (tmp.start_JDN < k) {
					tmp = tmp.contemporary;
					tmp.push(last_era_data);
					if (tmp.length > 1) {
						// 不能保证依照 纪年开始时间 时序，应该插入在最后。
						tmp.sort(compare_start_date);
					}
				} else
					break;
			}

			// 处理与`last_era_data`同时开始之`.共存纪年` list：
			j = [];
			while (i > 0 && (tmp = era_list[--i]).start_JDN === start_JDN) {
				// tmp: 与`last_era_data`同时开始的纪年。
				j.unshift(tmp);
				tmp.contemporary.push(last_era_data);
			}

			// 向前处理"共存纪年" list：
			// 检查前一纪年，
			// 与其"在本纪年开始时尚未结束的纪年 list"，
			// 找出所有(其结束时间 period_end > 纪年E 开始时间)之纪年，
			// 将之插入纪年E 之"共存纪年" list。
			tmp = era_list[i];
			tmp.contemporary.concat(tmp).forEach(function(era) {
				if (era.end - start > 0)
					contemporary.push(era);
			});
			// 为了按照 纪年开始时间 顺序排列。
			if (j.length > 0)
				Array_push(contemporary, j);
		}

		era_data_array.forEach(for_era_data);

		if (last_era_data) {
			if (options.extract_only) {
				last_era_data.initialize();
				return last_era_data;
			}
			// 当有新加入者时，原先的 pattern 已无法使用。
			era_search_pattern = null;
		}
	}

	// ---------------------------------------------------------------------//
	// 工具函数。

	/**
	 * 对于每个朝代，逐一执行 callback。
	 * 
	 * @param {Function}callback
	 *            callback(dynasty_name, dynasty);
	 * @param {String|RegExp}[filter]
	 *            TODO
	 */
	function for_dynasty(callback, filter) {
		for ( var nation_name in period_root.sub) {
			var nations = period_root.sub[nation_name].sub;
			for ( var dynasty_name in nations)
				callback(dynasty_name, nations[dynasty_name]);
		}
	}

	/**
	 * 对于每个君主，逐一执行 callback。
	 * 
	 * @param {Function}callback
	 *            callback(monarch_name, monarch);
	 * @param {String|RegExp}[filter]
	 *            TODO
	 */
	function for_monarch(callback, filter) {
		for ( var nation_name in period_root.sub) {
			var nations = period_root.sub[nation_name].sub;
			for ( var dynasty_name in nations) {
				var dynasty = nations[dynasty_name].sub;
				for ( var monarch_name in dynasty)
					callback(monarch_name, nations[monarch_name]);
			}
		}
	}

	/**
	 * 为 era Date 添加上共存纪年。
	 * 
	 * @param {Date}date
	 * @param {Era}[指定纪年]
	 *            主要纪年
	 * @param {Object}[options]
	 *            附加参数/设定特殊功能与选项
	 * 
	 * @returns {Array} 共存纪年
	 */
	function add_contemporary(date, 指定纪年, options) {
		var tmp, date_index, time_offset = date.getTimezoneOffset()
				* ONE_MINUTE_LENGTH_VALUE,
		// 以当日为单位而非采用精准时间
		use_whole_day = options && ('use_whole_day' in options)
		//
		? options.use_whole_day
		//
		: 'precision' in date ? date.precision === 'day'
		//
		: date % ONE_DAY_LENGTH_VALUE === time_offset,
		// 没意外的话，共存纪年应该会照纪年初始时间排序。
		// 共存纪年.start <= date < 共存纪年.end
		共存纪年,
		// 某时间点（时刻）搜寻演算：
		era_index = (options && Array.isArray(options.list)
		// 查询某时间点（时刻）存在的所有纪年与资讯：
		// 依纪年开始时间，以 binary search 找到插入点 index。
		? options.list : era_list).search_sorted({
			start : date
		}, {
			comparator : compare_start_date,
			found : true
		}),
		//
		纪年 = era_list[era_index];

		if ((纪年.精 || 纪年.准
		// 准确程度_ENUM
		|| 纪年.疑 || 纪年.传说) && (tmp = options && options.寻精准)) {
			tmp = Math.max(era_index - Math.max(2, tmp | 0), 0);
			for (date_index = era_index; date_index > tmp
			// 使用这方法不能保证无漏失，应该使用 (纪年.contemporary)。
			&& (共存纪年 = era_list[--date_index]).end - date > 0;)
				if (!共存纪年.精 && !共存纪年.准 && !共存纪年.疑
				// 尽可能向前找到精密暨准确的纪年。
				&& 共存纪年.Date_to_date_index(date)) {
					era_index = date_index;
					纪年 = 共存纪年;
					break;
				}
		}

		if (era_index === 0 && date - 纪年.start < 0) {
			if (library_namespace.is_debug())
				library_namespace.warn('add_contemporary: 日期 ['
						+ date.format(standard_time_format) + '] 在所有已知纪年之前！');
			return;
		}

		// 至此 (era_list[era_index].start <= date)
		// 除非 date < era_list[0].start，那么 (era_index===0)。

		共存纪年 = [];
		// 向前找。
		纪年.contemporary
		//
		.forEach(function(era) {
			// 检查其"共存纪年" list，
			// 找出所有(所求时间 < 其结束时间 period_end)之纪年，即为所求纪年。
			if (date - era.end < 0 && (!era.参照用 || options.含参照用))
				共存纪年.push(era);
		});

		// 本纪年本身+向后找。
		// 为了待会取未交叠的相同国家纪年作为前后纪年，这边不改变 era_index。
		for (date_index = era_index;
		//
		date_index < era_list.length; date_index++) {
			tmp = era_list[date_index];
			if (date - tmp.start < 0)
				break;
			else if (date - tmp.end < 0 && (!tmp.参照用 || options.含参照用))
				共存纪年.push(tmp);
		}

		if (options.era_only)
			return 共存纪年;

		if (指定纪年) {
			var 指定纪年名 = 指定纪年.name;
			if (Array.isArray(指定纪年名))
				指定纪年名 = 指定纪年名[0] || 指定纪年名[2];
			tmp = 共存纪年;
			共存纪年 = [];
			tmp.forEach(function(era) {
				// 去除指定纪年本身。
				if (era === 指定纪年)
					tmp = null;
				// 避免循环参照。
				else if (era.year_start || era.参照纪年 !== 指定纪年名)
					共存纪年.push(era);
			});

			if (tmp)
				// 不包含指定纪年本身。
				指定纪年 = null;
			else
				// 包含指定纪年本身。
				纪年 = 指定纪年;
		}

		// 取未交叠的相同国家纪年作为前后纪年。
		tmp = era_index;
		while (0 < tmp--)
			if (era_list[tmp].end - 纪年.start <= 0
			// 相同国家
			&& era_list[tmp].name[3] === 纪年.name[3]) {
				date.前纪年 = era_list[tmp].toString();
				break;
			}

		tmp = era_index;
		while (++tmp < era_list.length)
			if (纪年.end - era_list[tmp].start <= 0
			// 相同国家
			&& era_list[tmp].name[3] === 纪年.name[3]) {
				date.后纪年 = era_list[tmp].toString();
				break;
			}

		// 作结尾检测 (bounds check)。
		if (纪年.end - date <= 0) {
			if (指定纪年) {
				if (library_namespace.is_debug())
					library_namespace.warn(
					//
					'add_contemporary: 日期 ['
							+ date.format(standard_time_format) + '] 在指定纪年 ['
							+ 指定纪年 + '] 之后！');
				return;
			}
			if (共存纪年.length === 0) {
				if (library_namespace.is_debug())
					library_namespace.warn('add_contemporary: 日期 ['
							+ date.format(standard_time_format)
							+ '] 在所有已知纪年之后！');
				return;
			}
			纪年 = 共存纪年[0];
		}

		// 至此已确定所使用纪年。
		共存纪年.纪年 = 纪年;

		if (共存纪年.length > 0) {
			if (typeof options.contemporary_filter === 'function')
				共存纪年 = 共存纪年.filter(options.contemporary_filter);
			tmp = [];
			共存纪年.forEach(function(era) {
				if (date_index = era.Date_to_date_index(date
				// 转成目标共存纪年的当日零时。
				- time_offset + (era[MINUTE_OFFSET_KEY] || 0)
						* ONE_MINUTE_LENGTH_VALUE)) {
					// .日名(日序, 月序, 岁序) = [ 日名, 月名, 岁名 ]
					date_index = era.日名(date_index[2], date_index[1],
							date_index[0]).reverse();
					if (options.numeral) {
						date_index = numeralize_date_format(date_index,
								options.numeral);
					}

					// [ era, 年, 月, 日 ]
					var name = [ era ];
					name.toString = function() {
						return this.join('');
					};
					// add properties needed.
					for ( var 准确程度 in 准确程度_ENUM) {
						if (era[准确程度]) {
							// 特别标示存在疑问、不准确的纪年。
							name[准确程度] = era[准确程度];
						}
					}
					// 为需要以 space 间隔之纪元名添加 space。
					if (NEED_SPLIT_POSTFIX.test(name))
						name.push(' ');
					name.push(date_index[0] + (
					// era.年名 ||
					POSTFIX_年名称));
					if (era.精 !== '年') {
						name.push(date_index[1] + '月');
						if (era.精 !== '月')
							name.push(date_index[2]
									+ (options.numeral === 'Chinese'
									//
									? '' : '日'));
					}
					if (options.add_country)
						name = [ era.name[纪年名称索引值.国家], name ];
					tmp.push(name);
				}
			});
			if (tmp.length > 0)
				date.共存纪年 = tmp;
		}

		return 共存纪年;
	}

	// e.g., UTC+8: -8 * 60 = -480
	var present_local_minute_offset = (new Date).getTimezoneOffset() || 0;

	function offseted_value(minute_offset) {
		if (minute_offset === undefined)
			minute_offset = this[MINUTE_OFFSET_KEY];
		else if (minute_offset === '') {
			// 可用来还原 local 之时间。
			minute_offset = -this.getTimezoneOffset() || 0;
		}

		if (!isNaN(minute_offset)) {
			if (isNaN(this.original_value))
				this.original_value = this.getTime();
			return this.original_value
					- (minute_offset + (this.getTimezoneOffset() || 0))
					* ONE_MINUTE_LENGTH_VALUE;
		}
	}

	function adapt_minute_offset(minute_offset) {
		var offseted_value = this.offseted_value(minute_offset);
		if (!isNaN(offseted_value))
			this.setTime(offseted_value);
		return this;
	}

	function add_offset_function(date, 纪年) {
		if (MINUTE_OFFSET_KEY in 纪年) {
			date[MINUTE_OFFSET_KEY] = 纪年[MINUTE_OFFSET_KEY];
			date.offseted_value = offseted_value;

			// 注意:这边不更改真正的 date value，使得所得出的值为「把本地当作纪元所使用的当地」所得出之值。
			// 例如求 "东汉明帝永平1年1月1日"，
			// 得到的是 date = "58/2/13 0:0 (UTC-5)"，
			// 实际上只是把本地（例如纽约）当作中国时，所得之时间。
			// 若须得到「纪元使用地真正之时间」（中国真正之时间） "58/2/13 0:0 (UTC+8)"，
			// 则得使用 date.adapt_offset()。
			// 再使用 date.adapt_offset('')，
			// 或 date.adapt_offset(-5*60)，
			// 或 date.adapt_offset(-date.getTimezoneOffset())，
			// 可以还原 local 之时间。
			if (false)
				date.adapt_offset = adapt_minute_offset;
		}
	}

	// ---------------------------------------------------------------------//
	// 应用功能。

	/**
	 * 取得 year CE 当年，特定之月日之日期。
	 * 
	 * @example <code>

	// gettext_config:{"id":"china"}
	CeL.era.Date_of_CE_year(1850, 1, 1, '中国');
	CeL.era.Date_of_CE_year(1850);

	 </code>
	 * 
	 * @param {Integer}year
	 *            CE year
	 * @param {Integer}[月]
	 *            month of era. default: START_MONTH = 1.
	 * @param {Integer}[日]
	 *            date of era. default: START_DATE = 1.
	 * @param {String}[era_key] //
	 *            gettext_config:{"id":"china"} e.g., '中国'
	 * 
	 * @returns {Date}
	 * 
	 * @since 2014/12/15 20:32:43
	 * 
	 */
	function get_Date_of_key_by_CE(year, 月, 日, era_key) {
		var 日期,
		// 7: 年中， (1 + LUNISOLAR_MONTH_COUNT >> 1)
		date = new Date((year < 0 ? year : '000' + year) + '/7/1'),
		//
		共存纪年 = add_contemporary(date, null, {
			era_only : true,
			寻精准 : true,
			list : !era_key || !(era_key = get_Date_of_key_by_CE.default_key)
			//
			? era_list : get_era_Set_of_key(era_key).values()
		});

		共存纪年.forEach(function(纪年) {
			if (!日期) {
				// [ 岁序, 月序, 日序 | 0 ]
				var date_index = 纪年.Date_to_date_index(date);
				日期 = 纪年.date_name_to_Date(纪年.岁名(date_index[0]), 月, 日, true);
			}
		});

		return 日期;
	}

	// gettext_config:{"id":"china"}
	get_Date_of_key_by_CE.default_key = '中国';

	// ---------------------------------------------------------------------//
	// 应用功能。

	/**
	 * date.getTimezoneOffset() 这个数字会随著夏令时间、各个历史时代而作调整，不一定和当前的时区相同。<br />
	 * `new Date(-1e13)` 会使 Chrome 69.0.3493.3 把台北标准时间从 GMT+0800 改成 GMT+0806。<br />
	 * new Date(-1e13).getTimezoneOffset()!==new Date().getTimezoneOffset()
	 * 因此利用UTC、Julian_day得出的时间，在`d.getMinutes()`的时候会产生误差。此时需要做调整。
	 * 
	 * 注意: 这个调整最多只能做一次，之后若要演算也必须把时间调回来。
	 * 
	 * @param {Date}date
	 */
	function correct_timezone_offset(date) {
		var timezone_offset_min = date.getTimezoneOffset()
				- present_local_minute_offset;
		if (timezone_offset_min !== 0) {
			date.setMinutes(date.getMinutes() + timezone_offset_min);
		}
	}

	/**
	 * 传入完整纪年日期，将之转成具有纪年附加属性的 Date。
	 * 
	 * @param {String|Object|Array|Date}date
	 *            所欲解析之完整纪年日期。<br />
	 *            era string<br /> { 国家:'', 朝代:'', 君主:'', 纪年:'', 日期:'' , ... }<br />
	 *            duration: [start_date, end_date]
	 * @param {Object}[options]
	 *            附加参数/设定特殊功能与选项. 此 options 可能会被变更!<br />
	 *            {String|Date}.base: base date. 会选出最接近此日期之纪年。<br /> //
	 *            gettext_config:{"id":"china"} {String}.range:
	 *            限定于此范围内寻找纪年。e.g., '中国'<br />
	 *            {Boolean}.get_era: 仅回传所解析出之纪年 {Era}。<br />
	 *            {Boolean}.get_era_list: 仅回传所解析出之纪年 list: {Set}。<br />
	 *            {Boolean}.get_range: 仅回传所解析出之期间: [ "前", "后" ]。<br />
	 *            {Boolean}.get_range_String: 仅回传所解析出之期间: "前–后"。<br />
	 *            {Boolean}.era_only: 仅回传所解析出之共存纪年 list: {Array}。<br />
	 *            {Boolean}.parse_only: 仅回传所解析出之纪年资讯: [ 纪年_list, 纪年, 年, 月, 日 ]<br />
	 *            {Boolean}.is_era: 找不到可用之纪年时，直接 abort 跳出，回传 undefined。<br />
	 *            {Boolean}.date_only: 仅回传所解析出之{Date}纪年日期，不包括附加资讯。<br />
	 * 
	 * @returns {Date} 解析出之日期
	 */
	function to_era_Date(date, options) {
		library_namespace.debug('parse (' + typeof date + ') [' + date + ']',
				3, 'to_era_Date');

		// 前置处理。
		if (!library_namespace.is_Object(options))
			options = Object.create(null);

		if (!date)
			date = new Date();

		var 纪年_list, 纪年, origin = true, 指定纪年, tmp, tmp2;
		// 欲改变 纪年_list。
		function check_to_modify() {
			if (origin) {
				// 防止改变原先的 data。
				(纪年_list =
				//
				library_namespace.Set_from_Array(纪年_list)).名 = origin;
				origin = false;
			}
		}

		// 取 key 与 (纪年_list) 之交集。
		function get_intersection(key, no_expand) {
			if (key.start && key.end) {
				origin = false;
				(纪年_list = library_namespace.Set_from_Array(
				// or use: (纪年_list = new Set).add(key);
				// 纪年_list.名 = key.name;
				[ key ])).名 = key.name;
				return 纪年_list;
			}

			library_namespace.debug('Get 纪年 list of [' + key + ']', 2,
					'to_era_Date');
			var list = get_era_Set_of_key(key, no_expand);
			if (!list ||
			// assert: (Set)list
			list.size === 0)
				return;
			// 初次设定。
			if (!纪年_list) {
				if (key)
					origin = key;
				return 纪年_list = list;
			}

			library_namespace.debug('取交集 of [' + key + ']', 2, 'to_era_Date');
			纪年_list.forEach(function(era) {
				if (!list.has(era))
					check_to_modify(), 纪年_list['delete'](era);
			});

			if (Array.isArray(list = 纪年_list.values()))
				library_namespace.debug(
				//
				'取交集 [' + key + '] 得到 [' + list.join() + ']', 2, 'to_era_Date');
			return 纪年_list;
		}

		// 取得任何一个纪年作为主纪年。
		function get_next_era() {
			if (!纪年_list || 纪年_list.size === 0)
				return 纪年 = null;

			var key = 纪年_list.名 || origin || false;
			if (typeof key === 'string') {
				try {
					纪年_list.forEach(function(era) {
						if (era.name[0] === key) {
							library_namespace.debug('采用同名纪年 [' + era + ']', 2,
									'to_era_Date');
							纪年 = era;
							// TODO: 以更好的方法处理，不用 throw。
							// 只要有一些通过，就成。但((纪年_list))非Array，不能用.some()。
							throw 0;
						}
					});
				} catch (e) {
					return 纪年;
				}
			}

			try {
				纪年_list.forEach(function(era) {
					library_namespace.debug('采用纪年 [' + era + ']', 2,
							'to_era_Date');
					纪年 = era;
					// TODO: 以更好的方法处理，不用 throw。
					// 只要有一些通过，就成。但((纪年_list))非Array，不能用.some()。
					throw 0;
				});
			} catch (e) {
			}

			return 纪年;
		}

		if (typeof date === 'number')
			date = Math.abs(date) < 4000
			// 当作年分。
			? new Date(date, 0, 1)
			// 当作 date value。
			: new Date(date);

		else if (library_namespace.is_Object(date)) {
			library_namespace.debug('era information Object → Date', 3,
					'to_era_Date');

			// 从范围小的开始搜寻。
			// TODO: 搜寻日期?
			for ( var i in 纪年名称索引值)
				if (i = date[i])
					get_intersection(i);

			date = date.日期 || date.date;
		}

		if (typeof date === 'string') {
			library_namespace.debug('parse 纪年日期 string [' + date + ']', 3,
					'to_era_Date');

			// era information String
			// → era information Object
			var matched, 年, 月, 日, 侦测集 = [],
			// 正规化数字。
			numeralized = normalize_number(date = date.trim()),
			// 对每一个((侦测集))的字串，从后方开始一个个找到刚好符合纪元名称的部分。
			// 会更改到((侦测集))
			search_era = function search_era() {
				// 通常后方的条件会比较精细。
				while (侦测集.length > 0) {
					var slice = 侦测集.pop();
					while (slice) {
						if (matched = slice.match(era_search_pattern)) {
							if (0 < matched.index)
								侦测集.push(
								// 放回前面尚未处理的部分。
								slice.slice(0, matched.index));
							if (false) {
								if (slice = slice.slice(
								// 放回后面尚未处理的部分:
								// 由于从后面找，保证了后面的不存在可符合的部分，因此现在用不到。
								matched.index + matched[0].length))
									侦测集.push(slice);
							}
							return matched;
						}
						// 自后头一个一个剔除，以找到刚好符合的部分。
						// 因为era_search_pattern会符合以纪元名称结尾。
						// TODO:
						// 使era_search_pattern匹配出现在中间的纪元名称，不必一个个回退。
						slice = slice.slice(0, -1);
					}
				}
			};

			// --------------------------------------------
			// 开始解析。

			// 前置, 后置 改成 Array (纪年指示词侦测集)，统一处理。
			if (tmp = numeralized.match(ERA_DATE_PATTERN)
			// 仅在应解析，但是没解析出来的时候才增加新的pattern。
			// 若是能解析出固定错误模式，那么应该要在下面 "if (tmp2)", "if (matched)" 这地方做修正。
			|| (tmp2 = numeralized.match(ERA_DATE_PATTERN_ERA_ONLY))
					|| (matched = numeralized.match(ERA_DATE_PATTERN_YEAR))) {
				library_namespace.debug('辨识出纪年+日期之样式 [' + tmp + '] ('
				//
				+ (tmp2 ? 'ERA_DATE_PATTERN_ERA_ONLY'
				//
				: matched ? 'ERA_DATE_PATTERN_YEAR'
				//
				: 'ERA_DATE_PATTERN') + ')', 2, 'to_era_Date');

				// 中间多为日期，前后为纪年。
				年 = tmp[2];
				月 = tmp[3];
				日 = tmp[4];

				if (tmp2) {
					// .match(ERA_DATE_PATTERN_ERA_ONLY)
					// 减缩版 ERA_DATE_PATTERN: 省略日期，或亦省略月分。
					if (!月)
						if (日) {
							月 = 日;
							// 处理月相
							// e.g.,
							// '宝应二年三月晦日'
							matched = tmp[5].match(/^\s*([朔晦望])/);
							日 = matched ? matched[1] : '';
						} else if (!isNaN(numeralize_date_name(tmp[1] + 年))) {
							// 省略日期月分。修正仅有年分时出现之问题。
							// e.g., '五千六百七十八年', '前五千六百七十八年'
							年 = tmp[1] + 年;
							tmp[1] = '';
						}

				} else if (matched) {
					if (matched = tmp[5].match(/^月(?:([^日]{1,3})日?)?/)
					// .match(ERA_DATE_PATTERN_YEAR)
					// 减缩版 ERA_DATE_PATTERN: parse 年分 only。
					) {
						// e.g., '三月一日'
						月 = 年;
						年 = null;
						日 = matched[1];
						if (tmp[1] === '闰') {
							// e.g., tmp=[闰六月,闰,六,,,月]
							月 = tmp[1] + 月;
							tmp[1] = '';
						}
					} else if (tmp[5].charAt(0) === '日'
					// e.g., '一日'
					// 仅输入单一干支，当作日干支而非年干支。
					// e.g.,
					// ('丁亥朔', {base : '宝应二年春正月'})
					|| options.base
					// 排除如"正月乙巳", "三月庚子"
					&& !/^(.+)月\s*$/.test(tmp[1])
					// 干支_PATTERN.test(年) 即: (( 年.length === 2 &&
					// !isNaN(library_namespace.stem_branch_index(年)) ))
					&& 干支_PATTERN.test(年)) {
						日 = 年;
						年 = null;
					} else if (!月 && !日) {
						if ((tmp[1] || tmp[5])
						// 此处((年))应该是年号中间的文字，只是被筛选到了。
						&& 单数字_PATTERN.test(年)) {
							// e.g., 百济多娄王, 四条天皇天福, 四条天皇文暦, 后一条天皇长元.
							// 但须考量(剔除) "元至正十七"
							年 = '';
						} else if (tmp[5]
						// 修正仅有年分时出现之问题。
						// e.g., '五千六百七十八', '前五千六百七十八'
						&& !isNaN(numeralize_date_name(tmp[5]))) {
							年 += tmp[5];
							tmp[5] = '';
						} else if (干支_PATTERN.test(年)
						// 解析中文月分名称如"正月乙巳", "三月庚子"，
						// 防止 CeL.era('正月乙巳',{base:'建隆元年',parse_only:true})
						// 被解析成 前置:正月,年:乙巳
						&& (matched = tmp[1].match(/^(.+)月\s*$/))) {
							日 = 年;
							月 = matched[1].trim();
							年 = null;
							tmp[1] = '';
							//
							date = null;
						} else if (干支_PATTERN.test(年)
						// 不能采用"&& !tmp[1]"，会无法正确解析'西凉太祖庚子三月'
						// 如农历年月"乙巳正月"
						&& (matched = tmp[5].match(/^(.+)月(?:([^日]{1,3})日?)?/))) {
							月 = matched[1].trim();
							日 = matched[2];
							tmp[5] = '';
							//
							date = null;
						}
					}

					// 预防万一，将 date 资料侦测一次。
					// 不用 numeralized，预防有些纪年名称包含可被数字化的资料。
					侦测集.push(date, null);
				}

				// 依照习惯，前置多为(通常应为)纪年。
				tmp2 = tmp[1].replace(to_era_Date.ignore_pattern, '');
				if (tmp2 = numeralize_time(tmp2)) {
					if (tmp2 === numeralized.replace(/\s*\d+年[\s\S]*$/, '')) {
						// assert: 纪年名称包含这个之类的数字，被正规化之后反而出错。
						// e.g., "江戸朝廷后西天皇万治" 正规化→ "江戸朝廷后西天皇万治"
						侦测集.push(date.replace(/\s*\d+年[\s\S]*$/, ''));
					} else {
						侦测集.push(tmp2);
					}
				}
				// 依照习惯，后置多为(通常应为)时间。
				tmp2 = tmp[5].replace(to_era_Date.ignore_pattern, '');
				if (tmp2 = numeralize_time(tmp2))
					侦测集.push(tmp2);

			} else {
				tmp2 = date.trim();
				if (options.base
						&& (tmp = tmp2.match(/([朔晦])日?/)
								|| tmp2.match(/^(望)日?$/)))
					日 = tmp[1];
				if (options.base && (tmp = tmp2.match(/([明隔去])年/)))
					年 = tmp[1];
				if (tmp = tmp2.replace(to_era_Date.ignore_pattern, ''))
					侦测集.push(tmp);
				library_namespace.debug('无法辨识出 [' + date + '] 之纪年样式'
						+ (tmp ? '，直接当纪年名称处理' : '') + '。', 2, 'to_era_Date');
			}

			// 首先确定纪年。
			if (侦测集.length > 0) {
				// backup(.clone): tmp2 自此当作时间侦测集。
				tmp2 = 侦测集.slice();

				if (!era_search_pattern)
					// 初始化 search pattern。
					create_era_search_pattern();

				do {
					// reset 纪年_list.
					纪年_list = undefined;
					if (search_era() && (tmp = get_intersection(matched[0]))
							&& tmp.size > 1) {
						// backup(.clone): 为了预防使用别名，因此不一开始就设定 no_expand。
						date = 侦测集.slice();
						// 进一步筛选，紧缩符合范围。
						while (纪年_list.size > 1 && search_era()) {
							if (年 && tmp2[1] === null
							// 检查((年))是否为纪年名称之一部份。
							// 须考量(剔除) "文化14"
							&& matched[0].includes(年))
								// 表示((年))应该为纪年名称之一部份。这样就不应该设定((年))了。
								年 = '';
							get_intersection(matched[0]);
						}
						if (纪年_list.size > 1) {
							// 依旧有超过一个候选，则设定别扩大解释。
							// revert, 重新 parse 一次。
							侦测集 = date;
							while (纪年_list.size > 1 && search_era())
								// 已经有太多匹配的了，因此设定 no_expand。
								get_intersection(matched[0], true);
						}
					}
					// "后一条天皇长元" 需要检测到 (while ..) 这一项。
				} while ((!纪年_list || 纪年_list.size === 0) && 侦测集.length > 0);
			} else {
				tmp2 = null;
			}

			// 避免如 "三月庚子" 被解析成 "太祖庚子"
			// 避免如 "十二月丁未" 被解析成 "丁先皇帝太平"
			if (纪年_list && 纪年_list.size > 0 && !年 && 月 && 干支_PATTERN.test(日)) {
				// console.log([ date, 年, 月, 日 ]);
				纪年_list.forEach(function(era) {
					if (era.name.some(function(name) {
						return 日.includes(name);
					})) {
						check_to_modify();
						// 删掉不合适的纪年。
						纪年_list['delete'](era);
					}
				});
			}
			// console.log([ date, 纪年_list ]);

			if (date = options.base) {
				if (!Array.isArray(date)
				//
				&& !is_Date(date)) {
					tmp = to_era_Date(date, {
						parse_only : true
					});
					date = tmp[1] && tmp[0] && tmp[0].size > 0 ? tmp
							: numeralize_date_name(date).to_Date(
									standard_time_parser);
				}

				// assert: date(=options.base) 为 Date
				// 或 [ {Set}纪年_list, {Era}纪年, 年, 月, 日 ]。

				if (Array.isArray(date)) {
					// e.g.,
					// options.base 之后，第一个符合 argument(date) 的日期。
					// CeL.era('二年春正月丁亥朔', {base : '宝应元年'})
					// CeL.era('丁亥朔', {base : '宝应元年二年春正月'})
					// CeL.era('明年',{base:'嘉靖元年'})

					tmp = [ 年, 月, 日 ];
					for (matched = 0; matched < tmp.length; matched++)
						if (tmp[matched])
							break;
					switch (matched) {
					// 此处需要与 options.parse_only 之 return 配合。
					case 3:
						日 = date[4];
					case 2:
						月 = date[3];
					case 1:
						年 = date[2];
					case 0:
						origin = true;
						纪年_list = date[0];
						tmp = 0;
						// 明年
						if (/[明隔]/.test(年))
							tmp = 1;
						else if (/[去]/.test(年))
							tmp = -1;
						if (tmp)
							// assert: numeralize_date_name('元') === '1'
							年 = +(date[2] > 0 ? date[2]
									: numeralize_date_name(date[2]))
									+ tmp;
					}

				} else if (date && !isNaN(date.getTime())) {
					if (纪年_list && 纪年_list.size > 0) {
						if (纪年_list.size > 1) {
							// e.g.,
							// CeL.era('建武二年',{parse_only:true,base:CeL.era('大明八年',{date_only:true})})
							tmp = date.getTime();
							matched = Array.from(纪年_list).map(function(era) {
								var distance = tmp < era.start.getTime()
								// 取得与基准日期的距离。
								? era.start.getTime() - tmp
								//
								: era.end.getTime() < tmp
								//
								? tmp - era.end.getTime() : 0;
								return [ era, distance ];
							}).sort(function(_e1, _e2) {
								return _e1[1] - _e2[1];
							});
							纪年_list = new Set;
							// 选取与基准日期date最接近的候选纪年。
							// 每一个候选纪年与基准日期date的差距不可太大。
							matched.some(function(_e) {
								纪年_list.add(_e[0]);
								// 这边可以控制想要筛选的最低数量。
								return _e[1] > 0;
							});
						}

					} else {
						// e.g.,
						// ('庚辰年庚辰月庚辰日庚辰时', {base : '1850年'})

						// 针对岁次特别做修正。
						// 注意:非泛用方法。
						if (纪年 = library_namespace.stem_branch_index(年)) {
							tmp = library_namespace.SEXAGENARY_CYCLE_LENGTH;
							// 计算差距年数。
							if (纪年 = (纪年 - (date.getFullYear() - library_namespace.YEAR_STEM_BRANCH_EPOCH))
									% tmp) {
								if (纪年 < 0)
									纪年 += tmp;
								if (纪年 > tmp >> 1)
									纪年 -= tmp;
								// 重设年分。
								date.setFullYear(年 = date.getFullYear() + 纪年);
							}
						}

						// 找出最接近date的日期。
						// 注意:这边采用的方法并不完备。
						纪年 = era_list.search_sorted({
							start : date
						}, {
							comparator : compare_start_date,
							found : era_list
						});
						if (纪年)
							纪年_list = library_namespace
									.Set_from_Array(纪年.contemporary.concat(纪年));
					}
				}
			}

			if (options.parse_without_check) {
				// e.g., do not check range
				return [ 纪年_list, 年, 月, 日 ];
			}

			// TODO: 筛选*所有*可用之纪年。
			if (!('strict' in options)
			//
			&& 纪年_list && 纪年_list.size > 1) {
				// 有多个选择，因此尝试严格筛选。
				options.strict = true;
			}
			if (tmp = options.period_end) {
				// 取得结束时间。else: 取得开始时间。
				tmp = 日 ? 1 : 月 ? 2 : 年 ? 3 : 4;
			}
			// 从纪年、日期筛选可用之纪年，取得 Date。
			date = null;
			while (get_next_era()
					&& (!(date = 纪年.date_name_to_Date(年, 月, 日, options.strict,
							tmp))
					// 在纪年范围外。
					|| isNaN(date.getTime()))) {
				check_to_modify();
				// 删掉不合适的纪年。
				纪年_list['delete'](纪年);
				date = 纪年 = null;
			}

			if (纪年) {
				指定纪年 = 纪年;
				if (纪年_list.size > 1) {
					// 可能是相同纪年之延续。现有元文宗天历、太平天囯具此情况。
					tmp = [];
					纪年_list.forEach(function(era) {
						if (!tmp.includes(
						// 仅记录未重复的纪年，忽略重复的纪年名称。
						era = era.toString()))
							tmp.push(era);
					});
					// tmp = Array.from(纪年_list).unique()
					if (tmp.length > 1) {
						// 有超过1个纪年。
						if (options.pick) {
							tmp = options.pick(tmp) || tmp;
						} else {
							if (false && options.base) {
								library_namespace.log('base: ' + options.base);
							}
							if (library_namespace.is_debug()) {
								library_namespace.warn('to_era_Date: 共取得 '
										+ tmp.length + ' 个可能的纪年名称！ ['
										+ tmp.join(', ') + ']');
							}
						}
					}
				}

			} else if (tmp = numeralized.match(
			// assert: !纪年_list || 纪年_list.size === 0 未特定纪年。
			/^(JDN?)\s*(\d+(?:.\d*)?)$/i)) {
				date = library_namespace.JD_to_Date(tmp[2]);
				// 此时不该当作符合了。

			} else if (library_namespace.is_debug()
			//
			&& arguments[0]) {
				library_namespace.info([ 'to_era_Date: 无法自 [', {
					b : arguments[0],
					S : 'color:#e92;'
				}, '] 辨识出特殊地域之纪年名称。（时间不在所求纪年范围内？）',
				//
				'将视为' + standard_time_parser_name
				//
				+ '纪年时间，尝试以日期解析器 [', standard_time_parser, '] 解析。' ]);
			}

			// 警告:请勿随意更改这些回传值，因为他们也为 module 内部其他功能所用!
			if (options.get_era)
				return 纪年;
			if (options.get_era_list
			// 若是还未能解析出特殊纪年，例如输入公元纪年，则待后面再行处理。
			&& 纪年)
				return 纪年_list;
			if (options.parse_only)
				return [ 纪年_list, 纪年, 年, 月, 日 ];

			if (date) {
				if (options.get_range_String
				//
				&& !options.get_range)
					options.get_range = -1;
				if (options.get_range) {
					// shift microseconds
					tmp2 = typeof options.get_range === 'boolean' ? 0
							: options.get_range | 0;

					if (!年 || isNaN(年 = numeralize_date_name(年)))
						tmp = new Date(纪年.end.getTime() + tmp2);
					else {
						// [ 岁序, 月序, 日序 | 0 ]
						tmp = 纪年.Date_to_date_index(date);
						if (!月)
							tmp = new Date(纪年.year_start[tmp[0] + 1] + tmp2);
						else if (!日)
							tmp = new Date(date.getTime() + tmp2
							//
							+ (纪年.calendar[tmp[0]][tmp[1]] - tmp[2])
									* ONE_DAY_LENGTH_VALUE);
						else
							tmp = new Date(date.getTime() + tmp2
									+ ONE_DAY_LENGTH_VALUE);
					}
					// 警告:未处理 options.minute_offset。
					// 警告:跨统治者的纪年，或纪年末的情况可能会出错。

					tmp2 = options.get_range_String;
					if (!tmp2)
						return [ date, tmp ];

					correct_timezone_offset(date);
					correct_timezone_offset(tmp);

					// treat options.get_range_String as format
					date = date.format(tmp2);
					tmp = tmp.format(tmp2);
					if (date !== tmp) {
						// 起始、结束于不同一天。
						纪年 = /^([^年]+)年/;
						年 = date.match(纪年);
						if (年
						//
						&& (tmp2 = tmp.match(纪年))
						// 去除同一年。
						&& 年[1] === tmp2[1])
							tmp = tmp.replace(纪年, '');
						date += PERIOD_DASH + tmp;
					}
					// for 公元前。
					return date.replace(/-(\d+年)/g, '前$1');
				}

			} else if (options.is_era) {
				// 找不到可用之纪年，却 must era；直接 about。
				return;

			} else if (年 && !isNaN(年 = numeralize_date_name(年))) {
				// 视为标准纪年时间（如公元），尝试以日期解析器解析
				date = ((年 < 0 ? 年 : 年.pad(4)) + POSTFIX_年名称
				//
				+ (月 ? (numeralize_date_name(月) || START_MONTH) + '月'
				//
				+ (日 ? (numeralize_date_name(日) || START_DATE) + '日' : '')
				//
				: '')).to_Date({
					parser : standard_time_parser,
					period_end : options.period_end
				});

				library_namespace.debug('parsed date: [' + date + ']', 3,
						'to_era_Date');
				if (!date || isNaN(date.getTime())) {
					// 可能到这边的:如 '1880年庚辰月庚辰日庚辰时'。
					// 从 era_list.search_sorted() 择出所有可能候选。
					var 候选,
					//
					纪年起序 = era_list.search_sorted({
						// 年初
						start : new Date(年 | 0, 0, 1)
					}, {
						comparator : compare_start_date,
						found : true
					}), 纪年迄序 = era_list.search_sorted({
						// 年尾
						start : new Date(年 + 1, 0, 1)
					}, {
						comparator : compare_start_date,
						found : true
					});
					// 找出所有可能之共存纪年。
					纪年_list = era_list[纪年起序].contemporary.concat(era_list
							.slice(纪年起序, 纪年迄序 + 1));

					for (date = new Date(年 | 0, 6, 1), 纪年起序 = 0;
					// 纪年起序 as tmp
					纪年起序 < 纪年_list.length; 纪年起序++) {
						纪年 = 纪年_list[纪年起序];
						候选 = 纪年.Date_to_date_index(date);
						if (候选 && (候选
						// 确定共存纪年延续至当年中。
						= 纪年.date_name_to_Date(纪年.岁名(候选[0]), 月, 日)))
							break;
					}

					date = 候选;
					if (!date) {
						library_namespace.warn(
						//
						'to_era_Date: 无可选的纪年。将 ['
						//
						+ numeralized + '] 当作系统日期 ' + 年 + '/'
						//
						+ (numeralize_date_name(月) || START_MONTH)
						//
						+ '/' + (numeralize_date_name(日) || START_DATE) + '。');
						// 没当作公元日期的原因，是当前尚不能正反解析如"公元8899年1月1日"之类。
						date = new Date(年,
						//
						(numeralize_date_name(月) || START_MONTH) - 1,
						//
						numeralize_date_name(日) || START_DATE);
						纪年_list = null;
					}
				}
			}

			if (!date)
				// 死马当活马医。
				// 不可用 DEFAULT_DATE_PARSER，恐造成循环参照。
				date = String(
						library_namespace.from_Chinese_numeral(numeralized))
						.to_Date(standard_time_parser);

			if (date && tmp2) {
				while (0 < tmp2.length) {
					if ((tmp = tmp2.pop())
					//
					&& (tmp = String(library_namespace
					//
					.from_Chinese_numeral(tmp))
					//
					.replace(/^\D+/, '').replace(/[^\d时分秒]+$/, ''))
					// e.g., '五千六百七十八', '前五千六百七十八'
					&& !(Math.abs(tmp) > 60)
					//
					&& (tmp = String_to_Date(tmp))
					//
					&& (tmp -= new Date(tmp.getTime())
					//
					.setHours(0, 0, 0, 0))) {
						library_namespace.debug('处理时间。 [' + tmp + ']', 3,
								'to_era_Date');
						date.setTime(date.getTime() + tmp);
						break;
					}
				}
			}

			// 处理完 {String}Date。
			// -----------------------------
		} else if (get_next_era()) {
			指定纪年 = 纪年;
		}

		if (options.get_era || options.get_era_list && (纪年 || !date)
				|| options.parse_only || options.get_range
				|| options.get_range_String)
			return;

		if (!date && (指定纪年 || (指定纪年 = get_next_era())))
			date = new Date(指定纪年.start.getTime());

		if (!is_Date(date) || isNaN(date.getTime())) {
			library_namespace.error('to_era_Date: 无法判别纪年 ['
			// numeralized
			+ arguments[0] + '] 之时间或名称资讯！');
			return;
		}

		// 到这里，date 最起码是纪年初始时间。

		if (!isNaN(tmp = options.minute_offset))
			set_minute_offset(date, tmp);

		if (options.date_only) {
			if (指定纪年) {
				add_offset_function(date, 指定纪年);
				if (false && 指定纪年.精)
					date.精 = 指定纪年.精;
			}
			return date;
		}

		// 至此 date 应为 Date，并已筛出可能的主要纪年。
		// Date → era information Date (Date += era information)

		if (tmp = add_contemporary(date, 指定纪年, options)) {
			// 取得真正使用之纪年。
			// 但若可判别(指定纪年)，则以其为主。e.g., CeL.era('泰国阴历2302/2/1')
			纪年 = 指定纪年 || tmp.纪年;

			if (options.range && tmp.length > 0) {
				if (!Array.isArray(侦测集 = options.range))
					侦测集 = [ 侦测集 ];
				纪年_list = library_namespace.Set_from_Array(tmp);
				while (search_era() && get_intersection(matched[0])
						&& 纪年_list.size > 1)
					;
				tmp = Array.from(纪年_list);
				if (tmp.length === 1)
					纪年 = tmp[0];
				else if (tmp.length === 0)
					tmp = 纪年_list = undefined;

			} else
				delete tmp.纪年;
		}

		if (options.get_era_list)
			return 纪年_list;

		if (!tmp)
			return options.era_only ? [] : date;

		if (options.era_only)
			// 此时未设定 (date.共存纪年)
			return tmp;

		纪年.sign_note(date, options);

		return date;
	}

	// TODO: CE, BCE
	to_era_Date.ignore_pattern = /(?:^|\s)[公西][元历暦](?:$|\s)/;

	// ---------------------------------------------------------------------//
	// 应用功能。

	/**
	 * 取得指定关键字之候选列表。
	 * 
	 * @param {String}key
	 *            指定关键字。
	 * 
	 * @returns {Array}指定关键字之候选列表。
	 */
	function get_candidate(key) {
		var list;
		if (!key) {
			// 取得所有年代之列表。
			if (!get_candidate.all_list) {
				list = Object.create(null);
				era_list.forEach(function(era) {
					list[era] = era.toString(SEARCH_STRING);
				});
				get_candidate.all_list = list;
			}
			return get_candidate.all_list;
		}

		if (key in search_index) {
			list = Object.create(null);
			for_each_era_of_key(key, function(era) {
				list[era] = era.toString(SEARCH_STRING);
			});
		}

		else if (key = to_era_Date(key, {
			era_only : true
		})) {
			list = Object.create(null);
			key.forEach(function name(era) {
				list[era] = era.toString(SEARCH_STRING);
			});
		}

		return list;
	}

	var PATTERN_公元年_中历月日
	// [ all, 公元年, 中历月, 中历日, 中历日 ]
	= /(-?\d+)年(?:([闰闰]?\d{1,2})月)?(?:初(\d)|(\d{1,2})日)?/;

	/**
	 * 取得公元 CE_year 年, 中历 月/日 之 CE Date。
	 * 
	 * @param {Natural|String}CE_year
	 *            公元年
	 * @param {Natural|String}[月]
	 *            中历月 (=1)
	 * @param {Natural}[日]
	 *            中历日 (=1)
	 * @param {String}[country]
	 *            国家 (= 中国)
	 * 
	 * @returns {Date|Undefined}date: 公元 CE date.<br />
	 *          {String}date.era: 纪年日期.
	 * 
	 * @since 2016/1/11
	 */
	function 公元年_中历月日(CE_year, 月, 日, country) {
		if (!CE_year && CE_year !== 0)
			return;

		var candidate,
		//
		date = typeof CE_year === 'string'
		// e.g., '401年闰八月初六'
		&& numeralize_date_name(CE_year);
		if (date && (date = date.match(PATTERN_公元年_中历月日)
		// 把 2000/1/1 当作公元2000年 中历1月1日。
		|| date.match(/(\d+)[\/年 ](\d+)\/(\d+)/))) {
			if (!日 && !country)
				country = 月;
			CE_year = date[1];
			月 = date[2];
			日 = date[3] || date[4];
		}

		if (!country)
			// gettext_config:{"id":"china"}
			country = '中国';
		日 |= 0;
		if (日 < START_DATE)
			日 = START_DATE;

		// 转成连续年分
		if (CE_year < 0)
			CE_year++;

		if (isNaN(月)) {
			// for 闰月
			date = numeralize_date_name(月).match(MONTH_NAME_PATTERN);
			if (date)
				date = date[2] | 0;
			else
				date = START_MONTH;
		} else
			date = 月 | 0;
		if (date < START_MONTH)
			date = START_MONTH;
		if (!月 || 月 < START_MONTH)
			月 = START_MONTH;

		// 先估计最接近目标之公元日期。
		// +2: 中历当年比公元晚两个月的日期，应该已经跨中历年。因此以之作为基准。
		// e.g., 公元412年，则 412/3/1 应该已在中历当年内。
		// <9: 若中历月取太晚，例如超过10月，可能会出问题，取得下一年的日期!
		date += (date < 9 ? 2 : 0)
		// -1: month serial → month index.
		// e.g., 2000/1/1: new Date(2000,0,1)
		- 1;
		date = new Date(CE_year, date, 日);
		if (CE_year < 100)
			date.setFullYear(CE_year);

		// 测试每一个共存纪年。
		add_contemporary(date, null, {
			contemporary_filter : function(era) {
				if (candidate || era.name[3] !== country)
					return false;
				var date_index = era.Date_to_date_index(date);
				if (date_index) {
					date_index = era.toString() + era.岁名(date_index[0]) + (
					// era.年名 ||
					POSTFIX_年名称) + 月 + '月' + 日 + '日';
					candidate = to_era_Date(date_index, {
						date_only : true
					});
					if (candidate) {
						candidate.era = date_index;
						return true;
					}
				}
				return false;
			}
		});

		if (candidate)
			return candidate;
		// else: undefined
	}

	// 将 era object 增加到 list 结构中。
	function add_period(object, list, options) {
		var has_period;
		function add_object(o) {
			list.push(o);
			// 扫描有无时期设定。
			// era 无 .attributes
			if (o.attributes && o.attributes[PERIOD_KEY])
				// assert: Array.isArray(o.attributes.时期);
				// assert: o.level === 2
				// === 主要索引名称.length - 纪年名称索引值.时期
				o.attributes[PERIOD_KEY].forEach(function(p) {
					if (!list[PERIOD_KEY][p]) {
						has_period = true;
						(list[PERIOD_KEY][p] = new Period).name
						//
						= PERIOD_PREFIX + p;
					}
					list[PERIOD_KEY][p].add_sub(o);
				});
			else
				list[PERIOD_KEY][''].push(o);
		}

		var is_created = !list[PERIOD_KEY];
		if (is_created)
			list[PERIOD_KEY] = {
				'' : []
			};

		for ( var name in object) {
			if (!Array.isArray(name = object[name]))
				name = [ name ];

			name.forEach(function(o) {
				// 去除循环相依。
				if (o === object)
					return;

				if (!options.含参照用 && Period.is_Period(o)) {
					var i;
					// 只要 .sub, .era
					// 有任一个不是"参照用"，那就显示出来。
					for (i in o.sub) {
						if (!o.sub[i].参照用) {
							add_object(o);
							return;
						}
					}
					for (i in o.era) {
						if (!o.era[i].参照用) {
							add_object(o);
							return;
						}
					}

				} else if (options.含参照用 || !o.参照用) {
					add_object(o);
					return;
				}

				if (library_namespace.is_debug())
					library_namespace.info([ 'add_period: ', {
						// gettext_config:{"id":"skip-$1-the-$2-is-for-reference-purpose-only"}
						T : [ '跳过 [%1]：本[%2]仅供参照用。', o.toString(), 'period' ]
					} ]);
			});
		}

		if (has_period) {
			for ( var p in list[PERIOD_KEY])
				if (p !== '')
					list[PERIOD_KEY][''].push(list[PERIOD_KEY][p]);
		} else if (is_created)
			// 无时期之标注。
			delete list[PERIOD_KEY];

		// return list;
	}

	// get_periods('中国/p:魏晋南北朝'.split('/'))
	// get_periods('中国/p:魏晋南北朝/成汉'.split('/'))
	// get_periods('中国/成汉'.split('/'))
	/**
	 * 取得指定层次/关键字之纪年列表。<br />
	 * 
	 * 回传之列表，会以<b>是否可放在同一时间轴线图中</b>作为分隔。<br />
	 * e.g.,<code>
	 [
		 [
		 	[ 纪年(1年-2年), 纪年(3年-4年) ]
		 ],
		 [
			 [ 纪年(5年-6年), 纪年(7年-8年) ],
			 [ 纪年(6年-7年), 纪年(8年-9年) ]
		 ]
	 ]
	 * </code>
	 * 
	 * @param {Array|String}hierarchy
	 *            指定层次/关键字。
	 * @param {Object}[options]
	 *            附加参数/设定特殊功能与选项.
	 * 
	 * @returns {Array}纪年列表。<br /> [ 同阶层纪年列表 ]
	 */
	function get_periods(hierarchy, options) {
		var period_now = period_root;

		if (hierarchy)
			if (!Array.isArray(hierarchy))
				if (Period.is_Period(hierarchy))
					period_now = hierarchy.sub, hierarchy = null;
				else
					hierarchy = [ hierarchy ];

		// 将 period_now 推到指定层次。
		if (hierarchy && hierarchy.length)
			hierarchy.forEach(function(name) {
				// skip 时期/分类/分区.
				if (!period_now)
					return;
				var matched = name.match(PERIOD_PATTERN);
				period_now =
				//
				matched && period_now[PERIOD_KEY][matched = matched[1]]
				//
				? period_now[PERIOD_KEY][matched]
				//
				: period_now.sub[name];
			});

		if (!period_now) {
			library_namespace.warn('get_periods: 无法取得指定之纪年层次 [' + hierarchy
					+ ']！');
			return;
		}

		if (!period_now.bar) {
			// 前置处理。
			if (!library_namespace.is_Object(options))
				options = Object.create(null);

			var list = [];
			add_period(period_now.sub, list, options);
			add_period(period_now.era, list, options);
			// 作 cache。
			period_now.bar = order_bar(list.sort(compare_start_date));

			get_periods.copy_attributes.forEach(function(key) {
				if (period_now.attributes[key])
					period_now.bar[key] = period_now.attributes[key];
			}, this);

			// 处理历史时期的 bar。
			if (list = list[PERIOD_KEY]) {
				period_now.bar[PERIOD_KEY] = Object.create(null);
				period_now[PERIOD_KEY] = Object.create(null);
				for ( var period_name in list) {
					var period_list = list[period_name];
					if (Array.isArray(period_list))
						period_list = order_bar(period_list
								.sort(compare_start_date));
					else {
						// assert: period_name && period_name !== ''
						// assert: Period.is_Period(list[period_name])
						var period_data
						//
						= period_now[PERIOD_KEY][period_name]
						//
						= period_list;
						period_list = [];
						for ( var _p in period_data.sub)
							period_list.push(period_data.sub[_p]);
						period_list = order_bar(period_list
								.sort(compare_start_date));
						period_data.bar = period_list;
					}

					(period_now.bar[PERIOD_KEY][period_name]
					//
					= period_list)
					//
					.name = PERIOD_PREFIX + period_name;
				}
			}
		}

		return options && options.merge_periods && period_now.bar[PERIOD_KEY]
		//
		? period_now.bar[PERIOD_KEY][''] : period_now.bar;
	}

	// 预设会 copy 的 period 属性。
	// 生卒年月日 Date of Birth and Death, lifetime.
	get_periods.copy_attributes = to_list('生,卒');

	/**
	 * 取得指定纪年之文字式历谱:年历,朔闰表,历日谱。
	 * 
	 * @param {String}era
	 *            完整纪年日期。<br />
	 * @param {Object}[options]
	 *            附加参数/设定特殊功能与选项. 此 options 可能会被变更!<br />
	 * 
	 * @returns {Array}历谱
	 */
	function get_dates(era, options) {
		if (!era)
			return;

		// 前置处理。
		if (!library_namespace.is_Object(options))
			options = Object.create(null);

		var date_list = [], era_list,
		// date: 月历/日历，非年历。
		date = options.月 || options.日,
		//
		add_date = options.date_only ? function(date_time, era) {
			date_list.push(date = new Date(date_time));
			add_offset_function(date, era);
		} : function(date_time, era) {
			date_list.push(date = new Date(date_time));
			add_contemporary(date, era, options);
			era.sign_note(date, options);
		};

		if (typeof era === 'string') {
			// 去掉不需要的空白。
			era = era.replace(/\s+([年月日])/g, '$1')
			//
			.replace(/([年月日])\s+/g, '$1');
			if (era_list = normalize_number(era).match(
			// 月分名称。参考 (月_SOURCE)。
			/\d年([^\s\/.\-年月日]{1,20}月)?/))
				options.月 = 1, options.日 = era_list[1] && 1;

			if (date = date || options.月 || options.日)
				options.get_era = true;
			else
				options.get_era_list = true;
			era_list = to_era_Date(era, options);

		} else
			era_list = era;

		if (!era_list || !date && era_list.size === 0) {
			library_namespace.info([ 'get_dates: ', {
				// gettext_config:{"id":"can-t-find-era-or-regnal-year-named-$1"}
				T : [ '无年号或帝王纪年名称作 [%1]！', era ]
			} ]);
			return;
		}

		// 纪录备查: 由于取得的是最小资讯，不包含共存纪年，因此有需要应自行撷取。
		// date_list.date = era_list;

		if (era_list.精 === '年' || era_list.精 === '月') {
			// 精密度不足。
			if (era_list.精 === '年')
				delete options.月;
			delete options.日;
			delete options.get_era;
			options.get_era_list = true;
			era_list = to_era_Date(era, options);
			date = null;
		}

		if (date) {
			delete options.get_era;
			// [ 岁序, 月序, 日序 | 0 ];
			date_list.selected = era_list.Date_to_date_index(to_era_Date(era,
					options));
			era = era_list;
			if (!era.year_start)
				era.initialize();
		}

		if (options.月 && !options.日) {
			// 月历。
			var year_index = date_list.selected[0],
			//
			j, calendar = era.calendar,
			//
			start_time, year_left = options.year_limit | 0;

			if (year_left < 1)
				year_left = get_dates.DEFAULT_YEARS;

			if (0 < year_index)
				// 纪录前一年段的索引。
				// TODO: 添加多个纪年之日期。
				date_list.previous = concat_era_name([
						era,
						era.岁名(year_index < year_left ? 0 : year_index
								- year_left)
								+ (
								// era.年名 ||
								POSTFIX_年名称) ]);

			for (year_left = Math.min(year_left, calendar.length - year_index); 0 < year_left--; year_index++) {
				start_time = era.year_start[year_index];
				for (j = 0; j < calendar[year_index].length
						&& start_time < era.end;
				//
				start_time += ONE_DAY_LENGTH_VALUE * calendar[year_index][j++])
					add_date(start_time, era);
			}

			date_list.type = 1;
			if (year_index < calendar.length)
				// 纪录后一年段的索引。
				date_list.next = concat_era_name([ era, era.岁名(year_index) + (
				// era.年名 ||
				POSTFIX_年名称) ]);
			return date_list;
		}

		if (date) {
			// 日历。
			date = date_list.selected;
			var i = 0, start_time = 0,
			//
			this_year_data = era.calendar[date[0]];

			for (; i < date[1]; i++)
				// days of month
				start_time += this_year_data[i];
			start_time = era.year_start[date[0]] + ONE_DAY_LENGTH_VALUE
					* start_time;
			this_year_data = start_time + this_year_data[i]
					* ONE_DAY_LENGTH_VALUE;
			if (this_year_data > era.end)
				this_year_data = era.end;
			for (; start_time < this_year_data;
			//
			start_time += ONE_DAY_LENGTH_VALUE)
				add_date(start_time, era);

			date_list.type = 2;
			date = date_list.selected;
			// .日名(日序, 月序, 岁序) = [ 日名, 月名, 岁名 ]
			if (i = era.日名(0, date[1] - 1, date[0]))
				// 纪录前一个月的索引。
				date_list.previous = concat_era_name([ era, i[2] + (
				// era.年名 ||
				POSTFIX_年名称) + i[1] + '月' ]);
			if (start_time < era.end && (i = era.日名(0, date[1] + 1, date[0])))
				// 纪录后一个月的索引。
				date_list.next = concat_era_name([ era, i[2] + (
				// era.年名 ||
				POSTFIX_年名称) + i[1] + '月' ]);
			return date_list;
		}

		// 年历。

		era_list.forEach(function(era) {
			if (era.参照用 && !options.含参照用
					&& !get_dates.no_limit_era.includes(era)) {
				library_namespace.info([ 'get_dates: ', {
					// gettext_config:{"id":"skip-$1-the-$2-is-for-reference-purpose-only"}
					T : [ '跳过 [%1]：本[%2]仅供参照用。', era.toString(), '纪年' ]
				} ]);
				return;
			}

			if (!era.year_start)
				era.initialize();

			var year_start = era.year_start,
			//
			i = 0, l = year_start.length - 1;

			if (l > get_dates.ERA_YEAR_LIMIT
			//
			&& !get_dates.no_limit_era.includes(era)) {
				library_namespace.warn([
				//
				'get_dates: 跳过 [' + era + ']： 跨度过长，共有 '
				//
				+ l + '个年分！您可尝试缩小范围、加注年分 (如输入 "'
				//
				+ concat_era_name([ era,
				//
				era.岁名(0) + (
				// era.年名 ||
				POSTFIX_年名称) ]) + '")，或', {
					a : {
						// Cancel the restriction
						T : '取消限制'
					},
					href : '#',
					onclick : function() {
						get_dates.set_restriction(era, false);
						return false;
					}
				}, '。' ]);
			} else {
				for (; i < l; i++) {
					if (true || date_list.length < get_dates.LIMIT)
						add_date(year_start[i], era);
					else {
						library_namespace.warn(
						//
						'get_dates: 输出年段纪录过长，已超过输出总笔数限制 ' + get_dates.LIMIT
								+ ' 笔！');
						break;
					}
				}
			}
		});

		return date_list;
	}

	// 输出总笔数限制。
	// get_dates.LIMIT = Infinity;
	// 跳过跨度过长之纪年。
	get_dates.ERA_YEAR_LIMIT = 150;
	get_dates.no_limit_era = [];
	// 预设月历之年数。
	get_dates.DEFAULT_YEARS = 10;

	// 可取消限制，强制显示 allow display/showing, disable restriction
	// CeL.era.dates.set_restriction('泰国阴历', false)
	get_dates.set_restriction = function(era, enable_restriction) {
		if (typeof era === 'string') {
			var _era = get_era(era);
			if (!_era) {
				library_namespace.warn('set_restriction: Invalid era key: '
						+ era);
				return;
			}
			era = _era;
		}

		var index = get_dates.no_limit_era.indexOf(era);
		if (typeof enable_restriction !== 'boolean') {
			return index === NOT_FOUND;
		}

		if (enable_restriction) {
			if (index !== NOT_FOUND) {
				get_dates.no_limit_era.splice(index, 1);
				library_namespace.info('已回复 [' + era + '] 之限制。');
			}
			return true;

		} else if (index === NOT_FOUND) {
			get_dates.no_limit_era.push(era);
			library_namespace.info(
			//
			'已取消 [' + era + '] 之限制。请注意有些操作将极度费时！');
			return false;
		}
	};

	// ---------------------------------------------------------------------//

	// 警告: 此函数会更改原输入之 date_value!
	function Date_to_era_String(date_value, format, locale, options) {
		// 前置处理。
		if (!library_namespace.is_Object(options))
			options = Object.create(null);
		var config = this || options, 纪年名,
		// 指定纪年。
		纪年 = config.era_object;
		if (!纪年) {
			// 在有绑定时，不考虑 options.era。
			if (纪年名 = config.era)
				if ((纪年 = get_era_Set_of_key(纪年名))
				//
				&& 0 < (纪年 = 纪年.values()).length) {
					if (纪年.length !== 1)
						// assert: 有超过1个纪年。
						library_namespace.warn('Date_to_era_String: 共取得 '
								+ 纪年.length + ' 个可能的纪年 [' + 纪年名 + ']！');
					纪年 = 纪年[0];
				} else
					纪年 = to_era_Date(纪年名, {
						get_era : true
					});

			if (!纪年) {
				library_namespace.warn(
				//
				'Date_to_era_String: 无法取得指定之纪年 [' + 纪年名 + ']！');
				return;
			}

			// 纪年之 cache。
			if (this)
				this.era_object = 纪年;
		}

		// 前置处理。
		if (!date_value)
			date_value = new Date;
		if (!('numeral' in options) && ('numeral' in config))
			options.numeral = config.numeral;

		// 警告: 此函数会更改原输入之 date_value!

		纪年.sign_note(date_value, options);

		return strftime(date_value,
		//
		format || config.format,
		//
		locale || config.locale, options);
	}

	(function() {
		var era_name, era_data,
		// 为各特殊历法特设。
		// 今天是农历 <code>(new Date).format('Chinese')</code>
		era_to_export = {
			Chinese : {
				era : '中历',
				format : '%岁次年%月月%日'
			}
		};

		Date_to_String_parser.era = Date_to_era_String;

		for (era_name in era_to_export) {
			Date_to_String_parser[era_name] = Date_to_era_String.bind(
			//
			era_data = era_to_export[era_name]);
			if (!era_data.numeral)
				era_data.numeral = era_name;
			if (!era_data.locale)
				era_data.locale = library_namespace.gettext
						.to_standard(era_name);
		}
	})();

	// ---------------------------------------------------------------------//
	// 网页应用功能。
	// warning: need CeL.interact.DOM

	// UNDONE
	function determain_node_era(node) {
		var node_queue = [];
		var era_data = library_namespace.DOM_data(node, 'era');

	}

	/**
	 * 计算已具纪年标记之指定 HTML node 之纪年值。
	 * 
	 * @param {ELEMENT_NODE}node
	 *            具纪年标记之指定 node。
	 * @param {Boolean}[return_type]
	 *            回传的型别。 'String': 仅回传 era String。
	 * 
	 * @returns [range] || {String}date
	 */
	function calculate_node_era(node, return_type) {
		var era, date, previous_date_to_check, original_era,
		// data-era: read-only
		era_data = library_namespace.DOM_data(node, 'era');
		if (!era_data) {
			// no era data. Not a era node. Skip this node.
			return;
		}

		// 看看是不是有之前解析、验证过的cache。
		if (return_type === 'String'
				&& (era = library_namespace.DOM_data(node, 'era_refrenced'))) {
			return era;
		}
		era = library_namespace.DOM_data(node, 'era_parsed');
		// console.log(era);
		if (!era) {
			// determain node era
			if (false) {
				var node_queue = [], era_map = new Map;
				// 自身不完整。溯前寻找 base。
				for (var node_to_test = node;;
				//
				node_to_test = library_namespace.previous_node_of(node_to_test)) {
					if (!node_to_test) {
						break;
					}
					if (!node_to_test.tagName
							|| node_to_test.tagName.toLowerCase() !== set_up_era_nodes.default_tag) {
						continue;
					}
					// console.log(node_to_test);

					era = library_namespace
							.DOM_data(node_to_test, 'era_parsed');
					if (era) {
						node_queue.unshift(node_to_test);
						continue;
					}

					var era_data = library_namespace.DOM_data(node_to_test,
							'era');
					era = library_namespace.set_text(node_to_test);
					if (era_data !== '~') {
						// '~':如英语字典之省略符号，将以本node之内含文字代替。
						era = era_data.replace('~', era);
					}
					// console.log(era);

					// 去除(干支_PATTERN): 预防"丁未"被 parse 成丁朝之类的意外。
					date = !干支_PATTERN.test(era)
					// 预防被解析为明朝的年份。
					&& !era.startsWith('明年') && to_era_Date(era, {
						parse_only : true
					});

					if (!date || !date[1]) {
						continue;
					}

					// date: [ {Set}纪年_list, {Era}纪年, 年, 月, 日 ]
					node_queue.unshift([ node_to_test, date, date[0].size ]);
					if (node_queue.length > 3 && date[0].size === 1) {
						// 找到了准确认判断出的。
						break;
					}

					// console.log(date[0]);
					date[0].forEach(function(era) {
						// console.log(era);
						era_map.set(era,
								era_map.has(era) ? era_map.get(era) + 1 : 1);
					});
				}

				console.log([ node_queue, era_map ]);
				return;
			}

			// ------------------------------------
			// 解析 era。
			era = library_namespace.set_text(node);
			if (era_data !== '~') {
				// '~':如英语字典之省略符号，将以本node之内含文字代替。
				era = era_data.replace('~', ' ' + era);
			}
			// console.log([ 'era:', era ]);

			// 去除(干支_PATTERN): 预防"丁未"被 parse 成丁朝之类的意外。
			date = !干支_PATTERN.test(era)
			// 预防被解析为明朝的年份。
			&& !era.startsWith('明年') && to_era_Date(era, {
				parse_only : true
			});

			var previous_date = undefined,
			//
			get_previous_date = function() {
				var node_queue = [];
				// 自身不完整。溯前寻找 base。
				var node_to_test = node;
				while (node_to_test = library_namespace
						.previous_node_of(node_to_test)) {
					// 向前取第一个可以明确找出日期的。
					if (previous_date = calculate_node_era(node_to_test,
							'String'))
						break;
				}
				return previous_date;
			};

			// date: [ {Set}纪年_list, {Era}纪年, 年, 月, 日 ]
			if (!date || !date[1]) {
				if (!get_previous_date()
				// && (!date || !date[1])
				) {
					return;
				}

				original_era = date = to_era_Date(era, {
					parse_without_check : true
				});
				// console.log([ 'original_era:', original_era ]);
				if (original_era && original_era[0]
						&& original_era[0].size === 1) {
					original_era = Array.from(original_era[0])[0];
				} else {
					original_era = null;
				}
				date = to_era_Date(era, {
					parse_only : true,
					base : previous_date
				});
				// console.log([ previous_date, date.join(', ') ]);
				if (!date[1])
					return;

				// 检查本节点有几项资料。
				previous_date_to_check = [];
				date.slice(2).forEach(function(name, index) {
					if (name)
						previous_date_to_check.push(index);
				});
				if (previous_date_to_check.length === 1) {
					previous_date_to_check.unshift(previous_date);
				} else {
					previous_date_to_check = null;
				}
			}

			// assert: date: [ {Set}纪年_list, {Era}纪年, 年, 月, 日 ]

			var era_list = date.shift();
			if (era_list && era_list.size > 1) {
				// 当存在有多个可能的纪年时，应该从前文来筛选出比较可能的一个。
				if (previous_date || get_previous_date()) {
					// console.log(previous_date);
					// console.log(era);
					era_list = to_era_Date(era, {
						parse_only : true,
						base : to_era_Date(previous_date, {
							date_only : true
						})
					});
					// console.log(era_list);
					era_list.shift();
					if (era_list[0] && era_list[1]) {
						// 确定可以找到时，才采用以{Date}为准的日期。
						date = era_list;
					} else {
						// e.g., "永历二年" + "闰六月"
					}
					// assert: 必然会选出最接近的一个纪年。
					era_list = null;

				} else {
					library_namespace.warn('calculate_node_era: [' + era
					//
					+ ']: 共取得 ' + era_list.size + ' 个可能的纪年名称: '
					//
					+ Array.from(era_list).map(function(era) {
						// 大约年份
						return era + ' (' + era.start.format('%Y') + ')';
					}).join(', '));
				}

			} else {
				era_list = null;
			}

			era = date.shift();
			if (!era) {
				// e.g., 昭宗永历 注
				return;
			}
			if (Array.isArray(era.name)) {
				// 当有多个可能的纪年名称时，仅取纪年名，保留最大可能性。
				era = era_list ? era.name[0] : era.toString();
			}
			if (original_era
					&& era !== (original_era = original_era.toString())) {
				library_namespace.debug('本节点本来就指定了纪年名称[' + original_era
						+ ']，因此当作后续节点之参考时，将使用原先的纪年，而不采用解析出的纪年[' + era + ']。');
			} else {
				original_era = null;
			}

			// console.log([ 'date:', date.join(', '), 'era:', era ]);
			var date_name = date.shift();
			if (date_name) {
				var tmp = date_name + (
				// original_era && original_era.年名 ||
				POSTFIX_年名称);
				era += tmp;
				if (original_era)
					original_era += tmp;
				if (date_name = date.shift()) {
					tmp = date_name + '月';
					era += tmp;
					if (original_era)
						original_era += tmp;
					if (date_name = date.shift()) {
						tmp = date_name + '日';
						era += tmp;
						if (original_era)
							original_era += tmp;
					}
				}
			}

			// assert: {String}era

			// cache.
			if (original_era)
				library_namespace.DOM_data(node, 'era_refrenced', original_era);
			library_namespace.DOM_data(node, 'era_parsed', era);
		}

		var era_date = to_era_Date(era);
		if (era_date.error) {
			node.title = era + ': ' + era_date.error;
			// 假如有明确指定纪年名称，则依然可参照之。
			var tmp = to_era_Date(library_namespace.set_text(node), {
				parse_only : true
			});
			if (false)
				console.log([ node, library_namespace.set_text(node), tmp, era,
						era_date ]);
			if (!tmp || !tmp[1] || tmp[1].toString() !== era_date.纪年名) {
				library_namespace.set_class(node, 'era_text', {
					remove : true
				});
				// reset event / style
				node.style.cursor = '';
				node.onclick = node.onmouseover = node.onmouseout = null;
				return;
			}
		}

		if (return_type === 'String') {
			if (previous_date_to_check) {
				var error = null,
				//
				previous_date = to_era_Date(previous_date_to_check[0]);
				// 当仅有年月日其中一项资料的时候，比较有可能是判读、解析错误。因此某些情况下不拿来当作参考对象。
				if (previous_date - era_date > 0) {
					error = '时间更早';
				} else {
					var diff_in_2_months = (era_date - previous_date)
							/ (2 * 大月 * ONE_DAY_LENGTH_VALUE);
					if (previous_date_to_check[1] === 2 ? diff_in_2_months > 1
					// ↑ 仅有日期资料。 ↓ 仅有月份资料。
					: previous_date_to_check[1] === 1 ? diff_in_2_months > 12
					// 当间隔过大，例如超过80年时，则跳过这一笔。
					: diff_in_2_months > 40 * 12) {
						error = '间距过长';
					}
				}
				if (error) {
					node.title = era + ': ' + error;
					library_namespace.warn('calculate_node_era: 本节点[' + era
							+ ']比起前一个节点[' + previous_date_to_check[0] + ']'
							+ error + '，且只有一项资料['
							+ '年月日'.charAt(previous_date_to_check[1])
							+ ']，因此跳过本节点而取前一个节点。');
					return;
				}
			}

			// console.log([ 'trace back to', era ]);
			return /* !era_date.error && */era;
		}

		if (era_date.error) {
			return;
		}

		// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time
		node.setAttribute('datetime', era_date.toISOString());
		if (return_type === 'Date')
			return era_date;
		date = era_date.format(calculate_node_era.era_format);

		var tmp = to_era_Date(era, {
			get_range_String : calculate_node_era.format
		});
		if (tmp.includes(PERIOD_DASH))
			date += '起';

		tmp = [ era, date, tmp ];
		// TODO: era_date.精;
		// TODO: era_date.准;
		if (era_date.共存纪年) {
			// old: ☼
			date = '<br />⏳ ';
			tmp.push('<hr />'
			// gettext_config:{"id":"contemporary-period"}
			+ library_namespace.gettext('共存纪年') + '：' + date
			//
			+ era_date.共存纪年.map(function(era_date) {
				var era_string = era_date.toString();
				// 准确程度_ENUM
				if (era_date.疑 || era_date.传说) {
					return '<span style="color:#888;" title="存在疑问、不准确的纪年">'
					//
					+ era_string.toString() + '<sub>('
					// 特别标示存在疑问、不准确的纪年。
					+ (era_date.疑 ? '疑' : '传说') + ')</sub></span>';
				}
				return era_string;
			}).join(date));
		}

		return tmp;
	}

	// 纪年名
	calculate_node_era.era_format = {
		parser : standard_time_parser,
		format : '%纪年名%年年%月月%日日(%日干支)',
		locale : 'cmn-Hant-TW'
	};
	// range
	calculate_node_era.format = {
		parser : standard_time_parser,
		format : standard_time_parser_name + '%Y年%m月%d日'
	};

	/**
	 * popup 纪年资讯 dialog 之功能。
	 * 
	 * @returns {Boolean}false
	 */
	function popup_era_dialog() {
		var era = this.era_popup, date;
		if (era) {
			// had cached
			library_namespace.toggle_display(this.era_popup, true);

		} else if (era = calculate_node_era(this)) {
			if (date = this.add_date) {
				date = {
					get_range_String : {
						parser : standard_time_parser,
						format : String(date) === 'true'
						//
						? popup_era_dialog.format : date
					}
				};
				date = to_era_Date(calculate_node_era(this, 'String'), date);
				// `date` maybe `undefined`
			}
			if (date) {
				date = '（' + date + '）';

				if (this.appendChild)
					this.appendChild(document.createTextNode(date));
				else
					this.innerHTML += date;

				// reset flag.
				try {
					delete this.add_date;
				} catch (e) {
					this.add_date = undefined;
				}
			}

			// TODO: 检验若无法设定 this.era_popup

			library_namespace.locate_node(this.era_popup = library_namespace
					.new_node({
						div : era.join('<br />'),
						C : 'era_popup',
						// 尽可能预防残留 dialog。
						onmouseout : popup_era_dialog.clear.bind(this)
					}, document.body), this);
		}

		if (era)
			library_namespace.set_class(this, 'era_popupd');

		return false;
	}

	popup_era_dialog.format = '%Y年%m月%d日';

	popup_era_dialog.clear = function(clear) {
		if (this.era_popup)
			library_namespace.toggle_display(this.era_popup, false);
		if (clear)
			this.era_popup = null;
		library_namespace.set_class(this, 'era_popupd', {
			remove : true
		});

		return false;
	};

	/**
	 * 设定好 node，使纪年标示功能作动。
	 * 
	 * @param {ELEMENT_NODE}node
	 */
	function set_up_era_node(node, options) {
		// 先测试是否已标记完成，以加快速度。
		if (!library_namespace.has_class(node, 'era_text')
		//
		&& library_namespace.DOM_data(node, 'era')) {
			node.onmouseover = popup_era_dialog;
			node.onmouseout = popup_era_dialog.clear;
			if (options) {
				if (options.add_date)
					// append date
					node.add_date = options.add_date;
				if (options.onclick) {
					node.onclick = function(e) {
						// 清掉残存的 dialog。
						popup_era_dialog.clear.call(this, true);
						return options.onclick.call(this, e);
					};
					node.style.cursor = 'pointer';
				}
			}
			library_namespace.set_class(node, 'era_text');
		}
	}

	/**
	 * 设定好所有 <tag> node，使纪年标示功能作动。
	 * 
	 * @param {String}tag
	 */
	function set_up_era_nodes(tag, options) {
		// var last_era;
		if (!tag)
			tag = set_up_era_nodes.default_tag;
		if (typeof tag === 'string')
			library_namespace.for_nodes(options ? function(node) {
				set_up_era_node(node, options);
			} : set_up_era_node, tag);

		else if (library_namespace.is_ELEMENT_NODE(tag))
			set_up_era_node(tag, options);

		else
			library_namespace.warn('set_up_era_nodes: 无法设定 [' + tag + ']');
	}

	// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time
	set_up_era_nodes.default_tag = 'time'.toLowerCase();

	// --------------------------------------------

	// 辨识史籍(historical book)纪年用之 pattern。
	// [ all, head, era, tail ]
	var 史籍纪年_PATTERN, ERA_ONLY_PATTERN,
	//
	朔干支_PATTERN = generate_pattern('(朔<\\/' + set_up_era_nodes.default_tag
			+ '>)(干支)()', false, 'g'),
	// 十二地支时辰. e.g., 光绪十九年八月初二日丑刻
	时干支_PATTERN = generate_pattern(/(支)[时刻]/, false, 'g'),
	// see era_text_to_HTML.build_pattern()
	REPLACED_data_era = '$1<' + set_up_era_nodes.default_tag
			+ ' data-era="~">$2</' + set_up_era_nodes.default_tag + '>$3';

	/**
	 * 将具有纪年日期资讯的纯文字文本(e.g., 史书原文)，转成供 set_up_era_node() 用之 HTML。<br />
	 * 设定 node.innerHTML = node 后，需要自己设定 set_up_era_node()!
	 * 
	 * @param {String}text
	 *            具纪年日期资讯的纯文字文本(e.g., 史书原文)
	 * @param {ELEMENT_NODE}[node]
	 * 
	 * @returns {String} 供 set_up_era_node() 用之 HTML。
	 */
	function era_text_to_HTML(text, node, options) {
		if (!史籍纪年_PATTERN)
			era_text_to_HTML.build_pattern();

		if (typeof text === 'string') {
			// search
			// 预防 `史籍纪年_PATTERN` 于利用到 pattern 前后，这部分被吃掉。
			// 像 "十年，七月庚辰" 就会在 match 了 "十年，" 后，无法 match 到 "七月"。
			var matched, list = [], last_index = 0;
			while (matched = 史籍纪年_PATTERN.exec(text)) {
				// @see REPLACED_data_era
				list.push(text.slice(last_index, matched.index
						+ matched[1].length), '<'
						+ set_up_era_nodes.default_tag + ' data-era="~">'
						+ matched[2] + '</' + set_up_era_nodes.default_tag
						+ '>');
				史籍纪年_PATTERN.lastIndex -= matched[3].length;
				last_index = 史籍纪年_PATTERN.lastIndex;
			}
			list.push(text.slice(last_index));
			text = list.join('');

			// search for 仅纪年亦转换的情况。 e.g., '天皇'.
			text = text.replace(ERA_ONLY_PATTERN, REPLACED_data_era)
			//
			.replace(朔干支_PATTERN, REPLACED_data_era)
			//
			.replace(时干支_PATTERN, function($0, 时辰) {
				var end = library_namespace.BRANCH_LIST
				// 2: 每个时辰两小时
				.indexOf(时辰) * 2 + 1, start = end - 2;
				if (start < 0)
					// 24: 每天24小时
					start += 24;
				// 时: 小时
				start += PERIOD_DASH + end + '时';
				return options && options.add_date
				//
				? $0 + '(' + start + ')'
				//
				: '<' + set_up_era_nodes.default_tag
				//
				+ ' title="' + start + '">'
				//
				+ $0 + '</' + set_up_era_nodes.default_tag + '>';
			})
			// format
			.replace(/\n/g, '<br />');
		}

		if (node) {
			if (typeof node === 'string')
				node = document.getElementById(node);
			node.innerHTML = text;
			// console.log(node);
			// set_up_era_node(node, options);
			set_up_era_nodes(null, options);
		} else
			return text;
	}

	/**
	 * 建构辨识史籍纪年用之 pattern。
	 */
	era_text_to_HTML.build_pattern = function(options) {
		var 纪年 = [];
		create_era_search_pattern().forEach(function(key) {
			var matched = key.match(/^(.+)(?:天皇|皇后)$/);
			if (matched)
				纪年.push(matched[1]);
		});
		ERA_ONLY_PATTERN = new RegExp('([^>])((?:' + 纪年.join('|')
				+ ')(?:天皇|皇后))([^<])', 'g');

		// (纪年)?年(月(日)?)?|(月)?日|月
		纪年 = create_era_search_pattern().join('|')
				.replace(/\s*\([^()]*\)/g, '');
		// 去掉「〇」
		// "一二三四五六七八九"
		var 日 = library_namespace.Chinese_numerals_Normal_digits.slice(1),
		// e.g., 元, 二, 二十, 二十二, 二十有二, 卅又二
		年 = '(?:(?:[廿卅]|[' + 日 + ']?十)[有又]?[' + 日 + ']?|[' + 日 + '元明隔去]){1,4}年',
		// 春王正月 冬十有二月, 秦二世二年后九月
		月 = 季_SOURCE + '[闰闰后]?(?:[正腊' + 日 + ']|十[有又]?){1,3}月';
		日 = '(?:(?:(?:干支)?(?:初[' + 日 + ']日?|(?:' + 日
		// "元日":正月初一，常具文意而不表示日期，剔除之。
		+ '|(?:[一二三]?十|[廿卅])[有又]?[' + 日 + ']?|[' + 日 + '])日)|干支日?)[朔晦望]?旦?'
		// 朔晦望有其他含义，误标率较高。
		+ (options && options.add_望 ? '|[朔晦望]日?' : '') + ')';

		/**
		 * 建构 史籍纪年_PATTERN
		 * 
		 * TODO: 排除 /干支[年岁岁]/
		 * 
		 * <code>

		// test cases:

		地皇三年，天凤六年改为地皇。
		改齐中兴二年为天监元年
		以建平二年为太初元年
		一年中地再动
		大酺五日
		乃元康四年嘉谷
		（玄宗开元）十年

		道光十九年正月廿五

		未及一年
		去年
		明年
		是[年月日]
		《清华大学藏战国竹简（贰）·系年》周惠王立十又七年
		岁 次丙子四月丁卯

		</code>
		 */
		史籍纪年_PATTERN = [
		// 识别干支纪年「年号+干支(年)」。
		'(?:' + 纪年 + ')+干支年?',
		// 一般纪年. 立: 周惠王立十又七年, [)]: （玄宗开元）十年
		'(?:' + 纪年 + ')*(?:）|\\)|立)?' + 年 + '(?:' + 月 + 日 + '?)?',
				'(?:' + 月 + ')?' + 日, 月 ];
		// console.log(史籍纪年_PATTERN);
		史籍纪年_PATTERN = generate_pattern(
		// 0: head 为为乃
		'(^|[^酺])'
		// 1: era
		+ '(' + 史籍纪年_PATTERN.join('|') + ')'
		// 2: tail
		+ '([^中]|$)', false, 'g');
		// console.log(史籍纪年_PATTERN);
		return 史籍纪年_PATTERN;
	};

	/**
	 * 标注文本: 直接处理一整个 HTML 元素，加上帝王纪年/年号纪年标示。
	 * 
	 * @example <code>
	CeL.run([ 'data.date.era', 'interact.DOM' ]);
	CeL.env.era_data_load = function(country, queue) {
		if (!queue) {
			CeL.era.note_node('#mw-content-text', { add_date : true });
		}
	};
	 * </code>
	 */
	function add_era_note(node, options) {
		library_namespace.for_nodes(function(node, index) {
			// console.log(node);
			var text;
			if (node.nodeType !== document.TEXT_NODE
					|| !(text = library_namespace.set_text(node)).trim()) {
				return;
			}

			var HTML = era_text_to_HTML(text, null, options);
			if (text === HTML) {
				// 没有改变。处理下一个。
				return;
			}

			var last_node = node, parentNode = node.parentNode,
			//
			container = document.createElement(parentNode.tagName || 'div');
			container.innerHTML = HTML;
			// console.log(container);
			library_namespace.get_tag_list(container.childNodes).reverse()
			// node.parentNode.childNodes[index] === node;
			.forEach(function(n) {
				parentNode.insertBefore(n, last_node);
				last_node = n;
				if (false && n.tagName && n.tagName.toLowerCase()
				// TODO: useless...
				=== set_up_era_nodes.default_tag)
					set_up_era_node(n, options);
			});
			// 去掉原先的文字节点。
			node.parentNode.removeChild(node);

		}, node, {
			traversal : true
		});

		set_up_era_nodes(null, options);
	}

	// ---------------------------------------------------------------------//
	// export 导出.

	Object.assign(to_era_Date, {
		set : parse_era,
		pack : pack_era,
		extract : extract_calendar_data,
		periods : get_periods,
		// normalize_date : normalize_date,
		get_candidate : get_candidate,
		dates : get_dates,
		era_list : create_era_search_pattern,
		for_dynasty : for_dynasty,
		for_monarch : for_monarch,
		numeralize : numeralize_date_name,
		中历 : 公元年_中历月日,

		NEED_SPLIT_PREFIX : NEED_SPLIT_PREFIX,
		NEED_SPLIT_POSTFIX : NEED_SPLIT_POSTFIX,
		concat_name : concat_era_name,
		reduce_name : reduce_era_name,

		compare_start : compare_start_date,
		Date_of_CE_year : get_Date_of_key_by_CE,
		MINUTE_OFFSET_KEY : MINUTE_OFFSET_KEY,

		// 网页应用功能。
		node_era : calculate_node_era,
		setup_nodes : set_up_era_nodes,
		to_HTML : era_text_to_HTML,
		note_node : add_era_note,
		//
		PERIOD_PATTERN : PERIOD_PATTERN
	}, sign_note.notes);

	// 加工处理。
	(function() {
		function note_proxy(date_value, options) {
			return this(options
			//
			&& options.original_Date || date_value);
		}
		var notes = sign_note.notes;
		for ( var name in notes)
			notes[name]
			//
			= note_proxy.bind(notes[name]);
	})();

	Object.assign(sign_note.notes, {
		// 注意:依 .format() 之设定，在未设定值时将采本处之预设。
		// 因此对于可能不设定的值，预设得设定为 ''。

		// 讲述东周历史的两部典籍《春秋》和《战国策》都是使用帝王纪年。
		// 共伯和/周定公、召穆公
		// 国号
		朝代 : '',
		// 君主(帝王)号
		君主 : '',

		// 共和
		// 君主(帝王)/年号/民国
		纪年 : '',
		纪年名 : '',

		// 季节:
		// 立春到立夏前为春季，立夏到立秋前为夏季，立秋到立冬前为秋季，立冬到立春前为冬季。

		年 : '(年名)',
		月 : '(月名)',
		日 : '(日名)',

		// 重新定义 (override)
		// 东汉四分历以前，用岁星纪年和太岁纪年（岁星:木星）。到现在来用干支纪年。
		// 干支纪年萌芽于西汉，始行于王莽，通行于东汉后期。
		岁次 : function(date_value, options) {
			return (options
			//
			&& options.original_Date || date_value).岁次
					|| library_namespace.guess_year_stem_branch(date_value,
							options);
		},
		// 重新定义 (override) alias
		// gettext_config:{"id":"year-of-the-sexagenary-cycle"}
		年干支 : '岁次',
		// gettext_config:{"id":"year-of-the-sexagenary-cycle"}
		年柱 : '岁次',

		// 星座 : '',

		// 占位:会引用 Date object 本身的属性。
		// see strftime()
		// gettext_config:{"id":"month-of-the-sexagenary-cycle"}
		月干支 : '月干支',
		// 每年正月初一即改变干支，例如钱益谦在崇祯十五年除夕作「壬午除夕」、隔日作「癸未元日」
		// 日干支:'干支纪日',
		// 月干支:'干支纪月',
		// gettext_config:{"id":"month-of-the-sexagenary-cycle"}
		月柱 : '月干支',
		闰月 : '(是否为闰月)',
		大小月 : '(大小月)',

		// 昼夜 : '',
		// 第一个时辰是子时，半夜十一点到一点。
		// 时辰 : '子丑寅卯辰巳午未申酉戌亥',
		// 晚上七点到第二天早上五点平均分为五更（合十个小时），每更合二个小时。
		// 更 : '',

		// 用四柱神算推算之时辰八字
		四柱 : '%年柱%月柱%日柱%时柱',
		// 生辰八字
		八字 : '%年干支%月干支%日干支%时干支',

		// 夏历 : '%岁次年%月月%日日%辰时',
		// 农民历 : '',

		// 授时历即统天历
		历法 : '',

		// 注解
		注 : ''
	});
	strftime.set_conversion(sign_note.notes,
	//
	library_namespace.gettext.to_standard('Chinese'));
	// 已经作过改变，不再利用之。
	delete sign_note.notes;

	Object.assign(library_namespace, {
		十二生肖_LIST : 十二生肖_LIST,
		十二生肖图像文字_LIST : 十二生肖图像文字_LIST,
		阴阳五行_LIST : 阴阳五行_LIST
	});

	String_to_Date.parser.era = function(date_string, minute_offset, options) {
		if (false) {
			// 依 String_to_Date() 当前之实作，不会出现此般差错。

			// 引数之前置处理。
			if (library_namespace.is_Object(minute_offset)) {
				if (!options)
					options = minute_offset;
			} else if (!isNaN(minute_offset)) {
				if (!library_namespace.is_Object(options))
					options = Object.create(null);
				options.minute_offset = minute_offset;
			}
		}

		library_namespace.debug('parse (' + typeof date_string + ') ['
				+ date_string + ']', 3, 'String_to_Date.parser.era');
		return to_era_Date(date_string, options);
	};

	// 更正 data.date .age_of.get_new_year
	library_namespace.date.age_of.get_new_year = get_Date_of_key_by_CE;

	// ---------------------------------------

	this.finish = function(name_space, waiting) {
		// 载入各纪年期间历数资料 (era_data.js)。
		var queue = [ library_namespace.get_module_path(this.id + '_data')
		// .replace(/\\{2,}/g, '\\')
		];
		if (library_namespace.is_WWW(true))
			// 载入 CSS resource(s)。
			// include resources of module.
			queue.unshift(library_namespace.get_module_path(this.id).replace(
					/[^.]+$/, 'css'));
		// library_namespace.log(queue);
		library_namespace.run(queue, waiting);
		return waiting;
	};

	return to_era_Date;
}
