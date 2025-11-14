from rest_framework import generics
from .models import Professor
from .serializers import ProfessorSerializer, ProfessorCreateSerializer

class ProfessoresAPIView(generics.ListCreateAPIView):
    queryset = Professor.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ProfessorCreateSerializer
        return ProfessorSerializer


class ProfessorAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Professor.objects.all()
    serializer_class = ProfessorSerializer