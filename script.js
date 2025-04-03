document.addEventListener("DOMContentLoaded", () => {
    const trendingList = document.getElementById("trendingList");
    const playlistList = document.getElementById("playlistList");
    const favoritesList = document.getElementById("favoritesList");
    const audioPlayer = document.getElementById("audioPlayer");
    const trackInfo = document.getElementById("trackInfo");
    const prevTrackBtn = document.getElementById("prevTrack");
    const nextTrackBtn = document.getElementById("nextTrack");
    const sharePlaylistBtn = document.getElementById("sharePlaylist");
    const shareFavoriteBtn = document.getElementById("shareFavourite");

    let currentTrackIndex = 0;
    let currentPlaylist = [];
    let favoriteTracks = [];

    const trendingTracks = [
        { title: "Friendship Anthem", artist: "Artist A", src: "music/Friendship-Anthem-MassTamilan.io.mp3" },
        { title: "Meherezylaa", artist: "Artist B", src: "music/Meherezylaa-MassTamilan.fm.mp3" },
        { title: "Naan Pizhai", artist: "Artist C", src: "music/Naan-Pizhai-MassTamilan.fm.mp3" },
        { title: "Nenjorathil", artist: "Artist D", src: "music/Nenjorathil-Female.mp3" },
        { title: "Savaal", artist: "Artist E", src: "music/Savaal-MassTamilan.com.mp3" },
        { title: "Thaarame Thaarame", artist: "Artist F", src: "music/Thaarame-Thaarame-MassTamilan.io.mp3" },
        { title: "Thalli Pogathey", artist: "Artist G", src: "music/Thalli-Pogathey.mp3" }
    ];

    function loadTrendingTracks() {
        trendingList.innerHTML = "";
        trendingTracks.forEach((track, index) => {
            const li = createTrackItem(track, index, trendingTracks);
            trendingList.appendChild(li);
        });
    }

    function createTrackItem(track, index, sourcePlaylist) {
        const li = document.createElement("li");
        li.classList.add("trackItem");

        const playBtn = document.createElement("button");
        playBtn.textContent = "▶";
        playBtn.classList.add("playBtn");
        playBtn.addEventListener("click", () => playTrack(index, sourcePlaylist));

        const trackInfoSpan = document.createElement("span");
        trackInfoSpan.textContent = `${track.title} - ${track.artist}`;
        trackInfoSpan.classList.add("trackText");

        const favBtn = document.createElement("button");
        favBtn.textContent = isFavorite(track) ? "❤️" : "🤍";
        favBtn.classList.add("favBtn");
        favBtn.addEventListener("click", () => toggleFavorite(track, favBtn));

        const addBtn = document.createElement("button");
        addBtn.textContent = "➕";
        addBtn.classList.add("addBtn");
        addBtn.addEventListener("click", () => addToPlaylist(track));

        li.append(playBtn, trackInfoSpan, favBtn, addBtn);
        return li;
    }

    function addToPlaylist(track) {
        if (!currentPlaylist.some(t => t.src === track.src)) {
            currentPlaylist.push(track);
            updatePlaylistUI();
        }
    }

    function updatePlaylistUI() {
        playlistList.innerHTML = "";
        currentPlaylist.forEach((track, index) => {
            const li = createPlaylistItem(track, index, currentPlaylist, "playlist");
            playlistList.appendChild(li);
        });
    }

    function createPlaylistItem(track, index, sourcePlaylist, type) {
        const li = document.createElement("li");
        li.classList.add("trackItem");

        const playBtn = document.createElement("button");
        playBtn.textContent = "▶";
        playBtn.classList.add("playBtn");
        playBtn.addEventListener("click", () => playTrack(index, sourcePlaylist));

        const trackInfoSpan = document.createElement("span");
        trackInfoSpan.textContent = `${track.title} - ${track.artist}`;
        trackInfoSpan.classList.add("trackText");

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "❌";
        removeBtn.classList.add("removeBtn");
        removeBtn.addEventListener("click", () => {
            sourcePlaylist.splice(index, 1);
            if (type === "playlist") updatePlaylistUI();
            else updateFavoritesUI();
        });

        li.append(playBtn, trackInfoSpan, removeBtn);
        return li;
    }

    function toggleFavorite(track, btn) {
        const existingIndex = favoriteTracks.findIndex(t => t.src === track.src);
        if (existingIndex !== -1) {
            favoriteTracks.splice(existingIndex, 1);
            btn.textContent = "🤍";
        } else {
            favoriteTracks.push(track);
            btn.textContent = "❤️";
        }
        updateFavoritesUI();
    }

    function isFavorite(track) {
        return favoriteTracks.some(t => t.src === track.src);
    }

    function updateFavoritesUI() {
        favoritesList.innerHTML = "";
        favoriteTracks.forEach((track, index) => {
            const li = createPlaylistItem(track, index, favoriteTracks, "favorite");
            favoritesList.appendChild(li);
        });
    }

    function playTrack(index, playlist) {
        currentTrackIndex = index;
        currentPlaylist = playlist;
        const track = playlist[index];
        audioPlayer.src = track.src;
        audioPlayer.play();
        trackInfo.textContent = `Now Playing: ${track.title} by ${track.artist}`;
    }

    function shareTracks(tracks, type) {
        if (tracks.length === 0) {
            alert(`No ${type} tracks to share!`);
            return;
        }

        const trackLinks = tracks.map(track => `${window.location.origin}/${track.src}`).join("\n");
        navigator.clipboard.writeText(trackLinks).then(() => {
            alert(`${type} link copied!\n\n${trackLinks}`);
        }).catch(err => {
            console.error("Error copying link: ", err);
            alert("Failed to copy link.");
        });
    }

    sharePlaylistBtn.addEventListener("click", () => shareTracks(currentPlaylist, "Playlist"));
    shareFavoriteBtn.addEventListener("click", () => shareTracks(favoriteTracks, "Favorite"));

    prevTrackBtn.addEventListener("click", () => {
        if (currentTrackIndex > 0) {
            playTrack(currentTrackIndex - 1, currentPlaylist);
        }
    });

    nextTrackBtn.addEventListener("click", () => {
        if (currentTrackIndex < currentPlaylist.length - 1) {
            playTrack(currentTrackIndex + 1, currentPlaylist);
        }
    });

    audioPlayer.addEventListener("ended", () => {
        if (currentTrackIndex < currentPlaylist.length - 1) {
            playTrack(currentTrackIndex + 1, currentPlaylist);
        }
    });

    loadTrendingTracks();
});
