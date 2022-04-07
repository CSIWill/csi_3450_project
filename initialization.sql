DROP TABLE GAMES, STORE, GENRE, DEVELOPER, USERS, PLATFORM, GAME_PLATFORM, GAMES_DEVELOPER, GAME_PLATFORM_AT_STORE, GAMES_GENRE, WISHLIST;
-- -----------------------------------------------------
-- Table GAMES
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS GAMES (
  GAMES_ID INT,
  GAMES_TITLE VARCHAR(128) NULL UNIQUE,
  GAMES_SCORE INT NULL,
  GAMES_AGE_RATING VARCHAR(45) NULL,
  PRIMARY KEY (GAMES_ID)
);


-- -----------------------------------------------------
-- Table STORE
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS STORE (
  STORE_ID INT,
  STORE_NAME VARCHAR(45) UNIQUE,
  PRIMARY KEY (STORE_ID)
);


-- -----------------------------------------------------
-- Table GENRE
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS GENRE (
  GENRE_ID INT,
  GENRE_NAME VARCHAR(45) UNIQUE,
  PRIMARY KEY (GENRE_ID)
);


-- -----------------------------------------------------
-- Table DEVELOPER
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS DEVELOPER (
  DEV_ID INT,
  DEV_NAME VARCHAR(45) UNIQUE,
  PRIMARY KEY (DEV_ID)
);


-- -----------------------------------------------------
-- Table USERS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS USERS (
  USER_ID SERIAL,
  USER_EMAIL VARCHAR(45) UNIQUE,
  USER_PASSWORD VARCHAR(45) NULL,
  PRIMARY KEY (USER_ID)
);


-- -----------------------------------------------------
-- Table PLATFORM
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS PLATFORM (
  PLATFORM_ID INT,
  PLATFORM_NAME VARCHAR(45) UNIQUE,
  PRIMARY KEY (PLATFORM_ID)
);


-- -----------------------------------------------------
-- Table GAME_PLATFORM
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS GAME_PLATFORM (
  GAMES_ID INT NOT NULL,
  PLATFORM_ID INT NOT NULL,
--   INDEX fk_GAMES_has_PLATFORM_PLATFORM1_idx (PLATFORM_ID ASC) VISIBLE,
--   INDEX fk_GAMES_has_PLATFORM_GAMES1_idx (GAMES_ID ASC) VISIBLE,
  PRIMARY KEY (GAMES_ID, PLATFORM_ID),
  CONSTRAINT fk_GAMES_has_PLATFORM_GAMES1
    FOREIGN KEY (GAMES_ID)
    REFERENCES GAMES (GAMES_ID)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_GAMES_has_PLATFORM_PLATFORM1
    FOREIGN KEY (PLATFORM_ID)
    REFERENCES PLATFORM (PLATFORM_ID)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);


-- -----------------------------------------------------
-- Table GAMES_DEVELOPER
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS GAMES_DEVELOPER (
  GAMES_ID INT NOT NULL,
  PLATFORM_ID INT NOT NULL,
  GAME_RELEASE_DATE DATE NULL,
  DEV_ID INT NOT NULL,
  PRIMARY KEY (GAMES_ID, PLATFORM_ID, DEV_ID),
--   INDEX fk_GAMES_DEVELOPER_GAME_PLATFORM1_idx (GAMES_ID ASC, PLATFORM_ID ASC) VISIBLE,
--   INDEX fk_GAMES_DEVELOPER_DEVELOPER1_idx (DEV_ID ASC) VISIBLE,
  CONSTRAINT fk_GAMES_DEVELOPER_GAME_PLATFORM1
    FOREIGN KEY (GAMES_ID , PLATFORM_ID)
    REFERENCES GAME_PLATFORM (GAMES_ID , PLATFORM_ID)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_GAMES_DEVELOPER_DEVELOPER1
    FOREIGN KEY (DEV_ID)
    REFERENCES DEVELOPER (DEV_ID)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);


-- -----------------------------------------------------
-- Table GAME_PLATFORM_AT_STORE
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS GAME_PLATFORM_AT_STORE (
  GAMES_ID INT NOT NULL,
  PLATFORM_ID INT NOT NULL,
  STORE_ID INT NOT NULL,
  STORE_CURRENT_PRICE DECIMAL NULL,
  STORE_PAST_PRICE DECIMAL NULL,
  STORE_HISTORICAL_DATE DATE NULL,
--   INDEX fk_GAME_PLATFORM_has_STORE_STORE1_idx (STORE_ID ASC) VISIBLE,
--   INDEX fk_GAME_PLATFORM_has_STORE_GAME_PLATFORM1_idx (GAMES_ID ASC, PLATFORM_ID ASC) VISIBLE,
  PRIMARY KEY (GAMES_ID, PLATFORM_ID, STORE_ID),
  CONSTRAINT fk_GAME_PLATFORM_has_STORE_GAME_PLATFORM1
    FOREIGN KEY (GAMES_ID , PLATFORM_ID)
    REFERENCES GAME_PLATFORM (GAMES_ID , PLATFORM_ID)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_GAME_PLATFORM_has_STORE_STORE1
    FOREIGN KEY (STORE_ID)
    REFERENCES STORE (STORE_ID)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);


-- -----------------------------------------------------
-- Table GAMES_GENRE
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS GAMES_GENRE (
  GAMES_ID INT NOT NULL,
  GENRE_ID INT NOT NULL,
--   INDEX fk_GAMES_has_GENRE_GENRE1_idx (GENRE_ID ASC) VISIBLE,
--   INDEX fk_GAMES_has_GENRE_GAMES1_idx (GAMES_ID ASC) VISIBLE,
  PRIMARY KEY (GAMES_ID, GENRE_ID),
  CONSTRAINT fk_GAMES_has_GENRE_GAMES1
    FOREIGN KEY (GAMES_ID)
    REFERENCES GAMES (GAMES_ID)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_GAMES_has_GENRE_GENRE1
    FOREIGN KEY (GENRE_ID)
    REFERENCES GENRE (GENRE_ID)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);


-- -----------------------------------------------------
-- Table WISHLIST
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS WISHLIST (
  USER_ID INT NOT NULL,
  GAMES_ID INT NOT NULL,
  PLATFORM_ID INT NOT NULL,
  PRIMARY KEY (USER_ID, GAMES_ID, PLATFORM_ID),
--   INDEX fk_USER_has_GAME_PLATFORM_GAME_PLATFORM1_idx (GAMES_ID ASC, PLATFORM_ID ASC) VISIBLE,
--   INDEX fk_USER_has_GAME_PLATFORM_USER1_idx (USER_ID ASC) VISIBLE,
  CONSTRAINT fk_USER_has_GAME_PLATFORM_USER1
    FOREIGN KEY (USER_ID)
    REFERENCES USERS (USER_ID)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_USER_has_GAME_PLATFORM_GAME_PLATFORM1
    FOREIGN KEY (GAMES_ID , PLATFORM_ID)
    REFERENCES GAME_PLATFORM (GAMES_ID , PLATFORM_ID)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
);
-- -----------------------------------------------------
--Members of the team are admins
-- INSERT INTO USERS
-- VALUES(1,'weng2@oakland.edu','Admin');
-- INSERT INTO USERS
-- VALUES(2,'tkking@oakland.edu','Admin');
-- INSERT INTO USERS
-- VALUES(3,'stevenlee@oakland.edu','Admin');
-- -----------------------------------------------------
--Genre lookup values.
-- INSERT INTO GENRE
-- VALUES(1, 'Action');
-- INSERT INTO GENRE
-- VALUES(2, 'Adventure & Casual');
-- INSERT INTO GENRE
-- VALUES(3, 'Role-Playing');
-- INSERT INTO GENRE
-- VALUES(4, 'Strategy');
-- INSERT INTO GENRE
-- VALUES(5, 'Sports & Racing');
-- INSERT INTO GENRE
-- VALUES(6, 'Simulation');
-- INSERT INTO GENRE
-- VALUES(7, 'Puzzle');
-- INSERT INTO GENRE
-- VALUES(8, 'Shooter');
-- -----------------------------------------------------
-- Developer lookup values
-- INSERT INTO DEVELOPER
-- VALUES(1, 'Ensemble Studios');
-- INSERT INTO DEVELOPER
-- VALUES(2, 'Riot Entertainment');
-- INSERT INTO DEVELOPER
-- VALUES(3, 'BioWare Entertainment');
-- INSERT INTO DEVELOPER
-- VALUES(4, 'Westwood Studios');
-- INSERT INTO DEVELOPER
-- VALUES(5, 'Lucasfilm Games');
-- -----------------------------------------------------
-- Platform lookup values
-- INSERT INTO PLATFORM
-- VALUES(1, 'PlayStation 5');
-- INSERT INTO PLATFORM
-- VALUES(2, 'Xbox One');
-- INSERT INTO PLATFORM
-- VALUES(3, 'Nintendo Switch');
-- INSERT INTO PLATFORM
-- VALUES(4, 'PlayStation 4');
-- INSERT INTO PLATFORM
-- VALUES(5, 'Xbox Series');
-- INSERT INTO PLATFORM
-- VALUES(6, 'Android');
-- -----------------------------------------------------
-- Store lookup values
-- INSERT INTO STORE
-- VALUES(1, 'Steam');
-- INSERT INTO STORE
-- VALUES(2, 'EpicGames');
-- INSERT INTO STORE
-- VALUES(3, 'Playstation');
-- INSERT INTO STORE
-- VALUES (4, 'XBox');
-- INSERT INTO STORE
-- VALUES(5, 'Xbox360');
-- INSERT INTO STORE
-- VALUES(6, 'APP');
-- INSERT INTO STORE
-- VALUES(7, 'GOG');
-- INSERT INTO STORE
-- VALUES(8, 'Nintendo');
-- INSERT INTO STORE
-- VALUES(9, 'Google');
-- INSERT INTO STORE
-- VALUES(10, 'Itch.io');