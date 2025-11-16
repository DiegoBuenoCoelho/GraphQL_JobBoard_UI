import { useMutation } from "@apollo/client/react";
import { mutationCreateJob, queryGetJobById } from "../../lib/graphql/queries";

const useCreateJob = () => {
    const [mutate, { loading, error }] = useMutation(mutationCreateJob);

    const createJob = async (title, description) => {
        const {
            data: { job },
        } = await mutate({
            variables: {
                input: { title, description },
            },
            update: (cache, { data }) => {
                console.log("[createJob] mutation writeQuery: ", { data });
                cache.writeQuery({
                    query: queryGetJobById,
                    variables: { id: data.job.id },
                    data: data,
                });
            },
        });

        return job;
    };

    return { createJob, loading };
};

export default useCreateJob;
