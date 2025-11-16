import { useQuery } from "@apollo/client/react";
import { queryGetJobs } from "../../lib/graphql/queries";

export const useJobs = (limit, offset) => {
    const { data, error, loading } = useQuery(queryGetJobs, {
        variables: {
            limit,
            offset,
        },
        fetchPolicy: "network-only",
    });
    return {
        jobs: data?.jobs.items,
        totalCount: data?.jobs.totalCount,
        loading,
        error: Boolean(error),
    };
};
