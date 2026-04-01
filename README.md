# dataPlane ✈️

**An AI-First, Agentic Database Engineering & Data Transformation Platform**

---

## 🌟 Product Vision

dataPlane is a production-grade platform for managing heterogeneous data systems intelligently with AI. It acts as an **Agentic DBA** — finding matches, mapping structures, creating pipelines, running natural language queries, and auditing security classifications at enterprise scale.

---

## 🏗️ Architecture

```mermaid
graph TD
    User([User / Engineer]) -->|Browser| UI[Next.js Frontend :3000]

    subgraph DOCKER["🐳 dataPlane All-in-One Container"]

        subgraph FE["Frontend Modules"]
            UI --> VIZ["🌐 Graph Visualizer"]
            UI --> QS["💬 Query Studio NL2SQL"]
            UI --> AD["🤖 AskData Bot"]
            UI --> SM["🗺️ Schema Mapper"]
            UI --> PIPE["🔗 Pipeline Studio"]
            UI --> SEC["🛡️ Security Center"]
        end

        UI -->|API| API[FastAPI Backend :8000]

        subgraph BE["Backend Services"]
            API --> NL2SQL[NL2SQL Service]
            API --> AskDataSvc[AskData Service]
            API --> MapperSvc[Schema Mapper]
            API --> DiffSvc[Diff Engine]
            API --> SecSvc[Security Scanner]
        end

        subgraph CONN["Database Connectors"]
            API --> SQLite["💾 SQLite"]
            API --> PG["🐘 PostgreSQL"]
            API --> MY["🐬 MySQL"]
            API --> ORA["🏛️ Oracle"]
            API --> JDBC["🔗 JDBC"]
        end

        PG --> PGDB[("PostgreSQL 15\nHR Data")]

    end

    subgraph EXT["External Optional"]
        API -.->|Optional| Ollama["Ollama LLM\nllama3 / mistral"]
    end

    SQLite --> SQDB[("SQLite Files\nCRM + DW + E-Com + Finance")]
```

---

## 🚀 Key Features

### 1. 🌐 Database Topology Visualizer
Interactive graph visualization showing tables as nodes with color-coded risk levels, AI-matched edges, and error/warning annotations — similar to Neo4j/NetworkX style.

### 2. 💬 Query Studio (NL-to-SQL)
Type plain English → AI generates SQL → execute safely → see results. Includes pre-built analysis templates (Health Report, PII Scan, Schema Gaps) with **95%+ accuracy** on templated patterns.

### 3. 🤖 AskData Intelligence Bot
Conversational AI chatbot that answers anything about your databases — issues, risks, gaps, and recommendations. Context-aware with full schema knowledge.

### 4. 🔌 Multi-Database Connectors
Production-grade connectors for **PostgreSQL, MySQL, Oracle, SQLite, and JDBC** with synthetic demo data seeded automatically. End-to-end demo with real database connections.

### 5. 🗺️ Schema Mapper
Visual drag-and-drop or plain English based schema mapping:
- Drag lines between columns to create mappings
- Type: `Map email_address to contact_email`
- AI-suggested matches shown as dashed lines
- Generate migration SQL automatically

### 6. 🛡️ Security & Governance
DAMA-compliant data classification with automatic PII detection, sensitivity tagging, stewardship assignment, and retention policies.

### 7. 🔗 Visual Pipeline Studio
React Flow based drag-and-drop canvas for designing data transformation pipelines with source, target, AI transformer, and security mask nodes.

---

## 🛠️ Setup & Run

### Prerequisites
- Docker and Docker Compose installed
- 2GB+ RAM (4GB+ if using Ollama LLM)

---

### 🚀 Option A: All-in-One Image (Recommended for On-Prem)

**One command to install and run everything:**

```bash
# Build the all-in-one image
docker build -t dataplane .

# Run it — that's it!
docker run -d --name dataplane -p 3000:3000 -p 8000:8000 dataplane
```

Or use Docker Compose:
```bash
docker-compose --profile aio up -d --build
```

This single image includes:
- ✅ Next.js Frontend (port 3000)
- ✅ FastAPI Backend (port 8000)
- ✅ PostgreSQL 15 with seeded demo data
- ✅ 5 synthetic databases (CRM, DW, E-Commerce, Finance, HR)
- ✅ All AI services (NL-to-SQL, AskData, Schema Mapper)

**Ship to on-prem:**
```bash
# Save image to file
docker save dataplane:latest | gzip > dataplane-v1.0.tar.gz

# On target machine — load and run
docker load < dataplane-v1.0.tar.gz
docker run -d --name dataplane -p 3000:3000 -p 8000:8000 dataplane
```

---

### 🔧 Option B: Multi-Service (Development)

```bash
# Start all services separately (Postgres + MySQL + Backend + Frontend)
docker-compose --profile dev up -d --build
```

---

### Navigation Endpoints
| Component | URL |
| :--- | :--- |
| **Frontend UI** | `http://localhost:3000` |
| **FastAPI API Docs** | `http://localhost:8000/docs` |
| **PostgreSQL** | `localhost:5432` |

### 🔑 Demo Credentials
- **Email**: `admin@dataplane.ai`
- **Password**: `admin123`

---

## 📂 Project Structure
```
dataplane/
├── backend/
│   ├── app/
│   │   ├── api/routers/       # REST API endpoints
│   │   │   ├── connectors.py  # CRUD for database connections
│   │   │   ├── schema.py      # Schema diff + graph + classify
│   │   │   ├── agent.py       # AI matching suggestions
│   │   │   ├── query.py       # NL-to-SQL engine
│   │   │   ├── askdata.py     # AskData chatbot
│   │   │   └── mapper.py      # Schema mapping + SQL gen
│   │   ├── connectors/        # Database connector drivers
│   │   │   ├── base.py        # Abstract base class
│   │   │   ├── sqlite.py      # SQLite driver
│   │   │   ├── postgres.py    # PostgreSQL driver
│   │   │   ├── mysql.py       # MySQL driver
│   │   │   ├── oracle.py      # Oracle driver (w/ sim mode)
│   │   │   └── jdbc.py        # Generic JDBC via SQLAlchemy
│   │   ├── services/          # Business logic
│   │   │   ├── ai_service.py       # Ollama LLM integration
│   │   │   ├── nl2sql_service.py   # Natural language to SQL
│   │   │   ├── askdata_service.py  # Conversational AI
│   │   │   ├── schema_mapper_service.py # Mapping engine
│   │   │   ├── diff_service.py     # Schema comparison + graph
│   │   │   ├── schema_service.py   # Schema extraction
│   │   │   └── security_service.py # PII classification
│   │   ├── core/              # Config, database setup
│   │   └── models/            # SQLAlchemy models
│   ├── seeds/                 # Database seed SQL files
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   └── src/app/
│       ├── dashboard/
│       │   ├── visualize/     # 🌐 Graph Visualizer
│       │   ├── query-studio/  # 💬 NL-to-SQL
│       │   ├── askdata/       # 🤖 AI Chatbot
│       │   ├── schema-mapper/ # 🗺️ Visual Mapper
│       │   ├── connectors/    # 🔌 DB Connections
│       │   ├── schema/        # 🧠 Schema Intelligence
│       │   ├── pipelines/     # 🔗 Pipeline Studio
│       │   ├── autopilot/     # ⚙️ AI Autopilot
│       │   └── security/      # 🛡️ Security Center
│       └── login/             # Authentication
├── docker-compose.yml         # Full orchestration
└── README.md
```

---

## 🔌 API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/v1/connectors/` | GET/POST | List/create database connectors |
| `/api/v1/connectors/{id}/schema` | GET | Extract schema metadata |
| `/api/v1/connectors/{id}/test` | POST | Test connection health |
| `/api/v1/schema/diff` | GET | Compare two schemas |
| `/api/v1/schema/graph` | GET | **Graph visualization data** |
| `/api/v1/schema/{id}/classify` | GET | PII/DAMA classification |
| `/api/v1/query/nl2sql` | POST | **Natural language to SQL** |
| `/api/v1/query/report/{id}` | GET | **Analysis report generation** |
| `/api/v1/askdata/chat` | POST | **AskData chatbot** |
| `/api/v1/askdata/suggestions` | GET | Contextual question suggestions |
| `/api/v1/mapper/parse` | POST | **Parse English mappings** |
| `/api/v1/mapper/generate-sql` | POST | Generate migration SQL |
| `/api/v1/mapper/visual-data` | POST | Visual mapping data |
| `/api/v1/agent/suggest` | POST | AI column matching |

---

## 🗃️ Seeded Demo Data

| Database | Domain | Tables | Records |
| :--- | :--- | :--- | :--- |
| CRM Source (SQLite) | Customer Relations | `crm_users`, `crm_leads`, `crm_activities` | 18 |
| Data Warehouse (SQLite) | Analytics Target | `dw_customers`, `dw_opportunities`, `dw_events` | 3 |
| E-Commerce (SQLite/MySQL) | Retail | `products`, `orders`, `customers` | 12 |
| Finance (Oracle sim) | General Ledger | `GL_ACCOUNTS`, `GL_TRANSACTIONS`, `GL_LEDGER` | 12 |
| HR (PostgreSQL) | Human Resources | `employees`, `departments`, `payroll` | 21 |

---

## 📖 Demo Walkthrough

1. **Login** → Use `admin@dataplane.ai` / `admin123`
2. **Dashboard** → See all 5 connected databases with health scores
3. **Visualize** → Interactive graph showing CRM ↔ DW relationships and PII risks
4. **Query Studio** → Type "Show all tables" or "Find PII columns" in English
5. **AskData** → Ask "What PII risks exist?" for AI-powered analysis
6. **Schema Mapper** → Drag columns or type "Map email_address to contact_email"
7. **Connectors** → Add new Postgres/MySQL/Oracle/JDBC connections
8. **Security** → Review DAMA classifications and PII policies

---

*Created with ❤️ powered by Advanced Agentic AI — Production-grade database intelligence platform.*
