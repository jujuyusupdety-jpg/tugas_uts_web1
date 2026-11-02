
// FUNGSI MODAL
function bukaModal(id) {
    document.getElementById(id).style.display = "flex";
}

function tutupModal(id) {
    document.getElementById(id).style.display = "none";
}

// VALIDASI LOGIN
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // Data akun untuk percobaan
        const emailBenar = "admin@gmail.com";
        const passwordBenar = "123456";

        if (email === emailBenar && password === passwordBenar) {
            alert("Login berhasil! Selamat datang.");
            window.location.href = "dashboard.html";
        } else {
            alert("email/password yang anda masukkan salah");
        }
    });
}

// GREETING DASHBOARD
const greeting = document.getElementById("greeting");

if (greeting) {
    const jam = new Date().getHours();

    if (jam >= 5 && jam < 11) {
        greeting.textContent = "Selamat Pagi!";
    } else if (jam >= 11 && jam < 15) {
        greeting.textContent = "Selamat Siang!";
    } else if (jam >= 15 && jam < 18) {
        greeting.textContent = "Selamat Sore!";
    } else {
        greeting.textContent = "Selamat Malam!";
    }
}

// LOGOUT
function logout() {
    alert("Anda berhasil logout!");
    window.location.href = "login.html";
}


// MENAMPILKAN KATALOG BUKU
const tabelStok = document.getElementById("tabelStok");

function formatRupiah(nilai) {
    // Harga pada data.js sudah berupa teks "Rp 180.000".
    // Jika buku baru memasukkan angka, format angka menjadi Rupiah.
    if (typeof nilai === "string" && nilai.includes("Rp")) return nilai;
    return "Rp " + Number(nilai || 0).toLocaleString("id-ID");
}

function tampilkanStok() {
    if (!tabelStok) return;

    tabelStok.innerHTML = "";

    dataKatalogBuku.forEach((buku, index) => {
        const baris = document.createElement("tr");
        const foto = buku.cover
            ? `<img class="foto-buku" src="${buku.cover}" alt="Sampul ${buku.namaBarang}"
                    onerror="this.onerror=null; this.src=''; this.alt='Foto tidak ditemukan';">`
            : `<span class="tanpa-foto">Tidak ada foto</span>`;

        baris.innerHTML = `
            <td>${index + 1}</td>
            <td>${foto}</td>
            <td>${buku.kodeBarang || "-"}</td>
            <td>${buku.namaBarang || "-"}</td>
            <td>${buku.jenisBarang || "-"}</td>
            <td>${buku.edisi || "-"}</td>
            <td>${formatRupiah(buku.harga)}</td>
            <td>${buku.stok ?? 0}</td>
        `;
        tabelStok.appendChild(baris);
    });
}

if (tabelStok) tampilkanStok();

// MENAMBAHKAN BUKU BARU
const formStok = document.getElementById("formStok");

if (formStok) {
    formStok.addEventListener("submit", function(event) {
        event.preventDefault();

        const bukuBaru = {
            kodeBarang: "BUKU" + Date.now(),
            namaBarang: document.getElementById("judul").value.trim(),
            jenisBarang: document.getElementById("kategori").value.trim(),
            edisi: document.getElementById("edisi").value.trim(),
            harga: Number(document.getElementById("harga").value),
            stok: Number(document.getElementById("stok").value),
            cover: document.getElementById("cover").value.trim()
        };

        dataKatalogBuku.push(bukuBaru);
        tampilkanStok();
        formStok.reset();
        alert("Buku berhasil ditambahkan!");
    });
}


// CHECKOUT DAN PEMESANAN
const pilihBuku = document.getElementById("pilihBuku");
const tabelPesanan = document.getElementById("tabelPesanan");

if (pilihBuku) {
    dataKatalogBuku.forEach(buku => {
        const option = document.createElement("option");
        option.value = buku.id;
        option.textContent = buku.judul + " - Rp " +
            buku.harga.toLocaleString("id-ID");
        pilihBuku.appendChild(option);
    });
}

function tampilkanPesanan() {
    if (!tabelPesanan) return;

    tabelPesanan.innerHTML = "";

    dataPemesanan.forEach((pesanan, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${pesanan.nama}</td>
            <td>${pesanan.buku}</td>
            <td>${pesanan.jumlah}</td>
            <td>Rp ${pesanan.total.toLocaleString("id-ID")}</td>
            <td>${pesanan.pembayaran}</td>
            <td>
                <button onclick="ubahPesanan(${index})">Ubah</button>
                <button onclick="hapusPesanan(${index})">Hapus</button>
            </td>
        `;

        tabelPesanan.appendChild(row);
    });
}

const formCheckout = document.getElementById("formCheckout");

if (formCheckout) {
    formCheckout.addEventListener("submit", function(event) {
        event.preventDefault();

        const idBuku = Number(pilihBuku.value);
        const buku = dataKatalogBuku.find(b => b.id === idBuku);
        const jumlah = Number(document.getElementById("jumlahBuku").value);

        if (!buku || jumlah < 1) {
            alert("Pilih buku dan jumlah yang benar!");
            return;
        }

        if (jumlah > buku.stok) {
            alert("Stok buku tidak mencukupi!");
            return;
        }

        const pesanan = {
            nama: document.getElementById("namaPemesan").value,
            email: document.getElementById("emailPemesan").value,
            alamat: document.getElementById("alamatPemesan").value,
            buku: buku.judul,
            jumlah: jumlah,
            total: buku.harga * jumlah,
            pembayaran: document.getElementById("pembayaran").value
        };

        buku.stok -= jumlah;
        dataPemesanan.push(pesanan);

        tampilkanPesanan();
        formCheckout.reset();

        alert("Pesanan berhasil dibuat!");
    });
}

// MENGUBAH PESANAN
function ubahPesanan(index) {
    const pesanan = dataPemesanan[index];
    const jumlahBaru = Number(prompt("Masukkan jumlah baru:", pesanan.jumlah));

    if (!Number.isInteger(jumlahBaru) || jumlahBaru < 1) {
        alert("Jumlah tidak valid!");
        return;
    }

    const buku = dataKatalogBuku.find(b => b.judul === pesanan.buku);
    const tersedia = buku.stok + pesanan.jumlah;

    if (jumlahBaru > tersedia) {
        alert("Stok buku tidak mencukupi!");
        return;
    }

    buku.stok = tersedia - jumlahBaru;
    pesanan.jumlah = jumlahBaru;
    pesanan.total = buku.harga * jumlahBaru;

    tampilkanPesanan();
    alert("Pesanan berhasil diubah!");
}

// MENGHAPUS PESANAN
function hapusPesanan(index) {
    if (confirm("Yakin ingin menghapus pesanan?")) {
        const pesanan = dataPemesanan[index];
        const buku = dataKatalogBuku.find(b => b.judul === pesanan.buku);

        if (buku) buku.stok += pesanan.jumlah;

        dataPemesanan.splice(index, 1);
        tampilkanPesanan();

        alert("Pesanan berhasil dihapus!");
    }
}

if (tabelPesanan) {
    tampilkanPesanan();
}


// TRACKING PENGIRIMAN
const formTracking = document.getElementById("formTracking");

if (formTracking) {
    formTracking.addEventListener("submit", function(event) {
        event.preventDefault();

        const nomor = document.getElementById("nomorDO").value.trim();

        const pengiriman = dataPengiriman.find(
            item => item.noDO.toLowerCase() === nomor.toLowerCase()
        );

        const hasil = document.getElementById("hasilTracking");

        if (!pengiriman) {
            hasil.style.display = "none";
            alert("Nomor Delivery Order tidak ditemukan!");
            return;
        }

        document.getElementById("hasilDO").textContent = pengiriman.noDO;
        document.getElementById("hasilNama").textContent = pengiriman.nama;
        document.getElementById("hasilStatus").textContent = pengiriman.status;
        document.getElementById("hasilEkspedisi").textContent = pengiriman.ekspedisi;
        document.getElementById("hasilTanggal").textContent = pengiriman.tanggal;
        document.getElementById("hasilPaket").textContent = pengiriman.paket;

        document.getElementById("hasilTotal").textContent =
            "Rp " + pengiriman.total.toLocaleString("id-ID");

        document.getElementById("progressBar").style.width =
            pengiriman.progress + "%";

        document.getElementById("persentase").textContent =
            "Progres pengiriman: " + pengiriman.progress + "%";

        hasil.style.display = "block";
    });
}


