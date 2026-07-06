from django.db import models


class Certification(models.Model):
    STATUS_CHOICES = [
        ('obtained', 'Obtained'),
        ('in_progress', 'In Progress'),
        ('expired', 'Expired'),
    ]

    name = models.CharField(max_length=200)
    issuer = models.CharField(max_length=200)
    credential_id = models.CharField(max_length=200, blank=True)
    credential_url = models.URLField(blank=True)
    badge_image = models.ImageField(upload_to='certifications/', blank=True)
    date_obtained = models.DateField(null=True, blank=True)
    expiry_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='in_progress')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f'{self.name} ({self.issuer})'
