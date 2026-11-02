export type Theme = { name: string; words: string[] };

export const themes: Theme[] = [
  { name: "Di Rumah", words: [
    "KURSI", "SIKAT", "EMBER", "BANTAL", "KERAN", "GELAS", "SABUN", "PIRING", "LEMARI", "SAPU",
    "KOMPOR", "JENDELA", "KARPET", "HANDUK", "KAMAR", "PINTU", "KUNCI", "ATAP", "LANTAI", "DINDING",
    "SENDOK", "GARPU", "PANCI", "WAJAN", "PISAU", "TIKAR", "BASKOM", "GAYUNG", "CERMIN", "LAMPU",
    "SOFA", "BINGKAI", "KOTAK", "TIRAI", "KASUR", "TAPLAK", "GORDEN", "LACI", "RUANG", "TEMPAT",
  ] },
  { name: "Hewan", words: [
    "KUCING", "ANJING", "KELINCI", "GAJAH", "HARIMAU", "ZEBRA", "JERAPAH", "KAMBING", "KERBAU", "KUDA",
    "BEBEK", "AYAM", "PANDA", "RUSA", "SINGA", "MONYET", "TUPAI", "ULAR", "BUAYA", "KADAL",
    "ELANG", "MERPATI", "GAGAK", "BANGAU", "CICAK", "TOKEK", "SEMUT", "LEBAH", "BELUT", "NYAMUK",
    "PAUS", "IKANHIU", "PESUT", "KODOK", "KATAK", "BERUANG", "RUBAH", "SAPI", "DOMBA", "PENYU",
  ] },
  { name: "Makanan", words: [
    "NASI", "ROTI", "SOTO", "BAKSO", "RENDANG", "SATE", "GULAI", "PEMPEK", "KETUPAT", "NASGOR",
    "LONTONG", "OPOR", "BUBUR", "DONAT", "TEMPE", "TAHU", "LALAP", "PECEL", "RAWON", "KAREDOK",
    "SAMBAL", "KERUPUK", "PEYEK", "RISOL", "PASTEL", "LAPIS", "DODOL", "WAFER", "PUDING", "AGAR",
    "KROKET", "GULALI", "SERABI", "GETUK", "CILOK", "SIOMAY", "PEPES", "SAYUR", "BOLU", "LUMPIA",
  ] },
  { name: "Sekolah", words: [
    "BUKU", "PENSIL", "PAPAN", "KELAS", "MURID", "PULPEN", "KAPUR", "ATLAS", "SERAGAM", "UJIAN",
    "MEJA", "KAMPUS", "BELAJAR", "TULIS", "BACA", "HAFAL", "NILAI", "RAPOR", "KERTAS", "TINTA",
    "PETA", "GAMBAR", "ANGKA", "HURUF", "KAMUS", "CERDAS", "PINTAR", "KANTIN", "IJAZAH", "RAJIN",
    "PRAMUKA", "ARENA", "KURSUS", "LULUS", "SISWA", "BIMBEL", "SPIDOL", "PENGUJI", "TUGAS", "DIKTE",
  ] },
  { name: "Alam", words: [
    "GUNUNG", "SUNGAI", "PANTAI", "HUTAN", "BUKIT", "DANAU", "AWAN", "HUJAN", "BINTANG", "BULAN",
    "BUNGA", "POHON", "BATU", "TANAH", "ANGIN", "LAUTAN", "RIMBA", "PADANG", "PESISIR", "SAWAH",
    "LADANG", "RUMPUT", "DAUN", "AKAR", "BATANG", "RANTING", "KABUT", "PETIR", "GURUH", "PELANGI",
    "SURYA", "NYALA", "PASIR", "OMBAK", "TELUK", "PULAU", "RAWA", "LUMUT", "KARANG", "BARA",
  ] },
  { name: "Pasar", words: [
    "CABAI", "TOMAT", "WORTEL", "BAYAM", "SAWI", "BAWANG", "KACANG", "JAGUNG", "PISANG", "PEPAYA",
    "MANGGA", "JERUK", "DURIAN", "KELAPA", "APEL", "SALAK", "MELON", "NANAS", "ANGGUR", "KEMIRI",
    "KUNYIT", "JAHE", "KENCUR", "JINTAN", "LAOS", "TERONG", "LABU", "TIMUN", "SELADA", "KUBIS",
    "SELEDRI", "KEMANGI", "TAUGE", "PETAI", "JAMBU", "SIRSAK", "DUKU", "ALPUKAT", "SUKUN", "KURMA",
  ] },
  { name: "Transportasi", words: [
    "MOBIL", "MOTOR", "SEPEDA", "KERETA", "PESAWAT", "KAPAL", "MINIBUS", "TRUK", "BECAK", "BAJAI",
    "TAKSI", "OJEK", "ROKET", "PERAHU", "KANO", "KAYAK", "FERI", "TRAM", "METRO", "ANGKOT",
    "DELMAN", "GEROBAK", "SKUTER", "MOGE", "KOPLING", "RODA", "SETIR", "MESIN", "TIKET", "JALAN",
    "HALTE", "STASIUN", "BANDARA", "DERMAGA", "LINTAS", "JALUR", "RUTE", "KARGO", "LORI", "ANDONG",
  ] },
  { name: "Pakaian", words: [
    "BAJU", "CELANA", "ROKMINI", "KEMEJA", "JAKET", "TOPI", "KAUS", "KAIN", "SABUK", "DASI",
    "SEPATU", "SANDAL", "STOKING", "SARUNG", "KEBAYA", "BATIK", "MUKENA", "JILBAB", "KORSET", "ROMPI",
    "TUNIK", "BLUS", "GAUN", "JUBAH", "PIYAMA", "KIMONO", "KANCING", "GESPER", "SAMPING", "KOPIAH",
    "PECI", "BORDIR", "SULAM", "TENUN", "KULOT", "BLAZER", "PONCO", "SWEATER", "MANTEL", "KAMEN",
  ] },
  { name: "Tubuh", words: [
    "KEPALA", "RAMBUT", "WAJAH", "MATA", "HIDUNG", "MULUT", "GIGI", "LIDAH", "TELINGA", "LEHER",
    "BAHU", "LENGAN", "SIKU", "TANGAN", "JARI", "KUKU", "DADA", "PERUT", "PINGGUL", "TENGKUK",
    "PAHA", "LUTUT", "BETIS", "KAKI", "TUMIT", "OTOT", "TULANG", "DARAH", "JANTUNG", "PARU",
    "HATI", "GINJAL", "KULIT", "DAGU", "ALIS", "BIBIR", "PIPI", "KETIAK", "TELAPAK", "URAT",
  ] },
  { name: "Pekerjaan", words: [
    "DOKTER", "BIDAN", "PILOT", "KOKI", "PETANI", "NELAYAN", "POLISI", "HAKIM", "BUPATI", "SOPIR",
    "KURIR", "KASIR", "PENATA", "TUKANG", "MONTIR", "PENARI", "AKTOR", "VOKALIS", "PELUKIS", "PENULIS",
    "EDITOR", "ARSITEK", "TEKNISI", "MANTRI", "PERAWAT", "SATPAM", "ILMUAN", "PENDETA", "USTAZ", "IMAM",
    "KAPTEN", "MANAJER", "AKUNTAN", "NOTARIS", "ADVOKAT", "TERAPIS", "KULI", "JAKSA", "PENYIAR", "CAMAT",
  ] },
];
