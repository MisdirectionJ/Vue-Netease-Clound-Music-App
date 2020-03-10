<template>
  <div class="artists_box">
    <div class="singer_list">
      <ul>
        <li
          v-for="(item, index) in artists"
          :key="index"
          @click="toSingerDetil(item)"
        >
          <div class="singer">
            <div class="img_box">
              <img v-lazy="item.img1v1Url" alt="" />
            </div>
            <p class="name">
              {{ item.name
              }}<span v-if="item.alias.length"> ({{ item.alias[0] }})</span>
            </p>
          </div>
          <div class="user_singer" v-if="item.accountId">
            <i class="iconfont iconwo"></i>
            <span>已入驻</span>
          </div>
        </li>
      </ul>
      <Loading v-if="isLoading"></Loading>
    </div>
    <div class="not_find" v-if="canNotFind">未找到与"{{ word }}"相关的内容</div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import Loading from "components/Loading";

export default {
  created() {
    this.getArtists();
  },
  computed: {
    ...mapState(["word"])
  },
  props: {
    singerFlag: Boolean
  },
  activated() {
    this.$emit("initPullUp");
  },
  watch: {
    word() {
      this.getArtists();
    },
    singerFlag(val) {
      if (!this.offset) {
        this.$emit("initPullUp");
        return;
      }
      if (this.flag && val) {
        this.getMovieList();
      }
    }
  },
  components: {
    Loading
  },
  data() {
    return {
      artists: [],
      canNotFind: false,
      offset: 0,
      isLoading: false,
      flag: true
    };
  },
  methods: {
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
    },
    async getMovieList() {
      if (!this.flag) return;
      this.isLoading = true;
      const { result } = await this.$getAxios(
        `/search?keywords=${this.word}&type=100&offset=${this.offset * 30}`
      );
      if (!result || !result.artists || !result.artists.length) {
        this.flag = false;
        this.isLoading = false;
        return;
      }
      this.isLoading = false;
      this.artists = this.artists.concat(result.artists);
      this.offset++;
      this.$emit("initPullUp");
    },
    async getArtists() {
      Object.assign(this.$data, this.$options.data());
      this.$emit("startLoading", true);
      const { result } = await this.$getAxios(
        `/search?keywords=${this.word}&type=100`
      );
      if (result && result.artists && result.artists.length) {
        this.offset++;
        this.$emit("startLoading", false);
        this.artists = result.artists;
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
@import "~common/scss/variable.scss";
@import "~common/scss/mixin.scss";
.artists_box {
  .singer_list {
    @include search_header;
    ul {
      > li {
        justify-content: space-between;
        @include small_artlist_box(0.5rem, 50%);
        margin-bottom: 0.1rem;
        .singer {
          display: flex;
          p {
            width: calc(100vw - 1.5rem);
            @include text-overflow-one;
            line-height: 0.5rem;
            margin: 0;
            font-size: $normal-font;
            span {
              color: $noselect-color;
            }
          }
        }
        .user_singer {
          font-size: $best-small-font;
          box-sizing: border-box;
          transform: scale(0.8);
          .iconfont {
            font-size: $best-small-font;
            margin-right: 0.05rem;
            display: inline-block;
            width: 0.2rem;
            line-height: 0.2rem;
            text-align: center;
            height: 0.2rem;
            border-radius: 50%;
            background: $main-background;
            color: #fff;
          }
          span {
            line-height: 0.5rem;
            color: $nofind-color;
          }
        }
      }
    }
    @include loading_box;
  }
  @include not_find;
}
</style>
