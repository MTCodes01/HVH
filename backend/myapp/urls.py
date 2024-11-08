from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('home/', views.home, name='home'),
    path('login/', views.Login, name='login'),
    path('machines/', views.machines, name='machines'),
    path('query/', views.query, name='query'),
    path('signup/', views.signup, name='signup'),
    path('worker_score/', views.worker_score, name='worker_score'),
    path('workers/', views.workers, name='workers'),
    path('add/', views.add_tables, name='add'),
    path('continue/', views.cont, name='continue'),
]