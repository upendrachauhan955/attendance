let students = JSON.parse(localStorage.getItem('bca_attendance_v2')) || [];

const studentForm = document.getElementById('studentForm');
const studentNameInput = document.getElementById('studentName');
const rollNoInput = document.getElementById('rollNo');
const studentTableBody = document.getElementById('studentTableBody');
const totalCount = document.getElementById('totalCount');
const presentCount = document.getElementById('presentCount');
const absentCount = document.getElementById('absentCount');

// Live Clock
setInterval(() => {
    const now = new Date();
    const clockEl = document.getElementById('liveClock');
    if(clockEl) clockEl.textContent = now.toLocaleTimeString();
}, 1000);

function updateStats() {
    if(totalCount) totalCount.textContent = students.length;
    const present = students.filter(s => s.status === 'Present').length;
    if(presentCount) presentCount.textContent = present;
    if(absentCount) absentCount.textContent = students.length - present;
}

function renderTable() {
    if(!studentTableBody) return;
    studentTableBody.innerHTML = '';
    updateStats();

    if (students.length === 0) {
        studentTableBody.innerHTML = `
            <tr>
                <td colspan="4" class="p-12 text-center text-slate-500 font-mono text-xs">
                    No records found. Register students using the admin panel above to start tracking.
                </td>
            </tr>
        `;
        return;
    }

    students.forEach((student, index) => {
        const row = document.createElement('tr');
        row.className = "hover:bg-white/[0.02] transition group";
        
        row.innerHTML = `
            <td class="p-6 font-mono text-xs text-slate-400">${student.roll}</td>
            <td class="p-6 font-bold text-white tracking-wide">${student.name}</td>
            <td class="p-6 text-center">
                <span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold ${
                    student.status === 'Present' 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }">
                    <span class="w-1.5 h-1.5 rounded-full ${student.status === 'Present' ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}"></span>
                    ${student.status}
                </span>
            </td>
            <td class="p-6 text-right space-x-2 font-mono text-xs">
                <button onclick="toggleStatus(${index})" class="bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl transition text-slate-300">
                    Toggle Status
                </button>
                <button onclick="deleteStudent(${index})" class="bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-600/20 px-4 py-2 rounded-xl transition">
                    Remove
                </button>
            </td>
        `;
        studentTableBody.appendChild(row);
    });

    localStorage.setItem('bca_attendance_v2', JSON.stringify(students));
}

if(studentForm) {
    studentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = studentNameInput.value.trim();
        const roll = rollNoInput.value.trim();

        if (name && roll) {
            students.push({ name, roll, status: 'Present' });
            studentNameInput.value = '';
            rollNoInput.value = '';
            renderTable();
        }
    });
}

function toggleStatus(index) {
    students[index].status = students[index].status === 'Present' ? 'Absent' : 'Present';
    renderTable();
}

function markAll(status) {
    students.forEach(s => s.status = status);
    renderTable();
}

function deleteStudent(index) {
    students.splice(index, 1);
    renderTable();
}

function resetAll() {
    if (confirm("Are you sure you want to clear all student records?")) {
        students = [];
        renderTable();
    }
}

renderTable();