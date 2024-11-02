window.addEventListener('load', function() {
    const loading = document.getElementById('loading');
    const content = document.getElementById('content');
    const logo = document.getElementById('logo');

    // Show loading for 4 seconds
    setTimeout(() => {
        loading.style.transform = 'translateY(-45%)'; // Move the loading screen up
        // Show content
    }, 2000); 
    setTimeout(() => {// 4000 milliseconds = 4 seconds
    content.style.opacity = 1;
}, 2500); 

});