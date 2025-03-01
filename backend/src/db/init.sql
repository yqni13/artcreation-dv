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


-- INSERT INTO gallery
-- (gallery_id, reference_nr, image_path, thumbnail_path, title, price, dimensions, art_genre, art_technique, art_medium, publication_year, created_on, last_modified)
-- VALUES ('53b7f35f-68e6-475d-b5c3-eba472ee8770','N00001','path','path','title#1',200.00,'60x80','nature','canvas','acrylic','2025','2025-02-07 22:52:03','2025-02-07 22:52:03');


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