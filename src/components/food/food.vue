<template>
    <transition name="move">
      <div class="food_wrapper" v-show="showFlag" ref="food">
        <div class="food_content">
          <div class="image_header">
            <img :src="food.image" alt="">
            <div class="back" @click="hide">
              <span class="icon-arrow_lift"></span>
            </div>
          </div>
          <div class="content">
            <h1 class="title">{{food.name}}</h1>
            <div class="detail">
              <span class="sell_count">月售{{food.sellCount}}</span>
              <span class="rating">好评率{{food.rating}}%</span>
            </div>
            <div class="price">
              <span class="now">¥{{food.price}}</span>
              <span class="old" v-show="food.oldPrice">¥{{food.oldPrice}}</span>
            </div>
            <div class="cartControl_wrapper">
              <cartControl :food="food" @cart-add="cartAdd"></cartControl>
            </div>
            <transition name="fade">
              <div class="buy" v-show="!food.count || food.count === 0" @click.stop.prevent="addFirst">加入购物车</div>
            </transition>
          </div>
          <split v-show="food.info"></split>
          <div class="info" v-show="food.info">
            <div class="title">商品信息</div>
            <div class="text">{{food.info}}</div>
          </div>
          <split></split>
          <div class="rating">
            <h1 class="title">商品评价</h1>
            <ratingSelect :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings" @rating-type="ratingType" @content-toggle="contentToggle"></ratingSelect>
            <div class="rating_content">
              <ul v-show="food.ratings && food.ratings.length">
                <li v-for="rating in food.ratings" :key="rating.id" v-show="needShow(rating.rateType, rating.text)" class="rating_item border-1px">
                  <div class="user">
                    <span class="name">{{rating.username}}</span>
                    <img :src="rating.avatar" alt="" class="avatar">
                  </div>
                  <div class="time">{{rating.rateTime | formatDate}}</div>
                  <div class="text"><span :class="{'icon-thumb_up': rating.rateType === 0, 'icon-thumb_down': rating.rateType === 1}"></span>{{rating.text}}</div>
                </li>
              </ul>
              <div class="no_rating" v-show="!(food.ratings) || !(food.ratings.length)">暂无评价</div>
            </div>
          </div>
        </div>
      </div>
    </transition>
</template>

<script type="text/ecmascript-6">
    import BScroll from 'better-scroll';
    import Vue from 'vue';
    import {formatDate} from 'common/js/date';
    import cartControl from 'components/cartControl/cartControl.vue';
    import ratingSelect from 'components/ratingSelect/ratingSelect.vue';
    import split from 'components/split/split.vue';

    const POSITIVA = 0;
    const NAGATIVE = 0;
    const ALL = 2;

    export default {
      props: {
        food: {
          type: Object
        }
      },
      data() {
        return {
          showFlag: false,
          selectType: ALL,
          onlyContent: true,
          desc: {
            all: '全部',
            positive: '推荐',
            negative: '吐槽'
          }
        };
      },
      methods: {
        show() {
          this.showFlag = true;
          this.selectType = ALL;
          this.onlyContent = true;
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.food, {
                click: true
              });
            } else {
              this.scroll.refresh();
            }
          });
        },
        hide() {
          this.showFlag = false;
        },
        cartAdd() {
          this.$emit('cart-add', event.target);
        },
        addFirst(event) {
          if (!event._constructed) {
            return false;
          }
          Vue.set(this.food, 'count', 1);
          this.$emit('cart-add', event.target);
        },
        needShow(type, text) {
          if (this.onlyContent && !text) {
            return false;
          }
          if (this.selectType === ALL) {
            return true;
          } else {
            return type === this.selectType; // 数据类型和选择类型一致
          }
        },
        ratingType(type) {
          this.selectType = type;
          this.$nextTick(() => {
            this.scroll.refresh();
          });
        },
        contentToggle(onlyContent) {
          this.onlyContent = onlyContent;
          this.$nextTick(() => {
            this.scroll.refresh();
          });
        }
      },
      filters: {
        formatDate(time) {
          var date = new Date(time);
          return formatDate(date, 'yyyy-MM-dd hh:mm');
        }
      },
      components: {
        cartControl,
        split,
        ratingSelect
      }
    };
</script>

<style lang="stylus" rel="stylesheet" scoped>
  @import "../../common/stylus/mixin.styl";

  .food_wrapper
    position fixed;
    left 0
    top 0
    bottom 48px
    z-index 30
    width 100%
    background #fff
    &.move-enter-active, &.move-leave-active
      transition: all 0.2s linear
      transform translate3d(0, 0, 0)
    &.move-enter, &.move-leave-active
      transform translate3d(100%, 0, 0)
    .food_content
      position relative
      .image_header
        position relative
        width 100%
        height 0
        padding-top 100%
        img
          position absolute
          top 0
          left 0
          width 100%
          height 100%
        .back
          position absolute
          top 10px
          left 0
          .icon-arrow_lift
            display block
            padding 10px
            font-size 20px
            color #fff
      .content
        position relative
        padding 18px
        .title
          margin-bottom 8px
          line-height 14px
          font-size 14px
          font-weight 700
          color rgb(7, 17, 27)
        .detail
          margin-bottom 18px
          line-height 10px
          height 10px
          font-size 0
          .sell_count, .rating
            font-size 10px
            color rgb(147, 153, 159)
          .sell_count
            margin-right 12px
        .price
          font-weight 700
          line-height 24px
          font-size 0
          .now
            margin-right 8px
            font-size 14px
            color rgb(240, 20, 20)
          .old
            text-decoration line-through
            font-size 10px
            color rgb(147, 153, 159)
        .cartControl_wrapper, .buy
          position absolute
        .cartControl_wrapper
          right 12px
          bottom 12px
        .buy
          right 18px
          bottom 18px
          z-index 10
          line-height 24px
          padding 0 12px
          box-sizing border-box
          border-radius 12px
          font-size 10px
          color #fff
          background rgb(0, 160, 220)
          &.move-enter-active, &.move-leave-active
            transition: all 0.2s linear
            opacity 1
          &.move-enter, &.move-leave-active
            opacity 0
      .info
        padding 18px
        .title
          line-height 14px
          margin-bottom 6px
          font-size 14
          color rgb(7, 17, 27)
        .text
          line-height 24px
          padding 0 8px
          font-size 12px
          color rgb(77, 85, 93)
      .rating
        line-height 14px
        padding-top 18px
        font-size 14px
        color rgb(7, 17, 27)
        .title
          margin-left 8px
        .rating_content
          padding 0 18px
          .rating_item
            position relative
            padding 16px 0
            border-1px(rgba(7, 17, 27, .1))
            .user
              position absolute
              top 16px
              right 0
              line-height 12px
              font-size 0
              .name, .avatar
                display inline-block
                vertical-align top
              .name
                margin-right 6px
                font-size 10px
                color rgb(147, 153, 159)
              .avatar
                width 10px
                border-radius 50%
            .time
              margin-bottom 6px
              line-height 12px
              font-size 10px
              color rgb(147, 153, 159)
            .text
              line-height 16px
              font-size 12px
              color rgb(7, 17, 27)
              .icon-thumb_up, .icon-thumb_down
                margin-right 4px
                line-height 16px
                font-size 12px
              .icon-thumb_up
                color rgb(0, 160, 220)
              .icon-thumb_down
                color rgb(147, 153, 159)
          .no_rating
            padding 16px 0
            font-size 12px
            color rgb(147, 153, 159)
</style>
