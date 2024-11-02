from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('login/', views.Login, name='login'),
    path('machines/', views.machines, name='machines'),
    path('query/', views.query, name='query'),
    path('signup/', views.signup, name='signup'),
]