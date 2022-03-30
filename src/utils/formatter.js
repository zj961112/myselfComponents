/**
 * 减少一级 object 嵌套深度
 * @param {object} target 
 * @param {string} prop
 * @returns object
 * 如 obj: { type: { value: 1, label: '类型' } } 可转化为 obj: { type: 1 } 或者 obj: { type: '类型' }
 */
const flattenObject = function (target = {}, prop = 'value') {
    if (!target instanceof Object) return target;
    const obj = {};
    for (let key in target) {
        obj[key] = target[key][prop];
    }
    return obj;
}

/**
 * 减少一级对象数组嵌套深度
 * @param {array} target <object>
 * @param {string} prop
 * @returns array
 * 如 array: [{ id: 1, value: 'a' }, { id: 2, value: 'b' }] 可转化为 array: [1, 2]
 */
const flattenObjectArray = function (target = [], prop = 'id') {
    if (!target instanceof Array) return target;
    const array = [];
    target.forEach(item => {
        array.push(item[prop]);
    })
    return array;
}

/**
 * 返回一个目标数组中不包含在比较数组中的值组成的新数组
 * @param {array} target 
 * @param {array} compareArray 
 * @returns array
 */
const differenceArray = function (target, compareArray) {
    if (!target instanceof Array) return array;
    const arr = [];
    target.forEach(item => {
        if (compareArray.indexOf(item) == -1) {
            arr.push(item);
        }
    });
    return arr;
}

export {
    flattenObject,
    flattenObjectArray,
    differenceArray
}