import React, {useEffect, useState}  from "react";
import { Button, Form, Input, Modal, Table, notification, Pagination} from 'antd';
import {
    DeleteOutlined, EditOutlined
  } from '@ant-design/icons';
import { dataConstant } from '../constants/dataConstants';
import { messageConstant } from '../constants/messageConstants';
import { urlConstant } from "../constants/urlConstant";
import '../custom.css';

function Home() {

    const [ title, setTitle] = useState(null);
    const [ btnText, setBtnText] = useState(null);
    const [ apiData, setApiData] = useState([]);

    const [ editModalVisible, setEditModalVisible] = useState(false); 
    const [sampleForm] = Form.useForm();

    useEffect(() => {
        fetch(urlConstant.getAllAPI)
        .then(res => res.json())
        .then((data) => {
            setApiData(data);
        })
    },[])

    const handleDelete = (record) => {
        Modal.confirm({
            title: messageConstant.confirmDelete,            
            onOk: () => {
                deleteRecord(record);
            }
        })
    }

    const deleteRecord = (record) => {
        fetch(urlConstant.deleteAPI +  `${record.id}`,{
            method: 'Delete'
        }).
        then((res) => {
            if(res.status == 204)
            {
                notification.success({
                    message: messageConstant.deleteMessage,
                })
            }
        }) 
    }

    const handleEdit = (record) => {
        setEditModalVisible(true);
        if(record == null || record == undefined) {
            setBtnText(dataConstant.submitButton);
            setTitle(dataConstant.createTitle);
        } else {
            sampleForm.setFieldsValue({
                firstName: record.first_name,
                lastName: record.last_name,
                email: record.email,
                id: record.id
            });
            setTitle(dataConstant.editTitle);
            setBtnText(dataConstant.editButton);
        }
    }

    const columns = [
        {
            title: 'Action',
            render : (record) =>{ 
               return ( 
                <div>
                <DeleteOutlined 
                style={{color:"red", marginRight:"10px"}}
                onClick={() => handleDelete(record)}
            />
                <EditOutlined 
                style={{color:"black"}}
                onClick={() => handleEdit(record)}/>
                </ div>
                )},
            width: 50
        },
        {
            title: 'Serial',
            dataIndex: 'id',
            width: 100
        },
        {
            title: 'First Name',
            dataIndex: 'first_name',
            width: 100
        },
        {
            title: 'Last Name',
            dataIndex: 'last_name',
            width: 100
        },
        {
            title: 'Email',
            dataIndex: 'email',
            width: 100
        },
    ]

    const handlePage = (page) => {
        fetch(`https://reqres.in/api/users?page=${page}`)
        .then(res => res.json())
        .then((data) => {
            setApiData(data);
        }) 
    }

    const onFinish = (e) => {
        const apiCall =  e?.id == undefined ? urlConstant.createAPI : urlConstant.editAPI + `${e.id}`;
        const jsonBody =  e?.id  ?
          null
          :
          JSON.stringify({
            firstName: e.firstName,
            lastName: e.lastName,
            email: e.email,
          });

          if(e.id == undefined || e.id == null){
                fetch(apiCall, {
                    method : 'POST',
                    body : jsonBody
                })
                .then((res) =>  { 
                    if(res.status == 201)
                    {
                        notification.success({
                            message: messageConstant.insertMessage,                
                        })
                    }        
                })
            }
            else{
                fetch(apiCall, {
                    method : 'PUT',
                    body : jsonBody
                })
                .then((res) =>  { 
                if(res.status == 200)
                {
                    notification.success({
                        message: messageConstant.editMessage,                
                    })
                }        
                })
            }
        sampleForm.resetFields();
        setEditModalVisible(false);
    }

    const closeModal = () => {
        sampleForm.resetFields();
        setEditModalVisible(false);
    }

    return (
        <div>
            <Modal
                title={title}
                open={editModalVisible}
                onCancel={() => closeModal()}
                onOk={() => sampleForm.submit()}
                okText={btnText}
                className= "modalClass"
                >
                <Form
                form={sampleForm}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                onFinish={onFinish}
                >
                    <Form.Item name="id" hidden={true}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="First Name" name="firstName">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Last Name" name="lastName">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Email" name="email">
                        <Input />
                    </Form.Item>
                </Form>     
            </Modal>
          
            <h1 className="My-Style">Users</h1>
            <Button type="primary" className="My-Button" onClick={() => handleEdit()}>Add User</Button>
          
            <Table
                className="My-Table"
                key={apiData} 
                columns={columns}
                dataSource={apiData.data}       
                pagination={false}
            />
            <Pagination 
            defaultCurrent={1} 
            total={apiData.total}
            onChange={(page) => handlePage(page)}
            />
        </div>
    )
}

export default Home;