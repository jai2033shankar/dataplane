# ═══════════════════════════════════════════════════════════════
#  dataPlane — All-in-One Docker Image
#  Ships frontend + backend + PostgreSQL in a single container
#  Usage: docker build -t dataplane . && docker run -p 3000:3000 -p 8000:8000 dataplane
# ═══════════════════════════════════════════════════════════════

# ── Stage 1: Build Frontend ──────────────────────────────────
FROM node:20-slim AS frontend-builder

WORKDIR /build/frontend

COPY frontend/package*.json ./
RUN npm ci --legacy-peer-deps 2>/dev/null || npm install --legacy-peer-deps

COPY frontend/ .

# Attempt production build; fall back gracefully to dev mode
RUN npm run build 2>/dev/null || echo "Build skipped — will use dev mode"

# ── Stage 2: Final All-in-One Image ──────────────────────────
FROM debian:bookworm-slim

LABEL maintainer="dataPlane <admin@dataplane.ai>"
LABEL description="AI-First Agentic Database Engineering Platform — All-in-One"
LABEL version="1.0.0"

ENV DEBIAN_FRONTEND=noninteractive
ENV LANG=C.UTF-8
# Prevent PostgreSQL from auto-creating a default cluster
ENV POSTGRES_INITDB_ARGS="--locale=C.UTF-8"
ENV PG_CLUSTER_CONF_ROOT="/etc/postgresql-common/createcluster.conf"

# ── Install system dependencies ──────────────────────────────
RUN apt-get update && apt-get install -y --no-install-recommends \
    # Python
    python3 python3-pip python3-venv python3-dev \
    # PostgreSQL 15
    postgresql-15 postgresql-client-15 \
    # Node.js 20
    curl ca-certificates gnupg \
    # Build tools for native extensions
    build-essential libpq-dev \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/*

# ── Setup Python environment ────────────────────────────────
WORKDIR /app

COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip3 install --no-cache-dir --break-system-packages -r /app/backend/requirements.txt

# ── Copy Backend ─────────────────────────────────────────────
COPY backend/ /app/backend/

# ── Copy Frontend (from builder) ─────────────────────────────
COPY --from=frontend-builder /build/frontend /app/frontend

# ── Copy Scripts ─────────────────────────────────────────────
COPY scripts/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# ── Create directories with correct permissions ──────────────
RUN mkdir -p /var/log/postgresql /var/run/postgresql /var/lib/postgresql \
    && touch /var/log/backend.log /var/log/frontend.log /var/log/postgresql/postgresql.log \
    && chown -R postgres:postgres /var/run/postgresql /var/lib/postgresql /var/log/postgresql \
    && chmod 750 /var/log/postgresql

# ── Expose ports ─────────────────────────────────────────────
# 3000 = Frontend UI
# 8000 = Backend API
# 5432 = PostgreSQL (optional external access)
EXPOSE 3000 8000 5432

# ── Health check ─────────────────────────────────────────────
HEALTHCHECK --interval=30s --timeout=10s --retries=5 \
    CMD curl -sf http://localhost:8000/health && curl -sf http://localhost:3000 || exit 1

# ── Entrypoint ───────────────────────────────────────────────
ENTRYPOINT ["/app/entrypoint.sh"]
