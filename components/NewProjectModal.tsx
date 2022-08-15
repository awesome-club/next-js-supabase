import {Input, message, Modal} from "antd";
import {ProjectDto} from "../domain/domain";
import {useState} from "react";
import {supabase} from "../utils/supabase";
import {useRecoilState} from "recoil";
import {memberState} from "../atoms";
import { createProject } from "../services/ProjectService";

interface NewProjectModalProps {
  visible: boolean;
  onCreated: (project: ProjectDto) => void;
  onClose: () => void;
}

export default function NewProjectModal({visible, onCreated, onClose} : NewProjectModalProps) {
  const [member] = useRecoilState(memberState);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function save() {
    if (!name) return;
    setLoading(true);
    const {error, data} = await createProject(name, member.id);
    setLoading(false);

    if (error) {
      message.error(error.message);
      return;
    }

    onCreated(data[0]);
    onClose();
  }

  return <Modal 
    title="Create Project" 
    okText={"Save"} 
    visible={visible} 
    okButtonProps={{loading}}
    onOk={save} onCancel={onClose}>
    
    <Input size={"large"} value={name} onChange={ev => setName(ev.target.value)} />
  </Modal>
}

