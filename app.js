// State Management
let tasks = [];

// Hash target for verification (SHA-256 of the admin password)
const AUTH_KEY = "a1dd395c19f3a1f7ff0e6bfe3ee6028e4373b41085a6da776ab02a8baf129abb";

// DOM Elements
const tabs = document.querySelectorAll('.nav-item');
const tabContents = document.querySelectorAll('.tab-content');
const pageTitle = document.getElementById('page-title');
const pageSubtitle = document.getElementById('page-subtitle');

// Auth DOM Elements
const loginContainer = document.getElementById('login-container');
const appContainer = document.querySelector('.app-container');
const loginForm = document.getElementById('login-form');
const loginUsername = document.getElementById('login-username');
const loginPassword = document.getElementById('login-password');
const loginErrorMsg = document.getElementById('login-error-msg');
const navLogout = document.getElementById('nav-logout');

// Theme DOM Elements
const btnThemeToggle = document.getElementById('btn-theme-toggle');
const themeIcon = document.getElementById('theme-icon');

// Modals & Forms
const modalTaskForm = document.getElementById('modal-task-form');
const modalViewTask = document.getElementById('modal-view-task');
const formTask = document.getElementById('task-form');
const btnCloseModal = document.getElementById('btn-close-modal');
const btnCloseView = document.getElementById('btn-close-view');
const btnCancelModal = document.getElementById('btn-cancel-modal');
const btnAddShortcut = document.getElementById('btn-add-shortcut');

// Inputs
const inputTaskId = document.getElementById('task-id');
const inputTaskDate = document.getElementById('task-date');
const inputTaskTitle = document.getElementById('task-title');
const inputTaskPic = document.getElementById('task-pic');
const inputTaskPicTitle = document.getElementById('task-pic-title');
const inputTaskStartDate = document.getElementById('task-start-date');
const inputTaskEndDate = document.getElementById('task-end-date');
const inputTaskStatus = document.getElementById('task-status');

// Multiple Executors DOM elements
const executorsContainer = document.getElementById('executors-list-container');
const btnAddExecutorRow = document.getElementById('btn-add-executor-row');
const btnCopyExecutors = document.getElementById('btn-copy-executors');
const copyExecutorsWrapper = document.getElementById('copy-executors-wrapper');
const selectCopySource = document.getElementById('select-copy-source');
const btnExecuteCopy = document.getElementById('btn-execute-copy');

// Rich Editor DOM elements
const activitiesEditor = document.getElementById('task-activities-editor');
const editorButtons = document.querySelectorAll('.editor-btn');

// Filters
const searchInput = document.getElementById('search-task');
const filterStatus = document.getElementById('filter-status');
const filterMonthYear = document.getElementById('filter-month-year');

// Dashboard Stats
const statTotal = document.getElementById('stat-total');
const statSelesai = document.getElementById('stat-selesai');
const statAktif = document.getElementById('stat-aktif');
const recentTasksList = document.getElementById('recent-tasks-list');
const tasksContainer = document.getElementById('tasks-container');
const linkViewAll = document.getElementById('link-view-all');

// Report Tab
const reportMonth = document.getElementById('report-month');
const reportYear = document.getElementById('report-year');
const btnGenerateReport = document.getElementById('btn-generate-report');
const reportPreviewContainer = document.getElementById('report-preview-container');
const monthlyReportContent = document.getElementById('monthly-report-content');
const btnPrintMonthly = document.getElementById('btn-print-monthly');

// Backup Settings
const btnExport = document.getElementById('btn-export');
const importFileInput = document.getElementById('import-file-input');
const btnTriggerImport = document.getElementById('btn-trigger-import');
const btnClearData = document.getElementById('btn-clear-data');
const infoStorageUsed = document.getElementById('info-storage-used');
const infoTotalRecords = document.getElementById('info-total-records');

// Print Area
const printArea = document.getElementById('print-area');
const btnPrintSingle = document.getElementById('btn-print-single');

// Indonesian Month List
const indonesianMonths = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

// Roman Numerals for Month
const romanMonths = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

// Sample Initial Data
const sampleData = [
    {
        id: "ts-1",
        no: "1/ST/VI/2026",
        title: "Monitoring dan Evaluasi Pembelajaran Kelas Digital di SMA Negeri 1",
        date: "2026-06-15",
        pic: "Dr. H. Ahmad Fauzi, M.Pd.",
        picTitle: "Kepala Dinas Pendidikan",
        executors: [
            { name: "Budi Santoso, S.Kom.", role: "Pelaksana Utama / IT Specialist", nip: "19881023 201504 1 002" },
            { name: "Siti Rahma, S.Pd.", role: "Evaluator Akademik", nip: "19900214 201803 2 003" }
        ],
        startDate: "2026-06-16",
        endDate: "2026-06-18",
        status: "selesai",
        activitiesHtml: `<p>Laporan hasil pelaksanaan kegiatan monitoring kelas digital:</p>
<ul>
  <li>Melakukan koordinasi dengan Kepala Sekolah SMA Negeri 1 berkaitan dengan integrasi kelas digital.</li>
  <li>Mengobservasi kegiatan belajar mengajar di 3 laboratorium komputer sekolah.</li>
  <li>Mengecek kelayakan infrastruktur server lokal, router, dan ketersediaan wifi sekolah.</li>
  <li>Memberikan bimbingan teknis penggunaan platform e-learning kepada guru mata pelajaran.</li>
</ul>`
    },
    {
        id: "ts-2",
        no: "2/ST/VI/2026",
        title: "Sosialisasi Keamanan Informasi dan Data Instansi Pemerintah",
        date: "2026-06-20",
        pic: "Dr. H. Ahmad Fauzi, M.Pd.",
        picTitle: "Kepala Dinas Pendidikan",
        executors: [
            { name: "Ahmad Subari, M.T.", role: "Pemateri / Keamanan Siber", nip: "19850112 201012 1 001" }
        ],
        startDate: "2026-06-24",
        endDate: "2026-06-26",
        status: "aktif",
        activitiesHtml: `<p>Persiapan dan tahapan sosialisasi keamanan informasi:</p>
<ol>
  <li>Mempersiapkan materi sosialisasi keamanan siber dan perlindungan data pribadi.</li>
  <li>Melakukan sosialisasi di Aula Kantor Wilayah.</li>
</ol>`
    }
];

// App Initialization
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    initTheme();
    loadData();
    setupNavigation();
    setupForm();
    setupFilters();
    setupReportForm();
    setupBackupRestore();
    updateDashboardStats();
    updateStorageInfo();
});

// Helper: Native SHA-256
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Authentication Logic
function initAuth() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
        showApp();
    } else {
        showLogin();
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = loginUsername.value.trim();
        const password = loginPassword.value;
        const hashedInput = await sha256(password);

        if (username === 'admin' && hashedInput === AUTH_KEY) {
            sessionStorage.setItem('isLoggedIn', 'true');
            loginErrorMsg.style.display = 'none';
            loginForm.reset();
            showApp();
            updateDashboardStats();
            updateStorageInfo();
        } else {
            loginErrorMsg.style.display = 'block';
        }
    });

    navLogout.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm("Apakah Anda yakin ingin keluar dari aplikasi?")) {
            sessionStorage.removeItem('isLoggedIn');
            showLogin();
        }
    });
}

function showLogin() {
    appContainer.style.display = 'none';
    loginContainer.style.display = 'flex';
}

function showApp() {
    loginContainer.style.display = 'none';
    appContainer.style.display = 'flex';
}

// Theme Toggle Logic
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        themeIcon.className = 'fa-solid fa-moon';
    } else {
        document.body.classList.remove('light-mode');
        themeIcon.className = 'fa-solid fa-sun';
    }

    btnThemeToggle.addEventListener('click', () => {
        if (document.body.classList.contains('light-mode')) {
            document.body.classList.remove('light-mode');
            themeIcon.className = 'fa-solid fa-sun';
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.add('light-mode');
            themeIcon.className = 'fa-solid fa-moon';
            localStorage.setItem('theme', 'light');
        }
    });
}

// Load data from LocalStorage
function loadData() {
    const localData = localStorage.getItem('surat_tugas_db');
    if (localData) {
        try {
            tasks = JSON.parse(localData);
            
            // Migration check: convert old format task data if found
            let migrated = false;
            tasks.forEach(t => {
                if (t.executor) {
                    t.executors = [{ name: t.executor, role: "Pelaksana", nip: t.executorNip || "" }];
                    delete t.executor;
                    delete t.executorNip;
                    migrated = true;
                }
                if (t.activities && !t.activitiesHtml) {
                    let html = "<ul>";
                    t.activities.forEach(act => {
                        html += `<li>${act.text}</li>`;
                    });
                    html += "</ul>";
                    t.activitiesHtml = html;
                    delete t.activities;
                    migrated = true;
                }
            });
            if (migrated) saveToStorage();

        } catch (e) {
            console.error("Error parsing localStorage data, loading sample data instead.", e);
            tasks = JSON.parse(JSON.stringify(sampleData));
            saveToStorage();
        }
    } else {
        tasks = JSON.parse(JSON.stringify(sampleData));
        saveToStorage();
    }
}

// Save data to LocalStorage
function saveToStorage() {
    localStorage.setItem('surat_tugas_db', JSON.stringify(tasks));
    updateStorageInfo();
}

// Update DB Size Information
function updateStorageInfo() {
    const dataStr = localStorage.getItem('surat_tugas_db') || '';
    const bytes = new Blob([dataStr]).size;
    const kb = (bytes / 1024).toFixed(2);
    
    if (infoStorageUsed) infoStorageUsed.innerText = `${kb} KB`;
    if (infoTotalRecords) infoTotalRecords.innerText = `${tasks.length} item`;
}

// Setup SPA Navigation
function setupNavigation() {
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTab = tab.getAttribute('data-tab');
            
            // Toggle Active Nav Link
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Toggle Content Visibility
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `tab-${targetTab}`) {
                    content.classList.add('active');
                }
            });
            
            // Update Page Header Text
            updateHeader(targetTab);
            
            // Trigger specific actions when switching tabs
            if (targetTab === 'dashboard') {
                updateDashboardStats();
            } else if (targetTab === 'surat-tugas') {
                renderTaskList();
                populateMonthFilter();
            } else if (targetTab === 'laporan') {
                populateReportYearFilter();
            }
        });
    });

    linkViewAll.addEventListener('click', (e) => {
        e.preventDefault();
        const navItem = document.querySelector('[data-tab="surat-tugas"]');
        if (navItem) navItem.click();
    });
}

function updateHeader(tabName) {
    switch (tabName) {
        case 'dashboard':
            pageTitle.innerText = 'Dashboard';
            pageSubtitle.innerText = 'Ringkasan surat tugas dan laporan kegiatan Anda.';
            break;
        case 'surat-tugas':
            pageTitle.innerText = 'Surat Tugas';
            pageSubtitle.innerText = 'Daftar dan kelola seluruh surat tugas.';
            break;
        case 'laporan':
            pageTitle.innerText = 'Cetak Laporan Bulanan';
            pageSubtitle.innerText = 'Buat rekapitulasi laporan kegiatan bulanan untuk dicetak/PDF.';
            break;
        case 'pengaturan':
            pageTitle.innerText = 'Pengaturan Cadangan';
            pageSubtitle.innerText = 'Backup, pulihkan, dan hapus data lokal aplikasi.';
            break;
    }
}

// Dashboard View Handler
function updateDashboardStats() {
    const total = tasks.length;
    const selesai = tasks.filter(t => t.status === 'selesai').length;
    const aktif = tasks.filter(t => t.status === 'aktif').length;

    statTotal.innerText = total;
    statSelesai.innerText = selesai;
    statAktif.innerText = aktif;

    // Render Recent Table (max 5)
    const sortedTasks = [...tasks].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
    recentTasksList.innerHTML = '';

    if (sortedTasks.length === 0) {
        recentTasksList.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4 text-muted">Belum ada data surat tugas.</td>
            </tr>
        `;
        return;
    }

    sortedTasks.forEach(task => {
        const tr = document.createElement('tr');
        const execNames = task.executors ? task.executors.map(e => e.name).join(', ') : '-';
        tr.innerHTML = `
            <td><strong>${task.no || '-'}</strong></td>
            <td>${truncateText(task.title, 35)}</td>
            <td>${truncateText(execNames, 30)}</td>
            <td><span class="text-xs">${formatDateIndo(task.startDate)} - ${formatDateIndo(task.endDate)}</span></td>
            <td>
                <span class="badge ${task.status === 'selesai' ? 'badge-green' : 'badge-blue'}">
                    ${task.status === 'selesai' ? 'Selesai' : 'Aktif'}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn btn-print" onclick="viewSingleTask('${task.id}')" title="Pratinjau Cetak">
                        <i class="fa-solid fa-file-pdf"></i>
                    </button>
                    <button class="action-btn btn-edit" onclick="editTask('${task.id}')" title="Edit">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                </div>
            </td>
        `;
        recentTasksList.appendChild(tr);
    });
}

// Helper to compile Roman Numerals for months
function getRomanMonth(monthNum) {
    return romanMonths[monthNum - 1] || monthNum;
}

// Auto-Numbering Generator
function generateTaskNumber(dateStr, taskId = null) {
    if (!dateStr) return '';
    const taskDateObj = new Date(dateStr);
    const month = taskDateObj.getMonth() + 1;
    const year = taskDateObj.getFullYear();
    
    // Filter tasks that occur in the same month and year (excluding this current task if it is an edit)
    const siblings = tasks.filter(t => {
        if (taskId && t.id === taskId) return false;
        const d = new Date(t.date);
        return (d.getMonth() + 1) === month && d.getFullYear() === year;
    });

    const index = siblings.length + 1;
    const roman = getRomanMonth(month);
    return `${index}/ST/${roman}/${year}`;
}

// Setup Form, Add & Edit logic
function setupForm() {
    // Shortcuts to Add Modal
    btnAddShortcut.addEventListener('click', () => openTaskFormModal());

    // Close Modal Events
    btnCloseModal.addEventListener('click', closeModal);
    btnCancelModal.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === modalTaskForm) closeModal();
        if (e.target === modalViewTask) closeModal();
    });

    // Add Executor Row
    btnAddExecutorRow.addEventListener('click', () => addExecutorRow());

    // Toggle Copy executors dropdown wrapper
    btnCopyExecutors.addEventListener('click', () => {
        if (copyExecutorsWrapper.style.display === 'none') {
            populateCopySourceOptions();
            copyExecutorsWrapper.style.display = 'block';
        } else {
            copyExecutorsWrapper.style.display = 'none';
        }
    });

    // Execute Copy executors
    btnExecuteCopy.addEventListener('click', () => {
        const sourceTaskId = selectCopySource.value;
        if (!sourceTaskId) {
            alert('Pilih surat tugas sumber terlebih dahulu.');
            return;
        }
        const sourceTask = tasks.find(t => t.id === sourceTaskId);
        if (sourceTask && sourceTask.executors && sourceTask.executors.length > 0) {
            executorsContainer.innerHTML = '';
            sourceTask.executors.forEach(exec => {
                addExecutorRow(exec.name, exec.role, exec.nip);
            });
            copyExecutorsWrapper.style.display = 'none';
        } else {
            alert('Surat tugas sumber tidak memiliki data pelaksana.');
        }
    });

    // Setup Rich Text Editor toolbar formatting events
    editorButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const cmd = btn.getAttribute('data-cmd');
            const val = btn.getAttribute('data-val') || null;
            document.execCommand(cmd, false, val);
            activitiesEditor.focus();
        });
    });

    // Submit Form
    formTask.addEventListener('submit', (e) => {
        e.preventDefault();
        saveTask();
    });
}

// Populate the Copy dropdown with available tasks
function populateCopySourceOptions() {
    selectCopySource.innerHTML = '<option value="">-- Pilih Surat Tugas --</option>';
    
    // Sort reverse chronological
    const sorted = [...tasks].sort((a,b) => new Date(b.date) - new Date(a.date));
    
    sorted.forEach(t => {
        const execNames = t.executors ? t.executors.map(e => e.name).join(', ') : '-';
        const label = `${t.no || 'Tanpa No.'} - ${truncateText(t.title, 30)} (${truncateText(execNames, 20)})`;
        const option = document.createElement('option');
        option.value = t.id;
        option.innerText = label;
        selectCopySource.appendChild(option);
    });
}

function openTaskFormModal(task = null) {
    formTask.reset();
    executorsContainer.innerHTML = '';
    activitiesEditor.innerHTML = '';
    copyExecutorsWrapper.style.display = 'none';
    
    if (task) {
        // Edit Mode
        document.getElementById('modal-title').innerText = "Edit Surat Tugas";
        inputTaskId.value = task.id;
        inputTaskDate.value = task.date;
        inputTaskTitle.value = task.title;
        inputTaskPic.value = task.pic;
        inputTaskPicTitle.value = task.picTitle || '';
        inputTaskStartDate.value = task.startDate;
        inputTaskEndDate.value = task.endDate;
        inputTaskStatus.value = task.status;

        // Load executors
        if (task.executors && task.executors.length > 0) {
            task.executors.forEach(exec => addExecutorRow(exec.name, exec.role, exec.nip));
        } else {
            addExecutorRow(); // default one empty row
        }

        // Load activities HTML
        activitiesEditor.innerHTML = task.activitiesHtml || '';
    } else {
        // New Mode
        document.getElementById('modal-title').innerText = "Tambah Surat Tugas Baru";
        inputTaskId.value = '';
        inputTaskDate.value = new Date().toISOString().substring(0, 10);
        inputTaskStartDate.value = new Date().toISOString().substring(0, 10);
        inputTaskEndDate.value = new Date().toISOString().substring(0, 10);
        addExecutorRow(); // default one row
        activitiesEditor.innerHTML = '';
    }
    
    modalTaskForm.classList.add('active');
}

function addExecutorRow(name = '', role = '', nip = '') {
    const div = document.createElement('div');
    div.className = 'executor-input-row';
    div.innerHTML = `
        <input type="text" class="form-control executor-name" required placeholder="Nama Pelaksana" value="${name}">
        <input type="text" class="form-control executor-role" placeholder="Peran/Jabatan" value="${role}">
        <input type="text" class="form-control executor-nip" placeholder="NIP/ID (Opsional)" value="${nip}">
        <button type="button" class="action-btn btn-delete remove-executor-row" title="Hapus Pelaksana">
            <i class="fa-solid fa-trash"></i>
        </button>
    `;
    
    // Bind deletion click
    div.querySelector('.remove-executor-row').addEventListener('click', () => {
        div.remove();
    });
    
    executorsContainer.appendChild(div);
}

function closeModal() {
    modalTaskForm.classList.remove('active');
    modalViewTask.classList.remove('active');
}

function saveTask() {
    const id = inputTaskId.value || 'ts-' + Date.now();
    const dateVal = inputTaskDate.value;
    
    // Collect executors
    const executorRows = executorsContainer.querySelectorAll('.executor-input-row');
    const executors = Array.from(executorRows).map(row => ({
        name: row.querySelector('.executor-name').value.trim(),
        role: row.querySelector('.executor-role').value.trim() || 'Pelaksana',
        nip: row.querySelector('.executor-nip').value.trim()
    })).filter(exec => exec.name !== '');

    if (executors.length === 0) {
        alert("Wajib menambahkan minimal 1 pelaksana tugas.");
        return;
    }

    // Get HTML from contenteditable editor
    const activitiesHtml = activitiesEditor.innerHTML.trim();

    // Check if task exists to determine if we should generate a new number or recalculate
    const existingIndex = tasks.findIndex(t => t.id === id);
    let autoNo = '';

    if (existingIndex > -1) {
        const oldTask = tasks[existingIndex];
        const oldMonthYear = new Date(oldTask.date).getMonth() + '-' + new Date(oldTask.date).getFullYear();
        const newMonthYear = new Date(dateVal).getMonth() + '-' + new Date(dateVal).getFullYear();
        
        if (oldMonthYear === newMonthYear && oldTask.no) {
            autoNo = oldTask.no;
        } else {
            autoNo = generateTaskNumber(dateVal, id);
        }
    } else {
        autoNo = generateTaskNumber(dateVal);
    }

    const taskData = {
        id,
        no: autoNo,
        date: dateVal,
        title: inputTaskTitle.value,
        pic: inputTaskPic.value,
        picTitle: inputTaskPicTitle.value,
        startDate: inputTaskStartDate.value,
        endDate: inputTaskEndDate.value,
        status: inputTaskStatus.value,
        executors,
        activitiesHtml
    };

    if (existingIndex > -1) {
        tasks[existingIndex] = taskData;
    } else {
        tasks.push(taskData);
    }

    saveToStorage();
    closeModal();
    
    // Refresh current view
    const activeTab = document.querySelector('.nav-item.active').getAttribute('data-tab');
    if (activeTab === 'dashboard') {
        updateDashboardStats();
    } else if (activeTab === 'surat-tugas') {
        renderTaskList();
    }
}

// Edit handler
window.editTask = function(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        openTaskFormModal(task);
    }
};

// Delete handler
window.deleteTask = function(id) {
    if (confirm("Apakah Anda yakin ingin menghapus surat tugas ini?")) {
        tasks = tasks.filter(t => t.id !== id);
        saveToStorage();
        
        const activeTab = document.querySelector('.nav-item.active').getAttribute('data-tab');
        if (activeTab === 'dashboard') {
            updateDashboardStats();
        } else if (activeTab === 'surat-tugas') {
            renderTaskList();
        }
    }
};

// Setup filters on Surat Tugas tab
function setupFilters() {
    searchInput.addEventListener('input', renderTaskList);
    filterStatus.addEventListener('change', renderTaskList);
    filterMonthYear.addEventListener('change', renderTaskList);
}

// Generate unique month-year options from task dates for search filters
function populateMonthFilter() {
    filterMonthYear.innerHTML = '<option value="all">Semua Bulan</option>';
    
    const dates = tasks.map(t => new Date(t.date));
    const uniqueMonths = [];
    
    dates.forEach(d => {
        if (!isNaN(d.getTime())) {
            const m = d.getMonth() + 1;
            const y = d.getFullYear();
            const key = `${m}-${y}`;
            const label = `${indonesianMonths[m-1]} ${y}`;
            if (!uniqueMonths.some(item => item.key === key)) {
                uniqueMonths.push({ key, label, month: m, year: y });
            }
        }
    });

    uniqueMonths.sort((a, b) => b.year - a.year || b.month - a.month);

    uniqueMonths.forEach(item => {
        const option = document.createElement('option');
        option.value = item.key;
        option.innerText = item.label;
        filterMonthYear.appendChild(option);
    });
}

// Render Task List items
function renderTaskList() {
    const query = searchInput.value.toLowerCase().trim();
    const statusVal = filterStatus.value;
    const monthYearVal = filterMonthYear.value;

    tasksContainer.innerHTML = '';

    const filtered = tasks.filter(task => {
        const execsStr = task.executors ? task.executors.map(e => e.name).join(' ') : '';
        const matchesQuery = task.title.toLowerCase().includes(query) ||
                             execsStr.toLowerCase().includes(query) ||
                             (task.no && task.no.toLowerCase().includes(query));

        const matchesStatus = statusVal === 'all' || task.status === statusVal;

        let matchesMonthYear = true;
        if (monthYearVal !== 'all') {
            const [m, y] = monthYearVal.split('-');
            const d = new Date(task.date);
            matchesMonthYear = (d.getMonth() + 1).toString() === m && d.getFullYear().toString() === y;
        }

        return matchesQuery && matchesStatus && matchesMonthYear;
    });

    if (filtered.length === 0) {
        tasksContainer.innerHTML = `
            <div class="text-center text-muted py-5" style="grid-column: 1 / -1;">
                <i class="fa-solid fa-box-open" style="font-size: 3rem; margin-bottom: 12px; color: var(--border-color)"></i>
                <p>Tidak ada surat tugas yang ditemukan.</p>
            </div>
        `;
        return;
    }

    filtered.sort((a,b) => new Date(b.date) - new Date(a.date));

    filtered.forEach(task => {
        const card = document.createElement('div');
        card.className = 'task-card';
        const execNames = task.executors ? task.executors.map(e => e.name).join(', ') : '-';
        card.innerHTML = `
            <div class="task-card-header">
                <span class="task-no-label">${task.no || '-'}</span>
                <span class="badge ${task.status === 'selesai' ? 'badge-green' : 'badge-blue'}">
                    ${task.status === 'selesai' ? 'Selesai' : 'Aktif'}
                </span>
            </div>
            <h3 class="task-card-title">${truncateText(task.title, 60)}</h3>
            <div class="task-card-details">
                <div class="detail-row">
                    <i class="fa-solid fa-users"></i>
                    <span>Pelaksana: <strong>${truncateText(execNames, 40)} (${task.executors ? task.executors.length : 0} Org)</strong></span>
                </div>
                <div class="detail-row">
                    <i class="fa-solid fa-user-tie"></i>
                    <span>PIC: <span>${task.pic}</span></span>
                </div>
                <div class="detail-row">
                    <i class="fa-solid fa-calendar-days"></i>
                    <span>Periode: <span>${formatDateIndo(task.startDate)} s.d ${formatDateIndo(task.endDate)}</span></span>
                </div>
            </div>
            <div class="task-card-actions">
                <button class="btn btn-outline btn-sm btn-edit" onclick="editTask('${task.id}')">
                    <i class="fa-solid fa-pen-to-square"></i> Edit
                </button>
                <div class="action-buttons">
                    <button class="action-btn btn-print" onclick="viewSingleTask('${task.id}')" title="Cetak Surat Tugas">
                        <i class="fa-solid fa-print"></i>
                    </button>
                    <button class="action-btn btn-delete" onclick="deleteTask('${task.id}')" title="Hapus">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </div>
        `;
        tasksContainer.appendChild(card);
    });
}

// Format Date to Indonesia Standard: 23 Juni 2026
function formatDateIndo(dateStr) {
    if (!dateStr) return '-';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const year = parts[0];
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    return `${day} ${indonesianMonths[month - 1]} ${year}`;
}

// Truncate long descriptions
function truncateText(str, n) {
    if (!str) return '';
    return (str.length > n) ? str.substr(0, n - 1) + '...' : str;
}

// Generate document for Individual Letter printing (NO ASSIGNMENT NUMBER DISPLAYED)
window.viewSingleTask = function(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const printableHtml = generateSingleTaskHtml(task);
    
    // Inject into preview modal
    document.getElementById('single-report-content').innerHTML = printableHtml;
    
    // Open preview modal
    modalViewTask.classList.add('active');
    
    // Bind printing trigger
    btnPrintSingle.onclick = () => {
        printArea.innerHTML = printableHtml;
        window.print();
    };
};

function generateSingleTaskHtml(task) {
    // Generate list of executors in official table
    let executorsRows = '';
    if (task.executors && task.executors.length > 0) {
        task.executors.forEach((exec, idx) => {
            executorsRows += `
                <tr>
                    <td style="width: 140px; padding: 4px 0; vertical-align: top;">Nama Pelaksana ${idx + 1}</td>
                    <td style="width: 15px; padding: 4px 0; text-align: center; vertical-align: top;">:</td>
                    <td style="padding: 4px 0; vertical-align: top;"><strong>${exec.name}</strong></td>
                </tr>
                <tr>
                    <td style="padding: 4px 0; vertical-align: top; text-indent: 15px;">Peran/Jabatan</td>
                    <td style="padding: 4px 0; text-align: center; vertical-align: top;">:</td>
                    <td style="padding: 4px 0; vertical-align: top;">${exec.role || '-'}</td>
                </tr>
                ${exec.nip ? `
                <tr>
                    <td style="padding: 4px 0; vertical-align: top; text-indent: 15px;">NIP / ID</td>
                    <td style="padding: 4px 0; text-align: center; vertical-align: top;">:</td>
                    <td style="padding: 4px 0; vertical-align: top;">${exec.nip}</td>
                </tr>` : ''}
                <tr><td colspan="3" style="height: 6px;"></td></tr>
            `;
        });
    }

    const activitiesContent = task.activitiesHtml ? task.activitiesHtml : '<p class="text-muted">Belum ada rincian kegiatan yang dilaporkan.</p>';

    // NOTE: Nomor Surat is omitted from printout here (No assignment number displayed)
    return `
        <div class="paper-document">
            <!-- Kop Surat -->
            <div class="kop-surat">
                <div class="kop-instansi">PEMERINTAH KABUPATEN / KOTA</div>
                <div class="kop-dinas">DINAS PENDIDIKAN DAN KEBUDAYAAN</div>
                <div class="kop-alamat">Jalan Pendidikan Raya No. 45 Telp. (021) 888777 - Fax. (021) 888999 Kode Pos 10230</div>
            </div>

            <!-- Title -->
            <div class="doc-title-box">
                <div class="doc-title">SURAT TUGAS</div>
            </div>

            <!-- Paragraph Intro -->
            <div class="doc-section">
                Yang bertanda tangan di bawah ini menerangkan bahwa:
            </div>

            <!-- PIC Info -->
            <div class="doc-party">
                <table class="party-table" style="margin-bottom: 0;">
                    <tr>
                        <td style="width: 140px;">Nama Pemberi Tugas</td>
                        <td style="width: 15px; text-align: center;">:</td>
                        <td><strong>${task.pic}</strong></td>
                    </tr>
                    <tr>
                        <td>Jabatan</td>
                        <td>:</td>
                        <td>${task.picTitle || 'Atasan Langsung'}</td>
                    </tr>
                </table>
            </div>

            <!-- Paragraph Transition -->
            <div class="doc-section" style="margin-top: 14px;">
                Dengan ini menugaskan kepada jajaran pelaksana di bawah ini:
            </div>

            <!-- Executors List Info -->
            <div class="doc-party">
                <table class="party-table">
                    <tbody>
                        ${executorsRows}
                    </tbody>
                </table>
            </div>

            <!-- Task Description Section -->
            <div class="doc-section">
                Untuk melaksanakan tugas: <strong>${task.title}</strong> yang terhitung mulai dari tanggal <strong>${formatDateIndo(task.startDate)}</strong> sampai dengan <strong>${formatDateIndo(task.endDate)}</strong>.
            </div>

            <!-- Uraian Hasil Kegiatan (Laporan) -->
            <div class="doc-section" style="margin-top: 24px; border-top: 1px solid #111; padding-top: 16px; page-break-inside: avoid;">
                <h3 style="font-family: Arial, sans-serif; font-size: 11pt; font-weight: bold; margin-bottom: 10px; text-transform: uppercase;">LAPORAN HASIL PELAKSANAAN KEGIATAN:</h3>
                <div style="font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: black; text-align: justify;">
                    ${activitiesContent}
                </div>
            </div>

            <div class="doc-section" style="margin-top: 20px;">
                Demikian surat tugas ini dibuat untuk dilaksanakan dengan penuh tanggung jawab dan digunakan sebagaimana mestinya.
            </div>

        </div>
    `;
}

// Laporan Tab (Monthly Print compilation logic)
function setupReportForm() {
    populateReportYearFilter();

    btnGenerateReport.addEventListener('click', () => {
        generateMonthlyReport();
    });
}

function populateReportYearFilter() {
    reportYear.innerHTML = '';
    const currentYear = new Date().getFullYear();
    const years = [currentYear, currentYear - 1, currentYear + 1];
    
    tasks.forEach(task => {
        const d = new Date(task.date);
        if (!isNaN(d.getTime())) {
            const y = d.getFullYear();
            if (!years.includes(y)) years.push(y);
        }
    });

    years.sort((a,b) => b - a);

    years.forEach(y => {
        const opt = document.createElement('option');
        opt.value = y;
        opt.innerText = y;
        reportYear.appendChild(opt);
    });
}

function generateMonthlyReport() {
    const selectedMonth = parseInt(reportMonth.value, 10);
    const selectedYear = parseInt(reportYear.value, 10);

    const monthlyTasks = tasks.filter(task => {
        const d = new Date(task.date);
        return (d.getMonth() + 1) === selectedMonth && d.getFullYear() === selectedYear;
    });

    if (monthlyTasks.length === 0) {
        alert("Tidak ada data surat tugas yang tercatat pada bulan & tahun ini.");
        reportPreviewContainer.style.display = 'none';
        return;
    }

    const reportHtml = compileMonthlyReportHtml(monthlyTasks, selectedMonth, selectedYear);
    
    // Inject and display preview
    monthlyReportContent.innerHTML = reportHtml;
    reportPreviewContainer.style.display = 'block';
    
    reportPreviewContainer.scrollIntoView({ behavior: 'smooth' });

    // Print event
    btnPrintMonthly.onclick = () => {
        printArea.innerHTML = reportHtml;
        window.print();
    };
}

// NOTE: No. Surat Tugas column has been removed from monthly report table (No assignment number displayed)
function compileMonthlyReportHtml(monthlyTasks, month, year) {
    let tableRows = '';
    let counter = 1;

    monthlyTasks.forEach(task => {
        let execCell = '';
        if (task.executors && task.executors.length > 0) {
            task.executors.forEach((e, i) => {
                execCell += `${i + 1}. ${e.name} <span style="font-size: 0.8rem; color:#444;">(${e.role})${e.nip ? ` - NIP: ${e.nip}` : ''}</span><br>`;
            });
        } else {
            execCell = '-';
        }

        const activitiesContent = task.activitiesHtml ? task.activitiesHtml : '<em style="color:#666;">Belum melaporkan rincian hasil kegiatan.</em>';

        tableRows += `
            <tr>
                <td style="text-align: center; vertical-align: top; font-weight: bold; border-bottom: none !important;">${counter++}</td>
                <td style="vertical-align: top; border-bottom: none !important;">${task.title}</td>
                <td style="vertical-align: top; border-bottom: none !important;">${execCell}</td>
                <td style="text-align: center; vertical-align: top; border-bottom: none !important; font-size: 9.5pt;">
                    ${formatDateIndo(task.startDate)}<br>s/d<br>${formatDateIndo(task.endDate)}
                </td>
            </tr>
            <tr>
                <td colspan="4" class="report-detail-row">
                    <strong>Uraian Hasil Laporan Kegiatan:</strong>
                    <div>${activitiesContent}</div>
                </td>
            </tr>
        `;
    });

    return `
        <div class="monthly-report-paper">
            <div class="monthly-report-header">
                <h2>REKAPITULASI LAPORAN SURAT TUGAS & KEGIATAN</h2>
                <p style="font-weight: bold; margin-bottom: 2px;">PERIODE BULAN: ${indonesianMonths[month-1].toUpperCase()} ${year}</p>
                <hr style="border: 1px solid black; margin-top: 10px; margin-bottom: 20px;">
            </div>

            <table class="activities-table">
                <thead>
                    <tr>
                        <th style="width: 40px;">No</th>
                        <th>Judul / Tugas Mandat</th>
                        <th>Daftar Pelaksana & Peran</th>
                        <th style="width: 140px;">Masa Tugas</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>

            <div style="display: flex; justify-content: flex-end; margin-top: 50px; font-size: 11pt; page-break-inside: avoid;">
                <div style="text-align: right;">
                    <div>Jakarta, ${new Date().getDate()} ${indonesianMonths[new Date().getMonth()]} ${new Date().getFullYear()}</div>
                    <div style="font-weight: bold; margin-bottom: 60px; padding-right: 30px;">Pengelola Data Kepegawaian</div>
                    <div style="font-weight: bold; text-decoration: underline; padding-right: 30px;">Admin Ajuan ST</div>
                    <div style="padding-right: 30px;">ID Staff: 2026-AJUANST</div>
                </div>
            </div>
        </div>
    `;
}

// Backup & Restore Logic
function setupBackupRestore() {
    // Export Event
    btnExport.addEventListener('click', () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks, null, 4));
        const downloadAnchor = document.createElement('a');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `backup_surat_tugas_${timestamp}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        alert("Cadangan JSON berhasil diekspor! Periksa folder unduhan (Downloads) di HP Anda.");
    });

    // Import Event triggers
    btnTriggerImport.addEventListener('click', () => {
        importFileInput.click();
    });

    importFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(evt) {
            try {
                const importedData = JSON.parse(evt.target.result);
                
                if (Array.isArray(importedData)) {
                    if (confirm(`Apakah Anda yakin ingin memulihkan cadangan? Ini akan menggantikan ${tasks.length} data saat ini dengan ${importedData.length} data cadangan.`)) {
                        tasks = importedData;
                        
                        tasks.forEach(t => {
                            if (t.executor) {
                                t.executors = [{ name: t.executor, role: "Pelaksana", nip: t.executorNip || "" }];
                                delete t.executor;
                                delete t.executorNip;
                            }
                            if (t.activities && !t.activitiesHtml) {
                                let html = "<ul>";
                                t.activities.forEach(act => {
                                    html += `<li>${act.text}</li>`;
                                });
                                html += "</ul>";
                                t.activitiesHtml = html;
                                delete t.activities;
                            }
                        });

                        saveToStorage();
                        alert("Data cadangan berhasil dipulihkan!");
                        
                        updateDashboardStats();
                        updateStorageInfo();
                    }
                } else {
                    alert("Format file tidak valid. File backup harus berisi data array surat tugas.");
                }
            } catch (err) {
                alert("Gagal membaca file backup. Pastikan file berformat JSON yang valid.");
                console.error(err);
            }
        };
        reader.readAsText(file);
        importFileInput.value = '';
    });

    // Clear Data Event
    btnClearData.addEventListener('click', () => {
        if (confirm("PERINGATAN: Tindakan ini akan menghapus SELURUH data surat tugas dari browser ini secara permanen. Apakah Anda yakin?")) {
            if (confirm("Apakah Anda benar-benar yakin ingin menghapus data? Tindakan ini tidak dapat diurungkan.")) {
                tasks = [];
                saveToStorage();
                alert("Semua data berhasil dibersihkan!");
                updateDashboardStats();
                updateStorageInfo();
            }
        }
    });
}
