// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';

import 'common/stylus/index.styl';
import 'common/stylus/icon.css';

// axios 配置
import axios from 'axios';

// 1.定义路由组件
import goods from 'components/goods/goods';
import ratings from 'components/ratings/ratings';
import seller from 'components/seller/seller';

Vue.use(VueRouter);

Vue.prototype.$http = axios;

Vue.config.productionTip = false;

// 2.定义路由
let routes = [
  {path: '/goods', component: goods},
  {path: '/ratings', component: ratings},
  {path: '/seller', component: seller}
];

// 3.创建路由实例
let router = new VueRouter({
  linkActiveClass: 'active',
  mode: 'history',
  routes: routes
});

// 4.创建和挂在实例
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
});
