CREATE TABLE gallery (
    gallery_id UUID PRIMARY KEY NOT NULL,
    reference_nr VARCHAR(6) NOT NULL,
    image_path TEXT NOT NULL,
    thumbnail_path TEXT NOT NULL,
    title VARCHAR(100),
    price NUMERIC(9, 2),
    art_type VARCHAR(50) NOT NULL,
    dimensions VARCHAR(20) NOT NULL,
    art_genre VARCHAR(20) NOT NULL,
    art_comment TEXT,
    art_medium VARCHAR(20) NOT NULL,
    art_technique VARCHAR(20) NOT NULL,
    publication_year NUMERIC NOT NULL,
    created_on TIMESTAMP NOT NULL,
    last_modified TIMESTAMP NOT NULL
);

CREATE TABLE news (
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