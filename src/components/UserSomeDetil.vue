<template>
  <div class="content">
    <div v-show="playlist.length">
      <div class="listen_cont">
        <div class="bg">
          <i class="iconfont icontop"></i>
        </div>
        <div class="name">
          <p>
            听歌排行
          </p>
          <p class="list_message">累计听歌{{ listenSongs }}首</p>
        </div>
      </div>
      <div class="listen_cont">
        <div class="bg heart">
          <i class="iconfont iconfull_heart"></i>
        </div>
        <div
          class="name"
          v-for="item in playlist.slice(0, 1)"
          :key="item.id"
          @click="toPlayList(item)"
        >
          <p>
            {{ item.userId === userId ? "我喜欢的音乐" : item.name }}
          </p>
          <p class="list_message">
            {{ item.trackCount }}首, 播放{{ item.playCount }}次
          </p>
        </div>
      </div>
      <div class="create_list" v-if="profile.playlistCount > 1">
        <h5>
          创建的歌单
          <span
            >({{ profile.playlistCount - 1 }}个, 被收藏{{
              profile.playlistBeSubscribedCount
            }}次)</span
          >
        </h5>
        <ul>
          <li
            @click="toPlayList(item)"
            v-for="item in playlist.slice(1, profile.playlistCount)"
            :key="item.id"
          >
            <div class="item_box">
              <div class="img_box">
                <img v-lazy="item.coverImgUrl" alt="" />
              </div>
              <div class="name">
                <p>{{ item.name }}</p>
                <p class="list_message">
                  {{ item.trackCount }}首, 播放{{
                    item.playCount | playcount
                  }}次
                </p>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="create_list" v-if="playlist.length > profile.playlistCount">
        <h5>
          收藏的歌单
          <span>({{ playlist.length - profile.playlistCount }})</span>
        </h5>
        <ul>
          <li
            @click="toPlayList(item)"
            v-for="item in playlist.slice(profile.playlistCount)"
            :key="item.id"
          >
            <div class="item_box">
              <div class="img_box">
                <img v-lazy="item.coverImgUrl" alt="" />
              </div>
              <div class="name">
                <p>{{ item.name }}</p>
                <p class="list_message">
                  {{ item.trackCount }}首 by {{ item.creator.nickname }}
                </p>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="user_time">
        <h5>基本信息</h5>
        <p>
          村龄: {{ Math.floor(createDays / 365) }}年 ({{
            createTime | createDate
          }}注册)
        </p>
        <p v-if="profile.signature && profile.signature.length">简介: {{ profile.signature }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      playlist: [],
      id: null,
    };
  },
  props: {
    profile: Object,
    listenSongs: Number,
    createTime: Number,
    createDays: Number
  },

  filters: {
    createDate(val) {
      const d = new Date(val);
      return d.getFullYear() + "年" + (d.getMonth() + 1 + "月");
    }
  },
  created() {
    this.getUserPlayList();
  },
    activated() {
    if (this.$route.params.id === this.id) return;
    else {
      Object.assign(this.$data, this.$options.data());
      this.getUserPlayList();
    }
  },
  computed: {
    ...mapState(["userId"])
  },
  methods: {
    ...mapMutations({setPlayList: 'SET_PLAYLIST'}),
    toPlayList (playList) {
        this.setPlayList(playList)
        this.$router.push({ name: 'songlist', params: { id: playList.id } })
    },
    async getUserPlayList() {
      this.id = this.$route.params.id
      this.$emit('changeLoading', true)
      const { playlist } = await this.$getAxios(
        "/user/playlist?uid=" + this.$route.params.id
      );
      this.$emit('changeLoading', false)

      this.playlist = playlist;
    },
  }
};
</script>

<style lang="scss" scoped>
@import "~common/scss/variable.scss";
@import "~common/scss/mixin.scss";
.content {
  .listen_cont {
    display: flex;
    padding: 0.15rem 0.1rem 0;
    .bg {
      width: 0.5rem;
      height: 0.5rem;
      background-color: rgba(243, 135, 122, 0.8);
      border-radius: 0.05rem;
      text-align: center;
      line-height: 0.5rem;
      margin-right: 0.1rem;
      .iconfont {
        font-size: 0.3rem;
        color: #fff;
      }
    }
    .heart {
      background-color: #f6edee;
      .iconfont {
        color: $main-background;
      }
    }
    @include play_list(0.1rem);
    .name {
      width: calc(100vw - 0.9rem);
    }
  }
  .create_list {
    margin-top: 0.3rem;
    padding: 0 0.1rem;
    h5 {
      margin: 0;
      font-size: $normal-font;
      span {
        color: #999;
        font-weight: normal;
        font-size: 0.12rem;
        margin-left: 0.05rem;
      }
    }
    > ul {
      margin-top: 0.1rem;
      > li {
        height: 0.5rem;
        display: flex;
        justify-content: space-between;
        box-sizing: border-box;
        padding-left: 0.05rem;
        margin-bottom: 0.1rem;
        line-height: 0.5rem;
        .iconfont {
          color: #999;
        }
        .item_box {
          @include small_artlist_box(0.5rem, 0.05rem);
          width: 100%;
          @include play_list(0.1rem);
          .name {
            width: calc(100vw - 0.9rem);
          }
        }
      }
    }
  }
  .user_time {
      margin-top: 0.2rem;
    padding: 0 0.1rem;
    h5 {
      margin: 0;
      height: 0.3rem;
      line-height: 0.3rem;
      font-size: 0.13rem;
    }
    p {
      margin: 0;
      margin-top: 0.05rem;
      color: #808080;
      line-height: 0.18rem;
      font-size: 0.12rem;
    }
  }
}
</style>
