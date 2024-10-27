// Cargar productos desde el archivo JSON
fetch("../json/data.json")
    .then((resp) => resp.json())
    .then((data) => {
        nominaProductos = data;
        mostrarCategorias();
        mostrarProductos(nominaProductos);
    })
    .catch((error) => console.error('Error al cargar los productos:', error));

let nominaProductos = [];
let resumenPedidos = [];

// Función para seleccionar producto y mostrar la imagen en el div
function seleccionarProducto(item, producto) {
    const listaItems = document.querySelectorAll('#nominadeproductos li');
    listaItems.forEach((li) => {
        li.classList.remove('producto-seleccionado');
    });
    item.classList.add('producto-seleccionado');

    const divImagenSeleccionada = document.getElementById('imagenseleccionada');
    divImagenSeleccionada.innerHTML = '';

    const imagen = document.createElement('img');
    imagen.src = producto.imagen;
    imagen.alt = producto.descripcion;
    imagen.classList.add('imagen-producto-seleccionado');

    divImagenSeleccionada.appendChild(imagen);
}

// Función para mostrar categorías
function mostrarCategorias() {
    const selectCategoria = document.getElementById('categoriaSelect');
    const categorias = [...new Set(nominaProductos.map(producto => producto.categoria))];

    const optionTodos = document.createElement('option');
    optionTodos.value = '';
    optionTodos.textContent = 'Todas las categorías';
    selectCategoria.append(optionTodos);

    categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria;
        option.textContent = categoria;
        selectCategoria.append(option);
    });

    selectCategoria.addEventListener('change', mostrarProductosFiltrados);
}

// Filtrado de productos por categoría seleccionada
function mostrarProductosFiltrados() {
    const categoriaSeleccionada = document.getElementById('categoriaSelect').value;
    const productosFiltrados = categoriaSeleccionada
        ? nominaProductos.filter(producto => producto.categoria === categoriaSeleccionada)
        : nominaProductos;
    mostrarProductos(productosFiltrados);
}

// Mostrar productos en el DOM
function mostrarProductos(productos) {
    const contenedor = document.getElementById('nominadeproductos');
    contenedor.innerHTML = '';
    const lista = document.createElement('ul');

    productos.forEach(producto => {
        const item = document.createElement('li');
        const contenido = `${producto.codigo} ${producto.descripcion} ${producto.presentacion} de ${producto.umc} Precio: $${producto.precioPorUmc.toFixed(2)}`;
        item.textContent = contenido;

        const contenedorBotones = document.createElement('div');
        contenedorBotones.classList.add('botonera');

        const btnAgregar = document.createElement('button');
        btnAgregar.textContent = 'Agregar';
        btnAgregar.classList.add('agregar');
        btnAgregar.addEventListener('click', () => modificarProducto(producto, producto.umc));

        const btnQuitar = document.createElement('button');
        btnQuitar.textContent = 'Quitar';
        btnQuitar.classList.add('quitar');
        btnQuitar.addEventListener('click', () => modificarProducto(producto, -producto.umc));

        // Evento para seleccionar el producto y mostrar imagen
        item.addEventListener('click', () => seleccionarProducto(item, producto));

        contenedorBotones.append(btnAgregar);
        contenedorBotones.append(btnQuitar);

        item.append(contenedorBotones);
        lista.append(item);
    });

    contenedor.append(lista);
}

// Filtrado de productos por búsqueda
function filtrarProductosPorBusqueda(event) {
    const palabraBusqueda = event.target.value.toLowerCase();
    const productosFiltrados = nominaProductos.filter(producto =>
        producto.descripcion.toLowerCase().includes(palabraBusqueda) ||
        producto.presentacion.toLowerCase().includes(palabraBusqueda)
    );
    mostrarProductos(productosFiltrados);
}

// Modificación de productos en el carrito
function modificarProducto(productoSeleccionado, cantidad) {
    const pedidoExistente = resumenPedidos.find(pedido => pedido.producto === productoSeleccionado.descripcion);

    if (pedidoExistente) {
        pedidoExistente.cantidad += cantidad;
        if (pedidoExistente.cantidad <= 0) {
            resumenPedidos = resumenPedidos.filter(pedido => pedido.producto !== productoSeleccionado.descripcion);
        } else {
            pedidoExistente.totalPrecio = (pedidoExistente.cantidad / productoSeleccionado.umc) * productoSeleccionado.precioPorUmc;
        }
    } else if (cantidad > 0) {
        const nuevoPedido = {
            producto: productoSeleccionado.descripcion,
            cantidad: cantidad,
            umc: productoSeleccionado.umc,
            totalPrecio: (cantidad / productoSeleccionado.umc) * productoSeleccionado.precioPorUmc,
            imagen: productoSeleccionado.imagen,
            categoria: productoSeleccionado.categoria
        };
        resumenPedidos.push(nuevoPedido);
    }

    localStorage.setItem('carrito', JSON.stringify(resumenPedidos));
    mostrarResumenPedidos();
}

// Cargar carrito desde localStorage
function cargarCarrito() {
    const carritoGuardado = localStorage.getItem('carrito');
    resumenPedidos = carritoGuardado ? JSON.parse(carritoGuardado) : [];
    mostrarResumenPedidos();
}

// Mostrar resumen del carrito
function mostrarResumenPedidos() {
    const resumenContenedor = document.getElementById('resumenPedidos');
    resumenContenedor.innerHTML = '';

    let precioFinal = 0;
    resumenPedidos.forEach((pedido, index) => {
        const pedidoElem = document.createElement('p');
        pedidoElem.textContent = `${index + 1}. ${pedido.producto}: ${pedido.cantidad} (${pedido.umc} por UMC) - Total: $${pedido.totalPrecio.toFixed(2)}`;
        resumenContenedor.append(pedidoElem);
        precioFinal += pedido.totalPrecio;
    });

    const precioFinalElem = document.createElement('p');
    precioFinalElem.textContent = `Total en su pedido: $${precioFinal.toFixed(2)}`;
    resumenContenedor.append(precioFinalElem);
}

// Evento de búsqueda
document.querySelector('.form-control.me-2').addEventListener('input', filtrarProductosPorBusqueda);

// Función para confirmar pedido
// (Se mantiene sin cambios el resto del código de confirmación y vaciado del carrito)

cargarCarrito();


// Función para confirmar pedido
document.getElementById('confirmarPedido').addEventListener('click', () => {
    if (resumenPedidos.length === 0) {
        Swal.fire({
            title: "No hay productos seleccionados",
            text: "Agregue productos al carrito antes de confirmar el pedido.",
            icon: "warning",
            showConfirmButton: false,
            timer: 2000
        });
    } else {
        Swal.fire({
            title: "¿Confirmar compra?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Confirmar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                const usuarioActual = localStorage.getItem('usuarioActual');
                const fechaActual = luxon.DateTime.now().toLocaleString(luxon.DateTime.DATETIME_SHORT);
                const pedidoConfirmado = {
                    fecha: fechaActual,
                    resumenPedidos: resumenPedidos
                };

                // Guardar la key pedidoConfirmado
                localStorage.setItem('pedidoConfirmado', JSON.stringify(pedidoConfirmado));

                Swal.fire({
                    title: "¡Pedido confirmado!",
                    text: "Redirigiendo al resumen de la compra...",
                    icon: "success",
                    timer: 4500,
                    showConfirmButton: false
                }).then(() => {
                    window.open('../pages/pedidoconfirmado.html', '_blank');
                    localStorage.removeItem('carrito'); // Limpiar el carrito después de confirmar
                    resumenPedidos = [];
                    mostrarResumenPedidos();
                });
            }
        });
    }
});


// Vaciar carrito
document.getElementById('vaciarCarrito').addEventListener('click', () => {
    if (resumenPedidos.length === 0) {
        Swal.fire({
            title: "Carrito vacío",
            text: "No hay productos en el carrito para vaciar.",
            icon: "info",
            showConfirmButton: false,
            timer: 2000
        });
    } else {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción vaciará todos los productos del carrito.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Vaciar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                resumenPedidos = [];
                localStorage.removeItem('carrito');
                mostrarResumenPedidos();
                Swal.fire({
                    title: "Carrito vaciado",
                    text: "Todos los productos han sido eliminados del carrito.",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 2000
                });
            }
        });
    }
});

cargarCarrito();
