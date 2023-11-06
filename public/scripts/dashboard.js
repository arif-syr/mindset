$(document).ready(function () {
    $("#navbar").load("/pages/navbar.html");
    $("#footer").load("/pages/footer.html");
    $.get('/getAddiction', function (result) {
        if (result.success) {
            const data = result.data;

            let quitDate = new Date(data.quit_date);
            let now = new Date();
            let savingsDisplay = "";
            let timeElapsedDisplay = "";

            // if (quitDate > now) {
            //     savingsDisplay = `$${data.savings_money}/day`;
            // } else {
            //     savingsDisplay = `$${data.savings_money * daysElapsed} saved so far`;
            // }

            $('#addictionName').text(`Addiction: ${data.addiction_name}`);
            updateAddictionTableDisplay(data, savingsDisplay, "N/A");

            setInterval(function () {
                const timeUTC = new Date();
                const offset = 7 * 60 * 60 * 1000; // 7 hours difference from UTC
                const now = new Date(timeUTC - offset);
                savingsDisplay = createSavingsDisplay(data.savings_money, quitDate, now);
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
                    timeElapsedDisplay = `${days} days, ${formattedHours}:${formattedMins}:${formattedSecs}`;
                } else {
                    timeElapsedDisplay = `${days + 1} days until quit date.` // Adding 1 because days is floored
                }

                updateAddictionTableDisplay(data, savingsDisplay, timeElapsedDisplay);

            }, 1000);
        }
    });

    function updateAddictionTableDisplay(data, savingsDisplay, timeElapsedDisplay) {
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
                <tr>
                    <td>${data.quit_date}</td>
                    <td>${timeElapsedDisplay}</td>
                    <td>${savingsDisplay}</td>
                    <td>${data.phone}</td>
                    <td>${data.reasons}</td>
                </tr>
            </tbody>
        `;

        $('#addictionData').html(tableHtml);
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