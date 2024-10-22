from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import mixins, generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import Http404
from django.views.decorators.csrf import csrf_exempt
from .models import Category, Blog, Like
from .serializers import CategorySerializer, BlogSerializer, LikeSerializer
from .permissions import IsOwnerOrReadOnly, IsAdminOrReadOnly

# class CategoryList(APIView):
class CategoryList(generics.ListCreateAPIView):
    """
    List all categories, or create a new category.
    """
    # def get(self, request, format=None):
    #     categories = Category.objects.all()
    #     serializer = CategorySerializer(categories, many=True)
    #     return Response(serializer.data)

    # def post(self, request, format=None):
    #     serializer = CategorySerializer(data=request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data, status=status.HTTP_201_CREATED)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]


# class CategoryDetail(APIView):
class CategoryDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a category instance.
    """
    # def get_object(self, pk):
    #     try:
    #         return Category.objects.get(pk=pk)
    #     except Category.DoesNotExist:
    #         raise Http404

    # def get(self, request, pk, format=None):
    #     category = self.get_object(pk)
    #     serializer = CategorySerializer(category)
    #     return Response(serializer.data)

    # def put(self, request, pk, format=None):
    #     category = self.get_object(pk)
    #     serializer = CategorySerializer(category, data=request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # def delete(self, request, pk, format=None):
    #     category = self.get_object(pk)
    #     category.delete()
    #     return Response(status=status.HTTP_204_NO_CONTENT)

    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]


class BlogList(generics.ListCreateAPIView):
    """
    List all blogs, or create a new blog.
    """
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    parser_classes = (MultiPartParser, FormParser)


class BlogDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, Update or Delete Blog instance
    """
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    permission_classes = [IsOwnerOrReadOnly]
    parser_classes = (MultiPartParser, FormParser)


class BlogsOfUser(APIView):
    """
    List all blogs of a user
    """

    permission_classes = []

    def get(self, request, pk, format=None):
        blogs = Blog.objects.filter(author_id=pk)
        serializer = BlogSerializer(blogs, many=True, context={'request': request})
        return Response(serializer.data)


class BlogsExceptUser(APIView):
    """
    List all blogs except of a user
    """

    permission_classes = []

    def get(self, request, pk, format=None):
        blogs = Blog.objects.exclude(author_id=pk)
        serializer = BlogSerializer(blogs, many=True, context={'request': request})
        return Response(serializer.data)


class BlogLikeList(APIView):
    """
    List all likes of all blog
    """

    permission_classes = []

    def get(self, request, format=None):
        likes = Like.objects.all()
        serializer = LikeSerializer(likes, many=True)
        return Response(serializer.data)


class BlogLike(APIView):
    """
    Like a blog and get likes of given blog
    """

    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def post(self, request, blog_id, format=None):
        blog = Blog.objects.get(pk=blog_id)
        try:
            blog = Blog.objects.get(pk=blog_id)
        except Blog.DoesNotExist:
            return Response({"error": "Blog not found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            liked = Like.objects.get(user=request.user, blog=blog)
            liked.delete()
            return Response({'message': 'Unliked'}, status=status.HTTP_200_OK)
        except Like.DoesNotExist:
            like = Like.objects.create(user=request.user, blog=blog)
            like.save()
            return Response({'message': 'Liked'}, status=status.HTTP_201_CREATED)
    
    def get(self, request, blog_id, format=None):
        try:
            blog = Blog.objects.get(pk=blog_id)
        except Blog.DoesNotExist:
            return Response({"error": "Blog not found"}, status=status.HTTP_404_NOT_FOUND)
        
        likes = Like.objects.filter(blog=blog)
        like_count = likes.count()
        if request.user.is_authenticated:
            self_liked = likes.filter(user=request.user).exists()
        else:
            self_liked = False

        return Response({'likes': like_count, 'self_liked': self_liked})