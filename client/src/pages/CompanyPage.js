import { useQuery } from '@apollo/client';
import { useParams } from 'react-router';
import { companyDetailQuery } from '../lib/graphql/queries';

function CompanyPage() {
  const { companyId } = useParams();
  console.log(companyId);

  const { data, loading, error } = useQuery(companyDetailQuery, {
    variables: { id: companyId },
  });

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      <h1 className='title'>{data.company.name}</h1>
      <div className='box'>{data.company.description}</div>
    </div>
  );
}

export default CompanyPage;
