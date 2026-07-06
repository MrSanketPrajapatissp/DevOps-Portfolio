"""
Management command to seed the database with initial portfolio data.

Run with: python manage.py seed_data
"""
from datetime import date

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand

from apps.core.models import HeroIdentity, ProfessionalSummary, SocialLink
from apps.skills.models import SkillCategory, Skill
from apps.projects.models import Project
from apps.certifications.models import Certification
from apps.experience.models import Experience
from apps.showcases.models import Showcase


class Command(BaseCommand):
    help = 'Seed the database with initial portfolio data from ARCHITECTURE.md'

    def handle(self, *args, **options):
        self.stdout.write(self.style.MIGRATE_HEADING('Seeding database...'))

        self._create_superuser()
        self._create_hero()
        self._create_summary()
        self._create_social_links()
        self._create_skills()
        self._create_projects()
        self._create_certifications()
        self._create_experience()
        self._create_showcases()

        self.stdout.write(self.style.SUCCESS('\n✅ Database seeding complete!'))

    # -----------------------------------------------------------------
    def _create_superuser(self):
        self.stdout.write('  Creating superuser...')
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser(
                username='admin',
                email='admin@controlplane.dev',
                password='admin123',
            )
            self.stdout.write(self.style.SUCCESS('    ✓ Superuser "admin" created'))
        else:
            self.stdout.write('    - Superuser "admin" already exists')

    # -----------------------------------------------------------------
    def _create_hero(self):
        self.stdout.write('  Creating hero identity...')
        hero, created = HeroIdentity.objects.get_or_create(
            defaults={
                'name': 'Alex Chen',
                'title': 'DevOps Engineer',
                'tagline': 'Building resilient infrastructure and automating everything in between.',
                'availability_status': 'available',
                'location': 'San Francisco, CA',
                'years_experience': 3,
            }
        )
        status = '✓ Created' if created else '- Already exists'
        self.stdout.write(self.style.SUCCESS(f'    {status}'))

    # -----------------------------------------------------------------
    def _create_summary(self):
        self.stdout.write('  Creating professional summary...')
        summary, created = ProfessionalSummary.objects.get_or_create(
            defaults={
                'content': (
                    'Results-driven DevOps engineer with 3+ years of experience '
                    'designing, implementing, and maintaining cloud infrastructure '
                    'and CI/CD pipelines. Specialized in AWS cloud architecture, '
                    'infrastructure as code with Terraform, and container '
                    'orchestration with Kubernetes. Passionate about automating '
                    'operational processes, improving system reliability, and '
                    'enabling development teams to ship faster with confidence. '
                    'Proven track record of reducing deployment times by 75% and '
                    'maintaining 99.9% uptime across production environments.'
                ),
            }
        )
        status = '✓ Created' if created else '- Already exists'
        self.stdout.write(self.style.SUCCESS(f'    {status}'))

    # -----------------------------------------------------------------
    def _create_social_links(self):
        self.stdout.write('  Creating social links...')
        links = [
            {'platform': 'github', 'url': 'https://github.com/alexchen-devops', 'icon_class': 'github', 'order': 1},
            {'platform': 'linkedin', 'url': 'https://linkedin.com/in/alexchen-devops', 'icon_class': 'linkedin', 'order': 2},
            {'platform': 'twitter', 'url': 'https://twitter.com/alexchen_ops', 'icon_class': 'twitter', 'order': 3},
            {'platform': 'email', 'url': 'mailto:alex.chen.devops@gmail.com', 'icon_class': 'mail', 'order': 4},
        ]
        for link_data in links:
            _, created = SocialLink.objects.get_or_create(
                platform=link_data['platform'],
                defaults=link_data,
            )
            mark = '✓' if created else '-'
            self.stdout.write(f'    {mark} {link_data["platform"]}')

    # -----------------------------------------------------------------
    def _create_skills(self):
        self.stdout.write('  Creating skill categories & skills...')
        categories = [
            {
                'name': 'Cloud Platforms',
                'icon': 'cloud',
                'order': 1,
                'skills': [
                    {'name': 'AWS', 'proficiency': 88, 'order': 1},
                    {'name': 'Azure', 'proficiency': 65, 'order': 2},
                    {'name': 'GCP', 'proficiency': 58, 'order': 3},
                ],
            },
            {
                'name': 'Infrastructure as Code',
                'icon': 'code',
                'order': 2,
                'skills': [
                    {'name': 'Terraform', 'proficiency': 92, 'order': 1},
                    {'name': 'Ansible', 'proficiency': 78, 'order': 2},
                    {'name': 'CloudFormation', 'proficiency': 72, 'order': 3},
                ],
            },
            {
                'name': 'Containers & Orchestration',
                'icon': 'box',
                'order': 3,
                'skills': [
                    {'name': 'Docker', 'proficiency': 90, 'order': 1},
                    {'name': 'Kubernetes', 'proficiency': 82, 'order': 2},
                    {'name': 'Helm', 'proficiency': 72, 'order': 3},
                    {'name': 'Podman', 'proficiency': 55, 'order': 4},
                ],
            },
            {
                'name': 'CI/CD Pipelines',
                'icon': 'git-branch',
                'order': 4,
                'skills': [
                    {'name': 'GitHub Actions', 'proficiency': 88, 'order': 1},
                    {'name': 'Jenkins', 'proficiency': 76, 'order': 2},
                    {'name': 'ArgoCD', 'proficiency': 72, 'order': 3},
                    {'name': 'GitLab CI', 'proficiency': 65, 'order': 4},
                ],
            },
            {
                'name': 'Monitoring & Observability',
                'icon': 'activity',
                'order': 5,
                'skills': [
                    {'name': 'Prometheus', 'proficiency': 82, 'order': 1},
                    {'name': 'Grafana', 'proficiency': 88, 'order': 2},
                    {'name': 'ELK Stack', 'proficiency': 68, 'order': 3},
                    {'name': 'Datadog', 'proficiency': 72, 'order': 4},
                ],
            },
            {
                'name': 'Scripting & Automation',
                'icon': 'terminal',
                'order': 6,
                'skills': [
                    {'name': 'Bash', 'proficiency': 92, 'order': 1},
                    {'name': 'Python', 'proficiency': 86, 'order': 2},
                    {'name': 'Go', 'proficiency': 52, 'order': 3},
                    {'name': 'PowerShell', 'proficiency': 60, 'order': 4},
                ],
            },
            {
                'name': 'Networking & Security',
                'icon': 'shield',
                'order': 7,
                'skills': [
                    {'name': 'VPC Design', 'proficiency': 80, 'order': 1},
                    {'name': 'IAM Policies', 'proficiency': 86, 'order': 2},
                    {'name': 'SSL/TLS', 'proficiency': 78, 'order': 3},
                    {'name': 'Vault', 'proficiency': 65, 'order': 4},
                ],
            },
        ]
        for cat_data in categories:
            skills_data = cat_data.pop('skills')
            category, created = SkillCategory.objects.get_or_create(
                name=cat_data['name'],
                defaults=cat_data,
            )
            mark = '✓' if created else '-'
            self.stdout.write(f'    {mark} Category: {category.name}')
            for skill_data in skills_data:
                skill, s_created = Skill.objects.get_or_create(
                    category=category,
                    name=skill_data['name'],
                    defaults=skill_data,
                )
                s_mark = '✓' if s_created else '-'
                self.stdout.write(f'      {s_mark} {skill.name} ({skill.proficiency}%)')

    # -----------------------------------------------------------------
    def _create_projects(self):
        self.stdout.write('  Creating projects...')
        projects = [
            {
                'title': 'Cloud Infrastructure Automation Suite',
                'slug': 'cloud-infra-automation',
                'description': (
                    'Production-grade Terraform module library for automated multi-region '
                    'AWS deployments. Includes VPC networking, EKS clusters, RDS instances, '
                    'and S3 configurations with comprehensive state management and drift detection.'
                ),
                'tech_stack': ['Terraform', 'AWS', 'Python', 'S3', 'DynamoDB'],
                'status': 'deployed',
                'github_url': 'https://github.com/alexchen-devops/cloud-infra-automation',
                'order': 1,
            },
            {
                'title': 'Kubernetes Cluster Autoscaler',
                'slug': 'k8s-autoscaler',
                'description': (
                    'Custom Kubernetes operator for intelligent horizontal and vertical pod '
                    'autoscaling based on custom Prometheus metrics. Implements predictive '
                    'scaling using historical traffic patterns to pre-warm resources before '
                    'demand spikes.'
                ),
                'tech_stack': ['Kubernetes', 'Go', 'Prometheus', 'Docker', 'Helm'],
                'status': 'deployed',
                'github_url': 'https://github.com/alexchen-devops/k8s-autoscaler',
                'order': 2,
            },
            {
                'title': 'CI/CD Pipeline Generator',
                'slug': 'pipeline-generator',
                'description': (
                    'CLI tool that generates production-ready GitHub Actions workflows for '
                    'microservice architectures. Supports multi-stage builds, integration '
                    'testing, security scanning, and blue-green deployments with automatic rollback.'
                ),
                'tech_stack': ['Python', 'GitHub Actions', 'Docker', 'YAML', 'Click'],
                'status': 'deployed',
                'github_url': 'https://github.com/alexchen-devops/pipeline-generator',
                'order': 3,
            },
            {
                'title': 'Centralized Log Aggregation Platform',
                'slug': 'log-aggregation-platform',
                'description': (
                    'Enterprise-scale centralized logging solution using the ELK stack with '
                    'custom Logstash pipelines, automated index lifecycle management, and '
                    'pre-built Kibana dashboards for application and infrastructure monitoring.'
                ),
                'tech_stack': ['Elasticsearch', 'Logstash', 'Kibana', 'Docker Compose', 'Filebeat'],
                'status': 'deployed',
                'github_url': 'https://github.com/alexchen-devops/log-aggregation',
                'order': 4,
            },
            {
                'title': 'GitOps Deployment Controller',
                'slug': 'gitops-controller',
                'description': (
                    'ArgoCD-based GitOps deployment controller with custom health checks, '
                    'progressive delivery support, and Slack integration for deployment '
                    'notifications. Manages 40+ microservices across staging and production.'
                ),
                'tech_stack': ['ArgoCD', 'Kubernetes', 'Helm', 'Kustomize', 'Python'],
                'status': 'in_progress',
                'github_url': 'https://github.com/alexchen-devops/gitops-controller',
                'order': 5,
            },
        ]
        for proj_data in projects:
            project, created = Project.objects.get_or_create(
                slug=proj_data['slug'],
                defaults=proj_data,
            )
            mark = '✓' if created else '-'
            self.stdout.write(f'    {mark} {project.title}')

    # -----------------------------------------------------------------
    def _create_certifications(self):
        self.stdout.write('  Creating certifications...')
        certs = [
            {
                'name': 'AWS Solutions Architect – Associate',
                'issuer': 'Amazon Web Services',
                'credential_id': 'AWS-SAA-2024-AC',
                'date_obtained': date(2024, 3, 15),
                'status': 'obtained',
                'credential_url': 'https://aws.amazon.com/verification',
                'order': 1,
            },
            {
                'name': 'Certified Kubernetes Administrator (CKA)',
                'issuer': 'Cloud Native Computing Foundation',
                'credential_id': 'CKA-2024-1847',
                'date_obtained': date(2024, 7, 22),
                'status': 'obtained',
                'credential_url': 'https://training.linuxfoundation.org/certification/verify/',
                'order': 2,
            },
            {
                'name': 'HashiCorp Terraform Associate (003)',
                'issuer': 'HashiCorp',
                'credential_id': 'HC-TFA-003-AC',
                'date_obtained': date(2023, 11, 8),
                'status': 'obtained',
                'credential_url': 'https://www.credly.com/verify',
                'order': 3,
            },
            {
                'name': 'AWS DevOps Engineer – Professional',
                'issuer': 'Amazon Web Services',
                'credential_id': '',
                'date_obtained': None,
                'status': 'in_progress',
                'order': 4,
            },
            {
                'name': 'Certified Kubernetes Security Specialist (CKS)',
                'issuer': 'Cloud Native Computing Foundation',
                'credential_id': '',
                'date_obtained': None,
                'status': 'in_progress',
                'order': 5,
            },
        ]
        for cert_data in certs:
            cert, created = Certification.objects.get_or_create(
                name=cert_data['name'],
                defaults=cert_data,
            )
            mark = '✓' if created else '-'
            self.stdout.write(f'    {mark} {cert.name}')

    # -----------------------------------------------------------------
    def _create_experience(self):
        self.stdout.write('  Creating experience entries...')
        experiences = [
            {
                'role': 'DevOps Engineer',
                'company': 'CloudScale Technologies',
                'company_url': 'https://cloudscale.example.com',
                'start_date': date(2023, 6, 1),
                'end_date': None,
                'is_current': True,
                'description': (
                    'Lead DevOps engineer responsible for AWS infrastructure supporting '
                    '2M+ daily API requests across 3 production environments.'
                ),
                'achievements': [
                    'Architected multi-region AWS infrastructure achieving 99.95% uptime SLA',
                    'Reduced deployment cycle time from 4 hours to 45 minutes using GitOps with ArgoCD',
                    'Implemented infrastructure as code with Terraform managing 200+ AWS resources',
                    'Built comprehensive monitoring stack with Prometheus and Grafana covering 50+ microservices',
                    'Designed and implemented disaster recovery procedures reducing RTO from 4 hours to 30 minutes',
                ],
                'technologies': [
                    'AWS', 'Terraform', 'Kubernetes', 'ArgoCD',
                    'Prometheus', 'Grafana', 'GitHub Actions', 'Python',
                ],
                'order': 1,
            },
            {
                'role': 'Junior DevOps Engineer',
                'company': 'TechStart Inc.',
                'company_url': 'https://techstart.example.com',
                'start_date': date(2021, 8, 1),
                'end_date': date(2023, 5, 31),
                'is_current': False,
                'description': (
                    'DevOps team member focused on CI/CD pipeline development and '
                    'containerization of legacy applications.'
                ),
                'achievements': [
                    'Built Docker-based development environments reducing onboarding time from 2 days to 2 hours',
                    'Automated infrastructure provisioning with Terraform for staging and development environments',
                    'Created CI/CD pipelines in Jenkins serving 15 development teams',
                    'Implemented centralized logging with ELK stack processing 500GB+ logs daily',
                    'Mentored 3 junior developers on DevOps best practices and tooling',
                ],
                'technologies': [
                    'Docker', 'Jenkins', 'Terraform', 'Ansible',
                    'ELK Stack', 'AWS', 'Bash', 'Linux',
                ],
                'order': 2,
            },
            {
                'role': 'IT Operations Intern',
                'company': 'DataFlow Systems',
                'company_url': 'https://dataflow.example.com',
                'start_date': date(2020, 6, 1),
                'end_date': date(2021, 7, 31),
                'is_current': False,
                'description': (
                    'Operations team intern supporting Linux server administration '
                    'and cloud migration initiatives.'
                ),
                'achievements': [
                    'Wrote 20+ Bash automation scripts reducing manual maintenance tasks by 60%',
                    'Assisted in migrating 15 on-premise servers to AWS EC2 and RDS',
                    'Documented runbooks for common operational procedures',
                    'Set up basic monitoring with Nagios for 30+ servers',
                ],
                'technologies': [
                    'Linux', 'Bash', 'AWS EC2', 'Nagios', 'MySQL', 'Apache',
                ],
                'order': 3,
            },
        ]
        for exp_data in experiences:
            exp, created = Experience.objects.get_or_create(
                role=exp_data['role'],
                company=exp_data['company'],
                defaults=exp_data,
            )
            mark = '✓' if created else '-'
            self.stdout.write(f'    {mark} {exp.role} at {exp.company}')

    # -----------------------------------------------------------------
    def _create_showcases(self):
        self.stdout.write('  Creating showcases...')
        showcases = [
            {
                'title': 'Multi-Region AWS High Availability Architecture',
                'slug': 'multi-region-aws-ha',
                'description': (
                    'Designed and implemented a highly available, fault-tolerant architecture '
                    'spanning 3 AWS regions with automated failover, serving 2M+ daily requests '
                    'with 99.95% uptime.'
                ),
                'technologies': [
                    'AWS', 'Terraform', 'Route53', 'ALB',
                    'RDS Multi-AZ', 'ElastiCache', 'CloudFront',
                ],
                'challenge': (
                    'The existing single-region deployment suffered from periodic outages '
                    'during AWS regional incidents, impacting SLA commitments to enterprise '
                    'customers. Recovery time was 4+ hours requiring manual intervention.'
                ),
                'solution': (
                    'Implemented active-passive multi-region architecture with Route53 health '
                    'checks for automatic DNS failover. Used RDS cross-region read replicas with '
                    'promotion automation, ElastiCache Global Datastore for session management, '
                    'and CloudFront for edge caching. All infrastructure codified in Terraform '
                    'with automated testing.'
                ),
                'impact': (
                    'Achieved 99.95% uptime (up from 99.5%), reduced RTO from 4 hours to under '
                    '30 minutes, and eliminated all manual failover procedures. Architecture now '
                    "serves as the company's reference design for all new services."
                ),
                'order': 1,
            },
            {
                'title': 'Kubernetes Microservices Platform',
                'slug': 'k8s-microservices-platform',
                'description': (
                    'Production Kubernetes platform hosting 50+ microservices with service mesh, '
                    'progressive delivery, and full observability stack.'
                ),
                'technologies': [
                    'Kubernetes', 'Istio', 'Helm', 'ArgoCD',
                    'Prometheus', 'Grafana', 'Jaeger',
                ],
                'challenge': (
                    'Rapid growth from 5 to 50+ microservices created deployment bottlenecks, '
                    'inconsistent service communication patterns, and blind spots in observability. '
                    'Teams were deploying independently with no standardization.'
                ),
                'solution': (
                    'Built a standardized Kubernetes platform with Istio service mesh for traffic '
                    'management and mTLS. Created Helm chart templates for consistent service '
                    'deployment. Implemented ArgoCD for GitOps-based continuous delivery with '
                    'canary deployments. Deployed comprehensive observability with Prometheus '
                    'metrics, Grafana dashboards, and Jaeger distributed tracing.'
                ),
                'impact': (
                    'Deployment frequency increased from weekly to multiple times daily per team. '
                    'Mean time to detection (MTTD) for issues dropped from 30 minutes to under '
                    '2 minutes. Zero-downtime deployments became standard with automatic canary '
                    'rollbacks on error rate spikes.'
                ),
                'order': 2,
            },
        ]
        for showcase_data in showcases:
            showcase, created = Showcase.objects.get_or_create(
                slug=showcase_data['slug'],
                defaults=showcase_data,
            )
            mark = '✓' if created else '-'
            self.stdout.write(f'    {mark} {showcase.title}')
