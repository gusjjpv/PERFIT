from django.urls import path
from . import views

urlpatterns = [
    path('profesores/', views.ProfessoresAPIView.as_view(), name='professor'),
    path('profesores/<int:pk>/', views.ProfessorAPIView.as_view(), name='profesores'),
    path('alunos/', views.AlunosAPIView.as_view(), name='alunos-list'),
    path('alunos/<int:pk>/', views.AlunoAPIView.as_view(), name='aluno-detail'),
    path('alunos/<int:pk>/ficha/', views.FichaDeDadosAPIView.as_view(), name='aluno-ficha-dados'),
    path('fichasTreino/', views.FichasTreinoAPIView.as_view(), name='fichas-list'),
    path('fichasTreino/<int:pk>/', views.FichaTreinoDetailAPIView.as_view(), name='ficha-detail'),
    path('alunos/<int:pk>/avaliacoes-fisicas/', views.AvaliacaoFisicaListCreateAPIView.as_view(),  name='avaliacao-fisica-list-create')
]
