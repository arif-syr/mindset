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
                         <td><a href="/pages/startTask.html?duration=${task.duration}" class="btn btn-success">Start Task</a></td>
                       </tr>`;
            tableBody.append(row);
          });
    }
});
