# API — Employee Management REST API

Hono-based REST API with OpenAPI documentation for employee management.

## Features

- **Employee CRUD**: Create, read, update, and delete employee records
- **Insights Endpoints**: Global summary, salary distribution, top earners, salary by department, salary by country, salary by job title
- **OpenAPI Documentation**: Auto-generated Swagger UI
- **Rate Limiting**: Per-endpoint rate limiting with `hono-rate-limiter`
- **Structured Logging**: Pino logger
- **Type Safety**: End-to-end type safety with Zod schemas and Hono OpenAPI
- **Database**: Prisma ORM with PostgreSQL
- **Infrastructure**: AWS CDK for deployment

## API Endpoints

| Endpoint                             | Description                            |
| ------------------------------------ | -------------------------------------- |
| `GET /employees`                     | List employees (paginated, filterable) |
| `GET /employees/:id`                 | Get employee by ID                     |
| `POST /employees`                    | Create a new employee                  |
| `PUT /employees/:id`                 | Update an employee                     |
| `DELETE /employees/:id`              | Delete an employee                     |
| `GET /insights/summary`              | Global payroll summary                 |
| `GET /insights/salary-distribution`  | Salary distribution data               |
| `GET /insights/top-earners`          | Top earners                            |
| `GET /insights/salary-by-department` | Payroll by department                  |
| `GET /insights/salary-by-country`    | Salary by country                      |
| `GET /insights/salary-by-job-title`  | Salary by job title                    |
| `GET /doc`                           | Swagger UI documentation               |

## Getting Started

```sh
npm run dev
```

Server runs at `http://localhost:4000`.

### Database

```sh
npm run db:migrate    # Run migrations
npm run db:generate   # Generate Prisma client
npm run db:seed       # Seed the database
```

### Testing

```sh
npm run test              # Run tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

### Deployment (AWS CDK)

```sh
npm run cdk:synth    # Synthesize CloudFormation template
npm run cdk:deploy   # Deploy to AWS
npm run cdk:diff     # Diff against deployed stack
```
