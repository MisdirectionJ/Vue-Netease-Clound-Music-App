import { checkSongCanUse, getAudioSrc } from "common/js/api";
const errorFun = (state, dispatch, commit) => {
  state.songList.splice(state.songIndex, 1);
  if (!state.songList.length) return commit("REMOVE_SONG_LIST");
  if (state.songList.length === 1) return { init: true };
  if (state.songList.length > 1) {
    if (state.songIndex === state.songList.length) {
      commit("SELECT_SONG", false);
      dispatch("checkSong");
    } else {
      dispatch("checkSong", state.songIndex);
    }
  }
};

export default {
  async checkSong({ state, dispatch, commit }, payload) {
    if (payload === 0 || payload) {
      state.songIndex = payload;
    }
    const id = state.songList[state.songIndex].id;
    const { success } = await checkSongCanUse(id);
    if (!success) return errorFun(state, dispatch, commit);
    const index = state.audioList.findIndex(item => item.id === id);
    state.songUrl = state.audioList[index].url;
    if (!state.songUrl) return errorFun(state, dispatch, commit);
    state.songId = id;
  },

  async getAudioSrcList({ state, dispatch }) {
    const { data } = await getAudioSrc(state.songList.map(item => item.id));
    state.audioList = data;
    dispatch("checkSong");
  },
  async getOneAudio({ state, dispatch }, payload) {
    const {data}= await getAudioSrc([payload.id]);
    state.audioList.push(data[0]);
    if(payload._flag) {
    dispatch("checkSong", payload._index);
    }
  }
};
