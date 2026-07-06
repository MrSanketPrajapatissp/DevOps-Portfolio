from django.db import models
from django.utils.text import slugify


class Showcase(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    diagram_image = models.ImageField(upload_to='showcases/', blank=True)
    technologies = models.JSONField(default=list)
    challenge = models.TextField(blank=True)
    solution = models.TextField(blank=True)
    impact = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
