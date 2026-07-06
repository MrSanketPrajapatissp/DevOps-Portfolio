from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Showcase
from .serializers import ShowcaseSerializer


class ShowcaseListView(generics.ListAPIView):
    queryset = Showcase.objects.all()
    serializer_class = ShowcaseSerializer
    permission_classes = [AllowAny]


class ShowcaseDetailView(generics.RetrieveAPIView):
    queryset = Showcase.objects.all()
    serializer_class = ShowcaseSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'


class AdminShowcaseListCreateView(generics.ListCreateAPIView):
    queryset = Showcase.objects.all()
    serializer_class = ShowcaseSerializer
    permission_classes = [IsAuthenticated]


class AdminShowcaseDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Showcase.objects.all()
    serializer_class = ShowcaseSerializer
    permission_classes = [IsAuthenticated]
