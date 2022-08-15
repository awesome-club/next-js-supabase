import {ProjectDto, TaskDto} from "../domain/domain";
import {Button, Dropdown, Menu, message, Popconfirm} from "antd";
import {DeleteOutlined, MoreOutlined, PlusOutlined} from "@ant-design/icons";
import {deleteProject, updateProject} from "../services/ProjectService";
import {createEmptyTask, deleteTaskForProject} from "../services/TaskService";
import styles from "./Project.module.scss";
import {Colors} from "../utils/constants";
import Task from "./Task";
import {useRecoilState} from "recoil";
import {memberState} from "../atoms";
import {useState} from "react";
import update from "immutability-helper";

export interface ProjectProps {
  project: ProjectDto;
  onUpdate: (project: ProjectDto) => void;
  onRemove: (project: ProjectDto) => void;
}

export default function Project({project, onUpdate, onRemove}: ProjectProps) {
  const [member] = useRecoilState(memberState);
  const [creating, setCreating] = useState(false);

  async function changeColor(color: string) {
    const {error} = await updateProject(project.id, {color});

    if (error) {
      message.error(error.message);
      return;
    }

    onUpdate({...project, color});
  }

  async function addTask() {
    setCreating(true);
    const {error, data} = await createEmptyTask(member.id, project.id);
    setCreating(false);

    if (error || !data) {
      message.error("Failed.");
      return;
    }

    onUpdate({
      ...project,
      task: [data[0], ...project.task]
    })
  }
  
  async function removeRelatedTasks() {
    let {error} = await deleteTaskForProject(project.id);
    if (error) {
      message.error(error.message);
    }
    return !error;
  }

  async function remove() {
    if (await removeRelatedTasks()) {
      const {error} = await deleteProject(project.id);
      if (error) {
        message.error(error.message);
        return;
      }
      onRemove(project);
    }
  }
  
  function onTaskRemove(task: TaskDto) {
    onUpdate({
      ...project,
      task: project.task.filter(it => it.id !== task.id)
    })
  }

  function onTaskUpdate(task: TaskDto) {
    const idx = project.task.findIndex(it => it.id === task.id);
    if (idx > -1) {
      const updated = update(project.task, {
        [idx]: (item) => ({...item, ...task}),
      });
      onUpdate({
        ...project,
        task: updated
      })
    }
  }

  const menu = <Menu className={styles.menu}>
    <ul className={styles.colors}>
      {Colors.map(it => <li key={it} onClick={() => changeColor(it)} style={{backgroundColor: it}}/>)}
    </ul>
    <ul className={styles.ops}>
      <li><Button size={"small"} >Edit</Button></li>
      <li>
        <Popconfirm title="Sure?" onConfirm={remove} okText="Yes" cancelText="No" >
          <Button size={"small"}><DeleteOutlined /></Button>
        </Popconfirm>
      </li>
    </ul>
  </Menu>

  return <div className={styles.project}>
    <header style={{backgroundColor: project.color ?? "#b2d099"}}>
      <h3>{project.name}</h3>

      <nav className={styles.nav}>
        <Button loading={creating} disabled={creating} className={styles.button} onClick={addTask}>
          <PlusOutlined /> Task
        </Button>
        <Dropdown className={styles.dropdown} overlay={menu} trigger={['click']}>
          <MoreOutlined />
        </Dropdown>
      </nav>
    </header>
    <ul className={styles.tasks}>
      {project.task && project.task.map(it => <li key={it.id}>
        <Task
          task={it}
          onRemove={onTaskRemove}
          onUpdate={onTaskUpdate}/>
      </li>)}
    </ul>
  </div>
}
