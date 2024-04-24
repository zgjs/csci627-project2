#!/usr/bin/env python3
"""
Process dataset files
"""

__author__ = "Greg and Nick"

from pathlib import Path
import pandas as pd

def main():
    # Get path to source listings file
    listing_path = Path.cwd()
    if (listing_path / "scripts").exists():  # We are likely in one of two folders so we figure out which one and then traverse to the right dir
        listing_path = listing_path / "data" / "listings.csv"
    else:
        listing_path = listing_path.parent / "data" / "listings.csv"
    

    listings_data = pd.read_csv(listing_path)
    
    for id, row in listings_data.iterrows():
        row = row.copy()
        
        # In general, exclude rows that are missing important values
        # (This shows up with float nans instead of their expected value)

        # Get bathrooms from bathrooms_text
        if isinstance(row['bathrooms_text'], str) and row['bathrooms_text'][0].isdigit():
            listings_data.loc[id, 'bathrooms'] = float(row['bathrooms_text'].split(" ")[0])

        # Convert price from string with $ prefix to float
        if isinstance(row['price'], str):  # After testing, price always starts with $
            listings_data.loc[id, 'price'] = float(row['price'].replace("$", "").replace(",", ""))
            
    data_fields = [
        "id", "host_id", "host_since", "host_location", "host_response_time", "host_response_rate",
        "host_acceptance_rate", "host_is_superhost", "host_neighbourhood", "host_listings_count",
        "host_total_listings_count", "host_verifications", "host_has_profile_pic", "host_identity_verified",
        "neighbourhood_cleansed", "latitude", "longitude", "property_type", "accommodates", "bathrooms", "beds", "price",
        "minimum_nights", "maximum_nights", "minimum_nights_avg_ntm", "maximum_nights_avg_ntm", "calendar_updated",
        "has_availability", "availability_30", "availability_60", "availability_90", "availability_365",
        "calendar_last_scraped", "number_of_reviews", "number_of_reviews_ltm", "number_of_reviews_l30d", "first_review",
        "last_review", "review_scores_rating", "review_scores_accuracy", "review_scores_cleanliness",
        "review_scores_checkin", "review_scores_communication", "review_scores_location", "review_scores_value",
        "instant_bookable", "calculated_host_listings_count", "calculated_host_listings_count_entire_homes",
        "calculated_host_listings_count_private_rooms", "calculated_host_listings_count_shared_rooms",
        "reviews_per_month"
    ]

    filter_fields = [
        "id", "host_id", "host_since", "host_response_rate",
        "host_acceptance_rate", "host_is_superhost", "host_neighbourhood", "host_listings_count",
        "host_total_listings_count", "host_has_profile_pic", "host_identity_verified",
        "neighbourhood_cleansed", "latitude", "longitude", "accommodates", "bathrooms", "beds", "price",
        "minimum_nights", "maximum_nights", "minimum_nights_avg_ntm", "maximum_nights_avg_ntm",
        "has_availability",
        "number_of_reviews", "number_of_reviews_ltm", "number_of_reviews_l30d", "first_review",
        "last_review", "review_scores_rating", "review_scores_accuracy", "review_scores_cleanliness",
        "review_scores_checkin", "review_scores_communication", "review_scores_location", "review_scores_value",
        "instant_bookable", "calculated_host_listings_count", "calculated_host_listings_count_entire_homes",
        "calculated_host_listings_count_private_rooms", "calculated_host_listings_count_shared_rooms",
        "reviews_per_month"
    ]

    filtered_listings_data = listings_data[filter_fields]

    processed_path = listing_path.parent / "processed"
    processed_path.mkdir(exist_ok=True)  # Create if missing

    filtered_listings_data.to_csv(processed_path / "filtered_listings.csv", index=False)
    filtered_listings_data.to_json(processed_path / "filtered_listings.json", orient="records")

    # Review count and price only
    filtered_listings_data_reviews_price = listings_data[[
        "id", "number_of_reviews", "price"
    ]]
    filtered_listings_data_reviews_price.to_csv(processed_path / "reviews_price.csv", index=False)
    filtered_listings_data_reviews_price.to_json(processed_path / "reviews_price.json", orient="records")

    # Scatter plot fields
    filtered_listings_scatter_plot = listings_data[[
        "number_of_reviews", "price"
    ]]
    filtered_listings_scatter_plot.to_csv(processed_path / "scatter_plot.csv", index=False)
    filtered_listings_scatter_plot.to_json(processed_path / "scatter_plot.json", orient="records")

if __name__ == "__main__":
    """ This is executed when run from the command line """
    main()