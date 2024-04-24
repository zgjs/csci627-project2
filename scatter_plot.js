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


function draw() {
    
    // Set domain mode
    dl.cleanDomain();
    
    // let rotatedData = rotateData(data);
    //console.log(dl.dataColumns);
    
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

export const redraw = () => {
    // Set domain mode
    dl.cleanDomain();
    
    // let rotatedData = rotateData(data);
    //console.log(dl.dataColumns);
    
    const x_axis_element = document.getElementById("x_axis")
    const y_axis_element = document.getElementById("y_axis")
    // const color_element = document.getElementById("color_attribute")
    const x_axis_name = x_axis_element.value
    const y_axis_name = y_axis_element.value
    // const color_attribute_name = color_element.value
    const x_axis_text = x_axis_element.options[x_axis_element.selectedIndex].text;
    const y_axis_text = y_axis_element.options[y_axis_element.selectedIndex].text;
    //console.log([x_axis_name, y_axis_name, x_axis_text, y_axis_text])
    //return;
    
    // Create axis values
    const x_axis = dl.dataColumns[x_axis_name].domain
    .range([0, width]);
    
    const y_axis = dl.dataColumns[y_axis_name].domain
    .range([height, 0]);

    // const color_attribute = dl.dataColumns[color_attribute_name].domain
    // .range(["blue", "green"]); //, "yellow", "orange", "red", "magenta"]);
    
    // clear scatterSvg
    scatterSvg.selectAll("*").remove();

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
    .data(dl.data.filter(d => d[x_axis_name] != undefined && d[y_axis_name] != undefined))
    .join("circle")
    .attr("cx", d => x_axis(d[x_axis_name]))
    .attr("cy", d => y_axis(d[y_axis_name]))
    .attr("r", 1)
    .style("fill", "black")
}

window.redraw=redraw;
        
// Load data and then call main
// dl.loadJsonData("./data/processed/filtered_listings.json", draw); // All interesting fields
dl.loadJsonData("./data/processed/filtered_listings.json", draw); // required fields only

document.getElementById("scatterplotform").addEventListener("submit", function(event){
    event.preventDefault();
    redraw();   
});
