# -*- coding: utf-8 -*-
#from django.db import models
from django.contrib.gis.db import models
from django.utils import timezone
from django.forms.models import model_to_dict
from django.utils.translation import ugettext as _

# This is an auto-generated Django model module created by ogrinspect.
from django.contrib.gis.db import models

class Border(models.Model):
    n03_001 = models.CharField('都道府県名', max_length=10, null=False, default="")
    n03_002 = models.CharField('支庁・振興局名', max_length=20, blank=True, null=False, default="")
    n03_003 = models.CharField('郡・政令都市名',max_length=20, blank=True, null=False, default="")
    n03_004 = models.CharField('市区町村名',max_length=20, blank=True, null=False, default="")
    n03_007 = models.CharField('行政区域コード',max_length=5, blank=True, null=False, default="")
    geom = models.PolygonField(srid=6668)

    class Meta:
        verbose_name = _('行政区域')
        verbose_name_plural = _('行政区域一覧')

    def to_dict(self):
        return model_to_dict(self)

    def update(self):
        #self.update_date = timezone.now()
        self.save()

    def __str__(self):
        return self.n03_004
