from django.contrib import admin
from .models import Post, Description, Image
# Register your models here.

admin.site.register(Post)
admin.site.register(Description)
admin.site.register(Image)