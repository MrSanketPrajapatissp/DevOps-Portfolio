from django.db import models
from django.core.exceptions import ValidationError


class HeroIdentity(models.Model):
    """Singleton model for the hero section identity information."""

    name = models.CharField(max_length=100)
    title = models.CharField(max_length=200)
    tagline = models.CharField(max_length=500)
    availability_status = models.CharField(
        max_length=20,
        choices=[
            ('available', 'Available'),
            ('open', 'Open to Offers'),
            ('unavailable', 'Unavailable'),
        ],
        default='available',
    )
    avatar = models.ImageField(upload_to='avatars/', blank=True)
    location = models.CharField(max_length=100, blank=True)
    years_experience = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = 'Hero Identity'
        verbose_name_plural = 'Hero Identity'

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        # Enforce singleton: only one row allowed
        if not self.pk and HeroIdentity.objects.exists():
            raise ValidationError(
                'Only one HeroIdentity instance is allowed. '
                'Edit the existing one instead.'
            )
        super().save(*args, **kwargs)


class ProfessionalSummary(models.Model):
    """Singleton model for the professional summary section."""

    content = models.TextField()
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Professional Summary'
        verbose_name_plural = 'Professional Summary'

    def __str__(self):
        return 'Professional Summary'

    def save(self, *args, **kwargs):
        # Enforce singleton: only one row allowed
        if not self.pk and ProfessionalSummary.objects.exists():
            raise ValidationError(
                'Only one ProfessionalSummary instance is allowed. '
                'Edit the existing one instead.'
            )
        super().save(*args, **kwargs)


class SocialLink(models.Model):
    """Social media and contact links."""

    platform = models.CharField(max_length=50)
    url = models.URLField()
    icon_class = models.CharField(max_length=50, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.platform


class Resume(models.Model):
    """Uploaded resume files."""

    file = models.FileField(upload_to='resumes/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-uploaded_at']

    def __str__(self):
        return f'Resume (uploaded {self.uploaded_at:%Y-%m-%d})'
