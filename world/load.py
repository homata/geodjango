# -*- coding: utf-8 -*-
import os
from django.contrib.gis.utils import LayerMapping
from world.models import Border

# Modelとシェープファイルのカラムのマッピング
border_mapping = {
    'n03_001' : 'N03_001',
    'n03_002' : 'N03_002',
    'n03_003' : 'N03_003',
    'n03_004' : 'N03_004',
    'n03_007' : 'N03_007',
    'geom' : 'POLYGON',
}

# ロード シェープファイル
border_shp = os.path.abspath(
    os.path.join(os.path.dirname(__file__), 'data', 'N03-17_14_170101.shp'),
)

def run(verbose=True):
    lm = LayerMapping(Border, border_shp, border_mapping, transform=False, encoding='sjis')
    lm.save(strict=True, verbose=verbose)
