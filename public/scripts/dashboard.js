$(document).ready(function () {
    $("#navbar").load("/pages/navbar.html");
    $("#footer").load("/pages/footer.html");
    $.get('/getAddiction', function (result) {
        if (result.success) {
            const data = result.data;
            const html = `
                <h3>Addiction: ${data.addiction_name}</h3>
                <p>Quit Date: ${data.quit_date}</p>
                <p>Savings: ${data.savings_money}</p>
                <p>Phone: ${data.phone}</p>
                <p>Reasons: ${data.reasons}</p>
            `;
            $('#addictionData').html(html);

            let quitDate = new Date(data.quit_date);
            let now = new Date();

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

                    document.getElementById('timerDisplay').innerText = `${days} Days, ${hours}:${mins}:${secs} elapsed since quit date`;
                }, 1000);
            } else {
                document.getElementById('timerDisplay').innerText = "N/A";
            }
        }
    });

});