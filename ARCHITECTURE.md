# CONTROL PLANE — DevOps Portfolio Architecture Spec

## Design Metaphor: "Control Plane"
The portfolio is a DevOps monitoring/control dashboard — like Grafana meets a terminal meets mission control.

### REJECTED Patterns (must NOT appear anywhere):
1. ❌ Hero with centered headline + CTA button → Instead: Terminal boot sequence with system info readout
2. ❌ Generic top navbar logo-left/links-right → Instead: Fixed left sidebar as "system modules panel"
3. ❌ Card-grid project layout → Instead: Deployment log expandable entries with status indicators
4. ❌ Vertical dot-and-line timeline → Instead: Horizontal CI/CD pipeline stages

### Color System (CSS Custom Properties)
```css
--bg-deep: #050a14;
--bg-primary: #0a1628;
--bg-secondary: #111d33;
--bg-surface: #162240;
--bg-hover: #1c2d4f;
--border-subtle: #1e3a5f;
--border-active: rgba(0, 212, 255, 0.3);
--text-primary: #e2e8f0;
--text-secondary: #94a3b8;
--text-muted: #475569;
--accent-cyan: #00d4ff;
--accent-green: #10b981;
--accent-amber: #f59e0b;
--accent-red: #ef4444;
--accent-purple: #8b5cf6;
--glow-cyan: 0 0 20px rgba(0, 212, 255, 0.3);
--glow-green: 0 0 20px rgba(16, 185, 129, 0.3);
```

### Typography
- Headings/Labels/Terminal: 'JetBrains Mono', monospace
- Body: 'Inter', sans-serif
- Scale: 12, 14, 16, 18, 20, 24, 32, 40, 48px

### Motion Rules
- Enter: fade + slide from left (data flow direction)
- Hover: subtle glow + scale(1.02), 200ms ease-out
- Scroll-triggered: stagger 80ms between siblings
- Terminal typing: 25ms per character
- Page transitions: crossfade with 10px Y offset, 300ms

---

## Data Models

### core.HeroIdentity (singleton — only 1 row)
- name: CharField(max_length=100)
- title: CharField(max_length=200)
- tagline: CharField(max_length=500)
- availability_status: CharField choices=[('available','Available'),('open','Open to Offers'),('unavailable','Unavailable')]
- avatar: ImageField(upload_to='avatars/', blank=True)
- location: CharField(max_length=100, blank=True)
- years_experience: PositiveIntegerField(default=0)

### core.ProfessionalSummary (singleton)
- content: TextField
- updated_at: DateTimeField(auto_now=True)

### core.SocialLink
- platform: CharField(max_length=50)
- url: URLField
- icon_class: CharField(max_length=50, blank=True)
- order: PositiveIntegerField(default=0)

### core.Resume
- file: FileField(upload_to='resumes/')
- uploaded_at: DateTimeField(auto_now_add=True)
- is_active: BooleanField(default=True)

### skills.SkillCategory
- name: CharField(max_length=100)
- icon: CharField(max_length=50, blank=True)
- order: PositiveIntegerField(default=0)

### skills.Skill
- category: ForeignKey(SkillCategory, related_name='skills', on_delete=CASCADE)
- name: CharField(max_length=100)
- proficiency: PositiveIntegerField(validators=[1-100])
- icon_url: URLField(blank=True)
- order: PositiveIntegerField(default=0)

### projects.Project
- title: CharField(max_length=200)
- slug: SlugField(unique=True)
- description: TextField
- tech_stack: JSONField(default=list)
- github_url: URLField(blank=True)
- live_url: URLField(blank=True)
- readme_content: TextField(blank=True)
- image: ImageField(upload_to='projects/', blank=True)
- is_github_synced: BooleanField(default=False)
- github_repo_name: CharField(max_length=200, blank=True)
- last_synced: DateTimeField(null=True, blank=True)
- status: CharField choices=[('deployed','Deployed'),('in_progress','In Progress'),('archived','Archived')]
- order: PositiveIntegerField(default=0)
- created_at: DateTimeField(auto_now_add=True)
- updated_at: DateTimeField(auto_now=True)

### certifications.Certification
- name: CharField(max_length=200)
- issuer: CharField(max_length=200)
- credential_id: CharField(max_length=200, blank=True)
- credential_url: URLField(blank=True)
- badge_image: ImageField(upload_to='certifications/', blank=True)
- date_obtained: DateField(null=True, blank=True)
- expiry_date: DateField(null=True, blank=True)
- status: CharField choices=[('obtained','Obtained'),('in_progress','In Progress'),('expired','Expired')]
- order: PositiveIntegerField(default=0)

### experience.Experience
- role: CharField(max_length=200)
- company: CharField(max_length=200)
- company_url: URLField(blank=True)
- start_date: DateField
- end_date: DateField(null=True, blank=True)
- is_current: BooleanField(default=False)
- description: TextField
- achievements: JSONField(default=list)
- technologies: JSONField(default=list)
- order: PositiveIntegerField(default=0)

### showcases.Showcase
- title: CharField(max_length=200)
- slug: SlugField(unique=True)
- description: TextField
- diagram_image: ImageField(upload_to='showcases/')
- technologies: JSONField(default=list)
- challenge: TextField(blank=True)
- solution: TextField(blank=True)
- impact: TextField(blank=True)
- order: PositiveIntegerField(default=0)
- created_at: DateTimeField(auto_now_add=True)

### contact.ContactMessage
- name: CharField(max_length=100)
- email: EmailField
- subject: CharField(max_length=200)
- message: TextField
- created_at: DateTimeField(auto_now_add=True)
- is_read: BooleanField(default=False)

---

## API Contract (Django → Next.js)

Base URL: http://localhost:8000

### Public Endpoints (no auth)
```
GET  /api/hero/          → { id, name, title, tagline, availability_status, avatar, location, years_experience }
GET  /api/summary/       → { id, content, updated_at }
GET  /api/skills/        → [{ id, category: {id, name, icon}, name, proficiency, icon_url, order }]
GET  /api/skill-categories/ → [{ id, name, icon, order, skills: [{id, name, proficiency, icon_url}] }]
GET  /api/projects/      → [{ id, title, slug, description, tech_stack, github_url, live_url, image, status, is_github_synced, created_at }]
GET  /api/projects/<slug>/ → { ...full detail including readme_content }
GET  /api/certifications/ → [{ id, name, issuer, credential_id, credential_url, badge_image, date_obtained, expiry_date, status }]
GET  /api/experience/    → [{ id, role, company, company_url, start_date, end_date, is_current, description, achievements, technologies }]
GET  /api/showcases/     → [{ id, title, slug, description, diagram_image, technologies, challenge, solution, impact }]
GET  /api/showcases/<slug>/ → { ...full detail }
GET  /api/social-links/  → [{ id, platform, url, icon_class }]
GET  /api/resume/        → { id, file, uploaded_at } (active resume only)
POST /api/contact/       → { name, email, subject, message } → 201
```

### Auth Endpoints
```
POST /api/auth/register/ → { username, email, password } → { access, refresh, user: {id, username, email} }
POST /api/auth/login/    → { username, password } → { access, refresh, user: {id, username, email} }
POST /api/auth/refresh/  → { refresh } → { access }
```

### Admin Endpoints (JWT required in Authorization: Bearer <token>)
```
GET/PUT    /api/admin/hero/              → get/update hero
GET/PUT    /api/admin/summary/           → get/update summary
GET/POST   /api/admin/skill-categories/  → list/create categories
PUT/DELETE /api/admin/skill-categories/<id>/ → update/delete category
GET/POST   /api/admin/skills/            → list/create skills
PUT/DELETE /api/admin/skills/<id>/       → update/delete skill
GET/POST   /api/admin/projects/          → list/create projects
GET/PUT/DELETE /api/admin/projects/<id>/ → detail/update/delete project
POST       /api/admin/projects/<id>/resync/ → re-sync from GitHub
GET/POST   /api/admin/certifications/    → list/create
PUT/DELETE /api/admin/certifications/<id>/ → update/delete
GET/POST   /api/admin/experience/        → list/create
PUT/DELETE /api/admin/experience/<id>/   → update/delete
GET/POST   /api/admin/showcases/         → list/create (multipart for image)
PUT/DELETE /api/admin/showcases/<id>/    → update/delete
GET/POST   /api/admin/social-links/      → list/create
PUT/DELETE /api/admin/social-links/<id>/ → update/delete
POST/DELETE /api/admin/resume/           → upload/delete (multipart)
GET        /api/admin/messages/          → list contact messages
PUT        /api/admin/messages/<id>/read/ → mark as read
DELETE     /api/admin/messages/<id>/     → delete message
```

### GitHub Sync Endpoints (JWT required)
```
GET  /api/github/repos/     → list user's repos (uses server-side PAT)
     Query: ?username=<github_username>
     Response: [{ name, full_name, description, html_url, language, stargazers_count, updated_at }]

POST /api/github/sync/      → { repo_full_name, readme_path (optional, default "README.md") }
     Response: { project: <created/updated project object> }
```

---

## Seed Data Content

### Hero
- name: "Alex Chen"
- title: "DevOps Engineer"
- tagline: "Building resilient infrastructure and automating everything in between."
- availability_status: "available"
- location: "San Francisco, CA"
- years_experience: 3

### Professional Summary
"Results-driven DevOps engineer with 3+ years of experience designing, implementing, and maintaining cloud infrastructure and CI/CD pipelines. Specialized in AWS cloud architecture, infrastructure as code with Terraform, and container orchestration with Kubernetes. Passionate about automating operational processes, improving system reliability, and enabling development teams to ship faster with confidence. Proven track record of reducing deployment times by 75% and maintaining 99.9% uptime across production environments."

### Skill Categories & Skills
1. Cloud Platforms: AWS (88), Azure (65), GCP (58)
2. Infrastructure as Code: Terraform (92), Ansible (78), CloudFormation (72)
3. Containers & Orchestration: Docker (90), Kubernetes (82), Helm (72), Podman (55)
4. CI/CD Pipelines: GitHub Actions (88), Jenkins (76), ArgoCD (72), GitLab CI (65)
5. Monitoring & Observability: Prometheus (82), Grafana (88), ELK Stack (68), Datadog (72)
6. Scripting & Automation: Bash (92), Python (86), Go (52), PowerShell (60)
7. Networking & Security: VPC Design (80), IAM Policies (86), SSL/TLS (78), Vault (65)

### Projects
1. title: "Cloud Infrastructure Automation Suite"
   slug: "cloud-infra-automation"
   description: "Production-grade Terraform module library for automated multi-region AWS deployments. Includes VPC networking, EKS clusters, RDS instances, and S3 configurations with comprehensive state management and drift detection."
   tech_stack: ["Terraform", "AWS", "Python", "S3", "DynamoDB"]
   status: "deployed"
   github_url: "https://github.com/alexchen-devops/cloud-infra-automation"

2. title: "Kubernetes Cluster Autoscaler"
   slug: "k8s-autoscaler"
   description: "Custom Kubernetes operator for intelligent horizontal and vertical pod autoscaling based on custom Prometheus metrics. Implements predictive scaling using historical traffic patterns to pre-warm resources before demand spikes."
   tech_stack: ["Kubernetes", "Go", "Prometheus", "Docker", "Helm"]
   status: "deployed"
   github_url: "https://github.com/alexchen-devops/k8s-autoscaler"

3. title: "CI/CD Pipeline Generator"
   slug: "pipeline-generator"
   description: "CLI tool that generates production-ready GitHub Actions workflows for microservice architectures. Supports multi-stage builds, integration testing, security scanning, and blue-green deployments with automatic rollback."
   tech_stack: ["Python", "GitHub Actions", "Docker", "YAML", "Click"]
   status: "deployed"
   github_url: "https://github.com/alexchen-devops/pipeline-generator"

4. title: "Centralized Log Aggregation Platform"
   slug: "log-aggregation-platform"
   description: "Enterprise-scale centralized logging solution using the ELK stack with custom Logstash pipelines, automated index lifecycle management, and pre-built Kibana dashboards for application and infrastructure monitoring."
   tech_stack: ["Elasticsearch", "Logstash", "Kibana", "Docker Compose", "Filebeat"]
   status: "deployed"
   github_url: "https://github.com/alexchen-devops/log-aggregation"

5. title: "GitOps Deployment Controller"
   slug: "gitops-controller"
   description: "ArgoCD-based GitOps deployment controller with custom health checks, progressive delivery support, and Slack integration for deployment notifications. Manages 40+ microservices across staging and production."
   tech_stack: ["ArgoCD", "Kubernetes", "Helm", "Kustomize", "Python"]
   status: "in_progress"
   github_url: "https://github.com/alexchen-devops/gitops-controller"

### Certifications
1. name: "AWS Solutions Architect – Associate", issuer: "Amazon Web Services", credential_id: "AWS-SAA-2024-AC", date_obtained: "2024-03-15", status: "obtained", credential_url: "https://aws.amazon.com/verification"
2. name: "Certified Kubernetes Administrator (CKA)", issuer: "Cloud Native Computing Foundation", credential_id: "CKA-2024-1847", date_obtained: "2024-07-22", status: "obtained", credential_url: "https://training.linuxfoundation.org/certification/verify/"
3. name: "HashiCorp Terraform Associate (003)", issuer: "HashiCorp", credential_id: "HC-TFA-003-AC", date_obtained: "2023-11-08", status: "obtained", credential_url: "https://www.credly.com/verify"
4. name: "AWS DevOps Engineer – Professional", issuer: "Amazon Web Services", credential_id: "", date_obtained: null, status: "in_progress"
5. name: "Certified Kubernetes Security Specialist (CKS)", issuer: "Cloud Native Computing Foundation", credential_id: "", date_obtained: null, status: "in_progress"

### Experience
1. role: "DevOps Engineer", company: "CloudScale Technologies", company_url: "https://cloudscale.example.com", start_date: "2023-06-01", end_date: null, is_current: true,
   description: "Lead DevOps engineer responsible for AWS infrastructure supporting 2M+ daily API requests across 3 production environments.",
   achievements: ["Architected multi-region AWS infrastructure achieving 99.95% uptime SLA", "Reduced deployment cycle time from 4 hours to 45 minutes using GitOps with ArgoCD", "Implemented infrastructure as code with Terraform managing 200+ AWS resources", "Built comprehensive monitoring stack with Prometheus and Grafana covering 50+ microservices", "Designed and implemented disaster recovery procedures reducing RTO from 4 hours to 30 minutes"],
   technologies: ["AWS", "Terraform", "Kubernetes", "ArgoCD", "Prometheus", "Grafana", "GitHub Actions", "Python"]

2. role: "Junior DevOps Engineer", company: "TechStart Inc.", company_url: "https://techstart.example.com", start_date: "2021-08-01", end_date: "2023-05-31", is_current: false,
   description: "DevOps team member focused on CI/CD pipeline development and containerization of legacy applications.",
   achievements: ["Built Docker-based development environments reducing onboarding time from 2 days to 2 hours", "Automated infrastructure provisioning with Terraform for staging and development environments", "Created CI/CD pipelines in Jenkins serving 15 development teams", "Implemented centralized logging with ELK stack processing 500GB+ logs daily", "Mentored 3 junior developers on DevOps best practices and tooling"],
   technologies: ["Docker", "Jenkins", "Terraform", "Ansible", "ELK Stack", "AWS", "Bash", "Linux"]

3. role: "IT Operations Intern", company: "DataFlow Systems", company_url: "https://dataflow.example.com", start_date: "2020-06-01", end_date: "2021-07-31", is_current: false,
   description: "Operations team intern supporting Linux server administration and cloud migration initiatives.",
   achievements: ["Wrote 20+ Bash automation scripts reducing manual maintenance tasks by 60%", "Assisted in migrating 15 on-premise servers to AWS EC2 and RDS", "Documented runbooks for common operational procedures", "Set up basic monitoring with Nagios for 30+ servers"],
   technologies: ["Linux", "Bash", "AWS EC2", "Nagios", "MySQL", "Apache"]

### Showcases
1. title: "Multi-Region AWS High Availability Architecture"
   slug: "multi-region-aws-ha"
   description: "Designed and implemented a highly available, fault-tolerant architecture spanning 3 AWS regions with automated failover, serving 2M+ daily requests with 99.95% uptime."
   technologies: ["AWS", "Terraform", "Route53", "ALB", "RDS Multi-AZ", "ElastiCache", "CloudFront"]
   challenge: "The existing single-region deployment suffered from periodic outages during AWS regional incidents, impacting SLA commitments to enterprise customers. Recovery time was 4+ hours requiring manual intervention."
   solution: "Implemented active-passive multi-region architecture with Route53 health checks for automatic DNS failover. Used RDS cross-region read replicas with promotion automation, ElastiCache Global Datastore for session management, and CloudFront for edge caching. All infrastructure codified in Terraform with automated testing."
   impact: "Achieved 99.95% uptime (up from 99.5%), reduced RTO from 4 hours to under 30 minutes, and eliminated all manual failover procedures. Architecture now serves as the company's reference design for all new services."

2. title: "Kubernetes Microservices Platform"
   slug: "k8s-microservices-platform"
   description: "Production Kubernetes platform hosting 50+ microservices with service mesh, progressive delivery, and full observability stack."
   technologies: ["Kubernetes", "Istio", "Helm", "ArgoCD", "Prometheus", "Grafana", "Jaeger"]
   challenge: "Rapid growth from 5 to 50+ microservices created deployment bottlenecks, inconsistent service communication patterns, and blind spots in observability. Teams were deploying independently with no standardization."
   solution: "Built a standardized Kubernetes platform with Istio service mesh for traffic management and mTLS. Created Helm chart templates for consistent service deployment. Implemented ArgoCD for GitOps-based continuous delivery with canary deployments. Deployed comprehensive observability with Prometheus metrics, Grafana dashboards, and Jaeger distributed tracing."
   impact: "Deployment frequency increased from weekly to multiple times daily per team. Mean time to detection (MTTD) for issues dropped from 30 minutes to under 2 minutes. Zero-downtime deployments became standard with automatic canary rollbacks on error rate spikes."

### Social Links
1. platform: "github", url: "https://github.com/alexchen-devops", icon_class: "github"
2. platform: "linkedin", url: "https://linkedin.com/in/alexchen-devops", icon_class: "linkedin"
3. platform: "twitter", url: "https://twitter.com/alexchen_ops", icon_class: "twitter"
4. platform: "email", url: "mailto:alex.chen.devops@gmail.com", icon_class: "mail"

---

## Next.js Frontend Structure

### Shared Utilities

**lib/api.js** — API client:
```javascript
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  
  // Add auth token if available
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Don't set Content-Type for FormData
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }
  
  const res = await fetch(url, { ...options, headers });
  
  if (res.status === 401 && typeof window !== 'undefined') {
    // Try refresh
    const refresh = localStorage.getItem('refresh_token');
    if (refresh) {
      const refreshRes = await fetch(`${API_BASE}/api/auth/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
      });
      if (refreshRes.ok) {
        const data = await refreshRes.json();
        localStorage.setItem('access_token', data.access);
        headers['Authorization'] = `Bearer ${data.access}`;
        return fetch(url, { ...options, headers });
      } else {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }
  }
  
  return res;
}

export const api = {
  get: (endpoint) => apiFetch(endpoint),
  post: (endpoint, body) => apiFetch(endpoint, { method: 'POST', body: body instanceof FormData ? body : JSON.stringify(body) }),
  put: (endpoint, body) => apiFetch(endpoint, { method: 'PUT', body: body instanceof FormData ? body : JSON.stringify(body) }),
  delete: (endpoint) => apiFetch(endpoint, { method: 'DELETE' }),
};
```

### File Ownership
Files created by "Public Frontend" subagent (Subagent B):
- package.json, next.config.mjs, jsconfig.json, .env.local
- app/layout.js, app/globals.css, app/page.js
- app/projects/[slug]/page.js
- app/showcases/[slug]/page.js
- app/resume/page.js
- components/layout/Sidebar.js, StatusBar.js
- components/sections/* (7 files)
- components/animations/* (6 files)
- components/ui/* (7 files)
- lib/api.js, lib/auth.js, lib/utils.js

Files created by "Admin Frontend" subagent (Subagent C):
- app/login/page.js
- app/signup/page.js
- app/admin-portal/layout.js
- app/admin-portal/page.js
- app/admin-portal/hero/page.js
- app/admin-portal/summary/page.js
- app/admin-portal/skills/page.js
- app/admin-portal/projects/page.js
- app/admin-portal/certifications/page.js
- app/admin-portal/experience/page.js
- app/admin-portal/showcases/page.js
- app/admin-portal/social/page.js
- app/admin-portal/resume/page.js
- app/admin-portal/messages/page.js
- app/admin-portal/github-sync/page.js
- components/admin/DataTable.js
- components/admin/FormField.js
- components/admin/DeleteConfirm.js
- components/admin/AdminCard.js
- components/layout/AdminSidebar.js
