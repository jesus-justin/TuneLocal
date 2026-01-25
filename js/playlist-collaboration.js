// Playlist Collaboration System
class PlaylistCollaboration {
    constructor() {
        this.collaborations = JSON.parse(localStorage.getItem('playlistCollaborations')) || {};
        this.invitations = JSON.parse(localStorage.getItem('playlistInvitations')) || {};
        this.init();
    }

    init() {
        this.setupCollaborationUI();
        this.setupEventListeners();
        this.loadCollaborations();
    }

    setupCollaborationUI() {
        const panel = document.createElement('div');
        panel.id = 'playlistCollaborationPanel';
        panel.className = 'collaboration-panel';
        panel.innerHTML = `
            <div class="collaboration-header">
                <h3>Playlist Collaboration</h3>
                <button id="closeCollaboration" class="close-btn">×</button>
            </div>
            <div class="collaboration-content">
                <div class="collab-section">
                    <h4>Invite Users</h4>
                    <div class="invite-form">
                        <input type="email" id="inviteEmail" placeholder="Enter email or username" />
                        <select id="selectPlaylist">
                            <option>Select Playlist</option>
                        </select>
                        <select id="invitePermission">
                            <option value="view">View Only</option>
                            <option value="edit">Can Edit</option>
                            <option value="admin">Admin</option>
                        </select>
                        <button id="sendInvite">Send Invite</button>
                    </div>
                </div>
                <div class="collab-section">
                    <h4>Active Collaborations</h4>
                    <div id="activeCollabs" class="collaborations-list"></div>
                </div>
                <div class="collab-section">
                    <h4>Pending Invitations</h4>
                    <div id="pendingInvites" class="invitations-list"></div>
                </div>
            </div>
        `;
        document.body.appendChild(panel);
    }

    setupEventListeners() {
        document.getElementById('sendInvite').addEventListener('click', () => this.sendInvitation());
        document.getElementById('closeCollaboration').addEventListener('click', () => this.closePanel());
    }

    sendInvitation() {
        const email = document.getElementById('inviteEmail').value;
        const playlistId = document.getElementById('selectPlaylist').value;
        const permission = document.getElementById('invitePermission').value;

        if (!email || !playlistId) {
            showNotification('Please fill all fields', 'error');
            return;
        }

        const invitation = {
            id: Date.now(),
            email: email,
            playlistId: playlistId,
            permission: permission,
            sentAt: new Date().toISOString(),
            status: 'pending'
        };

        this.invitations[invitation.id] = invitation;
        localStorage.setItem('playlistInvitations', JSON.stringify(this.invitations));
        showNotification(`Invitation sent to ${email}`, 'success');
        document.getElementById('inviteEmail').value = '';
        this.loadInvitations();
    }

    acceptInvitation(inviteId) {
        const invite = this.invitations[inviteId];
        if (invite) {
            invite.status = 'accepted';
            if (!this.collaborations[invite.playlistId]) {
                this.collaborations[invite.playlistId] = [];
            }
            this.collaborations[invite.playlistId].push({
                userId: 'current-user',
                permission: invite.permission,
                addedAt: new Date().toISOString()
            });
            localStorage.setItem('playlistCollaborations', JSON.stringify(this.collaborations));
            localStorage.setItem('playlistInvitations', JSON.stringify(this.invitations));
            showNotification('Invitation accepted', 'success');
            this.loadCollaborations();
            this.loadInvitations();
        }
    }

    removeCollaborator(playlistId, userId) {
        if (this.collaborations[playlistId]) {
            this.collaborations[playlistId] = this.collaborations[playlistId].filter(c => c.userId !== userId);
            localStorage.setItem('playlistCollaborations', JSON.stringify(this.collaborations));
            showNotification('Collaborator removed', 'success');
            this.loadCollaborations();
        }
    }

    loadCollaborations() {
        const container = document.getElementById('activeCollabs');
        if (!container) return;
        
        container.innerHTML = '';
        Object.entries(this.collaborations).forEach(([playlistId, collaborators]) => {
            const item = document.createElement('div');
            item.className = 'collaboration-item';
            item.innerHTML = `
                <div class="collab-info">
                    <span class="collab-playlist">Playlist: ${playlistId}</span>
                    <span class="collab-count">${collaborators.length} collaborators</span>
                </div>
                <div class="collab-details">
                    ${collaborators.map(c => `
                        <span class="collaborator" data-user="${c.userId}">
                            ${c.userId} (${c.permission})
                            <button class="remove-collab" data-playlist="${playlistId}" data-user="${c.userId}">Remove</button>
                        </span>
                    `).join('')}
                </div>
            `;
            container.appendChild(item);
        });
    }

    loadInvitations() {
        const container = document.getElementById('pendingInvites');
        if (!container) return;

        container.innerHTML = '';
        Object.entries(this.invitations).filter(([_, inv]) => inv.status === 'pending').forEach(([id, invite]) => {
            const item = document.createElement('div');
            item.className = 'invitation-item';
            item.innerHTML = `
                <div class="invite-info">
                    <span class="invite-email">${invite.email}</span>
                    <span class="invite-perm">${invite.permission}</span>
                </div>
                <div class="invite-actions">
                    <button class="accept-btn" data-id="${id}">Accept</button>
                    <button class="decline-btn" data-id="${id}">Decline</button>
                </div>
            `;
            container.appendChild(item);
        });
    }

    closePanel() {
        const panel = document.getElementById('playlistCollaborationPanel');
        if (panel) panel.remove();
    }
}

const playlistCollaboration = new PlaylistCollaboration();
window.playlistCollaboration = playlistCollaboration;
