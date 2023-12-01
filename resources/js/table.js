const DAYS = 86400000;
const HOURS = 3600000;
const MINUTES = 60000;
const SECONDS = 1000;

// list of all delete buttons
const deleteButtons = document.querySelectorAll('button[id^="deleteButton"]');
const table = document.getElementById('contactLogTable');


// When the user clicks the delete button you should FIRST attempt to delete the contact from the server using the FETCH API.
// If the server returns code 200 or 404 then you know the contact row is not in the server and you can delete it from the front end.
for (let i = 0; i < deleteButtons.length; i++) {
    const button = deleteButtons[i];
    button.addEventListener('click', () => {
        const rowId = button.id.replace('deleteButton', '');
        const row = document.getElementById(`tableRow${rowId}`);
        
        // deleting from server
        fetch('/api/contact', {
            method: 'DELETE', 
            body: JSON.stringify({"id": rowId}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => { // delete from front end
            if (response.status === 200) {
                table.deleteRow(row.rowIndex);
            } else {
                throw new Error('Error deleting contact');
            }
        })
        .catch(error => {  
            console.error('Error:', error);
        });
    });
}


// All rows in the table
const rows = document.querySelectorAll('tr[id^="tableRow"]');
// Appointment dates for each entry. Needs to be stored so that
// the time until can be calculated each second.
const targetDates = [];

for (let i = 0; i < rows.length; i++) {
    targetDates.push(rows[i].querySelectorAll('td')[2].innerText);
}

// Interval every second for each row of the table.
setInterval(() => {
    for (let i = 0; i < rows.length; i++) {
        const apptDate = rows[i].querySelectorAll('td')[2];
        const targetDate = targetDates[i];
        const timeUntilStr = timeUntil(targetDate);
        if (timeUntilStr === "PAST") {
            apptDate.innerText = targetDate + " --- Date has passed";    
        } else {
            apptDate.innerText = targetDate + " --- Time Until Appointement: " + timeUntilStr;
        }
    }
}, 1000);

function timeUntil(dateString) {
    const targetDate = new Date(dateString);

    // Check if the date is valid
    if (isNaN(targetDate)) {
        return "Invalid Date";
    }

    const currentDate = new Date();

    // timeDiffernece in milliseconds
    let timeDifference = targetDate - currentDate;

    // If the appointment is in the past
    if (timeDifference < 0) {
        return "PAST";
    }

    // Calculation help credit to https://gomakethings.com/how-to-get-the-date-n-seconds-minutes-hours-or-days-in-the-past-or-future-with-vanilla-js/
    let days = Math.floor(timeDifference / DAYS);
    timeDifference -= days * (DAYS);

    let hours = Math.floor(timeDifference / HOURS);
    timeDifference -= hours * (HOURS);

    let minutes = Math.floor(timeDifference / MINUTES);
    timeDifference -= minutes * (MINUTES);

    let seconds = Math.floor(timeDifference / SECONDS);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}
