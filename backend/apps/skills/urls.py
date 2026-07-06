from django.urls import path
from . import views

urlpatterns = [
    # Public
    path('skill-categories/', views.SkillCategoryListView.as_view(), name='skill-categories'),
    path('skills/', views.SkillListView.as_view(), name='skills'),
    # Admin
    path('admin/skill-categories/', views.AdminSkillCategoryListCreateView.as_view(), name='admin-skill-categories'),
    path('admin/skill-categories/<int:pk>/', views.AdminSkillCategoryDetailView.as_view(), name='admin-skill-category-detail'),
    path('admin/skills/', views.AdminSkillListCreateView.as_view(), name='admin-skills'),
    path('admin/skills/<int:pk>/', views.AdminSkillDetailView.as_view(), name='admin-skill-detail'),
]
