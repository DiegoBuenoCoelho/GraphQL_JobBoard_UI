import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { getCompany, queryGetCompanyById } from "../lib/graphql/queries";
import JobList from "../components/JobList";
import { useQuery } from "@apollo/client/react";

const CompanyPage = () => {
    const { companyId } = useParams();

    const { data, loading, error } = useQuery(queryGetCompanyById, {
        variables: {
            id: companyId,
        },
    });

    if (loading) {
        return <>Loading..</>;
    }
    if (error || !data) {
        return <div className="has-text-danger">Data unavailable</div>;
    }
    const company = data?.company;
    return (
        <div>
            <h1 className="title">{company?.name}</h1>
            <div className="box">{company?.description}</div>
            <div className="box">PRESIDENT: {company?.president}</div>
            <h2 className="title is-5">JOBS at {company?.name}:</h2>
            <JobList jobs={company?.jobs} />
        </div>
    );
};

export default CompanyPage;
