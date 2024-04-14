import moment from "moment";
import React, { useState, useEffect } from "react";
import { Modal, Form, Select, Input, message, Table, DatePicker } from "antd";
import Layout from "../components/Layout";
import axios from "axios";
import Spinner from "../components/Spinner";
import {
  UnorderedListOutlined,
  AreaChartOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Analytics from "./Analytics";
const { RangePicker } = DatePicker;

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allTransection, setAllTransection] = useState([]);
  const [frequency, setFrequency] = useState("7");
  const [selectedDates, setSelectedDates] = useState([]);
  const [type, setType] = useState("all");
  const [viewData, setViewData] = useState("table");
  const [editable, setEditable] = useState(null);
  //table data
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render: (text) => <span>{moment(text).format("DD-MM-YYYY")}</span>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Actions",
      render: (text, record) => (
        <div>
          <EditOutlined
            onClick={() => {
              setEditable(record);
              setShowModal(true);
            }}
          />
          <DeleteOutlined className="mx-2" onClick={() => {handleDelete(record)}}/>
        </div>
      ),
    },
  ];

  //useEffecct Hook

  useEffect(() => {
    const getALLTransaction = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        setLoading(true);
        const res = await axios.post("/transection/get-transection", {
          userid: user.user._id,
          frequency,
          selectedDates,
          type,
        });
        setLoading(false);
        setAllTransection(res.data);
        console.log(res.data);
      } catch (error) {
        console.log(error);
        setLoading(false);

        message.error("fetch issue with transection");
      }
    };
    getALLTransaction();
  }, [frequency, selectedDates, type]);


  const handleDelete = async(record) => {
try {
  setLoading(true);
  axios.post("/transection/delete-transection", {transactionID:record._id})
  setLoading(false);
  message.success("transaction deleted");
  
} catch (error) {
  console.log(error);
        setLoading(false);

        message.error("unable to delete");
}
  };



  const handleSubmit = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setLoading(true);
      console.log(user.user._id);
      if(editable){
        
      await axios.post("/transection/edit-transection", {
        payload:{
          ...values,
          userId:user.user._id
        },
        transactionID:editable._id
      });
      console.log(values);

      setLoading(false);
      message.success("Transection updated Successfully");

      }else{
        
      await axios.post("/transection/add-transection", {
        userid: user.user._id,
        ...values,
      });
      setLoading(false);
      message.success("Transection Added Successfully");
      }

      setShowModal(false);
      setEditable(null);
    } catch (error) {
      setLoading(false);
      message.error("failed to add transection");
    }
  };

  return (
    <Layout>
      {loading && <Spinner />}
      <div className="filters">
        <div>
          <h6>Select Frequency</h6>
          <Select value={frequency} onChange={(values) => setFrequency(values)}>
            <Select.Option value="7">Last 1 week</Select.Option>
            <Select.Option value="30">Last 1 month</Select.Option>
            <Select.Option value="365">Last 1 year</Select.Option>
            <Select.Option value="custom">custom</Select.Option>
          </Select>
          {frequency === "custom " && (
            <RangePicker
              value={selectedDates}
              onChange={(values) => setSelectedDates(values)}
            />
          )}
        </div>
        <div>
          <h6>Select Type</h6>
          <Select value={type} onChange={(values) => setType(values)}>
            <Select.Option value="all">all</Select.Option>
            <Select.Option value="income">income</Select.Option>
            <Select.Option value="expense">expense</Select.Option>
          </Select>
          {frequency === "custom " && (
            <RangePicker
              value={selectedDates}
              onChange={(values) => setSelectedDates(values)}
            />
          )}
        </div>
        <div className="switch-icons">
          <UnorderedListOutlined
            className={`mx-2 ${
              viewData === "table" ? "active-icons" : "inactive-icons"
            }`}
            onClick={() => setViewData("table")}
          />
          <AreaChartOutlined
            className={`mx-2 ${
              viewData === "analytics" ? "active-icons" : "inactive-icons"
            }`}
            onClick={() => setViewData("analytics")}
          />
        </div>
        <div>
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            add new
          </button>
        </div>
      </div>
      <div className="content">
        {viewData === "table" ? (
          <Table columns={columns} dataSource={allTransection} />
        ) : (
          <Analytics allTransection={allTransection} />
        )}
      </div>
      <Modal
        title={editable ? "Edit transaction" : "add transaction"}
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={false}
      >
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={editable}
        >
          <Form.Item label="Amount" name="amount">
            <input type="text" />
          </Form.Item>

          <Form.Item label="type" name="type">
            <Select>
              <Select.Option value="income">Income</Select.Option>
              <Select.Option value="expense">Expense</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Category" name="category">
            <Select>
              <Select.Option value="salary">salary</Select.Option>
              <Select.Option value="tip">tip</Select.Option>
              <Select.Option value="project">project</Select.Option>
              <Select.Option value="food">food</Select.Option>
              <Select.Option value="movie">movie</Select.Option>
              <Select.Option value="bills">bills</Select.Option>
              <Select.Option value="medical">medical</Select.Option>
              <Select.Option value="fees">fees</Select.Option>
              <Select.Option value="tax">tax</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Date" name="date">
            <Input type="date" />
          </Form.Item>
          <Form.Item label="description" name="description">
            <Input type="text" />
          </Form.Item>
          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </Form>
      </Modal>
    </Layout>
  );
};

export default HomePage;
