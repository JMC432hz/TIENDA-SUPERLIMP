document.addEventListener("DOMContentLoaded", () => {
    const pedidoConfirmado = localStorage.getItem('pedidoConfirmado');
    const contenedor = document.getElementById('resumenPedidoConfirmado');
    const botonImprimir = document.getElementById('imprimirCotizacion');
    const botonConfirmar = document.getElementById('confirmarCompra');

    // Declarar datosPedido fuera del bloque `if` para hacerlo accesible
    let datosPedido = null;
    
    if (pedidoConfirmado) {
        datosPedido = JSON.parse(pedidoConfirmado);

        // Mostrar fecha del pedido
        const fechaElem = document.createElement('p');
        fechaElem.textContent = `Fecha de pedido: ${datosPedido.fecha}`;
        contenedor.append(fechaElem);

        // Iterar sobre cada producto del resumen de pedidos
        datosPedido.resumenPedidos.forEach((pedido, index) => {
            // Crear un contenedor para cada ítem de la compra
            const pedidoElem = document.createElement('div');
            pedidoElem.classList.add('item-pedido');

            // Añadir imagen del producto con validación simplificada
            const imagenElem = document.createElement('img');
            imagenElem.src = pedido.imagen ? pedido.imagen : '../img/default.jpg'; // Ruta a una imagen por defecto si no hay imagen
            imagenElem.alt = pedido.producto || 'Producto';
            imagenElem.classList.add('imagen-producto');

            // Información del producto
            const infoElem = document.createElement('p');
            infoElem.textContent = `${index + 1}. ${pedido.producto || 'Producto desconocido'} - Cantidad: ${pedido.cantidad || 0} (${pedido.umc || 'UMC desconocida'} por UMC) - Total: $${pedido.totalPrecio ? pedido.totalPrecio.toFixed(2) : '0.00'}`;

            // Añadir la imagen y la información al contenedor del pedido
            pedidoElem.append(imagenElem);
            pedidoElem.append(infoElem);
            contenedor.append(pedidoElem);
        });

        // Mostrar el total de la compra
        const totalElem = document.createElement('p');
        const total = datosPedido.resumenPedidos.reduce((acc, pedido) => acc + (pedido.totalPrecio || 0), 0);
        totalElem.textContent = `Total de la compra: $${total.toFixed(2)}`;
        contenedor.append(totalElem);
    } else {
        const mensajeError = document.createElement('p');
        mensajeError.textContent = 'No se encontró ningún pedido confirmado.';
        contenedor.append(mensajeError);
    }

    // Evento para imprimir la cotización
    botonImprimir.addEventListener('click', () => {
        window.print();
    });

    // Evento para confirmar la compra y guardar en el historial
    botonConfirmar.addEventListener('click', () => {
        if (datosPedido) {
            Swal.fire({
                icon: 'success',
                title: 'Compra Confirmada',
                text: 'Tu compra ha sido confirmada exitosamente.',
                showConfirmButton: false,
                timer: 2000
            }).then(() => {
                // Guardar en el historial de compras del usuario
                const usuarioActual = localStorage.getItem('usuarioActual');
                let historialCompras = JSON.parse(localStorage.getItem(`historial_${usuarioActual}`)) || [];
                historialCompras.push(datosPedido);
                localStorage.setItem(`historial_${usuarioActual}`, JSON.stringify(historialCompras));

                // Limpiar localStorage de la key `pedidoConfirmado`
                localStorage.removeItem('pedidoConfirmado');
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se encontró ningún pedido confirmado para registrar.',
                showConfirmButton: false,
                timer: 2000
            });
        }
    });
});
