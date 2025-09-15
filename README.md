# MERN Boilerplate

## Introduction

This is a full-stack boilerplate using MongoDB, Express.js, React.js, Node.js, and JavaScript

The `main` branch contains the starter code for a basic React project (initialized with `vite`) using [MUI](https://mui.com) and [TailwindCSS](https://tailwindcss.com/) for styling, and an Express server connected to MongoDB.


<!-- Description about the app -->

## Requirements

- Node.js ([Installation](https://nodejs.org/en))

### Recommended VsCode extensions

- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

## Setup

Install all dependencies for `client/` and `server/`.

In two separate terminals:

```
cd client
npm install
```

```
cd server
npm install
```

Create `.env` files in both `client/` and `server/`

```
root/
  client/
    .env
  server/
    .env
```

`client/.env`

```
NODE_ENV=development
REACT_APP_SERVER_URL=http://localhost:8080
```

`server/.env`

```
NODE_ENV=development
PORT=8080
MONGO_URI=mongodb:<link to mongo databse>
CLIENT_URL=http://localhost:5173
```

### Running client and server

In two separate terminals:

```
cd client
npm run dev
```

```
cd server
npm start
```

## Technologies

### Frontend

- [React.js](https://reactjs.org/)
  - [Vite](https://vite.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [MUI](https://mui.com)
- [Axios](https://axios-http.com/)

### Backend

- [MongoDB](https://www.mongodb.com/)
  - [Mongoose](https://mongoosejs.com/)
- [Express.js](https://expressjs.com/)

### Others

- [Babel](https://babeljs.io/) (Transpiler)
- [Eslint](https://eslint.org/) (Linter)
