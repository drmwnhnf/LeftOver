-- Active: 1731033754397@@ep-dry-river-a1gwij4t.ap-southeast-1.aws.neon.tech@5432@LeftOver
-- Create Account Table
CREATE TABLE Account (
    accountId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    fullName TEXT NOT NULL,
    location TEXT
);

CREATE TABLE Item (
    itemId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sellerId UUID NOT NULL,
    name TEXT NOT NULL,
    price NUMERIC(15, 2) NOT NULL,
    quantity INT NOT NULL,
    expirationDate DATE NOT NULL,
    description TEXT,
    imagelink TEXT
);

CREATE TABLE "order" (
    orderId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    itemId UUID NOT NULL,
    sellerId UUID NOT NULL,
    buyerId UUID NOT NULL,
    quantity INT NOT NULL,
    totalprice NUMERIC(15, 2) NOT NULL,
    orderdate DATE NOT NULL,
    status orderstatus NOT NULL DEFAULT 'WAITING'
);

CREATE TYPE orderstatus AS ENUM ('WAITING', 'PAID', 'CANCELED', 'DONE');

CREATE TABLE "chat" (
    chatId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    senderId UUID NOT NULL,
    
);