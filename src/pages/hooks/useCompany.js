import { useQuery } from "@apollo/client/react";
import { queryGetCompanyById } from "../../lib/graphql/queries";

export const useCompany = (id) => {
    const { data, loading, error } = useQuery(queryGetCompanyById, {
        variables: {
            id,
        },
    });

    return { company: data?.company, loading, error: Boolean(error) };
};
