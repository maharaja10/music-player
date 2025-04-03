import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentPlaylist, setCurrentPlaylist] = useState([]);
  const [favoriteTracks, setFavoriteTracks] = useState([]);
  const [trackInfo, setTrackInfo] = useState('Select a song to play');

  const trendingTracks = [
    { title: "Friendship Anthem", artist: "Artist A", src: "music/Friendship-Anthem-MassTamilan.io.mp3" },
    { title: "Meherezylaa", artist: "Artist B", src: "music/Meherezylaa-MassTamilan.fm.mp3" },
    { title: "Naan Pizhai", artist: "Artist C", src: "music/Naan-Pizhai-MassTamilan.fm.mp3" },
    { title: "Nenjorathil", artist: "Artist D", src: "music/Nenjorathil-Female.mp3" },
    { title: "Savaal", artist: "Artist E", src: "music/Savaal-MassTamilan.com.mp3" },
    { title: "Thaarame Thaarame", artist: "Artist F", src: "music/Thaarame-Thaarame-MassTamilan.io.mp3" },
    { title: "Thalli Pogathey", artist: "Artist G", src: "music/Thalli-Pogathey.mp3" }
  ];

  const isFavorite = (track) => {
    return favoriteTracks.some(t => t.src === track.src);
  };

  const toggleFavorite = (track) => {
    const existingIndex = favoriteTracks.findIndex(t => t.src === track.src);
    if (existingIndex !== -1) {
      const newFavorites = [...favoriteTracks];
      newFavorites.splice(existingIndex, 1);
      setFavoriteTracks(newFavorites);
    } else {
      setFavoriteTracks([...favoriteTracks, track]);
    }
  };

  const playTrack = (index, playlist) => {
    setCurrentTrackIndex(index);
    setCurrentPlaylist(playlist);
    const track = playlist[index];
    setTrackInfo(Now Playing: ${track.title} by ${track.artist});
    // Assuming you have an audio element with ref audioPlayer
    // audioPlayer.current.src = track.src;
    // audioPlayer.current.play();
  };

  const addToPlaylist = (track) => {
    if (!currentPlaylist.some(t => t.src === track.src)) {
      setCurrentPlaylist([...currentPlaylist, track]);
    }
  };

  const shareTracks = (tracks, type) => {
    if (tracks.length === 0) {
      alert(No ${type} tracks to share!);
      return;
    }

    const trackLinks = tracks.map(track => ${window.location.origin}/${track.src}).join("\n");
    navigator.clipboard.writeText(trackLinks).then(() => {
      alert(${type} link copied!\n\n${trackLinks});
    }).catch(err => {
      console.error("Error copying link: ", err);
      alert("Failed to copy link.");
    });
  };

  return (
    <div id="app">
      <header>My Music Player</header>
      <main>
        <section id="trending">
          <h2>Trending Now</h2>
          <ul id="trendingList">
            {trendingTracks.map((track, index) => (
              <li key={index} className="trackItem">
                <button className="playBtn" onClick={() => playTrack(index, trendingTracks)}>▶</button>
                <span className="trackText">{${track.title} - ${track.artist}}</span>
                <button className="favBtn" onClick={() => toggleFavorite(track)}>
                  {isFavorite(track) ? "❤" : "🤍"}
                </button>
                <button className="addBtn" onClick={() => addToPlaylist(track)}>➕</button>
              </li>
            ))}
          </ul>
        </section>
        <section id="player">
          <h2>Now Playing</h2>
          <p id="trackInfo">{trackInfo}</p>
          <audio id="audioPlayer" controls>
            <source src={currentPlaylist[currentTrackIndex]?.src} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <button id="prevTrack" onClick={() => {
              if (currentTrackIndex > 0) {
                playTrack(currentTrackIndex - 1, currentPlaylist);
              }
            }}>⏮ Prev</button>
            <button id="nextTrack" onClick={() => {
              if (currentTrackIndex < currentPlaylist.length - 1) {
                playTrack(currentTrackIndex + 1, currentPlaylist);
              }
            }}>⏭ Next</button>
          </div>
        </section>
        <section id="playlistAndFavorites">
          <h2>Your Playlist & Favorites</h2>
          <div className="list-container">
            <div className="playlist-section">
              <h3>Your Playlist</h3>
              <ul id="playlistList">
                {currentPlaylist.map((track, index) => (
                  <li key={index} className="trackItem">
                    <button className="playBtn" onClick={() => playTrack(index, currentPlaylist)}>▶</button>
                    <span className="trackText">{${track.title} - ${track.artist}}</span>
                    <button className="removeBtn" onClick={() => {
                      const newPlaylist = [...currentPlaylist];
                      newPlaylist.splice(index, 1);
                      setCurrentPlaylist(newPlaylist);
                    }}>❌</button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="favorites-section">
              <h3>Your Favorites</h3>
              <ul id="favoritesList">
                {favoriteTracks.map((track, index) => (
                  <li key={index} className="trackItem">
                    <button className="playBtn" onClick={() => playTrack(index, favoriteTracks)}>▶</button>
                    <span className="trackText">{${track.title} - ${track.artist}}</span>
                    <button className="removeBtn" onClick={() => {
                      const newFavorites = [...favoriteTracks];
                      newFavorites.splice(index, 1);
                      setFavoriteTracks(newFavorites);
                    }}>❌</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <button id="sharePlaylist" onClick={() => shareTracks(currentPlaylist, "Playlist")}>📤 Share Playlist</button>
          <button id="shareFavourite" onClick={() => shareTracks(favoriteTracks, "Favorite")}>📤 Share Favorite</button>
        </section>
      </main>
    </div>
  );
};

export default App;