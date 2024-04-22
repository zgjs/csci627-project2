import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// List of columns to use; This list is used for iterating over the data when parsing
export const order = ["price", "number_of_reviews"];
export let dataColumns = {};
export let data = [];

// Store calculated column metadata
export class ColumnInfo {
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

// Hard code these
for (let col of order) {
    if (col == "price") {
        dataColumns[col] = new ColumnInfo(col, "numeric");
    } else if (col == "number_of_reviews") {
        dataColumns[col] = new ColumnInfo(col, "numeric");
    }
}

export function calcExtrema() {
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
export function normalDomain() {
    for (let col of order) {
        if (dataColumns[col].type == "numeric") {
            dataColumns[col].domain = d3.scaleLinear()
                .domain([dataColumns[col].min, dataColumns[col].max])
        }
    }
}

export function cleanDomain() {
    for (let col of order) {
        if (dataColumns[col].type == "numeric") {
            dataColumns[col].domain = d3.scaleLinear()
                .domain([dataColumns[col].clean_min, dataColumns[col].clean_max])
        }
    }
}

export function loadJsonData(path, callback) {
    fetch(path)
        .then(response => response.json())
        .then(data_val => {
            // store data
            data = data_val
            for (let row of data_val) {
                for (let col of order) {
                    dataColumns[col].data.push(row[col]);
                }
            }
            
            // Do our processing and set domains
            calcExtrema();
            normalDomain();

            // Call the callback to run main code
            callback();
        });
}

