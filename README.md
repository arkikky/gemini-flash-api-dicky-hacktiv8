# Gemini Flash API

Ini adalah server Node.js sederhana yang menyediakan empat endpoint API untuk berinteraksi dengan model Gemini Flash dari Google:

1.  `/generate-text`: Menghasilkan teks dari prompt teks.
2.  `/generate-from-image`: Menghasilkan teks dari gambar dan prompt teks.
3.  `/generate-from-document`: Menghasilkan teks dari dokumen dan prompt teks.
4.  `/generate-from-audio`: Menghasilkan teks dari file audio dan prompt teks.

## Prasyarat

- Node.js (v14 atau lebih baru)
- Yarn atau npm
- Kunci API Google Gemini

## Pengaturan

1.  **Kloning repositori:**
    ```bash
    git clone https://github.com/dickyrey/gemini-flash-api.git
    cd gemini-flash-api
    ```

2.  **Instal dependensi:**
    ```bash
    yarn install
    # atau
    npm install
    ```

3.  **Atur variabel lingkungan Anda:**

    Buat file `.env` di direktori root dan tambahkan kunci API Gemini Anda:
    ```
    GEMINI_API_KEY=kunci_api_anda_di_sini
    ```

4.  **Jalankan server:**
    ```bash
    node index.js
    ```
    Server akan berjalan di `http://localhost:3000`.

## Coba Dengan curl

Perbarui path absolut setelah `@` untuk menunjuk ke file di mesin Anda sebelum menjalankan perintah ini.

```bash
# Hasilkan teks
curl -X POST http://localhost:3000/generate-text \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Apa itu API?"}'

# Hasilkan dari gambar
curl -X POST http://localhost:3000/generate-from-image \
  -F "image=@/Users/mac/Desktop/hacktiv8.png" \
  -F "prompt=Gambar apa ini?"

# Hasilkan dari dokumen
curl -X POST http://localhost:3000/generate-from-document \
  -F "document=@/Users/mac/Desktop/guide.pdf" \
  -F "prompt=Apa judul dari dokumen ini?"

# Hasilkan dari audio
curl -X POST http://localhost:3000/generate-from-audio \
  -F "audio=@/Users/mac/Desktop/music.mp3" \
  -F "prompt=Tolong transkripsikan dengan singkat isi rekaman ini."
```

## Catatan

- File yang diunggah akan tetap berada di `uploads/`; hapus secara berkala jika penyimpanan menjadi masalah.
- Tangani kesalahan kuota API dan pembatasan laju sesuai dengan paket Gemini Anda.
- Pertimbangkan untuk mengaktifkan HTTPS atau gateway API sebelum mengekspos layanan secara publik.