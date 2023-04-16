import axios from 'axios';
const baseUrl = '/api/blogs';
const userUrl = '/api/users';

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async ({ title, author, url }) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post(baseUrl, { title, author, url }, config);
  const userResponse = await axios.get(userUrl);
  const user = userResponse.data.find((u) => u.id === response.data.user);
  return { ...response.data, user };
};

const update = async (updatedBlog) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.put(
    `${baseUrl}/${updatedBlog.id}`,
    { ...updatedBlog, user: updatedBlog.user._id },
    config,
  );
  return response.data;
};

const deleteBlog = async (id) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.delete(`${baseUrl}/${id}`, config);
  return response.data;
};

export default { getAll, create, update, deleteBlog, setToken };
