<template>
    <div class="nailing-preview">
        <div class="nailing-preview-one">
            <span></span>
            <p>{{name||'名称'}}</p>
        </div>
        <div class="nailing-preview-two">
            <h3>{{name||'内容'}}</h3>
            <div class="nailing-preview-two-label">
                <p><svg-icon icon-class="perform"></svg-icon>我执行</p>
                <p class="gray"><svg-icon icon-class="addPer"></svg-icon>添加参与人</p>
                <p class="gray"><svg-icon icon-class="setTime"></svg-icon>设置截至时间</p>
                <p class="gray"><svg-icon icon-class="remind"></svg-icon>添加提醒</p>
            </div>
            <p v-for="(item,index) in fieldList.length>0?fieldList:passFieldList" :key="index"><template v-if="item.describe">{{item.describe}}：<span>{{item.value}}</span></template></p>
        </div>
    </div>
</template>
<script>

export default {
    name:'nailingPreview',
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
.nailing-preview{
    width: 100%;
    &-one{
        display: flex;
        align-items: center;
        border: 1px solid #ccc;
        padding: 0 16px;
        border-radius: 6px;
        >span{
            width: 20px;
            height: 20px;
            display: inline-block;
            border-radius: 12px;
            border: 1px solid #ccc;
            margin-right: 10px;
        }
    }
    &-two{
        margin-top: 20px;
        border: 1px solid #ccc;
        border-radius: 6px;
        padding: 0 16px;
    }
    .nailing-preview-two-label{
        display: flex;
        flex-wrap: wrap;
        p{
            margin: 0;
            padding: 6px 20px;
            border: 1px solid #ccc;
            margin-right: 10px;
            border-radius: 20px;
            margin-bottom: 10px;
            .svg-icon{
                margin-right: 6px;
            }
        }
        .gray{
            color: #a7a3a3;
        }
    }
}
</style>
