CREATE TABLE users
(
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_admin INT DEFAULT 0,       -- 👑 0 למשתמש רגיל, 1 למנהל מערכת
    is_blocked INT DEFAULT 0      -- 🔒 0 למשתמש פעיל, 1 למשתמש חסום
);

CREATE TABLE passwords
(
    user_id INT NOT NULL PRIMARY KEY,
    hash_password VARCHAR(255) NOT NULL,
    
    -- if we delete user also the passwords will be deleted
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE todos
(   
    todo_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    user_id INT NOT NULL,
    is_done BOOLEAN DEFAULT FALSE,
    description_todo VARCHAR(300) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- if we delete user also the todo will be deleted
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE posts
(
    post_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- if we delete user also the post will be deleted
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE comments
(
    comment_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- if we delete user also the comment will be deleted
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    -- if we delete post also the comment will be deleted
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE
);

-- 📸 טבלת אלבומים חדשה עבור הפיצ'ר שהוספנו
CREATE TABLE albums
(
    album_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- אם משתמש נמחק, כל האלבומים שלו נמחקים אוטומטית
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 🖼️ טבלת תמונות חדשה המקושרת לאלבומים
CREATE TABLE photos
(
    photo_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    album_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    url_photo TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- אם אלבום נמחק, כל התמונות שבתוכו נמחקות אוטומטית
    FOREIGN KEY (album_id) REFERENCES albums(album_id) ON DELETE CASCADE
);