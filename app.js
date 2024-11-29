// Cookie functions
function setCookie(name, value, days) {
    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))}; max-age=${maxAge}; path=/; SameSite=Strict`;
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        const cookieValue = parts.pop().split(';').shift();
        try {
            return JSON.parse(decodeURIComponent(cookieValue));
        } catch (e) {
            return null;
        }
    }
    return null;
}

// Initialize data structure
let grades = getCookie('grades');
if (!grades) {
    grades = {};
}

let defaultGrades = JSON.parse(localStorage.getItem('defaultGrades'));

// If no grades in cookie, use default grades if available
if (!grades) {
    grades = defaultGrades || {};  // Start with empty grades object
    setCookie('grades', grades, 3650);
}

let chart = null;

// Default subject colors
const DEFAULT_COLORS = {
    'Mathematics': '#3498db',  // light blue
    'German': '#1a237e',      // dark blue
    'English': '#ffa000',     // golden orange
    'French': '#9c27b0',      // purple
    'Economy & Law': '#2e7d32' // green
};

// Initialize subject colors from localStorage or use defaults
let subjectColors = JSON.parse(localStorage.getItem('subjectColors'));
if (!subjectColors) {
    subjectColors = { ...DEFAULT_COLORS };  // Create a fresh copy of default colors
    localStorage.setItem('subjectColors', JSON.stringify(subjectColors));
}

// Grade color thresholds
const GRADE_COLORS = {
    fail: '#ff4444',
    warning: '#ffa600',
    success: '#00C851'
};

function getGradeColor(grade) {
    const theme = document.documentElement.getAttribute('data-theme');
    const gradeNum = parseFloat(grade);
    
    if (gradeNum < 4.0) {
        return getComputedStyle(document.documentElement).getPropertyValue('--fail-color').trim();
    } else if (gradeNum <= 4.5) {
        return getComputedStyle(document.documentElement).getPropertyValue('--warning-color').trim();
    } else {
        return getComputedStyle(document.documentElement).getPropertyValue('--success-color').trim();
    }
}

// DOM Elements
const addSubjectForm = document.getElementById('addSubjectForm');
const subjectsTableBody = document.getElementById('subjectsTableBody');
const overallAverageElement = document.getElementById('overallAverage');
const totalGradesElement = document.getElementById('totalGrades');
const gradeChart = document.getElementById('gradeChart');
const themeToggle = document.getElementById('themeToggle');

// Theme handling
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggle.checked = savedTheme === 'dark';
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update chart theme
    updateChartTheme(newTheme);
}

function updateChartTheme(theme) {
    if (!chart) return;
    
    const textColor = theme === 'dark' ? '#e0e0e0' : '#2d3436';
    const gridColor = theme === 'dark' ? '#404040' : '#dfe6e9';
    
    chart.options.scales.x.grid.color = gridColor;
    chart.options.scales.y.grid.color = gridColor;
    chart.options.scales.x.ticks.color = textColor;
    chart.options.scales.y.ticks.color = textColor;
    chart.options.plugins.legend.labels.color = textColor;
    
    // Force legend update with new text color
    const currentLabels = chart.options.plugins.legend.labels.generateLabels(chart);
    currentLabels.forEach(label => {
        label.color = textColor;
    });
    
    chart.update();
}

// Initialize color inputs
function initializeColorInputs() {
    Object.entries(subjectColors).forEach(([subject, color]) => {
        const input = document.querySelector(`input[data-subject="${subject}"]`);
        if (input) {
            input.value = color;
            input.addEventListener('change', (e) => {
                subjectColors[subject] = e.target.value;
                localStorage.setItem('subjectColors', JSON.stringify(subjectColors));
                updateChart();
            });
        }
    });
}

// Initialize Chart
function initializeChart() {
    const ctx = gradeChart.getContext('2d');
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const textColor = currentTheme === 'dark' ? '#e0e0e0' : '#2d3436';
    const gridColor = currentTheme === 'dark' ? '#404040' : '#dfe6e9';
    
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: []
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    min: 1,
                    max: 6,
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        stepSize: 0.5,
                        callback: value => value.toFixed(2),
                        color: textColor
                    }
                },
                x: {
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45,
                        color: textColor
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        boxWidth: 6,
                        padding: 15,
                        font: {
                            size: 11
                        },
                        color: textColor,
                        pointStyle: 'circle',
                        useBorderRadius: true,
                        borderRadius: 2,
                        generateLabels: function(chart) {
                            const datasets = chart.data.datasets;
                            const currentTheme = document.documentElement.getAttribute('data-theme');
                            const labelColor = currentTheme === 'dark' ? '#e0e0e0' : '#2d3436';
                            return datasets.map(dataset => ({
                                text: '\u2000' + dataset.label,
                                fillStyle: dataset.backgroundColor,
                                strokeStyle: dataset.borderColor,
                                lineWidth: 2,
                                hidden: !chart.isDatasetVisible(datasets.indexOf(dataset)),
                                index: datasets.indexOf(dataset),
                                usePointStyle: true,
                                pointStyle: 'circle',
                                color: labelColor
                            }));
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.raw.toFixed(2)}`;
                        }
                    }
                }
            }
        }
    });
}

// Update Chart with latest grades
function updateChart() {
    const timestamps = new Set();
    Object.entries(grades).forEach(([subject, subjectGrades]) => {
        subjectGrades.forEach((_, index) => {
            timestamps.add(index + 1);
        });
    });
    const sortedTimestamps = Array.from(timestamps).sort((a, b) => a - b);

    const datasets = Object.entries(grades).map(([subject, subjectGrades]) => {
        const data = sortedTimestamps.map(timestamp => {
            return subjectGrades[timestamp - 1] || null;
        });

        return {
            label: subject,
            data: data,
            borderColor: subjectColors[subject],
            backgroundColor: subjectColors[subject],
            tension: 0.4,
            fill: false,
            spanGaps: true
        };
    });

    chart.data.labels = sortedTimestamps.map(t => `Grade ${t}`);
    chart.data.datasets = datasets;
    chart.update();
}

// Calculate subject average
function calculateSubjectAverage(grades) {
    if (!grades || grades.length === 0) return 0;
    return grades.reduce((sum, grade) => sum + grade, 0) / grades.length;
}

// Calculate and update overall average
function updateOverallAverage() {
    const allGrades = Object.values(grades).flat();
    if (allGrades.length === 0) {
        overallAverageElement.textContent = '--';
        overallAverageElement.className = 'big-number';
        return;
    }
    
    const average = allGrades.reduce((sum, grade) => sum + grade, 0) / allGrades.length;
    overallAverageElement.textContent = average.toFixed(2);
    overallAverageElement.className = `big-number grade-${average < 4.0 ? 'fail' : average <= 4.5 ? 'warning' : 'success'}`;
}

// Update total grades count
function updateTotalGrades() {
    const totalGrades = Object.values(grades).reduce((sum, grades) => sum + grades.length, 0);
    totalGradesElement.textContent = totalGrades;
}

// Render subjects table
function renderSubjectsTable() {
    const tbody = document.getElementById('subjectsTableBody');
    tbody.innerHTML = '';

    Object.entries(grades).forEach(([subject, subjectGrades]) => {
        if (subjectGrades.length > 0) {
            const tr = document.createElement('tr');
            const average = calculateSubjectAverage(subjectGrades);
            
            // Create grade pills with delete buttons
            const gradePills = subjectGrades.map((grade, index) => {
                return `
                    <span class="grade-pill">
                        ${grade}
                        <button class="delete-grade-btn" data-subject="${subject}" data-index="${index}">×</button>
                    </span>
                `;
            }).join(' ');

            tr.innerHTML = `
                <td>${subject}</td>
                <td>${gradePills}</td>
                <td class="${getGradeClass(average)}">${average.toFixed(2)}</td>
                <td>
                    <button class="delete-grade-btn" data-subject="${subject}" data-delete-all>Delete All</button>
                </td>
            `;
            tbody.appendChild(tr);
        }
    });
}

function getGradeClass(grade) {
    if (grade < 4.0) {
        return 'grade-fail';
    } else if (grade <= 4.5) {
        return 'grade-warning';
    } else {
        return 'grade-success';
    }
}

// Add new grade
function addGrade(subject, grade) {
    if (!grades[subject]) {
        grades[subject] = [];
    }
    grades[subject].push(Number(grade));
    setCookie('grades', grades, 3650);  // Save immediately after adding
    updateChart();
    updateOverallAverage();
    updateTotalGrades();
    renderSubjectsTable();
    updateGoalsDisplay();
}

// Delete grade
function deleteGrade(subject, index) {
    grades[subject].splice(index, 1);
    if (grades[subject].length === 0) {
        delete grades[subject];
    }
    setCookie('grades', grades, 3650);  // Save immediately after deleting
    updateOverallAverage();
    updateTotalGrades();
    renderSubjectsTable();
    updateChart();
    updateGoalsDisplay();
}

// Delete all grades for a subject
function deleteAllGrades(subject) {
    if (subject) {
        delete grades[subject];
    } else {
        grades = {};
    }
    setCookie('grades', grades, 3650);  // Save immediately after clearing
    updateOverallAverage();
    updateTotalGrades();
    renderSubjectsTable();
    updateChart();
    updateGoalsDisplay();
}

// Save current grades as default
document.getElementById('saveAsDefault').addEventListener('click', () => {
    if (Object.keys(grades).length === 0) {
        alert('Please add some grades before saving as default.');
        return;
    }
    
    setCookie('grades', grades, 3650);  // Save for 10 years
    alert('✅ Grades have been saved successfully!\n\nNote: A cookie has been created to store your grades. To ensure your grades persist, please add this website to your browser\'s cookie exceptions.');
});

// Calculate required grades to reach target average
function calculateRequiredGrades(currentGrades, targetAverage) {
    if (!currentGrades || currentGrades.length === 0) return null;
    
    const currentSum = currentGrades.reduce((a, b) => a + b, 0);
    const currentCount = currentGrades.length;
    const currentAvg = currentSum / currentCount;
    
    // If already achieved target
    if (currentAvg >= targetAverage) {
        return [{
            grade: null,
            achievable: true,
            message: 'Target already achieved!'
        }];
    }
    
    // Calculate what single grade would be needed
    const requiredGrade = (targetAverage * (currentCount + 1) - currentSum);
    
    // If the required grade is achievable (between 1 and 6)
    if (requiredGrade >= 1 && requiredGrade <= 6) {
        return [{
            grade: requiredGrade.toFixed(2),
            achievable: true,
            message: `Need ${requiredGrade.toFixed(2)} in next test`
        }];
    }
    
    // If we need multiple grades to reach the target
    if (requiredGrade > 6) {
        const gradesNeeded = Math.ceil((requiredGrade - 6) / 2);
        const grades = Array(gradesNeeded + 1).fill(6);
        
        if (grades.length <= 3) {
            return grades.map((grade, index) => ({
                grade: '6.00',
                achievable: true,
                message: `Need 6.00 in test ${index + 1}`
            }));
        } else {
            return [{
                grade: null,
                achievable: false,
                message: `Need ${grades.length} grades of 6.00 to reach target`
            }];
        }
    }
    
    return [{
        grade: null,
        achievable: false,
        message: 'Target already achieved!'
    }];
}

// Update goals display
function updateGoalsDisplay() {
    const goalsContent = document.getElementById('goalsContent');
    goalsContent.innerHTML = '';
    
    Object.entries(grades).forEach(([subject, subjectGrades]) => {
        const currentAvg = calculateSubjectAverage(subjectGrades);
        const row = document.createElement('div');
        row.className = 'goal-row';
        
        let passContent, goodContent;
        
        // For Pass (4.00)
        if (currentAvg >= 4.0) {
            passContent = '<span class="goal-achieved">Already achieved!</span>';
        } else {
            const toPass = calculateRequiredGrades(subjectGrades, 4.0);
            passContent = formatGoals(toPass);
        }
        
        // For Good (4.50)
        if (currentAvg >= 4.5) {
            goodContent = '<span class="goal-achieved">Already achieved!</span>';
        } else {
            const toGood = calculateRequiredGrades(subjectGrades, 4.5);
            goodContent = formatGoals(toGood);
        }
        
        row.innerHTML = `
            <span>${subject}</span>
            <span class="${getGradeClass(currentAvg)}">${currentAvg.toFixed(2)}</span>
            <div class="goal-grades">${passContent}</div>
            <div class="goal-grades">${goodContent}</div>
        `;
        
        goalsContent.appendChild(row);
    });
}

function formatGoals(goals) {
    if (!goals) return '<span class="goal-unreachable">No grades yet</span>';
    
    return goals.map(goal => {
        if (!goal.achievable) {
            return `<span class="goal-unreachable">${goal.message}</span>`;
        }
        if (goal.message.includes('already achieved')) {
            return `<span class="goal-achieved">${goal.message}</span>`;
        }
        return `<span class="goal-grade ${goal.achievable ? 'goal-achievable' : 'goal-unreachable'}">${goal.message}</span>`;
    }).join('');
}

// Event Listeners
addSubjectForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const subject = document.getElementById('subjectSelect').value;
    const grade = document.getElementById('subjectGrade').value;
    addGrade(subject, grade);
    addSubjectForm.reset();
});

themeToggle.addEventListener('change', toggleTheme);

document.getElementById('subjectsTableBody').addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-grade-btn')) {
        const subject = e.target.dataset.subject;
        if (e.target.dataset.deleteAll) {
            if (confirm(`Are you sure you want to delete all grades for ${subject}?`)) {
                deleteAllGrades(subject);
            }
        } else {
            const index = parseInt(e.target.dataset.index);
            deleteGrade(subject, index);
        }
    }
});

document.getElementById('deleteAllGrades').addEventListener('click', () => {
    if (confirm('Are you sure you want to delete all grades for all subjects?')) {
        deleteAllGrades();
    }
});

// Initialize the application
window.addEventListener('load', () => {
    // Load saved grades from cookie
    grades = getCookie('grades') || {};
    
    // Initialize components
    initializeTheme();
    initializeChart();
    initializeColorInputs();
    
    // Update UI with loaded data
    updateOverallAverage();
    updateTotalGrades();
    renderSubjectsTable();
    updateChart();
    updateGoalsDisplay();
});