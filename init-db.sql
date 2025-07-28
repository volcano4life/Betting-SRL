-- Database initialization script
-- This script runs when the PostgreSQL container starts for the first time

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE betting_srl TO betting_user;

-- Create schemas if needed
-- (Drizzle will handle table creation via npm run db:push)