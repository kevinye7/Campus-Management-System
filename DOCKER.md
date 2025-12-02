# Docker Setup Guide

This guide explains how to run the Campus Management System using Docker.

## Prerequisites

- Docker Desktop (or Docker Engine + Docker Compose)
- Docker Compose v3.8 or higher

## Quick Start

1. **Clone the repository** (if you haven't already)
   ```bash
   git clone <repository-url>
   cd Campus-Management-System
   ```

2. **Create environment file** (optional, defaults are provided)
   ```bash
   cp .env.example .env
   ```
   Edit `.env` if you need to change default values.

3. **Build and start all services**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001/api

## Docker Compose Services

The setup includes three services:

1. **db** - PostgreSQL database
2. **backend** - Node.js/Express API server
3. **frontend** - React application served via Nginx

## Environment Variables

You can customize the configuration using environment variables in `.env` file:

- `DB_NAME` - Database name (default: starter-server)
- `DB_USER` - Database user (default: postgres)
- `DB_PASSWORD` - Database password (default: postgres)
- `DB_HOST` - Database host (default: localhost, use 'db' for Docker)
- `DB_PORT` - Database port (default: 5432)
- `BACKEND_PORT` - Backend API port (default: 5001)
- `FRONTEND_PORT` - Frontend port (default: 3000)

## Common Commands

### Start services in detached mode
```bash
docker-compose up -d
```

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Stop services
```bash
docker-compose down
```

### Stop and remove volumes (clears database)
```bash
docker-compose down -v
```

### Rebuild after code changes
```bash
docker-compose up --build
```

### Access database directly
```bash
docker-compose exec db psql -U postgres -d starter-server
```

### Access backend container shell
```bash
docker-compose exec backend sh
```

### Access frontend container shell
```bash
docker-compose exec frontend sh
```

## Development Mode

For development with hot-reload, you may want to modify the Dockerfiles:

1. **Backend**: Change `CMD ["node", "app.js"]` to `CMD ["npm", "run", "dev"]` and install nodemon in the Dockerfile
2. **Frontend**: Use a development server instead of the production build

However, for production-like testing, the current setup is recommended.

## Troubleshooting

### Port already in use
If ports 3000, 5001, or 5432 are already in use, change them in `.env`:
```
BACKEND_PORT=5002
FRONTEND_PORT=3001
DB_PORT=5433
```

### Database connection errors
- Ensure the database service is healthy: `docker-compose ps`
- Check database logs: `docker-compose logs db`
- Verify environment variables match in `.env`

### Backend fails to start
- Check backend logs: `docker-compose logs backend`
- Ensure database is ready before backend starts (healthcheck should handle this)
- Verify all dependencies are installed

### Frontend can't reach backend
- The nginx configuration proxies `/api` requests to the backend service
- Ensure both services are on the same Docker network (they should be automatically)

## Production Deployment

For production:

1. Use strong passwords in `.env`
2. Set `NODE_ENV=production`
3. Consider using Docker secrets for sensitive data
4. Set up proper SSL/TLS certificates
5. Configure firewall rules
6. Use a reverse proxy (like Traefik or Nginx) in front of the services
7. Set up proper backup strategies for the database volume

## Data Persistence

Database data is persisted in a Docker volume named `postgres_data`. To completely reset:

```bash
docker-compose down -v
docker-compose up --build
```

This will recreate the database from scratch.

