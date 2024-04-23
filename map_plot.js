import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as dl from "./data_loader.js";


//Width and height
let w = 1000;
let h = 800;

// Set projection parameters
let mapZoom = 1940;
let mapTx = 170700;
let mapTy = 81550;
let projection = d3.geoTransform({point: function(x, y) {
    this.stream.point(x * mapZoom + mapTx, -y * mapZoom + mapTy);
}})

// Store map offset values
let mapSvgOffsetTop = 0;
let mapSvgOffsetLeft = 0;

//Create SVG
let mapSvg = d3.select("#map")
.append("svg")
.attr("width", w)
.attr("height", h)
.attr("style", "background-color: #c9e8fd");


// Draws the inital outline
function renderMap(data) {
    mapSvg.selectAll("path")
        .data(data)
        .join("path")
        .attr("d", d3.geoPath(projection))
        .attr("class", "county")
        .attr("stroke", "black")
        .attr("fill", "white")
        .attr("neigborhood", (d) => {return d.properties.neighbourhood});
    
    let rect = mapSvg.node().getBoundingClientRect();
    mapSvgOffsetTop = rect.top + window.scrollY;
    mapSvgOffsetLeft = rect.left + window.scrollX;
    console.log("render", mapSvgOffsetTop, mapSvgOffsetLeft);
}

// Load data and map
dl.loadJsonData("./data/processed/filtered_listings.json", () => {
    fetch("./data/neighbourhoods.geojson")
        .then(response => {response.json()} )
        .then(data => {
            renderMap(data.features);
            
            // Calculate the average price per neighbourhood
            let scores = {};
            let counts = {};
            for (let n of dl.dataColumns["neighbourhood_cleansed"].fields) {
                scores[n] = 0;
                counts[n] = 0;
            }

            for (let d of dl.data.filter(d => d.price != undefined && d.price != NaN && d.price < 5000)) {
                scores[d.neighbourhood_cleansed] += d.price;
                counts[d.neighbourhood_cleansed] += 1;
            }

            for (let n of dl.dataColumns["neighbourhood_cleansed"].fields) {
                scores[n] /= counts[n];
            }
            
            let colorExtent = d3.extent(Object.values(scores));
            // Create color scale
            let color = d3.scaleLinear()
                .domain(colorExtent)
                .range(["white", "red"]);
                
            // Update the colors
            mapSvg.selectAll("path.county")
                .attr("fill", d => color(scores[d.properties.neighbourhood]));
            
            // Create the legend            
            let defs = mapSvg.append("defs");

            let linearGradient = defs.append("linearGradient")
                .attr("id", "linear-gradient")
                .attr("x1", "0%")
                .attr("y1", "0%")
                .attr("x2", "100%")
                .attr("y2", "0%");
            
            linearGradient.append("stop")
                .attr("offset", "0%")
                .attr("stop-color", "white");
            
            linearGradient.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", "red");
            
            let legend = mapSvg.append("g")
            
            legend.append("rect")
                .attr("transform", "translate(20, 600)")
                .attr("width", 200)
                .attr("height", 20)
                .style("fill", "url(#linear-gradient)");
            
            legend.append("text")
                .attr("transform", "translate(85, 590)")
                .text("Average Price");

            legend.append("text")
                .attr("transform", "translate(20, 635)")
                .text(Math.round(colorExtent[0] * 100) / 100);
            
            legend.append("text")
                .attr("transform", "translate(175, 635)")
                .text(Math.round(colorExtent[1] * 100) / 100);


            // create the tooltip
            let tooltip = d3.selectAll("#map")
                .append("div")
                .attr("class", "tooltip")
                .style("position", "absolute")
                .style("background-color", "white")
                .style("border", "1px solid black")
                .style("padding", "5px")
                .text("tooltip");
            
            d3.selectAll(".county")
                .on("mousemove", (e) => {
                    // console.log(d3.pointer(e))
                    let [x, y] = d3.pointer(e);
                    console.log("move", mapSvgOffsetLeft, mapSvgOffsetTop);
                    tooltip
                        .style("top", (y + mapSvgOffsetTop) + "px")
                        .style("left", (x + 10 + mapSvgOffsetLeft) + "px");
                })
                .on("mouseover", (e) => {
                    tooltip.style("visibility", "visible");
                    let nName = e.target.getAttribute("neigborhood");
                    tooltip.node().innerHTML = "<h3>" + nName + "</h3><p>Average Price: " + Math.round(scores[nName] * 100) / 100,  + "</p>";
                })
                .on("mouseout", (e) => {
                    tooltip.style("visibility", "hidden");
                })
            
        })
});



