from django.urls import path
from . import views

urlpatterns = [
    path('profesores/', views.ProfessoresAPIView.as_view(), name='professor'),
    path('profesores/<int:pk>/', views.ProfessorAPIView.as_view(), name='profesores')
]