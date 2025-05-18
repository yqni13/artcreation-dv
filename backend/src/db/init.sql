CREATE TABLE IF NOT EXISTS gallery (
    gallery_id UUID PRIMARY KEY NOT NULL,
    reference_nr VARCHAR(6) NOT NULL,
    image_path TEXT NOT NULL,
    thumbnail_path TEXT NOT NULL,
    title VARCHAR(100),
    sale_status VARCHAR(50) NOT NULL,
    price NUMERIC(9, 2),
    dimensions VARCHAR(20) NOT NULL,
    art_genre VARCHAR(20) NOT NULL,
    art_medium VARCHAR(20) NOT NULL,
    art_technique VARCHAR(20) NOT NULL,
    publication_year NUMERIC NOT NULL,
    created_on TIMESTAMP NOT NULL,
    last_modified TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS news (
    news_id UUID PRIMARY KEY NOT NULL,
    gallery UUID REFERENCES gallery(gallery_id),
    image_path TEXT,
    thumbnail_path TEXT,
    visual_timestamp TIMESTAMP NOT NULL,
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    created_on TIMESTAMP NOT NULL,
    last_modified TIMESTAMP NOT NULL
);


-- init data

INSERT INTO gallery
(gallery_id, reference_nr, image_path, thumbnail_path, title, sale_status, price, dimensions, art_genre, art_technique, art_medium, publication_year, created_on, last_modified)
VALUES ('53b7f35f-68e6-475d-b5c3-eba472ee8770','PUR001','artwork_original/PUR001.webp','artwork_resized/PUR001.webp','Pouring des Königs','available',NULL,'70x70','pouring','canvas','acrylic','2025','2025-03-20 00:49:00','2025-03-20 00:49:00');

INSERT INTO news
(news_id, gallery, image_path, thumbnail_path, visual_timestamp, title, content, created_on, last_modified)
VALUES ('338f27bb-ef82-4cb6-8b53-6226cf6274da',NULL,'news_original/338f27bb-ef82-4cb6-8b53-6226cf6274da.webp','news_resized/338f27bb-ef82-4cb6-8b53-6226cf6274da.webp','2024-07-20 17:01:00','Offizieller Homepage Entwicklungsstart','Heute startete endlich die Entwicklung meiner Webseite zur Präsentation all meiner Kunst- und Handwerke. Ich bin gespannt, wie die finale Version und alle Schritte bis dahin aussehen werden :)','2024-07-20 17:01:00','2024-07-20 17:01:00');


-- use only for local database, NEON does not give privilege for COPY FROM command
-- need to format .csv to have explicit delimiter
-- 1. replace all [ ," ] with [ |" ] (NOT / or \)
-- 2. replace all [ ,NULL ] with [ |NULL ] (NOT / or \)

-- COPY gallery
-- FROM 'D:/Dokumente/GitHub/artcreation-dv/backend/src/db/gallery.csv'
-- DELIMITER '|'
-- NULL 'NULL'
-- CSV HEADER 
-- QUOTE '"'
-- ENCODING 'UTF8';

-- COPY news
-- FROM 'D:/Dokumente/GitHub/artcreation-dv/backend/src/db/news.csv'
-- DELIMITER '|'
-- NULL 'NULL'
-- CSV HEADER
-- QUOTE '"'
-- ENCODING 'UTF8';