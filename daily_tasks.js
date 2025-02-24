const fs = require("fs");

// Simpan batas harian
const limits = {
  autolike: 120,
  autounfriend: 50,
  autoaddfriend: 50,
  autoconfirm: 50,
  autoaddfriend_linkpost: 50,
};

// Load progress tugas dari file
let taskData = {};
try {
  taskData = JSON.parse(fs.readFileSync("task_progress.json", "utf8")) || {};
} catch (error) {
  console.log("📂 File task_progress.json tidak ditemukan, membuat baru...");
  taskData = {};
}

// Reset tugas setiap hari
let lastRunDate = taskData.lastRunDate || "";
let currentDate = new Date().toISOString().split("T")[0];

if (lastRunDate !== currentDate) {
  console.log("🔄 Reset batas harian...");
  taskData = { lastRunDate: currentDate };
}

// Variabel untuk memastikan hanya satu task berjalan dalam satu waktu
let activeTask = null;

async function runTask(taskName, taskFunction) {
  if (taskData[taskName] >= limits[taskName]) {
    console.log(`✅ Batas harian ${taskName} tercapai (${limits[taskName]}), berhenti.`);
    return;
  }

  if (activeTask !== null && taskName !== "autolike") {
    console.log(`⏳ ${taskName} menunggu karena ${activeTask} sedang berjalan...`);
    return;
  }

  activeTask = taskName;
  console.log(`🔹 Menjalankan ${taskName}...`);
  
  await taskFunction();

  taskData[taskName] = (taskData[taskName] || 0) + 1;
  fs.writeFileSync("task_progress.json", JSON.stringify(taskData, null, 2));

  console.log(`✅ ${taskName} selesai.`);
  activeTask = null; // Reset setelah selesai
}

// Jalankan autolike setiap hari (tidak terpengaruh task lain)
(async () => {
  await runTask("autolike", require("./autolike"));
})();

// Jalankan tugas lain dengan aturan satu task dalam satu waktu
(async () => {
  await runTask("autounfriend", require("./autounfriend"));
  await runTask("autoaddfriend", require("./autoaddfriend"));
  await runTask("autoconfirm", require("./autoconfirm"));
  await runTask("autoaddfriend_linkpost", require("./autoaddfriend_linkpost"));
})();
