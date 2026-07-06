from django.contrib import admin
from .models import Certification


@admin.register(Certification)
class CertificationAdmin(admin.ModelAdmin):
    list_display = ['name', 'issuer', 'status', 'date_obtained', 'order']
    list_filter = ['status', 'issuer']
    search_fields = ['name', 'issuer']
