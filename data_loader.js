import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// List of columns to use; This list is used for iterating over the data when parsing
export const order = [
    "accommodates",
    "bathrooms",
    "beds",
    "calculated_host_listings_count",
    "latitude",
    "longitude",
    "neighbourhood_cleansed",
    "number_of_reviews",
    "minimum_nights",
    "price",
    "reviews_per_month",
    "review_scores_rating"
];
export let dataColumns = {};
export let data = [];

// Store calculated column metadata
export class ColumnInfo {
    constructor(name, type) {
        // Numeric
        this.name = name;
        this.type = type;
        this.min;
        this.max;
        this.avg;
        this.clean_min;
        this.clean_max;
        this.clean_avg;
        this.domain;

        // Categorical
        this.fields = []

        this.data = [];
    }

}

// Hard code these
for (let col of order) {
    switch (col) {
        case "accommodates":
        case "bathrooms":
        case "beds":
        case "calculated_host_listings_count":
        case "latitude":
        case "longitude":
        case "number_of_reviews":
        case "minimum_nights":
        case "price":
        case "reviews_per_month":
        case "review_scores_rating":
            dataColumns[col] = new ColumnInfo(col, "numeric"); break;
        case "neighbourhood_cleansed":
            dataColumns[col] = new ColumnInfo(col, "categorical"); break;
        default:
            // Handle any other cases here
            dataColumns[col] = new ColumnInfo(col, "categorical"); break;
    }
}

export function calcStats() {
    for (let col of order) {
        if (dataColumns[col].type == "numeric") {
            // console.log(col)
            let temp = dataColumns[col].data  // Create a sorted copy for analysis
                .filter(d => d != null && d != undefined && d != NaN)
                .toSorted((a, b) => a - b);  // We may be wasting resoures making 2 copies?
            dataColumns[col].min = temp[0];
            dataColumns[col].max = temp[temp.length - 1];
            dataColumns[col].avg = temp.reduce((a, b) => a + b) / temp.length;

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

            dataColumns[col].clean_avg = temp.filter(d => d >= lower_bound && d <= upper_bound).reduce((a, b) => a + b) / temp.length;
        } else if (dataColumns[col].type == "categorical") {
            let temp = dataColumns[col].data
                .filter(d => d != null && d != undefined && d != NaN);
            dataColumns[col].fields = temp.filter((d, i) => temp.indexOf(d) == i);
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
            calcStats();
            normalDomain();

            // Call the callback to run main code
            callback();
        });
}

