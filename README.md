# Toggle Sidebar Plugin v1.2

_Sidebar hace referencia a barras laterales, menús o listados que pueden variar su visualización (aparecer/ocultarse) dependiendo de un clic_

-  Plugin para activar y desactivar sidebars
-  TODO EL CODIGO RELATIVO AL DISEÑO DEL SIDEBAR (posicion, animación, apariencia, etc) NO SE INCLUYE EN EL PLUGIN
-  By ChyBeat: https://www.github.com/chybeat (OKAY!!! como si no se estivieras leyendo desde mi enlace de github.... 🙄.....)
-  Demo: [https://chybeat.github.io/togglesidebar/](https://chybeat.github.io/togglesidebar/)

## POR HACER

1. UNA MEJOR PÁGINA DE MUESTRA, la que está da pena, es incomoda visualmente y no la entiendo ni yo! (🤣😉)
1. Intentar que al hacer el gesto de deslizar un lado (derecha por ejemplo) aparezca el sidebar (en mobiles unicamente, en desktop no debería existir, aunque hay ideas al respecto)

[https://chybeat.github.io/togglesidebar/](https://chybeat.github.io/togglesidebar/)

---

# Tabla de contenido

-  [Qué es esto? (finalidad y justificación)](#que-es-esto?)
-  [Modo de uso](#modo-de-uso)
-  [Configurar el plugin desde JavaScript](#configurar-desde-javascript)
-  [Attributos por HTML](#atributos-por-html)
-  [Acciones de cierre](#las-4-acciones-de-cierre)
-  [Algo de CSS](#algo-de-css)
-  [Métodos y propiedades de la clase](#métodos-y-propiedades-de-la-clase)

---

# Que es esto?

En algunas páginas se requiere tener un sidebar parcial o totalmente oculto que depende de la funcionalidad y/o diseño de la página o del sidebar. Este plugin **SOLO** coloca o retira de la etiqueta `body`, en el atributo `class`, un texto o clase que puede ayudar a que esto se dé con CSS (que no se incluye en el plugin), pero que en esta [documentación](#algo-de-css) se muestra y explica.

### Finalidad

Quitar y poner en el atributo `class` de la etiqueta `body` un texto, pero que puede hacer "magia" dependiendo de **TU** código **CSS**.

### Justificación

En algunas ocasiones es necesario tener más de un sidebar o que tenga "funcionalidades" más allá de simplemente ocultarce al hacer clic en el botón de cierre.

Este plugin realiza las dos cosas, [se cierra con hasta 4 acciones](#las-4-acciones-de-cierre) distintas y se pueden implementar varios sidebar facilmente que se cierran al abrir cualquier otro sidebar.

Adicionalmente, me sirvió para aprender un poco sobre clases de JavaScript (POO), como implementar 'event listeners' desde una clase de JavaScipt y como manejarlos.

### Nunca te muestra u oculta un contenedor al implementar el plugin?

Este plugin no está pensado visualmente, solo funcionalmente, es decir, para que visualmente haga algo, **hace falta escribir el código CSS**. Más adelante hay un [ejemplo del código CSS](#algo-de-css) que puede usarse.

### Adicionalmente...

1. El plugin se puede obtener con la version reducida (minificada) o la version de desarrollo con algunos comentarios. No es documentación.
1. Insisto en la "separación de responsabilidades" en varios apartados de este documento (y bromeo sobre ello) relativo a porque no escribí código para que el diseño se incluyera, pero existen varios factores a tener en cuenta para el diseño que son imposibles de agregar para una finalidad de "uso general" o implementación para cualquier proyecto sin dañar aspectos de diseño. El ejemplo más claro es el ancho del sidebar, que aunque se pueda realizar por medio de un standard de Ej: 300px, posiblemente sea o muy ancho o muy estrecho, sin contar que posiblemente se quiera a la derecha, abajo y que todos estos parametros son más faciles de arreglar desde CSS que modificar código del plugin para que se adapte.
1. Muchas letras!!, lo sé. Espero ser claro en todo lo que se expresa, pero si pido disculpas por los textos tan largos y que probablemente puedan realizarse más cortos.
1. Existe un archivo html con una muestra del plugin implementando 2 sidebars, por ahora solo es para exploración. Espero hacerla mejor. Pudes ver una muestra en [https://chybeat.github.io/togglesidebar/](https://chybeat.github.io/togglesidebar/)

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

_Yo recomiendo inicializar el plugin inmediatamente se cargue todo el contenido HTML para este ejemplo 'DOMContentLoaded' es más que suficiente... incluso es innecesario._

### HTML

Lo anterior inicializará los sidebar si existen unos [atributos "data-"](#atributos-por-html) relativos al plugin en en el código HTML. También se puede pasar un objeto con parametros al inicializar la clase ToggleSidebar [haciendo uso de javascript](#inicializar-desde-javascript).

### CSS

El plugin no afecta nada de diseño, no agrega estilos (atributo `style`) en nigún area o etiqueta, la funcionalidad se basa en que a la etiqueta `body` se le agregará una 'clase de activación' en su atributo `class`. Hay un ejemplo de como se puede implementar un sidebar que se deslice desde la derecha en la [seccion de CSS](#algo-de-css), pero ten en cuenta que este plugin **NO HACE MAS QUE AGREGAR UN TEXTO AL ATRIBUTO CLASS DE LA ETIQUETA `body`**

# Configurar desde Javascript

Desde javascript hay 2 formas para agregar la funcionalidad del sidebar, la forma simple rapida y llana, y la forma larga llamando una de las funciones internas de la clase, este último es requerido si se quieren inicializar desde javascript 2 o más sidebar.

En cualquier caso se debe tener en cuenta las siguientes propiedades para un objeto que describirá cada sidebar y que se debe pasar al plugin:

| Propiedad              | Tipo                                    | Descripción                                                                  | Valor Predeterminado                                |
| ---------------------- | --------------------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------- |
| `name`\*               | String                                  | Un nombre para el side bar (no deben repetirse)                              | ToggleSidebar-196314654244 (el número es timestamp) |
| `activationClass`      | String                                  | La clase que se agregará en `body` para activar el menú                      | NULL                                                |
| `autoClose`\*\*        | Bool                                    | Especifica el cierre del sidebar al hacer clic fuera de su contenedor        | FALSE                                               |
| `containerNode`        | NodeElement [^1] <br> String <br> Array | Especifica el nodo contenedor del sidebar                                    | NULL                                                |
| `closeSidebarNode`\*\* | NodeElement <br> String <br> Array      | Especifica uno o más nodos que cerrará/ocultará el sidebar                   | NULL                                                |
| `omitCloseNode`\*\*\*  | NodeElement <br> String <br> Array      | Especifica uno o más nodos que omitiran el cierre de uno o varios sidebar    | NULL                                                |
| `openSidebarNode`      | NodeElement                             | Especifica uno o más nodos que abrirá/mostrará y cerrará/ocultará el sidebar | NULL                                                |

\* Propiedades opcionales o no requeridas
\*\* Al no pasarse un nodo de cierre, la propiedad `autoClose` pasa a ser `true`
\*\*\* Un nodo pude utilizarse para omitir el cierre de uno o más sidebars, además de ser un elemeto opcional

#### Forma simple rápida y llana (para solo un side bar)

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

#### Forma larga (para 2 o más sidebars)

En el caso siguiente es muy importante aclarar 3 detalles:

1. Si no se pasa un objeto al llamar la clase con `sidebar = new ToggleSidebar()`, se debe agregar después uno con la función addSidebar `sidebar.addSidebar({})`.
1. la propiedad `name` del objeto que se debe se único.
1. No es posible agrear un arreglo de objetos al inicializar el plugin para agregar varios sidebar.

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

	//agregar otro sidebar utilizando el método 'addSidebar' de la clase toggleSidebar
	sidebar.addSidebar({
		activationClass: "my-other-sidebar",
		closeSidebarNode: document.querySelector("#other-area .close-icon"),
		containerNode: document.getElementById("other-area"),
		omitCloseNode: ["#omit-close-my-other-sidebar"],
		openSidebarNode: document.getElementById("#show-other-info-icon"),
	});
});
```

# ATRIBUTOS POR HTML

Algunos de los atributos 'data-sidebar-\*' a continuación mostrados se leerán en todo el documento cuando la clase ToggleSidebar sea instanciada, de este modo si un sidebar y sus elementos existen desde el código HTML serán incluidos en la funcionalidad que ofrece el plugin.

### Contenedor (requerido)

El contenedor que contiene los elementos del sidebar requiere los siguientes atributos:

| Atributos                     | Valor   | Descripción                                                    |
| ----------------------------- | ------- | -------------------------------------------------------------- |
| `data-sidebar`                | string  | Nombre para el sidebar                                         |
| `data-sidebar-container`\*    | boolean | Especifica que es el nodo contenedor del sidebar               |
| `data-sidebar-activate-class` | string  | La clase que se agregará en `body` para activar el menú        |
| `data-sidebar-auto-close`\*   | boolean | Opcional. Especifica cierre al hacer clic fuera del contenedor |

\* Los valores admitidos que son booleanos debe escribirse entre comillas dobles desde el atributo de la etiqueta

Ejemplo:

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
</div>
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

Este es el elemento que cerrará el sidebar, si no se pasa ningun elemento, el plugin forzará para el cierre al hacer clic por fuera del nodo contenedor o al hacer clic en el nodo que lo activa.

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

Este elemento esté dentro o fuera del sidebar permitirá que el mismo permanezca abierto. Esto es útil en algunos casos, como cuando se quieren agregar elementos a una lista o a un carrito de compras y no se quiera que se oculte el sidebar.

| Atributos             | Valor        | Descripción                                                                  |
| --------------------- | ------------ | ---------------------------------------------------------------------------- |
| `data-sidebar-omit`   | string       | El nombre o nombres\* del sidebar al que se pretende omitir el cierre        |
| `data-sidebar-action` | "omit-close" | Obligatorio escribirlo como se muestra. Especifica la acción de ese elemento |

\* Si un elemento pretende no cerrar varios sidebar los nombres deben ir separados por coma y sin espacios como se muestra a continuación

#### Ejemplo:

```html
<i
	class="icon-keep-open-sidebars"
	data-sidebar="mobile-main-menu,shopping-cart"
	data-sidebar-action="omit-close"
>
	...
</i>
```

# Las 4 acciones de cierre

Un sidebar puede cerrarse hasta con 4 acciones, estas son:

1. Clic en el elemento o icono de apertura.
2. Clic en el elemento o icono de cierre.
3. Clic fuera del contenedor.
4. Clic en un enlace dentro del contenedor

Pero depende... :

1. Si **no se especifica el cierre automático** del sidebar no lo hará cuando se haga clic fuera del contenedor del sidebar. El cierre automático se especifica cuando:
   <ol type="a">
   	<li>Desde el objeto en JavaScript se pasa `autoClose: false`</li>
   	<li>Al elemento HTML se le coloca el atributo data-sidebar-auto-close="false"</li>
   	<li>la ausencia total del atributo en la etiqueta o la propiedad 'autoClose' en el objecto</li>
   </ol>
   Lo anterior fuerza a que no se cierre el sidebar.<br>

   **A menos que....**

1. Si no se **especifica un elemento HTML de cierre** (distinto a especificar el cierre automático) en el objeto de javaScript o si en el código HTML no existe un elemento con el atributo `data-sidebar-action="close"`, se forzará que cierre el sidebar al hacer clic fuera del contenedor.

# Algo de CSS

Debo aclarar que no ví viable colocar elementos de diseño en el plugin debido a la separación de funcionalidades (y el factor pereza???🤔😔), y ya que el plugin se debe ejecutar luego de cargar los elementos de la página (`window.addEventListener("DOMContentLoaded", () => {...})`) podría demorar demasiado en comenzar a mostrarse un sidebar o que se vean y desaparezcan elementos mientras se termina de cargar la página (como elementos 'saltando' para ocultar los sidebar).

El siguiente código es una muestra de cómo se puede manejar el código CSS de forma fácil para que la funcionalidad del plugin tenga su parte visual. Lee los comentarios para enterarte de algunos detalles

### CSS muy sencillo

Sencillo, es demasiado, pero funcional. Solo muestra y oculta un sidebar sea donde sea que aparezca.

```css
/* LO MAS FACIL Y SENCILLO PERO PARA NADA COOL*/
/* contenedor del sidebar*/
#awesome-sidebar-container {
	display: none;
}

/*
'activation-class-name' es la clase que se pasa en la propiedad 'activationClass'
en el objeto de javascript o en el atributo 'data-sidebar-activate-class' que
se le debe colocar al contenedor del sidebar
*/
body:is(.activation-class-name) #awesome-sidebar-container {
	display: block;
}
```

### CSS algo más 'cool'

Si queremos un sidebar que se oculte 100% y se 'deslice' desde la derecha este sería el código CSS:

```css
/* Ajuste y visualización del contenedor del sidebar */
.sidebar-container {
	background-color: darkgrey;
	height: 100dvh;
	left: -14em;
	overflow-y: auto;
	padding: 2.5em;
	position: fixed;
	top: 0;
	transition-duration: 0.3s;
	transition-property: left;
	transition-property: transform;
	transition-timing-function: cubic-bezier(0.22, 0.61, 0.36, 1);
	width: 14em;
	z-index: 1;
}

/*
'activation-class-name' es la clase que se pasa en la propiedad 'activationClass'
en el objeto de javascript o en el atributo 'data-sidebar-activate-class' que
se le debe colocar al contenedor del sidebar
*/

body:is(.activation-class-name) #awesome-sidebar-container {
	left: 0;
}

/* Si existe otro sidebar cuya clase de activación es "other-menu", se debe
colocar algo como lo siguiente*/
body:is(.other-menu) #other-area {
	left: 0;
}
```

Esto no hará mas que mostrar y ocultar el contenedor del sidebar en el lado izquierdo de la pantalla,
es el punto de inicio para generar un side bar totalmente personalizable, ya que la idea del plugin
no es realizar cambios de diseño, solo la funcionalidad (o pereza de escribir el código con diseño incluido). Solo que creo que el diseño (incluye la animación) debe separarse por completo de la funcionalidad y la maquetación.

# MÉTODOS Y PROPIEDADES DE LA CLASE

Los siguientes son los metodos y propiedades que contiene la clase,

# PROPIEDADES DE LA CLASE

| nombre          | tipo        | uso                                                                                           |
| --------------- | ----------- | --------------------------------------------------------------------------------------------- |
| addedSidebar    | bool        | Informa si un sidebar ha sido agregado o inicializado                                         |
| body            | nodeElement | el nodo del elemento body de la pagina                                                        |
| initialized     | bool        | Informa si ya se ha inicializado el plugin luego de agregar algun sidebar                     |
| sidebars        | nodeList    | Lista de los nodos que son contenedor de un sidebar                                           |
| sidebarElements | nodeList    | Listado general de los nodos de acción (open, close, omit) en todos los sidebar               |
| sidebarList     | array       | Contiene un arreglo de con los objetos agregdos con .addSidebar({}) o al inicializar la clase |

#### PROPIEDADES DE LOS OBJETOS EN LA LISTA DE SIDEBARS (sidebarList)

Debo aclarar que este elemento (sidebarList) es un arreglo/matriz de objetos y que para recorrerlo se debe usar la funcion `for` o `foreach`. Si se quiere acceder a alguna de estas propiedades directamente se puede hacer con por ejemplo: `sidebar.sidebarList[0].activationClass`. Lo siguiente son las propiedades posibles que puede tener el objeto dentro del arreglo.

| nombre             | tipo        | uso                                                                                                |
| ------------------ | ----------- | -------------------------------------------------------------------------------------------------- |
| activationClass    | string      | Clase usada para el control del sidebar                                                            |
| autoClose          | bool        | Indicativo que un sidebar tiene cierre automático                                                  |
| closeSidebarNode   | array       | Arreglo con los nodos que sirven de elementos de cierre para un sidebar                            |
| containerNode      | nodeElement | Nodo contenedor del sidebar                                                                        |
| name               | string      | el nombre del sidebar, en caso de no proporcionarse, se generará uno automáticamente               |
| omitClose          | array       | Arreglo con los nodos que sirven para omitir el cierre de un sidebar                               |
| openSidebarNode    | array       | Arreglo con los nodos que permiten la apertura de un sidebar                                       |
| openStatus         | bool        | Estado de apertura actual de un sidebar                                                            |
| openActionHandler  | function    | Elemento que contiene la función openSidebar de la clase. Es usado desde funciones intenas         |
| closeActionHandler | function    | Elemento que contiene la función closeSidebar de la clase. Es usado desde funciones intenas        |
| bodyActionHandler  | function    | Elemento que contiene la función sidebarBodyListener de la clase. Es usado desde funciones intenas |

## MÉTODOS DE LA CLASE

| nombre                        | Parámetro     | funcionalidad                                                                                              | ejemplo de uso                       |
| ----------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| addSidebar({object})          | object        | Método para agregar un sidebar                                                                             | `addSidebar('awesome-sidebar')`      |
| addSidebar_setXxx({object})   | object        | Métodos que se utilizan por la función addSidebar para el manejo de cada elemento.                         | (Sin ejemplo útil fiera de la clase) |
| closeSidebar({object},true)\* | object, bool  | Método para cerrar un sidebar y colocar                                                                    | (Sin ejemplo útil fiera de la clase) |
| die('string',[array])         | string, array | Se utiliza para el manejo de errores en la clase                                                           | (Sin ejemplo útil fiera de la clase) |
| execute()                     | ninguno       | Método para colocar los eventos para el body y los elementos de apertura de cada sidebar en sidebarList    | (Sin ejemplo útil fiera de la clase) |
| getArrayNodes('string',node)  | string, node  | Métodfo que convierte nodos en un arreglo. Se usa al agregar un sidebar.                                   | (Sin ejemplo útil fiera de la clase) |
| hide('string')\*              | string        | Desaparece un sidebar inicializado y abierto anteriormente                                                 | `sidebar.hide('awesome-sidebar')`    |
| init()                        | ninguno       | Método para inicializar la ejecución de los sidebar buscando los atributois data-\* relativos al sidebar.  | `sidebar.init()`                     |
| openSidebar(event)\*          | event         | Método para hacer que un sidebar sea visible colocando la clase en body y eventos de cierre                | (Sin ejemplo útil fiera de la clase) |
| show('string')\*              | string        | Hacer que se visualice un sidebar ya inicializado                                                          | `sidebar.show('awesome-sidebar')`    |
| sidebarBodyListener(event)    | event         | Método que obtiene los eventos de clic realizados en el documento y determina el cierre o no de un sidebar | (Sin ejemplo útil fiera de la clase) |
| toggle('string')              | string        | cambia el estado actual de un sidebar y que haya sido inicializado                                         | `sidebar.toggle('awesome-sidebar')`  |

\* Las funciones closeSidebar() y hide() realizan practicamente la misma función al igual que openSidebar() y show(), la diferencia está en el parámetro que se les dá. En las funciones hide() y show() el parametro es una cadena de texto que facilita realizar la acción.

[^1]: Un **nodeElement** es un objeto que se obtiene con `document.getElementById()` ó `document.querySelector()`, se debe tener en cuenta que no es un elemento válido si se pasa un arreglo como sucede con `document.getElementsByClassName()` ó `document.querySelectorAll()`
[^2]: En caso de no especificarse un nombre al sidebar, por consola se mostrará una advertencia, y se usará un nombre con el nombre de la clase y el timestamp. (Ej: ToggleSidebar-1678469775422)
