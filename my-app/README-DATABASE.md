# Local Database Setup for SnapCloset

## Option 1: Using Supabase CLI (Recommended)

### Prerequisites

1. Install Supabase CLI:

   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

### Setup Steps

1. Navigate to the project directory:

   ```bash
   cd my-app
   ```

2. Start Supabase locally:

   ```bash
   supabase start
   ```

3. The database will be available at:

   - **Host**: localhost
   - **Port**: 54325
   - **Database**: postgres
   - **Username**: postgres
   - **Password**: postgres

4. To stop Supabase:
   ```bash
   supabase stop
   ```

## Option 2: Using Docker (Alternative)

### Prerequisites

1. Install Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop/)
2. Make sure Docker is running

### Setup Steps

1. Navigate to the project directory:

   ```bash
   cd my-app
   ```

2. Start the PostgreSQL database:

   ```bash
   docker-compose up -d
   ```

3. The database will be available at:

   - **Host**: localhost
   - **Port**: 5432
   - **Database**: snapcloset
   - **Username**: snapcloset_user
   - **Password**: snapcloset_password

4. To stop the database:
   ```bash
   docker-compose down
   ```

## Option 3: Using Supabase Cloud (Production)

1. Go to [supabase.com](https://supabase.com)
2. Create a free account and new project
3. Link your local project:
   ```bash
   supabase link --project-ref your-project-ref
   ```
4. Push your migrations:
   ```bash
   supabase db push
   ```

## Migration Management

Your database schema is located in `supabase/migrations/`:

- `20250628224252_add_user_tables.sql` - Contains all your table definitions

To create a new migration:

```bash
supabase migration new your_migration_name
```

To apply migrations:

```bash
supabase db reset  # Local development
supabase db push   # Production
```

## Connection Details

### Local Supabase CLI Setup

```typescript
const supabaseUrl = "http://localhost:54321";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";
```

### Local Docker Setup

```typescript
const supabaseUrl = "http://localhost:5432";
const supabaseKey = "your-anon-key";
```

### Supabase Cloud Setup

```typescript
const supabaseUrl = "https://your-project.supabase.co";
const supabaseKey = "your-anon-key";
```

## Database Schema

The schema includes:

- `user_authentication` - User accounts
- `user_items` - Individual clothing items
- `user_collections` - Collections of items
- `collection_items` - Junction table linking collections to items

All tables include:

- UUID primary keys
- Timestamps (created_at, updated_at)
- Proper foreign key constraints
- Indexes for performance
- Automatic updated_at triggers
- `IF NOT EXISTS` clauses for safe migrations
