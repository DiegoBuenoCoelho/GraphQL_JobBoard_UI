import { useEffect, useState } from "react";
import JobList from "../components/JobList";
import { getJobs } from "../lib/graphql/queries";

const HomePage = () => {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        getJobs().then((data) => {
            // console.table(data);
            setJobs(data);
        });
    }, []);

    return (
        <div>
            <h1 className="title">DIEGUITO's Job Board</h1>
            <JobList jobs={jobs} />
        </div>
    );
};

export default HomePage;
