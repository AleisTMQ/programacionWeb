
# Create your views here.

from django.shortcuts import render, redirect
from .models import Paquete, Boleta
from django.contrib.auth.decorators import login_required

def listado_paquetes(request):
    paquetes = Paquete.objects.all()
    return render(request, 'core/listado_paquetes.html', {'paquetes': paquetes})

@login_required
def crear_paquete(request):
    if request.method == 'POST':
        nombre = request.POST['nombre']
        descripcion = request.POST['descripcion']
        precio = request.POST['precio']
        Paquete.objects.create(nombre=nombre, descripcion=descripcion, precio=precio)
        return redirect('listado_paquetes')
    return render(request, 'core/crear_paquete.html')

@login_required
def generar_boleta(request, paquete_id):
    paquete = Paquete.objects.get(id=paquete_id)
    Boleta.objects.create(usuario=request.user, paquete=paquete, total=paquete.precio)
    return redirect('listado_boletas')

@login_required
def listado_boletas(request):
    boletas = Boleta.objects.filter(usuario=request.user)
    return render(request, 'core/listado_boletas.html', {'boletas': boletas})

@login_required
def index(request):
    return render(request, 'core/index.html')