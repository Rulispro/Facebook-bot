// 🔹 Fungsi utama untuk membuka IndexedDB
function openDB() {
    return new Promise((resolve, reject) => {
        let request = indexedDB.open("FacebookBotDB", 1);
        request.onupgradeneeded = function (event) {
            let db = event.target.result;
            if (!db.objectStoreNames.contains("settings")) db.createObjectStore("settings", { keyPath: "id" });
            if (!db.objectStoreNames.contains("accounts")) db.createObjectStore("accounts", { autoIncrement: true });
            if (!db.objectStoreNames.contains("groupPosts")) db.createObjectStore("groupPosts", { autoIncrement: true });
            if (!db.objectStoreNames.contains("marketplacePhotos")) db.createObjectStore("marketplacePhotos", { autoIncrement: true });
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// 🔹 Simpan jam posting (Autopost Grup & Marketplace)
async function saveSelectedHours() {
    let db = await openDB();
    let transaction = db.transaction("settings", "readwrite");
    let store = transaction.objectStore("settings");

    let postingHours = getCheckedHours("postingHours");
    let marketplaceHours = getCheckedHours("marketplacePostingHours");

    store.put({ id: "postingHours", hours: postingHours });
    store.put({ id: "marketplaceHours", hours: marketplaceHours });

    alert("Jam posting disimpan!");
}

// 🔹 Simpan cookies login ke IndexedDB
async function saveCookies() {
    const cookieInput = document.getElementById("cookieInput").value;
    if (!cookieInput) return alert("Masukkan cookies terlebih dahulu!");

    try {
        let parsedCookies = JSON.parse(cookieInput);
        let db = await openDB();
        let transaction = db.transaction("accounts", "readwrite");
        let store = transaction.objectStore("accounts");

        store.add(parsedCookies);
        alert("Cookies berhasil disimpan!");
        loadAccounts();
    } catch (e) {
        alert("Format cookies tidak valid!");
    }
}

// 🔹 Muat akun dari IndexedDB ke dropdown
async function loadAccounts() {
    let db = await openDB();
    let transaction = db.transaction("accounts", "readonly");
    let store = transaction.objectStore("accounts");
    let accounts = await store.getAll();

    let dropdown = document.getElementById("accountDropdown");
    dropdown.innerHTML = "";

    accounts.forEach((acc, index) => {
        let option = document.createElement("option");
        option.value = index;
        option.textContent = `Akun ${index + 1}`;
        dropdown.appendChild(option);
    });
}

// 🔹 Simpan caption & media untuk Autopost Grup
async function saveGroupPost() {
    let caption = document.getElementById("groupCaption").value;
    let fileInput = document.getElementById("groupMedia").files[0];

    if (!caption && !fileInput) return alert("Masukkan caption atau pilih media!");

    let db = await openDB();
    let transaction = db.transaction("groupPosts", "readwrite");
    let store = transaction.objectStore("groupPosts");

    if (fileInput) {
        let reader = new FileReader();
        reader.onload = function (event) {
            store.add({ caption, media: event.target.result });
            alert("Caption dan media berhasil disimpan!");
        };
        reader.readAsDataURL(fileInput);
    } else {
        store.add({ caption, media: null });
        alert("Caption berhasil disimpan tanpa media!");
    }
}

// 🔹 Simpan foto Marketplace ke IndexedDB
async function saveMarketplacePhoto() {
    let fileInput = document.getElementById("marketplacePhoto").files[0];
    if (!fileInput) return alert("Pilih gambar terlebih dahulu!");

    let reader = new FileReader();
    reader.onload = async function (event) {
        let db = await openDB();
        let transaction = db.transaction("marketplacePhotos", "readwrite");
        let store = transaction.objectStore("marketplacePhotos");

        store.add({ image: event.target.result });
        alert("Gambar berhasil disimpan ke Marketplace!");
    };
    reader.readAsDataURL(fileInput);
}

// 🔹 Ambil jam yang dipilih (checkbox)
function getCheckedHours(id) {
    return Array.from(document.querySelectorAll(`#${id} input:checked`)).map(el => el.value);
}

// 🔹 Jalankan saat halaman dimuat
document.addEventListener("DOMContentLoaded", loadAccounts);
