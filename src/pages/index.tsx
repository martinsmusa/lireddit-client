import { NavBar } from '../components/NavBar';
import { createUrqlClient } from '../utils/createUrqlClient';
import { withUrqlClient } from 'next-urql';
import { usePostsQuery } from '../generated/graphql';
import { Suspense } from 'react';

const Index = () => {
    const [{ data }] = usePostsQuery();

    return (
        <div>
            <NavBar />
            index file
            <Suspense key="posts page" fallback={ <div>Loading...</div> }>
                { data?.posts && data?.posts.map(post => (
                    <div key={ post.id }>
                        <p>{ post.title }</p>
                    </div>
                )) }
            </Suspense>
        </div>
    );
};

export default withUrqlClient(createUrqlClient)(Index);
