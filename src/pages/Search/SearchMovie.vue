<template>
  <div class="movie_box">
    <div class="video_list">
      <ul>
        <li v-for="item in videos" :key="item.vid" @click="startVideo(item)">
          <div class="img_box">
            <img v-lazy="item.coverUrl" alt="" />
            <div class="small_title">
              <i class="iconfont iconsanjiao"></i>
              <span class="count">{{ item.playTime | playcount }}</span>
            </div>
          </div>
          <div class="name">
            <p class="mv_name">
              <span v-if="!/[a-zA-Z]/.test(item.vid)">MV</span>
              {{ item.name || item.title }}
            </p>
            <p class="creator_name">
              {{ item.durationms | durationTime }}
              {{
                /[a-zA-Z]/.test(item.vid)
                  ? "by " + item.creator[0].userName
                  : item.creator[0].userName
              }}
            </p>
          </div>
        </li>
      </ul>
      <Loading v-if="isLoading"></Loading>
    </div>
    <div class="not_find" v-if="canNotFind">未找到与"{{ word }}"相关的内容</div>
  </div>
</template>
<script>
import Loading from "components/Loading";
import { mapState } from "vuex";

export default {
  data() {
    return {
      videos: [],
      canNotFind: false,
      offset: 0,
      isLoading: false,
      flag: true
    };
  },
  computed: {
    ...mapState(["word"])
  },
  
  props: {
    videoFlag: Boolean
  },
  components: {
    Loading
  },
  created() {
    this.getMovie();
  },
  activated() {
    this.$emit("initPullUp");
  },
  watch: {
    word() {
      this.getMovie();
    },
    videoFlag(val) {
      if (!this.offset) {
        this.$emit("initPullUp");
        return
      }
      if (this.flag && val) {
        this.getMovieList();
      }
    }
  },
  methods: {
    startVideo ({vid, title, playTime, creator}) {
       const flag = /[a-zA-Z]/.test(vid)
      this.$store.state.mvDetil = {
        comType: flag ? 5 : 1,
        type: flag ? 'video' : 'mv',
        idStr:flag ? 'id' : 'mvid', 
        creator: creator[0],
        playTime,
        title, 
        vid
      }
      this.$router.push('/home/video')
    },
    async getMovieList() {
      if (!this.flag) return;
      this.isLoading = true;
      const { result } = await this.$getAxios(
        `/search?keywords=${this.word}&type=1014&offset=${this.offset * 30}`
      );
      if (!result || !result.videos || !result.videos.length) {
        this.flag = false;
        this.isLoading = false;
        return;
      }
      this.isLoading = false;
      this.videos = this.videos.concat(result.videos);
      this.offset++;
      this.$emit("initPullUp");
    },
    async getMovie() {
      Object.assign(this.$data, this.$options.data());
      this.$emit("startLoading", true);
      const { result } = await this.$getAxios(
        `/search?keywords=${this.word}&type=1014`
      );
      if (result && result.videos && result.videos.length) {
        this.offset++;
        this.$emit("startLoading", false);
        this.videos = result.videos;
        this.canNotFind = false;
      } else {
        this.$emit("startLoading", false);
        this.canNotFind = true;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~common/scss/mixin.scss";
.movie_box {
  padding-top: 0.05rem;
  .video_list {
    ul > li {
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
    @include loading_box;

  }
  @include not_find;
}
</style>
