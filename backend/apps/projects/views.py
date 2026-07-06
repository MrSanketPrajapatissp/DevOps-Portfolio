from django.utils import timezone
from django.utils.text import slugify
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Project
from .serializers import ProjectSerializer, ProjectListSerializer
from .github_sync import list_github_repos, sync_repo_readme


# Public
class ProjectListView(generics.ListAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectListSerializer
    permission_classes = [AllowAny]


class ProjectDetailView(generics.RetrieveAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'


# Admin
class AdminProjectListCreateView(generics.ListCreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]


class AdminProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]


class AdminProjectResyncView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            project = Project.objects.get(pk=pk)
        except Project.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

        if not project.github_repo_name:
            return Response({'detail': 'No linked GitHub repo.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            data = sync_repo_readme(project.github_repo_name)
            project.description = data['description'] or project.description
            project.tech_stack = data['tech_stack'] or project.tech_stack
            project.readme_content = data['readme_content']
            project.last_synced = timezone.now()
            project.save()
            return Response(ProjectSerializer(project).data)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_502_BAD_GATEWAY)


# GitHub
class GitHubRepoListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        username = request.query_params.get('username', '')
        if not username:
            return Response({'detail': 'username query param required.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            repos = list_github_repos(username)
            return Response(repos)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_502_BAD_GATEWAY)


class GitHubSyncView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        repo_full_name = request.data.get('repo_full_name', '')
        readme_path = request.data.get('readme_path', 'README.md')
        if not repo_full_name:
            return Response({'detail': 'repo_full_name required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            data = sync_repo_readme(repo_full_name, readme_path)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_502_BAD_GATEWAY)

        slug = slugify(data['title'])
        project, created = Project.objects.update_or_create(
            github_repo_name=repo_full_name,
            defaults={
                'title': data['title'],
                'slug': slug if not Project.objects.filter(slug=slug).exclude(github_repo_name=repo_full_name).exists() else slugify(repo_full_name.replace('/', '-')),
                'description': data['description'],
                'tech_stack': data['tech_stack'],
                'readme_content': data['readme_content'],
                'github_url': data['github_url'],
                'is_github_synced': True,
                'last_synced': timezone.now(),
            },
        )
        return Response(
            {'project': ProjectSerializer(project).data, 'created': created},
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )
