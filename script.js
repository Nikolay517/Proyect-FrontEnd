const students = [];
const tableBody = document.querySelector("#studentsTable tbody");
const averageDiv = document.getElementById("average");
let editingStudent = null;

document.getElementById("studentForm").addEventListener("submit", function(e){
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const date = document.getElementById("date").value.trim();
    const grade = parseFloat(document.getElementById("grade").value);

    if (!name || !lastName || !date || isNaN(grade) || grade < 1 || grade > 7) {
        alert("Error al ingresar Datos");
        return;
    }

    const student = { name, lastName, grade, date };

    if (editingStudent) {
        const index = students.indexOf(editingStudent);
        students[index] = student;  
        
 
        const row = tableBody.querySelector(`tr[data-id="${editingStudent.id}"]`);
        row.querySelector(".name-column").textContent = student.name;
        row.querySelector(".lastName-column").textContent = student.lastName;
        row.querySelector(".date-column").textContent = student.date;
        row.querySelector(".grade-column").textContent = student.grade;
    
        editingStudent = null;
    } else {

        student.id = Date.now(); 
        students.push(student);
        addStudentToTable(student);
    }

    calculateAverage();
    this.reset();
});

function addStudentToTable(student) {
    const row = document.createElement("tr");
    row.setAttribute("data-id", student.id); 
    row.innerHTML = `
        <td class="name-column">${student.name}</td>
        <td class="lastName-column">${student.lastName}</td>
        <td class="date-column">${student.date}</td>
        <td class="grade-column">${student.grade}</td>
        <td><button class="edit-btn">Editar</button>
        <button class="delete-btn">Eliminar</button></td>
    `;

    row.querySelector(".edit-btn").addEventListener("click", function(){
        editEstudiante(student, row);
    });
    row.querySelector(".delete-btn").addEventListener("click", function(){
        deleteEstudiante(student, row);
    });

    tableBody.appendChild(row);
}

function deleteEstudiante(student, row) {
    const index = students.indexOf(student);
    if (index !== -1) {
        students.splice(index, 1);
        row.remove();
        calculateAverage();
    }
}

function calculateAverage() {
    if (students.length === 0) {
        averageDiv.textContent = "Promedio General del Curso: N/A";
        return;
    }
    
    const total = students.reduce((sum, student) => sum + student.grade, 0);
    const prom = total / students.length;
    averageDiv.textContent = "Promedio General del Curso: " + prom.toFixed(2);
}

function editEstudiante(student, row) {
    const index = students.indexOf(student);
    if (index === -1) return;

    while (true) {
        const newName = prompt("Editar nombre:", student.name)?.trim();
        if (newName === null) return;

        const newLastName = prompt("Editar apellido:", student.lastName)?.trim();
        if (newLastName === null) return;

        const newDate = prompt("Editar fecha:", student.date)?.trim();
        if (newDate === null) return;

        const newGradeInput = prompt("Editar nota (1 a 7):", student.grade);
        if (newGradeInput === null) return;

        const newGrade = parseFloat(newGradeInput);
        const errors = [];

        if (!newName) errors.push("Nombre no puede estar vacío.");
        if (!newLastName) errors.push("Apellido no puede estar vacío.");
        if (!newDate) errors.push("Fecha no puede estar vacía.");
        if (isNaN(newGrade) || newGrade < 1 || newGrade > 7) {
            errors.push("Nota debe ser un número entre 1 y 7.");
        }

        if (errors.length === 0) {
            student.name = newName;
            student.lastName = newLastName;
            student.date = newDate;
            student.grade = newGrade;

            row.querySelector(".name-column").textContent = newName;
            row.querySelector(".lastName-column").textContent = newLastName;
            row.querySelector(".date-column").textContent = newDate;
            row.querySelector(".grade-column").textContent = newGrade;

            calculateAverage();
            break;
        } else {
            alert("Errores:\n" + errors.join("\n"));
        }
    }
}

function calculateAverage() {
    const statsDiv = document.getElementById("stats");

    if (students.length === 0) {
        averageDiv.textContent = "Promedio General del Curso: N/A";
        statsDiv.textContent = "Total de estudiantes: 0 | Aprobados: 0 | Reprobados: 0";
        return;
    }
    
    const total = students.reduce((sum, student) => sum + student.grade, 0);
    const prom = total / students.length;

    const aprobados = students.filter(s => s.grade >= 4.0).length;
    const reprobados = students.filter(s => s.grade < 4.0).length;

    averageDiv.textContent = "Promedio General del Curso: " + prom.toFixed(2);
    statsDiv.textContent = `Total de estudiantes: ${students.length} | Aprobados: ${aprobados} | Reprobados: ${reprobados}`;
}

