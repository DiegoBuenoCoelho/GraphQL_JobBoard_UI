import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { formatDate } from "../lib/formatters";
import { useEffect, useState } from "react";
import { getJob } from "../lib/graphql/queries";

function JobPage() {
    const { jobId } = useParams();
    const [state, setState] = useState({
        job: null,
        loading: true,
        error: false,
    });

    useEffect(() => {
        (async () => {
            if (!!jobId) {
                try {
                    const jobTemp = await getJob(jobId);
                    // console.warn({ jobTemp });
                    setState({ job: jobTemp, error: null, loading: false });
                } catch (error) {
                    console.error(JSON.stringify(error, null, 2));
                    setState({ job: null, error: error, loading: false });
                }
            }
        })();
    }, [jobId]);

    const { loading, job, error } = state;

    return (
        <div>
            {!!loading && <>Loading..</>}
            {error && (
                <div className="box has-text-danger">Data Unavailable..</div>
            )}
            {!loading && !!job && (
                <>
                    <h1 className="title is-2">{job?.title}</h1>
                    <h2 className="subtitle is-4">
                        <Link to={`/companies/${job?.company.id}`}>
                            {job?.company.name}
                        </Link>
                    </h2>
                    <div className="box">
                        <div className="block has-text-grey">
                            Posted: {formatDate(job?.date, "long")}
                        </div>
                        <p className="block">{job?.description}</p>
                    </div>
                </>
            )}
        </div>
    );
}

export default JobPage;
