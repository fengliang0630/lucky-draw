<template>
  <div id="app">
    <div @click="showlogin" :class="{'right-btn': true, 'hidden': isLogined}">登录</div>
    <div v-if="isLogined && isAdmin" class="right-btn">isAdmin</div>
    <router-view/>
    <van-action-sheet v-model="show" title="输入信息" class="asd">
      <van-field v-model="telphone" required type="tel" placeholder="请输入手机号" />
      <van-field v-model="wx" placeholder="请输入微信号" />
      <van-button @click="login" type="info">确认</van-button>
    </van-action-sheet>
  </div>
</template>

<script>
import { ActionSheet, Field, Button } from 'vant';

export default {
  name: 'App',
  data() {
    return {
      show: false,
      telphone: '',
      wx: '',
      isLogined: false,
      isAdmin: false
    }
  },
  mounted() {
    this.$bus.on('show.login.msg', this.showlogin)
  },
  methods: {
    showlogin() {
      this.show = true;
    },
    login() {
      if (!this.telphone) {
        return;
      }
      sessionStorage.setItem('userInfo', JSON.stringify({
        telphone: this.telphone,
        wx: this.wx
      }));

      this.isAdmin = (this.telphone === '18706753477');
      this.isLogined = true;
      this.show = false;
    }
  },
  components: {
    'van-action-sheet': ActionSheet,
    'van-field': Field,
    'van-button': Button
  }
}
</script>

<style lang="stylus">
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  list-style: none;
  overflow-y: auto;

  .right-btn {
      z-index: 100;
      background: #9c9c9c;
      font-size: 20px;
      width: 80px;
      position: absolute;
      right: 0;
      padding: 5px;
      color: #fff;
      text-align: center;

      &.hidden {
        display: none;
      }
  }

}
</style>
