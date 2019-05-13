var earthquakes;
var detailsApiData;
loadChart();
async function loadChart() {
    earthquakes = JSON.parse(sessionStorage.getItem("selectedEarthquakes"));
    let chart = document.getElementById("earthquakesChart");
    let details = document.getElementById("earthquakesDetails");

    chart.innerHTML = `<h3 >Prikaz odnosa magnituda: </h3>`;
    for (let i = 0; i < earthquakes.length; i++) {
        let mag = earthquakes[i].earthquake.properties.mag;
        let boja;
        if (mag === null) mag = 0;
        if (mag < 2.5) boja = "#00ff00";
        else if (mag >= 2.5 && mag < 5.5) boja = "#32cd32";
        else if (mag >= 5.5 && mag < 6.1) boja = "#ffff00";
        else if (mag >= 6.1 && mag < 7) boja = "#FFD700";
        else if (mag >= 7.0 && mag < 8.0) boja = "#ffa500";
        else if (mag > 8.0) boja = "#ff0000";
        chart.innerHTML += ` <div class="row"><label style="width:170px;float:left; background-color:white;background:white; z-index:1; margin-right: 10px;font-size:30px;">${earthquakes[i].earthquake.id}:  </label>
        <div style="width: ${mag * 7}em; float:left; padding-top:10px; padding-bottom:10px;"> 
                <div id="${i}"style=" : -webkit-animation-name: animMove; /* Safari 4.0 - 8.0 */
                -webkit-animation-duration: 4s; /* Safari 4.0 - 8.0 */
                animation-name: animMove;
                animation-duration: 4s;         
                text-align:center;
                display:block;
                height: 100%;
                width: ${mag * 7}em;
                background-color: ${boja};">
                ${mag}
                </div>
         </div> <br></div>`;
    }

    details.innerHTML += `<div class="jumbotron jumbotron-fluid" style="padding-top:20px;"> <div class="container" id="detailsText"></div></div>`;
    for (let i = 0; i < earthquakes.length; i++) {
        let detailsURL = earthquakes[i].earthquake.properties.detail;
        fetch(detailsURL).then((resp) => resp.json()).then(function (data) {
            detailsApiData = data;
        }).then(function () {
            if (detailsApiData.properties.products.geoserve === undefined) {
                if (detailsApiData.properties.products["nearby-cities"] !== undefined) {
                    let nearbyCitiesApiUrl = detailsApiData.properties["nearby-cities"][0].contents["nearby-cities.json"].url;
                    fetchingAsync(nearbyCitiesApiUrl, detailsApiData).then(obj => {
                        let cityArr = obj.data.cities;
                        let earthquake = obj.earthquakeData;
                        let detailsText = document.getElementById("detailsText");
                        if (earthquake.properties.net !== undefined && earthquake.properties.code !== undefined) {
                            detailsText.innerHTML += `<h5 >${earthquake.properties.net}${earthquake.properties.code}</h5>`;
                        }
                        if (earthquake.properties.mag !== undefined) {
                            detailsText.innerHTML += ` <p>Magnituda zemljotresa: ${earthquake.properties.mag}</p>`;
                        }
                        if (earthquake.properties.products.dyfi !== undefined) {
                            detailsText.innerHTML += `<p>Dubina na kojoj je nastao: ${earthquake.properties.products.dyfi[0].properties.depth}km</p>`;
                            detailsText.innerHTML += `<p>Koordinate epicentra: latituda ${earthquake.properties.products.dyfi[0].properties.latitude}, longituda ${earthquake.properties.products.dyfi[0].properties.longitude}</p>`;
                        }

                        if (earthquake.properties.products["impact-text"] !== undefined) {
                            detailsText.innerHTML += `<p>Detaljnije o steti koju je zemljotres napravio: ${earthquake.properties.products["impact-text"][0].contents[""].bytes}<p>`;
                        }
                        detailsText.innerHTML += `<p>Gradovi koje je zemljotres pogodio:</p>`;
                        for (let j = 0; j < cityArr.length; j++) {
                            detailsText.innerHTML += `<p> Grad: ${cityArr[j].name}, udaljenost od epicentra ${cityArr[j].distance}km</p>`;
                        }
                        detailsText.innerHTML += `<hr><hr>`;                        
                    });

                }
                else {
                    let detailsText = document.getElementById("detailsText");
                    if (detailsApiData.properties.net !== undefined && detailsApiData.properties.code !== undefined) {
                        detailsText.innerHTML += `<h5 >${detailsApiData.properties.net}${detailsApiData.properties.code}</h5>`;
                    }
                    if (detailsApiData.properties.mag !== undefined) {
                        detailsText.innerHTML += ` <p>Magnituda zemljotresa: ${detailsApiData.properties.mag}</p>`;
                    }
                    if (detailsApiData.properties.products.dyfi !== undefined) {
                        detailsText.innerHTML += `<p>Dubina na kojoj je nastao: ${detailsApiData.properties.products.dyfi[0].properties.depth}km</p>`;
                        detailsText.innerHTML += `<p>Koordinate epicentra: latituda ${detailsApiData.properties.products.dyfi[0].properties.latitude}, longituda ${detailsApiData.properties.products.dyfi[0].properties.longitude}</p>`;
                    }

                    if (detailsApiData.properties.products["impact-text"] !== undefined) {

                        detailsText.innerHTML += `<p>Detaljnije o steti koju je zemljotres napravio: ${detailsApiData.properties.products["impact-text"][0].contents[""].bytes}<p>`;
                    }
                    detailsText.innerHTML += `<p>Gradovi koje je zemljotres pogodio: <strong>NEMA PODATAKA</strong></p><hr>`;
                }
            }
            else {

                let geoserveApiUrl = detailsApiData.properties.products.geoserve[0].contents["geoserve.json"].url;
                fetchingAsync(geoserveApiUrl, detailsApiData).then(obj => {
                    let cities = obj.data.cities;
                    let earthquake = obj.earthquakeData;
                    let detailsText = document.getElementById("detailsText");
                    if (earthquake.properties.net !== undefined && earthquake.properties.code !== undefined) {
                        detailsText.innerHTML += `<h5 >${earthquake.properties.net}${earthquake.properties.code}</h5>`;
                    }
                    if (earthquake.properties.mag !== undefined) {
                        detailsText.innerHTML += ` <p>Magnituda zemljotresa: ${earthquake.properties.mag}</p>`;
                    }
                    if (earthquake.properties.products.dyfi !== undefined) {
                        detailsText.innerHTML += `<p>Dubina na kojoj je nastao: ${earthquake.properties.products.dyfi[0].properties.depth}km</p>`;
                        detailsText.innerHTML += `<p>Koordinate epicentra: latituda ${earthquake.properties.products.dyfi[0].properties.latitude}, longituda ${earthquake.properties.products.dyfi[0].properties.longitude}</p>`;
                    }

                    if (earthquake.properties.products["impact-text"] !== undefined) {

                        detailsText.innerHTML += `<p>Detaljnije o steti koju je zemljotres napravio: ${earthquake.properties.products["impact-text"][0].contents[""].bytes}<p>`;
                    }
                    detailsText.innerHTML += `<p>Gradovi koje je zemljotres pogodio:</p>`;
                    for (let j = 0; j < cities.length; j++) {
                        detailsText.innerHTML += `<p> Grad: ${cities[j].name}, udaljenost od epicentra ${cities[j].distance}km</p>`;
                    }
                    detailsText.innerHTML += `<hr><hr>`;
                });
            }

        });

    }
}

async function fetchingAsync(url, earthquakeData) {
    let response = await fetch(url);
    let data = await response.json()
    return { data, earthquakeData };
}
document.onreadystatechange = function () {
    if (document.readyState === 'complete') {
        document.getElementById("goBackToIndex").addEventListener("click", function () { window.open("index.html", "_self"); })
    }
}
