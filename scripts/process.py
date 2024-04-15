#!/usr/bin/env python3
"""
Process dataset files
"""

__author__ = "Greg and Nick"

# import csv
import pandas as pd

def main():
    #with open("../data/listings.csv", "r") as f:
    #    reader = csv.reader(f)
    #    for row in reader:
    #        print(row)
    #        quit()
    listings_data = pd.read_csv("../data/listings.csv")

    
    for id, row in listings_data.iterrows():
        row = row.copy()

        # Get bathrooms from bathrooms_text
        if(type(row['bathrooms_text']) == str and row['bathrooms_text'] != "nan" and row['bathrooms_text'][0].isdigit()):
            #row['bathrooms'] = row['bathrooms_text'].split(" ")[0]
            listings_data.loc[id, 'bathrooms'] = float(row['bathrooms_text'].split(" ")[0])

        # Convert price from string with $ prefix to float
        if(type(row['price']) == str and row['price'][0] == "$"):
            #print(row['price'])
            listings_data.loc[id, 'price'] = float(row['price'].replace("$", "").replace(",", ""))
            #print(row['price'])
        else:
            #print("Price", row['price'], " is not a string with $ prefix")
            pass
            
    filtered_listings_data = listings_data[[
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
    ]]
    filtered_listings_data.to_csv("../data/processed/filtered_listings.csv", index=False)
    filtered_listings_data.to_json("../data/processed/filtered_listings.json", orient="records")

    # Revies and price
    filtered_listings_data_reviews_price = listings_data[[
        "id", "number_of_reviews", "price"
    ]]
    filtered_listings_data_reviews_price.to_csv("../data/processed/reviews_price.csv", index=False)
    filtered_listings_data_reviews_price.to_json("../data/processed/reviews_price.json", orient="records")


if __name__ == "__main__":
    """ This is executed when run from the command line """
    main()