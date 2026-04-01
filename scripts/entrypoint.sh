#!/bin/bash
set -e

echo "══════════════════════════════════════════════════════════"
echo "  ✈️  dataPlane — AI-First Data Engineering Platform"
echo "══════════════════════════════════════════════════════════"
echo ""

# ── 1. Initialize PostgreSQL ─────────────────────────────────
echo "🐘 Starting PostgreSQL..."
if [ ! -d "/var/lib/postgresql/15/main" ] || [ ! "$(ls -A /var/lib/postgresql/15/main 2>/dev/null)" ]; then
    echo "   Initializing database cluster..."
    mkdir -p /var/lib/postgresql/15/main /var/run/postgresql
    chown -R postgres:postgres /var/lib/postgresql /var/run/postgresql
    su - postgres -c "/usr/lib/postgresql/15/bin/initdb -D /var/lib/postgresql/15/main"
    # Configure pg_hba for local trust
    echo "local all all trust" > /var/lib/postgresql/15/main/pg_hba.conf
    echo "host all all 0.0.0.0/0 trust" >> /var/lib/postgresql/15/main/pg_hba.conf
    echo "host all all ::0/0 trust" >> /var/lib/postgresql/15/main/pg_hba.conf
    # Configure postgresql.conf
    echo "listen_addresses = '*'" >> /var/lib/postgresql/15/main/postgresql.conf
    echo "port = 5432" >> /var/lib/postgresql/15/main/postgresql.conf
fi

mkdir -p /var/run/postgresql
chown -R postgres:postgres /var/run/postgresql /var/lib/postgresql

su - postgres -c "/usr/lib/postgresql/15/bin/pg_ctl -D /var/lib/postgresql/15/main -l /var/log/postgresql.log start -w -t 30"

# Wait for postgres
for i in $(seq 1 15); do
    if su - postgres -c "psql -c 'SELECT 1'" > /dev/null 2>&1; then
        echo "   ✅ PostgreSQL is ready"
        break
    fi
    sleep 1
done

# Create database and seed
su - postgres -c "psql -tc \"SELECT 1 FROM pg_database WHERE datname='dataplane'\" | grep -q 1 || psql -c 'CREATE DATABASE dataplane'"
su - postgres -c "psql -d dataplane -f /app/backend/seeds/postgres_seed.sql" 2>/dev/null || true
echo "   ✅ Database seeded"

# ── 2. Start Backend ─────────────────────────────────────────
echo ""
echo "⚡ Starting FastAPI Backend on :8000..."
cd /app/backend
export DATABASE_URL="postgresql://postgres@localhost:5432/dataplane"
export OLLAMA_HOST="${OLLAMA_HOST:-http://localhost:11434}"
nohup python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 2 > /var/log/backend.log 2>&1 &
BACKEND_PID=$!

# Wait for backend
for i in $(seq 1 20); do
    if curl -sf http://localhost:8000/health > /dev/null 2>&1; then
        echo "   ✅ Backend API ready at http://localhost:8000"
        break
    fi
    sleep 1
done

# ── 3. Start Frontend ────────────────────────────────────────
echo ""
echo "🌐 Starting Next.js Frontend on :3000..."
cd /app/frontend
export NEXT_PUBLIC_API_URL="http://localhost:8000"
# Use the pre-built .next if available, otherwise dev mode
if [ -d ".next" ]; then
    nohup npx next start -p 3000 > /var/log/frontend.log 2>&1 &
else
    nohup npx next dev -p 3000 > /var/log/frontend.log 2>&1 &
fi
FRONTEND_PID=$!

# Wait for frontend
for i in $(seq 1 30); do
    if curl -sf http://localhost:3000 > /dev/null 2>&1; then
        echo "   ✅ Frontend ready at http://localhost:3000"
        break
    fi
    sleep 2
done

# ── 4. Summary ───────────────────────────────────────────────
echo ""
echo "══════════════════════════════════════════════════════════"
echo "  ✅ dataPlane is running!"
echo ""
echo "  🌐 Frontend UI:     http://localhost:3000"
echo "  ⚡ Backend API:     http://localhost:8000"
echo "  📖 API Docs:        http://localhost:8000/docs"
echo "  🐘 PostgreSQL:      localhost:5432"
echo ""
echo "  🔑 Login: admin@dataplane.ai / admin123"
echo "══════════════════════════════════════════════════════════"
echo ""

# ── Keep alive & handle shutdown ─────────────────────────────
cleanup() {
    echo ""
    echo "🛑 Shutting down dataPlane..."
    kill $FRONTEND_PID 2>/dev/null || true
    kill $BACKEND_PID 2>/dev/null || true
    su - postgres -c "/usr/lib/postgresql/15/bin/pg_ctl -D /var/lib/postgresql/15/main stop -w" 2>/dev/null || true
    echo "   Goodbye! ✈️"
    exit 0
}

trap cleanup SIGTERM SIGINT

# Tail logs
tail -f /var/log/backend.log /var/log/frontend.log 2>/dev/null &
wait
