#from django.contrib import admin
from django.contrib.gis import admin
from world.models import Border

admin.site.register(Border, admin.GeoModelAdmin)
