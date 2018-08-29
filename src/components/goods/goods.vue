<template>
  <div class="goods">
    <div class="menu_wrapper" ref="menuWrapper">
      <ul>
        <li v-for="(item, index) in goods" :key="item.id" class="menu_item menu_item_hook" :class="index === currentIndex? 'current' : ''" @click="selectMenu(index, $event)">
          <span class="text border-1px">
            <v-icon  v-if="item.type > 0" :class="iconClassMap[item.type] + '_3'"></v-icon>
            {{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="food_wrapper" ref="foodsWrapper">
      <ul>
        <li v-for="item in goods" :key="item.id" class="food_list food_list_hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="food in item.foods" :key="food.id" class="food_item border-1px" @click="selectFoodF(food, $event)">
              <div class="icon">
                <img :src="food.icon" alt="" width="57" height="57">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span>月售{{food.sellCount}}份</span>
                  <span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">¥{{food.price}}</span>
                  <span v-show="food.oldPrice" class="old">¥{{food.oldPrice}}</span>
                </div>
                <div class="cartControl_wrapper">
                  <cartControl :food="food" @cart-add="cartAdd"></cartControl>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopCart ref="shopcart" :select-foods="selectFoods" :deliver-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopCart>
    <food :food="selectFood" ref="food" @cart-add="cartAdd"></food>
  </div>
</template>

<script type="text/ecmascript-6">
    import icon from 'components/icon/icon.vue';
    import BScroll from 'better-scroll';
    import shopCart from 'components/shopCart/shopCart.vue';
    import cartControl from 'components/cartControl/cartControl.vue';
    import food from 'components/food/food.vue';

    const ERR_OK = 0;

    export default {
      props: {
        seller: {
          type: Object
        }
      },
      data() {
        return {
          goods: [],
          listHeight: [], // 每一块food_list_hook的高度
          scrollY: 0,
          selectFood: {}
        };
      },
      computed: {
        currentIndex() {
          for (let i = 0; i < this.listHeight.length; i++) {
            let height1 = this.listHeight[i];
            let height2 = this.listHeight[i + 1];
            if (this.scrollY >= height1 && this.scrollY < height2) {
              return i;
            }
          }
          return 0;
        },
        selectFoods() {
          let foods = [];
          this.goods.forEach((good) => {
            good.foods.forEach((food) => {
              if (food.count) {
                foods.push(food);
              }
            });
          });
          return foods;
        }
      },
      created() { // 当这个组件被调用的时候，通过后端获得数据赋值给goods
        this.iconClassMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
        this.$http.get('/api/goods').then((response) => {
          response = response.data;
          if (response.errno === ERR_OK) {
            this.goods = response.data;
            this.$nextTick(() => {
              this._initBScroll();
              this._calculateHeight();
            });
          }
        });
      },
      methods: {
        cartAdd(target) {
          this.$nextTick(() => { // 回调函数异步执行
            this.$refs.shopcart.drop(target);
          });
        },
        selectMenu(index, event) {
          if (!event._constructed) {
            return false;
          }
          let foodList = this.$refs.foodsWrapper.querySelectorAll('.food_list_hook');
          let el = foodList[index];
          this.foodsScroll.scrollToElement(el, 300);
        },
        _initBScroll() {
          this.menuScroll = new BScroll(this.$refs.menuWrapper, {
            click: true
          });
          this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
            click: true,
            probeType: 3
          });
          this.foodsScroll.on('scroll', (pos) => {
            this.scrollY = Math.abs(Math.round(pos.y));
          });
        },
        _calculateHeight() {
          let foodList = this.$refs.foodsWrapper.querySelectorAll('.food_list_hook');
          let height = 0;
          this.listHeight.push(height);
          for (let i = 0; i < foodList.length; i++) {
            let item = foodList[i];
            height += item.clientHeight;
            this.listHeight.push(height);
          }
        },
        selectFoodF(food, event) {
          if (!event._constructed) {
            return false;
          }
          this.selectFood = food;
          this.$refs.food.show();
        }
      },
      // 注册组件
      components: {
        'v-icon': icon,
        shopCart,
        cartControl,
        food
      }
    };
</script>

<style lang="stylus" rel="stylesheet" scoped>
  @import "../../common/stylus/mixin.styl";

  .goods
    display flex
    position absolute
    top 174px
    bottom 46px
    width 100%
    overflow hidden
    .menu_wrapper
      flex 0 0 80px
      width 80px
      background #f3f5f7
      .menu_item
        display table
        width 56px
        height 54px
        padding 0 12px
        line-height 14px
        &.current
          position relative
          margin-top -1px
          z-index 10
          background #fff
          font-weight 700
          .text
            border-none()
        .text
          display table-cell
          width 56px
          vertical-align middle
          font-size 12px
          border-1px(rgba(7, 17, 27, 0.1))
          .icon
            margin-right -1px
        &:last-child
          .text
            border-none()
    .food_wrapper
      flex 1
      .title
        padding-left 14px
        height 26px
        line-height 26px
        border-left 2px solid #d9dde1
        font-size 12px
        color rgb(147, 153, 159)
        background #f3f5f7
      .food_item
        display flex
        margin 0 18px
        padding 18px 0
        border-1px rgba(7, 17, 27, 0.1)
        &:last-child
          border-none()
          margin-bottom 0
        .icon
          flex 0 0 57px
          margin-right 10px
        .content
          flex 1
          .name
            margin 2px 0 8px 0
            height 14px
            line-height 14px
            font-size 14px
            color rgb(7, 17, 27)
          .desc, .extra
            line-height 10px
            font-size 10px
            color rgb(147, 153, 159)
          .desc
            margin-bottom 8px
            line-height 12px
          .extra
            &.count
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
          .cartControl_wrapper
            position absolute
            right 0
            bottom 12px
</style>
