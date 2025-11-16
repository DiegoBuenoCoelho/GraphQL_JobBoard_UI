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

export const apolloClient = new ApolloClient({
    link: ApolloLink.from([myAuthCustomLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
        query: {
            fetchPolicy: "network-only", // If we want ALL the queries to always execute
        },
    },
});

//-------------------------------------------------------------------------------

const fragJobDetails = gql`
    fragment fragJobDetails on Job {
        id
        title
        description
        date
        company {
            id
            name
        }
    }
`;

export const queryGetJobById = gql`
    query JobById($id: ID!) {
        job(id: $id) {
            ...fragJobDetails
        }
    }
    ${fragJobDetails}
`;

export const queryGetCompanyById = gql`
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

export const queryGetJobs = gql`
    query Jobs($limit: Int, $offset: Int) {
        jobs(limit: $limit, offset: $offset) {
            items {
                id
                title
                description
                date
            }
            totalCount
        }
    }
`;

export const mutationCreateJob = gql`
    mutation CreateJob($input: CreateJobInput!) {
        job: createJob(input: $input) {
            ...fragJobDetails
        }
    }
    ${fragJobDetails}
`;
