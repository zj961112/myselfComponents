/**
 * 表单数据配置初始化
 * @class FormData
 * @constructor 
 */
export class FormData {
    constructor(params = {}) {
        this.params = params;
    }
    /**
     * 初始化数据，给数据增加 disabled 属性和 hidden 属性
     * @param {object} config 初始完整配置信息
     * @returns 初始化后的数据
     */
    initData(config) {
        const { allDisabled, disabledKeys, allHidden, hiddenKeys, type } = this.params;
        for (let key in config) {
            if (allDisabled || (disabledKeys || []).includes(key) && typeof config[key].disabled !== 'function') {
                config[key].disabled = true;
            }
            if (allHidden || (hiddenKeys || []).includes(key) && typeof config[key].hidden !== 'function') {
                config[key].hidden = true;
            }
            if (['add', 'update'].includes(type)) {
                config[key].showTooltip = false;
                if (config[key].configs) {
                    config[key].configs.showTooltip = false;
                }
            }
        }
        return config;
    }
}
