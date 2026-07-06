from django.contrib.auth import authenticate
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import HeroIdentity, ProfessionalSummary, SocialLink, Resume
from .serializers import (
    HeroIdentitySerializer,
    ProfessionalSummarySerializer,
    SocialLinkSerializer,
    ResumeSerializer,
    LoginSerializer,
    RegisterSerializer,
    UserSerializer,
)
from apps.contact.models import ContactMessage
from apps.contact.serializers import ContactMessageSerializer


# ---------------------------------------------------------------------------
# Public views
# ---------------------------------------------------------------------------

class HeroView(generics.RetrieveAPIView):
    """Return the single HeroIdentity instance."""
    serializer_class = HeroIdentitySerializer
    permission_classes = [AllowAny]

    def get_object(self):
        return HeroIdentity.objects.first()


class SummaryView(generics.RetrieveAPIView):
    """Return the single ProfessionalSummary instance."""
    serializer_class = ProfessionalSummarySerializer
    permission_classes = [AllowAny]

    def get_object(self):
        return ProfessionalSummary.objects.first()


class SocialLinkListView(generics.ListAPIView):
    """List all social links."""
    queryset = SocialLink.objects.all()
    serializer_class = SocialLinkSerializer
    permission_classes = [AllowAny]


class ResumeView(generics.RetrieveAPIView):
    """Return the active resume."""
    serializer_class = ResumeSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        return Resume.objects.filter(is_active=True).first()


# ---------------------------------------------------------------------------
# Auth views
# ---------------------------------------------------------------------------

class LoginView(APIView):
    """Authenticate user and return JWT tokens with user data."""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = authenticate(
            username=serializer.validated_data['username'],
            password=serializer.validated_data['password'],
        )
        if not user:
            return Response(
                {'detail': 'Invalid credentials.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data,
        })


class RegisterView(APIView):
    """Register a new user and return JWT tokens with user data."""
    permission_classes = [AllowAny]

    def post(self, request):
        from django.contrib.auth import get_user_model
        User = get_user_model()
        if User.objects.exists():
            return Response(
                {'detail': 'Registration is closed. An operator is already configured.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)
        return Response(
            {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': UserSerializer(user).data,
            },
            status=status.HTTP_201_CREATED,
        )


# ---------------------------------------------------------------------------
# Admin views
# ---------------------------------------------------------------------------

class AdminHeroView(generics.RetrieveUpdateAPIView):
    """GET / PUT the single HeroIdentity instance (admin)."""
    serializer_class = HeroIdentitySerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        obj, _ = HeroIdentity.objects.get_or_create(
            defaults={
                'name': '',
                'title': '',
                'tagline': '',
            }
        )
        return obj


class AdminSummaryView(generics.RetrieveUpdateAPIView):
    """GET / PUT the single ProfessionalSummary instance (admin)."""
    serializer_class = ProfessionalSummarySerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        obj, _ = ProfessionalSummary.objects.get_or_create(
            defaults={'content': ''}
        )
        return obj


class AdminSocialLinkListCreateView(generics.ListCreateAPIView):
    """List / create social links (admin)."""
    queryset = SocialLink.objects.all()
    serializer_class = SocialLinkSerializer
    permission_classes = [IsAuthenticated]


class AdminSocialLinkDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve / update / delete a social link (admin)."""
    queryset = SocialLink.objects.all()
    serializer_class = SocialLinkSerializer
    permission_classes = [IsAuthenticated]


class AdminResumeView(APIView):
    """Upload or delete the active resume (admin)."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Deactivate all existing resumes
        Resume.objects.update(is_active=False)
        # Create a new active resume
        serializer = ResumeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(is_active=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def delete(self, request):
        Resume.objects.filter(is_active=True).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AdminMessageListView(generics.ListAPIView):
    """List all contact messages (admin)."""
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [IsAuthenticated]


class AdminMessageMarkReadView(generics.UpdateAPIView):
    """Mark a contact message as read (admin)."""
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        message = self.get_object()
        message.is_read = True
        message.save()
        return Response(ContactMessageSerializer(message).data)


class AdminMessageDeleteView(generics.DestroyAPIView):
    """Delete a contact message (admin)."""
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [IsAuthenticated]
