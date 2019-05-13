var earthquakes = [];
var selectedEarthquakes = [];
var earthquakeIDs = [];
document.onreadystatechange = function () {
    if (document.readyState === 'complete') {
        document.getElementById("displayEarthquakes").addEventListener("click", showEarthquakes);
    }
}

function showEarthquakes() {
    let city;
    let startDate;
    let endDate;
    let radius;
    city = document.getElementById("city").value;
    radius = document.getElementById("radius").value;
    startDate = document.getElementById("startDate").value;
    endDate = document.getElementById("endDate").value;
    let cityLongitude;
    let cityLatitude;
    if (radius < 1 || radius > 500) {
        swal("Radijus mora biti izmedju 1 i 500","","warning");
        return;
    }
    if (new Date(startDate) > new Date(endDate)) {
        swal("Pocetni datum ne moze biti veci od krajnjeg.","","warning");
        return;
    }
    if (new Date(1900, 1, 1) > new Date(startDate) || new Date(2020, 1, 1) < new Date(startDate)) {
        swal("Datum mora biti izmedju 1900. i 2020. godine","","warning");
        return;
    }
    if (new Date(1900, 1, 1) > new Date(endDate) || new Date(2020, 1, 1) <= new Date(endDate)) {
        swal("Datum mora biti izmedju 1900. i 2020. godine","","warning");
        return;
    }
    if (city !== "" && !isNaN(radius) && startDate !== "" && endDate !== "") {
        let firstApi = "http://www.mapquestapi.com/geocoding/v1/address?inFormat=kvp&outFormat=json&location=" + city + "&thumbMaps=false&maxResults=1&location=80401&key=fvBPkCf742T3gS1F755wgbrqjmOxfNcv";
        fetch(firstApi).then((resp) => resp.json()).then(function (data1) {
            cityLongitude = data1.results[0].locations[0].latLng.lng;
            cityLatitude = data1.results[0].locations[0].latLng.lat;
        }).then(function () {
            let secondApi = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=" + startDate + "&endtime=" + endDate + "&latitude=" + cityLatitude + "&longitude=" + cityLongitude + "&maxradiuskm=" + radius;

            fetch(secondApi).then((resp) => resp.json()).then(function (data2) {
                var earthquakeTable = document.getElementById("earthquakeTable");
                let autocompleteDiv = document.getElementById("autocompleteDiv");
                earthquakes = data2.features; try {

                    if (earthquakes.length < 300) {
                        if (earthquakes.length != 0) {
                            var ulPagination = document.getElementById("tablePagination");
                            ulPagination.innerHTML = "";
                            for (let i = 1; i < earthquakes.length / 20 + 1; i++) {

                                ulPagination.innerHTML += `<li id="li-${i}" style="cursor: pointer;display:inline-block;font-size: 30px;font-style: strong;padding-left: 10px;">  ${i}  </li> `;


                            }

                            earthquakeTable.innerHTML = `<tr>
                <th id="tableHeader0" class="tableHeaderField">ID</th>
                <th id="tableHeader1" class="tableHeaderField">Datum i Vreme</th>
                <th id="tableHeader2" class="tableHeaderField">Drzava</th>
                <th id="tableHeader3" class="tableHeaderField">Max intenzitet</th>
                <th id="tableHeader4" class="tableHeaderField">Cunami</th>
                <th id="tableHeader5" class="tableHeaderField">Interval</th>
                <th id="tableHeader6" class="tableHeaderField">Znacajnost</th>
              </tr>`;
                            let counter = 0;
                            let idNumber = 1;
                            for (let i = 0; i < earthquakes.length; i++) {
                                try {
                                    if (counter == 20) {
                                        idNumber++;
                                        counter = 0;
                                    }
                                    if (idNumber == 1) {
                                        earthquakeIDs.push(earthquakes[i].id);
                                        let pom = new Date(earthquakes[i].properties.time);
                                        let date = padDate(pom.getDate()) + "." + padDate(pom.getMonth()) + "." + padDate(pom.getFullYear()) + "<br>" + padDate(pom.getHours()) + ":" + padDate(pom.getMinutes()) + ":" + padDate(pom.getSeconds());
                                        earthquakeTable.innerHTML += `<tr id="tr-${idNumber}" class="tableRow"> <td>${earthquakes[i].properties.net + earthquakes[i].properties.code} </td><td>${date}</td>
                    <td>${earthquakes[i].properties.place}</td>
                    <td>${earthquakes[i].properties.cdi || "/"}</td>
                    <td>${earthquakes[i].properties.tsunami}</td>
                    <td>${earthquakes[i].properties.rms || "/"}</td>
                    <td>${earthquakes[i].properties.sig}</td></tr>`;
                                        counter++;
                                    } else {
                                        earthquakeIDs.push(earthquakes[i].id);
                                        let pom = new Date(earthquakes[i].properties.time);
                                        let date = padDate(pom.getDate()) + "." + padDate(pom.getMonth()) + "." + padDate(pom.getFullYear()) + "<br>" + padDate(pom.getHours()) + ":" + padDate(pom.getMinutes()) + ":" + padDate(pom.getSeconds());
                                        earthquakeTable.innerHTML += `<tr id="tr-${idNumber}" class="tableRow" style="display:none;"> <td>${earthquakes[i].properties.net + earthquakes[i].properties.code} </td><td>${date}</td>
                    <td>${earthquakes[i].properties.place}</td>
                    <td>${earthquakes[i].properties.cdi || "/"}</td>
                    <td>${earthquakes[i].properties.tsunami}</td>
                    <td>${earthquakes[i].properties.rms || "/"}</td>
                    <td>${earthquakes[i].properties.sig}</td></tr>`;
                                        counter++;
                                    }
                                } catch (ex) { swal("Greska prilikom ucitavanja podataka","","warning") };

                            }
                            earthquakeTable.style.display = "block";
                            autocompleteDiv.style.display = "block";
                            document.getElementById("btnDetailsPage").style.display = "block";
                            document.getElementById("tablePagination").style.display = "block";
                            document.getElementById("btnDetailsPage").addEventListener("click", showDetailsPage);
                            autocomplete(document.getElementById("earthquakeInput"), earthquakeIDs);
                            let tableHeaders = document.getElementsByClassName("tableHeaderField");
                            for (let i = 0; i < tableHeaders.length; i++) {
                                tableHeaders[i].addEventListener("click", function (e) { sortTable(e, i) });
                            }
                            for (let i = 1; i < earthquakes.length / 20 + 1; i++) {
                                document.getElementById("li-" + i.toString()).addEventListener("click", function (e) { showTableRows(e, i) });
                            }
                        } else {
                            swal("Ne postoje zemljotresi u datoj pretrazi","","warning");
                        }
                    }
                    else {
                        swal("Precizirajte pretragu zemljotresa","","warning");
                    }
                } catch (ex) { swal("Greska prilikom ucitavanja podataka","","warning") };
            });

        });

    }
    else {
        swal("Morate uneti sve podatke","","warning");
    }
}
function showTableRows(e, i) {
    let tableRows = document.getElementsByClassName("tableRow");
    for (let j = 0; j < tableRows.length; j++) {
        if (tableRows[j].id === "tr-" + i.toString()) {
            tableRows[j].style.display = "";
        }
        else {
            tableRows[j].style.display = "none";
        }
    }
    document.getElementById("btnDetailsPage").style.display = "block";
}
function showDetailsPage() {
    if (selectedEarthquakes.length > 0) {
        var eqData = [];

        for (let i = 0; i < earthquakes.length; i++) {
            for (let j = 0; j < selectedEarthquakes.length; j++) {
                if (earthquakes[i].id === selectedEarthquakes[j]) {
                    eqData.push({
                        earthquake: earthquakes[i]
                    });
                    break;
                }
            }
        }
        sessionStorage.setItem("selectedEarthquakes", JSON.stringify(eqData));
        window.open("earthquake_Details.html", "_self");
    }
    else {
        swal("Niste izabrali nijedan zemljotres","","warning");
    }
}

function addToSelectedList() {
    let earthquake = document.getElementById('earthquakeInput').value;
    let idChosenEarthquake;
    if (earthquake === "") {
        swal("Pogrešno ste izabrali zemljotres","","warning");
        return;
    }
    if (!selectedEarthquakes.includes(earthquake)) {
        if (earthquakeIDs.includes(earthquake)) {
            selectedEarthquakes.push(earthquake);
            idChosenEarthquake = earthquakeIDs.indexOf(earthquake);
            earthquakeIDs.splice(idChosenEarthquake, 1);
            autocomplete(document.getElementById("earthquakeInput"), earthquakeIDs);
            showSelectedEarthquakes();
        }
        else {
            swal("Pogrešno ste izabrali zemljotres","","warning");
            showSelectedEarthquakes();
        }
    }
    else {
        swal("Ovaj zemljotres je već unet u listu","","warning");
        showSelectedEarthquakes();
    }
    document.getElementById('earthquakeInput').value = "";

}

function showSelectedEarthquakes() {
    document.getElementById("selectedEarthquakes").innerHTML = "";
    selectedEarthquakes.map(equake => document.getElementById("selectedEarthquakes").innerHTML += `<li class="list-group-item" >${equake}<button type="button" style="float:right;" class="btnErt" id="${equake}">X</button></li>`);
    var btnArr = document.getElementsByClassName("btnErt");
    for (let i = 0; i < btnArr.length; i++) {
        btnArr[i].addEventListener("click", function (e) { removeFromSelected(e) });
    }
}
function removeFromSelected(e) {
    let earthquake = e.target.id;
    let earthquakeToRemoveID = selectedEarthquakes.indexOf(earthquake);
    earthquakeIDs.push(earthquake);
    earthquakeIDs.sort();
    autocomplete(document.getElementById("earthquakeInput"), earthquakeIDs);
    selectedEarthquakes.splice(earthquakeToRemoveID, 1);
    showSelectedEarthquakes();
}
function padDate(n) {
    if (n < 10)
        return "0" + n.toString();
    else
        return n.toString();
}

function autocomplete(inp, arr) {
    var currentFocus;
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);
        for (i = 0; i < arr.length; i++) {
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                b = document.createElement("DIV");
                b.setAttribute("class", "child");
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                b.addEventListener("click", function (e) {
                    inp.value = this.getElementsByTagName("input")[0].value;
                    addToSelectedList();
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            currentFocus++;
            addActive(x);
        } else if (e.keyCode == 38) {
            currentFocus--;
            addActive(x);
        } else if (e.keyCode == 13) {
            closeAllLists();
            e.preventDefault();
            if (currentFocus > -1) {
                if (x) x[currentFocus].click();

            }
        }
    });
    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}
function sortTable(e, n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("earthquakeTable");
    switching = true;
    dir = "asc";
    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;
        } else {
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}