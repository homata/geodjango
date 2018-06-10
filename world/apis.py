from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils.translation import ugettext as _

# @see:
# * [Django REST framework: non-model serializer](https://stackoverflow.com/questions/13603027/django-rest-framework-non-model-serializer)
# * [Django REST framework ViewSet when you don’t have a Model](https://medium.com/django-rest-framework/django-rest-framework-viewset-when-you-don-t-have-a-model-335a0490ba6f)
#

import traceback
import json

from world.models import Border
from django.core.serializers import serialize
from djgeojson.views import TiledGeoJSONLayerView

# -----------------------------------------
class GeojsonAPIView(APIView):
    """
    GeoJsonデータ取得
    @return geojson形式
    """

    def get(self, request, *args, **keywords):
        try:
            # "crs": {"type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"}},
            encjson  = serialize('geojson', Border.objects.filter(n03_004="中原区"),srid=4326, geometry_field='geom', fields=('n03_004',) )
            result   = json.loads(encjson)
            response = Response(result, status=status.HTTP_200_OK)

        except Exception as e:
            traceback.print_exc()
            response = Response({}, status=status.HTTP_404_NOT_FOUND)

        except:
            response = Response({}, status=status.HTTP_404_NOT_FOUND)

        return response

# -----------------------------------------
class BorderTiledLayer(TiledGeoJSONLayerView):
    # Options
    srid=4326
    trim_to_boundary=False
    properties=('n03_001','n03_003','n03_004','n03_007')
