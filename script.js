// 🔑 Pexels API Key (FREE mein yahan se lein: https://www.pexels.com/api/)
// Account banakar "Get API Key" par click karein aur niche apni key paste karein
const API_KEY = "GAmVUNHmWkJeOsZxMuL63mL7yhkGU15azsDkjF9InmO5SRuyx4KJmRxj";
const API_URL = "https://api.pexels.com/videos/popular?per_page=15&orientation=portrait";

const videoFeed = document.getElementById('videoFeed');
const loader = document.getElementById('loader');

// Videos Load Karne Ka Function
async function loadVideos() {
  try {
    loader.style.display = 'block';
    
    const response = await fetch(API_URL, {
      headers: {
        'Authorization': API_KEY
      }
    });
    
    const data = await response.json();
    
    // Loader hide karo
    loader.style.display = 'none';
    
    // Videos render karo
    renderVideos(data.videos);
    
  } catch (error) {
    console.error('Error:', error);
    loader.innerHTML = '<p style="color:#ff4444;">⚠️ Error loading videos. Check API Key!</p>';
  }
}

// Videos Display Karne Ka Function
function renderVideos(videos) {
  videoFeed.innerHTML = ''; // Purane videos hatao
  
  videos.forEach((video, index) => {
    // HD quality video link dhundo
    const hdFile = video.video_files.find(f => f.quality === 'hd' && f.file_type === 'video/mp4') 
                || video.video_files[0];
    
    const videoCard = document.createElement('div');
    videoCard.className = 'video-card';
    
    videoCard.innerHTML = `
      <video 
        src="${hdFile.link}" 
        poster="${video.image}" 
        loop         muted 
        playsinline
        preload="metadata">
      </video>
      
      <div class="video-info">
        <div class="video-title">Drama Episode ${index + 1}</div>
        <div class="video-creator">🎭 ${video.user.name}</div>
      </div>
      
      <div class="video-actions">
        <button class="action-btn" onclick="toggleLike(this)">❤️</button>
        <button class="action-btn" onclick="shareVideo('${hdFile.link}')">📤</button>
        <button class="action-btn" onclick="toggleMute(this)">🔇</button>
      </div>
    `;
    
    videoFeed.appendChild(videoCard);
  });
  
  // Auto-play setup
  setupAutoPlay();
}

// Auto-Play Jab Video Screen Par Aaye
function setupAutoPlay() {
  const videos = document.querySelectorAll('.video-card video');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      if (entry.isIntersecting) {
        video.play().catch(e => console.log('Auto-play blocked'));
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, { threshold: 0.7 });
  
  videos.forEach(video => observer.observe(video));
}

// Like Button Toggle
function toggleLike(btn) {
  btn.style.background = btn.style.background ? '' : '#ff006e';
}

// Share Video
function shareVideo(url) {  if (navigator.share) {
    navigator.share({
      title: 'Check out this drama!',
      url: url
    });
  } else {
    alert('Video Link: ' + url);
  }
}

// Mute/Unmute
function toggleMute(btn) {
  const video = btn.closest('.video-card').querySelector('video');
  video.muted = !video.muted;
  btn.textContent = video.muted ? '🔇' : '🔊';
}

// Page Load Hote Hi Videos Fetch Karo
window.addEventListener('load', loadVideos);
