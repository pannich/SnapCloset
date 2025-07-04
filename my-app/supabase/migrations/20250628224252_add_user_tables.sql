-- SnapCloset Database Schema
-- This file contains the SQL statements to create all necessary tables for the SnapCloset application

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. User Authentication Table
CREATE TABLE IF NOT EXISTS user_authentication (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. User Items Table
CREATE TABLE IF NOT EXISTS user_items (
    item_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    item_description TEXT,
    item_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user_authentication(user_id) ON DELETE CASCADE
);

-- 3. User Collections Table
CREATE TABLE IF NOT EXISTS user_collections (
    collection_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    collection_name VARCHAR(255) NOT NULL,
    collection_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user_authentication(user_id) ON DELETE CASCADE
);

-- 4. Collection Items Junction Table
CREATE TABLE IF NOT EXISTS collection_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    collection_id UUID NOT NULL,
    item_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (collection_id) REFERENCES user_collections(collection_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES user_items(item_id) ON DELETE CASCADE,
    UNIQUE(collection_id, item_id) -- Prevent duplicate items in the same collection
);

-- Create indexes for better query performance
CREATE INDEX idx_user_items_user_id ON user_items(user_id);
CREATE INDEX idx_user_collections_user_id ON user_collections(user_id);
CREATE INDEX idx_collection_items_collection_id ON collection_items(collection_id);
CREATE INDEX idx_collection_items_item_id ON collection_items(item_id);
CREATE INDEX idx_user_authentication_email ON user_authentication(email);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update the updated_at column
CREATE TRIGGER update_user_authentication_updated_at
    BEFORE UPDATE ON user_authentication
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_items_updated_at
    BEFORE UPDATE ON user_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_collections_updated_at
    BEFORE UPDATE ON user_collections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE user_authentication IS 'Stores user authentication information';
COMMENT ON TABLE user_items IS 'Stores individual clothing items belonging to users';
COMMENT ON TABLE user_collections IS 'Stores collections of items created by users';
COMMENT ON TABLE collection_items IS 'Junction table linking collections to their items';

COMMENT ON COLUMN user_authentication.user_id IS 'Unique identifier for each user';
COMMENT ON COLUMN user_authentication.email IS 'User email address, must be unique';
COMMENT ON COLUMN user_items.item_id IS 'Unique identifier for each item';
COMMENT ON COLUMN user_items.user_id IS 'Reference to the user who owns this item';
COMMENT ON COLUMN user_items.item_name IS 'Name of the clothing item';
COMMENT ON COLUMN user_items.item_description IS 'Optional description of the item';
COMMENT ON COLUMN user_items.item_image_url IS 'URL to the item image';
COMMENT ON COLUMN user_collections.collection_id IS 'Unique identifier for each collection';
COMMENT ON COLUMN user_collections.user_id IS 'Reference to the user who owns this collection';
COMMENT ON COLUMN user_collections.collection_name IS 'Name of the collection';
COMMENT ON COLUMN user_collections.collection_description IS 'Optional description of the collection';
COMMENT ON COLUMN collection_items.collection_id IS 'Reference to the collection';
COMMENT ON COLUMN collection_items.item_id IS 'Reference to the item in the collection';
