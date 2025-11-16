from rest_framework.permissions import BasePermission

class IsProfessor(BasePermission):
    """
    Permite acesso apenas a usuários que são Professores.
    """
    message = "Apenas professores podem realizar esta ação."

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and hasattr(request.user, 'professor')