# models.py
from email.mime import image
from django.db import models
from django.conf import settings
from django.utils import timezone

class Image(models.Model):
    image = models.ImageField(upload_to='uploads/')  # Folder inside MEDIA_ROOT
    
    def __str__(self):
        return self.image.url
class Post(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    created_date = models.DateTimeField(default=timezone.now)
    updated_date = models.DateTimeField(default=timezone.now)
    published_date = models.DateTimeField(blank=True, null=True)
    images = models.ManyToManyField(Image)
    def publish(self):
        self.published_date = timezone.now()
        self.save()

    def __str__(self):
        return self.title
#added description model for multiple descriptions in 1 post
class Description(models.Model):
    post = models.ForeignKey(Post, related_name="descriptions", on_delete=models.CASCADE)
    text = models.TextField()

    def __str__(self):
        return self.text

# class Image(models.Model):
#     post = models.ForeignKey(Post, related_name="images" ,on_delete=models.CASCADE)
#     image = models.ImageField(upload_to='images/')

#     def __str__(self):
#         return self.image.url
