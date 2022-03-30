<template>
    <div class="sms-preview">
        <p>{{name||'名称'}}</p>
        <span v-for="(item,index) in fieldList.length>0?fieldList:passFieldList" :key="index">
            <template v-if="item.describe">{{item.describe}}：{{item.value}}
                <template v-if="fieldList.length>0">
                    {{index+1==fieldList.length?'。':'，'}}
                </template>
                <template v-else>
                    {{index+1==passFieldList.length?'。':'，'}}
                </template>
            </template>
        </span>
    </div>
</template>
<script>

export default {
    name:'smsPreview',
    props: {
        passFieldList: {
            type: String,
            default:''
        },
        name:{
            type: String,
            default:''
        }
    },
    data(){
        return{
            fieldList:''
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
.sms-preview{
    width: 100%;
    border: 1px solid #ccc;
    padding: 20px;
    >p{
        font-weight: 500;
    }
}
</style>
