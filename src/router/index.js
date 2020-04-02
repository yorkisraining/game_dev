/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-01 09:06:37
 * @LastEditTime: 2019-08-14 17:49:28
 * @LastEditors: Please set LastEditors
 */
import Vue from 'vue'
import Router from 'vue-router'
import index from '@/views'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    linkActiveClass: 'is-active',
    scrollBehavior() {
        return { x: 0, y: 0 }
    },
    routes: [{
        path: '/',
        name: 'index',
        component: index,
        children: [{
            path: '/personal',
            name: 'personal',
            component(resolve) {
                require(['@/views/navClassify/personal'], resolve)
            },
        }, {
            path: '/bank',
            name: 'bank',
            component(resolve) {
                require(['@/views/navClassify/bank'], resolve)
            },
        }, {
            path: '/bonus',
            name: 'bonus',
            component(resolve) {
                require(['@/views/navClassify/bonus'], resolve)
            },
        }, {
            path: '/integral',
            name: 'integral',
            component(resolve) {
                require(['@/views/navClassify/integral'], resolve)
            },
        }, {
            path: '/gameHistory',
            name: 'gameHistory',
            component(resolve) {
                require(['@/views/navClassify/gameHistory'], resolve)
            },
        }, {
            path: '/mail',
            name: 'mail',
            component(resolve) {
                require(['@/views/navClassify/mail'], resolve)
            },
        }]
    }, {
        path: '/helps',
        name: 'helps',
        component(resolve) {
            require(['@/views/helps'], resolve)
        },
        children: [{
            path: '/helpCenter',
            name: 'helpCenter',
            component(resolve) {
                require(['@/views/helps/helpCenter'], resolve)
            },
            meta: {
                ifNoNeedLogin: true
            }
        }, {
            path: '/about',
            name: 'about',
            component(resolve) {
                require(['@/views/helps/about'], resolve)
            },
            meta: {
                ifNoNeedLogin: true
            }
        }, {
            path: '/privacy',
            name: 'privacy',
            component(resolve) {
                require(['@/views/helps/privacy'], resolve)
            },
            meta: {
                ifNoNeedLogin: true
            }
        }, {
            path: '/response',
            name: 'response',
            component(resolve) {
                require(['@/views/helps/response'], resolve)
            },
            meta: {
                ifNoNeedLogin: true
            }
        }]
    }]
})

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.ifNoNeedLogin)) {
        next();
        return false;
    }
    if (to.path != '/') {
        if (localStorage.getItem('token') || sessionStorage.getItem('token')) {
            next();
        } else {
            next({
                path: '/',
            })
        }
    } else {
        next();
    }
})

export default router