fetch('https://script.google.com/macros/s/AKfycbwfkkdLRPkFcBB8N0p-dRfS1Cmz8aqCnvPRQ0wQztYG4Uzgz64W_epVkgCrMz7Q9B4CeQ/exec')
      .then(response => response.json())
      .then(data => {
        const dataTable = document.getElementById('dataTable');
        const tbody = dataTable.querySelector('tbody');
  
        // Iterate over the data and create table rows
        data.data.forEach(row => {
          const tr = document.createElement('tr');
          Object.values(row).forEach(value => {
            const td = document.createElement('td');
            if (value.startsWith('http')) {
              // If the value is a URL, create an image element
              const img = document.createElement('img');
              img.src = value;
              img.width = 100;
              td.appendChild(img);
            } else {
              td.textContent = value;
            }
            tr.appendChild(td);
          });
          tbody.appendChild(tr);
        });
      })
      .catch(error => console.error('Error fetching data:', error));
