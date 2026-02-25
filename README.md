# Memo-rise MVP

Monorepo scaffold for **Memo-rise by Dhee Labs**.

## Stack
- Frontend: React + Tailwind (`/frontend`)
- Backend: NestJS + MongoDB (`/backend`)

## Backend
Implemented modules and endpoints:
- Auth: `POST /api/register`, `POST /api/login`
- Sets: `POST/GET /api/sets`, `GET/PUT/DELETE /api/sets/:id`
- Cards: `POST /api/sets/:setId/cards`, `PUT/DELETE /api/sets/:setId/cards/:cardId`, `POST /api/sets/:setId/cards/:cardId/mark-learned`
- Testing: `GET /api/test/by-set/:setId`, `GET /api/test/by-difficulty/:difficulty`, `GET /api/test/automatic`, `POST /api/test/complete`
- Analytics: `GET /api/analytics/streak`, `GET /api/analytics/memorize-score`

Business rules implemented:
- Email unique
- Set name unique per user
- Max 100 sets per user
- Max 100 cards per set
- Title/definition max 50 words
- Spaced repetition defaults: easy 7d, good 3d, hard 1d
- Learned cards excluded from automatic tests
- Daily streak increments on completed test
- Weighted Memo-rise score by difficulty

## Frontend
Pages/components from spec:
- Login/Register
- Landing page with automatic test CTA and mode options
- Dashboard with set/card creation and analytics
- Test page with flip card + learned/unlearned actions
- Components: NavBar, FlashcardCard, FlashcardList, ProgressAnalytics, SetForm, FlashcardForm

## Run Locally
### 1) Backend
```bash
cd backend
cp .env.example .env
npm install
npm run start:dev
```

### 2) Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Backend default: `http://localhost:4000`
Frontend default: `http://localhost:5173`

## Run With Docker Compose
From repository root:

```bash
docker compose up --build
```

Services:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:4000/api`
- MongoDB: `mongodb://localhost:27017/memorise`

Stop and remove containers:

```bash
docker compose down
```

Stop and remove containers + volumes:

```bash
docker compose down -v
```

## Notes
- MongoDB must be running locally or `MONGO_URI` must point to an accessible instance.
- JWT auth is required for all non-auth routes.
- For production deployment, replace `JWT_SECRET` and use production-ready Docker images (non-dev server commands).
