export type Task = {
  _id: string;
  title: string;
  userId: string;
  isCompleted: boolean;
  createdAt: Date;
};

export type User = {
  _id: string;
  userName: string;
  email: string;
  password: string;
  isVerified: boolean;
  isAdmin: boolean;
  currentStreak: number;
  isAllTasksCompleted: boolean;
  longestStreak: number;
};
