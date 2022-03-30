/**
 * Created by jiachenpan on 16/11/18.
 */

export function parseTime(time, cFormat) {
    if (arguments.length === 0) {
        return null
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
        date = time
    } else {
        if (('' + time).length === 10) time = parseInt(time) * 1000
        date = new Date(time)
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    }
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key]
        if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
        if (result.length > 0 && value < 10) {
            value = '0' + value
        }
        return value || 0
    })
    return time_str
}

export function formatTime(time, option) {
    time = +time * 1000
    const d = new Date(time)
    const now = Date.now()

    const diff = (now - d) / 1000

    if (diff < 30) {
        return '刚刚'
    } else if (diff < 3600) { // less 1 hour
        return Math.ceil(diff / 60) + '分钟前'
    } else if (diff < 3600 * 24) {
        return Math.ceil(diff / 3600) + '小时前'
    } else if (diff < 3600 * 24 * 2) {
        return '1天前'
    }
    if (option) {
        return parseTime(time, option)
    } else {
        return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
    }
}

export function formatDate(time, fmt) {
    fmt = fmt || 'yyyy-MM-dd'; //默认年月日，想要加上时分秒就传yyyy-MM-dd hh:mm:ss
    let data = new Date(time);
    var o = {
        "M+": data.getMonth() + 1, //月份
        "d+": data.getDate(), //日
        "h+": data.getHours(), //小时
        "m+": data.getMinutes(), //分
        "s+": data.getSeconds(), //秒
        "q+": Math.floor((data.getMonth() + 3) / 3), //季度
        "S": data.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (data.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
    return fmt;
}

/**
 * 格式化时间为 yyyy-MM-dd hh:mm:ss 格式
 * @param {*} time 
 * @param {string} type 
 * @returns 
 */
export function formatDateTime(time, type) {
    if (!time) return;
    return formatDate(time, 'yyyy-MM-dd') + ` ${type === 'end' ? '23:59:59' : '00:00:00'}`;
}

export function mistiming(sDate1, sDate2) {
    // 计算开始和结束的时间差
    let aDate, oDate1, oDate2, iDays
    aDate = sDate1.split('-')
    oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
    aDate = sDate2.split('-')
    oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
    iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24)
    return iDays + 1
}

export function countDate(start, end) {
    // 判断开始和结束之间的时间差是否在90天内
    let days = mistiming(start, end)
    let stateT = days > 90 ? Boolean(0) : Boolean(1)
    return {
        state: stateT,
        day: days
    }
}
export function timeForMat(count, type) {
    // 拼接时间
    let time1 = new Date()
    // time1.setTime(time1.getTime() - (24 * 60 * 60 * 1000))
    time1.setTime(time1.getTime())
    let Y1 = time1.getFullYear()
    let M1 = ((time1.getMonth() + 1) >= 10 ? (time1.getMonth() + 1) : '0' + (time1.getMonth() + 1))
    let D1 = (time1.getDate() >= 10 ? time1.getDate() : '0' + time1.getDate())
    let timer1 = Y1 + '-' + M1 + '-' + D1 // 当前时间

    let time2 = new Date()
    time2.setTime(time2.getTime() - (24 * 60 * 60 * 1000 * count))
    // time2.setTime(time2.getTime())
    let Y2 = time2.getFullYear()
    let M2 = ((time2.getMonth() + 1) >= 10 ? (time2.getMonth() + 1) : '0' + (time2.getMonth() + 1))
    let D2 = (time2.getDate() >= 10 ? time2.getDate() : '0' + time2.getDate())
    let timer2 = Y2 + '-' + M2 + '-' + D2 // 之前的7天或者30天
    if (type == 1) {
        return {
            endTime: timer1,
            startTime: timer2
        }
    } else {
        return {
            endTime: timer2,
            startTime: timer2
        }
    }
}


/**
 *
 * @param fmt 你想要的格式,比如'yyyy-MM-dd hh:mm:ss'
 * @param date 日期
 * @returns {*} 输出格式化的日期
 */
export function dateFtt(fmt, date) {
    var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

/**
 * 获取一天到凌晨的时间戳
 * @param date 获取该时间对象当日最小的时间戳
 * @returns {number} 当前日期0时0分0秒0毫秒的时间戳
 */
function getWeeTime(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

/**
 * 判断一个日期是不是今天
 * @param date {} 日期
 * @returns {boolean}
 */
export function isToday(date) {
    return getWeeTime(date) === getWeeTime(new Date());
}

// 范围日期选择器的左侧快捷选取的配置
export const pickerShortcuts = [
    {
        text: '今天',
        onClick(picker) {
            const start = new Date();
            picker.$emit('pick', [start, start]);
        }
    }, {
        text: '最近一周',
        onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
        }
    }, {
        text: '最近一个月',
        onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
        }
    }, {
        text: '最近三个月',
        onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
        }
    }
];
