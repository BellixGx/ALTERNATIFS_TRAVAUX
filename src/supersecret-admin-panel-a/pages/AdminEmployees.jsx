import React, { useState, useEffect, useMemo, useCallback, useRef  } from 'react';
import { config } from '../../config';
import { useTranslation } from 'react-i18next';
import { 
  Tabs, Button, 
  Table, message,
  Radio, Modal, 
  Form, Input, 
  Space, Skeleton,  
  DatePicker, Select, 
  Tag, Collapse, 
  Flex, Switch
} from 'antd';
import {
  PlusCircleOutlined, 
  DeleteOutlined, 
  DollarOutlined, 
  PrinterOutlined, 
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  UserOutlined,
  SendOutlined
} from '@ant-design/icons';
import { NumericFormat } from 'react-number-format';
import dayjs from 'dayjs';
import moment from 'moment';
import '../Admin.css';
import logo1 from './logo.jpg';
import "jspdf-autotable";

const AdminEmployees = () => {
  const [activeTab, setActiveTab] = useState(sessionStorage.getItem("activeTab") || "1");
  const [attendanceData, setAttendanceData] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(moment().startOf('week'));
  const [form] = Form.useForm();
  const [pointageLoading, setPointageLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [advanceOpen, setAdvanceOpen] = useState(false);
  const [advanceForm] = Form.useForm();

  // For making rappots
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [activeKey, setActiveKey] = useState(null);
  const [toDelete, setToDelete] = useState(false);
  const [rowsToDelete, setRowsToDelete] = useState([]);
  const [fetchingAll, setFetchingAll] = useState(null);
  const [selectEmpForSalaries, setSelectEmpForSalaries] = useState([]);
  const [modifiedAttendance, setModifiedAttendance] = useState({});
  const [submittedDates, setSubmittedDates] = useState([]);
  const [editableDates, setEditableDates] = useState({});
  const options = [];
  const { t } = useTranslation();

  // For Printing
 
  const tableRefs = useRef({});

  const handlePrint = async (reportKey) => {
    if (!tableRefs.current[reportKey]) return;

    const report = reports.find((r) => r.key === reportKey);
    if (!report) return;

    let writableStream = null;
    let fileHandle = null;

    try {
      if (window.showSaveFilePicker) {
        fileHandle = await window.showSaveFilePicker({
          suggestedName: `report_${reportKey}.pdf`,
          types: [{ description: "PDF Files", accept: { "application/pdf": [".pdf"] } }],
        });
        writableStream = await fileHandle.createWritable();
      }

      const worker = new Worker(new URL("./pdfWorker.js", import.meta.url), { type: "module" });

      worker.postMessage({ report, logoBase64: logo1 });

      worker.onmessage = async (event) => {
        const { pdfBlob } = event.data;

        if (writableStream) {
          const reader = pdfBlob.stream().getReader();
          const writer = writableStream.getWriter();

          async function writeStream() {
            let { done, value } = await reader.read();
            while (!done) {
              await writer.write(value);
              ({ done, value } = await reader.read());
            }
            await writer.close();
          }

          await writeStream();

          const url = URL.createObjectURL(pdfBlob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `report_${reportKey}.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        } else {
          const url = URL.createObjectURL(pdfBlob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `report_${reportKey}.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      };

      worker.onerror = (error) => {
        console.error("Worker error:", error);
        message.error(t('employees.error.submissionFailed', { message: error.message }));
      };
    } catch (error) {
      if (error.name === "AbortError") {
        console.warn("User canceled the save operation.");
      } else {
        console.error("File saving failed", error);
        message.error(t('employees.error.submissionFailed', { message: error.message }));
      }
    }
  };

  useEffect(() => {
    const savedReports = JSON.parse(localStorage.getItem("reports")) || [];
    setReports(savedReports);
  }, []);

  const fetchEmployees = useCallback(async () => {
    if (attendanceData.length > 0) return;

    setPointageLoading(true);
    try {
      const response = await fetch(`${config.apiBase}${config.endpoints.fetchEmployees}`);
      if (!response.ok) {
        throw new Error(t('employees.error.fetchEmployees'));
      }

      const employees = await response.json();
      const initializedData = employees.map((employee) => ({
        ...employee,
        attendance: employee.attendance || {},
      }));
      setAttendanceData(initializedData);
    } catch (error) {
      message.error(t('employees.error.submissionFailed', { message: error.message }));
    } finally {
      setPointageLoading(false);
    }
  }, [attendanceData.length, t]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const fetchNewEmployees = async () => {
    try {
      const response = await fetch(`${config.apiBase}${config.endpoints.fetchNewEmployees}`);
      if (!response.ok) {
        throw new Error(t('employees.error.fetchNewEmployees'));
      }

      const newEmployees = await response.json();

      setAttendanceData((prevData) => {
        const existingIds = new Set(prevData.map(emp => emp.employeeid));

        const uniqueNewEmployees = newEmployees
          .filter(emp => !existingIds.has(emp.employeeid))
          .map(emp => ({
            ...emp,
            attendance: emp.attendance || {},
          }));

        return [...prevData, ...uniqueNewEmployees];
      });
    } catch (error) {
      message.error(t('employees.error.submissionFailed', { message: error.message }));
    }
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setRowsToDelete(selectedRows);
      if (selectedRowKeys.length >= 1) {
        setToDelete(true);
      } else if (selectedRowKeys.length === 0) {
        setToDelete(false);
      }
    },
  };

  const onDeleteEmp = async () => {
    setAttendanceData(prevData =>
      prevData.filter(row => !rowsToDelete.some(deletedRow => deletedRow.employeeid === row.employeeid))
    );
    try {
      const response = await fetch(`${config.apiBase}${config.endpoints.deleteEmployees}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rowsToDelete),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || t('employees.error.delete'));
      }

      const result = await response.json();
      message.success(result.message || t('employees.success.delete'));
    } catch (error) {
      message.error(t('employees.error.submissionFailed', { message: error.message }));
    }
  };

  const onChangeFetching = (e) => {
    const isFetchingAll = e.target.value === "all";
    setFetchingAll(isFetchingAll);
    if (isFetchingAll) {
      setSelectEmpForSalaries([]);
    }

    localStorage.setItem("fetchingAll", JSON.stringify(isFetchingAll));
    localStorage.removeItem("selectedEmployees");
  };

  useEffect(() => {
    setFetchingAll(true);
    setSelectEmpForSalaries([]);
    localStorage.removeItem("fetchingAll");
    localStorage.removeItem("selectedEmployees");
  }, []);

  const fetchSalariesForEmp = (value) => {
    setSelectEmpForSalaries(value);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    sessionStorage.setItem("activeTab", key);
  };

  useEffect(() => {
    if (activeTab === '2' && attendanceData.length === 0) {
      setLoading(true);
      fetchEmployees().finally(() => setLoading(false));
    }
  }, [attendanceData.length, fetchEmployees, activeTab]);

  useEffect(() => {
    const now = moment();
    const nextDayStart = moment().add(1, 'day').startOf('day');
    const timeUntilMidnight = nextDayStart.diff(now);

    const timeout = setTimeout(() => {
      setCurrentWeek(moment().startOf('week'));
    }, timeUntilMidnight);

    return () => clearTimeout(timeout);
  }, [currentWeek]);

  const attendanceUpdate = (employeeId, date, status) => {
    setAttendanceData((prevData) =>
      prevData.map((employee) =>
        employee.employeeid === employeeId
          ? { ...employee, attendance: { ...employee.attendance, [date]: status } }
          : employee
      )
    );

    setModifiedAttendance((prev) => ({
      ...prev,
      [`${employeeId}-${date}`]: { EmployeeID: employeeId, Date: date, Status: status === "present" ? 1 : 0 },
    }));
  };

  const handleWeekChange = (date) => {
    if (date) {
      setCurrentWeek(date.startOf('week'));
    }
  };

  const handleSubmitAttendance = async () => {
    const currentDay = moment().format('YYYY-MM-DD');
    const payload = attendanceData
      .map((employee) => ({
        EmployeeID: employee.employeeid,
        Date: currentDay,
        Status: employee.attendance[currentDay] === 'present' ? 1 : 0,
      }))
      .filter((entry) => entry.Status !== undefined);

    try {
      const response = await fetch(`${config.apiBase}${config.endpoints.submitPointage}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || t('employees.error.saveAttendance'));
      }

      const result = await response.json();
      message.success(result.message || t('employees.success.submitAttendance'));
      fetchSubmittedDates();
    } catch (error) {
      message.error(t('employees.error.submissionFailed', { message: error.message }));
    }
  };

  const addEmployees = async (values) => {
    try {
      const employees = values.employees.map(emp => ({
        name: emp.name,
        job: emp.role,
        prix: parseFloat(emp.prix).toFixed(2),
        phonenumber: emp.phone && emp.phone.trim() !== '' ? emp.phone : null,
      }));
      const response = await fetch(`${config.apiBase}${config.endpoints.addEmployees}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employees)
      });

      if (!response.ok) throw new Error('Failed to save employees');

      setOpen(false);
      form.resetFields();
      message.success(t('employees.successAdd'));
      fetchNewEmployees();
    } catch (error) {
      console.error(error);
      message.error(t('employees.errorAdd', { message: error.message }));
    }
  };

  const updateAttendance = useCallback(
    async (selectedDate) => {
      try {
        if (typeof selectedDate !== "string") {
          throw new Error(`selectedDate must be a string, got: ${typeof selectedDate} - Value: ${JSON.stringify(selectedDate)}`);
        }

        const payload = attendanceData.map((employee) => ({
          EmployeeID: employee.employeeid,
          Date: selectedDate,
          Status: employee.attendance[selectedDate] === "present" ? 1 : 0,
        }));

        const response = await fetch(`${config.apiBase}${config.endpoints.updatePointage}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(errorResponse.error || "Failed to update attendance");
        }

        const result = await response.json();
        message.success(t('employees.successUpdateAttendance', { date: selectedDate }));

        setModifiedAttendance((prev) => {
          const newModified = { ...prev };
          Object.keys(newModified).forEach((key) => {
            if (key.endsWith(`-${selectedDate}`)) {
              delete newModified[key];
            }
          });
          return newModified;
        });
      } catch (error) {
        message.error(t('employees.errorUpdateAttendance', { message: error.message }));
      }
    },
    [attendanceData, setModifiedAttendance]
  );

  const toggleEditMode = useCallback((dateKey) => {
    setEditableDates((prev) => {
      const updatedDates = { ...prev, [dateKey]: !prev[dateKey] };
      return updatedDates;
    });
  }, []);

  const handleConfirmEdit = useCallback(
    (dateKey) => {
      updateAttendance(dateKey);
      toggleEditMode(dateKey);
    },
    [updateAttendance, toggleEditMode]
  );

  const handleCancelEdit = useCallback(
    (dateKey) => {
      toggleEditMode(dateKey);
    },
    [toggleEditMode]
  );

  const fetchSubmittedDates = async () => {
    try {
      const response = await fetch(`${config.apiBase}${config.endpoints.getSubmittedDates}`);
      if (!response.ok) throw new Error('Failed to fetch submitted dates');
      const dates = await response.json();
      setSubmittedDates(dates);
    } catch (error) {
      console.error('Error fetching submitted dates:', error);
      message.error(t('employees.error.submissionFailed', { message: error.message }));
    }
  };

  useEffect(() => {
    fetchSubmittedDates();
  }, []);

  const columns = useMemo(
    () => [
      { title: t('employees.nameColumn'), dataIndex: 'name', key: 'name' },
      ...Array.from({ length: 7 }, (_, i) => {
        const dayDate = currentWeek.clone().add(i, 'days');
        const dateKey = dayDate.format('YYYY-MM-DD');
        const isCurrentDay = dayDate.isSame(moment(), 'day');
        const currentDay = moment();
        const isBeforeCurrentDay = dayDate.isBefore(currentDay, 'day');
        const isSubmitted = submittedDates.includes(dateKey);
        const isEditing = editableDates[dateKey];
        const isDisabled = (!isEditing && (!isBeforeCurrentDay || !isCurrentDay));

        return {
          title: (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: isCurrentDay ? '#e6f7ff' : 'transparent',
                border: isCurrentDay ? '1px solid #1890ff' : 'none',
                borderRadius: '4px',
                padding: '4px',
              }}
            >
              <div style={{ textAlign: 'center', fontSize: '12px', fontWeight: isCurrentDay ? 'bold' : 'normal' }}>
                {t(`employees.days.${dayDate.format('dddd').toLowerCase()}`)}
                <br />
                {dayDate.format('(YYYY-MM-DD)')}
              </div>
              {(isBeforeCurrentDay || isSubmitted) && (
                <div style={{ display: 'flex', gap: '5px' }}>
                  {isEditing ? (
                    <>
                      <Button
                        type="text"
                        icon={<CheckOutlined style={{ color: 'green', fontSize: '14px' }} />}
                        onClick={() => handleConfirmEdit(dateKey)}
                        aria-label={t('employees.confirm')}
                      />
                      <Button
                        type="text"
                        icon={<CloseOutlined style={{ color: 'red', fontSize: '14px' }} />}
                        onClick={() => handleCancelEdit(dateKey)}
                        aria-label={t('employees.cancel')}
                      />
                    </>
                  ) : (
                    <Button
                      type="text"
                      icon={<EditOutlined style={{ fontSize: '14px' }} />}
                      onClick={() => toggleEditMode(dateKey)}
                      aria-label={t('employees.edit')}
                    />
                  )}
                </div>
              )}
            </div>
          ),
          dataIndex: dateKey,
          render: (_, record) => {
            const attendanceValue = record.attendance[dateKey] === 'present';

            return (
              <Switch
                checked={attendanceValue}
                onChange={(checked) => attendanceUpdate(record.employeeid, dateKey, checked ? 'present' : 'absent')}
                disabled={isDisabled}
                checkedChildren={t('employees.present')}
                unCheckedChildren={t('employees.absent')}
              />
            );
          },
        };
      }),
    ],
    [currentWeek, submittedDates, editableDates, toggleEditMode, handleConfirmEdit, handleCancelEdit, t]
  );
  const salariesColumns = useMemo(() => [
    {
      title: t('employees.salariesColumns.name'),
      dataIndex: 'name',
      key: 'name',
      render: text => <span style={{ color: '#5D8AA8', fontWeight: 'bold' }}>{text}</span>
    },
    { title: t('employees.salariesColumns.job'), dataIndex: 'job', key: 'job' },
    { title: t('employees.salariesColumns.prix'), dataIndex: 'prix', key: 'prix' },
    {
      title: t('employees.salariesColumns.daysPresent'),
      dataIndex: 'total_days_present',
      key: 'total_days_present',
      render: presentTag => (
        <span><Tag color='green' key={presentTag}>{presentTag}</Tag></span>
      )
    },
    {
      title: t('employees.salariesColumns.daysAbsent'),
      dataIndex: 'total_days_absent',
      key: 'total_days_absent',
      render: absentTag => (
        <span><Tag color='red' key={absentTag}>{absentTag}</Tag></span>
      )
    },
    {
      title: t('employees.salariesColumns.totalSalary'),
      dataIndex: 'total_salary',
      key: 'total_salary',
      render: (totalSalary) => (
        <span>{totalSalary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}</span>
      ),
    },
    {
      title: t('employees.salariesColumns.totalAdvances'),
      dataIndex: 'total_advances',
      key: 'total_advances',
      render: (totalAdvances) => (
        <span>{totalAdvances.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}</span>
      ),
    },
    {
      title: t('employees.salariesColumns.finalSalary'),
      dataIndex: 'final_salary',
      key: 'final_salary',
      render: (finalSalary) => (
        <Tag color="blue" key={finalSalary}>
          {finalSalary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
        </Tag>
      ),
    },
  ], [t]);

  const handleAdvanceSubmit = async (values) => {
    try {
      const payload = values.advances.map(adv => ({
        EmployeeID: adv.employeeid,
        Amount: parseFloat(adv.amount),
        Date: adv.date.format('YYYY-MM-DD'),
      }));

      const response = await fetch(`${config.apiBase}${config.endpoints.addAdvances}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to save advance');
      }

      const result = await response.json();

      setAdvanceOpen(false);
      advanceForm.resetFields();
      message.success(result.message || t('employees.success.addAdvance'));
    } catch (error) {
      message.error(t('employees.error.submissionFailed', { message: error.message }));
    }
  };

  const fetchSalaries = async () => {
    if (!startDate || !endDate) {
      message.error(t('employees.error.selectDates'));
      return;
    }

    setLoading(true);
    try {
      let url = `${config.apiBase}${config.endpoints.fetchSalaries}?start_date=${startDate.format("YYYY-MM-DD")}&end_date=${endDate.format("YYYY-MM-DD")}`;

      if (!fetchingAll && selectEmpForSalaries.length > 0) {
        url += `&employee_ids=${selectEmpForSalaries.join(",")}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(t('employees.error.fetchSalaries'));
      }

      const result = await response.json();
      const reportKey = fetchingAll
        ? `all_${startDate.format("YYYY-MM-DD")}_${endDate.format("YYYY-MM-DD")}`
        : `emp_${selectEmpForSalaries.join("_")}_${startDate.format("YYYY-MM-DD")}_${endDate.format("YYYY-MM-DD")}`;

      const newReport = {
        key: reportKey,
        startDate: startDate.format("YYYY-MM-DD"),
        endDate: endDate.format("YYYY-MM-DD"),
        employeeIds: fetchingAll ? ["all"] : selectEmpForSalaries,
        data: result,
      };

      const updatedReports = [newReport, ...reports];
      setReports(updatedReports);
      localStorage.setItem("reports", JSON.stringify(updatedReports));

      setActiveKey(newReport.key);
    } catch (err) {
      message.error(t('employees.error.submissionFailed', { message: err.message }));
    } finally {
      setLoading(false);
    }
  };

  const deleteReport = (key) => {
    const updatedReports = reports.filter(report => report.key !== key);
    setReports(updatedReports);
    localStorage.setItem("reports", JSON.stringify(updatedReports));
    message.success(t('employees.success.deleteReport'));
  };

  const tabsItems = [
    {
      key: '1',
      label: t('employees.tabs.dashboard'),
      children: <h2>{t('employees.tabs.employeesDashboard')}</h2>
    },
    {
      key: '2',
      label: t('employees.tabs.pointage'),
      children: (
        <>
          <div className="p-4" style={{ padding: "20px" }}>
            <h2
              className="text-xl font-semibold mb-4"
              style={{
                textAlign: "center",
                fontSize: "24px",
                fontWeight: "bold",
                marginBottom: "20px",
              }}
            >
              {t('employees.tabs.pointageManagement')}
            </h2>

            <div>
              <div style={{ display: 'flex', justifyContent: 'right', gap: '25px', marginBottom: '10px' }}>
                <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                  <DatePicker
                    picker="week"
                    value={currentWeek}
                    onChange={handleWeekChange}
                    format="YYYY-[Week]WW"
                    style={{ width: '200px' }}
                    placeholder={t('employees.form.selectWeek')}
                  />
                </div>
                <div>
                  <Button type="primary" onClick={() => setAdvanceOpen(true)}>
                    <PlusCircleOutlined style={{ fontSize: '20px' }} />
                    <DollarOutlined style={{ fontSize: '20px' }} />
                  </Button>
                </div>
                <Modal
                  open={advanceOpen}
                  title={t('employees.form.addAdvance')}
                  okText={t('employees.form.addAdvanceButton')}
                  cancelText={t('employees.form.cancelButton')}
                  onCancel={() => setAdvanceOpen(false)}
                  onOk={() => advanceForm.submit()}
                  width={700}
                >
                  <Form form={advanceForm} layout="vertical" onFinish={handleAdvanceSubmit} style={{ width: '100%' }}>
                    <Form.List name='advances'>
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map(({ key, name, ...restField }) => (
                            <Space
                              key={key}
                              align='baseline'
                              style={{ display: 'flex', width: '100%', gap: '16px' }}
                            >
                              <Form.Item
                                {...restField}
                                label={t('employees.form.employee')}
                                name={[name, 'employeeid']}
                                rules={[{ required: true, message: t('employees.form.selectEmployee') }]}
                                style={{ flex: 1 }}
                              >
                                <Select placeholder={t('employees.form.selectEmployee')}>
                                  {attendanceData.map((employee) => (
                                    <Select.Option key={employee.employeeid} value={employee.employeeid}>
                                      {employee.name}
                                    </Select.Option>
                                  ))}
                                </Select>
                              </Form.Item>

                              <Form.Item
                                {...restField}
                                label={t('employees.form.amount')}
                                name={[name, 'amount']}
                                rules={[
                                  { required: true, message: t('employees.form.enterAmount') },
                                  { type: 'number', min: 1, message: 'Amount must be greater than 0', transform: (value) => parseFloat(value) },
                                ]}
                                style={{ flex: 1 }}
                              >
                                <Input type="number" placeholder={t('employees.form.enterAmount')} />
                              </Form.Item>

                              <Form.Item
                                {...restField}
                                label={t('employees.form.date')}
                                name={[name, 'date']}
                                rules={[{ required: true, message: t('employees.form.selectDate') }]}
                                style={{ flex: 1 }}
                              >
                                <DatePicker
                                  format="YYYY-MM-DD"
                                  disabledDate={(current) => current && current > dayjs().endOf('day')}
                                />
                              </Form.Item>
                              <Button onClick={() => remove(name)} danger>
                                <DeleteOutlined />
                              </Button>
                            </Space>
                          ))}
                          <Button type="dashed" onClick={() => add()} block icon={<PlusCircleOutlined />}>
                            {t('employees.form.addMore')}
                          </Button>
                        </>
                      )}
                    </Form.List>
                  </Form>
                </Modal>

                <div>
                  <Button type="primary" onClick={() => setOpen(true)}>
                    <PlusCircleOutlined style={{ fontSize: '20px' }} />
                    <UserOutlined style={{ fontSize: '20px' }} />
                  </Button>
                </div>
              </div>
              <Modal
                open={open}
                title={t('employees.form.addEmployees')}
                okText={t('employees.form.addButton')}
                cancelText={t('employees.form.cancelButton')}
                onCancel={() => setOpen(false)}
                onOk={() => form.submit()}
                width={800}
              >
                <Form form={form} layout="vertical" onFinish={addEmployees} style={{ width: '100%' }}>
                  <Form.List name="employees">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, ...restField }) => (
                          <Space
                            key={key}
                            align="baseline"
                            style={{ display: 'flex', width: '100%', gap: '16px' }}
                          >
                            <Form.Item
                              {...restField}
                              name={[name, 'name']}
                              label={t('employees.form.name')}
                              rules={[{ required: true, message: t('employees.form.employeeName') }]}
                              style={{ flex: 1 }}
                            >
                              <Input placeholder={t('employees.form.employeeName')} />
                            </Form.Item>

                            <Form.Item
                              {...restField}
                              name={[name, 'role']}
                              label={t('employees.form.role')}
                              rules={[{ required: true, message: t('employees.form.enterRole') }]}
                              style={{ flex: 1 }}
                            >
                              <Input placeholder={t('employees.form.enterRole')} />
                            </Form.Item>

                            <Form.Item
                              {...restField}
                              name={[name, 'prix']}
                              label={t('employees.salariesColumns.prix')}
                              rules={[{ required: true, message: t('employees.form.enterPrix') }]}
                              style={{ flex: 1 }}
                            >
                              <Input type="number" placeholder={t('employees.form.enterPrix')} />
                            </Form.Item>

                            <Form.Item
                              {...restField}
                              name={[name, 'phone']}
                              label={t('employees.form.phone')}
                              style={{ flex: 1 }}
                            >
                              <NumericFormat
                                format="## ## ## ## ##"
                                customInput={Input}
                                placeholder={t('employees.form.enterPhone')}
                              />
                            </Form.Item>

                            <Button onClick={() => remove(name)} danger>
                              <DeleteOutlined />
                            </Button>
                          </Space>
                        ))}

                        <Button type="dashed" onClick={() => add()} block icon={<PlusCircleOutlined />}>
                          {t('employees.form.addMore')}
                        </Button>
                      </>
                    )}
                  </Form.List>
                </Form>
              </Modal>

              {pointageLoading ? (
                <Skeleton active />
              ) : (
                <Table
                  rowSelection={rowSelection}
                  dataSource={attendanceData}
                  columns={columns}
                  rowKey="employeeid"
                  pagination={{ pageSize: 10 }}
                  bordered
                />
              )}
              <div style={{ display: "flex", justifyContent: "right", gap: "20px", marginTop: '20px' }}>
                {toDelete && (
                  <Button color='danger' variant="outlined" onClick={onDeleteEmp}>
                    {t('employees.delete')}
                  </Button>
                )}
                <Button color="green" variant="outlined" onClick={handleSubmitAttendance}>
                  <SendOutlined />
                  {t('employees.form.submitAttendance')}
                </Button>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      key: "3",
      label: t('employees.tabs.reports'),
      children: (
        <>
          <div className="p-4" style={{ padding: "20px" }}>
            <h2
              className="text-xl font-semibold mb-4"
              style={{
                textAlign: "center",
                fontSize: "24px",
                fontWeight: "bold",
                marginBottom: "20px",
              }}
            >
              {t('employees.tabs.employeesReports')}
            </h2>

            <Flex vertical gap="middle">
              <Radio.Group onChange={onChangeFetching} defaultValue="all">
                <Radio.Button value="all">{t('employees.form.all')}</Radio.Button>
                <Radio.Button value="select">{t('employees.form.selectedUsers')}</Radio.Button>
              </Radio.Group>
            </Flex>

            {fetchingAll ? (
              <Form style={{ marginBottom: "20px" }}>
                <Space
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "25px",
                    width: "100%",
                  }}
                >
                  <Form.Item
                    name="startdate"
                    label={t('employees.form.startDate')}
                    rules={[{ required: true, message: t('employees.form.selectStartDate') }]}
                  >
                    <DatePicker
                      format="YYYY-MM-DD"
                      onChange={(date) => setStartDate(date)}
                      disabledDate={(current) => current && current > dayjs().endOf("day")}
                    />
                  </Form.Item>

                  <Form.Item
                    name="enddate"
                    label={t('employees.form.endDate')}
                    rules={[{ required: true, message: t('employees.form.selectEndDate') }]}
                  >
                    <DatePicker
                      format="YYYY-MM-DD"
                      onChange={(date) => setEndDate(date)}
                      disabledDate={(current) => current && current > dayjs().endOf("day")}
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" onClick={fetchSalaries}>
                      {t('employees.form.fetchSalaries')}
                    </Button>
                  </Form.Item>
                </Space>
              </Form>
            ) : (
              <Form style={{ marginBottom: "20px" }}>
                <Space
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "25px",
                    width: "100%",
                  }}
                >
                  <Form.Item
                    rules={[{ required: true, message: t('employees.form.selectEmployees') }]}
                  >
                    <Select
                      mode="multiple"
                      allowClear
                      style={{ width: '400px' }}
                      placeholder={t('employees.form.selectEmployeesPlaceholder')}
                      defaultValue={[]}
                      onChange={fetchSalariesForEmp}
                      options={options}
                    />
                  </Form.Item>
                  <Form.Item
                    name="startdate"
                    label={t('employees.form.startDate')}
                    rules={[{ required: true, message: t('employees.form.selectStartDate') }]}
                  >
                    <DatePicker
                      format="YYYY-MM-DD"
                      onChange={(date) => setStartDate(date)}
                      disabledDate={(current) => current && current > dayjs().endOf("day")}
                    />
                  </Form.Item>

                  <Form.Item
                    name="enddate"
                    label={t('employees.form.endDate')}
                    rules={[{ required: true, message: t('employees.form.selectEndDate') }]}
                  >
                    <DatePicker
                      format="YYYY-MM-DD"
                      onChange={(date) => setEndDate(date)}
                      disabledDate={(current) => current && current > dayjs().endOf("day")}
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" onClick={fetchSalaries}>
                      {t('employees.form.fetchSalaries')}
                    </Button>
                  </Form.Item>
                </Space>
              </Form>
            )}

            {loading && <Skeleton active />}

            <div ref={tableRefs} style={{ padding: "20px", background: "#fff" }}>
              <Collapse
                accordion
                activeKey={activeKey}
                onChange={(key) => setActiveKey(key)}
                items={reports.map((report) => ({
                  key: report.key,
                  label: `${t('employees.form.from')}: ${report.startDate} ${t('employees.form.to')}: ${report.endDate}`,
                  children: (
                    <div
                      ref={(el) => (tableRefs.current[report.key] = el)}
                      style={{ display: activeKey?.includes(report.key) ? "block" : "none" }}
                    >
                      <Table
                        style={{
                          marginBottom: "30px",
                          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                          borderRadius: "8px",
                        }}
                        dataSource={report.data}
                        columns={salariesColumns}
                        rowKey="employeeid"
                        pagination={false}
                        bordered
                        title={() => (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              gap: "30px",
                              fontSize: "20px",
                              padding: "8px 16px",
                              backgroundColor: "#f5f5f5",
                              borderRadius: "4px",
                            }}
                          >
                            <span>
                              <strong>{t('employees.form.from')}: {report.startDate}</strong>
                            </span>
                            <span>
                              <strong>{t('employees.form.to')}: {report.endDate}</strong>
                            </span>
                          </div>
                        )}
                        footer={() => {
                          const totalFinalSalary = report.data.reduce(
                            (sum, record) => sum + record.final_salary,
                            0
                          );
                          return (
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(8, 1fr)",
                                fontWeight: "bold",
                                textAlign: "center",
                                borderTop: "1px solid #d9d9d9",
                              }}
                            >
                              <div
                                style={{
                                  gridColumn: "1 / span 7",
                                  fontSize: "x-large",
                                  textAlign: "center",
                                  padding: "8px",
                                  borderRight: "1px solid rgb(133, 132, 132)",
                                }}
                              >
                                {t('employees.form.total')}
                              </div>
                              <div
                                style={{
                                  gridColumn: "8 / span 1",
                                  marginTop: "15px",
                                  textAlign: "center",
                                  padding: "8px",
                                }}
                              >
                                <Tag color="darkgreen" style={{ fontSize: "14px", padding: "5px 10px" }}>
                                  {totalFinalSalary.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
                                </Tag>
                              </div>
                            </div>
                          );
                        }}
                      />
                    </div>
                  ),
                  extra: (
                    <div style={{ display: "flex", gap: "15px" }}>
                      <Button
                        size="small"
                        color="cyan"
                        variant="outlined"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrint(report.key);
                        }}
                      >
                        <PrinterOutlined />
                        {t('employees.form.print')}
                      </Button>
                      <Button
                        size="small"
                        danger
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteReport(report.key);
                        }}
                      >
                        <DeleteOutlined />
                        {t('employees.form.deleteReport')}
                      </Button>
                    </div>
                  ),
                }))}
              />
            </div>
          </div>
        </>
      ),
    }
  ];

  return (
    <div>
      <Tabs activeKey={activeTab} onChange={handleTabChange} centered items={tabsItems} destroyInactiveTabPane={false} />
    </div>
  );
};
export default AdminEmployees;
