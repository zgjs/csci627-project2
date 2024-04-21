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

// Put an svg element in the root
const svg = d3.select(root)
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


// List of columns to use; This list is used for iterating over the data when parsing
const order = ["price", "number_of_reviews"];
let dataColumns = {};

// Store calculated column metadata
class ColumnInfo {
    constructor(name, type) {
        this.name = name;
        this.type = type;
        this.min;
        this.max;
        this.clean_min;
        this.clean_max;
        this.domain;
        this.data = [];
    }

}

// Hard  
for (let col of order) {
    if (col == "price") {
        dataColumns[col] = new ColumnInfo(col, "numeric");
    } else if (col == "number_of_reviews") {
        dataColumns[col] = new ColumnInfo(col, "numeric");
    }
}

function calcExtrema() {
    for (let col of order) {
        if (dataColumns[col].type == "numeric") {
            console.log(col)
            let temp = dataColumns[col].data  // Create a sorted copy for analysis
                .filter(d => d != null && d != undefined && d != NaN)
                .toSorted((a, b) => a - b);  // We may be wasting resoures making 2 copies?
            dataColumns[col].min = temp[0];
            dataColumns[col].max = temp[temp.length - 1];

            // Use IQR to remove outliers
            // (Find range between 25% and 75% and then use that distance to decide on how much farther is considered an outlier)
            // We can tweek these if we want to expand the range, but this is standard in statistics
            let q1 = temp[Math.floor(temp.length / 4)];
            let q3 = temp[Math.ceil(temp.length * 3 / 4)];
            let iqr = q3 - q1;

            let iqr_scale = 10  // This is usually 1.5, but it has been increased to remove more outliers
            let upper_bound = q3 + iqr_scale * iqr;  // These may go past the actual max and min
            let lower_bound = q1 - iqr_scale * iqr;

            dataColumns[col].clean_min = Math.min(...temp.filter(d => d >= lower_bound));
            dataColumns[col].clean_max = Math.max(...temp.filter(d => d <= upper_bound));
        }
    }
}

// These two can be used to toggle between domain modes
function normalDomain() {
    for (let col of order) {
        if (dataColumns[col].type == "numeric") {
            dataColumns[col].domain = d3.scaleLinear()
                .domain([dataColumns[col].min, dataColumns[col].max])
        }
    }
}

function cleanDomain() {
    for (let col of order) {
        if (dataColumns[col].type == "numeric") {
            dataColumns[col].domain = d3.scaleLinear()
                .domain([dataColumns[col].clean_min, dataColumns[col].clean_max])
        }
    }
}



d3.json("data/processed/reviews_price.json").then(data => {
// d3.csv("data/listings.csv").then(data => {

    // parse the data and store what is needed
    console.log(data);
    for (let row of data) {
        for (let col of order) {
            dataColumns[col].data.push(row[col]);
        }
    }

    // Get limits
    calcExtrema();
    cleanDomain();

    // let rotatedData = rotateData(data);
    console.log(dataColumns);

    const x_axis_text = "price"
    const y_axis_text = "number_of_reviews"

    // Create axis values
    const x_axis = dataColumns["price"].domain
        .range([0, width]);
    
    const y_axis = dataColumns["number_of_reviews"].domain
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
        .join("circle")
            .attr("cx", d => x_axis(d.price))
            .attr("cy", d => y_axis(d.number_of_reviews))
            .attr("r", 1)
            .style("fill", "black")

});

