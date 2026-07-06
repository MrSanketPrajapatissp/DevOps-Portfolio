from django.urls import path
from . import views

urlpatterns = [
    path('showcases/', views.ShowcaseListView.as_view(), name='showcases'),
    path('showcases/<slug:slug>/', views.ShowcaseDetailView.as_view(), name='showcase-detail'),
    path('admin/showcases/', views.AdminShowcaseListCreateView.as_view(), name='admin-showcases'),
    path('admin/showcases/<int:pk>/', views.AdminShowcaseDetailView.as_view(), name='admin-showcase-detail'),
]
