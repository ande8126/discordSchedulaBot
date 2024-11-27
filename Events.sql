CREATE TABLE Events (
    ID SERIAL PRIMARY KEY,
    EventName VARCHAR(255) NOT NULL,
    EventDate DATE NOT NULL,
    EventTime TIME NOT NULL,
    Description VARCHAR(4000) NULL,
    Assigner VARCHAR(255) NULL,
    Owner    VARCHAR(255) NULL
);