$(document).ready(function () {
  $("#navbar").load("/pages/navbar.html");
  $("#footer").load("/pages/footer.html");
  $('#searchBtn').click(function () {
    let query = $('#searchQuery').val();
    fetchNutritionData(query);
  });
});

function fetchNutritionData(query) {
  const API_KEY = 'h2vuZbeahobNA72PQX0a5pGfeXrekXHQ4AnbQmBK';
  const url = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${API_KEY}&query=${query}&pageSize=5`;

  $.get(url, function (data) {
    displayResults(data);
  });
}

function displayResults(data) {
  let html = '<h3>Top 5 Results</h3>';

  for (let i = 0; i < data.foods.length; i++) {
    const food = data.foods[i];

    const calories = food.foodNutrients.find(nutrient => nutrient.nutrientId === 1008)?.value || "N/A";
    const protein = food.foodNutrients.find(nutrient => nutrient.nutrientId === 1003)?.value || "N/A";
    const carbs = food.foodNutrients.find(nutrient => nutrient.nutrientId === 1005)?.value || "N/A";
    const fat = food.foodNutrients.find(nutrient => nutrient.nutrientId === 1004)?.value || "N/A";
    const servingSize = food.servingSize || "N/A";
    const servingSizeUnit = food.servingSizeUnit || "N/A";

    html += `
          <div class="card mb-3">
              <div class="card-body">
                  <h5 class="card-title">${food.description}</h5>
                  <p>Serving Size: ${servingSize} ${servingSizeUnit}</p>
                  <p>Calories: ${calories}</p>
                  <p>Protein: ${protein}g</p>
                  <p>Carbs: ${carbs}g</p>
                  <p>Fat: ${fat}g</p>
              </div>
          </div>
      `;
  }

  $('#results').html(html);
}

