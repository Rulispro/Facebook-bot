// Fungsi untuk menyimpan cookies ke IndexedDB
function saveCookies() {
    const cookieInput = document.getElementById("cookieInput").value;
    if (!cookieInput) return alert("Masukkan cookies terlebih dahulu!");

    let parsedCookies;
    try {
        parsedCookies = JSON.parse(cookieInput);
    } catch (e) {
        return alert("Format cookies tidak valid!");
    }

    let request = indexedDB.open("FacebookBotDB", 1);
    request.onupgradeneeded = function () {
        let db = request.result;
        if (!db.objectStoreNames.contains("accounts")) {
            db.createObjectStore("accounts", { autoIncrement: true });
        }
    };
    request.onsuccess = function () {
        let db = request.result;
        let transaction = db.transaction("accounts", "readwrite");
        let store = transaction.objectStore("accounts");
        store.add(parsedCookies);

        alert("Cookies berhasil disimpan!");
        loadAccounts();
    };
}

// Fungsi untuk memuat semua akun dari IndexedDB ke dropdown
function loadAccounts() {
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

            accounts.forEach((acc, index) => {
                let option = document.createElement("option");
                option.value = index;
                option.textContent = `Akun ${index + 1}`;
                dropdown.appendChild(option);
            });
        };
    };
}

// Fungsi untuk menyimpan caption + media ke IndexedDB (Autopost Grup)
function saveGroupPost() {
    let caption = document.getElementById("groupCaption").value;
    let fileInput = document.getElementById("groupMedia").files[0];

    if (!caption && !fileInput) return alert("Masukkan caption atau pilih media terlebih dahulu!");

    let request = indexedDB.open("FacebookBotDB", 1);
    request.onupgradeneeded = function () {
        let db = request.result;
        if (!db.objectStoreNames.contains("groupPosts")) {
            db.createObjectStore("groupPosts", { autoIncrement: true });
        }
    };
    request.onsuccess = function () {
        let db = request.result;
        let transaction = db.transaction("groupPosts", "readwrite");
        let store = transaction.objectStore("groupPosts");

        if (fileInput) {
            let reader = new FileReader();
            reader.onload = function (event) {
                store.add({ caption: caption, media: event.target.result });
                alert("Caption dan media berhasil disimpan!");
            };
            reader.readAsDataURL(fileInput);
        } else {
            store.add({ caption: caption, media: null });
            alert("Caption berhasil disimpan tanpa media!");
        }
    };
}

// Fungsi untuk menyimpan gambar ke IndexedDB untuk Marketplace
function saveMarketplacePhoto() {
    let fileInput = document.getElementById("marketplacePhoto").files[0];
    if (!fileInput) return alert("Pilih gambar terlebih dahulu!");

    let reader = new FileReader();
    reader.onload = function (event) {
        let request = indexedDB.open("FacebookBotDB", 1);
        request.onupgradeneeded = function () {
            let db = request.result;
            if (!db.objectStoreNames.contains("marketplacePhotos")) {
                db.createObjectStore("marketplacePhotos", { autoIncrement: true });
            }
        };
        request.onsuccess = function () {
            let db = request.result;
            let transaction = db.transaction("marketplacePhotos", "readwrite");
            let store = transaction.objectStore("marketplacePhotos");
            store.add({ image: event.target.result });
            alert("Gambar berhasil disimpan ke Marketplace!");
        };
    };
    reader.readAsDataURL(fileInput);
}

// Fungsi untuk mengambil jam yang dipilih (Autopost Grup & Marketplace)
function getCheckedHours(id) {
    return Array.from(document.querySelectorAll(`#${id} input:checked`)).map(el => el.value);
}

// Panggil saat halaman dimuat
document.addEventListener("DOMContentLoaded", loadAccounts);
