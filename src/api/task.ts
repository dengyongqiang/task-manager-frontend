import request from './request.ts'

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED'
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH'

export interface Task {
  id: number
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  userId: number
  dueDate: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateTaskRequest {
  title: string
  description?: string
  priority?: TaskPriority
  dueDate?: string
}

export interface UpdateTaskRequest {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  dueDate?: string
}

export const getTasks = () => request.get<any, Task[]>('/tasks')
export const createTask = (data: CreateTaskRequest) => request.post<any, Task>('/tasks', data)
export const updateTask = (id: number, data: UpdateTaskRequest) =>
  request.put<any, Task>(`/tasks/${id}`, data)
export const deleteTask = (id: number) => request.delete<any, void>(`/tasks/${id}`)
