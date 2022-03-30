<template>
    <div id="formUpload">
        <div class="avatar" v-for="(file, fileIndex) in fileList" :key="file.uid" :style="style" v-show="fileType === 'image'">
            <el-image
                :src="file.url"
                :preview-src-list="srcList">
            </el-image>
            <div class="avatar-delete" v-if="showDelete">
                <i class="el-icon-error" @click="handleImageDelete(fileIndex)"></i>
            </div>
            <div class="avatar-download" :href="file.url" @click="downloadImg(file)" v-if="showDownload">下载</div>
        </div>
        <el-upload 
            ref="fileUpload" 
            class="avatar-uploader" 
            :class="{ disabled: disabled }"
            :action="uploadUrl" 
            :headers="headers"
            :show-file-list="false" 
            :multiple="multiple"
            :limit="limit"
            :disabled="disabled"
            :file-list="fileList"
            :auto-upload="false"
            :on-exceed="handleOnExceed"
            :on-change="handleFileChange" 
            :before-upload="beforeUpload" 
            :on-success="handleSuccess" 
            :on-error="handleError">
            <i class="el-icon-plus avatar-uploader-icon" :class="{ disabled: disabled }" :style="style"></i>
        </el-upload>
        <p class="tips" v-if="tips">{{tips}}</p>
    </div>
</template>
<script>
import { validateLocalImg } from '@/utils/validator';
import { getToken } from '@/utils/auth';

export default {
    name: 'formUpload',
    props: {
        /*
		 * 传入的组件参数
		 * @param { any } value 组件的值
		 * @param { boolean } showTips 是否展示提示文字
		 * @param { string } tips 提示文字
		 * @param { any } accept 允许的图片格式，允许传入 string 格式，array 格式，正则表达式
		 * @param { object } style 样式，主要为上传区域大小
		 * @param { number } size 允许上传的图片大小最大值，单位为 KB
         * @param { boolean } multiple 是否支持多选文件
         * @param { number } limit 限制图片上传数量
         * @param { boolean } disabled 是否禁用
         * @param { boolean } showDownload 是否允许下载
         * @param { boolean } showDelete 是否可删除
		 */
        item: {
            type: Object,
            default() { }
        },
    },
    data() {
        return {
            fileList: [], // 上传列表
            fileErrList: [], // 图片上传错误列表
        }
    },
    computed: {
        /**
         * 样式，默认 width: 178px height: 178px
         */
        style() {
            return this.item.style || {
                width: '100px',
                height: '100px',
                lineHeight: '100px'
            }
        },
        /**
         * 提示文字
         */
        tips() {
            let _tips;
            const { showTips, tips, accept } = this.item;
            if (showTips) {
                if (tips) {
                    _tips = tips;
                } else if (accept) {
                    if (typeof accept === 'string') {
                        _tips = `请上传${accept}格式的图片`;
                    } else if (accept instanceof Array) {
                        _tips = `请上传${accept.join('、')}格式的图片`;
                    }
                }
            }
            return _tips;
        },
        /**
         * 当前图片上传数量限制
         */
        limit() {
            return Number(this.item.limit) || 1;
        },
        /**
         * 是否允许图片多选，暂不开启多选
         */
        multiple() {
            return false;
        },
        /**
         * 是否禁用
         */
        disabled() {
            return Boolean(this.item.disabled);
        },
        /**
         * 图片列表
         */
        srcList() {
            return this.fileList.map(file => file.url)
        },
        /**
         * 是否允许下载
         */
        showDownload() {
            return this.item.showDownload === false ? false : true
        },
        /**
         * 是否允许删除
         */
        showDelete() {
            return this.item.showDelete === false ? false : true
        },
        /**
         * 图片上传地址
         */
        uploadUrl() {
            const urls = {
                production: 'https://api.taedata.com/auth-center-api/auth/file/upload',
                test: 'http://test-api.taedata.com/auth-center-api/auth/file/upload',
                development: 'http://test-api.taedata.com/auth-center-api/auth/file/upload'
            };
            return urls[process.env.NODE_ENV];
        },
        /**
         * 文件类型，默认图片
         */
        fileType() {
            return this.item.fileType || 'image';
        },
        /**
         * 请求头
         */
        headers() {
            return {
                token: this.$store.getters.token || getToken(),
                appId: 1,
            }
        }
    },
    created() {
        this.initData();
    },
    methods: {
        /**
         * 数据初始化
         */
        initData() {
            this.fileList = this.item.value || [];
        },
        /**
         * 监听文件变化
         */
        handleFileChange(file) {
            const isReady = file.status === 'ready';
            // 忽略非 ready 的其他状态
            if (!isReady) return;
            if (!file.url) {
                file.url = URL.createObjectURL(file.raw);
            }
            file.err = '';
            validateLocalImg(file, this.item, this.tips).then(_ => {
                this.$refs.fileUpload.submit();
            }).catch(async errText => {
                this.fileErrList.push({ ...file });
                this.$message.warning(errText);
            })
        },
        /**
         * 图片上传之前
         * @params {object} file 图片文件信息
         */
        beforeUpload(file) {
            // uid: 每次触发控件的文件唯一标识
            const itemIndex = this.fileErrList.findIndex(item => item.uid === file.uid);
            if (itemIndex > -1) {
                // 从`未通过校验`的列表中移除，
                this.fileErrList.splice(itemIndex, 1);
                return false;
            } else {
                return true;
            }
        },
        /**
         * 文件上传成功
         */
        handleSuccess(response, file, fileList) {
            const { successed, errorDesc, returnValue } = response;
            if (!successed || errorDesc || !returnValue) {
                return this.$message.error(errorDesc || '服务器出错，请联系开发人员');
            } else {
                const { uid, size, name } = file;
                const fileList = this.limit > 1 ? this.fileList : [];
                fileList.push({
                    uid,
                    size,
                    name,
                    url: returnValue
                })
                this.fileList = fileList;
                this.$emit('handleChange', this.item.key, this.fileList);
            }
        },
        /**
         * 文件上传失败时提示
         */
        handleError(err) {
            this.$message.error(err);
        },
        /**
         * 上传数量超出限制
         */
        handleOnExceed(file, fileList) {
            return this.$message.error(`图片数量超出限制，最多可上传${this.limit}张`);
        },
        /**
         * 删除图片
         * @param {number} index 当前序列
         */
        handleImageDelete(index) {
            this.fileList.splice(index, 1);
            this.$emit('handleChange', this.item.key, this.fileList);
        },
        /**
         * 图片下载
         * @param {object} 文件对象
         */
        downloadImg(file) {
            const src = file.url;
            var x = new XMLHttpRequest();
    　　　　　//禁止浏览器缓存；否则会报跨域的错误
            x.open("GET", src + '?t=' + new Date().getTime(), true);
            x.responseType = 'blob';
            x.onload = function(e) {
                var url = window.URL.createObjectURL(x.response);
                var a = document.createElement('a');
                a.href = url;
                a.download = file.urlId || new Date().getTime();
                a.click();
            }
            x.send();
        },
    }
}
</script>
<style lang="scss" scoped>
/deep/ .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
/deep/ .avatar-uploader .el-upload:hover {
    border-color: #409eff;
}

/deep/ .avatar-uploader.disabled .el-upload:hover {
    border-color: #d9d9d9;
}


.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
    &.disabled {
        cursor: not-allowed;
    }
}

.avatar {
    position: relative;
    width: 178px;
    height: 178px;
    display: block;
    float: left;
    margin-right: 10px;
    margin-bottom: 5px;
    .el-image {
        width: 100%;
        height: 100%;
        margin-bottom: 5px;
    }
    .avatar-delete {
        position: absolute;
        width: 10px;
        height: 10px;
        top: -5px;
        right: -5px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: white;
        display: none;
        .el-icon-error {
            font-size: 20px;
            cursor: pointer;
        }
    }
    .avatar-download {
        position: absolute;
        width: 100%;
        height: 30px;
        left: 0;
        bottom: 0;
        font-size: 12px;
        text-align: center;
        line-height: 30px;
        color: white;
        cursor: pointer;
        display: none;
        background-color: rgba($color: #000000, $alpha: 0.5)
    }
    &:hover {
        .avatar-delete {
            display: flex;
        }
        .avatar-download {
            display: block;
        }
    }
}

.tips {
    margin: 0;
    font-size: 14px;
    color: #999;
    height: 16px;
    line-height: 16px;
}
</style>