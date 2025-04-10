
document.addEventListener('DOMContentLoaded', function() {
    const userInfo = document.getElementById('userInfo');
    const profileDropdown = document.getElementById('profileDropdown');
    const viewProfile = document.getElementById('viewProfile');
    const profilePage = document.getElementById('profilePage');
    const dashboardMenuItem = document.getElementById('dashboardMenuItem');
    const logout = document.getElementById('logout');

    // Toggle profile dropdown
    userInfo.addEventListener('click', function(e) {
        e.stopPropagation();
        profileDropdown.classList.add('active');
    });

    // Close dropdown when clicking elsewhere
    document.addEventListener('click', function() {
        profileDropdown.classList.remove('active');
    });

    // View profile functionality
    viewProfile.addEventListener('click', function(e) {
        e.stopPropagation();

        profilePage.classList.add('active');
        profileDropdown.classList.remove('active');
    });

});