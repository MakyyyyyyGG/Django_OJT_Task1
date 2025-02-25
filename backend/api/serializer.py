# serializers.py
from email.mime import image
from rest_framework import serializers
from .models import Post, Description, Image

class DescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Description
        fields = ['text']

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ['id', 'image']

    
# class PostSerializer(serializers.ModelSerializer):
#     descriptions = DescriptionSerializer(many=True, required=False)

#     class Meta:
#         model = Post
#         fields = "__all__"

#     def create(self, validated_data):
#         descriptions_data = validated_data.pop("descriptions", [])
#         post = Post.objects.create(**validated_data)
        
#         for description_data in descriptions_data:
#             Description.objects.create(post=post, **description_data)
#         return post

#     def update(self, instance, validated_data):
#         descriptions_data = validated_data.pop('descriptions', [])
#         instance = super().update(instance, validated_data)

#         # Handle descriptions
#         instance.descriptions.all().delete()
#         for description_data in descriptions_data:
#             Description.objects.create(post=instance, **description_data)

#         return instance

class PostSerializer(serializers.ModelSerializer):
    descriptions = DescriptionSerializer(many=True, required=False, allow_empty=True)
    images = ImageSerializer(many=True, required=False, allow_empty=True)

    class Meta:
        model = Post
        fields = "__all__"

    def create(self, validated_data):
        descriptions_data = validated_data.pop("descriptions", [])
        images_data = validated_data.pop("images", [])

        post = Post.objects.create(**validated_data)
        
        for description_data in descriptions_data:
            Description.objects.create(post=post, **description_data)

        for image_data in images_data:
            image_instance = Image.objects.create(image=image_data['image'])
            post.images.add(image_instance)

        return post

    def update(self, instance, validated_data):
        descriptions_data = validated_data.pop('descriptions', [])
        images_data = validated_data.pop('images', [])

        # Update the post fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Handle descriptions
        instance.descriptions.all().delete()
        for description_data in descriptions_data:
            Description.objects.create(post=instance, **description_data)

        # Handle images
        instance.images.all().delete()
        for image_data in images_data:
            image_instance = Image.objects.create(image=image_data['image'])
            instance.images.add(image_instance)

        return instance
    


