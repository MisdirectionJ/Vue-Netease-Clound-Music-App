<template>
  <div class="artist_top">
    <TopHeader>
      <template #left>
        <i class="iconfont iconleft" @click="$router.back()"></i>
        云音乐歌手榜
      </template>
    </TopHeader>
    <div class="container" ref="wrapper">
      <div class="scroll_box">
        <p class="time" v-show="newDay">更新时间 : {{ newDay }}</p>
        <ul>
          <li :key="item.id" v-for="(item, index) in aristTopList" @click="toSingerDetil(item)">
            <div class="num">
              <span :class="index < 3 ? 'num_color' : ''">{{ index + 1 }}</span>
            </div>
            <div class="img_box">
              <img v-lazy="item.img1v1Url" alt="" />
            </div>
            <div class="message">
              <p class="name">{{ item.name }}</p>
              <p><i class="iconfont iconhuo"></i>{{ item.score }}</p>
              <p class="now">
                <span class="person"
                  ><span class="talk">#{{ item.name }}#</span>
                  {{ item.topicPerson }}人正在讨论</span
                >
                <i class="iconfont iconyoujiantou"></i>
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <Loading v-if="!aristTopList.length"></Loading>
  </div>
</template>
<script>
import TopHeader from "components/TopHeader";
import Loading from "components/Loading";
export default {
  data() {
    return {
      aristTopList: [],
      newDay: ""
    };
  },
  components: {
    TopHeader,
    Loading
  },
  created() {
    this.getAristTop();
  },
  mounted() {
    this.$scroll(this, this.$refs.wrapper);
  },
  methods: {
    async getAristTop() {
      const { list } = await this.$getAxios("/toplist/artist");
      this.aristTopList = list.artists;
      const updataDay = new Date(list.updateTime);
      const month = updataDay.getMonth() + 1;
      const day = updataDay.getDate();
      this.newDay = month + "月" + day + "日";
    },
    async toSingerDetil({ picUrl, name, id }) {
       const checkSingerArtlist = await this.$getAxios("/artists?id=" + id)
      this.$store.state.checkSingerArtlist = checkSingerArtlist
      this.$store.state.singerDetil = {
        picUrl,
        name,
        accountId: checkSingerArtlist.artist.accountId
      };
      this.$store.state.singerId = id
      this.$router.push({ name: "singer", params: { id } });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~common/scss/variable.scss";
@import "~common/scss/mixin.scss";
.artist_top {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  .container {
    overflow: hidden;
    height: calc(100vh - 0.5rem);
    .scroll_box {
      padding-bottom: 0.5rem;
      .time {
        padding: 0.1rem 0 0 0.1rem;
        font-size: 0.13rem;
      }
      ul > li {
        display: flex;
        height: 0.6rem;
        margin-bottom: 0.1rem;
        padding-right: 0.1rem;
        @include small_artlist_box(0.6rem, 0.05rem);
        .num {
          width: 0.3rem;
          color: $nofind-color;
          text-align: center;
          font-size: $best-big-font;
          line-height: 0.6rem;
        }
        .num_color {
          color: $main-background;
        }
        .message {
          width: calc(100vw - 1.1rem);
          color: #9a9a9a;
          p {
            margin: 0;
            @include text-overflow-one;
            line-height: 0.2rem;
            font-size: $best-small-font;
            .iconfont {
              font-size: $best-small-font;
              margin-right: 0.05rem;
            }
          }
          .name {
            font-size: 0.14rem;
            color: #000;
          }
          .now {
            color: #7a7a7a;
            display: flex;
            justify-content: space-between;
            border-radius: 0.1rem;
            background-color: #f3f3f3;
            box-sizing: border-box;
            padding-left: 0.1rem;
            .person {
              width: 100%;
              @include text-overflow-one;
            }
            .talk {
              color: $keyword-color;
            }
          }
        }
      }
    }
  }
  .loading_box {
    top: 1.5rem;
  }
}
</style>
