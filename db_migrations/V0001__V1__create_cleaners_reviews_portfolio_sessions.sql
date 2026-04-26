
CREATE TABLE IF NOT EXISTS cleaners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL DEFAULT '',
    specialty TEXT NOT NULL DEFAULT '',
    bio TEXT NOT NULL DEFAULT '',
    price TEXT NOT NULL DEFAULT '',
    tags TEXT[] NOT NULL DEFAULT '{}',
    avatar TEXT NOT NULL DEFAULT '',
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    rating NUMERIC(3,2) NOT NULL DEFAULT 0,
    reviews_count INTEGER NOT NULL DEFAULT 0,
    completed_jobs INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS portfolio_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cleaner_id UUID NOT NULL REFERENCES cleaners(id),
    title TEXT NOT NULL,
    area TEXT NOT NULL DEFAULT '',
    time_spent TEXT NOT NULL DEFAULT '',
    img TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cleaner_id UUID NOT NULL REFERENCES cleaners(id),
    author_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cleaner_id UUID NOT NULL REFERENCES cleaners(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
