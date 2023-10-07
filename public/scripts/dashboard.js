$(document).ready(function () {
    $("#navbar").load("/pages/navbar.html");
    $("#footer").load("/pages/footer.html");
    $.get('/getAddiction', function (result) {
        if (result.success) {
            const data = result.data;

            let quitDate = new Date(data.quit_date);
            let now = new Date();
            let daysElapsed = Math.ceil((now - quitDate) / (1000 * 60 * 60 * 24));
            let savingsDisplay = "";
            let timeElapsedDisplay = "";

            if (quitDate > now) {
                savingsDisplay = `$${data.savings_money}/day`;
            } else {
                savingsDisplay = `$${data.savings_money * daysElapsed} saved so far`;
            }

            $('#addictionName').text(`Addiction: ${data.addiction_name}`);
            updateAddictionTableDisplay(data, savingsDisplay, "N/A");

            if (quitDate < now) {
                setInterval(function () {
                    now = new Date();
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

                    timeElapsedDisplay = `${days} Days, ${formattedHours}:${formattedMins}:${formattedSecs}`;

                    updateAddictionTableDisplay(data, savingsDisplay, timeElapsedDisplay);

                }, 1000);
            }
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


});