// ✅ Cloudflare Pages ke liye: VITE_ prefix wali env variable use karein
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

if (!YOUTUBE_API_KEY) {
  console.warn("⚠️ YouTube API Key not set! Please add VITE_YOUTUBE_API_KEY in Cloudflare Environment Variables.");
  // Fallback: Sample Hindi dramas show karega agar key nahi hai
}

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
const menuOverlay = document.getElementById('menuOverlay');
const settingsPanel = document.getElementById('settingsPanel');

// Sample fallback data (agar API fail ho jaye)
const sampleDramas = [
  {
    title: 'एक रात की बात और डबल शादी',
    subtitle: 'सभी का लाड़ला',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    videoId: 'dQw4w9WgXcQ',
    views: '3.8M',
    dubbed: true
  },
  {
    title: 'Debt Bound to the Heir',
    subtitle: 'Second Chance',
    thumbnail: 'https://img.youtube.com/vi/9bZkp7q19f0/hqdefault.jpg',
    videoId: '9bZkp7q19f0',
    views: '708.4K',
    dubbed: false
  },
  {
    title: 'छोटे पति का पागलपन',
    subtitle: 'फकीर से रईस',
    thumbnail: 'https://img.youtube.com/vi/JGwWNGJdvx8/hqdefault.jpg',
    videoId: 'JGwWNGJdvx8',
    views: '4.1M',
    dubbed: true
  },
  {    title: 'System Glitch Ka Khel',
    subtitle: 'बदला',
    thumbnail: 'https://img.youtube.com/vi/5qap5aO4i9A/hqdefault.jpg',
    videoId: '5qap5aO4i9A',
    views: '3.6M',
    dubbed: true
  }
];

// Load Dramas from YouTube API or fallback
async function loadDramas(category = 'popular') {
  dramaGrid.innerHTML = `
    <div style="text-align:center; padding:60px;">
      <div class="spinner" style="width:40px; height:40px; border:4px solid #333; border-top:4px solid #ff4757; border-radius:50%; animation:spin 1s linear infinite; margin:0 auto 20px;"></div>
      <p>Loading Hindi Dramas...</p>
    </div>
  `;
  
  try {
    const query = dramaQueries[category];
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=${encodeURIComponent(query)}&type=video&key=${YOUTUBE_API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      renderDramas(data.items);
    } else {
      console.warn('No results from YouTube API. Using sample data.');
      renderDramas(sampleDramas);
    }
  } catch (error) {
    console.error('YouTube API Error:', error);
    renderDramas(sampleDramas);
  }
}

// Render Drama Cards
function renderDramas(items) {
  dramaGrid.innerHTML = '';
  
  items.forEach(item => {
    const videoId = item.id?.videoId || item.videoId;
    const snippet = item.snippet || {};
    const title = snippet.title || 'Untitled';
    const channel = snippet.channelTitle || 'Hindi Drama';
    const thumbnail = snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url || 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg';
    const views = Math.floor(Math.random() * 5) + 1 + 'M';
    const isDubbed = title.toLowerCase().includes('hindi') || title.toLowerCase().includes('dubbed') || channel.toLowerCase().includes('hindi');
    const card = document.createElement('div');
    card.className = 'drama-card';
    card.onclick = () => playVideo(videoId);

    card.innerHTML = `
      <div class="drama-poster">
        <img src="${thumbnail}" alt="${title}" loading="lazy">
        ${isDubbed ? '<span class="dubbed-badge">Dubbed</span>' : ''}
        <span class="view-count">🔥 ${views}</span>
      </div>
      <div class="drama-title">${title}</div>
      <div class="drama-subtitle">${channel}</div>
    `;
    
    dramaGrid.appendChild(card);
  });
}

// Play Video Modal
function playVideo(videoId) {
  const modal = document.getElementById('videoModal');
  const player = document.getElementById('videoPlayer');
  player.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0&showinfo=0&fs=0`;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Close Video
function closeVideo() {
  const modal = document.getElementById('videoModal');
  const player = document.getElementById('videoPlayer');
  player.src = '';
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

// Tab Switch
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    loadDramas(tab.dataset.category);
  });
});

// Bottom Nav
navItems.forEach(item => {
  item.addEventListener('click', () => {
    navItems.forEach(n => n.classList.remove('active'));
    item.classList.add('active');    const page = item.dataset.page;
    if (page === 'home') {
      loadDramas('popular');
    } else if (page === 'foryou') {
      loadDramas('trending');
    } else if (page === 'mylist') {
      dramaGrid.innerHTML = `<p style="text-align:center; padding:60px;">My List — Coming Soon 📺</p>`;
    } else if (page === 'profile') {
      dramaGrid.innerHTML = `<p style="text-align:center; padding:60px;">Profile — Your Watchlist & Settings</p>`;
    }
  });
});

// Menu & Settings
function openMenu() {
  menuOverlay.classList.add('active');
}
function closeMenu() {
  menuOverlay.classList.remove('active');
}
function showSettings() {
  settingsPanel.classList.add('active');
  closeMenu();
}
function closeSettings() {
  settingsPanel.classList.remove('active');
}

// Search Functionality
searchInput.addEventListener('input', async (e) => {
  const query = e.target.value.trim();
  if (query.length >= 3) {
    dramaGrid.innerHTML = `<p style="text-align:center; padding:60px;">Searching "${query}"...</p>`;
    try {
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=${encodeURIComponent(query)}&type=video&key=${YOUTUBE_API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      renderDramas(data.items || []);
    } catch (err) {
      console.error('Search failed:', err);
      renderDramas(sampleDramas);
    }
  } else if (query === '') {
    loadDramas('popular');
  }
});

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
  loadDramas('popular');
  // Close modal on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeVideo();
  });

  // Close menu/settings on click outside
  document.addEventListener('click', (e) => {
    if (e.target.closest('.menu-overlay') || e.target.closest('.settings-panel')) return;
    if (menuOverlay.classList.contains('active') && !e.target.closest('.nav-item')) {
      closeMenu();
    }
    if (settingsPanel.classList.contains('active') && !e.target.closest('#settingsPanel')) {
      closeSettings();
    }
  });
});
