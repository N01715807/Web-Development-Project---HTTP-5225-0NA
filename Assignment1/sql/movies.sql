CREATE DATABASE movies_list;

USE movies_list;

CREATE TABLE movies (
    id INT AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    director VARCHAR(100),
    release_year YEAR,
    rating DECIMAL(3,1),
    release_date DATE,
    poster_url VARCHAR(500),
    PRIMARY KEY (id)
);

INSERT INTO movies (id, title, director, release_year, rating, release_date, poster_url)
VALUES
(1,'Inception','Christopher Nolan',2010,8.8,'2010-07-16','https://image.tmdb.org/t/p/w200/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg'),
(2,'Parasite','Bong Joon-ho',2019,8.6,'2019-05-30','https://image.tmdb.org/t/p/w200/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg'),
(3,'Interstellar','Christopher Nolan',2014,8.6,'2014-11-07','https://image.tmdb.org/t/p/w200/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg'),
(4,'Spirited Away','Hayao Miyazaki',2001,8.5,'2001-07-20','https://image.tmdb.org/t/p/w200/oRvMaJOmapypFUcQqpgHMZA6qL9.jpg'),
(5,'The Godfather','Francis Ford Coppola',1972,9.2,'1972-03-24','https://image.tmdb.org/t/p/w200/3bhkrj58Vtu7enYsRolD1fZdja1.jpg');