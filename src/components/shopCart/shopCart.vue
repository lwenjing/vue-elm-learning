<template>
  <div class="shopCart_wrapper">
    <div class="shopCart">
      <div class="content" @click="toggleList">
        <div class="content_left" :class="{'hightLight': totalPrice > 0}">
          <div class="logo_wrapper">
            <div class="logo">
              <i class="icon-shopping_cart"></i>
            </div>
            <div class="num" v-show="totalCount > 0">{{totalCount}}</div>
          </div>
          <div class="price">¥{{totalPrice}}</div>
          <div class="desc">另需配送费¥{{deliverPrice}}元</div>
        </div>
        <div class="content_right" @click.stop.prevent="pay">
          <div class="pay" :class="payClass">{{payDesc}}</div>
        </div>
      </div>
      <div class="ball_container">
        <div v-for="ball in balls" :key="ball.id">
          <transition name="drop" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
            <div v-show="ball.show" class="ball">
              <div class="inner inner-hook">
              </div>
            </div>
          </transition>
        </div>
      </div>
      <transition name="fade">
        <div class="shopCart_list" v-show="listShow">
          <div class="list_header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="empty">清空</span>
          </div>
          <div class="list_content" ref="listContent">
            <ul>
              <li class="food" v-for="food in selectFoods" :key="food.id">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>¥{{food.price * food.count}}</span>
                </div>
                <div class="cartControl_wrapper">
                  <cartControl :food="food"></cartControl>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="list_mask" v-show="listShow" @click="hideList()"></div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import cartControl from 'components/cartControl/cartControl.vue';
  import BScroll from 'better-scroll';

  export default {
    props: {
      selectFoods: {
        type: Array,
        default() {
          return [];
        }
      },
      deliverPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        balls: [
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          }
        ],
        dropBall: [],
        fold: true
      };
    },
    methods: {
      drop(el) {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) {
            ball.show = true;
            ball.el = el;
            this.dropBall.push(ball);
            return;
          }
        }
      },
      beforeEnter(el) {
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) { // 这个是要运动的小球true
            let rect = ball.el.getBoundingClientRect();// 获得元素相当于视口的位置
            let x = rect.left - 32;
            let y = -(window.innerHeight - rect.top - 22);
            el.style.display = ''; // v-show默认display：none，设置为空，让它显示
            // 外层元素是纵向的动画，内层元素是横向的动画
            el.style.webkitTransform = `translate3d(0, ${y}px, 0)`;
            el.style.transform = `translate3d(0, ${y}px, 0)`;
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`;
            inner.style.transform = `translate3d(${x}px, 0, 0)`;
          }
        }
      },
      enter(el) {
        /* 触发浏览器重绘，重绘之后才可以设置transform */
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight;
        this.$nextTick(() => { // 样式重置
          el.style.webKitTransform = 'translate3d(0, 0, 0)';// 没有变量时只能用单引，不能用反引
          el.style.transform = 'translate3d(0, 0, 0)';
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = 'translate3d(0, 0, 0)';
          inner.style.transform = 'translate3d(0, 0, 0)';
        });
      },
      afterEnter(el) { // 动画完成
        let ball = this.dropBall.shift(); // 删除并返回第一个ball
        if (ball) {
          ball.show = false;
          el.style.display = 'none';
        }
      },
      toggleList() {
        if (!this.totalCount) {
          return;
        }
        this.fold = !this.fold;
      },
      empty() {
        this.selectFoods.forEach((food) => {
          food.count = 0;
        });
      },
      hideList() {
        this.fold = true;
      },
      pay() {
        if (this.totalPrice < this.minPrice) {
          return;
        }
        window.alert(`支付${this.totalPrice}元`);
      }
    },
    computed: {
      totalPrice() {
        let totalPrice = 0;
        this.selectFoods.forEach((food) => {
          totalPrice += food.price * food.count;
        });
        return totalPrice;
      },
      totalCount() {
        let totalCount = 0;
        this.selectFoods.forEach((food) => {
          totalCount += food.count;
        });
        return totalCount;
      },
      payDesc() {
        if (this.totalPrice === 0) {
          return `¥${this.minPrice}元起送`;
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice;
          return `还差¥${diff}元起送`;
        } else {
          return '去结算';
        }
      },
      payClass() {
        if (this.totalPrice < this.minPrice) {
          return 'not-enought';
        } else {
          return 'enought';
        }
      },
      listShow() {
        let _this = this;
        if (!this.totalCount) {
          _this.fold = true;
          return false;
        }
        let show = !this.fold;
        if (show) {
          this.$nextTick(() => {
            if (!this.scroll) { // 没有scroll的时候才需要new，否则只需要刷新一下即可
              _this.scroll = new BScroll(this.$refs.listContent, {
                click: true
              });
            } else {
              this.scroll.refresh();
            }
          });
        }
        return show;
      }
    },
    components: {
      cartControl
    }
  };
</script>

<style lang="stylus" rel="stylesheet" scoped>
  @import "../../common/stylus/mixin.styl";

  .shopCart_wrapper
    .shopCart
      position fixed
      left 0
      bottom 0
      z-index 50
      width 100%
      height 48px
      .content
        display flex
        background #141d27
        color rgba(255, 255, 255, 0.4)
        .content_left
          flex 1
          font-size 0
          .logo_wrapper, .price, .desc
            display inline-block
            vertical-align top
          .logo_wrapper
            position relative
            top -10px
            margin 0 12px
            padding 6px
            width 56px
            height 56px
            box-sizing border-box
            border-radius 50%
            background #141d27
            .logo
              width 100%
              height 100%
              border-radius 50%
              text-align center
              background #2b343c
              .icon-shopping_cart
                line-height 44px
                font-size 24px
                color #80858a
            .num
              position absolute
              top 0
              right 0
              width 24px
              height 16px
              line-height 16px
              text-align center
              border-radius 16px
              font-size 9px
              font-weight 700
              color #fff
              background rgb(240, 20, 20)
              box-shadow 0 4px 8px 0 rgba(0, 0, 0, .4)
          .price
            margin-top 12px
            line-height 24px
            padding-right 12px
            box-sizing border-box
            border-right 1px solid rgba(255, 255, 255, 0.1)
            font-size 16px
            font-weight 700
            color rgba(255, 255, 255, 0.4)
            &.hightLight
                color rgb(255, 255, 255)
          .desc
            margin 12px 0 0 12px
            line-height 24px
            font-size 10px
          &.hightLight
            .logo
              background: rgb(0, 160, 220)
              .icon-shopping_cart
                color #fff
            .price
              color #fff
        .content_right
          flex 0 0 105px
          background #2b333b
          .pay
            height 48px
            line-height 48px
            text-align center
            font-size 12px
            font-weight 700
            &.not-enought
              background: #2b333b
            &.enought
              background #00b43c
              color #fff
      .ball_container
        .ball
          position fixed
          bottom 22px
          left 32px
          z-index 200
          width 16px
          height 16px
          transition: all 0.6s cubic-bezier(0.49, -0.29, 0.75, 0.41)
          .inner
            width 16px
            height 16px
            border-radius 8px
            background rgb(0, 160, 220)
            transition all 0.4s linear
      .shopCart_list
        position absolute
        top 0
        left 0
        z-index -1
        width 100%
        transform translate3d(0, -100%, 0) // 整个列表相对于当前自身的高度做一个偏移
        &.fade-enter-active, &.fade-leave-active
          transition: all 0.5s linear
          transform translate3d(0, -100%, 0) // 每个表项相对于当前自身的高度做一个偏移
        &.fade-enter, &.fade-leave-active
          transform translate3d(0, 0, 0)
        .list_header
          height 40px
          line-height 40px
          padding 0 18px
          background #f3f5f7
          border-bottom 1px solid rgba(7, 17, 27, 0.1)
          .title
            float left
            font-size 14px
            color rgb(7,17,27)
          .empty
            float right
            font-size 12px
            color rgb(0,160,220)
        .list_content
          padding 0 18px
          max-height 217px
          overflow hidden
          background  #ffffff
          .food
            position relative
            padding 12px 0
            box-sizing border-box
            border-1px(rgba(7,17,27,0.1))
            .name
              line-height 24px
              font-size 14px
              color rgb(7,17,27)
            .price
              position absolute
              right 90px
              bottom 12px
              line-height 24px
              font-size 14px
              font-weight 700
              color rgb(240, 20, 20)
            .cartControl_wrapper
              position absolute
              right 0
              bottom 6px
    .list_mask
      position fixed
      top 0
      left 0
      width 100%
      height 100%
      z-index 40 // z-index要小于shopcart的index
      backdrop-filter blur(10px) // 模糊效果
      -webkit-backdrop-filter blur(10px)
      opacity 1
      background rgba(7, 17, 27, 0.6)
      &.fade-enter-active, &.fade-leave-active
        opacity 1
        transition: all 0.5s // 设置缓动效果
        background rgba(7, 17, 27, 0.6)
      &.fade-enter, &.fade-leave-active
        opacity 0
</style>
