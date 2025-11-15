import { concat } from "@apollo/client";
import { getAccessToken } from "../auth";
import {
    ApolloClient,
    gql,
    ApolloLink,
    InMemoryCache,
    HttpLink,
} from "@apollo/client";

const httpLink = new HttpLink({ uri: "http://localhost:3001/graphql" });
const myAuthCustomLink = new ApolloLink((operation, forward) => {
    console.warn(`[myAuthCustomLink] DDD operation:`, operation);
    const accessToken = getAccessToken();
    if (accessToken) {
        operation.setContext({
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    }
    return forward(operation);
});

const apolloClient = new ApolloClient({
    link: ApolloLink.from([myAuthCustomLink, httpLink]),
    cache: new InMemoryCache(),
    // defaultOptions: {
    //     query: {
    //         fetchPolicy: "network-only", // If we want ALL the queries to always execute
    //     },
    //     watchQuery: {
    //         fetchPolicy: "network-only", // If we want ALL the hooks to always execute
    //     },
    // },
});

//-------------------------------------------------------------------------------
const queryGetJobById = gql`
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

//-------------------------------------------------------------------------------

export const getJobs = async () => {
    const query = gql`
        query Jobs {
            jobs {
                id
                title
                description
                date
            }
        }
    `;

    const { data } = await apolloClient.query({
        query,
        // fetchPolicy: "network-only", //only from the server
    });
    return data?.jobs;
};

export const getJob = async (jobId) => {
    const { data } = await apolloClient.query({
        query: queryGetJobById,
        variables: { id: jobId },
        fetchPolicy: "cache-first",
    });
    return data?.job;
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

    const { data } = await apolloClient.query({
        query,
        variables: { id: companyId },
    });
    return data?.company;
};

export const createJob = async ({ title, description }) => {
    // we are going to use job as an alias for this createjob mutation
    const mutationGQL = gql`
        mutation CreateJob($input: CreateJobInput!) {
            job: createJob(input: $input) {
                id
            }
        }
    `;

    const { data } = await apolloClient.mutate({
        mutation: mutationGQL,
        variables: {
            input: { title, description },
        },
        //one way to add the headers for token:
        // context: {
        //     headers: {
        //         Authentication: `Bearer ${getAccessToken()}`,
        //     },
        // },
        update: (cache, { data }) => {
            // const { title, description } = data;
            console.log("[createJob] mutation writeQuery: ", { data });
            cache.writeQuery({
                query: queryGetJobById,
                data: data,
                variables: { id: data.job.id },
            });
        },
    });
    return data.job;
};
