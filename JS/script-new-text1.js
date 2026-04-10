// Function to fetch data from the provided URL and update the HTML content
function fetchDataAndRender() {
    var url = 'https://script.google.com/macros/s/AKfycbzh50Wgf2GoKzNOoT6XX98RNO80sOvO4HfF4UUnB2-PoVTo0GWPP9zKsO3dRA5EkG0KJg/exec';

    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Get the first entry in the data
            var firstEntry = data.data[0];

            // Update the HTML content with data from the API
            document.querySelector('.mainpage').textContent = firstEntry.topic;
            document.querySelector('p').textContent = firstEntry.content;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Call the function to fetch data and render the content
fetchDataAndRender();
