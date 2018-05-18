#from django.contrib import admin
from django.contrib.gis import admin
from world.models import Border
from leaflet.admin import LeafletGeoAdmin

class BorderAdmin(LeafletGeoAdmin):
  search_fields = ['n03_001','n03_003','n03_004']
  list_filter = ('n03_004', )

admin.site.register(Border, BorderAdmin)