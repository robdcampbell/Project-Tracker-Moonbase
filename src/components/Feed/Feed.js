import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSession } from "../../firebase/UserProvider";
import { useProjects } from "../../context/ProjectsContext";
import { firestore } from "../../firebase/config";
// will be toggled
import MessageSender from "./MessageSender/MessageSender";
import ActivePost from "./Post/ActivePost.js";
import Post from "./Post/Post";

const Feed = ({ userName }) => {
  const { user } = useSession();
  const params = useParams();
  const [showProjectAdd, setShowProjectAdd] = useState(false);

  const {
    userProjects,
    setUserProjects,
    activeProject,
    setActiveProject,
    setActiveTitleUpdate,
    setActiveDescriptionUpdate,
    setActiveDeadlineUpdate,
    setActiveStatusUpdate,
  } = useProjects();

  // LOAD PROJECTS LIST/SIDEBAR *****************************
  useEffect(() => {
    const projectsRef = firestore
      .collection("users")
      .doc(params.id)
      .collection("projects")
      .orderBy("timeStamp", "desc");

    const unsubscribe = projectsRef.onSnapshot((querySnapshot) => {
      const projects = querySnapshot.docs.map((doc) => doc.data());
      setUserProjects(projects);
      setActiveProject(projects[0]);
      setActiveTitleUpdate(projects[0].title);
      setActiveDescriptionUpdate(projects[0].description);
      setActiveStatusUpdate(projects[0].status);
      setActiveDeadlineUpdate(projects[0].deadline);
    });
    return unsubscribe;
  }, [user.uid, params.id]);

  return (
    <div className="feed">
      {/* <button
        className="gradient__btn"
        onClick={() => setShowProjectAdd(!showProjectAdd)}
      >
        {showProjectAdd ? "Cancel" : "Create New Project"}
      </button>
      {showProjectAdd && <MessageSender />} */}

      <div className="dashboard">
        {/* <button>Add new project</button> */}
        <h2>Current Projects:</h2>
        {userProjects &&
          userProjects.map((project) => {
            const { description, deadline, title, status, docId } = project;
            return (
              <Post
                key={docId}
                description={description}
                deadline={deadline}
                title={title}
                status={status}
                docId={docId}
              />
            );
          })}
      </div>

      <div className="feed__active">
        {activeProject ? (
          <>
            {/* <MessageSender /> */}
            <ActivePost />
          </>
        ) : (
          <h4>Time to start a project.</h4>
        )}
      </div>
    </div>
  );
};

export default Feed;
