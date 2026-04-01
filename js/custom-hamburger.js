// Custom Hamburger Menu JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Find header right section
    const headerRight = document.querySelector('.hdr-right');
    if (!headerRight) return;
    
    // Create hamburger button
    const hamburger = document.createElement('button');
    hamburger.className = 'custom-hamburger';
    hamburger.innerHTML = '<span></span><span></span><span></span>';
    headerRight.appendChild(hamburger);
    
    // Create navigation menu
    const nav = document.createElement('nav');
    nav.className = 'custom-nav';
    nav.innerHTML = `
        <button class="custom-close-btn"></button>
        <ul class="custom-nav-list">
            <li class="custom-nav-item">
                <a href="index.html" class="custom-nav-link">Home</a>
                <div class="custom-dropdown">
                    <a href="index.html" class="custom-dropdown-link">Home 1</a>
                    <a href="home2.html" class="custom-dropdown-link">Home 2</a>
                </div>
            </li>
            <li class="custom-nav-item">
                <a href="about.html" class="custom-nav-link">About</a>
            </li>
            <li class="custom-nav-item">
                <a href="services.html" class="custom-nav-link">Services</a>
            </li>
            <li class="custom-nav-item">
                <a href="contact.html" class="custom-nav-link">Contact</a>
            </li>
            <li class="custom-nav-item">
                <a href="#" class="custom-nav-link">Dashboard</a>
                <div class="custom-dropdown">
                    <a href="user-dashboard.html" class="custom-dropdown-link">User Dashboard</a>
                    <a href="admin-dashboard.html" class="custom-dropdown-link">Admin Dashboard</a>
                </div>
            </li>
        </ul>
    `;
    document.body.appendChild(nav);
    
    // Toggle menu
    function toggleMenu() {
        hamburger.classList.toggle('open');
        nav.classList.toggle('open');
        document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
        console.log('Menu toggled, hamburger has open class:', hamburger.classList.contains('open'));
    }
    
    // Close menu
    function closeMenu() {
        hamburger.classList.remove('open');
        nav.classList.remove('open');
        document.body.style.overflow = '';
    }
    
    // Event listeners
    hamburger.addEventListener('click', toggleMenu);
    nav.querySelector('.custom-close-btn').addEventListener('click', closeMenu);
    
    // Close on link click
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('open')) {
            closeMenu();
        }
    });
});
