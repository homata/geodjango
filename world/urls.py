# -*- coding: utf-8 -*-
from django.conf.urls import url
from django.urls import include, path
from . import views
from django.views.generic.base import RedirectView
from world import apis

from world.models import Border
from djgeojson.views import GeoJSONLayerView

# アプリケーションの名前空間
# https://docs.djangoproject.com/ja/2.0/intro/tutorial03/
app_name = 'data'

urlpatterns = [
    path('', views.index, name='index'),
    path('geojson/', apis.GeojsonAPIView.as_view(), name='geojson_view'),
    path('borders.geojson', GeoJSONLayerView.as_view(model=Border), name='borders'),

    #url(r'^borders/(?P<z>\d+)/(?P<x>\d+)/(?P<y>\d+).geojson$',apis.BorderTiledLayer.as_view(model=Border), name='tiledborders'),
    path('borders/<int:z>/<int:x>/<int:y>.geojson',apis.BorderTiledLayer.as_view(model=Border), name='tiledborders'),
]
