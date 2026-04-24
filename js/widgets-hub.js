// Widgets hub bootstrap keeps the hub page isolated from main dashboard runtime.
(function () {
    function showNotification(message, type) {
        var level = type || 'info';
        var existing = document.querySelector('.hub-notification');
        if (existing) {
            existing.remove();
        }

        var node = document.createElement('div');
        node.className = 'hub-notification';
        node.style.cssText = [
            'position:fixed',
            'top:90px',
            'right:20px',
            'z-index:10000',
            'padding:10px 14px',
            'border-radius:10px',
            'color:#fff',
            'font-weight:600',
            'box-shadow:0 8px 24px rgba(0,0,0,.35)',
            'background:' + (level === 'error' ? '#dc3545' : (level === 'success' ? '#1db954' : '#0d6efd'))
        ].join(';');
        node.textContent = message;
        document.body.appendChild(node);

        var ariaLive = document.getElementById('ariaLive');
        if (ariaLive) {
            ariaLive.textContent = message;
        }

        setTimeout(function () {
            node.remove();
        }, 2500);
    }

    function initThemeToggle() {
        var toggle = document.querySelector('.theme-toggle');
        if (!toggle) {
            return;
        }

        toggle.setAttribute('role', 'button');
        toggle.setAttribute('tabindex', '0');

        function applyTheme(theme) {
            var light = theme === 'light';
            document.body.classList.toggle('light-theme', light);
            var icon = toggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-sun', light);
                icon.classList.toggle('fa-moon', !light);
            }
            try {
                localStorage.setItem('widgetsHubTheme', light ? 'light' : 'dark');
            } catch (e) {}
        }

        var saved = 'dark';
        try {
            saved = localStorage.getItem('widgetsHubTheme') || 'dark';
        } catch (e) {}
        applyTheme(saved);

        toggle.addEventListener('click', function () {
            var next = document.body.classList.contains('light-theme') ? 'dark' : 'light';
            applyTheme(next);
        });

        toggle.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                var next = document.body.classList.contains('light-theme') ? 'dark' : 'light';
                applyTheme(next);
            }
        });
    }

    window.showNotification = window.showNotification || showNotification;
    document.addEventListener('DOMContentLoaded', function () {
        initThemeToggle();
    });
})();
