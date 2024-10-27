document.addEventListener('DOMContentLoaded', () => {
    const usuarioActual = localStorage.getItem('usuarioActual');
    const historialPedidos = JSON.parse(localStorage.getItem(`historial_${usuarioActual}`)) || [];
    const historialContenedor = document.getElementById('historialPedidos');
    const botonEstadisticas = document.getElementById('verEstadisticas');

    if (historialPedidos.length === 0) {
        historialContenedor.textContent = "No hay pedidos en su historial.";
    } else {
        historialPedidos.forEach((pedido, index) => {
            const pedidoElem = document.createElement('div');
            pedidoElem.classList.add('pedido-item');
            const totalCompra = pedido.resumenPedidos.reduce((acc, item) => acc + (item.totalPrecio || 0), 0);

            pedidoElem.innerHTML = `
                <h3>Pedido ${index + 1}</h3>
                <p>Fecha: ${pedido.fecha}</p>
                <p>Total de la compra: $${totalCompra.toFixed(2)}</p>
                <a href="detallepedido.html?pedido=${index}" class="ver-detalle-link">Ver detalle</a>
            `;

            historialContenedor.appendChild(pedidoElem);
        });
    }

    // Event listener para abrir la página de estadísticas
    botonEstadisticas.addEventListener('click', () => {
        window.open('estadisticas.html', '_blank');
    });
});
