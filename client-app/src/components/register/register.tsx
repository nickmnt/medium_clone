import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { SubmitHandler, useForm } from "react-hook-form";
import { Rings } from "react-loader-spinner";
import { UserFormValues } from "../../app/models/user";
import { useStore } from "../../app/stores/store";
import paperLogo from "../../assets/sammy-line-paper-plane.png";
import "../login/login.css";
import "./register.css";
import { Link } from "react-router-dom";

interface Props {
  closeRegister: () => void;
}

function Register({ closeRegister }: Props) {
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const {
    userStore: { register },
  } = useStore();

  const {
    register: registerForm,
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
      userFormValues.username = userFormValues.email.split("@")[0];
      await register(userFormValues);
      closeRegister();
    } catch (error) {
      console.log(error);
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <img src={paperLogo} alt="paper" />
      <p className="form-title">پیوستن به نقطه سرخط</p>
      <input
        className={`input ${errors.displayName ? "error" : ""}`}
        type="text"
        placeholder="نام و نام خانوادگی"
        {...registerForm("displayName", { required: true })}
      />
      <input
        className={`input ${errors.email ? "error" : ""}`}
        type="email"
        placeholder="ایمیل"
        {...registerForm("email", { required: true })}
      />
      <input
        className={`input ${errors.password ? "error" : ""}`}
        type="password"
        placeholder="گذرواژه"
        {...registerForm("password", { required: true })}
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
          "ثبت نام"
        )}
      </button>

      <p className="user-agreement">
        پیوستن به نقطه سرخط به معنای پذیرش{" "}
        <Link className="underline" to="/agreement">
          قوانین
        </Link>{" "}
        آن است.
      </p>

      {failed ? <p className="error-message">خطایی رخ داد</p> : null}
    </form>
  );
}

export default observer(Register);
