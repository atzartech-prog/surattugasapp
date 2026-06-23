// State Management
let tasks = [];

// DOM Elements
const tabs = document.querySelectorAll('.nav-item');
const tabContents = document.querySelectorAll('.tab-content');
const pageTitle = document.getElementById('page-title');
const pageSubtitle = document.getElementById('page-subtitle');

// Modals
const modalTaskForm = document.getElementById('modal-task-form');
const modalViewTask = document.getElementById('modal-view-task');
const formTask = document.getElementById('task-form');
const btnCloseModal = document.getElementById('btn-close-modal');
const btnCloseView = document.getElementById('btn-close-view');
const btnCancelModal = document.getElementById('btn-cancel-modal');
const btnAddShortcut = document.getElementById('btn-add-shortcut');

// Inputs
const inputTaskId = document.getElementById('task-id');
const inputTaskNo = document.getElementById('task-no');
const inputTaskDate = document.getElementById('task-date');
const inputTaskTitle = document.getElementById('task-title');
const inputTaskPic = document.getElementById('task-pic');
const inputTaskPicTitle = document.getElementById('task-pic-title');
const inputTaskExecutor = document.getElementById('task-executor');
const inputTaskExecutorNip = document.getElementById('task-executor-nip');
const inputTaskStartDate = document.getElementById('task-start-date');
const inputTaskEndDate = document.getElementById('task-end-date');
const inputTaskStatus = document.getElementById('task-status');
const activitiesContainer = document.getElementById('activities-list-container');
const btnAddActivityRow = document.getElementById('btn-add-activity-row');

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

// Sample Initial Data
const sampleData = [
    {
        id: "ts-1",
        no: "094/012/ST/VI/2026",
        title: "Monitoring dan Evaluasi Pembelajaran Kelas Digital di SMA Negeri 1",
        date: "2026-06-15",
        pic: "Dr. H. Ahmad Fauzi, M.Pd.",
        picTitle: "Kepala Dinas Pendidikan",
        executor: "Budi Santoso, S.Kom.",
        executorNip: "19881023 201504 1 002",
        startDate: "2026-06-16",
        endDate: "2026-06-18",
        status: "selesai",
        activities: [
            { text: "Melakukan koordinasi dengan Kepala Sekolah SMA Negeri 1." },
            { text: "Mengobservasi kegiatan belajar mengajar di 3 laboratorium komputer." },
            { text: "Mengecek kelayakan infrastruktur server dan wifi sekolah." },
            { text: "Memberikan bimbingan teknis penggunaan platform e-learning kepada guru." }
        ]
    },
    {
        id: "ts-2",
        no: "094/015/ST/VI/2026",
        title: "Sosialisasi Keamanan Informasi dan Data Instansi Pemerintah",
        date: "2026-06-20",
        pic: "Dr. H. Ahmad Fauzi, M.Pd.",
        picTitle: "Kepala Dinas Pendidikan",
        executor: "Ahmad Subari, M.T.",
        executorNip: "19850112 201012 1 001",
        startDate: "2026-06-24",
        endDate: "2026-06-26",
        status: "aktif",
        activities: [
            { text: "Mempersiapkan materi sosialisasi keamanan siber." },
            { text: "Melakukan sosialisasi di Aula Kantor Wilayah." }
        ]
    }
];

// App Initialization
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    setupNavigation();
    setupForm();
    setupFilters();
    setupReportForm();
    setupBackupRestore();
    updateDashboardStats();
    updateStorageInfo();
});

// Load data from LocalStorage
function loadData() {
    const localData = localStorage.getItem('surat_tugas_db');
    if (localData) {
        try {
            tasks = JSON.parse(localData);
        } catch (e) {
            console.error("Error parsing localStorage data, loading sample data instead.", e);
            tasks = [...sampleData];
            saveToStorage();
        }
    } else {
        tasks = [...sampleData];
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
        tr.innerHTML = `
            <td><strong>${task.no}</strong></td>
            <td>${truncateText(task.title, 40)}</td>
            <td>${task.executor}</td>
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

    // Add Activity Row
    btnAddActivityRow.addEventListener('click', () => addActivityRow());

    // Submit Form
    formTask.addEventListener('submit', (e) => {
        e.preventDefault();
        saveTask();
    });
}

function openTaskFormModal(task = null) {
    formTask.reset();
    activitiesContainer.innerHTML = '';
    
    if (task) {
        // Edit Mode
        document.getElementById('modal-title').innerText = "Edit Surat Tugas";
        inputTaskId.value = task.id;
        inputTaskNo.value = task.no;
        inputTaskDate.value = task.date;
        inputTaskTitle.value = task.title;
        inputTaskPic.value = task.pic;
        inputTaskPicTitle.value = task.picTitle || '';
        inputTaskExecutor.value = task.executor;
        inputTaskExecutorNip.value = task.executorNip || '';
        inputTaskStartDate.value = task.startDate;
        inputTaskEndDate.value = task.endDate;
        inputTaskStatus.value = task.status;

        // Load activities
        if (task.activities && task.activities.length > 0) {
            task.activities.forEach(act => addActivityRow(act.text));
        } else {
            addActivityRow(); // default one row
        }
    } else {
        // New Mode
        document.getElementById('modal-title').innerText = "Tambah Surat Tugas Baru";
        inputTaskId.value = '';
        inputTaskDate.value = new Date().toISOString().substring(0, 10);
        inputTaskStartDate.value = new Date().toISOString().substring(0, 10);
        inputTaskEndDate.value = new Date().toISOString().substring(0, 10);
        addActivityRow(); // default one row
    }
    
    modalTaskForm.classList.add('active');
}

function addActivityRow(val = '') {
    const div = document.createElement('div');
    div.className = 'activity-input-row';
    div.innerHTML = `
        <input type="text" class="form-control activity-item" required placeholder="Uraian kegiatan..." value="${val}">
        <button type="button" class="action-btn btn-delete remove-activity-row" title="Hapus Baris">
            <i class="fa-solid fa-trash"></i>
        </button>
    `;
    
    // Bind deletion click
    div.querySelector('.remove-activity-row').addEventListener('click', () => {
        div.remove();
    });
    
    activitiesContainer.appendChild(div);
}

function closeModal() {
    modalTaskForm.classList.remove('active');
    modalViewTask.classList.remove('active');
}

function saveTask() {
    const id = inputTaskId.value || 'ts-' + Date.now();
    
    // Get all activity input values
    const activityInputs = document.querySelectorAll('.activity-item');
    const activities = Array.from(activityInputs)
        .map(input => ({ text: input.value.trim() }))
        .filter(act => act.text !== '');

    const taskData = {
        id,
        no: inputTaskNo.value,
        date: inputTaskDate.value,
        title: inputTaskTitle.value,
        pic: inputTaskPic.value,
        picTitle: inputTaskPicTitle.value,
        executor: inputTaskExecutor.value,
        executorNip: inputTaskExecutorNip.value,
        startDate: inputTaskStartDate.value,
        endDate: inputTaskEndDate.value,
        status: inputTaskStatus.value,
        activities
    };

    const existingIndex = tasks.findIndex(t => t.id === id);
    if (existingIndex > -1) {
        // Edit existing
        tasks[existingIndex] = taskData;
    } else {
        // Create new
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

// Edit handler accessible by global function
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
    const uniqueMonths = []; // format: "MM-YYYY"
    
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

    // Sort chronologically reverse
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
        // Title or name query match
        const matchesQuery = task.title.toLowerCase().includes(query) ||
                             task.executor.toLowerCase().includes(query) ||
                             task.no.toLowerCase().includes(query);

        // Status match
        const matchesStatus = statusVal === 'all' || task.status === statusVal;

        // Month-Year match
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

    // Sort newest first
    filtered.sort((a,b) => new Date(b.date) - new Date(a.date));

    filtered.forEach(task => {
        const card = document.createElement('div');
        card.className = 'task-card';
        card.innerHTML = `
            <div class="task-card-header">
                <span class="task-no-label">${task.no}</span>
                <span class="badge ${task.status === 'selesai' ? 'badge-green' : 'badge-blue'}">
                    ${task.status === 'selesai' ? 'Selesai' : 'Aktif'}
                </span>
            </div>
            <h3 class="task-card-title">${truncateText(task.title, 60)}</h3>
            <div class="task-card-details">
                <div class="detail-row">
                    <i class="fa-solid fa-circle-user"></i>
                    <span>Pelaksana: <strong>${task.executor}</strong></span>
                </div>
                <div class="detail-row">
                    <i class="fa-solid fa-user-tie"></i>
                    <span>PIC: <span>${task.pic}</span></span>
                </div>
                <div class="detail-row">
                    <i class="fa-solid fa-calendar-days"></i>
                    <span>Periode: <span>${formatDateIndo(task.startDate)} s.d ${formatDateIndo(task.endDate)}</span></span>
                </div>
                <div class="detail-row">
                    <i class="fa-solid fa-list-check"></i>
                    <span>Uraian: <strong>${task.activities ? task.activities.length : 0} kegiatan</strong></span>
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
    return (str.length > n) ? str.substr(0, n - 1) + '...' : str;
}

// Generate document for Individual Letter printing
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
    let activitiesRows = '';
    if (task.activities && task.activities.length > 0) {
        task.activities.forEach((act, idx) => {
            activitiesRows += `
                <tr>
                    <td style="text-align: center;">${idx + 1}</td>
                    <td>${act.text}</td>
                </tr>
            `;
        });
    } else {
        activitiesRows = `<tr><td colspan="2" class="text-center text-muted">Tidak ada rincian kegiatan.</td></tr>`;
    }

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
                <div class="doc-number">Nomor: ${task.no}</div>
            </div>

            <!-- Paragraph Intro -->
            <div class="doc-section">
                Yang bertanda tangan di bawah ini menerangkan bahwa:
            </div>

            <!-- PIC Info -->
            <div class="doc-party">
                <table class="party-table">
                    <tr>
                        <td>Nama</td>
                        <td>:</td>
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
            <div class="doc-section">
                Dengan ini menugaskan kepada pelaksana di bawah ini:
            </div>

            <!-- Executor Info -->
            <div class="doc-party">
                <table class="party-table">
                    <tr>
                        <td>Nama Pelaksana</td>
                        <td>:</td>
                        <td><strong>${task.executor}</strong></td>
                    </tr>
                    ${task.executorNip ? `
                    <tr>
                        <td>NIP / ID</td>
                        <td>:</td>
                        <td>${task.executorNip}</td>
                    </tr>` : ''}
                </table>
            </div>

            <!-- Task Description Section -->
            <div class="doc-section">
                Untuk melaksanakan tugas: <strong>${task.title}</strong> yang terhitung mulai dari tanggal <strong>${formatDateIndo(task.startDate)}</strong> sampai dengan <strong>${formatDateIndo(task.endDate)}</strong>.
            </div>

            <!-- Laporan Kegiatan (Activities List table) -->
            <div class="doc-section" style="margin-top: 24px;">
                Adapun laporan rincian kegiatan selama masa pelaksanaan tugas tersebut adalah sebagai berikut:
                <table class="activities-table">
                    <thead>
                        <tr>
                            <th style="width: 50px;">No</th>
                            <th>Uraian Deskripsi Kegiatan</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${activitiesRows}
                    </tbody>
                </table>
            </div>

            <div class="doc-section">
                Demikian surat tugas ini dibuat untuk dilaksanakan dengan penuh tanggung jawab dan digunakan sebagaimana mestinya.
            </div>

            <!-- Signature Section -->
            <div class="signature-section">
                <div class="signature-box">
                    <div class="sig-date">Jakarta, ${formatDateIndo(task.date)}</div>
                    <div class="sig-title">${task.picTitle || 'Pemberi Tugas'}</div>
                    <div class="sig-name">${task.pic}</div>
                    ${task.executorNip ? '<div class="sig-nip">Pangkat Pembina Utama</div>' : ''}
                </div>
            </div>
        </div>
    `;
}

// Laporan Tab (Monthly Print compilation logic)
function setupReportForm() {
    // Populate Years dynamically
    populateReportYearFilter();

    btnGenerateReport.addEventListener('click', () => {
        generateMonthlyReport();
    });
}

function populateReportYearFilter() {
    reportYear.innerHTML = '';
    
    // Add current year as option
    const currentYear = new Date().getFullYear();
    const years = [currentYear, currentYear - 1, currentYear + 1];
    
    // Collect years from tasks
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

    // Filter tasks that belong to the selected month and year based on date
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
    
    // Smooth scroll to preview
    reportPreviewContainer.scrollIntoView({ behavior: 'smooth' });

    // Print event
    btnPrintMonthly.onclick = () => {
        printArea.innerHTML = reportHtml;
        window.print();
    };
}

function compileMonthlyReportHtml(monthlyTasks, month, year) {
    let tableRows = '';
    let counter = 1;

    // Group activities of all filtered tasks
    monthlyTasks.forEach(task => {
        const rowSpan = task.activities && task.activities.length > 0 ? task.activities.length : 1;
        
        // Render first activity row with main task info
        const firstActivityText = task.activities && task.activities.length > 0 ? task.activities[0].text : 'Belum melaporkan uraian kegiatan.';
        
        tableRows += `
            <tr>
                <td rowspan="${rowSpan}" style="text-align: center; vertical-align: top;">${counter++}</td>
                <td rowspan="${rowSpan}" style="vertical-align: top;">
                    <strong>${task.no}</strong><br>
                    <span style="font-size: 0.85rem; color: #555;">Tgl: ${formatDateIndo(task.date)}</span>
                </td>
                <td rowspan="${rowSpan}" style="vertical-align: top;">${task.title}</td>
                <td rowspan="${rowSpan}" style="vertical-align: top;">
                    <strong>${task.executor}</strong><br>
                    <span style="font-size: 0.85rem; color: #555;">NIP: ${task.executorNip || '-'}</span>
                </td>
                <td rowspan="${rowSpan}" style="text-align: center; vertical-align: top;">
                    <span style="font-size: 0.85rem;">${formatDateIndo(task.startDate)}<br>s/d<br>${formatDateIndo(task.endDate)}</span>
                </td>
                <td style="vertical-align: top;">${firstActivityText}</td>
            </tr>
        `;

        // Render remaining activity rows for the same task
        if (task.activities && task.activities.length > 1) {
            for (let i = 1; i < task.activities.length; i++) {
                tableRows += `
                    <tr>
                        <td style="vertical-align: top;">${task.activities[i].text}</td>
                    </tr>
                `;
            }
        }
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
                        <th style="width: 140px;">No. Surat Tugas</th>
                        <th>Judul/Tugas Mandat</th>
                        <th style="width: 160px;">Pelaksana</th>
                        <th style="width: 120px;">Periode Pelaksanaan</th>
                        <th>Uraian Hasil Kegiatan (Laporan)</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>

            <div style="display: flex; justify-content: space-between; margin-top: 50px; font-size: 11pt; page-break-inside: avoid;">
                <div>
                    <div>Mengetahui,</div>
                    <div style="font-weight: bold; margin-bottom: 60px;">Kepala Dinas Pendidikan</div>
                    <div style="font-weight: bold; text-decoration: underline;">Dr. H. Ahmad Fauzi, M.Pd.</div>
                    <div>NIP. 19720421 199803 1 001</div>
                </div>
                <div style="text-align: right;">
                    <div>Jakarta, ${new Date().getDate()} ${indonesianMonths[new Date().getMonth()]} ${new Date().getFullYear()}</div>
                    <div style="font-weight: bold; margin-bottom: 60px; padding-right: 30px;">Pengelola Data Kepegawaian</div>
                    <div style="font-weight: bold; text-decoration: underline; padding-right: 30px;">Admin TugasKu</div>
                    <div style="padding-right: 30px;">ID Staff: 2026-TUGASKU</div>
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
                
                // Simple validation
                if (Array.isArray(importedData)) {
                    if (confirm(`Apakah Anda yakin ingin memulihkan cadangan? Ini akan menggantikan ${tasks.length} data saat ini dengan ${importedData.length} data cadangan.`)) {
                        tasks = importedData;
                        saveToStorage();
                        alert("Data cadangan berhasil dipulihkan!");
                        
                        // Force refresh stats
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
        // Reset file input value
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
