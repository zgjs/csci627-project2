import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as dl from "./data_loader.js";


//Width and height
const mtop = 10,
    mright = 30,
    mbottom = 30,
    mleft = 50,
    width = 1200 - mleft - mright,
    height = 500 - mtop - mbottom;

// Store map offset values
let mapSvgOffsetTop = 0;
let mapSvgOffsetLeft = 0;


let svg = d3.select("#multi_bar").style("display", "flex")
.append("svg")
.attr("width", width + mleft + mright)
.attr("height", height + mtop + mbottom)
.attr("style", "background-color: lightgray");

let chosenDataColumns = ["price", "number_of_reviews"];
let chosenLocationColumns = ["West Englewood", "Washington Heights"];

// Calculate the average price per neighbourhood
let realscores = {};
let realcounts = {};
let scores = {};
let counts = {};


function updateGraph() {
    svg.selectAll("*").remove();

    let fx = d3.scaleBand()
        .domain(chosenLocationColumns)
        .range([0, width])
        .padding(0.1); // This may need to be paddingInner

    let x = d3.scaleBand()
        .domain(chosenDataColumns)
        .range([0, fx.bandwidth()])
        .padding(0.5);
    
    let y = d3.scaleLinear()
        .domain([0, 1])
        .range([height, 0]);

    console.log(d3.group(dl.data, d => d.neighbourhood_cleansed))
    svg.append("g")
        .selectAll()
        // .data(d3.group(dl.data, d => d.neighbourhood_cleansed))
        .data(chosenLocationColumns)
        .join("g")
            .attr("transform", (d) => `translate(${fx(d)}, 0)`)
            .attr("loc", d => d)
        .selectAll()
        .data(chosenDataColumns) 
        .join("rect")
            .attr("x", (d, i, e) => {console.log(d, ": ", i, ", ", e); return x(d)})
            .attr("y", (d, i, e) => y(scores[e[0].parentElement.getAttribute("loc")][d]) + mtop)
            .attr("width", x.bandwidth())
            .attr("height", (d, i, e) => y(0) - y(scores[e[0].parentElement.getAttribute("loc")][d]) - mtop)
            .attr("fill", "steelblue")
            .attr("class", "single_bar")
            .attr("data", d => d);
        
    svg.append("g")    
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(fx))

    
    
    let rect = svg.node().getBoundingClientRect();
    mapSvgOffsetTop = rect.top + window.scrollY;
    mapSvgOffsetLeft = rect.left + window.scrollX;

    // create the tooltip
    let tooltip = d3.selectAll("#multi_bar")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background-color", "white")
    .style("border", "1px solid black")
    .style("padding", "5px")
    .style("visibility", "hidden")
    .text("tooltip");

    d3.selectAll(".single_bar")
        .on("mousemove", (e) => {
            let [x, y] = d3.pointer(e, svg.node());
            tooltip
                .style("top", (y + mapSvgOffsetTop) + "px")
                .style("left", (x + 10 + mapSvgOffsetLeft) + "px");
        })
        .on("mouseover", (e) => {
            tooltip.style("visibility", "visible");
            let dataName = e.target.getAttribute("data");
            let locName = e.target.parentElement.getAttribute("loc");
            tooltip.node().innerHTML = "<h3>" + locName + "(" + dataName + ")</h3><p>Relative Average: " + Math.round(scores[locName][dataName] * 100) / 100 + "</p><p>Absolute Average: " 
                + Math.round(realscores[locName][dataName] * 100) / 100 + "</p>";
        })
        .on("mouseout", (e) => {
            tooltip.style("visibility", "hidden");
        })

    console.log("done");
}


dl.loadJsonData("./data/processed/filtered_listings.json", () => {

    // Evaluate averages on location
    // Commonly used columns
    let numericColumns = dl.order.filter(d => dl.dataColumns[d].type == "numeric");
    // Set up the objects for storing data
    for (let n of dl.dataColumns["neighbourhood_cleansed"].fields) {
        realscores[n] = {};
        realcounts[n] = {};
        scores[n] = {};
        counts[n] = {};
        for (let d of numericColumns) {
            realscores[n][d] = 0;
            realcounts[n][d] = 0;
            scores[n][d] = 0;
            counts[n][d] = 0;
        }
    }

    // Add up all values
    for (let d of dl.data) {
        for (let col of numericColumns) {
            if (d[col] != undefined && d[col] != NaN && d[col] <= dl.dataColumns[col].clean_max && d[col] >= dl.dataColumns[col].clean_min) {
                realscores[d.neighbourhood_cleansed][col] += d[col];
                realcounts[d.neighbourhood_cleansed][col] += 1;
            }
        }
    }

    // Calculate averages for each value
    for (let n of dl.dataColumns["neighbourhood_cleansed"].fields) {
        for (let d of numericColumns) {
            realscores[n][d] = realscores[n][d] / realcounts[n][d];
        }
    }

    // Calculate and store relative scores
    for (let d of numericColumns) {
        let largest = 0;
        for (let n of dl.dataColumns["neighbourhood_cleansed"].fields) {
            largest = Math.max(realscores[n][d], largest);
        }
        
        for (let n of dl.dataColumns["neighbourhood_cleansed"].fields) {
            scores[n][d] = realscores[n][d] / largest;
        }
    }

    let dataOptsList = d3.select("#multi_bar")
        .append("div")
            .style("margin", "20px")
            .attr("class", "dataOptsList");
    
    // Select all checkbox
    dataOptsList
        .append("input")
            .attr("type", "button")
            .attr("value", "Select All")
            .on("click", (e) => {
                chosenDataColumns = []
                for (let opt of document.getElementsByClassName("dataOpt")) {
                    opt.checked = true;
                    chosenDataColumns.push(opt.getAttribute("value"));
                }
                updateGraph();
            });
    
    // Select none checkbox
    dataOptsList
        .append("input")
            .attr("type", "button")
            .attr("value", "Select None")
            .on("click", (e) => {
                chosenDataColumns = []
                for (let opt of document.getElementsByClassName("dataOpt")) {
                    opt.checked = false;
                }
                updateGraph();
            });

    dataOptsList.append("br");

    // Update available columns

    for (let col of dl.order.filter((d) => dl.dataColumns[d].type == "numeric")) {
        let opt = dataOptsList.append("label")
            .style("display", "block")
            .style("width", "200px")
            .style("overflow", "hidden")
            .text(col)
            .append("input")
                .style("float", "right")
                .style("vertical-align", "middle")
                .attr("type", "checkbox")
                .attr("class", "dataOpt")
                .attr("value", col)
                .on("change", (e) => {
                    console.log(e);
                    if (e.target.checked) {
                        if (!chosenDataColumns.includes(e.target.getAttribute("value"))) {
                            chosenDataColumns.push(e.target.getAttribute("value"));
                        }
                    } else {
                        if (chosenDataColumns.includes(e.target.value)) {
                            chosenDataColumns = chosenDataColumns.filter(d => d != e.target.value);
                        }
                    }
                    updateGraph();
                });
    }
   
    
    // Location options
    let locOptsList = d3.select("#multi_bar")
        .append("div")
            .attr("class", "locOptsList");
    
    // Select all checkbox
    locOptsList
        .append("input")
            .attr("type", "button")
            .attr("value", "Select All")
            .on("click", (e) => {
                chosenLocationColumns = []
                for (let opt of document.getElementsByClassName("locOpt")) {
                    opt.checked = true;
                    chosenLocationColumns.push(opt.getAttribute("value"));
                }
                updateGraph();
            });
    
    // Select none checkbox
    locOptsList
        .append("input")
            .attr("type", "button")
            .attr("value", "Select None")
            .on("click", (e) => {
                chosenLocationColumns = []
                for (let opt of document.getElementsByClassName("locOpt")) {
                    opt.checked = false;
                }
                updateGraph();
            });

    locOptsList.append("br");

    // Update available columns

    for (let col of dl.dataColumns["neighbourhood_cleansed"].fields) {
        let opt = locOptsList.append("label")
            .style("display", "block")
            .style("width", "200px")
            .style("overflow", "hidden")
            .text(col)
            .append("input")
                .style("float", "right")
                .style("vertical-align", "middle")
                .attr("type", "checkbox")
                .attr("class", "locOpt")
                .attr("value", col)
                .on("change", (e) => {
                    console.log(e);
                    if (e.target.checked) {
                        if (!chosenLocationColumns.includes(e.target.getAttribute("value"))) {
                            chosenLocationColumns.push(e.target.getAttribute("value"));
                        }
                    } else {
                        if (chosenLocationColumns.includes(e.target.value)) {
                            chosenLocationColumns = chosenLocationColumns.filter(d => d != e.target.value);
                        }
                    }
                    updateGraph();
                });
    }
    

    updateGraph();

});

