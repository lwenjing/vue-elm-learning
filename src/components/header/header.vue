<template>
  <div class="header">
      <div class="content_wrapper">
        <div class="avatar">
          <img :src="seller.avatar" alt="" width="64" height="64">
        </div>
        <div class="content">
          <div class="title">
            <span class="brand"></span>
            <span class="name">{{seller.name}}</span>
          </div>
          <div class="description">
            {{seller.description}}/{{seller.deliveryTime}}分钟送达
          </div>
          <div v-if="seller.supports" class="supports">
            <span class="icon" ></span>
            <v-icon :class="iconClassMap[seller.supports[0].type] + '_1'"></v-icon>
            <span class="text">{{seller.supports[0].description}}</span>
          </div>
        </div>
        <div v-if="seller.supports" class="support_count" @click="showDetail">
          <span class="count">{{seller.supports.length}}个</span>
          <i class="icon-keyboard_arrow_right"></i>
        </div>
      </div>
      <div class="bulletin_wrapper" @click="showDetail">
        <span class="bulletin_title"></span>
        <span class="bulletin_text">{{seller.bulletin}}</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
      <!-- header背景 -->
      <div class="background">
        <img :src="seller.avatar" alt="" width="100%" height="100%">
      </div>
      <!-- 详情弹框 -->
      <transition name="fade">
        <div v-show="detailShow" class="detail">
          <div class="detail_wrapper clearfix">
            <div class="detail_main">
              <h1 class="name">{{seller.name}}</h1>
              <div class="star_wrapper">
                <start :size="48" :score="seller.score"></start>
              </div>
              <div class="title">
                <div class="line"></div>
                <div class="text">优惠信息</div>
                <div class="line"></div>
              </div>
              <ul v-if="seller.supports" class="supports">
                <li class="supports_item" v-for="(item, index) in seller.supports" :key="item.id">
                  <v-icon :class="iconClassMap[seller.supports[index].type] + '_2'"></v-icon>
                  <span class="text">{{seller.supports[index].description}}</span>
                </li>
              </ul>
              <div class="title">
                <div class="line"></div>
                <div class="text">商家公告</div>
                <div class="line"></div>
              </div>
              <div class="bulletin">
                <p class="content">{{seller.bulletin}}</p>
              </div>
            </div>
          </div>
          <div class="detail_close">
            <i class="icon-close" @click="hideDetail"></i>
          </div>
        </div>
      </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import start from '@/components/start/start';
  import icon from '@/components/icon/icon';

  export default {
    // 接收父组件App.vue传来的数据
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        detailShow: false
      };
    },
    methods: {
      showDetail() {
        this.detailShow = true;
      },
      hideDetail() {
        this.detailShow = false;
      }
    },
    // 每个vue 实例被生成后调用这个函数
    created() {
      // 定义class的名称,html可以直接动态的使用这些class
      this.iconClassMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    },
    components: {
      start,
      'v-icon': icon
    }
  };
</script>

<style lang="stylus" rel="stylesheet" scoped>
  @import "../../common/stylus/index.styl";

  .header
    position relative
    overflow hidden
    color #fff
    background rgba(7, 17, 27, .5)
    .content_wrapper
      position relative
      padding 24px 12px 18px 24px
      font-size 0
      .avatar
        display inline-block
        vertical-align top
        img
          border-radius 2px
      .content
        display inline-block
        margin-left 16px
        font-size 14px
        .title
          margin 2px 0 8px 0
          .brand
            display inline-block
            vertical-align top
            width 30px
            height 18px
            bg-image('brand')
            background-size 30px 18px
            background-repeat no-repeat
          .name
            margin-left 6px
            font-size 16px
            line-height 18px
            font-weight bold
        .description
          margin-bottom 10px
          line-height 12px
          font-size 12px
        .supports
          font-size 0
          .text
            line-height 12px
            font-size 10px
      .support_count
        position absolute
        right 12px
        bottom 14px
        padding 0 8px
        height 24px
        line-height 24px
        border-radius 14px
        background rgba(0, 0, 0, .2)
        text-align center
        .count, .icon-keyboard_arrow_right
          font-size 10px
        .count
          vertical-align top
        .icon-keyboard_arrow_right
          margin-left 2px
          line-height 24px
    .bulletin_wrapper
      position relative
      height 28px
      line-height 28px
      padding 0 22px 0 12px
      white-space nowrap
      overflow hidden
      text-overflow ellipsis
      background rgba(7, 17, 27, .2)
      .bulletin_title
        display inline-block
        vertical-align top
        margin-top 8px
        width 22px
        height 12px
        bg-image('bulletin')
        background-size 22px 12px
        background-repeat no-repeat
      .bulletin_text
        vertical-align top
        margin 0 4px 0 2px
        font-size 10px
      .icon-keyboard_arrow_right
        position absolute
        right 12px
        top 8px
        font-size 10px
    .background
      position absolute
      left 0
      top 0
      width 100%
      height 100%
      z-index -1
      filter blur(10px)
    .detail
      position fixed
      left 0
      top 0
      z-index 100
      width 100%
      height 100%
      overflow auto
      background rgba(7, 17, 27, .8)
      backdrop-filter: blur(10px)
      &.fade-enter-active, &.fade-leave-active //渐变的进入和退出都历时0.5s
        transition all 0.5s
      &.fade-enter, &.fade-leave-to //定义进入前和退出后样式，即透明无色背景。
        opacity 0
        background rgba(7,17,27,0)
      .detail_wrapper
        width 100%
        min-height 100%
        .detail_main
          padding 64px 0
          .name
            line-height 16px
            text-align center
            font-size 16px
            font-weight 700
          .star_wrapper
            margin-top 18px
            padding 2px 0
            text-align center
          .title
            display flex
            margin 30px auto 24px
            width 80%
            .line
              flex 1
              position relative
              top -6px
              border-1px(rgba(255, 255, 255, .2))
            .text
              padding 0 12px
              font-size 14px
              font-weight 700
          .supports
            width 80%
            margin 0 auto
            .supports_item
              padding 0 12px
              margin-bottom 12px
              font-size 0
              &:last-child
                margin-bottom 0
              .icon
                width 16px
                height 16px
                margin-right 6px
                background-size 16px 16px
                background-repeat no-repeat
              .text
                line-height 16px
                font-size 12px
          .bulletin
            width 80%
            margin 0 auto
            .content
              padding 0 12px
              line-height 24px
              font-size 12px
      .detail_close
        position relative
        width 32px
        height 32px
        margin -64px auto 0
        clear both
        font-size 32px
</style>
