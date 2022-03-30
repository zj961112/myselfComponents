<template>
    <div>
        <div class="wechat-preview">
            <h3>{{name||'名称'}}</h3>
            <template v-if="(fieldList&&fieldList.length>0)||(passFieldList&&passFieldList.length>0)">
                <p v-for="(item,index) in fieldList.length>0?fieldList:passFieldList" :key="index"><template v-if="item.describe">{{item.describe}}：<span>{{item.value}}</span></template></p>
            </template>
            
        </div>
        <div class="wechat-preview-info">
            查看详情
        </div>
    </div>
</template>
<script>

export default {
    name:'wechatPreview',
    props: {
        passFieldList: {
            type: Array,
            default() {
                return []
            }
        },
        name:{
            type: String,
            default:''
        }
    },
    data(){
        return{
            fieldList:[]
        }
    },
    methods:{
        init(value,param){
            this.fieldList = []
            if(value){
                let data = JSON.parse(value)
                this.fieldList = data

            }
        }
    }
}
</script>
<style scoped lang="scss">
.wechat-preview{
    width: 100%;
    border: 1px solid #ccc;
    padding: 15px 20px;
}
.wechat-preview-info{
    width: 100%;
    border: 1px solid #ccc;
    border-top: none;
    padding: 10px 20px;
    font-weight: bold;
}
</style>
