"use strict"
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import fs from 'fs/promises';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken'

const supabaseUrl = 'https://adfkuealcsynlwiysvvt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkZmt1ZWFsY3N5bmx3aXlzdnZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyMDQ4MjUsImV4cCI6MjA1NDc4MDgyNX0.QN0hJb58rb4y88MZRYmT2E-zpuMoPCNEUmpMlwjrCH0';
const supabase = createClient(supabaseUrl, supabaseKey);

const SECRET_KEY = 'T0P-S3CR3T'; 
const EXPIRATION = '1h'; 


const app = new Hono();


function generateToken(payload)
{
  return jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRATION });
};


// Debugging
app.use('*', async (c, next) => {
  console.log(`Request: ${c.req.method} ${c.req.path}`);
  await next();
});



// app.use('/static/*', serveStatic({ root: './public' }));
// app.use('/html/*', serveStatic({ 
//   root: './public',
//   onNotFound: (path) => {
//     console.log(`File not found: ${path}`);
//   },
// }));
app.use('/css/*', serveStatic({ 
  root: './public',
  onNotFound: (path) => {
    console.log(`File not found: ${path}`);
  },
}));
app.use('/js/*', serveStatic({ 
  root: './public',
  onNotFound: (path) => {
    console.log(`File not found: ${path}`);
  },
}));


// Root endpoint
app.get('/', async (c) => {
  const html = await fs.readFile('public/html/dummy-login.html', 'utf-8');
  // console.log('Loading page');
  return c.html(html);
});


app.get('/create-account', async (c) => {
  // console.log("CALLED");
  const html = await fs.readFile('public/html/create-account.html', 'utf-8');
  return c.html(html);
});

app.get('/webpage', async (c) => {
  // console.log("CALLED");
  const html = await fs.readFile('public/html/webpage.html', 'utf-8');
  return c.html(html);
});


app.post('/login', async (c) =>{

  const data = await c.req.json()
  const username =  data["username"]
  const password =  data["password"]

  let { data: users, error } = await supabase
  .from('users') 
  .select('*')
  .eq('username', username)
  .eq('password', password)
  if (error) {
    return c.json({"status": false, "message": "Internal error."}, 500);
  }

  // console.log(users,error)
  
  if (users.length == 0)
  {
    // console.log("Username already exixts.")
    return c.json({"status": false, "message": "Wrong username or password!"})
  }
  else
  {
    // console.log(generateToken({username: username}));
    return c.json({"status": true, "jwt": generateToken({username: username})})
  }
})



app.post('/users',  async (c) => {

  const data = await c.req.json()
  const username =  data["username"]
  const password =  data["password"]

  if (username.length < 5 || password.length < 8)  return c.json({"status": false, "message": "Invalid request."})
  
  // console.log(username, password)

  let { data: users, error } = await supabase
  .from('users') 
  .select('*')
  .eq('username', username);
  if (error) {
    return c.json({"status": false, "message": "Internal error."}, 500);
  }

  // console.log(users,error)
  
  if (users.length != 0)
  {
    // console.log("Username already exixts.")
    return c.json({"status": false, "message": "Username already exixts."})
  }
  
  
  let { data2, error2 } = await supabase
  .from('users')
  .insert([
    { username: username, password: password },
  ])
  .select();
  if (error2) {
    return c.json({"status": false, "message": "Internal error."}, 500);
  }

  console.log("Succesfully inserted: ", username)

  return c.json({"status": true})
});







// Start the server
const port = 3000;
console.log(`Server is running on http://localhost:${port}`);
serve({
  fetch: app.fetch,
  port,
});