<template>
  <div class="singer_album">
    <header v-show="hotAlbums.length">
      <h5>按发行时间排序</h5>
    </header>
    <ul>
      <li
        class="album_box"
        v-for="(item, index) in hotAlbums"
        :key="index"
        @click="toAlbumDetil(item)"
      >
        <div class="img_box">
          <img v-lazy="item.picUrl" alt="" />
        </div>
        <div class="name">
          <p class="artist_name">
            {{
              item.name + (item.alias.length ? " (" + item.alias[0] + ")" : "")
            }}
          </p>
          <p class="list_message">
            {{ item.publishTime | saleTime }} 歌曲{{ item.size }}
          </p>
        </div>
      </li>
    </ul>
    <Loading v-if="isLoading"></Loading>
  </div>
</template>
<script>
import Loading from "components/Loading";
export default {
  data() {
    return {
      hotAlbums: [],
      offset: 0,
      more: false,
      isLoading: false,
      id: null
    };
  },
  props: {
    albumFlag: Boolean
  },
  components: {
    Loading
  },
  created() {
    this.getAlbum();
  },
  activated() {
    if (this.$route.params.id === this.id) return;
    else {
      Object.assign(this.$data, this.$options.data());
      this.getAlbum();
      this.$emit("initPullUp");
    }
  },
  watch: {
    albumFlag(val) {
      if (!this.offset) {
        this.$emit("initPullUp");
        return;
      }
      if (this.more && val) {
        this.getAlbum();
      }
    }
  },
  methods: {
    async getAlbum() {
      this.id = this.$route.params.id;
      if (this.offset) this.isLoading = true;
      else this.$emit("changeLoading", true);
      const { hotAlbums, more } = await this.$getAxios(
        `/artist/album?id=${this.id}&offset=${this.offset * 30}`
      );
      this.more = more;
      if (this.offset) this.isLoading = false;
      else this.$emit("changeLoading", false);
      if (hotAlbums.length) {
        this.hotAlbums = this.hotAlbums.concat(hotAlbums);
        this.$emit("initPullUp");
        this.offset++;
      }
    },
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
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~common/scss/variable.scss";
@import "~common/scss/mixin.scss";
.singer_album {
  header {
    h5 {
      font-size: $normal-font;
      margin: 0;
      line-height: 0.4rem;
      padding: 0 0.1rem;
    }
  }
  @include loading_box;
  > ul {
    padding: 0 0.1rem;
    > li {
      margin-bottom: 0.1rem;
      @include small_artlist_box(0.5rem, 0.03rem);
      @include play_list(0.1rem);
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
  }
}
</style>
