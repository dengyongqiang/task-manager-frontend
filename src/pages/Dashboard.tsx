import { deleteTask, getTasks, type Task, updateTask } from '../api/task.ts'
import { useEffect, useState } from 'react'
import { Button, message, Modal, Select, Space, Table, type TableColumnsType, Tag } from 'antd'
import TaskForm from '../components/TaskForm.tsx'

const priorityColor: Record<Task['priority'], string> = {
  LOW: 'blue',
  MEDIUM: 'orange',
  HIGH: 'red',
}

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const loadTasks = async () => {
    setLoading(true)
    try {
      const data = await getTasks()
      setTasks(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

  const statusOptions: { value: Task['status']; label: string }[] = [
    { value: 'TODO', label: 'TODO' },
    { value: 'IN_PROGRESS', label: 'IN_PROGRESS' },
    { value: 'COMPLETED', label: 'COMPLETED' },
  ]

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确认删除这个任务吗？',
      onOk: async () => {
        try {
          await deleteTask(id)
          message.success('删除成功')
          loadTasks()
        } catch (e) {
          message.error('删除失败')
        }
      },
    })
  }

  const handleStatusChange = async (id: number, status: Task['status']) => {
    try {
      await updateTask(id, { status })
      message.success('更新成功')
      loadTasks()
    } catch (e) {
      message.error('更新失败')
    }
  }

  const columns: TableColumnsType<Task> = [
    { title: '标题', dataIndex: 'title' },
    {
      title: '优先级',
      dataIndex: 'priority',
      render: (p: Task['priority']) => <Tag color={priorityColor[p]}>{p}</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (s: Task['status'], record) => (
        <Select
          value={s}
          size={'small'}
          style={{ width: 140 }}
          options={statusOptions}
          onChange={(next: Task['status']) => handleStatusChange(record.id, next)}
        />
      ),
    },
    { title: '截止日期', dataIndex: 'dueDate' },
    {
      key: 'action',
      title: '操作',
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            onClick={() => {
              setModalOpen(true)
              setEditingTask(record)
            }}
          >
            编辑
          </Button>
          <Button danger size="small" onClick={() => handleDelete(record.id)}>
            删除
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1>任务管理</h1>
        <Button
          type="primary"
          onClick={() => {
            setModalOpen(true)
            setEditingTask(null)
          }}
        >
          新建任务
        </Button>
      </div>
      <Table columns={columns} dataSource={tasks} rowKey="id" loading={loading} />
      <TaskForm
        open={modalOpen}
        task={editingTask}
        onCancel={() => {
          setModalOpen(false)
        }}
        onSuccess={() => {
          setModalOpen(false)
          loadTasks()
        }}
      />
    </div>
  )
}

export default Dashboard
