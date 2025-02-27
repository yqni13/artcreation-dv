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


-- need to format .csv to have explicit delimiter
-- 1. replace all [ ," ] with [ |" ] (NOT / or \)
-- 2. replace all [ ,NULL ] with [ |NULL ] (NOT / or \)

COPY gallery
FROM 'D:/Dokumente/GitHub/artcreation-dv/backend/src/db/gallery.csv'
DELIMITER '|'
NULL 'NULL'
CSV HEADER 
QUOTE '"'
ENCODING 'UTF8';

COPY news
FROM 'D:/Dokumente/GitHub/artcreation-dv/backend/src/db/news.csv'
DELIMITER '|'
NULL 'NULL'
CSV HEADER
QUOTE '"'
ENCODING 'UTF8';