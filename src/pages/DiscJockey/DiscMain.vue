<template>
  <div class="disc_main">
    <TopHeader>
      <template #left>
        <i class="iconfont iconleft" @click="$router.back()"></i
        ><span>电台</span>
      </template>
    </TopHeader>
    <div class="swiper_container">
      <swiper :options="swiperOption" class="m_swiper" v-if="banners.length">
        <div class="swiper-pagination" slot="pagination"></div>
        <swiper-slide
          class="swiper_slide"
          v-for="item in banners"
          :key="item.bannerId"
        >
          <img :src="item.pic" />
        </swiper-slide>
      </swiper>
    </div>
    <nav>
      <ul>
        <li>
          <div class="icon_box">
            <i class="iconfont iconfenlei"></i>
          </div>
          <p>电台分类</p>
        </li>
        <li>
          <div class="icon_box">
            <i class="iconfont iconlist"></i>
          </div>
          <p>电台排行</p>
        </li>
        <li>
          <div class="icon_box">
            <i class="iconfont iconfenlei"></i>
          </div>
          <p>付费精品</p>
        </li>
        <li>
          <div class="icon_box">
            <i class="iconfont iconlist"></i>
          </div>
          <p>主播学院</p>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import TopHeader from "components/TopHeader";
export default {
  data() {
    return {
      banners: [],
      swiperOption: {
        pagination: { el: ".swiper-pagination", clickable: true },
        loop: true,
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        autoplay: {
          disableOnInteraction: false
        },
        speed: 1000
      }
    };
  },
  created() {
    this.getBanner();
  },
  methods: {
    async getBanner() {
      const { data } = await this.$getAxios("/dj/banner");
      this.banners = data;
    }
  },
  components: {
    TopHeader,
    swiper,
    swiperSlide
  }
};
</script>
<style lang="scss" scoped>
@import "~common/scss/variable.scss";
.disc_main {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  .swiper_container {
    width: 100%;
    height: 1rem;
    background-color: $main-background;
    padding-top: 0.06rem;
    box-sizing: border-box;
    .m_swiper {
      z-index: 0;
      img {
        width: 3rem;
        height: 1.2rem;
        border-radius: 0.05rem;
        margin-left: 0.1rem;
      }
      /deep/ .swiper-pagination-bullet {
        background-color: rgba(255, 255, 255, 0.9);
      }
      /deep/ .swiper-pagination-bullet-active {
        background: $main-background;
      }
    }
  }
  nav {
    width: 100%;
    padding-top: 0.4rem;
    ul {
      height: 100%;
      display: flex;
      padding-bottom: 0.1rem;
      border-bottom: 1px solid $border-color;
      > li {
        width: 25%;
        .icon_box {
          width: 0.4rem;
          height: 0.4rem;
          background-color: $main-background;
          border-radius: 50%;
          text-align: center;
          line-height: 0.4rem;
          color: #fff;
          margin: 0 auto;
          .iconfont {
            font-size: 0.2rem;
          }
        }
        p {
          margin: 0;
          text-align: center;
          transform: scale(0.8);
          padding: 0.05rem 0;
        }
      }
    }
  }
}
</style>
