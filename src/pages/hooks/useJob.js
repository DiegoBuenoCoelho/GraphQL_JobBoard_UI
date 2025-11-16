import { useQuery } from "@apollo/client/react";
import { queryGetJobById } from "../../lib/graphql/queries";

export const useJob = (id) => {
    const { data, error, loading } = useQuery(queryGetJobById, {
        variables: {
            id,
        },
    });
    return { job: data?.job, loading, error: Boolean(error) };
};
