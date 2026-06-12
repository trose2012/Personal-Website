const burger = document.querySelector(".burgerDiv");
const nav = document.querySelector(".elements");

function toggler() {
  nav.classList.toggle("active");
  burger.classList.toggle("active");
}

burger.addEventListener("click", toggler);

function updateStatus() {
  fetch('https://api.lanyard.rest/v1/users/963520338442997850')
    .then(response => response.json())
    .then(json => {
      const data = json.data;
      const statusText = document.getElementById('status-text');
      const statusDot = document.querySelector('.status-dot');
      const statusIcon = document.getElementById('status-icon');

      const realActivities = data.activities.filter(act => act.id !== 'custom');

      // 1. Check Spotify first
      if (data.listening_to_spotify) {
        statusIcon.src = '/assets/spotify-logo.svg';
        statusIcon.style.display = 'inline-block';
        statusText.innerText = `${data.spotify.song} by ${data.spotify.artist}`;
        statusDot.style.backgroundColor = '#1db954';
      } 
      // 2. Gaming check
      else if (realActivities.length > 0) {
        statusDot.style.backgroundColor = '#2ecc71'; 
        statusIcon.src = 'https://icons.hackclub.com/api/icons/green/game-controller-wired';
        statusIcon.style.display = 'inline-block';
        statusText.innerText = `${realActivities[0].name}`;
      }
      // 3. Plain Online check
      else if (data.discord_status === 'online') {
        statusDot.style.backgroundColor = '#2ecc71';
        statusText.innerText = '';
        statusIcon.style.display = 'none';
      }
      // 4. Offline fallback
      else {
        statusText.innerText = ''; 
        statusDot.style.backgroundColor = '#747f8d';
        statusIcon.style.display = 'none';
      }
    });
}

// Run it immediately when the page first boots up
updateStatus();

// Then automatically rerun it every 5000 milliseconds (5 seconds)
setInterval(updateStatus, 5000);