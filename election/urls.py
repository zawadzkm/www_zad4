from django.conf.urls import url
from django.contrib.staticfiles import views

urlpatterns = [
    url(r'^$', views.serve,  kwargs={'path': 'index.html'})
]