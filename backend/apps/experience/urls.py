from django.urls import path
from . import views

urlpatterns = [
    path('experience/', views.ExperienceListView.as_view(), name='experience'),
    path('admin/experience/', views.AdminExperienceListCreateView.as_view(), name='admin-experience'),
    path('admin/experience/<int:pk>/', views.AdminExperienceDetailView.as_view(), name='admin-experience-detail'),
]
