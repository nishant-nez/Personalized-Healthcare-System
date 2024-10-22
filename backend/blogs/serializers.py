from rest_framework import serializers
from .models import Blog, Category, Like, Comment
from accounts.models import UserAccount
from accounts.serializers import UserAccountSerializer


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class BlogSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField(max_length=255)
    content = serializers.CharField()
    author = serializers.PrimaryKeyRelatedField(queryset=UserAccount.objects.all(), required=True)
    image_url = serializers.ImageField(required=False)
    updated_at = serializers.DateTimeField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    categories = serializers.PrimaryKeyRelatedField(many=True, queryset=Category.objects.all(), required=True)

    def create(self, validated_data):
        """
        Create and return a new `Blog` instance, given the validated data.
        """
        author = validated_data.pop('author')
        categories = validated_data.pop('categories')

        blog = Blog.objects.create(author=author, **validated_data)
        blog.categories.set(categories)
        return blog

    def update(self, instance, validated_data):
        """
        Update and return an existing `Blog` instance, given the validated data.
        """
        author = validated_data.pop('author', None)
        categories = validated_data.pop('categories', None)

        if author:
            instance.author = author
        
        if categories is not None:
            instance.categories.set(categories)

        instance.title = validated_data.get('title', instance.title)
        instance.content = validated_data.get('content', instance.content)
        instance.save()
        return instance
    
    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image_url and request:
            return request.build_absolute_uri(obj.image_url.url)
        return None

    def to_representation(self, instance):
        """
        Convert the instance into a JSON-serializable format.
        """
        representation = super().to_representation(instance)

        # Convert author and categories to full details for GET requests
        author_representation = UserAccountSerializer(instance.author, context=self.context).data
        if 'image_url' in author_representation and author_representation['image_url']:
            request = self.context.get('request')
            author_representation['image_url'] = request.build_absolute_uri(author_representation['image_url'])
        
        representation['author'] = author_representation
        representation['categories'] = CategorySerializer(instance.categories.all(), many=True, context=self.context).data

        return representation


class CommentSerializer(serializers.ModelSerializer):
    author = UserAccountSerializer()
    
    class Meta:
        model = Comment
        fields = ['id', 'content', 'author', 'blog', 'updated_at', 'created_at']


class LikeSerializer(serializers.ModelSerializer):
    user = UserAccountSerializer()
    blog = BlogSerializer()
    
    class Meta:
        model = Like
        fields = ['id', 'user', 'blog']