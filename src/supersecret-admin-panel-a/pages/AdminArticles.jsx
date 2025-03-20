import React, {useEffect, useState} from "react";
import '../Admin.css';
import {
  DeleteOutlined, 
  EditOutlined, 
  DownloadOutlined,
  PlusOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import {
  DrawerForm,
  ProForm,
  ProFormText,
} from '@ant-design/pro-components';
import {
  ConfigProvider, 
  Card, 
  Spin,
  message,
  Input, 
  Space,
  Button, 
  Form,
  Flex,
  Upload
} from 'antd';
import enUS from 'antd/lib/locale/en_US';
import axios from 'axios';

const { Meta } = Card;
const { Search } = Input;

const AdminArtiles = () => {

  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  // Articles Form
  const [form] = Form.useForm();
  // Image Loading
  const [imageLoading, setImageLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();

  useEffect(() => {
      const fetchArticles = async () => {
        try{
          const response = await axios.get(`${config.apiBase}${config.endpoints.fetchArticles}`);
          setArticles(response.data);
          setLoading(false);
        }
        catch (error){
          console.error(error);
          message.error(error);
          setLoading(false);
        }
      };
      fetchArticles();
  }, []);

  if(loading){
    return <Spin spinning={loading} size="large" style={{ display: 'block', margin: '50px auto' }}/>
  }

  // Search Articles
  const onSearch = (value, _e, info) => console.log(info?.source, value);

  // Add Article
  const waitTime = (time = 100) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, time);
    });
  };

  // Upload Image
  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file) => {
    const isImage = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/gif';
    if (!isImage) {
      message.error('You can only upload JPEG/PNG/JPG/GIF extentions!');
    }
    const isLt3M = file.size / 1024 / 1024 / 1024 < 3;
    if (!isLt3M) {
      message.error('Image must smaller than 3MB!');
    }
    return isImage && isLt3M;
  };


  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setImageLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        setImageLoading(false);
        setImageUrl(url);
      });
    }
  };
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: 'none',
      }}
      type="button"
    >
      {imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  return (
    <div className="main-articles-page">
      <div className="page-title">
        <h1>ARTICLES</h1>
      </div>

      <div className="articles-head">
        <div className="search-input">
          <Space direction="vertical">
            <Search placeholder="search article" onSearch={onSearch} enterButton />
          </Space>
        </div>

        <div className="add-article">
        <ConfigProvider locale={enUS}>
          <DrawerForm
              title="Add Article"
              resize={{
                onResize: () => {
                  // console.log('resize!');
                },
                maxWidth: window.innerWidth * 0.8,
                minWidth: 300,
              }}
              form={form}
              trigger={
                <Button type="primary">
                  <PlusOutlined />
                  Add Article
                </Button>
              }
              autoFocusFirstInput
              drawerProps={{
                destroyOnClose: true,
              }}
              submitTimeout={500}
              onFinish={async (values) => {
                await waitTime(500);
                // console.log(values.name);
                message.success('Submitted Successfully');
                // Return true to close the form
                return true;
              }}
            >
              <ProForm.Group>
                <ProFormText
                 rules={[
                  {
                    required: true,
                  },
                ]}
                  name="name"
                  width="md"
                  label="Article Name"
                  placeholder="Enter article name"
                />
                <ProFormText
                  width="md"
                  name="description"
                  label={
                    <span>
                      Description <span style={{ fontWeight: 'small', color: '#888' }}>(optional)</span>
                    </span>
                  }
                  placeholder="Enter descritpion"
                />
              </ProForm.Group>
              <Flex gap="middle" wrap>
                  <Upload
                      name="avatar"
                      listType="picture-card"
                      className="avatar-uploader"
                      showUploadList={false}
                      action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                      beforeUpload={beforeUpload}
                      onChange={handleChange}
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt="avatar"
                          style={{
                           display: 'flex',
                           justifyContent: 'center',
                           width: '100%',
                          }}
                        />
                      ) : (
                        uploadButton
                      )}
                    </Upload>
                </Flex>        
          </DrawerForm>
          </ConfigProvider>
        </div>
      </div>

      <div className="articles">
        {articles.map((article) =>(
          <Card key={article.id}
                style={{
                  width: 250,
             
                }}
                cover={<img alt={article.title} src={article.image} />}
                actions={[
                  <DeleteOutlined key='delete'/>,
                  <EditOutlined key='edit'/>,
                  <DownloadOutlined key='download'/>, 
                ]}
          >
              <Meta title={article.title} description={article.description} />
          </Card>
        ))}
      </div>

    </div>
  );
};

export default AdminArtiles;