function getAll(){
    var request = new XMLHttpRequest();
    request.open('GET', 'https://8000-arturomarquezl-extra-wsix6yuucgq.ws-us62.gitpod.io/productos/');
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('Accept', 'application/json');


    request.send();

    request.onload = () => {
        const  table   = document.getElementById("product_table");

        var tblBody = document.createElement("tbody");
        var tblHead = document.createElement("thead");
    
        tblHead.innerHTML = `
            <a href="post_cliente.html">
                <button>Agregar Producto</button>
            </a>
            <tr>            
                <th>ID_Producto</th>
                <th>Prodcuto</th>
                <th>Precio</th>
                <th>Existencia</th>
            </tr>`;
        // Almacena la respuesta en una variable, si es 202 es que se obtuvo correctamente
        const response = request.responseText;
        const json = JSON.parse(response);
        if (request.status === 401 || request.status === 403) {
            alert(json.detail);
        }
        else if (request.status == 200){
            const response = request.responseText;
            const json = JSON.parse(response);
            for (let i = 0; i < json.length; i++) {
                var tr = document.createElement('tr');
                var id_producto = document.createElement('td');
                var producto = document.createElement('td');
                var precio = document.createElement('td');
                var existencia = document.createElement('td');


                id_producto.innerHTML = json[i].id_producto;
                producto.innerHTML = json[i].producto;
                precio.innerHTML = json[i].precio;
                existencia.innerHTML = json[i].existencias;

                tr.appendChild(id_producto);
                tr.appendChild(producto);
                tr.appendChild(precio);
                tr.appendChild(existencia);


                
                tblBody.appendChild(tr);
            }
            table.appendChild(tblHead);
            table.appendChild(tblBody);
        }
    };
    
}

function postProducto(){


    let prodcuto = document.getElementById("Prodcuto");
    let precio = document.getElementById("Precio");
    let existencia = document.getElementById("Existencia");



        let payload = {
            "producto": prodcuto.value,
            "precio": precio.value,
            "existencias": existencia.value

        }

        var request = new XMLHttpRequest();
        request.open('POST', 'https://8000-arturomarquezl-extra-wsix6yuucgq.ws-us62.gitpod.io/productos/', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.setRequestHeader('Accept', 'application/json');

        request.onload = function() {
            const status = request.status;


            if (status === 200) {
                window.location.replace("index.html");
            }

        }

        request.send(JSON.stringify(payload));
    }

