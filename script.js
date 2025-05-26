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
    editingStudent = student;

    document.getElementById("name").value = student.name;
    document.getElementById("lastName").value = student.lastName;
    document.getElementById("date").value = student.date;
    document.getElementById("grade").value = student.grade;
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

