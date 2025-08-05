import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const API_URL = 'http://localhost:5000/api/student';

  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    phoneNumber: '',
    address: '',
    avatar: '',
    id: null
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(API_URL);
      setStudents(res.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách:", err);
    }
  };

  const handleSubmit = async () => {
    if (!formData.fullName.trim()) {
      alert("Vui lòng nhập họ tên.");
      return;
    }

    if (formData.age === '' || isNaN(formData.age)) {
      alert("Vui lòng nhập tuổi hợp lệ.");
      return;
    }

    const payload = {
      fullName: formData.fullName,
      age: Number(formData.age),
      phoneNumber: formData.phoneNumber,
      address: formData.address,
      avatar: formData.avatar
    };

    try {
      if (isEditing) {
        await axios.put(`${API_URL}/${formData.id}`, payload);
      } else {
        await axios.post(API_URL, payload);
      }

      setFormData({
        fullName: '',
        age: '',
        phoneNumber: '',
        address: '',
        avatar: '',
        id: null
      });
      setIsEditing(false);
      fetchStudents();
    } catch (err) {
      console.error("Lỗi khi gửi:", err.response?.data || err.message);
      alert("Không gửi được. Kiểm tra dữ liệu.");
    }
  };

  const handleEdit = (student) => {
    setFormData({ ...student });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn chắc chắn muốn xoá sinh viên này?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchStudents();
      } catch (err) {
        console.error("Lỗi khi xoá:", err);
        alert("Không thể xoá sinh viên.");
      }
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Quản lý sinh viên</h1>

      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Họ tên</th>
            <th>Tuổi</th>
            <th>SĐT</th>
            <th>Địa chỉ</th>
            <th>Avatar</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.fullName}</td>
              <td>{s.age}</td>
              <td>{s.phoneNumber}</td>
              <td>{s.address}</td>
              <td>
                {s.avatar ? (
                  <img src={s.avatar} alt="avatar" className="avatar" />
                ) : (
                  <span>Không có</span>
                )}
              </td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(s)}>Sửa</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(s.id)}>Xoá</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="mt-4">{isEditing ? 'Sửa sinh viên' : 'Thêm sinh viên'}</h2>
      <div className="mb-3">
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Họ tên"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
        />
        <input
          type="number"
          className="form-control mb-2"
          placeholder="Tuổi"
          value={formData.age}
          onChange={(e) =>
            setFormData({
              ...formData,
              age: e.target.value === '' ? '' : Number(e.target.value)
            })
          }
        />
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Số điện thoại"
          value={formData.phoneNumber}
          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
        />
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Địa chỉ"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Link ảnh đại diện (URL)"
          value={formData.avatar}
          onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
        />

        <button className="btn btn-primary" onClick={handleSubmit}>
          {isEditing ? 'Cập nhật' : 'Thêm'}
        </button>
      </div>
    </div>
  );
}

export default App;
