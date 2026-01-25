/**
 * Library Manager - Organization and management tools
 */

class LibraryManager {
    constructor() {
        this.library = [];
        this.init();
    }

    init() {
        this.loadLibrary();
        this.createManagerUI();
    }

    createManagerUI() {
        // Add library manager button
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
            const link = document.createElement('a');
            link.href = '#library-manager';
            link.className = 'nav-link';
            link.dataset.section = 'library-manager';
            link.innerHTML = '<i class="fas fa-folder-open"></i> Library';
            navLinks.appendChild(link);
        }

        // Create library manager section
        const mainContainer = document.querySelector('.main-container');
        if (!mainContainer) return;

        const section = document.createElement('section');
        section.id = 'library-manager';
        section.className = 'section';
        section.innerHTML = `
            <div class="section-header">
                <h2><i class="fas fa-folder-open"></i> Library Manager</h2>
                <div class="library-controls">
                    <button class="btn-secondary" onclick="libraryManager.sortLibrary('name')">Sort</button>
                    <button class="btn-secondary" onclick="libraryManager.deleteSelected()">Delete</button>
                    <button class="btn-secondary" onclick="libraryManager.selectAll()">Select All</button>
                </div>
            </div>
            <div id="libraryGrid" class="library-grid"></div>
        `;
        mainContainer.appendChild(section);
    }

    loadLibrary() {
        try {
            const saved = localStorage.getItem('offlineMusicLibrary');
            this.library = saved ? JSON.parse(saved) : [];
        } catch (e) {}
    }

    sortLibrary(by) {
        if (by === 'name') {
            this.library.sort((a, b) => a.title.localeCompare(b.title));
        } else if (by === 'artist') {
            this.library.sort((a, b) => a.artist.localeCompare(b.artist));
        } else if (by === 'date') {
            this.library.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate));
        }
        this.saveLibrary();
        if (typeof showNotification === 'function') {
            showNotification(`Sorted by ${by}`, 'success');
        }
    }

    deleteSelected() {
        const selected = document.querySelectorAll('.library-item.selected');
        if (selected.length === 0) return;

        if (confirm(`Delete ${selected.length} items?`)) {
            selected.forEach(item => {
                const id = item.dataset.id;
                this.library = this.library.filter(t => t.id !== id);
            });
            this.saveLibrary();
            if (typeof showNotification === 'function') {
                showNotification('Items deleted', 'success');
            }
        }
    }

    selectAll() {
        document.querySelectorAll('.library-item').forEach(item => {
            item.classList.add('selected');
        });
    }

    saveLibrary() {
        localStorage.setItem('offlineMusicLibrary', JSON.stringify(this.library));
    }
}

const libraryManager = new LibraryManager();
window.libraryManager = libraryManager;
