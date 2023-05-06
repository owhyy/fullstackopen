import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';
import NewBlogForm from './NewBlogForm';

test('renders title and author but not likes, user or url', () => {
  const currentUser = {
    id: 1,
    username: 'john',
    name: 'john dope',
  };

  const blog = {
    id: 1,
    title: 'Testing React with react-testing-library',
    author: 'Kurt Cobain',
    url: 'https://google.com',
    user: currentUser,
  };

  const { container } = render(
    <Blog currentUser={currentUser} blog={blog} performDelete={() => {}} performLike={() => {}} />,
  );

  const contentDisplayed = container.querySelector('.blog');
  expect(contentDisplayed).not.toHaveStyle('display: none');

  const text = screen.getByText('Testing React with react-testing-library by Kurt Cobain');
  expect(text).toBeDefined();

  const contentNotDisplayed = container.querySelector('.fullContent');
  expect(contentNotDisplayed).toHaveStyle('display: none');
});

test('clicking on display button displays url, likes and user', async () => {
  const currentUser = {
    id: 1,
    username: 'john',
    name: 'john dope',
  };

  const blog = {
    id: 1,
    title: 'Testing React with react-testing-library',
    author: 'Kurt Cobain',
    url: 'https://google.com',
    user: currentUser,
  };

  const { container } = render(
    <Blog currentUser={currentUser} blog={blog} performDelete={() => {}} performLike={() => {}} />,
  );

  const user = userEvent.setup();
  const button = screen.getByText('display');
  await user.click(button);

  const fullContent = container.querySelector('.fullContent');
  expect(fullContent).not.toHaveStyle('display: none');
});

test('clicking the button to like twice calls handler twice', async () => {
  const currentUser = {
    id: 1,
    username: 'john',
    name: 'john dope',
  };

  const mockHandler = jest.fn();

  const blog = {
    id: 1,
    title: 'Testing React with react-testing-library',
    author: 'Kurt Cobain',
    url: 'https://google.com',
    user: currentUser,
  };

  render(
    <Blog
      currentUser={currentUser}
      blog={blog}
      performDelete={() => {}}
      performLike={mockHandler}
    />,
  );

  const user = userEvent.setup();
  const button = screen.getByText('like');
  await user.click(button);
  await user.click(button);

  expect(mockHandler.mock.calls).toHaveLength(2);
});

test('creating calls handler with the data inputted', async () => {
  const mockHandler = jest.fn();
  render(<NewBlogForm addNewBlog={mockHandler} />);

  const user = userEvent.setup();
  const titleInput = screen.getByPlaceholderText('enter a title');
  await user.type(titleInput, 'a very interesting title');

  const authorInput = screen.getByPlaceholderText('enter the author');
  await user.type(authorInput, 'joe mama');

  const urlInput = screen.getByPlaceholderText('enter the url');
  await user.type(urlInput, 'https://github.com/');

  const button = screen.getByText('create');
  await user.click(button);

  expect(mockHandler.mock.calls[0][0]).toEqual({
    title: 'a very interesting title',
    author: 'joe mama',
    url: 'https://github.com/',
  });
});
