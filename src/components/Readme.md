#### 自定义组件库
###### 一些常用的组件封装，减少重复编写以及界面风格的的统一

-----
##### **AreaSelector** 按区域城市选择
###### 包含了查询、导入、全选，同过 v-model 绑定值（值以逗号“,”相隔）
###### 应用场景：区域定向

-----
##### **BxmUpload** 单个文件上传
###### 依赖 element-ui <= 2.3.9

-----
##### **BaseList** 通用页面列表
###### 包含了条件搜索表单、列表表格、分页

-----
##### **Dialog** 弹窗表单
###### 封装了一些通用的表单（input、select、upload），包含了底部按钮
###### Dialog/index 简单的封装了弹窗，统一了header、footer的样式

-----
##### **MultiSelector** 多组多选器
###### 针对多组 CheckBox 进行了封装，支持2个层级，使用场景如：多个分组的标签选择。
###### 其目录下的 ./Selection.vue 已封装了点击触发弹窗选择

-----
##### **AreaSelector** 区域选择器
###### 按地区划分方式的省市选择，使用场景：区域定向。

-----
##### **UniversalPage** 页面通用组件
###### 适用于常规页面的通用组件
###### 目录内包含 TableSelection（列表）、ConditionForm（查询表单）、DialogSelector（弹窗多选器）
###### 气目录下 ./index 已封装了列表和查询表单

-----
##### **TableList** 列表表格
###### 封装了列表表格，包含分页(el-pagination)，可自定义高度或自适应
###### 支持单页或多页的多选
###### UniversalPage/TableList

-----
##### **ConditionForm** 查询条件表单
###### 适用于各类页面、弹窗的查询条件的表单
###### 表单类型支持: input(el-input)、select(el-select)、daterange(el-date-picker)、selector(组件目录/MultiSelector/Selection)、$slot
###### 包含button（查询、重置、添加，额外按钮），可在表单内尾部追加更多内容。支持隐藏或显示部分条件。
###### UniversalPage/DialogSelector

-----
##### **DialogSelector** 弹窗多选器
###### 包含 ./TableSelection（列表）、./ConditionForm（查询表单）
###### 支持 v-model 绑定已选择的行的值
###### UniversalPage/DialogSelector

-----
##### **ViewImage** 查看大图弹窗
###### 可根据传入的图片尺寸，自动处理弹窗大小及位置，以较优的方式展示

-----
##### **SvgIcon**
###### 自定义 SVG 格式 Icon

