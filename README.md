# Toggle Sidebar Plugin v1.1

_Sidebar hace referencia a barras laterales, menús o listados que pueden variar su visualización (aparecer/ocultarse) dependiendo de un click_

-  TODO EL CODIGO RELATIVO AL DISEÑO DEL SIDEBAR (posicion, animación, apariencia, etc) NO SE INCLUYE EN EL PLUGIN
-  Plugin para activar y desactivar sidebars
-  By ChyBeat: https://www.github.com/chybeat (como si no se estiviera lenedo desde github 🙄.....)

---

## Que es esto?

En algunas páginas se requiere tener un sidebar parcial o totalmente oculto que depende de la funcionalidad y/o diseño de la página o del sidebar. Este plugin **SOLO** coloca o retira de la etiqueta `body`, en el atributo `class`, un texto o clase que puede ayudar a que esto se dé con un CSS que no se incluye en el plugin, pero que en esta documentación se muestra y explica.

### Finalidad

Quitar y poner en el atributo `class` de la etiqueta `body` un texto, pero que puede hacer "magia" dependiendo de TU código CSS.

### Justificación

En algunas ocasiones es necesario tener más de un sidebar o que tenga "funcionalidades" más allá de simplemente ocultarce al hacer click en el botón de cierre.

Este plugin realiza las dos cosas, se cierra con hasta 4 acciones distintas y se pueden implementar varios sidebar facilmente que se cierran al abrir cualquier otro sidebar.

Adicionalmente, me sirvió para apder un poco sobre clases de Javascript, como implementar 'event listeners' desde una clase de Javascipt y como manejarlos.

### Nunca muestra u oculta un contenedor al implementar el plugin

Este plugin no está pensado visualmente, solo funcionalmente, es decir, para que visualmente haga algo, **hace falta escribir el código CSS**. Más adelante hay un [ejemplo del código CSS](#algo-de-css) que puede usarse.

---

## USO

### Inicialización (Javascript)

1. Agregar el archivo del plugin en la etiqueta head:

```html
<head>
	...
	<script type="text/javascript" src="path/to/toggleSidebar.js"></script>
</head>
```

2. Para inicializar el plugin se debe escribir el siguiente código:
   _(para el ejemplo iría antyes del cierre de la etiqueta `body`)_

```HTML
...
	<script>
		window.addEventListener("DOMContentLoaded", (event) => {
			const sidebar = new ToggleSidebar();
		});
	</script>
</body>
</html>
```

### HTML

Lo anterior inicializará los sidebar tomando los atributos "data-" relativos al plugin presentes en [etiquetas HTML](#atributos-por-html), también se puede pasar un objeto con parametros al inicializar la clase ToggleSidebar [haciendo uso de javascript](#javascript).

### CSS

El plugin no afecta nada de diseño, no agrega estilos en nigún area o etiqueta (atributo `style`), para que sea funcional hay que tener en cuenta que la etiqueta `body` avergará una 'clase de activación' en el atributo `class`. Hay un ejemplo de como se puede implementar un sidebar que se deslice desde la derecha en la [seccion de CSS](#algo-de-css), pero ten en cuenta que este plugin **NO HACE MAS QUE AGREGAR UN TEXTO AL ATRIBUTO CLASS DE LA ETIQUETA `body`**

# Javascript

Desde javascript hay 2 métodos para agregar la funcionalidad del sidebar el método simple rapido y llano, y el método largo llamando las funciones internas de la clase, este último es requerido si se quieren inicializar desde javascript 2 o más sidebar.

En cualquier caso se debe tener en cuenta las siguientes propiedades para el objeto que describirá cada sidebar:

| Propiedad              | Tipo             | Descripción                                                | Valor Predeterminado                                |
| ---------------------- | ---------------- | ---------------------------------------------------------- | --------------------------------------------------- |
| `name`\*               | String           | Un nombre para el side bar (no deben repetirse)            | ToggleSidebar-196314654244 (el número es timestamp) |
| `activationClass`      | String           | La clase que se agregará en `body` para activar el menú    | NULL                                                |
| `autoClose`\*\*        | Bool             | Especifica cierre al hacer click fuera del contenedor      | FALSE                                               |
| `containerNode`        | NodeElement [^1] | Especifica el nodo contenedor de los elementos del sidebar | NULL                                                |
| `closeSidebarNode`\*\* | NodeElement [^1] | Especifica el nodo que cerrará/ocultará el sidebar         | NULL                                                |
| `openSidebarNode`      | NodeElement [^1] | Especifica el nodo que abrirá/mostrará el sidebar          | NULL                                                |

\* Propiedades opcionales o no requeridas

\*\* Al no pasarse un nodo de cierre la propiedad `autoClose` pasa a ser `true` obligatoriamente

#### Método simple rápido y llano (para solo un side bar)

Se pasa un objeto a la clase con las propiedades requeridas.

```js
window.addEventListener("DOMContentLoaded", (event) => {
	const sidebar = new ToggleSidebar({
		name: "awesome-sidebar",
		activationClass: "activation-class-name",
		autoClose: false,
		closeSidebarNode: document.getElementById("#awesome-close-icon"),
		containerNode: document.getElementById("awesome-info"),
		openSidebarNode: document.getElementById("#show-awesome-info-icon"),
	});
});
```

#### Método largo (para 2 o más sidebars)

En el caso siguiente es muy importante aclarar 2 detalles

1. Si no se pasa un objeto en `sidebar = new ToggleSidebar()`, se debe agregar con la función addSidebar
2. Los sidebar deben tener un nombre distinto siempre

```js
window.addEventListener("DOMContentLoaded", (event) => {
	// agregar directamente al iniciar la clase
	const sidebar = new ToggleSidebar({
		name: "awesome-sidebar",
		activationClass: "activation-class-name",
		autoClose: false,
		closeSidebarNode: document.getElementById("#awesome-close-icon"),
		containerNode: document.getElementById("awesome-info"),
		openSidebarNode: document.getElementById("#show-awesome-info-icon"),
	});

	//agregar utilizando la función addSidebar de la clase toggleSidebar
	sidebar.addSidebar({
		activationClass: "other-menu",
		autoClose: true,
		closeSidebarNode: document.querySelector("#other-area .close-icon"),
		containerNode: document.getElementById("other-area"),
		openSidebarNode: document.getElementById("#show-other-info-icon"),
	});
});
```

# ATRIBUTOS POR HTML

### Contenedor (requerido)

El contenedor que contiene los elementos del sidebar requiere los siguientes atributos:

| Atributos                                  | Descripción                                                     |
| ------------------------------------------ | --------------------------------------------------------------- |
| `data-sidebar="sidebar-name"`              | Nombre para el sidebar [^2]                                     |
| `data-sidebar-container="true"`            | Especifica que es el nodo contenedor del sidebar                |
| `data-sidebar-activate-class="class-name"` | La clase que se agregará en `body` para activar el menú         |
| `data-sidebar-auto-close="true"`           | Opcional. Especifica cierre al hacer click fuera del contenedor |

#### Ejemplo:

```html
<div
	class="sidebar-container"
	id="menu-sidebar"
	data-sidebar="mobile-main-menu"
	data-sidebar-container="true"
	data-sidebar-activate-class="show-options-menu"
	data-sidebar-auto-close="false"
>
...
</aside>
```

### Elemento de apertura (requerido)

Es el elemento o nodo que activa el sidebar. Requiere de los siguientes atributos:

| Atributos                      | Descripción                                                                  |
| ------------------------------ | ---------------------------------------------------------------------------- |
| ` data-sidebar="sidebar-name"` | Nombre para del sidebar que activará                                         |
| `data-sidebar-action="open"`   | Obligatorio escribirlo como se muestra. Especifica la acción de ese elemento |

#### Ejemplo:

```html
<i
	class="menu-sidebar-opener menu-icon"
	data-sidebar="mobile-main-menu"
	data-sidebar-action="open"
>
	...
</i>
```

### Elemento de cierre (opcional)

Este es el elemento que cerrará el sidebar, si no se pasa ningun elemento o alguno válido, el sidebar se forzará para que cierre automáticamente al hacer click por fuera del nodo contenedor o al hacer click en el elemento o nodo que lo activa.

| Atributos                     | Descripción                                                                  |
| ----------------------------- | ---------------------------------------------------------------------------- |
| `data-sidebar="main-menu"`    | El nombre del sidebar que cierra el nodo                                     |
| `data-sidebar-action="close"` | Obligatorio escribirlo como se muestra. Especifica la acción de ese elemento |

#### Ejemplo:

```html
<i
	class="icon-close"
	data-sidebar="mobile-main-menu"
	data-sidebar-action="close"
>
	...
</i>
```

### ¿Y... qué hay de esas 4 acciones cierre?

Un sidebar puede cerrarse con 4 acciones máximo, estas son:

1. Click en el nodo o icono de apertura.
2. Click en el nodo de cierre.
3. Click fuera del contenedor.
4. Click en un enlace dentro del contenedor

Pero depende... :

1. Si desde JS se pasa la propiedad `autoClose: false`, en HTML se coloca el atributo `data-sidebar-auto-close="false" ` o la ausencia total del atributo o propiedad, no cerrará el sidebar cuando se haga click fuera del contenedor del sidebar. A menos que....
2. Si no se coloca desde JS un nodo de cierre, o en HTML no se especifica el atributo `data-sidebar-action="close"` en algún nodo, se forzará que cierre el sidebar al hacer click fuera del contenedor.

# Algo de CSS

Debo aclarar que no ví viable colocar elementos de diseño en el plugin debido a la separación de funcionalidades, adicionalmente, como buena práctica, el plugin se debe ejecutar luego de cargar los elementos de la página (`window.addEventListener("DOMContentLoaded", () => {...})`) y por varios factores puede demorar demasiado en hacerlo, esto haría que se vean y desaparezcan elementos mientras se termina de cargar la página.

El siguiente código es una muestra de cómo se puede manejar el código CSS de forma fácil y extremandamente sencilla para que la funcionalidad del plugin tenga su parte visual. Lee los comentarios para enterarte de algunos detalles

### CSS muy sencillo

Sencillo, es demasiado, pero funcional

```css
/* LO MAS FACIL Y SENCILLO PERO PARA NADA COOL*/
/* contenedor del sidebar*/
#awesome-sidebar-container {
	display: none;
}

/*
'activation-class-name' es la clase que se pasa en la
propiedad 'activationClass' en el objeto de javascript
*/
body:is(.activation-class-name) {
	#awesome-sidebar-container {
		display: block;
	}
}
```

### CSS algo más 'cool'

Si queremos un sidebar que se oculte 100% y se 'deslice' desde la derecha este sería el código CSS:

```css
/* Ajuste y visualización del sidebar */
.sidebar-container {
	height: 100vh;
	max-width: 25em;
	padding: 2.5em;
	position: absolute;
	right: -100%;
	top: 0;
	width: 100%;
	z-index: 3;
	transition-property: right;
	transition-timing-function: ease-out;
	transition-duration: 0.2s;
}

/* aparece el sidebar que por JS se le pasa la clase "activation-class-name" */
body:is(.activation-class-name) {
	#awesome-sidebar-container {
		right: 0%;
	}
}

/* Si existe otro container que en el opbjeto JS se le pasa la clase "other-menu"... */
body:is(.other-menu) {
	#other-area {
		right: 0%;
	}
}
```

Esto no hará mas que mostrar y ocultar el contenedor de los elementos del sidebar,
es el punto de inicio para generar un side bar totalmente personalizable, ya que la idea del plugin
no es realizar cambios de diseño, solo la funcionalidad. Como tal creo que el diseño (incluye la animación) debe separarse por completo de la funcionalidad y la maquetación.

[^1]: Un **nodeElement** es un objeto que se obtiene con `document.getElementById()` ó `document.querySelector()`, se debe tener en cuenta que no es un elemento válido si se pasa un arreglo como sucede con `document.getElementsByClassName()` ó `document.querySelectorAll()`
[^2]: En caso de no especificarse un nombre al sidebar, por consola se mostrará una advertencia, y se usará un nombre con el nombre de la clase y el timestamp. (Ej: ToggleSidebar-1678469775422)
