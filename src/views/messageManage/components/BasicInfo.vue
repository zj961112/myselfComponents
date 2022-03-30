<template>
    <div id="BasicInfo" class="message-base-container">
        <h2 v-if="type == 'view'" class="message-title">{{sendForm.title}}</h2>
        <el-form :model="sendForm" ref="ruleForm1" :label-width="type == 'add'?'140px':'100px'">
            <div class="form-demo">
                <el-form-item v-if="type == 'view'" label="发送人：" required>
                    <el-input v-model="sendForm.sendUser" placeholder="发送人" disabled></el-input>
                </el-form-item>
                <el-form-item v-if="type == 'view'" label="推送时间：" required>
                    <el-date-picker
                        v-model="sendForm.sendTime"
                        :disabled="type == 'view'"
                        type="datetime"
                        placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="发送对象：" required>
                    <div class="tile">
                        <el-button v-if="type == 'add'" type="primary" plain @click="handleAdd"><i class="el-icon-plus"></i>添加发送对象</el-button>
                        <span @click="handleToggleFlag">{{toggleFlag?'收起':'展开'}}
                            <i class="el-icon-arrow-down" v-if="!toggleFlag"></i>
                            <i class="el-icon-arrow-up" v-else></i>
                        </span>
                    </div>
                    <div :class="['select-List',type=='add'?'':'margin-top-20',toggleFlag?'see-all':'']" v-if="userList&&userList.length>0">
                        <span v-for="(item,index) in userList" :key="index">{{item.name}}<i class="el-icon-circle-close" @click="deleteSend(index)" v-if="type != 'view'"></i></span>
                    </div>
                    <el-button class="status-btn" v-if="type == 'view'" @click="seeStateInfo" type="primary">{{stateName}}</el-button>
                </el-form-item>
                <el-form-item v-if="type == 'add'" label="消息标题：" required>
                    <el-input v-model="sendForm.title" placeholder="请输入消息标题"></el-input>
                </el-form-item>
                <el-form-item v-if="type == 'add'" label="发送方式&内容：" required>
                    <div class="send-method" v-if="sendForm.content">
                        <el-button type="primary" :disabled="clickDisable" plain @click="addSendMethod"><i class="el-icon-plus"></i>添加发送方式</el-button>
                        <div class="send-method-list" v-for="(Item,index) in sendForm.content" :key="index">
                            <i v-if="index!=0" class="el-icon-delete" @click="deleteSendMethod(index)"></i>
                            <p class="no-show" v-else></p>
                            <el-form-item label="发送方式" label-width="100px" :prop="'content.' + index + '.channel'" :rules="{
                                required: true, message: '发送方式不能为空', trigger: 'change'
                                }">
                                <el-select v-model="Item.channel" placeholder="请选择发送方式" @change="((value)=>changeSend(value,Item,index))">
                                    <el-option v-for="item in sendMethods" :key="item.code" :label="item.name" :value="item.code" :disabled="item.disabled"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label-width="10px" :prop="'content.' + index + '.bizTempleteId'" :rules="{
                                required: true, message: '模版不能为空', trigger: 'change'
                                }">
                                <el-select v-if="Item.formatList" v-model="Item.bizTempleteId" placeholder="请选择模版" @change="((value)=>chooseTemplate(value,Item,index))">
                                    <el-option v-for="item in Item.formatList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                            <div class="btns">
                                <el-button type="primary" @click="editInfo(Item,index)">编辑详情</el-button>
                            </div>
                        </div>
                    </div>
                </el-form-item>
            </div>
            <div class="message-content-info" v-if="viewInfo&&viewInfo.length>0">
                <div v-for="(item,index) in viewInfo" :key="index">
                    <el-form-item v-if="type == 'view'" label="发送方式：" required>
                        <el-select v-model="item.channel" placeholder="发送人" disabled>
                            <el-option
                                v-for="item in sendMethods"
                                :key="item.code"
                                :label="item.name"
                                :value="item.code"
                                :disabled="item.disabled">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <div class="message-info-content" v-if="type == 'view'">
                        <div class="message-info-content-item" v-if="item.channel==2">
                            <WeChatPreview ref="diaContent" :passFieldList="item.data" :name="item.channelTitle"></WeChatPreview>
                        </div>
                        <div class="message-info-content-item" v-if="item.channel==3">
                            <SmsPreview ref="diaContent" :passFieldList="item.data" :name="item.channelTitle"></SmsPreview>
                        </div>
                        <div class="message-info-content-item" v-if="item.channel==1">
                            <NailingPreview ref="diaContent" :passFieldList="item.data" :name="item.channelTitle"></NailingPreview>
                        </div>
                    </div>
                </div>
            </div>
        </el-form>
        <ChoosePerson :show="showChoosePerson" :ids="userIds" @submit="handleChoosePersonSubmit"></ChoosePerson>
        <BaseDialog :config="editConfig" :index="2" @handleConfirm="confirmContent">
            <div slot="dialog-content" class="height-scroll">
                <MessageContent :isMessage="true" ref="messContent" :templateId="templateId" @dataPass="contentPass"></MessageContent>
            </div>
        </BaseDialog>
        <BaseDialog :config="sendStatusConfig" :index="3" @handleConfirm="confirmContent">
            <div slot="dialog-content" class="height-scroll" style="width:100%">
                <!-- table 列表组件 -->
                <BaseTable :autoHeight="false" :list="sendStateList" :tableColumns="tableColumns" :pages="pages" @fetchData="getResultList">
                </BaseTable>
            </div>
        </BaseDialog>
        <BaseDialog :config="timeConfig" :index="4" @handleConfirm="submitTime">
            <div slot="dialog-content" class="height-scroll">
                <BaseForm :refs="$refs" :index="1" class="spec-input" :form="formDataOne" :footerConfig="footerConfig" :labelWidth="110">
                    <div slot="form-sendDate" class="form-sendDate">
                        <div v-if="formDataOne.sendType.value==1">
                            <el-date-picker
                                v-model="formDataOne.sendDate.value"
                                type="date"
                                class="cycle-picker"
                                :pickerOptions="pickerOptions"
                                value-format="yyyy-MM-dd"
                                format="yyyy-MM-dd"
                                @change="changeDate"
                                placeholder="选择日期">
                            </el-date-picker>
                            
                        </div>
                    </div>
                    <div slot="form-sendCycle" class="form-sendDate">
                        <div v-if="formDataOne.sendType.value==2">
                            <span>每</span>
                            <el-select class="cycle-select" v-model="formDataOne.sendCycle.value" placeholder="请选择">
                                <el-option
                                v-for="item in options"
                                :key="item.code"
                                :label="item.name"
                                :value="item.code">
                                </el-option>
                            </el-select>
                            <!-- <el-time-select
                                placeholder="请选择"
                                v-model="formDataOne.sendTime.value"
                                :picker-options="{
                                start: '00:00',
                                step: '00:30',
                                end: '23:30'
                                }">
                            </el-time-select> -->
                        </div>
                    </div>
                    <div slot="form-sendTime" class="form-sendDate label-no">
                        <el-time-select
                            placeholder="请选择"
                            v-model="formDataOne.sendTime.value"
                            :picker-options="{
                            start: '00:00',
                            step: '00:30',
                            end: '23:30',
                            minTime:formDataOne.sendType.value==1?getTimeNow():null
                            }">
                        </el-time-select>
                    </div>
                </BaseForm>
            </div>
        </BaseDialog>
    </div>
</template>
<script>
import { BaseForm, BaseDialog, BaseTable, ChoosePerson } from '@/components/index';
import { getFormElementMaxWidth } from '@/utils/common';
import { sendMethods } from '@/api/common';
import GroupChoose from './groupChoose.vue'
import { sendTableColumns,TimingSendFormData } from './config'
import {WeChatPreview,NailingPreview,SmsPreview} from '../../components/index'
import MessageContent from '../../components/MessageContent.vue'
import { templateList,channelFormatInfo,messageAdd,messageUpdate,messageInfo,resultList  } from '@/api/message/index';
import { messageStatus,cycleList } from '@/api/common';
import { flattenObject } from '@/utils/formatter';
export default {
    components: {
        BaseForm,
        BaseDialog,
        GroupChoose,
        WeChatPreview,
        NailingPreview,
        SmsPreview,
        MessageContent,
        BaseTable,
        ChoosePerson
    },
    props: {
        /**
         * 类型
         * add-新增 update-编辑 view-查看
         */
        type: {
            type: String,
            default: 'add'
        },
        /**
         * 经销商 ID
         */
        id: [Number, String],
        /**
         * 公共 Promise 集合
         */
        commonPromise: {
            type: Object,
            default() {
                return {}
            }
        },
        addType:{
            type: Number,
            default: 1
        }
    },
    data() {
        return {
            keywords: '', // 关键字查询
            location: {}, // 当前定位
            footerConfig: {
                show: false,
            },
            sendForm:{
                title:'',
                content:[{
                    channel:'',
                    bizTempleteId:'',
                    formatList:[],
                    data:[]
                }]
            },
            sendMethods,   //发送方式
            showChoosePerson: false, // 是否展示选人组件
            userIds: [], // 用户 IDs
            userList: [], // 用户列表
            editConfig:{
                show:false,
                title:'编辑详情',
                showCancel:false
            },
            sendStatusConfig:{
                show:false,
                title:'发送状态',
                showCancel:false,
                showConfirm:false
            },
            viewInfo:[],
            sendStateList:[],
            pages: { // 分页参数
                pageNum: 1, // 页数
                pageSize: 20, // 每页数量
                total: 0, // 总数
            },
            tableColumns:[],
            templateId:'',
            stateName:'',
            formDataOne: {}, // 定时发送表单数据
            timeConfig:{},   //定时发送配置
            pickerOptions:{   //默认不能选过去的时间
                disabledDate(time) {
                    return time.getTime() < Date.now() -8.64e7;
                },
            }, 
            options:[],   //周期发送选择列表
            toggleFlag:true,   //展开收起  ,默认展开
            isTodayYes:false
        }
    },
    computed: {
        formSlotStyle() {
            return {
                width: '100%',
                maxWidth: `${getFormElementMaxWidth()}px`,
                display: 'flex'
            }
        },
        clickDisable(){
            if((this.sendForm.content&&this.sendForm.content.length)>=(sendMethods&&sendMethods.length)){
                return true
            }else{
                return false
            }
        }
    },
    created() {
        this.initData();
        if (['update', 'view'].includes(this.type)) {
            this.getDetails();
            this.getResultList()
        }
    },
    methods: {
        /**
         * 初始化数据
         */
        initData() {
            this.config = {
                show:false,
                title:'添加发送对象',
                // showCancel:false,
                width: '800px',
                fullscreen:false,
            }
            this.editConfig = {
                show:false,
                title:'编辑详情',
                width: '1000px',
                fullscreen:false,
            }
            this.sendStatusConfig = {
                show:false,
                title:'发送状态',
                showConfirm:false,
                width: '1000px',
                fullscreen:false,
                showCancel:false
            }
            this.timeConfig = {
                show:false,
                title:'定时发送',
                fullscreen:false,
                width: '800px',
            }
            this.tableColumns = sendTableColumns;
            this.sendForm = {
                title:'',
                content:[{
                    channel:'',
                    bizTempleteId:'',
                    formatList:[],
                    data:[],
                    infoFlag:false   //标志有没有点进详情
                }]
            }
            this.formDataOne = Object.assign({}, new TimingSendFormData({
                type: this.type,
                allDisabled: this.type === 'view'
            }))
            this.options = cycleList || []
            /**
             * 切换推送类型之后初始化
             */
            this.formDataOne.sendType.change = value => {
                this.formDataOne.sendDate.value = ''
                this.formDataOne.sendTime.value = ''
                this.formDataOne.sendCycle.value = ''
                if(value == 1){
                    this.formDataOne.sendCycle.hidden=true
                    this.formDataOne.sendDate.hidden=false
                }
                if(value == 2){
                    this.formDataOne.sendCycle.hidden=false
                    this.formDataOne.sendDate.hidden=true
                }
            }
            this.getSendMethods()
        },
        /**
        * 表单提交数据
        */
        submit(value,callback, errorCallback) {
            if(this.userList&&this.userList.length == 0){
                this.$message.warning('请选择发送对象')
                if (errorCallback && typeof errorCallback === 'function') {
                    errorCallback();
                }
                return
            }
            if(!this.sendForm.title){
                this.$message.warning('请输入消息标题')
                if (errorCallback && typeof errorCallback === 'function') {
                    errorCallback();
                }
                return
            }
            let sendFormContent = JSON.parse(JSON.stringify(this.sendForm.content))
            console.log(this.sendForm)
            if(sendFormContent&&sendFormContent.length>0){
                for(var i=0;i<sendFormContent.length;i++){
                    delete sendFormContent[i].formatList
                    if(!sendFormContent[i].infoFlag){
                        this.$message.warning('请编辑详情')
                        if (errorCallback && typeof errorCallback === 'function') {
                            errorCallback();
                        }
                        return
                    }
                }
            }
            let tos = this.userList.map(i=>{
                return i.userId
            })
            this.$refs.ruleForm1.validate(valid => {
                if (valid) {
                    this.$confirm('请确认是否发送当前信息，发送后无法撤回', '请确认', { type: 'warning' }).then(_ => {
                        const { sendType,sendDate,sendTime,sendCycle } = flattenObject(this.formDataOne);
                        console.log(sendType,sendDate,sendTime)
                        console.log(sendDate+' '+sendTime)
                        let sendRule = {
                            sendType,
                            sendTime:sendType==1?(sendDate+' '+sendTime+':00'):'2022-03-21 '+sendTime+':00',
                            sendCycle:sendType==1?1:sendCycle
                        }
                        const funcName = this.type === 'add' ? messageAdd : messageUpdate;
                        const params = {
                            ...this.sendForm,
                            tos,
                            content:sendFormContent, 
                            sendRule:value=='立即发送'?null:sendRule
                        }
                        funcName(params).then(res => {
                            if(value=='立即发送'){
                                if (callback && typeof callback === 'function') {
                                    callback(res);
                                }
                            }else{
                                this.$message.success('新增成功')
                                this.timeConfig.show = false
                                this.$emit('closeAndRoute')
                            }
                        }).catch(error => {
                            if(value=='立即发送'){
                                if (errorCallback && typeof errorCallback === 'function') {
                                    errorCallback(error);
                                }
                            }
                        })
                    }).catch(_ => {
                        
                        if(value=='立即发送'){
                            if (errorCallback && typeof errorCallback === 'function') {
                                errorCallback();
                            }
                        }
                    });
                } else {
                    if(value=='立即发送'){
                        if (errorCallback && typeof errorCallback === 'function') {
                            errorCallback();
                        }
                    }
                    return false;
                }
            })
        },
        /**
         * 获取详情信息
         */
        getDetails() {
            messageInfo({ id: this.id }).then(res => {
                this.sendForm = res || {}
                if(this.$refs.diaContent&&this.$refs.diaContent.length>0){
                    this.$nextTick(()=>{
                        this.$refs.diaContent.forEach(item=>{
                            item.init()
                        })
                    })
                }
                this.viewInfo = JSON.parse(res.content)
                for(let i=0;i<this.viewInfo.length;i++){
                    channelFormatInfo({id:this.viewInfo[i].bizTempleteId,channel:this.viewInfo[i].channel}).then(res => {
                        this.$set(this.viewInfo[i],'channelTitle',res[0].channelTitle)
                    })
                }
                messageStatus.forEach(item=>{
                    if(item.code == res.state){
                        this.stateName = item.name
                    }
                })
                this.userIds = JSON.parse(this.sendForm.tos);
            })
        },
        getResultList(pages = {}, callback){
            this.pages = Object.assign(this.pages, pages);
            const { pageNum, pageSize } = this.pages;
            let params = {
                current: pageNum,
                size: pageSize,
                messageId:this.id
            }
            resultList(params).then(res => {
                const { records,total } = res || {};
                this.sendStateList = records || []
                this.pages.total = total || 0;
                if (callback && typeof callback === 'function') {
                    callback(total);
                }
            })
        },
        //添加发送方式
        addSendMethod(){
            this.sendForm.content.push({
                channel:'',
                bizTempleteId:'',
                formatList:[],
                data:[],
                infoFlag:false
            })
        },
        //删除发送方式
        deleteSendMethod(index){
            this.sendForm.content.splice(index,1)
            this.getSendMethods()
        },
        //查看版式详情
        editInfo(item,index){
            if(!item.bizTempleteId){
                this.$message.warning('请选择模版')
                return
            }
            this.templateId = item.bizTempleteId
            this.editConfig.show = true
            let formatInfo = {
                channelTitle:item.channelTitle,
                channelCode:item.channelCode
            }
            if(item.data&&item.data.length>0){
                formatInfo.channelFields = JSON.stringify(item.data)
            }else{
                formatInfo.channelFields = ''
            }
            formatInfo.channel = item.channel
            this.$nextTick(()=>{
                this.$refs.messContent.getInfo(formatInfo)
            })
        },
        handleAdd(){
            this.showChoosePerson = true;
        },
        deleteSend(index){
            this.userList.splice(index,1)
        },
        //改变选择方式
        changeSend(value,item,index){
            item.bizTempleteId = ''
            this.getTemplateList(value,item)
            this.getSendMethods()
        },
        //根据发送方式获取板式
        getTemplateList(value,item){
            let params = {
                channel:value,
                state:1
            }
            templateList(params).then(res => {
                item.formatList = res || []
            })
        },
        //选择模版
        chooseTemplate(value,item,index){
            channelFormatInfo({id:value,channel:item.channel}).then(res => {
                this.sendForm.content[index].data = JSON.parse(res[0].channelFields)
                this.sendForm.content[index].channelTitle = res[0].channelTitle
                this.sendForm.content[index].channelCode = res[0].channelCode
                this.sendForm.content[index].infoFlag = false
            })
        },
        //确定消息内容
        confirmContent(){
            this.$refs.messContent.submit()
        },
        contentPass(param){
            let findIndex = this.sendForm.content.findIndex(i=>{
                return i.bizTempleteId == param.templateId && i.channel == param.channel
            })
            this.sendForm.content[findIndex].data = param.channelFields
            this.sendForm.content[findIndex].infoFlag = true
            this.editConfig.show = false
        },
        //查看发送状态弹窗
        seeStateInfo(){
            this.sendStatusConfig.show=true
        },
        //不可选设置
        getSendMethods(){
            let productNormArr = this.sendForm.content.map(res =>{return res.channel})
            if(productNormArr&&productNormArr.length >0){
                for(let i=0;i<sendMethods.length;i++){
                    if(productNormArr.includes(sendMethods[i].code)){
                        sendMethods[i].disabled = true
                    }else{
                        sendMethods[i].disabled = false
                    }
                }
            }
            this.sendMethods = sendMethods
        },
        /**
         * 选人组件弹窗关闭
         */
        handleChoosePersonSubmit(params = {}) {
            const { ids, list } = params;
            this.userIds = ids || this.userIds;
            this.userList = list || this.userList;
            this.showChoosePerson = false;
        },
        /**
         * 定时发现弹窗
         */
        showTimeSend(){
            this.formDataOne.sendType.value = 1
            this.formDataOne.sendDate.value = ''
            this.formDataOne.sendTime.value = ''
            this.formDataOne.sendCycle.value = ''
            this.formDataOne.sendCycle.hidden=true
            this.formDataOne.sendDate.hidden=false
            if(this.userList&&this.userList.length == 0){
                this.$message.warning('请选择发送对象')
                return
            }
            if(!this.sendForm.title){
                this.$message.warning('请输入消息标题')
                return
            }
            this.$refs.ruleForm1.validate(valid => {
                if(valid){
                    let sendFormContent = JSON.parse(JSON.stringify(this.sendForm.content))
                    if(sendFormContent&&sendFormContent.length>0){
                        for(var i=0;i<sendFormContent.length;i++){
                            if(!sendFormContent[i].infoFlag){
                                this.$message.warning('请编辑详情')
                                return
                            }
                        }
                    }
                    this.timeConfig.show = true
                }
            })
        },
        /**
         * 获取现在时间
         */
        getTimeNow(){
            if(!this.isTodayYes){
                return null
            }
            var date = new Date()
            var hours = date.getHours();
            var minutes = date.getMinutes();
            if(hours>=0 && hours<=9){
                hours = '0' + hours
            }
            if(minutes>=0 && minutes<=9){
                minutes = '0' + minutes
            }
            return hours+':'+minutes
        },
        /**
         * submitTime
         * 定时发送弹窗点击确定
         */
        submitTime(){
            this.$refs.BaseForm_1.validate(valid => {
                if(valid){
                    this.submit()
                }
            })
        },
        handleToggleFlag(){
            this.toggleFlag = !this.toggleFlag
        },
        changeDate(value){
            console.log(value)
            if(new Date(value).getTime()<new Date().getTime()){
                console.log(12311)
                this.isTodayYes = true
            }else{
                this.isTodayYes = false
            }
            console.log(this.isTodayYes)
        }
    },
}
</script>
<style lang="scss">
.buttons{
    width: 100%;
    text-align: center;
    margin: 50px 0;
}
.send-method{
    padding: 0;
    .el-form-item{
        margin-bottom: 0 !important;
    }
    &-list{
        margin: 20px 0;
        display: flex;
        align-items: center;
        .btns{
            margin-left: 10px; 
        }
        .el-icon-delete{
            color: red;
            cursor: pointer;
        }
    }
}
.message-base-container{
    padding: 20px;
    .form-demo{
        padding-bottom: 10px;
        border-bottom: 1px solid #ccc;
        margin-bottom: 30px;
    }
    .el-input--small .el-input__inner{
        width: 200px;
    }
    .el-pagination__editor.el-input .el-input__inner{
        width: 100%;
    }
    .select-List{
        display: flex;
        flex-wrap: wrap;
        padding-top: 20px;
        height: 55px;
        overflow-y: hidden;
        >span{
            display: inline-block;
            padding: 0px 10px;
            margin-right: 10px;
            margin-bottom: 10px;
            background-color: #e9e8e8;
            cursor: pointer;
            position: relative;
            border-radius: 4px;
            .el-icon-circle-close{
                color: #cf0404;
                position: absolute;
                top: -6px;
                right: -6px;
            }
        }
    }
    .margin-top-20{
        // margin-top: 20px;
    }
    .see-all{
        height: auto;
    }
    .message-info-content{
        display: flex;
        flex-wrap: wrap;
        justify-content: start;
        .message-info-content-item{
            width: 500px;
            padding: 0 20px 20px;
        }
    }
    .message-title{
        margin-bottom: 40px;
        padding-left: 20px;
    }
    .height-scroll{
        height: 300px;
        overflow-y: scroll;
    }
    .message-content-info{
        display: flex;
        flex-wrap: wrap;
    }
    .status-btn{
        margin-top: 10px;
    }
}
.no-show{
    width: 14px;
}
.form-sendDate{
    display: flex;
    width: 300px;
    .el-input{
        width: auto;
    }
    .cycle-picker{
        margin-right: 10px;
    }
    .cycle-select{
        margin: 0 10px;
    }
}

.spec-input{
    .el-input--small .el-input__inner{
        width: 100%;
    }
}
.tile{
    display: flex;
    button{
        margin-right: 10px;
    }
    >span{
        color: #409EFF;
        // margin-left: 10px;
    }
}
</style>    
