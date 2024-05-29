# Daily Task Tracker

Daily Task Tracker is a web application that allows users to manage their daily tasks and track their streaks of completed tasks. If users complete all their tasks before 12:00 AM IST, their current streak increases by one. If the current streak surpasses the longest streak, the longest streak is updated. However, if a user misses any task, the current streak resets to zero.

## Live Demo

Check out the live application: [Daily Task Tracker](https://tracker-fawn-five.vercel.app/login)

## Table of Contents

- [Features](#features)
- [Pages](#pages)
- [Installation](#installation)

## Features

- User authentication (login and signup)
- Add, edit, and delete daily tasks
- Track current and longest streaks
- Visualize progress with a progress bar
- Responsive design

## Pages

### 1. Login

Users can log in to their account using their credentials.

### 2. Signup

New users can create an account by providing necessary information.

### 3. Home

- View all tasks for the current day
- See current streak and longest streak
- Progress bar indicating task completion

### 4. Profile

- View all tasks
- Add new tasks
- Edit existing tasks
- Delete tasks

## Installation

To run this project locally, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/arpit29joshi/tracker
cd tracker
```

2. Create .env

```
MONGO_URL=
TOKEN_SECREST=
AUTH_SECRET=
```

3.  Install node modules

```
npm i
```

4.  Start App

```
npm run dev
```
