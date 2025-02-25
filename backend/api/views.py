from django.shortcuts import render
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework import status
from .models import Post, Description, Image
from .serializer import PostSerializer
import json
from django.utils import timezone
from rest_framework.parsers import MultiPartParser, FormParser

# Create your views here.

@api_view(['GET'])
def get_posts(request):
    posts = Post.objects.prefetch_related('descriptions').all()  # Fetch descriptions efficiently
    serializedData = PostSerializer(posts, many=True).data
    return Response(serializedData)

@api_view(['GET'])
def get_post(request, pk):
    post = Post.objects.prefetch_related('descriptions').get(id=pk)
    serializedData = PostSerializer(post).data
    return Response(serializedData)


@api_view(['PUT', 'DELETE'])
def delete_post(request, pk):
    try:
        post = Post.objects.get(id=pk)
    except Post.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = PostSerializer(post, data=request.data)
        if serializer.is_valid():
            # Save the serializer first to update the post fields like title
            serializer.save()
            
            descriptions_data = request.data.get('descriptions', [])
            
            post.descriptions.all().delete()  # Clear existing descriptions
            for description_data in descriptions_data:
                Description.objects.create(post=post, **description_data)  # Create new descriptions
            
            # Update created_date to the current date
            post.updated_date = timezone.now()
            post.save()  # Save the updated post
            
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
@api_view(['POST'])
def create_post(request):
    serializer = PostSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def upload_images(request, post_id):
    """
    Upload images separately and associate them with a post.
    """
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

    images = request.FILES.getlist('images')  # Get multiple images

    for image in images:
        image_instance = Image.objects.create(image=image)
        post.images.add(image_instance)  # Associate with the post

    return Response({"message": "Images uploaded successfully!"}, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
@parser_classes([MultiPartParser, FormParser])
def delete_image(request, post_id, image_id):
    try:
        post = Post.objects.get(id=post_id)
        image = post.images.get(id=image_id)
        image.delete()
        return Response({"message": "Image deleted successfully!"}, status=status.HTTP_204_NO_CONTENT)
    except Post.DoesNotExist:
        return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)
    except Image.DoesNotExist:
        return Response({"error": "Image not found"}, status=status.HTTP_404_NOT_FOUND)
