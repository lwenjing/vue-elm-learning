<template>
    <div class="cartControl">
      <transition name="fade">
        <div class="cart_decrease" v-show="food.count > 0" @click.stop.prevent="decreaseCount">
          <i class="inner icon-remove_circle_outline"></i>
        </div>
      </transition>
      <div class="cart_count" v-show="food.count > 0">{{food.count}}</div>
      <div class="cart_add icon-add_circle" @click.stop.prevent="addCount"></div>
    </div>
</template>

<script type="text/ecmascript-6">
    import Vue from 'vue';

    export default {
      props: {
        food: {
          type: Object
        }
      },
      methods: {
        addCount(event) {
          // 解决PC端双点击的问题
          if (!event._constructed) { // 浏览器直接return掉,去掉自带click事件的点击
            return;
          }
          if (!this.food.count) {
            Vue.set(this.food, 'count', 1);
          } else {
            this.food.count++;
          }
          this.$emit('cart-add', event.target); // 告诉父组件，子组件改变
        },
        decreaseCount(event) {
          // 解决PC端双点击的问题
          if (!event._constructed) { // 浏览器直接return掉,去掉自带click事件的点击
            return;
          }
          this.food.count--;
        }
      }
    };
</script>

<style lang="stylus" rel="stylesheet" scoped>
  .cartControl
    font-size 0
    .cart_decrease, .cart_count, .cart_add
      display inline-block
      vertical-align top
      color rgb(0, 160, 200)
    .cart_decrease, .cart_add
      font-size 24px
      line-height 24px
      padding 6px
    .cart_decrease
      transition all 0.4s linear
      &.fade-enter-active, &.fade-leave-active
        opacity 1
        transform translate3d(0, 0, 0)
        .inner
          transition: all 0.4s linear
          transform: rotate(0)
      &.fade-enter, &.fade-leave-active
        opacity 0
        transform translate3d(24px, 0, 0)
        .inner
          transform rotate(180deg)
      .inner
        display inline-block
        vertical-align top
        font-size 24px
        line-height 24px
    .cart_count
      width 12px
      line-height 24px
      padding-top 6px
      text-align center
      font-size 10px
      color rgb(147,153, 159)
</style>
