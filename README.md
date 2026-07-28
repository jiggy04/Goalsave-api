# Betechified GoalSave Capstone Project 💰

**Improving Saving Habits Through a Simple Digital Budget and Savings Tracker**

A secure, scalable RESTful API built with Node.js, Express, and MongoDB.

GoalSave helps students, young professionals, and low-to-middle-income earners build better financial habits.

**Repo**: `Betechified GoalSave Capstone project` :  `jiggy04/Goalsave-api` & `kayodeakanni/Goalsave-api`
**Live API**: `https://goalsave-api.onrender.com`

---

### Features
- **User Authentication**: Secure signup/login with `bcryptjs` + JWT
- **Wallet System**: Track multiple wallets and balances
- **Budget Management**: Create weekly/monthly budgets by category
- **Income & Expense Tracking**: Log transactions with categories
- **Savings Goals**: Create goals, track progress, add contributions
- **Dashboard & Reports**: Analytics, spending trends, weekly/monthly reports
- **Category Management**: Custom income/expense categories
- **Validation**: Joi validation per module in `src/validators/`
- **Error Handling**: Centralized middleware + custom `AppError` class
- **Ownership Verification**: Users can only access their own data
- **Pagination & Querying**: Built-in filtering, sorting, and pagination

### Tech Stack
| Layer | Technology |
| --- | --- |
| Runtime | Node.js 18+ + Express |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT, bcryptjs |
| Validation | Joi |
| Architecture | MVC + Service Layer |
| Hosting | Render.com |

### Project Structure
Goalsave-api/
├── src/
│   ├── config/
│   │   ├── http://connectDatabase.js
│   │   └── http://validateEnv.js
│   ├── controllers/
│   │   ├── http://auth.controller.js
│   │   ├── http://budget.controller.js
│   │   ├── http://category.controller.js
│   │   ├── http://dashboard.controller.js
│   │   ├── http://report.controller.js
│   │   ├── http://savings.controller.js
│   │   ├── http://transaction.controller.js
│   │   └── http://wallet.controller.js
│   ├── middleware/
│   │   ├── http://auth.middleware.js
│   │   ├── http://error.middleware.js
│   │   ├── http://notFound.middleware.js
│   │   └── http://validate.middleware.js
│   ├── models/
│   │   ├── http://Budget.js
│   │   ├── http://Category.js
│   │   ├── http://SavingsGoal.js
│   │   ├── http://Transaction.js
│   │   ├── http://User.js
│   │   └── http://Wallet.js
│   ├── routes/
│   │   ├── http://auth.routes.js
│   │   ├── http://budget.routes.js
│   │   ├── http://category.routes.js
│   │   ├── http://dashboard.routes.js
│   │   ├── http://report.routes.js
│   │   ├── http://savings.routes.js
│   │   ├── http://transaction.routes.js
│   │   ├── http://wallet.routes.js
│   │   └── http://index.js
│   ├── services/
│   │   ├── http://auth.service.js
│   │   ├── http://budget.service.js
│   │   ├── http://category.service.js
│   │   ├── http://dashboard.service.js
│   │   ├── http://report.service.js
│   │   ├── http://savings.service.js
│   │   ├── http://transaction.service.js
│   │   └── http://wallet.service.js
│   ├── utils/
│   │   ├── http://ApiResponse.js
│   │   ├── http://AppError.js
│   │   ├── http://asyncHandler.js
│   │   ├── http://bcrypt.js
│   │   ├── http://jwt.js
│   │   ├── http://pagination.js
│   │   ├── http://queryFeatures.js
│   │   └── http://userResponse.js
│   ├── validators/
│   │   ├── http://auth.validator.js
│   │   ├── http://budget.validator.js
│   │   ├── http://category.validator.js
│   │   ├── http://savings.validator.js
│   │   ├── http://transaction.validator.js
│   │   └── http://wallet.validator.js
│   ├── http://app.js
│   └── http://server.js
├── .env.example
├── .gitignore
├── http://package.json
├── http://package-lock.json
└── http://README.md

### Data Models
#### User, Wallet, Budget, Transaction, SavingsGoal, Category
See `/src/models/` for full schemas. All models are scoped to `user` for ownership verification.

### API Endpoints

#### Auth
`POST /api/auth/register` - Register  
`POST /api/auth/login` - Login, returns JWT

#### Wallet
`POST /api/wallet` - Create wallet  
`GET /api/wallet` - Get all user wallets  

#### Budget
`POST /api/budget` - Create budget  
`GET /api/budget` - Get budgets `?type=monthly&period=2026-07`  

#### Category
`POST /api/category` - Create custom category  
`GET /api/category?type=expense` - Get categories

#### Transaction
`POST /api/transaction` - Log income/expense  
`GET /api/transaction` - Get transactions with pagination/filtering  
`GET /api/transaction?search=groceries&page=1&limit=10`

#### Savings Goals
`POST /api/savings` - Create goal  
`PUT /api/savings/:id/contribute` - Add contribution  
`GET /api/savings` - Get all goals with progress %

#### Dashboard & Reports
`GET /api/dashboard` - Overview: income, expenses, savings  
`GET /api/report/monthly?month=2026-07` - Monthly report  
`GET /api/report/analytics` - Spending by category

All protected routes require: `Authorization: Bearer <token>`

### Validation
Each module has Joi validation in `/src/validators/`.  
Validation is applied globally via `validate.middleware.js`

### Setup & Installation

**1. Clone & Install**
```bash
git clone <your-repo-url>
cd Goalsave-api
npm install
*2. Environment Variables*  
Copy `.env.example` to `.env` and fill in:
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/goalsave
JWT_SECRET=your_jwt_secret
NODE_ENV=development
*3. Run Server*
npm run dev
Server runs on `http://localhost:3000`

### Deployment to Render
1. Push to GitHub
2. Create Web Service on http://Render.com
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Add Environment Variables from `.env.example`

### Success Metrics
Metric	Target
User registration rate	5,000 users in 6 months
Weekly active users	60% of registered users
Budget completion rate	75%
Savings goal completion	50%
90-day retention	50%

### Contributors
Capstone Team - Betechified
  
---
Built for Betechified GoalSave Capstone 2026

