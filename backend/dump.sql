-- function for generating account verification code
CREATE OR REPLACE FUNCTION gen_verification_code()
RETURNS TEXT AS $$
BEGIN
    RETURN (
        SELECT string_agg(
                   CASE
                       WHEN r < 0.33 THEN chr(97 + floor(random() * 26)::INTEGER) -- huruf kecil (a-z)
                       WHEN r < 0.66 THEN chr(65 + floor(random() * 26)::INTEGER) -- huruf besar (A-Z)
                       ELSE chr(48 + floor(random() * 10)::INTEGER) -- angka (0-9)
                   END, 
                   ''
               ) 
        FROM (SELECT random() AS r FROM generate_series(1, 10)) t -- menghasilkan 10 karakter
    );
END;
$$ LANGUAGE plpgsql;

-- verification table
CREATE TABLE "verification" (
    accountId UUID UNIQUE NOT NULL,
    verificationCode TEXT DEFAULT gen_verification_code()
);

-- account table
CREATE TABLE "account" (
    accountId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    firstName TEXT NOT NULL,
    surname TEXT NOT NULL,
    country TEXT,
    city TEXT,
    district TEXT,
    address TEXT,
    imageURL TEXT,
    isVerified BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ENUM for product category (updated with capitalized names)
CREATE TYPE ITEM_CATEGORY AS ENUM (
    'FRUITS',       -- Buah-buahan
    'VEGETABLES',   -- Sayuran
    'BEEF',         -- Sapi
    'POULTRIES',    -- Ayam dan unggas lainnya
    'PORK',         -- Babi
    'SEAFOOD',      -- Produk laut
    'LAMB',         -- Domba atau kambing
    'MILKS',        -- Susu
    'PLANT_PROTEINS',
    'OTHER_ANIMAL_PRODUCTS',
    'OTHER_PLANT_PRODUCTS',
    'STAPLES',      -- Bahan makanan pokok
    'PROCESSED',    -- Produk olahan
    'BEVERAGES',    -- Minuman
    'SEASONINGS',   -- Bumbu dapur
    'SNACKS'        -- Cemilan
);

-- ENUM untuk kondisi produk
CREATE TYPE ITEM_CONDITION AS ENUM (
    'FRESH',
    'NEAR_EXPIRED',
    'OPENED',
    'LEFTOVER'
);

-- item table
CREATE TABLE "item" (
    itemId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sellerId UUID NOT NULL,
    name TEXT NOT NULL,
    price NUMERIC(15, 0) NOT NULL,
    amount NUMERIC(4, 0) NOT NULL,
    expirationDate DATE NOT NULL,
    imageURL TEXT NOT NULL,
    description TEXT,
    uploadedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "itemcategories" (
    itemId UUID NOT NULL,
    category ITEM_CATEGORY NOT NULL
);

CREATE TABLE "itemconditions" (
    itemId UUID NOT NULL,
    itemCondition ITEM_CONDITION NOT NULL
);

-- orderStatus enum
CREATE TYPE orderstatus AS ENUM ('WAITING', 'ONGOING', 'CANCELED', 'DONE');

-- function for generating order code
CREATE OR REPLACE FUNCTION gen_order_code()
RETURNS TEXT AS $$
BEGIN
    RETURN (
        SELECT string_agg(
                   CASE
                       WHEN r < 0.33 THEN chr(97 + floor(random() * 26)::INTEGER) -- huruf kecil (a-z)
                       WHEN r < 0.66 THEN chr(65 + floor(random() * 26)::INTEGER) -- huruf besar (A-Z)
                       ELSE chr(48 + floor(random() * 10)::INTEGER) -- angka (0-9)
                   END, 
                   ''
               ) 
        FROM (SELECT random() AS r FROM generate_series(1, 10)) t -- menghasilkan 10 karakter
    );
END;
$$ LANGUAGE plpgsql;

-- order table
CREATE TABLE "order" (
    orderId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    itemId UUID NOT NULL,
    sellerId UUID NOT NULL,
    buyerId UUID NOT NULL,
    itemAmount NUMERIC(4, 0) NOT NULL,
    totalPrice NUMERIC(15, 0) NOT NULL,
    status orderStatus DEFAULT 'WAITING',
    orderCode TEXT DEFAULT gen_order_code(),
    orderDoneAt TIMESTAMP,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- review table
CREATE TABLE "review" (
    reviewId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    orderId UUID NOT NULL,
    description TEXT NOT NULL,
    rating INT NOT NULL,
    imageLink TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- contentType enum
CREATE TYPE contentType AS ENUM ('WORDS', 'IMAGE', 'ITEM', 'SYSTEM');

-- chatroom table
CREATE TABLE "chatroom" (
    chatroomId UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firstAccountId UUID NOT NULL,
    secondAccountId UUID NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- chat table
CREATE TABLE "chat" (
    chatroomId UUID NOT NULL,
    senderId UUID NOT NULL,
    chatContentType contentType NOT NULL,
    chatContent TEXT NOT NULL,
    isRead BOOLEAN DEFAULT FALSE,
    sentAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

