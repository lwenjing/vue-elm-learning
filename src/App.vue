<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab_item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab_item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab_item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <!-- 对应的组件内容渲染到router-view中 -->
    <router-view :seller="seller"></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import header from 'components/header/header.vue';
  import {urlParse} from 'common/js/until';

  const ERR_OK = 0;

  export default {
    data() {
      return {
        seller: {
          id: (() => {
            let queryParam = urlParse();
            return queryParam.id;
          })()
        }
      };
    },
    created() {
      // 生命周期
      this.$http.get('/api/seller?id=' + this.seller.id).then((response) => {
        response = response.data;
        if (response.errno === ERR_OK) {
          // this.seller = response.data;
          this.seller = Object.assign({}, this.seller, response.data);
          console.log(this.seller.id);
        }
      });
    },
    components: {
      'v-header': header
    }
  };
</script>

<style lang="stylus" rel="stylesheet" scoped>
  @import "./common/stylus/mixin.styl";

  .f_left
    float left
  .f_right
    float right
  .tab
    display flex
    height 40px
    line-height 40px
    border-1px(rgba(7, 17, 27, 0.1))
    .tab_item
      flex: 1
      text-align center
      & > a
        display block
        font-size 14px
        color rgb(77, 85, 93)
        &.active
          color rgb(240, 20, 20)

</style>
