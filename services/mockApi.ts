import { User, Post, Comment } from '../types';

const initData = () => {
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([]));
  }
  if (!localStorage.getItem('posts')) {
    localStorage.setItem('posts', JSON.stringify([]));
  }
  if (!localStorage.getItem('comments')) {
    localStorage.setItem('comments', JSON.stringify([]));
  }
};

initData();

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const getUsers = (): User[] => JSON.parse(localStorage.getItem('users') || '[]');
const getPosts = (): Post[] => JSON.parse(localStorage.getItem('posts') || '[]');
const getComments = (): Comment[] => JSON.parse(localStorage.getItem('comments') || '[]');

const saveUsers = (users: User[]) => localStorage.setItem('users', JSON.stringify(users));
const savePosts = (posts: Post[]) => localStorage.setItem('posts', JSON.stringify(posts));
const saveComments = (comments: Comment[]) => localStorage.setItem('comments', JSON.stringify(comments));

export const api = {
  // User functions
  signup: async (username: string, password_raw: string): Promise<User> => {
    await delay(500);
    const users = getUsers();
    if (users.find(u => u.username === username)) {
      throw new Error('Username already exists');
    }
    const newUser: User = {
      id: Date.now().toString(),
      username,
      password: password_raw, // In a real app, hash this!
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    saveUsers(users);
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  login: async (username: string, password_raw: string): Promise<User> => {
    await delay(500);
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password_raw);
    if (!user) {
      throw new Error('Invalid username or password');
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  getCurrentUser: async (): Promise<User | null> => {
    await delay(100);
    const userId = localStorage.getItem('currentUserId');
    if (!userId) return null;
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return null;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  getUserById: async (userId: string): Promise<User | null> => {
    await delay(100);
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return null;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  // Post functions
  getPosts: async (): Promise<Post[]> => {
    await delay(500);
    return getPosts().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getPostById: async (postId: string): Promise<Post | null> => {
    await delay(300);
    return getPosts().find(p => p.id === postId) || null;
  },

  getPostsByUserId: async (userId: string): Promise<Post[]> => {
    await delay(300);
    return getPosts().filter(p => p.authorId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  createPost: async (title: string, content: string, author: User, coverImage: string | null): Promise<Post> => {
    await delay(500);
    const posts = getPosts();
    const newPost: Post = {
      id: Date.now().toString(),
      title,
      content,
      authorId: author.id,
      authorUsername: author.username,
      createdAt: new Date().toISOString(),
    };
    if (coverImage) {
        newPost.coverImage = coverImage;
    }
    posts.push(newPost);
    savePosts(posts);
    return newPost;
  },
  
  updatePost: async (postId: string, title: string, content: string, coverImage: string | null): Promise<Post> => {
    await delay(500);
    const posts = getPosts();
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex === -1) {
      throw new Error('Post not found');
    }
    const post = posts[postIndex];
    post.title = title;
    post.content = content;

    if (typeof coverImage === 'string') {
        post.coverImage = coverImage;
    } else if (coverImage === null) {
        delete post.coverImage;
    }
    
    posts[postIndex] = post;
    savePosts(posts);
    return posts[postIndex];
  },

  deletePost: async (postId: string): Promise<void> => {
    await delay(500);
    
    // Delete the post
    const posts = getPosts();
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex > -1) {
      posts.splice(postIndex, 1);
      savePosts(posts);
    }
    
    // Also delete associated comments to prevent orphaned data
    const comments = getComments();
    const remainingComments = comments.filter(c => c.postId !== postId);
    saveComments(remainingComments);
  },

  // Comment functions
  getCommentsByPostId: async (postId: string): Promise<Comment[]> => {
    await delay(300);
    return getComments().filter(c => c.postId === postId).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  },

  addComment: async (text: string, postId: string, author: User): Promise<Comment> => {
    await delay(500);
    const comments = getComments();
    const newComment: Comment = {
      id: Date.now().toString(),
      text,
      postId,
      authorId: author.id,
      authorUsername: author.username,
      createdAt: new Date().toISOString(),
    };
    comments.push(newComment);
    saveComments(comments);
    return newComment;
  },
};