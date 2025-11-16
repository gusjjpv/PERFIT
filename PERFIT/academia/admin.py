from django.contrib import admin
from .models import Professor, Aluno, FichaDeDados, AvaliacaoFisica, AvaliacaoPa

@admin.register(Professor)
class ProfessorAdmin(admin.ModelAdmin):
    list_display = ['user', 'cref']
    search_fields = ['user__username', 'user__first_name', 'user__last_name', 'cref']

@admin.register(Aluno)
class AlunoAdmin(admin.ModelAdmin):
    list_display = ['user', 'professor']
    search_fields = ['user__username', 'user__first_name', 'user__last_name']
    list_filter = ['professor']

@admin.register(FichaDeDados)
class FichaDeDadosAdmin(admin.ModelAdmin):
    list_display = ['aluno', 'altura', 'peso', 'imc']
    search_fields = ['aluno__user__username', 'aluno__user__first_name']
    readonly_fields = ['imc']

@admin.register(AvaliacaoFisica)
class AvaliacaoFisicaAdmin(admin.ModelAdmin):
    list_display = ['aluno', 'data', 'peito', 'cintura']
    search_fields = ['aluno__user__username', 'aluno__user__first_name']
    list_filter = ['data']

@admin.register(AvaliacaoPa)
class AvaliacaoPaAdmin(admin.ModelAdmin):
    list_display = ['aluno', 'data', 'momento', 'paSistolica', 'paDiastolica']
    search_fields = ['aluno__user__username', 'aluno__user__first_name']
    list_filter = ['data', 'momento']
