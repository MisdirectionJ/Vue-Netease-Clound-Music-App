<template>
  <ul v-if="commendSongList.length">
    <li 
      class="new_song"
      v-for="item in commendSongList.slice(0, 3)"
      :key="item.id"
    >
      <div class="img_box">
        <img v-lazy="item.picUrl" alt="" />
        <div class="small_box">
          <i class="iconfont iconfullsanjiao"></i>
        </div>
      </div>
      <p class="song_name">
        {{ item.song.name }}
      </p>
      <p class="artist_name">
        {{ item.song.artists.map(items => items.name).join("/") }}
      </p>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    commendSongList: Array
  }
};
</script>

<style lang="scss" scoped>
@import "~common/scss/mixin.scss";
@import "~common/scss/variable.scss";

.new_song {
  @include img_box;
  p {
    @include text-overflow-one;
  }
  .song_name {
    font-size: 0.13rem;
    padding: 0.05rem 0 0.03rem 0;
  }
  .artist_name {
    font-size: $best-small-font;
    color: $noselect-color;
  }
  .img_box {
    position: relative;
    .small_box {
      position: absolute;
      right: 0.05rem;
      bottom: 0.05rem;
      width: 0.2rem;
      height: 0.2rem;
      background-color: rgba(255, 255, 255, 0.9);
      border-radius: 50%;
      line-height: 0.2rem;
      .iconfont {
        position: absolute;
        left: 55%;
        top: 50%;
        transform: translate(-50%, -50%);
        color: $main-background;
        font-size: $best-small-font;
      }
    }
  }
}
</style>
