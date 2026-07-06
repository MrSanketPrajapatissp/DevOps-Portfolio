"""portfolio URL Configuration."""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView

from apps.core.views import LoginView, RegisterView

urlpatterns = [
    path('admin/', admin.site.urls),

    # App URLs
    path('api/', include('apps.core.urls')),
    path('api/', include('apps.skills.urls')),
    path('api/', include('apps.projects.urls')),
    path('api/', include('apps.certifications.urls')),
    path('api/', include('apps.experience.urls')),
    path('api/', include('apps.showcases.urls')),
    path('api/', include('apps.contact.urls')),

    # Auth
    path('api/auth/login/', LoginView.as_view(), name='auth-login'),
    path('api/auth/register/', RegisterView.as_view(), name='auth-register'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
