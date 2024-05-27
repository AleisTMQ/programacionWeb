$(document).ready(function() {
    var defaultTrabajos = [
        {
            id: 1,
            img: "images/trabajo2.jpg", 
            title: "Titulo del Trabajo 1", 
            desc: "Breve descripción del trabajo realizado.",
            detalles: {
                diagnostico: "Cambio de aceite y filtros",
                mecanico: "Juan Pérez",
                fecha: "2021-07-16",
                materiales: ["Aceite motor 5W-40", "Filtro de aceite", "Filtro de aire"],
                galeria: ["images/trabajo2.jpg", "images/trabajo1.jpg", "images/trabajo3.jpg"]
            },
            keywords: ["aceite", "filtro"],
            categoria: "Autos",
            estado: "aceptado",
            comentarioRechazo: ""
        },
        {
            id: 2,
            img: "images/trabajo1.jpg", 
            title: "Titulo del Trabajo 2", 
            desc: "Breve descripción del trabajo realizado.",
            detalles: {
                diagnostico: "Cambio de aceite y filtros",
                mecanico: "Juan Pérez",
                fecha: "2021-07-16",
                materiales: ["Aceite motor 5W-40", "Filtro de aceite", "Filtro de aire"],
                galeria: ["images/trabajo1.jpg"]
            },
            keywords: ["aceite", "filtro"],
            categoria: "Motos"
        },
        {
            id: 3,
            img: "images/trabajo3.jpg", 
            title: "Titulo del Trabajo 3", 
            desc: "Breve descripción del trabajo realizado.",
            detalles: {
                diagnostico: "Cambio de aceite y filtros",
                mecanico: "Juan Pérez",
                fecha: "2021-07-16",
                materiales: ["Aceite motor 5W-40", "Filtro de aceite", "Filtro de aire"],
                galeria: ["images/trabajo3.jpg"]
            },
            keywords: ["aceite", "filtro"],
            categoria: "Autos"
        }
    ];

    var trabajosFromStorage = JSON.parse(localStorage.getItem('trabajos')) || [];
    var trabajos = mergeTrabajos(defaultTrabajos, trabajosFromStorage);
    var atenciones = JSON.parse(localStorage.getItem('atenciones')) || [];
    localStorage.setItem('trabajos', JSON.stringify(trabajos));

    function mergeTrabajos(defaults, fromStorage) {
        const merged = fromStorage.slice();  
        const storedIds = new Set(fromStorage.map(item => item.id));
        defaults.forEach(item => {
            if (!storedIds.has(item.id)) {
                merged.push(item); 
            }
        });
        return merged;
    }

    var trabajoId = new URLSearchParams(window.location.search).get('id');
    var trabajo = trabajos.find(t => t.id == trabajoId);

    populateCarousel(trabajos); 

    function populateCarousel(trabajos) {
        var $carouselInner = $('#puedeeee');
        $carouselInner.empty();
    
        trabajos.forEach(function(trabajo, index) {
            var itemClass = (index === 0) ? 'carousel-item active' : 'carousel-item';
            var itemContent = `<div class="${itemClass}">
                <img src="${trabajo.img}" class="d-block w-100" alt="${trabajo.title}">
                <div class="carousel-caption d-none d-md-block">
                    <h5>${trabajo.title}</h5>
                    <p>${trabajo.desc}</p>
                    <a href="detalle.html?id=${trabajo.id}" class="btn btn-primary">Ver Detalles</a>
                </div>
            </div>`;
            $carouselInner.append(itemContent);
        });
    }
     

    if (trabajo) {
        $('#workTitle').text(trabajo.title);
        $('#workDate').text(`Fecha: ${trabajo.detalles.fecha}`);
        $('#workDesc').text(trabajo.desc);
        $('#workMechanic').text(trabajo.detalles.mecanico);
        $('#workDiagnosis').text(trabajo.detalles.diagnostico);
        trabajo.detalles.materiales.forEach(material => {
            $('#workMaterials').append(`<li>${material}</li>`);
        });
        trabajo.detalles.galeria.forEach(img => {
            $('#workGallery').append(`<img src="${img}" class="img-fluid col-lg-4 col-md-6" alt="Work Image">`);
        });
    }

    $('#searchInput').on('input', function() {
        var searchTerm = $(this).val().toLowerCase();
        if (searchTerm.length < 3) {
            $('#searchResults').hide();
            return; 
        }
        
        var filteredResults = trabajos.filter(function(trabajo) {
            return (trabajo.detalles.mecanico && trabajo.detalles.mecanico.toLowerCase().includes(searchTerm)) ||
                   (trabajo.categoria && trabajo.categoria.toLowerCase().includes(searchTerm)) ||
                   (trabajo.keywords && trabajo.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm)));
        });

        $('#searchResults').empty();
        if (filteredResults.length > 0) {
            filteredResults.forEach(function(trabajo) {
                $('#searchResults').append(`<a href="detalle.html?id=${trabajo.id}" class="list-group-item list-group-item-action">${trabajo.title} - ${trabajo.detalles.mecanico}</a>`);
            });
            $('#searchResults').show();
        } else {
            $('#searchResults').hide();
        }
    });

    var usuarioLogueado = localStorage.getItem("usuario"); 
    var atencionesUserString = localStorage.getItem("countUser");
    var atencionesUser = parseInt(atencionesUserString, 10);
  
    actuNav()              

    function actuNav() {
    var atencionesUserString2 = localStorage.getItem("countUser");
    atencionesUser = parseInt(atencionesUserString2, 10);   

        if (usuarioLogueado) {
            $('.navbar-nav').html(`
                <li class="nav-item">
                <a class="nav-link" href="index.html">Inicio <span class="sr-only">(current)</span></a>
                </li>
                <li class="nav-item">
                <a class="nav-link" href="contact.html">Contacto</a>
                </li>
                <li class="nav-item">
                <a class="nav-link" href="agregar.html">Agregar atencion</a>
                </li>
                <li class="nav-item">
                <a class="nav-link" href="lista.html">Lista atenciones</a>
                </li>
                <li class="nav-item">
                <a class="nav-link" href="listaAutos.html">Lista de vehiculos</a>
                </li>
                <li class="nav-item"><a class="nav-link" href="#">${usuarioLogueado}</a></li>
                <li class="nav-item"><a class="nav-link" href="#">Atenciones: ${atencionesUser}</a></li>
                <li class="nav-item"><a class="nav-link" href="#" id="logoutButton">Cerrar Sesión</a></li>
            `);
        } else {
            $('.navbar-nav').html(`
                <li class="nav-item"><a class="nav-link" href="login.html">Iniciar Sesión</a></li>
                <li class="nav-item"><a class="nav-link" href="register.html">Registrarse</a></li>
            `);
        }
    }
    

    $('#logoutButton').click(function(e) {
        e.preventDefault();
        localStorage.removeItem("usuario");
        window.location.href = 'login.html';
    });

    $('#loginForm').on('submit', function(e) {
        e.preventDefault();
        var email = $('#email').val();
        var password = $('#password').val();
        localStorage.setItem("usuario", email); 
        localStorage.setItem("countUser", "6"); 
        window.location.href = 'index.html';
    });
    
    $('#registerForm').on('submit', function(e) {
        e.preventDefault();
        var name = $('#name').val();
        var email = $('#email').val();
        var password = $('#password').val();
        alert("Usuario registrado con éxito!");
        localStorage.setItem("usuario", email); 
        localStorage.setItem("countUser", "0"); 
        window.location.href = 'index.html'; 
    });
    
    $('#contactForm').on('submit', function(e) {
        e.preventDefault(); 
        
        $('#name').val('');
        $('#phone').val('');
        $('#comments').val('');
        
        alert('Gracias por contactarnos. Tu mensaje ha sido enviado.');
    });

    var atenciones = [];

    $('#addForm').on('submit', function(e) {
        e.preventDefault();
        var nuevaAtencion = { 
            id: atenciones.length + 1,
            img: "images/trabajo1.jpg", 
            title: $('#title').val(), 
            desc: $('#des').val(),
            detalles: {
                diagnostico: "Cambio de aceite y filtros",
                mecanico: $('#mec').val(),
                fecha: "2021-07-16",
                materiales: ["Aceite motor 5W-40", "Filtro de aceite", "Filtro de aire"],
                galeria: ["images/trabajo1.jpg", "images/trabajo2.jpg", "images/trabajo3.jpg"]
            },
            keywords: ["aceite", "filtro"],
            categoria: $('#cat').val(),
            estado: "esperando",
            comentarioRechazo: ""
        };
        atenciones.push(nuevaAtencion);
        actualizarCarruseles();
    });

    actualizarCarruseles();

    function actualizarCarruseles() {
        var waitingItems = atenciones.filter(item => item.estado === "esperando" || item.estado === "rechazado");
        var $carouselInner = $('#carouselItems');
        $carouselInner.empty();
    
        waitingItems.forEach(function(trabajo, index) {
            var itemClass = (index === 0) ? 'carousel-item active' : 'carousel-item';
            var buttonsHTML = '';
            var rejectionHTML = '';
    
            if (trabajo.estado === "rechazado") {
                rejectionHTML = `<p class="text-warning">Rechazado: ${trabajo.comentarioRechazo}</p>`;
            } else {
                buttonsHTML = `<a href="#" class="btn btn-success">Aceptar</a>
                               <a href="#" class="btn btn-danger">Rechazar</a>`;
            }
    
            var itemContent = $(`<div class="${itemClass}">
                <img src="${trabajo.img}" class="d-block w-100" alt="${trabajo.title}">
                <div class="carousel-caption d-none d-md-block">
                    <h5>${trabajo.title}</h5>
                    <p>${trabajo.desc}</p>
                    ${buttonsHTML}
                    ${rejectionHTML}
                </div>
            </div>`);
    
            if (trabajo.estado === "esperando") {
                itemContent.find('.btn-success').on('click', function() { aceptarAtencion(trabajo.id); });
                itemContent.find('.btn-danger').on('click', function() { rechazarAtencion(trabajo.id, prompt('Motivo de rechazo:')); });
            }
    
            $carouselInner.append(itemContent);
            localStorage.setItem('atenciones', JSON.stringify(atenciones));
            localStorage.setItem('countUser', JSON.stringify(atencionesUser + 1))
            actuNav()
        });
    }
    
    
    function aceptarAtencion(id) {
        var atencionIndex = atenciones.findIndex(item => item.id === id);
        if (atencionIndex > -1) {
            atenciones[atencionIndex].estado = 'aprobado';
            trabajos.push(atenciones[atencionIndex]);
            atenciones.splice(atencionIndex, 1);
            localStorage.setItem('trabajos', JSON.stringify(trabajos));
            localStorage.setItem('atenciones', JSON.stringify(atenciones));
            actualizarCarruseles();
        }
    }

    function rechazarAtencion(id, motivo) {
        var atencionIndex = atenciones.findIndex(item => item.id === id);
        if (atencionIndex > -1 && motivo) {
            atenciones[atencionIndex].estado = 'rechazado';
            atenciones[atencionIndex].comentarioRechazo = motivo;
            localStorage.setItem('atenciones', JSON.stringify(atenciones));
            actualizarCarruseles();
        }
    }

    function updateFiltersAndList() {
        let uniqueMechanics = [...new Set(trabajos.map(item => item.detalles.mecanico))];
        let uniqueCategories = [...new Set(trabajos.map(item => item.categoria))];

        $('#filterMechanic').empty().append('<option value="">Todos</option>');
        uniqueMechanics.forEach(mec => {
            $('#filterMechanic').append(`<option value="${mec}">${mec}</option>`);
        });

        $('#filterCategory').empty().append('<option value="">Todos</option>');
        uniqueCategories.forEach(cat => {
            $('#filterCategory').append(`<option value="${cat}">${cat}</option>`);
        });

        updateWorkList('');
    }

    function updateWorkList(filterType, filterValue) {
        let filteredWorks = trabajos.filter(function(item) {
            if (filterType === 'mechanic' && filterValue) {
                return item.detalles.mecanico === filterValue;
            } else if (filterType === 'category' && filterValue) {
                return item.categoria === filterValue;
            }
            return true;
        });

        $('#workList').empty();
        filteredWorks.forEach(function(work) {
            $('#workList').append(`<li class="list-group-item">${work.title} - ${work.desc}</li>`);
        });
    }

    $('#filterMechanic').on('change', function() {
        updateWorkList('mechanic', $(this).val());
    });

    $('#filterCategory').on('change', function() {
        updateWorkList('category', $(this).val());
    });

    actualizarCarruseles();
    updateFiltersAndList();
});
