<template>
  <div class="ratingSelect_wrapper">
    <div class="rating_type border-1px">
      <span class="block positive" :class="{'active': sType === 2}" @click="select(2, $event)">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
      <span class="block positive" :class="{'active': sType === 0}" @click="select(0, $event)">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
      <span class="block negative" :class="{'active': sType === 1}" @click="select(1, $event)">{{desc.negative}}<span class="count">{{negatives.length}}</span></span>
    </div>
    <div class="switch" :class="{'on': onlyContent}" @click="toggleCount">
      <span class="icon-check_circle"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
    const POSITIVA = 0;
    const NAGATIVE = 1;
    const ALL = 2;

    export default {
      props: {
        ratings: {
          type: Array,
          default() {
            return [];
          }
        },
        selectType: {
          type: Number,
          default: ALL
        },
        onlyContent: {
          type: Boolean,
          default: false
        },
        desc: {
          type: Object,
          default() {
            return {
              all: '全部',
              positive: '满意',
              negative: '不满意'
            };
          }
        }
      },
      data() {
        return {
          sType: this.selectType,
          oContent: this.onlyContent
        };
      },
      methods: {
        select(type, event) {
          if (!event._constructed) {
            return;
          }
          this.sType = type;
          this.$emit('rating-type', type);
        },
        toggleCount(event) {
          if (!event._constructed) {
            return;
          }
          this.oContent = !this.oContent;
          this.$emit('content-toggle', this.oContent);
        }
      },
      computed: {
        positives() {
          return this.ratings.filter((rating) => {
            return rating.rateType === POSITIVA;
          });
        },
        negatives() {
          return this.ratings.filter((rating) => {
            return rating.rateType === NAGATIVE;
          });
        }
      }
    };
</script>

<style lang="stylus" rel="stylesheet" scoped>
  @import "../../common/stylus/mixin.styl";

  .ratingSelect_wrapper
    .rating_type
      padding 18px 0
      margin 0 18px
      border-1px(rgba(7, 17, 27, .1))
      font-size 0
      .block
        display inline-block
        padding 8px 12px
        margin-right 8px
        line-height 16px
        border-radius 1px
        font-size 12px
        color rgb(77, 85, 93)
        &.active
          color #fff
        .count
          margin-left 2px
          font-size 8px
        &.positive
          background rgba(0, 160, 220, .2)
          &.active
            background rgb(0, 160, 220)
        &.negative
          background rgba(7, 85, 93, .2)
          &.active
            background rgb(7, 85, 93)
    .switch
      padding 12px 18px
      line-height 24px
      border-bottom 1px solid rgba(7, 17, 27, .1)
      color rgb(147, 153, 159)
      font-size 0
      &.on
        .icon-check_circle
          color #00c850
      .icon-check_circle
        display inline-block
        vertical-align top
        margin-right 4px
        font-size 24px
      .text
        display inline-block
        vertical-align top
        font-size 12px
</style>
