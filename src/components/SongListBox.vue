<template>
  <li class="song_list_box" @click="toPlayList(item)">
    <div class="img_box">
      <img v-lazy="item.picUrl" alt="" />
      <div class="small_title">
        <i class="iconfont iconsanjiao"></i>
        <span>{{ item.playCount | playcount }}</span>
      </div>
    </div>
    <p>{{ item.name }}</p>
  </li>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  props: {
    item: Object
  },

  methods: {
    ...mapMutations({setPlayList: 'SET_PLAYLIST'}),
    toPlayList (playList) {
      this.$router.push({name: 'songlist', params: {id: playList.id}})
      this.setPlayList(playList)
    }
  },
};
</script>

<style lang="scss" scoped>
@import "~common/scss/variable.scss";
@import "~common/scss/mixin.scss";
.song_list_box {
  @include img_box;
  p {
    font-size: $best-small-font;
    @include text-overflow-clamp;
    line-height: 0.15rem;
    padding-top: 0.05rem;
  }
}
</style>
