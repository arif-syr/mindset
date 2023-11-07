$(document).ready(function () {
    $("#navbar").load("/pages/navbar.html");
    $("#footer").load("/pages/footer.html");
    $.get('/getAddiction', function (result) {
        if (result.success) {
            updateAddictionTableDisplay(result.data);

            setInterval(function () {
                result.data.forEach((data, index) => {
                    const quitDate = new Date(data.quit_date);
                    const now = new Date();
                    const timeElapsedDisplay = getTimeElapsedDisplay(quitDate, now);
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
                    <td>${data.addiction_name}</td>
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
                    <th>Addiction Name</th>
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

    function createBedtimeRoutineForm() {
        const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        let checkboxesHtml = daysOfWeek.map(day => `
          <input type="checkbox" id="${day}" name="bedtimeRoutineDays" value="${day}">
          <label for="${day}">${day}</label><br>
        `).join('');
      
        const formHtml = `
          <form id="bedtimeRoutineForm">
            ${checkboxesHtml}
            <button type="submit">Save Routine</button>
          </form>
        `;
        $('#bedtimeRoutineContainer').html(formHtml);
      
        $('#bedtimeRoutineForm').on('submit', function(e) {
          e.preventDefault();
          const selectedDays = $('input[name="bedtimeRoutineDays"]:checked').map(function() {
            return this.value;
          }).get();
      
          saveBedtimeRoutine(selectedDays);
        });
      }
      
      function saveBedtimeRoutine(days) {
        $.post('/saveBedtimeRoutine', { days: days }, function(result) {
          if (result.success) {
            alert('Bedtime routine saved successfully!');
          } else {
            alert('Failed to save bedtime routine.');
          }
        });
      }

      function checkAndCreateBedtimeRoutineForm() {
        $.get('/getRoutine', function (result) {
            if (result.success) {
                const bedtimeRoutine = result.bedtimeRoutine;
                console.log("this is routine " +bedtimeRoutine.days)
                if (bedtimeRoutine.days.length === 0) {
                    createBedtimeRoutineForm();
                } else {
                    displayBedtimeRoutineTable(bedtimeRoutine.days);
                }
            } else {
                alert('Failed to fetch bedtime routine.');
            }
        });
    }
    checkAndCreateBedtimeRoutineForm();

    function displayBedtimeRoutineTable(bedtimeRoutineDays) {
        // Create the table headings using the days of the routine
        const tableHeadings = bedtimeRoutineDays.map(day => `<th>${day}</th>`).join('');
    
        // Generate the ticks for each day
        const tableTicks = bedtimeRoutineDays.map(() => `<td>✔️</td>`).join('');
    
        // Assemble the table HTML
        const tableHtml = `
            <table id="bedtimeRoutineTable">
                <thead>
                    <tr>
                        <th colspan="${bedtimeRoutineDays.length}">Sleep Schedule followed on</th>
                    </tr>
                    <tr>${tableHeadings}</tr>
                </thead>
                <tbody>
                    <tr>${tableTicks}</tr>
                </tbody>
            </table>
        `;
    
        // Insert the table HTML into the designated container
        $('#bedtimeRoutineContainer').html(tableHtml);
    }
});