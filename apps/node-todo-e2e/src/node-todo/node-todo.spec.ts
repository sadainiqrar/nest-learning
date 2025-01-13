import axios from 'axios';
import { io } from 'socket.io-client';

describe('GET /api', () => {
  it('should return a message', async () => {
    const res = await axios.get(`/api`);

    expect(res.status).toBe(200);
    expect(res.data).toEqual({ message: 'Hello API' });
  });
});

describe('Node Todo API', () => {
  const baseUrl = '/api';
  let token: string;

  beforeAll(async () => {
    // Sign in to get the JWT token
    const response = await axios.post(`${baseUrl}/auth/signin`, {
      username: 'testuser',
      password: 'testpass',
    });
    token = response.data.access_token;
  });

  it('should create a new todo', async () => {
    const response = await axios.post(
      `${baseUrl}/todos`,
      {
        title: 'Test Todo',
        description: 'This is a test todo',
        status: 'Pending',
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty('id');
    expect(response.data.title).toBe('Test Todo');
  });

  it('should get all todos', async () => {
    const response = await axios.get(`${baseUrl}/todos`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });

  it('should get a todo by ID', async () => {
    const createResponse = await axios.post(
      `${baseUrl}/todos`,
      {
        title: 'Test Todo',
        description: 'This is a test todo',
        status: 'Pending',
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const todoId = createResponse.data.id;
    const response = await axios.get(`${baseUrl}/todos/${todoId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.status).toBe(200);
    expect(response.data.id).toBe(todoId);
  });

  it('should update a todo', async () => {
    const createResponse = await axios.post(
      `${baseUrl}/todos`,
      {
        title: 'Test Todo',
        description: 'This is a test todo',
        status: 'Pending',
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const todoId = createResponse.data.id;
    const response = await axios.patch(
      `${baseUrl}/todos/${todoId}`,
      {
        status: 'Completed',
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    expect(response.status).toBe(200);
    expect(response.data.status).toBe('Completed');
  });

  it('should delete a todo', async () => {
    const createResponse = await axios.post(
      `${baseUrl}/todos`,
      {
        title: 'Test Todo',
        description: 'This is a test todo',
        status: 'Pending',
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const todoId = createResponse.data.id;
    const response = await axios.delete(`${baseUrl}/todos/${todoId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.status).toBe(200);
  });
});

describe('Node Todo WebSocket', () => {
  let socket;
  let token: string;

  beforeAll(async () => {
    // Sign in to get the JWT token
    const response = await axios.post('/api/auth/signin', {
      username: 'testuser',
      password: 'testpass',
    });
    token = response.data.access_token;

    console.log('check here token', token);
    // Connect to the WebSocket server
    socket = io('ws://localhost:3000/todos', {
      query: { token },
    });

    socket.on('connect', () => console.log('socket connected'));
  });

  afterAll(() => {
    socket.close();
  });

  it('should create a new todo and receive todoCreated event', async () => {
    const eventPromise = new Promise((resolve) => {
      socket.on('todoCreated', (data) => resolve(data));
    });

    // Make an API call to create a new todo
    const response = await axios.post(
      '/api/todos',
      {
        title: 'Test Todo',
        description: 'This is a test todo',
        status: 'Pending',
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Validate the API response
    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty('id');
    expect(response.data.title).toBe('Test Todo');

    // Wait for the `todoCreated` WebSocket event and validate it
    const eventData = (await eventPromise) as any;
    expect(eventData).toHaveProperty('id', response.data.id);
    expect(eventData.title).toBe('Test Todo');
  });

  it('should update a todo and receive todoUpdated event', async () => {
    // Step 1: Create a new todo via API
    const createResponse = await axios.post(
      '/api/todos',
      {
        title: 'Test Todo',
        description: 'This is a test todo',
        status: 'Pending',
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const todoId = createResponse.data.id;

    // Step 2: Listen for the `todoUpdated` WebSocket event
    const eventPromise = new Promise((resolve) => {
      socket.on('todoUpdated', (data) => resolve(data));
    });

    // Step 3: Make an API call to update the todo
    const updateResponse = await axios.patch(
      `/api/todos/${todoId}`,
      {
        status: 'Completed',
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Validate the API response
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.data.status).toBe('Completed');

    // Wait for the `todoUpdated` WebSocket event and validate it
    const eventData = (await eventPromise) as any;
    expect(eventData).toHaveProperty('id', todoId);
    expect(eventData.status).toBe('Completed');
  });
});
