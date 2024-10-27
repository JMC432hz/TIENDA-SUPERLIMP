// Cargar usuarios desde el archivo JSON
fetch("usuarios.json")
    .then((resp) => resp.json())
    .then((data) => {
        nominaUsuarios = data.usuarios; // Accedemos al array de usuarios
    })
    .catch((error) => console.error('Error al cargar los usuarios:', error));

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const errorMsg = document.getElementById('error-msg');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Verificar si el usuario y la contraseña coinciden
        const usuarioEncontrado = nominaUsuarios.find(user => user.username === username && user.password === password);

        if (usuarioEncontrado) {
            errorMsg.textContent = '';
            localStorage.setItem('usuarioActual', username); // Guardar el usuario actual
            // Redirigir a la nueva página tienda.html
            window.location.href = './pages/tienda.html';
        } else {
            errorMsg.textContent = '';
            // Mostrar un SweetAlert si el usuario o la contraseña son incorrectos
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Usuario o contraseña incorrectos'
            });
        }
    });
});

