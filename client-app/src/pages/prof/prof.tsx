import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Rings } from "react-loader-spinner";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import agent from "../../app/api/agent";
import { Profile, ProfileFormValues } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";
import "./prof.css";

function Prof() {
  const {
    userStore: { user },
    contentStore: {
      userProfile,
      profiles,
      getProfiles,
      updateProfile,
      adminUpdateProfile,
    },
  } = useStore();
  const [loading, setLoading] = useState(false);
  const [getting, setGetting] = useState(false);
  const [failed, setFailed] = useState(false);
  const [up, setUP] = useState<Profile | null>();
  const navigate = useNavigate();
  const { username } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>();

  useEffect(() => {
    setGetting(true);
    getProfiles().then(() => {
      setGetting(false);
    });
  }, []);

  useEffect(() => {
    setUP(
      username ? profiles.find((p) => p.username === username) : userProfile
    );
  }, [profiles, userProfile]);

  const onSubmit: SubmitHandler<ProfileFormValues> = async (
    formValues: ProfileFormValues
  ) => {
    if (loading) return;

    setFailed(false);
    setLoading(true);
    try {
      if (username) await adminUpdateProfile(username, formValues);
      else await updateProfile(formValues);

      toast("پروفایل با موفقیت ویرایش شد", {
        type: "success",
      });
      navigate("/");
    } catch (error) {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };

  async function uploadImage(files: FileList | null) {
    // if (!files || files.length === 0) return;
    // const formData = new FormData();
    // formData.append("File", files[0]);
    // await agent.requests.put("/Photos/profile", formData);
    // getProfiles();
  }

  if (getting || !up) {
    return null;
  } else {
    return (
      <div className="container">
        <div className="banner">
          <label htmlFor="image-upload">
            <img
              className="avatar big-avatar"
              src={
                up?.image
                  ? `https://localhost:5000/${up.image}`
                  : "https://api.dicebear.com/5.x/thumbs/svg"
              }
              alt="user avatar"
            />
          </label>
          <input
            style={{ display: "none" }}
            type="file"
            name="image-upload"
            id="image-upload"
            onChange={(e) => uploadImage(e.target.files)}
          />
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            className={`input ${errors.displayName ? "error" : ""}`}
            type="text"
            defaultValue={up?.displayName}
            placeholder="نام مستعار"
            {...register("displayName", { required: true })}
          />
          <textarea
            className={`input ${errors.bio ? "error" : ""}`}
            style={{ resize: "none" }}
            rows={5}
            defaultValue={up?.bio}
            placeholder="بیو"
            dir="rtl"
            draggable={false}
            {...register("bio")}
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
              "ثبت"
            )}
          </button>

          {failed ? <p className="error-message">مشکلی پیش آمد</p> : null}
        </form>
      </div>
    );
  }
}

export default observer(Prof);
