import { songsList } from '../data/songs.js';
import Playinfo from './play-info.js';
import TrackBar from './track-bar.js'

const Playlist = (_ => {
    //data
    let songs = songsList;
    let currentlyPlayingIndex = 0;
    let currentSong = new Audio(songs[currentlyPlayingIndex].url);
    //cache DOM
    const playlistEl = document.querySelector('.playlist');

    const init = _ => {
        render();
        listeners();
        Playinfo.setState({
            songsLength: songs.length,
            isPlaying: !currentSong.paused
        })
    }

    const flip = _ => {
        togglePlayPause();
        render();
    }

    const changeAudioSrc = _ => {
        currentSong.src = songs[currentlyPlayingIndex].url;
    }

    const togglePlayPause = _ => {
        currentSong.paused ? currentSong.play() : currentSong.pause();
    }

    const mainPlay = clickedIndex => {
        if (currentlyPlayingIndex === clickedIndex) {
            //toggle play pause
            togglePlayPause();
        } else {
            //change src
            currentlyPlayingIndex = clickedIndex;
            changeAudioSrc();
            togglePlayPause();
        }
        Playinfo.setState({
            songsLength: songs.length,
            isPlaying: !currentSong.paused
        })
    }

    const playNext = _ => {
        if (songs[currentlyPlayingIndex + 1]) {
            currentlyPlayingIndex++;
            changeAudioSrc();
            togglePlayPause();
            render();
        }
    }

    const listeners = _ => {
        playlistEl.addEventListener("click", event => {
            if (event.target && event.target.matches('.fa')) {
                const listElem = event.target.parentNode.parentNode;
                const listElemIndex = [...listElem.parentElement.children].indexOf(listElem);
                mainPlay(listElemIndex);
                render();
            }
        })

        currentSong.addEventListener("timeupdate", _ => {
            TrackBar.setState(currentSong);
        })

        currentSong.addEventListener("ended", _ => {
            playNext();
        })
    }

    const toggleIcon = itemIndex => {
        if (currentlyPlayingIndex === itemIndex) {
            return currentSong.paused ? 'fa-play' : 'fa-pause';
        } else {
            return 'fa-play';
        }
    }

    const render = _ => {
        let markup = '';

        songs.forEach((songObj, index) => {
            markup += `
        <li class="playlist__song ${index === currentlyPlayingIndex? 'playlist__song--active': ''}">
            <div class="play-pause">
                <i class="fa ${toggleIcon(index)} pp-icon"></i>
            </div>
            <div class="playlist__details">
                <span class="playlist__song-name">${songObj.title}</span>
                <br>
                <span class="playlist__song-artist">${songObj.artist}</span>
            </div>
            <div class="playlist__song-duration">${songObj.time}</div>
        </li>
      `;
        });

        playlistEl.innerHTML = markup;
    }

    return {
        init,
        flip
    }

})();
export default Playlist;