import Layout from "@/components/Layout";
import useQuery from "@/hooks/useQuery";
import { Entity, StrapiData } from "@/types/mahasiswa.type";
import { Card, Input, Statistic, Table, TableProps } from "antd";
import { useState } from "react";
import { ArrowUpOutlined } from "@ant-design/icons";

export default function Home() {
  const [url, setUrl] = useState<string>("/mahasiswas?sort=nim:desc");
  const { data, loading, error } = useQuery<StrapiData>(url);

  const columns: TableProps<Entity>["columns"] = [
    {
      title: "Nama",
      dataIndex: ["attributes", "nama"],
      key: "nama",
    },
    {
      title: "NIM",
      dataIndex: ["attributes", "nim"],
      key: "nim",
    },
    {
      title: "Alamat",
      dataIndex: ["attributes", "alamat"],
      key: "alamat",
    },
    {
      title: "Tanggal Lahir",
      dataIndex: ["attributes", "tanggal_lahir"],
      key: "tanggal_lahir",
    },
    {
      title: "Gender",
      dataIndex: ["attributes", "gender"],
      key: "gender",
    },
    {
      title: "Usia",
      dataIndex: ["attributes", "usia"],
      key: "usia",
    },
  ];

  const onSearch = (value: string) => {
    setUrl(`/mahasiswas?filters[nama][$containsi]=${value}&sort=nim:desc`);
  };

  return (
    <Layout title="Home">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row gap-2 mt-4">
        <Card
          bordered={false}
          className={`w-full min-h-[111.71px] lg:w-1/3 ${
            loading ? "bg-gray-300 animate-pulse" : "bg-white"
          } transition-all duration-100`}
        >
          {loading ? null : (
            <Statistic
              title="Jumlah Total Mahasiswa"
              value={data?.meta.jumlah_mahasiswa}
              valueStyle={{ color: "#1677FF" }}
            />
          )}
        </Card>
        <Card
          bordered={false}
          className={`w-full min-h-[111.71px] lg:w-1/3 ${
            loading ? "bg-gray-300 animate-pulse" : "bg-white"
          } transition-all duration-100`}
        >
          {loading ? null : (
            <Statistic title="Jumlah Mahasiswa Pria" value={data?.meta.jumlah_pria} valueStyle={{ color: "#1677FF" }} />
          )}
        </Card>
        <Card
          bordered={false}
          className={`w-full min-h-[111.71px] lg:w-1/3 ${
            loading ? "bg-gray-300 animate-pulse" : "bg-white"
          } transition-all duration-100`}
        >
          {loading ? null : (
            <Statistic
              title="Jumlah Mahasiswa Wanita"
              value={data?.meta.jumlah_wanita}
              valueStyle={{ color: "#1677FF" }}
            />
          )}
        </Card>
      </div>

      <div className="w-full mt-4 bg-white p-3 rounded-md mx-auto max-w-7xl">
        <Input.Search onSearch={onSearch} placeholder="Cari nama mahasiswa" className="w-full md:w-1/4 mb-2" />
        <Table size="small" bordered dataSource={data?.data} rowKey={"id"} columns={columns} loading={loading} />
      </div>
    </Layout>
  );
}
