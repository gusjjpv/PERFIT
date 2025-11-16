from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from .models import Professor, Aluno, FichaDeDados
from .serializers import ProfessorSerializer, ProfessorCreateSerializer, AlunoSerializer, AlunoCreateSerializer, FichaDeDadosSerializer
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
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['user__first_name', 'user__last_name', 'user__username']
    ordering_fields = ['user__first_name', 'user__last_name']
    ordering = ['user__first_name']  # Ordenação padrão por nome

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


class FichaDeDadosAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = FichaDeDadosSerializer
    permission_classes = [IsAuthenticated, IsProfessor]
    
    def get_object(self):
        aluno_id = self.kwargs.get('aluno_id')
        aluno = get_object_or_404(Aluno, pk=aluno_id)
        
        # Verifica se o professor logado é dono do aluno
        if aluno.professor != self.request.user.professor:
            raise PermissionDenied("Você não tem permissão para acessar a ficha deste aluno.")
        
        # Retorna a ficha existente ou cria uma nova
        ficha, created = FichaDeDados.objects.get_or_create(aluno=aluno)
        return ficha
    
    def perform_destroy(self, instance):
        # Soft delete: marca aluno como inativo ao invés de deletar a ficha
        instance.aluno.ativo = False
        instance.aluno.save()

