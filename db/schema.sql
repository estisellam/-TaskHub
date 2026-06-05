
CREATE TABLE users
(

    id INT AUTO_INCREMENT PRIMARY KEY,

    user_name VARCHAR(50) NOT NULL UNIQUE,

    email VARCHAR(100) NOT NULL UNIQUE,

    first_name VARCHAR(50) NOT NULL,

    last_name VARCHAR(50) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    is_admin BOOLEAN DEFAULT FALSE
);

CREATE TABLE passwords
(
    user_id INT NOT NULL PRIMARY KEY,
    hash_password VARCHAR(255) NOT NULL,
    
    -- if we delete user also the passeords will be delete
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE todos
(   
    todo_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    user_id INT NOT NULL,
    is_done BOOLEAN DEFAULT FALSE,
    description_todo VARCHAR(300) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- if we delete user also the todo will be delete
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE posts
(
    post_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     -- if we delete user also the post will be delete
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE comments
(
    comment_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- if we delete user also the comment will be delete
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    -- if we delete pist also the comment will be delete
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE
);


