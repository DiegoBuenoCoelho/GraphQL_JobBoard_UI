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
    query Jobs {
        jobs {
            id
            title
            description
            date
        }
    }
`;

//-------------------------------------------------------------------------------

export const createJob = async ({ title, description }) => {
    // we are going to use job as an alias for this createjob mutation
    const mutationGQL = gql`
        mutation CreateJob($input: CreateJobInput!) {
            job: createJob(input: $input) {
                ...fragJobDetails
            }
        }
        ${fragJobDetails}
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
            console.log("[createJob] mutation writeQuery: ", { data });
            cache.writeQuery({
                query: queryGetJobById,
                variables: { id: data.job.id },
                data: data,
            });
        },
    });
    return data.job;
};
