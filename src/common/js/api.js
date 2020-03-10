import {get} from './client'

export async function checkSongCanUse (id) {
     try {
        const res = await get('/check/music?id=' + id)
        return res
     } catch {
         return {succes: false}
     }
}

export async function getAudioSrc (list){
    try {
        const res = await get('/song/url?id=' + list.join(','))
        return res
    }catch {
        return
    }
}
