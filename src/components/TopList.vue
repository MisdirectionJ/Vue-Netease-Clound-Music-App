<template>
  <div class="top_box">
    <TopHeader>
      <template #left>
        <i @click="$router.back()" class="iconfont iconleft"></i>
        排行榜
      </template>
    </TopHeader>
    <div class="wrapper" ref="wrapper">
      <div class="scroll_box" v-show="list.length">
        <div class="official">
          <h5 class="title">官方榜</h5>
          <ul>
            <li
              :key="item.id"
              v-for="item in list.slice(0, 4)"
              @click="toPlayList(item)"
            >
              <div class="img_box">
                <img :src="item.coverImgUrl || item.coverUrl" alt="" />
                <div class="update">
                  <span>{{ item.updateFrequency }}</span>
                </div>
              </div>
              <div class="song">
                <p
                  v-for="(lis, index) in item.tracks || item.artists"
                  :key="index"
                >
                  {{ index + 1 + "." + lis.first + " - " + lis.second }}
                </p>
              </div>
            </li>
          </ul>
        </div>
        <div class="commend">
          <h5>推荐榜</h5>
          <ul>
            <li
              :key="item.id"
              v-for="item in list.slice(4, 10)"
              @click="toPlayList(item)"
            >
              <div class="img_box">
                <img :src="item.coverImgUrl || item.coverUrl" alt="" />
                <div class="update">
                  <span>{{ item.updateFrequency }}</span>
                </div>
              </div>
              <p>{{ item.name }}</p>
            </li>
          </ul>
        </div>
        <div class="all_word">
          <h5>全球榜</h5>
          <ul>
            <li
              :key="item.id"
              v-for="item in list.slice(10, 16)"
              @click="toPlayList(item)"
            >
              <div class="img_box">
                <img :src="item.coverImgUrl || item.coverUrl" alt="" />
                <div class="update">
                  <span>{{ item.updateFrequency }}</span>
                </div>
              </div>
              <p>{{ item.name }}</p>
            </li>
          </ul>
        </div>
        <div class="more">
          <h5>更多榜单</h5>
          <ul>
            <li
              :key="item.id"
              v-for="item in list.slice(16)"
              @click="toPlayList(item)"
            >
              <div class="img_box">
                <img :src="item.coverImgUrl || item.coverUrl" alt="" />
                <div class="update">
                  <span>{{ item.updateFrequency }}</span>
                </div>
              </div>
              <p>{{ item.name }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <Loading v-if="!list.length"></Loading>
  </div>
</template>
<script>
import TopHeader from "components/TopHeader";
import Loading from "components/Loading";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      list: []
    };
  },
  components: {
    TopHeader,
    Loading
  },
  mounted() {
    this.$scroll(this, this.$refs.wrapper);
  },
  created() {
    this.getTopList();
  },
  methods: {
    ...mapMutations({ setPlayList: "SET_PLAYLIST" }),
    toPlayList(playList) {
      if (playList.artists) this.$router.push('/home/topsinger')
      if (!playList.id) return;
      this.$router.push({ name: "songlist", params: { id: playList.id } });
      this.setPlayList(playList);
    },
    async getTopList() {
      const { list, artistToplist, rewardToplist } = await this.$getAxios(
        "/toplist/detail"
      );
      this.list = list;
      this.list.push(artistToplist, rewardToplist);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~common/scss/variable.scss";
@import "~common/scss/mixin.scss";
.top_box {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  .wrapper {
    overflow: hidden;
    height: calc(100vh - 0.5rem);
    .scroll_box {
      padding: 0.2rem 0.1rem 0.5rem;
      .official {
        h5 {
          font-size: 0.13rem;
          margin: 0 0 0.1rem 0;
        }
        ul > li {
          margin-bottom: 0.1rem;
          @include small_artlist_box(0.8rem, 0.03rem);
          .img_box {
            position: relative;
            .update {
              font-size: 0.12rem;
              position: absolute;
              color: #fff;
              bottom: 0.05rem;
              span {
                display: block;
                transform: scale(0.8);
              }
            }
          }
          .song {
            width: calc(100vw - 1.1rem);
            p {
              @include text-overflow-one;
              margin: 0;
              color: #666666;
              font-size: 0.12rem;
              line-height: calc(0.8rem / 3);
            }
          }
        }
      }
      .commend,
      .all_word,
      .more {
        margin-top: 0.2rem;
        h5 {
          font-size: 0.13rem;
          margin: 0 0 0.1rem 0;
        }
        ul {
          display: flex;
          flex-wrap: wrap;

          > li {
            height: 1.2rem;
            width: 0.93rem;

            &:nth-child(3n-1) {
              margin: 0 0.09rem;
            }
            .img_box {
              position: relative;
              width: 100%;
              height: 0.93rem;
              img {
                width: 100%;
                height: 100%;
                border-radius: 0.03rem;
              }
              .update {
                font-size: 0.12rem;
                position: absolute;
                color: #fff;
                bottom: 0.05rem;
                span {
                  display: block;
                  transform: scale(0.8);
                }
              }
            }
            p {
              font-size: $best-small-font;
              width: 100%;
              @include text-overflow-one;
              line-height: 0.2rem;
              margin: 0;
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
