document.addEventListener('DOMContentLoaded', function () {
    fetch('./ข่าวประชาสัมพันธ์/announcements.json')
        .then(response => {
            if (!response.ok) throw new Error('Failed to load announcements');
            return response.json();
        })
        .then(data => {
            const listContainer = document.querySelector('.announcement ul');
            if (!listContainer) return;

            // Clear existing items (if any, though we'll remove them from HTML too)
            listContainer.innerHTML = '';

            data.forEach(item => {
                const li = document.createElement('li');

                // If highlight is true, add the "new" icon
                let iconHtml = '';
                if (item.highlight) {
                    iconHtml = '<img src="./IMG/new1.gif" alt="new"> ';
                }

                const target = item.target ? `target="${item.target}"` : '';
                const linkClass = item.highlight ? 'class="highlight"' : '';

                li.innerHTML = `${iconHtml}<a ${linkClass} href="${item["news-link"]}" ${target}>${item["news-title"]}</a>`;
                listContainer.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error loading announcements:', error);
        });
});
