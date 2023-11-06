$(document).ready(function () {
    $("#navbar").load("/pages/navbar.html");
    $("#footer").load("/pages/footer.html");
    $.get('/getAddiction', function (result) {
        if (result.success) {
            // Call the function to update the addiction table with all addiction data
            updateAddictionTableDisplay(result.data);

            // Assuming you want the interval to update all the displayed records,
            // you will need to make sure it can handle the array of data properly.
            // This example assumes that the update only affects the time display.
            setInterval(function () {
                result.data.forEach((data, index) => {
                    const quitDate = new Date(data.quit_date);
                    const now = new Date();
                    const timeElapsedDisplay = getTimeElapsedDisplay(quitDate, now);
                    // Update just the time elapsed cell for each row
                    $(`#addictionData tbody tr:eq(${index}) td:eq(1)`).text(timeElapsedDisplay);
                });
            }, 1000);
        }
    });

    function updateAddictionTableDisplay(addictions) {
        let rowsHtml = addictions.map(data => {
            const quitDate = new Date(data.quit_date);
            const now = new Date();
            const savingsDisplay = createSavingsDisplay(data.savings_money, quitDate, now);
            const timeElapsedDisplay = getTimeElapsedDisplay(quitDate, now);

            return `
                <tr>
                    <td>${data.quit_date}</td>
                    <td>${timeElapsedDisplay}</td>
                    <td>${savingsDisplay}</td>
                    <td>${data.phone}</td>
                    <td>${data.reasons}</td>
                </tr>
            `;
        }).join('');

        const tableHtml = `
            <thead>
                <tr>
                    <th>Quit Date</th>
                    <th>Time Elapsed</th>
                    <th>Savings</th>
                    <th>Emergency Contact</th>
                    <th>Reasons</th>
                </tr>
            </thead>
            <tbody>
                ${rowsHtml}
            </tbody>
        `;

        $('#addictionData').html(tableHtml);
    }

    function getTimeElapsedDisplay(quitDate, now) {
        let diff = Math.abs(now - quitDate);
        let days = Math.floor(diff / (1000 * 60 * 60 * 24));
        diff -= days * (1000 * 60 * 60 * 24);

        let hours = Math.floor(diff / (1000 * 60 * 60));
        diff -= hours * (1000 * 60 * 60);

        let mins = Math.floor(diff / (1000 * 60));
        diff -= mins * (1000 * 60);

        let secs = Math.floor(diff / (1000));
        const formattedSecs = secs.toString().padStart(2, '0');
        const formattedMins = mins.toString().padStart(2, '0');
        const formattedHours = hours.toString().padStart(2, '0');

        if (quitDate < now) {
            return `${days} days, ${formattedHours}:${formattedMins}:${formattedSecs}`;
        } else {
            return `${days + 1} days until quit date.`; // Adding 1 because days is floored
        }
    }


    function updateSleepTableDisplay(sleepSchedule) {
        console.log("from dashboard.js: " +sleepSchedule)
        let tableRows = sleepSchedule.map((schedule) => {
            return `
                <tr>
                    <td>${schedule.bedtime}</td>
                    <td>${schedule.waketime}</td>
                </tr>
            `;
        }).join('');

        const tableHtml = `
            <thead>
                <tr>
                    <th>Bedtime</th>
                    <th>Waketime</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows}
            </tbody>
        `;

        $('#sleepData').html(tableHtml);
    }

    

    function createSavingsDisplay(savings_money, quitDate, now) {
        let daysElapsed = Math.ceil((now - quitDate) / (1000 * 60 * 60 * 24));
        if (quitDate > now) {
            savingsDisplay = `$${savings_money}/day`;
        } else {
            savingsDisplay = `$${savings_money * (daysElapsed)} saved so far`;
        }
        return savingsDisplay;
    }

    function fetchSleep() {
        $.get('/getSleep', function (result) {
            if (result.success) {
                const sleepSchedule = result.sleepSchedule;
                updateSleepTableDisplay(sleepSchedule);
            } else {
                alert('Failed to fetch sleep data.');
            }
        });
    }
    fetchSleep();

});