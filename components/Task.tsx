import {TaskDto, TaskStatus} from "../domain/domain";
import {Button, Input, message, Popconfirm, Upload} from "antd";
import {CheckOutlined, DeleteOutlined, UploadOutlined} from "@ant-design/icons";
import styles from "./Task.module.scss";
import {deleteTask, updateTask} from "../services/TaskService";
import {useEffect, useState} from "react";
import {tick} from "../utils/utils";
import {useRecoilState} from "recoil";
import {memberState} from "../atoms";
import { createSignedUrl, uploadFile } from "../services/FileService";

export interface TaskProps {
  task: TaskDto;
  onUpdate: (task: TaskDto) => void;
  onRemove: (dto: TaskDto) => void;
}

const {TextArea} = Input;

export default function Task({task, onRemove, onUpdate}: TaskProps) {
  const [member] = useRecoilState(memberState);
  const [name, setName] = useState(task.name);
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState(task.status);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!task.preview) return;
    createSignedUrl(task.preview).then(({ signedURL, error }) => {
      if (signedURL) {
        setPreview(signedURL);
      }
    });
  }, [task]);

  async function upload(file: File) {
    setUploading(true);
    const preview = `${member.id}/${task.id}.png`;

    const {data, error} = await uploadFile(preview, file);
    if (error || !data) {
      message.error(error?.message);
      return;
    }

    await updateTask(task.id, { preview });

    onUpdate({
      ...task,
      preview
    });
    setUploading(false);
  }

  async function remove() {
    const {error} = await deleteTask(task.id);

    if (error) {
      message.error(error.message);
      return;
    }

    onRemove(task);
  }

  async function update() {
    const {error} = await updateTask(task.id, {name, description, status})

    if (error) {
      message.error(error.message);
      return;
    }

    onUpdate({...task, name, description, status});
  }

  function markAsDone() {
    setLoading(true);
    setStatus(TaskStatus.Done.valueOf());
    tick(async () => {
      await update();
      setLoading(false);
    });
  }

  return <div className={styles.task}>
    {preview && <img src={preview} alt={"Task preview"} />}

    <Input placeholder={"Task"} size="large" type="text" value={name}
           onChange={ev => setName(ev.target.value)}
           onBlur={update}/>
    <TextArea placeholder={"Some details..."} value={description}
              onChange={ev => setDescription(ev.target.value)}
              onBlur={update}/>

    <footer>
      <Upload beforeUpload={upload}>
        <Button loading={uploading} disabled={!!preview} size="small" icon={<UploadOutlined/>}/>
      </Upload>

      {task.status === TaskStatus.ToDo &&
        <Button size={"small"} onClick={markAsDone} loading={loading}>Done</Button>}

      {task.status === TaskStatus.Done &&
        <Button disabled={true} size={"small"}>
        <CheckOutlined />Done
      </Button>}

      <Popconfirm title="Sure?" onConfirm={remove} okText="Yes" cancelText="No">
        <Button size={"small"}><DeleteOutlined/></Button>
      </Popconfirm>
    </footer>

  </div>
}
