CREATE TABLE users (id int PRIMARY KEY AUTO_INCREMENT NOT NULL UNIQUE,username varchar(128) NOT NULL UNIQUE,email varchar(256) NOT NULL UNIQUE,password varchar(512) NOT NULL);
CREATE TABLE tasks (id int PRIMARY KEY AUTO_INCREMENT NOT NULL UNIQUE,user_id int NOT NULL,name varchar(128) NOT NULL,description varchar(512),completed tinyint NOT NULL DEFAULT 0,due_date date,priority ENUM('Low', 'Medium', 'High') NOT NULL DEFAULT 'Low',category varchar(256), FOREIGN KEY (user_id) REFERENCES users(id));