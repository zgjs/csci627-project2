# CSCI 627 Project 2: AirBnB Dataset Visualization
## How to run these visualizations
The visualizations are written in JavaScript, and do not require any backend code. However, some pre-processing is used to clean up and filter the data before converting it to JSON for the purpose of ingesting it in the JavaScript code.

### Option 1: View on the web (best)
[https://csci627-project2.zgjs.app/](https://csci627-project2.zgjs.app/)

### Option 2: Deploy using docker compose (recommended)
The instructions assume that you already have docker compose installed.
```console
git clone https://github.com/zgjs/csci627-project2.git
cd csci627-project2
docker compose up
```
Open [http://localhost:8080/](http://localhost:8080/) in your browser.

### Option 3: Use VS Code Live Server
1. Open the project in VS Code or GitHub Codespaces.
2. Run commands
  ```console
  cd scripts
  pip3 install -r requirements.txt
  python3 process.py
  ```
3. Launch extension VS Code Live Server.
4. Open the link provided by Live Server.

### Option 4: Run manually using python web server
The instructions assume that you already have python3 and pip3 installed.
```console
git clone https://github.com/zgjs/csci627-project2.git
cd csci627-project2
# post processing using python
python -m venv .venv && source .venv/bin/activate # venv optional
cd scripts
pip3 install -r requirements.txt
python3 process.py
cd ..
python -m http.server 
```
Open [http://localhost:8000/](http://localhost:8000/) in your browser.

### Option 5: Run manually without a web server (not recommended)
The instructions assume that you already have python3 and pip3 installed.
```console
git clone https://github.com/zgjs/csci627-project2.git
cd csci627-project2
# post processing using python
python -m venv .venv && source .venv/bin/activate # venv optional
cd scripts
pip3 install -r requirements.txt
python3 process.py
```
Open `index.html` from the project root in your browser.

## Dataset Used
We are interested in using data from AirBnB scraped from the web and compiled on the InsideAirBnB website[1], specifically focusing on the Chicago listings data[2]. We might also supplement the listings data with other information from the Chicago InsideAirBnB data to cross-reference neighborhoods to geolocation data[3] if necessary in order to draw some types of map-oriented visualizations.
1. “Get the Data.” Inside Airbnb, 10 Apr. 2024, https://insideairbnb.com/get-the-data/ 
2. “Detailed Listings Data. Chicago, Illinois, United States.” Inside Airbnb, 18 Dec. 2023, https://data.insideairbnb.com/united-states/il/chicago/2023-12-18/data/listings.csv.gz
3. “GeoJSON file of neighbourhoods of the city. Chicago, Illinois, United States.” Inside Airbnb, 18 Dec. 2023, https://data.insideairbnb.com/united-states/il/chicago/2023-12-18/visualisations/neighbourhoods.geojson

## Analysis Problems
There are quite a few interesting questions we can ask that the data can help us explore and answer. Some of these include evaluating the importance of various attributes on the corresponding ratings or price of the listings. In addition to this, discovering what areas are more or less desirable are worth exploring. For example, which areas have the best value, or which areas are more party friendly versus better aligned with long term bookings? On the other side, property managers may be interested in what attributes differentiate them and others in regards to higher ratings and prices to see how they can improve their listings.

## Planned Visualizations
There are a few main visualizations that can be created to help explore the previous questions and considerations. The first one could likely be visualized by using a scatter plot. A scatter plot like this allows easy iteration between differing attributes at the same time. With some extra logic it is also possible to include more than two channels when doing so. Evaluating the desirability of a location can be discovered through a choropleth map. These maps can then be used to show different statistics across nearby locations. Finally, there may be interest in showing averages or more complex statistics on a location basis. This can be achieved through letting the user create bar charts to find expectations in various physical locations. We might use choropleth or dot maps to show scalar data on maps. For example, we might shade regions on a map with different colors to represent value or plot colored dots on a map to represent ratings.

## Work Plan
We will work in a two-person group, sharing equal responsibility for design, planning, coding, and the writeup. We will write the code utilizing pair programming style with driver and navigator, switching roles frequently to take turns to make sure that we both touch all areas. We can utilize the following technologies to facilitate collaboration:
- Microsoft Teams calls with screen sharing.
- Shared Microsoft 365 documents with live editing.
- VS Code Live Share with shared workspace and shared terminal.
- Shared git repository hosted on GitHub.s
