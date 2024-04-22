import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";


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



// //Define path generator
// let path = d3.geo.path()
// .projection(projection);

// let color = d3.scale.ordinal()
// .range(['Azure']);

//Create SVG
let svg = d3.select("#map")
.append("svg")
.attr("width", w)
.attr("height", h)
.attr("style", "background-color: #c9e8fd");

function debug(d) {
    console.log(d);
    return [1, 1];
}

function renderMap(data) {
    svg.selectAll("path")
        .data(data)
        .join("path")
        .attr("d", d3.geoPath(projection))
        .attr("class", "county")
        .attr("stroke", "black")
        .attr("fill", "white");
    
    console.log(svg.selectAll("path.county"))
    svg.selectAll("path.county")
        .each(function(d) {
            console.log(d)
            // console.log(d.getBBox())
        })
    // svg.selectAll("path.country")
    //     .data(data)
    //     .join("text")
    //     .attr("x", d => d.properties.centroid[0])
    //     .attr("y", d => d.properties.centroid[1])
    //     .text(d => d.properties.name)
}

// Load map
fetch("./data/neighbourhoods.geojson")
// fetch("https://gist.githubusercontent.com/sdwfrost/d1c73f91dd9d175998ed166eb216994a/raw/e89c35f308cee7e2e5a784e1d3afc5d449e9e4bb/counties.geojson")
    .then(response => response.json())
    .then(data => {
        renderMap(data.features);
    })




// //Load in GeoJSON data
// d3.json("data/neighbourhoods.geojson", (json) => {
    
    
//     //Binding data and creating one path per GeoJSON feature
//     svg.selectAll("path")
//     .data(json.features)
//     .enter()
//     .append("path")
//     .attr("d", path)
//     .attr("stroke", "dimgray")
//     .attr("fill", (d, i) => { return color(i) });
    
//     //States
//     svg.selectAll("text")
//     .data(json.features)
//     .enter()
//     .append("text")
//     .attr("fill", "darkslategray")
//     .attr("transform", (d) => { return "translate(" + debug(d) + ")"; })
//     .attr("text-anchor", "middle")
//     .attr("dy", ".35em")
//     .text((d) => {
//         return d.properties.neighbourhood;
//         });

//     //Append the name
//     svg.append("text")
//         .attr("x", 0)
//         .attr("y", 340)
//         .attr("font-size", 90)
//         .attr("font-weight", "bold")
//         .attr("font-family", "Times New Roman")
//         .attr("text-anchor", "middle")
//         .attr("opacity", 0.5)

// });


