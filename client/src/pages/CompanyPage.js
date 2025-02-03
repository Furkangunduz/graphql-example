import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getCompany } from '../lib/graphql/queries';

function CompanyPage() {
  const [company, setCompany] = useState(null);
  const { companyId } = useParams();

  useEffect(() => {
    getCompany(companyId).then((company) => setCompany(company));
  }, [companyId]);

  return (
    company && (
      <div>
        <h1 className='title'>{company.name}</h1>
        <div className='box'>{company.description}</div>
      </div>
    )
  );
}

export default CompanyPage;
