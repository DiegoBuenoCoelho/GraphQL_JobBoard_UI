import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { getCompany } from "../lib/graphql/queries";
import JobList from "../components/JobList";

function CompanyPage() {
    const { companyId } = useParams();
    const [company, setCompany] = useState();

    useEffect(() => {
        getCompany(companyId).then((data) => {
            setCompany(data);
        });
    }, [companyId]);
    if (!company) {
        return <>Loading..</>;
    }
    return (
        <div>
            <h1 className="title">{company?.name}</h1>
            <div className="box">{company?.description}</div>
            <div className="box">PRESIDENT: {company?.president}</div>
            <h2 className="title is-5">JOBS at {company?.name}:</h2>
            <JobList jobs={company?.jobs} />
        </div>
    );
}

export default CompanyPage;
