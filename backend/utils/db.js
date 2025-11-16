const { userDb, postDb } = require('../database/db');

function getUser(username) {
  return userDb.getByUsername(username);
}

function createUser(userData) {
  return userDb.create({
    username: userData.username,
    email: userData.email,
    password: userData.passwordHash,
    role: userData.isAdmin ? 'admin' : 'user',
    profilePicture: userData.profilePicture
  });
}

function getPost(postId) {
  return postDb.getById(postId);
}

function getAllPosts() {
  return postDb.getAll();
}

function createPost(postData) {
  return postDb.create(postData);
}

function updatePost(postId, updateData) {
  return postDb.update(postId, updateData);
}

function deletePost(postId) {
  return postDb.delete(postId);
}

function getUserPosts(userId) {
  return postDb.getByUser(userId);
}

module.exports = {
  getUser,
  createUser,
  getPost,
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  getUserPosts
};
