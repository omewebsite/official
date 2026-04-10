// Function to fetch data from the provided URL and populate the carousel
function fetchDataAndPopulateCarousel() {
    var url = 'https://script.google.com/macros/s/AKfycbzh50Wgf2GoKzNOoT6XX98RNO80sOvO4HfF4UUnB2-PoVTo0GWPP9zKsO3dRA5EkG0KJg/exec';

    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Get the first entry in the data
            var firstEntry = data.data[1];

            // Get the carousel inner container
            var carouselInner = document.getElementById('carousel-inner');

            // Create carousel items dynamically
            var carouselItems = '';
            carouselItems += `
                <div class="carousel-item active">
                    <img src="${firstEntry.pic1}" class="d-block w-100" alt="pic1">
                </div>
            `;
            carouselItems += `
                <div class="carousel-item">
                    <img src="${firstEntry.pic2}" class="d-block w-100" alt="pic2">
                </div>
            `;
            carouselItems += `
                <div class="carousel-item">
                    <img src="${firstEntry.pic3}" class="d-block w-100" alt="pic3">
                </div>
            `;
            carouselItems += `
                <div class="carousel-item">
                    <img src="${firstEntry.pic4}" class="d-block w-100" alt="pic4">
                </div>
            `;
            carouselItems += `
                <div class="carousel-item">
                    <img src="${firstEntry.pic5}" class="d-block w-100" alt="pic5">
                </div>
            `;
            carouselItems += `
                <div class="carousel-item">
                    <img src="${firstEntry.pic6}" class="d-block w-100" alt="pic6">
                </div>
            `;

            // Append carousel items to the carousel inner container
            carouselInner.innerHTML = carouselItems;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Call the function to fetch data and populate the carousel
fetchDataAndPopulateCarousel();
