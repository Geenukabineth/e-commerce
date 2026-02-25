from rest_framework.permissions import BasePermission




class IsSeller(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.profile.role == 'seller'
    
class IsBuyer(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.profile.role == 'buyer'
    
class IsAdminorSeller(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (request.user.profile.role == 'admin' or request.user.profile.role == 'seller')