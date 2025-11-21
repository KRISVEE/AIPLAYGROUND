// app.js
import { allGames } from './database.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Load all content initially
    loadContent();

    // 2. Setup Search & Filter Listeners
    const searchInput = document.getElementById('searchInput');
    const typeFilter = document.getElementById('typeFilter');

    const refresh = () => loadContent(typeFilter.value, searchInput.value);

    if (searchInput) searchInput.addEventListener('input', refresh);
    if (typeFilter) typeFilter.addEventListener('change', refresh);

    // 3. Setup Player Button Listeners
    const closeBtn = document.getElementById('closePlayer');
    if (closeBtn) closeBtn.onclick = closePlayer;

    const refreshBtn = document.getElementById('refreshFrame');
    if (refreshBtn) {
        refreshBtn.onclick = () => {
            const frame = document.getElementById('gameFrame');
            // Reload the iframe by resetting its source
            if (frame) frame.src = frame.src;
        };
    }
});

/**
 * Loads items from database.js, filters them, and renders cards.
 */
function loadContent(filterType = 'all', searchQuery = '') {
    // Use the imported list directly
    const items = allGames;

    // Filter based on Type and Search Text
    const filtered = items.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesType = filterType === 'all' || item.type === filterType;
        
        return matchesSearch && matchesType;
    });

    // Clear existing content in all sections
    const sections = ['games-list', 'simulations-list', 'educational-list'];
    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = '';
    });

    // Render the cards into the correct sections
    filtered.forEach(item => {
        let listId = 'educational-list'; 
        if (item.type === 'game') listId = 'games-list';
        else if (item.type === 'simulation') listId = 'simulations-list';

        const container = document.getElementById(listId);
        if (container) {
            container.appendChild(createCard(item));
        }
    });
}

/**
 * Creates the Premium Store Style Card
 */
function createCard(item) {
    const div = document.createElement('div');
    div.className = 'card';
    
    // Define a color for the badge based on type
    let badgeColor = '#6366f1'; // default (game/purple)
    if(item.type === 'simulation') badgeColor = '#10b981'; // green
    if(item.type === 'educational') badgeColor = '#f59e0b'; // orange

    div.innerHTML = `
        <div class="card-thumb">
            <!-- The Category Badge -->
            <span class="card-badge" style="background:${badgeColor}">${item.type.toUpperCase()}</span>
            
            <!-- The Thumbnail Image -->
            <img src="${item.thumbnail}" alt="${item.title}" onerror="this.style.display='none'">
            
            <!-- The Hidden Play Overlay (Appears on Hover) -->
            <div class="play-overlay">
                <div class="play-icon">▶</div>
            </div>
        </div>
        
        <div class="card-content">
            <div class="card-header">
                <h3>${item.title}</h3>
                <span class="publisher">${item.publisher}</span>
            </div>
            <p class="description">${item.description || "No description available."}</p>
        </div>
    `;

    // Make the whole card clickable to open player
    div.onclick = () => openPlayer(item);
    
    return div;
}

/**
 * Opens the modal and injects the Game Iframe.
 */
function openPlayer(item) {
    const modal = document.getElementById('playerModal');
    const titleEl = document.getElementById('playerTitle');
    const container = document.getElementById('playerContainer');

    if (!modal || !container) return;

    // Show the modal
    modal.classList.remove('hidden');
    if (titleEl) titleEl.textContent = item.title;

    // Clear any previous game
    container.innerHTML = '';

    // Create and configure the Iframe
    const iframe = document.createElement('iframe');
    iframe.id = 'gameFrame';
    iframe.src = item.gameUrl; // Points to games/your_game.html
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    
    // Security: Allow scripts and same-origin access
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-pointer-lock');

    container.appendChild(iframe);
}

/**
 * Closes the modal and destroys the iframe.
 */
function closePlayer() {
    const modal = document.getElementById('playerModal');
    const container = document.getElementById('playerContainer');

    if (modal) modal.classList.add('hidden');
    
    // Remove iframe to stop audio/game loop
    if (container) container.innerHTML = '';
}