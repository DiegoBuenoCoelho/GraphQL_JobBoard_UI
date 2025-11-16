import JobList from "../components/JobList";
import { useJobs } from "./hooks/useJobs";

const HomePage = () => {
    const { jobs, loading, error } = useJobs();

    if (loading) {
        return !!loading && <>Loading..</>;
    }
    if (error || !jobs) {
        return <div className="has-text-danger">Data unavailable</div>;
    }

    return (
        <div>
            <h1 className="title">DIEGUITO's Job Board</h1>
            <JobList jobs={jobs} />
        </div>
    );
};

export default HomePage;
