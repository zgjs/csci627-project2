import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as accounting from "https://cdn.skypack.dev/accounting-js";

// Build the skeleton first

const mtop = 10,
    mright = 30,
    mbottom = 80,
    mleft = 50,
    width = 1200 - mleft - mright,
    height = 500 - mtop - mbottom;


const root = document.getElementById("scatter_plot");

const svg = d3.select(root)
    .append("svg")
    .attr("width", width + mleft + mright)
    .attr("height", height + mtop + mbottom)
    .append("g")
        .attr("transform", `translate(${mleft}, ${mtop})`);

const x_axis_menu = document.createElement("select");
const y_axis_menu = document.createElement("select");
const color_menu = document.createElement("select");

root.appendChild(document.createElement("br"));
root.appendChild(x_axis_menu);
root.appendChild(y_axis_menu);
root.appendChild(color_menu);


function dFix(dollar) {
    // console.log(dollar);
    return parseFloat(dollar.replace(/[$,]+/g,""));
}

function log(d) {
    console.log(d);
    return 1
}


d3.csv("data/processed/reviews_price.csv").then(data => {
// d3.csv("data/listings.csv").then(data => {

    // Get limits
    const x_axis_text = "price"
    // const x_max = d3.max(data, d => dFix(d.price));
    const x_max = 5000
    const x_min = 0
    const y_axis_text = "number_of_reviews"
    // const y_max = d3.max(data, d => parseFloat(d.number_of_reviews));
    const y_max = 1000
    const y_min = 0

    // Create axis values
    const x_axis = d3.scaleLinear()
        .domain([x_min, x_max])
        .range([0, width]);
    
    const y_axis = d3.scaleLinear()
        .domain([y_min, y_max])
        .range([height, 0]);
    
    // Create axis elements
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x_axis))
        .append("text")
            .attr("fill", "#000")
            .attr("x", width / 2)
            .attr("y", 40)
            .attr("text-anchor", "middle")
            .attr("font-size", "12px")
            .text(x_axis_text);
    
    svg.append("g")
        .call(d3.axisLeft(y_axis))
        .append("text")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -40)
            .attr("text-anchor", "middle")
            .attr("font-size", "12px")
            .text(y_axis_text);
        
    svg.append("g")
        .selectAll("dot")
        .data(data.filter(d => d.price != undefined))
        // .data(data)
        .join("circle")
            .attr("cx", d => x_axis(dFix(d.price)))
            .attr("cy", d => y_axis(d.number_of_reviews))
            // .attr("transform", d => `translate(${x_axis(dFix(d.price))}, ${y_axis(d.number_of_reviews)})`)
            .attr("r", 1)
            .style("fill", "black")
            


});

