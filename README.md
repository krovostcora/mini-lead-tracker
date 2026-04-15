## Mini Lead Tracker (CRM)

A full-stack lead management system built with **NestJS**, **Next.js**, and **MongoDB**. The project is fully containerized using **Docker** for a seamless setup and evaluation.

### Tech Stack

-   **Backend:** NestJS (TypeScript), MongoDB (Mongoose), Swagger (API Docs)
-   **Frontend:** Next.js (App Router), Tailwind CSS, Axios
-   **Infrastructure:** Docker, Docker Compose

---

### Features

-   **Lead Management:** Create, view, and list leads.
-   **Comment System:** Add and retrieve comments for each lead.
-   **API Documentation:** Interactive Swagger UI.
-   **Validation:** Strict DTO validation on the backend.
-   **Dockerized:** Single-command setup for the entire stack.

---

### Quick Start (Local Setup)

To run the project locally, you only need to have **Docker** and **Docker Compose** installed.

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/krovostcora/mini-lead-tracker](https://github.com/krovostcora/mini-lead-tracker)
    cd mini-lead-tracker
    ```

2.  **Run with Docker Compose:**
    ```bash
    docker-compose up --build
    ```

3.  **Access the applications:**
    -   **Frontend:** [http://localhost:3000](http://localhost:3000)
    -   **Backend API:** [http://localhost:3001/api](http://localhost:3001/api)
    -   **Swagger UI (Docs):** [http://localhost:3001/api/docs](http://localhost:3001/api/docs)

---

## 🔌 API Examples

- **Get Leads:** `GET /api/leads`
- **Create Lead:** `POST /api/leads` (Body: `{ "firstName": "John", "lastName": "Doe", "phone": "+12345", "email": "john@example.com" }`)
- **Add Comment:** `POST /api/leads/:id/comments` (Body: `{ "content": "Follow up tomorrow" }`)

---


### 📁 Project Structure

```text
mini-lead-tracker/
├── backend/          # NestJS application
│   ├── src/          # Source code
│   ├── Dockerfile    # Docker configuration for backend
│   └── ...
├── frontend/         # Next.js application
│   ├── src/          # Components and Logic
│   ├── Dockerfile    # Docker configuration for frontend
│   └── ...
└── docker-compose.yml # Orchestration for App, DB, and Network
```
---
##  Future Improvements (If I had more time)
1. **Full Test Coverage:** Implement Unit tests for Services and E2E tests for API routes.
2. **Caching:** Integrate Redis for faster Lead listing retrieval.
3. **CI/CD:** Setup GitHub Actions for automated linting and Docker image builds.