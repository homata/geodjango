from django.urls import include, path
from . import views
from django.views.generic.base import RedirectView
from world import apis

# アプリケーションの名前空間
# https://docs.djangoproject.com/ja/2.0/intro/tutorial03/
app_name = 'data'

urlpatterns = [
    path('', views.index, name='index'),
    path('geojson/', apis.GeojsonAPIView.as_view(), name='geojson_view'),
]
