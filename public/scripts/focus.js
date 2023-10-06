$(document).ready(function () {
    $("#navbar").load("/pages/navbar.html");
    $("#footer").load("/pages/footer.html");

    let tasks = [];
    
    // // Form submission event
    // $("#taskForm").on('submit', function (e) {
    //     e.preventDefault();
        
    //     // Get the task name
    //     let taskName = $("#taskName").val().trim();
    //     let taskDescription = $("#taskDescription").val().trim();
        
    //     // Check if taskName is not empty
    //     if (taskName && taskDescription) {
    //         tasks.push({ name: taskName, description: taskDescription });
    //         updateTable();
    //         $("#taskName").val(''); // Clear the input field
    //         $("#taskDescription").val('');
    //     }
    // });

    $("#modalTaskForm").on('submit', function (e) {
        e.preventDefault();
      
        let taskName = $("#modalTaskName").val().trim();
        let taskDescription = $("#modalTaskDescription").val().trim();
        let taskDuration = $("#taskDuration").val().trim();
      
        if (taskName && taskDescription && taskDuration) {
          tasks.push({ name: taskName, description: taskDescription, duration: taskDuration });
          updateTable();
          $("#modalTaskName").val('');
          $("#modalTaskDescription").val('');
          $("#taskDuration").val('');
          $("#taskModal").modal('hide'); // Close the modal
        }
      });

    function updateTable() {
        let tableBody = $("#taskTableBody");
        tableBody.empty(); // Clear current rows
        
        tasks.forEach((task, index) => {
            let row = `<tr>
                         <th scope="row">${index + 1}</th>
                         <td>${task.name}</td>
                         <td>${task.description}</td>
                         <td>${task.duration} hours</td>
                         <td><span id="timer-${index}">00:00</span></td>
                     <td>
                       <button class="btn btn-success start-pause" data-index="${index}" data-status="start">Start</button>
                       <button class="btn btn-warning restart" data-index="${index}">Restart</button>
                     </td>
                       </tr>`;
            tableBody.append(row);
          });
          attachEventHandlers();
    }

    function attachEventHandlers() {
      // Start/Pause button handler
      $(".start-pause").click(function() {
          let btn = $(this);
          let index = btn.data("index");
          let status = btn.data("status");
          let timerElement = $(`#timer-${index}`);
          let duration = tasks[index].duration * 60;  
  
          if (status === "start") {
              btn.data("status", "pause");
              btn.text("Pause");
              tasks[index].interval = setInterval(function() {
                  if (duration > 0) {
                      duration--;
                      let minutes = Math.floor(duration / 60);
                      let seconds = duration % 60;
                      timerElement.text(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
                  } else {
                      clearInterval(tasks[index].interval);
                      btn.text("Done");
                      btn.prop("disabled", true);
                  }
              }, 1000);
          } else {
              btn.data("status", "start");
              btn.text("Start");
              clearInterval(tasks[index].interval);
          }
      });
  
      // Restart button handler
      $(".restart").click(function() {
          let index = $(this).data("index");
          let timerElement = $(`#timer-${index}`);
          let startPauseBtn = $(`.start-pause[data-index="${index}"]`);
          
          if (tasks[index].interval) {
              clearInterval(tasks[index].interval);
          }
  
          timerElement.text("00:00");
          startPauseBtn.text("Start");
          startPauseBtn.data("status", "start");
          startPauseBtn.prop("disabled", false);
      });
  }
});
