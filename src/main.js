import Vue from 'vue';
import axios from 'axios';
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import AsyncComponent from './components/async-component';
//import VueRouter from 'vue-router';
import Router from 'vue-router'
//Vue.use(Router)

import Home from './Home.vue';
var constantRouterMap = []
let router = new Router({
  routes: constantRouterMap
})
Vue.use(ElementUI);
Vue.use(AsyncComponent);
Vue.use(window.AVUE);


/*
const router = new VueRouter({
  routes: [
    { path: '', redirect: '/home' },
    {
      path: '/home',
      component: Home,
      children: [
        { path: '', redirect: 'app'},
        {
          path: 'app',
          component: App,
          children: [
            {path: '', redirect: 'test'},
            { path: 'test', component: () => import('./pages/hello-world/hello-world.vue')} 
          ]
        }
      ]
    }
  ]
}); */
let viewRouter;
let getRouter;
router.beforeEach((to, from, next) => {
  if (!getRouter) {
    if (!getObjArr('router')) {
      axios.get('src/assets/mock-data/router.json')
        .then(res => {
          viewRouter = res.data
          axios.get('src/assets/mock-data/components.json')
            .then(response => {
              let data = filterJSON(response.data);
              data.forEach(i => {
                viewRouter.router[0].children[0].children.push(i)
              })
              getRouter = viewRouter.router
              window.localStorage.setItem('router', JSON.stringify(getRouter));
              routerGo(to, next)
            })
        })
    } else {
      getRouter = getObjArr('router') //拿到路由
      routerGo(to, next)
    }
  } else {
    next()
  }
})
function routerGo(to, next) {
  console.log(getRouter)
  getRouter = filterAsyncRouter(getRouter) //过滤路由
  router.addRoutes(getRouter) //动态添加路由
  global.antRouter = getRouter //将路由数据传递给全局变量、
  next({ ...to, replace: true })
}
function filterAsyncRouter(asyncRouterMap) { //遍历后台传来的路由字符串，转换为组件对象
  console.log(asyncRouterMap)
  const accessedRouters = asyncRouterMap.filter(route => {
    if (route.component) {
      if (route.component === "Home") {
        route.component = Home
      } else if (route.component === "App") { //布局组件特殊处理
        route.component = App
      } else {
        console.log(route.component)
        let template = require('./pages/' + route.component + '.vue'); //获取组件的方法
        route.component = template.default

      }
    }
    if (route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children)
    }
    return true
  })
  return accessedRouters
}
function filterJSON(data) {
  let filterData = [];
  data.forEach(item => {
    filterData.push({
      "path": item.routerPath,
      "component": item.path,
      "name": item.name,
      "meta": {
        "title": item.text,
        "icon": "form"
      }
    })
  })
  return filterData
}
function getObjArr(name) {
  return JSON.parse(window.localStorage.getItem(name));
}
Vue.use(Router);
new Vue({
  router,
  render: h => h(Home)
}).$mount('#app');
