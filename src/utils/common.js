import { getToken } from '@/utils/auth';
import store from '@/store';
let { $alert, $message: Message } = window.Vue.prototype;
// 读取excel
export function readExcel(file, callback) {
    return new Promise((resolve, reject) => {
        var fileReader = new FileReader();
        var persons = []; // 存储获取到的数据
        // 以二进制方式打开文件
        fileReader.readAsBinaryString(file);
        fileReader.onload = function(ev) {
            let workbook;
            try {
                const data = ev.target.result;
                workbook = XLSX.read(data, { type: 'binary' }); // 以二进制流方式读取得到整份excel表格对象
            } catch (e) {
                reject('文件类型不正确')
                return;
            }

            // 表格的表格范围，可用于判断表头是否数量是否正确
            let fromTo = '';
            // 遍历每张表读取
            for (let sheet in workbook.Sheets) {
                if (workbook.Sheets.hasOwnProperty(sheet)) {
                    fromTo = workbook.Sheets[sheet]['!ref'];
                    persons = persons.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
                    // break; // 如果只取第一张表，就取消注释这行
                }
            }
            if (typeof callback === 'function') {
                callback(persons);
            }
            resolve(persons)
        };
        fileReader.onerror = () => {
            reject('读取失败')
        }
    })
}

export function setPickerDate(picker, startdate, enddate, callback) {
    const daySecond = 3600 * 1000 * 24,
        end = new Date(),
        start = new Date();
    start.setTime(start.getTime() - daySecond * startdate);
    end.setTime(end.getTime() - daySecond * enddate);
    picker.$emit('pick', [start, end]);
    if (callback) {
        callback();
    }
}

export function openImageBox(url) {
    $alert(`<img src=${url} style="width: 300px;"></img>`, '', {
        dangerouslyUseHTMLString: true,
        showConfirmButton: false,
        closeOnClickModal: true,
        center: true
    }).catch(() => {})
}

export function getParamFromUrl(name, url = '') {
    var after = url.split("?")[1] || window.location.hash.split("?")[1];
    if (after) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = after.match(reg);
        if (r != null) {
            return decodeURIComponent(r[2]);
        } else {
            return null;
        }
    }
}
/*
 * 首字母大写
 * @param {string} str 传入的字符串
 */
export function firstUpperCase(str) {
    return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
}
/*
 * 页面跳转
 * @param {string} url 要跳转的url
 * @param {object} obj url参数
 * @param {str} api url域名，默认取process.env的BASE_API
 */
export function goTo(url, obj, api = 'BASE_API') {
    let toGo = process.env[api] + '/' + url;
    if (!obj.token) {
        obj.token = getToken()
    }
    for (let i in obj) {
        if (toGo.indexOf('?') > 0) {
            toGo += ('&' + i + '=' + obj[i]);
        } else {
            toGo += ('?' + i + '=' + obj[i]);
        }
    };
    window.location.href = toGo;
}

/*
 * 判断两个对象是否键值对应相等
 * @param {any} a 目标对象a
 * @param {any} b 目标对象b
 */
export function isEqual(a, b) {
    // 如果 a 和 b 本来就全等
    if (a === b) {
        // 判断是否为 0 和 -0
        return a !== 0 || 1 / a === 1 / b;
    }
    //判断是否为null和undefined
    if (a == null || b == null) {
        return a === b;
    }
    //接下来判断a和b的数据类型
    var classNameA = toString.call(a),
        classNameB = toString.call(b);
    //如果数据类型不相等，则返回false
    if (classNameA !== classNameB) {
        return false;
    }
    //如果数据类型相等，再根据不同数据类型分别判断
    switch (classNameA) {
        case '[object RegExp]':
        case '[object String]':
            //进行字符串转换比较
            return '' + a === '' + b;
        case '[object Number]':
            //进行数字转换比较,判断是否为NaN
            if (+a !== +a) {
                return +b !== +b;
            }
            //判断是否为0或-0
            return +a === 0 ? 1 / +a === 1 / b : +a === +b;
        case '[object Date]':
        case '[object Boolean]':
            return +a === +b;
    }
    //如果是对象类型
    if (classNameA == '[object Object]') {
        //获取a和b的属性长度
        var propsA = Object.getOwnPropertyNames(a),
            propsB = Object.getOwnPropertyNames(b);
        if (propsA.length != propsB.length) {
            return false;
        }
        for (var i = 0; i < propsA.length; i++) {
            var propName = propsA[i];
            //如果对应属性对应值不相等，则返回false
            if (a[propName] !== b[propName]) {
                return false;
            }
        }
        return true;
    }
    //如果是数组类型
    if (classNameA == '[object Array]') {
        if (a.toString() == b.toString()) {
            return true;
        }
        return false;
    }
}


export function setLocalStorage(key, value) {
    let storeStr = JSON.stringify({
        sType: typeof value,
        sValue: value,
    });
    localStorage.setItem(key, storeStr);
}

export function getLocalStorage(key) {
    let storeStr = localStorage.getItem(key);
    let storeJson, storeRes;
    if (storeStr === null) {
        return null;
    }
    try {
        storeJson = JSON.parse(storeStr);
        storeRes = typeof storeJson.sValue === storeJson.sType ? storeJson.sValue : storeJson;
    } catch (error) {
        storeRes = storeStr;
    }
    return storeRes;
}

/**
 * @param str 目标字符串
 * @param len 想要获取的长度
 * @param start 想要获取的长度
 * @returns string 输出截图的字符串
 */
export function getSubString(str, len, start = 0) {
    if (!str || typeof str !== 'string') return;
    return str.substr(start, len);
}

/**
 * 判断目标变量是否为空
 * @param {any} target 目标对象
 */
export function isEmpty(target) {
    switch (typeof target) {
        case 'undefined':
            return true;
        case 'string':
            if (target.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length == 0) return true;
            break;
        case 'boolean':
            if (!target) return true;
            break;
        case 'number':
            if (isNaN(target)) return true;
            break;
        case 'object':
            if (null === target || target.length === 0) return true;
            for (var i in target) {
                return false;
            }
            return true;
    }
    return false;
}

/**
 * 移除对象内的空属性
 * @param {any} target 目标对象
 */
export function removeEmptyProps(target) {
    for (let key in target) {
        if (isEmpty(target[key])) {
            delete target[key]
        }
    };
    return target;
}

/**
 * 校验参数是否为空并弹出提示
 * @param {any} target 目标
 * @param {str} msg 提示信息
 */
export function validateEmpty(target, msg) {
    if (isEmpty(target)) {
        Message({
            message: msg,
            type: 'warning',
            duration: 2 * 1000
        })
        return true;
    }
    return false;
}

/**
 * 分隔字符串
 * @param {string} string 目标字符串
 * @param {str} symbol 分隔符号
 */
export function stringSplit(string, symbol) {
    if (typeof string !== 'string' || !string) {
        return null;
    } else {
        return string.split(symbol);
    }
}

/**
 * 转换文件大小（按单位）,例如 字节数(bytes) / 1024 返回为 KB
 * @param {*} size 
 * @param {*} units 
 * @param {*} emptyValue 
 * @returns 
 */
export function translateFileSize(size = 0, units = 1024, emptyValue = '0') {
    const number = size > 0 ? (size / units) : 0;
    return (number > 0 ? number.toFixed(2) : '') || emptyValue
}

/**
 * 对象排序
 * @param {*} prop 
 * @param {*} sort 
 * @returns 
 */
const compareObj = function(prop, sort = 'asc') {
    return function (obj1, obj2) {
        let value1 = Number(obj1[prop]);
        let value2 = Number(obj2[prop]);
        if (!isNaN(value1) && !isNaN(value2)) {
            return sort === 'asc' ? value1 - value2 : value2 - value1;
        }
        
    }
}

/**
 * 根据数组内的对象的某个key值进行排序
 * @param {*} target 目标数组
 * @param {*} key 排序的根据key值
 * @param {*} sort asc-升序 desc-降序
 */
export function compareObjectArr(target = [], prop, sort = 'asc') {
    if (!target instanceof Array) return target;
    return target.sort(compareObj(prop, sort));
}

/**
 * 从对象数组中获取 prop 对应的值
 * @param {*} target 目标对象数组
 * @param {*} targetValue 要获取的 targetValue 值
 * @param {*} key 数组中对象的 key，默认用 code
 * @param {*} name 数组中对象的 value，默认用 name
 * @returns 
 */
export function getValueFromDictionary(target = [], targetValue, key = 'code', value = 'name') {
    if (!target instanceof Array) return '';
    return (target.find(item => item[key] === targetValue) || {})[value];
}

/**
 * 获取链接中 decode 后的指定参数
 * @param {String} url 链接
 * @param {String} name 指定参数的名称
 */
 export function getDecodeParamFromUrl(url, name) {
	var query = url.split("?")[1];
	if (query) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = query.match(reg);
		if (r != null) {
			return decodeURIComponent(r[2]);
		} else {
			return null;
		}
	}
}

/**
 * 获取链接中 decode 后的所有参数
 * @param {String} url 链接
 */
export function getDecodeParamsFromUrl(url) {
	let query = window.location.hash.split("?")[1].split("&");
	let params = {};
	query.forEach((x) => {
		if (x) {
			let item = x.split("=");
			params[item[0]] = decodeURIComponent(item[1]);
		}
	});
	return params;

}

/**
 * 生成 encode 的链接
 * @param {String} url 链接
 */
export function createUrlWithEncodeParams(base_url, params) {
	let result = base_url.indexOf("http") > -1 ? base_url : `http://${base_url}`;
	for (let key in params) {
		if (result.indexOf('?') > 0) {
			result += `&${key}=${decodeURIComponent(params[key])}`;
		} else {
			result += `?${key}=${decodeURIComponent(params[key])}`;
		}
	};
	return result;
}
/**
 * 根据屏幕自适应获取表单元素最大宽度
 * @returns 
 */
export function getFormElementMaxWidth() {
    let maxWidth = 300;
    const clientWidth = document.documentElement.clientWidth;
    if (clientWidth >= 1500 && clientWidth < 1650) {
        maxWidth = 250;
    } else if (clientWidth < 1500) {
        maxWidth = 200;
    };
    return maxWidth;
}