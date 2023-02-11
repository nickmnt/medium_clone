import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { CiEdit, CiTrash } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import agent from "../../app/api/agent";
import { Profile } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";
import { format } from "../../urils/jdate";
import "./authors.css";

const statusOptions = [
  { label: "فعال", value: "active" },
  { label: "غیر فعال", value: "inactive" },
];

function Authors() {
  const {
    contentStore: { articles, profiles, getProfiles },
    userStore: { user },
  } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    getProfiles();
  }, []);

  async function changeStatus(a: Profile) {
    await agent.requests.put("/Profiles/activation", {
      targetUsername: a.username,
      newIsActive: !a.isActive,
    });
    getProfiles();
  }

  return (
    <div className="container">
      <h1 style={{ width: "100%", textAlign: "center" }}>نویسندگان</h1>

      <div className="scroller">
      <table className="mtable">
        <tbody>
          {profiles.map((prof) => {
            const as = articles.filter(
              (a) => a.author.username === prof.username
            );
            return (
              <tr key={prof.username}>
                <td className="tr-img">
                  <img
                    className="rounded-avatar"
                    src={
                      prof.image
                        ? `https://localhost:7190/${prof.image}`
                        : "https://api.dicebear.com/5.x/thumbs/svg"
                    }
                    alt="image"
                  />{" "}
                  <span>{prof.displayName}</span>
                </td>
                <td>{prof.bio}</td>
                <td style={{ color: "var(--text-color)", fontWeight: "bold" }}>
                  {as.length}{" "}
                  <span
                    style={{
                      fontWeight: "normal",
                      color: "var(--secondary-text-color)",
                    }}
                  >
                    مقاله
                  </span>
                </td>
                <td style={{ color: "var(--text-color)", fontWeight: "bold" }}>
                  {prof.likedCount}{" "}
                  <span
                    style={{
                      fontWeight: "normal",
                      color: "var(--secondary-text-color)",
                    }}
                  >
                    لایک
                  </span>
                </td>
                <td className="status-box2">
                  <Select
                    className="sort-select"
                    classNamePrefix="select"
                    styles={{
                      control: (baseStyles: any, state: any) => ({
                        ...baseStyles,
                        borderRadius: "1000px",
                        padding: "0.25rem",
                      }),
                    }}
                    theme={(theme: any) => ({
                      ...theme,
                      borderRadius: 0,
                      colors: {
                        ...theme.colors,
                        primary: prof.isActive
                          ? "var(--success-color)"
                          : "var(--danger-color)",
                        neutral0: prof.isActive
                          ? "var(--success-light-color)"
                          : "var(--danger-light-color)",
                        neutral20: prof.isActive
                          ? "var(--success-color)"
                          : "var(--danger-color)",
                      },
                    })}
                    defaultValue={
                      prof.isActive ? statusOptions[0] : statusOptions[1]
                    }
                    isRtl={true}
                    name="category"
                    options={statusOptions}
                    onChange={(c) => changeStatus(prof)}
                  />
                </td>
                <td>
                  <div className="table-actionbar">
                    <div
                      onClick={() => navigate(`/profile/${prof.username}`)}
                      className="table-action action-edit"
                    >
                      <CiEdit fontSize={36} />
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export default observer(Authors);
