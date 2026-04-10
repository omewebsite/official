// Optimized Header/Footer Loader
function loadComponent(id, file) {
    const el = document.getElementById(id);
    if (!el) return;

    fetch(file)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.text();
        })
        .then(data => {
            el.innerHTML = data;

            // Re-initialize Bootstrap dropdowns after content is loaded
            if (typeof bootstrap !== 'undefined' && bootstrap.Dropdown) {
                const dropdownElementList = el.querySelectorAll('.dropdown-toggle');
                dropdownElementList.forEach(dropdownToggleEl => {
                    new bootstrap.Dropdown(dropdownToggleEl);
                });
            }
        })
        .catch(error => {
            console.error(`Error loading ${file}:`, error);
        });
}

// execute as soon as possible
document.addEventListener('DOMContentLoaded', () => {
    loadComponent('header', '0header.html');
    loadComponent('footer', '0footer.html');
});