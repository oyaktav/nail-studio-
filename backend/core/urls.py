from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls), # O admin fica apenas aqui!
    path('api/', include('api.urls')), # Isso chama o arquivo que editamos acima
]

# Configuração para as imagens aparecerem no Front-end
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)