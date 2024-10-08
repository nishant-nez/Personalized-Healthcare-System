from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from accounts.models import UserAccount
from .serializers import ProfileImageSerializer

class UpdateProfileImageView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        try:
            user_to_update = UserAccount.objects.get(id=user_id)
        except UserAccount.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        if request.user.id != user_to_update.id:
            return Response({"error": "You do not have permission to update this user's profile image."}, status=status.HTTP_403_FORBIDDEN)
        
        if not request.data:
            return Response({"error": "Image is required"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        serializer = ProfileImageSerializer(user_to_update, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Profile image updated successfully"}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
