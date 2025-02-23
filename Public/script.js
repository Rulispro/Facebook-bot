// Simpan cookies ke IndexedDB
function saveCookies() {
    const cookieInput = document.getElementById("cookieInput").value;
    if (!cookieInput) return alert("Masukkan cookies terlebih dahulu!");

    let newAccount = { cookies: JSON.parse(cookieInput) };

    // Simpan ke IndexedDB
    let accounts = JSON.parse(localStorage.getItem("fbAccounts")) || [];
    accounts.push(newAccount);
    localStorage.setItem("fbAccounts", JSON.stringify(accounts));

    alert("Cookies berhasil disimpan!");
    loadAccounts();
}

// Load akun ke dropdown
function loadAccounts() {
    let accounts = JSON.parse(localStorage.getItem("fbAccounts")) || [];
    let dropdown = document.getElementById("accountDropdown");
    dropdown.innerHTML = "";

    accounts.forEach((acc, index) => {
        let option = document.createElement("option");
        option.value = index;
        option.textContent = `Akun ${index + 1}`;
        dropdown.appendChild(option);
    });
}

// Simpan gambar/video + caption ke IndexedDB (Untuk Autoposting Grup)
function saveGroupPost() {
    let caption = document.getElementById("groupCaption").value;
    let fileInput = document.getElementById("groupMedia").files[0];

    if (!caption && !fileInput) return alert("Masukkan caption atau pilih media terlebih dahulu!");

    let reader = new FileReader();
    reader.onload = function (event) {
        let postData = JSON.parse(localStorage.getItem("groupPosts")) || [];
        postData.push({ caption: caption, media: event.target.result });
        localStorage.setItem("groupPosts", JSON.stringify(postData));

        alert("Caption dan media berhasil disimpan!");
    };

    if (fileInput) {
        reader.readAsDataURL(fileInput);
    } else {
        let postData = JSON.parse(localStorage.getItem("groupPosts")) || [];
        postData.push({ caption: caption, media: null });
        localStorage.setItem("groupPosts", JSON.stringify(postData));
        alert("Caption berhasil disimpan tanpa media!");
    }
}

// Simpan gambar ke IndexedDB untuk Marketplace
function saveToIndexedDB() {
    let fileInput = document.getElementById("marketplacePhoto").files[0];
    if (!fileInput) return alert("Pilih gambar terlebih dahulu!");

    let reader = new FileReader();
    reader.onload = function (event) {
        localStorage.setItem("marketplacePhoto", event.target.result);
        alert("Gambar berhasil disimpan!");
    };
    reader.readAsDataURL(fileInput);
}

// Ambil jam posting yang dicentang (untuk autoposting grup & marketplace)
function getCheckedHours(id) {
    return Array.from(document.querySelectorAll(`#${id} input:checked`))
        .map(el => el.value);
}

// Panggil saat halaman dimuat
document.addEventListener("DOMContentLoaded", loadAccounts);
