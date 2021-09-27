const CLAVE_LOCALSTORAGE = "lista_tareas";
document.addEventListener("DOMContentLoaded", () => {
	let tareas = []; // El arreglo global que vamos a manejar
	// Declaración de elementos del DOM
	const $contenedorTareas = document.querySelector("#contenedorTareas"),
		$btnGuardarTarea = document.querySelector("#btnAgregarTarea"),
		$inputNuevaTarea = document.querySelector("#inputNuevaTarea");

	// Escuchar clic del botón para agregar nueva tarea
	$btnGuardarTarea.onclick = () => {
		const tarea = $inputNuevaTarea.value;
		if (!tarea) {
			return;
		}
		tareas.push({
			tarea: tarea,
			terminada: false,
		});
		$inputNuevaTarea.value = "";
		guardarTareasEnAlmacenamiento();
		refrescarListaDeTareas();
	};

	const obtenerTareasDeAlmacenamiento = () => {
		const posibleLista = JSON.parse(localStorage.getItem(CLAVE_LOCALSTORAGE));
		if (posibleLista) {
			return posibleLista;
		} else {
			return [];
		}
	};

	const guardarTareasEnAlmacenamiento = () => {
		localStorage.setItem(CLAVE_LOCALSTORAGE, JSON.stringify(tareas));
	};

	// Definir función que refresca la lista de tareas a partir del arreglo global
	const refrescarListaDeTareas = () => {
		$contenedorTareas.innerHTML = "";
		for (const [indice, tarea] of tareas.entries()) {
			// Crear el enlace para eliminar la tarea
			const $enlaceParaEliminar = document.createElement("a");
			$enlaceParaEliminar.classList.add("enlace-eliminar");
			$enlaceParaEliminar.innerHTML = "&times;";
			$enlaceParaEliminar.href = "";
			$enlaceParaEliminar.onclick = (evento) => {
				evento.preventDefault();
				if (!confirm("¿Eliminar tarea?")) {
					return;
				}
				tareas.splice(indice, 1);
				// Guardar los cambios
				guardarTareasEnAlmacenamiento();
				refrescarListaDeTareas();
			};
			// El input para marcar la tarea como terminada
			const $checkbox = document.createElement("input");
			$checkbox.type = "checkbox";
			$checkbox.onchange = function () {
				// No es una función flecha porque quiero acceder al elemento a través de this
				if (this.checked) {
					tareas[indice].terminada = true;
				} else {
					tareas[indice].terminada = false;
				}
				guardarTareasEnAlmacenamiento();
				refrescarListaDeTareas();
			}

			// El span que llevará el contenido de la tarea
			const $span = document.createElement("span");
			$span.textContent = tarea.tarea;

			// Y finalmente el elemento de la lista
			const $td1 = document.createElement("td");
			const $td2 = document.createElement("td");
			const $td3 = document.createElement("td");

			const $tr = document.createElement("tr");

			// Verificamos si la tarea está marcada para marcar los elementos
			if (tarea.terminada) {
				$checkbox.checked = true;
				$span.classList.add("tachado");
			}

			$td1.appendChild($checkbox);
			$td2.appendChild($span);
			$td3.appendChild($enlaceParaEliminar);

			$tr.appendChild($td1)
			$tr.appendChild($td2)
			$tr.appendChild($td3)

			$contenedorTareas.appendChild($tr);
		}
	};
	// Llamar a la función la primera vez
	tareas = obtenerTareasDeAlmacenamiento();
	refrescarListaDeTareas();
});
