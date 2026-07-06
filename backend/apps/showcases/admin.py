from django.contrib import admin
from .models import Showcase


@admin.register(Showcase)
class ShowcaseAdmin(admin.ModelAdmin):
    list_display = ['title', 'order', 'created_at']
    search_fields = ['title']
    prepopulated_fields = {'slug': ('title',)}
