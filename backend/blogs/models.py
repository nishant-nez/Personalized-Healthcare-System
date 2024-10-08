from django.db import models
from accounts.models import UserAccount


class Category(models.Model):
    name = models.CharField(max_length=30)

    def __str__(self):
        return self.name


class Blog(models.Model):
    def upload_to(instance, filename):
        return 'blogs/{filename}'.format(filename=filename)
    
    title = models.CharField(max_length=255)
    content = models.TextField()
    author = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    image_url = models.ImageField(upload_to=upload_to, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    categories = models.ManyToManyField(Category, related_name="blogs")

    def __str__(self):
        return self.title


class Comment(models.Model):
    content = models.TextField()
    author = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.author.email + ' ' + self.content


class Like(models.Model):
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.email + ' ' + self.blog.title