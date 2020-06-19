import React, { useState, useRef } from "react";
import { Button, Input, Table, message } from "antd";
import { externalDataSource } from "../../Fixtures";

import "./index.css";

const tableColumns = [
  { title: "Student Id", dataIndex: "student_id" },
  { title: "Name", dataIndex: "name" },
  { title: "Phone Number", dataIndex: "phone_number" },
  { title: "Remarks", dataIndex: "remarks" },
];

export default () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableDataSource, setTableDataSource] = useState(externalDataSource);
  const textInputRemarksRef = useRef(null);

  const start = () => {
    setLoading(true);
    // ajax request after empty completing
    let newTableDataSource = [...tableDataSource];
    newTableDataSource.forEach(function (data, index) {
      if (index in selectedRowKeys) {
        data["remarks"] = textInputRemarksRef.current.state.value;
      }
    });
    setTableDataSource(newTableDataSource);

    setTimeout(() => {
      setSelectedRowKeys([]);
      textInputRemarksRef.current.state.value = "";
      setLoading(false);
      message.success("Remarks updated for the selected rows successfully");
    }, 1000);
  };

  const selectRow = (record) => {
    textInputRemarksRef.current.focus();
    const newSelectedRowKeys = [...selectedRowKeys];
    if (newSelectedRowKeys.indexOf(record.key) >= 0) {
      newSelectedRowKeys.splice(newSelectedRowKeys.indexOf(record.key), 1);
    } else {
      newSelectedRowKeys.push(record.key);
    }
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const onSelectChange = (selectedRowKeys) => {
    textInputRemarksRef.current.focus();
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;
  return (
    <div>
      <div className="edit-action-container">
        <Input
          className="input-remarks"
          placeholder="Enter bulk remarks"
          ref={textInputRemarksRef}
        />
        <Button
          type="primary"
          onClick={start}
          disabled={!hasSelected}
          loading={loading}
        >
          Update Remarks
        </Button>
        <span className="show-selected-items">
          {hasSelected &&
            (selectedRowKeys.length > 1
              ? `Selected ${selectedRowKeys.length} items`
              : `Selected ${selectedRowKeys.length} item`)}
        </span>
      </div>
      <Table
        rowSelection={rowSelection}
        dataSource={tableDataSource}
        columns={tableColumns}
        onRow={(record) => ({
          onClick: () => {
            selectRow(record);
          },
        })}
        pagination={false}
      />
    </div>
  );
};
