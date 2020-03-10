const replay = (state, length) => {
  const index = Math.floor(Math.random() * length);
  if (state.songIndex === index) replay(state, length);
  else state.songIndex = index;
};
import {
  SEARCH_WORD,
  LRC_BOX_FLAG,
  SET_AUDIO,
  CHANGE_SONG_LIST_FLAG,
  REMOVE_SONG_LIST,
  SEND_ALLSONGS,
  PLAY_MEHODS,
  SELECT_SONG,
  REMOVE_ONG_SONG,
  AUDIO_BOX_FLAG,
  SET_PLAYLIST,
  SET_SINGERID,
  SET_USERID,
  SET_CHECKARTLIST,
  SETREMOVE_ALERT_FLAG
} from "./mutation-types";
export default {
  [SEARCH_WORD](state, payload) {
    state.word = payload;
  },
  [LRC_BOX_FLAG](state) {
    state.lrcFlag = !state.lrcFlag;
  },
  [SET_AUDIO](state, payload) {
    state.audio = payload;
  },
  [SET_USERID](state, payload) {
    state.otherUserId = payload;
  },
  [SET_CHECKARTLIST](state, payload) {
    state.checkSingerArtlist = payload;
  },
  [SET_SINGERID](state, payload) {
    state.singerId = payload;
  },
  [SETREMOVE_ALERT_FLAG](state, {el ,flag}) {
    if(!flag) state.fullRemoveFlag = false
    state[el] = flag;
  },
  [AUDIO_BOX_FLAG](state, payload) {
    state.audioBoxFlag = payload;
  },
  [CHANGE_SONG_LIST_FLAG](state) {
    state.smalllistFlag = !state.smalllistFlag;
  },
  [SET_PLAYLIST](state, payload) {
    state.playListDetil = payload;
  },
  [REMOVE_SONG_LIST](state) {
    state.songUrl = "";
    state.removePlayListFlag = state.fullRemoveFlag = state.smalllistFlag = state.audioBoxFlag = false;
    state.songId = null;
    state.songIndex = 0;
    state.audioList = state.songList = [];
  },
  [SEND_ALLSONGS](state, { songList, _flag, _index }) {
    state.songIndex = _index || 0;
    state.songList = songList;
    if (!_flag) return;
    state.songId = null;
    state.songUrl = "";
    state.audioBoxFlag = true;
  },
  [PLAY_MEHODS](state) {
    if (state.pattern.method === "repeat")
      return (state.pattern = {
        method: "single",
        icon: "iconsingle",
        message: "单曲循环"
      });
    else if (state.pattern.method === "single")
      return (state.pattern = {
        method: "random",
        icon: "iconsuiji",
        message: "随机播放"
      });
    else
      state.pattern = {
        method: "repeat",
        icon: "iconxunhuan",
        message: "列表循环"
      };
  },
  [SELECT_SONG](state, payload) {
    if (
      state.pattern.method === "repeat" ||
      state.pattern.method === "single"
    ) {
      if (payload) {
        if (state.songIndex-- <= 0) {
          state.songIndex = state.songList.length - 1;
        }
      } else {
        if (state.songIndex++ >= state.songList.length - 1) {
          state.songIndex = 0;
        }
      }
      return;
    }
    if (state.pattern.method === "random") {
      const length = state.songList.length;
      replay(state, length);
    }
  },
  [REMOVE_ONG_SONG](state) {
    const index = state.songList.findIndex(item => item.id === state.songId);
    if (index > -1) state.songIndex = index;
  }
};
