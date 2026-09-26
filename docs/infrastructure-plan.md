# Infrastructure Plan

**Project:** Live Racing Data Platform (working name until the name is decided)  
**Covers:** hosting and pricing, Cloudflare, Terraform, CI/CD, secrets, monitoring, security  
**Last updated:** 2026-09-23

This is Phase 3 in the Master Plan. There's no early public deploy, so the first public release is this full cloud build. There is one environment, production. Testing stays local in Docker Compose.

## 1. Hosting and pricing (open decision 2)

### 1.1 What we're pricing

- **Backend:** .NET API with the Polling Service inside it. It has to keep running while it polls during race sessions, so it can't shut down to zero. 0.25 vCPU and 0.5 GB of memory is enough.
- **Frontend:** Next.js running as a server. 0.25 vCPU and 0.5 GB.
- **Database:** PostgreSQL, under 5 GB of data.
- **Traffic:** tiny, under 10 GB a month going out.
- **Cloudflare:** the Free plan sits in front of every option (DNS, HTTPS, firewall) at $0.

**Pricing basis:**

- List prices on September 23, 2026, in US East (AWS us-east-1, Azure East US), using 730 hours a month.
- "First year" is the 12-month total for a new account opened around October 2026, after free tiers and credits.
- "Monthly after" is the cost once free tiers and credits run out.
- Figures marked *(unverified)* came from a third-party source or an estimate, not an official price page.
- Totals are calculated before rounding, so line items can add up to a cent more or less.

### 1.2 Free credits and free tiers

| Offer | What you get | Catches |
|---|---|---|
| New AWS account (opened after July 15, 2025) | $100 credit, plus up to $100 more for completing starter tasks | On the Free plan, the account closes after 6 months or when credits run out, unless you upgrade to the Paid plan (unused credits carry over). Credits expire after 12 months. These accounts don't get the old 12-month free RDS or EC2 |
| AWS EC2 t4g.small trial | 750 hours a month free, through December 31, 2026 | Ends Dec 31 |
| Azure free account | $200 credit for the first 30 days, plus 12 months of: 750 hours of PostgreSQL B1ms with 32 GB storage, one Standard container registry, 750 hours each of B1s, B2pts v2, and B2ats v2 VMs | After 30 days you must switch to pay-as-you-go to keep going |
| Azure Container Apps | Every month, forever: 180,000 vCPU-seconds, 360,000 GiB-seconds, 2 million requests | Shared across all apps in the subscription |
| Oracle Cloud Always Free | 2 ARM CPUs and 12 GB of memory (cut from 4 and 24 on June 15, 2026), 200 GB storage | Idle machines can be taken back; capacity can be hard to get |
| Google Cloud | $300 for 90 days; one small e2-micro VM always free | e2-micro has 1 GB of memory |
| GitHub Student Pack (active about 11 more months) | Azure $100 (Azure for Students, needs a school email), Heroku $13/month for 24 months, free domains (Name.com, .tech, .me), Datadog Pro for 2 years, New Relic, LocalStack | Needs current student status |

### 1.3 Full AWS stack

**A1. Containers with a load balancer** (the original design): ECS Fargate for backend and frontend, an Application Load Balancer, RDS PostgreSQL.

| Line item | Unit price | Quantity | Monthly |
|---|---|---|---|
| Fargate backend, 0.25 vCPU / 0.5 GB, ARM | $0.0000089944 per vCPU-second, $0.0000009889 per GB-second | 730 hours | $7.21 |
| Fargate frontend, same size | same | 730 hours | $7.21 |
| Load balancer | $0.0225/hour | 730 hours | $16.43 |
| Load balancer usage units | $0.008 per unit-hour | about 0.05 average *(estimate)* | $0.29 |
| Public IP addresses: 2 for the load balancer, 2 for the tasks | $0.005/hour each | 4 | $14.60 |
| RDS PostgreSQL db.t4g.micro, single zone | $0.016/hour *(unverified)* | 730 hours | $11.68 |
| RDS storage | $0.115 per GB-month *(unverified)* | 20 GB | $2.30 |
| ECR (container images) | $0.10 per GB-month | 1 GB | $0.10 |
| Secrets Manager | $0.40 per secret | 2 | $0.80 |
| CloudWatch logs, outbound data | free tier (5 GB logs, 100 GB data) | small | $0.00 |
| **Total** | | | **$60.61** (x86 instead of ARM: $64.22) |

No NAT gateway: tasks sit in public subnets. Adding one costs about $33 a month more.

**Other AWS setups:**

| Option | What's in it | Monthly after | First year |
|---|---|---|---|
| A2. Containers, no load balancer | A1 minus the load balancer and its 2 IPs; Cloudflare Tunnel reaches the backend instead | $36.60 | $239 to $339 |
| A3. One server | EC2 t4g.small ($12.26) running Docker Compose with Postgres in a container, 20 GB disk ($1.60), 1 public IP ($3.65) | $17.51 | $0 to $73 |
| A3 with managed database | A3 plus RDS ($13.98) instead of Postgres in a container | $31.49 | about $141 to $241 *(estimate)* |
| A4. Lightsail server | $12 plan: 2 GB memory, public IP and 3 TB of data included, running Docker Compose | $12.00 | $0 to $44 |
| A4. Lightsail managed | Lightsail container service Micro ($10) plus Lightsail managed PostgreSQL ($15) | $25.00 | $100 to $200 |
| A5. App Runner | Not available: AWS closed App Runner to new customers. It also slows the CPU when there are no requests, which would stall the Polling Service | n/a | n/a |
| A6. Amplify frontend | Frontend on Amplify Hosting (about $2.73: builds, data, server rendering); backend on Fargate with Tunnel, plus RDS | $28.42 | $141 to $241 |
| A7. Kubernetes (EKS) | EKS control plane ($73.00), one t4g.small worker ($12.26), disk, IP, RDS, ECR | $104.59 | $1,055 to $1,155 |

Notes:

- **Year-one ranges:** the low end assumes the full $200 in credits, the high end only $100.
- **A2:** a sidecar is a small helper container that runs next to the app container. Pointing Cloudflare straight at a task's public IP is fragile, because the IP changes on every deploy; use the Tunnel sidecar.
- **A6:** Amplify's docs don't list Next.js 16 support *(unverified)*.
- **A7:** extended Kubernetes support costs $0.60/hour instead of $0.10. EKS on Fargate (no worker servers) comes to about $166, because it needs a NAT gateway.

### 1.4 Full Azure stack

**B1. Container Apps:** backend always running (1 copy), frontend scales to zero when unused, PostgreSQL Flexible Server.

| Line item | Unit price | Quantity | Monthly |
|---|---|---|---|
| Backend, 0.25 vCPU / 0.5 GiB, 1 copy always on | Active: $0.000024 per vCPU-second. Idle: $0.000003 per vCPU-second. Memory: $0.000003 per GiB-second. Free grant subtracted | 730 hours | $4.46 typical (idle most of the month, about 15 active race hours *(estimate)*); $4.29 if always idle, $14.31 if always active |
| Frontend, scales to zero | same | about 25 active hours *(estimate)* | $0.68 |
| PostgreSQL Flexible Server B1ms | $0.017/hour | 730 hours | $12.41 |
| PostgreSQL storage | $0.115 per GB-month | 32 GB minimum | $3.68 |
| Container registry, Basic | $0.1666/day | 1 | $5.07 |
| Key Vault | $0.03 per 10,000 operations | about 1,000 | $0.01 |
| Log Analytics, outbound data | free tier (5 GB logs, 100 GB data) | small | $0.00 |
| **Total** | | | **$26.31** (up to $36.15 if the backend is never idle) |

**First year for B1:** about $57, up to $165. The $200 credit covers month one, and the database and registry are free for 12 months.

**Registry cost:** GitHub's container registry is free for public repos. Using it instead of Azure's saves $5.07 a month on any Azure option.

**Other Azure setups:**

| Option | What's in it | Monthly after | First year |
|---|---|---|---|
| B2. App Service | Backend and frontend on one Basic B1 Linux plan ($12.41), plus PostgreSQL ($16.09). The Free F1 tier doesn't work: 60 CPU minutes a day and no custom domains | $28.50 | about $137 |
| B3. One VM | VM running Docker Compose, plus disk ($2.40) and public IP ($3.65). B2pts v2, 1 GB: $12.18. B1ms, 2 GB: $21.16. B2pls v2, 4 GB: $30.58. B2s, 4 GB: $36.42 | $12.18 to $36.42 | about $40 to $67 on a free-tier size |
| B4. Static Web Apps frontend | Frontend on Static Web Apps Free, backend and database as in B1 | $25.62 | about $49 |
| B5. Kubernetes (AKS) | AKS Free tier (no control-plane fee), one B2s worker ($30.37), disk ($10.21 *(estimate)*), load balancer ($18.25 *(unverified)*), IP, PostgreSQL, registry | $83.63 (Standard tier: $156.63) | about $687 |

Notes:

- **B3:** 1 GB of memory is tight for .NET, Next.js, and Postgres together.
- **B4:** Next.js server rendering on Static Web Apps is still in preview, with a 250 MB app size limit.

### 1.5 Hybrid: frontend on one cloud, backend on another

In every hybrid setup, the frontend has to reach the backend at its own public address (for example `api.<domain>`), also behind Cloudflare. Either Cloudflare routes `/api/*` to that address, or the Next.js server forwards `/api/*` to it. Data moving between clouds costs about $0 at our traffic, because AWS and Azure each include 100 GB a month of free outbound data.

| Option | Frontend | Backend and database | Monthly after | First year |
|---|---|---|---|---|
| C1a | AWS Fargate with Tunnel ($10.91) | Azure Container Apps + PostgreSQL + registry ($25.63) | $36.54 | about $49 to $80 |
| C1b | AWS Amplify ($2.73) | Azure, as C1a | $28.36 | about $49 |
| C2a | Azure Container Apps (fits in the free grant, $0) | AWS Fargate + RDS ($25.69) | $25.69 ($30.76 with Azure's registry) | $108 to $208 |
| C2b | Azure Static Web Apps Free | AWS one server, EC2 t4g.small with Compose | $17.51 | $0 to $73 |
| C3 | Cloudflare Workers (Free $0, or Paid $5) | Azure Container Apps + PostgreSQL + registry | $25.63 / $30.63 | $49 to $109 |
| C3 (VM) | Cloudflare Workers | Azure B2pts v2 VM with Compose | $12.18 / $17.18 | about $40 to $127 |
| C4 | Cloudflare Workers | AWS Fargate + RDS | $25.69 / $30.69 | $108 to $268 |
| C4 (EC2) | Cloudflare Workers | AWS one server, EC2 t4g.small | $17.51 / $22.51 | $0 to $133 |

**Frontend on Cloudflare (C3, C4):**

- Next.js running as a server needs an adapter on Workers. For Next.js 16, Cloudflare now recommends vinext; OpenNext is still supported for existing apps.
- The Free plan allows 100,000 requests a day and 10 ms of CPU per request, with a 3 MiB bundle limit. A server-rendered Next.js app will probably exceed the CPU and bundle limits, so plan on Workers Paid: $5 a month, 10 MiB bundle limit.
- Cloudflare Pages is not a server-rendering option for Next.js.

**Backend and database on different clouds (C5):**

- Backend on Azure with the database on AWS RDS: about $27.16 plus the frontend.
- Backend on AWS Fargate with the database on Azure PostgreSQL: about $27.80 plus the frontend.
- The catch: the database would need a public address, locked down with a firewall, TLS, and a strong password. Neither Container Apps nor Fargate has a fixed outbound IP to allow through that firewall. Every query also crosses clouds. Possible, but it's the weakest setup here.

### 1.6 Other providers

| Option | What's in it | Monthly after | First year | Fits an always-on backend? |
|---|---|---|---|---|
| Google Cloud Run + Cloud SQL | The backend must use instance-based billing to keep running between requests, which needs at least 1 vCPU ($44.71). Frontend on request-based billing ($0 within free tier). Cloud SQL db-f1-micro ($7.67) with 10 GB ($1.70) | $55.21 | about $497 ($300 credit covers 90 days) | Yes, only with instance-based billing |
| Google e2-micro | Always-free VM with Compose, plus IP and outbound data | $4.73 | about $43 | Yes, but 1 GB of memory is tight |
| Oracle Cloud Always Free | ARM VM, 2 CPUs and 12 GB, with Compose | $0 | $0 | Yes; risk of idle reclaim and capacity shortages |
| Heroku | Basic backend ($7) + frontend (Eco $5, sleeps, or Basic $7) + Postgres Essential-1 ($9, 10 GB) | $21 to $23 (about $8 to $10 after the $13 Student Pack credit) | about $96 to $120 with the Student Pack | Yes, on Basic. Reported to be in maintenance-only mode since February 2026 *(unverified, third-party report)* |
| Render | Starter backend ($7) + free frontend (sleeps after 15 minutes) or $7, + Postgres from $6 plus storage | $14.50 to $21.50 | $174 to $258 | Yes, on Starter. Free Postgres expires after 30 days |
| Railway | Hobby plan, $5 minimum including $5 of usage | about $6.66 *(estimate)* | about $80 *(estimate)* | Yes; billed by actual use |
| Fly.io | 3 small machines, 512 MB each ($9.57), 10 GB volume, data | $11.27 (with managed Postgres: $47.38) | about $135 | Yes |
| Vercel (frontend only) | Hobby is free but non-commercial only; Pro is $20 per user | $0 / $20 | $0 / $240 | Frontend only |

### 1.7 Costs that apply to any option

- **Domain:**
  - Cloudflare Registrar sells at cost: a .com is about $10.44 to $10.46 a year *(unverified, third-party)*.
  - The wholesale .com price rises on November 1, 2026 *(unverified, third-party)*.
  - The Student Pack includes free domains.
- **Terraform state storage:** a few cents a month or less.
- **Monitoring:** Grafana Cloud Free: 10,000 metric series, 50 GB of logs, 14-day retention.
- **CI:** GitHub Actions is free for public repos.

### 1.8 Summary

| Option | Monthly after | First year | Notes |
|---|---|---|---|
| A1 AWS containers + load balancer | $60.61 | $527 to $627 | The load balancer and its IPs are about $24 of this |
| A2 AWS containers + Tunnel | $36.60 | $239 to $339 | |
| A3 AWS one server | $17.51 | $0 to $73 | Server free through Dec 31, 2026 |
| A4 Lightsail server | $12.00 | $0 to $44 | |
| A7 AWS Kubernetes (EKS) | $104.59 | $1,055 to $1,155 | |
| B1 Azure Container Apps | $26.31 | about $57 | Up to $36.15 / $165 if never idle |
| B2 Azure App Service | $28.50 | about $137 | |
| B3 Azure one VM | $12.18 to $36.42 | about $40 to $67 | Free-tier sizes have 1 GB |
| B5 Azure Kubernetes (AKS) | $83.63 | about $687 | |
| C1b AWS frontend + Azure backend | $28.36 | about $49 | |
| C2b Azure frontend + AWS one server | $17.51 | $0 to $73 | |
| C3 Cloudflare frontend + Azure backend | $30.63 | $49 to $109 | Assumes Workers Paid |
| C4 Cloudflare frontend + AWS one server | $22.51 | $0 to $133 | Assumes Workers Paid |
| Oracle Always Free | $0 | $0 | Reclaim and capacity risk |
| Railway | about $6.66 | about $80 | Estimate, billed by use |
| Fly.io | $11.27 | about $135 | Self-run Postgres |
| Render | $14.50 to $21.50 | $174 to $258 | |
| Heroku (with Student Pack) | $21 to $23 | about $96 to $120 | |
| Google Cloud Run + Cloud SQL | $55.21 | about $497 | |

### 1.9 Recommendation

Make B1 (all Azure, Container Apps, with Cloudflare in front) the long-term home:

- It's the cheapest option that stays managed.
- It doesn't charge for a load balancer.
- It barely charges while the backend waits between races.

If AWS experience matters, run A3 (one AWS server) first on new-account credits, then move to Azure. The migration itself is a good project story. Either way, keep everything in Terraform so the move is code, not clicking.

## 2. Cloudflare (maximum practical security)

**Goal:** every request goes through Cloudflare, and nobody can reach the servers directly.

- **DNS:** app hostname proxied through Cloudflare (orange cloud).
- **Encryption:** Full (strict) mode, with a Cloudflare Origin CA certificate on the server.
  - Or use Cloudflare Tunnel: a small `cloudflared` container connects out to Cloudflare, so the server has no open inbound ports at all.
  - Either way, not Flexible. Flexible leaves the hop between Cloudflare and the server unencrypted.
- **Lock the server down:** Tunnel, or allow only Cloudflare's published IP ranges at the server's firewall or ingress settings.
  - On a single server (A3, B3), Tunnel is free: one more container in Compose.
  - On Azure Container Apps, `cloudflared` would be its own always-on app, about $6 a month. Limiting ingress to Cloudflare's IP ranges costs nothing.
- **HTTPS settings:** Always Use HTTPS, HSTS, minimum TLS 1.2.
- **Firewall (WAF):**
  - Turn on the Free Managed Ruleset.
  - Add a custom rule blocking `/api/admin/*` except from our own IPs, on top of the X-Admin-Key header.
  - Add a rate-limiting rule on `/api/*`.
- **Bot Fight Mode** on.
- **Security headers** (Content-Security-Policy, X-Frame-Options, Referrer-Policy): set in nginx or with Cloudflare Transform Rules.
- **Manage it all in Terraform** with the Cloudflare provider: DNS records, SSL settings, WAF rules.

**What Cloudflare's plans page confirms for Free:** unmetered DDoS protection, WAF, Free Managed Ruleset, Universal SSL. Check the dashboard for how many custom WAF and rate-limiting rules Free allows.

**What changes in the repo:**

- Today nginx redirects HTTP to HTTPS using a self-signed certificate that `start.sh` generates, and Compose opens ports 80 and 443.
- With Tunnel, nginx can serve plain HTTP inside the private network.
- With Full (strict), mount the Origin CA certificate in place of the self-signed one.

## 3. Terraform

The folder layout follows the project structure in Team Onboarding:

```
terraform/
├── main.tf               calls the modules
├── variables.tf
├── outputs.tf
├── providers.tf          cloud provider(s) and Cloudflare
├── backend.tf            where Terraform keeps its state
├── bootstrap/            one-time setup of state storage, run locally once
├── environments/
│   └── prod/             production values (prod.tfvars) and state settings
└── modules/
    ├── network/
    ├── registry/         container images
    ├── database/
    ├── app/              backend, frontend (and cloudflared, if using Tunnel)
    ├── secrets/
    ├── cloudflare/       DNS, SSL, WAF rules
    └── monitoring/
```

Only `prod` exists. The `environments/` folder keeps room for another environment later without restructuring.

**State storage:**

- AWS: an S3 bucket. Locking uses S3's built-in lock file (Terraform 1.10 and later) or a DynamoDB table.
- Azure: a storage account.

**If AWS, one server (A3):**

- **Network:** VPC, one public subnet, internet gateway.
- **Firewall:** a security group with no inbound ports if `cloudflared` runs on the server (Tunnel), or only Cloudflare's IP ranges on 443.
- **Server:** EC2 t4g.small with a 20 to 30 GB disk, and a startup script that installs Docker and starts Compose.
- **Access:** an IAM role so we connect through AWS Systems Manager Session Manager. No SSH port.
- **Images:** pulled from GitHub's registry or ECR.
- **Database:** Postgres in a container with nightly backups to S3, or RDS for about $14 a month more.

**If AWS, containers (A1, A2):**

- **Network:** VPC, two public subnets, internet gateway, no NAT gateway (saves about $33 a month).
- **Images:** ECR.
- **Database:** RDS with `manage_master_user_password = true`.
- **ECS:** task definitions with separate task and execution roles, log groups, and health checks.
- **Code drafts:** full drafts are in the old `planning-race-intel.md`, section 3.4.

**If Azure (B1):**

- A resource group.
- A small Log Analytics workspace. Keep logging minimal; it bills per GB.
- A Container Apps environment with two apps:
  - backend, minimum 1 copy
  - frontend, minimum 0
- PostgreSQL Flexible Server, a container registry (or GitHub's), and Key Vault.
- A managed identity, so the apps can pull images and read secrets without passwords.

**Rules:**

- AI agents may write Terraform, but a person runs `apply`.
- Secret values never go in Terraform state: create the secret in Terraform and set its value outside it.

## 4. CI/CD (GitHub Actions)

```
.github/
├── dependabot.yml
└── workflows/
    ├── ci.yml               every pull request: build and test backend, lint and build frontend,
    │                        build Docker images, scan them with Trivy
    ├── cd-backend.yml       merge to main: build, push image, deploy
    ├── cd-frontend.yml      merge to main: build, push image, deploy
    ├── terraform-plan.yml   pull request touching terraform/: plan, post it as a comment
    └── terraform-apply.yml  merge to main touching terraform/: apply after a person approves
```

- **Separate workflow files:** the reference layout uses one `ci-cd.yml`. Splitting it lets backend, frontend, and infrastructure changes each run only their own pipeline.
- **Login without stored keys (OIDC):** GitHub hands each workflow a short-lived token that the cloud trusts. On AWS that's an IAM role; on Azure it's a federated credential. No long-lived cloud keys are stored in GitHub.
- **Approval gate:** a GitHub Environment named `prod` with a required reviewer, so nothing changes infrastructure without a person approving it.
- **Workflow drafts:** AWS versions are in `planning-race-intel.md`, section 3.5.

## 5. Secrets

- **Local:** `.env` (gitignored), copied from `.env.example`. Today that's only `POSTGRES_PASSWORD` and `ADMIN__KEY`.
- **Cloud:** AWS Secrets Manager or Azure Key Vault, injected when the container starts. Let the platform manage the database password where it can.
- **CI:** only non-secret IDs in GitHub secrets.

## 6. Monitoring

- **Stack:** OpenTelemetry in ASP.NET Core, sending metrics through a Grafana Alloy collector to Grafana Cloud's free tier.
- **Student Pack tools:** Datadog and New Relic are included, but they expire. Grafana's free tier doesn't.
- **Custom metrics:**
  - `nascar_live_poll_total{result="success|failure"}`
  - `nascar_live_poll_duration_seconds`
  - `nascar_import_rows_total{type}`
- **Dashboards:**
  - service overview: requests, errors, response times
  - NASCAR live: poll success rate, poll duration
- **Alert:** server errors above 1% for 5 minutes, or repeated poll failures.

## 7. Security checklist before first public deploy

- Dependabot for npm, NuGet, GitHub Actions, and Terraform providers
- Trivy image scans in CI, failing on high or critical issues
- CodeQL code scanning
- CORS removed, production settings in place, and the mock feed switched off (Backend Spec 1.8, 1.9, 1.10)
- Admin endpoints blocked at Cloudflare (section 2)

## 8. Order of work

1. Decide hosting, name, and domain
2. Set up Terraform state storage and the container registry
3. Database and secrets
4. Backend container with health check
5. Frontend container
6. Cloudflare: DNS, encryption, Tunnel or lockdown, WAF rules
7. CI, then CD with OIDC login
8. Monitoring dashboard and alert
9. Security scans
10. README and architecture diagram

## Sources

- AWS Free Tier: https://aws.amazon.com/free/ and https://aws.amazon.com/free/free-tier-faqs/
- EC2 t4g free trial: https://aws.amazon.com/ec2/instance-types/t4/
- Fargate: https://aws.amazon.com/fargate/pricing/
- Public IPv4 and NAT: https://aws.amazon.com/vpc/pricing/
- Load balancer: https://aws.amazon.com/elasticloadbalancing/pricing/
- RDS (unit prices via https://instances.vantage.sh/aws/rds/db.t4g.micro): https://aws.amazon.com/rds/postgresql/pricing/
- ECR: https://aws.amazon.com/ecr/pricing/
- Secrets Manager: https://aws.amazon.com/secrets-manager/pricing/
- EBS: https://aws.amazon.com/ebs/pricing/
- Lightsail: https://aws.amazon.com/lightsail/pricing/
- App Runner availability: https://docs.aws.amazon.com/apprunner/latest/dg/apprunner-availability-change.html
- Amplify: https://aws.amazon.com/amplify/pricing/
- EKS: https://aws.amazon.com/eks/pricing/
- Azure retail prices: https://prices.azure.com/api/retail/prices
- Azure Container Apps billing: https://learn.microsoft.com/en-us/azure/container-apps/billing
- Azure free account: https://azure.microsoft.com/en-us/pricing/purchase-options/azure-account
- Azure App Service: https://azure.microsoft.com/en-us/pricing/details/app-service/linux/
- Azure Static Web Apps and Next.js: https://learn.microsoft.com/en-us/azure/static-web-apps/nextjs
- AKS tiers: https://learn.microsoft.com/en-us/azure/aks/free-standard-pricing-tiers
- Azure bandwidth: https://azure.microsoft.com/en-us/pricing/details/bandwidth/
- Cloudflare plans: https://www.cloudflare.com/plans/
- Cloudflare Workers pricing: https://developers.cloudflare.com/workers/platform/pricing/
- Next.js on Workers: https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/
- Google Cloud Run: https://cloud.google.com/run/pricing
- Google Cloud SQL: https://cloud.google.com/sql/pricing
- Google free tier: https://docs.cloud.google.com/free/docs/free-cloud-features
- Oracle Always Free: https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm
- Heroku: https://www.heroku.com/pricing
- Render: https://render.com/pricing
- Railway: https://railway.com/pricing
- Fly.io: https://fly.io/docs/about/pricing/
- Vercel: https://vercel.com/pricing
- Grafana Cloud: https://grafana.com/pricing/
- GitHub Student Pack: https://education.github.com/pack
- DigitalOcean credit ending: https://aistudentdiscount.com/digitalocean-github-student-developer-pack-credits/
