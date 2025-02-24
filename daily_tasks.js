const fs = require("fs");

// Simpan batas harian ke IndexedDB (atau file JSON sementara)
const limits = {
  autolike: 120,
  autounfriend: 50,
  autoaddfriend: 50,
  autoconfirm: 50,
};

let taskData = JSON.parse(fs.readFileSync("task_progress.json", "utf8") || "{}");

async function runTask(taskName, taskFunction) {
  if (taskData[taskName] >= limits[taskName]) {
    console.log(`✅ Batas harian ${taskName} tercapai (${limits[taskName]}), berhenti.`);
    return;
  }

  console.log(`🔹 Menjalankan ${taskName}...`);
  await taskFunction();

  taskData[taskName] = (taskData[taskName] || 0) + 1;
  fs.writeFileSync("task_progress.json", JSON.stringify(taskData, null, 2));
}

// Reset tugas setiap hari
let lastRunDate = taskData.lastRunDate || "";
let currentDate = new Date().toISOString().split("T")[0];

if (lastRunDate !== currentDate) {
  console.log("🔄 Reset batas harian...");
  taskData = { lastRunDate: currentDate };
}

// Jalankan tugas harian
(async () => {
  await runTask("autolike", require("./autolike"));
  await runTask("autounfriend", require("./autounfriend"));
  await runTask("autoaddfriend", require("./autoaddfriend"));
  await runTask("autoconfirm", require("./autoconfirm"));
})();
