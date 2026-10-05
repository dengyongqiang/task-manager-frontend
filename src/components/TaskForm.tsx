import { createTask, type Task, updateTask } from '../api/task.ts'
import { DatePicker, Form, Input, message, Modal, Select } from 'antd'
import dayjs from 'dayjs'
import { useEffect } from 'react'

interface TaskFormProps {
  open: boolean
  task: Task | null
  onCancel: () => void
  onSuccess: () => void
}

interface FormValues {
  title: string
  description?: string
  priority: Task['priority']
  dueDate?: dayjs.Dayjs
}

const TaskForm = ({ open, task, onCancel, onSuccess }: TaskFormProps) => {
  const [form] = Form.useForm<FormValues>()

  useEffect(() => {
    if (task) {
      form.setFieldsValue({
        title: task.title,
        description: task.description ?? undefined,
        priority: task.priority,
        dueDate: task.dueDate ? dayjs(task.dueDate) : undefined,
      })
    } else {
      form.resetFields()
    }
  }, [task, open, form])

  const handleSubmit = async (values: FormValues) => {
    const data = {
      ...values,
      dueDate: values.dueDate ? values.dueDate.format('YYYY-MM-DD') : undefined,
    }
    try {
      if (task) {
        await updateTask(task.id, data)
        message.success('更新成功')
      } else {
        await createTask(data)
        message.success('创建成功')
      }
      onSuccess()
    } catch {
      message.error(task ? '更新失败' : '创建失败')
    }
  }

  return (
    <Modal
      title={task ? '编辑任务' : '新建任务'}
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
    >
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
          <Input placeholder="任务标题" />
        </Form.Item>
        <Form.Item name="description" label="描述">
          <Input.TextArea rows={3} placeholder="任务描述" />
        </Form.Item>
        <Form.Item name="priority" label="优先级" initialValue="MEDIUM">
          <Select
            options={[
              { value: 'LOW', label: '低' },
              { value: 'MEDIUM', label: '中' },
              { value: 'HIGH', label: '高' },
            ]}
          />
        </Form.Item>
        <Form.Item name="dueDate" label="截止日期">
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default TaskForm
