/*
 * @Descripttion: 
 * @version: 
 * @Author: congsir
 * @Date: 2020-11-05 17:36:15
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-08-18 09:43:34
 */
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App';
import router from './router';
import store from './store';
import '@/icons'; // icon
import '@/permission'; // 权限

Vue.use(ElementUI, { size: 'small' });


new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
