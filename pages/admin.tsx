import Layout from "@/components/Layout";
import useMutation from "@/hooks/useMutation";
import useQuery from "@/hooks/useQuery";
import { Entity, StrapiData } from "@/types/mahasiswa.type";
import {
  Button,
  Card,
  DatePicker,
  Descriptions,
  DescriptionsProps,
  Drawer,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Statistic,
  Table,
  TableProps,
  message,
} from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

export default function Admin() {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const showSuccess = (msg: string) => {
    messageApi.success(msg);
  };

  const showError = (msg: string) => {
    messageApi.error(msg);
  };

  const [url, setUrl] = useState<string>("/mahasiswas?sort=nim:desc");
  const { data, loading, refetch } = useQuery<StrapiData>(url);
  const [selectedData, setSelectedData] = useState<Entity | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  const [openDrawer, setOpenDrawer] = useState(false);

  const [createMahasiswa, { loading: loadingCreate }] = useMutation<Entity, Entity>("/mahasiswas", "post", {
    onSuccess: () => {
      refetch();
      showSuccess("Data berhasil ditambahkan");
      form.resetFields();
      setOpenDrawer(false);
    },
  });

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

  const detailMahasiswa: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "Nama",
      children: <p>{selectedData?.attributes?.nama}</p>,
    },
    {
      key: "2",
      label: "NIM",
      span: 2,
      children: <p>{selectedData?.attributes?.nim}</p>,
    },
    {
      key: "3",
      label: "Alamat",
      span: 3,
      children: <p>{selectedData?.attributes?.alamat}</p>,
    },
    {
      key: "4",
      label: "Tanggal Lahir",
      children: <p>{selectedData?.attributes?.tanggal_lahir}</p>,
    },
    {
      key: "5",
      label: "Gender",
      children: <p>{selectedData?.attributes?.gender}</p>,
    },
    {
      key: "6",
      label: "Usia",
      children: <p>{selectedData?.attributes?.usia}</p>,
    },
  ];

  const handleDelete = async (id: number) => {
    if (!id) return;

    setLoadingDelete(true);

    try {
      const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
      const res = await axios.delete(BASE_URL + `/mahasiswas/${id}`);

      if (res.data) {
        refetch();
        showSuccess("Data berhasil dihapus");
        setSelectedData(null);
      }
    } catch (error) {
      showError("Data gagal dihapus");
    } finally {
      setLoadingDelete(false);
    }
  };

  useEffect(() => {
    if (loadingCreate || loadingUpdate) {
      refetch();
    }
  }, [loadingCreate, loadingUpdate]);

  const handleOpenEdit = () => {
    setIsEdit(true);
    form.setFieldsValue({
      nama: selectedData?.attributes?.nama,
      nim: selectedData?.attributes?.nim,
      alamat: selectedData?.attributes?.alamat,
      tanggal_lahir: dayjs(selectedData?.attributes?.tanggal_lahir),
      gender: selectedData?.attributes?.gender,
      usia: selectedData?.attributes?.usia,
    });
    setOpenDrawer(true);
  };

  const updateMahasiswa = (payload: { data: Entity }) => {
    setLoadingUpdate(true);
    const id = selectedData?.id;
    if (!id) return;

    try {
      const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
      axios
        .put(BASE_URL + `/mahasiswas/${id}`, payload)
        .then((res) => {
          if (res.data) {
            refetch();

            showSuccess("Data berhasil diubah");
            setSelectedData(null);
            setOpenDrawer(false);
            setIsEdit(false);
          }
        })
        .catch((err) => {
          showError("Data gagal diubah");
        });
    } catch (error) {
      showError("Data gagal diubah");
    } finally {
      setLoadingUpdate(false);
    }
  };

  return (
    <Layout title="Home">
      {contextHolder}
      <div className="mx-auto max-w-7xl  mt-4">
        <p className="text-xl font-semibold tracking-wide text-gray-800">Manajemen Mahasiswa</p>
      </div>

      <div className="w-full mt-4 bg-white p-3 rounded-md mx-auto max-w-7xl">
        <div className="w-full flex justify-between items-center mb-2">
          <Input.Search onSearch={onSearch} placeholder="Cari nama mahasiswa" className="w-full md:w-1/4 " />
          <Button type="default" onClick={() => setOpenDrawer(true)}>
            + Tambah Mahasiswa
          </Button>
        </div>
        <Table
          size="small"
          onRow={(record, rowIndex) => {
            return {
              onClick: () => {
                setSelectedData(record);
              },
            };
          }}
          bordered
          rowClassName="cursor-pointer"
          dataSource={data?.data}
          rowKey={"id"}
          columns={columns}
          loading={loading}
        />

        <Modal
          width={800}
          title="Detail Mahasiswa"
          open={selectedData !== null}
          onCancel={() => setSelectedData(null)}
          footer={null}
        >
          <Descriptions colon className="mt-3" items={detailMahasiswa} />

          <div className="w-full gap-2 flex justify-end">
            <Button type="link" onClick={handleOpenEdit} loading={loadingUpdate} className="mt-2">
              Edit
            </Button>
            <Popconfirm
              title="Apakah anda yakin ingin menghapus data ini?"
              onConfirm={() => handleDelete(selectedData?.id ?? 0)}
              okText="Yes"
              okButtonProps={{ loading: loadingDelete, type: "default", danger: true }}
              cancelText="No"
            >
              <Button danger loading={loadingDelete} type="primary" className="mt-2">
                Delete
              </Button>
            </Popconfirm>
          </div>
        </Modal>

        <Drawer
          title="Tambah Mahasiswa"
          placement="right"
          width={400}
          onClose={() => setOpenDrawer(false)}
          open={openDrawer}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={(values) => {
              if (isEdit) {
                updateMahasiswa({ data: values });
              } else {
                createMahasiswa({ data: values });
              }
            }}
          >
            <Form.Item label="Nama" name="nama" rules={[{ required: true, message: "Please input the name!" }]}>
              <Input placeholder="cth: Budiono" />
            </Form.Item>

            <Form.Item label="NIM" name="nim" rules={[{ required: true, message: "Please input the NIM!" }]}>
              <Input type="number" placeholder="cth: 009233299921" />
            </Form.Item>

            <Form.Item label="Alamat" name="alamat" rules={[{ required: true, message: "Please input the address!" }]}>
              <Input placeholder="cth: jl. pahlawan no.21" />
            </Form.Item>

            <Form.Item
              label="Tanggal Lahir"
              name="tanggal_lahir"
              rules={[{ required: true, message: "Please input the birth date!" }]}
            >
              <DatePicker />
            </Form.Item>

            <Form.Item label="Gender" name="gender" rules={[{ required: true, message: "Please select the gender!" }]}>
              <Select>
                <Select.Option value="Pria">Pria</Select.Option>
                <Select.Option value="Wanita">Wanita</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Usia" name="usia" rules={[{ required: true, message: "Please input the age!" }]}>
              <InputNumber min={1} />
            </Form.Item>

            <Form.Item>
              <Button loading={loadingCreate} type="primary" htmlType="submit" className="bg-[#1677FF]" block>
                {isEdit ? "Ubah Data" : "Tambah Mahasiswa"}
              </Button>
            </Form.Item>
          </Form>
        </Drawer>
      </div>
    </Layout>
  );
}
