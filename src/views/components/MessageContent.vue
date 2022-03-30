<template>
    <el-row class="base-container-content">
            <el-col :span="10">
                <p class="base-container-content-title">版式预览</p>
                <!-- 微信预览 -->
                <div v-if="channeType == 2" class="base-container-content-item">
                    <WeChatPreview :name="formDataTwo.channelTitle.value" :passFieldList="ruleForm.fieldList"></WeChatPreview>
                </div>
                
                <!-- 钉钉预览 -->
                <div v-if="channeType == 1" class="base-container-content-item">
                    <NailingPreview :name="formDataTwo.channelTitle.value" :passFieldList="ruleForm.fieldList"></NailingPreview>
                </div>
                
                <!-- 短信预览 -->
                <div v-if="channeType == 3" class="base-container-content-item">
                    <SmsPreview :name="formDataTwo.channelTitle.value" :passFieldList="ruleForm.fieldList"></SmsPreview>
                </div>
                
            </el-col>
            <el-col :span="14">
                <p class="base-container-content-title">版式配置</p>
                <BaseForm :index="2" class="template-custome" :refs="$refs" :form="formDataTwo" :footerConfig="footerConfig" :labelWidth="200">
                </BaseForm>
                <el-form :model="ruleForm" ref="ruleForm" label-position="right" :label-width="'200px'" class="demo-ruleForm">
                    <div v-for="(item,index) in ruleForm.fieldList" :key="index">
                        <el-row :gutter="10" v-if="!isMessage">
                            <el-col :span="14">
                                <el-form-item :label="`字段${index+1}：`" :prop="'fieldList.' + index + '.field'" :rules="{
                                required: true, message: 'key不能为空', trigger: 'blur'
                                }">
                                    <el-input :disabled="type=='view'" v-model="item.field" placeholder="请输入key"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label-width="0" :prop="'fieldList.' + index + '.describe'" :rules="{
                                required: true, message: '描述不能为空', trigger: 'blur'
                                }">
                                    <el-input :disabled="type=='view'" v-model="item.describe" placeholder="请输入描述"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4">
                                <el-button :disabled="type=='view'" class="add-btn" v-if="index==0" type="primary" @click="addField" plain>添加字段</el-button>
                                <el-button :disabled="type=='view'" class="add-btn" v-if="index!==0" type="danger" icon="el-icon-delete" circle @click="deleteField(index)"></el-button>
                            </el-col>
                        </el-row>
                        <el-row :gutter="10" v-else>
                            <el-col :span="24">
                                <el-form-item :label="`${item.describe}：`" :prop="'fieldList.' + index + '.value'" :rules="{
                                required: true, message: `${item.describe}不能为空`, trigger: 'blur'
                                }">
                                    <el-input :disabled="type=='view'" v-model="item.value" :placeholder="`请输入${item.describe}`"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>
                </el-form>
            </el-col>   
    </el-row>
</template>
<script>
import { BaseForm } from '@/components/index';
// import { BasicInfoFormDataTwo } from '../templateManage/format/components/config';
import { WeChatPreview,NailingPreview,SmsPreview } from './index'
import { flattenObject } from '@/utils/formatter';
export default {
    components: {
        BaseForm,
        WeChatPreview,
        NailingPreview,
        SmsPreview
    },
    props: {
        /**
         * 类型
         * add-新增 update-编辑 view-查看
         */
        dataSource: {
            type: Object,
            default() {
                return {}
            }
        },
        type:{
            type: String,
            default: ''
        },
        isMessage:{
            type: Boolean,
            default: false
        },
        templateId:{
            type: String,
            default: ''
        }
    },
    data() {
        return {
            formDataTwo:{},
            ruleForm:{
                fieldList:[
                    {
                        field:'',
                        describe:'',
                        value:''
                    }
                ],
            },
            footerConfig: {
                show: false,
            },
            channeType:2,//发送方式
            formatId:'',
            name:''
        }
    },
    created() {
        this.initData();
    },
    activated() {
        const { meta, query } = this.$route;
        if (meta.new) {
            this.initData();
        }
    },
    methods:{
        /**
         * 初始化数据
         */
        initData() {
            const hiddenKeys = [];  //需要隐藏的字段名
            const disabledKeys = [];  //不能编辑的字段名
            this.formDataTwo = Object.assign({}, new BasicInfoFormDataTwo({
                type: this.type,
                disabledKeys: disabledKeys,
                allDisabled: (this.type == 'view'),
                hiddenKeys: (this.type === 'add') ? hiddenKeys : []
            }))
            //注册一个事件，改变发送方式
            this.formDataTwo.channel.change = (value)=>{
                //微信公众号
                if(value == 2){
                    this.channeType = 2
                }
                if(value == 3){
                    this.channeType = 3
                }
                if(value == 1){
                    this.channeType = 1
                }
            }
            this.ruleForm = {
                fieldList:[
                    {
                        field:'',
                        describe:'',
                        value:''
                    }
                ]
            }
            this.channeType = 2
            // this.commonPromise.storeGradesPromise.then(res => {
            //     this.formData.storeGrade.selectList = res;
            // })

        },
        //新增字段
        addField(){
            this.ruleForm.fieldList.push(
                {
                    field:'',
                    describe:'',
                    value:''
                }
            )
        },
        //删除字段
        deleteField(index){
            this.ruleForm.fieldList.splice(index,1)
        },
        //提交
        submit(){
            this.$refs['BaseForm_2'].validate(valid => {
                this.$refs['ruleForm'].validate(valid2 => {
                    if (valid&&valid2) {
                        const ids = this.ruleForm.fieldList.map(value=>value.field);
                        if(this.getTips(ids)){
                            this.$message.warning('不能存在相同的key')
                            return 
                        }
                        const descs = this.ruleForm.fieldList.map(value=>value.describe);
                        if(this.getTips(descs)){
                            this.$message.warning('不能存在相同的描述')
                            return 
                        }
                        const { channel,channelCode,channelTitle } = flattenObject(this.formDataTwo);
                        let param = {
                            channel,
                            channelCode,
                            channelTitle,
                            channelFields:this.ruleForm.fieldList,
                            formatId:this.formatId,
                            templateId:this.templateId
                        }
                        this.$emit('dataPass',param)
                    }
                })
            })
        },
        //判断有没有重复的值
        getTips(ids){
            const idsSet = new Set(ids);
            if(idsSet.size != ids.length){
                return true
            }else{
                return false
            }
        },
        getInfo(data){
            for (let key in this.formDataTwo) {
                this.formDataTwo[key].value = data[key];
                if(this.isMessage){
                    this.formDataTwo[key].disabled = true
                }
            }
            this.ruleForm.fieldList = data.channelFields?JSON.parse(data.channelFields):[]
            this.formatId = data.id
            this.name = data.channelTitle
            this.channeType = data.channel
        }
    }    
}
</script>
<style lang="scss">
.base-container-content{
    padding: 0 20px;
        &-title{
            text-align: center;
        }
    .template-custome{
        width: 80%;
        margin: auto;
    }
    .demo-ruleForm{
        padding:0 20px;
        width: 80%;
        margin: auto;
        .el-input{
            max-width: 100%;
        }
        .add-btn{
            
        }
    }
    .base-container-content-item{
        width: 90%;
        margin: 0 auto;
    }
    
}
</style>