# Toggle Sidebar Plugin v1.2

_Sidebar hace referencia a barras laterales, menús o listados que pueden variar su visualización (aparecer/ocultarse) dependiendo de un click_

-  Plugin para activar y desactivar sidebars
-  TODO EL CODIGO RELATIVO AL DISEÑO DEL SIDEBAR (posicion, animación, apariencia, etc) NO SE INCLUYE EN EL PLUGIN
-  By ChyBeat: https://www.github.com/chybeat (OKAY!!! como si no se estiviera leyendo desde mi enlace de github.... 🙄.....)

---

## POR HACER

1. UNA MEJOR PÁGINA DE MUESTRA, la que está no solo da pena, sino que no la entiendo ni yo! (🤣😉)
1. Intentar que al hacer el gesto de deslizar un lado (derecha por ejemlo) aparezca el sidebar (en mobiles unicamente, en desktop solo sería la muestra)
1. Metodos de la clase, hay uno que es mejor explicar bien! (addSidebar) 😉. Los otros son de uso interno pero no está de más explicar que hacen (die, init, getArrayNodes, closeSidebar, execute, openSidebar, sidebarBodyListener) (tanto en README.md como en la página)
1. Propiedades de la clase no está de más explicarlas tambien!

[https://chybeat.github.io/togglesidebar/](https://chybeat.github.io/togglesidebar/)

---

# Tabla de contenido

-  [Qué es esto? (finalidad y justificación)](#que-es-esto?)
-  [Modo de uso](#modo-de-uso)
-  [Configurar el plugin desde JavaScript](#configurar-desde-javascript)
-  [Attributos por HTML](#atributos-por-html)
-  [Acciones de cierre](#las-4-acciones-de-cierre)
-  [Algo de CSS](#algo-de-css)

---

# Que es esto?

En algunas páginas se requiere tener un sidebar parcial o totalmente oculto que depende de la funcionalidad y/o diseño de la página o del sidebar. Este plugin **SOLO** coloca o retira de la etiqueta `body`, en el atributo `class`, un texto o clase que puede ayudar a que esto se dé con CSS (que no se incluye en el plugin), pero que en esta documentación se muestra y explica.

### Finalidad

Quitar y poner en el atributo `class` de la etiqueta `body` un texto, pero que puede hacer "magia" dependiendo de **TU** código **CSS**.

### Justificación

En algunas ocasiones es necesario tener más de un sidebar o que tenga "funcionalidades" más allá de simplemente ocultarce al hacer click en el botón de cierre.

Este plugin realiza las dos cosas, [se cierra con hasta 4 acciones](#las-4-acciones-de-cierre) distintas y se pueden implementar varios sidebar facilmente que se cierran al abrir cualquier otro sidebar.

Adicionalmente, me sirvió para aprender un poco sobre clases de JavaScript (POO), como implementar 'event listeners' desde una clase de JavaScipt y como manejarlos.

### Nunca te muestra u oculta un contenedor al implementar el plugin?

Este plugin no está pensado visualmente, solo funcionalmente, es decir, para que visualmente haga algo, **hace falta escribir el código CSS**. Más adelante hay un [ejemplo del código CSS](#algo-de-css) que puede usarse.

### Adicionalmente...

1. El plugin se puede obtener con la version reducida (minificada) o la version de desarrollo con algunos comentarios. No es documentación.
1. Insisto en la "separación de responsabilidades" en varios apartados de este documento (y bromeo sobre ello) relativo a porque no escribí código para que el diseño se incluyera, pero existen varios factores a tener en cuenta para el diseño que son imposibles de agregar para una finalidad de "uso general" o implementación para cualquier proyecto sin dañar aspectos de diseño. El ejemplo más claro es el ancho del sidebar, que aunque se pueda realizar por medio de un standard de Ej: 300px, posiblemente sea o muy ancho o muy estrecho, sin contar que posiblemente se quiera a la derecha, abajo y que todos estos parametros son más faciles de arreglar desde CSS que modificar código CSS para que se adapte.
1. Muchas letras!!, lo sé. Espero ser claro en todo lo que se expresa, pero si pido disculpas por los textos tan largos y que probablemente puedan realizarse con mucho menos contenido.
1. Existe un archivo html con una muestra del plugin implementando 2 sidebars, por ahora solo es para exploración. Espero hacerla mejor. [https://chybeat.github.io/togglesidebar/](https://chybeat.github.io/togglesidebar/)

---

# MODO DE USO

### Inicialización (Código JavaScript)

A continuación verás un ejemplo de todo el código que debe escribirse para que el plugin comience a trabajar, más adelante se hara un ejemplo más completo con código CSS

1. Agregar el archivo del plugin en la etiqueta head del código HTML:

```html
<head>
	...
	<script type="text/javascript" src="path/to/toggleSidebar.min.js"></script>
</head>
```

2. Para inicializar el plugin se puede escribir el siguiente código:
   _(para el ejemplo iría antes del cierre de la etiqueta `body`)_

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

_Yo recomiendo inicializar el plugin inmediatamente se cargue todo el contenido HTML para este ejemplo 'DOMContentLoaded' es más quees suficiente... incluso es innecesario_

### HTML

Lo anterior inicializará los sidebar si existen unos [atributos "data-"](#atributos-por-html) relativos al plugin en en el código HTML. También se puede pasar un objeto con parametros al inicializar la clase ToggleSidebar [haciendo uso de javascript](#inicializar-desde-javascript).

### CSS

El plugin no afecta nada de diseño, no agrega estilos (atributo `style`) en nigún area o etiqueta, la funcionalidad se basa en que a la etiqueta `body` se le agregará una 'clase de activación' en su atributo `class`. Hay un ejemplo de como se puede implementar un sidebar que se deslice desde la derecha en la [seccion de CSS](#algo-de-css), pero ten en cuenta que este plugin **NO HACE MAS QUE AGREGAR UN TEXTO AL ATRIBUTO CLASS DE LA ETIQUETA `body`**

# Configurar desde Javascript

Desde javascript hay 2 métodos para agregar la funcionalidad del sidebar, el método simple rapido y llano, y el método largo llamando una de las funciones internas de la clase, este último es requerido si se quieren inicializar desde javascript 2 o más sidebar.

En cualquier caso se debe tener en cuenta las siguientes propiedades para el objeto que describirá cada sidebar:

| Propiedad              | Tipo                               | Descripción                                                               | Valor Predeterminado                                |
| ---------------------- | ---------------------------------- | ------------------------------------------------------------------------- | --------------------------------------------------- |
| `name`\*               | String                             | Un nombre para el side bar (no deben repetirse)                           | ToggleSidebar-196314654244 (el número es timestamp) |
| `activationClass`      | String                             | La clase que se agregará en `body` para activar el menú                   | NULL                                                |
| `autoClose`\*\*        | Bool                               | Especifica cierre al hacer click fuera del contenedor                     | FALSE                                               |
| `containerNode`        | NodeElement [^1]                   | Especifica el nodo contenedor de los elementos del sidebar                | NULL                                                |
| `closeSidebarNode`\*\* | NodeElement                        | Especifica el nodo que cerrará/ocultará el sidebar                        | NULL                                                |
| `omitCloseNode`\*\*\*  | NodeElement <br> String <br> Array | Especifica uno o más nodos que omitiran el cierre de uno o varios sidebar | NULL                                                |
| `openSidebarNode`      | NodeElement                        | Especifica el nodo que abrirá/mostrará el sidebar                         | NULL                                                |

\* Propiedades opcionales o no requeridas
\*\* Al no pasarse un nodo de cierre la propiedad `autoClose` pasa a ser `true` obligatoriamente
\*\*\* Un nodo pude utilizarse para omitir el cierre de uno o más sidebars, además de ser un elemeto opcional

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
		omitCloseNode: ["#omit-close-awesome-sb", ".add-to-wishlist"],
		openSidebarNode: document.getElementById("#show-awesome-info-icon"),
	});
});
```

#### Método largo (para 2 o más sidebars)

En el caso siguiente es muy importante aclarar 2 detalles

1. Si no se pasa un objeto en `sidebar = new ToggleSidebar()`, se debe agregar con la función addSidebar
2. Los sidebar deben tener un nombre distinto siempre
3. No es posible agrear un arreglo de objetos al inicializar el plugin para agregar varios sidebar ya que no es común utilizar más de un sidebar.

```js
window.addEventListener("DOMContentLoaded", (event) => {
	// agregar directamente al iniciar la clase
	const sidebar = new ToggleSidebar({
		name: "awesome-sidebar",
		activationClass: "activation-class-name",
		autoClose: true,
		closeSidebarNode: document.getElementById("#awesome-close-icon"),
		containerNode: document.getElementById("awesome-info"),
		omitCloseNode: ["#omit-close-any-sb", ".add-to-wishlist"],
		openSidebarNode: document.getElementById("#show-awesome-info-icon"),
	});

	//agregar otro sidebar utilizando la función addSidebar de la clase toggleSidebar
	sidebar.addSidebar({
		activationClass: "other-menu",
		closeSidebarNode: document.querySelector("#other-area .close-icon"),
		containerNode: document.getElementById("other-area"),
		omitCloseNode: ["#omit-close-any-sb"],
		openSidebarNode: document.getElementById("#show-other-info-icon"),
	});
});
```

# ATRIBUTOS POR HTML

Algunos de los atributos 'data-sidebar-\*' a continuación mostrados se leerán en todo el documento cuando la clase ToggleSidebar sea instanciada, de este modo si un sidebar y sus elementos existen desde el código HTML serán incluidos en la funcionalidad que ofrece el plugin.

### Contenedor (requerido)

El contenedor que contiene los elementos del sidebar requiere los siguientes atributos:

| Atributos                     | Valor   | Descripción                                                     |
| ----------------------------- | ------- | --------------------------------------------------------------- |
| `data-sidebar`                | string  | Nombre para el sidebar (semi opcional[^2])                      |
| `data-sidebar-container`\*    | boolean | Especifica que es el nodo contenedor del sidebar                |
| `data-sidebar-activate-class` | string  | La clase que se agregará en `body` para activar el menú         |
| `data-sidebar-auto-close`\*   | boolean | Opcional. Especifica cierre al hacer click fuera del contenedor |

\* Los valores admitidos que son booleanos debe escribirse entre comillas dobles

#### Ejemplo:

```html
<div
	class="page-menu"
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

| Atributos             | Valor  | Descripción                                                                        |
| --------------------- | ------ | ---------------------------------------------------------------------------------- |
| `data-sidebar`        | string | Nombre del sidebar que activará\*                                                  |
| `data-sidebar-action` | "open" | Obligatorio escribirlo como se muestra ya que especifica la acción de ese elemento |

\* el nombre en `data-sidebar` debe coincidir con el que tiene el contenedor que pretende mostrar el elemento

#### Ejemplo:

```html
<i class="menu-icon" data-sidebar="mobile-main-menu" data-sidebar-action="open">
	...
</i>
```

### Elemento de cierre (opcional)

Este es el elemento que cerrará el sidebar, si no se pasa ningun elemento o alguno válido, el sidebar se forzará para que cierre automáticamente al hacer click por fuera del nodo contenedor o al hacer click en el elemento o nodo que lo activa.

| Atributos             | Valor   | Descripción                                                                        |
| --------------------- | ------- | ---------------------------------------------------------------------------------- |
| `data-sidebar`\*      | string  | El nombre del sidebar que cierra el elementos                                      |
| `data-sidebar-action` | "close" | Obligatorio escribirlo como se muestra ya que especifica la acción de ese elemento |

\* el nombre en `data-sidebar` debe coincidir con el que tiene el contenedor que pretende cerrar el elemento

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

### Elemento para omisión de cierre (opcional)

Este elemento esté dentro o fuera del sidebar permitirá que el mismo permanezca abierto. Esto es útil en algunos casos, como cuando se quieren agregar elementos a una lista o a un carrito de compras y no se quiera que se oculte el sidebar o se cierre y se abra inmediatamente al hacer click en el elemento que agrega lo agrega.

| Atributos             | Valor        | Descripción                                                                  |
| --------------------- | ------------ | ---------------------------------------------------------------------------- |
| `data-sidebar-omit`   | string       | El nombre o nombres\* del sidebar al que se pretende omitir el cierre        |
| `data-sidebar-action` | "omit-close" | Obligatorio escribirlo como se muestra. Especifica la acción de ese elemento |

\* Si un elemento pretende no cerrar varios sidebar los nombres deben ir separados por coma y sin espacios como se muestra a continuación

#### Ejemplo:

```html
<i
	class="icon-show-all-sidebars"
	data-sidebar="mobile-main-menu,shopping-cart"
	data-sidebar-action="omit-close"
>
	...
</i>
```

# Las 4 acciones de cierre

Un sidebar puede cerrarse con 4 acciones máximo, estas son:

1. Click en el elemento o icono de apertura.
2. Click en el elemento o icono de cierre.
3. Click fuera del contenedor.
4. Click en un enlace dentro del contenedor

Pero depende... :

1. Si **no se especifica el cierre automático** del sidebar no lo hará cuando se haga click fuera del contenedor del sidebar. El cierre se especifica cuando:
   <ol type="a">
   	<li>Desde el objeto en JavaScript se pasa `autoClose: false`</li>
   	<li>Al elemento HTML se le coloca el atributo data-sidebar-auto-close="false"</li>
   	<li>la ausencia total del atributo</li>
   </ol>
   Lo anterior fuerza a que no se cierre el sidebar.<br>

   **A menos que....**

1. Si no se **especifica un elemento HTML de cierre** (distinto a especificar el cierre automático) en el objeto de javaScript o si en el código HTML no existe un elemento con el atributo `data-sidebar-action="close"`, se forzará que cierre el sidebar al hacer click fuera del contenedor.

En general máximo son 4 y mínimo son 3, la variable es el click fuera del contenedor del sidebar

# Algo de CSS

Debo aclarar que no ví viable colocar elementos de diseño en el plugin debido a la separación de funcionalidades (y el factor pereza???🤔😔), y ya que el plugin se debe ejecutar luego de cargar los elementos de la página (`window.addEventListener("DOMContentLoaded", () => {...})`) podría demorar demasiado en comenzar a mostrarse un sidebar o que se vean y desaparezcan elementos mientras se termina de cargar la página (como los sidebar 'saltando' para ocultarse).

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
body:is(.activation-class-name) #awesome-sidebar-container {
	display: block;
}
```

### CSS algo más 'cool'

Si queremos un sidebar que se oculte 100% y se 'deslice' desde la derecha este sería el código CSS:

```css
/* Ajuste y visualización del sidebar */
.sidebar-container {
	background-color: darkgrey;
	height: 100dvh;
	padding: 2.5em;
	position: fixed;
	top: 0;
	transition-duration: 0.3s;
	transition-property: transform;
	transition-timing-function: cubic-bezier(0.22, 0.61, 0.36, 1);
	transform: translate(calc(min(25vw, 90%) * -1), 0);
	width: min(25em, 90%);
	z-index: 1;
}

/* aparece el sidebar que por JS se le pasa la clase "activation-class-name" */
body:is(.activation-class-name) #awesome-sidebar-container {
	right: 0;
	transform: translate(0, 0);
}

/* Si existe otro container que en el opbjeto JS se le pasa la clase "other-menu"... */
body:is(.other-menu) #other-area {
	right: 0%;
	transform: translate(min(25vw, 90%), 0);
}
```

Esto no hará mas que mostrar y ocultar el contenedor de los elementos del sidebar en el lado derecho de la pantalla,
es el punto de inicio para generar un side bar totalmente personalizable, ya que la idea del plugin
no es realizar cambios de diseño, solo la funcionalidad (o pereza de hacerlo con diseño). Como tal creo que el diseño (incluye la animación) debe separarse por completo de la funcionalidad y la maquetación.

[^1]: Un **nodeElement** es un objeto que se obtiene con `document.getElementById()` ó `document.querySelector()`, se debe tener en cuenta que no es un elemento válido si se pasa un arreglo como sucede con `document.getElementsByClassName()` ó `document.querySelectorAll()`
[^2]: En caso de no especificarse un nombre al sidebar, por consola se mostrará una advertencia, y se usará un nombre con el nombre de la clase y el timestamp. (Ej: ToggleSidebar-1678469775422)
