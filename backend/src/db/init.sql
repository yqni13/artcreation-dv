CREATE TABLE IF NOT EXISTS gallery (
    gallery_id UUID PRIMARY KEY NOT NULL,
    reference_nr VARCHAR(6) NOT NULL,
    image_path TEXT NOT NULL,
    thumbnail_path TEXT NOT NULL,
    title VARCHAR(100),
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
(gallery_id, reference_nr, image_path, thumbnail_path, title, price, dimensions, art_genre, art_technique, art_medium, publication_year, created_on, last_modified)
VALUES ('53b7f35f-68e6-475d-b5c3-eba472ee8770','NAT001','/assets/paintings/NAT001.jpg','/assets/paintings_resized/NAT001.jpg','die Brücke',NULL,'100x70','nature','canvas','acrylic','2025','2025-03-02 00:49:00','2025-03-02 00:49:00');

INSERT INTO news
(news_id, gallery, image_path, thumbnail_path, visual_timestamp, title, content, created_on, last_modified)
VALUES ('338f27bb-ef82-4cb6-8b53-6226cf6274da',NULL,'/assets/news/domain_purchase.jpg','/assets/news_resized/domain_purchase.jpg','2024-09-24 13:00:00','Domain purchased!','With this day my domain was officially purchased and activated :) For now, only a placeholder will be displayed, but when the first version (v1.0.0) will be finished, my webpage will be accessable by https://artcreation-dv.at!!','2025-03-02 00:49:01','2025-03-02 00:49:01');


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