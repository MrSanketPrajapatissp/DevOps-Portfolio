from rest_framework import serializers
from .models import Showcase


class ShowcaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Showcase
        fields = '__all__'
