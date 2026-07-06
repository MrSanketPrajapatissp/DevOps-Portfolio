from django.contrib import admin

from .models import HeroIdentity, ProfessionalSummary, SocialLink, Resume


@admin.register(HeroIdentity)
class HeroIdentityAdmin(admin.ModelAdmin):
    list_display = ['name', 'title', 'availability_status', 'location']


@admin.register(ProfessionalSummary)
class ProfessionalSummaryAdmin(admin.ModelAdmin):
    list_display = ['__str__', 'updated_at']


@admin.register(SocialLink)
class SocialLinkAdmin(admin.ModelAdmin):
    list_display = ['platform', 'url', 'order']
    list_editable = ['order']


@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ['file', 'uploaded_at', 'is_active']
    list_filter = ['is_active']
