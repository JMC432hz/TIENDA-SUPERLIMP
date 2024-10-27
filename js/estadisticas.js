document.addEventListener('DOMContentLoaded', () => {
    const usuarioActual = localStorage.getItem('usuarioActual');
    const historialPedidos = JSON.parse(localStorage.getItem(`historial_${usuarioActual}`)) || [];
    
    const productosSumatoria = {};
    const productosPorCategoria = {};
    const fechasPorProducto = {};

    // Recorrer cada pedido para sumar productos y registrar fechas
    historialPedidos.forEach(pedido => {
        pedido.resumenPedidos.forEach(item => {
            // Sumatoria de productos
            if (productosSumatoria[item.producto]) {
                productosSumatoria[item.producto] += item.cantidad;
                fechasPorProducto[item.producto].push(new Date(pedido.fecha));
            } else {
                productosSumatoria[item.producto] = item.cantidad;
                fechasPorProducto[item.producto] = [new Date(pedido.fecha)];
            }

            // Verificar si la categoría existe y es válida
            const categoria = item.categoria && item.categoria.trim() !== "" ? item.categoria : 'Sin Categoría';

            // Clasificación por categoría
            if (productosPorCategoria[categoria]) {
                productosPorCategoria[categoria] += item.cantidad;
            } else {
                productosPorCategoria[categoria] = item.cantidad;
            }
        });
    });

    // Convertir productosSumatoria a un arreglo y ordenar de mayor a menor
    const productosOrdenados = Object.entries(productosSumatoria)
        .sort(([, a], [, b]) => b - a); // Ordenar por cantidad (valor) de mayor a menor

    // Mostrar la sumatoria de productos ordenada
    const productosSumatoriaContenedor = document.getElementById('productos-sumatoria');
    productosOrdenados.forEach(([producto, cantidad]) => {
        const li = document.createElement('li');
        li.textContent = `${producto}: ${cantidad} unidades compradas`;
        productosSumatoriaContenedor.appendChild(li);
    });

    // Convertir productosPorCategoria a un arreglo y ordenar de mayor a menor
    const categoriasOrdenadas = Object.entries(productosPorCategoria)
        .sort(([, a], [, b]) => b - a); // Ordenar por cantidad (valor) de mayor a menor

    // Mostrar la cantidad de productos por categoría ordenada
    const productosCategoriaContenedor = document.getElementById('productos-categoria');
    categoriasOrdenadas.forEach(([categoria, cantidad]) => {
        const li = document.createElement('li');
        li.textContent = `${categoria}: ${cantidad} unidades compradas`;
        productosCategoriaContenedor.appendChild(li);
    });

    // Calcular y mostrar el promedio de consumo por producto
    const promedioContenedor = document.getElementById('promedio-productos');
    Object.entries(fechasPorProducto).forEach(([producto, fechas]) => {
        fechas.sort((a, b) => a - b); // Ordenar fechas de menor a mayor
        const primerFecha = fechas[0];
        const ultimaFecha = fechas[fechas.length - 1];
        const diasTranscurridos = (ultimaFecha - primerFecha) / (1000 * 60 * 60 * 24) || 1; // Diferencia en días, evita división por cero
        const promedio = (productosSumatoria[producto] / diasTranscurridos).toFixed(2);

        const li = document.createElement('li');
        li.textContent = `${producto}: ${promedio} unidades por día (desde ${primerFecha.toLocaleDateString()} hasta ${ultimaFecha.toLocaleDateString()})`;
        promedioContenedor.appendChild(li);
    });
});
