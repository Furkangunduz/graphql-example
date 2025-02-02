import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { formatDate } from '../lib/formatters';
import { getJob } from '../lib/graphql/queries';

function JobPage() {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const { jobId } = useParams();

  console.log(job);
  useEffect(() => {
    getJob(jobId)
      .then((job) => setJob(job))
      .finally(() => setLoading(false));
  }, [jobId]);

  return (
    !loading && (
      <div>
        <h1 className='title is-2'>{job.title}</h1>
        <h2 className='subtitle is-4'>
          <Link to={`/companies/${job.company.id}`}>{job.company.name}</Link>
        </h2>
        <div className='box'>
          <div className='block has-text-grey'>Posted: {formatDate(job.date, 'long')}</div>
          <p className='block'>{job.description}</p>
        </div>
      </div>
    )
  );
}

export default JobPage;
