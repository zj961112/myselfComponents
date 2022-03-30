<template>
  <div class="wrap">
    <section class="left">
      <div class="initial" v-if="notDepthJudge">
        <div class="title">杭州益友会</div>
        <div class="selectBar" v-for="(item,index) in typeList" :key="index" @click="selectBar(item)">
          <div class="typeCate">
            {{ item }}
          </div>
          <div class="lowerIcon">下级<svg-icon iconClass="xiaji"></svg-icon></div>
        </div>
      </div>
      <div class="variation" v-else>
        <div class="small-title" @click="notDepthJudge = true">
          <i class="el-icon-arrow-left"></i> {{ current }}
        </div>
        <!-- 面包屑 -->
        <div class="breadcrumb">
          <div v-for="(ele, i) in breadList" :class="`${breadList.length === i + 1 ? 'unclick' : 'breadcrumbItem'}`" :key="i" @click="jumpToList(i)">
            {{ i != 0 ? ' / ' : '' }}{{ ele.name }}
          </div>
        </div>
        <div class="selectItem" @click="selectAll">
          <div>
            <CircleSelect :selected="allSelected" class="circleSelect"/>
          </div>
          <div style="padding-left: 5px">全选</div>
        </div>

        <div class="selectList" v-for="(ele, index) in currentList" :key="index">
          <div class="selectItem">
            <div @click="selectItem(index)">
              <CircleSelect :selected="ele.selected" class="circleSelect"/>
            </div>
            <div :class="`${ele.selected ? 'grey' : ''} groupName`" @click="selectItem(index)">
              {{ ele.name }}<span v-if="ele.children.length>0">（{{ele.children.length}}人）</span>
            </div>
            <div :class="` ${ele.selected ? 'unclick' : 'lowerIcon'}`" @click="expandList(index, ele.selected)" v-if="ele.children.length != 0">
              下级
              <svg-icon iconClass="xiaji"></svg-icon>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="right">
      <el-tag
        v-for="tag in tagList"
        :key="tag"
        closable
        @close="closeTag(tag)"
        type="info"
        style="margin-right: 5px"
      >
        {{ tag }}
      </el-tag>
    </section>
  </div>
</template>

<script>
import CircleSelect from './circleSelect'

export default {
  name: 'groupChoose',
  props: {
    list: {
      default: function() {
        return []
      },
      type: Array
    }
  },
  data() {
    return {
      typeList: ['按组织架构选择', '按岗位选择', '按标签选择'],
      current: '',
      currentList: [], // 当前组织列表
      notDepthJudge: true,
      breadList: [], // 面包屑列表
      tagList: [] // 右侧列表
    }
  },
  computed: {
    allSelected() {
      let judge = true
      this.currentList.forEach((ele) => {
        if (ele.selected != true) {
          judge = false
        }
      })
      return judge
    }
  },
  watch: {},
  components: {
    CircleSelect
  },
  methods: {
    initData(){
      this.currentList = this.list
      this.initUserList(this.currentList)
      this.tagList = []
    },
    initUserList(data) {
      for (var ele of data) {
        ele.selected = false
        if(ele.children&&ele.children.length>0){
          this.initUserList(ele.children)
        }
      }
    },
    selectBar(item) {
      // 选最外层的条
      this.current = item
      this.currentList = this.list
      this.notDepthJudge = !this.notDepthJudge
      this.breadList = []
    },
    selectItem(item) {
      // 选列表中的一个
      const tag = this.currentList[item]
      this.$set(tag, 'selected', tag.selected !== true)
      if (this.currentList[item].selected === true) {
        this.tagList = [...this.tagList, tag.name]
      } else {
        this.tagList = this.tagList.filter((ele) => ele !== tag.name)
      }
    },
    selectAll() {
       if (this.allSelected) {
        this.currentList.forEach((ele) => {
          this.$set(ele, 'selected', false)
          this.tagList = this.tagList.filter((ant) => ant !== ele.name)
        })
      } else {
        this.currentList.forEach((ele) => {
          this.$set(ele, 'selected', true)
          this.tagList = [...this.tagList, ele.name]
        })
      }
    },
    closeTag(tag) {
      // 关闭标签
      this.tagList = this.tagList.filter((ele) => ele !== tag)
      this.recurve(this.list, tag)
    },
    recurve(data, tag) {
      // 递归删除
      for (var i in data) {
        if (data[i].name == tag) {
          data[i].selected = false
        } else {
          if (data[i].children) {
            this.recurve(data[i].children, tag)
          }
        }
      }
    },
    expandList(index, b) {
      // 下一级
      if (b) {
        return
      }
      this.breadList.push({
        name: this.currentList[index].name,
        index: index
      })
      this.currentList = this.currentList[index].children
    },
    jumpToList(i) {
      // 面包屑点击到列表
      this.breadList = this.breadList.slice(0, i + 1)
      this.currentList = this.breadList.reduce((nowObj, current) => {
        nowObj = nowObj[current.index].children
        return nowObj
      }, this.list)
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  display: flex;
}

.circleSelect {
  width: 20px;
  height: 20px;

  /deep/ .svg-icon {
    width: 20px;
    height: 20px;
  }
}

.title {
  font-size: 18px;
  margin-bottom: 10px;
}

.unclick {
  //pointer-events: none;
  cursor: not-allowed;
  margin-left: 10px;
  color: #bfbfbf;
}

.grey {
  color: #ccc;
}

.small-title {
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
}

.left,
.right {
  flex: 1;
  padding: 20px 25px;
}

.left {
  border-right: 1px solid #ccc;
  height: 300px;
  overflow-y: scroll;
}

.selectBar {
  padding: 5px;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  &:hover {
    background: #e8e8e8;
  }
}

.selectItem {
  padding: 5px;

  display: flex;
  cursor: pointer;

  &:hover {
    background: #f5f2f2;
  }
}

.groupName {
  margin-left: 5px;
  flex: 4;
}

.lowerIcon {
  padding-left: 10px;
  border-left: 1px solid #ccc;
  &:hover {
    color: #0065b8;
  }
}

.breadcrumb {
  padding-left: 18px;
  padding-top: 10px;
  padding-bottom: 10px;
  display: flex;
}

.breadcrumbItem {
  margin-right: 5px;
  cursor: pointer;

  &:hover {
    color: #0065b8;
  }
}
</style>
