import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as dl from "./data_loader.js";

// Build the skeleton first

const mtop = 10,
    mright = 30,
    mbottom = 80,
    mleft = 50,
    width = 1200 - mleft - mright,
    height = 500 - mtop - mbottom;


const root = document.getElementById("scatter_plot");

// Put an svg element in the root
const scatterSvg = d3.select(root)
    .append("svg")
    .attr("width", width + mleft + mright)
    .attr("height", height + mtop + mbottom)
    .append("g")
        .attr("transform", `translate(${mleft}, ${mtop})`);

// Create the dropdowns to change the axis
const x_axis_menu = document.createElement("select");
const y_axis_menu = document.createElement("select");
const color_menu = document.createElement("select");

root.appendChild(document.createElement("br"));
root.appendChild(x_axis_menu);
root.appendChild(y_axis_menu);
root.appendChild(color_menu);



function draw() {
    
    // Set domain mode
    dl.cleanDomain();
    
    // let rotatedData = rotateData(data);
    console.log(dl.dataColumns);
    
    const x_axis_text = "price"
    const y_axis_text = "number_of_reviews"
    
    // Create axis values
    const x_axis = dl.dataColumns["price"].domain
    .range([0, width]);
    
    const y_axis = dl.dataColumns["number_of_reviews"].domain
    .range([height, 0]);
    
    // Create axis elements
    scatterSvg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x_axis))
    .append("text")
    .attr("fill", "#000")
    .attr("x", width / 2)
    .attr("y", 40)
    .attr("text-anchor", "middle")
    .attr("font-size", "12px")
    .text(x_axis_text);
    
    scatterSvg.append("g")
    .call(d3.axisLeft(y_axis))
    .append("text")
    .attr("fill", "#000")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -40)
    .attr("text-anchor", "middle")
    .attr("font-size", "12px")
    .text(y_axis_text);
    
    scatterSvg.append("g")
    .selectAll("dot")
    .data(dl.data.filter(d => d.price != undefined))
    .join("circle")
    .attr("cx", d => x_axis(d.price))
    .attr("cy", d => y_axis(d.number_of_reviews))
    .attr("r", 1)
    .style("fill", "black")
    
}
        
        
// Load data and then call main
dl.loadJsonData("./data/processed/filtered_listings.json", draw);
