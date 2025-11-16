from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Professor, Aluno
from .serializers import ProfessorSerializer, ProfessorCreateSerializer, AlunoSerializer, AlunoCreateSerializer
from .permissions import IsProfessor

class ProfessoresAPIView(generics.ListCreateAPIView):
    queryset = Professor.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ProfessorCreateSerializer
        return ProfessorSerializer
    
    def get_permissions(self):
        if self.request.method == 'POST':
            self.permission_classes = [AllowAny]
        else:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()


class ProfessorAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Professor.objects.all()
    serializer_class = ProfessorSerializer
    permission_classes = [IsAuthenticated]


class AlunosAPIView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated, IsProfessor]

    def get_queryset(self):
        # Retorna apenas os alunos do professor logado
        return Aluno.objects.filter(professor=self.request.user.professor)

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return AlunoCreateSerializer
        return AlunoSerializer


class AlunoAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Aluno.objects.all()
    serializer_class = AlunoSerializer
    permission_classes = [IsAuthenticated]

