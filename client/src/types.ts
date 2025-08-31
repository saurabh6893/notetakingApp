export interface Task {
  _id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface FrontendTask {
  id: string;
  text: string;
  completed?: boolean;
  createdAt: string;
  updatedAt: string;
}
