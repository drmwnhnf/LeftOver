CREATE TABLE Account (
    accountId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    fullName TEXT NOT NULL,
    location TEXT,
    balance INT DEFAULT 0.00
);
