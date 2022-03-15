import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Button, Form, FormInstance, Input, Popconfirm, Table } from 'antd'
import { Member } from '@/hooks/queries/useGroupQuery'

const EditableContext = React.createContext<FormInstance | null>(null)

interface Item {
  address: string
}

interface EditableRowProps {
  index: number;
}

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

type EditableTableProps = Parameters<typeof Table>[0];

// type Columns = (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] | undefined

interface EditableTableState {
  dataSource: DataType[];
  count: number;
}

interface DataType {
  key: React.Key;
  address: string;
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

const EditableRow: React.FC<EditableRowProps> = ({ ...props }) => {
  const [form] = Form.useForm()

  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false)
  const inputRef = useRef<Input>(null)
  const form = useContext(EditableContext)!

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus()
    }
  }, [editing])

  const toggleEdit = () => {
    setEditing(!editing)
    form.setFieldsValue({ [dataIndex]: record[dataIndex] })
  }

  const save = async () => {
    try {
      const values = await form.validateFields()
      toggleEdit()
      handleSave({ ...record, ...values })
    } catch (err) {
      throw new Error(`Save failed: ${err}`)
    }
  }

  const childNode = useMemo(() => {
    if (!editable) {
      return children
    }

    if (editing) {
      return (
        <Form.Item
          style={{ margin: 0 }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      )
    }

    return (
      <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
        {children}
      </div>
    )
  }, [children, editable, editing])

  return <td {...restProps}>{childNode}</td>
}

class EditableTable extends React.Component<EditableTableProps, EditableTableState> {
  columns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string; })[] | undefined

  constructor(props: EditableTableProps) {
    super(props)
    this.columns = [
      {
        title: 'address',
        dataIndex: 'address',
        editable: true,
      },
      {
        title: 'action',
        dataIndex: 'action',
        render: (_, record: any) =>
          this.state.dataSource.length >= 1 ? (
            <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
              <a>Delete</a>
            </Popconfirm>
          ) : null,
      },
    ]

    this.state = {
      dataSource: [
        {
          key: '0',
          address: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        },
        {
          key: '1',
          address: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxy',
        },
        {
          key: '3',
          address: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxyz',
        },
      ],
      count: 3,
    }
  }

  handleAdd = () => {
    const { count, dataSource } = this.state
    const newData: DataType = {
      key: count + 1,
      address: `${count + 1}`,
    }
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    })
  }

  handleDelete = (key: React.Key) => {
    const dataSource = [...this.state.dataSource]
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) })
  }

  handleSave = (row: DataType) => {
    const newData = [...this.state.dataSource]
    const index = newData.findIndex(item => row.key === item.key)
    const item = newData[index]
    newData.splice(index, 1, {
      ...item,
      ...row,
    })
    this.setState({ dataSource: newData })
  }

  render() {
    const { dataSource } = this.state
    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    }

    const columns = this.columns?.map(col => {
      if (!col.editable) {
        return col
      }
      return {
        ...col,
        onCell: (record: DataType) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      }
    })

    return (
      <>
        <Button onClick={this.handleAdd} type="primary" style={{ margin: '16px 0', float: 'right' }}>
          Add
        </Button>
        <Table
          rowClassName={() => 'editable-row'}
          components={components}
          bordered
          dataSource={dataSource}
          columns={columns as ColumnTypes}
        />
      </>
    )
  }
}

export const EdT: React.FC<{ data: Member, onSave: (_?: any) => void }> = ({ data, onSave }) => {
  const [dataSource, setDataSource] = useState<any>(data)

  useEffect(() => {
    onSave(dataSource)
  }, [dataSource])

  const handleDelete = (key: React.Key) => {
    const del = {
      dataSource: dataSource.dataSource.filter((item: { key: React.Key }) => item.key !== key),
      count: dataSource.count - 1
    }

    setDataSource(() => del)
  }

  const columnsData = [
    {
      title: 'Address',
      dataIndex: 'address',
      editable: true,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      // eslint-disable-next-line react/display-name
      render: (_: any, record: any) =>
        dataSource.dataSource.length >= 1 ? (
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
            <a>Delete</a>
          </Popconfirm>
        ) : null
    },
  ]

  const handleAdd = () => {
    const newData: DataType = {
      key: dataSource.count + 1,
      address: `${dataSource.count + 1}`,
    }

    setDataSource({
      dataSource: [...dataSource.dataSource, newData],
      count: dataSource.count + 1,
    })
  }

  const handleSave = (row: DataType) => {
    const newData = {
      dataSource: [...dataSource.dataSource],
      count: [...dataSource.dataSource].length
    }

    const index = newData.dataSource.findIndex(item => row.key === item.key)
    const item = newData.dataSource[index]

    newData.dataSource.splice(index, 1, {
      ...item,
      ...row,
    })

    setDataSource(newData)
  }

  const newColumns = columnsData?.map(col => {
    if (!col.editable) {
      return col
    }

    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSave,
      }),
    }
  })

  return (
    <div>
      <Button onClick={handleAdd} type="primary" style={{ margin: '16px 0', float: 'right' }}>
        Add
      </Button>
      <Table
        rowClassName={() => 'editable-row'}
        components={{
          body: {
            row: EditableRow,
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={dataSource.dataSource}
        columns={newColumns as ColumnTypes}
      />
    </div>
  )

}

export default EditableTable
