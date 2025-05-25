document.addEventListener('DOMContentLoaded', function () {
    const contenedor = document.querySelector('.productos');
    const productos = JSON.parse(localStorage.getItem('productos')) || [];

    const maxTotal = 4;
    const productosNuevos = productos.slice(-maxTotal).reverse(); // últimos nuevos

    // Insertar nuevos primero
    productosNuevos.forEach(producto => {
        const productoDiv = document.createElement('div');
        productoDiv.classList.add('producto');

        productoDiv.innerHTML = `
            <a href="#">
                <div class="prenda">
                    <img class="imageprenda" src="${producto.imagen}" alt="prenda">
                </div>
            </a>
            <div class="info_prenda">
                <a href="#"><h3>${producto.nombre}</h3></a>
                <div class="precio_prenda">
                    <p>${producto.precio} PEN</p>
                </div>
                <div class="precio_prenda">
                    <span>${producto.estado}</span>
                    <span>${producto.categoria}</span>
                    <span>${producto.genero}</span>              
                </div>   
                <div class="vendedor">
                    <span>${producto.vendedor}</span>     
                </div>
            </div>
            <div class="boton_prenda">
                <button class="boton_agregar">
                    <a class="text_boton_agregar" href="#">Lo quiero!</a>
                </button>
            </div>
        `;

        contenedor.prepend(productoDiv);
    });

    const productosRenderizados = contenedor.querySelectorAll('.producto');
    if (productosRenderizados.length > maxTotal) {
        const extras = productosRenderizados.length - maxTotal;
        for (let i = 0; i < extras; i++) {
            contenedor.lastElementChild.remove();
        }
    }
});