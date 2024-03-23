export interface StrapiData {
  data: Entity[];
  meta: Meta;
}

export interface Entity {
  id: number;
  attributes: Mahasiswa;
}

export interface Mahasiswa {
  nim: string;
  nama: string;
  alamat: string;
  tanggal_lahir: string;
  gender: string;
  usia: number;
  createdAt: string;
  updatedAt: string;
}

export interface Meta {
  pagination: Pagination;
  jumlah_mahasiswa: number;
  jumlah_pria: number;
  jumlah_wanita: number;
}

export interface Pagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}
