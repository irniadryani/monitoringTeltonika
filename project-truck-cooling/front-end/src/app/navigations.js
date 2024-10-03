export const navigations = [

  { name: "Dashboard", path: "/dashboard/default", icon: "home" },
  { name: "Riwayat", path: "/Riwayat/client", icon: "history" },
  { name: "Kelola Komoditas", path: "/KelolaKomoditas/client", icon: "build" },
  { name: "Layanan", path: "/Layanan/client", icon: "person" },
  { name: "Informasi Layanan", path: "", icon: "help",
    children: [
      { name: "Layanan A", path: "/InformasiLayanan/client", iconText: "A" }
    ]
  },
  { name: "Kelola Alat", icon: "report",
    children: [
      { name: "Alat", path: "/Kelola_Alat/client", iconText: "A" }
    ]
  },
  { name: "Laporan",icon: "settings",
    children: [
      { name: "Laporan A", path: "/Laporan/client", iconText: "A" }
    ]
  },
  { name: "Ubah Profil Pengguna", path: "/Ubah_Profil/client", icon: "settings" },

];
