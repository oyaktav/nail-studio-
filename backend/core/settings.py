
"""
Django settings for NailStudio
Preparado para desenvolvimento local e hospedagem no Render.
"""

from pathlib import Path
import os
import dj_database_url

# ==========================================
# CAMINHOS
# ==========================================

BASE_DIR = Path(__file__).resolve().parent.parent


# ==========================================
# SEGURANÇA
# ==========================================

# Configure SECRET_KEY no Render.
# Para desenvolvimento local, use uma chave própria em variável de ambiente.
SECRET_KEY = os.environ.get(
    'SECRET_KEY',
    'django-insecure-local-dev-only-change-before-production'
)

DEBUG = os.environ.get('DEBUG', 'True').lower() == 'true'

ALLOWED_HOSTS = [
    host.strip()
    for host in os.environ.get(
        'ALLOWED_HOSTS',
        '127.0.0.1,localhost'
    ).split(',')
    if host.strip()
]

# Permite HTTPS através do proxy do Render
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# Proteção adicional quando estiver em produção
SESSION_COOKIE_SECURE = not DEBUG
CSRF_COOKIE_SECURE = not DEBUG


# ==========================================
# APLICATIVOS
# ==========================================

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'cloudinary_storage',
    'cloudinary',

    'rest_framework',
    'corsheaders',
    'api',
]


# ==========================================
# MIDDLEWARE
# ==========================================

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',

    'whitenoise.middleware.WhiteNoiseMiddleware',

    'corsheaders.middleware.CorsMiddleware',

    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


# ==========================================
# ROTAS E TEMPLATES
# ==========================================

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'


# ==========================================
# BANCO DE DADOS
# ==========================================

# No computador: SQLite
# No Render: PostgreSQL pela variável DATABASE_URL

DATABASES = {
    'default': dj_database_url.config(
        default=f'sqlite:///{BASE_DIR / "db.sqlite3"}',
        conn_max_age=600,
        conn_health_checks=True,
        ssl_require=bool(os.environ.get('DATABASE_URL')),
    )
}


# ==========================================
# VALIDAÇÃO DE SENHAS
# ==========================================

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# ==========================================
# IDIOMA E FUSO HORÁRIO
# ==========================================

LANGUAGE_CODE = 'pt-br'

TIME_ZONE = 'America/Sao_Paulo'

USE_I18N = True

USE_TZ = True


# ==========================================
# ARQUIVOS ESTÁTICOS
# ==========================================

STATIC_URL = '/static/'

STATIC_ROOT = BASE_DIR / 'staticfiles'

STORAGES = {
    'staticfiles': {
        'BACKEND': 'whitenoise.storage.CompressedManifestStaticFilesStorage',
    },
}


# ==========================================
# IMAGENS DO PORTFÓLIO
# ==========================================

MEDIA_URL = '/media/'

MEDIA_ROOT = BASE_DIR / 'media'
# Armazenamento de imagens no Cloudinary
CLOUDINARY_URL = os.environ.get('CLOUDINARY_URL')

if CLOUDINARY_URL:
    STORAGES['default'] = {
        'BACKEND': 'cloudinary_storage.storage.MediaCloudinaryStorage',
    }

# IMPORTANTE:
# No Render gratuito, os arquivos locais não são persistentes.
# Depois configuraremos um armazenamento externo para as imagens.


# ==========================================
# CORS - REACT E NETLIFY
# ==========================================

# Origens permitidas para acessar a API

CORS_ALLOWED_ORIGINS = [
    'http://localhost:5174',
    'http://127.0.0.1:5174',
]

# Adicione a URL exata da Netlify pela variável CORS_ALLOWED_ORIGINS
CORS_ALLOWED_ORIGINS += [
    origin.strip().rstrip('/')
    for origin in os.environ.get(
        'CORS_ALLOWED_ORIGINS', ''
    ).split(',')
    if origin.strip()
]

# Origens confiáveis para requisições CSRF
CSRF_TRUSTED_ORIGINS = [
    origin.strip().rstrip('/')
    for origin in os.environ.get(
        'CSRF_TRUSTED_ORIGINS', ''
    ).split(',')
    if origin.strip()
]
