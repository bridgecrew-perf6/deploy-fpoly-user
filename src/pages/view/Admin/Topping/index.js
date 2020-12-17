import { DeleteFilled, EditFilled } from "@ant-design/icons";
import { Button, Col, Row, Table } from "antd";
import Search from "antd/lib/input/Search";
import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { API_BASE_URL } from "../../../../constants";
import * as menuAction from "../../../../redux/Action/menuAction";
import ModalAddTopping from "./AddTopping";
import ModalEditTopping from "./EditTopping";




const Topping = ({ menuAct, listGroup }) => {
    const token = localStorage.getItem("islogin");
  const [isModal, setIsModal] = useState(false);
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [productEdit,setProductEdit] = useState({})

  const [topping,setTopping] = useState()
  const [id,setId] =useState()
  const fetchmenu = useCallback(() => {
    fetch(API_BASE_URL + `/topping/`, {
        method: "GET",
        headers: new Headers({
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        })
    })
        .then((res) => res.json())
        .then((res) => {
            if (res.error) {
                throw res.error;
            }
            setTopping(res.body)
           
            return res;
        })
        .catch((error) => { });

  }, [token]);
  useEffect(() => {
    fetchmenu();
  }, [fetchmenu,isModal,isModalEdit]);

  const handleRemovemenu=(id) =>{
    const {deleteData} = menuAct;
    deleteData(id);
    
  }
 
  
  const handleOk = (e) => {
    setIsModal(false);
  };
  const handleCancel = (e) => {
    setIsModal(false);
  };
  const handleOkEdit = (e) => {
    setIsModalEdit(false);
  };
  const handleCancelEdit = (e) => {
    setIsModalEdit(false);
  };

  const handleAddFood = (data) =>{
    const {addData} = menuAct;
    addData(data);
    // handleCancel()  
  }
  const handleEditFood=(data,id)=>{
    const {editData} = menuAct;
    editData(data,id);
    handleCancel()
  }
  const showModalEdit=(data)=>{
    setProductEdit(data)
    setIsModalEdit(true)
  } 

  const columns = [
    {
      title: "Tên món ăn kèm",
      dataIndex: "name",
      render: (text) => <span>{text}</span>,
      
    },
    {
      title: "Giá",
      dataIndex: "price",
      render: (text) => <span  >{text} đ</span>,
    },
    {
      title: "",
      dataIndex: "",
      with: 3,
    
      key: "x",
      render: (text, record) => (
        <>
          {" "}
          <>
            <Button onClick={()=>handleRemovemenu(record.id)}>
              <DeleteFilled />
            </Button>
            <Button  onClick={()=>showModalEdit(record)}>
              <EditFilled />
            </Button>
          </>
        </>
      ),
    },
  ];

  const showModal = () => {
    setIsModal(true);
  };
  return (
    <>
      <Row className="title-content-admin">
        <h4 className="title-h4">Quản lý thực đơn</h4>
      </Row>
      <Row className="site-layout-content-admin">
        <Col xs={24} lg={24}>
          <Row className="top-content-food">
            <Col xs={24} lg={12} className="col-add-food">
              <Button size="large"  type='primary'  onClick={showModal}>Thêm thực đơn</Button>
            </Col>
            <Col span={6}></Col>
            <Col xs={24} lg={5} className="col-search-food">
              <Search
                placeholder="Tìm danh mục"
                size="large"
                enterButton
              />
            </Col>
          </Row>
          <Row>
            <Col xs={24} lg={24}>
              <Table
                className="table-food-admin"
                columns={columns}
                scroll={{ x: '100vh' }}
                dataSource={topping}
              />
            </Col>
          </Row>
        </Col>
        {isModal === true ? (
          <ModalAddTopping
            isModal={isModal}
            
            addFood={handleAddFood}
            
            handleOk={handleOk}
            handleCancel={handleCancel}
          />
        ) : (
          ""
        )}
        {isModalEdit === true ? (
          <ModalEditTopping
            isModal={isModalEdit}
            editFood={handleEditFood}
            product={productEdit}
            menu={listGroup}
            handleOk={handleOkEdit}
            handleCancel={handleCancelEdit}
          />
        ) : (
          ""
        )}
     
      </Row>
    </>
  );
};



const mapStateToProps = (state) => {
  return {
    listGroup: state.menuData.lists,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    menuAct: bindActionCreators(menuAction, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Topping);
