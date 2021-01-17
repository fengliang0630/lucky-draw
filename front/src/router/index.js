import Vue from 'vue'
import Router from 'vue-router'
import LuckyDraw from '@/components/luckyDraw'
import HistorySetting from '@/components/setting/historySetting'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'lucky',
      component: LuckyDraw
    },
    {
      path: '/history',
      component: HistorySetting
    }
  ]
})
