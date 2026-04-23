

function getDriveImageUrl(url) {
    if (!url) return '';
    // Extract ID from various Google Drive link formats
    const idMatch = url.match(/\/d\/([^\/\?#]+)/) || url.match(/[?&]id=([^&]+)/);
    if (idMatch) {
        const photoId = idMatch[1];
        return `https://drive.google.com/thumbnail?id=${photoId}&sz=w1500`;
    }
    return url;
}



function fetchDataAndRender() {
    const jsonUrl = './ข่าวประชาสัมพันธ์/news.json';

    fetch(jsonUrl)
        .then(response => response.json())
        .then(data => {
            const cardContainer = document.getElementById('card-container');
            cardContainer.innerHTML = ''; // Clear existing content


            data.forEach((entry, index) => {
                const cardDiv = document.createElement('div');
                cardDiv.classList.add('col-md-6', 'mb-4');

                // Extract title (handles title1, title2, etc.)
                const titleKey = Object.keys(entry).find(k => k.startsWith('title'));
                const title = entry[titleKey] || '';

                // Extract links link1 to link5
                const links = [entry.link1, entry.link2, entry.link3, entry.link4, entry.link5]
                    .filter(l => l && l.trim() !== '');

                if (links.length === 0) return;

                // Determine target link based on index (following previous pattern)
                const targetLink = `www.ome.ac.th`;

                const cardId = `news-card-${index}`;
                cardDiv.innerHTML = `
                    <div class="card h-100 shadow-sm border-0 overflow-hidden">
                        <a href="${targetLink}" class="text-decoration-none h-100 d-flex flex-column">
                            <div class="ratio ratio-16x9 overflow-hidden" style="background: #f0f0f0;">
                                <img id="${cardId}-img" src="${getDriveImageUrl(links[0])}" class="card-img-top" style="object-fit: cover; transition: opacity 0.8s ease-in-out;" alt="${title}">
                            </div>
                            <div class="card-body d-flex flex-column">
                                <h5 class="card-title text-dark mb-0 font-weight-bold" 
                                    style="font-size: 0.95rem; line-height: 1.6; text-align: justify; text-justify: inter-word;">
                                    ${title}
                                </h5>
                            </div>

                        </a>
                    </div>
                `;

                cardContainer.appendChild(cardDiv);

                // Image rotation logic with randomized intervals and slow fade
                if (links.length > 1) {
                    let currentLinkIndex = 0;
                    const imgElement = document.getElementById(`${cardId}-img`);

                    const scheduleNextRotation = () => {
                        // Random interval between 1000ms and 2000ms (1-2 seconds)
                        const stayDuration = Math.floor(Math.random() * 1500) + 1000;

                        setTimeout(() => {
                            imgElement.style.opacity = 0;
                            // Wait for 0.8s fade out
                            setTimeout(() => {
                                currentLinkIndex = (currentLinkIndex + 1) % links.length;
                                imgElement.src = getDriveImageUrl(links[currentLinkIndex]);
                                imgElement.style.opacity = 1;
                                // After fading in, schedule the next slide
                                scheduleNextRotation();
                            }, 1200);
                        }, stayDuration);
                    };

                    // Initial delay to further desync them if they both start from 0
                    const initialDelay = Math.random() * 2000;
                    setTimeout(scheduleNextRotation, initialDelay);
                }
            });

        })
        .catch(error => {
            console.error('Error fetching news data:', error);
        });
}

// Initial call
document.addEventListener('DOMContentLoaded', fetchDataAndRender);


