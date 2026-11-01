export type Theme = {
  name: string;
  words: string[];
};

export const themes: Theme[] = [
  {
    name: "Di Rumah",
    words: ["KURSI", "SIKAT", "EMBER", "BANTAL", "KERAN", "GELAS", "SABUN", "PIRING", "LEMARI", "SAPU", "KOMPOR", "JENDELA", "KARPET", "HANDUK", "KAMAR", "PINTU"],
  },
  {
    name: "Hewan",
    words: ["KUCING", "ANJING", "KELINCI", "GAJAH", "HARIMAU", "ZEBRA", "JERAPAH", "KAMBING", "KERBAU", "KUDA", "BEBEK", "AYAM", "PANDA", "RUSA", "SINGA", "MONYET"],
  },
  {
    name: "Makanan",
    words: ["NASI", "ROTI", "SOTO", "BAKSO", "RENDANG", "SATE", "GULAI", "PEMPEK", "KETUPAT", "NASGOR", "LONTONG", "OPOR", "BUBUR", "DONAT", "TEMPE", "TAHU"],
  },
  {
    name: "Sekolah",
    words: ["BUKU", "PENSIL", "PAPAN", "KELAS", "GURU", "MURID", "PULPEN", "KAPUR", "ATLAS", "SERAGAM", "UJIAN", "MEJA", "KURSI", "KAMPUS", "BELAJAR", "SEKOLAH"],
  },
  {
    name: "Alam",
    words: ["GUNUNG", "SUNGAI", "PANTAI", "HUTAN", "BUKIT", "DANAU", "AWAN", "HUJAN", "BINTANG", "BULAN", "BUNGA", "POHON", "BATU", "TANAH", "ANGIN", "LAUTAN"],
  },
  {
    name: "Pasar",
    words: ["CABAI", "TOMAT", "WORTEL", "BAYAM", "SAWI", "BAWANG", "KACANG", "JAGUNG", "PISANG", "PEPAYA", "MANGGA", "JERUK", "DURIAN", "KELAPA", "APEL", "SALAK"],
  },
];
