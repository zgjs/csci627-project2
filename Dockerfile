FROM python:3 AS preprocessor
ARG LISTINGS=https://data.insideairbnb.com/united-states/il/chicago/2023-12-18/data/listings.csv.gz
ARG GEOJSON=https://data.insideairbnb.com/united-states/il/chicago/2023-12-18/visualisations/neighbourhoods.geojson
WORKDIR /data
RUN wget -O - \
    $LISTINGS \
    | gunzip -cd > listings.csv \
 && wget $GEOJSON
WORKDIR /scripts
COPY scripts .
RUN pip install --no-cache-dir -r requirements.txt
RUN python process.py

FROM nginx:stable-bullseye
COPY . /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=preprocessor /data/processed /usr/share/nginx/html/data/processed
RUN find /usr/share/nginx/html/ -maxdepth 2 -type f \
    \( -iname '*.css' -o -iname '*.csv' -o -iname '*.html' -o -iname '*.js' -o -iname '*.*json' \) \
    -exec gzip --force --keep -9 {} \;
