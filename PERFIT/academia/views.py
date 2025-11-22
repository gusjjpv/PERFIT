from django.shortcuts import get_object_or_404
from rest_framework import generics, filters, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .permissions import IsProfessor
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer
from drf_spectacular.utils import extend_schema, OpenApiResponse
from .models import Professor, Aluno, FichaTreino, FichaDeDados
from .serializers import (ProfessorSerializer, ProfessorCreateSerializer, AlunoSerializer, AlunoCreateSerializer, AlunoDetailSerializer, FichaTreinoSerializer, FichaDeDadosSerializer)

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
    
    #sobrescrevendo os metodos para documentacao no swagger

    @extend_schema(
        summary="Lista todos os professores",
        description="Retorna todos os professores cadastrados no sistema. Requer autenticação.",
        responses=ProfessorSerializer(many=True)
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    #Documentação POST
    @extend_schema(
        summary="Cria um novo professor",
        request=ProfessorCreateSerializer,
        responses=OpenApiResponse(
            response=ProfessorSerializer,
            description="Professor criado com sucesso."
        ),
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class ProfessorAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Professor.objects.all()
    serializer_class = ProfessorSerializer
    permission_classes = [IsAuthenticated]

    #sobrescrevendo os metodos para documentacao no swagger

    @extend_schema(
        summary="Busca professor por ID",
        description="Retorna os dados de um professor específico."
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @extend_schema(
        summary="Atualiza professor",
        description="Atualiza os dados do professor. Apenas usuários autenticados."
    )
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)

    @extend_schema(
        summary="Remove professor",
        description="Exclui o professor especificado."
    )
    def delete(self, request, *args, **kwargs):
        return super().delete(request, *args, **kwargs)


class AlunosAPIView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated, IsProfessor]

    filter_backends = [filters.SearchFilter]
    #campos que seram buscados
    search_fields = ['user__first_name', 'user__username', 'user__email']

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return AlunoCreateSerializer
        return AlunoSerializer

    def get_queryset(self):
        user = self.request.user
        
        if user.is_superuser:
            return Aluno.objects.all()

        if hasattr(user, 'professor'):
            return Aluno.objects.filter(professor=user.professor)

        return Aluno.objects.none()

    #sobrescrevendo os metodos para documentacao no swagger

    @extend_schema(
        summary="Lista todos os alunos",
        description="Retorna todos os alunos cadastrados. Apenas professores podem acessar.",
        responses=AlunoSerializer(many=True)
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @extend_schema(
        summary="Cria um novo aluno",
        description=(
            "Cria um aluno vinculado automaticamente ao professor autenticado. "
            "Somente professores podem criar alunos."
        ),
        request=AlunoCreateSerializer,
        responses=OpenApiResponse(
            response=AlunoSerializer,
            description="Aluno criado com sucesso."
        ),
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class AlunoAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Aluno.objects.all()
    serializer_class = AlunoSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        #se for apenas VER (GET), usa o serializer completo (com ficha)
        if self.request.method == 'GET':
            return AlunoDetailSerializer
        #se for Editar/Deletar, usa o normal
        return AlunoSerializer

    #sobrescrevendo os metodos para documentacao no swagger

    @extend_schema(
        summary="Busca aluno por ID",
        description="Retorna os dados de um aluno específico.",
        responses=AlunoDetailSerializer
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @extend_schema(
        summary="Atualiza aluno",
        description="Atualiza os dados de um aluno. Necessita autenticação."
    )
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)

    @extend_schema(summary="Atualiza parcialmente aluno")
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)

    @extend_schema(
        summary="Remove aluno",
        description="Exclui o aluno especificado. Necessita autenticação."
    )
    def delete(self, request, *args, **kwargs):
        return super().delete(request, *args, **kwargs)


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

    #sobrescrevendo os metodos para documentacao no swagger
    
    @extend_schema(
        summary="Obter token JWT",
        description="Retorna o access token e refresh token para o usuário."
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class FichasTreinoAPIView(generics.ListCreateAPIView):
    queryset = FichaTreino.objects.all()
    serializer_class = FichaTreinoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Opcional: Filtra para mostrar apenas fichas relacionadas ao usuário
        user = self.request.user
        if hasattr(user, 'professor'):
            return FichaTreino.objects.all() # Professor vê tudo (por enquanto)
        elif hasattr(user, 'aluno'):
            return FichaTreino.objects.filter(aluno__user=user) # Aluno só vê as dele
        return FichaTreino.objects.none()
    

class FichaTreinoDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = FichaTreino.objects.all()
    serializer_class = FichaTreinoSerializer
    permission_classes = [IsAuthenticated]


class FichaDeDadosAPIView(generics.RetrieveUpdateAPIView, generics.CreateAPIView):
    serializer_class = FichaDeDadosSerializer
    permission_classes = [IsAuthenticated, IsProfessor]

    def get_object(self):
        aluno_id = self.kwargs['pk'] # Pega o ID do Aluno da URL

        return get_object_or_404(FichaDeDados, aluno_id=aluno_id)

    def create(self, request, *args, **kwargs):
        aluno_id = self.kwargs['pk']
        
        if FichaDeDados.objects.filter(aluno_id=aluno_id).exists():
            return Response(
                {"detail": "Este aluno já tem ficha. Use PATCH para editar."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Se não existe, cria e vincula o ID manualmente
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(aluno_id=aluno_id)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @extend_schema(summary="Obter Ficha de Dados", description="Retorna os dados corporais do aluno.")
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @extend_schema(summary="Criar Ficha de Dados", description="Cria a ficha inicial (Peso, Altura, etc).")
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)
    
    @extend_schema(summary="Atualizar Ficha de Dados", description="Atualiza peso, altura, etc.")
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)
