/**
 * Created by jiachenpan on 16/11/18.
 */

export function isvalidUsername(str) {
    const valid_map = ['admin', 'editor']
    return valid_map.indexOf(str.trim()) >= 0
}

/* 合法uri*/
export function validateURL(textval) {
    const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
    return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
    const reg = /^[a-z]+$/
    return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
    const reg = /^[A-Z]+$/
    return reg.test(str)
}

/* 大小写字母*/
export function validatAlphabets(str) {
    const reg = /^[A-Za-z]+$/
    return reg.test(str)
}

/* 是否数字 */
export function validateNumber(num) {
    const reg = /^(\-|\+)?\d+(\.\d+)?$/;
    return reg.test(num);
}

/*
 * 是否为整数
 * 2019.2.25 修改自李贤波
 * 修改原因：当传入数值转化为二进制后位数超过32位，此时使用 | 运算符时将报错
 */
export function validateInteger(num) {
    // 2019.2.25移除
    // return (num | 0) == num;
    // 2019.2.25新增
    if (typeof num === 'number') {
        return num % 1 === 0;
    } else if (typeof num === 'string') {
        return num.indexOf('.') < 0 && num % 1 === 0;
    } else {
        return false;
    }
}

/*
 * 校验是浮点数字可用性
 * @param value: 必选，被校验的值 (.11 这样的数字在校验时会自动转为0.11)
 * @param length: 可选，浮点位数，默认 2
 * */
export function validateFloat(value, length = 2) {
    return new RegExp(`^\\d+(?:\\.\\d{1,${length}})?$`).test(value)
}

/*
 * 校验是否为一个Object对象
 * @param isEmpty: Boolean 是否允许为空对象
 * */
export function isObject(target, isEmpty) {
    // if (typeof target !== 'object') return false;
    if (Object.prototype.toString.call(target) !== '[object Object]') return false;
    if (!isEmpty) return true;
    for (let key in target) {
        if (target.hasOwnProperty(key)) return true;
    }
    return false;
}

/*
 * 校验是否包含中文
 * @param {string} string 目标字符串
 * */
export function isChinese(string) {
    const patrn = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;
    return patrn.exec(string);
}


// 默认的文件校验规则
const defaultFileRules = {
    size: 15 * 1024, // 5M
    accept: /([./])(gif|jpe?g|png)$/i, // 图片格式
    hasRatio: false // 是否需要校验高宽比例
};

/**
 * 根据条件校验本地图片信息，返回Promise的处理结果
 * @param file: 通过el-upload选择的单个文件对象
 * @param _rules: 文件的校验规则
 *        _rules: { accept, size, minWidth, maxWidth, minHeight, maxHeight, noRatio, 'tips' }
 * */
export function validateLocalImg(file, _rules, acceptErr) {
    const rules = Object.assign({}, defaultFileRules, _rules);
    return new Promise((resolve, reject) => {
        const raw = file.raw;
        const acceptErrMsg = acceptErr || '图片格式不正确！';
        if (rules.accept instanceof Array) { // 传入格式为数组时校验方式
            if (rules.accept.findIndex(item => `image/${item}` === raw.type) === -1) return reject(acceptErrMsg, 'type');
        } else if (typeof rules.accept === 'string') { // 传入格式为字符串时校验方式
            if (rules.accept.indexOf(raw.type) === -1) return reject(acceptErrMsg, 'type');
        } else if ((!!raw.type.trim() && !rules.accept.test(raw.type)) || !rules.accept.test(raw.name)) { // 传入格式为正则表达式时校验方式
            return reject(acceptErrMsg, 'type');
        }
        // 校验文件大小，单位KB
        const sizeExceeded = file.size / 1024 > rules.size;
        if (sizeExceeded) {
            return reject(`图片大小不能超过${rules.size}KB`, 'size');
        }
        // 校验图片的尺寸
        const image = new Image();
        image.onload = () => {
            const { width, height } = image;
            const measure = { width, height };
            if (!validateImgMeasure(measure, rules)) {
                const info = rules.ratio && rules.range ? `，建议${rules.ratio}，${rules.range}` : ''
                reject(rules.tips || `图片尺寸不正确${info}`, 'measure')
            } else {
                resolve({
                    name: file.name,
                    measure,
                    src: file.url,
                    uid: file.uid,
                    status: 'loading' // ready
                })
            }
        };
        image.src = file.url;
    })
}

// 校验图片长宽比例与尺寸
export function validateImgMeasure({width, height}, rules = {}) {
    const ruleRatio = rules.hasRatio ? rules.scaleLength / rules.scaleWidth : 0;
    const imgRatio = rules.hasRatio ? width / height : 0;
    const squareSize = rules.squareSize;
    if (squareSize) {
        // 正方形尺寸
        rules = Object.assign({}, rules, {
            minWidth: squareSize,
            maxWidth: squareSize,
            minHeight: squareSize,
            maxHeight: squareSize,
        })
    }
    return !(
        // `hasRatio` 需要校验比例
        (rules.hasRatio && ruleRatio !== imgRatio) ||
        width < rules.minWidth || height < rules.minHeight ||
        width > rules.maxWidth || height > rules.maxHeight
    )
}

// 校验本地文件的格式与大小
export function validateLocalFile(file, _rules) {
    const rules = Object.assign({}, defaultFileRules, _rules);
    return new Promise((resolve, reject) => {
        const raw = file.raw;
        if (
            (!!raw.type.trim() && !rules.accept.test(raw.type)) ||
            !rules.accept.test(raw.name)
        ) {
            return reject(`文件格式不正确!`, 'type');
        }

        // 校验文件大小，单位KB
        const sizeExceeded = file.size / 1024 > rules.size;
        if (sizeExceeded) {
            return reject(`您上传的文件大小不能超过${rules.size}KB`, 'size');
        }

        resolve({
            name: file.name,
            src: file.url,
            uid: file.uid,
            status: 'loading' // ready
        })
    })
}

// 将Base64的图片数据转换成Blob
function dataURItoBlob(base64Data) {
    let byteString;
    if (base64Data.split(',')[0].indexOf('base64') >= 0) { // base64数据
        // 解码base64字符串
        byteString = atob(base64Data.split(',')[1]);
    } else { // 其他
        // 解码通过escape转义编码的字符串
        byteString = unescape(base64Data.split(',')[1]); // 此方法已从 Web 标准中删除
    }

    // 读取文件的MIME类型
    const mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
    // 准备`二进制补码8位无符号整数`的数组
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
        // 逐个获取UTF-16编码单元的数字，并添加至数组对应的位置
        ia[i] = byteString.charCodeAt(i);
    }

    // blob的内容由参数数组中给出的值的串联组成
    return new Blob([ia], {
        type: mimeString
    })
}

/**
 * 校验值仅包含中文
 * @param {*} target 
 * @returns 
 */
export function validateChinese(target) {
    if (!target) return false;
    return target === target.replace(/[^\u4E00-\u9FA5]/g, '');
}
