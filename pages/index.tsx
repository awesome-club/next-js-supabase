import type {NextPage} from 'next'
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Button, Skeleton} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {ProjectDto} from "../domain/domain";
import update from "immutability-helper";
import {useRecoilState} from "recoil";
import {supabase} from "../utils/supabase";
import { memberState } from '../atoms';
import { getMemberProjects } from '../services/ProjectService';
import DashboardHeader from '../components/DashboardHeader';
import Project from '../components/Project';
import NewProjectModal from '../components/NewProjectModal';

const Home: NextPage = () => {
  const router = useRouter();
  const [member, setMember] = useRecoilState(memberState);

  const [projects, setProjects] = useState([] as ProjectDto[]);
  const [isNewProjectModal, setIsNewProjectModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = supabase.auth.session();
    if (!session || !session.user) {
      router.push("/login");
      return;
    }

    const { user } = session;
    setMember({
      id: user?.id ?? "",
      email: "hi@awesome.com" ?? user?.email ?? ""
    });

    getMemberProjects().then(({error, data}) => {
      setLoading(false);
      if (!error) {
        setProjects(data ?? []);
      }
    });

  }, [router, setMember, member.id]);

  function onProjectCreated(project: ProjectDto) {
    setProjects([project, ...projects]);
  }
  
  function onProjectUpdate(project: ProjectDto) {
    const idx = projects.findIndex(it => it.id === project.id);
    if (idx > -1) {
      const updated = update(projects, {
        [idx]: (item) => ({...item, ...project}),
      });
      setProjects(updated);
    }
  }

  function onProjectRemove(project: ProjectDto) {
    setProjects(projects.filter(it => it.id !== project.id));
  }

  return loading ? <Skeleton active /> : <section className="dashboard">
    <title>Dashboard</title>
    <DashboardHeader email={member.email}/>

    <ul className="projects">
      {projects.map(it => <li key={it.id}>
        <Project
          onUpdate={onProjectUpdate}
          onRemove={onProjectRemove}
          project={it}/>
      </li>)}

      {!loading && projects.length === 0 && <li key={"new"}>
          <Button size={"large"} className={"new-project"} onClick={() => setIsNewProjectModal(true)}>
            <PlusOutlined/> New project
          </Button>
        </li>}
    </ul>

    <NewProjectModal
        visible={isNewProjectModal}
        onClose={() => setIsNewProjectModal(false)}
        onCreated={onProjectCreated}
      />
  </section>
}

export default Home;