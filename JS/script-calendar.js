const googleSheetUrl = 'https://script.google.com/macros/s/AKfycbyrm8G6M9g8d7IWdc2GKWSq0jD9GO-mtSts5qqkxKzRPF3lDLE67AQLolPP3ppyMaZ93A/exec';

// Fetching data from Google Apps Script API
async function fetchGoogleSheetData() {
  try {
    const response = await fetch(googleSheetUrl);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const text = await response.text(); // Get raw response as text first
    console.log('Response Text:', text); // Debugging step: log the response to see what's being returned

    const data = JSON.parse(text); // Parse the response text into JSON
    console.log('Parsed JSON:', data); // Log the parsed JSON for debugging
    return data;
  } catch (error) {
    document.getElementById('status-message').innerHTML = 'Error loading data. Please try again later.';
    console.error('Error fetching or parsing data:', error);
  }
}

// Generate Calendar
function generateCalendar(data) {
  const calendarContainer = document.getElementById('calendar-container');
  const fragment = document.createDocumentFragment(); // Create fragment for batched DOM manipulation

  const monthNames = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
  const weekdays = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];

  const activitiesByMonth = {};

  // Process the data and group activities by month
  data.forEach(row => {
    const dateParts = row.Date.split('/');
    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1; // Months are 0-indexed in JavaScript
    const year = dateParts[2];

    const monthKey = `${month}/${year}`;
    if (!activitiesByMonth[monthKey]) {
      activitiesByMonth[monthKey] = [];
    }

    activitiesByMonth[monthKey].push({ day, event: row.Event, department: row.Department });
  });

  // Loop through each month and create calendar
  Object.keys(activitiesByMonth).forEach(monthKey => {
    const [monthIndex, year] = monthKey.split('/');
    const monthName = monthNames[parseInt(monthIndex, 10)];
    const currentYear = parseInt(year);

    // Create the month header
    const monthHeader = document.createElement('h2');
    monthHeader.classList.add('month-header');
    monthHeader.innerHTML = `${monthName} ${currentYear + 543}`;
    fragment.appendChild(monthHeader);

    // Create the calendar grid for the month
    const calendar = document.createElement('div');
    calendar.classList.add('calendar');

    // Create weekday headers
    weekdays.forEach(weekday => {
      const weekdayDiv = document.createElement('div');
      weekdayDiv.classList.add('weekday');
      weekdayDiv.innerHTML = weekday;
      calendar.appendChild(weekdayDiv);
    });

    // Get the first day of the month to position the start
    const firstDayOfMonth = new Date(currentYear, parseInt(monthIndex), 1).getDay();

    // Create empty days at the start if the month doesn't begin on Sunday
    for (let i = 0; i < firstDayOfMonth; i++) {
      const emptyDiv = document.createElement('div');
      emptyDiv.classList.add('day');
      calendar.appendChild(emptyDiv);
    }

    // Get the total number of days in the month
    const daysInMonth = new Date(currentYear, parseInt(monthIndex) + 1, 0).getDate();

    // Create days in the calendar
    for (let i = 1; i <= daysInMonth; i++) {
      const dayDiv = document.createElement('div');
      dayDiv.classList.add('day');
      dayDiv.innerHTML = i;

      // Check if there are any activities for this day
      activitiesByMonth[monthKey].forEach(activity => {
        if (activity.day === i) {
          const activityDiv = document.createElement('div');
          activityDiv.classList.add('activity');

          // Assign color based on department
          const department = activity.department.trim().toLowerCase();
          if (department === 'กอก.สศท.สปท.'.toLowerCase()) {
            activityDiv.classList.add('gork');
          } else if (department === 'กวก.สศท.สปท.'.toLowerCase()) {
            activityDiv.classList.add('gvok');
          } else if (department === 'กฝอร.สศท.สปท.'.toLowerCase()) {
            activityDiv.classList.add('gfor');
          }

          activityDiv.innerHTML = `${activity.event} (${activity.department})`;
          dayDiv.appendChild(activityDiv);
        }
      });

      calendar.appendChild(dayDiv);
    }

    // Append the calendar for the month to the fragment
    fragment.appendChild(calendar);
  });

  // Append the entire fragment to the DOM
  calendarContainer.appendChild(fragment);
}

// Initialize and load the calendar data
fetchGoogleSheetData().then(data => {
  if (data) {
    // Hide the status message once data is fetched
    document.getElementById('status-message').style.display = 'none';
    generateCalendar(data);
  } else {
    document.getElementById('status-message').innerHTML = 'Error loading data. Please try again later.';
  }
});
