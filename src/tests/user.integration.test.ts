import { TestServer } from "./testSetup";
import userRoutes from '../routes/user.routes';
import { findLastInsertedUser } from '../dao/user.dao'
import User from "../models/user.model";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || '';

const server = new TestServer();
server.app.use('/users', userRoutes);

describe("User API Tests for GET", () => {

  let token: string

  beforeAll(async() => {
    await server.start();
    // const hash = await bcrypt.hash("admin123", 10);
    // const user = await User.create({
    //   username: 'admin10',
    //   password: hash,
    //   email: "admin@aueb.gr",
    //   roles:[]
    // });
    // token = jwt.sign(
    //   {
    //     username: "admin", 
    //     email: "admin@aueb.gr",
    //     roles: [
    //       {
    //         "role": "ADMIN",
    //         "description": "Administrator user",
    //         "active": true
    //       }
    //     ]
    //   },
    //   JWT_SECRET,
    //   {expiresIn: '1h'}
    // );
  });

  afterAll(async()=>{ await server.stop()});

  test('GET /users -> returns a list of users',async() => {
    const res = await server.request.get("/users");
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true);
  }, 10000);

  test('GET /users -> return a status code in wrong endpoint', async() =>{
    const res = await server.request.get("/user");
    expect(res.status).toBe(404);
  });

  test("GET /users/email/:email -> Return a user by email",async() => {
    const lastUser = await findLastInsertedUser();
    const res = await server.request.get("/users/email/"+lastUser?.email);
    // console.log(res.body)
    expect(res.status).toBe(200);
    expect(res.body.username).toBe(lastUser?.username);
  });

  test("GET /users/email/:email -> Return a user with wrong email",async() => {
    const res = await server.request.get("/users/email/"+'xxxx@aueb.gr');
    // console.log(res.body)
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("User not found by email");
  })
});

describe("USER API TEST POST REQUESTS", () => {
  let token: string;

  beforeAll(async() => { 
    await server.start(); 
    token = jwt.sign(
      {
        username: "admin", 
        email: "admin@aueb.gr",
        roles: [
          {
            "role": "ADMIN",
            "description": "Administrator user",
            "active": true
          }
        ]
      },
      JWT_SECRET,
      {expiresIn: '1h'}
    )
  });

  afterAll(async()=>{ await server.stop()});

  test("POST /users -> Create new user", async() => {
    const res = await server.request.post('/users')
    .set('Authorization', `Bearer ${token}`)
    .send({username: 'jestuser', password:"123456", email:"jestuser@aueb.gr"});
    
    expect(res.status).toBe(200);
    expect(res.body.username).toBe("jestuser");
  });

  test("POST /users -> Create user that exists", async() => {
     const res = await server.request.post('/users')
    .set('Authorization', `Bearer ${token}`)
    .send({username: 'jestuser', password:"123456", email:"jestuser@aueb.gr"});
    
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("user already exists");
  });

  test("POST /users -> Create user with username<6 and password<6", async() => {
     const res = await server.request.post('/users')
    .set('Authorization', `Bearer ${token}`)
    .send({username: 'jest', password:"1234", email:"jestuser@aueb.gr"});
    
    expect(res.status).toBe(400);
  });
  
  test("POST /users -> Create user without JWT or Expired JWT", async() => {
     const res = await server.request.post('/users')
     .send({username: 'jest', password:"1234", email:"jestuser@aueb.gr"});
    
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Missing or Invalid Authorization header")
  });
});

describe("USER API TEST DELETE REQUESTS",() => {
  let token: string;

  beforeAll(async() => { 
    await server.start(); 
    token = jwt.sign(
      {
        username: "admin", 
        email: "admin@aueb.gr",
        roles: [
          {
            "role": "ADMIN",
            "description": "Administrator user",
            "active": true
          }
        ]
      },
      JWT_SECRET,
      {expiresIn: '1h'}
    )
  });

  afterAll(async()=>{ await server.stop()});

  test("DELETE /users delete a user", async() => {
    const res = await server.request.delete('/users/jestuser')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  })
})