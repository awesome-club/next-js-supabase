import type { NextPage } from 'next'
import {useEffect, useState} from "react";
import {supabase} from "../utils/supabase";
import {useRouter} from "next/router";
import {Button} from "antd";

const Login: NextPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const session = supabase.auth.session();
    if (session && session.user) {
      router.push("/");
      return;
    }
  }, [router])

  async function login() {
    setLoading(true);
    const {error} = await supabase.auth.signIn({email});
    setLoading(false);

    setMessage(error ? "Woops..." : "Check your email address for a login link");
  }

  return <section className="auth">
    <div className="npt">
        <input type="email" placeholder="Your email" onChange={ev => setEmail(ev.target.value)} />
        <Button loading={loading} type={"primary"} onClick={login}>Start →</Button>
      </div>
      <p>{message}</p>
  </section>
}

export default Login;