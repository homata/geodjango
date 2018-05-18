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

        admin.site.register(Border, admin.GeoModelAdmin)


    $ vi geodjango/urls.py

from django.conf.urls import patterns, include, url
from django.contrib.gis import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^admin/', include(admin.site.urls)),
)

### Geographic Data (World)

    テストデータダウンロード
    $ mkdir world/data
    $ cd world/data
    $ wget http://thematicmapping.org/downloads/TM_WORLD_BORDERS-0.3.zip
    $ unzip TM_WORLD_BORDERS-0.3.zip
    $ cd ../..

    Use ogrinfo to examine spatial data

    Shapeファイルの情報表示
    $ ogrinfo world/data/TM_WORLD_BORDERS-0.3.shp
        INFO: Open of `world/data/TM_WORLD_BORDERS-0.3.shp'
              using driver `ESRI Shapefile' successful.
        1: TM_WORLD_BORDERS-0.3 (Polygon)

    TM_WORLD_BORDERS-0.3レイヤーの情報表示
    $ ogrinfo -so world/data/TM_WORLD_BORDERS-0.3.shp TM_WORLD_BORDERS-0.3
        INFO: Open of `world/data/TM_WORLD_BORDERS-0.3.shp'
              using driver `ESRI Shapefile' successful.

        Layer name: TM_WORLD_BORDERS-0.3
        Metadata:
          DBF_DATE_LAST_UPDATE=2008-07-30
        Geometry: Polygon
        Feature Count: 246
        Extent: (-180.000000, -90.000000) - (180.000000, 83.623596)
        Layer SRS WKT:
        GEOGCS["GCS_WGS_1984",
            DATUM["WGS_1984",
                SPHEROID["WGS_84",6378137.0,298.257223563]],
            PRIMEM["Greenwich",0.0],
            UNIT["Degree",0.0174532925199433],
            AUTHORITY["EPSG","4326"]]
        FIPS: String (2.0)
        ISO2: String (2.0)
        ISO3: String (3.0)
        UN: Integer (3.0)
        NAME: String (50.0)
        AREA: Integer (7.0)
        POP2005: Integer64 (10.0)
        REGION: Integer (3.0)
        SUBREGION: Integer (3.0)
        LON: Real (8.3)
        LAT: Real (7.3)

### Geographic Models

    $ vi world/mode.py

        from django.db import models
        ↓
        from django.contrib.gis.db import models

        class WorldBorder(models.Model):
            # Regular Django fields corresponding to the attributes in the
            # world borders shapefile.
            name = models.CharField(max_length=50)
            area = models.IntegerField()
            pop2005 = models.IntegerField('Population 2005')
            fips = models.CharField('FIPS Code', max_length=2)
            iso2 = models.CharField('2 Digit ISO', max_length=2)
            iso3 = models.CharField('3 Digit ISO', max_length=3)
            un = models.IntegerField('United Nations Code')
            region = models.IntegerField('Region Code')
            subregion = models.IntegerField('Sub-Region Code')
            lon = models.FloatField()
            lat = models.FloatField()

            # GeoDjango-specific: a geometry field (MultiPolygonField)
            mpoly = models.MultiPolygonField()

            # Returns the string representation of the model.
            def __str__(self):
                return self.name


    $ python manage.py makemigrations
        Migrations for 'world':
          world/migrations/0001_initial.py
            - Create model WorldBorder

    $ python manage.py migrate
        Operations to perform:
          Apply all migrations: admin, auth, contenttypes, sessions, world
        Running migrations:
          Applying world.0001_initial... OK

### Importing Spatial Data

* ogr2ogr
    * GDALに含まれているコマンドラインユーティリティ
    * PostGIS、MySQL、およびOracleデータベースに多くのベクトルデータ形式をインポートが出来る
* shp2pgsql
    * PostGISに含まれており、PostGISにシェイプファイルをインポート可能


### インポート


Djangoシェルを起動します。
$ python manage.py shell


チュートリアルの前半でWorld Bordersデータをダウンロードした場合は、Pythonの組み込みosモジュールを使用してパスを判断できます。
import os
import world
world_shp = os.path.abspath(os.path.join(os.path.dirname(world.__file__), 'data', 'TM_WORLD_BORDERS-0.3.shp'))


GeoDjangoのDataSourceインターフェースを使用して、世界の枠線シェイプファイルを開き ます。
from django.contrib.gis.gdal import DataSource
ds = DataSource(world_shp)
print(ds)

データソースオブジェクトは、地理空間的特徴の異なるレイヤーを持つことができます。ただし、シェイプファイルは1つのレイヤーしか持てません。
print(len(ds))
lyr = ds[0]

レイヤのジオメトリタイプとそれに含まれるフィーチャの数を確認できます。
>>> print(lyr.geom_type)
Polygon
>>> print(len(lyr))
246


またLayer、それに関連付けられた空間参照系もあります。存在する場合、srs属性はSpatialReferenceオブジェクトを返し ます。

>>> srs = lyr.srs
>>> print(srs)
GEOGCS["GCS_WGS_1984",
    DATUM["WGS_1984",
        SPHEROID["WGS_1984",6378137.0,298.257223563]],
    PRIMEM["Greenwich",0.0],
    UNIT["Degree",0.0174532925199433]]
>>> srs.proj4 # PROJ.4 representation
'+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs '



またLayer、それに関連付けられた空間参照系もあります。存在する場合、srs属性はSpatialReferenceオブジェクトを返し ます。

>>> srs = lyr.srs
>>> print(srs)
GEOGCS["GCS_WGS_1984",
    DATUM["WGS_1984",
        SPHEROID["WGS_1984",6378137.0,298.257223563]],
    PRIMEM["Greenwich",0.0],
    UNIT["Degree",0.0174532925199433]]
>>> srs.proj4 # PROJ.4 representation
'+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs '


このシェイプファイルは、一般的なWGS84空間参照系にあります。換言すれば、データは経度と緯度のペアを度単位で使用します。

さらに、シェイプファイルは、追加のデータを含む可能性のある属性フィールドもサポートしています。World Bordersレイヤーのフィールドは次のとおりです。

>>> print(lyr.fields)
['FIPS', 'ISO2', 'ISO3', 'UN', 'NAME', 'AREA', 'POP2005', 'REGION', 'SUBREGION', 'LON', 'LAT']

のコードは、各フィールドに関連付けられているOGRタイプ（整数や文字列など）を調べるためのコードです。

>>> [fld.__name__ for fld in lyr.field_types]
['OFTString', 'OFTString', 'OFTString', 'OFTInteger', 'OFTString', 'OFTInteger', 'OFTInteger', 'OFTInteger', 'OFTInteger', 'OFTReal', 'OFTReal']


レイヤー内の各フィーチャを反復処理して、フィーチャのジオメトリ（geom属性を介してアクセス）とフィーチャの属性フィールド（ メソッドを介して値にアクセスget()する）の両方から情報を抽出できます。

>>> for feat in lyr:
...    print(feat.get('NAME'), feat.geom.num_points)
...
Guernsey 18
Jersey 26
South Georgia South Sandwich Islands 338
Taiwan 363
Layer オブジェクトをスライスすることができます。

>>> lyr[0:2]
[<django.contrib.gis.gdal.feature.Feature object at 0x2f47690>, <django.contrib.gis.gdal.feature.Feature object at 0x2f47650>]
個々の機能は、その機能IDによって取り出すことができます：

>>> feat = lyr[234]
>>> print(feat.get('NAME'))
San Marino

境界ジオメトリをWKTおよびGeoJSONとしてエクスポートすることができます。
>>> geom = feat.geom
>>> print(geom.wkt)
POLYGON ((12.415798 43.957954,12.450554 43.979721,12.453888 43.981667,12.4625 43.984718,12.471666 43.986938,12.492777 43.989166,12.505554 43.988609,12.509998 43.986938,12.510277 43.982773,12.511665 43.943329,12.510555 43.939163,12.496387 43.923332,12.494999 43.914719,12.487778 43.90583,12.474443 43.897217,12.464722 43.895554,12.459166 43.896111,12.416388 43.904716,12.412222 43.906105,12.407822 43.913658,12.403889 43.926666,12.404999 43.948326,12.408888 43.954994,12.415798 43.957954))
>>> print(geom.json)
{ "type": "Polygon", "coordinates": [ [ [ 12.415798, 43.957954 ], [ 12.450554, 43.979721 ], [ 12.453888, 43.981667 ], [ 12.4625, 43.984718 ], [ 12.471666, 43.986938 ], [ 12.492777, 43.989166 ], [ 12.505554, 43.988609 ], [ 12.509998, 43.986938 ], [ 12.510277, 43.982773 ], [ 12.511665, 43.943329 ], [ 12.510555, 43.939163 ], [ 12.496387, 43.923332 ], [ 12.494999, 43.914719 ], [ 12.487778, 43.90583 ], [ 12.474443, 43.897217 ], [ 12.464722, 43.895554 ], [ 12.459166, 43.896111 ], [ 12.416388, 43.904716 ], [ 12.412222, 43.906105 ], [ 12.407822, 43.913658 ], [ 12.403889, 43.926666 ], [ 12.404999, 43.948326 ], [ 12.408888, 43.954994 ], [ 12.415798, 43.957954 ] ] ] }



###### LayerMapping

データをインポートするには、PythonスクリプトでLayerMappingを使用します。次のコードを使用して、アプリケーションload.py内で呼び出されるファイルを作成しますworld。

$ vi load.py
import os
from django.contrib.gis.utils import LayerMapping
from .models import WorldBorder

world_mapping = {
    'fips' : 'FIPS',
    'iso2' : 'ISO2',
    'iso3' : 'ISO3',
    'un' : 'UN',
    'name' : 'NAME',
    'area' : 'AREA',
    'pop2005' : 'POP2005',
    'region' : 'REGION',
    'subregion' : 'SUBREGION',
    'lon' : 'LON',
    'lat' : 'LAT',
    'mpoly' : 'MULTIPOLYGON',
}

world_shp = os.path.abspath(
    os.path.join(os.path.dirname(__file__), 'data', 'TM_WORLD_BORDERS-0.3.shp'),
)

def run(verbose=True):
    lm = LayerMapping(
        WorldBorder, world_shp, world_mapping,
        transform=False, encoding='iso-8859-1',
    )
    lm.save(strict=True, verbose=verbose)

何が起こっているかについてのいくつかの注意：

* world_mapping辞書の各キーは、WorldBorderモデル内のフィールドに対応しています 。値は、データがロードされるシェイプファイルフィールドの名前です。
* mpolyジオメトリフィールドのキーはMULTIPOLYGON、ジオメトリタイプGeoDjangoがフィールドをインポートします。シェイプファイル内の単純なポリゴンでも、データベースに挿入する前に自動的にコレクションに変換されます。
* シェイプファイルへのパスは絶対パスではありません。つまり、 サブディレクトリをworld使用してアプリケーションをdata別の場所に移動すると、スクリプトは引き続き動作します。
* transformキーワードは次のように設定されたFalseシェープファイル内のデータを変換する必要がないため-それはWGS84（SRID = 4326）ですでにます。
* encodingキーワードは、シェープファイル内の文字列値の文字エンコーディングに設定されています。これにより、文字列値が元のエンコーディングシステムから正しく読み込まれ、保存されます。


$ python manage.py shell

    -> $ python world/load.py

>>> from world import load
>>> load.run()


Saved: Antigua and Barbuda
Saved: Algeria
Saved: Azerbaijan
Saved: Albania
Saved: Armenia
Saved: Angola
Saved: American Samoa
Saved: Argentina
Saved: Australia
Saved: Bahrain
Saved: Barbados
Saved: Bermuda
Saved: Bahamas
Saved: Bangladesh
Saved: Belize
Saved: Bosnia and Herzegovina
Saved: Bolivia
Saved: Burma
Saved: Benin
Saved: Solomon Islands
Saved: Brazil
Saved: Bulgaria
Saved: Brunei Darussalam
Saved: Canada
Saved: Cambodia
Saved: Sri Lanka
Saved: Congo
Saved: Democratic Republic of the Congo
Saved: Burundi
Saved: China
Saved: Afghanistan
Saved: Bhutan
Saved: Chile
Saved: Cayman Islands
Saved: Cameroon
Saved: Chad
Saved: Comoros
Saved: Colombia
Saved: Costa Rica
Saved: Central African Republic
Saved: Cuba
Saved: Cape Verde
Saved: Cook Islands
Saved: Cyprus
Saved: Denmark
Saved: Djibouti
Saved: Dominica
Saved: Dominican Republic
Saved: Ecuador
Saved: Egypt
Saved: Ireland
Saved: Equatorial Guinea
Saved: Estonia
Saved: Eritrea
Saved: El Salvador
Saved: Ethiopia
Saved: Austria
Saved: Czech Republic
Saved: French Guiana
Saved: Finland
Saved: Fiji
Saved: Falkland Islands (Malvinas)
Saved: Micronesia, Federated States of
Saved: French Polynesia
Saved: France
Saved: Gambia
Saved: Gabon
Saved: Georgia
Saved: Ghana
Saved: Grenada
Saved: Greenland
Saved: Germany
Saved: Guam
Saved: Greece
Saved: Guatemala
Saved: Guinea
Saved: Guyana
Saved: Haiti
Saved: Honduras
Saved: Croatia
Saved: Hungary
Saved: Iceland
Saved: India
Saved: Iran (Islamic Republic of)
Saved: Israel
Saved: Italy
Saved: Cote d'Ivoire
Saved: Iraq
Saved: Japan
Saved: Jamaica
Saved: Jordan
Saved: Kenya
Saved: Kyrgyzstan
Saved: Korea, Democratic People's Republic of
Saved: Kiribati
Saved: Korea, Republic of
Saved: Kuwait
Saved: Kazakhstan
Saved: Lao People's Democratic Republic
Saved: Lebanon
Saved: Latvia
Saved: Belarus
Saved: Lithuania
Saved: Liberia
Saved: Slovakia
Saved: Liechtenstein
Saved: Libyan Arab Jamahiriya
Saved: Madagascar
Saved: Martinique
Saved: Mongolia
Saved: Montserrat
Saved: The former Yugoslav Republic of Macedonia
Saved: Mali
Saved: Morocco
Saved: Mauritius
Saved: Mauritania
Saved: Malta
Saved: Oman
Saved: Maldives
Saved: Mexico
Saved: Malaysia
Saved: Mozambique
Saved: Malawi
Saved: New Caledonia
Saved: Niue
Saved: Niger
Saved: Aruba
Saved: Anguilla
Saved: Belgium
Saved: Hong Kong
Saved: Northern Mariana Islands
Saved: Faroe Islands
Saved: Andorra
Saved: Gibraltar
Saved: Isle of Man
Saved: Luxembourg
Saved: Macau
Saved: Monaco
Saved: Palestine
Saved: Montenegro
Saved: Mayotte
Saved: Ãland Islands
Saved: Norfolk Island
Saved: Cocos (Keeling) Islands
Saved: Antarctica
Saved: Bouvet Island
Saved: French Southern and Antarctic Lands
Saved: Heard Island and McDonald Islands
Saved: British Indian Ocean Territory
Saved: Christmas Island
Saved: United States Minor Outlying Islands
Saved: Vanuatu
Saved: Nigeria
Saved: Netherlands
Saved: Norway
Saved: Nepal
Saved: Nauru
Saved: Suriname
Saved: Nicaragua
Saved: New Zealand
Saved: Paraguay
Saved: Peru
Saved: Pakistan
Saved: Poland
Saved: Panama
Saved: Portugal
Saved: Papua New Guinea
Saved: Guinea-Bissau
Saved: Qatar
Saved: Reunion
Saved: Romania
Saved: Republic of Moldova
Saved: Philippines
Saved: Puerto Rico
Saved: Russia
Saved: Rwanda
Saved: Saudi Arabia
Saved: Saint Kitts and Nevis
Saved: Seychelles
Saved: South Africa
Saved: Lesotho
Saved: Botswana
Saved: Senegal
Saved: Slovenia
Saved: Sierra Leone
Saved: Singapore
Saved: Somalia
Saved: Spain
Saved: Saint Lucia
Saved: Sudan
Saved: Sweden
Saved: Syrian Arab Republic
Saved: Switzerland
Saved: Trinidad and Tobago
Saved: Thailand
Saved: Tajikistan
Saved: Tokelau
Saved: Tonga
Saved: Togo
Saved: Sao Tome and Principe
Saved: Tunisia
Saved: Turkey
Saved: Tuvalu
Saved: Turkmenistan
Saved: United Republic of Tanzania
Saved: Uganda
Saved: United Kingdom
Saved: Ukraine
Saved: United States
Saved: Burkina Faso
Saved: Uruguay
Saved: Uzbekistan
Saved: Saint Vincent and the Grenadines
Saved: Venezuela
Saved: British Virgin Islands
Saved: Viet Nam
Saved: United States Virgin Islands
Saved: Namibia
Saved: Wallis and Futuna Islands
Saved: Samoa
Saved: Swaziland
Saved: Yemen
Saved: Zambia
Saved: Zimbabwe
Saved: Indonesia
Saved: Guadeloupe
Saved: Netherlands Antilles
Saved: United Arab Emirates
Saved: Timor-Leste
Saved: Pitcairn Islands
Saved: Palau
Saved: Marshall Islands
Saved: Saint Pierre and Miquelon
Saved: Saint Helena
Saved: San Marino
Saved: Turks and Caicos Islands
Saved: Western Sahara
Saved: Serbia
Saved: Holy See (Vatican City)
Saved: Svalbard
Saved: Saint Martin
Saved: Saint Barthelemy
Saved: Guernsey
Saved: Jersey
Saved: South Georgia South Sandwich Islands
Saved: Taiwan




##### 空間クエリ
空間ルックアップ
GeoDjangoはDjango ORMに空間参照を追加します。たとえばWorldBorder、特定のポイントを含む表内の国を見つけることができます。まず、管理シェルを起動します。

$ python manage.py shell


今、興味のあるポイントを定義してください

>>> pnt_wkt = 'POINT(-95.3385 29.7245)'
pnt_wkt文字列は、-95.3385度経度、29.7245度緯度点を表します。このジオメトリは、Open Geospatial Consortium（OGC）によって発行された標準であるWell Known Text（WKT）という形式です。[4]WorldBorderモデルを インポートし、をパラメータとしてcontains使用しpnt_wktて検索を実行します。

>>> from world.models import WorldBorder
>>> WorldBorder.objects.filter(mpoly__contains=pnt_wkt)
<QuerySet [<WorldBorder: United States>]>


>>> from django.contrib.gis.geos import Point
>>> pnt = Point(12.4604, 43.9420)
>>> WorldBorder.objects.get(mpoly__intersects=pnt)
<WorldBorder: San Marino>


#### 自動空間変

空間クエリーを実行するとき、GeoDjangoはジオメトリが異なる座標系にある場合、ジオメトリを自動的に変換します。次の例では、座標はEPSG SRID 32140で表されます。座標系は南テキサス州だけに固有であり、度単位ではなくメートル単位です 。

>>> from django.contrib.gis.geos import GEOSGeometry, Point
>>> pnt = Point(954158.1, 4215137.1, srid=32140)
注pntまたEWKT、SRIDを含むWKTの「拡張」形式で構成してもよいです。

>>> pnt = GEOSGeometry('SRID=32140;POINT(954158.1 4215137.1)')
GeoDjangoのORMはジオメトリ値を変換SQLで自動的にラップし、開発者はより抽象度の高いレベルで作業できます。


>>> from django.contrib.gis.geos import GEOSGeometry, Point
>>> pnt = Point(954158.1, 4215137.1, srid=32140)
>>> pnt = GEOSGeometry('SRID=32140;POINT(954158.1 4215137.1)')
>>> qs = WorldBorder.objects.filter(mpoly__intersects=pnt)
>>>  print(qs.query) # Generating the SQL
  File "<console>", line 1
    print(qs.query) # Generating the SQL
    ^
IndentationError: unexpected indent
>>> print(qs.query) # Generating the SQL
SELECT "world_worldborder"."id", "world_worldborder"."name", "world_worldborder"."area", "world_worldborder"."pop2005", "world_worldborder"."fips", "world_worldborder"."iso2", "world_worldborder"."iso3", "world_worldborder"."un", "world_worldborder"."region", "world_worldborder"."subregion", "world_worldborder"."lon", "world_worldborder"."lat", "world_worldborder"."mpoly"::bytea FROM "world_worldborder" WHERE ST_Intersects("world_worldborder"."mpoly", ST_Transform(ST_GeomFromEWKB('\001\001\000\000 \214}\000\0003333\\\036-AfffFX\024PA'::bytea), 4326))

遅い幾何学¶
GeoDjangoは標準化されたテキスト表現でジオメトリをロードします。GeoDjangoはジオメトリフィールドが初めてアクセスされるとGEOSGeometryオブジェクトを作成し、 一般的な地理空間フォーマットのシリアル化プロパティなどの強力な機能を公開します。

>>> sm = WorldBorder.objects.get(name='San Marino')
>>> sm.mpoly
<MultiPolygon object at 0x24c6798>
>>> sm.mpoly.wkt # WKT
MULTIPOLYGON (((12.4157980000000006 43.9579540000000009, 12.4505540000000003 43.9797209999999978, ...
>>> sm.mpoly.wkb # WKB (as Python binary buffer)
<read-only buffer for 0x1fe2c70, size -1, offset 0 at 0x2564c40>
>>> sm.mpoly.geojson # GeoJSON
'{ "type": "MultiPolygon", "coordinates": [ [ [ [ 12.415798, 43.957954 ], [ 12.450554, 43.979721 ], ...
これには、GEOSライブラリによって提供される高度なジオメトリ操作すべてへのアクセスが含まれます。

>>> pnt = Point(12.4604, 43.9420)
>>> sm.mpoly.contains(pnt)
True
>>> pnt.contains(sm.mpoly)
False
地理的アノテーション¶
GeoDjangoには、距離や他のいくつかの操作（交差点、差分など）を計算するための地理的注釈のセットも用意されています。地理データベース関数のドキュメントを参照してください 。


地図上にデータを置く¶
地理的管理¶
GeoDjangoは、 ジオメトリフィールドの編集をサポートするDjangoの管理アプリケーションを拡張します。

Basics¶
GeoDjangoは、ユーザーがJavaScriptの滑らかなマップ（OpenLayersによって提供）でジオメトリを作成および変更できるようにすることで、Django管理者を補完します。

次のコードを使用してadmin.py、worldアプリケーション内部で呼び出され たファイルを作成します。

from django.contrib.gis import admin
from .models import WorldBorder

admin.site.register(WorldBorder, admin.GeoModelAdmin)
次に、あなたを編集するurls.pyにはgeodjango、次のようにアプリケーションフォルダ：

from django.contrib.gis import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
]
管理者ユーザーを作成する：

$ python manage.py createsuperuser
次に、Django開発サーバーを起動します。

$ python manage.py runserver
最後に、http://localhost:8000/admin/作成したユーザーを参照してログインします。任意のWorldBorderエントリを参照します。境界線は、ポリゴンをクリックして頂点を目的の位置にドラッグすることによって編集できます。

OSMGeoAdmin¶
を使用してOSMGeoAdmin、GeoDjangoは管理者のOpen Street Mapレイヤーを使用します。これは、GeoModelAdmin （OSGeoでホストされているベクターマップレベル0の WMSデータセットを使用する）よりも多くのコンテキスト（通りや道路の詳細を含む）を提供します。

PROJ.4データムシフトファイルをインストールする必要があります（詳細については、PROJ.4のインストール手順を参照してください）。

この要件を満たす場合OSMGeoAdmin は、admin.pyファイル内のオプションクラスを置き換えます。

admin.site.register(WorldBorder, admin.OSMGeoAdmin)

### Web表示


$ python manage.py ogrinspect world/data/TM_WORLD_BORDERS-0.3.shp WorldBorder --srid=4326 --mapping --multi
    # This is an auto-generated Django model module created by ogrinspect.
    from django.contrib.gis.db import models

    class WorldBorder(models.Model):
        fips = models.CharField(max_length=2)
        iso2 = models.CharField(max_length=2)
        iso3 = models.CharField(max_length=3)
        un = models.IntegerField()
        name = models.CharField(max_length=50)
        area = models.IntegerField()
        pop2005 = models.IntegerField()
        region = models.IntegerField()
        subregion = models.IntegerField()
        lon = models.FloatField()
        lat = models.FloatField()
        geom = models.MultiPolygonField(srid=4326)

    # Auto-generated `LayerMapping` dictionary for WorldBorder model
    worldborder_mapping = {
        'fips' : 'FIPS',
        'iso2' : 'ISO2',
        'iso3' : 'ISO3',
        'un' : 'UN',
        'name' : 'NAME',
        'area' : 'AREA',
        'pop2005' : 'POP2005',
        'region' : 'REGION',
        'subregion' : 'SUBREGION',
        'lon' : 'LON',
        'lat' : 'LAT',
        'geom' : 'MULTIPOLYGON',
    }

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
