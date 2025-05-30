function updateDateTime() {
    const now = new Date();
    
    // Format time
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    document.getElementById('current-time').textContent = now.toLocaleTimeString('en-US', timeOptions);
    
    // Format date
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date').textContent = now.toLocaleDateString('en-US', dateOptions);
}

// Update immediately and then every second
document.addEventListener('DOMContentLoaded', function() {
    updateDateTime();
    setInterval(updateDateTime, 1000);
});

// Theme toggle functionality
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');

    // Check for saved theme preference or default to 'light'
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    // Toggle theme
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    // Update theme icon
    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            icon.className = 'bx bx-sun';
        } else {
            icon.className = 'bx bx-moon';
        }
    }
});