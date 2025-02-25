from django.urls import path
from .views import delete_image, get_posts, create_post, get_post, post_detail, upload_images, delete_image
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [
    path('posts/', get_posts, name='get_posts'),
    path('posts/create/', create_post, name='create_post'),
    path('posts/<int:pk>/', get_post, name='get_post'),
    path('posts/<int:pk>', post_detail, name='post_detail'),
    path('posts/<int:post_id>/upload-images/', upload_images, name='upload_images'),
    path('posts/<int:post_id>/delete-image/<int:image_id>/', delete_image, name='delete_image'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)