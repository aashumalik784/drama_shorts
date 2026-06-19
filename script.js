//  YouTube API Key (FREE - yahan se lein: https://console.cloud.google.com/)
// Account banakar YouTube Data API v3 enable karein aur API key copy karein
const YOUTUBE_API_KEY = 'APNI_YOUTUBE_API_KEY_YAHAN_DALEIN';

// Hindi Drama Search Queries
const dramaQueries = {
  popular: 'Hindi dubbed drama serial full episode',
  new: 'new Hindi web series 2024',
  trending: 'trending Hindi drama',
  dubbed: 'Korean drama Hindi dubbed'
};

const dramaGrid = document.getElementById('dramaGrid');
const searchInput = document.getElementById('searchInput');
const tabs = document.querySelectorAll('.tab');
const navItems = document.querySelectorAll('.nav-item');

// Sample Drama Data (Fallback agar API na chale)
const sampleDramas = [
  {
    title: 'Ek Raat Ki Baat Aur Double Shaadi',
    subtitle: 'सभी का लाड़ला',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    videoId: 'dQw4w9WgXcQ',
    views: '3.8M',
    dubbed: true
  },
  {
    title: 'Debt Bound to the Heir',
    subtitle: 'Second Chance',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    videoId: 'dQw4w9WgXcQ',
    views: '708.4K',
    dubbed: false
  },
  {
    title: 'Chhote Pati Ka Pagalpan',
    subtitle: 'फकीर से रईस',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    videoId: 'dQw4w9WgXcQ',
    views: '4.1M',
    dubbed: true
  }
];

// Load Dramas
async function loadDramas(category = 'popular') {
  dramaGrid.innerHTML = '<p style="text-align:center; padding:50px;">Loading...</p>';
  
  try {    const query = dramaQueries[category];
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=${encodeURIComponent(query)}&type=video&key=${YOUTUBE_API_KEY}`
    );
    
    const data = await response.json();
    
    if (data.items) {
      renderDramas(data.items);
    } else {
      renderDramas(sampleDramas);
    }
  } catch (error) {
    console.error('Error:', error);
    renderDramas(sampleDramas);
  }
}

// Render Drama Cards
function renderDramas(videos) {
  dramaGrid.innerHTML = '';
  
  videos.forEach(video => {
    const videoId = video.id?.videoId || video.videoId;
    const thumbnail = video.snippet?.thumbnails?.high?.url || video.thumbnail;
    const title = video.snippet?.title || video.title;
    const views = Math.floor(Math.random() * 5) + 1 + 'M';
    const isDubbed = title.toLowerCase().includes('hindi') || title.toLowerCase().includes('dubbed');
    
    const card = document.createElement('div');
    card.className = 'drama-card';
    card.onclick = () => playVideo(videoId);
    
    card.innerHTML = `
      <div class="drama-poster">
        <img src="${thumbnail}" alt="${title}">
        ${isDubbed ? '<span class="dubbed-badge">Dubbed</span>' : ''}
        <span class="view-count">🔥 ${views}</span>
      </div>
      <div class="drama-title">${title}</div>
      <div class="drama-subtitle">${video.snippet?.channelTitle || 'Hindi Drama'}</div>
    `;
    
    dramaGrid.appendChild(card);
  });
}

// Play Video
function playVideo(videoId) {
  const modal = document.getElementById('videoModal');  const player = document.getElementById('videoPlayer');
  player.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  modal.classList.add('active');
}

// Close Video
function closeVideo() {
  const modal = document.getElementById('videoModal');
  const player = document.getElementById('videoPlayer');
  player.src = '';
  modal.classList.remove('active');
}

// Tab Click
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    loadDramas(tab.dataset.category);
  });
});

// Nav Click
navItems.forEach(item => {
  item.addEventListener('click', () => {
    navItems.forEach(n => n.classList.remove('active'));
    item.classList.add('active');
    showPage(item.dataset.page);
  });
});

// Show Page
function showPage(page) {
  closeMenu();
  if (page === 'home') {
    loadDramas('popular');
  } else if (page === 'mylist') {
    dramaGrid.innerHTML = '<p style="text-align:center; padding:50px;">My List - Coming Soon!</p>';
  } else if (page === 'profile') {
    dramaGrid.innerHTML = '<p style="text-align:center; padding:50px;">Profile - Coming Soon!</p>';
  }
}

// Settings
function showSettings() {
  document.getElementById('settingsPanel').classList.add('active');
  closeMenu();
}

function closeSettings() {  document.getElementById('settingsPanel').classList.remove('active');
}

// Menu
function openMenu() {
  document.getElementById('menuOverlay').classList.add('active');
}

function closeMenu() {
  document.getElementById('menuOverlay').classList.remove('active');
}

// Search
searchInput.addEventListener('input', (e) => {
  const query = e.target.value;
  if (query.length > 2) {
    searchDramas(query);
  }
});

async function searchDramas(query) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=${encodeURIComponent(query)}&type=video&key=${YOUTUBE_API_KEY}`
    );
    const data = await response.json();
    if (data.items) {
      renderDramas(data.items);
    }
  } catch (error) {
    console.error('Search error:', error);
  }
}

// Initial Load
loadDramas('popular');
