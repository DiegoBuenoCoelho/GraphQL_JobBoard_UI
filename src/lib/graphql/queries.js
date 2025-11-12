import { GraphQLClient, gql } from "graphql-request";

const client = new GraphQLClient("http://localhost:3001/graphql");

export const getJobs = async () => {
    const query = gql`
        {
            jobs {
                id
                title
                description
                date
            }
        }
    `;

    const { jobs } = await client.request(query);
    return jobs;
};

export const getJob = async (jobId) => {
    const query = gql`
        query JobById($id: ID!) {
            job(id: $id) {
                id
                title
                description
                date
                company {
                    id
                    name
                }
            }
        }
    `;

    const { job } = await client.request(query, { id: jobId });
    return job;
};

export const getCompany = async (companyId) => {
    const query = gql`
        query CompanyById($id: ID!) {
            company(id: $id) {
                id
                name
                description
                president
                jobs {
                    id
                    title
                    date
                    description
                }
            }
        }
    `;

    const { company } = await client.request(query, { id: companyId });
    return company;
};

export const createJob = async ({ title, description }) => {
    // we are going to use job as an alias for this createjob mutation
    const mutation = gql`
        mutation CreateJob($input: CreateJobInput!) {
            job: createJob(input: $input) {
                id
            }
        }
    `;
    const jobCreated = await client.request(mutation, {
        input: { title, description },
    });
    const { job } = jobCreated;
    return job;
};
