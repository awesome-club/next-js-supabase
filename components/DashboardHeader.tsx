import {Button, Dropdown, Menu} from "antd";
import {DownOutlined} from "@ant-design/icons";
import {supabase} from "../utils/supabase";
import {useRouter} from "next/router";
import styles from "./DashboardHeader.module.scss";

export interface DashboardHeaderProps {
  email: string;
}

export default function DashboardHeader({email}: DashboardHeaderProps) {
  const router = useRouter();

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  const menu = <Menu
    items={[
      {
        key: '1',
        label: (
          <a onClick={signOut}>Log Out</a>
        ),
      }
    ]}
  />

  return <header className={styles.header}>
    <Dropdown overlay={menu} trigger={['click']}>
      <Button size={"large"} onClick={e => e.preventDefault()}>{email} <DownOutlined /></Button>
    </Dropdown>
  </header>
}
