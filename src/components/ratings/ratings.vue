<template>
    <div class="ratings_wrapper" ref="ratings">
      <div class="ratings_content">
        <div class="overView">
          <div class="overView_left">
            <h1 class="score">{{seller.score}}</h1>
            <div class="title">综合评分</div>
            <div class="rank">高于周边商家{{seller.rankRate}}%</div>
          </div>
          <div class="overView_right">
            <div class="score_wrapper"></div>
            <div class="score_wrapper">
              <span class="title">服务态度</span>
              <start :size="36" :score="seller.score"></start>
              <span class="score">{{seller.serviceScore}}</span>
            </div>
            <div class="score_wrapper">
              <span class="title">商品评分</span>
              <start :size="36" :score="seller.foodScore"></start>
              <span class="score">{{seller.foodScore}}</span>
            </div>
            <div class="delivery_wrapper">
              <span class="title">送达时间</span>
              <span class="delivery">{{seller.deliveryTime}}分钟</span>
            </div>
          </div>
        </div>
        <split></split>
        <ratingSelect :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="ratings" @rating-type="ratingType" @content-toggle="contentToggle"></ratingSelect>
        <div class="rating_wrapper">
          <ul>
            <li v-for="rating in ratings" :key="rating.id" class="rating_item border-1px" v-show="needShow(rating.rateType, rating.text)">
              <div class="avatar">
                <img :src="rating.avatar" alt="">
              </div>
              <div class="content">
                <h1 class="name">{{rating.username}}</h1>
                <div class="start_wrapper">
                  <start :size="24" :score="rating.score"></start>
                  <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}</span>
                </div>
                <div class="text">{{rating.text}}</div>
                <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                  <span class="icon-thumb_up"></span>
                  <span class="item" v-for="item in rating.recommend" :key="item.id">{{item}}</span>
                </div>
                <div class="time">{{rating.rateTime | formatDate}}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {formatDate} from 'common/js/date';
    import BScroll from 'better-scroll';
    import start from 'components/start/start';
    import ratingSelect from 'components/ratingSelect/ratingSelect.vue';
    import split from 'components/split/split.vue';

    const ALL = 2;
    const ERR_OK = 0;

    export default {
      props: {
        seller: {
          type: Object
        }
      },
      data() {
        return {
          ratings: [],
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
      created() { // 当这个组件被调用的时候，通过后端获得数据赋值给goods
        this.iconClassMap = ['decrease', 'discount', 'special', 'billCreate', 'guarantee'];
        this.$http.get('/api/ratings').then((response) => {
          response = response.data;
          if (response.errno === ERR_OK) {
            this.ratings = response.data;
            this.$nextTick(() => {
              this.scroll = new BScroll(this.$refs.ratings, {
                click: true
              });
            });
          }
        });
      },
      methods: {
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
        start,
        ratingSelect,
        split
      }
    };
</script>

<style lang="stylus" rel="stylesheet" scoped>
  @import "../../common/stylus/mixin.styl";

  .ratings_wrapper
    position absolute
    top 174px
    bottom 0
    left 0
    width 100%
    overflow hidden
    .ratings_content
      width 100%
      .overView
        display flex
        padding 18px 0
        .overView_left
          flex 0 0 137px
          padding 6px 0
          width 137px
          border-right 1px solid rgba(7, 17, 27, .1)
          text-align center
          @media only screen and (max-width: 320px)
            flex 0 0 120px
          .score
            margin-bottom 6px
            line-height 28px
            font-size 20px
            color rgb(255, 153, 0)
          .title
            margin-bottom 6px
            line-height 12px
            font-size 12px
            color rgb(7, 17, 27)
          .rank
            line-height 10px
            font-size 10px
            color rgb(147, 153, 159)
        .overView_right
          flex 1
          padding 6px 0 6px 24px
          @media only screen and (max-width: 320px)
            padding 6px 0 6px 6px
          .score_wrapper
            margin-bottom 8px
            line-height 18px
            font-size 0
            .title, .start, .score
              display inline-block
              vertical-align top
            .title
              line-height 18px
              font-size 12px
              color rgb(7, 17, 27)
            .start
              margin 0 12px
            .score
              font-size 12px
              color rgb(255, 153, 0)
          .delivery_wrapper
            font-size 0
            .title, .delivery
              display inline-block
            .title
              line-height 18px
              font-size 12px
              color rgb(7, 17, 27)
            .delivery
              margin-left 12px
              font-size 12px
              color rgb(147, 153, 159)
      .rating_wrapper
        padding 0 18px
        .rating_item
          display flex
          padding 18px 0
          border-1px(rgba(7, 17, 27, .1))
          .avatar
            flex 0 0 28px
            margin-right 12px
            img
              display block
              width 28px
              height 28px
              border-radius 50%
          .content
            position relative
            flex 1
            .name
              margin-bottom 4px
              line-height 12px
              font-size 10px
              color rgb(7, 17, 27)
            .start_wrapper
              margin-bottom 6px
              font-size 0
              .start, .delivery
                display inline-block
                vertical-align top
              .start
                margin-right 6px
              .delivery
                line-height 12px
                font-size 10px
                color rgb(147, 153, 159)
            .text
              margin-bottom 8px
              line-height 18px
              font-size 12px
              color rgb(7, 17, 27)
            .recommend
              line-height 16px
              font-size 0
              .icon-thumb_up, .item
                display inline-block
                margin 0 8px 4px 0
                font-size 9px
              .icon-thumb_up
                color rgb(0, 160, 220)
              .item
                padding 0 6px
                color rgb(147, 153, 159)
                border 1px solid rgba(7, 17, 27, .1)
                border-radius 1px
                background #fff
            .time
              position absolute
              top 0
              right 0
              line-height 12px
              font-size 10px
              color rgb(147, 153, 159)
</style>
