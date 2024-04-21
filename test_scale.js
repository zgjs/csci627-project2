import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const svg = d3.select("#map")
    .selectAll("svg")
    .data([null])
    .join("svg")
    .attr("width", 1000)
    .attr("height", 800)
    .attr("style", "background-color: #c9e8fd");



function map_scale(factor, tx, ty) {
    return d3.geoTransform({point: function(x, y) {
        this.stream.point(x * factor + tx, -y * factor + ty);
    }})
}


let root = document.getElementById("map");
let zoom = 1940;
let tx = 170700;
let ty = 81550;
// let scale = 1  // Used to speed up zooming in by doing it by factors
// zoom *= scale 
// tx *= scale
// ty *= scale
let d = 10

function map(data) {
    svg
        .selectAll("path.country")
        .data(data)
        .join("path")
        .attr("d", d3.geoPath(map_scale(zoom, tx, ty)))  // These are default values to show the usa
        .attr("class", "country")
        .attr("stroke", "black")
        .attr("fill", "white");
    console.log(data);
}


fetch("./data/neighbourhoods.geojson")
// fetch("https://gist.githubusercontent.com/sdwfrost/d1c73f91dd9d175998ed166eb216994a/raw/e89c35f308cee7e2e5a784e1d3afc5d449e9e4bb/counties.geojson")
    .then(response => response.json())
    .then(data => {
        map(data.features);
    })


window.addEventListener("wheel", function(e) {    
    zoom -= e.deltaY * d / 1000;
    svg.selectAll("path.country")
        .attr("d", d3.geoPath(map_scale(zoom, tx, ty)));
    updateInfo();
}
)

window.addEventListener("keydown", function(e) {
    // console.log(e)
    if (e.key === "ArrowUp") {
        ty -= d;
    } else if (e.key === "ArrowDown") { 
        ty += d;
    } else if (e.key === "ArrowLeft") {
        tx -= d;
    } else if (e.key === "ArrowRight") {
        tx += d;
    } else if (e.key === "PageUp") {
        d *= 0.1;
    } else if (e.key === "PageDown") {
        d /= 0.1;
    }
    svg.selectAll("path.country")
        .attr("d", d3.geoPath(map_scale(zoom, tx, ty)));
    updateInfo();
})


let infoElement = document.createElement("p");
root.appendChild(infoElement);

function updateInfo() {
    infoElement.textContent = `Zoom: ${zoom}\nTranslate: ${tx}, ${ty}\nd: ${d}`;
}






