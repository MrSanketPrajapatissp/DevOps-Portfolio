from rest_framework import serializers
from .models import Project
import markdown


class ProjectSerializer(serializers.ModelSerializer):
    readme_html = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'slug', 'description', 'tech_stack',
            'github_url', 'live_url', 'readme_content', 'readme_html', 'image',
            'is_github_synced', 'github_repo_name', 'last_synced',
            'status', 'order', 'created_at', 'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at', 'readme_html']

    def get_readme_html(self, obj):
        if obj.readme_content:
            return markdown.markdown(obj.readme_content, extensions=['fenced_code', 'tables'])
        return ""


class ProjectListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = [
            'id', 'title', 'slug', 'description', 'tech_stack',
            'github_url', 'live_url', 'image', 'status',
            'is_github_synced', 'created_at',
        ]
