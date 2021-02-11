export const EVENT_SUCCESS_CREATE = 'Kegiatan berhasil di daftarkan'
export const EVENT_SUCCESS_UPDATE = 'Kegiatan berhasil di perbaharui'
export const SUCCESS_IMPORT = 'Import data berhasil'
export const FAILED_IMPORT = 'Import data gagal'
export const EVENT_BLAST_EMPTY = 'Anda Belum Memilih Peserta'
export const EVENT_PARTICIPANTS_EMPTY = 'Peserta Kegiatan kosong'
export const EVENT_BLAST_SUCCESS = 'Notifikasi berhasil di kirim'
export const SUCCESS_UPDATE_TEST_RESULT = 'Hasil test berhasil diubah'
export const FAILED_UPDATE_TEST_RESULT =
  'Maaf, ada kesalahan dalam mengubah data hasil tes'
export const SUCCESS_DELETE = 'Data berhasil di hapus'
export const FAILED_DELETE = 'Maaf, ada kesalahan dalam menghapus data'
export const CONFIRM_DELETE =
  'Apakah anda yakin akan menghapus data kegiatan dengan ID: '
export const CONFIRM_DELETE_PARTICIPANTS =
  'Apakah Anda yakin akan menghapus peserta ini?'
export const CONFIRM_DELETE_PARTICIPANTS_EVENT =
  'Apakah Anda yakin akan mengeluarkan peserta dari kegiatan ini?'
export const SUCCESS_ADD_PARTICIPANTS =
  'Peserta berhasil di daftarkan dalam kegiatan'
export const FAILED_ADD_PARTICIPANTS =
  'Maaf, ada kesalahan dalam mendaftarkan peserta'
export const SET_LABCODE_SUCCESS =
  'Kode Sampel Hasil Lab Berhasil di perbaharui'
export const SET_LABCODE_FAILED =
  'Maaf, ada kesalahan dalam menyimpan Kode Sampel Hasil Lab '
export const UNCHECK_SUCCESS = 'Data Checkin dan Kode Sampel berhasil direset'
export const UNCHECK_FAILED = 'Data Checkin dan Kode Sampel gagal direset'
export const INTEGRATE_SUCCESS = 'Data berhasil dikirim ke Aplikasi Labkes'
export const INTEGRATE_FAILED = 'Data gagal dikirim ke Aplikasi Labkes'

export const DEFAULT_FILTER = {
  groupBy: [],
  groupDesc: [],
  sortBy: ['updated_at'],
  sortDesc: [true],
  sortOrder: 'desc',
  status: 'published',
  multiSort: false,
  mustSort: false,
  keyWords: undefined
}
export const DEFAULT_PAGINATION = {
  page: 1,
  itemsPerPage: 50,
  total: 0
}
export const TEST_RESULT_OPTIONS = [
  { value: 'POSITIVE', label: 'Positif' },
  { value: 'NEGATIVE', label: 'Negatif' },
  { value: 'REACTIVE', label: 'Reaktif' },
  { value: 'NONREACTIVE', label: 'Non Reaktif' },
  { value: 'INCONCLUSIVE', label: 'Inkonklusif' },
  { value: 'INVALID', label: 'Invalid' }
]
export const SYMPTOMS_OPTIONS = [
  { value: 1, text: 'Batuk' },
  { value: 2, text: 'Menggigil' },
  { value: 3, text: 'Nyeri Abdomen' },
  { value: 4, text: 'Pilek' },
  { value: 5, text: 'Sakit Tenggorokan' },
  { value: 6, text: 'Suhu Tubuh < 38' },
  { value: 7, text: 'Lemah (malaise)' },
  { value: 8, text: 'Mual atau Muntah' },
  { value: 9, text: 'Nyeri Otot' },
  { value: 10, text: 'Sakit Kepala' },
  { value: 11, text: 'Sesak Napas' },
  { value: 12, text: 'Suhu Tubuh >= 38 C' },
  { value: 99, text: 'Tidak ada Gejala' }
]
export const CONGENITAL_DESEASE_OPTIONS = [
  { value: 1, text: 'Darah Tinggi' },
  { value: 2, text: 'Diabetes' },
  { value: 3, text: 'Kronis' },
  { value: 4, text: 'Gangguan Jantung' },
  { value: 5, text: 'Gagal Ginjal' },
  { value: 99, text: 'Tidak Ada' }
]
export const STATUS_OPTIONS = [
  { value: 'CLOSE_CONTACT', text: 'Kontak Erat' },
  { value: 'SUSPECT', text: 'Suspek' },
  { value: 'PROBABLE', text: 'Probable' },
  { value: 'CONFIRMED', text: 'Konfirmasi' },
  { value: 'UNKNOWN', text: 'Tanpa Kriteria' }
]
