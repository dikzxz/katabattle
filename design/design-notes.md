# KataBattle design notes

- Cartoon word-search race game; all interface text is in Indonesian.
- Use a bright sky-blue background, navy outlines, and playful Fredoka typography.
- Palette: sky `#7DD8FF`, blue `#3B82F6`, mint `#4ADE9E`, yellow `#FFD84D`, coral `#FF6B5B`, navy `#1B2A4A`.
- Buttons and letter tiles use rounded corners, heavy navy outlines, and a darker bottom edge for a toy-like raised appearance.
- Use the provided KataBattle logo image asset rather than recreating the logo with text or CSS.

## Aturan permainan terkini

- Kedua pemain menerima grid dan daftar kata yang sama, tetapi masing-masing mencari secara independen. Kata yang ditemukan satu pemain tetap dapat ditemukan pemain lain.
- Pemain hanya melihat kata yang ia temukan sendiri. Progres lawan hanya berupa angka jumlah kata; kata lawan tidak disimpan atau ditampilkan.
- Target kemenangan versus adalah 10 kata (`TARGET_SCORE = 10`). Jika kedua pemain mencapai target, pemain dengan waktu selesai lebih awal menang.
- Mode solo selesai saat semua 10 kata di daftar telah ditemukan.
- `GRID_SIZE = 9` dan `WORD_COUNT = 10`; `WORD_COUNT` adalah konstanta terpisah dari `TARGET_SCORE`.
- Daftar kata ronde berisi kata yang sama untuk kedua pemain, dipilih secara deterministik dari seed ronde. Seed baru digunakan untuk setiap permainan kecuali URL menyediakan `?seed=`.
- Untuk permainan normal, kata diletakkan ke kanan, ke bawah, diagonal kanan-bawah, atau diagonal kanan-atas. Swipe terbalik tetap valid.
- Desain PNG lama yang menunjukkan klaim bersama, ubin coral lawan, atau lencana avatar lawan pada kata yang ditemukan tidak berlaku untuk aturan terkini.
