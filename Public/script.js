// Simpan Cookies ke IndexedDB
function saveCookies() {
    const cookieInput = document.getElementById("cookieInput").value;
    if (!cookieInput) return alert("Masukkan cookies terlebih dahulu!");

    let accounts = JSON.parse(localStorage.getItem("fbAccounts")) || [];
    accounts.push({ cookie: cookieInput });
    localStorage.setItem("fbAccounts", JSON.stringify(accounts));

    alert("Cookies tersimpan!");
    loadAccounts();
}

// Load Akun ke Dropdown
function loadAccounts() {
    const dropdown = document.getElementById("accountDropdown");
    dropdown.innerHTML = "";
    const accounts = JSON.parse(localStorage.getItem("fbAccounts")) || [];

    accounts.forEach((acc, index) => {
        let option = document.createElement("option");
        option.value = index;
        option.textContent = `Akun ${index + 1}`;
        dropdown.appendChild(option);
    });
}

// Simpan Gambar ke IndexedDB
function saveToIndexedDB() {
    let fileInput = document.getElementById("marketplacePhoto").files[0];
    if (!fileInput) return alert("Pilih gambar terlebih dahulu!");

    let reader = new FileReader();
    reader.onload = function (event) {
        localStorage.setItem("marketplacePhoto", event.target.result);
        alert("Gambar disimpan ke IndexedDB!");
    };
    reader.readAsDataURL(fileInput);
}

// Ambil Jam Posting yang Dicentang
function getCheckedHours(id) {
    return Array.from(document.querySelectorAll(`#${id} input:checked`))
        .map(el => el.value);
}
