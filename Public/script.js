// 🔹 Fungsi utama untuk membuka IndexedDB
function openDB() {
    return new Promise((resolve, reject) => {
        let request = indexedDB.open("FacebookBotDB", 1);
        request.onupgradeneeded = function (event) {
            let db = event.target.result;
            let stores = ["settings", "accounts", "groupPosts", "marketplacePhotos"];

            stores.forEach(store => {
                if (!db.objectStoreNames.contains(store)) {
                    db.createObjectStore(store, { keyPath: store === "settings" ? "id" : undefined, autoIncrement: store !== "settings" });
                }
            });
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

    store.put({ id: "postingHours", hours: getCheckedHours("postingHours") });
    store.put({ id: "marketplaceHours", hours: getCheckedHours("marketplacePostingHours") });

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
        transaction.objectStore("accounts").add(parsedCookies);

        alert("Cookies berhasil disimpan!");
        loadAccounts();
    } catch {
        alert("Format cookies tidak valid!");
    }
}

// 🔹 Muat akun dari IndexedDB ke dropdown
async function loadAccounts() {
    let db = await openDB();
    let accounts = await db.transaction("accounts", "readonly").objectStore("accounts").getAll();

    let dropdown = document.getElementById("accountDropdown");
    dropdown.innerHTML = accounts.map((_, i) => `<option value="${i}">Akun ${i + 1}</option>`).join("");
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
        reader.onload = event => {
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
    reader.onload = async event => {
        let db = await openDB();
        db.transaction("marketplacePhotos", "readwrite").objectStore("marketplacePhotos").add({ image: event.target.result });
        alert("Gambar berhasil disimpan ke Marketplace!");
    };
    reader.readAsDataURL(fileInput);
}

// 🔹 Ambil jam yang dipilih (checkbox)
function getCheckedHours(id) {
    return Array.from(document.querySelectorAll(`#${id} input:checked`)).map(el => el.value);
}

// 🔹 Jalankan saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
    loadAccounts();
    document.querySelectorAll("#postingHours input, #marketplacePostingHours input").forEach(input => {
        input.addEventListener("change", saveSelectedHours);
    });
});
