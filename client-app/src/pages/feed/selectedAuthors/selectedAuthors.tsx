import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { useStore } from "../../../app/stores/store";

function SelectedAuthors() {
  const {
    contentStore: { profiles, getProfiles },
  } = useStore();

  useEffect(() => {
    getProfiles(true);
  }, []);

  return (
    <section style={{ direction: "rtl" }}>
      <h3>نویسندگان منتخب</h3>
      {profiles.slice(0, 10).map((author) => {
        return (
          <div
            key={author.username}
            className="author-box"
            style={{ marginBottom: "1rem" }}
          >
            <img
              className="avatar"
              src={
                author.image
                  ? `https://localhost:5000/${author.image}`
                  : "https://api.dicebear.com/5.x/thumbs/svg"
              }
              alt="user avatar"
            />
            <div className="author-info">
              <div>
                <p className="author-name">{author.displayName}</p>
              </div>
              <p className="author-bio">{author.bio}</p>
            </div>
          </div>
        );
      })}
    </section>
  );
}

export default observer(SelectedAuthors);
