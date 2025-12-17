// Floating Action Button (FAB) functionality
document.addEventListener('DOMContentLoaded', function() {
    const fabButton = document.getElementById('fabButton');
    const fabMenu = document.getElementById('fabMenu');
    
    if (fabButton && fabMenu) {
        let isOpen = false;
        
        fabButton.addEventListener('click', function() {
            isOpen = !isOpen;
            fabMenu.classList.toggle('active', isOpen);
            
            const icon = fabButton.querySelector('i');
            if (isOpen) {
                icon.classList.remove('fa-bolt');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bolt');
            }
        });
        
        // Close FAB menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!fabButton.contains(event.target) && !fabMenu.contains(event.target)) {
                if (isOpen) {
                    isOpen = false;
                    fabMenu.classList.remove('active');
                    const icon = fabButton.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bolt');
                }
            }
        });
        
        // Close FAB menu when an action is clicked
        const fabActions = document.querySelectorAll('.fab-action');
        fabActions.forEach(action => {
            action.addEventListener('click', function() {
                isOpen = false;
                fabMenu.classList.remove('active');
                const icon = fabButton.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bolt');
            });
        });
    }
});
