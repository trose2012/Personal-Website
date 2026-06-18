const burger = document.querySelector(".burgerDiv");
const nav = document.querySelector(".elements");

function toggler() {
  nav.classList.toggle("active");
  burger.classList.toggle("active");
}

burger.addEventListener("click", toggler);

function updateSmartStatus() {
  const statusText = document.getElementById('status-text');
  const statusDot = document.querySelector('.status-dot');
  const statusIcon = document.getElementById('status-icon');
  const statusDetail = document.getElementById('status-detail');

  const LASTFM_USER = "trose2012"; 
  const LASTFM_API_KEY = "95c6adebfda88ca3c8bb8644c0e6a996";
  const DISCORD_ID = "963520338442997850";

  // 1. Check Music First via Last.fm
  fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USER}&api_key=${LASTFM_API_KEY}&format=json&limit=1`)
    .then(res => res.json())
    .then(musicData => {
      const latestTrack = musicData.recenttracks.track[0];
      const isPlayingNow = latestTrack && latestTrack['@attr'] && latestTrack['@attr'].nowplaying === 'true';

      if (isPlayingNow) {
        statusDot.style.backgroundColor = '#1db954'; // Spotify Green
        statusIcon.src = '/assets/spotify-logo.svg';
        statusIcon.style.display = 'inline-block';
        statusText.innerText = `${latestTrack.name}`;
        
        statusDetail.style.cursor = 'pointer';
        statusDetail.onclick = () => {
          window.open(`https://open.spotify.com/search/${encodeURIComponent(latestTrack.name + ' ' + latestTrack.artist['#text'])}`, '_blank');
        };
        return; // Music is active, exit early!
      }

      // 2. Music is off! Let's check Lanyard for Fortnite / Luna
      fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`)
        .then(res => res.json())
        .then(discordJson => {
          const data = discordJson.data;
          const isDiscordOnline = data.discord_status === 'online' || data.discord_status === 'dnd' || data.discord_status === 'idle';
          
          // Filter out custom statuses so we only get real games/apps
          const realActivities = data.activities.filter(act => act.id !== 'custom');

          // If you are playing Fortnite or running Luna activity
          if (realActivities.length > 0) {
            statusDot.style.backgroundColor = '#2ecc71'; // Gaming Green
            statusIcon.src = 'https://icons.hackclub.com/api/icons/green/game-controller-wired';
            statusIcon.style.display = 'inline-block';
            statusText.innerText = `${realActivities[0].name}`;
            
            statusDetail.style.cursor = 'default';
            statusDetail.onclick = null;
            return;
          }

          // 3. Just plain online (Discord open, no games, no music)
          if (isDiscordOnline) {
            statusDot.style.backgroundColor = '#2ecc71';
            statusIcon.style.display = 'none';
            statusText.innerText = '';
            statusDetail.style.cursor = 'default';
            statusDetail.onclick = null;
            return;
          }

          // 4. Everything is completely off
          statusDot.style.backgroundColor = '#747f8d'; // Grey
          statusIcon.style.display = 'none';
          statusText.innerText = '';
          statusDetail.style.cursor = 'default';
          statusDetail.onclick = null;
        })
        .catch(() => {
          // Lanyard fetch failed
          statusDot.style.backgroundColor = '#747f8d';
          statusIcon.style.display = 'none';
          statusText.innerText = '';
        });
    })
    .catch(() => {
      // Last.fm fetch failed
      statusDot.style.backgroundColor = '#747f8d';
      statusIcon.style.display = 'none';
      statusText.innerText = '';
    });
}

updateSmartStatus();
setInterval(updateSmartStatus, 10000);




let currentFetchController = null;

document.querySelectorAll('.rows a, .rows-highlighted a').forEach(link => {
  link.addEventListener('click', async (e) => {
    e.preventDefault();
    const targetUrl = link.getAttribute('href');
    
    if (currentFetchController) {
      currentFetchController.abort();
    }
    
    currentFetchController = new AbortController();
    const { signal } = currentFetchController;
    
    try {
      document.body.style.opacity = '0';
      
      const response = await fetch(targetUrl, { signal });
      const htmlText = await response.text();
      
      const parser = new DOMParser();
      const newDoc = parser.parseFromString(htmlText, 'text/html');
      
      document.body.innerHTML = newDoc.body.innerHTML;
      history.pushState(null, '', targetUrl);
      
      document.body.style.opacity = '1';
      
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error("Page load failed:", error);
      }
    } finally {
      currentFetchController = null;
    }
  });
});