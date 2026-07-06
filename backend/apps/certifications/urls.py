from django.urls import path
from . import views

urlpatterns = [
    path('certifications/', views.CertificationListView.as_view(), name='certifications'),
    path('admin/certifications/', views.AdminCertificationListCreateView.as_view(), name='admin-certifications'),
    path('admin/certifications/<int:pk>/', views.AdminCertificationDetailView.as_view(), name='admin-certification-detail'),
]
