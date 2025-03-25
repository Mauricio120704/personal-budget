// obtener la información del formulario
// mediante el evento submit

const form = document.querySelector("form"); //Busca y selecciona el primer elemento <form> que encuentre en el HTML.
const transactionList = document.querySelector("#transaction-list"); //Selecciona el elemento con el id="transaction-list", en este caso es en el <tbody> donde se mostrarán las transacciones.
const balanceElement = document.querySelector("#balance");
const incomeElement = document.querySelector("#income");
const expenseElement = document.querySelector("#expense");

const transacciones = []; //Declara un array vacío llamado transacciones, que servirá para almacenar las transacciones ingresadas. Y sirve para que a medida que el usuario agregue ingresos o gastos, estos se guardarán en transacciones, permitiendo hacer cálculos como balance total, ingresos y gastos.

function updateSummary() {
  // Calcular totales
  let totalIncome = 0;
  let totalExpense = 0;

  transacciones.forEach(trans => {
    if (trans.tipo === "income") {
      totalIncome += parseFloat(trans.monto);
    } else if (trans.tipo === "expense") {
      totalExpense += parseFloat(trans.monto);
    }
  });

  // Calcular balance
  const balance = totalIncome - totalExpense;

  // Actualizar elementos
  balanceElement.textContent = `$${balance.toFixed(2)}`;
  incomeElement.textContent = `$${totalIncome.toFixed(2)}`;
  expenseElement.textContent = `$${totalExpense.toFixed(2)}`;
}

function getDataFromForm() { //Esta función permite extraer la información del formulario de manera organizada. Se usará más adelante para agregar una nueva transacción al array transacciones y actualizar la tabla.
  const formData = new FormData(form); //Crea un objeto FormData a partir del formulario (formData), lo que permite capturar fácilmente los valores de los campos. "FormData" es un tipo especial de objeto que permite obtener los valores de un formulario sin necesidad de document.getElementById.

  //Usa .get("name_del_input") para obtener los valores ingresados en los inputs del formulario
  const description = formData.get("description"); //Obtiene la descripción de la transacción.
  const amount = formData.get("amount"); // Obtiene el monto de la transacción.
  const type = formData.get("type"); // Obtiene el tipo de transacción (income o expense).

  return { //Retorna un objeto con estos tres valores.
    description,
    amount,
    type,
  };
}

function createMovement(movement) { //Recibe un objeto movement, que contiene type, amount y description (provenientes del formulario). 
  const nuevoMovimiento = new Movimiento( //Crea una nueva instancia de la clase Movimiento, pasándole los valores obtenidos del formulario. Esta línea crea un nuevo objeto de tipo Movimiento, que probablemente sea una clase definida en otro archivo o parte del código. Movimiento es una estructura para manejar cada transacción con métodos específicos.
    movement.type,
    movement.amount,
    movement.description
  );

  const validacion = nuevoMovimiento.validarMovimiento(); //Llama al método validarMovimiento() de la clase Movimiento para verificar si la transacción es válida. Revisa que los datos sean correctos (ejemplo: que el monto no sea 0, que la descripción no esté vacía, etc.).

  if (validacion.ok) { //Si la validación es correcta 
    transacciones.push(nuevoMovimiento); //Agrega el movimiento al array transacciones.
    nuevoMovimiento.render(); //Llama a nuevoMovimiento.render(); para mostrarlo en la tabla.
    updateSummary(); // Actualiza los totales
    alert(validacion.message); //Muestra un mensaje de confirmación con alert(validacion.message).
    form.reset(); //Limpia el formulario con form.reset().
  } else {
    alert(validacion.message); //Si la validación falla (ok: false), muestra un mensaje de error con alert(validacion.message).
  }
}

// escuchamos el evento submit
// Esta sección se asegura de que los datos sean procesados correctamente antes de agregarlos a la lista de transacciones.
form.addEventListener("submit", function (event) { // Captura el evento submit del formulario.
  // ejecutamos los pasos para guardar la información
  event.preventDefault(); // Llama a event.preventDefault(); para evitar que la página se recargue al enviar el formulario.

  const newMovement = getDataFromForm(); // Obtiene los datos del formulario con getDataFromForm().
  createMovement(newMovement); // Llama a createMovement(newMovement); para validar y registrar el movimiento.
});

function Movimiento(tipo, monto, descripcion) { // Define una función constructora para crear objetos Movimiento.
  //Asigna a this.tipo, this.monto, this.descripcion los valores recibidos como parámetros.
  this.tipo = tipo;
  this.monto = monto;
  this.descripcion = descripcion;
  this.fecha = new Date(); // Asigna la fecha actual al movimiento.
}

//Permite agregar dinámicamente una fila a la tabla de transacciones. Mejora la experiencia visual, diferenciando ingresos y gastos con colores.
Movimiento.prototype.render = function () {
  const esEgreso = this.tipo === "expense"; // Verifica si el movimiento es un gasto (this.tipo === "expense").
  const colorTexto = esEgreso ? "text-red-600" : "text-green-600"; // Rojo si es un gasto (expense), verde si es un ingreso (income).
  const colorFondo = esEgreso ? "bg-red-50" : "bg-green-50"; // Rojo si es un gasto (expense), verde si es un ingreso (income).
  const signo = esEgreso ? "-" : "+";

  const newRow = `
    <tr class="hover:${colorFondo} ${colorFondo}/30 transition-colors duration-200">
      <td class="px-4 py-3 font-medium">${this.descripcion}</td>
      <td class="px-4 py-3 ${colorTexto} font-bold">${signo}$${Math.abs(
    this.monto
  ).toFixed(2)}</td>
      <td class="px-4 py-3 text-gray-500">${this.fecha}</td>
      <td class="px-4 py-3">
        <span class="inline-block rounded-full px-3 py-1 text-xs ${colorFondo} ${colorTexto}">
          ${this.tipo}
        </span>
      </td>
    </tr>
   `;
  transactionList.innerHTML += newRow;
};

Movimiento.prototype.validarMovimiento = function () {
  // validar que el monto sea > 0
  if (this.monto <= 0) { // Valida que el monto sea mayor a 0 
    return {
      ok: false,
      message: "El monto debe ser mayor a 0",
    };
  }

  // validar que descripcion no este vacio
  // vacio === ""
  // trim() remover espacios "hola como estas"
  if (this.descripcion.trim() === "") { // Valida que la descripción no esté vacía (.trim() elimina espacios innecesarios).
    return {
      ok: false,
      message: "Debe completar la descripcion",
    };
  }
  // solo aceptamos 1 y 2
  if (!["income", "expense"].includes(this.tipo)) { // Verifica que this.tipo sea income o expense.
    return {
      ok: false, // ok: false con un mensaje de error si no es válido
      message: "El valor tipo es erroneo",
    };
  }

  return {
    ok: true, // Devuelve un objeto con ok: true si es válido
    message: "Moviento validado correctamente",
  };
};


//CODIGO EN CONSOLA PROFESOR
//===========================================================================================================================================================================================================================================================================================

// function registrarIngresoOEgreso() {
//   while (true) {
//     const descripcion = prompt("Ingrese la nueva transacción");
//     const tipoDeTransaccion = prompt(
//       "Escoja el tipo de transacción \n1) Ingreso\n2) Egreso\n\n Solo debe poner el número de la opción"
//     );
//     const monto = prompt("Ingrese el monto de la transacción");
//     // antes de insertar el moviento al arreglo debo crear el objeto y ejecutar la validacion
//     const moviento = new Movimiento(
//       tipoDeTransaccion,
//       Number(monto),
//       descripcion
//     );

//     const validacion = moviento.validarMovimiento();

//     if (!validacion.ok) {
//       alert(validacion.message);
//     } else {
//       // si es true entonces agregamo el moviento a transacciones
//       transacciones.push(moviento);
//       // llamar a movieminto.render()
//     }

//     transacciones.push({
//       transaccion,
//       tipoDeTransaccion,
//       monto,
//       fechaDeCreacion: new Date(),
//     });

//     const confirmacion = confirm("Desea agregar otra transacción?");
//     // ok => true: continuar con otra transaccion
//     // cancel => false: terminar la transaccion
//     // en que caso deberiamos detener el while
//     if (confirmacion === false) {
//       // detener el while
//       break;
//     }
//   }
// }

// function mapTransactionNames() {
//   const names = transacciones.map(function (transaccion) {
//     return transaccion.transaccion;
//   });
//   console.log(names);
// }

// function filterTransactions() {
//   // condiciones egreso y > 100
//   const filtroDeDatos = transacciones.filter(
//     (transaccion) =>
//       transaccion.monto > 100 && transaccion.tipoDeTransaccion === "2"
//   );
//   console.log(filtroDeDatos);
// }

// registrarIngresoOEgreso();


//===========================================================================================================================================================================================================================================================================================
//===========================================================================================================================================================================================================================================================================================

// //CODIGO EN CONSOLA MAURICIO
// const transacciones = [];

// function Movimiento(tipo, monto, descripcion) {
//   this.tipo = tipo;
//   this.monto = monto;
//   this.descripcion = descripcion;
//   this.fecha = new Date();
// }

// Movimiento.prototype.render = function () {
//   console.log(
//     `Descripción: ${this.descripcion} | Monto: $${this.monto} | Tipo: ${this.tipo} | Fecha: ${this.fecha}`
//   );
// };

// Movimiento.prototype.validarMovimiento = function () {
//   if (this.monto <= 0) {
//     return { ok: false, message: "El monto debe ser mayor a 0" };
//   }
//   if (this.descripcion.trim() === "") {
//     return { ok: false, message: "Debe completar la descripción" };
//   }
//   if (!["1", "2"].includes(this.tipo)) {
//     return { ok: false, message: "El valor tipo es erróneo" };
//   }
//   return { ok: true, message: "Movimiento validado correctamente" };
// };

// function registrarIngresoOEgreso() {
//   let continuar = true;
  
//   while (continuar) {
//     const descripcion = prompt("Ingrese la nueva transacción");
//     const tipoDeTransaccion = prompt(
//       "Escoja el tipo de transacción \n1) Ingreso\n2) Egreso\n\n Solo debe poner el número de la opción"
//     );
//     const monto = prompt("Ingrese el monto de la transacción");

//     const movimiento = new Movimiento(tipoDeTransaccion, Number(monto), descripcion);
//     const validacion = movimiento.validarMovimiento();

//     if (!validacion.ok) {
//       console.log(validacion.message);
//     } else {
//       transacciones.push(movimiento);
      
//       // Mostrar el movimiento recién agregado en el formato requerido
//       console.log("Nombre del movimiento: " + movimiento.descripcion);
//       console.log("Tipo: " + (movimiento.tipo === "1" ? "Ingreso" : "Egreso"));
//       console.log("Monto: " + movimiento.monto.toFixed(2));
//       console.log("");
//     }
    
//     // Mostrar la pregunta y la respuesta en el formato requerido
//     const respuesta = prompt("¿Registrar otro movimiento? (si/no):").toLowerCase();
//     console.log("¿Registrar otro movimiento? (si/no): " + respuesta);
    
//     if (respuesta !== "si") {
//       continuar = false;
//     }
//   }
// }

// function mapTransactionNames() {
//   const names = transacciones.map((transaccion) => transaccion.descripcion);
//   console.log(names);
// }

// function filterTransactions() {
//   const filtroDeDatos = transacciones.filter(
//     (transaccion) => transaccion.monto > 100 && transaccion.tipo === "2"
//   );
//   console.log(filtroDeDatos);
// }

// function calcularTotalSaldo() {
//   let total = 0;

//   transacciones.forEach((transaccion) => {
//     if (transaccion.tipo === "1") {
//       // Ingreso
//       total += transaccion.monto;
//     } else if (transaccion.tipo === "2") {
//       // Egreso
//       total -= transaccion.monto;
//     }
//   });
//   return total;
// }

// function mostrarResumen() {
//   console.log("\nResumen Final");
//   console.log("-----------------------");

//   const totalMovimientos = transacciones.length;
//   const totalIngresos = transacciones
//     .filter((t) => t.tipo === "1")
//     .reduce((sum, t) => sum + t.monto, 0);
//   const totalEgresos = transacciones
//     .filter((t) => t.tipo === "2")
//     .reduce((sum, t) => sum + t.monto, 0);
//   const saldoTotal = totalIngresos - totalEgresos;

//   console.log(`Total de movimientos registrados: ${totalMovimientos}`);
//   console.log(`Saldo total: $${saldoTotal.toFixed(2)}\n`);

//   console.log("\nDesglose por tipo:");
//   console.log(`- Egresos: $${totalEgresos.toFixed(2)}`);
//   console.log(`- Ingresos: $${totalIngresos.toFixed(2)}`);
// }

// // Ejecutar el programa en consola
// console.log("Registro de Gastos");
// console.log("-----------------------");
// registrarIngresoOEgreso();
// mostrarResumen();


// Una forma de mostrar el resumen realizada primero en el main
// function mostrarResumen() {
//   let totalIngresos = 0;
//   let totalGastos = 0;

//   // Recorremos el array transacciones para calcular los ingresos y gastos
//   transacciones.forEach((transaccion) => {
//     if (transaccion.tipo === "1") {
//       totalIngresos += transaccion.monto; // Sumar ingresos
//     } else if (transaccion.tipo === "2") {
//       totalGastos += transaccion.monto; // Sumar gastos
//     }
//   });

//   const cantidadMovimientos = transacciones.length; // Cantidad total de movimientos

//   // Mostrar en consola el resumen
//   console.log("📊 Resumen de Transacciones 📊");
//   console.log(`Cantidad de movimientos: ${cantidadMovimientos}`);
//   console.log(`Total de ingresos: $${totalIngresos.toFixed(2)}`);
//   console.log(`Total de gastos: $${totalGastos.toFixed(2)}`);
//   console.log(`Saldo final: $${(totalIngresos - totalGastos).toFixed(2)}`);
// }


// //ESTE ES PARA DEJAR LA OPCIÓN DE AGREGAR OTRA TRANSACCIÓN CON UN BOTÓN DE "ACEPTAR", va después de transacciones.push(movimiento)
    // const confirmacion = confirm("Desea agregar otra transacción?");
    // if (!confirmacion) break;