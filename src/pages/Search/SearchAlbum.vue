<template>
  <div class="album_box">
    <div class="album_list">
      <ul>
        <li
          v-for="(item, index) in albums"
          :key="index"
          @click="toAlbumDetil(item)"
        >
          <div class="img_box">
            <img v-lazy="item.picUrl" alt="" />
          </div>
          <div class="name">
            <p class="artist_name">
              专辑:
              {{ item.name }}
              <span v-if="item.alias.length">{{
                " (" + item.alias[0] + ")"
              }}</span>
            </p>
            <p class="message">
              {{ item.artists.map(item => item.name).join("/") }}
            </p>
          </div>
        </li>
      </ul>
      <Loading v-show="isLoading"></Loading>
    </div>
    <div class="not_find" v-if="canNotFind">未找到与"{{ word }}"相关的内容</div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import Loading from "components/Loading";

export default {
  created() {
    this.getAlbums();
  },
  computed: {
    ...mapState(["word"])
  },
  props: {
    albumFlag: Boolean
  },
  activated() {
    this.$emit("initPullUp");
  },
  watch: {
    word() {
      this.getAlbums();
    },
    albumFlag(val) {
      if (!this.offset) {
        this.$emit("initPullUp");
        return;
      }
      if (this.flag && val) {
        this.getAlbumsList();
      }
    }
  },
  components: {
    Loading
  },
  data() {
    return {
      albums: [],
      canNotFind: false,
      offset: 0,
      isLoading: false,
      flag: true
    };
  },
  methods: {
    toAlbumDetil({ id, name, picUrl, publishTime, artists, size }) {
      this.$store.state.albumDetil = {
        id,
        name,
        picUrl,
        publishTime,
        size,
        artlistName: artists[0].name
      };
      this.$router.push({ name: "album", params: { id } });
    },
    async getAlbumsList() {
      if (!this.flag) return;
      this.isLoading = true;
      const { result } = await this.$getAxios(
        `/search?keywords=${this.word}&type=10&offset=${this.offset * 30}`
      );
      if (!result || !result.albums || !result.albums.length) {
        this.flag = false;
        this.isLoading = false;
        return;
      }
      this.isLoading = false;
      this.albums = this.albums.concat(result.albums);
      this.offset++;
      this.$emit("initPullUp");
    },
    async getAlbums() {
      Object.assign(this.$data, this.$options.data());
      this.$emit("startLoading", true);
      const { result } = await this.$getAxios(
        `/search?keywords=${this.word}&type=10`
      );
      if (result && result.albums && result.albums.length) {
        this.offset++;
        this.$emit("startLoading", false);
        this.albums = result.albums;
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
.album_box {
  .album_list {
    ul > li {
      @include small_artlist_box(0.5rem, 0.03rem);
      @include play_list(0.1rem);
      padding-top: 0.1rem;
      .img_box {
        position: relative;
        margin-right: 0.15rem;
        &::after {
          content: "";
          position: absolute;
          top: 0.02rem;
          right: -0.1rem;
          width: 0.1rem;
          height: 0.46rem;
          background-repeat: no-repeat;
          background-size: 1.66rem 0.97rem;
          background-image: url(~common/images/screen.png);
          background-position: 0 -0.3rem;
        }
      }
      .name {
        width: calc(100vw - 0.85rem);
      }
    }
    @include loading_box;
  }
  @include not_find;
}
</style>
