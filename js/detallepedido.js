document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const pedidoIndex = params.get('pedido');
    const usuarioActual = localStorage.getItem('usuarioActual');
    const historialPedidos = JSON.parse(localStorage.getItem(`historial_${usuarioActual}`)) || [];
    const contenedorDetalle = document.getElementById('detallePedido');

    if (pedidoIndex !== null && historialPedidos[pedidoIndex]) {
        const pedido = historialPedidos[pedidoIndex];

        // Mostrar información del pedido
        const fechaElem = document.createElement('p');
        fechaElem.textContent = `Fecha del pedido: ${pedido.fecha}`;
        contenedorDetalle.append(fechaElem);

        // Mostrar el detalle completo de los ítems del pedido
        pedido.resumenPedidos.forEach((item, index) => {
            const itemElem = document.createElement('div');
            itemElem.classList.add('detalle-item');
            itemElem.innerHTML = `
                <p>${index + 1}. ${item.producto} - Cantidad: ${item.cantidad} (${item.umc}) - Total: $${item.totalPrecio.toFixed(2)}</p>
            `;
            contenedorDetalle.appendChild(itemElem);
        });

        // Mostrar el total del pedido
        const totalElem = document.createElement('p');
        const total = pedido.resumenPedidos.reduce((acc, item) => acc + (item.totalPrecio || 0), 0);
        totalElem.textContent = `Total del pedido: $${total.toFixed(2)}`;
        contenedorDetalle.append(totalElem);
    } else {
        contenedorDetalle.textContent = 'No se encontró el detalle del pedido.';
    }
});
