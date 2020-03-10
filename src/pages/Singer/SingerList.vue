<template>
  <div class="singerlist_box">
    <TopHeader>
      <template #left>
        <i class="iconfont iconleft" @click="$router.back()"></i>
        歌手分类
      </template>
    </TopHeader>
    <div v-show="scrollFlag">
      <div class="country">
        <ul>
          <li
            ref="country"
            v-for="(item, index) in allartists"
            :key="index"
            @click="changeList(index, true, $event)"
          >
            {{ item }}
          </li>
        </ul>
      </div>
      <div class="gender">
        <ul>
          <li
            ref="gender"
            @click="changeList(index, false, $event)"
            v-for="(item, index) in allGender"
            :key="index"
          >
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
    <div class="scroll_hidden" v-show="!scrollFlag">
      <span @click="scrollFlag = !scrollFlag">全部歌手</span>
      <span class="select" @click="scrollFlag = !scrollFlag"
        ><i class="iconfont iconshaixuan"></i>筛选</span
      >
    </div>
    <div ref="wrapper" class="singer_container">
      <div class="scroll_box">
        <div class="bg">
          热门歌手
        </div>
        <div class="singer_box">
          <ul>
            <li v-for="item in artists" :key="item.id">
              <div class="singer" @click="toSingerDetil(item)">
                <div class="img_box">
                  <img v-lazy="item.img1v1Url" alt="" />
                </div>
                <p>
                  {{ item.name }}
                  <i v-if="item.accountId" class="iconfont iconwo"></i>
                </p>
              </div>
              <div class="follow">
                <span v-if="!item.followed"
                  ><i class="iconfont iconadd"></i> 关注</span
                >
                <span v-else class="followed"
                  ><i class="iconfont iconfollow"></i> 已关注</span
                >
              </div>
            </li>
          </ul>
          <Loading v-if="isLoading"></Loading>
        </div>
      </div>
    </div>
    <Loading v-if="!artists.length"></Loading>
  </div>
</template>

<script>
import TopHeader from "components/TopHeader";
import Loading from "components/Loading";
export default {
  name: "SingerList",
  components: {
    TopHeader,
    Loading
  },
  data() {
    return {
      offset: 0,
      more: false,
      artists: [],
      scrollFlag: true,
      isLoading: false,
      cIndex: NaN,
      gIndex: NaN,
      allartists: ["华语", "欧美", "日本", "韩国", "其他"],
      allGender: ["男", "女", "其他组合"],
      codeType: [
        {
          country: 0,
          gender: 0,
          code: 1001
        },
        {
          country: 0,
          gender: 1,
          code: 1002
        },
        {
          country: 0,
          gender: 2,
          code: 1003
        },
        {
          country: 1,
          gender: 0,
          code: 2001
        },
        {
          country: 1,
          gender: 1,
          code: 2002
        },
        {
          country: 1,
          gender: 2,
          code: 2003
        },
        {
          country: 2,
          gender: 0,
          code: 6001
        },
        {
          country: 2,
          gender: 1,
          code: 6002
        },
        {
          country: 2,
          gender: 2,
          code: 6003
        },
        {
          country: 3,
          gender: 0,
          code: 7001
        },
        {
          country: 3,
          gender: 1,
          code: 7002
        },
        {
          country: 3,
          gender: 2,
          code: 7003
        },
        {
          country: 4,
          gender: 0,
          code: 4001
        },
        {
          country: 4,
          gender: 1,
          code: 4002
        },
        {
          country: 4,
          gender: 2,
          code: 4003
        }
      ]
    };
  },
  created() {
    this.getHotList();
  },
  watch: {
    scrollFlag(val) {
      this.$refs.wrapper.style.height = val
        ? "calc(100vh - 1.3rem)"
        : "calc(100vh - 0.5rem)";
    },
    code() {
      this.artists = [];
      this.more = false;
      this.offset = 0;
      this.getRuZhuList();
    }
  },
  mounted() {
    this.$scroll(this, this.$refs.wrapper);
    this.scroll.on("pullingUp", () => {
      this.more = false;
      if (Number.isNaN(this.cIndex) || Number.isNaN(this.gIndex))
        return this.getHotList();
      this.getRuZhuList();
    });
    this.scroll.on("scrollStart", () => {
      this.scrollFlag = false;
    });
    this.country = this.$refs.country;
    this.gender = this.$refs.gender;
  },
  computed: {
    code() {
      if (Number.isNaN(this.cIndex) || Number.isNaN(this.gIndex)) return;
      return this.codeType.find(item => {
        if (item.country === this.cIndex && item.gender === this.gIndex)
          return item.code;
      }).code;
    }
  },
  methods: {
    toSingerDetil({name, picUrl, accountId, id}) {
      this.$router.push({ name: "singer", params: { id } });
      this.$store.state.singerId = id
      this.$store.state.singerDetil = {
        picUrl,
        name,
        accountId,
      }
    },
    changeList(index, flag, e) {
      if (flag) {
        if (!Number.isNaN(this.cIndex) && !Number.isNaN(this.gIndex)) {
          this.country[this.cIndex].classList.remove("active");
        } else {
          this.gIndex = 0;
          this.gender[this.gIndex].classList.add("active");
        }
        this.cIndex = index;
      } else {
        if (!Number.isNaN(this.cIndex) && !Number.isNaN(this.gIndex)) {
          this.gender[this.gIndex].classList.remove("active");
        } else {
          this.cIndex = 0;
          this.country[this.cIndex].classList.add("active");
        }
        this.gIndex = index;
      }
      e.target.classList.add("active");
    },
    async getHotList() {
      if (this.offset) this.isLoading = true;
      const { artists, more } = await this.$getAxios(
        `top/artists?offset=${this.offset * 50}`
      );
      this.checkArtist(artists, more);
    },
    checkArtist(artists, more) {
      this.isLoading = false;
      this.more = more;
      if (!artists || !artists.length) return;
      this.artists = this.artists.concat(artists);
      if (this.more) {
        this.offset++;
        this.scroll.finishPullUp();
      }
    },
    async getRuZhuList() {
      if (this.offset) this.isLoading = true;
      const { artists, more } = await this.$getAxios(
        `/artist/list?cat=${this.code}&offset=${this.offset * 30}`
      );
      this.checkArtist(artists, more);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~common/scss/variable.scss";
@import "~common/scss/mixin.scss";
.singerlist_box {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  .loading_box {
    top: 2rem;
  }
  .singer_container {
    height: calc(100vh - 1.3rem);
    overflow: hidden;
    .scroll_box {
      padding-bottom: 0.5rem;
    }
  }
  .country,
  .gender {
    ul {
      display: flex;
      line-height: 0.4rem;
      font-size: 0.13rem;
      height: 0.4rem;
      color: #8f8f8f;
      > li {
        width: 0.6rem;
        text-align: center;
      }
    }
  }
  .scroll_hidden {
    height: 0.4rem;
    line-height: 0.4rem;
    display: flex;
    justify-content: space-between;
    padding: 0 0.1rem;
    font-size: 0.13rem;
    .iconfont {
      font-size: 0.12rem;
      margin-right: 0.05rem;
    }
    .select {
      font-size: 0.12rem;
    }
  }
  .active {
    color: $main-background;
  }
  .bg {
    background: #f3f3f3;
    color: #666;
    height: 0.25rem;
    font-size: 0.12rem;
    line-height: 0.25rem;
    padding-left: 0.1rem;
  }
  .singer_box {
    ul {
      padding: 0 0.1rem;
      margin-top: 0.1rem;
      > li {
        height: 0.5rem;
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.1rem;
        .singer {
          @include small_artlist_box(0.5rem, 50%);
          display: flex;
          p {
            width: calc(100vw - 1.5rem);
            @include text-overflow-one;
            line-height: 0.5rem;
            margin: 0;
            font-size: $normal-font;
            display: flex;
            .iconfont {
              font-size: 0.13rem;
              line-height: 0.15rem;
              height: 0.15rem;
              width: 0.15rem;
              text-align: center;
              margin-top: 0.175rem;
              margin-left: 0.05rem;
              border-radius: 50%;
              background: $main-background;
              color: #fff;
            }
          }
        }
        .follow {
          line-height: 0.5rem;
          font-size: 0.12rem;
          transform: scale(0.8);
          color: $main-background;
          .iconfont {
            font-size: 0.12rem;
          }
          span {
            padding: 0.04rem 0.13rem;
            border: 1px solid $main-background;
            border-radius: 0.15rem;
          }
          .followed {
            color: #808080;
            padding: 0.03rem 0.08rem;
            border: 1px solid #808080;
          }
        }
      }
    }
    .loading_box {
      position: relative;
      left: 0;
      top: 0;
    }
  }
}
</style>
