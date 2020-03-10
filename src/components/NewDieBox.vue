<template>
  <ul>
    <li class="new_die" v-for="item in albums" :key="item.id">
      <div class="img_box">
        <img v-lazy="item.picUrl" alt="" />
        <div class=""></div>
      </div>
      <p class="album_name">
        {{ item.name
        }}<span v-if="item.transNames">{{
          "(" + item.transNames[0] + ")"
        }}</span>
      </p>
      <p class="artist_name">
        {{ item.artists.map(items => items.name).join("/") }}
      </p>
    </li>
  </ul>
</template>
<script>
export default {
  props: {
    albums: Array
  }
};
</script>
<style lang="scss" scoped>
@import "~common/scss/mixin.scss";
@import "~common/scss/variable.scss";

.new_die {
  @include img_box;
  p {
    @include text-overflow-one;
  }
  .album_name {
    font-size: 0.13rem;
    padding: 0.05rem 0 0.01rem 0;
  }
  .artist_name {
    font-size: $best-small-font;
    color: $noselect-color;
    padding: 0.03rem 0 0.02rem 0;
  }
}
</style>
