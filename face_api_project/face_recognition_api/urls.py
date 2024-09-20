from django.urls import path
from .views import FaceRecognitionAPIView

urlpatterns = [
    path('recognize/', FaceRecognitionAPIView.as_view(), name='recognize'),
]
