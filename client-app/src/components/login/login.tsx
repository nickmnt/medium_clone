import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { SubmitHandler, useForm } from "react-hook-form";
import { Rings } from "react-loader-spinner";
import { UserFormValues } from "../../app/models/user";
import { useStore } from "../../app/stores/store";
import paperLogo from "../../assets/sammy-line-paper-plane.png";
import "./login.css";

interface Props {
  closeLogin: () => void;
}

function Login({ closeLogin }: Props) {
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const {
    userStore: { login },
  } = useStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormValues>();

  const onSubmit: SubmitHandler<UserFormValues> = async (
    userFormValues: UserFormValues
  ) => {
    if (loading) return;

    setFailed(false);
    setLoading(true);

    try {
      await login(userFormValues);
      closeLogin();
    } catch (error) {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <img src={paperLogo} alt="paper" />
      <p className="form-title">ورود به نقطه سرخط</p>
      <input
        className={`input ${errors.email ? "error" : ""}`}
        type="email"
        placeholder="ایمیل"
        {...register("email", { required: true })}
      />
      <input
        className={`input ${errors.password ? "error" : ""}`}
        type="password"
        placeholder="گذرواژه"
        {...register("password", { required: true })}
      />

      <button type="submit">
        {loading ? (
          <Rings
            height="40"
            width="40"
            color="white"
            radius="6"
            wrapperStyle={{}}
            visible={true}
            ariaLabel="rings-loading"
          />
        ) : (
          "ورود"
        )}
      </button>

      {failed ? (
        <p className="error-message">ایمیل یا گذرواژه اشتباه است</p>
      ) : null}
    </form>
  );
}

export default observer(Login);
