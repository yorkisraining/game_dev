import "babel-polyfill"
import Vue from 'vue'
import App from './App'
import router from './router'
import './common/css/reset.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import store from './vuex'

Vue.use(ElementUI);

Vue.config.productionTip = false;

new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})