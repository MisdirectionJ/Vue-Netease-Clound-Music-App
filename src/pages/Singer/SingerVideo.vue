<template>
  <div class="singer_video">
    <header v-show="mvs.length">
      <h5>
        全部 <span>(共{{ mvSize }}个)</span>
      </h5>
      <div class="option">
        <span>全部</span>
        <span class="current">MV</span>
      </div>
    </header>
    <ul>
      <li v-for="item in mvs" :key="item.vid" @click="startMv(item)">
        <div class="img_box">
          <img v-lazy="item.imgurl16v9" alt="" />
          <div class="small_title">
            <i class="iconfont iconsanjiao"></i>
            <span class="count">{{ item.playCount | playcount }}</span>
          </div>
        </div>
        <div class="name">
          <p class="mv_name">
            <span>MV</span>
            {{ item.name }}
          </p>
          <p class="creator_name">
            {{ item.publishTime.replace(/-/g, ".") }}
          </p>
        </div>
      </li>
    </ul>
    <Loading v-if="isLoading"></Loading>
  </div>
</template>
<script>
import Loading from "components/Loading";
import { mapState } from "vuex";
export default {
  data() {
    return {
      offset: 0,
      hasMore: false,
      isLoading: false,
      mvs: [],
      id: null
    };
  },
  components: {
    Loading
  },
  computed: {
    ...mapState(["singerId"])
  },
  activated() {
    if (this.$route.params.id === this.id) return;
    else {
      Object.assign(this.$data, this.$options.data());
      this.getSingerVideo();
      this.$emit("initPullUp");
    }
  },
  watch: {
    videoFlag(val) {
      if (!this.offset) {
        this.$emit("initPullUp");
        return;
      }
      if (this.hasMore && val) {
        this.getSingerVideo();
      }
    }
  },
  created() {
    this.getSingerVideo();
  },
  props: {
    mvSize: Number,
    videoFlag: Boolean
  },
  methods: {
    startMv({ id, name, artistName }) {
      this.$store.state.mvDetil = {
        comType: 1,
        type: "mv",
        idStr: "mvid",
        creator: { userName: artistName },
        title: name,
        vid: id
      };
      this.$router.push("/home/video");
    },
    async getSingerVideo() {
      this.id = this.$route.params.id;
      if (this.offset) this.isLoading = true;
      else this.$emit("changeLoading", true);
      const { mvs, hasMore } = await this.$getAxios(
        `/artist/mv?id=${this.id}&offset=${this.offset * 30}`
      );
      if (this.offset) this.isLoading = false;
      else this.$emit("changeLoading", false);
      this.hasMore = hasMore;
      if (mvs.length) {
        this.mvs = this.mvs.concat(mvs);
        this.$emit("initPullUp");
        this.offset++;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~common/scss/variable.scss";
@import "~common/scss/mixin.scss";
.singer_video {
  header {
    line-height: 0.4rem;
    padding: 0 0.1rem;
    display: flex;
    justify-content: space-between;
    h5 {
      font-size: $normal-font;
      margin: 0;
      span {
        font-size: $best-small-font;
        font-weight: normal;
        color: $noselect-color;
      }
    }
    .option {
      font-size: $best-small-font;
      span {
        padding: 0 0.05rem;
      }
      span:first-child {
        border-right: 1px solid $border-color;
      }
      .current {
        color: $main-background;
      }
    }
  }
  ul {
    padding: 0 0.1rem;
    > li {
      margin-top: 0.05rem;
      @include video_box(1.2rem, 0.675rem);
      .name {
        width: calc(100% - 1.5rem);
        .mv_name {
          margin: 0.1rem 0;
        }
      }
      .img_box {
        position: relative;
        @include small_count;
      }
    }
  }
  @include loading_box;
}
</style>
