/**
 * User Profiles - User profile management
 */

class UserProfiles {
    constructor() {
        this.currentUser = null;
        this.users = [];
        this.init();
    }

    init() {
        this.loadUsers();
        this.createProfileUI();
    }

    createProfileUI() {
        // Add profile menu to navbar
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            const profileBtn = document.createElement('div');
            profileBtn.className = 'user-profile-menu';
            profileBtn.innerHTML = `
                <button class="profile-btn" onclick="userProfiles.toggleProfileMenu()">
                    <i class="fas fa-user-circle"></i>
                    <span id="currentUserName">Profile</span>
                </button>
                <div class="profile-dropdown hidden" id="profileDropdown">
                    <a href="#" onclick="userProfiles.createNewProfile()">New Profile</a>
                    <a href="#" onclick="userProfiles.switchProfile()">Switch Profile</a>
                    <hr>
                    <a href="#" onclick="userProfiles.editProfile()">Edit Profile</a>
                    <a href="#" onclick="userProfiles.deleteProfile()">Delete Profile</a>
                </div>
            `;
            navbar.appendChild(profileBtn);
        }
    }

    toggleProfileMenu() {
        const dropdown = document.getElementById('profileDropdown');
        dropdown.classList.toggle('hidden');
    }

    createNewProfile() {
        const name = prompt('Profile name:');
        if (name) {
            const profile = {
                id: Date.now(),
                name: name,
                createdDate: new Date().toISOString(),
                preferences: {},
                library: []
            };
            this.users.push(profile);
            this.currentUser = profile;
            this.saveUsers();
            this.updateProfileDisplay();
            if (typeof showNotification === 'function') {
                showNotification(`Profile "${name}" created`, 'success');
            }
        }
    }

    switchProfile() {
        if (this.users.length === 0) {
            alert('No profiles available');
            return;
        }
        const profileList = this.users.map((u, i) => `${i + 1}. ${u.name}`).join('\n');
        const choice = prompt(`Select profile:\n${profileList}`);
        if (choice) {
            const index = parseInt(choice) - 1;
            if (index >= 0 && index < this.users.length) {
                this.currentUser = this.users[index];
                this.saveUsers();
                this.updateProfileDisplay();
            }
        }
    }

    editProfile() {
        if (!this.currentUser) return;
        const newName = prompt('New profile name:', this.currentUser.name);
        if (newName) {
            this.currentUser.name = newName;
            this.saveUsers();
            this.updateProfileDisplay();
        }
    }

    deleteProfile() {
        if (!this.currentUser) return;
        if (confirm(`Delete profile "${this.currentUser.name}"?`)) {
            this.users = this.users.filter(u => u.id !== this.currentUser.id);
            this.currentUser = this.users[0] || null;
            this.saveUsers();
            this.updateProfileDisplay();
        }
    }

    updateProfileDisplay() {
        const nameEl = document.getElementById('currentUserName');
        if (nameEl && this.currentUser) {
            nameEl.textContent = this.currentUser.name;
        }
    }

    saveUsers() {
        localStorage.setItem('userProfiles', JSON.stringify(this.users));
        localStorage.setItem('currentUserId', this.currentUser?.id);
    }

    loadUsers() {
        try {
            const saved = localStorage.getItem('userProfiles');
            this.users = saved ? JSON.parse(saved) : [];
            const currentId = localStorage.getItem('currentUserId');
            this.currentUser = this.users.find(u => u.id == currentId) || this.users[0];
        } catch (e) {}
    }
}

const userProfiles = new UserProfiles();
window.userProfiles = userProfiles;
