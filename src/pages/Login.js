import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { login } from "../firebase/auth";
import { Link } from "react-router-dom";

// Because this componenet is being passed as a Prop (in Route) - it has access
// to the *history prop* , and can be useful for re-routing/redirection
const Login = (props) => {
  const { register, handleSubmit, reset } = useForm();
  const [isLoading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const routeOnLogin = async (user) => {
    // Get token of the user to see if they're an Admin
    const token = await user.getIdTokenResult();
    if (token.claims.admin) {
      props.history.push("/users");
    } else {
      props.history.push(`/profile/${user.uid}`);
    }
  };

  const onSubmit = async (data) => {
    let user;
    setLoading(true);
    try {
      user = await login(data);
    } catch (e) {
      console.log(e);
    }
    if (user) {
      routeOnLogin(user);
    } else {
      setLoading(false);
    }
  };

  const loginGuest = async (e) => {
    e.preventDefault();
    // const guestPass = process.env.REACT_APP_GUEST_PASSWORD;
    // console.log(guestPass);
    let user;
    // STORE THIS IN .ENV !!!! HARDCODED JUST FOR DEVELOPMENT
    user = login({
      email: "guestuser@email.com",
      password: "1234567",
    });
    props.history.push(`/profile/${user.uid}`);
  };

  const formClassName = `ui form ${isLoading ? "loading" : ""}`;

  return (
    <div className="login-container">
      <div className="ui card login-card">
        <div className="content">
          <form className={formClassName} onSubmit={handleSubmit(onSubmit)}>
            <div className="field">
              <label>
                Email
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  ref={register}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
            </div>
            <div className="field">
              <label>
                Password
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  ref={register}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
            </div>

            <div className="field actions">
              <button className="other-link" onClick={loginGuest}>
                Guest Login
              </button>
              <div>
                <button className="ui primary button login" type="submit">
                  Log in
                </button>
                <Link className="other-link" to="/signup">
                  Sign up
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
