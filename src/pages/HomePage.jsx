import { useState } from "react";
import JobList from "../components/JobList";
import { useJobs } from "./hooks/useJobs";
import { Button, Col, Container, Row } from "react-bootstrap";
import PaginationBar from "../components/PaginationBar";

const JOBS_PER_PAGE = 8;

const HomePage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const { jobs, totalCount, loading, error } = useJobs(
        JOBS_PER_PAGE,
        (currentPage - 1) * JOBS_PER_PAGE
    );

    if (loading) {
        return !!loading && <>Loading..</>;
    }
    if (error || !jobs) {
        return <div className="has-text-danger">Data unavailable</div>;
    }

    let totalPages = Math.ceil(totalCount / JOBS_PER_PAGE);

    // console.log(
    //     { currentPage },
    //     jobs.length,
    //     `Pages: ${totalCount / JOBS_PER_PAGE}`,
    //     currentPage == totalCount / JOBS_PER_PAGE
    // );

    // const handleOnPageChange = (page) => {
    //     setCurrentPage(page);
    // };

    return (
        <div>
            <h1 className="title">DIEGUITO's Job Board</h1>
            {/* <div className="mb-3">
                <button
                    className="button"
                    variant="primary"
                    onClick={() => {
                        setCurrentPage(currentPage - 1);
                    }}
                    disabled={currentPage == 1}
                >
                    Previous
                </button>
                <span className="ml-2 mr-2">{`${currentPage} of ${totalPages}`}</span>

                <button
                    className="button"
                    variant="primary"
                    onClick={() => {
                        setCurrentPage(currentPage + 1);
                    }}
                    disabled={currentPage == totalPages}
                >
                    Next
                </button>
            </div> */}
            <PaginationBar
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
            <JobList jobs={jobs} />
        </div>
    );
};

export default HomePage;
