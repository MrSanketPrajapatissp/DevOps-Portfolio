from django.urls import path
from . import views

urlpatterns = [
    # Public
    path('projects/', views.ProjectListView.as_view(), name='projects'),
    path('projects/<slug:slug>/', views.ProjectDetailView.as_view(), name='project-detail'),
    # Admin
    path('admin/projects/', views.AdminProjectListCreateView.as_view(), name='admin-projects'),
    path('admin/projects/<int:pk>/', views.AdminProjectDetailView.as_view(), name='admin-project-detail'),
    path('admin/projects/<int:pk>/resync/', views.AdminProjectResyncView.as_view(), name='admin-project-resync'),
    # GitHub
    path('github/repos/', views.GitHubRepoListView.as_view(), name='github-repos'),
    path('github/sync/', views.GitHubSyncView.as_view(), name='github-sync'),
]
