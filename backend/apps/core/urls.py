from django.urls import path

from . import views

urlpatterns = [
    # Public
    path('hero/', views.HeroView.as_view(), name='hero'),
    path('summary/', views.SummaryView.as_view(), name='summary'),
    path('social-links/', views.SocialLinkListView.as_view(), name='social-links'),
    path('resume/', views.ResumeView.as_view(), name='resume'),
    # Admin
    path('admin/hero/', views.AdminHeroView.as_view(), name='admin-hero'),
    path('admin/summary/', views.AdminSummaryView.as_view(), name='admin-summary'),
    path('admin/social-links/', views.AdminSocialLinkListCreateView.as_view(), name='admin-social-links'),
    path('admin/social-links/<int:pk>/', views.AdminSocialLinkDetailView.as_view(), name='admin-social-link-detail'),
    path('admin/resume/', views.AdminResumeView.as_view(), name='admin-resume'),
    path('admin/messages/', views.AdminMessageListView.as_view(), name='admin-messages'),
    path('admin/messages/<int:pk>/read/', views.AdminMessageMarkReadView.as_view(), name='admin-message-read'),
    path('admin/messages/<int:pk>/', views.AdminMessageDeleteView.as_view(), name='admin-message-delete'),
]
