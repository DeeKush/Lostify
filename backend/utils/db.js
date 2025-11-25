const { userDb, postDb } = require('../database/db');

// USERS -----------------------------

async function getUser(username) {
  return await userDb.getByUsername(username);
}

async function createUser(userData) {
  return await userDb.create({
    username: userData.username,
    email: userData.email,
    password: userData.passwordHash,
    role: userData.isAdmin ? 'admin' : 'user',
    profilePicture: userData.profilePicture
  });
}

// POSTS -----------------------------

async function getPost(postId) {
  return await postDb.getById(postId);
}

async function getAllPosts() {
  return await postDb.getAll();
}

async function createPost(postData) {
  return await postDb.create(postData);
}

async function updatePost(postId, updateData) {
  return await postDb.update(postId, updateData);
}

async function deletePost(postId) {
  return await postDb.delete(postId);
}

async function getUserPosts(userId) {
  return await postDb.getByUser(userId);
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
