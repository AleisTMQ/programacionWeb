$(document).ready(function () {
    $('#searchButton').on('click', function () {
        var model = $('#carModel').val();
        $.ajax({
            method: 'GET',
            url: 'https://api.api-ninjas.com/v1/cars?model=' + model,
            headers: { 'X-Api-Key': 'hrEkREspQVslTUoNTeXhgQ==Iw80tjCjAyM52bVB'},
            contentType: 'application/json',
            success: function (result) {
                displayCarInfo(result);
            },
            error: function ajaxError(jqXHR) {
                console.error('Error: ', jqXHR.responseText);
            }
        });
    });

    function displayCarInfo(cars) {
        var carInfoDiv = $('#carInfo');
        carInfoDiv.empty();
        if (cars.length > 0) {
            cars.forEach(function (car) {
                var carCard = `
                <div class="col-md-4 car-card">
                    <div class="card">
                        <img src="https://via.placeholder.com/300" alt="Car Image" class="card-img-top car-img">
                        <div class="card-body">
                            <h5 class="card-title">${car.make} ${car.model} (${car.year})</h5>
                            <p class="card-text">MPG en ciudad: ${car.city_mpg}</p>
                            <p class="card-text">MPG en carretera: ${car.highway_mpg}</p>
                            <p class="card-text">Cilindros: ${car.cylinders}</p>
                            <p class="card-text">Desplazamiento: ${car.displacement} L</p>
                        </div>
                    </div>
                </div>
                `;
                carInfoDiv.append(carCard);

                fetchCarImage(car.make + ' ' + car.model, carInfoDiv.find('.car-card:last .car-img'));
            });
        } else {
            carInfoDiv.append('<p>No se encontraron resultados.</p>');
        }
    }

    function fetchCarImage(query, imgElement) {
        var url = `https://www.googleapis.com/customsearch/v1?key=AIzaSyAZTglMypAoX-Vtu3I9ksO8-6Y3B1xc3go&cx=600bff757c05a48e5&q=${query}&searchType=image&num=1`;
        $.get(url, function (data) {
            if (data.items && data.items.length > 0) {
                imgElement.attr('src', data.items[0].link);
            }
        });
    }
});
