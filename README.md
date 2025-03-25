# Personal-Budget

## Breve explicación del funcionamiento del programa:
Al ejecutar el programa se puede ver la interfaz del gestor de presupuesto personal, en la parte superior se visualizan los encabezados de *"Balance"* , *"Ingresos"* y *"Gastos"*.
Después, tenemos la sección de añadir nueva transacción en la cual el usuario debe ingresar una descripción de la transacción, un monto y marcar si la transacción es un **Ingreso** o un **Gasto**, indicado a eso se procede a ejecutar la transacción con el botón de "Añadir Transacción". Por último, en la parte inferior podemos visualizar el historial de transacciones indicando la descripción, el monto, la fecha y las acciones( <span style="color: green;">income</span>, <span style="color: red;">expense</span>)


## Funciones:
> `function updateSummary()`

> `function getDataFromForm()`

> `function createMovement(movement)`

> `function Movimiento(tipo,monto,descripcion)`

> `function Movimiento.prototype.render()`

> `function Movimiento.prototype.validarMovimiento()`

## Reflexión:
Gracias a las estructuras de control de flujo podemos realizar programas los cuales no tengan la necesidad de repetir código innecesario. Aparte optimizar el rendimiento, mejorar la legibilidad y el mantenimiento del software.