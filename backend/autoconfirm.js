// 🔹 Simpan akun login ke IndexedDB
async function saveCookies() {
    let cookieString = document.getElementById("cookieInput").value;
    if (!cookieString) {
        alert("Masukkan cookies terlebih dahulu!");
        return;
    }

    let cookies = cookieString.split("; ").map((c) => {
        let [name, value] = c.split("=");
        return { name, value, domain: ".facebook.com" };
    });

    let accountName = prompt("Masukkan nama akun:");

    let request = indexedDB.open("FacebookBotDB", 1);
    request.onsuccess = function () {
        let db = request.result;
        let transaction = db.transaction("accounts", "readwrite");
        let store = transaction.objectStore("accounts");

        store.put({ name: accountName, cookies });

        alert(`✅ Akun ${accountName} tersimpan!`);
        loadAccounts();
    };
}

// 🔹 Muat akun yang tersimpan ke dropdown
async function loadAccounts() {
    let request = indexedDB.open("FacebookBotDB", 1);
    request.onsuccess = function () {
        let db = request.result;
        let transaction = db.transaction("accounts", "readonly");
        let store = transaction.objectStore("accounts");
        let getAllRequest = store.getAll();

        getAllRequest.onsuccess = function () {
            let accounts = getAllRequest.result;
            let dropdown = document.getElementById("accountDropdown");
            dropdown.innerHTML = "";

            accounts.forEach((account) => {
                let option = document.createElement("option");
                option.value = account.name;
                option.textContent = account.name;
                dropdown.appendChild(option);
            });
        };
    };
}

// 🔹 Simpan Auto Confirm Friend ke IndexedDB
async function saveAutoConfirmFriend() {
    let minInterval = parseInt(document.getElementById("minIntervalConfirm").value, 10);
    let maxInterval = parseInt(document.getElementById("maxIntervalConfirm").value, 10);
    let maxConfirm = 50;

    if (isNaN(minInterval) || isNaN(maxInterval)) {
        alert("Isi semua data dengan benar!");
        return;
    }

    let request = indexedDB.open("FacebookBotDB", 1);
    request.onsuccess = function () {
        let db = request.result;
        let transaction = db.transaction("settings", "readwrite");
        let store = transaction.objectStore("settings");

        store.put({ id: "autoConfirmFriend", maxConfirm, minInterval, maxInterval });

        alert("✅ Data Auto Confirm Friend disimpan!");
    };
}

// 🔹 Jalankan Auto Confirm Friend
function startAutoConfirmFriend() {
    alert("🚀 Auto Confirm Friend dimulai. Silakan jalankan bot di server!");
}

window.onload = loadAccounts;
