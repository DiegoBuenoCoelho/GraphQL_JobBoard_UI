import { useQuery } from "@apollo/client/react";
import { queryGetJobs } from "../../lib/graphql/queries";

export const useJobs = () => {
    const { data, error, loading } = useQuery(queryGetJobs, {
        // variables: {
        //     id,
        // },
    });
    return { jobs: data?.jobs, loading, error: Boolean(error) };
};
