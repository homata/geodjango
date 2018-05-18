### pyenv

インストール可能バージョン

    $ pyenv install -l

インストール済みを表示

    $ pyenv versions

インストール

    $ pyenv install 3.6.4
    $ pyenv rehash

virtualenvを作成

    $ pyenv virtualenv 3.6.4 geodjango

ローカル環境設定

    $ pyenv local geodjango
    $ pip install --upgrade pip

環境をコピーしたい

    $ pip freeze -l
    $ pip freeze > requirements.txt
    $ pip install -r requirements.txt


### インストール

GeoDjango Installation
https://docs.djangoproject.com/en/2.0/ref/contrib/gis/install/

#### Geospatial libraries and Spatial database

PostgresSQL, PostGIS, GDAL, GEOS, PROJ4等をインストール


MacOS
    Django Documents
    https://docs.djangoproject.com/en/2.0/ref/contrib/gis/install/#macos

    $ brew install postgresql
    $ brew install postgis
    $ brew install gdal
    $ brew install libgeoip

Windows

    Django Documents
    https://docs.djangoproject.com/en/2.0/ref/contrib/gis/install/#windows
    
    PostgresSQL
    PostgreSQL 9.x installer
    https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

    PostGIS
    スタックビルダを管理者権限で実行
    起動中のデータベース選択
    メニューからPostGISを選択
    
    psycopg2
    http://www.stickpeople.com/projects/python/win-psycopg/

    PROJ.4, GDAL, and GEOS l
    OSGeo4Wのインストーラを利用
    https://trac.osgeo.org/osgeo4w/wiki/OSGeo4W_jp

### Create a Spatial Database

    データベース作成
    $ psql -U postgres -l
    $ createdb -U postgres -E UTF8 <db name>

    PostGISの拡張をインストール
    $ psql -U postgres -d <db name> -c "CREATE EXTENSION postgis;"

### Install Django

    $ pip install django
    $ pip install django-environ
    $ pip install psycopg2-binary
    $ pip freeze -l
        Django==2.0.5
        django-environ==0.4.4
        psycopg2-binary==2.7.4
        pytz==2018.4
        six==1.11.0

    $ python -m django --version
        2.0.5

### Create a New Project

    データベース作成
    $ createdb -U postgres -E UTF8 geodjango

    プロジェクト作成
    $ django-admin startproject geodjango
    $ cd geodjango

    アプリケーション作成
    $ python manage.py startapp world

    $ tree
    .
    ├── geodjango
    │   ├── __init__.py
    │   ├── settings.py
    │   ├── urls.py
    │   └── wsgi.py
    ├── manage.py
    └── world
        ├── __init__.py
        ├── admin.py
        ├── apps.py
        ├── migrations
        │   └── __init__.py
        ├── models.py
        ├── tests.py
        └── views.py


### GeoDjangoの設定

    $ vi geodjango/settings.py

    DATABASES = {
        'default': {
             'ENGINE': 'django.contrib.gis.db.backends.postgis',
             'NAME': 'geodjango',
             'USER': 'postgres',
             :
        },
    }


    INSTALLED_APPS = [
        :
        'django.contrib.gis',
        'world',
    ]

    データベース作成
    $ python manage.py migrate
        Operations to perform:
          Apply all migrations: admin, auth, contenttypes, sessions
        Running migrations:
          Applying contenttypes.0001_initial... OK
          Applying auth.0001_initial... OK
          Applying admin.0001_initial... OK
          Applying admin.0002_logentry_remove_auto_add... OK
          Applying contenttypes.0002_remove_content_type_name... OK
          Applying auth.0002_alter_permission_name_max_length... OK
          Applying auth.0003_alter_user_email_max_length... OK
          Applying auth.0004_alter_user_username_opts... OK
          Applying auth.0005_alter_user_last_login_null... OK
          Applying auth.0006_require_contenttypes_0002... OK
          Applying auth.0007_alter_validators_add_error_messages... OK
          Applying auth.0008_alter_user_username_max_length... OK
          Applying auth.0009_alter_user_last_name_max_length... OK
          Applying sessions.0001_initial... OK

    スーパーユーザーを作成します。
    $ python manage.py createsuperuser
        Username (leave blank to use 'homata'): admin
        Email address: hoge@fuga.com
        Password:
        Password (again):
        Superuser created successfully.

    Django起動
    $ python manage.py runserver
    -> http://localhost:8000/

### Geographic Data (行政区域)

    $ mkdir world/data
    $ cd world/data

    国土数値情報　ダウンロードサービス
    http://nlftp.mlit.go.jp/ksj/
    
    座標系	JGD2011 -> SRID=6668
    
    2. 政策区域 -> 行政区域 -> 神奈川県 をダウンロード
    -> N03-170101_14_GML.zip
        N03-17_14_170101.dbf
        N03-17_14_170101.prj
        N03-17_14_170101.shp
        N03-17_14_170101.shx
        N03-17_14_170101.xml

    構造確認 -> Polygonデータ
    $ ogrinfo N03-17_14_170101.shp
    INFO: Open of `N03-17_14_170101.shp'
          using driver `ESRI Shapefile' successful.
    1: N03-17_14_170101 (Polygon)

    N03-17_14_170101レイヤー確認
    $ ogrinfo -so N03-17_14_170101.shp N03-17_14_170101
    INFO: Open of `N03-17_14_170101.shp'
          using driver `ESRI Shapefile' successful.
    
    Layer name: N03-17_14_170101
    Metadata:
      DBF_DATE_LAST_UPDATE=2017-02-16
    Geometry: Polygon
    Feature Count: 1292
    Extent: (138.915768, 35.128492) - (139.835841, 35.672897)
    Layer SRS WKT:
    GEOGCS["GCS_JGD_2011",
        DATUM["JGD_2011",
            SPHEROID["GRS_1980",6378137.0,298.257222101]],
        PRIMEM["Greenwich",0.0],
        UNIT["Degree",0.0174532925199433]]
    N03_001: String (10.0)
    N03_002: String (20.0)
    N03_003: String (20.0)
    N03_004: String (20.0)
    N03_007: String (5.0)


    シェープファイルのモデル作成
    座標系	JGD2011 -> SRID=6668
    
    $ python manage.py ogrinspect --srid=6668 world/data/N03-17_14_170101.shp Border
        # This is an auto-generated Django model module created by ogrinspect.
        from django.contrib.gis.db import models
        
        class Border(models.Model):
            n03_001 = models.CharField(max_length=10)
            n03_002 = models.CharField(max_length=20)
            n03_003 = models.CharField(max_length=20)
            n03_004 = models.CharField(max_length=20)
            n03_007 = models.CharField(max_length=5)
            geom = models.PolygonField(srid=6668)

    $ vi world/model.py

    $ python manage.py makemigrations
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

        migrateファイル作成
        $ python manage.py makemigrations
        Migrations for 'world':
          world/migrations/0001_initial.py
            - Create model Border

        migrate実行
        $ python manage.py migrate
        Operations to perform:
          Apply all migrations: admin, auth, contenttypes, sessions, world
        Running migrations:
          Applying world.0001_initial... OK

        
        テーブル確認
        $ psql -U postgres geodjango

        geodjango=# \dt
                           List of relations
         Schema |            Name            | Type  |  Owner
        --------+----------------------------+-------+----------
         public | auth_group                 | table | postgres
         public | auth_group_permissions     | table | postgres
         public | auth_permission            | table | postgres
         public | auth_user                  | table | postgres
         public | auth_user_groups           | table | postgres
         public | auth_user_user_permissions | table | postgres
         public | django_admin_log           | table | postgres
         public | django_content_type        | table | postgres
         public | django_migrations          | table | postgres
         public | django_session             | table | postgres
         public | spatial_ref_sys            | table | postgres
         public | world_border               | table | postgres
        (12 rows)

  
    シェープデータをデータベースにロード
    $ vi world/load.py
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

    * border_mapping
        - 辞書の各キーは、Borderモデル内のフィールドに対応しています
    * transformキーワードは
        次のように設定されたFalseシェープファイル内のデータを変換する必要がないため-それはWGS84（SRID = 4326）ですでにます。
    * encodingキーワードは
        シェープファイル内の文字列値の文字エンコーディングに設定されています。


    load.py実行
    $ python manage.py shell
        In [1]: from demo import load
        In [2]: load.run()
        In [3]: exit

    $ psql -U postgres geodjango

        geodjango=# select count(*) from world_border;
         count
        -------
          1292
        (1 row)
        geodjango=# \q

##### Admin

    $ vi world/admin.py
        from django.contrib.gis import admin
        from world.models import Border

        #admin.site.register(Border, admin.GeoModelAdmin)
        admin.site.register(Border, admin.OSMGeoAdmin)

    $ vi geodjango/urls.py
        from django.urls import include, path
        from django.contrib.gis import admin
        admin.autodiscover()

        urlpatterns = [
            path('admin/', admin.site.urls),
        ]


#### django-leaflet

    $ pip install django-leaflet

    $ vi world/admin.py
        from django.contrib.gis import admin
        from world.models import Border
        from leaflet.admin import LeafletGeoAdmin

        class BorderAdmin(LeafletGeoAdmin):
          search_fields = ['n03_001','n03_003','n03_004']
          list_filter = ('n03_004', )

        admin.site.register(Border, BorderAdmin)


#### django-geojson


from world.models import Border
from django.core.serializers import serialize

serialize('geojson', Border.objects.all(), geometry_field='geom',fields=('n03_004',))
serialize('geojson', Border.objects.filter(n03_003="川崎市"), geometry_field='geom',fields=('n03_004',))
serialize('geojson', Border.objects.filter(id=1), geometry_field='geom',fields=('n03_004',))

In [6]: serialize('geojson', Border.objects.filter(id=1), geometry_field='geom',fields=('n03_004',))
Out[6]: '{"type": "FeatureCollection", "crs": {"type": "name", "properties": {"name": "EPSG:4326"}}, "features": [{"type": "Feature", "properties": {"n03_004": "\\u9db4\\u898b\\u533a"}, "geometry": {"type": "Polygon", "coordinates": [[[139.67603133600005, 35.45629161300003], [139.67587019500002, 35.455984837999964], [139.67581192, 35.455874054000034], [139.67579549899997, 35.455865027], [139.675773022, 35.45586238700005], [139.675740195, 35.455868640000034], [139.67571450100002, 35.455885387], [139.67570430599997, 35.455912586000025], [139.67576016899997, 35.456023531999975], [139.67582211399997, 35.456004134999965], [139.67586997400002, 35.456092359999985], [139.67594143999997, 35.45622389200002], [139.675933165, 35.456236414], [139.67595422799997, 35.45628502700002], [139.675975136, 35.45629405399997], [139.675981284, 35.45630910799997], [139.67603133600005, 35.45629161300003]]]}}]}'


* [GeoJSON Serializer](https://docs.djangoproject.com/en/2.0/ref/contrib/gis/serializers/)


#### djangorestframework

    $ pip install djangorestframework
        $ pip install django-filter
        $ pip install django-bootstrap-form
        $ pip install dj-database-url


---------


* [GeoDjango Model API](https://docs.djangoproject.com/en/2.0/ref/contrib/gis/model-api/)
* [GeoDjango Database API](https://docs.djangoproject.com/en/2.0/ref/contrib/gis/db-api/)
* [GeoDjango Forms API](https://docs.djangoproject.com/en/2.0/ref/contrib/gis/forms-api/)
* [GIS QuerySet API Reference](https://docs.djangoproject.com/en/2.0/ref/contrib/gis/geoquerysets/)
* [Geographic Database Functions](https://docs.djangoproject.com/en/2.0/ref/contrib/gis/functions/)
* [Measurement Objects](https://docs.djangoproject.com/en/2.0/ref/contrib/gis/measure/)
* [GEOS API](https://docs.djangoproject.com/en/2.0/ref/contrib/gis/geos/)
* [GDAL API](https://docs.djangoproject.com/en/2.0/ref/contrib/gis/gdal/)
* [Geolocation with GeoIP2](https://docs.djangoproject.com/en/2.0/ref/contrib/gis/geoip2/)
* [GeoDjango Utilities](https://docs.djangoproject.com/en/2.0/ref/contrib/gis/utils/)

### 参考リンク

#### GISアプリケーション

* [デスクトップGIS QGIS](http://www.qgis.org)
* [OSGeo-Live 11.0 コンテンツ](https://live.osgeo.org/ja/overview/overview.html)

#### GIS関連データ

* [国土数値情報　ダウンロードサービス](http://nlftp.mlit.go.jp/ksj/index.html)
* [G空間情報センター](https://www.geospatial.jp/)
* [地図で見る統計(統計GIS)](https://www.e-stat.go.jp/gis)
