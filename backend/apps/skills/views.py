from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import SkillCategory, Skill
from .serializers import SkillCategorySerializer, SkillSerializer


# Public
class SkillCategoryListView(generics.ListAPIView):
    queryset = SkillCategory.objects.prefetch_related('skills').all()
    serializer_class = SkillCategorySerializer
    permission_classes = [AllowAny]


class SkillListView(generics.ListAPIView):
    queryset = Skill.objects.select_related('category').all()
    serializer_class = SkillSerializer
    permission_classes = [AllowAny]


# Admin
class AdminSkillCategoryListCreateView(generics.ListCreateAPIView):
    queryset = SkillCategory.objects.all()
    serializer_class = SkillCategorySerializer
    permission_classes = [IsAuthenticated]


class AdminSkillCategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = SkillCategory.objects.all()
    serializer_class = SkillCategorySerializer
    permission_classes = [IsAuthenticated]


class AdminSkillListCreateView(generics.ListCreateAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [IsAuthenticated]


class AdminSkillDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [IsAuthenticated]
